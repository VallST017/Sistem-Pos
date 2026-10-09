import { createContext, useContext, useEffect, useState } from 'react'
 
export const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID')
 
// saldo tiap akun = total debit - total kredit
export function hitungSaldo(jurnal) {
  const s = {}
  jurnal.forEach((j) => {
    s[j.debit] = (s[j.debit] || 0) + j.nilai
    s[j.kredit] = (s[j.kredit] || 0) - j.nilai
  })
  return s
}
 
const awal = {
  seq: 1,
  produk: [
    { id: 1, nama: 'Beras 5kg', hargaBeli: 62000, hargaJual: 70000, stok: 20 },
    { id: 2, nama: 'Minyak Goreng 2L', hargaBeli: 34000, hargaJual: 39000, stok: 15 },
    { id: 3, nama: 'Gula 1kg', hargaBeli: 14000, hargaJual: 17000, stok: 30 },
    { id: 4, nama: 'Kopi Sachet (10)', hargaBeli: 9000, hargaJual: 12000, stok: 40 },
  ],
  orders: [],
  penjualan: [],
  pembelian: [],
  approvals: [],
  kartuStok: [],
  jurnal: [
    { waktu: '-', ket: 'Modal awal (kas)', debit: 'Kas', kredit: 'Modal', nilai: 5000000 },
    { waktu: '-', ket: 'Modal awal (persediaan)', debit: 'Persediaan', kredit: 'Modal', nilai: 2530000 },
  ],
  auditLog: [],
}
 
const waktu = () => new Date().toLocaleString('id-ID')
const Ctx = createContext()
 
