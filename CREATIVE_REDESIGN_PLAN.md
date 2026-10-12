# Beauty Me — creative redesign v3

Sana: 2026-10-08. Holat: bajarish uchun dizayn va animatsiya rejasi.
Bu hujjat yangi dizayn allaqachon qurildi yoki brauzerda tekshirildi degani emas.
Vazifa: Tashkent Beauty Me uchun esda qoladigan, qulay, sotishga tayyor demo;
keyinchalik boshqa salon nomi, xizmatlari va suratlariga moslashtirish mumkin.

## 1. Hozirgi holat va aniq muammo

Kod tahlili: Astro statik sayt, UZ/RU, 13 ta mahalliy WebP surat, xizmatlar,
galereya, aloqa, demo yozilish. Hozirgi uslub: krem fon, serif sarlavha,
burgundy tugmalar, yumaloq kartalar va uch suratli hero.

Mavjud harakatlar: hero fade/translate, kartada zoom/lift, IntersectionObserver
reveal, bitta belgi aylanishi. Sahifalar orasida maxsus transition yo‘q.
Matn satrlarining maskali ochilishi, xizmat tanlash bilan bog‘langan foto sahna,
suratning kartadan xizmat sahifasiga o‘tishi va yaxlit motion timeline yo‘q.
Takrorlanadigan kartalar sabab bo‘limlarning ko‘rinishi bir-biriga o‘xshash.
`global.css` va `polish.css` o‘rtasida ko‘p override bor; v3 da birlashtiriladi.

Bu xulosalar kod va foydalanuvchi fikriga asoslangan. Joriy brauzer vizual
auditi bajarilmadi: CUA documentation-rewrite talabi bajarishga urinishda
kernel `setup refresh had errors` bilan to‘xtadi. Avtomatik tekshiruv avval
shu prerequisite bajarilmagani uchun lokal preview ochishni rad etdi.
Rejani tayyorlash va kodni o‘qish bu texnik to‘siqqa bog‘liq emas.

## 2. Tanlangan vizual yo‘nalish

Yo‘nalish: zamonaviy moda jurnalining kompozitsiyasi va salon portfoliosi.
Asosiy tuyg‘u: o‘ziga ishonch, uslub, shaxsiy parvarish. Xizmatlar ichida
erkaklar soch/barber ishlari ham yo‘qolib ketmaydi.

Hero uchun taklif: “Sizga xos. / Go‘zallik.” RU: “Красота. / В вашем стиле.”
Mazmunli CTA: “Qabulga yozilish”; ikkinchi harakat: “Ishlarni ko‘rish”.
Telefon, manzil va demo holati ko‘rinadigan va tushunarli bo‘ladi.

Palette: ivory #F4EEE6, burgundy #4B182A, graphite #191819,
blush #D7B6B0, chrome #B8B6B5. Chrome — ingichka chiziq va kichik detal uchun;
asosiy matn kontrasti alohida o‘lchanadi. Yorug‘ va to‘q bo‘limlar navbatlashadi.

Tipografiya: katta kontrastli serif + toza sans. Bir sarlavhadagi bitta urg‘u
so‘zi italic; barcha matn bir xil katta qilinmaydi. Desktop display 72–108 px,
mobil 42–56 px; body 14–16 px, kichik metadata kamida 11–12 px.
O‘zbek va rus harflari to‘liq tekshiriladi. Mavjud shriftlar avval sinaladi;
o‘zgaradigan bo‘lsa lokal WOFF2, kerakli vaznlar va mos litsenziya tanlanadi.

Kompozitsiya: 12 ustunli desktop grid, 4 ustunli mobil grid. Hero surat va
tipografiyani qisman ustma-ust joylashtiradi, lekin matnning o‘qilishi va
suratdagi yuz/soch/tirnoqning ko‘rinishi saqlanadi. Bo‘limlar bir xil karta
gridi bo‘lmaydi: hero sahna → xizmat tanlash → portfolio → salon hikoyasi →
yozilish CTA → FAQ va aloqa. Katta suratlar o‘lchami belgilangan.

## 3. Namuna va Beauty Me uchun olinadigan jihat

