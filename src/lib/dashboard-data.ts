export type Range = "3d" | "7d" | "30d"

export function parseRange(value: unknown): Range {
  return value === "3d" || value === "30d" ? value : "7d"
}

export function reportDays(range: Range, now = new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const length = Number(range.slice(0, -1))
  return Array.from({ length }, (_, i) =>
    new Date(today - (length - i) * 86_400_000).toISOString().slice(0, 10),
  )
}

export type CreatorRow = { key: string; name: string; netEarnings: number; newSubscribers: number | null }
export type ChatterRow = { key: string; name: string; messagesSent: number; sales: number }
export type LinkRow = { key: string; name: string; clicks: number; subscriptions: number }
export type EarningsSource = { label: string; earnings: number }
export type AudienceSnapshot = { day: string; active: number }

export type DashboardData = {
  mode: "demo" | "live"
  days: string[]
  connectedCreators: number | null
  earnings: { day: string; earnings: number }[] | null
  earningsSources: EarningsSource[] | null
  refunds: number | null
  subscribers: { day: string; newSubscribers: number }[] | null
  renewals: number | null
  activeSubscriptions: AudienceSnapshot | null
  creators: CreatorRow[] | null
  chatters: ChatterRow[] | null
  links: LinkRow[] | null
}

export const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
export const count = new Intl.NumberFormat("en-US")

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

export function dateLabel(day: string) {
  return shortDate.format(new Date(day))
}

export function demoDashboard(range: Range): DashboardData {
  const days = reportDays(range, new Date("2026-11-09T00:00:00Z"))
  const earnings = [1420, 1680, 1550, 1940, 1770, 2050, 2070]
  const subscribers = [145, 161, 170, 182, 176, 196, 210]
  const samples = days.map((day) => {
    const weekday = (new Date(day).getUTCDay() + 6) % 7
    return { day, earnings: earnings[weekday], newSubscribers: subscribers[weekday] }
  })
  const net = samples.reduce((total, row) => total + row.earnings, 0)
  const newSubscribers = samples.reduce((total, row) => total + row.newSubscribers, 0)
  const factor = days.length / 7
  return {
    mode: "demo",
    days,
    connectedCreators: 8,
    earnings: samples,
    earningsSources: [
      { label: "Subscriptions", earnings: Math.round(net * 0.45) },
      { label: "Messages", earnings: Math.round(net * 0.30) },
      { label: "Tips", earnings: Math.round(net * 0.15) },
      { label: "Posts", earnings: net - Math.round(net * 0.45) - Math.round(net * 0.30) - Math.round(net * 0.15) },
    ],
    refunds: days.length * 24,
    subscribers: samples,
    renewals: samples.reduce((total, row) => total + Math.round(row.newSubscribers * 0.62), 0),
    activeSubscriptions: { day: days[days.length - 1], active: 3862 },
    creators: [{ name: "Creator A", share: 0.28 }, { name: "Creator B", share: 0.21 }, { name: "Creator C", share: 0.15 }].map(({ name, share }) => ({
      key: name, name,
      netEarnings: Math.round(net * share),
      newSubscribers: Math.round(newSubscribers * share),
    })),
    chatters: [
      { key: "a", name: "Chatter A", messagesSent: Math.round(1260 * factor), sales: Math.round(480 * factor) },
      { key: "b", name: "Chatter B", messagesSent: Math.round(1090 * factor), sales: Math.round(370 * factor) },
      { key: "c", name: "Chatter C", messagesSent: Math.round(1150 * factor), sales: Math.round(310 * factor) },
    ],
    links: [
      { key: "a", name: "Social bio", clicks: 1200, subscriptions: 72 },
      { key: "b", name: "Partner referral", clicks: 850, subscriptions: 51 },
      { key: "c", name: "Campaign page", clicks: 680, subscriptions: 34 },
    ],
  }
}
