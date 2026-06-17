// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { DollarSign } from "lucide-react";

// const columns = [
//   { id: "project", key: "project", label: "Project" },
//   { id: "calculationMethod", key: "calculationMethod", label: "Calculation Method *" }
// ];

// const ManageCostOfGoodsSold = () => {
//   const [isFormView, setIsFormView] = useState(true);
//   const [records, setRecords] = useState([{
//     id: "NEW_1", project: "", calculationMethod: "billed",
//     estimatedTotalValue: "", estimatedCosts: "", itdLossRecognized: "",
//     fixedMonthlyAmount: "0.00", percentOfEstimatedCosts: "0.00%",
//     origCosts: "", origFee: "", origTotal: "",
//     modCosts: "", modFee: "", modTotal: "",
//     totalCosts: "", totalFee: "", totalTotal: ""
//   }]);

//   const activeRecord = records[0];

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={DollarSign} title="Manage Cost of Goods Sold">
//         <Toolbar 
//           isFormView={isFormView} 
//           columns={columns}
//           actions={{ 
//             onToggleView: () => setIsFormView(!isFormView),
//             onAdd: () => {},
//             onSave: () => {},
//             onDelete: () => {},
//             onCopy: () => {}
//           }} 
//         />
//         <div className="mt-2">
//           {isFormView ? (
//             <div className="p-4 space-y-4">
//                <div className="w-full md:w-1/2">
//                   <FormSearchSelect 
//                     label="Project" 
//                     value={activeRecord.project} 
//                     options={[]} 
//                     displayKey="project" 
//                   />
//                </div>

//                <FormSection title="COGS">
//                   <div className="w-full md:w-1/2">
//                      <FormInput 
//                        type="select" 
//                        label="Calculation Method *" 
//                        value={activeRecord.calculationMethod}
//                        onChange={(e) => handleFieldChange(activeRecord.id, "calculationMethod", e.target.value)}
//                        options={[{label: "Billed Amount & Estimate at Completion", value: "billed"}]} 
//                      />
//                   </div>
//                </FormSection>

//                <FormSection title="Basis For COGS Transfer">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                      <div className="space-y-1">
//                         <FormInput label="Estimated Total Value" value={activeRecord.estimatedTotalValue} onChange={(e) => handleFieldChange(activeRecord.id, "estimatedTotalValue", e.target.value)} />
//                         <FormInput label="Estimated Costs" value={activeRecord.estimatedCosts} onChange={(e) => handleFieldChange(activeRecord.id, "estimatedCosts", e.target.value)} />
//                         <FormInput label="ITD Loss Recognized" value={activeRecord.itdLossRecognized} onChange={(e) => handleFieldChange(activeRecord.id, "itdLossRecognized", e.target.value)} />
//                      </div>
//                      <div className="space-y-1">
//                         <FormInput label="Fixed Monthly Amount" value={activeRecord.fixedMonthlyAmount} onChange={(e) => handleFieldChange(activeRecord.id, "fixedMonthlyAmount", e.target.value)} />
//                         <FormInput label="Percent of Estimated Costs" value={activeRecord.percentOfEstimatedCosts} onChange={(e) => handleFieldChange(activeRecord.id, "percentOfEstimatedCosts", e.target.value)} />
//                      </div>
//                   </div>
//                </FormSection>

//                <FormSection title="Project Values">
//                   <div className="grid grid-cols-4 gap-4 items-end mb-2 text-[10px] font-bold text-[#17414d] uppercase tracking-wider">
//                      <div>Contract</div>
//                      <div>Costs</div>
//                      <div>Fee</div>
//                      <div>Total</div>
//                   </div>
//                   <div className="space-y-2">
//                      <div className="grid grid-cols-4 gap-4 items-center">
//                         <div className="text-xs font-medium">Original</div>
//                         <FormInput value={activeRecord.origCosts} onChange={(e) => handleFieldChange(activeRecord.id, "origCosts", e.target.value)} />
//                         <FormInput value={activeRecord.origFee} onChange={(e) => handleFieldChange(activeRecord.id, "origFee", e.target.value)} />
//                         <FormInput value={activeRecord.origTotal} onChange={(e) => handleFieldChange(activeRecord.id, "origTotal", e.target.value)} />
//                      </div>
//                      <div className="grid grid-cols-4 gap-4 items-center">
//                         <div className="text-xs font-medium">Modified</div>
//                         <FormInput value={activeRecord.modCosts} onChange={(e) => handleFieldChange(activeRecord.id, "modCosts", e.target.value)} />
//                         <FormInput value={activeRecord.modFee} onChange={(e) => handleFieldChange(activeRecord.id, "modFee", e.target.value)} />
//                         <FormInput value={activeRecord.modTotal} onChange={(e) => handleFieldChange(activeRecord.id, "modTotal", e.target.value)} />
//                      </div>
//                      <div className="grid grid-cols-4 gap-4 items-center">
//                         <div className="text-xs font-medium">Total</div>
//                         <FormInput value={activeRecord.totalCosts} onChange={(e) => handleFieldChange(activeRecord.id, "totalCosts", e.target.value)} />
//                         <FormInput value={activeRecord.totalFee} onChange={(e) => handleFieldChange(activeRecord.id, "totalFee", e.target.value)} />
//                         <FormInput value={activeRecord.totalTotal} onChange={(e) => handleFieldChange(activeRecord.id, "totalTotal", e.target.value)} />
//                      </div>
//                   </div>
//                </FormSection>

//             </div>
//           ) : (
//             <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
//           )}
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageCostOfGoodsSold;

import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { DollarSign } from "lucide-react";

