import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  FolderOpen, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  Layers, 
  Copy, 
  Trash2, 
  X,
  FileCode,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { apiService } from '../../services/apiService';

export default function ProjectDashboard() {
  const { 
    isProjectDashboardOpen, 
    setProjectDashboardOpen, 
    setNewProjectModalOpen,
    setStatusMessage
  } = useUIStore();

  const { loadProject, projectId: activeId } = useProjectStore();

  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const list = await apiService.getProjects();
      setProjects(list);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isProjectDashboardOpen) {
      fetchProjects();
    }
  }, [isProjectDashboardOpen]);

  if (!isProjectDashboardOpen) return null;

  const handleOpenProject = async (id) => {
    try {
      setStatusMessage('Loading project...');
      const full = await apiService.getProject(id);
      loadProject(full);
      setStatusMessage(`Loaded project "${full.name}".`);
      setProjectDashboardOpen(false);
    } catch (err) {
      console.error('Failed to open project:', err);
      setStatusMessage(`Error loading project: ${err.message}`);
    }
  };

  const handleDuplicate = async (e, id) => {
    e.stopPropagation();
    try {
      await apiService.duplicateProject(id);
      fetchProjects();
      setStatusMessage('Project duplicated.');
    } catch (err) {
      console.error('Duplicate failed:', err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiService.deleteProject(id);
        fetchProjects();
        setStatusMessage('Project deleted.');
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const filtered = projects.filter((p) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-[#0d1017]/95 backdrop-blur-md z-50 flex flex-col p-8 select-none overflow-y-auto">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#222a3a]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563eb] to-[#38bdf8] flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              BUILDCRAFT <span className="text-[#38bdf8]">STUDIO</span>
            </h1>
            <p className="text-xs text-[#64748b]">Design Smarter. Build Better. — Project Hub</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setProjectDashboardOpen(false);
              setNewProjectModalOpen(true);
            }}
            className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project Wizard</span>
          </button>

          <button
            onClick={() => setProjectDashboardOpen(false)}
            className="p-2 hover:bg-[#1f2636] text-[#94a3b8] hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Hub Body */}
      <div className="max-w-6xl w-full mx-auto py-8 space-y-8">
        {/* Templates Banner */}
        <div>
          <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">
            Start from Engineering Template
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { id: 'MODERN_TWO_STOREY', title: 'Modern 2-Storey Villa', desc: '11m x 9m footprint, living, modular kitchen, 3 beds', icon: '🏡' },
              { id: 'SMALL_HOUSE', title: 'Compact Residence', desc: '9m x 7m footprint, 2-bed bungalow with porch', icon: '🏠' },
              { id: 'VILLA', title: 'Luxury Contemporary Villa', desc: 'Spacious open concept with double height living', icon: '🏛️' },
              { id: 'EMPTY', title: 'Blank Site Plan', desc: 'Empty plot with standard setbacks', icon: '📐' }
            ].map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={async () => {
                  setProjectDashboardOpen(false);
                  const newProj = await apiService.createProject({
                    name: `${tmpl.title} Project`,
                    category: 'RESIDENTIAL',
                    templateType: tmpl.id,
                    plotWidth: 15.0,
                    plotLength: 20.0,
                    floorCount: tmpl.id === 'MODERN_TWO_STOREY' ? 2 : 1
                  });
                  loadProject(newProj);
                }}
                className="bg-[#141822] hover:bg-[#1c2331] border border-[#232c3d] hover:border-[#38bdf8] p-4 rounded-xl cursor-pointer transition-all shadow-md group"
              >
                <div className="text-2xl mb-2">{tmpl.icon}</div>
                <div className="text-sm font-semibold text-white group-hover:text-[#38bdf8] transition-colors">{tmpl.title}</div>
                <div className="text-[11px] text-[#64748b] mt-1">{tmpl.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Projects List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider">
              Recent Projects in SQLite Storage
            </h2>

            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-[#141822] border border-[#232c3d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#64748b] focus:border-[#38bdf8] focus:outline-none"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[#141822] border border-[#232c3d] rounded-xl p-8 text-center text-[#64748b] text-xs">
              No projects found. Create a new project or select a template above.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((proj) => {
                const isActive = proj.id === activeId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => handleOpenProject(proj.id)}
                    className={`bg-[#141822] hover:bg-[#1b2230] border rounded-xl p-4 cursor-pointer transition-all shadow-md flex flex-col justify-between ${
                      isActive ? 'border-[#38bdf8] ring-1 ring-[#38bdf8]' : 'border-[#232c3d]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] text-[10px] font-mono">
                          {proj.category || 'RESIDENTIAL'}
                        </span>
                        {isActive && (
                          <span className="text-[10px] text-[#22c55e] font-mono font-bold">ACTIVE</span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white truncate">{proj.name}</h3>
                      {proj.clientName && (
                        <p className="text-[11px] text-[#94a3b8] truncate">Client: {proj.clientName}</p>
                      )}
                      {proj.location && (
                        <p className="text-[11px] text-[#64748b] flex items-center space-x-1 mt-1 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{proj.location}</span>
                        </p>
                      )}

                      {/* Project Stats */}
                      {proj.stats && (
                        <div className="grid grid-cols-3 gap-1.5 pt-3 mt-3 border-t border-[#1e2535] text-[10px] text-center font-mono">
                          <div className="bg-[#0f121a] p-1 rounded">
                            <span className="text-[#64748b]">WALLS</span>
                            <div className="text-white font-bold">{proj.stats.wallCount || 0}</div>
                          </div>
                          <div className="bg-[#0f121a] p-1 rounded">
                            <span className="text-[#64748b]">OPENINGS</span>
                            <div className="text-white font-bold">{proj.stats.doorWindowCount || 0}</div>
                          </div>
                          <div className="bg-[#0f121a] p-1 rounded">
                            <span className="text-[#64748b]">ROOMS</span>
                            <div className="text-white font-bold">{proj.stats.roomCount || 0}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1e2535] text-[11px] text-[#64748b]">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString() : 'Recent'}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => handleDuplicate(e, proj.id)}
                          className="p-1 hover:bg-[#252f40] rounded text-[#94a3b8] hover:text-white"
                          title="Duplicate Project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, proj.id)}
                          className="p-1 hover:bg-[#3b1d22] rounded text-[#ef4444]"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
