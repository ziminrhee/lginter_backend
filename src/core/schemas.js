import { z } from "zod";

export const AirconPowerSchema = z
  .object({ power: z.enum(["on", "off"]) })
  .strict();

export const AirconModeSchema = z
  .object({
    mode: z.enum(["COOL", "AIR_DRY", "FAN", "AUTO", "HEAT", "AIR_CLEAN"]),
  })
  .strict();

export const AirconTempSchema = z
  .object({
    temperature: z.number().int().min(16).max(30),
  })
  .strict();

export const PurifierPowerSchema = z
  .object({ power: z.enum(["on", "off"]) })
  .strict();

export const PurifierModeSchema = z
  .object({
    mode: z.enum([
      "SPOT_CLEAN",
      "SPACE_CLEAN",
      "DIRECT_CLEAN",
      "NATURE_CLEAN",
      "PET_CLEAN",
      "SILENT_CLEAN",
    ]),
  })
  .strict();

export const AirconPayloadSchemas = [
  AirconPowerSchema,
  AirconModeSchema,
  AirconTempSchema,
];

export const PurifierPayloadSchemas = [
  PurifierPowerSchema,
  PurifierModeSchema,
];

export function pickMatchingSchema(schemas, payload) {
  return schemas.find((schema) => schema.safeParse(payload).success) || null;
}


