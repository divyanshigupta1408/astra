import { AuditLogEntry } from '../types';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-09-30 11:22:15 UTC',
    actor: 'system.rule_engine',
    role: 'Statutory Core',
    action: 'DETERMINISTIC_EVALUATION',
    targetId: 'APP-2026-001 (Ramu Kumar)',
    ruleVersion: 'v2026.04.R1',
    modelVersion: 'rule-engine-static-v4',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: 'e8b41ca982e05f0d3a95c962b1b3e414c1d279cf430e38a2e1d7a85cfc87f912'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-09-30 11:22:18 UTC',
    actor: 'ai.ocr_extractor',
    role: 'Vision Service',
    action: 'OCR_AND_CROSS_DOC_ALIGNMENT',
    targetId: 'APP-2026-001 (Ramu Kumar)',
    ruleVersion: 'v2026.04.R1',
    modelVersion: 'gemini-ocr-guard-v2',
    previousHash: 'e8b41ca982e05f0d3a95c962b1b3e414c1d279cf430e38a2e1d7a85cfc87f912',
    hash: 'a39f1165bc740d12e9b08f5d0234a97184e1b302c5240c49ef435384e537c181'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-09-30 11:28:40 UTC',
    actor: 'ai.fraud_detector',
    role: 'Security Core',
    action: 'GRAPH_COMMUNITY_FLAG_RAISED',
    targetId: 'RING-CG-BST-09 (4 Applications)',
    ruleVersion: 'v2026.04.R1',
    modelVersion: 'syndicate-graph-v1.4',
    previousHash: 'a39f1165bc740d12e9b08f5d0234a97184e1b302c5240c49ef435384e537c181',
    hash: '7c4091e84a22b79a8e9e115041dd4c8f58b660a927fa8340d869919f2010ea35'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-09-30 12:04:12 UTC',
    actor: 'officer.soren@nitr.ac.in',
    role: 'Institute Nodal Officer',
    action: 'CONDITIONAL_APPROVAL_FORWARDED',
    targetId: 'APP-2026-002 (Sunita Marandi)',
    ruleVersion: 'v2026.04.R1',
    modelVersion: 'human-in-the-loop-signoff',
    previousHash: '7c4091e84a22b79a8e9e115041dd4c8f58b660a927fa8340d869919f2010ea35',
    hash: 'f9213bc54098ea471e982d6501a382c4098fa3910c278912ef3914a849204bc1'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-09-30 12:15:30 UTC',
    actor: 'state.tribal_odisha@nic.in',
    role: 'State Verification Officer',
    action: 'STATE_SANCTION_ENDORSED',
    targetId: 'APP-2026-005 (Pooja Bhil)',
    ruleVersion: 'v2026.04.R1',
    modelVersion: 'human-in-the-loop-signoff',
    previousHash: 'f9213bc54098ea471e982d6501a382c4098fa3910c278912ef3914a849204bc1',
    hash: '59a102ec48b7921a4f009941a27e31b74829fa12bc401928df4192083bc71049'
  },
  {
    id: 'AUD-006',
    timestamp: '2026-09-30 12:30:00 UTC',
    actor: 'treasury.pfms_bridge',
    role: 'PFMS Integration Gateway',
    action: 'CREDIT_ADVICE_DISPATCHED',
    targetId: 'APP-2026-008 (Anand Munda)',
    ruleVersion: 'v2026.04.R1',
    modelVersion: 'npci-dbt-mapper-v3',
    previousHash: '59a102ec48b7921a4f009941a27e31b74829fa12bc401928df4192083bc71049',
    hash: '12b847fae94012bc8519409df28a719240bc9182371904ea928194019f20184c'
  }
];

// Helper to compute a simulated next hash
export function generateAuditHash(previousHash: string, dataString: string): string {
  let hash = 0;
  const combined = previousHash + dataString;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = Math.random().toString(16).substring(2, 10);
  return `${hexPart}${salt}${previousHash.substring(0, 16)}${salt}`.substring(0, 64);
}
