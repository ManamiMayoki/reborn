import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronUp, ChevronDown, CheckCircle2, AlertCircle, Info, Clock, Trash2 } from 'lucide-react';

export default function WorkflowLogDrawer({ logs = [], isOpen, onToggle, onClear }) {
  const logEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out reborn-glass border-t border-reborn-border shadow-2xl ${
        isOpen ? 'h-64' : 'h-10'
      }`}
    >
      {/* Drawer Header Bar */}
      <div
        onClick={onToggle}
        className="h-10 px-6 flex items-center justify-between cursor-pointer select-none bg-reborn-darkest/90 border-b border-reborn-border/50 hover:bg-reborn-navy/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-reborn-cyan" />
          <span className="text-xs font-mono font-semibold text-reborn-offwhite">
            Computational Pipeline Execution Console
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-reborn-navy text-reborn-cyan border border-reborn-cyan/30">
            {logs.length} events logged
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-reborn-offwhite/60">
          <span className="hidden sm:inline font-mono text-[11px] text-reborn-gold">
            Vina 1.2.5 • Amber ff14SB • RDKit 2024.03
          </span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {/* Terminal Body */}
      {isOpen && (
        <div className="h-[calc(100%-40px)] p-4 overflow-y-auto font-mono text-xs space-y-2 bg-[#040812]/95 text-reborn-offwhite/90">
          {logs.length === 0 ? (
            <div className="text-reborn-offwhite/40 italic flex items-center gap-2 py-4">
              <Clock className="w-4 h-4 text-reborn-border" />
              <span>Ready. Computational engine idling for incoming workflow execution commands...</span>
            </div>
          ) : (
            logs.map((log, index) => {
              const isSuccess = log.level === 'success';
              const isWarning = log.level === 'warning';
              const isError = log.level === 'error';

              const icon = isSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-reborn-emerald shrink-0" />
              ) : isWarning ? (
                <AlertCircle className="w-3.5 h-3.5 text-reborn-amber shrink-0" />
              ) : isError ? (
                <AlertCircle className="w-3.5 h-3.5 text-reborn-rose shrink-0" />
              ) : (
                <Info className="w-3.5 h-3.5 text-reborn-cyan shrink-0" />
              );

              const timeStr = log.timestamp
                ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : '14:30:00';

              return (
                <div key={log.id || index} className="flex items-start gap-2.5 hover:bg-white/[0.02] p-1 rounded">
                  <span className="text-reborn-offwhite/40 text-[11px] shrink-0">{timeStr}</span>
                  <span className="mt-0.5">{icon}</span>
                  <span className="text-reborn-gold text-[11px] font-bold shrink-0">
                    [Stage {log.stage || 'Pipeline'}]
                  </span>
                  <span className="text-reborn-offwhite/90 leading-tight">{log.message}</span>
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
