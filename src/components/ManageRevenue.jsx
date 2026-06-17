// import React, { useState } from "react";
// import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { FileText } from "lucide-react";
// import AwardFee from "./AwardFee";
// import RevenueAdjustments from "./RevenueAdjustments";

// const ManageRevenue = () => {
//   const [isMainFormView, setIsMainFormView] = useState(true);
//   const [showAwardFee, setShowAwardFee] = useState(false);
//   const [showRevenueAdjustments, setShowRevenueAdjustments] = useState(false);

//   const [revenueData, setRevenueData] = useState([{
//     id: "REV001",
//     project: "",
//     revenueFormula: "",
//     fiscalYear: "",
//     calcRevOnUnits: false,
//     itdcpfc: false,
//     doNotRedistribute: false,
//     discountMethod: "",
//     allowRevExceed: false,
//     byHowMuch: "",
//     postRevenueTo: "owning",
//     laborMultiplier: "1.0000",
//     nonLaborMultiplier: "1.0000"
//   }]);

//   const mainColumns = [
//     { id: "project", key: "project", label: "Project" },
//     { id: "revenueFormula", key: "revenueFormula", label: "Revenue Formula" },
//     { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year" }
//   ];

//   const handleFieldChange = (id, field, value) => {
//     setRevenueData(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
//   };

//   const activeRecord = revenueData[0]; // Assuming single record for simplicity

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={FileText} title="Manage Revenue Information">
//         <Toolbar 
//           isFormView={isMainFormView}
//           columns={mainColumns}
//           actions={{
//             onToggleView: () => setIsMainFormView(!isMainFormView),
//             onAdd: () => {},
//             onSave: () => {},
//             onClear: () => {},
//             onDelete: () => {}
//           }}
//         />

//         <div className="mt-2">
//           {isMainFormView ? (
//             <div className="space-y-4">
//               <div className="flex gap-4 items-center px-4">
//                 <FormSearchSelect 
//                   label="Project" 
//                   value={activeRecord.project} 
//                   options={[]} 
//                   displayKey="project" 
//                 />
//                 <div className="flex-1"></div>
//               </div>

