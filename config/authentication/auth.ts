import { ApiError } from "@/services/http/apiError";
import authServer from "@/services/internal/auth/auth.server";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type Decoded = {
  exp: number;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
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

          return res.data;
        } catch (error: any) {
          const message = error?.message || "Lỗi Auth";
          console.log("Error API Authenticate:..\n", message);
          throw new ApiError({ status: 401, message });
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
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

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
});
