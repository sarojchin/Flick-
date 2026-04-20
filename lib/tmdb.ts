import { FLICK_SERVICES, type Mood } from './data';
import { MOOD_FILTERS } from './moodMap';

const BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export class TmdbError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'TmdbError';
  }
}

function token(): string {
  const t = process.env.EXPO_PUBLIC_TMDB_TOKEN;
  if (!t) throw new TmdbError('Missing EXPO_PUBLIC_TMDB_TOKEN. Copy .env.example to .env and add a TMDB v4 read-access token.');
  return t;
}

function buildUrl(path: string, params: Record<string, string | number | undefined> = {}): string {
  const url = new URL(`${BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export async function fetchTmdb<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = buildUrl(path, params);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    let body = '';
    try { body = await res.text(); } catch {}
    throw new TmdbError(`TMDB ${res.status} on ${path}: ${body.slice(0, 200)}`, res.status);
  }
  return res.json() as Promise<T>;
}

export type PosterSize = 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

export function posterUrl(path: string | null | undefined, size: PosterSize = 'w500'): string | undefined {
  if (!path) return undefined;
  return `${IMG_BASE}/${size}${path}`;
}

export function backdropUrl(path: string | null | undefined, size: BackdropSize = 'w780'): string | undefined {
  if (!path) return undefined;
  return `${IMG_BASE}/${size}${path}`;
}

// ---------- Discover ----------

export interface TmdbDiscoverMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
}

export interface TmdbDiscoverResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbDiscoverMovie[];
}

export interface DiscoverOpts {
  region: string;            // ISO 3166-1, e.g. 'US'
  serviceIds?: string[];     // FLICK_SERVICES.id values to filter by
  page?: number;
  language?: string;         // e.g. 'en-US'
}

export async function discoverByMood(mood: Mood, opts: DiscoverOpts): Promise<TmdbDiscoverResponse> {
  const f = MOOD_FILTERS[mood];
  const tmdbProviderIds = (opts.serviceIds ?? [])
    .flatMap((id) => FLICK_SERVICES.find((s) => s.id === id)?.tmdbProviderIds ?? [])
    .join('|');

  return fetchTmdb<TmdbDiscoverResponse>('/discover/movie', {
    sort_by: 'popularity.desc',
    include_adult: 'false',
    include_video: 'false',
    language: opts.language ?? 'en-US',
    page: opts.page ?? 1,
    watch_region: opts.region,
    with_watch_monetization_types: 'flatrate',
    with_watch_providers: tmdbProviderIds || undefined,
    with_genres: f.withGenres.join('|'),
    without_genres: f.withoutGenres?.join(','),
    'vote_average.gte': f.voteAverageGte,
    'vote_count.gte': f.voteCountGte,
    'with_runtime.lte': f.runtimeLte,
  });
}

// ---------- Detail ----------

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  order: number;
}

export interface TmdbProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

export interface TmdbWatchProviders {
  results: Record<string, {
    link?: string;
    flatrate?: TmdbProvider[];
    rent?: TmdbProvider[];
    buy?: TmdbProvider[];
    free?: TmdbProvider[];
    ads?: TmdbProvider[];
  }>;
}

export interface TmdbMovieDetail {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number | null;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genres: { id: number; name: string }[];
  credits?: { cast: TmdbCastMember[] };
  'watch/providers'?: TmdbWatchProviders;
}

export async function getMovieDetail(id: number): Promise<TmdbMovieDetail> {
  return fetchTmdb<TmdbMovieDetail>(`/movie/${id}`, {
    append_to_response: 'credits,watch/providers',
    language: 'en-US',
  });
}
