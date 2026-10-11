/**
 * TODO el texto de TODOS los tours vive acá — un solo lugar para editar
 * copy sin tocar la lógica de pasos/targets de cada `definitions/*.ts`.
 */

// ── Shell (navbar + aside) — reusado por cualquier tour de pantalla del dashboard ──

export const shellContent = {
  navbar: {
    guideButton: {
      title: 'Guía de la app',
      body: 'Hacé clic acá cuando quieras volver a ver este recorrido, o para saltar directo a una sección puntual.',
    },
    themeToggle: {
      title: 'Modo claro / oscuro',
      body: 'Cambiá el tema de todo el panel según prefieras.',
    },
    account: {
      title: 'Tu cuenta',
      body: 'Tu nombre y correo. Hacé clic para ver tu perfil o cerrar sesión.',
    },
  },
  /** Cuerpo por defecto para un ítem del aside que no tiene entrada propia acá abajo. */
  asideItemGenericBody: 'Una sección más del panel administrativo.',
  /** href del ítem del aside → texto de su paso. */
  asideItems: {
    '/dashboard': 'Resumen general: cuántos eventos hay, cuáles vienen y cómo se reparten por país.',
    '/dashboard/events': 'Creá, editá y administrá los eventos de las Jornadas Misioneras — lo más importante del panel.',
    '/dashboard/testimonials': 'Cargá los testimonios que después se muestran en la landing, de quienes ya vivieron una Jornada.',
    '/dashboard/countries': 'Administrá los países disponibles para asociar a un evento.',
    '/dashboard/provinces': 'Administrá las provincias, agrupadas por país.',
    '/dashboard/locations': 'Administrá las localidades (ciudades) donde se realizan los eventos.',
    '/dashboard/content': 'Editá los textos, fotos y el video de la landing sin tocar código — cada sección del sitio tiene su propia pantalla.',
  } as Record<string, string>,
};

// ── Tour: Dashboard (home) ──

export const dashboardHomeContent = {
  kpis: {
    events: { title: 'Cantidad de eventos', body: 'El total de tus eventos — o de todos los eventos de la plataforma si sos administrador.' },
    month: { title: 'Eventos este mes', body: 'Cuántos de esos eventos arrancan dentro del mes actual.' },
    countries: { title: 'Países', body: 'Cuántos países hay cargados, disponibles para asociar a un evento.' },
    locations: { title: 'Localidades', body: 'Cuántas localidades hay cargadas, donde se pueden realizar eventos.' },
  },
  panels: {
    upcoming: { title: 'Próximos eventos', body: 'Los próximos eventos a realizarse, ordenados por fecha, con cuántos días faltan para cada uno.' },
    byCountry: { title: 'Eventos por país', body: 'Cómo se reparten los eventos entre los distintos países. Solo lo ve un administrador.' },
  },
  groupLabels: {
    'shell.navbar': 'Barra superior',
    'shell.aside': 'Menú lateral',
    'dashboard.kpis': 'Indicadores (KPIs)',
    'dashboard.panels': 'Paneles del dashboard',
  },
};

// ── Tour: Crear / editar evento (stepper de 7 pasos) ──

export const eventFormContent = {
  steps: [
    {
      title: 'Datos básicos',
      body: 'Cargá el título del evento y hasta dos imágenes (principal y secundaria opcional). Son lo primero que ve alguien que entra a la landing.',
    },
    {
      title: 'Fechas',
      body: 'Elegí la fecha de inicio y de fin. La cantidad de días del evento se calcula sola.',
    },
    {
      title: 'Ubicación',
      body: 'País, provincia y localidad — cada selector depende del anterior. Si el país es Argentina, primero podés filtrar por región para encontrar la provincia más rápido.',
    },
    {
      title: 'Sobre el evento',
      body: 'Descripción, iglesia anfitriona, actividades, información extra y a quiénes está dirigido — con un editor de texto enriquecido (títulos, negrita, listas). También cupos disponibles y el link de inscripción.',
    },
    {
      title: 'Contacto',
      body: 'Nombre, email y WhatsApp de quien organiza, para que los asistentes puedan comunicarse.',
    },
    {
      title: 'Precio del evento',
      body: 'Marcá si el evento tiene costo. Si tiene, cargás dos montos: uno si se paga hasta dos meses antes del evento y otro, un poco más alto, si se paga hasta un mes antes. Las fechas límite se calculan solas a partir de la fecha de inicio.',
    },
    {
      title: 'Revisión',
      body: 'Un resumen de todo lo cargado, organizado por sección, con un botón para volver directo a editar cualquier paso desde acá. Es el último paso antes de crear o actualizar el evento.',
    },
  ],
  groupLabels: {
    'eventForm.step0': 'Datos básicos',
    'eventForm.step1': 'Fechas',
    'eventForm.step2': 'Ubicación',
    'eventForm.step3': 'Sobre el evento',
    'eventForm.step4': 'Contacto',
    'eventForm.step5': 'Precio',
    'eventForm.step6': 'Revisión',
  },
};

