/**
 * ThinQ server-side client (JS only)
 */
import { env } from "@/src/utils/env.js";
import { logger } from "@/src/utils/logger.js";

async function _post(path, body) {
  const url = `${env.LG_THINQ_BASE}${path}`;
  const headers = {
    "content-type": "application/json",
  };
  if (env.LG_THINQ_KEY) {
    headers["x-api-key"] = env.LG_THINQ_KEY;
  }

  logger.info(`POST ${path}`, { body });

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    json = { raw: text };
  }

  if (!res.ok) {
    logger.error(`ThinQ ${path} ${res.status}`, { response: json });
    throw new Error(`ThinQ ${path} ${res.status}: ${text}`);
  }

  logger.info(`ThinQ ${path} success`, { response: json });
  return json;
}

export async function postAircon(payload) {
  // payload: { power } | { mode } | { temperature }
  return _post(`/api/goldstar/karts/airconditioner`, payload);
}

export async function postPurifier(payload) {
  // payload: { power } | { mode }
  return _post(`/api/goldstar/karts/airpurifierfan`, payload);
}


