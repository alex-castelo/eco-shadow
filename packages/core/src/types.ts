export interface Track {
  id?: number;
  name: string;
  /** Audio blob for local files. */
  blob: Blob;
  duration?: number;
  createdAt: number;
}

export interface Loop {
  id?: number;
  trackId: number;
  name: string;
  start: number;
  end: number;
  /** 0 means repeat forever. */
  repeatCount: number;
  createdAt: number;
}

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface Transcript {
  id?: number;
  trackId: number;
  language?: string;
  text: string;
  words: TranscriptWord[];
  segments: TranscriptSegment[];
  createdAt: number;
}

export type Provider = "groq" | "openai";

export interface Settings {
  provider: Provider;
  apiKey: string;
}
