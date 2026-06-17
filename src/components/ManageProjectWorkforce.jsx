import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";
import { UserCheck } from "lucide-react";

const employeeColumns = [
  { id: "employee", key: "employee", label: "Employee" },
  { id: "employeeName", key: "employeeName", label: "Employee Name" },
  { id: "homeOrg", key: "homeOrg", label: "Home Organization" },
  { id: "plc", key: "plc", label: "PLC" },
  { id: "status", key: "status", label: "Status" },
];

const selectedEmployeeColumns = [
  { id: "employee", key: "employee", label: "Employee *" },
  { id: "employeeName", key: "employeeName", label: "Employee Name" },
  { id: "homeOrg", key: "homeOrg", label: "Home Organization" },
  { id: "plc", key: "plc", label: "PLC" },
  { id: "startDate", key: "startDate", label: "Starting Date", type: "date" },
];

const plcColumns = [
  { id: "plc", key: "plc", label: "PLC" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
];

const assignedPLCColumns = [
  { id: "plc", key: "plc", label: "PLC *" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
  { id: "defaultPlc", key: "defaultPlc", label: "Default PLC", type: "checkbox" },
  { id: "employee", key: "employee", label: "Employee *" },
  { id: "employeeName", key: "employeeName", label: "Employee Name" },
  { id: "startDate", key: "startDate", label: "Starting Date", type: "date" },
  { id: "endDate", key: "endDate", label: "Ending Date", type: "date" },
];

const ManageProjectWorkforce = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [showAssignPLC, setShowAssignPLC] = useState(false);
  
  const [formData, setFormData] = useState({
    project: "",
    overtimeAuthorized: false
  });

  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [plcs, setPlcs] = useState([]);
  const [assignedPLCs, setAssignedPLCs] = useState([]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={UserCheck} title="Manage Project Workforce">
        <Toolbar 
          isFormView={isFormView} 
          columns={[]} 
          actions={{ 
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: () => {},
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {}
          }} 
        />
        
        <div className="mt-4 space-y-6">
          {!isFormView ? (
            <SecondaryContainer title="Project Workforce List">
              <ReusableTable 
                data={[]} // This would be the main list of project workforces
                columns={[
                  { id: "project", key: "project", label: "Project" },
                  { id: "overtimeAuthorized", key: "overtimeAuthorized", label: "Overtime Authorized", type: "checkbox" }
                ]} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>
          ) : (
            <div className="space-y-4 px-4 pb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="pt-4 w-full md:w-1/2">
                <FormInput 
                  label="Project" 
                  value={formData.project}
                  onChange={(e) => handleFieldChange("project", e.target.value)}
                  isLookup
                />
              </div>
              <FormSection title="Project Workforce">
                <div className="flex items-center gap-2">
                  <FormInput 
                    type="checkbox"
                    label="Overtime Authorized for Employees" 
                    checked={formData.overtimeAuthorized}
                    onChange={(e) => handleFieldChange("overtimeAuthorized", e.target.checked)}
                  />
                </div>
              </FormSection>
            </div>
          )}

          {/* Tab Selection (Styled like ManageProjectLaborCategories) */}
          <div className="flex border-b border-gray-200 mt-4 bg-white">
            <button
              onClick={() => setShowAssignPLC(!showAssignPLC)}
              className={`px-6 py-2 text-[11px] font-bold uppercase transition-all border-b-2 ${
                showAssignPLC 
                ? "border-[#17414d] text-[#17414d]" 
                : "border-transparent text-gray-500 hover:text-[#17414d]"
              }`}
            >
              Assign PLC to Employee Workforce
            </button>
          </div>

          {!showAssignPLC ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <SecondaryContainer title="Employees">
                <div className="flex justify-end mb-2">
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Select</button>
                </div>
                <ReusableTable data={employees} columns={employeeColumns} onFieldChange={() => {}} />
              </SecondaryContainer>
              <SecondaryContainer title="Selected Employees">
                <div className="flex gap-2 justify-end mb-2">
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">New</button>
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Copy</button>
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Delete</button>
                </div>
                <ReusableTable data={selectedEmployees} columns={selectedEmployeeColumns} onFieldChange={() => {}} />
              </SecondaryContainer>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SecondaryContainer title="PLCs">
                  <div className="flex justify-end mb-2">
                      <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Select</button>
                  </div>
                  <ReusableTable data={plcs} columns={plcColumns} onFieldChange={() => {}} />
                </SecondaryContainer>
                <SecondaryContainer title="Selected Employees">
                  <ReusableTable data={selectedEmployees} columns={selectedEmployeeColumns} onFieldChange={() => {}} />
                </SecondaryContainer>
              </div>
              <SecondaryContainer title="PLCs Assigned to Employee Workforce">
                <div className="flex gap-2 justify-end mb-2">
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">New</button>
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Copy</button>
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Delete</button>
                </div>
                <ReusableTable data={assignedPLCs} columns={assignedPLCColumns} onFieldChange={() => {}} />
              </SecondaryContainer>
            </div>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageProjectWorkforce;
