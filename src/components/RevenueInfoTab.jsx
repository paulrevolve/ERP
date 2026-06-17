// import React, { useState } from "react";
// import { SecondaryContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { FormInput } from "../helper/formSection";

// const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

// const RevenueInfoTab = ({ data, onChange, handleClose }) => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [selectedRow, setSelectedRow] = useState(null);
  
//   const currentKey = getRowKey(data);
//   const listData = data.revenueInfo || [];

//   const handleFieldChange = (field, value, targetId = null) => {
//     if (listData.length === 0) {
//       const newItem = { tempId: `NEW_${Date.now()}`, [field]: value, isDirty: true };
//       onChange(currentKey, "revenueInfo", [newItem]);
//       setSelectedRow(newItem);
//       setSelectedIds(new Set([newItem.tempId]));
//       return;
//     }
//     const id = targetId || getRowKey(selectedRow) || getRowKey(listData[0]);
//     const updatedList = listData.map(item => getRowKey(item) === id ? { ...item, [field]: value, isDirty: true } : item);
//     onChange(currentKey, "revenueInfo", updatedList);
//     if (selectedRow && getRowKey(selectedRow) === id) {
//       setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
//     }
//   };

//   const handleAdd = () => {
//     const newItem = { tempId: `NEW_${Date.now()}`, isDirty: true };
//     const updatedList = [newItem, ...listData];
//     onChange(currentKey, "revenueInfo", updatedList);
//     setSelectedRow(newItem);
//     setSelectedIds(new Set([newItem.tempId]));
//     setIsFormView(true);
//   };

//   const handleDelete = () => {
//     const updatedList = listData.filter(item => !selectedIds.has(getRowKey(item)));
//     onChange(currentKey, "revenueInfo", updatedList);
//     setSelectedIds(new Set());
//     if (selectedIds.has(getRowKey(selectedRow))) {
//       setSelectedRow(null);
//     }
//   };

//   const activeItem = selectedRow || listData[0] || {};

//   const columns = [
//     { value: "revFormula", label: "Revenue Formula", key: "revFormula" },
//     { value: "revAdj", label: "Revenue Adjustment", key: "revAdj" },
//   ];

//   return (
//     <SecondaryContainer title="Revenue Info" handleClose={handleClose}>
//       <Toolbar
//         isFormView={isFormView}
//         actions={{
//           onAdd: handleAdd,
//           onDelete: handleDelete,
//           onToggleView: () => setIsFormView(!isFormView),
//           onSave: () => {},
//           onClear: () => {},
//           onCopy: () => {},
//           onPaste: () => {}
//         }}
//         buttonsDisable={["Save", "Clear", "Copy", "Paste", "Find/Replace"]}
//       />
      
//       {!isFormView ? (
//         <div className="p-2">
//           <ReusableTable
//             data={listData}
//             columns={columns}
//             selectedRows={selectedIds}
//             onRowSelect={(row) => {
//               const id = getRowKey(row);
//               const newSet = new Set(selectedIds);
//               if (newSet.has(id)) newSet.delete(id);
//               else newSet.add(id);
//               setSelectedIds(newSet);
//               setSelectedRow(row);
//             }}
//             rowKey={getRowKey}
//             maxHeight="max-h-64"
//           />
//         </div>
//       ) : (
//         <div className="space-y-4 p-4 bg-gray-50 border border-gray-100 rounded mt-2">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormInput
//               label="Revenue Formula"
//               value={activeItem.revFormula || ""}
//               onChange={(e) => handleFieldChange("revFormula", e.target.value)}
//             />
//             <FormInput
//               label="Revenue Adjustment"
//               value={activeItem.revAdj || ""}
//               onChange={(e) => handleFieldChange("revAdj", e.target.value)}
//             />
//           </div>
//         </div>
//       )}
//     </SecondaryContainer>
//   );
// };

// export default RevenueInfoTab;

import React from "react";
import { SecondaryContainer } from "../helper/container";
import { FormInput } from "../helper/formSection";

const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

