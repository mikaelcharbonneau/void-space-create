
import { User, UserProfile, UserStats, AuditReport, Incident, Report, FormSection } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'john.doe@hpe.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockUserProfile: UserProfile = {
  user_id: '1',
  full_name: 'John Doe',
  avatar_url: null,
  phone: '+1-555-0123',
  department: 'Data Center Operations',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockUserStats: UserStats = {
  user_id: '1',
  walkthroughs_completed: 42,
  issues_resolved: 38,
  reports_generated: 15,
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockInspections: AuditReport[] = [
  {
    Id: '1',
    GeneratedBy: 'john.doe@hpe.com',
    Timestamp: '2024-01-15T10:30:00Z',
    datacenter: 'Houston DC',
    datahall: 'DH-A',
    issues_reported: 2,
    state: 'Warning',
    walkthrough_id: 1,
    user_full_name: 'John Doe',
    ReportData: {}
  },
  {
    Id: '2', 
    GeneratedBy: 'jane.smith@hpe.com',
    Timestamp: '2024-01-14T14:20:00Z',
    datacenter: 'Houston DC',
    datahall: 'DH-B',
    issues_reported: 0,
    state: 'Healthy',
    walkthrough_id: 2,
    user_full_name: 'Jane Smith',
    ReportData: {}
  },
  {
    Id: '3',
    GeneratedBy: 'mike.johnson@hpe.com', 
    Timestamp: '2024-01-13T09:15:00Z',
    datacenter: 'Austin DC',
    datahall: 'DH-C',
    issues_reported: 5,
    state: 'Critical',
    walkthrough_id: 3,
    user_full_name: 'Mike Johnson',
    ReportData: {}
  },
  {
    Id: '4',
    GeneratedBy: 'sarah.wilson@hpe.com',
    Timestamp: '2024-01-12T16:45:00Z', 
    datacenter: 'Austin DC',
    datahall: 'DH-A',
    issues_reported: 1,
    state: 'Warning',
    walkthrough_id: 4,
    user_full_name: 'Sarah Wilson',
    ReportData: {}
  }
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    location: 'Houston DC',
    datahall: 'DH-A',
    rack_number: 'R-001',
    part_type: 'PSU',
    part_identifier: 'PSU 1',
    u_height: 'U42',
    description: 'PSU amber LED indicating potential failure',
    comments: 'Requires immediate attention',
    severity: 'high',
    status: 'open',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    user_id: '1'
  },
  {
    id: '2',
    location: 'Houston DC', 
    datahall: 'DH-A',
    rack_number: 'R-003',
    part_type: 'PDU',
    part_identifier: 'PDU A',
    description: 'PDU tripped breaker causing power issues',
    severity: 'critical',
    status: 'in-progress',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:30:00Z',
    user_id: '1'
  },
  {
    id: '3',
    location: 'Austin DC',
    datahall: 'DH-C', 
    rack_number: 'R-007',
    part_type: 'RDHX',
    part_identifier: 'RDHX-1',
    description: 'RDHX water leak detected',
    comments: 'Maintenance team notified',
    severity: 'critical',
    status: 'resolved',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-13T15:20:00Z',
    user_id: '3'
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Weekly Infrastructure Report - Week 2',
    generated_by: '1',
    generated_at: '2024-01-15T17:00:00Z',
    date_range_start: '2024-01-08T00:00:00Z', 
    date_range_end: '2024-01-14T23:59:59Z',
    datacenter: 'Houston DC',
    datahall: 'DH-A',
    status: 'published',
    total_incidents: 8,
    report_data: {}
  },
  {
    id: '2',
    title: 'Monthly Critical Issues Summary',
    generated_by: '2',
    generated_at: '2024-01-10T12:00:00Z',
    date_range_start: '2023-12-01T00:00:00Z',
    date_range_end: '2023-12-31T23:59:59Z',
    datacenter: 'Austin DC', 
    status: 'published',
    total_incidents: 23,
    report_data: {}
  },
  {
    id: '3',
    title: 'Q4 Infrastructure Assessment',
    generated_by: '1',
    generated_at: '2024-01-05T09:30:00Z',
    date_range_start: '2023-10-01T00:00:00Z',
    date_range_end: '2023-12-31T23:59:59Z',
    status: 'published',
    total_incidents: 67,
    report_data: {}
  }
];

export const mockFormSections: FormSection[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    fields: [
      {
        id: 'location',
        label: 'Location',
        type: 'select',
        options: ['Houston DC', 'Austin DC', 'Dallas DC'],
        required: true
      },
      {
        id: 'datahall', 
        label: 'Data Hall',
        type: 'select',
        options: ['DH-A', 'DH-B', 'DH-C'],
        required: true
      }
    ]
  },
  {
    id: 'issue-details',
    title: 'Issue Details',
    fields: [
      {
        id: 'rack-number',
        label: 'Rack Number',
        type: 'text',
        required: true
      },
      {
        id: 'issue-type',
        label: 'Issue Type',
        type: 'select', 
        options: ['PSU', 'PDU', 'RDHX', 'Other'],
        required: true
      },
      {
        id: 'description',
        label: 'Description',
        type: 'textarea',
        required: true
      }
    ]
  }
];
