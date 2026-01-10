import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.string(),
  API_SERVER_URL: z.string(),
});

const configProject = configSchema.safeParse({
  API_SERVER_URL: process.env.API_SERVER_URL,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
});
if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