const columns = [
  { id: "project", key: "project", label: "Project" },
  { id: "calculationMethod", key: "calculationMethod", label: "Calculation Method *" },
  { id: "estimatedTotalValue", key: "estimatedTotalValue", label: "Estimated Total Value" },
  { id: "estimatedCosts", key: "estimatedCosts", label: "Estimated Costs" },
  { id: "itdLossRecognized", key: "itdLossRecognized", label: "ITD Loss Recognized" },
  { id: "fixedMonthlyAmount", key: "fixedMonthlyAmount", label: "Fixed Monthly Amount" },
  { id: "percentOfEstimatedCosts", key: "percentOfEstimatedCosts", label: "Percent of Estimated Costs" },
  { id: "origCosts", key: "origCosts", label: "Original Costs" },
  { id: "origFee", key: "origFee", label: "Original Fee" },
  { id: "origTotal", key: "origTotal", label: "Original Total" },
  { id: "modCosts", key: "modCosts", label: "Modified Costs" },
  { id: "modFee", key: "modFee", label: "Modified Fee" },
  { id: "modTotal", key: "modTotal", label: "Modified Total" },
  { id: "totalCosts", key: "totalCosts", label: "Total Costs" },
  { id: "totalFee", key: "totalFee", label: "Total Fee" },
  { id: "totalTotal", key: "totalTotal", label: "Total Total" }
];

const ManageCostOfGoodsSold = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [records, setRecords] = useState([{
    id: "NEW_1", project: "", calculationMethod: "billed",
    estimatedTotalValue: "", estimatedCosts: "", itdLossRecognized: "",
    fixedMonthlyAmount: "0.00", percentOfEstimatedCosts: "0.00%",
    origCosts: "", origFee: "", origTotal: "",
    modCosts: "", modFee: "", modTotal: "",
    totalCosts: "", totalFee: "", totalTotal: ""
  }]);

  const activeRecord = records[0];

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={DollarSign} title="Manage Cost of Goods Sold">
        <Toolbar 
          isFormView={isFormView} 
          columns={columns}
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
            <div className="p-4 space-y-4">
               <div className="w-full md:w-1/2">
                  <FormSearchSelect 
                    label="Project" 
                    value={activeRecord.project} 
                    options={[]} 
                    displayKey="project" 
                  />
               </div>

               <FormSection title="COGS">
                  <div className="w-full md:w-1/2">
                     <FormInput 
                       type="select" 
                       label="Calculation Method *" 
                       value={activeRecord.calculationMethod}
                       onChange={(e) => handleFieldChange(activeRecord.id, "calculationMethod", e.target.value)}
                       options={[{label: "Billed Amount & Estimate at Completion", value: "billed"}]} 
                     />
                  </div>
               </FormSection>

               <FormSection title="Basis For COGS Transfer">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <FormInput label="Estimated Total Value" value={activeRecord.estimatedTotalValue} onChange={(e) => handleFieldChange(activeRecord.id, "estimatedTotalValue", e.target.value)} />
                        <FormInput label="Estimated Costs" value={activeRecord.estimatedCosts} onChange={(e) => handleFieldChange(activeRecord.id, "estimatedCosts", e.target.value)} />
                        <FormInput label="ITD Loss Recognized" value={activeRecord.itdLossRecognized} onChange={(e) => handleFieldChange(activeRecord.id, "itdLossRecognized", e.target.value)} />
                     </div>
                     <div className="space-y-1">
                        <FormInput label="Fixed Monthly Amount" value={activeRecord.fixedMonthlyAmount} onChange={(e) => handleFieldChange(activeRecord.id, "fixedMonthlyAmount", e.target.value)} />
                        <FormInput label="Percent of Estimated Costs" value={activeRecord.percentOfEstimatedCosts} onChange={(e) => handleFieldChange(activeRecord.id, "percentOfEstimatedCosts", e.target.value)} />
                     </div>
                  </div>
               </FormSection>

               <FormSection title="Project Values">
                  <div className="grid grid-cols-4 gap-4 items-end mb-2 text-[10px] font-bold text-[#17414d] uppercase tracking-wider">
                     <div>Contract</div>
                     <div>Costs</div>
                     <div>Fee</div>
                     <div>Total</div>
                  </div>
                  <div className="space-y-2">
                     <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-xs font-medium">Original</div>
                        <FormInput value={activeRecord.origCosts} onChange={(e) => handleFieldChange(activeRecord.id, "origCosts", e.target.value)} />
                        <FormInput value={activeRecord.origFee} onChange={(e) => handleFieldChange(activeRecord.id, "origFee", e.target.value)} />
                        <FormInput value={activeRecord.origTotal} onChange={(e) => handleFieldChange(activeRecord.id, "origTotal", e.target.value)} />
                     </div>
                     <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-xs font-medium">Modified</div>
                        <FormInput value={activeRecord.modCosts} onChange={(e) => handleFieldChange(activeRecord.id, "modCosts", e.target.value)} />
                        <FormInput value={activeRecord.modFee} onChange={(e) => handleFieldChange(activeRecord.id, "modFee", e.target.value)} />
                        <FormInput value={activeRecord.modTotal} onChange={(e) => handleFieldChange(activeRecord.id, "modTotal", e.target.value)} />
                     </div>
                     <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-xs font-medium">Total</div>
                        <FormInput value={activeRecord.totalCosts} onChange={(e) => handleFieldChange(activeRecord.id, "totalCosts", e.target.value)} />
                        <FormInput value={activeRecord.totalFee} onChange={(e) => handleFieldChange(activeRecord.id, "totalFee", e.target.value)} />
                        <FormInput value={activeRecord.totalTotal} onChange={(e) => handleFieldChange(activeRecord.id, "totalTotal", e.target.value)} />
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

export default ManageCostOfGoodsSold;
