import useSocketTV2 from "@/utils/hooks/useSocketTV2";

export default function TV2Controls() {
  const { showAggregated } = useSocketTV2();

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>livingroom/TV2</h2>
      <button
        onClick={() => showAggregated({ totalUsers: 3, averageEmotion: "calm" })}
        style={{ padding: "0.5rem 1rem" }}
      >
        Push aggregated
      </button>
    </div>
  );
}
