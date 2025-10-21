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

    // Handle mobile-new-name event from Mobile
    socket.on('mobile-new-name', (data) => {
      console.log('Received mobile-new-name:', data);
      
      // Broadcast to all clients (especially MediaWall)
      io.emit('display-new-name', data);
    });

    // Handle mobile-new-user event
    socket.on('mobile-new-user', (data) => {
      console.log('Received mobile-new-user:', data);
      io.emit('user-connected', data);
    });

    // Handle mobile-new-voice event
    socket.on('mobile-new-voice', (data) => {
      console.log('Received mobile-new-voice:', data);
      io.emit('voice-update', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(port, hostname, () => {
    console.log(`\n🚀 Server running on port ${port}`);
    console.log(`\n📍 Access from this computer:`);
    console.log(`  - SBM1: http://localhost:${port}/sbm1`);
    console.log(`  - Mobile1: http://localhost:${port}/mobile1`);
    console.log(`  - MediaWall1: http://localhost:${port}/mediawall1`);
    console.log(`\n📱 Access from mobile (use your local IP):`);
    console.log(`  - SBM1: http://172.20.10.2:${port}/sbm1`);
    console.log(`  - Mobile1: http://172.20.10.2:${port}/mobile1`);
    console.log(`  - MediaWall1: http://172.20.10.2:${port}/mediawall1`);
    console.log(`\n⚠️  Make sure your mobile device is on the same WiFi network!`);
  });
});

