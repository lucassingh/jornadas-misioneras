import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, notFound, canModifyEvent } from '@/lib/permissions';
import { revalidatePublicPages } from '@/lib/revalidatePublicPages';

interface Params {
  params: { id: string };
}

export async function POST(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const eventId = parseInt(params.id, 10);
  const source = await prisma.event.findUnique({
    where: { id: eventId },
    include: { pricing: true },
  });

  if (!source) return notFound('Evento');
  if (!canModifyEvent(source.createdBy, user.clerkId, user.role)) return forbidden();

  const {
    id: _id,
    createdAt: _ca,
    updatedAt: _ua,
    imageUrl: _img1,
    imageUrl2: _img2,
    pricing,
    ...rest
  } = source;

  const cloned = await prisma.event.create({
    data: {
      ...rest,
      title: `Copia ${source.title}`,
      imageUrl: null,
      imageUrl2: null,
      createdBy: user.clerkId,
      ...(pricing && {
        pricing: {
          create: {
            priceTwoMonthsBefore: pricing.priceTwoMonthsBefore,
            priceOneMonthBefore: pricing.priceOneMonthBefore,
          },
        },
      }),
    },
    include: { country: true, province: true, location: true, pricing: true },
  });

  revalidatePublicPages();
  return NextResponse.json({ data: cloned }, { status: 201 });
}
