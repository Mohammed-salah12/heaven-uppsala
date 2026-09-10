/**
 * Seed content for Restaurang Heaven — multi‑page rebuild.
 *
 * Structure mirrors the real restaurangheaven.se: a home page plus Bakfickan,
 * Konferens, Festvåning, Mat meny and Drink meny pages, with Om oss / Kontakt
 * as in‑page anchors on the home page. Swedish text is taken from the live
 * site; English and Portuguese are faithful translations.
 *
 * Media (images + the two background videos) reference the restaurant's live
 * Wix CDN so the rebuild shows the same content/pics/videos out of the box.
 * Run `npm run localize-images` to self‑host them (see README).
 *
 * Adding a language later needs no code changes — the admin API copies the
 * default language across every page/block so the new language works instantly.
 */

const M = 'https://static.wixstatic.com/media';
const V = 'https://video.wixstatic.com/video';

const media = {
  // videos (mp4, directly playable) + poster still
  heroVideo: `${V}/a6f92b_57c3e45914bb4a9db1a3004c393a1b0e/1080p/mp4/file.mp4`,
  festVideo: `${V}/11062b_bae67404e0ff4b328ad6a95dab4d00db/1080p/mp4/file.mp4`,
  heroPoster: `${M}/a6f92b_57c3e45914bb4a9db1a3004c393a1b0ef000.jpg/v1/fill/w_1920,h_1080,al_c,q_90,enc_avif,quality_auto/hero.jpg`,
  logo: `${M}/a6f92b_4c375f13c6334eb68af5f7f6817fa97a~mv2.png/v1/fill/w_1080,h_738,al_c,q_90,enc_avif,quality_auto/IMG_1640-removebg.png`,
  // home feature photos
  grill: `${M}/b27eb7_5aed7b651b6046a98e890e3e10033269~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_85,enc_avif,quality_auto/grill.jpg`,
  dancers: `${M}/a6f92b_a803c35800404261b27505731ef8ee9f~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,enc_avif,quality_auto/dancers.jpg`,
  drinks: `${M}/9fdacc_dfbd0f51a10d4928b740debaa4b790ad.jpg/v1/fill/w_1000,h_506,al_c,q_85,enc_avif,quality_auto/drinks.jpg`,
  skewers: `${M}/a6f92b_4be8bfd83dc944b89abb9994f9062914~mv2.jpg/v1/fill/w_1000,h_1000,al_c,q_85,enc_avif,quality_auto/skewers.jpg`,
  bar: `${M}/9fdacc_8c628fcb6b864624962bad61dd46cf52.jpg/v1/fill/w_1000,h_476,al_c,q_85,enc_avif,quality_auto/bar.jpg`,
  // bakfickan
  bakBanner: `${M}/b27eb7_325958aa196a4524813d340afdffcebb~mv2.jpg/v1/fill/w_1920,h_720,al_c,q_85,enc_avif,quality_auto/bakfickan.jpg`,
  bakMeal: `${M}/b27eb7_9de7df620a914a6ea41a32df19a32baa~mv2.jpg/v1/fill/w_1006,h_1400,al_c,q_90,enc_avif,quality_auto/weekly-meal.jpg`,
  bakDropin: `${M}/b27eb7_db163636c3014e17b9e9396f7ebbdd60~mv2.jpg/v1/fill/w_900,h_1300,al_c,q_90,enc_avif,quality_auto/dropin.jpg`,
  bakDish: `${M}/b27eb7_6c33c96710014855a006e3e872ce800b~mv2.jpg/v1/fill/w_1000,h_1290,al_c,q_90,enc_avif,quality_auto/dish.jpg`,
  // festvaning
  fest: `${M}/a6f92b_4f43eecd1bb744339374461fca292645~mv2.jpg/v1/fill/w_900,h_1200,al_c,q_85,enc_avif,quality_auto/festvaning.jpg`,
  // mat meny
  buffe: `${M}/b27eb7_5e52f07451d94619b9c5ceba1f17437f~mv2.jpg/v1/fill/w_1414,h_2000,al_c,q_90,enc_avif,quality_auto/buffe.jpg`,
  dessert: `${M}/a6f92b_63868750eab3471aad18cddc719876d9~mv2.jpg/v1/fill/w_1414,h_1552,al_c,q_90,enc_avif,quality_auto/Dessert.jpg`,
  food1: `${M}/b27eb7_ae195f3d5e4c4e0cb5493d7335962043~mv2.jpg/v1/fill/w_700,h_700,q_90,enc_avif,quality_auto/food1.jpg`,
  food2: `${M}/b27eb7_e69afe92a0ef45ce8e32c09a16791e5f~mv2.jpg/v1/fill/w_700,h_700,q_90,enc_avif,quality_auto/food2.jpg`,
  food3: `${M}/b27eb7_df4bad8de51a49b897517276c8652eed~mv2.jpg/v1/fill/w_700,h_700,q_90,enc_avif,quality_auto/food3.jpg`,
  // drink meny
  drinkar: `${M}/a6f92b_ff4e9e42d4634aacaa2c7d96f97b6abc~mv2.jpg/v1/fill/w_1280,h_1956,al_c,q_90,enc_avif,quality_auto/drinkar.jpg`,
  glassList: `${M}/a6f92b_7571942d09a345c891473a3b89859e9b~mv2.jpg/v1/fill/w_1280,h_1810,al_c,q_90,enc_avif,quality_auto/Glass-List.jpg`,
  bottleList: `${M}/a6f92b_a6328ec9e14b41c8bf50bac611de91bf~mv2.jpg/v1/fill/w_1280,h_1810,al_c,q_90,enc_avif,quality_auto/bottle-list.jpg`,
};

