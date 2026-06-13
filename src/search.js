function search(tasks, query) {
  const q = query.toLowerCase();
  return tasks.filter((t) => t.title.toLowerCase().includes(q));
}

module.exports = { search };
