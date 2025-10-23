import dynamic from "next/dynamic";

const TV2Controls = dynamic(() => import("@/components/livingroom/TV2"), {
  ssr: false,
});

export default function TV2Page() {
  return <TV2Controls />;
}
