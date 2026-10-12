# Beauty Me — salon demo sayti

2026-10-09: lokal admin, API va Supabase ulanish kodi qo‘shildi. Admin
http://localhost:4322/admin/; kirish shu kompyuterdagi LOCAL_ADMIN_ACCESS.md’da.
Amaldagi funksiyalar/chegaralar: [ADMIN_IMPLEMENTATION.md](ADMIN_IMPLEMENTATION.md).
Supabase va Netlify sozlash: [ADMIN_SETUP.md](ADMIN_SETUP.md). Quyidagi Creative
v3 deploy qaydlari tarixiy. Live saytda parolsiz admin sandbox /admin/demo/ mavjud; haqiqiy cloud boshqaruv uchun Supabase kerak.

Live demo: https://beauty-me-tashkent-demo.netlify.app/uz/
Netlify loyiha: https://app.netlify.com/projects/beauty-me-tashkent-demo

Astro asosida UZ/RU sayt. Admin versiyasi statik yoki PUBLIC_CONTENT_MODE=dynamic
bilan serverda chiqariladi; doimiy kontent tahriri uchun dinamik rejim kerak.
Muhim: bu salon tomonidan
tasdiqlanmagan mustaqil dizayn konsepti. Narxlar, usta ismlari, reyting va
fikrlar o‘ylab topilmagan. Haqiqiy yozilish telefon yoki Telegram orqali.

2026-10-08 Creative v3 yuqoridagi Netlify manziliga joylandi.
Paket: `beauty-me-creative-v3.zip`. GSAP matn va surat ochilishi, interaktiv
xizmat sahnasi, sahifalar o‘tishi, ixcham galereya va yangi UZ/RU ichki
sahifa dizaynlari tayyor. Brauzer vositasining texnik xatosi sabab yangi
versiyaning ekrandagi vizual tekshiruvi bajarilmadi; HTTP va DOM testlari o‘tdi.

## Ishga tushirish

```powershell
npm install
npm run dev
```

Brauzer: http://localhost:4321/uz/ yoki http://localhost:4321/ru/

```powershell
npm run check
npm run build
npm test
npm run preview
```

`dist/` — Netlify’ga yuklanadigan tayyor fayllar. `netlify.toml` orqali
Git deploy qiling yoki `dist` ZIP faylini Netlify Drop sahifasiga yuklang.
`public/_headers` va `_redirects` normal authenticated deploy uchun tayyor.
Creative v3 rasmiy authenticated CLI orqali mavjud loyihaga joylandi.
Live serverda noindex HTTP headerlari, majburiy `/` → `/uz/` 302 yo‘naltirishi
va `_astro` fayllarining uzoq muddatli cache sozlamalari tekshiriladi:
`node scripts/verify-live.mjs`. Natija `test-results/live-v3-verification.json`.
Creative v3 statik demo uchun maxfiy API kaliti talab qilinmagan. Yangi admin
cloud backend’i Supabase kalitlari va Netlify server muhitini talab qiladi.

## Nima bor

- Ikki til, mos sahifani saqlaydigan til almashtirish.
- Asosiy sahifa, 6 xizmat tafsiloti, katalog, galereya, salon, aloqa,
  demo yozilish, maxfiylik va 404 sahifalari.
- Galereyada kategoriya filtri, kattalashtirish, Escape va klaviatura navigatsiyasi.
- Uch bosqichli yozilish: xizmat → sana/vaqt → aloqa. Xato tekshiruvi va
  test ma’lumotlari bor. Demo rejimida shaxsiy ma’lumot saqlanmaydi; admin
  versiyasida Request yoqilsa haqiqiy so‘rov server bazasiga yoziladi.
- Mobil menyu, telefon/yozilish paneli, reduced-motion, alt matnlar va fokuslar.
- Demo noindex meta va HTTP headerlari.

## Rasmlar holati

Galereyaga Beauty Me Instagram profilidan 13 ta haqiqiy rasm tanlandi.
Ular orasida shu profilda ko‘rsatilgan ikki hamkorlikdagi manikyur posti ham
bor. Suratlar lokal WebP formatida, 480 px va asosiy o‘lchamda saqlangan.
Reel muqovalari alt matn va manba ro‘yxatida belgilangan. Ustalar tarkibi yoki
xizmat natijalariga alohida kafolat sifatida ishlatilmaydi.
Telegram guruhi suratlari foydalanuvchi qaroriga ko‘ra keyingi bosqichga qoldirildi.

Tanlov va manbalar: `media-inbox/selection.json`. Rasmlarni qayta optimallashtirish:

```powershell
node scripts/build-media.mjs
```

Har bir tanlangan rasm uchun `src/data/media.ts` ichiga lokal WebP/AVIF yo‘li,
asl Instagram post URL’i, kategoriya, UZ/RU sarlavha va alt matn, o‘lchamlar
kiritiladi. Galereya, asosiy sahifa va xizmat tafsilotlari avtomatik to‘ladi.

## Boshqa salonga moslash

1. `src/config/brand.ts`: nom, telefon, manzil, tashqi havolalar.
2. `src/data/content.ts`: salon nomi qatnashgan matnlar, xizmatlar va tillar.
3. `src/data/media.ts` va `public/media/`: barcha suratlar va manbalar.
4. `src/styles/tokens.css`: ranglar va shriftlar; `src/styles/creative.css`:
   barcha faol uslublar; `src/config/design.ts` va `src/lib/motion.ts`:
   animatsiya sozlamalari. Eski global.css/polish.css yuklanmaydi.
