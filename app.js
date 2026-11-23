// Fonctionnement du site (pas besoin d'y toucher pour changer le contenu : voir data.js et shop.json).
const T = {
  fr: {},
  en: {
    mock: "Work in progress: merch photos and dates coming soon.",
    menu: "Menu", nav_home: "Home", nav_shows: "Shows", nav_contact: "Contact", nav_shop: "Merch",
    h_merch: "Merch", all_products: "All products",
    h_clip: "Videos", all_videos: "All videos", official_video: "Official music video", h_listen: "Listen", h_next: "Upcoming shows", all_shows: "All dates",
    live: "Live", booking_line: "Promoters, venues, festivals: get in touch from the Contact page.",
    official: "Official", see_cart: "View cart",
    s1t: "Secure payment", s1: "Card payment through SumUp.",
    s2t: "Shipping across Europe", s2: "Colissimo or Mondial Relay pickup point, shipped within a week.",
    s3t: "Pick up at a show", s3: "Order online, collect at the merch stand on show night.",
    write: "Write to the band", c_mail: "Email", c_label: "Label", c_social: "Socials",
    c_text: "Booking, press, a question about an order: write to us here, we answer fast.", c_btn: "Send", f_name2: "Name", f_msg: "Message", c_ok: "Message sent, thank you! We'll get back to you soon.", c_err: "The message could not be sent. Please try again, or email us directly.",
    legal: "Legal notice",
    tickets: "Tickets", soon: "Coming soon", noshow: "No dates announced yet. Follow us on Instagram to be the first to know.",
    listen_all: "All platforms", tracks: "tracks", cover_of: "Cover of", onesize: "One size", sizes: "Size", qty: "Quantity",
    add: "Add to cart", added: "Added to cart", view_cart: "View cart", pick_size: "Pick a size first.",
    soldout: "Sold out", cart: "Cart", cart_empty: "Your cart is empty.", cart_go: "See the merch", remove: "Remove",
    o_ship: "Delivery", o_you: "Your details", o_sum: "Summary", o_sub: "Items", o_shipc: "Delivery", o_total: "Total",
    o_pay: "Pay with SumUp", o_wait: "Opening payment…",
    o_note: "Choose everything here, then pay by card on SumUp's secure page. You get a confirmation email, we ship within a week.",
    free: "Free", free_from: "Free delivery from {x}.", free_ok: "Delivery is on us.",
    f_name: "First and last name", f_email: "Email", f_phone: "Phone (for the courier)", f_addr: "Address", f_zip: "Postcode",
    f_city: "City", f_country: "Country", f_relay: "Chosen pickup point (name and town)", f_relay_find: "Find a Mondial Relay pickup point ↗",
    f_show: "Which show?", f_note: "A word for the band (optional)",
    e_fields: "Please fill in the highlighted fields.", e_pay: "Payment could not start. Try again, or email us.",
    m_h: "Thank you!", m_p: "Your order is in. We'll get it ready and email you as soon as it ships.",
    m_fail: "Payment not completed", m_fail_p: "Your card was not charged. Your cart is still here if you want to try again.",
    m_back: "Back to the site", m_cart: "Back to cart"
  }
};
const FR = {
  tickets: "Billets", soon: "Bientôt", noshow: "Pas de date annoncée pour l'instant. Suivez-nous sur Instagram pour l'apprendre en premier.",
  listen_all: "Toutes les plateformes", all_videos: "Toutes les vidéos", official_video: "Clip officiel", tracks: "titres", cover_of: "Pochette de", onesize: "Taille unique", sizes: "Taille", qty: "Quantité",
  add: "Ajouter au panier", added: "Ajouté au panier", view_cart: "Voir le panier", pick_size: "Choisis d'abord une taille.",
  soldout: "Épuisé", remove: "Retirer", o_wait: "Ouverture du paiement…",
  free: "Offerte", free_from: "Livraison offerte dès {x} d'articles.", free_ok: "La livraison est offerte.",
  c_err: "Le message n'a pas pu partir. Réessaie, ou écris-nous directement par email.",
  e_fields: "Remplis les champs signalés.", e_pay: "Le paiement n'a pas pu démarrer. Réessaie, ou écris-nous.",
  m_fail: "Paiement non abouti", m_fail_p: "Ta carte n'a pas été débitée. Ton panier t'attend si tu veux réessayer.", m_cart: "Retour au panier"
};
const MONTHS = { fr: ["JANV", "FÉV", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"], en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] };

let lang = (navigator.language || "fr").slice(0, 2) === "fr" ? "fr" : "en";
try { lang = localStorage.getItem("jiro-lang") || lang; } catch (e) {}
document.querySelectorAll("[data-i18n]").forEach(el => { T.fr[el.dataset.i18n] = T.fr[el.dataset.i18n] || el.textContent; });
Object.assign(T.fr, FR);
const t = k => T[lang][k] ?? T.fr[k];

function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
function ext(a, url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
const eur = n => (lang === "fr" ? n.toFixed(2).replace(".", ",") + " €" : "€" + n.toFixed(2)).replace(/[,.]00( €)?$/, "$1");

let SHOP = { products: [], shipping: [], freeShippingFrom: 0 };
const prod = id => SHOP.products.find(p => p.id === id);
const isOut = (p, size) => p.soldout === "all" || (size ? (p.soldout || []).includes(size) : (p.sizes.length && p.sizes.every(s => (p.soldout || []).includes(s))));

// ---------- panier ----------
let cart = [];
try { cart = JSON.parse(localStorage.getItem("jiro-cart") || "[]"); } catch (e) {}
let shipSel = "colissimo";
function saveCart() { try { localStorage.setItem("jiro-cart", JSON.stringify(cart)); } catch (e) {} updateCount(); }
function updateCount() { const n = cart.reduce((a, l) => a + l.qty, 0); const b = document.getElementById("cart-n"); b.textContent = n; b.parentElement.classList.toggle("has", n > 0); }
function addToCart(id, size, qty) {
  const l = cart.find(x => x.id === id && x.size === size);
  if (l) l.qty = Math.min(20, l.qty + qty); else cart.push({ id, size, qty });
  saveCart();
}
function subtotal() { return cart.reduce((a, l) => { const p = prod(l.id); return a + (p ? p.p * l.qty : 0); }, 0); }
function shipCost(sub) { const s = SHOP.shipping.find(x => x.id === shipSel); if (!s) return 0; return SHOP.freeShippingFrom > 0 && sub >= SHOP.freeShippingFrom ? 0 : s.p; }

let toastT;
function toast(msg, link) {
  const b = document.getElementById("toast"); b.textContent = msg;
  if (link) { const a = el("a", null, link); a.href = "#panier"; b.append(" ", a); }
  b.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { b.hidden = true; }, 3500);
}

// ---------- rendu ----------
let BIT_SHOWS = [];
function upcoming() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const seen = new Set(BIT_SHOWS.map(s => s.date + "|" + s.city.toLowerCase()));
  const all = BIT_SHOWS.concat(SHOWS.filter(s => !seen.has(s.date + "|" + s.city.toLowerCase())));
  return all.filter(s => new Date(s.date + "T00:00:00") >= today).sort((a, b) => a.date.localeCompare(b.date));
}
function picImg(src) { const im = document.createElement("img"); im.alt = ""; im.src = src || "img/mono.png"; if (src) im.className = "photo"; im.loading = "lazy"; return im; }

function renderProduct(p) {
  const box = document.querySelector("#v-produit .pp"); box.textContent = "";
  const gal = el("div", "pp-gal"); (p.img.length ? p.img : [""]).forEach(s => { const f = el("div", "pic"); f.append(picImg(s)); gal.append(f); });
  const info = el("div", "pp-info");
  const back = el("a", "back", "← " + t("nav_shop")); back.href = "#merch";
  info.append(back, el("h2", null, p[lang]), el("p", "pp-price", eur(p.p)), el("p", "pp-desc", p.d[lang]));
  let size = "";
  if (p.sizes.length) {
    const s = el("fieldset", "pp-sizes"); s.append(el("legend", "eyebrow", t("sizes")));
    const ul = el("div", "chips");
    p.sizes.forEach(z => {
      const b = el("button", "chip", z); b.type = "button";
      if (isOut(p, z)) { b.disabled = true; b.title = t("soldout"); }
      b.setAttribute("aria-pressed", "false");
      b.onclick = () => { size = z; ul.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b)); msg.hidden = true; };
      ul.append(b);
    });
    s.append(ul); info.append(s);
  }
  const q = el("div", "qty"); q.append(el("span", "eyebrow", t("qty")));
  const step = el("div", "stepper"); let qty = 1;
  const minus = el("button", null, "−"), val = el("output", null, "1"), plus = el("button", null, "+");
  minus.type = plus.type = "button"; minus.setAttribute("aria-label", "−1"); plus.setAttribute("aria-label", "+1");
  minus.onclick = () => { qty = Math.max(1, qty - 1); val.textContent = qty; };
  plus.onclick = () => { qty = Math.min(20, qty + 1); val.textContent = qty; };
  step.append(minus, val, plus); q.append(step); info.append(q);
  const msg = el("p", "err", t("pick_size")); msg.hidden = true;
  const add = el("button", "btn solid", isOut(p) ? t("soldout") : t("add")); add.type = "button"; add.disabled = isOut(p);
  add.onclick = () => {
    if (p.sizes.length && !size) { msg.hidden = false; return; }
    addToCart(p.id, size, qty); toast(t("added") + " : " + p[lang] + (size ? " (" + size + ")" : ""), t("view_cart"));
  };
  info.append(add, msg);
  box.append(gal, info);
  document.title = p[lang] + " · JIRO";
}

