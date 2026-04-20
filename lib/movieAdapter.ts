import {
  FLICK_SERVICES,
  type Movie,
  type Mood,
  type Provider,
} from './data';
import {
  posterUrl,
  backdropUrl,
  type TmdbDiscoverMovie,
  type TmdbMovieDetail,
  type TmdbProvider,
} from './tmdb';

// Deterministic gradient palette so cards without a poster still look distinct.
const GRADIENTS: [string, string][] = [
  ['#1f2438', '#4d6487'],
  ['#a0543a', '#c69d5c'],
  ['#3c241b', '#8a5742'],
  ['#0f4a4e', '#1f6fa1'],
  ['#27324e', '#506690'],
  ['#1b2340', '#3b4d7f'],
  ['#5d3a28', '#a97046'],
  ['#263e2c', '#547b58'],
  ['#aa5838', '#d69459'],
  ['#25324b', '#445a8a'],
  ['#3d4d35', '#6d7a47'],
  ['#4a2316', '#a65a2e'],
];

function gradientFor(id: number): [string, string] {
  return GRADIENTS[id % GRADIENTS.length];
}

function codeFor(id: number): string {
  return `FLK-${String(id).padStart(4, '0').slice(-4)}`;
}

function yearFrom(release: string): number {
  const y = parseInt(release?.slice(0, 4) ?? '', 10);
  return Number.isFinite(y) ? y : 0;
}

function ratingFrom(vote: number): number {
  return Math.round((vote ?? 0) * 10);
}

// Map TMDB providers (region-scoped flatrate list) onto our internal service IDs.
function serviceIdsFromProviders(providers: TmdbProvider[] | undefined): string[] {
  if (!providers || providers.length === 0) return [];
  const ids = new Set<string>();
  for (const p of providers) {
    const match = FLICK_SERVICES.find((s) => s.tmdbProviderIds.includes(p.provider_id));
    if (match) ids.add(match.id);
  }
  return [...ids];
}

// Light adapter for /discover/movie hits — no runtime, no cast, no providers.
// Detail is fetched lazily when the user opens the card or it's about to enter
// view (see RoomState prefetch logic).
export function fromDiscover(t: TmdbDiscoverMovie, mood: Mood): Movie {
  return {
    id: `tmdb:${t.id}`,
    code: codeFor(t.id),
    title: t.title,
    year: yearFrom(t.release_date),
    runtime: 0,
    rating: ratingFrom(t.vote_average),
    genres: [],
    synopsis: t.overview ?? '',
    services: [],
    cast: [],
    gradient: gradientFor(t.id),
    mood,
    posterUrl: posterUrl(t.poster_path, 'w500'),
    backdropUrl: backdropUrl(t.backdrop_path, 'w780'),
  };
}

// Full adapter using detail + watch/providers, scoped to a region.
export function fromDetail(d: TmdbMovieDetail, mood: Mood, region: string): Movie {
  const wp = d['watch/providers']?.results?.[region];
  const flatrate = wp?.flatrate ?? [];
  const services = serviceIdsFromProviders(flatrate);
  const justWatchLink = wp?.link;

  // Build provider rows for the match-screen picker. We surface flatrate first;
  // fall back to ads/free if no subscription option exists in this region.
  const sources = flatrate.length ? flatrate : (wp?.free ?? wp?.ads ?? []);
  const providers: Provider[] = sources.map((p) => ({
    name: p.provider_name,
    deepLink: justWatchLink, // TMDB returns a single JustWatch URL per movie; it routes per-provider on click.
  }));

  return {
    id: `tmdb:${d.id}`,
    code: codeFor(d.id),
    title: d.title,
    year: yearFrom(d.release_date),
    runtime: d.runtime ?? 0,
    rating: ratingFrom(d.vote_average),
    genres: (d.genres ?? []).map((g) => g.name),
    synopsis: d.overview ?? '',
    services,
    cast: (d.credits?.cast ?? []).slice(0, 3).map((c) => c.name),
    gradient: gradientFor(d.id),
    mood,
    posterUrl: posterUrl(d.poster_path, 'w500'),
    backdropUrl: backdropUrl(d.backdrop_path, 'w780'),
    providers,
  };
}

// Merge a detail-enriched movie back into a discover-sourced one, preserving
// the deck position and existing fields.
export function mergeDetail(base: Movie, detail: Movie): Movie {
  return {
    ...base,
    runtime: detail.runtime || base.runtime,
    genres: detail.genres.length ? detail.genres : base.genres,
    services: detail.services.length ? detail.services : base.services,
    cast: detail.cast.length ? detail.cast : base.cast,
    providers: detail.providers ?? base.providers,
    posterUrl: base.posterUrl ?? detail.posterUrl,
    backdropUrl: base.backdropUrl ?? detail.backdropUrl,
  };
}

// Extract numeric TMDB id from our prefixed `tmdb:{id}` ids.
export function tmdbIdOf(movie: Movie): number | null {
  if (!movie.id.startsWith('tmdb:')) return null;
  const n = parseInt(movie.id.slice(5), 10);
  return Number.isFinite(n) ? n : null;
}
