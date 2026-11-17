import "server-only"

import { reportDays, type DashboardData, type Range } from "@/lib/dashboard-data"
import { identifier, inflowwRows, integer } from "@/lib/infloww"

function displayName(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

function batches(ids: string[]) {
  return Array.from({ length: Math.ceil(ids.length / 10) }, (_, index) =>
    ids.slice(index * 10, index * 10 + 10),
  )
}

async function section<T>(label: string, read: Promise<T>) {
  try {
    return await read
  } catch {
    console.warn(`Could not load Infloww ${label}`)
    return null
  }
}

async function readDashboard(days: string[]): Promise<DashboardData> {
  const dateQuery = { startTime: days[0], endTime: days[days.length - 1] }
  const timestampQuery = {
    startTime: `${dateQuery.startTime}T00:00:00.000Z`,
    endTime: `${dateQuery.endTime}T23:59:59.999Z`,
    limit: "100",
  }
  const creatorList = inflowwRows("/v1/creators", { limit: "100" }).then((rows) =>
    rows.map((row, index) => ({
      id: identifier(row.id),
      platformId: identifier(row.platformPid),
      name: displayName(row.name, `Creator ${index + 1}`),
    })),
  )
  const employeeList = inflowwRows("/v1/employees", { limit: "100" }).then((rows) =>
    rows.filter((row) => row.status === "Activated").map((row, index) => ({
      id: identifier(row.employeeId),
      name: displayName(row.employeeName, `Employee ${index + 1}`),
    })),
  )

  const [connectedCreators, revenue, audience, chatters, links] = await Promise.all([
    section("creator roster", creatorList.then((list) => list.length)),
    section("transactions", creatorList.then(async (creators) => {
      const daily = days.map((day) => ({ day, earnings: 0 }))
      const dayIndexes = new Map(days.map((day, index) => [day, index]))
      const pages = await Promise.all(creators.map((creator) =>
        inflowwRows("/v1/transactions", { ...timestampQuery, creatorId: creator.id }),
      ))
      const entries = creators.map((creator, index) => {
        let net = 0
        for (const row of pages[index]) {
          if (row.status !== "done" || row.currency !== "USD") continue
          const date = new Date(integer(row.createdTime)).toISOString().slice(0, 10)
          const position = dayIndexes.get(date)
          if (position === undefined) continue
          const cents = integer(row.net)
          net += cents
          daily[position].earnings += cents
        }
        return { key: creator.id, platformId: creator.platformId, name: creator.name, netEarnings: net / 100 }
      })
      return {
        daily: daily.map(({ day, earnings }) => ({ day, earnings: earnings / 100 })),
        entries: entries.sort((a, b) => b.netEarnings - a.netEarnings),
      }
    })),
    section("subscriber reports", creatorList.then(async (creators) => {
      const pages = await Promise.all(batches(creators.map((creator) => creator.id)).map((creatorIds) =>
        inflowwRows("/v1/creator-report/fans/subscriber-count", { ...dateQuery, creatorIds }),
      ))
      const daily = new Map(days.map((day) => [day, 0]))
      const perCreator = new Map<string, number>()
      for (const row of pages.flat()) {
        const date = identifier(row.date)
        if (!daily.has(date)) continue
        const creator = identifier(row.platformPid)
        const count = integer(row.newSubscribers)
        daily.set(date, (daily.get(date) ?? 0) + count)
        perCreator.set(creator, (perCreator.get(creator) ?? 0) + count)
      }
      return { daily: [...daily].map(([day, newSubscribers]) => ({ day, newSubscribers })), perCreator }
    })),
    section("employee reports", employeeList.then(async (employees) => {
      const groups = batches(employees.map((employee) => employee.id))
      const [chatPages, salesPages] = await Promise.all([
        Promise.all(groups.map((employeeIds) =>
          inflowwRows("/v1/employee-report/employee-chat-summary", { ...dateQuery, employeeIds }),
        )),
        Promise.all(groups.map((employeeIds) =>
          inflowwRows("/v1/employee-report/employee-sales-summary", { ...dateQuery, employeeIds }),
        )),
      ])
      const messages = new Map<string, number>()
      const sales = new Map<string, number>()
      for (const row of chatPages.flat()) {
        if (!days.includes(identifier(row.date))) continue
        const employee = identifier(row.employeeId)
        messages.set(employee, (messages.get(employee) ?? 0) + integer(row.directMessagesSent))
      }
      for (const row of salesPages.flat()) {
        if (row.currency !== "USD" || !days.includes(identifier(row.date))) continue
        const employee = identifier(row.employeeId)
        sales.set(employee, (sales.get(employee) ?? 0) + integer(row.salesAmount))
      }
      return employees.map(({ id, name }) => ({
        key: id, name, messagesSent: messages.get(id) ?? 0, sales: (sales.get(id) ?? 0) / 100,
      })).filter((row) => row.messagesSent > 0 || row.sales !== 0)
        .sort((a, b) => b.sales - a.sales || b.messagesSent - a.messagesSent)
    })),
    section("tracking links", creatorList.then(async (creators) => {
      const last30 = reportDays("30d", new Date(Date.parse(timestampQuery.endTime) + 1))
      const pages = await Promise.all(creators.map((creator) =>
        inflowwRows("/v1/links", {
          ...timestampQuery,
          startTime: `${last30[0]}T00:00:00.000Z`,
          creatorId: creator.id,
          linkType: "TRACKING",
        }),
      ))
      return pages.flatMap((page, index) => page.map((row) => ({
        key: `${creators[index].id}:${identifier(row.id)}`,
        name: displayName(row.name, "Unnamed link"),
        clicks: integer(row.clickCount),
        subscriptions: integer(row.subCount),
      }))).sort((a, b) => b.subscriptions - a.subscriptions || b.clicks - a.clicks).slice(0, 10)
    })),
  ])

  return {
    mode: "live",
    days,
    connectedCreators,
    earnings: revenue?.daily ?? null,
    subscribers: audience?.daily ?? null,
    creators: revenue?.entries.map(({ platformId, ...row }) => ({
      ...row,
      newSubscribers: audience ? audience.perCreator.get(platformId) ?? 0 : null,
    })) ?? null,
    chatters,
    links,
  }
}

const cache = new Map<Range, { key: string; until: number; data: Promise<DashboardData> }>()

export function liveDashboard(range: Range) {
  const days = reportDays(range)
  const key = days[days.length - 1]
  const existing = cache.get(range)
  if (existing?.key === key && existing.until > Date.now()) return existing.data

  const entry = { key, until: Infinity, data: readDashboard(days) }
  cache.set(range, entry)
  void entry.data.then(
    (data) => {
      const complete = [data.earnings, data.subscribers, data.chatters, data.links].every((value) => value !== null)
      entry.until = Date.now() + (complete ? 60_000 : 10_000)
    },
    () => cache.delete(range),
  )
  return entry.data
}
