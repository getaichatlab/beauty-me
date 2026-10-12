# Beauty Me admin — ishga tushirish

## Hozir tayyor bo‘lgan lokal rejim

Admin: http://localhost:4322/admin/
Sayt: http://localhost:4322/uz/
Kirish ma’lumotlari: LOCAL_ADMIN_ACCESS.md. Bu maxfiy lokal fayl; tarqatmang.

```powershell
node scripts/setup-local-admin.mjs
npm run dev -- --host localhost --port 4322
```

Lokal admin faqat development va localhost’da ishlaydi. Qoralama, published
kontent, zayavka, audit va eventlar `.local-admin/state.json` ichida saqlanadi.
Rasm variantlari `.local-admin/media` ichida. Serverni qayta ochish saqlangan
ma’lumotlarni o‘chirmaydi. Bu fayllar production backend o‘rnini bosmaydi va
Netlify serverida lokal rejim yoqilmaydi.

Oddiy jarayon: Rasmlar → yuklash → nom/alt/kategoriya/kesim → Saqlash →
Qoralamani ko‘rish → Nashr qilish. Kontakt/xizmatlar ham xuddi shunday.
Haqiqiy forma va tracking standart holatda o‘chiq. Ularni Sozlamalardan yoqib,
maxfiylik matni va salonning so‘rovga javob berish tartibini tasdiqlang.

## Supabase’ni ulash

1. O‘zingizning Supabase akkauntingizda yangi loyiha yarating.
2. SQL Editor’da `supabase/migrations/` fayllarini ketma-ket bajaring:
   `001_admin.sql` → `002_reports.sql` → `003_notifications.sql` →
   `004_bootstrap.sql` → `005_owner_mfa.sql`. Birinchi migratsiya yangi,
   bo‘sh loyiha uchun; uni mavjud bazaga takroran ko‘chirib ishlatmang.
3. Authentication → Users orqali owner hisobini yarating va parolini belgilang.
   Ochiq sign-up’ni o‘chiring. Login email’ini admin egasi sifatida saqlang.
4. `.env.example` dan `.env` yarating. Project URL, anon/publishable kalit,
   server service-role kalit va ADMIN_SITE_ID’ni kiriting. Privileged kalitni
   `PUBLIC_` prefiksi bilan nomlamang; chatga, ZIP’ga yoki brauzerga yozmang.
5. Faqat import uchun `.env` ga `ADMIN_OWNER_EMAIL` qo‘shing.
6. `node scripts/import-supabase.mjs` ishlating. Script mavjud kontentni
   almashtirishdan bosh tortadi. Birinchi seed va owner membership yaratiladi.
7. Supabase Authentication URL Configuration’da lokal va Netlify `/admin/`
   manzillarini ruxsat etilgan redirect URL’lariga kiriting. Tiklash/taklif
   email’lari va SMTP yetkazilishini sinang.
8. Development serverni qayta ishga tushiring. Panel “Supabase ulangan”
   ko‘rsatishi, owner login va rasm yuklash/nashr ishlashi kerak.
9. Sozlamalar → 2FA sozlash orqali authenticator qo‘shing, QR’ni skanerlang
   va olti raqamli kodni tasdiqlang. Keyingi login’da kod so‘raladi. Faktor
   tasdiqlangach AAL1 sessiya ham API, ham DB siyosatida kontent/mijoz
   ma’lumotlariga kira olmaydi. Hisob tiklash tartibini loyiha egasi belgilaydi.

Import boshlang‘ich Beauty Me kontentini yuklaydi. Lokal test zayavkalari,
statistika va parol cloud’ga ko‘chirilmaydi. Lokal tahrirlarni ko‘chirish uchun
Sozlamalardan kontent shablonini eksport qiling; yangi adminida qoralamaga
import qiling. Lokal upload rasmlari qayta yuklanadi. Tekshirgach nashr qiling.

Netlify Project → Environment variables’da SUPABASE_URL, SUPABASE_ANON_KEY,
SUPABASE_SERVICE_ROLE_KEY, ADMIN_SITE_ID va PUBLIC_CONTENT_MODE=dynamic sozlang.
PUBLIC_CONTENT_MODE build paytida kerak; shunda public sahifalar bazadan
serverda chiqariladi. Qolgan server kalitlari Functions runtime’da ham mavjud
bo‘lsin. Yangi build qiling. Faqat `dist` ZIP’ni Drop’ga tashlash backendning
function/env/database qismlarini to‘liq o‘rnatmaydi.

Git deploy: Build command `npm run build`, Publish directory `dist`. Astro
adapter server functionini yaratadi; `netlify/functions/notification-worker.mjs`
alohida scheduled function. Mavjud `beauty-me-tashkent-demo` loyihasidan
foydalaning; avval Deploy Preview, keyin production deploy. Node 22.12+
yoki 24 ishlating; lokal testlar Node 24’da bajarildi.

Cloud sinovi: ikki brauzerda qoralama/nashr farqi; yangi xizmat URL’i;
UZ/RU matnlar; rasm variantlari; 2FA va uch rol chegaralari. Request rejimida
bitta sinov zayavka va qayta yuborishdagi idempotency’ni tekshiring. Analytics
roziligi/rad etishni alohida sinang. Nashrdan keyin 30–60 soniyada yangi public
so‘rovni tekshiring. Sinov zayavkasini Spam deb belgilang.

