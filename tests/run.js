const assert = require("assert");
const { Store } = require("../src/store");

const s = new Store();
const a = s.add("one");
s.add("two");
assert.strictEqual(s.count(), 2);
s.complete(a.id);
assert.strictEqual(s.all()[0].done, true);
console.log("ok - store basics");
