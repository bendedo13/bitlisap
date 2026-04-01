import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bitlis Şehrim seed başlatılıyor...');

  // ─── Admin Kullanıcı ─────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin1234!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bitlissehrim.com' },
    update: {},
    create: {
      email: 'admin@bitlissehrim.com',
      passwordHash: adminHash,
      phone: '+905001234567',
      fullName: 'Bitlis Admin',
      district: 'Merkez',
      userType: 'ADMIN',
      isVerified: true,
      cityPoints: 1000,
    },
  });
  console.log('✅ Admin oluşturuldu:', admin.id);

  // ─── Test Kurumsal Üye ────────────────────────────────────────
  const bizHash = await bcrypt.hash('Biz1234!', 12);
  const bizUser = await prisma.user.upsert({
    where: { email: 'isletme@bitlissehrim.com' },
    update: {},
    create: {
      email: 'isletme@bitlissehrim.com',
      passwordHash: bizHash,
      phone: '+905001234568',
      fullName: 'Ahmet Esnaf',
      district: 'Merkez',
      userType: 'BUSINESS',
      businessName: 'Bitlis Büryan Evi',
      taxNo: '12345678901',
      isVerified: true,
      cityPoints: 100,
    },
  });
  console.log('✅ Kurumsal üye oluşturuldu:', bizUser.id);

  // ─── 30 Güncel Bitlis Haberi ──────────────────────────────────
  const newsItems = [
    {
      title: 'Bitlis Kalesi Restorasyon Çalışmaları Tamamlandı',
      summary: 'Kültür Bakanlığı desteğiyle Bitlis Kalesi tarihi surları yeniden ayağa kaldırıldı.',
      content: 'Bitlis Kalesi\'nin surlarının ve iç mekanlarının restorasyonu 3 yıl süren kapsamlı çalışmalar sonucunda tamamlandı. Kültür ve Turizm Bakanlığı tarafından yürütülen proje kapsamında kalenin tarihi surları güçlendirildi, gezinti yolları yenilendi ve aydınlatma sistemleri modernize edildi. Projeye toplam 45 milyon TL kaynak ayrıldı.',
      category: 'Kültür',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Bitlis_castle.jpg/1280px-Bitlis_castle.jpg',
      tags: ['kale', 'restorasyon', 'kültür', 'turizm'],
    },
    {
      title: 'Nemrut Krater Gölü Turizm Sezonu Açıldı',
      summary: 'Türkiye\'nin en büyük krater gölü Nemrut, mayıs ayıyla birlikte ziyaretçilere kapılarını açtı.',
      content: 'Tatvan\'da yer alan ve Türkiye\'nin en büyük krater gölü olan Nemrut, 2026 yaz turizm sezonuna hazır. Tatvan Belediyesi\'nin yaptığı altyapı yatırımları sayesinde yola ulaşım kolaylaştı. Haziran-ekim döneminde gölde kamp, yüzme ve doğa yürüyüşü yapılabilecek.',
      category: 'Turizm',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Nemrut_G%C3%B6l%C3%BC.jpg/1280px-Nemrut_G%C3%B6l%C3%BC.jpg',
      tags: ['nemrut', 'göl', 'turizm', 'tatvan'],
    },
    {
      title: 'Ahlat Selçuklu Mezarlığı UNESCO Listesinde',
      summary: 'Dünyanın en büyük Türk-İslam mezarlığı UNESCO Geçici Listesi\'ndeki yerini koruyor.',
      content: 'Bitlis\'in Ahlat ilçesinde bulunan Selçuklu Mezarlığı, UNESCO Dünya Mirası Geçici Listesi\'ndeki konumunu güçlendirdi. Arkeologlar bu yıl başlattıkları yeni kazılarla mezarlıkta daha önce belgelenmemiş 200\'ü aşkın yeni mezar taşı keşfetti.',
      category: 'Kültür',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Eski_Ahlat_Sehir_Mezarl%C4%B1g%C4%B1.jpg/1280px-Eski_Ahlat_Sehir_Mezarl%C4%B1g%C4%B1.jpg',
      tags: ['ahlat', 'selçuklu', 'arkeoloji', 'UNESCO'],
    },
    {
      title: 'Bitlis\'te Kar Yağışı Yolları Kapattı — Son Dakika',
      summary: 'Gece saatlerinde başlayan yoğun kar yağışı Bitlis-Van karayolunu ulaşıma kapattı.',
      content: 'Dün gece saat 22:00\'de başlayan yoğun kar yağışı Bitlis merkezde 40 cm\'e ulaştı. Bitlis-Van D-300 karayolu çığ riski nedeniyle trafiğe kapatıldı. Karayolları ekipleri aralıksız çalışıyor; yolun 6 saat içinde açılması bekleniyor. Vatandaşların zorunlu olmadıkça yola çıkmaması uyarısı yapıldı.',
      category: 'Gündem',
      isBreaking: true,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1543373072-eec0e5cc4cd1?w=800',
      tags: ['kar', 'yol', 'ulaşım', 'son dakika'],
    },
    {
      title: 'Van Gölü Ekspresi Yenilenen Setlerle Seferlere Başladı',
      summary: 'Ankara-Tatvan arasında işleyen tarihi tren yenilendi, bilet talebi patlama yaptı.',
      content: 'TCDD tarafından restore edilen Van Gölü Ekspresi, modern klimalı set ve panoramik vagonlarla Ankara-Tatvan seferlerine yeniden başladı. Hafta sonu seferleri için 2 aylık biletlerin neredeyse tamamı doldu.',
      category: 'Ulaşım',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800',
      tags: ['tren', 'tatvan', 'ulaşım', 'turizm'],
    },
    {
      title: 'Bitlis Büryan Kebabı Coğrafi İşaret Aldı',
      summary: 'Tescil belgesi Ticaret Bakanlığı tarafından Bitlis Büryan Usta Derneği\'ne teslim edildi.',
      content: 'Bitlis yöresine özgü büryan kebabı artık resmi coğrafi işarete sahip. Bu tescil, hem üreticileri koruyacak hem de turizmi teşvik edecek.',
      category: 'Ekonomi',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      tags: ['büryan', 'coğrafi işaret', 'gastronomi'],
    },
    {
      title: 'Hizan\'da Ekoturizm Köy Evi Projesi Başlatıldı',
      summary: 'Kültür Bakanlığı ve Hizan Belediyesi ortaklığıyla 15 köy evini kapsayan proje hayata geçiyor.',
      content: 'Hizan ilçesinde başlatılan ekoturizm projesi kapsamında 15 tarihi köy evi, misafirhanelere dönüştürülecek. Projenin 2027 yılına kadar tamamlanması planlanıyor.',
      category: 'Turizm',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800',
      tags: ['hizan', 'eko-turizm', 'köy evi'],
    },
    {
      title: 'Bitlis Üniversitesi\'nde Yazılım Mühendisliği Bölümü Açılıyor',
      summary: 'Bitlis Eren Üniversitesi 2026-2027 akademik yılında yeni bölüm açıyor.',
      content: 'Bitlis Eren Üniversitesi Yönetim Kurulu, 2026-2027 akademik yılından itibaren yazılım mühendisliği bölümünün aktif olacağını açıkladı. İlk yıl 100 öğrenci kapasitesiyle açılacak bölümde yapay zeka ve mobil uygulama geliştirme ağırlıklı müfredat uygulanacak.',
      category: 'Eğitim',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      tags: ['üniversite', 'mühendislik', 'eğitim'],
    },
    {
      title: 'Tatvan Marina Projesi Çevre Bakanlığından Onay Aldı',
      summary: 'Van Gölü kıyısına yapılacak yat limanı projesi nihayet ÇED onayını geçti.',
      content: 'Tatvan ilçesinde Van Gölü kıyısına inşa edilecek marina projesi Çevre Bakanlığı\'ndan ÇED belgesi aldı. 150 tekne kapasiteli yat limanı, dinlenme alanları ve restoran kompleksi yer alacak.',
      category: 'Ekonomi',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      tags: ['tatvan', 'marina', 'van gölü'],
    },
    {
      title: 'İhlasiye Medresesi Restorasyonu Bitişi Yaklaştı',
      summary: '14. yüzyıldan kalma Bitlis Merkez\'deki İhlasiye Medresesi 2026 sonunda ziyarete açılıyor.',
      content: 'Bitlis merkezde 14. yüzyılda inşa edilen İhlasiye Medresesi\'nin restorasyon çalışmaları son aşamasına geldi. Projenin Aralık 2026\'da tamamlanması ve yapının ziyaretçilere açılması planlanıyor.',
      category: 'Kültür',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      tags: ['ihlasiye', 'medrese', 'restorasyon'],
    },
    {
      title: 'Bitlis\'te Doğalgaz Dönüşüm Oranı Yüzde 94\'e Ulaştı',
      summary: 'Şehir genelinde doğalgaz altyapısı genişletildi.',
      content: 'Bitlis Doğalgaz A.Ş. açıklamasına göre il genelinde doğalgaz abone oranı yüzde 94\'e ulaştı. 2026 kış sezonunda ısınma maliyetlerinin yüzde 20 düşmesi bekleniyor.',
      category: 'Altyapı',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1558618047-f4e60cec0ce4?w=800',
      tags: ['doğalgaz', 'altyapı', 'enerji'],
    },
    {
      title: 'Okullar Kar Tatili – Bitlis Geneli Yarın Tatil',
      summary: 'Bitlis Valiliği, tüm okullarda eğitime yarın bir gün ara verildiğini duyurdu.',
      content: 'Bitlis Valiliği saat 22:15\'te yaptığı açıklamada, yarından itibaren ilk ve ortaöğretimde eğitime bir gün ara verileceğini bildirdi. Merkez, Tatvan ve Güroymak ilçelerinde 50 cm\'i aşan kar örtüsü ulaşımı zorlaştırıyor.',
      category: 'Eğitim',
      isBreaking: true,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1576085898274-701cda3782de?w=800',
      tags: ['kar tatili', 'okul', 'valilik'],
    },
    {
      title: 'Bitlis\'te Yeni Sağlık Merkezi Hizmete Girdi',
      summary: '120 yataklı Aile Sağlığı ve Uzman Hekim Merkezi Tatvan\'da açıldı.',
      content: 'Sağlık Bakanlığı tarafından inşa edilen 120 yataklı Tatvan Aile Sağlığı Merkezi düzenlenen törenle hizmete açıldı. 24 saat acil servis de bulunuyor.',
      category: 'Sağlık',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      tags: ['sağlık', 'tatvan', 'hastane'],
    },
    {
      title: 'Nemrut Trekking Yarışması\'na Kayıtlar Başladı',
      summary: 'Her yıl düzenlenen Nemrut Zirve Koşusu 2026 kayıtları açıldı.',
      content: 'Nemrut Zirve Koşusu 2026 katılımcıları 15 Eylül\'de buluşturuyor. 2.948 metre rakıma çıkılan etkinlikte 42 km ve 21 km\'lik iki kategori bulunuyor.',
      category: 'Spor',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://images.unsplash.com/photo-1551927411-95e3fc61f9bc?w=800',
      tags: ['nemrut', 'koşu', 'spor'],
    },
    {
      title: 'Bitlis\'ten İstanbul\'a Direkt Uçuş Sayısı Artıyor',
      summary: 'THY yaz döneminde Bitlis-İstanbul seferlerini haftada 5\'e çıkarıyor.',
      content: 'Türk Hava Yolları, 1 Haziran\'dan itibaren Bitlis-Tatvan Havalimanı-İstanbul Sabiha Gökçen arasındaki sefer sayısını haftada 3\'ten 5\'e çıkaracağını açıkladı.',
      category: 'Ulaşım',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
      tags: ['uçuş', 'THY', 'tatvan'],
    },
    {
      title: 'Bitlis\'te Halk Otobüsü Filosu Elektrikli Araçlara Geçiyor',
      summary: 'Belediye 10 adet elektrikli otobüs sipariş etti.',
      content: 'Bitlis Belediyesi ulaşım filosunu çevreye duyarlı hale getirmek için 10 adet tam elektrikli otobüs sipariş etti. Yatırımın yüzde 40\'ı AB Çevre Fonu tarafından karşılanıyor.',
      category: 'Ulaşım',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800',
      tags: ['belediye', 'elektrikli otobüs', 'çevre'],
    },
    {
      title: 'Güroymak\'ta Organik Tarım Kooperatifi Kuruldu',
      summary: '47 çiftçinin bir araya gelmesiyle oluşan kooperatif ilk ihracatını gerçekleştirdi.',
      content: 'Güroymak\'ta kurulan Bitlis Organik Tarım Kooperatifi, ilk ürün partisini Hollanda ve Almanya\'ya ihraç etti.',
      category: 'Ekonomi',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4e6?w=800',
      tags: ['organik', 'tarım', 'ihracat'],
    },
    {
      title: 'Bitlis\'te Kış Sporları Merkezi Projesi Onaylandı',
      summary: 'Kayak pisti ve teleferik sistemi için ihale süreci başladı.',
      content: '3 ayrı kayak pisti, 2 teleferik ve 200 araçlık otoparkı kapsayan projenin 2028\'de tamamlanması öngörülüyor.',
      category: 'Spor',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800',
      tags: ['kayak', 'kış sporları', 'turizm'],
    },
    {
      title: 'Tatvan Balık Festivali Bu Yıl 3 Gün Sürecek',
      summary: 'Van Gölü\'nün meşhur İnci Kefalini kutlamak için festivale büyük katılım bekleniyor.',
      content: 'Her yıl Ağustos ayında düzenlenen Tatvan Balık Festivali bu yıl 3 gün olarak genişletildi. Müzik dinletileri ve fotoğraf sergisi de programa alındı.',
      category: 'Kültür',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      tags: ['tatvan', 'festival', 'balık'],
    },
    {
      title: 'Bitlis Yeni Kapalı Pazar Yeri Açıldı',
      summary: '500 esnafı barındıran modern çarşı merkezi hizmete girdi.',
      content: 'Bitlis Belediyesi\'nin 3 yıllık inşaat sürecini tamamladığı kapalı pazar yeri bugün törenle açıldı.',
      category: 'Ekonomi',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
      tags: ['pazar', 'esnaf', 'belediye'],
    },
    {
      title: 'Bitlis\'in Su Arıtma Tesisi Kapasitesi 2 Katına Çıktı',
      summary: 'Şehrin içme suyu sorununu tamamen çözecek yatırım tamamlandı.',
      content: 'Bitlis Su ve Kanalizasyon İdaresi, su arıtma kapasitesini 80.000 m³\'ten 150.000 m³\'e çıkardı.',
      category: 'Altyapı',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800',
      tags: ['su', 'altyapı', 'yatırım'],
    },
    {
      title: 'Ahlat\'ta Yeni Arkeolojik Müze Açılıyor',
      summary: 'Selçuklu eserlerini barındıran müze binası bu yaz ziyaretçilere kapılarını açıyor.',
      content: 'Müzede Ahlat ve çevresinden çıkarılan Selçuklu, Akkoyunlu ve Osmanlı dönemine ait 1.500\'den fazla eser sergilenecek. Giriş ücretsiz olacak.',
      category: 'Kültür',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1580130732478-4e339fb33746?w=800',
      tags: ['ahlat', 'müze', 'selçuklu'],
    },
    {
      title: 'Bitlis Esnafından Büyük Kış İndirimi Kampanyası',
      summary: 'Merkezdeki 120\'den fazla esnaf ortak kampanya başlattı.',
      content: 'Bitlis Belediyesi koordinasyonuyla şehir merkezindeki 120 esnaf, yüzde 20-50 arasında değişen indirimlerle "Kış Fırsatları" kampanyasını başlattı.',
      category: 'Ekonomi',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      tags: ['indirim', 'kampanya', 'esnaf'],
    },
    {
      title: 'Bitlis\'te Sera Gazı Emisyonu Düştü',
      summary: 'Doğal gaz ve yenilenebilir enerji dönüşümünün etkisiyle karbon salınımı 5 yılda yüzde 30 azaldı.',
      content: 'Bitlis İl Çevre Müdürlüğü\'nün açıkladığı rapora göre il genelinde sera gazı emisyonu 2021\'e kıyasla yüzde 30 oranında düştü.',
      category: 'Çevre',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
      tags: ['çevre', 'enerji', 'iklim'],
    },
    {
      title: 'Bitlis Kalesi\'nde Gece Yürüyüşü Etkinliği Büyük İlgi Gördü',
      summary: 'Meşale ışığıyla Bitlis Kalesi\'ni gezip tarihe yolculuk yapan 800 kişi katıldı.',
      content: 'Bitlis Kültür Müdürlüğü\'nün düzenlediği "Tarihin Işığında Kale" etkinliğine 800\'den fazla ziyaretçi katıldı. Etkinlik her cumartesi tekrarlanacak.',
      category: 'Kültür',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800',
      tags: ['kale', 'etkinlik', 'kültür'],
    },
    {
      title: 'Tatvan Gençlik Merkezi\'nde Yeni Kurslar Açıldı',
      summary: 'Ücretsiz yazılım, müzik ve dil kursları 15 Nisan\'da başlıyor.',
      content: 'Tatvan Gençlik ve Spor İlçe Müdürlüğü, ücretsiz Python programlama, gitar ve İngilizce kursları açtı. Her kursta 25 kişilik kontenjan var.',
      category: 'Eğitim',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
      tags: ['gençlik', 'tatvan', 'kurs'],
    },
    {
      title: 'Van Gölü\'nde İnci Kefalı Nüfusu Arttı',
      summary: 'Avlanma yasakları sayesinde endemik balık türü toparlandı.',
      content: 'Van Gölü\'nde yaşayan endemik İnci Kefalı popülasyonu 3 yılda yüzde 40 arttı. 2024\'te başlayan tam av yasağı bu toparlanmada belirleyici oldu.',
      category: 'Çevre',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800',
      tags: ['van gölü', 'incikefal', 'doğa'],
    },
    {
      title: 'Bitlis Devlet Hastanesi\'nde Robotik Cerrahi Dönemi',
      summary: 'Üroloji ve genel cerrahi branşlarında robotik ameliyat sistemi devreye alındı.',
      content: 'Bitlis Devlet Hastanesi Da Vinci robotik cerrahi sistemini bünyesine kattı. Prostat, böbrek ve kolon ameliyatları çok daha az invaziv biçimde gerçekleştirilebilecek.',
      category: 'Sağlık',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800',
      tags: ['sağlık', 'hastane', 'robotik'],
    },
    {
      title: 'Bitlis\'te Sokak Hayvanları Kısırlaştırma Kampanyası',
      summary: 'Belediye, 3 ayda 2 bin kedi ve köpek için kısırlaştırma ve aşılama yaptı.',
      content: 'Bitlis Belediyesi\'nin sokak hayvanları koruma projesi kapsamında 3 ayda 2.000\'i aşkın kedi ve köpek kısırlaştırıldı. Geçici barınak kapasitesi de 400\'e yükseltildi.',
      category: 'Gündem',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1601758123927-194a417d2b48?w=800',
      tags: ['hayvanlar', 'belediye'],
    },
    {
      title: 'Bitlis\'te Yatırım İklimi Güçleniyor',
      summary: 'Kalkınma Ajansı 2025 yılında 15 projeye 50 milyon TL destek sağladı.',
      content: 'Doğu Anadolu Kalkınma Ajansı (DAKA) 2025 yılı raporuna göre Bitlis\'te 15 farklı ekonomik kalkınma projesine toplam 50 milyon TL destek sağlandı.',
      category: 'Ekonomi',
      isBreaking: false,
      isOfficial: true,
      imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      tags: ['yatırım', 'kalkınma', 'ekonomi'],
    },
    {
      title: 'Bitlis Halk Eğitim Merkezi El Sanatları Sergisi',
      summary: 'Kilim, dantel ve bakır işlemeciliğinden oluşan 200 eser sergileniyor.',
      content: 'Bitlis Halk Eğitim Merkezi kursiyerlerinin ürettiği 200\'den fazla el sanatı eseri sergide görücüye çıktı. Sergi 15 Mayıs\'a kadar açık kalacak.',
      category: 'Kültür',
      isBreaking: false,
      isOfficial: false,
      imageUrl: 'https://images.unsplash.com/photo-1558171813-82a08e97d080?w=800',
      tags: ['el sanatları', 'sergi', 'kültür'],
    },
  ];

  for (const item of newsItems) {
    await prisma.news.create({ data: { ...item, authorId: admin.id } });
  }
  console.log(`✅ ${newsItems.length} haber eklendi`);

  // ─── Turistik Yerler ──────────────────────────────────────────
  const touristSpots = [
    {
      name: 'Bitlis Kalesi',
      category: 'Turizm',
      subcategory: 'Tarihi Mekân',
      description: 'MS 4. yüzyılda inşa edildiği düşünülen Bitlis Kalesi, 65 metre yüksekliğindeki kaya üstüne kurulu olup olağanüstü panoramik manzarasıyla ziyaretçileri büyülüyor.',
      district: 'Merkez',
      latitude: 38.3946,
      longitude: 42.1232,
      address: 'Kale Mahallesi, Bitlis Merkez',
      photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Bitlis_castle.jpg/1280px-Bitlis_castle.jpg'],
    },
    {
      name: 'Nemrut Krater Gölü',
      category: 'Turizm',
      subcategory: 'Doğa',
      description: 'Türkiye\'nin en büyük krater gölü. 2.948 metre rakımda yaz yüzme, kış buz pateni keyfi sunar.',
      district: 'Tatvan',
      latitude: 38.6367,
      longitude: 42.2329,
      address: 'Nemrut Dağı, Tatvan, Bitlis',
      photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Nemrut_G%C3%B6l%C3%BC.jpg/1280px-Nemrut_G%C3%B6l%C3%BC.jpg'],
    },
    {
      name: 'Ahlat Selçuklu Mezarlığı',
      category: 'Turizm',
      subcategory: 'Tarihi Mekân',
      description: 'Dünyanın en büyük Türk-İslam açık hava müzesi. UNESCO Dünya Mirası Geçici Listesi\'nde.',
      district: 'Ahlat',
      latitude: 38.7523,
      longitude: 42.494,
      address: 'Ahlat, Bitlis',
      photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Eski_Ahlat_Sehir_Mezarl%C4%B1g%C4%B1.jpg/1280px-Eski_Ahlat_Sehir_Mezarl%C4%B1g%C4%B1.jpg'],
    },
    {
      name: 'İhlasiye Medresesi',
      category: 'Turizm',
      subcategory: 'Tarihi Mekân',
      description: '14. yüzyılda inşa edilen İhlasiye Medresesi, sivri kemerli taçkapısı ve çift katlı revak düzeniyle mimarlık tarihi açısından büyük önem taşır.',
      district: 'Merkez',
      latitude: 38.3992,
      longitude: 42.1118,
      address: 'Merkez, Bitlis',
      photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    },
    {
      name: 'Van Gölü Kıyısı – Tatvan Sahili',
      category: 'Turizm',
      subcategory: 'Doğa',
      description: 'Türkiye\'nin en büyük gölünün Tatvan kıyısından izlenen gün batımı eşsiz manzara sunar.',
      district: 'Tatvan',
      latitude: 38.5053,
      longitude: 42.2815,
      address: 'Tatvan Sahil, Bitlis',
      photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
    },
    {
      name: 'Zeynel Bey Türbesi',
      category: 'Turizm',
      subcategory: 'Tarihi Mekân',
      description: 'Firuze ve lacivert çinileriyle Anadolu Türk mimarisinin en güzel örneklerinden biri sayılır.',
      district: 'Ahlat',
      latitude: 38.7489,
      longitude: 42.4873,
      address: 'Ahlat Merkez, Bitlis',
      photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Eski_Ahlat_Sehir_Mezarl%C4%B1g%C4%B1.jpg/1280px-Eski_Ahlat_Sehir_Mezarl%C4%B1g%C4%B1.jpg'],
    },
  ];

  for (const spot of touristSpots) {
    await prisma.business.create({ data: { ...spot, ownerId: admin.id, isActive: true } });
  }
  console.log(`✅ ${touristSpots.length} turistik yer eklendi`);

  // ─── Yöresel İşletmeler ───────────────────────────────────────
  const restaurants = [
    {
      name: 'Bitlis Büryan Evi',
      category: 'Restoran',
      subcategory: 'Yöresel Mutfak',
      description: 'Sabahın erken saatlerinden çukurda odun ateşiyle hazırlanan büryan kebabı ile avşor çorbası ve kelle-paça da meşhurdur.',
      district: 'Merkez',
      address: 'Çarşı Caddesi No:12, Bitlis Merkez',
      phone: '0434 226 3456',
      latitude: 38.4012,
      longitude: 42.1105,
      photos: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=800'],
      ownerId: bizUser.id,
    },
    {
      name: 'Tatvan Göl Kafe & Restoran',
      category: 'Restoran',
      subcategory: 'Kafe',
      description: 'Van Gölü manzaralı terastan İnci Kefalı ızgara ve yerel tatlar.',
      district: 'Tatvan',
      address: 'Sahil Yolu No:5, Tatvan',
      phone: '0434 827 2200',
      latitude: 38.5062,
      longitude: 42.2798,
      photos: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
      ownerId: admin.id,
    },
    {
      name: 'Ahlat Han Çay Bahçesi',
      category: 'Kafe',
      subcategory: 'Çay Bahçesi',
      description: 'Selçuklu mezarlığına bakan çay bahçesi. Yöresel gözleme ve ballı kaymak.',
      district: 'Ahlat',
      address: 'Selçuklu Caddesi No:3, Ahlat',
      phone: '0546 321 4567',
      latitude: 38.7534,
      longitude: 42.4956,
      photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
      ownerId: admin.id,
    },
    {
      name: 'Nemrut Dağ Evi',
      category: 'Restoran',
      subcategory: 'Dağ Evi',
      description: 'Nemrut yolu üzerinde yöresel tandır ekmeği, kuzulu pilav ve otlu peynir.',
      district: 'Tatvan',
      address: 'Nemrut Yolu Km.12, Tatvan',
      phone: '0532 456 7890',
      latitude: 38.59,
      longitude: 42.25,
      photos: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800'],
      ownerId: admin.id,
    },
  ];

  const createdRestaurants: Record<string, string> = {};
  for (const r of restaurants) {
    const { ownerId, ...rest } = r;
    const biz = await prisma.business.create({
      data: { ...rest, ownerId, isActive: true },
    });
    createdRestaurants[r.name] = biz.id;
  }
  console.log(`✅ ${restaurants.length} restoran eklendi`);

  // ─── Kampanyalar ──────────────────────────────────────────────
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  const buryaniId = createdRestaurants['Bitlis Büryan Evi'];
  const gozkafe = createdRestaurants['Tatvan Göl Kafe & Restoran'];
  const ahlatId = createdRestaurants['Ahlat Han Çay Bahçesi'];
  const nemrutId = createdRestaurants['Nemrut Dağ Evi'];

  if (buryaniId) {
    await prisma.campaign.createMany({
      data: [
        {
          businessId: buryaniId,
          title: 'Öğle Menüsü Büryan %20 İndirimli',
          description: 'Her gün 12:00–15:00 arası büryan menüsü %20 indirimli!',
          discount: '%20',
          imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
          startDate: yesterday,
          endDate: in30Days,
          isActive: true,
        },
        {
          businessId: buryaniId,
          title: 'Aile Paketi: 4 Porsiyon + 2 İçecek',
          description: '4 porsiyon büryan + 2 bardak ayran veya çay paketi özel fiyatla!',
          discount: '4+2 Paket',
          imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800',
          startDate: yesterday,
          endDate: in60Days,
          isActive: true,
        },
      ],
    });
  }
  if (gozkafe) {
    await prisma.campaign.create({
      data: {
        businessId: gozkafe,
        title: 'Van Gölü Manzaralı Kahvaltı — 2 Kişi 1 Fiyat',
        description: 'Sabah 08:00–11:00 arası gelen çiftlere büyük kahvaltı paketi 2 kişiye 1 kişi fiyatına!',
        discount: '2 Kişi 1 Fiyat',
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        startDate: yesterday,
        endDate: in30Days,
        isActive: true,
      },
    });
  }
  if (ahlatId) {
    await prisma.campaign.create({
      data: {
        businessId: ahlatId,
        title: 'Ballı Kaymak + Çay %15 İndirim',
        description: 'Selçuklu Mezarlığı ziyareti sonrası bize uğrayın; set %15 indirimle!',
        discount: '%15',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        startDate: yesterday,
        endDate: in30Days,
        isActive: true,
      },
    });
  }
  if (nemrutId) {
    await prisma.campaign.create({
      data: {
        businessId: nemrutId,
        title: 'Kamp + Kahvaltı Paketi — 500 TL',
        description: 'Çadır konaklama + sabah kahvaltısı: 1 kişi 500 TL (normalde 750 TL)!',
        discount: '500 TL (norm.750₺)',
        imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800',
        startDate: yesterday,
        endDate: in60Days,
        isActive: true,
      },
    });
  }
  console.log('✅ Kampanyalar eklendi');

  // ─── Taksi Durakları ──────────────────────────────────────────
  await prisma.taxi.createMany({
    data: [
      {
        name: 'Bitlis Merkez Taksi Durağı',
        district: 'Merkez',
        address: 'Cumhuriyet Meydanı, Bitlis Merkez',
        phones: ['0434 226 0000', '0532 100 2345'],
        latitude: 38.3995,
        longitude: 42.1088,
        isActive: true,
      },
      {
        name: 'Tatvan Taksi Durağı',
        district: 'Tatvan',
        address: 'Atatürk Caddesi, Tatvan',
        phones: ['0434 827 5555', '0543 210 9876'],
        latitude: 38.505,
        longitude: 42.2788,
        isActive: true,
      },
      {
        name: 'Ahlat Taksi Durağı',
        district: 'Ahlat',
        address: 'Şehit Hasan Caddesi, Ahlat',
        phones: ['0434 412 3344'],
        latitude: 38.753,
        longitude: 42.4947,
        isActive: true,
      },
    ],
  });
  console.log('✅ 3 taksi durağı eklendi');

  // ─── Eczaneler ────────────────────────────────────────────────
  await prisma.pharmacy.createMany({
    data: [
      {
        name: 'Merkez Eczanesi',
        district: 'Merkez',
        address: 'Cumhuriyet Caddesi No:5, Bitlis Merkez',
        phone: '0434 226 1111',
        latitude: 38.3991,
        longitude: 42.1079,
        isDutyToday: true,
        isActive: true,
      },
      {
        name: 'Çarşı Eczanesi',
        district: 'Merkez',
        address: 'Kapalı Çarşı Yanı, Bitlis Merkez',
        phone: '0434 226 2222',
        latitude: 38.3982,
        longitude: 42.1093,
        isDutyToday: false,
        isActive: true,
      },
      {
        name: 'Tatvan Sahil Eczanesi',
        district: 'Tatvan',
        address: 'Sahil Yolu No:8, Tatvan',
        phone: '0434 827 3333',
        latitude: 38.5045,
        longitude: 42.2763,
        isDutyToday: true,
        isActive: true,
      },
      {
        name: 'Güven Eczanesi – Tatvan',
        district: 'Tatvan',
        address: 'İstasyon Caddesi No:14, Tatvan',
        phone: '0434 827 4444',
        latitude: 38.5063,
        longitude: 42.281,
        isDutyToday: false,
        isActive: true,
      },
      {
        name: 'Ahlat Eczanesi',
        district: 'Ahlat',
        address: 'Ahlat Merkez, Bitlis',
        phone: '0434 412 5566',
        latitude: 38.7534,
        longitude: 42.4956,
        isDutyToday: false,
        isActive: true,
      },
    ],
  });
  console.log('✅ 5 eczane eklendi');

  // ─── Etkinlikler ──────────────────────────────────────────────
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.event.createMany({
    data: [
      {
        organizerId: admin.id,
        title: 'Bitlis Kültür Festivali 2026',
        description: 'Konserler, halk oyunları, yöresel yemek standları ve el sanatları sergisiyle 3 günlük büyük festival.',
        location: 'Bitlis Şehir Meydanı',
        latitude: 38.4003,
        longitude: 42.1097,
        startsAt: nextWeek,
        endsAt: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000),
        category: 'Festival',
        isFree: true,
        maxAttendees: 5000,
      },
      {
        organizerId: admin.id,
        title: 'Nemrut Dağı Trekking Etkinliği',
        description: 'Nemrut Krater Gölü\'ne profesyonel rehber eşliğinde grup yürüyüşü.',
        location: 'Nemrut Dağı, Tatvan',
        latitude: 38.6367,
        longitude: 42.2329,
        startsAt: nextMonth,
        category: 'Spor',
        isFree: false,
        ticketPrice: 150,
        maxAttendees: 80,
      },
      {
        organizerId: admin.id,
        title: 'Ahlat Tarihi Yürüyüş Turu',
        description: 'Ahlat Selçuklu Mezarlığı ve çevresinde uzman arkeolog rehberliğinde tura katılın.',
        location: 'Ahlat Selçuklu Mezarlığı',
        latitude: 38.7523,
        longitude: 42.494,
        startsAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        category: 'Kültür',
        isFree: true,
        maxAttendees: 50,
      },
    ],
  });
  console.log('✅ 3 etkinlik eklendi');

  // ─── İlanlar ─────────────────────────────────────────────────
  await prisma.listing.createMany({
    data: [
      {
        sellerId: admin.id,
        title: '3+1 Daire Satılık – Bitlis Merkez',
        description: '120m², doğalgaz kombili, asansörlü, panoramik manzaralı daire.',
        category: 'Emlak',
        subcategory: 'Satılık Daire',
        price: 3200000,
        isNegotiable: true,
        district: 'Merkez',
        photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
      },
      {
        sellerId: admin.id,
        title: 'Samsung Galaxy S25 Ultra – Kutusu Açık',
        description: '2 haftalık, kutusunda, hasarsız. Tüm aksesuarları mevcut.',
        category: 'Elektronik',
        subcategory: 'Telefon',
        price: 72000,
        isNegotiable: true,
        district: 'Tatvan',
        photos: [],
        images: [],
      },
      {
        sellerId: admin.id,
        title: 'Deneyimli Garson Aranıyor – Tatvan',
        description: 'Tatvan Göl Kafe\'mize güleryüzlü garson aranmaktadır. Yemek + sigorta dahil.',
        category: 'İş',
        subcategory: 'Garson',
        price: 30000,
        isNegotiable: false,
        district: 'Tatvan',
        photos: [],
        images: [],
      },
    ],
  });
  console.log('✅ 3 ilan eklendi');

  console.log('\n🎉 Seed tamamlandı! Bitlis Şehrim hazır.');
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