const RevenueInfoTab = ({ data, onChange, handleClose }) => {
  const currentKey = getRowKey(data);
  const listData = data.revenueInfo || [];
  const activeItem = listData[0] || {};

  const handleFieldChange = (field, value) => {
    if (listData.length === 0) {
      const newItem = { tempId: `NEW_${Date.now()}`, [field]: value, isDirty: true };
      onChange(currentKey, "revenueInfo", [newItem]);
      return;
    }
    const updatedList = [{ ...activeItem, [field]: value, isDirty: true }];
    onChange(currentKey, "revenueInfo", updatedList);
  };

  const renderLeftRow = (label, pfx) => (
    <tr>
      <td className="py-1 text-gray-700 font-medium whitespace-nowrap pr-4">{label}</td>
      <td className="py-1 px-2">
        <input type="text" className="border border-gray-300 rounded w-full px-2 py-1 outline-none" value={activeItem[`${pfx}ProdVal`] || ""} onChange={(e) => handleFieldChange(`${pfx}ProdVal`, e.target.value)} />
      </td>
      <td className="py-1 px-2">
        <input type="text" className="border border-gray-300 rounded w-full px-2 py-1 outline-none" value={activeItem[`${pfx}AltOvr`] || ""} onChange={(e) => handleFieldChange(`${pfx}AltOvr`, e.target.value)} />
      </td>
    </tr>
  );

  const renderRightRow = (label, pfx) => (
    <tr>
      <td className="py-1 text-gray-700 font-medium whitespace-nowrap pr-4">{label}</td>
      <td className="py-1 px-2">
        <input type="text" className="border border-gray-300 rounded w-full px-2 py-1 outline-none" value={activeItem[`${pfx}ProdVal`] || ""} onChange={(e) => handleFieldChange(`${pfx}ProdVal`, e.target.value)} />
      </td>
      <td className="py-1 px-2">
        <input type="text" className="border border-gray-300 rounded w-full px-2 py-1 outline-none" value={activeItem[`${pfx}AltOvr`] || ""} onChange={(e) => handleFieldChange(`${pfx}AltOvr`, e.target.value)} />
      </td>
    </tr>
  );

  return (
    <SecondaryContainer title="Identification > Revenue Info" handleClose={handleClose}>
      <div className="p-4 bg-gray-50 border border-gray-100 rounded mt-2">
        
        {/* Top Section */}
        <div className="flex items-center gap-8 mb-6">
          <div className="flex items-center gap-2">
            <input type="checkbox" className="accent-[#17414d]" checked={activeItem.delRevFormula === "Y"} onChange={(e) => handleFieldChange("delRevFormula", e.target.checked ? "Y" : "N")} />
            <label className="text-[10px] font-bold text-gray-700 uppercase">Delete revenue formula for this Project level for Alternate Revenue Profile</label>
          </div>
          <div className="w-64">
            <FormInput label="Record Status" value={activeItem.recordStatus || ""} onChange={(e) => handleFieldChange("recordStatus", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Table */}
          <div>
            <table className="w-full text-[10px] text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 font-semibold text-gray-600">Field</th>
                  <th className="py-2 font-semibold text-gray-600 px-2">Production Value</th>
                  <th className="py-2 font-semibold text-gray-600 px-2">Alternate Profile Override</th>
                </tr>
              </thead>
              <tbody>
                {renderLeftRow("Revenue Formula", "revFormula1")}
                {renderLeftRow("", "revFormula2")}
                {renderLeftRow("", "revFormula3")}
                {renderLeftRow("ITD Loss Amount", "itdLossAmt")}
                {renderLeftRow("Labor Goal Multiplier", "laborGoalMult")}
                {renderLeftRow("Non-Labor Goal Multiplier", "nonLaborGoalMult")}
              </tbody>
            </table>
          </div>

          {/* Right Table */}
          <div>
            <div className="mb-2">
              <FormInput label="Override Revenue Calc Value Field Name (if applicable)" value={activeItem.ovrRevCalcVal || ""} onChange={(e) => handleFieldChange("ovrRevCalcVal", e.target.value)} />
            </div>
            <table className="w-full text-[10px] text-left mt-4">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 font-semibold text-gray-600">Field</th>
                  <th className="py-2 font-semibold text-gray-600 px-2">Production Value</th>
                  <th className="py-2 font-semibold text-gray-600 px-2">Alternate Profile Override</th>
                </tr>
              </thead>
              <tbody>
                {renderRightRow("Discount Method", "discMethod")}
                {renderRightRow("Post Revenue to __ Org", "postRevOrg")}
                {renderRightRow("Calc Revenue on Units", "calcRevUnits")}
                {renderRightRow("Allow Revenue to Exceed", "allowRevExceed")}
                {renderRightRow("By how much?", "byHowMuch")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SecondaryContainer>
  );
};

export default RevenueInfoTab;
