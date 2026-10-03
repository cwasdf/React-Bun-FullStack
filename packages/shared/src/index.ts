import { z } from 'zod'

export const healthResponseSchema = z.object({
  ok: z.literal(true),
  service: z.literal('api'),
  timestamp: z.string().datetime(),
  requestId: z.string().uuid(),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>

export const helloRequestSchema = z.object({
  name: z.string().trim().min(1).max(80),
})

export type HelloRequest = z.infer<typeof helloRequestSchema>

export const helloResponseSchema = z.object({
  message: z.string(),
  requestId: z.string().uuid(),
})

export type HelloResponse = z.infer<typeof helloResponseSchema>

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().uuid(),
  }),
})

export type ApiError = z.infer<typeof apiErrorSchema>
