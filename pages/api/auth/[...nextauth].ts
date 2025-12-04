import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { storeGoogleTokens } from "@/lib/googleOAuth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent", // Changed to 'consent' to ensure refresh token is issued
          access_type: "offline", // Required for refresh token
          response_type: "code",
          scope: "openid profile email https://www.googleapis.com/auth/calendar.events",
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Store Google OAuth tokens when user signs in
      // Note: We'll store tokens after user is created/retrieved in the callback page
      // This ensures we have the correct user ID from the database
      if (account && account.provider === "google" && account.access_token) {
        // Tokens are stored in JWT and will be available in session
        // They will be stored in database in the callback page after user is created/retrieved
      }
      // Don't create user here - let the callback page handle it based on mode
      // This allows us to distinguish between signup and login
      return true;
    },
    async session({ session, token }) {
      // Session callback - user data will be loaded in the callback page
      // We don't need to fetch user here as it will be handled in the callback
      if (session.user && token.sub) {
        (session as any).user.id = token.sub;
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).expiresAt = token.expiresAt;
        
        // Log session tokens for debugging
        if (token.accessToken) {
          console.log('[NextAuth] Session - Tokens available:', {
            hasAccessToken: !!token.accessToken,
            hasRefreshToken: !!token.refreshToken,
            expiresAt: token.expiresAt ? new Date(token.expiresAt).toISOString() : null,
            userId: token.sub,
            email: session.user.email,
          });
        } else {
          console.warn('[NextAuth] Session - No access token in session!', {
            userId: token.sub,
            email: session.user.email,
            tokenKeys: Object.keys(token),
          });
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        // Initial sign-in: store tokens from account
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = account.providerAccountId || user.id;
        token.email = user.email;
        // Store expires_at in milliseconds (account.expires_at is in seconds)
        token.expiresAt = account.expires_at ? account.expires_at * 1000 : null;
        
        console.log('[NextAuth] JWT - Stored tokens on initial sign-in:', {
          hasAccessToken: !!token.accessToken,
          hasRefreshToken: !!token.refreshToken,
          expiresAt: token.expiresAt ? new Date(token.expiresAt).toISOString() : null,
          userId: token.id,
          email: token.email,
        });
      } else if (token.accessToken) {
        // Subsequent requests: tokens should already be in token
        // Check if token is expired and refresh if needed
        if (token.expiresAt && token.expiresAt < Date.now()) {
          console.log('[NextAuth] JWT - Token expired, attempting refresh...');
          // Token refresh will be handled when needed in calendar creation
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

