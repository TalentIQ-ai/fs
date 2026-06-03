<div align="center">

# 🧠 TalentIQ AI

**Platform Karir Berbasis AI untuk Profesional IT Indonesia**

[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<p>
  TalentIQ AI adalah platform karir modern yang memanfaatkan kecerdasan buatan untuk membantu para profesional dan pencari kerja di bidang IT menganalisis CV mereka, membangun roadmap karir yang personal, dan menemukan lowongan kerja yang paling sesuai dengan profil mereka.
</p>

[🚀 Demo Live](#-demo) · [📖 Dokumentasi](#-cara-instalasi) · [🐛 Laporkan Bug](https://github.com/TalentIQ-ai/fs/issues) · [💡 Request Fitur](https://github.com/TalentIQ-ai/fs/issues)

---

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Demo](#-demo)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Cara Instalasi](#-cara-instalasi)
- [Scripts](#-scripts)
- [Konfigurasi Environment](#️-konfigurasi-environment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🌟 Tentang Proyek

**TalentIQ AI** hadir sebagai solusi cerdas untuk para profesional IT yang ingin berkembang lebih terarah. Dengan memanfaatkan teknologi AI terkini, platform ini mampu:

- 🔍 **Membaca dan menganalisis CV** secara otomatis (PDF & DOCX)
- 🎯 **Memberikan insight mendalam** tentang skill teknis dan soft skill
- 🗺️ **Menghasilkan roadmap belajar personal** yang disesuaikan dengan gap skill
- 💼 **Merekomendasikan lowongan kerja** yang relevan dengan profil pengguna
- 📊 **Memvisualisasikan progress** karir secara real-time di dashboard

Proyek ini dibangun sebagai bagian dari **Capstone Project** dengan pendekatan full-stack modern, terdiri dari:

| Repository | Deskripsi | Link |
|---|---|---|
| `talentiq` | Frontend — React + TypeScript + Vite | [→ Folder](./talentiq) |
| `talentiq-api` | Backend API — REST API layer | [→ Folder](./talentiq-api) |
| `be-talentiq` | Backend Service — Core AI & Business Logic | [→ Folder](./be-talentiq) |

---

## 🚀 Demo

> 🔗 **Live Demo:** [https://talentiq-ai.vercel.app](https://talentiq-ai.vercel.app) *(akan diperbarui setelah deployment)*

---

## ✨ Fitur Utama

### 📄 1. Analisis Skill CV
AI secara otomatis membaca file CV dalam format **PDF** atau **DOCX** dan mengekstrak:
- Skill teknis (programming language, framework, tools, cloud, dll)
- Soft skill (komunikasi, kepemimpinan, problem-solving, dll)
- Skor kompetensi per kategori skill
- Ringkasan profil profesional

### 🗺️ 2. Jalur Karir Personalisasi
Berdasarkan hasil analisis CV, AI menghasilkan:
- Roadmap belajar yang terstruktur dan bertahap
- Identifikasi skill gap dibandingkan target posisi
- Rekomendasi sumber belajar (kursus, sertifikasi, dokumentasi)
- Estimasi waktu pengembangan skill

### 💼 3. Rekomendasi Lowongan Kerja
Sistem matching cerdas yang menampilkan:
- Lowongan kerja yang relevan dengan profil pengguna
- Skor kecocokan (match score) antara profil dan requirement posisi
- Filter berdasarkan lokasi, level, teknologi, dan gaji
- Shortlist dan bookmark lowongan favorit

### 📊 4. Dashboard Karir
Visualisasi interaktif yang menampilkan:
- Progress skill secara keseluruhan
- Statistik profil (skill count, match rate, dll)
- Aktivitas terbaru (analisis CV, lamaran, dll)
- Notifikasi dan update karir

### 🔐 5. Autentikasi
Sistem autentikasi lengkap meliputi:
- Register akun baru
- Login dengan email & password
- Forgot password & reset password
- Manajemen sesi pengguna

---

## 🛠️ Tech Stack

### Frontend (`talentiq/`)

| Kategori | Teknologi | Versi | Keterangan |
|---|---|---|---|
| **Framework** | [React](https://react.dev) | ^18.x | UI library utama |
| **Language** | [TypeScript](https://www.typescriptlang.org) | ^5.x | Type-safe JavaScript |
| **Build Tool** | [Vite](https://vitejs.dev) | ^5.x | Fast dev server & bundler |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | ^3.x | Utility-first CSS framework |
| **Routing** | [React Router DOM](https://reactrouter.com) | ^6.x | Client-side routing |
| **State/Fetching** | [TanStack Query](https://tanstack.com/query) | ^5.x | Server state management |
| **HTTP Client** | [Axios](https://axios-http.com) | ^1.x | Promise-based HTTP client |
| **Package Manager** | [pnpm](https://pnpm.io) | ^9.x | Fast, efficient package manager |
| **Deployment** | [Vercel](https://vercel.com) | — | Platform hosting & deployment |

---

## 📁 Struktur Proyek

```
capstone/
├── 📂 talentiq/              # Frontend Application
│   ├── 📂 src/
│   │   ├── 📂 apis/          # Axios client & interceptors
│   │   ├── 📂 assets/        # Gambar, logo, icon statis
│   │   ├── 📂 components/    # Shared/reusable components
│   │   │   ├── button/
│   │   │   ├── sidebar/
│   │   │   └── toaster/
│   │   ├── 📂 data/          # Constants (warna, navigasi, path)
│   │   ├── 📂 features/      # Feature-based modules
│   │   ├── 📂 hooks/         # Custom React hooks
│   │   │   ├── useScrollAnimation
│   │   │   ├── useModalStore
│   │   │   └── useTheme
│   │   ├── 📂 layout/        # Layout components
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── error-boundary/
│   │   ├── 📂 pages/         # Halaman-halaman aplikasi
│   │   │   ├── home/
│   │   │   ├── auth/         # Login, Register, Forgot Password
│   │   │   ├── dashboard/
│   │   │   ├── career/       # Jalur karir & roadmap
│   │   │   └── jobs/         # Lowongan kerja
│   │   ├── 📂 provider/      # React context providers
│   │   │   ├── QueryProvider
│   │   │   └── ThemeProvider
│   │   ├── 📂 routes/        # Konfigurasi routing
│   │   ├── 📂 services/      # API service calls
│   │   │   ├── auth.service
│   │   │   ├── dashboard.service
│   │   │   ├── job.service
│   │   │   └── profile.service
│   │   ├── 📂 ts/types/      # TypeScript type definitions
│   │   └── 📂 utils/         # Helper & utility functions
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── 📂 talentiq-api/          # Backend API Layer
│
├── 📂 be-talentiq/           # Backend Service & AI Core
│
└── 📄 README.md              # ← Anda sedang membaca ini
```

---

## ⚙️ Cara Instalasi

### Prasyarat

Pastikan perangkat Anda telah terinstal:

- **Node.js** >= 18.x → [Download](https://nodejs.org)
- **pnpm** >= 9.x → Install via: `npm install -g pnpm`
- **Git** → [Download](https://git-scm.com)

### 1. Clone Repository

```bash
git clone https://github.com/TalentIQ-ai/fs.git capstone
cd capstone
```

### 2. Instalasi Frontend

```bash
# Masuk ke folder frontend
cd talentiq

# Install dependencies
pnpm install
```

### 3. Konfigurasi Environment

```bash
# Salin file environment contoh
cp .env.example .env.local
```

Kemudian edit file `.env.local` dan sesuaikan nilai variabel (lihat bagian [Konfigurasi Environment](#️-konfigurasi-environment)).

### 4. Jalankan Development Server

```bash
pnpm dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

---

## 📜 Scripts

Semua perintah dijalankan dari dalam folder `talentiq/`:

| Script | Perintah | Deskripsi |
|---|---|---|
| **Development** | `pnpm dev` | Menjalankan dev server dengan HMR |
| **Build** | `pnpm build` | Membuat production build ke folder `dist/` |
| **Preview** | `pnpm preview` | Preview production build secara lokal |
| **Lint** | `pnpm lint` | Menjalankan ESLint untuk cek kualitas kode |

### Contoh Penggunaan

```bash
# Menjalankan development server
pnpm dev

# Membuat build untuk production
pnpm build

# Melihat preview build production
pnpm preview

# Cek & identifikasi masalah kode
pnpm lint
```

---

## 🔧 Konfigurasi Environment

Buat file `.env.local` di dalam folder `talentiq/` dengan variabel berikut:

```env
# API Base URL — URL backend API
VITE_API_BASE_URL=http://localhost:3000/api

# App Name
VITE_APP_NAME=TalentIQ AI
```

> ⚠️ **Penting:** Jangan pernah meng-commit file `.env.local` ke repository. File ini sudah terdaftar di `.gitignore`.

---

## 🤝 Kontribusi

Kontribusi sangat kami sambut! Berikut langkah-langkah untuk berkontribusi:

### Alur Kontribusi

1. **Fork** repository ini
   ```bash
   # Klik tombol Fork di GitHub
   ```

2. **Clone** fork Anda secara lokal
   ```bash
   git clone https://github.com/username-anda/fs.git
   cd fs/talentiq
   ```

3. **Buat branch** baru untuk fitur/perbaikan Anda
   ```bash
   git checkout -b feat/nama-fitur-baru
   # atau untuk bug fix:
   git checkout -b fix/nama-bug
   ```

4. **Buat perubahan** dan commit dengan pesan yang deskriptif
   ```bash
   git add .
   git commit -m "feat: menambahkan fitur analisis skill baru"
   ```

5. **Push** branch ke fork Anda
   ```bash
   git push origin feat/nama-fitur-baru
   ```

6. **Buat Pull Request** ke branch `main` repository utama

### Konvensi Commit

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Kapan Digunakan |
|---|---|
| `feat:` | Menambahkan fitur baru |
| `fix:` | Memperbaiki bug |
| `docs:` | Perubahan dokumentasi |
| `style:` | Perubahan formatting/styling |
| `refactor:` | Refactoring kode (bukan fitur/bug) |
| `chore:` | Update dependency, konfigurasi |

### Panduan Kode

- Gunakan **TypeScript** dengan tipe yang eksplisit — hindari `any`
- Ikuti struktur **feature-based** yang sudah ada di `src/features/`
- Pastikan tidak ada **ESLint error** sebelum membuat PR (`pnpm lint`)
- Beri nama komponen, fungsi, dan variabel dengan **bahasa Inggris** yang jelas

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

```
MIT License

Copyright (c) 2026 TalentIQ AI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Dibuat dengan ❤️ oleh Tim TalentIQ AI**

⭐ Jika proyek ini bermanfaat, jangan lupa berikan bintang di GitHub!

[![GitHub Stars](https://img.shields.io/github/stars/TalentIQ-ai/fs?style=social)](https://github.com/TalentIQ-ai/fs)

</div>
