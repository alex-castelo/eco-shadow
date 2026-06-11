import { loadSettings, saveSettings } from "@echoshadow/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const { speak, cancel, speaking } = useTTS({
    text: currentSentence,
    voiceName: loadSettings().voiceName,
    rate: speed,
  });

  const prevIndexRef = useRef<number | null>(null);
  const activeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (mode !== "drill") return;
    if (prevIndexRef.current === currentIndex) return;
    prevIndexRef.current = currentIndex;
    speak();
  }, [mode, currentIndex, speak]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: currentIndex is the trigger, activeRef is a stable ref
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentIndex]);

  const startDrill = () => {
    if (sentences.length === 0) return;
    setCurrentIndex(0);
    prevIndexRef.current = null;
    setMode("drill");
  };

  const stopDrill = useCallback(() => {
    cancel();
    setMode("edit");
  }, [cancel]);

  const goNext = useCallback(() => {
    if (currentIndex >= sentences.length - 1) {
      cancel();
      setMode("edit");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, sentences.length, cancel]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const handleTextChange = (value: string) => {
    setRawText(value);
    const settings = loadSettings();
    saveSettings({ ...settings, drillText: value });
  };

  useEffect(() => {
    if (mode !== "drill") return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          speak();
          break;
        case "ArrowRight":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Escape":
          stopDrill();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, speak, goNext, goPrev, stopDrill]);

  if (mode === "edit") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Text Drill</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Paste any text below and practice shadowing phrase by phrase with TTS.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Each phrase is separated by a new line — TTS reads one phrase at a time. Shadow it
            aloud, then press <span className="text-zinc-300">Next</span> to advance or{" "}
            <span className="text-zinc-300">Space</span> to hear it again.
          </p>
        </div>

        <div className="space-y-2">
          <textarea
            value={rawText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste your text here…"
            rows={10}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 resize-none transition-colors"
          />
          {sentences.length > 0 && (
            <p className="tabular-nums text-xs text-zinc-500">
              {sentences.length} phrase{sentences.length !== 1 ? "s" : ""} ready
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={startDrill}
          disabled={sentences.length === 0}
          className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-40 transition-colors"
        >
          Start Drill
        </button>
      </div>
    );
  }

  const progressPct = sentences.length > 0 ? ((currentIndex + 1) / sentences.length) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Header with live speaking indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Text Drill</h2>
        <div className="flex items-center gap-2">
          {speaking && (
            <span
              className="h-2 w-2 rounded-full bg-emerald-400 motion-reduce:animate-none animate-pulse"
              aria-hidden="true"
            />
          )}
          <span className="tabular-nums text-sm text-zinc-400">
            {currentIndex + 1} / {sentences.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full bg-emerald-400 motion-reduce:transition-none transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Sentence list */}
      <div className="max-h-64 space-y-0.5 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 scroll-smooth">
        {sentences.map((sentence, i) => {
          const isActive = i === currentIndex;
          const isPast = i < currentIndex;
          return (
            <p
              key={`s-${i}`}
              ref={isActive ? activeRef : undefined}
              className={[
                "rounded-lg px-2 py-1 text-sm leading-relaxed motion-reduce:transition-none transition-colors duration-200",
                isActive && speaking
                  ? "bg-emerald-500/10 font-medium text-zinc-50"
                  : isActive
                    ? "bg-zinc-800 font-medium text-zinc-100"
                    : isPast
                      ? "text-zinc-600"
                      : "text-zinc-400",
              ].join(" ")}
            >
              {sentence}
            </p>
          );
        })}
      </div>

      {/* Speed pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">Speed</span>
        <div className="flex flex-wrap gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={[
                "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                speed === s ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300",
              ].join(" ")}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={speak}
          className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 transition-colors hover:bg-zinc-600"
        >
          Repeat
        </button>

        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 transition-colors hover:bg-zinc-600 disabled:opacity-40"
        >
          ← Prev
        </button>

        <button
          type="button"
          onClick={goNext}
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          {currentIndex >= sentences.length - 1 ? "Finish" : "Next →"}
        </button>

        <button
          type="button"
          onClick={stopDrill}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
        >
          Stop
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600">
        <span>
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-500">Space</kbd>{" "}
          repeat
        </span>
        <span>
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-500">→</kbd> next
        </span>
        <span>
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-500">←</kbd> prev
        </span>
        <span>
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-500">Esc</kbd> stop
        </span>
      </div>
    </div>
  );
}
