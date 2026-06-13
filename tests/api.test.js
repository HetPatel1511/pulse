const assert = require("assert");
const http = require("http");
const { createServer } = require("../src/api");
const { Store } = require("../src/store");

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const addr = server.address();
    const req = http.request(
      { method, path, port: addr.port, host: "127.0.0.1" },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body: buf ? JSON.parse(buf) : null })
        );
      }
    );
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const server = createServer(new Store());
  await new Promise((r) => server.listen(0, r));

  let res = await request(server, "GET", "/health");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, true);

  res = await request(server, "POST", "/tasks", { title: "first" });
  assert.strictEqual(res.status, 201);
  const id = res.body.id;

  res = await request(server, "POST", `/tasks/${id}/complete`);
  assert.strictEqual(res.body.done, true);

  res = await request(server, "GET", "/tasks");
  assert.strictEqual(res.body.count, 1);

  res = await request(server, "POST", "/tasks", {});
  assert.strictEqual(res.status, 400);

  server.close();
  console.log("ok - api routes");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
