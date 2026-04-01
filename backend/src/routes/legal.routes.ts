import { Router } from 'express';

const router = Router();

// ─── Gizlilik Politikası ────────────────────────────────────────────────────
const PRIVACY = {
  title: 'Gizlilik Politikası',
  version: '2.0',
  updatedAt: '2026-04-01',
  sections: [
    {
      heading: '1. Veri Sorumlusu',
      body:
        'Bitlis Şehrim mobil uygulaması ve altyapı hizmetleri, 6698 sayılı Kişisel Verilerin ' +
        'Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla işletilmektedir. ' +
        'İletişim: kvkk@bitlissehrim.com',
    },
    {
      heading: '2. Toplanan Kişisel Veriler',
      body:
        'Üyelik ve kullanım sürecinde aşağıdaki veriler işlenebilir:\n' +
        '• Kimlik verisi: Ad-soyad\n' +
        '• İletişim verisi: E-posta adresi, telefon numarası (isteğe bağlı)\n' +
        '• Profil verisi: Yaş, meslek, ilçe, cinsiyet (isteğe bağlı)\n' +
        '• Konum verisi: Uygulama içi harita erişimi için anlık konum (yetki verildiyse)\n' +
        '• Cihaz verisi: Bildirim tokeni (FCM), işletim sistemi, uygulama sürümü\n' +
        '• Kullanım verisi: Görüntülenen sayfalar, içerik etkileşimleri, oturum bilgileri\n' +
        '• Kullanıcı üretimi içerik: İlan, yorum, mesaj ve yüklenen görseller',
    },
    {
      heading: '3. Kişisel Verilerin İşlenme Amaçları',
      body:
        'Verileriniz;\n' +
        '• Hesap oluşturma ve kimlik doğrulama,\n' +
        '• Haber, ilan, işletme ve etkinlik hizmetlerinin sunulması,\n' +
        '• Uygulama içi mesajlaşma altyapısının çalıştırılması,\n' +
        '• Yetkili mercilere karşı yasal yükümlülüklerin yerine getirilmesi,\n' +
        '• Dolandırıcılık ve güvenlik ihlallerinin önlenmesi,\n' +
        '• Hizmet kalitesinin ölçülmesi ve iyileştirilmesi amacıyla işlenmektedir.',
    },
    {
      heading: '4. Hukuki Dayanaklar',
      body:
        'Verileriniz KVKK Madde 5 kapsamında;\n' +
        '• Açık rızanız (konum, bildirim),\n' +
        '• Sözleşmenin kurulması ve ifası (hesap bilgileri),\n' +
        '• Meşru menfaat (güvenlik, hizmet iyileştirme),\n' +
        '• Kanuni yükümlülük (resmi talepler)\n' +
        'hukuki dayanaklarına istinaden işlenmektedir.',
    },
    {
      heading: '5. Üçüncü Taraflarla Paylaşım',
      body:
        'Kişisel verileriniz;\n' +
        '• Cloudinary (görsel depolama — kurumsal güvence altında),\n' +
        '• Firebase / Google (push bildirimler),\n' +
        '• Railway / Supabase (veritabanı altyapısı)\n' +
        'teknik hizmet sağlayıcılarıyla; veri işleme sözleşmeleri kapsamında ve ' +
        'yalnızca hizmetin gerektirdiği ölçüde paylaşılmaktadır. ' +
        'Üçüncü taraflara ticari amaçla veri satışı yapılmamaktadır.',
    },
    {
      heading: '6. Verilerin Saklanma Süresi',
      body:
        'Verileriniz hesabınız aktif olduğu sürece saklanır. Hesap silme talebinde ' +
        'kişisel veriler en geç 30 gün içinde anonimleştirilir veya silinir. ' +
        'Yasal saklama yükümlülükleri saklı kalmak kaydıyla bu süreler uygulanır.',
    },
    {
      heading: '7. KVKK Kapsamındaki Haklarınız',
      body:
        'KVKK Madde 11 gereği;\n' +
        '• Verilerinizin işlenip işlenmediğini öğrenme,\n' +
        '• İşlenmişse bilgi talep etme,\n' +
        '• İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,\n' +
        '• Yurt içi/yurt dışı aktarımlar hakkında bilgi alma,\n' +
        '• Eksik/yanlış verilerin düzeltilmesini isteme,\n' +
        '• Silme veya yok edilmesini talep etme,\n' +
        '• İtiraz etme ve zararın giderilmesini talep etme\n' +
        'haklarına sahipsiniz. Başvurular için: kvkk@bitlissehrim.com',
    },
    {
      heading: '8. Çerezler ve Yerel Depolama',
      body:
        'Uygulama; cihazınızda oturum bilgisi, tercihler ve önbellek verisi ' +
        'saklamak için Expo SecureStore ve AsyncStorage kullanır. ' +
        'Bu veriler yalnızca cihazınızda depolanır ve sunucuya gönderilmez.',
    },
    {
      heading: '9. Güvenlik Tedbirleri',
      body:
        'Verileriniz HTTPS (TLS 1.3) şifreleme, bcrypt parola hashleme, ' +
        'JWT token doğrulama ve rol tabanlı erişim kontrolleri ile korunmaktadır. ' +
        'Güvenlik açığı bildirimleri için: guvenlik@bitlissehrim.com',
    },
    {
      heading: '10. Politika Değişiklikleri',
      body:
        'Bu politika güncellendiğinde uygulama içi bildirim ve e-posta yoluyla ' +
        'kullanıcılar bilgilendirilecektir. Değişikliklerin yürürlük tarihinden ' +
        'itibaren uygulamayı kullanmaya devam etmeniz kabul anlamına gelir.',
    },
  ],
};

