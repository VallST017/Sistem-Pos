import { useState } from 'react'
import { useStore, rp } from '../data/store'
import { useAuth } from '../context/AuthContext'
 
function Penerimaan() {
  const { data, terimaBarang } = useStore()
  const { user } = useAuth()
  const [pid, setPid] = useState('')
  const [qty, setQty] = useState(10)
  const nama = (id) => data.produk.find((p) => p.id === id)?.nama
 
  const terima = () => {
    const p = data.produk.find((x) => x.id === Number(pid))
    if (!p) return alert('Pilih produk dulu')
    if (qty < 1) return alert('Jumlah minimal 1')
    terimaBarang(p.id, Number(qty), user)
    alert('Barang diterima. Jurnal Persediaan / Utang Usaha tercatat.')
  }
 
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="border rounded-lg px-3 py-2" value={pid} onChange={(e) => setPid(e.target.value)}>
          <option value="">-- Pilih Produk --</option>
          {data.produk.map((p) => <option key={p.id} value={p.id}>{p.nama} (harga beli {rp(p.hargaBeli)})</option>)}
        </select>
        <input type="number" min="1" className="border rounded-lg px-3 py-2 w-28" value={qty}
          onChange={(e) => setQty(Number(e.target.value))} />
        <button onClick={terima} className="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold">Terima Barang</button>
      </div>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-slate-500"><th className="py-2">No</th><th>Produk</th><th>Qty</th><th>Nilai (utang)</th></tr></thead>
        <tbody>
          {data.pembelian.length === 0 && <tr><td colSpan="4" className="py-4 text-slate-400">Belum ada penerimaan.</td></tr>}
          {data.pembelian.map((b) => (
            <tr key={b.id} className="border-t"><td className="py-2">{b.id}</td><td>{nama(b.produkId)}</td><td>{b.qty}</td><td>{rp(b.nilai)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
function StokOpname() {
  const { data, opname } = useStore()
  const { user } = useAuth()
  const [fisik, setFisik] = useState({})
 
  const cek = (p) => {
    const v = fisik[p.id]
    if (v === undefined || v === '') return alert('Isi jumlah fisik dulu')
    if (Number(v) === p.stok) return alert('Fisik sama dengan sistem. Tidak ada selisih.')
    opname(p.id, Number(v), user)
    setFisik({ ...fisik, [p.id]: '' })
  }
 
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-left text-slate-500"><th className="py-2">Produk</th><th>Stok sistem</th><th>Stok fisik</th><th></th></tr></thead>
      <tbody>
        {data.produk.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="py-2">{p.nama}</td>
            <td>{p.stok}</td>
            <td>
              <input type="number" min="0" className="border rounded px-2 py-1 w-24" value={fisik[p.id] ?? ''}
                onChange={(e) => setFisik({ ...fisik, [p.id]: e.target.value })} />
            </td>
            <td><button onClick={() => cek(p)} className="bg-indigo-600 text-white px-3 py-1 rounded">Sesuaikan</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
 
function KartuStok() {
  const { data } = useStore()
  const nama = (id) => data.produk.find((p) => p.id === id)?.nama
  const baris = [...data.kartuStok].reverse()
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-left text-slate-500"><th className="py-2">Waktu</th><th>Produk</th><th>Jenis</th><th>Qty</th><th>Referensi</th></tr></thead>
      <tbody>
        {baris.length === 0 && <tr><td colSpan="5" className="py-4 text-slate-400">Belum ada pergerakan stok.</td></tr>}
        {baris.map((k, i) => (
          <tr key={i} className="border-t">
            <td className="py-2">{k.waktu}</td><td>{nama(k.produkId)}</td><td>{k.jenis}</td>
            <td className={k.qty < 0 ? 'text-red-600' : 'text-green-700'}>{k.qty}</td><td>{k.ref}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
 
function HapusBuku() {
  const { data, ajukan } = useStore()
  const { user } = useAuth()
  const [pid, setPid] = useState('')
  const [jml, setJml] = useState(1)
  const [alasan, setAlasan] = useState('')
 
  const proses = () => {
    const p = data.produk.find((x) => x.id === Number(pid))
    if (!p) return alert('Pilih produk dulu')
    if (jml < 1 || jml > p.stok) return alert('Jumlah tidak valid (stok tersedia ' + p.stok + ')')
    if (!alasan.trim()) return alert('Alasan wajib diisi')
    ajukan('Hapus Buku', { produkId: p.id, jumlah: Number(jml), alasan }, p.nama + ' x' + jml + ' - ' + alasan, user)
    alert('Pengajuan dikirim ke Kepala Toko')
    setJml(1)
    setAlasan('')
  }
 
  const saya = data.approvals.filter((a) => a.jenis === 'Hapus Buku').reverse()
 
  return (
    <div className="max-w-xl mx-auto">
      <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded mb-6">
        <div className="font-bold text-red-700">Hapus Buku (Write-off)</div>
        <p className="text-sm text-red-700">
          Gunakan fitur ini hanya untuk mencatat barang rusak, hilang, atau kadaluarsa.
          Setelah disetujui Kepala Toko, aksi ini akan mengurangi stok dan tercatat dalam log audit.
        </p>
      </div>
      <label className="text-sm font-semibold">Pilih Produk</label>
      <select className="w-full border rounded-lg px-3 py-2 mb-4 mt-1" value={pid} onChange={(e) => setPid(e.target.value)}>
        <option value="">-- Pilih Produk --</option>
        {data.produk.map((p) => <option key={p.id} value={p.id}>{p.nama} (stok {p.stok})</option>)}
      </select>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold">Jumlah Dikurangi</label>
          <input type="number" min="1" className="w-full border rounded-lg px-3 py-2 mt-1"
            value={jml} onChange={(e) => setJml(Number(e.target.value))} />
        </div>
        <div>
          <label className="text-sm font-semibold">Alasan</label>
          <input className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="Contoh: Barang Rusak/Expired"
            value={alasan} onChange={(e) => setAlasan(e.target.value)} />
        </div>
      </div>
      <button onClick={proses} className="w-full bg-red-600 text-white font-bold rounded-lg py-3">Ajukan Hapus Buku</button>
 
      <h3 className="font-bold mt-8 mb-2 text-sm">Status pengajuan</h3>
      {saya.length === 0 && <p className="text-sm text-slate-400">Belum ada pengajuan.</p>}
      {saya.map((a) => (
        <div key={a.id} className="border-t py-2 text-sm">{a.ringkas} - <b>{a.status}</b></div>
      ))}
    </div>
  )
}
 
const TABS = [
  { k: 'terima', label: 'Penerimaan Barang' },
  { k: 'opname', label: 'Stok Opname' },
  { k: 'kartu', label: 'Kartu Pergerakan Stok' },
  { k: 'writeoff', label: 'Hapus Buku (Write-off)' },
]
 
export default function Gudang() {
  const [tab, setTab] = useState('terima')
  return (
    <div>
      <h1 className="text-2xl font-bold">Manajemen Gudang & Inventori</h1>
      <p className="text-sm text-slate-500 mb-4">Penerimaan, Stok Opname, Pergerakan Stok, dan Penyesuaian Hapus Buku</p>
      <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1 shadow w-fit mb-4">
        {TABS.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={'px-4 py-2 rounded-lg text-sm font-semibold ' + (tab === t.k ? 'bg-red-50 text-red-600' : 'text-slate-600')}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        {tab === 'terima' && <Penerimaan />}
        {tab === 'opname' && <StokOpname />}
        {tab === 'kartu' && <KartuStok />}
        {tab === 'writeoff' && <HapusBuku />}
      </div>
    </div>
  )
}
