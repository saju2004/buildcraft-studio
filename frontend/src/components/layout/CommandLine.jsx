import React, { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronUp, ChevronDown } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useCADStore } from '../../stores/cadStore';

export default function CommandLine() {
  const { commandText, setCommandText, commandHistory, executeCommand } = useUIStore();
  const { setActiveTool } = useCADStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const historyRef = useRef(null);

  // Auto scroll history to bottom
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmed = commandText.trim();
      if (trimmed) {
        // Direct tool activation
        const cmdUpper = trimmed.toUpperCase();
        if (cmdUpper === 'WALL' || cmdUpper === 'W') setActiveTool('WALL');
        if (cmdUpper === 'DOOR' || cmdUpper === 'D') setActiveTool('DOOR');
        if (cmdUpper === 'WINDOW' || cmdUpper === 'WIN') setActiveTool('WINDOW');
        if (cmdUpper === 'COLUMN' || cmdUpper === 'COL') setActiveTool('COLUMN');
        if (cmdUpper === 'DIM' || cmdUpper === 'DIMENSION') setActiveTool('DIMENSION');
        if (cmdUpper === 'ROOM') setActiveTool('ROOM');
        if (cmdUpper === 'SELECT') setActiveTool('SELECT');
        if (cmdUpper === 'PAN') setActiveTool('PAN');
        if (cmdUpper === 'ERASE' || cmdUpper === 'ERASER') setActiveTool('ERASER');

        executeCommand(trimmed);
      }
    }
  };

  return (
    <div className="bg-[#12151b] border-t border-[#232936] text-xs font-mono select-none">
      {/* Expanded History Log */}
      {isExpanded && (
        <div 
          ref={historyRef}
          className="h-28 overflow-y-auto px-3 py-1.5 bg-[#0b0d12] border-b border-[#1c212c] text-[#94a3b8] space-y-0.5"
        >
          {commandHistory.map((line, idx) => (
            <div key={idx} className={line.startsWith('>') ? 'text-[#38bdf8]' : ''}>
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Main Command Input Line */}
      <div className="h-7 flex items-center px-2 space-x-2">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#64748b] hover:text-[#94a3b8] p-0.5"
          title={isExpanded ? 'Collapse Command History' : 'Expand Command History'}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[#38bdf8] font-bold">Command:</span>
        <input 
          ref={inputRef}
          type="text" 
          value={commandText}
          onChange={(e) => setCommandText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command (WALL, DOOR, WIN, COL, DIM, 2D, 3D, AI, HELP) and press Enter"
          className="flex-1 bg-transparent text-[#f1f5f9] placeholder-[#475569] focus:outline-none text-xs font-mono"
        />
        <span className="text-[#475569] text-[10px]">AutoCAD Style CLI</span>
      </div>
    </div>
  );
}
