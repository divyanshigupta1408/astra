import React, { useState } from 'react';
import { MOCK_DELAY_BATCHES } from '../../data/mockFraudGraph';
import { DelayBatch } from '../../types';
import { Clock, AlertTriangle, Send, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export const DelayPredictorWidget: React.FC = () => {
  const [batches, setBatches] = useState<DelayBatch[]>(MOCK_DELAY_BATCHES);
  const [nudgedBatches, setNudgedBatches] = useState<Record<string, boolean>>({});

  const handleSendNudge = (batchId: string) => {
    setNudgedBatches(prev => ({ ...prev, [batchId]: true }));
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>Predictive SLA Delay & Bottleneck Forecaster</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-200">
                5 Critical Batches
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Machine learning forecasting cluster identifying institutional and district desks approaching the 30-day statutory SLA ceiling.
            </p>
          </div>
        </div>

        <div className="text-xs text-stone-500 font-mono">
          Target Statutory Resolution: 30 Calendar Days
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-700 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200">
              <th className="py-2.5 px-3">Batch ID</th>
              <th className="py-2.5 px-3">Cluster / Institute</th>
              <th className="py-2.5 px-3">State & District</th>
              <th className="py-2.5 px-3">Pending Files</th>
              <th className="py-2.5 px-3">Oldest Pending</th>
              <th className="py-2.5 px-3">Predicted Breach In</th>
              <th className="py-2.5 px-3">Identified Bottleneck</th>
              <th className="py-2.5 px-3 text-right">Intervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {batches.map((batch) => {
              const isNudged = nudgedBatches[batch.id];
              const isImminent = batch.predictedDaysToBreach <= 2;

              return (
                <tr key={batch.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-800">
                    {batch.id}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-stone-900 max-w-[200px] truncate" title={batch.institute}>
                    {batch.institute}
                  </td>
                  <td className="py-2.5 px-3 text-stone-600">
                    {batch.district}, {batch.state}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-stone-800">
                    {batch.pendingCount} students
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-700">
                    {batch.oldestDays} days
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      isImminent 
                        ? 'bg-red-100 text-red-900 border border-red-300 animate-pulse' 
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      {batch.predictedDaysToBreach} {batch.predictedDaysToBreach === 1 ? 'day' : 'days'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-stone-700">
                    <span className="bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-[11px]">
                      {batch.bottleneckType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleSendNudge(batch.id)}
                      disabled={isNudged}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all inline-flex items-center gap-1 ${
                        isNudged
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-stone-900 hover:bg-stone-800 text-white shadow-2xs'
                      }`}
                    >
                      {isNudged ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Nudge Dispatched</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Dispatch Escalation</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
