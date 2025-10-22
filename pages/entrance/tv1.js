import dynamic from "next/dynamic";

const TV1Controls = dynamic(() => import("@/components/entrance/TV1"), {
  ssr: false,
});

export default function TV1Page() {
  return <TV1Controls />;
}
