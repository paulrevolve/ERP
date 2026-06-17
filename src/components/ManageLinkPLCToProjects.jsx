// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

// const plcSourceColumns = [
//   { id: "plc", key: "plc", label: "PLC" },
//   { id: "description", key: "description", label: "Description" },
//   { 
//     id: "select", 
//     label: "", 
//     render: (item) => (
//       <button className="bg-blue-800 text-white px-2 py-0.5 rounded text-[10px] cursor-pointer hover:bg-blue-700">
//         Select
//       </button>
//     ) 
//   }
// ];

// const assignedPlcColumns = [
//   { id: "plc", key: "plc", label: "PLC *" },
//   { id: "description", key: "description", label: "Description *" },
//   { id: "cobraMappingValue", key: "cobraMappingValue", label: "Cobra Mapping Value" },
// ];

// const ManageLinkPLCToProjects = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [project, setProject] = useState("");
//   const [sourcePlcs, setSourcePlcs] = useState([
//     { id: "1", plc: "ENG", description: "Engineer" },
//     { id: "2", plc: "MGR", description: "Manager" }
//   ]);
//   const [assignedPlcs, setAssignedPlcs] = useState([
//     { id: "1", plc: "ENG", description: "Engineer", cobraMappingValue: "ENG_01" }
//   ]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const activeRecord = assignedPlcs[currentIndex] || {};

//   const handleFieldChange = (id, field, value) => {
//     setAssignedPlcs(assignedPlcs.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   const handleNavigate = (dir) => {
//     if (dir === 'next' && currentIndex < assignedPlcs.length - 1) setCurrentIndex(currentIndex + 1);
//     if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
//     if (dir === 'start') setCurrentIndex(0);
//     if (dir === 'end') setCurrentIndex(assignedPlcs.length - 1);
//   };

//   const handleAdd = () => {
//     const newRecord = { id: `NEW_${Date.now()}`, plc: "", description: "", cobraMappingValue: "", isDirty: true };
//     setAssignedPlcs([newRecord, ...assignedPlcs]);
//     setCurrentIndex(0);
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={null} title="Link Project Labor Categories to Projects">
//         <Toolbar 
//           isFormView={isFormView} 
//           columns={assignedPlcColumns}
//           currentIndex={currentIndex}
//           totalRecords={assignedPlcs.length}
//           handleNavigate={handleNavigate}
//           actions={{ 
//             onToggleView: () => setIsFormView(!isFormView),
//             onAdd: handleAdd,
//             onSave: () => {},
//             onDelete: () => {},
//             onCopy: () => {},
//             onPaste: () => {},
//             onClear: () => {}
//           }} 
//         />
//         <div className="mt-2 space-y-4">
//           <div className="p-4 bg-white border border-gray-200 rounded-sm">
//              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <FormSearchSelect 
//                   label="Project *" 
//                   value={project} 
//                   options={[]} 
//                   displayKey="project" 
//                   onSelect={(opt) => setProject(opt.project)}
//                 />
//              </div>
//           </div>

//           {!isFormView ? (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               <div className="border border-gray-200 rounded-sm">
//                 <div className="bg-[#17414d] text-white px-3 py-1.5 flex justify-between items-center">
//                   <span className="text-[11px] font-bold uppercase tracking-wider">Project Labor Categories</span>
//                   <button className="text-[10px] bg-white text-[#17414d] px-2 py-0.5 rounded font-bold">Query ▾</button>
//                 </div>
//                 <div className="p-2">
//                   <ReusableTable data={sourcePlcs} columns={plcSourceColumns} showCheckboxesTable={false} showCheckboxesHeaderTop={false} />
//                 </div>
//               </div>

//               <div className="border border-gray-200 rounded-sm">
//                 <div className="bg-[#17414d] text-white px-3 py-1.5 flex justify-between items-center">
//                   <span className="text-[11px] font-bold uppercase tracking-wider">Assign PLCs</span>
//                   <div className="flex gap-2">
//                      <button onClick={handleAdd} className="text-[10px] bg-white text-[#17414d] px-2 py-0.5 rounded font-bold">New</button>
//                      <button className="text-[10px] bg-white text-[#17414d] px-2 py-0.5 rounded font-bold">Copy ▾</button>
//                   </div>
//                 </div>
//                 <div className="p-2">
//                   <ReusableTable data={assignedPlcs} columns={assignedPlcColumns} onFieldChange={handleFieldChange} />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <FormSection title="Assign PLC Details">
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <FormInput label="PLC *" value={activeRecord.plc || ""} onChange={(e) => handleFieldChange(activeRecord.id, "plc", e.target.value)} />
//                   <FormInput label="Description *" value={activeRecord.description || ""} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
//                   <FormInput label="Cobra Mapping Value" value={activeRecord.cobraMappingValue || ""} onChange={(e) => handleFieldChange(activeRecord.id, "cobraMappingValue", e.target.value)} />
//                </div>
//             </FormSection>
//           )}
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageLinkPLCToProjects;

