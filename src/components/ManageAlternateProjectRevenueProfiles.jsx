// import React, { useState, useEffect, useRef } from "react";
// import { toast } from "react-toastify";
// import api from "../utils/api";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import AltProjRevProfileMods from "./AltProjRevProfileMods";
// import RevenueInfoTab from "./RevenueInfoTab";
// import DirCostCeilTab from "./DirCostCeilTab";
// import DirHrsCeilTab from "./DirHrsCeilTab";
// import EmplHrsCeilTab from "./EmplHrsCeilTab";
// import VendHrsCeilTab from "./VendHrsCeilTab";
// import { FormSection, FormInput } from "../helper/formSection";
// import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
// import { backendUrl } from "./config";

// const ManageAlternateProjectRevenueProfiles = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [activeNestedTabs, setActiveNestedTabs] = useState({});
//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [profiles, setProfiles] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [clipboard, setClipboard] = useState([]);
//   const [masterProfiles, setMasterProfiles] = useState([]);

//   // Pagination & Search States
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(15);
//   const [searchValue, setSearchValue] = useState("");
//   const [searchColumn, setSearchColumn] = useState("projectId");
//   const [selectedRowKey, setSelectedRowKey] = useState("");

//   const tableColumns = [
//     { id: "projectId", value: "projectId", label: "Project *", key: "projectId", allowReplace: false },
//     { id: "includeInactive", value: "includeInactive", label: "Include Inactive Projects in lookup", key: "includeInactive", type: "flag", allowReplace: true },
//     { id: "recordStatus", value: "recordStatus", label: "Record Status", key: "recordStatus", allowReplace: true },

//     // Basic Info
//     { id: "activeFlagProdVal", value: "activeFlagProdVal", label: "Active Flag Prod Val", key: "activeFlagProdVal", allowReplace: true },
//     { id: "activeFlagProdEdit", value: "activeFlagProdEdit", label: "Active Flag Prod Edit", key: "activeFlagProdEdit", type: "flag", allowReplace: true },
//     { id: "activeFlagAltOvr", value: "activeFlagAltOvr", label: "Active Flag Alt Ovr", key: "activeFlagAltOvr", allowReplace: true },
//     { id: "activeFlagAltEdit", value: "activeFlagAltEdit", label: "Active Flag Alt Edit", key: "activeFlagAltEdit", allowReplace: true },

//     { id: "allowChgProdVal", value: "allowChgProdVal", label: "Allow Charging Prod Val", key: "allowChgProdVal", allowReplace: true },
//     { id: "allowChgProdEdit", value: "allowChgProdEdit", label: "Allow Charging Prod Edit", key: "allowChgProdEdit", type: "flag", allowReplace: true },
//     { id: "allowChgAltOvr", value: "allowChgAltOvr", label: "Allow Charging Alt Ovr", key: "allowChgAltOvr", allowReplace: true },
//     { id: "allowChgAltEdit", value: "allowChgAltEdit", label: "Allow Charging Alt Edit", key: "allowChgAltEdit", allowReplace: true },

//     { id: "projAcctGrpProdVal", value: "projAcctGrpProdVal", label: "Project Account Group Prod Val", key: "projAcctGrpProdVal", allowReplace: true },
//     { id: "projAcctGrpProdEdit", value: "projAcctGrpProdEdit", label: "Project Account Group Prod Edit", key: "projAcctGrpProdEdit", type: "flag", allowReplace: true },
//     { id: "projAcctGrpAltOvr", value: "projAcctGrpAltOvr", label: "Project Account Group Alt Ovr", key: "projAcctGrpAltOvr", allowReplace: true },
//     { id: "projAcctGrpAltEdit", value: "projAcctGrpAltEdit", label: "Project Account Group Alt Edit", key: "projAcctGrpAltEdit", allowReplace: true },

//     { id: "applyCostMoneyProdVal", value: "applyCostMoneyProdVal", label: "Apply Cost Money Prod Val", key: "applyCostMoneyProdVal", allowReplace: true },
//     { id: "applyCostMoneyProdEdit", value: "applyCostMoneyProdEdit", label: "Apply Cost Money Prod Edit", key: "applyCostMoneyProdEdit", type: "flag", allowReplace: true },
//     { id: "applyCostMoneyAltOvr", value: "applyCostMoneyAltOvr", label: "Apply Cost Money Alt Ovr", key: "applyCostMoneyAltOvr", allowReplace: true },
//     { id: "applyCostMoneyAltEdit", value: "applyCostMoneyAltEdit", label: "Apply Cost Money Alt Edit", key: "applyCostMoneyAltEdit", allowReplace: true },

//     { id: "owningOrgProdVal", value: "owningOrgProdVal", label: "Owning Org Prod Val", key: "owningOrgProdVal", allowReplace: true },
//     { id: "owningOrgProdEdit", value: "owningOrgProdEdit", label: "Owning Org Prod Edit", key: "owningOrgProdEdit", type: "flag", allowReplace: true },
//     { id: "owningOrgAltOvr", value: "owningOrgAltOvr", label: "Owning Org Alt Ovr", key: "owningOrgAltOvr", allowReplace: true },
//     { id: "owningOrgAltEdit", value: "owningOrgAltEdit", label: "Owning Org Alt Edit", key: "owningOrgAltEdit", allowReplace: true },

//     // Total Ceilings
//     { id: "totFundCeilProdAmt", value: "totFundCeilProdAmt", label: "Total Funded Ceiling Prod Amt", key: "totFundCeilProdAmt", allowReplace: true },
//     { id: "totFundCeilProdFlag", value: "totFundCeilProdFlag", label: "Total Funded Ceiling Prod Flag", key: "totFundCeilProdFlag", allowReplace: true },
//     { id: "totFundCeilAltFlag", value: "totFundCeilAltFlag", label: "Total Funded Ceiling Alt Flag", key: "totFundCeilAltFlag", allowReplace: true },