| Namuna | Tasdiqlangan jihat | Beauty Me uchun qaror |
|---|---|---|
| Maggie Rose, Victor Work, 2020 | Dizayner portfolio sahifasida Awwwards Site of the Day, Developer Award va Mobile Excellence keltirilgan. Awwwards arxiv taqdimotida yaqin portret va katta Maggie yozuvi bor. | Surat va display sarlavha birga asosiy kompozitsiya hosil qiladi. Bu tarixiy reference, 2026 trend reytingi emas. |
| Rossano Ferretti Hair Spas | Rasmiy sahifada salon tajribasi, individual konsultatsiya, kesim, rang va parvarish alohida hikoya qilingan. | Xizmat nomidan tashqari foydalanuvchiga tanlovni tushuntiradigan qisqa hikoya va mos ish namunasi. |
| Hershesons | Rasmiy salon sahifasida joylashuvlar, Hair Stories va Book Now yo‘li mavjud. | Portfolio ko‘rayotgan odam uchun yozilish yo‘li doim oson topiladi. |

Yuqoridagi saytlarning jonli animatsiyalari brauzerda ko‘rilmagan.
Maska, parallax va sahifalar transition’i quyidagi o‘z dizayn takliflarimiz;
ular aynan shu saytlar ishlatadigan effektlar deb da’vo qilinmaydi.

Manbalar:
- https://victor.work/recognitions/
- https://assets.awwwards.com/awards/gallery/2020/11/live-presentation-aude-fred-richard.pdf
- https://www.rossanoferretti.com/salons/
- https://www.hershesons.com/pages/salons

## 4. Ochilish ssenariysi — birinchi 1.2 soniya

Animatsiya sun’iy kutish oynasi yaratmaydi. Kontent va CTA foydalanuvchiga
darhol ochiq; vaqtlar boshlang‘ich dizayn qiymatlari, qurilmada sinab sozlanadi.

| Vaqt | Harakat |
|---|---|
| 0–250 ms | Header va kichik salon metadata joyida ochiladi. |
| 100–750 ms | Asosiy surat ustidagi burgundy/ivory niqob chetga surilib, suratni ochadi. Surat 1.06 dan 1.00 scale’ga keladi. |
| 180–900 ms | Hero sarlavha satrlari pastdan niqob ichidan ko‘tariladi. Har satr oralig‘i 80–110 ms; italic urg‘u yakunda ochiladi. |
| 500–1000 ms | Ikki qo‘shimcha ish namunasi qarama-qarshi tomondan 12–20 px siljib joylashadi. |
| 700–1150 ms | Qisqa tavsif va foto caption ochiladi; CTA allaqachon ishlaydi. |

Qayta kirishda qisqaroq 400–650 ms variant. Hero rasm decode yoki shrift
kechiksa ssenariy sahifani yopib turmaydi. JavaScript xatosida matn va suratlar
ko‘rinadigan oddiy holat qoladi. Animatsiya kutib qolsa kontentni ochadigan
fail-open chegarasi bo‘ladi. Formaga, telefon va tashqi havolalarga bosish
animatsiya tugashiga bog‘lanmaydi.

## 5. Butun saytning motion xaritasi

| Joy | Creative yechim | Davomiylik va xulq |
|---|---|---|
| Hero | Maskali foto + satrma-satr text reveal; cheklangan foto chuqurligi | Ochilish 0.7–1.2 s; desktop scroll’da surat 20–35 px. |
| Xizmatlar | Bir tomonda xizmatlar ro‘yxati, boshqa tomonda o‘zgaradigan foto/tavsif | Hover va klaviatura focus’da 300–450 ms crossfade/maska. Tanlovga tegishli CTA. |
| Xizmat sahifasi | Tanlangan kartadagi surat yangi sahifadagi hero joyiga ko‘chadi | Shared image transition 350–500 ms; oddiy navigation fallback. |
| Portfolio | Teng o‘lchamli foto kadrlari navbat bilan ochiladi; kompozitsiyada yengil offset | 500–700 ms reveal, 60–90 ms stagger. Surat tarkibi kesilib yo‘qolmaydi. |
| Galereya filtri | Kartalar yangi joyiga silliq ko‘chadi; mos kelmaydiganlar chiqadi | 200–350 ms. Natijalar soni va keyboard focus boshqariladi. |
| Lightbox | Qora fon yumshoq ochiladi; tanlangan surat joyidan kattalashish taassuroti | 250–350 ms; prev/next 180–250 ms. Butun surat contain; ichki scroll yo‘q. |
| Salon hikoyasi | Foto yonidagi sarlavha va qisqa mazmun scroll bilan birga ochiladi | Bir qisqa desktop sticky sahna, ko‘pi bilan ~0.6 ekran scroll; mobil oddiy oqim. |
| Menyu | To‘q editorial panel; linklar ketma-ket ochiladi | 250–450 ms; Escape, focus trap, focus return. |
| Tugmalar | Rang qatlami kirishi va o‘qning silliq siljishi | 160–220 ms; yengil magnet faqat aniq pointer’da, 4–6 px chegarada. |
| Yozilish | Bosqich kontenti almashishi, tanlov chip’i va progress chizig‘i | 200–300 ms; xato matni bir zumda, fokus yangi bosqich sarlavhasida. |
| Bo‘lim chegarasi | Ivory → burgundy fon almashuvi va katta dekorativ so‘z | Oddiy opacity/transform; mazmun ustiga chiqmaydi. |
| Footer | Kontaktlar va katta wordmark yakuniy kompozitsiya | 400–600 ms kirish; telefon va xarita har doim bosiladi. |

