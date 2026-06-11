import type { Settings, Provider } from "./types";

const STORAGE_KEY = "echoshadow.settings";

const DEFAULTS: Settings = {
  provider: "groq",
  apiKey: "",
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      provider: parsed.provider === "openai" ? "openai" : "groq",
      apiKey: typeof parsed.apiKey === "string" ? parsed.apiKey : "",
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function providerLabel(provider: Provider): string {
  return provider === "groq" ? "Groq" : "OpenAI";
}
