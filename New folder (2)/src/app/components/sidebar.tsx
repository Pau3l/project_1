import React, { useState } from 'react';
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  TrendingUp,
  Moon,
  MoonStar,
  Sun,
  Keyboard,
  HelpCircle,
  Wallet,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'payment' | 'analytic';
  onTabChange: (tab: 'payment' | 'analytic') => void;
  isDark: boolean;
  toggleTheme: () => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onOpenShortcuts: () => void;
  onOpenSettings?: () => void;
  showWallet?: boolean;
  showKnowledgeBase?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  tab?: 'payment' | 'analytic';
  badge?: number;
  section: 'main' | 'secondary';
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, tab: 'payment', section: 'main' },
  { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" />, tab: 'payment', section: 'main', badge: 3 },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" />, tab: 'analytic', section: 'main' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isDark,
  toggleTheme,
  collapsed,
  onCollapsedChange,
  onOpenShortcuts,
  onOpenSettings,
  showWallet = true,
  showKnowledgeBase = true,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const mainItems = NAV_ITEMS.filter(i => i.section === 'main');

  const isActive = (item: NavItem) => {
    if (item.id === 'dashboard') return activeTab === 'payment';
    if (item.id === 'payments') return activeTab === 'payment';
    if (item.id === 'analytics') return activeTab === 'analytic';
    return false;
  };

  const handleNavClick = (item: NavItem) => {
    if (item.tab) {
      onTabChange(item.tab);
    }
  };

  return (
    <aside
      className={`
        sidebar-root
        flex flex-col h-screen sticky top-0 z-40
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
        ${isDark
          ? 'bg-[#0d0d0d]/80 border-r border-white/[0.06] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.03)]'
          : 'bg-white/70 border-r border-black/[0.06] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)]'
        }
        backdrop-blur-2xl
      `}
      style={{ 
        willChange: 'width',
        background: isDark 
          ? 'radial-gradient(120% 120% at 50% 0%, rgba(255, 77, 0, 0.05) 0%, transparent 100%), #0d0d0dcc'
          : 'radial-gradient(120% 120% at 50% 0%, rgba(255, 77, 0, 0.03) 0%, transparent 100%), #ffffffe6'
      }}
    >
      {/* ── Logo + Collapse Toggle ── */}
      <div className={`
        flex items-center h-16 px-4 flex-shrink-0
        ${collapsed ? 'justify-center' : 'justify-between'}
        border-b transition-colors duration-200
        ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}
      `}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-lg font-black tracking-[0.15em] whitespace-nowrap animate-premium-gradient">
              WONDERPAY
            </span>
          </div>
        )}

        {collapsed && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#ff4d00]/20 to-transparent border border-[#ff4d00]/20 shadow-[0_0_15px_rgba(255,77,0,0.15)] transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,77,0,0.3)] group-hover:scale-110">
            <img 
              src="/favicon.png" 
              alt="WonderPay Favicon" 
              className="w-7 h-7 object-contain animate-in zoom-in spin-in-12 duration-700"
            />
          </div>
        )}

        {!collapsed && (
          <button
            onClick={() => onCollapsedChange(true)}
            className={`
              p-1.5 rounded-md transition-all duration-200
              ${isDark
                ? 'hover:bg-white/[0.06] text-gray-500 hover:text-gray-300'
                : 'hover:bg-black/[0.04] text-gray-400 hover:text-gray-600'
              }
            `}
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Wallet Balance Card ── */}
      {/* Renders conditionally based on global Settings state. If toggled off, ignores rest. */}
      {showWallet && (
        <div className={`pt-4 pb-2 transition-all duration-300 ${collapsed ? 'px-2' : 'px-4'}`}>
          {!collapsed ? (
            <div className={`
              relative p-4 rounded-2xl overflow-hidden
              ${isDark 
                ? 'bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]' 
                : 'bg-black/[0.02] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]'
              }
            `}>
               <div className="absolute inset-0 rounded-2xl border-[1.5px] border-transparent" style={{ background: 'linear-gradient(to bottom right, rgba(255, 77, 0, 0.4), transparent) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
              
              <div className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Available Balance
              </div>
              <div className={`text-2xl font-black tracking-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₵12,450.50
              </div>
              <button className={`
                w-full py-2 px-3 rounded-xl text-xs font-bold text-center transition-all duration-300
                hover:shadow-[0_0_20px_rgba(255,77,0,0.4)]
                bg-gradient-to-r from-[#ff4d00] to-[#ff6a33] text-white hover:scale-[1.02]
                flex flex-col items-center justify-center
              `}>
                Quick Payout
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <button
                 onClick={() => onCollapsedChange(false)}
                 className={`
                relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                ${isDark ? 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.08] hover:text-[#ff4d00]' : 'bg-black/[0.02] text-gray-500 hover:bg-black/[0.05] hover:text-[#ff4d00]'}
              `}>
                <Wallet className="w-5 h-5" />
                <div className={`absolute -top-1 -right-1 w-3 h-3 bg-[#ff4d00] rounded-full border-2 ${isDark ? 'border-[#0d0d0d]' : 'border-white'} animate-pulse`} />
              </button>
            </div>
          )}
        </div>
      )}
      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1 scrollbar-thin flex flex-col">
        {/* Main Section Label */}
        {!collapsed && (
          <div className={`px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Main Menu
          </div>
        )}

        {mainItems.map(item => {
          const active = isActive(item);
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => handleNavClick(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  relative w-full flex items-center gap-3 rounded-lg transition-all duration-200
                  ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}
                  ${active
                    ? isDark
                      ? 'bg-[#ff4d00]/10 text-[#ff6a33]'
                      : 'bg-[#ff4d00]/8 text-[#ff4d00]'
                    : isDark
                      ? 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-black/[0.03]'
                  }
                `}
              >
                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#ff4d00] shadow-[0_0_8px_rgba(255,77,0,0.4)]" />
                )}

                <span className={`flex-shrink-0 transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className={`text-sm whitespace-nowrap overflow-hidden ${active ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                )}

                {/* Badge */}
                {item.badge && !collapsed && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#ff4d00] text-white min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}

                {/* Badge for collapsed */}
                {item.badge && collapsed && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold flex items-center justify-center rounded-full bg-[#ff4d00] text-white">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Tooltip for collapsed state */}
              {collapsed && hoveredItem === item.id && (
                <div className={`
                  absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50
                  px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
                  shadow-xl pointer-events-none
                  animate-in fade-in slide-in-from-left-1 duration-150
                  ${isDark
                    ? 'bg-[#252525] text-gray-200 border border-white/[0.08]'
                    : 'bg-gray-900 text-white'
                  }
                `}>
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-[#ff4d00] text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        <div className="flex-1" />
        
        {/* ── System Health Indicator ── */}
        {!collapsed && (
          <div className="px-3 pb-2 flex items-center gap-2 mt-4">
             <div className="relative flex items-center justify-center w-2 h-2">
              <div className="absolute w-full h-full bg-[#ff4d00] rounded-full animate-ping opacity-50" />
              <div className="relative w-1.5 h-1.5 bg-[#ff4d00] rounded-full" />
            </div>
            <span className={`text-[10px] font-medium tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              System Live: Optimizing...
            </span>
          </div>
        )}
      </nav>

      {/* ── Support & Knowledge Base ── */}
      {/* Conditionally rendered based on global settings. Also safely hidden if sidebar is collapsed to avoid layout breakage. */}
      {showKnowledgeBase && !collapsed && (
        <div className="px-4 py-4">
          <div className={`
            relative p-4 rounded-2xl border transition-all duration-300
            ${isDark 
              ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05] hover:border-[#ff4d00]/30' 
              : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.03] hover:border-[#ff4d00]/20'
            }
            group/support overflow-hidden
          `}>
            {/* Background Accent */}
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#ff4d00]/10 blur-2xl rounded-full transition-transform duration-500 group-hover/support:scale-150" />
            
            <div className="flex items-start gap-3 relative z-10">
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${isDark ? 'bg-[#ff4d00]/20 text-[#ff4d00]' : 'bg-[#ff4d00]/10 text-[#ff4d00]'}
              `}>
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <div className={`text-xs font-bold mb-0.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  Knowledge Base
                </div>
                <p className={`text-[10px] leading-relaxed mb-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Get answers to your questions instantly.
                </p>
                <button className={`
                  w-full py-1.5 px-3 rounded-lg text-[10px] font-bold text-center transition-all duration-200
                  ${isDark 
                    ? 'bg-white/[0.05] text-gray-300 hover:bg-[#ff4d00] hover:text-white' 
                    : 'bg-black/5 text-gray-600 hover:bg-[#ff4d00] hover:text-white'
                  }
                `}>
                  Visit Help Center
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Expand Button (collapsed only) ── */}
      {collapsed && (
        <div className="px-3 pb-2">
          <button
            onClick={() => onCollapsedChange(false)}
            className={`
              w-full flex items-center justify-center py-2.5 rounded-lg transition-all duration-200
              ${isDark
                ? 'hover:bg-white/[0.06] text-gray-500 hover:text-gray-300'
                : 'hover:bg-black/[0.04] text-gray-400 hover:text-gray-600'
              }
            `}
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Theme Toggle Footer ── */}
      {/* Contains global app actions like Settings, Keyboard Shortcuts, and Light/Dark modes */}
      <div className={`
        flex-shrink-0 border-t transition-colors duration-200
        ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}
        ${collapsed ? 'px-3 py-4' : 'px-4 py-4'}
      `}>
        {/* Settings Action Button - triggers App.tsx state onOpenSettings */}
        <button
          onClick={onOpenSettings}
          onMouseEnter={() => setHoveredItem('settings')}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            relative w-full flex items-center gap-3 rounded-xl transition-all duration-300 mb-2
            ${collapsed ? 'justify-center py-2.5' : 'px-3 py-2.5'}
            ${isDark
              ? 'bg-white/[0.03] text-gray-400 hover:text-gray-100 hover:bg-white/[0.06]'
              : 'bg-black/[0.02] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04]'
            }
          `}
        >
          <span className={`flex-shrink-0 transition-transform duration-300 ${hoveredItem === 'settings' ? 'scale-110' : ''}`}>
            <Settings className="w-5 h-5" />
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold whitespace-nowrap">
              Settings
            </span>
          )}
          {collapsed && hoveredItem === 'settings' && (
            <div className={`
              absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50
              px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
              shadow-2xl pointer-events-none border
              animate-in fade-in slide-in-from-left-1 duration-150
              ${isDark ? 'bg-[#1a1a1a] text-gray-200 border-white/[0.08]' : 'bg-gray-900 text-white border-none'}
            `}>
              Settings
            </div>
          )}
        </button>

        <button
          onClick={onOpenShortcuts}
          onMouseEnter={() => setHoveredItem('shortcuts')}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            relative w-full flex items-center gap-3 rounded-xl transition-all duration-300 mb-2

            ${collapsed ? 'justify-center py-2.5' : 'px-3 py-2.5'}
            ${isDark
              ? 'bg-white/[0.03] text-gray-400 hover:text-gray-100 hover:bg-white/[0.06]'
              : 'bg-black/[0.02] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04]'
            }
          `}
        >
          <span className={`flex-shrink-0 transition-transform duration-300 ${hoveredItem === 'shortcuts' ? 'scale-110' : ''}`}>
            <Keyboard className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </span>

          {!collapsed && (
            <span className="text-sm font-semibold whitespace-nowrap flex-1 text-left">
              Key Bindings
            </span>
          )}

          {!collapsed && (
            <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
              isDark ? 'border-white/[0.1] text-gray-500' : 'border-black/[0.1] text-gray-400'
            }`}>
              CTRL+K
            </div>
          )}

          {collapsed && hoveredItem === 'shortcuts' && (
            <div className={`
              absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50
              px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
              shadow-2xl pointer-events-none border
              animate-in fade-in slide-in-from-left-1 duration-150
              ${isDark
                ? 'bg-[#1a1a1a] text-gray-200 border-white/[0.08]'
                : 'bg-gray-900 text-white border-none'
              }
            `}>
              Keyboard Shortcuts
            </div>
          )}
        </button>

        <button
          onClick={toggleTheme}
          onMouseEnter={() => setHoveredItem('theme')}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            relative w-full flex items-center gap-3 rounded-xl transition-all duration-300
            ${collapsed ? 'justify-center py-2.5' : 'px-3 py-2.5'}
            ${isDark
              ? 'bg-white/[0.03] text-gray-400 hover:text-gray-100 hover:bg-white/[0.06]'
              : 'bg-black/[0.02] text-gray-500 hover:text-gray-900 hover:bg-black/[0.04]'
            }
          `}
        >
          <span className={`flex-shrink-0 transition-transform duration-300 ${hoveredItem === 'theme' ? 'scale-110' : ''}`}>
            {isDark
              ? <MoonStar className="w-5 h-5 text-indigo-300 fill-indigo-400/20 filter drop-shadow-[0_0_6px_rgba(165,180,252,0.4)]" />
              : <Sun className="w-5 h-5 text-[#ff4d00] fill-[#ff4d00]/20" />
            }
          </span>

          {!collapsed && (
            <span className="text-sm font-semibold whitespace-nowrap flex-1 text-left">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          )}

          {!collapsed && (
            <div className={`w-8 h-[18px] rounded-full relative transition-colors duration-300 ${isDark ? 'bg-[#ff4d00]' : 'bg-gray-300'}`}>
              <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform duration-300 ${isDark ? 'translate-x-[16px]' : 'translate-x-[2px]'}`} />
            </div>
          )}

          {collapsed && hoveredItem === 'theme' && (
            <div className={`
              absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50
              px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
              shadow-2xl pointer-events-none border
              animate-in fade-in slide-in-from-left-1 duration-150
              ${isDark
                ? 'bg-[#1a1a1a] text-gray-200 border-white/[0.08]'
                : 'bg-gray-900 text-white border-none'
              }
            `}>
              Switch to {isDark ? 'Light' : 'Dark'} Mode
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
