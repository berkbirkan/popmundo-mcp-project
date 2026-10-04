import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// @fumapress/ai 1.1.3 does not await the async index from fumadocs-core.
// Keep the upstream MCP tools and transport; only fix its list_pages response.
const require = createRequire(import.meta.url);
const dist = dirname(require.resolve("@fumapress/ai"));
const { version } = JSON.parse(readFileSync(join(dist, "../package.json"), "utf8"));
if (version !== "1.1.3") {
  throw new Error("Review the MCP compatibility fix before upgrading @fumapress/ai.");
}
const file = join(dist, "mcp.mjs");
const original = "text: llms(source).index()";
const replacement = "text: await llms(source).index()";
const source = readFileSync(file, "utf8");

if (source.includes(original)) {
  writeFileSync(file, source.replace(original, replacement));
  console.log("Applied @fumapress/ai async list_pages compatibility fix.");
} else if (!source.includes(replacement)) {
  throw new Error("@fumapress/ai MCP implementation changed; review the list_pages compatibility fix.");
}
