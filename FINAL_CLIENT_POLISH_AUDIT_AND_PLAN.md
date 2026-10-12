# Beauty Me — mijozga taqdim etishdan oldingi audit va yakuniy sayqal rejasi

Sana: 2026-10-09, Asia/Qyzylorda. Jonli sayt: https://beauty-me-tashkent-demo.netlify.app/uz/
Admin demo: https://beauty-me-tashkent-demo.netlify.app/admin/demo/

## Xulosa

Mavjud saytning asosi yaxshi: salonning haqiqiy rasmlari, burgundy/ivory palitrasi, katta sarlavhalar, ikki til, xizmat tanlash, galereya va yozilish oqimi bor. Hero matni/surat ochilishi, sahifa almashishi va mayda interaksiya animatsiyalari allaqachon ishlaydi. Yakuniy sayqal ularni bitta salon brendiga mos kompozitsiyaga birlashtirishi va biznes egasiga saytning foydasini amalda ko‘rsatishi kerak.

Ustuvor yo‘nalish: kuchli birinchi ekran → kerakli xizmat → haqiqiy natija → shu natijaga yozilish → administrator so‘rovni boshqarishi. Dizayn xarid qarorini yengillashtirishga xizmat qiladi; mijozning sotib olishi kafolatlangan natija sifatida baholanmaydi.

Bu hujjat — tahlil va amalga oshirish rejasi. Ushbu bosqichda jonli sayt dizayni yoki ishlab turgan kodi o‘zgartirilmadi; faqat audit skriptlari, ekranlar va hisobot saqlandi.

## 1. Tekshirilgan holat va dalillar

- 26 ta UZ/RU public sahifa: home, xizmat katalogi, 6 xizmat sahifasi, galereya, salon, aloqa, yozilish va maxfiylik.
- 320, 390, 768 va 1440 px kenglik: jami 104 sahifa/ekran holati. Mobil emulyatsiya — Chrome; fizik iPhone/Android sinovi emas.
- Document darajasida gorizontal overflow: 0. Brauzer JavaScript xatosi va qayd etilgan HTTP 4xx/5xx resurs xatosi: 0.
- 13 ta original rasm manzili mustaqil tekshirildi: barchasi HTTP 200. Ayrim lazy rasmlarning dastlab naturalWidth=0 bo‘lishi buzilgan fayl deb hisoblanmadi.
- Mobil menyu ochish/yopish, manikyur preview tanlash, galereya filtri (3/3), lightbox ochish/keyingi rasm, xizmat oldindan tanlangan demo yozilish va admin demo ochilishi ishladi.
- Reduced-motion holatida xizmat tanlash ishladi, document.getAnimations() 0 qaytardi.
- UZ home uzunligi: 390 px da 3 799 px; 320 px da 3 963 px; 768 px da 4 728 px; 1440 px da 5 366 px. Ushbu raqamlar FAQ yopiq bo‘lgandagi bazaviy kontentga tegishli.
- Desktop tanlangan xizmat matni #D7B6B0 / #4B182A: kontrast 7.66:1. Standart holatdagi kontrast xatosi tasdiqlanmadi; active/hover/focus holatining yanada ravshanligi — dizayn yaxshilanishi.
- Lightbox sovuq yuklanishda birinchi tekshiruvda complete=false, naturalWidth=0 edi: qora bo‘sh ramka ko‘rindi. Shu ochilish sinovida rasm decode va 250 ms kutish bilan 2.2 soniyada ko‘rindi. Bu universal yuklanish vaqti emas.
- Sekin mobil laboratoriya sharoiti: 390×844, CPU 4×, download 1.6 Mbps, upload 750 Kbps, latency 150 ms, yangi browser context. Uchta LCP: 5.460 / 1.568 / 4.928 soniya; median 4.928 soniya. TTFB: 3.967 / 0.737 / 2.806 soniya. CLS: 0.00035–0.00053. Server/tarmoq variatsiyasi sezilarli; faqat rasmni kichraytirish bilan muammo yechildi deb bo‘lmaydi. Bu field Core Web Vitals yoki INP natijasi emas.

