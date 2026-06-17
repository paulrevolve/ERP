// // import React, { useState } from 'react';
// // import { toast } from 'react-toastify';
// // import { Layers, Minus, X, Square } from 'lucide-react';
// // import { MainContainer } from '../helper/container';
// // import { ReusableTable } from '../helper/tableSection';
// // import { FormSearchSelect } from '../helper/formSection';

// // // Mock Project options
// // const projectOptions = [
// //   { value: 'PRJ001', name: 'Acme Web Development' },
// //   { value: 'PRJ002', name: 'Alpha Infrastructure Setup' },
// //   { value: 'PRJ003', name: 'Gamma Cloud Integration' },
// //   { value: 'PRJ004', name: 'Delta Security Audit' }
// // ];

// // const columns = [
// //   {
// //     id: 'project',
// //     key: 'project',
// //     label: 'Project',
// //     type: 'readOnly-text'
// //   },
// //   {
// //     id: 'stringFound',
// //     key: 'stringFound',
// //     label: 'String Found',
// //     type: 'readOnly-text'
// //   },
// //   {
// //     id: 'errorDescription',
// //     key: 'errorDescription',
// //     label: 'Error Description',
// //     type: 'readOnly-text'
// //   }
// // ];

// // const CheckAndRebuildProjectSegmentIds = () => {
// //   const [records, setRecords] = useState([]);
// //   const [selectedIds, setSelectedIds] = useState(new Set());
  
// //   // Rebuild parameters state
// //   const [projectRange, setProjectRange] = useState('All');
// //   const [selectedProject, setSelectedProject] = useState('');
// //   const [projectSearch, setProjectSearch] = useState('');
  
// //   const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

// //   // 1. Run Check Routine
// //   const handleCheck = () => {
// //     toast.info("Running check routine...");
    
// //     // Simulate finding issues after a short check
// //     setTimeout(() => {
// //       const mockCheckResults = [
// //         { id: '1', project: 'PRJ001', stringFound: 'PRJ-01', errorDescription: 'Invalid segment ID substring at Level 2' },
// //         { id: '2', project: 'PRJ002', stringFound: 'PRJ-02', errorDescription: 'Length mismatch between level and segment ID' }
// //       ];
// //       setRecords(mockCheckResults);
// //       setSelectedIds(new Set());
// //       toast.success("Routine check completed. Found 2 mapping issues.");
// //     }, 400);
// //   };

// //   // 2. Run Rebuild Routine
// //   const handleRebuild = () => {
// //     if (projectRange === 'One' && !selectedProject) {
// //       return toast.error("Please select a Project first!");
// //     }
    
// //     toast.info("Running rebuild routine...");
    
// //     setTimeout(() => {
// //       if (projectRange === 'One') {
// //         // Resolve issues matching selected project
// //         setRecords(prev => prev.filter(r => r.project !== selectedProject));
// //         toast.success(`Rebuild completed for Project ${selectedProject}.`);
// //       } else {
// //         // Resolve all issues
// //         setRecords([]);
// //         toast.success("Routine rebuild completed for all remaining projects successfully!");
// //       }
// //       setSelectedIds(new Set());
// //     }, 500);
// //   };

// //   return (
// //     <div className="p-4 space-y-4 font-inter bg-[#f4f5f8] min-h-screen">
// //       <MainContainer icon={Layers} title="Check and/or Rebuild Project Segment IDs">
// //         <div className="space-y-6 mt-2">
          
