import React, { useState } from 'react';
import { AuthUser, AppLanguage } from '../../types';
import { 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  HeartHandshake, 
  HelpCircle, 
  Send, 
  AlertCircle, 
  PhoneCall, 
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useToast } from '../Toast';

interface StudentRenewalTabProps {
  user: AuthUser;
  language: AppLanguage;
  onLogAction?: (action: string, targetId: string) => void;
}

export const StudentRenewalTab: React.FC<StudentRenewalTabProps> = ({ user, language, onLogAction }) => {
  const { showToast } = useToast();
  const isMeena = user.identifier === '9876543210' || user.id === 'USR-STU-MEENA';

  // Renewal Form State (pre-filled)
  const [currentYear, setCurrentYear] = useState<string>('2nd Year (Semester III & IV)');
  const [previousYearGpa, setPreviousYearGpa] = useState<string>('8.42 CGPA');
  const [attendancePercent, setAttendancePercent] = useState<string>('89.5%');
  const [incomeReaffirmed, setIncomeReaffirmed] = useState<boolean>(true);
  const [hostelResident, setHostelResident] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmitRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    const renewalRef = isMeena ? 'VV-2026-CG-088219/REN' : 'VV-2026-OD-091823/REN';
    showToast(
      `Renewal claim ${renewalRef} submitted. DBT continuity order generated.`,
      'success',
      'Renewal Claim Submitted'
    );
    if (onLogAction) {
      onLogAction('STUDENT_RENEWAL_CLAIM_SUBMITTED', renewalRef);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {language === 'hi' ? 'वार्षिक छात्रवृत्ति नवीनीकरण (Annual Renewal Claim)' : 'Annual Scholarship Renewal Claim'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'hi'
              ? 'अगले शैक्षणिक सत्र हेतु पूर्व-भरे आवेदन की पुष्टि करें एवं निर्बाध डीबीटी वितरण सुनिश्चित करें।'
              : 'Pre-filled academic continuation verification for direct tuition and living grant continuation.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-50 border border-amber-300 text-amber-900 font-bold">
            Window: Open for 2026-27
          </span>
        </div>
      </div>

      {/* SUPPORTIVE ACADEMIC MENTORSHIP / COUNSELING PANEL */}
      {/* NOTE: Strictly supportive tone. Never show "dropout risk score" to the student! */}
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4.5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                {language === 'hi' ? 'जनजातीय शैक्षणिक संबल केंद्र (Student Support Desk)' : 'Tribal Student Academic Support Program'}
              </h4>
              <p className="text-xs text-emerald-900 font-medium">
                {language === 'hi'
                  ? 'आपकी उच्च शिक्षा यात्रा में मंत्रालय और आपका संस्थान हर कदम पर आपके साथ हैं।'
                  : 'We are here to support your degree completion. Peer tutors, language bridge material, and counseling are fully available.'}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded border border-emerald-300 shrink-0">
            Mentor Support Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="bg-white/90 p-3 rounded-lg border border-emerald-200 space-y-1">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Assigned Campus Mentor</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Dr. S. K. Tirkey (Dept of Metallurgy &amp; Tribal Cell Advisor)
            </p>
            <div className="text-[10px] text-emerald-800 font-mono font-semibold">
              Office Hours: Tue &amp; Thu 15:00 - 17:00 IST
            </div>
          </div>

          <div className="bg-white/90 p-3 rounded-lg border border-emerald-200 space-y-1">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Need Academic or Hostel Assistance?</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Request peer mentoring or book grants directly through your portal.
            </p>
            <button
              type="button"
              onClick={() => alert('Support request dispatched to campus ST Cell.')}
              className="text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
            >
              Request Peer Tutor Connect →
            </button>
          </div>
        </div>
      </div>

      {/* PRE-FILLED RENEWAL FORM */}
      <div className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              Academic Continuation Details (Pre-filled via Institute ERP)
            </h4>
            <p className="text-xs text-stone-500">
              Check and confirm your current semester metrics before submitting to your Nodal Officer.
            </p>
          </div>

          <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-300">
            Clause 8.1 Renewal
          </span>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h5 className="font-bold text-base text-emerald-950">
              Renewal Claim Submitted Successfully!
            </h5>
            <p className="text-xs text-emerald-900 max-w-md mx-auto">
              Your academic continuation has been forwarded to your Institute Nodal Officer for verification. Disbursal advice will be prepared under FY 2026-27 sanction allocation.
            </p>
            <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-3 py-1 rounded border border-emerald-300 inline-block">
              Renewal Ref: {isMeena ? 'VV-2026-CG-088219/REN-02' : 'VV-2026-OD-091823/REN-02'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmitRenewal} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Current Academic Term</label>
                <input
                  type="text"
                  value={currentYear}
                  onChange={(e) => setCurrentYear(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-medium text-stone-800 bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Previous Year CGPA / Percentage</label>
                <input
                  type="text"
                  value={previousYearGpa}
                  onChange={(e) => setPreviousYearGpa(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-medium text-stone-800 bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Recorded Attendance</label>
                <input
                  type="text"
                  value={attendancePercent}
                  onChange={(e) => setAttendancePercent(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-medium text-stone-800 bg-stone-50"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Hostel Status</label>
                <select
                  value={hostelResident ? 'hostel' : 'day'}
                  onChange={(e) => setHostelResident(e.target.value === 'hostel')}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-medium text-stone-800 bg-white"
                >
                  <option value="hostel">Hosteller (Living Allowance Grant ₹2,22,000)</option>
                  <option value="day">Day Scholar (Living Allowance Grant ₹1,20,000)</option>
                </select>
              </div>
            </div>

            {/* Income Reaffirmation Checkbox */}
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="incomeReaffirm"
                checked={incomeReaffirmed}
                onChange={(e) => setIncomeReaffirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                required
              />
              <label htmlFor="incomeReaffirm" className="text-stone-700 cursor-pointer">
                I solemnly reaffirm that my family annual income has not exceeded the statutory threshold of ₹6.00 Lakhs for the financial year 2026-27 under Clause 5.2.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Submit Renewal Application to Nodal Officer</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
