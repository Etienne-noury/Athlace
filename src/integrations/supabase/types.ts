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
      clubs_foot: {
        Row: {
          code_postal: string | null
          created_at: string
          data_es_id: string
          google_nb_avis: number | null
          google_rating: number | null
          horaires: Json | null
          id: string
          niveau_ligue: string | null
          nom: string
          prix_adulte: number | null
          prix_enfant: number | null
          site_web: string | null
          telephone: string | null
          updated_at: string
          ville: string | null
        }
        Insert: {
          code_postal?: string | null
          created_at?: string
          data_es_id: string
          google_nb_avis?: number | null
          google_rating?: number | null
          horaires?: Json | null
          id?: string
          niveau_ligue?: string | null
          nom: string
          prix_adulte?: number | null
          prix_enfant?: number | null
          site_web?: string | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Update: {
          code_postal?: string | null
          created_at?: string
          data_es_id?: string
          google_nb_avis?: number | null
          google_rating?: number | null
          horaires?: Json | null
          id?: string
          niveau_ligue?: string | null
          nom?: string
          prix_adulte?: number | null
          prix_enfant?: number | null
          site_web?: string | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
        }
        Relationships: []
      }
      clubs_foot_suggestions: {
        Row: {
          created_at: string
          data_es_id: string
          horaires_text: string | null
          id: string
          niveau_ligue: string | null
          nom: string | null
          prix_adulte: number | null
          prix_enfant: number | null
          site_web: string | null
          status: string
          telephone: string | null
          ville: string | null
        }
        Insert: {
          created_at?: string
          data_es_id: string
          horaires_text?: string | null
          id?: string
          niveau_ligue?: string | null
          nom?: string | null
          prix_adulte?: number | null
          prix_enfant?: number | null
          site_web?: string | null
          status?: string
          telephone?: string | null
          ville?: string | null
        }
        Update: {
          created_at?: string
          data_es_id?: string
          horaires_text?: string | null
          id?: string
          niveau_ligue?: string | null
          nom?: string | null
          prix_adulte?: number | null
          prix_enfant?: number | null
          site_web?: string | null
          status?: string
          telephone?: string | null
          ville?: string | null
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
    }
    Functions: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
