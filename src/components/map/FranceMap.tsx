import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import { MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchEnrichedClubs } from "@/lib/api/enriched-clubs";
import { fetchClubsNear } from "@/lib/api/geo-search";
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

interface MapPoint { id: string; lat: number; lng: number }
interface Proximity { lat: number; lng: number; radiusKm: number }
const WORLD_BOUNDS = { latMin: -90, latMax: 90, lngMin: -180, lngMax: 180 };

function aggregatePoints(points: MapPoint[], precision: number): ClusterCell[] {
  const cells = new Map<string, { lat: number; lng: number; cnt: number }>();
  for (const point of points) {
    const key = `${Math.floor(point.lat / precision)},${Math.floor(point.lng / precision)}`;
    const cell = cells.get(key) ?? { lat: 0, lng: 0, cnt: 0 };
    cell.lat += point.lat;
    cell.lng += point.lng;
    cell.cnt += 1;
    cells.set(key, cell);
  }
  return [...cells.values()].map((cell) => ({ lat: cell.lat / cell.cnt, lng: cell.lng / cell.cnt, cnt: cell.cnt }));
}

interface FranceMapProps {
  height?: string;
  selectedDiscipline?: string;
  selectedSub?: string;
  selectedRegion?: string;
  locationQuery?: string;
  searchQuery?: string;
  proximity?: Proximity;
  searchMode?: boolean;
  searchReady?: boolean;
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
  searchQuery = "",
  proximity,
  searchMode = false,
  searchReady = true,
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

