import React, { useState } from "react";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormInput } from "../helper/formSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const AltRevProfilePriorYearDetails = ({ data, onChange }) => {
  const [isFormView, setIsFormView] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  
  const currentKey = getRowKey(data);
  const details = data.details || [];

  const handleFieldChange = (field, value, targetId = null) => {
    if (details.length === 0) {
      const newItem = { tempId: `NEW_DTL_${Date.now()}`, [field]: value, isDirty: true };
      onChange(currentKey, "details", [newItem]);
      setSelectedRow(newItem);
      setSelectedIds(new Set([newItem.tempId]));
      return;
    }
    const id = targetId || getRowKey(selectedRow) || getRowKey(details[0]);
    const updatedDetails = details.map(item => getRowKey(item) === id ? { ...item, [field]: value, isDirty: true } : item);
    onChange(currentKey, "details", updatedDetails);
    if (selectedRow && getRowKey(selectedRow) === id) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newItem = { tempId: `NEW_DTL_${Date.now()}`, isDirty: true };
    const updatedDetails = [newItem, ...details];
    onChange(currentKey, "details", updatedDetails);
    setSelectedRow(newItem);
    setSelectedIds(new Set([newItem.tempId]));
    setIsFormView(true);
  };

  const handleDelete = () => {
    const updatedDetails = details.filter(item => !selectedIds.has(getRowKey(item)));
    onChange(currentKey, "details", updatedDetails);
    setSelectedIds(new Set());
    if (selectedIds.has(getRowKey(selectedRow))) {
      setSelectedRow(null);
    }
  };

  const activeItem = selectedRow || details[0] || {};

  const columns = [
    { value: "fiscalYear", label: "Fiscal Year *", key: "fiscalYear" },
    { value: "project", label: "Project *", key: "project" },
    { value: "organization", label: "Organization *", key: "organization" },
    { value: "account", label: "Account *", key: "account" },
    { value: "delPriorYear", label: "Delete Prior Year Record", key: "delPriorYear", type: "flag" },
    { value: "recordStatus", label: "Record Status", key: "recordStatus" },
    // Direct Details
    { value: "dirAmtIncurred", label: "Dir Amt Incurred", key: "dirAmtIncurred" },
    { value: "altDirAmtIncurred", label: "Alt Dir Amt Incurred", key: "altDirAmtIncurred" },
    { value: "dirAmtAllowed", label: "Dir Amt Allowed", key: "dirAmtAllowed" },
    { value: "altDirAmtAllowed", label: "Alt Dir Amt Allowed", key: "altDirAmtAllowed" },
    { value: "dirDiscountAmt", label: "Dir Discount Amount", key: "dirDiscountAmt" },
    { value: "dirFee", label: "Dir Fee", key: "dirFee" },
    { value: "altDirFee", label: "Alt Dir Fee", key: "altDirFee" },
    { value: "dirHours", label: "Dir Hours", key: "dirHours" },
    { value: "altDirHours", label: "Alt Dir Hours", key: "altDirHours" },
    { value: "dirHoursAllowed", label: "Dir Hours Allowed", key: "dirHoursAllowed" },
    { value: "altDirHoursAllowed", label: "Alt Dir Hours Allowed", key: "altDirHoursAllowed" },
    { value: "dirFeeHrs", label: "Dir Fee (Hrs)", key: "dirFeeHrs" },
    { value: "altDirFeeHrs", label: "Alt Dir Fee (Hrs)", key: "altDirFeeHrs" },
    // Burden Details
    { value: "burdenAmtIncurred", label: "Burden Amt Incurred", key: "burdenAmtIncurred" },
    { value: "burdenAmtAllowed", label: "Burden Amt Allowed", key: "burdenAmtAllowed" },
    { value: "burdenComAmtIncurred", label: "COM Amt Incurred", key: "burdenComAmtIncurred" },
    { value: "burdenComAmtAllowed", label: "COM Amt Allowed", key: "burdenComAmtAllowed" },
    { value: "burdenFee", label: "Burden Fee", key: "burdenFee" },
    { value: "altBurdenFee", label: "Alt Burden Fee", key: "altBurdenFee" },
    // Unit Pricing
    { value: "unitFee", label: "Unit Fee", key: "unitFee" },
    { value: "altUnitFee", label: "Alt Unit Fee", key: "altUnitFee" },
    { value: "unitCost", label: "Unit Cost", key: "unitCost" },
    { value: "altUnitCost", label: "Alt Unit Cost", key: "altUnitCost" },
    { value: "unitTotal", label: "Unit Total", key: "unitTotal" },
    { value: "altUnitTotal", label: "Alt Unit Total", key: "altUnitTotal" },
    { value: "unitUnits", label: "Units", key: "unitUnits" },
    { value: "unitAllowableUnits", label: "Allowable Units", key: "unitAllowableUnits" },
    // Revenue Details
    { value: "revTmAmt", label: "T&M Rev Allowed", key: "revTmAmt" },
    { value: "revAdjustAmt", label: "Rev Adjust Amt", key: "revAdjustAmt" },
    { value: "altRevAdjustAmt", label: "Alt Rev Adjust Amt", key: "altRevAdjustAmt" },
    { value: "revOtherFee", label: "Other Fee", key: "revOtherFee" },
    { value: "altRevOtherFee", label: "Alt Other Fee", key: "altRevOtherFee" },
    { value: "revLimits", label: "Limits", key: "revLimits" },
    { value: "revReallocatedAmt", label: "Reallocated Amt", key: "revReallocatedAmt" },
    { value: "altRevReallocatedAmt", label: "Alt Reallocated Amt", key: "altRevReallocatedAmt" },
    { value: "revTotNotAllowSup", label: "Tot Not Allow Sup", key: "revTotNotAllowSup" },
    { value: "altRevTotNotAllowSup", label: "Alt Tot Not Allow Sup", key: "altRevTotNotAllowSup" },
    { value: "revGross", label: "Gross", key: "revGross" },
    { value: "altRevGross", label: "Alt Gross", key: "altRevGross" },
    { value: "revTotal", label: "Rev Total", key: "revTotal" },
    { value: "altRevTotal", label: "Alt Rev Total", key: "altRevTotal" },
    // Award Details
    { value: "awardFee", label: "Award Fee", key: "awardFee" },
    { value: "altAwardFee", label: "Alt Award Fee", key: "altAwardFee" },
    { value: "awardFeeAdj", label: "Award Fee Adj", key: "awardFeeAdj" },
    { value: "altAwardFeeAdj", label: "Alt Award Fee Adj", key: "altAwardFeeAdj" },
    { value: "awardOverCeil", label: "Over Ceiling Award Fee", key: "awardOverCeil" },
    { value: "altAwardOverCeil", label: "Alt Over Ceiling Award Fee", key: "altAwardOverCeil" },
    { value: "awardFeeRev", label: "Award Fee Revenue", key: "awardFeeRev" },
    { value: "altAwardFeeRev", label: "Alt Award Fee Revenue", key: "altAwardFeeRev" },
  ];

  const renderSectionHeader = (title) => (
    <h3 className="text-[11px] font-bold text-[#17414d] border-b border-[#17414d]/20 pb-1 mb-2 mt-4 uppercase">
      {title}
    </h3>
  );

  const renderRow = (label, pfx) => (
    <div className="flex justify-between items-center gap-4 py-1">
      <span className="text-[10px] text-gray-700 w-1/3 text-right pr-2">{label}</span>
      <input type="text" className="border border-gray-300 rounded w-2/3 px-2 py-1 outline-none text-[10px]" value={activeItem[pfx] || ""} onChange={(e) => handleFieldChange(pfx, e.target.value)} />
    </div>
  );

  return (
    <SecondaryContainer title="Details" handleClose={() => {}}>
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
            data={details}
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
        <div className="p-4 bg-gray-50 border border-gray-100 rounded mt-2">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="col-span-4 space-y-2">
              <FormInput label="Fiscal Year *" value={activeItem.fiscalYear || ""} onChange={(e) => handleFieldChange("fiscalYear", e.target.value)} isLookup />
              <FormInput label="Project *" value={activeItem.project || ""} onChange={(e) => handleFieldChange("project", e.target.value)} isLookup />
              <FormInput label="Organization *" value={activeItem.organization || ""} onChange={(e) => handleFieldChange("organization", e.target.value)} isLookup />
              <FormInput label="Account *" value={activeItem.account || ""} onChange={(e) => handleFieldChange("account", e.target.value)} isLookup />
            </div>
            <div className="col-span-4">
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" className="accent-[#17414d]" checked={activeItem.delPriorYear === "Y"} onChange={(e) => handleFieldChange("delPriorYear", e.target.checked ? "Y" : "N")} />
                <label className="text-[10px] font-bold text-gray-700">Delete this Prior Year Cost and Revenue record for Alternate Revenue Profile</label>
              </div>
            </div>
            <div className="col-span-4">
              <FormInput label="Record Status" value={activeItem.recordStatus || "New"} onChange={(e) => handleFieldChange("recordStatus", e.target.value)} />
            </div>
          </div>

          {/* Direct Details */}
          {renderSectionHeader("Direct Details")}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              {renderRow("Amt Incurred", "dirAmtIncurred")}
              {renderRow("Amt Allowed", "dirAmtAllowed")}
              {renderRow("Discount Amount", "dirDiscountAmt")}
              {renderRow("Fee", "dirFee")}
            </div>
            <div className="space-y-1">
              {renderRow("Alt Profile Amt Incurred", "altDirAmtIncurred")}
              {renderRow("Alt Profile Amt Allowed", "altDirAmtAllowed")}
              <div className="h-6"></div> {/* Spacer for discount */}
              {renderRow("Alt Profile Fee", "altDirFee")}
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  {renderRow("Hours", "dirHours")}
                  {renderRow("Hours Allowed", "dirHoursAllowed")}
                  {renderRow("Fee", "dirFeeHrs")}
                </div>
                <div className="space-y-1">
                  {renderRow("Alt Profile Hours", "altDirHours")}
                  {renderRow("Alt Profile Hours Allowed", "altDirHoursAllowed")}
                  {renderRow("Alt Profile Fee", "altDirFeeHrs")}
                </div>
              </div>
            </div>
          </div>

          {/* Burden Details */}
          {renderSectionHeader("Burden Details")}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              {renderRow("Amt Incurred", "burdenAmtIncurred")}
              {renderRow("Amt Allowed", "burdenAmtAllowed")}
            </div>
            <div className="space-y-1">
              {renderRow("COM Amt Incurred", "burdenComAmtIncurred")}
              {renderRow("COM Amt Allowed", "burdenComAmtAllowed")}
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <div>{renderRow("Fee", "burdenFee")}</div>
                <div>{renderRow("Alt Profile Fee", "altBurdenFee")}</div>
              </div>
            </div>
          </div>

          {/* Unit Pricing */}
          {renderSectionHeader("Unit Pricing")}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              {renderRow("Fee", "unitFee")}
              {renderRow("Cost", "unitCost")}
              {renderRow("Total", "unitTotal")}
            </div>
            <div className="space-y-1">
              {renderRow("Alt Profile Fee", "altUnitFee")}
              {renderRow("Alt Profile Cost", "altUnitCost")}
              {renderRow("Alt Profile Total", "altUnitTotal")}
            </div>
            <div className="space-y-1">
              {renderRow("Units", "unitUnits")}
              {renderRow("Allowable Units", "unitAllowableUnits")}
            </div>
          </div>

          {/* Revenue Details */}
          {renderSectionHeader("Revenue Details")}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              {renderRow("T&M Rev Allowed", "revTmAmt")}
              {renderRow("Rev Adjust Amt", "revAdjustAmt")}
              {renderRow("Other Fee", "revOtherFee")}
              {renderRow("Limits", "revLimits")}
              {renderRow("Reallocated Amt", "revReallocatedAmt")}
            </div>
            <div className="space-y-1 mt-[26px]">
              {renderRow("Alt Profile Rev Adjust Amt", "altRevAdjustAmt")}
              {renderRow("Alt Profile Other Fee", "altRevOtherFee")}
              <div className="h-6"></div> {/* Spacer for Limits */}
              {renderRow("Alt Profile Reallocated Amt", "altRevReallocatedAmt")}
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  {renderRow("Tot Not Allow Sup Amt", "revTotNotAllowSup")}
                  {renderRow("Gross", "revGross")}
                  {renderRow("Total", "revTotal")}
                </div>
                <div className="space-y-1">
                  {renderRow("Alt Profile Tot Alt Allow Sup Amt", "altRevTotNotAllowSup")}
                  {renderRow("Alt Profile Gross", "altRevGross")}
                  {renderRow("Alt Profile Total", "altRevTotal")}
                </div>
              </div>
            </div>
          </div>

          {/* Award Details */}
          {renderSectionHeader("Award Details")}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              {renderRow("Award Fee", "awardFee")}
              {renderRow("Award Fee Adj", "awardFeeAdj")}
            </div>
            <div className="space-y-1">
              {renderRow("Alt Profile Award Fee", "altAwardFee")}
              {renderRow("Alt Profile Award Fee Adj", "altAwardFeeAdj")}
            </div>
            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  {renderRow("Over Ceiling Award Fee", "awardOverCeil")}
                  {renderRow("Award Fee Revenue", "awardFeeRev")}
                </div>
                <div className="space-y-1">
                  {renderRow("Alt Profile Over Ceiling Award Fee", "altAwardOverCeil")}
                  {renderRow("Alt Profile Award Fee Revenue", "altAwardFeeRev")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SecondaryContainer>
  );
};

export default AltRevProfilePriorYearDetails;
