import type { AppContext, AppShape, PressPlugin } from "fumapress";
import type { I18nConfig } from "fumadocs-core/i18n";
import { llmsPlugin } from "fumapress/plugins/llms.txt";
import { unstable_redirect } from "waku/router/server";

type Loader = Awaited<ReturnType<AppContext["getLoader"]>>;
type Page = ReturnType<Loader["getPages"]>[number];
type TreeNode = ReturnType<Loader["getPageTree"]>["children"][number];

const LANGUAGE_NAMES: Record<string, string> = { tr: "Türkçe", en: "English" };

function languagesOf(ctx: AppContext) {
  const i18n = ctx.i18nConfig as I18nConfig | undefined;
  if (!i18n) throw new Error("PopMCP plugins require i18n.");
  return { languages: i18n.languages as string[], defaultLanguage: i18n.defaultLanguage as string };
}

function absolute(ctx: AppContext, path: string) {
  return new URL(path, ctx.siteConfig.baseUrl).href;
}

function markdownUrl(ctx: AppContext, url: string) {
  return absolute(ctx, url === "/" ? "/index.md" : `${url}.md`);
}

function markdownLink(title: string, url: string) {
  return `[${title.replace(/([[\]])/g, "\\$1")}](${url.replace(/([()])/g, "\\$1")})`;
}

/**
 * Every language lives under its own prefix (`/tr`, `/en`).
 * - Unprefixed URLs from before the prefixes existed redirect to the Turkish page.
 * - A page without a translation redirects to that language's home page instead of 404,
 *   e.g. when the language switcher is used on an English-only page.
 */
export function localeRouting<C extends AppShape>(): PressPlugin<C> {
  return {
    name: "popmcp:locale-routing",
    async createMiddlewares() {
      const ctx = this as unknown as AppContext;
      const { languages, defaultLanguage } = languagesOf(ctx);
      return [
        async (c, next) => {
          const { req } = c;
          if (req.method !== "GET" && req.method !== "HEAD") return next();
          const path = req.path.replace(/\/+$/, "");
          const first = path.split("/")[1] ?? "";
          if (!path || languages.includes(first)) return next();
          const href = `/${defaultLanguage}${path.replace(/\.md$/, "")}`;
          const source = await ctx.getLoader();
          if (!source.getPageByHref(href, { language: defaultLanguage })) return next();
          const url = new URL(req.url);
          return c.redirect(`/${defaultLanguage}${path}${url.search}`, 301);
        },
      ];
    },
    async createPages(fns) {
      const ctx = this as unknown as AppContext;
      const { languages } = languagesOf(ctx);
      const source = await ctx.getLoader();
      const slugsByLang = new Map(
        languages.map((lang) => [lang, new Set(source.getPages(lang).map((page) => page.slugs.join("/")))]),
      );
      for (const lang of languages) {
        const own = slugsByLang.get(lang)!;
        const missing = new Set<string>();
        for (const other of languages) {
          if (other === lang) continue;
          for (const slugs of slugsByLang.get(other)!) if (!own.has(slugs)) missing.add(slugs);
        }
        for (const slugs of missing) {
          fns.createPage({
            path: `/${slugs}`,
            lang,
            render: "dynamic",
            exactPath: true,
            component: () => unstable_redirect(`/${lang}` as never),
          });
        }
      }
    },
  };
}

/**
 * llms.txt for AI tools: one section per language with absolute links to the Markdown version of
 * every page, plus `/{lang}/llms.txt` and `/{lang}/llms-full.txt` for a single language.
 */
