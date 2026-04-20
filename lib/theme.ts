export type ThemeKey = 'editorial' | 'graphite' | 'forest';

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

// Palette notes — all hex approximations of the design's OKLCH tokens
// (see flick/project/theme.js in the handoff bundle). Intentionally no hues
// in the 280–350 magenta/pink range.
export const THEMES: Record<ThemeKey, Theme> = {
  editorial: {
    key: 'editorial',
    name: 'Editorial Ink',
    bg: '#17181f',
    bg2: '#0f1014',
    surface: '#242631',
    surface2: '#30323d',
    border: '#43454f',
    text: '#f8f4ea',
    textDim: '#bab5a9',
    textMute: '#7d7a71',
    primary: '#ead8b8',
    primary2: '#d3bf95',
    accent: '#c29567',
    yes: '#90d3a4',
    no: '#da7b61',
    glow: '#ead8b8',
  },
  graphite: {
    key: 'graphite',
    name: 'Graphite',
    bg: '#17181a',
    bg2: '#0e0f10',
    surface: '#25262a',
    surface2: '#30323a',
    border: '#42434a',
    text: '#fafafb',
    textDim: '#b1b3b7',
    textMute: '#74767a',
    primary: '#ebecee',
    primary2: '#d1d2d8',
    accent: '#b58565',
    yes: '#8acc9e',
    no: '#d4765b',
    glow: '#ebecee',
  },
  forest: {
    key: 'forest',
    name: 'Deep Forest',
    bg: '#152620',
    bg2: '#0e1b17',
    surface: '#1f3329',
    surface2: '#293e33',
    border: '#3c5349',
    text: '#f5f1e3',
    textDim: '#b7b0a1',
    textMute: '#7c7668',
    primary: '#dbc5a1',
    primary2: '#c2ac7d',
    accent: '#bd8863',
    yes: '#8ccfa0',
    no: '#d47561',
    glow: '#dbc5a1',
  },
};

export const DEFAULT_THEME: ThemeKey = 'editorial';

// Adds a hex alpha byte (00-ff) to a 6-digit hex color.
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  const byte = Math.round(a * 255).toString(16).padStart(2, '0');
  return `${hex}${byte}`;
}
