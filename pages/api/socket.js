// Minimal Socket.IO server for Next.js API route (migrated from external server.js)

export const config = {
  api: { bodyParser: false },
};

export default function handler(req, res) {
  if (res.socket.server.io) {
    // Socket already initialized
    res.end();
    return;
  }

  const { Server } = require("socket.io");

  const io = new Server(res.socket.server, {
    path: "/api/socketio",
    addTrailingSlash: false,
    transports: ["websocket", "polling"],
  });

  // 사용자 니즈 관리 시스템 (migrated from server.js)
  const userNeeds = new Map(); // userId -> { temperature, humidity, lightColor, song, priority, timestamp }
  const deviceAssignments = {
    temperature: null, // { userId, value, priority, timestamp }
    humidity: null,
    light: null,
    music: null,
  };

  const ROTATION_INTERVAL = 15000; // 15초
  let rotationTimers = {
    temperature: null,
    humidity: null,
    light: null,
    music: null,
  };

  function assignDevices() {
    console.log("🔄 assignDevices() called");
    const users = Array.from(userNeeds.entries());
    console.log(`👥 Total users in userNeeds: ${users.length}`);
    
    if (users.length === 0) {
      console.log("⚠️ No users in userNeeds, returning");
      return;
    }

    const parameters = ["temperature", "humidity", "light", "music"];
    const newAssignments = { temperature: null, humidity: null, light: null, music: null };

    for (const param of parameters) {
      let bestUser = null;
      let bestPriority = -1;
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
          value:
            param === "temperature"
              ? needs.temperature
              : param === "humidity"
              ? needs.humidity
              : param === "light"
              ? needs.lightColor
              : needs.song,
          priority: bestPriority,
          timestamp: Date.now(),
        };
        console.log(`✅ ${param}: assigned to ${bestUser} (priority: ${bestPriority})`);
      }
    }

    Object.assign(deviceAssignments, newAssignments);

    // SW1으로 온도/습도 전송
    if (deviceAssignments.temperature || deviceAssignments.humidity) {
      const sw1Data = {
        device: "sw1",
        temperature: deviceAssignments.temperature?.value || 22,
        humidity: deviceAssignments.humidity?.value || 50,
        assignedUsers: {
          temperature: deviceAssignments.temperature?.userId || "N/A",
          humidity: deviceAssignments.humidity?.userId || "N/A",
        },
        timestamp: Date.now(),
      };
      console.log("📡 Emitting device-decision to SW1:", sw1Data);
      io.emit("device-decision", sw1Data);
    }

    // SW2로 조명/음악 전송
    if (deviceAssignments.light || deviceAssignments.music) {
      const sw2Data = {
        device: "sw2",
        lightColor: deviceAssignments.light?.value || "#FFFFFF",
        song: deviceAssignments.music?.value || "N/A",
        assignedUsers: {
          light: deviceAssignments.light?.userId || "N/A",
          music: deviceAssignments.music?.userId || "N/A",
        },
        timestamp: Date.now(),
      };
      console.log("📡 Emitting device-decision to SW2:", sw2Data);
      io.emit("device-decision", sw2Data);
    }

    // 15초 후 자동 재할당 타이머 설정
    Object.keys(rotationTimers).forEach((key) => {
      if (rotationTimers[key]) clearTimeout(rotationTimers[key]);
      rotationTimers[key] = setTimeout(() => {
        console.log("⏰ Rotation timer triggered, reassigning devices");
        assignDevices();
      }, ROTATION_INTERVAL);
    });
  }

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);
    
    // Mobile events - broadcast to MW1 and TV1
    socket.on("mobile-new-name", (data) => {
      console.log("📱 Server received mobile-new-name:", data);
      io.emit("new-name", data);
      console.log("📡 Server broadcasted new-name to all clients");
    });

    socket.on("mobile-new-user", (data) => {
      console.log("📱 Server received mobile-new-user:", data);
      io.emit("new-user", data);
      console.log("📡 Server broadcasted new-user to all clients");
    });

    socket.on("mobile-new-voice", (data) => {
      console.log("📱 Server received mobile-new-voice:", data);
      io.emit("new-voice-mobile", data);
      console.log("📡 Server broadcasted new-voice-mobile to all clients");
    });


    socket.on("device-new-decision", (data) => {
      console.log("🎮 Server received device-new-decision:", data);
      io.emit("device-decision", data);
      console.log("📡 Server broadcasted device-decision to all clients");
    });

    socket.on("device-new-voice", (data) => {
      console.log("🎮 Server received device-new-voice:", data);
      io.emit("new-voice-device", data);
      console.log("📡 Server broadcasted new-voice-device to all clients");
    });

    // 사용자 니즈 수신 및 우선순위 계산
    socket.on("mobile-user-needs", (data) => {
      console.log("🎯 Server received mobile-user-needs:", data);
      userNeeds.set(data.userId, {
        temperature: data.temperature,
        humidity: data.humidity,
        lightColor: data.lightColor,
        song: data.song,
        priority: data.priority,
        timestamp: data.timestamp,
      });
      console.log(`📊 UserNeeds Map updated. Total users: ${userNeeds.size}`);
      assignDevices();
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  res.socket.server.io = io;
  res.end();
}
