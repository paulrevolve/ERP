import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormInput } from "../helper/formSection";
import AltRevProfilePriorYearDetails from "./AltRevProfilePriorYearDetails";
import { toast } from "react-toastify";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const ManageAltRevProfilePriorYearHistory = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRowKey, setSelectedRowKey] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [clipboard, setClipboard] = useState([]);

  const tableColumns = [
    { value: "fiscalYear", label: "Fiscal Year", key: "fiscalYear" },
    { value: "project", label: "Project", key: "project" },
    { value: "organization", label: "Organization", key: "organization" },
    { value: "ruleType", label: "Rule Type", key: "ruleType" },
    { value: "active", label: "Active", key: "active", type: "flag" },
    { value: "allowCharging", label: "Allow Charging", key: "allowCharging", type: "flag" }
  ];

  const handleFieldChange = (rowId, field, value) => {
    const updated = profiles.map(p => getRowKey(p) === rowId ? { ...p, [field]: value, isDirty: true } : p);
    setProfiles(updated);
    if (selectedRow && getRowKey(selectedRow) === rowId) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newRecord = { tempId: `NEW_${Date.now()}`, isDirty: true, details: [] };
    const updated = [newRecord, ...profiles];
    setProfiles(updated);
    setSelectedRow(newRecord);
    setSelectedRowKey(newRecord.tempId);
    setSelectedIds(new Set([newRecord.tempId]));
    setIsFormView(true);
  };

  const handleDelete = () => {
    if (!selectedRow) return toast.warn("Select a record to delete");
    const updated = profiles.filter(p => getRowKey(p) !== getRowKey(selectedRow));
    setProfiles(updated);
    setSelectedRow(null);
    setSelectedRowKey("");
    toast.success("Deleted successfully");
  };

  const handleFindReplace = (targetColumn, findValue, replaceValue) => {
    if (!findValue) return toast.warn("Enter a value to find.");
    let count = 0;
    const updated = profiles.map(profile => {
      const val = String(profile[targetColumn] || "");
      if (val.toLowerCase().includes(findValue.toLowerCase())) {
        count++;
        return { ...profile, [targetColumn]: replaceValue, isDirty: true };
      }
      return profile;
    });
    if (count > 0) {
      setProfiles(updated);
      toast.success(`Replaced ${count} occurrences in ${targetColumn}.`);
    } else {
      toast.info("No matches found.");
    }
  };

  const renderFormView = () => {
    const item = selectedRow || {};
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 space-y-2">
            <FormInput label="Fiscal Year" value={item.fiscalYear || ""} onChange={(e) => handleFieldChange(getRowKey(item), "fiscalYear", e.target.value)} isLookup />
            <FormInput label="Project" value={item.project || ""} onChange={(e) => handleFieldChange(getRowKey(item), "project", e.target.value)} isLookup />
            <FormInput label="Organization" value={item.organization || ""} onChange={(e) => handleFieldChange(getRowKey(item), "organization", e.target.value)} isLookup />
          </div>
          
          <div className="lg:col-span-4 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <FormInput label="Rule Type" value={item.ruleType || ""} onChange={(e) => handleFieldChange(getRowKey(item), "ruleType", e.target.value)} />
              </div>
              <div className="flex-1 mt-5">
                <input type="text" className="border border-gray-300 rounded w-full px-2 py-1 outline-none text-[10px]" value={item.ruleTypeDesc || ""} onChange={(e) => handleFieldChange(getRowKey(item), "ruleTypeDesc", e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#17414d]" checked={item.active === "Y"} onChange={(e) => handleFieldChange(getRowKey(item), "active", e.target.checked ? "Y" : "N")} />
                <label className="text-[10px] font-bold text-gray-700">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#17414d]" checked={item.allowCharging === "Y"} onChange={(e) => handleFieldChange(getRowKey(item), "allowCharging", e.target.checked ? "Y" : "N")} />
                <label className="text-[10px] font-bold text-gray-700">Allow Charging</label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-2">
            <div className="flex gap-2 items-center">
               <FormInput label="Include Project level" value={item.includeProjectLevel || ""} onChange={(e) => handleFieldChange(getRowKey(item), "includeProjectLevel", e.target.value)} />
               <span className="text-[10px] font-bold text-gray-700 pt-5">and below</span>
            </div>
            <div>
               <button className="text-[10px] font-bold text-[#17414d] border border-[#17414d] rounded px-2 py-1 mt-2 hover:bg-[#17414d] hover:text-white transition-colors">
                 Load all records from production table
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 mt-4">
          {[
            { label: "Total Direct Allowed Amount", labelAlt: "Alt Profile Total Direct Allowed Amount", key: "totDirAllowAmt" },
            { label: "Total Indirect Allowed Amount", labelAlt: "Alt Profile Total Indirect Allowed Amount", key: "totIndirAllowAmt" },
            { label: "Total Cost", labelAlt: "Alt Profile Total Cost", key: "totCost" },
            { label: "Total Adjustments to Revenue", labelAlt: "Alt Profile Total Adjustments to Revenue", key: "totAdjRev" },
            { label: "Total Revenue", labelAlt: "Alt Profile Total Revenue", key: "totRev" },
            { label: "Award Fee Revenue", labelAlt: "Alt Profile Award Fee Revenue", key: "awardFeeRev" }
          ].map((field, idx) => (
            <React.Fragment key={idx}>
              <div className="flex justify-between items-center gap-4">
                <span className="text-[10px] text-gray-700 w-1/2 text-right">{field.label}</span>
                <input type="text" className="border border-gray-300 rounded w-1/2 px-2 py-1 outline-none text-[10px]" value={item[`${field.key}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `${field.key}`, e.target.value)} />
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-[10px] text-gray-700 w-1/2 text-right">{field.labelAlt}</span>
                <input type="text" className="border border-gray-300 rounded w-1/2 px-2 py-1 outline-none text-[10px]" value={item[`altProf${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `altProf${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`, e.target.value)} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <MainContainer title="Manage Alternate Revenue Profile Prior Year History">
        <Toolbar
          isFormView={isFormView}
          columns={tableColumns}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          currentIndex={profiles.findIndex(p => getRowKey(p) === getRowKey(selectedRow))}
          totalRecords={profiles.length}
          handleNavigate={(dir) => {
            const idx = profiles.findIndex(p => getRowKey(p) === getRowKey(selectedRow));
            if (dir === 'prev' && idx > 0) { setSelectedRow(profiles[idx - 1]); setSelectedRowKey(getRowKey(profiles[idx - 1])); }
            if (dir === 'next' && idx < profiles.length - 1) { setSelectedRow(profiles[idx + 1]); setSelectedRowKey(getRowKey(profiles[idx + 1])); }
          }}
          actions={{
            onAdd: handleAdd,
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {},
            onDelete: handleDelete,
            onSave: () => {},
            onToggleView: () => setIsFormView(!isFormView)
          }}
          handleFindReplace={handleFindReplace}
          selectedRow={selectedRow}
          isDirty={profiles.some(p => p.isDirty)}
          clipboardCount={clipboard.length}
          clipboard={clipboard}
        />

        <div className="m-2">
          {!isFormView ? (
            <ReusableTable
              data={profiles}
              columns={tableColumns}
              onFieldChange={handleFieldChange}
              rowKey={getRowKey}
              selectedRows={selectedIds}
              onRowSelect={(item) => {
                const id = getRowKey(item);
                const newIds = new Set(selectedIds);
                if (newIds.has(id)) newIds.delete(id); else newIds.add(id);
                setSelectedIds(newIds);
                setSelectedRow(item);
                setSelectedRowKey(id);
              }}
              maxHeight="max-h-[60vh]"
            />
          ) : (
            renderFormView()
          )}
        </div>
      </MainContainer>
      <div className="mt-4 px-2">
        <AltRevProfilePriorYearDetails 
          data={selectedRow || {}} 
          onChange={(rowId, field, val) => {
            if (selectedRow) handleFieldChange(rowId, field, val);
          }} 
        />
      </div>
    </>
  );
};

export default ManageAltRevProfilePriorYearHistory;
