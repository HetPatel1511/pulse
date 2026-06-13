let _seq = 0;

class Store {
  constructor() {
    this.tasks = [];
  }
  add(title) {
    const task = { id: ++_seq, title, done: false, createdAt: Date.now() };
    this.tasks.push(task);
    return task;
  }
  complete(id) {
    const t = this.tasks.find((t) => t.id === id);
    if (t) t.done = true;
    return t;
  }
  all() {
    return [...this.tasks];
  }
  count() {
    return this.tasks.length;
  }
}

module.exports = { Store };

// Allow persistence layer to restore the id counter after a load.
Store.prototype._restoreSeq = function (maxId) {
  if (typeof maxId === "number" && maxId > _seqRef()) _setSeq(maxId);
};
function _seqRef() { return _seq; }
function _setSeq(v) { _seq = v; }
