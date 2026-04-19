export type ThemeKey = 'midnight' | 'velvet' | 'aurora';

export interface Theme {
  key: ThemeKey;
  name: string;
  bg: string;
  bg2: string;
  surface: string;
  surface2: string;
  border: string;
  text: string;
  textDim: string;
  textMute: string;
  primary: string;
  primary2: string;
  accent: string;
  yes: string;
  no: string;
  glow: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  midnight: {
    key: 'midnight',
    name: 'Midnight Neon',
    bg: '#05050d',
    bg2: '#010104',
    surface: '#10101c',
    surface2: '#191928',
    border: '#2c2b41',
    text: '#f7f8ff',
    textDim: '#9c9dab',
    textMute: '#61626f',
    primary: '#ff4ad6',
    primary2: '#da08d3',
    accent: '#00d4df',
    yes: '#00dc64',
    no: '#ff3d44',
    glow: '#ff4ad6',
  },
  velvet: {
    key: 'velvet',
    name: 'Velvet Burgundy',
    bg: '#0d0202',
    bg2: '#050001',
    surface: '#1e0708',
    surface2: '#2e1011',
    border: '#472021',
    text: '#fff6ef',
    textDim: '#b79e9a',
    textMute: '#735d59',
    primary: '#ff614d',
    primary2: '#e62845',
    accent: '#e6b55d',
    yes: '#69c853',
    no: '#ed324b',
    glow: '#ff5453',
  },
  aurora: {
    key: 'aurora',
    name: 'Arctic Aurora',
    bg: '#010810',
    bg2: '#000306',
    surface: '#061520',
    surface2: '#0e212e',
    border: '#1f3645',
    text: '#f1fbfb',
    textDim: '#91a9b2',
    textMute: '#54676d',
    primary: '#00dbbc',
    primary2: '#00bd85',
    accent: '#989aff',
    yes: '#09e095',
    no: '#ff4f3b',
    glow: '#00dbbc',
  },
};

export const DEFAULT_THEME: ThemeKey = 'midnight';

// Adds a hex alpha byte (00-ff) to a 6-digit hex color.
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  const byte = Math.round(a * 255).toString(16).padStart(2, '0');
  return `${hex}${byte}`;
}
