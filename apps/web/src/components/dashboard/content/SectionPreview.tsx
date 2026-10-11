'use client';

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Eye } from 'lucide-react';
import {
  SECTIONS,
  type SectionKey,
  type HeroContent,
  type VideoContent,
  type AboutContent,
  type AboutPillar,
  type SectionHeaderContent,
  type StatsContent,
  type StatItem,
  type CtaContent,
  type FooterContent,
  type ContactContent,
  type EventDetailSectionContent,
  type SeoContent,
} from '@/lib/content';

// Paleta de la landing — la vista previa usa los mismos colores que el sitio.
const BG      = '#0d0c0c';
const CREAM   = '#f5f5f0';
const PRIMARY = '#2235fd';
const ACCENT  = '#84f649';
const FONT_D  = 'var(--font-archivo-black), "Archivo Black", sans-serif';
const FONT_B  = 'var(--font-roboto-flex), "Roboto Flex", Roboto, sans-serif';

const str = (v: unknown): string => (v == null ? '' : String(v));

// ─────────────────────────────────────────────────────────────────────────────
// Piezas reutilizables
// ─────────────────────────────────────────────────────────────────────────────

function Frame({ bg, children, sx }: { bg: string; children: ReactNode; sx?: object }) {
  return <Box sx={{ bgcolor: bg, p: 2.5, ...sx }}>{children}</Box>;
}

function BrowserBar() {
  return (
    <Box sx={{ bgcolor: '#1c1b1b', px: 1.5, py: 0.9, display: 'flex', alignItems: 'center', gap: 1 }}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <Box key={c} sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c }} />
      ))}
      <Box
        sx={{
          ml: 1, flex: 1, height: 16, borderRadius: '4px', bgcolor: 'rgba(255,255,255,0.08)',
          fontFamily: FONT_B, fontSize: 8, color: 'rgba(255,255,255,0.45)',
          display: 'flex', alignItems: 'center', px: 1,
        }}
      >
        jornadasmisioneras.org
      </Box>
    </Box>
  );
}

function Eyebrow({ text, color }: { text: string; color: string }) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 0.9, mb: 1,
        fontFamily: FONT_B, fontSize: 8, fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase', color,
      }}
    >
      <Box sx={{ width: 14, height: 1.5, bgcolor: color, flexShrink: 0 }} />
      {text || '…'}
    </Box>
  );
}

