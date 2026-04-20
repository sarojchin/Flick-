import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'flick.cache.';

interface Envelope<T> {
  v: 1;
  ts: number;
  data: T;
}

export async function readCache<T>(key: string, ttlMs: number): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Envelope<T>;
    if (parsed.v !== 1 || typeof parsed.ts !== 'number') return null;
    if (Date.now() - parsed.ts > ttlMs) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    const env: Envelope<T> = { v: 1, ts: Date.now(), data };
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(env));
  } catch {
    // best-effort
  }
}

export async function clearCachePrefix(prefix: string): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const targets = keys.filter((k) => k.startsWith(PREFIX + prefix));
    if (targets.length) await AsyncStorage.multiRemove(targets);
  } catch {
    // best-effort
  }
}

export const DECK_TTL_MS = 24 * 60 * 60 * 1000;
export const DETAIL_TTL_MS = 7 * 24 * 60 * 60 * 1000;
