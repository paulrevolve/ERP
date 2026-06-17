import React, { useState } from "react";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormInput } from "../helper/formSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const ProjRevCalcValDirCostCeil = ({ data, onChange, handleClose }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  
  const currentKey = getRowKey(data);
  const listData = data.dirCostCeilings || [];

  const handleFieldChange = (field, value, targetId = null) => {
    if (listData.length === 0) {
      const newItem = { tempId: `NEW_DCC_${Date.now()}`, [field]: value, isDirty: true };
      onChange(currentKey, "dirCostCeilings", [newItem]);
      setSelectedRow(newItem);
      setSelectedIds(new Set([newItem.tempId]));
      return;
    }
    const id = targetId || getRowKey(selectedRow) || getRowKey(listData[0]);
    const updatedList = listData.map(item => getRowKey(item) === id ? { ...item, [field]: value, isDirty: true } : item);
    onChange(currentKey, "dirCostCeilings", updatedList);
    if (selectedRow && getRowKey(selectedRow) === id) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newItem = { tempId: `NEW_DCC_${Date.now()}`, isDirty: true };
    const updatedList = [newItem, ...listData];
    onChange(currentKey, "dirCostCeilings", updatedList);
    setSelectedRow(newItem);
    setSelectedIds(new Set([newItem.tempId]));
    setIsFormView(true);
  };

  const handleDelete = () => {
    const updatedList = listData.filter(item => !selectedIds.has(getRowKey(item)));
    onChange(currentKey, "dirCostCeilings", updatedList);
    setSelectedIds(new Set());
    if (selectedIds.has(getRowKey(selectedRow))) {
      setSelectedRow(null);
    }
  };

  const activeItem = selectedRow || listData[0] || {};

  const columns = [
    { value: "account", label: "Account *", key: "account" },
    { value: "accountName", label: "Account Name", key: "accountName" },
    { value: "ceilingAmt", label: "Functional Currency Ceiling Amount *", key: "ceilingAmt" },
    { value: "applyTo", label: "Apply to R/B/A *", key: "applyTo" }
  ];

  return (
    <SecondaryContainer title="Identification > Direct Cost Ceilings" handleClose={handleClose}>
      <Toolbar
        isFormView={isFormView}
        actions={{
          onAdd: handleAdd,
          onDelete: handleDelete,
          onToggleView: () => setIsFormView(!isFormView),
          onSave: () => {},
          onClear: () => {},
          onCopy: () => {},
          onPaste: () => {}
        }}
        buttonsDisable={["Save", "Clear", "Copy", "Paste", "Find/Replace"]}
      />
      
      {!isFormView ? (
        <div className="p-2">
          <ReusableTable
            data={listData}
            columns={columns}
            selectedRows={selectedIds}
            onRowSelect={(row) => {
              const id = getRowKey(row);
              const newSet = new Set(selectedIds);
              if (newSet.has(id)) newSet.delete(id);
              else newSet.add(id);
              setSelectedIds(newSet);
              setSelectedRow(row);
            }}
            rowKey={getRowKey}
            maxHeight="max-h-64"
          />
        </div>
      ) : (
        <div className="space-y-4 p-4 bg-gray-50 border border-gray-100 rounded mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <FormInput label="Account *" value={activeItem.account || ""} onChange={(e) => handleFieldChange("account", e.target.value)} isLookup />
            </div>
            <div className="lg:col-span-4">
              <FormInput label="Account Name" value={activeItem.accountName || ""} onChange={(e) => handleFieldChange("accountName", e.target.value)} />
            </div>
            <div className="lg:col-span-4">
              <FormInput label="Functional Currency Ceiling Amount *" value={activeItem.ceilingAmt || ""} onChange={(e) => handleFieldChange("ceilingAmt", e.target.value)} />
            </div>
            <div className="lg:col-span-4">
              <FormInput label="Apply to R/B/A *" value={activeItem.applyTo || ""} onChange={(e) => handleFieldChange("applyTo", e.target.value)} isLookup />
            </div>
          </div>
        </div>
      )}
    </SecondaryContainer>
  );
};

export default ProjRevCalcValDirCostCeil;
