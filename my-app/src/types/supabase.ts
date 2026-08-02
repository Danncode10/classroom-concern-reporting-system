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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          app_id: string
          created_at: string
          event_type: string
          id: string
          ip_hash: string | null
          organization_id: string
          page_path: string | null
          properties: Json
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          app_id?: string
          created_at?: string
          event_type: string
          id?: string
          ip_hash?: string | null
          organization_id: string
          page_path?: string | null
          properties?: Json
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string
          event_type?: string
          id?: string
          ip_hash?: string | null
          organization_id?: string
          page_path?: string | null
          properties?: Json
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          app_id: string
          created_at: string
          diff: Json | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          organization_id: string
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          app_id?: string
          created_at?: string
          diff?: Json | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          organization_id: string
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          app_id?: string
          created_at?: string
          diff?: Json | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          organization_id?: string
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          app_id: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          organization_id: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          app_id?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          organization_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          app_id?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          organization_id?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          app_id: string
          confirmed_date: string | null
          confirmed_time: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          lead_id: string | null
          notes: string | null
          organization_id: string
          package: string | null
          payment_status: string
          preferred_date: string | null
          preferred_time: string | null
          price_paid: number | null
          price_quoted: number | null
          service_id: string | null
          service_name: string
          source: string
          status: string
          updated_at: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_type: string | null
          vehicle_year: string | null
        }
        Insert: {
          app_id?: string
          confirmed_date?: string | null
          confirmed_time?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          organization_id: string
          package?: string | null
          payment_status?: string
          preferred_date?: string | null
          preferred_time?: string | null
          price_paid?: number | null
          price_quoted?: number | null
          service_id?: string | null
          service_name: string
          source?: string
          status?: string
          updated_at?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: string | null
        }
        Update: {
          app_id?: string
          confirmed_date?: string | null
          confirmed_time?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          organization_id?: string
          package?: string | null
          payment_status?: string
          preferred_date?: string | null
          preferred_time?: string | null
          price_paid?: number | null
          price_quoted?: number | null
          service_id?: string | null
          service_name?: string
          source?: string
          status?: string
          updated_at?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      concern_reports: {
        Row: {
          author_id: string
          category: Database["public"]["Enums"]["concern_category"]
          created_at: string
          description: string
          id: string
          is_removed: boolean
          location: string | null
          removal_reason: string | null
          removed_at: string | null
          removed_by: string | null
          status: Database["public"]["Enums"]["concern_status"]
          title: string
          updated_at: string
          vote_score: number
        }
        Insert: {
          author_id: string
          category?: Database["public"]["Enums"]["concern_category"]
          created_at?: string
          description: string
          id?: string
          is_removed?: boolean
          location?: string | null
          removal_reason?: string | null
          removed_at?: string | null
          removed_by?: string | null
          status?: Database["public"]["Enums"]["concern_status"]
          title: string
          updated_at?: string
          vote_score?: number
        }
        Update: {
          author_id?: string
          category?: Database["public"]["Enums"]["concern_category"]
          created_at?: string
          description?: string
          id?: string
          is_removed?: boolean
          location?: string | null
          removal_reason?: string | null
          removed_at?: string | null
          removed_by?: string | null
          status?: Database["public"]["Enums"]["concern_status"]
          title?: string
          updated_at?: string
          vote_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "concern_reports_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concern_reports_removed_by_fkey"
            columns: ["removed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      concern_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["concern_status"]
          note: string | null
          old_status: Database["public"]["Enums"]["concern_status"] | null
          report_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["concern_status"]
          note?: string | null
          old_status?: Database["public"]["Enums"]["concern_status"] | null
          report_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["concern_status"]
          note?: string | null
          old_status?: Database["public"]["Enums"]["concern_status"] | null
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concern_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concern_status_history_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "concern_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      concern_votes: {
        Row: {
          created_at: string
          id: string
          report_id: string
          updated_at: string
          value: number
          voter_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          report_id: string
          updated_at?: string
          value: number
          voter_id: string
        }
        Update: {
          created_at?: string
          id?: string
          report_id?: string
          updated_at?: string
          value?: number
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concern_votes_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "concern_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concern_votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          app_id: string
          before_image_url: string | null
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_published: boolean
          organization_id: string
          service_tag: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          app_id?: string
          before_image_url?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_published?: boolean
          organization_id: string
          service_tag?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          app_id?: string
          before_image_url?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_published?: boolean
          organization_id?: string
          service_tag?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          app_id: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          service_interest: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          app_id?: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          service_interest?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          app_id?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          service_interest?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_actions: {
        Row: {
          action: Database["public"]["Enums"]["moderation_action"]
          admin_id: string
          created_at: string
          id: string
          metadata: Json
          reason: string | null
          report_id: string | null
          target_user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["moderation_action"]
          admin_id: string
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          report_id?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["moderation_action"]
          admin_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          report_id?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "concern_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_actions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          app_id: string
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          metadata: Json
          organization_id: string
          title: string
          type: string
        }
        Insert: {
          app_id?: string
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          metadata?: Json
          organization_id: string
          title: string
          type: string
        }
        Update: {
          app_id?: string
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          metadata?: Json
          organization_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          app_id: string
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          app_id?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          app_id: string
          birthday: string | null
          blocked_at: string | null
          blocked_reason: string | null
          created_at: string
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_blocked: boolean
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          school_id: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          app_id?: string
          birthday?: string | null
          blocked_at?: string | null
          blocked_reason?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_blocked?: boolean
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          school_id?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          app_id?: string
          birthday?: string | null
          blocked_at?: string | null
          blocked_reason?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_blocked?: boolean
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          school_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          app_id: string
          category: string | null
          created_at: string
          description: string | null
          display_order: number | null
          duration_minutes: number | null
          icon: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          name: string
          organization_id: string
          price_from: number | null
          price_label: string | null
          price_to: number | null
          short_desc: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          app_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          name: string
          organization_id: string
          price_from?: number | null
          price_label?: string | null
          price_to?: number | null
          short_desc?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          app_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          name?: string
          organization_id?: string
          price_from?: number | null
          price_label?: string | null
          price_to?: number | null
          short_desc?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      concern_category:
        | "equipment"
        | "electrical"
        | "cleanliness"
        | "facility"
        | "safety"
        | "other"
      concern_status:
        | "submitted"
        | "in_review"
        | "in_progress"
        | "resolved"
        | "rejected"
      moderation_action:
        | "block_user"
        | "unblock_user"
        | "remove_report"
        | "restore_report"
        | "change_status"
      user_role: "admin" | "user"
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
    Enums: {
      concern_category: [
        "equipment",
        "electrical",
        "cleanliness",
        "facility",
        "safety",
        "other",
      ],
      concern_status: [
        "submitted",
        "in_review",
        "in_progress",
        "resolved",
        "rejected",
      ],
      moderation_action: [
        "block_user",
        "unblock_user",
        "remove_report",
        "restore_report",
        "change_status",
      ],
      user_role: ["admin", "user"],
    },
  },
} as const
