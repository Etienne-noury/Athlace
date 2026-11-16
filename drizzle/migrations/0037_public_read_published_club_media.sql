CREATE OR REPLACE FUNCTION public.is_published_club_media(p_name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clubs c
    WHERE NOT COALESCE(c.is_hidden, false)
      AND (c.logo_url = p_name OR p_name = ANY (c.photo_urls))
  );
$$;
REVOKE ALL ON FUNCTION public.is_published_club_media(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_published_club_media(text) TO anon, authenticated;
DROP POLICY IF EXISTS "Public read published club media" ON storage.objects;
CREATE POLICY "Public read published club media" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'club-media' AND public.is_published_club_media(name));