import dynamic from "next/dynamic";

const SBM1Controls = dynamic(() => import("@/components/entrance/SBM1"), {
  ssr: false,
});

export default function SBM1Page() {
  return <SBM1Controls />;
}
