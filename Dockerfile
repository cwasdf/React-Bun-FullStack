FROM oven/bun:1.4.0 AS deps
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN bun install

FROM deps AS build
COPY . .
RUN bun run check && bun run build

FROM oven/bun:1.4.0 AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV API_HOST=0.0.0.0
ENV API_PORT=3000
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api ./apps/api
COPY --from=build /app/apps/web/dist ./apps/web/dist
COPY --from=build /app/packages/shared ./packages/shared
EXPOSE 3000
USER bun
CMD ["bun", "apps/api/src/server.ts"]
