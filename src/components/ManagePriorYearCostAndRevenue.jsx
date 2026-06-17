// import React, { useState } from "react";
// import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
// import { FormSection, FormInput } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { Layers } from "lucide-react";

// const mainColumns = [
//   { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
//   { id: "rateType", key: "rateType", label: "Rate Type" },
//   { id: "project", key: "project", label: "Project *" },
//   { id: "organization", key: "organization", label: "Organization *" }
// ];

// const detailsColumns = [
//   { id: "account", key: "account", label: "Account *" },
//   { id: "accountName", key: "accountName", label: "Account Name" },
//   { id: "directAmtIncurred", key: "directAmtIncurred", label: "Direct Amount Incurred", type: "number" },
//   { id: "directAmtAllowed", key: "directAmtAllowed", label: "Direct Amount Allowed", type: "number" },
//   { id: "discountAmt", key: "discountAmt", label: "Discount Amount", type: "number" },
//   { id: "directFee", key: "directFee", label: "Direct Fee", type: "number" },
//   { id: "feeOnHours", key: "feeOnHours", label: "Fee on Hours", type: "number" },
//   { id: "directHours", key: "directHours", label: "Direct Hours", type: "number" },
//   { id: "directHoursAllowed", key: "directHoursAllowed", label: "Direct Hours Allowed", type: "number" },
//   { id: "burdenAmtIncurred", key: "burdenAmtIncurred", label: "Burden Amount Incurred", type: "number" }
// ];

// const ManagePriorYearCostAndRevenue = () => {
//   const [isFormView, setIsFormView] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [records, setRecords] = useState([
//     {
//       id: "1",
//       fiscalYear: "2023",
//       rateType: "Actual",
//       project: "PRJ-COST",
//       projectName: "Prior Year Tracking",
//       organization: "ORG-REV",
//       orgName: "Finance",
//       totalDirectAllowed: 50000,
//       totalFees: 5000,
//       totalRevenue: 55000,
//       totalIndirectAllowed: 10000,
//       totalAdjustments: 0,
//       awardFeeRevenue: 2000,
//       details: [
//         { id: "d1", account: "400-01", accountName: "Revenue", directAmtIncurred: 45000, directAmtAllowed: 45000, discountAmt: 0, directFee: 4500, feeOnHours: 0, directHours: 100, directHoursAllowed: 100, burdenAmtIncurred: 5000 }
//       ]
//     }
//   ]);

//   const activeRecord = records[currentIndex] || {};

//   const handleAdd = () => {
//     const newId = `NEW_${Date.now()}`;
//     const newRecord = { 
//       id: newId, 
//       fiscalYear: "", rateType: "", 
//       project: "", projectName: "", 
//       organization: "", orgName: "",
//       totalDirectAllowed: 0, totalFees: 0, totalRevenue: 0,
//       totalIndirectAllowed: 0, totalAdjustments: 0, awardFeeRevenue: 0,
//       details: [] 
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
//       <MainContainer icon={Layers} title="Prior Year Cost and Revenue">
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
//                   <FormInput 
//                     label="Fiscal Year *" 
//                     value={activeRecord.fiscalYear || ""} 
//                     onChange={(e) => handleFieldChange("fiscalYear", e.target.value)} 
//                   />
//                   <div className="flex gap-2">
//                     <FormInput 
//                       label="Rate Type" 
//                       value={activeRecord.rateType || ""} 
//                       onChange={(e) => handleFieldChange("rateType", e.target.value)} 
//                     />
//                     <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
//                     </div>
//                   </div>
//                   <div className="flex gap-2 col-span-1 md:col-span-2">
//                     <FormInput 
//                       label="Project *" 
//                       value={activeRecord.project || ""} 
//                       onChange={(e) => handleFieldChange("project", e.target.value)} 
//                     />
//                     <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
//                       {activeRecord.projectName}
//                     </div>
//                   </div>
//                   <div className="flex gap-2 col-span-1 md:col-span-2">
//                     <FormInput 
//                       label="Organization *" 
//                       value={activeRecord.organization || ""} 
//                       onChange={(e) => handleFieldChange("organization", e.target.value)} 
//                     />
//                     <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
//                       {activeRecord.orgName}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 mt-4 pt-4 border-t border-gray-100">
//                    <FormInput label="Total Direct Allowed Amount" value={activeRecord.totalDirectAllowed || 0} readOnly />
//                    <FormInput label="Total Fees" value={activeRecord.totalFees || 0} readOnly />
//                    <FormInput label="Total Revenue" value={activeRecord.totalRevenue || 0} readOnly />
//                    <FormInput label="Total Indirect Allowed Amount" value={activeRecord.totalIndirectAllowed || 0} readOnly />
//                    <FormInput label="Total Adjustments to Revenue" value={activeRecord.totalAdjustments || 0} readOnly />
//                    <FormInput label="Award Fee Revenue" value={activeRecord.awardFeeRevenue || 0} readOnly />
//                 </div>
//               </FormSection>

//               <SecondaryContainer title="Details">
//                 <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
//                 <ReusableTable 
//                   data={activeRecord.details || []} 
//                   columns={detailsColumns} 
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

