import '../styles/globals.css';
import { useEffect, useState } from 'react';
import SimpleBackground from '../components/SimpleBackground';

function MyApp({ Component, pageProps }) {
  const [BackgroundCanvas, setBackgroundCanvas] = useState(null);
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    // 3D 배경 로드 시도 (실패시 SimpleBackground 사용)
    import('../components/BackgroundCanvas').then((mod) => {
      setBackgroundCanvas(() => mod.default);
      setUse3D(true);
      console.log('✅ 3D BackgroundCanvas loaded!');
    }).catch((err) => {
      console.error('❌ Failed to load 3D background, using simple background:', err);
      setUse3D(false);
    });
  }, []);

  return (
    <>
      {use3D && BackgroundCanvas ? (
        <BackgroundCanvas cameraMode="default" />
      ) : (
        <SimpleBackground />
      )}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

