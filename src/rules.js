// Parse human-ish reminder strings into scheduler rules.
const UNITS = { m: 60000, h: 3600000, d: 86400000 };

function parseDuration(text) {
  const m = /^(\d+)\s*([mhd])$/.exec(text.trim());
  if (!m) return null;
  return Number(m[1]) * UNITS[m[2]];
}

function parseRule(text, now = Date.now()) {
  const t = text.trim().toLowerCase();
  let m;
  if ((m = /^in\s+(.+)$/.exec(t))) {
    const ms = parseDuration(m[1]);
    if (ms == null) throw new Error(`bad duration: ${m[1]}`);
    return { type: "once", at: now + ms };
  }
  if ((m = /^every\s+(.+)$/.exec(t))) {
    const ms = parseDuration(m[1]);
    if (ms == null) throw new Error(`bad interval: ${m[1]}`);
    return { type: "interval", start: now, every: ms };
  }
  if ((m = /^daily\s+at\s+(\d{1,2}):(\d{2})$/.exec(t))) {
    return { type: "daily", hour: Number(m[1]), minute: Number(m[2]) };
  }
  throw new Error(`unrecognized rule: "${text}"`);
}

module.exports = { parseRule, parseDuration, UNITS };
