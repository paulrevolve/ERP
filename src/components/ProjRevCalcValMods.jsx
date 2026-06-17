import React, { useState } from "react";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormInput } from "../helper/formSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const ProjRevCalcValMods = ({ data, onChange, handleClose }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  
  const currentKey = getRowKey(data);
  const listData = data.modifications || [];

  const handleFieldChange = (field, value, targetId = null) => {
    if (listData.length === 0) {
      const newItem = { tempId: `NEW_MOD_${Date.now()}`, [field]: value, isDirty: true };
      onChange(currentKey, "modifications", [newItem]);
      setSelectedRow(newItem);
      setSelectedIds(new Set([newItem.tempId]));
      return;
    }
    const id = targetId || getRowKey(selectedRow) || getRowKey(listData[0]);
    const updatedList = listData.map(item => getRowKey(item) === id ? { ...item, [field]: value, isDirty: true } : item);
    onChange(currentKey, "modifications", updatedList);
    if (selectedRow && getRowKey(selectedRow) === id) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newItem = { tempId: `NEW_MOD_${Date.now()}`, isDirty: true };
    const updatedList = [newItem, ...listData];
    onChange(currentKey, "modifications", updatedList);
    setSelectedRow(newItem);
    setSelectedIds(new Set([newItem.tempId]));
    setIsFormView(true);
  };

  const handleDelete = () => {
    const updatedList = listData.filter(item => !selectedIds.has(getRowKey(item)));
    onChange(currentKey, "modifications", updatedList);
    setSelectedIds(new Set());
    if (selectedIds.has(getRowKey(selectedRow))) {
      setSelectedRow(null);
    }
  };

  const activeItem = selectedRow || listData[0] || {};

  const columns = [
    { value: "modId", label: "Modification ID", key: "modId" },
    { value: "modDesc", label: "Description *", key: "modDesc" },
    { value: "effectiveDate", label: "Effective Date *", key: "effectiveDate" },
    // Period Of Performance
    { value: "startDate", label: "Start Date", key: "startDate" },
    { value: "endDate", label: "End Date", key: "endDate" },
    { value: "earliest", label: "Earliest", key: "earliest" },
    { value: "latest", label: "Latest", key: "latest" },
    // Value Modifications
    { value: "valModValue", label: "Value (Value Mod)", key: "valModValue" },
    { value: "valModFeePct", label: "Fee% (Value Mod)", key: "valModFeePct" },
    { value: "valModCurCost", label: "Current Cost (Value)", key: "valModCurCost" },
    { value: "valModCurFee", label: "Current Fee (Value)", key: "valModCurFee" },
    { value: "valModCumCost", label: "Cumulative Cost (Value)", key: "valModCumCost" },
    { value: "valModCumFee", label: "Cumulative Fee (Value)", key: "valModCumFee" },
    // Funding Modifications
    { value: "fundModValue", label: "Value (Fund Mod)", key: "fundModValue" },
    { value: "fundModFeePct", label: "Fee% (Fund Mod)", key: "fundModFeePct" },
    { value: "fundModCurCost", label: "Current Cost (Fund)", key: "fundModCurCost" },
    { value: "fundModCurFee", label: "Current Fee (Fund)", key: "fundModCurFee" },
    { value: "fundModCumCost", label: "Cumulative Cost (Fund)", key: "fundModCumCost" },
    { value: "fundModCumFee", label: "Cumulative Fee (Fund)", key: "fundModCumFee" }
  ];

  const renderRow = (label, pfx, sfxs) => (
    <div className="flex items-center gap-2 py-1">
      <span className="text-[10px] text-gray-700 w-1/4 text-right pr-2">{label}</span>
      {sfxs.map((sfx, idx) => (
        <input 
          key={idx}
          type="text" 
          className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]" 
          value={activeItem[`${pfx}${sfx}`] || ""} 
          onChange={(e) => handleFieldChange(`${pfx}${sfx}`, e.target.value)} 
        />
      ))}
    </div>
  );

  return (
    <SecondaryContainer title="Identification > Modifications" handleClose={handleClose}>
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
          {/* Top Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3">
              <FormInput label="Modification ID" value={activeItem.modId || "0000"} onChange={(e) => handleFieldChange("modId", e.target.value)} />
            </div>
            <div className="lg:col-span-6">
              <FormInput label="Description *" value={activeItem.modDesc || ""} onChange={(e) => handleFieldChange("modDesc", e.target.value)} />
            </div>
            <div className="lg:col-span-3">
              <FormInput label="Effective Date *" value={activeItem.effectiveDate || ""} onChange={(e) => handleFieldChange("effectiveDate", e.target.value)} isDate />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Period Of Performance */}
            <div className="lg:col-span-3 border border-gray-200 rounded p-2 relative mt-4">
              <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Period Of Performance</div>
              <div className="space-y-2 mt-2">
                <FormInput label="Start Date" value={activeItem.startDate || ""} onChange={(e) => handleFieldChange("startDate", e.target.value)} isDate />
                <FormInput label="End Date" value={activeItem.endDate || ""} onChange={(e) => handleFieldChange("endDate", e.target.value)} isDate />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-700 w-1/3">Earliest</span>
                  <input type="text" className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px] bg-gray-200" disabled value={activeItem.earliest || ""} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-700 w-1/3">Latest</span>
                  <input type="text" className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px] bg-gray-200" disabled value={activeItem.latest || ""} />
                </div>
              </div>
            </div>

            {/* Value Modifications */}
            <div className="lg:col-span-4 border border-gray-200 rounded p-2 relative mt-4">
              <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Value Modifications</div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-700 w-1/6">Value</span>
                  <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={activeItem.valModValue || ""} onChange={(e) => handleFieldChange("valModValue", e.target.value)} />
                  <span className="text-[10px] text-gray-700 w-1/6 text-right">Fee%</span>
                  <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={activeItem.valModFeePct || ""} onChange={(e) => handleFieldChange("valModFeePct", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] text-gray-600 font-bold mt-2">
                  <div className="ml-[20%]">Current</div>
                  <div>Cumulative</div>
                </div>
                {renderRow("Cost", "valMod", ["CurCost", "CumCost"])}
                {renderRow("Fee", "valMod", ["CurFee", "CumFee"])}
              </div>
            </div>

            {/* Funding Modifications */}
            <div className="lg:col-span-5 border border-gray-200 rounded p-2 relative mt-4">
              <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Funding Modifications</div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-700 w-1/6">Value</span>
                  <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={activeItem.fundModValue || ""} onChange={(e) => handleFieldChange("fundModValue", e.target.value)} />
                  <span className="text-[10px] text-gray-700 w-1/6 text-right">Fee%</span>
                  <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={activeItem.fundModFeePct || ""} onChange={(e) => handleFieldChange("fundModFeePct", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] text-gray-600 font-bold mt-2">
                  <div className="ml-[20%]">Current</div>
                  <div>Cumulative</div>
                </div>
                {renderRow("Cost", "fundMod", ["CurCost", "CumCost"])}
                {renderRow("Fee", "fundMod", ["CurFee", "CumFee"])}
              </div>
            </div>
          </div>
        </div>
      )}
    </SecondaryContainer>
  );
};

export default ProjRevCalcValMods;
