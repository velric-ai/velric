import { useEffect } from 'react';
import Head from 'next/head';
import { handleOAuthCallback } from '../../utils/oauthHandlers';

export default function OAuthCallback() {
  useEffect(() => {
    // Handle the OAuth callback
    handleOAuthCallback();
  }, []);

  return (
    <>
      <Head>
        <title>Connecting... | Velric</title>
        <meta name="description" content="Connecting your account" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>

      <div 
        className="min-h-screen flex items-center justify-center text-white"
        style={{
          background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)'
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-2">Connecting your account...</h1>
          <p className="text-white/60">Please wait while we complete the connection.</p>
        </div>
      </div>
    </>
  );
}