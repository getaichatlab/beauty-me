# Beauty Me — yakuniy sayqal bajarildi

2026-10-09. Public release: 6ac914a02137679d4dbaca70. Published UTC: 16:23:17.

- Sayt: https://beauty-me-tashkent-demo.netlify.app/uz/
- RU: https://beauty-me-tashkent-demo.netlify.app/ru/
- Parolsiz admin demo: https://beauty-me-tashkent-demo.netlify.app/admin/demo/

## Dizayn va foydalanuvchi oqimi

Hero «Sizga mos obraz. Bir salonda.» bilan salon va hududni tushuntiradi. Classic makeup portreti burgundy rang bilan uyg‘un; bitta manikyur aksenti desktopda, mobil ekran uchun bitta asosiy rasm. Kirish motion’i qisqartirildi, foto ustidagi reveal faqat yengil rang qatlamidir. Native boshqaruvlar GSAP yuklanishiga bog‘liq emas. Desktop navbar ko‘ringanda hamburger yashiriladi.

Home 5 guruhga yig‘ildi: hero, xizmatlar, tanlangan ishlar, salon/ishonch, aloqa/FAQ. Gallery preview 4 kadr, mobil swipe va katta tugmalar bilan. Salon fotosi contain usulida kishilarni kesmasdan ko‘rsatiladi. Alohida katta konsultatsiya bloki va takroriy footer matnlari olib tashlandi. 390 px home balandligi: 3508 px (avval 3799); 1440 px: 3598 px (avval 5366). Bu default matn/yopiq FAQ o‘lchovi, majburiy max-height emas.

Lightbox thumbnailni darhol ko‘rsatadi, katta faylni decode’dan so‘ng almashtiradi. Kechikkan eski rasm yangi tanlov ustiga chiqmaydi; xato holati va qayta urinish bor. Surat kategoriyasi yozilish xizmatini oldindan tanlaydi, interior fotosi salon sahifasiga olib boradi. Landscape dialog ekran ichida qoladi. Fotosiz xizmat sahifalarida ixcham tipografik kompozitsiya ishlatilgan; sun’iy klinika rasmlari qo‘shilmagan.

Narx so‘rash telefon orqali; Telegram havolasi «Telegram guruhi» deb aniq nomlangan. Yandex’dagi Оксана Лаенкова, 18.02.2025 fikri mazmuni manba bilan berildi: https://yandex.com/maps/org/beauty_me/202536941352/reviews/ . Reyting yoki sotuv natijasi uydirilmagan. Salon bloki va review matni adminning Salon matnlari bo‘limidan tahrirlanadi.

## Admin namoyishi

Yozilishning faqat xizmat/sana/vaqt tanlovi shu tabdagi demo paneliga o‘tadi. Ism, telefon va izoh saqlanmaydi. Panel «Saytdan demo so‘rov» namunasini ochadi; holatni tasdiqlash mumkin. Dublikat oldini olish va quota xatosida oldingi holatni saqlash sinovdan o‘tdi. Production request API oqimi o‘zgartirilmagan.

Qoralama preview’da hero, barcha faol xizmatlar, tasdiqlangan narx izohi, 6 surat, mavjud faol jamoa va aloqa/ish vaqti ko‘rinadi. Dashboarddagi bir daqiqalik demo turi ixcham ochiladigan ko‘rsatmadir. Demo nashri public saytni o‘zgartirmaydi.

## Tezlik va tekshiruv

Critical local fontlar preload qilinadi. Hero mobil 480 px variantdan yuklandi. Hashli Astro resurslari immutable, media 1 kun cache bilan chiqarilgan. Open Graph rasm 1200×630, mutlaq URL va lokalizatsiya bor; fayl public HTTP 200.

Bir xil sekin mobil laboratoriya sharoiti: 390×844, CPU 4×, latency 150 ms, download 1.6 Mbps, upload 750 Kbps, har safar yangi context. LCP: 1.876, 2.296, 1.388 s; median 1.876 s (avval 4.928 s). CLS eng kattasi 0.000005. Server/tarmoq vaqti o‘zgarishi mumkin; bu 3 lab sample, field Core Web Vitals yoki INP natijasi emas.

- Check: 0 xato/ogohlantirish; build tayyor; 30/30 regressiya testi.
- 182 public route/viewport: 320, 360, 390, 430, 768, 1024, 1440 px; overflow/buzilgan rasm/console/HTTP xatosi 0.
- 200% matn: UZ/RU home, booking, gallery, admin; overflow 0.
- Reduced-motion: menyu, xizmat tanlash ishlaydi; animatsiya 0.
- Jonli demo: gallery → xizmat tanlangan yozilish → admin → tasdiqlash, shaxsiy input saqlanmagan.
- Netlify: 80 route/asset + 40 font reference, root/404/admin yo‘naltirishlari va real API himoyasi tekshirildi.
- Taqdimot: 6 slide final PPTX qayta import/render, PDF 6 sahifa, 4 clickable link va 2 QR tekshirildi.

## Real ishga tushirishdan avval

Demo mijozga yuborishga tayyor. Haqiqiy baza, login, trafik va Telegram bot uchun ADMIN_SETUP.md bo‘yicha egaga tegishli Supabase/bot sozlanadi. Aniq kirish manzili (Instagram Iftixor 11, kataloglarda boshqa raqam), ish jadvali, narxlar/davomiylik, ustalar va bevosita administrator kontakti biznes egasi bilan tasdiqlanadi. Tasdiqlanmagan ma’lumotlar to‘ldirilmagan. Telegram rasmlari foydalanuvchi tanloviga ko‘ra keyinga qoldirilgan. Fizik iOS/Android yoki real salon tashrifi sinovi bajarilgan deb da’vo qilinmaydi.

Dalillar: test-results/client-polish/verification.json, performance.json; test-results/live-mobile-deployment.json; presentation/.build/validation-polished-offer.json, offer-pdf-validation.json, offer-qr-scan-report.json.
