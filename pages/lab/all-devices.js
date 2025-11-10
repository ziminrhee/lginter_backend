const devices = [
  { title: "Entrance / MW1", src: "/entrance/mw1" },
  { title: "Entrance / SBM1", src: "/entrance/sbm1" },
  { title: "Entrance / TV1", src: "/entrance/tv1" },
  { title: "Entrance / MW2", src: "/entrance/mv2" },
  { title: "LivingRoom / SW1", src: "/livingroom/sw1" },
  { title: "LivingRoom / SW2", src: "/livingroom/sw2" },
  { title: "LivingRoom / TV2", src: "/livingroom/tv2" },
];

export default function AllDevicesLab() {
  return (
    <div style={{ padding: 0, margin: 0 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 33.33vw)',
        gridTemplateRows: `repeat(${Math.ceil(devices.length / 3)}, 50vh)`,
        width: '100vw',
        gap: 0,
      }}>
        {devices.map((d) => (
          <iframe
            key={d.src}
            src={d.src}
            title={d.title}
            style={{ width: '33.33vw', height: '50vh', border: '0' }}
          />
        ))}
      </div>
    </div>
  );
}

 