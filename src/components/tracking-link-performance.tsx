import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { count, type LinkRow } from "@/lib/dashboard-data"

const percent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 })

export function TrackingLinkPerformance({ rows }: { rows: LinkRow[] | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold"><h3>Tracking link performance</h3></CardTitle>
        <CardDescription>Top 10 by subscriptions · 30-day link lookup</CardDescription>
      </CardHeader>

      <CardContent>
        <Table aria-label="Tracking link performance">
          <TableHeader>
            <TableRow>
              <TableHead scope="col" className="whitespace-normal">Tracking link</TableHead>
              <TableHead scope="col" className="text-right">
                Clicks
              </TableHead>
              <TableHead scope="col" className="whitespace-normal text-right">
                Subscriptions
              </TableHead>
              <TableHead scope="col" className="whitespace-normal text-right">
                Conversion
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!rows?.length && <TableRow><TableCell colSpan={4} className="whitespace-normal text-muted-foreground">
              {rows ? "No tracking links were returned." : "Tracking links are temporarily unavailable."}
            </TableCell></TableRow>}
            {rows?.map(({ key, name, clicks, subscriptions }) => (
              <TableRow key={key}>
                <TableCell className="font-medium whitespace-normal [overflow-wrap:anywhere]">{name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {count.format(clicks)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {count.format(subscriptions)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {clicks > 0 ? percent.format(subscriptions / clicks) : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
