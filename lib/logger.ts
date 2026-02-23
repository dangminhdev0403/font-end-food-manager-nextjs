import pino from "pino";

const globalForLogger = globalThis as unknown as {
  logger: pino.Logger | undefined;
};

export const logger =
  globalForLogger.logger ??
  pino({
    level: "info",
    transport:
      process.env.NODE_ENV === "development"
        ? {
            target: "pino-pretty",
            options: { colorize: true },
          }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForLogger.logger = logger;
}