Hozir hech qanday Supabase loyihasi ulanmagan. Cloud kirish, email yetkazish,
Storage/RLS va haqiqiy salon ma’lumotlari cloud’da ishlagani da’vo qilinmaydi.

## Ruxsatlar

Owner barcha modullarni ko‘radi va nashr qiladi. Editor faqat kontent va
rasmlarni tahrirlaydi; lead/analytics ko‘rmaydi. Manager lead/analytics bilan
ishlaydi; kontent tahriri/nashrga kira olmaydi. Xodim taklifi Supabase’da
email orqali; tiklash/taklif havolasidan yangi parol belgilanadi. Email
havolasi session tokenlarini URL hash’dan server cookie’lariga almashtiradi.

Admin/API/preview javoblari no-store. Public sahifa cache’i 30 soniya, yangi
nashr shundan keyin yangi so‘rovlarda ko‘rinishi kutiladi. Suratlar UUID bilan
yangi URL oladi; ishlatilmayotgan upload faqat login bilan ochiladi.

## Zayavka va statistika

Forma demo bo‘lsa mijoz ma’lumoti API’ga yuborilmaydi. Request yoqilsa server
tekshiruvi, rozilik, idempotent requestId va doimiy saqlash ishlaydi. Telegram
bosilishi haqiqiy yozishma/obunani bildirmaydi. Analytics faqat foydalanuvchi
ruxsati bilan yig‘iladi; admin/preview va tanilgan botlar hisobga olinmaydi.
Sessiya 30 daqiqa; vaqt hisoblari Asia/Tashkent. Ism/telefon eventlarga kirmaydi.
Panel 50 tadan zayavka chiqaradi; qidiruv/holat serverda ishlaydi. CSV barcha
sahifalarni oladi, 1000 yozuv bilan cheklanmaydi. Statistika tanlangan davrni
DB RPC orqali hisoblaydi; faqat rozilik bergan sessiyalar kuzatiladi.

Telegram bildirishnomasi ixtiyoriy. Salon administrator chati tayyor bo‘lgach
Netlify Functions muhitiga `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` qo‘shing.
Bot guruh/kanalga kerakli ruxsat bilan qo‘shilsin. Worker har 5 daqiqada 20
tagacha zayavka yuboradi, xatoni besh urinishgacha qaytaradi. Token/chat yo‘q
bo‘lsa yubormaydi. Scheduled function faqat published deploy’da avtomatik
ishlaydi. Xabar yuborilib, DB tasdig‘i saqlanmagan holatda takrorlanishi mumkin;
matndagi so‘rov ID bilan ajrating. Hozir real Telegram xabari yuborilmagan.

## Sinov va saqlash

```powershell
npm run check
npm run build
npm test
node scripts/test-admin-http.mjs
```

HTTP testi 4322 portidagi lokal development serverni talab qiladi va test
oldidagi state faylini tiklaydi. Cloud konfiguratsiya mavjud bo‘lgan muhitda
bu lokal testni ishlatmang. Sinov yozuvlari real mijozlar emas.

`node scripts/backup-admin.mjs` backup’ni `.local-admin/backups/<vaqt>/` ichida
yaratadi. `COMPLETE.txt` borligini tekshiring; u yo‘q bo‘lsa backup tugamagan.
Lokal rejimda state/media, Supabase ulanganda saytning DB jadvallari/private
Storage rasmlari olinadi. Papka mijoz ma’lumotlarini saqlaydi; yopiq joyga nusxa
oling. Parol/token/auth hisoblari paketga kirmaydi. Avtomatik backup jadvali yo‘q.

Lokal restore: serverni to‘xtating, joriy state/media’ning alohida nusxasini
oling; backup state/media’ni o‘z joyiga ko‘chiring. `credentials.json` va kirish
fayliga tegmang. Serverda kontent/rasm/zayavkani tekshiring. Cloud restore
scripti yo‘q: avval alohida test Supabase’da DB va Storage tiklashini isbotlang.
Kontent versiyasini qaytarish DB/media backup o‘rnini bosmaydi.

## Hali production uchun zarur tekshiruvlar

- Supabase credentials/migratsiya/owner import va cloud RLS/Storage smoke testi.
- Real brauzerda mobil/desktop admin va sayt regression.
- Owner 2FA DB siyosati lokal PostgreSQL’da tekshirildi; haqiqiy Auth/Storage
  va email jarayonida qo‘shimcha sinov kerak.
- Avtomatik backup, cloud restore mashqi, analytics retention/tozalash jadvali.
- Salon tasdiqlagan privacy matni, real notification chat va worker sinovi.
- npm audit: 13 ta high transitiv ogohlantirish qolgan; critical 0.
  Tafsilotlar ADMIN_IMPLEMENTATION.md’da.

Bu cheklovlar tugamaguncha panelni real mijozlar bilan production’ga topshirish
yakunlangan deb hisoblamang. Lokal funksional panel va cloud ulanish kodi tayyor;
production ulanish va yuqoridagi mustahkamlash ishlari alohida tekshiriladi.

Rasmiy qo‘llanmalar: [Astro environment variables](https://docs.astro.build/en/guides/environment-variables/),
[Supabase MFA](https://supabase.com/docs/guides/auth/auth-mfa),
[Netlify scheduled functions](https://docs.netlify.com/build/functions/scheduled-functions/).
