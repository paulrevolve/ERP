import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { DollarSign } from "lucide-react";

const columns = [
  { id: "revenueEvaluationStatusCode", key: "revenueEvaluationStatusCode", label: "Revenue Evaluation Status Code *" },
  { id: "revenueEvaluationStatusDescription", key: "revenueEvaluationStatusDescription", label: "Revenue Evaluation Status Description *" }
];

const ManageRevenueEvaluationStatusCodes = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    revenueEvaluationStatusCode: "", 
    revenueEvaluationStatusDescription: ""
  }]);

  const activeRecord = records[0] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={DollarSign} title="Manage Revenue Evaluation Status Codes">
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
                         label="Revenue Evaluation Status Code *" 
                         value={activeRecord.revenueEvaluationStatusCode || ""} 
                         onChange={(e) => handleFieldChange(activeRecord.id, "revenueEvaluationStatusCode", e.target.value)}
                       />
                       <FormInput 
                         label="Revenue Evaluation Status Description *" 
                         value={activeRecord.revenueEvaluationStatusDescription || ""} 
                         onChange={(e) => handleFieldChange(activeRecord.id, "revenueEvaluationStatusDescription", e.target.value)}
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

export default ManageRevenueEvaluationStatusCodes;
