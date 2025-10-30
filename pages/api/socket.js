// Minimal Socket.IO server for Next.js API route (migrated from external server.js)

import { Server } from "socket.io";
import { nanoid } from "nanoid";
import {
  upsertUser,
  applyNeed,
  computeAssignments,
  overrideAssignment,
  snapshot,
  heartbeat as brainHeartbeat,
  setDeviceError,
  reset as brainReset,
  recordDecision,
  markSeen,
  isSeen,
  gcSeen,
  updateDeviceHeartbeat,
  updateDeviceApplied,
  storeUserPreference,
  calculateFairAverage,
  getActiveUsers
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

  function broadcastAssignments(assignments) {
      const sw1Data = {
        device: "sw1",
      temperature: assignments.temperature?.value ?? 22,
      humidity: assignments.humidity?.value ?? 50,
        assignedUsers: {
        temperature: assignments.temperature?.userId || "N/A",
        humidity: assignments.humidity?.userId || "N/A",
        },
        timestamp: Date.now(),
      };
      io.emit("device-decision", sw1Data);

      const sw2Data = {
        device: "sw2",
      lightColor: assignments.light?.value ?? "#FFFFFF",
      song: assignments.music?.value ?? "N/A",
        assignedUsers: {
        light: assignments.light?.userId || "N/A",
        music: assignments.music?.userId || "N/A",
        },
        timestamp: Date.now(),
      };
      io.emit("device-decision", sw2Data);
  }

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
      io.to("controller").emit("mobile-new-name", payload);
      io.to("entrance").emit("entrance-new-name", { userId: payload.userId, name: payload.name });
      // legacy shim
      io.emit("new-name", payload);
    });

    socket.on("mobile-new-user", (raw) => {
      const data = { uuid: raw?.uuid || nanoid(), ts: raw?.ts || Date.now(), ...raw };
      const idKey = `mobile-new-user:${data.uuid}`;
      if (isSeen(idKey)) return; markSeen(idKey);
      const v = safe(MobileNewUser, data); if (!v.ok) { console.warn("❌ invalid mobile-new-user", v.error?.message); return; }
      const payload = v.data;
      if (payload?.userId) upsertUser(payload.userId, { name: payload.name });
      io.to("controller").emit("mobile-new-user", payload);
      io.to("entrance").emit("entrance-new-user", { userId: payload.userId, name: payload.name });
      // legacy shim
      io.emit("new-user", payload);
    });

    socket.on("mobile-new-voice", async (raw) => {
      const data = { uuid: raw?.uuid || nanoid(), ts: raw?.ts || Date.now(), ...raw };
      const idKey = `mobile-new-voice:${data.uuid}`;
      if (isSeen(idKey)) return; markSeen(idKey);
      const v = safe(MobileNewVoice, data); if (!v.ok) { console.warn("❌ invalid mobile-new-voice", v.error?.message); return; }
      const payload = v.data;
      
      console.log("🎤 Received mobile-new-voice:", payload);
      
      // Forward to entrance (MW1 display)
      io.to("entrance").emit("entrance-new-voice", { userId: payload.userId, text: payload.text, emotion: payload.emotion });
      
      // Forward to controller for monitoring
      io.to("controller").emit("mobile-new-voice", payload);
      
      // AI Decision: Call OpenAI and emit decision
      try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          console.warn("⚠️ OPENAI_API_KEY not set, using mock decision");
          const mockDecision = {
            userId: payload.userId,
            params: { temp: 24, humidity: 50, lightColor: '#FFFFFF', music: 'ambient' },
            reason: 'Mock decision (no API key)',
            uuid: nanoid(),
            ts: Date.now()
          };
          socket.emit("controller-new-decision", mockDecision);
          return;
        }
        
        // Build OpenAI request with enhanced color diversity
        const messages = [
          { 
            role: 'system', 
            content: `You are a smart home environment controller. Based on user emotion, decide optimal temperature (20-26°C), humidity (40-60%), light color (hex), and music genre.

COLOR DIVERSITY GUIDELINES:
- 행복(Happy): Warm yellows/oranges (#FFD700, #FFA500, #FFEB3B, #FFB300)
- 설레요(Excited): Bright pinks/corals (#FF69B4, #FF6B9D, #FFB6C1, #FF1493)
- 사랑(Love): Soft reds/roses (#FF6B9D, #FFB6C1, #FFC0CB, #E91E63)
- 평온(Peaceful): Cool blues/greens (#87CEEB, #ADD8E6, #B0E0E6, #7EC8E3)
- 슬픔(Sad): Deep blues/purples (#5B7C99, #6B8E23, #778899, #A0C1E6)
- 외로움(Lonely): Muted purples/grays (#9370DB, #B0A8B9, #8B7D8B, #ACA5CD)
- 화남(Angry): Intense reds/oranges (#DC143C, #FF4500, #CD5C5C, #B22222)
- 피곤(Tired): Soft warm tones (#FFDAB9, #FFE4B5, #F5DEB3, #E6D7C3)
- 집중(Focused): Clear whites/blues (#FFFFFF, #F0F8FF, #E6F3FF, #D4E6F1)

Choose VARIED colors from the appropriate emotion category. Avoid repeating the same color for similar emotions.

Respond ONLY with JSON: {"temp":24,"humidity":50,"lightColor":"#FFFFFF","music":"ambient","reason":"your explanation"}` 
          },
          { role: 'user', content: `User emotion: ${payload.emotion || payload.text}` }
        ];
        
        console.log("🤖 Calling OpenAI for decision...");
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.9  // Increased for more color variety
          })
        });
        
        const aiData = await response.json();
        const content = aiData?.choices?.[0]?.message?.content || '{}';
        console.log("🤖 OpenAI response:", content);
        
        // Parse JSON from response
        const match = content.match(/\{[\s\S]*\}/);
        let parsed = { temp: 24, humidity: 50, lightColor: '#FFFFFF', music: 'ambient', reason: 'Default' };
        if (match) {
          try { parsed = JSON.parse(match[0]); } catch (e) { console.warn("Failed to parse OpenAI JSON:", e); }
        }
        
        // Emit decision
        const decision = {
          userId: payload.userId,
          params: {
            temp: parsed.temp || 24,
            humidity: parsed.humidity || 50,
            lightColor: parsed.lightColor || '#FFFFFF',
            music: parsed.music || 'ambient'
          },
          reason: parsed.reason || 'AI generated',
          uuid: nanoid(),
          ts: Date.now()
        };
        
        console.log("✅ Individual preference for", decision.userId, ":", decision.params);
        
        // 1. Store this user's preference (with unique inputId)
        const inputId = `${decision.userId}-${decision.uuid}`;
        storeUserPreference(decision.userId, decision.params, inputId);
        
        // 2. Calculate Fair Average from ALL active inputs
        const fairAvg = calculateFairAverage();
        const activeUsers = getActiveUsers();
        const activeUserIds = activeUsers.map(u => u.inputId);
        
        console.log(`📊 Active inputs: ${activeUsers.length} (from ${new Set(activeUsers.map(u => u.originalUserId)).size} unique users)`);
        
        console.log(`🎯 Fair Average (from ${activeUsers.length} users):`, fairAvg);
        
        // 3. Record merged decision
        const d = recordDecision(decision.userId, fairAvg, `Merged from ${activeUsers.length} user(s): ${decision.reason}`);
        const decisionId = d.id;
        
        // 4. Update deviceState snapshots (using fair average)
        const tv2Env = fairAvg;
        const sw1Env = { temp: fairAvg.temp, humidity: fairAvg.humidity };
        const sw2Env = { lightColor: fairAvg.lightColor, music: fairAvg.music };
        updateDeviceApplied('tv2', tv2Env, decisionId);
        updateDeviceApplied('sw1', sw1Env, decisionId);
        updateDeviceApplied('sw2', sw2Env, decisionId);
        
        // 5. Fan-out to devices (with merged result)
        console.log("📤 Broadcasting MERGED decision to livingroom devices...");
        io.to("livingroom").emit("device-new-decision", { target: 'tv2', env: tv2Env, reason: `Merged from ${activeUsers.length} users`, decisionId, mergedFrom: activeUserIds });
        io.to("livingroom").emit("device-new-decision", { target: 'sw1', env: sw1Env, decisionId, mergedFrom: activeUserIds });
        io.to("livingroom").emit("device-new-decision", { target: 'sw2', env: sw2Env, decisionId, mergedFrom: activeUserIds });
        
        // 6. Targeted to THIS user (their individual preference + merged result)
        console.log(`📱 Sending individual result to user:${decision.userId}`);
        io.to(`user:${decision.userId}`).emit("mobile-new-decision", { 
          userId: decision.userId, 
          params: decision.params, // Individual preference
          mergedParams: fairAvg, // What was actually applied
          reason: decision.reason, 
          decisionId 
        });
        
      } catch (err) {
        console.error("❌ OpenAI error:", err);
        // Fallback: Store default preference and recalculate
        const fallbackParams = { temp: 24, humidity: 50, lightColor: '#FFFFFF', music: 'ambient' };
        const fallbackInputId = `${payload.userId}-${nanoid()}`;
        storeUserPreference(payload.userId, fallbackParams, fallbackInputId);
        
        const fairAvg = calculateFairAverage();
        const activeUsers = getActiveUsers();
        const activeUserIds = activeUsers.map(u => u.inputId);
        
        const d = recordDecision(payload.userId, fairAvg, `Fallback merged from ${activeUsers.length} user(s)`);
        const decisionId = d.id;
        
        const tv2Env = fairAvg;
        const sw1Env = { temp: fairAvg.temp, humidity: fairAvg.humidity };
        const sw2Env = { lightColor: fairAvg.lightColor, music: fairAvg.music };
        updateDeviceApplied('tv2', tv2Env, decisionId);
        updateDeviceApplied('sw1', sw1Env, decisionId);
        updateDeviceApplied('sw2', sw2Env, decisionId);
        
        io.to("livingroom").emit("device-new-decision", { target: 'tv2', env: tv2Env, reason: 'Fallback merged', decisionId, mergedFrom: activeUserIds });
        io.to("livingroom").emit("device-new-decision", { target: 'sw1', env: sw1Env, decisionId, mergedFrom: activeUserIds });
        io.to("livingroom").emit("device-new-decision", { target: 'sw2', env: sw2Env, decisionId, mergedFrom: activeUserIds });
        io.to(`user:${payload.userId}`).emit("mobile-new-decision", { userId: payload.userId, params: fallbackParams, mergedParams: fairAvg, reason: 'Fallback', decisionId });
      }
      
      // legacy shim for current UIs
      io.emit("new-voice-mobile", payload);
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
      io.to("livingroom").emit("device-new-decision", { target: 'sw1', env: sw1Env, decisionId });
      io.to("livingroom").emit("device-new-decision", { target: 'sw2', env: sw2Env, decisionId });
      // targeted to mobile user
      io.to(`user:${payload.userId}`).emit("mobile-new-decision", { userId: payload.userId, params: payload.params, reason: payload.reason, decisionId });
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
      // legacy shim
      io.emit("new-voice-device", data);
    });

    // 사용자 니즈 수신 및 우선순위 계산
    socket.on("mobile-user-needs", (data) => {
      console.log("🎯 Server received mobile-user-needs:", data);
      if (data?.userId) upsertUser(data.userId, { name: data.name || '' });
      applyNeed(data.userId, {
        temperature: data.temperature,
        humidity: data.humidity,
        lightColor: data.lightColor,
        song: data.song,
        priority: data.priority,
        timestamp: data.timestamp || Date.now(),
      });
      const assignments = computeAssignments();
      broadcastAssignments(assignments);
    });

    // Device health
    socket.on("device:heartbeat", (info) => {
      const hb = { deviceId: info?.deviceId || socket.id, ts: info?.ts || Date.now(), status: info?.status, type: info?.type, version: info?.version };
      const v = safe(DeviceHeartbeat, hb);
      if (v.ok) {
        brainHeartbeat(v.data.deviceId, v.data);
        // Update deviceState snapshot
        updateDeviceHeartbeat(v.data.deviceId, v.data.ts);
      }
    });
    socket.on("device:error", (info) => {
      setDeviceError(info?.deviceId || socket.id, info?.error || 'unknown');
    });

    // Controller commands
    socket.on("controller:sync", () => {
      socket.emit("state:full", snapshot());
    });
    socket.on("controller:override", ({ key, value, reason }) => {
      const a = overrideAssignment(key, value, { reason, userId: 'controller' });
      broadcastAssignments(a);
      io.to("controller").emit("state:full", snapshot());
    });
    socket.on("controller:recompute", () => {
      const a = computeAssignments();
      broadcastAssignments(a);
      io.to("controller").emit("state:full", snapshot());
    });
    socket.on("controller:reset", ({ kind = 'soft' } = {}) => {
      brainReset(kind);
      io.to("controller").emit("state:full", snapshot());
    });
    socket.on("controller:pingDevice", ({ deviceId }) => {
      io.emit("device:ping", { deviceId });
    });
    socket.on("controller:reloadDevices", ({ scope = 'all', room }) => {
      if (scope === 'room' && room) io.to(room).emit("client:reload", { room });
      else io.emit("client:reload", { scope: 'all' });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  res.socket.server.io = io;
  res.end();
}
