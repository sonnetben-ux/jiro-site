// Serveur de paiement JIRO (Cloudflare Worker).
// Il reçoit le panier du site, recalcule le total à partir de shop.json
// (on ne fait jamais confiance au prix envoyé par le navigateur), crée un
// paiement SumUp « Hosted Checkout » et renvoie l'adresse de la page de paiement.
//
// Variables à régler dans Cloudflare (Settings > Variables and Secrets) :
//   SUMUP_API_KEY  (Secret)  clé API SumUp, commence par sup_sk_
//   MERCHANT_CODE  (Text)    code marchand SumUp, ex. MYQEXD9E
//   SITE_URL       (Text)    adresse du site, ex. https://sonnetben-ux.github.io/jiro-site/
//   SHOP_JSON_URL  (Text)    adresse de shop.json, ex. https://sonnetben-ux.github.io/jiro-site/shop.json

const SUMUP = "https://api.sumup.com/v0.1";

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = new URL(env.SITE_URL).origin;
    const cors = {
      "Access-Control-Allow-Origin": origin === allowed || origin.startsWith("http://localhost") ? origin : allowed,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });

    const url = new URL(req.url);
    try {
      if (url.pathname === "/checkout" && req.method === "POST") return json(...(await checkout(await req.json(), env)));
      if (url.pathname === "/status" && req.method === "GET") return json(...(await status(url.searchParams.get("ref"), env)));
      return json({ ok: true, service: "jiro-paiement" });
    } catch (e) {
      return json({ error: "server", message: String(e && e.message || e) }, 500);
    }
  }
};

async function checkout(body, env) {
  const shop = await (await fetch(env.SHOP_JSON_URL, { cf: { cacheTtl: 60 } })).json();
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length || items.length > 30) return [{ error: "cart" }, 400];

  let sub = 0; const lines = [];
  for (const it of items) {
    const p = shop.products.find(x => x.id === it.id);
    const qty = Math.floor(Number(it.qty));
    if (!p || !(qty >= 1 && qty <= 20)) return [{ error: "item", id: it.id }, 400];
    if (p.soldout === "all") return [{ error: "soldout", id: p.id }, 409];
    let size = "";
    if (p.sizes.length) {
      size = String(it.size || "");
      if (!p.sizes.includes(size)) return [{ error: "size", id: p.id }, 400];
      if ((p.soldout || []).includes(size)) return [{ error: "soldout", id: p.id, size }, 409];
    }
    const cents = Math.round(p.p * 100) * qty;
    sub += cents;
    lines.push({ id: p.id, name: p.fr, size, qty, total: cents / 100 });
  }

  const ship = shop.shipping.find(s => s.id === body.shipping);
  if (!ship) return [{ error: "shipping" }, 400];
  const free = shop.freeShippingFrom > 0 && sub >= shop.freeShippingFrom * 100;
  const shipCents = free ? 0 : Math.round(ship.p * 100);
  const total = (sub + shipCents) / 100;

  const d = new Date();
  const ref = "JIRO-" + d.toISOString().slice(2, 10).replace(/-/g, "") + "-" + crypto.randomUUID().slice(0, 5).toUpperCase();
  const redirect = new URL(env.SITE_URL); redirect.searchParams.set("merci", ref);

  const r = await fetch(SUMUP + "/checkouts", {
    method: "POST",
    headers: { "Authorization": "Bearer " + env.SUMUP_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      checkout_reference: ref,
      amount: total,
      currency: "EUR",
      merchant_code: env.MERCHANT_CODE,
      description: ("Commande " + ref + " : " + lines.map(l => l.qty + "x " + l.name + (l.size ? " " + l.size : "")).join(", ")).slice(0, 250),
      redirect_url: redirect.toString(),
      hosted_checkout: { enabled: true }
    })
  });
  const c = await r.json().catch(() => ({}));
  if (!r.ok || !c.hosted_checkout_url) return [{ error: "sumup", status: r.status, detail: c }, 502];
  return [{ url: c.hosted_checkout_url, ref, lines, subtotal: sub / 100, shipping: { id: ship.id, name: ship.fr, price: shipCents / 100 }, total }];
}

async function status(ref, env) {
  if (!ref || !/^JIRO-[0-9A-Z-]{6,20}$/.test(ref)) return [{ error: "ref" }, 400];
  const r = await fetch(SUMUP + "/checkouts?checkout_reference=" + encodeURIComponent(ref), {
    headers: { "Authorization": "Bearer " + env.SUMUP_API_KEY }
  });
  const list = await r.json().catch(() => []);
  const c = Array.isArray(list) ? list[list.length - 1] : null;
  if (!c) return [{ ref, status: "UNKNOWN" }];
  return [{ ref, status: c.status, amount: c.amount }];
}
