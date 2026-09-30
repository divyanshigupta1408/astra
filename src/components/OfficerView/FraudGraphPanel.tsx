import React, { useState } from 'react';
import { FRAUD_GRAPH_NODES, FRAUD_GRAPH_LINKS } from '../../data/mockFraudGraph';
import { FraudNode } from '../../types';
import { Network, AlertOctagon, ShieldAlert, Info, ZoomIn, ZoomOut, UserCheck } from 'lucide-react';

export const FraudGraphPanel: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<FraudNode | null>(FRAUD_GRAPH_NODES[0]);
  const [filterSyndicateOnly, setFilterSyndicateOnly] = useState<boolean>(false);

  // Layout node positions in SVG coordinates (500x320)
  const nodePositions: Record<string, { x: number; y: number }> = {
    // Center Syndicate Ring
    'bank-8819': { x: 250, y: 150 },
    'phone-98261': { x: 340, y: 150 },
    'kiosk-01': { x: 295, y: 80 },
    'app-004': { x: 170, y: 90 },
    'app-018': { x: 170, y: 210 },
    'app-019': { x: 420, y: 90 },
    'app-024': { x: 420, y: 210 },

    // Genuine Clusters
    'app-001': { x: 70, y: 70 },
    'bank-3912': { x: 70, y: 140 },
    'app-002': { x: 70, y: 220 },
    'bank-7721': { x: 70, y: 290 },
    'app-003': { x: 470, y: 270 },
    'bank-4810': { x: 470, y: 320 }
  };

  const visibleNodes = filterSyndicateOnly
    ? FRAUD_GRAPH_NODES.filter(n => n.risk === 'syndicate')
    : FRAUD_GRAPH_NODES;

  const visibleLinks = filterSyndicateOnly
    ? FRAUD_GRAPH_LINKS.filter(l => l.isSuspicious)
    : FRAUD_GRAPH_LINKS;

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 rounded-lg text-red-800">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>Syndicate Multi-Entity Graph Intelligence</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-900 border border-red-200 font-bold">
                Ring #CG-BST-09 Active
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Interactive node-link graph detecting unauthorized cyber kiosk intermediaries and shared financial endpoints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterSyndicateOnly(!filterSyndicateOnly)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
              filterSyndicateOnly
                ? 'bg-red-700 text-white border-red-800'
                : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {filterSyndicateOnly ? 'Show All Applicants' : 'Focus High-Risk Syndicate Only'}
          </button>
        </div>
      </div>

      {/* SVG Canvas and Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SVG Node-Link Canvas */}
        <div className="lg:col-span-8 bg-stone-950 rounded-lg p-3 relative overflow-hidden border border-stone-800">
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
              Graph Engine: Connected Components & Jaccard Link Overlap
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 540 340" className="w-full h-auto min-w-[500px]">
              <defs>
                {/* Glow filter for suspicious ring */}
                <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Highlight Zone for the Syndicate */}
              <rect
                x="140"
                y="50"
                width="310"
                height="200"
                rx="16"
                fill="#EF4444"
                fillOpacity="0.08"
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="150" y="70" fill="#F87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                HIGH RISK SYNDICATE CLUSTER #CG-BST-09
              </text>

              {/* Links */}
              {visibleLinks.map((link, idx) => {
                const sourcePos = nodePositions[link.source];
                const targetPos = nodePositions[link.target];
                if (!sourcePos || !targetPos) return null;

                return (
                  <line
                    key={idx}
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={link.isSuspicious ? '#EF4444' : '#6EE7B7'}
                    strokeWidth={link.isSuspicious ? 2.5 : 1.5}
                    strokeDasharray={link.isSuspicious ? undefined : '2 2'}
                    opacity={0.85}
                  />
                );
              })}

              {/* Nodes */}
              {visibleNodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;
                const isSelected = selectedNode?.id === node.id;
                const isSyndicate = node.risk === 'syndicate';

                let nodeColor = '#10B981'; // normal
                if (node.risk === 'suspicious') nodeColor = '#F59E0B';
                if (node.risk === 'syndicate') nodeColor = '#EF4444';

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-transform hover:scale-110"
                    transform={`translate(${pos.x}, ${pos.y})`}
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle
                        r="18"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                        strokeDasharray="3 3"
                        className="animate-spin"
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      r="12"
                      fill={nodeColor}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      filter={isSyndicate ? 'url(#glow-red)' : undefined}
                    />

                    {/* Node Label Text */}
                    <text
                      y={22}
                      textAnchor="middle"
                      fill="#E2E8F0"
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="system-ui"
                    >
                      {node.label.split('(')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Normal Entity
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Minor Flag
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                Syndicate Member
              </span>
            </div>
            <span className="font-mono text-stone-400">Click any node to inspect entity metadata</span>
          </div>
        </div>

        {/* Right Inspector Box */}
        <div className="lg:col-span-4 bg-stone-50 rounded-lg p-4 border border-stone-200 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
              <span className="font-bold uppercase tracking-wider text-stone-700 text-[11px]">
                Entity Profile Inspector
              </span>
              {selectedNode && (
                <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                  selectedNode.risk === 'syndicate' 
                    ? 'bg-red-100 text-red-900 border border-red-300' 
                    : selectedNode.risk === 'suspicious'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-900'
                }`}>
                  {selectedNode.risk.toUpperCase()}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-stone-500 block">Identifier / Handle</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedNode.label}</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-500 block">Entity Topology Type</span>
                  <span className="font-mono text-stone-800 font-semibold uppercase">{selectedNode.type}</span>
                </div>

                <div className="bg-white p-3 rounded border border-stone-200">
                  <span className="text-[10px] text-stone-500 block font-semibold mb-1">Graph Analytics Insight</span>
                  <p className="text-stone-700 leading-relaxed text-xs">{selectedNode.meta}</p>
                </div>

                {selectedNode.risk === 'syndicate' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-950 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
                      Fraud Ring Signature Detected
                    </span>
                    <p className="text-[11px] text-red-900">
                      4 distinct applications from Jagdalpur GEC and ITI route their DBT disbursements to single Bank A/c ••••••••8819 and Mobile +91 98261 44•••.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-stone-500 text-center py-8">Select a node to inspect linkages</div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-200 mt-4 text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700">Enforcement Action:</span> Freeze financial routing until physical Tahsil verification of beneficiaries is completed.
          </div>
        </div>
      </div>
    </div>
  );
};
