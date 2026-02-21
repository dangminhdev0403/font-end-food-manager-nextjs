import { logger } from "@/lib/logger";
import authServer from "@/services/internal/auth/auth.server";
import { useSession } from "next-auth/react";
import { ApiError } from "next/dist/server/api-utils";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();
  const refreshToken = async () => {
    if (!session?.refreshToken) {
      logger.error(
        "No refresh token found in session, cannot refresh access token",
      );
      throw new ApiError(401, "Unauthorized: No refresh token found");
    }
    logger.info(
      { refreshToken: session.refreshToken },
      "Checking for refresh token in session before attempting to refresh access token",
    );
    try {
      const res = await authServer.serverRefreshToken({
        refreshToken: session.refreshToken,
      });
      session.accessToken = res.data.accessToken;
      session.refreshToken = res.data.refreshToken;
      update({
        ...session,
      });
      return refreshToken;
    } catch (error) {
      logger.error({ error }, "Error refreshing access token");
      throw error;
    }
  };
};
