-- Audit du 16/11/2026 : durcissement avant publication.
-- Rejouable sans erreur (IF EXISTS / CREATE OR REPLACE / blocs DO).

-- 1. Demandes de rendez-vous club : une seule porte d'entrée.
--    Le site passe par la fonction edge club-appointment (validation + délai anti-spam),
--    qui écrit avec la clé service_role. La policy ci-dessous laissait n'importe qui
--    insérer directement dans la table en contournant ces contrôles.
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.club_waitlist;

-- 2. Un visiteur non connecté ne modifie jamais rien.
--    La RLS le bloquait déjà ; on retire aussi le droit lui-même (double sécurité :
--    une policy trop large ajoutée par erreur ne suffira plus à ouvrir une écriture).
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon;

--    Tables de référence : aucune écriture depuis le navigateur, même connecté.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.clubs, public.clubs_enriched, public.club_venues, public.club_schedules,
     public.equipements_sportifs, public.federations_sportives, public.user_roles
  FROM authenticated;

-- 3. Suppression de compte : les données personnelles partent avec le compte.
--    Ces quatre tables n'étaient pas rattachées à auth.users.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['favorite_cities', 'favorite_sports', 'alert_preferences', 'club_submissions'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conrelid = format('public.%I', t)::regclass AND conname = t || '_user_id_fkey'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE',
        t, t || '_user_id_fkey'
      );
    END IF;
  END LOOP;
END $$;

-- 4. Fichiers envoyés par les utilisateurs : images uniquement, taille bornée.
--    (Mêmes limites que les contrôles du site : Profile.tsx et MyClub.tsx.)
UPDATE storage.buckets
  SET file_size_limit = 2097152, allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp']
  WHERE id = 'avatars';
UPDATE storage.buckets
  SET file_size_limit = 5242880, allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp']
  WHERE id = 'club-media';

-- 5. Recherche par proximité : bornes côté serveur.
--    p_limit et p_radius_km viennent du navigateur ; sans plafond, un seul appel pouvait
--    demander toute la base. Le site demande au plus 1000 clubs dans 100 km.
CREATE OR REPLACE FUNCTION public.clubs_near(
  p_lat double precision,
  p_lng double precision,
  p_radius_km double precision DEFAULT 30,
  p_disciplines text[] DEFAULT NULL,
  p_sub text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_limit integer DEFAULT 100,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(club jsonb, distance_km double precision, total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH bounds AS (
    SELECT LEAST(GREATEST(COALESCE(p_radius_km, 30), 0), 500) AS radius
  ), c AS (
    SELECT cp.*, 6371 * 2 * asin(sqrt(
      power(sin(radians(cp.latitude - p_lat) / 2), 2) +
      cos(radians(p_lat)) * cos(radians(cp.latitude)) * power(sin(radians(cp.longitude - p_lng) / 2), 2)
    )) AS d
    FROM clubs_public cp, bounds b
    WHERE cp.latitude IS NOT NULL AND cp.longitude IS NOT NULL
      AND cp.latitude BETWEEN p_lat - b.radius / 111.0 AND p_lat + b.radius / 111.0
      AND cp.longitude BETWEEN p_lng - b.radius / (111.0 * cos(radians(p_lat))) AND p_lng + b.radius / (111.0 * cos(radians(p_lat)))
      AND (p_disciplines IS NULL OR cardinality(p_disciplines) = 0 OR cp.discipline = ANY(p_disciplines))
      AND (p_sub IS NULL OR p_sub = ANY(cp.sub_disciplines) OR p_sub = ANY(cp.dance_families))
      AND (p_region IS NULL OR p_region = '' OR p_region = 'all' OR cp.region ILIKE '%' || p_region || '%')
  ), f AS (SELECT c.* FROM c, bounds b WHERE c.d <= b.radius)
  SELECT to_jsonb(f) - 'd', f.d, count(*) OVER ()
  FROM f ORDER BY f.d
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 100), 1), 1000)
  OFFSET GREATEST(COALESCE(p_offset, 0), 0);
$$;
REVOKE ALL ON FUNCTION public.clubs_near(double precision, double precision, double precision, text[], text, text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.clubs_near(double precision, double precision, double precision, text[], text, text, integer, integer) TO anon, authenticated;
