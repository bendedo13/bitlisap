export default function NewsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Haberler</h1>
        <button className="bg-[#1B4F72] text-white px-4 py-2 rounded-lg hover:bg-[#2E86C1] transition">
          + Haber Ekle
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Başlık
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Kategori
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Tarih
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Görüntülenme
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={5}
                className="px-6 py-8 text-center text-gray-400"
              >
                Henüz haber yok
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
