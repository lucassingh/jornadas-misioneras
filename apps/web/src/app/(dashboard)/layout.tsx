import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@jornadas/database';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [clerkUser, dbUser] = await Promise.all([
    currentUser(),
    prisma.user.findUnique({ where: { clerkId: userId }, select: { role: true } }),
  ]);

  const isAdmin = dbUser?.role === 'ADMIN';
  const userName = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || 'Usuario';
  const userEmail = clerkUser?.emailAddresses[0]?.emailAddress ?? '';
  const userImageUrl = clerkUser?.imageUrl;

  return (
    <DashboardShell
      isAdmin={isAdmin}
      userName={userName}
      userEmail={userEmail}
      userImageUrl={userImageUrl}
    >
      {children}
    </DashboardShell>
  );
}
