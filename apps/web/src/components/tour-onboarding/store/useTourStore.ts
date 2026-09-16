import { create } from 'zustand';
import { tourRegistry } from '../definitions';
import { tourStorage } from '../storage/tourStorage';
import type { ProductTourState, TourStartActions, TourStep } from '../types';

const runOnEnter = (step: TourStep | undefined, actions: TourStartActions) => {
  if (step?.onEnter) actions[step.onEnter]?.();
};

/**
 * Al salir de un grupo (a cualquier otro grupo, o al terminar/cerrar el tour
 * estando en él) se ejecuta `exitGroup:<groupId>` si la pantalla la registró
 * — ej. para volver a plegar algo que el tour había abierto. Opcional: si
 * nadie registró esa acción, no pasa nada.
 */
const runGroupExit = (fromStep: TourStep | undefined, toStep: TourStep | undefined, actions: TourStartActions) => {
  if (fromStep && fromStep.groupId !== toStep?.groupId) {
    actions[`exitGroup:${fromStep.groupId}`]?.();
  }
};

const reset = {
  activeTourId: null as string | null,
  steps: [] as TourStep[],
  stepIndex: 0,
  actions: {} as TourStartActions,
};

/** Acciones explícitas ganan sobre las registradas por la pantalla, si ambas definen la misma clave. */
const resolveActions = (
  registeredActions: Record<string, TourStartActions>,
  tourId: string,
  explicit: TourStartActions | undefined,
): TourStartActions => ({ ...(registeredActions[tourId] ?? {}), ...(explicit ?? {}) });

/**
 * Store único del motor de tours de esta app — no hay `TCtx`/factory
 * genérica como en la referencia (bgenai-lib-tour) porque acá hay una sola
 * app consumiendo esto, no varias: los pasos condicionados por rol se
 * resuelven leyendo el DOM (ver `definitions/shellSteps.ts`), así que no
 * hace falta pasarle contexto de permisos al motor.
 */
export const useTourStore = create<ProductTourState>((set, get) => ({
  ...reset,
  welcomePending: null,
  registeredActions: {},

  startTour: (tourId, explicitActions, opts) => {
    const definition = tourRegistry[tourId];
    if (!definition) return;
    const steps = definition.buildSteps();
    if (steps.length === 0) return;
    const initialIndex = opts?.startGroupId
      ? Math.max(steps.findIndex((s) => s.groupId === opts.startGroupId), 0)
      : 0;
    const actions = resolveActions(get().registeredActions, tourId, explicitActions);

    // Arrancar no marca el tour como visto: el flag se activa al finalizarlo o al salir explícitamente.
    set({ activeTourId: tourId, steps, stepIndex: initialIndex, actions, welcomePending: null });
    runOnEnter(steps[initialIndex], actions);
  },

  goNext: () => {
    const { steps, stepIndex, activeTourId, actions } = get();
    if (!activeTourId) return;
    const current = steps[stepIndex];
    const nextIndex = stepIndex + 1;
    if (nextIndex >= steps.length) {
      runGroupExit(current, undefined, actions);
      tourStorage.markSeen(activeTourId);
      set({ ...reset });
      return;
    }
    runGroupExit(current, steps[nextIndex], actions);
    set({ stepIndex: nextIndex });
    runOnEnter(steps[nextIndex], actions);
  },

  goBack: () => {
    const { steps, stepIndex, actions } = get();
    if (stepIndex === 0) return;
    const current = steps[stepIndex];
    const prevIndex = stepIndex - 1;
    runGroupExit(current, steps[prevIndex], actions);
    set({ stepIndex: prevIndex });
    runOnEnter(steps[prevIndex], actions);
  },

  skipGroup: () => {
    const { steps, stepIndex, activeTourId, actions } = get();
    if (!activeTourId) return;
    const current = steps[stepIndex];
    const nextIndex = steps.findIndex((s, idx) => idx > stepIndex && s.groupId !== current?.groupId);
    if (nextIndex === -1) {
      runGroupExit(current, undefined, actions);
      tourStorage.markSeen(activeTourId);
      set({ ...reset });
      return;
    }
    runGroupExit(current, steps[nextIndex], actions);
    set({ stepIndex: nextIndex });
    runOnEnter(steps[nextIndex], actions);
  },

  exitTour: () => {
    const { steps, stepIndex, activeTourId, actions } = get();
    if (activeTourId) {
      runGroupExit(steps[stepIndex], undefined, actions);
      tourStorage.markSeen(activeTourId);
    }
    set({ ...reset });
  },

  openWelcome: (tourId, actions, startGroupId) => {
    // No-op si ya hay un tour corriendo o un cartel pendiente.
    if (get().activeTourId || get().welcomePending) return;
    set({ welcomePending: { tourId, actions, startGroupId } });
  },

  confirmWelcome: () => {
    const { welcomePending } = get();
    if (!welcomePending) return;
    get().startTour(welcomePending.tourId, welcomePending.actions, { startGroupId: welcomePending.startGroupId });
  },

  dismissWelcome: () => {
    const { welcomePending } = get();
    if (welcomePending) tourStorage.markSeen(welcomePending.tourId);
    set({ welcomePending: null });
  },

  // Irse de la pantalla no es rechazar el tour: se limpia el cartel sin marcarlo visto, para
  // que no siga al usuario a la pantalla siguiente y se le vuelva a ofrecer la próxima vez.
  dismissWelcomeIfPending: (tourId) => {
    if (get().welcomePending?.tourId === tourId) set({ welcomePending: null });
  },

  registerTourActions: (tourId, actions) => {
    set((s) => ({ registeredActions: { ...s.registeredActions, [tourId]: actions } }));
  },

  unregisterTourActions: (tourId) => {
    set((s) => {
      const next = { ...s.registeredActions };
      delete next[tourId];
      return { registeredActions: next };
    });
  },
}));

export const useActiveTourTarget = (): string | null =>
  useTourStore((s) => (s.activeTourId ? s.steps[s.stepIndex]?.target ?? null : null));
