CREATE OR REPLACE FUNCTION public.accept_federation_value(status_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  st public.club_field_status%ROWTYPE;
  v_type text;
  val jsonb;
BEGIN
  IF NOT COALESCE(private.has_role(auth.uid(), 'admin'::text), false) THEN
    RAISE EXCEPTION 'Accès réservé aux administrateurs' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO st FROM public.club_field_status WHERE id = status_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Ligne introuvable'; END IF;

  SELECT data_type INTO v_type FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clubs' AND column_name = st.field;
  IF v_type IS NULL THEN RAISE EXCEPTION 'Colonne inconnue : %', st.field; END IF;

  IF st.federation_value IS NULL THEN
    val := 'null'::jsonb;
  ELSIF v_type = 'ARRAY' THEN
    val := st.federation_value::jsonb;
  ELSE
    val := to_jsonb(st.federation_value);
  END IF;

  -- D'abord la valeur validée (pour que le trigger de verrouillage laisse passer), puis clubs.
  UPDATE public.club_field_status
    SET club_value = st.federation_value, conflict = false, verified_at = now()
    WHERE id = status_id;
  EXECUTE format('UPDATE public.clubs SET %1$I = (jsonb_populate_record(NULL::public.clubs, $1)).%1$I WHERE id = $2', st.field)
    USING jsonb_build_object(st.field, val), st.club_id;
END;
$$;
REVOKE ALL ON FUNCTION public.accept_federation_value(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.accept_federation_value(uuid) TO authenticated;