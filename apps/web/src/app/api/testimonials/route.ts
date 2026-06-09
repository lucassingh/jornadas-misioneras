import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, isAdmin } from '@/lib/permissions';
import { createTestimonialSchema } from '@/lib/validations/testimonial';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10)));
  const skip     = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' }, skip, take: pageSize }),
    prisma.testimonial.count(),
  ]);

  return NextResponse.json({ data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();

  const body   = await req.json();
  const parsed = createTestimonialSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { avatarUrl, ...rest } = parsed.data;
  const testimonial = await prisma.testimonial.create({
    data: { ...rest, avatarUrl: avatarUrl || null },
  });
  return NextResponse.json({ data: testimonial }, { status: 201 });
}