// Photo gallery on the home page (buffet / dish photos) — exact live URLs.
const GALLERY = [
  `${M}/a6f92b_0ca729a7e9d84436bf9c34a5fe3815b2~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g1.jpg`,
  `${M}/a6f92b_16b81ed12ad14341a0ff6dbc2cc1fd92~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g2.jpg`,
  `${M}/a6f92b_4be8bfd83dc944b89abb9994f9062914~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g3.jpg`,
  `${M}/a6f92b_6e9292547f434eab928c7a3ceee83496~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g4.jpg`,
  `${M}/a6f92b_db34b4f7a80347cb89e51095ea2c0b66~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g5.jpg`,
  `${M}/a6f92b_8edf0c20fcc94c909e76dd021860de09~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g6.jpg`,
  `${M}/a6f92b_2721711590bb468e9f09947e2349a7d1~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g7.jpg`,
  `${M}/a6f92b_a803c35800404261b27505731ef8ee9f~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g8.jpg`,
  `${M}/a6f92b_83f3a4d1ad074856b9b8e3c58054b7b6~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g9.jpg`,
  `${M}/a6f92b_39d67d7915694d3a832369d3ab7871af~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g10.jpg`,
  `${M}/a6f92b_94fb66023cf04e54afce032403e5578f~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g11.jpg`,
  `${M}/a6f92b_4785e05c63284364bfa22c3df0fa0af9~mv2.jpg/v1/fill/w_500,h_500,al_c,q_85,enc_avif,quality_auto/g12.jpg`,
];

// ── Languages (default = Swedish). Add more at runtime via the admin API. ──
const languages = [
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr', flag: '🇸🇪', isDefault: true, sortOrder: 1 },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧', isDefault: false, sortOrder: 2 },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', flag: '🇧🇷', isDefault: false, sortOrder: 3 },
];

// ── Global settings ──
const setting = {
  key: 'site',
  restaurantName: 'Restaurang Heaven',
  phone: '018-505500',
  email: 'info@restaurangheaven.se',
  bookingUrl: 'https://widget.thefork.com/a89096bf-a60f-43df-b687-92fe42ae0235',
  logoUrl: media.logo,
  heroImageUrl: media.heroPoster,
  heroVideoUrl: media.heroVideo,
  social: {
    instagram: 'https://www.instagram.com/heaven_grill_de_brazil/',
    facebook: 'https://www.facebook.com/profile.php?id=61556380418091',
    tiktok: 'https://www.tiktok.com/@heaven.uppsala',
  },
  foodMenuImages: [],
  drinkMenuImages: [],
};

// ── Locations (contact block + footer) ──
const locations = [
  {
    key: 'main',
    order: 1,
    addressLine: 'Drottninggatan 3, 753 10 Uppsala',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Drottninggatan+3+753+10+Uppsala',
    translations: {
      sv: { name: 'Restaurang Heaven', hoursTitle: 'Öppettider', hours: [
        { label: 'Söndag–Torsdag', value: '16:00–22:00' },
        { label: 'Fredag–Lördag', value: '16:00–01:00' },
        { label: 'Måndag', value: 'Stängt' } ] },
      en: { name: 'Restaurang Heaven', hoursTitle: 'Opening hours', hours: [
        { label: 'Sunday–Thursday', value: '16:00–22:00' },
        { label: 'Friday–Saturday', value: '16:00–01:00' },
        { label: 'Monday', value: 'Closed' } ] },
      pt: { name: 'Restaurang Heaven', hoursTitle: 'Horário', hours: [
        { label: 'Domingo–Quinta', value: '16:00–22:00' },
        { label: 'Sexta–Sábado', value: '16:00–01:00' },
        { label: 'Segunda', value: 'Fechado' } ] },
    },
  },
  {
    key: 'bakfickan',
    order: 2,
    addressLine: 'Fyristorg 10, 753 10 Uppsala',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Fyristorg+10+753+10+Uppsala',
    translations: {
      sv: { name: 'Bakfickan', hoursTitle: 'Öppettider', hours: [
        { label: 'Mån–Fre (husman)', value: '11:00–14:00' },
        { label: 'Tis–Sön', value: 'från 15:00' } ] },
      en: { name: 'Bakfickan', hoursTitle: 'Opening hours', hours: [
        { label: 'Mon–Fri (lunch)', value: '11:00–14:00' },
        { label: 'Tue–Sun', value: 'from 15:00' } ] },
      pt: { name: 'Bakfickan', hoursTitle: 'Horário', hours: [
        { label: 'Seg–Sex (almoço)', value: '11:00–14:00' },
        { label: 'Ter–Dom', value: 'a partir das 15:00' } ] },
    },
  },
];

// helper to keep block definitions compact
const B = (type, extra, translations) => ({ type, ...extra, translations });

