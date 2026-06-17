import React, { useState } from "react";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const ProjRevCalcValEmplHrsCeil = ({ data, onChange, handleClose }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  
  const currentKey = getRowKey(data);
  const listData = data.emplHrsCeilings || [];

  const handleFieldChange = (rowId, field, value) => {
    const updatedList = listData.map(item => getRowKey(item) === rowId ? { ...item, [field]: value, isDirty: true } : item);
    onChange(currentKey, "emplHrsCeilings", updatedList);
    if (selectedRow && getRowKey(selectedRow) === rowId) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newItem = { tempId: `NEW_EHC_${Date.now()}`, isDirty: true };
    const updatedList = [newItem, ...listData];
    onChange(currentKey, "emplHrsCeilings", updatedList);
    setSelectedRow(newItem);
    setSelectedIds(new Set([newItem.tempId]));
  };

  const handleDelete = () => {
    const updatedList = listData.filter(item => !selectedIds.has(getRowKey(item)));
    onChange(currentKey, "emplHrsCeilings", updatedList);
    setSelectedIds(new Set());
    if (selectedIds.has(getRowKey(selectedRow))) {
      setSelectedRow(null);
    }
  };

  const columns = [
    { value: "employee", label: "Employee *", key: "employee" },
    { value: "employeeName", label: "Employee Name", key: "employeeName" },
    { value: "laborCategory", label: "Labor Category *", key: "laborCategory" },
    { value: "hoursCeiling", label: "Hours Ceiling", key: "hoursCeiling" }
  ];

  return (
    <SecondaryContainer title="Identification > Employee Hours Ceilings" handleClose={handleClose}>
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

export default ProjRevCalcValEmplHrsCeil;
