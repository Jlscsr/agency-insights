"use client"

import { useEffect, useState } from "react"

import { ChatterPerformance } from "@/components/chatter-performance"
import { CreatorPerformance } from "@/components/creator-performance"
import { DateRangeFilter } from "@/components/date-range-filter"
import { EarningsChart } from "@/components/earning-chart"
import { MetricCard } from "@/components/metric-card"
import { RevenueBreakdown } from "@/components/revenue-breakdown"
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
      label: "Completed net earnings",
      value: data.earnings ? usd.format(data.earnings.reduce((sum, row) => sum + row.earnings, 0)) : "Unavailable",
      detail: "USD · Before refund adjustments",
    },
    {
      label: "New subscriptions",
      value: data.subscribers ? count.format(data.subscribers.reduce((sum, row) => sum + row.newSubscribers, 0)) : "Unavailable",
      detail: "Across connected creators",
    },
    {
      label: "Connected creators",
      value: data.connectedCreators === null ? "Unavailable" : count.format(data.connectedCreators),
      detail: "Current API key scope",
    },
    {
      label: "Active chatters",
      value: data.chatters ? count.format(data.chatters.filter((row) => row.messagesSent > 0).length) : "Unavailable",
      detail: "Sent direct messages in this period",
    },
  ]

  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Agency overview</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">
              {demo ? "Sample data" : "Infloww · OnlyFans"}
            </span>
            {data && <span>{dateLabel(data.days[0])} – {dateLabel(data.days[data.days.length - 1])} (UTC)</span>}
          </div>
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
          <div className="grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
          </div>
          <section aria-labelledby="revenue-heading" className="space-y-4">
            <h2 id="revenue-heading" className="text-xl font-semibold tracking-tight">Revenue</h2>
            <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <EarningsChart data={data.earnings} />
              <RevenueBreakdown sources={data.earningsSources} refunds={data.refunds} />
            </div>
          </section>
          <section aria-labelledby="audience-heading" className="space-y-4">
            <h2 id="audience-heading" className="text-xl font-semibold tracking-tight">Audience</h2>
            <SubscriberActivity data={data.subscribers} renewals={data.renewals} active={data.activeSubscriptions} />
          </section>
          <section aria-labelledby="performance-heading" className="space-y-4">
            <h2 id="performance-heading" className="text-xl font-semibold tracking-tight">Team and campaigns</h2>
            <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
              <CreatorPerformance rows={data.creators} />
              <ChatterPerformance rows={data.chatters} />
              <div className="min-w-0 lg:col-span-2">
                <TrackingLinkPerformance rows={data.links} />
              </div>
            </div>
          </section>
          {data.mode === "live" && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Infloww reports can lag by up to 25 hours. Chatter metrics cover currently activated employees.
            </p>
          )}
        </>
      )}
    </div>
  )
}
