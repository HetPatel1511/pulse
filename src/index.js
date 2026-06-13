const { Store } = require("./store");
const store = new Store();

store.add("Write the spec");
store.add("Ship the MVP");

console.log("Pulse booting with", store.count(), "tasks");
for (const t of store.all()) console.log(`#${t.id} [${t.done ? "x" : " "}] ${t.title}`);

module.exports = { store };
