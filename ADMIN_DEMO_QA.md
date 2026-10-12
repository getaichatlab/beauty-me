# Admin demo — 2026-10-09

- Sayt: https://beauty-me-tashkent-demo.netlify.app/uz/
- Parolsiz panel: https://beauty-me-tashkent-demo.netlify.app/admin/demo/
- `/admin/` production baza ulanmaganida demo panelga 302 yo‘naltiradi. Lokal va Supabase kirishi o‘z autentifikatsiyasini saqlaydi.
- Sayt footeridagi **Admin demo** orqali sayt havolasining o‘zi bilan panelni ham taqdim etish mumkin.

## Demo imkoniyatlari

10 bo‘lim: boshqaruv, UZ/RU matnlar, xizmatlar, rasmlar, jamoa, namuna zayavkalar, statistika, sozlamalar, nashrlar tarixi va xodimlar. Qoralamani saqlash, demo nashri/rollback, hero, xizmatlar, narxlar, galereya va aloqa bilan qoralama ko‘rinishi, rasm tanlash/yuklash/fokus, kontent JSON va namuna CSV eksporti, namuna holatini tahrirlash va qayta tiklash mavjud.

Admin transporti `fetch` chaqirmaydi. Har tab o‘z `sessionStorage` holatiga ega; namuna nashri public saytni o‘zgartirmaydi. Rasmlar brauzerda 1000 px gacha WebP formatiga siqiladi, input 5 MB bilan cheklangan. Tab yopilsa demo o‘zgarishlari o‘chadi. Xotira to‘lsa saqlash tushunarli xato beradi, oldingi holat qoladi. Namuna mijozlar haqiqiy shaxslar emas; telefon havolasi ularga qo‘ng‘iroq qilmaydi. Xodim qo‘shish email yubormaydi. Demo 2FA o‘chiq; real auth cloud tizimida ishlaydi.

## Dalillar

- `npm run check`: 54 fayl, 0 error/warning/hint.
- `npm run build`: static admin demo va SSR muvaffaqiyatli.
- `npm test`: 27/27. Demo izolatsiya, revision conflict, publish/rollback/reset, storage quota, media validation, lead filter/status, member simulation va date filter tekshirildi. Production API himoyasi testi saqlangan.
- Lokal Chrome: 320 va 1440 px barcha 10 bo‘lim, 0 document overflow/xato. 390 px matnni o‘zgartirish, save/publish, modal preview va yangi PNG’ni WebP qilib yuklash/saqlash ishladi; production API so‘rovlari 0.
- Live fresh Chrome mobile 390×844: `/admin/` → `/admin/demo/`, 10 bo‘limda overflow/xato yo‘q; save/publish/preview/reset ishladi; API chaqiruvlari 0, resource xatolari 0. `test-results/live-admin-demo.json`.
- Live HTTP: 77 route/asset va 40 font reference o‘tdi; real session unconfigured, real kontent API 503 va hech qanday kontent/ruxsat bermaydi. `test-results/live-mobile-deployment.json`.

## Deploy

Active deploy: `6ac914a02137679d4dbaca70`; published UTC `2026-10-09T16:23:17.080Z`. Previous working mobile release: `6ac8c16187d83b1d9ca0424b`.

Muhim ketma-ketlik: **check → build → test → deploy**. Astro check Netlify adapter kataloglarini qayta tayyorlaydi; `--no-build` deploy oldidan yakuniy build bajarilib, `.netlify/v1/functions/ssr` mavjudligi tekshirilsin. Birinchi statik deploydagi SSR 404 yakuniy release’da tuzatildi va HTTP/brauzer orqali qayta tekshirildi.

Haqiqiy saytga tahrirlarni nashr qilish, real tashriflar va mijozlarni boshqarish uchun `ADMIN_SETUP.md` bo‘yicha Supabase sozlanadi. Public sandbox real boshqaruv ruxsatlarini ochmaydi. Fizik iOS/Android sinovi bu release’da bajarilmagan.


## Yakuniy sayqal release’i

2026-10-09: editorial hero, yangi copy, bitta foto aksent, ixcham 5 qismli home, manbali review mazmuni va 1200×630 share preview chiqarildi. Galereyada thumbnail darhol ochiladi, to‘liq surat decode’dan so‘ng almashadi; xatoda qayta urinish mavjud. Lightbox tanlangan xizmatni yozilish formasiga uzatadi.

Demo yozilish yakunidagi «Admin demo’da ko‘rish» shu tabda ochiladi. Faqat xizmat, sana, vaqt va texnik ID/sana vaqtincha saqlanadi. Ism, telefon va izoh admin namunaga yoki serverga o‘tkazilmaydi. Admin real shaxs bo‘lmagan «Saytdan demo so‘rov» yozuvini yaratadi. Holatini tasdiqlash mumkin; qayta ochish dublikat yaratmaydi. Demo statistikasi hanuz namuna.

Yakuniy check: 63 fayl, 0 error/warning/hint. Build va 30/30 regressiya testi o‘tdi. 26 public sahifa × 7 kenglik = 182 local layout holati; document overflow, console xatosi va qayd etilgan HTTP resurs xatosi yo‘q. Jonli havolada demo oqimi, 200% matn, landscape lightbox va reduced-motion qayta tekshirildi. Live HTTP: 80 route/asset va 40 font reference; Supabase real API’lari himoyalangan/unconfigured. Batafsil: test-results/client-polish/verification.json va test-results/live-mobile-deployment.json.

Yangilangan taklif: presentation/output/Beauty-Me-Taklif-250-Sayqallangan.pptx va .pdf. 6 slayd; $250, 1 oy bepul servis/o‘rgatish, domen/hosting mijoz hisobidan va biznes egasi nomiga. CRM/Telegram bot paketdagi kelgusi real integratsiya sifatida ko‘rsatilgan; demo botga ulanmagan. Ikkala QR final PPTX va PDF renderlaridan mustaqil skan qilindi.
