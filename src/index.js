const { Store } = require("./store");
const { query } = require("./filters");
const { renderTable, summarize } = require("./format");

const store = new Store();
store.add("Write the spec");
store.add("Ship the MVP");
store.add("Backport the fix");
store.complete(1);

const pending = query(store).pending().sortBy("byCreated").toArray();

console.log("Pulse — pending tasks");
console.log(renderTable(pending));
console.log(summarize(store.all()));

module.exports = { store };
