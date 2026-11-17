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

import { dateLabel, type DashboardData } from "@/lib/dashboard-data"

export function SubscriberActivity({ data }: { data: DashboardData["subscribers"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New subscribers by day</CardTitle>
        <CardDescription>Across connected creators</CardDescription>
      </CardHeader>

      <CardContent>
        {data === null ? <p className="text-sm text-muted-foreground">Subscriber activity is temporarily unavailable.</p> : (
        <ResponsiveContainer width="100%" height={256} minWidth={0}>
          <BarChart
            data={data}
            margin={{ right: 12 }}
          >
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tickFormatter={dateLabel} axisLine={false} tickLine={false} minTickGap={24} />
            <YAxis
              width={36}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip labelFormatter={(day) => dateLabel(String(day))} />
            <Bar
              dataKey="newSubscribers"
              name="New subscribers"
              fill="var(--chart-2)"
              maxBarSize={48}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
