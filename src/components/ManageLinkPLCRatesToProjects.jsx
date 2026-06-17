// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

// const columns = [
//   { id: "plc", key: "plc", label: "PLC *" },
//   { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
//   { id: "rateType", key: "rateType", label: "Rate Type *" },
//   { id: "rate", key: "rate", label: "Rate *" },
//   { id: "startingDate", key: "startingDate", label: "Starting Date", type: "date" },
//   { id: "endingDate", key: "endingDate", label: "Ending Date", type: "date" },
// ];

// const ManageLinkPLCRatesToProjects = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [project, setProject] = useState("");
//   const [records, setRecords] = useState([
//     { id: "1", plc: "ENG", plcDescription: "Engineer", rateType: "Standard", rate: "150", startingDate: "2023-01-01", endingDate: "2023-12-31" }
//   ]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const activeRecord = records[currentIndex] || {};

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   const handleNavigate = (dir) => {
//     if (dir === 'next' && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
//     if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
//     if (dir === 'start') setCurrentIndex(0);
//     if (dir === 'end') setCurrentIndex(records.length - 1);
//   };

//   const handleAdd = () => {
//     const newRecord = { id: `NEW_${Date.now()}`, isDirty: true };
//     setRecords([newRecord, ...records]);
//     setCurrentIndex(0);
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={null} title="Link Project Labor Category Rates to Projects">
//         <Toolbar 
//           isFormView={isFormView} 
//           columns={columns}
//           currentIndex={currentIndex}
//           totalRecords={records.length}
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
//             <div className="border border-gray-200 rounded-sm">
//               <div className="bg-[#17414d] text-white px-3 py-1.5 flex justify-between items-center">
//                 <span className="text-[11px] font-bold uppercase tracking-wider">Project PLC Rates</span>
//                 <div className="flex gap-2">
//                    <button onClick={handleAdd} className="text-[10px] bg-white text-[#17414d] px-2 py-0.5 rounded font-bold">New</button>
//                    <button className="text-[10px] bg-white text-[#17414d] px-2 py-0.5 rounded font-bold">Copy ▾</button>
//                 </div>
//               </div>
//               <div className="p-2">
//                 <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
//               </div>
//             </div>
//           ) : (
//             <FormSection title="PLC Rate Details">
//                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   {columns.map(col => (
//                     <FormInput 
//                       key={col.id}
//                       label={col.label} 
//                       value={activeRecord[col.key] || ""} 
//                       onChange={(e) => handleFieldChange(activeRecord.id, col.key, e.target.value)}
//                       type={col.type || "text"}
//                     />
//                   ))}
//                </div>
//             </FormSection>
//           )}
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageLinkPLCRatesToProjects;

import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

const columns = [
  { id: "plc", key: "plc", label: "PLC *" },
  { id: "plcDescription", key: "plcDescription", label: "PLC Description" },
  { id: "rateType", key: "rateType", label: "Rate Type *" },
  { id: "rate", key: "rate", label: "Rate *" },
  { id: "startingDate", key: "startingDate", label: "Starting Date", type: "date" },
  { id: "endingDate", key: "endingDate", label: "Ending Date", type: "date" },
];

const ManageLinkPLCRatesToProjects = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [project, setProject] = useState("");
  const [records, setRecords] = useState([
    { id: "1", plc: "ENG", plcDescription: "Engineer", rateType: "Standard", rate: "150", startingDate: "2023-01-01", endingDate: "2023-12-31" }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeRecord = records[currentIndex] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const handleNavigate = (dir) => {
    if (dir === 'next' && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
    if (dir === 'prev' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (dir === 'start') setCurrentIndex(0);
    if (dir === 'end') setCurrentIndex(records.length - 1);
  };

  const handleAdd = () => {
    const newRecord = { id: `NEW_${Date.now()}`, isDirty: true };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={null} title="Link Project Labor Category Rates to Projects">
        <Toolbar 
          isFormView={isFormView} 
          columns={columns}
          currentIndex={currentIndex}
          totalRecords={records.length}
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
            <SecondaryContainer title="Project PLC Rates">
                <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
            </SecondaryContainer>
          ) : (
            <FormSection title="PLC Rate Details">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {columns.map(col => (
                    <FormInput 
                      key={col.id}
                      label={col.label} 
                      value={activeRecord[col.key] || ""} 
                      onChange={(e) => handleFieldChange(activeRecord.id, col.key, e.target.value)}
                      type={col.type || "text"}
                    />
                  ))}
               </div>
            </FormSection>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageLinkPLCRatesToProjects;
