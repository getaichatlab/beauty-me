# Beauty Me — public mobil sayqal va QA

2026-10-09. Tasdiqlangan `PUBLIC_MOBILE_AUDIT_AND_PLAN.md` asosidagi ishlar bajarildi.

## Oldin va keyin

| 390×844, standart yopiq FAQ | Oldin | Keyin |
|---|---:|---:|
| UZ home uzunligi | 6 254 px | 3 793 px |
| RU home uzunligi | 6 259 px | 3 795 px |
| Bazaviy H2 | Manrope, 43 / 75.25 px | Cormorant Garamond, mobil 32–40 px / 1.08 |
| Request checkbox | 128–135 × 48 px | 20 × 20 px va bosiladigan label |
| Lightbox close maydoni | 34 × 40 px | 44 × 44 px |

Home taxminan 39% qisqardi. Chrome mobil emulyatsiyasi (390×844, DPR 2, touch) 3 799 px ko‘rsatdi. 320 px yoki admin uzun kontent qo‘shganda sahifa tabiiy ravishda o‘sadi; ma’lumotni kesish orqali qat’iy balandlik qo‘yilmagan.

## Bajarilgan o‘zgarishlar

- Mobil hero: bitta 225–275 px surat, qisqa matn va yozilish tugmasi. Desktop kompozitsiyasi saqlangan.
- Xizmatlar: 6 ta ikki ustunli tanlash, bitta 200 px preview, qisqa tavsif va to‘liq xizmat sahifasiga havola. UZ/RU uzun nomlari ustunni kengaytirmaydi.
- Home galereya: 4 ta surat, native snap, indikator va 44 px boshqaruvlar. To‘liq galereya: dastlab 6/13, “Yana ko‘rish” bilan qolganlari. Filtr va lightbox barcha mos suratlarni qamrab oladi.
- Lightbox: `contain`, tugmalar, klaviatura va touch pointer swipe. Juda uzun izoh alohida scroll bo‘ladi; rasm va yopish tugmasini bosmaydi.
- Salon/konsultatsiya birlashtirildi. Home jamoa preview’i 3 profil; barcha ustalar salon sahifasida. Guruh surati contain orqali ko‘rinadi. FAQ birinchi 3 savol va qolganlarini ochish bilan ixchamlashtirildi; aloqa/footer takrorlari kamaytirildi.
- Menyu: sticky close qatori, native modal va fokus/scroll qaytarish. 390×420 ekranda close y=12–56 px; menyu pastga aylantirilganda ham o‘zgarmadi.
- Booking: 16 px input, bosqichga darhol scroll va dinamik header offset. Xato xabari va tugmalar bitta sticky blokda; keyboard viewport kichrayganda oddiy oqimga qaytadi. Pastki umumiy dock booking’da yashiriladi.
- Request roziligi ixcham checkbox bilan. Xatoda ma’lumotlar saqlanadi, retry bir request ID bilan, takroriy yuborish bloklanadi. Analitika roziligi booking’da formadan keyin oddiy oqimda.
- Mobil animatsiyalar: hero 450–650 ms, bo‘limlar 350–400 ms, sahifa chiqish/kirish 120/180 ms. Menyu va xizmat tanlash GSAP yuklanishidan mustaqil. Reduced-motion’da animatsiya o‘chadi.
- 13 ta mavjud salon fotosiga 960 px WebP delivery variant qo‘shildi. Original va 480 px rasmlar, admin crop/focus saqlangan. Yangi admin upload’lari mavjud URL/src480 orqali ishlaydi.

## Tekshiruvlar

`test-results/public-mobile-verification.json` yakuniy qayta yig‘ilgan o‘lchovlar va interaksiyalarni saqlaydi. Oldingi baseline alohida faylda qolgan.

