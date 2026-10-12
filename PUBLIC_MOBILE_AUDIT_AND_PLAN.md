# Beauty Me — asosiy sayt mobil tahlili va bajarish rejasi

**Sana:** 2026-10-09  
**Holat:** tahlil va reja tayyor. Ushbu bosqichda saytning dastur kodi o‘zgartirilmadi va deploy qilinmadi.

## 1. Maqsad

Telefon orqali kirgan odam salon xizmatini tez tushunsin, haqiqiy ishlarni qulay ko‘rsin va yozilish yoki bog‘lanish yo‘lini darhol topsin. Beauty Me uchun mobil sahifa tartibi:

**Salon va yozilish → xizmatni tanlash → haqiqiy natijalar → salon haqida qisqa ma’lumot → savollar → manzil va aloqa.**

Bu yangi sayt qurishdan ko‘ra mavjud saytning mobil kompozitsiyasini, matn o‘lchamlarini va foydalanish jarayonini qayta ishlashdir. Krem, bordo va qora ranglar, Beauty Me nomi, mavjud UZ/RU kontenti va salonning o‘z rasmlari saqlanadi.

Biznesga mos yo‘nalishlar: soch parvarishi, manikyur/pedikyur, kosmetologiya, qosh/kiprik, makiyaj, massaj. Soch yo‘nalishi salonning ayollar va erkaklar ishlarini ko‘rsatishga mos bo‘lishi kerak. Asosiy bog‘lanish kanallari: telefon, mavjud Telegram havolasi va saytning yozilish shakli. Narx yoki ish jadvali tasdiqlanmagan bo‘lsa, aniq raqamlar o‘ylab topilmaydi; mavjud “aniqlashtirish” yo‘li ko‘rsatiladi.

## 2. Tekshiruv usuli va chegarasi

Puppeteer MCP orqali o‘rnatilgan Chrome’da lokal sayt tekshirildi.

- 13 xil UZ/RU sahifa turi: bosh sahifa, xizmatlar, galereya, salon, aloqa, yozilish, maxfiylik va 6 xizmat sahifasi — jami **26 til/sahifa**.
- Asosiy 7 sahifa turi har ikki tilda 320, 390 va 768 px kenglikda: **42 holat**.
- Qolgan xizmatlar va maxfiylik har ikki tilda 320 va 390 px: **24 holat**, bir xil domendagi haqiqiy HTML/CSS/JS yuklangan iframe orqali.
- Bosh sahifa qo‘shimcha 360×800, 430×932, 1024×768, 1440×900 va 740×360 holatlarida: **5 holat**.
- Jami **71 o‘lchov holati**. Ruscha qosh/kiprik sahifasidagi iframe topilmasi alohida oddiy sahifada ham tasdiqlandi.
- Qo‘shimcha tekshiruv: 390×420 menyu va lightbox, yozilish bosqichlari, kichik bosish maydonlari, forma shriftlari va vaqtinchalik request-mode checkbox maketi.

O‘lchovlar [public-mobile-baseline.json](D:/fr_sayt/beauty-me/test-results/public-mobile-baseline.json) faylida saqlandi. Bular brauzer kengligi bo‘yicha tekshiruvlar; haqiqiy Android/iPhone, Safari, tabiiy ekran klaviaturasi, mobil tarmoq tezligi yoki real foydalanuvchi statistikasi tekshiruvi emas.

Mavjud foydali imkoniyatlar: WebP va srcset, lazy loading, native dialog, galereya filtrlari, GSAP ochilishlari, sahifa o‘tishlari, reduced-motion rejimi. Mobil ekranda desktop parallax/pin allaqachon cheklangan.

## 3. Aniqlangan xatolar

