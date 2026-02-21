import { auth, unstable_update } from "@/config/authentication/auth";
import { logger } from "@/lib/logger";
import { responseError, responseSuccess } from "@/lib/utils";
import { ApiError } from "@/services/http/apiError";
import authServer from "@/services/internal/auth/auth.server";

export async function POST() {
  const session = await auth();

  if (!session?.refreshToken) {
    logger.error(
      "No refresh token found in session, cannot refresh access token",
    );
    throw new ApiError({
      status: 401,
      message: "Unauthorized: No refresh token found",
      error: "Unauthorized",
    });
  }
  logger.info(
    { refreshToken: session.refreshToken },
    "Attempting to refresh access token using refresh token from session",
  );
  try {
    const res = await authServer.serverRefreshToken({
      refreshToken: session.refreshToken,
    });
    const { accessToken, refreshToken } = res.data;
    session.accessToken = accessToken;
    session.refreshToken = refreshToken;

    await unstable_update({
      accessToken,
      refreshToken,
    });
    logger.info(
      {
        newToken: res.data,
        sessionRefreshToken: session.refreshToken,
      },
      "Access token refreshed successfully, updating session",
    );
    logger.info("Session updated with new access token and refresh token");
    return responseSuccess(res);
  } catch (error) {
    return responseError(error);
  }
}
