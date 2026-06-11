import { loadSettings, saveSettings } from "@echoshadow/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTTS } from "../hooks/useTTS";

const SPEEDS = [0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2];

function splitIntoSentences(text: string): string[] {
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 2);
}

export function DrillView() {
  const initialSettings = loadSettings();
  const [rawText, setRawText] = useState(initialSettings.drillText);
  const [mode, setMode] = useState<"edit" | "drill">("edit");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);

  const sentences = useMemo(() => splitIntoSentences(rawText), [rawText]);

  const currentSentence = sentences[currentIndex] ?? "";

  const { speak, cancel } = useTTS({
    text: currentSentence,
    voiceName: loadSettings().voiceName,
    rate: speed,
  });

  const prevIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode !== "drill") return;
    if (prevIndexRef.current === currentIndex) return;
    prevIndexRef.current = currentIndex;
    speak();
  }, [mode, currentIndex, speak]);

  const startDrill = () => {
    if (sentences.length === 0) return;
    setCurrentIndex(0);
    prevIndexRef.current = null;
    setMode("drill");
  };

  const stopDrill = () => {
    cancel();
    setMode("edit");
  };

  const goNext = () => {
    if (currentIndex >= sentences.length - 1) {
      cancel();
      setMode("edit");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleTextChange = (value: string) => {
    setRawText(value);
    const settings = loadSettings();
    saveSettings({ ...settings, drillText: value });
  };

  if (mode === "edit") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Text Drill</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Paste any text below and practice shadowing phrase by phrase with TTS.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Each phrase is separated by a new line — the TTS reads one phrase at a time. Shadow it
            aloud, then press <span className="text-zinc-300">Next</span> to advance or{" "}
            <span className="text-zinc-300">Repeat</span> to hear it again.
          </p>
        </div>

        <textarea
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Paste your text here…"
          rows={10}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-400 focus:outline-none resize-none"
        />

        <button
          type="button"
          onClick={startDrill}
          disabled={sentences.length === 0}
          className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-40"
        >
          Start Drill
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Text Drill</h2>
        <span className="text-sm text-zinc-400">
          {currentIndex + 1} / {sentences.length}
        </span>
      </div>

      <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        {sentences.map((sentence, i) => {
          let cls = "text-zinc-400 ";
          if (i === currentIndex) cls = "rounded-lg bg-zinc-700 px-2 py-1 text-zinc-100 ";
          else if (i < currentIndex) cls = "text-zinc-500 ";
          return (
            <p key={`s-${i}`} className={`text-sm leading-relaxed ${cls}`}>
              {sentence}.
            </p>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          Speed
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={speak}
          className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-600"
        >
          🔁 Repeat
        </button>

        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-600 disabled:opacity-40"
        >
          ← Prev
        </button>

        <button
          type="button"
          onClick={goNext}
          className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-600"
        >
          {currentIndex >= sentences.length - 1 ? "Finish" : "Next →"}
        </button>

        <button
          type="button"
          onClick={stopDrill}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
