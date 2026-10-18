/* ==========================================================
   DATA TOKO: cukup edit file ini untuk tiap klien baru.
   Ganti nama toko, nomor WhatsApp, dan daftar produk.
   ========================================================== */
const STORE = {
  name: "Dapur Bu Ratna",
  tagline: "Masakan rumahan & kue basah, dimasak segar setiap hari.",
  whatsapp: "6281234567890", // format internasional tanpa +
  address: "Jl. Cihampelas No. 10, Sumedang",
  orderInfo: "Pesan H-1 sebelum jam 18.00 untuk pengambilan besok. Pesanan dalam jumlah besar mohon konfirmasi dulu.",
  deliveryNote: "Antar gratis area Sumedang Kota untuk pesanan di atas Rp100.000.",
  minOrder: 20000, // minimal total pesanan (0 = tanpa minimal)

  products: [
    { id: "nasi-kuning", cat: "Nasi & Lauk", name: "Nasi Kuning Komplit", desc: "Nasi kuning, ayam suwir, telur balado, orek tempe, kerupuk.", price: 25000, unit: "porsi", emoji: "🍛", best: true },
    { id: "nasi-liwet", cat: "Nasi & Lauk", name: "Nasi Liwet Sunda", desc: "Nasi liwet, ayam goreng, tahu tempe, lalapan, sambal.", price: 28000, unit: "porsi", emoji: "🍚" },
    { id: "ayam-bakar", cat: "Nasi & Lauk", name: "Ayam Bakar Madu", desc: "Ayam bakar bumbu madu, empuk dan meresap.", price: 22000, unit: "potong", emoji: "🍗" },
    { id: "sambal", cat: "Nasi & Lauk", name: "Sambal Terasi", desc: "Sambal terasi rumahan, pedas segar.", price: 15000, unit: "cup", emoji: "🌶️" },

    { id: "lemper", cat: "Kue Basah", name: "Lemper Ayam", desc: "Ketan gurih isi ayam suwir, dibungkus daun pisang.", price: 3500, unit: "pcs", emoji: "🍙", best: true },
    { id: "risoles", cat: "Kue Basah", name: "Risoles Ragout", desc: "Kulit tipis, isi ragout sayur dan ayam.", price: 4000, unit: "pcs", emoji: "🥟" },
    { id: "kue-lapis", cat: "Kue Basah", name: "Kue Lapis Legit", desc: "Lapis manis, kenyal, warna-warni.", price: 3000, unit: "pcs", emoji: "🍰" },
    { id: "klepon", cat: "Kue Basah", name: "Klepon", desc: "Isi gula merah cair, taburan kelapa parut.", price: 2500, unit: "pcs", emoji: "🟢" },

    { id: "brownies", cat: "Kue Kering", name: "Brownies Kukus", desc: "Brownies coklat lembut, cocok buat oleh-oleh.", price: 45000, unit: "loyang", emoji: "🍫", best: true },
    { id: "nastar", cat: "Kue Kering", name: "Nastar Premium", desc: "Selai nanas asli, mentega wangi.", price: 85000, unit: "toples", emoji: "🍪" },
    { id: "kastengel", cat: "Kue Kering", name: "Kastengel Keju", desc: "Gurih keju, renyah di setiap gigitan.", price: 90000, unit: "toples", emoji: "🧀", soldOut: true },

    { id: "es-teh", cat: "Minuman", name: "Es Teh Manis", desc: "Teh melati segar, manis pas.", price: 5000, unit: "gelas", emoji: "🧋" },
    { id: "es-cendol", cat: "Minuman", name: "Es Cendol", desc: "Cendol, santan, gula aren cair.", price: 10000, unit: "gelas", emoji: "🥤" }
  ]
};