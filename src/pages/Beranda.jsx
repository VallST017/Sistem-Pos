import { Link } from 'react-router-dom'
import { useStore, rp, hitungSaldo } from '../data/store'
import { useAuth } from '../context/AuthContext'
import { MENU } from '../menu'

function Kartu({ judul, nilai }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-indigo-500">
      <div className="text-sm text-slate-500">{judul}</div>
      <div className="text-2xl font-bold mt-1">{nilai}</div>
    </div>
  )
}

export default function Beranda() {
  const { data } = useStore()
  const { user } = useAuth()
  const s = hitungSaldo(data.jurnal)
  const sah = data.penjualan.filter((p) => p.status === 'sah')
  const omzet = sah.reduce((a, p) => a + p.net, 0)
  const menunggu = data.approvals.filter((a) => a.status === 'menunggu').length
  const menipis = data.produk.filter((p) => p.stok <= 10)
  const nilaiStok = data.produk.reduce((a, p) => a + p.stok * p.hargaBeli, 0)

  const KARTU = {
    owner: [['Omzet', rp(omzet)], ['Transaksi sah', sah.length], ['Saldo kas', rp(s.Kas || 0)], ['Nilai persediaan', rp(nilaiStok)]],
    kepala_toko: [['Menunggu persetujuan', menunggu], ['Transaksi sah', sah.length], ['Omzet', rp(omzet)], ['Stok menipis', menipis.length]],
    keuangan: [['Saldo kas', rp(s.Kas || 0)], ['Utang usaha', rp(-(s['Utang Usaha'] || 0))], ['Omzet', rp(omzet)]],
    akunting: [['Jumlah jurnal', data.jurnal.length], ['Laba berjalan', rp(-(s.Penjualan || 0) - (s['Diskon Penjualan'] || 0) - (s.HPP || 0) - (s['Kerugian Persediaan'] || 0) - (s['Selisih Persediaan'] || 0))], ['Nilai persediaan', rp(s.Persediaan || 0)]],
    kepala_gudang: [['Jenis barang', data.produk.length], ['Total stok', data.produk.reduce((a, p) => a + p.stok, 0)], ['Stok menipis', menipis.length], ['Pengajuan menunggu', data.approvals.filter((a) => a.jenis === 'Hapus Buku' && a.status === 'menunggu').length]],
    kasir: [['Transaksi hari ini', sah.length], ['Total penjualan', rp(omzet)], ['Antrean order', data.orders.length]],
    sales: [['Order menunggu kasir', data.orders.length], ['Jenis barang', data.produk.length]],
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Halo, {user.nama}</h1>
      <p className="text-sm text-slate-500 mb-6">Masuk sebagai {user.label}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {KARTU[user.role].map((k) => <Kartu key={k[0]} judul={k[0]} nilai={k[1]} />)}
      </div>

      <h2 className="font-bold mb-3">Pintasan</h2>
      <div className="flex flex-wrap gap-3 mb-8">
        {MENU.filter((m) => m.to !== '/beranda' && m.allow.includes(user.role)).map((m) => (
          <Link key={m.to} to={m.to} className="flex items-center gap-2 bg-white rounded-xl shadow px-4 py-3 hover:ring-2 ring-indigo-400">
            <m.icon size={18} /> {m.label}
          </Link>
        ))}
      </div>

      {menipis.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded p-4">
          <div className="font-bold text-amber-800 mb-1">Stok menipis</div>
          {menipis.map((p) => <div key={p.id} className="text-sm text-amber-800">{p.nama}: sisa {p.stok}</div>)}
        </div>
      )}
    </div>
  )
}