import { 
  SchemeRule, 
  StudentProfile, 
  EligibilityResult, 
  NearMissResult, 
  RuleClause 
} from '../types';

export function evaluateStudentEligibility(
  profile: StudentProfile,
  schemes: SchemeRule[]
): {
  eligibleSchemes: EligibilityResult[];
  nearMissSchemes: NearMissResult[];
  ineligibleSchemes: EligibilityResult[];
} {
  const eligibleSchemes: EligibilityResult[] = [];
  const nearMissSchemes: NearMissResult[] = [];
  const ineligibleSchemes: EligibilityResult[] = [];

  for (const scheme of schemes) {
    const traces: RuleClause[] = [];

    // 1. ST Category Check (National Mandate)
    const isST = profile.category === 'ST';
    traces.push({
      clauseNumber: 'Clause 1.1',
      title: 'Scheduled Tribe Community Verification',
      conditionDescription: 'Applicant must belong to a recognized Scheduled Tribe community',
      isPassed: isST,
      actualValue: profile.category,
      expectedValue: 'Scheduled Tribe (ST)'
    });

    // 2. Course Level Check
    const isCourseEligible = scheme.allowedCourseLevels.includes(profile.courseLevel);
    traces.push({
      clauseNumber: scheme.id === 'PMS-ST' ? 'Clause 4.1' : (scheme.id === 'PRE-MATRIC-ST' ? 'Clause 3.1' : 'Clause 2.1'),
      title: 'Target Academic Level',
      conditionDescription: `Course must be one of: ${scheme.allowedCourseLevels.join(', ')}`,
      isPassed: isCourseEligible,
      actualValue: profile.courseLevel,
      expectedValue: scheme.allowedCourseLevels.join(' / ')
    });

    // 3. Income Ceiling Check
    const isIncomeEligible = profile.annualFamilyIncome <= scheme.maxAnnualIncome;
    traces.push({
      clauseNumber: scheme.id === 'PMS-ST' ? 'Clause 5.2' : (scheme.id === 'PRE-MATRIC-ST' ? 'Clause 3.2' : 'Clause 5.1'),
      title: 'Annual Family Income Ceiling',
      conditionDescription: `Annual family income must not exceed ₹${scheme.maxAnnualIncome.toLocaleString('en-IN')}`,
      isPassed: isIncomeEligible,
      actualValue: `₹${profile.annualFamilyIncome.toLocaleString('en-IN')}`,
      expectedValue: `<= ₹${scheme.maxAnnualIncome.toLocaleString('en-IN')}`
    });

    // 4. Minimum Percentage Check (with PwD relaxation if applicable)
    const requiredMinPercentage = profile.isPwd 
      ? Math.max(0, scheme.minPercentage - (scheme.pwdRelaxationPercentage || 5))
      : scheme.minPercentage;
    const isPercentageEligible = profile.percentageLastExam >= requiredMinPercentage;
    traces.push({
      clauseNumber: scheme.id === 'NFHET-ST' ? 'Clause 6.3' : (scheme.id === 'NOS-ST' ? 'Clause 8.4' : 'Clause 4.3'),
      title: profile.isPwd ? 'Merit Threshold (with 5% PwD relaxation)' : 'Academic Merit Threshold',
      conditionDescription: `Minimum marks in qualifying examination: ${requiredMinPercentage}%`,
      isPassed: isPercentageEligible,
      actualValue: `${profile.percentageLastExam}%`,
      expectedValue: `>= ${requiredMinPercentage}%`
    });

    // 5. Institute Suitability Check for Top Class
    let isInstituteEligible = true;
    if (scheme.id === 'TOP-CLASS-ST') {
      isInstituteEligible = profile.instituteType.includes('National Importance') || profile.instituteName.toLowerCase().includes('iit') || profile.instituteName.toLowerCase().includes('nit') || profile.instituteName.toLowerCase().includes('aiims') || profile.instituteName.toLowerCase().includes('iim');
      traces.push({
        clauseNumber: 'Clause 1.2',
        title: 'Notified Institute of Excellence Mandate',
        conditionDescription: 'Must be admitted into an institution notified by MoTA (IITs, NITs, IIMs, AIIMS, NLUs)',
        isPassed: isInstituteEligible,
        actualValue: profile.instituteType,
        expectedValue: 'Notified Institute of Excellence'
      });
    }

    const failedTraces = traces.filter(t => !t.isPassed);
    const passedCount = traces.filter(t => t.isPassed).length;
    const matchScore = Math.round((passedCount / traces.length) * 100);

    if (failedTraces.length === 0) {
      eligibleSchemes.push({
        scheme,
        isEligible: true,
        ruleTraces: traces,
        matchScore
      });
    } else if (failedTraces.length <= 2) {
      // Near miss - explain specifically what needs to change
      const changeNeeded: string[] = [];
      for (const fail of failedTraces) {
        if (fail.title.includes('Income')) {
          const diff = profile.annualFamilyIncome - scheme.maxAnnualIncome;
          changeNeeded.push(`Annual income of ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} exceeds the scheme ceiling by ₹${diff.toLocaleString('en-IN')}. Needs family income <= ₹${scheme.maxAnnualIncome.toLocaleString('en-IN')}.`);
        } else if (fail.title.includes('Merit')) {
          const diff = (requiredMinPercentage - profile.percentageLastExam).toFixed(1);
          changeNeeded.push(`Qualifying score is ${profile.percentageLastExam}%, which is ${diff}% below the required ${requiredMinPercentage}%.`);
        } else if (fail.title.includes('Academic Level')) {
          changeNeeded.push(`Current study level "${profile.courseLevel}" is outside the scheme scope (${scheme.allowedCourseLevels.join(', ')}).`);
        } else if (fail.title.includes('Institute')) {
          changeNeeded.push(`Institute must belong to the MoTA notified list of institutions of national excellence.`);
        } else {
          changeNeeded.push(`${fail.title}: Expected ${fail.expectedValue}, but received ${fail.actualValue}.`);
        }
      }

      nearMissSchemes.push({
        scheme,
        failedClauses: failedTraces,
        changeNeeded
      });
    } else {
      ineligibleSchemes.push({
        scheme,
        isEligible: false,
        ruleTraces: traces,
        matchScore
      });
    }
  }

  // Sort eligible schemes by priority
  eligibleSchemes.sort((a, b) => b.scheme.priorityWeight - a.scheme.priorityWeight);

  return { eligibleSchemes, nearMissSchemes, ineligibleSchemes };
}
