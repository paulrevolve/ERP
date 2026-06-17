import React, { useState } from "react";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormInput } from "../helper/formSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const VendHrsCeilTab = ({ data, onChange, handleClose }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  
  const currentKey = getRowKey(data);
  const listData = data.vendHrsCeils || [];

  const handleFieldChange = (field, value, targetId = null) => {
    if (listData.length === 0) {
      const newItem = { tempId: `NEW_${Date.now()}`, [field]: value, isDirty: true };
      onChange(currentKey, "vendHrsCeils", [newItem]);
      setSelectedRow(newItem);
      setSelectedIds(new Set([newItem.tempId]));
      return;
    }
    const id = targetId || getRowKey(selectedRow) || getRowKey(listData[0]);
    const updatedList = listData.map(item => getRowKey(item) === id ? { ...item, [field]: value, isDirty: true } : item);
    onChange(currentKey, "vendHrsCeils", updatedList);
    if (selectedRow && getRowKey(selectedRow) === id) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newItem = { tempId: `NEW_${Date.now()}`, isDirty: true };
    const updatedList = [newItem, ...listData];
    onChange(currentKey, "vendHrsCeils", updatedList);
    setSelectedRow(newItem);
    setSelectedIds(new Set([newItem.tempId]));
    setIsFormView(true);
  };

  const handleDelete = () => {
    const updatedList = listData.filter(item => !selectedIds.has(getRowKey(item)));
    onChange(currentKey, "vendHrsCeils", updatedList);
    setSelectedIds(new Set());
    if (selectedIds.has(getRowKey(selectedRow))) {
      setSelectedRow(null);
    }
  };

  const activeItem = selectedRow || listData[0] || {};

  const columns = [
    { value: "vendorId", label: "Vendor ID", key: "vendorId" },
    { value: "hoursCeil", label: "Hours Ceiling", key: "hoursCeil" }
  ];

  return (
    <SecondaryContainer title="Vendor Hours Ceilings" handleClose={handleClose}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Vendor ID"
              value={activeItem.vendorId || ""}
              onChange={(e) => handleFieldChange("vendorId", e.target.value)}
            />
            <FormInput
              label="Hours Ceiling"
              value={activeItem.hoursCeil || ""}
              onChange={(e) => handleFieldChange("hoursCeil", e.target.value)}
            />
          </div>
        </div>
      )}
    </SecondaryContainer>
  );
};

export default VendHrsCeilTab;
