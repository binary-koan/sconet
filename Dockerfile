# Builder
FROM oven/bun:0.7.1 AS builder

WORKDIR /app

RUN mkdir api && mkdir web

COPY bun.lockb ./
COPY package.json ./
COPY api/package.json ./api
COPY web/package.json ./web

RUN bun install

COPY . .

ARG TURNSTILE_SITEKEY
ENV PRODUCTION_BUILD=1

RUN test -n "$TURNSTILE_SITEKEY" || (echo "TURNSTILE_SITEKEY is not set" && false)

RUN cd api && bun run build
RUN cd web && bun run build

# Runtime
FROM gcr.io/distroless/cc-debian11 AS runtime

WORKDIR /app

ENV ENV_TYPE=production
ENV STATIC_PATHS=static
ENV MIGRATIONS_PATH=migrations
ENV TZ=UTC

COPY --from=builder /app/api/build .
COPY --from=builder /app/web/build ./static
COPY --from=builder /app/web/public ./static
COPY --from=builder /app/api/src/db/migrations ./migrations

CMD ["/app/run", "setup-and-serve"]
