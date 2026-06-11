---
name: EchoShadow
description: Local-first language shadowing tool — loop, transcribe, drill, compare.
colors:
  signal-green: "#34d399"
  emerald-active: "#10b981"
  emerald-dark: "#052e22"
  deep-void: "#09090b"
  surface-elevated: "#18181b"
  border-subtle: "#27272a"
  control-secondary: "#3f3f46"
  ink-primary: "#f4f4f5"
  ink-secondary: "#d4d4d8"
  ink-muted: "#a1a1aa"
  ink-ghost: "#71717a"
  error: "#f87171"
typography:
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.075em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1
rounded:
  pill: "9999px"
  lg: "0.75rem"
  md: "0.5rem"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.emerald-active}"
    textColor: "{colors.emerald-dark}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "{colors.signal-green}"
    textColor: "{colors.emerald-dark}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-secondary:
    backgroundColor: "{colors.control-secondary}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-secondary-hover:
    backgroundColor: "{colors.border-subtle}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-ghost-active:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  input-default:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
  card-section:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: EchoShadow

## 1. Overview

**Creative North Star: "The Drilling Floor"**

EchoShadow's visual system is built for the fifth session, not the first. There is no attempt to charm or onboard — the interface assumes a learner who has done this before, who knows where to go, and who needs nothing between them and the audio. Spare, unadorned, built for the ritual of daily practice. The waveform is the hero. Everything else defers.

The palette is near-black with a single live-state color. Typography is system-native, unheroic. Cards define space without lifting off the surface. The only moment of visual energy is Signal Green — and Signal Green fires only when something is playing, recording, or confirmed. It is the indicator light on a recording console, not a brand statement.

This system explicitly rejects: gamified progress UI (badges, streaks, progress trees, any sense that learning is a game); generic SaaS dashboard aesthetics (warm-neutral backgrounds, hero metrics, icon-plus-heading card grids); meditation/wellness softness (gradients, pastel accents, breathing animation); and audio streaming platforms (album-art heroes, playlist-first layout, Spotify dark with green). It is a practice environment, not an entertainment surface.

**Key Characteristics:**
- Near-black void body with two tonal surface steps — no cream, no warm tint
- Single accent color that activates only on live states (play, record, confirm, active loop)
- Flat elevation — tonal layering via surface color, no shadows
- System font throughout — no display type, no decorative typography
- Controls feel tactile and direct: press it, it responds, nothing delays

## 2. Colors: The Signal Palette

A highly compressed dark palette with one live-state accent. Rarity is the signal's power.

### Primary
- **Signal Green** (`#34d399`): The active-state color. Used on live/playing indicators, karaoke word highlighting, loop thumb handles, rep counters, and success confirmations. Never used decoratively. Its appearance means something is happening right now.
- **Emerald Active** (`#10b981`): The primary CTA surface. Used as the background of action buttons (Play, Start Drill, Transcribe with AI). Slightly darker than Signal Green — this is the button; Signal Green is the feedback.
- **Emerald Dark** (`#052e22`): Text on emerald surfaces only. Near-black green that ensures readable contrast on the Emerald Active and Signal Green backgrounds.

### Neutral
- **Deep Void** (`#09090b`): Body background. As dark as practical; the entire app floor.
- **Surface Elevated** (`#18181b`): Card and section container backgrounds. The first step up from void.
- **Border Subtle** (`#27272a`): Card borders, input borders, dividers. Defines boundaries without competing for attention.
- **Control Secondary** (`#3f3f46`): Secondary button backgrounds at rest. The mid-range neutral.
- **Ink Primary** (`#f4f4f5`): Primary text — track names, body copy, input values, active nav labels.
- **Ink Secondary** (`#d4d4d8`): Secondary body text — time display, control labels, transcript body.
- **Ink Muted** (`#a1a1aa`): De-emphasized text — section label eyebrows, inactive nav items, descriptive hints.
- **Ink Ghost** (`#71717a`): Placeholder text, empty-state messaging, lowest-visibility copy.
- **Error** (`#f87171`): Destructive actions (delete track, delete loop), error messages. Never reused for any non-error purpose.

### Named Rules
**The One Signal Rule.** Signal Green and Emerald Active are the only non-neutral colors. Together they occupy less than 5% of any screen at rest. When the player is idle, the interface is effectively monochromatic. This is intentional: the accent's rarity makes it a reliable live-state indicator, not a decorative palette.

**The No Warmth Rule.** The background and surface colors carry no warm tint. `deep-void` and `surface-elevated` are near-zero chroma. Warmth in language learning tools is associated with gamified, approachable UX. This system is neither — it is precise and honest.

## 3. Typography

**Display Font:** none — no display typography used.
**Body / UI Font:** System UI (`ui-sans-serif, system-ui, sans-serif`)
**Mono Font:** System Mono (`ui-monospace, SFMono-Regular, Menlo, monospace`)

**Character:** Unheroic and purposeful. Using the system font is a deliberate choice — EchoShadow doesn't load a brand font because it doesn't need one. The system font is legible, fast, and familiar; it stays out of the way of the content. The one non-standard role is Mono, used for time display to ensure digit alignment under a rAF clock.

