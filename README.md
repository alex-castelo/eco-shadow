# 🎧 EchoShadow

**Open source, local-first shadowing app for language learners.**
Loop any audio, read along with karaoke-style word highlighting, record yourself, and compare — all in your browser, with **your own AI key** and **zero servers**.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Built with React](https://img.shields.io/badge/React-19-61dafb)
![Local First](https://img.shields.io/badge/Local--First-100%25-34d399)

> 📸 *Screenshots / karaoke-effect GIF coming soon.*

---

## ✨ Features

- **🔁 A-B Loops** — drag a double slider to mark a segment, set how many times it repeats (or ∞), and the player loops it automatically. Save your favorite loops per track.
- **🌊 Visual timeline** — real decoded waveform for local files, click anywhere to seek.
- **🐢 Playback speed** — from 0.5× to 2× for progressive shadowing.
- **🎤 Karaoke transcripts** — transcribe any audio with Whisper (via **your own** Groq or OpenAI key) and watch each word light up as it's spoken. Click a word to jump to it.
- **🗣️ Shadow & compare** — record your own voice over the loop with the browser's microphone and play both back.
- **🔒 Local-first by design** — audio files, loops and transcripts live in IndexedDB; your API key lives in localStorage. Nothing ever touches a third-party server except the AI provider you choose.

## 🚀 Quick start

```bash
git clone https://github.com/your-user/echoshadow.git
pnpm install
pnpm dev
```

That's it — open http://localhost:5173 and drop an `.mp3` in.

> Requires [Node.js](https://nodejs.org) ≥ 20 and [pnpm](https://pnpm.io) ≥ 9.

### Optional: enable AI transcription

1. Get a free API key from [console.groq.com](https://console.groq.com) (or [platform.openai.com](https://platform.openai.com)).
2. Open **Settings** in the app, paste the key, save.
3. Open any local track and hit **Transcribe with AI**.

Your key is stored only in your browser's localStorage and requests go **directly from your browser to the provider**.

## 🏗️ Architecture

```
echoshadow/
├── apps/
│   └── web/                  # React 19 + Vite + Tailwind CSS 4
│       └── src/
│           ├── components/   # Library, PlayerView, Timeline, LoopSlider,
│           │                 # TranscriptPanel (karaoke), Recorder, Settings
│           └── hooks/        # usePlaybackEngine (rAF clock + A-B loop logic)
└── packages/
    └── core/                 # Framework-agnostic shared logic
        └── src/
            ├── db.ts             # Dexie.js (IndexedDB) schema: tracks, loops, transcripts
            ├── transcription.ts  # Whisper API client (Groq / OpenAI, word timestamps)
            └── settings.ts       # localStorage-backed user settings
```

**Key decisions**

| Concern | Choice | Why |
|---|---|---|
| Monorepo | pnpm workspaces | `@echoshadow/core` is shared as-is with a future Tauri desktop app |
| Storage | Dexie.js over IndexedDB | Audio blobs + structured data, fully offline, ORM-like API |
| Playback clock | `requestAnimationFrame` | `timeupdate` fires ~4 Hz — too coarse for word-level karaoke and tight loops |
| Player | native `<audio>` behind a `MediaLike` interface | The loop/karaoke engine stays decoupled, so future players (e.g. YouTube) plug in without rewrites |
| AI | BYOK (bring your own key) | No backend, no cost to the project, full user privacy |

## 🗺️ Roadmap

- [x] **Phase 1** — Local player, waveform, A-B loops with repeat count, IndexedDB persistence
- [x] **Phase 2** — BYOK settings, Whisper transcription, karaoke word highlighting
- [x] **Phase 3** — Voice recorder for shadow & compare
- [ ] **Phase 4** — YouTube playback + pasted transcripts (zero AI cost)
- [ ] **Phase 5** — Pronunciation scoring (Azure Speech, BYOK) · Desktop app via Tauri

See [PRD.md](./PRD.md) for the full product spec.

## 🤝 Contributing

Issues and PRs are very welcome! Keep it simple:

1. Fork & branch
2. `pnpm install && pnpm dev`
3. Make sure `pnpm build` passes before opening the PR

## 📄 License

[MIT](./LICENSE) — use it, fork it, learn from it.

---

<p align="center">
  If EchoShadow helps your language practice, consider
  <a href="https://buymeacoffee.com/alexcastelo">☕ buying me a coffee</a>.
</p>
