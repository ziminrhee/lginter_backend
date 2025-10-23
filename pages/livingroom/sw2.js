import dynamic from "next/dynamic";

const SW2Controls = dynamic(() => import("@/components/livingroom/SW2"), {
  ssr: false,
});

export default function SW2Page() {
  return <SW2Controls />;
}
