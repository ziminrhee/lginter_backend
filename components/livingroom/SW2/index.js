import useSocketSW2 from "@/utils/hooks/useSocketSW2";

export default function SW2Controls() {
  const { emitAmbienceDecision } = useSocketSW2();

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h2>livingroom/SW2</h2>
      <button onClick={() => emitAmbienceDecision("calm", "#4A90E2", "user-1")} style={{ padding: "0.5rem 1rem" }}>
        Push ambience decision
      </button>
    </div>
  );
}
