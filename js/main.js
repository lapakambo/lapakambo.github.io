// ===== KONFIGURASI LINK — ganti sesuai URL asli =====
const LINKS = {
  "absen-web": "https://lapakabsensi.github.io/lapakabsensi/?c=akundemo",
  "absen-apk": "downloads/Lapak-Absen.apk",
  "whatsapp": ""      // isi nomor WA format internasional tanpa +, contoh: "6281234567890" -> tombol kontak otomatis muncul
};

document.querySelectorAll("[data-link]").forEach(a => {
  const url = LINKS[a.dataset.link];
  if (url && url !== "#") a.href = url;
});

// Mobile menu
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const setMenu = open => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

// Active link on scroll
const links = [...menu.querySelectorAll("a:not(.btn)")];
const sections = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
addEventListener("scroll", () => {
  const y = scrollY + 120;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= y) current = s; });
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current.id || (current.id === "top" && a.getAttribute("href") === "#top")));
}, { passive: true });

document.getElementById("year").textContent = new Date().getFullYear();

// Kontak (WhatsApp) — tampil hanya kalau nomor diisi di LINKS.whatsapp
if (LINKS.whatsapp) {
  const wa = LINKS.whatsapp.replace(/\D/g, "");
  document.querySelectorAll('[data-link="whatsapp"]').forEach(a => a.href = "https://wa.me/" + wa);
  document.querySelectorAll("[data-contact]").forEach(el => el.hidden = false);
}

// Header shadow + tombol kembali ke atas
const nav = document.querySelector(".nav");
const toTop = document.getElementById("toTop");
const onScroll = () => {
  nav.classList.toggle("scrolled", scrollY > 8);
  toTop.hidden = scrollY < 600;
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

// Animasi muncul saat di-scroll
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(el); });
} else {
  items.forEach(el => el.classList.add("in"));
}
