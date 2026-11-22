# Serveur de paiement JIRO

Petit programme hébergé gratuitement chez Cloudflare (Workers). Il reçoit le panier
du site, recalcule le prix depuis `shop.json`, crée la page de paiement SumUp et
y envoie le client. Code : `worker.js`.

Réglages dans Cloudflare > Workers > jiro-paiement > Settings > Variables and Secrets :

| Nom | Type | Valeur |
|---|---|---|
| SUMUP_API_KEY | Secret | la clé API SumUp (sup_sk_…) |
| MERCHANT_CODE | Text | code marchand SumUp |
| SITE_URL | Text | https://sonnetben-ux.github.io/jiro-site/ (puis https://www.jiro-official.com/) |
| SHOP_JSON_URL | Text | SITE_URL + shop.json |

Ensuite, mettre l'adresse du Worker dans `CHECKOUT_API` (data.js).
