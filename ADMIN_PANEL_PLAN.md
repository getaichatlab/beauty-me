# Beauty Me — to‘liq admin panel ishlab chiqish rejasi

Sana: 2026-10-08. Bu boshlang‘ich spetsifikatsiya va maqsadlar ro‘yxati.
2026-10-09: lokal admin va cloud ulanish kodi ishlab chiqildi; amaldagi holat
ADMIN_IMPLEMENTATION.md’da, ulash yo‘riqnomasi ADMIN_SETUP.md’da. Quyidagi
boshlang‘ich tavsif tarixiy; barcha reja bandlari tugaganini bildirmaydi.
Boshlang‘ich loyiha: Astro 5, GSAP, UZ/RU, Netlify Creative v3.

## 1. Natija va boshlang‘ich holat

Salon egasi dasturchisiz rasm, matn, xizmat va kontaktlarni o‘zgartirishi,
zayavkalarni ko‘rishi va tashrif natijalarini kuzatishi kerak. Boshqaruv
telefon orqali ham qulay ishlaydi. Saytning mavjud dizayni va animatsiyalari
kontent tahriridan keyin buzilmasligi kerak.

Hozir `astro.config.mjs` static output ishlatadi. Ma’lumotlar brand.ts,
content.ts, media.ts va ayrim komponentlardagi matnlarda. Suratlar public/media
ichida. Booking faqat demo, bazaga yozmaydi. Hozirgi kodda real analytics yo‘q.
Adminni faqat localStorage bilan yasash bu vazifani bajarmaydi: o‘zgarishlar
boshqa qurilmada va saytda ko‘rinadigan doimiy bazaga yozilishi kerak.

Ishlashning namunasi: admin yangi manikyur suratini yuklaydi → joylashuvini
va UZ/RU nomini tanlaydi → telefondagi/desktopdagi ko‘rinishini tekshiradi →
qoralamani saqlaydi → nashr qiladi → saytning yangi tashriflarida yangi surat
ko‘rinadi. Bu ish har safar kod tahriri yoki Netlify deploy talab qilmaydi.

## 2. Tanlangan arxitektura

- Sayt: mavjud Astro + GSAP. Kontentli sahifalar serverda chiqariladi va
  qisqa muddatli CDN cache ishlatadi; statik media/JS/CSS cache davom etadi.
- Admin: `/admin`, React komponentlari, alohida ixcham boshqaruv dizayni.
- API: Astro server endpointlari, Netlify adapter orqali serverda ishlaydi.
- Supabase: PostgreSQL kontent/zayavka/statistika bazasi, Auth kirish uchun,
  Storage rasmlar uchun. Bu tanlov reja, Supabase loyiha hali yaratilmagan.
- Kontentni nashr qilish: bazada tekshirilgan yagona published versiyaga
  atomik o‘tish. Sayt qoralamani o‘qimaydi. Preview alohida himoyalangan.
- Notification: Telegram bot faqat keyinchalik salon tasdiqlagan administrator
  chatiga. Telegram xatosi bazada saqlangan zayavkani yo‘qotmaydi.

```mermaid
flowchart LR
  V[Saytga tashrif] --> W[Astro / Netlify]
  A[Salon admini] --> P[/admin]
  P --> X[Himoyalangan API]
  X --> DB[(Supabase PostgreSQL)]
  X --> M[Media Storage]
  W --> C[Nashr qilingan kontent]
  C --> DB
  W --> B[Zayavka API]
  B --> DB
  B --> O[Notification outbox]
  O --> T[Salon Telegram bot chati]
  W --> E[Analytics event API]
  E --> DB
  DB --> X
```

Netlify rasmiy hujjatida Astro on-demand rendering Netlify Functions orqali
ishlashi ko‘rsatilgan: [Astro on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/).
Shuning uchun mavjud Astro saytdan voz kechish shart emas. Adapter, cache va
cookie ishlashini avval test muhitida isbotlab, keyin live’ga o‘tamiz.

