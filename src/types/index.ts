export type UserRole = 'student' | 'officer' | 'analyst';
export type OfficerSubRole = 'institute' | 'state';
export type AppLanguage = 'en' | 'hi';

export interface AuthUser {
  id: string;
  role: UserRole;
  name: string;
  emailOrPhone: string;
  identifier: string; // Mobile / Official ID
  officerSubRole?: OfficerSubRole;
  assignedInstitute?: string;
  assignedState?: string;
  assignedDistrict?: string;
  studentApplicationId?: string;
  preferredLanguage?: AppLanguage;
}

export type CourseLevel = 
  | 'Pre-Matric'
  | 'Post-Matric'
  | 'UG'
  | 'PG'
  | 'M.Phil'
  | 'PhD';

export type InstituteType = 
  | 'Central University / Institute of National Importance (IIT, IIM, AIIMS, NIT)'
  | 'State Government University / College'
  | 'Government Aided Institution'
  | 'Recognized Private University / College';

export interface RuleClause {
  clauseNumber: string;
  title: string;
  conditionDescription: string;
  isPassed: boolean;
  actualValue: string | number;
  expectedValue: string | number;
}

export interface SchemeRule {
  id: string;
  name: string;
  code: string;
  ministry: string;
  description: string;
  guidelineClauseRef: string;
  allowedCourseLevels: CourseLevel[];
  maxAnnualIncome: number; // in INR
  minPercentage: number;
  allowedGenders?: ('Male' | 'Female' | 'Transgender')[];
  pwdRelaxationPercentage?: number;
  benefitAmount: string;
  tenure: string;
  documentsRequired: string[];
  priorityWeight: number;
}

export interface StudentProfile {
  name: string;
  fatherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Transgender';
  state: string;
  certificateState?: string;
  instituteState?: string;
  district: string;
  courseLevel: CourseLevel;
  instituteType: InstituteType;
  instituteName: string;
  annualFamilyIncome: number;
  percentageLastExam: number;
  isPwd: boolean;
  category: 'ST';
  aadhaarSeededBank: boolean;
  accountNumberMasked?: string;
  ifscCode?: string;
}

export interface EligibilityResult {
  scheme: SchemeRule;
  isEligible: boolean;
  ruleTraces: RuleClause[];
  matchScore: number;
}

export interface NearMissResult {
  scheme: SchemeRule;
  failedClauses: RuleClause[];
  changeNeeded: string[];
}

export type RiskLane = 'Green' | 'Amber' | 'Red';
export type SLAStatus = 'On time' | 'At risk' | 'Breached';
export type AppStatus = 'Submitted' | 'Institute Verified' | 'State Verified' | 'Ministry Sanctioned' | 'Released via PFMS' | 'Credited to Bank' | 'Returned for Correction' | 'Rejected';

export interface DocumentVerification {
  id: string;
  name: string;
  type: 'caste' | 'income' | 'marksheet' | 'bank';
  status: 'verified' | 'mismatch' | 'unreadable';
  extractedData: Record<string, string>;
  confidenceScore: number;
  fileSize: string;
  issuer: string;
}

export interface CrossDocMismatch {
  field: string;
  docA: { name: string; value: string };
  docB: { name: string; value: string };
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestedAction: string;
}

export interface OfficerApplication {
  id: string;
  applicationNumber: string;
  studentName: string;
  gender: 'Male' | 'Female' | 'Transgender';
  fatherName: string;
  dob: string;
  state: string;
  district: string;
  pvtgDistrict: boolean;
  institute: string;
  instituteType: InstituteType;
  courseLevel: CourseLevel;
  schemeId: string;
  schemeName: string;
  income: number;
  percentage: number;
  submittedDate: string;
  daysPending: number;
  riskLane: RiskLane;
  slaStatus: SLAStatus;
  status: AppStatus;
  healthScore: number;
  flags: string[];
  ruleTraceSummary: string;
  extractedDocs: DocumentVerification[];
  mismatches: CrossDocMismatch[];
  bankAccountMasked: string;
  mobileNumberMasked: string;
  fraudRingId?: string;
  isGramSabhaFallback?: boolean;
  gramSabhaDetails?: {
    village: string;
    panchayat: string;
    block: string;
    itdaOffice: string;
    status: 'pending' | 'attested';
  };
}

export interface InstituteScorecardItem {
  id: string;
  name: string;
  code: string;
  state: string;
  type: string;
  totalApplications: number;
  avgVerificationDays: number;
  ucCompliancePercent: number;
  rejectionRatePercent: number;
  status: 'Exemplary' | 'Satisfactory' | 'Critical Delay';
  statusLane: 'Green' | 'Amber' | 'Red';
  lastAuditDate: string;
}

export interface CampPlannerItem {
  id: string;
  district: string;
  state: string;
  tribalPopulationLakhs: number;
  gapStudents: number;
  estimatedReachable: number;
  primaryBarrier: string;
  suggestedDateRange: string;
  targetPVTGs: string[];
  mobileVanUnits: number;
  approved: boolean;
  sanctionOrderNumber?: string;
}

export interface FraudNode {
  id: string;
  label: string;
  type: 'student' | 'bank' | 'mobile' | 'institute';
  risk: 'normal' | 'suspicious' | 'syndicate';
  meta?: string;
}

export interface FraudLink {
  source: string;
  target: string;
  relationship: 'shares_bank' | 'shares_phone' | 'enrolled_at';
  isSuspicious: boolean;
}

export interface DelayBatch {
  id: string;
  state: string;
  district: string;
  institute: string;
  pendingCount: number;
  oldestDays: number;
  predictedDaysToBreach: number;
  bottleneckType: 'Institute Desk' | 'District Nodal Desk' | 'NPCI Bank Validation';
}

export interface DropoutRiskStudent {
  id: string;
  name: string;
  scheme: string;
  institute: string;
  state: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  riskScore: number; // 0-100
  topContributingFactors: string[];
  mentorAssigned?: string;
  lastDisbursedDate: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  targetId: string;
  ruleVersion: string;
  modelVersion: string;
  hash: string;
  previousHash: string;
}

export interface CaseNote {
  id: string;
  applicationId: string;
  authorName: string;
  authorRole: string;
  timestamp: string;
  content: string;
}

export interface OfficerSavedFilter {
  id: string;
  name: string;
  laneFilter: string;
  slaFilter: string;
  sortOldestFirst: boolean;
  isPinned: boolean;
}

export interface ScheduledReport {
  id: string;
  title: string;
  reportType: 'disbursal_summary' | 'pvtg_saturation' | 'institution_compliance' | 'fraud_digest';
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Cycle End';
  recipients: string[];
  nextRun: string;
  active: boolean;
}

export interface MinistryAlertRule {
  id: string;
  metricKey: string;
  metricTitle: string;
  condition: 'gt' | 'lt';
  thresholdValue: number;
  unit: string;
  currentActual: number;
  isTriggered: boolean;
}

export interface CscBooking {
  id: string;
  district: string;
  block: string;
  centreName: string;
  date: string;
  slot: string;
  serviceType: string;
  studentName: string;
  studentPhone: string;
  confirmedAt: string;
}

export interface StudentDraftState {
  currentStep: number;
  totalSteps: number;
  stepName: string;
  completionPercentage: number;
  lastSavedAt: string;
  schemeId: string;
}
