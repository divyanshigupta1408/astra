import React, { useState, useMemo } from 'react';
import { MOCK_INSTITUTE_SCORECARD } from '../data/mockInstitutes';
import { InstituteScorecardItem } from '../types';
import { 
  Building2, 
  Search, 
  Filter, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  Download, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  BarChart2
} from 'lucide-react';
import { useToast } from './Toast';

interface InstituteScorecardTableProps {
  language: 'en' | 'hi';
  userRole?: 'officer' | 'analyst';
  onIssueNotice?: (instituteName: string) => void;
}

export const InstituteScorecardTable: React.FC<InstituteScorecardTableProps> = ({
  language,
  userRole = 'officer',
  onIssueNotice
}) => {
  const { showToast } = useToast();
  const [institutes, setInstitutes] = useState<InstituteScorecardItem[]>(MOCK_INSTITUTE_SCORECARD);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [notifiedInstitutes, setNotifiedInstitutes] = useState<Record<string, boolean>>({});

  const handleSendNotice = (id: string, name: string) => {
    setNotifiedInstitutes(prev => ({ ...prev, [id]: true }));
    showToast(`Compliance notice formally dispatched to Registrar, ${name}.`, 'warning', 'Statutory Notice Dispatched');
    if (onIssueNotice) onIssueNotice(name);
  };

  const filteredInstitutes = useMemo(() => {
    return institutes.filter(inst => {
      const matchSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.state.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchState = selectedState === 'All' || inst.state === selectedState;
      const matchStatus = selectedStatus === 'All' || inst.status === selectedStatus;

      return matchSearch && matchState && matchStatus;
    });
  }, [institutes, searchTerm, selectedState, selectedStatus]);

  // Aggregate stats
  const avgVerificationDays = useMemo(() => {
    const total = institutes.reduce((acc, curr) => acc + curr.avgVerificationDays, 0);
    return (total / institutes.length).toFixed(1);
  }, [institutes]);

  const avgUcCompliance = useMemo(() => {
    const total = institutes.reduce((acc, curr) => acc + curr.ucCompliancePercent, 0);
    return (total / institutes.length).toFixed(1);
  }, [institutes]);

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
      {/* Header and KPI strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-800" />
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {language === 'hi' ? 'संस्थान प्रदर्शन स्कोरकार्ड (Institute Scorecard)' : 'Institutional Verification & UC Compliance Scorecard'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {language === 'hi' 
              ? 'सत्यापन अवधि (दिन), उपयोगिता प्रमाण पत्र (UC) अनुपालन एवं अस्वीकृति दर का संस्थान-वार विश्लेषण'
              : 'Ranked institutional performance monitoring: verification velocity, Utilization Certificate (UC) audit readiness, and friction rates'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-stone-100 border border-stone-300 text-stone-800 font-semibold">
            National Avg Verification: <strong className="text-emerald-800">{avgVerificationDays} Days</strong>
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold">
            Avg UC Compliance: <strong className="text-emerald-800">{avgUcCompliance}%</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search institute name, code, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-stone-300 bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 rounded-md border border-stone-300 bg-white font-medium text-stone-800"
          >
            <option value="All">All States</option>
            <option value="Odisha">Odisha</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-md border border-stone-300 bg-white font-medium text-stone-800"
          >
            <option value="All">All Status Tiers</option>
            <option value="Exemplary">Exemplary (Green)</option>
            <option value="Satisfactory">Satisfactory (Amber)</option>
            <option value="Critical Delay">Critical Delay (Red)</option>
          </select>
        </div>
      </div>

      {/* Ranked Scorecard Table */}
      <div className="overflow-x-auto border border-stone-200 rounded-lg">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
              <th className="py-2.5 px-3 w-12 text-center">Rank</th>
              <th className="py-2.5 px-3">Institute & AISHE Code</th>
              <th className="py-2.5 px-3">State</th>
              <th className="py-2.5 px-3 text-right">Apps Handled</th>
              <th className="py-2.5 px-3 text-right">Avg Verification</th>
              <th className="py-2.5 px-3 text-right">UC Compliance</th>
              <th className="py-2.5 px-3 text-right">Rejection Rate</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Statutory Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {filteredInstitutes.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-stone-500 italic">
                  No institutes match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredInstitutes.map((inst, index) => {
                const isNotified = notifiedInstitutes[inst.id];
                return (
                  <tr key={inst.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-stone-600">
                      #{index + 1}
                    </td>

                    {/* Institute & Code */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{inst.name}</div>
                      <div className="text-[10px] text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">{inst.code}</span>
                        <span>•</span>
                        <span>{inst.type}</span>
                      </div>
                    </td>

                    {/* State */}
                    <td className="py-3 px-3 font-medium text-stone-700">
                      {inst.state}
                    </td>

                    {/* Total Apps Handled */}
                    <td className="py-3 px-3 text-right font-mono font-semibold text-stone-800">
                      {inst.totalApplications.toLocaleString()}
                    </td>

                    {/* Avg Verification Days */}
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        inst.avgVerificationDays <= 5
                          ? 'bg-emerald-100 text-emerald-900'
                          : inst.avgVerificationDays <= 15
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{inst.avgVerificationDays} d</span>
                      </span>
                    </td>

                    {/* UC Compliance % */}
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className={`font-mono font-bold text-xs ${
                          inst.ucCompliancePercent >= 90
                            ? 'text-emerald-800'
                            : inst.ucCompliancePercent >= 70
                            ? 'text-amber-800'
                            : 'text-red-700'
                        }`}>
                          {inst.ucCompliancePercent}%
                        </span>
                        <div className="w-16 bg-stone-200 h-1 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full ${
                              inst.ucCompliancePercent >= 90
                                ? 'bg-emerald-600'
                                : inst.ucCompliancePercent >= 70
                                ? 'bg-amber-500'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${inst.ucCompliancePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Rejection Rate % */}
                    <td className="py-3 px-3 text-right font-mono font-semibold">
                      <span className={`${
                        inst.rejectionRatePercent > 15 
                          ? 'text-red-700 font-bold' 
                          : inst.rejectionRatePercent > 7 
                          ? 'text-amber-800' 
                          : 'text-stone-700'
                      }`}>
                        {inst.rejectionRatePercent}%
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        inst.status === 'Exemplary'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : inst.status === 'Satisfactory'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          inst.status === 'Exemplary' ? 'bg-emerald-600' : inst.status === 'Satisfactory' ? 'bg-amber-600' : 'bg-red-600'
                        }`} />
                        <span>{inst.status}</span>
                      </span>
                    </td>

                    {/* Statutory Actions */}
                    <td className="py-3 px-3 text-right">
                      {isNotified ? (
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Notice Dispatched</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendNotice(inst.id, inst.name)}
                          className={`px-2.5 py-1 rounded font-semibold text-[11px] inline-flex items-center gap-1 transition-colors ${
                            inst.status === 'Critical Delay'
                              ? 'bg-red-700 hover:bg-red-800 text-white shadow-2xs'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>{inst.status === 'Critical Delay' ? 'Issue Speed-Up Notice' : 'Audit Notice'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 pt-1">
        <span>* UC = Utilization Certificate required under General Financial Rules (GFR Rule 238(1))</span>
        <span className="font-semibold text-stone-700">Official Data Source: Unified Higher Education Tribal MIS (U-HETMIS)</span>
      </div>
    </div>
  );
};
