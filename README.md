# AyamHub Backend API

Back-end API untuk Aplikasi Mobile AyamHub — platform penghubung antara peternakan dan UMKM/penjual ayam broiler di Indonesia.

> Dirancang berdasarkan jurnal: *"Rancang Bangun Back-end API pada Aplikasi Mobile AyamHub Menggunakan Framework Node JS Express"* — Eli Nurhayati, Agussalim (JUSTIN Vol. 11, No. 3, Juli 2023)

## Arsitektur Sistem

```
Client (Mobile App)
       │
       ▼
   [Server] ──── Express.js (port 3000)
       │
   [Routes] ──── Menentukan jalur request
       │
 [Controllers] ── Logika bisnis
       │
   [Models] ──── Sequelize ORM
       │
  [Database] ──── SQLite
```

## Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: SQLite
- **Autentikasi**: JSON Web Token (JWT)
- **Upload File**: Multer
- **Password Hashing**: bcrypt.js

## Struktur Database

| Tabel | Deskripsi | Relasi |
|-------|-----------|--------|
| `users` | Data pengguna | 1:1 → farms, 1:N → bookmarks |
| `farms` | Data peternakan | N:1 → users, 1:N → bookmarks |
| `bookmarks` | Bookmark peternakan | N:1 → users, N:1 → farms |

## Daftar Endpoint API

### Modul Pengguna (`/api/users`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/users/register` | Registrasi pengguna baru | ❌ |
| POST | `/api/users/login` | Login pengguna | ❌ |
| POST | `/api/users/logout` | Logout pengguna | ✅ |
| GET | `/api/users/profile` | Mendapatkan data profil | ✅ |
| PUT | `/api/users/update` | Memperbarui data pengguna | ✅ |

### Modul Peternakan (`/api/farms`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/api/farms/my-farm` | Mendapatkan peternakan milik user | ✅ |
| GET | `/api/farms` | Mendapatkan seluruh peternakan | ✅ |
| GET | `/api/farms/:id` | Mendapatkan detail peternakan | ✅ |
| POST | `/api/farms` | Membuat peternakan baru | ✅ |
| PUT | `/api/farms/:id` | Memperbarui data peternakan | ✅ |

### Modul Bookmark (`/api/bookmarks`)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/api/bookmarks` | Menambahkan bookmark | ✅ |
| DELETE | `/api/bookmarks/:id` | Menghapus bookmark | ✅ |
| GET | `/api/bookmarks` | Mendapatkan semua bookmark user | ✅ |
| GET | `/api/bookmarks/status/:id_farm` | Cek status bookmark | ✅ |

## Instalasi & Menjalankan

### Prasyarat
- Node.js >= 16

### Langkah-langkah

1. Clone repository:
   ```bash
   git clone https://github.com/KiixZ/ayamhub-sister.git
   cd ayamhub-sister
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Salin file environment:
   ```bash
   cp .env.example .env
   ```

4. Jalankan server (database SQLite otomatis dibuat):
   ```bash
   # Development (dengan auto-reload)
   npm run dev

   # Production
   npm start
   ```

7. Server berjalan di `http://localhost:3000`

## Contoh Request API

### Register
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"nama": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Create Farm (dengan upload foto)
```bash
curl -X POST http://localhost:3000/api/farms \
  -H "Authorization: Bearer <token>" \
  -F "nama_peternakan=Peternakan Jaya" \
  -F "alamat=Jl. Raya No.1, Surabaya" \
  -F "kota=Surabaya" \
  -F "provinsi=Jawa Timur" \
  -F "kapasitas=5000" \
  -F "foto_peternakan=@/path/to/foto.jpg"
```

## Referensi

- Nurhayati, E., & Agussalim. (2023). Rancang Bangun Back-end API pada Aplikasi Mobile AyamHub Menggunakan Framework Node JS Express. *JUSTIN (Jurnal Sistem dan Teknologi Informasi)*, 11(3), 524-531.
