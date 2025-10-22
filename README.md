# LG Interactive Backend (Next.js + Socket.io)

Backend environment for mobile-tv-display interaction using Next.js and Socket.io

## 🏗️ Architecture

### Data Flow
```
[Mobile] → Server → Controller Input → OpenAI API → Controller Output → Server → [Device/Mobile/Entrance]
```

### Components

1. **Mobile Clients** (M1, M2, M3)
   - Events: `mobile-new-user`, `mobile-new-name`, `mobile-new-voice`

2. **Server** (Communication Hub)
   - Next.js custom server with Socket.io
   - Routes all signals to appropriate destinations

3. **Devices**
   - MW1 (Media Wall 1)
   - SBM1 (LG StandByMe Display)
   - TV1, TV2
   - SW1, SW2

## 📁 Project Structure

```
lginter_backend/
├── pages/                  # Next.js Pages Router
│   ├── _app.js            # App wrapper
│   ├── sbm1.js            # QR code display page
│   ├── mobile1.js         # Mobile input page
│   └── mediawall1.js      # Display wall page
├── components/            # Reusable React components
│   ├── GradientBackground.js
│   ├── QRCodeDisplay.js
│   ├── IPConfig.js
│   ├── NicknameForm.js
│   └── NicknameCard.js
├── hooks/                 # Custom React hooks (Legacy)
│   └── useSocket.js       # Socket.io client hook
├── utils/                 # Utility functions and hooks
│   ├── constants.js       # Configuration constants
│   └── hooks/             # Device-specific socket hooks
│       ├── socketEvents.js    # Event constants and payload creators
│       ├── useSocketMobile.js # Mobile device hook
│       ├── useSocketSBM1.js   # SBM1 QR display hook
│       ├── useSocketMW1.js    # MediaWall1 display hook
│       ├── useSocketTV1.js    # TV1 state hook
│       ├── useSocketTV2.js    # TV2 aggregated data hook
│       ├── useSocketSW1.js    # SW1 climate control hook
│       └── useSocketSW2.js    # SW2 ambience control hook
├── styles/               # Global styles
│   └── globals.css
├── public/               # Static files (legacy HTML)
├── server.js            # Next.js custom server with Socket.io
└── package.json
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
- **SBM1**: http://192.168.45.33:3000/sbm1
- **Mobile1**: http://192.168.45.33:3000/mobile1
- **MediaWall1**: http://192.168.45.33:3000/mediawall1

⚠️ **Important**: Make sure all devices are on the same WiFi network!

## 🔄 Current Implementation

### Simple Flow (Phase 1)
1. SBM1 displays QR code with animated gradient background
2. User scans QR code with mobile device
3. Mobile1 shows UI to input nickname
4. User enters nickname → appears on MediaWall1 in real-time

## 📡 Event Codes

### Currently Implemented
- ✅ `mobile-new-name` (Mobile → Server → MediaWall)
- ✅ `display-new-name` (Server → MediaWall)

### Future Implementation
- ⏳ `mobile-new-user`
- ⏳ `mobile-new-voice`
- ⏳ `controller-new-decision`
- ⏳ `controller-new-voice`
- ⏳ `controller-new-name`
- ⏳ `device-new-voice`
- ⏳ `device-new-decision`
- ⏳ `entrance-new-user`
- ⏳ `entrance-new-name`

## 🎨 Tech Stack

- **Frontend**: Next.js (Pages Router), React 19
- **Backend**: Node.js, Next.js Custom Server
- **Real-time**: Socket.io
- **Styling**: CSS-in-JS (styled-jsx)
- **Utilities**: QRCode.js

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

## 🔐 Environment
Create a `.env.local` file (not committed) with:

```
NEXT_PUBLIC_SOCKET_URL=http://192.168.45.33:3000
NEXT_PUBLIC_SOCKET_PATH=/socket.io/
OPENAI_API_KEY=sk-...
```

- Socket URL/Path are read by hooks via `utils/constants.js`.
- POST `/api/openai` with `{ model, messages }` to use the proxy.