import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

const plcSourceColumns = (onSelect) => [
  { id: "plc", key: "plc", label: "PLC" },
  { id: "description", key: "description", label: "Description" },
  { 
    id: "select", 
    label: "", 
    render: (item) => (
      <button 
        onClick={() => onSelect(item)}
        className="px-3 py-1 text-[10px] font-bold border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-all active:scale-95"
      >
        Select
      </button>
    ) 
  }
];

const assignedPlcColumns = [
  { id: "plc", key: "plc", label: "PLC *" },
  { id: "description", key: "description", label: "Description *" },
  { id: "cobraMappingValue", key: "cobraMappingValue", label: "Cobra Mapping Value" },
];

const ManageLinkPLCToProjects = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [project, setProject] = useState("");
  const [sourcePlcs, setSourcePlcs] = useState([
    { id: "1", plc: "ENG", description: "Engineer" },
    { id: "2", plc: "MGR", description: "Manager" }
  ]);
  const [assignedPlcs, setAssignedPlcs] = useState([
    { id: "1", plc: "ENG", description: "Engineer", cobraMappingValue: "ENG_01" }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeRecord = assignedPlcs[currentIndex] || {};

  const handleFieldChange = (id, field, value) => {
    setAssignedPlcs(assignedPlcs.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const handleNavigate = (dir) => {
    if (dir === 'next' && currentIndex < assignedPlcs.length - 1) setCurrentIndex(currentIndex + 1);
    if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (dir === 'start') setCurrentIndex(0);
    if (dir === 'end') setCurrentIndex(assignedPlcs.length - 1);
  };

  const handleAdd = () => {
    const newRecord = { id: `NEW_${Date.now()}`, plc: "", description: "", cobraMappingValue: "", isDirty: true };
    setAssignedPlcs([newRecord, ...assignedPlcs]);
    setCurrentIndex(0);
  };

  const handleSelectPlc = (item) => {
    const newRecord = { 
      id: `NEW_${Date.now()}`, 
      plc: item.plc, 
      description: item.description, 
      cobraMappingValue: "", 
      isDirty: true 
    };
    setAssignedPlcs([newRecord, ...assignedPlcs]);
    setCurrentIndex(0);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={null} title="Link Project Labor Categories to Projects">
        <Toolbar 
          isFormView={isFormView} 
          columns={assignedPlcColumns}
          currentIndex={currentIndex}
          totalRecords={assignedPlcs.length}
          handleNavigate={handleNavigate}
          actions={{ 
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: handleAdd,
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {}
          }} 
        />
        <div className="mt-2 space-y-4">
          <div className="p-4 bg-white border border-gray-200 rounded-sm shadow-sm">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormSearchSelect 
                  label="Project *" 
                  value={project} 
                  options={[]} 
                  displayKey="project" 
                  onSelect={(opt) => setProject(opt.project)}
                />
             </div>
          </div>

          {!isFormView ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SecondaryContainer title="Project Labor Categories">
                  <ReusableTable 
                    data={sourcePlcs} 
                    columns={plcSourceColumns(handleSelectPlc)} 
                    showCheckboxesTable={false} 
                    showCheckboxesHeaderTop={false} 
                  />
              </SecondaryContainer>

              <SecondaryContainer title="Assign PLCs">
                  <ReusableTable 
                    data={assignedPlcs} 
                    columns={assignedPlcColumns} 
                    onFieldChange={handleFieldChange} 
                  />
              </SecondaryContainer>
            </div>
          ) : (
            <FormSection title="Assign PLC Details">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput label="PLC *" value={activeRecord.plc || ""} onChange={(e) => handleFieldChange(activeRecord.id, "plc", e.target.value)} />
                  <FormInput label="Description *" value={activeRecord.description || ""} onChange={(e) => handleFieldChange(activeRecord.id, "description", e.target.value)} />
                  <FormInput label="Cobra Mapping Value" value={activeRecord.cobraMappingValue || ""} onChange={(e) => handleFieldChange(activeRecord.id, "cobraMappingValue", e.target.value)} />
               </div>
            </FormSection>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageLinkPLCToProjects;
