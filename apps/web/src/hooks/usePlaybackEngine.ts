import { useEffect, useRef, useState, type RefObject } from "react";
import type { MediaLike } from "../lib/media";

export interface LoopRegion {
  start: number;
  end: number;
}

interface Options {
  mediaRef: RefObject<MediaLike | null>;
  loop: LoopRegion | null;
  loopEnabled: boolean;
  /** 0 means loop forever. */
  repeatCount: number;
  playing: boolean;
  /** Called when a finite repeat cycle completes (instead of just pausing). */
  onRepeatsDone?: () => void;
  /** Seconds to pause after each rep (and before onRepeatsDone). 0 = no pause. */
  loopDelay?: number;
}

/**
 * Single requestAnimationFrame clock that drives the UI time display,
 * detects duration, and implements the A-B loop: when currentTime
 * crosses the loop end it seeks back to the start, pausing once the
 * configured number of repetitions has been played.
 */
export function usePlaybackEngine({
  mediaRef,
  loop,
  loopEnabled,
  repeatCount,
  playing,
  onRepeatsDone,
  loopDelay = 0,
}: Options) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repsDone, setRepsDone] = useState(0);
  const repsRef = useRef(0);
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep a stable ref so the rAF closure always calls the latest callback.
  const onRepeatsDoneRef = useRef(onRepeatsDone);
  onRepeatsDoneRef.current = onRepeatsDone;

  // Reset the repetition counter whenever the loop region changes.
  useEffect(() => {
    repsRef.current = 0;
    setRepsDone(0);
  }, [loop?.start, loop?.end, loopEnabled, repeatCount]);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const media = mediaRef.current;
      if (media) {
        const t = media.currentTime;
        setCurrentTime(t);

        if (Number.isFinite(media.duration) && media.duration > 0) {
          setDuration((d) => (d === media.duration ? d : media.duration));
        }

        if (playing && loopEnabled && loop && loop.end > loop.start) {
          if (t >= loop.end) {
            repsRef.current += 1;
            setRepsDone(repsRef.current);
            if (repeatCount > 0 && repsRef.current >= repeatCount) {
              // Cycle complete — pause, seek, then notify caller (after delay if set).
              media.pause();
              media.currentTime = loop.start;
              repsRef.current = 0;
              setRepsDone(0);
              if (loopDelay > 0) {
                delayTimerRef.current = setTimeout(() => {
                  delayTimerRef.current = null;
                  onRepeatsDoneRef.current?.();
                }, loopDelay * 1000);
              } else {
                onRepeatsDoneRef.current?.();
              }
            } else if (loopDelay > 0) {
              // Pause between reps — seek first so the next tick doesn't re-fire.
              media.pause();
              media.currentTime = loop.start;
              delayTimerRef.current = setTimeout(() => {
                delayTimerRef.current = null;
                if (mediaRef.current) void mediaRef.current.play();
              }, loopDelay * 1000);
            } else {
              media.currentTime = loop.start;
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (delayTimerRef.current !== null) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [mediaRef, loop, loopEnabled, repeatCount, playing, loopDelay]);

  return { currentTime, duration, repsDone };
}
