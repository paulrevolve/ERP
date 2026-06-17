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

// const incurredCostSubmissionOptions = [
//   { optionValue: '', optionLabel: '-None-' },
//   { optionValue: 'A', optionLabel: 'Incurred Cost Submission A' },
//   { optionValue: 'B', optionLabel: 'Incurred Cost Submission B' },
//   { optionValue: 'C', optionLabel: 'Incurred Cost Submission C' }
// ];

// const ManageGovernmentContractInformation = () => {
//   const [contractList, setContractList] = useState([]);
//   const [selectedIdx, setSelectedIdx] = useState(0);
//   const [activeTab, setActiveTab] = useState('contract-details');
//   const [projectSearch, setProjectSearch] = useState('');
//   const [masterSearchValue, setMasterSearchValue] = useState('');
//   const [isMasterFormView, setIsMasterFormView] = useState(true);

//   const currentContract = contractList[selectedIdx] || null;

//   const handleFieldChange = (field, value) => {
//     setContractList(prev => prev.map((contract, idx) => {
//       if (idx === selectedIdx) {
//         let updated = { ...contract, [field]: value, isDirty: true };
//         if (field === 'projectId') {
//           const matchedProj = projectOptions.find(p => p.value === value);
//           updated.projectName = matchedProj ? matchedProj.name : '';
//         }
//         return updated;
//       }
//       return contract;
//     }));
//   };

//   const handleFieldChangeByRow = (rowProjId, field, value) => {
//     setContractList(prev => prev.map((c) => {
//       if (c.projectId === rowProjId) {
//         let updated = { ...c, [field]: value, isDirty: true };
//         if (field === 'projectId') {
//           const matchedProj = projectOptions.find(p => p.value === value);
//           updated.projectName = matchedProj ? matchedProj.name : '';
//         }
//         return updated;
//       }
//       return c;
//     }));
//   };

//   const handleAdd = () => {
//     const newContract = {
//       projectId: '',
//       projectName: '',
//       contractOfficer: '',
//       contractOfficerEdit: false,
//       adminOfficer: '',
//       adminOfficerEdit: false,
//       procureOfficer: '',
//       procureOfficerEdit: false,
//       contractorRep: '',
//       contractorRepEdit: false,
//       contractorRepTitle: '',
//       contractorRepTitleEdit: false,
//       fundingSource: '',
//       fundingSourceEdit: false,
//       dpasRating: '',
//       dpasRatingEdit: false,
//       agencyId: '',
//       agencyIdEdit: false,
//       incurredCostCode: '',
//       incurredCostCodeEdit: false,
//       casCovered: false,
//       aggregateVolume: false,
//       fromMonth: '',
//       fromDay: '',
//       toMonth: '',
//       toDay: '',
//       contractYearEdit: false,
//       usePlcWage: false,
//       coPhone: '',
//       aoPhone: '',
//       poPhone: '',
//       repPhone: '',
//       sowText: '',
//       scopeText: '',
//       specialInstructions: '',
//       isDirty: true
//     };
//     setContractList([...contractList, newContract]);
//     setSelectedIdx(contractList.length);
//     setIsMasterFormView(true);
//     toast.success("New Government Contract profile created");
//   };

//   const handleCopy = () => {
//     if (!currentContract) return toast.warn("No profile to copy");
//     toast.success("Government Contract profile copied");
//   };

//   const handleDelete = () => {
//     if (contractList.length === 0) return toast.warn("No profiles to delete");
//     const updated = contractList.filter((_, idx) => idx !== selectedIdx);
//     setContractList(updated);
//     setSelectedIdx(Math.max(0, selectedIdx - 1));
//     toast.success("Profile deleted");
//   };

//   const handleSave = () => {
//     if (!currentContract?.projectId) {
//       return toast.error("Project is required");
//     }
//     setContractList(prev => prev.map((c, idx) => {
//       if (idx === selectedIdx) {
//         return { ...c, isDirty: false };
//       }
//       return c;
//     }));
//     toast.success("Profile saved successfully");
//   };

//   const handleSetDefaults = () => {
//     handleFieldChange('fromMonth', '10');
//     handleFieldChange('fromDay', '01');
//     handleFieldChange('toMonth', '09');
//     handleFieldChange('toDay', '30');
//     handleFieldChange('usePlcWage', true);
//     toast.info("Government fiscal calendar defaults applied");
//   };

//   const masterColumns = [
//     {
//       id: 'projectId',
//       key: 'projectId',
//       label: 'Project ID *',
//       type: 'search-select',
//       options: projectOptions,
//       displayKey: 'value',
//       secondaryKey: 'name',
//       required: true
//     },
//     { id: 'projectName', key: 'projectName', label: 'Project Name', type: 'readOnly-text' },
    
//     // Contract Details Columns
//     { id: 'contractOfficer', key: 'contractOfficer', label: 'Contract Officer', type: 'text' },
//     { id: 'contractOfficerEdit', key: 'contractOfficerEdit', label: 'CO Allow Edit', type: 'checkbox' },
    
//     { id: 'adminOfficer', key: 'adminOfficer', label: 'Admin Officer', type: 'text' },
//     { id: 'adminOfficerEdit', key: 'adminOfficerEdit', label: 'AO Allow Edit', type: 'checkbox' },
    
//     { id: 'procureOfficer', key: 'procureOfficer', label: 'Procurement Officer', type: 'text' },
//     { id: 'procureOfficerEdit', key: 'procureOfficerEdit', label: 'PO Allow Edit', type: 'checkbox' },
    
//     { id: 'contractorRep', key: 'contractorRep', label: 'Contractor Rep', type: 'text' },
//     { id: 'contractorRepEdit', key: 'contractorRepEdit', label: 'Rep Allow Edit', type: 'checkbox' },
    
//     { id: 'contractorRepTitle', key: 'contractorRepTitle', label: 'Contractor Rep Title', type: 'text' },
//     { id: 'contractorRepTitleEdit', key: 'contractorRepTitleEdit', label: 'Title Allow Edit', type: 'checkbox' },
    
