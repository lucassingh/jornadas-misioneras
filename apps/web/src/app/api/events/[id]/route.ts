import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, notFound, canModifyEvent } from '@/lib/permissions';
import { updateEventSchema } from '@/lib/validations/event';

interface Params {
  params: { id: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const eventId = parseInt(params.id, 10);
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { country: true, province: true, location: true, user: true },
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

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.event.update({
    where: { id: eventId },
    data: {
      ...parsed.data,
      ...(parsed.data.startDate && { startDate: new Date(parsed.data.startDate) }),
      ...(parsed.data.endDate && { endDate: new Date(parsed.data.endDate) }),
    },
    include: { country: true, province: true, location: true },
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
