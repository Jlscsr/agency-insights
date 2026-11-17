import { dashboardAuthorized, dashboardChallenge, liveDashboardEnabled } from "@/lib/dashboard-auth"
import { demoDashboard, parseRange } from "@/lib/dashboard-data"
import { liveDashboard } from "@/lib/live-dashboard"

export async function GET(request: Request) {
  const live = liveDashboardEnabled()
  if (live && !dashboardAuthorized(request)) return dashboardChallenge()

  const range = parseRange(new URL(request.url).searchParams.get("range"))
  const data = live ? await liveDashboard(range) : demoDashboard(range)

  return Response.json(data, { headers: { "Cache-Control": "private, no-store" } })
}
