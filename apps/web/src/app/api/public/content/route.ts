import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/queries/site-content';
import { isSectionKey, SECTION_ORDER } from '@/lib/content';

/**
 * GET /api/public/content            → todas las secciones
 * GET /api/public/content?section=hero → una sola sección
 *
 * Público, sin auth. Devuelve siempre contenido completo (lo guardado en el
 * dashboard mezclado con los defaults), así cualquier consumidor externo puede
 * renderizar sin chequear nulls.
 */
export async function GET(req: NextRequest) {
  const content = await getSiteContent();
  const section = req.nextUrl.searchParams.get('section');

  const headers = { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' };

  if (section) {
    if (!isSectionKey(section)) {
      return NextResponse.json(
        { error: `Sección desconocida: "${section}"`, sections: SECTION_ORDER },
        { status: 404 },
      );
    }
    return NextResponse.json({ data: content[section] }, { headers });
  }

  return NextResponse.json({ data: content, sections: SECTION_ORDER }, { headers });
}
