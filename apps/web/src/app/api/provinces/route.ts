import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, isAdmin } from '@/lib/permissions';
import { createProvinceSchema } from '@/lib/validations/province';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10)));
  const countryId = searchParams.get('countryId');
  const skip = (page - 1) * pageSize;

  const where = countryId ? { countryId: parseInt(countryId, 10) } : {};

  const [data, total] = await Promise.all([
    prisma.province.findMany({
      where,
      include: { country: true },
      orderBy: [{ country: { name: 'asc' } }, { name: 'asc' }],
      skip,
      take: pageSize,
    }),
    prisma.province.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const body = await req.json();
  const parsed = createProvinceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const province = await prisma.province.create({ data: parsed.data, include: { country: true } });
  return NextResponse.json({ data: province }, { status: 201 });
}
