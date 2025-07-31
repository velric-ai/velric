import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/logo.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
