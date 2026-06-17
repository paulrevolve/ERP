import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Printer } from "lucide-react";

const columns = [
  { id: "parameterId", key: "parameterId", label: "Parameter ID *" },
  { id: "description", key: "description", label: "Description *" }
];

const PrintProjectWorkforceReport = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([
    { 
      id: "1", 
      parameterId: "PAR001", 
      description: "PLC Rates Report", 
      selectionProject: "project",
      selectionOption: "all",
      selectionStart: "",
      selectionEnd: "",
      optionPageBreak: false,
      printEmployeesReport: true,
      printVendorsReport: false,
      printVendorEmployeesReport: false,
      showNamesOnly: false
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeRecord = records[currentIndex] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = {
      id: newId,
      parameterId: "",
      description: "",
      selectionProject: "project",
      selectionOption: "all",
      selectionStart: "",
      selectionEnd: "",
      optionPageBreak: false,
      printEmployeesReport: true,
      printVendorsReport: false,
      printVendorEmployeesReport: false,
      showNamesOnly: false,
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Printer} title="Print Project Workforce Report">
        <Toolbar 
          isFormView={isFormView}
          columns={columns}
          currentIndex={currentIndex}
          totalRecords={records.length}
          handleNavigate={(dir) => {
            if (dir === 'next' && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
            if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
            if (dir === 'start') setCurrentIndex(0);
            if (dir === 'end') setCurrentIndex(records.length - 1);
          }}
          actions={{
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: handleAdd,
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {}
          }}
        />

        <div className="mt-2">
          {isFormView ? (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-sm shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormInput 
                   label="Parameter ID *" 
                   value={activeRecord.parameterId || ""} 
                   onChange={(e) => handleFieldChange(activeRecord.id, "parameterId", e.target.value)} 
                 />
                 <FormInput 
                   label="Description *" 
                   value={activeRecord.description || ""} 
                   onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} 
                 />
              </div>

              <FormSection title="Selection Ranges">
                <div className="grid grid-cols-4 gap-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <div></div>
                  <div>Option</div>
                  <div>Start</div>
                  <div>End</div>
                </div>
                <div className="grid grid-cols-4 gap-4 items-center">
                  <FormInput 
                    type="select" 
                    value={activeRecord.selectionProject || "project"} 
                    options={[{ label: "Project", value: "project" }]} 
                    disabled 
                  />
                  <FormInput 
                    type="select" 
                    value={activeRecord.selectionOption || "all"} 
                    options={[{ label: "All", value: "all" }, { label: "Range", value: "range" }]} 
                    onChange={(e) => handleFieldChange(activeRecord.id, "selectionOption", e.target.value)} 
                  />
                  <FormInput 
                    value={activeRecord.selectionStart || ""} 
                    onChange={(e) => handleFieldChange(activeRecord.id, "selectionStart", e.target.value)} 
                  />
                  <FormInput 
                    value={activeRecord.selectionEnd || ""} 
                    onChange={(e) => handleFieldChange(activeRecord.id, "selectionEnd", e.target.value)} 
                  />
                </div>
              </FormSection>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSection title="Options">
                   <FormInput 
                     type="checkbox" 
                     label="Page Break" 
                     checked={activeRecord.optionPageBreak} 
                     onChange={(e) => handleFieldChange(activeRecord.id, "optionPageBreak", e.target.checked)} 
                   />
                </FormSection>

                <FormSection title="Print">
                   <div className="space-y-2">
                      <FormInput 
                        type="checkbox" 
                        label="Employees Report" 
                        checked={activeRecord.printEmployeesReport} 
                        onChange={(e) => handleFieldChange(activeRecord.id, "printEmployeesReport", e.target.checked)} 
                      />
                      <FormInput 
                        type="checkbox" 
                        label="Vendors Report" 
                        checked={activeRecord.printVendorsReport} 
                        onChange={(e) => handleFieldChange(activeRecord.id, "printVendorsReport", e.target.checked)} 
                      />
                      <FormInput 
                        type="checkbox" 
                        label="Vendor Employees Report" 
                        checked={activeRecord.printVendorEmployeesReport} 
                        onChange={(e) => handleFieldChange(activeRecord.id, "printVendorEmployeesReport", e.target.checked)} 
                      />
                   </div>
                </FormSection>

                <FormSection title="Show">
                   <FormInput 
                     type="checkbox" 
                     label="Names Only" 
                     checked={activeRecord.showNamesOnly} 
                     onChange={(e) => handleFieldChange(activeRecord.id, "showNamesOnly", e.target.checked)} 
                   />
                </FormSection>
              </div>
            </div>
          ) : (
            <SecondaryContainer title="Parameters List">
              <ReusableTable 
                data={records} 
                columns={columns} 
                onFieldChange={handleFieldChange} 
                selectedRows={[]}
                onRowSelect={() => {}}
                onSelectAll={() => {}}
              />
            </SecondaryContainer>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default PrintProjectWorkforceReport;
