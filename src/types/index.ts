
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  lastInspectionDate?: string;
}

export interface Inspection {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: InspectionData;
  id?: string; // For backwards compatibility
  status?: string;
  location?: string; // Add location property
}

export interface InspectionData {
  datahall: string;
  status: string;
  isUrgent: boolean;
  temperatureReading: string;
  humidityReading: string;
  comments?: string;
  securityPassed: boolean;
  coolingSystemCheck: boolean;
  [key: string]: any;
}

export interface Report {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: InspectionData;
  id?: string; // For backwards compatibility
  title?: string;
  location?: string; // Add location property
}

export interface RackMapping {
  [datahall: string]: string[];
}

export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type InspectionStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  location?: string; // Add location property
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'barcode' | 'file' | 'location';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; }[];
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}
