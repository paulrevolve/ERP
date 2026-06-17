// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import { Layers } from 'lucide-react';
// import { MainContainer, SecondaryContainer, Toolbar } from '../helper/container';
// import { ReusableTable } from '../helper/tableSection';
// import { FormSection, FormInput, FormSearchSelect } from '../helper/formSection';

// // Mock Project options
// const projectOptions = [
//   { value: 'PRJ001', name: 'Acme Web Development' },
//   { value: 'PRJ002', name: 'Alpha Infrastructure Setup' },
//   { value: 'PRJ003', name: 'Gamma Cloud Integration' },
//   { value: 'PRJ004', name: 'Delta Security Audit' },
//   { value: 'PRJ005', name: 'Epsilon IoT Platform' }
// ];

// const dataTypeOptions = [
//   { optionValue: 'Text', optionLabel: 'Text' },
//   { optionValue: 'Numeric', optionLabel: 'Numeric' },
//   { optionValue: 'Date', optionLabel: 'Date' },
//   { optionValue: 'Boolean', optionLabel: 'Boolean' }
// ];

// const ManageUDEFInformation = () => {
//   const [projectList, setProjectList] = useState([]);
//   const [selectedProjIndex, setSelectedProjIndex] = useState(0);
//   const [projectSearch, setProjectSearch] = useState('');
  
//   // Master navigation state
//   const [isMasterFormView, setIsMasterFormView] = useState(true);
//   const [masterSearchValue, setMasterSearchValue] = useState('');

//   // Table Grid View States
//   const [isGridFormView, setIsGridFormView] = useState(false);
//   const [selectedGridRow, setSelectedGridRow] = useState(null);
//   const [selectedGridIds, setSelectedGridIds] = useState(new Set());
//   const [gridClipboard, setGridClipboard] = useState([]);

//   const currentProject = projectList[selectedProjIndex] || null;

//   const handleMasterFieldChange = (field, value) => {
//     setProjectList(prev => prev.map((proj, idx) => {
//       if (idx === selectedProjIndex) {
//         let updated = { ...proj, [field]: value, isDirty: true };
//         if (field === 'projectId') {
//           const matchedProj = projectOptions.find(p => p.value === value);
//           updated.projectName = matchedProj ? matchedProj.name : '';
//         }
//         return updated;
//       }
//       return proj;
//     }));
//   };

//   const handleGridFieldChange = (itemId, field, value) => {
//     setProjectList(prev => prev.map((proj, idx) => {
//       if (idx === selectedProjIndex) {
//         const updatedItems = proj.udefItems.map(item => {
//           if (item.id === itemId) {
//             return { ...item, [field]: value };
//           }
//           return item;
//         });
//         return { ...proj, udefItems: updatedItems, isDirty: true };
//       }
//       return proj;
//     }));

//     setSelectedGridRow(prev => {
//       if (!prev || prev.id !== itemId) return prev;
//       return { ...prev, [field]: value };
//     });
//   };

//   // Master Toolbar Actions
//   const handleAddMaster = () => {
//     const newProj = {
//       projectId: '',
//       projectName: '',
//       udefItems: [],
//       isDirty: true
//     };
//     setProjectList([...projectList, newProj]);
//     setSelectedProjIndex(projectList.length);
//     setIsMasterFormView(true);
//     toast.success("New project UDEF profile created");
//   };

//   const handleCopyMaster = () => {
//     if (!currentProject) return toast.warn("No UDEF profile selected");
//     toast.info("UDEF profile copied");
//   };

//   const handleDeleteMaster = () => {
//     if (projectList.length === 0) return toast.warn("No UDEF profile to delete");
//     const updated = projectList.filter((_, idx) => idx !== selectedProjIndex);
//     setProjectList(updated);
//     setSelectedProjIndex(Math.max(0, selectedProjIndex - 1));
//     toast.success("UDEF Profile deleted");
//   };

//   const handleSaveMaster = () => {
//     if (!currentProject?.projectId) {
//       return toast.error("Project is required");
//     }
//     setProjectList(prev => prev.map((proj, idx) => {
//       if (idx === selectedProjIndex) {
//         return { ...proj, isDirty: false };
//       }
//       return proj;
//     }));
//     toast.success("UDEF profile saved successfully");
//   };