// //           {/* SECTION 1: Check the Project ID and Line Project Segment IDs */}
// //           <div className="border border-gray-300 rounded shadow-sm overflow-hidden bg-white">
// //             <div className="bg-[#17414d] text-white px-3 py-2 flex items-center justify-between">
// //               <span className="text-xs font-semibold">Check the Project ID and Line Project Segment IDs</span>
// //               <div className="flex items-center gap-1.5 opacity-80">
// //                 <Minus size={12} className="cursor-pointer hover:opacity-100" />
// //                 <Square size={10} className="cursor-pointer hover:opacity-100" />
// //                 <X size={12} className="cursor-pointer hover:opacity-100" />
// //               </div>
// //             </div>
// //             <div className="p-4 space-y-4">
// //               <p className="text-[10px] text-gray-700 leading-relaxed font-light">
// //                 Routine to check the Project levels against the actual Project ID lengths, and verify that each line Project segment ID is the correct substring of the Project ID.
// //               </p>
// //               <div className="flex justify-center">
// //                 <button
// //                   onClick={handleCheck}
// //                   className="bg-[#17414d] hover:bg-[#12333d] text-white px-6 py-1 rounded text-[10px] font-semibold shadow transition-all duration-200 cursor-pointer active:scale-95"
// //                 >
// //                   Check
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           {/* SECTION 2: Check and/or Rebuild Project Segment IDs Table */}
// //           <div className="border border-gray-300 rounded shadow-sm overflow-hidden bg-white">
// //             <div className="bg-[#17414d] text-white px-3 py-2 flex items-center justify-between">
// //               <span className="text-xs font-semibold">Check and/or Rebuild Project Segment IDs</span>
// //               <div className="flex items-center gap-3">
// //                 <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-2 py-0.5 rounded text-[9px] flex items-center gap-1 cursor-pointer font-medium transition-colors">
// //                   Query <span className="text-[7px]">▼</span>
// //                 </button>
// //                 <div className="flex items-center gap-1.5 opacity-80">
// //                   <Minus size={12} className="cursor-pointer hover:opacity-100" />
// //                   <X size={12} className="cursor-pointer hover:opacity-100" />
// //                 </div>
// //               </div>
// //             </div>
// //             <div className="p-2">
// //               <ReusableTable
// //                 data={records}
// //                 columns={columns}
// //                 selectedRows={selectedIds}
// //                 onSelectAll={(e) => {
// //                   if (e.target.checked) {
// //                     setSelectedIds(new Set(records.map(getRowKey)));
// //                   } else {
// //                     setSelectedIds(new Set());
// //                   }
// //                 }}
// //                 onRowSelect={(item) => {
// //                   const key = getRowKey(item);
// //                   const newIds = new Set(selectedIds);
// //                   if (newIds.has(key)) {
// //                     newIds.delete(key);
// //                   } else {
// //                     newIds.add(key);
// //                   }
// //                   setSelectedIds(newIds);
// //                 }}
// //                 onFieldChange={() => {}}
// //               />
// //             </div>
// //           </div>

// //           {/* SECTION 3: Rebuild the Line Project Segment IDs */}
// //           <div className="border border-gray-300 rounded shadow-sm overflow-hidden bg-white">
// //             <div className="bg-[#17414d] text-white px-3 py-2 flex items-center justify-between">
// //               <span className="text-xs font-semibold">Rebuild the Line Project Segment IDs</span>
// //               <div className="flex items-center gap-1.5 opacity-80">
// //                 <Minus size={12} className="cursor-pointer hover:opacity-100" />
// //                 <X size={12} className="cursor-pointer hover:opacity-100" />
// //               </div>
// //             </div>
// //             <div className="p-4 space-y-4">
// //               <p className="text-[10px] text-gray-700 leading-relaxed font-light">
// //                 Routine to rebuild the line Project segment IDs in the Project table from level 2 through each Project's remaining levels.<br />
// //                 <span className="font-medium text-[#17414d]">(Recommend that the check be run first to verify that a rebuild is required.)</span>
// //               </p>
              
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-t border-gray-100 pt-3">
// //                 <div className="space-y-1">
// //                   <label className="block text-[10px] font-medium text-black">
// //                     Project Range <span className="text-rose-500">*</span>
// //                   </label>
// //                   <select
// //                     value={projectRange}
// //                     onChange={(e) => {
// //                       setProjectRange(e.target.value);
// //                       if (e.target.value === 'All') setSelectedProject('');
// //                     }}
// //                     className="w-full border border-gray-300 rounded p-1 text-[10px] outline-none focus:border-[#17414d] bg-white cursor-pointer"
// //                   >
// //                     <option value="All">All</option>
// //                     <option value="Range">Range</option>
// //                     <option value="One">One</option>
// //                   </select>
// //                 </div>
                