//     { id: 'fundingSource', key: 'fundingSource', label: 'Funding Source', type: 'text' },
//     { id: 'fundingSourceEdit', key: 'fundingSourceEdit', label: 'Funding Allow Edit', type: 'checkbox' },
    
//     { id: 'dpasRating', key: 'dpasRating', label: 'DPAS Rating', type: 'text' },
//     { id: 'dpasRatingEdit', key: 'dpasRatingEdit', label: 'DPAS Allow Edit', type: 'checkbox' },
    
//     { id: 'agencyId', key: 'agencyId', label: 'Agency ID', type: 'text' },
//     { id: 'agencyIdEdit', key: 'agencyIdEdit', label: 'Agency Allow Edit', type: 'checkbox' },
    
//     {
//       id: 'incurredCostCode',
//       key: 'incurredCostCode',
//       label: 'Incurred Cost Code',
//       type: 'select',
//       options: incurredCostSubmissionOptions,
//       optionValue: 'optionValue',
//       optionLabel: 'optionLabel'
//     },
//     { id: 'incurredCostCodeEdit', key: 'incurredCostCodeEdit', label: 'Cost Code Allow Edit', type: 'checkbox' },
    
//     { id: 'casCovered', key: 'casCovered', label: 'CAS Covered', type: 'checkbox' },
//     { id: 'aggregateVolume', key: 'aggregateVolume', label: 'Aggregate Vol', type: 'checkbox' },
    
//     { id: 'fromMonth', key: 'fromMonth', label: 'From Month', type: 'text' },
//     { id: 'fromDay', key: 'fromDay', label: 'From Day', type: 'text' },
//     { id: 'toMonth', key: 'toMonth', label: 'To Month', type: 'text' },
//     { id: 'toDay', key: 'toDay', label: 'To Day', type: 'text' },
//     { id: 'contractYearEdit', key: 'contractYearEdit', label: 'POP Year Allow Edit', type: 'checkbox' },
    
//     { id: 'usePlcWage', key: 'usePlcWage', label: 'Use PLC Wage', type: 'checkbox' },
    
//     // Telephone columns
//     { id: 'coPhone', key: 'coPhone', label: 'CO Phone', type: 'text' },
//     { id: 'aoPhone', key: 'aoPhone', label: 'AO Phone', type: 'text' },
//     { id: 'poPhone', key: 'poPhone', label: 'PO Phone', type: 'text' },
//     { id: 'repPhone', key: 'repPhone', label: 'Rep Phone', type: 'text' },
    
//     // Statement of Work columns
//     { id: 'sowText', key: 'sowText', label: 'Statement of Work', type: 'text' },
//     { id: 'scopeText', key: 'scopeText', label: 'Scope Description', type: 'text' },
//     { id: 'specialInstructions', key: 'specialInstructions', label: 'Special Instructions', type: 'text' }
//   ];

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={Layers} title="Manage Government Contract Information">
        
//         {/* ACTION TOOLBAR */}
//         <Toolbar
//           isFormView={isMasterFormView}
//           columns={masterColumns}
//           currentIndex={selectedIdx}
//           totalRecords={contractList.length}
//           handleNavigate={(dir) => {
//             if (dir === 'start') setSelectedIdx(0);
//             else if (dir === 'prev' && selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
//             else if (dir === 'next' && selectedIdx < contractList.length - 1) setSelectedIdx(selectedIdx + 1);
//             else if (dir === 'end') setSelectedIdx(contractList.length - 1);
//           }}
//           actions={{
//             onAdd: handleAdd,
//             onCopy: handleCopy,
//             onPaste: () => {},
//             onClear: () => handleFieldChange('projectId', ''),
//             onDelete: handleDelete,
//             onSave: handleSave,
//             onToggleView: () => setIsMasterFormView(!isMasterFormView)
//           }}
//           selectedRow={currentContract}
//           isDirty={currentContract?.isDirty}
//           searchValue={masterSearchValue}
//           setSearchValue={setMasterSearchValue}
//           jumpToCode={(code) => {
//             const foundIdx = contractList.findIndex(c => c.projectId.toLowerCase().includes(code.toLowerCase()));
//             if (foundIdx !== -1) {
//               setSelectedIdx(foundIdx);
//               toast.info(`Jumped to Project ${contractList[foundIdx].projectId}`);
//             } else {
//               toast.warn("Contract profile not found");
//             }
//           }}
//         />

//         {/* MASTER LIST TABLE VIEW */}
//         {!isMasterFormView ? (
//           <div className="bg-white border border-gray-200 p-2 mt-2 overflow-x-auto">
//             <ReusableTable
//               data={contractList}
//               columns={masterColumns}
//               selectedRows={new Set([currentContract?.projectId])}
//               onRowSelect={(row) => {
//                 const idx = contractList.findIndex(c => c.projectId === row.projectId);
//                 if (idx !== -1) setSelectedIdx(idx);
//               }}
//               onFieldChange={handleFieldChangeByRow}
//               rowKey="projectId"
//               showCheckboxesHeader={true}
//               showCheckboxesTable={true}
//               showCheckboxesHeaderTop={true}
//             />
//           </div>
//         ) : (
//           /* MASTER FORM VIEW */
//           currentContract ? (
//             <div className="space-y-4 mt-2">
              
//               {/* Project Selection Header */}
//               <FormSection title="Project">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
//                   <FormSearchSelect
//                     label="Project"
//                     value={currentContract.projectId}
//                     searchTerm={projectSearch}
//                     setSearchTerm={setProjectSearch}
//                     options={projectOptions}
//                     onSelect={(opt) => {
//                       handleFieldChange('projectId', opt.value);
//                     }}
//                     displayKey="value"
//                     secondaryKey="name"
//                     placeholder="Select project..."
//                   />
//                   <div className="flex items-center m-1">
//                     <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-gray-50 px-2 py-1 rounded flex-1">
//                       {currentContract.projectName || 'No Project Selected'}
//                     </span>
//                   </div>
//                 </div>
//               </FormSection>

//               {/* TAB CONTAINER */}
//               <SecondaryContainer title="Government Contract Information">
//                 <div className="space-y-4">
                  
