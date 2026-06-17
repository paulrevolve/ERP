// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { DollarSign } from "lucide-react";

// const columns = [
//   { id: "project", key: "project", label: "Project *" },
//   { id: "account", key: "account", label: "Account *" },
//   { id: "accountName", key: "accountName", label: "Account Name" },
//   { id: "functionalCurrencyCeilingAmount", key: "functionalCurrencyCeilingAmount", label: "Functional Currency Ceiling Amount *" },
//   { id: "applyToRBA", key: "applyToRBA", label: "Apply to R/B/A *" }
// ];

// const ManageDirectCostCeilings = () => {
//   const [records, setRecords] = useState([{
//     id: "NEW_1", 
//     project: "", 
//     account: "",
//     accountName: "",
//     functionalCurrencyCeilingAmount: "",
//     applyToRBA: ""
//   }]);

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={DollarSign} title="Direct Cost Ceilings">
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

// export default ManageDirectCostCeilings;

import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";
import { DollarSign } from "lucide-react";

const columns = [
  { id: "project", key: "project", label: "Project *" },
  { id: "account", key: "account", label: "Account *" },
  { id: "accountName", key: "accountName", label: "Account Name" },
  { id: "functionalCurrencyCeilingAmount", key: "functionalCurrencyCeilingAmount", label: "Functional Currency Ceiling Amount *" },
  { id: "applyToRBA", key: "applyToRBA", label: "Apply to R/B/A *" }
];

const ManageDirectCostCeilings = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    project: "", 
    account: "",
    accountName: "",
    functionalCurrencyCeilingAmount: "",
    applyToRBA: ""
  }]);

  const activeRecord = records[0] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={DollarSign} title="Direct Cost Ceilings">
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
                    </div>
                 </div>
              </div>
              <FormSection title="Direct Cost Ceiling Details">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <FormInput label="Account *" value={activeRecord.account || ""} onChange={(e) => handleFieldChange(activeRecord.id, "account", e.target.value)} />
                       <FormInput label="Account Name" value={activeRecord.accountName || ""} onChange={(e) => handleFieldChange(activeRecord.id, "accountName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <FormInput label="Functional Currency Ceiling Amount *" value={activeRecord.functionalCurrencyCeilingAmount || ""} onChange={(e) => handleFieldChange(activeRecord.id, "functionalCurrencyCeilingAmount", e.target.value)} />
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

export default ManageDirectCostCeilings;