// //                 <div className="space-y-1">
// //                   <FormSearchSelect
// //                     label="Project"
// //                     value={selectedProject}
// //                     searchTerm={projectSearch}
// //                     setSearchTerm={setProjectSearch}
// //                     options={projectOptions}
// //                     onSelect={(opt) => {
// //                       setSelectedProject(opt.value);
// //                     }}
// //                     displayKey="value"
// //                     secondaryKey="name"
// //                     disabled={projectRange === 'All'}
// //                     placeholder="Search projects..."
// //                   />
// //                 </div>
                
// //                 <div className="flex justify-center md:justify-end">
// //                   <button
// //                     onClick={handleRebuild}
// //                     className="bg-[#17414d] hover:bg-[#12333d] text-white px-6 py-1 rounded text-[10px] font-semibold shadow transition-all duration-200 cursor-pointer active:scale-95"
// //                   >
// //                     Rebuild
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //         </div>
// //       </MainContainer>
// //     </div>
// //   );
// // };

// // export default CheckAndRebuildProjectSegmentIds;

// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import { Layers, Check, RefreshCw } from 'lucide-react';
// import { MainContainer, SecondaryContainer } from '../helper/container';
// import { ReusableTable } from '../helper/tableSection';
// import { FormSearchSelect, ActionDetailButton } from '../helper/formSection';

// // Mock Project options
// const projectOptions = [
//   { value: 'PRJ001', name: 'Acme Web Development' },
//   { value: 'PRJ002', name: 'Alpha Infrastructure Setup' },
//   { value: 'PRJ003', name: 'Gamma Cloud Integration' },
//   { value: 'PRJ004', name: 'Delta Security Audit' }
// ];

// const columns = [
//   {
//     id: 'project',
//     key: 'project',
//     label: 'Project',
//     type: 'readOnly-text'
//   },
//   {
//     id: 'stringFound',
//     key: 'stringFound',
//     label: 'String Found',
//     type: 'readOnly-text'
//   },
//   {
//     id: 'errorDescription',
//     key: 'errorDescription',
//     label: 'Error Description',
//     type: 'readOnly-text'
//   }
// ];

// const CheckAndRebuildProjectSegmentIds = () => {
//   const [records, setRecords] = useState([]);
//   const [selectedIds, setSelectedIds] = useState(new Set());
  
//   // Rebuild parameters state
//   const [projectRange, setProjectRange] = useState('All');
//   const [selectedProject, setSelectedProject] = useState('');
//   const [projectSearch, setProjectSearch] = useState('');
  
//   const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

//   // 1. Run Check Routine
//   const handleCheck = () => {
//     toast.info("Running check routine...");
    
//     // Simulate finding issues after a short check
//     setTimeout(() => {
//       const mockCheckResults = [
//         { id: '1', project: 'PRJ001', stringFound: 'PRJ-01', errorDescription: 'Invalid segment ID substring at Level 2' },
//         { id: '2', project: 'PRJ002', stringFound: 'PRJ-02', errorDescription: 'Length mismatch between level and segment ID' }
//       ];
//       setRecords(mockCheckResults);
//       setSelectedIds(new Set());
//       toast.success("Routine check completed. Found 2 mapping issues.");
//     }, 400);
//   };

//   // 2. Run Rebuild Routine
//   const handleRebuild = () => {
//     if (projectRange === 'One' && !selectedProject) {
//       return toast.error("Please select a Project first!");
//     }
    
//     toast.info("Running rebuild routine...");
    
//     setTimeout(() => {
//       if (projectRange === 'One') {
//         // Resolve issues matching selected project
//         setRecords(prev => prev.filter(r => r.project !== selectedProject));
//         toast.success(`Rebuild completed for Project ${selectedProject}.`);
//       } else {
//         // Resolve all issues
//         setRecords([]);
//         toast.success("Routine rebuild completed for all remaining projects successfully!");
//       }
//       setSelectedIds(new Set());
//     }, 500);
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={Layers} title="Check and/or Rebuild Project Segment IDs">
//         <div className="space-y-6 mt-2">
          
