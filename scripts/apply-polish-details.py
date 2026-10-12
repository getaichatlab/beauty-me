from pathlib import Path
root=Path(__file__).resolve().parents[1]
def edit(name,old,new):
 p=root/name;s=p.read_text(encoding='utf-8');assert old in s,(name,old[:80]);p.write_text(s.replace(old,new),encoding='utf-8')
edit('src/data/content.ts',"aboutTitle:'Момент, который\\nпринадлежит вам.'", "aboutTitle:'Больше, чем образ.'")
edit('src/data/content.ts',"aboutTop:'BEAUTY ME MUHITI'", "aboutReviewText:'Marinaning e’tiborli yondashuvi, istaklarni tinglashi va parvarish maslahatlari alohida ta’kidlangan.', aboutReviewBy:'Оксана Лаенкова · 18.02.2025', aboutReviewSource:'Yandex’dagi fikr mazmuni', aboutProofText:'Yunusoboddagi salon. Sizga mos xizmatni birgalikda tanlash uchun.', aboutTop:'BEAUTY ME MUHITI'")
edit('src/data/content.ts',"aboutTop:'АТМОСФЕРА BEAUTY ME'", "aboutReviewText:'Гостья отмечает внимательность Марины, умение слышать пожелания и советы по уходу.', aboutReviewBy:'Оксана Лаенкова · 18.02.2025', aboutReviewSource:'Пересказ отзыва на Яндекс', aboutProofText:'Салон в Юнусабаде. Чтобы вместе выбрать то, что подходит вам.', aboutTop:'АТМОСФЕРА BEAUTY ME'")
edit('src/components/SalonProof.astro',"{lang==='uz'?'Obrazdan ko‘proq.':'Больше, чем образ.'}",'{t.aboutTitle}')
edit('src/components/SalonProof.astro',"{lang==='uz'?'Yunusoboddagi salon. Sizga mos xizmatni birgalikda tanlash uchun.':'Салон в Юнусабаде. Чтобы вместе выбрать то, что подходит вам.'}",'{t.aboutProofText||initialUi[lang].aboutProofText}')
edit('src/components/SalonProof.astro',"{lang==='uz'?'Marinaning e’tiborli yondashuvi, istaklarni tinglashi va parvarish maslahatlari alohida ta’kidlangan.':'Гостья отмечает внимательность Марины, умение слышать пожелания и советы по уходу.'}",'{t.aboutReviewText||initialUi[lang].aboutReviewText}')
edit('src/components/SalonProof.astro','Оксана Лаенкова · 18.02.2025</p>','{t.aboutReviewBy||initialUi[lang].aboutReviewBy}</p>')
edit('src/components/SalonProof.astro',"{lang==='uz'?'Yandex’dagi fikr mazmuni':'Пересказ отзыва на Яндекс'}",'{t.aboutReviewSource||initialUi[lang].aboutReviewSource}')
edit('src/admin/AdminApp.tsx',"aboutTop:'Salon yuqori izohi'","aboutReviewText:'Mijoz fikrining mazmuni',aboutReviewBy:'Fikr muallifi va sanasi',aboutReviewSource:'Fikr manbasi havola matni',aboutProofText:'Bosh sahifadagi salon izohi',aboutTop:'Salon yuqori izohi'")
print('Final detail refinements applied.')