// ─── Kullanım Koşulları ─────────────────────────────────────────────────────
const TERMS = {
  title: 'Kullanım Koşulları ve Kullanıcı Sözleşmesi',
  version: '2.0',
  updatedAt: '2026-04-01',
  sections: [
    {
      heading: '1. Taraflar ve Konu',
      body:
        'Bu sözleşme; Bitlis Şehrim uygulamasını ("Platform") işleten taraf ile ' +
        'uygulamayı kullanan gerçek veya tüzel kişi ("Kullanıcı") arasında akdedilmiştir. ' +
        'Uygulamayı kullanmaya başlamanızla bu koşulları kabul etmiş sayılırsınız.',
    },
    {
      heading: '2. Hizmetin Kapsamı',
      body:
        'Bitlis Şehrim; Bitlis ili ve ilçelerinde yaşayan, çalışan veya seyahat eden ' +
        'bireylere yerel haber, ilan, işletme rehberi, etkinlik takvimi, acil bildirimler, ' +
        'mesajlaşma ve topluluk özellikleri sunan dijital bir şehir platformudur.',
    },
    {
      heading: '3. Hesap Açma Koşulları',
      body:
        '• En az 13 yaşında olmanız zorunludur.\n' +
        '• Gerçek ve doğru bilgilerle kayıt yükümlüsünüz.\n' +
        '• Kurumsal üyelikte işletme adı ve vergi kimlik numarası zorunludur.\n' +
        '• Bir kişi/işletme adına yalnızca bir hesap açılabilir.\n' +
        '• Hesap güvenliğinden (şifre, cihaz) tamamen siz sorumlusunuz.',
    },
    {
      heading: '4. Yasak İçerik ve Davranışlar',
      body:
        'Platformda aşağıdakiler kesinlikle yasaktır:\n' +
        '• Yanıltıcı, asılsız veya aldatmaca içerik paylaşmak\n' +
        '• Nefret söylemi, ırkçılık, ayrımcılık veya şiddete teşvik\n' +
        '• Başkasının kişisel verilerini izinsiz paylaşmak\n' +
        '• Telif hakkı ihlali (izinsiz içerik kopyalama)\n' +
        '• Spam, istenmeyen ticari mesaj gönderimi\n' +
        '• Platform sistemlerine yetkisiz erişim girişimi\n' +
        '• Sahte işletme veya kimlik oluşturmak',
    },
    {
      heading: '5. İçerik Hakları',
      body:
        'Platformda paylaştığınız içeriklerin (metin, fotoğraf, yorum) fikri mülkiyet ' +
        'hakları size aittir. Paylaşım yaparak; Bitlis Şehrim\'e içeriği platform ' +
        'hizmetleri kapsamında kullanmak, görüntülemek ve önbelleğe almak için ' +
        'gayri münhasır, kullanım ücreti gerektirmeyen bir lisans vermiş olursunuz.',
    },
    {
      heading: '6. Moderasyon ve Hesap Askıya Alma',
      body:
        'Platform yetkilileri yukarıdaki kurallara aykırı içerikleri önceden ' +
        'bildirmeksizin kaldırabilir. Tekrarlayan ihlallerde hesap geçici olarak ' +
        'askıya alınabilir veya kalıcı olarak kapatılabilir. ' +
        'Hesap kapatma kararlarına itiraz için destek@bitlissehrim.com adresine ' +
        '7 gün içinde başvurabilirsiniz.',
    },
    {
      heading: '7. Ücretli Özellikler',
      body:
        'Öne çıkarma, reklam ve premium ilan gibi ücretli özellikler ayrı fiyat ' +
        'listeleri ile sunulur. Ödeme koşulları ve iade politikası, satın alım ' +
        'ekranında açıkça belirtilmektedir. Dijital içerik kapsamındaki satışlarda ' +
        'Türk hukuku uyarınca belirtilen koşullar geçerlidir.',
    },
    {
      heading: '8. Sorumluluk Sınırlaması',
      body:
        'Bitlis Şehrim kullanıcılar arasında aracı konumundadır. ' +
        'Kullanıcıların birbirleriyle yaptığı işlemlerden, gerçeğe aykırı ilanlardan ' +
        'veya üçüncü taraf bağlantılarından kaynaklanan zararlardan doğrudan sorumluluk ' +
        'kabul edilmemektedir. Hizmet "olduğu gibi" sunulmakta; teknik kesintiler için ' +
        'belirli uptime garantisi verilmemektedir.',
    },
    {
      heading: '9. Uygulanacak Hukuk ve Uyuşmazlık Çözümü',
      body:
        'Bu sözleşme Türk hukuku kapsamında değerlendirilir. ' +
        'Uyuşmazlıklarda Bitlis Mahkemeleri ve İcra Daireleri yetkilidir. ' +
        'Tüketici şikayetleri için Bitlis İl Tüketici Hakem Heyeti\'ne başvurabilirsiniz.',
    },
    {
      heading: '10. Sözleşme Değişiklikleri',
      body:
        'Bu koşullar önceden bildirim yapılarak güncellenebilir. ' +
        'Güncellemeler yürürlüğe girdiğinde uygulamayı kullanmaya devam etmeniz ' +
        'yeni koşulları kabul ettiğiniz anlamına gelir.',
    },
  ],
};

