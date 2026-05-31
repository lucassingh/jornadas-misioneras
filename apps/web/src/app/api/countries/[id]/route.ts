import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, notFound, isAdmin } from '@/lib/permissions';
import { updateCountrySchema } from '@/lib/validations/country';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id = parseInt(params.id, 10);
  const country = await prisma.country.findUnique({
    where: { id },
    include: {
      provinces: {
        include: { _count: { select: { locations: true } } },
        orderBy: { name: 'asc' },
      },
      _count: { select: { provinces: true, events: true } },
    },
  });

  if (!country) return notFound('País');
  return NextResponse.json({ data: country });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id = parseInt(params.id, 10);
  const exists = await prisma.country.findUnique({ where: { id } });
  if (!exists) return notFound('País');

  const body = await req.json();
  const parsed = updateCountrySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const country = await prisma.country.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ data: country });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id = parseInt(params.id, 10);
  const exists = await prisma.country.findUnique({ where: { id } });
  if (!exists) return notFound('País');

  await prisma.country.delete({ where: { id } });
  return NextResponse.json({ data: { message: 'País eliminado' } });
}