//               <FormSection title="Revenue Information">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="space-y-2">
//                     <FormSearchSelect 
//                       label="Revenue Formula" 
//                       value={activeRecord.revenueFormula} 
//                       options={[]} 
//                       displayKey="revenueFormula" 
//                     />
//                     <div className="space-y-1 ml-4 py-2">
//                       <FormInput 
//                         label="Calculate Revenue on Units" 
//                         type="checkbox" 
//                         checked={activeRecord.calcRevOnUnits} 
//                         onChange={(e) => handleFieldChange(activeRecord.id, "calcRevOnUnits", e.target.checked)} 
//                       />
//                       <FormInput 
//                         label="ITDCPFC - Other Fee on Revenue Level" 
//                         type="checkbox" 
//                         checked={activeRecord.itdcpfc} 
//                         onChange={(e) => handleFieldChange(activeRecord.id, "itdcpfc", e.target.checked)} 
//                       />
//                       <FormInput 
//                         label="Do Not Redistribute" 
//                         type="checkbox" 
//                         checked={activeRecord.doNotRedistribute} 
//                         onChange={(e) => handleFieldChange(activeRecord.id, "doNotRedistribute", e.target.checked)} 
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <FormInput 
//                       label="Fiscal Year" 
//                       value={activeRecord.fiscalYear} 
//                       onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} 
//                     />
//                     <FormInput 
//                       label="Discount Method" 
//                       type="select" 
//                       value={activeRecord.discountMethod} 
//                       onChange={(e) => handleFieldChange(activeRecord.id, "discountMethod", e.target.value)} 
//                       options={[
//                         {value: "none", label: "-None-"}
//                       ]}
//                     />
//                     <div className="flex gap-4 items-center mt-2">
//                        <FormInput 
//                          label="Allow Revenue to Exceed Value" 
//                          type="checkbox" 
//                          checked={activeRecord.allowRevExceed} 
//                          onChange={(e) => handleFieldChange(activeRecord.id, "allowRevExceed", e.target.checked)} 
//                        />
//                        <FormInput 
//                          label="By How Much ?" 
//                          value={activeRecord.byHowMuch} 
//                          onChange={(e) => handleFieldChange(activeRecord.id, "byHowMuch", e.target.value)} 
//                        />
//                     </div>
//                   </div>
//                 </div>
//               </FormSection>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
//                  <div className="border border-gray-200 rounded p-2 text-[10px]">
//                     <span className="text-gray-500 font-bold mb-2 block uppercase text-[#17414d]">Post revenue to the</span>
//                     <div className="flex gap-8 px-4">
//                        <FormInput label="Owning Organization" type="radio" name="postTo" checked={activeRecord.postRevenueTo === 'owning'} onChange={() => handleFieldChange(activeRecord.id, 'postRevenueTo', 'owning')} />
//                        <FormInput label="Performing Organization" type="radio" name="postTo" checked={activeRecord.postRevenueTo === 'performing'} onChange={() => handleFieldChange(activeRecord.id, 'postRevenueTo', 'performing')} />
//                     </div>
//                  </div>
//                  <div className="border border-gray-200 rounded p-2 text-[10px]">
//                     <span className="text-gray-500 font-bold mb-2 block uppercase text-[#17414d]">Pool Multiplier</span>
//                     <div className="flex gap-8 px-4">
//                        <FormInput label="Labor" value={activeRecord.laborMultiplier} onChange={(e) => handleFieldChange(activeRecord.id, 'laborMultiplier', e.target.value)} />
//                        <FormInput label="Non-Labor" value={activeRecord.nonLaborMultiplier} onChange={(e) => handleFieldChange(activeRecord.id, 'nonLaborMultiplier', e.target.value)} />
//                     </div>
//                  </div>
//               </div>

//               {/* Tabs for secondary containers */}
//               <div className="flex gap-2 px-4 pb-2">
//                 <button 
//                   onClick={() => setShowAwardFee(true)}
//                   className={`px-3 py-1 border rounded text-[10px] font-bold transition-colors ${showAwardFee ? "bg-[#dbeafe] text-[#17414d] border-[#c5d9eb]" : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe]"}`}
//                 >
//                   Award Fee
//                 </button>
//                 <button 
//                   onClick={() => setShowRevenueAdjustments(true)}
//                   className={`px-3 py-1 border rounded text-[10px] font-bold transition-colors ${showRevenueAdjustments ? "bg-[#dbeafe] text-[#17414d] border-[#c5d9eb]" : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe]"}`}
//                 >
//                   Revenue Adjustments
//                 </button>
//               </div>

//             </div>
//           ) : (
//             <ReusableTable 
//               data={revenueData} 
//               columns={mainColumns} 
//               onFieldChange={handleFieldChange} 
//             />
//           )}
//         </div>
//       </MainContainer>

//       {showRevenueAdjustments && (
//         <SecondaryContainer title="Revenue information > Revenue Adjustments" handleClose={() => setShowRevenueAdjustments(false)}>
//           <RevenueAdjustments />
//         </SecondaryContainer>
//       )}

//       {showAwardFee && (
//         <SecondaryContainer title="Revenue information > Award Fee" handleClose={() => setShowAwardFee(false)}>
//           <AwardFee />
//         </SecondaryContainer>
//       )}

//     </div>
//   );
// };

// export default ManageRevenue;

import React, { useState } from "react";
import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { FileText } from "lucide-react";
import AwardFee from "./AwardFee";
import RevenueAdjustments from "./RevenueAdjustments";

