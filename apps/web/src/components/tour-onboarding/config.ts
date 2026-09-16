/** Cuánto espera un paso a que su target aparezca en el DOM antes de saltearse solo. */
export const TOUR_TARGET_WAIT_MS = 800;
export const TOUR_TARGET_POLL_MS = 60;

/** Delay antes de auto-lanzar un tour en el primer ingreso (si algún tour lo usa), para dejar asentar el layout inicial. */
export const TOUR_AUTOSTART_DELAY_MS = 600;

/** z-index del overlay del tour — por encima de todo lo demás del dashboard (AppBar 1100, Sidebar 1200, MUI Modal 1300). */
export const TOUR_OVERLAY_Z_INDEX = 9000;

/** Clave de localStorage donde se guardan los tours ya vistos/descartados. */
export const TOUR_STORAGE_KEY = 'jm_tours_seen';
