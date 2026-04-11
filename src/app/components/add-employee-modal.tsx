import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  UserPlus,
  User,
  Mail,
  Phone,
  Briefcase,
} from 'lucide-react';
import { Employee } from './employee-table';

interface AddEmployeeModalProps {
  onSave: (employee: Omit<Employee, 'id' | 'joinedAt'>) => void;
  initialData?: Employee | null;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDark?: boolean;
}

const EMPTY_FORM = { name: '', role: '', email: '', phone: '' };

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  onSave,
  initialData,
  trigger,
  open: controlledOpen,
  onOpenChange,
  isDark = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        role: initialData.role,
        email: initialData.email,
        phone: initialData.phone,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Partial<typeof EMPTY_FORM> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.role.trim()) errs.role = 'Role is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Invalid email';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave(formData);
    setOpen(false);
  };

  const field = (
    label: string,
    key: keyof typeof EMPTY_FORM,
    icon: React.ReactNode,
    type = 'text',
    placeholder = '',
  ) => (
    <div className="grid grid-cols-[120px_1fr] items-start gap-4 mb-4">
      <label className={`text-sm font-semibold pt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </label>
      <div>
        <div className="relative group">
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
            errors[key] ? 'text-red-400' : isDark ? 'text-gray-500 group-focus-within:text-[#ff4d00]' : 'text-gray-400 group-focus-within:text-[#ff4d00]'
          }`}>
            {icon}
          </span>
          <input
            type={type}
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-2.5 text-sm transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 ${
              isDark
                ? 'bg-white/[0.03] text-gray-200 border-white/[0.08] focus:bg-white/[0.06]'
                : 'bg-black/[0.02] text-gray-800 border-black/[0.08]'
            } border ${
              errors[key]
                ? 'border-red-500 focus:ring-red-500/20'
                : 'focus:border-[#ff4d00] focus:ring-[#ff4d00]/20'
            }`}
            value={formData[key]}
            onChange={(e) => {
              setFormData({ ...formData, [key]: e.target.value });
              if (errors[key]) setErrors({ ...errors, [key]: undefined });
            }}
          />
        </div>
        {errors[key] && (
          <p className="text-red-400 text-xs font-semibold mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">{errors[key]}</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 animate-in fade-in duration-300" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[550px] rounded-[24px] z-[70] overflow-hidden focus:outline-none flex flex-col animate-in zoom-in-95 fade-in duration-300"
            style={{
              background: isDark ? 'radial-gradient(120% 120% at 50% 0%, rgba(255,77,0,0.1) 0%, transparent 100%), rgba(26,26,26,0.6)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(24px)',
              boxShadow: isDark ? 'inset 0 1px 1px 0 rgba(255,255,255,0.1), 0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.1)',
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <div className={`px-6 py-5 border-b flex justify-between items-center shrink-0 ${isDark ? 'border-white/[0.06] bg-white/[0.02]' : 'border-black/[0.06] bg-black/[0.02]'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ff4d00]/10 flex items-center justify-center rounded-xl border border-[#ff4d00]/20 shadow-[0_0_15px_rgba(255,77,0,0.1)]">
                  <UserPlus className="w-5 h-5 text-[#ff4d00]" />
                </div>
                <div>
                  <Dialog.Title className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {initialData ? 'Update Employee' : 'Add Employee'}
                  </Dialog.Title>
                  <Dialog.Description className={`text-[11px] font-medium uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {initialData ? 'Edit existing staff record' : 'Register new worker'}
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

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1">
                  {field('Full Name', 'name', <User className="w-4 h-4" />, 'text', 'e.g. Jane Doe')}
                  {field('Role / Title', 'role', <Briefcase className="w-4 h-4" />, 'text', 'e.g. Senior Engineer')}
                  {field('Email Address', 'email', <Mail className="w-4 h-4" />, 'email', 'e.g. jane@company.com')}
                  {field('Phone Number', 'phone', <Phone className="w-4 h-4" />, 'tel', 'e.g. +1 555 000 1234')}
                </div>

                <div className={`mt-8 pt-4 flex justify-end gap-3 border-t ${isDark ? 'border-white/[0.06]' : 'border-gray-200'}`}>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
                        isDark ? 'bg-white/[0.04] border-white/[0.08] text-gray-300 hover:text-white hover:bg-white/[0.08]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#ff4d00] to-[#ff6a33] text-white font-bold py-2.5 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm shadow-[0_0_15px_rgba(255,77,0,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] border border-transparent"
                  >
                    {initialData ? 'Update Record' : 'Save Employee'}
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
