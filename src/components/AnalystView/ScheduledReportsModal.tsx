import React, { useState } from 'react';
import { ScheduledReport, AppLanguage } from '../../types';
import { Calendar, Clock, Mail, CheckCircle2, X, Plus, Play, Pause, Trash2, Eye, FileText } from 'lucide-react';
import { useToast } from '../Toast';

interface ScheduledReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
}

export const ScheduledReportsModal: React.FC<ScheduledReportsModalProps> = ({
  isOpen,
  onClose,
  language = 'en'
}) => {
  const { showToast } = useToast();

  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: 'rep-1',
      title: 'National Disbursal & PFMS Clearance Summary',
      reportType: 'disbursal_summary',
      frequency: 'Weekly',
      recipients: ['director.scholarships@tribal.gov.in', 'finance.pfms@mota.gov.in'],
      nextRun: 'Every Monday 08:00 IST',
      active: true
    },
    {
      id: 'rep-2',
      title: 'PVTG Saturation & Mobile Camp Progress',
      reportType: 'pvtg_saturation',
      frequency: 'Daily',
      recipients: ['pvtg.cell@tribal.gov.in', 'field.coordinators@itda.gov.in'],
      nextRun: 'Daily at 18:30 IST',
      active: true
    },
    {
      id: 'rep-3',
      title: 'Institutional Delay & UC Non-Compliance Scorecard',
      reportType: 'institution_compliance',
      frequency: 'Monthly',
      recipients: ['nodal.audit@tribal.gov.in'],
      nextRun: '1st of every month',
      active: false
    }
  ]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('Monthly Direct Benefit Transfer Audit');
  const [newType, setNewType] = useState<ScheduledReport['reportType']>('disbursal_summary');
  const [newFrequency, setNewFrequency] = useState<ScheduledReport['frequency']>('Weekly');
  const [newRecipients, setNewRecipients] = useState('analyst@tribal.gov.in');
  const [previewReport, setPreviewReport] = useState<ScheduledReport | null>(null);

  if (!isOpen) return null;

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: ScheduledReport = {
      id: `rep-${Date.now()}`,
      title: newTitle,
      reportType: newType,
      frequency: newFrequency,
      recipients: newRecipients.split(',').map(s => s.trim()).filter(Boolean),
      nextRun: `${newFrequency} run scheduled`,
      active: true
    };
    setReports(prev => [newSchedule, ...prev]);
    setShowNewForm(false);
    showToast(`Scheduled report "${newTitle}" created successfully.`, 'success');
  };

  const toggleReportActive = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    showToast('Schedule status toggled.', 'info');
  };

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast('Schedule removed.', 'info');
  };

  return (
    <div className="fixed inset-0 z-70 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-900" />
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Automated Scheduled Executive Reports
              </h3>
              <p className="text-[11px] text-stone-500">
                Configure automated recurring briefings dispatched to ministry leadership and state directorates.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNewForm(!showNewForm)}
            className="px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Schedule</span>
          </button>
        </div>

        {/* New Report Form */}
        {showNewForm && (
          <form onSubmit={handleCreateSchedule} className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in">
            <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider">
              Create New Scheduled Dispatch
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Report Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Report Data Model</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                >
                  <option value="disbursal_summary">National Disbursal &amp; PFMS Summary</option>
                  <option value="pvtg_saturation">PVTG Saturation &amp; Reach Gaps</option>
                  <option value="institution_compliance">Institutional Delay &amp; UC Compliance</option>
                  <option value="fraud_digest">Syndicate Fraud &amp; Risk Ring Digest</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Frequency</label>
                <select
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                >
                  <option value="Daily">Daily (Post-EOD processing)</option>
                  <option value="Weekly">Weekly (Every Monday Morning)</option>
                  <option value="Monthly">Monthly (1st of Month)</option>
                  <option value="Cycle End">Cycle End (Sanction Closure)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Recipients (comma-separated)</label>
                <input
                  type="text"
                  value={newRecipients}
                  onChange={(e) => setNewRecipients(e.target.value)}
                  placeholder="email1@tribal.gov.in, email2@gov.in"
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-lg shadow-xs"
              >
                Save Schedule
              </button>
            </div>
          </form>
        )}

        {/* Existing Schedules List */}
        <div className="space-y-2">
          <div className="font-bold text-stone-700 text-xs">
            Active Automated Schedules ({reports.length}):
          </div>

          <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden bg-white">
            {reports.map((rep) => (
              <div key={rep.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-xs">{rep.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      rep.active ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {rep.active ? 'Active' : 'Paused'}
                    </span>
                    <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded border border-stone-200">
                      {rep.frequency}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">
                    Recipients: {rep.recipients.join(', ')}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Next run: {rep.nextRun}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewReport(rep)}
                    className="p-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 cursor-pointer"
                    title="Preview report layout"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleReportActive(rep.id)}
                    className={`p-1.5 rounded-lg border cursor-pointer ${
                      rep.active 
                        ? 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800' 
                        : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                    }`}
                    title={rep.active ? 'Pause schedule' : 'Resume schedule'}
                  >
                    {rep.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReport(rep.id)}
                    className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 cursor-pointer"
                    title="Delete schedule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Modal Overlay */}
        {previewReport && (
          <div className="p-4 bg-stone-50 border-2 border-stone-300 rounded-xl space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="font-bold text-stone-800 text-xs">Preview Dispatch: {previewReport.title}</span>
              <button onClick={() => setPreviewReport(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-stone-600">
              Dispatched automatically as an encrypted PDF attachment with SHA-256 audit hash to verified addresses: {previewReport.recipients.join(', ')}.
            </p>
            <div className="bg-white p-3 rounded-lg border border-stone-200 text-[10px] font-mono text-stone-700">
              STATUS: GFR-2017 CERTIFIED • 24.5L ST COHORT • 11 DAYS TURNAROUND • PFMS BATCH #2026-081 ATTESTED
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
