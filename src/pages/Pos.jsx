import { useState } from 'react'
import { useStore, rp } from '../data/store'
import { useAuth } from '../context/AuthContext'
 
export default function Pos() {
  const { data, jual, ambilOrder, ajukan } = useStore()
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [diskonId, setDiskonId] = useState('')
  const [persen, setPersen] = useState(5)
 
  const produk = (id) => data.produk.find((p) => p.id === id)
  const tambah = (p) => {
    const ada = cart.find((c) => c.id === p.id)
    const qty = ada ? ada.qty + 1 : 1
    if (qty > p.stok) return alert('Stok tidak cukup')
    setCart(ada ? cart.map((c) => (c.id === p.id ? { ...c, qty } : c)) : [...cart, { id: p.id, qty }])
  }
 
  const bruto = cart.reduce((a, c) => a + c.qty * produk(c.id).hargaJual, 0)
  const diskonOk = data.approvals.filter((a) => a.jenis === 'Diskon' && a.status === 'disetujui' && !a.dipakai)
  const dsk = diskonOk.find((a) => a.id === diskonId)
  const potongan = dsk ? Math.round((bruto * dsk.detail.persen) / 100) : 0
 
  const bayar = () => {
    if (!cart.length) return alert('Keranjang kosong')
    const no = jual(cart, user, dsk ? dsk.id : null)
    alert('Pembayaran berhasil\nStruk: ' + no + '\nTotal: ' + rp(bruto - potongan))
    setCart([])
    setDiskonId('')
  }
 
  const ambil = (id) => setCart(ambilOrder(id).items)
 
  const ajukanDiskon = () => {
    if (!cart.length) return alert('Isi keranjang dulu')
    ajukan('Diskon', { persen: Number(persen) }, 'Diskon ' + persen + '% (belanja ' + rp(bruto) + ')', user)
    alert('Diskon diajukan ke Kepala Toko')
  }
 
  const ajukanVoid = (s) => {
    ajukan('Void', { ref: s.id }, 'Void ' + s.id + ' (' + rp(s.net) + ')', user)
    alert('Void diajukan ke Kepala Toko')
  }
 
  const voidMenunggu = (id) =>
    data.approvals.some((a) => a.jenis === 'Void' && a.detail.ref === id && a.status === 'menunggu')
 
  return (
    <div>
      <h1 className="text-2xl font-bold">Transaksi & POS</h1>
      <p className="text-sm text-slate-500 mb-4">Pembayaran dan cetak struk.</p>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {data.produk.map((p) => (
              <button key={p.id} onClick={() => tambah(p)}
                className="bg-white rounded-xl p-4 text-left shadow hover:ring-2 ring-indigo-400">
                <div className="font-semibold">{p.nama}</div>
                <div className="text-sm text-slate-500">{rp(p.hargaJual)} | stok {p.stok}</div>
              </button>
            ))}
          </div>
 
          <div className="bg-white rounded-xl p-4 shadow mb-4">
            <h2 className="font-bold mb-2">Antrean order dari Sales</h2>
            {data.orders.length === 0 && <p className="text-sm text-slate-400">Tidak ada order.</p>}
            {data.orders.map((o) => (
              <div key={o.id} className="flex justify-between items-center text-sm py-1 border-t">
                <span>{o.id} - {o.pelanggan}</span>
                <button onClick={() => ambil(o.id)} className="border rounded px-3 py-1">Ambil</button>
              </div>
            ))}
          </div>
 
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-bold mb-2">Transaksi terakhir</h2>
            {data.penjualan.length === 0 && <p className="text-sm text-slate-400">Belum ada transaksi.</p>}
            {[...data.penjualan].reverse().slice(0, 5).map((s) => (
              <div key={s.id} className="flex justify-between items-center text-sm py-1 border-t">
                <span>{s.id} - {rp(s.net)} ({s.status})</span>
                {s.status === 'sah' && (
                  <button disabled={voidMenunggu(s.id)} onClick={() => ajukanVoid(s)}
                    className="border rounded px-3 py-1 disabled:opacity-40">
                    {voidMenunggu(s.id) ? 'Menunggu persetujuan' : 'Ajukan void'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
 
        <div className="bg-white rounded-xl p-4 shadow h-fit">
          <h2 className="font-bold mb-3">Keranjang</h2>
          {cart.length === 0 && <p className="text-sm text-slate-400">Belum ada barang.</p>}
          {cart.map((c) => (
            <div key={c.id} className="flex justify-between text-sm py-1">
              <span>{produk(c.id).nama} x{c.qty}</span><span>{rp(c.qty * produk(c.id).hargaJual)}</span>
            </div>
          ))}
 
          <div className="border-t mt-3 pt-3 text-sm">
            <label className="font-semibold">Diskon (harus disetujui)</label>
            <select className="w-full border rounded-lg px-2 py-1 mt-1 mb-2" value={diskonId}
              onChange={(e) => setDiskonId(e.target.value)}>
              <option value="">Tanpa diskon</option>
              {diskonOk.map((a) => <option key={a.id} value={a.id}>{a.ringkas}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="number" min="1" max="50" className="border rounded px-2 py-1 w-20"
                value={persen} onChange={(e) => setPersen(e.target.value)} />
              <button onClick={ajukanDiskon} className="border rounded px-3 py-1">Ajukan diskon %</button>
            </div>
          </div>
 
          <div className="border-t mt-3 pt-3 text-sm flex justify-between"><span>Subtotal</span><span>{rp(bruto)}</span></div>
          <div className="text-sm flex justify-between"><span>Diskon</span><span>- {rp(potongan)}</span></div>
          <div className="font-bold flex justify-between mt-1"><span>Total</span><span>{rp(bruto - potongan)}</span></div>
          <button onClick={bayar} className="w-full mt-4 bg-indigo-600 text-white rounded-lg py-2 font-semibold">
            Bayar & Cetak Struk
          </button>
          <button onClick={() => { setCart([]); setDiskonId('') }} className="w-full mt-2 text-sm text-slate-500">Kosongkan</button>
        </div>
      </div>
    </div>
  )
}
