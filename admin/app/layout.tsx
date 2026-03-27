import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bitlis Şehrim - Admin',
  description: 'Bitlis Şehrim Yönetim Paneli',
};

function Sidebar() {
  const links = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/users', label: 'Kullanıcılar', icon: '👥' },
    { href: '/businesses', label: 'İşletmeler', icon: '🏢' },
    { href: '/listings', label: 'İlanlar', icon: '📋' },
    { href: '/news', label: 'Haberler', icon: '📰' },
    { href: '/reports', label: 'Şikayetler', icon: '🚨' },
  ];

  return (
    <aside className="w-64 bg-[#1B4F72] min-h-screen p-4">
      <h1 className="text-white text-xl font-bold mb-8 px-2">
        Bitlis Şehrim
      </h1>
      <nav className="space-y-1">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition"
          >
            <span className="mr-3">{link.icon}</span>
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
