# PopMCP

Fumapress ile oluşturulmuş Popmundo dokümantasyon sitesi.

Yayın: https://popmundo-mcp.berkbirkan.com

## İçerik ekleme

Markdown/MDX dosyalarını `content/` klasörüne ekleyin.
`content/rehberler/yeni-rehber.mdx`, `/rehberler/yeni-rehber` adresinde yayınlanır.

Dosyanın başına `title` ve `description` içeren frontmatter ekleyin.
Menü sırasını ilgili klasörün `meta.json` dosyasındaki `pages` listesine ekleyin.
Rehberlerdeki mevcut metinler örnek şablonlardır.

## Geliştirme ve doğrulama

Node.js 24 veya üzeri gerekir.

```sh
npm ci
npm run dev
npm run build
npm run types:check
```

## Yayın

Dokploy bu depoyu `main` dalından, `compose.yml` ile build eder.
İçerik değişiklikleri için yeniden build/deploy gerekir.
Dockerfile, Node imajını digest ile; package-lock.json ise paketleri sabitler.

Ask AI ve Fumapress MCP eklentisi etkin değildir.
