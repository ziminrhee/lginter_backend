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
    <div style={{ padding: 0, margin: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '33.33vw 33.33vw 33.33vw',
          gridTemplateRows: '28vh 28vh 14vh',
          gridTemplateAreas: `"c1 c2 c3" "c4 c5 c6" "mw2 mw2 mw2"`,
          width: '100vw',
          height: '100vh',
        }}
      >
        {devices.map((d, i) => {
          const isMW2 = d.src === '/entrance/mv2';
          const area = isMW2 ? 'mw2' : `c${i + 1}`;
          const style = isMW2
            ? { gridArea: area, width: '100%', height: '100%', border: 0 }
            : { gridArea: area, width: '100%', height: '100%', border: 0 };
          return (
            <iframe key={d.src} src={d.src} title={d.title} style={style} />
          );
        })}
      </div>
    </div>
  );
}

 