//     { id: "totFundCostCeilProdAmt", value: "totFundCostCeilProdAmt", label: "Total Funded Cost Ceiling Prod Amt", key: "totFundCostCeilProdAmt", allowReplace: true },
//     { id: "totFundCostCeilProdFlag", value: "totFundCostCeilProdFlag", label: "Total Funded Cost Ceiling Prod Flag", key: "totFundCostCeilProdFlag", allowReplace: true },
//     { id: "totFundCostCeilAltFlag", value: "totFundCostCeilAltFlag", label: "Total Funded Cost Ceiling Alt Flag", key: "totFundCostCeilAltFlag", allowReplace: true },

//     { id: "totFundFeeCeilProdAmt", value: "totFundFeeCeilProdAmt", label: "Total Funded Fee Ceiling Prod Amt", key: "totFundFeeCeilProdAmt", allowReplace: true },
//     { id: "totFundFeeCeilProdFlag", value: "totFundFeeCeilProdFlag", label: "Total Funded Fee Ceiling Prod Flag", key: "totFundFeeCeilProdFlag", allowReplace: true },
//     { id: "totFundFeeCeilAltFlag", value: "totFundFeeCeilAltFlag", label: "Total Funded Fee Ceiling Alt Flag", key: "totFundFeeCeilAltFlag", allowReplace: true },

//     { id: "totContValCeilProdAmt", value: "totContValCeilProdAmt", label: "Total Contract Value Ceiling Prod Amt", key: "totContValCeilProdAmt", allowReplace: true },
//     { id: "totContValCeilProdFlag", value: "totContValCeilProdFlag", label: "Total Contract Value Ceiling Prod Flag", key: "totContValCeilProdFlag", allowReplace: true },
//     { id: "totContValCeilAltFlag", value: "totContValCeilAltFlag", label: "Total Contract Value Ceiling Alt Flag", key: "totContValCeilAltFlag", allowReplace: true },

//     { id: "totContValCostCeilProdAmt", value: "totContValCostCeilProdAmt", label: "Total Contract Value Cost Ceiling Prod Amt", key: "totContValCostCeilProdAmt", allowReplace: true },
//     { id: "totContValCostCeilProdFlag", value: "totContValCostCeilProdFlag", label: "Total Contract Value Cost Ceiling Prod Flag", key: "totContValCostCeilProdFlag", allowReplace: true },
//     { id: "totContValCostCeilAltFlag", value: "totContValCostCeilAltFlag", label: "Total Contract Value Cost Ceiling Alt Flag", key: "totContValCostCeilAltFlag", allowReplace: true },

//     { id: "totContValFeeCeilProdAmt", value: "totContValFeeCeilProdAmt", label: "Total Contract Value Fee Ceiling Prod Amt", key: "totContValFeeCeilProdAmt", allowReplace: true },
//     { id: "totContValFeeCeilProdFlag", value: "totContValFeeCeilProdFlag", label: "Total Contract Value Fee Ceiling Prod Flag", key: "totContValFeeCeilProdFlag", allowReplace: true },
//     { id: "totContValFeeCeilAltFlag", value: "totContValFeeCeilAltFlag", label: "Total Contract Value Fee Ceiling Alt Flag", key: "totContValFeeCeilAltFlag", allowReplace: true },
//   ];

//   const getRowKey = (row) => row ? String(row.tempId || row.projectId || row.id || "") : "";

//   const handleFieldChange = React.useCallback((rowId, field, value) => {
//     setProfiles((prev) =>
//       prev.map((row) => {
//         if (getRowKey(row) === String(rowId)) {
//           return { ...row, [field]: value, isDirty: true };
//         }
//         return row;
//       })
//     );
//     setSelectedRow((prev) => {
//       if (!prev) return prev;
//       return { ...prev, [field]: value, isDirty: true };
//     });
//   }, []);

//   const handleAdd = () => {
//     const tempId = `NEW_${Date.now()}`;
//     const newProfile = {
//       tempId,
//       projectId: "",
//       includeInactive: false,
//       recordStatus: "",
//       isDirty: true,
//       modifications: []
//     };
//     setProfiles([newProfile, ...profiles]);
//     setSelectedRow(newProfile);
//     setSelectedRowKey(tempId);
//     setIsFormView(true);
//   };

//   const handleSave = async () => {
//     const changedRows = profiles.filter(p => p.isDirty);
//     if (changedRows.length === 0) return toast.info("No changes to save.");

//     // Simulate save
//     setLoading(true);
//     setTimeout(() => {
//       setProfiles(prev => prev.map(p => ({ ...p, isDirty: false, id: p.id || p.projectId })));
//       setSelectedRow(prev => prev ? { ...prev, isDirty: false, id: prev.id || prev.projectId } : null);
//       setLoading(false);
//       toast.success("Saved successfully (Mock)");
//     }, 500);
//   };

//   const handleCopy = () => {
//     if (!selectedRow) return toast.warn("Select a record to copy");
//     setClipboard([selectedRow]);
//     toast.success("1 record copied");
//   };

//   const handlePaste = () => {
//     if (clipboard.length === 0) return toast.warn("Nothing to paste");
//     const pasted = clipboard.map((c, i) => ({
//       ...c,
//       tempId: `PASTE_${Date.now()}_${i}`,
//       projectId: "",
//       isDirty: true
//     }));
//     setProfiles(prev => [...pasted, ...prev]);
//     setSelectedRow(pasted[0]);
//     setSelectedRowKey(pasted[0].tempId);
//     toast.success("Pasted successfully");
//   };

//   const handleDelete = () => {
//     if (!selectedRow) return toast.warn("Select a record to delete");
//     setProfiles(prev => prev.filter(p => getRowKey(p) !== getRowKey(selectedRow)));
//     setSelectedRow(null);
//     toast.success("Deleted successfully");
//   };

