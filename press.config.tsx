import { defineConfig } from "fumapress";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { defineDocs } from "fumadocs-mdx/macro";
const docs = defineDocs({
  dir: "content",
  docs: { async: true, schema: pageSchema, lastModified: false, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: metaSchema },
});
export default defineConfig({
  content: docs.toFumadocsSource(),
  mode: "default",
  site: { name: "PopMCP", baseUrl: "https://popmundo-mcp.berkbirkan.com" },
}).adapters(fumadocsMdx());
