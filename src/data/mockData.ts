import { User, Inspection, Report, Issue, FormSection } from '../types';

export const datacenters = [
  { 
    id: 'island-1',
    name: 'Island 01',
    location: 'Canada - Quebec Q01'
  },
  {
    id: 'island-8',
    name: 'Island 08',
    location: 'Canada - Quebec Q01'
  },
  {
    id: 'island-9',
    name: 'Island 09',
    location: 'Canada - Quebec Q01'
  },
  {
    id: 'island-10',
    name: 'Island 10',
    location: 'Canada - Quebec Q01'
  },
  {
    id: 'island-11',
    name: 'Island 11',
    location: 'Canada - Quebec Q01'
  },
  {
    id: 'island-12',
    name: 'Island 12',
    location: 'Canada - Quebec Q01'
  },
  {
    id: 'cirrus',
    name: 'Cirrus',
    location: 'Canada - Quebec Q01'
  }
];

export const racksByDatahall: Record<string, string[]> = {
  'island-1': [
    'X2401', 'X2402', 'X2403', 'X2404', 'X2405', 'X2406', 'X2407', 'X2408',
    'X2409', 'X2410', 'X2411', 'X2412', 'X2413', 'X2414', 'X2415', 'X2416',
    'X2501', 'X2502', 'X2503', 'X2504', 'X2505', 'X2506', 'X2507', 'X2508',
    'X2509', 'X2510', 'X2511', 'X2512', 'X2513', 'X2514', 'X2515', 'X2516',
    'X2601', 'X2602', 'X2603', 'X2604', 'X2605', 'X2606', 'X2607', 'X2608',
    'X2609', 'X2610', 'X2611', 'X2612', 'X2613', 'X2614', 'X2615', 'X2616',
    'X2701', 'X2702', 'X2703', 'X2704', 'X2705', 'X2706', 'X2707', 'X2708',
    'X2709', 'X2710', 'X2711', 'X2712', 'X2713', 'X2714', 'X2715', 'X2716',
    'X2801', 'X2802', 'X2803', 'X2804', 'X2805', 'X2806', 'X2807', 'X2808',
    'X2809', 'X2810', 'X2811', 'X2812', 'X2813', 'X2814', 'X2815', 'X2816',
    'X2901', 'X2902', 'X2903', 'X2904', 'X2905', 'X2906', 'X2907', 'X2908',
    'X2909', 'X2910', 'X2911', 'X2912', 'X2913', 'X2914', 'X2915', 'X2916'
  ],
  'island-8': [
    'X2101', 'X2102', 'X2103', 'X2104', 'X2105', 'X2106', 'X2107', 'X2108',
    'X2109', 'X2110', 'X2111', 'X2112', 'X2113', 'X2114', 'X2115', 'X2116',
    'X2201', 'X2202', 'X2206', 'X2207', 'X2208', 'X2209', 'X2210', 'X2215',
    'X2216', 'X2301', 'X2302', 'X2303', 'X2304', 'X2305', 'X2306', 'X2307',
    'X2308', 'X2309', 'X2310', 'X2311', 'X2312', 'X2313', 'X2314', 'X2315',
    'X2316'
  ],
  'island-9': [
    'X230101', 'X230102', 'X230103', 'X230104', 'X230105', 'X230106', 'X230107', 'X230108',
    'X230109', 'X230110', 'X230111', 'X230112', 'X230113', 'X230114', 'X230115', 'X230116',
    'X230117', 'X230118', 'X230201', 'X230202', 'X230203', 'X230204', 'X230205', 'X230206',
    'X230207', 'X230208', 'X230209', 'X230210', 'X230211', 'X230212', 'X230213', 'X230214',
    'X230215', 'X230216', 'X230217', 'X230218', 'X230301', 'X230302', 'X230303', 'X230304',
    'X230305', 'X230306', 'X230307', 'X230308', 'X230309', 'X230310', 'X230311', 'X230312',
    'X230313', 'X230314', 'X230315', 'X230316', 'X230317', 'X230318', 'X230319', 'X230401',
    'X230402', 'X230403', 'X230404', 'X230405', 'X230406', 'X230407', 'X230408', 'X230409',
    'X230410', 'X230411', 'X230412', 'X230413', 'X230414', 'X230415', 'X230416', 'X230417',
    'X230418'
  ],
  'island-10': [
    'X230501', 'X230502', 'X230503', 'X230504', 'X230505', 'X230506', 'X230507', 'X230508',
    'X230509', 'X230510', 'X230511', 'X230512', 'X230513', 'X230514', 'X230515', 'X230516',
    'X230517', 'X230518', 'X230601', 'X230602', 'X230603', 'X230604', 'X230605', 'X230606',
    'X230607', 'X230608', 'X230609', 'X230610', 'X230611', 'X230612', 'X230613', 'X230614',
    'X230615', 'X230616', 'X230617', 'X230618', 'X230701', 'X230702', 'X230703', 'X230704',
    'X230705', 'X230706', 'X230707', 'X230708', 'X230709', 'X230710', 'X230711', 'X230712',
    'X230713', 'X230714', 'X230715', 'X230716', 'X230717', 'X230718', 'X230719', 'X230801',
    'X230802', 'X230803', 'X230804', 'X230805', 'X230806', 'X230807', 'X230808', 'X230809',
    'X230810', 'X230811', 'X230812', 'X230813', 'X230814', 'X230815', 'X230816', 'X230817',
    'X230818'
  ],
  'island-11': [
    'X230901', 'X230902', 'X230903', 'X230904', 'X230905', 'X230906', 'X230907', 'X230908',
    'X230909', 'X230910', 'X230911', 'X230912', 'X230913', 'X230914', 'X230915', 'X230916',
    'X230917', 'X230918', 'X230919', 'X231001', 'X231002', 'X231003', 'X231004', 'X231005',
    'X231006', 'X231007', 'X231008', 'X231009', 'X231010', 'X231011', 'X231012', 'X231013',
    'X231014', 'X231015', 'X231016', 'X231017', 'X231018', 'X231101', 'X231102', 'X231103',
    'X231104', 'X231105', 'X231106', 'X231107', 'X231108', 'X231109', 'X231110', 'X231111',
    'X231112', 'X231113', 'X231114', 'X231115', 'X231116', 'X231117', 'X231118', 'X231201',
    'X231202', 'X231203', 'X231204', 'X231205', 'X231206', 'X231207', 'X231208', 'X231209',
    'X231210', 'X231211', 'X231212', 'X231213', 'X231214', 'X231215', 'X231216', 'X231217',
    'X231218'
  ],
  'island-12': [
    'X221301', 'X221302', 'X221303', 'X221304', 'X221305', 'X221306', 'X221307', 'X221308',
    'X221309', 'X221310', 'X221311', 'X221312', 'X221313', 'X221314', 'X221315', 'X221316',
    'X221317', 'X221318', 'X221319', 'X221320', 'X221321', 'X221322', 'X221323', 'X221324',
    'X221325', 'X221401', 'X221402', 'X221403', 'X221404', 'X221405', 'X221406', 'X221407',
    'X221408', 'X221409', 'X221410', 'X221411', 'X221412', 'X221413', 'X221414', 'X221415',
    'X221416', 'X221417', 'X221418', 'X221501', 'X221502', 'X221503', 'X221504', 'X221505',
    'X221506', 'X221507', 'X221508', 'X221509', 'X221510', 'X221511', 'X221512', 'X221513',
    'X221514', 'X221515', 'X221516', 'X221517', 'X221518', 'X221601', 'X221602', 'X221603',
    'X221604', 'X221605', 'X221606', 'X221607', 'X221608', 'X221609', 'X221610', 'X221611',
    'X221612', 'X221613', 'X221614', 'X221615', 'X221616', 'X221617', 'X221618'
  ],
  'cirrus': [
    'X3401', 'X3402', 'X3403', 'X3404', 'X3405', 'X3406', 'X3407', 'X3408', 'X3409', 'X3410',
    'X3411', 'X3412', 'X3413', 'X3414', 'X3415', 'X3416', 'X3502', 'X3504', 'X3505', 'X3507',
    'X3508', 'X3509', 'X3510', 'X3512', 'X3513', 'X3514', 'X3515', 'X3516', 'X3701', 'X3702',
    'X3703', 'X3704', 'X3801', 'X3802', 'X3803', 'X3804', 'X3805', 'X3806', 'X3807', 'X3808',
    'X3809', 'X3810', 'X3811', 'X3812', 'X3813', 'X3814', 'X3815', 'X3816'
  ]
};

