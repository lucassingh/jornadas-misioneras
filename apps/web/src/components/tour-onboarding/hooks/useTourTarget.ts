import { useEffect, useRef, useState } from 'react';
import { TOUR_TARGET_POLL_MS, TOUR_TARGET_WAIT_MS } from '../config';

export interface TourTargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface TourTargetResult {
  /** Rect del target (+ `unionWith`) — lo que usan el anillo de foco y el ancla del popover. */
  rect: TourTargetRect | null;
  /**
   * Rect del agujero de blur. Igual a `rect` salvo que se pase `clearWith`,
   * en cuyo caso es `rect` unido a todos los elementos con
   * `data-tour-group="<clearWith>"`.
   */
  clearRect: TourTargetRect | null;
  /**
   * El `target` (data-tour) al que corresponde `rect` ahora mismo. Puede
   * seguir siendo el del paso anterior mientras se resuelve el nuevo — el
   * consumidor compara esto contra el target del paso actual para saber si
   * ya puede mostrar su texto.
   */
  resolvedFor: string | null;
}

const measure = (el: Element): TourTargetRect => {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
};

/** Rect que envuelve a todos los rects dados. */
const union = (rects: TourTargetRect[]): TourTargetRect => {
  const top = Math.min(...rects.map((r) => r.top));
  const left = Math.min(...rects.map((r) => r.left));
  const bottom = Math.max(...rects.map((r) => r.top + r.height));
  const right = Math.max(...rects.map((r) => r.left + r.width));
  return { top, left, width: right - left, height: bottom - top };
};

const VIEWPORT_MARGIN = 24;

/** Si el target ya está razonablemente visible no hace falta scrollear — evita un salto innecesario en cada paso. */
const isReasonablyVisible = (r: TourTargetRect): boolean =>
  r.top >= VIEWPORT_MARGIN &&
  r.top + r.height <= window.innerHeight - VIEWPORT_MARGIN &&
  r.left >= 0 &&
  r.left + r.width <= window.innerWidth;

/**
 * Resuelve `[data-tour="target"]` en el DOM y sigue su posición mientras el
 * paso está activo (loop de rAF — cubre animaciones de layout como el ancho
 * de un aside colapsando). Si se pasa `unionWith`, además busca todos los
 * elementos con `data-tour-group="unionWith"` y el rect resultante envuelve
 * a todos juntos.
 *
 * Si el nodo principal no aparece dentro de `TOUR_TARGET_WAIT_MS`, o
 * desaparece del DOM mientras se lo sigue (cambio de rol, item condicional),
 * llama a `onNotFound` — quien decide qué hacer (normalmente, avanzar al
 * siguiente paso para que este se salte solo).
 */
export function useTourTarget(
  target: string | null,
  unionWith: string | undefined,
  clearWith: string | undefined,
  onNotFound: () => void,
): TourTargetResult {
  const [state, setState] = useState<TourTargetResult>({ rect: null, clearRect: null, resolvedFor: null });
  const onNotFoundRef = useRef(onNotFound);
  onNotFoundRef.current = onNotFound;

  useEffect(() => {
    if (!target) {
      setState({ rect: null, clearRect: null, resolvedFor: null });
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let pollId = 0;
    const selector = `[data-tour="${target}"]`;
    const groupSelector = unionWith ? `[data-tour-group~="${unionWith}"]` : null;
    const clearGroupSelector = clearWith ? `[data-tour-group~="${clearWith}"]` : null;

    const measureAll = (el: Element): TourTargetRect => {
      if (!groupSelector) return measure(el);
      const groupEls = Array.from(document.querySelectorAll(groupSelector));
      return groupEls.length > 0 ? union([measure(el), ...groupEls.map(measure)]) : measure(el);
    };

    const measureClear = (rect: TourTargetRect): TourTargetRect => {
      if (!clearGroupSelector) return rect;
      const clearEls = Array.from(document.querySelectorAll(clearGroupSelector));
      return clearEls.length > 0 ? union([rect, ...clearEls.map(measure)]) : rect;
    };

    const startTracking = (el: Element) => {
      // No mostramos nada de este paso hasta que su rect quede quieto unos
      // frames seguidos — si el `onEnter` que trajo este paso expande/colapsa
      // algo, el rect real todavía se está moviendo, y sin este gate el
      // spotlight perseguiría cuadro a cuadro un target que todavía crece.
      let lastRect: TourTargetRect | null = null;
      let stableFrames = 0;
      let revealed = false;

      const loop = () => {
        if (cancelled) return;
        if (!el.isConnected) {
          onNotFoundRef.current();
          return;
        }
        const r = measureAll(el);

        const isStable = !!lastRect &&
          Math.abs(r.top - lastRect.top) < 0.5 &&
          Math.abs(r.left - lastRect.left) < 0.5 &&
          Math.abs(r.width - lastRect.width) < 0.5 &&
          Math.abs(r.height - lastRect.height) < 0.5;
        stableFrames = isStable ? stableFrames + 1 : 0;
        lastRect = r;

        if (!revealed) {
          if (stableFrames >= 3) {
            revealed = true;
            setState({ rect: r, clearRect: measureClear(r), resolvedFor: target });
            if (!isReasonablyVisible(r)) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            }
          }
        } else {
          setState({ rect: r, clearRect: measureClear(r), resolvedFor: target });
        }

        rafId = requestAnimationFrame(loop);
      };
      loop();
    };

    const found = document.querySelector(selector);
    if (found) {
      startTracking(found);
    } else {
      const startedAt = Date.now();
      const poll = () => {
        if (cancelled) return;
        const el = document.querySelector(selector);
        if (el) { startTracking(el); return; }
        if (Date.now() - startedAt >= TOUR_TARGET_WAIT_MS) { onNotFoundRef.current(); return; }
        pollId = window.setTimeout(poll, TOUR_TARGET_POLL_MS);
      };
      pollId = window.setTimeout(poll, TOUR_TARGET_POLL_MS);
    }

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (pollId) window.clearTimeout(pollId);
    };
  }, [target, unionWith, clearWith]);

  return state;
}
