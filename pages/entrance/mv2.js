import dynamic from "next/dynamic";

const MV2Display = dynamic(() => import("@/components/entrance/MV2"), {
  ssr: false,
});

export default function MV2Page() {
  return <MV2Display />;
}