// ── PAGES ──
const pages = [
  // ═══════════════════════ HOME ═══════════════════════
  {
    slug: 'home', order: 1, inNav: true, navKey: 'nav.home', path: '/', isAnchor: false,
    heroImageUrl: media.heroPoster, heroVideoUrl: media.heroVideo,
    translations: {
      sv: { title: 'Restaurang Heaven', subtitle: 'Grill • Churrasco' },
      en: { title: 'Restaurang Heaven', subtitle: 'Grill • Churrasco' },
      pt: { title: 'Restaurang Heaven', subtitle: 'Grill • Churrasco' },
    },
    blocks: [
      B('pricing', { order: 1, anchor: 'buffe', tiers: [
          { price: '449 kr', highlight: true }, { price: '249 kr' }, { price: '199 kr' }, { price: null },
        ] },
        {
          sv: { heading: 'Buffé & priser', subheading: 'Ät så mycket du vill – rakt från grillen', tiers: [
            { name: 'Grillbuffé inkl. vegetarisk buffé', unit: '/ person' },
            { name: 'Endast vegetarisk buffé', unit: '/ person' },
            { name: 'Buffé för barn 7–10 år', unit: '' },
            { name: 'Barn upp till 6 år', price: 'Gratis', unit: 'äter gratis hos oss!' } ] },
          en: { heading: 'Buffet & prices', subheading: 'All you can eat — straight from the grill', tiers: [
            { name: 'Grill buffet incl. vegetarian buffet', unit: '/ person' },
            { name: 'Vegetarian buffet only', unit: '/ person' },
            { name: 'Buffet for children 7–10 yrs', unit: '' },
            { name: 'Children up to 6 yrs', price: 'Free', unit: 'eat free with us!' } ] },
          pt: { heading: 'Buffet & preços', subheading: 'Coma à vontade — direto da grelha', tiers: [
            { name: 'Rodízio na grelha + buffet vegetariano', unit: '/ pessoa' },
            { name: 'Somente buffet vegetariano', unit: '/ pessoa' },
            { name: 'Buffet para crianças 7–10 anos', unit: '' },
            { name: 'Crianças até 6 anos', price: 'Grátis', unit: 'comem de graça!' } ] },
        }),
      B('split', { order: 2, anchor: 'ourstory', image: media.grill },
        {
          sv: { eyebrow: 'Om oss', heading: 'Restaurang Heaven – Grill', body: 'Churrasco­upplevelse mitt i Uppsala där vi kombinerar brasiliansk grilltradition med en atmosfär av glädje och gemenskap.' },
          en: { eyebrow: 'About us', heading: 'Restaurang Heaven – Grill', body: 'A churrasco experience in the heart of Uppsala, where we combine Brazilian grilling tradition with an atmosphere of joy and togetherness.' },
          pt: { eyebrow: 'Sobre nós', heading: 'Restaurang Heaven – Grill', body: 'Uma experiência de churrasco no coração de Uppsala, onde unimos a tradição da grelha brasileira a uma atmosfera de alegria e convívio.' },
        }),
      B('split', { order: 3, image: media.dancers, reverse: true },
        {
          sv: { eyebrow: 'Vår passion', heading: 'Finaste köttet', body: 'Vår passion är att erbjuda dig en unik matupplevelse där vi serverar finaste köttet på ett sätt som du aldrig tidigare upplevt.' },
          en: { eyebrow: 'Our passion', heading: 'The finest meat', body: 'Our passion is to offer you a unique dining experience, serving the finest meat in a way you have never experienced before.' },
          pt: { eyebrow: 'Nossa paixão', heading: 'A melhor carne', body: 'Nossa paixão é oferecer uma experiência gastronômica única, servindo a melhor carne de um jeito que você nunca viveu antes.' },
        }),
      B('split', { order: 4, image: media.drinks },
        {
          sv: { eyebrow: 'Drinkar', heading: 'Brasiliansk inspiration', body: 'För att komplettera din måltid erbjuder vi ett brett utbud av drinkar med brasiliansk inspiration. Från fräscha caipirinhas till sofistikerade cocktails – våra drycker är skapade för att komplettera den rika smaken av vårt grillade kött.' },
          en: { eyebrow: 'Drinks', heading: 'Brazilian inspiration', body: 'To complement your meal we offer a wide selection of Brazilian-inspired drinks. From fresh caipirinhas to sophisticated cocktails — our drinks are crafted to complement the rich flavour of our grilled meat.' },
          pt: { eyebrow: 'Drinques', heading: 'Inspiração brasileira', body: 'Para completar sua refeição, oferecemos uma ampla seleção de drinques de inspiração brasileira. Das caipirinhas fresquinhas aos coquetéis sofisticados — criados para realçar o sabor da nossa carne grelhada.' },
        }),
      B('rich', { order: 5, cta: 'book' },
        {
          sv: { eyebrow: 'Brazil', heading: 'Öppet fram till 03', body: ['Oavsett om du är ute efter en romantisk middag för två eller en kväll med vänner som sträcker sig in på småtimmarna, är du alltid välkommen hos oss. Vår restaurang är öppen fram till 03, vilket ger dig gott om tid att njuta av god mat, dryck och sällskap.', 'Boka bord här eller ring oss på 018-505500.'] },
          en: { eyebrow: 'Brazil', heading: 'Open until 03:00', body: ['Whether you are looking for a romantic dinner for two or a night with friends that stretches into the small hours, you are always welcome with us. Our restaurant is open until 03:00, giving you plenty of time to enjoy good food, drink and company.', 'Book a table here or call us on 018-505500.'] },
          pt: { eyebrow: 'Brazil', heading: 'Aberto até as 03:00', body: ['Seja um jantar romântico a dois ou uma noite com amigos que avança madrugada adentro, você é sempre bem-vindo. Nosso restaurante fica aberto até as 03:00, com tempo de sobra para aproveitar boa comida, bebida e companhia.', 'Reserve uma mesa aqui ou ligue para 018-505500.'] },
        }),
      B('gallery', { order: 6, images: GALLERY },
        {
          sv: { heading: 'Galleri' }, en: { heading: 'Gallery' }, pt: { heading: 'Galeria' },
        }),
      B('split', { order: 7, image: media.skewers },
        {
          sv: { eyebrow: 'Churrasco', heading: 'Perfektion på grillen', body: 'Vår stolthet är vår churrasco, en traditionell brasiliansk grillmetod där vår grillpersonal går runt med spett av olika grillrätter och skär upp det direkt vid ditt bord. Här får du möjlighet att smaka på en mångfald av utsökta köttsorter, grillade med kärlek och precision.' },
          en: { eyebrow: 'Churrasco', heading: 'Perfection on the grill', body: 'Our pride is our churrasco, a traditional Brazilian grilling method where our grill staff walk around with skewers of different cuts and carve them straight at your table. Here you can taste a variety of exquisite meats, grilled with love and precision.' },
          pt: { eyebrow: 'Churrasco', heading: 'Perfeição na grelha', body: 'Nosso orgulho é o churrasco, método tradicional brasileiro em que nossos passadores circulam com espetos de diferentes cortes e fatiam direto na sua mesa. Você prova uma variedade de carnes deliciosas, grelhadas com amor e precisão.' },
        }),
      B('split', { order: 8, image: media.bar, reverse: true },
        {
          sv: { eyebrow: 'Baren', heading: 'Njut av en drink vid baren', body: 'Upplev en värld av förfinad smak med våra exklusiva drinkar, skapade med inspiration från Brasiliens rika kultur och traditioner. Från fräscha och uppfriskande caipirinhas till eleganta och sofistikerade cocktails.' },
          en: { eyebrow: 'The bar', heading: 'Enjoy a drink at the bar', body: 'Experience a world of refined taste with our exclusive drinks, created with inspiration from Brazil\'s rich culture and traditions. From fresh and refreshing caipirinhas to elegant, sophisticated cocktails.' },
          pt: { eyebrow: 'O bar', heading: 'Aprecie um drinque no bar', body: 'Viva um mundo de sabor refinado com nossos drinques exclusivos, criados com inspiração na rica cultura e nas tradições do Brasil. Das caipirinhas fresquinhas aos coquetéis elegantes e sofisticados.' },
        }),
      B('newsletter', { order: 9 },
        {
          sv: { heading: 'Missa inget genom vårt nyhetsbrev', body: 'Prenumerera för erbjudanden och nyheter.' },
          en: { heading: 'Never miss out — join our newsletter', body: 'Subscribe for offers and news.' },
          pt: { heading: 'Não perca nada — assine nossa newsletter', body: 'Assine para receber ofertas e novidades.' },
        }),
      B('contact', { order: 10, anchor: 'kontakt' },
        {
          sv: { heading: 'Kontakt & plats', body: 'Har du några frågor? Hör av dig genom att ringa eller maila till oss.' },
          en: { heading: 'Contact & location', body: 'Have any questions? Get in touch by phone or email.' },
          pt: { heading: 'Contato & localização', body: 'Tem alguma dúvida? Fale conosco por telefone ou e-mail.' },
        }),
    ],
  },

  // ═══════════════════════ BAKFICKAN ═══════════════════════
  {
    slug: 'bakfickan', order: 2, inNav: true, navKey: 'nav.bakfickan', path: '/bakfickan',
    heroImageUrl: media.bakBanner,
    translations: {
      sv: { title: 'Bakfickan', subtitle: 'Vår nya, exklusiva avdelning' },
      en: { title: 'Bakfickan', subtitle: 'Our new, exclusive room' },
      pt: { title: 'Bakfickan', subtitle: 'Nosso novo espaço exclusivo' },
    },
    blocks: [
      B('split', { order: 1, image: media.bakDish, cta: 'dropin' },
        {
          sv: { eyebrow: 'Välkommen', heading: 'Välkommen till Bakfickan!', body: 'Här serverar vi dagligen klassisk husmanskost mån–fre 11–14 och à la carte tis–sön från klockan 15:00. För den som vill njuta av något extra erbjuder vi även Heavens signaturdrinkar samt ett noggrant utvalt sortiment av öl. Kom för en smakupplevelse utöver det vanliga – vi ser fram emot att ha er här!' },
          en: { eyebrow: 'Welcome', heading: 'Welcome to Bakfickan!', body: 'Here we serve classic Swedish home cooking daily, Mon–Fri 11–14, and à la carte Tue–Sun from 15:00. For something extra we also offer Heaven\'s signature drinks and a carefully selected range of beers. Come for a taste experience out of the ordinary — we look forward to having you here!' },
          pt: { eyebrow: 'Bem-vindo', heading: 'Bem-vindo ao Bakfickan!', body: 'Servimos diariamente a comida caseira sueca clássica, seg–sex 11–14, e à la carte ter–dom a partir das 15:00. Para quem quer algo especial, oferecemos também os drinques exclusivos do Heaven e uma seleção cuidadosa de cervejas. Venha para uma experiência de sabor fora do comum — esperamos por você!' },
        }),
      B('menu', { order: 2, images: [media.bakMeal, media.bakDropin] },
        {
          sv: { heading: 'Drop in-meny', note: 'Veckans husman & drop in.' },
          en: { heading: 'Drop-in menu', note: 'Weekly home cooking & drop-in.' },
          pt: { heading: 'Cardápio drop-in', note: 'Comida caseira da semana & drop-in.' },
        }),
    ],
  },

  // ═══════════════════════ KONFERENS ═══════════════════════
  {
    slug: 'konferens', order: 3, inNav: true, navKey: 'nav.konferens', path: '/konferens',
    heroImageUrl: media.heroPoster, heroVideoUrl: media.heroVideo,
    translations: {
      sv: { title: 'Konferens & möten', subtitle: 'Mitt i Uppsala' },
      en: { title: 'Conferences & meetings', subtitle: 'In central Uppsala' },
      pt: { title: 'Conferências & reuniões', subtitle: 'No centro de Uppsala' },
    },
    blocks: [
      B('rich', { order: 1 },
        {
          sv: { eyebrow: 'Konferens', heading: 'Konferens & möten mitt i Uppsala', body: ['Restaurang Heaven erbjuder moderna och fräscha konferens- och möteslokaler i en anrik miljö, perfekt för alla typer av möten och event.', 'Vår konferensavdelning kan ta emot upp till 300 personer. Med vårt centrala läge och positiva, lösningsorienterade personal är vi redo att göra ert möte till en unik och minnesvärd upplevelse. Välkomna till Restaurang Heaven för ert nästa möte eller event!'] },
          en: { eyebrow: 'Conference', heading: 'Conferences & meetings in central Uppsala', body: ['Restaurang Heaven offers modern, fresh conference and meeting rooms in a venue full of character, perfect for all kinds of meetings and events.', 'Our conference department can host up to 300 people. With our central location and positive, solution-oriented staff, we are ready to make your meeting a unique and memorable experience. Welcome to Restaurang Heaven for your next meeting or event!'] },
          pt: { eyebrow: 'Conferência', heading: 'Conferências & reuniões no centro de Uppsala', body: ['O Restaurang Heaven oferece salas de conferência e reunião modernas em um ambiente cheio de história, perfeitas para todo tipo de encontro e evento.', 'Nosso setor de conferências recebe até 300 pessoas. Com localização central e uma equipe positiva e orientada a soluções, estamos prontos para tornar sua reunião única e memorável. Bem-vindos ao Restaurang Heaven para seu próximo encontro ou evento!'] },
        }),
      B('split', { order: 2, image: media.dancers, cta: 'book' },
        {
          sv: { eyebrow: 'Skräddarsytt', heading: 'Skräddarsy din konferens med oss', body: 'Vi erbjuder konferenser som är skräddarsydda för er – allt ifrån möten, webbinarier, seminarier, dagskonferenser, hybridmöten och kick-offer. Vi hjälper er från idé till färdig konferens. Vill du veta mer? Ring 018-505500 eller maila info@restaurangheaven.se.' },
          en: { eyebrow: 'Tailored', heading: 'Tailor your conference with us', body: 'We offer conferences tailored to you — everything from meetings, webinars, seminars, day conferences, hybrid meetings and kick-offs. We help you from idea to finished conference. Want to know more? Call 018-505500 or email info@restaurangheaven.se.' },
          pt: { eyebrow: 'Sob medida', heading: 'Personalize sua conferência conosco', body: 'Oferecemos conferências sob medida — de reuniões, webinars e seminários a conferências de um dia, encontros híbridos e kick-offs. Ajudamos da ideia à conferência pronta. Quer saber mais? Ligue 018-505500 ou escreva para info@restaurangheaven.se.' },
        }),
      B('rich', { order: 3 },
        {
          sv: { eyebrow: 'Teknik', heading: 'Teknik & utrustning', body: ['Vårt konferens- och mötesrum är utrustat med den senaste tekniken en modern konferens kan tänkas behöva:'], items: [
            'Takmonterade projektorer av LED-variant',
            'Påkostat ljudsystem från BOSE för en mediaupplevelse i toppskiktet',
            'Dedikerade serviceknappar så hjälpen snabbt är på plats',
            'Kostnadsfritt Wi-Fi för alla gäster',
            'Whiteboard och blädderblock i samtliga rum',
            'Anteckningsblock och pennor till deltagarna' ] },
          en: { eyebrow: 'Technology', heading: 'Technology & equipment', body: ['Our conference and meeting room is equipped with the latest technology a modern conference could need:'], items: [
            'Ceiling-mounted LED projectors',
            'A premium BOSE sound system for a top-tier media experience',
            'Dedicated service buttons so help arrives quickly',
            'Free Wi-Fi for all guests',
            'Whiteboard and flip charts in every room',
            'Notepads and pens for participants' ] },
          pt: { eyebrow: 'Tecnologia', heading: 'Tecnologia & equipamentos', body: ['Nossa sala de conferência e reunião conta com a tecnologia mais recente que um evento moderno pode precisar:'], items: [
            'Projetores LED montados no teto',
            'Sistema de som BOSE de alto nível para uma experiência de mídia excepcional',
            'Botões de serviço dedicados para ajuda rápida',
            'Wi-Fi gratuito para todos os convidados',
            'Whiteboard e flip charts em todas as salas',
            'Blocos de anotações e canetas para os participantes' ] },
        }),
      B('rich', { order: 4, cta: 'book' },
        {
          sv: { eyebrow: 'Bokning', heading: 'Bokningsförfrågan', body: ['Lokalkostnaden baseras på säsong, veckodag, antal bokade tillfällen per gång samt om ni är avtalskunder. Vi skräddarsyr tiderna efter ert behov – hör av er så hittar vi vad som passar er bäst!', 'Hela anläggningen omfattas av ett trådlöst nätverk som är kostnadsfritt att använda. Hastigheten är 1 Gbit/s.'] },
          en: { eyebrow: 'Booking', heading: 'Booking request', body: ['The room cost is based on season, weekday, the number of booked occasions per time and whether you are a contract customer. We tailor the times to your needs — get in touch and we\'ll find what suits you best!', 'The whole venue is covered by a wireless network that is free to use. The speed is 1 Gbit/s.'] },
          pt: { eyebrow: 'Reserva', heading: 'Solicitação de reserva', body: ['O custo da sala depende da temporada, do dia da semana, do número de reservas por vez e se você é cliente com contrato. Ajustamos os horários à sua necessidade — fale conosco e encontramos o que melhor combina com você!', 'Todo o espaço é coberto por uma rede sem fio gratuita. A velocidade é de 1 Gbit/s.'] },
        }),
      B('faq', { order: 5 },
        {
          sv: { heading: 'Vanliga frågor', items: [
            { q: 'Vad för typ av konferens kan jag hålla hos er?' },
            { q: 'Hur många personer får plats?' },
            { q: 'Kan ni hjälpa oss med planering och idéskapande?' } ] },
          en: { heading: 'Frequently asked questions', items: [
            { q: 'What kind of conference can I hold with you?' },
            { q: 'How many people fit?' },
            { q: 'Can you help us with planning and idea creation?' } ] },
          pt: { heading: 'Perguntas frequentes', items: [
            { q: 'Que tipo de conferência posso realizar com vocês?' },
            { q: 'Quantas pessoas cabem?' },
            { q: 'Vocês ajudam no planejamento e na criação de ideias?' } ] },
        }),
    ],
  },

  // ═══════════════════════ FESTVÅNING ═══════════════════════
  {
    slug: 'festvaning', order: 4, inNav: true, navKey: 'nav.festvaning', path: '/festvaning',
    heroImageUrl: media.heroPoster, heroVideoUrl: media.heroVideo,
    translations: {
      sv: { title: 'Festvåning', subtitle: 'Festlokaler som gör skillnad' },
      en: { title: 'Private events', subtitle: 'Party venues that make a difference' },
      pt: { title: 'Eventos', subtitle: 'Espaços de festa que fazem a diferença' },
    },
    blocks: [
      B('split', { order: 1, image: media.fest },
        {
          sv: { eyebrow: 'Festvåning', heading: 'En festlokal som passar alla', body: 'Vare sig ni vill anordna en exklusiv middag, ett mingel, ett fullspäckat event eller en företagsfest för 700 personer, så har vi en festvåning för er. Vi hjälper er från början till slut med vår serviceinriktade personal, projektledare, eventkoordinator och köksmästare. Bara berätta hur ni vill ha det så ordnar vi resten.' },
          en: { eyebrow: 'Private events', heading: 'A venue that fits everyone', body: 'Whether you want to arrange an exclusive dinner, a mingle, a packed event or a company party for 700 people, we have a venue for you. We help you from start to finish with our service-minded staff, project manager, event coordinator and head chef. Just tell us how you want it and we\'ll arrange the rest.' },
          pt: { eyebrow: 'Eventos', heading: 'Um espaço para todos', body: 'Seja um jantar exclusivo, um coquetel, um evento completo ou uma festa de empresa para 700 pessoas, temos um espaço para você. Ajudamos do começo ao fim com nossa equipe atenciosa, gerente de projeto, coordenador de eventos e chef de cozinha. Diga como você quer e cuidamos do resto.' },
        }),
      B('rich', { order: 2 },
        {
          sv: { eyebrow: 'Festaktiviteter', heading: 'Hur kan vi hjälpa er?', body: ['Det går alltid att lätta upp stämningen genom att lägga in en eller ett par väl valda aktiviteter i programmet – allt från en tipspromenad till ett uppiggande musikquiz. Rätt festaktivitet kan göra er fest till en roligare och mer oförglömlig upplevelse.', 'Vissa aktiviteter är kostnadsfria, andra kan behöva utrustning eller utomstående partners. Ska det hållas tal kanske ni vill utse en toastmaster. Oavsett vad ni behöver hjälp med ställer vi gärna upp hela vägen i mål.'] },
          en: { eyebrow: 'Party activities', heading: 'How can we help?', body: ['You can always lift the mood by adding one or two well-chosen activities to the programme — anything from a quiz walk to a lively music quiz. The right activity can make your party more fun and unforgettable.', 'Some activities are free, others may need equipment or outside partners. If there will be speeches, you might appoint a toastmaster. Whatever you need help with, we\'re happy to see it through to the finish.'] },
          pt: { eyebrow: 'Atividades', heading: 'Como podemos ajudar?', body: ['Dá para animar o clima com uma ou duas atividades bem escolhidas no programa — de uma caminhada com perguntas a um quiz musical animado. A atividade certa pode tornar sua festa mais divertida e inesquecível.', 'Algumas atividades são gratuitas, outras podem exigir equipamento ou parceiros externos. Se houver discursos, talvez você queira nomear um mestre de cerimônias. Seja o que for, ajudamos até o fim.'] },
        }),
      B('split', { order: 3, video: media.festVideo, image: media.heroPoster, reverse: true, cta: 'book' },
        {
          sv: { eyebrow: 'Festa här', heading: 'Festa hos oss på Restaurang Heaven', body: 'Vi har suveräna, effektiva och språkbegåvade festvärdar som hjälper er tillrätta, samt flexibla festlokaler med olika kombinationer och möjligheter. Kontakta oss om du har frågor kring festaktiviteter!' },
          en: { eyebrow: 'Party here', heading: 'Party with us at Restaurang Heaven', body: 'We have superb, efficient and multilingual party hosts to help you settle in, plus flexible venues with different combinations and possibilities. Contact us if you have questions about party activities!' },
          pt: { eyebrow: 'Festeje aqui', heading: 'Festeje conosco no Restaurang Heaven', body: 'Temos anfitriões excelentes, eficientes e poliglotas para ajudar você, além de espaços flexíveis com diversas combinações e possibilidades. Fale conosco se tiver dúvidas sobre as atividades de festa!' },
        }),
      B('rich', { order: 4 },
        {
          sv: { eyebrow: 'Villkor', heading: 'Avbokning', body: ['Kostnadsfri avbokning kan göras senast 14 dagar före eventdatumet. Vid avbokning efter detta debiteras 30 % av det totala beloppet.'] },
          en: { eyebrow: 'Terms', heading: 'Cancellation', body: ['Free cancellation can be made no later than 14 days before the event date. For cancellations after that, 30% of the total amount is charged.'] },
          pt: { eyebrow: 'Condições', heading: 'Cancelamento', body: ['O cancelamento gratuito pode ser feito até 14 dias antes da data do evento. Após esse prazo, é cobrado 30% do valor total.'] },
        }),
      B('booking', { order: 5, source: 'festvaning' },
        {
          sv: { heading: 'Boka er fest!', note: 'För bokning, fyll i nedan eller ring oss på 018-505500.' },
          en: { heading: 'Book your party!', note: 'To book, fill in below or call us on 018-505500.' },
          pt: { heading: 'Reserve sua festa!', note: 'Para reservar, preencha abaixo ou ligue para 018-505500.' },
        }),
      B('faq', { order: 6 },
        {
          sv: { heading: 'Vanliga frågor', items: [
            { q: 'Boka visning för vår festvåning' },
            { q: 'Flera festaktiviteter att köpa till' },
            { q: 'Festvåning i anrik miljö' } ] },
          en: { heading: 'Frequently asked questions', items: [
            { q: 'Book a viewing of our venue' },
            { q: 'Several add-on party activities' },
            { q: 'A venue full of character' } ] },
          pt: { heading: 'Perguntas frequentes', items: [
            { q: 'Agende uma visita ao nosso espaço' },
            { q: 'Diversas atividades adicionais' },
            { q: 'Um espaço cheio de história' } ] },
        }),
    ],
  },

  // ═══════════════════════ MAT MENY ═══════════════════════
  {
    slug: 'mat-meny', order: 5, inNav: true, navKey: 'nav.matmeny', path: '/mat-meny',
    heroImageUrl: media.heroPoster,
    translations: {
      sv: { title: 'Mat meny', subtitle: 'Buffé & dessert' },
      en: { title: 'Food menu', subtitle: 'Buffet & dessert' },
      pt: { title: 'Cardápio', subtitle: 'Buffet & sobremesa' },
    },
    blocks: [
      B('menu', { order: 1, images: [media.buffe, media.dessert] },
        {
          sv: { heading: 'Buffé & dessert', note: 'Vår grillbuffé och våra desserter.' },
          en: { heading: 'Buffet & dessert', note: 'Our grill buffet and desserts.' },
          pt: { heading: 'Buffet & sobremesa', note: 'Nosso rodízio na grelha e as sobremesas.' },
        }),
      B('gallery', { order: 2, images: [media.food1, media.food2, media.food3] },
        {
          sv: { heading: 'Från buffén' }, en: { heading: 'From the buffet' }, pt: { heading: 'Do buffet' },
        }),
    ],
  },

  // ═══════════════════════ DRINK MENY ═══════════════════════
  {
    slug: 'drink-meny', order: 6, inNav: true, navKey: 'nav.drinkmeny', path: '/drink-meny',
    heroImageUrl: media.heroPoster,
    translations: {
      sv: { title: 'Drink meny', subtitle: 'Drinkar, vin & öl' },
      en: { title: 'Drinks menu', subtitle: 'Cocktails, wine & beer' },
      pt: { title: 'Bebidas', subtitle: 'Drinques, vinho & cerveja' },
    },
    blocks: [
      B('menu', { order: 1, images: [media.drinkar, media.glassList, media.bottleList] },
        {
          sv: { heading: 'Drinkar & dryck', note: 'Drinkar, glas- och flasklista.' },
          en: { heading: 'Drinks list', note: 'Cocktails, by-the-glass and bottle list.' },
          pt: { heading: 'Bebidas', note: 'Drinques, lista por taça e por garrafa.' },
        }),
    ],
  },

  // ── Nav-only anchors on the home page ──
  { slug: 'om-oss', order: 7, inNav: true, navKey: 'nav.omoss', path: '/#ourstory', isAnchor: true, translations: {}, blocks: [] },
  { slug: 'kontakt', order: 8, inNav: true, navKey: 'nav.kontakt', path: '/#kontakt', isAnchor: true, translations: {}, blocks: [] },
];

// ── UI strings (nav, buttons, forms, labels) ──
const ui = {
  'nav.home': { sv: 'Hem', en: 'Home', pt: 'Início' },
  'nav.bakfickan': { sv: 'Bakfickan', en: 'Bakfickan', pt: 'Bakfickan' },
  'nav.konferens': { sv: 'Konferens', en: 'Conference', pt: 'Conferências' },
  'nav.festvaning': { sv: 'Festvåning', en: 'Private events', pt: 'Eventos' },
  'nav.matmeny': { sv: 'Mat meny', en: 'Food menu', pt: 'Cardápio' },
  'nav.drinkmeny': { sv: 'Drink meny', en: 'Drinks menu', pt: 'Bebidas' },
  'nav.omoss': { sv: 'Om oss', en: 'About', pt: 'Sobre' },
  'nav.kontakt': { sv: 'Kontakt', en: 'Contact', pt: 'Contato' },
  'cta.book': { sv: 'Boka bord', en: 'Book a table', pt: 'Reservar mesa' },
  'cta.foodMenu': { sv: 'Mat meny', en: 'Food menu', pt: 'Cardápio' },
  'cta.drinkMenu': { sv: 'Drink meny', en: 'Drinks menu', pt: 'Bebidas' },
  'cta.dropin': { sv: 'Drop in-meny', en: 'Drop-in menu', pt: 'Cardápio drop-in' },
  'cta.explore': { sv: 'Utforska menyn', en: 'Explore the menu', pt: 'Explorar o cardápio' },
  'label.popular': { sv: 'Populärast', en: 'Most popular', pt: 'Mais popular' },
  'label.contact': { sv: 'Kontakt', en: 'Contact', pt: 'Contato' },
  'label.phone': { sv: 'Telefon', en: 'Phone', pt: 'Telefone' },
  'label.email': { sv: 'E-post', en: 'Email', pt: 'E-mail' },
  'label.address': { sv: 'Adress', en: 'Address', pt: 'Endereço' },
  'label.getDirections': { sv: 'Vägbeskrivning', en: 'Get directions', pt: 'Como chegar' },
  'label.language': { sv: 'Språk', en: 'Language', pt: 'Idioma' },
  'label.scroll': { sv: 'Skrolla', en: 'Scroll', pt: 'Role' },
  'hero.badge': { sv: 'Brasiliansk grill • Uppsala', en: 'Brazilian grill • Uppsala', pt: 'Grelha brasileira • Uppsala' },
  'footer.tagline': { sv: 'Churrasco mitt i Uppsala', en: 'Churrasco in the heart of Uppsala', pt: 'Churrasco no coração de Uppsala' },
  'footer.rights': { sv: 'Alla rättigheter förbehållna', en: 'All rights reserved', pt: 'Todos os direitos reservados' },
  'footer.menu': { sv: 'Meny', en: 'Menu', pt: 'Menu' },
  'newsletter.placeholder': { sv: 'Din e-postadress', en: 'Your email address', pt: 'Seu e-mail' },
  'newsletter.button': { sv: 'Prenumerera', en: 'Subscribe', pt: 'Assinar' },
  'newsletter.success': { sv: 'Tack! Du är nu prenumerant.', en: 'Thanks! You are now subscribed.', pt: 'Obrigado! Você agora é assinante.' },
  'form.name': { sv: 'För- & efternamn', en: 'Full name', pt: 'Nome completo' },
  'form.phone': { sv: 'Telefonnummer', en: 'Phone number', pt: 'Telefone' },
  'form.email': { sv: 'E-post', en: 'Email', pt: 'E-mail' },
  'form.guests': { sv: 'Hur många blir ni?', en: 'How many will you be?', pt: 'Quantas pessoas?' },
  'form.date': { sv: 'Välj ett datum', en: 'Choose a date', pt: 'Escolha uma data' },
  'form.message': { sv: 'Meddelande', en: 'Message', pt: 'Mensagem' },
  'form.submit': { sv: 'Boka', en: 'Book', pt: 'Reservar' },
  'form.success': { sv: 'Tack! Vi hör av oss så snart som möjligt.', en: 'Thanks! We\'ll get back to you as soon as possible.', pt: 'Obrigado! Retornaremos o mais breve possível.' },
  'form.error': { sv: 'Något gick fel. Försök igen.', en: 'Something went wrong. Please try again.', pt: 'Algo deu errado. Tente novamente.' },
};

module.exports = { languages, setting, locations, pages, ui };
