import React, { useState } from 'react';
import { MinistryAlertRule, AppLanguage } from '../../types';
import { Bell, AlertTriangle, CheckCircle2, Plus, Trash2, X, Sliders, ShieldAlert } from 'lucide-react';
import { useToast } from '../Toast';

interface AlertRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: AppLanguage;
  onAlertTriggered?: (alertTitle: string, alertMessage: string) => void;
}

export const AlertRulesModal: React.FC<AlertRulesModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
  onAlertTriggered
}) => {
  const { showToast } = useToast();

  const [rules, setRules] = useState<MinistryAlertRule[]>([
    {
      id: 'al-1',
      metricKey: 'days_to_credit',
      metricTitle: 'Median Days to PFMS Credit',
      condition: 'gt',
      thresholdValue: 15,
      unit: 'days',
      currentActual: 11,
      isTriggered: false
    },
    {
      id: 'al-2',
      metricKey: 'rejection_rate',
      metricTitle: 'National Rejection Rate',
      condition: 'gt',
      thresholdValue: 5.0,
      unit: '%',
      currentActual: 4.8,
      isTriggered: false
    },
    {
      id: 'al-3',
      metricKey: 'npci_seeding_delay',
      metricTitle: 'NPCI Aadhaar Seeding Delay Share',
      condition: 'gt',
      thresholdValue: 20.0,
      unit: '%',
      currentActual: 28.0,
      isTriggered: true
    },
    {
      id: 'al-4',
      metricKey: 'institute_pending_batch',
      metricTitle: 'Critical Delay Institutes (>40 pending files)',
      condition: 'gt',
      thresholdValue: 40,
      unit: 'files',
      currentActual: 48,
      isTriggered: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [metricTitle, setMetricTitle] = useState('District Reach Gap Rate');
  const [condition, setCondition] = useState<'gt' | 'lt'>('gt');
  const [thresholdValue, setThresholdValue] = useState<number>(25);
  const [unit, setUnit] = useState('%');

  if (!isOpen) return null;

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const isTriggered = condition === 'gt' ? 22 > thresholdValue : 22 < thresholdValue;
    const newRule: MinistryAlertRule = {
      id: `al-${Date.now()}`,
      metricKey: metricTitle.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      metricTitle,
      condition,
      thresholdValue,
      unit,
      currentActual: 22,
      isTriggered
    };

    setRules(prev => [...prev, newRule]);
    setShowAddForm(false);
    showToast(`Alert rule "${metricTitle}" configured successfully.`, 'success');

    if (isTriggered && onAlertTriggered) {
      onAlertTriggered(
        `Alert Rule Triggered: ${metricTitle}`,
        `Current actual (${22}${unit}) exceeds statutory threshold (${thresholdValue}${unit}).`
      );
    }
  };

  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
    showToast('Alert rule removed.', 'info');
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
            <Bell className="w-5 h-5 text-indigo-900" />
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Automated Threshold Alert Rules
              </h3>
              <p className="text-[11px] text-stone-500">
                Define thresholds on critical DBT metrics. Triggered breaches appear in your notification centre.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Alert Rule</span>
          </button>
        </div>

        {/* Add Rule Form */}
        {showAddForm && (
          <form onSubmit={handleAddRule} className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in">
            <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider">
              Define Metric Threshold
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Target Metric</label>
                <select
                  value={metricTitle}
                  onChange={(e) => setMetricTitle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                >
                  <option value="Median Days to PFMS Credit">Median Days to PFMS Credit</option>
                  <option value="District Reach Gap Rate">District Reach Gap Rate</option>
                  <option value="Institute Verification Backlog">Institute Verification Backlog</option>
                  <option value="Rejection Rate Breach">Rejection Rate Breach</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Trigger Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as 'gt' | 'lt')}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                >
                  <option value="gt">Greater Than (&gt;)</option>
                  <option value="lt">Less Than (&lt;)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Threshold Value</label>
                <input
                  type="number"
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-medium"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-lg shadow-xs"
              >
                Save Alert Rule
              </button>
            </div>
          </form>
        )}

        {/* Rules Table */}
        <div className="space-y-2">
          <div className="font-bold text-stone-700 text-xs">
            Active Monitored Metric Rules ({rules.length}):
          </div>

          <div className="divide-y divide-stone-200 border border-stone-200 rounded-xl overflow-hidden bg-white">
            {rules.map((rule) => (
              <div key={rule.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-xs">{rule.metricTitle}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      rule.isTriggered 
                        ? 'bg-rose-100 text-rose-950 border border-rose-300 animate-pulse' 
                        : 'bg-emerald-100 text-emerald-950'
                    }`}>
                      {rule.isTriggered ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-rose-700" />
                          <span>Threshold Breached</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Nominal</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-500 font-mono">
                    Threshold: {rule.condition === 'gt' ? '>' : '<'} {rule.thresholdValue} {rule.unit} • Current Actual: <strong className="text-stone-800">{rule.currentActual} {rule.unit}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-stone-500 hover:text-rose-700 cursor-pointer"
                    title="Remove rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
