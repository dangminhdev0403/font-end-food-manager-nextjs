// app/api/auth/login/route.ts
import { auth, signOut } from "@/config/authentication/auth";
import { logger } from "@/lib/logger";
import authServer from "@/services/internal/auth/auth.server";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();

  if (session?.refreshToken) {
    try {
      await authServer.serverLogout({
        refreshToken: session.refreshToken,
      });
    } catch (err) {
      logger.error(
        { error: err },
        "Error occurred while logging out from auth server, proceeding to clear session anyway",
      );
    }
  }

  // Luôn xoá session cookie
  await signOut({ redirect: false });

  return NextResponse.json({ ok: true });
}