Bitta sahnada bitta asosiy harakat. Hover talab qiladigan ma’lumot touch’da
tap/focus bilan ochiladi. An’anaviy cursor saqlanadi; surat ustida qo‘shimcha
kichik “Ko‘rish” belgisini sinash mumkin. Avtomatik video yoki tez-tez
almashadigan hero slaydlar bazaviy rejaga kiritilmaydi: mavjud media — suratlar.

## 6. Sahifalar bo‘yicha yangi tuzilish

Home: intro sahna → mavjud xizmatlardan tanlash → 6 tanlangan ish → salon
hayoti fotosi va qisqa hikoya → consultation CTA → FAQ → kontakt.

Xizmatlar katalogi: editorial sarlavha, 6 xizmat uchun interaktiv ro‘yxat va
foto sahna, tegishli xizmat sahifasiga o‘tish. Narx tasdiqlanmagan bo‘lsa
“Narxni aniqlashtirish” havolasi.

6 xizmat tafsiloti: umumiy uslubdagi hero, mavjud yo‘nalishlar, shu xizmatning
haqiqiy ishlari, FAQ, tegishli xizmat oldindan tanlangan yozilish havolasi.
Foto yo‘q xizmatlarda chiroyli tipografik kompozitsiya ishlatiladi; boshqa
xizmatning surati o‘sha xizmat natijasi sifatida ko‘rsatilmaydi.

Galereya: portfolio sarlavhasi, hair/nails/makeup va mavjud boshqa category
filtrlari, teng kadrlar, butun suratni ko‘rsatadigan lightbox. Erkaklar soch
ishlari hair ichida ko‘rinadi. Photo crop alohida focus bilan boshqariladi.

Salon: haqiqiy salon hayoti fotosi va tasdiqlangan mazmun. Soxta staff
portretlari, tajriba yillari, mukofot yoki mijoz fikrlari qo‘shilmaydi.

Aloqa: o‘qilishi oson manzil, telefon, xarita, Instagram, Telegram va manzil/
ish vaqtini aniqlashtirish matni. Kontakt blokida decorative harakat kam.

Yozilish: 3 bosqichli demo oqim, tanlov kartalari, bosqich o‘tishlari. Demo
yuborish salon buyurtmani qabul qildi degan ma’noni bermaydi; ism/telefon
saqlanmaydi va yuborilmaydi. Privacy va 404 ham umumiy dizayn bilan mos.
UZ/RU jami mavjud 28 HTML sahifa qamrab olinadi.

## 7. Rasm va mobil qoidalari

13 mavjud Beauty Me Instagram surati ishlatiladi. Telegram suratlari oldingi
qarorga ko‘ra keyin qo‘shiladi. Post manbalari saqlanadi. Har bir suratga
hero/portfolio/service/interior roli va crop focus tayinlanadi. Asl rasm yoki
suv belgisi o‘zgartirilmaydi. WebP variantlar texnik optimallashtiriladi.

