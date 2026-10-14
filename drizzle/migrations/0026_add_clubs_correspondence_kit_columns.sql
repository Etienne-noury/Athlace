ALTER TABLE public.clubs
  ADD COLUMN correspondence_address text,
  ADD COLUMN kit_image_url text;

CREATE OR REPLACE VIEW public.clubs_public AS
SELECT id, federation_code, external_id, name, acronym, league, committee, structure_type, affiliation_number,
  discipline, sub_disciplines, level, address, address_complement, postal_code, city, department_code, region,
  latitude, longitude, website, description, practice_types, competitions, age_categories, min_age, audiences,
  accessibility, labels, amenities, logo_url, colors, facebook_url, instagram_url, twitter_url, registration_url,
  licensees_total, licensees_youth, licensees_female, siret, rna_number, price_info, creation_date, source_url,
  scraped_at, claimed_by_club, created_at, updated_at, geocode_failed, position_checked_at, linkedin_url,
  youtube_url, tiktok_url, helloasso_url, licensees_senior_male, licensees_senior_female, licensees_youth_male,
  licensees_youth_female, competition_categories, access_conditions, courses, holes_total, practice_info,
  outing_durations, outing_places, transports, membership_fee, dance_families, photo_urls, video_url, trainings,
  fleet, opening_hours, practice_mode, beginners_accepted, max_age, required_level, medical_required,
  other_conditions, trial_sessions, registration_start, registration_end, season_start, waitlist, installments,
  accepted_aids, required_documents, qualified_coaches, atmosphere, annual_events, seeks_volunteers,
  club_verified_at, correspondence_address, kit_image_url
FROM public.clubs;