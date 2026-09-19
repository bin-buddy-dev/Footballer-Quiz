# Quiz API layer

The game service is intentionally framework-neutral. It can be mounted behind Next.js route handlers, Express, Fastify, or another HTTP server.

Required endpoints for the first playable web app:

- POST /api/game/start
- POST /api/game/:id/guess
- GET /api/game/:id

The current implementation keeps game state in memory for local development. Production will move game state and daily-game records into PostgreSQL/Redis so multiple app instances can share sessions.
