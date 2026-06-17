import React, { useEffect } from "react";
import { FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

export const contributionColumns = [
  { value: "contributionCode", label: "Contribution *", key: "contributionCode", id: "contributionCode" },
  { value: "description", label: "Description", key: "description", id: "description" },
  { 
    value: "method", 
    label: "Method *", 
    key: "method", 
    id: "method", 
    type: "select",
    options: [
      { value: "FIXAMT", label: "FIXAMT" },
      { value: "GRSHRF", label: "GRSHRF" },
      { value: "GRSHRP", label: "GRSHRP" },
      { value: "NO DED", label: "NO DED" },
      { value: "PCTANN", label: "PCTANN" },
      { value: "PCTDED", label: "PCTDED" },
    ]
  },
  { value: "rate", label: "Rate *", key: "rate", id: "rate" },
  { value: "limit", label: "Limit", key: "limit", id: "limit" },
  { value: "startDate", label: "Start Date", key: "startDate", id: "startDate", type: "date" },
  { value: "throughDate", label: "Through Date", key: "throughDate", id: "throughDate", type: "date" },
];

const ContributionsDetailsTab = ({ data, onChange, isFormView, setConfig, filteredData, currentIndex = 0 }) => {
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = filteredData || (data.contributionRecords || []);
  const activeRecord = records[currentIndex] || {};

  useEffect(() => {
    if (setConfig) {
      setConfig({ 
        key: "contributionRecords", 
        cols: contributionColumns 
      });
    }
  }, [setConfig]);

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={contributionColumns} 
          onFieldChange={(rowId, field, value) => {
            const updated = records.map(r => 
              (r.tempId || r.id || r.contributionCode) === rowId ? { ...r, [field]: value, isDirty: true } : r
            );
            onChange(currentKey, 'contributionRecords', updated);
          }} 
          maxHeight="max-h-48" 
        />
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    const updated = [...records];
    if (updated.length === 0) {
      updated.push({ [field]: value, isDirty: true });
    } else {
      updated[currentIndex] = { ...updated[currentIndex], [field]: value, isDirty: true };
    }
    onChange(currentKey, 'contributionRecords', updated);
  };

  return (
    <div className="p-2 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <FormInput 
            label="Contribution *" 
            value={activeRecord.contributionCode || ""} 
            onChange={(e) => handleFieldChange('contributionCode', e.target.value)} 
          />
          <FormInput 
            label="Description" 
            value={activeRecord.description || ""} 
            onChange={(e) => handleFieldChange('description', e.target.value)} 
          />
          <FormInput 
            label="Method *" 
            type="select"
            value={activeRecord.method || ""} 
            onChange={(e) => handleFieldChange('method', e.target.value)}
            options={contributionColumns.find(c => c.key === 'method').options}
          />
          <FormInput 
            label="Rate *" 
            value={activeRecord.rate || ""} 
            onChange={(e) => handleFieldChange('rate', e.target.value)} 
          />
          <FormInput 
            label="Limit" 
            value={activeRecord.limit || ""} 
            onChange={(e) => handleFieldChange('limit', e.target.value)} 
          />
        </div>

        <div className="space-y-1">
          <FormInput 
            label="Start Date" 
            type="date" 
            value={activeRecord.startDate || ""} 
            onChange={(e) => handleFieldChange('startDate', e.target.value)} 
          />
          <FormInput 
            label="Through Date" 
            type="date" 
            value={activeRecord.throughDate || ""} 
            onChange={(e) => handleFieldChange('throughDate', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};

export default ContributionsDetailsTab;