// ─── KVKK Aydınlatma Metni ──────────────────────────────────────────────────
const KVKK = {
  title: 'KVKK Aydınlatma Metni',
  version: '2.0',
  updatedAt: '2026-04-01',
  sections: [
    {
      heading: 'Veri Sorumlusu Kimliği',
      body:
        '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu ' +
        'olarak Bitlis Şehrim Dijital Hizmetler, Bitlis adresinde faaliyet göstermektedir. ' +
        'İletişim: kvkk@bitlissehrim.com',
    },
    {
      heading: 'İşlenen Kişisel Veriler',
      body:
        'Ad-soyad, e-posta adresi, telefon numarası (isteğe bağlı), ilçe/adres bilgisi, ' +
        'yaş ve cinsiyet (isteğe bağlı), cihaz kimlik ve bildirim tokeni, ' +
        'uygulama kullanım ve etkileşim kayıtları.',
    },
    {
      heading: 'Kişisel Verilerin İşlenme Amaçları',
      body:
        'KVKK Madde 5/2(c) sözleşmenin ifası, Madde 5/2(ç) hukuki yükümlülük, ' +
        'Madde 5/2(f) meşru menfaat ve gerektiğinde açık rıza hukuki dayanaklarıyla;\n' +
        '• Üyelik oluşturma ve hesap yönetimi\n' +
        '• Haber, ilan, etkinlik ve işletme hizmetlerinin sunulması\n' +
        '• Uygulama içi anlık bildirim gönderimi\n' +
        '• Güvenlik, dolandırıcılık önleme\n' +
        '• Yasal yükümlülüklerin yerine getirilmesi',
    },
    {
      heading: 'Kişisel Verilerin Aktarılması',
      body:
        'Kişisel verileriniz; bulut altyapı ve görsel depolama hizmetleri (Cloudinary), ' +
        'push bildirim hizmetleri (Firebase/Google), veritabanı hizmetleri için ' +
        'KVKK Madde 8-9 kapsamında yurt içi ve yurt dışı teknik iş ortaklarına aktarılabilir. ' +
        'Bu aktarımlar, teknik güvenlik tedbirleri ve sözleşmesel güvenceler çerçevesinde yapılmaktadır.',
    },
    {
      heading: 'Veri Sahibinin Hakları (KVKK Madde 11)',
      body:
        'Dilekçeyle veya kvkk@bitlissehrim.com adresine e-posta ile;\n' +
        '• Verilerinizin işlenip işlenmediğini sorgulama,\n' +
        '• İşlenen veriler hakkında bilgi alma,\n' +
        '• İşleme amacını ve amacına uygunluğunu öğrenme,\n' +
        '• Yurt içi/dışı aktarım bilgisi talep etme,\n' +
        '• Eksik veya yanlış verilerin düzeltilmesini isteme,\n' +
        '• Silinmesini veya yok edilmesini talep etme,\n' +
        '• İşlemenin hukuki sonuçlarına itiraz etme,\n' +
        '• Zararın tazminini talep etme\n' +
        'haklarını kullanabilirsiniz. Başvurular en geç 30 iş günü içinde yanıtlanır.',
    },
    {
      heading: 'Başvuru Yöntemi',
      body:
        'Başvurularınızı elektronik posta ile kvkk@bitlissehrim.com adresine iletebilirsiniz. ' +
        'Başvuruda ad-soyad, T.C. kimlik numarası (doğrulama amacıyla), iletişim bilgisi ' +
        've talep konusunu belirtmeniz gerekmektedir.',
    },
  ],
};

