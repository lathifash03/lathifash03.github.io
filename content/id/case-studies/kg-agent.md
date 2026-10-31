---
slug: kg-agent
title: "kg-agent: lapisan verifikasi untuk RAG berbasis knowledge graph"
context: "Magang riset TEEP · CITI Lab, NTUST · Jun – Agu 2026"
role: "Modul individu (Modul 3) di dalam tim internasional dengan lima modul"
stack: [Python, Neo4j, Cypher, Hermes3:3b, qwen3-embedding:0.6b, MCP, LangGraph, Docker]
figures:
  - kind: diagram
    id: pipeline
    diagram: kgAgent
    caption: "Loop verify-then-retry. Tiga gate berdiri di antara jawaban draft dan jawaban yang dikembalikan; gate yang gagal mengirim agent kembali ke retrieval."
  - kind: chart
    id: e1-accuracy
    title: "E1 · akurasi per kategori"
    axis: "Jawaban benar, 20 item ground truth dalam 4 kategori"
    caption: "Median dari 3 run. Low trust adalah kategori terlemah: 1 dari 5 benar."
    bars:
      - { label: "Bisa dijawab", value: 6, of: 6, display: "6 / 6" }
      - { label: "Di luar cakupan", value: 5, of: 6, display: "5 / 6" }
      - { label: "Low trust", value: 1, of: 5, display: "1 / 5", highlight: true }
      - { label: "Temporal", value: 3, of: 3, display: "3 / 3" }
    rule: { value: 15, of: 20, label: "75% keseluruhan (15 / 20)" }
  - kind: chart
    id: e3-false-pass
    title: "E3 · false-pass rate per konfigurasi"
    axis: "Proporsi jawaban yang lolos gate padahal seharusnya tidak"
    caption: "Set 20 item yang sama. Tanpa trust gate, 57% jawaban kembali sebagai false pass; tanpa gate sama sekali, semuanya."
    bars:
      - { label: "Sistem penuh", value: 0, of: 100, display: "0%" }
      - { label: "Trust gate mati", value: 57, of: 100, display: "57%", highlight: true }
      - { label: "Temporal gate mati", value: 7, of: 100, display: "7%" }
      - { label: "Tanpa gate", value: 100, of: 100, display: "100%" }
---

## Masalahnya

Lab menyimpan pengetahuannya dalam satu graph Neo4j yang ditulisi banyak orang: paper, catatan rapat,
diskusi informal dan hasil ekstraksi otomatis. LLM yang menjawab pertanyaan dari graph itu bisa
sepenuhnya setia pada sebuah node dan tetap salah, karena node-nya sudah kedaluwarsa, sudah
digantikan, atau berasal dari sumber yang tidak dapat diandalkan. Lebih buruk lagi, jawaban yang salah
bisa ditulis balik ke dalam graph dan dianggap benar di kemudian hari. Pemeriksaan faithfulness saja
tidak bisa menangkap itu.

## Yang saya bangun

Sebuah controller verify-then-retry yang duduk di antara retrieval dan jawaban akhir.

1. **Retrieve** dengan kemiripan vektor ditambah pencocokan keyword di atas Neo4j (qwen3-embedding:0.6b).
2. **Generate** jawaban draft dengan Hermes3:3b.
3. **Periksa tiga gate secara independen:**
   - *Faithfulness* — LLM-as-judge menilai proporsi klaim yang didukung konteks hasil retrieval
     (ambang 0,7). Jawaban kosong dan jawaban "tidak ada konteks" langsung diberi 0,0, karena judge
     sempat menilainya 0,70 dan 1,00 ketika ditanya secara normal.
   - *Trust* — `confidence × source weight × recency`, dengan bobot sumber yang tetap
     (paper 1,0, rapat 0,8, diskusi 0,6, hasil ekstraksi otomatis 0,4) dan waktu paruh 90 hari (ambang 0,4).
   - *Temporal validity* — setiap node berstatus VALID, OUTDATED, SUPERSEDED (ada edge `SUPERSEDED_BY`)
     atau CONFLICTED (nama ganda dengan nilai berbeda, atau ditandai oleh detektor kontradiksi).
4. **Retry** dengan strategi retrieval alternatif ketika kegagalannya masih bisa dipulihkan, sampai
   batas percobaan yang tetap.

[figure: pipeline]

## Bagaimana saya mengevaluasinya

| Uji | Hasil | Catatan |
|---|---|---|
| E1 ground truth, 20 item dalam 4 kategori | akurasi 75% (15/20), false-pass 0%, false-block 0% | median dari 3 run; 18/20 item stabil di seluruh run |
| E1 per kategori | bisa dijawab 6/6 · temporal 3/3 · di luar cakupan 5/6 · low-trust 1/5 | low-trust adalah kelemahan utamanya |
| E2 reliabilitas judge | Cohen's κ = 0,833 vs 0,167 untuk mock judge acak | satu model, satu set evaluasi |
| E3 ablation (false-pass rate) | trust gate mati → 57% · temporal gate mati → 7% · semua gate mati → 100% | |

[figure: e1-accuracy]

[figure: e3-false-pass]

Evaluasi dijalankan pada snapshot graph 355 node yang dibekukan ditambah 20 node sintetis, bukan pada
graph yang hidup, karena graph yang hidup belum membawa metadata provenance yang dibutuhkan trust gate.

## Yang keliru, dan apa yang saya pelajari

- **Retry bisa membatalkan jawaban yang sudah benar.** Di tiga tempat berbeda, logika retry justru
  memilih percobaan yang lebih buruk — sekali karena pencarian yang gagal memperoleh skor 0,80
  melawan 0,69 milik pencarian yang berhasil, sekali karena hasil kosong memicu retry yang tidak
  perlu, dan sekali karena pemilihan hasil retry menimpa deteksi kontradiksi yang sebenarnya
  sudah benar.
- **Kemiripan tidak bisa membedakan di dalam cakupan dari di luar cakupan.** Pertanyaan di luar korpus
  dengan skor tertinggi (0,86) mengalahkan pertanyaan di dalam korpus dengan skor terendah (0,83).
  Tidak ada ambang yang memisahkan keduanya; ini batas arsitektur, bukan soal tuning.
- **Satu detail karangan masih bisa lolos.** Sebuah jawaban yang sebenarnya grounded menyebut
  "ISO 9001:2015" padahal korpus hanya memuat revisi 2000 dan 2005. Skor faithfulness-nya tetap
  melewati 0,7, jadi jawaban itu mendapat disclaimer, bukan diblokir.
- **Saya mengoreksi angka utama saya sendiri.** Ringkasan sebelumnya menyebut 95%. Setelah saya
  periksa ulang terhadap file hasil mentah, angkanya 75%, dan itulah angka yang dilaporkan di sini.

## Selanjutnya

Ambang dan prompt masih disetel manual. Langkah berikutnya yang disarankan adalah menyetelnya
terhadap set ground truth ini dengan optimasi teks bergaya GEPA dan recursive language model.
