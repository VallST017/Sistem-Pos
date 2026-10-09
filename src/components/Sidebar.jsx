import { NavLink, useNavigate } from 'react-router-dom'
import { Home, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { MENU } from '../menu'
 
export default function Sidebar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
 
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-200 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600 p-2 rounded-xl"><Home size={22} /></div>
        <div>
          <div className="font-bold text-white">Sistem POS</div>
          <div className="text-xs text-slate-400">Terintegrasi</div>
        </div>
      </div>
 
      <div className="text-xs text-slate-500 mb-2">MENU UTAMA</div>
      <nav className="flex flex-col gap-1">
        {MENU.filter((m) => m.allow.includes(user.role)).map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) =>
              'flex items-center gap-3 px-3 py-2 rounded-lg ' +
              (isActive ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800')
            }
          >
            <m.icon size={18} /> {m.label}
          </NavLink>
        ))}
      </nav>
 
      <div className="mt-auto">
        <div className="bg-slate-800 rounded-lg p-3 mb-3 text-sm">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={14} /> Otoritas Akses:
          </div>
          <div className="font-semibold text-white">{user.label}</div>
        </div>
        <button
          onClick={() => { logout(); nav('/login') }}
          className="flex items-center gap-2 text-red-400 px-3 py-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
