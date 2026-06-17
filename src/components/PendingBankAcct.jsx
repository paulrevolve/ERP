import React, { useState } from "react";
import { FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Toolbar } from "../helper/container";

export const pendingBankColumns = [
  { value: "rank", label: "Rank *", key: "rank" },
  { value: "bank", label: "Bank *", key: "bank" },
  { value: "bankAccountNumber", label: "Bank Account Number *", key: "bankAccountNumber" },
  { value: "achTransCode", label: "ACH Trans Code *", key: "achTransCode" },
  { value: "accountType", label: "Account Type *", key: "accountType" },
  { value: "method", label: "Method *", key: "method" },
  { value: "percentOrAmount", label: "Percent or Amount *", key: "percentOrAmount" }
];

const PendingBankAcct = ({ data, onChange, currentKey }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [localIndex, setLocalIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const records = data.pendingBankRecords || [];
  const activeRecord = records[localIndex] || {};

  const getRowKey = (row) => String(row?.tempId || row?.id || row?.rank || "");

  const handleToggleView = () => setIsFormView(!isFormView);

  const handleAdd = () => {
    const newRecord = { isDirty: true, tempId: `NEW_PENDINGBANK_${Date.now()}` };
    const updated = [...records, newRecord];
    onChange(currentKey, 'pendingBankRecords', updated);
    setLocalIndex(updated.length - 1);
  };

  const handleDelete = () => {
    if (selectedRows.size > 0) {
      if (window.confirm("Are you sure you want to delete selected records?")) {
        const updated = records.filter(r => !selectedRows.has(getRowKey(r)));
        onChange(currentKey, 'pendingBankRecords', updated);
        setSelectedRows(new Set());
      }
    }
  };

  const handleClear = () => {
    if (window.confirm("Discard changes?")) {
        const cleaned = records.filter(r => !String(getRowKey(r)).startsWith("NEW_")).map(r => ({...r, isDirty: false}));
        onChange(currentKey, 'pendingBankRecords', cleaned);
    }
  };

  const handleSave = () => {
    const updated = records.map(r => ({...r, isDirty: false}));
    onChange(currentKey, 'pendingBankRecords', updated);
  };

  const handleFieldChange = (field, value) => {
    const updated = [...records];
    if (updated.length === 0) {
      updated.push({ [field]: value, isDirty: true });
      setLocalIndex(0);
    } else {
      updated[localIndex] = { ...updated[localIndex], [field]: value, isDirty: true };
    }
    onChange(currentKey, 'pendingBankRecords', updated);
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
    onChange(currentKey, 'pendingBankRecords', updated);
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
            columns={pendingBankColumns} 
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
            <div className="space-y-1">
              <FormInput label="Rank *" type="select" options={[]} value={activeRecord.rank || ""} onChange={(e) => handleFieldChange('rank', e.target.value)} />
              
              <div className="flex items-center gap-2">
                <FormInput label="Bank *" value={activeRecord.bank || ""} onChange={(e) => handleFieldChange('bank', e.target.value)} />
                <div className="w-1/2 pt-6">
                  <input type="text" className="w-full border border-gray-300 rounded px-2 py-1 text-[11px] bg-gray-100" readOnly />
                </div>
              </div>

              <FormInput label="Bank Account Number *" value={activeRecord.bankAccountNumber || ""} onChange={(e) => handleFieldChange('bankAccountNumber', e.target.value)} />
              <FormInput label="ACH Trans Code *" type="select" options={[]} value={activeRecord.achTransCode || ""} onChange={(e) => handleFieldChange('achTransCode', e.target.value)} />
              <FormInput label="Account Type *" type="select" options={[{value: "Payroll", label: "Payroll"}]} value={activeRecord.accountType || "Payroll"} onChange={(e) => handleFieldChange('accountType', e.target.value)} />
              
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <FormInput label="Method *" type="select" options={[]} value={activeRecord.method || ""} onChange={(e) => handleFieldChange('method', e.target.value)} />
                </div>
                <button className="px-3 py-1 bg-white text-[#0066cc] border border-[#0066cc] rounded text-[10px] font-bold hover:bg-[#e6f0fa] transition-colors mb-0.5">
                  Load Current Setup
                </button>
              </div>

              <FormInput label="Percent or Amount *" value={activeRecord.percentOrAmount || ""} onChange={(e) => handleFieldChange('percentOrAmount', e.target.value)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingBankAcct;
