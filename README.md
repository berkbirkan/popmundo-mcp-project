# PopMCP

Fumapress ile oluşturulmuş Popmundo dokümantasyon sitesi.

Yayın: https://popmundo-mcp.berkbirkan.com

## İçerik ekleme

Markdown/MDX dosyalarını `content/` klasörüne ekleyin.
`content/rehberler/yeni-rehber.mdx`, `/rehberler/yeni-rehber` adresinde yayınlanır.

Dosyanın başına `title` ve `description` içeren frontmatter ekleyin.
Menü sırasını ilgili klasörün `meta.json` dosyasındaki `pages` listesine ekleyin.
Rehberlerdeki mevcut metinler örnek şablonlardır.

## Dil düzeni

Fumapress'in yerleşik i18n desteğiyle Türkçe varsayılan dildir; Türkçe
adreslerde dil öneki kullanılmaz. İngilizce sayfalar `/en` altında sunulur.
Her dilin rehberleri o dilin Popmundo terimleriyle ayrı hazırlanır;
otomatik çeviri veya başka dilden eksik sayfa gösterimi yoktur
(`fallbackLanguage: null`).

- Türkçe: `content/rehberler/konu.mdx` → `/rehberler/konu`.
- İngilizce: `content/rehberler/topic.en.mdx` → `/en/rehberler/topic`.
- Türkçe menü: `meta.json`; İngilizce menü: `meta.en.json`.
- Mevcut İngilizce müzik rehberleri: `content/music/*.en.mdx` → `/en/music/...`.

İngilizce sayfa eklerken ilgili klasörün `meta.en.json` dosyasını oluşturun
ve kökteki `content/meta.en.json` menüsüne klasörü ekleyin.
Aynı konu farklı dillerde aynı dosya kök adını kullanırsa dil seçici
bu sayfaları eşleştirir; dil içinde farklı konu adları da kullanılabilir.
İç bağlantılarda İngilizce adresler için `/en` önekini yazın.

Resmî belge: https://press.fumadocs.dev/docs/internationalization

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
