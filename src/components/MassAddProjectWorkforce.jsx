import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";
import { Users } from "lucide-react";

const projectColumns = [
  { id: "project", key: "project", label: "Project" },
  { id: "projectName", key: "projectName", label: "Project Name" },
  { id: "owningOrg", key: "owningOrg", label: "Owning Organization" },
];

const plcColumns = [
  { id: "plc", key: "plc", label: "PLC" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
];

const assignedPLCColumns = [
  { id: "plc", key: "plc", label: "PLC *" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
  { id: "defaultPlc", key: "defaultPlc", label: "Default PLC", type: "checkbox" },
  { id: "projectId", key: "projectId", label: "Project ID" },
  { id: "projectName", key: "projectName", label: "Project Name" },
  { id: "startDate", key: "startDate", label: "Start Date", type: "date" },
  { id: "endDate", key: "endDate", label: "End Date", type: "date" },
];

const MassAddProjectWorkforce = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [showAssignPLC, setShowAssignPLC] = useState(false);
  
  const [formData, setFormData] = useState({
    workforceType: "Employee",
    id: "",
    employeeName: "",
    startDate: "",
    endDate: ""
  });

  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [plcs, setPlcs] = useState([]);
  const [assignedPLCs, setAssignedPLCs] = useState([]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Users} title="Mass Add Project Workforce">
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
          {/* Top Section Toggle */}
          {!isFormView ? (
            <SecondaryContainer title="Project Workforce List">
              <ReusableTable 
                data={[]} 
                columns={[
                  { id: "workforceType", key: "workforceType", label: "Workforce Type" },
                  { id: "id", key: "id", label: "ID" },
                  { id: "employeeName", key: "employeeName", label: "Employee Name" },
                  { id: "startDate", key: "startDate", label: "Start Date", type: "date" },
                  { id: "endDate", key: "endDate", label: "End Date", type: "date" },
                ]} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>
          ) : (
            <div className="space-y-4 px-4 pb-4 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <FormInput 
                  label="Select Workforce Type *" 
                  type="select"
                  value={formData.workforceType}
                  onChange={(e) => handleFieldChange("workforceType", e.target.value)}
                  options={[
                    { label: "Employee", value: "Employee" },
                    { label: "Vendor", value: "Vendor" }
                  ]}
                />
                <FormInput 
                  label="ID" 
                  value={formData.id}
                  onChange={(e) => handleFieldChange("id", e.target.value)}
                  isLookup
                />
                <FormInput 
                  label="Employee Name" 
                  value={formData.employeeName}
                  onChange={(e) => handleFieldChange("employeeName", e.target.value)}
                  disabled
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput 
                  label="Start Date" 
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange("startDate", e.target.value)}
                />
                <FormInput 
                  label="End Date" 
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleFieldChange("endDate", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Project Selection Tables: ALWAYS visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <SecondaryContainer title="Projects">
              <div className="flex justify-end mb-2">
                  <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Select</button>
              </div>
              <ReusableTable data={projects} columns={projectColumns} onFieldChange={() => {}} />
            </SecondaryContainer>
            <SecondaryContainer title="Selected Projects">
              <div className="flex gap-2 justify-end mb-2">
                  <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">New</button>
                  <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Copy</button>
                  <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Delete</button>
              </div>
              <ReusableTable data={selectedProjects} columns={projectColumns} onFieldChange={() => {}} />
            </SecondaryContainer>
          </div>

          {/* Tab Selection: ALWAYS visible */}
          <div className="flex border-b border-gray-200 mt-4 bg-white">
            <button
              onClick={() => setShowAssignPLC(!showAssignPLC)}
              className={`px-6 py-2 text-[11px] font-bold uppercase transition-all border-b-2 ${
                showAssignPLC 
                ? "border-[#17414d] text-[#17414d]" 
                : "border-transparent text-gray-500 hover:text-[#17414d]"
              }`}
            >
              Assign PLC to Project Workforce
            </button>
          </div>

          {/* PLC Mapping section */}
          {showAssignPLC && (
            <div className="space-y-4 mt-4 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SecondaryContainer title="PLCs">
                  <div className="flex justify-end mb-2">
                      <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Select</button>
                  </div>
                  <ReusableTable data={plcs} columns={plcColumns} onFieldChange={() => {}} />
                </SecondaryContainer>
                <SecondaryContainer title="Selected Projects">
                  <ReusableTable data={selectedProjects} columns={projectColumns} onFieldChange={() => {}} />
                </SecondaryContainer>
              </div>
              <SecondaryContainer title="PLCs Assigned to Project Workforce">
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

export default MassAddProjectWorkforce;
