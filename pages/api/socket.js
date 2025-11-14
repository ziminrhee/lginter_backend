// Minimal Socket.IO server for Next.js API route (migrated from external server.js)

import { Server } from "socket.io";
import { nanoid } from "nanoid";
import {
  upsertUser,
  heartbeat as brainHeartbeat,
  setDeviceError,
  recordDecision,
  markSeen,
  isSeen,
  gcSeen,
  updateDeviceHeartbeat,
  updateDeviceApplied
} from "../../lib/brain/state";
import { MobileNewUser, MobileNewName, MobileNewVoice, ControllerDecision, DeviceHeartbeat, safe } from "../../src/core/schemas";

export const config = {
  api: { bodyParser: false },
};

export default function handler(req, res) {
  if (res.socket.server.io) {
    // Socket already initialized
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    // transports: ["websocket", "polling"],
  });

  // periodic GC for TTL idempotency map
  setInterval(() => {
    try { gcSeen(Date.now()); } catch {}
  }, 10 * 60 * 1000); // 10 minutes

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);
    // --- Init & Rooms ---
    socket.on("mobile-init", (p) => {
      socket.join("mobile");
      if (p?.userId) {
        socket.join(`user:${p.userId}`);
        console.log(`✅ Mobile ${socket.id} joined room: user:${p.userId}`);
      }
    });
    socket.on("livingroom-init", () => socket.join("livingroom"));
    socket.on("entrance-init", () => socket.join("entrance"));
    socket.on("controller-init", () => socket.join("controller"));

    // Device-specific init → map to rooms (keep event names)
    socket.on("mw1-init", () => socket.join("entrance"));
    socket.on("mv2-init", () => socket.join("entrance"));
    socket.on("sbm1-init", () => socket.join("entrance"));
    socket.on("tv1-init", () => socket.join("entrance"));
    socket.on("sw1-init", () => socket.join("livingroom"));
    socket.on("sw2-init", () => socket.join("livingroom"));
    socket.on("tv2-init", () => socket.join("livingroom"));

    // Mobile events - forward to Controller; entrance mirrors for user/name
    socket.on("mobile-new-name", (raw) => {
      const data = { uuid: raw?.uuid || nanoid(), ts: raw?.ts || Date.now(), ...raw };
      const idKey = `mobile-new-name:${data.uuid}`;
      if (isSeen(idKey)) return; markSeen(idKey);
      const v = safe(MobileNewName, data); if (!v.ok) { console.warn("❌ invalid mobile-new-name", v.error?.message); return; }
      const payload = v.data;
      if (payload?.userId) upsertUser(payload.userId, { name: payload.name });
      io.to("controller").emit("controller-new-name", payload);
      io.to("entrance").emit("entrance-new-name", { userId: payload.userId, name: payload.name });
    });

    socket.on("mobile-new-user", (raw) => {
      const data = { uuid: raw?.uuid || nanoid(), ts: raw?.ts || Date.now(), ...raw };
      const idKey = `mobile-new-user:${data.uuid}`;
      if (isSeen(idKey)) return; markSeen(idKey);
      const v = safe(MobileNewUser, data); if (!v.ok) { console.warn("❌ invalid mobile-new-user", v.error?.message); return; }
      const payload = v.data;
      if (payload?.userId) upsertUser(payload.userId, { name: payload.name });
      io.to("controller").emit("controller-new-user", payload);
      io.to("entrance").emit("entrance-new-user", { userId: payload.userId, name: payload.name });
    });

    socket.on("mobile-new-voice", (raw) => {
      const data = { uuid: raw?.uuid || nanoid(), ts: raw?.ts || Date.now(), ...raw };
      const idKey = `mobile-new-voice:${data.uuid}`;
      if (isSeen(idKey)) return; markSeen(idKey);
      const v = safe(MobileNewVoice, data); if (!v.ok) { console.warn("❌ invalid mobile-new-voice", v.error?.message); return; }
      const payload = v.data;

      console.log("🎤 Received mobile-new-voice:", payload);

      io.to("entrance").emit("entrance-new-voice", { userId: payload.userId, text: payload.text, emotion: payload.emotion });
      // also surface to livingroom so SW2 can show keyword instantly
      io.to("livingroom").emit("device-new-voice", { userId: payload.userId, text: payload.text, emotion: payload.emotion });
      io.to("controller").emit("controller-new-voice", payload);
    });


    // Controller → LivingRoom + Mobile(user)
    socket.on("controller-new-decision", (raw) => {
      const data = { uuid: raw?.uuid || nanoid(), ts: raw?.ts || Date.now(), ...raw };
      const v = safe(ControllerDecision, data); if (!v.ok) { console.warn("❌ invalid controller-new-decision", v.error?.message); return; }
      const payload = v.data;
      const d = recordDecision(payload.userId, payload.params, payload.reason);
      const decisionId = d.id;
      
      // Update deviceState snapshots
      const tv2Env = payload.params;
      const sw1Env = { temp: payload.params.temp, humidity: payload.params.humidity };
      const sw2Env = { lightColor: payload.params.lightColor, music: payload.params.music };
      updateDeviceApplied('tv2', tv2Env, decisionId);
      updateDeviceApplied('sw1', sw1Env, decisionId);
      updateDeviceApplied('sw2', sw2Env, decisionId);
      
      // split fan-out
      io.to("livingroom").emit("device-new-decision", { target: 'tv2', env: tv2Env, reason: payload.reason, decisionId, mergedFrom: [payload.userId] });
      io.to("livingroom").emit("device-new-decision", { target: 'sw1', env: sw1Env, decisionId, mergedFrom: [payload.userId] });
      io.to("livingroom").emit("device-new-decision", { target: 'sw2', env: sw2Env, decisionId, reason: payload.reason, emotionKeyword: payload.emotionKeyword, mergedFrom: [payload.userId] });
      // targeted to mobile user (include flags/emotionKeyword when present)
      io.to(`user:${payload.userId}`).emit("mobile-new-decision", {
        userId: payload.userId,
        params: payload.params,
        reason: payload.reason,
        flags: payload.flags,
        emotionKeyword: payload.emotionKeyword,
        decisionId
      });
      // optional legacy alias (default off)
      const legacy = process.env.LEGACY_DEVICE_DECISION_ALIAS === 'true';
      if (legacy) {
        io.emit("device-decision", { device: "sw2", lightColor: payload.params?.lightColor, song: payload.params?.music, decisionId });
        io.emit("device-decision", { device: "sw1", temperature: payload.params?.temp, humidity: payload.params?.humidity, decisionId });
      }
    });

    socket.on("controller-new-voice", (data) => {
      console.log("🎮 Server received controller-new-voice:", data);
      io.to("livingroom").emit("device-new-voice", data);
    });

    // Device health
    socket.on("device:heartbeat", (info) => {
      const hb = { deviceId: info?.deviceId || socket.id, ts: info?.ts || Date.now(), status: info?.status, type: info?.type, version: info?.version };
      const v = safe(DeviceHeartbeat, hb);
      if (v.ok) {
        brainHeartbeat(v.data.deviceId, v.data);
        // Update deviceState snapshot
        updateDeviceHeartbeat(v.data.deviceId, v.data.ts);
        io.to("controller").emit("device-heartbeat", v.data);
      }
    });
    socket.on("device:error", (info) => {
      setDeviceError(info?.deviceId || socket.id, info?.error || 'unknown');
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  res.socket.server.io = io;
  res.end();
}
