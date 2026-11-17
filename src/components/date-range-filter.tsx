import { Button } from "@/components/ui/button"
import type { Range } from "@/lib/dashboard-data"

type DateRangeFilterProps = {
  range: Range
}

export function DateRangeFilter({ range }: DateRangeFilterProps) {
  return (
    <form action="/" method="get" className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
      <label htmlFor="trend-range" className="w-full text-sm font-medium sm:w-auto sm:pr-1">
        Reporting period
      </label>

      <select
        id="trend-range"
        name="range"
        defaultValue={range}
        className="h-10 flex-1 rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <option value="3d">Last 3 days</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>

      <Button type="submit" className="h-10 px-4">
        Apply
      </Button>
    </form>
  )
}
