import "server-only"

export type InflowwRow = Record<string, unknown>
type Query = Record<string, string | string[]>

function isRow(value: unknown): value is InflowwRow {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parsePage(body: unknown) {
  if (!isRow(body) || !isRow(body.data) || !Array.isArray(body.data.list) || !body.data.list.every(isRow)) {
    throw new Error("Invalid Infloww response")
  }
  if (body.hasMore !== undefined && typeof body.hasMore !== "boolean") {
    throw new Error("Invalid Infloww pagination")
  }
  const cursor = body.hasMore ? identifier(body.cursor) : null
  return { rows: body.data.list as InflowwRow[], cursor }
}

export function identifier(value: unknown): string {
  if ((typeof value === "string" && value.length > 0) || (typeof value === "number" && Number.isSafeInteger(value))) {
    return String(value)
  }
  throw new Error("Invalid Infloww identifier")
}

export function integer(value: unknown): number {
  const amount = typeof value === "string" && /^-?\d+$/.test(value) ? Number(value) : value
  if (typeof amount !== "number" || !Number.isSafeInteger(amount)) {
    throw new Error("Invalid Infloww integer")
  }
  return amount
}

let nextRequest = 0

async function request(url: URL, headers: HeadersInit) {
  for (let attempt = 0; ; attempt++) {
    const start = Math.max(Date.now(), nextRequest)
    nextRequest = start + 240
    await new Promise((resolve) => setTimeout(resolve, start - Date.now()))
    const response = await fetch(url, {
      headers,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8_000),
    })

    if (response.ok) return parsePage(await response.json())

    if (response.status !== 429 || attempt === 2) {
      throw new Error(`Infloww ${url.pathname} returned HTTP ${response.status}`)
    }

    const retryAfter = response.headers.get("retry-after")
    const retryMs = retryAfter === null ? 0 : Math.max(0, Number(retryAfter) * 1000 || Date.parse(retryAfter) - Date.now())
    nextRequest = Math.max(nextRequest, Date.now() + Math.min(5000, Math.max(1000 * (attempt + 1), retryMs || 0)))
  }
}

export async function inflowwRows(path: string, query: Query = {}) {
  const apiKey = process.env.INFLOWW_API_KEY?.trim()
  const agencyOid = process.env.INFLOWW_AGENCY_OID?.trim()
  if (!apiKey || !agencyOid) throw new Error("Infloww credentials are missing")

  const headers = { Accept: "application/json", Authorization: apiKey, "x-oid": agencyOid }
  const url = new URL(path, "https://openapi.infloww.com")
  for (const [key, values] of Object.entries(query)) {
    for (const value of [values].flat()) url.searchParams.append(key, value)
  }

  const rows: InflowwRow[] = []
  const seen = new Set<string>()
  for (;;) {
    const page = await request(url, headers)
    rows.push(...page.rows)
    if (!page.cursor) return rows
    if (seen.has(page.cursor)) throw new Error("Infloww repeated a pagination cursor")
    seen.add(page.cursor)
    url.searchParams.set("cursor", page.cursor)
  }
}
