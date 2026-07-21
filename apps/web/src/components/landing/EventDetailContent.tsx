'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { MapPin, Calendar, Users, ExternalLink, Mail, Phone, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ── Design tokens ─────────────────────────────────────────────────────────────
const BG      = '#f5f5f0';
const FG      = '#0d0c0c';
const MUTED   = 'rgba(13,12,12,0.5)';
const FAINT   = 'rgba(13,12,12,0.1)';
const ACCENT  = '#84f649';
const PRIMARY = '#2235fd';
const DARK    = '#0d0c0c';
const LIGHT   = '#f5f5f0';

const FONT_D = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_B = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Pricing {
  paymentSystem: string;
  registrationEarlyAmount: number;
  registrationEarlyDeadline: string | null;
  registrationLateAmount: number;
  registrationLateDeadline: string | null;
  eventPaymentEarlyAmount: number | null;
  eventPaymentDeadline: string | null;
  eventPaymentAtEventAmount: number | null;
  installment1Amount: number | null;
  installment1Deadline: string | null;
  installment2Amount: number | null;
  totalAmount: number | null;
}

export interface EventDetailProps {
  title: string;
  country: string;
  province: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number | null;
  description: string | null;
  hostChurch: string | null;
  activities: string | null;
  targetAudience: string | null;
  extraInfo: string | null;
  registrationLink: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  pricing: Pricing | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}

function fmtDate(d: string | null): string | null {
  if (!d) return null;
  return format(new Date(d), "d 'de' MMMM yyyy", { locale: es });
}

// ── Eyebrow label ─────────────────────────────────────────────────────────────
function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', mb: '24px' }}>
      <Box sx={{ width: '30px', height: '2px', backgroundColor: ACCENT, flexShrink: 0 }} />
      <Box sx={{
        fontFamily: FONT_B, fontSize: '11px', fontWeight: 700,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: light ? 'rgba(245,245,240,0.4)' : MUTED,
      }}>
        {children}
      </Box>
    </Box>
  );
}

