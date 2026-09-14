import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchEnrichedClubs } from "@/lib/api/enriched-clubs";
import { getDisciplineById, getDisciplineQueryNames } from "@/data/disciplines";
import { getDepartmentCodesByRegionName } from "@/lib/geo";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons (Vite bundling)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
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
/** Au-delà de ce zoom, chaque club a son propre marqueur. */
const INDIVIDUAL_ZOOM = 14;

/** Taille de la grille d'agrégation (en degrés) selon le zoom. */
function gridPrecision(zoom: number): number {
  if (zoom <= 5) return 1.5;
  if (zoom === 6) return 1;
  if (zoom === 7) return 0.6;
  if (zoom === 8) return 0.35;
  if (zoom === 9) return 0.2;
  if (zoom === 10) return 0.1;
  if (zoom === 11) return 0.05;
  if (zoom === 12) return 0.025;
  return 0.012;
}

interface ClusterCell {
  lat: number;
  lng: number;
  cnt: number;
}

interface FranceMapProps {
  height?: string;
  selectedDiscipline?: string;
  selectedSub?: string;
  selectedRegion?: string;
  locationQuery?: string;
  maxClubs?: number;
}

export function FranceMap({
  height = "500px",
  selectedDiscipline = "all",
  selectedSub = "all",
  selectedRegion = "all",
  locationQuery = "",
  maxClubs = 500,
}: FranceMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [bounds, setBounds] = useState<{ latMin: number; latMax: number; lngMin: number; lngMax: number } | null>(null);
  const [zoom, setZoom] = useState<number>(FRANCE_ZOOM);

  const disciplineNames = getDisciplineQueryNames(selectedDiscipline, selectedSub);
  const postalPrefixes = getDepartmentCodesByRegionName(selectedRegion);
  const clusterMode = zoom < INDIVIDUAL_ZOOM;

  // Bulles agrégées côté base : le nombre affiché est le nombre exact de clubs.
  const { data: clusters = [], isFetching: isFetchingClusters } = useQuery({
    queryKey: ["clubs", "map-clusters", disciplineNames, postalPrefixes, locationQuery, bounds, zoom],
    queryFn: async (): Promise<ClusterCell[]> => {
      if (!bounds) return [];
      const { data, error } = await supabase.rpc("map_club_clusters", {
        p_lat_min: bounds.latMin,
        p_lat_max: bounds.latMax,
        p_lng_min: bounds.lngMin,
        p_lng_max: bounds.lngMax,
        p_precision: gridPrecision(zoom),
        p_disciplines: disciplineNames.length > 0 ? disciplineNames : null,
        p_postal_prefixes: postalPrefixes.length > 0 ? postalPrefixes : null,
        p_location: locationQuery?.trim() || null,
      });
      if (error) {
        console.error("[map_club_clusters]", error.message);
        return [];
      }
      return (data ?? []) as ClusterCell[];
    },
    enabled: bounds !== null && clusterMode,
  });

  const { data: displayedClubs = [], isFetching: isFetchingClubs } = useQuery({
    queryKey: ["clubs", "map", selectedDiscipline, selectedSub, selectedRegion, locationQuery, bounds],
    queryFn: async () => {
      const result = await fetchEnrichedClubs({
        disciplines: disciplineNames,
        location: locationQuery,
        postalPrefixes,
        limit: maxClubs,
        ...(bounds ?? {}),
      });
      return result.clubs.filter((c) => c.coordinates?.lat && c.coordinates?.lng);
    },
    enabled: bounds !== null && !clusterMode,
  });

  const totalInView = clusterMode
    ? clusters.reduce((sum, cell) => sum + Number(cell.cnt), 0)
    : displayedClubs.length;
  const isFetching = clusterMode ? isFetchingClusters : isFetchingClubs;

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

    const layer = L.layerGroup().addTo(map);
    mapRef.current = map;
    layerRef.current = layer;

    const updateBounds = () => {
      const b = map.getBounds();
      setBounds({
        latMin: b.getSouth(),
        latMax: b.getNorth(),
        lngMin: b.getWest(),
        lngMax: b.getEast(),
      });
      setZoom(map.getZoom());
    };
    updateBounds();
    map.on("moveend", updateBounds);
    map.on("zoomend", updateBounds);

    return () => {
      map.off("moveend", updateBounds);
      map.off("zoomend", updateBounds);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Bulles de regroupement
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || !clusterMode) return;

    layer.clearLayers();

    clusters.forEach((cell) => {
      const count = Number(cell.cnt);
      const size = count < 10 ? 40 : count < 100 ? 52 : count < 1000 ? 64 : 76;
      const tier = count < 10 ? "sm" : count < 100 ? "md" : "lg";
      const label = count >= 1000 ? `${Math.round(count / 100) / 10}k` : String(count);

      const marker = L.marker([cell.lat, cell.lng], {
        icon: L.divIcon({
          html: `<span aria-label="${count} clubs dans cette zone">${label}</span>`,
          className: `athlace-cluster athlace-cluster--${tier}`,
          iconSize: L.point(size, size),
        }),
        title: `${count} clubs`,
      });

      marker.on("click", () => {
        map.setView([cell.lat, cell.lng], Math.min(map.getZoom() + 2, INDIVIDUAL_ZOOM + 2));
      });

      marker.addTo(layer);
    });
  }, [clusters, clusterMode]);

  // Marqueurs individuels (zoom quartier)
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || clusterMode) return;

    layer.clearLayers();

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
          <a href="/club/${club.id}" style="display:block; text-align:center; text-decoration:none; padding:8px 10px; border-radius:8px; background:hsl(var(--primary)); color:hsl(var(--primary-foreground)); font-weight:600;">
            Voir le club
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: true });
      marker.addTo(layer);
    });
  }, [displayedClubs, clusterMode]);

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
            <p className="font-semibold text-foreground">
              {totalInView.toLocaleString("fr-FR")} clubs
            </p>
            <p className="text-sm text-muted-foreground">dans cette zone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