function renderCart() {
  const lines = document.getElementById("cart-lines"); lines.textContent = "";
  cart = cart.filter(l => prod(l.id));
  const empty = !cart.length;
  document.getElementById("cart-empty").hidden = !empty;
  document.getElementById("cart-full").hidden = empty;
  if (empty) return;
  cart.forEach((l, i) => {
    const p = prod(l.id); const li = el("li");
    const a = el("a", "lpic"); a.href = "#produit-" + p.id; a.append(picImg(p.img[0]));
    const mid = el("div", "lmid"); const n = el("a", "lname", p[lang]); n.href = "#produit-" + p.id;
    mid.append(n, el("span", "lmeta", (l.size ? t("sizes") + " " + l.size + " · " : "") + eur(p.p)));
    const step = el("div", "stepper");
    const minus = el("button", null, "−"), val = el("output", null, String(l.qty)), plus = el("button", null, "+");
    minus.type = plus.type = "button";
    minus.onclick = () => { if (l.qty > 1) l.qty--; else cart.splice(i, 1); saveCart(); renderCart(); };
    plus.onclick = () => { l.qty = Math.min(20, l.qty + 1); saveCart(); renderCart(); };
    step.append(minus, val, plus);
    const rm = el("button", "rm", t("remove")); rm.type = "button"; rm.onclick = () => { cart.splice(i, 1); saveCart(); renderCart(); };
    mid.append(step);
    const right = el("div", "lright"); right.append(el("b", null, eur(p.p * l.qty)), rm);
    li.append(a, mid, right); lines.append(li);
  });

  const ship = document.getElementById("ship"); ship.textContent = "";
  const sub = subtotal(), free = SHOP.freeShippingFrom > 0 && sub >= SHOP.freeShippingFrom;
  SHOP.shipping.forEach(s => {
    const lab = el("label", "opt"); const r = el("input"); r.type = "radio"; r.name = "shipping"; r.value = s.id; r.checked = s.id === shipSel;
    r.onchange = () => { shipSel = s.id; renderCart(); };
    lab.append(r, el("span", null, s[lang]), el("b", null, s.p === 0 || free ? t("free") : eur(s.p)));
    ship.append(lab);
  });
  const cur = SHOP.shipping.find(s => s.id === shipSel) || {};
  document.getElementById("addr").hidden = !cur.address || cur.relay;
  document.getElementById("relay").hidden = !cur.relay;
  document.getElementById("showpick").hidden = cur.address !== false;
  const fs = document.getElementById("freeship");
  fs.textContent = SHOP.freeShippingFrom > 0 ? (free ? t("free_ok") : t("free_from").replace("{x}", eur(SHOP.freeShippingFrom))) : "";
  const sc = shipCost(sub);
  document.getElementById("s-sub").textContent = eur(sub);
  document.getElementById("s-ship").textContent = sc === 0 ? t("free") : eur(sc);
  document.getElementById("s-tot").textContent = eur(sub + sc);
}