export function llmsTxt<C extends AppShape>(): PressPlugin<C> {
  async function getText(ctx: AppContext, page: Page) {
    for (const adapter of ctx.adapters) {
      const text = await adapter["core:get-text"]?.call(ctx, page);
      if (text !== undefined) return `# ${page.data.title}\n\nURL: ${absolute(ctx, page.url)}\nMarkdown: ${markdownUrl(ctx, page.url)}\n\n${text}`;
    }
  }

  function renderNode(ctx: AppContext, source: Loader, node: TreeNode, lang: string, indent: number): string[] {
    const prefix = "  ".repeat(indent);
    if (node.type === "separator") return [];
    if (node.type === "page") {
      const page = source.getNodePage(node, lang);
      const title = page?.data.title ?? (typeof node.name === "string" ? node.name : node.url);
      const description = page?.data.description?.trim();
      const link = markdownLink(title, markdownUrl(ctx, node.url));
      return [`${prefix}- ${link}${description ? `: ${description}` : ""}`];
    }
    const meta = source.getNodeMeta(node, lang);
    const name = meta?.data.title ?? (typeof node.name === "string" ? node.name : "");
    const out = [`${prefix}- ${name}`];
    if (node.index) out.push(...renderNode(ctx, source, node.index, lang, indent + 1));
    for (const child of node.children) out.push(...renderNode(ctx, source, child, lang, indent + 1));
    return out;
  }

  function languageSection(ctx: AppContext, source: Loader, lang: string, heading: string) {
    const name = LANGUAGE_NAMES[lang] ?? lang;
    const out = [
      `${heading} ${name} (${lang})`,
      "",
      `- Ana sayfa / Home: ${absolute(ctx, `/${lang}`)}`,
      `- Sadece bu dil / This language only: ${absolute(ctx, `/${lang}/llms.txt`)}`,
      `- Tüm içerik / Full content: ${absolute(ctx, `/${lang}/llms-full.txt`)}`,
      "",
    ];
    for (const child of source.getPageTree(lang).children) out.push(...renderNode(ctx, source, child, lang, 0));
    return out.join("\n");
  }

  function header(ctx: AppContext, languages: string[]) {
    const prefixes = languages.map((lang) => `\`/${lang}\` = ${LANGUAGE_NAMES[lang] ?? lang}`).join(", ");
    return [
      `# ${ctx.siteConfig.name ?? "Docs"}`,
      "",
      "> Popmundo oyunu için rehberler. Guides for the game Popmundo.",
      "",
      `Dil önekleri / Language prefixes: ${prefixes}.`,
      "Her sayfanın Markdown sürümü için adresin sonuna `.md` ekleyin. Append `.md` to any page URL for its Markdown version.",
      "Her dilin rehberleri ayrı hazırlanır; her sayfanın her dilde karşılığı yoktur. Guides are written separately per language; not every page exists in every language.",
      `MCP sunucusu / MCP server: ${absolute(ctx, "/mcp")}`,
    ].join("\n");
  }

  const base = llmsPlugin<C>({
    getLLMText(page) {
      return getText(this as unknown as AppContext, page as Page);
    },
  });

  return {
    ...base,
    async createPages(fns) {
      // the default /llms.txt mixes languages under one heading with relative links; replace it
      await base.createPages?.call(this, {
        ...fns,
        createApiIsomorphic(config) {
          if (config.path !== "/llms.txt") fns.createApiIsomorphic(config);
        },
      });
      const ctx = this as unknown as AppContext;
      const { languages } = languagesOf(ctx);
      const text = (body: string) => new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

      fns.createApiIsomorphic({
        path: "/llms.txt",
        handler: async () => {
          const source = await ctx.getLoader();
          const sections = languages.map((lang) => languageSection(ctx, source, lang, "##"));
          return text([header(ctx, languages), ...sections].join("\n\n") + "\n");
        },
      });
      for (const lang of languages) {
        fns.createApiIsomorphic({
          path: `/${lang}/llms.txt`,
          handler: async () => {
            const source = await ctx.getLoader();
            return text(`${header(ctx, languages)}\n\n${languageSection(ctx, source, lang, "##")}\n`);
          },
        });
        fns.createApiIsomorphic({
          path: `/${lang}/llms-full.txt`,
          handler: async () => {
            const source = await ctx.getLoader();
            const pages = await Promise.all(source.getPages(lang).map((page) => getText(ctx, page)));
            return text(pages.filter((page) => page !== undefined).join("\n\n"));
          },
        });
      }
    },
  };
}
