import { AuthUser } from '../types';

export interface DemoAccount {
  label: string;
  role: 'student' | 'officer' | 'analyst';
  subRole?: 'institute' | 'state';
  identifier: string; // Phone or Official ID
  passwordOrOtp: string;
  user: AuthUser;
  description: string;
  scopeDescription: string;
}

export const DEMO_CREDENTIALS: DemoAccount[] = [
  {
    label: 'Meena Kumari (Student - PVTG / Remote District)',
    role: 'student',
    identifier: '9876543210',
    passwordOrOtp: '123456',
    description: 'First-generation ST Scholar from Dantewada, Chhattisgarh (NIT Raipur UG)',
    scopeDescription: 'Read & edit own application (VV-2026-CG-088219), upload documents, check rule traces & track DBT disbursal.',
    user: {
      id: 'USR-STU-MEENA',
      role: 'student',
      name: 'Meena Kumari Mandavi (मीना कुमारी मंडावी)',
      emailOrPhone: '+91 98765 43210',
      identifier: '9876543210',
      studentApplicationId: 'VV-2026-CG-088219',
      assignedDistrict: 'Dantewada',
      assignedState: 'Chhattisgarh',
      preferredLanguage: 'hi'
    }
  },
  {
    label: 'Ramu Soren (Student - Mayurbhanj, Odisha)',
    role: 'student',
    identifier: '9438100000',
    passwordOrOtp: '123456',
    description: 'ST Scholar from Mayurbhanj enrolled at NIT Rourkela',
    scopeDescription: 'Read & edit own application (VV-2026-OD-091823), view cross-document reconciliation.',
    user: {
      id: 'USR-STU-RAMU',
      role: 'student',
      name: 'Ramu Soren',
      emailOrPhone: '+91 94381 00000',
      identifier: '9438100000',
      studentApplicationId: 'VV-2026-OD-091823',
      assignedDistrict: 'Mayurbhanj',
      assignedState: 'Odisha',
      preferredLanguage: 'en'
    }
  },
  {
    label: 'Dr. A. K. Soren (Institute Nodal Officer)',
    role: 'officer',
    subRole: 'institute',
    identifier: 'NODAL-OD-NITR',
    passwordOrOtp: 'Nodal@2026',
    description: 'Institutional Verification Officer, NIT Rourkela (Odisha)',
    scopeDescription: 'Scoped strictly to applications from "National Institute of Technology (NIT) Rourkela".',
    user: {
      id: 'USR-OFF-NITR',
      role: 'officer',
      officerSubRole: 'institute',
      name: 'Dr. A. K. Soren',
      emailOrPhone: 'soren.ak@nitr.ac.in',
      identifier: 'NODAL-OD-NITR',
      assignedInstitute: 'National Institute of Technology (NIT) Rourkela',
      assignedState: 'Odisha'
    }
  },
  {
    label: 'Smt. Pratibha Minz (State Tribal Welfare Officer)',
    role: 'officer',
    subRole: 'state',
    identifier: 'STATE-ODISHA-ST',
    passwordOrOtp: 'State@2026',
    description: 'Deputy Director, ST & SC Development Department, Govt of Odisha',
    scopeDescription: 'Scoped strictly to applications within the State of "Odisha".',
    user: {
      id: 'USR-OFF-STATE-OD',
      role: 'officer',
      officerSubRole: 'state',
      name: 'Smt. Pratibha Minz, OAS',
      emailOrPhone: 'p.minz@odisha.gov.in',
      identifier: 'STATE-ODISHA-ST',
      assignedState: 'Odisha'
    }
  },
  {
    label: 'Dr. Rajeshwar Rao (Ministry Analyst & Director)',
    role: 'analyst',
    identifier: 'MOTA-HQ-901',
    passwordOrOtp: 'MoTA#Gov2026',
    description: 'Ministry of Tribal Affairs, Scholarship Division (New Delhi)',
    scopeDescription: 'Aggregated National Scope. PII is masked by policy under DPDP Act 2023.',
    user: {
      id: 'USR-MIN-HQ',
      role: 'analyst',
      name: 'Dr. Rajeshwar Rao, Joint Secretary',
      emailOrPhone: 'r.rao@mota.gov.in',
      identifier: 'MOTA-HQ-901'
    }
  }
];
