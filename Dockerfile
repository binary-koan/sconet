FROM node:18 AS web-builder

WORKDIR /app

RUN npm install -g pnpm

COPY web/pnpm-lock.yaml ./
RUN pnpm fetch
COPY web/package.json ./
RUN pnpm install --offline

COPY web ./
RUN ls && pnpm build

FROM jarredsumner/bun:0.4.0

WORKDIR /app

COPY api/package.json api/bun.lockb ./
RUN bun install

COPY api ./

RUN mkdir static
COPY --from=web-builder /app/dist static
ENV STATIC_PATH=static

CMD ["bun", "start"]
