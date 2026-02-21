import { logger } from "@/lib/logger";
import { ApiError } from "@/services/http/apiError";
import authServer from "@/services/internal/auth/auth.server";
import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const email = String(credentials.email);
          const password = String(credentials.password);
          const res = await authServer.serverLogin({ email, password });
          logger.debug(
            { responseData: res.data },
            "Login response from auth server",
          );
          return {
            email: res.data.email,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
            name: res.data.name,
          };
        } catch (error: any) {
          const message = error?.message || "Lỗi Auth";
          console.log("Error API Authenticate:..\n", message);
          throw new ApiError({ status: 401, message });
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1️⃣ Login lần đầu

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
      // 🔥 Check refreshToken hết hạn
      const now = Math.floor(Date.now() / 1000);
      const refreshExp = jwtDecode(token.refreshToken)?.exp || 0;
      const expRefresh = refreshExp * 1000;
      if (expRefresh && now > expRefresh) {
        logger.warn("Refresh token expired → force logout");

        return {}; // trả token rỗng = invalidate session
      }

      if (trigger === "update" && session) {
        token.accessToken = session.accessToken ?? token.accessToken;
        token.refreshToken = session.refreshToken ?? token.refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = token.user;
      return session;
    },
  },
});
