// // import React, { useState } from "react";
// // import { MainContainer, Toolbar } from "../helper/container";
// // import { ReusableTable } from "../helper/tableSection";
// // import { FormInput } from "../helper/formSection";
// // import { toast } from "react-toastify";

// // // Sub-components
// // import ProjRevCalcValMods from "./ProjRevCalcValMods";

// // const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

// // const ManageProjRevCalcValHistory = () => {
// //   const [isFormView, setIsFormView] = useState(false);
// //   const [profiles, setProfiles] = useState([]);
// //   const [selectedIds, setSelectedIds] = useState(new Set());
// //   const [selectedRowKey, setSelectedRowKey] = useState("");
// //   const [selectedRow, setSelectedRow] = useState(null);
// //   const [searchValue, setSearchValue] = useState("");
// //   const [clipboard, setClipboard] = useState([]);

// //   // Internal tab state for Form View
// //   const [activeFormTab, setActiveFormTab] = useState("Modification Summary");

// //   // Subtab state for Secondary Container
// //   const [activeNestedTab, setActiveNestedTab] = useState("Modifications");

// //   const tableColumns = [
// //     { value: "project", label: "Project *", key: "project" },
// //     { value: "revCalcFiscalYear", label: "Revenue Calc Fiscal Year *", key: "revCalcFiscalYear" },
// //     { value: "revCalcPeriod", label: "Revenue Calc Period *", key: "revCalcPeriod" },
// //     { value: "revCalcSubperiod", label: "Revenue Calc Subperiod *", key: "revCalcSubperiod" }
// //   ];

// //   const handleFieldChange = (rowId, field, value) => {
// //     const updated = profiles.map(p => getRowKey(p) === rowId ? { ...p, [field]: value, isDirty: true } : p);
// //     setProfiles(updated);
// //     if (selectedRow && getRowKey(selectedRow) === rowId) {
// //       setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
// //     }
// //   };

// //   const handleAdd = () => {
// //     const newRecord = {
// //       tempId: `NEW_${Date.now()}`,
// //       isDirty: true,
// //       modifications: []
// //     };
// //     const updated = [newRecord, ...profiles];
// //     setProfiles(updated);
// //     setSelectedRow(newRecord);
// //     setSelectedRowKey(newRecord.tempId);
// //     setSelectedIds(new Set([newRecord.tempId]));
// //     setIsFormView(true);
// //   };

// //   const handleDelete = () => {
// //     if (!selectedRow) return toast.warn("Select a record to delete");
// //     const updated = profiles.filter(p => getRowKey(p) !== getRowKey(selectedRow));
// //     setProfiles(updated);
// //     setSelectedRow(null);
// //     setSelectedRowKey("");
// //     toast.success("Deleted successfully");
// //   };

// //   const handleFindReplace = (targetColumn, findValue, replaceValue) => {
// //     if (!findValue) return toast.warn("Enter a value to find.");
// //     let count = 0;
// //     const updated = profiles.map(profile => {
// //       const val = String(profile[targetColumn] || "");
// //       if (val.toLowerCase().includes(findValue.toLowerCase())) {
// //         count++;
// //         return { ...profile, [targetColumn]: replaceValue, isDirty: true };
// //       }
// //       return profile;
// //     });
// //     if (count > 0) {
// //       setProfiles(updated);
// //       toast.success(`Replaced ${count} occurrences in ${targetColumn}.`);
// //     } else {
// //       toast.info("No matches found.");
// //     }
// //   };

// //   const renderFormRow = (label, pfx, sfxs, item) => (
// //     <div className="flex items-center gap-2 py-1">
// //       <span className="text-[10px] text-gray-700 w-1/4 text-right pr-2">{label}</span>
// //       {sfxs.map((sfx, idx) => (
// //         <input
// //           key={idx}
// //           type="text"
// //           className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]"
// //           value={item[`${pfx}${sfx}`] || ""}
// //           onChange={(e) => handleFieldChange(getRowKey(item), `${pfx}${sfx}`, e.target.value)}
// //         />
// //       ))}
// //     </div>
// //   );

// //   const renderFormView = () => {
// //     const item = selectedRow || {};
// //     return (
// //       <div className="flex flex-col gap-4 mb-4">
// //         {/* Top Header Fields */}
// //         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
// //           <div className="lg:col-span-4">
// //             <FormInput label="Project *" value={item.project || ""} onChange={(e) => handleFieldChange(getRowKey(item), "project", e.target.value)} isLookup />
// //           </div>
// //           <div className="lg:col-span-3">
// //             <FormInput label="Revenue Calc Fiscal Year *" value={item.revCalcFiscalYear || ""} onChange={(e) => handleFieldChange(getRowKey(item), "revCalcFiscalYear", e.target.value)} isLookup />
// //           </div>
// //           <div className="lg:col-span-2">
// //             <FormInput label="Revenue Calc Period *" value={item.revCalcPeriod || ""} onChange={(e) => handleFieldChange(getRowKey(item), "revCalcPeriod", e.target.value)} isLookup />
// //           </div>
// //           <div className="lg:col-span-2">
// //             <FormInput label="Revenue Calc Subperiod *" value={item.revCalcSubperiod || ""} onChange={(e) => handleFieldChange(getRowKey(item), "revCalcSubperiod", e.target.value)} isLookup />
// //           </div>
// //         </div>

// //         {/* Internal Tabs */}
// //         <div className="mt-4">
// //           <div className="flex border-b border-[#17414d]/40 mb-4">
// //             {["Modification Summary", "Total Ceilings"].map(tab => (
// //               <button
// //                 key={tab}
// //                 className={`px-4 py-1 text-[11px] font-bold ${activeFormTab === tab ? "text-[#17414d] border-b-2 border-[#17414d]" : "text-gray-500 hover:text-gray-700"}`}
// //                 onClick={() => setActiveFormTab(tab)}
// //               >
// //                 {tab}
// //               </button>
// //             ))}
// //           </div>

