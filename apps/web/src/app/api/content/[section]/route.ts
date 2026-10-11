import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@jornadas/database';
import { getAuthUser, unauthorized, forbidden, isAdmin } from '@/lib/permissions';
import { getSectionSchema, isSectionKey, mergeSectionContent, SECTIONS } from '@/lib/content';
import { revalidatePublicPages } from '@/lib/revalidatePublicPages';

interface Params {
  params: { section: string };
}

function invalidSection(section: string) {
  return NextResponse.json({ error: `Sección desconocida: "${section}"` }, { status: 404 });
}

/** GET /api/content/[section] — contenido actual + metadata (solo admin). */
export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();
  if (!isSectionKey(params.section)) return invalidSection(params.section);

  const row = await prisma.siteContent.findUnique({ where: { key: params.section } });

  return NextResponse.json({
    data: mergeSectionContent(params.section, row?.data),
    updatedAt: row?.updatedAt ?? null,
    updatedBy: row?.updatedBy ?? null,
    isCustomized: !!row,
  });
}

/** PUT /api/content/[section] — guarda la sección completa, validada con su schema. */
export async function PUT(req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();
  if (!isSectionKey(params.section)) return invalidSection(params.section);

  const body = await req.json().catch(() => null);
  const parsed = getSectionSchema(params.section).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const row = await prisma.siteContent.upsert({
    where: { key: params.section },
    create: { key: params.section, data: parsed.data, updatedBy: user.clerkId },
    update: { data: parsed.data, updatedBy: user.clerkId },
  });

  revalidatePublicPages();

  return NextResponse.json({
    data: mergeSectionContent(params.section, row.data),
    updatedAt: row.updatedAt,
    updatedBy: row.updatedBy,
    isCustomized: true,
  });
}

/** DELETE /api/content/[section] — vuelve a los textos originales (borra la fila). */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getAuthUser();
  if (!user) return unauthorized();
  if (!isAdmin(user.role)) return forbidden();
  if (!isSectionKey(params.section)) return invalidSection(params.section);

  await prisma.siteContent.deleteMany({ where: { key: params.section } });
  revalidatePublicPages();

  return NextResponse.json({
    data: SECTIONS[params.section].defaults,
    updatedAt: null,
    updatedBy: null,
    isCustomized: false,
  });
}
