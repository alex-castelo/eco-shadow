import { db, deleteTrack, type Track } from "@echoshadow/core";
import { useLiveQuery } from "dexie-react-hooks";
import { type DragEvent, useState } from "react";

interface Props {
  onOpenTrack: (trackId: number) => void;
}

export function Library({ onOpenTrack }: Props) {
  const tracks = useLiveQuery(() => db.tracks.orderBy("createdAt").reverse().toArray());
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = async (files: FileList | File[]) => {
    setError(null);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("audio/") && !/\.(mp3|wav|m4a|ogg)$/i.test(file.name)) {
        setError(`"${file.name}" is not a supported audio file.`);
        continue;
      }
      const id = await db.tracks.add({
        name: file.name.replace(/\.[^.]+$/, ""),
        blob: file,
        createdAt: Date.now(),
      });
      onOpenTrack(id as number);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) void addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? "border-emerald-400 bg-emerald-400/10"
            : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-500"
        }`}
      >
        <span className="text-3xl">🎧</span>
        <span className="text-sm text-zinc-300">
          Drop an <b>.mp3</b> / <b>.wav</b> here, or click to browse
        </span>
        <input
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.ogg"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && void addFiles(e.target.files)}
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Track list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-400 uppercase">
          Your library
        </h2>
        {tracks === undefined ? null : tracks.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nothing here yet. Add an audio file to start practicing.
          </p>
        ) : (
          <ul className="divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800">
            {tracks.map((track: Track) => (
              <li
                key={track.id}
                className="flex items-center gap-3 bg-zinc-900/60 px-4 py-3 hover:bg-zinc-800/80"
              >
                <button
                  type="button"
                  onClick={() => onOpenTrack(track.id as number)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                    Audio
                  </span>
                  <span className="truncate text-sm text-zinc-100">{track.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void deleteTrack(track.id as number)}
                  className="text-zinc-500 hover:text-red-400"
                  title="Delete track"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
