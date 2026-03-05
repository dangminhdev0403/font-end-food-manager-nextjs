import envConfig from "@/config/env.config";
import { logger } from "@/lib/logger";
import { ApiError } from "@/services/http/apiError";
import authServer from "@/services/internal/auth/auth.server";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: Number.parseInt(envConfig.NEXT_PUBLIC_REFRESH_EXPIRES_IN_SECONDS),
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await authServer.serverLogin({
            email: String(credentials.email),
            password: String(credentials.password),
          });

          return {
            email: res.data.email,
            name: res.data.name,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          };
        } catch (error: any) {
          const message = error?.message || "Lỗi Auth";
          logger.error({ error }, "Login failed");
          throw new ApiError({ status: 401, message });
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      /**
       * 1️⃣ Login lần đầu
       */
      if (user) {
        return {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        };
      }

      /**
       * 2️⃣ Nếu update session (unstable_update)
       */
      if (trigger === "update" && session) {
        return {
          ...token,
          accessToken: session.accessToken ?? token.accessToken,
          refreshToken: session.refreshToken ?? token.refreshToken,
        };
      }

      /**
       * 3️⃣ Check refreshToken hết hạn
       */
      try {
        const decoded: any = jwtDecode(token.refreshToken);
        const now = Math.floor(Date.now() / 1000);

        if (decoded?.exp && now > decoded.exp) {
          logger.warn("Refresh token expired → logout");
          return null; // invalidate session
        }
      } catch (err) {
        logger.error("Invalid refresh token");
        return null;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

        session.user = {
          ...session.user, // giữ nguyên AdapterUser fields
          ...token.user, // ghi đè id/email/name
        };


      return session;
    },
  },
});
