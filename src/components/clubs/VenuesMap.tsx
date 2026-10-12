import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface VenuePoint {
  lat: number;
  lng: number;
  label: string;
}

/** Carte Leaflet avec un marqueur par lieu de pratique. */
export function VenuesMap({ points }: { points: VenuePoint[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || points.length === 0) return;
    const map = L.map(ref.current, { scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);
    const markers = points.map((p) => {
      const m = L.marker([p.lat, p.lng]).addTo(map);
      m.bindPopup(p.label);
      return m;
    });
    if (points.length === 1) map.setView([points[0].lat, points[0].lng], 14);
    else map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [30, 30] });
    return () => {
      map.remove();
    };
  }, [points]);

  if (points.length === 0) return null;
  return (
    <div
      ref={ref}
      role="region"
      aria-label="Carte des lieux de pratique"
      className="w-full h-64 rounded-xl border border-border overflow-hidden z-0"
    />
  );
}