// ── Rich text content block ───────────────────────────────────────────────────
function ContentBlock({ html, label, index }: { html: string; label: string; index: number }) {
  const num = String(index + 1).padStart(2, '0');

  return (
    <Box
      component="section"
      sx={{
        py: '64px',
        px: { xs: '28px', md: '48px' },
        borderBottom: `1px solid ${FAINT}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ghost section number */}
      <Box aria-hidden sx={{
        position: 'absolute', bottom: '-0.1em', right: '-0.04em',
        fontFamily: FONT_D, fontSize: { xs: '28vw', md: '11rem' }, lineHeight: 1,
        color: 'rgba(13,12,12,0.038)',
        pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}>
        {num}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow: accent bar + number */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '18px' }}>
          <Box sx={{ width: '28px', height: '2px', backgroundColor: ACCENT, flexShrink: 0 }} />
          <Box sx={{
            fontFamily: FONT_B, fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(13,12,12,0.28)',
          }}>
            {num}
          </Box>
        </Box>

        {/* Section heading in display font */}
        <Box sx={{
          fontFamily: FONT_D,
          fontSize: { xs: '1.7rem', md: '2.2rem' },
          letterSpacing: '-0.03em', lineHeight: 1.04,
          color: FG, mb: '28px',
        }}>
          {label}
        </Box>

        {/* Rich body text */}
        <Box
          dangerouslySetInnerHTML={{ __html: html }}
          sx={{
            fontFamily: FONT_B, fontSize: '16px', lineHeight: 1.78,
            color: 'rgba(13,12,12,0.72)',
            '& p': { m: 0, mb: '1.1em' },
            '& p:last-child': { mb: 0 },
            '& ul, & ol': { pl: '24px' },
            '& li': { mb: '0.5em' },
            '& h1,& h2,& h3,& h4': {
              fontFamily: FONT_D, letterSpacing: '-0.02em',
              mb: '0.5em', mt: '1.2em', color: FG,
            },
            '& strong': { fontWeight: 600, color: FG },
          }}
        />
      </Box>
    </Box>
  );
}

// ── Pricing card ──────────────────────────────────────────────────────────────
interface PCardProps {
  num: string;
  label: string;
  amount: number;
  deadline: string | null;
  bg: string;
  fg?: string;
  border?: string;
}

function PCard({ num, label, amount, deadline, bg, fg = LIGHT, border }: PCardProps) {
  const isDark = fg === LIGHT;
  return (
    <Box sx={{
      backgroundColor: bg,
      border: border ?? 'none',
      borderRadius: '20px',
      p: { xs: '28px 24px', md: '36px 32px' },
      display: 'flex', flexDirection: 'column',
      minHeight: '210px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ghost number */}
      <Box aria-hidden sx={{
        position: 'absolute', bottom: '-0.14em', right: '-0.06em',
        fontFamily: FONT_D, fontSize: { xs: '6rem', md: '8rem' }, lineHeight: 1,
        color: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(13,12,12,0.08)',
        pointerEvents: 'none', userSelect: 'none',
      }}>
        {num}
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Label */}
        <Box sx={{
          fontFamily: FONT_B, fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: isDark ? 'rgba(245,245,240,0.45)' : 'rgba(13,12,12,0.45)',
        }}>
          {label}
        </Box>

        <Box sx={{ mt: 'auto', pt: '28px' }}>
          {deadline && (
            <Box sx={{
              fontFamily: FONT_B, fontSize: '11px', letterSpacing: '0.02em',
              color: isDark ? 'rgba(245,245,240,0.38)' : 'rgba(13,12,12,0.4)',
              mb: '8px',
            }}>
              hasta {fmtDate(deadline)}
            </Box>
          )}
          <Box sx={{
            fontFamily: FONT_D,
            fontSize: { xs: 'clamp(1.5rem, 4vw, 2.2rem)', md: 'clamp(1.8rem, 2.5vw, 2.6rem)' },
            letterSpacing: '-0.04em', lineHeight: 1,
            color: fg,
          }}>
            {fmt(amount)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── Pricing section (dark full-width) ─────────────────────────────────────────
function PricingSection({ pricing }: { pricing: Pricing }) {
  const isTwo = pricing.paymentSystem === 'SYSTEM_TWO';

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: DARK,
        px: { xs: '28px', md: '48px' },
        pt: '72px', pb: '80px',
      }}
    >
      <Eyebrow light>Pagos &amp; Aranceles</Eyebrow>

      {/* Section headline */}
      <Box sx={{ mb: '60px' }}>
        <Box sx={{
          fontFamily: FONT_D,
          fontSize: { xs: '2rem', sm: '2.4rem', md: '3rem' },
          letterSpacing: '-0.03em', lineHeight: 1.04, color: LIGHT,
        }}>
          Inscribite con tiempo,
        </Box>
        <Box sx={{
          fontFamily: FONT_D,
          fontSize: { xs: '2rem', sm: '2.4rem', md: '3rem' },
          letterSpacing: '-0.03em', lineHeight: 1.04, color: ACCENT,
        }}>
          ahorrá más.
        </Box>
      </Box>

      {/* Inscripción sub-block */}
      <Box sx={{ mb: '32px' }}>
        <Box sx={{
          fontFamily: FONT_B, fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(245,245,240,0.28)', mb: '14px',
        }}>
          Inscripción
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <PCard
            num="01"
            label="Early bird"
            amount={pricing.registrationEarlyAmount}
            deadline={pricing.registrationEarlyDeadline}
            bg={PRIMARY}
          />
          <PCard
            num="02"
            label="Normal"
            amount={pricing.registrationLateAmount}
            deadline={pricing.registrationLateDeadline}
            bg="rgba(245,245,240,0.05)"
            border="1px solid rgba(245,245,240,0.09)"
          />
        </Box>
      </Box>

      {/* Event payment sub-block */}
      <Box>
        <Box sx={{
          fontFamily: FONT_B, fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(245,245,240,0.28)', mb: '14px',
        }}>
          {isTwo ? 'Cuotas del evento' : 'Pago del evento'}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {isTwo ? (
            <>
              {pricing.installment1Amount != null && (
                <PCard
                  num="01"
                  label="Cuota 1"
                  amount={pricing.installment1Amount}
                  deadline={pricing.installment1Deadline}
                  bg={ACCENT}
                  fg={DARK}
                />
              )}
              {pricing.installment2Amount != null && (
                <PCard
                  num="02"
                  label="Cuota 2 — en jornada"
                  amount={pricing.installment2Amount}
                  deadline={null}
                  bg="rgba(245,245,240,0.05)"
                  border="1px solid rgba(245,245,240,0.09)"
                />
              )}
            </>
          ) : (
            <>
              {pricing.eventPaymentEarlyAmount != null && (
                <PCard
                  num="01"
                  label="Anticipado"
                  amount={pricing.eventPaymentEarlyAmount}
                  deadline={pricing.eventPaymentDeadline}
                  bg={ACCENT}
                  fg={DARK}
                />
              )}
              {pricing.eventPaymentAtEventAmount != null && (
                <PCard
                  num="02"
                  label="En jornada"
                  amount={pricing.eventPaymentAtEventAmount}
                  deadline={null}
                  bg="rgba(245,245,240,0.05)"
                  border="1px solid rgba(245,245,240,0.09)"
                />
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Total */}
      {pricing.totalAmount != null && (
        <Box sx={{
          mt: '44px', pt: '36px',
          borderTop: '1px solid rgba(245,245,240,0.1)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap',
        }}>
          <Box>
            <Box sx={{
              fontFamily: FONT_B, fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(245,245,240,0.3)', mb: '6px',
            }}>
              Total estimado (mínimo)
            </Box>
            <Box sx={{ fontFamily: FONT_B, fontSize: '14px', color: 'rgba(245,245,240,0.38)' }}>
              Inscripción + pago del evento
            </Box>
          </Box>
          <Box sx={{
            fontFamily: FONT_D,
            fontSize: { xs: '2.4rem', md: '3.2rem' },
            letterSpacing: '-0.04em', lineHeight: 1, color: ACCENT,
          }}>
            {fmt(pricing.totalAmount)}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function EventDetailContent(props: EventDetailProps) {
  const startDate = format(new Date(props.startDate), "d 'de' MMMM", { locale: es });
  const endDate   = format(new Date(props.endDate), "d 'de' MMMM yyyy", { locale: es });
  const hasContact = props.contactName || props.contactEmail || props.contactPhone;

  return (
    <Box sx={{ backgroundColor: BG, color: FG, minHeight: '100vh' }}>

      {/* ── 1. HEADER ─────────────────────────────────────────────────────── */}
      <Box sx={{
        px: { xs: '28px', md: '48px' },
        pt: '64px', pb: '56px',
        borderBottom: `1px solid ${FAINT}`,
      }}>

        {/* Top row: location pill ←→ back button */}
        <Box sx={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px',
          mb: '32px',
        }}>
          {/* Location pill */}
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: FG, color: BG,
            px: '14px', py: '7px', borderRadius: '100px',
            fontFamily: FONT_B, fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            flexShrink: 1, minWidth: 0, overflow: 'hidden',
          }}>
            <MapPin size={12} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {props.location} · {props.province} · {props.country}
            </Box>
          </Box>

          {/* Back to home button */}
          <Box
            component="a"
            href="/"
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              border: `1px solid ${FAINT}`,
              px: '14px', py: '7px', borderRadius: '100px',
              fontFamily: FONT_B, fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: MUTED, textDecoration: 'none', flexShrink: 0,
              transition: 'border-color 0.22s, color 0.22s',
              '&:hover': { borderColor: FG, color: FG },
            }}
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Inicio
          </Box>
        </Box>

        {/* Title */}
        <Box sx={{
          fontFamily: FONT_D,
          fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem', lg: '3.8rem' },
          letterSpacing: '-0.03em', lineHeight: 1.02, color: FG,
          mb: '40px',
        }}>
          {props.title}
        </Box>

        {/* Date row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', mb: '36px' }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px',
            backgroundColor: `${ACCENT}22`, borderRadius: '50%', flexShrink: 0,
          }}>
            <Calendar size={17} color={ACCENT} strokeWidth={2} />
          </Box>
          <Box>
            <Box sx={{
              fontFamily: FONT_B, fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: ACCENT, mb: '2px',
            }}>
              Fecha
            </Box>
            <Box sx={{ fontFamily: FONT_B, fontSize: '16px', fontWeight: 600, color: FG }}>
              {startDate}
              <Box component="span" sx={{ color: MUTED, mx: '10px' }}>→</Box>
              {endDate}
            </Box>
          </Box>
        </Box>

        {/* Capacity + CTA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {props.capacity && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              border: `1px solid ${FAINT}`,
              px: '16px', py: '9px', borderRadius: '100px',
              fontFamily: FONT_B, fontSize: '13px', fontWeight: 500, color: MUTED,
            }}>
              <Users size={14} strokeWidth={2} />
              {props.capacity.toLocaleString('es-AR')} lugares
            </Box>
          )}
          {props.registrationLink && (
            <Box
              component="a"
              href={props.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                backgroundColor: ACCENT, color: DARK,
                px: '22px', py: '11px', borderRadius: '8px',
                fontFamily: FONT_B, fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background-color 0.22s',
                '&:hover': { backgroundColor: '#a3ff6e' },
              }}
            >
              Inscribirme
              <ExternalLink size={13} strokeWidth={2.5} />
            </Box>
          )}
        </Box>
      </Box>

      {/* ── 2. RICH CONTENT SECTIONS ──────────────────────────────────────── */}
      {[
        { html: props.description,    label: 'Sobre el evento'        },
        { html: props.hostChurch,     label: 'Iglesia anfitriona'     },
        { html: props.activities,     label: 'Actividades'            },
        { html: props.targetAudience, label: '¿A quién va dirigido?'  },
        { html: props.extraInfo,      label: 'Información adicional'  },
      ]
        .filter((b): b is { html: string; label: string } => Boolean(b.html))
        .map((b, i) => (
          <ContentBlock key={b.label} html={b.html} label={b.label} index={i} />
        ))
      }

      {/* ── 3. PRICING ────────────────────────────────────────────────────── */}
      {props.pricing && <PricingSection pricing={props.pricing} />}

      {/* ── 4. CONTACT ────────────────────────────────────────────────────── */}
      {hasContact && (
        <Box
          component="section"
          sx={{
            px: { xs: '28px', md: '48px' },
            py: '56px',
            borderTop: `1px solid ${FAINT}`,
          }}
        >
          <Eyebrow>Contacto</Eyebrow>

          <Box sx={{
            border: `1px solid ${FAINT}`,
            borderRadius: '20px',
            p: { xs: '24px', md: '32px 28px' },
            display: 'flex', flexDirection: 'column', gap: '20px',
          }}>
            {props.contactName && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Box sx={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: FG, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={17} color={BG} strokeWidth={2} />
                </Box>
                <Box>
                  <Box sx={{
                    fontFamily: FONT_B, fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: MUTED, mb: '3px',
                  }}>
                    Nombre
                  </Box>
                  <Box sx={{ fontFamily: FONT_B, fontSize: '15px', fontWeight: 500, color: FG }}>
                    {props.contactName}
                  </Box>
                </Box>
              </Box>
            )}

            {props.contactEmail && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Box sx={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: PRIMARY, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Mail size={17} color={LIGHT} strokeWidth={2} />
                </Box>
                <Box>
                  <Box sx={{
                    fontFamily: FONT_B, fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: MUTED, mb: '3px',
                  }}>
                    Email
                  </Box>
                  <Box
                    component="a"
                    href={`mailto:${props.contactEmail}`}
                    sx={{
                      fontFamily: FONT_B, fontSize: '15px', fontWeight: 500,
                      color: PRIMARY, textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {props.contactEmail}
                  </Box>
                </Box>
              </Box>
            )}

            {props.contactPhone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Box sx={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: ACCENT, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Phone size={17} color={DARK} strokeWidth={2} />
                </Box>
                <Box>
                  <Box sx={{
                    fontFamily: FONT_B, fontSize: '10px', fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: MUTED, mb: '3px',
                  }}>
                    Teléfono
                  </Box>
                  <Box
                    component="a"
                    href={`tel:${props.contactPhone}`}
                    sx={{
                      fontFamily: FONT_B, fontSize: '15px', fontWeight: 500,
                      color: FG, textDecoration: 'none',
                      '&:hover': { color: PRIMARY },
                    }}
                  >
                    {props.contactPhone}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* ── 5. BOTTOM CTA ─────────────────────────────────────────────────── */}
      {props.registrationLink && (
        <Box sx={{
          px: { xs: '28px', md: '48px' },
          pt: hasContact ? '4px' : '56px',
          pb: '80px',
        }}>
          <Box
            component="a"
            href={props.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: DARK, color: LIGHT,
              px: { xs: '28px', md: '40px' },
              py: { xs: '28px', md: '36px' },
              borderRadius: '20px', textDecoration: 'none',
              transition: 'background-color 0.22s, transform 0.2s',
              '&:hover': { backgroundColor: PRIMARY, transform: 'translateY(-3px)' },
            }}
          >
            <Box>
              <Box sx={{
                fontFamily: FONT_B, fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(245,245,240,0.35)', mb: '6px',
              }}>
                Registrarme en este evento
              </Box>
              <Box sx={{
                fontFamily: FONT_D,
                fontSize: { xs: '1.5rem', md: '2rem' },
                letterSpacing: '-0.025em', lineHeight: 1.1, color: LIGHT,
              }}>
                Reservá tu lugar ahora
              </Box>
            </Box>
            <Box sx={{
              fontFamily: FONT_D, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1,
              color: ACCENT, flexShrink: 0, ml: '24px',
            }}>
              →
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
