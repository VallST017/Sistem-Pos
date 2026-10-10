# Panduan Penggunaan Sistem POS & Akuntansi Toko

## 1. Tentang Aplikasi
Aplikasi POS dan akuntansi toko dengan 7 peran. Setiap transaksi otomatis memengaruhi stok, kartu stok, jurnal akuntansi, dan laporan.

**Alamat aplikasi:** https://vercel.com/kelompok-4-640e/sistem-pos

## 2. Cara Login
1. Buka alamat aplikasi.
2. Isi username dan password, atau klik salah satu kartu peran di bagian bawah form (username dan password terisi otomatis).
3. Klik **Masuk**. Anda diarahkan ke halaman **Beranda**.
4. Untuk berganti peran, klik **Logout** di sidebar, lalu login lagi.

| Peran | Username | Password |
|---|---|---|
| Owner | owner | 123 |
| Kepala Toko | kepala | 123 |
| Bagian Keuangan | keuangan | 123 |
| Akunting | akunting | 123 |
| Kepala Gudang | gudang | 123 |
| Kasir | kasir | 123 |
| Sales | sales | 123 |

## 3. Hak Akses Tiap Peran
| Peran | Menu yang tersedia |
|---|---|
| Owner | Beranda, Jurnal Akuntansi (baca), Laporan |
| Kepala Toko | Beranda, Persetujuan, Laporan |
| Bagian Keuangan | Beranda, Jurnal Akuntansi (baca), Laporan (neraca, arus kas) |
| Akunting | Beranda, Jurnal Akuntansi, Laporan |
| Kepala Gudang | Beranda, Inventori Gudang |
| Kasir | Beranda, Transaksi & POS |
| Sales | Beranda, Order Pelanggan |

Membuka halaman di luar hak akses menampilkan pesan "Akses ditolak".

## 4. Panduan per Peran

### 4.1 Sales: membuat order pelanggan
1. Login sebagai **sales**, buka menu **Order Pelanggan**.
2. Klik barang untuk menambahkannya ke keranjang (klik lagi untuk menambah jumlah).
3. Isi **nama pelanggan**.
4. Klik **Simpan Order**. Order masuk ke antrean Kasir.

### 4.2 Kasir: pembayaran, diskon, dan void
1. Login sebagai **kasir**, buka menu **Transaksi & POS**.
2. Klik **Ambil** pada order dari Sales, atau pilih barang langsung.
3. **Diskon (opsional):** isi persen lalu klik **Ajukan diskon %**. Diskon baru bisa dipakai setelah disetujui Kepala Toko, dan akan muncul di pilihan **Diskon**.
4. Klik **Bayar & Cetak Struk**. Stok berkurang dan jurnal penjualan tercatat otomatis.
5. **Void:** pada daftar Transaksi terakhir, klik **Ajukan void**. Void berlaku setelah disetujui Kepala Toko.

### 4.3 Kepala Toko: persetujuan
1. Login sebagai **kepala**, buka menu **Persetujuan**.
2. Pada daftar **Menunggu keputusan**, klik **Setujui** atau **Tolak** untuk diskon, void, atau hapus buku.
3. Void yang disetujui mengembalikan stok dan membuat jurnal pembalik. Hapus buku yang disetujui mengurangi stok dan mencatat kerugian persediaan.
4. Keputusan tercatat di **Riwayat keputusan** dan Log Audit.

### 4.4 Kepala Gudang: inventori
Login sebagai **gudang**, buka menu **Inventori Gudang**. Ada empat tab:
- **Penerimaan Barang:** pilih produk, isi jumlah, klik **Terima Barang**. Stok bertambah dan jurnal Persediaan / Utang Usaha tercatat.
- **Stok Opname:** isi stok fisik pada kolom yang tersedia, klik **Sesuaikan**. Selisih langsung dicatat di stok dan jurnal.
- **Kartu Pergerakan Stok:** riwayat semua keluar-masuk stok beserta referensinya.
- **Hapus Buku (Write-off):** pilih produk, isi jumlah dan alasan (misalnya barang rusak atau kadaluarsa), klik **Ajukan Hapus Buku**. Menunggu persetujuan Kepala Toko. Status pengajuan terlihat di bagian bawah tab.

### 4.5 Akunting: jurnal dan rekonsiliasi
1. Login sebagai **akunting**, buka **Jurnal Akuntansi**.
2. Periksa **Rekonsiliasi persediaan**: nilai persediaan menurut jurnal harus sama dengan nilai stok (selisih Rp0).
3. Lihat **Jurnal umum** (debit dan kredit) dan **Log audit** (siapa melakukan apa dan kapan).
4. Buka **Laporan** untuk laba rugi, neraca, arus kas, dan rekap persediaan.

### 4.6 Bagian Keuangan dan Owner
- **Bagian Keuangan:** membaca Jurnal, serta Laporan Neraca dan Arus Kas.
- **Owner:** melihat Beranda (omzet, saldo kas, nilai persediaan), Jurnal, dan semua laporan.

## 5. Contoh Alur Lengkap (Demo)
1. **Sales** membuat order pelanggan.
2. **Kasir** mengambil order, mengajukan diskon 5%.
3. **Kepala Toko** menyetujui diskon.
4. **Kasir** memilih diskon yang disetujui, lalu membayar.
5. **Kepala Gudang** menerima barang dari supplier dan melakukan stok opname.
6. **Kepala Gudang** mengajukan hapus buku, **Kepala Toko** menyetujui.
7. **Kasir** mengajukan void, **Kepala Toko** menyetujui.
8. **Akunting** memeriksa jurnal, rekonsiliasi, dan laporan.

## 6. Jurnal Otomatis
| Transaksi | Debit | Kredit |
|---|---|---|
| Penjualan tunai | Kas | Penjualan |
| Diskon penjualan | Diskon Penjualan | Penjualan |
| Harga pokok penjualan | HPP | Persediaan |
| Pembelian kredit | Persediaan | Utang Usaha |
| Hapus buku / selisih opname (kurang) | Kerugian Persediaan | Persediaan |
| Void | Kebalikan jurnal penjualan | |

## 7. Catatan Penting
- Data tersimpan di **browser masing-masing perangkat** (localStorage), bukan di server. Transaksi di satu perangkat tidak terlihat di perangkat lain.
- Berpindah peran di browser yang sama tidak menghapus data, sehingga alur antarperan tetap nyambung.
- **Reset data:** tekan F12, buka tab Application, pilih Local Storage, hapus `pos-data`, lalu refresh halaman.

## 8. Menjalankan di Komputer Sendiri
```
npm install
npm run dev
```
Lalu buka http://localhost:5174