- 26 UZ/RU sahifa × 320/390/768 px: 78 holat.
- Home UZ/RU × 360/375/414/430/740×360/1024/1440: 14 holat.
- 404 × 320/390 px: 2 holat. Jami **94 viewport holati**.
- 320 px da 14 ta **200% matn** holati. Bu computed shriftlarni 2 baravar kattalashtirgan DOM sinovi; fizik telefon yoki brauzer zoom sinovi emas.
- Ushbu layout tekshiruvlarida document overflow, tekshirilgan element chiqishi va xizmat matni/strelka to‘qnashuvi: **0**. Ataylab yaratilgan ichki gallery/team scroll’i alohida hisobga olingan.
- Brauzer: gallery 6 → 12, nails 3, reset 6; gridning hali ochilmagan 7-surati lightbox’da mavjud. Pointer touch swipe ishladi. Home counter next’dan keyin 02 / 4; fokus va scroll lock qaytdi.
- 390×420 uzun caption fixture: dialog/client 394 px, caption 126 px va ichki scroll 1092 px; close 44×44 px. Dialogning tashqi ortiqcha scroll’i yo‘q.
- Request fixture: roziliksiz 0 chaqiruv; xato → retry 2 mock chaqiruv, bir ID; ma’lumot saqlandi, yakunda tozalandi. Xato bottom=776, submit top=784 px — ustma-ust tushmaydi. Haqiqiy salonga ariza yoki bazaga ma’lumot yuborilmadi.
- Oldingi shu ish davridagi browser sinovlari: 10 ketma-ket Astro navigation’da menu click 1 event, overlay lock qolmadi; uzun kontent/jamoa fixture’lari overflow bermadi; 200% RU booking’da header bottom=137.8, panel top=154.0, xato bottom=720, submit top=728 px. Reduced-motion’da 0 animatsiya, auto scroll, transition none; asosiy boshqaruvlar ishladi. Sintetik boshqa nisbatli hero rasm ramka balandligini o‘zgartirmadi.

### Kod va tezlik

Oxirgi kod tekshiruvlari: `npm run check` — 47 fayl, 0 xato/warning/hint; `npm run build` — muvaffaqiyatli, 28 statik sahifa va admin SSR; `npm test` — **23/23**. Admin drawer/views va lokal PostgreSQL RLS regressiya testlari ham o‘tdi. Yangi testlar GSAP’siz boshqaruvlar, pagination/to‘liq lightbox havzasi va request retry/idempotency’ni qamrab oladi. Barcha build `srcset` URL’lari mavjudligi tekshiriladi.

Oldingi lokal Chrome mobil emulyatsiya kuzatuvi, CPU/tarmoq cheklovisiz: 960 px rasmlardan oldin 16 resource / 1 591 001 byte, keyin 16 resource / 862 792 byte — taxminan 46% kam. Keyingi kuzatuvda LCP 500 ms, CLS 0, resource xatosi 0. Bu lokal laboratoriya kuzatuvi; Netlify, haqiqiy mobil internet, field Core Web Vitals yoki INP natijasi deb olinmaydi.

## Ochish va paketlar

- `node scripts/preview-public.mjs` → `http://127.0.0.1:4324/uz/`. Faqat public `dist`; admin/API uchun server emas.
- `beauty-me-mobile-demo.zip`: Netlify Drop uchun public demo build. Haqiqiy admin/API yoki ariza bazasini o‘z ichiga olmaydi.
- `beauty-me-mobile-source.zip`: public + admin manba, konfiguratsiya, testlar va sozlash hujjatlari. `.env`, lokal credential/baza va node_modules chiqarib tashlangan.
- Manba paketini qayta yaratish: `powershell -File scripts/package-admin.ps1 -ArchiveName beauty-me-mobile-source.zip`.
- Surat variantlari: `node scripts/build-mobile-media.mjs`; keyin build. Original inbox mavjud bo‘lsa `build-media.mjs` uchala variantni yaratadi.

Haqiqiy iPhone Safari/Android’da klaviatura, date picker va safe-area tekshiruvi qoladi. Supabase hali sozlanmagan, real booking/tracking yoqilmagan. Dastlab mobil sayqal lokal build sifatida topshirildi; foydalanuvchining keyingi deploy so‘rovi bilan 2026-10-09 kuni Netlify live yangilandi. `NETLIFY_DEMO_DEPLOYMENT.md` URL’lar, cloud admin cheklovi va tashqi tekshiruvlarni beradi. Deploy tuzatishidan keyin check 48 fayl/0 xato, test 24/24.
