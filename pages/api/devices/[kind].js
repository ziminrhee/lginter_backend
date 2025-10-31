import {
  AirconPayloadSchemas,
  PurifierPayloadSchemas,
  pickMatchingSchema,
} from "@/src/core/schemas.js";
import { postAircon, postPurifier } from "@/src/services/thinq.service.js";
import { logger } from "@/src/utils/logger.js";

function ensureSingleKey(payload, keys) {
  return keys.filter((key) => payload[key] !== undefined).length === 1;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { kind } = req.query;
  const payload = req.body || {};

  try {
    if (kind === "airconditioner") {
      if (!ensureSingleKey(payload, ["power", "mode", "temperature"])) {
        return res
          .status(400)
          .json({ error: "Send exactly one of power|mode|temperature" });
      }
      const schema = pickMatchingSchema(AirconPayloadSchemas, payload);
      if (!schema) {
        return res.status(400).json({ error: "Invalid airconditioner payload" });
      }
      const data = await postAircon(schema.parse(payload));
      return res.status(200).json({ ok: true, data });
    }

    if (kind === "airpurifierfan") {
      if (!ensureSingleKey(payload, ["power", "mode"])) {
        return res
          .status(400)
          .json({ error: "Send exactly one of power|mode" });
      }
      const schema = pickMatchingSchema(PurifierPayloadSchemas, payload);
      if (!schema) {
        return res.status(400).json({ error: "Invalid airpurifierfan payload" });
      }
      const data = await postPurifier(schema.parse(payload));
      return res.status(200).json({ ok: true, data });
    }

    return res.status(404).json({ error: "Unknown device kind" });
  } catch (error) {
    const message = error?.message || String(error);
    logger.error("/api/devices call failed", { kind, message });
    return res.status(500).json({ error: message });
  }
}


