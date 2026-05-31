import { auth } from '@clerk/nextjs/server';
import { prisma } from '@jornadas/database';
import { NextResponse } from 'next/server';

export async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true, clerkId: true },
  });

  return dbUser ? { clerkId: userId, role: dbUser.role } : null;
}

export function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
}

export function notFound(entity = 'Recurso') {
  return NextResponse.json({ error: `${entity} no encontrado` }, { status: 404 });
}

export function isAdmin(role: string) {
  return role === 'ADMIN';
}

export function canModifyEvent(eventOwnerId: string, userId: string, role: string) {
  return isAdmin(role) || eventOwnerId === userId;
}
