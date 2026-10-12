# Beauty Me admin — amaldagi holat

2026-10-09. Lokal admin funksional; Supabase loyihasi hali yaratilmagan.
Netlify’dagi Creative v3 demo shu bosqichda qayta deploy qilinmagan.
Mobil sayqallash yakunlandi: 320–1440 px Chrome tekshiruvi va 200% matn
stress sinovi. Natijalar/chegaralar ADMIN_MOBILE_QA.md’da.

## Foydalanish

Admin: http://localhost:4322/admin/. Kirish uchun shu kompyuterdagi
LOCAL_ADMIN_ACCESS.md faylini oching. Parol source ZIP’ga kiritilmagan.
Serverni ishga tushirish va cloud sozlash: ADMIN_SETUP.md.
Manba paketi: beauty-me-admin-source.zip. Uni Netlify Drop’ga yuklamang;
ochib, npm install orqali dependency’larni o‘rnating va qo‘llanmadagi Git
deploy oqimidan foydalaning. Qayta yig‘ish: powershell -File scripts/package-admin.ps1.

Tahrirlash → Saqlash → Qoralamani ko‘rish → Nashr qilish. Saqlash bilan sayt
darhol o‘zgarmaydi. Owner nashr qiladi; eski kontentni tarixdan qaytaradi.
Parallel tahrir konfliktida 409 qaytariladi. Lokal JSON diskda saqlanadi;
brauzer localStorage’i kontent, parol yoki mijoz bazasi sifatida ishlatilmaydi.

## Tayyor modullar

| Modul | Amaldagi imkoniyat |
|---|---|
| Kontent | UZ/RU matnlar, hero, FAQ, SEO title/description, qidiruv va draft preview |
| Xizmatlar | Qo‘shish, tartiblash, yashirish, tavsif/tarkib/FAQ/narx; yangi URL avtomatik |
| Rasmlar | JPG/PNG/WebP, 480/960/1440 WebP, metadata tozalash, kategoriya/alt/nom, kesim fokusi, hero, tartib/yashirish |
| Jamoa | Ism, UZ/RU mutaxassislik, surat/faollik; bo‘sh modul saytda chiqmaydi |
| Sozlamalar | Salon nomi, logo, ranglar, kontakt, manzil, ish vaqti, forma/tracking rejimi |
| Zayavkalar | Qidiruv, 50 tadan sahifa, 7 holat, ichki izoh, mas’ul, tarix va CSV |
| Statistika | Davr, sessiya/sahifa, Telegram/telefon, xizmat/form eventlari, zayavka/konversiya, manba/sahifa/qurilma |
| Tarix | Oldingi kontent, rollback, owner uchun so‘nggi 1000 boshqaruv amali |
| Xodimlar | Supabase editor/manager taklif va ruxsat bekor qilish; lokal owner |
| Himoya | HttpOnly cookie, same-origin yozish, rate limit, schema, scoped RLS/Storage, owner TOTP va AAL2 gate |
| Shablon | Faqat kontent import/eksport; mijozlar va hisoblar kirmaydi |
| Backup/notification | Qo‘lda private backup, Telegram outbox/retry scheduled worker kodi |

Owner barcha modullar; editor kontent/rasm/xizmat; manager zayavka/statistika.
Request/event UUID qayta yuborilsa dublikat yozuv yaratilmaydi. Telegram bosish
yozishma/obuna dalili emas. Tracking standart o‘chiq, yoqilganda ham tashrifchi
roziligiga bog‘liq. Demo forma ma’lumot yubormaydi.

## Tekshiruv dalillari

- Astro check: 43 fayl, 0 xato/ogohlantirish/hint.
- Unit/DOM/PostgreSQL: 20 test. SQL lokal PGlite’da Supabase auth/storage
  sxemalari modeli bilan tekshirildi; hosted Supabase testi emas.
- HTTP: 16 sinov; anonymous/CSRF, cookie, revision konflikt, draft/public,
  publish/rollback, yangi xizmat URL’i, lead validation/idempotency/status,
  analytics off/deduplication, CSV formula escaping, shablonda PII yo‘qligi,
  WebP upload/private media va logout. Test oldingi state’ni tiklaydi.
- Default build: 28 statik public sahifa va server admin/API.
- Dynamic build: public UZ/RU marshrutlari serverga o‘tadi; faqat root/404
  prerender. Netlify’da PUBLIC_CONTENT_MODE=dynamic zarur.
- Lokal private backup bajarildi; cloud restore sinovi yo‘q.

Dalillar test-results/admin-http-verification.json va build/check/test loglarida.
Oldingi admin bosqichida CUA texnik xato sabab ekran tekshiruvi bajarilmagan edi.
Mobil sayqallashda Puppeteer MCP orqali haqiqiy Chrome tekshiruvi bajarildi;
fixture bilan tekshirilgan ekranlar va aniq chegaralar ADMIN_MOBILE_QA.md’da.

## Qolgan ishlar va chegaralar

Supabase, 001–005 migratsiyalar, owner seed, Netlify muhitlari, live deploy
va cloud smoke sinovlari kerak. SMTP/taklif/tiklash, haqiqiy MFA/Storage va
Telegram yetkazish tashqi xizmatda tekshirilmagan.

Admin interfeysi o‘zbekcha; sayt kontenti UZ/RU. Boshlang‘ich rejadagi admin
RU tarjimasi, ixtiyoriy sahifa bloklari tartibi, shrift/kompozitsiya variantlari
va URL redirect editori bu versiyada yo‘q. Maxsus dizayn/animatsiya kod orqali
qilinadi. Surat fokusi barcha viewport uchun bitta; alohida mobile kesim yo‘q.
Retention, avtomatik backup va cloud restore sozlanmagan. Audit/nashr/outbox
ro‘yxatlari so‘nggi 1000 yozuv; statistika va CSV shu limit bilan cheklanmaydi.

## Paketlar bo‘yicha ochiq masala

Astro 5 o‘rniga Astro 7.3.7, Netlify adapter 8.2.8 va React integratsiyasi
yangilandi. npm audit fix bajarildi, --force qo‘llanmadi. Audit: critical 0,
high 13. Braces, node-forge, ipx ichidagi eski sharp adapter transitiv
bog‘liqliklarida qolgan. Deployed runtime’da ekspluatatsiya isbotlanmagan,
lekin ogohlantirishlar yechilgan deb belgilanmagan. Audit taklif qilgan adapter
6.4.1’ga tushirish Astro 7 mosligini buzishi mumkinligi sabab qo‘llanmagan.
Production uchun mos dependency tuzatishi va qayta audit kerak. Dalil:
test-results/dependency-audit.json. Maxfiy kalit/lokal login/mijoz bazasi source
paketiga kiritilmaydi.
