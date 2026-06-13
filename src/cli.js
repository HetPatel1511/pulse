#!/usr/bin/env node
// Tiny argv-driven CLI for the task store. Persists nothing; demo only.
const { Store } = require("./store");
const { sortByPriority, LEVELS } = require("./priority");
const { parseTags } = require("./tags");

const store = new Store();

const COMMANDS = {
  add: {
    help: "add <title>            create a task",
    run(args) {
      const title = args.join(" ");
      if (!title) throw new Error("add: title required");
      const t = store.add(title);
      t.tags = parseTags(title);
      console.log(`added #${t.id}: ${t.title}`);
    },
  },
  done: {
    help: "done <id>              mark a task complete",
    run(args) {
      const id = Number(args[0]);
      const t = store.complete(id);
      if (!t) throw new Error(`done: no task #${id}`);
      console.log(`completed #${t.id}`);
    },
  },
  prio: {
    help: "prio <id> <level>      set priority",
    run(args) {
      const id = Number(args[0]);
      const level = args[1];
      if (!LEVELS.includes(level)) {
        throw new Error(`prio: level must be one of ${LEVELS.join(", ")}`);
      }
      const t = store.all().find((x) => x.id === id);
      if (!t) throw new Error(`prio: no task #${id}`);
      t.priority = level;
      console.log(`#${t.id} -> ${level}`);
    },
  },
  list: {
    help: "list                   show all tasks by priority",
    run() {
      const tasks = sortByPriority(store.all());
      if (tasks.length === 0) return console.log("(no tasks)");
      for (const t of tasks) {
        const box = t.done ? "[x]" : "[ ]";
        const p = (t.priority || "normal").padEnd(7);
        console.log(`${box} #${t.id} ${p} ${t.title}`);
      }
    },
  },
  help: {
    help: "help                   show this help",
    run() {
      console.log("pulse - commands:");
      for (const name of Object.keys(COMMANDS)) {
        console.log("  " + COMMANDS[name].help);
      }
    },
  },
};

function dispatch(argv) {
  const [cmd, ...rest] = argv;
  const command = COMMANDS[cmd];
  if (!command) {
    COMMANDS.help.run();
    if (cmd) process.exitCode = 1;
    return;
  }
  try {
    command.run(rest);
  } catch (err) {
    console.error("error:", err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  dispatch(process.argv.slice(2));
}

module.exports = { dispatch, COMMANDS, store };
