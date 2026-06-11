import { useEffect } from "react";

interface Props {
  togglePlay: () => void;
  seek: (t: number) => void;
  currentTime: number;
  loopStart: number;
  loopEnd: number;
  setLoopStart: (v: number) => void;
  setLoopEnd: (v: number) => void;
  speed: number;
  setSpeed: (v: number) => void;
  speeds: readonly number[];
  drillMode: boolean;
  goNextDrillSegment: () => void;
  goPrevDrillSegment: () => void;
}

const isTyping = (e: KeyboardEvent) =>
  ["INPUT", "TEXTAREA", "SELECT"].includes((e.target as Element).tagName);

export function usePlayerKeyboard({
  togglePlay,
  seek,
  currentTime,
  loopStart,
  loopEnd,
  setLoopStart,
  setLoopEnd,
  speed,
  setSpeed,
  speeds,
  drillMode,
  goNextDrillSegment,
  goPrevDrillSegment,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (e.shiftKey) {
            seek(loopStart);
          } else if (drillMode) {
            goPrevDrillSegment();
          } else {
            seek(currentTime - 5);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (drillMode) {
            goNextDrillSegment();
          } else {
            seek(currentTime + 5);
          }
          break;
        case "ArrowUp":
          if (drillMode) {
            e.preventDefault();
            goPrevDrillSegment();
          }
          break;
        case "ArrowDown":
          if (drillMode) {
            e.preventDefault();
            goNextDrillSegment();
          }
          break;
        case "[":
          setLoopStart(Math.max(0, loopStart - 0.5));
          break;
        case "]":
          setLoopEnd(loopEnd + 0.5);
          break;
        case "-":
        case "_": {
          const idx = speeds.indexOf(speed);
          if (idx > 0) setSpeed(speeds[idx - 1]);
          break;
        }
        case "+":
        case "=": {
          const idx = speeds.indexOf(speed);
          if (idx < speeds.length - 1) setSpeed(speeds[idx + 1]);
          break;
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    togglePlay,
    seek,
    currentTime,
    loopStart,
    loopEnd,
    setLoopStart,
    setLoopEnd,
    speed,
    setSpeed,
    speeds,
    drillMode,
    goNextDrillSegment,
    goPrevDrillSegment,
  ]);
}
