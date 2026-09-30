import { CampPlannerItem } from '../types';

export const INITIAL_CAMP_PLANNER_DATA: CampPlannerItem[] = [
  {
    id: 'CAMP-CG-01',
    district: 'Sukma (Bastar Division)',
    state: 'Chhattisgarh',
    tribalPopulationLakhs: 2.1,
    gapStudents: 38400,
    estimatedReachable: 14200,
    primaryBarrier: 'Aadhaar-Bank NPCI DBT seeding backlog & remote forest hamlet connectivity',
    suggestedDateRange: '12 Oct 2026 – 20 Oct 2026',
    targetPVTGs: ['Madia Gond', 'Dorla', 'Murba'],
    mobileVanUnits: 4,
    approved: false,
    sanctionOrderNumber: 'MoTA/CAMP/2026/CG-01'
  },
  {
    id: 'CAMP-OD-02',
    district: 'Malkangiri (Southern Range)',
    state: 'Odisha',
    tribalPopulationLakhs: 3.5,
    gapStudents: 31500,
    estimatedReachable: 11800,
    primaryBarrier: 'PVTG caste certificate digitization & biometric validation offline van',
    suggestedDateRange: '18 Oct 2026 – 26 Oct 2026',
    targetPVTGs: ['Bonda', 'Didayi', 'Koya'],
    mobileVanUnits: 3,
    approved: false,
    sanctionOrderNumber: 'MoTA/CAMP/2026/OD-02'
  },
  {
    id: 'CAMP-JH-03',
    district: 'Khunti (Chhota Nagpur Belt)',
    state: 'Jharkhand',
    tribalPopulationLakhs: 4.0,
    gapStudents: 26900,
    estimatedReachable: 9600,
    primaryBarrier: 'Transition dropout between Matric & Polytechnic; Gram Sabha camps',
    suggestedDateRange: '22 Oct 2026 – 30 Oct 2026',
    targetPVTGs: ['Birhor', 'Munda', 'Oraon'],
    mobileVanUnits: 3,
    approved: false,
    sanctionOrderNumber: 'MoTA/CAMP/2026/JH-03'
  },
  {
    id: 'CAMP-MH-04',
    district: 'Nandurbar (Satpuda Hill Tracts)',
    state: 'Maharashtra',
    tribalPopulationLakhs: 11.2,
    gapStudents: 24100,
    estimatedReachable: 8900,
    primaryBarrier: 'Dormant bank accounts & missing ration-database linkage',
    suggestedDateRange: '25 Oct 2026 – 02 Nov 2026',
    targetPVTGs: ['Katkari', 'Bhil', 'Pawra'],
    mobileVanUnits: 2,
    approved: false,
    sanctionOrderNumber: 'MoTA/CAMP/2026/MH-04'
  },
  {
    id: 'CAMP-ML-05',
    district: 'West Khasi Hills',
    state: 'Meghalaya',
    tribalPopulationLakhs: 2.8,
    gapStudents: 19800,
    estimatedReachable: 7400,
    primaryBarrier: 'Non-digitized high school records requiring mobile V-SAT terminal van',
    suggestedDateRange: '01 Nov 2026 – 08 Nov 2026',
    targetPVTGs: ['Khasi', 'Garo Hill Clusters'],
    mobileVanUnits: 2,
    approved: false,
    sanctionOrderNumber: 'MoTA/CAMP/2026/ML-05'
  }
];
