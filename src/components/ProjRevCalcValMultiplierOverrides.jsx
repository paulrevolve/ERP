import React, { useState } from "react";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const ProjRevCalcValMultiplierOverrides = ({ data, onChange, handleClose }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  
  const currentKey = getRowKey(data);
  const listData = data.multiplierOverrides || [];

  const handleFieldChange = (rowId, field, value) => {
    const updatedList = listData.map(item => getRowKey(item) === rowId ? { ...item, [field]: value, isDirty: true } : item);
    onChange(currentKey, "multiplierOverrides", updatedList);
    if (selectedRow && getRowKey(selectedRow) === rowId) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newItem = { tempId: `NEW_MO_${Date.now()}`, isDirty: true };
    const updatedList = [newItem, ...listData];
    onChange(currentKey, "multiplierOverrides", updatedList);
    setSelectedRow(newItem);
    setSelectedIds(new Set([newItem.tempId]));
  };

  const handleDelete = () => {
    const updatedList = listData.filter(item => !selectedIds.has(getRowKey(item)));
    onChange(currentKey, "multiplierOverrides", updatedList);
    setSelectedIds(new Set());
    if (selectedIds.has(getRowKey(selectedRow))) {
      setSelectedRow(null);
    }
  };

  const columns = [
    { value: "startAccount", label: "Starting Account *", key: "startAccount" },
    { value: "endAccount", label: "Ending Account *", key: "endAccount" },
    { value: "multiplier", label: "Multiplier *", key: "multiplier" },
    { value: "applyTo", label: "Apply to R/B/G/A *", key: "applyTo" }
  ];

  return (
    <SecondaryContainer title="Identification > Multiplier Overrides" handleClose={handleClose}>
      <Toolbar
        isFormView={false}
        actions={{
          onAdd: handleAdd,
          onDelete: handleDelete,
          onSave: () => {},
          onCopy: () => {},
          onPaste: () => {}
        }}
        buttonsDisable={["Clear", "Find/Replace", "ToggleView"]}
      />
      
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
          onFieldChange={handleFieldChange}
          rowKey={getRowKey}
          maxHeight="max-h-64"
        />
      </div>
    </SecondaryContainer>
  );
};

export default ProjRevCalcValMultiplierOverrides;
