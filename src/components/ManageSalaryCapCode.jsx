// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import { Layers } from 'lucide-react';
// import { MainContainer, SecondaryContainer, Toolbar } from '../helper/container';
// import { ReusableTable } from '../helper/tableSection';
// import { FormSection, FormInput } from '../helper/formSection';

// const columns = [
//   { id: "salaryCapCode", key: "salaryCapCode", label: "Salary Cap Code *", type: "text", required: true },
//   { id: "description", key: "description", label: "Description *", type: "text", required: true },
//   { id: "showInLookup", key: "showInLookup", label: "Show In Lookup", type: "checkbox" },
//   { id: "allow6DayPay", key: "allow6DayPay", label: "Allow 6 Day Pay", type: "checkbox" },
//   { id: "reimburse6DayPay", key: "reimburse6DayPay", label: "Reimburse 6 Day Pay", type: "checkbox" },
//   { id: "hoursInYear", key: "hoursInYear", label: "Hours in Year *", type: "number", required: true }
// ];

// const childColumns = [
//   { id: "effectiveStartDate", key: "effectiveStartDate", label: "Effective Start Date *", type: "date", required: true },
//   { id: "effectiveEndDate", key: "effectiveEndDate", label: "Effective End Date *", type: "date", required: true },
//   { id: "salaryCap", key: "salaryCap", label: "Salary Cap *", type: "number", required: true }
// ];

// const ManageSalaryCapCode = () => {
//   // Main Grid States
//   const [isFormView, setIsFormView] = useState(false);
//   const [records, setRecords] = useState([
//     {
//       id: '1',
//       salaryCapCode: 'NIH2026',
//       description: 'NIH Salary Cap 2026',
//       showInLookup: 'Y',
//       allow6DayPay: 'N',
//       reimburse6DayPay: 'N',
//       hoursInYear: '2080.00',
//       effectiveDates: [
//         { id: '101', effectiveStartDate: '2026-01-01', effectiveEndDate: '2026-12-31', salaryCap: '221900.00' }
//       ]
//     },
//     {
//       id: '2',
//       salaryCapCode: 'NSF2026',
//       description: 'NSF Salary Cap 2026',
//       showInLookup: 'Y',
//       allow6DayPay: 'Y',
//       reimburse6DayPay: 'Y',
//       hoursInYear: '2080.00',
//       effectiveDates: [
//         { id: '201', effectiveStartDate: '2026-01-01', effectiveEndDate: '2026-12-31', salaryCap: '185000.00' }
//       ]
//     }
//   ]);
  
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [clipboard, setClipboard] = useState([]);

//   // Child Grid States ("Effective Dates")
//   const [showEffectiveDates, setShowEffectiveDates] = useState(false);
//   const [selectedChildRow, setSelectedChildRow] = useState(null);
//   const [selectedChildIds, setSelectedChildIds] = useState(new Set());
//   const [childClipboard, setChildClipboard] = useState([]);

//   const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

//   // Main Field Change Handler
//   const handleFieldChange = (rowId, field, value) => {
//     setRecords(prev => prev.map(r => getRowKey(r) === String(rowId) ? { ...r, [field]: value, isDirty: true } : r));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== String(rowId)) return prev;
//       return { ...prev, [field]: value, isDirty: true };
//     });
//   };

//   // Main Actions
//   const handleAdd = () => {
//     const tempId = `NEW_${Date.now()}`;
//     const newRecord = {
//       id: tempId,
//       tempId,
//       salaryCapCode: '',
//       description: '',
//       showInLookup: 'Y',
//       allow6DayPay: 'N',
//       reimburse6DayPay: 'N',
//       hoursInYear: '2080.00',
//       effectiveDates: [],
//       isDirty: true
//     };
//     setRecords([newRecord, ...records]);
//     setSelectedRow(newRecord);
//     setSelectedIds(new Set([tempId]));
//     toast.success("New salary cap code added");
//   };

//   const handleCopy = () => {
//     if (!selectedRow) return toast.warn("Select a record to copy");
//     setClipboard([selectedRow]);
//     toast.success("Record copied to clipboard");
//   };

//   const handlePaste = () => {
//     if (clipboard.length === 0) return toast.warn("Nothing to paste");
//     const pasted = clipboard.map((item, idx) => {
//       const tempId = `PASTE_${Date.now()}_${idx}`;
//       return {
//         ...item,
//         id: tempId,
//         tempId,
//         isDirty: true,
//         effectiveDates: [...(item.effectiveDates || [])]
//       };
//     });
//     setRecords([...pasted, ...records]);
//     setSelectedRow(pasted[0]);
//     setSelectedIds(new Set([pasted[0].id]));
//     toast.success("Record pasted successfully");
//   };

