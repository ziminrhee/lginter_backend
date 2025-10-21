const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Routes for each client
app.get('/mobile1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile1.html'));
});

app.get('/mediawall1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mediawall1.html'));
});

app.get('/sbm1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sbm1.html'));
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

http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`SBM1: http://localhost:${PORT}/sbm1`);
  console.log(`Mobile1: http://localhost:${PORT}/mobile1`);
  console.log(`MediaWall1: http://localhost:${PORT}/mediawall1`);
});

