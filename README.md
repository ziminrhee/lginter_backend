# LG Interactive Backend (Next.js + Socket.io)

Backend environment for mobile-tv-display interaction using Next.js and Socket.io

## 🏗️ Architecture

### Controller = Single Source of Truth (SSoT)

**Key Principles:**
- Controller is the **only** component that calls OpenAI
- Mobile/devices **never** call AI directly
- All decisions flow through Controller → Hub → Devices
- In-memory state management (no database, DB-ready architecture)

### Data Flow
```
[Mobile] → Server(Hub) → Controller(Input) → OpenAI → Controller(Output) → Server → [LivingRoom/Entrance/Mobile(targeted)]
```

### Rooms & Events

**Rooms (namespace `/`):**
- `mobile` - All mobile clients
- `entrance` - MW1, SBM1, TV1 (display-only)
- `livingroom` - SW1, SW2, TV2 (actuators + dashboard)
- `controller` - Control tower (monitoring + decision)
- `user:{id}` - Per-user targeted feedback

**Event Names (verbatim):**

Mobile→Server:
- `mobile-new-user`
- `mobile-new-name`
- `mobile-new-voice`

Controller→Server:
- `controller-new-decision` (with params + reason)
- `controller-new-name`
- `controller-new-voice`

Server→LivingRoom:
- `device-new-decision` (split by device: TV2=all 4 params, SW1=temp/humidity, SW2=lightColor/music)
- `device-new-voice`

Server→Entrance:
- `entrance-new-user`
- `entrance-new-name`

Server→Mobile (targeted to `user:{id}`):
- `mobile-new-decision` (never broadcast)

### Components

1. **Mobile Clients**
   - Events: `mobile-new-user`, `mobile-new-name`, `mobile-new-voice`
   - Receives targeted `mobile-new-decision` on `user:{id}` room

2. **Server Hub** (`/api/socket`)
   - Next.js API route with Socket.io singleton (no Express)
   - Stateless router: validate → delegate → fan-out
   - TTL-based idempotency with `${event}:${uuid}` deduplication

3. **Controller** (`/controller`)
   - Single Source of Truth (in-memory state)
   - Only caller of OpenAI API
   - Per-user debounce queue (~500ms)
   - Computes 4 environment params: `{temp, humidity, lightColor, music}`

4. **Entrance Devices** (display-only)
   - MW1 (Media Wall 1), SBM1 (StandByMe QR), TV1
   - Listen to `entrance-new-user`, `entrance-new-name`

5. **LivingRoom Devices** (actuators)
   - SW1 (Climate: temp/humidity)
   - SW2 (Ambience: lightColor/music)
   - TV2 (Dashboard: all 4 params + reason)

## 📁 Project Structure

```
lginter_backend/
├── pages/                      # Next.js Pages Router
│   ├── _app.js                # App wrapper
│   ├── _document.js           # SSR for styled-components
│   ├── controller.js          # Control tower UI
│   ├── mobile.js              # Mobile input page
│   ├── api/                   # Next.js API routes
│   │   ├── socket.js          # Socket.io Hub (singleton, no Express)
│   │   ├── openai.js          # OpenAI proxy
│   │   ├── weather.js         # Weather API
│   │   └── whisper.js         # Whisper transcription
│   ├── entrance/
│   │   ├── mw1.js             # Media Wall
│   │   ├── sbm1.js            # StandByMe QR
│   │   └── tv1.js             # Entrance TV
│   ├── livingroom/
│   │   ├── sw1.js             # Climate control
│   │   ├── sw2.js             # Ambience control
│   │   └── tv2.js             # Dashboard
│   └── lab/
│       └── all-devices.js     # Test grid (6 tiles)
├── components/                # React components
│   ├── controller/
│   │   └── styles.js          # Styled-components (vw/vh)
│   ├── entrance/
│   │   ├── MW1/
│   │   ├── SBM1/
│   │   └── TV1/
│   ├── livingroom/
│   │   ├── SW1/
│   │   ├── SW2/
│   │   └── TV2/
│   └── mobile/
├── lib/brain/                 # Controller SSoT
│   └── state.js               # In-memory state + helpers
├── src/
│   ├── core/                  # Core logic (modular)
│   │   ├── schemas.js         # Zod validation models
│   │   ├── merge.js           # Fair-average policy
│   │   ├── color.js           # HSV/RGB utils
│   │   ├── events.js          # Event name constants
│   │   ├── id.js              # UUID generation
│   │   └── validate.js        # Validation helpers
│   └── services/
│       └── openai.service.js  # OpenAI with timeout/mock
├── utils/                     # Utilities and hooks
│   ├── constants.js           # Socket config
│   ├── hooks/                 # Device-specific socket hooks
│   │   ├── useSocketMobile.js
│   │   ├── useSocketController.js  # Controller orchestrator
│   │   ├── useSocketMW1.js
│   │   ├── useSocketSBM1.js (legacy)
│   │   ├── useSocketTV1.js
│   │   ├── useSocketTV2.js
│   │   ├── useSocketSW1.js
│   │   └── useSocketSW2.js
│   └── prompts/
│       └── emotionAnalysis.js # OpenAI system prompt
├── styles/
│   └── globals.css            # CSS reset + tokens
├── jsconfig.json              # Path aliases (@/*, @/src/*)
├── next.config.js             # styled-components compiler
├── package.json
└── yarn.lock
```

