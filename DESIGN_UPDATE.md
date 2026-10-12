# Beauty Me — Creative v3

Holat: 2026-10-08 Netlify production demo yangilandi.
Live: https://beauty-me-tashkent-demo.netlify.app/uz/
RU: https://beauty-me-tashkent-demo.netlify.app/ru/
Preview: http://127.0.0.1:4321/uz/?v=3
Paket: beauty-me-creative-v3.zip
Deploy: 6ac78e65b5e4b54ed77428e5

Reja: CREATIVE_REDESIGN_PLAN.md. Amaldagi asosiy dizayn:
- Ivory/wine ranglar, lokal serif/sans shriftlar va uch suratli hero.
- GSAP SplitText satr niqobi, surat pardasi va ketma-ket kirish.
- Xizmat tanlash bilan foto/tavsif almashishi; mobil ikki ustunli tanlov.
- Astro ClientRouter sahifa o‘tishi va xizmatning shared image transition’i.
- Balandligi cheklangan galereya, animatsiyali filter va lightbox.
- Native dialog menyu, yengil desktop parallax, button hover va booking bosqichlari.
- Har bir navigatsiyada listener/animatsiya tozalash va qayta ishga tushirish.
- Reduced-motion va JavaScript ishlamaganida ko‘rinadigan asosiy kontent.

Faol CSS: src/styles/tokens.css + creative.css. Eski global.css/polish.css
import qilinmaydi. Motion: src/lib/motion.ts. Lokal shriftlar @fontsource.

Check xatosiz, build 28 sahifa, test 13/13 va rebrand 28 sahifa o‘tdi.
Live HTTP/asset/font, noindex, 302 va 404 tekshiruvi o‘tdi.
Brauzerning Windows sandbox texnik xatosi sabab ekrandagi vizual tekshiruv,
real animatsiya ravonligi va Lighthouse o‘lchovi bajarilmadi. Figma maketi
alohida yaratilmagan; dizayn ishlaydigan kod prototipida amalga oshirildi.
Batafsil dalillar va chegaralar: QA_REPORT.md.