Desktop hero fotosi 380–520 px, qisqa ekranlarda 360–430 px. Bu boshlang‘ich
chegaralar; hero matni bilan birga turli viewport balandliklarida tekshiriladi.
Mobil hero fotosi 260–340 px; keraksiz bo‘sh joy qisqartiriladi. Galereya kartalari
bir breakpoint ichida bir xil 3:4 yoki 4:5 nisbatda, balandlik chegarasi bilan.
Desktop 3–4 ustun, mobil 2 ustun; juda tor ekranda caption sig‘ishiga qarab
1 ustun variant sinaladi. Lightbox balandligi ≤85–90dvh; surat contain.

360/390/430/768/1024/1440 px kenglik, 600/800/900 px balandliklarda tekshirish.
Suratlar tabiiy o‘lchami blok balandligini boshqarmaydi. Sahifa gorizontal
scroll qilmaydi. Mobile sticky call/book paneli kontent, formaning oxirgi
tugmasi yoki ochilgan klaviatura bilan to‘qnashmaydi.

Mobil motion: text reveal 350–650 ms, foto siljishi ≤12 px, sticky/pin va
cursor/magnet effektlari o‘chadi. Reduced-motion’da dekorativ harakatlar
o‘chadi, barcha mazmun va harakatlar mavjud qoladi.

## 8. Texnik yechim va vositalar

Astro saqlanadi. Aniq sahnalar uchun GSAP timeline, SplitText line mask va
ScrollTrigger; mayda effektlar CSS. `gsap.matchMedia()` breakpoint va
reduced-motion holatlarini boshqaradi. Har bir elementni alohida animatsiya
qilish o‘rniga sahna bo‘yicha koordinatsiya ishlatiladi.

Sahifalar o‘tishi uchun Astro ClientRouter + View Transitions baholanadi.
Astro versiyasi lokal 5.x bilan mos API tekshiriladi; yangi major versiya faqat
effekt qo‘shish uchun kiritilmaydi. Menu, Gallery, Booking scriptlari
`astro:page-load` orqali qayta ishga tushadi; `astro:before-swap` da timeline,
observer, listener va scroll lock tozalanadi. Browser back/forward, hash,
til almashtirish, query service va deep link testlari shart. Qo‘llab-quvvatlanmagan
brauzerlarda odatiy link va ko‘rinadigan kontent qoladi.

Taklif etilgan fayl tuzilishi:
- `src/styles/tokens.css` — palette, type, spacing, image frames, easing.
- `src/styles/global.css` — birlashtirilgan bazaviy va responsive uslublar.
- `src/lib/motion.ts` — init/destroy, matchMedia va umumiy timeline.
- `src/components/HeroStage.astro` — intro va foto kompozitsiyasi.
- `src/components/ServiceExplorer.astro` — xizmatga bog‘langan foto sahna.
- `src/components/PortfolioPreview.astro` — home ish namunalari.
- `src/components/Gallery.astro` — filter layout va lightbox.
- `src/layouts/Layout.astro` — navigation, transition lifecycle va menyu.
- `src/config/design.ts` — theme va effekt kuchi; rebranding uchun.

Vositalar taqsimoti: web MCP — reference va rasmiy docs; competitive-brief —
namunalarni taqqoslash; frontend-ui-state-fixer — mavjud funksiyalarni saqlab
UI qurish; Figma MCP — keyingi bosqichdagi desktop/mobil maket va motion
storyboard; CUA — jonli vizual/interaktiv QA; rasmiy Netlify CLI — mavjud
loyihaga deploy. Figma amallari oldidan tegishli majburiy skill o‘qiladi.
Ulanmagan tool, bajarilmagan prototype yoki ko‘rilmagan animatsiya haqida
bajarildi deb aytilmaydi. Salon suratlari uchun AI tasvir generatsiyasi kerak emas.

Rasmiy texnik manbalar:
- https://gsap.com/docs/v3/Plugins/SplitText/
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- https://docs.astro.build/en/guides/view-transitions/

## 9. Bajarish bosqichlari va har birining natijasi

