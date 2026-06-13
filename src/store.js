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

// Convenience lookup added alongside the filters work.
function findById(tasks, id) {
  return tasks.find((t) => t.id === id) || null;
}
module.exports.findById = findById;
