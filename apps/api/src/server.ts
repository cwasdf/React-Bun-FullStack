import { serveStatic } from 'hono/bun'
import { app } from './app'
import { env } from './env'

if (env.NODE_ENV === 'production') {
  app.use(
    '/assets/*',
    serveStatic({
      root: './apps/web/dist',
      precompressed: true,
      onFound: (_path, c) => {
        c.header('Cache-Control', 'public, max-age=31536000, immutable')
      },
    }),
  )

  app.get('/favicon.svg', serveStatic({ path: './apps/web/dist/favicon.svg' }))

  app.get('*', async (c, next) => {
    if (c.req.path.startsWith('/api/')) {
      return next()
    }

    const file = Bun.file('./apps/web/dist/index.html')
    if (!(await file.exists())) {
      return c.text('Frontend build not found. Run `bun run build` first.', 503)
    }

    c.header('Cache-Control', 'no-cache')
    return c.body(file)
  })
}

const server = Bun.serve({
  hostname: env.API_HOST,
  port: env.API_PORT,
  fetch: app.fetch,
  maxRequestBodySize: 1024 * 1024,
})

console.log(`API listening on http://${server.hostname}:${server.port}`)
