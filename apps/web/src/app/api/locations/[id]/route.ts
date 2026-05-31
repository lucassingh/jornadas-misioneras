import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, notFound, isAdmin } from '@/lib/permissions';
import { updateLocationSchema } from '@/lib/validations/location';

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id = parseInt(params.id, 10);
  const exists = await prisma.location.findUnique({ where: { id } });
  if (!exists) return notFound('Localidad');

  const body = await req.json();
  const parsed = updateLocationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const location = await prisma.location.update({
    where: { id },
    data: parsed.data,
    include: { province: { include: { country: true } } },
  });

  return NextResponse.json({ data: location });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id = parseInt(params.id, 10);
  const exists = await prisma.location.findUnique({ where: { id } });
  if (!exists) return notFound('Localidad');

  await prisma.location.delete({ where: { id } });
  return NextResponse.json({ data: { message: 'Localidad eliminada' } });
}
