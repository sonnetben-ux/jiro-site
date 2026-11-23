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
  // Clips (du plus récent au plus ancien) : adresse YouTube et titre.
  clips: [
    { url: "https://www.youtube.com/watch?v=rVrquRGNso8", title: "Shattering" },
    { url: "https://www.youtube.com/watch?v=Ysh6iP88TbI", title: "Worth It" }
  ]
};

// Sorties (section « Écouter »), de la plus récente à la plus ancienne.
// url = page qui liste toutes les plateformes ; cover = pochette ;
// tracks = [titre, durée].
const RELEASES = [
  {
    title: "Adrift In Silence", type: "EP", year: 2026,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/95/40/07/954007b4-e889-cc22-a280-ca4560d67497/cover.jpg/600x600bb.jpg",
    url: "https://bfan.link/adrift-in-silence",
    spotify: "https://open.spotify.com/album/01dk4qcsS0D5LUVX0fEhP1",
    apple: "https://music.apple.com/fr/album/1889326105",
    tracks: [["Worth It", "3:44"], ["The Ascendant Fall", "3:58"], ["Shattering", "4:43"], ["You Keep The Silence", "3:37"], ["The Spell", "3:32"]]
  },
  {
    title: "Elevate Spirit", type: "EP", year: 2024,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a6/db/42/a6db423d-dbbc-49d5-c3b8-79493a658990/5063616218400_cover.jpg/600x600bb.jpg",
    url: "https://ditto.fm/jiro-elevate-spirit",
    spotify: "https://open.spotify.com/album/6huYIDOrmTRTSlpQ1ukdbk",
    apple: "https://music.apple.com/fr/album/1773941100",
    tracks: [["Will I See You There?", "2:16"], ["Enmity Spreads", "2:48"], ["The Dread I Felt", "2:53"], ["Last To Remain", "4:14"], ["Kairos", "3:52"]]
  }
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
const BIT_APP_ID = "8396b5e25147fc2cad501f3d4f5debd8";

// Concerts ajoutés à la main (en plus de Bandsintown, ou en secours),
// du plus proche au plus lointain.
// Exemple : { date: "2026-12-12", city: "Paris", venue: "Le Gibus", tickets: "https://..." }
// Les dates passées disparaissent toutes seules.
const SHOWS = [
];
