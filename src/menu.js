import { LayoutDashboard, ClipboardList, ShoppingCart, Package, CheckSquare, BookOpen, BarChart3 } from 'lucide-react'

export const MENU = [
  { to: '/beranda', label: 'Beranda', icon: LayoutDashboard, allow: ['owner', 'kepala_toko', 'keuangan', 'akunting', 'kepala_gudang', 'kasir', 'sales'] },
  { to: '/order', label: 'Order Pelanggan', icon: ClipboardList, allow: ['sales'] },
  { to: '/pos', label: 'Transaksi & POS', icon: ShoppingCart, allow: ['kasir'] },
  { to: '/gudang', label: 'Inventori Gudang', icon: Package, allow: ['kepala_gudang'] },
  { to: '/persetujuan', label: 'Persetujuan', icon: CheckSquare, allow: ['kepala_toko'] },
  { to: '/jurnal', label: 'Jurnal Akuntansi', icon: BookOpen, allow: ['akunting', 'keuangan', 'owner'] },
  { to: '/laporan', label: 'Laporan', icon: BarChart3, allow: ['owner', 'kepala_toko', 'keuangan', 'akunting'] },
]