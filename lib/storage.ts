import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeKey } from './theme';

export type Mode = 'solo' | 'couple';

const K = {
  onboarded: 'flick.onboarded',
  name: 'flick.name',
  mode: 'flick.mode',
  services: 'flick.services',
  theme: 'flick.theme',
  region: 'flick.region',
};

export async function loadStoredProfile(): Promise<{
  onboarded: boolean;
  name: string;
  mode: Mode;
  services: string[];
  theme: ThemeKey | null;
  region: string | null;
}> {
  const [onboarded, name, mode, services, theme, region] = await Promise.all([
    AsyncStorage.getItem(K.onboarded),
    AsyncStorage.getItem(K.name),
    AsyncStorage.getItem(K.mode),
    AsyncStorage.getItem(K.services),
    AsyncStorage.getItem(K.theme),
    AsyncStorage.getItem(K.region),
  ]);
  let parsedServices: string[] = [];
  try {
    parsedServices = services ? JSON.parse(services) : [];
  } catch {
    parsedServices = [];
  }
  const parsedMode: Mode = mode === 'solo' || mode === 'couple' ? mode : 'couple';
  return {
    onboarded: onboarded === '1',
    name: name ?? '',
    mode: parsedMode,
    services: parsedServices,
    theme: (theme as ThemeKey | null) ?? null,
    region: region && /^[A-Z]{2}$/.test(region) ? region : null,
  };
}

export async function saveOnboarded(name: string, mode: Mode, services: string[]) {
  await Promise.all([
    AsyncStorage.setItem(K.onboarded, '1'),
    AsyncStorage.setItem(K.name, name),
    AsyncStorage.setItem(K.mode, mode),
    AsyncStorage.setItem(K.services, JSON.stringify(services)),
  ]);
}

export async function saveName(name: string) {
  await AsyncStorage.setItem(K.name, name);
}

export async function saveMode(mode: Mode) {
  await AsyncStorage.setItem(K.mode, mode);
}

export async function saveServices(services: string[]) {
  await AsyncStorage.setItem(K.services, JSON.stringify(services));
}

export async function saveTheme(theme: ThemeKey) {
  await AsyncStorage.setItem(K.theme, theme);
}

export async function saveRegion(region: string) {
  await AsyncStorage.setItem(K.region, region);
}

export async function clearOnboarded() {
  await AsyncStorage.removeItem(K.onboarded);
}
