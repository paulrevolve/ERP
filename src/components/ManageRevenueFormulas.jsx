// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { FormInput } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { Calculator } from "lucide-react";

// const columns = [
//   { id: "revenueFormula", key: "revenueFormula", label: "Revenue Formula" }
// ];

// const ManageRevenueFormulas = () => {
//   const [isFormView, setIsFormView] = useState(true);
//   const [records, setRecords] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleAdd = () => {
//     setRecords([{ id: `NEW_${Date.now()}`, revenueFormula: "", isDirty: true }, ...records]);
//     setCurrentIndex(0);
//   };

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   const activeRecord = records[currentIndex] || {};

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={Calculator} title="Manage Revenue Formulas">
//         <Toolbar 
//           isFormView={isFormView}
//           columns={columns}
//           totalRecords={records.length}
//           currentIndex={currentIndex}
//           handleNavigate={(dir) => {
//             if (dir === 'next') setCurrentIndex(i => Math.min(i + 1, records.length - 1));
//             if (dir === 'prev') setCurrentIndex(i => Math.max(i - 1, 0));
//           }}
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
//              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormInput 
//                   label="Revenue Formula" 
//                   value={activeRecord.revenueFormula || ""} 
//                   onChange={(e) => activeRecord.id && handleFieldChange(activeRecord.id, "revenueFormula", e.target.value)} 
//                 />
//              </div>
//           ) : (
//             <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
//           )}
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageRevenueFormulas;

import React, { useState } from "react";
import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
import { FormInput, FormSearchSelect } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Calculator } from "lucide-react";

const mainColumns = [
  { id: "revenueFormulaCode", key: "revenueFormulaCode", label: "Revenue Formula Code" },
  { id: "revenueFormulaDescription", key: "revenueFormulaDescription", label: "Revenue Formula Description" }
];

const secondaryColumns = [
  { id: "project", key: "project", label: "Project" }
];

const ManageRevenueFormulas = () => {
  const [isMainFormView, setIsMainFormView] = useState(false);
  const [isSecondaryFormView, setIsSecondaryFormView] = useState(false);
  
  const [records, setRecords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [projectRecords, setProjectRecords] = useState([]);

  const handleAddMain = () => {
    setRecords([{ id: `NEW_${Date.now()}`, revenueFormulaCode: "", revenueFormulaDescription: "", isDirty: true }, ...records]);
    setCurrentIndex(0);
  };

  const handleFieldChangeMain = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const handleAddSecondary = () => {
    setProjectRecords([{ id: `NEW_PROJ_${Date.now()}`, project: "", isDirty: true }, ...projectRecords]);
  };

  const handleFieldChangeSecondary = (id, field, value) => {
    setProjectRecords(projectRecords.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  const activeRecord = records[currentIndex] || {};

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Calculator} title="Manage Revenue Formulas">
        <Toolbar 
          isFormView={isMainFormView}
          columns={mainColumns}
          totalRecords={records.length}
          currentIndex={currentIndex}
          handleNavigate={(dir) => {
            if (dir === 'next') setCurrentIndex(i => Math.min(i + 1, records.length - 1));
            if (dir === 'prev') setCurrentIndex(i => Math.max(i - 1, 0));
          }}
          actions={{
            onToggleView: () => setIsMainFormView(!isMainFormView),
            onAdd: handleAddMain,
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {},
            onPaste: () => {},
            onClear: () => {}
          }}
        />
        <div className="mt-2">
          {isMainFormView ? (
             <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                <FormInput 
                  label="Revenue Formula Code" 
                  value={activeRecord.revenueFormulaCode || ""} 
                  onChange={(e) => activeRecord.id && handleFieldChangeMain(activeRecord.id, "revenueFormulaCode", e.target.value)} 
                />
                <FormInput 
                  label="Revenue Formula Description" 
                  value={activeRecord.revenueFormulaDescription || ""} 
                  onChange={(e) => activeRecord.id && handleFieldChangeMain(activeRecord.id, "revenueFormulaDescription", e.target.value)} 
                />
             </div>
          ) : (
            <ReusableTable data={records} columns={mainColumns} onFieldChange={handleFieldChangeMain} />
          )}
        </div>
      </MainContainer>

      <SecondaryContainer title="Project Revenue Setup">
        <Toolbar 
          isFormView={isSecondaryFormView}
          columns={secondaryColumns}
          actions={{
            onToggleView: () => setIsSecondaryFormView(!isSecondaryFormView),
            onAdd: handleAddSecondary,
            onSave: () => {},
            onDelete: () => {}
          }}
        />
        <div className="mt-2">
          {isSecondaryFormView ? (
             <div className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm w-full md:w-1/2">
                <FormSearchSelect 
                  label="Project" 
                  value={projectRecords[0]?.project || ""} 
                  options={[]}
                  displayKey="project"
                  onChange={(val) => projectRecords[0] && handleFieldChangeSecondary(projectRecords[0].id, "project", val)}
                />
             </div>
          ) : (
            <ReusableTable data={projectRecords} columns={secondaryColumns} onFieldChange={handleFieldChangeSecondary} />
          )}
        </div>
      </SecondaryContainer>
    </div>
  );
};

export default ManageRevenueFormulas;
