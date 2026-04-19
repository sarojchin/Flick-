export type Mood = 'feelgood' | 'intense' | 'scary' | 'romance' | 'weird' | 'chill';

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
}

export interface Service {
  id: string;
  name: string;
  mono: string;
  tint: string;
}

export interface MoodInfo {
  id: Mood;
  label: string;
  sub: string;
  glyph: string;
}

export const FLICK_MOVIES: Movie[] = [
  {
    id: 'mv01', code: 'FLK-0847', title: 'Hollow Meridian', year: 2024,
    runtime: 118, rating: 82, genres: ['Thriller', 'Mystery'],
    synopsis: 'A cartographer discovers her maps are rewriting themselves overnight.',
    services: ['pulse', 'lumen'],
    cast: ['Ada Reyes', 'Kairo Vance', 'Mei Nakashima'],
    gradient: ['#1e024c', '#bd2099'],
    mood: 'intense',
  },
  {
    id: 'mv02', code: 'FLK-1120', title: 'Sunday Static', year: 2023,
    runtime: 94, rating: 91, genres: ['Comedy', 'Romance'],
    synopsis: "Two strangers keep receiving each other's voicemails by mistake.",
    services: ['pulse', 'orbit'],
    cast: ['Noor Hassan', 'Theo Park'],
    gradient: ['#cd4805', '#d29922'],
    mood: 'feelgood',
  },
  {
    id: 'mv03', code: 'FLK-0213', title: 'The Velvet Index', year: 2025,
    runtime: 142, rating: 88, genres: ['Drama', 'Crime'],
    synopsis: 'A rare book dealer inherits a ledger that predicts every heist in Lisbon.',
    services: ['lumen'],
    cast: ['Isolde Braga', 'Yuri Petrov', 'Clara Winn'],
    gradient: ['#520001', '#9c0064'],
    mood: 'intense',
  },
  {
    id: 'mv04', code: 'FLK-0661', title: 'Oxide Bloom', year: 2024,
    runtime: 106, rating: 74, genres: ['Sci-Fi', 'Horror'],
    synopsis: 'A terraforming crew on Europa finds their plants growing toward the stars.',
    services: ['orbit', 'kiln'],
    cast: ['Sam Okafor', 'Lin Chao', 'Elena Vargas'],
    gradient: ['#004130', '#0070b1'],
    mood: 'scary',
  },
  {
    id: 'mv05', code: 'FLK-2044', title: 'Paper Harbor', year: 2022,
    runtime: 89, rating: 94, genres: ['Animation', 'Family'],
    synopsis: 'A paper boat sets sail across the kitchen sink and never looks back.',
    services: ['pulse', 'orbit', 'lumen'],
    cast: ['Voiced ensemble'],
    gradient: ['#e38d3d', '#d6c665'],
    mood: 'feelgood',
  },
  {
    id: 'mv06', code: 'FLK-0308', title: 'Neon Bible Study', year: 2023,
    runtime: 127, rating: 79, genres: ['Drama', 'Musical'],
    synopsis: 'A gospel choir in Tokyo splinters over a song nobody will admit they wrote.',
    services: ['lumen', 'kiln'],
    cast: ['Marisol Dunn', 'Kenji Arai'],
    gradient: ['#4f0090', '#d425ac'],
    mood: 'feelgood',
  },
  {
    id: 'mv07', code: 'FLK-1777', title: 'Salt on the Wire', year: 2025,
    runtime: 134, rating: 85, genres: ['Thriller', 'Action'],
    synopsis: 'A retired linewoman climbs one last transmission tower and finds a body.',
    services: ['pulse'],
    cast: ['Rosa Kaine', 'Demir Ozturk'],
    gradient: ['#001d3b', '#0b4196'],
    mood: 'intense',
  },
  {
    id: 'mv08', code: 'FLK-0092', title: 'A Year of Wednesdays', year: 2024,
    runtime: 102, rating: 89, genres: ['Romance', 'Drama'],
    synopsis: 'They promised to meet at the same cafe every Wednesday. They kept the promise.',
    services: ['orbit', 'lumen'],
    cast: ['Aya Mitsuki', 'Ben Halloran'],
    gradient: ['#b93780', '#e8777a'],
    mood: 'feelgood',
  },
  {
    id: 'mv09', code: 'FLK-0450', title: 'The Quiet Bureau', year: 2023,
    runtime: 117, rating: 81, genres: ['Thriller', 'Drama'],
    synopsis: 'Government archivists notice that last Thursday has been redacted.',
    services: ['kiln', 'pulse'],
    cast: ['Priya Chandra', 'Otto Krause'],
    gradient: ['#173012', '#00774b'],
    mood: 'intense',
  },
  {
    id: 'mv10', code: 'FLK-1501', title: 'Rooftop Ballroom', year: 2024,
    runtime: 98, rating: 92, genres: ['Romance', 'Comedy'],
    synopsis: 'A ballroom dance class meets on a Queens rooftop every full moon.',
    services: ['orbit'],
    cast: ['Simone Fox', 'Rafael Duarte', 'Hana Okyere'],
    gradient: ['#d64651', '#f8a052'],
    mood: 'feelgood',
  },
  {
    id: 'mv11', code: 'FLK-0990', title: 'Undertow Symphony', year: 2025,
    runtime: 149, rating: 87, genres: ['Drama', 'Music'],
    synopsis: 'A cellist rebuilds an orchestra from survivors of a coastal storm.',
    services: ['lumen', 'orbit'],
    cast: ['Iris Lamour', 'Nikhil Rao'],
    gradient: ['#003455', '#0069ca'],
    mood: 'feelgood',
  },
  {
    id: 'mv12', code: 'FLK-0033', title: 'The Last Bookshop in Sector 7', year: 2023,
    runtime: 108, rating: 83, genres: ['Sci-Fi', 'Drama'],
    synopsis: 'A bookseller refuses to digitize. The city starts forgetting her block.',
    services: ['pulse', 'kiln'],
    cast: ['Zadie Inoue', 'Marcus Elway'],
    gradient: ['#451a5f', '#6159e1'],
    mood: 'feelgood',
  },
];

