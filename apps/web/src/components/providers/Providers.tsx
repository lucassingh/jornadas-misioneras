'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from '@jornadas/ui';
import { useEffect, useMemo, useState } from 'react';
import { ColorModeProvider, useColorMode } from '@/context/ColorModeContext';

function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useColorMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <ColorModeProvider>
          <MuiThemeProvider>
            {children}
          </MuiThemeProvider>
        </ColorModeProvider>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