Dalillar: `test-results/pre-client-audit/report.json`, `technical.json`, `image-validation.json`; shu papkada desktop/mobil ekranlar. Full-page capture’da fixed pastki dock ba’zan tasvir o‘rtasida joylashadi: bu capture xususiyati, saytning layout xatosi deb hisoblanmadi. Dastlabki tez scroll capture’dagi ochilmagan reveal elementlari keyin instant-scroll bilan qayta tekshirildi.

## 2. Mijozga ta’sir qiladigan aniq kamchiliklar

| Ustuvorlik | Hozirgi holat | Ta’siri | Yakuniy yechim |
|---|---|---|---|
| P0 | Lightbox rasm kelguncha qora ramka | Ochish ishlamayapti degan taassurot | Thumbnailni darhol ko‘rsatish, katta rasm tayyor bo‘lganda almashish, yuklanish/xato holati |
| P0 | Demo yozilish admin demo namunalariga ulanmagan | Biznes egasi CRM foydasini amalda ko‘rmaydi | Bitta tabda xavfsiz sinov so‘rovi → admin namunasi → holat o‘zgarishi |
| P0 | Admin demo qoralama preview’i faqat hero/xizmat nomlari darajasida | Egasi rasm yoki kontent o‘zgarishini to‘liq tasavvur qilmaydi | Galereya, xizmat kartasi va aloqa qismi ham ko‘rinadigan demo preview |
| P0 | Manzil saytda Iftixor 11; kataloglarda 9/3 yoki 9-2 | Yo‘nalish va ishonchga ta’sir qiladi | Mijozdan manzil/kirishni tasdiqlash; tasdiqlanguncha xarita va aniqlashtirish eslatmasini saqlash |
| P1 | Birinchi ekran matni juda umumiy | Beauty Me nega tanlanishi aniq emas | Xizmat va hududni ko‘rsatuvchi aniq copy + bitta asosiy harakat |
| P1 | Kosmetologiya, qosh/kiprik, massajda asosiy surat yo‘q | Katta raqamli placeholder tugallanmagan ko‘rinadi | Haqiqiy material bo‘lsa qo‘shish; bo‘lmasa ixcham, ataylab yaratilgan tipografik kompozitsiya |
| P1 | Salon guruh surati mobil keng ramkada kichik, desktopda kesilgan | Muassasa va jamoa yaxshi tanilmaydi | Alohida to‘liq ko‘rish; imkon bo‘lsa haqiqiy keng interyer rasmi; mos ramka va crop |
| P1 | Galereya ko‘rishdan yozilishga bevosita yo‘l yo‘q | Yoqqan ish bo‘yicha harakat uziladi | Lightbox’da shu xizmatga yozilish tugmasi, xizmat oldindan tanlangan |
| P1 | Tasdiqlangan narxlar/davomiylik va usta profillari yo‘q | Tanlash uchun ma’lumot kam | Mijozdan olingan ma’lumotni admin orqali ko‘rsatish; yo‘q ma’lumotni uydirmaslik |
| P1 | Real mijoz fikrlari faqat xarita havolasida | Ishonch signali ko‘zga tashlanmaydi | Ixcham real fikr/review bloki, manba havolasi va yangilangan sana |
| P1 | Narx/aloqa Telegram havolasi guruhga olib boradi | Mijoz administrator bilan bevosita gaplasha olmaydi | Guruhni aniq nomlash; tasdiqlangan admin/bot kontaktini real ishga tushirishda ulash |
| P1 | Uch laboratoriya yuklanishi turlicha va ikkisi sekin | Kuchli animatsiya yuklanishdan oldin foyda bermaydi | HTML javobi/cache, hero/shrift va motion yuklanishini alohida optimallashtirish |
| P1 | og:image yo‘q | Telegram/WhatsApp’da demo havolasi kuchsiz ko‘rinadi | Salon fotosi bilan 1200×630 preview, aniq title/description va mutlaq URL |
| P2 | Desktopda navbar ham, hamburger ham ko‘rinadi | Ortiqcha boshqaruv | To‘liq navbar sig‘ganda hamburgerni yashirish |
| P2 | Aloqa/footer takrorlari, desktop konsultatsiya alohida katta blok | Scroll ko‘payadi | Vazifasi takrorlangan matn/bloklarni birlashtirish |

