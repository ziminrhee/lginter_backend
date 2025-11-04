<!-- adc6fe33-a55d-42f9-9297-5e63cfc294d6 8732b98c-0942-49ba-8bb5-32e9873b806e -->
# Cursor Plan — Controller = SSoT (JS-only, Yarn, No Express)

## Context & Non‑negotiables

- Next.js API route only for Socket.IO singleton at `/api/socket`. No Express in dependencies (hard rule).
- Single namespace `/`; rooms: `mobile`, `entrance`, `livingroom`, `controller`, and per-user `user:{id}`.
- Keep all current event names/rooms exactly as-is. Any aliases are server-only (compat).
- Controller is the single source of truth and the only OpenAI caller. Mobile/devices never call AI.

## Events (verbatim)

- Mobile→Server: `mobile-new-user`, `mobile-new-name`, `mobile-new-voice`
- Controller→Server: `controller-new-decision`, `controller-new-name`, `controller-new-voice`
- Server→LivingRoom: `device-new-decision`, `device-new-voice`
- Server→Entrance: `entrance-new-user`, `entrance-new-name`
- Server→Mobile (targeted): `mobile-new-decision`

## Fan-out rule (fixed in Hub)

- TV2 receives all 4 params + `reason` (dashboard).
- SW1 receives `{ temp, humidity }`.
- SW2 receives `{ lightColor, music }`.

## Must‑do Corrections (safety & consistency)

- Decision identity: generate `decisionId = nanoid()` for every controller decision; persist in SSoT and include `decisionId` in all fan-out payloads (TV2/SW1/SW2 + mobile feedback).
- Harden users: track `joinedAt`, `lastSeenTs`, optional `name`, `voiceId`, `lastInputs`, `lastDecisionId`.
- Idempotency with TTL: dedupe by `${event}:${uuid}` using `Map<key, expireTs>`, sweep periodically (e.g., 10 min TTL) to avoid HMR leaks.
- Name unification: internal state uses `currentEnv`; external event names remain unchanged; alias only at the Hub boundary if needed.
- Provenance meta: `currentEnvMeta = { mergedFromUserIds: string[], decisionIds: string[], updatedAt: number }`.
- Legacy alias toggle: `LEGACY_DEVICE_DECISION_ALIAS` (default off) to optionally emit `device-decision` once alongside canonical `device-new-decision`.
- Optional: device snapshots (last applied + heartbeats) for stable UI feedback.

## SSoT schema (JS + JSDoc, in-memory)

- Keep existing `lib/brain/state.js`; extend to the following shape and export helpers.
```js
// lib/brain/state.js (extend)
/** @typedef {{temp:number, humidity:number, lightColor:string, music:string}} Env */
/** @typedef {{id:string, userId:string, params:Env, reason:string, createdAt:number}} Decision */
/** @typedef {{name?:string, voiceId?:string, joinedAt:number, lastSeenTs:number, lastInputs?:Partial<Env>, lastDecisionId?:string}} UserRecord */

export const brain = {
  /** @type {Record<string, UserRecord>} */ users: {},
  /** @type {Env} */ currentEnv: { temp: 24, humidity: 50, lightColor: "#FFFFFF", music: "neutral" },
  /** @type {{mergedFromUserIds:string[], decisionIds:string[], updatedAt:number}} */
  currentEnvMeta: { mergedFromUserIds: [], decisionIds: [], updatedAt: 0 },
  /** @type {Decision[]} */ decisions: [],
  deviceState: {
    tv2: { lastEnv: null, lastDecisionId: null, lastHeartbeatTs: 0 },
    sw1: { lastEnv: null, lastDecisionId: null, lastHeartbeatTs: 0 },
    sw2: { lastEnv: null, lastDecisionId: null, lastHeartbeatTs: 0 },
    mw1: { lastHeartbeatTs: 0 }, sbm1: { lastHeartbeatTs: 0 }, tv1: { lastHeartbeatTs: 0 },
  },
  flags: { power: true, tv2: true, sw1: true, sw2: true, emergencyStop: false },
  /** idempotency: key = `${event}:${uuid}`, value = expireTs */ seen: new Map(),
};

// Helper: record decision and update aggregates
import { nanoid } from 'nanoid';
export function recordDecision(userId, params, reason) {
  const decision = { id: nanoid(), userId, params, reason, createdAt: Date.now() };
  brain.decisions.push(decision);
  brain.currentEnv = params; // or merge result if merge policy is applied
  brain.currentEnvMeta = {
    mergedFromUserIds: [userId],
    decisionIds: [decision.id],
    updatedAt: Date.now(),
  };
  return decision;
}
```


