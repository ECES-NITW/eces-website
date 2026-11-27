# ECE Society, NIT Warangal

The society website lists events and accepts registrations. Organizers manage events and export registrations at [www.ecesnitw.in/admin](https://www.ecesnitw.in/admin).

The app uses React and the Next.js App Router conventions, with Vinext and Vite building for Cloudflare Workers. Drizzle manages the schema for the Cloudflare D1 database that stores events and registrations.

## Run locally

Use Node.js 22.13 or newer and npm.

```sh
npm ci
npm run db:local
npm run dev
```

Open the URL printed by the dev server. To check the built Worker in the Cloudflare runtime, use `npm run build` followed by `npm start`. The local database is stored under `.wrangler/state`. Use synthetic registration details there and in branch previews.

For schema changes, edit `db/schema.ts`, run `npm run db:generate`, and commit the Drizzle migration and metadata together. Apply it locally and check types with `npx tsc --noEmit --incremental false` before opening a pull request.

## Deploy and review changes

Cloudflare Workers Builds uses the repository root and runs `npm run build`. The production branch is `main`. Its deploy command is `npm run deploy`. Other branches use `npm run deploy:preview`. Open a pull request from a branch in this repository to review the Cloudflare build and preview URL before merging.

Production and previews use separate D1 databases. All branch previews share one test database. Keep schema changes compatible with previews already using it and with the previous production version during rollout. A maintainer applies pending migrations before deploying code that needs them:

```sh
npx wrangler d1 migrations apply PREVIEW_DB --remote --config wrangler.preview-migrations.jsonc
npx wrangler d1 migrations apply DB --remote --config wrangler.jsonc
```

Run the production command after verifying the migration on the preview database. Cloudflare Builds uses a deploy token with its default permissions.

BigRock is the registrar for `ecesnitw.in`. Cloudflare manages DNS and TLS. Cloudflare's Workers dashboard is where maintainers manage builds, domains, and rollbacks.

### Preview a pull request

For same-repository PRs targeting `main`, **Share PR preview** automatically waits for the branch's Cloudflare build to succeed and comments with its stable preview URL. Later pushes update the site at that link without adding another comment. If Cloudflare has already posted the link, the workflow skips its own comment. No Cloudflare token or additional repository secret is needed. The workflow reads build checks and PR metadata without checking out or executing PR code.

This workflow becomes available after it is merged into `main`. It waits up to 27 minutes; if the build fails or times out, check Cloudflare Builds and re-run the workflow after the build succeeds. Existing PRs trigger it when reopened or when their next commit is pushed.

Contributors with Write access should push their feature branch to this repository and open a PR into `main`. Cloudflare builds that branch automatically; no manual preview request or extra preview branch is needed. Fork PRs are excluded from this workflow.

## Organizer access

Organizers sign in with a passkey at [www.ecesnitw.in/organizer](https://www.ecesnitw.in/organizer). A Cloudflare maintainer issues a one-time enrollment code for each approved organizer:

```sh
npm run organizer:invite -- organizer@student.nitw.ac.in --remote
```

Share the code privately with the organizer. They enter it on the organizer sign-in page, create a passkey, then sign in with it. An unused code expires after 24 hours. A maintainer can revoke an organizer by removing their matching rows from `organizer_passkeys` and `organizer_invites` in production D1. Removing a passkey also revokes its sessions.

The organizer sign-in uses the production hostname. Branch previews exclude production credentials and organizer sign-in. Keep organizer codes and registration exports out of the repository.
