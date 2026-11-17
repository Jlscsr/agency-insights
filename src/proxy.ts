import { NextResponse } from "next/server"

import { dashboardAuthorized, dashboardChallenge, liveDashboardEnabled } from "@/lib/dashboard-auth"

export function proxy(request: Request) {
  if (liveDashboardEnabled() && !dashboardAuthorized(request)) return dashboardChallenge()
  return NextResponse.next()
}

export const config = { matcher: ["/"] }