function render() {
  document.querySelectorAll("[data-products]").forEach(g => {
    g.textContent = "";
    const n = g.dataset.products === "all" ? SHOP.products.length : +g.dataset.products;
    SHOP.products.slice(0, n).forEach(p => {
      const a = el("a", "prod"); a.href = "#produit-" + p.id;
      const pic = el("div", "pic"); pic.append(picImg(p.img[0]));
      if (isOut(p)) pic.append(el("span", "ph", t("soldout")));
      const row = el("div", "row"); row.append(el("h3", null, p[lang]), el("span", "price", eur(p.p)));
      a.append(pic, row, el("span", "meta", p.sizes.length ? p.sizes.join(" · ") : t("onesize")));
      g.append(a);
    });
  });

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
  RELEASES.forEach(r => {
    const card = el("article", "rel");
    const cv = el("a", "rel-cover"); ext(cv, r.url); cv.setAttribute("aria-label", r.title + " – " + t("listen_all"));
    const im = el("img"); im.src = r.cover; im.alt = t("cover_of") + " " + r.title; im.loading = "lazy"; im.width = 600; im.height = 600; cv.append(im);
    const info = el("div", "rel-info");
    info.append(el("span", "eyebrow", [r.type, r.year, r.tracks.length + " " + t("tracks")].join(" · ")), el("h3", null, r.title));
    const ol = el("ol", "tracks");
    r.tracks.forEach(([n, d]) => { const li = el("li"); li.append(el("span", null, n), el("small", null, d)); ol.append(li); });
    const btns = el("div", "rel-btns");
    [["Spotify", r.spotify, "btn solid"], ["Apple Music", r.apple, "btn"], [t("listen_all"), r.url, "btn"]].forEach(([l, u, c]) => { if (!u) return; const b = el("a", c, l); ext(b, u); btns.append(b); });
    info.append(ol, btns); card.append(cv, info); listen.append(card);
  });

  ext(document.getElementById("yt-all"), LINKS.youtube);
  const clips = document.getElementById("clips"); clips.textContent = "";
  (LINKS.clips || []).forEach(c => {
    const id = (c.url.match(/[?&]v=([\w-]{11})/) || c.url.match(/youtu\.be\/([\w-]{11})/) || [])[1];
    const a = el("a", "clip"); ext(a, c.url);
    const im = el("img"); im.alt = ""; im.loading = "lazy"; if (id) im.src = "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";
    const pl = el("span", "play"); const i = el("i"); i.setAttribute("aria-hidden", "true"); pl.append(i);
    const cap = el("span", "clip-cap"); cap.append(el("b", null, c.title), el("small", null, t("official_video")));
    a.append(im, pl, cap); clips.append(a);
  });
  renderCart();
}

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(e => { e.textContent = t(e.dataset.i18n); });
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  render();
  if (!document.getElementById("v-produit").hidden) route();
}
document.querySelectorAll("[data-lang]").forEach(b => b.addEventListener("click", () => { lang = b.dataset.lang; try { localStorage.setItem("jiro-lang", lang); } catch (e) {} applyLang(); }));

