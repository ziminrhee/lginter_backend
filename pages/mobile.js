import dynamic from "next/dynamic";

const MobileControls = dynamic(() => import("@/components/mobile"), {
  ssr: false,
});

export default function MobilePage() {
  return <MobileControls />;
}
