import { NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { endDate: { gte: new Date() } },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        country: { select: { id: true, name: true } },
        province: { select: { id: true, name: true } },
        location: { select: { id: true, name: true } },
        pricing: true,
      },
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json(
      { data: events },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch {
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
