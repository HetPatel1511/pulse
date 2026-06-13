function parseTags(title) {
  return (title.match(/#(\w+)/g) || []).map((t) => t.slice(1).toLowerCase());
}

function withTags(task) {
  return { ...task, tags: parseTags(task.title) };
}

module.exports = { parseTags, withTags };
  // TODO: support multi-word tags via quotes
