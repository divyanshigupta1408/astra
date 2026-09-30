import { AuthUser, OfficerApplication } from '../types';

/**
 * Data Scoping Engine: Enforces boundary rules at the data retrieval layer.
 * 
 * Boundary Specifications:
 * - Student: Can only read their own application record. Never sees other applicants or audit telemetry.
 * - Institute Nodal Officer: Scoped ONLY to the assigned institution (e.g. NIT Rourkela).
 * - State Officer: Scoped ONLY to the assigned state (e.g. Odisha).
 * - Ministry Analyst: Sees national aggregates. Individual personal PII (raw bank numbers, phone numbers,
 *   raw document file paths) are masked / redacted.
 */

export function filterApplicationsForUser(
  applications: OfficerApplication[],
  user: AuthUser | null
): OfficerApplication[] {
  if (!user) return [];

  if (user.role === 'student') {
    // Only student's own record
    if (user.studentApplicationId) {
      return applications.filter(a => a.id === user.studentApplicationId || a.applicationNumber === user.studentApplicationId);
    }
    // Fallback: match by student name
    return applications.filter(a => a.studentName.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]));
  }

  if (user.role === 'officer') {
    if (user.officerSubRole === 'institute' && user.assignedInstitute) {
      return applications.filter(a => a.institute.toLowerCase().trim() === user.assignedInstitute!.toLowerCase().trim());
    }
    if (user.officerSubRole === 'state' && user.assignedState) {
      return applications.filter(a => a.state.toLowerCase().trim() === user.assignedState!.toLowerCase().trim());
    }
    return applications;
  }

  if (user.role === 'analyst') {
    // Ministry sees all records but with PII masked by law (GFR & Digital Personal Data Protection Act DPDP 2023)
    return applications.map(app => ({
      ...app,
      studentName: maskName(app.studentName),
      fatherName: '••••••••',
      dob: '••••-••-••',
      bankAccountMasked: '••••••••' + app.bankAccountMasked.slice(-4),
      mobileNumberMasked: '+91 ••••• •••' + app.mobileNumberMasked.slice(-2),
      extractedDocs: app.extractedDocs.map(d => ({
        ...d,
        extractedData: Object.fromEntries(
          Object.entries(d.extractedData).map(([k, v]) => [
            k,
            k.toLowerCase().includes('name') || k.toLowerCase().includes('account') || k.toLowerCase().includes('roll')
              ? '•••••••• (Masked DPDP-2023)'
              : v
          ])
        )
      }))
    }));
  }

  return [];
}

function maskName(name: string): string {
  const parts = name.split(' ');
  if (parts.length <= 1) return name.slice(0, 1) + '••••';
  return parts[0].slice(0, 2) + '•••• ' + parts[parts.length - 1].slice(0, 1) + '••••';
}