// //           {activeFormTab === "Modification Summary" && (
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //               {/* Value Modifications */}
// //               <div className="border border-gray-200 rounded p-2 relative">
// //                 <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Value Modifications</div>
// //                 <div className="mt-2 space-y-2">
// //                   <div className="flex items-center gap-2">
// //                     <span className="text-[10px] text-gray-700 w-1/6">Value</span>
// //                     <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={item.valSumValue || ""} onChange={(e) => handleFieldChange(getRowKey(item), "valSumValue", e.target.value)} />
// //                     <span className="text-[10px] text-gray-700 w-1/6 text-right">Fee%</span>
// //                     <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={item.valSumFeePct || ""} onChange={(e) => handleFieldChange(getRowKey(item), "valSumFeePct", e.target.value)} />
// //                   </div>
// //                   <div className="text-center text-[10px] text-gray-600 font-bold mt-2">Cumulative</div>
// //                   {renderFormRow("Cost", "valSum", ["CumCost"], item)}
// //                   {renderFormRow("Fee", "valSum", ["CumFee"], item)}
// //                   {renderFormRow("Award Fee", "valSum", ["CumAwardFee"], item)}
// //                 </div>
// //               </div>

// //               {/* Funding Modifications */}
// //               <div className="border border-gray-200 rounded p-2 relative">
// //                 <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Funding Modifications</div>
// //                 <div className="mt-2 space-y-2">
// //                   <div className="flex items-center gap-2">
// //                     <span className="text-[10px] text-gray-700 w-1/6">Value</span>
// //                     <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={item.fundSumValue || ""} onChange={(e) => handleFieldChange(getRowKey(item), "fundSumValue", e.target.value)} />
// //                     <span className="text-[10px] text-gray-700 w-1/6 text-right">Fee%</span>
// //                     <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={item.fundSumFeePct || ""} onChange={(e) => handleFieldChange(getRowKey(item), "fundSumFeePct", e.target.value)} />
// //                   </div>
// //                   <div className="text-center text-[10px] text-gray-600 font-bold mt-2">Cumulative</div>
// //                   {renderFormRow("Cost", "fundSum", ["CumCost"], item)}
// //                   {renderFormRow("Fee", "fundSum", ["CumFee"], item)}
// //                   {renderFormRow("Award Fee", "fundSum", ["CumAwardFee"], item)}
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {activeFormTab === "Total Ceilings" && (
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //               {/* Funding Info */}
// //               <div className="border border-gray-200 rounded p-2 relative">
// //                 <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Funding Info</div>
// //                 <div className="mt-2 space-y-2">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-1/2 flex flex-col items-center">
// //                       <span className="text-[10px] font-bold text-gray-700 mb-1">Total</span>
// //                       {["Total", "Cost", "Fee"].map(l => (
// //                         <div key={l} className="flex items-center w-full gap-2 mb-1">
// //                           <span className="text-[10px] text-gray-700 w-12 text-right">{l}</span>
// //                           <input type="text" className="border border-gray-300 rounded w-8 px-1 py-1 outline-none text-[10px] text-center" value="N" disabled />
// //                           <input type="text" className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]" value={item[`fundInfo${l}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `fundInfo${l}`, e.target.value)} />
// //                         </div>
// //                       ))}
// //                     </div>
// //                     <div className="w-1/2 flex flex-col items-end space-y-1">
// //                       <div className="h-4"></div> {/* spacer */}
// //                       {["Fee%", "Costs", "Fee", "Award Fee"].map(l => (
// //                          <div key={l} className="flex items-center w-full gap-2">
// //                           <span className="text-[10px] text-gray-700 flex-1 text-right">{l}</span>
// //                           <input type="text" className="border border-gray-300 rounded w-24 px-2 py-1 outline-none text-[10px]" value={item[`fundInfoRight${l.replace("%","")}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `fundInfoRight${l.replace("%","")}`, e.target.value)} />
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Value Info */}
// //               <div className="border border-gray-200 rounded p-2 relative">
// //                 <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Value Info</div>
// //                 <div className="mt-2 space-y-2">
// //                   <div className="flex items-center gap-2">
// //                     <div className="w-1/2 flex flex-col items-center">
// //                       <span className="text-[10px] font-bold text-gray-700 mb-1">Total</span>
// //                       {["Total", "Cost", "Fee"].map(l => (
// //                         <div key={l} className="flex items-center w-full gap-2 mb-1">
// //                           <span className="text-[10px] text-gray-700 w-12 text-right">{l}</span>
// //                           <input type="text" className="border border-gray-300 rounded w-8 px-1 py-1 outline-none text-[10px] text-center" value="N" disabled />
// //                           <input type="text" className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]" value={item[`valInfo${l}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `valInfo${l}`, e.target.value)} />
// //                         </div>
// //                       ))}
// //                     </div>
// //                     <div className="w-1/2 flex flex-col items-end space-y-1">
// //                       <div className="h-4"></div> {/* spacer */}
// //                       {["Fee%", "Costs", "Fee", "Award Fee"].map(l => (
// //                          <div key={l} className="flex items-center w-full gap-2">
// //                           <span className="text-[10px] text-gray-700 flex-1 text-right">{l}</span>
// //                           <input type="text" className="border border-gray-300 rounded w-24 px-2 py-1 outline-none text-[10px]" value={item[`valInfoRight${l.replace("%","")}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `valInfoRight${l.replace("%","")}`, e.target.value)} />
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   };

// //   const tabs = [
// //     "Modifications",
// //     "Revenue Info",
// //     "Direct Cost Ceilings",
// //     "Burden Cost Ceilings",
// //     "Direct Hours Ceilings",
// //     "Employee Hours Ceilings",
// //     "Vendor Hours Ceilings",
// //     "Cost Fee Overrides",
// //     "Burden Fee Overrides",
// //     "Multiplier Overrides"
// //   ];

