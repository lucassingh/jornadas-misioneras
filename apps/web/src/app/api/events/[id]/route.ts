import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, notFound, canModifyEvent } from '@/lib/permissions';
import { updateEventSchema, mapPricingToDb } from '@/lib/validations/event';

interface Params {
  params: { id: string };
}

const EVENT_INCLUDE = {
  country: true,
  province: true,
  location: true,
  pricing: true,
} as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const eventId = parseInt(params.id, 10);
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { ...EVENT_INCLUDE, user: true },
  });

  if (!event) return notFound('Evento');
  if (!canModifyEvent(event.createdBy, user.clerkId, user.role)) return forbidden();

  return NextResponse.json({ data: event });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const eventId = parseInt(params.id, 10);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return notFound('Evento');
  if (!canModifyEvent(event.createdBy, user.clerkId, user.role)) return forbidden();

  const body = await req.json();
  const parsed = updateEventSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { pricing, startDate, endDate, ...scalars } = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    // pricing: null means "remove pricing" — deleteMany avoids errors if no row exists
    if (pricing === null) {
      await tx.eventPricing.deleteMany({ where: { eventId } });
    }

    return tx.event.update({
      where: { id: eventId },
      data: {
        ...scalars,
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(pricing != null && {
          pricing: {
            upsert: {
              create: mapPricingToDb(pricing),
              update: mapPricingToDb(pricing),
            },
          },
        }),
      },
      include: EVENT_INCLUDE,
    });
  });

  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const eventId = parseInt(params.id, 10);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return notFound('Evento');
  if (!canModifyEvent(event.createdBy, user.clerkId, user.role)) return forbidden();

  await prisma.event.delete({ where: { id: eventId } });
  return NextResponse.json({ data: { message: 'Evento eliminado' } });
}
