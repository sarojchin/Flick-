import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { DEFAULT_THEME, THEMES, type Theme, type ThemeKey } from './theme';
import { loadStoredProfile, saveTheme } from './storage';

interface ThemeCtx {
  theme: Theme;
  themeKey: ThemeKey;
  setThemeKey: (k: ThemeKey) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>(DEFAULT_THEME);

  useEffect(() => {
    loadStoredProfile().then((p) => {
      if (p.theme && THEMES[p.theme]) setThemeKeyState(p.theme);
    });
  }, []);

  const setThemeKey = (k: ThemeKey) => {
    setThemeKeyState(k);
    saveTheme(k).catch(() => {});
  };

  const value = useMemo<ThemeCtx>(
    () => ({ theme: THEMES[themeKey], themeKey, setThemeKey }),
    [themeKey]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx.theme;
}

export function useThemeControls() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useThemeControls must be used inside ThemeProvider');
  return ctx;
}
