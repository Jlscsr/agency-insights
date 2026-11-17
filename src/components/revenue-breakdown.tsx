import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usd, type EarningsSource } from "@/lib/dashboard-data"

export function RevenueBreakdown({ sources, refunds }: {
  sources: EarningsSource[] | null
  refunds: number | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold"><h3>Revenue by source</h3></CardTitle>
        <CardDescription>Completed net earnings · USD</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {sources?.length ? (
          <dl className="divide-y">
            {sources.map(({ label, earnings }) => (
              <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt>{label}</dt>
                <dd className="font-medium tabular-nums">{usd.format(earnings)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-muted-foreground">
            {sources ? "No completed USD transactions in this period." : "Revenue breakdown is unavailable."}
          </p>
        )}
        <div className="mt-auto pt-5">
          <div className="rounded-lg bg-muted/60 px-4 py-3">
            <dl>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <dt className="font-medium">Reported refunds</dt>
                <dd className="font-semibold tabular-nums">{refunds === null ? "Unavailable" : usd.format(refunds)}</dd>
              </div>
            </dl>
            <p className="mt-1 text-sm text-muted-foreground">Shown separately from net earnings.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
