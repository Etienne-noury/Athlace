CREATE OR REPLACE FUNCTION public.enrich_from_es(batch_size integer DEFAULT 500)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_gps integer := 0;
  v_disc integer := 0;
  v_equip integer := 0;
BEGIN
  IF batch_size IS NULL OR batch_size < 1 OR batch_size > 2000 THEN
    batch_size := 500;
  END IF;

  -- Passe 1 : coordonnées GPS
  WITH targets AS (
    SELECT c.id, c.postal_code, c.address
    FROM public.clubs_enriched c
    WHERE (c.latitude IS NULL OR c.latitude = 0)
      AND c.postal_code IS NOT NULL
      AND c.address IS NOT NULL
    LIMIT batch_size
  ), cand AS (
    SELECT t.id, e.latitude, e.longitude
    FROM targets t
    JOIN LATERAL (
      SELECT es.latitude, es.longitude
      FROM public.equipements_sportifs es
      WHERE es.postal_code = t.postal_code
        AND es.latitude IS NOT NULL AND es.latitude <> 0
        AND es.adresse IS NOT NULL
        AND similarity(lower(t.address), lower(es.adresse)) > 0.4
      ORDER BY similarity(lower(t.address), lower(es.adresse)) DESC
      LIMIT 1
    ) e ON true
  )
  UPDATE public.clubs_enriched c
  SET latitude = cand.latitude, longitude = cand.longitude
  FROM cand
  WHERE c.id = cand.id;
  GET DIAGNOSTICS v_gps = ROW_COUNT;

  -- Passe 2 : discipline depuis les activités DATA ES
  WITH targets AS (
    SELECT c.id, c.postal_code
    FROM public.clubs_enriched c
    WHERE c.discipline IS NULL
      AND c.postal_code IS NOT NULL
    LIMIT batch_size
  ), acts AS (
    SELECT t.id, btrim(split_part(e.activites, ',', 1)) AS act
    FROM targets t
    JOIN LATERAL (
      SELECT es.activites
      FROM public.equipements_sportifs es
      WHERE es.postal_code = t.postal_code
        AND es.activites IS NOT NULL
        AND btrim(es.activites) <> ''
      LIMIT 1
    ) e ON true
  ), matched AS (
    SELECT DISTINCT ON (a.id) a.id, f.nom, f.sigle
    FROM acts a
    JOIN public.federations_sportives f
      ON lower(f.nom) LIKE '%' || lower(a.act) || '%'
    WHERE length(a.act) >= 4
    ORDER BY a.id, length(f.nom) ASC
  )
  UPDATE public.clubs_enriched c
  SET discipline = matched.nom,
      federation_code = COALESCE(matched.sigle, c.federation_code)
  FROM matched
  WHERE c.id = matched.id;
  GET DIAGNOSTICS v_disc = ROW_COUNT;

  -- Passe 3 : équipements disponibles
  WITH targets AS (
    SELECT c.id, c.postal_code
    FROM public.clubs_enriched c
    WHERE c.equipements IS NULL
      AND c.postal_code IS NOT NULL
    LIMIT batch_size
  ), agg AS (
    SELECT t.id, array_agg(DISTINCT e.type_equipement) AS eq
    FROM targets t
    JOIN public.equipements_sportifs e ON e.postal_code = t.postal_code
    WHERE e.type_equipement IS NOT NULL AND btrim(e.type_equipement) <> ''
    GROUP BY t.id
  )
  UPDATE public.clubs_enriched c
  SET equipements = agg.eq
  FROM agg
  WHERE c.id = agg.id;
  GET DIAGNOSTICS v_equip = ROW_COUNT;

  RETURN jsonb_build_object(
    'gps', v_gps,
    'disciplines', v_disc,
    'equipements', v_equip,
    'updated', v_gps + v_disc + v_equip
  );
END;
$$;

REVOKE ALL ON FUNCTION public.enrich_from_es(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enrich_from_es(integer) TO service_role;