// //   return (
// //     <>
// //       <MainContainer title="Manage Project Revenue Calculation Value History">
// //         <Toolbar
// //           isFormView={isFormView}
// //           columns={tableColumns}
// //           searchValue={searchValue}
// //           setSearchValue={setSearchValue}
// //           currentIndex={profiles.findIndex(p => getRowKey(p) === getRowKey(selectedRow))}
// //           totalRecords={profiles.length}
// //           handleNavigate={(dir) => {
// //             const idx = profiles.findIndex(p => getRowKey(p) === getRowKey(selectedRow));
// //             if (dir === 'prev' && idx > 0) { setSelectedRow(profiles[idx - 1]); setSelectedRowKey(getRowKey(profiles[idx - 1])); }
// //             if (dir === 'next' && idx < profiles.length - 1) { setSelectedRow(profiles[idx + 1]); setSelectedRowKey(getRowKey(profiles[idx + 1])); }
// //           }}
// //           actions={{
// //             onAdd: handleAdd,
// //             onCopy: () => {},
// //             onPaste: () => {},
// //             onClear: () => {},
// //             onDelete: handleDelete,
// //             onSave: () => {},
// //             onToggleView: () => setIsFormView(!isFormView)
// //           }}
// //           handleFindReplace={handleFindReplace}
// //           selectedRow={selectedRow}
// //           isDirty={profiles.some(p => p.isDirty)}
// //           clipboardCount={clipboard.length}
// //           clipboard={clipboard}
// //         />

// //         <div className="m-2">
// //           {!isFormView ? (
// //             <ReusableTable
// //               data={profiles}
// //               columns={tableColumns}
// //               onFieldChange={handleFieldChange}
// //               rowKey={getRowKey}
// //               selectedRows={selectedIds}
// //               onRowSelect={(item) => {
// //                 const id = getRowKey(item);
// //                 const newIds = new Set(selectedIds);
// //                 if (newIds.has(id)) newIds.delete(id); else newIds.add(id);
// //                 setSelectedIds(newIds);
// //                 setSelectedRow(item);
// //                 setSelectedRowKey(id);
// //               }}
// //               maxHeight="max-h-[40vh]"
// //             />
// //           ) : (
// //             renderFormView()
// //           )}

// //           {/* Subtabs visible in both views */}
// //           <div className="flex flex-wrap gap-2 mt-4 px-1 pb-2">
// //             {tabs.map((tab) => (
// //               <button
// //                 key={tab}
// //                 onClick={() => setActiveNestedTab(tab)}
// //                 className={`px-3 py-1 text-[11px] font-bold rounded shadow-sm border transition-colors ${
// //                   activeNestedTab === tab
// //                     ? "bg-[#17414d] text-white border-[#17414d]"
// //                     : "bg-[#e8ecee] text-[#17414d] border-gray-300 hover:bg-[#d5dadd]"
// //                 }`}
// //               >
// //                 {tab}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </MainContainer>

// //       {/* Active Sub-component Container */}
// //       <div className="mt-4 px-2">
// //         {activeNestedTab === "Modifications" && (
// //           <ProjRevCalcValMods
// //             data={selectedRow || {}}
// //             onChange={(rowId, field, val) => {
// //               if (selectedRow) handleFieldChange(rowId, field, val);
// //             }}
// //           />
// //         )}
// //         {/* Placeholder for other tabs */}
// //         {activeNestedTab !== "Modifications" && (
// //           <div className="p-4 bg-white border rounded shadow-sm text-center text-gray-500 text-sm">
// //             {activeNestedTab} component will be implemented later.
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   );
// // };

// // export default ManageProjRevCalcValHistory;

// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { FormInput } from "../helper/formSection";
// import { toast } from "react-toastify";

// // Sub-components
// import ProjRevCalcValMods from "./ProjRevCalcValMods";
// import ProjRevCalcValRevInfo from "./ProjRevCalcValRevInfo";
// import ProjRevCalcValDirCostCeil from "./ProjRevCalcValDirCostCeil";
// import ProjRevCalcValBurdenCostCeil from "./ProjRevCalcValBurdenCostCeil";
// import ProjRevCalcValDirHrsCeil from "./ProjRevCalcValDirHrsCeil";

// const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

// const ManageProjRevCalcValHistory = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [profiles, setProfiles] = useState([]);
//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [selectedRowKey, setSelectedRowKey] = useState("");
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [clipboard, setClipboard] = useState([]);

//   // Internal tab state for Form View
//   const [activeFormTab, setActiveFormTab] = useState("Modification Summary");

//   // Subtab state for Secondary Container
//   const [activeNestedTab, setActiveNestedTab] = useState("Modifications");

//   const tableColumns = [
//     { value: "project", label: "Project *", key: "project" },
//     { value: "revCalcFiscalYear", label: "Revenue Calc Fiscal Year *", key: "revCalcFiscalYear" },
//     { value: "revCalcPeriod", label: "Revenue Calc Period *", key: "revCalcPeriod" },
//     { value: "revCalcSubperiod", label: "Revenue Calc Subperiod *", key: "revCalcSubperiod" }
//   ];

//   const handleFieldChange = (rowId, field, value) => {
//     const updated = profiles.map(p => getRowKey(p) === rowId ? { ...p, [field]: value, isDirty: true } : p);
//     setProfiles(updated);
//     if (selectedRow && getRowKey(selectedRow) === rowId) {
//       setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
//     }
//   };

//   const handleAdd = () => {
//     const newRecord = {
//       tempId: `NEW_${Date.now()}`,
//       isDirty: true,
//       modifications: []
//     };
//     const updated = [newRecord, ...profiles];
//     setProfiles(updated);
//     setSelectedRow(newRecord);
//     setSelectedRowKey(newRecord.tempId);
//     setSelectedIds(new Set([newRecord.tempId]));
//     setIsFormView(true);
//   };

//   const handleDelete = () => {
//     if (!selectedRow) return toast.warn("Select a record to delete");
//     const updated = profiles.filter(p => getRowKey(p) !== getRowKey(selectedRow));
//     setProfiles(updated);
//     setSelectedRow(null);
//     setSelectedRowKey("");
//     toast.success("Deleted successfully");
//   };

//   const handleFindReplace = (targetColumn, findValue, replaceValue) => {
//     if (!findValue) return toast.warn("Enter a value to find.");
//     let count = 0;
//     const updated = profiles.map(profile => {
//       const val = String(profile[targetColumn] || "");
//       if (val.toLowerCase().includes(findValue.toLowerCase())) {
//         count++;
//         return { ...profile, [targetColumn]: replaceValue, isDirty: true };
//       }
//       return profile;
//     });
//     if (count > 0) {
//       setProfiles(updated);
//       toast.success(`Replaced ${count} occurrences in ${targetColumn}.`);
//     } else {
//       toast.info("No matches found.");
//     }
//   };

//   const renderFormRow = (label, pfx, sfxs, item) => (
//     <div className="flex items-center gap-2 py-1">
//       <span className="text-[10px] text-gray-700 w-1/4 text-right pr-2">{label}</span>
//       {sfxs.map((sfx, idx) => (
//         <input
//           key={idx}
//           type="text"
//           className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]"
//           value={item[`${pfx}${sfx}`] || ""}
//           onChange={(e) => handleFieldChange(getRowKey(item), `${pfx}${sfx}`, e.target.value)}
//         />
//       ))}
//     </div>
//   );

//   const renderFormView = () => {
//     const item = selectedRow || {};
//     return (
//       <div className="flex flex-col gap-4 mb-4">
//         {/* Top Header Fields */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//           <div className="lg:col-span-4">
//             <FormInput label="Project *" value={item.project || ""} onChange={(e) => handleFieldChange(getRowKey(item), "project", e.target.value)} isLookup />
//           </div>
//           <div className="lg:col-span-3">
//             <FormInput label="Revenue Calc Fiscal Year *" value={item.revCalcFiscalYear || ""} onChange={(e) => handleFieldChange(getRowKey(item), "revCalcFiscalYear", e.target.value)} isLookup />
//           </div>
//           <div className="lg:col-span-2">
//             <FormInput label="Revenue Calc Period *" value={item.revCalcPeriod || ""} onChange={(e) => handleFieldChange(getRowKey(item), "revCalcPeriod", e.target.value)} isLookup />
//           </div>
//           <div className="lg:col-span-2">
//             <FormInput label="Revenue Calc Subperiod *" value={item.revCalcSubperiod || ""} onChange={(e) => handleFieldChange(getRowKey(item), "revCalcSubperiod", e.target.value)} isLookup />
//           </div>
//         </div>

//         {/* Internal Tabs */}
//         <div className="mt-4">
//           <div className="flex border-b border-[#17414d]/40 mb-4">
//             {["Modification Summary", "Total Ceilings"].map(tab => (
//               <button
//                 key={tab}
//                 className={`px-4 py-1 text-[11px] font-bold ${activeFormTab === tab ? "text-[#17414d] border-b-2 border-[#17414d]" : "text-gray-500 hover:text-gray-700"}`}
//                 onClick={() => setActiveFormTab(tab)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {activeFormTab === "Modification Summary" && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Value Modifications */}
//               <div className="border border-gray-200 rounded p-2 relative">
//                 <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Value Modifications</div>
//                 <div className="mt-2 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-[10px] text-gray-700 w-1/6">Value</span>
//                     <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={item.valSumValue || ""} onChange={(e) => handleFieldChange(getRowKey(item), "valSumValue", e.target.value)} />
//                     <span className="text-[10px] text-gray-700 w-1/6 text-right">Fee%</span>
//                     <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={item.valSumFeePct || ""} onChange={(e) => handleFieldChange(getRowKey(item), "valSumFeePct", e.target.value)} />
//                   </div>
//                   <div className="text-center text-[10px] text-gray-600 font-bold mt-2">Cumulative</div>
//                   {renderFormRow("Cost", "valSum", ["CumCost"], item)}
//                   {renderFormRow("Fee", "valSum", ["CumFee"], item)}
//                   {renderFormRow("Award Fee", "valSum", ["CumAwardFee"], item)}
//                 </div>
//               </div>

