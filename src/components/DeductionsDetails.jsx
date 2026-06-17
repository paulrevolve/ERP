import React, { useEffect } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

// Column definitions ensure all form fields are present in the table view
export const deductionColumns = [
  { value: "deductionCode", label: "Deduction *", key: "deductionCode" },
  { value: "method", label: "Method *", key: "method", type: "select" },
  { value: "rate", label: "Rate *", key: "rate" },
  { value: "limit", label: "Limit", key: "limit" },
  { value: "priority", label: "Priority", key: "priority" },
  { value: "startDate", label: "Start Date", key: "startDate", type: "date" },
  { value: "endDate", label: "End Date", key: "endDate", type: "date" },
  { value: "startCoverageDate", label: "Start Coverage Date", key: "startCoverageDate", type: "date" },
  { value: "endCoverageDate", label: "End Coverage Date", key: "endCoverageDate", type: "date" },
];

const DeductionsDetailsTab = ({ data, onChange, isFormView, setConfig }) => {
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = data.deductionRecords || [];

  useEffect(() => {
    if (setConfig) {
      setConfig({ 
        key: "deductionRecords", 
        cols: deductionColumns 
      });
    }
  }, [setConfig]);

  // Table View
  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={deductionColumns} 
          onFieldChange={onChange} 
          maxHeight="max-h-48" 
        />
      </div>
    );
  }

  // Form View based on the provided image
  return (
    <div className="p-2 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        {/* Left Column Fields */}
        <div className="space-y-1">
          <div className="flex gap-2">
            <FormInput 
              label="Deduction *" 
              value={data.deductionCode || ""} 
              onChange={(e) => onChange(currentKey, 'deductionCode', e.target.value)} 
            />
            <div className="w-32 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
          </div>
          <FormInput 
            label="Method *" 
            type="select"
            value={data.method || ""} 
            onChange={(e) => onChange(currentKey, 'method', e.target.value)}
            options={[]} // Add relevant options here
          />
          <FormInput 
            label="Rate *" 
            value={data.rate || ""} 
            onChange={(e) => onChange(currentKey, 'rate', e.target.value)} 
          />
          <FormInput 
            label="Limit" 
            value={data.limit || ""} 
            onChange={(e) => onChange(currentKey, 'limit', e.target.value)} 
          />
          <div className="flex">
             <FormInput 
                label="Priority" 
                value={data.priority || ""} 
                onChange={(e) => onChange(currentKey, 'priority', e.target.value)} 
             />
             <div className="w-16 bg-gray-100 border border-gray-300 rounded h-6 mt-1 self-center"></div>
          </div>
        </div>

        {/* Right Column Fields (Dates) */}
        <div className="space-y-1">
          <FormInput 
            label="Start Date" 
            type="date" 
            value={data.startDate || ""} 
            onChange={(e) => onChange(currentKey, 'startDate', e.target.value)} 
          />
          <FormInput 
            label="End Date" 
            type="date" 
            value={data.endDate || ""} 
            onChange={(e) => onChange(currentKey, 'endDate', e.target.value)} 
          />
          <FormInput 
            label="Start Coverage Date" 
            type="date" 
            value={data.startCoverageDate || ""} 
            onChange={(e) => onChange(currentKey, 'startCoverageDate', e.target.value)} 
          />
          <FormInput 
            label="End Coverage Date" 
            type="date" 
            value={data.endCoverageDate || ""} 
            onChange={(e) => onChange(currentKey, 'endCoverageDate', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};

export default DeductionsDetailsTab;