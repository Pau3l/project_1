import React from 'react';
import { Pencil, Trash2, Mail, Phone, Briefcase } from 'lucide-react';

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  joinedAt: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  'from-[#ff4d00] to-[#ff8c00]',
  'from-purple-500 to-purple-700',
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-pink-500 to-pink-700',
  'from-amber-500 to-amber-700',
];

function avatarColor(id: string) {
  const index = id.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onEdit,
  onDelete,
  isDark,
}) => {
  const borderColor = isDark ? 'border-[#222]' : 'border-gray-200';
  const rowHover = isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-gray-50';
  const textMuted = isDark ? 'text-gray-500' : 'text-gray-400';
  const textBase = isDark ? 'text-gray-200' : 'text-gray-800';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600';
  const theadBg = isDark ? 'bg-[#161616]' : 'bg-gray-50';

  if (employees.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 rounded-xl border ${isDark ? 'border-[#222] bg-[#111]' : 'border-gray-200 bg-white'}`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-100'}`}>
          <Briefcase className={`w-7 h-7 ${textMuted}`} />
        </div>
        <p className={`text-sm font-semibold ${textBase}`}>No employees yet</p>
        <p className={`text-xs mt-1 ${textMuted}`}>Add your first employee to get started</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-[#222]' : 'border-gray-200'}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className={`${theadBg} border-b ${borderColor}`}>
            <th className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${textMuted}`}>Employee</th>
            <th className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${textMuted}`}>Role</th>
            <th className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${textMuted} hidden md:table-cell`}>Contact</th>
            <th className={`px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${textMuted} hidden lg:table-cell`}>Joined</th>
            <th className={`px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider ${textMuted}`}>Actions</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${borderColor}`}>
          {employees.map(emp => (
            <tr key={emp.id} className={`transition-colors ${rowHover} ${isDark ? 'bg-[#111111]' : 'bg-white'}`}>
              {/* Employee Name + Avatar */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(emp.id)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {getInitials(emp.name)}
                  </div>
                  <span className={`font-semibold ${textBase}`}>{emp.name}</span>
                </div>
              </td>

              {/* Role */}
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-[#1e1e1e] text-gray-300 border border-[#2a2a2a]' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                  <Briefcase className="w-3 h-3" />
                  {emp.role || '—'}
                </span>
              </td>

              {/* Contact */}
              <td className="px-4 py-3 hidden md:table-cell">
                <div className="space-y-0.5">
                  <div className={`flex items-center gap-1.5 text-xs ${textSub}`}>
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate max-w-[160px]">{emp.email || '—'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs ${textMuted}`}>
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{emp.phone || '—'}</span>
                  </div>
                </div>
              </td>

              {/* Joined */}
              <td className={`px-4 py-3 text-xs ${textMuted} hidden lg:table-cell`}>
                {emp.joinedAt ? new Date(emp.joinedAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(emp)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-gray-500 hover:text-blue-400 hover:bg-blue-400/10' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    title="Edit employee"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(emp.id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                    title="Delete employee"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
