// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

// const columns = [
//   { id: "employee", key: "employee", label: "Employee *" },
//   { id: "employeeName", key: "employeeName", label: "Employee Name" },
//   { id: "laborCategory", key: "laborCategory", label: "Labor Category *" },
//   { id: "hoursCeiling", key: "hoursCeiling", label: "Hours Ceiling" }
// ];

// const ManageEmployeeHoursCeilings = () => {
//   const [isFormView, setIsFormView] = useState(true);
//   const [records, setRecords] = useState([{
//     id: "NEW_1", 
//     project: "", 
//     employee: "",
//     employeeName: "",
//     laborCategory: "",
//     hoursCeiling: ""
//   }]);
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
//     const newRecord = {
//       id: `NEW_${Date.now()}`,
//       project: activeRecord.project || "",
//       employee: "",
//       employeeName: "",
//       laborCategory: "",
//       hoursCeiling: "",
//       isDirty: true
//     };
//     setRecords([newRecord, ...records]);
//     setCurrentIndex(0);
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={null} title="Employee Hours Ceilings">
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
//         <div className="mt-2">
//           {isFormView ? (
//             <div className="space-y-4">
//               <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <FormSearchSelect 
//                       label="Project *" 
//                       value={activeRecord.project} 
//                       options={[]} 
//                       displayKey="project" 
//                     />
//                  </div>
//               </div>

//               <FormSection title="Employee Hours Ceilings">
//                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="space-y-2">
//                        <FormSearchSelect 
//                           label="Employee *" 
//                           value={activeRecord.employee} 
//                           options={[]} 
//                           displayKey="employee" 
//                        />
//                        <FormInput label="Employee Name" value={activeRecord.employeeName || ""} onChange={(e) => handleFieldChange(activeRecord.id, "employeeName", e.target.value)} />
//                     </div>
//                     <div className="space-y-2">
//                        <FormSearchSelect 
//                           label="Labor Category *" 
//                           value={activeRecord.laborCategory} 
//                           options={[]} 
//                           displayKey="laborCategory" 
//                        />
//                        <FormInput label="Hours Ceiling" value={activeRecord.hoursCeiling || ""} onChange={(e) => handleFieldChange(activeRecord.id, "hoursCeiling", e.target.value)} />
//                     </div>
//                  </div>
//               </FormSection>
//             </div>
//           ) : (
//             <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
//           )}
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageEmployeeHoursCeilings;

import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";

const columns = [
  { id: "project", key: "project", label: "Project *" },
  { id: "employee", key: "employee", label: "Employee *" },
  { id: "employeeName", key: "employeeName", label: "Employee Name" },
  { id: "laborCategory", key: "laborCategory", label: "Labor Category *" },
  { id: "hoursCeiling", key: "hoursCeiling", label: "Hours Ceiling" }
];

const ManageEmployeeHoursCeilings = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    project: "", 
    employee: "",
    employeeName: "",
    laborCategory: "",
    hoursCeiling: ""
  }]);
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
    const newRecord = {
      id: `NEW_${Date.now()}`,
      project: activeRecord.project || "",
      employee: "",
      employeeName: "",
      laborCategory: "",
      hoursCeiling: "",
      isDirty: true
    };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={null} title="Employee Hours Ceilings">
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
        <div className="mt-2">
          {isFormView ? (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormSearchSelect 
                      label="Project *" 
                      value={activeRecord.project} 
                      options={[]} 
                      displayKey="project" 
                    />
                 </div>
              </div>

              <FormSection title="Employee Hours Ceilings">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <FormSearchSelect 
                          label="Employee *" 
                          value={activeRecord.employee} 
                          options={[]} 
                          displayKey="employee" 
                       />
                       <FormInput label="Employee Name" value={activeRecord.employeeName || ""} onChange={(e) => handleFieldChange(activeRecord.id, "employeeName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <FormSearchSelect 
                          label="Labor Category *" 
                          value={activeRecord.laborCategory} 
                          options={[]} 
                          displayKey="laborCategory" 
                       />
                       <FormInput label="Hours Ceiling" value={activeRecord.hoursCeiling || ""} onChange={(e) => handleFieldChange(activeRecord.id, "hoursCeiling", e.target.value)} />
                    </div>
                 </div>
              </FormSection>
            </div>
          ) : (
            <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageEmployeeHoursCeilings;
