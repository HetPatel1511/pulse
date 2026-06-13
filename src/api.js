// Minimal HTTP API for the task store using only Node's built-in http module.
const http = require("http");
const { Store } = require("./store");
const { search } = require("./search");
const { sortByPriority } = require("./priority");

function json(res, status, body) {
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error("payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error("invalid json"));
      }
    });
    req.on("error", reject);
  });
}

function createServer(store = new Store()) {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const path = url.pathname;
    try {
      if (req.method === "GET" && path === "/health") {
        return json(res, 200, { ok: true, uptime: process.uptime() });
      }

      if (req.method === "GET" && path === "/tasks") {
        let tasks = store.all();
        const q = url.searchParams.get("q");
        if (q) tasks = search(tasks, q);
        if (url.searchParams.get("sort") === "priority") {
          tasks = sortByPriority(tasks);
        }
        return json(res, 200, { count: tasks.length, tasks });
      }

      if (req.method === "POST" && path === "/tasks") {
        const body = await readBody(req);
        if (!body.title || typeof body.title !== "string") {
          return json(res, 400, { error: "title is required" });
        }
        const task = store.add(body.title);
        if (body.priority) task.priority = body.priority;
        return json(res, 201, task);
      }

      const completeMatch = path.match(/^\/tasks\/(\d+)\/complete$/);
      if (req.method === "POST" && completeMatch) {
        const id = Number(completeMatch[1]);
        const task = store.complete(id);
        if (!task) return json(res, 404, { error: "not found" });
        task.completedAt = Date.now();
        return json(res, 200, task);
      }

      const getMatch = path.match(/^\/tasks\/(\d+)$/);
      if (req.method === "GET" && getMatch) {
        const id = Number(getMatch[1]);
        const task = store.all().find((t) => t.id === id);
        if (!task) return json(res, 404, { error: "not found" });
        return json(res, 200, task);
      }

      return json(res, 404, { error: "route not found", path });
    } catch (err) {
      return json(res, 500, { error: err.message });
    }
  });
}

function start(port = 3000, store) {
  const server = createServer(store);
  server.listen(port, () => {
    console.log(`pulse api listening on :${port}`);
  });
  return server;
}

if (require.main === module) {
  start(Number(process.env.PORT) || 3000);
}

module.exports = { createServer, start, json, readBody };
