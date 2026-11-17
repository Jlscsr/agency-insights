import "server-only"

import { createHash, timingSafeEqual } from "node:crypto"

export function liveDashboardEnabled() {
  return Boolean(
    process.env.INFLOWW_API_KEY?.trim() &&
    process.env.INFLOWW_AGENCY_OID?.trim() &&
    (process.env.DASHBOARD_PASSWORD?.trim().length ?? 0) >= 24,
  )
}

export function dashboardAuthorized(request: Request) {
  const expected = Buffer.from(`reviewer:${process.env.DASHBOARD_PASSWORD?.trim()}`).toString("base64")
  const supplied = request.headers.get("authorization") ?? ""
  const hash = (value: string) => createHash("sha256").update(value).digest()
  return timingSafeEqual(hash(supplied), hash(`Basic ${expected}`))
}

export function dashboardChallenge() {
  return new Response("Agency Insights requires reviewer access.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Agency Insights", charset="UTF-8"',
      "Cache-Control": "private, no-store",
    },
  })
}
