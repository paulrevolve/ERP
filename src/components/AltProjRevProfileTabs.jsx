import React, { useState } from "react";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormInput } from "../helper/formSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const createTabComponent = (title, dataKey, columns, formFields) => {
  return ({ data, onChange, handleClose }) => {
    const [isFormView, setIsFormView] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [selectedRow, setSelectedRow] = useState(null);
    
    const currentKey = getRowKey(data);
    const listData = data[dataKey] || [];

    const handleFieldChange = (field, value, targetId = null) => {
      const id = targetId || getRowKey(selectedRow);
      const updatedList = listData.map(item => getRowKey(item) === id ? { ...item, [field]: value, isDirty: true } : item);
      onChange(currentKey, dataKey, updatedList);
      if (selectedRow && getRowKey(selectedRow) === id) {
        setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
      }
    };

    const handleAdd = () => {
      const newItem = { tempId: `NEW_${Date.now()}`, isDirty: true };
      const updatedList = [newItem, ...listData];
      onChange(currentKey, dataKey, updatedList);
      setSelectedRow(newItem);
      setSelectedIds(new Set([newItem.tempId]));
      setIsFormView(true);
    };

    const handleDelete = () => {
      const updatedList = listData.filter(item => !selectedIds.has(getRowKey(item)));
      onChange(currentKey, dataKey, updatedList);
      setSelectedIds(new Set());
      if (selectedIds.has(getRowKey(selectedRow))) {
        setSelectedRow(null);
      }
    };

    const activeItem = selectedRow || listData[0] || {};

    return (
      <SecondaryContainer title={title} handleClose={handleClose}>
        <Toolbar
          isFormView={isFormView}
          toggleView={() => setIsFormView(!isFormView)}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onSave={() => { /* Implement Save */ }}
          onClear={() => { /* Implement Clear */ }}
          disableSave={true}
          disableClear={true}
          disableCopy={true}
          disablePaste={true}
          disableFindReplace={true}
          showFindReplace={false}
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
            {activeItem.tempId === undefined && listData.length === 0 ? (
              <div className="text-center text-gray-500">Select an item or add a new one.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formFields.map(field => (
                  <FormInput
                    key={field.key}
                    label={field.label}
                    type={field.type || "text"}
                    value={activeItem[field.key] || ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.type === 'checkbox' ? (e.target.checked ? "Y" : "N") : e.target.value)}
                    checked={field.type === 'checkbox' ? activeItem[field.key] === "Y" : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </SecondaryContainer>
    );
  };
};

export const RevenueInfoTab = createTabComponent(
  "Revenue Info", 
  "revenueInfo",
  [
    { value: "revFormula", label: "Revenue Formula", key: "revFormula" },
    { value: "revAdj", label: "Revenue Adjustment", key: "revAdj" },
  ],
  [
    { label: "Revenue Formula", key: "revFormula" },
    { label: "Revenue Adjustment", key: "revAdj" }
  ]
);

export const DirCostCeilTab = createTabComponent(
  "Direct Cost Ceilings", 
  "dirCostCeils",
  [
    { value: "costPool", label: "Cost Pool", key: "costPool" },
    { value: "account", label: "Account", key: "account" },
    { value: "ceilingAmt", label: "Ceiling Amount", key: "ceilingAmt" }
  ],
  [
    { label: "Cost Pool", key: "costPool" },
    { label: "Account", key: "account" },
    { label: "Ceiling Amount", key: "ceilingAmt" }
  ]
);

export const DirHrsCeilTab = createTabComponent(
  "Direct Hours Ceilings", 
  "dirHrsCeils",
  [
    { value: "laborCat", label: "Labor Category", key: "laborCat" },
    { value: "hoursCeil", label: "Hours Ceiling", key: "hoursCeil" }
  ],
  [
    { label: "Labor Category", key: "laborCat" },
    { label: "Hours Ceiling", key: "hoursCeil" }
  ]
);

export const EmplHrsCeilTab = createTabComponent(
  "Employee Hours Ceilings", 
  "emplHrsCeils",
  [
    { value: "employeeId", label: "Employee ID", key: "employeeId" },
    { value: "hoursCeil", label: "Hours Ceiling", key: "hoursCeil" }
  ],
  [
    { label: "Employee ID", key: "employeeId" },
    { label: "Hours Ceiling", key: "hoursCeil" }
  ]
);

export const VendHrsCeilTab = createTabComponent(
  "Vendor Hours Ceilings", 
  "vendHrsCeils",
  [
    { value: "vendorId", label: "Vendor ID", key: "vendorId" },
    { value: "hoursCeil", label: "Hours Ceiling", key: "hoursCeil" }
  ],
  [
    { label: "Vendor ID", key: "vendorId" },
    { label: "Hours Ceiling", key: "hoursCeil" }
  ]
);