//                   {/* Tabs Selection Bar */}
//                   <div className="flex border-b border-gray-200 bg-gray-50">
//                     <button
//                       onClick={() => setActiveTab('contract-details')}
//                       className={`px-4 py-1.5 text-xs font-semibold border-r border-gray-200 cursor-pointer transition-all ${
//                         activeTab === 'contract-details'
//                           ? 'bg-[#17414d] text-white'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       }`}
//                     >
//                       Contract Details
//                     </button>
//                     <button
//                       onClick={() => setActiveTab('tel-numbers')}
//                       className={`px-4 py-1.5 text-xs font-semibold border-r border-gray-200 cursor-pointer transition-all ${
//                         activeTab === 'tel-numbers'
//                           ? 'bg-[#17414d] text-white'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       }`}
//                     >
//                       Telephone Numbers
//                     </button>
//                     <button
//                       onClick={() => setActiveTab('sow')}
//                       className={`px-4 py-1.5 text-xs font-semibold border-r border-gray-200 cursor-pointer transition-all ${
//                         activeTab === 'sow'
//                           ? 'bg-[#17414d] text-white'
//                           : 'text-gray-600 hover:bg-gray-100'
//                       }`}
//                     >
//                       Statement of Work
//                     </button>
//                   </div>

//                   {/* TAB 1: CONTRACT DETAILS */}
//                   {activeTab === 'contract-details' && (
//                     <div className="space-y-4 p-2 bg-[#e5f3fb]/20 rounded-sm border border-gray-100">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Left Column */}
//                         <div className="space-y-2">
//                           {[
//                             { field: 'contractOfficer', label: 'Contract Officer', editField: 'contractOfficerEdit' },
//                             { field: 'adminOfficer', label: 'Administrative Officer', editField: 'adminOfficerEdit' },
//                             { field: 'procureOfficer', label: 'Procurement Officer', editField: 'procureOfficerEdit' },
//                             { field: 'contractorRep', label: 'Contractor Representative', editField: 'contractorRepEdit' },
//                             { field: 'contractorRepTitle', label: 'Contractor Representative Title', editField: 'contractorRepTitleEdit' }
//                           ].map((item) => (
//                             <div key={item.field} className="flex items-center justify-between gap-4">
//                               <div className="flex-1">
//                                 <FormInput
//                                   label={item.label}
//                                   value={currentContract[item.field] || ''}
//                                   onChange={(e) => handleFieldChange(item.field, e.target.value)}
//                                   disabled={!currentContract[item.editField]}
//                                 />
//                               </div>
//                               <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
//                                 <label className="text-[9px] text-gray-500 whitespace-nowrap">Allow Edit</label>
//                                 <input
//                                   type="checkbox"
//                                   checked={!!currentContract[item.editField]}
//                                   onChange={(e) => handleFieldChange(item.editField, e.target.checked)}
//                                   className="w-3 h-3 accent-[#17414d] cursor-pointer"
//                                 />
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Right Column */}
//                         <div className="space-y-2">
//                           {[
//                             { field: 'fundingSource', label: 'Funding Source', editField: 'fundingSourceEdit' },
//                             { field: 'dpasRating', label: 'DPAS Purchasing Rating', editField: 'dpasRatingEdit' },
//                             { field: 'agencyId', label: 'Agency ID', editField: 'agencyIdEdit' }
//                           ].map((item) => (
//                             <div key={item.field} className="flex items-center justify-between gap-4">
//                               <div className="flex-1">
//                                 <FormInput
//                                   label={item.label}
//                                   value={currentContract[item.field] || ''}
//                                   onChange={(e) => handleFieldChange(item.field, e.target.value)}
//                                   disabled={!currentContract[item.editField]}
//                                 />
//                               </div>
//                               <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
//                                 <label className="text-[9px] text-gray-500 whitespace-nowrap">Allow Edit</label>
//                                 <input
//                                   type="checkbox"
//                                   checked={!!currentContract[item.editField]}
//                                   onChange={(e) => handleFieldChange(item.editField, e.target.checked)}
//                                   className="w-3 h-3 accent-[#17414d] cursor-pointer"
//                                 />
//                               </div>
//                             </div>
//                           ))}

//                           {/* Dropdown Input: Incurred Cost Code */}
//                           <div className="flex items-center justify-between gap-4">
//                             <div className="flex items-center gap-2 m-1 flex-1">
//                               <label className="text-[10px] text-black min-w-[90px]">Incurred Cost Code</label>
//                               <select
//                                 value={currentContract.incurredCostCode || ''}
//                                 onChange={(e) => handleFieldChange('incurredCostCode', e.target.value)}
//                                 disabled={!currentContract.incurredCostCodeEdit}
//                                 className="flex-1 border border-gray-300 rounded p-1 text-[10px] bg-white outline-none focus:border-[#17414d] disabled:bg-gray-100 disabled:cursor-not-allowed"
//                               >
//                                 {incurredCostSubmissionOptions.map((opt) => (
//                                   <option key={opt.optionValue} value={opt.optionValue}>{opt.optionLabel}</option>
//                                 ))}
//                               </select>
//                             </div>
//                             <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
//                               <label className="text-[9px] text-gray-500 whitespace-nowrap">Allow Edit</label>
//                               <input
//                                 type="checkbox"
//                                 checked={!!currentContract.incurredCostCodeEdit}
//                                 onChange={(e) => handleFieldChange('incurredCostCodeEdit', e.target.checked)}
//                                 className="w-3 h-3 accent-[#17414d] cursor-pointer"
//                               />
//                             </div>
//                           </div>

