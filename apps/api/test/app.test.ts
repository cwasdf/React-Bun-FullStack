import { describe, expect, test } from 'bun:test'
import { app } from '../src/app'

describe('API', () => {
  test('health endpoint returns an isolated request id', async () => {
    const response = await app.request('/api/health')
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(response.headers.get('x-request-id')).toBe(body.requestId)
  })

  test('hello validates input', async () => {
    const response = await app.request('/api/hello', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    })

    expect(response.status).toBe(422)
  })

  test('hello accepts valid input', async () => {
    const response = await app.request('/api/hello', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Bun' }),
    })
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.message).toBe('Hello, Bun.')
  })
})