export const currentUser: User = {
  id: '1',
  name: 'Mikael Charbonneau',
  email: 'mikael.charbonneau@hpe.com',
  role: 'Senior Technician',
  lastInspectionDate: '2025-05-05',
};

export const recentInspections: Inspection[] = [
  {
    id: '1',
    status: 'completed',
    location: 'Canada - Quebec Q01, Island 01',
    date: '2025-05-05',
    issueCount: 2,
    completedBy: currentUser.id,
  },
  {
    id: '2',
    status: 'in-progress',
    location: 'Canada - Quebec Q01, Island 08',
    date: '2025-05-05',
    issueCount: 5,
  },
  {
    id: '3',
    status: 'completed',
    location: 'Canada - Quebec Q01, Island 09',
    date: '2025-05-04',
    issueCount: 0,
    completedBy: currentUser.id,
  },
  {
    id: '4',
    status: 'completed',
    location: 'Canada - Quebec Q01, Cirrus',
    date: '2025-05-04',
    issueCount: 3,
    completedBy: currentUser.id,
  },
];

export const issues: Issue[] = [
  {
    id: '1',
    description: 'Faulty cooling system in rack A3',
    status: 'resolved',
    severity: 'high',
    location: 'Canada - Quebec Q01, Island 01',
    createdAt: '2025-05-05T09:00:00Z',
    updatedAt: '2025-05-05T14:00:00Z',
    assignedTo: currentUser.id,
  },
  {
    id: '2',
    description: 'PDU showing intermittent power fluctuations',
    status: 'in-progress',
    severity: 'medium',
    location: 'Canada - Quebec Q01, Island 08',
    createdAt: '2025-05-05T11:00:00Z',
    updatedAt: '2025-05-05T16:00:00Z',
    assignedTo: currentUser.id,
  },
  {
    id: '3',
    description: 'UPS battery replacement needed',
    status: 'open',
    severity: 'low',
    location: 'Canada - Quebec Q01, Island 09',
    createdAt: '2025-05-05T08:00:00Z',
    updatedAt: '2025-05-05T08:00:00Z',
  },
  {
    id: '4',
    description: 'Network switch unresponsive',
    status: 'open',
    severity: 'critical',
    location: 'Canada - Quebec Q01, Cirrus',
    createdAt: '2025-05-05T10:00:00Z',
    updatedAt: '2025-05-05T10:00:00Z',
  },
  {
    id: '5',
    description: 'Temperature sensors showing incorrect readings',
    status: 'in-progress',
    severity: 'medium',
    location: 'Canada - Quebec Q01, Island 01',
    createdAt: '2025-05-04T13:15:00Z',
    updatedAt: '2025-05-04T09:30:00Z',
    assignedTo: currentUser.id,
  },
  {
    id: '6',
    description: 'Fire suppression system needs inspection',
    status: 'resolved',
    severity: 'high',
    location: 'Canada - Quebec Q01, Island 08',
    createdAt: '2025-05-04T11:20:00Z',
    updatedAt: '2025-05-04T16:45:00Z',
    assignedTo: currentUser.id,
  },
  {
    id: '7',
    description: 'Water leak detected near CRAC unit',
    status: 'resolved',
    severity: 'critical',
    location: 'Canada - Quebec Q01, Island 01',
    createdAt: '2025-05-04T08:10:00Z',
    updatedAt: '2025-05-04T14:30:00Z',
    assignedTo: currentUser.id,
  },
];