| Ustuvorlik | Dalil | Sabab va ta’sir | Tuzatish |
|---|---|---|---|
| P0 | H2 43 px matnda 75.25 px qator balandligi va Manrope shriftini olmoqda | CSS’dagi `font:400/1.03 var(--serif)` yozuvida shrift o‘lchami yo‘q. Belgilangan sarlavha shrifti hisoblash bosqichida ishlamayapti | Font-family, weight, size va line-height’ni aniq ajratish; H1/H2/H3 ni tekshirish |
| P0 | RU qosh/kiprik: 320 va 390 px ekranlarda sahifa kengligi 431 px. UZ qosh/kiprik 320 px da 346 px. RU massaj 320 px da 335 px | Uzun so‘zlar va grid elementining avtomatik minimal kengligi ustunni kengaytiradi | `minmax(0,1fr)`, `min-width:0`, mos sarlavha o‘lchami va mazmunni o‘qiladigan tarzda o‘rash |
| P1 | 9 holatda xizmat matni yonidagi strelkaga kirishadi; UZ 320 px “Kosmetologiya” da taxminan 53 px | Ikki ustundagi kartada raqam, nom va strelka uchun joy yetmaydi | Mobil xizmat kartasini qayta tuzish; keraksiz ichki belgilarni kamaytirish, nomga kenglik berish |
| P1 | Bosh sahifa 390×844 da 6 254 px; RU 6 259 px | Birinchi ekran, 6 ta ish, katta salon surati, alohida konsultatsiya, aloqa va footer ketma-ket baland joy oladi | Mobil bosh sahifa bo‘limlarini qisqartirish va ayrimlarini birlashtirish |
| P1 | 390×844 yozilish formasining yuqori cheti y=610 px; oxirgi bosqich yuborish tugmasi y≈1 213 px | Katta kirish matni va demo izohi formani pastga suradi; bosqich o‘zgarganda ko‘rinish formaga moslanmaydi | Qisqa intro, kichik demo izohi, bosqich sarlavhasiga qulay o‘tish, kontekstga mos boshqaruv |
| P1 | Sana, vaqt, ism, telefon va izoh maydonlari 12 px | Telefon uchun kichik matn; iOS fokusidagi kattalashtirish va klaviatura holatini ham tekshirish kerak | Forma qiymatlarini kamida 16 px qilish, label va xatolarni o‘qiladigan qilish |
| P1 | Yozilish sahifasida pastki “Qabulga yozilish” havolasi yana shu sahifaga olib boradi | Forma o‘rniga takroriy yo‘l ko‘rsatadi va pastki ekran joyini egallaydi | Yozilish sahifasida umumiy dock’ni o‘chirib, formaga tegishli boshqaruvni ko‘rsatish |
| P1 | Menyu 390×420 da 677 px mazmun; pastga aylantirilganda close tugmasi y=-241 px | Yopish tugmasi scroll qilinadigan mazmun bilan birga ketadi | Menyu boshqaruvini doim ko‘rinadigan header’da saqlash, scroll va safe-area’ni to‘g‘rilash |
| P1 | Request-mode sinov checkbox’i odatdagi maydon kabi 48 px balandlik va taxminan 128–135 px kenglik oladi | `input:not([type=radio])` qoidasi checkbox’ni ham qamrab oladi | Matn maydonlari selektorini toraytirish; checkbox’ga o‘zining kichik o‘lchami va flex-shrink:0 berish |
| P2 | Menyu 40×40, til tanlash 30×42, lightbox close 34×40, ayrim ijtimoiy havolalar 18–19 px balandlikda | Barmoq bilan bosish noqulay | Muhim mustaqil boshqaruvlar uchun 44–48 px bosish maydoni |
| P2 | Galereya toifalari va footer’da 10 px matnlar bor | Telefon ekranida o‘qish qiyinroq | Yordamchi matnlar odatda 12–13 px; asosiy matn 14–16 px |
| P2 | Birinchi dev yuklanishda GSAP Vite resurslari 504 qaytardi; reload’dan keyin tiklandi | Mahalliy dependency cache alomati; doimiy production nosozligi tasdiqlanmagan. Menyu esa motion importiga bog‘langan | Asosiy interaksiyalarni animatsiya moduli yuklanishidan mustaqil qilish; build’da qayta tekshirish |

Shriftga oid vaqtinchalik brauzer sinovida bir H2 balandligi **225.75 px → 92.875 px** bo‘ldi. Sinov uslubi qaytarildi. Bu butun sahifa tayyor tuzatildi degani emas, sababni tasdiqlovchi tajriba.

Lightbox 390×420 qisqa ekranga sig‘di; uning o‘lchami xato deb topilmadi. Unda tugmalar va uzun caption’ni ko‘rsatish usuli sayqallanadi.

## 4. Xalqaro salonlardan olinadigan jihatlar

