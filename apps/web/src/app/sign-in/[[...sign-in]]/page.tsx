import { SignIn } from '@clerk/nextjs';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

export default function SignInPage() {
  return (
    <AuthSplitLayout>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#2235fd',
            colorBackground: '#ffffff',
            colorText: '#241e21',
            colorTextSecondary: 'rgba(36,30,33,0.55)',
            colorInputBackground: '#f4f6f8',
            colorInputText: '#241e21',
            borderRadius: '10px',
            fontFamily: 'var(--font-roboto-flex), Roboto, sans-serif',
          },
          elements: {
            card: { boxShadow: 'none', border: '1px solid rgba(34,53,253,0.1)' },
            headerTitle: { fontFamily: 'var(--font-archivo-black)' },
          },
        }}
      />
    </AuthSplitLayout>
  );
}
