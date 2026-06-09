import { NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      select: {
        id:        true,
        firstName: true,
        lastName:  true,
        avatarUrl: true,
        content:   true,
        eventName: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(
      { data: testimonials },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch {
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