//                           {/* CAS Covered & Aggregate Volume checkboxes */}
//                           <div className="flex items-center gap-6 pl-[98px] pt-1">
//                             <div className="flex items-center gap-2">
//                               <input
//                                 type="checkbox"
//                                 id="cas-covered"
//                                 checked={!!currentContract.casCovered}
//                                 onChange={(e) => handleFieldChange('casCovered', e.target.checked)}
//                                 className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
//                               />
//                               <label htmlFor="cas-covered" className="text-[10px] text-black cursor-pointer select-none">
//                                 CAS Covered
//                               </label>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <input
//                                 type="checkbox"
//                                 id="agg-vol"
//                                 checked={!!currentContract.aggregateVolume}
//                                 onChange={(e) => handleFieldChange('aggregateVolume', e.target.checked)}
//                                 className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
//                               />
//                               <label htmlFor="agg-vol" className="text-[10px] text-black cursor-pointer select-none">
//                                 Include in Aggregate Volume
//                               </label>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Bottom Subsection layout */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-200/50 mt-4">
//                         {/* Contract Year */}
//                         <FormSection title="Contract Year">
//                           <div className="flex items-center gap-4 py-2 px-1">
//                             <div className="flex items-center gap-2">
//                               <span className="text-[10px] font-medium text-gray-600">From</span>
//                               <input
//                                 type="text"
//                                 maxLength={2}
//                                 placeholder="Month"
//                                 value={currentContract.fromMonth || ''}
//                                 onChange={(e) => handleFieldChange('fromMonth', e.target.value.replace(/\D/g, ''))}
//                                 disabled={!currentContract.contractYearEdit}
//                                 className="w-12 text-center border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] disabled:bg-gray-100"
//                               />
//                               <input
//                                 type="text"
//                                 maxLength={2}
//                                 placeholder="Day"
//                                 value={currentContract.fromDay || ''}
//                                 onChange={(e) => handleFieldChange('fromDay', e.target.value.replace(/\D/g, ''))}
//                                 disabled={!currentContract.contractYearEdit}
//                                 className="w-12 text-center border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] disabled:bg-gray-100"
//                               />
//                             </div>

//                             <div className="flex items-center gap-2">
//                               <span className="text-[10px] font-medium text-gray-600">To</span>
//                               <input
//                                 type="text"
//                                 maxLength={2}
//                                 placeholder="Month"
//                                 value={currentContract.toMonth || ''}
//                                 onChange={(e) => handleFieldChange('toMonth', e.target.value.replace(/\D/g, ''))}
//                                 disabled={!currentContract.contractYearEdit}
//                                 className="w-12 text-center border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] disabled:bg-gray-100"
//                               />
//                               <input
//                                 type="text"
//                                 maxLength={2}
//                                 placeholder="Day"
//                                 value={currentContract.toDay || ''}
//                                 onChange={(e) => handleFieldChange('toDay', e.target.value.replace(/\D/g, ''))}
//                                 disabled={!currentContract.contractYearEdit}
//                                 className="w-12 text-center border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] disabled:bg-gray-100"
//                               />
//                             </div>

//                             <div className="flex items-center gap-1.5 ml-auto">
//                               <label className="text-[9px] text-gray-500 whitespace-nowrap">Allow Edit</label>
//                               <input
//                                 type="checkbox"
//                                 checked={!!currentContract.contractYearEdit}
//                                 onChange={(e) => handleFieldChange('contractYearEdit', e.target.checked)}
//                                 className="w-3 h-3 accent-[#17414d] cursor-pointer"
//                               />
//                             </div>
//                           </div>
//                         </FormSection>

//                         {/* Wage Determination */}
//                         <FormSection title="Wage Determination">
//                           <div className="flex items-center justify-between py-2 px-1">
//                             <div className="flex items-center gap-2">
//                               <input
//                                 type="checkbox"
//                                 id="use-plc-wage"
//                                 checked={!!currentContract.usePlcWage}
//                                 onChange={(e) => handleFieldChange('usePlcWage', e.target.checked)}
//                                 className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
//                               />
//                               <label htmlFor="use-plc-wage" className="text-[10px] text-black cursor-pointer select-none">
//                                 Use PLC for Wage Determination
//                               </label>
//                             </div>
                            
//                             <button
//                               onClick={handleSetDefaults}
//                               className="bg-[#17414d] hover:bg-[#12333d] active:scale-95 transition-all text-white px-3 py-1 rounded text-[10px] font-bold shadow-sm cursor-pointer"
//                             >
//                               Set Defaults
//                             </button>
//                           </div>
//                         </FormSection>
//                       </div>
//                     </div>
//                   )}

//                   {/* TAB 2: TELEPHONE NUMBERS */}
//                   {activeTab === 'tel-numbers' && (
//                     <div className="space-y-4 p-4 bg-[#e5f3fb]/20 rounded-sm border border-gray-100">
//                       <FormSection title="Officer Phone Numbers">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
//                           <FormInput
//                             label="Contract Officer Phone"
//                             value={currentContract.coPhone || ''}
//                             onChange={(e) => handleFieldChange('coPhone', e.target.value)}
//                           />
//                           <FormInput
//                             label="Administrative Officer Phone"
//                             value={currentContract.aoPhone || ''}
//                             onChange={(e) => handleFieldChange('aoPhone', e.target.value)}
//                           />
//                           <FormInput
//                             label="Procurement Officer Phone"
//                             value={currentContract.poPhone || ''}
//                             onChange={(e) => handleFieldChange('poPhone', e.target.value)}
//                           />
//                           <FormInput
//                             label="Contractor Representative Phone"
//                             value={currentContract.repPhone || ''}
//                             onChange={(e) => handleFieldChange('repPhone', e.target.value)}
//                           />
//                         </div>
//                       </FormSection>
//                     </div>
//                   )}

//                   {/* TAB 3: STATEMENT OF WORK */}
//                   {activeTab === 'sow' && (
//                     <div className="space-y-4 p-4 bg-[#e5f3fb]/20 rounded-sm border border-gray-100">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <div className="md:col-span-2">
//                           <FormSection title="Statement of Work">
//                             <div className="p-1">
//                               <textarea
//                                 value={currentContract.sowText || ''}
//                                 onChange={(e) => handleFieldChange('sowText', e.target.value)}
//                                 rows={5}
//                                 placeholder="Enter statement of work details..."
//                                 className="w-full border border-gray-300 rounded p-1.5 outline-none text-[10px] focus:border-[#17414d]"
//                               />
//                             </div>
//                           </FormSection>
//                         </div>

