# 📄 PRD — EchoShadow

**Proyecto:** EchoShadow – Open Source Local-First Shadowing App
**Autor:** Alex Castelo
**Stack principal:** React (Vite) + TypeScript + Tailwind CSS + IndexedDB

## 🛠️ Stack tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Monorepo | pnpm Workspaces | App web y app de escritorio compartiendo el 100% de la lógica |
| Frontend | React 19 + Vite + TypeScript | |
| Estilos | Tailwind CSS 4 | |
| Base de datos local | IndexedDB vía Dexie.js | Blobs de audio + datos estructurados, 100% offline |
| IA (BYOK) | Whisper vía Groq u OpenAI | La API key es del usuario y vive solo en su navegador |
| Escritorio (futuro) | Tauri | Ejecutable nativo < 10 MB |

## 🚀 Plan de desarrollo por fases

### ✅ Fase 1: Core del reproductor y bucles (local-first) — HECHA

- Drag & drop de archivos `.mp3` / `.wav` (también `.m4a` / `.ogg`).
- Línea de tiempo visual con forma de onda decodificada y clic para buscar.
- Controles estándar: play/pausa, velocidad de reproducción (0.5×–2×).
- Slider doble para marcar `StartTime` y `EndTime` del bucle A-B.
- Repetición automática: al llegar al final del bucle, seek al inicio.
- Selector numérico de repeticiones antes de pausar (0 = infinito).
- Persistencia con Dexie.js: pistas (con su blob de audio) y bucles guardados.

### ✅ Fase 2: Configuración de API y efecto "karaoke" — HECHA

- Pantalla de Ajustes: el usuario pega su propia API key de Groq u OpenAI.
  Se guarda en localStorage; nunca pasa por ningún servidor propio.
- Módulo de transcripción: petición directa navegador → API Whisper con
  timestamps por palabra (`verbose_json`).
- Renderizado sincronizado: el JSON con timestamps se guarda en IndexedDB
  y un reloj de `requestAnimationFrame` ilumina en tiempo real la palabra
  que está sonando. Clic en una palabra = seek a su instante.

### ✅ Fase 3: Grabación y comparativa (shadow & compare) — HECHA

- Grabador de voz con la API `MediaRecorder` del navegador.
- El usuario graba su voz sobre el bucle y reproduce ambas para comparar.

### ⏳ Fase 4: Integración con YouTube — PENDIENTE (no implementada)

Expandir el catálogo de práctica a internet.

- Input para pegar un enlace de YouTube.
- Sustitución dinámica del reproductor local por un reproductor embebido
  (la abstracción `MediaLike` del motor de reproducción ya lo permite).
- Transcripciones sin coste de IA: como el navegador no puede descargar el
  audio del vídeo (ni leer sus subtítulos por CORS), se ofrecerá pegar la
  transcripción manualmente (SRT/VTT o el formato del panel "Mostrar
  transcripción" de YouTube) y la app la formateará con timestamps.

### ⏳ Fase 5: Extras profesionales — PENDIENTE

- **Evaluación de pronunciación** (opcional): API key de Azure Speech en
  Ajustes para feedback fonema a fonema.
- **Distribución de escritorio:** configurar Tauri en el monorepo para
  compilar la app web en un ejecutable nativo (.exe / .app / Linux).

## 🤝 Preparación para Open Source

- [x] `README.md` con arquitectura, quick start en 3 comandos y roadmap.
- [x] Licencia MIT.
- [x] Enlace de donación (Buy Me a Coffee) al final del README.
- [ ] Capturas de pantalla / GIF del efecto karaoke en el README.
