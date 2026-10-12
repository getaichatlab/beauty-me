from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
p=root/'DEPLOYMENT.json';state=json.loads(p.read_text(encoding='utf-8'))
state.update(previous_deploy_id=state['deploy_id'],deploy_id='6ac914a02137679d4dbaca70',version='final-editorial-polish-with-same-tab-demo-journey',published_at='2026-10-09T16:23:17.080Z',verification='test-results/client-polish/verification.json',performance='test-results/client-polish/performance.json')
p.write_text(json.dumps(state,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
for name in ['ADMIN_DEMO_QA.md','NETLIFY_DEMO_DEPLOYMENT.md']:
 p=root/name;s=p.read_text(encoding='utf-8').replace('6ac8cc587693202a4fa4404a','6ac914a02137679d4dbaca70').replace('2026-10-09T11:14:24.062Z','2026-10-09T16:23:17.080Z')
 s=s.replace('qoralamaning qisqa ko‘rinishi','hero, xizmatlar, narxlar, galereya va aloqa bilan qoralama ko‘rinishi').replace('qisqa preview','kengaytirilgan preview')
 s+='''

## Yakuniy sayqal release’i

2026-10-09: editorial hero, yangi copy, bitta foto aksent, ixcham 5 qismli home, manbali review mazmuni va 1200×630 share preview chiqarildi. Galereyada thumbnail darhol ochiladi, to‘liq surat decode’dan so‘ng almashadi; xatoda qayta urinish mavjud. Lightbox tanlangan xizmatni yozilish formasiga uzatadi.

Demo yozilish yakunidagi «Admin demo’da ko‘rish» shu tabda ochiladi. Faqat xizmat, sana, vaqt va texnik ID/sana vaqtincha saqlanadi. Ism, telefon va izoh admin namunaga yoki serverga o‘tkazilmaydi. Admin real shaxs bo‘lmagan «Saytdan demo so‘rov» yozuvini yaratadi. Holatini tasdiqlash mumkin; qayta ochish dublikat yaratmaydi. Demo statistikasi hanuz namuna.

Yakuniy check: 63 fayl, 0 error/warning/hint. Build va 30/30 regressiya testi o‘tdi. 26 public sahifa × 7 kenglik = 182 local layout holati; document overflow, console xatosi va qayd etilgan HTTP resurs xatosi yo‘q. Jonli havolada demo oqimi, 200% matn, landscape lightbox va reduced-motion qayta tekshirildi. Live HTTP: 80 route/asset va 40 font reference; Supabase real API’lari himoyalangan/unconfigured. Batafsil: test-results/client-polish/verification.json va test-results/live-mobile-deployment.json.

Yangilangan taklif: presentation/output/Beauty-Me-Taklif-250-Sayqallangan.pptx va .pdf. 6 slayd; $250, 1 oy bepul servis/o‘rgatish, domen/hosting mijoz hisobidan va biznes egasi nomiga. CRM/Telegram bot paketdagi kelgusi real integratsiya sifatida ko‘rsatilgan; demo botga ulanmagan. Ikkala QR final PPTX va PDF renderlaridan mustaqil skan qilindi.
'''
 p.write_text(s,encoding='utf-8')
perf=json.loads((root/'test-results/client-polish/performance.json').read_text(encoding='utf-8'))
views=json.loads((root/'test-results/client-polish/verification.json').read_text(encoding='utf-8'))['views']
home={v['width']:v['height'] for v in views if v['lang']=='uz' and v['path']==''}
report=f'''# Beauty Me — yakuniy sayqal bajarildi

2026-10-09. Public release: 6ac914a02137679d4dbaca70. Published UTC: 16:23:17.

- Sayt: https://beauty-me-tashkent-demo.netlify.app/uz/
- RU: https://beauty-me-tashkent-demo.netlify.app/ru/
- Parolsiz admin demo: https://beauty-me-tashkent-demo.netlify.app/admin/demo/

## Dizayn va foydalanuvchi oqimi

Hero «Sizga mos obraz. Bir salonda.» bilan salon va hududni tushuntiradi. Classic makeup portreti burgundy rang bilan uyg‘un; bitta manikyur aksenti desktopda, mobil ekran uchun bitta asosiy rasm. Kirish motion’i qisqartirildi, foto ustidagi reveal faqat yengil rang qatlamidir. Native boshqaruvlar GSAP yuklanishiga bog‘liq emas. Desktop navbar ko‘ringanda hamburger yashiriladi.

Home 5 guruhga yig‘ildi: hero, xizmatlar, tanlangan ishlar, salon/ishonch, aloqa/FAQ. Gallery preview 4 kadr, mobil swipe va katta tugmalar bilan. Salon fotosi contain usulida kishilarni kesmasdan ko‘rsatiladi. Alohida katta konsultatsiya bloki va takroriy footer matnlari olib tashlandi. 390 px home balandligi: {home.get(390)} px (avval 3799); 1440 px: {home.get(1440)} px (avval 5366). Bu default matn/yopiq FAQ o‘lchovi, majburiy max-height emas.

Lightbox thumbnailni darhol ko‘rsatadi, katta faylni decode’dan so‘ng almashtiradi. Kechikkan eski rasm yangi tanlov ustiga chiqmaydi; xato holati va qayta urinish bor. Surat kategoriyasi yozilish xizmatini oldindan tanlaydi, interior fotosi salon sahifasiga olib boradi. Landscape dialog ekran ichida qoladi. Fotosiz xizmat sahifalarida ixcham tipografik kompozitsiya ishlatilgan; sun’iy klinika rasmlari qo‘shilmagan.

Narx so‘rash telefon orqali; Telegram havolasi «Telegram guruhi» deb aniq nomlangan. Yandex’dagi Оксана Лаенкова, 18.02.2025 fikri mazmuni manba bilan berildi: https://yandex.com/maps/org/beauty_me/202536941352/reviews/ . Reyting yoki sotuv natijasi uydirilmagan. Salon bloki va review matni adminning Salon matnlari bo‘limidan tahrirlanadi.

## Admin namoyishi

Yozilishning faqat xizmat/sana/vaqt tanlovi shu tabdagi demo paneliga o‘tadi. Ism, telefon va izoh saqlanmaydi. Panel «Saytdan demo so‘rov» namunasini ochadi; holatni tasdiqlash mumkin. Dublikat oldini olish va quota xatosida oldingi holatni saqlash sinovdan o‘tdi. Production request API oqimi o‘zgartirilmagan.

Qoralama preview’da hero, barcha faol xizmatlar, tasdiqlangan narx izohi, 6 surat, mavjud faol jamoa va aloqa/ish vaqti ko‘rinadi. Dashboarddagi bir daqiqalik demo turi ixcham ochiladigan ko‘rsatmadir. Demo nashri public saytni o‘zgartirmaydi.

## Tezlik va tekshiruv

Critical local fontlar preload qilinadi. Hero mobil 480 px variantdan yuklandi. Hashli Astro resurslari immutable, media 1 kun cache bilan chiqarilgan. Open Graph rasm 1200×630, mutlaq URL va lokalizatsiya bor; fayl public HTTP 200.

Bir xil sekin mobil laboratoriya sharoiti: 390×844, CPU 4×, latency 150 ms, download 1.6 Mbps, upload 750 Kbps, har safar yangi context. LCP: {', '.join(str(round(s['lcp']/1000,3)) for s in perf['samples'])} s; median {perf['medianLcpMs']/1000:.3f} s (avval 4.928 s). CLS eng kattasi {max(s['cls'] for s in perf['samples']):.6f}. Server/tarmoq vaqti o‘zgarishi mumkin; bu 3 lab sample, field Core Web Vitals yoki INP natijasi emas.

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
'''
(root/'FINAL_CLIENT_POLISH_COMPLETION.md').write_text(report,encoding='utf-8')
print(json.dumps({'deploy':state['deploy_id'],'homeHeights':home,'medianLcpMs':perf['medianLcpMs']},ensure_ascii=False))