//   const handleDelete = () => {
//     if (selectedIds.size === 0 && !selectedRow) {
//       return toast.warn("Select record(s) to delete");
//     }
//     const idsToDelete = selectedIds.size > 0 ? selectedIds : new Set([getRowKey(selectedRow)]);
//     setRecords(prev => prev.filter(r => !idsToDelete.has(getRowKey(r))));
//     setSelectedIds(new Set());
//     setSelectedRow(null);
//     setShowEffectiveDates(false);
//     toast.success("Record(s) deleted");
//   };

//   const handleSave = () => {
//     const hasInvalid = records.some(r => !r.salaryCapCode?.trim() || !r.description?.trim() || !r.hoursInYear);
//     if (hasInvalid) {
//       return toast.error("Salary Cap Code, Description, and Hours in Year are required!");
//     }
    
//     // Also validate child grids
//     let hasInvalidChild = false;
//     records.forEach(r => {
//       if ((r.effectiveDates || []).some(c => !c.effectiveStartDate?.trim() || !c.effectiveEndDate?.trim() || !c.salaryCap)) {
//         hasInvalidChild = true;
//       }
//     });
//     if (hasInvalidChild) {
//       return toast.error("Effective Start Date, End Date, and Salary Cap are required for all effective date records!");
//     }

//     setRecords(prev => prev.map(r => ({
//       ...r,
//       isDirty: false,
//       effectiveDates: (r.effectiveDates || []).map(c => ({ ...c, isDirty: false }))
//     })));
//     setSelectedRow(prev => prev ? {
//       ...prev,
//       isDirty: false,
//       effectiveDates: (prev.effectiveDates || []).map(c => ({ ...c, isDirty: false }))
//     } : null);
//     toast.success("Changes saved successfully!");
//   };

//   const handleDiscard = () => {
//     setRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
//     setSelectedRow(prev => prev ? { ...prev, isDirty: false } : null);
//     toast.info("Unsaved changes discarded");
//   };

//   // --- CHILD GRID ("Effective Dates") Operations ---
//   const handleChildFieldChange = (childId, field, value) => {
//     if (!selectedRow) return;
//     const parentId = getRowKey(selectedRow);
//     setRecords(prev => prev.map(r => {
//       if (getRowKey(r) === parentId) {
//         const updatedChildren = (r.effectiveDates || []).map(c =>
//           getRowKey(c) === String(childId) ? { ...c, [field]: value, isDirty: true } : c
//         );
//         return { ...r, effectiveDates: updatedChildren, isDirty: true };
//       }
//       return r;
//     }));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== parentId) return prev;
//       const updatedChildren = (prev.effectiveDates || []).map(c =>
//         getRowKey(c) === String(childId) ? { ...c, [field]: value, isDirty: true } : c
//       );
//       return { ...prev, effectiveDates: updatedChildren, isDirty: true };
//     });
//   };

//   const handleChildAdd = () => {
//     if (!selectedRow) return toast.warn("Select a parent record first");
//     const parentId = getRowKey(selectedRow);
//     const tempChildId = `CHILD_${Date.now()}`;
//     const newChild = {
//       id: tempChildId,
//       tempId: tempChildId,
//       effectiveStartDate: "",
//       effectiveEndDate: "",
//       salaryCap: "",
//       isDirty: true
//     };
//     setRecords(prev => prev.map(r => {
//       if (getRowKey(r) === parentId) {
//         return { ...r, effectiveDates: [newChild, ...(r.effectiveDates || [])], isDirty: true };
//       }
//       return r;
//     }));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== parentId) return prev;
//       return { ...prev, effectiveDates: [newChild, ...(prev.effectiveDates || [])], isDirty: true };
//     });
//     setSelectedChildIds(new Set([tempChildId]));
//     setSelectedChildRow(newChild);
//     toast.success("New effective date added");
//   };

//   const handleChildCopy = () => {
//     if (!selectedChildRow) return toast.warn("Select an effective date record to copy");
//     setChildClipboard([selectedChildRow]);
//     toast.success("Effective date copied");
//   };

