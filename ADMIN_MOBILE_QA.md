# Admin mobil sayqallash — tekshiruv hisoboti

Sana: 2026-10-09. Lokal sayt: http://localhost:4322/admin/.
Adminning mobil kodi yangilandi; live Netlify deploy bu ish doirasida bajarilmadi.

## O‘zgarishlar

- 980 px gacha yon menyu drawer sifatida ishlaydi: overlay, yopish tugmasi,
  Escape, Tab fokus chegarasi, fon inert holati va yopilganda fokusni qaytarish.
- Drawer 100dvh va safe-area’ga mos; qisqa ekranda ichki scroll ishlaydi.
  Tepada qoladigan yopish tugmasi va pastki chiqish tugmasiga yetish mumkin.
- Mobil inputlar 16 px; asosiy matnlar 14 px, yordamchi matnlar 12–13 px.
  Tugmalarda kamida 44 px bosish maydoni, uzun matnlarda satrga tushish mavjud.
- 480 px gacha statistika/funnel kartalari bir ustun. Katta raqamlar tor
  kartaga siqilmaydi. Sana maydonlari telefonda to‘liq qator oladi.
- Form/filter/pagination/save-publish, xizmat/FAQ/SEO/jamoa, tarix/xodimlar
  tor ekranda ketma-ket joylashadi. Uzun email, ism, URL va xabarlar moslashadi.
- Rasmlar bir xil aspect ratio bilan; crop preview’lar ekran kengligiga mos.
  Checkbox matni alohida span, checkboxning o‘zi shrink bo‘lmaydi.
- Zayavka summary grid bilan: ism/xizmat, status, sana va belgi tartibli.
  Telefon va ichki izohlar ochilgan detail’da ekranga sig‘adi.
- Admin sarlavhasida sana o‘zbekcha formatter bilan chiqariladi.

Asosiy fayllar: src/styles/admin-mobile.css, src/admin/useAdminDrawer.ts,
src/admin/AdminApp.tsx, src/pages/admin/index.astro, tests/admin-ui.test.mjs.
Eski CSS ustiga admin-specific responsive qoidalar qo‘shilgan; public sayt
uslublari va backend ruxsatlari o‘zgartirilmagan.

## Haqiqiy Chrome tekshiruvi

CUA texnik xato bergach, Puppeteer MCP orqali kompyuterdagi Chrome ishlatildi.
Bu haqiqiy browser layout/screenshot tekshiruvi, jsdom layout simulyatsiyasi emas.

| Tekshiruv | Natija |
|---|---|
| 320, 360, 375, 390, 414, 430, 768, 1024, 1440 px | Har birida 10 modul + kontent FAQ/SEO: jami 108 holat |
| 740×360 landscape va 430×600 qisqa ekran | Har birida 10 modul: 20 holat |
| 390 px da matnni 200% kattalashtirish | Barcha 10 modul; final tekshiruvda overflow yo‘q |
| 360×420 drawer | scrollHeight 822 px, clientHeight 420 px; pastda ham close/logout ko‘rinadi |
| Login va MFA kod formasi 320 px | document scrollWidth 320 px, maydonlar sig‘adi |
| MFA QR setup 320 px | QR kengligi 190 px, document scrollWidth 320 px |
| Drawer fokus | Open → close tugmasi, Tab wrap, Escape → menu tugmasi; fon bloklanadi |

108 asosiy holatda document scrollWidth viewportdan oshmagan; o‘lchangan
asosiy grid/flex sibling bloklar bir-birini qoplamagan; matn Range chegaralari
viewportdan chiqmagan. Landscape/qisqa ekranlarda element chegaralari va
document overflow tekshirildi. Grafik ichki gorizontal scroll’i intentional.
Login, dashboard, zayavkalar, rasm upload, drawer va MFA screenshotlari ham
ko‘z bilan ko‘rildi. Screenshot MCP ichida ko‘rsatilgan, lokal PNG sifatida
saqlanmagan; JSON jamlama test-results/admin-mobile-verification.json’da.

Tekshiruvda topilgan va tuzatilgan holatlar: 390 px da katta statistik son
ikki satrga bo‘linishi; Chrome’da visibility transition sabab drawer fokusining
o‘tmasligi; 200% matnda “Tasdiqlandi/bajarildi” yorlig‘i overflow’i.

## Ma’lumotlar va funksional dalillar

Browserdagi owner/editor/manager ro‘yxatlari, uzun mijoz nomlari, katta sonlar
va MFA javoblari izolyatsiyalangan fetch fixture. Ular real mijoz/xodim yoki
Supabase MFA dalili emas. Browser fixture haqiqiy yozishlarni blokladi; real
parol ishlatilmadi. HTTP sinovi esa haqiqiy lokal API bilan ishlaydi va testdan
oldingi state’ni tiklaydi.

- Astro check: 43 fayl, 0 xato, 0 ogohlantirish, 0 hint.
- Build muvaffaqiyatli.
- npm test: 20/20; yangi ikki test drawer lifecycle/fokus va barcha 10 view’ni
  tekshiradi, navigation o‘zidan kontent save/publish chaqirmasligini tasdiqlaydi.
- Lokal HTTP integratsiya: 16/16, state tiklangan.
- Loglar: test-results/admin-mobile-check.txt, admin-mobile-build.txt,
  admin-mobile-tests.txt va admin-http-verification.json.

## Tekshiruv chegarasi

Chrome viewport emulyatsiyasi ishlatildi; jismoniy iPhone/Android va Safari
sinovi yo‘q. 200% tekshiruv CSS matn hajmini ikki barobar qilish bilan bajarildi,
native browser zoom testi deb olinmaydi. Mobil virtual klaviatura, real cloud
email/password recovery va Supabase MFA/security oqimi alohida tekshiruv talab
qiladi. Element auditlari barcha mumkin bo‘lgan matn va browser versiyasi uchun
mutlaq kafolat emas. Mavjud Supabase/cloud sozlash cheklovlari ADMIN_SETUP.md’da.