//   const handleDiscard = () => {
//     toast.info("Discarded changes");
//   };

//   const handleFindReplace = (targetColumn, findValue, replaceValue) => {
//     if (!findValue) return toast.warn("Enter a value to find.");
//     let count = 0;

//     const updatedProfiles = profiles.map(profile => {
//       const val = String(profile[targetColumn] || "");
//       if (val.toLowerCase().includes(findValue.toLowerCase())) {
//         count++;
//         return { ...profile, [targetColumn]: replaceValue, isDirty: true };
//       }
//       return profile;
//     });

//     if (count > 0) {
//       setProfiles(updatedProfiles);
//       toast.success(`Replaced ${count} occurrences in ${targetColumn}.`);
//     } else {
//       toast.info("No matches found.");
//     }
//   };

//   const renderTopSection = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//       <FormInput
//         label="Project *"
//         value={selectedRow?.projectId || ""}
//         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "projectId", e.target.value)}
//         isLookup
//       />
//       <div className="flex items-center gap-2 pt-6">
//         <input
//           type="checkbox"
//           checked={selectedRow?.includeInactive === true || selectedRow?.includeInactive === "Y"}
//           onChange={(e) => handleFieldChange(getRowKey(selectedRow), "includeInactive", e.target.checked ? "Y" : "N")}
//           className="h-4 w-4 accent-[#17414d]"
//         />
//         <label className="text-[10px] font-bold text-gray-700 uppercase">Include Inactive Projects in lookup</label>
//       </div>
//       <FormInput
//         label="Record Status"
//         value={selectedRow?.recordStatus || ""}
//         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "recordStatus", e.target.value)}
//       />
//     </div>
//   );

//   const [activeBasicTab, setActiveBasicTab] = useState("Basic Info");

//   const renderBasicInfo = () => (
//     <div className="border border-gray-200 rounded p-2 bg-gray-50/50">
//       <div className="flex gap-4 border-b border-gray-200 mb-2">
//         {["Basic Info", "Total Ceilings"].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveBasicTab(tab)}
//             className={`px-2 py-1 text-[11px] font-bold transition-all ${activeBasicTab === tab ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-500"}`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//       {activeBasicTab === "Basic Info" && (
//         <div className="overflow-x-auto">
//           <table className="w-full text-[10px] text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="py-1 font-semibold text-gray-600">Field</th>
//                 <th className="py-1 font-semibold text-gray-600">Production Value</th>
//                 <th className="py-1 font-semibold text-gray-600">Prod Allow Edit</th>
//                 <th className="py-1 font-semibold text-gray-600">Alternate Profile Override</th>
//                 <th className="py-1 font-semibold text-gray-600">Alt Allow Edit</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[
//                 { label: "Active Flag", pfx: "activeFlag" },
//                 { label: "Allow Charging Flag", pfx: "allowChg" },
//                 { label: "Project Account Group", pfx: "projAcctGrp" },
//                 { label: "Apply Cost of Money Rates", pfx: "applyCostMoney" },
//                 { label: "Owning Org", pfx: "owningOrg" }
//               ].map((row, idx) => (
//                 <tr key={idx} className="border-b border-gray-100 last:border-none hover:bg-gray-50">
//                   <td className="py-1">{row.label}</td>
//                   <td className="py-1"><input type="text" className="border px-1 border-gray-300 rounded w-24 outline-none focus:border-blue-500" value={selectedRow?.[`${row.pfx}ProdVal`] || ""} onChange={(e) => handleFieldChange(getRowKey(selectedRow), `${row.pfx}ProdVal`, e.target.value)} /></td>
//                   <td className="py-1"><input type="checkbox" className="accent-[#17414d]" checked={selectedRow?.[`${row.pfx}ProdEdit`] === "Y"} onChange={(e) => handleFieldChange(getRowKey(selectedRow), `${row.pfx}ProdEdit`, e.target.checked ? "Y" : "N")} /></td>
//                   <td className="py-1">
//                     {row.label.includes("Group") || row.label.includes("Org") ?
//                       <input type="text" className="border px-1 border-gray-300 rounded w-24 outline-none focus:border-blue-500" value={selectedRow?.[`${row.pfx}AltOvr`] || ""} onChange={(e) => handleFieldChange(getRowKey(selectedRow), `${row.pfx}AltOvr`, e.target.value)} /> :
//                       <select className="border border-gray-300 rounded w-24 outline-none" value={selectedRow?.[`${row.pfx}AltOvr`] || ""} onChange={(e) => handleFieldChange(getRowKey(selectedRow), `${row.pfx}AltOvr`, e.target.value)}><option value="">-None-</option></select>
//                     }
//                   </td>
//                   <td className="py-1"><select className="border border-gray-300 rounded w-24 outline-none" value={selectedRow?.[`${row.pfx}AltEdit`] || ""} onChange={(e) => handleFieldChange(getRowKey(selectedRow), `${row.pfx}AltEdit`, e.target.value)}><option value="">-None-</option></select></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {activeBasicTab === "Total Ceilings" && (
//         <div className="overflow-x-auto">
//           <table className="w-full text-[10px] text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-200">
//                 <th className="py-1 font-semibold text-gray-600">Field</th>
//                 <th className="py-1 font-semibold text-gray-600">Production Amounts</th>
//                 <th className="py-1 font-semibold text-gray-600">Production Ceiling Flag</th>
//                 <th className="py-1 font-semibold text-gray-600">Alternate Profile Override Ceiling Flag</th>
//               </tr>
//             </thead>
//             <tbody>
//               {[
//                 { label: "Total Funded Ceiling", pfx: "totFundCeil" },
//                 { label: "Total Funded Cost Ceiling", pfx: "totFundCostCeil" },
//                 { label: "Total Funded Fee Ceiling", pfx: "totFundFeeCeil" },
//                 { label: "Total Contract Value Ceiling", pfx: "totContValCeil" },
//                 { label: "Total Contract Value Cost Ceiling", pfx: "totContValCostCeil" },
//                 { label: "Total Contract Value Fee Ceiling", pfx: "totContValFeeCeil" }
//               ].map((row, idx) => (
//                 <tr key={idx} className="border-b border-gray-100 last:border-none hover:bg-gray-50">
//                   <td className="py-1">{row.label}</td>
//                   <td className="py-1"><input type="text" className="border px-1 border-gray-300 rounded w-32 outline-none focus:border-blue-500" value={selectedRow?.[`${row.pfx}ProdAmt`] || ""} onChange={(e) => handleFieldChange(getRowKey(selectedRow), `${row.pfx}ProdAmt`, e.target.value)} /></td>
//                   <td className="py-1"><input type="text" className="border px-1 border-gray-300 rounded w-24 outline-none focus:border-blue-500" value={selectedRow?.[`${row.pfx}ProdFlag`] || ""} onChange={(e) => handleFieldChange(getRowKey(selectedRow), `${row.pfx}ProdFlag`, e.target.value)} /></td>
//                   <td className="py-1"><input type="text" className="border px-1 border-gray-300 rounded w-24 outline-none focus:border-blue-500" value={selectedRow?.[`${row.pfx}AltFlag`] || ""} onChange={(e) => handleFieldChange(getRowKey(selectedRow), `${row.pfx}AltFlag`, e.target.value)} /></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//     <MainContainer title="Manage Alternate Project Revenue Profiles">
//       <Toolbar
//         isFormView={isFormView}
//         columns={tableColumns}
//         searchValue={searchValue}
//         setSearchValue={setSearchValue}
//         currentIndex={profiles.findIndex(p => getRowKey(p) === getRowKey(selectedRow))}
//         totalRecords={profiles.length}
//         handleNavigate={(dir) => {
//           const idx = profiles.findIndex(p => getRowKey(p) === getRowKey(selectedRow));
//           if (dir === 'prev' && idx > 0) { setSelectedRow(profiles[idx - 1]); setSelectedRowKey(getRowKey(profiles[idx - 1])); }
//           if (dir === 'next' && idx < profiles.length - 1) { setSelectedRow(profiles[idx + 1]); setSelectedRowKey(getRowKey(profiles[idx + 1])); }
//         }}
//         actions={{
//           onAdd: handleAdd,
//           onCopy: handleCopy,
//           onPaste: handlePaste,
//           onClear: handleDiscard,
//           onDelete: handleDelete,
//           onSave: handleSave,
//           onToggleView: () => setIsFormView(!isFormView)
//         }}
//         handleFindReplace={handleFindReplace}
//         selectedRow={selectedRow}
//         isDirty={profiles.some(p => p.isDirty)}
//         clipboardCount={clipboard.length}
//         clipboard={clipboard}
//       />

