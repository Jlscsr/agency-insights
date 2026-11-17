import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MetricCardProps = {
  label: string
  value: string
  detail: string
}

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="break-words text-xl font-semibold tracking-tight tabular-nums sm:text-2xl lg:text-3xl">
          {value}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}