## Merge policy (src/core/merge.js)

- temp/humidity: weighted mean (favor more recent `lastSeenTs`).
- lightColor: HSV centroid from inputs (convert hex↔HSV).
- music: majority vote; on tie, use a fixed priority table.

## Zod models (runtime validation)

- Add/extend schemas and use `safeParse` (log & drop, never throw):
  - `ControllerDecision` `{ uuid, ts, userId, params:{temp,humidity,lightColor,music}, reason }` → Hub adds `decisionId`.
  - `MobileNewDecision` `{ userId, params, reason, decisionId }` (targeted feedback to user room).
  - Optional `DeviceHeartbeat` `{ deviceId, ts, status?, lastAppliedDecisionId? }`.

## Server Hub Rules

- On connect: join rooms by init events; hard-map device inits to rooms; mobile-init joins `user:{id}` if present.
- On inbound event: safe-validate; inject base meta; enforce TTL idempotency; guard missing userId; update user lastSeenTs.
- Mobile → Controller: forward three mobile events; mirror to entrance for user/name.
- Controller → Hub: on `controller-new-decision`, create decisionId, `recordDecision`, then split fan-out to TV2/SW1/SW2; send targeted `mobile-new-decision`; optionally emit legacy alias; on `controller-new-voice`, broadcast `device-new-voice` to livingroom.
- GC: sweep expired `seen` entries ~every 10 minutes.

## Controller Orchestration

- Controller-only OpenAI via `src/services/openai.service.js` with timeout (6–10s) + mock fallback.
- Inputs: `systemPrompt`, `latestConversation`, `currentEnv`, `currentUser`.
- Queue: per-user in-memory (~500ms debounce); cancel older items.

## Modularity & File Boundaries (developer‑friendly)

- `lib/brain/state.js`: SSoT singleton + minimal helpers only.
- `src/core/merge.js`: all merge/fair-average math isolated; changing this file must not affect others.
- `src/core/color.js`: HSV/RGB helpers only.
- `src/core/schemas.js`: Zod models + small factory helpers.
- `src/services/openai.service.js`: API call + timeout/mock; no socket imports.
- `pages/api/socket.js`: Hub/router only; no business logic; uses helpers above.
- `utils/hooks/useSocketController.js`: orchestration queue + emissions; no merge math or validation here.
- `components/controller/*`: purely UI; state arrives via socket; no server calls.
- `utils/hooks/*device*.js`: device-specific listeners; no AI/merge logic.
- Contract: each module exports a small, typed (JSDoc) surface; swapping internals won’t break others.

## Ordered commits (small & reviewable)

1) deps: remove Express; add `zod`, `nanoid`.

2) socket: ensure singleton; map device `*-init` to rooms; join `user:{id}` on `mobile-init`.

3) schemas: add/extend Zod; Hub uses `safeParse` + base meta.

4) brain: extend `lib/brain/state.js` + `recordDecision` + TTL GC helpers.

5) merge: implement `src/core/merge.js` (+ `src/core/color.js`).

6) controller: orchestrator with per-user debounce + OpenAI timeout/mock.

7) hub: decision handling → decisionId + split fan-out + mobile targeted + optional legacy alias.

8) device snapshots: track last applied + heartbeats; show in `/controller`.

9) mobile: remove any mobile-side OpenAI calls; events-only.

10) controller UI: move styles out of `pages/`; add SSoT panels & ops toggles wired to Hub ops events.

11) docs/tests: README (single caller, fan-out, TTL, alias), vitest (merge/gc/idempotency), E2E checklist.

12) verify: acceptance pass.

## Acceptance Criteria

