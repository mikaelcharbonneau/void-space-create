
// Database types from Supabase
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  department: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  walkthroughs_completed: number;
  issues_resolved: number;
  reports_generated: number;
  updated_at: string;
}

export interface AuditReport {
  Id: string;
  GeneratedBy: string;
  Timestamp: string;
  datacenter: string;
  datahall: string;
  issues_reported: number;
  state: 'Healthy' | 'Warning' | 'Critical';
  walkthrough_id: number;
  user_full_name: string;
  ReportData: any;
}

export interface Incident {
  id: string;
  location: string;
  datahall: string;
  rack_number: string;
  part_type: string;
  part_identifier: string;
  u_height?: string;
  description: string;
  comments?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Report {
  id: string;
  title: string;
  generated_by: string;
  generated_at: string;
  date_range_start: string;
  date_range_end: string;
  datacenter?: string;
  datahall?: string;
  status: string;
  total_incidents: number;
  report_data: any;
}

// Legacy types for backwards compatibility
export interface Inspection extends AuditReport {}

export interface Issue extends Incident {}

export type IssueStatus = Incident['status'];
export type InspectionStatus = AuditReport['state'];
export type InspectionData = AuditReport;

// Rack location mapping
export interface RackMapping {
  [key: string]: string[];
}

// Form types
export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'checkbox' | 'barcode' | 'file' | 'location';
  options?: FormFieldOption[];
  required?: boolean;
  value?: string;
  placeholder?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}
