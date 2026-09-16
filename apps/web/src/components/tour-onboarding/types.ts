export interface TourStep {
  /** Único dentro del tour. */
  id: string;
  /** Agrupa pasos que "Saltar esta sección" salta juntos, y que arma cada entrada del menú de guía. */
  groupId: string;
  /** Valor exacto del atributo `data-tour` del elemento a resaltar (sin selector). */
  target: string;
  /**
   * Valor de `data-tour-group` a unir con el rect del target — para pasos
   * "sección" que quieren mostrar el header + una fila de preview en vez de
   * solo el header.
   */
  unionWith?: string;
  /**
   * Valor de `data-tour-group` de una zona más grande que se suma SOLO al
   * agujero de blur — no al anillo de foco ni al ancla del popover, que
   * siguen ajustados al `target` (+ `unionWith`).
   */
  clearWith?: string;
  /** Título del popover. Si se omite, el popover no muestra título (ej. los ítems del aside). */
  title?: string;
  /** Cuerpo del popover. */
  body: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'bottom-start' | 'right-start';
  /** Nombre de acción (de las pasadas a `startTour`) a ejecutar al entrar a este paso. */
  onEnter?: string;
}

export interface TourStartActions {
  [actionName: string]: () => void;
}

export interface TourDefinition {
  id: string;
  /** Si es true, la pantalla puede auto-abrir este tour la primera vez que el usuario entra (ver `useTourAutoStart`). */
  autoStart?: boolean;
  buildSteps: () => TourStep[];
  /** groupId → label mostrado en el menú de guía. Una entrada por cada groupId que `buildSteps` pueda producir. */
  groupLabels: Record<string, string>;
}

export interface StartTourOpts {
  /** Si se pasa, el tour arranca directo en el primer paso de ese grupo en vez del paso 0 — usado para saltar a una sección puntual. */
  startGroupId?: string;
}

/** Un cartel de bienvenida pendiente de confirmar antes de arrancar el tour de verdad. */
export interface WelcomePending {
  tourId: string;
  actions?: TourStartActions;
  startGroupId?: string;
}

export interface TourSection {
  groupId: string;
  label: string;
}

export interface ProductTourState {
  activeTourId: string | null;
  steps: TourStep[];
  stepIndex: number;
  actions: TourStartActions;
  welcomePending: WelcomePending | null;
  /**
   * tourId → acciones que la PANTINA dueña de ese tour publicó (ej. una
   * función para mover el stepper de un formulario a un paso puntual).
   * `TourGuideMenu` vive montado una sola vez en el header, compartido por
   * todas las pantallas del dashboard — no puede recibir por prop las
   * acciones de una pantalla en particular, así que cada pantalla las
   * registra acá (ver `useTourActions`) y `TourGuideMenu` las lee de acá al
   * arrancar su propio tourId.
   */
  registeredActions: Record<string, TourStartActions>;

  startTour: (tourId: string, actions?: TourStartActions, opts?: StartTourOpts) => void;
  /** Avanza un paso. En el último paso del tour, lo marca visto y lo cierra. */
  goNext: () => void;
  goBack: () => void;
  /** Salta todos los pasos restantes del grupo actual. Si no queda otro grupo después, termina el tour (igual que goNext en el último paso). */
  skipGroup: () => void;
  /** Cierra el tour antes de terminar — también cuenta como "ya vio el tour". */
  exitTour: () => void;

  /** Pide mostrar el cartel de bienvenida antes de arrancar — no-op si ya hay un tour activo o un cartel pendiente. */
  openWelcome: (tourId: string, actions?: TourStartActions, startGroupId?: string) => void;
  /** Confirma el cartel pendiente y arranca el tour de verdad. */
  confirmWelcome: () => void;
  /** Descarta el cartel pendiente sin arrancar el tour — lo marca visto para que no vuelva a auto-lanzarse. */
  dismissWelcome: () => void;
  /** Limpia el cartel pendiente de ese tour SIN marcarlo visto — para cuando el usuario se va de la pantalla. */
  dismissWelcomeIfPending: (tourId: string) => void;

  /** Publica las acciones de un tour puntual — ver `registeredActions`. Sobrescribe lo que hubiera para ese tourId. */
  registerTourActions: (tourId: string, actions: TourStartActions) => void;
  /** Se llama al desmontar la pantalla dueña de esas acciones, para no dejar referencias colgando a closures viejas. */
  unregisterTourActions: (tourId: string) => void;
}
