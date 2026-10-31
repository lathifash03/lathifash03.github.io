---
slug: narrative-to-procedural
title: "Mengubah teks naratif berita menjadi teks langkah demi langkah"
context: "Tugas akhir sarjana · Teknik Informatika, ITS · 2026"
role: "Individu"
stack: [Python, spaCy en_core_web_md, Llama 3.3 70B (Groq), GPT-4o-mini, Claude Haiku, rouge-score, BERTScore]
figures:
  - kind: diagram
    id: pipeline
    diagram: thesis
    caption: "Empat fasenya. Aturan yang menyusun constraint dan memperbaiki keluaran; language model hanya menulis ulang di bagian tengahnya."
---

## Masalahnya

Berita naratif yang panjang menuntut banyak dari pembaca yang sedang bergerak. Menulisnya ulang
sebagai langkah bernomor membantu, tapi hanya kalau setiap fakta bertahan dan urutan kejadiannya
tetap benar. Penulisan ulang oleh LLM begitu saja menjatuhkan nama, memparafrasekan angka dan keluar
dari format.

## Pipeline-nya

1. **Pra-pemrosesan berbasis aturan** — NER spaCy (PERSON, ORG, LOC, DATE, MONEY), ekstraksi verba
   tindakan dengan POS tagging ditambah lemmatization, dan deteksi penanda temporal. Menambahkan
   lemmatization menaikkan jumlah verba tindakan yang terdeteksi per artikel dari 0,03–0,30 menjadi
   3,03–4,70.
2. **Pembentukan constraint** — setiap artikel memperoleh constraint-nya sendiri: pelestarian entitas
   dan format (hard), struktur verba dan urutan temporal (soft).
3. **Konversi LLM dengan constraint** — constraint dimasukkan ke dalam prompt; kegagalan hard
   constraint memicu prompt perbaikan, sampai 2 kali retry.
4. **Pasca-pemrosesan berbasis aturan** — empat validator dijalankan ulang, lalu entitas yang hilang
   disisipkan ke langkah yang paling relevan (partial match → context match → fallback).

[figure: pipeline]

## Data

134.359 artikel disaring, 26.526 valid, 110 diambil per domain → 1.760 artikel dalam 16 domain.
Untuk konversi: 30 per domain × 16 = 480 artikel per model, × 3 model = **1.440 titik data evaluasi**.

## Hasil

| Metrik | Llama 3.3 70B | GPT-4o-mini | Claude Haiku |
|---|---|---|---|
| ROUGE-L (referensi: narasi asli) | 0,283 | 0,383 | 0,340 |
| BERTScore F1 | 0,645 | 0,700 | 0,688 |
| Entity pass rate, prompt saja | 28,7% | 21,2% | 32,9% |
| Entity pass rate, pipeline penuh | 66,9% | 56,5% | 64,6% |
| Format pass rate | 99,6% | 99,8% | 99,6% |
| Overall pass rate | 100% | 98,5% | 99,2% |

Targetnya BERTScore F1 ≥ 0,60 dan ROUGE-L ≥ 0,20; ketiga model memenuhi keduanya.
Terhadap 20 referensi prosedural yang saya anotasi manual, BERTScore F1 naik menjadi
0,668 / 0,724 / 0,721, yang mendukung pandangan bahwa referensi naratif meremehkan keluaran prosedural.

**Evaluasi manusia.** Penilai memberi GPT-4o-mini dan Claude Haiku di atas target 3,5 / 5.
Pada keterbacaan: GPT 4,21, Claude 4,20, Llama 3,55.

## Apa kata angkanya

- **Prompting saja tidak cukup.** Bahkan dengan constraint eksplisit dan retry, paling banyak
  sepertiga artikel mempertahankan seluruh entitas wajib. Penyisipan berbasis aturan menambah
  +31,7 sampai +38,1 poin.
- **Paradoksnya.** Model dengan ROUGE-L terendah (Llama 3.3 70B) paling baik mempertahankan entitas.
  Model yang bertele-tele mencocokkan lebih banyak n-gram tapi memparafrasekan nama. Pilih model
  sesuai prioritas: fakta, atau kelancaran bahasa.
- **Domain lebih berpengaruh daripada model.** Variasi antar domain berita lebih besar daripada antar
  model; domain yang digerakkan peristiwa (kriminal, bencana, perang) paling baik dikonversi.

## Keterbatasan

- Entity pass rate di tingkat artikel masih di bawah 70% untuk semua model, di bawah target 85%.
- Kesepakatan antar penilai manusia rendah (Krippendorff's α = 0,165 vs target 0,6); menilai kualitas
  prosedural bersifat subjektif.
- Sebagian besar skor otomatis memakai narasi asli sebagai referensi, karena referensi prosedural
  yang tervalidasi tidak tersedia untuk setiap artikel.
