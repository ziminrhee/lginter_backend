const redact = (value) => {
  if (!value) return "";
  if (typeof value !== "string") return value;
  if (value.length <= 6) return "***";
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
};

export const logger = {
  info(message, payload) {
    console.info(`[ThinQ] ${message}`, payload ?? "");
  },
  error(message, payload) {
    console.error(`[ThinQ] ${message}`, payload ?? "");
  },
  envPreview() {
    return {
      base: process.env.LG_THINQ_BASE,
      key: redact(process.env.LG_THINQ_KEY),
      acId: process.env.LG_THINQ_AC_ID,
      apId: process.env.LG_THINQ_AP_ID,
    };
  },
};