//       <div className="p-2 h-[calc(100vh-140px)] flex flex-col gap-2 overflow-y-auto custom-scrollbar">
//         {!isFormView ? (
//           <ReusableTable
//             data={profiles}
//             columns={tableColumns}
//             onFieldChange={handleFieldChange}
//             rowKey={getRowKey}
//             selectedRows={selectedIds}
//             onRowSelect={(item) => {
//               const id = getRowKey(item);
//               const newIds = new Set(selectedIds);
//               if (newIds.has(id)) newIds.delete(id); else newIds.add(id);
//               setSelectedIds(newIds);
//               setSelectedRow(item);
//               setSelectedRowKey(id);
//             }}
//             maxHeight="max-h-[60vh]"
//           />
//         ) : (
//           <div className="flex flex-col gap-4">
//             {renderTopSection()}

//             <div className="p-2 border border-gray-200 rounded bg-gray-50 mb-4">
//               {renderBasicInfo()}
//             </div>
//           </div>
//         )}

//         {/* Tab Buttons visible in both Form View and Table View */}
//         <div className="flex flex-wrap gap-2 mt-2 px-1 pb-2">
//           {[
//             { id: "modifications", label: "Modifications" },
//             { id: "revenueInfo", label: "Revenue Info" },
//             { id: "dirCostCeil", label: "Dir Cost Ceil" },
//             { id: "dirHrsCeil", label: "Dir Hrs Ceil" },
//             { id: "emplHrsCeil", label: "Empl Hrs Ceil" },
//             { id: "vendHrsCeil", label: "Vend Hrs Ceil" }
//           ].map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveNestedTabs(prev => ({ ...prev, [tab.id]: true }))}
//               className={`px-3 py-1 rounded text-[10px] font-bold transition-colors whitespace-nowrap border cursor-pointer ${activeNestedTabs[tab.id]
//                   ? "bg-[#17414d] text-white border-[#17414d] shadow-md"
//                   : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe]"
//                 }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {!isFormView && (
//         <div className="w-full bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 mt-1 rounded-b-xl">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             className="text-[#17414d] disabled:opacity-30"
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <div className="flex items-center gap-1">
//             <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#17414d] text-white font-bold text-xs">
//               {currentPage}
//             </span>
//             <span className="text-gray-500 text-xs px-1">of 1</span>
//           </div>
//           <button
//             onClick={() => setCurrentPage(prev => prev + 1)}
//             className="text-[#17414d] disabled:opacity-30"
//             disabled={true}
//           >
//             <ChevronRight size={18} />
//           </button>
//           <div className="relative flex items-center rounded px-2 bg-white ml-2">
//             <select
//               value={pageSize}
//               onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
//               className="appearance-none bg-transparent py-1 pr-4 pl-1 focus:outline-none cursor-pointer text-xs text-black"
//             >
//               <option value={15}>15 / page</option>
//               <option value={25}>25 / page</option>
//               <option value={50}>50 / page</option>
//             </select>
//             <ChevronDown size={14} className="absolute right-1 text-gray-400 pointer-events-none" />
//           </div>
//         </div>
//       )}
//     </MainContainer>

