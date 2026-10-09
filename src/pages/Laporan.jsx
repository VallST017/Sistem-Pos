import { useState } from 'react'
import { useStore, rp, hitungSaldo } from '../data/store'
import { useAuth } from '../context/AuthContext'
 
const TAB = {
  penjualan: 'Penjualan', persediaan: 'Rekap Persediaan',
  labarugi: 'Laba Rugi', neraca: 'Neraca', aruskas: 'Arus Kas',
}
const AKSES = {
  owner: ['penjualan', 'persediaan', 'labarugi', 'neraca', 'aruskas'],
  kepala_toko: ['penjualan', 'persediaan'],
  keuangan: ['aruskas', 'neraca'],
  akunting: ['labarugi', 'neraca', 'aruskas', 'persediaan'],
}
 
function Tabel({ judul, baris }) {
  return (
    <div>
      <h2 className="font-bold mb-3">{judul}</h2>
      <table className="w-full text-sm">
        <tbody>
          {baris.map((b, i) => (
            <tr key={i} className={'border-t ' + (b[2] ? 'font-bold' : '')}>
              <td className="py-2">{b[0]}</td><td className="text-right">{b[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
export default function Laporan() {
  const { data } = useStore()
  const { user } = useAuth()
  const tabs = AKSES[user.role]
  const [tab, setTab] = useState(tabs[0])
 
  const s = hitungSaldo(data.jurnal)
  const g = (k) => s[k] || 0
  const pen = -g('Penjualan')
  const laba = pen - g('Diskon Penjualan') - g('HPP') - g('Kerugian Persediaan') - g('Selisih Persediaan')
  const sum = (f) => data.jurnal.filter(f).reduce((a, j) => a + j.nilai, 0)
  const nilaiStok = data.produk.reduce((a, p) => a + p.stok * p.hargaBeli, 0)
 
  return (
    <div>
      <h1 className="text-2xl font-bold">Laporan</h1>
      <p className="text-sm text-slate-500 mb-4">Peran: {user.label}</p>
      <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1 shadow w-fit mb-4">
        {tabs.map((k) => (
          <button key={k} onClick={() => setTab(k)}
            className={'px-4 py-2 rounded-lg text-sm font-semibold ' + (tab === k ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600')}>
            {TAB[k]}
          </button>
        ))}
      </div>
 
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        {tab === 'penjualan' && (
          <Tabel judul="Laporan Penjualan" baris={[
            ...data.penjualan.map((p) => [p.id + ' (' + p.status + ') ' + p.waktu, rp(p.net)]),
            ['Total penjualan sah', rp(data.penjualan.filter((p) => p.status === 'sah').reduce((a, p) => a + p.net, 0)), true],
          ]} />
        )}
        {tab === 'persediaan' && (
          <Tabel judul="Rekap Persediaan" baris={[
            ...data.produk.map((p) => [p.nama + ' (' + p.stok + ' x ' + rp(p.hargaBeli) + ')', rp(p.stok * p.hargaBeli)]),
            ['Total nilai persediaan', rp(nilaiStok), true],
          ]} />
        )}
        {tab === 'labarugi' && (
          <Tabel judul="Laporan Laba Rugi" baris={[
            ['Penjualan', rp(pen)],
            ['Diskon penjualan', '- ' + rp(g('Diskon Penjualan'))],
            ['Harga pokok penjualan', '- ' + rp(g('HPP'))],
            ['Kerugian persediaan', '- ' + rp(g('Kerugian Persediaan'))],
            ['Selisih persediaan (lebih)', rp(-g('Selisih Persediaan'))],
            ['Laba bersih', rp(laba), true],
          ]} />
        )}
        {tab === 'neraca' && (
          <Tabel judul="Neraca" baris={[
            ['Kas', rp(g('Kas'))],
            ['Persediaan', rp(g('Persediaan'))],
            ['Total aset', rp(g('Kas') + g('Persediaan')), true],
            ['Utang usaha', rp(-g('Utang Usaha'))],
            ['Modal', rp(-g('Modal'))],
            ['Laba berjalan', rp(laba)],
            ['Total kewajiban + ekuitas', rp(-g('Utang Usaha') - g('Modal') + laba), true],
          ]} />
        )}
        {tab === 'aruskas' && (
          <Tabel judul="Laporan Arus Kas" baris={[
            ['Setoran modal awal', rp(sum((j) => j.debit === 'Kas' && j.kredit === 'Modal'))],
            ['Kas masuk dari penjualan', rp(sum((j) => j.debit === 'Kas' && j.kredit === 'Penjualan'))],
            ['Kas keluar (void/refund)', '- ' + rp(sum((j) => j.kredit === 'Kas'))],
            ['Saldo kas akhir', rp(g('Kas')), true],
          ]} />
        )}
      </div>
    </div>
  )
}
