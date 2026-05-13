import crypto from "node:crypto";
import {
  AgentConfig,
  IVoiceProvider,
  NormalizedCall,
  NormalizedWebhookEvent,
  OutboundCallRequest,
  ProviderApiError,
  TranscriptTurn,
} from "./types";

/**
 * Vapi adapter — https://docs.vapi.ai
 *
 * Webhook signing: HMAC-SHA256 with VAPI_WEBHOOK_SECRET on the raw body.
 * Header: x-vapi-signature
 */
const VAPI_BASE = "https://api.vapi.ai";

export class VapiProvider implements IVoiceProvider {
  readonly id = "vapi" as const;

  constructor(private readonly cfg: { apiKey: string; webhookSecret?: string }) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${VAPI_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.cfg.apiKey}`,
        ...(init.headers || {}),
      },
      cache: "no-store",
    });
    const text = await res.text();
    const payload = text ? JSON.parse(text) : null;
    if (!res.ok) {
      throw new ProviderApiError("vapi", res.status, payload?.message ?? res.statusText, payload);
    }
    return payload as T;
  }

  private toVapiAssistant(agent: AgentConfig): Record<string, unknown> {
    return {
      name: agent.name,
      firstMessage: agent.firstMessage,
      model: {
        provider: "openai",
        model: agent.llm.model,
        temperature: agent.llm.temperature ?? 0.4,
        maxTokens: agent.llm.maxTokens ?? 250,
        messages: [{ role: "system", content: agent.systemPrompt }],
        tools: agent.tools?.map((t) => ({
          type: "function",
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          },
          server: t.webhookUrl ? { url: t.webhookUrl } : undefined,
        })),
      },
      voice: {
        provider: agent.voice.vendor,
        voiceId: agent.voice.voiceId,
        speed: agent.voice.speed,
        stability: agent.voice.stability,
      },
      transcriber: {
        provider: agent.transcriber.vendor,
        model: agent.transcriber.model,
        language: agent.transcriber.language === "auto" ? undefined : agent.transcriber.language,
      },
      maxDurationSeconds: agent.maxDurationSec,
      endCallFunctionEnabled: true,
      recordingEnabled: true,
      metadata: { vocazaiAgentId: agent.id, locale: agent.locale },
    };
  }

  async createAgent(config: AgentConfig): Promise<{ providerAgentId: string }> {
    const body = this.toVapiAssistant(config);
    const res = await this.request<{ id: string }>("/assistant", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { providerAgentId: res.id };
  }

  async updateAgent(providerAgentId: string, config: AgentConfig): Promise<void> {
    await this.request(`/assistant/${providerAgentId}`, {
      method: "PATCH",
      body: JSON.stringify(this.toVapiAssistant(config)),
    });
  }

  async deleteAgent(providerAgentId: string): Promise<void> {
    await this.request(`/assistant/${providerAgentId}`, { method: "DELETE" });
  }

  async attachPhoneNumber(providerAgentId: string, phoneNumberId: string): Promise<void> {
    await this.request(`/phone-number/${phoneNumberId}`, {
      method: "PATCH",
      body: JSON.stringify({ assistantId: providerAgentId }),
    });
  }

  async detachPhoneNumber(_providerAgentId: string, phoneNumberId: string): Promise<void> {
    await this.request(`/phone-number/${phoneNumberId}`, {
      method: "PATCH",
      body: JSON.stringify({ assistantId: null }),
    });
  }

  async startOutboundCall(req: OutboundCallRequest, agent: AgentConfig): Promise<{ providerCallId: string }> {
    if (!agent.providerAgentId) throw new Error("Agent has not been deployed to Vapi yet");
    if (!req.fromNumber) throw new Error("Outbound call requires fromNumber");
    const res = await this.request<{ id: string }>("/call", {
      method: "POST",
      body: JSON.stringify({
        assistantId: agent.providerAgentId,
        customer: { number: req.toNumber },
        phoneNumber: { number: req.fromNumber },
        assistantOverrides: req.variables ? { variableValues: req.variables } : undefined,
        metadata: { vocazaiAgentId: agent.id, ...(req.metadata ?? {}) },
      }),
    });
    return { providerCallId: res.id };
  }

  async getCall(providerCallId: string): Promise<NormalizedCall> {
    const raw = await this.request<any>(`/call/${providerCallId}`);
    return this.normalizeCall(raw);
  }

  verifyWebhookSignature(body: string, headers: Record<string, string>): boolean {
    if (!this.cfg.webhookSecret) return true;
    const signature = headers["x-vapi-signature"] || headers["X-Vapi-Signature"];
    if (!signature) return false;
    const expected = crypto.createHmac("sha256", this.cfg.webhookSecret).update(body).digest("hex");
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    } catch {
      return false;
    }
  }

  parseWebhook(payload: unknown): NormalizedWebhookEvent {
    const p = payload as any;
    const message = p?.message ?? p;
    const type = message?.type as string | undefined;
    const callObj = message?.call;
    const providerCallId = callObj?.id ?? message?.callId ?? "";

    let normalizedType: NormalizedWebhookEvent["type"] = "unknown";
    switch (type) {
      case "status-update":
        normalizedType = "status.update";
        break;
      case "end-of-call-report":
        normalizedType = "call.ended";
        break;
      case "transcript":
        normalizedType = message?.transcriptType === "final" ? "transcript.final" : "transcript.partial";
        break;
      case "function-call":
      case "tool-calls":
        normalizedType = "tool.invocation";
        break;
      case "speech-update":
      case "conversation-update":
        normalizedType = "transcript.partial";
        break;
    }

    return {
      type: normalizedType,
      providerCallId,
      provider: "vapi",
      receivedAt: new Date().toISOString(),
      raw: payload,
      call: callObj ? this.tryNormalizeCall(callObj) : undefined,
    };
  }

  private tryNormalizeCall(raw: any): Partial<NormalizedCall> | undefined {
    try {
      return this.normalizeCall(raw);
    } catch {
      return undefined;
    }
  }

  private normalizeCall(raw: any): NormalizedCall {
    const transcript: TranscriptTurn[] = Array.isArray(raw.messages)
      ? raw.messages
          .filter((m: any) => m.role && m.message)
          .map((m: any) => ({
            role: m.role === "bot" ? "agent" : m.role,
            text: m.message,
            startMs: m.time,
            endMs: m.endTime,
          }))
      : [];
    return {
      id: raw?.metadata?.vocazaiCallId ?? "",
      providerCallId: raw.id,
      provider: "vapi",
      agentId: raw?.metadata?.vocazaiAgentId ?? raw.assistantId ?? "",
      direction: raw.type === "outboundPhoneCall" ? "outbound" : "inbound",
      status: mapVapiStatus(raw.status),
      fromNumber: raw?.phoneNumber?.number ?? raw?.phoneCallProviderDetails?.from ?? null,
      toNumber: raw?.customer?.number ?? null,
      startedAt: raw.startedAt ?? null,
      endedAt: raw.endedAt ?? null,
      durationSec: raw.endedAt && raw.startedAt
        ? Math.round((Date.parse(raw.endedAt) - Date.parse(raw.startedAt)) / 1000)
        : null,
      recordingUrl: raw.recordingUrl ?? raw.stereoRecordingUrl ?? null,
      transcript,
      costUsd: typeof raw.cost === "number" ? raw.cost : null,
      endedReason: raw.endedReason ?? null,
      metadata: raw.metadata ?? {},
    };
  }
}

function mapVapiStatus(status?: string): NormalizedCall["status"] {
  switch (status) {
    case "queued": return "queued";
    case "ringing": return "ringing";
    case "in-progress": return "in-progress";
    case "ended":
    case "completed": return "completed";
    case "no-answer": return "no-answer";
    case "busy": return "busy";
    case "failed": return "failed";
    case "canceled": return "canceled";
    default: return "in-progress";
  }
}
