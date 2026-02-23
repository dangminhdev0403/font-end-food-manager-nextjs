import { logger } from "@/lib/logger";
import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.string(),
  NEXT_PUBLIC_API_BASE_URL: z.string(),
  NEXT_PUBLIC_BACKEND_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_REFRESH_EXPRISES_IN_SECONDS: z.string(),
  AUTH_SECRET: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_BACKEND_API_ENDPOINT:
    process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  AUTH_SECRET: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_REFRESH_EXPRISES_IN_SECONDS:
    process.env.NEXT_PUBLIC_REFRESH_EXPRISES_IN_SECONDS,
});
if (!configProject.success) {
  console.error(configProject.error.issues);
  logger.error(
    { errorsEnvironment: configProject.error.issues },
    "Invalid environment variables",
  );
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
