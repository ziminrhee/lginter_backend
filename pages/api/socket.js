import { Server } from "socket.io";
import {
  applyControllerDecision,
  getFlags,
  getState,
  recordMobileFeeling,
} from "@/src/brain/mutations.js";
import { deriveDeviceEffects } from "@/src/controller/selectors.js";
import {
  addStatusListener,
  enqueueDeviceActions,
  getStatus,
} from "@/src/services/deviceQueue.js";

export const config = {
  api: { bodyParser: false },
};

const queueListenerState = { attached: false };

function broadcastControllerStatus(io) {
  const state = getState();
  const status = getStatus();
  io.to("controller").emit("controller-device-status", {
    queue: status.queue,
    history: status.history,
    lastError: status.lastError,
    processing: status.processing,
    aggregateEnv: state.aggregate.env,
    lastDecision: state.lastDecision,
    lastFeeling: state.lastFeeling,
    flags: state.flags,
  });
}

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  if (!queueListenerState.attached) {
    addStatusListener(() => broadcastControllerStatus(io));
    queueListenerState.attached = true;
  }

  const userNeeds = new Map();
  const deviceAssignments = {
    temperature: null,
    humidity: null,
    light: null,
    music: null,
  };

  const ROTATION_INTERVAL = 15000;
  const rotationTimers = {
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

    socket.on("mobile-init", (payload) => {
      socket.join("mobile");
      if (payload?.userId) socket.join(`user:${payload.userId}`);
    });
    socket.on("livingroom-init", () => socket.join("livingroom"));
    socket.on("entrance-init", () => socket.join("entrance"));
    socket.on("controller-init", () => {
      socket.join("controller");
      broadcastControllerStatus(io);
    });

    socket.on("mobile-new-name", (data) => {
      console.log("📱 Server received mobile-new-name:", data);
      io.to("controller").emit("mobile-new-name", data);
      io.to("entrance").emit("entrance-new-name", { userId: data.userId, name: data.name });
      io.emit("new-name", data);
    });

    socket.on("mobile-new-user", (data) => {
      console.log("📱 Server received mobile-new-user:", data);
      io.to("controller").emit("mobile-new-user", data);
      io.to("entrance").emit("entrance-new-user", { userId: data.userId, name: data.name });
      io.emit("new-user", data);
    });

    socket.on("mobile-new-voice", (data) => {
      console.log("📱 Server received mobile-new-voice:", data);
      io.to("controller").emit("mobile-new-voice", data);
      io.emit("new-voice-mobile", data);

      const updatedState = recordMobileFeeling({
        userId: data.userId,
        text: data.text || data.message,
        emotion: data.emotion,
      });
      broadcastControllerStatus(io);

      const flags = getFlags();
      if (!flags.emergencyStop) {
        const actions = deriveDeviceEffects({
          decision: updatedState.lastDecision,
          state: updatedState,
        });
        if (actions.length) {
          enqueueDeviceActions(actions, {
            origin: updatedState.lastFeeling?.keyword
              ? `feeling:${updatedState.lastFeeling.keyword}`
              : "feeling",
          });
        }
      }
    });

    socket.on("controller-new-decision", (data) => {
      console.log("🎮 Server received controller-new-decision:", data);
      io.to("livingroom").emit("device-new-decision", { env: data.params, mergedFrom: [data.userId] });
      io.to(`user:${data.userId}`).emit("mobile-new-decision", { userId: data.userId, params: data.params, reason: data.reason });
      io.emit("device-decision", { device: "sw2", lightColor: data.params?.lightColor, song: data.params?.music });
      io.emit("device-decision", { device: "sw1", temperature: data.params?.temp, humidity: data.params?.humidity });

      const updatedState = applyControllerDecision(data);
      broadcastControllerStatus(io);

      const flags = getFlags();
      if (!flags.emergencyStop) {
        const actions = deriveDeviceEffects({ decision: data, state: updatedState });
        if (actions.length) {
          enqueueDeviceActions(actions, {
            origin: data.reason ? `decision:${data.reason}` : "decision",
          });
        }
      }
    });

    socket.on("controller-new-voice", (data) => {
      console.log("🎮 Server received controller-new-voice:", data);
      io.to("livingroom").emit("device-new-voice", data);
      io.emit("new-voice-device", data);
    });

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

  res.end();
}
