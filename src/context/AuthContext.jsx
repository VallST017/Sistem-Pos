import { createContext, useContext, useState } from 'react'
 
export const USERS = [
  { username: 'owner', password: '123', nama: 'Pak Rudi', role: 'owner', label: 'Owner' },
  { username: 'kepala', password: '123', nama: 'Rina', role: 'kepala_toko', label: 'Kepala Toko' },
  { username: 'keuangan', password: '123', nama: 'Andi', role: 'keuangan', label: 'Bagian Keuangan' },
  { username: 'akunting', password: '123', nama: 'Maya', role: 'akunting', label: 'Akunting' },
  { username: 'gudang', password: '123', nama: 'Sari', role: 'kepala_gudang', label: 'Kepala Gudang' },
  { username: 'kasir', password: '123', nama: 'Budi', role: 'kasir', label: 'Kasir' },
  { username: 'sales', password: '123', nama: 'Dewi', role: 'sales', label: 'Sales' },
]
 
const Ctx = createContext()
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pos-user'))
    } catch {
      return null
    }
  })
 
  // mengembalikan data user jika berhasil, null jika gagal
  const login = (username, password) => {
    const u = USERS.find((x) => x.username === username && x.password === password)
    if (!u) return null
    setUser(u)
    localStorage.setItem('pos-user', JSON.stringify(u))
    return u
  }
 
  const logout = () => {
    setUser(null)
    localStorage.removeItem('pos-user')
  }
 
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}
 
export const useAuth = () => useContext(Ctx)