Public sahifa cache maqsadi: nashrdan keyin 60 soniya ichida yangi versiya
ko‘rinishi; qo‘llansa cache invalidation bilan tezroq. Admin, preview, login,
zayavka va shaxsiy ma’lumot endpointlari `no-store`. Auth cookie va javoblari
umumiy CDN cache’ga kirmaydi. Muayyan TTL va invalidation testda tekshiriladi.
Bazaga ulanish ishlamasa mavjud cached kontentdan foydalaniladi; cache ham
bo‘lmasa tushunarli vaqtinchalik xato. Admin muvaffaqiyatsiz saqlashni
“saqlandi” deb ko‘rsatmaydi. O‘qish/yozishda timeout va cheklangan retry bo‘ladi.

## 3. Adminning menyusi va foydalanish qulayligi

Asosiy bo‘limlar: Boshqaruv, Sayt kontenti, Xizmatlar, Rasmlar/Galereya,
Zayavkalar, Statistika, Sozlamalar, Xodimlar va O‘zgarishlar tarixi.

Interfeys UZ/RU tillarida. Desktopda chap menyu, telefonda ixcham menyu va
katta bosiladigan tugmalar. Uzun forma bosqichlarga bo‘linadi. Ma’lumot yo‘q
holat, yuklanish, xato va saqlanmagan o‘zgarishlar alohida ko‘rinadi.
Saqlash holati aniq: “Saqlanmoqda”, “Qoralama saqlandi”, “Nashr qilindi”.
Admin uchun og‘ir dekorativ animatsiya ishlatilmaydi; tezlik va o‘qilish muhim.

## 4. Qaysi ma’lumotlarni boshqarish mumkin

| Bo‘lim | Tahrirlanadigan narsalar |
|---|---|
| Bosh sahifa | Hero sarlavha/tavsif, asosiy va qo‘shimcha suratlar, tugma matni/havolasi, bo‘lim sarlavhalari, tanlangan xizmatlar va ishlar |
| Salon haqida | Matnlar, fotosuratlar, afzalliklar, bo‘limlar tartibi va ko‘rinishi |
| Xizmatlar | Qo‘shish/tahrirlash/yashirish, UZ/RU nom/tavsif, ichki sahifa, surat, xizmat tarkibi, tartib, tasdiqlangan bo‘lsa narx/davomiylik |
| Galereya | Surat/kategoriya/sarlavha/alt, tartib, bosh sahifaga chiqarish, yashirish/arxivlash |
| Aloqa | Telefon, Telegram, Instagram, xarita, manzil, salon tasdiqlagan ish vaqti |
| FAQ | Savol-javob qo‘shish/tahrirlash, tillar, tartib va faollik |
| Jamoa | Ixtiyoriy modul: haqiqiy usta nomi, surat, mutaxassislik, xizmatlar; bo‘sh bo‘lsa saytga chiqmaydi |
| Brend | Nom/logo, asosiy ranglar, mavjud variantlardan shrift/kompozitsiya tanlash |
| Sahifa sozlamasi | SEO title/description, ijtimoiy tarmoq preview surati, URL boshqaruvi va eski URL redirect |
| Maxfiylik/forma | Salon tasdiqlagan matnlar, aloqa roziligi, forma izohlari |

Strukturali maydonlar ishlatiladi: ixtiyoriy HTML/JS kiritib dizaynni buzadigan
editor emas. Matn uzunligi, havola formati va majburiy maydonlar tekshiriladi.
Faqat tanilgan blok turlari qo‘shiladi yoki tartibi o‘zgartiriladi. Yangi
maxsus sahifa tuzilmasi yoki effekt qo‘shish baribir kod ishlari bo‘ladi.
Bu chegarani admin qo‘llanmasida ochiq tushuntiramiz.

