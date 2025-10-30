import dynamic from "next/dynamic";

const MobileControls = dynamic(() => import("@/components/mobile"), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #F3E8FF',
          borderTop: '4px solid #9333EA',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{
          color: '#9333EA',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          로딩 중...
        </p>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
});

export default function MobilePage() {
  return <MobileControls />;
}
