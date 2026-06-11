import type { Settings, TranscriptWord, TranscriptSegment } from "./types";

export interface TranscriptionResult {
  text: string;
  language?: string;
  words: TranscriptWord[];
  segments: TranscriptSegment[];
}

interface VerboseJsonResponse {
  text?: string;
  language?: string;
  words?: { word: string; start: number; end: number }[];
  segments?: { start: number; end: number; text: string }[];
}

const ENDPOINTS = {
  groq: "https://api.groq.com/openai/v1/audio/transcriptions",
  openai: "https://api.openai.com/v1/audio/transcriptions",
} as const;

const MODELS = {
  groq: "whisper-large-v3-turbo",
  openai: "whisper-1",
} as const;

/**
 * Sends an audio blob straight from the browser to the user's chosen
 * Whisper-compatible API. The API key never leaves the user's machine
 * except to reach the provider itself.
 */
export async function transcribeAudio(
  blob: Blob,
  fileName: string,
  settings: Settings,
): Promise<TranscriptionResult> {
  if (!settings.apiKey) {
    throw new Error("No API key configured. Add one in Settings first.");
  }

  const form = new FormData();
  form.append("file", blob, fileName);
  form.append("model", MODELS[settings.provider]);
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  form.append("timestamp_granularities[]", "segment");

  const res = await fetch(ENDPOINTS[settings.provider], {
    method: "POST",
    headers: { Authorization: `Bearer ${settings.apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Transcription failed (HTTP ${res.status}). ${detail.slice(0, 300)}`,
    );
  }

  const data = (await res.json()) as VerboseJsonResponse;
  const words: TranscriptWord[] = (data.words ?? []).map((w) => ({
    word: w.word.trim(),
    start: w.start,
    end: w.end,
  }));
  const segments: TranscriptSegment[] = (data.segments ?? []).map((s) => ({
    start: s.start,
    end: s.end,
    text: s.text.trim(),
  }));

  return {
    text: data.text ?? segments.map((s) => s.text).join(" "),
    language: data.language,
    words,
    segments,
  };
}