//               {/* Funding Modifications */}
//               <div className="border border-gray-200 rounded p-2 relative">
//                 <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Funding Modifications</div>
//                 <div className="mt-2 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-[10px] text-gray-700 w-1/6">Value</span>
//                     <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={item.fundSumValue || ""} onChange={(e) => handleFieldChange(getRowKey(item), "fundSumValue", e.target.value)} />
//                     <span className="text-[10px] text-gray-700 w-1/6 text-right">Fee%</span>
//                     <input type="text" className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]" value={item.fundSumFeePct || ""} onChange={(e) => handleFieldChange(getRowKey(item), "fundSumFeePct", e.target.value)} />
//                   </div>
//                   <div className="text-center text-[10px] text-gray-600 font-bold mt-2">Cumulative</div>
//                   {renderFormRow("Cost", "fundSum", ["CumCost"], item)}
//                   {renderFormRow("Fee", "fundSum", ["CumFee"], item)}
//                   {renderFormRow("Award Fee", "fundSum", ["CumAwardFee"], item)}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeFormTab === "Total Ceilings" && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Funding Info */}
//               <div className="border border-gray-200 rounded p-2 relative">
//                 <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Funding Info</div>
//                 <div className="mt-2 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <div className="w-1/2 flex flex-col items-center">
//                       <span className="text-[10px] font-bold text-gray-700 mb-1">Total</span>
//                       {["Total", "Cost", "Fee"].map(l => (
//                         <div key={l} className="flex items-center w-full gap-2 mb-1">
//                           <span className="text-[10px] text-gray-700 w-12 text-right">{l}</span>
//                           <input type="text" className="border border-gray-300 rounded w-8 px-1 py-1 outline-none text-[10px] text-center" value="N" disabled />
//                           <input type="text" className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]" value={item[`fundInfo${l}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `fundInfo${l}`, e.target.value)} />
//                         </div>
//                       ))}
//                     </div>
//                     <div className="w-1/2 flex flex-col items-end space-y-1">
//                       <div className="h-4"></div> {/* spacer */}
//                       {["Fee%", "Costs", "Fee", "Award Fee"].map(l => (
//                          <div key={l} className="flex items-center w-full gap-2">
//                           <span className="text-[10px] text-gray-700 flex-1 text-right">{l}</span>
//                           <input type="text" className="border border-gray-300 rounded w-24 px-2 py-1 outline-none text-[10px]" value={item[`fundInfoRight${l.replace("%","")}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `fundInfoRight${l.replace("%","")}`, e.target.value)} />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Value Info */}
//               <div className="border border-gray-200 rounded p-2 relative">
//                 <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">Value Info</div>
//                 <div className="mt-2 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <div className="w-1/2 flex flex-col items-center">
//                       <span className="text-[10px] font-bold text-gray-700 mb-1">Total</span>
//                       {["Total", "Cost", "Fee"].map(l => (
//                         <div key={l} className="flex items-center w-full gap-2 mb-1">
//                           <span className="text-[10px] text-gray-700 w-12 text-right">{l}</span>
//                           <input type="text" className="border border-gray-300 rounded w-8 px-1 py-1 outline-none text-[10px] text-center" value="N" disabled />
//                           <input type="text" className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]" value={item[`valInfo${l}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `valInfo${l}`, e.target.value)} />
//                         </div>
//                       ))}
//                     </div>
//                     <div className="w-1/2 flex flex-col items-end space-y-1">
//                       <div className="h-4"></div> {/* spacer */}
//                       {["Fee%", "Costs", "Fee", "Award Fee"].map(l => (
//                          <div key={l} className="flex items-center w-full gap-2">
//                           <span className="text-[10px] text-gray-700 flex-1 text-right">{l}</span>
//                           <input type="text" className="border border-gray-300 rounded w-24 px-2 py-1 outline-none text-[10px]" value={item[`valInfoRight${l.replace("%","")}`] || ""} onChange={(e) => handleFieldChange(getRowKey(item), `valInfoRight${l.replace("%","")}`, e.target.value)} />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const tabs = [
//     "Modifications",
//     "Revenue Info",
//     "Direct Cost Ceilings",
//     "Burden Cost Ceilings",
//     "Direct Hours Ceilings",
//     "Employee Hours Ceilings",
//     "Vendor Hours Ceilings",
//     "Cost Fee Overrides",
//     "Burden Fee Overrides",
//     "Multiplier Overrides"
//   ];

//   return (
//     <>
//       <MainContainer title="Manage Project Revenue Calculation Value History">
//         <Toolbar
//           isFormView={isFormView}
//           columns={tableColumns}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           currentIndex={profiles.findIndex(p => getRowKey(p) === getRowKey(selectedRow))}
//           totalRecords={profiles.length}
//           handleNavigate={(dir) => {
//             const idx = profiles.findIndex(p => getRowKey(p) === getRowKey(selectedRow));
//             if (dir === 'prev' && idx > 0) { setSelectedRow(profiles[idx - 1]); setSelectedRowKey(getRowKey(profiles[idx - 1])); }
//             if (dir === 'next' && idx < profiles.length - 1) { setSelectedRow(profiles[idx + 1]); setSelectedRowKey(getRowKey(profiles[idx + 1])); }
//           }}
//           actions={{
//             onAdd: handleAdd,
//             onCopy: () => {},
//             onPaste: () => {},
//             onClear: () => {},
//             onDelete: handleDelete,
//             onSave: () => {},
//             onToggleView: () => setIsFormView(!isFormView)
//           }}
//           handleFindReplace={handleFindReplace}
//           selectedRow={selectedRow}
//           isDirty={profiles.some(p => p.isDirty)}
//           clipboardCount={clipboard.length}
//           clipboard={clipboard}
//         />

//         <div className="m-2">
//           {!isFormView ? (
//             <ReusableTable
//               data={profiles}
//               columns={tableColumns}
//               onFieldChange={handleFieldChange}
//               rowKey={getRowKey}
//               selectedRows={selectedIds}
//               onRowSelect={(item) => {
//                 const id = getRowKey(item);
//                 const newIds = new Set(selectedIds);
//                 if (newIds.has(id)) newIds.delete(id); else newIds.add(id);
//                 setSelectedIds(newIds);
//                 setSelectedRow(item);
//                 setSelectedRowKey(id);
//               }}
//               maxHeight="max-h-[40vh]"
//             />
//           ) : (
//             renderFormView()
//           )}

//           {/* Subtabs visible in both views */}
//           <div className="flex flex-wrap gap-2 mt-4 px-1 pb-2">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveNestedTab(tab)}
//                 className={`px-3 py-1 text-[11px] font-bold rounded shadow-sm border transition-colors ${
//                   activeNestedTab === tab
//                     ? "bg-[#17414d] text-white border-[#17414d]"
//                     : "bg-[#e8ecee] text-[#17414d] border-gray-300 hover:bg-[#d5dadd]"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>
//       </MainContainer>

