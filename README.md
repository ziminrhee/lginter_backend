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
├── hooks/                 # Custom React hooks
│   └── useSocket.js       # Socket.io client hook
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
- **SBM1**: http://172.20.10.2:3000/sbm1
- **Mobile1**: http://172.20.10.2:3000/mobile1
- **MediaWall1**: http://172.20.10.2:3000/mediawall1

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

---

Made with ❤️ for LG Interactive Exhibition
