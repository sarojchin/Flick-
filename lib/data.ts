export type Mood = 'feelgood' | 'intense' | 'scary' | 'romance' | 'weird' | 'chill';

export interface Provider {
  name: string;
  deepLink?: string;
}

export interface Movie {
  id: string;
  code: string;
  title: string;
  year: number;
  runtime: number;
  rating: number;
  genres: string[];
  synopsis: string;
  services: string[];
  cast: string[];
  gradient: [string, string];
  mood: Mood;
  // Optional, populated when sourced from TMDB. Existing fallback movies leave these undefined.
  posterUrl?: string;
  backdropUrl?: string;
  providers?: Provider[];
}

export interface Service {
  id: string;
  name: string;
  mono: string;
  tint: string;
  // TMDB provider IDs that map to this service. Used to filter discover queries
  // and to recognise providers returned by /movie/{id}/watch/providers.
  tmdbProviderIds: number[];
}

export interface MoodInfo {
  id: Mood;
  label: string;
  sub: string;
  glyph: string;
}

// Real streaming services. No logos by design — we render `mono` (initial)
// on a `tint` swatch alongside `name` to keep the typographic aesthetic.
// `tmdbProviderIds` come from TMDB's /watch/providers/movie endpoint and cover
// the most common variants (e.g. Amazon Prime Video has both an ad-supported
// and standard ID; Apple TV+ is distinct from Apple TV rentals).
export const FLICK_SERVICES: Service[] = [
  { id: 'netflix',  name: 'Netflix',      mono: 'N', tint: '#b9342b', tmdbProviderIds: [8] },
  { id: 'max',      name: 'Max',          mono: 'M', tint: '#3b4ea8', tmdbProviderIds: [1899, 384] },
  { id: 'disney',   name: 'Disney+',      mono: 'D', tint: '#1a4f9c', tmdbProviderIds: [337] },
  { id: 'hulu',     name: 'Hulu',         mono: 'H', tint: '#1c8c4a', tmdbProviderIds: [15] },
  { id: 'prime',    name: 'Prime Video',  mono: 'P', tint: '#1f6fb0', tmdbProviderIds: [9, 119] },
  { id: 'apple',    name: 'Apple TV+',    mono: 'A', tint: '#222222', tmdbProviderIds: [350] },
  { id: 'paramount',name: 'Paramount+',   mono: 'P', tint: '#1463c4', tmdbProviderIds: [531, 1853] },
  { id: 'peacock',  name: 'Peacock',      mono: 'K', tint: '#1c1c1c', tmdbProviderIds: [386, 387] },
];

export const FLICK_MOODS: MoodInfo[] = [
  { id: 'feelgood', label: 'Feel-good', sub: 'warm, light, uplifting', glyph: '☼' },
  { id: 'intense',  label: 'Intense',   sub: 'thrillers, drama, edge', glyph: '◆' },
  { id: 'scary',    label: 'Scary',     sub: 'horror, cold dread',     glyph: '◐' },
  { id: 'romance',  label: 'Romance',   sub: 'hearts on sleeves',      glyph: '♡' },
  { id: 'weird',    label: 'Weird',     sub: 'cult, surreal, offbeat', glyph: '✻' },
  { id: 'chill',    label: 'Chill',     sub: 'easy watch, low stakes', glyph: '~' },
];