export const FLICK_SERVICES: Service[] = [
  { id: 'pulse', name: 'Pulse+',   mono: 'P', tint: '#f04c5a' },
  { id: 'lumen', name: 'Lumen',    mono: 'L', tint: '#8b8dff' },
  { id: 'orbit', name: 'Orbit TV', mono: 'O', tint: '#00bac5' },
  { id: 'kiln',  name: 'Kiln',     mono: 'K', tint: '#ed7100' },
  { id: 'ember', name: 'Ember',    mono: 'E', tint: '#ed3726' },
  { id: 'drift', name: 'Drift',    mono: 'D', tint: '#2eb27a' },
];

export const FLICK_MOODS: MoodInfo[] = [
  { id: 'feelgood', label: 'Feel-good', sub: 'warm, light, uplifting', glyph: '☼' },
  { id: 'intense',  label: 'Intense',   sub: 'thrillers, drama, edge', glyph: '◆' },
  { id: 'scary',    label: 'Scary',     sub: 'horror, cold dread',     glyph: '◐' },
  { id: 'romance',  label: 'Romance',   sub: 'hearts on sleeves',      glyph: '♡' },
  { id: 'weird',    label: 'Weird',     sub: 'cult, surreal, offbeat', glyph: '✻' },
  { id: 'chill',    label: 'Chill',     sub: 'easy watch, low stakes', glyph: '~' },
];

// Onboarding story cards
export interface StoryCopy {
  eyebrow: string;
  title: string;
  titleItalic: string;
  body: string;
  gradient: [string, string];
}

export const STORY_CONTENT: StoryCopy[] = [
  {
    eyebrow: '01 · start',
    title: 'Start a room,',
    titleItalic: 'from anywhere.',
    body: 'Either of you can kick things off. Tap start — your partner gets a ping on their phone, wherever they are.',
    gradient: ['#4b026d', '#bd2099'],
  },
  {
    eyebrow: '02 · swipe',
    title: 'Swipe on your',
    titleItalic: 'own time.',
    body: 'Yes, no, or maybe — on films you can actually stream. From the couch. Or the train.',
    gradient: ['#003162', '#008f9f'],
  },
  {
    eyebrow: '03 · match',
    title: 'Both say yes?',
    titleItalic: "It's tonight.",
    body: "When your verdicts collide, Flick! locks it in — with where to watch and when you'll be done.",
    gradient: ['#6f000a', '#d14600'],
  },
];