// ---------- commande ----------
const form = document.getElementById("order");
form.addEventListener("submit", async ev => {
  ev.preventDefault();
  const err = document.getElementById("order-err"); err.hidden = true;
  if (!CHECKOUT_API) { window.open(SHOP_URL, "_blank", "noopener"); return; }
  const cur = SHOP.shipping.find(s => s.id === shipSel);
  const need = ["name", "email"];
  if (cur.address && !cur.relay) need.push("address", "zip", "city", "country");
  if (cur.relay) need.push("relay");
  if (cur.address === false) need.push("show");
  let bad = false;
  form.querySelectorAll("input,textarea").forEach(i => i.removeAttribute("aria-invalid"));
  need.forEach(n => { const i = form.elements[n]; const v = i.value.trim(); if (!v || (n === "email" && !/^\S+@\S+\.\S+$/.test(v))) { i.setAttribute("aria-invalid", "true"); bad = true; } });
  if (bad) { err.textContent = t("e_fields"); err.hidden = false; form.querySelector("[aria-invalid]").focus(); return; }

  const pay = document.getElementById("pay"); pay.disabled = true; pay.textContent = t("o_wait");
  const f = Object.fromEntries(new FormData(form));
  try {
    const r = await fetch(CHECKOUT_API.replace(/\/$/, "") + "/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cart, shipping: shipSel, back: location.origin + location.pathname }) });
    const o = await r.json();
    if (!r.ok || !o.url) throw new Error(o.error || "checkout");
    const where = cur.relay ? "Point relais : " + f.relay : cur.address ? [f.address, f.zip + " " + f.city, f.country].join("\n") : "Retrait au concert : " + f.show;
    const recap = o.lines.map(l => `${l.qty} x ${l.name}${l.size ? " (" + l.size + ")" : ""} = ${l.total} €`).join("\n");
    const body = {
      access_key: FORM_KEY, subject: `Commande ${o.ref} – ${o.total} € – ${f.name}`, from_name: "Site JIRO", replyto: f.email,
      "Référence": o.ref, "Statut": "Paiement à vérifier dans SumUp (référence ci-dessus)",
      "Client": f.name, "Email": f.email, "Téléphone": f.phone || "-",
      "Livraison": `${o.shipping.name} (${o.shipping.price} €)`, "Adresse": where,
      "Articles": recap, "Total payé": o.total + " €", "Message": f.note || "-"
    };
    if (FORM_KEY) {
      const m = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
      if (!m.ok) throw new Error("mail");
    }
    try { sessionStorage.setItem("jiro-pending", o.ref); } catch (e) {}
    location.href = o.url;
  } catch (e) {
    err.textContent = t("e_pay"); err.hidden = false; pay.disabled = false; pay.textContent = t("o_pay");
  }
});

async function thanks(ref) {
  document.getElementById("merci-ref").textContent = ref;
  let st = "";
  if (CHECKOUT_API) { try { st = (await (await fetch(CHECKOUT_API.replace(/\/$/, "") + "/status?ref=" + encodeURIComponent(ref))).json()).status; } catch (e) {} }
  const ok = st !== "FAILED";
  const back = document.querySelector("#v-merci .btn");
  if (ok) { cart = []; saveCart(); renderCart(); document.getElementById("merci-h").textContent = t("m_h"); document.getElementById("merci-p").textContent = t("m_p"); back.href = "#accueil"; back.textContent = t("m_back"); }
  else { document.getElementById("merci-h").textContent = t("m_fail"); document.getElementById("merci-p").textContent = t("m_fail_p"); back.href = "#panier"; back.textContent = t("m_cart"); }
}

// Contact & réseaux
const mailto = "mailto:" + LINKS.email;
document.querySelectorAll("#mail, .mail-plain").forEach(a => { a.href = mailto; a.textContent = LINKS.email; });
const cform = document.getElementById("contact-form");
cform.addEventListener("submit", async ev => {
  ev.preventDefault();
  const err = document.getElementById("contact-err"), ok = document.getElementById("contact-ok"), btn = document.getElementById("contact-send");
  err.hidden = true; ok.hidden = true; let bad = false;
  ["name", "email", "message"].forEach(n => { const i = cform.elements[n], v = i.value.trim(); const no = !v || (n === "email" && !/^\S+@\S+\.\S+$/.test(v)); if (no) { i.setAttribute("aria-invalid", "true"); bad = true; } else i.removeAttribute("aria-invalid"); });
  if (bad) { err.textContent = t("e_fields"); err.hidden = false; return; }
  if (cform.elements.botcheck.checked) return;
  btn.disabled = true;
  try {
    const f = Object.fromEntries(new FormData(cform));
    const r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: FORM_KEY, subject: "Contact site – " + f.name, from_name: "Site JIRO", replyto: f.email, "Nom": f.name, "Email": f.email, "Message": f.message }) });
    if (!r.ok) throw new Error("mail");
    cform.reset(); ok.hidden = false;
  } catch (e) { err.textContent = t("c_err"); err.hidden = false; }
  btn.disabled = false;
});
const soc = document.getElementById("socials");
[["Instagram", LINKS.instagram], ["TikTok", LINKS.tiktok], ["Facebook", LINKS.facebook], ["YouTube", LINKS.youtube]].forEach(([n, u]) => { const a = el("a", null, n); ext(a, u); soc.append(a); });
document.getElementById("year").textContent = new Date().getFullYear();

