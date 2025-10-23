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
    const users = Array.from(userNeeds.entries());
    if (users.length === 0) {
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
      }
    }

    Object.assign(deviceAssignments, newAssignments);

    // SW1으로 온도/습도 전송
    if (deviceAssignments.temperature || deviceAssignments.humidity) {
      io.emit("device-decision", {
        device: "sw1",
        temperature: deviceAssignments.temperature?.value || 22,
        humidity: deviceAssignments.humidity?.value || 50,
        assignedUsers: {
          temperature: deviceAssignments.temperature?.userId || "N/A",
          humidity: deviceAssignments.humidity?.userId || "N/A",
        },
        timestamp: Date.now(),
      });
    }

    // SW2로 조명/음악 전송
    if (deviceAssignments.light || deviceAssignments.music) {
      io.emit("device-decision", {
        device: "sw2",
        lightColor: deviceAssignments.light?.value || "#FFFFFF",
        song: deviceAssignments.music?.value || "N/A",
        assignedUsers: {
          light: deviceAssignments.light?.userId || "N/A",
          music: deviceAssignments.music?.userId || "N/A",
        },
        timestamp: Date.now(),
      });
    }

    // 15초 후 자동 재할당 타이머 설정
    Object.keys(rotationTimers).forEach((key) => {
      if (rotationTimers[key]) clearTimeout(rotationTimers[key]);
      rotationTimers[key] = setTimeout(() => {
        assignDevices();
      }, ROTATION_INTERVAL);
    });
  }

  io.on("connection", (socket) => {
    // Mobile events - broadcast to MW1 and TV1
    socket.on("mobile-new-name", (data) => {
      io.emit("new-name", data);
    });

    socket.on("mobile-new-user", (data) => {
      io.emit("new-user", data);
    });

    socket.on("mobile-new-voice", (data) => {
      io.emit("new-voice-mobile", data);
    });


    socket.on("device-new-decision", (data) => {
      io.emit("device-decision", data);
    });

    socket.on("device-new-voice", (data) => {
      io.emit("new-voice-device", data);
    });

    // 사용자 니즈 수신 및 우선순위 계산
    socket.on("mobile-user-needs", (data) => {
      userNeeds.set(data.userId, {
        temperature: data.temperature,
        humidity: data.humidity,
        lightColor: data.lightColor,
        song: data.song,
        priority: data.priority,
        timestamp: data.timestamp,
      });
      assignDevices();
    });

    socket.on("disconnect", () => {
      // client disconnected
    });
  });

  res.socket.server.io = io;
  res.end();
}