function Lines({
  lines,
  size = 26,
  nowrap = false,
}: {
  lines: { text: string; color: string }[];
  size?: number;
  nowrap?: boolean;
}) {
  return (
    <>
      {lines
        .filter((l) => l.text.trim().length > 0)
        .map((l, i) => (
          <Box
            key={i}
            sx={{
              fontFamily: FONT_D, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.02em',
              color: l.color,
              whiteSpace: nowrap ? 'nowrap' : 'normal',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}
          >
            {l.text}
          </Box>
        ))}
    </>
  );
}

function Body({ text, color, size = 10, mt = 1.25, maxWidth = 260 }: { text: string; color: string; size?: number; mt?: number; maxWidth?: number | string }) {
  if (!text.trim()) return null;
  return (
    <Box sx={{ mt, fontFamily: FONT_B, fontSize: size, lineHeight: 1.6, color, maxWidth, whiteSpace: 'pre-line' }}>
      {text}
    </Box>
  );
}

function Btn({ label, bg, fg, mt = 1.5 }: { label: string; bg: string; fg: string; mt?: number }) {
  return (
    <Box
      sx={{
        mt, display: 'inline-flex', alignItems: 'center', gap: 0.75,
        bgcolor: bg, color: fg, px: 1.5, py: 0.75,
        fontFamily: FONT_B, fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
      }}
    >
      {label || '…'} <span>→</span>
    </Box>
  );
}

function Thumb({ src, ratio, radius = 8, label = 'Sin imagen' }: { src: string; ratio: string; radius?: number; label?: string }) {
  if (src.trim()) {
    return (
      <Box
        component="img"
        src={src}
        alt=""
        sx={{ width: '100%', aspectRatio: ratio, objectFit: 'cover', borderRadius: `${radius}px`, display: 'block', bgcolor: '#222' }}
      />
    );
  }
  return (
    <Box
      sx={{
        width: '100%', aspectRatio: ratio, borderRadius: `${radius}px`,
        bgcolor: 'rgba(127,127,127,0.18)', border: '1px dashed rgba(127,127,127,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT_B, fontSize: 9, color: 'rgba(127,127,127,0.9)',
      }}
    >
      {label}
    </Box>
  );
}

function Placeholder({ text, dark = false }: { text: string; dark?: boolean }) {
  const line = dark ? 'rgba(245,245,240,0.12)' : 'rgba(13,12,12,0.1)';
  const fg = dark ? 'rgba(245,245,240,0.35)' : 'rgba(13,12,12,0.4)';
  return (
    <Box sx={{ mt: 2 }}>
      {[0, 1, 2].map((i) => (
        <Box key={i} sx={{ height: 10, borderRadius: 1, bgcolor: line, mb: 0.75, width: `${88 - i * 14}%` }} />
      ))}
      <Box sx={{ mt: 1, fontFamily: FONT_B, fontSize: 8.5, fontStyle: 'italic', color: fg }}>{text}</Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vistas previas por sección
// ─────────────────────────────────────────────────────────────────────────────

function HeroPreview({ v }: { v: Partial<HeroContent> }) {
  return (
    <Frame bg={BG}>
      <Eyebrow text={str(v.eyebrow)} color={ACCENT} />
      <Lines lines={[{ text: str(v.titleLine1), color: CREAM }, { text: str(v.titleLine2), color: PRIMARY }]} size={34} nowrap />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Body text={str(v.subtitle)} color="rgba(245,245,240,0.6)" maxWidth={180} />
        <Btn label={str(v.ctaLabel)} bg={ACCENT} fg={BG} />
      </Box>
      <Box sx={{ mt: 2, position: 'relative' }}>
        <Thumb src={str(v.slide1)} ratio="16 / 7" radius={6} label="Foto 1" />
        <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
          {[v.slide1, v.slide2, v.slide3].filter((s) => str(s).trim()).map((_, i) => (
            <Box key={i} sx={{ width: i === 0 ? 14 : 5, height: 4, borderRadius: 2, bgcolor: 'rgba(245,245,240,0.8)' }} />
          ))}
        </Box>
      </Box>
    </Frame>
  );
}

function VideoPreview({ v }: { v: Partial<VideoContent> }) {
  const url = str(v.videoUrl);
  return (
    <Frame bg={BG} sx={{ background: `radial-gradient(ellipse 60% 70% at 65% 50%, rgba(34,53,253,0.35), ${BG} 70%)` }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2, alignItems: 'center' }}>
        <Box>
          <Eyebrow text={str(v.eyebrow)} color={ACCENT} />
          <Lines
            lines={[v.titleLine1, v.titleLine2, v.titleLine3].map((t) => ({ text: str(t), color: '#fff' }))}
            size={22}
            nowrap
          />
          <Body text={str(v.description)} color="rgba(245,245,240,0.5)" size={9} maxWidth={170} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 72, height: 144, borderRadius: '14px', border: '3px solid #2a2a2a',
              bgcolor: '#111', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            {url ? (
              <Box component="video" key={url} src={url} muted autoPlay loop playsInline sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_B, fontSize: 8, color: 'rgba(255,255,255,0.4)', textAlign: 'center', px: 1 }}>
                Sin video
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 0.75, fontFamily: FONT_B, fontSize: 6.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.4)' }}>
            {str(v.hint)}
          </Box>
        </Box>
      </Box>
    </Frame>
  );
}

function AboutPreview({ v }: { v: Partial<AboutContent> }) {
  const pillars = Array.isArray(v.pillars) ? v.pillars : [];
  const words = (Array.isArray(v.tickerWords) ? v.tickerWords : []).map((w) => str(w?.text)).filter(Boolean);
  const accents = [ACCENT, PRIMARY, ACCENT, PRIMARY];
  return (
    <Box>
      <Frame bg={BG}>
        <Lines lines={[{ text: str(v.titleLine1), color: CREAM }, { text: str(v.titleLine2), color: ACCENT }]} size={20} />
        <Body text={str(v.description)} color="rgba(245,245,240,0.4)" size={9} />
        <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
          {Array.from({ length: 4 }, (_, i) => {
            const p: Partial<AboutPillar> = pillars[i] ?? {};
            return (
              <Box key={i} sx={{ borderLeft: i > 0 ? '1px solid rgba(245,245,240,0.08)' : 'none', pl: i > 0 ? 1 : 0 }}>
                <Box sx={{ fontFamily: FONT_B, fontSize: 6.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accents[i] }}>
                  {String(i + 1).padStart(2, '0')} · {str(p.label) || '…'}
                </Box>
                <Box sx={{ fontFamily: FONT_D, fontSize: 13, color: CREAM, my: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {str(p.title) || '…'}
                </Box>
                <Thumb src={str(p.image)} ratio="4 / 3" radius={4} label="Foto" />
              </Box>
            );
          })}
        </Box>
      </Frame>
      <Box sx={{ bgcolor: PRIMARY, px: 2, py: 1, display: 'flex', gap: 1.5, overflow: 'hidden', whiteSpace: 'nowrap' }}>
        {(words.length ? words : ['…']).map((w, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: FONT_B, fontSize: 10, fontWeight: 500, color: CREAM, flexShrink: 0 }}>
            {w}
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: ACCENT }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function HeaderPreview({ v, bottom, placeholder }: { v: Partial<SectionHeaderContent>; bottom: string; placeholder: string }) {
  return (
    <Frame bg={CREAM} sx={{ background: `linear-gradient(to bottom, ${CREAM} 55%, ${bottom} 100%)` }}>
      <Eyebrow text={str(v.eyebrow)} color={PRIMARY} />
      <Lines lines={[{ text: str(v.titleLine1), color: BG }, { text: str(v.titleLine2), color: PRIMARY }]} size={22} />
      <Body text={str(v.description)} color="rgba(13,12,12,0.55)" size={9} />
      <Placeholder text={placeholder} />
      <Box sx={{ mt: 1.5, fontFamily: FONT_B, fontSize: 8, color: 'rgba(13,12,12,0.4)' }}>
        Si no hay nada cargado se muestra: <em>“{str(v.emptyText) || '…'}”</em>
      </Box>
    </Frame>
  );
}

function StatsPreview({ v }: { v: Partial<StatsContent> }) {
  const stats = Array.isArray(v.stats) ? v.stats : [];
  const styles = [
    { bg: PRIMARY, fg: CREAM, label: 'rgba(245,245,240,0.5)' },
    { bg: ACCENT, fg: CREAM, label: 'rgba(13,12,12,0.45)' },
    { bg: BG, fg: CREAM, label: 'rgba(245,245,240,0.4)' },
  ];
  return (
    <Frame bg={CREAM}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
        <Box sx={{ pr: 1 }}>
          <Box sx={{ fontFamily: FONT_D, fontSize: 20, color: PRIMARY, lineHeight: 1 }}>{str(v.title) || '…'}</Box>
          <Box sx={{ mt: 1, fontFamily: FONT_D, fontSize: 9.5, color: BG, lineHeight: 1.25 }}>{str(v.headline)}</Box>
          <Body text={str(v.description)} color="rgba(13,12,12,0.5)" size={8} mt={1} />
          <Box sx={{ mt: 1, width: 18, height: 2, bgcolor: ACCENT }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
          {Array.from({ length: 3 }, (_, i) => {
            const s: Partial<StatItem> = stats[i] ?? {};
            const st = styles[i];
            if (!st) return null;
            return (
              <Box key={i} sx={{ gridColumn: i === 0 ? '1 / -1' : 'auto', bgcolor: st.bg, borderRadius: '6px', p: 1.25, minHeight: i === 0 ? 68 : 58, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ fontFamily: FONT_B, fontSize: 6.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: st.label, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {str(s.label) || '…'}
                </Box>
                <Box sx={{ mt: 'auto', fontFamily: FONT_D, fontSize: i === 0 ? 30 : 24, lineHeight: 0.9, color: st.fg, display: 'flex', alignItems: 'flex-end' }}>
                  {str(s.value) || '0'}
                  {str(s.suffix) && <Box component="span" sx={{ fontSize: '0.45em', color: i === 0 ? ACCENT : 'inherit', ml: 0.25, mb: 0.25 }}>{str(s.suffix)}</Box>}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Frame>
  );
}

function CtaPreview({ v }: { v: Partial<CtaContent> }) {
  return (
    <Frame bg={CREAM}>
      <Box sx={{ width: 28, height: 3, bgcolor: ACCENT, borderRadius: 1, mb: 1.5 }} />
      <Lines lines={[{ text: str(v.titleLine1), color: BG }, { text: str(v.titleLine2), color: PRIMARY }]} size={30} nowrap />
      <Body text={str(v.description)} color="rgba(13,12,12,0.42)" size={9} maxWidth={220} />
      <Box
        sx={{
          mt: 2, bgcolor: BG, color: CREAM, borderRadius: '4px', px: 1.5, py: 1.25,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 240,
          fontFamily: FONT_D, fontSize: 11,
        }}
      >
        {str(v.buttonLabel) || '…'} <span>→</span>
      </Box>
    </Frame>
  );
}

function FooterPreview({ v }: { v: Partial<FooterContent> }) {
  const c = SECTIONS.contact.defaults;
  return (
    <Frame bg={BG}>
      <Lines lines={[{ text: str(v.titleLine1), color: CREAM }, { text: str(v.titleLine2), color: ACCENT }]} size={18} />
      <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(245,245,240,0.08)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, fontFamily: FONT_B, fontSize: 7.5, color: 'rgba(245,245,240,0.6)' }}>
        <Box><Box sx={{ fontSize: 6, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.3)', mb: 0.5 }}>Navegar</Box>Inicio · Nosotros · Sedes · Eventos</Box>
        <Box><Box sx={{ fontSize: 6, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.3)', mb: 0.5 }}>Contacto</Box>{c.email}</Box>
        <Box><Box sx={{ fontSize: 6, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.3)', mb: 0.5 }}>Redes</Box>{c.instagramHandle}</Box>
      </Box>
      <Box sx={{ mt: 2, fontFamily: FONT_D, fontSize: 28, color: 'rgba(245,245,240,0.12)', lineHeight: 1, letterSpacing: '-0.03em' }}>JM</Box>
    </Frame>
  );
}

function ContactPreview({ v }: { v: Partial<ContactContent> }) {
  const rows = [
    { where: 'Menú desplegable', what: `${str(v.email) || '…'}   ·   ${str(v.instagramHandle) || '…'}` },
    { where: 'Botones flotantes del costado', what: `Instagram → ${str(v.instagramUrl) || '…'}` },
    { where: 'Pie de página', what: `${str(v.email) || '…'}   ·   ${str(v.instagramHandle) || '…'}` },
  ];
  return (
    <Frame bg={BG}>
      {rows.map((r) => (
        <Box key={r.where} sx={{ mb: 1.5 }}>
          <Box sx={{ fontFamily: FONT_B, fontSize: 6.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, mb: 0.4 }}>{r.where}</Box>
          <Box sx={{ fontFamily: FONT_B, fontSize: 9.5, color: 'rgba(245,245,240,0.75)', whiteSpace: 'pre', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.what}</Box>
        </Box>
      ))}
      <Box sx={{ mt: 1, display: 'flex', gap: 0.75 }}>
        {['IG', '@'].map((t) => (
          <Box key={t} sx={{ width: 22, height: 22, borderRadius: '50%', bgcolor: PRIMARY, color: CREAM, fontFamily: FONT_B, fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t}</Box>
        ))}
      </Box>
    </Frame>
  );
}

function EventDetailPreview({ v }: { v: Partial<EventDetailSectionContent> }) {
  return (
    <Box>
      <Frame bg={BG}>
        <Eyebrow text={str(v.pricingEyebrow)} color="rgba(245,245,240,0.4)" />
        <Lines lines={[{ text: str(v.pricingTitleLine1), color: CREAM }, { text: str(v.pricingTitleLine2), color: ACCENT }]} size={20} />
        <Box sx={{ mt: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
          {[
            { label: 'Hasta 2 meses antes', amount: '$150.000', bg: PRIMARY, border: 'none' },
            { label: 'Hasta 1 mes antes', amount: '$165.000', bg: 'rgba(245,245,240,0.05)', border: '1px solid rgba(245,245,240,0.09)' },
          ].map((c) => (
            <Box key={c.label} sx={{ bgcolor: c.bg, border: c.border, borderRadius: '6px', p: 1.25, minHeight: 56, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ fontFamily: FONT_B, fontSize: 6, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.45)' }}>{c.label}</Box>
              <Box sx={{ mt: 'auto', fontFamily: FONT_D, fontSize: 15, color: CREAM, letterSpacing: '-0.03em' }}>{c.amount}</Box>
            </Box>
          ))}
        </Box>
        <Body text={str(v.pricingNote)} color="rgba(245,245,240,0.38)" size={8} />
      </Frame>
      <Frame bg={CREAM}>
        <Box sx={{ bgcolor: BG, borderRadius: '6px', p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ fontFamily: FONT_B, fontSize: 6.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,240,0.35)' }}>{str(v.ctaEyebrow) || '…'}</Box>
            <Box sx={{ fontFamily: FONT_D, fontSize: 13, color: CREAM, mt: 0.4 }}>{str(v.ctaTitle) || '…'}</Box>
          </Box>
          <Box sx={{ fontFamily: FONT_D, fontSize: 18, color: ACCENT }}>→</Box>
        </Box>
        <Box sx={{ mt: 1, fontFamily: FONT_B, fontSize: 8, color: 'rgba(13,12,12,0.4)' }}>Los montos son de ejemplo: cada evento muestra los suyos.</Box>
      </Frame>
    </Box>
  );
}

function SeoPreview({ v }: { v: Partial<SeoContent> }) {
  const title = str(v.siteTitle) || '…';
  return (
    <Frame bg="#ffffff">
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: '#e8eaed', borderRadius: '8px 8px 0 0', px: 1.25, py: 0.6, fontFamily: FONT_B, fontSize: 9, color: '#202124', maxWidth: '100%' }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: PRIMARY, flexShrink: 0 }} />
        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Box>
      </Box>
      <Box sx={{ borderTop: '1px solid #e8eaed', pt: 2, mt: 0 }}>
        <Box sx={{ fontFamily: FONT_B, fontSize: 8.5, color: '#202124' }}>jornadasmisioneras.org</Box>
        <Box sx={{ fontFamily: FONT_B, fontSize: 14, color: '#1a0dab', mt: 0.25, lineHeight: 1.3 }}>{title}</Box>
        <Box sx={{ fontFamily: FONT_B, fontSize: 10, color: '#4d5156', mt: 0.5, lineHeight: 1.5 }}>{str(v.siteDescription) || '…'}</Box>
      </Box>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function renderPreview(key: SectionKey, values: Record<string, unknown>): ReactNode {
  switch (key) {
    case 'hero':         return <HeroPreview v={values as Partial<HeroContent>} />;
    case 'video':        return <VideoPreview v={values as Partial<VideoContent>} />;
    case 'about':        return <AboutPreview v={values as Partial<AboutContent>} />;
    case 'locations':    return <HeaderPreview v={values as Partial<SectionHeaderContent>} bottom={CREAM} placeholder="Acá aparece la lista de sedes cargadas en “Localidades”." />;
    case 'events':       return <HeaderPreview v={values as Partial<SectionHeaderContent>} bottom="#8a96f8" placeholder="Acá aparecen los eventos cargados en “Eventos”." />;
    case 'stats':        return <StatsPreview v={values as Partial<StatsContent>} />;
    case 'testimonials': return <HeaderPreview v={values as Partial<SectionHeaderContent>} bottom={ACCENT} placeholder="Acá pasan los testimonios cargados en “Testimonios”." />;
    case 'cta':          return <CtaPreview v={values as Partial<CtaContent>} />;
    case 'footer':       return <FooterPreview v={values as Partial<FooterContent>} />;
    case 'eventDetail':  return <EventDetailPreview v={values as Partial<EventDetailSectionContent>} />;
    case 'contact':      return <ContactPreview v={values as Partial<ContactContent>} />;
    case 'seo':          return <SeoPreview v={values as Partial<SeoContent>} />;
  }
}

interface Props {
  sectionKey: SectionKey;
  values: Record<string, unknown>;
}

/** Vista previa aproximada y en vivo de la sección, con los colores y tipografías del sitio. */
export function SectionPreview({ sectionKey, values }: Props) {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Eye size={15} style={{ opacity: 0.6 }} />
        <Typography variant="overline" fontWeight={700} color="text.secondary" lineHeight={1}>
          Vista previa aproximada
        </Typography>
      </Box>
      <Box sx={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid', borderColor: 'divider', boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}>
        <BrowserBar />
        {renderPreview(sectionKey, values)}
      </Box>
      <Typography variant="caption" color="text.disabled" display="block" mt={1}>
        Muestra cómo quedan los textos con los colores del sitio. Los tamaños y animaciones reales dependen de la pantalla.
      </Typography>
    </Box>
  );
}
