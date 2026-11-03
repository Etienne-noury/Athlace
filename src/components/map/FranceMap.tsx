import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchEnrichedClubs } from "@/lib/api/enriched-clubs";
import type { EnrichedClub } from "@/lib/api/enriched-clubs";
import { getDisciplineById, getDisciplineQueryNames, getSubDisciplineValue } from "@/data/disciplines";
import { getDepartmentCodesByRegionName } from "@/lib/geo";
import { useAvailableDisciplines } from "@/hooks/useAvailableDisciplines";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";

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
  /** Mode recherche : uniquement les résultats de la page courante, sans requête carte. */
  clubs?: EnrichedClub[];
  highlightedClubId?: string | null;
  onClubClick?: (clubId: string) => void;
  className?: string;
}

export function FranceMap({
  height = "500px",
  selectedDiscipline = "all",
  selectedSub = "all",
  selectedRegion = "all",
  locationQuery = "",
  maxClubs = 500,
  clubs,
  highlightedClubId,
  onClubClick,
  className = "",
}: FranceMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const resultClustersRef = useRef<L.MarkerClusterGroup | null>(null);
  const resultMarkersRef = useRef(new Map<string, L.Marker>());
  const [bounds, setBounds] = useState<{ latMin: number; latMax: number; lngMin: number; lngMax: number } | null>(null);
  const [zoom, setZoom] = useState<number>(FRANCE_ZOOM);

  const disciplineNames = getDisciplineQueryNames(selectedDiscipline);
  const avail = useAvailableDisciplines();
  const subDiscipline = getSubDisciplineValue(selectedDiscipline, selectedSub, avail.sports);
  const subReady = selectedSub === 'all' || avail.isReady;
  const postalPrefixes = getDepartmentCodesByRegionName(selectedRegion);
  const clusterMode = zoom < INDIVIDUAL_ZOOM;
  // Sur petit écran, bulles plus petites et grille plus large pour éviter qu'elles se chevauchent.
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640;

  // Bulles agrégées côté base : le nombre affiché est le nombre exact de clubs.
  const { data: clusters = [], isFetching: isFetchingClusters } = useQuery({
    queryKey: ["clubs", "map-clusters", disciplineNames, subDiscipline, postalPrefixes, locationQuery, bounds, zoom, isSmallScreen],
    queryFn: async (): Promise<ClusterCell[]> => {
      if (!bounds) return [];
      const { data, error } = await supabase.rpc("map_club_clusters", {
        p_lat_min: bounds.latMin,
        p_lat_max: bounds.latMax,
        p_lng_min: bounds.lngMin,
        p_lng_max: bounds.lngMax,
        p_precision: gridPrecision(zoom) * (isSmallScreen ? 1.8 : 1),
        p_disciplines: disciplineNames.length > 0 ? disciplineNames : null,
        p_postal_prefixes: postalPrefixes.length > 0 ? postalPrefixes : null,
        p_location: locationQuery?.trim() || null,
        p_sub_discipline: subDiscipline,
      });
      if (error) {
        console.error("[map_club_clusters]", error.message);
        return [];
      }
      return (data ?? []) as ClusterCell[];
    },
    enabled: clubs === undefined && bounds !== null && clusterMode && subReady,
  });

  const { data: displayedClubs = [], isFetching: isFetchingClubs } = useQuery({
    queryKey: ["clubs", "map", selectedDiscipline, selectedSub, subDiscipline, selectedRegion, locationQuery, bounds],
    queryFn: async () => {
      const result = await fetchEnrichedClubs({
        disciplines: disciplineNames,
        subDiscipline,
        location: locationQuery,
        postalPrefixes,
        limit: maxClubs,
        ...(bounds ?? {}),
      });
      return result.clubs.filter((c) => c.coordinates?.lat && c.coordinates?.lng);
    },
    enabled: clubs === undefined && bounds !== null && !clusterMode && subReady,
  });

  const locatedResults = clubs?.filter((club) => Number.isFinite(club.coordinates.lat) && Number.isFinite(club.coordinates.lng) && club.coordinates.lat !== 0 && club.coordinates.lng !== 0);
  const totalInView = locatedResults ? locatedResults.length : clusterMode
    ? clusters.reduce((sum, cell) => sum + Number(cell.cnt), 0)
    : displayedClubs.length;
  const isFetching = clubs === undefined && (clusterMode ? isFetchingClusters : isFetchingClubs);

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
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(containerRef.current);

    return () => {
      map.off("moveend", updateBounds);
      map.off("zoomend", updateBounds);
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Bulles de regroupement
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || !clusterMode || clubs !== undefined) return;

    layer.clearLayers();

    clusters.forEach((cell) => {
      const count = Number(cell.cnt);
      const baseSize = count < 10 ? 40 : count < 100 ? 52 : count < 1000 ? 64 : 76;
      const size = isSmallScreen ? Math.round(baseSize * 0.75) : baseSize;
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
  }, [clusters, clusterMode, isSmallScreen, clubs]);

  // Marqueurs individuels (zoom quartier)
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || clusterMode || clubs !== undefined) return;

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
  }, [displayedClubs, clusterMode, clubs]);

  // Même carte et mêmes bulles, mais regroupées uniquement sur la page de résultats.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || clubs === undefined) return;
    layerRef.current?.clearLayers();
    const group = L.markerClusterGroup({
      maxClusterRadius: isSmallScreen ? 65 : 55,
      disableClusteringAtZoom: INDIVIDUAL_ZOOM,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 40 : count < 100 ? 52 : 64;
        return L.divIcon({
          html: `<span aria-label="${count} clubs dans cette zone">${count}</span>`,
          className: `athlace-cluster athlace-cluster--${count < 10 ? 'sm' : 'md'}`,
          iconSize: L.point(size, size),
        });
      },
    });
    const markers = new Map<string, L.Marker>();
    clubs.forEach((club) => {
      const { lat, lng } = club.coordinates;
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) return;
      const marker = L.marker([lat, lng], { title: club.name, alt: club.name });
      marker.bindTooltip(club.name); // Leaflet treats the tooltip string as HTML: use textContent below.
      const tooltip = document.createElement('span');
      tooltip.textContent = club.name;
      marker.setTooltipContent(tooltip);
      marker.on('click', () => onClubClick?.(club.id));
      markers.set(club.id, marker);
      group.addLayer(marker);
    });
    resultMarkersRef.current = markers;
    resultClustersRef.current = group;
    group.addTo(map);
    if (markers.size > 0) map.fitBounds(group.getBounds(), { padding: [40, 40], maxZoom: INDIVIDUAL_ZOOM, animate: false });
    else map.setView(FRANCE_CENTER, FRANCE_ZOOM, { animate: false });
    return () => {
      map.removeLayer(group);
      resultMarkersRef.current.clear();
      resultClustersRef.current = null;
    };
  }, [clubs, onClubClick, isSmallScreen]);

  useEffect(() => {
    const group = resultClustersRef.current;
    if (!group) return;
    const clear = () => containerRef.current?.querySelectorAll('.athlace-result-highlight').forEach((node) => node.classList.remove('athlace-result-highlight'));
    const highlight = () => {
      clear();
      const marker = highlightedClubId ? resultMarkersRef.current.get(highlightedClubId) : undefined;
      if (marker) group.getVisibleParent(marker)?.getElement()?.classList.add('athlace-result-highlight');
    };
    highlight();
    group.on('animationend', highlight);
    mapRef.current?.on('zoomend', highlight);
    return () => {
      group.off('animationend', highlight);
      mapRef.current?.off('zoomend', highlight);
      clear();
    };
  }, [highlightedClubId, clubs]);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-border shadow-lg ${className}`}
      style={{ height }}
    >
      <div ref={containerRef} className="h-full w-full" />

      {isFetching && (
        <div className="absolute top-4 right-4 bg-card backdrop-blur-sm rounded-pill px-3 py-2 shadow-lg border border-border z-[1000] flex items-center gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Chargement…
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 bg-card backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border z-[1000]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-pill bg-creme flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              {totalInView.toLocaleString("fr-FR")} clubs
            </p>
            <p className="text-sm text-muted-foreground">dans cette zone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
