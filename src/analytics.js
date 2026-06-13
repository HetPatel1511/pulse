// Lightweight in-memory analytics over the task store.
// No external deps; everything here is pure functions plus one aggregator class.

const DAY = 86400000;

function startOfDay(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function groupBy(items, keyFn) {
  const out = new Map();
  for (const item of items) {
    const k = keyFn(item);
    if (!out.has(k)) out.set(k, []);
    out.get(k).push(item);
  }
  return out;
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const k = keyFn(item);
    counts[k] = (counts[k] || 0) + 1;
  }
  return counts;
}

function completionRate(tasks) {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.done).length;
  return Number((done / tasks.length).toFixed(4));
}

function averageAgeMs(tasks, now = Date.now()) {
  if (tasks.length === 0) return 0;
  const total = tasks.reduce((sum, t) => sum + (now - (t.createdAt || now)), 0);
  return Math.round(total / tasks.length);
}

function throughputByDay(tasks) {
  const buckets = groupBy(
    tasks.filter((t) => t.done),
    (t) => startOfDay(t.completedAt || t.createdAt || Date.now())
  );
  const result = [];
  for (const [day, group] of buckets.entries()) {
    result.push({ day, completed: group.length });
  }
  return result.sort((a, b) => a.day - b.day);
}

function priorityBreakdown(tasks) {
  return countBy(tasks, (t) => t.priority || "normal");
}

function tagCloud(tasks) {
  const counts = {};
  for (const t of tasks) {
    for (const tag of t.tags || []) {
      counts[tag] = (counts[tag] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

function movingAverage(series, window) {
  if (window <= 1) return series.slice();
  const out = [];
  for (let i = 0; i < series.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = series.slice(start, i + 1);
    const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
    out.push(Number(avg.toFixed(3)));
  }
  return out;
}

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

class Analytics {
  constructor(store) {
    this.store = store;
  }

  snapshot(now = Date.now()) {
    const tasks = this.store.all();
    return {
      total: tasks.length,
      completionRate: completionRate(tasks),
      averageAgeMs: averageAgeMs(tasks, now),
      priorities: priorityBreakdown(tasks),
      overdue: tasks.filter((t) => t.dueAt != null && t.dueAt < now).length,
      tags: tagCloud(tasks).slice(0, 10),
    };
  }

  weeklyThroughput() {
    const series = throughputByDay(this.store.all()).map((d) => d.completed);
    return {
      series,
      smoothed: movingAverage(series, 3),
      p90: percentile(series, 90),
    };
  }

  report(now = Date.now()) {
    const snap = this.snapshot(now);
    const lines = [];
    lines.push("=== Pulse Analytics Report ===");
    lines.push(`Total tasks:      ${snap.total}`);
    lines.push(`Completion rate:  ${(snap.completionRate * 100).toFixed(1)}%`);
    lines.push(`Avg age:          ${(snap.averageAgeMs / DAY).toFixed(2)} days`);
    lines.push(`Overdue:          ${snap.overdue}`);
    lines.push("Priorities:");
    for (const [level, n] of Object.entries(snap.priorities)) {
      lines.push(`  - ${level.padEnd(8)} ${n}`);
    }
    lines.push("Top tags:");
    for (const { tag, count } of snap.tags) {
      lines.push(`  - #${tag} (${count})`);
    }
    return lines.join("\n");
  }
}

module.exports = {
  Analytics,
  groupBy,
  countBy,
  completionRate,
  averageAgeMs,
  throughputByDay,
  priorityBreakdown,
  tagCloud,
  movingAverage,
  percentile,
  startOfDay,
  DAY,
};
