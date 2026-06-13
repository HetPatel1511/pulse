const assert = require("assert");
const { Scheduler, nextOccurrence } = require("../src/scheduler");
const { parseRule, parseDuration } = require("../src/rules");

const NOW = 1_700_000_000_000;

assert.strictEqual(parseDuration("30m"), 1_800_000);
assert.strictEqual(parseDuration("2h"), 7_200_000);
assert.strictEqual(parseDuration("nope"), null);

const once = parseRule("in 30m", NOW);
assert.strictEqual(once.type, "once");
assert.strictEqual(once.at, NOW + 1_800_000);

const iv = parseRule("every 1h", NOW);
assert.strictEqual(nextOccurrence(iv, NOW + 90 * 60000), iv.start + 2 * 3600000);

const s = new Scheduler();
const r = s.schedule(7, parseRule("in 1m", NOW));
assert.strictEqual(s.due(NOW).length, 0);
assert.strictEqual(s.due(NOW + 61000).length, 1);
const fired = s.fire(NOW + 61000);
assert.strictEqual(fired.length, 1);
assert.strictEqual(s.reminders[0].nextAt, null); // once -> done

assert.throws(() => parseRule("blah"));

console.log("ok - scheduler + rules");
