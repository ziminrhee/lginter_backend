import dynamic from "next/dynamic";

const SW1Controls = dynamic(() => import("@/components/livingroom/SW1"), {
  ssr: false,
});

export default function SW1Page() {
  return <SW1Controls />;
}
