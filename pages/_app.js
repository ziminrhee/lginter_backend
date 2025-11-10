import '../styles/globals.css';
import SimpleBackground from '../components/SimpleBackground';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SimpleBackground />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

