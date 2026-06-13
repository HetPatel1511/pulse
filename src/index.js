const { Store } = require("./store");
const { Scheduler } = require("./scheduler");
const { parseRule } = require("./rules");

const store = new Store();
const sched = new Scheduler();

const t1 = store.add("Stand-up");
const t2 = store.add("Water the plants");

sched.schedule(t1.id, parseRule("daily at 09:00"));
sched.schedule(t2.id, parseRule("every 2d"));

console.log(`Scheduled ${sched.reminders.length} reminders`);
for (const r of sched.reminders) {
  console.log(`  reminder #${r.id} -> task #${r.taskId} next ${new Date(r.nextAt).toISOString()}`);
}

module.exports = { store, sched };
