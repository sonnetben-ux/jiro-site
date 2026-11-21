// Fonctionnement du site (pas besoin d'y toucher pour changer le contenu : voir data.js).
const T = {
  fr: {},
  en: {
    mock: "Work in progress: merch photos and dates coming soon.",
    menu: "Menu", nav_home: "Home", nav_shows: "Shows", nav_contact: "Contact", nav_shop: "Shop",
    hero_p: "New video “Shattering” is out. The T-shirt from the video and all official merch are in the shop, shipped from Paris.",
    cta_shop: "Shop now", cta_shows: "Upcoming shows", h_merch: "Merch", all_products: "All products",
    h_clip: "Latest video", h_listen: "Listen", h_next: "Upcoming shows", all_shows: "All dates",
    live: "Live", booking_line: "Promoters, venues, festivals: get in touch from the Contact page.",
    official: "Official", shop_all: "Full shop",
    s1t: "Secure payment", s1: "Card payment through SumUp.",
    s2t: "Shipping across Europe", s2: "Colissimo or Mondial Relay pickup point, shipped within a week.",
    s3t: "Pick up at a show", s3: "Order online, collect at the merch stand on show night.",
    write: "Write to the band", c_mail: "Email", c_label: "Label", c_social: "Socials",
    c_text: "Booking, press, a question about an order: just send an email, we answer fast.", c_btn: "Email us",
    legal: "Legal notice",
    tickets: "Tickets", buy: "Buy", soon: "Coming soon", noshow: "No dates announced yet. Follow us on Instagram to be the first to know.",
    listen_all: "All platforms", onesize: "One size", sizes: "Sizes", buy_btn: "Buy", buy_note: "Payment, size choice and shipping are handled on our secure SumUp shop."
  }
};
const FR = { tickets: "Billets", buy: "Acheter", soon: "Bientôt", noshow: "Pas de date annoncée pour l'instant. Suivez-nous sur Instagram pour l'apprendre en premier.", listen_all: "Toutes les plateformes", onesize: "Taille unique", sizes: "Tailles", buy_btn: "Acheter", buy_note: "Le paiement, le choix de la taille et la livraison se font sur notre boutique sécurisée SumUp." };
const MONTHS = { fr: ["JANV", "FÉV", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"], en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] };

let lang = "fr";
lang = (navigator.language || "fr").slice(0, 2) === "fr" ? "fr" : "en";
try { lang = localStorage.getItem("jiro-lang") || lang; } catch (e) {}
document.querySelectorAll("[data-i18n]").forEach(el => { T.fr[el.dataset.i18n] = T.fr[el.dataset.i18n] || el.textContent; });
Object.assign(T.fr, FR);
const t = k => T[lang][k] ?? T.fr[k];

function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function ext(a, url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }

function upcoming() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return SHOWS.filter(s => new Date(s.date + "T00:00:00") >= today).sort((a, b) => a.date.localeCompare(b.date));
}

function picImg(src) {
  const im = document.createElement("img"); im.alt = "";
  im.src = src || "img/mono.png"; if (src) im.className = "photo";
  return im;
}
function renderProduct(p) {
  const v = document.getElementById("v-produit"); const box = v.querySelector(".pp"); box.textContent = "";
  const gal = el("div", "pp-gal"); (p.img.length ? p.img : [""]).forEach(s => { const f = el("div", "pic"); f.append(picImg(s)); gal.append(f); });
  const info = el("div", "pp-info");
  const back = el("a", "back", "← " + t("nav_shop")); back.href = "#boutique";
  info.append(back, el("h2", null, p[lang]), el("p", "pp-price", p.p + " €"), el("p", "pp-desc", p.d[lang]));
  if (p.sizes.length) {
    const s = el("div", "pp-sizes"); s.append(el("span", "eyebrow", t("sizes")));
    const ul = el("div", "chips"); p.sizes.forEach(z => ul.append(el("span", "chip", z))); s.append(ul);
    info.append(s);
  }
  const buy = el("a", "btn solid", t("buy_btn")); ext(buy, p.url || SHOP_URL);
  info.append(buy, el("p", "pp-note", t("buy_note")));
  box.append(gal, info);
  document.title = p[lang] + " · JIRO";
}
function render() {
  document.querySelectorAll("[data-products]").forEach(g => {
    g.textContent = "";
    const n = g.dataset.products === "all" ? PRODUCTS.length : +g.dataset.products;
    PRODUCTS.slice(0, n).forEach(p => {
      const a = el("a", "prod"); a.href = "#produit-" + p.id;
      const pic = el("div", "pic"); pic.append(picImg(p.img[0]));
      const row = el("div", "row"); row.append(el("h3", null, p[lang]), el("span", "price", p.p + " €"));
      a.append(pic, row, el("span", "meta", p.sizes.length ? p.sizes.join(" · ") : t("onesize")));
      g.append(a);
    });
  });
  document.querySelectorAll(".shop-link").forEach(a => { if (SHOP_URL) ext(a, SHOP_URL); else a.hidden = true; });

  const list = upcoming();
  document.querySelectorAll("[data-shows]").forEach(u => {
    u.textContent = "";
    const n = u.dataset.shows === "all" ? list.length : +u.dataset.shows;
    if (!list.length) { const li = el("li"); li.style.display = "block"; li.append(el("p", "empty", t("noshow"))); u.append(li); return; }
    list.slice(0, n).forEach(s => {
      const d0 = new Date(s.date + "T00:00:00");
      const li = el("li");
      const d = el("div", "date", d0.getDate() + " " + MONTHS[lang][d0.getMonth()]); d.append(el("small", null, d0.getFullYear()));
      const w = el("div", "where"); w.append(el("b", null, s.city), el("span", null, s.venue));
      li.append(d, w);
      if (s.tickets) { const b = el("a", "btn", t("tickets")); ext(b, s.tickets); li.append(b); }
      u.append(li);
    });
  });

  const listen = document.getElementById("listen"); listen.textContent = "";
  RELEASES.forEach(r => { const a = el("a"); ext(a, r.url); const s = el("div", null, r.title); s.append(el("small", null, t("listen_all"))); a.append(s, el("span", null, "↗")); listen.append(a); });

  const clip = document.getElementById("clip"); ext(clip, LINKS.clipUrl);
  if (LINKS.clipImg) document.getElementById("clip-img").src = LINKS.clipImg;
  document.getElementById("clip-title").textContent = LINKS.clipTitle[lang];
}

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(e => { e.textContent = t(e.dataset.i18n); });
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  render();
  if (!document.getElementById("v-produit").hidden) route();
}
document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => { lang = b.dataset.lang; try { localStorage.setItem("jiro-lang", lang); } catch (e) {} applyLang(); }));

