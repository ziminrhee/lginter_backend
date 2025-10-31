// Environment loader for ThinQ integration (JS only)

export const env = {
  LG_THINQ_BASE: process.env.LG_THINQ_BASE || "https://thinq.bytechtree.com",
  LG_THINQ_KEY: process.env.LG_THINQ_KEY || "",
  LG_THINQ_AC_ID: process.env.LG_THINQ_AC_ID || "AC",
  LG_THINQ_AP_ID: process.env.LG_THINQ_AP_ID || "AP",
};

if (!env.LG_THINQ_KEY) {
  console.warn("[env] LG_THINQ_KEY is not configured. ThinQ calls will fail until provided.");
}