//   const handleChildPaste = () => {
//     if (!selectedRow) return;
//     if (childClipboard.length === 0) return toast.warn("Nothing to paste");
//     const parentId = getRowKey(selectedRow);
//     const pasted = childClipboard.map((c, i) => {
//       const tempId = `CHILD_PASTE_${Date.now()}_${i}`;
//       return {
//         ...c,
//         id: tempId,
//         tempId,
//         isDirty: true
//       };
//     });
//     setRecords(prev => prev.map(r => {
//       if (getRowKey(r) === parentId) {
//         return { ...r, effectiveDates: [...pasted, ...(r.effectiveDates || [])], isDirty: true };
//       }
//       return r;
//     }));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== parentId) return prev;
//       return { ...prev, effectiveDates: [...pasted, ...(prev.effectiveDates || [])], isDirty: true };
//     });
//     setSelectedChildIds(new Set([pasted[0].id]));
//     setSelectedChildRow(pasted[0]);
//     toast.success("Effective date pasted successfully");
//   };

//   const handleChildDelete = () => {
//     if (!selectedRow) return;
//     if (selectedChildIds.size === 0 && !selectedChildRow) {
//       return toast.warn("Select effective date record(s) to delete");
//     }
//     const parentId = getRowKey(selectedRow);
//     const idsToDelete = selectedChildIds.size > 0 ? selectedChildIds : new Set([getRowKey(selectedChildRow)]);
//     setRecords(prev => prev.map(r => {
//       if (getRowKey(r) === parentId) {
//         return { ...r, effectiveDates: (r.effectiveDates || []).filter(c => !idsToDelete.has(getRowKey(c))), isDirty: true };
//       }
//       return r;
//     }));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== parentId) return prev;
//       return { ...prev, effectiveDates: (prev.effectiveDates || []).filter(c => !idsToDelete.has(getRowKey(c))), isDirty: true };
//     });
//     setSelectedChildIds(new Set());
//     setSelectedChildRow(null);
//     toast.success("Effective date record(s) deleted");
//   };

//   const isDirty = records.some(r => r.isDirty || (r.effectiveDates || []).some(c => c.isDirty));

//   const renderStickyHeader = () => (
//     <div className="bg-gray-50/80 p-2 rounded-lg border border-gray-200 mb-2 sticky top-0 z-40 backdrop-blur-sm shadow-sm">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
//         <FormInput
//           label="Salary Cap Code"
//           value={selectedRow?.salaryCapCode || ""}
//           readOnly
//         />
//         <FormInput
//           label="Description"
//           value={selectedRow?.description || ""}
//           readOnly
//         />
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
//       {/* MASTER: Salary Cap Codes */}
//       <MainContainer icon={Layers} title="Manage Salary Cap Code">
//         <Toolbar
//           isFormView={isFormView}
//           columns={columns}
//           currentIndex={records.findIndex(r => getRowKey(r) === getRowKey(selectedRow))}
//           totalRecords={records.length}
//           handleNavigate={(dir) => {
//             const idx = records.findIndex(r => getRowKey(r) === getRowKey(selectedRow));
//             let targetRow = null;
//             if (dir === 'start' && records.length > 0) {
//               targetRow = records[0];
//             } else if (dir === 'prev' && idx > 0) {
//               targetRow = records[idx - 1];
//             } else if (dir === 'next' && idx < records.length - 1) {
//               targetRow = records[idx + 1];
//             } else if (dir === 'end' && records.length > 0) {
//               targetRow = records[records.length - 1];
//             }
//             if (targetRow) {
//               setSelectedRow(targetRow);
//               setSelectedIds(new Set([getRowKey(targetRow)]));
//             }
//           }}
//           actions={{
//             onAdd: () => {
//               handleAdd();
//               setIsFormView(true);
//               setShowEffectiveDates(false);
//             },
//             onCopy: handleCopy,
//             onPaste: handlePaste,
//             onClear: handleDiscard,
//             onDelete: handleDelete,
//             onSave: handleSave,
//             onToggleView: () => {
//               if (!isFormView && !selectedRow && records.length > 0) {
//                 setSelectedRow(records[0]);
//                 setSelectedIds(new Set([getRowKey(records[0])]));
//               }
//               setIsFormView(!isFormView);
//             }
//           }}
//           selectedRow={selectedRow}
//           isDirty={isDirty}
//           clipboardCount={clipboard.length}
//           clipboard={clipboard}
//         />
//         <div className="mt-2">
//           {!isFormView ? (
//             <div className="bg-white border border-gray-200 p-2">
//               <ReusableTable
//                 data={records}
//                 columns={columns}
//                 selectedRows={selectedIds}
//                 onSelectAll={(e) => {
//                   if (e.target.checked) {
//                     setSelectedIds(new Set(records.map(getRowKey)));
//                   } else {
//                     setSelectedIds(new Set());
//                   }
//                 }}
//                 onRowSelect={(item) => {
//                   const key = getRowKey(item);
//                   const newIds = new Set(selectedIds);
//                   if (newIds.has(key)) {
//                     newIds.delete(key);
//                   } else {
//                     newIds.add(key);
//                   }
//                   setSelectedIds(newIds);
//                   setSelectedRow(item);
//                 }}
//                 onFieldChange={handleFieldChange}
//               />
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {renderStickyHeader()}
              