// Contact & réseaux
const mailto = "mailto:" + LINKS.email;
document.querySelectorAll("#mail, .mail-plain").forEach(a => { a.href = mailto; a.textContent = LINKS.email; });
document.getElementById("mail-btn").href = mailto;
const soc = document.getElementById("socials");
[["Instagram", LINKS.instagram], ["TikTok", LINKS.tiktok], ["Facebook", LINKS.facebook], ["YouTube", LINKS.youtube]].forEach(([n, u]) => { const a = el("a", null, n); ext(a, u); soc.append(a); });
document.getElementById("year").textContent = new Date().getFullYear();

// Navigation entre pages
const VIEWS = ["accueil", "concerts", "boutique", "contact", "mentions", "produit"];
const nav = document.getElementById("nav"), burger = document.getElementById("burger");
function route() {
  const h = location.hash.slice(1);
  const prod = h.startsWith("produit-") && PRODUCTS.find(p => p.id === h.slice(8));
  const v = prod ? "produit" : VIEWS.includes(h) && h !== "produit" ? h : "accueil";
  if (prod) renderProduct(prod); else document.title = "JIRO – Metalcore, Paris · Site officiel";
  VIEWS.forEach(x => { document.getElementById("v-" + x).hidden = x !== v; });
  document.querySelectorAll(".nav ul a").forEach(a => { if (a.getAttribute("href") === "#" + v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}
burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
window.addEventListener("hashchange", route);
applyLang(); route();
