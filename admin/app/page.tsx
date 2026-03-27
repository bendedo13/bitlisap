function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-1">
            {value}
          </p>
          <p className="text-green-500 text-sm mt-1">
            {change}
          </p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Toplam Kullanıcı"
          value="0"
          change="+0 bu hafta"
          icon="👥"
        />
        <StatCard
          title="Aktif İlan"
          value="0"
          change="+0 bu hafta"
          icon="📋"
        />
        <StatCard
          title="İşletme"
          value="0"
          change="+0 bu hafta"
          icon="🏢"
        />
        <StatCard
          title="Haber"
          value="0"
          change="+0 bu hafta"
          icon="📰"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Son Kayıtlar
          </h2>
          <p className="text-gray-400">
            Henüz kayıt yok
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Son Şikayetler
          </h2>
          <p className="text-gray-400">
            Henüz şikayet yok
          </p>
        </div>
      </div>
    </div>
  );
}
