import { DropoutRiskStudent } from '../types';

export interface StateCoverageData {
  state: string;
  code: string;
  stPopulationLakhs: number;
  estimatedEligibleStudents: number;
  appliedStudents: number;
  disbursedStudents: number;
  reachPercentage: number;
  pvtgDistricts: string[];
  priorityStatus: 'High Priority' | 'Moderate' | 'Satisfactory';
}

export const STATE_COVERAGE_DATA: StateCoverageData[] = [
  {
    state: 'Odisha',
    code: 'OD',
    stPopulationLakhs: 95.9,
    estimatedEligibleStudents: 310000,
    appliedStudents: 248000,
    disbursedStudents: 228000,
    reachPercentage: 80.0,
    pvtgDistricts: ['Mayurbhanj', 'Koraput', 'Malkangiri', 'Rayagada', 'Keonjhar'],
    priorityStatus: 'High Priority'
  },
  {
    state: 'Madhya Pradesh',
    code: 'MP',
    stPopulationLakhs: 153.2,
    estimatedEligibleStudents: 490000,
    appliedStudents: 367500,
    disbursedStudents: 338000,
    reachPercentage: 75.0,
    pvtgDistricts: ['Dindori', 'Chhindwara', 'Mandla', 'Sheopur', 'Barwani'],
    priorityStatus: 'High Priority'
  },
  {
    state: 'Jharkhand',
    code: 'JH',
    stPopulationLakhs: 86.5,
    estimatedEligibleStudents: 280000,
    appliedStudents: 235200,
    disbursedStudents: 218400,
    reachPercentage: 84.0,
    pvtgDistricts: ['Khunti', 'West Singhbhum', 'Gumla', 'Latehar'],
    priorityStatus: 'High Priority'
  },
  {
    state: 'Chhattisgarh',
    code: 'CG',
    stPopulationLakhs: 78.2,
    estimatedEligibleStudents: 250000,
    appliedStudents: 187500,
    disbursedStudents: 170000,
    reachPercentage: 75.0,
    pvtgDistricts: ['Bastar', 'Dantewada', 'Bijapur', 'Sukma', 'Jashpur'],
    priorityStatus: 'High Priority'
  },
  {
    state: 'Maharashtra',
    code: 'MH',
    stPopulationLakhs: 105.1,
    estimatedEligibleStudents: 340000,
    appliedStudents: 295800,
    disbursedStudents: 278800,
    reachPercentage: 87.0,
    pvtgDistricts: ['Gadchiroli', 'Nandurbar', 'Palghar'],
    priorityStatus: 'Satisfactory'
  },
  {
    state: 'Rajasthan',
    code: 'RJ',
    stPopulationLakhs: 92.4,
    estimatedEligibleStudents: 300000,
    appliedStudents: 246000,
    disbursedStudents: 231000,
    reachPercentage: 82.0,
    pvtgDistricts: ['Baran (Sahariya belt)'],
    priorityStatus: 'Moderate'
  },
  {
    state: 'Gujarat',
    code: 'GJ',
    stPopulationLakhs: 89.2,
    estimatedEligibleStudents: 285000,
    appliedStudents: 250800,
    disbursedStudents: 239400,
    reachPercentage: 88.0,
    pvtgDistricts: ['Dangs', 'Tapi', 'Narmada'],
    priorityStatus: 'Satisfactory'
  },
  {
    state: 'Assam & NE States',
    code: 'NE',
    stPopulationLakhs: 124.0,
    estimatedEligibleStudents: 390000,
    appliedStudents: 304200,
    disbursedStudents: 280800,
    reachPercentage: 78.0,
    pvtgDistricts: ['Karbi Anglong', 'Kokrajhar', 'Churachandpur'],
    priorityStatus: 'Moderate'
  }
];

export const REJECTION_REASONS_DATA = [
  { name: 'Income Exceeds Guideline Cap', count: 3420, percent: 34, color: '#f59e0b' },
  { name: 'Bank Account Not Aadhaar Seeded', count: 2815, percent: 28, color: '#ef4444' },
  { name: 'Course / Institute Not Recognized', count: 1510, percent: 15, color: '#6366f1' },
  { name: 'Name / DOB Cross-Doc Mismatch', count: 1305, percent: 13, color: '#ec4899' },
  { name: 'Duplicate / Fraudulent Syndicate Entry', count: 650, percent: 6.5, color: '#84cc16' },
  { name: 'Incomplete Marksheet / Below Cutoff', count: 350, percent: 3.5, color: '#06b6d4' }
];

export const PROCESSING_TIME_TREND_DATA = [
  { month: 'Apr 2026', manualDays: 58, aiAssistedDays: 32, slaTarget: 30 },
  { month: 'May 2026', manualDays: 55, aiAssistedDays: 27, slaTarget: 30 },
  { month: 'Jun 2026', manualDays: 52, aiAssistedDays: 22, slaTarget: 30 },
  { month: 'Jul 2026', manualDays: 49, aiAssistedDays: 18, slaTarget: 30 },
  { month: 'Aug 2026', manualDays: 46, aiAssistedDays: 14, slaTarget: 30 },
  { month: 'Sep 2026', manualDays: 44, aiAssistedDays: 11, slaTarget: 30 }
];

