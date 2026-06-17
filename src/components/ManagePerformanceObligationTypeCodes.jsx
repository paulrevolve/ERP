import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { DollarSign } from "lucide-react";

const columns = [
  { id: "performanceObligationTypeCode", key: "performanceObligationTypeCode", label: "Performance Obligation Type Code *" },
  { id: "performanceObligationTypeDescription", key: "performanceObligationTypeDescription", label: "Performance Obligation Type Description *" }
];

const ManagePerformanceObligationTypeCodes = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    performanceObligationTypeCode: "", 
    performanceObligationTypeDescription: ""
  }]);

  const activeRecord = records[0] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={DollarSign} title="Manage Performance Obligation Type Codes">
        <Toolbar 
          isFormView={isFormView} 
          columns={columns}
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
                       <FormInput 
                         label="Performance Obligation Type Code *" 
                         value={activeRecord.performanceObligationTypeCode || ""} 
                         onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationTypeCode", e.target.value)}
                       />
                       <FormInput 
                         label="Performance Obligation Type Description *" 
                         value={activeRecord.performanceObligationTypeDescription || ""} 
                         onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationTypeDescription", e.target.value)}
                       />
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManagePerformanceObligationTypeCodes;
