import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
 
export default function ProtectedRoute({ allow, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!allow.includes(user.role)) {
    return (
      <div className="bg-white rounded-xl p-6 shadow text-red-700">
        Akses ditolak. Peran {user.label} tidak boleh membuka halaman ini.
      </div>
    )
  }
  return children
}
