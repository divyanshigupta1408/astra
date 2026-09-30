import React, { useState } from 'react';
import { EligibilityChecker } from './EligibilityChecker';
import { SmartApplication } from './SmartApplication';
import { ApplicationTracker } from './ApplicationTracker';
import { StudentProfile } from '../../types';
import { translations } from '../../locales/translations';

interface StudentViewProps {
  language: 'en' | 'hi';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogAction?: (action: string, targetId: string) => void;
  personaProfile?: StudentProfile;
}

export const StudentView: React.FC<StudentViewProps> = ({
  language,
  activeTab,
  onTabChange,
  onLogAction,
  personaProfile
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('TOP-CLASS-ST');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | undefined>(personaProfile);
  const [createdApplicationId, setCreatedApplicationId] = useState<string>(
    personaProfile ? 'VV-2026-CG-088219' : 'VV-2026-OD-091823'
  );
  const [isGramSabhaFallback, setIsGramSabhaFallback] = useState<boolean>(false);

  React.useEffect(() => {
    if (personaProfile) {
      setStudentProfile(personaProfile);
      setCreatedApplicationId('VV-2026-CG-088219');
    }
  }, [personaProfile]);

  const handleProceedToApply = (schemeId: string, profile: StudentProfile) => {
    setSelectedSchemeId(schemeId);
    setStudentProfile(profile);
    onTabChange('apply');
    if (onLogAction) {
      onLogAction('STUDENT_SELECTED_SCHEME_FOR_APPLICATION', schemeId);
    }
  };

  const handleApplicationSubmitted = (appId: string, isGramSabha?: boolean) => {
    setCreatedApplicationId(appId || (isGramSabha ? 'VV-2026-OD-077402' : 'VV-2026-OD-091823'));
    setIsGramSabhaFallback(Boolean(isGramSabha));
    onTabChange('track');
    if (onLogAction) {
      onLogAction(isGramSabha ? 'STUDENT_SUBMITTED_COMMUNITY_ATTESTATION' : 'STUDENT_APPLICATION_SUBMITTED', appId);
    }
  };

  return (
    <div className="space-y-6">
      {activeTab === 'eligibility' && (
        <EligibilityChecker
          language={language}
          onProceedToApply={handleProceedToApply}
          initialProfile={personaProfile || studentProfile}
        />
      )}

      {activeTab === 'apply' && (
        <SmartApplication
          language={language}
          selectedSchemeId={selectedSchemeId}
          initialProfile={personaProfile || studentProfile}
          onSubmitSuccess={handleApplicationSubmitted}
        />
      )}

      {activeTab === 'track' && (
        <ApplicationTracker
          language={language}
          applicationId={createdApplicationId}
          isGramSabhaFallback={isGramSabhaFallback}
        />
      )}
    </div>
  );
};
