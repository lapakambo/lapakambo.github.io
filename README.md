# LAPAK AMBO — Landing Page

Landing page statis (HTML/CSS/JS), tanpa build step.

## Struktur
```
index.html
css/style.css
js/main.js        <- ganti LINKS (Lapak Absen web & APK) di sini
assets/logo.png (logo asli), icon-*.png, favicon.png
assets/icons/     <- icon SVG standalone
```

## Jalankan lokal
Buka `index.html` di browser, atau: `python3 -m http.server 8000`

## Deploy via GitHub Pages
1. Buat repo baru, push semua file ini.
2. Settings → Pages → Source: `main` branch, folder `/ (root)`.

## Yang perlu diganti
- `js/main.js` → URL Lapak Absen (web) dan APK
- `index.html` → email/kontak di footer
- `js/main.js` → `ANALYTICS.goatcounter`: isi kode situs GoatCounter (tanpa cookie) untuk menghitung kunjungan dan klik tombol
- `assets/og-image.png` → gambar preview saat link dibagikan (1200x630); kalau diganti, naikkan `?v=` di meta og:image
- Icon: edit `<symbol>` di sprite bagian atas `index.html`
