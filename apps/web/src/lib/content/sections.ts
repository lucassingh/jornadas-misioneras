import type { FieldSpec, LeafFieldSpec, SectionDefinition, SectionKey } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos del contenido de cada sección
// (lo que reciben los componentes de la landing como prop `content`)
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaLabel: string;
  slide1: string;
  slide2: string;
  slide3: string;
}

export interface VideoContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  description: string;
  videoUrl: string;
  hint: string;
}

export interface AboutPillar {
  label: string;
  title: string;
  body: string;
  image: string;
}

export interface AboutContent {
  titleLine1: string;
  titleLine2: string;
  description: string;
  pillars: AboutPillar[];
  tickerWords: { text: string }[];
}

/** Encabezado de las secciones cuyo contenido es dinámico (sedes, eventos, testimonios). */
export interface SectionHeaderContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  emptyText: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface StatsContent {
  title: string;
  backgroundText: string;
  headline: string;
  description: string;
  stats: StatItem[];
}

export interface CtaContent {
  titleLine1: string;
  titleLine2: string;
  description: string;
  buttonLabel: string;
}

export interface FooterContent {
  titleLine1: string;
  titleLine2: string;
}

export interface ContactContent {
  email: string;
  instagramHandle: string;
  instagramUrl: string;
}

export interface EventDetailSectionContent {
  pricingEyebrow: string;
  pricingTitleLine1: string;
  pricingTitleLine2: string;
  pricingNote: string;
  ctaEyebrow: string;
  ctaTitle: string;
}

export interface SeoContent {
  siteTitle: string;
  siteDescription: string;
}

