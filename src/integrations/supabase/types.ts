export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      AuditReports: {
        Row: {
          datacenter: string
          datahall: string
          GeneratedBy: string
          Id: string
          issues_reported: number
          ReportData: Json | null
          state: string
          Timestamp: string
          user_full_name: string
          walkthrough_id: number
        }
        Insert: {
          datacenter: string
          datahall: string
          GeneratedBy: string
          Id?: string
          issues_reported?: number
          ReportData?: Json | null
          state?: string
          Timestamp?: string
          user_full_name: string
          walkthrough_id: number
        }
        Update: {
          datacenter?: string
          datahall?: string
          GeneratedBy?: string
          Id?: string
          issues_reported?: number
          ReportData?: Json | null
          state?: string
          Timestamp?: string
          user_full_name?: string
          walkthrough_id?: number
        }
        Relationships: []
      }
      incidents: {
        Row: {
          comments: string | null
          created_at: string
          datahall: string
          description: string
          id: string
          location: string
          part_identifier: string
          part_type: string
          rack_number: string
          severity: Database["public"]["Enums"]["incident_severity"]
          status: Database["public"]["Enums"]["incident_status"]
          u_height: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string
          datahall: string
          description?: string
          id?: string
          location: string
          part_identifier: string
          part_type: string
          rack_number: string
          severity: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          u_height?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string
          datahall?: string
          description?: string
          id?: string
          location?: string
          part_identifier?: string
          part_type?: string
          rack_number?: string
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          u_height?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          datacenter: string | null
          datahall: string | null
          date_range_end: string
          date_range_start: string
          generated_at: string
          generated_by: string
          id: string
          report_data: Json
          status: string
          title: string
          total_incidents: number
        }
        Insert: {
          datacenter?: string | null
          datahall?: string | null
          date_range_end: string
          date_range_start: string
          generated_at?: string
          generated_by: string
          id?: string
          report_data?: Json
          status?: string
          title: string
          total_incidents?: number
        }
        Update: {
          datacenter?: string | null
          datahall?: string | null
          date_range_end?: string
          date_range_start?: string
          generated_at?: string
          generated_by?: string
          id?: string
          report_data?: Json
          status?: string
          title?: string
          total_incidents?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          department: string
          full_name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          department?: string
          full_name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          department?: string
          full_name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          issues_resolved: number
          reports_generated: number
          updated_at: string
          user_id: string
          walkthroughs_completed: number
        }
        Insert: {
          issues_resolved?: number
          reports_generated?: number
          updated_at?: string
          user_id: string
          walkthroughs_completed?: number
        }
        Update: {
          issues_resolved?: number
          reports_generated?: number
          updated_at?: string
          user_id?: string
          walkthroughs_completed?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      incident_severity: "critical" | "high" | "medium" | "low"
      incident_status: "open" | "in-progress" | "resolved"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      incident_severity: ["critical", "high", "medium", "low"],
      incident_status: ["open", "in-progress", "resolved"],
    },
  },
} as const
