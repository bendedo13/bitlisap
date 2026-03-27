export default function BusinessesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">İşletmeler</h1>
        <div className="flex gap-2">
          <select className="border rounded-lg px-3 py-2">
            <option>Tüm Kategoriler</option>
            <option>Restaurant</option>
            <option>Kafe</option>
            <option>Market</option>
            <option>Eczane</option>
            <option>Turizm</option>
          </select>
          <input
            type="text"
            placeholder="İşletme ara..."
            className="border rounded-lg px-4 py-2 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                İşletme Adı
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Kategori
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                İlçe
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Puan
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Premium
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-gray-400"
              >
                Henüz işletme yok
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
