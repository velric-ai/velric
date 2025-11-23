import "@/styles/globals.css";
import "@/styles/glassmorphic.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AuthProvider } from "@/contexts/AuthContext";
import { SnackbarProvider } from "@/contexts/SnackbarContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <Head>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/assets/logo.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/assets/logo.png"
          />
        </Head>
        <Component {...pageProps} />
      </SnackbarProvider>
    </AuthProvider>
  );
}