export function StoreProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pos-data')) || awal
    } catch {
      return awal
    }
  })
 
  useEffect(() => {
    localStorage.setItem('pos-data', JSON.stringify(data))
  }, [data])
 
  const audit = (user, aksi) => ({ waktu: waktu(), user: user.nama, aksi })
 
  // ---------- SALES ----------
  const simpanOrder = (items, pelanggan, user) => {
    const id = 'ORD-' + data.seq
    setData({
      ...data,
      seq: data.seq + 1,
      orders: [...data.orders, { id, pelanggan, items, sales: user.nama }],
      auditLog: [...data.auditLog, audit(user, 'Order ' + id + ' untuk ' + pelanggan)],
    })
    return id
  }
 
  const ambilOrder = (id) => {
    const o = data.orders.find((x) => x.id === id)
    setData({ ...data, orders: data.orders.filter((x) => x.id !== id) })
    return o
  }
 
  // ---------- KASIR ----------
  const jual = (items, user, diskonId) => {
    const no = 'INV-' + data.seq
    let bruto = 0
    let hpp = 0
    items.forEach((it) => {
      const p = data.produk.find((x) => x.id === it.id)
      bruto += it.qty * p.hargaJual
      hpp += it.qty * p.hargaBeli
    })
    const dsk = data.approvals.find((a) => a.id === diskonId)
    const diskon = dsk ? Math.round((bruto * dsk.detail.persen) / 100) : 0
    const net = bruto - diskon
    const t = waktu()
    setData({
      ...data,
      seq: data.seq + 1,
      produk: data.produk.map((p) => {
        const it = items.find((i) => i.id === p.id)
        return it ? { ...p, stok: p.stok - it.qty } : p
      }),
      penjualan: [...data.penjualan, { id: no, waktu: t, items, bruto, diskon, net, hpp, status: 'sah' }],
      approvals: data.approvals.map((a) => (a.id === diskonId ? { ...a, dipakai: true } : a)),
      kartuStok: [
        ...data.kartuStok,
        ...items.map((it) => ({ waktu: t, produkId: it.id, jenis: 'Penjualan', qty: -it.qty, ref: no })),
      ],
      jurnal: [
        ...data.jurnal,
        { waktu: t, ket: 'Penjualan ' + no, debit: 'Kas', kredit: 'Penjualan', nilai: net },
        ...(diskon > 0 ? [{ waktu: t, ket: 'Diskon ' + no, debit: 'Diskon Penjualan', kredit: 'Penjualan', nilai: diskon }] : []),
        { waktu: t, ket: 'HPP ' + no, debit: 'HPP', kredit: 'Persediaan', nilai: hpp },
      ],
      auditLog: [...data.auditLog, audit(user, 'Penjualan ' + no + ' total ' + rp(net))],
    })
    return no
  }
 
  // ---------- PENGAJUAN (diskon, void, hapus buku) ----------
  const ajukan = (jenis, detail, ringkas, user) => {
    setData({
      ...data,
      seq: data.seq + 1,
      approvals: [...data.approvals, {
        id: 'APR-' + data.seq, waktu: waktu(), jenis, detail, ringkas,
        pengaju: user.nama, status: 'menunggu', dipakai: false,
      }],
      auditLog: [...data.auditLog, audit(user, 'Mengajukan ' + ringkas)],
    })
  }
 
  // ---------- KEPALA TOKO: setujui / tolak ----------
  // return null jika sukses, atau teks error
  const putuskan = (id, setuju, user) => {
    const a = data.approvals.find((x) => x.id === id)
    const t = waktu()
    const d = {
      ...data,
      approvals: data.approvals.map((x) =>
        x.id === id ? { ...x, status: setuju ? 'disetujui' : 'ditolak', oleh: user.nama } : x
      ),
      auditLog: [...data.auditLog, audit(user, (setuju ? 'Menyetujui ' : 'Menolak ') + a.ringkas)],
    }
 
    if (setuju && a.jenis === 'Void') {
      const s = data.penjualan.find((x) => x.id === a.detail.ref)
      if (s.status !== 'sah') return 'Transaksi sudah di-void'
      d.penjualan = data.penjualan.map((x) => (x.id === s.id ? { ...x, status: 'void' } : x))
      d.produk = data.produk.map((p) => {
        const it = s.items.find((i) => i.id === p.id)
        return it ? { ...p, stok: p.stok + it.qty } : p
      })
      d.kartuStok = [
        ...data.kartuStok,
        ...s.items.map((it) => ({ waktu: t, produkId: it.id, jenis: 'Void', qty: it.qty, ref: s.id })),
      ]
      d.jurnal = [
        ...data.jurnal,
        { waktu: t, ket: 'Void ' + s.id, debit: 'Penjualan', kredit: 'Kas', nilai: s.net },
        ...(s.diskon > 0 ? [{ waktu: t, ket: 'Void diskon ' + s.id, debit: 'Penjualan', kredit: 'Diskon Penjualan', nilai: s.diskon }] : []),
        { waktu: t, ket: 'Void HPP ' + s.id, debit: 'Persediaan', kredit: 'HPP', nilai: s.hpp },
      ]
    }
 
    if (setuju && a.jenis === 'Hapus Buku') {
      const { produkId, jumlah, alasan } = a.detail
      const p = data.produk.find((x) => x.id === produkId)
      if (jumlah > p.stok) return 'Stok tidak cukup untuk hapus buku'
      d.produk = data.produk.map((x) => (x.id === produkId ? { ...x, stok: x.stok - jumlah } : x))
      d.kartuStok = [...data.kartuStok, { waktu: t, produkId, jenis: 'Hapus Buku', qty: -jumlah, ref: alasan }]
      d.jurnal = [...data.jurnal, {
        waktu: t, ket: 'Hapus buku ' + p.nama + ' (' + alasan + ')',
        debit: 'Kerugian Persediaan', kredit: 'Persediaan', nilai: jumlah * p.hargaBeli,
      }]
    }
 
    setData(d)
    return null
  }
 
  // ---------- KEPALA GUDANG ----------
  const terimaBarang = (produkId, qty, user) => {
    const p = data.produk.find((x) => x.id === produkId)
    const nilai = qty * p.hargaBeli
    const t = waktu()
    const no = 'PO-' + data.seq
    setData({
      ...data,
      seq: data.seq + 1,
      produk: data.produk.map((x) => (x.id === produkId ? { ...x, stok: x.stok + qty } : x)),
      pembelian: [...data.pembelian, { id: no, waktu: t, produkId, qty, nilai }],
      kartuStok: [...data.kartuStok, { waktu: t, produkId, jenis: 'Penerimaan', qty, ref: no }],
      jurnal: [...data.jurnal, { waktu: t, ket: 'Pembelian kredit ' + no, debit: 'Persediaan', kredit: 'Utang Usaha', nilai }],
      auditLog: [...data.auditLog, audit(user, 'Terima barang ' + p.nama + ' x' + qty)],
    })
  }
 
  const opname = (produkId, fisik, user) => {
    const p = data.produk.find((x) => x.id === produkId)
    const selisih = fisik - p.stok
    if (selisih === 0) return
    const nilai = Math.abs(selisih) * p.hargaBeli
    const t = waktu()
    setData({
      ...data,
      produk: data.produk.map((x) => (x.id === produkId ? { ...x, stok: fisik } : x)),
      kartuStok: [...data.kartuStok, { waktu: t, produkId, jenis: 'Stok Opname', qty: selisih, ref: 'Fisik ' + fisik }],
      jurnal: [...data.jurnal, selisih < 0
        ? { waktu: t, ket: 'Selisih opname ' + p.nama, debit: 'Kerugian Persediaan', kredit: 'Persediaan', nilai }
        : { waktu: t, ket: 'Selisih opname ' + p.nama, debit: 'Persediaan', kredit: 'Selisih Persediaan', nilai }],
      auditLog: [...data.auditLog, audit(user, 'Opname ' + p.nama + ' (selisih ' + selisih + ')')],
    })
  }
 
  const reset = () => setData(awal)
 
  return (
    <Ctx.Provider value={{ data, simpanOrder, ambilOrder, jual, ajukan, putuskan, terimaBarang, opname, reset }}>
      {children}
    </Ctx.Provider>
  )
}
 
export const useStore = () => useContext(Ctx)