// Decorative-only sample posters used for the onboarding story slides and the
// floating poster cluster on the landing screen — visual flourish establishing
// the app's poster aesthetic before any recommendations are loaded. The titles
// here are fictional and intentional brand artwork; they NEVER reach the swipe
// deck, matches, or maybes (those always read TMDB data via RoomState).
export const FLICK_MOVIES: Movie[] = [
  {
    id: 'mv01', code: 'FLK-0847', title: 'Hollow Meridian', year: 2024,
    runtime: 118, rating: 82, genres: ['Thriller', 'Mystery'],
    synopsis: 'A cartographer discovers her maps are rewriting themselves overnight.',
    services: [],
    cast: ['Ada Reyes', 'Kairo Vance', 'Mei Nakashima'],
    gradient: ['#1f2438', '#4d6487'],
    mood: 'intense',
  },
  {
    id: 'mv02', code: 'FLK-1120', title: 'Sunday Static', year: 2023,
    runtime: 94, rating: 91, genres: ['Comedy', 'Romance'],
    synopsis: "Two strangers keep receiving each other's voicemails by mistake.",
    services: [],
    cast: ['Noor Hassan', 'Theo Park'],
    gradient: ['#a0543a', '#c69d5c'],
    mood: 'feelgood',
  },
  {
    id: 'mv03', code: 'FLK-0213', title: 'The Velvet Index', year: 2025,
    runtime: 142, rating: 88, genres: ['Drama', 'Crime'],
    synopsis: 'A rare book dealer inherits a ledger that predicts every heist in Lisbon.',
    services: [],
    cast: ['Isolde Braga', 'Yuri Petrov', 'Clara Winn'],
    gradient: ['#3c241b', '#8a5742'],
    mood: 'intense',
  },
  {
    id: 'mv04', code: 'FLK-0661', title: 'Oxide Bloom', year: 2024,
    runtime: 106, rating: 74, genres: ['Sci-Fi', 'Horror'],
    synopsis: 'A terraforming crew on Europa finds their plants growing toward the stars.',
    services: [],
    cast: ['Sam Okafor', 'Lin Chao', 'Elena Vargas'],
    gradient: ['#0f4a4e', '#1f6fa1'],
    mood: 'scary',
  },
  {
    id: 'mv05', code: 'FLK-2044', title: 'Paper Harbor', year: 2022,
    runtime: 89, rating: 94, genres: ['Animation', 'Family'],
    synopsis: 'A paper boat sets sail across the kitchen sink and never looks back.',
    services: [],
    cast: ['Voiced ensemble'],
    gradient: ['#d19a52', '#dcc678'],
    mood: 'feelgood',
  },
  {
    id: 'mv06', code: 'FLK-0308', title: 'Neon Bible Study', year: 2023,
    runtime: 127, rating: 79, genres: ['Drama', 'Musical'],
    synopsis: 'A gospel choir in Tokyo splinters over a song nobody will admit they wrote.',
    services: [],
    cast: ['Marisol Dunn', 'Kenji Arai'],
    gradient: ['#27324e', '#506690'],
    mood: 'feelgood',
  },
  {
    id: 'mv07', code: 'FLK-1777', title: 'Salt on the Wire', year: 2025,
    runtime: 134, rating: 85, genres: ['Thriller', 'Action'],
    synopsis: 'A retired linewoman climbs one last transmission tower and finds a body.',
    services: [],
    cast: ['Rosa Kaine', 'Demir Ozturk'],
    gradient: ['#1b2340', '#3b4d7f'],
    mood: 'intense',
  },
  {
    id: 'mv08', code: 'FLK-0092', title: 'A Year of Wednesdays', year: 2024,
    runtime: 102, rating: 89, genres: ['Romance', 'Drama'],
    synopsis: 'They promised to meet at the same cafe every Wednesday. They kept the promise.',
    services: [],
    cast: ['Aya Mitsuki', 'Ben Halloran'],
    gradient: ['#5d3a28', '#a97046'],
    mood: 'feelgood',
  },
  {
    id: 'mv09', code: 'FLK-0450', title: 'The Quiet Bureau', year: 2023,
    runtime: 117, rating: 81, genres: ['Thriller', 'Drama'],
    synopsis: 'Government archivists notice that last Thursday has been redacted.',
    services: [],
    cast: ['Priya Chandra', 'Otto Krause'],
    gradient: ['#263e2c', '#547b58'],
    mood: 'intense',
  },
  {
    id: 'mv10', code: 'FLK-1501', title: 'Rooftop Ballroom', year: 2024,
    runtime: 98, rating: 92, genres: ['Romance', 'Comedy'],
    synopsis: 'A ballroom dance class meets on a Queens rooftop every full moon.',
    services: [],
    cast: ['Simone Fox', 'Rafael Duarte', 'Hana Okyere'],
    gradient: ['#aa5838', '#d69459'],
    mood: 'feelgood',
  },
  {
    id: 'mv11', code: 'FLK-0990', title: 'Undertow Symphony', year: 2025,
    runtime: 149, rating: 87, genres: ['Drama', 'Music'],
    synopsis: 'A cellist rebuilds an orchestra from survivors of a coastal storm.',
    services: [],
    cast: ['Iris Lamour', 'Nikhil Rao'],
    gradient: ['#25324b', '#445a8a'],
    mood: 'feelgood',
  },
  {
    id: 'mv12', code: 'FLK-0033', title: 'The Last Bookshop in Sector 7', year: 2023,
    runtime: 108, rating: 83, genres: ['Sci-Fi', 'Drama'],
    synopsis: 'A bookseller refuses to digitize. The city starts forgetting her block.',
    services: [],
    cast: ['Zadie Inoue', 'Marcus Elway'],
    gradient: ['#3d4d35', '#6d7a47'],
    mood: 'feelgood',
  },
];

// Onboarding story cards
export interface StoryCopy {
  eyebrow: string;
  title: string;
  titleItalic: string;
  body: string;
  gradient: [string, string];
}

// Couple-mode story copy (default).
export const STORY_CONTENT: StoryCopy[] = [
  {
    eyebrow: '01 · start',
    title: 'Start a room,',
    titleItalic: 'from anywhere.',
    body: 'Either of you can kick things off. Tap start — your partner gets a ping on their phone, wherever they are.',
    gradient: ['#1d2c47', '#3f5c8a'],
  },
  {
    eyebrow: '02 · swipe',
    title: 'Swipe on your',
    titleItalic: 'own time.',
    body: 'Yes, no, or maybe — on films you can actually stream. From the couch. Or the train.',
    gradient: ['#1a3742', '#3a7e93'],
  },
  {
    eyebrow: '03 · match',
    title: 'Both say yes?',
    titleItalic: "It's tonight.",
    body: "When your verdicts collide, Flick! locks it in — with where to watch and when you'll be done.",
    gradient: ['#4a2316', '#a65a2e'],
  },
];

// Solo-mode story copy — swapped for "For you, tonight" users.
export const STORY_CONTENT_SOLO: StoryCopy[] = [
  {
    eyebrow: '01 · tuned',
    title: 'Tuned to',
    titleItalic: 'your taste.',
    body: 'No account-hunting, no endless scroll. Flick! learns what you love and surfaces one film at a time.',
    gradient: ['#1d2c47', '#3f5c8a'],
  },
  {
    eyebrow: '02 · swipe',
    title: 'Swipe through',
    titleItalic: 'your night.',
    body: 'Yes, no, or maybe — on films you can actually stream tonight. Takes a minute.',
    gradient: ['#1a3742', '#3a7e93'],
  },
  {
    eyebrow: '03 · open',
    title: 'Hit yes?',
    titleItalic: "We'll open it.",
    body: "Flick! takes you straight to where it streams — with runtime so you know when you're done.",
    gradient: ['#4a2316', '#a65a2e'],
  },
];