Bular rasmiy “eng yaxshi mobil saytlar” reytingi emas; tanlangan xalqaro salonlarning rasmiy saytlaridan olingan amaliy namunalar. Uchalasining 390 px mobil ko‘rinishi ham ko‘rildi. Quyidagi tatbiqlar — Beauty Me uchun bizning moslashtirish qarorimiz.

| Namuna | Kuzatilgan jihat | Beauty Me uchun tatbiq |
|---|---|---|
| [Hershesons — Stores](https://www.hershesons.com/pages/stores) | Salon muhitini ko‘rsatadigan kuchli surat, sodda mobil header va alohida salon ma’lumotlari | O‘z salonining haqiqiy surati, tartibli header, ixcham “Salon hayoti” bloki |
| [Larry King — Salons](https://larrykinghair.com/pages/salons) | Mobil salonlar ro‘yxati yopiq accordion qatorlarida turadi; alohida yozilish yo‘llari mavjud | Xizmat tafsilotlarini faqat tanlanganda ochish, FAQ’ni ixchamlashtirish, kerakli joyda yozilish |
| [Trevor Sorbie](https://trevorsorbie.com/) | Birinchi ekranda surat, kuchli sarlavha va “Book Now” tugmasi | Hero’da haqiqiy natija va darhol ko‘rinadigan yozilish; rasm matnni bosib ketmasin |

Bu saytlar ko‘p filial va ayrim hollarda mahsulot savdosini ham qamrab oladi. Kuzatilgan sahifa uzunligi Hershesons’da taxminan 5 986 px, Trevor Sorbie’da 11 290 px edi. Ularning sahifa uzunligini Beauty Me uchun mezon qilmaymiz. Larry King’da avtomatik newsletter oynasi chiqdi; ko‘rinishni ko‘rish uchun yopildi. Beauty Me’da birinchi kirishni to‘sadigan marketing oynasi rejalashtirilmaydi.

44 px bosish maydoni — loyihadagi qulaylik maqsadi; [W3C Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) tavsifiga mos. Bu sayt butun WCAG AAA talablarini bajardi degan da’vo emas.

## 5. Mobil bosh sahifaning yangi kompozitsiyasi

**390×844, mavjud standart kontent, FAQ yopiq holatda: 3 300–3 800 px maqsad.** Bu hozirgi 6 254 px dan taxminan 39–47% qisqa. Matn kattalashtirilganda yoki admin qo‘shimcha kontent berganda mazmun erkin kengayadi; qat’iy height bilan matn kesilmaydi.

1. **Ixcham header va hero.** Header taxminan 64–76 px. Toshkent/Yunusobod, qisqa ikki satrli sarlavha, foydani tushuntiradigan 1–2 jumla va asosiy tugma. Bitta yetakchi salon surati, boshqarilgan arch shakli va yengil dekor. Mobil surat qismi taxminan 220–280 px; ikki ustma-ust kichik surat hero’ni majburiy baland qilmaydi. Tugma birinchi ekranda ko‘rinadi.
2. **Xizmat tanlash.** Barcha 6 yo‘nalish boshidan topiladi. 320 px da ham sig‘adigan ikki ustunli tugmalar, o‘qiladigan nom va tanlangan holat. Bir paytda bitta preview: taxminan 180–240 px surat yoki mavjud xizmat grafikasi, qisqa izoh, “Batafsil” va “Yozilish”. To‘liq tafsilot alohida xizmat sahifasida.
3. **Haqiqiy ishlar.** Bosh sahifada 4 tanlangan ish. Bir qatorda barmoq bilan suriladigan native scroll-snap galereya; keyingi kartaning bir qismi, oldinga/orqaga tugmalari va aniq son indikator. Rasm kartasi taxminan 200–260 px kenglikda, 4:5 nisbatda. Umumiy sahifa gorizontal surilmaydi. To‘liq galereya uchun “Barcha ishlar”.
4. **Salon va konsultatsiya.** Hozirgi ikki katta blok bitta qisqa bo‘limga birlashadi: salon hayotidan rasm, 2–3 jumla, “Salon haqida” va konsultatsiya havolasi. Guruh suratidagi odamlar kesilmasligi uchun shu rasmga mos nisbat ishlatiladi.
5. **Savollar.** Muhim 3 savol darhol ko‘rinadi; qolgan savollar “Yana savollar” orqali shu sahifada ochiladi. Savollar to‘liq saqlanadi, foydalanuvchi xohlaganda yoyiladi.
6. **Manzil va aloqa.** Iftixor ko‘chasi, 11 haqidagi mavjud ma’lumot, telefon, Telegram va yo‘nalish olish bir ixcham blokda. Narx so‘rash yo‘li xizmat tanlash yonida ham ko‘rinadi.
7. **Footer va pastki panel.** Footer qisqa, havolalari o‘qiladigan. Oddiy sahifalarda “Qo‘ng‘iroq” + “Yozilish” pastki paneli safe-area bilan ishlaydi. Telefon klaviaturasi va booking holati uchun alohida boshqaruv tartibi bo‘ladi.

## 6. Barcha ichki sahifalar

- **Xizmatlar katalogi:** bosh sahifa bilan bir xil qulay tanlash. UZ/RU uzun nomlar va 320 px holati mustaqil tekshiriladi.
- **6 xizmat sahifasi:** ixcham sarlavha, haqiqiy izoh, mavjud bo‘lsa narx, yozilish va narxni aniqlashtirish. Keyin mos o‘lchamdagi surat/grafika, xizmatlar ro‘yxati, qisqa natijalar va FAQ. Uzun so‘z ustunni kengaytirmaydi.
- **To‘liq galereya:** ikki ustundagi bir xil nisbatli rasmlar. Dastlab 6 ta, qolganlari “Yana ko‘rish” orqali. Filtr barcha mos ishlar bo‘yicha hisoblaydi; yashirilgan suratlar yo‘qolib ketmaydi. Suratni katta ko‘rish, tugma, klaviatura va swipe bilan almashish. Caption asosiy rasmni bosmaydi.
- **Salon sahifasi:** originalga mos guruh surati, qisqa ta’rif; admin haqiqiy ustalarni qo‘shgan bo‘lsa, tartibli profil kartalari. Bosh sahifaga cheklangan preview, to‘liq jamoa salon sahifasida.
- **Aloqa sahifasi:** manzil va amaliy bog‘lanish birinchi o‘rinda. Bir manzilning takroriy katta bloklari birlashtiriladi.
- **Yozilish:** kirish qisqaradi, demo izohi aniq va ixcham qoladi. 3 bosqich saqlanadi. Bosqich o‘zgarsa ko‘rinish tegishli forma qismiga moslanadi. Input 16 px; xato maydon yonida ham tushunarli. Request-mode roziligi ixcham checkbox bilan. Takroriy yuborishdan mavjud himoya saqlanadi.
- **Maxfiylik va 404:** o‘qiladigan matn, sig‘adigan sarlavha va qulay qaytish havolalari.
- **Menyu:** qisqa ekranlarda ham yopish tugmasi ko‘rinadi. Fokus ichida qoladi, Escape/close ishlaydi, yopilganda fokus va scroll qaytadi.
- **Analitika roziligi:** yoqilganda yozilish paneli yoki forma maydonini to‘smasligi tekshiriladi.

## 7. Harakat va effektlar

Mavjud GSAP, Astro view transitions va native animatsiyalar asosida:

- Hero matni satr bo‘yicha 350–550 ms ichida ochiladi; suratning mask orqali ochilishi taxminan 450–650 ms.
- Birinchi ekranning tugmalari ochilish vaqtida ham ishlaydi; kutish ekrani qo‘shilmaydi.
- Xizmat preview almashinuvi 180–300 ms, asosiy blok balandligi keskin sakramaydi.
- Rasm va bo‘limlarning bir martalik 8–16 px siljish + fade ochilishi 250–400 ms.
- Native gallery snap, ko‘rinadigan indikator, bosishdagi yengil feedback.
- Sahifalar orasidagi qisqa o‘tishlar taxminan 120–180 ms.
- Yozilishda interaksiya tezligi birinchi o‘rinda; katta harakatlar ma’lumot kiritishni kutishga majbur qilmaydi.
- [W3C prefers-reduced-motion usuli](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html) bilan harakatni kamaytirgan foydalanuvchiga to‘liq ishlaydigan sokin variant.
- Menyu va xizmat tanlash animatsiya kutubxonasi ishlamagan holatda ham ishlaydi.
- Gallery filter, dialog ochish/yopish va ketma-ket sahifa o‘tishlari handler’larni ko‘paytirmaydi.

## 8. Bajarish bosqichlari

| Bosqich | Ish | Natijani qabul qilish mezoni |
|---|---|---|
| 1. CSS xatolarini tuzatish | Sarlavha fonti, uzun so‘zlar, grid minimal kengligi, checkbox selektori, bosish maydonlari | Qosh/kiprik va massaj sahifalarida overflow 0; xizmat matni/strelka to‘qnashuvi 0 |
| 2. Mobil kompozitsiya | Hero, 6 xizmat tugmasi, bitta preview, galereya preview, birlashgan salon/konsultatsiya, FAQ, footer | 390×844 standart home 3 300–3 800 px; kerakli ma’lumotlar va CTA saqlanadi |
| 3. Ichki sahifalar va yozilish | Katalog, barcha xizmatlar, gallery, about/contact, forma bosqichlari, menyu, keyboard/dock | Formani ko‘rish va to‘ldirish qulay; menu close doim yetib boriladigan joyda |
| 4. Animatsiya va tezlik | Mobil vaqtlar, photo reveal, snap/filter/lightbox, route cleanup, mustaqil interaksiyalar | Reduced-motion, qayta navigatsiya, rasm sekin kelishi va motion xatosida ishlash |
| 5. Admin kontenti bilan moslik | Uzun UZ/RU matnlar, o‘zgargan surat nisbati, focus/crop, narx/jadval, jamoa, tracking, demo/request | Kontentni admin orqali almashtirish responsivlikni buzmaydi; fixture haqiqiy bazaga yozilmaydi |
| 6. Yakuniy QA va topshirish | Browser matrix, meaningful regression tests, check/build, production preview | Oldin/keyin o‘lchov, screenshot va xatolar hisoboti; tayyor deploy paketi |

Birinchi bosqich tugamaguncha yangi effektlarni ko‘paytirish rejalashtirilmaydi: avval layout va o‘qilish, keyin harakatlar.

## 9. O‘zgartiriladigan fayllar

- [creative.css](D:/fr_sayt/beauty-me/src/styles/creative.css): noto‘g‘ri bazaviy qoidalar va selektorlar.
- Yangi `src/styles/public-mobile.css`: mobil qoidalar tartibli alohida faylda, public Layout ichida ulanadi. Admin CSS’iga o‘zgartirish kiritilmaydi.
- [Layout.astro](D:/fr_sayt/beauty-me/src/layouts/Layout.astro): header, menyu, pastki panel, viewport safe-area va mobil stylesheet.
- [HeroStage.astro](D:/fr_sayt/beauty-me/src/components/HeroStage.astro): ixcham mobil surat/matn kompozitsiyasi.
- [ServiceExplorer.astro](D:/fr_sayt/beauty-me/src/components/ServiceExplorer.astro): kartalar va boshqarilgan preview.
- [Gallery.astro](D:/fr_sayt/beauty-me/src/components/Gallery.astro): preview variant, snap, “Yana ko‘rish”, lightbox boshqaruvi.
- [Booking.astro](D:/fr_sayt/beauty-me/src/components/Booking.astro): formaning mobil holati va bosqich fokus/scroll tartibi.
- [Contact.astro](D:/fr_sayt/beauty-me/src/components/Contact.astro), [Team.astro](D:/fr_sayt/beauty-me/src/components/Team.astro): ixcham variantlar va kontent cheklangan preview.
- [Sahifalar shabloni](D:/fr_sayt/beauty-me/src/pages/[lang]/[...path].astro): mobil home tarkibi va ichki sahifalar.
- [motion.ts](D:/fr_sayt/beauty-me/src/lib/motion.ts): harakat va interaksiyalarni ajratish, mobil vaqtlar, cleanup.
- [Photo.astro](D:/fr_sayt/beauty-me/src/components/Photo.astro): yangi kartalarga mos sizes/srcset, mavjud object-position.
- [Kontent](D:/fr_sayt/beauty-me/src/data/content.ts): faqat zarur qisqa UZ/RU yorliqlar.
- `tests/client-lifecycle.test.mjs` va browser QA skripti: mavjud funksiyalar buzilmaganini tekshirish.

Mavjud URL, service ID, admin kontent modeli, form/API payload va analitika event nomlari saqlanadi. Admin bilan boshqariladigan ma’lumotlar komponentlarda qattiq yozib qo‘yilmaydi.

## 10. Tekshirish mezonlari

1. **Ekranlar:** 320, 360, 375, 390, 414, 430, 768, 1024 va 1440 px; 740×360 va qisqa 390×420 holati. UZ/RU barcha sahifalar.
2. **Matn:** sarlavha, uzun xizmat nomi, narx, telefon, FAQ va 200% matn kattaligi. Matn kesilmaydi; kerak bo‘lsa kartalar bitta ustunga o‘tadi.
3. **Rasmlar:** yuz/tirnoq/soch va guruh rasmlarida kerakli joy ko‘rinadi. Har xil nisbat, missing/slow image, admin focus qiymatlari. Muhim ishning asl ko‘rinishi lightbox’da ochiladi.
4. **Navigatsiya:** menyu open/close/Escape/fokus/scroll; til almashtirish joriy sahifani saqlashi; ketma-ket 10 sahifa o‘tishida handler’lar takrorlanmasligi.
5. **Galereya:** swipe va tugmalar, filter, ish soni, “Yana ko‘rish”, lightbox oldinga/orqaga va yopish, matn uzunligi. Umumiy sahifada tasodifiy yonlama scroll yo‘q.
6. **Yozilish:** barcha bosqichlar, oldindan tanlangan xizmat, required/date/phone xatolari, back, success, server xatosi, qayta bosish, consent. Demo/request farqi saqlanadi; QA haqiqiy salonga ariza yubormaydi.
7. **Klaviatura va touch:** haqiqiy iOS Safari/Android Chrome’da input fokus, date picker, viewport kamayishi, pastki panel va safe-area yakuniy qurilma QA’sida tekshiriladi. Bajarilmagan qurilma sinovi bajarildi deb ko‘rsatilmaydi.
8. **Harakat:** normal va reduced-motion; mazmun darhol mavjud, tugma animatsiya tugashini kutmaydi.
9. **Tezlik:** production build’da mobil profilda lab tekshiruvi. [Google Web Vitals](https://web.dev/articles/vitals) asosidagi maqsadlar: LCP ≤2.5 s, CLS ≤0.1, INP ≤200 ms. INP va Core Web Vitals real foydalanuvchilar uchun 75-percentile bilan baholanadi; bir lokal sinov buni isbotlamaydi.
10. **Regressiya:** `npm run check`, `npm run build`, mavjud testlar hamda yangi mobil interaksiyalarga tegishli meaningful testlar. Desktop va admin ko‘rinishi qayta smoke-check qilinadi.

Bosh sahifa balandligi kamayishi matnni mayda qilish yoki foydali ma’lumotni kesish hisobiga erishilmaydi. U bo‘limlarni birlashtirish, tanlov bo‘yicha tafsilot ochish va to‘liq kontentni o‘z sahifalarida berish orqali erishiladi.

## 11. Biznes natijasini kuzatish

Real sayt va baza ulangandan keyin, foydalanuvchi roziligi asosidagi mavjud analitikadan foydalaniladi:

- mobil tashrif → xizmat ko‘rish;
- mobil tashrif → Telegram/telefon/xarita bosilishi;
- yozilishni boshlash → qabul qilingan ariza.

Dizayn sabab kirgan odam chiqib ketmasligini hozir raqam bilan isbotlab bo‘lmaydi. Amaliy mezon — vazifani bajarishdagi noqulayliklar bartaraf etilishi; biznes ta’siri real statistikada keyin taqqoslanadi. Hozir tracking o‘chiq, Supabase loyiha sozlanmagan.

**Bajarilish holati — 2026-10-09:** reja bo‘yicha mobil kompozitsiya, ichki sahifalar, animatsiyalar, mustaqil interaksiyalar, rasm variantlari va QA bajarildi. 390 px home: UZ 6 254 → 3 793 px, RU 6 259 → 3 795 px; 23/23 test. Yakuniy dalillar va fizik qurilma/Netlify cheklovlari `PUBLIC_MOBILE_QA.md` hamda `test-results/public-mobile-verification.json` ichida.
