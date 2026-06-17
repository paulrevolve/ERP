import React, { useState } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Toolbar } from "../helper/container";

export const multiStateColumns = [
  { value: "withholdingState", label: "Withholding State *", key: "withholdingState" },
  { value: "filingStatus", label: "Filing Status", key: "filingStatus" },
  { value: "exemptions", label: "Exemptions", key: "exemptions" },
  { value: "blindnessExemptions", label: "Blindness Exemptions", key: "blindnessExemptions" },
  { value: "age65Exemptions", label: "Age 65 Exemptions", key: "age65Exemptions" },
  { value: "dependents", label: "Dependents", key: "dependents" },
  { value: "firstTimeDependents", label: "First-time claimed dependents", key: "firstTimeDependents" },
  { value: "firstTimeDependentsYear", label: "First-time claimed dependents year", key: "firstTimeDependentsYear" },
  { value: "adoptedChildren", label: "Number of adopted children", key: "adoptedChildren" },
  { value: "credits", label: "Credits", key: "credits" },
  { value: "creditAmount", label: "Credit Amount", key: "creditAmount" },
  { value: "overrideAmount", label: "Override Amount", key: "overrideAmount" },
  { value: "overridePercent", label: "Override Percent", key: "overridePercent" },
  { value: "additionalAmount", label: "Additional Amount", key: "additionalAmount" },
  { value: "coloradoDeduction", label: "Colorado Deduction", key: "coloradoDeduction" },
  { value: "nebraskaExemptFl", label: "Nebraska Exempt", key: "nebraskaExemptFl", type: "checkbox" },
  { value: "prVeteranExemptFl", label: "PR Veteran Exemption", key: "prVeteranExemptFl", type: "checkbox" },
  { value: "prSpecialDeductionFl", label: "PR Special Deduction", key: "prSpecialDeductionFl", type: "checkbox" }
];

const MultiStateTaxes = ({ data, onChange, currentKey }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [localIndex, setLocalIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const records = data.multiStateTaxesRecords || [];
  const activeRecord = records[localIndex] || {};

  const getRowKey = (row) => String(row?.tempId || row?.id || row?.withholdingState || "");

  const handleToggleView = () => setIsFormView(!isFormView);

  const handleAdd = () => {
    const newRecord = { isDirty: true, tempId: `NEW_MULTISTATE_${Date.now()}` };
    const updated = [...records, newRecord];
    onChange(currentKey, 'multiStateTaxesRecords', updated);
    setLocalIndex(updated.length - 1);
  };

  const handleDelete = () => {
    if (selectedRows.size > 0) {
      if (window.confirm("Are you sure you want to delete selected records?")) {
        const updated = records.filter(r => !selectedRows.has(getRowKey(r)));
        onChange(currentKey, 'multiStateTaxesRecords', updated);
        setSelectedRows(new Set());
      }
    }
  };

  const handleClear = () => {
    if (window.confirm("Discard changes?")) {
        const cleaned = records.filter(r => !String(getRowKey(r)).startsWith("NEW_")).map(r => ({...r, isDirty: false}));
        onChange(currentKey, 'multiStateTaxesRecords', cleaned);
    }
  };

  const handleSave = () => {
    // Dummy save for now
    const updated = records.map(r => ({...r, isDirty: false}));
    onChange(currentKey, 'multiStateTaxesRecords', updated);
  };

  const handleFieldChange = (field, value) => {
    const updated = [...records];
    if (updated.length === 0) {
      updated.push({ [field]: value, isDirty: true });
      setLocalIndex(0);
    } else {
      updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
    }
    onChange(currentKey, 'multiStateTaxesRecords', updated);
  };

  const handleRowSelect = (item) => {
    const newSelected = new Set(selectedRows);
    const id = getRowKey(item);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (isSelectAll, currentData) => {
    if (isSelectAll) {
      const newSelected = new Set(currentData.map(item => getRowKey(item)));
      setSelectedRows(newSelected);
    } else {
      setSelectedRows(new Set());
    }
  };
  
  const handleRecordChange = (rowId, field, value) => {
    const updated = records.map(r => 
      getRowKey(r) === String(rowId) ? { ...r, [field]: value, isDirty: true } : r
    );
    onChange(currentKey, 'multiStateTaxesRecords', updated);
  };

  return (
    <div className="space-y-2">
      <Toolbar 
        title=" "
        actions={{
          onAdd: handleAdd,
          onCopy: () => {},
          onPaste: () => {},
          onClear: handleClear,
          onDelete: handleDelete,
          onSave: handleSave,
          onToggleView: handleToggleView
        }}
        isFormView={isFormView}
        isDirty={records.some(r => r.isDirty)}
      />

      {!isFormView ? (
        <div className="p-2 border border-gray-100 rounded-b-lg bg-white">
          <ReusableTable 
            data={records} 
            columns={multiStateColumns} 
            onFieldChange={handleRecordChange} 
            selectedRows={selectedRows}
            onRowSelect={handleRowSelect}
            onSelectAll={handleSelectAll}
            rowKey={getRowKey}
            maxHeight="max-h-48" 
          />
        </div>
      ) : (
        <div className="p-2 space-y-4 bg-white border border-gray-100 rounded-b-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            {/* Left Column */}
            <div className="space-y-1">
              <FormInput label="Withholding State *" value={activeRecord.withholdingState || ""} onChange={(e) => handleFieldChange('withholdingState', e.target.value)} />
              <FormInput label="Filing Status" type="select" options={[]} value={activeRecord.filingStatus || ""} onChange={(e) => handleFieldChange('filingStatus', e.target.value)} />
              
              <div className="mt-4 space-y-1">
                <FormInput label="Exemptions" value={activeRecord.exemptions || ""} onChange={(e) => handleFieldChange('exemptions', e.target.value)} />
                <FormInput label="Blindness Exemptions" value={activeRecord.blindnessExemptions || ""} onChange={(e) => handleFieldChange('blindnessExemptions', e.target.value)} />
                <FormInput label="Age 65 Exemptions" value={activeRecord.age65Exemptions || ""} onChange={(e) => handleFieldChange('age65Exemptions', e.target.value)} />
              </div>

              <div className="mt-4 space-y-1">
                <FormInput label="Dependents" value={activeRecord.dependents || ""} onChange={(e) => handleFieldChange('dependents', e.target.value)} />
                <FormInput label="First-time claimed dependents" value={activeRecord.firstTimeDependents || ""} onChange={(e) => handleFieldChange('firstTimeDependents', e.target.value)} />
                <FormInput label="First-time claimed dependents year" value={activeRecord.firstTimeDependentsYear || ""} onChange={(e) => handleFieldChange('firstTimeDependentsYear', e.target.value)} />
                <FormInput label="Number of adopted children" value={activeRecord.adoptedChildren || ""} onChange={(e) => handleFieldChange('adoptedChildren', e.target.value)} />
                <FormInput label="Credits" value={activeRecord.credits || ""} onChange={(e) => handleFieldChange('credits', e.target.value)} />
                <FormInput label="Credit Amount" value={activeRecord.creditAmount || ""} onChange={(e) => handleFieldChange('creditAmount', e.target.value)} />
              </div>

              <div className="mt-4 space-y-1">
                <FormInput label="Override Amount" value={activeRecord.overrideAmount || ""} onChange={(e) => handleFieldChange('overrideAmount', e.target.value)} />
                <FormInput label="Override Percent" value={activeRecord.overridePercent || ""} onChange={(e) => handleFieldChange('overridePercent', e.target.value)} />
                <FormInput label="Additional Amount" value={activeRecord.additionalAmount || ""} onChange={(e) => handleFieldChange('additionalAmount', e.target.value)} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Colorado Deduction</label>
                <div className="ml-2 space-y-1">
                  <FormInput label="Use Standard Deduction Table" type="radio" name="coloradoDeduction" checked={activeRecord.coloradoDeduction === "standard"} onChange={() => handleFieldChange('coloradoDeduction', 'standard')} />
                  <FormInput label="Use Colorado DR 0004 Allowance Amount" type="radio" name="coloradoDeduction" checked={activeRecord.coloradoDeduction === "allowance"} onChange={() => handleFieldChange('coloradoDeduction', 'allowance')} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Nebraska</label>
                <div className="ml-2">
                  <FormInput label="Exempt from Minimum Withholding Rule" type="checkbox" checked={activeRecord.nebraskaExemptFl === "Y"} onChange={(e) => handleFieldChange('nebraskaExemptFl', e.target.checked ? "Y" : "N")} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Puerto Rico</label>
                <div className="ml-2 space-y-1">
                  <FormInput label="Veteran Exemption" type="checkbox" checked={activeRecord.prVeteranExemptFl === "Y"} onChange={(e) => handleFieldChange('prVeteranExemptFl', e.target.checked ? "Y" : "N")} />
                  <FormInput label="Special Deduction" type="checkbox" checked={activeRecord.prSpecialDeductionFl === "Y"} onChange={(e) => handleFieldChange('prSpecialDeductionFl', e.target.checked ? "Y" : "N")} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStateTaxes;
