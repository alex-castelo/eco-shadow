const TABS = [
  {
    label: "Library",
    icon: "⬆",
    tagline: "Your audio collection",
    desc: "Upload any MP3, podcast, or audio clip from your device. All your files live here — tap one to open it in the player.",
  },
  {
    label: "Player",
    icon: "▶",
    tagline: "Shadow with real audio",
    features: [
      {
        name: "Transcript",
        detail:
          "Add an OpenAI or Groq API key in Settings and hit Transcribe. You get a word-level transcript with karaoke-style highlighting as the audio plays.",
      },
      {
        name: "A-B Loop",
        detail:
          "Drag the loop handles to isolate any fragment. Set how many times it repeats, and save loops to come back to them.",
      },
      { name: "Speed control", detail: "Slow down to 0.5× or speed up to 2× to match your level." },
      {
        name: "Sentence Drill",
        detail:
          "Loops through every transcript segment automatically, repeating each one N times before moving on.",
      },
      {
        name: "Record & compare",
        detail:
          "Record yourself shadowing, then play your voice and the original side by side to hear the difference.",
      },
    ],
  },
  {
    label: "Drill",
    icon: "💬",
    tagline: "Shadow without audio",
    desc: "No recording? Paste any phrases — one per line — and the app reads them aloud with text-to-speech so you can shadow on the spot.",
  },
  {
    label: "Settings",
    icon: "⚙",
    tagline: "API keys",
    desc: "Paste your OpenAI or Groq API key here. It's stored locally on your device and only used to transcribe audio.",
  },
];

export function HowToView() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-bold text-zinc-100">EchoShadow</h1>
        <p className="mx-auto max-w-md text-zinc-400 leading-relaxed">
          A shadowing tool for language learners. Load real audio, loop any fragment, record
          yourself, and compare — or drill phrases with TTS when you have no recording.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          What's in each tab
        </h2>

        <div className="space-y-3">
          {TABS.map((tab) => (
            <div
              key={tab.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-base">
                  {tab.icon}
                </span>
                <div>
                  <span className="font-semibold text-zinc-100">{tab.label}</span>
                  <span className="ml-2 text-sm text-zinc-500">{tab.tagline}</span>
                </div>
              </div>

              {tab.desc && <p className="text-sm leading-relaxed text-zinc-400">{tab.desc}</p>}

              {tab.features && (
                <ul className="space-y-2">
                  {tab.features.map((f) => (
                    <li key={f.name} className="flex gap-2 text-sm">
                      <span className="mt-0.5 text-emerald-500 shrink-0">✓</span>
                      <span>
                        <span className="font-medium text-zinc-200">{f.name}</span>
                        <span className="text-zinc-400"> — {f.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
