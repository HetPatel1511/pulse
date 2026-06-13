const assert = require("assert");
const { Store } = require("../src/store");
const { query, Predicates, and, not } = require("../src/filters");
const { renderTable, summarize, truncate, pad } = require("../src/format");

function makeStore() {
  const s = new Store();
  const a = s.add("alpha #work");
  const b = s.add("beta #home");
  const c = s.add("gamma #work");
  a.tags = ["work"];
  b.tags = ["home"];
  c.tags = ["work"];
  a.priority = "high";
  s.complete(b.id);
  return { s, a, b, c };
}

let passed = 0;
function check(name, fn) {
  fn();
  passed++;
  console.log("ok -", name);
}

check("query.pending excludes done", () => {
  const { s } = makeStore();
  assert.strictEqual(query(s).pending().count(), 2);
});

check("query.tagged filters by tag", () => {
  const { s } = makeStore();
  assert.strictEqual(query(s).tagged("work").count(), 2);
});

check("query.atLeast filters by priority", () => {
  const { s } = makeStore();
  assert.strictEqual(query(s).atLeast("high").count(), 1);
});

check("query chaining: pending + tagged + sort + take", () => {
  const { s } = makeStore();
  const out = query(s).pending().tagged("work").sortBy("byId").take(1).toArray();
  assert.strictEqual(out.length, 1);
  assert.strictEqual(out[0].title, "alpha #work");
});

check("predicate combinators and/not", () => {
  const { s } = makeStore();
  const pred = and(Predicates.pending(), not(Predicates.hasTag("home")));
  assert.strictEqual(s.all().filter(pred).length, 2);
});

check("format.truncate + pad", () => {
  assert.strictEqual(truncate("hello world", 5), "hell…");
  assert.strictEqual(pad("x", 3), "x  ");
});

check("format.renderTable + summarize", () => {
  const { s } = makeStore();
  const table = renderTable(s.all());
  assert.ok(table.includes("alpha"));
  assert.strictEqual(summarize(s.all()), "1/3 done (33%)");
});

console.log("\n" + passed + " checks passed");
