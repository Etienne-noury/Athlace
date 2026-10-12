export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      club_schedules: {
        Row: {
          category: string | null
          club_id: string
          created_at: string | null
          day: string | null
          discipline: string | null
          end_time: string | null
          id: string
          level: string | null
          notes: string | null
          start_time: string | null
          title: string | null
          venue_name: string | null
        }
        Insert: {
          category?: string | null
          club_id: string
          created_at?: string | null
          day?: string | null
          discipline?: string | null
          end_time?: string | null
          id?: string
          level?: string | null
          notes?: string | null
          start_time?: string | null
          title?: string | null
          venue_name?: string | null
        }
        Update: {
          category?: string | null
          club_id?: string
          created_at?: string | null
          day?: string | null
          discipline?: string | null
          end_time?: string | null
          id?: string
          level?: string | null
          notes?: string | null
          start_time?: string | null
          title?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_schedules_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_schedules_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs_public"
            referencedColumns: ["id"]
          },
        ]
      }
      club_venues: {
        Row: {
          accessibility: string[] | null
          address: string | null
          address_complement: string | null
          amenities: string[] | null
          city: string | null
          club_id: string
          created_at: string | null
          id: string
          is_main: boolean | null
          kind: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
          postal_code: string | null
        }
        Insert: {
          accessibility?: string[] | null
          address?: string | null
          address_complement?: string | null
          amenities?: string[] | null
          city?: string | null
          club_id: string
          created_at?: string | null
          id?: string
          is_main?: boolean | null
          kind?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          postal_code?: string | null
        }
        Update: {
          accessibility?: string[] | null
          address?: string | null
          address_complement?: string | null
          amenities?: string[] | null
          city?: string | null
          club_id?: string
          created_at?: string | null
          id?: string
          is_main?: boolean | null
          kind?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          postal_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "club_venues_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_venues_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs_public"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          access_conditions: string[] | null
          accessibility: string[] | null
          acronym: string | null
          address: string | null
          address_complement: string | null
          affiliation_number: string | null
          age_categories: string[] | null
          amenities: string[] | null
          audiences: string[] | null
          city: string | null
          claimed_by_club: boolean
          colors: string | null
          committee: string | null
          competition_categories: string[] | null
          competitions: string[] | null
          courses: string[] | null
          created_at: string
          creation_date: string | null
          dance_families: string[] | null
          department_code: string | null
          description: string | null
          discipline: string
          email: string | null
          external_id: string
          facebook_url: string | null
          federation_code: string
          fleet: string | null
          geocode_failed: boolean
          helloasso_url: string | null
          holes_total: number | null
          id: string
          instagram_url: string | null
          labels: string[] | null
          latitude: number | null
          league: string | null
          level: string | null
          licensees_female: number | null
          licensees_senior_female: number | null
          licensees_senior_male: number | null
          licensees_total: number | null
          licensees_youth: number | null
          licensees_youth_female: number | null
          licensees_youth_male: number | null
          linkedin_url: string | null
          logo_url: string | null
          longitude: number | null
          membership_fee: number | null
          min_age: number | null
          name: string
          opening_hours: string | null
          outing_durations: string[] | null
          outing_places: string[] | null
          phone: string | null
          photo_urls: string[] | null
          position_checked_at: string | null
          postal_code: string | null
          practice_info: string | null
          practice_types: string[] | null
          price_info: string | null
          region: string | null
          registration_url: string | null
          rna_number: string | null
          scraped_at: string | null
          siret: string | null
          source_url: string | null
          structure_type: string | null
          sub_disciplines: string[] | null
          tiktok_url: string | null
          trainings: string[] | null
          transports: string[] | null
          twitter_url: string | null
          updated_at: string
          video_url: string | null
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          access_conditions?: string[] | null
          accessibility?: string[] | null
          acronym?: string | null
          address?: string | null
          address_complement?: string | null
          affiliation_number?: string | null
          age_categories?: string[] | null
          amenities?: string[] | null
          audiences?: string[] | null
          city?: string | null
          claimed_by_club?: boolean
          colors?: string | null
          committee?: string | null
          competition_categories?: string[] | null
          competitions?: string[] | null
          courses?: string[] | null
          created_at?: string
          creation_date?: string | null
          dance_families?: string[] | null
          department_code?: string | null
          description?: string | null
          discipline: string
          email?: string | null
          external_id: string
          facebook_url?: string | null
          federation_code: string
          fleet?: string | null
          geocode_failed?: boolean
          helloasso_url?: string | null
          holes_total?: number | null
          id?: string
          instagram_url?: string | null
          labels?: string[] | null
          latitude?: number | null
          league?: string | null
          level?: string | null
          licensees_female?: number | null
          licensees_senior_female?: number | null
          licensees_senior_male?: number | null
          licensees_total?: number | null
          licensees_youth?: number | null
          licensees_youth_female?: number | null
          licensees_youth_male?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          longitude?: number | null
          membership_fee?: number | null
          min_age?: number | null
          name: string
          opening_hours?: string | null
          outing_durations?: string[] | null
          outing_places?: string[] | null
          phone?: string | null
          photo_urls?: string[] | null
          position_checked_at?: string | null
          postal_code?: string | null
          practice_info?: string | null
          practice_types?: string[] | null
          price_info?: string | null
          region?: string | null
          registration_url?: string | null
          rna_number?: string | null
          scraped_at?: string | null
          siret?: string | null
          source_url?: string | null
          structure_type?: string | null
          sub_disciplines?: string[] | null
          tiktok_url?: string | null
          trainings?: string[] | null
          transports?: string[] | null
          twitter_url?: string | null
          updated_at?: string
          video_url?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          access_conditions?: string[] | null
          accessibility?: string[] | null
          acronym?: string | null
          address?: string | null
          address_complement?: string | null
          affiliation_number?: string | null
          age_categories?: string[] | null
          amenities?: string[] | null
          audiences?: string[] | null
          city?: string | null
          claimed_by_club?: boolean
          colors?: string | null
          committee?: string | null
          competition_categories?: string[] | null
          competitions?: string[] | null
          courses?: string[] | null
          created_at?: string
          creation_date?: string | null
          dance_families?: string[] | null
          department_code?: string | null
          description?: string | null
          discipline?: string
          email?: string | null
          external_id?: string
          facebook_url?: string | null
          federation_code?: string
          fleet?: string | null
          geocode_failed?: boolean
          helloasso_url?: string | null
          holes_total?: number | null
          id?: string
          instagram_url?: string | null
          labels?: string[] | null
          latitude?: number | null
          league?: string | null
          level?: string | null
          licensees_female?: number | null
          licensees_senior_female?: number | null
          licensees_senior_male?: number | null
          licensees_total?: number | null
          licensees_youth?: number | null
          licensees_youth_female?: number | null
          licensees_youth_male?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          longitude?: number | null
          membership_fee?: number | null
          min_age?: number | null
          name?: string
          opening_hours?: string | null
          outing_durations?: string[] | null
          outing_places?: string[] | null
          phone?: string | null
          photo_urls?: string[] | null
          position_checked_at?: string | null
          postal_code?: string | null
          practice_info?: string | null
          practice_types?: string[] | null
          price_info?: string | null
          region?: string | null
          registration_url?: string | null
          rna_number?: string | null
          scraped_at?: string | null
          siret?: string | null
          source_url?: string | null
          structure_type?: string | null
          sub_disciplines?: string[] | null
          tiktok_url?: string | null
          trainings?: string[] | null
          transports?: string[] | null
          twitter_url?: string | null
          updated_at?: string
          video_url?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      clubs_enriched: {
        Row: {
          address: string | null
          city: string | null
          complement: string | null
          date_creation: string | null
          description: string | null
          discipline: string | null
          distrib: string | null
          email: string | null
          equipements: string[] | null
          external_id: string | null
          federation_code: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          postal_code: string | null
          region: string | null
          source_url: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          complement?: string | null
          date_creation?: string | null
          description?: string | null
          discipline?: string | null
          distrib?: string | null
          email?: string | null
          equipements?: string[] | null
          external_id?: string | null
          federation_code: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          source_url: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          complement?: string | null
          date_creation?: string | null
          description?: string | null
          discipline?: string | null
          distrib?: string | null
          email?: string | null
          equipements?: string[] | null
          external_id?: string | null
          federation_code?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          source_url?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      equipements_sportifs: {
        Row: {
          acces_libre: boolean | null
          activites: string | null
          adresse: string | null
          city: string | null
          departement: string | null
          external_id: string | null
          famille_equipement: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nom_installation: string | null
          postal_code: string | null
          region: string | null
          type_equipement: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          acces_libre?: boolean | null
          activites?: string | null
          adresse?: string | null
          city?: string | null
          departement?: string | null
          external_id?: string | null
          famille_equipement?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom_installation?: string | null
          postal_code?: string | null
          region?: string | null
          type_equipement?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          acces_libre?: boolean | null
          activites?: string | null
          adresse?: string | null
          city?: string | null
          departement?: string | null
          external_id?: string | null
          famille_equipement?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom_installation?: string | null
          postal_code?: string | null
          region?: string | null
          type_equipement?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          club_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      federations_sportives: {
        Row: {
          categorie: string
          id: string
          is_paralympique: boolean
          nom: string
          sigle: string
          site_web: string
          updated_at: string
        }
        Insert: {
          categorie: string
          id?: string
          is_paralympique?: boolean
          nom: string
          sigle: string
          site_web: string
          updated_at?: string
        }
        Update: {
          categorie?: string
          id?: string
          is_paralympique?: boolean
          nom?: string
          sigle?: string
          site_web?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      clubs_enriched_public: {
        Row: {
          address: string | null
          city: string | null
          complement: string | null
          date_creation: string | null
          description: string | null
          discipline: string | null
          distrib: string | null
          email: string | null
          external_id: string | null
          federation_code: string | null
          id: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
          phone: string | null
          postal_code: string | null
          region: string | null
          source_url: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          complement?: string | null
          date_creation?: string | null
          description?: string | null
          discipline?: string | null
          distrib?: string | null
          email?: string | null
          external_id?: string | null
          federation_code?: string | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          source_url?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          complement?: string | null
          date_creation?: string | null
          description?: string | null
          discipline?: string | null
          distrib?: string | null
          email?: string | null
          external_id?: string | null
          federation_code?: string | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          source_url?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      clubs_public: {
        Row: {
          access_conditions: string[] | null
          accessibility: string[] | null
          acronym: string | null
          address: string | null
          address_complement: string | null
          affiliation_number: string | null
          age_categories: string[] | null
          amenities: string[] | null
          audiences: string[] | null
          city: string | null
          claimed_by_club: boolean | null
          colors: string | null
          committee: string | null
          competition_categories: string[] | null
          competitions: string[] | null
          courses: string[] | null
          created_at: string | null
          creation_date: string | null
          dance_families: string[] | null
          department_code: string | null
          description: string | null
          discipline: string | null
          external_id: string | null
          facebook_url: string | null
          federation_code: string | null
          fleet: string | null
          geocode_failed: boolean | null
          helloasso_url: string | null
          holes_total: number | null
          id: string | null
          instagram_url: string | null
          labels: string[] | null
          latitude: number | null
          league: string | null
          level: string | null
          licensees_female: number | null
          licensees_senior_female: number | null
          licensees_senior_male: number | null
          licensees_total: number | null
          licensees_youth: number | null
          licensees_youth_female: number | null
          licensees_youth_male: number | null
          linkedin_url: string | null
          logo_url: string | null
          longitude: number | null
          membership_fee: number | null
          min_age: number | null
          name: string | null
          opening_hours: string | null
          outing_durations: string[] | null
          outing_places: string[] | null
          photo_urls: string[] | null
          position_checked_at: string | null
          postal_code: string | null
          practice_info: string | null
          practice_types: string[] | null
          price_info: string | null
          region: string | null
          registration_url: string | null
          rna_number: string | null
          scraped_at: string | null
          siret: string | null
          source_url: string | null
          structure_type: string | null
          sub_disciplines: string[] | null
          tiktok_url: string | null
          trainings: string[] | null
          transports: string[] | null
          twitter_url: string | null
          updated_at: string | null
          video_url: string | null
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          access_conditions?: string[] | null
          accessibility?: string[] | null
          acronym?: string | null
          address?: string | null
          address_complement?: string | null
          affiliation_number?: string | null
          age_categories?: string[] | null
          amenities?: string[] | null
          audiences?: string[] | null
          city?: string | null
          claimed_by_club?: boolean | null
          colors?: string | null
          committee?: string | null
          competition_categories?: string[] | null
          competitions?: string[] | null
          courses?: string[] | null
          created_at?: string | null
          creation_date?: string | null
          dance_families?: string[] | null
          department_code?: string | null
          description?: string | null
          discipline?: string | null
          external_id?: string | null
          facebook_url?: string | null
          federation_code?: string | null
          fleet?: string | null
          geocode_failed?: boolean | null
          helloasso_url?: string | null
          holes_total?: number | null
          id?: string | null
          instagram_url?: string | null
          labels?: string[] | null
          latitude?: number | null
          league?: string | null
          level?: string | null
          licensees_female?: number | null
          licensees_senior_female?: number | null
          licensees_senior_male?: number | null
          licensees_total?: number | null
          licensees_youth?: number | null
          licensees_youth_female?: number | null
          licensees_youth_male?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          longitude?: number | null
          membership_fee?: number | null
          min_age?: number | null
          name?: string | null
          opening_hours?: string | null
          outing_durations?: string[] | null
          outing_places?: string[] | null
          photo_urls?: string[] | null
          position_checked_at?: string | null
          postal_code?: string | null
          practice_info?: string | null
          practice_types?: string[] | null
          price_info?: string | null
          region?: string | null
          registration_url?: string | null
          rna_number?: string | null
          scraped_at?: string | null
          siret?: string | null
          source_url?: string | null
          structure_type?: string | null
          sub_disciplines?: string[] | null
          tiktok_url?: string | null
          trainings?: string[] | null
          transports?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          video_url?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          access_conditions?: string[] | null
          accessibility?: string[] | null
          acronym?: string | null
          address?: string | null
          address_complement?: string | null
          affiliation_number?: string | null
          age_categories?: string[] | null
          amenities?: string[] | null
          audiences?: string[] | null
          city?: string | null
          claimed_by_club?: boolean | null
          colors?: string | null
          committee?: string | null
          competition_categories?: string[] | null
          competitions?: string[] | null
          courses?: string[] | null
          created_at?: string | null
          creation_date?: string | null
          dance_families?: string[] | null
          department_code?: string | null
          description?: string | null
          discipline?: string | null
          external_id?: string | null
          facebook_url?: string | null
          federation_code?: string | null
          fleet?: string | null
          geocode_failed?: boolean | null
          helloasso_url?: string | null
          holes_total?: number | null
          id?: string | null
          instagram_url?: string | null
          labels?: string[] | null
          latitude?: number | null
          league?: string | null
          level?: string | null
          licensees_female?: number | null
          licensees_senior_female?: number | null
          licensees_senior_male?: number | null
          licensees_total?: number | null
          licensees_youth?: number | null
          licensees_youth_female?: number | null
          licensees_youth_male?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          longitude?: number | null
          membership_fee?: number | null
          min_age?: number | null
          name?: string | null
          opening_hours?: string | null
          outing_durations?: string[] | null
          outing_places?: string[] | null
          photo_urls?: string[] | null
          position_checked_at?: string | null
          postal_code?: string | null
          practice_info?: string | null
          practice_types?: string[] | null
          price_info?: string | null
          region?: string | null
          registration_url?: string | null
          rna_number?: string | null
          scraped_at?: string | null
          siret?: string | null
          source_url?: string | null
          structure_type?: string | null
          sub_disciplines?: string[] | null
          tiktok_url?: string | null
          trainings?: string[] | null
          transports?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          video_url?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      available_disciplines: {
        Args: never
        Returns: {
          clubs: number
          discipline: string
          subs: Json
        }[]
      }
      enrich_from_es: { Args: { batch_size?: number }; Returns: Json }
      get_club_contact: {
        Args: { p_club_id: string }
        Returns: {
          email: string
          phone: string
        }[]
      }
      get_clubs_columns: {
        Args: never
        Returns: {
          column_name: string
          data_type: string
          udt_name: string
        }[]
      }
      home_stats: { Args: never; Returns: Json }
      map_club_clusters: {
        Args: {
          p_disciplines?: string[]
          p_lat_max: number
          p_lat_min: number
          p_lng_max: number
          p_lng_min: number
          p_location?: string
          p_postal_prefixes?: string[]
          p_precision: number
          p_sub_discipline?: string
        }
        Returns: {
          cnt: number
          lat: number
          lng: number
        }[]
      }
      site_stats: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
