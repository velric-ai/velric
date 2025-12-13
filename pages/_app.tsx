import "@/styles/globals.css";
import "@/styles/glassmorphic.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import ReduxProvider from "@/components/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";

// Component to sync session accessToken to localStorage
function SessionTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session && (session as any).accessToken) {
      // Update velric_token in localStorage when session accessToken is available
      localStorage.setItem('velric_token', (session as any).accessToken);
    }
  }, [session]);

  return null;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider>
        <AuthProvider>
          <SessionTokenSync />
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
        </AuthProvider>
      </ReduxProvider>
    </SessionProvider>
  );
}
