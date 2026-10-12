# Beauty Me admin: mobil sayqallash rejasi

Sana: 2026-10-09. Reja amalga oshirildi; o‘zgarishlar, tekshiruv dalillari
va qolgan browser/device chegaralari ADMIN_MOBILE_QA.md’da.

## Maqsad va boshlang‘ich dalil

320–430 px telefonlarda admin o‘qilishi, matnlar ustma-ust chiqmasligi, tugma va
formalar siqilmasligi kerak. Tablet va desktop ham qayta tekshiriladi.
Tekshiruv avval src/styles/admin.css va src/admin/AdminApp.tsx asosida bajarildi.
Quyidagilar koddan topilgan xavf nuqtalari; brauzerda kuzatilgan xatolar deb
ko‘rsatilmaydi:

- Ko‘p yordamchi matnlar 9–11 px; telefon uchun kattalashtirish kerak.
- Mobil menyu 700 px dan pastda ochiladi; undan yuqoridagi tor ekranlarda ham
  yon menyu kontentni qisishi mumkin.
- Sidebar height:100vh, lekin ichki overflow-y yo‘q. Qisqa/landscape ekranda
  pastki modullar va chiqish tugmasi yetib bo‘lmasligi mumkin.
- Mobil menyuda overlay, alohida yopish, Escape va fokus qaytarish oqimi yo‘q.
- Tarix/audit va ranking flex qatorlarida uzun matnlar uchun min-width/wrap
  qoidalari yetarli emas; telefon raqami ham 22 px da tor blokka sig‘masligi mumkin.
- Zayavka summary’sida ism/xizmat/holat/belgi bir flex qatoriga bog‘langan;
  wrap tasodifiy qatorlar hosil qilishi mumkin.
- Checkbox flex elementlari shrink bo‘lishi mumkin; uzun label alohida matn
  elementiga olinmagan.
- Crop preview’da 105/130 px fixed o‘lcham bor; kichik ekran va katta matnda
  preview bloklari moslashishi kerak.
- Toolbar, statistika, quick links, pagination va fayl tanlash eng kichik
  ekranlarda ham ikki ustun yoki qatorni ushlab qolishi mumkin.

## 1. Ekran va holat auditi

Login, MFA/parol tiklash, dashboard, kontent/FAQ/SEO, xizmatlar, rasmlar,
jamoa, zayavkalar, statistika, sozlamalar, tarix va xodimlarni tekshirish.
Har birida bo‘sh, to‘la, uzun matn, yuklanish, xato va disabled holatlarini
ajratish. Test matnlari lokal fixture’da; haqiqiy mijoz/ishchi yozuvi yaratilmaydi.
Cloud-only ekranlar sinov fixture bilan tekshirilsa bu hisobotda ko‘rsatiladi.

Viewportlar: 320, 360, 375, 390, 414, 430, 768, 1024, 1440 px; qisqa ekran va
landscape ham. Shriftni 200% kattalashtirish/zoomda qayta tekshirish.

## 2. Umumiy layout va mobil navigatsiya

Kontent sig‘ishiga qarab drawer breakpointini belgilash; tor tabletga ham
moslash. Grid/flex farzandlariga min-width:0, kerakli joylarda minmax(0,1fr).
Menyuni 100dvh/safe-area bilan moslash, ichki scroll, overlay, yopish tugmasi,
Escape, aria-expanded/controls va fokus qaytarish. Yopiq menyu klaviatura/fokus
uchun faol bo‘lmasin. Menyu ochilganda fon tasodifan bosilmasin.
Haqiqiy overflow manbasini tuzatish; body overflow-x:hidden bilan yashirmaslik.

## 3. Tipografiya va boshqaruvlar

Asosiy mobil matn 14–16 px, yordamchi matn odatda 12–13 px. Input/textarea
matni 16 px; uzun sarlavhalar tabiiy satrga tushadi. Matn bloklariga zarur
wrap/overflow-wrap qoidalari; ism, kontakt, URL va xatoni kesib yo‘qotmaslik.
Bosiladigan maydonlar kamida 44 px; checkbox shrink bo‘lmasin. Saqlash/nashr
va boshqa muhim tugmalar tor ekranda alohida, to‘liq ko‘rinadigan qatorga o‘tsin.
Sticky elementlar kontentni yopmasin; klaviatura ochilganda formaga yetib bo‘lsin.

## 4. Modullarni alohida sayqallash

| Joy | O‘zgarish |
|---|---|
| Login/MFA | Ixcham yuqori brend, to‘liq kenglikdagi forma, QR sig‘ishi |
| Dashboard | Juda tor ekranda bir ustun, raqam va label uchun yetarli joy |
| Toolbar/formalar | Filter/qidiruv/tugmalar izchil satrlar; label/input siqilmasin |
| Xizmat/FAQ/SEO/jamoa | Telefon uchun bir ustun; uzun xizmat nomi va URL o‘qilsin |
| Rasmlar | Bir xil aspect ratio, moslashuvchi grid, uzun nom wrap; crop preview qayta joylashsin |
| Zayavkalar | Summary grid: ism/xizmat alohida, holat/belgi tartibli; detail va telefon sig‘sin |
| Statistika | Davr filtri va funnel moslashsin; uzun manbalar va katta raqamlar siqilmasin |
| Grafik | Zarur ichki scroll faqat grafikda; sana/raqamlar o‘qilsin |
| Sozlamalar | Uzun checkbox matni alohida span; URL, import va file input sig‘sin |
| Tarix/xodimlar | Ism/email, sana/rol va amal tugmalari tor ekranda ketma-ket tushsin |
| Xato/bo‘sh holatlar | Uzun xabar wrap; ekran chetiga chiqmasin |

## 5. Real layout va funksional tekshiruv

Imkon bo‘lsa Browser MCP bilan screenshot va DOM o‘lchamlarini tekshirish:
document scrollWidth viewportdan oshmasin, asosiy bloklar bir-birini qoplamasin,
menyu/forma/kartalar ko‘rinsin. Intentional grafik ichki scroll’i alohida.
Uzun UZ/RU matnlar, email/URL, ko‘p xodimlar va katta statistik raqamlar bilan
stress tekshiruv. jsdom layout hisoblamaydi; u vizual tasdiq o‘rniga qo‘llanmaydi.
Browser MCP yana ishlamasa koddagi tekshiruv va real vizual dalilni alohida
ko‘rsatish; bajarilmagan ekran sinovini “o‘tdi” deb belgilamaslik.

Menyu ochish/yopish, label bosish, saqlash/nashr, upload, lead filter/holat,
pagination va desktop navigatsiyasi regression tekshiruvi. Astro check,
build va mavjud testlar; yangi test faqat o‘zgargan muhim xatti-harakat uchun.

## 6. Topshirish

O‘zgargan responsive uslublar, zarur React markup/drawer xatti-harakati,
tekshiruv hisobotini ADMIN_MOBILE_QA.md’da saqlash; manba ZIP’ni yangilash.
Asosiy fayllar: src/styles/admin.css, src/admin/AdminApp.tsx; zaruratga qarab
src/pages/admin/index.astro va testlar. Rang/brend yo‘nalishi davom etadi.

Qabul mezoni: tekshirilgan viewportlarda sahifa yon tomonga chiqmaydi; uzun
matnlar ustma-ust emas va yo‘qolmaydi; muhim boshqaruvlar ko‘rinadi/bosiladi;
qisqa ekranda menyu oxiriga yetish mumkin; desktop va mavjud amallar ishlaydi.
Reja mobil sayqallash doirasida: Supabase yaratish yoki live deploy alohida.