//                         <div className="space-y-4">
//                           <FormSection title="Scope Description">
//                             <div className="p-1">
//                               <textarea
//                                 value={currentContract.scopeText || ''}
//                                 onChange={(e) => handleFieldChange('scopeText', e.target.value)}
//                                 rows={2}
//                                 placeholder="Enter scope description..."
//                                 className="w-full border border-gray-300 rounded p-1.5 outline-none text-[10px] focus:border-[#17414d]"
//                               />
//                             </div>
//                           </FormSection>

//                           <FormSection title="Special Instructions">
//                             <div className="p-1">
//                               <textarea
//                                 value={currentContract.specialInstructions || ''}
//                                 onChange={(e) => handleFieldChange('specialInstructions', e.target.value)}
//                                 rows={2}
//                                 placeholder="Enter special instructions..."
//                                 className="w-full border border-gray-300 rounded p-1.5 outline-none text-[10px] focus:border-[#17414d]"
//                               />
//                             </div>
//                           </FormSection>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                 </div>
//               </SecondaryContainer>
//             </div>
//           ) : (
//             <div className="text-center py-10 bg-gray-50 text-gray-400 text-xs italic">
//               No active Government Contract profile. Click "Add New" in the toolbar to create one.
//             </div>
//           )
//         )}
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageGovernmentContractInformation;

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

const incurredCostSubmissionOptions = [
  { optionValue: '', optionLabel: '-None-' },
  { optionValue: 'A', optionLabel: 'Incurred Cost Submission A' },
  { optionValue: 'B', optionLabel: 'Incurred Cost Submission B' },
  { optionValue: 'C', optionLabel: 'Incurred Cost Submission C' }
];

