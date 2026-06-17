import React, { useState } from "react";
import { FormInput } from "../helper/formSection";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || row.modId || "") : "";

const AltProjRevProfileMods = ({ data, onChange, handleClose }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  
  const currentKey = getRowKey(data);
  const mods = data.modifications || [];

  const handleModChange = (field, value, targetModId = null) => {
    if (mods.length === 0) {
      const newItem = { tempId: `NEW_${Date.now()}`, [field]: value, isDirty: true };
      onChange(currentKey, "modifications", [newItem]);
      setSelectedRow(newItem);
      setSelectedIds(new Set([newItem.tempId]));
      return;
    }
    const targetId = targetModId || getRowKey(selectedRow) || getRowKey(mods[0]);
    const updatedMods = mods.map(m => getRowKey(m) === targetId ? { ...m, [field]: value, isDirty: true } : m);
    onChange(currentKey, "modifications", updatedMods);
    if (selectedRow && getRowKey(selectedRow) === targetId) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newMod = { tempId: `NEW_${Date.now()}`, modId: "", modDesc: "", isDirty: true };
    const updatedMods = [newMod, ...mods];
    onChange(currentKey, "modifications", updatedMods);
    setSelectedRow(newMod);
    setSelectedIds(new Set([newMod.tempId]));
    setIsFormView(true);
  };

  const handleDelete = () => {
    const updatedMods = mods.filter(m => !selectedIds.has(getRowKey(m)));
    onChange(currentKey, "modifications", updatedMods);
    setSelectedIds(new Set());
    if (selectedIds.has(getRowKey(selectedRow))) {
      setSelectedRow(null);
    }
  };

  const activeMod = selectedRow || mods[0] || {};

  const modColumns = [
    { value: "modId", label: "Modification ID", key: "modId" },
    { value: "modDesc", label: "Description", key: "modDesc" },
    { value: "modEffDate", label: "Effective Date", key: "modEffDate" },
    { value: "modDelFlag", label: "Delete Flag", key: "modDelFlag" },
    { value: "modRecordStatus", label: "Record Status", key: "modRecordStatus" },
    { value: "modStartDateProdVal", label: "Start Date Prod Val", key: "modStartDateProdVal" },
    { value: "modStartDateAltOvr", label: "Start Date Alt Ovr", key: "modStartDateAltOvr" },
    { value: "modEndDateProdVal", label: "End Date Prod Val", key: "modEndDateProdVal" },
    { value: "modEndDateAltOvr", label: "End Date Alt Ovr", key: "modEndDateAltOvr" },
    { value: "modTotalValProdVal", label: "Total Value Prod Val", key: "modTotalValProdVal" },
    { value: "modTotalValAltOvr", label: "Total Value Alt Ovr", key: "modTotalValAltOvr" },
    { value: "modValCostProdVal", label: "Value Cost Prod Val", key: "modValCostProdVal" },
    { value: "modValCostAltOvr", label: "Value Cost Alt Ovr", key: "modValCostAltOvr" },
    { value: "modValFeeProdVal", label: "Value Fee Prod Val", key: "modValFeeProdVal" },
    { value: "modValFeeAltOvr", label: "Value Fee Alt Ovr", key: "modValFeeAltOvr" },
    { value: "modValFeePctProdVal", label: "Value Fee % Prod Val", key: "modValFeePctProdVal" },
    { value: "modValFeePctAltOvr", label: "Value Fee % Alt Ovr", key: "modValFeePctAltOvr" },
    { value: "modTotFundProdVal", label: "Total Funded Prod Val", key: "modTotFundProdVal" },
    { value: "modTotFundAltOvr", label: "Total Funded Alt Ovr", key: "modTotFundAltOvr" },
    { value: "modFundCostProdVal", label: "Funded Cost Prod Val", key: "modFundCostProdVal" },
    { value: "modFundCostAltOvr", label: "Funded Cost Alt Ovr", key: "modFundCostAltOvr" },
    { value: "modFundFeeProdVal", label: "Funded Fee Prod Val", key: "modFundFeeProdVal" },
    { value: "modFundFeeAltOvr", label: "Funded Fee Alt Ovr", key: "modFundFeeAltOvr" },
    { value: "modFundFeePctProdVal", label: "Funded Fee % Prod Val", key: "modFundFeePctProdVal" },
    { value: "modFundFeePctAltOvr", label: "Funded Fee % Alt Ovr", key: "modFundFeePctAltOvr" },
  ];

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
        showFindReplace={false}
      />
      
      {!isFormView ? (
        <div className="p-2">
          <ReusableTable
            data={mods}
            columns={modColumns}
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
        <div className="space-y-4 p-2 bg-gray-50 border border-gray-100 rounded mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Modification ID" value={activeMod.modId || ""} onChange={(e) => handleModChange('modId', e.target.value)} />
            <FormInput label="Description" value={activeMod.modDesc || ""} onChange={(e) => handleModChange('modDesc', e.target.value)} />
            <FormInput label="Effective Date" type="date" value={activeMod.modEffDate || ""} onChange={(e) => handleModChange('modEffDate', e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#17414d]" checked={activeMod.modDelFlag === "Y"} onChange={(e) => handleModChange('modDelFlag', e.target.checked ? "Y" : "N")} />
              <label className="text-[10px] font-bold text-gray-700">Delete this modification for Alternate Revenue Profile</label>
            </div>
            <FormInput label="Record Status" value={activeMod.modRecordStatus || ""} onChange={(e) => handleModChange('modRecordStatus', e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div>
              <table className="w-full text-[10px] text-left">
                <thead>
                  <tr>
                    <th className="py-1">Field</th>
                    <th className="py-1">Production Value</th>
                    <th className="py-1">Alternate Profile Override</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Start Date", pfx: "modStartDate" },
                    { label: "End Date", pfx: "modEndDate" },
                    { label: "Total Value", pfx: "modTotalVal" },
                    { label: "Value Cost", pfx: "modValCost" },
                    { label: "Value Fee", pfx: "modValFee" },
                    { label: "Value Fee %", pfx: "modValFeePct" }
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-1">{row.label}</td>
                      <td className="py-1"><input type="text" className="border px-1 border-gray-300 rounded w-24 outline-none" value={activeMod[`${row.pfx}ProdVal`] || ""} onChange={(e) => handleModChange(`${row.pfx}ProdVal`, e.target.value)} /></td>
                      <td className="py-1"><input type="text" className="border px-1 border-gray-300 rounded w-24 outline-none" value={activeMod[`${row.pfx}AltOvr`] || ""} onChange={(e) => handleModChange(`${row.pfx}AltOvr`, e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full text-[10px] text-left">
                <thead>
                  <tr>
                    <th className="py-1">Field</th>
                    <th className="py-1">Production Value</th>
                    <th className="py-1">Alternate Profile Override</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Total Funded", pfx: "modTotFund" },
                    { label: "Funded Cost", pfx: "modFundCost" },
                    { label: "Funded Fee", pfx: "modFundFee" },
                    { label: "Funded Fee %", pfx: "modFundFeePct" }
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-1">{row.label}</td>
                      <td className="py-1"><input type="text" className="border px-1 border-gray-300 rounded w-24 outline-none" value={activeMod[`${row.pfx}ProdVal`] || ""} onChange={(e) => handleModChange(`${row.pfx}ProdVal`, e.target.value)} /></td>
                      <td className="py-1"><input type="text" className="border px-1 border-gray-300 rounded w-24 outline-none" value={activeMod[`${row.pfx}AltOvr`] || ""} onChange={(e) => handleModChange(`${row.pfx}AltOvr`, e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </SecondaryContainer>
  );
};

export default AltProjRevProfileMods;
