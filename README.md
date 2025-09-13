![Sconet](https://user-images.githubusercontent.com/1077405/211963456-00d8ccd9-f635-48e1-8a44-1ad125594481.png)

**Sconet** (our "*scon*es and tea budg*et*") is a simple little personal finance app that lets you record your income and expenses,
setup categories and budgets, and break down your spending, all in multiple currencies.

It's 🚧 **super WIP and incomplete** 🚧 so expect to find broken things everywhere - at the moment this is more of a testing ground for me to experiment with using [Bun](https://bun.sh/) and [SolidJS](https://www.solidjs.com/), creating a semi-custom GraphQL client etc, rather than something I recommend actually using!

![CI](https://github.com/binary-koan/sconet/actions/workflows/playwright.yml/badge.svg?branch=main)
![Lint](https://github.com/binary-koan/sconet/actions/workflows/lint.yml/badge.svg?branch=main)

## Local development

Requirements

- [Bun](https://bun.sh/) 1.0.0 or higher
- [Node.js](https://nodejs.org/en/)
- A [PostgreSQL](https://www.postgresql.org) database with `pg_stat_statements` and `uuid-ossp` extensions enabled

1. Clone the repo
2. Run `bun install` and `bundle install`
3. Run `rails db:setup`
4. Run `bun dev` to start a dev server and visit `http://localhost:3030`
5. Log in with `test@example.com` and `changeme`

## Deployment

Sconet can be built as a single Docker image. The included `fly.toml` can be used for easy deployment to [Fly.io](https://fly.io/).
