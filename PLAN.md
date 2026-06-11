# Implementation Plan: EchoShadow UI Improvements

## Overview

Dos mejoras independientes: una pantalla "How To" como landing page con 4 cards numeradas, y una barra de subtítulos flotante fija al fondo del viewport en el PlayerView.

## Architecture Decisions

- `HowToView` es un componente puramente presentacional, sin estado ni props
- `SubtitleBar` recibe `transcript` y `currentTime` desde `PlayerView` — no accede a DB directamente
- La vista por defecto en `App.tsx` cambia de `"library"` a `"howto"`
- El tipo `View` en `App.tsx` se extiende con `{ name: "howto" }`
- `SubtitleBar` usa `position: fixed` — vive fuera del flujo del documento, no necesita padding en PlayerView

---

## Task List

### Phase 1: How To Page

- [x] **Task 1:** Crear `HowToView` component (`apps/web/src/components/HowToView.tsx`)
- [x] **Task 2:** Integrar `HowToView` en `App.tsx` (nav + routing + default view)

### Checkpoint 1
- [x] `npm run build` sin errores
- [x] La app abre en How To, nav funciona, Library y Settings siguen operativos

---

### Phase 2: Floating Subtitle Bar

- [x] **Task 3:** Crear `SubtitleBar` component (`apps/web/src/components/SubtitleBar.tsx`)
- [x] **Task 4:** Integrar `SubtitleBar` en `PlayerView.tsx` + añadir `pb-24`

### Checkpoint 2 — Complete
- [x] `npm run build` sin errores
- [x] Flujo completo: entrar → How To → Library → abrir track → transcribir → play → subtítulo aparece y sigue el audio

---

## Task Detail

### Task 1: `HowToView` component

**Archivo:** `apps/web/src/components/HowToView.tsx`

4 cards numeradas:
1. **Upload audio** — Sube un MP3, podcast o clip desde tu dispositivo
2. **Transcribe** — Usa tu API key de OpenAI/Groq para obtener el transcript con timestamps por palabra
3. **A-B Loop** — Marca un fragmento, configura repeticiones y practica a tu ritmo
4. **Shadow & compare** — Grábate repitiendo el loop y compara tu pronunciación con el original

Acceptance criteria:
- [x] 4 cards visibles con número, icono, título y descripción
- [x] Estilo consistente con zinc/emerald dark theme
- [x] Sin props, sin estado, sin efectos

---

### Task 2: Integrar en `App.tsx`

**Archivo:** `apps/web/src/App.tsx`

- Añadir `{ name: "howto" }` al tipo `View`
- Cambiar `useState` default de `"library"` a `"howto"`
- Añadir botón "How To" al nav
- Renderizar `<HowToView />` cuando `view.name === "howto"`

Acceptance criteria:
- [x] Nav muestra 3 botones: How To · Library · Settings
- [x] Al cargar la app, se muestra How To por defecto
- [x] Botón activo con `bg-zinc-800`, inactivos con `text-zinc-400`

---

### Task 3: `SubtitleBar` component

**Archivo:** `apps/web/src/components/SubtitleBar.tsx`

Props: `transcript: Transcript | undefined`, `currentTime: number`

Lógica:
- Segmento activo: último `segment` donde `start <= currentTime && end >= currentTime`
- Palabra activa: binary search igual que `TranscriptPanel`
- Si no hay transcript o segmento activo → `return null`

Estilo:
- `fixed bottom-0 left-0 right-0 z-50`
- `bg-black border-t-2 border-emerald-500`
- `h-20 flex items-center justify-center px-6`
- Texto `text-2xl`, palabra activa `text-emerald-400 font-semibold`

Acceptance criteria:
- [x] Muestra el segmento activo durante reproducción
- [x] Palabra en curso resaltada en esmeralda
- [x] No visible sin transcript o fuera de segmento activo
- [x] Fijo al fondo, no interfiere con scroll

---

### Task 4: Integrar en `PlayerView.tsx`

**Archivo:** `apps/web/src/components/PlayerView.tsx`

- Renderizar `<SubtitleBar transcript={transcript} currentTime={currentTime} />` al final del JSX
- Añadir `pb-24` al contenedor raíz

Acceptance criteria:
- [x] Barra visible con transcript + reproducción activa
- [x] Contenido no tapado por la barra
- [x] No aparece en Library ni Settings

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| `segments` vacío en transcripts viejos | Bajo | SubtitleBar retorna `null` si no hay segmentos |
| Barra fija tapa contenido en móvil | Medio | `pb-24` en PlayerView garantiza espacio |

---

## Status

- Inicio: 2026-06-11
- Estado: Completado — 2026-06-11
