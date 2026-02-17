export type CityName =
    | "Meknes"
    | "Casablanca"
    | "Rabat"
    | "Fes"
    | "Marrakech"
    | "Tangier"
    | "Agadir"
    | "Salé"
    | "Kenitra"
    | "Tetouan"
    | "Oujda"
    | "Safi"
    | "Mohammedia";

export const MOROCCAN_CITIES: Record<CityName, string[]> = {
    "Meknes": [
        "Hamria", "Ville Nouvelle", "Sidi Baba", "Rouamzine", "Beni M'Hamed",
        "El Bassatine", "Marjane", "Mansour", "Kamilia", "Zitoune",
        "Belle Vue", "Plaisence", "Sidi Bouzekri", "Toulal", "Wislane",
        "Agdal", "Ouislane"
    ],
    "Casablanca": [
        "Maarif", "Gauthier", "Racine", "Anfa", "Ain Diab", "Sidi Belyout",
        "Mers Sultan", "Hay Mohammadi", "Ain Sebaa", "Sidi Moumen",
        "Bernoussi", "Oulfa", "Hay Hassani", "Californie", "Bourgogne"
    ],
    "Rabat": [
        "Agdal", "Hay Riad", "Hassan", "Ocean", "Souissi", "Yacoub El Mansour",
        "Akkari", "Takaddoum", "Hay Nahda", "Aviation"
    ],
    "Fes": [
        "Ville Nouvelle", "Fes El Bali", "Fes Jdid", "Saiss", "Narjiss",
        "Route Sefrou", "Atlas", "Oued Fes", "Zouagha"
    ],
    "Marrakech": [
        "Gueliz", "Hivernage", "Medina", "Daoudiate", "Amerchich",
        "Sidi Youssef Ben Ali", "Menara", "Massira", "Targa"
    ],
    "Tangier": [
        "Centre Ville", "Malabata", "Iberia", "Marshan", "Bni Makada",
        "Val Fleuri", "Mojemmaa"
    ],
    "Agadir": [
        "Centre Ville", "Talborjt", "Cite Suisse", "Dakhla", "Salam",
        "Haut Founty", "Bensergao"
    ],
    "Salé": [
        "Bettana", "Hay Salam", "Tabriquet", "Layayda", "Kraymat"
    ],
    "Kenitra": [
        "Centre Ville", "Bir Rami", "Ouled Oujih", "Saknia", "Mehdia"
    ],
    "Tetouan": [
        "Centre Ville", "Wilaya", "Touabel", "Sania Rmel", "Martil"
    ],
    "Oujda": [
        "Centre Ville", "Lazaret", "Al Qods", "Hay Salam", "Mir Ali"
    ],
    "Safi": [
        "Centre Ville", "Biada", "Plateau", "Jrifat", "Azib Drai"
    ],
    "Mohammedia": [
        "Centre Ville", "El Alia", "Rachidia", "Monica", "Yasmina"
    ]
};

export const CITIES_LIST = Object.keys(MOROCCAN_CITIES).sort() as CityName[];
