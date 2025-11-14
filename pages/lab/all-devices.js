const devices = [
  { title: "Entrance / MV2", src: "/entrance/mv2" }, // wide banner at top
  { title: "Entrance / MW1", src: "/entrance/mw1" },
  { title: "Entrance / SBM1", src: "/entrance/sbm1" },
  { title: "Entrance / TV1", src: "/entrance/tv1" },
  { title: "LivingRoom / SW1", src: "/livingroom/sw1" },
  { title: "LivingRoom / SW2", src: "/livingroom/sw2" },
  { title: "LivingRoom / TV2", src: "/livingroom/tv2" },
];

export default function AllDevicesLab() {
  const [first, ...rest] = devices;
  const rows = Math.ceil(rest.length / 3);
  return (
    <div style={{ padding: 0, margin: 0 }}>
      {/* Top wide MV2 banner */}
      <iframe
        key={first.src}
        src={first.src}
        title={first.title}
        style={{ width: '100vw', height: '28vh', border: '0', display: 'block' }}
      />
      {/* Grid for remaining devices */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 33.33vw)',
          gridTemplateRows: `repeat(${rows}, 36vh)`,
          width: '100vw',
          gap: 0,
        }}
      >
        {rest.map((d) => (
          <iframe
            key={d.src}
            src={d.src}
            title={d.title}
            style={{ width: '33.33vw', height: '36vh', border: '0' }}
          />
        ))}
      </div>
    </div>
  );
}

 