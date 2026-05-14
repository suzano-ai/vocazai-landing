"use client";

import { useState } from "react";
import { formatDuration, formatCurrency } from "@/lib/utils";
import { ChevronDown, ExternalLink, Mic } from "lucide-react";

type TranscriptTurn = { role: string; text: string; startMs?: number; endMs?: number };

type Call = {
  id: string;
  started_at: string | null;
  status: string | null;
  direction: string | null;
  from_number: string | null;
  to_number: string | null;
  duration_sec: number | null;
  cost_usd: number | null;
  provider: string | null;
  transcript: TranscriptTurn[] | null;
  recording_url: string | null;
  ended_reason: string | null;
};

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "unknown";
  const styles: Record<string, string> = {
    completed: "bg-saffron-50 text-saffron-700",
    failed:    "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
    active:    "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    ringing:   "bg-purple-50 text-purple-700",
  };
  const dotColors: Record<string, string> = {
    completed: "bg-saffron-500",
    failed:    "bg-red-500",
    active:    "bg-blue-500",
    ringing:   "bg-purple-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs ${styles[s] ?? "bg-muted text-muted-foreground"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[s] ?? "bg-muted-foreground"}`} />
      {s}
    </span>
  );
}

export function CallRow({ call }: { call: Call }) {
  const [open, setOpen] = useState(false);
  const hasTranscript = call.transcript && call.transcript.length > 0;

  return (
    <>
      <tr
        className={`border-b border-border/60 transition-colors duration-150 ${hasTranscript ? "cursor-pointer hover:bg-surface/40" : "opacity-80"}`}
        onClick={() => hasTranscript && setOpen((v) => !v)}
      >
        <td className="px-5 py-4 text-xs text-muted-foreground">
          {call.started_at
            ? new Date(call.started_at).toLocaleString("fr-MA", {
                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
              })
            : "—"}
        </td>
        <td className="px-5 py-4">
          <div className="font-mono text-xs">
            <span className="text-muted-foreground">{call.direction === "outbound" ? "→" : "←"} </span>
            {call.from_number ?? "?"}
            {call.to_number && (
              <span className="text-muted-foreground"> → {call.to_number}</span>
            )}
          </div>
        </td>
        <td className="px-5 py-4">{formatDuration(call.duration_sec)}</td>
        <td className="px-5 py-4 text-sm">{formatCurrency(call.cost_usd)}</td>
        <td className="px-5 py-4">
          <StatusBadge status={call.status} />
        </td>
        <td className="px-5 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="font-mono text-[10px] text-muted-foreground/70 uppercase">{call.provider}</span>
            {hasTranscript && (
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </td>
      </tr>

      {/* ── Transcript drawer ────────────────────────────────────────────── */}
      {open && hasTranscript && (
        <tr className="border-b border-border/60 bg-surface/30">
          <td colSpan={6} className="px-6 py-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Mic className="h-3.5 w-3.5" />
                Transcription
              </h3>
              <div className="flex items-center gap-3">
                {call.ended_reason && (
                  <span className="text-xs text-muted-foreground">
                    Fin : {call.ended_reason}
                  </span>
                )}
                {call.recording_url && (
                  <a
                    href={call.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-saffron-600 hover:text-saffron-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Écouter
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {(call.transcript as TranscriptTurn[]).map((turn, i) => (
                <div key={i} className={`flex gap-2.5 ${turn.role === "user" ? "justify-end" : ""}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    turn.role === "agent"
                      ? "bg-saffron-500/10 text-foreground rounded-tl-sm"
                      : turn.role === "user"
                      ? "bg-elevated border border-border text-foreground rounded-tr-sm"
                      : "bg-muted text-muted-foreground text-xs rounded-sm"
                  }`}>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {turn.role === "agent" ? "Yasmine" : turn.role === "user" ? "Client" : turn.role}
                    </div>
                    {turn.text}
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