//           {/* SECTION 1: Check the Project ID and Line Project Segment IDs */}
//           <SecondaryContainer title="Check the Project ID and Line Project Segment IDs">
//             <div className="p-2 space-y-4">
//               <p className="text-[10px] text-gray-700 leading-relaxed font-light">
//                 Routine to check the Project levels against the actual Project ID lengths, and verify that each line Project segment ID is the correct substring of the Project ID.
//               </p>
//               <div className="flex justify-center mt-2">
//                 <ActionDetailButton
//                   label="Check"
//                   onClick={handleCheck}
//                   icon={Check}
//                 />
//               </div>
//             </div>
//           </SecondaryContainer>

//           {/* SECTION 2: Check and/or Rebuild Project Segment IDs Table */}
//           <SecondaryContainer title="Check and/or Rebuild Project Segment IDs">
//             <div className="p-2">
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
//                 }}
//                 onFieldChange={() => {}}
//               />
//             </div>
//           </SecondaryContainer>

//           {/* SECTION 3: Rebuild the Line Project Segment IDs */}
//           <SecondaryContainer title="Rebuild the Line Project Segment IDs">
//             <div className="p-2 space-y-4">
//               <p className="text-[10px] text-gray-700 leading-relaxed font-light">
//                 Routine to rebuild the line Project segment IDs in the Project table from level 2 through each Project's remaining levels.<br />
//                 <span className="font-medium text-[#17414d]">(Recommend that the check be run first to verify that a rebuild is required.)</span>
//               </p>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-t border-gray-100 pt-3">
//                 <div className="space-y-1">
//                   <label className="block text-[10px] font-medium text-black">
//                     Project Range <span className="text-rose-500">*</span>
//                   </label>
//                   <select
//                     value={projectRange}
//                     onChange={(e) => {
//                       setProjectRange(e.target.value);
//                       if (e.target.value === 'All') setSelectedProject('');
//                     }}
//                     className="w-full border border-gray-300 rounded p-0.5 text-[10px] outline-none focus:border-[#17414d] bg-white cursor-pointer transition-all duration-200"
//                   >
//                     <option value="All">All</option>
//                     <option value="Range">Range</option>
//                     <option value="One">One</option>
//                   </select>
//                 </div>
                
//                 <div className="space-y-1">
//                   <FormSearchSelect
//                     label="Project"
//                     value={selectedProject}
//                     searchTerm={projectSearch}
//                     setSearchTerm={setProjectSearch}
//                     options={projectOptions}
//                     onSelect={(opt) => {
//                       setSelectedProject(opt.value);
//                     }}
//                     displayKey="value"
//                     secondaryKey="name"
//                     disabled={projectRange === 'All'}
//                     placeholder="Search projects..."
//                   />
//                 </div>
                
//                 <div className="flex justify-center md:justify-end">
//                   <ActionDetailButton
//                     label="Rebuild"
//                     onClick={handleRebuild}
//                     icon={RefreshCw}
//                   />
//                 </div>
//               </div>
//             </div>
//           </SecondaryContainer>

//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default CheckAndRebuildProjectSegmentIds;

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Layers, Check, RefreshCw } from 'lucide-react';
import { MainContainer, SecondaryContainer } from '../helper/container';
import { ReusableTable } from '../helper/tableSection';
import { FormSearchSelect, ActionDetailButton } from '../helper/formSection';

// Mock Project options
const projectOptions = [
  { value: 'PRJ001', name: 'Acme Web Development' },
  { value: 'PRJ002', name: 'Alpha Infrastructure Setup' },
  { value: 'PRJ003', name: 'Gamma Cloud Integration' },
  { value: 'PRJ004', name: 'Delta Security Audit' }
];

const columns = [
  {
    id: 'project',
    key: 'project',
    label: 'Project',
    type: 'readOnly-text'
  },
  {
    id: 'stringFound',
    key: 'stringFound',
    label: 'String Found',
    type: 'readOnly-text'
  },
  {
    id: 'errorDescription',
    key: 'errorDescription',
    label: 'Error Description',
    type: 'readOnly-text'
  }
];

