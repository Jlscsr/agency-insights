import { LayoutDashboard } from "lucide-react"
import Link from "next/link"

export function DashboardSidebar() {
  return (
    <nav
      aria-label="Dashboard navigation"
      className="border-b border-border p-3 lg:w-56 lg:shrink-0 lg:border-r lg:border-b-0 lg:p-4"
    >
      <Link
        href="/"
        aria-current="page"
        className="flex items-center gap-3 rounded-md bg-accent px-3 py-2.5 text-sm font-medium text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <LayoutDashboard className="size-4 shrink-0" aria-hidden="true" />
        Overview
      </Link>
    </nav>
  )
}