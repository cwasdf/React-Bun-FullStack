import {
  apiErrorSchema,
  healthResponseSchema,
  helloResponseSchema,
  type HealthResponse,
  type HelloResponse,
} from '@starter/shared'

async function parseError(response: Response): Promise<Error> {
  const json: unknown = await response.json().catch(() => undefined)
  const parsed = apiErrorSchema.safeParse(json)

  if (parsed.success) {
    return new Error(`${parsed.data.error.message} [${parsed.data.error.requestId}]`)
  }

  return new Error(`Request failed with HTTP ${response.status}`)
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch('/api/health', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  return healthResponseSchema.parse(await response.json())
}

export async function sayHello(name: string, signal?: AbortSignal): Promise<HelloResponse> {
  const response = await fetch('/api/hello', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
    signal,
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  return helloResponseSchema.parse(await response.json())
}
