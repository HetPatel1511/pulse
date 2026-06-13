const LEVELS = ["low", "normal", "high", "urgent"];

function rank(level) {
  const i = LEVELS.indexOf(level);
  return i === -1 ? 1 : i;
}

function sortByPriority(tasks) {
  return [...tasks].sort((a, b) => rank(b.priority) - rank(a.priority));
}

module.exports = { LEVELS, rank, sortByPriority };
