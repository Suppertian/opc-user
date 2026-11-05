import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const clientSource = await readFile(join(here, "..", "backend-client.js"), "utf8");
const supabaseClientSource = await readFile(join(here, "..", "supabase-client.js"), "utf8");
const pageSource = await readFile(join(here, "..", "index.html"), "utf8");
const configSource = await readFile(join(here, "..", "backend-config.js"), "utf8");

function loadBackend(config, fetchImpl) {
  const window = {
    OPC_BACKEND_CONFIG: config,
    fetch: fetchImpl,
    location: { href: "https://portfolio.example/" },
  };
  vm.runInNewContext(clientSource, { window, URL });
  return window.OPCBackend;
}

test("does not make a request when the owner's backend is not configured", async () => {
  let fetchCount = 0;
  const backend = loadBackend({}, async () => { fetchCount += 1; });

  assert.equal(backend.isConfigured(), false);
  await assert.rejects(backend.request("/functions/v1/task-runtime/messages/send"), {
    code: "BACKEND_NOT_CONFIGURED",
  });
  assert.equal(fetchCount, 0);
});

test("uses only the backend configuration supplied by the owner", async () => {
  const expectedResponse = { ok: true };
  let calledWith;
  const backend = loadBackend({
    supabaseUrl: "https://own-demo.example",
    publishableKey: "own-demo-key",
  }, async (...args) => {
    calledWith = args;
    return expectedResponse;
  });

  const response = await backend.request("https://own-demo.example/functions/v1/task-runtime/messages/send", {
    method: "POST",
  });

  assert.equal(backend.isConfigured(), true);
  assert.equal(response, expectedResponse);
  assert.equal(calledWith[0], "https://own-demo.example/functions/v1/task-runtime/messages/send");
});

test("does not send configured requests to a different host", async () => {
  let fetchCount = 0;
  const backend = loadBackend({
    supabaseUrl: "https://own-demo.example",
    publishableKey: "own-demo-key",
  }, async () => { fetchCount += 1; });

  await assert.rejects(backend.request("https://other.example/functions/v1/task-runtime/messages/send"), {
    code: "BACKEND_ORIGIN_MISMATCH",
  });
  assert.equal(fetchCount, 0);
});

test("ships with empty backend config and routes requests through the guard", () => {
  assert.match(configSource, /supabaseUrl:\s*""/);
  assert.match(configSource, /publishableKey:\s*""/);
  assert.doesNotMatch(pageSource, /https:\/\/[a-z0-9-]+\.supabase\.co/i);
  assert.doesNotMatch(pageSource, /admin\.zhaoyawei\.cn/i);
  assert.equal((pageSource.match(/\bOPCBackend\.request\s*\(/g) || []).length, 12);
  assert.doesNotMatch(pageSource, /(?<![\w.])fetch\s*\(/);
  assert.match(pageSource, /后端未配置，当前仅展示界面/);
});

test("does not instantiate Supabase when the public config is empty", () => {
  let createClientCount = 0;
  const window = {
    OPC_BACKEND_CONFIG: { supabaseUrl: "", publishableKey: "" },
    supabase: {
      createClient() {
        createClientCount += 1;
        throw new Error("must not initialize without an owner's config");
      },
    },
  };

  vm.runInNewContext(supabaseClientSource, { window });

  assert.equal(createClientCount, 0);
  assert.equal(window.SUPABASE_URL, "");
  assert.equal(window.SUPABASE_ANON_KEY, "");
});
