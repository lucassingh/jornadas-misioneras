import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, isAdmin } from '@/lib/permissions';
import { createEventSchema, mapPricingToDb } from '@/lib/validations/event';

const EVENT_INCLUDE = {
  country: true,
  province: true,
  location: true,
  pricing: true,
} as const;

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
      include: EVENT_INCLUDE,
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
  console.log('[POST /api/events] body recibido:', JSON.stringify(body, null, 2));

  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    console.log('[POST /api/events] Zod error:', JSON.stringify(parsed.error.flatten(), null, 2));
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { pricing, startDate, endDate, ...rest } = parsed.data;
  console.log('[POST /api/events] datos parseados OK, creando en DB...');

  try {
    const event = await prisma.event.create({
      data: {
        ...rest,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy: user.clerkId,
        ...(pricing && { pricing: { create: mapPricingToDb(pricing) } }),
      },
      include: EVENT_INCLUDE,
    });

    console.log('[POST /api/events] Evento creado con ID:', event.id);
    return NextResponse.json({ data: event }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/events] Error de Prisma:', err);
    return NextResponse.json({ error: 'Error interno al crear el evento' }, { status: 500 });
  }
}
