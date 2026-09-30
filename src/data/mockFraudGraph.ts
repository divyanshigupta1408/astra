import { FraudNode, FraudLink, DelayBatch } from '../types';

export const FRAUD_GRAPH_NODES: FraudNode[] = [
  // The Suspicious Syndicate Ring
  { id: 'bank-8819', label: 'Bank A/c ••••••••8819 (Gramin Bank)', type: 'bank', risk: 'syndicate', meta: 'Single account receiving 4 distinct student claims' },
  { id: 'phone-98261', label: 'Mobile +91 98261 44•••', type: 'mobile', risk: 'syndicate', meta: 'Registered with Bastar Cyber Kiosk' },
  { id: 'kiosk-01', label: 'Jagdalpur CSC Kiosk #09', type: 'institute', risk: 'syndicate', meta: 'Intermediary unauthorized aggregator' },
  { id: 'app-004', label: 'Vikas Netam (APP-004)', type: 'student', risk: 'syndicate', meta: 'GEC Jagdalpur • ₹2.40L Claim' },
  { id: 'app-018', label: 'Ramesh Markam (APP-018)', type: 'student', risk: 'syndicate', meta: 'GEC Jagdalpur • ₹2.35L Claim' },
  { id: 'app-019', label: 'Suresh Kashyap (APP-019)', type: 'student', risk: 'syndicate', meta: 'Dharampura ITI • ₹2.20L Claim' },
  { id: 'app-024', label: 'Vinod Baghel (APP-024)', type: 'student', risk: 'syndicate', meta: 'Govt Poly Jagdalpur • ₹2.45L Claim' },

  // Genuine Applicants (for comparison / cluster separation)
  { id: 'app-001', label: 'Ramu Kumar (APP-001)', type: 'student', risk: 'suspicious', meta: 'Minor name variation in Caste doc' },
  { id: 'bank-3912', label: 'SBI A/c ••••••••3912', type: 'bank', risk: 'normal', meta: 'Individual personal student account' },
  { id: 'app-002', label: 'Sunita Marandi (APP-002)', type: 'student', risk: 'normal', meta: 'NFHET PhD Scholar • Pristine' },
  { id: 'bank-7721', label: 'BOI A/c ••••••••7721', type: 'bank', risk: 'normal', meta: 'Aadhaar NPCI active' },
  { id: 'app-003', label: 'Kailash Baiga (APP-003)', type: 'student', risk: 'suspicious', meta: 'PVTG Baiga • Income cert date lag' },
  { id: 'bank-4810', label: 'CBI A/c ••••••••4810', type: 'bank', risk: 'normal', meta: 'Dindori Rural Branch' }
];

export const FRAUD_GRAPH_LINKS: FraudLink[] = [
  // Syndicate Ring links (All red/highlighted)
  { source: 'app-004', target: 'bank-8819', relationship: 'shares_bank', isSuspicious: true },
  { source: 'app-018', target: 'bank-8819', relationship: 'shares_bank', isSuspicious: true },
  { source: 'app-019', target: 'bank-8819', relationship: 'shares_bank', isSuspicious: true },
  { source: 'app-024', target: 'bank-8819', relationship: 'shares_bank', isSuspicious: true },

  { source: 'app-004', target: 'phone-98261', relationship: 'shares_phone', isSuspicious: true },
  { source: 'app-018', target: 'phone-98261', relationship: 'shares_phone', isSuspicious: true },
  { source: 'app-019', target: 'phone-98261', relationship: 'shares_phone', isSuspicious: true },
  { source: 'app-024', target: 'phone-98261', relationship: 'shares_phone', isSuspicious: true },

  { source: 'phone-98261', target: 'kiosk-01', relationship: 'enrolled_at', isSuspicious: true },
  { source: 'bank-8819', target: 'kiosk-01', relationship: 'enrolled_at', isSuspicious: true },

  // Genuine separate links
  { source: 'app-001', target: 'bank-3912', relationship: 'shares_bank', isSuspicious: false },
  { source: 'app-002', target: 'bank-7721', relationship: 'shares_bank', isSuspicious: false },
  { source: 'app-003', target: 'bank-4810', relationship: 'shares_bank', isSuspicious: false }
];

export const MOCK_DELAY_BATCHES: DelayBatch[] = [
  {
    id: 'BATCH-OD-MBJ-01',
    state: 'Odisha',
    district: 'Mayurbhanj',
    institute: 'North Orissa University & Affiliated Colleges',
    pendingCount: 142,
    oldestDays: 44,
    predictedDaysToBreach: 2,
    bottleneckType: 'District Nodal Desk'
  },
  {
    id: 'BATCH-CG-BST-04',
    state: 'Chhattisgarh',
    district: 'Bastar',
    institute: 'Bastar University Nodal Cluster',
    pendingCount: 98,
    oldestDays: 49,
    predictedDaysToBreach: 1,
    bottleneckType: 'Institute Desk'
  },
  {
    id: 'BATCH-JH-RNC-02',
    state: 'Jharkhand',
    district: 'Ranchi',
    institute: 'Ranchi University Post-Graduation Cell',
    pendingCount: 65,
    oldestDays: 28,
    predictedDaysToBreach: 6,
    bottleneckType: 'NPCI Bank Validation'
  },
  {
    id: 'BATCH-MP-DIN-03',
    state: 'Madhya Pradesh',
    district: 'Dindori',
    institute: 'Govt PG College Dindori & Poly',
    pendingCount: 84,
    oldestDays: 37,
    predictedDaysToBreach: 4,
    bottleneckType: 'District Nodal Desk'
  },
  {
    id: 'BATCH-MN-CCP-01',
    state: 'Manipur',
    district: 'Churachandpur',
    institute: 'Hill District Inter-College Cluster',
    pendingCount: 53,
    oldestDays: 48,
    predictedDaysToBreach: 1,
    bottleneckType: 'Institute Desk'
  }
];
