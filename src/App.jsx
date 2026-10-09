import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { MENU } from './menu'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Beranda from './pages/Beranda'
import Order from './pages/Order'
import Pos from './pages/Pos'
import Gudang from './pages/Gudang'
import Persetujuan from './pages/Persetujuan'
import Jurnal from './pages/Jurnal'
import Laporan from './pages/Laporan'

const HALAMAN = {
  '/beranda': <Beranda />,
  '/order': <Order />,
  '/pos': <Pos />,
  '/gudang': <Gudang />,
  '/persetujuan': <Persetujuan />,
  '/jurnal': <Jurnal />,
  '/laporan': <Laporan />,
}

function Layout() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8"><Outlet /></main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        {MENU.map((m) => (
          <Route key={m.to} path={m.to}
            element={<ProtectedRoute allow={m.allow}>{HALAMAN[m.to]}</ProtectedRoute>} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}