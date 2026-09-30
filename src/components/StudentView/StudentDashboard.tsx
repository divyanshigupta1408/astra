import React, { useState } from 'react';
import { AuthUser, AppLanguage, StudentProfile } from '../../types';
import { StudentLayout, StudentNavTab } from './StudentLayout';
import { StudentHomeTab } from './StudentHomeTab';
import { EligibilityChecker } from './EligibilityChecker';
import { SmartApplication } from './SmartApplication';
import { StudentDocumentsTab } from './StudentDocumentsTab';
import { ApplicationTracker } from './ApplicationTracker';
import { StudentRenewalTab } from './StudentRenewalTab';
import { StudentGrievanceTab } from './StudentGrievanceTab';
import { AccessControlPanel } from '../AccessControlPanel';
import { AiAssistantWidget } from '../AiAssistantWidget';

interface StudentDashboardProps {
  user: AuthUser;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onLogout: () => void;
  onLogAction?: (action: string, targetId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout,
  onLogAction
}) => {
  const [activeTab, setActiveTab] = useState<StudentNavTab>('home');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('TOP-CLASS-ST');
  const [isGramSabhaFallback, setIsGramSabhaFallback] = useState<boolean>(false);
  const [createdApplicationId, setCreatedApplicationId] = useState<string>(
    user.studentApplicationId || 'VV-2026-CG-088219'
  );

  // Student's isolated profile
  const isMeena = user.identifier === '9876543210' || user.id === 'USR-STU-MEENA';
  const initialProfile: StudentProfile = isMeena ? {
    name: 'Meena Kumari Mandavi (मीना कुमारी मंडावी)',
    fatherName: 'Manglu Mandavi',
    dob: '2004-07-15',
    gender: 'Female',
    state: 'Chhattisgarh',
    certificateState: 'Chhattisgarh',
    instituteState: 'Chhattisgarh',
    district: 'Dantewada',
    courseLevel: 'UG',
    instituteType: 'Central University / Institute of National Importance (IIT, IIM, AIIMS, NIT)',
    instituteName: 'National Institute of Technology (NIT) Raipur',
    annualFamilyIncome: 120000,
    percentageLastExam: 84.5,
    isPwd: false,
    category: 'ST',
    aadhaarSeededBank: true,
    accountNumberMasked: '••••••••8821'
  } : {
    name: 'Ramu Kumar',
    fatherName: 'Gopal Soren',
    dob: '2003-04-12',
    gender: 'Male',
    state: 'Odisha',
    certificateState: 'Odisha',
    instituteState: 'Odisha',
    district: 'Mayurbhanj',
    courseLevel: 'UG',
    instituteType: 'Central University / Institute of National Importance (IIT, IIM, AIIMS, NIT)',
    instituteName: 'National Institute of Technology (NIT) Rourkela',
    annualFamilyIncome: 185000,
    percentageLastExam: 78.4,
    isPwd: false,
    category: 'ST',
    aadhaarSeededBank: true,
    accountNumberMasked: '••••••••3912'
  };

  const handleProceedToApply = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    setActiveTab('apply');
    if (onLogAction) {
      onLogAction('STUDENT_SELECTED_SCHEME_FOR_APPLICATION', schemeId);
    }
  };

  const handleApplicationSubmitted = (appId: string, isGramSabha?: boolean) => {
    setCreatedApplicationId(appId || (isGramSabha ? 'VV-2026-OD-077402' : 'VV-2026-CG-088219'));
    setIsGramSabhaFallback(Boolean(isGramSabha));
    setActiveTab('track');
    if (onLogAction) {
      onLogAction(
        isGramSabha ? 'STUDENT_SUBMITTED_COMMUNITY_ATTESTATION' : 'STUDENT_APPLICATION_SUBMITTED',
        appId
      );
    }
  };

  return (
    <StudentLayout
      user={user}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      language={language}
      onLanguageChange={onLanguageChange}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        {/* Your Access Scope Panel */}
        <AccessControlPanel user={user} />

        {/* Tab 1: Home */}
        {activeTab === 'home' && (
          <StudentHomeTab
            user={user}
            language={language}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Tab 2: Check Eligibility */}
        {activeTab === 'eligibility' && (
          <EligibilityChecker
            language={language}
            onProceedToApply={(sId) => handleProceedToApply(sId)}
            initialProfile={initialProfile}
          />
        )}

        {/* Tab 3: My Application */}
        {activeTab === 'apply' && (
          <SmartApplication
            language={language}
            selectedSchemeId={selectedSchemeId}
            initialProfile={initialProfile}
            onSubmitSuccess={handleApplicationSubmitted}
          />
        )}

        {/* Tab 4: Documents */}
        {activeTab === 'documents' && (
          <StudentDocumentsTab
            user={user}
            language={language}
          />
        )}

        {/* Tab 5: Track Status */}
        {activeTab === 'track' && (
          <ApplicationTracker
            language={language}
            applicationId={createdApplicationId}
            isGramSabhaFallback={isGramSabhaFallback}
          />
        )}

        {/* Tab 6: Renewal */}
        {activeTab === 'renewal' && (
          <StudentRenewalTab
            user={user}
            language={language}
            onLogAction={onLogAction}
          />
        )}

        {/* Tab 7: Help & Grievance */}
        {activeTab === 'grievance' && (
          <StudentGrievanceTab
            user={user}
            language={language}
            onLogAction={onLogAction}
          />
        )}
      </div>

      {/* Embedded Assistant */}
      <AiAssistantWidget language={language} />
    </StudentLayout>
  );
};
