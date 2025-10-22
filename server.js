const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  const io = new Server(server, {
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Mobile events - broadcast to MW1 and TV1
    socket.on('mobile-new-name', (data) => {
      console.log('🔔 SERVER: Received mobile-new-name:', data);
      // MW1과 TV1에 동시에 브로드캐스트
      console.log('📡 SERVER: Broadcasting display-new-name to all clients');
      io.emit('display-new-name', data);
      console.log('✅ SERVER: Broadcast complete');
    });

    socket.on('mobile-new-user', (data) => {
      console.log('Received mobile-new-user:', data);
      io.emit('user-connected', data);
    });

    socket.on('mobile-new-voice', (data) => {
      console.log('Received mobile-new-voice:', data);
      io.emit('voice-update', data);
    });

    // New device-specific events
    socket.on('sbm1-new-qr', (data) => {
      console.log('Received sbm1-new-qr:', data);
      io.emit('qr-generated', data);
    });

    socket.on('sbm1-new-user', (data) => {
      console.log('Received sbm1-new-user:', data);
      io.emit('entrance-new-user', data);
    });

    socket.on('mw1-display-welcome', (data) => {
      console.log('Received mw1-display-welcome:', data);
      io.emit('welcome-display', data);
    });

    socket.on('tv1-update-state', (data) => {
      console.log('Received tv1-update-state:', data);
      io.emit('tv1-state-changed', data);
    });

    socket.on('tv2-show-aggregated', (data) => {
      console.log('Received tv2-show-aggregated:', data);
      io.emit('aggregated-data', data);
    });

    socket.on('device-new-decision', (data) => {
      console.log('🎯 SERVER: Received device-new-decision:', data);
      console.log('📡 SERVER: Broadcasting device-new-decision to all clients');
      io.emit('device-new-decision', data);
      console.log('✅ SERVER: Broadcast complete');
    });

    socket.on('device-new-voice', (data) => {
      console.log('Received device-new-voice:', data);
      io.emit('device-voice', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(port, hostname, () => {
    console.log(`\n🚀 Server running on port ${port}`);
    console.log(`\n📍 Access from this computer:`);
    console.log(`  - Mobile:   http://localhost:${port}/mobile`);
    console.log(`  - Entrance:`);
    console.log(`      · MW1:  http://localhost:${port}/entrance/mw1`);
    console.log(`      · TV1:  http://localhost:${port}/entrance/tv1`);
    console.log(`      · SBM1: http://localhost:${port}/entrance/sbm1`);
    console.log(`  - Livingroom:`);
    console.log(`      · SW1:  http://localhost:${port}/livingroom/sw1`);
    console.log(`      · SW2:  http://localhost:${port}/livingroom/sw2`);
    console.log(`      · TV2:  http://localhost:${port}/livingroom/tv2`);
    console.log(`\n📱 Access from mobile (use your local IP):`);
    console.log(`  - Mobile:   http://192.168.45.33:${port}/mobile`);
    console.log(`  - Entrance:`);
    console.log(`      · MW1:  http://192.168.45.33:${port}/entrance/mw1`);
    console.log(`      · TV1:  http://192.168.45.33:${port}/entrance/tv1`);
    console.log(`      · SBM1: http://192.168.45.33:${port}/entrance/sbm1`);
    console.log(`  - Livingroom:`);
    console.log(`      · SW1:  http://192.168.45.33:${port}/livingroom/sw1`);
    console.log(`      · SW2:  http://192.168.45.33:${port}/livingroom/sw2`);
    console.log(`      · TV2:  http://192.168.45.33:${port}/livingroom/tv2`);
    console.log(`\n⚠️  Make sure your mobile device is on the same WiFi network!`);
  });
});

