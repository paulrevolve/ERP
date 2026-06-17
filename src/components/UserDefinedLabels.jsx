// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import { Layers } from 'lucide-react';
// import { MainContainer, SecondaryContainer, Toolbar } from '../helper/container';
// import { ReusableTable } from '../helper/tableSection';
// import { FormSection, FormInput } from '../helper/formSection';

// const columns = [
//   { id: "seqNo", key: "seqNo", label: "Sequence Number *", type: "number" },
//   {
//     id: "dataType",
//     key: "dataType",
//     label: "Data Type *",
//     type: "select",
//     options: [
//       { label: "Text", value: "Text" },
//       { label: "Numeric", value: "Numeric" },
//       { label: "Date", value: "Date" }
//     ],
//     optionValue: "value",
//     optionLabel: "label"
//   },
//   { id: "labels", key: "labels", label: "Label *", type: "text" },
//   { id: "helpDesc", key: "helpDesc", label: "Help Description", type: "text" },
//   { id: "cpValidationField", key: "cpValidationField", label: "Costpoint Validation Field", type: "text" },
//   { id: "requiredFl", key: "requiredFl", label: "Required", type: "checkbox" }
// ];

// const childColumns = [
//   { id: "text", key: "text", label: "Text *", type: "text" },
//   { id: "description", key: "description", label: "Description", type: "text" }
// ];

// const UserDefinedLabels = () => {
//   // Main Grid States
//   const [isFormView, setIsFormView] = useState(false);
//   const [records, setRecords] = useState([
//     {
//       id: '1',
//       seqNo: 10,
//       dataType: 'Text',
//       labels: 'Employee Class',
//       helpDesc: 'Help text for Employee Class',
//       cpValidationField: '',
//       requiredFl: 'Y',
//       validatedTextRecords: [
//         { id: '101', text: 'FTE', description: 'Full Time Employee' },
//         { id: '102', text: 'PTE', description: 'Part Time Employee' }
//       ]
//     },
//     {
//       id: '2',
//       seqNo: 20,
//       dataType: 'Numeric',
//       labels: 'FTE Ratio',
//       helpDesc: 'Ratio of full time equivalency',
//       cpValidationField: '',
//       requiredFl: 'N',
//       validatedTextRecords: []
//     }
//   ]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [clipboard, setClipboard] = useState([]);

//   // Child Grid States ("Validated Text")
//   const [showValidatedText, setShowValidatedText] = useState(false);
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
//       seqNo: (records.length + 1) * 10,
//       dataType: 'Text',
//       labels: '',
//       helpDesc: '',
//       cpValidationField: '',
//       requiredFl: 'N',
//       validatedTextRecords: [],
//       isDirty: true
//     };
//     setRecords([newRecord, ...records]);
//     setSelectedRow(newRecord);
//     setSelectedIds(new Set([tempId]));
//     toast.success("New user-defined label added");
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
//         validatedTextRecords: [...(item.validatedTextRecords || [])]
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
//     setShowValidatedText(false);
//     toast.success("Record(s) deleted");
//   };

//   const handleSave = () => {
//     const hasInvalid = records.some(r => !r.labels?.trim() || !r.seqNo);
//     if (hasInvalid) {
//       return toast.error("Sequence Number and Label are required!");
//     }
//     // Also validate child grids
//     let hasInvalidChild = false;
//     records.forEach(r => {
//       if ((r.validatedTextRecords || []).some(c => !c.text?.trim())) {
//         hasInvalidChild = true;
//       }
//     });
//     if (hasInvalidChild) {
//       return toast.error("Text is required for all validated text records!");
//     }

//     setRecords(prev => prev.map(r => ({
//       ...r,
//       isDirty: false,
//       validatedTextRecords: (r.validatedTextRecords || []).map(c => ({ ...c, isDirty: false }))
//     })));
//     setSelectedRow(prev => prev ? {
//       ...prev,
//       isDirty: false,
//       validatedTextRecords: (prev.validatedTextRecords || []).map(c => ({ ...c, isDirty: false }))
//     } : null);
//     toast.success("Changes saved successfully!");
//   };

