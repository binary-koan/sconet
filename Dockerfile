FROM node:18 AS builder

WORKDIR /app

RUN curl https://dl.min.io/client/mc/release/linux-amd64/mc -o /usr/local/bin/mc && \
  chmod +x /usr/local/bin/mc

RUN npm install -g pnpm

COPY web/pnpm-lock.yaml ./
RUN pnpm fetch
COPY web/package.json ./
RUN pnpm install --offline

COPY web ./

ARG VITE_TURNSTILE_SITEKEY
RUN test -n "$VITE_TURNSTILE_SITEKEY" || (echo "VITE_TURNSTILE_SITEKEY not set" && false)

RUN pnpm build

FROM jarredsumner/bun:0.5.1

WORKDIR /app

COPY api/package.json api/bun.lockb ./

# This fails with --production on Fly builders for some reason (error linking - FileNotFound)
# RUN bun install --production
RUN bun install

COPY --from=builder /usr/local/bin/mc /usr/local/bin/mc

COPY api ./

ENV STATIC_PATH=static

RUN mkdir static
COPY --from=builder /app/dist static

CMD bun start
