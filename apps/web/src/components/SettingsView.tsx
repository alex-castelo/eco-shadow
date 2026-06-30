import { loadSettings, type Provider, type Settings, saveSettings } from "@echoshadow/core";
import { useState } from "react";
import { useVoices } from "../hooks/useVoices";
import { sortVoicesForPicker } from "../lib/voices";

export function SettingsView() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [saved, setSaved] = useState(false);
  const voices = useVoices();
  const { recommended, others } = sortVoicesForPicker(voices);

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
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100 placeholder-zinc-400 focus:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        />
        <p className="text-xs text-zinc-500">
          {settings.provider === "groq" ? (
            <>Get a free key at console.groq.com — Whisper large v3 turbo.</>
          ) : (
            <>Get a key at platform.openai.com — whisper-1.</>
          )}
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="tts-voice" className="text-sm font-medium text-zinc-300">
          TTS Voice (Drill tab)
        </label>
        <select
          id="tts-voice"
          value={settings.voiceName}
          onChange={(e) => update({ voiceName: e.target.value })}
          disabled={voices.length === 0}
          className={`w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${voices.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          <option value="">Auto (best available)</option>
          {recommended.length > 0 && (
            <optgroup label="Recommended — natural">
              {recommended.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </optgroup>
          )}
          {others.length > 0 && (
            <optgroup label="Other voices">
              {others.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <p className="text-xs text-zinc-500">
          Voices come from your browser/OS and vary in quality. "Auto" picks the most natural one
          available. For the best quality, install a premium voice pack:
        </p>
        <ul className="ml-4 list-disc space-y-0.5 text-xs text-zinc-500">
          <li>
            <span className="text-zinc-400">macOS / iOS:</span> System Settings → Accessibility →
            Spoken Content → System Voice → Manage Voices, then download an "(Enhanced)" or
            "(Premium)" voice.
          </li>
          <li>
            <span className="text-zinc-400">Windows:</span> Settings → Time &amp; Language → Speech
            → Add voices (the "Natural" voices sound best).
          </li>
          <li>
            <span className="text-zinc-400">Chrome / Edge:</span> the "Google" and "… (Natural)"
            voices are highest quality but require an internet connection.
          </li>
        </ul>
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
