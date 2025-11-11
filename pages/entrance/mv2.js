import dynamic from "next/dynamic";

const MW2Display = dynamic(() => import("@/components/entrance/MW2"), {
  ssr: false,
});

export default function MW2Page() {
  return <MW2Display />;
}


