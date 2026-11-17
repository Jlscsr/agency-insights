"use client"

import { useEffect, useState } from "react"

import { ChatterPerformance } from "@/components/chatter-performance"
import { CreatorPerformance } from "@/components/creator-performance"
import { DateRangeFilter } from "@/components/date-range-filter"
import { EarningsChart } from "@/components/earning-chart"
import { MetricCard } from "@/components/metric-card"
import { SubscriberActivity } from "@/components/subscriber-activity"
import { TrackingLinkPerformance } from "@/components/tracking-link-performance"
import { Button } from "@/components/ui/button"
import { count, dateLabel, usd, type DashboardData, type Range } from "@/lib/dashboard-data"

export function Dashboard({ range, demo }: { range: Range; demo: DashboardData | null }) {
  const [live, setLive] = useState<DashboardData | null>(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const data = demo ?? live

  useEffect(() => {
    if (demo) return

    const controller = new AbortController()
    async function load() {
      try {
        const response = await fetch(`/api/dashboard?range=${range}`, { signal: controller.signal })
        if (!response.ok) throw new Error("Dashboard request failed")
        const snapshot: DashboardData = await response.json()
        if (!controller.signal.aborted) setLive(snapshot)
      } catch {
        if (!controller.signal.aborted) setError(true)
      }
    }

    void load()
    return () => controller.abort()
  }, [range, demo, attempt])

  const metrics = data && [
    {
      label: "Net earnings (USD)",
      value: data.earnings ? usd.format(data.earnings.reduce((sum, row) => sum + row.earnings, 0)) : "Unavailable",
    },
    {
      label: "Connected creators",
      value: data.connectedCreators === null ? "Unavailable" : count.format(data.connectedCreators),
    },
    {
      label: "Active chatters",
      value: data.chatters ? count.format(data.chatters.filter((row) => row.messagesSent > 0).length) : "Unavailable",
    },
    {
      label: "New subscribers",
      value: data.subscribers ? count.format(data.subscribers.reduce((sum, row) => sum + row.newSubscribers, 0)) : "Unavailable",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Overview</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {demo ? "Sample data" : "Infloww · OnlyFans"}
            {data && ` · ${dateLabel(data.days[0])}–${dateLabel(data.days[data.days.length - 1])} (UTC)`}
          </p>
        </div>
        <DateRangeFilter range={range} />
      </div>

      {!data && (
        <div className="rounded-xl border bg-card p-6">
          {error ? (
            <div className="flex flex-wrap items-center gap-3">
              <span role="alert" className="text-sm">Could not load the dashboard.</span>
              <Button variant="outline" onClick={() => {
                setError(false)
                setAttempt((value) => value + 1)
              }}>Retry</Button>
            </div>
          ) : (
            <p role="status" className="text-sm text-muted-foreground">Loading Infloww reports…</p>
          )}
        </div>
      )}

      {data && metrics && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <EarningsChart data={data.earnings} />
            <SubscriberActivity data={data.subscribers} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <CreatorPerformance rows={data.creators} />
            <ChatterPerformance rows={data.chatters} />
          </div>
          <TrackingLinkPerformance rows={data.links} />
          {data.mode === "live" && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Infloww reports can lag by up to 25 hours. Earnings use completed USD transactions before
              separate refund adjustments. Active chatters are currently activated employees who sent direct messages in the selected period.
            </p>
          )}
        </>
      )}
    </div>
  )
}