| Bosqich | Ish | Yakuniy natija va o‘tish mezoni |
|---|---|---|
| 1. Audit | Brauzer tiklangach har sahifa, 13 media va UZ/RU copy audit | Desktop/mobil baseline, crop jadvali, muammolar ro‘yxati; mavjud ishlar saqlangan nusxa. |
| 2. Art direction | Palette, type, kompozitsiya, logo qo‘llanilishi | 1440 va 390 px hero hamda xizmat/galereya maketlari; matn va yuzlar o‘qilishi tasdiqlangan. |
| 3. Motion prototip | Intro, service explorer, bitta page transition | Uch signature effekt qayta ko‘riladigan ishlaydigan namuna; CTA darhol ishlaydi. |
| 4. Dizayn bazasi | CSS override’larni birlashtirish, yangi komponentlar | Bir xil token/spacing/image tizimi; eski va yangi uslublar urishmaydi. |
| 5. Home | Barcha home sahnalarini yangi ritmda qurish | Hero’dan aloqa blokigacha uyg‘un ko‘rinish; barcha rasmlar bounded. |
| 6. Ichki sahifalar | Katalog, 6 xizmat, gallery, about/contact/booking/privacy/404 | Ikki tildagi 28 sahifa bir xil creative yo‘nalishda. |
| 7. Lifecycle | Router, dialog, menu, form, animatsiya cleanup | Qayta navigation va Back/Forward’da takror listener, bo‘sh ekran yoki yopishgan scroll yo‘q. |
| 8. Mobil va tezlik | Touch variantlar, photo srcset, lokal font, JS/bundle sozlash | Gorizontal overflow yo‘q; sekin tarmoq/JS xatosida kontent ochiq. |
| 9. QA | Vizual walkthrough, keyboard, reduced-motion, funksional test, rebrand | Har breakpoint screenshot, test hisobot, tekshirilgan ishlaydigan demo. |
| 10. Deploy | Mavjud Netlify loyihaga yangi deploy; anonim HTTP va browser tekshiruv | Shu URL’da yangi versiya, to‘g‘ri assetlar, noindex va tayyor rollback. |

Bosqich 3 kreativlikni erta isbotlaydi: u ishlamaguncha barcha sahifalarga
oddiy fade effektini tarqatish bilan cheklanilmaydi. Avval statik kompozitsiya
yaxshi chiqadi, keyin motion unga qo‘shiladi. Figma yoki prototip avtomatik
tasdiq talab qiladigan alohida to‘xtash emas; mavjud vazifa doirasida quriladi.

## 10. Qabul qilish mezonlari

Creative: birinchi ekranda o‘ziga xos matn/foto kompozitsiyasi; uch signature
sahna ishlaydi; ichki sahifalar oddiy template taassurotiga qaytmaydi.
Funksional: yozilish, category filtering, dialog next/prev/Escape/focus,
mobile menu, UZ/RU, telefon/xarita/social va deep linklar qayta tekshiriladi.

Vizual: ortiqcha ulkan yoki tasodifan mayda rasmlar yo‘q; foto yuz, soch va
tirnoq kesilishi qo‘lda ko‘riladi; matn ustiga effekt chiqmaydi; ortiqcha
bo‘shliq va qulay bo‘lmagan ichki scroll yo‘q. Desktop/mobil screenshot shart.

Tezlik maqsadi: mobil Lighthouse performance ≥90, LCP ≤2.5 s, CLS ≤0.1,
qo‘shimcha JS uchun dastlabki gzip budjeti ≤100 KB. Laboratoriya sharoiti
hisobotda yoziladi; bu hozir o‘lchangan natijalar emas. INP ≤200 ms — keyingi
real foydalanish maqsadi; kichik demo Lighthouse o‘lchovi bilan da’vo qilinmaydi.
Animatsiyada transform/opacity ustun; blur faqat kichik dekorativ qatlamda.

Kontent: haqiqiy salon suratlari, manbalar, aniq demo holati; soxta reyting,
ustalar, tasdiqlanmagan narx va mijoz fikrlari yo‘q. Har bir rasmga alt matn.
Rebrand test: salon nomi, aloqa, media va theme almashganda eski ma’lumot
qolmaydi; foto bo‘sh bo‘lsa tipografik fallback ishlaydi.

Deploy: hozirgi Netlify URL saqlanadi. CLI OAuth hali tasdiqlanmagan bo‘lsa
tayyor lokal preview/ZIP saqlanadi; yangi anonymous loyiha yaratilmaydi.
Vizual QA va deploy bajarilmagan bo‘lsa ular yakunlandi deb belgilanmaydi.
