'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PaletteMode } from '@mui/material';

interface ColorModeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  mode: 'dark',
  toggleColorMode: () => {},
});

const CSS_VARS: Record<PaletteMode, Record<string, string>> = {
  dark: {
    '--color-bg': '#241e21',
    '--color-primary': '#2235fd',
    '--color-secondary': '#efdfb4',
    '--color-text': '#ffffff',
    '--color-extra1': '#ff3e60',
    '--color-extra2': '#90b8f6',
  },
  light: {
    '--color-bg': '#ffffff',
    '--color-primary': '#2235fd',
    '--color-secondary': '#efdfb4',
    '--color-text': '#2235fd',
    '--color-extra1': '#ff3e60',
    '--color-extra2': '#90b8f6',
  },
};

function applyCssVars(mode: PaletteMode) {
  const root = document.documentElement;
  Object.entries(CSS_VARS[mode]).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('colorMode') as PaletteMode | null;
    const initial = stored === 'light' || stored === 'dark' ? stored : 'dark';
    setMode(initial);
    applyCssVars(initial);
  }, []);

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('colorMode', next);
      applyCssVars(next);
      return next;
    });
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext);
