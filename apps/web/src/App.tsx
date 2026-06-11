import { useState } from "react";
import { DrillView } from "./components/DrillView";
import { HowToView } from "./components/HowToView";
import { Library } from "./components/Library";
import { PlayerView } from "./components/PlayerView";
import { SettingsView } from "./components/SettingsView";

type View =
  | { name: "howto" }
  | { name: "library" }
  | { name: "player"; trackId: number }
  | { name: "drill" }
  | { name: "settings" };

export default function App() {
  const [view, setView] = useState<View>({ name: "howto" });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => setView({ name: "howto" })}
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="text-emerald-400">●</span> EchoShadow
          </button>
          <nav className="flex gap-1 text-sm">
            <button
              type="button"
              onClick={() => setView({ name: "howto" })}
              className={`rounded-lg px-3 py-1.5 ${
                view.name === "howto"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              How To
            </button>
            <button
              type="button"
              onClick={() => setView({ name: "library" })}
              className={`rounded-lg px-3 py-1.5 ${
                view.name === "library" || view.name === "player"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Library
            </button>
            <button
              type="button"
              onClick={() => setView({ name: "drill" })}
              className={`rounded-lg px-3 py-1.5 ${
                view.name === "drill"
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              Drill
            </button>
            <button
              type="button"
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
        {view.name === "howto" && <HowToView />}
        {view.name === "library" && (
          <Library onOpenTrack={(trackId) => setView({ name: "player", trackId })} />
        )}
        {view.name === "player" && (
          <PlayerView trackId={view.trackId} onBack={() => setView({ name: "library" })} />
        )}
        {view.name === "drill" && <DrillView />}
        {view.name === "settings" && <SettingsView />}
      </main>
    </div>
  );
}