## 3. Referenslar va aynan olinadigan jihatlar

Bu referenslar rasmiy salon saytlaridan tanlandi; global reyting bo‘yicha “eng yaxshi” degan da’vo yo‘q. Ularning rasmlari, mukofotlari va xizmat va’dalari Beauty Me’ga ko‘chirilmaydi.

- [Hershesons Belgravia](https://www.hershesons.com/pages/belgravia): xizmat menyulari, telefon/manzil/ish jadvali va online yozilish bir joyda. Beauty Me uchun: tanlashga yordam beradigan ixcham xizmat kartasi va aniq aloqa. Sahifa matni tekshirildi; mobil screenshot font kutish timeout’i bilan olinmadi, shuning uchun mobil geometriyasi tekshirildi deb da’vo qilinmaydi.
- [Rossano Ferretti Salons](https://www.rossanoferretti.com/salons/): salon tajribasi, konsultatsiya va shaxsga mos xizmat haqida hikoya. Beauty Me uchun: editorial foto/copy, xizmatdan ko‘ra mijoz istagini ifodalash. Mobil sahifada mamlakat tanlash popup’i kuzatildi; bunday kirishni to‘suvchi popup bizning rejaga kiritilmaydi.
- [Van Michael](https://vanmichael.com/): katta tipografiya, birinchi ekrandagi Book Now, xizmat yo‘nalishlari va real reviewlar. Beauty Me uchun: birinchi ekrandagi bitta yaqqol CTA va manbali ishonch signali. Mobil ekran tekshirildi.
- Tezlik mezonlari: [Google Web Vitals](https://web.dev/articles/vitals). Maqsadlar LCP ≤2.5 s, CLS ≤0.1; field baholash real foydalanuvchilarning 75-persentiliga asoslanadi. Bu demo auditida yetarli real trafik va field INP ma’lumoti yo‘q.

## 4. Tanlangan creative yo‘nalish

Yo‘nalish: **Beauty Me — salon jurnalining jonli muqovasi**. Burgundy/ivory asos, katta serif sarlavha, aniq sans matn va salonning haqiqiy foto ishlari. Asosiy portret uchun `classic-makeup` suratini hozirgi `evening-look` bilan desktop/mobilda taqqoslab, matn va brendga mosini tanlash. Butun saytning rang va shrift asosini almashtirish shart emas.

Desktop: qat’iy grid, katta asosiy portret, bitta kichik ish detali, salon nomi fon qatlamida. Hozirgi ikki polaroid aksentni ko‘paytirmay, kompozitsiyani tartibga keltirish. Mobil: bitta asosiy portret, qisqa sarlavha, 2 satrgacha izoh, yaqqol yozilish tugmasi; ma’lumotni yashirish uchun qat’iy ekran balandligi ishlatilmaydi.

Copy varianti: “Sizga mos obraz. Bir salonda.” Izoh: “Soch, manikyur, makiyaj va parvarish — Toshkent, Yunusobodda.” RU versiya shu ma’noda tabiiy tarjima qilinadi. Barbershop borligi soch xizmatida erkaklar yo‘nalishi sifatida aniq ko‘rsatiladi; tasdiqlanmagan yangi xizmat o‘ylab topilmaydi.

### Uchta asosiy animatsiya

1. **Kirish kompozitsiyasi:** sarlavha satrlari maskadan ochiladi, portret yumshoq crop/scale bilan paydo bo‘ladi, CTA yengil ochiladi. Mobil 450–650 ms; desktop asosiy ko‘rinish 700–900 ms ichida. Tugma va kontent animatsiya tugashini kutmay ishlaydi.
2. **Xizmat almashishi:** tanlangan yo‘nalishning ramka/rasmi va qisqa tavsifi 200–280 ms yumshoq almashadi; bosish va klaviatura tanlovi saqlanadi. Desktop hover bo‘lsa fokus va tanlangan holat barqaror qoladi.
3. **Natijadan yozilishga:** surat kattalashishi, filtr almashishi va “Shu xizmatga yozilish” o‘tishi 180–240 ms. Hozirgi sahifa o‘tishlari bilan bir xil harakat ritmi.

Scroll reveal ikkilamchi elementlarda yengil. Telefon scroll’i tabiiy; doimiy autoplay karusel yoki kirish loaderi qo‘shilmaydi. Reduced-motion’da mazmun va boshqaruvlar to‘liq ishlaydi. Haqiqiy before/after juftligi bo‘lmasa taqqoslash slideri qo‘shilmaydi.

## 5. Qisqa home tuzilishi

1. Hero: salon/hudud, asosiy foto, qisqa qiymat, yozilish CTA.
2. Xizmat tanlash: 6 yo‘nalish, bitta preview, kerakli xizmat sahifasi va yozilish.
3. Tanlangan ishlar: desktop 3–4 kuchli kadr; mobil swipe preview; to‘liq galereya alohida.
4. Salon va ishonch: ixcham haqiqiy foto, manbali fikr yoki review havolasi, ustalar tasdiqlangan bo‘lsa preview. Alohida katta konsultatsiya blokini shu yerga birlashtirish.
5. Kelish va yozilish: manzil/yo‘nalish/telefon, 2–3 ixcham FAQ; ixcham footer.

Maqsad: 390 px home’ni hozirgi 3 799 px dan taxminan 3 200–3 500 px oralig‘iga qisqartirish; bu default matn va yopiq FAQ uchun orientir, majburiy max-height emas. Katta shrift va uzun RU matnlar erkin o‘sishi kerak. Tasdiqlangan ustalar/review kontenti hajmiga qarab qayta o‘lchanadi.

## 6. Amalga oshirish bosqichlari

### A. Birinchi ekran va dizayn intizomi
- Hero copy, asosiy surat va crop’ni yakunlash; desktop/mobil kompozitsiyalarini alohida sayqallash.
- CTA, mayda matn, border/radius va active/focus holatlari uchun yagona tizim.
- Desktop ortiqcha hamburger va takroriy dekorativ metadata’ni tartibga keltirish.
- Natija: birinchi 5 soniyada “qaysi salon, qayerda, qanday xizmat, qanday yozilish” tushunarli.
- Fayllar: `HeroStage.astro`, `Layout.astro`, `content.ts`, `creative.css`, `public-mobile.css`, `motion.ts`.

### B. Foto va galereya
- Hero, service preview, gallery va jamoa suratiga vazifasiga mos o‘lcham/crop belgilash. Galereya kartalari 4:5, to‘liq ko‘rish contain; guruh suratida kishilarni kesmaslik.
- Lightbox’da avval thumbnail; decode tugagach katta surat, yuklanish xatosida qayta urinib ko‘rish va original post havolasi.
- Filtr, swipe, load-more, klaviatura, fokus qaytarish saqlanadi.
- Surat kategoriyasiga mos “Shu xizmatga yozilish” CTA; interior suratida aloqa/salon haqida.
- Natija: rasm bosilishi qora ekran bilan yakunlanmaydi va ish ko‘rishdan yozilishga o‘tish bor.
- Fayllar: `Photo.astro`, `Gallery.astro`, `media.ts`, `HeroStage.astro`, tegishli CSS.

### C. Xizmat, ishonch va aloqa
- Hamma yo‘nalishda sayt bir xil darajada tugallangan ko‘rinishi; bo‘sh katta placeholderlarni kichraytirib maqsadli dizayn bilan almashtirish.
- Narx/davomiylik/usta uchun mavjud admin maydonlarini public sahifalarda tushunarli ko‘rsatish.
- Mijoz tasdiqlagan ish jadvali, manzil va bevosita kontakt. Tasdiqlanguncha noaniqlikni hal qilingandek ko‘rsatmaslik.
- Reviewlar haqiqiy, manbali va qisqa; rating snapshot ishlatilsa tekshirilgan sana bilan. Uydirma ustalar, sertifikatlar, sanalar yoki natija va’dalari bo‘lmaydi.
- Natija: qaror qilishga yordam beradigan mazmun, kamaygan takrorlar.
- Fayllar: `[...path].astro`, `ServiceExplorer.astro`, `Contact.astro`, `Team.astro`, `brand.ts`, admin content modeli kerak bo‘lsa additive kengaytirish.

### D. Yozilish oqimi
- Xizmat sahifasi va galereyadan tanlangan xizmat formaga o‘tadi.
- Keyingi bosqichlarda tanlangan xizmat qisqa summary ko‘rinishida turadi.
- Telefon maydoni, sana, xatolar, orqaga qaytish va yakuniy holat UZ/RU uchun sayqallanadi.
- Pastki dock klaviatura/formani bosmaydi; keyboard, safe-area va 200% matn tekshiriladi.
- Haqiqiy rejimda bu tasdiqlangan qabul emas, administrator tasdiqlaydigan so‘rov ekani aniq.
- Natija: xizmat tanlashdan yakunlashgacha qisqa va tushunarli oqim.
- Fayllar: `Booking.astro`, `booking.ts`, public CSS.

### E. Egaga 60–90 soniyalik amaliy demo
- Yozilish natijasidan shu tabdagi admin sandboxga o‘tish va aynan shu sinov xizmatini ko‘rish.
- Demo yozuv faqat sintetik/maskalangan test ma’lumoti bilan yaratiladi; haqiqiy mijoz ma’lumoti yoki salon bazasiga yozilmaydi.
- Administrator “Bog‘lanildi” / “Tasdiqlandi” holatini o‘zgartiradi; sana/holat tarixi ko‘rinadi.
- Foto va sarlavhani almashtirish → kengaytirilgan qoralama preview’da natijani ko‘rish. Public demo o‘zgarib ketmaydi.
- Bir tab uchun sessionStorage sandbox saqlanadi; boshqa browser yoki tabda bir xil holat bor deb va’da qilinmaydi. Natijadan admin’ga o‘tish shu tabda bo‘ladi.
- CRM → Telegram notification → admin action yo‘li demo/prototip sifatida aniq belgilangan preview’da ko‘rsatilishi mumkin. Telegram bot hozir haqiqiy ulanmagan; cloud integration alohida ishga tushirish bosqichi.
- $250 taklif va 1 oy bepul xizmat shartlari salon mehmonlariga mo‘ljallangan public sahifaga joylanmaydi; egaga taqdimotda beriladi.
- Fayllar: `Booking.astro`, `demo.ts`, `DemoAdminApp.tsx`, `DemoPreview.tsx`, admin CSS/model zaruratga ko‘ra.

### F. Tezlik, share preview va ishonchli fallback
- TTFB variatsiyasini takror o‘lchash; static HTML javobi/cache’ni actual response orqali tekshirish.
- Hero uchun mos responsive variant va kerakli resurslarning erta yuklanishi; pastki rasmlarning ustuvorligini kamaytirish.
- Shrift/motion kontentni bloklamaydi; keraksiz yuk va katta nav transition’lar qisqartiriladi.
- og:image, title/description va og:url; Telegram/WhatsApp’da preview ko‘rinishi sinovdan o‘tadi. Demo noindex saqlanadi.
- Maqsadlar: yuqoridagi laboratoriya sharoitida kamida 3 yangi o‘lchov, LCP ≤2.5 s tomon yaxshilanish, CLS ≤0.1. Erishilgan raqamlar alohida qayd etiladi, field natijasi deb ko‘rsatilmaydi.
- Fayllar: `Layout.astro`, `Photo.astro`, font importlari, `motion.ts`, kerak bo‘lsa `_headers` va build media skripti.

### G. Yakuniy QA va Netlify
- UZ/RU barcha public sahifalar va admin demo; 320/360/390/430/768/1024/1440 px, landscape, 200% matn, reduced-motion.
- Uzun xizmat nomi/izoh, boshqa nisbatli admin surati, rasm yuklanish xatosi, sekin internet, bo‘sh holatlar.
- Header/menu, gallery/CTA, booking validation, admin drawer/save/preview/reset/lead status; qayta navigation’da ortiqcha event handler bo‘lmasligi.
- Fizik iPhone Safari/Android imkon bo‘lsa keyboard/date picker/safe-area; bo‘lmasa emulyatsiya chegarasi ochiq qayd etiladi.
- Mavjud regressiya testlari, check → build → test; deploy uchun SSR artefakti va public rasmlar tekshiriladi. Faqat zarur yangi regressiya testlari.
- Netlify demo yangilanadi, tashqi/public browserdan asosiy havola va admin ochilishi qayta tekshiriladi.

### H. Taqdimotni yakuniy saytga moslash
- Yangi desktop/mobil/admin screenshotlarni mavjud 6 slaydga almashtirish.
- Sayt va admin QR/havolalari qayta tekshiriladi; $250, mijoz hisobidagi domen/hosting, biznes egasi nomidagi hisoblar, 1 oy bepul servis/o‘rgatish saqlanadi.
- Telegram botning hozirgi demo holati va ishlab beriladigan imkoniyati aralashmaydi.
- Natija: PDF, editable PPTX va bitta ishlaydigan public demo URL.

## 7. Ishga tushirish bilan bog‘liq ochiq ma’lumotlar

Mijozdan keyin tasdiqlanadiganlar: aniq manzil/kirish, ish jadvali, xizmat narxi/davomiyligi, usta ismi/ixtisosligi va tegishli surati, administrator Telegram kontakti yoki botdagi mas’ullar. Bu ma’lumotlarni kutmasdan A/B/D/F va demo UX ishlarini bajarish mumkin; narx, jamoa yoki manzilni taxmin qilib nashr qilish mumkin emas.

Haqiqiy CRM/Telegram ishga tushirish: biznes egasi nomidagi Supabase/hosting/domen/bot, vakolatli administrator chat IDlari, webhook/inline action callback, CRM status tarixi, takroriy xabarlarning oldini olish va retry. Hozirgi notification-worker jadvali 5 daqiqa, oddiy sendMessage bor; tezkor interaktiv bot ishlab bo‘lgan deb ko‘rsatilmaydi. Bu taqdimotda taklif etilgan ishlab chiqish doirasidir, ushbu creative auditda haqiqiy integratsiya bajarilmadi.

## 8. Yakuniy qabul mezonlari

- Birinchi ekran Beauty Me’ga xos, asosiy CTA ko‘rinadi va darhol ishlaydi.
- Galereyada surat tez ko‘rinadi; bo‘sh qora kutish holati yechilgan, katta rasm o‘qiladi.
- Xizmat → yoqqan ish → yozilish yo‘li mavjud.
- Uy sahifasi takroriy kontentdan qisqargan; asosiy matn kesilmagan.
- Tasdiqlangan contact/narx/usta ma’lumotlari ishlaydi; tasdiqlanmagan ma’lumot uydirilmagan.
- Demo egasi sinov so‘rovi, admin status boshqaruvi va rasm/matn preview’ini amalda sinaydi.
- Yangi dizayn barcha belgilangan ekranlarda ishlaydi; console/resurs xatosi yo‘q.
- Tezlik oldin/keyin bir xil sharoitda qayd etilgan.
- Public Netlify va admin demo ochiladi; share preview/QR va slayddagi screenshotlar yakuniy saytga mos.

Amalga oshirish tartibi: A → B → C/D → E → F → G → H. Eng avval rasm ochilishidagi kutish va yozilishdan admin demo’ga uzilish bartaraf qilinadi; keyin kompozitsiya va animatsiyalar yakunlanadi.