// ── Tours: Contenido del sitio (CMS de la landing) ──

export const contentOverviewContent = {
  pageId: 'content',
  overview: {
    title: 'Contenido del sitio',
    body: 'Desde acá se editan los textos, fotos y el video de la landing sin tocar código. Cada tarjeta es una sección del sitio, en el mismo orden en que aparece al hacer scroll.',
  },
  list: {
    title: 'Las secciones',
    body: 'Entrá a una sección para cambiar sus textos o imágenes. Cada tarjeta dice si tiene cambios propios o si sigue con el texto original, y cuándo se editó por última vez.',
  },
  groupLabels: {
    'content.overview': 'Encabezado',
    'content.list': 'Secciones del sitio',
  },
};

export const contentEditorContent = {
  form: {
    title: 'Los campos',
    body: 'Cada campo explica dónde se ve en el sitio y cuántos caracteres admite. Si te pasás del límite, se marca en rojo: es para que el texto no rompa el diseño.',
  },
  preview: {
    title: 'Vista previa',
    body: 'A medida que escribís, la vista previa cambia. Es aproximada: muestra cómo quedan los textos, no el sitio pixel por pixel.',
  },
  actions: {
    title: 'Guardar o restaurar',
    body: '“Guardar cambios” publica al instante en el sitio. “Restaurar original” vuelve a los textos con los que se lanzó el sitio.',
  },
  groupLabels: {
    'contentEditor.form': 'Campos',
    'contentEditor.preview': 'Vista previa',
    'contentEditor.actions': 'Guardar / restaurar',
  },
};

// ── Tours: listados simples (Jumbotron + tabla) ──
// Mismo patrón en las 5 pantallas: "overview" (Jumbotron + botón "Nuevo X")
// y "table" (qué muestra cada columna y qué hacen las acciones de fila).

export const eventsListContent = {
  pageId: 'eventsList',
  overview: {
    title: 'Listado de eventos',
    body: 'El listado central de eventos. Si sos administrador ves todos; si no, solo los que vos creaste. "Nuevo Evento" te lleva al asistente de 7 pasos.',
  },
  table: {
    title: 'La tabla',
    body: 'Cada fila muestra el evento, su ubicación y fechas. Las acciones dejan ver el detalle, duplicarlo para crear uno parecido, editarlo (el mismo asistente de 7 pasos) o eliminarlo.',
  },
};

export const testimonialsListContent = {
  pageId: 'testimonials',
  overview: {
    title: 'Testimonios',
    body: 'Gestioná los testimonios que se muestran en la landing. "Nuevo Testimonio" abre el formulario para cargar uno, con foto opcional.',
  },
  table: {
    title: 'La tabla',
    body: 'Cada fila muestra la persona, el evento al que asistió y un adelanto del texto. Las acciones dejan ver el testimonio completo, editarlo o eliminarlo.',
  },
};

export const countriesListContent = {
  pageId: 'countries',
  overview: {
    title: 'Países',
    body: 'Administrá los países disponibles en el sistema — todo evento necesita uno asociado. "Nuevo País" agrega uno.',
  },
  table: {
    title: 'La tabla',
    body: 'Cada fila muestra el país y cuántas provincias y eventos tiene asociados. Las acciones dejan ver el detalle, editarlo o eliminarlo.',
  },
};

export const provincesListContent = {
  pageId: 'provinces',
  overview: {
    title: 'Provincias',
    body: 'Administrá las provincias, agrupadas por país. Si el país es Argentina, podés asignarle una región — sirve para filtrar más rápido al crear un evento.',
  },
  table: {
    title: 'La tabla',
    body: 'Cada fila muestra la provincia, su país, y cuántas localidades y eventos tiene asociados. Las acciones dejan ver el detalle, editarla o eliminarla.',
  },
};

export const locationsListContent = {
  pageId: 'locations',
  overview: {
    title: 'Localidades',
    body: 'Administrá las localidades (ciudades o sedes) donde se realizan los eventos, agrupadas por provincia. "Nueva Localidad" agrega una, con título y descripción opcionales para la landing.',
  },
  table: {
    title: 'La tabla',
    body: 'Cada fila muestra la localidad, su provincia y país, y cuántos eventos tiene asociados. Las acciones dejan ver el detalle, editarla o eliminarla.',
  },
};
