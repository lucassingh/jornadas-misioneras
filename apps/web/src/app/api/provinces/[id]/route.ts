import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, notFound, isAdmin } from '@/lib/permissions';
import { updateProvinceSchema } from '@/lib/validations/province';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id = parseInt(params.id, 10);
  const province = await prisma.province.findUnique({
    where: { id },
    include: {
      country: true,
      locations: {
        include: { _count: { select: { events: true } } },
        orderBy: { name: 'asc' },
      },
      _count: { select: { locations: true, events: true } },
    },
  });

  if (!province) return notFound('Provincia');
  return NextResponse.json({ data: province });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id = parseInt(params.id, 10);
  const exists = await prisma.province.findUnique({ where: { id } });
  if (!exists) return notFound('Provincia');

  const body = await req.json();
  const parsed = updateProvinceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const province = await prisma.province.update({
    where: { id },
    data: parsed.data,
    include: { country: true },
  });

  return NextResponse.json({ data: province });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id = parseInt(params.id, 10);
  const exists = await prisma.province.findUnique({ where: { id } });
  if (!exists) return notFound('Provincia');

  await prisma.province.delete({ where: { id } });
  return NextResponse.json({ data: { message: 'Provincia eliminada' } });
}
