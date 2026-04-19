import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeKey } from './theme';

const K = {
  onboarded: 'flick.onboarded',
  name: 'flick.name',
  services: 'flick.services',
  theme: 'flick.theme',
};

export async function loadStoredProfile(): Promise<{
  onboarded: boolean;
  name: string;
  services: string[];
  theme: ThemeKey | null;
}> {
  const [onboarded, name, services, theme] = await Promise.all([
    AsyncStorage.getItem(K.onboarded),
    AsyncStorage.getItem(K.name),
    AsyncStorage.getItem(K.services),
    AsyncStorage.getItem(K.theme),
  ]);
  let parsedServices: string[] = [];
  try {
    parsedServices = services ? JSON.parse(services) : [];
  } catch {
    parsedServices = [];
  }
  return {
    onboarded: onboarded === '1',
    name: name ?? '',
    services: parsedServices,
    theme: (theme as ThemeKey | null) ?? null,
  };
}

export async function saveOnboarded(name: string, services: string[]) {
  await Promise.all([
    AsyncStorage.setItem(K.onboarded, '1'),
    AsyncStorage.setItem(K.name, name),
    AsyncStorage.setItem(K.services, JSON.stringify(services)),
  ]);
}

export async function saveName(name: string) {
  await AsyncStorage.setItem(K.name, name);
}

export async function saveServices(services: string[]) {
  await AsyncStorage.setItem(K.services, JSON.stringify(services));
}

export async function saveTheme(theme: ThemeKey) {
  await AsyncStorage.setItem(K.theme, theme);
}

export async function clearOnboarded() {
  await AsyncStorage.removeItem(K.onboarded);
}
