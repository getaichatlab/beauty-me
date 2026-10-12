# Beauty Me — ochiq Netlify demo

2026-10-09. Mobil sayt va parolsiz admin sandbox mavjud Netlify loyihasiga chiqarildi.

- Mijoz uchun sayt: https://beauty-me-tashkent-demo.netlify.app/uz/
- Ruscha variant: https://beauty-me-tashkent-demo.netlify.app/ru/
- Admin demo: https://beauty-me-tashkent-demo.netlify.app/admin/demo/
- Eski /admin/ havolasi demo panelga yo‘naltiradi.
- Dashboard: https://app.netlify.com/projects/beauty-me-tashkent-demo
- Active deploy: 6ac914a02137679d4dbaca70; ready; published UTC 2026-10-09T16:23:17.080Z.

Sayt va panel ochilishi uchun Netlify akkaunti, email yoki parol kerak emas. Sayt footeridagi Admin demo orqali bitta sayt havolasini yuborishning o‘zi panelni ham taqdim etishga yetadi. Alohida deploy-preview manzillari Netlify login talab qilishi mumkin; mijozga yuqoridagi doimiy public manzil yuborilsin.

## Ishlaydigan demo

26 UZ/RU sahifa, mobil/desktop dizayn, xizmat tanlash, galereya filter/pagination/lightbox, menyu va demo yozilish. Adminning barcha 10 bo‘limi ishlaydi: matn/rasm/xizmat tahriri, qoralama save, demo publish/rollback, kengaytirilgan preview, namuna zayavka holati, namuna statistika, eksport va reset. Demo tahrirlari faqat shu tabning sessionStorage xotirasida; asosiy sayt o‘zgarmaydi. Namuna statistika haqiqiy tashriflar sifatida ko‘rsatilmaydi. Panelda bu cheklovlar aniq yozilgan.

Haqiqiy Supabase boshqaruvi hali sozlanmagan. Real login, online nashr, real tashrif/mijoz bazasi uchun ADMIN_SETUP.md qo‘llanadi. Real API himoyasi saqlangan; public demo transporti unga so‘rov yubormaydi. Demo yozilish salon arizasi yoki bron yaratmaydi; real tracking o‘chiq. Lokal admin paroli internetga chiqarilmadi; demo panel parolsiz.

## Tekshiruv va rollback

Check 54 fayl: 0 error/warning/hint. Build muvaffaqiyatli, 27/27 test. Live 77 route/asset va 40 font reference o‘tdi; /admin/ 302, /admin/demo/ 200; auth/session unconfigured; protected real content API 503. Fresh Chrome 390 px: 10 bo‘lim, save/publish/preview/reset, 0 API chaqiruvi/resource xatosi/overflow. Lokal 320 va 1440 px barcha bo‘limlar tekshirildi; rasm upload siqilishi 390 px brauzerda sinovdan o‘tdi. Dalillar ADMIN_DEMO_QA.md, test-results/live-admin-demo.json, test-results/live-mobile-deployment.json.

Keyingi release ketma-ketligi: check → build → test → deploy. No-build deploy oldidan .netlify/v1/functions/ssr mavjud bo‘lsin. Astro check build kataloglarini qayta tayyorlashi sabab uning ortidan build zarur. Serverless functionlar ham chiqarilgan; faqat ZIP Drop emas. Rollback uchun oldingi ishchi mobile deploy 6ac8c16187d83b1d9ca0424b Netlify Deploys orqali Publish qilinadi.

Real Linux image upload va Supabase end-to-end sinovi hamda fizik iOS/Android keyboard/date picker tekshiruvi alohida qoladi.


## Yakuniy sayqal release’i

2026-10-09: editorial hero, yangi copy, bitta foto aksent, ixcham 5 qismli home, manbali review mazmuni va 1200×630 share preview chiqarildi. Galereyada thumbnail darhol ochiladi, to‘liq surat decode’dan so‘ng almashadi; xatoda qayta urinish mavjud. Lightbox tanlangan xizmatni yozilish formasiga uzatadi.

Demo yozilish yakunidagi «Admin demo’da ko‘rish» shu tabda ochiladi. Faqat xizmat, sana, vaqt va texnik ID/sana vaqtincha saqlanadi. Ism, telefon va izoh admin namunaga yoki serverga o‘tkazilmaydi. Admin real shaxs bo‘lmagan «Saytdan demo so‘rov» yozuvini yaratadi. Holatini tasdiqlash mumkin; qayta ochish dublikat yaratmaydi. Demo statistikasi hanuz namuna.

Yakuniy check: 63 fayl, 0 error/warning/hint. Build va 30/30 regressiya testi o‘tdi. 26 public sahifa × 7 kenglik = 182 local layout holati; document overflow, console xatosi va qayd etilgan HTTP resurs xatosi yo‘q. Jonli havolada demo oqimi, 200% matn, landscape lightbox va reduced-motion qayta tekshirildi. Live HTTP: 80 route/asset va 40 font reference; Supabase real API’lari himoyalangan/unconfigured. Batafsil: test-results/client-polish/verification.json va test-results/live-mobile-deployment.json.

Yangilangan taklif: presentation/output/Beauty-Me-Taklif-250-Sayqallangan.pptx va .pdf. 6 slayd; $250, 1 oy bepul servis/o‘rgatish, domen/hosting mijoz hisobidan va biznes egasi nomiga. CRM/Telegram bot paketdagi kelgusi real integratsiya sifatida ko‘rsatilgan; demo botga ulanmagan. Ikkala QR final PPTX va PDF renderlaridan mustaqil skan qilindi.
