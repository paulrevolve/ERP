import React, { useState } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Toolbar } from "../helper/container";

export const localTaxesColumns = [
  { value: "localTax", label: "Local Tax *", key: "localTax" },
  { value: "state", label: "State", key: "state" },
  { value: "priority", label: "Priority *", key: "priority" },
  { value: "filingStatus", label: "Filing Status *", key: "filingStatus" },
  { value: "exemptions", label: "Exemptions", key: "exemptions" },
  { value: "dependents", label: "Dependents", key: "dependents" },
  { value: "firstTimeDependents", label: "First-time claimed dependents", key: "firstTimeDependents" },
  { value: "firstTimeDependentsYear", label: "First-time claimed dependents year", key: "firstTimeDependentsYear" },
  { value: "adoptedChildren", label: "Number of adopted children", key: "adoptedChildren" },
  { value: "credits", label: "Credits", key: "credits" },
  { value: "overrideAmount", label: "Override Amount", key: "overrideAmount" },
  { value: "overridePercent", label: "Override Percent", key: "overridePercent" },
  { value: "additionalAmount", label: "Additional Amount", key: "additionalAmount" },
  { value: "startDate", label: "Start Date", key: "startDate", type: "date" },
  { value: "endDate", label: "End Date", key: "endDate", type: "date" },
  { value: "residentPsdCode", label: "Resident PSD Code", key: "residentPsdCode" },
  { value: "worksitePsdCode", label: "Worksite PSD Code", key: "worksitePsdCode" },
  { value: "localTaxPsdCode", label: "Local Tax PSD Code", key: "localTaxPsdCode" }
];

const LocalTaxes = ({ data, onChange, currentKey }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [localIndex, setLocalIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const records = data.localTaxesRecords || [];
  const activeRecord = records[localIndex] || {};

  const getRowKey = (row) => String(row?.tempId || row?.id || row?.localTax || "");

  const handleToggleView = () => setIsFormView(!isFormView);

  const handleAdd = () => {
    const newRecord = { isDirty: true, tempId: `NEW_LOCALTAX_${Date.now()}` };
    const updated = [...records, newRecord];
    onChange(currentKey, 'localTaxesRecords', updated);
    setLocalIndex(updated.length - 1);
  };

  const handleDelete = () => {
    if (selectedRows.size > 0) {
      if (window.confirm("Are you sure you want to delete selected records?")) {
        const updated = records.filter(r => !selectedRows.has(getRowKey(r)));
        onChange(currentKey, 'localTaxesRecords', updated);
        setSelectedRows(new Set());
      }
    }
  };

  const handleClear = () => {
    if (window.confirm("Discard changes?")) {
        const cleaned = records.filter(r => !String(getRowKey(r)).startsWith("NEW_")).map(r => ({...r, isDirty: false}));
        onChange(currentKey, 'localTaxesRecords', cleaned);
    }
  };

  const handleSave = () => {
    // Dummy save for now
    const updated = records.map(r => ({...r, isDirty: false}));
    onChange(currentKey, 'localTaxesRecords', updated);
  };

  const handleFieldChange = (field, value) => {
    const updated = [...records];
    if (updated.length === 0) {
      updated.push({ [field]: value, isDirty: true });
      setLocalIndex(0);
    } else {
      updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
    }
    onChange(currentKey, 'localTaxesRecords', updated);
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
    onChange(currentKey, 'localTaxesRecords', updated);
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
            columns={localTaxesColumns} 
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
              <FormInput label="Local Tax *" type="select" options={[]} value={activeRecord.localTax || ""} onChange={(e) => handleFieldChange('localTax', e.target.value)} />
              <FormInput label="State" type="select" options={[]} value={activeRecord.state || ""} onChange={(e) => handleFieldChange('state', e.target.value)} />
              <FormInput label="Priority *" value={activeRecord.priority || ""} onChange={(e) => handleFieldChange('priority', e.target.value)} />
              <FormInput label="Filing Status *" type="select" options={[]} value={activeRecord.filingStatus || ""} onChange={(e) => handleFieldChange('filingStatus', e.target.value)} />
              
              <div className="mt-4 space-y-1">
                <FormInput label="Exemptions" value={activeRecord.exemptions || "0"} onChange={(e) => handleFieldChange('exemptions', e.target.value)} />
                <FormInput label="Dependents" value={activeRecord.dependents || "0"} onChange={(e) => handleFieldChange('dependents', e.target.value)} />
                <FormInput label="First-time claimed dependents" value={activeRecord.firstTimeDependents || "0"} onChange={(e) => handleFieldChange('firstTimeDependents', e.target.value)} />
                <FormInput label="First-time claimed dependents year" value={activeRecord.firstTimeDependentsYear || ""} onChange={(e) => handleFieldChange('firstTimeDependentsYear', e.target.value)} />
                <FormInput label="Number of adopted children" value={activeRecord.adoptedChildren || ""} onChange={(e) => handleFieldChange('adoptedChildren', e.target.value)} />
                <FormInput label="Credits" value={activeRecord.credits || "0"} onChange={(e) => handleFieldChange('credits', e.target.value)} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FormInput label="Override Amount" value={activeRecord.overrideAmount || "0.00"} onChange={(e) => handleFieldChange('overrideAmount', e.target.value)} />
                <span className="text-[10px] text-gray-500 mt-2 whitespace-nowrap">(per pay period)</span>
              </div>
              <FormInput label="Override Percent" value={activeRecord.overridePercent || "0.00%"} onChange={(e) => handleFieldChange('overridePercent', e.target.value)} />
              <div className="flex items-center gap-2">
                <FormInput label="Additional Amount" value={activeRecord.additionalAmount || "0.00"} onChange={(e) => handleFieldChange('additionalAmount', e.target.value)} />
                <span className="text-[10px] text-gray-500 mt-2 whitespace-nowrap">(per pay period)</span>
              </div>
              
              <FormInput label="Start Date" type="date" value={activeRecord.startDate || ""} onChange={(e) => handleFieldChange('startDate', e.target.value)} />
              <FormInput label="End Date" type="date" value={activeRecord.endDate || ""} onChange={(e) => handleFieldChange('endDate', e.target.value)} />

              <div className="mt-6 border border-[#a2b5ca] rounded-lg p-3 relative bg-gray-50/30">
                <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] font-bold text-[#0066cc]">Pennsylvania</span>
                <div className="space-y-1 mt-2">
                  <FormInput label="Resident PSD Code" value={activeRecord.residentPsdCode || ""} onChange={(e) => handleFieldChange('residentPsdCode', e.target.value)} />
                  <FormInput label="Worksite PSD Code" value={activeRecord.worksitePsdCode || ""} onChange={(e) => handleFieldChange('worksitePsdCode', e.target.value)} />
                  <FormInput label="Local Tax PSD Code" value={activeRecord.localTaxPsdCode || ""} onChange={(e) => handleFieldChange('localTaxPsdCode', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalTaxes;
