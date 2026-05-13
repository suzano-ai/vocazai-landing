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
 * Retell adapter — https://docs.retellai.com
 *
 * Retell separates Agent (voice/transcriber) from LLM (prompt config).
 * createAgent here:
 *   1. POST /create-retell-llm  -> llm_id
 *   2. POST /create-agent       -> agent_id (linked to llm_id)
 * Webhook signature: X-Retell-Signature, HMAC-SHA256.
 */
const RETELL_BASE = "https://api.retellai.com";

export class RetellProvider implements IVoiceProvider {
  readonly id = "retell" as const;

  constructor(private readonly cfg: { apiKey: string; webhookSecret?: string }) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${RETELL_BASE}${path}`, {
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
      throw new ProviderApiError("retell", res.status, payload?.message ?? res.statusText, payload);
    }
    return payload as T;
  }

  async createAgent(config: AgentConfig): Promise<{ providerAgentId: string }> {
    const llm = await this.request<{ llm_id: string }>("/create-retell-llm", {
      method: "POST",
      body: JSON.stringify({
        model: config.llm.model,
        general_prompt: config.systemPrompt,
        begin_message: config.firstMessage,
        general_tools: config.tools?.map((t) => ({
          type: "custom",
          name: t.name,
          description: t.description,
          parameters: t.parameters,
          url: t.webhookUrl,
        })),
      }),
    });

    const agent = await this.request<{ agent_id: string }>("/create-agent", {
      method: "POST",
      body: JSON.stringify({
        agent_name: config.name,
        response_engine: { type: "retell-llm", llm_id: llm.llm_id },
        voice_id: config.voice.voiceId,
        voice_speed: config.voice.speed ?? 1.0,
        voice_temperature: config.voice.stability,
        language: mapLocaleToRetell(config.locale),
        max_call_duration_ms: config.maxDurationSec ? config.maxDurationSec * 1000 : undefined,
        end_call_after_silence_ms: config.endpointingMs,
        metadata: { vocazaiAgentId: config.id, llmId: llm.llm_id },
      }),
    });

    return { providerAgentId: agent.agent_id };
  }

  async updateAgent(providerAgentId: string, config: AgentConfig): Promise<void> {
    const agent = await this.request<any>(`/get-agent/${providerAgentId}`);
    const llmId = agent?.response_engine?.llm_id;

    if (llmId) {
      await this.request(`/update-retell-llm/${llmId}`, {
        method: "PATCH",
        body: JSON.stringify({
          model: config.llm.model,
          general_prompt: config.systemPrompt,
          begin_message: config.firstMessage,
        }),
      });
    }

    await this.request(`/update-agent/${providerAgentId}`, {
      method: "PATCH",
      body: JSON.stringify({
        agent_name: config.name,
        voice_id: config.voice.voiceId,
        voice_speed: config.voice.speed,
        language: mapLocaleToRetell(config.locale),
      }),
    });
  }

  async deleteAgent(providerAgentId: string): Promise<void> {
    await this.request(`/delete-agent/${providerAgentId}`, { method: "DELETE" });
  }

  async attachPhoneNumber(providerAgentId: string, phoneNumberId: string): Promise<void> {
    await this.request(`/update-phone-number/${phoneNumberId}`, {
      method: "PATCH",
      body: JSON.stringify({ inbound_agent_id: providerAgentId }),
    });
  }

  async detachPhoneNumber(_providerAgentId: string, phoneNumberId: string): Promise<void> {
    await this.request(`/update-phone-number/${phoneNumberId}`, {
      method: "PATCH",
      body: JSON.stringify({ inbound_agent_id: null }),
    });
  }

  async startOutboundCall(req: OutboundCallRequest, agent: AgentConfig): Promise<{ providerCallId: string }> {
    if (!agent.providerAgentId) throw new Error("Agent has not been deployed to Retell yet");
    if (!req.fromNumber) throw new Error("Outbound call requires fromNumber");
    const res = await this.request<{ call_id: string }>("/create-phone-call", {
      method: "POST",
      body: JSON.stringify({
        from_number: req.fromNumber,
        to_number: req.toNumber,
        override_agent_id: agent.providerAgentId,
        retell_llm_dynamic_variables: req.variables,
        metadata: { vocazaiAgentId: agent.id, ...(req.metadata ?? {}) },
      }),
    });
    return { providerCallId: res.call_id };
  }

  async getCall(providerCallId: string): Promise<NormalizedCall> {
    const raw = await this.request<any>(`/get-call/${providerCallId}`);
    return this.normalizeCall(raw);
  }

  verifyWebhookSignature(body: string, headers: Record<string, string>): boolean {
    if (!this.cfg.webhookSecret) return true;
    const signature = headers["x-retell-signature"] || headers["X-Retell-Signature"];
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
    const eventType = p?.event as string | undefined;
    const call = p?.call ?? p?.data?.call;
    const providerCallId = call?.call_id ?? "";

    let normalizedType: NormalizedWebhookEvent["type"] = "unknown";
    switch (eventType) {
      case "call_started": normalizedType = "call.started"; break;
      case "call_ended": normalizedType = "call.ended"; break;
      case "call_analyzed": normalizedType = "status.update"; break;
    }

    return {
      type: normalizedType,
      providerCallId,
      provider: "retell",
      receivedAt: new Date().toISOString(),
      raw: payload,
      call: call ? this.tryNormalizeCall(call) : undefined,
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
    const transcript: TranscriptTurn[] = Array.isArray(raw.transcript_object)
      ? raw.transcript_object.map((t: any) => ({
          role: t.role === "agent" ? "agent" : "user",
          text: t.content,
          startMs: t.words?.[0]?.start ? Math.round(t.words[0].start * 1000) : undefined,
          endMs: t.words?.at(-1)?.end ? Math.round(t.words.at(-1).end * 1000) : undefined,
        }))
      : [];
    const startedAt = raw.start_timestamp ? new Date(raw.start_timestamp).toISOString() : null;
    const endedAt = raw.end_timestamp ? new Date(raw.end_timestamp).toISOString() : null;
    return {
      id: raw?.metadata?.vocazaiCallId ?? "",
      providerCallId: raw.call_id,
      provider: "retell",
      agentId: raw?.metadata?.vocazaiAgentId ?? raw.agent_id ?? "",
      direction: raw.direction === "outbound" ? "outbound" : "inbound",
      status: mapRetellStatus(raw.call_status),
      fromNumber: raw.from_number ?? null,
      toNumber: raw.to_number ?? null,
      startedAt,
      endedAt,
      durationSec: startedAt && endedAt
        ? Math.round((Date.parse(endedAt) - Date.parse(startedAt)) / 1000)
        : null,
      recordingUrl: raw.recording_url ?? null,
      transcript,
      costUsd: typeof raw?.call_cost?.combined_cost === "number" ? raw.call_cost.combined_cost / 100 : null,
      endedReason: raw.disconnection_reason ?? null,
      metadata: raw.metadata ?? {},
    };
  }
}

function mapRetellStatus(status?: string): NormalizedCall["status"] {
  switch (status) {
    case "registered": return "queued";
    case "ongoing": return "in-progress";
    case "ended": return "completed";
    case "error": return "failed";
    default: return "in-progress";
  }
}

function mapLocaleToRetell(locale: string): string {
  const map: Record<string, string> = {
    fr: "fr-FR",
    en: "en-US",
    ar: "ar-SA",
    es: "es-ES",
    pt: "pt-PT",
    it: "it-IT",
    de: "de-DE",
  };
  return map[locale] ?? "en-US";
}
