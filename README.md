# LG Interactive Backend

Backend environment for mobile-tv-display interaction using Socket.io

## Architecture

### Data Flow
```
[Mobile] → Server → Controller Input → OpenAI API → Controller Output → Server → [Device/Mobile/Entrance]
```

### Components

1. **Mobile Clients** (M1, M2, M3)
   - Events: `mobile-new-user`, `mobile-new-name`, `mobile-new-voice`

2. **Server** (Communication Hub)
   - Receives events from Mobile, Controller, Device, Entrance
   - Routes all signals to appropriate destinations

3. **Devices**
   - MW1 (Media Wall 1)
   - SBM1 (LG StandByMe Display)
   - TV1, TV2
   - SW1, SW2

## Current Implementation

### Simple Flow (Phase 1)
1. SBM1 displays QR code
2. User scans QR code with M1 (Mobile)
3. M1 shows UI to input nickname
4. User enters nickname → appears on MW1 (MediaWall)

## Setup

```bash
# Install dependencies
yarn install

# Start server
yarn start
```

## Access Points

- **SBM1 (QR Display)**: http://localhost:3000/sbm1
- **Mobile1 (Input)**: http://localhost:3000/mobile1
- **MediaWall1 (Display)**: http://localhost:3000/mediawall1

## Event Codes

### From Mobile
- `mobile-new-user`
- `mobile-new-name`
- `mobile-new-voice`

### From Controller
- `controller-new-decision`
- `controller-new-voice`
- `controller-new-name`

### From Device
- `device-new-voice`
- `device-new-decision`

### From Entrance
- `entrance-new-user`
- `entrance-new-name`

## Tech Stack

- Node.js + Express
- Socket.io
- QRCode.js
- Vanilla JavaScript (ES6+)