// ─── Hakkımızda ─────────────────────────────────────────────────────────────
const ABOUT = {
  title: 'Hakkımızda',
  version: '1.0',
  updatedAt: '2026-04-01',
  sections: [
    {
      heading: 'Bitlis Şehrim Nedir?',
      body:
        'Bitlis Şehrim; Van Gölü\'nün batı kıyısında, Türkiye\'nin en estetik tarihi ' +
        'şehirlerinden biri olan Bitlis\'i dijital dünyayla buluşturan yerel bir ' +
        'platformdur. Haber, ilan, işletme rehberi, etkinlik takibi ve topluluk ' +
        'özellikleriyle şehrin nabzını tek uygulamada tutuyoruz.',
    },
    {
      heading: 'Misyonumuz',
      body:
        'Bitlisli vatandaşların günlük yaşamını kolaylaştırmak; yerel esnafın ' +
        'dijital varlığını güçlendirmek ve Bitlis\'i ziyaret eden turistlere ' +
        'güvenilir, güncel bir rehber olmak. Şehrin tarihini, kültürünü ve ' +
        'doğal güzelliklerini ön plana çıkarmak.',
    },
    {
      heading: 'Vizyonumuz',
      body:
        'Türkiye\'nin doğusunda yaşayan insanların hayatına değer katan, ' +
        'yerel kimliği dijital platformlarda layıkıyla temsil eden öncü ' +
        'şehir uygulaması olmak. Bitlis Şehrim\'i yalnızca Bitlis değil, ' +
        'bölgedeki tüm şehirler için bir model haline getirmek.',
    },
    {
      heading: 'Bitlis Hakkında',
      body:
        'Bitlis; 3.000 yıllık geçmişiyle Anadolu\'nun en köklü yerleşim ' +
        'alanlarından biridir. MS 4. yüzyıldan kalma Bitlis Kalesi, UNESCO Geçici ' +
        'Listesi\'ndeki Ahlat Selçuklu Mezarlığı, Nemrut Krater Gölü ve ' +
        'coğrafi işaret tescilli büryan kebabıyla benzersiz bir kültür ve ' +
        'lezzet mirasına ev sahipliği yapmaktadır.',
    },
    {
      heading: 'Özelliklerimiz',
      body:
        '• Anlık yerel haberler ve son dakika bildirimleri\n' +
        '• Bitlis geneli işletme rehberi ve harita\n' +
        '• Ücretsiz ilan ve ikinci el pazarı\n' +
        '• Etkinlik takvimi ve bilet takibi\n' +
        '• Gerçek zamanlı hava durumu (Bitlis ve ilçeleri)\n' +
        '• Acil durum bildirimleri ve deprem takibi\n' +
        '• Şehir içi mesajlaşma\n' +
        '• Esnaf kampanya ve duyuruları\n' +
        '• Van Gölü Ekspresi ve toplu taşıma bilgileri',
    },
    {
      heading: 'İletişim',
      body:
        'Öneri, şikâyet ve iş birliği talepleriniz için:\n' +
        'E-posta: destek@bitlissehrim.com\n' +
        'KVKK başvuruları: kvkk@bitlissehrim.com\n' +
        'Sosyal medya: @bitlissehrim\n\n' +
        'Bitlis Şehrim ile şehriniz her zaman yanınızda.',
    },
  ],
};

