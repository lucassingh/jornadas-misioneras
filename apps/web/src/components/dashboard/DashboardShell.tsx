'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

interface Props {
  children: React.ReactNode;
  isAdmin: boolean;
  userName: string;
  userEmail: string;
  userImageUrl?: string;
}

const SIDEBAR_EXPANDED = 260;
const SIDEBAR_COLLAPSED = 72;

export function DashboardShell({ children, isAdmin, userName, userEmail, userImageUrl }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED;

  return (
    <Box
      sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}
      style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
    >
      <DashboardSidebar
        width={sidebarWidth}
        isOpen={sidebarOpen}
        isAdmin={isAdmin}
        userName={userName}
        userEmail={userEmail}
        userImageUrl={userImageUrl}
        onToggle={() => setSidebarOpen((p) => !p)}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'margin 0.3s ease',
          ml: `${sidebarWidth}px`,
        }}
      >
        <DashboardHeader
          userName={userName}
          userEmail={userEmail}
          userImageUrl={userImageUrl}
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
        />
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