//       {/* Active Sub-component Container */}
//       <div className="mt-4 px-2">
//         {activeNestedTab === "Modifications" && (
//           <ProjRevCalcValMods
//             data={selectedRow || {}}
//             onChange={(rowId, field, val) => {
//               if (selectedRow) handleFieldChange(rowId, field, val);
//             }}
//             handleClose={() => setActiveNestedTab("")}
//           />
//         )}
//         {activeNestedTab === "Revenue Info" && (
//           <ProjRevCalcValRevInfo
//             data={selectedRow || {}}
//             onChange={(rowId, field, val) => {
//               if (selectedRow) handleFieldChange(rowId, field, val);
//             }}
//             handleClose={() => setActiveNestedTab("")}
//           />
//         )}
//         {activeNestedTab === "Direct Cost Ceilings" && (
//           <ProjRevCalcValDirCostCeil
//             data={selectedRow || {}}
//             onChange={(rowId, field, val) => {
//               if (selectedRow) handleFieldChange(rowId, field, val);
//             }}
//             handleClose={() => setActiveNestedTab("")}
//           />
//         )}
//         {activeNestedTab === "Burden Cost Ceilings" && (
//           <ProjRevCalcValBurdenCostCeil
//             data={selectedRow || {}}
//             onChange={(rowId, field, val) => {
//               if (selectedRow) handleFieldChange(rowId, field, val);
//             }}
//             handleClose={() => setActiveNestedTab("")}
//           />
//         )}
//         {activeNestedTab === "Direct Hours Ceilings" && (
//           <ProjRevCalcValDirHrsCeil
//             data={selectedRow || {}}
//             onChange={(rowId, field, val) => {
//               if (selectedRow) handleFieldChange(rowId, field, val);
//             }}
//             handleClose={() => setActiveNestedTab("")}
//           />
//         )}

//         {/* Placeholder for other tabs */}
//         {activeNestedTab && !["Modifications", "Revenue Info", "Direct Cost Ceilings", "Burden Cost Ceilings", "Direct Hours Ceilings"].includes(activeNestedTab) && (
//           <div className="p-4 bg-white border rounded shadow-sm text-center text-gray-500 text-sm relative">
//             <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setActiveNestedTab("")}>✕</button>
//             {activeNestedTab} component will be implemented later.
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ManageProjRevCalcValHistory;

import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormInput } from "../helper/formSection";
import { toast } from "react-toastify";

// Sub-components
import ProjRevCalcValMods from "./ProjRevCalcValMods";
import ProjRevCalcValRevInfo from "./ProjRevCalcValRevInfo";
import ProjRevCalcValDirCostCeil from "./ProjRevCalcValDirCostCeil";
import ProjRevCalcValBurdenCostCeil from "./ProjRevCalcValBurdenCostCeil";
import ProjRevCalcValDirHrsCeil from "./ProjRevCalcValDirHrsCeil";
import ProjRevCalcValEmplHrsCeil from "./ProjRevCalcValEmplHrsCeil";
import ProjRevCalcValVendHrsCeil from "./ProjRevCalcValVendHrsCeil";
import ProjRevCalcValCostFeeOverrides from "./ProjRevCalcValCostFeeOverrides";
import ProjRevCalcValBurdenFeeOverrides from "./ProjRevCalcValBurdenFeeOverrides";
import ProjRevCalcValMultiplierOverrides from "./ProjRevCalcValMultiplierOverrides";

const getRowKey = (row) => (row ? String(row.tempId || row.id || "") : "");

