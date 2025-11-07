import '../styles/globals.css';
import { useEffect, useState } from 'react';


function MyApp({ Component, pageProps }) {


  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

