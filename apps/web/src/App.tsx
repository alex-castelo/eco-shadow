import { useState } from "react";
import { Library } from "./components/Library";
import { PlayerView } from "./components/PlayerView";
import { SettingsView } from "./components/SettingsView";

type View =
  | { name: "library" }
  | { name: "player"; trackId: number }
  | { name: "settings" };

export default function App() {
  const [view, setView] = useState<View>({ name: "library" });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <button
            onClick={() => setView({ name: "library" })}
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="text-emerald-400">●</span> EchoShadow
          </button>
          <nav className="flex gap-1 text-sm">
            <button
              onClick={() => setView({ name: "library" })}
              className={`rounded-lg px-3 py-1.5 ${
                view.name !== "settings"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setView({ name: "settings" })}
              className={`rounded-lg px-3 py-1.5 ${
                view.name === "settings"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {view.name === "library" && (
          <Library
            onOpenTrack={(trackId) => setView({ name: "player", trackId })}
          />
        )}
        {view.name === "player" && (
          <PlayerView
            trackId={view.trackId}
            onBack={() => setView({ name: "library" })}
          />
        )}
        {view.name === "settings" && <SettingsView />}
      </main>
    </div>
  );
}
