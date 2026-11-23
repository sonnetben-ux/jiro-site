// =====================================================================
// CONTENU DU SITE JIRO — c'est le seul fichier à modifier au quotidien.
// =====================================================================

// Boutique SumUp (secours tant que le paiement depuis le panier n'est pas branché).
const SHOP_URL = "https://jiro-official.sumupstore.com";

// Liens
const LINKS = {
  instagram: "https://www.instagram.com/jirotheband",
  tiktok: "https://www.tiktok.com/@jirotheband",
  facebook: "https://www.facebook.com/JIROtheband",
  youtube: "https://www.youtube.com/@jirotheband",
  email: "jirotheband@gmail.com",
  // Dernier clip : mettre l'adresse YouTube de la vidéo et son titre.
  clipUrl: "https://www.youtube.com/watch?v=rVrquRGNso8",
  clipTitle: { fr: "Shattering – clip officiel", en: "Shattering – official video" },
  clipImg: "img/clip-soleil.jpg"
};

// Sorties : chaque lien ouvre une page qui liste toutes les plateformes
// (Spotify, Apple Music, Deezer…).
const RELEASES = [
  { title: "Adrift in Silence", url: "https://bfan.link/adrift-in-silence" },
  { title: "Elevate Spirit", url: "https://ditto.fm/jiro-elevate-spirit" }
];

// Les produits, les tailles, les prix et les frais de port sont dans shop.json.

// Paiement : adresse du serveur de paiement (Cloudflare Worker) et clé
// Web3Forms qui envoie chaque commande par email. Tant que CHECKOUT_API est
// vide, le bouton « Payer » renvoie vers la boutique SumUp.
const CHECKOUT_API = "https://jiro-paiement.jirotheband.workers.dev";
const FORM_KEY = "3d05540c-72c0-433f-9d01-30c28db6a460";

// Bandsintown : les dates publiées sur Bandsintown s'affichent toutes seules.
// BIT_APP_ID = clé « API » du compte Bandsintown for Artists (laisser vide pour
// n'utiliser que la liste SHOWS ci-dessous).
const BIT_ARTIST = "id_15546483";
const BIT_APP_ID = "";

// Concerts ajoutés à la main (en plus de Bandsintown, ou en secours),
// du plus proche au plus lointain.
// Exemple : { date: "2026-12-12", city: "Paris", venue: "Le Gibus", tickets: "https://..." }
// Les dates passées disparaissent toutes seules.
const SHOWS = [
];
