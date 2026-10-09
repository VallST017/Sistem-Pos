import { useStore } from '../data/store'
import { useAuth } from '../context/AuthContext'
 
export default function Persetujuan() {
  const { data, putuskan } = useStore()
  const { user } = useAuth()
  const antre = data.approvals.filter((a) => a.status === 'menunggu')
  const riwayat = data.approvals.filter((a) => a.status !== 'menunggu').reverse()
 
  const proses = (id, setuju) => {
    const err = putuskan(id, setuju, user)
    if (err) alert(err)
  }
 
  return (
    <div>
      <h1 className="text-2xl font-bold">Persetujuan</h1>
      <p className="text-sm text-slate-500 mb-4">Otorisasi diskon, void, dan hapus buku.</p>
 
      <div className="bg-white rounded-xl shadow p-6 mb-4">
        <h2 className="font-bold mb-3">Menunggu keputusan ({antre.length})</h2>
        {antre.length === 0 && <p className="text-sm text-slate-400">Tidak ada pengajuan.</p>}
        {antre.map((a) => (
          <div key={a.id} className="flex flex-wrap justify-between items-center gap-2 border-t py-2 text-sm">
            <div>
              <b>{a.jenis}</b>: {a.ringkas}
              <div className="text-xs text-slate-500">{a.id} | diajukan {a.pengaju} | {a.waktu}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => proses(a.id, true)} className="bg-green-600 text-white rounded px-3 py-1">Setujui</button>
              <button onClick={() => proses(a.id, false)} className="bg-red-600 text-white rounded px-3 py-1">Tolak</button>
            </div>
          </div>
        ))}
      </div>
 
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold mb-3">Riwayat keputusan</h2>
        {riwayat.length === 0 && <p className="text-sm text-slate-400">Belum ada.</p>}
        {riwayat.map((a) => (
          <div key={a.id} className="border-t py-2 text-sm">
            {a.jenis}: {a.ringkas} -{' '}
            <span className={a.status === 'disetujui' ? 'text-green-700' : 'text-red-600'}>{a.status}</span> oleh {a.oleh}
          </div>
        ))}
      </div>
    </div>
  )
}
