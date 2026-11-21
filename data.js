// =====================================================================
// CONTENU DU SITE JIRO — c'est le seul fichier à modifier au quotidien.
// =====================================================================

// Adresse de la boutique SumUp (à remplacer quand la boutique est publiée).
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

// Produits. Chaque produit a sa page sur le site ; le bouton « Acheter » mène
// directement à ce produit sur la boutique SumUp (url), où l'on paie.
// id : nom court sans espace (sert d'adresse de la page produit).
// img : photos dans le dossier img/ (la première sert de vignette).
// sizes : tailles disponibles (vide = taille unique).
// url : lien du produit sur SumUp (vide = page d'accueil de la boutique).
const PRODUCTS = [
  { id: "tshirt-shattering", fr: "T-shirt « Shattering »", en: "“Shattering” T-shirt", p: 35, img: [], sizes: ["S", "M", "L", "XL", "XXL"], url: "",
    d: { fr: "Le t-shirt du clip « Shattering ». Impression sur t-shirt noir.", en: "The T-shirt from the “Shattering” video. Printed on a black tee." } },
  { id: "tote-contains-riffs", fr: "Tote bag « Contains Riffs »", en: "“Contains Riffs” tote bag", p: 10, img: [], sizes: [], url: "",
    d: { fr: "Tote bag en toile, imprimé « Contains Riffs ».", en: "Canvas tote bag with “Contains Riffs” print." } },
  { id: "cd-adrift-in-silence", fr: "CD – Adrift in Silence", en: "CD – Adrift in Silence", p: 12, img: [], sizes: [], url: "",
    d: { fr: "L'EP « Adrift in Silence » en CD.", en: "The “Adrift in Silence” EP on CD." } },
  { id: "cd-elevate-spirit", fr: "CD – Elevate Spirit", en: "CD – Elevate Spirit", p: 12, img: [], sizes: [], url: "",
    d: { fr: "L'EP « Elevate Spirit » en CD.", en: "The “Elevate Spirit” EP on CD." } }
];

// Concerts à venir, du plus proche au plus lointain.
// Exemple : { date: "2026-12-12", city: "Paris", venue: "Le Gibus", tickets: "https://..." }
// Les dates passées disparaissent toutes seules.
const SHOWS = [
];
