# Agency Insights

A Next.js dashboard for reviewing OnlyFans agency performance through Infloww. The public demo uses labeled sample data. Authorized reviewers can run the same dashboard against the read-only Infloww API.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The dashboard opens in sample mode when live credentials are absent.

## Enable private live data

Copy the variable names from `.env.example` into a local `.env.local` or use the equivalent server-side settings for your deployment.

| Variable | Value |
| --- | --- |
| `INFLOWW_API_KEY` | Authorized read-only key |
| `INFLOWW_AGENCY_OID` | Agency OID shown alongside the key |
| `DASHBOARD_PASSWORD` | Random reviewer password of at least 24 characters |

Restart the app and sign in with the username `reviewer`. The page and its JSON endpoint require the reviewer password in live mode. Use HTTPS for a hosted live deployment and share access only with authorized reviewers.

## Reading the dashboard

- The 3-, 7-, and 30-day selections end on the last completed UTC day. Connected creator count reflects the current key scope.
- Net earnings sum the `net` amount of completed USD transactions. The total excludes pending transactions and separate refund adjustments.
- Subscriber growth counts new subscriptions across connected creators. A person who subscribes to multiple creators can count once for each creator.
- Active chatters are currently activated employees with direct messages in the selected period. The chatter table ranks employees by attributed USD sales.
- Tracking links use a fixed 30-day lookup. The ten highest links are ranked by subscriptions using per-link counts reported by Infloww.
- Live results can lag upstream activity. An unavailable panel indicates an upstream or data validation error. A zero indicates a successful query with no reportable activity for that metric.

The browser reads `GET /api/dashboard`. The Route Handler makes server-side, read-only requests with cursor pagination, ten-ID report batches, and bounded retries for rate limits. It returns dashboard aggregates without raw transaction or subscriber records. Successful live snapshots are reused for 60 seconds within the same server instance.

[Infloww API reference](https://infloww-openapi.stoplight.io/docs/openapi/wnttpt5i2x0gz-infloww-api)

## Verify and deploy

```sh
npm test
npm run lint
npm run build
```

Import the GitHub repository into Vercel as a Next.js project. Deploy the public demo without Infloww variables. For a private live deployment, configure all three variables and keep the deployment URL within the authorized review group.

For a walkthrough, change the reporting period, inspect the two daily charts, and open the creator, chatter, and tracking link tables. In an authorized live review, compare completed net earnings and new subscriber counts against Infloww for the same UTC dates.