const CheckAndRebuildProjectSegmentIds = () => {
  const [records, setRecords] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  // Rebuild parameters state
  const [projectRange, setProjectRange] = useState('All');
  const [selectedProject, setSelectedProject] = useState('');
  const [projectSearch, setProjectSearch] = useState('');
  
  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";

  // 1. Run Check Routine
  const handleCheck = () => {
    toast.info("Running check routine...");
    
    // Simulate finding issues after a short check
    setTimeout(() => {
      const mockCheckResults = [
        { id: '1', project: 'PRJ001', stringFound: 'PRJ-01', errorDescription: 'Invalid segment ID substring at Level 2' },
        { id: '2', project: 'PRJ002', stringFound: 'PRJ-02', errorDescription: 'Length mismatch between level and segment ID' }
      ];
      setRecords(mockCheckResults);
      setSelectedIds(new Set());
      toast.success("Routine check completed. Found 2 mapping issues.");
    }, 400);
  };

  // 2. Run Rebuild Routine
  const handleRebuild = () => {
    if (projectRange === 'One' && !selectedProject) {
      return toast.error("Please select a Project first!");
    }
    
    toast.info("Running rebuild routine...");
    
    setTimeout(() => {
      if (projectRange === 'One') {
        // Resolve issues matching selected project
        setRecords(prev => prev.filter(r => r.project !== selectedProject));
        toast.success(`Rebuild completed for Project ${selectedProject}.`);
      } else {
        // Resolve all issues
        setRecords([]);
        toast.success("Routine rebuild completed for all remaining projects successfully!");
      }
      setSelectedIds(new Set());
    }, 500);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Layers} title="Check and/or Rebuild Project Segment IDs">
        <div className="space-y-6 mt-2">
          
          {/* SECTION 1: Check the Project ID and Line Project Segment IDs */}
          <SecondaryContainer title="Check the Project ID and Line Project Segment IDs">
            <div className="p-2 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed font-normal font-inter">
                Routine to check the Project levels against the actual Project ID lengths, and verify that each line Project segment ID is the correct substring of the Project ID.
              </p>
              <div className="flex justify-center mt-2">
                <ActionDetailButton
                  label="Check"
                  onClick={handleCheck}
                  icon={Check}
                />
              </div>
            </div>
          </SecondaryContainer>

          {/* SECTION 2: Check and/or Rebuild Project Segment IDs Table */}
          <SecondaryContainer title="Check and/or Rebuild Project Segment IDs">
            <div className="p-2">
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
                }}
                onFieldChange={() => {}}
              />
            </div>
          </SecondaryContainer>

          {/* SECTION 3: Rebuild the Line Project Segment IDs */}
          <SecondaryContainer title="Rebuild the Line Project Segment IDs">
            <div className="p-2 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed font-normal font-inter">
                Routine to rebuild the line Project segment IDs in the Project table from level 2 through each Project's remaining levels.<br />
                <span className="font-medium text-[#17414d]">(Recommend that the check be run first to verify that a rebuild is required.)</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end border-t border-gray-100 pt-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-medium text-black">
                    Project Range <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={projectRange}
                    onChange={(e) => {
                      setProjectRange(e.target.value);
                      if (e.target.value === 'All') setSelectedProject('');
                    }}
                    className="w-full border border-gray-300 rounded p-0.5 text-[10px] outline-none focus:border-[#17414d] bg-white cursor-pointer transition-all duration-200"
                  >
                    <option value="All">All</option>
                    <option value="Range">Range</option>
                    <option value="One">One</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <FormSearchSelect
                    label="Project"
                    value={selectedProject}
                    searchTerm={projectSearch}
                    setSearchTerm={setProjectSearch}
                    options={projectOptions}
                    onSelect={(opt) => {
                      setSelectedProject(opt.value);
                    }}
                    displayKey="value"
                    secondaryKey="name"
                    disabled={projectRange === 'All'}
                    placeholder="Search projects..."
                  />
                </div>
                
                <div className="flex justify-center md:justify-end">
                  <ActionDetailButton
                    label="Rebuild"
                    onClick={handleRebuild}
                    icon={RefreshCw}
                  />
                </div>
              </div>
            </div>
          </SecondaryContainer>

        </div>
      </MainContainer>
    </div>
  );
};

export default CheckAndRebuildProjectSegmentIds;
