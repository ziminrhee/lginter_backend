import dynamic from "next/dynamic";

const FakeMobile = dynamic(() => import("@/components/mobile/Fake"), {
  ssr: false,
});

export default function MobileFakePage() {
  return <FakeMobile />;
}


