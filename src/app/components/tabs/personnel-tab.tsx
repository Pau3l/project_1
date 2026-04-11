import React from 'react';
import { Plus } from 'lucide-react';
import { Employee, EmployeeTable } from '../employee-table';
import { AddEmployeeModal } from '../add-employee-modal';

interface PersonnelTabProps {
  employees: Employee[];
  handleAddEmployee: (data: any) => void;
  handleEditEmployee: (emp: Employee) => void;
  handleDeleteEmployee: (id: string) => void;
  isDark: boolean;
}

export const PersonnelTab: React.FC<PersonnelTabProps> = ({
  employees,
  handleAddEmployee,
  handleEditEmployee,
  handleDeleteEmployee,
  isDark
}) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>Staff Directory</h3>
        </div>
        <AddEmployeeModal
          onSave={handleAddEmployee}
          trigger={
            <button className="flex items-center gap-2 px-5 py-2 bg-[#ff4d00] hover:bg-[#e64500] text-white rounded-md font-bold transition-all shadow-lg shadow-[#ff4d00]/10 text-sm cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          }
        />
      </div>
      <EmployeeTable
        employees={employees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        isDark={isDark}
      />
    </div>
  );
};
