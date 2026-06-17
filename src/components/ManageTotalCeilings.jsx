// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { DollarSign } from "lucide-react";

// const columns = [
//   { id: "project", key: "project", label: "Project *" },
//   { id: "fundingTotal", key: "fundingTotal", label: "Funding Total" },
//   { id: "fundingCost", key: "fundingCost", label: "Funding Cost" },
//   { id: "fundingTotalFee", key: "fundingTotalFee", label: "Funding Total Fee" },
//   { id: "fundingFeePct", key: "fundingFeePct", label: "Funding Fee %" },
//   { id: "fundingCosts", key: "fundingCosts", label: "Funding Costs" },
//   { id: "fundingFee", key: "fundingFee", label: "Funding Fee" },
//   { id: "fundingAwardFee", key: "fundingAwardFee", label: "Funding Award Fee" },
//   { id: "valueTotal", key: "valueTotal", label: "Value Total" },
//   { id: "valueCost", key: "valueCost", label: "Value Cost" },
//   { id: "valueTotalFee", key: "valueTotalFee", label: "Value Total Fee" },
//   { id: "valueFeePct", key: "valueFeePct", label: "Value Fee %" },
//   { id: "valueCosts", key: "valueCosts", label: "Value Costs" },
//   { id: "valueFee", key: "valueFee", label: "Value Fee" },
//   { id: "valueAwardFee", key: "valueAwardFee", label: "Value Award Fee" }
// ];

// const ManageTotalCeilings = () => {
//   const [records, setRecords] = useState([{
//     id: "NEW_1", 
//     project: "", 
//     fundingTotal: "",
//     fundingCost: "",
//     fundingTotalFee: "",
//     fundingFeePct: "",
//     fundingCosts: "",
//     fundingFee: "",
//     fundingAwardFee: "",
//     valueTotal: "",
//     valueCost: "",
//     valueTotalFee: "",
//     valueFeePct: "",
//     valueCosts: "",
//     valueFee: "",
//     valueAwardFee: ""
//   }]);

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={DollarSign} title="Manage Total Ceilings">
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

// export default ManageTotalCeilings;

import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";
import { DollarSign } from "lucide-react";

const columns = [
  { id: "project", key: "project", label: "Project *" },
  { id: "fundingTotal", key: "fundingTotal", label: "Funding Total" },
  { id: "fundingCost", key: "fundingCost", label: "Funding Cost" },
  { id: "fundingTotalFee", key: "fundingTotalFee", label: "Funding Total Fee" },
  { id: "fundingFeePct", key: "fundingFeePct", label: "Funding Fee %" },
  { id: "fundingCosts", key: "fundingCosts", label: "Funding Costs" },
  { id: "fundingFee", key: "fundingFee", label: "Funding Fee" },
  { id: "fundingAwardFee", key: "fundingAwardFee", label: "Funding Award Fee" },
  { id: "valueTotal", key: "valueTotal", label: "Value Total" },
  { id: "valueCost", key: "valueCost", label: "Value Cost" },
  { id: "valueTotalFee", key: "valueTotalFee", label: "Value Total Fee" },
  { id: "valueFeePct", key: "valueFeePct", label: "Value Fee %" },
  { id: "valueCosts", key: "valueCosts", label: "Value Costs" },
  { id: "valueFee", key: "valueFee", label: "Value Fee" },
  { id: "valueAwardFee", key: "valueAwardFee", label: "Value Award Fee" }
];

const ManageTotalCeilings = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    project: "", 
    fundingTotal: "",
    fundingCost: "",
    fundingTotalFee: "",
    fundingFeePct: "",
    fundingCosts: "",
    fundingFee: "",
    fundingAwardFee: "",
    valueTotal: "",
    valueCost: "",
    valueTotalFee: "",
    valueFeePct: "",
    valueCosts: "",
    valueFee: "",
    valueAwardFee: ""
  }]);

  const activeRecord = records[0] || {};

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={DollarSign} title="Manage Total Ceilings">
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
                 <FormInput 
                   label="Project *" 
                   value={activeRecord.project || ""} 
                   onChange={(e) => handleFieldChange(activeRecord.id, "project", e.target.value)}
                 />
              </div>
              <FormSection title="Funding Info">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <FormInput label="Total" value={activeRecord.fundingTotal || ""} onChange={(e) => handleFieldChange(activeRecord.id, "fundingTotal", e.target.value)} />
                       <FormInput label="Cost" value={activeRecord.fundingCost || ""} onChange={(e) => handleFieldChange(activeRecord.id, "fundingCost", e.target.value)} />
                       <FormInput label="Fee" value={activeRecord.fundingTotalFee || ""} onChange={(e) => handleFieldChange(activeRecord.id, "fundingTotalFee", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <FormInput label="Fee %" value={activeRecord.fundingFeePct || ""} onChange={(e) => handleFieldChange(activeRecord.id, "fundingFeePct", e.target.value)} />
                       <FormInput label="Costs" value={activeRecord.fundingCosts || ""} onChange={(e) => handleFieldChange(activeRecord.id, "fundingCosts", e.target.value)} />
                       <FormInput label="Fee" value={activeRecord.fundingFee || ""} onChange={(e) => handleFieldChange(activeRecord.id, "fundingFee", e.target.value)} />
                       <FormInput label="Award Fee" value={activeRecord.fundingAwardFee || ""} onChange={(e) => handleFieldChange(activeRecord.id, "fundingAwardFee", e.target.value)} />
                    </div>
                 </div>
              </FormSection>
              <FormSection title="Value Info">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <FormInput label="Total" value={activeRecord.valueTotal || ""} onChange={(e) => handleFieldChange(activeRecord.id, "valueTotal", e.target.value)} />
                       <FormInput label="Cost" value={activeRecord.valueCost || ""} onChange={(e) => handleFieldChange(activeRecord.id, "valueCost", e.target.value)} />
                       <FormInput label="Fee" value={activeRecord.valueTotalFee || ""} onChange={(e) => handleFieldChange(activeRecord.id, "valueTotalFee", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <FormInput label="Fee %" value={activeRecord.valueFeePct || ""} onChange={(e) => handleFieldChange(activeRecord.id, "valueFeePct", e.target.value)} />
                       <FormInput label="Costs" value={activeRecord.valueCosts || ""} onChange={(e) => handleFieldChange(activeRecord.id, "valueCosts", e.target.value)} />
                       <FormInput label="Fee" value={activeRecord.valueFee || ""} onChange={(e) => handleFieldChange(activeRecord.id, "valueFee", e.target.value)} />
                       <FormInput label="Award Fee" value={activeRecord.valueAwardFee || ""} onChange={(e) => handleFieldChange(activeRecord.id, "valueAwardFee", e.target.value)} />
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

export default ManageTotalCeilings;
