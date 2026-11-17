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

export function TrackingLinkPerformance({ rows }: { rows: LinkRow[] | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking link performance</CardTitle>
        <CardDescription>Top 10 by subscriptions · 30-day link lookup</CardDescription>
      </CardHeader>

      <CardContent>
        <Table aria-label="Tracking link performance">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Tracking link</TableHead>
              <TableHead scope="col" className="text-right">
                Clicks
              </TableHead>
              <TableHead scope="col" className="text-right">
                Subscriptions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!rows?.length && <TableRow><TableCell colSpan={3} className="text-muted-foreground">
              {rows ? "No tracking links were returned." : "Tracking links are temporarily unavailable."}
            </TableCell></TableRow>}
            {rows?.map(({ key, name, clicks, subscriptions }) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {count.format(clicks)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {count.format(subscriptions)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
