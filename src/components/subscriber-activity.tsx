"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { count, dateLabel, type AudienceSnapshot, type DashboardData } from "@/lib/dashboard-data"

export function SubscriberActivity({ data, renewals, active }: {
  data: DashboardData["subscribers"]
  renewals: number | null
  active: AudienceSnapshot | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold"><h3>New subscriptions by day</h3></CardTitle>
        <CardDescription>Counts are reported per creator. A fan can subscribe to more than one creator.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/60 px-4 py-3">
            <dt className="text-sm text-muted-foreground">Subscription renewals</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums">
              {renewals === null ? "Unavailable" : count.format(renewals)}
            </dd>
          </div>
          <div className="rounded-lg bg-muted/60 px-4 py-3">
            <dt className="text-sm text-muted-foreground">
              Active subscriptions {active && `· As of ${dateLabel(active.day)}`}
            </dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums">
              {active === null ? "Unavailable" : count.format(active.active)}
            </dd>
          </div>
        </dl>
        {data === null ? <p className="text-sm text-muted-foreground">Subscriber activity is temporarily unavailable.</p> : (
        <ResponsiveContainer width="100%" height={256} minWidth={0}>
          <BarChart
            data={data}
            margin={{ right: 12 }}
          >
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tickFormatter={dateLabel} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis
              width={48}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip labelFormatter={(day) => dateLabel(String(day))} />
            <Bar
              dataKey="newSubscribers"
              name="New subscriptions"
              fill="var(--chart-2)"
              maxBarSize={48}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