export const reports: Report[] = [
  {
    id: '1',
    title: 'Daily Issue Report - May 5th 2025',
    location: 'Canada - Quebec Q01, Island 01',
    date: '2025-05-05',
    thumbnail: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
    issues: [
      issues[0],
      issues[2],
      issues[4],
    ],
    summary: 'Daily inspection revealed 3 issues in Island 01, primarily related to cooling and power systems. All critical issues have been addressed.',
    recommendations: 'Schedule preventive maintenance for cooling systems and replace UPS batteries in the next maintenance window.'
  },
  {
    id: '2',
    title: 'Daily Issue Report - May 4th 2025',
    location: 'Canada - Quebec Q01, Island 08',
    date: '2025-05-04',
    thumbnail: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
    issues: [
      issues[1],
      issues[5],
    ],
    summary: 'Daily inspection of Island 08 identified 2 issues that require attention. The fire suppression system has been inspected and certified.',
    recommendations: 'Monitor PDU power fluctuations and consider replacement if issue persists beyond next maintenance cycle.'
  },
  {
    id: '3',
    title: 'Daily Issue Report - May 3rd 2025',
    location: 'Canada - Quebec Q01',
    date: '2025-05-03',
    thumbnail: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
    issues: [
      issues[3],
      issues[6],
    ],
    summary: 'Daily inspection across all data centers highlighted two critical issues that were identified and resolved promptly.',
    recommendations: 'Implement quarterly water detection system tests and upgrade network infrastructure in Cirrus.'
  },
];

