// Composable, chainable filters/predicates over the task list.
// Pure functions; a Query builder composes them.

const { rank } = require("./priority");

const Predicates = {
  done: () => (t) => t.done === true,
  pending: () => (t) => t.done !== true,
  hasTag: (tag) => (t) => (t.tags || []).includes(tag),
  priorityAtLeast: (level) => (t) => rank(t.priority || "normal") >= rank(level),
  titleMatches: (re) => (t) => re.test(t.title),
  createdAfter: (ts) => (t) => (t.createdAt || 0) > ts,
  createdBefore: (ts) => (t) => (t.createdAt || 0) < ts,
  overdue: (now = Date.now()) => (t) => t.dueAt != null && t.dueAt < now,
};

function and(...preds) {
  return (t) => preds.every((p) => p(t));
}

function or(...preds) {
  return (t) => preds.some((p) => p(t));
}

function not(pred) {
  return (t) => !pred(t);
}

const Comparators = {
  byId: (a, b) => a.id - b.id,
  byTitle: (a, b) => a.title.localeCompare(b.title),
  byPriority: (a, b) => rank(b.priority || "normal") - rank(a.priority || "normal"),
  byCreated: (a, b) => (a.createdAt || 0) - (b.createdAt || 0),
  byDue: (a, b) => (a.dueAt || Infinity) - (b.dueAt || Infinity),
};

class Query {
  constructor(tasks) {
    this._tasks = tasks;
    this._preds = [];
    this._comparator = null;
    this._limit = null;
    this._offset = 0;
  }

  where(pred) {
    this._preds.push(pred);
    return this;
  }

  done() {
    return this.where(Predicates.done());
  }

  pending() {
    return this.where(Predicates.pending());
  }

  tagged(tag) {
    return this.where(Predicates.hasTag(tag));
  }

  atLeast(level) {
    return this.where(Predicates.priorityAtLeast(level));
  }

  matching(pattern) {
    const re = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
    return this.where(Predicates.titleMatches(re));
  }

  sortBy(comparator) {
    this._comparator =
      typeof comparator === "string" ? Comparators[comparator] : comparator;
    return this;
  }

  skip(n) {
    this._offset = Math.max(0, n | 0);
    return this;
  }

  take(n) {
    this._limit = Math.max(0, n | 0);
    return this;
  }

  toArray() {
    let out = this._tasks.filter(and(...this._preds));
    if (this._comparator) out = out.sort(this._comparator);
    if (this._offset) out = out.slice(this._offset);
    if (this._limit != null) out = out.slice(0, this._limit);
    return out;
  }

  count() {
    return this.toArray().length;
  }

  first() {
    return this.toArray()[0] || null;
  }
}

function query(tasksOrStore) {
  const tasks =
    typeof tasksOrStore.all === "function" ? tasksOrStore.all() : tasksOrStore;
  return new Query(tasks);
}

module.exports = {
  Predicates,
  Comparators,
  Query,
  query,
  and,
  or,
  not,
};
