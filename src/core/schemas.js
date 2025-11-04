// Runtime schemas for Socket payloads (Zod, JS-only)
// Keep names/events verbatim; use safeParse at the hub

import { z } from "zod";

// Base meta always present after hub injection
export const BaseMeta = z.object({
  uuid: z.string().min(1),
  ts: z.number().int().nonnegative(),
});

export const MobileNewUser = BaseMeta.extend({
  userId: z.string().min(1),
  name: z.string().optional(),
});

export const MobileNewName = BaseMeta.extend({
  userId: z.string().min(1),
  name: z.string().min(1),
});

export const MobileNewVoice = BaseMeta.extend({
  userId: z.string().min(1),
  voiceId: z.string().optional(),
  text: z.string().optional(),
  emotion: z.string().optional(),
  score: z.number().min(0).max(1).optional(),
});

export const Env = z.object({
  temp: z.number(),
  humidity: z.number(),
  lightColor: z.string(),
  music: z.string(),
});

export const ControllerDecision = BaseMeta.extend({
  userId: z.string().min(1),
  params: Env,
  reason: z.string().min(1),
});

export const MobileNewDecision = z.object({
  userId: z.string().min(1),
  params: Env,
  reason: z.string().min(1),
  decisionId: z.string().min(1),
});

export const DeviceHeartbeat = z.object({
  deviceId: z.string().min(1),
  ts: z.number().int().nonnegative(),
  status: z.string().optional(),
  lastAppliedDecisionId: z.string().optional(),
  type: z.string().optional(),
  version: z.string().optional(),
});

// Safe parse helper: returns { ok, data } or { ok:false, error }
export function safe(schema, payload) {
  const r = schema.safeParse(payload);
  return r.success ? { ok: true, data: r.data } : { ok: false, error: r.error };
}