export const EQUITY_GENDER_REGION_DATA = [
  { region: 'Central Tribal Belt (MP/CG)', maleRate: 88, femaleRate: 86, transRate: 78 },
  { region: 'Eastern Belt (OD/JH/WB)', maleRate: 89, femaleRate: 91, transRate: 82 },
  { region: 'Western Belt (MH/GJ/RJ)', maleRate: 92, femaleRate: 93, transRate: 85 },
  { region: 'North Eastern States', maleRate: 87, femaleRate: 89, transRate: 80 },
  { region: 'Southern Hills (KL/TN/AP)', maleRate: 94, femaleRate: 95, transRate: 88 }
];

export const MONTHLY_BUDGET_DATA = [
  { month: 'Apr', allocatedCr: 350, disbursedCr: 310 },
  { month: 'May', allocatedCr: 420, disbursedCr: 395 },
  { month: 'Jun', allocatedCr: 480, disbursedCr: 460 },
  { month: 'Jul', allocatedCr: 550, disbursedCr: 535 },
  { month: 'Aug', allocatedCr: 620, disbursedCr: 610 },
  { month: 'Sep', allocatedCr: 700, disbursedCr: 685 }
];

export const INITIAL_DROPOUT_RISK_STUDENTS: DropoutRiskStudent[] = [
  {
    id: 'DR-01',
    name: 'Manglesh Markam',
    scheme: 'Post-Matric Scholarship for ST Students',
    institute: 'Govt Polytechnic, Jagdalpur',
    state: 'Chhattisgarh',
    riskLevel: 'High',
    riskScore: 84,
    topContributingFactors: [
      'Missed renewal filing deadline by 45 days',
      'Semester attendance dropped to 48%',
      'Hostel vacancy shifted to 35km remote commute'
    ],
    lastDisbursedDate: '15-01-2026'
  },
  {
    id: 'DR-02',
    name: 'Somari Tudu',
    scheme: 'Top Class Education for ST Students',
    institute: 'National Institute of Technology, Rourkela',
    state: 'Odisha',
    riskLevel: 'High',
    riskScore: 79,
    topContributingFactors: [
      'Bank DBT bounce: NPCI Aadhaar de-linked due to KYC expiry',
      'No contact logged with institute nodal officer for 60 days',
      'First-generation engineering entrant in family'
    ],
    lastDisbursedDate: '28-11-2025'
  },
  {
    id: 'DR-03',
    name: 'Hitesh Sahariya',
    scheme: 'Post-Matric Scholarship for ST Students',
    institute: 'Govt College Shahbad, Baran',
    state: 'Rajasthan',
    riskLevel: 'Medium',
    riskScore: 61,
    topContributingFactors: [
      'Seasonal agrarian harvesting migration in family',
      'Unresolved mark verification flag from semester 2'
    ],
    lastDisbursedDate: '10-02-2026'
  },
  {
    id: 'DR-04',
    name: 'Priyanka Rabha',
    scheme: 'National Fellowship for Higher Education (NFHET)',
    institute: 'Gauhati University',
    state: 'Assam',
    riskLevel: 'Medium',
    riskScore: 54,
    topContributingFactors: [
      'Delayed six-monthly doctoral progress report submission',
      'Supervising nodal guide transfer'
    ],
    lastDisbursedDate: '05-04-2026'
  },
  {
    id: 'DR-05',
    name: 'Rohan Baiga',
    scheme: 'Post-Matric Scholarship for ST Students',
    institute: 'Tribal ITI Dindori',
    state: 'Madhya Pradesh',
    riskLevel: 'Low',
    riskScore: 38,
    topContributingFactors: [
      'Bank passbook branch IFSC code updated post merger',
      'Attendance stable at 76%'
    ],
    lastDisbursedDate: '12-05-2026'
  }
];

export const FAIRNESS_MONITOR_METRICS = [
  {
    subgroup: 'Female ST Students',
    shareOfApplicants: '49.2%',
    aiFlagRate: '4.8%',
    officerApprovalRate: '94.2%',
    disparityRatio: '1.01 (No Disparity)',
    auditVerdict: 'Audited Fair'
  },
  {
    subgroup: 'Male ST Students',
    shareOfApplicants: '50.6%',
    aiFlagRate: '5.1%',
    officerApprovalRate: '93.9%',
    disparityRatio: '0.99 (Baseline)',
    auditVerdict: 'Audited Fair'
  },
  {
    subgroup: 'Transgender / Non-Binary ST',
    shareOfApplicants: '0.2%',
    aiFlagRate: '4.6%',
    officerApprovalRate: '95.0%',
    disparityRatio: '1.02 (Protected)',
    auditVerdict: 'Audited Fair'
  },
  {
    subgroup: 'PVTG (Particularly Vulnerable Groups)',
    shareOfApplicants: '14.8%',
    aiFlagRate: '3.9%',
    officerApprovalRate: '96.4%',
    disparityRatio: '1.04 (Affirmative Parity)',
    auditVerdict: 'Affirmative Priority Active'
  },
  {
    subgroup: 'Remote Hill & Forest Dwellers',
    shareOfApplicants: '32.1%',
    aiFlagRate: '4.9%',
    officerApprovalRate: '93.7%',
    disparityRatio: '0.98 (Parity)',
    auditVerdict: 'Audited Fair'
  },
  {
    subgroup: 'Urban / Premier University STs',
    shareOfApplicants: '18.4%',
    aiFlagRate: '4.7%',
    officerApprovalRate: '94.8%',
    disparityRatio: '1.00 (Parity)',
    auditVerdict: 'Audited Fair'
  }
];
