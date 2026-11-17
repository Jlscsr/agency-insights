import { Suspense } from "react"

import { Dashboard } from "@/components/dashboard"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { liveDashboardEnabled } from "@/lib/dashboard-auth"
import { demoDashboard, parseRange } from "@/lib/dashboard-data"

type HomeProps = {
  searchParams: Promise<{ range?: string | string[] }>
}

async function DashboardOverview({ searchParams }: HomeProps) {
  const { range: value } = await searchParams
  const range = parseRange(value)
  return <Dashboard key={range} range={range} demo={liveDashboardEnabled() ? null : demoDashboard(range)} />
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <span className="text-lg font-semibold tracking-tight">Agency Insights</span>
        </div>
      </header>
      <div className="mx-auto w-full max-w-7xl flex-1 lg:flex">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Suspense fallback={<p role="status" className="text-sm text-muted-foreground">Loading overview…</p>}>
            <DashboardOverview searchParams={searchParams} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
