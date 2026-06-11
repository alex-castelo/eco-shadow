import { useEffect, useRef, useState } from "react";

/**
 * Records the user's voice with MediaRecorder so they can compare
 * their pronunciation against the loop they are shadowing.
 */
export function Recorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Microphone access denied or unavailable.");
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={recording ? stop : start}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          recording
            ? "bg-red-500 text-white hover:bg-red-400"
            : "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
        }`}
      >
        {recording ? "■ Stop" : "● Record yourself"}
      </button>
      {audioUrl && (
        <audio controls src={audioUrl} className="h-9 max-w-full flex-1" />
      )}
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  );
}
