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

## MCP bağlantısı

Fumapress MCP eklentisi tüm içerik sayfalarını Streamable HTTP üzerinden sunar.
MCP istemcisini yerel geliştirmede `http://localhost:3000/mcp`, bu değişiklikler
yayınlandıktan sonra `https://popmundo-mcp.berkbirkan.com/mcp` adresine bağlayın.
Sunucu adı `PopMCP` olur; kimlik doğrulama ve model API anahtarı gerekmez.

- `list_pages`: tüm sayfaların indeksini getirir.
- `search`: `query` ile içerikte arama yapar; isteğe bağlı `limit` alır.
- `get_page`: `path` ile sayfanın tam içeriğini getirir; örneğin `/music/basic-information`.

`@fumapress/ai` 1.1.3 sürümünde `list_pages`, asenkron indeks sonucunu beklemediği
için geçersiz MCP yanıtı üretir. `npm ci` ve `npm install` sırasında çalışan
`scripts/patch-fumapress-mcp.mjs` bu çağrıya `await` ekler. Düzeltme tekrar
çalıştırılabilir; eklenti sürümü değiştiğinde yeniden incelenmesini ister.
Kurulum betiklerini devre dışı bırakırsanız derlemeden önce `npm run postinstall`
çalıştırın. Ask AI etkin değildir.
