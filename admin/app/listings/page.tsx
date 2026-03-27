export default function ListingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">İlanlar</h1>
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
                Fiyat
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Durum
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
                Henüz ilan yok
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
