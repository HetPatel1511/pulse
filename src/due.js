const DAY = 86400000;

function setDue(task, days) {
  return { ...task, dueAt: Date.now() + days * DAY };
}

function isOverdue(task, now = Date.now()) {
  return task.dueAt != null && task.dueAt < now;
}

// DRAFT: still deciding on timezone handling
module.exports = { setDue, isOverdue, DAY };