## 🚀 Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 📱 Access Points

### Local (Same Computer)
- **SBM1 (QR Display)**: http://localhost:3000/sbm1
- **Mobile1 (Input)**: http://localhost:3000/mobile1
- **MediaWall1 (Display)**: http://localhost:3000/mediawall1

### Network (Mobile/Other Devices)

**현재 접속 주소 (2025-10-30 기준):**
- **Mobile**: http://172.18.6.180:3000/mobile
- **Controller**: http://172.18.6.180:3000/controller
- **Lab (all devices)**: http://172.18.6.180:3000/lab/all-devices
- **Entrance**:
  - MW1: http://172.18.6.180:3000/entrance/mw1
  - SBM1: http://172.18.6.180:3000/entrance/sbm1
  - TV1: http://172.18.6.180:3000/entrance/tv1
- **LivingRoom**:
  - SW1: http://172.18.6.180:3000/livingroom/sw1
  - SW2: http://172.18.6.180:3000/livingroom/sw2
  - TV2: http://172.18.6.180:3000/livingroom/tv2

⚠️ **Important**: Make sure all devices are on the same WiFi network!

## 🔄 Implementation Status

### Core Features
- ✅ Controller = Single Source of Truth (SSoT)
- ✅ In-memory state management (`lib/brain/state.js`)
- ✅ Zod runtime validation with `safeParse`
- ✅ TTL-based idempotency (10 min, with GC)
- ✅ OpenAI integration (timeout + mock fallback)
- ✅ Per-user debounce queue (~500ms)
- ✅ Split fan-out policy (TV2/SW1/SW2)
- ✅ Targeted mobile feedback (`user:{id}`)
- ✅ Fair-average merge (temp/humidity, HSV lightColor, music majority)
- ✅ OpenAI Whisper for voice transcription
- ✅ Device heartbeats & error tracking
- ✅ Styled-components with vw/vh units
- ✅ Legacy alias toggle (`LEGACY_DEVICE_DECISION_ALIAS`)

### Event Flow
- ✅ `mobile-new-user` / `mobile-new-name` / `mobile-new-voice`
- ✅ `controller-new-decision` / `controller-new-name` / `controller-new-voice`
- ✅ `device-new-decision` (split: TV2 all, SW1 climate, SW2 ambience)
- ✅ `device-new-voice` (broadcast to livingroom)
- ✅ `entrance-new-user` / `entrance-new-name`
- ✅ `mobile-new-decision` (targeted to `user:{id}` only)

### TODO
- ⏳ Device snapshots UI panel
- ⏳ Ops toggles (emergency-stop, power control)
- ⏳ Vitest unit tests (merge/gc/idempotency)
- ⏳ E2E acceptance pass

## 🎨 Tech Stack

- **Frontend**: Next.js (Pages Router), React 19
- **Backend**: Next.js API Routes (no Express)
- **Real-time**: Socket.io (singleton at `/api/socket`)
- **Styling**: styled-components + CSS Modules
- **Validation**: Zod (runtime schema validation)
- **AI**: OpenAI GPT-4 (emotion analysis) + Whisper (voice)
- **State**: In-memory SSoT (DB-ready architecture)
- **Utils**: nanoid (UUID), qrcode.react (SVG QR)

## ✨ Features

- ✅ Next.js Pages Router architecture
- ✅ Reusable React components
- ✅ Socket.io real-time communication
- ✅ UUID + Timestamp data management
- ✅ Animated gradient background (5 blobs)
- ✅ Glassmorphism design
- ✅ Responsive UI
- ✅ QR code generation
- ✅ Network access support

## 🛠️ Development Notes

