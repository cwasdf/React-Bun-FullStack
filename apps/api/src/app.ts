import {
  helloRequestSchema,
  type HelloResponse,
  type HealthResponse,
} from '@starter/shared'
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { env } from './env'

type Variables = {
  requestId: string
}

export const app = new Hono<{ Variables: Variables }>()

app.use('*', async (c, next) => {
  const requestId = crypto.randomUUID()
  c.set('requestId', requestId)
  await next()
  c.header('X-Request-Id', requestId)
})

app.use('*', logger())

app.use(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      baseUri: ["'none'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
    },
    referrerPolicy: 'no-referrer',
    xFrameOptions: 'DENY',
  }),
)

app.use(
  '/api/*',
  cors({
    origin: env.WEB_ORIGIN,
    allowHeaders: ['Content-Type', 'X-Request-Id'],
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    exposeHeaders: ['X-Request-Id'],
    credentials: false,
    maxAge: 600,
  }),
)

app.use(
  '/api/*',
  bodyLimit({
    maxSize: 1024 * 1024,
    onError: (c) =>
      c.json(
        {
          error: {
            code: 'PAYLOAD_TOO_LARGE',
            message: 'Request body exceeds the 1 MiB limit.',
            requestId: c.get('requestId'),
          },
        },
        413,
      ),
  }),
)

app.get('/api/health', (c) => {
  const payload: HealthResponse = {
    ok: true,
    service: 'api',
    timestamp: new Date().toISOString(),
    requestId: c.get('requestId'),
  }

  return c.json(payload, 200, {
    'Cache-Control': 'no-store',
  })
})

app.post('/api/hello', async (c) => {
  let body: unknown

  try {
    body = await c.req.json()
  } catch {
    return c.json(
      {
        error: {
          code: 'INVALID_JSON',
          message: 'Request body must be valid JSON.',
          requestId: c.get('requestId'),
        },
      },
      400,
    )
  }

  const parsed = helloRequestSchema.safeParse(body)

  if (!parsed.success) {
    return c.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name must contain between 1 and 80 characters.',
          requestId: c.get('requestId'),
        },
      },
      422,
    )
  }

  const payload: HelloResponse = {
    message: `Hello, ${parsed.data.name}.`,
    requestId: c.get('requestId'),
  }

  return c.json(payload)
})

app.notFound((c) =>
  c.json(
    {
      error: {
        code: 'NOT_FOUND',
        message: 'Resource not found.',
        requestId: c.get('requestId'),
      },
    },
    404,
  ),
)

app.onError((error, c) => {
  console.error({
    level: 'error',
    requestId: c.get('requestId'),
    method: c.req.method,
    path: c.req.path,
    error,
  })

  return c.json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error.',
        requestId: c.get('requestId'),
      },
    },
    500,
  )
})
