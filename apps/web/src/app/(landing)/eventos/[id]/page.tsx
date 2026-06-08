import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getPublicEvents, getPublicEventById } from '@/lib/queries/public-events';

export const revalidate = 3600;

export async function generateStaticParams() {
  const events = await getPublicEvents();
  return events.map((e) => ({ id: String(e.id) }));
}

interface Props {
  params: { id: string };
}

export default async function EventDetailPage({ params }: Props) {
  const event = await getPublicEventById(Number(params.id));
  if (!event) notFound();

  const startDate = format(new Date(event.startDate), "d 'de' MMMM yyyy", { locale: es });
  const endDate   = format(new Date(event.endDate),   "d 'de' MMMM yyyy", { locale: es });

  return (
    <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Imágenes */}
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          style={{ width: '100%', borderRadius: '12px', marginBottom: '12px', display: 'block' }}
        />
      )}
      {event.imageUrl2 && (
        <img
          src={event.imageUrl2}
          alt={`${event.title} — imagen 2`}
          style={{ width: '100%', borderRadius: '12px', marginBottom: '24px', display: 'block' }}
        />
      )}

      <h1>{event.title}</h1>

      <p><strong>Fecha:</strong> {startDate} – {endDate}</p>
      <p><strong>País:</strong> {event.country.name}</p>
      <p><strong>Provincia:</strong> {event.province.name}</p>
      <p><strong>Localidad:</strong> {event.location.name}</p>

      {event.description    && <p><strong>Descripción:</strong> {event.description}</p>}
      {event.hostChurch     && <p><strong>Iglesia anfitriona:</strong> {event.hostChurch}</p>}
      {event.activities     && <p><strong>Actividades:</strong> {event.activities}</p>}
      {event.targetAudience && <p><strong>Dirigido a:</strong> {event.targetAudience}</p>}
      {event.extraInfo      && <p><strong>Info adicional:</strong> {event.extraInfo}</p>}
      {event.capacity       && <p><strong>Capacidad:</strong> {event.capacity} personas</p>}

      {event.pricing && (
        <>
          <p>
            <strong>Inscripción temprana:</strong>{' '}
            ${Number(event.pricing.registrationEarlyAmount).toLocaleString('es-AR')}
          </p>
          <p>
            <strong>Inscripción tardía:</strong>{' '}
            ${Number(event.pricing.registrationLateAmount).toLocaleString('es-AR')}
          </p>
        </>
      )}

      {event.registrationLink && (
        <p>
          <strong>Inscribirse:</strong>{' '}
          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
            {event.registrationLink}
          </a>
        </p>
      )}

      {(event.contactName || event.contactEmail || event.contactPhone) && (
        <>
          <h2>Contacto</h2>
          {event.contactName  && <p><strong>Nombre:</strong> {event.contactName}</p>}
          {event.contactEmail && <p><strong>Email:</strong> {event.contactEmail}</p>}
          {event.contactPhone && <p><strong>Teléfono:</strong> {event.contactPhone}</p>}
        </>
      )}
    </div>
  );
}
