import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Localization from 'expo-localization';
import { Image } from 'expo-image';
import { type Movie, type Mood } from './data';
import {
  loadStoredProfile,
  saveName,
  saveMode,
  saveOnboarded,
  saveServices,
  saveRegion,
  clearOnboarded,
  type Mode,
} from './storage';
import { discoverByMood, getMovieDetail, TmdbError } from './tmdb';
import { fromDiscover, fromDetail, mergeDetail, tmdbIdOf } from './movieAdapter';
import { readCache, writeCache, DECK_TTL_MS, DETAIL_TTL_MS } from './cache';

interface Profile {
  name: string;
  mode: Mode;
  services: string[];
  region: string;
}

const DEFAULT_REGION = 'US';
const DEFAULT_MOOD: Mood = 'feelgood';
const PREFETCH_AHEAD = 6;
const DECK_PAGE_SIZE_TARGET = 20;

interface RoomCtx {
  hydrated: boolean;
  onboarded: boolean;

  profile: Profile;
  setProfile: (p: Profile) => void;
  updateName: (n: string) => void;
  updateMode: (m: Mode) => void;
  updateServices: (s: string[]) => void;
  updateRegion: (r: string) => void;
  completeOnboarding: (p: Omit<Profile, 'region'>) => Promise<void>;
  resetOnboarding: () => Promise<void>;

  // Per-room
  mood: Mood | null;
  setMood: (m: Mood | null) => void;
  roomServices: string[];
  setRoomServices: (s: string[]) => void;
  roomId: string;
  regenerateRoom: () => void;
  partnerJoined: boolean;
  setPartnerJoined: (v: boolean) => void;

  // Swipe
  deckIdx: number;
  setDeckIdx: (n: number | ((n: number) => number)) => void;
  matches: Movie[];
  maybes: Movie[];
  addMatch: (m: Movie) => void;
  addMaybe: (m: Movie) => void;
  matchMovie: Movie | null;
  setMatchMovie: (m: Movie | null) => void;

  deck: Movie[];
  deckLoading: boolean;
  deckError: string | null;
  reloadDeck: () => void;
  resetRoom: () => void;
}

const Ctx = createContext<RoomCtx | null>(null);

