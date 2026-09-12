<div align="center">

# ⚡ CHESSVERSE 3D
### *Immersive 3D WebGL Chess Universe, Interactive Academy & Local Arena*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Cinematic 3D WebGL Chessboard • Tactical Puzzles • Interactive 3D Learning Academy • Local Pass & Play • 100% Free & Self-Contained</b>
</p>

[🎮 Features](#-features) • [🕹️ Core Modes](#-core-modes) • [🛠️ Tech Stack](#-tech-stack) • [🚀 Quick Start](#-quick-start) • [📐 Responsive Design](#-responsive--device-support) • [🔧 Troubleshooting](#-troubleshooting)

---

</div>

## 🌟 Features

- 🎲 **Cinematic 3D Chess World**: Real-time WebGL rendering via Three.js and React Three Fiber with dynamic lighting, soft PCF shadows, reflections, and ambient floating particles.
- 🚀 **Smooth Parabolic Move Physics**: True 3D arc trajectories with piece-tilt, lift physics, bounce landing damping, and tactile board impact.
- 🎥 **Dynamic 3D Camera Controls**: Smooth orbital controls, 4 preset camera angles (White, Black, Top-Down 2D, Cinematic Orbit), and seamless camera transitions.
- 🎓 **Interactive 3D Chess Academy**: Structured curriculum covering Chess Fundamentals, Tactical Patterns, Classic Openings, and Essential Endgames with 3D board focus rings, animated guide arrows, and interactive drill validation.
- 🧩 **Curated Tactical Puzzles**: Deep tactical challenge library spanning Pins, Forks, Skewers, Discovered Attacks, and Back-Rank Checkmates with move hints and real-time step evaluation.
- 👥 **Dedicated 2-Player Pass & Play**: Built-in chess clock presets (Bullet, Blitz, Rapid, Classical, Custom Increments), automatic board flip, captured piece graveyard, live material advantages, and full algebraic move log.
- 🎨 **Board & Piece Customizer Studio**: Live 3D studio previewing multiple board themes (Midnight Onyx, Royal Walnut, Cyber Grid, Classic Tournament, Emerald Forest) and piece materials (Alabaster, Obsidian, Gold Leaf, Brushed Metal).
- 🎵 **Procedural Web Audio Engine**: Zero external audio downloads. Sliders, piece lifts, captures, checks, promotions, and victories are synthesized dynamically using the Web Audio API.
- ⚡ **Device Tiering & Adaptive Quality**: Automated benchmark detects low, medium, and high capability devices to adjust shadow maps, particle density, and DPR dynamically for smooth 60 FPS performance.
- ♿ **Accessibility & Motion Safety**: Full support for `prefers-reduced-motion` to disable aggressive camera movements and parabolic arcs when requested by system preferences.

---

## 🕹️ Core Modes

| Mode | Purpose | Capabilities |
| :--- | :--- | :--- |
| **⚔️ PLAY** | Solo or Practice Chess Sandbox | Complete FIDE rule validation, en passant, castling, pawn promotion modal, interactive move rewind, and FEN/PGN export. |
| **👥 2 PLAYER** | Local Over-the-Board Play | Dedicated dual-seat layout, customizable dual clocks with Fischer increments, optional board flipping per turn, move-by-move history, and resign/draw options. |
| **🎓 LEARN CHESS** | Interactive 3D Academy | Multi-chapter interactive lessons with guided board arrows, step-by-step drills, contextual explanations, and persistent progress tracking. |
| **🧩 PUZZLES** | Tactical Training | Curated rating-tiered puzzles with solution step verification, mistake detection, hint visualization, and solve streak counters. |
| **👤 PROFILE** | Local Player Records | Displays locally tracked statistics: Games Played, Wins, Losses, Draws, Lessons Completed, Puzzles Solved, Learning Streak, and Course Progress. |
| **⚙️ SETTINGS** | Engine & Visual Config | Audio volume controls, shadow toggles, particle density, device performance tiers, 2D/3D fallback modes, and theme switchers. |

---

## 🛠️ Tech Stack

```
Frontend Architecture:
  ├── React 18 (Concurrent rendering, Suspense, Custom hooks)
  ├── TypeScript 5 (Strict type checking, exhaustive enums)
  ├── Vite (Optimized production asset pipeline)
  ├── Tailwind CSS (Responsive utility layout)
  └── Lucide React (Accessible iconography)

3D Graphics & Sound:
  ├── Three.js (r183+ WebGL rendering engine, PCFShadowMap)
  ├── @react-three/fiber (Declarative 3D scene graph)
  ├── @react-three/drei (Camera OrbitControls, canvas utilities)
  └── Web Audio API (Zero-dependency procedural sound synthesizer)

Chess Engine & Rules:
  ├── chess.js (Authoritative FIDE chess rule enforcement)
  └── Zustand (Predictable, atomic global state management)
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or later)
- [npm](https://www.npmjs.com/) (version 9.0 or later)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/chessverse-3d.git
cd chessverse-3d
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## 📐 Responsive & Device Support

ChessVerse 3D is engineered to render cleanly and responsively across the full spectrum of modern hardware:

- **Mobile Phones** (320px – 430px width): Compact UI layout, collapsible floating toolbars, touch gestures, and optimized canvas aspect ratios.
- **Tablets & Foldables** (600px – 1024px width): Adaptive split-panel board layout, larger touch targets, and balanced sidebar trays.
- **Laptops & Desktops** (1280px – 1920px width): Full dual-column dashboard with side-by-side move history, captured pieces display, and full 3D viewport.
- **4K & Ultrawide Monitors** (2560px – 5120px width): Constrained max-width containers, crisp typography, and high-fidelity rendering without stretching.

---

## 🔧 Troubleshooting

### WebGL Disabled or Hardware Acceleration Off
If your browser or device does not have WebGL enabled, ChessVerse 3D automatically falls back to an accessible, responsive 2D SVG board with full gameplay and tactical features intact. You can also manually switch between 3D and 2D mode in the Settings modal.

### Performance on Low-End Hardware
Navigate to **Settings** (gear icon) → **Graphics** and select **Low Quality**. This automatically:
- Disables dynamic shadow mapping
- Disables ambient dust particle simulations
- Caps device pixel ratio to 1.0
- Switches to low-power GPU profile

### Audio Not Playing
Modern browsers require a user interaction (such as a click or tap) before allowing Web Audio playback. Simply click any piece or button to initialize the audio context.

---

## 📄 License

Distributed under the **MIT License**.