export interface SiteContent {
  hero: HeroContent;
  video: VideoContent;
  about: AboutContent;
  locations: SectionHeaderContent;
  events: SectionHeaderContent;
  stats: StatsContent;
  testimonials: SectionHeaderContent;
  cta: CtaContent;
  footer: FooterContent;
  eventDetail: EventDetailSectionContent;
  contact: ContactContent;
  seo: SeoContent;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers para declarar campos sin repetir boilerplate
// ─────────────────────────────────────────────────────────────────────────────

const text = (key: string, label: string, maxLength: number, help?: string, optional = false): LeafFieldSpec =>
  ({ kind: 'text', key, label, maxLength, help, optional });

const textarea = (key: string, label: string, maxLength: number, help?: string, optional = false): LeafFieldSpec =>
  ({ kind: 'textarea', key, label, maxLength, help, optional });

const image = (key: string, label: string, help?: string, optional = false): LeafFieldSpec =>
  ({ kind: 'image', key, label, help, optional });

const ONE_LINE_HELP = (max: number) =>
  `Máximo ${max} caracteres: va en letras gigantes y tiene que entrar en una sola línea, también en el celular.`;

/** Encabezado estándar (ojal + título en 2 líneas + bajada + texto de vacío). */
const sectionHeaderFields = (what: string, whereLoaded: string, line2Color: string): FieldSpec[] => [
  text('eyebrow', 'Texto chico de arriba', 20, 'Palabra en mayúsculas chiquitas sobre el título. Máx. 20 caracteres.'),
  text('titleLine1', 'Título — línea 1', 30, 'Máx. 30 caracteres. Si es más largo, baja a dos renglones en el celular.'),
  text('titleLine2', `Título — línea 2 (${line2Color})`, 30, 'Máx. 30 caracteres.'),
  textarea('description', 'Frase debajo del título', 160, 'Una o dos oraciones. Máx. 160 caracteres.'),
  text('emptyText', `Mensaje cuando no hay ${what}`, 60, `Se muestra solo si todavía no hay ${what} cargados en ${whereLoaded}. Máx. 60 caracteres.`),
];

// ─────────────────────────────────────────────────────────────────────────────
// Registro de secciones
// Orden = orden en que aparecen al hacer scroll en la página principal,
// después la página de evento y por último los datos generales.
// ─────────────────────────────────────────────────────────────────────────────

export const SECTIONS: { [K in SectionKey]: SectionDefinition<SiteContent[K]> } = {
  hero: {
    key: 'hero',
    navLabel: 'Portada',
    label: 'Portada (primera pantalla)',
    description:
      'Lo primero que ve cualquiera que entra al sitio: el título gigante, la frase, el botón verde y las tres fotos que rotan.',
    siteUrl: '/',
    area: 'landing',
    fields: [
      text('eyebrow', 'Texto chico de arriba (verde)', 30, 'Palabra en mayúsculas chiquitas, arriba del título. Máx. 30 caracteres.'),
      text('titleLine1', 'Título — línea 1 (blanca)', 14, ONE_LINE_HELP(14)),
      text('titleLine2', 'Título — línea 2 (azul)', 14, ONE_LINE_HELP(14)),
      textarea('subtitle', 'Frase al lado del botón', 110, 'Una o dos líneas cortas. Máx. 110 caracteres. Podés usar Enter para elegir dónde corta la línea.'),
      text('ctaLabel', 'Texto del botón verde', 18, 'Máx. 18 caracteres. El botón lleva a la lista de eventos.'),
      image('slide1', 'Foto 1', 'Foto apaisada (horizontal), idealmente de 1600 px de ancho o más. Las fotos rotan solas cada 6 segundos.'),
      image('slide2', 'Foto 2', 'Opcional. Si la dejás vacía, rotan solo las que haya.', true),
      image('slide3', 'Foto 3', 'Opcional. Si la dejás vacía, rotan solo las que haya.', true),
    ],
    defaults: {
      eyebrow: 'Jornadas Misioneras',
      titleLine1: 'El impacto',
      titleLine2: 'de sumarte',
      subtitle: 'Viví una experiencia que transforma tu fe\ny tu mirada sobre el servicio.',
      ctaLabel: 'Inscribite',
      slide1: '/hero/img-1.webp',
      slide2: '/hero/img-2.webp',
      slide3: '/hero/img-3.webp',
    },
  },

  video: {
    key: 'video',
    navLabel: 'Video',
    label: 'Video: ¿Qué son las Jornadas?',
    description:
      'Segunda pantalla de la página principal: el texto de la izquierda y el video vertical que se ve adentro del teléfono.',
    siteUrl: '/#video',
    area: 'landing',
    fields: [
      text('eyebrow', 'Texto chico de arriba (verde)', 30, 'Máx. 30 caracteres.'),
      text('titleLine1', 'Título — línea 1', 14, ONE_LINE_HELP(14)),
      text('titleLine2', 'Título — línea 2', 14, ONE_LINE_HELP(14)),
      text('titleLine3', 'Título — línea 3', 14, 'Opcional. Máx. 14 caracteres. Si la dejás vacía, el título queda en dos líneas.', true),
      textarea('description', 'Texto debajo del título', 180, 'Máx. 180 caracteres.'),
      {
        kind: 'video',
        key: 'videoUrl',
        label: 'Video',
        help:
          'Video VERTICAL (formato reel, 9:16, como los de Instagram): se ve adentro de un teléfono dibujado, así que uno horizontal quedaría recortado. MP4, máximo 100 MB. Arranca sin sonido hasta que la persona lo toca.',
      },
      text('hint', 'Aviso debajo del teléfono', 50, 'Texto chiquito que se ve mientras el video está en silencio. Máx. 50 caracteres.'),
    ],
    defaults: {
      eyebrow: 'Conocé la experiencia',
      titleLine1: '¿Qué son',
      titleLine2: 'las Jornadas',
      titleLine3: 'Misioneras?',
      description: 'Un recorrido de fe, comunidad y servicio contado por quienes lo viven. Dale play y descubrí qué pasa en cada Jornada.',
      videoUrl: '/about-video/video.mp4',
      hint: 'Tocá el video para activar el sonido',
    },
  },

  about: {
    key: 'about',
    navLabel: 'Nosotros',
    label: 'Nosotros (misión, método, visión, valores)',
    description:
      'La sección “Nosotros”: el título, la frase de introducción, los cuatro paneles que se recorren de costado y la cinta azul con frases.',
    siteUrl: '/#nosotros',
    area: 'landing',
    fields: [
      text('titleLine1', 'Título — línea 1 (blanca)', 30, 'Máx. 30 caracteres. Si es más largo, baja a dos renglones en el celular.'),
      text('titleLine2', 'Título — línea 2 (verde)', 30, 'Máx. 30 caracteres.'),
      textarea('description', 'Frase de introducción', 160, 'Máx. 160 caracteres.'),
      {
        kind: 'list',
        key: 'pillars',
        label: 'Paneles',
        length: 4,
        itemLabels: ['Panel 1 (acento verde)', 'Panel 2 (acento azul)', 'Panel 3 (acento verde)', 'Panel 4 (acento azul)'],
        help: 'Los cuatro paneles que se recorren de costado al hacer scroll.',
        fields: [
          text('label', 'Etiqueta chica', 12, 'Palabra en mayúsculas chiquitas arriba del título, ej. “Misión”. Máx. 12 caracteres.'),
          text('title', 'Título gigante', 10, 'Una sola palabra en letras enormes. Máx. 10 caracteres.'),
          textarea('body', 'Texto del panel', 240, 'Máx. 240 caracteres.'),
          image('image', 'Foto del panel', 'Ocupa la mitad derecha en computadora y el fondo en celular. Se recorta al centro.'),
        ],
      },
      {
        kind: 'list',
        key: 'tickerWords',
        label: 'Cinta azul',
        length: 5,
        itemLabels: ['Frase 1', 'Frase 2', 'Frase 3', 'Frase 4', 'Frase 5'],
        help: 'Las frases cortas de la cinta azul que pasa de costado, debajo de los paneles. Se repiten en loop.',
        fields: [text('text', 'Frase', 20, 'Máx. 20 caracteres.')],
      },
    ],
    defaults: {
      titleLine1: 'Más que un viaje,',
      titleLine2: 'una misión compartida.',
      description: 'Transformamos realidades a través del servicio concreto y el encuentro humano.',
      pillars: [
        {
          label: 'Misión',
          title: 'Misión',
          body: 'Movilizamos voluntarios a comunidades necesitadas para realizar acciones de servicio y apoyo, brindando ayuda tangible y compartiendo el mensaje de salvación.',
          image: '/who/img-1.jpg',
        },
        {
          label: 'Método',
          title: 'Método',
          body: 'Actuamos junto a las comunidades locales, escuchando sus necesidades y uniendo fuerzas para proyectos concretos de servicio y evangelización.',
          image: '/who/img-2.jpg',
        },
        {
          label: 'Visión',
          title: 'Visión',
          body: 'Soñamos con una red de jóvenes y familias comprometidas que trabajan codo a codo para transformar realidades mediante el servicio y la Palabra de Dios.',
          image: '/who/img-3.jpg',
        },
        {
          label: 'Valores',
          title: 'Valores',
          body: 'Guiamos nuestro trabajo por el amor al prójimo, la compasión puesta en acción y la convicción de que el cambio real se logra en comunidad y a través de la fe en Jesús.',
          image: '/who/img-4.jpg',
        },
      ],
      tickerWords: [
        { text: '+25 años' },
        { text: 'Comunidad activa' },
        { text: 'Fe + Acción' },
        { text: 'Colaboración' },
        { text: 'Resiliencia' },
      ],
    },
  },

  locations: {
    key: 'locations',
    navLabel: 'Sedes',
    label: 'Sedes (títulos de la sección)',
    description:
      'El encabezado de la lista de sedes. Las sedes en sí (nombre, descripción) se cargan en “Localidades”.',
    siteUrl: '/#sedes',
    area: 'landing',
    fields: sectionHeaderFields('sedes', '“Localidades”', 'azul'),
    defaults: {
      eyebrow: 'Sedes',
      titleLine1: 'Donde la misión',
      titleLine2: 'cobra vida.',
      description: 'Descubrí dónde podés sumarte y vivir la experiencia de servir.',
      emptyText: 'Próximamente se anunciarán las sedes.',
    },
  },

  events: {
    key: 'events',
    navLabel: 'Eventos',
    label: 'Eventos (títulos de la sección)',
    description: 'El encabezado de la sección de eventos. Los eventos en sí se cargan en “Eventos”.',
    siteUrl: '/#eventos',
    area: 'landing',
    fields: sectionHeaderFields('eventos', '“Eventos”', 'azul'),
    defaults: {
      eyebrow: 'Eventos',
      titleLine1: 'Próximos eventos',
      titleLine2: 'misioneros.',
      description: 'Encontrá el evento más cercano y sumate a la misión.',
      emptyText: 'Próximamente se anunciarán los eventos.',
    },
  },

  stats: {
    key: 'stats',
    navLabel: 'Datos del año',
    label: 'Datos del año (los tres números)',
    description:
      'El bloque claro con los tres números grandes (jóvenes, localidades, provincias). Conviene actualizarlo cada año.',
    siteUrl: '/#stats',
    area: 'landing',
    fields: [
      text('title', 'Título azul', 16, 'Ej. “Datos 2025”. Máx. 16 caracteres. Actualizalo cada año.'),
      text('backgroundText', 'Número de fondo', 4, 'Número gigante decorativo, casi transparente, detrás del texto. Normalmente el mismo año. Máx. 4 caracteres.'),
      textarea('headline', 'Frase destacada', 90, 'Va en negrita debajo del título. Máx. 90 caracteres.'),
      textarea('description', 'Texto explicativo', 220, 'Máx. 220 caracteres.'),
      {
        kind: 'list',
        key: 'stats',
        label: 'Tarjetas',
        length: 3,
        itemLabels: ['Tarjeta 1 (azul, la más grande)', 'Tarjeta 2 (verde)', 'Tarjeta 3 (negra)'],
        help: 'Las tres tarjetas con números. El número se anima contando desde cero cuando aparece en pantalla.',
        fields: [
          { kind: 'number', key: 'value', label: 'Número', min: 0, max: 99_999, help: 'Solo el número, sin puntos ni signos.' },
          text('suffix', 'Signo después del número', 2, 'Opcional, ej. “+”. Dejalo vacío si no va.', true),
          text('label', 'Qué mide', 32, 'En mayúsculas chiquitas arriba de la tarjeta. Ej. “Jóvenes movilizados”. Máx. 32 caracteres.'),
          textarea('description', 'Descripción', 140, 'Máx. 140 caracteres.'),
        ],
      },
    ],
    defaults: {
      title: 'Datos 2025',
      backgroundText: '2025',
      headline: 'El año pasado transformamos comunidades de punta a punta del país.',
      description:
        'No son solo estadísticas — son jóvenes que eligieron servir, provincias que recibieron esperanza y localidades que se transformaron para siempre.',
      stats: [
        {
          value: 300,
          suffix: '+',
          label: 'Jóvenes movilizados',
          description: 'Jóvenes que eligieron salir de su zona de confort para servir y transformar comunidades a lo largo del país.',
        },
        {
          value: 6,
          suffix: '',
          label: 'Localidades alcanzadas',
          description: 'De norte a sur, comunidades que recibieron esperanza y servicio concreto.',
        },
        {
          value: 4,
          suffix: '',
          label: 'Provincias de Argentina',
          description: 'Cuatro provincias, una sola misión: llevar esperanza a cada rincón del país.',
        },
      ],
    },
  },

  testimonials: {
    key: 'testimonials',
    navLabel: 'Testimonios',
    label: 'Testimonios (títulos de la sección)',
    description:
      'El encabezado de la sección de testimonios, en la página principal y en cada evento. Los testimonios en sí se cargan en “Testimonios”.',
    siteUrl: '/#testimonios',
    area: 'landing',
    fields: sectionHeaderFields('testimonios', '“Testimonios”', 'azul'),
    defaults: {
      eyebrow: 'Testimonios',
      titleLine1: 'Lo que dicen',
      titleLine2: 'los que vivieron.',
      description: 'Experiencias reales de jóvenes que eligieron servir.',
      emptyText: 'Todavía no hay testimonios para mostrar.',
    },
  },

  cta: {
    key: 'cta',
    navLabel: 'Cierre',
    label: 'Cierre: “Sumate a la misión”',
    description:
      'El último bloque de la página principal (también aparece al final de cada evento): la invitación final con el botón grande.',
    siteUrl: '/#cta',
    area: 'landing',
    fields: [
      text('titleLine1', 'Título — línea 1 (negra)', 12, ONE_LINE_HELP(12)),
      text('titleLine2', 'Título — línea 2 (azul)', 12, ONE_LINE_HELP(12)),
      textarea('description', 'Texto de la invitación', 160, 'Máx. 160 caracteres.'),
      text('buttonLabel', 'Texto del botón', 26, 'Máx. 26 caracteres. El botón lleva a la lista de eventos.'),
    ],
    defaults: {
      titleLine1: 'Sumate a',
      titleLine2: 'la misión.',
      description: 'Miles de jóvenes ya lo vivieron. Encontrá el evento más cercano y dale un nuevo sentido a tu tiempo.',
      buttonLabel: 'Ver próximos eventos',
    },
  },

  footer: {
    key: 'footer',
    navLabel: 'Pie de página',
    label: 'Pie de página',
    description: 'La frase grande del pie de página. Los links de navegación y el logo son fijos; el email y el Instagram se cambian en “Contacto y redes”.',
    siteUrl: '/#footer',
    area: 'landing',
    fields: [
      text('titleLine1', 'Frase — línea 1 (blanca)', 30, 'Máx. 30 caracteres.'),
      text('titleLine2', 'Frase — línea 2 (verde)', 30, 'Máx. 30 caracteres.'),
    ],
    defaults: {
      titleLine1: 'Conectando fe y misión',
      titleLine2: 'en toda Latinoamérica.',
    },
  },

  eventDetail: {
    key: 'eventDetail',
    navLabel: 'Página de evento',
    label: 'Página de cada evento (textos fijos)',
    description:
      'Textos que se repiten en la página de todos los eventos: el título del bloque de precios y la invitación final. Los datos de cada evento se cargan en “Eventos”.',
    siteUrl: '/#eventos',
    area: 'event',
    fields: [
      text('pricingEyebrow', 'Precios — texto chico de arriba', 30, 'Máx. 30 caracteres.'),
      text('pricingTitleLine1', 'Precios — título línea 1 (blanca)', 30, 'Máx. 30 caracteres.'),
      text('pricingTitleLine2', 'Precios — título línea 2 (verde)', 30, 'Máx. 30 caracteres.'),
      textarea('pricingNote', 'Precios — aclaración', 160, 'Texto chico debajo de los precios. Opcional. Máx. 160 caracteres.', true),
      text('ctaEyebrow', 'Invitación final — texto chico', 40, 'Máx. 40 caracteres.'),
      text('ctaTitle', 'Invitación final — título', 40, 'Máx. 40 caracteres.'),
    ],
    defaults: {
      pricingEyebrow: 'Pagos & Aranceles',
      pricingTitleLine1: 'Inscribite con tiempo,',
      pricingTitleLine2: 'ahorrá más.',
      pricingNote: 'El precio depende de la fecha en que hacés el pago.',
      ctaEyebrow: 'Registrarme en este evento',
      ctaTitle: 'Reservá tu lugar ahora',
    },
  },

  contact: {
    key: 'contact',
    navLabel: 'Contacto y redes',
    label: 'Contacto y redes',
    description: 'El email y el Instagram que aparecen en el menú, en los botones flotantes del costado y en el pie de página.',
    siteUrl: '/#footer',
    area: 'global',
    fields: [
      { kind: 'email', key: 'email', label: 'Email de contacto', help: 'Aparece en el menú, en los botones flotantes del costado y en el pie de página.' },
      text('instagramHandle', 'Usuario de Instagram', 40, 'Con el @ adelante. Es el texto que se muestra. Máx. 40 caracteres.'),
      { kind: 'url', key: 'instagramUrl', label: 'Link al perfil de Instagram', help: 'Link completo (empieza con https://).' },
    ],
    defaults: {
      email: 'jornadasmisionerasnacionales@gmail.com',
      instagramHandle: '@jornadasmisionerascc',
      instagramUrl: 'https://www.instagram.com/jornadasmisionerascc',
    },
  },

  seo: {
    key: 'seo',
    navLabel: 'Google y pestaña',
    label: 'Nombre del sitio y descripción (Google)',
    description: 'Cómo se presenta el sitio en los resultados de Google y en la pestaña del navegador.',
    siteUrl: '/',
    area: 'global',
    fields: [
      text('siteTitle', 'Nombre del sitio', 60, 'Aparece en la pestaña del navegador y como título en Google. Máx. 60 caracteres.'),
      textarea('siteDescription', 'Descripción para Google', 160, 'Una o dos frases que Google muestra debajo del título. Máx. 160 caracteres.'),
    ],
    defaults: {
      siteTitle: 'Jornadas Misioneras',
      siteDescription:
        'Viví una experiencia que transforma tu fe y tu mirada sobre el servicio. Encontrá la próxima Jornada Misionera cerca tuyo.',
    },
  },
};

/** Orden de navegación: scroll de la página principal → página de evento → datos generales. */
export const SECTION_ORDER: SectionKey[] = [
  'hero',
  'video',
  'about',
  'locations',
  'events',
  'stats',
  'testimonials',
  'cta',
  'footer',
  'eventDetail',
  'contact',
  'seo',
];

export const SECTION_AREA_LABELS: Record<SectionDefinition<unknown>['area'], string> = {
  landing: 'Página principal (en orden de arriba hacia abajo)',
  event: 'Página de cada evento',
  global: 'Datos generales del sitio',
};
