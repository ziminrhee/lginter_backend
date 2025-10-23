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

  // 사용자 니즈 관리 시스템
  const userNeeds = new Map(); // userId -> { temperature, humidity, lightColor, song, priority, timestamp }
  const deviceAssignments = {
    temperature: null,  // { userId, value, priority, timestamp }
    humidity: null,
    light: null,
    music: null
  };

  // 15초마다 다음 우선순위 사용자로 교체
  const ROTATION_INTERVAL = 15000; // 15초
  let rotationTimers = {
    temperature: null,
    humidity: null,
    light: null,
    music: null
  };

  // 우선순위 계산 및 디바이스 할당
  function assignDevices() {
    console.log('\n🔄 ===== 디바이스 재할당 시작 =====');
    console.log('현재 사용자 니즈:', Array.from(userNeeds.entries()));
    
    const users = Array.from(userNeeds.entries());
    if (users.length === 0) {
      console.log('⚠️ 등록된 사용자 없음');
      return;
    }

    const parameters = ['temperature', 'humidity', 'light', 'music'];
    const newAssignments = { temperature: null, humidity: null, light: null, music: null };

    // 각 파라미터별로 가장 높은 우선순위 사용자를 찾음
    for (const param of parameters) {
      let bestUser = null;
      let bestPriority = -1;

      // 모든 사용자 중에서 해당 파라미터의 우선순위가 가장 높은 사용자 찾기
      for (const [userId, needs] of users) {
        const priority = needs.priority[param] || 0;
        if (priority > bestPriority) {
          bestPriority = priority;
          bestUser = userId;
        }
      }

      if (bestUser) {
        const needs = userNeeds.get(bestUser);
        newAssignments[param] = {
          userId: bestUser,
          value: param === 'temperature' ? needs.temperature :
                 param === 'humidity' ? needs.humidity :
                 param === 'light' ? needs.lightColor :
                 needs.song,
          priority: bestPriority,
          timestamp: Date.now()
        };
        console.log(`✅ ${param}: ${bestUser} (우선순위 ${bestPriority}%)`);
      }
    }

    // 할당 업데이트
    Object.assign(deviceAssignments, newAssignments);

    // SW1으로 온도/습도 전송
    if (deviceAssignments.temperature || deviceAssignments.humidity) {
      io.emit('device-decision', {
        device: 'sw1',
        temperature: deviceAssignments.temperature?.value || 22,
        humidity: deviceAssignments.humidity?.value || 50,
        assignedUsers: {
          temperature: deviceAssignments.temperature?.userId || 'N/A',
          humidity: deviceAssignments.humidity?.userId || 'N/A'
        },
        timestamp: Date.now()
      });
      console.log('📡 SW1으로 전송 완료');
    }

    // SW2로 조명/음악 전송
    if (deviceAssignments.light || deviceAssignments.music) {
      io.emit('device-decision', {
        device: 'sw2',
        lightColor: deviceAssignments.light?.value || '#FFFFFF',
        song: deviceAssignments.music?.value || 'N/A',
        assignedUsers: {
          light: deviceAssignments.light?.userId || 'N/A',
          music: deviceAssignments.music?.userId || 'N/A'
        },
        timestamp: Date.now()
      });
      console.log('📡 SW2로 전송 완료');
    }

    console.log('===== 디바이스 재할당 완료 =====\n');

    // 15초 후 자동 재할당 타이머 설정
    Object.keys(rotationTimers).forEach(key => {
      if (rotationTimers[key]) clearTimeout(rotationTimers[key]);
      rotationTimers[key] = setTimeout(() => {
        console.log(`⏰ ${key} 자동 교체 시간 (15초 경과)`);
        assignDevices();
      }, ROTATION_INTERVAL);
    });
  }

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
      console.log('Received device-new-decision:', data);
      io.emit('device-decision', data);
    });

    socket.on('device-new-voice', (data) => {
      console.log('Received device-new-voice:', data);
      io.emit('device-voice', data);
    });

    // 사용자 니즈 수신 및 우선순위 계산
    socket.on('user-needs', (data) => {
      console.log('\n📥 SERVER: Received user-needs:', data);
      
      // 사용자 니즈 저장
      userNeeds.set(data.userId, {
        temperature: data.temperature,
        humidity: data.humidity,
        lightColor: data.lightColor,
        song: data.song,
        priority: data.priority,
        timestamp: data.timestamp
      });

      console.log(`✅ ${data.userId} 니즈 등록 완료`);
      console.log(`   우선순위: 온도=${data.priority.temperature}%, 습도=${data.priority.humidity}%, 조명=${data.priority.light}%, 음악=${data.priority.music}%`);
      
      // 즉시 디바이스 재할당
      assignDevices();
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