UZ/RU alohida tablarda; tarjima yetishmasa ogohlantirish. Nashr shartlari
ikkala til uchun kerakli maydonlarni tekshiradi. Avtomatik tarjima majburiy
emas; salon matnni tasdiqlaydi. Xizmat URL’i o‘zgarsa eski havola uchun redirect
saqlanadi. Arxivlangan xizmat bo‘yicha eski zayavka tarixi qoladi.

## 5. Rasmlarni boshqarish — saytni buzmasdan

1. Telefon yoki kompyuterdan JPG/PNG/WebP tanlash, bir nechta faylni yuklash.
2. Boshlang‘ich limit: har fayl 10 MiB; fayl turi haqiqiy mazmunidan tekshiriladi.
   HEIC yoki noto‘g‘ri format bo‘lsa tushunarli ko‘rsatma; qo‘llash alohida bosqich.
3. Rasm orientatsiyasi tuzatiladi, EXIF olib tashlanadi; server optimallashtirish
   480/960/1440px WebP variantlarini yaratadi, kichik rasm sun’iy kattalashtirilmaydi.
4. UZ/RU sarlavha va alt, kategoriya, surat manbasi/foydalanish izohi saqlanadi.
5. Qayerda ishlatilishi ko‘rinadi: Hero / xizmat / galereya / salon haqida.
6. Har joylashuv uchun fokus nuqtasi va mobil/desktop crop preview. Saytdagi
   bloklarning balandligi saqlanadi; yangi surat ulkan scroll yaratmaydi.
7. Galereyani drag bilan tartiblash, klaviatura uchun yuqoriga/pastga tugmalar.
8. Ishlatilayotgan suratni o‘chirishdan oldin unga bog‘langan joylar ko‘rsatiladi.
   Arxiv/recycle bin va oldingi release ishlatayotgan assetlarni saqlash.

Yuklash foizi, qayta urinish va konversiya holati ko‘rinadi. Tayyor bo‘lmagan
rasm nashr qilinmaydi. Ochiq published media va yopiq draft/original storage
ajratiladi; yangi rasm nashr vaqtida public variantga o‘tadi. Xususiy mijoz
ma’lumotlari rasmning fayl nomi yoki alt’iga yozilmaydi.