//               <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
//                 <FormSection title="Salary Cap Details">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
//                     <div className="space-y-3">
//                       <FormInput
//                         label="Salary Cap Code *"
//                         required
//                         value={selectedRow?.salaryCapCode || ""}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "salaryCapCode", e.target.value)}
//                       />
//                       <FormInput
//                         label="Description *"
//                         required
//                         value={selectedRow?.description || ""}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "description", e.target.value)}
//                       />
//                       <FormInput
//                         label="Show In Lookup"
//                         type="checkbox"
//                         checked={selectedRow?.showInLookup === 'Y'}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "showInLookup", e.target.checked ? "Y" : "N")}
//                       />
//                       <FormInput
//                         label="Number of Hours in Year for Salary Cap Calculation *"
//                         required
//                         type="number"
//                         value={selectedRow?.hoursInYear || "2080.00"}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "hoursInYear", e.target.value)}
//                       />
//                     </div>
                    
//                     <div className="space-y-2">
//                       <div className="p-3 border border-[#17414d]/30 rounded-md bg-[#e5f3fb]/20">
//                         <span className="text-[10px] font-bold text-[#17414d] block mb-2">6 Day Pay Options</span>
//                         <FormInput
//                           label="Allow 6 Day Pay"
//                           type="checkbox"
//                           checked={selectedRow?.allow6DayPay === 'Y'}
//                           onChange={(e) => handleFieldChange(getRowKey(selectedRow), "allow6DayPay", e.target.checked ? "Y" : "N")}
//                         />
//                         <div className="pl-4">
//                           <FormInput
//                             label="Reimburse 6 Day Pay up to Salary Cap"
//                             type="checkbox"
//                             checked={selectedRow?.reimburse6DayPay === 'Y'}
//                             disabled={selectedRow?.allow6DayPay !== 'Y'}
//                             onChange={(e) => handleFieldChange(getRowKey(selectedRow), "reimburse6DayPay", e.target.checked ? "Y" : "N")}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </FormSection>
//               </div>
//             </div>
//           )}

//           {/* Bottom Tabs/Buttons Row matching ManageEmployee style */}
//           <div className="flex flex-wrap gap-2 mt-2 px-1 pb-2 border-t border-gray-100 pt-2">
//             {[
//               "Effective Dates"
//             ].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   if (!selectedRow) {
//                     return toast.warn("Select a record to view effective dates");
//                   }
//                   setShowEffectiveDates(!showEffectiveDates);
//                 }}
//                 className={`px-3 py-1 rounded text-[10px] font-bold transition-colors whitespace-nowrap border cursor-pointer ${showEffectiveDates
//                     ? "bg-[#17414d] text-white border-[#17414d] shadow-md cursor-pointer"
//                     : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe] cursor-pointer"
//                   }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>
//         </div>
//       </MainContainer>

