// src/constants/moroccanCities.js
// ─────────────────────────────────────────────────────────────
// High-quality Unsplash images for 7 Moroccan cities.
// ─────────────────────────────────────────────────────────────

export const MOROCCAN_CITIES = {
  casablanca: {
    key:        "casablanca",
    name:       "Casablanca",
    arabicName: "الدار البيضاء",
    emoji:      "🕌",
    landmark:   "Mosquée Hassan II",
    vibe:       "Métropole · Atlantique",
    url:        "https://images.unsplash.com/photo-1577147443647-81856d5152e6?w=1920&q=85",
    position:   "center 40%",
  },
  marrakech: {
    key:        "marrakech",
    name:       "Marrakech",
    arabicName: "مراكش",
    emoji:      "🏮",
    landmark:   "Jemaa el-Fna",
    vibe:       "Impériale · Vivante",
    url:        "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1920&q=85",
    position:   "center 35%",
  },
  agadir: {
    key:        "agadir",
    name:       "Agadir",
    arabicName: "أكادير",
    emoji:      "🏖️",
    landmark:   "Plage d'Agadir",
    vibe:       "Balnéaire · Soleil",
    url:        "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=1920&q=85",
    position:   "center 50%",
  },
  rabat: {
    key:        "rabat",
    name:       "Rabat",
    arabicName: "الرباط",
    emoji:      "🏛️",
    landmark:   "Tour Hassan",
    vibe:       "Capitale · Historique",
    url:        "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&q=85",
    position:   "center 40%",
  },
  fes: {
    key:        "fes",
    name:       "Fès",
    arabicName: "فاس",
    emoji:      "🎨",
    landmark:   "Médina de Fès",
    vibe:       "Millénaire · Artisanale",
    url:        "https://images.unsplash.com/photo-1548018560-c7196548ea3b?w=1920&q=85",
    position:   "center 45%",
  },
  chefchaouen: {
    key:        "chefchaouen",
    name:       "Chefchaouen",
    arabicName: "شفشاون",
    emoji:      "💙",
    landmark:   "La Ville Bleue",
    vibe:       "Mystique · Bleue",
    url:        "https://images.unsplash.com/photo-1548700521-b284c85b22ec?w=1920&q=85",
    position:   "center 40%",
  },
  ouarzazate: {
    key:        "ouarzazate",
    name:       "Ouarzazate",
    arabicName: "ورزازات",
    emoji:      "🏜️",
    landmark:   "Aït Benhaddou",
    vibe:       "Désert · Cinéma",
    url:        "https://images.unsplash.com/photo-1554978991-e9d0f4eb7f17?w=1920&q=85",
    position:   "center 50%",
  },
};

export const CITY_KEYS     = Object.keys(MOROCCAN_CITIES);
export const getRandomCity = () => CITY_KEYS[Math.floor(Math.random() * CITY_KEYS.length)];