//   const handleDiscard = () => {
//     setRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
//     setSelectedRow(prev => prev ? { ...prev, isDirty: false } : null);
//     toast.info("Unsaved changes discarded");
//   };

//   // --- CHILD GRID ("Validated Text") Operations ---

//   const handleChildFieldChange = (childId, field, value) => {
//     if (!selectedRow) return;
//     const parentId = getRowKey(selectedRow);
//     setRecords(prev => prev.map(r => {
//       if (getRowKey(r) === parentId) {
//         const updatedChildren = (r.validatedTextRecords || []).map(c =>
//           getRowKey(c) === String(childId) ? { ...c, [field]: value, isDirty: true } : c
//         );
//         return { ...r, validatedTextRecords: updatedChildren, isDirty: true };
//       }
//       return r;
//     }));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== parentId) return prev;
//       const updatedChildren = (prev.validatedTextRecords || []).map(c =>
//         getRowKey(c) === String(childId) ? { ...c, [field]: value, isDirty: true } : c
//       );
//       return { ...prev, validatedTextRecords: updatedChildren, isDirty: true };
//     });
//   };

//   const handleChildAdd = () => {
//     if (!selectedRow) return toast.warn("Select a parent record first");
//     const parentId = getRowKey(selectedRow);
//     const tempChildId = `CHILD_${Date.now()}`;
//     const newChild = {
//       id: tempChildId,
//       tempId: tempChildId,
//       text: "",
//       description: "",
//       isDirty: true
//     };
//     setRecords(prev => prev.map(r => {
//       if (getRowKey(r) === parentId) {
//         return { ...r, validatedTextRecords: [newChild, ...(r.validatedTextRecords || [])], isDirty: true };
//       }
//       return r;
//     }));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== parentId) return prev;
//       return { ...prev, validatedTextRecords: [newChild, ...(prev.validatedTextRecords || [])], isDirty: true };
//     });
//     setSelectedChildIds(new Set([tempChildId]));
//     toast.success("New validated text record added");
//   };

//   const handleChildCopy = () => {
//     if (!selectedChildRow) return toast.warn("Select a validated text record to copy");
//     setChildClipboard([selectedChildRow]);
//     toast.success("Validated text copied");
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
//         return { ...r, validatedTextRecords: [...pasted, ...(r.validatedTextRecords || [])], isDirty: true };
//       }
//       return r;
//     }));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== parentId) return prev;
//       return { ...prev, validatedTextRecords: [...pasted, ...(prev.validatedTextRecords || [])], isDirty: true };
//     });
//     setSelectedChildIds(new Set([pasted[0].id]));
//     toast.success("Validated text pasted successfully");
//   };

//   const handleChildDelete = () => {
//     if (!selectedRow) return;
//     if (selectedChildIds.size === 0 && !selectedChildRow) {
//       return toast.warn("Select validated text record(s) to delete");
//     }
//     const parentId = getRowKey(selectedRow);
//     const idsToDelete = selectedChildIds.size > 0 ? selectedChildIds : new Set([getRowKey(selectedChildRow)]);
//     setRecords(prev => prev.map(r => {
//       if (getRowKey(r) === parentId) {
//         return { ...r, validatedTextRecords: (r.validatedTextRecords || []).filter(c => !idsToDelete.has(getRowKey(c))), isDirty: true };
//       }
//       return r;
//     }));
//     setSelectedRow(prev => {
//       if (!prev || getRowKey(prev) !== parentId) return prev;
//       return { ...prev, validatedTextRecords: (prev.validatedTextRecords || []).filter(c => !idsToDelete.has(getRowKey(c))), isDirty: true };
//     });
//     setSelectedChildIds(new Set());
//     setSelectedChildRow(null);
//     toast.success("Validated text record(s) deleted");
//   };

