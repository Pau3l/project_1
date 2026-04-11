import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { Settings, X, Shield, BookOpen } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showWallet: boolean;
  setShowWallet: (v: boolean) => void;
  showKnowledgeBase: boolean;
  setShowKnowledgeBase: (v: boolean) => void;
  isDark: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open, onOpenChange, showWallet, setShowWallet, showKnowledgeBase, setShowKnowledgeBase, isDark
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] animate-in fade-in duration-300" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] rounded-[24px] z-[70] overflow-hidden focus:outline-none flex flex-col animate-in zoom-in-95 fade-in duration-300"
          style={{
            background: isDark ? 'radial-gradient(120% 120% at 50% 0%, rgba(255,77,0,0.1) 0%, transparent 100%), rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(24px)',
            boxShadow: isDark ? 'inset 0 1px 1px 0 rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.1)',
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
          }}
        >
          <div className={`px-6 py-5 border-b flex justify-between items-center bg-white/[0.02] ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff4d00]/10 flex items-center justify-center rounded-xl border border-[#ff4d00]/20">
                <Settings className="w-5 h-5 text-[#ff4d00]" />
              </div>
              <div>
                <Dialog.Title className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  System Settings
                </Dialog.Title>
                <Dialog.Description className={`text-[11px] font-medium uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Manage Preferences
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-red-500/10 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}>
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-6">
            <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-white/[0.02] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Display Wallet Balance</h4>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Toggle the visibility of your main balance.</p>
                </div>
              </div>
              <Switch.Root checked={showWallet} onCheckedChange={setShowWallet} className={`w-[42px] h-[25px] rounded-full relative outline-none cursor-default shadow-inner transition-colors ${showWallet ? 'bg-[#ff4d00]' : isDark ? 'bg-[#333]' : 'bg-gray-300'}`}>
                <Switch.Thumb className={`block w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-100 translate-x-[2px] will-change-transform ${showWallet ? 'translate-x-[19px]' : ''}`} />
              </Switch.Root>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-white/[0.02] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <BookOpen className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Show Knowledge Base Helper</h4>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Display quick access to help topics in the sidebar.</p>
                </div>
              </div>
              <Switch.Root checked={showKnowledgeBase} onCheckedChange={setShowKnowledgeBase} className={`w-[42px] h-[25px] rounded-full relative outline-none cursor-default shadow-inner transition-colors ${showKnowledgeBase ? 'bg-[#ff4d00]' : isDark ? 'bg-[#333]' : 'bg-gray-300'}`}>
                <Switch.Thumb className={`block w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-100 translate-x-[2px] will-change-transform ${showKnowledgeBase ? 'translate-x-[19px]' : ''}`} />
              </Switch.Root>
            </div>
          </div>

          <div className={`p-6 flex justify-end border-t ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            <Dialog.Close asChild>
              <button className="bg-gradient-to-r from-[#ff4d00] to-[#ff6a33] text-white font-bold py-2.5 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm shadow-[0_0_15px_rgba(255,77,0,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] border border-transparent">
                Done
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
