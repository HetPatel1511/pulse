const { FileStorage } = require("./storage");

const storage = new FileStorage(process.env.PULSE_DB || ".pulse.json");
const store = storage.load();

if (store.count() === 0) {
  store.add("Write the spec");
  store.add("Ship the MVP");
}

console.log(`Loaded ${store.count()} tasks from ${storage.file}`);
for (const t of store.all()) {
  console.log(`#${t.id} [${t.done ? "x" : " "}] ${t.title}`);
}
storage.save(store);

module.exports = { store, storage };
