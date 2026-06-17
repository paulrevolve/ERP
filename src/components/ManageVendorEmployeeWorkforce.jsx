import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";
import { UserCheck } from "lucide-react";

const vendorEmployeeColumns = [
  { id: "vendor", key: "vendor", label: "Vendor" },
  { id: "vendorName", key: "vendorName", label: "Vendor Name" },
  { id: "vendorEmployee", key: "vendorEmployee", label: "Vendor Employee" },
  { id: "vendorEmployeeName", key: "vendorEmployeeName", label: "Vendor Employee Name" },
];

const selectedVendorEmployeeColumns = [
  { id: "vendor", key: "vendor", label: "Vendor *" },
  { id: "vendorName", key: "vendorName", label: "Vendor Name" },
  { id: "vendorEmployee", key: "vendorEmployee", label: "Vendor Employee *" },
  { id: "vendorEmployeeName", key: "vendorEmployeeName", label: "Vendor Employee Name" },
];

const plcColumns = [
  { id: "plc", key: "plc", label: "PLC" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
];

const assignedPLCColumns = [
  { id: "plc", key: "plc", label: "PLC *" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
  { id: "defaultPlc", key: "defaultPlc", label: "Default PLC", type: "checkbox" },
  { id: "vendor", key: "vendor", label: "Vendor *" },
  { id: "vendorName", key: "vendorName", label: "Vendor Name" },
  { id: "vendorEmployee", key: "vendorEmployee", label: "Vendor Employee *" },
  { id: "vendorEmployeeName", key: "vendorEmployeeName", label: "Vendor Employee Name" },
  { id: "startDate", key: "startDate", label: "Starting Date", type: "date" },
  { id: "endDate", key: "endDate", label: "Ending Date", type: "date" },
];

const ManageVendorEmployeeWorkforce = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [showAssignPLC, setShowAssignPLC] = useState(false);
  
  const [formData, setFormData] = useState({
    project: "",
  });

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={UserCheck} title="Manage Vendor Employee Workforce">
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
          {/* Top Section: Toggles between Form and Table List */}
          {!isFormView ? (
            <SecondaryContainer title="Vendor Employee Workforce List">
              <ReusableTable 
                data={[]} 
                columns={[
                  { id: "project", key: "project", label: "Project" },
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
            </div>
          )}

          {/* Vendor Employee Tables ALWAYS visible in both views */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <SecondaryContainer title="Vendor Employees">
              <div className="flex justify-end mb-2">
                  <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Select</button>
              </div>
              <ReusableTable data={[]} columns={vendorEmployeeColumns} onFieldChange={() => {}} />
            </SecondaryContainer>
            <SecondaryContainer title="Selected Vendor Employees">
              <div className="flex gap-2 justify-end mb-2">
                  <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">New</button>
                  <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Copy</button>
                  <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Delete</button>
              </div>
              <ReusableTable data={[]} columns={selectedVendorEmployeeColumns} onFieldChange={() => {}} />
            </SecondaryContainer>
          </div>

          {/* Tab Selection: ALWAYS visible at the bottom of the tables */}
          <div className="flex border-b border-gray-200 mt-4 bg-white">
            <button
              onClick={() => setShowAssignPLC(!showAssignPLC)}
              className={`px-6 py-2 text-[11px] font-bold uppercase transition-all border-b-2 ${
                showAssignPLC 
                ? "border-[#17414d] text-[#17414d]" 
                : "border-transparent text-gray-500 hover:text-[#17414d]"
              }`}
            >
              Assign PLC to Vendor Employee Workforce
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
                  <ReusableTable data={[]} columns={plcColumns} onFieldChange={() => {}} />
                </SecondaryContainer>
                <SecondaryContainer title="Selected Vendor Employees">
                  <ReusableTable data={[]} columns={selectedVendorEmployeeColumns} onFieldChange={() => {}} />
                </SecondaryContainer>
              </div>
              <SecondaryContainer title="PLCs Assigned to Vendor Employee Workforce">
                <div className="flex gap-2 justify-end mb-2">
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">New</button>
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Copy</button>
                    <button className="px-3 py-1 text-[10px] font-bold bg-[#17414d] text-white rounded hover:bg-[#12343d] transition-all">Delete</button>
                </div>
                <ReusableTable data={[]} columns={assignedPLCColumns} onFieldChange={() => {}} />
              </SecondaryContainer>
            </div>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageVendorEmployeeWorkforce;
