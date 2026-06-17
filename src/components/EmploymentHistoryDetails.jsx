import React, { useEffect } from "react";
import { FormInput, FormSection } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

export const employmentHistoryColumns = [
  { value: "hireDate", label: "Hire Date *", key: "hireDate", id: "hireDate", type: "date" },
  { value: "terminationDate", label: "Termination Date *", key: "terminationDate", id: "terminationDate", type: "date" },
  { value: "lastDayWorked", label: "Last Day Worked", key: "lastDayWorked", id: "lastDayWorked" },
  { value: "terminationType", label: "Termination Type", key: "terminationType", id: "terminationType" },
  { value: "terminationReason", label: "Termination Reason", key: "terminationReason", id: "terminationReason" },
];

const EmploymentHistoryDetailsTab = ({ data, onChange, isFormView, setConfig, filteredData, currentIndex = 0 }) => {
  const currentKey = String(data?.tempId || data?.emplId || data?.id || "");
  const records = filteredData || (data.employmentHistoryRecords || []);
  const activeRecord = records[currentIndex] || {};

  useEffect(() => {
    if (setConfig) {
      setConfig({ 
        key: "employmentHistoryRecords", 
        cols: employmentHistoryColumns 
      });
    }
  }, [setConfig]);

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable 
          data={records} 
          columns={employmentHistoryColumns} 
          onFieldChange={(rowId, field, value) => {
            const updated = records.map(r => 
              (r.tempId || r.id || r.hireDate) === rowId ? { ...r, [field]: value, isDirty: true } : r
            );
            onChange(currentKey, 'employmentHistoryRecords', updated);
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
    onChange(currentKey, 'employmentHistoryRecords', updated);
  };

  return (
    <div className="p-2 space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <div className="space-y-1">
             <FormInput label="Hire Date *" type="date" value={activeRecord.hireDate || ""} onChange={(e) => handleFieldChange('hireDate', e.target.value)} />
             <FormInput label="Termination Date *" type="date" value={activeRecord.terminationDate || ""} onChange={(e) => handleFieldChange('terminationDate', e.target.value)} />
             <FormInput label="Last Day Worked" value={activeRecord.lastDayWorked || ""} onChange={(e) => handleFieldChange('lastDayWorked', e.target.value)} />
          </div>
        </div>

        <FormSection title="Offboarding Details">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <FormInput label="Termination Type" value={activeRecord.terminationType || ""} onChange={(e) => handleFieldChange('terminationType', e.target.value)} />
              <FormInput label="Termination Reason" value={activeRecord.terminationReason || ""} onChange={(e) => handleFieldChange('terminationReason', e.target.value)} />
              <FormInput label="Rehire Eligibility" value={activeRecord.rehireEligibility || ""} onChange={(e) => handleFieldChange('rehireEligibility', e.target.value)} />
              <FormInput label="Eligible for Rehire" value={activeRecord.eligibleForRehire || ""} onChange={(e) => handleFieldChange('eligibleForRehire', e.target.value)} />
              <FormInput label="E-mail Address" value={activeRecord.emailAddress || ""} onChange={(e) => handleFieldChange('emailAddress', e.target.value)} />
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase block mb-1">Termination Comments</label>
                <textarea 
                  className="w-full h-20 p-2 border border-gray-300 rounded text-xs outline-none focus:border-[#17414d]"
                  value={activeRecord.terminationComments || ""}
                  onChange={(e) => handleFieldChange('terminationComments', e.target.value)}
                />
              </div>
              <FormInput label="Source" value={activeRecord.source || "LDMEINFO"} onChange={(e) => handleFieldChange('source', e.target.value)} />
           </div>
        </FormSection>

        <FormSection title="Offboard Process">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              <FormInput label="Offboard Configuration" value={activeRecord.offboardConfig || ""} onChange={(e) => handleFieldChange('offboardConfig', e.target.value)} />
              <FormInput label="Offboard Status" value={activeRecord.offboardStatus || ""} onChange={(e) => handleFieldChange('offboardStatus', e.target.value)} />
              <FormInput label="Offboard Date" value={activeRecord.offboardDate || ""} onChange={(e) => handleFieldChange('offboardDate', e.target.value)} />
           </div>
        </FormSection>
      </div>
    </div>
  );
};

export default EmploymentHistoryDetailsTab;
