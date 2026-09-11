<div align="center">

<img src="./assets/banner.svg" alt="Chessverse 3D Banner" width="100%" />

# ⚡ CHESSVERSE 3D
### *Next-Generation 3D WebGL Chess & Real-Time Multiplayer Platform*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebSockets](https://img.shields.io/badge/WebSockets-Real--Time-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Zero Paid API](https://img.shields.io/badge/API-Zero_Paid_APIs-10B981?style=for-the-badge&logo=checkmarx&logoColor=white)](#-zero-paid-api-guarantee)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Play in stunning 3D WebGL • Challenge offline Minimax AI • Battle friends online with real-time WebSockets • 100% Free & Self-Contained</b>
</p>

[🎮 Live Demo](#-quick-start) • [✨ Key Features](#-features) • [🕹️ Game Modes](#-game-modes) • [🤖 Local AI Engine](#-offline-ai-engine) • [🛠️ Tech Stack](#-tech-stack) • [🚀 Quick Start](#-quick-start)

---

</div>

## 🌟 Highlights

- 🎲 **Photorealistic 3D Chessboard**: Custom-sculpted procedural 3D chess pieces rendered in WebGL via Three.js and React Three Fiber.
- 🚀 **Smooth Parabolic Animations**: Dynamic piece lifts and physical arc trajectories during moves, with smooth capture disintegrations.
- 🎥 **Full Orbit & Perspective Controls**: 360° rotation, pitch tilt, smooth zoom, and instant 2D/3D perspective toggle.
- 🤖 **Offline Heuristic AI Opponent**: Minimax algorithm with Alpha-Beta pruning, piece-square valuation matrices, and 5 distinct difficulty tiers (Trainee to Grandmaster)—**100% local, no API required**.
- 🌐 **Real-Time WebSocket Multiplayer**: Low-latency room matchmaking, instant 6-character room codes, live game clocks, chat, and spectator mode.
- 🎵 **Procedural Web Audio Synthesizer**: Zero audio file downloads—synthesizes sliding, capture, check, and victory chimes directly through the browser's Web Audio API.
- 📚 **Opening Theory & Puzzle Trainer**: Explore grandmaster opening repertoires (Sicilian, Ruy Lopez, King's Indian) and solve rated tactical puzzles with immediate move validation.
- 🔒 **Zero Paid APIs / Free Forever**: Entirely self-contained. No third-party API subscriptions, token limits, or ongoing costs.

---

## 🕹️ Game Modes

| Mode | Description | Architecture |
| :--- | :--- | :--- |
| **🎮 Pass & Play (Local)** | Play on the same screen or analyze games. Choose from Blitz, Rapid, Bullet, or Fischer increment clocks. | 100% Client-Side (`chess.js`) |
| **🤖 Vs Computer** | 5 difficulty levels ranging from Trainee (depth 1, intentional blunders) to Grandmaster (depth 4-5, optimal alpha-beta search). | Local Heuristic Minimax Engine |
| **🌐 Online Multiplayer** | Create or join private rooms with unique room codes. Supports live move streaming, draw offers, resignations, and chat. | WebSocket Server (`server.ts`) |
| **📖 Opening Explorer** | Master classical and hypermodern chess openings with interactive board setups, move paths, and ECO annotations. | Interactive FEN Lessons |
| **🧩 Tactical Puzzles** | Rated chess puzzles testing forks, pins, skewers, deflection, and back-rank checkmates. | Move Sequence Validator |

---

## 🤖 Offline AI Engine

Unlike cloud-dependent chess platforms, **Chessverse 3D** embeds an optimized, lightweight heuristic chess engine written in TypeScript that runs locally in your browser:

```
                      [ Root Position (FEN) ]
                                 │
              ┌──────────────────┴──────────────────┐
        [ Alpha-Beta Search ]                 [ Move Ordering ]
              │                                     │
   ┌──────────┴──────────┐               ┌──────────┴──────────┐
[ Material Evaluation ]  [ Positional Tables ]  [ Tactical Blunder Scaling ]
(P=100, N=320, B=330...) (Center control, ranks) (Difficulty tiers 1-5)
```

- **Difficulty 1 (Trainee)**: Depth 1 • 450ms thinking delay • 40% blunder frequency
- **Difficulty 2 (Club Player)**: Depth 2 • 600ms thinking delay • 18% blunder frequency
- **Difficulty 3 (Candidate Master)**: Depth 3 • 750ms thinking delay • 5% blunder frequency
- **Difficulty 4 (Master)**: Depth 3 • 1000ms thinking delay • 0% blunder frequency
- **Difficulty 5 (Grandmaster)**: Depth 4-5 • 1200ms thinking delay • Deep positional evaluation

---

## 🛠️ Tech Stack

```
Frontend:
  ├── React 18 (Concurrent Mode, Hooks, Memoization)
  ├── TypeScript 5 (Strict Type Safety)
  ├── Vite (Lightning-fast HMR and bundling)
  ├── Tailwind CSS (Modern utility-first styling)
  └── Lucide React (Pixel-perfect vector iconography)

3D Graphics & Audio:
  ├── Three.js (WebGL 3D Rendering)
  ├── @react-three/fiber (Declarative Three.js in React)
  ├── @react-three/drei (OrbitControls, Canvas Helpers)
  └── Web Audio API (Procedural sound synthesizer)

Chess Logic & State:
  ├── chess.js (FIDE standard rule validation)
  └── Zustand (Predictable global state management)

Backend & Multiplayer:
  ├── Node.js + Express (Production static server + REST)
  └── ws (High-performance WebSocket server on port 3000)
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or later)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/chessverse-3d.git
cd chessverse-3d
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser to start playing!

### 4. Build for production
```bash
npm run build
npm start
```

---

## 📁 Project Architecture

```
chessverse-3d/
├── assets/
│   └── banner.svg             # Animated 3D Isometric GitHub Banner
├── public/
│   └── banner.svg             # Web-accessible banner asset
├── server.ts                  # Express server & WebSocket matchmaking room engine
├── src/
│   ├── 3d/                    # Three.js / React Three Fiber components
│   │   ├── AnimatedPiece.tsx  # Parabolic move interpolation & piece rendering
│   │   ├── Board3D.tsx        # 3D wooden/marble board mesh & coordinates
│   │   ├── CameraController.tsx # OrbitControls & dynamic camera presets
│   │   ├── ChessCanvas.tsx    # 3D WebGL Canvas container & identity tracking
│   │   └── Lighting.tsx       # Studio ambient, directional, & spot lighting
│   ├── components/
│   │   ├── board/             # 2D fallback chessboard & evaluation bar
│   │   ├── game/              # Move history, captured pieces, clock panels
│   │   └── ui/                # Navigation, promotion modal, game-over modal
│   ├── pages/
│   │   ├── PlayView.tsx       # Pass & Play local two-player view
│   │   ├── VsAiView.tsx       # Player vs Local AI with difficulty selection
│   │   ├── OnlineView.tsx     # Real-time WebSocket room lobby & arena
│   │   ├── LearnView.tsx      # Grandmaster opening library
│   │   ├── PuzzlesView.tsx    # Interactive tactical puzzles
│   │   └── ProfileView.tsx    # Elo rating & game history statistics
│   ├── services/
│   │   ├── aiEngine.ts        # Heuristic Minimax AI with Alpha-Beta pruning
│   │   ├── multiplayer.ts     # Client WebSocket manager & room dispatcher
│   │   ├── sound.ts           # Procedural Web Audio API sound synthesizer
│   │   └── storage.ts         # LocalStorage persistence for user stats
│   ├── store/
│   │   └── gameStore.ts       # Global Zustand state orchestrator
│   ├── types/
│   │   └── chess.ts           # Shared TypeScript interfaces & types
│   ├── App.tsx                # View router & application root
│   └── main.tsx               # React DOM entry point
└── package.json
```

---

## 🛡️ Zero Paid API Guarantee

This project is engineered with a strict **Zero External API** philosophy:
- ❌ No OpenAI, Anthropic, or paid LLM tokens required.
- ❌ No external Stockfish cloud servers or rate limits.
- ❌ No third-party audio CDNs or hosted model assets.
- ❌ No database or authentication subscriptions.
- ✅ **100% Free Forever**: Fully functional upon deployment with zero runtime operating cost.

---

## ⌨️ Controls & Gestures

- **Left Mouse Click / Tap**: Select piece and target destination square.
- **Drag & Drop**: Pick up and drop pieces directly on the 3D board.
- **Left Click + Drag (Background)**: Orbit & rotate the 3D camera around the board.
- **Right Click + Drag**: Pan the camera.
- **Scroll Wheel / Pinch**: Zoom in and out.
- **Perspective Button**: Toggle instantly between top-down 2D and immersive 3D views.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for chess lovers, grandmasters, and developers worldwide.</sub>
</div>
