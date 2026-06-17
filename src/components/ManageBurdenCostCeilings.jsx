// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { DollarSign } from "lucide-react";

// const columns = [
//   { id: "project", key: "project", label: "Project *" },
//   { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
//   { id: "account", key: "account", label: "Account *" },
//   { id: "accountName", key: "accountName", label: "Account Name" },
//   { id: "pool", key: "pool", label: "Pool *" },
//   { id: "poolName", key: "poolName", label: "Pool Name" },
//   { id: "rateCeiling", key: "rateCeiling", label: "Rate Ceiling" },
//   { id: "rateFormat1", key: "rateFormat1", label: "Rate Format" },
//   { id: "costOfMoneyCeiling", key: "costOfMoneyCeiling", label: "Cost of Money Ceiling" },
//   { id: "rateFormat2", key: "rateFormat2", label: "Rate Format" },
//   { id: "ceilingMethod", key: "ceilingMethod", label: "Ceiling Method *" },
//   { id: "applyToRBA", key: "applyToRBA", label: "Apply to R/B/A *" }
// ];

// const ManageBurdenCostCeilings = () => {
//   const [records, setRecords] = useState([{
//     id: "NEW_1", 
//     project: "", 
//     fiscalYear: "",
//     account: "",
//     accountName: "",
//     pool: "",
//     poolName: "",
//     rateCeiling: "",
//     rateFormat1: "",
//     costOfMoneyCeiling: "",
//     rateFormat2: "",
//     ceilingMethod: "",
//     applyToRBA: ""
//   }]);

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={DollarSign} title="Burden Cost Ceilings">
//         <Toolbar 
//           isFormView={false} 
//           columns={columns}
//           actions={{ 
//             onAdd: () => {},
//             onSave: () => {},
//             onDelete: () => {},
//             onCopy: () => {}
//           }} 
//         />
//         <div className="mt-2">
//           <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageBurdenCostCeilings;

import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";
import { DollarSign } from "lucide-react";

const columns = [
  { id: "project", key: "project", label: "Project *" },
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
  { id: "account", key: "account", label: "Account *" },
  { id: "accountName", key: "accountName", label: "Account Name" },
  { id: "pool", key: "pool", label: "Pool *" },
  { id: "poolName", key: "poolName", label: "Pool Name" },
  { id: "rateCeiling", key: "rateCeiling", label: "Rate Ceiling" },
  { id: "rateFormat1", key: "rateFormat1", label: "Rate Format" },
  { id: "costOfMoneyCeiling", key: "costOfMoneyCeiling", label: "Cost of Money Ceiling" },
  { id: "rateFormat2", key: "rateFormat2", label: "Rate Format" },
  { id: "ceilingMethod", key: "ceilingMethod", label: "Ceiling Method *" },
  { id: "applyToRBA", key: "applyToRBA", label: "Apply to R/B/A *" }
];

const ManageBurdenCostCeilings = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    project: "", 
    fiscalYear: "",
    account: "",
    accountName: "",
    pool: "",
    poolName: "",
    rateCeiling: "",
    rateFormat1: "",
    costOfMoneyCeiling: "",
    rateFormat2: "",
    ceilingMethod: "",
    applyToRBA: ""
  }]);

  const activeRecord = records[0] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={DollarSign} title="Burden Cost Ceilings">
        <Toolbar 
          isFormView={isFormView} 
          columns={columns}
          handleFindReplace={() => {}}
          actions={{ 
            onToggleView: () => setIsFormView(!isFormView),
            onAdd: () => {},
            onSave: () => {},
            onDelete: () => {},
            onCopy: () => {}
          }} 
        />
        <div className="mt-2">
          {isFormView ? (
            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <FormInput label="Project *" value={activeRecord.project || ""} onChange={(e) => handleFieldChange(activeRecord.id, "project", e.target.value)} />
                       <FormInput label="Fiscal Year *" value={activeRecord.fiscalYear || ""} onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} />
                    </div>
                 </div>
              </div>
              <FormSection title="Burden Cost Ceiling Details">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <FormInput label="Account *" value={activeRecord.account || ""} onChange={(e) => handleFieldChange(activeRecord.id, "account", e.target.value)} />
                       <FormInput label="Account Name" value={activeRecord.accountName || ""} onChange={(e) => handleFieldChange(activeRecord.id, "accountName", e.target.value)} />
                       <FormInput label="Pool *" value={activeRecord.pool || ""} onChange={(e) => handleFieldChange(activeRecord.id, "pool", e.target.value)} />
                       <FormInput label="Pool Name" value={activeRecord.poolName || ""} onChange={(e) => handleFieldChange(activeRecord.id, "poolName", e.target.value)} />
                       <FormInput label="Rate Ceiling" value={activeRecord.rateCeiling || ""} onChange={(e) => handleFieldChange(activeRecord.id, "rateCeiling", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <FormInput label="Rate Format" value={activeRecord.rateFormat1 || ""} onChange={(e) => handleFieldChange(activeRecord.id, "rateFormat1", e.target.value)} />
                       <FormInput label="Cost of Money Ceiling" value={activeRecord.costOfMoneyCeiling || ""} onChange={(e) => handleFieldChange(activeRecord.id, "costOfMoneyCeiling", e.target.value)} />
                       <FormInput label="Rate Format" value={activeRecord.rateFormat2 || ""} onChange={(e) => handleFieldChange(activeRecord.id, "rateFormat2", e.target.value)} />
                       <FormInput label="Ceiling Method *" value={activeRecord.ceilingMethod || ""} onChange={(e) => handleFieldChange(activeRecord.id, "ceilingMethod", e.target.value)} />
                       <FormInput label="Apply to R/B/A *" value={activeRecord.applyToRBA || ""} onChange={(e) => handleFieldChange(activeRecord.id, "applyToRBA", e.target.value)} />
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

export default ManageBurdenCostCeilings;
