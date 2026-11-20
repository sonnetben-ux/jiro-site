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
  clipImg: "https://i.ytimg.com/vi/rVrquRGNso8/hqdefault.jpg"
};

// Sorties : chaque lien ouvre une page qui liste toutes les plateformes
// (Spotify, Apple Music, Deezer…).
const RELEASES = [
  { title: "Adrift in Silence", url: "https://bfan.link/adrift-in-silence" },
  { title: "Elevate Spirit", url: "https://ditto.fm/jiro-elevate-spirit" }
];

// Produits mis en avant (la vraie fiche, le stock et le paiement sont sur SumUp).
// img : chemin d'une photo dans le dossier img/ (vide = logo en attendant).
const PRODUCTS = [
  { fr: "T-shirt « Shattering »", en: "“Shattering” T-shirt", p: 35, m: { fr: "Plusieurs tailles", en: "Several sizes" }, img: "" },
  { fr: "Tote bag « Contains Riffs »", en: "“Contains Riffs” tote bag", p: 10, m: { fr: "Taille unique", en: "One size" }, img: "" },
  { fr: "CD – Adrift in Silence", en: "CD – Adrift in Silence", p: 12, m: { fr: "CD", en: "CD" }, img: "" },
  { fr: "CD – Elevate Spirit", en: "CD – Elevate Spirit", p: 12, m: { fr: "CD", en: "CD" }, img: "" }
];

// Concerts à venir, du plus proche au plus lointain.
// Exemple : { date: "2026-12-12", city: "Paris", venue: "Le Gibus", tickets: "https://..." }
// Les dates passées disparaissent toutes seules.
const SHOWS = [
];