//   // Detail Grid Actions
//   const handleAddGridItem = () => {
//     if (!currentProject) return toast.error("Select a project profile first");
//     const tempId = `U_NEW_${Date.now()}`;
//     const newItem = {
//       id: tempId,
//       seqNum: (currentProject.udefItems || []).length + 1,
//       dataType: 'Text',
//       label: '',
//       textVal: '',
//       numVal: 0,
//       dateVal: '',
//       validationField: '',
//       validatedText: '',
//       required: 'N'
//     };

//     setProjectList(prev => prev.map((proj, idx) => {
//       if (idx === selectedProjIndex) {
//         return { ...proj, udefItems: [...(proj.udefItems || []), newItem], isDirty: true };
//       }
//       return proj;
//     }));
//     setSelectedGridRow(newItem);
//     toast.success("New UDEF field definition added");
//   };

//   const handleCopyGridItem = () => {
//     if (!selectedGridRow) return toast.warn("Select a row to copy");
//     setGridClipboard([selectedGridRow]);
//     toast.success("UDEF field copied");
//   };

//   const handlePasteGridItem = () => {
//     if (gridClipboard.length === 0) return toast.warn("Clipboard is empty");
//     const pasted = gridClipboard.map((item, idx) => {
//       const tempId = `U_PASTE_${Date.now()}_${idx}`;
//       return {
//         ...item,
//         id: tempId,
//         seqNum: (currentProject.udefItems || []).length + 1
//       };
//     });

//     setProjectList(prev => prev.map((proj, idx) => {
//       if (idx === selectedProjIndex) {
//         return { ...proj, udefItems: [...(proj.udefItems || []), ...pasted], isDirty: true };
//       }
//       return proj;
//     }));
//     setSelectedGridRow(pasted[0]);
//     toast.success("UDEF field pasted");
//   };

//   const handleDeleteGridItem = () => {
//     if (!selectedGridRow && selectedGridIds.size === 0) {
//       return toast.warn("Select field(s) to delete");
//     }
//     const idsToDelete = selectedGridIds.size > 0 ? selectedGridIds : new Set([selectedGridRow.id]);

//     setProjectList(prev => prev.map((proj, idx) => {
//       if (idx === selectedProjIndex) {
//         return {
//           ...proj,
//           udefItems: (proj.udefItems || []).filter(item => !idsToDelete.has(item.id)),
//           isDirty: true
//         };
//       }
//       return proj;
//     }));
//     setSelectedGridIds(new Set());
//     setSelectedGridRow(null);
//     toast.success("UDEF field definition deleted");
//   };

//   const masterColumns = [
//     { id: 'projectId', key: 'projectId', label: 'Project ID', type: 'readOnly-text' },
//     { id: 'projectName', key: 'projectName', label: 'Project Name', type: 'readOnly-text' }
//   ];

//   const gridColumns = [
//     { id: 'seqNum', key: 'seqNum', label: 'Sequence Number', type: 'number' },
//     {
//       id: 'dataType',
//       key: 'dataType',
//       label: 'Data Type',
//       type: 'select',
//       options: dataTypeOptions,
//       optionValue: 'optionValue',
//       optionLabel: 'optionLabel'
//     },
//     { id: 'label', key: 'label', label: 'Labels *', type: 'text', required: true },
//     { id: 'textVal', key: 'textVal', label: 'Text Value', type: 'text' },
//     { id: 'numVal', key: 'numVal', label: 'Numeric Value', type: 'number' },
//     { id: 'dateVal', key: 'dateVal', label: 'Date Value', type: 'date' },
//     { id: 'validationField', key: 'validationField', label: 'Costpoint Validation Field', type: 'text' },
//     { id: 'validatedText', key: 'validatedText', label: 'Validated Text', type: 'text' },
//     {
//       id: 'required',
//       key: 'required',
//       label: 'Required',
//       type: 'checkbox'
//     }
//   ];

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={Layers} title="Manage UDEF Information">
        
