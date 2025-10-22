import useSocketSW1 from "@/utils/hooks/useSocketSW1";

export default function SW1Controls() {
  const { emitClimateDecision } = useSocketSW1();

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>livingroom/SW1</h2>
      <button onClick={() => emitClimateDecision(22, 50, "user-1")} style={{ padding: "0.5rem 1rem" }}>
        Push climate decision
      </button>
    </div>
  );
}
