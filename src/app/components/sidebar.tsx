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
      className={`h-screen sticky top-0 flex flex-col border-r transition-colors duration-300 ${
        isDark 
          ? 'bg-[#1a1a1a]/80 border-[#333] backdrop-blur-xl' 
          : 'bg-white/80 border-gray-200 backdrop-blur-xl'
      }`}
    >
      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all group relative ${
              item.active 
                ? 'bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/20' 
                : isDark 
                  ? 'text-gray-500 hover:bg-[#2a2a2a] hover:text-gray-200' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className={`w-5 h-5 min-w-[20px] ${item.active ? 'fill-current' : ''}`} />
            
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-semibold text-sm whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {!isExpanded && (
              <div className={`absolute left-14 px-2 py-1 rounded bg-[#ff4d00] text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap`}>
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-opacity-10 border-current space-y-2">
        <button className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
          isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
        }`}>
          <Settings className="w-5 h-5 min-w-[20px]" />
          {isExpanded && <span className="text-sm font-medium">Settings</span>}
        </button>
        <button className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all ${
          isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
        }`}>
          <HelpCircle className="w-5 h-5 min-w-[20px]" />
          {isExpanded && <span className="text-sm font-medium">Support</span>}
        </button>
        <div className={`pt-4 mt-4 border-t ${isDark ? 'border-[#333]' : 'border-gray-100'}`}>
          <button className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all text-red-500 hover:bg-red-500/10`}>
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {isExpanded && <span className="text-sm font-bold">Log Out</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
