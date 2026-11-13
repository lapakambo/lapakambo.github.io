// ===== KONFIGURASI LINK — ganti sesuai URL asli =====
const LINKS = {
  "absen-web": "https://lapakabsensi.github.io/lapakabsensi/?c=akundemo",
  "absen-apk": "https://github.com/lapakabsensi/lapakabsensi/releases/download/apk-terbaru/Lapak-Absen.apk",
  "gudang-web": "https://lapakgudang.github.io/lapakgudang/",
  "kosan-web": "https://lapak-kosan.github.io/lapak-kosan/",
  "kosan-apk": "https://github.com/lapak-kosan/lapak-kosan/releases/download/apk-terbaru/Lapak-Kosan.apk",
  "whatsapp": "6282384691477"      // nomor WA format internasional tanpa + (0823-8469-1477)
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
  const pesan = {
    "whatsapp": "Halo LAPAK AMBO, saya ingin konsultasi dan pemesanan.",
    "whatsapp-gudang": "Halo LAPAK AMBO, saya ingin tanya harga Lapak Gudang.",
    "whatsapp-kosan": "Halo LAPAK AMBO, saya ingin tanya harga Lapak Kosan."
  };
  Object.entries(pesan).forEach(([key, teks]) => {
    document.querySelectorAll('[data-link="' + key + '"]').forEach(a => a.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent(teks));
  });
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

// Tab galeri "Tampilan Aplikasi" (Absen / Gudang)
(() => {
  const tabs = [...document.querySelectorAll(".stab")];
  if (!tabs.length) return;
  const select = (tab, focus) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.classList.toggle("is-active", on);
      // elemen .reveal di panel yang tadinya tersembunyi tidak pernah terpantau observer, tampilkan langsung
      if (on) panel.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
    });
    if (focus) tab.focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", e => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        select(tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length], true);
      }
    });
  });
})();

// Hero slider: ganti slide otomatis (Platform, Absen, Gudang, Kosan). Waktu tiap slide diatur oleh animasi
// bar progres di tab (CSS), jadi pause/resume otomatis sinkron. Berhenti saat di-hover, difokus, disentuh,
// tab tidak aktif, atau hero di luar layar. Bisa di-swipe, panah, dan tab. Tidak otomatis kalau reduced-motion.
(() => {
  const hero = document.getElementById("hero");
  if (!hero) return;
  const slides = [...hero.querySelectorAll(".hslide")];
  const tabs = [...hero.querySelectorAll(".htab")];
  const DELAY = 7000;
  let index = 0, hover = false, focus = false, touch = false, visible = true;
  hero.style.setProperty("--delay", DELAY + "ms");

  const sync = () => hero.classList.toggle("is-paused", hover || focus || touch || !visible || document.hidden);
  const show = n => {
    index = (n + slides.length) % slides.length;
    hero.dataset.i = index;
    slides.forEach((s, k) => {
      const on = k === index;
      s.classList.toggle("is-active", on);
      s.inert = !on;
      s.setAttribute("aria-hidden", on ? "false" : "true");
    });
    tabs.forEach((t, k) => {
      t.classList.remove("is-active");
      if (k === index) { void t.offsetWidth; t.classList.add("is-active"); t.setAttribute("aria-current", "true"); }
      else t.removeAttribute("aria-current");
    });
  };

  tabs.forEach((t, k) => t.addEventListener("click", () => show(k)));
  document.getElementById("heroPrev").addEventListener("click", () => show(index - 1));
  document.getElementById("heroNext").addEventListener("click", () => show(index + 1));
  // bar progres selesai = waktunya slide berikutnya
  tabs.forEach(t => t.addEventListener("animationend", e => {
    if (e.animationName === "fill" && t.classList.contains("is-active")) show(index + 1);
  }));

  const stage = document.getElementById("heroStage");
  stage.addEventListener("mouseenter", () => { hover = true; sync(); });
  stage.addEventListener("mouseleave", () => { hover = false; sync(); });
  hero.addEventListener("focusin", () => { focus = true; sync(); });
  hero.addEventListener("focusout", () => { focus = false; sync(); });
  document.addEventListener("visibilitychange", sync);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.25 }).observe(hero);
  }

  // Swipe di layar sentuh
  let sx = 0, sy = 0;
  stage.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; touch = true; sync(); }, { passive: true });
  stage.addEventListener("touchend", e => {
    touch = false; sync();
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
  stage.addEventListener("touchcancel", () => { touch = false; sync(); }, { passive: true });

  show(0);
})();

// Slider CTA: geser otomatis, bisa di-swipe, dots & panah. Berhenti saat disentuh/di-hover,
// saat tab tidak aktif, saat slider di luar layar, dan tidak otomatis kalau pengguna memilih reduced-motion.
(() => {
  const track = document.getElementById("ctaTrack");
  const dotsBox = document.getElementById("ctaDots");
  if (!track || !dotsBox) return;
  const slides = [...track.children];
  const slider = document.getElementById("ctaSlider");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DELAY = 6000;
  let index = 0, timer = null, paused = false, visible = true, lockUntil = 0;

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cta__dot";
    b.setAttribute("aria-label", "Ke slide " + (i + 1));
    b.addEventListener("click", () => { go(i); restart(); });
    dotsBox.appendChild(b);
    return b;
  });

  const mark = i => {
    index = i;
    dots.forEach((d, n) => {
      d.classList.toggle("is-active", n === i);
      if (n === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
    });
  };
  const go = i => {
    const n = (i + slides.length) % slides.length;
    lockUntil = Date.now() + 800;   // abaikan event scroll selama animasi geser
    track.scrollTo({ left: n * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
    mark(n);
  };
  const stop = () => { clearInterval(timer); timer = null; };
  const start = () => {
    if (reduce || timer) return;
    timer = setInterval(() => { if (!paused && visible && !document.hidden) go(index + 1); }, DELAY);
  };
  const restart = () => { stop(); start(); };

  track.addEventListener("scroll", () => {
    if (Date.now() < lockUntil) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== index && i >= 0 && i < slides.length) mark(i);
  }, { passive: true });
  document.getElementById("ctaPrev").addEventListener("click", () => { go(index - 1); restart(); });
  document.getElementById("ctaNext").addEventListener("click", () => { go(index + 1); restart(); });

  const hold = () => { paused = true; };
  const release = () => { paused = false; restart(); };
  slider.addEventListener("mouseenter", hold);
  slider.addEventListener("mouseleave", release);
  slider.addEventListener("focusin", hold);
  slider.addEventListener("focusout", release);
  slider.addEventListener("touchstart", hold, { passive: true });
  slider.addEventListener("touchend", release, { passive: true });
  addEventListener("resize", () => track.scrollTo({ left: index * track.clientWidth, behavior: "auto" }));

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.4 }).observe(slider);
  }
  mark(0);
  start();
})();
