// Rendering helpers: turn tasks into tables, badges, and plain text.

const BADGES = {
  low: "·",
  normal: "•",
  high: "‼",
  urgent: "🔥",
};

function badge(task) {
  return BADGES[task.priority || "normal"] || "•";
}

function checkbox(task) {
  return task.done ? "[x]" : "[ ]";
}

function pad(str, width) {
  str = String(str);
  return str.length >= width ? str : str + " ".repeat(width - str.length);
}

function truncate(str, max) {
  str = String(str);
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
}

function renderRow(task) {
  return [
    checkbox(task),
    pad(`#${task.id}`, 5),
    badge(task),
    truncate(task.title, 40),
  ].join(" ");
}

function renderTable(tasks) {
  if (tasks.length === 0) return "(no tasks)";
  const header = "    " + pad("id", 5) + "   title";
  const sep = "-".repeat(header.length);
  const rows = tasks.map(renderRow);
  return [header, sep, ...rows].join("\n");
}

function renderTags(task) {
  return (task.tags || []).map((t) => `#${t}`).join(" ");
}

function summarize(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  return `${done}/${total} done (${total === 0 ? 0 : Math.round((done / total) * 100)}%)`;
}

module.exports = {
  badge,
  checkbox,
  pad,
  truncate,
  renderRow,
  renderTable,
  renderTags,
  summarize,
  BADGES,
};
