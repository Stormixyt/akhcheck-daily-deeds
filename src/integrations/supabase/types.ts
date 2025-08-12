export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_coaching_sessions: {
        Row: {
          conversation_history: Json | null
          created_at: string
          id: string
          session_type: string
          tone_preference: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_history?: Json | null
          created_at?: string
          id?: string
          session_type?: string
          tone_preference?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_history?: Json | null
          created_at?: string
          id?: string
          session_type?: string
          tone_preference?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_check_ins: {
        Row: {
          check_date: string
          created_at: string
          group_id: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          check_date?: string
          created_at?: string
          group_id?: string | null
          id?: string
          status: string
          user_id: string
        }
        Update: {
          check_date?: string
          created_at?: string
          group_id?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_check_ins_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participations: {
        Row: {
          completed: boolean | null
          current_progress: number | null
          event_id: string | null
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          current_progress?: number | null
          event_id?: string | null
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          current_progress?: number | null
          event_id?: string | null
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "group_events"
            referencedColumns: ["id"]
          },
        ]
      }
      fasting_tracker: {
        Row: {
          broken_reason: string | null
          completed: boolean | null
          created_at: string
          fast_date: string
          fast_type: string
          id: string
          user_id: string
        }
        Insert: {
          broken_reason?: string | null
          completed?: boolean | null
          created_at?: string
          fast_date: string
          fast_type?: string
          id?: string
          user_id: string
        }
        Update: {
          broken_reason?: string | null
          completed?: boolean | null
          created_at?: string
          fast_date?: string
          fast_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      group_events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          event_type: string
          group_id: string | null
          id: string
          start_date: string
          target_value: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          event_type?: string
          group_id?: string | null
          id?: string
          start_date: string
          target_value?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          event_type?: string
          group_id?: string | null
          id?: string
          start_date?: string
          target_value?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_goals: {
        Row: {
          completed: boolean
          created_at: string
          created_by: string
          current_count: number
          description: string | null
          group_id: string
          id: string
          target_count: number
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          created_by: string
          current_count?: number
          description?: string | null
          group_id: string
          id?: string
          target_count?: number
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          created_by?: string
          current_count?: number
          description?: string | null
          group_id?: string
          id?: string
          target_count?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          created_at: string
          deleted_for_everyone: boolean | null
          deleted_for_user: Json | null
          edited_at: string | null
          group_id: string
          id: string
          image_url: string | null
          message: string | null
          metadata: Json | null
          pinned: boolean | null
          pinned_at: string | null
          pinned_by: string | null
          read_by: Json | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_for_everyone?: boolean | null
          deleted_for_user?: Json | null
          edited_at?: string | null
          group_id: string
          id?: string
          image_url?: string | null
          message?: string | null
          metadata?: Json | null
          pinned?: boolean | null
          pinned_at?: string | null
          pinned_by?: string | null
          read_by?: Json | null
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_for_everyone?: boolean | null
          deleted_for_user?: Json | null
          edited_at?: string | null
          group_id?: string
          id?: string
          image_url?: string | null
          message?: string | null
          metadata?: Json | null
          pinned?: boolean | null
          pinned_at?: string | null
          pinned_by?: string | null
          read_by?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_streaks: {
        Row: {
          created_at: string
          current_streak: number
          group_id: string
          id: string
          last_check_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          group_id: string
          id?: string
          last_check_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          group_id?: string
          id?: string
          last_check_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_streaks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: true
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          code: string
          created_at: string
          created_by: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code?: string
          created_at?: string
          created_by: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string | null
          reaction: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id?: string | null
          reaction: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string | null
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_tracking: {
        Row: {
          asr: boolean | null
          created_at: string
          dhuhr: boolean | null
          fajr: boolean | null
          id: string
          isha: boolean | null
          maghrib: boolean | null
          prayer_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          asr?: boolean | null
          created_at?: string
          dhuhr?: boolean | null
          fajr?: boolean | null
          id?: string
          isha?: boolean | null
          maghrib?: boolean | null
          prayer_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          asr?: boolean | null
          created_at?: string
          dhuhr?: boolean | null
          fajr?: boolean | null
          id?: string
          isha?: boolean | null
          maghrib?: boolean | null
          prayer_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string | null
          id: string
          onboarding_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          onboarding_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      streak_revival_tokens: {
        Row: {
          created_at: string
          id: string
          last_earned_at: string | null
          tokens_available: number | null
          tokens_used: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_earned_at?: string | null
          tokens_available?: number | null
          tokens_used?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_earned_at?: string | null
          tokens_available?: number | null
          tokens_used?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sub_groups: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          parent_group_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          parent_group_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          parent_group_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_groups_parent_group_id_fkey"
            columns: ["parent_group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          is_default: boolean
          lock_reason: string | null
          locked_until: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          lock_reason?: string | null
          locked_until?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          lock_reason?: string | null
          locked_until?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          anonymous_mode: boolean
          auto_logout_minutes: number | null
          blur_intensity: number | null
          created_at: string
          daily_reminder: boolean
          dark_mode: boolean
          font_choice: string | null
          has_seen_v11_update: boolean
          has_seen_v12_update: boolean
          id: string
          premium: boolean
          private_mode: boolean
          public_accountability: boolean
          quiet_mode: boolean
          reminder_time: string
          repeat_warnings: boolean
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          anonymous_mode?: boolean
          auto_logout_minutes?: number | null
          blur_intensity?: number | null
          created_at?: string
          daily_reminder?: boolean
          dark_mode?: boolean
          font_choice?: string | null
          has_seen_v11_update?: boolean
          has_seen_v12_update?: boolean
          id?: string
          premium?: boolean
          private_mode?: boolean
          public_accountability?: boolean
          quiet_mode?: boolean
          reminder_time?: string
          repeat_warnings?: boolean
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          anonymous_mode?: boolean
          auto_logout_minutes?: number | null
          blur_intensity?: number | null
          created_at?: string
          daily_reminder?: boolean
          dark_mode?: boolean
          font_choice?: string | null
          has_seen_v11_update?: boolean
          has_seen_v12_update?: boolean
          id?: string
          premium?: boolean
          private_mode?: boolean
          public_accountability?: boolean
          quiet_mode?: boolean
          reminder_time?: string
          repeat_warnings?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_group_admin: {
        Args: { group_id: string; user_id: string }
        Returns: boolean
      }
      is_group_member: {
        Args: { group_id: string; user_id: string }
        Returns: boolean
      }
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