  // The existing cluster RPC has no name search, region-text or distance filter.
  // For those filters, fetch all matching positions (not the current list page),
  // then use the same grid to retain exact circle and text-search semantics.
  const needsFilteredPoints = searchMode && (!!proximity || !!searchQuery.trim() || selectedRegion !== 'all');
  const filterKey = JSON.stringify([disciplineNames, subDiscipline, selectedRegion, locationQuery, searchQuery, proximity]);
  const { data: filteredPoints, isFetching: isFetchingPoints } = useQuery({
    queryKey: ['clubs', 'map-filtered-positions', filterKey],
    enabled: clubs === undefined && searchReady && subReady && needsFilteredPoints,
    queryFn: async (): Promise<MapPoint[]> => {
      const points: MapPoint[] = [];
      for (let offset = 0; ; offset += 1000) {
        if (proximity) {
          const result = await fetchClubsNear({ ...proximity, disciplines: disciplineNames, sub: subDiscipline, region: selectedRegion, limit: 1000, offset });
          points.push(...result.clubs.map((club) => ({ id: club.id, ...club.coordinates })));
          if (offset + result.clubs.length >= result.total || result.clubs.length === 0) break;
        } else {
          let query = supabase.from('clubs_public').select('id,latitude,longitude').order('id').range(offset, offset + 999)
            .not('latitude', 'is', null).not('longitude', 'is', null).neq('latitude', 0).neq('longitude', 0);
          if (disciplineNames.length) query = query.in('discipline', disciplineNames);
          if (subDiscipline) query = query.contains(disciplineNames.every((name) => name === 'Danse') ? 'dance_families' : 'sub_disciplines', [subDiscipline]);
          if (selectedRegion !== 'all') query = query.ilike('region', `%${selectedRegion}%`);
          if (searchQuery.trim()) {
            const q = searchQuery.trim();
            query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,postal_code.ilike.%${q}%`);
          }
          const { data, error } = await query;
          if (error) throw error;
          for (const row of data ?? []) {
            if (row.id && row.latitude !== null && row.longitude !== null) points.push({ id: `fed:${row.id}`, lat: row.latitude, lng: row.longitude });
          }
          if (!data || data.length < 1000) break;
        }
      }
      return points;
    },
  });

  const fetchCells = async (area: typeof WORLD_BOUNDS, precision: number): Promise<ClusterCell[]> => {
    const { data, error } = await supabase.rpc('map_club_clusters', {
      p_lat_min: area.latMin, p_lat_max: area.latMax, p_lng_min: area.lngMin, p_lng_max: area.lngMax,
      p_precision: precision, p_disciplines: disciplineNames.length ? disciplineNames : null,
      p_postal_prefixes: postalPrefixes.length ? postalPrefixes : null,
      p_location: locationQuery.trim() || null, p_sub_discipline: subDiscipline,
    });
    if (error) throw error;
    return (data ?? []) as ClusterCell[];
  };

  const { data: extentCells } = useQuery({
    queryKey: ['clubs', 'map-filter-extent', filterKey],
    enabled: searchMode && searchReady && subReady && !needsFilteredPoints,
    queryFn: () => fetchCells(WORLD_BOUNDS, 0.012),
  });
  const recenteredFilterRef = useRef<string | null>(null);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !searchMode || !searchReady || recenteredFilterRef.current === filterKey) return;
    if (needsFilteredPoints ? !filteredPoints : !extentCells) return;
    recenteredFilterRef.current = filterKey;
    if (proximity) {
      const latitudeDelta = proximity.radiusKm / 111;
      const longitudeDelta = latitudeDelta / Math.cos(proximity.lat * Math.PI / 180);
      map.fitBounds([[proximity.lat - latitudeDelta, proximity.lng - longitudeDelta], [proximity.lat + latitudeDelta, proximity.lng + longitudeDelta]], { padding: [30, 30], maxZoom: INDIVIDUAL_ZOOM, animate: false });
    } else {
      const points = needsFilteredPoints ? filteredPoints ?? [] : extentCells ?? [];
      if (points.length) map.fitBounds(L.latLngBounds(points.map((point) => [point.lat, point.lng] as [number, number])), { padding: [30, 30], maxZoom: INDIVIDUAL_ZOOM, animate: false });
      else map.setView(FRANCE_CENTER, FRANCE_ZOOM, { animate: false });
    }
  }, [filterKey, searchMode, searchReady, needsFilteredPoints, filteredPoints, extentCells, proximity]);

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
    enabled: clubs === undefined && bounds !== null && (searchMode || clusterMode) && subReady && searchReady && !needsFilteredPoints,
  });

  const visiblePoints = (filteredPoints ?? []).filter((point) => bounds && point.lat >= bounds.latMin && point.lat <= bounds.latMax && point.lng >= bounds.lngMin && point.lng <= bounds.lngMax);
  const visibleClusters = needsFilteredPoints ? aggregatePoints(visiblePoints, gridPrecision(zoom) * (isSmallScreen ? 1.8 : 1)) : clusters;

  const { data: displayedClubs = [], isFetching: isFetchingClubs } = useQuery({
    queryKey: ["clubs", "map", filterKey, bounds, searchMode, filteredPoints],
    queryFn: async () => {
      if (searchMode) {
        const all: EnrichedClub[] = [];
        if (needsFilteredPoints) {
          const ids = visiblePoints.map((point) => point.id.replace(/^fed:/, ''));
          for (let offset = 0; offset < ids.length; offset += 200) {
            const { data, error } = await supabase.from('clubs_public').select('*').in('id', ids.slice(offset, offset + 200));
            if (error) throw error;
            const { rowToClub } = await import('@/lib/api/enriched-clubs');
            all.push(...(data ?? []).map((row) => rowToClub(row as unknown as Parameters<typeof rowToClub>[0])));
          }
        } else {
          for (let offset = 0; ; offset += 1000) {
            const result = await fetchEnrichedClubs({ disciplines: disciplineNames, subDiscipline, location: locationQuery, postalPrefixes, ...(bounds ?? {}), limit: 1000, offset });
            all.push(...result.clubs);
            if (offset + result.clubs.length >= result.total || !result.clubs.length) break;
          }
        }
        return all.filter((club) => club.coordinates.lat !== 0 && club.coordinates.lng !== 0);
      }
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
    enabled: clubs === undefined && bounds !== null && !clusterMode && subReady && searchReady && (!needsFilteredPoints || filteredPoints !== undefined),
  });

  const locatedResults = clubs?.filter((club) => Number.isFinite(club.coordinates.lat) && Number.isFinite(club.coordinates.lng) && club.coordinates.lat !== 0 && club.coordinates.lng !== 0);
  const totalInView = locatedResults ? locatedResults.length : (searchMode || clusterMode)
    ? visibleClusters.reduce((sum, cell) => sum + Number(cell.cnt), 0)
    : displayedClubs.length;
  const isFetching = clubs === undefined && (isFetchingPoints || (clusterMode ? isFetchingClusters : isFetchingClubs));

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
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
      const results = resultClustersRef.current;
      if (results && containerRef.current?.clientWidth && results.getLayers().length > 0) {
        map.fitBounds(results.getBounds(), { padding: [40, 40], maxZoom: INDIVIDUAL_ZOOM, animate: false });
      }
    });
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

    resultMarkersRef.current.clear();
    visibleClusters.forEach((cell) => {
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
  }, [clusters, filteredPoints, bounds, clusterMode, isSmallScreen, clubs]);

  // Marqueurs individuels (zoom quartier)
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || clusterMode || clubs !== undefined) return;

    layer.clearLayers();
    resultMarkersRef.current.clear();

    displayedClubs.forEach((club) => {
      const discipline = getDisciplineById(club.discipline);
      const icon = discipline?.icon ?? "🏆";
      const disciplineName = club.disciplineName;

      const marker = L.marker([club.coordinates.lat, club.coordinates.lng], { title: club.name, alt: club.name });
      if (searchMode) {
        const tooltip = document.createElement('span');
        tooltip.textContent = club.name;
        marker.bindTooltip(tooltip);
        marker.on('click', () => onClubClick?.(club.id));
        resultMarkersRef.current.set(club.id, marker);
        marker.addTo(layer);
        return;
      }

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
  }, [displayedClubs, clusterMode, clubs, searchMode, onClubClick]);

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
      const tooltip = document.createElement('span');
      tooltip.textContent = club.name;
      marker.bindTooltip(tooltip);
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
    const clear = () => containerRef.current?.querySelectorAll('.athlace-result-highlight').forEach((node) => node.classList.remove('athlace-result-highlight'));
    const highlight = () => {
      clear();
      const marker = highlightedClubId ? resultMarkersRef.current.get(highlightedClubId) : undefined;
      if (marker) (group ? group.getVisibleParent(marker) : marker)?.getElement()?.classList.add('athlace-result-highlight');
    };
    highlight();
    group?.on('animationend', highlight);
    mapRef.current?.on('zoomend', highlight);
    return () => {
      group?.off('animationend', highlight);
      mapRef.current?.off('zoomend', highlight);
      clear();
    };
  }, [highlightedClubId, clubs, displayedClubs, clusterMode]);

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
      <div className={`absolute left-4 bg-card backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border z-[1000] ${clubs === undefined && !searchMode ? 'bottom-4' : 'bottom-24 lg:bottom-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-pill bg-creme flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              {totalInView.toLocaleString("fr-FR")} clubs
            </p>
            <p className="text-sm text-muted-foreground">{clubs === undefined ? 'dans cette zone' : 'sur cette page'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
