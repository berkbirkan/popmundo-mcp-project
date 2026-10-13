import { defineConfig } from "fumapress";
import { mcpPlugin } from "@fumapress/ai";
import { fumadocsMdx } from "fumapress/adapters/mdx";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { defineI18n } from "fumadocs-core/i18n";
import { uiTranslations } from "fumadocs-ui/i18n";
import { fumapressTranslations } from "fumapress/i18n";
import { llmsTxt, localeRouting } from "./src/plugins";

const i18n = defineI18n({
  languages: ["tr", "en"],
  defaultLanguage: "tr",
  hideLocale: "never",
  fallbackLanguage: null,
});
const translations = i18n.translations()
  .extend(uiTranslations())
  .extend(fumapressTranslations())
  .add({
    tr: {
      displayName: "Türkçe",
      "Search(search dialog)": "Ara",
      "Search(search trigger)": "Ara",
      "Open Search(search trigger)(aria-label)": "Aramayı aç",
      "Close Search(search dialog)(aria-label)": "Aramayı kapat",
      "No results found(search dialog)": "Sonuç bulunamadı",
      "Choose a language(language switcher)": "Dil seçin",
      "Choose a language(language switcher)(aria-label)": "Dil seçin",
      "Language(language switcher)": "Dil",
      "On this page(table of contents)": "Bu sayfada",
      "Table of Contents(inline table of contents)": "İçindekiler",
      "Next Page(pagination)": "Sonraki sayfa",
      "Previous Page(pagination)": "Önceki sayfa",
      "Copy Markdown(page actions)": "Markdown kopyala",
      "Copied Markdown(page actions)": "Markdown kopyalandı",
      "View as Markdown(page actions)": "Markdown olarak görüntüle",
      "Page Not Found(404 not found page)": "Sayfa bulunamadı",
      "Back to Home(404 not found page)": "Ana sayfaya dön",
    },
    en: { displayName: "English" },
  });
const docs = defineDocs({
  dir: "content",
  docs: { async: true, schema: pageSchema, lastModified: false, postprocess: { includeProcessedMarkdown: true } },
  meta: { schema: metaSchema },
});
export default defineConfig({
  content: docs.toFumadocsSource(),
  translations,
  mode: "default",
  site: { name: "PopMCP", baseUrl: "https://popmundo-mcp.berkbirkan.com" },
}).plugins(mcpPlugin(), localeRouting(), llmsTxt()).adapters(fumadocsMdx());
