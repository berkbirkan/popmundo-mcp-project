# PopMCP içerik aktarım rehberi

Bu proje için Excel, CSV, PDF, Word, Markdown ve benzeri kaynak belgelerden rehber hazırlanırken aşağıdaki kuralları uygula.

## Kaynak ve doğruluk

- Kullanıcının verdiği belgeyi ve rehberi gönderen kişinin adını esas al.
- Kaynağı önce incele: Excel dosyasında ilgili sayfaları, sütun başlıklarını, formülleri ve hücre değerlerini; CSV dosyasında ayırıcıyı ve karakter kodlamasını kontrol et.
- Kaynaktaki sayı, birim, tarih, koşul ve istisnaları koru. Boş hücreleri sıfır kabul etme.
- Okunamayan, eksik veya çelişkili bilgileri tahmin etme. Yayınlanacak içeriği etkileyen belirsizlikleri kullanıcıya sor.
- İçeriği anlaşılır biçimde düzenleyebilirsin; kaynakta olmayan oyun bilgisi, öneri veya sonuç ekleme.
- Formül sonuçları veya görseller güvenilir biçimde okunamıyorsa bu sınırlamayı belirt.
- Kaynak belgeleri, kişisel verileri ve belgenin ilgisiz bölümlerini açık GitHub deposuna otomatik olarak ekleme.

## Dosya düzeni ve başlıklar

- Rehberleri `content/rehberler/` altında konuya uygun `.mdx` dosyalarına yaz.
- Dosya adlarında kısa, açıklayıcı, küçük harfli ve tireyle ayrılmış ASCII adlar kullan; görünen başlıklar doğru Türkçe olsun.
- Her dosyada `title` ve `description` frontmatter alanları bulunsun.
- Fumapress ana başlığı frontmatter'dan ürettiği için gövde başlıklarını `##`, alt başlıkları `###` ile başlat.
- Karşılaştırılabilir verileri Markdown tablosu, adımları numaralı liste, açıklamaları paragraf olarak sun.
- Çok konulu belgeleri anlamlı sayfalara ayır; aynı konunun devamı olan bilgileri gereksiz yere bölme.
- İlgili `meta.json` dosyasındaki `pages` listesine yeni sayfaları ekle. Yeni kategori gerekiyorsa klasör ve kendi `meta.json` dosyasını oluştur.
- Kullanıcının mevcut içeriklerini koru. Aynı konuda rehber varsa uyumlu biçimde güncelle; çelişkileri sessizce birleştirme.
- Kaynak metindeki MDX için özel karakterleri (`{`, `}`, `<` gibi) uygun şekilde kaçır; istemeden JSX veya çalıştırılabilir kod oluşturma.

## Rehberi paylaşan kişi

- Her aktarılan rehberin sonunda görünür bir cümle yer alsın:
  **Bu rehber, [Kişinin adı] tarafından paylaşılmıştır.**
- İsmi kullanıcının verdiği biçimde yaz. İsim yoksa kullanıcıdan iste; isim uydurma ve yer tutucuyla yayınlama.
- Birden fazla kişi varsa isimleri aynı cümlede belirt.
- Belgeyi gönderen kişiyi, ayrıca belirtilmedikçe belgenin yazarı olarak tanımlama.
- Kullanıcı yazar bilgisini ayrıca verirse yazarlık ve paylaşım bilgisini ayrı ve doğru biçimde belirt.
- Aynı sayfada farklı kişilerin kaynakları birleştiriliyorsa hangi bölüme kimin katkı verdiğini açıkça belirt.

## MDX örneği

```mdx
---
title: Rehberin konuya uygun başlığı
description: Rehberin kapsamını açıklayan kısa özet
---

Konuya ilişkin kısa giriş.

## Temel bilgiler

Kaynak belgeden düzenlenmiş içerik.

## Adımlar

1. Kaynakta bulunan ilk adım.
2. Kaynakta bulunan sonraki adım.

Bu rehber, [Kişinin adı] tarafından paylaşılmıştır.
```

Örnekteki yer tutucuları gerçek bilgilerle değiştir.

## Doğrulama ve teslim

- Aktarılan verileri kaynakla karşılaştır; satırların, sayfaların ve önemli dipnotların atlanmadığını kontrol et.
- `npm run build` ve `npm run types:check` çalıştır.
- Sayfa yolları, menü sırası, iç bağlantılar ve üretilen Markdown çıktılarının doğru olduğunu doğrula.
- Hangi kaynakların hangi rehberlere dönüştürüldüğünü ve varsa çözülemeyen sınırlamaları kullanıcıya bildir.
- Commit/push ve yayın işlemlerini kullanıcının yetkilendirdiği kapsamda yap. Dokploy'un `main` dalındaki push'larla otomatik deploy başlattığını dikkate al.
