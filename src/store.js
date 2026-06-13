// Store with input validation and lightweight events.
let _seq = 0;

const MAX_TITLE = 200;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateTitle(title) {
  if (typeof title !== "string") throw new ValidationError("title must be a string");
  const trimmed = title.trim();
  if (trimmed.length === 0) throw new ValidationError("title must not be empty");
  if (trimmed.length > MAX_TITLE) {
    throw new ValidationError(`title must be <= ${MAX_TITLE} chars`);
  }
  return trimmed;
}

class Store {
  constructor() {
    this.tasks = [];
    this._listeners = {};
  }

  on(event, fn) {
    (this._listeners[event] = this._listeners[event] || []).push(fn);
    return this;
  }

  _emit(event, payload) {
    for (const fn of this._listeners[event] || []) fn(payload);
  }

  add(title) {
    const clean = validateTitle(title);
    const task = { id: ++_seq, title: clean, done: false, createdAt: Date.now() };
    this.tasks.push(task);
    this._emit("add", task);
    return task;
  }

  complete(id) {
    const t = this.tasks.find((t) => t.id === id);
    if (t && !t.done) {
      t.done = true;
      t.completedAt = Date.now();
      this._emit("complete", t);
    }
    return t;
  }

  remove(id) {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    const [removed] = this.tasks.splice(idx, 1);
    this._emit("remove", removed);
    return true;
  }

  all() {
    return [...this.tasks];
  }

  count() {
    return this.tasks.length;
  }
}

module.exports = { Store, ValidationError, validateTitle, MAX_TITLE };
