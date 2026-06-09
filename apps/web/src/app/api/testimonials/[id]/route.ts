import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, notFound, isAdmin } from '@/lib/permissions';
import { updateTestimonialSchema } from '@/lib/validations/testimonial';

interface Params {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id     = parseInt(params.id, 10);
  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) return notFound('Testimonio');

  const body   = await req.json();
  const parsed = updateTestimonialSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { avatarUrl, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (avatarUrl !== undefined) data.avatarUrl = avatarUrl || null;

  const testimonial = await prisma.testimonial.update({ where: { id }, data });
  return NextResponse.json({ data: testimonial });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const id     = parseInt(params.id, 10);
  const exists = await prisma.testimonial.findUnique({ where: { id } });
  if (!exists) return notFound('Testimonio');

  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ data: { message: 'Testimonio eliminado' } });
}
