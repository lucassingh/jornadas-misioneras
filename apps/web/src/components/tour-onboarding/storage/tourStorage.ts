import { TOUR_STORAGE_KEY } from '../config';

/**
 * "¿Este usuario ya vio este tour?" — persistido en localStorage, por
 * navegador. No sobrevive a un cambio de dispositivo ni a un
 * `localStorage.clear()`; si alguna vez hace falta persistencia real por
 * usuario, esto es lo único que habría que reemplazar (el store no sabe
 * dónde vive el dato).
 */
const readSeen = (): string[] => {
  try {
    const raw = localStorage.getItem(TOUR_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSeen = (seen: string[]): void => {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(seen));
  } catch {
    // localStorage puede fallar (modo privado, cuota) — no debe romper el cierre del tour.
  }
};

export const tourStorage = {
  hasSeenTour(tourId: string): boolean {
    return readSeen().includes(tourId);
  },
  markSeen(tourId: string): void {
    const seen = readSeen();
    if (seen.includes(tourId)) return;
    writeSeen([...seen, tourId]);
  },
};
