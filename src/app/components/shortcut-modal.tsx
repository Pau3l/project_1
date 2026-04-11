import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Keyboard, X, Edit3, Trash2, RotateCcw, AlertTriangle, Plus, Command } from 'lucide-react';

export interface ShortcutConfig {
  id: string;
  label: string;
  key: string;
  isCustom?: boolean;
}

interface ShortcutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: ShortcutConfig[];
  onUpdateShortcut: (id: string, newKey: string) => void;
  onReset: () => void;
  isDark: boolean;
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  open,
  onOpenChange,
  shortcuts,
  onUpdateShortcut,
  onReset,
  isDark
}) => {
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState<string>('');
  const recordingRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!recordingId) return;

    e.preventDefault();
    e.stopPropagation();

    // Ignore sole modifier keys
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

    let keyString = '';
    if (e.ctrlKey) keyString += 'Ctrl+';
    if (e.altKey) keyString += 'Alt+';
    if (e.shiftKey) keyString += 'Shift+';
    if (e.metaKey) keyString += 'Meta+';

    // Handle key names
    const displayKey = e.key.length === 1 ? e.key.toUpperCase() : e.key;
    keyString += displayKey;

    setTempKey(keyString);
  };

  useEffect(() => {
    if (recordingId) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recordingId]);

  const saveBinding = () => {
    if (recordingId && tempKey) {
      onUpdateShortcut(recordingId, tempKey);
      setRecordingId(null);
      setTempKey('');
    }
  };

  const cancelRecording = () => {
    setRecordingId(null);
    setTempKey('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => {
      if (recordingId) cancelRecording();
      onOpenChange(val);
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] animate-in fade-in duration-300" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[550px] rounded-[24px] z-[70] overflow-hidden focus:outline-none flex flex-col animate-in zoom-in-95 fade-in duration-300"
            style={{
              background: isDark ? 'radial-gradient(120% 120% at 50% 0%, rgba(255,77,0,0.1) 0%, transparent 100%), rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(24px)',
              boxShadow: isDark ? 'inset 0 1px 1px 0 rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.1)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
            }}
          >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-5 border-b bg-white/[0.02] shrink-0 ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff4d00]/10 flex items-center justify-center rounded-xl border border-[#ff4d00]/20 shadow-[0_0_15px_rgba(255,77,0,0.1)]">
                <Keyboard className="w-5 h-5 text-[#ff4d00]" />
              </div>
              <div>
                <Dialog.Title className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Shortcut Center
                </Dialog.Title>
                <Dialog.Description className={`text-[11px] font-medium uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Custom Key Bindings
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className={`p-2 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-red-500/10 hover:text-red-400 text-gray-500' : 'hover:bg-red-50 text-red-500 text-gray-400'
              }`}>
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 ${
              isDark ? 'bg-white/[0.02] border-white/[0.05] text-gray-400' : 'bg-black/[0.02] border-black/[0.05] text-gray-600'
            }`}>
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                Shortcuts using browser-specific keys (like <code className="text-[#ff4d00]">Ctrl+T</code>) may be blocked. We recommend using <code className="text-[#ff4d00]">Alt</code> or <code className="text-[#ff4d00]">Cmd/Meta</code> combinations.
              </p>
            </div>

            <div className="space-y-3">
              {shortcuts.map((s) => (
                <div 
                  key={s.id} 
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    recordingId === s.id 
                      ? 'bg-[#ff4d00]/5 border-[#ff4d00]/30 shadow-[0_0_20px_rgba(255,77,0,0.1)]' 
                      : isDark ? 'bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.03]' : 'bg-white border-black/[0.05] hover:border-black/[0.1]'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{s.label}</span>
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>ID: {s.id}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {recordingId === s.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                        <kbd className="px-3 py-1.5 rounded-lg bg-[#ff4d00] text-white text-xs font-black shadow-lg shadow-[#ff4d00]/20 min-w-[40px] text-center border border-white/20">
                          {tempKey || 'Press key...'}
                        </kbd>
                        <div className="flex gap-1">
                          <button 
                            onClick={saveBinding}
                            className="p-1.5 rounded-md bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                            title="Save Binder"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={cancelRecording}
                            className="p-1.5 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <kbd className={`px-3 py-1.5 rounded-lg text-xs font-black min-w-[40px] text-center border shadow-sm ${
                          isDark ? 'bg-white/[0.04] border-white/[0.1] text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                        }`}>
                          {s.key}
                        </kbd>
                        <button 
                          onClick={() => {
                            setRecordingId(s.id);
                            setTempKey('');
                          }}
                          className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                            isDark ? 'hover:bg-white/[0.08] text-gray-400 hover:text-white' : 'hover:bg-black/[0.05] text-gray-500'
                          }`}
                          title="Edit Shortcut"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button className={`w-full py-4 rounded-xl border border-dashed flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                isDark ? 'border-white/[0.1] text-gray-500 hover:text-gray-300 hover:border-white/[0.2] hover:bg-white/[0.02]' : 'border-black/[0.1] text-gray-400 hover:text-gray-700'
              }`}>
                <Plus className="w-4 h-4" />
                Add Custom Shortcut
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t bg-white/[0.01] flex gap-3 ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
            <button 
              onClick={onReset}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all duration-200 border ${
                isDark ? 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-800'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Reset Factory Defaults
            </button>
            <Dialog.Close asChild>
              <button className="flex-1 bg-gradient-to-r from-[#ff4d00] to-[#ff6a33] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(255,77,0,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] transition-all active:scale-[0.98] group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-transform duration-500"></div>
                Dismiss Panel
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
