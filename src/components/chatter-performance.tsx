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

import { count, usd, type ChatterRow } from "@/lib/dashboard-data"

export function ChatterPerformance({ rows }: { rows: ChatterRow[] | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold"><h3>Chatter performance</h3></CardTitle>
        <CardDescription>Up to 8 active employees · Ranked by attributed sales</CardDescription>
      </CardHeader>

      <CardContent>
        <Table aria-label="Top chatters by sales">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Chatter</TableHead>
              <TableHead scope="col" className="whitespace-normal text-right">
                Direct messages
              </TableHead>
              <TableHead scope="col" className="text-right">
                Sales (USD)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!rows?.length && <TableRow><TableCell colSpan={3} className="text-muted-foreground">
              {rows ? "No chatter activity in this period." : "Chatter performance is temporarily unavailable."}
            </TableCell></TableRow>}
            {rows?.slice(0, 8).map(({ key, name, messagesSent, sales }) => (
              <TableRow key={key}>
                <TableCell className="font-medium whitespace-normal [overflow-wrap:anywhere]">{name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {count.format(messagesSent)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {usd.format(sales)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