5. `public/favicon.svg`: salon belgisi. Bu belgi konsept, rasmiy logo emas.
6. `npm run check`, `npm run build`, `npm test`; sahifalarda eski nom,
   eski telefon/havolalar qolmaganini tekshiring.

`node scripts/check-rebrand.mjs` alohida vaqtinchalik nusxada boshqa salon
nomi va kontaktlarini sinaydi. Asl Beauty Me konfiguratsiyasini o‘zgartirmaydi.

## Sotuvdan keyin

Salon bilan manzil (Instagramda Iftixor 11, kataloglarda 9/3 va 9-2), ish vaqti, narxlar,
ustalar, rasm foydalanish huquqlari va telefon/Telegramni tasdiqlang.
Administrator bilan haqiqiy yozilish jarayonini kelishib, formaga server
integratsiyasi, spamdan himoya va ma’lumotlar saqlash tartibini qo‘shing.
Admin versiyasida bookingMode=request API’ni ishga tushiradi; production’da
Supabase va muhitlar ADMIN_SETUP.md bo‘yicha sozlangan bo‘lishi kerak.
Rasmiy sayt uchun demo belgisini olib tashlash, noindex meta/HTTP headerlarini
o‘chirish, canonical, hreflang, sitemap va tasdiqlangan biznes schema kerak.

## Qaytarish

Netlify’da nosozlik bo‘lsa Deploys ichida oldingi ishlaydigan deploy’ni tanlab,
Publish deploy qiling. Birinchi demo bo‘lsa yangi deploy’ni tuzatib yuklang.
Yozilish, til almashtirish, asosiy sahifa yoki lokal rasmlar ishlamasa, yangi
versiyani sotuv namunasiga yuborishdan oldin tuzating.

## Creative v3 (2026-10-08)

Ivory/wine ranglar, lokal Cormorant Garamond va Manrope shriftlari, uch suratli
hero va katta konturli wordmark. Matn satrlari niqob ichidan ochiladi, asosiy
surat pardasi ko‘tariladi, qo‘shimcha suratlar ketma-ket paydo bo‘ladi.
Xizmat tanlanganda surat va tavsif almashadi; xizmat sahifasiga o‘tishda mos
surat View Transition orqali bog‘lanadi. Desktopda yengil parallax, mobil
ekranda ikki ustunli ixcham xizmat tanlash bor. Galereya filtri va lightbox
animatsiyalari, native dialog menyu, sahifalar o‘tishi va booking bosqichlari
yangilandi. Rasmlarning tabiiy o‘lchami blok balandligini boshqarmaydi.
`prefers-reduced-motion` animatsiyalarni o‘chiradi; JS ishlamasa asosiy
kontent va xizmat havolalari ko‘rinadi. Animatsiya backend yozilishni yoqmaydi.

Astro check: 0 xato/ogohlantirish; build: 28 sahifa; test: 13/13.
DOM testlar navigatsiyadan keyingi qayta ishga tushish, forma tekshiruvi,
galereya va menyu holatini tekshiradi. Native fokus containment, animatsiya
ravonligi va viewport crop’lari ushbu v3 bosqichida hali tekshirilmagan edi.

## Public mobil sayqal (2026-10-09)

Ixcham hero, 6 xizmat tanlovi, snap galereya, pagination/lightbox, qisqa salon/FAQ/footer va mobil booking tayyor. `PUBLIC_MOBILE_QA.md` oldin/keyin o‘lchovlarni, tekshiruv va cheklovlarni beradi. Faol public uslublar: `creative.css`, undan keyin `public-mobile.css`. `interactions.ts` asosiy boshqaruvlarni GSAP’dan mustaqil yuritadi; admin o‘z mobil stylesheet’idan foydalanadi.

Lokal public build preview: `node scripts/preview-public.mjs` (4324-port). `beauty-me-mobile-demo.zip` Netlify Drop uchun public demo; `beauty-me-mobile-source.zip` public/admin manba va sozlash hujjatlari. Keyingi so‘rov bilan live Netlify yangilandi: https://beauty-me-tashkent-demo.netlify.app/uz/. Batafsil holat `NETLIFY_DEMO_DEPLOYMENT.md` da; admin cloud bazasi hali ulanmagan.

960 px foto variantlari: `node scripts/build-mobile-media.mjs`. Original va 480 px rasmlar saqlanadi. Asl media inbox mavjud bo‘lsa `build-media.mjs` uchala variantni yaratadi. Mobil sayqal testlari 23/23 edi; cloud session fix bilan yakuniy testlar 24/24, check/build muvaffaqiyatli. Haqiqiy telefon klaviaturasi va iOS Safari sinovi hali bajarilmagan.

Admin demo (2026-10-09): https://beauty-me-tashkent-demo.netlify.app/admin/demo/ — parolsiz 10 bo‘limli sandbox. Sayt footerida Admin demo havolasi mavjud; /admin/ cloud ulanmaganida shu yerga yo‘naltiradi. Sinov tahrirlari faqat joriy tabda, statistika/zayavkalar namuna. Dalillar: ADMIN_DEMO_QA.md.