//         {/* IDENTIFICATION HEADER TOOLBAR */}
//         <Toolbar
//           isFormView={isMasterFormView}
//           columns={masterColumns}
//           currentIndex={selectedProjIndex}
//           totalRecords={projectList.length}
//           handleNavigate={(dir) => {
//             if (dir === 'start') setSelectedProjIndex(0);
//             else if (dir === 'prev' && selectedProjIndex > 0) setSelectedProjIndex(selectedProjIndex - 1);
//             else if (dir === 'next' && selectedProjIndex < projectList.length - 1) setSelectedProjIndex(selectedProjIndex + 1);
//             else if (dir === 'end') setSelectedProjIndex(projectList.length - 1);
//           }}
//           actions={{
//             onAdd: handleAddMaster,
//             onCopy: handleCopyMaster,
//             onPaste: () => {},
//             onClear: () => handleMasterFieldChange('projectId', ''),
//             onDelete: handleDeleteMaster,
//             onSave: handleSaveMaster,
//             onToggleView: () => setIsMasterFormView(!isMasterFormView)
//           }}
//           selectedRow={currentProject}
//           isDirty={currentProject?.isDirty}
//           searchValue={masterSearchValue}
//           setSearchValue={setMasterSearchValue}
//           jumpToCode={(code) => {
//             const foundIdx = projectList.findIndex(proj => proj.projectId.toLowerCase().includes(code.toLowerCase()));
//             if (foundIdx !== -1) {
//               setSelectedProjIndex(foundIdx);
//               toast.info(`Jumped to Project ${projectList[foundIdx].projectId}`);
//             } else {
//               toast.warn("Project profile not found");
//             }
//           }}
//         />

//         {/* MASTER LIST TABLE VIEW */}
//         {!isMasterFormView ? (
//           <div className="bg-white border border-gray-200 p-2 mt-2 overflow-x-auto">
//             <ReusableTable
//               data={projectList}
//               columns={masterColumns}
//               selectedRows={new Set([currentProject?.projectId])}
//               onRowSelect={(row) => {
//                 const idx = projectList.findIndex(p => p.projectId === row.projectId);
//                 if (idx !== -1) setSelectedProjIndex(idx);
//               }}
//               showCheckboxesHeader={true}
//               showCheckboxesTable={true}
//               showCheckboxesHeaderTop={true}
//             />
//           </div>
//         ) : (
//           /* MASTER FORM VIEW */
//           <div className="space-y-4 mt-2">
//             {currentProject ? (
//               <>
//                 {/* Identification Header Panel */}
//                 <FormSection title="Identification">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
//                     <FormSearchSelect
//                       label="Project"
//                       value={currentProject.projectId}
//                       searchTerm={projectSearch}
//                       setSearchTerm={setProjectSearch}
//                       options={projectOptions}
//                       onSelect={(opt) => {
//                         handleMasterFieldChange('projectId', opt.value);
//                       }}
//                       displayKey="value"
//                       secondaryKey="name"
//                       placeholder="Select project..."
//                     />
//                     <div className="flex items-center m-1">
//                       <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-gray-50 px-2 py-1 rounded flex-1">
//                         {currentProject.projectName || 'No Project Selected'}
//                       </span>
//                     </div>
//                   </div>
//                 </FormSection>

//                 {/* User-Defined Info Section */}
//                 <SecondaryContainer title="User-Defined Info">
//                   <div className="space-y-2">
                    
//                     {/* Detail Grid Toolbar */}
//                     <Toolbar
//                       isFormView={isGridFormView}
//                       columns={gridColumns}
//                       currentIndex={(currentProject.udefItems || []).findIndex(item => item.id === selectedGridRow?.id)}
//                       totalRecords={(currentProject.udefItems || []).length}
//                       handleNavigate={(dir) => {
//                         const items = currentProject.udefItems || [];
//                         const idx = items.findIndex(item => item.id === selectedGridRow?.id);
//                         if (dir === 'start' && items.length > 0) setSelectedGridRow(items[0]);
//                         else if (dir === 'prev' && idx > 0) setSelectedGridRow(items[idx - 1]);
//                         else if (dir === 'next' && idx < items.length - 1) setSelectedGridRow(items[idx + 1]);
//                         else if (dir === 'end' && items.length > 0) setSelectedGridRow(items[items.length - 1]);
//                       }}
//                       actions={{
//                         onAdd: () => {
//                           handleAddGridItem();
//                           setIsGridFormView(true);
//                         },
//                         onCopy: handleCopyGridItem,
//                         onPaste: handlePasteGridItem,
//                         onClear: () => {
//                           toast.info("UDEF field changes discarded");
//                         },
//                         onDelete: handleDeleteGridItem,
//                         onSave: () => {
//                           toast.success("UDEF configurations updated");
//                         },
//                         onToggleView: () => {
//                           if (!isGridFormView && !selectedGridRow && (currentProject.udefItems || []).length > 0) {
//                             setSelectedGridRow(currentProject.udefItems[0]);
//                           }
//                           setIsGridFormView(!isGridFormView);
//                         }
//                       }}
//                       selectedRow={selectedGridRow}
//                       isDirty={false}
//                       clipboardCount={gridClipboard.length}
//                       clipboard={gridClipboard}
//                     />

