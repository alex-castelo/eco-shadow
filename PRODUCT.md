# Product

## Register

product

## Users

Self-taught language learners doing shadowing practice — listening to and repeating native-speaker audio (podcasts, TV clips, lesson recordings) to improve pronunciation and fluency. They work alone at a desk, often in long focused sessions. They are self-directed and technically comfortable enough to manage their own files and API keys. The job to be done: drill a segment until it feels natural, then move on.

## Product Purpose

EchoShadow is a local-first language shadowing tool. It lets learners loop any audio segment precisely (A-B loops with repeat counts), read along with word-level karaoke highlighting, and record themselves for comparison — all offline, with zero servers. AI transcription uses the learner's own Groq or OpenAI key, sent directly from the browser. Nothing is stored outside the learner's own device.

Success looks like: a learner can open the app, drop in a recording, transcribe it, and be mid-drill within two minutes. And then stay in the flow for an hour without friction.

## Brand Personality

Focused, precise, open.

The tone is confident without being loud. This is a serious practice tool built by someone who learns languages; it doesn't need to explain itself or motivate users with badges. The "open" is the open-source ethos: no black boxes, no lock-in, the source is there if you want to look.

Emotional goal: calm intensity — the feeling of a practice session going well, not a gamified streak.

## Anti-references

- **Duolingo / gamified learning apps**: No streaks, badges, cartoon mascots, progress trees, or any of the dopamine-loop affordances that treat learning as a game rather than craft.
- **Generic SaaS dashboards**: No cream/warm-neutral body, no hero-metric cards, no feature grids with icon + heading + text, no "ABOUT / PRICING / FEATURES" eyebrow scaffolding.
- **Meditation / wellness apps**: No soft gradients, lavender/sage/mist color families, breathing animations, or passive-calm aesthetics. EchoShadow is active and precise.
- **Audio streaming platforms (Spotify-style)**: No big album art hero, no playlist-first layout, no dark-green Spotify palette. This is a practice environment, not an entertainment surface.

## Design Principles

1. **Practice-native hierarchy**: The waveform and playback controls are always the primary surface. Every other feature — transcript, recorder, loop list — is secondary and should never compete with the playback state for visual attention.

2. **Precision is the aesthetic**: Exact timestamps, tight loop boundaries, word-level alignment. Don't round off, smooth over, or soften the interface. Density and exactness communicate trustworthiness here.

3. **Stay out of the flow**: A language practice session has a rhythm. UI that requires multiple taps to reach a common action, or that interrupts the loop with confirmations, breaks the session. Controls should be reachable without moving the eye far from the transcript.

4. **Local-first is visible**: Data ownership and privacy are features. The absence of login screens, sync states, and server latency should feel deliberate, not accidental. The UI trusts the user.

5. **Open by default**: The code is public. The design should feel legible in the same way: no cryptic icons, no mysterious micro-animations, no UI that requires onboarding to decode. A new user should be able to infer every control from context.

## Accessibility & Inclusion

Target: WCAG 2.1 AA. Body text ≥ 4.5:1 contrast against background, large text ≥ 3:1. Full keyboard navigation — the player controls, loop slider, and transcript panel must be operable without a mouse. `prefers-reduced-motion` respected on all animations. Waveform and karaoke highlighting should not be the sole means of conveying information (timing data also exposed via text).
