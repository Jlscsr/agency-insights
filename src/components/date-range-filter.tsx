import { Button } from "@/components/ui/button"
import type { Range } from "@/lib/dashboard-data"

type DateRangeFilterProps = {
  range: Range
}

export function DateRangeFilter({ range }: DateRangeFilterProps) {
  return (
    <form action="/" method="get" className="flex flex-wrap items-center gap-2">
      <label htmlFor="trend-range" className="text-sm font-medium">
        Reporting period
      </label>

      <select
        id="trend-range"
        name="range"
        defaultValue={range}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <option value="3d">Last 3 days</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>

      <Button type="submit" size="sm">
        Apply
      </Button>
    </form>
  )
}