//                     {/* Table View */}
//                     {!isGridFormView ? (
//                       <div className="bg-white border border-gray-200 p-2 overflow-x-auto">
//                         <ReusableTable
//                           data={currentProject.udefItems || []}
//                           columns={gridColumns}
//                           selectedRows={selectedGridIds}
//                           onSelectAll={(e) => {
//                             if (e.target.checked) {
//                               setSelectedGridIds(new Set((currentProject.udefItems || []).map(i => i.id)));
//                             } else {
//                               setSelectedGridIds(new Set());
//                             }
//                           }}
//                           onRowSelect={(row) => {
//                             const newIds = new Set(selectedGridIds);
//                             if (newIds.has(row.id)) newIds.delete(row.id);
//                             else newIds.add(row.id);
//                             setSelectedGridIds(newIds);
//                             setSelectedGridRow(row);
//                           }}
//                           onFieldChange={handleGridFieldChange}
//                         />
//                       </div>
//                     ) : (
//                       /* Form View for UDEF Fields */
//                       <div className="p-4 bg-white border border-gray-200 rounded-sm">
//                         <FormSection title="UDEF Details">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
//                             <div className="space-y-2">
//                               <FormInput
//                                 label="Sequence Number"
//                                 type="number"
//                                 value={selectedGridRow?.seqNum || 1}
//                                 onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'seqNum', parseInt(e.target.value) || 1)}
//                               />
//                               <div className="flex items-center gap-2 m-1">
//                                 <label className="text-[10px] text-black min-w-[90px]">Data Type</label>
//                                 <select
//                                   value={selectedGridRow?.dataType || 'Text'}
//                                   onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'dataType', e.target.value)}
//                                   className="flex-1 border border-gray-300 rounded p-1 text-[10px] bg-white outline-none focus:border-[#17414d]"
//                                 >
//                                   {dataTypeOptions.map((opt, i) => (
//                                     <option key={i} value={opt.optionValue}>{opt.optionLabel}</option>
//                                   ))}
//                                 </select>
//                               </div>
//                               <FormInput
//                                 label="Labels *"
//                                 value={selectedGridRow?.label || ''}
//                                 onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'label', e.target.value)}
//                                 required={true}
//                               />
//                               <FormInput
//                                 label="Text Value"
//                                 value={selectedGridRow?.textVal || ''}
//                                 onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'textVal', e.target.value)}
//                                 disabled={selectedGridRow?.dataType !== 'Text'}
//                               />
//                             </div>

//                             <div className="space-y-2">
//                               <FormInput
//                                 label="Numeric Value"
//                                 type="number"
//                                 value={selectedGridRow?.numVal || 0}
//                                 onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'numVal', parseFloat(e.target.value) || 0)}
//                                 disabled={selectedGridRow?.dataType !== 'Numeric'}
//                               />
//                               <FormInput
//                                 label="Date Value"
//                                 type="date"
//                                 value={selectedGridRow?.dateVal || ''}
//                                 onChange={(e) => handleFieldChange('dateVal', e.target.value)}
//                                 disabled={selectedGridRow?.dataType !== 'Date'}
//                               />
//                               <FormInput
//                                 label="Costpoint Validation Field"
//                                 value={selectedGridRow?.validationField || ''}
//                                 onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'validationField', e.target.value)}
//                               />
//                               <FormInput
//                                 label="Validated Text"
//                                 value={selectedGridRow?.validatedText || ''}
//                                 onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'validatedText', e.target.value)}
//                               />
//                               <div className="flex items-center gap-4 m-1 min-h-[24px]">
//                                 <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
//                                   Required
//                                 </label>
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedGridRow?.required === 'Y'}
//                                   onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'required', e.target.checked ? 'Y' : 'N')}
//                                   className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </FormSection>
//                       </div>
//                     )}
//                   </div>
//                 </SecondaryContainer>
//               </>
//             ) : (
//               <div className="text-center py-10 bg-gray-50 text-gray-400 text-xs italic">
//                 No active Project profile. Click "Add New" in the toolbar to create one.
//               </div>
//             )}
//           </div>
//         )}
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageUDEFInformation;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers } from 'lucide-react';
import { MainContainer, SecondaryContainer, Toolbar } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSection, FormInput, FormSearchSelect } from '../helper/formSection';

