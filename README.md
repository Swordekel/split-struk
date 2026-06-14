# 🧾 SplitStruk

**Foto struk → tag teman → kirim tagihan ke WhatsApp.** Selesai dalam 30 detik.

Aplikasi web 100% gratis untuk bagi tagihan grup. Tidak ada server, tidak ada login, tidak ada langganan. Semua proses (termasuk OCR struk) jalan langsung di HP kamu.

## ✨ Fitur

- **📷 OCR Struk Otomatis** — Tesseract.js dengan bahasa Indonesia + Inggris, jalan di browser
- **🧮 Hitung Adil** — Patungan per-item, distribusi pajak/service proporsional
- **💬 Kirim WA Langsung** — Deep link `wa.me` per orang, lengkap dengan rincian
- **💾 Riwayat Lokal** — Disimpan di IndexedDB, tidak ada akun
- **📱 PWA** — Bisa diinstall ke HP, jalan offline setelah load pertama
- **🌗 Dark Mode** — Mengikuti tema sistem

## 🔒 Privasi

- Foto struk **tidak pernah dikirim ke server** — OCR jalan via WASM di browser
- Tidak ada analytics, tidak ada tracking, tidak ada cookie pihak ketiga
- Data riwayat tersimpan di IndexedDB device kamu sendiri

## 🛠 Stack

| Layer | Tech |
|---|---|
| Framework | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Routing | React Router |
| OCR | Tesseract.js (ind + eng) |
| DB Lokal | Dexie.js (IndexedDB) |
| PWA | vite-plugin-pwa (Workbox) |

## 🚀 Setup Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173).

## 📦 Build Production

```bash
npm run build
npm run preview
```

Output di `dist/` — bisa langsung di-deploy ke Cloudflare Pages, Vercel, Netlify, atau GitHub Pages (semua tier gratis).

## 🏗 Arsitektur

```
src/
├── lib/
│   ├── db.ts          # Dexie schema + queries
│   ├── ocr.ts         # Tesseract worker singleton
│   ├── parser.ts      # Parser struk Indonesia (regex + heuristik)
│   ├── calculator.ts  # Logika pembagian proporsional
│   └── whatsapp.ts    # Generator deep link wa.me
├── store/
│   └── useSplitStore.ts   # Zustand store untuk wizard state
├── components/
│   ├── ReceiptUploader.tsx  # Upload + OCR progress
│   ├── ItemEditor.tsx       # Edit hasil OCR
│   ├── PeoplePicker.tsx     # Tambah daftar teman
│   ├── ItemTagger.tsx       # Tag siapa makan apa
│   └── SummaryCard.tsx      # Ringkasan + share
└── routes/
    ├── Home.tsx        # Landing + history
    ├── NewSplit.tsx    # Wizard 5-step
    └── SplitDetail.tsx # Detail dari history
```

## 📝 Catatan Teknis

**Parser struk** — OCR Tesseract akurasinya ~70–80% untuk struk thermal Indonesia. Item bisa di-edit manual setelah parsing. Parser pakai dua pattern regex (dengan qty / tanpa qty) plus daftar keyword untuk skip baris non-item (TOTAL, PAJAK, KASIR, dll).

**Distribusi pajak/service** — Pajak dan service charge dibagi *proporsional* ke total tiap orang, bukan flat. Jadi kalau A makan Rp 100rb dan B makan Rp 50rb, A nanggung 2/3 dari pajak.

**Patungan per item** — Satu item bisa di-tag ke beberapa orang. Misal nasi padang patungan 3 orang → harga dibagi 3 ke masing-masing.

## 🗺 Roadmap

- [ ] Generate QR code QRIS dinamis (butuh merchant account)
- [ ] Export ke PDF / image untuk share di Instagram Story
- [ ] Multi-currency
- [ ] Sync via GitHub Gist (opsional)
- [ ] AI re-parser dengan LLM lokal (transformers.js) untuk fallback parsing

## 📄 Lisensi

MIT