- JS-only, Yarn; no Express; socket path `/api/socket`.
- Rooms as specified; `mobile-new-decision` always targeted to `user:{id}` only.
- Controller is the only OpenAI caller; Mobile/devices never call AI.
- Hub uses `safeParse`, injects `{uuid, ts}`, TTL idempotency w/ GC.
- TV2 gets all four + reason; SW1 gets temp+humidity; SW2 gets lightColor+music.
- `device-new-voice` broadcast to livingroom on `controller-new-voice`.
- Legacy alias default off; dedupe via `decisionId` when on.
- `/controller` shows SSoT panels; `/lab/all-devices` updates without Mobile.

### To-dos (atomic)

- deps-remove-express: Remove Express from package.json; add zod and nanoid
- socket-singleton: Ensure Socket.IO singleton at /api/socket
- hub-map-inits-const: Hard-map mw1|sbm1|tv1-init→entrance and sw1|sw2|tv2-init→livingroom; join user:{id} on mobile-init
- schemas-add-zod: Add/extend Zod models; hub uses safeParse + inject {uuid, ts}
- hub-idempotency-ttl: Implement TTL Map `${event}:${uuid}` + periodic GC sweep
- brain-extend-schema: Extend lib/brain/state.js to schema and export recordDecision + TTL helpers
- merge-policy: Implement src/core/merge.js (weighted mean, HSV centroid, majority vote) + color utils
- openai-service: Create src/services/openai.service.js with timeout (6–10s) and mock fallback
- controller-queue: Add per-user debounce queue (~500ms) in controller orchestrator
- controller-orchestrator-wire: Move OpenAI call to controller; emit controller-new-decision/name/voice
- hub-fanout-split: On controller-new-decision: create decisionId, persist, split fan-out, targeted mobile feedback
- hub-legacy-alias: Add LEGACY_DEVICE_DECISION_ALIAS toggle and attach shared decisionId to alias
- hub-device-new-voice: Broadcast device-new-voice to livingroom on controller-new-voice
- device-snapshots: Track last applied env/decision + heartbeats per device; expose to UI
- controller-ui-ops: Wire /controller ops: ops-emergency-stop and ops-power-toggle to Hub
- controller-page-unify: Move styles out of pages/; keep single pages/controller.js
- mobile-remove-openai: Remove Mobile-side OpenAI calls; keep only mobile-new-*
- docs-tests: Update README; add vitest for merge/gc/idempotency; add E2E checklist
- verify-acceptance: Run acceptance pass (rooms/events/single AI/fan-out/lab grid)

### To-dos

- [ ] Remove Express from package.json; add zod and nanoid
- [ ] Ensure Socket.IO singleton at /api/socket (guard res.socket.server.io)
- [ ] Hard-map mw1|sbm1|tv1-init→entrance and sw1|sw2|tv2-init→livingroom; join user:{id} on mobile-init
- [ ] Add/extend Zod models; hub uses safeParse + inject {uuid, ts}
- [ ] Implement TTL Map `${event}:${uuid}` + periodic GC sweep
- [ ] Extend lib/brain/state.js to schema and export recordDecision + TTL helpers
- [ ] Implement src/core/merge.js (weighted mean, HSV centroid, majority vote) + color utils
- [ ] Create src/services/openai.service.js with timeout (6–10s) and mock fallback
- [ ] Add per-user debounce queue (~500ms) in controller orchestrator
- [ ] Move OpenAI call to controller; emit controller-new-decision/name/voice
- [ ] On controller-new-decision: create decisionId, persist, split fan-out, targeted mobile feedback
- [ ] Add LEGACY_DEVICE_DECISION_ALIAS toggle and attach shared decisionId to alias
- [ ] Broadcast device-new-voice to livingroom on controller-new-voice
- [ ] Track last applied env/decision + heartbeats per device; expose to UI
- [ ] Wire /controller ops: ops-emergency-stop and ops-power-toggle to Hub
- [ ] Move styles out of pages/; keep single pages/controller.js
- [ ] Remove Mobile-side OpenAI calls; keep only mobile-new-*
- [ ] Update README; add vitest for merge/gc/idempotency; add E2E checklist
- [ ] Run acceptance pass (rooms/events/single AI/fan-out/lab grid)