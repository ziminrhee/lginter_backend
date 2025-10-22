import dynamic from "next/dynamic";

const MW1Controls = dynamic(() => import("@/components/entrance/MW1"), {
  ssr: false,
});

export default function MW1Page() {
  return <MW1Controls />;
}
