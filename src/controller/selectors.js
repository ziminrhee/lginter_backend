const FEELING_MAPPINGS = [
  {
    keyword: "찝찝하다",
    tokens: ["찝찝", "습"],
    actions: [
      { device: "airconditioner", payload: { power: "on" }, label: "AC power on" },
      { device: "airconditioner", payload: { mode: "AIR_DRY" }, label: "AC mode AIR_DRY" },
      { device: "airpurifierfan", payload: { power: "on" }, label: "AP power on" },
      { device: "airpurifierfan", payload: { mode: "NATURE_CLEAN" }, label: "AP mode NATURE_CLEAN" },
    ],
  },
  {
    keyword: "덥다",
    tokens: ["덥", "더워", "무더"],
    actions: [
      { device: "airconditioner", payload: { power: "on" }, label: "AC power on" },
      { device: "airconditioner", payload: { mode: "COOL" }, label: "AC mode COOL" },
      { device: "airconditioner", payload: { temperature: 23 }, label: "AC temp 23" },
    ],
  },
  {
    keyword: "춥다",
    tokens: ["춥", "추워", "쌀쌀"],
    actions: [
      { device: "airconditioner", payload: { power: "on" }, label: "AC power on" },
      { device: "airconditioner", payload: { mode: "HEAT" }, label: "AC mode HEAT" },
      { device: "airconditioner", payload: { temperature: 26 }, label: "AC temp 26" },
    ],
  },
];

export const matchFeelingKeyword = (text = "") => {
  const lowered = text.toLowerCase();
  return (
    FEELING_MAPPINGS.find((mapping) =>
      mapping.tokens.some((token) => lowered.includes(token))
    ) || null
  );
};

const uniqueKeywordsFrom = (sources = []) => {
  const keywords = new Set();
  sources.filter(Boolean).forEach((source) => {
    const mapping = typeof source === "string" ? matchFeelingKeyword(source) : source;
    if (mapping?.keyword) {
      keywords.add(mapping.keyword);
    }
  });
  return [...keywords];
};

export function deriveDeviceEffects({ decision, state }) {
  const stateFeelingKeyword = state?.lastFeeling?.keyword
    ? state.lastFeeling.keyword
    : null;
  const reasonMatch = matchFeelingKeyword(decision?.reason || state?.lastReason || "");

  const keywords = uniqueKeywordsFrom([
    stateFeelingKeyword,
    reasonMatch,
  ]);

  const actions = [];
  keywords.forEach((keyword) => {
    const mapping = FEELING_MAPPINGS.find((item) => item.keyword === keyword);
    if (mapping) {
      mapping.actions.forEach((action, index) => {
        actions.push({
          ...action,
          origin: `feeling:${keyword}`,
          order: index,
        });
      });
    }
  });

  return actions;
}

export const getFeelingMappings = () => FEELING_MAPPINGS;