router.get('/privacy', (_req, res) => {
  res.json(PRIVACY);
});

router.get('/terms', (_req, res) => {
  res.json(TERMS);
});

router.get('/kvkk', (_req, res) => {
  res.json(KVKK);
});

router.get('/about', (_req, res) => {
  res.json(ABOUT);
});

export default router;


const PRIVACY = {
  title: 'Gizlilik Sozlesmesi',
  version: '1.0',
  updatedAt: '2026-03-28',
  sections: [
    {
      heading: '1. Veri sorumlusu',
      body:
        'Bitlis Sehrim mobil uygulamasi ve ilgili API, kullanici verilerini ' +
        'hizmet sunumu, guvenlik ve yasal yukumlulukler cercevesinde isler.',
    },
    {
      heading: '2. Toplanan veriler',
      body:
        'Telefon numarasi (OTP ile dogrulama), profil bilgileri (istege bagli), ' +
        'cihaz bildirim tokeni (FCM), uygulama kullanim loglari ve ' +
        'icerik olusturma sirasinda paylastiginiz metin ve gorseller.',
    },
    {
      heading: '3. Kullanim amaclari',
      body:
        'Kimlik dogrulama, ilan/haber/isletme hizmetleri, mesajlasma, ' +
        'bildirimler, dolandiricilik onleme ve hizmet iyilestirme.',
    },
    {
      heading: '4. Saklama ve guvenlik',
      body:
        'Veriler makul teknik ve idari onlemlerle korunur. Zorunlu sure ' +
        'sonunda veya talep halinde silinir / anonimlestirilir.',
    },
    {
      heading: '5. Haklariniz',
      body:
        'KVKK ve ilgili mevzuat kapsaminda erisim, duzeltme, silme ve ' +
        'itiraz haklarinizi kullanmak icin uygulama icindeki iletisim ' +
        'kanallarini veya veri sorumlusunu kullanabilirsiniz.',
    },
  ],
};

const TERMS = {
  title: 'Kullanim Sartlari',
  version: '1.0',
  updatedAt: '2026-03-28',
  sections: [
    {
      heading: '1. Hizmet',
      body:
        'Bitlis Sehrim, Bitlis ve cevresi icin haber, ilan, isletme ve ' +
        'topluluk ozellikleri sunan bir dijital sehir platformudur.',
    },
    {
      heading: '2. Hesap ve sorumluluk',
      body:
        'Hesabinizin guvenliginden siz sorumlusunuz. Yanlis veya yaniltici ' +
        'ilan, nefret soylemi, yasadisi icerik ve spam yasaktir.',
    },
    {
      heading: '3. Icerik ve moderasyon',
      body:
        'Kurallara aykiri icerik kaldirilabilir; tekrarlayan ihlallerde ' +
        'hesap askiya alinabilir veya sonlandirilabilir.',
    },
    {
      heading: '4. Ucretli ozellikler',
      body:
        'On plana cikarma gibi ucretli ozellikler ayrica duzenlenir; ' +
        'odeme ve iade kosullari ilan sirasinda bildirilir.',
    },
    {
      heading: '5. Sorumluluk sinirlamasi',
      body:
        'Platform kullanicilar arasi iletisimde araci roldedir. Kullanicilarin ' +
        'birbirleriyle yaptigi anlasmalardan dogan uyusmazliklarda ' +
        'dogrudan sorumluluk kabul edilmez.',
    },
  ],
};

router.get('/privacy', (_req, res) => {
  res.json(PRIVACY);
});

router.get('/terms', (_req, res) => {
  res.json(TERMS);
});

export default router;