### Hierarchy

- **Title** (700 weight, 1.125rem / 18px, -0.025em tracking): App name in the header; track name in the player header. The only large type on screen. Never used in the body of any view.
- **Headline** (600 weight, 1rem / 16px): Major headings within views — unused currently, reserved for future expanded surfaces.
- **Body** (400 weight, 0.875rem / 14px, 1.6 line-height): All control labels, input hints, transcript text, settings fields, description copy. The dominant type role. Max width enforced at 65ch where prose runs long (transcript, How To, Settings).
- **Label** (600 weight, 0.75rem / 12px, 0.075em tracking, uppercase): Section group headers within cards — "A-B Loop", "Transcript", "Shadow & Compare". Used sparingly; never applied to more than one structural level per surface, and never as a page-level navigation device.
- **Mono** (400 weight, 0.875rem / 14px): Time display only (`currentTime / duration`). Prevents layout shift as digits update under the rAF clock.

### Named Rules
**The Label Ceiling Rule.** Label typography (uppercase tracked) is permitted within cards to name the card's function. It is prohibited at page-level, as a section eyebrow above full-page sections, or stacked between paragraphs. One label level per surface; not a scaffold.

## 4. Elevation

EchoShadow uses flat tonal layering instead of shadows. No `box-shadow` declarations appear on cards, inputs, buttons, or containers. Depth is expressed through background color steps: `deep-void` → `surface-elevated` → `border-subtle` as a boundary marker.

This is the right approach for a dark-on-dark system. Shadows on dark backgrounds require high opacity to read, which produces muddy, heavy-feeling UI. The tonal step from `#09090b` to `#18181b` is sufficient to read as foreground/background without any shadow.

The only exception is focus rings: keyboard-focused interactive elements receive a `2px` outline at `signal-green` with a `2px` offset, which is structural (a11y) not decorative.

**The Flat-By-Default Rule.** No `box-shadow` on cards, sections, buttons, inputs, or containers — ever. Shadows are permitted only for popover, dropdown, or modal overlays that must visually detach from the page layer. For those, a single ambient shadow no larger than `0 8px 24px rgba(0,0,0,0.4)` is the ceiling.

## 5. Components

### Buttons

Tactile and direct: no loading shimmer, no delayed ripple. The control responds on `mousedown` where possible, always on `click`.

- **Shape:** Gently rounded (8px / `rounded.md`). Not pill, not square. The same radius at every size.
- **Primary:** `emerald-active` background (`#10b981`), `emerald-dark` text (`#052e22`), 6px vertical / 12px horizontal padding. Hover shifts to `signal-green` (`#34d399`). Used for: Play/Pause, Start Drill, Transcribe with AI, Save loop (if treated as a commit action).
- **Primary (circular variant):** The play button only. 48×48px, `border-radius: 9999px`, same emerald-active/signal-green treatment. The emoji icon (`▶` / `⏸`) is replaced with SVG in production.
- **Secondary:** `control-secondary` background (`#3f3f46`), `ink-primary` text, same radius and padding. Hover lightens to `border-subtle` (`#3f3f46` → `#27272a` inverted — actually `#3f3f46` to slightly lighter). Used for: Save loop, Stop drill, ← Prev / Next →, ← Library.
- **Ghost (nav):** Transparent background, `ink-muted` text at rest, `ink-primary` text on hover. Active state receives `surface-elevated` background. The tab strip uses this pattern.
- **Disabled:** `opacity: 0.4` on the button element. No separate color treatment.
- **Focus:** `outline: 2px solid #34d399; outline-offset: 2px` on all interactive elements. Never `outline: none` without a replacement.

### Chips / Tags

Used for saved loop labels and track-type badges.

- **Loop tag:** `border-radius: 9999px` (pill), `surface-elevated` background, `ink-secondary` text, small 4px top / 8px horizontal padding. Delete action inline at trailing edge (`ink-ghost` × on rest, `error` on hover). The loop name is a button inside the pill — hover on the name shifts text to `signal-green`.
- **Type badge:** `emerald-active/20` background (transparent tint), `signal-green` text, `border-radius: 9999px`, `text-xs`. The "Audio" badge in the track list. Read-only; no interaction.

### Cards / Containers

- **Corner Style:** Gently rounded (12px / `rounded.lg`). Cards are sections of a single scrollable view; they don't float freely.
- **Background:** `surface-elevated` (`#18181b`) at 50% opacity (`/50` modifier) — allows the void to bleed through slightly, softening the layer boundary.
- **Shadow Strategy:** None. Defined by border only (see Elevation).
- **Border:** `1px solid border-subtle` (`#27272a`). Present on all section cards. No hover/active treatment on the border itself.
- **Internal Padding:** `16px` (`spacing.lg`) on all sides. Consistent; not reduced on smaller cards.
- **Nested cards:** Prohibited. The transcript segment highlight and the drill sentence box are `bg-zinc-800` inline boxes within a card, not cards themselves. True card nesting (card inside a card) is always wrong.

### Inputs / Fields

