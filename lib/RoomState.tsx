import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FLICK_MOVIES, type Movie, type Mood } from './data';
import {
  loadStoredProfile,
  saveName,
  saveMode,
  saveOnboarded,
  saveServices,
  clearOnboarded,
  type Mode,
} from './storage';

interface Profile {
  name: string;
  mode: Mode;
  services: string[];
}

interface RoomCtx {
  hydrated: boolean;
  onboarded: boolean;

  profile: Profile;
  setProfile: (p: Profile) => void;
  updateName: (n: string) => void;
  updateMode: (m: Mode) => void;
  updateServices: (s: string[]) => void;
  completeOnboarding: (p: Profile) => Promise<void>;
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
  resetRoom: () => void;
}

const Ctx = createContext<RoomCtx | null>(null);

function generateRoomId(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 5; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export function RoomStateProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfileState] = useState<Profile>({ name: '', mode: 'couple', services: [] });

  const [mood, setMood] = useState<Mood | null>(null);
  const [roomServices, setRoomServices] = useState<string[]>([]);
  const [roomId, setRoomId] = useState(generateRoomId);
  const [partnerJoined, setPartnerJoined] = useState(false);

  const [deckIdx, setDeckIdx] = useState(0);
  const [matches, setMatches] = useState<Movie[]>([]);
  const [maybes, setMaybes] = useState<Movie[]>([]);
  const [matchMovie, setMatchMovie] = useState<Movie | null>(null);

  useEffect(() => {
    loadStoredProfile().then((p) => {
      setOnboarded(p.onboarded);
      setProfileState({ name: p.name, mode: p.mode, services: p.services });
      setRoomServices(p.services);
      setHydrated(true);
    });
  }, []);

  const setProfile = (p: Profile) => {
    setProfileState(p);
    saveName(p.name).catch(() => {});
    saveMode(p.mode).catch(() => {});
    saveServices(p.services).catch(() => {});
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

  const completeOnboarding = useCallback(async (p: Profile) => {
    await saveOnboarded(p.name, p.mode, p.services);
    setProfileState(p);
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

  const deck = useMemo(() => {
    if (!mood) return FLICK_MOVIES;
    const matching = FLICK_MOVIES.filter((m) => m.mood === mood);
    const others = FLICK_MOVIES.filter((m) => m.mood !== mood);
    return [...matching, ...others];
  }, [mood]);

  const value = useMemo<RoomCtx>(
    () => ({
      hydrated,
      onboarded,
      profile,
      setProfile,
      updateName,
      updateMode,
      updateServices,
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
      resetRoom,
    }),
    [
      hydrated, onboarded, profile, mood, roomServices, roomId, partnerJoined,
      deckIdx, matches, maybes, matchMovie, deck,
      completeOnboarding, resetOnboarding, regenerateRoom, addMatch, addMaybe, resetRoom,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRoom(): RoomCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRoom must be used inside RoomStateProvider');
  return ctx;
}
