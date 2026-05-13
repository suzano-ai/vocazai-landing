/**
 * VocazAI - Voice Provider Abstraction Layer
 *
 * Defines a provider-agnostic interface so the rest of the app does not
 * depend on Vapi or Retell directly. Each adapter is responsible for
 * translating between this normalized schema and the provider's API.
 *
 * Adding a new provider = implementing IVoiceProvider + registering it
 * in factory.ts. No other code should need to change.
 */

export type ProviderId = "vapi" | "retell";

export type Locale = "fr" | "en" | "ar" | "es" | "pt" | "it" | "de";

export type AgentDirection = "inbound" | "outbound" | "both";

export interface AgentConfig {
  id: string;
  provider: ProviderId;
  providerAgentId?: string | null;

  name: string;
  direction: AgentDirection;
  locale: Locale;

  systemPrompt: string;
  firstMessage: string;

  voice: {
    vendor: "elevenlabs" | "openai" | "deepgram" | "playht" | "azure" | "cartesia";
    voiceId: string;
    speed?: number;
    stability?: number;
  };

  llm: {
    model: string;
    temperature?: number;
    maxTokens?: number;
  };

  transcriber: {
    vendor: "deepgram" | "whisper" | "gladia" | "azure";
    model?: string;
    language?: Locale | "auto";
  };

  tools?: AgentTool[];
  maxDurationSec?: number;
  endpointingMs?: number;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  webhookUrl?: string;
}

export interface OutboundCallRequest {
  agentId: string;
  toNumber: string;
  fromNumber?: string;
  variables?: Record<string, string | number | boolean>;
  metadata?: Record<string, unknown>;
}

export type CallStatus =
  | "queued"
  | "ringing"
  | "in-progress"
  | "completed"
  | "failed"
  | "no-answer"
  | "busy"
  | "canceled";

export interface NormalizedCall {
  id: string;
  providerCallId: string;
  provider: ProviderId;
  agentId: string;
  direction: "inbound" | "outbound";
  status: CallStatus;
  fromNumber: string | null;
  toNumber: string | null;
  startedAt: string | null;
  endedAt: string | null;
  durationSec: number | null;
  recordingUrl: string | null;
  transcript: TranscriptTurn[];
  costUsd: number | null;
  endedReason: string | null;
  metadata: Record<string, unknown>;
}

export interface TranscriptTurn {
  role: "user" | "agent" | "system" | "tool";
  text: string;
  startMs?: number;
  endMs?: number;
}

export interface NormalizedWebhookEvent {
  type:
    | "call.started"
    | "call.ended"
    | "transcript.partial"
    | "transcript.final"
    | "tool.invocation"
    | "status.update"
    | "unknown";
  providerCallId: string;
  provider: ProviderId;
  receivedAt: string;
  raw: unknown;
  call?: Partial<NormalizedCall>;
}

export interface IVoiceProvider {
  readonly id: ProviderId;

  createAgent(config: AgentConfig): Promise<{ providerAgentId: string }>;
  updateAgent(providerAgentId: string, config: AgentConfig): Promise<void>;
  deleteAgent(providerAgentId: string): Promise<void>;

  attachPhoneNumber(providerAgentId: string, phoneNumberId: string): Promise<void>;
  detachPhoneNumber(providerAgentId: string, phoneNumberId: string): Promise<void>;

  startOutboundCall(req: OutboundCallRequest, agent: AgentConfig): Promise<{ providerCallId: string }>;
  getCall(providerCallId: string): Promise<NormalizedCall>;

  verifyWebhookSignature(body: string, headers: Record<string, string>): boolean;
  parseWebhook(payload: unknown): NormalizedWebhookEvent;
}

export class UnsupportedOperationError extends Error {
  constructor(provider: ProviderId, op: string) {
    super(`Provider "${provider}" does not support operation: ${op}`);
    this.name = "UnsupportedOperationError";
  }
}

export class ProviderApiError extends Error {
  constructor(
    public provider: ProviderId,
    public statusCode: number,
    message: string,
    public payload?: unknown
  ) {
    super(`[${provider}] ${statusCode}: ${message}`);
    this.name = "ProviderApiError";
  }
}