const ManageRevenue = () => {
  const [isMainFormView, setIsMainFormView] = useState(true);
  const [showAwardFee, setShowAwardFee] = useState(false);
  const [showRevenueAdjustments, setShowRevenueAdjustments] = useState(false);

  const [revenueData, setRevenueData] = useState([{
    id: "REV001",
    project: "",
    revenueFormula: "",
    fiscalYear: "",
    calcRevOnUnits: false,
    itdcpfc: false,
    doNotRedistribute: false,
    discountMethod: "",
    allowRevExceed: false,
    byHowMuch: "",
    postRevenueTo: "owning",
    laborMultiplier: "1.0000",
    nonLaborMultiplier: "1.0000"
  }]);

  const mainColumns = [
    { id: "project", key: "project", label: "Project" },
    { id: "revenueFormula", key: "revenueFormula", label: "Revenue Formula" },
    { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year" },
    { id: "calcRevOnUnits", key: "calcRevOnUnits", label: "Calculate Revenue on Units", type: "checkbox" },
    { id: "itdcpfc", key: "itdcpfc", label: "ITDCPFC", type: "checkbox" },
    { id: "doNotRedistribute", key: "doNotRedistribute", label: "Do Not Redistribute", type: "checkbox" },
    { id: "discountMethod", key: "discountMethod", label: "Discount Method" },
    { id: "allowRevExceed", key: "allowRevExceed", label: "Allow Revenue to Exceed Value", type: "checkbox" },
    { id: "byHowMuch", key: "byHowMuch", label: "By How Much ?" },
    { id: "postRevenueTo", key: "postRevenueTo", label: "Post Revenue To" },
    { id: "laborMultiplier", key: "laborMultiplier", label: "Labor Multiplier" },
    { id: "nonLaborMultiplier", key: "nonLaborMultiplier", label: "Non-Labor Multiplier" }
  ];

  const handleFieldChange = (id, field, value) => {
    setRevenueData(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const activeRecord = revenueData[0]; // Assuming single record for simplicity

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={FileText} title="Manage Revenue Information">
        <Toolbar 
          isFormView={isMainFormView}
          columns={mainColumns}
          actions={{
            onToggleView: () => setIsMainFormView(!isMainFormView),
            onAdd: () => {},
            onSave: () => {},
            onClear: () => {},
            onDelete: () => {}
          }}
        />

        <div className="mt-2">
          {isMainFormView ? (
            <div className="space-y-4">
              <div className="flex gap-4 items-center px-4">
                <FormSearchSelect 
                  label="Project" 
                  value={activeRecord.project} 
                  options={[]} 
                  displayKey="project" 
                />
                <div className="flex-1"></div>
              </div>

              <FormSection title="Revenue Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <FormSearchSelect 
                      label="Revenue Formula" 
                      value={activeRecord.revenueFormula} 
                      options={[]} 
                      displayKey="revenueFormula" 
                    />
                    <div className="space-y-1 ml-4 py-2">
                      <FormInput 
                        label="Calculate Revenue on Units" 
                        type="checkbox" 
                        checked={activeRecord.calcRevOnUnits} 
                        onChange={(e) => handleFieldChange(activeRecord.id, "calcRevOnUnits", e.target.checked)} 
                      />
                      <FormInput 
                        label="ITDCPFC - Other Fee on Revenue Level" 
                        type="checkbox" 
                        checked={activeRecord.itdcpfc} 
                        onChange={(e) => handleFieldChange(activeRecord.id, "itdcpfc", e.target.checked)} 
                      />
                      <FormInput 
                        label="Do Not Redistribute" 
                        type="checkbox" 
                        checked={activeRecord.doNotRedistribute} 
                        onChange={(e) => handleFieldChange(activeRecord.id, "doNotRedistribute", e.target.checked)} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormInput 
                      label="Fiscal Year" 
                      value={activeRecord.fiscalYear} 
                      onChange={(e) => handleFieldChange(activeRecord.id, "fiscalYear", e.target.value)} 
                    />
                    <FormInput 
                      label="Discount Method" 
                      type="select" 
                      value={activeRecord.discountMethod} 
                      onChange={(e) => handleFieldChange(activeRecord.id, "discountMethod", e.target.value)} 
                      options={[
                        {value: "none", label: "-None-"}
                      ]}
                    />
                    <div className="flex gap-4 items-center mt-2">
                       <FormInput 
                         label="Allow Revenue to Exceed Value" 
                         type="checkbox" 
                         checked={activeRecord.allowRevExceed} 
                         onChange={(e) => handleFieldChange(activeRecord.id, "allowRevExceed", e.target.checked)} 
                       />
                       <FormInput 
                         label="By How Much ?" 
                         value={activeRecord.byHowMuch} 
                         onChange={(e) => handleFieldChange(activeRecord.id, "byHowMuch", e.target.value)} 
                       />
                    </div>
                  </div>
                </div>
              </FormSection>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
                 <div className="border border-gray-200 rounded p-2 text-[10px]">
                    <span className="text-gray-500 font-bold mb-2 block uppercase text-[#17414d]">Post revenue to the</span>
                    <div className="flex gap-8 px-4">
                       <FormInput label="Owning Organization" type="radio" name="postTo" checked={activeRecord.postRevenueTo === 'owning'} onChange={() => handleFieldChange(activeRecord.id, 'postRevenueTo', 'owning')} />
                       <FormInput label="Performing Organization" type="radio" name="postTo" checked={activeRecord.postRevenueTo === 'performing'} onChange={() => handleFieldChange(activeRecord.id, 'postRevenueTo', 'performing')} />
                    </div>
                 </div>
                 <div className="border border-gray-200 rounded p-2 text-[10px]">
                    <span className="text-gray-500 font-bold mb-2 block uppercase text-[#17414d]">Pool Multiplier</span>
                    <div className="flex gap-8 px-4">
                       <FormInput label="Labor" value={activeRecord.laborMultiplier} onChange={(e) => handleFieldChange(activeRecord.id, 'laborMultiplier', e.target.value)} />
                       <FormInput label="Non-Labor" value={activeRecord.nonLaborMultiplier} onChange={(e) => handleFieldChange(activeRecord.id, 'nonLaborMultiplier', e.target.value)} />
                    </div>
                 </div>
              </div>

            </div>
          ) : (
            <ReusableTable 
              data={revenueData} 
              columns={mainColumns} 
              onFieldChange={handleFieldChange} 
            />
          )}

          {/* Tabs for secondary containers */}
          <div className="flex gap-2 px-4 pb-2 mt-4">
            <button 
              onClick={() => setShowAwardFee(true)}
              className={`px-3 py-1 border rounded text-[10px] font-bold transition-colors ${showAwardFee ? "bg-[#dbeafe] text-[#17414d] border-[#c5d9eb]" : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe]"}`}
            >
              Award Fee
            </button>
            <button 
              onClick={() => setShowRevenueAdjustments(true)}
              className={`px-3 py-1 border rounded text-[10px] font-bold transition-colors ${showRevenueAdjustments ? "bg-[#dbeafe] text-[#17414d] border-[#c5d9eb]" : "bg-[#eef6fc] text-[#17414d] border-[#c5d9eb] hover:bg-[#dbeafe]"}`}
            >
              Revenue Adjustments
            </button>
          </div>
        </div>
      </MainContainer>

      {showRevenueAdjustments && (
        <SecondaryContainer title="Revenue information > Revenue Adjustments" handleClose={() => setShowRevenueAdjustments(false)}>
          <RevenueAdjustments />
        </SecondaryContainer>
      )}

      {showAwardFee && (
        <SecondaryContainer title="Revenue information > Award Fee" handleClose={() => setShowAwardFee(false)}>
          <AwardFee />
        </SecondaryContainer>
      )}

    </div>
  );
};

export default ManageRevenue;
