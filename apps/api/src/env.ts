import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_HOST: z.string().min(1).default('0.0.0.0'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  WEB_ORIGIN: z.string().url().default('http://localhost:5173'),
})

const parsed = envSchema.safeParse(Bun.env)

if (!parsed.success) {
  console.error('Invalid environment configuration', z.treeifyError(parsed.error))
  process.exit(1)
}

export const env = parsed.data