//   const isDirty = records.some(r => r.isDirty || (r.validatedTextRecords || []).some(c => c.isDirty));

//   return (
//     <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
//       {/* MASTER: User-Defined Labels */}
//       <MainContainer icon={Layers} title="User-Defined Labels">
//         <Toolbar
//           isFormView={isFormView}
//           columns={columns}
//           currentIndex={records.findIndex(r => getRowKey(r) === getRowKey(selectedRow))}
//           totalRecords={records.length}
//           handleNavigate={(dir) => {
//             const idx = records.findIndex(r => getRowKey(r) === getRowKey(selectedRow));
//             if (dir === 'start' && records.length > 0) {
//               setSelectedRow(records[0]);
//             } else if (dir === 'prev' && idx > 0) {
//               setSelectedRow(records[idx - 1]);
//             } else if (dir === 'next' && idx < records.length - 1) {
//               setSelectedRow(records[idx + 1]);
//             } else if (dir === 'end' && records.length > 0) {
//               setSelectedRow(records[records.length - 1]);
//             }
//           }}
//           actions={{
//             onAdd: handleAdd,
//             onCopy: handleCopy,
//             onPaste: handlePaste,
//             onClear: handleDiscard,
//             onDelete: handleDelete,
//             onSave: handleSave,
//             onToggleView: () => setIsFormView(!isFormView)
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
              
//               {/* Underlined "Validated Text" link at bottom of main table, matching screenshot */}
//               {selectedRow && (
//                 <div className="flex justify-end p-1 border-t border-gray-100 mt-1">
//                   <button
//                     onClick={() => setShowValidatedText(!showValidatedText)}
//                     className="text-[#17414d] font-bold text-xs underline cursor-pointer hover:text-blue-600 transition-colors"
//                   >
//                     {showValidatedText ? "Hide Validated Text" : "Validated Text"}
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
//                 <FormSection title="User-Defined Label Details">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
//                     <div className="space-y-2">
//                       <FormInput
//                         label="Sequence Number *"
//                         type="number"
//                         required
//                         value={selectedRow?.seqNo || ""}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "seqNo", e.target.value)}
//                       />
//                       <div className="space-x-2 flex items-center m-1">
//                         <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
//                           Data Type *
//                         </label>
//                         <select
//                           className="border outline-none p-0.5 rounded font-light text-[10px] flex-1 border-gray-300 bg-white"
//                           value={selectedRow?.dataType || "Text"}
//                           onChange={(e) => handleFieldChange(getRowKey(selectedRow), "dataType", e.target.value)}
//                         >
//                           <option value="Text">Text</option>
//                           <option value="Numeric">Numeric</option>
//                           <option value="Date">Date</option>
//                         </select>
//                       </div>
//                       <FormInput
//                         label="Label *"
//                         required
//                         value={selectedRow?.labels || ""}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "labels", e.target.value)}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <FormInput
//                         label="Help Description"
//                         value={selectedRow?.helpDesc || ""}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "helpDesc", e.target.value)}
//                       />
//                       <FormInput
//                         label="Costpoint Validation Field"
//                         value={selectedRow?.cpValidationField || ""}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "cpValidationField", e.target.value)}
//                       />
//                       <FormInput
//                         label="Required"
//                         type="checkbox"
//                         checked={selectedRow?.requiredFl === 'Y'}
//                         onChange={(e) => handleFieldChange(getRowKey(selectedRow), "requiredFl", e.target.checked ? "Y" : "N")}
//                       />
//                     </div>
//                   </div>
//                 </FormSection>
                
//                 {/* Switch sub-panel toggle for Form view too */}
//                 {selectedRow && (
//                   <div className="flex justify-end p-1 mt-2">
//                     <button
//                       onClick={() => setShowValidatedText(!showValidatedText)}
//                       className="text-[#17414d] font-bold text-xs underline cursor-pointer hover:text-blue-600 transition-colors"
//                     >
//                       {showValidatedText ? "Hide Validated Text" : "Validated Text Details"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </MainContainer>

