import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Bitlis Sehrim seed baslatiliyor...');

  // Admin kullanici
  const admin = await prisma.user.upsert({
    where: { phone: '+905001234567' },
    update: {},
    create: {
      phone: '+905001234567',
      fullName: 'Bitlis Admin',
      district: 'Merkez',
      userType: 'ADMIN',
      isVerified: true,
      cityPoints: 1000,
    },
  });

  console.log('Admin olusturuldu:', admin.id);

  // Haberler
  const newsData = [
    {
      title: 'Bitlis Kalesi Restorasyon Calismalarinda Son Durum',
      content:
        'Bitlis Kalesi restorasyon calismalari hiz kesmeden devam ediyor. ' +
        'Kultur ve Turizm Bakanligi destegi ile yurutulen proje kapsaminda ' +
        'kalenin tarihi surlarinin onarimi tamamlandi.',
      summary: 'Bitlis Kalesi restorasyonunda onemli gelismeler',
      category: 'Kultur',
      isOfficial: true,
      isBreaking: false,
    },
    {
      title: 'Nemrut Krater Golu Yaz Sezonuna Hazirlaniyor',
      content:
        'Turkiye\'nin en buyuk krater golu olan Nemrut, yaz turizm ' +
        'sezonuna hazir. Tatvan Belediyesi altyapi calismalarina hiz verdi.',
      summary: 'Nemrut Golu turizm sezonu hazirliklari',
      category: 'Turizm',
      isBreaking: false,
    },
    {
      title: 'Ahlat Selcuklu Mezarliginda Yeni Kazi Sezonu',
      content:
        'UNESCO Dunya Mirasi Gecici Listesi\'nde yer alan Ahlat ' +
        'Selcuklu Mezarligi\'nda yeni arkeolojik kazi sezonu basliyor.',
      summary: 'Ahlat\'ta yeni arkeolojik kazi donemi',
      category: 'Kultur',
      isBreaking: false,
    },
    {
      title: 'Bitlis\'te Kar Yagisi Etkili Oluyor',
      content:
        'Bitlis\'te gece saatlerinde baslayan kar yagisi etkili olmaya ' +
        'devam ediyor. Karayollari ekipleri tuzlama ve kar kuma ' +
        'calismalarini surduruyor.',
      summary: 'Bitlis\'te yogun kar yagisi',
      category: 'Gundem',
      isBreaking: true,
    },
    {
      title: 'Van Golu Ekspresi Seferlere Basladi',
      content:
        'Ankara-Tatvan arasinda isleyen Van Golu Ekspresi, ' +
        'yenilenmeye tren setleri ile seferlere yeniden basladi.',
      summary: 'Van Golu Ekspresi yeniden hizmette',
      category: 'Ulasim',
      isBreaking: false,
    },
  ];

  for (const news of newsData) {
    await prisma.news.create({
      data: {
        ...news,
        authorId: admin.id,
      },
    });
  }
  console.log(`${newsData.length} haber eklendi`);

  // Turistik yerler (isletme olarak)
  const touristSpots = [
    {
      name: 'Bitlis Kalesi',
      category: 'Turizm',
      subcategory: 'Tarihi Mekan',
      description:
        'Bitlis\'in simgesi olan tarihi kale. ' +
        'Sehrin panoramik manzarasini sunar.',
      district: 'Merkez',
      latitude: 38.3946,
      longitude: 42.1232,
      address: 'Kale Mahallesi, Bitlis Merkez',
    },
    {
      name: 'Nemrut Krater Golu',
      category: 'Turizm',
      subcategory: 'Doga',
      description:
        'Turkiye\'nin en buyuk krater golu. ' +
        'Yaz aylarinda kamp ve yuzme imkani. ' +
        'Kis aylarinda buz pateni.',
      district: 'Tatvan',
      latitude: 38.6367,
      longitude: 42.2329,
      address: 'Nemrut Dagi, Tatvan',
    },
    {
      name: 'Ahlat Selcuklu Mezarligi',
      category: 'Turizm',
      subcategory: 'Tarihi Mekan',
      description:
        'Dunyanin en buyuk Turk-Islam mezarligi. ' +
        'UNESCO Dunya Mirasi Gecici Listesi\'nde.',
      district: 'Ahlat',
      latitude: 38.7523,
      longitude: 42.494,
      address: 'Ahlat, Bitlis',
    },
    {
      name: 'Zeynel Bey Turbesi',
      category: 'Turizm',
      subcategory: 'Tarihi Mekan',
      description:
        'Akkoyunlu doneminden kalma tarihi turbe. ' +
        'Emsalsiz cini susleme ornekleri.',
      district: 'Ahlat',
      latitude: 38.7489,
      longitude: 42.4873,
      address: 'Ahlat Merkez, Bitlis',
    },
    {
      name: 'Van Golu Kiyisi - Tatvan',
      category: 'Turizm',
      subcategory: 'Doga',
      description:
        'Turkiye\'nin en buyuk golu. ' +
        'Gul batan manzarasi meshurdur.',
      district: 'Tatvan',
      latitude: 38.5053,
      longitude: 42.2815,
      address: 'Tatvan Sahil, Bitlis',
    },
    {
      name: 'Sahip Ata Camii',
      category: 'Turizm',
      subcategory: 'Tarihi Mekan',
      description:
        'Bitlis merkezde bulunan tarihi cami. ' +
        'Osmanli doneminden kalma mimari eser.',
      district: 'Merkez',
      latitude: 38.4003,
      longitude: 42.1097,
      address: 'Bitlis Merkez',
    },
  ];

  for (const spot of touristSpots) {
    await prisma.business.create({
      data: {
        ...spot,
        ownerId: admin.id,
        photos: [],
        isActive: true,
      },
    });
  }
  console.log(`${touristSpots.length} turistik yer eklendi`);

  // Ornek isletmeler
  const businesses = [
    {
      name: 'Bitlis Buryan Evi',
      category: 'Restaurant',
      subcategory: 'Yerel Mutfak',
      description:
        'Bitlis\'in meshur büryan kebabi. ' +
        'Geleneksel usullerle hazirlanan lezzetler.',
      district: 'Merkez',
      address: 'Bitlis Merkez',
      latitude: 38.4012,
      longitude: 42.1105,
    },
    {
      name: 'Tatvan Sahil Kafe',
      category: 'Kafe',
      description:
        'Van Golu manzarali kafe. ' +
        'Cay, kahve ve yerel tatlar.',
      district: 'Tatvan',
      address: 'Sahil Yolu, Tatvan',
      latitude: 38.5062,
      longitude: 42.2798,
    },
    {
      name: 'Ahlat Eczanesi',
      category: 'Eczane',
      description: 'Ahlat merkez eczane.',
      district: 'Ahlat',
      address: 'Ahlat Merkez',
      latitude: 38.7534,
      longitude: 42.4956,
    },
  ];

  for (const biz of businesses) {
    await prisma.business.create({
      data: {
        ...biz,
        ownerId: admin.id,
        photos: [],
        isActive: true,
      },
    });
  }
  console.log(`${businesses.length} isletme eklendi`);

  // Ornek etkinlikler
  const now = new Date();
  const nextWeek = new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  const nextMonth = new Date(
    now.getTime() + 30 * 24 * 60 * 60 * 1000
  );

  await prisma.event.createMany({
    data: [
      {
        organizerId: admin.id,
        title: 'Bitlis Kultur Festivali',
        description:
          'Yillik kultur festivali. Konserler, ' +
          'sergiler ve yerel lezzetler.',
        location: 'Bitlis Sehir Merkezi',
        latitude: 38.4003,
        longitude: 42.1097,
        startsAt: nextWeek,
        endsAt: new Date(
          nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000
        ),
        category: 'Festival',
        isFree: true,
        maxAttendees: 5000,
      },
      {
        organizerId: admin.id,
        title: 'Nemrut Dagi Trekking Etkinligi',
        description:
          'Nemrut Krater Golu\'ne grup yuruyusu. ' +
          'Rehber esliginde.',
        location: 'Nemrut Dagi, Tatvan',
        latitude: 38.6367,
        longitude: 42.2329,
        startsAt: nextMonth,
        category: 'Spor',
        isFree: false,
        ticketPrice: 50,
        maxAttendees: 100,
      },
    ],
  });
  console.log('2 etkinlik eklendi');

  // Ornek ilanlar
  await prisma.listing.createMany({
    data: [
      {
        sellerId: admin.id,
        title: '3+1 Daire Bitlis Merkez',
        description:
          'Bitlis merkezde 120m2, 3+1, kombili, ' +
          'asansorlu daire. Manzarali.',
        category: 'Emlak',
        subcategory: 'Satilik Daire',
        price: 1500000,
        isNegotiable: true,
        district: 'Merkez',
        photos: [],
      },
      {
        sellerId: admin.id,
        title: 'iPhone 15 Pro Max',
        description:
          'Kutusunda, garantili, cizik yok.',
        category: 'Elektronik',
        subcategory: 'Telefon',
        price: 65000,
        isNegotiable: true,
        district: 'Tatvan',
        photos: [],
      },
      {
        sellerId: admin.id,
        title: 'Garson Araniyor - Tatvan',
        description:
          'Sahil kafemize deneyimli garson araniyor. ' +
          'Yemek + sigorta dahil.',
        category: 'Is',
        subcategory: 'Garson',
        price: 25000,
        isNegotiable: false,
        district: 'Tatvan',
        photos: [],
      },
    ],
  });
  console.log('3 ilan eklendi');

  console.log('Seed tamamlandi!');
}

main()
  .catch((e) => {
    console.error('Seed hatasi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
