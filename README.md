![Sconet](https://user-images.githubusercontent.com/1077405/211963456-00d8ccd9-f635-48e1-8a44-1ad125594481.png)

**Sconet** (our "*scon*es and tea budg*et*") is a simple little personal finance app that lets you record your income and expenses,
setup categories and budgets, and break down your spending, all in multiple currencies.

It's 🚧 **super WIP and incomplete** 🚧 so expect to find broken things everywhere - at the moment this is more of a testing ground for me to experiment with using [Bun](https://bun.sh/) and [SolidJS](https://www.solidjs.com/), creating a semi-custom GraphQL client and server, etc rather than something I recommend actually using!

## Local development

Requirements

- [Bun](https://bun.sh/) 0.4.0 or higher
- [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io/)
- A [PostgreSQL](https://www.postgresql.org) database with `pg_stat_statements` and `uuid-ossp` extensions enabled

1. Clone the repo
2. Run `pnpm install` in the root
3. Set up a [CloudFlare Turnstile](https://www.cloudflare.com/products/turnstile/) site and set the domain to `localhost`. This is required for login to work
4. Create a `api/.env` file with the following content:

```
JWT_SECRET=<some random string to use for signing auth tokens>
USER_EMAILS=<your email, to create an initial user>
TURNSTILE_SECRET_KEY=<your turnstile secret key>
```

5. Create a `web/.env` file with the following content:

```
VITE_TURNSTILE_SITEKEY=<your turnstile site key>
```

6. In the `api` directory:
   - Run `bun migrate` to apply database migrations
   - Run `bun seed` to populate some initial data along with the user(s) in `USER_EMAILS` above
7. Run `pnpm dev` to start a dev server
   - Visit `http://localhost:1235` for the app itself
   - Visit `http://localhost:4444/graphql` to browse the API in GraphiQL
8. Log in with the email you added in `USER_EMAILS` and the password `changeme`

## Deployment

Sconet can be built as a single Docker image. The included `fly.toml` can be used for easy deployment to [Fly.io](https://fly.io/).

To build the Docker image you will need to specify `VITE_TURNSTILE_SITEKEY` as a build arg, e.g.

```
docker build -t sconet --build-arg VITE_TURNSTILE_SITEKEY=<your site key> .
```

When running the image you should

- Specify the `JWT_SECRET` and `TURNSTILE_SECRET_KEY` environment variables just like in local development
- Mount a persistent storage volume to the `/app/data` path so that the database will be persisted between restarts

## Backing up the database

The app will optionally back up the database to S3-compatible storage if you specify the
`BUCKET_ENDPOINT`, `BUCKET_NAME`, `ACCESS_KEY_ID` and `SECRET_KEY_ID` environment variables.

Snapshots will be taken every 5 minutes if the database has changed, and only the last 3 snapshots will be stored (configure in `api/src/db/backup.ts`).