// Navigation entre pages
const VIEWS = ["accueil", "concerts", "boutique", "panier", "merci", "contact", "mentions", "produit"];
const nav = document.getElementById("nav"), burger = document.getElementById("burger");
function route() {
  let h = location.hash.slice(1);
  if (h === "merch") h = "boutique"; // #boutique reste accepté (anciens liens)
  const p = h.startsWith("produit-") && prod(h.slice(8));
  const v = p ? "produit" : VIEWS.includes(h) && h !== "produit" && h !== "merci" ? h : document.getElementById("v-merci").dataset.on ? "merci" : "accueil";
  if (p) renderProduct(p); else document.title = "JIRO – Metalcore, Paris · Site officiel";
  if (v === "panier") renderCart();
  VIEWS.forEach(x => { document.getElementById("v-" + x).hidden = x !== v; });
  document.querySelectorAll(".nav ul a").forEach(a => { if (a.getAttribute("href") === "#" + ({ boutique: "merch", produit: "merch" }[v] || v)) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}
burger.addEventListener("click", () => { const o = nav.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
window.addEventListener("hashchange", () => { delete document.getElementById("v-merci").dataset.on; route(); });

// Dates Bandsintown (si la clé est renseignée dans data.js)
if (typeof BIT_APP_ID !== "undefined" && BIT_APP_ID) {
  fetch("https://rest.bandsintown.com/artists/" + encodeURIComponent(BIT_ARTIST) + "/events?app_id=" + encodeURIComponent(BIT_APP_ID))
    .then(r => r.ok ? r.json() : []).then(evs => {
      if (!Array.isArray(evs)) return;
      BIT_SHOWS = evs.map(e => {
        const v = e.venue || {}, tk = (e.offers || []).find(o => o.url);
        return { date: String(e.datetime || "").slice(0, 10), city: v.city || v.location || "", venue: v.name || "", tickets: tk ? tk.url : e.url };
      }).filter(s => /^\d{4}-\d{2}-\d{2}$/.test(s.date));
      render();
    }).catch(() => {});
}

fetch("shop.json", { cache: "no-cache" }).then(r => r.json()).then(s => { SHOP = s; if (!SHOP.shipping.find(x => x.id === shipSel)) shipSel = SHOP.shipping[0].id; })
  .catch(() => {}).finally(() => {
    updateCount(); applyLang();
    const ref = new URLSearchParams(location.search).get("merci");
    if (ref) { document.getElementById("v-merci").dataset.on = "1"; history.replaceState(null, "", location.pathname + "#merci"); thanks(ref); }
    route();
  });