Storage ruxsatlari [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
asosida sozlanadi. Ochiq suratni ko‘rish mumkinligi anonim foydalanuvchiga
uni almashtirish yoki o‘chirish huquqini bermaydi.

## 6. Qoralama, preview va nashr

Jarayon: Tahrirlash → Qoralamani saqlash → UZ/RU va mobil/desktop preview →
Nashr qilish. Qoralama avtomatik saqlanishi mumkin, lekin saytda ko‘rinmaydi.
Nashrda barcha bog‘lanish, tarjima, media tayyorligi va required maydon tekshiriladi.

Har release versiya raqami, muallif va vaqt bilan saqlanadi. Bitta tranzaksiyada
butun tasdiqlangan kontent nashr qilinadi, yarim yangilangan sayt chiqmaydi.
“Oldingi versiyaga qaytarish” faqat sayt kontentiga ta’sir qiladi; zayavka va
statistikani ortga qaytarmaydi. Ikki admin bir maydonni tahrirlasa version
tekshiruvi bilan conflict ko‘rsatiladi; oxirgi yozuvchi jim almashtirmaydi.

Preview faqat login qilgan admin uchun va `noindex/no-store`. Mobil/desktop
preview yordamchi; haqiqiy qurilmada sinashning o‘rnini bosmaydi.

## 7. Zayavkalar — haqiqiy saqlash va boshqarish

Mavjud uch bosqichli forma saqlanadi. Yuborilgan ma’lumotlar: ism, telefon,
xizmat, istalgan sana/vaqt, izoh, til va tekshirilgan reklama manbasi.
Server xizmat mavjudligini, telefon/sana/matn chegaralarini tekshiradi.
Rate limit, honeypot va zarur bo‘lsa challenge spamni kamaytiradi.

Zayavka avval bazada saqlanadi. Shundan keyingina mijozga raqam va
“So‘rovingiz qabul qilindi, salon vaqtni tasdiqlaydi” javobi chiqadi.
Bu hali avtomatik band qilingan appointment emas. Submit tugmasi ikki marta
bosilishi yoki tarmoq retry’i idempotency key orqali bitta zayavka yaratadi.
Xato bo‘lsa forma tozalanmaydi, qayta yuborish imkoniyati qoladi.

Admin jadvali/listi: qidiruv, xizmat/sana/status/manba filtrlari, telefonga
qo‘ng‘iroq havolasi, tayinlangan administrator, ichki izohlar va holat tarixi.
Statuslar: Yangi → Bog‘lanildi → Tasdiqlandi → Xizmat bajarildi; qo‘shimcha
Bekor qilindi / Javob bermadi / Spam. Sana/vaqt administrator tasdiqlaganda
alohida final maydonlarga yoziladi. Telefonni bilish Telegram chatini ochish
yoki mijozning Telegram identifikatorini olishni anglatmaydi.

Calendar ko‘rinishi tasdiqlangan zayavkalarni chiqaradi. Haqiqiy ustalar bo‘yicha
bo‘sh slot va to‘qnashuvni oldini oluvchi bron tizimi alohida kengaytma;
birinchi versiyada foydalanuvchiga mavjud bo‘lmagan real-time slot va’da qilinmaydi.

CSV eksport ruxsatga bog‘liq, auditda qayd etiladi va spreadsheet formula
injection’dan himoyalanadi. Mijozning shaxsiy ma’lumoti umumiy analytics’ga kirmaydi.

## 8. Statistika: nima aniq hisoblanadi

| Ko‘rsatkich | Ta’rif |
|---|---|
| Sahifa ko‘rishlar | Qabul qilingan page_view eventlari; qayta ko‘rish alohida |
| Sessiyalar | 30 daqiqa harakatsizlikdan keyin yangi tashrif sessiyasi |
| Taxminiy noyob tashrifchi | Tanlangan ruxsat/identifier rejimiga qarab browser darajasida; haqiqiy odamlar soni emas |
| Telegram bosishlar | Saytdagi Telegram tugmasi bosilishi, joylashuvi bilan |
| Telefon/Instagram/xarita | Tegishli havola bosishlari; amalga oshgan qo‘ng‘iroq yoki suhbat emas |
| Forma boshlash | Booking’ning birinchi amaliy interaction’i |
| Qabul qilingan zayavka | Server bazaga muvaffaqiyatli yozgan zayavka |
| Tasdiqlangan/bajarilgan | Admin qo‘ygan CRM holati, tarix bilan |
| Konversiya | Kuzatilgan sessiyalardan kamida bitta qabul qilingan zayavka bo‘lganlari / kuzatilgan sessiyalar |

Telegram guruhiga obuna, xabar yuborish yoki mijoz kelishini click statistikasi
isbotlamaydi. Bot/deep-link orqali kelgan Telegram `/start` keyinchalik alohida
event bo‘lishi mumkin, lekin oddiy t.me guruh havolasida bunday tasdiq yo‘q.

Dashboard: bugun/kecha/7 kun/30 kun/custom sana; oldingi davr bilan taqqoslash;
tashriflar grafigi, mashhur sahifa/xizmatlar, mobil/desktop, UZ/RU, referrer va
UTM manbalar. Voronka: xizmat ko‘rish → booking boshlash → qabul qilingan
zayavka → admin tasdiqlashi. Noma’lum referrer “To‘g‘ridan-to‘g‘ri / noma’lum”.

Hisoblar salonning `Asia/Tashkent` vaqtida, bazada UTC. Adminning o‘z tashrifi,
preview/test trafik va tanilgan botlar chiqarib tashlanadi. Natijalar 1–5
daqiqada yangilanishi maqsad qilinadi; “Oxirgi yangilanish” va “Kuzatuv boshlangan
sana” ko‘rinadi. Tracking yoqilgunga qadar bo‘lgan tashriflar tiklab bo‘lmaydi.

Texnik eventlar: `page_view`, `service_view`, `telegram_click`, `phone_click`,
`instagram_click`, `map_click`, `booking_start`, `booking_step`, serverdan
`booking_submitted`. `event_id` unique, SPA navigatsiyada `astro:page-load`
bo‘yicha yangi page instance; takroriy listener dublikat yaratmaydi.
Telegramga chiqishda beacon/keepalive, tracking xatosi havolani bloklamaydi.
Server qabul qilgan eventlargina hisoblanadi; bloklovchi, o‘chirilgan JS yoki
tarmoq uzilishi tufayli raqamlar barcha tashriflarning mutlaq hisobi emas.

Analytics identifierlari uchun tanlangan rozilik/maxfiylik rejimi sozlanadi;
fingerprinting ishlatilmaydi. URL query’dan ism/telefon va noma’lum parametrlar
saqlanmaydi, faqat cheklangan UTM allowlist. Raw event retention boshlang‘ich
taklif 90 kun, shaxsiy ma’lumotsiz kunlik agregatlar 12 oy. Aniq retention salon
bilan kelishiladi. Analytics’ni rad etgan foydalanuvchi forma yubora oladi;
konversiya faqat kuzatilgan cohort uchun chiqariladi.

## 9. Kirish va huquqlar

- Owner: foydalanuvchi/rol, nashr, eksport, sozlamalar va barcha modullar.
- Manager: zayavkalar va statistika; kontentga ruxsat berilsa tahrirlash.
- Editor: kontent va rasmlar qoralamasi; standart holatda mijoz ma’lumotlari
  va xodim boshqaruvini ko‘rmaydi, nashr huquqi alohida.

Invite orqali hisob; ochiq ro‘yxatdan o‘tish yo‘q. Email/parol, reset va owner
uchun 2FA rejalashtiriladi. Login xatolari, session expiry va logout aniq ishlaydi.
Har bir API’da server tekshiruvi; menyu tugmasini yashirish ruxsat nazorati emas.
Cookie/sessiya SSR oqimi tekshiriladi, write so‘rovlarda CSRF/origin himoyasi bor.

Jadvallarda `site_id`, serverdagi membership va RLS/grant siyosatlari. Rol oddiy
foydalanuvchi o‘zi almashtira oladigan metadata’dan olinmaydi. Leadlarni anonim
o‘qish yoki to‘g‘ridan-to‘g‘ri analytics jadvaliga yozish taqiqlanadi. Public
API faqat tekshirilgan ma’lumotni kerakli jadvalga yozadi. Admin so‘rovlarida
foydalanuvchi konteksti bilan RLS ishlaydi; yuqori huquqli kalit faqat zarur
ichki server vazifalarida ishlatiladi. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Secrets faqat server environment: Supabase privileged key, bot token va
notification chat ID. Manba, public JS, log, ZIP yoki brauzerga chiqarilmaydi.
Audit: muallif, amal, obyekt, vaqt; telefon/parol/token loglanmaydi. Production
testida anonymous read/write, role bypass va boshqa site_id’ga kirish rad
etilishi tekshiriladi. Auth uchun [Supabase SSR](https://supabase.com/docs/guides/auth/server-side)
oqimidan foydalaniladi.

## 10. Ma’lumot modeli va API chegaralari

| Jadval/guruh | Vazifa |
|---|---|
| sites, memberships | Salon sozlamasi va foydalanuvchi huquqlari |
| content_documents, content_revisions | Strukturali UZ/RU qoralamalar va tarix |
| content_releases, published_content | Tekshirilgan kontent snapshot’i va active versiya |
| media_assets, media_variants, media_bindings | Suratlar, optimallashtirilgan variantlar, ishlatilgan joy/crop |
| leads, lead_activity | Zayavka, ichki izoh, status o‘zgarishi |
| analytics_events, analytics_daily | Eventlar va shaxsiy ma’lumotsiz agregatlar |
| notification_outbox | Telegramga yuborish/retry holati |
| audit_log | Boshqaruv amallari |

Xizmatlar/FAQ/jamoa/sahifa bloklari typed content documents sifatida saqlanadi,
lekin zayavka uchun xizmatning stable ID’si va o‘sha paytdagi nom snapshot’i
bor. O‘zgartirilgan xizmat nomi eski zayavka ma’nosini yo‘qotmaydi. Publish
bir nechta documentdan bitta release yaratadi.

API oilalari: `/api/admin/content`, `/api/admin/publish`, `/api/admin/media`,
`/api/admin/leads`, `/api/admin/analytics`, `/api/admin/members`;
public faqat `/api/leads` va `/api/analytics/events`. Har route method, schema,
ruxsat, limit va aniq success/error shakliga ega. Lead POST 201, idempotent
retry o‘sha receipt; analytics 202; validation 422, unauthorized 401,
forbidden 403, conflict 409, rate limit 429. Ichki stack trace chiqarilmaydi.

## 11. Amalga oshirish bosqichlari va qabul mezoni

| Bosqich | Ish | Tayyorlik mezoni |
|---|---|---|
| 1. Ma’lumot xaritasi | Har sahifa matni/surati/CTA va hardcoded bloklarni xaritalash; kontent schema | Salon o‘zgartiradigan har maydon uchun admin joyi aniq |
| 2. UI prototip | Login, dashboard, rasm editori, kontent formasi, zayavka listi | 390px va desktopda asosiy ishlar tushunarli; test ma’lumoti “demo” deb belgilangan |
| 3. Backend/kirish | Supabase schema, migratsiyalar, Auth, membership, RLS/grants, API | Ruxsatsiz read/write va rolni chetlab o‘tish rad etiladi |
| 4. Media kutubxonasi | Upload, variants, crop, kategoriyalar, archive, usage | Har yangi surat mobil/desktopda preview; processing failure yashirilmaydi |
| 5. CMS/nashr | UZ/RU editor, draft, preview, atomic publish, revision/rollback | Qoralama live’ga chiqmaydi; nashr ko‘rinadi; rollback faqat kontent |
| 6. Sayt ulanishi | Data adapter, dinamik route, server render/cache, GSAP lifecycle | Hozirgi dizayn, ikki til, galereya va navigatsiya saqlanadi |
| 7. Zayavka CRM | Real POST, idempotency, statuses, assignment, qidiruv/export | Submit bazaga yozadi; ikki bosish bitta yozuv; tarmoq xatosida input yo‘qolmaydi |
| 8. Analytics | Events, SPA dedupe, dashboard/agregat/cohort/filter | Nazorat sessiyasi va bosish soni tekshirilgan; admin/test trafik chiqarilgan |
| 9. Notification | Salon chat bot integratsiyasi, outbox, retries | Bot ishlamasa lead saqlanadi va admin retry holatini ko‘radi |
| 10. Sinash/topshirish | Real qurilma, ruxsatlar, backup restore, staged deploy va qo‘llanma | Egasi rasm/tel o‘zgartirib nashr qiladi, zayavkani boshqaradi, statistikani ko‘radi |

Bosqichlar natijasi ishlaydigan UI/backend bilan baholanadi; chiroyli maket
yoki soxta dashboard raqamlari to‘liq tizim deb topshirilmaydi. Birinchi
ishlaydigan vertikal yo‘l: admin login → bitta hero rasmi tahriri → publish →
public saytda o‘zgarish. Keyin qolgan modullar shu asosga ulanadi.

## 12. Sinovlar, ishonchlilik va chiqarish

- Unit: schemas, rollar, telefon/sana, status o‘tishlari, timezone, statistika.
- Integratsiya: SQL ruxsatlar, upload validation, revisions, atomik publish,
  expired sessions, concurrent edits, idempotent lead, notification retry.
- Brauzer E2E: login/reset, rasm almashtirish/crop, ikki til, draft/publish,
  rollback, CRM, filters va export; 360/390/768/1440px va klaviatura.
- Ommaviy sayt regression: GSAP oddiy/reduced motion, client navigatsiya,
  galereya, mavjud havolalar, yangi/arxiv xizmatlar va lead yuborish.
- Analytics: bir sessiya, 3 page view, bitta Telegram bosish, bitta lead
  bo‘yicha kutilgan raqam; duplicate events va midnight Tashkent holatlari.
- Failure: sekin internet, yaroqsiz rasm, uzilgan upload, DB/bot xatosi,
  server timeout; foydalanuvchiga yolg‘on success chiqmasligi.

Boshlanishida alohida test Supabase muhit va Netlify preview. Hozirgi statik
Creative v3 rollback nuqtasi saqlanadi. Avval kontent va 13 real rasm import,
keyin maxsus test zayavkalari; real odam ma’lumotlarini testga olib o‘tmaymiz.
Demo/production bayroq aniq; demo statistikasi haqiqiy mijoz statistikasi
bilan qo‘shilmaydi. Adminning o‘zi ham noindex.

Backend ishga tushganda ZIP’ni Netlify Drop’ga tashlashning o‘zi to‘liq tizimni
tiklamaydi: adapter funksiyalari, environment, DB migratsiyalari va storage
ham sozlanadi. Kelgusi deploy takrorlanadigan build/CLI yoki Git jarayoni bilan.
Xavfli schema o‘zgarishlari eski deploy bilan moslik va DB restore rejasiga ega.

Backup: kontent/DB eksporti va media nusxasi alohida; revision DB backup
o‘rnini bosmaydi. Supabase DB backup Storage fayllarini qamrab olmaydi;
[backup hujjati](https://supabase.com/docs/guides/platform/backups). Restore test
orqali isbotlanadi, backup bor deb taxmin qilinmaydi. Dastlabki maqsad:
kunlik nusxa, 30 kunlik retention; tarif/quvvatga qarab amalga oshirish tanlanadi.

Monitoring: API xatolari, saqlanmagan notification, upload failure, DB/storage
limit va xizmatlar holati. Telefon/note analytics yoki error logiga chiqarilmaydi.

## 13. Kerak bo‘ladigan hisoblar va topshirish

Mavjud Netlify loyiha saqlanadi. Amalga oshirishda Supabase loyiha, owner login
email’i, media storage va server environment kerak. Bot bosqichida salonning
aniq notification chati va bot token serverga kiritiladi. Hozir bu reja uchun
akkaunt ochish, pullik xizmat yoqish yoki xabar yuborish talab qilinmaydi.

Netlify/Supabase server, storage, traffic va backup xizmatlari doimiy sarf
yaratishi mumkin. Aniq tarif/quota ishga tushirish paytida tekshiriladi; butun
tizim cheksiz bepul deb va’da qilinmaydi. Panelda quota/health ownerga ko‘rinadi.

Yakuniy topshirish: admin manzili va owner hisob, source/migrations,
environment namunasi secrets’siz, restore/rollback tartibi, qisqa UZ qo‘llanma
va “surat almashtirish → nashr qilish → zayavkani boshqarish” amaliy ko‘rsatmasi.

Boshqa salonga moslash uchun brand/content export/import bor; mijozlarning
zayavkalari, statistikasi, xodimlari va tokenlari template eksportiga kirmaydi.
Birinchi versiya bitta salon uchun alohida deploy/DB muhitga mo‘ljallanadi.
`site_id` kelajakdagi ajratishni tayyorlaydi, lekin bu hali ko‘p salonli SaaS emas.

Keyingi alohida kengaytmalar: real-time ustalar jadvali, to‘lov/depozit, mijozga
SMS/Telegram eslatma, ko‘p filial, bonus/CRM marketing. Asosiy CMS, zayavka va
analytics tugamaguncha bular birinchi versiyaga qo‘shilmaydi.
