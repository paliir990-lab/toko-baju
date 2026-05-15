# Toko Baju - Website Katalog

Website katalog baju interaktif, simple, dan elegant. Siap dihosting di GitHub Pages secara **GRATIS**.

## Fitur
- Tampilan produk dengan kategori filter (Kaos, Kemeja, Jaket)
- Search/cari produk real-time
- Lightbox gallery (klik foto untuk lihat besar)
- Tombol order via WhatsApp per produk
- Testimoni pelanggan (slider otomatis)
- Responsive (HP, tablet, desktop)
- Desain Navy + Gold yang elegan

## Cara Menggunakan

### 1. Ganti Data Brand
Edit file `config.js`:
```js
const CONFIG = {
    brandName: "Nama Toko Anda",     // Ganti nama brand
    whatsapp: "6281234567890",        // Ganti nomor WA (pakai kode negara, tanpa +)
    instagram: "username_ig",         // Ganti username IG
    email: "email@anda.com",          // Ganti email
    heroTitle: "Judul Hero",          // Ganti teks hero
    heroSubtitle: "Deskripsi Hero",   // Ganti subtitle hero
    aboutText: "Tentang toko Anda"    // Ganti deskripsi about
};
```

### 2. Menambah / Mengedit Produk
Edit file `produk.json` — formatnya:
```json
{
    "id": 1,
    "nama": "Nama Produk",
    "kategori": "kaos",           // kaos / kemeja / jaket
    "harga": "Rp 100.000",
    "foto": "assets/images/products/nama-file.jpg",
    "warna": ["Hitam", "Putih"],
    "ukuran": ["S", "M", "L", "XL"],
    "deskripsi": "Deskripsi produk"
}
```
> **Untuk nambah produk**: tinggal copy paste `{ }` baru di file `produk.json`, ganti angkanya, dan tambah koma setelah kurung sebelumnya.

### 3. Ganti Foto Produk
1. Siapkan foto produk ukuran **800x800 px** (square)
2. Simpan di folder: `assets/images/products/`
3. Edit `produk.json` → ganti path `"foto"` dengan nama file foto Anda

### 4. Menambah Testimoni
Edit file `testimoni.json`:
```json
{
    "nama": "Nama Pelanggan",
    "kota": "Jakarta",
    "rating": 5,
    "komentar": "Isi testimoni...",
    "foto": "assets/images/testimonials/user-anda.svg"
}
```

---

## Cara Hosting ke GitHub Pages (GRATIS)

### Langkah 1: Buat Akun GitHub
1. Buka [github.com](https://github.com) → klik **Sign up**
2. Isi email, password, username (contoh: `tokobaju`)
3. Verifikasi email

### Langkah 2: Buat Repository Baru
1. Login GitHub → klik tombol `+` (pojok kanan atas) → **New repository**
2. Isi:
   - **Repository name**: `tokobaju.github.io` (ganti `tokobaju` dengan username Anda)
   - **Public** (jangan private)
   - Centang **"Add a README file"**
3. Klik **Create repository**

### Langkah 3: Upload File Website
1. Di halaman repository, klik **Add file** → **Upload files**
2. **Drag & drop** semua file dan folder dari folder project ini:
   - `index.html`
   - `config.js`
   - `produk.json`
   - `testimoni.json`
   - Folder `assets/` (beserta isinya)
3. Scroll bawah, klik **Commit changes**

### Langkah 4: Website Live!
- Tunggu 1-2 menit
- Buka `https://tokobaju.github.io` (ganti `tokobaju` dengan username Anda)
- Website Anda sudah **online gratis**!

> Jika nanti ingin pakai domain sendiri (misal: `tokobaju.com`), bisa diatur di Settings → Pages → Custom domain.

---

## Struktur Folder

```
tokobaju/
├── index.html              ← Halaman utama (JANGAN DIEDIT)
├── config.js               ← Setting brand, WA, IG (EDIT DI SINI)
├── produk.json             ← Data produk (EDIT DI SINI)
├── testimoni.json          ← Data testimoni (EDIT DI SINI)
├── assets/
│   ├── css/
│   │   └── style.css       ← Styling (JANGAN DIEDIT)
│   ├── js/
│   │   └── script.js       ← Fitur interaktif (JANGAN DIEDIT)
│   └── images/
│       ├── products/       ← Letakkan foto produk di sini
│       └── testimonials/   ← Foto avatar testimoni
└── README.md               ← Panduan ini
```

**⚠️ CATATAN:**
- File yang perlu Anda edit: `config.js`, `produk.json`, `testimoni.json`
- File yang JANGAN diedit: `index.html`, `style.css`, `script.js`
- Foto produk simpan di `assets/images/products/`

---

## Tech Stack
- HTML5 + CSS3 + JavaScript (Vanilla)
- Font: Playfair Display + Inter (Google Fonts)
- Hosting: GitHub Pages
