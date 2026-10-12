# Beauty Me Creative v3 — tekshiruv natijasi

Sana: 2026-10-08. Live: https://beauty-me-tashkent-demo.netlify.app/uz/
Deploy: 6ac78e65b5e4b54ed77428e5. Mustaqil salon konsepti; booking demo.

## O‘tgan tekshiruvlar

- Astro check: 23 faylda 0 xato, 0 ogohlantirish, 0 hint.
- Build: UZ/RU xizmat tafsilotlari bilan 28 HTML sahifa.
- 13/13 avtomatik test: tarjimalar, mahalliy sana va telefon tekshiruvi,
  rasm manbalari, ichki havolalar, demo ma’lumotlarning saqlanmasligi,
  client navigatsiyadan keyingi forma/galereya/motion qayta ishga tushishi,
  takroriy listener bo‘lmasligi, filter va modal yopilishi.
- Motion runtime interaktiv qismlari reduced-motion holatida DOM muhitida
  tekshirildi. Native dialog ochilishi/yopilishi DOM testida chegaraviy stub.
- Izolyatsiyalangan boshqa salon konfiguratsiyasi bilan 28 sahifada rebrand o‘tdi.
- Live HTTP: 19 route/asset va 40 lokal shrift reference ishladi; UZ/RU hero va
  xizmat sahnasi HTML’da mavjud. Mavjud bo‘lmagan URL: 404. Root: /uz/ ga 302.
- Live X-Robots-Tag: noindex, nofollow. CSS immutable cache headeri tekshirildi.
- Vite hisobi: ikkita JS bundle jami taxminan 55.84 kB gzip.

Dalil: test-results/live-v3-verification.json. Takrorlash:

```powershell
npm run check
npm run build
npm test
node scripts/check-rebrand.mjs
node scripts/verify-live.mjs
```

## Ko‘rinish va animatsiyalar

Matn satrlari niqobdan ochiladi, hero surat pardasi ko‘tariladi, xizmat
surati/tavsifi tanlash bilan almashadi. View Transitions sahifalar va xizmat
suratini bog‘laydi. Scroll reveal, yengil desktop parallax, galereya filter
joy almashishi va lightbox effektlari bor. Surat bloklari breakpointlarda
cheklangan balandlikka ega; lightbox object-fit: contain ishlatadi.

Haqiqiy brauzerda yangi dizaynning vizual/animatsiya tekshiruvi bajarilmadi:
CUA kernel Windows sandbox setup refresh xatosi bilan ishga tushmaydi.
DOM testlari screenshot, gorizontal overflow, real fokus containment yoki
animatsiya ravonligi uchun dalil emas. Lighthouse/WCAG balli o‘lchanmadi.
Oldingi test-results/beauty-me-live-desktop.jpg faqat 2026-10-07 versiyasidir.

## Kontent va keyingi bosqich

13 ta haqiqiy Beauty Me Instagram surati lokal WebP va 480px variant bilan.
Manbalar media-inbox/selection.json va src/data/media.ts da. Telegram rasmlari
foydalanuvchi qaroriga ko‘ra keyinga qoldirildi. Narxlar, ustalar va fikrlar
uydirilmagan. Iftixor 11 Instagram bio ma’lumotiga asoslangan; manzil farqlari
uchun kelishdan oldin aniqlashtirish tavsiya etiladi.

Haqiqiy yozilish integratsiyasi va salon tasdiqlagan kontent alohida bosqich.
Brauzer vositasi tiklanganda 360/390/768/1024/1440px, UZ/RU, oddiy va reduced
motion, qayta navigatsiya va galereya/formani ekranda tekshirish kerak.

## Deploy va paket

Mavjud loyiha rasmiy authenticated Netlify CLI bilan yangilandi.
Yangi loyiha yaratilmagan. beauty-me-creative-v3.zip va beauty-me-netlify-demo.zip
faqat dist fayllaridan iborat; manba, node_modules va tokenlar kiritilmagan.
Rollback uchun oldingi deploy: 6ac68fa3d1d9115822b83358.