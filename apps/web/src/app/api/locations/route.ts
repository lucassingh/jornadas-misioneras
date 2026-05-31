import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, isAdmin } from '@/lib/permissions';
import { createLocationSchema } from '@/lib/validations/location';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10)));
  const provinceId = searchParams.get('provinceId');
  const skip = (page - 1) * pageSize;

  const where = provinceId ? { provinceId: parseInt(provinceId, 10) } : {};

  const [data, total] = await Promise.all([
    prisma.location.findMany({
      where,
      include: { province: { include: { country: true } } },
      orderBy: { name: 'asc' },
      skip,
      take: pageSize,
    }),
    prisma.location.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const body = await req.json();
  const parsed = createLocationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const location = await prisma.location.create({
    data: parsed.data,
    include: { province: { include: { country: true } } },
  });
  return NextResponse.json({ data: location }, { status: 201 });
}
