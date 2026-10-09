import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, User, Lock, Eye, EyeOff, ShieldCheck, Boxes, BookOpen } from 'lucide-react'
import { useAuth, USERS } from '../context/AuthContext'
import { MENU } from '../menu'

const DESKRIPSI = {
  owner: 'Dasbor kinerja & laporan',
  kepala: 'Otorisasi diskon, void, hapus buku',
  keuangan: 'Kas, neraca, arus kas',
  akunting: 'Jurnal & rekonsiliasi',
  gudang: 'Stok, opname, penerimaan',
  kasir: 'Pembayaran & struk',
  sales: 'Order pelanggan',
}

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [lihat, setLihat] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    const u = login(username, password)
    if (!u) return alert('Username atau password salah')
    nav(MENU.find((m) => m.allow.includes(u.role)).to)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl"><Store size={26} /></div>
          <span className="text-xl font-bold">Sistem POS</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Kelola toko lebih rapi,<br />dari kasir sampai laporan.
          </h1>
          <p className="text-indigo-100 mb-8 max-w-md">
            Satu transaksi otomatis memengaruhi stok, jurnal akuntansi, dan laporan keuangan.
          </p>
          <ul className="space-y-3 text-indigo-50">
            <li className="flex items-center gap-3"><ShieldCheck size={20} /> Hak akses sesuai peran (RBAC)</li>
            <li className="flex items-center gap-3"><Boxes size={20} /> Stok dan kartu stok real-time</li>
            <li className="flex items-center gap-3"><BookOpen size={20} /> Jurnal dan laporan otomatis</li>
          </ul>
        </div>
        <p className="text-sm text-indigo-200">Tugas Kelompok: Perancangan Sistem POS & Akuntansi Toko</p>
      </div>

      <div className="flex items-center justify-center p-6 bg-slate-50">
        <form onSubmit={submit} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6 text-indigo-700 font-bold text-lg">
            <Store size={22} /> Sistem POS
          </div>
          <h2 className="text-2xl font-bold">Selamat datang</h2>
          <p className="text-sm text-slate-500 mb-6">Masuk sesuai peran Anda</p>

          <div className="relative mb-3">
            <User size={18} className="absolute left-3 top-3 text-slate-400" />
            <input className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="relative mb-4">
            <Lock size={18} className="absolute left-3 top-3 text-slate-400" />
            <input className="w-full border border-slate-300 rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type={lihat ? 'text' : 'password'} placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setLihat(!lihat)} className="absolute right-3 top-3 text-slate-400">
              {lihat ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 font-semibold">
            Masuk
          </button>

          <p className="text-xs text-slate-400 mt-6 mb-2">Akun uji (password 123), klik untuk mengisi:</p>
          <div className="grid grid-cols-2 gap-2">
            {USERS.map((u) => (
              <button key={u.username} type="button"
                onClick={() => { setUsername(u.username); setPassword('123') }}
                className={'text-left border rounded-lg px-3 py-2 hover:border-indigo-400 ' +
                  (username === u.username ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white')}>
                <div className="text-sm font-semibold">{u.label}</div>
                <div className="text-xs text-slate-500">{DESKRIPSI[u.username]}</div>
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  )
}