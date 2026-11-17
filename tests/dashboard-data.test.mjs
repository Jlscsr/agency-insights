import assert from "node:assert/strict"
import test from "node:test"

import { demoDashboard, parseRange, reportDays } from "../src/lib/dashboard-data.ts"

test("range parsing accepts supported values and defaults to seven days", () => {
  assert.equal(parseRange("3d"), "3d")
  assert.equal(parseRange("30d"), "30d")
  assert.equal(parseRange("unknown"), "7d")
  assert.equal(parseRange(["3d"]), "7d")
})

test("reporting windows exclude the current UTC day and cross month boundaries", () => {
  assert.deepEqual(reportDays("3d", new Date("2026-03-01T22:00:00Z")), [
    "2026-02-26", "2026-02-27", "2026-02-28",
  ])
})

test("sample charts agree across overlapping periods", () => {
  const short = demoDashboard("3d")
  const week = demoDashboard("7d")
  const month = demoDashboard("30d")
  assert.deepEqual(short.earnings, week.earnings.slice(-3))
  assert.deepEqual(week.subscribers, month.subscribers.slice(-7))
  assert.equal(week.earnings.reduce((total, row) => total + row.earnings, 0), 12480)
  assert.equal(week.subscribers.reduce((total, row) => total + row.newSubscribers, 0), 1240)
})
