import React, { useState } from 'react';
import { X, Building2, Layers, MapPin, User, Ruler } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { apiService } from '../../services/apiService';

export default function NewProjectModal() {
  const { isNewProjectModalOpen, setNewProjectModalOpen, setStatusMessage } = useUIStore();
  const { loadProject } = useProjectStore();

  const [name, setName] = useState('New Residential Residence');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('RESIDENTIAL');
  const [unitSystem, setUnitSystem] = useState('METRIC');
  const [lengthUnit, setLengthUnit] = useState('METERS');
  const [plotWidth, setPlotWidth] = useState(15.0);
  const [plotLength, setPlotLength] = useState(20.0);
  const [floorCount, setFloorCount] = useState(2);
  const [templateType, setTemplateType] = useState('MODERN_TWO_STOREY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isNewProjectModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('Creating project in SQLite database...');

    try {
      const payload = {
        name,
        clientName,
        location,
        category,
        unitSystem,
        lengthUnit,
        plotWidth: parseFloat(plotWidth) || 15.0,
        plotLength: parseFloat(plotLength) || 20.0,
        floorCount: parseInt(floorCount, 10) || 1,
        templateType
      };

      const newProject = await apiService.createProject(payload);
      loadProject(newProject);
      setStatusMessage(`Project "${newProject.name}" created and loaded.`);
      setNewProjectModalOpen(false);
    } catch (err) {
      console.error('Failed to create project:', err);
      setStatusMessage(`Failed to create project: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141822] border border-[#263142] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222b3a] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Building2 className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="text-base font-semibold text-white">Create New Project — Project Wizard</h2>
          </div>
          <button 
            onClick={() => setNewProjectModalOpen(false)}
            className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-[#1f2735]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[#94a3b8] font-medium block mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Modern Two-Storey Villa"
                className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg px-3 py-2 text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[#94a3b8] font-medium block mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Alexander Vance"
                className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg px-3 py-2 text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[#94a3b8] font-medium block mb-1">Project Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Plot 42, Green Valley"
                className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg px-3 py-2 text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-[#222b3a] pt-3">
            <div>
              <label className="text-[#94a3b8] font-medium block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                <option value="RESIDENTIAL">Residential House</option>
                <option value="VILLA">Luxury Villa</option>
                <option value="APARTMENT">Apartment Unit</option>
                <option value="COMMERCIAL">Commercial Office</option>
              </select>
            </div>

            <div>
              <label className="text-[#94a3b8] font-medium block mb-1">Unit System</label>
              <select
                value={unitSystem}
                onChange={(e) => setUnitSystem(e.target.value)}
                className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg px-3 py-2 text-white focus:outline-none"
              >
                <option value="METRIC">Metric (m, mm, cm)</option>
                <option value="IMPERIAL">Imperial (ft, in)</option>
              </select>
            </div>

            <div>
              <label className="text-[#94a3b8] font-medium block mb-1">Number of Floors</label>
              <input
                type="number"
                min="1"
                max="5"
                value={floorCount}
                onChange={(e) => setFloorCount(e.target.value)}
                className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[#222b3a] pt-3">
            <div>
              <label className="text-[#94a3b8] font-medium block mb-1">Plot Width (meters)</label>
              <input
                type="number"
                step="0.5"
                min="5"
                value={plotWidth}
                onChange={(e) => setPlotWidth(e.target.value)}
                className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg px-3 py-2 text-white focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[#94a3b8] font-medium block mb-1">Plot Length (meters)</label>
              <input
                type="number"
                step="0.5"
                min="5"
                value={plotLength}
                onChange={(e) => setPlotLength(e.target.value)}
                className="w-full bg-[#1c2230] border border-[#2d3748] rounded-lg px-3 py-2 text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="border-t border-[#222b3a] pt-3">
            <label className="text-[#94a3b8] font-medium block mb-2">Design Template</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'MODERN_TWO_STOREY', name: 'Modern Two-Storey House', desc: 'Living, kitchen, guest suite + 1st floor bedrooms & balcony' },
                { id: 'SMALL_HOUSE', name: 'Small Residential Home', desc: 'Compact single-storey 2BHK layout with dining and porch' },
                { id: 'VILLA', name: 'Contemporary Villa', desc: 'Open-concept luxury villa with spacious master suite' },
                { id: 'EMPTY', name: 'Empty Project (Blank Plot)', desc: 'Clean plot boundaries ready for manual CAD drafting' }
              ].map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setTemplateType(tmpl.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    templateType === tmpl.id
                      ? 'border-[#38bdf8] bg-[#1e293b] text-white'
                      : 'border-[#2d3748] bg-[#161c26] text-[#94a3b8] hover:border-[#475569]'
                  }`}
                >
                  <div className="font-semibold text-white text-xs">{tmpl.name}</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">{tmpl.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="border-t border-[#222b3a] pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setNewProjectModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-[#1f2735] hover:bg-[#283244] text-[#cbd5e1] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium shadow-md shadow-blue-500/20 flex items-center space-x-2"
            >
              <span>{isSubmitting ? 'Creating...' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
