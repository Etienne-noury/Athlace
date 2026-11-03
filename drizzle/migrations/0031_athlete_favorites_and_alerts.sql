CREATE TABLE public.favorite_cities (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, city_name text NOT NULL CHECK(length(btrim(city_name)) BETWEEN 1 AND 200), city_code text NOT NULL CHECK(length(city_code) BETWEEN 1 AND 20), postal_code text, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,city_code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorite_cities TO authenticated;
GRANT ALL ON public.favorite_cities TO service_role;
REVOKE ALL ON public.favorite_cities FROM anon;
ALTER TABLE public.favorite_cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorite cities" ON public.favorite_cities FOR ALL TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE TABLE public.favorite_sports (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, sport_id text NOT NULL CHECK(sport_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,sport_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorite_sports TO authenticated;
GRANT ALL ON public.favorite_sports TO service_role;
REVOKE ALL ON public.favorite_sports FROM anon;
ALTER TABLE public.favorite_sports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorite sports" ON public.favorite_sports FOR ALL TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE TABLE public.alert_preferences (
 user_id uuid PRIMARY KEY, new_club_city boolean NOT NULL DEFAULT false, new_club_sport boolean NOT NULL DEFAULT false, favorite_club_news boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alert_preferences TO authenticated;
GRANT ALL ON public.alert_preferences TO service_role;
REVOKE ALL ON public.alert_preferences FROM anon;
ALTER TABLE public.alert_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own alert preferences" ON public.alert_preferences FOR ALL TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
