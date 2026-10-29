# Paket serah-terima portofolio

## Isi paket

| File | Fungsi |
|---|---|
| `CLAUDE.md` | Aturan proyek yang dibaca Claude Code: integritas angka, label kerja tim, draft gate, stack, rute |
| `DESIGN.md` | Sistem visual: warna, font, komponen, dan daftar lengkap animasi |
| `PROMPTS.md` | Prompt per fase (0–6) untuk Claude Code di VS Code |
| `content/en/` | Seluruh isi web dalam bahasa Inggris, diambil dari CV dan laporanmu |
| `content/id/` | Bahasa Indonesia, sementara baru `profile.json` dan `ui.json` (sisanya di Fase 5) |
| `scripts/check-tbd.mjs` | Menggagalkan build kalau masih ada `[TBD` di konten yang bukan draft |
| `public/images/` | Folder kosong untuk foto dan screenshot |

## Cara mulai

1. Buat folder kosong `lathifash03.github.io`, salin semua isi paket ini ke dalamnya, lalu buka di VS Code.
2. Jalankan prompt Fase 0 dari `PROMPTS.md` di Claude Code.
3. Simpan CV terbaru sebagai `public/cv.pdf`.

## Cara kerja draft

- Item yang datanya belum lengkap punya `"draft": true` dan **tidak tampil** di web.
- Item yang tampil tidak boleh mengandung `[TBD`. Kalau masih ada, build gagal dan Claude Code
  menampilkan daftarnya.
- Untuk menampilkan item: isi semua `[TBD]`-nya, ubah `"draft": false`.
- Link yang memang tidak ada (repo private, misalnya): **hapus field-nya**, jangan diisi asal.

## Yang masih perlu kamu isi (18 item, plus semua item draft)

Jalankan `node scripts/check-tbd.mjs` untuk melihat daftar terbaru. Saat paket ini dibuat:

- Diagram pipeline kg-agent (Figure 3.1 di laporan TEEP) dan diagram 4 fase skripsi
- Screenshot dashboard Ruang Topik dan satu kalimat tentang kegunaannya
- URL repo kg-agent, skripsi, Ruang Topik (atau hapus field-nya)
- Link PDF laporan TEEP (perbaiki dulu judul 5.2 yang dobel)
- Tahun: Major.in, Library System, Tableau, analisis sentimen, KNN/K-Means, ANN saham
- ANN saham: dikerjakan tim atau sendiri?
- Stack atau engine WeapMath
- Tiga mata kuliah TA lainnya
- Periode ketua Forda Bengkulu
- Link Tableau Public (atau hapus)

Item draft yang menunggu data: Kinderfin, ASLora, IndoBERT, web tugas kuliah, foto profil,
galeri kegiatan, 3–6 artikel ITS Online pilihan, dan semua gambar proyek.

## Aset yang dibutuhkan

| Path | Isi |
|---|---|
| `public/images/profile/portrait.jpg` | Foto dada ke atas, latar netral, minimal 1200px |
| `public/images/projects/*.png` | Screenshot sesuai nama file di `projects.json`, rasio 16:10, minimal 1600px lebar |
| `public/images/gallery/*.jpg` | Foto kegiatan, minimal 1600px lebar, beserta caption di `leadership.json` |

Screenshot UBS Gold: blur semua data perusahaan. Foto ASLora: jangan pakai yang menampilkan wajah orang.
