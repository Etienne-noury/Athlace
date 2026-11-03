export type VisitorPosition = { lat: number; lng: number };

export function requestVisitorPosition(): Promise<VisitorPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Géolocalisation indisponible'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      reject,
      { timeout: 10000, maximumAge: 60000 },
    );
  });
}