export const formSections: FormSection[] = [
  {
    id: 'power-supply-unit',
    title: 'Power Supply Unit',
    fields: [
      {
        id: 'psu-issue-description',
        label: 'Issue Description',
        type: 'select',
        placeholder: 'Select PSU status',
        required: true,
        options: [
          { value: 'healthy', label: 'Healthy' },
          { value: 'amber-led', label: 'Amber LED' },
          { value: 'powered-off', label: 'Powered-Off' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'psu-id',
        label: 'PSU ID',
        type: 'select',
        placeholder: 'Select PSU',
        required: true,
        options: [
          { value: 'psu-1', label: 'PSU 1' },
          { value: 'psu-2', label: 'PSU 2' },
          { value: 'psu-3', label: 'PSU 3' },
          { value: 'psu-4', label: 'PSU 4' },
          { value: 'psu-5', label: 'PSU 5' },
          { value: 'psu-6', label: 'PSU 6' }
        ]
      },
      {
        id: 'device-u-height',
        label: 'Device U-Height',
        type: 'select',
        placeholder: 'Select U-Height',
        required: true,
        options: Array.from({ length: 49 }, (_, i) => ({
          value: i.toString(),
          label: `U${i}`
        }))
      },
      {
        id: 'psu-comments',
        label: 'Additional Comments (Optional)',
        type: 'textarea',
        placeholder: 'Add any additional comments'
      },
      {
        id: 'psu-files',
        label: 'Upload Files (Optional)',
        type: 'file'
      }
    ]
  },
  {
    id: 'power-distribution-unit',
    title: 'Power Distribution Unit',
    fields: [
      {
        id: 'pdu-issue-description',
        label: 'Issue Description',
        type: 'select',
        placeholder: 'Select PDU status',
        required: true,
        options: [
          { value: 'healthy', label: 'Healthy' },
          { value: 'tripped-breaker', label: 'Tripped Breaker' },
          { value: 'powered-off', label: 'Powered-Off' },
          { value: 'active-alarm', label: 'Active Alarm' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'pdu-id',
        label: 'PDU ID',
        type: 'select',
        placeholder: 'Select PDU',
        required: true,
        options: [
          { value: 'pdu-a', label: 'PDU A' },
          { value: 'pdu-b', label: 'PDU B' },
          { value: 'pdu-c', label: 'PDU C' }
        ]
      },
      {
        id: 'pdu-comments',
        label: 'Additional Comments (Optional)',
        type: 'textarea',
        placeholder: 'Add any additional comments'
      },
      {
        id: 'pdu-files',
        label: 'Upload Files (Optional)',
        type: 'file'
      }
    ]
  },
  {
    id: 'rear-door-heat-exchanger',
    title: 'Rear Door Heat Exchanger',
    fields: [
      {
        id: 'rdhx-issue-description',
        label: 'Issue Description',
        type: 'select',
        placeholder: 'Select RDHX status',
        required: true,
        options: [
          { value: 'healthy', label: 'Healthy' },
          { value: 'water-leak', label: 'Water Leak' },
          { value: 'powered-off', label: 'Powered-Off' },
          { value: 'active-alarm', label: 'Active Alarm' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'rdhx-comments',
        label: 'Additional Comments (Optional)',
        type: 'textarea',
        placeholder: 'Add any additional comments'
      },
      {
        id: 'rdhx-files',
        label: 'Upload Files (Optional)',
        type: 'file'
      }
    ]
  }
];