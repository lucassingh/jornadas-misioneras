import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    extra1: Palette['primary'];
    extra2: Palette['primary'];
    sidebar: { bg: string; border: string };
    card: { bg: string; border: string };
  }
  interface PaletteOptions {
    extra1?: PaletteOptions['primary'];
    extra2?: PaletteOptions['primary'];
    sidebar?: { bg: string; border: string };
    card?: { bg: string; border: string };
  }
}

export const COLOR_TOKENS = {
  brand: '#2235fd',
  secondary: '#84f649',
  darkBg: '#241e21',
  sidebarDark: '#141014',
  cardDark: '#2e2829',
  extra1: '#ff3e60',
  extra2: '#90b8f6',
  white: '#ffffff',
} as const;

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: COLOR_TOKENS.brand, contrastText: COLOR_TOKENS.white },
      secondary: { main: COLOR_TOKENS.secondary, contrastText: COLOR_TOKENS.darkBg },
      extra1: { main: COLOR_TOKENS.extra1, contrastText: COLOR_TOKENS.white },
      extra2: { main: COLOR_TOKENS.extra2, contrastText: COLOR_TOKENS.darkBg },
      sidebar: {
        bg: COLOR_TOKENS.sidebarDark,
        border: 'rgba(255,255,255,0.07)',
      },
      card: {
        bg: mode === 'dark' ? COLOR_TOKENS.cardDark : COLOR_TOKENS.white,
        border: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(34,53,253,0.1)',
      },
      background: {
        default: mode === 'dark' ? COLOR_TOKENS.darkBg : '#f4f6f8',
        paper: mode === 'dark' ? COLOR_TOKENS.cardDark : COLOR_TOKENS.white,
      },
      text: {
        primary: mode === 'dark' ? COLOR_TOKENS.white : COLOR_TOKENS.darkBg,
        secondary: mode === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(36,30,33,0.55)',
      },
    },
    typography: {
      fontFamily: 'var(--font-roboto-flex), Roboto, sans-serif',
      h1: { fontFamily: 'var(--font-archivo-black)', fontWeight: 400 },
      h2: { fontFamily: 'var(--font-archivo-black)', fontWeight: 400 },
      h3: { fontFamily: 'var(--font-archivo-black)', fontWeight: 400 },
      h4: { fontFamily: 'var(--font-archivo-black)', fontWeight: 400 },
      h5: { fontFamily: 'var(--font-archivo-black)', fontWeight: 400 },
      h6: { fontFamily: 'var(--font-archivo-black)', fontWeight: 400 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.card.bg,
            border: `1px solid ${theme.palette.card.border}`,
            boxShadow: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 8px 24px rgba(0,0,0,0.4)'
                  : '0 8px 24px rgba(34,53,253,0.12)',
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.card.bg,
            border: `1px solid ${theme.palette.card.border}`,
          }),
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.card.bg,
            border: `1px solid ${theme.palette.card.border}`,
            borderRadius: 10,
          }),
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiTableCell-root': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.04)'
                  : 'rgba(34,53,253,0.04)',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: theme.palette.text.secondary,
              borderBottom: `1px solid ${theme.palette.card.border}`,
            },
          }),
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: ({ theme }) => ({
            transition: 'background-color 0.15s ease',
            '&:last-child td': { border: 0 },
            '&.MuiTableRow-hover:hover': {
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(34,53,253,0.09)'
                  : 'rgba(34,53,253,0.04)',
            },
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.card.border}`,
            padding: '12px 16px',
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, fontSize: '0.75rem' },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.mode === 'dark' ? COLOR_TOKENS.cardDark : COLOR_TOKENS.white,
            border: `1px solid ${theme.palette.card.border}`,
          }),
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '& fieldset': { borderColor: theme.palette.card.border },
            },
          }),
        },
      },
    },
  });
