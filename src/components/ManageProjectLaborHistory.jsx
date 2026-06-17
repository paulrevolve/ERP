// import React, { useState } from "react";
// import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
// import { FormSection, FormInput } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { Briefcase } from "lucide-react";

// const mainColumns = [
//   { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
//   { id: "period", key: "period", label: "Period *" },
//   { id: "subperiod", key: "subperiod", label: "Subperiod *" },
//   { id: "project", key: "project", label: "Project *" },
//   { id: "organization", key: "organization", label: "Organization *" },
//   { id: "account", key: "account", label: "Account *" }
// ];

// const laborColumns = [
//   { id: "plc", key: "plc", label: "PLC" },
//   { id: "glc", key: "glc", label: "GLC *" },
//   { id: "employee", key: "employee", label: "Employee" },
//   { id: "employeeName", key: "employeeName", label: "Employee Name" },
//   { id: "vendor", key: "vendor", label: "Vendor" },
//   { id: "vendorName", key: "vendorName", label: "Vendor Name" },
//   { id: "vendorEmployee", key: "vendorEmployee", label: "Vendor Employee" },
//   { id: "vendorEmployeeName", key: "vendorEmployeeName", label: "Vendor Employee Name" },
//   { id: "amount", key: "amount", label: "Amount *", type: "number" },
//   { id: "hours", key: "hours", label: "Hours *", type: "number" }
// ];

// const ManageProjectLaborHistory = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [records, setRecords] = useState([
//     {
//       id: "1",
//       fiscalYear: "2024",
//       period: "1",
//       subperiod: "1",
//       project: "PRJ-LAB",
//       projectName: "Labor Tracking Project",
//       organization: "ORG-01",
//       orgName: "Engineering",
//       account: "600-10",
//       accountName: "Direct Labor",
//       laborDetails: [
//         { id: "l1", plc: "ENG-1", glc: "601", employee: "E101", employeeName: "John Doe", vendor: "", vendorName: "", vendorEmployee: "", vendorEmployeeName: "", amount: 1500, hours: 40 }
//       ]
//     }
//   ]);

//   const activeRecord = records[currentIndex] || {};

//   const handleAdd = () => {
//     const newId = `NEW_${Date.now()}`;
//     const newRecord = { 
//       id: newId, 
//       fiscalYear: "", period: "", subperiod: "1", 
//       project: "", projectName: "", 
//       organization: "", orgName: "", 
//       account: "", accountName: "",
//       laborDetails: [] 
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
//       <MainContainer icon={Briefcase} title="Project Labor History">
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
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
//                   <FormInput 
//                     label="Fiscal Year *" 
//                     value={activeRecord.fiscalYear || ""} 
//                     onChange={(e) => handleFieldChange("fiscalYear", e.target.value)} 
//                   />
//                   <FormInput 
//                     label="Period *" 
//                     value={activeRecord.period || ""} 
//                     onChange={(e) => handleFieldChange("period", e.target.value)} 
//                   />
//                   <FormInput 
//                     label="Subperiod *" 
//                     value={activeRecord.subperiod || "1"} 
//                     onChange={(e) => handleFieldChange("subperiod", e.target.value)} 
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-1 gap-y-2 mt-2">
//                    <div className="flex gap-2">
//                       <FormInput 
//                         label="Project *" 
//                         value={activeRecord.project || ""} 
//                         onChange={(e) => handleFieldChange("project", e.target.value)} 
//                       />
//                       <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
//                         {activeRecord.projectName}
//                       </div>
//                    </div>
//                    <div className="flex gap-2">
//                       <FormInput 
//                         label="Organization *" 
//                         value={activeRecord.organization || ""} 
//                         onChange={(e) => handleFieldChange("organization", e.target.value)} 
//                       />
//                       <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
//                         {activeRecord.orgName}
//                       </div>
//                    </div>
//                    <div className="flex gap-2">
//                       <FormInput 
//                         label="Account *" 
//                         value={activeRecord.account || ""} 
//                         onChange={(e) => handleFieldChange("account", e.target.value)} 
//                       />
//                       <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
//                         {activeRecord.accountName}
//                       </div>
//                    </div>
//                 </div>
//               </FormSection>

