import { IVoiceProvider, ProviderId } from "./types";
import { VapiProvider } from "./vapi";
import { RetellProvider } from "./retell";

export function getProvider(id: ProviderId): IVoiceProvider {
  switch (id) {
    case "vapi": {
      const apiKey = process.env.VAPI_API_KEY;
      const webhookSecret = process.env.VAPI_WEBHOOK_SECRET;
      if (!apiKey) throw new Error("VAPI_API_KEY is not set");
      return new VapiProvider({ apiKey, webhookSecret });
    }
    case "retell": {
      const apiKey = process.env.RETELL_API_KEY;
      const webhookSecret = process.env.RETELL_WEBHOOK_SECRET;
      if (!apiKey) throw new Error("RETELL_API_KEY is not set");
      return new RetellProvider({ apiKey, webhookSecret });
    }
    default: {
      const _exhaustive: never = id;
      throw new Error(`Unknown provider: ${_exhaustive}`);
    }
  }
}

export function listEnabledProviders(): ProviderId[] {
  const ids: ProviderId[] = [];
  if (process.env.VAPI_API_KEY) ids.push("vapi");
  if (process.env.RETELL_API_KEY) ids.push("retell");
  return ids;
}
