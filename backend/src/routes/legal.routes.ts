import { Router } from 'express';

const router = Router();

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
