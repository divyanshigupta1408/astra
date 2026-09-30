import React from 'react';
import { AuthUser } from '../types';
import { ShieldCheck, Eye, EyeOff, Lock, Building, MapPin, Landmark } from 'lucide-react';

interface AccessControlPanelProps {
  user: AuthUser;
  totalFilteredRecords?: number;
}

export const AccessControlPanel: React.FC<AccessControlPanelProps> = ({ user, totalFilteredRecords }) => {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-700 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="font-bold text-stone-900 tracking-wide uppercase text-[11px]">
            Your Access Scope (Role-Based Access Control)
          </span>
        </div>
        <span className="font-mono text-[10px] bg-stone-200/80 text-stone-800 px-2 py-0.5 rounded font-bold">
          DPDP Act 2023 &amp; GFR Enforced
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* What this role can see */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
            <Eye className="w-3.5 h-3.5" />
            <span>Permitted Data &amp; Actions:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-600 pl-1">
            {user.role === 'student' && (
              <>
                <li>Access to your own scholarship application record only</li>
                <li>Upload &amp; hash personal documents (caste, income, marksheet)</li>
                <li>Live 6-stage tracker, notifications, and renewal options</li>
              </>
            )}
            {user.role === 'officer' && user.officerSubRole === 'institute' && (
              <>
                <li>Scoped strictly to <strong>{user.assignedInstitute}</strong></li>
                <li>{totalFilteredRecords !== undefined ? `${totalFilteredRecords} applications eligible for institutional scrutiny` : 'Institutional scrutiny'}</li>
                <li>One-click verification, conditional return, and delay prediction</li>
              </>
            )}
            {user.role === 'officer' && user.officerSubRole === 'state' && (
              <>
                <li>Scoped strictly to the State of <strong>{user.assignedState}</strong></li>
                <li>State quota verification and district nodal officer escalation</li>
                <li>Inter-state portability clearance under Article 342</li>
              </>
            )}
            {user.role === 'analyst' && (
              <>
                <li>Aggregated national dashboards &amp; telemetry trends</li>
                <li>District gap saturation &amp; DBT Camp Planner sanctioning</li>
                <li>Institutional Performance Scorecards &amp; notice issuance</li>
              </>
            )}
          </ul>
        </div>

        {/* What this role CANNOT see (Restricted) */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-red-700 font-semibold text-[11px]">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Restricted Boundaries:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-600 pl-1">
            {user.role === 'student' && (
              <>
                <li>Cannot view other students, institutional queues, or fraud flags</li>
                <li>Cannot modify statutory rule clauses or officer notes</li>
                <li>Zero access to administrative audit logs or state sanction ledgers</li>
              </>
            )}
            {user.role === 'officer' && user.officerSubRole === 'institute' && (
              <>
                <li>Cannot see student applications from other universities or colleges</li>
                <li>Cannot approve state quota allotments or ministry sanction orders</li>
                <li>No access to Ministry strategic camp budgets</li>
              </>
            )}
            {user.role === 'officer' && user.officerSubRole === 'state' && (
              <>
                <li>Cannot view applications registered in other states</li>
                <li>Cannot modify national rule engine algorithms</li>
              </>
            )}
            {user.role === 'analyst' && (
              <>
                <li>Raw student PII (full bank account, raw Aadhaar, mobile) masked by law</li>
                <li>Cannot override local officer verification statutory decisions</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
