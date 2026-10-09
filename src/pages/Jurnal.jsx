import { useStore, rp, hitungSaldo } from '../data/store'
 
export default function Jurnal() {
  const { data } = useStore()
  const saldo = hitungSaldo(data.jurnal)
  const nilaiJurnal = saldo['Persediaan'] || 0
  const nilaiStok = data.produk.reduce((a, p) => a + p.stok * p.hargaBeli, 0)
  const selisih = nilaiJurnal - nilaiStok
  const totalDebit = data.jurnal.reduce((a, j) => a + j.nilai, 0)
 
  return (
    <div>
      <h1 className="text-2xl font-bold">Jurnal Akuntansi</h1>
      <p className="text-sm text-slate-500 mb-4">Posting otomatis dari setiap transaksi.</p>
 
      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <h2 className="font-bold mb-3">Rekonsiliasi persediaan</h2>
        <div className="text-sm">Nilai persediaan menurut jurnal: <b>{rp(nilaiJurnal)}</b></div>
        <div className="text-sm">Nilai stok menurut kartu stok (qty x harga beli): <b>{rp(nilaiStok)}</b></div>
        <div className={'text-sm font-bold ' + (selisih === 0 ? 'text-green-700' : 'text-red-600')}>
          Selisih: {rp(selisih)} {selisih === 0 ? '(cocok)' : '(perlu diperiksa)'}
        </div>
        <div className="text-sm mt-2 text-slate-500">Total debit = total kredit = {rp(totalDebit)}</div>
      </div>
 
      <div className="bg-white rounded-xl shadow p-6 mb-4 overflow-x-auto">
        <h2 className="font-bold mb-3">Jurnal umum</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th className="py-2">Waktu</th><th>Keterangan</th><th>Akun</th><th className="text-right">Debit</th><th className="text-right">Kredit</th></tr></thead>
          <tbody>
            {data.jurnal.map((j, i) => [
              <tr key={i + 'd'} className="border-t">
                <td className="py-1">{j.waktu}</td><td>{j.ket}</td><td>{j.debit}</td><td className="text-right">{rp(j.nilai)}</td><td></td>
              </tr>,
              <tr key={i + 'k'}>
                <td></td><td></td><td className="pl-6">{j.kredit}</td><td></td><td className="text-right">{rp(j.nilai)}</td>
              </tr>,
            ])}
          </tbody>
        </table>
      </div>
 
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="font-bold mb-3">Log audit</h2>
        {data.auditLog.length === 0 && <p className="text-sm text-slate-400">Belum ada aktivitas.</p>}
        {[...data.auditLog].reverse().map((l, i) => (
          <div key={i} className="text-sm border-t py-1">{l.waktu} | {l.user} | {l.aksi}</div>
        ))}
      </div>
    </div>
  )
}
