export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      AuditReports: {
        Row: {
          Id: string
          UserEmail: string
          Timestamp: string
          ReportData: Json
          datacenter: string
          datahall: string
          issues_reported: number
          state: 'Healthy' | 'Warning' | 'Critical'
          walkthrough_id: number
          user_full_name: string
        }
        Insert: {
          Id?: string
          UserEmail: string
          Timestamp?: string
          ReportData: Json
          datacenter: string
          datahall: string
          issues_reported: number
          state: 'Healthy' | 'Warning' | 'Critical'
          walkthrough_id: number
          user_full_name: string
        }
        Update: {
          Id?: string
          UserEmail?: string
          Timestamp?: string
          ReportData?: Json
          datacenter?: string
          datahall?: string
          issues_reported?: number
          state?: 'Healthy' | 'Warning' | 'Critical'
          walkthrough_id?: number
          user_full_name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}