//               <SecondaryContainer title="Labor Summary Detail">
//                 <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
//                 <ReusableTable 
//                   data={activeRecord.laborDetails || []} 
//                   columns={laborColumns} 
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

// export default ManageProjectLaborHistory;

import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Briefcase } from "lucide-react";

const mainColumns = [
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
  { id: "period", key: "period", label: "Period *" },
  { id: "subperiod", key: "subperiod", label: "Subperiod *" },
  { id: "project", key: "project", label: "Project *" },
  { id: "organization", key: "organization", label: "Organization *" },
  { id: "account", key: "account", label: "Account *" }
];

const laborColumns = [
  { id: "plc", key: "plc", label: "PLC" },
  { id: "glc", key: "glc", label: "GLC *" },
  { id: "employee", key: "employee", label: "Employee" },
  { id: "employeeName", key: "employeeName", label: "Employee Name" },
  { id: "vendor", key: "vendor", label: "Vendor" },
  { id: "vendorName", key: "vendorName", label: "Vendor Name" },
  { id: "vendorEmployee", key: "vendorEmployee", label: "Vendor Employee" },
  { id: "vendorEmployeeName", key: "vendorEmployeeName", label: "Vendor Employee Name" },
  { id: "amount", key: "amount", label: "Amount *", type: "number" },
  { id: "hours", key: "hours", label: "Hours *", type: "number" }
];

const ManageProjectLaborHistory = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      fiscalYear: "2024",
      period: "1",
      subperiod: "1",
      project: "PRJ-LAB",
      projectName: "Labor Tracking Project",
      organization: "ORG-01",
      orgName: "Engineering",
      account: "600-10",
      accountName: "Direct Labor",
      laborDetails: [
        { id: "l1", plc: "ENG-1", glc: "601", employee: "E101", employeeName: "John Doe", vendor: "", vendorName: "", vendorEmployee: "", vendorEmployeeName: "", amount: 1500, hours: 40 }
      ]
    }
  ]);

  const activeRecord = records[currentIndex] || {};

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = { 
      id: newId, 
      fiscalYear: "", period: "", subperiod: "1", 
      project: "", projectName: "", 
      organization: "", orgName: "", 
      account: "", accountName: "",
      laborDetails: [] 
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
      <MainContainer icon={Briefcase} title="Project Labor History">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
                <FormInput 
                  label="Fiscal Year *" 
                  value={activeRecord.fiscalYear || ""} 
                  onChange={(e) => handleFieldChange("fiscalYear", e.target.value)} 
                />
                <FormInput 
                  label="Period *" 
                  value={activeRecord.period || ""} 
                  onChange={(e) => handleFieldChange("period", e.target.value)} 
                />
                <FormInput 
                  label="Subperiod *" 
                  value={activeRecord.subperiod || "1"} 
                  onChange={(e) => handleFieldChange("subperiod", e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-y-2 mt-2">
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
                 <div className="flex gap-2">
                    <FormInput 
                      label="Organization *" 
                      value={activeRecord.organization || ""} 
                      onChange={(e) => handleFieldChange("organization", e.target.value)} 
                    />
                    <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
                      {activeRecord.orgName}
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <FormInput 
                      label="Account *" 
                      value={activeRecord.account || ""} 
                      onChange={(e) => handleFieldChange("account", e.target.value)} 
                    />
                    <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
                      {activeRecord.accountName}
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

          <SecondaryContainer title="Labor Summary Detail">
            <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
            <ReusableTable 
              data={activeRecord.laborDetails || []} 
              columns={laborColumns} 
              onFieldChange={() => {}} 
            />
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageProjectLaborHistory;