//     <div className="flex flex-col gap-4 mt-4">
//       {Object.keys(activeNestedTabs).reverse().map((tabId) => {
//         if (!activeNestedTabs[tabId]) return null;

//         const props = {
//           data: selectedRow || {},
//           onChange: handleFieldChange,
//           handleClose: () => {
//             setActiveNestedTabs(prev => {
//               const next = { ...prev };
//               delete next[tabId];
//               return next;
//             });
//           }
//         };

//         switch (tabId) {
//           case "modifications": return <AltProjRevProfileMods key={tabId} {...props} />;
//           case "revenueInfo": return <RevenueInfoTab key={tabId} {...props} />;
//           case "dirCostCeil": return <DirCostCeilTab key={tabId} {...props} />;
//           case "dirHrsCeil": return <DirHrsCeilTab key={tabId} {...props} />;
//           case "emplHrsCeil": return <EmplHrsCeilTab key={tabId} {...props} />;
//           case "vendHrsCeil": return <VendHrsCeilTab key={tabId} {...props} />;
//           default: return null;
//         }
//       })}
//     </div>
//     </>
//   );
// };

// export default ManageAlternateProjectRevenueProfiles;

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import AltProjRevProfileMods from "./AltProjRevProfileMods";
import RevenueInfoTab from "./RevenueInfoTab";
import DirCostCeilTab from "./DirCostCeilTab";
import DirHrsCeilTab from "./DirHrsCeilTab";
import EmplHrsCeilTab from "./EmplHrsCeilTab";
import VendHrsCeilTab from "./VendHrsCeilTab";
import { FormSection, FormInput } from "../helper/formSection";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { backendUrl } from "./config";

