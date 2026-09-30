import { SchemeRule } from '../types';

export const SCHEMES_DATABASE: SchemeRule[] = [
  {
    id: 'PMS-ST',
    name: 'Post-Matric Scholarship for ST Students (PMS-ST)',
    code: 'MOTA-SCH-001',
    ministry: 'Ministry of Tribal Affairs',
    description: 'Provides financial assistance to ST students studying at post-matriculation or post-secondary stage to enable them to complete their education.',
    guidelineClauseRef: 'Guidelines 2021-22, Clause 4.1 & Clause 5.2',
    allowedCourseLevels: ['Post-Matric', 'UG', 'PG', 'M.Phil', 'PhD'],
    maxAnnualIncome: 250000, // Rs. 2.5 Lakh per annum
    minPercentage: 45,
    pwdRelaxationPercentage: 5,
    benefitAmount: 'Full non-refundable tuition fees + monthly maintenance allowance up to ₹1,200/month',
    tenure: 'Entire duration of course',
    documentsRequired: [
      'ST Caste Certificate with Digitally Signed / Barcode verification',
      'Income Certificate issued by Revenue Authority (Competent Officer)',
      'Previous Class / Degree Marksheet',
      'Aadhaar-seeded Bank Passbook (NPCI Mapped)'
    ],
    priorityWeight: 100
  },
  {
    id: 'NFHET-ST',
    name: 'National Fellowship for Higher Education of ST Students (NFHET)',
    code: 'MOTA-SCH-002',
    ministry: 'Ministry of Tribal Affairs',
    description: 'Fellowship scheme to encourage ST scholars to pursue regular and full-time M.Phil. and Ph.D. degrees in Indian Universities/Institutions.',
    guidelineClauseRef: 'Revised NFHET Guidelines 2022, Clause 2.1 & Clause 6.3',
    allowedCourseLevels: ['M.Phil', 'PhD'],
    maxAnnualIncome: 600000, // Rs. 6.0 Lakh per annum
    minPercentage: 50,
    pwdRelaxationPercentage: 5,
    benefitAmount: '₹31,000/mo (JRF) or ₹35,000/mo (SRF) + HRA + Annual Contingency ₹10,000 - ₹20,500',
    tenure: '5 years for Ph.D / 2 years for M.Phil',
    documentsRequired: [
      'Valid ST Caste Certificate',
      'Income Certificate (<= ₹6.00 Lakhs)',
      'Admission / Registration letter for M.Phil/Ph.D from recognized University',
      'Master Degree Marksheet (min 50%)',
      'Aadhaar seeded bank account proof'
    ],
    priorityWeight: 90
  },
  {
    id: 'TOP-CLASS-ST',
    name: 'Top Class Education for ST Students',
    code: 'MOTA-SCH-003',
    ministry: 'Ministry of Tribal Affairs',
    description: 'Encourages ST students admitted to notified premier institutes of excellence (IITs, IIMs, AIIMS, NITs, NLUs, etc.) with comprehensive support.',
    guidelineClauseRef: 'Top Class Scheme Guidelines 2021, Clause 1.2 & Clause 9.1',
    allowedCourseLevels: ['UG', 'PG'],
    maxAnnualIncome: 600000, // Rs. 6.0 Lakh per annum
    minPercentage: 55,
    pwdRelaxationPercentage: 5,
    benefitAmount: 'Full Tuition Fee reimbursement + Living expenses ₹2,220/mo + Books & Stationery ₹3,000/yr + Latest Computer system up to ₹45,000',
    tenure: 'Entire duration of degree program',
    documentsRequired: [
      'ST Certificate verified by District Magistrate / Tahsildar',
      'Income Certificate (<= ₹6 Lakh)',
      'Allotment letter & fee receipt of Notified Institute of Excellence',
      'Class 12 / Bachelor Marksheet',
      'Bank details with Aadhaar seeding'
    ],
    priorityWeight: 95
  },
  {
    id: 'NOS-ST',
    name: 'National Overseas Scholarship for ST Candidates (NOS)',
    code: 'MOTA-SCH-004',
    ministry: 'Ministry of Tribal Affairs',
    description: 'Provides financial support to meritorious ST students for pursuing Master Level Courses, Ph.D. and Post-Doctoral research abroad in accredited top universities.',
    guidelineClauseRef: 'NOS Guidelines 2022-23, Clause 7.1 & Clause 8.4',
    allowedCourseLevels: ['PG', 'PhD'],
    maxAnnualIncome: 600000, // Rs. 6.0 Lakh per annum
    minPercentage: 55,
    pwdRelaxationPercentage: 5,
    benefitAmount: 'Tuition fees, annual maintenance allowance ($15,400 USD / £9,900 GBP), contingency, health insurance and international airfare',
    tenure: 'Up to 3 years for Masters / 4 years for Ph.D',
    documentsRequired: [
      'ST Caste Certificate',
      'Family Income Certificate (<= ₹6.00 Lakh)',
      'Valid Passport & unconditional offer letter from QS top 1000 foreign university',
      'Qualifying Degree marksheet with at least 55% marks',
      'Bank Account details'
    ],
    priorityWeight: 85
  },
  {
    id: 'PRE-MATRIC-ST',
    name: 'Pre-Matric Scholarship for ST Students (Class IX & X)',
    code: 'MOTA-SCH-005',
    ministry: 'Ministry of Tribal Affairs',
    description: 'Aimed at supporting parents of ST children for education of their wards studying in classes IX and X to minimize dropout rates at transition.',
    guidelineClauseRef: 'Pre-Matric ST Guidelines 2020, Clause 3.1 & Clause 3.2',
    allowedCourseLevels: ['Pre-Matric'],
    maxAnnualIncome: 250000, // Rs. 2.5 Lakh per annum
    minPercentage: 35,
    pwdRelaxationPercentage: 5,
    benefitAmount: 'Day Scholar: ₹225/month + Book grant ₹750/yr; Hosteller: ₹525/month + Book grant ₹1,000/yr',
    tenure: '10 months in an academic year',
    documentsRequired: [
      'ST Caste Certificate issued by Competent Authority',
      'Income Certificate (<= ₹2.5 Lakhs)',
      'Class 8 Pass Certificate / Previous class marksheet',
      'Parent or Student Bank Account linked to Aadhaar'
    ],
    priorityWeight: 75
  }
];