function generateRoomId(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 5; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function detectRegion(): string {
  try {
    const locales = Localization.getLocales?.();
    const code = locales?.[0]?.regionCode;
    return code && /^[A-Z]{2}$/.test(code) ? code : DEFAULT_REGION;
  } catch {
    return DEFAULT_REGION;
  }
}

function deckCacheKey(mood: Mood, region: string, services: string[], page: number): string {
  const svc = [...services].sort().join(',');
  return `deck.${mood}.${region}.${svc}.p${page}`;
}

function detailCacheKey(tmdbId: number, region: string): string {
  return `detail.${tmdbId}.${region}`;
}

export function RoomStateProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfileState] = useState<Profile>({
    name: '',
    mode: 'couple',
    services: [],
    region: DEFAULT_REGION,
  });

  const [mood, setMood] = useState<Mood | null>(null);
  const [roomServices, setRoomServices] = useState<string[]>([]);
  const [roomId, setRoomId] = useState(generateRoomId);
  const [partnerJoined, setPartnerJoined] = useState(false);

  const [deckIdx, setDeckIdx] = useState(0);
  const [matches, setMatches] = useState<Movie[]>([]);
  const [maybes, setMaybes] = useState<Movie[]>([]);
  const [matchMovie, setMatchMovie] = useState<Movie | null>(null);

  const [deck, setDeck] = useState<Movie[]>([]);
  const [deckLoading, setDeckLoading] = useState(false);
  const [deckError, setDeckError] = useState<string | null>(null);
  const fetchSeq = useRef(0);

  useEffect(() => {
    loadStoredProfile().then((p) => {
      const region = p.region ?? detectRegion();
      setOnboarded(p.onboarded);
      setProfileState({ name: p.name, mode: p.mode, services: p.services, region });
      setRoomServices(p.services);
      if (!p.region) {
        // Persist auto-detected region so subsequent launches are stable.
        saveRegion(region).catch(() => {});
      }
      setHydrated(true);
    });
  }, []);

  const setProfile = (p: Profile) => {
    setProfileState(p);
    saveName(p.name).catch(() => {});
    saveMode(p.mode).catch(() => {});
    saveServices(p.services).catch(() => {});
    saveRegion(p.region).catch(() => {});
  };

  const updateName = (n: string) => {
    setProfileState((prev) => ({ ...prev, name: n }));
    saveName(n).catch(() => {});
  };

  const updateMode = (m: Mode) => {
    setProfileState((prev) => ({ ...prev, mode: m }));
    saveMode(m).catch(() => {});
  };

  const updateServices = (s: string[]) => {
    setProfileState((prev) => ({ ...prev, services: s }));
    saveServices(s).catch(() => {});
  };

  const updateRegion = (r: string) => {
    setProfileState((prev) => ({ ...prev, region: r }));
    saveRegion(r).catch(() => {});
  };

  const completeOnboarding = useCallback(async (p: Omit<Profile, 'region'>) => {
    await saveOnboarded(p.name, p.mode, p.services);
    setProfileState((prev) => ({ ...p, region: prev.region }));
    setRoomServices(p.services);
    setOnboarded(true);
  }, []);

  const resetOnboarding = useCallback(async () => {
    await clearOnboarded();
    setOnboarded(false);
  }, []);

  const regenerateRoom = useCallback(() => {
    setRoomId(generateRoomId());
    setPartnerJoined(false);
  }, []);

  const addMatch = useCallback((m: Movie) => {
    setMatches((prev) => [m, ...prev]);
    setMatchMovie(m);
  }, []);

  const addMaybe = useCallback((m: Movie) => {
    setMaybes((prev) => (prev.find((x) => x.id === m.id) ? prev : [m, ...prev]));
  }, []);

  // ---------------- Deck loading ----------------

  const loadDeck = useCallback(async (m: Mood, region: string, services: string[]) => {
    const seq = ++fetchSeq.current;
    setDeckLoading(true);
    setDeckError(null);

    // Try cache first.
    const cacheKey = deckCacheKey(m, region, services, 1);
    const cached = await readCache<Movie[]>(cacheKey, DECK_TTL_MS);
    if (cached && cached.length && fetchSeq.current === seq) {
      setDeck(cached);
      setDeckIdx(0);
      setDeckLoading(false);
      // Continue to fetch fresh in background to refresh the cache.
    }

    try {
      // Pull two pages so the deck has runway before pagination kicks in.
      const [p1, p2] = await Promise.all([
        discoverByMood(m, { region, serviceIds: services, page: 1 }),
        discoverByMood(m, { region, serviceIds: services, page: 2 }).catch(() => null),
      ]);
      if (fetchSeq.current !== seq) return;

      const pages = [p1, p2].filter((p): p is NonNullable<typeof p> => !!p);
      const movies = pages
        .flatMap((p) => p.results)
        .filter((r) => r.poster_path) // skip posterless entries
        .map((r) => fromDiscover(r, m))
        .slice(0, DECK_PAGE_SIZE_TARGET * 2);

      setDeck(movies);
      setDeckIdx(0);
      writeCache(cacheKey, movies).catch(() => {});
      // Eagerly prefetch the first batch of posters into the memory cache so
      // the swipe screen opens with bitmaps already decoded — `disk` alone
      // means each first view still pays a decode cost.
      const urls = movies
        .slice(0, PREFETCH_AHEAD)
        .map((mv) => mv.posterUrl)
        .filter((u): u is string => !!u);
      if (urls.length) Image.prefetch(urls, 'memory-disk').catch(() => {});
    } catch (err) {
      if (fetchSeq.current !== seq) return;
      const msg = err instanceof TmdbError ? err.message : (err as Error)?.message ?? 'Failed to load films';
      setDeckError(msg);
      // Keep cached deck visible (if any) on error.
    } finally {
      if (fetchSeq.current === seq) setDeckLoading(false);
    }
  }, []);

  // Reload when mood, region, or services change after hydration.
  useEffect(() => {
    if (!hydrated) return;
    const m = mood ?? DEFAULT_MOOD;
    loadDeck(m, profile.region, roomServices);
  }, [hydrated, mood, profile.region, roomServices, loadDeck]);

  const reloadDeck = useCallback(() => {
    const m = mood ?? DEFAULT_MOOD;
    loadDeck(m, profile.region, roomServices);
  }, [mood, profile.region, roomServices, loadDeck]);

  // ---------------- Detail prefetch ----------------

  const enrichingIds = useRef<Set<number>>(new Set());

  const enrichOne = useCallback(async (m: Movie) => {
    const id = tmdbIdOf(m);
    if (id == null) return;
    if (enrichingIds.current.has(id)) return;
    if (m.runtime > 0 && m.providers !== undefined) return; // already enriched
    enrichingIds.current.add(id);
    try {
      const cacheKey = detailCacheKey(id, profile.region);
      const cached = await readCache<Movie>(cacheKey, DETAIL_TTL_MS);
      let detailMovie: Movie;
      if (cached) {
        detailMovie = cached;
      } else {
        const detail = await getMovieDetail(id);
        detailMovie = fromDetail(detail, m.mood, profile.region);
        writeCache(cacheKey, detailMovie).catch(() => {});
      }
      setDeck((prev) => prev.map((x) => (x.id === m.id ? mergeDetail(x, detailMovie) : x)));
      // Also enrich any match/maybe references already captured.
      setMatches((prev) => prev.map((x) => (x.id === m.id ? mergeDetail(x, detailMovie) : x)));
      setMaybes((prev) => prev.map((x) => (x.id === m.id ? mergeDetail(x, detailMovie) : x)));
    } catch {
      // Silent — UI falls back to discover-level fields.
    } finally {
      enrichingIds.current.delete(id);
    }
  }, [profile.region]);

  // Prefetch images and detail for the current card + cards ahead.
  // Batch the URL list and push everything to the memory cache in one call
  // so subsequent renders pull a decoded bitmap instead of re-reading disk.
  useEffect(() => {
    if (!hydrated) return;
    const slice = deck.slice(deckIdx, deckIdx + PREFETCH_AHEAD);
    const urls = slice.map((m) => m.posterUrl).filter((u): u is string => !!u);
    if (urls.length) Image.prefetch(urls, 'memory-disk').catch(() => {});
    slice.forEach((m) => enrichOne(m));
  }, [deckIdx, deck, hydrated, enrichOne]);

  const resetRoom = useCallback(() => {
    setMood(null);
    setRoomServices(profile.services);
    setPartnerJoined(false);
    setMatches([]);
    setMaybes([]);
    setMatchMovie(null);
    setDeckIdx(0);
    setRoomId(generateRoomId());
  }, [profile.services]);

  const value = useMemo<RoomCtx>(
    () => ({
      hydrated,
      onboarded,
      profile,
      setProfile,
      updateName,
      updateMode,
      updateServices,
      updateRegion,
      completeOnboarding,
      resetOnboarding,
      mood,
      setMood,
      roomServices,
      setRoomServices,
      roomId,
      regenerateRoom,
      partnerJoined,
      setPartnerJoined,
      deckIdx,
      setDeckIdx,
      matches,
      maybes,
      addMatch,
      addMaybe,
      matchMovie,
      setMatchMovie,
      deck,
      deckLoading,
      deckError,
      reloadDeck,
      resetRoom,
    }),
    [
      hydrated, onboarded, profile, mood, roomServices, roomId, partnerJoined,
      deckIdx, matches, maybes, matchMovie, deck, deckLoading, deckError,
      completeOnboarding, resetOnboarding, regenerateRoom, addMatch, addMaybe,
      reloadDeck, resetRoom,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRoom(): RoomCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRoom must be used inside RoomStateProvider');
  return ctx;
}
