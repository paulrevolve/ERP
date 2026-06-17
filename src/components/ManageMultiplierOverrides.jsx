import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";
import { DollarSign } from "lucide-react";

const columns = [
  { id: "project", key: "project", label: "Project *" },
  { id: "startingAccount", key: "startingAccount", label: "Starting Account *" },
  { id: "endingAccount", key: "endingAccount", label: "Ending Account *" },
  { id: "multiplier", key: "multiplier", label: "Multiplier *" },
  { id: "applyToRBA", key: "applyToRBA", label: "Apply to R/B/A *" }
];

const ManageMultiplierOverrides = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    project: "", 
    startingAccount: "",
    endingAccount: "",
    multiplier: "",
    applyToRBA: ""
  }]);

  const activeRecord = records[0] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={DollarSign} title="Multiplier Overrides">
        <Toolbar 
          isFormView={isFormView} 
          columns={columns}
          handleFindReplace={() => {}}
          actions={{ 
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: () => {},
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {}
          }} 
        />
        <div className="mt-2">
          {isFormView ? (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <FormInput label="Project *" value={activeRecord.project || ""} onChange={(e) => handleFieldChange(activeRecord.id, "project", e.target.value)} />
                    </div>
                 </div>
              </div>
              <FormSection title="Multiplier Override Details">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <FormInput label="Starting Account *" value={activeRecord.startingAccount || ""} onChange={(e) => handleFieldChange(activeRecord.id, "startingAccount", e.target.value)} />
                       <FormInput label="Ending Account *" value={activeRecord.endingAccount || ""} onChange={(e) => handleFieldChange(activeRecord.id, "endingAccount", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <FormInput label="Multiplier *" value={activeRecord.multiplier || ""} onChange={(e) => handleFieldChange(activeRecord.id, "multiplier", e.target.value)} />
                       <FormInput label="Apply to R/B/A *" value={activeRecord.applyToRBA || ""} onChange={(e) => handleFieldChange(activeRecord.id, "applyToRBA", e.target.value)} />
                    </div>
                 </div>
              </FormSection>
            </div>
          ) : (
            <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageMultiplierOverrides;
