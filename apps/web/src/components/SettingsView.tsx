import { loadSettings, type Provider, type Settings, saveSettings } from "@echoshadow/core";
import { useState } from "react";

export function SettingsView() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">Transcription API</h2>
        <p className="mt-1 text-sm text-zinc-400">
          EchoShadow is local-first: your key is stored only in this browser's localStorage and
          requests go directly from your browser to the provider. Nothing passes through any other
          server.
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-300">Provider</p>
        <div className="flex gap-2">
          {(["groq", "openai"] as Provider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => update({ provider: p })}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                settings.provider === p
                  ? "bg-emerald-500 text-emerald-950"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {p === "groq" ? "Groq (free tier, fast)" : "OpenAI"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="api-key" className="text-sm font-medium text-zinc-300">
          API Key
        </label>
        <input
          id="api-key"
          type="password"
          value={settings.apiKey}
          onChange={(e) => update({ apiKey: e.target.value })}
          placeholder={settings.provider === "groq" ? "gsk_…" : "sk-…"}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-400 focus:outline-none"
        />
        <p className="text-xs text-zinc-500">
          {settings.provider === "groq" ? (
            <>Get a free key at console.groq.com — Whisper large v3 turbo.</>
          ) : (
            <>Get a key at platform.openai.com — whisper-1.</>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
        >
          Save
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved ✓</span>}
      </div>
    </div>
  );
}
