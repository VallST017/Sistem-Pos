import { useState } from 'react'
import { useStore, rp } from '../data/store'
import { useAuth } from '../context/AuthContext'
 
export default function Order() {
  const { data, simpanOrder } = useStore()
  const { user } = useAuth()
  const [pelanggan, setPelanggan] = useState('')
  const [cart, setCart] = useState([])
 
  const produk = (id) => data.produk.find((p) => p.id === id)
  const tambah = (p) => {
    const ada = cart.find((c) => c.id === p.id)
    const qty = ada ? ada.qty + 1 : 1
    if (qty > p.stok) return alert('Stok tidak cukup')
    setCart(ada ? cart.map((c) => (c.id === p.id ? { ...c, qty } : c)) : [...cart, { id: p.id, qty }])
  }
  const total = cart.reduce((a, c) => a + c.qty * produk(c.id).hargaJual, 0)
 
  const simpan = () => {
    if (!pelanggan.trim()) return alert('Isi nama pelanggan')
    if (!cart.length) return alert('Keranjang kosong')
    const id = simpanOrder(cart, pelanggan, user)
    alert('Order ' + id + ' tersimpan. Kasir dapat mengambilnya.')
    setCart([])
    setPelanggan('')
  }
 
  return (
    <div>
      <h1 className="text-2xl font-bold">Order Pelanggan</h1>
      <p className="text-sm text-slate-500 mb-4">Pencatatan order oleh Sales.</p>
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
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="font-bold mb-2">Antrean order</h2>
            {data.orders.length === 0 && <p className="text-sm text-slate-400">Belum ada order.</p>}
            {data.orders.map((o) => (
              <div key={o.id} className="text-sm py-1 border-t">{o.id} - {o.pelanggan} ({o.items.length} jenis barang)</div>
            ))}
          </div>
        </div>
 
        <div className="bg-white rounded-xl p-4 shadow h-fit">
          <h2 className="font-bold mb-3">Order baru</h2>
          <input className="w-full border rounded-lg px-3 py-2 mb-3" placeholder="Nama pelanggan"
            value={pelanggan} onChange={(e) => setPelanggan(e.target.value)} />
          {cart.map((c) => (
            <div key={c.id} className="flex justify-between text-sm py-1">
              <span>{produk(c.id).nama} x{c.qty}</span><span>{rp(c.qty * produk(c.id).hargaJual)}</span>
            </div>
          ))}
          <div className="border-t mt-3 pt-3 font-bold flex justify-between"><span>Total</span><span>{rp(total)}</span></div>
          <button onClick={simpan} className="w-full mt-4 bg-indigo-600 text-white rounded-lg py-2 font-semibold">Simpan Order</button>
        </div>
      </div>
    </div>
  )
}
