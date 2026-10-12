export type MediaCategory = 'hair' | 'nails' | 'skin' | 'brows' | 'makeup' | 'massage' | 'interior';
export type MediaItem = {id:string;src:string;src480?:string;sourceUrl:string;viaProfile?:string;category:MediaCategory;title:{uz:string;ru:string};alt:{uz:string;ru:string};width:number;height:number;focus?:string;active?:boolean;};
// Curated from the salon profile. Rebuild with node scripts/build-media.mjs.
export const media:MediaItem[] = [
  {
    "id": "evening-look",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/p/CcFKW_1M_D0/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "makeup",
    "title": {
      "uz": "Kechki obraz",
      "ru": "Вечерний образ"
    },
    "alt": {
      "uz": "Beauty Me postidagi oltin tusli ko‘z makiyaji va to‘lqinli sariq sochli obraz",
      "ru": "Образ из публикации Beauty Me: золотистый макияж глаз и светлые волнистые волосы"
    },
    "focus": "50% 28%",
    "src": "/media/evening-look.webp",
    "width": 1440,
    "height": 1615
  },
  {
    "id": "nude-manicure",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/p/Cy5LA8RtpaV/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "nails",
    "title": {
      "uz": "Nude manikyur",
      "ru": "Нюдовый маникюр"
    },
    "alt": {
      "uz": "Beauty Me profilida chop etilgan jigarrang va oq qoplamali bodomsimon tirnoqlar",
      "ru": "Маникюр из профиля Beauty Me: миндалевидные ногти с коричневым и белым покрытием"
    },
    "src": "/media/nude-manicure.webp",
    "width": 898,
    "height": 1117
  },
  {
    "id": "soft-waves",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/p/CYCPas9t87j/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "hair",
    "title": {
      "uz": "Yumshoq to‘lqinlar",
      "ru": "Мягкие волны"
    },
    "alt": {
      "uz": "Salondagi jigarrang sochlarga qilingan to‘lqinli turmak, orqa tomondan ko‘rinish",
      "ru": "Волнистая укладка на каштановых волосах в салоне, вид со спины"
    },
    "src": "/media/soft-waves.webp",
    "width": 1200,
    "height": 1500
  },
  {
    "id": "classic-makeup",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/p/CZya3dgt4T8/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "makeup",
    "title": {
      "uz": "Klassik ifoda",
      "ru": "Классический образ"
    },
    "alt": {
      "uz": "Qizil lab bo‘yog‘i, aniq ko‘z makiyaji va qora sochli ayolning salon obrazi",
      "ru": "Салонный образ: красная помада, выразительный макияж глаз и тёмные волосы"
    },
    "focus": "50% 35%",
    "src": "/media/classic-makeup.webp",
    "width": 1200,
    "height": 1500
  },
  {
    "id": "milk-manicure",
    "sourceUrl": "https://www.instagram.com/adel_nail_uz/p/C3AlK_6oQKD/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "nails",
    "title": {
      "uz": "Sut rangidagi qoplama",
      "ru": "Молочное покрытие"
    },
    "alt": {
      "uz": "Beauty Me profilida ko‘rsatilgan oq sut tusidagi manikyur",
      "ru": "Молочный маникюр, показанный в профиле Beauty Me"
    },
    "src": "/media/milk-manicure.webp",
    "width": 1080,
    "height": 1080
  },
  {
    "id": "blonde-waves",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/reel/CcDf75UFtoN/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "hair",
    "title": {
      "uz": "Rang va turmak",
      "ru": "Цвет и укладка"
    },
    "alt": {
      "uz": "Salon videosining muqovasi: och sariq rangga bo‘yalgan to‘lqinli soch",
      "ru": "Обложка видео салона: светлые волосы с волнистой укладкой"
    },
    "src": "/media/blonde-waves.webp",
    "width": 720,
    "height": 1280
  },
  {
    "id": "red-hair",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/p/Cb__0juuPcu/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "hair",
    "title": {
      "uz": "Yorqin rang",
      "ru": "Яркий цвет"
    },
    "alt": {
      "uz": "Beauty Me postidagi mis tusli yorqin soch rangi va turmak",
      "ru": "Яркий медный цвет волос и укладка из публикации Beauty Me"
    },
    "focus": "50% 35%",
    "src": "/media/red-hair.webp",
    "width": 1440,
    "height": 1796
  },
  {
    "id": "nude-detail",
    "sourceUrl": "https://www.instagram.com/adel_nail_uz/p/C3KKFIEoll9/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "nails",
    "title": {
      "uz": "Nozik detal",
      "ru": "Нежный нюд"
    },
    "alt": {
      "uz": "Beauty Me profilida ko‘rsatilgan nozik nude tusidagi manikyur",
      "ru": "Нежный нюдовый маникюр, показанный в профиле Beauty Me"
    },
    "src": "/media/nude-detail.webp",
    "width": 1440,
    "height": 1800
  },
  {
    "id": "event-styling",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/reel/CY0ppeaqd2w/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "makeup",
    "title": {
      "uz": "Tadbir uchun obraz",
      "ru": "Образ для события"
    },
    "alt": {
      "uz": "Salon videosining muqovasi: qizil kiyimli ayolning uzun soch turmagi va makiyaji",
      "ru": "Обложка видео салона: причёска и макияж женщины в красном наряде"
    },
    "focus": "50% 25%",
    "src": "/media/event-styling.webp",
    "width": 720,
    "height": 1280
  },
  {
    "id": "hair-care-look",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/reel/CYWW8IpKYsC/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "hair",
    "title": {
      "uz": "Silliq turmak",
      "ru": "Гладкая укладка"
    },
    "alt": {
      "uz": "Salon videosining muqovasi: uzun silliq sochli turmak yon tomondan",
      "ru": "Обложка видео салона: длинные гладкие волосы, вид сбоку"
    },
    "src": "/media/hair-care-look.webp",
    "width": 720,
    "height": 720
  },
  {
    "id": "barber-look",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/reel/CvRZaLyNzkr/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "hair",
    "title": {
      "uz": "Erkaklar obrazi",
      "ru": "Мужской образ"
    },
    "alt": {
      "uz": "Beauty Me videosi muqovasida erkaklar soch va soqol turmagi",
      "ru": "Мужская стрижка и оформление бороды на обложке видео Beauty Me"
    },
    "src": "/media/barber-look.webp",
    "width": 720,
    "height": 1280
  },
  {
    "id": "creative-cut",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/reel/CZq9yYIlD9B/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "hair",
    "title": {
      "uz": "Kreativ soch olish",
      "ru": "Креативная стрижка"
    },
    "alt": {
      "uz": "Salon videosi muqovasida yon tomoni naqshli qilib olingan soch",
      "ru": "Стрижка с узором на боковой части головы, обложка видео салона"
    },
    "src": "/media/creative-cut.webp",
    "width": 720,
    "height": 1280
  },
  {
    "id": "salon-life",
    "sourceUrl": "https://www.instagram.com/beautyme_uz/reel/CzyG01UtByo/",
    "viaProfile": "https://www.instagram.com/beautyme_uz/",
    "category": "interior",
    "title": {
      "uz": "Salon hayotidan",
      "ru": "Из жизни салона"
    },
    "alt": {
      "uz": "Beauty Me yubileyi videosining muqovasi: salon ichidagi guruh surati",
      "ru": "Групповое фото в салоне на обложке юбилейного видео Beauty Me"
    },
    "focus": "50% 45%",
    "src": "/media/salon-life.webp",
    "width": 1440,
    "height": 2560
  }
];