const ManageGovernmentContractInformation = () => {
  const [contractList, setContractList] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('contract-details');
  const [projectSearch, setProjectSearch] = useState('');
  const [masterSearchValue, setMasterSearchValue] = useState('');
  const [isMasterFormView, setIsMasterFormView] = useState(false);

  const currentContract = contractList[selectedIdx] || null;

  const handleFieldChange = (field, value) => {
    setContractList(prev => prev.map((contract, idx) => {
      if (idx === selectedIdx) {
        let updated = { ...contract, [field]: value, isDirty: true };
        if (field === 'projectId') {
          const matchedProj = projectOptions.find(p => p.value === value);
          updated.projectName = matchedProj ? matchedProj.name : '';
        }
        return updated;
      }
      return contract;
    }));
  };

  const handleFieldChangeByRow = (rowProjId, field, value) => {
    setContractList(prev => prev.map((c) => {
      if (c.projectId === rowProjId) {
        let updated = { ...c, [field]: value, isDirty: true };
        if (field === 'projectId') {
          const matchedProj = projectOptions.find(p => p.value === value);
          updated.projectName = matchedProj ? matchedProj.name : '';
        }
        return updated;
      }
      return c;
    }));
  };

  const handleAdd = () => {
    const newContract = {
      projectId: '',
      projectName: '',
      contractOfficer: '',
      contractOfficerEdit: false,
      adminOfficer: '',
      adminOfficerEdit: false,
      procureOfficer: '',
      procureOfficerEdit: false,
      contractorRep: '',
      contractorRepEdit: false,
      contractorRepTitle: '',
      contractorRepTitleEdit: false,
      fundingSource: '',
      fundingSourceEdit: false,
      dpasRating: '',
      dpasRatingEdit: false,
      agencyId: '',
      agencyIdEdit: false,
      incurredCostCode: '',
      incurredCostCodeEdit: false,
      casCovered: false,
      aggregateVolume: false,
      fromMonth: '',
      fromDay: '',
      toMonth: '',
      toDay: '',
      contractYearEdit: false,
      usePlcWage: false,
      coPhone: '',
      aoPhone: '',
      poPhone: '',
      repPhone: '',
      sowText: '',
      scopeText: '',
      specialInstructions: '',
      isDirty: true
    };
    setContractList([...contractList, newContract]);
    setSelectedIdx(contractList.length);
    setIsMasterFormView(true);
    toast.success("New Government Contract profile created");
  };

  const handleCopy = () => {
    if (!currentContract) return toast.warn("No profile to copy");
    toast.success("Government Contract profile copied");
  };

  const handleDelete = () => {
    if (contractList.length === 0) return toast.warn("No profiles to delete");
    const updated = contractList.filter((_, idx) => idx !== selectedIdx);
    setContractList(updated);
    setSelectedIdx(Math.max(0, selectedIdx - 1));
    toast.success("Profile deleted");
  };

  const handleSave = () => {
    if (!currentContract) return toast.error("No profile to save");
    if (!currentContract.projectId) {
      return toast.error("Project is required");
    }
    setContractList(prev => prev.map((c, idx) => {
      if (idx === selectedIdx) {
        return { ...c, isDirty: false };
      }
      return c;
    }));
    toast.success("Profile saved successfully");
  };

  const handleSetDefaults = () => {
    if (!currentContract) return;
    handleFieldChange('fromMonth', '10');
    handleFieldChange('fromDay', '01');
    handleFieldChange('toMonth', '09');
    handleFieldChange('toDay', '30');
    handleFieldChange('usePlcWage', true);
    toast.info("Government fiscal calendar defaults applied");
  };

  const masterColumns = [
    {
      id: 'projectId',
      key: 'projectId',
      label: 'Project ID *',
      type: 'search-select',
      options: projectOptions,
      displayKey: 'value',
      secondaryKey: 'name',
      required: true
    },
    { id: 'projectName', key: 'projectName', label: 'Project Name', type: 'readOnly-text' },
    
    // Contract Details Columns
    { id: 'contractOfficer', key: 'contractOfficer', label: 'Contract Officer', type: 'text' },
    { id: 'contractOfficerEdit', key: 'contractOfficerEdit', label: 'CO Allow Edit', type: 'checkbox' },
    
    { id: 'adminOfficer', key: 'adminOfficer', label: 'Admin Officer', type: 'text' },
    { id: 'adminOfficerEdit', key: 'adminOfficerEdit', label: 'AO Allow Edit', type: 'checkbox' },
    
    { id: 'procureOfficer', key: 'procureOfficer', label: 'Procurement Officer', type: 'text' },
    { id: 'procureOfficerEdit', key: 'procureOfficerEdit', label: 'PO Allow Edit', type: 'checkbox' },
    
    { id: 'contractorRep', key: 'contractorRep', label: 'Contractor Rep', type: 'text' },
    { id: 'contractorRepEdit', key: 'contractorRepEdit', label: 'Rep Allow Edit', type: 'checkbox' },
    
    { id: 'contractorRepTitle', key: 'contractorRepTitle', label: 'Contractor Rep Title', type: 'text' },
    { id: 'contractorRepTitleEdit', key: 'contractorRepTitleEdit', label: 'Title Allow Edit', type: 'checkbox' },
    
    { id: 'fundingSource', key: 'fundingSource', label: 'Funding Source', type: 'text' },
    { id: 'fundingSourceEdit', key: 'fundingSourceEdit', label: 'Funding Allow Edit', type: 'checkbox' },
    
    { id: 'dpasRating', key: 'dpasRating', label: 'DPAS Rating', type: 'text' },
    { id: 'dpasRatingEdit', key: 'dpasRatingEdit', label: 'DPAS Allow Edit', type: 'checkbox' },
    
    { id: 'agencyId', key: 'agencyId', label: 'Agency ID', type: 'text' },
    { id: 'agencyIdEdit', key: 'agencyIdEdit', label: 'Agency Allow Edit', type: 'checkbox' },
    
    {
      id: 'incurredCostCode',
      key: 'incurredCostCode',
      label: 'Incurred Cost Code',
      type: 'select',
      options: incurredCostSubmissionOptions,
      optionValue: 'optionValue',
      optionLabel: 'optionLabel'
    },
    { id: 'incurredCostCodeEdit', key: 'incurredCostCodeEdit', label: 'Cost Code Allow Edit', type: 'checkbox' },
    
    { id: 'casCovered', key: 'casCovered', label: 'CAS Covered', type: 'checkbox' },
    { id: 'aggregateVolume', key: 'aggregateVolume', label: 'Aggregate Vol', type: 'checkbox' },
    
    { id: 'fromMonth', key: 'fromMonth', label: 'From Month', type: 'text' },
    { id: 'fromDay', key: 'fromDay', label: 'From Day', type: 'text' },
    { id: 'toMonth', key: 'toMonth', label: 'To Month', type: 'text' },
    { id: 'toDay', key: 'toDay', label: 'To Day', type: 'text' },
    { id: 'contractYearEdit', key: 'contractYearEdit', label: 'POP Year Allow Edit', type: 'checkbox' },
    
    { id: 'usePlcWage', key: 'usePlcWage', label: 'Use PLC Wage', type: 'checkbox' },
    
    // Telephone columns
    { id: 'coPhone', key: 'coPhone', label: 'CO Phone', type: 'text' },
    { id: 'aoPhone', key: 'aoPhone', label: 'AO Phone', type: 'text' },
    { id: 'poPhone', key: 'poPhone', label: 'PO Phone', type: 'text' },
    { id: 'repPhone', key: 'repPhone', label: 'Rep Phone', type: 'text' },
    
    // Statement of Work columns
    { id: 'sowText', key: 'sowText', label: 'Statement of Work', type: 'text' },
    { id: 'scopeText', key: 'scopeText', label: 'Scope Description', type: 'text' },
    { id: 'specialInstructions', key: 'specialInstructions', label: 'Special Instructions', type: 'text' }
  ];

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Layers} title="Manage Government Contract Information">
        
        {/* ACTION TOOLBAR */}
        <Toolbar
          isFormView={isMasterFormView}
          columns={masterColumns}
          currentIndex={selectedIdx}
          totalRecords={contractList.length}
          handleNavigate={(dir) => {
            if (dir === 'start') setSelectedIdx(0);
            else if (dir === 'prev' && selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
            else if (dir === 'next' && selectedIdx < contractList.length - 1) setSelectedIdx(selectedIdx + 1);
            else if (dir === 'end') setSelectedIdx(contractList.length - 1);
          }}
          actions={{
            onAdd: handleAdd,
            onCopy: handleCopy,
            onPaste: () => {},
            onClear: () => handleFieldChange('projectId', ''),
            onDelete: handleDelete,
            onSave: handleSave,
            onToggleView: () => setIsMasterFormView(!isMasterFormView)
          }}
          selectedRow={currentContract}
          isDirty={currentContract?.isDirty}
          searchValue={masterSearchValue}
          setSearchValue={setMasterSearchValue}
          jumpToCode={(code) => {
            const foundIdx = contractList.findIndex(c => c.projectId.toLowerCase().includes(code.toLowerCase()));
            if (foundIdx !== -1) {
              setSelectedIdx(foundIdx);
              toast.info(`Jumped to Project ${contractList[foundIdx].projectId}`);
            } else {
              toast.warn("Contract profile not found");
            }
          }}
        />

        {/* MASTER LIST TABLE VIEW */}
        {!isMasterFormView ? (
          <div className="bg-white border border-gray-200 p-2 mt-2 overflow-x-auto">
            <ReusableTable
              data={contractList}
              columns={masterColumns}
              selectedRows={new Set([currentContract?.projectId])}
              onRowSelect={(row) => {
                const idx = contractList.findIndex(c => c.projectId === row.projectId);
                if (idx !== -1) setSelectedIdx(idx);
              }}
              onFieldChange={handleFieldChangeByRow}
              rowKey="projectId"
              showCheckboxesHeader={true}
              showCheckboxesTable={true}
              showCheckboxesHeaderTop={true}
            />
          </div>
        ) : (
          /* MASTER FORM VIEW - ALWAYS RENDERED WITHOUT HIDING FIELD NAMES */
          <div className="space-y-4 mt-2">
            
            {/* Project Selection Header */}
            <FormSection title="Project">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                <FormSearchSelect
                  label="Project"
                  value={currentContract?.projectId || ''}
                  searchTerm={projectSearch}
                  setSearchTerm={setProjectSearch}
                  options={projectOptions}
                  onSelect={(opt) => {
                    handleFieldChange('projectId', opt.value);
                  }}
                  displayKey="value"
                  secondaryKey="name"
                  placeholder="Select project..."
                  disabled={!currentContract}
                />
                <div className="flex items-center m-1">
                  <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-gray-50 px-2 py-1 rounded flex-1 min-h-[20px]">
                    {currentContract?.projectName || ''}
                  </span>
                </div>
              </div>
            </FormSection>

            {/* TAB CONTAINER */}
            <SecondaryContainer title="Government Contract Information">
              <div className="space-y-4">
                
                {/* Tabs Selection Bar */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setActiveTab('contract-details')}
                    className={`px-4 py-1.5 text-xs font-semibold border-r border-gray-200 cursor-pointer transition-all ${
                      activeTab === 'contract-details'
                        ? 'bg-[#17414d] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Contract Details
                  </button>
                  <button
                    onClick={() => setActiveTab('tel-numbers')}
                    className={`px-4 py-1.5 text-xs font-semibold border-r border-gray-200 cursor-pointer transition-all ${
                      activeTab === 'tel-numbers'
                        ? 'bg-[#17414d] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Telephone Numbers
                  </button>
                  <button
                    onClick={() => setActiveTab('sow')}
                    className={`px-4 py-1.5 text-xs font-semibold border-r border-gray-200 cursor-pointer transition-all ${
                      activeTab === 'sow'
                        ? 'bg-[#17414d] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Statement of Work
                  </button>
                </div>

                {/* TAB 1: CONTRACT DETAILS */}
                {activeTab === 'contract-details' && (
                  <div className="space-y-4 p-2 bg-[#e5f3fb]/20 rounded-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-2">
                        {[
                          { field: 'contractOfficer', label: 'Contract Officer', editField: 'contractOfficerEdit' },
                          { field: 'adminOfficer', label: 'Administrative Officer', editField: 'adminOfficerEdit' },
                          { field: 'procureOfficer', label: 'Procurement Officer', editField: 'procureOfficerEdit' },
                          { field: 'contractorRep', label: 'Contractor Representative', editField: 'contractorRepEdit' },
                          { field: 'contractorRepTitle', label: 'Contractor Representative Title', editField: 'contractorRepTitleEdit' }
                        ].map((item) => (
                          <div key={item.field} className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <FormInput
                                label={item.label}
                                value={currentContract ? currentContract[item.field] : ''}
                                onChange={(e) => handleFieldChange(item.field, e.target.value)}
                                disabled={!currentContract || !currentContract[item.editField]}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
                              <label className="text-[9px] text-gray-500 whitespace-nowrap">Allow Edit</label>
                              <input
                                type="checkbox"
                                checked={!!currentContract?.[item.editField]}
                                onChange={(e) => handleFieldChange(item.editField, e.target.checked)}
                                className="w-3 h-3 accent-[#17414d] cursor-pointer"
                                disabled={!currentContract}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-2">
                        {[
                          { field: 'fundingSource', label: 'Funding Source', editField: 'fundingSourceEdit' },
                          { field: 'dpasRating', label: 'DPAS Purchasing Rating', editField: 'dpasRatingEdit' },
                          { field: 'agencyId', label: 'Agency ID', editField: 'agencyIdEdit' }
                        ].map((item) => (
                          <div key={item.field} className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <FormInput
                                label={item.label}
                                value={currentContract ? currentContract[item.field] : ''}
                                onChange={(e) => handleFieldChange(item.field, e.target.value)}
                                disabled={!currentContract || !currentContract[item.editField]}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
                              <label className="text-[9px] text-gray-500 whitespace-nowrap">Allow Edit</label>
                              <input
                                type="checkbox"
                                checked={!!currentContract?.[item.editField]}
                                onChange={(e) => handleFieldChange(item.editField, e.target.checked)}
                                className="w-3 h-3 accent-[#17414d] cursor-pointer"
                                disabled={!currentContract}
                              />
                            </div>
                          </div>
                        ))}

                        {/* Dropdown Input: Incurred Cost Code */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 m-1 flex-1">
                            <label className="text-[10px] text-black min-w-[90px]">Incurred Cost Code</label>
                            <select
                              value={currentContract?.incurredCostCode || ''}
                              onChange={(e) => handleFieldChange('incurredCostCode', e.target.value)}
                              disabled={!currentContract || !currentContract.incurredCostCodeEdit}
                              className="flex-1 border border-gray-300 rounded p-1 text-[10px] bg-white outline-none focus:border-[#17414d] disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              {incurredCostSubmissionOptions.map((opt) => (
                                <option key={opt.optionValue} value={opt.optionValue}>{opt.optionLabel}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-1.5 min-w-[70px] justify-end">
                            <label className="text-[9px] text-gray-500 whitespace-nowrap">Allow Edit</label>
                            <input
                              type="checkbox"
                              checked={!!currentContract?.incurredCostCodeEdit}
                              onChange={(e) => handleFieldChange('incurredCostCodeEdit', e.target.checked)}
                              className="w-3 h-3 accent-[#17414d] cursor-pointer"
                              disabled={!currentContract}
                            />
                          </div>
                        </div>

                        {/* CAS Covered & Aggregate Volume checkboxes */}
                        <div className="flex items-center gap-6 pl-[98px] pt-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="cas-covered"
                              checked={!!currentContract?.casCovered}
                              onChange={(e) => handleFieldChange('casCovered', e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                              disabled={!currentContract}
                            />
                            <label htmlFor="cas-covered" className="text-[10px] text-black cursor-pointer select-none">
                              CAS Covered
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="agg-vol"
                              checked={!!currentContract?.aggregateVolume}
                              onChange={(e) => handleFieldChange('aggregateVolume', e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                              disabled={!currentContract}
                            />
                            <label htmlFor="agg-vol" className="text-[10px] text-black cursor-pointer select-none">
                              Include in Aggregate Volume
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Subsection layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-200/50 mt-4">
                      {/* Contract Year */}
                      <FormSection title="Contract Year">
                        <div className="flex items-center gap-4 py-2 px-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-gray-600">From</span>
                            <input
                              type="text"
                              maxLength={2}
                              placeholder="Month"
                              value={currentContract?.fromMonth || ''}
                              onChange={(e) => handleFieldChange('fromMonth', e.target.value.replace(/\D/g, ''))}
                              disabled={!currentContract || !currentContract.contractYearEdit}
                              className="w-12 text-center border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] disabled:bg-gray-100"
                            />
                            <input
                              type="text"
                              maxLength={2}
                              placeholder="Day"
                              value={currentContract?.fromDay || ''}
                              onChange={(e) => handleFieldChange('fromDay', e.target.value.replace(/\D/g, ''))}
                              disabled={!currentContract || !currentContract.contractYearEdit}
                              className="w-12 text-center border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] disabled:bg-gray-100"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-gray-600">To</span>
                            <input
                              type="text"
                              maxLength={2}
                              placeholder="Month"
                              value={currentContract?.toMonth || ''}
                              onChange={(e) => handleFieldChange('toMonth', e.target.value.replace(/\D/g, ''))}
                              disabled={!currentContract || !currentContract.contractYearEdit}
                              className="w-12 text-center border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] disabled:bg-gray-100"
                            />
                            <input
                              type="text"
                              maxLength={2}
                              placeholder="Day"
                              value={currentContract?.toDay || ''}
                              onChange={(e) => handleFieldChange('toDay', e.target.value.replace(/\D/g, ''))}
                              disabled={!currentContract || !currentContract.contractYearEdit}
                              className="w-12 text-center border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] disabled:bg-gray-100"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 ml-auto">
                            <label className="text-[9px] text-gray-500 whitespace-nowrap">Allow Edit</label>
                            <input
                              type="checkbox"
                              checked={!!currentContract?.contractYearEdit}
                              onChange={(e) => handleFieldChange('contractYearEdit', e.target.checked)}
                              className="w-3 h-3 accent-[#17414d] cursor-pointer"
                              disabled={!currentContract}
                            />
                          </div>
                        </div>
                      </FormSection>

                      {/* Wage Determination */}
                      <FormSection title="Wage Determination">
                        <div className="flex items-center justify-between py-2 px-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="use-plc-wage"
                              checked={!!currentContract?.usePlcWage}
                              onChange={(e) => handleFieldChange('usePlcWage', e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#17414d] cursor-pointer"
                              disabled={!currentContract}
                            />
                            <label htmlFor="use-plc-wage" className="text-[10px] text-black cursor-pointer select-none">
                              Use PLC for Wage Determination
                            </label>
                          </div>
                          
                          <button
                            onClick={handleSetDefaults}
                            className="bg-[#17414d] hover:bg-[#12333d] active:scale-95 transition-all text-white px-3 py-1 rounded text-[10px] font-bold shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!currentContract}
                          >
                            Set Defaults
                          </button>
                        </div>
                      </FormSection>
                    </div>
                  </div>
                )}

                {/* TAB 2: TELEPHONE NUMBERS */}
                {activeTab === 'tel-numbers' && (
                  <div className="space-y-4 p-4 bg-[#e5f3fb]/20 rounded-sm border border-gray-100">
                    <FormSection title="Officer Phone Numbers">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        <FormInput
                          label="Contract Officer Phone"
                          value={currentContract?.coPhone || ''}
                          onChange={(e) => handleFieldChange('coPhone', e.target.value)}
                          disabled={!currentContract}
                        />
                        <FormInput
                          label="Administrative Officer Phone"
                          value={currentContract?.aoPhone || ''}
                          onChange={(e) => handleFieldChange('aoPhone', e.target.value)}
                          disabled={!currentContract}
                        />
                        <FormInput
                          label="Procurement Officer Phone"
                          value={currentContract?.poPhone || ''}
                          onChange={(e) => handleFieldChange('poPhone', e.target.value)}
                          disabled={!currentContract}
                        />
                        <FormInput
                          label="Contractor Representative Phone"
                          value={currentContract?.repPhone || ''}
                          onChange={(e) => handleFieldChange('repPhone', e.target.value)}
                          disabled={!currentContract}
                        />
                      </div>
                    </FormSection>
                  </div>
                )}

                {/* TAB 3: STATEMENT OF WORK */}
                {activeTab === 'sow' && (
                  <div className="space-y-4 p-4 bg-[#e5f3fb]/20 rounded-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <FormSection title="Statement of Work">
                          <div className="p-1">
                            <textarea
                              value={currentContract?.sowText || ''}
                              onChange={(e) => handleFieldChange('sowText', e.target.value)}
                              rows={5}
                              placeholder="Enter statement of work details..."
                              className="w-full border border-gray-300 rounded p-1.5 outline-none text-[10px] focus:border-[#17414d] disabled:bg-gray-100"
                              disabled={!currentContract}
                            />
                          </div>
                        </FormSection>
                      </div>

                      <div className="space-y-4">
                        <FormSection title="Scope Description">
                          <div className="p-1">
                            <textarea
                              value={currentContract?.scopeText || ''}
                              onChange={(e) => handleFieldChange('scopeText', e.target.value)}
                              rows={2}
                              placeholder="Enter scope description..."
                              className="w-full border border-gray-300 rounded p-1.5 outline-none text-[10px] focus:border-[#17414d] disabled:bg-gray-100"
                              disabled={!currentContract}
                            />
                          </div>
                        </FormSection>

                        <FormSection title="Special Instructions">
                          <div className="p-1">
                            <textarea
                              value={currentContract?.specialInstructions || ''}
                              onChange={(e) => handleFieldChange('specialInstructions', e.target.value)}
                              rows={2}
                              placeholder="Enter special instructions..."
                              className="w-full border border-gray-300 rounded p-1.5 outline-none text-[10px] focus:border-[#17414d] disabled:bg-gray-100"
                              disabled={!currentContract}
                            />
                          </div>
                        </FormSection>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </SecondaryContainer>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default ManageGovernmentContractInformation;
