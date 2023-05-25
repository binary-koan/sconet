FROM oven/bun:0.6.3 AS builder

WORKDIR /app

RUN mkdir api && mkdir web

COPY bun.lockb ./
COPY package.json ./
COPY api/package.json ./api
COPY web/package.json ./web

RUN bun install

COPY . .

ARG TURNSTILE_SITEKEY
RUN test -n "$TURNSTILE_SITEKEY" || (echo "TURNSTILE_SITEKEY not set" && false)

RUN cd api && bun run build
RUN cd web && bun run build

FROM gcr.io/distroless/cc-debian11

WORKDIR /app

ENV NODE_ENV=production
ENV STATIC_PATH=static
ENV MIGRATIONS_PATH=migrations
ENV TZ=UTC

COPY --from=builder /app/api/build .
COPY --from=builder /app/web/build ./static
COPY --from=builder /app/api/src/db/migrations ./migrations

CMD ["/app/run", "server"]
