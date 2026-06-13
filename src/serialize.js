// (De)serialization for the task store. JSON on disk, versioned envelope.

const SCHEMA_VERSION = 2;

function toPlain(task) {
  return {
    id: task.id,
    title: task.title,
    done: !!task.done,
    priority: task.priority || "normal",
    tags: task.tags || [],
    createdAt: task.createdAt || null,
    completedAt: task.completedAt || null,
    dueAt: task.dueAt || null,
  };
}

function fromPlain(obj) {
  return {
    id: Number(obj.id),
    title: String(obj.title || ""),
    done: !!obj.done,
    priority: obj.priority || "normal",
    tags: Array.isArray(obj.tags) ? obj.tags.slice() : [],
    createdAt: obj.createdAt || null,
    completedAt: obj.completedAt || null,
    dueAt: obj.dueAt || null,
  };
}

function serialize(store) {
  return JSON.stringify(
    {
      schema: SCHEMA_VERSION,
      savedAt: Date.now(),
      tasks: store.all().map(toPlain),
    },
    null,
    2
  );
}

function migrate(envelope) {
  let data = envelope;
  if (data.schema === 1) {
    // v1 had no tags array; backfill.
    data = {
      ...data,
      schema: 2,
      tasks: (data.tasks || []).map((t) => ({ tags: [], ...t })),
    };
  }
  if (data.schema !== SCHEMA_VERSION) {
    throw new Error(`unsupported schema version: ${data.schema}`);
  }
  return data;
}

function deserialize(text, store) {
  const raw = JSON.parse(text);
  const data = migrate(raw);
  let maxId = 0;
  for (const obj of data.tasks || []) {
    const task = fromPlain(obj);
    store.tasks.push(task);
    if (task.id > maxId) maxId = task.id;
  }
  store._restoreSeq && store._restoreSeq(maxId);
  return store;
}

module.exports = { serialize, deserialize, migrate, toPlain, fromPlain, SCHEMA_VERSION };
