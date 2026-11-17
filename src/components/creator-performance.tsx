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

import { count, usd, type CreatorRow } from "@/lib/dashboard-data"

export function CreatorPerformance({ rows }: { rows: CreatorRow[] | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Creator performance</CardTitle>
        <CardDescription>Ranked by completed net earnings</CardDescription>
      </CardHeader>

      <CardContent>
        <Table aria-label="Top creators by net earnings">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Creator</TableHead>
              <TableHead scope="col" className="text-right">
                Net earnings
              </TableHead>
              <TableHead scope="col" className="text-right">
                New subscribers
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!rows?.length && <TableRow><TableCell colSpan={3} className="text-muted-foreground">
              {rows ? "No connected creators." : "Creator performance is temporarily unavailable."}
            </TableCell></TableRow>}
            {rows?.map(({ key, name, netEarnings, newSubscribers }) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {usd.format(netEarnings)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {newSubscribers === null ? "Unavailable" : count.format(newSubscribers)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