//       {/* DETAIL: Validated Text (Nested Grid under parent) */}
//       {showValidatedText && selectedRow && (
//         <SecondaryContainer
//           title="User-Defined Labels > Validated Text"
//           handleClose={() => setShowValidatedText(false)}
//           className="mt-4 shadow-md bg-white border border-[#17414d]/40 rounded-xl"
//         >
//           <Toolbar
//             isFormView={false} // Table-only view, matches the screenshot
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
//             isDirty={selectedRow.validatedTextRecords?.some(c => c.isDirty)}
//             clipboardCount={childClipboard.length}
//             clipboard={childClipboard}
//           />
//           <div className="mt-2 bg-white border border-gray-200 p-2">
//             <ReusableTable
//               data={selectedRow.validatedTextRecords || []}
//               columns={childColumns}
//               selectedRows={selectedChildIds}
//               onSelectAll={(e) => {
//                 if (e.target.checked) {
//                   setSelectedChildIds(new Set((selectedRow.validatedTextRecords || []).map(getRowKey)));
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

// export default UserDefinedLabels;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers } from 'lucide-react';
import { MainContainer, SecondaryContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput } from '../helper/formSection';

const columns = [
  { id: "seqNo", key: "seqNo", label: "Sequence Number *", type: "number" },
  {
    id: "dataType",
    key: "dataType",
    label: "Data Type *",
    type: "select",
    options: [
      { label: "Text", value: "Text" },
      { label: "Numeric", value: "Numeric" },
      { label: "Date", value: "Date" }
    ],
    optionValue: "value",
    optionLabel: "label"
  },
  { id: "labels", key: "labels", label: "Label *", type: "text" },
  { id: "helpDesc", key: "helpDesc", label: "Help Description", type: "text" },
  { id: "cpValidationField", key: "cpValidationField", label: "Costpoint Validation Field", type: "text" },
  { id: "requiredFl", key: "requiredFl", label: "Required", type: "checkbox" }
];

const childColumns = [
  { id: "text", key: "text", label: "Text *", type: "text" },
  { id: "description", key: "description", label: "Description", type: "text" }
];

