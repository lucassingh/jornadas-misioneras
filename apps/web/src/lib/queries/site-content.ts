import { cache } from 'react';
import { prisma } from '@jornadas/database';
import { buildSiteContent, type SiteContent } from '@/lib/content';

/**
 * Contenido editable de la landing (textos, fotos, video).
 *
 * `cache()` deduplica la query dentro de un mismo render: el layout de la
 * landing y la página lo piden por separado y la DB se consulta una sola vez.
 *
 * Si la tabla todavía no existe (deploy a mitad de camino) o la DB falla, la
 * landing se renderiza con los defaults del código en vez de romperse.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const rows = await prisma.siteContent.findMany({ select: { key: true, data: true } });
    return buildSiteContent(rows);
  } catch (err) {
    console.error('[getSiteContent] usando defaults —', err instanceof Error ? err.message : err);
    return buildSiteContent([]);
  }
});
