import { revalidatePath } from 'next/cache';

// Países, provincias, localidades, testimonios, eventos y el contenido editable
// de la landing (SiteContent) alimentan las páginas públicas (ISR,
// revalidate=3600). Cualquier mutación desde el dashboard invalida el cache
// para que se refleje al instante, sin esperar la hora.
export function revalidatePublicPages() {
  // 'layout' en la raíz regenera todo el árbol público: home, /events,
  // /localidades y cada /events/[id] — comparten navbar, footer, testimonios y
  // CTA, que ahora salen del CMS.
  revalidatePath('/', 'layout');
  revalidatePath('/');
  revalidatePath('/events');
  revalidatePath('/localidades');
}
