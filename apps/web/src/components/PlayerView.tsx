import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, loadSettings, transcribeAudio, type Loop } from "@echoshadow/core";
import { usePlaybackEngine } from "../hooks/usePlaybackEngine";
import { formatTime, clamp, type MediaLike } from "../lib/media";
import { Timeline } from "./Timeline";
import { LoopSlider } from "./LoopSlider";
import { TranscriptPanel } from "./TranscriptPanel";
import { Recorder } from "./Recorder";
import { SubtitleBar } from "./SubtitleBar";

interface Props {
  trackId: number;
  onBack: () => void;
}

const SPEEDS = [0.5, 0.65, 0.75, 0.85, 1, 1.25, 1.5, 2];

export function PlayerView({ trackId, onBack }: Props) {
  const track = useLiveQuery(() => db.tracks.get(trackId), [trackId]);
  const loops = useLiveQuery(
    () => db.loops.where("trackId").equals(trackId).toArray(),
    [trackId],
  );
  const transcript = useLiveQuery(
    () => db.transcripts.where("trackId").equals(trackId).first(),
    [trackId],
  );

  const mediaRef = useRef<MediaLike | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);

  const [drillMode, setDrillMode] = useState(false);
  const [drillSegmentIndex, setDrillSegmentIndex] = useState(0);
  const [drillRepsPerSentence, setDrillRepsPerSentence] = useState(3);

  const loop = useMemo(
    () => (loopEnd > loopStart ? { start: loopStart, end: loopEnd } : null),
    [loopStart, loopEnd],
  );

  const segments = useMemo(() => transcript?.segments ?? [], [transcript]);

  const handleDrillRepeatsDone = useCallback(() => {
    const next = drillSegmentIndex + 1;
    setLoopEnabled(false);
    if (next >= segments.length) {
      setDrillMode(false);
    } else {
      setDrillSegmentIndex(next);
    }
  }, [drillSegmentIndex, segments.length]);

  // When the drill segment index advances, seek to new segment and resume.
  useEffect(() => {
    if (!drillMode || segments.length === 0) return;
    const seg = segments[drillSegmentIndex];
    if (!seg || !mediaRef.current) return;
    setLoopStart(seg.start);
    setLoopEnd(seg.end);
    mediaRef.current.currentTime = seg.start;
    setLoopEnabled(true);
    void mediaRef.current.play();
  }, [drillSegmentIndex, drillMode, segments]);

  // Reset drill when changing tracks.
  useEffect(() => {
    setDrillMode(false);
    setDrillSegmentIndex(0);
  }, [trackId]);

  const { currentTime, duration, repsDone } = usePlaybackEngine({
    mediaRef,
    loop,
    loopEnabled,
    repeatCount: drillMode ? drillRepsPerSentence : repeatCount,
    playing,
    onRepeatsDone: drillMode ? handleDrillRepeatsDone : undefined,
    loopDelay: drillMode ? 3 : 0,
  });

  // Object URL for the stored audio blob.
  const audioUrl = useMemo(
    () => (track?.blob ? URL.createObjectURL(track.blob) : null),
    [track?.blob],
  );
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Default the loop region to the whole track once we know its length.
  useEffect(() => {
    if (duration > 0 && loopEnd === 0) setLoopEnd(duration);
  }, [duration, loopEnd]);

  useEffect(() => {
    if (mediaRef.current) mediaRef.current.playbackRate = speed;
  }, [speed, track?.id]);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) return;
    if (media.paused) void media.play();
    else media.pause();
  };

  const seek = (t: number) => {
    const media = mediaRef.current;
    if (media) media.currentTime = clamp(t, 0, duration || t);
  };

  const saveLoop = async () => {
    if (!loop) return;
    await db.loops.add({
      trackId,
      name: `${formatTime(loop.start)} → ${formatTime(loop.end)}`,
      start: loop.start,
      end: loop.end,
      repeatCount,
      createdAt: Date.now(),
    });
  };

  const applyLoop = (l: Loop) => {
    setLoopStart(l.start);
    setLoopEnd(l.end);
    setRepeatCount(l.repeatCount);
    setLoopEnabled(true);
    seek(l.start);
  };

  const startDrill = () => {
    if (segments.length === 0) return;
    const seg = segments[0];
    setDrillSegmentIndex(0);
    setDrillMode(true);
    setLoopStart(seg.start);
    setLoopEnd(seg.end);
    setLoopEnabled(true);
    if (mediaRef.current) {
      mediaRef.current.currentTime = seg.start;
      void mediaRef.current.play();
    }
  };

  const stopDrill = () => {
    setDrillMode(false);
    setLoopEnabled(false);
    mediaRef.current?.pause();
  };

  const goPrevDrillSegment = () => {
    if (drillSegmentIndex > 0) {
      setLoopEnabled(false);
      setDrillSegmentIndex(drillSegmentIndex - 1);
    }
  };

  const goNextDrillSegment = () => {
    if (drillSegmentIndex < segments.length - 1) {
      setLoopEnabled(false);
      setDrillSegmentIndex(drillSegmentIndex + 1);
    }
  };

  const handleTranscribe = async () => {
    if (!track?.blob) return;
    setTranscribeError(null);
    setTranscribing(true);
    try {
      const result = await transcribeAudio(
        track.blob,
        `${track.name}.mp3`,
        loadSettings(),
      );
      await db.transcripts.where("trackId").equals(trackId).delete();
      await db.transcripts.add({
        trackId,
        language: result.language,
        text: result.text,
        words: result.words,
        segments: result.segments,
        createdAt: Date.now(),
      });
    } catch (err) {
      setTranscribeError(err instanceof Error ? err.message : String(err));
    } finally {
      setTranscribing(false);
    }
  };

  if (!track) {
    return <p className="text-zinc-400">Loading track…</p>;
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700"
        >
          ← Library
        </button>
        <h2 className="truncate text-lg font-semibold text-zinc-100">
          {track.name}
        </h2>
      </div>

      {audioUrl && (
        <audio
          ref={(el) => {
            mediaRef.current = el;
          }}
          src={audioUrl}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          preload="metadata"
        />
      )}

      <Timeline
        blob={track.blob}
        duration={duration}
        currentTime={currentTime}
        loop={loop}
        loopEnabled={loopEnabled}
        onSeek={seek}
      />

      {/* Transport controls */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={togglePlay}
          className="h-12 w-12 rounded-full bg-emerald-500 text-xl text-emerald-950 hover:bg-emerald-400"
          title={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <span className="font-mono text-sm text-zinc-300">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
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
      </div>

      {/* Loop controls */}
      <section className={`space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-opacity${drillMode ? " pointer-events-none opacity-40" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
            A-B Loop
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={loopEnabled}
                onChange={(e) => setLoopEnabled(e.target.checked)}
                className="h-4 w-4 accent-emerald-500"
              />
              Loop on
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              Repeats
              <input
                type="number"
                min={0}
                max={99}
                value={repeatCount}
                onChange={(e) =>
                  setRepeatCount(Math.max(0, Number(e.target.value) || 0))
                }
                className="w-16 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm"
                title="0 = repeat forever"
              />
              <span className="text-xs text-zinc-500">(0 = ∞)</span>
            </label>
            {loopEnabled && repeatCount > 0 && (
              <span className="text-sm text-emerald-400">
                {repsDone}/{repeatCount}
              </span>
            )}
            <button
              onClick={() => void saveLoop()}
              className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-600"
            >
              Save loop
            </button>
          </div>
        </div>

        <LoopSlider
          duration={duration}
          start={loopStart}
          end={loopEnd}
          onChange={(s, e) => {
            setLoopStart(s);
            setLoopEnd(e);
          }}
        />

        {loops && loops.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {loops.map((l) => (
              <li
                key={l.id}
                className="flex items-center gap-1 rounded-full bg-zinc-800 py-1 pr-2 pl-3 text-sm"
              >
                <button
                  onClick={() => applyLoop(l)}
                  className="text-zinc-200 hover:text-emerald-300"
                >
                  {l.name}
                  {l.repeatCount > 0 && (
                    <span className="text-zinc-500"> ×{l.repeatCount}</span>
                  )}
                </button>
                <button
                  onClick={() => void db.loops.delete(l.id!)}
                  className="px-1 text-zinc-500 hover:text-red-400"
                  title="Delete loop"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Sentence Drill */}
      {segments.length > 0 && (
        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
              Sentence Drill
            </h3>
            {drillMode ? (
              <button
                onClick={stopDrill}
                className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-600"
              >
                Stop
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  Reps
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={drillRepsPerSentence}
                    onChange={(e) =>
                      setDrillRepsPerSentence(
                        Math.max(1, Number(e.target.value) || 1),
                      )
                    }
                    className="w-14 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm"
                  />
                </label>
                <button
                  onClick={startDrill}
                  className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
                >
                  Start Drill
                </button>
              </div>
            )}
          </div>

          {drillMode ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Sentence {drillSegmentIndex + 1} / {segments.length}
                </span>
                <span className="flex gap-1">
                  {Array.from({ length: drillRepsPerSentence }, (_, i) => (
                    <span
                      key={i}
                      className={`text-sm leading-none ${i < repsDone ? "text-emerald-400" : "text-zinc-700"}`}
                    >
                      ●
                    </span>
                  ))}
                </span>
              </div>
              <p className="rounded-lg bg-zinc-800 px-3 py-2 text-sm leading-relaxed text-zinc-200">
                {segments[drillSegmentIndex]?.text}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={goPrevDrillSegment}
                  disabled={drillSegmentIndex === 0}
                  className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-600 disabled:opacity-40"
                >
                  ← Prev
                </button>
                <button
                  onClick={goNextDrillSegment}
                  disabled={drillSegmentIndex >= segments.length - 1}
                  className="rounded-lg bg-zinc-700 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-600 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Repeat each sentence {drillRepsPerSentence}× automatically before advancing to the next.
            </p>
          )}
        </section>
      )}

      {/* Transcript */}
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
            Transcript
          </h3>
          <button
            onClick={() => void handleTranscribe()}
            disabled={transcribing}
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-emerald-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {transcribing
              ? "Transcribing…"
              : transcript
                ? "Re-transcribe"
                : "Transcribe with AI"}
          </button>
        </div>

        {transcribeError && (
          <p className="text-sm text-red-400">{transcribeError}</p>
        )}

        {transcript ? (
          <TranscriptPanel
            transcript={transcript}
            currentTime={currentTime}
            onSeekWord={seek}
          />
        ) : (
          <p className="text-sm text-zinc-500">
            Transcribe this audio with your own API key (Settings) to get
            karaoke-style highlighting.
          </p>
        )}
      </section>

      {/* Shadowing recorder */}
      <section className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <h3 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
          Shadow &amp; compare
        </h3>
        <p className="text-sm text-zinc-500">
          Record yourself repeating the loop, then play both back to compare.
        </p>
        <Recorder />
      </section>

      <SubtitleBar transcript={transcript} currentTime={currentTime} />
    </div>
  );
}
