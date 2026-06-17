import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer, ActionButton } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";
import { Plus, Copy, Trash2 } from "lucide-react";

const employeeColumns = [
  { id: "employee", key: "employee", label: "Employee *" },
  { id: "employeeName", key: "employeeName", label: "Employee Name" },
  { id: "plc", key: "plc", label: "PLC *" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
  { id: "rateType", key: "rateType", label: "Rate Type *" },
  { id: "rate", key: "rate", label: "Rate *" },
  { id: "startingDate", key: "startingDate", label: "Starting Date", type: "date" },
  { id: "endingDate", key: "endingDate", label: "Ending Date", type: "date" },
];

const vendorColumns = [
  { id: "lookupType", key: "lookupType", label: "Lookup Type *" },
  { id: "vendor", key: "vendor", label: "Vendor *" },
  { id: "vendorName", key: "vendorName", label: "Vendor Name" },
  { id: "vendorEmployee", key: "vendorEmployee", label: "Vendor Employee" },
  { id: "vendorEmployeeName", key: "vendorEmployeeName", label: "Vendor Employee Name" },
  { id: "plc", key: "plc", label: "PLC *" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
  { id: "rateType", key: "rateType", label: "Rate Type *" },
  { id: "rate", key: "rate", label: "Rate *" },
  { id: "discountPercentage", key: "discountPercentage", label: "Discount Percentage" },
  { id: "startingDate", key: "startingDate", label: "Starting Date", type: "date" },
  { id: "endingDate", key: "endingDate", label: "Ending Date", type: "date" },
];

const LinkPLCRatesToEmployeeVendor = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [formData, setFormData] = useState({
    project: "",
    useProjectWorkforce: false
  });

  const [employeeRates, setEmployeeRates] = useState([
    { id: "1", employee: "E001", employeeName: "John Doe", plc: "ENG", plcDescription: "Engineer", rateType: "Standard", rate: "150", startingDate: "2023-01-01", endingDate: "2023-12-31" }
  ]);

  const [vendorRates, setVendorRates] = useState([
    { id: "1", lookupType: "Vendor", vendor: "V001", vendorName: "Tech Solutions", vendorEmployee: "VE001", vendorEmployeeName: "Alice Smith", plc: "CONS", plcDescription: "Consultant", rateType: "Contract", rate: "200", discountPercentage: "10", startingDate: "2023-01-01", endingDate: "2023-12-31" }
  ]);

  const [currentEmpIndex, setCurrentEmpIndex] = useState(0);
  const [currentVenIndex, setCurrentVenIndex] = useState(0);

  const activeEmpRecord = employeeRates[currentEmpIndex] || {};
  const activeVenRecord = vendorRates[currentVenIndex] || {};

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTableFieldChange = (table, id, field, value) => {
    if (table === "employee") {
      setEmployeeRates(prev => prev.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
    } else {
      setVendorRates(prev => prev.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
    }
  };

  const addEmployeeRate = () => {
    const newId = `NEW_${Date.now()}`;
    setEmployeeRates([{ id: newId, employee: "", employeeName: "", plc: "", plcDescription: "", rateType: "", rate: "", startingDate: "", endingDate: "", isDirty: true }, ...employeeRates]);
    setCurrentEmpIndex(0);
  };

  const addVendorRate = () => {
    const newId = `NEW_${Date.now()}`;
    setVendorRates([{ id: newId, lookupType: "", vendor: "", vendorName: "", vendorEmployee: "", vendorEmployeeName: "", plc: "", plcDescription: "", rateType: "", rate: "", discountPercentage: "", startingDate: "", endingDate: "", isDirty: true }, ...vendorRates]);
    setCurrentVenIndex(0);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer title="Link PLC Rates to Employee/Vendor">
        <Toolbar 
          isFormView={isFormView}
          actions={{
            onToggleView: () => setIsFormView(!isFormView),
            onSave: () => {},
            onAdd: () => addEmployeeRate(),
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {}
          }}
        />

        <div className="mt-2 space-y-4">
          <div className="p-4 bg-white border border-gray-200 rounded-sm shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <FormSearchSelect 
                  label="Project *" 
                  value={formData.project} 
                  options={[]} 
                  displayKey="project" 
                  onSelect={(opt) => handleFieldChange("project", opt.project)}
                />
                <div className="flex items-center pt-6">
                   <FormInput 
                     type="checkbox" 
                     label="Use Project Workforce" 
                     checked={formData.useProjectWorkforce} 
                     onChange={(e) => handleFieldChange("useProjectWorkforce", e.target.checked)} 
                   />
                </div>
             </div>
          </div>

          {!isFormView ? (
            <div className="space-y-4">
              <SecondaryContainer title="Employee Billing Rates">
                <div className="flex gap-2 justify-end mb-2">
                  <ActionButton icon={Plus} onClick={addEmployeeRate} title="New" />
                  <ActionButton icon={Copy} onClick={() => {}} title="Copy" />
                  <ActionButton icon={Trash2} onClick={() => {}} title="Delete" />
                </div>
                <ReusableTable 
                  data={employeeRates} 
                  columns={employeeColumns} 
                  onFieldChange={(id, field, value) => handleTableFieldChange("employee", id, field, value)} 
                  onRowSelect={() => {}}
                />
              </SecondaryContainer>

              <SecondaryContainer title="Vendor Billing Rates">
                <div className="flex gap-2 justify-end mb-2">
                  <ActionButton icon={Plus} onClick={addVendorRate} title="New" />
                  <ActionButton icon={Copy} onClick={() => {}} title="Copy" />
                  <ActionButton icon={Trash2} onClick={() => {}} title="Delete" />
                </div>
                <ReusableTable 
                  data={vendorRates} 
                  columns={vendorColumns} 
                  onFieldChange={(id, field, value) => handleTableFieldChange("vendor", id, field, value)} 
                  onRowSelect={() => {}}
                />
              </SecondaryContainer>
            </div>
          ) : (
            <div className="space-y-4">
              <FormSection title="Employee Billing Rate Details">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employeeColumns.map(col => (
                      <FormInput 
                        key={col.id}
                        label={col.label}
                        value={activeEmpRecord[col.key] || ""}
                        onChange={(e) => handleTableFieldChange("employee", activeEmpRecord.id, col.key, e.target.value)}
                        type={col.type || "text"}
                      />
                    ))}
                 </div>
              </FormSection>

              <FormSection title="Vendor Billing Rate Details">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendorColumns.map(col => (
                      <FormInput 
                        key={col.id}
                        label={col.label}
                        value={activeVenRecord[col.key] || ""}
                        onChange={(e) => handleTableFieldChange("vendor", activeVenRecord.id, col.key, e.target.value)}
                        type={col.type || "text"}
                      />
                    ))}
                 </div>
              </FormSection>
            </div>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default LinkPLCRatesToEmployeeVendor;