//       {/* DETAIL: Effective Dates Nested Grid */}
//       {showEffectiveDates && selectedRow && (
//         <SecondaryContainer
//           title="Salary Cap Code > Effective Dates"
//           handleClose={() => setShowEffectiveDates(false)}
//           className="mt-4 shadow-md bg-white border border-[#17414d]/40 rounded-xl"
//         >
//           <Toolbar
//             isFormView={false} // Table-only view
//             columns={childColumns}
//             actions={{
//               onAdd: handleChildAdd,
//               onCopy: handleChildCopy,
//               onPaste: handleChildPaste,
//               onClear: () => {}, // Handled by master save/discard
//               onDelete: handleChildDelete,
//               onSave: handleSave,
//               onToggleView: () => {}
//             }}
//             buttonsDisable={['tableform', 'discard']} // Hide form switch & discard in nested toolbar
//             selectedRow={selectedChildRow}
//             isDirty={selectedRow.effectiveDates?.some(c => c.isDirty)}
//             clipboardCount={childClipboard.length}
//             clipboard={childClipboard}
//           />
//           <div className="mt-2 bg-white border border-gray-200 p-2">
//             <ReusableTable
//               data={selectedRow.effectiveDates || []}
//               columns={childColumns}
//               selectedRows={selectedChildIds}
//               onSelectAll={(e) => {
//                 if (e.target.checked) {
//                   setSelectedChildIds(new Set((selectedRow.effectiveDates || []).map(getRowKey)));
//                 } else {
//                   setSelectedChildIds(new Set());
//                 }
//               }}
//               onRowSelect={(item) => {
//                 const key = getRowKey(item);
//                 const newIds = new Set(selectedChildIds);
//                 if (newIds.has(key)) {
//                   newIds.delete(key);
//                 } else {
//                   newIds.add(key);
//                 }
//                 setSelectedChildIds(newIds);
//                 setSelectedChildRow(item);
//               }}
//               onFieldChange={handleChildFieldChange}
//             />
//           </div>
//         </SecondaryContainer>
//       )}
//     </div>
//   );
// };

// export default ManageSalaryCapCode;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers } from 'lucide-react';
import { MainContainer, SecondaryContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput } from '../helper/formSection';

const columns = [
  { id: "salaryCapCode", key: "salaryCapCode", label: "Salary Cap Code *", type: "text", required: true },
  { id: "description", key: "description", label: "Description *", type: "text", required: true },
  { id: "showInLookup", key: "showInLookup", label: "Show In Lookup", type: "checkbox" },
  { id: "allow6DayPay", key: "allow6DayPay", label: "Allow 6 Day Pay", type: "checkbox" },
  { id: "reimburse6DayPay", key: "reimburse6DayPay", label: "Reimburse 6 Day Pay", type: "checkbox" },
  { id: "hoursInYear", key: "hoursInYear", label: "Hours in Year *", type: "number", required: true }
];

const childColumns = [
  { id: "effectiveStartDate", key: "effectiveStartDate", label: "Effective Start Date *", type: "date", required: true },
  { id: "effectiveEndDate", key: "effectiveEndDate", label: "Effective End Date *", type: "date", required: true },
  { id: "salaryCap", key: "salaryCap", label: "Salary Cap *", type: "number", required: true }
];

const ManageSalaryCapCode = () => {
  // Main Grid States
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    {
      id: '1',
      salaryCapCode: 'NIH2026',
      description: 'NIH Salary Cap 2026',
      showInLookup: 'Y',
      allow6DayPay: 'N',
      reimburse6DayPay: 'N',
      hoursInYear: '2080.00',
      effectiveDates: [
        { id: '101', effectiveStartDate: '2026-01-01', effectiveEndDate: '2026-12-31', salaryCap: '221900.00' }
      ]
    },
    {
      id: '2',
      salaryCapCode: 'NSF2026',
      description: 'NSF Salary Cap 2026',
      showInLookup: 'Y',
      allow6DayPay: 'Y',
      reimburse6DayPay: 'Y',
      hoursInYear: '2080.00',
      effectiveDates: [
        { id: '201', effectiveStartDate: '2026-01-01', effectiveEndDate: '2026-12-31', salaryCap: '185000.00' }
      ]
    }
  ]);
  
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);

  // Child Grid States ("Effective Dates")
  const [showEffectiveDates, setShowEffectiveDates] = useState(false);
  const [selectedChildRow, setSelectedChildRow] = useState(null);
  const [selectedChildIds, setSelectedChildIds] = useState(new Set());
  const [childClipboard, setChildClipboard] = useState([]);

  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

  // Main Field Change Handler
  const handleFieldChange = (rowId, field, value) => {
    setRecords(prev => prev.map(r => getRowKey(r) === String(rowId) ? { ...r, [field]: value, isDirty: true } : r));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== String(rowId)) return prev;
      return { ...prev, [field]: value, isDirty: true };
    });
  };

  // Main Actions
  const handleAdd = () => {
    const tempId = `NEW_${Date.now()}`;
    const newRecord = {
      id: tempId,
      tempId,
      salaryCapCode: '',
      description: '',
      showInLookup: 'Y',
      allow6DayPay: 'N',
      reimburse6DayPay: 'N',
      hoursInYear: '2080.00',
      effectiveDates: [],
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New salary cap code added");
  };

  const handleCopy = () => {
    if (!selectedRow) return toast.warn("Select a record to copy");
    setClipboard([selectedRow]);
    toast.success("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Nothing to paste");
    const pasted = clipboard.map((item, idx) => {
      const tempId = `PASTE_${Date.now()}_${idx}`;
      return {
        ...item,
        id: tempId,
        tempId,
        isDirty: true,
        effectiveDates: [...(item.effectiveDates || [])]
      };
    });
    setRecords([...pasted, ...records]);
    setSelectedRow(pasted[0]);
    setSelectedIds(new Set([pasted[0].id]));
    toast.success("Record pasted successfully");
  };

  const handleDelete = () => {
    if (selectedIds.size === 0 && !selectedRow) {
      return toast.warn("Select record(s) to delete");
    }
    const idsToDelete = selectedIds.size > 0 ? selectedIds : new Set([getRowKey(selectedRow)]);
    setRecords(prev => prev.filter(r => !idsToDelete.has(getRowKey(r))));
    setSelectedIds(new Set());
    setSelectedRow(null);
    setShowEffectiveDates(false);
    toast.success("Record(s) deleted");
  };

  const handleSave = () => {
    const hasInvalid = records.some(r => !r.salaryCapCode?.trim() || !r.description?.trim() || !r.hoursInYear);
    if (hasInvalid) {
      return toast.error("Salary Cap Code, Description, and Hours in Year are required!");
    }
    
    // Also validate child grids
    let hasInvalidChild = false;
    records.forEach(r => {
      if ((r.effectiveDates || []).some(c => !c.effectiveStartDate?.trim() || !c.effectiveEndDate?.trim() || !c.salaryCap)) {
        hasInvalidChild = true;
      }
    });
    if (hasInvalidChild) {
      return toast.error("Effective Start Date, End Date, and Salary Cap are required for all effective date records!");
    }

    setRecords(prev => prev.map(r => ({
      ...r,
      isDirty: false,
      effectiveDates: (r.effectiveDates || []).map(c => ({ ...c, isDirty: false }))
    })));
    setSelectedRow(prev => prev ? {
      ...prev,
      isDirty: false,
      effectiveDates: (prev.effectiveDates || []).map(c => ({ ...c, isDirty: false }))
    } : null);
    toast.success("Changes saved successfully!");
  };

  const handleDiscard = () => {
    setRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
    setSelectedRow(prev => prev ? { ...prev, isDirty: false } : null);
    toast.info("Unsaved changes discarded");
  };

  // --- CHILD GRID ("Effective Dates") Operations ---
  const handleChildFieldChange = (childId, field, value) => {
    if (!selectedRow) return;
    const parentId = getRowKey(selectedRow);
    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        const updatedChildren = (r.effectiveDates || []).map(c =>
          getRowKey(c) === String(childId) ? { ...c, [field]: value, isDirty: true } : c
        );
        return { ...r, effectiveDates: updatedChildren, isDirty: true };
      }
      return r;
    }));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      const updatedChildren = (prev.effectiveDates || []).map(c =>
        getRowKey(c) === String(childId) ? { ...c, [field]: value, isDirty: true } : c
      );
      return { ...prev, effectiveDates: updatedChildren, isDirty: true };
    });
  };

  const handleChildAdd = () => {
    if (!selectedRow) return toast.warn("Select a parent record first");
    const parentId = getRowKey(selectedRow);
    const tempChildId = `CHILD_${Date.now()}`;
    const newChild = {
      id: tempChildId,
      tempId: tempChildId,
      effectiveStartDate: "",
      effectiveEndDate: "",
      salaryCap: "",
      isDirty: true
    };
    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        return { ...r, effectiveDates: [newChild, ...(r.effectiveDates || [])], isDirty: true };
      }
      return r;
    }));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      return { ...prev, effectiveDates: [newChild, ...(prev.effectiveDates || [])], isDirty: true };
    });
    setSelectedChildIds(new Set([tempChildId]));
    setSelectedChildRow(newChild);
    toast.success("New effective date added");
  };

  const handleChildCopy = () => {
    if (!selectedChildRow) return toast.warn("Select an effective date record to copy");
    setChildClipboard([selectedChildRow]);
    toast.success("Effective date copied");
  };

  const handleChildPaste = () => {
    if (!selectedRow) return;
    if (childClipboard.length === 0) return toast.warn("Nothing to paste");
    const parentId = getRowKey(selectedRow);
    const pasted = childClipboard.map((c, i) => {
      const tempId = `CHILD_PASTE_${Date.now()}_${i}`;
      return {
        ...c,
        id: tempId,
        tempId,
        isDirty: true
      };
    });
    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        return { ...r, effectiveDates: [...pasted, ...(r.effectiveDates || [])], isDirty: true };
      }
      return r;
    }));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      return { ...prev, effectiveDates: [...pasted, ...(prev.effectiveDates || [])], isDirty: true };
    });
    setSelectedChildIds(new Set([pasted[0].id]));
    setSelectedChildRow(pasted[0]);
    toast.success("Effective date pasted successfully");
  };

  const handleChildDelete = () => {
    if (!selectedRow) return;
    if (selectedChildIds.size === 0 && !selectedChildRow) {
      return toast.warn("Select effective date record(s) to delete");
    }
    const parentId = getRowKey(selectedRow);
    const idsToDelete = selectedChildIds.size > 0 ? selectedChildIds : new Set([getRowKey(selectedChildRow)]);
    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        return { ...r, effectiveDates: (r.effectiveDates || []).filter(c => !idsToDelete.has(getRowKey(c))), isDirty: true };
      }
      return r;
    }));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      return { ...prev, effectiveDates: (prev.effectiveDates || []).filter(c => !idsToDelete.has(getRowKey(c))), isDirty: true };
    });
    setSelectedChildIds(new Set());
    setSelectedChildRow(null);
    toast.success("Effective date record(s) deleted");
  };

  const isDirty = records.some(r => r.isDirty || (r.effectiveDates || []).some(c => c.isDirty));

  const renderStickyHeader = () => (
    <div className="bg-gray-50/80 p-2 rounded-lg border border-gray-200 mb-2 sticky top-0 z-40 backdrop-blur-sm shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <FormInput
          label="Salary Cap Code"
          value={selectedRow?.salaryCapCode || ""}
          readOnly
        />
        <FormInput
          label="Description"
          value={selectedRow?.description || ""}
          readOnly
        />
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
      {/* MASTER: Salary Cap Codes */}
      <MainContainer icon={Layers} title="Manage Salary Cap Code">
        <Toolbar
          isFormView={isFormView}
          columns={columns}
          currentIndex={records.findIndex(r => getRowKey(r) === getRowKey(selectedRow))}
          totalRecords={records.length}
          handleNavigate={(dir) => {
            const idx = records.findIndex(r => getRowKey(r) === getRowKey(selectedRow));
            let targetRow = null;
            if (dir === 'start' && records.length > 0) {
              targetRow = records[0];
            } else if (dir === 'prev' && idx > 0) {
              targetRow = records[idx - 1];
            } else if (dir === 'next' && idx < records.length - 1) {
              targetRow = records[idx + 1];
            } else if (dir === 'end' && records.length > 0) {
              targetRow = records[records.length - 1];
            }
            if (targetRow) {
              setSelectedRow(targetRow);
              setSelectedIds(new Set([getRowKey(targetRow)]));
            }
          }}
          actions={{
            onAdd: () => {
              handleAdd();
              setIsFormView(true);
              setShowEffectiveDates(false);
            },
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleDiscard,
            onDelete: handleDelete,
            onSave: handleSave,
            onToggleView: () => {
              if (!isFormView && !selectedRow && records.length > 0) {
                setSelectedRow(records[0]);
                setSelectedIds(new Set([getRowKey(records[0])]));
              }
              setIsFormView(!isFormView);
            }
          }}
          selectedRow={selectedRow}
          isDirty={isDirty}
          clipboardCount={clipboard.length}
          clipboard={clipboard}
        />
        <div className="mt-2">
          {!isFormView ? (
            <div className="bg-white border border-gray-200 p-2">
              <ReusableTable
                data={records}
                columns={columns}
                selectedRows={selectedIds}
                onSelectAll={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(new Set(records.map(getRowKey)));
                  } else {
                    setSelectedIds(new Set());
                  }
                }}
                onRowSelect={(item) => {
                  const key = getRowKey(item);
                  const newIds = new Set(selectedIds);
                  if (newIds.has(key)) {
                    newIds.delete(key);
                  } else {
                    newIds.add(key);
                  }
                  setSelectedIds(newIds);
                  setSelectedRow(item);
                }}
                onFieldChange={handleFieldChange}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {renderStickyHeader()}
              
              <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
                <FormSection title="Salary Cap Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                    <div className="space-y-3">
                      <FormInput
                        label="Salary Cap Code *"
                        required
                        value={selectedRow?.salaryCapCode || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "salaryCapCode", e.target.value)}
                      />
                      <FormInput
                        label="Description *"
                        required
                        value={selectedRow?.description || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "description", e.target.value)}
                      />
                      <FormInput
                        label="Show In Lookup"
                        type="checkbox"
                        checked={selectedRow?.showInLookup === 'Y'}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "showInLookup", e.target.checked ? "Y" : "N")}
                      />
                      <FormInput
                        label="Number of Hours in Year for Salary Cap Calculation *"
                        required
                        type="number"
                        value={selectedRow?.hoursInYear || "2080.00"}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "hoursInYear", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="p-3 border border-[#17414d]/30 rounded-md bg-[#e5f3fb]/20">
                        <span className="text-[10px] font-bold text-[#17414d] block mb-2">6 Day Pay Options</span>
                        <FormInput
                          label="Allow 6 Day Pay"
                          type="checkbox"
                          checked={selectedRow?.allow6DayPay === 'Y'}
                          onChange={(e) => handleFieldChange(getRowKey(selectedRow), "allow6DayPay", e.target.checked ? "Y" : "N")}
                        />
                        <div className="pl-4">
                          <FormInput
                            label="Reimburse 6 Day Pay up to Salary Cap"
                            type="checkbox"
                            checked={selectedRow?.reimburse6DayPay === 'Y'}
                            disabled={selectedRow?.allow6DayPay !== 'Y'}
                            onChange={(e) => handleFieldChange(getRowKey(selectedRow), "reimburse6DayPay", e.target.checked ? "Y" : "N")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormSection>
              </div>
            </div>
          )}

          {/* Bottom Tabs/Buttons Row matching ManageEmployee style */}
          <div className="flex flex-wrap gap-2 mt-2 px-1 pb-2 border-t border-gray-100 pt-2">
            {[
              "Effective Dates"
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (!selectedRow) {
                    if (records.length > 0) {
                      const firstRec = records[0];
                      setSelectedRow(firstRec);
                      setSelectedIds(new Set([getRowKey(firstRec)]));
                      setShowEffectiveDates(true);
                    } else {
                      toast.warn("No salary cap code records available to view effective dates");
                    }
                    return;
                  }
                  setShowEffectiveDates(!showEffectiveDates);
                }}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-colors whitespace-nowrap border cursor-pointer ${showEffectiveDates
                    ? "bg-[#17414d] text-white border-[#17414d] shadow-md cursor-pointer"
                    : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe] cursor-pointer"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </MainContainer>

      {/* DETAIL: Effective Dates Nested Grid */}
      {showEffectiveDates && selectedRow && (
        <SecondaryContainer
          title="Salary Cap Code > Effective Dates"
          handleClose={() => setShowEffectiveDates(false)}
          className="mt-4 shadow-md bg-white border border-[#17414d]/40 rounded-xl"
        >
          <Toolbar
            isFormView={false} // Table-only view
            columns={childColumns}
            actions={{
              onAdd: handleChildAdd,
              onCopy: handleChildCopy,
              onPaste: handleChildPaste,
              onClear: () => {}, // Handled by master save/discard
              onDelete: handleChildDelete,
              onSave: handleSave,
              onToggleView: () => {}
            }}
            buttonsDisable={['tableform', 'discard']} // Hide form switch & discard in nested toolbar
            selectedRow={selectedChildRow}
            isDirty={selectedRow.effectiveDates?.some(c => c.isDirty)}
            clipboardCount={childClipboard.length}
            clipboard={childClipboard}
          />
          <div className="mt-2 bg-white border border-gray-200 p-2">
            <ReusableTable
              data={selectedRow.effectiveDates || []}
              columns={childColumns}
              selectedRows={selectedChildIds}
              onSelectAll={(e) => {
                if (e.target.checked) {
                  setSelectedChildIds(new Set((selectedRow.effectiveDates || []).map(getRowKey)));
                } else {
                  setSelectedChildIds(new Set());
                }
              }}
              onRowSelect={(item) => {
                const key = getRowKey(item);
                const newIds = new Set(selectedChildIds);
                if (newIds.has(key)) {
                  newIds.delete(key);
                } else {
                  newIds.add(key);
                }
                setSelectedChildIds(newIds);
                setSelectedChildRow(item);
              }}
              onFieldChange={handleChildFieldChange}
            />
          </div>
        </SecondaryContainer>
      )}
    </div>
  );
};

export default ManageSalaryCapCode;
