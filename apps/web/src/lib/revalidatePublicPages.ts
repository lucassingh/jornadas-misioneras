import { revalidatePath } from 'next/cache';

// Países, provincias, localidades, testimonios y eventos alimentan estas
// páginas públicas (ISR, revalidate=3600) — cualquier mutación en el
// dashboard debe invalidar el cache para que se reflejen sin esperar la hora.
export function revalidatePublicPages() {
  revalidatePath('/');
  revalidatePath('/events');
  revalidatePath('/localidades');
}
