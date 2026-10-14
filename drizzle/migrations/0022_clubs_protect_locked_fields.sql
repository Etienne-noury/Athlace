CREATE OR REPLACE FUNCTION public.club_value_as_text(v jsonb)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN v IS NULL OR jsonb_typeof(v) = 'null' THEN NULL
    WHEN jsonb_typeof(v) = 'array' THEN
      '[' || COALESCE((SELECT string_agg(to_json(x)::text, ',' ORDER BY x COLLATE "C")
                       FROM jsonb_array_elements_text(v) AS x), '') || ']'
    ELSE v #>> '{}'
  END;
$$;

CREATE OR REPLACE FUNCTION public.clubs_protect_locked_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s record;
  old_j jsonb := to_jsonb(OLD);
  new_j jsonb := to_jsonb(NEW);
  restore jsonb := '{}'::jsonb;
  incoming text;
BEGIN
  FOR s IN
    SELECT id, field, club_value FROM public.club_field_status
    WHERE club_id = OLD.id AND locked = true
  LOOP
    CONTINUE WHEN NOT (new_j ? s.field);
    CONTINUE WHEN (new_j -> s.field) IS NOT DISTINCT FROM (old_j -> s.field);
    incoming := public.club_value_as_text(new_j -> s.field);
    CONTINUE WHEN incoming IS NOT DISTINCT FROM s.club_value;
    restore := restore || jsonb_build_object(s.field, old_j -> s.field);
    UPDATE public.club_field_status
      SET federation_value = incoming,
          conflict = true
      WHERE id = s.id;
  END LOOP;
  IF restore <> '{}'::jsonb THEN
    NEW := jsonb_populate_record(NEW, restore);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_clubs_protect_locked_fields
  BEFORE UPDATE ON public.clubs
  FOR EACH ROW EXECUTE FUNCTION public.clubs_protect_locked_fields();