// In-memory reminder scheduler. Pure time math + a tick loop.
const MIN = 60000;

function nextOccurrence(rule, from = Date.now()) {
  if (rule.type === "once") return rule.at > from ? rule.at : null;
  if (rule.type === "interval") {
    const elapsed = from - rule.start;
    const periods = Math.ceil(Math.max(0, elapsed) / rule.every);
    return rule.start + periods * rule.every;
  }
  if (rule.type === "daily") {
    const d = new Date(from);
    d.setHours(rule.hour, rule.minute || 0, 0, 0);
    if (d.getTime() <= from) d.setDate(d.getDate() + 1);
    return d.getTime();
  }
  return null;
}

class Scheduler {
  constructor() {
    this.reminders = [];
    this._seq = 0;
  }

  schedule(taskId, rule) {
    const r = { id: ++this._seq, taskId, rule, nextAt: nextOccurrence(rule) };
    this.reminders.push(r);
    return r;
  }

  cancel(id) {
    const i = this.reminders.findIndex((r) => r.id === id);
    if (i === -1) return false;
    this.reminders.splice(i, 1);
    return true;
  }

  due(now = Date.now()) {
    return this.reminders.filter((r) => r.nextAt != null && r.nextAt <= now);
  }

  fire(now = Date.now()) {
    const fired = [];
    for (const r of this.due(now)) {
      fired.push({ ...r });
      r.nextAt = r.rule.type === "once" ? null : nextOccurrence(r.rule, now + 1);
    }
    return fired.filter((f) => f.nextAt !== undefined);
  }
}

module.exports = { Scheduler, nextOccurrence, MIN };
