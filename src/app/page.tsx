import { Suspense } from "react"
import { ChartNoAxesCombined } from "lucide-react"

import { Dashboard } from "@/components/dashboard"
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
        <div className="mx-auto flex h-16 max-w-[92rem] items-center gap-3 px-4 sm:px-8 lg:px-10">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ChartNoAxesCombined className="size-5" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight">Agency Insights</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
        <Suspense fallback={<p role="status" className="text-sm text-muted-foreground">Loading overview…</p>}>
          <DashboardOverview searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}
