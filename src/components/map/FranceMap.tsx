import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { MapPin, Loader2 } from "lucide-react";
import { fetchEnrichedClubs } from "@/lib/api/enriched-clubs";
import { getDisciplineById } from "@/data/disciplines";
import "leaflet/dist/leaflet.css";


// Fix Leaflet default marker icons (Vite bundling)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const FRANCE_CENTER: [number, number] = [46.603354, 1.888334];
const FRANCE_ZOOM = 6;

interface FranceMapProps {
  height?: string;
  selectedDiscipline?: string;
  selectedRegion?: string;
  maxClubs?: number;
}

export function FranceMap({
  height = "500px",
  selectedDiscipline = "all",
  selectedRegion = "all",
  maxClubs = 100,
}: FranceMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const { data: displayedClubs = [], isFetching } = useQuery({
    queryKey: ["clubs", "map", selectedDiscipline, selectedRegion, maxClubs],
    queryFn: async () => {
      const clubs = await fetchEnrichedClubs({
        discipline: selectedDiscipline,
        region: selectedRegion,
        limit: maxClubs,
      } as any);
      return clubs.filter((c) => c.coordinates?.lat && c.coordinates?.lng);
    },
  });


  // Create the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: FRANCE_CENTER,
      zoom: FRANCE_ZOOM,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markers = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersRef.current = markers;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Update markers whenever filters change
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();

    displayedClubs.forEach((club) => {
      const discipline = getDisciplineById(club.discipline);
      const icon = discipline?.icon ?? "🏆";
      const disciplineName = club.disciplineName;

      const marker = L.marker([club.coordinates.lat, club.coordinates.lng]);

      const popupHtml = `
        <div style="min-width:220px">
          <div style="margin-bottom:8px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <span style="font-size:20px">${icon}</span>
            <span style="font-size:12px; padding:2px 8px; border-radius:999px; background: hsl(var(--muted)); color: hsl(var(--muted-foreground));">${disciplineName}</span>
          </div>
          <div style="font-weight:600; color:hsl(var(--foreground)); margin-bottom:4px;">${club.name}</div>
          <div style="font-size:12px; color:hsl(var(--muted-foreground)); margin-bottom:10px;">${club.city}, ${club.region}</div>
          <div style="font-size:12px; color:hsl(var(--muted-foreground)); margin-bottom:10px;">
            ⭐ ${club.rating} • à partir de ${club.licensePrice.child}€
          </div>
          <a href="/club/${club.id}" style="display:block; text-align:center; text-decoration:none; padding:8px 10px; border-radius:8px; background:hsl(var(--primary)); color:hsl(var(--primary-foreground)); font-weight:600;">
            Voir le club
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: true });
      marker.addTo(markers);
    });

    // Keep France view (simple start) unless user is filtering to a very small set
    if (displayedClubs.length === 0) {
      map.setView(FRANCE_CENTER, FRANCE_ZOOM);
    }
  }, [displayedClubs]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border shadow-lg"
      style={{ height }}
    >
      <div ref={containerRef} className="h-full w-full" />

      {isFetching && (
        <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-border z-[1000] flex items-center gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Chargement…
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border z-[1000]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{displayedClubs.length} clubs</p>
            <p className="text-sm text-muted-foreground">sur la carte</p>
          </div>
        </div>
      </div>
    </div>
  );
}
