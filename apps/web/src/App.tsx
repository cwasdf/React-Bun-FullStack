import { useEffect, useState } from 'react'
import { getHealth, sayHello } from './api'

export function App() {
  const [health, setHealth] = useState<'checking' | 'healthy' | 'error'>('checking')
  const [name, setName] = useState('Bun')
  const [message, setMessage] = useState<string>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    const controller = new AbortController()

    getHealth(controller.signal)
      .then(() => setHealth('healthy'))
      .catch(() => setHealth('error'))

    return () => controller.abort()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)
    setMessage(undefined)

    try {
      const result = await sayHello(name)
      setMessage(result.message)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unexpected error')
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">FULL-STACK STARTER</div>
        <h1>React + Bun</h1>
        <p>
          React 19, Vite, Hono, shared Zod contracts, strict TypeScript and production-oriented defaults.
        </p>

        <div className="status" aria-live="polite">
          <span className={`dot ${health}`} />
          API: {health}
        </div>
      </section>

      <section className="panel">
        <h2>Typed API round trip</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <div className="row">
            <input
              id="name"
              name="name"
              value={name}
              maxLength={80}
              onChange={(event) => setName(event.target.value)}
              autoComplete="off"
            />
            <button type="submit">Send</button>
          </div>
        </form>
        {message ? <p className="result">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="grid">
        <article>
          <h3>Lean</h3>
          <p>No client state framework, router, UI kit, ORM or auth package until the application needs one.</p>
        </article>
        <article>
          <h3>Secure defaults</h3>
          <p>Explicit CORS, CSP/security headers, body limits, validation, generic server errors and request IDs.</p>
        </article>
        <article>
          <h3>Production path</h3>
          <p>Build the SPA once and serve it with the Bun API process, or deploy the two apps separately.</p>
        </article>
      </section>
    </main>
  )
}
