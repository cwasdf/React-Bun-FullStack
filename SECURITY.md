# Security

Do not report security vulnerabilities in a public issue tracker.

For a real project created from this starter, define a private security contact and disclosure process before launch.

## Starter scope

This repository provides baseline HTTP hardening and validation. It does not provide:

- authentication or authorization
- CSRF protection for cookie-authenticated state changes
- distributed rate limiting
- database row-level access controls
- secret management
- dependency monitoring
- production observability
- WAF / DDoS controls

Add those controls according to the deployed architecture and threat model.