// export default ManagePriorYearCostAndRevenue;

import React, { useState } from "react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { Layers } from "lucide-react";

const mainColumns = [
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
  { id: "rateType", key: "rateType", label: "Rate Type" },
  { id: "project", key: "project", label: "Project *" },
  { id: "organization", key: "organization", label: "Organization *" }
];

const detailsColumns = [
  { id: "account", key: "account", label: "Account *" },
  { id: "accountName", key: "accountName", label: "Account Name" },
  { id: "directAmtIncurred", key: "directAmtIncurred", label: "Direct Amount Incurred", type: "number" },
  { id: "directAmtAllowed", key: "directAmtAllowed", label: "Direct Amount Allowed", type: "number" },
  { id: "discountAmt", key: "discountAmt", label: "Discount Amount", type: "number" },
  { id: "directFee", key: "directFee", label: "Direct Fee", type: "number" },
  { id: "feeOnHours", key: "feeOnHours", label: "Fee on Hours", type: "number" },
  { id: "directHours", key: "directHours", label: "Direct Hours", type: "number" },
  { id: "directHoursAllowed", key: "directHoursAllowed", label: "Direct Hours Allowed", type: "number" },
  { id: "burdenAmtIncurred", key: "burdenAmtIncurred", label: "Burden Amount Incurred", type: "number" }
];

const ManagePriorYearCostAndRevenue = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState([
    {
      id: "1",
      fiscalYear: "2023",
      rateType: "Actual",
      project: "PRJ-COST",
      projectName: "Prior Year Tracking",
      organization: "ORG-REV",
      orgName: "Finance",
      totalDirectAllowed: 50000,
      totalFees: 5000,
      totalRevenue: 55000,
      totalIndirectAllowed: 10000,
      totalAdjustments: 0,
      awardFeeRevenue: 2000,
      details: [
        { id: "d1", account: "400-01", accountName: "Revenue", directAmtIncurred: 45000, directAmtAllowed: 45000, discountAmt: 0, directFee: 4500, feeOnHours: 0, directHours: 100, directHoursAllowed: 100, burdenAmtIncurred: 5000 }
      ]
    }
  ]);

  const activeRecord = records[currentIndex] || {};

  const handleAdd = () => {
    const newId = `NEW_${Date.now()}`;
    const newRecord = { 
      id: newId, 
      fiscalYear: "", rateType: "", 
      project: "", projectName: "", 
      organization: "", orgName: "",
      totalDirectAllowed: 0, totalFees: 0, totalRevenue: 0,
      totalIndirectAllowed: 0, totalAdjustments: 0, awardFeeRevenue: 0,
      details: [] 
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
      <MainContainer icon={Layers} title="Prior Year Cost and Revenue">
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
                <FormInput 
                  label="Fiscal Year *" 
                  value={activeRecord.fiscalYear || ""} 
                  onChange={(e) => handleFieldChange("fiscalYear", e.target.value)} 
                />
                <div className="flex gap-2">
                  <FormInput 
                    label="Rate Type" 
                    value={activeRecord.rateType || ""} 
                    onChange={(e) => handleFieldChange("rateType", e.target.value)} 
                  />
                  <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
                  </div>
                </div>
                <div className="flex gap-2 col-span-1 md:col-span-2">
                  <FormInput 
                    label="Project *" 
                    value={activeRecord.project || ""} 
                    onChange={(e) => handleFieldChange("project", e.target.value)} 
                  />
                  <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
                    {activeRecord.projectName}
                  </div>
                </div>
                <div className="flex gap-2 col-span-1 md:col-span-2">
                  <FormInput 
                    label="Organization *" 
                    value={activeRecord.organization || ""} 
                    onChange={(e) => handleFieldChange("organization", e.target.value)} 
                  />
                  <div className="flex-1 border-b border-gray-200 self-center text-[10px] text-gray-500 italic pb-1">
                    {activeRecord.orgName}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 mt-4 pt-4 border-t border-gray-100">
                 <FormInput label="Total Direct Allowed Amount" value={activeRecord.totalDirectAllowed || 0} readOnly />
                 <FormInput label="Total Fees" value={activeRecord.totalFees || 0} readOnly />
                 <FormInput label="Total Revenue" value={activeRecord.totalRevenue || 0} readOnly />
                 <FormInput label="Total Indirect Allowed Amount" value={activeRecord.totalIndirectAllowed || 0} readOnly />
                 <FormInput label="Total Adjustments to Revenue" value={activeRecord.totalAdjustments || 0} readOnly />
                 <FormInput label="Award Fee Revenue" value={activeRecord.awardFeeRevenue || 0} readOnly />
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

          <SecondaryContainer title="Details">
            <Toolbar isTableOnly actions={{ onAdd: () => {}, onCopy: () => {}, onDelete: () => {}, onQuery: () => {} }} />
            <ReusableTable 
              data={activeRecord.details || []} 
              columns={detailsColumns} 
              onFieldChange={() => {}} 
            />
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export default ManagePriorYearCostAndRevenue;