- **Style:** `1px solid border-subtle` border, `surface-elevated` background, `ink-primary` text, 8px / 8px padding, 8px radius. Same visual weight as secondary buttons.
- **Focus:** Border shifts to `signal-green` (`#34d399`), no background change. The focus ring (`outline: 2px solid signal-green`) stacks with the border shift.
- **Number inputs:** Fixed width (`4rem` for repeat-count, `3.5rem` for drill reps). Use `font-mono` for digit stability under rapid changes.
- **Select:** Same as input styling. Native `<select>` with `appearance: none` and a CSS chevron, or left as browser-native for functional parity.
- **Error:** Border shifts to `error` (`#f87171`); error message in `error` text below the field.

### Navigation

The tab strip sits in the header, right-aligned.

- **Tab at rest:** Ghost button (transparent, `ink-muted` text, 8px radius, 6px/12px padding). Font: body (0.875rem), no uppercase.
- **Tab active:** `surface-elevated` background, `ink-primary` text. No underline, no accent-color highlight — the state is background fill only.
- **Tab hover:** `ink-primary` text only, background remains transparent.
- **Header structure:** `max-w-3xl` centered, `border-b border-subtle`. App name on the left (title weight, `signal-green` dot `●` as the logotype). Tab strip on the right.

### A-B Loop Slider (Signature Component)

The double-range loop slider is EchoShadow's most distinctive UI element. Two overlapping `<input type="range">` elements share a container; each is absolutely positioned over the full track. The lower thumb controls `loopStart`, the upper controls `loopEnd`.

- **Track background:** `border-subtle` (`#27272a`), 4px height.
- **Fill region** (between thumbs): rendered as an overlay via a positioned div, `signal-green` at 30% opacity (`rgba(52,211,153,0.3)`).
- **Thumb:** 16px circle, `signal-green` fill (`#34d399`), 2px `emerald-dark` border. No shadow on the thumb.
- **Pointer events:** The containing div has `pointer-events: none`; only thumbs receive `pointer-events: auto`.
- **Label**: Time values (`start → end`) rendered in `ink-ghost` mono text below the slider.

## 6. Do's and Don'ts

### Do:
- **Do** use Signal Green (`#34d399`) exclusively for live/active states: a word is playing, a loop is running, a rep is completed, a recording is active. Its appearance always means something is live.
- **Do** define card sections with `1px solid #27272a` border on `#18181b/50` background — no shadow, no gradient, no nested cards.
- **Do** apply `outline: 2px solid #34d399; outline-offset: 2px` on all `:focus-visible` interactive elements. Never suppress the outline without a replacement.
- **Do** use `font-mono` for time display (`currentTime`, `duration`, loop timestamps). Prevents layout shift under the rAF clock.
- **Do** keep the tab navigation background-fill-only for the active state — no accent-color underlines, no full-bleed emerald tabs.
- **Do** use `opacity: 0.4` for disabled states. Do not invent a separate disabled color; reduce in place.
- **Do** render error messages in `error` (`#f87171`) text directly below the failing element. One line, no cards or icons.
- **Do** respect `prefers-reduced-motion`. All `transition-*` declarations must have a `@media (prefers-reduced-motion: reduce)` override that removes the transition.

### Don't:
- **Don't** use Signal Green or Emerald Active for decoration, illustration, hover highlights on neutral elements, or background fills on sections. This destroys the one-signal rule — when everything glows, nothing signals.
- **Don't** introduce warm-tinted neutral backgrounds. No cream, sand, linen, paper, parchment, or bone. The background is near-black, zero chroma. Warmth belongs in the accent + content, not the surface.
- **Don't** add shadows (`box-shadow`) to cards, buttons, or inputs. The system is flat. See the Flat-By-Default Rule.
- **Don't** use `border-radius` values above `0.75rem` (12px) on cards or containers, or above `0.5rem` (8px) on buttons and inputs. The circular play button and pill-shaped tags are the only pill-radius exceptions.
- **Don't** pair `border: 1px solid X` with a wide drop shadow (`blur ≥ 16px`) on the same element. Pick one.
- **Don't** add gamification: streak counts, badge illustrations, progress trees, motivational copy, confetti. EchoShadow is for deliberate practice, not reward loops.
- **Don't** make it look like a generic SaaS dashboard: no warm-neutral body, no hero metrics, no icon-plus-heading card grids repeated across sections, no feature pricing tables.
- **Don't** apply wellness/meditation aesthetics: no soft gradients, no pastel secondary palette, no breathing animations, no rounded-everything softness.
- **Don't** borrow from audio streaming platforms: no album art hero, no big playlist column, no Spotify-green reuse of the emerald (Signal Green is a live indicator, not a brand color lifted from another product).
- **Don't** stack Label typography (uppercase, tracked) at more than one structural level per view. One section label per card is the ceiling; it must not become a page-scaffold scaffold for every section.
- **Don't** put gradient text (`background-clip: text` with a gradient fill) on any element.
- **Don't** use `position: absolute` dropdowns inside `overflow: hidden` containers — they will clip. Use `position: fixed` or the native `<dialog>`/popover API.
