import "server-only";
import { z } from "zod";

// An empty value in .env.local (`AUDIUS_API_KEY=`) counts as missing.
const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const serverEnvSchema = z.object({
  AUDIUS_API_BASE_URL: z.url().default("https://api.audius.co/v1"),
  AUDIUS_APP_NAME: z.string().min(1).default("Soniva"),
  AUDIUS_API_KEY: optionalSecret,
  AUDIUS_BEARER_TOKEN: optionalSecret,
});

export const serverEnv = serverEnvSchema.parse(process.env);
