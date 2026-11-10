// ===== KONFIGURASI LINK — ganti sesuai URL asli =====
const LINKS = {
  "absen-web": "https://lapakabsensi.github.io/lapakabsensi/",
  "absen-apk": "downloads/Lapak-Absen.apk"
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
