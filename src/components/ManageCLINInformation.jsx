// import React, { useState } from "react";
// import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
// import { FormSection, FormInput } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { FileText } from "lucide-react";

// const mainColumns = [
//   { id: "project", key: "project", label: "Project *" },
//   { id: "projectName", key: "projectName", label: "Project Name" }
// ];

// const clinColumns = [
//   { id: "clinNumber", key: "clinNumber", label: "Contract Line Item Number *" },
//   { id: "clinDescription", key: "clinDescription", label: "Contract Line Item Description *" },
//   { id: "salesAbbrev", key: "salesAbbrev", label: "Sales Abbrev" },
//   { id: "inventoryAbbrev", key: "inventoryAbbrev", label: "Inventory Abbrev" },
//   { id: "country", key: "country", label: "Country" }
// ];

// const ManageCLINInformation = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [records, setRecords] = useState([
//     {
//       id: "1",
//       project: "PRJ-001",
//       projectName: "Implementation Project",
//       clins: [
//         { id: "c1", clinNumber: "001", clinDescription: "Software Licenses", salesAbbrev: "SW", inventoryAbbrev: "INV-1", country: "USA" }
//       ]
//     }
//   ]);

//   const activeRecord = records[currentIndex] || {};

//   const handleAdd = () => {
//     const newId = `NEW_${Date.now()}`;
//     const newRecord = { 
//       id: newId, 
//       project: "", 
//       projectName: "", 
//       clins: [] 
//     };
//     setRecords([newRecord, ...records]);
//     setCurrentIndex(0);
//   };

//   const handleFieldChange = (field, value) => {
//     setRecords(records.map((r, idx) => idx === currentIndex ? { ...r, [field]: value } : r));
//   };

//   const handleNavigate = (dir) => {
//     if (dir === "next" && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
//     if (dir === "prev" && currentIndex > 0) setCurrentIndex(currentIndex - 1);
//     if (dir === "start") setCurrentIndex(0);
//     if (dir === "end") setCurrentIndex(records.length - 1);
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={FileText} title="CLIN Information">
//         <Toolbar 
//           isFormView={isFormView}
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
//             onClear: () => {},
//             onQuery: () => {}
//           }}
//         />

//         <div className="mt-2">
//           {isFormView ? (
//             <div className="space-y-4">
//               <FormSection title="Identification">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
//                   <div className="flex gap-2">
//                     <FormInput 
//                       label="Project *" 
//                       value={activeRecord.project || ""} 
//                       onChange={(e) => handleFieldChange("project", e.target.value)} 
//                     />
//                     <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
//                       {activeRecord.projectName}
//                     </div>
//                   </div>
//                 </div>
//               </FormSection>

//               <SecondaryContainer title="CLINs">
//                 <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
//                 <ReusableTable 
//                   data={activeRecord.clins || []} 
//                   columns={clinColumns} 
//                   onFieldChange={() => {}} 
//                 />
//               </SecondaryContainer>
//             </div>
//           ) : (
//             <SecondaryContainer title="">
//               <ReusableTable 
//                 data={records} 
//                 columns={mainColumns} 
//                 onFieldChange={() => {}} 
//               />
//             </SecondaryContainer>
//           )}
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageCLINInformation;

import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { FileText } from "lucide-react";

const mainColumns = [
  { id: "project", key: "project", label: "Project *" },
  { id: "projectName", key: "projectName", label: "Project Name" }
];

const clinColumns = [
  { id: "clinNumber", key: "clinNumber", label: "Contract Line Item Number *" },
  { id: "clinDescription", key: "clinDescription", label: "Contract Line Item Description *" },
  { id: "salesAbbrev", key: "salesAbbrev", label: "Sales Abbrev" },
  { id: "inventoryAbbrev", key: "inventoryAbbrev", label: "Inventory Abbrev" },
  { id: "country", key: "country", label: "Country" }
];

const ManageCLINInformation = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      project: "PRJ-001",
      projectName: "Implementation Project",
      clins: [
        { id: "c1", clinNumber: "001", clinDescription: "Software Licenses", salesAbbrev: "SW", inventoryAbbrev: "INV-1", country: "USA" }
      ]
    }
  ]);

  const activeRecord = records[currentIndex] || {};

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = { 
      id: newId, 
      project: "", 
      projectName: "", 
      clins: [] 
    };
    setRecords([newRecord, ...records]);
    setCurrentIndex(0);
  };

  const handleFieldChange = (field, value) => {
    setRecords(records.map((r, idx) => idx === currentIndex ? { ...r, [field]: value } : r));
  };

  const handleNavigate = (dir) => {
    if (dir === "next" && currentIndex < records.length - 1) setCurrentIndex(currentIndex + 1);
    if (dir === "prev" && currentIndex > 0) setCurrentIndex(currentIndex - 1);
    if (dir === "start") setCurrentIndex(0);
    if (dir === "end") setCurrentIndex(records.length - 1);
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={FileText} title="CLIN Information">
        <Toolbar 
          isFormView={isFormView}
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
            onClear: () => {},
            onQuery: () => {}
          }}
        />

        <div className="mt-2 space-y-4">
          {isFormView ? (
            <FormSection title="Identification">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex gap-2">
                  <FormInput 
                    label="Project *" 
                    value={activeRecord.project || ""} 
                    onChange={(e) => handleFieldChange("project", e.target.value)} 
                  />
                  <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
                    {activeRecord.projectName}
                  </div>
                </div>
              </div>
            </FormSection>
          ) : (
            <SecondaryContainer title="">
              <ReusableTable 
                data={records} 
                columns={mainColumns} 
                onFieldChange={() => {}} 
              />
            </SecondaryContainer>
          )}

          <SecondaryContainer title="CLINs">
            <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
            <ReusableTable 
              data={activeRecord.clins || []} 
              columns={clinColumns} 
              onFieldChange={() => {}} 
            />
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageCLINInformation;
