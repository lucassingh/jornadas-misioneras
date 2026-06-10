import { notFound } from 'next/navigation';
import Image from 'next/image';
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

function RichSection({ label, html }: { label: string; html: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <strong>{label}:</strong>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ lineHeight: '1.7', marginTop: '4px' }}
      />
    </div>
  );
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
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
          <Image src={event.imageUrl} alt={event.title} fill style={{ objectFit: 'cover' }} />
        </div>
      )}
      {event.imageUrl2 && (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
          <Image src={event.imageUrl2} alt={`${event.title} — imagen 2`} fill style={{ objectFit: 'cover' }} />
        </div>
      )}

      <h1>{event.title}</h1>

      <p><strong>Fecha:</strong> {startDate} – {endDate}</p>
      <p><strong>País:</strong> {event.country.name}</p>
      <p><strong>Provincia:</strong> {event.province.name}</p>
      <p><strong>Localidad:</strong> {event.location.name}</p>

      {event.description    && <RichSection label="Descripción" html={event.description} />}
      {event.hostChurch     && <RichSection label="Iglesia anfitriona" html={event.hostChurch} />}
      {event.activities     && <RichSection label="Actividades" html={event.activities} />}
      {event.targetAudience && <RichSection label="Dirigido a" html={event.targetAudience} />}
      {event.extraInfo      && <RichSection label="Info adicional" html={event.extraInfo} />}
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