const ManageProjRevCalcValHistory = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedRowKey, setSelectedRowKey] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [clipboard, setClipboard] = useState([]);

  // Internal tab state for Form View
  const [activeFormTab, setActiveFormTab] = useState("Modification Summary");

  // Subtab state for Secondary Container
  const [activeNestedTab, setActiveNestedTab] = useState("Modifications");

  const tableColumns = [
    { value: "project", label: "Project *", key: "project" },
    {
      value: "revCalcFiscalYear",
      label: "Revenue Calc Fiscal Year *",
      key: "revCalcFiscalYear",
    },
    {
      value: "revCalcPeriod",
      label: "Revenue Calc Period *",
      key: "revCalcPeriod",
    },
    {
      value: "revCalcSubperiod",
      label: "Revenue Calc Subperiod *",
      key: "revCalcSubperiod",
    },
  ];

  const handleFieldChange = (rowId, field, value) => {
    const updated = profiles.map((p) =>
      getRowKey(p) === rowId ? { ...p, [field]: value, isDirty: true } : p,
    );
    setProfiles(updated);
    if (selectedRow && getRowKey(selectedRow) === rowId) {
      setSelectedRow({ ...selectedRow, [field]: value, isDirty: true });
    }
  };

  const handleAdd = () => {
    const newRecord = {
      tempId: `NEW_${Date.now()}`,
      isDirty: true,
      modifications: [],
    };
    const updated = [newRecord, ...profiles];
    setProfiles(updated);
    setSelectedRow(newRecord);
    setSelectedRowKey(newRecord.tempId);
    setSelectedIds(new Set([newRecord.tempId]));
    setIsFormView(true);
  };

  const handleDelete = () => {
    if (!selectedRow) return toast.warn("Select a record to delete");
    const updated = profiles.filter(
      (p) => getRowKey(p) !== getRowKey(selectedRow),
    );
    setProfiles(updated);
    setSelectedRow(null);
    setSelectedRowKey("");
    toast.success("Deleted successfully");
  };

  const handleFindReplace = (targetColumn, findValue, replaceValue) => {
    if (!findValue) return toast.warn("Enter a value to find.");
    let count = 0;
    const updated = profiles.map((profile) => {
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

  const renderFormRow = (label, pfx, sfxs, item) => (
    <div className="flex items-center gap-2 py-1">
      <span className="text-[10px] text-gray-700 w-1/4 text-right pr-2">
        {label}
      </span>
      {sfxs.map((sfx, idx) => (
        <input
          key={idx}
          type="text"
          className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]"
          value={item[`${pfx}${sfx}`] || ""}
          onChange={(e) =>
            handleFieldChange(getRowKey(item), `${pfx}${sfx}`, e.target.value)
          }
        />
      ))}
    </div>
  );

  const renderFormView = () => {
    const item = selectedRow || {};
    return (
      <div className="flex flex-col gap-4 mb-4">
        {/* Top Header Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <FormInput
              label="Project *"
              value={item.project || ""}
              onChange={(e) =>
                handleFieldChange(getRowKey(item), "project", e.target.value)
              }
              isLookup
            />
          </div>
          <div className="lg:col-span-3">
            <FormInput
              label="Revenue Calc Fiscal Year *"
              value={item.revCalcFiscalYear || ""}
              onChange={(e) =>
                handleFieldChange(
                  getRowKey(item),
                  "revCalcFiscalYear",
                  e.target.value,
                )
              }
              isLookup
            />
          </div>
          <div className="lg:col-span-2">
            <FormInput
              label="Revenue Calc Period *"
              value={item.revCalcPeriod || ""}
              onChange={(e) =>
                handleFieldChange(
                  getRowKey(item),
                  "revCalcPeriod",
                  e.target.value,
                )
              }
              isLookup
            />
          </div>
          <div className="lg:col-span-2">
            <FormInput
              label="Revenue Calc Subperiod *"
              value={item.revCalcSubperiod || ""}
              onChange={(e) =>
                handleFieldChange(
                  getRowKey(item),
                  "revCalcSubperiod",
                  e.target.value,
                )
              }
              isLookup
            />
          </div>
        </div>

        {/* Internal Tabs */}
        <div className="mt-4">
          <div className="flex border-b border-[#17414d]/40 mb-4">
            {["Modification Summary", "Total Ceilings"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-1 text-[11px] font-bold ${activeFormTab === tab ? "text-[#17414d] border-b-2 border-[#17414d]" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveFormTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeFormTab === "Modification Summary" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Value Modifications */}
              <div className="border border-gray-200 rounded p-2 relative">
                <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">
                  Value Modifications
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-700 w-1/6">
                      Value
                    </span>
                    <input
                      type="text"
                      className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]"
                      value={item.valSumValue || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(item),
                          "valSumValue",
                          e.target.value,
                        )
                      }
                    />
                    <span className="text-[10px] text-gray-700 w-1/6 text-right">
                      Fee%
                    </span>
                    <input
                      type="text"
                      className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]"
                      value={item.valSumFeePct || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(item),
                          "valSumFeePct",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="text-center text-[10px] text-gray-600 font-bold mt-2">
                    Cumulative
                  </div>
                  {renderFormRow("Cost", "valSum", ["CumCost"], item)}
                  {renderFormRow("Fee", "valSum", ["CumFee"], item)}
                  {renderFormRow("Award Fee", "valSum", ["CumAwardFee"], item)}
                </div>
              </div>

              {/* Funding Modifications */}
              <div className="border border-gray-200 rounded p-2 relative">
                <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">
                  Funding Modifications
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-700 w-1/6">
                      Value
                    </span>
                    <input
                      type="text"
                      className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]"
                      value={item.fundSumValue || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(item),
                          "fundSumValue",
                          e.target.value,
                        )
                      }
                    />
                    <span className="text-[10px] text-gray-700 w-1/6 text-right">
                      Fee%
                    </span>
                    <input
                      type="text"
                      className="border border-gray-300 rounded w-1/3 px-2 py-1 outline-none text-[10px]"
                      value={item.fundSumFeePct || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(item),
                          "fundSumFeePct",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="text-center text-[10px] text-gray-600 font-bold mt-2">
                    Cumulative
                  </div>
                  {renderFormRow("Cost", "fundSum", ["CumCost"], item)}
                  {renderFormRow("Fee", "fundSum", ["CumFee"], item)}
                  {renderFormRow("Award Fee", "fundSum", ["CumAwardFee"], item)}
                </div>
              </div>
            </div>
          )}

          {activeFormTab === "Total Ceilings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funding Info */}
              <div className="border border-gray-200 rounded p-2 relative">
                <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">
                  Funding Info
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1/2 flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-700 mb-1">
                        Total
                      </span>
                      {["Total", "Cost", "Fee"].map((l) => (
                        <div
                          key={l}
                          className="flex items-center w-full gap-2 mb-1"
                        >
                          <span className="text-[10px] text-gray-700 w-12 text-right">
                            {l}
                          </span>
                          <input
                            type="text"
                            className="border border-gray-300 rounded w-8 px-1 py-1 outline-none text-[10px] text-center"
                            value="N"
                            disabled
                          />
                          <input
                            type="text"
                            className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]"
                            value={item[`fundInfo${l}`] || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                getRowKey(item),
                                `fundInfo${l}`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="w-1/2 flex flex-col items-end space-y-1">
                      <div className="h-4"></div> {/* spacer */}
                      {["Fee%", "Costs", "Fee", "Award Fee"].map((l) => (
                        <div key={l} className="flex items-center w-full gap-2">
                          <span className="text-[10px] text-gray-700 flex-1 text-right">
                            {l}
                          </span>
                          <input
                            type="text"
                            className="border border-gray-300 rounded w-24 px-2 py-1 outline-none text-[10px]"
                            value={
                              item[`fundInfoRight${l.replace("%", "")}`] || ""
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                getRowKey(item),
                                `fundInfoRight${l.replace("%", "")}`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Info */}
              <div className="border border-gray-200 rounded p-2 relative">
                <div className="absolute -top-2.5 left-2 bg-gray-50 px-1 text-[10px] font-bold text-[#17414d]">
                  Value Info
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1/2 flex flex-col items-center">
                      <span className="text-[10px] font-bold text-gray-700 mb-1">
                        Total
                      </span>
                      {["Total", "Cost", "Fee"].map((l) => (
                        <div
                          key={l}
                          className="flex items-center w-full gap-2 mb-1"
                        >
                          <span className="text-[10px] text-gray-700 w-12 text-right">
                            {l}
                          </span>
                          <input
                            type="text"
                            className="border border-gray-300 rounded w-8 px-1 py-1 outline-none text-[10px] text-center"
                            value="N"
                            disabled
                          />
                          <input
                            type="text"
                            className="border border-gray-300 rounded flex-1 px-2 py-1 outline-none text-[10px]"
                            value={item[`valInfo${l}`] || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                getRowKey(item),
                                `valInfo${l}`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="w-1/2 flex flex-col items-end space-y-1">
                      <div className="h-4"></div> {/* spacer */}
                      {["Fee%", "Costs", "Fee", "Award Fee"].map((l) => (
                        <div key={l} className="flex items-center w-full gap-2">
                          <span className="text-[10px] text-gray-700 flex-1 text-right">
                            {l}
                          </span>
                          <input
                            type="text"
                            className="border border-gray-300 rounded w-24 px-2 py-1 outline-none text-[10px]"
                            value={
                              item[`valInfoRight${l.replace("%", "")}`] || ""
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                getRowKey(item),
                                `valInfoRight${l.replace("%", "")}`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const tabs = [
    "Modifications",
    "Revenue Info",
    "Direct Cost Ceilings",
    "Burden Cost Ceilings",
    "Direct Hours Ceilings",
    "Employee Hours Ceilings",
    "Vendor Hours Ceilings",
    "Cost Fee Overrides",
    "Burden Fee Overrides",
    "Multiplier Overrides",
  ];

  return (
    <>
      <MainContainer title="Manage Project Revenue Calculation Value History">
        <Toolbar
          isFormView={isFormView}
          columns={tableColumns}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          currentIndex={profiles.findIndex(
            (p) => getRowKey(p) === getRowKey(selectedRow),
          )}
          totalRecords={profiles.length}
          handleNavigate={(dir) => {
            const idx = profiles.findIndex(
              (p) => getRowKey(p) === getRowKey(selectedRow),
            );
            if (dir === "prev" && idx > 0) {
              setSelectedRow(profiles[idx - 1]);
              setSelectedRowKey(getRowKey(profiles[idx - 1]));
            }
            if (dir === "next" && idx < profiles.length - 1) {
              setSelectedRow(profiles[idx + 1]);
              setSelectedRowKey(getRowKey(profiles[idx + 1]));
            }
          }}
          actions={{
            onAdd: handleAdd,
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {},
            onDelete: handleDelete,
            onSave: () => {},
            onToggleView: () => setIsFormView(!isFormView),
          }}
          handleFindReplace={handleFindReplace}
          selectedRow={selectedRow}
          isDirty={profiles.some((p) => p.isDirty)}
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
                if (newIds.has(id)) newIds.delete(id);
                else newIds.add(id);
                setSelectedIds(newIds);
                setSelectedRow(item);
                setSelectedRowKey(id);
              }}
              maxHeight="max-h-[40vh]"
            />
          ) : (
            renderFormView()
          )}

          {/* Subtabs visible in both views */}
          <div className="flex flex-wrap gap-2 mt-4 px-1 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveNestedTab(tab)}
                className={`px-3 py-1 text-[11px] font-bold rounded shadow-sm border transition-colors ${
                  activeNestedTab === tab
                    ? "bg-[#17414d] text-white border-[#17414d]"
                    : "bg-[#e8ecee] text-[#17414d] border-gray-300 hover:bg-[#d5dadd]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </MainContainer>

      {/* Active Sub-component Container */}
      <div className="mt-4 px-2">
        {activeNestedTab === "Modifications" && (
          <ProjRevCalcValMods
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}
        {activeNestedTab === "Revenue Info" && (
          <ProjRevCalcValRevInfo
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}
        {activeNestedTab === "Direct Cost Ceilings" && (
          <ProjRevCalcValDirCostCeil
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}
        {activeNestedTab === "Burden Cost Ceilings" && (
          <ProjRevCalcValBurdenCostCeil
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}
        {activeNestedTab === "Direct Hours Ceilings" && (
          <ProjRevCalcValDirHrsCeil
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}

        {activeNestedTab === "Employee Hours Ceilings" && (
          <ProjRevCalcValEmplHrsCeil
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}
        {activeNestedTab === "Vendor Hours Ceilings" && (
          <ProjRevCalcValVendHrsCeil
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}
        {activeNestedTab === "Cost Fee Overrides" && (
          <ProjRevCalcValCostFeeOverrides
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}
        {activeNestedTab === "Burden Fee Overrides" && (
          <ProjRevCalcValBurdenFeeOverrides
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}
        {activeNestedTab === "Multiplier Overrides" && (
          <ProjRevCalcValMultiplierOverrides
            data={selectedRow || {}}
            onChange={(rowId, field, val) => {
              if (selectedRow) handleFieldChange(rowId, field, val);
            }}
            handleClose={() => setActiveNestedTab("")}
          />
        )}

        {/* Placeholder for other tabs */}
        {activeNestedTab &&
          ![
            "Modifications",
            "Revenue Info",
            "Direct Cost Ceilings",
            "Burden Cost Ceilings",
            "Direct Hours Ceilings",
            "Employee Hours Ceilings",
            "Vendor Hours Ceilings",
            "Cost Fee Overrides",
            "Burden Fee Overrides",
            "Multiplier Overrides",
          ].includes(activeNestedTab) && (
            <div className="p-4 bg-white border rounded shadow-sm text-center text-gray-500 text-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setActiveNestedTab("")}
              >
                ✕
              </button>
              {activeNestedTab} component will be implemented later.
            </div>
          )}
      </div>
    </>
  );
};

export default ManageProjRevCalcValHistory;
