import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    avatar?: string;
  }

  interface Session {
    user: User;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires?: number;
  }
}
