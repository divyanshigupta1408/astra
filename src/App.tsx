import React, { useState, useEffect } from 'react';
import { AuthUser, AppLanguage, AuditLogEntry, UserRole } from './types';
import { LandingPage } from './components/LandingPage';
import { StudentLogin } from './components/Auth/StudentLogin';
import { OfficerLogin } from './components/Auth/OfficerLogin';
import { MinistryLogin } from './components/Auth/MinistryLogin';
import { StudentDashboard } from './components/StudentView/StudentDashboard';
import { OfficerDashboard } from './components/OfficerView/OfficerDashboard';
import { MinistryDashboard } from './components/AnalystView/MinistryDashboard';
import { AccessDeniedPage } from './components/AccessDeniedPage';
import { SystemDesignModal } from './components/SystemDesignModal';
import { AuditLogModal } from './components/AuditLogModal';
import { LegalAndInfoModal, InfoModalType } from './components/LegalAndInfoModals';
import { NotFoundPage } from './components/NotFoundPage';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AccessibilityProvider } from './components/AccessibilityContext';
import { generateAuditHash } from './data/auditLog';

export default function App() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  // Current in-memory session (No localStorage for auth session!)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [language, setLanguage] = useState<AppLanguage>('en');

  // In-memory URL path simulation, synced with window.location.pathname / hash
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      return p && p !== '' ? p : '/';
    }
    return '/';
  });

  // Modals
  const [isSystemDesignOpen, setIsSystemDesignOpen] = useState<boolean>(false);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState<boolean>(false);
  const [activeInfoModal, setActiveInfoModal] = useState<InfoModalType>(null);

  // Live Cryptographic Audit Chain State
  const [customAuditLogs, setCustomAuditLogs] = useState<AuditLogEntry[]>([]);

  // Hash-chained audit logger
  const logAuditAction = (action: string, targetId: string, actorOverride?: string, roleOverride?: string) => {
    const prevHash = customAuditLogs.length > 0 
      ? customAuditLogs[0].hash 
      : '12b847fae94012bc8519409df28a719240bc9182371904ea928194019f20184c';

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const newHash = generateAuditHash(prevHash, `${action}-${targetId}-${timestamp}`);

    const actor = actorOverride || (currentUser ? currentUser.emailOrPhone : 'anonymous.user');
    const role = roleOverride || (currentUser ? currentUser.role : 'Guest');

    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp,
      actor,
      role,
      action,
      targetId,
      ruleVersion: 'v2026.04.R1',
      modelVersion: 'rbac-gateway-v3',
      previousHash: prevHash,
      hash: newHash
    };

    setCustomAuditLogs(prev => [newEntry, ...prev]);
  };

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
    }
  };

  // Authentication Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.preferredLanguage) {
      setLanguage(user.preferredLanguage);
    }
    logAuditAction(
      'AUTH_USER_LOGIN_SUCCESS',
      `${user.role.toUpperCase()}:${user.identifier}`,
      user.emailOrPhone,
      user.role
    );

    // Route to appropriate role dashboard
    if (user.role === 'student') {
      navigateTo('/student');
    } else if (user.role === 'officer') {
      navigateTo('/officer');
    } else if (user.role === 'analyst') {
      navigateTo('/ministry');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      logAuditAction(
        'AUTH_USER_LOGGED_OUT',
        `${currentUser.role.toUpperCase()}:${currentUser.identifier}`,
        currentUser.emailOrPhone,
        currentUser.role
      );
    }
    setCurrentUser(null);
    navigateTo('/');
  };

  // ROUTE GUARDS & ACCESS CONTROL LOGIC
  // If not logged in:
  if (!currentUser) {
    if (currentPath.startsWith('/student')) {
      return (
        <StudentLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          language={language}
          onLanguageChange={setLanguage}
        />
      );
    }
    if (currentPath.startsWith('/officer')) {
      return (
        <OfficerLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          language={language}
        />
      );
    }
    if (currentPath.startsWith('/ministry')) {
      return (
        <MinistryLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          language={language}
        />
      );
    }

    // Explicit login pages
    if (currentPath === '/login/student') {
      return (
        <StudentLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          language={language}
          onLanguageChange={setLanguage}
        />
      );
    }
    if (currentPath === '/login/officer') {
      return (
        <OfficerLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          language={language}
        />
      );
    }
    if (currentPath === '/login/ministry') {
      return (
        <MinistryLogin
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigateTo}
          language={language}
        />
      );
    }

    // Root Landing Page
    if (currentPath === '/' || currentPath === '') {
      return (
        <>
          <LandingPage
            onNavigate={navigateTo}
            language={language}
            onLanguageChange={setLanguage}
            onOpenAuditLog={() => setIsAuditLogOpen(true)}
            onOpenSystemDesign={() => setIsSystemDesignOpen(true)}
            onOpenInfoModal={(type) => setActiveInfoModal(type)}
          />
          <SystemDesignModal
            isOpen={isSystemDesignOpen}
            onClose={() => setIsSystemDesignOpen(false)}
          />
          <AuditLogModal
            isOpen={isAuditLogOpen}
            onClose={() => setIsAuditLogOpen(false)}
            customEntries={customAuditLogs}
          />
          <LegalAndInfoModal
            modalType={activeInfoModal}
            onClose={() => setActiveInfoModal(null)}
          />
        </>
      );
    }

    // Unknown route -> 404 Page
    return (
      <NotFoundPage
        onNavigateHome={() => navigateTo('/')}
        onNavigateRoleLogin={(role) => navigateTo(`/login/${role}`)}
        attemptedPath={currentPath}
      />
    );
  }

  // LOGGED-IN USERS: ENFORCE 403 ACCESS DENIED ACROSS BOUNDARIES
  const userRole = currentUser.role;

  // Unknown route for logged in users
  const isDashboardRoot = currentPath === '/' || currentPath === '';
  const isStudentPath = currentPath.startsWith('/student');
  const isOfficerPath = currentPath.startsWith('/officer');
  const isMinistryPath = currentPath.startsWith('/ministry');

  if (!isDashboardRoot && !isStudentPath && !isOfficerPath && !isMinistryPath) {
    return (
      <NotFoundPage
        onNavigateHome={() => navigateTo(userRole === 'student' ? '/student' : userRole === 'officer' ? '/officer' : '/ministry')}
        onNavigateRoleLogin={(role) => navigateTo(userRole === 'student' ? '/student' : userRole === 'officer' ? '/officer' : '/ministry')}
        attemptedPath={currentPath}
      />
    );
  }

  // Boundary checks:
  if (isStudentPath && userRole !== 'student') {
    logAuditAction(
      'RBAC_ACCESS_DENIED_ATTEMPT',
      `Target: /student, UserRole: ${userRole}`,
      currentUser.emailOrPhone,
      currentUser.role
    );
    return (
      <AccessDeniedPage
        currentUser={currentUser}
        attemptedRole="student"
        onNavigateHome={() => navigateTo('/')}
        onNavigateToUserDashboard={() => navigateTo(userRole === 'officer' ? '/officer' : '/ministry')}
      />
    );
  }

  if (isOfficerPath && userRole !== 'officer') {
    logAuditAction(
      'RBAC_ACCESS_DENIED_ATTEMPT',
      `Target: /officer, UserRole: ${userRole}`,
      currentUser.emailOrPhone,
      currentUser.role
    );
    return (
      <AccessDeniedPage
        currentUser={currentUser}
        attemptedRole="officer"
        onNavigateHome={() => navigateTo('/')}
        onNavigateToUserDashboard={() => navigateTo(userRole === 'student' ? '/student' : '/ministry')}
      />
    );
  }

  if (isMinistryPath && userRole !== 'analyst') {
    logAuditAction(
      'RBAC_ACCESS_DENIED_ATTEMPT',
      `Target: /ministry, UserRole: ${userRole}`,
      currentUser.emailOrPhone,
      currentUser.role
    );
    return (
      <AccessDeniedPage
        currentUser={currentUser}
        attemptedRole="ministry"
        onNavigateHome={() => navigateTo('/')}
        onNavigateToUserDashboard={() => navigateTo(userRole === 'student' ? '/student' : '/officer')}
      />
    );
  }

  // Render designated dashboard:
  if (userRole === 'student') {
    return (
      <>
        <StudentDashboard
          user={currentUser}
          language={language}
          onLanguageChange={setLanguage}
          onLogout={handleLogout}
          onLogAction={logAuditAction}
        />
        <AuditLogModal
          isOpen={isAuditLogOpen}
          onClose={() => setIsAuditLogOpen(false)}
          customEntries={customAuditLogs}
        />
        <LegalAndInfoModal
          modalType={activeInfoModal}
          onClose={() => setActiveInfoModal(null)}
        />
      </>
    );
  }

  if (userRole === 'officer') {
    return (
      <>
        <OfficerDashboard
          user={currentUser}
          language={language}
          onLanguageChange={setLanguage}
          onLogout={handleLogout}
          onLogAction={logAuditAction}
        />
        <AuditLogModal
          isOpen={isAuditLogOpen}
          onClose={() => setIsAuditLogOpen(false)}
          customEntries={customAuditLogs}
        />
        <LegalAndInfoModal
          modalType={activeInfoModal}
          onClose={() => setActiveInfoModal(null)}
        />
      </>
    );
  }

  if (userRole === 'analyst') {
    return (
      <>
        <MinistryDashboard
          user={currentUser}
          language={language}
          onLanguageChange={setLanguage}
          onLogout={handleLogout}
          onLogAction={logAuditAction}
        />
        <AuditLogModal
          isOpen={isAuditLogOpen}
          onClose={() => setIsAuditLogOpen(false)}
          customEntries={customAuditLogs}
        />
        <LegalAndInfoModal
          modalType={activeInfoModal}
          onClose={() => setActiveInfoModal(null)}
        />
      </>
    );
  }

  return null;
}
