"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
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

import { dateLabel, usd, type DashboardData } from "@/lib/dashboard-data"

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function EarningsChart({ data }: { data: DashboardData["earnings"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold"><h3>Net earnings by day</h3></CardTitle>
        <CardDescription>Completed transactions · USD</CardDescription>
      </CardHeader>

      <CardContent>
        {data === null ? <p className="text-sm text-muted-foreground">Earnings are temporarily unavailable.</p> : (
        <ResponsiveContainer width="100%" height={288} minWidth={0}>
          <LineChart data={data} margin={{ right: 12 }}>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tickFormatter={dateLabel} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis
              width={64}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => dollars.format(value)}
            />
            <Tooltip labelFormatter={(day) => dateLabel(String(day))} formatter={(value) => usd.format(Number(value))} />
            <Line
              dataKey="earnings"
              name="Net earnings"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
