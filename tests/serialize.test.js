const assert = require("assert");
const { Store } = require("../src/store");
const { serialize, deserialize, migrate } = require("../src/serialize");

const s = new Store();
const a = s.add("one");
a.tags = ["x"];
s.add("two");
s.complete(a.id);

const text = serialize(s);
const restored = deserialize(text, new Store());
assert.strictEqual(restored.count(), 2);
assert.strictEqual(restored.all()[0].done, true);
assert.deepStrictEqual(restored.all()[0].tags, ["x"]);

const v1 = migrate({ schema: 1, tasks: [{ id: 1, title: "old" }] });
assert.strictEqual(v1.schema, 2);
assert.deepStrictEqual(v1.tasks[0].tags, []);

console.log("ok - serialize round-trip + v1 migration");