- Uses JavaScript (not TypeScript) as per project requirements
- Uses Next.js Pages Router (not App Router)
- Custom Socket.io server integration with Next.js
- All styling uses styled-jsx (CSS-in-JS)

## 📝 Data Structure

### mobile-new-name Event
```javascript
{
  uuid: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
  timestamp: '2025-10-21T08:39:05.673Z',
  nickname: 'User Name',
  clientId: 'socket-id'
}
```

## 🔌 New Socket Hook System

### Overview
The new system provides device-specific socket hooks for better organization and type safety. Each device has its own dedicated hook with standardized payload schemas.

### Available Hooks

#### `useSocketMobile.js`
- **Purpose**: Mobile device interactions
- **Events**: `mobile-new-user`, `mobile-new-name`, `mobile-new-voice`
- **Methods**: `emitNewUser()`, `emitNewName()`, `emitNewVoice()`

#### `useSocketSBM1.js`
- **Purpose**: QR code generation and entrance management
- **Events**: `sbm1-new-qr`, `sbm1-new-user`
- **Methods**: `emitNewQr()`, `emitSbm1NewUser()`

#### `useSocketMW1.js`
- **Purpose**: MediaWall display management
- **Events**: `mw1-display-welcome`
- **Methods**: `displayWelcome()`

#### `useSocketTV1.js`
- **Purpose**: TV1 state management
- **Events**: `tv1-update-state`
- **Methods**: `updateTv1State()`

#### `useSocketTV2.js`
- **Purpose**: TV2 aggregated data display
- **Events**: `tv2-show-aggregated`
- **Methods**: `showAggregated()`

#### `useSocketSW1.js`
- **Purpose**: Climate control (temperature/humidity)
- **Events**: `device-new-decision`, `device-new-voice`
- **Methods**: `emitClimateDecision()`, `emitDeviceVoice()`

#### `useSocketSW2.js`
- **Purpose**: Ambience control (music/lighting)
- **Events**: `device-new-decision`, `device-new-voice`
- **Methods**: `emitAmbienceDecision()`, `emitDeviceVoice()`

### Payload Schemas

All events use a standardized base payload:
```javascript
{
  uuid: "unique-identifier",
  ts: 1700000000000,        // timestamp
  source: "device-type",    // mobile, sbm1, mw1, etc.
  // ... device-specific data
}
```

### Usage Example

```javascript
import useSocketMobile from '../utils/hooks/useSocketMobile';

function MobileComponent() {
  const { socket, emitNewName, emitNewVoice } = useSocketMobile();
  
  const handleSubmit = (name) => {
    emitNewName(name, { language: 'ko' });
  };
  
  const handleVoice = (text, emotion) => {
    emitNewVoice(text, emotion, 0.8);
  };
  
  return (
    // Component JSX
  );
}
```

### Migration from Legacy System

The legacy `useSocket` hook is still available for backward compatibility. New components should use the device-specific hooks for better organization and type safety.

---

Made with ❤️ for LG Interactive Exhibition

## 🔐 Environment Variables

Create a `.env.local` file in the project root (not committed to git):

```bash
# OpenAI API (recommended for production, auto mock fallback if missing)
OPENAI_API_KEY=sk-...

# Socket.io Configuration (auto-detected via window.location, optional override)
# NEXT_PUBLIC_SOCKET_URL=http://172.18.6.65:3000
# NEXT_PUBLIC_SOCKET_PATH=/api/socket

# Optional: Weather API (free tier)
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key

# Optional: YouTube Data API (removed, music sources provided separately)
# NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key

# Legacy Compatibility (default: false)
# LEGACY_DEVICE_DECISION_ALIAS=false  # Emit old device-decision alongside canonical device-new-decision
```

### API Keys Setup Guide

1. **OpenAI API** (Recommended)
   - Sign up at: https://platform.openai.com/
   - Get API key from: https://platform.openai.com/api-keys
   - Used for: Emotion analysis (GPT-4) + voice transcription (Whisper)
   - Fallback: Auto mock mode if key missing (degraded, deterministic)

2. **OpenWeatherMap API** (Optional)
   - Sign up at: https://openweathermap.org/
   - Get free API key (1000 calls/day)
   - Used for: Weather-based greetings on mobile
   - Fallback: Works without API key (demo data)

### API Endpoints

- `POST /api/openai` - OpenAI proxy for emotion analysis (GPT-4)
- `POST /api/whisper` - OpenAI Whisper transcription proxy
- `GET /api/weather` - Weather-based greeting (Seoul)
- `GET /api/socket` - Socket.io Hub (WebSocket + polling)
