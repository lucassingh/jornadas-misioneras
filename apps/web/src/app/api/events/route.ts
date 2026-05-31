import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, isAdmin } from '@/lib/permissions';
import { createEventSchema } from '@/lib/validations/event';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10)));
  const skip = (page - 1) * pageSize;

  const where = isAdmin(user.role) ? {} : { createdBy: user.clerkId };

  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: { country: true, province: true, location: true },
      orderBy: { startDate: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.event.count({ where }),
  ]);

  return NextResponse.json({ data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
      createdBy: user.clerkId,
    },
    include: { country: true, province: true, location: true },
  });

  return NextResponse.json({ data: event }, { status: 201 });
}