// Mock Project options
const projectOptions = [
  { value: 'PRJ001', name: 'Acme Web Development' },
  { value: 'PRJ002', name: 'Alpha Infrastructure Setup' },
  { value: 'PRJ003', name: 'Gamma Cloud Integration' },
  { value: 'PRJ004', name: 'Delta Security Audit' },
  { value: 'PRJ005', name: 'Epsilon IoT Platform' }
];

const dataTypeOptions = [
  { optionValue: 'Text', optionLabel: 'Text' },
  { optionValue: 'Numeric', optionLabel: 'Numeric' },
  { optionValue: 'Date', optionLabel: 'Date' },
  { optionValue: 'Boolean', optionLabel: 'Boolean' }
];

const ManageUDEFInformation = () => {
  const [projectList, setProjectList] = useState([]);
  const [selectedProjIndex, setSelectedProjIndex] = useState(0);
  const [projectSearch, setProjectSearch] = useState('');
  
  // Master navigation state
  const [isMasterFormView, setIsMasterFormView] = useState(false);
  const [masterSearchValue, setMasterSearchValue] = useState('');

  // Table Grid View States
  const [isGridFormView, setIsGridFormView] = useState(false);
  const [selectedGridRow, setSelectedGridRow] = useState(null);
  const [selectedGridIds, setSelectedGridIds] = useState(new Set());
  const [gridClipboard, setGridClipboard] = useState([]);

  const currentProject = projectList[selectedProjIndex] || null;

  const handleMasterFieldChange = (field, value) => {
    setProjectList(prev => prev.map((proj, idx) => {
      if (idx === selectedProjIndex) {
        let updated = { ...proj, [field]: value, isDirty: true };
        if (field === 'projectId') {
          const matchedProj = projectOptions.find(p => p.value === value);
          updated.projectName = matchedProj ? matchedProj.name : '';
        }
        return updated;
      }
      return proj;
    }));
  };

  const handleGridFieldChange = (itemId, field, value) => {
    setProjectList(prev => prev.map((proj, idx) => {
      if (idx === selectedProjIndex) {
        const updatedItems = proj.udefItems.map(item => {
          if (item.id === itemId) {
            return { ...item, [field]: value };
          }
          return item;
        });
        return { ...proj, udefItems: updatedItems, isDirty: true };
      }
      return proj;
    }));

    setSelectedGridRow(prev => {
      if (!prev || prev.id !== itemId) return prev;
      return { ...prev, [field]: value };
    });
  };

  // Master Toolbar Actions
  const handleAddMaster = () => {
    const newProj = {
      projectId: '',
      projectName: '',
      udefItems: [],
      isDirty: true
    };
    setProjectList([...projectList, newProj]);
    setSelectedProjIndex(projectList.length);
    setIsMasterFormView(true);
    toast.success("New project UDEF profile created");
  };

  const handleCopyMaster = () => {
    if (!currentProject) return toast.warn("No UDEF profile selected");
    toast.info("UDEF profile copied");
  };

  const handleDeleteMaster = () => {
    if (projectList.length === 0) return toast.warn("No UDEF profile to delete");
    const updated = projectList.filter((_, idx) => idx !== selectedProjIndex);
    setProjectList(updated);
    setSelectedProjIndex(Math.max(0, selectedProjIndex - 1));
    toast.success("UDEF Profile deleted");
  };

  const handleSaveMaster = () => {
    if (!currentProject) return toast.error("No profile to save");
    if (!currentProject.projectId) {
      return toast.error("Project is required");
    }
    setProjectList(prev => prev.map((proj, idx) => {
      if (idx === selectedProjIndex) {
        return { ...proj, isDirty: false };
      }
      return proj;
    }));
    toast.success("UDEF profile saved successfully");
  };

  // Detail Grid Actions
  const handleAddGridItem = () => {
    if (!currentProject) return toast.error("Select a project profile first");
    const tempId = `U_NEW_${Date.now()}`;
    const newItem = {
      id: tempId,
      seqNum: (currentProject.udefItems || []).length + 1,
      dataType: 'Text',
      label: '',
      textVal: '',
      numVal: 0,
      dateVal: '',
      validationField: '',
      validatedText: '',
      required: 'N'
    };

    setProjectList(prev => prev.map((proj, idx) => {
      if (idx === selectedProjIndex) {
        return { ...proj, udefItems: [...(proj.udefItems || []), newItem], isDirty: true };
      }
      return proj;
    }));
    setSelectedGridRow(newItem);
    toast.success("New UDEF field definition added");
  };

  const handleCopyGridItem = () => {
    if (!selectedGridRow) return toast.warn("Select a row to copy");
    setGridClipboard([selectedGridRow]);
    toast.success("UDEF field copied");
  };

  const handlePasteGridItem = () => {
    if (gridClipboard.length === 0) return toast.warn("Clipboard is empty");
    const pasted = gridClipboard.map((item, idx) => {
      const tempId = `U_PASTE_${Date.now()}_${idx}`;
      return {
        ...item,
        id: tempId,
        seqNum: (currentProject.udefItems || []).length + 1
      };
    });

    setProjectList(prev => prev.map((proj, idx) => {
      if (idx === selectedProjIndex) {
        return { ...proj, udefItems: [...(proj.udefItems || []), ...pasted], isDirty: true };
      }
      return proj;
    }));
    setSelectedGridRow(pasted[0]);
    toast.success("UDEF field pasted");
  };

  const handleDeleteGridItem = () => {
    if (!selectedGridRow && selectedGridIds.size === 0) {
      return toast.warn("Select field(s) to delete");
    }
    const idsToDelete = selectedGridIds.size > 0 ? selectedGridIds : new Set([selectedGridRow.id]);

    setProjectList(prev => prev.map((proj, idx) => {
      if (idx === selectedProjIndex) {
        return {
          ...proj,
          udefItems: (proj.udefItems || []).filter(item => !idsToDelete.has(item.id)),
          isDirty: true
        };
      }
      return proj;
    }));
    setSelectedGridIds(new Set());
    setSelectedGridRow(null);
    toast.success("UDEF field definition deleted");
  };

  const masterColumns = [
    { id: 'projectId', key: 'projectId', label: 'Project ID', type: 'readOnly-text' },
    { id: 'projectName', key: 'projectName', label: 'Project Name', type: 'readOnly-text' }
  ];

  const gridColumns = [
    { id: 'seqNum', key: 'seqNum', label: 'Sequence Number', type: 'number' },
    {
      id: 'dataType',
      key: 'dataType',
      label: 'Data Type',
      type: 'select',
      options: dataTypeOptions,
      optionValue: 'optionValue',
      optionLabel: 'optionLabel'
    },
    { id: 'label', key: 'label', label: 'Labels *', type: 'text', required: true },
    { id: 'textVal', key: 'textVal', label: 'Text Value', type: 'text' },
    { id: 'numVal', key: 'numVal', label: 'Numeric Value', type: 'number' },
    { id: 'dateVal', key: 'dateVal', label: 'Date Value', type: 'date' },
    { id: 'validationField', key: 'validationField', label: 'Costpoint Validation Field', type: 'text' },
    { id: 'validatedText', key: 'validatedText', label: 'Validated Text', type: 'text' },
    {
      id: 'required',
      key: 'required',
      label: 'Required',
      type: 'checkbox'
    }
  ];

  const activeUdefItems = currentProject ? (currentProject.udefItems || []) : [];
  const activeUdefIndex = currentProject ? activeUdefItems.findIndex(item => item.id === selectedGridRow?.id) : -1;
  const activeUdefCount = activeUdefItems.length;

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Layers} title="Manage UDEF Information">
        
        {/* IDENTIFICATION HEADER TOOLBAR */}
        <Toolbar
          isFormView={isMasterFormView}
          columns={masterColumns}
          currentIndex={selectedProjIndex}
          totalRecords={projectList.length}
          handleNavigate={(dir) => {
            if (dir === 'start') setSelectedProjIndex(0);
            else if (dir === 'prev' && selectedProjIndex > 0) setSelectedProjIndex(selectedProjIndex - 1);
            else if (dir === 'next' && selectedProjIndex < projectList.length - 1) setSelectedProjIndex(selectedProjIndex + 1);
            else if (dir === 'end') setSelectedProjIndex(projectList.length - 1);
          }}
          actions={{
            onAdd: handleAddMaster,
            onCopy: handleCopyMaster,
            onPaste: () => {},
            onClear: () => handleMasterFieldChange('projectId', ''),
            onDelete: handleDeleteMaster,
            onSave: handleSaveMaster,
            onToggleView: () => setIsMasterFormView(!isMasterFormView)
          }}
          selectedRow={currentProject}
          isDirty={currentProject?.isDirty}
          searchValue={masterSearchValue}
          setSearchValue={setMasterSearchValue}
          jumpToCode={(code) => {
            const foundIdx = projectList.findIndex(proj => proj.projectId.toLowerCase().includes(code.toLowerCase()));
            if (foundIdx !== -1) {
              setSelectedProjIndex(foundIdx);
              toast.info(`Jumped to Project ${projectList[foundIdx].projectId}`);
            } else {
              toast.warn("Project profile not found");
            }
          }}
        />

        {/* MASTER LIST TABLE VIEW */}
        {!isMasterFormView ? (
          <div className="bg-white border border-gray-200 p-2 mt-2 overflow-x-auto">
            <ReusableTable
              data={projectList}
              columns={masterColumns}
              selectedRows={new Set([currentProject?.projectId])}
              onRowSelect={(row) => {
                const idx = projectList.findIndex(p => p.projectId === row.projectId);
                if (idx !== -1) setSelectedProjIndex(idx);
              }}
              showCheckboxesHeader={true}
              showCheckboxesTable={true}
              showCheckboxesHeaderTop={true}
            />
          </div>
        ) : (
          /* MASTER FORM VIEW - ALWAYS RENDERED WITHOUT HIDING FIELD NAMES */
          <div className="space-y-4 mt-2">
            {/* Identification Header Panel */}
            <FormSection title="Identification">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                <FormSearchSelect
                  label="Project"
                  value={currentProject?.projectId || ''}
                  searchTerm={projectSearch}
                  setSearchTerm={setProjectSearch}
                  options={projectOptions}
                  onSelect={(opt) => {
                    handleMasterFieldChange('projectId', opt.value);
                  }}
                  displayKey="value"
                  secondaryKey="name"
                  placeholder="Select project..."
                  disabled={!currentProject}
                />
                <div className="flex items-center m-1">
                  <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-gray-50 px-2 py-1 rounded flex-1 min-h-[20px]">
                    {currentProject?.projectName || ''}
                  </span>
                </div>
              </div>
            </FormSection>
          </div>
        )}

        {/* User-Defined Info Section - ALWAYS VISIBLE TO PREVENT HIDDEN UI */}
        <div className="mt-4">
          <SecondaryContainer title="User-Defined Info">
            <div className="space-y-2">
              
              {/* Detail Grid Toolbar */}
              <Toolbar
                isFormView={isGridFormView}
                columns={gridColumns}
                currentIndex={activeUdefIndex}
                totalRecords={activeUdefCount}
                handleNavigate={(dir) => {
                  if (activeUdefCount === 0) return;
                  if (dir === 'start') setSelectedGridRow(activeUdefItems[0]);
                  else if (dir === 'prev' && activeUdefIndex > 0) setSelectedGridRow(activeUdefItems[activeUdefIndex - 1]);
                  else if (dir === 'next' && activeUdefIndex < activeUdefCount - 1) setSelectedGridRow(activeUdefItems[activeUdefIndex + 1]);
                  else if (dir === 'end') setSelectedGridRow(activeUdefItems[activeUdefCount - 1]);
                }}
                actions={{
                  onAdd: () => {
                    handleAddGridItem();
                    setIsGridFormView(true);
                  },
                  onCopy: handleCopyGridItem,
                  onPaste: handlePasteGridItem,
                  onClear: () => {
                    toast.info("UDEF field changes discarded");
                  },
                  onDelete: handleDeleteGridItem,
                  onSave: () => {
                    toast.success("UDEF configurations updated");
                  },
                  onToggleView: () => {
                    if (!isGridFormView && !selectedGridRow && activeUdefCount > 0) {
                      setSelectedGridRow(activeUdefItems[0]);
                    }
                    setIsGridFormView(!isGridFormView);
                  }
                }}
                selectedRow={selectedGridRow}
                isDirty={false}
                clipboardCount={gridClipboard.length}
                clipboard={gridClipboard}
              />

              {/* Table View */}
              {!isGridFormView ? (
                <div className="bg-white border border-gray-200 p-2 overflow-x-auto">
                  <ReusableTable
                    data={activeUdefItems}
                    columns={gridColumns}
                    selectedRows={selectedGridIds}
                    onSelectAll={(e) => {
                      if (e.target.checked) {
                        setSelectedGridIds(new Set(activeUdefItems.map(i => i.id)));
                      } else {
                        setSelectedGridIds(new Set());
                      }
                    }}
                    onRowSelect={(row) => {
                      const newIds = new Set(selectedGridIds);
                      if (newIds.has(row.id)) newIds.delete(row.id);
                      else newIds.add(row.id);
                      setSelectedGridIds(newIds);
                      setSelectedGridRow(row);
                    }}
                    onFieldChange={handleGridFieldChange}
                  />
                </div>
              ) : (
                /* Form View for UDEF Fields */
                <div className="p-4 bg-white border border-gray-200 rounded-sm">
                  <FormSection title="UDEF Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-2">
                      <div className="space-y-2">
                        <FormInput
                          label="Sequence Number"
                          type="number"
                          value={selectedGridRow?.seqNum || 1}
                          onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'seqNum', parseInt(e.target.value) || 1)}
                          disabled={!selectedGridRow}
                        />
                        <div className="flex items-center gap-2 m-1">
                          <label className="text-[10px] text-black min-w-[90px]">Data Type</label>
                          <select
                            value={selectedGridRow?.dataType || 'Text'}
                            onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'dataType', e.target.value)}
                            className="flex-1 border border-gray-300 rounded p-1 text-[10px] bg-white outline-none focus:border-[#17414d]"
                            disabled={!selectedGridRow}
                          >
                            {dataTypeOptions.map((opt, i) => (
                              <option key={i} value={opt.optionValue}>{opt.optionLabel}</option>
                            ))}
                          </select>
                        </div>
                        <FormInput
                          label="Labels *"
                          value={selectedGridRow?.label || ''}
                          onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'label', e.target.value)}
                          required={true}
                          disabled={!selectedGridRow}
                        />
                        <FormInput
                          label="Text Value"
                          value={selectedGridRow?.textVal || ''}
                          onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'textVal', e.target.value)}
                          disabled={!selectedGridRow || selectedGridRow?.dataType !== 'Text'}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormInput
                          label="Numeric Value"
                          type="number"
                          value={selectedGridRow?.numVal || 0}
                          onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'numVal', parseFloat(e.target.value) || 0)}
                          disabled={!selectedGridRow || selectedGridRow?.dataType !== 'Numeric'}
                        />
                        <FormInput
                          label="Date Value"
                          type="date"
                          value={selectedGridRow?.dateVal || ''}
                          onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'dateVal', e.target.value)}
                          disabled={!selectedGridRow || selectedGridRow?.dataType !== 'Date'}
                        />
                        <FormInput
                          label="Costpoint Validation Field"
                          value={selectedGridRow?.validationField || ''}
                          onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'validationField', e.target.value)}
                          disabled={!selectedGridRow}
                        />
                        <FormInput
                          label="Validated Text"
                          value={selectedGridRow?.validatedText || ''}
                          onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'validatedText', e.target.value)}
                          disabled={!selectedGridRow}
                        />
                        <div className="flex items-center gap-4 m-1 min-h-[24px]">
                          <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">
                            Required
                          </label>
                          <input
                            type="checkbox"
                            checked={selectedGridRow?.required === 'Y'}
                            onChange={(e) => handleGridFieldChange(selectedGridRow?.id, 'required', e.target.checked ? 'Y' : 'N')}
                            className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                            disabled={!selectedGridRow}
                          />
                        </div>
                      </div>
                    </div>
                  </FormSection>
                </div>
              )}
            </div>
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageUDEFInformation;
