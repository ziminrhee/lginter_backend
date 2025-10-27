import dynamic from "next/dynamic";

const MW1 = dynamic(() => import("@/components/entrance/MW1"), { ssr: false });
const SBM1 = dynamic(() => import("@/components/entrance/SBM1"), { ssr: false });
const TV1 = dynamic(() => import("@/components/entrance/TV1"), { ssr: false });
const SW1 = dynamic(() => import("@/components/livingroom/SW1"), { ssr: false });
const SW2 = dynamic(() => import("@/components/livingroom/SW2"), { ssr: false });
const TV2 = dynamic(() => import("@/components/livingroom/TV2"), { ssr: false });

export default function AllDevicesLab() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Lab / All Devices</h1>
      <p>Six tiles for MW1, SBM1, TV1, SW1, SW2, TV2</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16
      }}>
        <Tile title="Entrance / MW1"><MW1 /></Tile>
        <Tile title="Entrance / SBM1"><SBM1 /></Tile>
        <Tile title="Entrance / TV1"><TV1 /></Tile>
        <Tile title="LivingRoom / SW1"><SW1 /></Tile>
        <Tile title="LivingRoom / SW2"><SW2 /></Tile>
        <Tile title="LivingRoom / TV2"><TV2 /></Tile>
      </div>
    </div>
  );
}

function Tile({ title, children }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 12, background:'#fff' }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ height: 400, overflow: 'auto' }}>{children}</div>
    </div>
  );
}


