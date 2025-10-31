import { describe, expect, it } from "vitest";

import {
  AirconModeSchema,
  AirconPayloadSchemas,
  AirconPowerSchema,
  AirconTempSchema,
  PurifierModeSchema,
  PurifierPayloadSchemas,
  PurifierPowerSchema,
  pickMatchingSchema,
} from "@/src/core/schemas.js";
import { deriveDeviceEffects } from "@/src/controller/selectors.js";

describe("ThinQ schemas", () => {
  it("accepts valid aircon power payload", () => {
    const result = AirconPowerSchema.safeParse({ power: "on" });
    expect(result.success).toBe(true);
  });

  it("rejects aircon payload with multiple keys", () => {
    const result = AirconPowerSchema.safeParse({ power: "on", mode: "COOL" });
    expect(result.success).toBe(false);
  });

  it("accepts valid aircon temperature payload", () => {
    const result = AirconTempSchema.safeParse({ temperature: 23 });
    expect(result.success).toBe(true);
  });

  it("rejects aircon temperature outside bounds", () => {
    const result = AirconTempSchema.safeParse({ temperature: 10 });
    expect(result.success).toBe(false);
  });

  it("accepts valid purifier mode payload", () => {
    const result = PurifierModeSchema.safeParse({ mode: "NATURE_CLEAN" });
    expect(result.success).toBe(true);
  });

  it("rejects purifier payload with multiple keys", () => {
    const result = PurifierPowerSchema.safeParse({ power: "on", mode: "NATURE_CLEAN" });
    expect(result.success).toBe(false);
  });

  it("resolves matching schema for aircon payload", () => {
    const schema = pickMatchingSchema(AirconPayloadSchemas, { mode: "COOL" });
    expect(schema).toBe(AirconModeSchema);
  });

  it("resolves matching schema for purifier payload", () => {
    const schema = pickMatchingSchema(PurifierPayloadSchemas, { power: "off" });
    expect(schema).toBe(PurifierPowerSchema);
  });
});

describe("Device effect derivation", () => {
  it("returns AC/air purifier sequence for 찝찝하다 feeling", () => {
    const state = {
      lastFeeling: { keyword: "찝찝하다" },
      lastDecision: null,
      lastReason: "",
    };
    const effects = deriveDeviceEffects({ decision: null, state });
    expect(effects.map((e) => e.device)).toEqual([
      "airconditioner",
      "airconditioner",
      "airpurifierfan",
      "airpurifierfan",
    ]);
  });

  it("returns COOLing sequence when reason mentions 덥다", () => {
    const state = {
      lastFeeling: null,
      lastDecision: null,
      lastReason: "",
    };
    const effects = deriveDeviceEffects({
      decision: { reason: "너무 덥다" },
      state,
    });
    expect(effects.length).toBe(3);
    expect(effects[0].payload).toEqual({ power: "on" });
    expect(effects[1].payload).toEqual({ mode: "COOL" });
    expect(effects[2].payload).toEqual({ temperature: 23 });
  });
});


