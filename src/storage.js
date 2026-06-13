// File-backed persistence wrapper around a Store.
const fs = require("fs");
const path = require("path");
const { serialize, deserialize } = require("./serialize");
const { Store } = require("./store");

class FileStorage {
  constructor(file) {
    this.file = path.resolve(file);
  }

  exists() {
    return fs.existsSync(this.file);
  }

  load() {
    const store = new Store();
    if (!this.exists()) return store;
    const text = fs.readFileSync(this.file, "utf8");
    return deserialize(text, store);
  }

  save(store) {
    const tmp = this.file + ".tmp";
    fs.writeFileSync(tmp, serialize(store), "utf8");
    fs.renameSync(tmp, this.file); // atomic-ish replace
    return this.file;
  }

  autosave(store, intervalMs = 5000) {
    const timer = setInterval(() => this.save(store), intervalMs);
    timer.unref && timer.unref();
    return () => clearInterval(timer);
  }
}

module.exports = { FileStorage };
