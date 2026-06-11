const STEPS = [
  {
    num: 1,
    icon: "⬆",
    title: "Upload audio",
    desc: "Upload an MP3, podcast, or clip from your device.",
  },
  {
    num: 2,
    icon: "✦",
    title: "Transcribe",
    desc: "Use your OpenAI or Groq API key to get a transcript with per-word timestamps.",
  },
  {
    num: 3,
    icon: "↔",
    title: "A-B Loop",
    desc: "Mark a fragment, set the repeat count, and practice at your own pace.",
  },
  {
    num: 4,
    icon: "🎙",
    title: "Shadow & compare",
    desc: "Record yourself repeating the loop and compare your pronunciation with the original.",
  },
];

export function HowToView() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-zinc-100">How to use EchoShadow</h1>
        <p className="text-zinc-400">Practice shadowing in 4 simple steps.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((s) => (
          <div
            key={s.num}
            className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">
                {s.num}
              </span>
              <span className="text-xl">{s.icon}</span>
              <h2 className="font-semibold text-zinc-100">{s.title}</h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