const UserDefinedLabels = () => {
  // Main Grid States
  const [isFormView, setIsFormView] = useState(false);
  const [records, setRecords] = useState([
    {
      id: '1',
      seqNo: 10,
      dataType: 'Text',
      labels: 'Employee Class',
      helpDesc: 'Help text for Employee Class',
      cpValidationField: '',
      requiredFl: 'Y',
      validatedTextRecords: [
        { id: '101', text: 'FTE', description: 'Full Time Employee' },
        { id: '102', text: 'PTE', description: 'Part Time Employee' }
      ]
    },
    {
      id: '2',
      seqNo: 20,
      dataType: 'Numeric',
      labels: 'FTE Ratio',
      helpDesc: 'Ratio of full time equivalency',
      cpValidationField: '',
      requiredFl: 'N',
      validatedTextRecords: []
    }
  ]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [clipboard, setClipboard] = useState([]);

  // Child Grid States ("Validated Text")
  const [showValidatedText, setShowValidatedText] = useState(false);
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
      seqNo: (records.length + 1) * 10,
      dataType: 'Text',
      labels: '',
      helpDesc: '',
      cpValidationField: '',
      requiredFl: 'N',
      validatedTextRecords: [],
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setSelectedRow(newRecord);
    setSelectedIds(new Set([tempId]));
    toast.success("New user-defined label added");
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
        validatedTextRecords: [...(item.validatedTextRecords || [])]
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
    setShowValidatedText(false);
    toast.success("Record(s) deleted");
  };

  const handleSave = () => {
    const hasInvalid = records.some(r => !r.labels?.trim() || !r.seqNo);
    if (hasInvalid) {
      return toast.error("Sequence Number and Label are required!");
    }
    // Also validate child grids
    let hasInvalidChild = false;
    records.forEach(r => {
      if ((r.validatedTextRecords || []).some(c => !c.text?.trim())) {
        hasInvalidChild = true;
      }
    });
    if (hasInvalidChild) {
      return toast.error("Text is required for all validated text records!");
    }

    setRecords(prev => prev.map(r => ({
      ...r,
      isDirty: false,
      validatedTextRecords: (r.validatedTextRecords || []).map(c => ({ ...c, isDirty: false }))
    })));
    setSelectedRow(prev => prev ? {
      ...prev,
      isDirty: false,
      validatedTextRecords: (prev.validatedTextRecords || []).map(c => ({ ...c, isDirty: false }))
    } : null);
    toast.success("Changes saved successfully!");
  };

  const handleDiscard = () => {
    setRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
    setSelectedRow(prev => prev ? { ...prev, isDirty: false } : null);
    toast.info("Unsaved changes discarded");
  };

  // --- CHILD GRID ("Validated Text") Operations ---

  const handleChildFieldChange = (childId, field, value) => {
    if (!selectedRow) return;
    const parentId = getRowKey(selectedRow);
    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        const updatedChildren = (r.validatedTextRecords || []).map(c =>
          getRowKey(c) === String(childId) ? { ...c, [field]: value, isDirty: true } : c
        );
        return { ...r, validatedTextRecords: updatedChildren, isDirty: true };
      }
      return r;
    }));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      const updatedChildren = (prev.validatedTextRecords || []).map(c =>
        getRowKey(c) === String(childId) ? { ...c, [field]: value, isDirty: true } : c
      );
      return { ...prev, validatedTextRecords: updatedChildren, isDirty: true };
    });
  };

  const handleChildAdd = () => {
    if (!selectedRow) return toast.warn("Select a parent record first");
    const parentId = getRowKey(selectedRow);
    const tempChildId = `CHILD_${Date.now()}`;
    const newChild = {
      id: tempChildId,
      tempId: tempChildId,
      text: "",
      description: "",
      isDirty: true
    };
    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        return { ...r, validatedTextRecords: [newChild, ...(r.validatedTextRecords || [])], isDirty: true };
      }
      return r;
    }));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      return { ...prev, validatedTextRecords: [newChild, ...(prev.validatedTextRecords || [])], isDirty: true };
    });
    setSelectedChildIds(new Set([tempChildId]));
    setSelectedChildRow(newChild);
    toast.success("New validated text record added");
  };

  const handleChildCopy = () => {
    if (!selectedChildRow) return toast.warn("Select a validated text record to copy");
    setChildClipboard([selectedChildRow]);
    toast.success("Validated text copied");
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
        return { ...r, validatedTextRecords: [...pasted, ...(r.validatedTextRecords || [])], isDirty: true };
      }
      return r;
    }));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      return { ...prev, validatedTextRecords: [...pasted, ...(prev.validatedTextRecords || [])], isDirty: true };
    });
    setSelectedChildIds(new Set([pasted[0].id]));
    setSelectedChildRow(pasted[0]);
    toast.success("Validated text pasted successfully");
  };

  const handleChildDelete = () => {
    if (!selectedRow) return;
    if (selectedChildIds.size === 0 && !selectedChildRow) {
      return toast.warn("Select validated text record(s) to delete");
    }
    const parentId = getRowKey(selectedRow);
    const idsToDelete = selectedChildIds.size > 0 ? selectedChildIds : new Set([getRowKey(selectedChildRow)]);
    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        return { ...r, validatedTextRecords: (r.validatedTextRecords || []).filter(c => !idsToDelete.has(getRowKey(c))), isDirty: true };
      }
      return r;
    }));
    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      return { ...prev, validatedTextRecords: (prev.validatedTextRecords || []).filter(c => !idsToDelete.has(getRowKey(c))), isDirty: true };
    });
    setSelectedChildIds(new Set());
    setSelectedChildRow(null);
    toast.success("Validated text record(s) deleted");
  };

  const isDirty = records.some(r => r.isDirty || (r.validatedTextRecords || []).some(c => c.isDirty));

  const renderStickyHeader = () => (
    <div className="bg-gray-50/80 p-2 rounded-lg border border-gray-200 mb-2 sticky top-0 z-40 backdrop-blur-sm shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <FormInput
          label="Sequence Number"
          value={selectedRow?.seqNo || ""}
          readOnly
        />
        <FormInput
          label="Label"
          value={selectedRow?.labels || ""}
          readOnly
        />
        <FormInput
          label="Data Type"
          value={selectedRow?.dataType || ""}
          readOnly
        />
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
      {/* MASTER: User-Defined Labels */}
      <MainContainer icon={Layers} title="User-Defined Labels">
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
              setShowValidatedText(false);
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
                <FormSection title="User-Defined Label Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                    <div className="space-y-2">
                      <FormInput
                        label="Sequence Number *"
                        type="number"
                        required
                        value={selectedRow?.seqNo || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "seqNo", e.target.value)}
                      />
                      <div className="space-x-2 flex items-center m-1">
                        <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
                          Data Type *
                        </label>
                        <select
                          className="border outline-none p-0.5 rounded font-light text-[10px] flex-1 border-gray-300 bg-white"
                          value={selectedRow?.dataType || "Text"}
                          onChange={(e) => handleFieldChange(getRowKey(selectedRow), "dataType", e.target.value)}
                        >
                          <option value="Text">Text</option>
                          <option value="Numeric">Numeric</option>
                          <option value="Date">Date</option>
                        </select>
                      </div>
                      <FormInput
                        label="Label *"
                        required
                        value={selectedRow?.labels || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "labels", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormInput
                        label="Help Description"
                        value={selectedRow?.helpDesc || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "helpDesc", e.target.value)}
                      />
                      <FormInput
                        label="Costpoint Validation Field"
                        value={selectedRow?.cpValidationField || ""}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "cpValidationField", e.target.value)}
                      />
                      <FormInput
                        label="Required"
                        type="checkbox"
                        checked={selectedRow?.requiredFl === 'Y'}
                        onChange={(e) => handleFieldChange(getRowKey(selectedRow), "requiredFl", e.target.checked ? "Y" : "N")}
                      />
                    </div>
                  </div>
                </FormSection>
              </div>
            </div>
          )}

          {/* Bottom Tabs/Buttons Row matching ManageEmployee style */}
          {selectedRow && (
            <div className="flex flex-wrap gap-2 mt-2 px-1 pb-2 border-t border-gray-100 pt-2">
              {[
                "Validated Text"
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setShowValidatedText(!showValidatedText);
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-colors whitespace-nowrap border cursor-pointer ${showValidatedText
                      ? "bg-[#17414d] text-white border-[#17414d] shadow-md cursor-pointer"
                      : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe] cursor-pointer"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>
      </MainContainer>

      {/* DETAIL: Validated Text (Nested Grid under parent, matching SalaryLeaveNestedContainer style) */}
      {showValidatedText && selectedRow && (
        <SecondaryContainer
          title="User-Defined Labels > Validated Text"
          handleClose={() => setShowValidatedText(false)}
          className="mt-4 shadow-md bg-white border border-[#17414d]/40 rounded-xl"
        >
          <Toolbar
            isFormView={false} // Table-only view, matches the screenshot
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
            isDirty={selectedRow.validatedTextRecords?.some(c => c.isDirty)}
            clipboardCount={childClipboard.length}
            clipboard={childClipboard}
          />
          <div className="mt-2 bg-white border border-gray-200 p-2">
            <ReusableTable
              data={selectedRow.validatedTextRecords || []}
              columns={childColumns}
              selectedRows={selectedChildIds}
              onSelectAll={(e) => {
                if (e.target.checked) {
                  setSelectedChildIds(new Set((selectedRow.validatedTextRecords || []).map(getRowKey)));
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

export default UserDefinedLabels;