const ManageAlternateProjectRevenueProfiles = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [activeNestedTabs, setActiveNestedTabs] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [profiles, setProfiles] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clipboard, setClipboard] = useState([]);
  const [masterProfiles, setMasterProfiles] = useState([]);

  // Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [searchValue, setSearchValue] = useState("");
  const [searchColumn, setSearchColumn] = useState("projectId");
  const [selectedRowKey, setSelectedRowKey] = useState("");

  const tableColumns = [
    {
      id: "projectId",
      value: "projectId",
      label: "Project *",
      key: "projectId",
      allowReplace: false,
    },
    {
      id: "includeInactive",
      value: "includeInactive",
      label: "Include Inactive Projects in lookup",
      key: "includeInactive",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "recordStatus",
      value: "recordStatus",
      label: "Record Status",
      key: "recordStatus",
      allowReplace: true,
    },

    // Basic Info
    {
      id: "activeFlagProdVal",
      value: "activeFlagProdVal",
      label: "Active Flag Prod Val",
      key: "activeFlagProdVal",
      allowReplace: true,
    },
    {
      id: "activeFlagProdEdit",
      value: "activeFlagProdEdit",
      label: "Active Flag Prod Edit",
      key: "activeFlagProdEdit",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "activeFlagAltOvr",
      value: "activeFlagAltOvr",
      label: "Active Flag Alt Ovr",
      key: "activeFlagAltOvr",
      allowReplace: true,
    },
    {
      id: "activeFlagAltEdit",
      value: "activeFlagAltEdit",
      label: "Active Flag Alt Edit",
      key: "activeFlagAltEdit",
      allowReplace: true,
    },

    {
      id: "allowChgProdVal",
      value: "allowChgProdVal",
      label: "Allow Charging Prod Val",
      key: "allowChgProdVal",
      allowReplace: true,
    },
    {
      id: "allowChgProdEdit",
      value: "allowChgProdEdit",
      label: "Allow Charging Prod Edit",
      key: "allowChgProdEdit",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "allowChgAltOvr",
      value: "allowChgAltOvr",
      label: "Allow Charging Alt Ovr",
      key: "allowChgAltOvr",
      allowReplace: true,
    },
    {
      id: "allowChgAltEdit",
      value: "allowChgAltEdit",
      label: "Allow Charging Alt Edit",
      key: "allowChgAltEdit",
      allowReplace: true,
    },

    {
      id: "projAcctGrpProdVal",
      value: "projAcctGrpProdVal",
      label: "Project Account Group Prod Val",
      key: "projAcctGrpProdVal",
      allowReplace: true,
    },
    {
      id: "projAcctGrpProdEdit",
      value: "projAcctGrpProdEdit",
      label: "Project Account Group Prod Edit",
      key: "projAcctGrpProdEdit",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "projAcctGrpAltOvr",
      value: "projAcctGrpAltOvr",
      label: "Project Account Group Alt Ovr",
      key: "projAcctGrpAltOvr",
      allowReplace: true,
    },
    {
      id: "projAcctGrpAltEdit",
      value: "projAcctGrpAltEdit",
      label: "Project Account Group Alt Edit",
      key: "projAcctGrpAltEdit",
      allowReplace: true,
    },

    {
      id: "applyCostMoneyProdVal",
      value: "applyCostMoneyProdVal",
      label: "Apply Cost Money Prod Val",
      key: "applyCostMoneyProdVal",
      allowReplace: true,
    },
    {
      id: "applyCostMoneyProdEdit",
      value: "applyCostMoneyProdEdit",
      label: "Apply Cost Money Prod Edit",
      key: "applyCostMoneyProdEdit",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "applyCostMoneyAltOvr",
      value: "applyCostMoneyAltOvr",
      label: "Apply Cost Money Alt Ovr",
      key: "applyCostMoneyAltOvr",
      allowReplace: true,
    },
    {
      id: "applyCostMoneyAltEdit",
      value: "applyCostMoneyAltEdit",
      label: "Apply Cost Money Alt Edit",
      key: "applyCostMoneyAltEdit",
      allowReplace: true,
    },

    {
      id: "owningOrgProdVal",
      value: "owningOrgProdVal",
      label: "Owning Org Prod Val",
      key: "owningOrgProdVal",
      allowReplace: true,
    },
    {
      id: "owningOrgProdEdit",
      value: "owningOrgProdEdit",
      label: "Owning Org Prod Edit",
      key: "owningOrgProdEdit",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "owningOrgAltOvr",
      value: "owningOrgAltOvr",
      label: "Owning Org Alt Ovr",
      key: "owningOrgAltOvr",
      allowReplace: true,
    },
    {
      id: "owningOrgAltEdit",
      value: "owningOrgAltEdit",
      label: "Owning Org Alt Edit",
      key: "owningOrgAltEdit",
      allowReplace: true,
    },

    // Total Ceilings
    {
      id: "totFundCeilProdAmt",
      value: "totFundCeilProdAmt",
      label: "Total Funded Ceiling Prod Amt",
      key: "totFundCeilProdAmt",
      allowReplace: true,
    },
    {
      id: "totFundCeilProdFlag",
      value: "totFundCeilProdFlag",
      label: "Total Funded Ceiling Prod Flag",
      key: "totFundCeilProdFlag",
      allowReplace: true,
    },
    {
      id: "totFundCeilAltFlag",
      value: "totFundCeilAltFlag",
      label: "Total Funded Ceiling Alt Flag",
      key: "totFundCeilAltFlag",
      allowReplace: true,
    },

    {
      id: "totFundCostCeilProdAmt",
      value: "totFundCostCeilProdAmt",
      label: "Total Funded Cost Ceiling Prod Amt",
      key: "totFundCostCeilProdAmt",
      allowReplace: true,
    },
    {
      id: "totFundCostCeilProdFlag",
      value: "totFundCostCeilProdFlag",
      label: "Total Funded Cost Ceiling Prod Flag",
      key: "totFundCostCeilProdFlag",
      allowReplace: true,
    },
    {
      id: "totFundCostCeilAltFlag",
      value: "totFundCostCeilAltFlag",
      label: "Total Funded Cost Ceiling Alt Flag",
      key: "totFundCostCeilAltFlag",
      allowReplace: true,
    },

    {
      id: "totFundFeeCeilProdAmt",
      value: "totFundFeeCeilProdAmt",
      label: "Total Funded Fee Ceiling Prod Amt",
      key: "totFundFeeCeilProdAmt",
      allowReplace: true,
    },
    {
      id: "totFundFeeCeilProdFlag",
      value: "totFundFeeCeilProdFlag",
      label: "Total Funded Fee Ceiling Prod Flag",
      key: "totFundFeeCeilProdFlag",
      allowReplace: true,
    },
    {
      id: "totFundFeeCeilAltFlag",
      value: "totFundFeeCeilAltFlag",
      label: "Total Funded Fee Ceiling Alt Flag",
      key: "totFundFeeCeilAltFlag",
      allowReplace: true,
    },

    {
      id: "totContValCeilProdAmt",
      value: "totContValCeilProdAmt",
      label: "Total Contract Value Ceiling Prod Amt",
      key: "totContValCeilProdAmt",
      allowReplace: true,
    },
    {
      id: "totContValCeilProdFlag",
      value: "totContValCeilProdFlag",
      label: "Total Contract Value Ceiling Prod Flag",
      key: "totContValCeilProdFlag",
      allowReplace: true,
    },
    {
      id: "totContValCeilAltFlag",
      value: "totContValCeilAltFlag",
      label: "Total Contract Value Ceiling Alt Flag",
      key: "totContValCeilAltFlag",
      allowReplace: true,
    },

    {
      id: "totContValCostCeilProdAmt",
      value: "totContValCostCeilProdAmt",
      label: "Total Contract Value Cost Ceiling Prod Amt",
      key: "totContValCostCeilProdAmt",
      allowReplace: true,
    },
    {
      id: "totContValCostCeilProdFlag",
      value: "totContValCostCeilProdFlag",
      label: "Total Contract Value Cost Ceiling Prod Flag",
      key: "totContValCostCeilProdFlag",
      allowReplace: true,
    },
    {
      id: "totContValCostCeilAltFlag",
      value: "totContValCostCeilAltFlag",
      label: "Total Contract Value Cost Ceiling Alt Flag",
      key: "totContValCostCeilAltFlag",
      allowReplace: true,
    },

    {
      id: "totContValFeeCeilProdAmt",
      value: "totContValFeeCeilProdAmt",
      label: "Total Contract Value Fee Ceiling Prod Amt",
      key: "totContValFeeCeilProdAmt",
      allowReplace: true,
    },
    {
      id: "totContValFeeCeilProdFlag",
      value: "totContValFeeCeilProdFlag",
      label: "Total Contract Value Fee Ceiling Prod Flag",
      key: "totContValFeeCeilProdFlag",
      allowReplace: true,
    },
    {
      id: "totContValFeeCeilAltFlag",
      value: "totContValFeeCeilAltFlag",
      label: "Total Contract Value Fee Ceiling Alt Flag",
      key: "totContValFeeCeilAltFlag",
      allowReplace: true,
    },
  ];

  const getRowKey = (row) =>
    row ? String(row.tempId || row.projectId || row.id || "") : "";

  const handleFieldChange = React.useCallback((rowId, field, value) => {
    setProfiles((prev) =>
      prev.map((row) => {
        if (getRowKey(row) === String(rowId)) {
          return { ...row, [field]: value, isDirty: true };
        }
        return row;
      }),
    );
    setSelectedRow((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value, isDirty: true };
    });
  }, []);

  const handleAdd = () => {
    const tempId = `NEW_${Date.now()}`;
    const newProfile = {
      tempId,
      projectId: "",
      includeInactive: false,
      recordStatus: "",
      isDirty: true,
      modifications: [],
    };
    setProfiles([newProfile, ...profiles]);
    setSelectedRow(newProfile);
    setSelectedRowKey(tempId);
    setIsFormView(true);
  };

  const handleSave = async () => {
    const changedRows = profiles.filter((p) => p.isDirty);
    if (changedRows.length === 0) return toast.info("No changes to save.");

    // Simulate save
    setLoading(true);
    setTimeout(() => {
      setProfiles((prev) =>
        prev.map((p) => ({ ...p, isDirty: false, id: p.id || p.projectId })),
      );
      setSelectedRow((prev) =>
        prev
          ? { ...prev, isDirty: false, id: prev.id || prev.projectId }
          : null,
      );
      setLoading(false);
      toast.success("Saved successfully (Mock)");
    }, 500);
  };

  const handleCopy = () => {
    if (!selectedRow) return toast.warn("Select a record to copy");
    setClipboard([selectedRow]);
    toast.success("1 record copied");
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Nothing to paste");
    const pasted = clipboard.map((c, i) => ({
      ...c,
      tempId: `PASTE_${Date.now()}_${i}`,
      projectId: "",
      isDirty: true,
    }));
    setProfiles((prev) => [...pasted, ...prev]);
    setSelectedRow(pasted[0]);
    setSelectedRowKey(pasted[0].tempId);
    toast.success("Pasted successfully");
  };

  const handleDelete = () => {
    if (!selectedRow) return toast.warn("Select a record to delete");
    setProfiles((prev) =>
      prev.filter((p) => getRowKey(p) !== getRowKey(selectedRow)),
    );
    setSelectedRow(null);
    toast.success("Deleted successfully");
  };

  const handleDiscard = () => {
    toast.info("Discarded changes");
  };

  const handleFindReplace = (targetColumn, findValue, replaceValue) => {
    if (!findValue) return toast.warn("Enter a value to find.");
    let count = 0;

    const updatedProfiles = profiles.map((profile) => {
      const val = String(profile[targetColumn] || "");
      if (val.toLowerCase().includes(findValue.toLowerCase())) {
        count++;
        return { ...profile, [targetColumn]: replaceValue, isDirty: true };
      }
      return profile;
    });

    if (count > 0) {
      setProfiles(updatedProfiles);
      toast.success(`Replaced ${count} occurrences in ${targetColumn}.`);
    } else {
      toast.info("No matches found.");
    }
  };

  const renderTopSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <FormInput
        label="Project *"
        value={selectedRow?.projectId || ""}
        onChange={(e) =>
          handleFieldChange(getRowKey(selectedRow), "projectId", e.target.value)
        }
        isLookup
      />
      <div className="flex items-center gap-2 pt-6">
        <input
          type="checkbox"
          checked={
            selectedRow?.includeInactive === true ||
            selectedRow?.includeInactive === "Y"
          }
          onChange={(e) =>
            handleFieldChange(
              getRowKey(selectedRow),
              "includeInactive",
              e.target.checked ? "Y" : "N",
            )
          }
          className="h-4 w-4 accent-[#17414d]"
        />
        <label className="text-[10px] font-bold text-gray-700 uppercase">
          Include Inactive Projects in lookup
        </label>
      </div>
      <FormInput
        label="Record Status"
        value={selectedRow?.recordStatus || ""}
        onChange={(e) =>
          handleFieldChange(
            getRowKey(selectedRow),
            "recordStatus",
            e.target.value,
          )
        }
      />
    </div>
  );

  const [activeBasicTab, setActiveBasicTab] = useState("Basic Info");

  const renderBasicInfo = () => (
    <div className="border border-gray-200 rounded p-2 bg-gray-50/50">
      <div className="flex gap-4 border-b border-gray-200 mb-2">
        {["Basic Info", "Total Ceilings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveBasicTab(tab)}
            className={`px-2 py-1 text-[11px] font-bold transition-all ${activeBasicTab === tab ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-500"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      {activeBasicTab === "Basic Info" && (
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-1 font-semibold text-gray-600">Field</th>
                <th className="py-1 font-semibold text-gray-600">
                  Production Value
                </th>
                <th className="py-1 font-semibold text-gray-600">
                  Prod Allow Edit
                </th>
                <th className="py-1 font-semibold text-gray-600">
                  Alternate Profile Override
                </th>
                <th className="py-1 font-semibold text-gray-600">
                  Alt Allow Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Active Flag", pfx: "activeFlag" },
                { label: "Allow Charging Flag", pfx: "allowChg" },
                { label: "Project Account Group", pfx: "projAcctGrp" },
                { label: "Apply Cost of Money Rates", pfx: "applyCostMoney" },
                { label: "Owning Org", pfx: "owningOrg" },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  <td className="py-1">{row.label}</td>
                  <td className="py-1">
                    <input
                      type="text"
                      className="border px-1 border-gray-300 rounded w-24 outline-none focus:border-blue-500"
                      value={selectedRow?.[`${row.pfx}ProdVal`] || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedRow),
                          `${row.pfx}ProdVal`,
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="py-1">
                    <input
                      type="checkbox"
                      className="accent-[#17414d]"
                      checked={selectedRow?.[`${row.pfx}ProdEdit`] === "Y"}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedRow),
                          `${row.pfx}ProdEdit`,
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                  </td>
                  <td className="py-1">
                    {row.label.includes("Group") ||
                    row.label.includes("Org") ? (
                      <input
                        type="text"
                        className="border px-1 border-gray-300 rounded w-24 outline-none focus:border-blue-500"
                        value={selectedRow?.[`${row.pfx}AltOvr`] || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            getRowKey(selectedRow),
                            `${row.pfx}AltOvr`,
                            e.target.value,
                          )
                        }
                      />
                    ) : (
                      <select
                        className="border border-gray-300 rounded w-24 outline-none"
                        value={selectedRow?.[`${row.pfx}AltOvr`] || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            getRowKey(selectedRow),
                            `${row.pfx}AltOvr`,
                            e.target.value,
                          )
                        }
                      >
                        <option value="">-None-</option>
                      </select>
                    )}
                  </td>
                  <td className="py-1">
                    <select
                      className="border border-gray-300 rounded w-24 outline-none"
                      value={selectedRow?.[`${row.pfx}AltEdit`] || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedRow),
                          `${row.pfx}AltEdit`,
                          e.target.value,
                        )
                      }
                    >
                      <option value="">-None-</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {activeBasicTab === "Total Ceilings" && (
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-1 font-semibold text-gray-600">Field</th>
                <th className="py-1 font-semibold text-gray-600">
                  Production Amounts
                </th>
                <th className="py-1 font-semibold text-gray-600">
                  Production Ceiling Flag
                </th>
                <th className="py-1 font-semibold text-gray-600">
                  Alternate Profile Override Ceiling Flag
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Total Funded Ceiling", pfx: "totFundCeil" },
                { label: "Total Funded Cost Ceiling", pfx: "totFundCostCeil" },
                { label: "Total Funded Fee Ceiling", pfx: "totFundFeeCeil" },
                {
                  label: "Total Contract Value Ceiling",
                  pfx: "totContValCeil",
                },
                {
                  label: "Total Contract Value Cost Ceiling",
                  pfx: "totContValCostCeil",
                },
                {
                  label: "Total Contract Value Fee Ceiling",
                  pfx: "totContValFeeCeil",
                },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  <td className="py-1">{row.label}</td>
                  <td className="py-1">
                    <input
                      type="text"
                      className="border px-1 border-gray-300 rounded w-32 outline-none focus:border-blue-500"
                      value={selectedRow?.[`${row.pfx}ProdAmt`] || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedRow),
                          `${row.pfx}ProdAmt`,
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="py-1">
                    <input
                      type="text"
                      className="border px-1 border-gray-300 rounded w-24 outline-none focus:border-blue-500"
                      value={selectedRow?.[`${row.pfx}ProdFlag`] || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedRow),
                          `${row.pfx}ProdFlag`,
                          e.target.value,
                        )
                      }
                    />
                  </td>
                  <td className="py-1">
                    <input
                      type="text"
                      className="border px-1 border-gray-300 rounded w-24 outline-none focus:border-blue-500"
                      value={selectedRow?.[`${row.pfx}AltFlag`] || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedRow),
                          `${row.pfx}AltFlag`,
                          e.target.value,
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <>
      <MainContainer title="Manage Alternate Project Revenue Profiles">
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
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleDiscard,
            onDelete: handleDelete,
            onSave: handleSave,
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
              maxHeight="max-h-[60vh]"
            />
          ) : (
            <div className="flex flex-col gap-4">
              {renderTopSection()}

              <div className="p-2 border border-gray-200 rounded bg-gray-50 mb-4">
                {renderBasicInfo()}
              </div>
            </div>
          )}

          {/* Tab Buttons visible in both Form View and Table View */}
          <div className="flex flex-wrap gap-2 mt-2 px-1 pb-2">
            {[
              { id: "modifications", label: "Modifications" },
              { id: "revenueInfo", label: "Revenue Info" },
              { id: "dirCostCeil", label: "Dir Cost Ceil" },
              { id: "dirHrsCeil", label: "Dir Hrs Ceil" },
              { id: "emplHrsCeil", label: "Empl Hrs Ceil" },
              { id: "vendHrsCeil", label: "Vend Hrs Ceil" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveNestedTabs((prev) => ({ ...prev, [tab.id]: true }))
                }
                className={`px-3 py-1 rounded text-[10px] font-bold transition-colors whitespace-nowrap border cursor-pointer ${
                  activeNestedTabs[tab.id]
                    ? "bg-[#17414d] text-white border-[#17414d] shadow-md"
                    : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {!isFormView && (
          <div className="w-full bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 mt-1 rounded-b-xl">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="text-[#17414d] disabled:opacity-30"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#17414d] text-white font-bold text-xs">
                {currentPage}
              </span>
              <span className="text-gray-500 text-xs px-1">of 1</span>
            </div>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="text-[#17414d] disabled:opacity-30"
              disabled={true}
            >
              <ChevronRight size={18} />
            </button>
            <div className="relative flex items-center rounded px-2 bg-white ml-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent py-1 pr-4 pl-1 focus:outline-none cursor-pointer text-xs text-black"
              >
                <option value={15}>15 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-1 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        )}
      </MainContainer>

      <div className="flex flex-col gap-4 mt-4">
        {Object.keys(activeNestedTabs)
          .reverse()
          .map((tabId) => {
            if (!activeNestedTabs[tabId]) return null;

            const props = {
              data: selectedRow || {},
              onChange: handleFieldChange,
              handleClose: () => {
                setActiveNestedTabs((prev) => {
                  const next = { ...prev };
                  delete next[tabId];
                  return next;
                });
              },
            };

            switch (tabId) {
              case "modifications":
                return <AltProjRevProfileMods key={tabId} {...props} />;
              case "revenueInfo":
                return <RevenueInfoTab key={tabId} {...props} />;
              case "dirCostCeil":
                return <DirCostCeilTab key={tabId} {...props} />;
              case "dirHrsCeil":
                return <DirHrsCeilTab key={tabId} {...props} />;
              case "emplHrsCeil":
                return <EmplHrsCeilTab key={tabId} {...props} />;
              case "vendHrsCeil":
                return <VendHrsCeilTab key={tabId} {...props} />;
              default:
                return null;
            }
          })}
      </div>
    </>
  );
};

export default ManageAlternateProjectRevenueProfiles;
