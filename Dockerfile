# Currently segfaults as of Bun 0.7.0 :(

# Builder
FROM oven/bun:0.7.0 AS builder

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

RUN cd web && bun run build

# Runtime
FROM oven/bun:0.7.0 AS runtime

WORKDIR /app

ENV ENV_TYPE=production
ENV STATIC_PATHS=static
ENV MIGRATIONS_PATH=src/db/migrations
ENV TZ=UTC

# Just copying the package.json and lockfile seems to break --frozen-lockfile
COPY . ./

# This fails with --production on Fly builders for some reason (error linking - FileNotFound)
# RUN bun install --production
RUN bun install --frozen-lockfile

WORKDIR /app/api

RUN mkdir static
COPY --from=builder /app/web/build static

CMD ["bun", "./bin/run.ts", "setup-and-serve"]
