export type VisitorPosition = { lat: number; lng: number };

/** Raison d'échec lisible : refus, aperçu intégré (iframe) qui bloque la localisation, ou position introuvable. */
export type PositionFailure = 'denied' | 'blocked' | 'unavailable';

export class VisitorPositionError extends Error {
  constructor(public reason: PositionFailure) {
    super(reason);
  }
}

const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

export function requestVisitorPosition(): Promise<VisitorPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation || window.isSecureContext === false) {
      reject(new VisitorPositionError('unavailable'));
      return;
    }
    // Filet de sécurité : si la demande d'autorisation reste sans réponse, on n'attend pas indéfiniment.
    const guard = window.setTimeout(() => reject(new VisitorPositionError('unavailable')), 30000);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        window.clearTimeout(guard);
        resolve({ lat: coords.latitude, lng: coords.longitude });
      },
      (error) => {
        window.clearTimeout(guard);
        if (error.code === 1) { // PERMISSION_DENIED
          reject(new VisitorPositionError(inIframe() ? 'blocked' : 'denied'));
        } else {
          reject(new VisitorPositionError('unavailable'));
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

export const POSITION_FAILURE_MESSAGES: Record<PositionFailure, string> = {
  denied: 'Vous avez refusé la localisation. Autorisez-la dans les réglages du navigateur (icône à gauche de l’adresse du site), puis réessayez.',
  blocked: 'La localisation est bloquée dans cet aperçu. Elle fonctionnera sur le site publié.',
  unavailable: 'Impossible de trouver votre position. Saisissez plutôt une ville.',
};

/** Nom du lieu (commune ou arrondissement) pour une position, via la Base Adresse Nationale. */
export async function reversePlaceName({ lat, lng }: VisitorPosition): Promise<string | null> {
  try {
    const res = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}&limit=1`);
    if (!res.ok) return null;
    const json = await res.json();
    const props = json.features?.[0]?.properties;
    return props?.district || props?.city || null;
  } catch {
    return null;
  }
}
