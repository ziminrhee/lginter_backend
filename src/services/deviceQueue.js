import { postAircon, postPurifier } from "@/src/services/thinq.service.js";
import { logger } from "@/src/utils/logger.js";

const queue = [];
const listeners = new Set();
const history = [];
const HISTORY_LIMIT = 12;
let lastError = null;
let processing = false;
let seq = 0;

const DEVICE_DELAY_MIN = 300;
const DEVICE_DELAY_MAX = 800;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () =>
  Math.floor(Math.random() * (DEVICE_DELAY_MAX - DEVICE_DELAY_MIN + 1)) + DEVICE_DELAY_MIN;

export const addStatusListener = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emitStatus = () => {
  const snapshot = getStatus();
  listeners.forEach((fn) => {
    try {
      fn(snapshot);
    } catch (err) {
      logger.error("deviceQueue listener error", { err: String(err) });
    }
  });
};

export const getStatus = () => ({
  queue: queue.map((job) => ({
    id: job.id,
    device: job.device,
    payload: job.payload,
    origin: job.origin,
    enqueuedAt: job.enqueuedAt,
  })),
  history: [...history],
  lastError,
  processing,
});

export function enqueueDeviceActions(actions = [], meta = {}) {
  const jobs = actions
    .filter(Boolean)
    .map((action) => ({
      id: `job-${Date.now()}-${seq++}`,
      device: action.device,
      payload: action.payload,
      label: action.label,
      origin: meta.origin || action.origin || "unknown",
      enqueuedAt: Date.now(),
    }));

  if (!jobs.length) {
    return getStatus();
  }

  jobs.forEach((job) => queue.push(job));
  emitStatus();
  processQueue();
  return getStatus();
}

async function processQueue() {
  if (processing) return;
  processing = true;
  emitStatus();

  while (queue.length) {
    const job = queue.shift();
    emitStatus();
    try {
      await executeJob(job);
      history.unshift({
        id: job.id,
        device: job.device,
        payload: job.payload,
        origin: job.origin,
        label: job.label,
        status: "success",
        ts: Date.now(),
      });
      lastError = null;
    } catch (err) {
      const errorMessage = err?.message || String(err);
      history.unshift({
        id: job.id,
        device: job.device,
        payload: job.payload,
        origin: job.origin,
        label: job.label,
        status: "error",
        error: errorMessage,
        ts: Date.now(),
      });
      lastError = { message: errorMessage, ts: Date.now(), job: { ...job } };
      logger.error("Device queue job failed", {
        job,
        error: errorMessage,
      });
    }

    while (history.length > HISTORY_LIMIT) {
      history.pop();
    }

    emitStatus();
    await wait(randomDelay());
  }

  processing = false;
  emitStatus();
}

async function executeJob(job) {
  logger.info(`Executing ${job.device}`, { payload: job.payload, origin: job.origin });
  if (job.device === "airconditioner") {
    return postAircon(job.payload);
  }
  if (job.device === "airpurifierfan") {
    return postPurifier(job.payload);
  }
  throw new Error(`Unknown device: ${job.device}`);
}


