-- Revendication d'une fiche pendant la phase de test : même quand la fédération n'a pas encore donné son accord
-- (fiche invisible au public), un dirigeant peut retrouver son club et préremplir le questionnaire.
-- La fiche publique reste masquée par clubs_public ; validée par un admin, elle apparaîtra avec la pastille
-- « Fiche vérifiée par le club » dès que la fédération sera autorisée dans /admin > Scraping.

-- Index trigrammes (texte normalisé) pour que la recherche reste instantanée sur 100 000 clubs.
CREATE INDEX IF NOT EXISTS clubs_name_norm_trgm ON public.clubs USING gin (private.norm_txt(name) extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS clubs_city_norm_trgm ON public.clubs USING gin (private.norm_txt(city) extensions.gin_trgm_ops);

-- Recherche par nom ou ville : seulement l'identité minimale (nom, ville, discipline), 10 résultats maximum.
CREATE OR REPLACE FUNCTION public.search_clubs_for_claim(q text)
RETURNS TABLE (id uuid, name text, city text, postal_code text, discipline text, federation_code text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, c.name, c.city, c.postal_code, c.discipline, c.federation_code
  FROM public.clubs c
  WHERE NOT c.is_hidden
    AND length(btrim(q)) >= 2
    AND (private.norm_txt(c.name) LIKE '%' || private.norm_txt(btrim(q)) || '%'
      OR private.norm_txt(c.city) LIKE '%' || private.norm_txt(btrim(q)) || '%')
  ORDER BY (private.norm_txt(c.name) LIKE private.norm_txt(btrim(q)) || '%') DESC, c.name
  LIMIT 10;
$$;
REVOKE ALL ON FUNCTION public.search_clubs_for_claim(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_clubs_for_claim(text) TO anon, authenticated;

-- Données de préremplissage d'un club choisi : réservé aux comptes connectés, sans email ni téléphone
-- (toujours protégés par get_club_contact).
CREATE OR REPLACE FUNCTION public.get_club_for_claim(p_club_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Connexion requise' USING ERRCODE = '42501';
  END IF;
  SELECT to_jsonb(c) - 'email' - 'phone' - 'is_hidden' - 'correspondence_address' INTO r
  FROM public.clubs c WHERE c.id = p_club_id AND NOT c.is_hidden;
  IF r IS NULL THEN RETURN NULL; END IF;
  RETURN jsonb_build_object(
    'club', r,
    'venues', COALESCE((SELECT jsonb_agg(to_jsonb(v)) FROM public.club_venues v WHERE v.club_id = p_club_id), '[]'::jsonb),
    'schedules', COALESCE((SELECT jsonb_agg(to_jsonb(s)) FROM public.club_schedules s WHERE s.club_id = p_club_id), '[]'::jsonb),
    'prices', COALESCE((SELECT jsonb_agg(to_jsonb(p)) FROM public.club_prices p WHERE p.club_id = p_club_id), '[]'::jsonb)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.get_club_for_claim(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_club_for_claim(uuid) TO authenticated;
