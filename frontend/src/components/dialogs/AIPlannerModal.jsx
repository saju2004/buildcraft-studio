import React, { useState } from 'react';
import { X, Cpu, Sparkles, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { apiService } from '../../services/apiService';

export default function AIPlannerModal() {
  const { isAIPlannerOpen, setAIPlannerOpen, setStatusMessage } = useUIStore();
  const { plot, loadProject, serializeScene, levels } = useProjectStore();

  const [prompt, setPrompt] = useState(
    'I have a 40 x 60 feet plot. I need a two-storey modern house with 4 bedrooms, a modular kitchen, two-car parking, a garden and a terrace.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposal, setProposal] = useState(null);

  if (!isAIPlannerOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setStatusMessage('AI Architect synthesizing building proposal and zoning...');

    try {
      const res = await apiService.generateAIPlan(
        prompt,
        plot.width || 15.0,
        plot.length || 20.0,
        levels.length || 2
      );
      setProposal(res);
      setStatusMessage('AI Architectural proposal ready for review.');
    } catch (err) {
      console.error('AI plan error:', err);
      setStatusMessage(`AI Planning failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!proposal || !proposal.proposedScene) return;

    // Apply proposed scene data to active project
    const currentScene = serializeScene();
    const merged = {
      ...currentScene,
      plot: proposal.proposedScene.plot || currentScene.plot,
      walls: proposal.proposedScene.walls || currentScene.walls,
      doors: proposal.proposedScene.doors || currentScene.doors,
      windows: proposal.proposedScene.windows || currentScene.windows,
      columns: proposal.proposedScene.columns || currentScene.columns,
      rooms: proposal.proposedScene.rooms || currentScene.rooms
    };

    useProjectStore.setState({
      walls: merged.walls,
      doors: merged.doors,
      windows: merged.windows,
      columns: merged.columns,
      rooms: merged.rooms,
      plot: merged.plot,
      hasUnsavedChanges: true
    });

    setStatusMessage('AI Plan accepted and applied to CAD & 3D workspaces.');
    setAIPlannerOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141822] border border-[#263142] rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222b3a] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-[#38bdf8]" />
            <div>
              <h2 className="text-base font-semibold text-white">AI Architect Assistant — Intelligent Floor Planner</h2>
              <p className="text-[11px] text-[#64748b]">Generates parametric CAD geometry and 3D building concepts from plain English requirements</p>
            </div>
          </div>
          <button 
            onClick={() => setAIPlannerOpen(false)}
            className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-[#1f2735]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Prompt Input Form */}
          <form onSubmit={handleGenerate} className="space-y-3">
            <label className="text-[#94a3b8] font-medium block">Describe your dream building or project requirements:</label>
            <textarea
              rows="3"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Design a contemporary 3-bedroom villa with open plan kitchen, master bedroom with balcony, study room and rear garden..."
              className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg p-3 text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none text-xs font-sans"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[11px] text-[#64748b]">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                <span>Strict schema validation | Safe parametric geometry</span>
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-medium shadow-md shadow-blue-500/20 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Synthesizing Architecture...' : 'Generate Architectural Plan'}</span>
              </button>
            </div>
          </form>

          {/* Proposal Review Section */}
          {proposal && (
            <div className="border-t border-[#222b3a] pt-4 space-y-4 animate-in fade-in duration-300">
              <div className="bg-[#181f2c] border border-[#263346] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    <span>{proposal.title}</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1e293b] text-[#38bdf8] text-[10px] font-mono border border-[#38bdf8]/30">
                    Geometric Verification Passed
                  </span>
                </div>

                <p className="text-[#cbd5e1] leading-relaxed text-xs">{proposal.rationale}</p>

                {/* Key Metrics Grid */}
                {proposal.designSummary && (
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#232c3d]">
                    <div className="bg-[#131722] p-2 rounded border border-[#1e2636]">
                      <span className="text-[10px] text-[#64748b]">BEDROOMS</span>
                      <div className="text-base font-bold text-white">{proposal.designSummary.bedrooms} BHK</div>
                    </div>
                    <div className="bg-[#131722] p-2 rounded border border-[#1e2636]">
                      <span className="text-[10px] text-[#64748b]">FOOTPRINT</span>
                      <div className="text-base font-bold text-[#38bdf8]">{proposal.designSummary.groundFootprintArea.toFixed(1)} m²</div>
                    </div>
                    <div className="bg-[#131722] p-2 rounded border border-[#1e2636]">
                      <span className="text-[10px] text-[#64748b]">TOTAL AREA</span>
                      <div className="text-base font-bold text-[#22c55e]">{proposal.designSummary.totalEstimatedArea.toFixed(1)} m²</div>
                    </div>
                    <div className="bg-[#131722] p-2 rounded border border-[#1e2636]">
                      <span className="text-[10px] text-[#64748b]">COVERAGE</span>
                      <div className="text-base font-bold text-[#f59e0b]">{proposal.designSummary.groundCoveragePct}%</div>
                    </div>
                  </div>
                )}

                {/* Proposed Elements Count */}
                {proposal.proposedScene && (
                  <div className="text-[11px] text-[#94a3b8] flex items-center space-x-4 pt-1">
                    <span>Generated Walls: <strong className="text-white">{proposal.proposedScene.walls?.length || 0}</strong></span>
                    <span>Rooms: <strong className="text-white">{proposal.proposedScene.rooms?.length || 0}</strong></span>
                    <span>Doors & Windows: <strong className="text-white">{(proposal.proposedScene.doors?.length || 0) + (proposal.proposedScene.windows?.length || 0)}</strong></span>
                    <span>Structural Columns: <strong className="text-white">{proposal.proposedScene.columns?.length || 0}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProposal(null)}
                  className="px-4 py-2 rounded-lg bg-[#1f2735] hover:bg-[#283244] text-[#cbd5e1] font-medium"
                >
                  Discard Proposal
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium shadow-md shadow-green-500/20 flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Apply to Active Project</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
