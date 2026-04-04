import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: false },
  { id: 'personnel', label: 'Personnel', icon: Users, active: false },
  { id: 'payments', label: 'Payments', icon: CreditCard, active: true },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, active: false },
];

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded, isDark }) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 260 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`h-screen sticky top-0 flex flex-col border-r transition-colors duration-300 z-50 ${
        isDark 
          ? 'bg-sidebar/80 border-sidebar-border backdrop-blur-xl' 
          : 'bg-sidebar/90 border-sidebar-border backdrop-blur-xl'
      }`}
    >
      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all group relative ${
              item.active 
                ? 'bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/30' 
                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            }`}
          >
            <item.icon className={`w-5 h-5 min-w-[20px] transition-transform duration-200 group-hover:scale-110 ${item.active ? 'fill-current' : ''}`} />
            
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {!isExpanded && (
              <div className={`absolute left-16 px-3 py-1.5 rounded-md bg-[#1a1a1a] text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 pointer-events-none z-50 shadow-2xl border border-[#333] whitespace-nowrap`}>
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <button className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground`}>
          <Settings className="w-5 h-5 min-w-[20px]" />
          {isExpanded && <span className="text-sm font-semibold">Settings</span>}
        </button>
        <button className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground`}>
          <HelpCircle className="w-5 h-5 min-w-[20px]" />
          {isExpanded && <span className="text-sm font-semibold">Support</span>}
        </button>
        <div className={`pt-4 mt-2 border-t border-sidebar-border/50`}>
          <button className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all text-red-500 hover:bg-red-500/10 active:scale-95`}>
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {isExpanded && <span className="text-sm font-bold uppercase tracking-wider">Log Out</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
