import React from 'react';
import { X, Download, FileCode, FileText, CheckCircle } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';

export default function ExportModal() {
  const { isExportOpen, setExportOpen, setStatusMessage } = useUIStore();
  const { name, serializeScene, walls, columns, doors, windows, plot } = useProjectStore();

  if (!isExportOpen) return null;

  // 1. Export Native .bcs Project File
  const handleExportBCS = () => {
    const scene = serializeScene();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scene, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${name.replace(/\s+/g, '_')}.bcs`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage('Exported native .bcs project file.');
    setExportOpen(false);
  };

  // 2. Export Standard DXF CAD Drawing
  const handleExportDXF = () => {
    let dxfContent = '0\nSECTION\n2\nENTITIES\n';

    // Export walls as DXF LINE entities
    for (const w of walls) {
      dxfContent += '0\nLINE\n8\nWALLS\n';
      dxfContent += `10\n${w.startX}\n20\n${w.startY}\n30\n0.0\n`;
      dxfContent += `11\n${w.endX}\n21\n${w.endY}\n31\n0.0\n`;
    }

    // Export plot boundary
    if (plot) {
      const pw = plot.width;
      const pl = plot.length;
      dxfContent += `0\nLINE\n8\nPLOT\n10\n0.0\n20\n0.0\n30\n0.0\n11\n${pw}\n21\n0.0\n31\n0.0\n`;
      dxfContent += `0\nLINE\n8\nPLOT\n10\n${pw}\n20\n0.0\n30\n0.0\n11\n${pw}\n21\n${pl}\n31\n0.0\n`;
      dxfContent += `0\nLINE\n8\nPLOT\n10\n${pw}\n20\n${pl}\n30\n0.0\n11\n0.0\n21\n${pl}\n31\n0.0\n`;
      dxfContent += `0\nLINE\n8\nPLOT\n10\n0.0\n20\n${pl}\n30\n0.0\n11\n0.0\n21\n0.0\n31\n0.0\n`;
    }

    dxfContent += '0\nENDSEC\n0\nEOF\n';

    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `${name.replace(/\s+/g, '_')}.dxf`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage('Exported DXF 2D CAD drawing.');
    setExportOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#141822] border border-[#263142] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222b3a] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Download className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="text-base font-semibold text-white">Export Project & Drawings</h2>
          </div>
          <button 
            onClick={() => setExportOpen(false)}
            className="text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-[#1f2735]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3 text-xs">
          {/* Native .bcs Option */}
          <div 
            onClick={handleExportBCS}
            className="p-3.5 bg-[#181f2c] hover:bg-[#1e2738] border border-[#263346] rounded-xl cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <FileCode className="w-6 h-6 text-[#38bdf8]" />
              <div>
                <div className="text-white font-semibold text-sm">Native BuildCraft Project (.bcs)</div>
                <div className="text-[11px] text-[#64748b]">Includes levels, walls, openings, 3D geometry and metadata</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#94a3b8]" />
          </div>

          {/* DXF CAD Option */}
          <div 
            onClick={handleExportDXF}
            className="p-3.5 bg-[#181f2c] hover:bg-[#1e2738] border border-[#263346] rounded-xl cursor-pointer transition-all flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-[#22c55e]" />
              <div>
                <div className="text-white font-semibold text-sm">AutoCAD DXF Vector Drawing (.dxf)</div>
                <div className="text-[11px] text-[#64748b]">2D engineering vectors compatible with AutoCAD, Revit & LibreCAD</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#94a3b8]" />
          </div>
        </div>
      </div>
    </div>
  );
}
