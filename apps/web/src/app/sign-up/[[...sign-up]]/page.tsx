import { SignUp } from '@clerk/nextjs';
import Box from '@mui/material/Box';

export default function SignUpPage() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
    >
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#2235fd',
            colorBackground: '#2e2829',
            colorText: '#ffffff',
            colorTextSecondary: 'rgba(255,255,255,0.55)',
            colorInputBackground: '#241e21',
            colorInputText: '#ffffff',
            borderRadius: '10px',
            fontFamily: 'var(--font-roboto-flex), Roboto, sans-serif',
          },
          elements: {
            card: { boxShadow: 'none', border: '1px solid rgba(255,255,255,0.08)' },
            headerTitle: { fontFamily: 'var(--font-archivo-black)' },
          },
        }}
      />
    </Box>
  );
}
