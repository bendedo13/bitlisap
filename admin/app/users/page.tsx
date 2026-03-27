export default function UsersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Kullanıcılar
        </h1>
        <input
          type="text"
          placeholder="Kullanıcı ara..."
          className="border rounded-lg px-4 py-2 w-64"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Ad Soyad
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Telefon
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                İlçe
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Tip
              </th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                Puan
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
                Henüz kullanıcı yok
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
