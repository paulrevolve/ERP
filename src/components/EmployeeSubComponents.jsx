// import React, { useState, useMemo, useEffect } from "react";
// import { FormSection, FormInput } from "../helper/formSection";
// import { SecondaryContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { User, Plus, FileText, MapPin, DollarSign, Calendar, MessageSquare, Briefcase } from "lucide-react";
// import AllowanceDetailsTab from "./AllowanceDetails";
// import TaxesDetailsTab from "./TaxesDetails";
// import DeductionsDetailsTab from "./DeductionsDetails";
// import SavingBondsDetailsTab from "./SavingBondsDetails";
// import UserDefinedInfoDetailsTab from "./UserDefinedInfoDetails";
// import AdditionalAddressDetailsTab from "./AdditionalAddressDetails";
// import CitizenshipDetailsTab from "./CitizenshipDetails";
// import PhoneDetailsTab from "./PhoneDetails";
// import AdditionalPayTypesDetailsTab from "./AdditionalPayTypesDetails";

// // --- COLUMN DEFINITIONS ---
// const salaryTableColumns = [
//   { value: "effDate", label: "Effective Date *", key: "effDate", type: "date" },
//   { value: "workHours", label: "Work Hours *", key: "workHours" },
//   { value: "hourlyAmount", label: "Hourly Amount", key: "hourlyAmount" },
//   { value: "annualAmount", label: "Annual Amount", key: "annualAmount" },
//   { value: "homeOrg", label: "Home Organization *", key: "homeOrg" },
//   { value: "glc", label: "GLC *", key: "glc" },
//   { value: "manager", label: "Manager", key: "manager" },
//   { value: "compPlan", label: "Compensation Plan", key: "compPlan" },
//   { value: "step", label: "Step", key: "step" },
//   { value: "grade", label: "Grade", key: "grade" },
//   { value: "reviewForm", label: "Review Form", key: "reviewForm" },
//   { value: "rating", label: "Rating", key: "rating" },
//   { value: "pctGradeChange", label: "Percent Grade Change", key: "pctGradeChange" },
//   { value: "pctRatingChange", label: "Percent Rating Change", key: "pctRatingChange" },
//   { value: "aaPlan", label: "Affirmative Action Plan", key: "aaPlan" },
//   { value: "jobCategory", label: "Job Category", key: "jobCategory" },
//   { value: "eeoCode", label: "EEO Code", key: "eeoCode" },
//   { value: "remoteStatus", label: "Remote Worker Status", key: "remoteStatus" },
//   { value: "salaryComments", label: "Comments", key: "salaryComments" },
//   { value: "endDate", label: "End Date", key: "endDate", type: "date" },
//   { value: "flsa", label: "FLSA Classification", key: "flsa" },
//   { value: "seasonalFl", label: "Seasonal Employee", key: "seasonalFl", type: "flag" },
//   { value: "variableHoursFl", label: "Variable Hours Employee", key: "variableHoursFl", type: "flag" },
//   { value: "pa1", label: "Personal Action 1", key: "pa1" },
//   { value: "pa2", label: "Personal Action 2", key: "pa2" },
//   { value: "pa3", label: "Personal Action 3", key: "pa3" },
//   { value: "timeCollection", label: "Time Collection", key: "timeCollection" },
//   { value: "refNo1", label: "Ref No 1", key: "refNo1" },
//   { value: "refNo2", label: "Ref No 2", key: "refNo2" },
//   { value: "step", label: "Step", key: "step" },
//   { value: "grade", label: "Grade", key: "grade" },
//   { value: "reviewForm", label: "Review Form", key: "reviewForm" },
//   { value: "rating", label: "Rating", key: "rating" },
//   { value: "pctGradeChange", label: "Percent Grade Change", key: "pctGradeChange" },
//   { value: "pctRatingChange", label: "Percent Rating Change", key: "pctRatingChange" },
//   { value: "aaPlan", label: "Affirmative Action Plan", key: "aaPlan" },
//   { value: "jobCategory", label: "Job Category", key: "jobCategory" },
//   { value: "eeoCode", label: "EEO Code", key: "eeoCode" },
//   { value: "effIsHire", label: "Eff Dt is Hire Dt", key: "effIsHire", type: "flag" },
//   { value: "effIsTerm", label: "Eff Dt is Term Dt", key: "effIsTerm", type: "flag" },
//   { value: "remoteStatus", label: "Remote Status", key: "remoteStatus" },
//   { value: "hrComments", label: "HR Comments", key: "hrComments" },
// ];

// const leaveBalancesTableColumns = [
//   { value: "leaveType", label: "Leave Type *", key: "leaveType" },
//   { value: "leaveYear", label: "Leave Year *", key: "leaveYear" },
//   { value: "hours", label: "Hours", key: "hours" },
//   { value: "transactionAmount", label: "Transaction Amount", key: "transactionAmount" },
//   { value: "amount", label: "Amount", key: "amount" },
//   { value: "deferredHours", label: "Deferred Hours", key: "deferredHours" },
//   { value: "lostHours", label: "Lost Hours", key: "lostHours" },
//   { value: "newLeaveType", label: "New Leave Type", key: "newLeaveType" },
// ];

// const leaveTableColumns = [
//   { value: "leaveType", label: "Leave Type *", key: "leaveType" },
//   { value: "leaveCode", label: "Leave Code *", key: "leaveCode" },
//   { value: "leaveHireDate", label: "Leave Hire Date", key: "leaveHireDate", type: "date" },
//   { value: "rate", label: "Rate", key: "rate" },
//   { value: "currentBalance", label: "Current Balance", key: "currentBalance" },
//   { value: "ytdAccrued", label: "YTD Accrued", key: "ytdAccrued" },
//   { value: "ytdUsed", label: "YTD Used", key: "ytdUsed" },
//   { value: "ytdDeferred", label: "YTD Deferred", key: "ytdDeferred" },
//   { value: "ytdLost", label: "YTD Lost", key: "ytdLost" },
// ];

// // --- STABLE KEY HELPER ---
// const getRowKey = (row) => {
//   if (!row) return "";
//   return String(row.tempId || row.emplId || row.id || "");
// };

// // --- 1. EMPLOYEE INFO TAB ---
// export const EmployeeInfoTab = ({ data, onChange }) => {
//     const currentKey = getRowKey(data);
//   //  const currentKey = String(data?.emplId || data?.tempId || data?.id || "");

//   // console.log("Rendering EmployeeInfoTab for key:", currentKey);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <FormSection title="Identity">
//           <FormInput label="Social Security No *" value={data?.ssnId || ""} onChange={(e) => onChange(currentKey, "ssnId", e.target.value)} />
//           <FormInput label="Status *" value={data?.sEmplStatusCd || ""} onChange={(e) => onChange(currentKey, "sEmplStatusCd", e.target.value)} />
//           <FormInput label="Last Name *" value={data.lastName || ""} onChange={(e) => {
//               // Explicitly pass the key we just calculated
//               onChange(currentKey, "lastName", e.target.value);
//             }}  />
//             {/* onChange={(e) =>  onChange(currentKey, "lastName", e.target.value)} */}
//           <FormInput label="First Name *" value={data.firstName || ""} onChange={(e) => onChange(currentKey, "firstName", e.target.value)} />
//           <FormInput label="Middle Name" value={data.midName || ""} onChange={(e) => onChange(currentKey, "midName", e.target.value)} />
//           <FormInput label="Suffix" value={data.nameSfxCd || ""} onChange={(e) => onChange(currentKey, "nameSfxCd", e.target.value)} />
//           <FormInput label="Displayed Name" value={data.prefName || ""} onChange={(e) => onChange(currentKey, "prefName", e.target.value)} />
//           <FormInput label="Birth Date" type="date" value={data?.birthDt?.split('T')[0] ?? ""} onChange={(e) => onChange(currentKey, "birthDt", e.target.value)}/>
//         </FormSection>

//         <FormSection title="Hire Details">
//           <FormInput label="Current Hire Date *" type="date" value={data?.origHireDt || ""} onChange={(e) => onChange(currentKey, "origHireDt", e.target.value)} />
//           <FormInput label="Termination Date" type="date" value={data?.termDt || ""} onChange={(e) => onChange(currentKey, "termDt", e.target.value)} />
//           <FormInput label="Last Day Worked" type="date" value={data?.lastDayDt || ""} readOnly />
//           <FormInput label="Past Hire Date" type="date" value={data?.adjHireDt || ""} onChange={(e) => onChange(currentKey, "adjHireDt", e.target.value)} />
//           <FormInput label="Taxable Entity *" value={data?.taxbleEntityId || ""} onChange={(e) => onChange(currentKey, "taxbleEntityId", e.target.value)} />
//           <FormInput label="Timesheet Cycle *" value={data?.tsPdCd || ""} onChange={(e) => onChange(currentKey, "tsPdCd", e.target.value)} />
//           <FormInput label="Leave Cycle" value={data?.lvPdCd || ""} onChange={(e) => onChange(currentKey, "lvPdCd", e.target.value)} />
//         </FormSection>

//         <FormSection title="Administration">
//           <FormInput label="Locator Code" value={data?.locatorCd || ""} onChange={(e) => onChange(currentKey, "locatorCd", e.target.value)} />
//           <FormInput label="Administrator Name" value={data?.spvsrName || ""} onChange={(e) => onChange(currentKey, "spvsrName", e.target.value)} />
//           <FormInput label="Preferred Name" value={data?.prefName || ""} onChange={(e) => onChange(currentKey, "prefName", e.target.value)} />
//           <FormInput label="Prefix" value={data?.namePrfxCd || ""} onChange={(e) => onChange(currentKey, "namePrfxCd", e.target.value)} />
//           <FormInput label="Prior Name" value={data?.prirName || ""} onChange={(e) => onChange(currentKey, "prirName", e.target.value)} />
//           <FormInput label="Eligible for Auto-Pay" type="checkbox" checked={data?.eligAutoPayFl === true || data?.eligAutoPayFl === "Y"} onChange={(e) => onChange(currentKey, "eligAutoPayFl",e.target.checked  )} />
//           <FormInput label="Vendor" value={data?.companyId || ""} readOnly />
//         </FormSection>
//       </div>
//     </div>
//   );
// };

// // --- 2. HR DATA TAB ---
// export const HrDataTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormSection title="Demographics">
//           <FormInput label="Gender" value={data.sexCd || ""} onChange={(e) => onChange(currentKey, "sexCd", e.target.value)} />
//           <FormInput label="Marital Status" value={data.maritalCd || ""} onChange={(e) => onChange(currentKey, "maritalCd", e.target.value)} />
//           <FormInput label="Race" value={data.sRaceCd || ""} onChange={(e) => onChange(currentKey, "sRaceCd", e.target.value)} />
//           <FormInput label="Race Description" value={data.raceDescription || ""} onChange={(e) => onChange(currentKey, "raceDescription", e.target.value)} />
//           <FormInput label="Visa Type" value={data.visaTypeCd || ""} onChange={(e) => onChange(currentKey, "visaTypeCd", e.target.value)} />
//           <FormInput label="Visa Date" type="date" value={data.visaDt || ""} onChange={(e) => onChange(currentKey, "visaDt", e.target.value)} />
//           <FormInput label="Last Review Date" type="date" value={data.lastReviewDt || ""} onChange={(e) => onChange(currentKey, "lastReviewDt", e.target.value)} />
//           <FormInput label="Next Review Date" type="date" value={data.nextReviewDt || ""} onChange={(e) => onChange(currentKey, "nextReviewDt", e.target.value)} />
//           <FormInput label="Birth City" value={data.birthCityName || ""} onChange={(e) => onChange(currentKey, "birthCityName", e.target.value)} />
//           <FormInput label="Birth State/Province" value={data.birthMailStateDc || ""} onChange={(e) => onChange(currentKey, "birthMailStateDc", e.target.value)} />
//           <FormInput label="Birth Country" value={data.birthCountryCd || ""} onChange={(e) => onChange(currentKey, "birthCountryCd", e.target.value)} />
//         </FormSection>

//         <FormSection title="VETS-4212, Disability, Veteran Status">
//           <FormInput label="Disabled" type="checkbox" checked={data?.disabledFl === true || data?.disabledFl === "Y"} onChange={(e) => onChange(currentKey, "disabledFl", e.target.checked)} />
//           <FormInput label="Blind" type="checkbox" checked={data?.blindFl === true || data?.blindFl === "Y"} onChange={(e) => onChange(currentKey, "blindFl", e.target.checked)} />
//           <div className="mt-4 p-3 border border-gray-200 rounded-lg text-[10px]">
//             <label className="font-bold text-[#17414d] block mb-2 uppercase">Protected Veteran Status</label>
//             <FormInput label="Disabled Veteran" type="checkbox" checked={data?.vetStatusD === true || data?.vetStatusD === "Y"} onChange={(e) => onChange(currentKey, "vetStatusD", e.target.checked)} />
//             <FormInput label="Active Duty Wartime" type="checkbox" checked={data?.vetStatusA === true || data?.vetStatusA === "Y"} onChange={(e) => onChange(currentKey, "vetStatusA", e.target.checked)} />
//             <FormInput label="Armed Forces Service Medal Veteran" type="checkbox" checked={data?.vetStatusV === true || data?.vetStatusV === "Y"} onChange={(e) => onChange(currentKey, "vetStatusV", e.target.checked)} />
//             <FormInput label="Recently Separated Veteran" type="checkbox" checked={data?.vetStatusRs === true || data?.vetStatusRs === "Y"} onChange={(e) => onChange(currentKey, "vetStatusRs", e.target.checked)} />
//             <FormInput label="Discharge/Release Date" type="date" value={data?.vetReleaseDt || ""} onChange={(e) => onChange(currentKey, "vetReleaseDt", e.target.value)} />
//             <FormInput label="Protected Veteran" type="checkbox" checked={data?.vetStatusP === true || data?.vetStatusP === "Y"} onChange={(e) => onChange(currentKey, "vetStatusP", e.target.checked)} />
//             <FormInput label="Not a Protected Veteran" type="checkbox" checked={data?.vetStatusNp === true || data?.vetStatusNp === "Y"} onChange={(e) => onChange(currentKey, "vetStatusNp", e.target.checked)} />
//             <FormInput label="Declined to provide veteran status" type="checkbox" checked={data?.vetStatusDeclined === true || data?.vetStatusDeclined === "Y"} onChange={(e) => onChange(currentKey, "vetStatusDeclined", e.target.checked)} />
//           </div>
//         </FormSection>
//       </div>
//     </div>
//   );
// };

// // --- 3. ADDRESS/CONTACT TAB ---
// export const AddressContactTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 gap-6">
//         <FormSection title="Mailing Address">
//           <FormInput label="Line 1" value={data?.ln1Adr || ""} onChange={(e) => onChange(currentKey, "ln1Adr", e.target.value)} />
//           <FormInput label="Line 2" value={data?.ln2Adr || ""} onChange={(e) => onChange(currentKey, "ln2Adr", e.target.value)} />
//           <FormInput label="Line 3" value={data?.ln3Adr || ""} onChange={(e) => onChange(currentKey, "ln3Adr", e.target.value)} />
//           <FormInput label="City" value={data?.cityName || ""} onChange={(e) => onChange(currentKey, "cityName", e.target.value)} />
//           <FormInput label="State/Province" value={data?.mailStateDc || ""} onChange={(e) => onChange(currentKey, "mailStateDc", e.target.value)} />
//           <FormInput label="Postal Code" value={data?.postalCd || ""} onChange={(e) => onChange(currentKey, "postalCd", e.target.value)} />
//           <FormInput label="Country" value={data?.countryCd || ""} onChange={(e) => onChange(currentKey, "countryCd", e.target.value)} />
//         </FormSection>

//         <div className="space-y-6">
//           <FormSection title="Emergency Contact 1">
//             <FormInput label="Contact Name 1" value={data?.contName1 || ""} onChange={(e) => onChange(currentKey, "contName1", e.target.value)} />
//             <FormInput label="Contact Phone 1" value={data?.contPhone1 || ""} onChange={(e) => onChange(currentKey, "contPhone1", e.target.value)} />
//             <FormInput label="Relationship 1" value={data?.contRel1 || ""} onChange={(e) => onChange(currentKey, "contRel1", e.target.value)} />
//             <FormInput label="Notify on Arrest 1" type="checkbox" checked={data?.contactArrest1 === true || data?.contactArrest1 === "Y"} onChange={(e) => onChange(currentKey, "contactArrest1", e.target.checked)} />
//           </FormSection>

//           <FormSection title="Emergency Contact 2">
//             <FormInput label="Contact Name 2" value={data?.contName2 || ""} onChange={(e) => onChange(currentKey, "contName2", e.target.value)} />
//             <FormInput label="Contact Phone 2" value={data?.contPhone2 || ""} onChange={(e) => onChange(currentKey, "contPhone2", e.target.value)} />
//             <FormInput label="Relationship 2" value={data?.contRel2 || ""} onChange={(e) => onChange(currentKey, "contRel2", e.target.value)} />
//             <FormInput label="Notify on Arrest 2" type="checkbox" checked={data?.contactArrest2 === true || data?.contactArrest2 === "Y"} onChange={(e) => onChange(currentKey, "contactArrest2", e.target.checked)} />
//           </FormSection>
//         </div>
//       </div>

//       <FormSection title="Email Addresses">
//         <div className="grid grid-cols-2 gap-4">
//           <FormInput label="Work Email" value={data?.emailId || ""} onChange={(e) => onChange(currentKey, "emailId", e.target.value)} />
//           <FormInput label="Personal Email" value={data?.homeEmailId || ""} onChange={(e) => onChange(currentKey, "homeEmailId", e.target.value)} />
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// // --- 4. TIMESHEET DEFAULTS TAB ---
// export const TimesheetDefaultsTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <FormSection title="Default Allocations">
//         <div className="grid grid-cols-2 gap-x-8 gap-y-4">
//           <FormInput label="Account" value={data?.tsDefaultAccount || ""} onChange={(e) => onChange(currentKey, "tsDefaultAccount", e.target.value)} />
//           <FormInput label="Organization" value={data?.tsDefaultOrg || ""} onChange={(e) => onChange(currentKey, "tsDefaultOrg", e.target.value)} />
//           <FormInput label="Project" value={data?.tsDefaultProject || ""} onChange={(e) => onChange(currentKey, "tsDefaultProject", e.target.value)} />
//           <FormInput label="GLC" value={data?.tsDefaultGLC || ""} onChange={(e) => onChange(currentKey, "tsDefaultGLC", e.target.value)} />
//           <FormInput label="Pay Type" value={data?.tsDefaultPayType || ""} onChange={(e) => onChange(currentKey, "tsDefaultPayType", e.target.value)} />
//           <FormInput label="Labor Location" value={data?.tsDefaultLaborLocation || ""} onChange={(e) => onChange(currentKey, "tsDefaultLaborLocation", e.target.value)} />
//           <FormInput label="Workers' Comp" value={data?.tsDefaultWorkerComp || ""} onChange={(e) => onChange(currentKey, "tsDefaultWorkerComp", e.target.value)} />
//           <FormInput label="Ref No 1" value={data?.tsDefaultRefNo1 || ""} onChange={(e) => onChange(currentKey, "tsDefaultRefNo1", e.target.value)} />
//           <FormInput label="Ref No 2" value={data?.tsDefaultRefNo2 || ""} onChange={(e) => onChange(currentKey, "tsDefaultRefNo2", e.target.value)} />
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// // --- 5. PRODUCT INTERFACE TAB ---
// export const ProductInterfaceTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <FormSection title="Interface Mapping Details">
//         <div className="grid grid-cols-2 gap-6">
//           <FormInput label="Payroll Service ID" value={data?.prServEmplId || ""} onChange={(e) => onChange(currentKey, "prServEmplId", e.target.value)} />
//           <div className="mt-4 border border-gray-200 p-3 rounded bg-gray-50/30 col-span-2">
//             <label className="text-[10px] font-bold text-[#17414d] block mb-2 uppercase">Project Manufacturing</label>
//             <FormInput label="Plant" value={data?.plantId || ""} onChange={(e) => onChange(currentKey, "plantId", e.target.value)} />
//           </div>
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// // --- 6. NOTES TAB ---
// export const NotesTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <FormSection title="General Employee Notes">
//         <textarea
//           className="w-full h-48 p-3 border border-gray-300 rounded-lg text-xs focus:border-[#17414d] outline-none"
//           value={data.notes || ""}
//           onChange={(e) => onChange(currentKey, "notes", e.target.value)}
//           placeholder="Enter notes here..."
//         />
//       </FormSection>
//     </div>
//   );
// };

// // --- BOTTOM NESTED COMPONENTS ---
// export const SalaryDetailsTab = ({ data, onChange, isFormView, setConfig }) => {
//   const [activeSub, setActiveSub] = useState("Salary Info");

//   const laborData = data?.labors ?? [];
//   const activeLabor = laborData[0] ?? {};
//   const currentKey = getRowKey(data);

//   useEffect(() => {
//     if (setConfig) {
//       setConfig({
//         key: "labors", // Key in the data object
//         cols: salaryTableColumns
//       });
//     }
//   }, [setConfig]);

//   // Helper to add a new labor row
//   const handleAddLabor = () => {
//     const newLabor = {
//       tempId: `NEW_LABOR_${Date.now()}`,
//       effectDt: new Date().toISOString().split('T')[0],
//       orgId: data.tsDefaultOrg || "",
//       genlLabCatCd: data.tsDefaultGLC || "",
//       isDirty: true
//     };

//     // We update the parent state by appending to the 'labors' array
//     onChange(currentKey, "labors", [newLabor, ...laborData]);
//   };

//   const handleFindReplaceSalary = (config, isReplaceMode) => {
//     const { column, findYear, replaceValue } = config;
//     if (!isReplaceMode) return; // Simple local replace for now

//     const updatedLabors = laborData.map(l => {
//       const currentVal = String(l[column] || "");
//       if (currentVal.includes(findYear)) {
//         return { ...l, [column]: replaceValue, isDirty: true };
//       }
//       return l;
//     });
//     onChange(currentKey, "labors", updatedLabors);
//   };

//   if (!isFormView) {
//     return (
//       <div className="p-2">
//         <ReusableTable
//           data={laborData}
//           columns={salaryTableColumns}
//           onFieldChange={(rowId, field, value) => {
//             // Logic to update specific labor record within the labors array
//             const updatedLabors = laborData.map(l =>
//               getRowKey(l) === rowId ? { ...l, [field]: value, isDirty: true } : l
//             );
//             onChange(currentKey, "labors", updatedLabors);
//           }}
//           rowKey={getRowKey}
//           maxHeight="max-h-48"
//         />
//       </div>
//     );
//   }

//   // if (!isFormView) {
//   //   return (
//   //     <div className="p-2">
//   //       <ReusableTable data={laborData} columns={salaryTableColumns} onFieldChange={onChange} maxHeight="max-h-48" />
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex border-b border-gray-200 px-2 mb-4 bg-white">
//         {["Salary Info", "HR Information", "Comments"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveSub(tab)}
//             className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${activeSub === tab ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-500 hover:text-[#17414d]"}`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       <div className="p-2">
//         {activeSub === "Salary Info" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
//             <FormSection title="Compensation">
//               <FormInput label="Effective Date *" type="date" value={activeLabor.effectDt?.split('T')[0] ?? ""} onChange={(e) => onChange(currentKey, 'effDate', e.target.value)} />
//               <FormInput label="End Date" type="date" value={activeLabor.endDt?.split('T')[0] ?? ""} onChange={(e) => onChange(currentKey, 'endDate', e.target.value)} />
//               <FormInput label="Work Hours In Year *" value={activeLabor.workHours ?? "2080"} onChange={(e) => onChange(currentKey, 'workHours', e.target.value)} />
//               <FormInput label="Hourly Amount" value={activeLabor.hrlyAmt ?? ""} onChange={(e) => onChange(currentKey, 'hourlyAmount', e.target.value)} />
//               <FormInput label="Payroll Salary Amount" value={activeLabor.salAmt ?? ""} />
//               <FormInput label="Annual Amount" value={activeLabor.annlAmt ?? ""} />
//               <FormInput label="Percent of Increase" value={data?.pctIncrease ?? ""} readOnly />
//               <FormInput label="Estimated Annual Hours" value={data?.estHours ?? ""} />
//               <FormInput label="Standard Hourly Rate" value={data?.stdRate ?? ""} readOnly />
//               <FormInput label="Employee Class" value={data?.empClass ?? ""} />
//               <FormInput label="Employee Type" type="select" value={data?.empType ?? ""} options={[]} />
//               <FormInput label="Rate Type" type="select" value={activeLabor.hrlySalCd ?? ""} options={[]} />
//               <div className="flex gap-4 ml-[90px] py-1">
//                  <FormInput label="Exempt" type="radio" name="flsa" checked={data?.flsa === 'Exempt'} />
//                  <FormInput label="Non-Exempt" type="radio" name="flsa" checked={data?.flsa === 'Non-Exempt'} />
//               </div>
//             </FormSection>

//             <FormSection title="Organization & Details">
//               <FormInput label="Labor Group" value={data?.laborGroup ?? ""} />
//               <FormInput label="Labor Location" value={data?.laborLocation ?? ""} />
//               <FormInput label="GLC *" value={data?.emplAcctOrgDflt?.genlLabCatCd ?? ""} />
//               <FormInput label="PLC" value={data?.plc ?? ""} />
//               <FormInput label="Overtime State *" value={data?.emplAcctOrgDflt?.whStateCd ?? ""} />
//               <FormInput label="Home Organization *" value={activeLabor.orgId ?? ""} />
//               <FormInput label="Security Organization" value={activeLabor.secOrgId ?? ""} />
//               <FormInput label="HR Organization" value={data?.hrOrg ?? ""} />
//               <FormInput label="Work Schedule" value={data?.workSchedule ?? ""} />
//               <FormInput label="Detail Job Title" value={activeLabor.titleDesc ?? ""} />
//               <FormInput label="Manager" value={data?.manager ?? ""} />
//               <FormInput label="Supervisor" value={activeLabor.supervisorId ?? ""} />
//             </FormSection>
//           </div>
//         )}

//         {activeSub === "HR Information" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <FormSection title="Compensation Data">
//               <FormInput label="Compensation Plan" value={data?.compPlan ?? ""} onChange={(e) => onChange(currentKey, 'compPlan', e.target.value)} />
//               <FormInput label="Step" value={data?.step ?? ""} />
//               <FormInput label="Grade" value={data?.grade ?? ""} readOnly />
//               <FormInput label="Review Form" value={data?.reviewForm ?? ""} />
//               <FormInput label="Rating" value={data?.rating ?? ""} />
//               <FormInput label="Percent Grade Change" value={data?.pctGradeChange ?? ""} readOnly />
//               <FormInput label="Percent Rating Change" value={data?.pctRatingChange ?? ""} readOnly />
//             </FormSection>

//             <FormSection title="Affirmative Action Data">
//               <FormInput label="Affirmative Action Plan" value={data?.aaPlan ?? ""} />
//               <FormInput label="Job Category" value={data?.jobCategory ?? ""} />
//               <FormInput label="EEO Code" value={data?.eeoCode ?? ""} readOnly />
//               <div className="ml-[90px] space-y-1 py-1">
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" checked={data?.effIsHire === true || data?.effIsHire === 'Y'} onChange={(e) => onChange(currentKey, 'effIsHire', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//                   <label className="text-[10px] text-gray-700">Effective Date is Hire Date</label>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" checked={data?.effIsTerm === true || data?.effIsTerm === 'Y'} onChange={(e) => onChange(currentKey, 'effIsTerm', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//                   <label className="text-[10px] text-gray-700">Effective Date is Term Date</label>
//                 </div>
//               </div>
//               <FormInput label="California Pay Data Reporting Remote Worker Status" type="select" value={data?.remoteStatus ?? ""} options={[{label: "Does not work remotely", value: "none"}, {label: "Works Remotely", value: "remote"}]} optionLabel="label" optionValue="value" />
//               <div className="mt-2">
//                 <label className="text-[10px] font-semibold text-gray-800 block mb-1">Comments</label>
//                 <textarea className="w-full h-20 p-2 border border-gray-300 rounded text-xs outline-none focus:border-[#17414d]" value={data?.hrComments ?? ""} onChange={(e) => onChange(currentKey, 'hrComments', e.target.value)} />
//               </div>
//             </FormSection>
//           </div>
//         )}

//         {activeSub === "Comments" && (
//           <div className="p-2">
//             <FormSection title="Comments">
//               <div className="relative group">
//                 <textarea className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d] transition-all resize-none bg-white shadow-inner" placeholder="Enter additional salary or HR comments here..." value={data?.salaryComments ?? ""} onChange={(e) => onChange(currentKey, 'salaryComments', e.target.value)} />
//               </div>
//             </FormSection>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export const LeaveBalancesTab = ({ data, onChange, isFormView, setConfig }) => {
//   const currentKey = getRowKey(data);

//   useEffect(() => {
//     if (setConfig) {
//       setConfig({
//         key: "leaveBalanceRecords",
//         cols: leaveBalancesTableColumns
//       });
//     }
//   }, [setConfig]);

//   if (!isFormView) {
//     return (
//       <div className="p-2">
//         <ReusableTable data={data.leaveBalanceRecords || []} columns={leaveBalancesTableColumns} onFieldChange={onChange} maxHeight="max-h-48" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 p-2">
//       <FormSection title="Leave Type">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="space-y-1">
//             <FormInput label="Leave Type *" value={data.leaveType || ""} onChange={(e) => onChange(currentKey, 'leaveType', e.target.value)} />
//             <FormInput label="Leave Year *" value={data.leaveYear || ""} onChange={(e) => onChange(currentKey, 'leaveYear', e.target.value)} />
//           </div>
//           <div className="flex items-center gap-2 pl-4">
//             <input type="checkbox" checked={data.payoutLeave === true || data.payoutLeave === "Y"} onChange={(e) => onChange(currentKey, 'payoutLeave', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//             <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Payout Leave Type</label>
//           </div>
//         </div>
//       </FormSection>

//       <FormSection title="Beginning Balances">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="space-y-1">
//             <FormInput label="Hours" value={data.hours || ""} onChange={(e) => onChange(currentKey, 'hours', e.target.value)} />
//             <FormInput label="Transaction Amount" value={data.transAmount || ""} readOnly className="bg-gray-100" />
//             <FormInput label="Amount" value={data.amount || ""} onChange={(e) => onChange(currentKey, 'amount', e.target.value)} />
//           </div>
//           <div className="space-y-1">
//             <FormInput label="Deferred Hours" value={data.defHours || ""} onChange={(e) => onChange(currentKey, 'defHours', e.target.value)} />
//             <FormInput label="Deferred Transaction Amount" value={data.defTransAmount || ""} readOnly className="bg-gray-100" />
//             <FormInput label="Deferred Amount" value={data.defAmount || ""} onChange={(e) => onChange(currentKey, 'defAmount', e.target.value)} />
//           </div>
//           <div className="space-y-1">
//             <FormInput label="Lost Hours" value={data.lostHours || ""} onChange={(e) => onChange(currentKey, 'lostHours', e.target.value)} />
//             <FormInput label="Lost Transaction Amount" value={data.lostTransAmount || ""} readOnly className="bg-gray-100" />
//             <FormInput label="Lost Amount" value={data.lostAmount || ""} onChange={(e) => onChange(currentKey, 'lostAmount', e.target.value)} />
//           </div>
//         </div>
//       </FormSection>

//       <FormSection title="Balance Transfer Information">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="space-y-1">
//             <FormInput label="New Leave Type" value={data.newLeaveType || ""} onChange={(e) => onChange(currentKey, 'newLeaveType', e.target.value)} />
//             <FormInput label="New Leave Code" value={data.newLeaveCode || ""} onChange={(e) => onChange(currentKey, 'newLeaveCode', e.target.value)} />
//             <FormInput label="Leave Period End Date" type="date" value={data.leavePeriodEndDate || ""} onChange={(e) => onChange(currentKey, 'leavePeriodEndDate', e.target.value)} />
//           </div>
//           <div className="flex items-center gap-2 pl-4">
//             <input type="checkbox" checked={data.leaveTransferred === true || data.leaveTransferred === "Y"} onChange={(e) => onChange(currentKey, 'leaveTransferred', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//             <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Leave Type Transferred</label>
//           </div>
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// export const LeaveMainTab = ({ data, onChange, isFormView, setConfig }) => {
//   const currentKey = getRowKey(data);

//   useEffect(() => {
//     if (setConfig) {
//       setConfig({
//         key: "leaveRecords",
//         cols: leaveTableColumns
//       });
//     }
//   }, [setConfig]);

//   if (!isFormView) {
//     return (
//       <div className="p-2">
//         <ReusableTable data={data.leaveRecords || []} columns={leaveTableColumns} onFieldChange={onChange} maxHeight="max-h-48" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 p-2">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FormSection title="Leave Type">
//           <FormInput label="Leave Type *" value={data.leaveType || ""} onChange={(e) => onChange(currentKey, 'leaveType', e.target.value)} />
//           <div className="ml-[90px] space-y-1 py-1">
//             <div className="flex items-center gap-2">
//               <input type="checkbox" checked={data.trackExcess === true || data.trackExcess === 'Y'} onChange={(e) => onChange(currentKey, 'trackExcess', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//               <label className="text-[10px] text-gray-700">Used to track excess leave</label>
//             </div>
//             <div className="flex items-center gap-2">
//               <input type="checkbox" checked={data.suppComp === true || data.suppComp === 'Y'} onChange={(e) => onChange(currentKey, 'suppComp', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//               <label className="text-[10px] text-gray-700">Used for mandatory leave with supplemental compensation</label>
//             </div>
//             <div className="flex items-center gap-2">
//               <input type="checkbox" checked={data.annYearLimit === true || data.annYearLimit === 'Y'} onChange={(e) => onChange(currentKey, 'annYearLimit', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//               <label className="text-[10px] text-gray-700">Annual accrual limit is based on anniversary year</label>
//             </div>
//           </div>
//           <FormInput label="Leave Code *" value={data.leaveCode || ""} />
//           <FormInput label="Leave Hire Date" type="date" value={data.leaveHireDate || ""} />
//         </FormSection>

//         <div className="space-y-2">
//           <FormSection title="Deferred Leave">
//             <FormInput label="Deferred Beginning Balance" value={data.defBegBal || ""} readOnly className="bg-gray-100" />
//             <FormInput label="YTD Deferred" value={data.ytdDeferred || ""} readOnly className="bg-gray-100" />
//           </FormSection>
//           <FormSection title="Lost Leave">
//             <FormInput label="Lost Beginning Balance" value={data.lostBegBal || ""} readOnly className="bg-gray-100" />
//             <FormInput label="YTD Lost" value={data.ytdLost || ""} readOnly className="bg-gray-100" />
//             <FormInput label="Cumulative Lost" value={data.cumLost || ""} readOnly className="bg-gray-100" />
//           </FormSection>
//         </div>

//         <FormSection title="Accrual Rate">
//           <FormInput label="Rate" value={data.rate || ""} readOnly className="bg-gray-100" />
//           <FormInput label="Estimated Accrual" value={data.estAccrual || ""} readOnly className="bg-gray-100" />
//         </FormSection>

//         <FormSection title="Anniversary Year Accrual">
//           <FormInput label="Start Date" type="date" value={data.annStartDate || ""} readOnly className="bg-gray-100" />
//           <FormInput label="End Date" type="date" value={data.annEndDate || ""} readOnly className="bg-gray-100" />
//           <FormInput label="Anniversary Year Accrued" value={data.annYearAccrued || ""} readOnly className="bg-gray-100" />
//         </FormSection>

//         <FormSection title="Leave Balance">
//           <FormInput label="Beginning Balance" value={data.begBal || ""} readOnly className="bg-gray-100" />
//           <FormInput label="YTD Accrued" value={data.ytdAccrued || ""} readOnly className="bg-gray-100" />
//           <FormInput label="YTD Used" value={data.ytdUsed || ""} readOnly className="bg-gray-100" />
//           <FormInput label="Current Balance" value={data.currentBalance || ""} readOnly className="bg-gray-100 text-blue-600 font-bold" />
//         </FormSection>

//         <div className="flex items-center justify-center p-4 border border-gray-100 rounded-xl text-gray-400 italic text-[10px]">
//           (Reserved for future use)
//         </div>
//       </div>
//     </div>
//   );
// };

// export const GenericPlaceholderTab = ({ title }) => (
//   <div className="p-8 text-center text-gray-500 italic text-xs">
//     {title} functionality coming soon...
//   </div>
// );

// export const SalaryLeaveNestedContainer = ({ activeTab, data, onChange, handleClose }) => {
//   const [isNestedFormView, setIsNestedFormView] = useState(false);

//   const [activeConfig, setActiveConfig] = useState({ key: null, cols: [] });

//   // const [activeConfig, setActiveConfig] = useState({ key: null, cols: [] });
//   const currentKey = getRowKey(data);

//   // 1. Centralized Tab Configuration
//   // This maps each tab to its specific data array key and column definition
//   const tabConfigs = useMemo(() => ({
//     "Salary Details": { key: "labors", cols: salaryTableColumns },
//     "Leave Beginning Balances": { key: "leaveBalanceRecords", cols: leaveBalancesTableColumns },
//     "Leave": { key: "leaveRecords", cols: leaveTableColumns },
//     "Allowance Details": { key: "allowances", cols: [] }, // Add actual columns when ready
//     "Taxes": { key: "taxes", cols: [] },
//     "Deductions": { key: "deductions", cols: [] },
//     "Saving Bonds": { key: "bonds", cols: [] },
//     "User-Defined Info": { key: "userDefined", cols: [] },
//     "Additional Address": { key: "additionalAddresses", cols: [] },
//     "Citizenship": { key: "citizenship", cols: [] },
//     "Phone": { key: "phones", cols: [] },
//     "Additional Default Pay Types": { key: "payTypes", cols: [] }
//   }), []);

//   const currentConfig = tabConfigs[activeTab] || { key: null, cols: [] };

//    // Generic Add Handler using the dynamic config
//   const handleNestedAdd = () => {
//     const { key: listKey } = activeConfig;
//     if (!listKey) return;

//     const newListEntry = {
//       tempId: `NEW_${listKey.toUpperCase()}_${Date.now()}`,
//       isDirty: true,
//       emplId: data.emplId || ""
//     };

//     const existingList = Array.isArray(data[listKey]) ? data[listKey] : [];
//     onChange(currentKey, listKey, [newListEntry, ...existingList]);
//     // setIsNestedFormView(true); // Open form immediately
//   };

//   const handleNestedFindReplace = (config, isReplaceMode) => {
//     const { column, findYear, replaceValue } = config;
//     // FIX: Use activeConfig.key so it targets the correct array (e.g., allowanceRecords)
//     const listKey = activeConfig.key;

//     if (!isReplaceMode || !listKey || !data[listKey]) return;

//     const updatedList = data[listKey].map(item => {
//       if (String(item[column] || "").toLowerCase().includes(String(findYear).toLowerCase())) {
//         return { ...item, [column]: replaceValue, isDirty: true };
//       }
//       return item;
//     });
//     onChange(currentKey, listKey, updatedList);
//   };

// //  const handleNestedFindReplace = (config, isReplaceMode) => {
// //     const { column, findYear, replaceValue } = config;
// //     // Use activeConfig.key so it works for the separate files too
// //     const listKey = activeConfig.key;

// //     if (!isReplaceMode || !listKey || !data[listKey]) return;

// //     const updatedList = data[listKey].map(item => {
// //       // Use case-insensitive matching for better search
// //       if (String(item[column] || "").toLowerCase().includes(String(findYear).toLowerCase())) {
// //         return { ...item, [column]: replaceValue, isDirty: true };
// //       }
// //       return item;
// //     });
// //     onChange(currentKey, listKey, updatedList);
// //   };

//   // const handleNestedFindReplace = (config, isReplaceMode) => {
//   //   const { column, findYear, replaceValue } = config;
//   //   const { key: listKey } = activeConfig;
//   //   if (!isReplaceMode || !listKey || !data[listKey]) return;

//   //   const updatedList = data[listKey].map(item => {
//   //     if (String(item[column] || "").toLowerCase().includes(String(findYear).toLowerCase())) {
//   //       return { ...item, [column]: replaceValue, isDirty: true };
//   //     }
//   //     return item;
//   //   });
//   //   onChange(currentKey, listKey, updatedList);
//   // };

//   // 4. Dynamic Content Renderer
//   const renderContent = () => {
//     const props = { data, onChange, isFormView: isNestedFormView, setConfig: setActiveConfig };

//     switch (activeTab) {
//       case "Salary Details": return <SalaryDetailsTab {...props} />;
//       case "Leave Beginning Balances": return <LeaveBalancesTab {...props} />;
//       case "Leave": return <LeaveMainTab {...props} />;
//       case "Allowance Details": return <AllowanceDetailsTab {...props} />;
//       case "Taxes": return <TaxesDetailsTab {...props} />;
//       case "Deductions": return <DeductionsDetailsTab {...props} />;
//       case "Saving Bonds": return <SavingBondsDetailsTab {...props} />;
//       case "User-Defined Info": return <UserDefinedInfoDetailsTab {...props} />;
//       case "Additional Address": return <AdditionalAddressDetailsTab {...props} />;
//       case "Citizenship": return <CitizenshipDetailsTab {...props} />;
//       case "Phone": return <PhoneDetailsTab {...props} />;
//       case "Additional Default Pay Types": return <AdditionalPayTypesDetailsTab {...props} />;
//       default: return <GenericPlaceholderTab title={activeTab} />;
//     }
//   };

//   return (
//     <SecondaryContainer
//       title={`Manage Employee Information > ${activeTab}`}
//       handleClose={handleClose}

//     >
//       <Toolbar
//         isFormView={isNestedFormView}
//         // columns={currentConfig.cols}
//         columns={activeConfig.cols}
//         handleFindReplace={handleNestedFindReplace}
//         actions={{
//           onAdd: handleNestedAdd,
//           onToggleView: () => setIsNestedFormView(!isNestedFormView),
//           onSave: () => console.log(`Save triggered for ${activeTab}`)
//           // onCopy: () => {},
//           // onDelete: () => {}
//         }}
//         selectedRow={data}
//       />

//       <div className="bg-white min-h-[200px] p-2 border-t border-gray-200">
//         {renderContent()}
//       </div>
//     </SecondaryContainer>
//   );
// };

// import React, { useState, useMemo, useEffect } from "react";
// import { FormSection, FormInput } from "../helper/formSection";
// import { SecondaryContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { User, Plus, FileText, MapPin, DollarSign, Calendar, MessageSquare, Briefcase } from "lucide-react";
// import AllowanceDetailsTab from "./AllowanceDetails";
// import TaxesDetailsTab from "./TaxesDetails";
// import DeductionsDetailsTab from "./DeductionsDetails";
// import SavingBondsDetailsTab from "./SavingBondsDetails";
// import UserDefinedInfoDetailsTab from "./UserDefinedInfoDetails";
// import AdditionalAddressDetailsTab from "./AdditionalAddressDetails";
// import CitizenshipDetailsTab from "./CitizenshipDetails";
// import PhoneDetailsTab from "./PhoneDetails";
// import AdditionalPayTypesDetailsTab from "./AdditionalPayTypesDetails";

// // --- COLUMN DEFINITIONS ---
// const salaryTableColumns = [
//   { value: "effDate", label: "Effective Date *", key: "effDate", type: "date" },
//   { value: "workHours", label: "Work Hours *", key: "workHours" },
//   { value: "hourlyAmount", label: "Hourly Amount", key: "hourlyAmount" },
//   { value: "annualAmount", label: "Annual Amount", key: "annualAmount" },
//   { value: "homeOrg", label: "Home Organization *", key: "homeOrg" },
//   { value: "glc", label: "GLC *", key: "glc" },
//   { value: "manager", label: "Manager", key: "manager" },
//   { value: "compPlan", label: "Compensation Plan", key: "compPlan" },
//   { value: "step", label: "Step", key: "step" },
//   { value: "grade", label: "Grade", key: "grade" },
//   { value: "reviewForm", label: "Review Form", key: "reviewForm" },
//   { value: "rating", label: "Rating", key: "rating" },
//   { value: "pctGradeChange", label: "Percent Grade Change", key: "pctGradeChange" },
//   { value: "pctRatingChange", label: "Percent Rating Change", key: "pctRatingChange" },
//   { value: "aaPlan", label: "Affirmative Action Plan", key: "aaPlan" },
//   { value: "jobCategory", label: "Job Category", key: "jobCategory" },
//   { value: "eeoCode", label: "EEO Code", key: "eeoCode" },
//   { value: "remoteStatus", label: "Remote Worker Status", key: "remoteStatus" },
//   { value: "salaryComments", label: "Comments", key: "salaryComments" },
//   { value: "endDate", label: "End Date", key: "endDate", type: "date" },
//   { value: "flsa", label: "FLSA Classification", key: "flsa" },
//   { value: "seasonalFl", label: "Seasonal Employee", key: "seasonalFl", type: "flag" },
//   { value: "variableHoursFl", label: "Variable Hours Employee", key: "variableHoursFl", type: "flag" },
//   { value: "pa1", label: "Personal Action 1", key: "pa1" },
//   { value: "pa2", label: "Personal Action 2", key: "pa2" },
//   { value: "pa3", label: "Personal Action 3", key: "pa3" },
//   { value: "timeCollection", label: "Time Collection", key: "timeCollection" },
//   { value: "refNo1", label: "Ref No 1", key: "refNo1" },
//   { value: "refNo2", label: "Ref No 2", key: "refNo2" },
//   { value: "titleDesc", label: "Detail Job Title", key: "titleDesc" },
//   { value: "corpOfficerFl", label: "Corporate Officer", key: "corpOfficerFl", type: "flag" },
//   { value: "supervisorId", label: "Supervisor", key: "supervisorId" },
//   { value: "step", label: "Step", key: "step" },
//   { value: "grade", label: "Grade", key: "grade" },
//   { value: "reviewForm", label: "Review Form", key: "reviewForm" },
//   { value: "rating", label: "Rating", key: "rating" },
//   { value: "pctGradeChange", label: "Percent Grade Change", key: "pctGradeChange" },
//   { value: "pctRatingChange", label: "Percent Rating Change", key: "pctRatingChange" },
//   { value: "aaPlan", label: "Affirmative Action Plan", key: "aaPlan" },
//   { value: "jobCategory", label: "Job Category", key: "jobCategory" },
//   { value: "eeoCode", label: "EEO Code", key: "eeoCode" },
//   { value: "effIsHire", label: "Eff Dt is Hire Dt", key: "effIsHire", type: "flag" },
//   { value: "effIsTerm", label: "Eff Dt is Term Dt", key: "effIsTerm", type: "flag" },
//   { value: "remoteStatus", label: "Remote Status", key: "remoteStatus" },
//   { value: "hrComments", label: "HR Comments", key: "hrComments" },
// ];

// const leaveBalancesTableColumns = [
//   { value: "leaveType", label: "Leave Type *", key: "leaveType" },
//   { value: "leaveYear", label: "Leave Year *", key: "leaveYear" },
//   { value: "hours", label: "Hours", key: "hours" },
//   { value: "transactionAmount", label: "Transaction Amount", key: "transactionAmount" },
//   { value: "amount", label: "Amount", key: "amount" },
//   { value: "deferredHours", label: "Deferred Hours", key: "deferredHours" },
//   { value: "lostHours", label: "Lost Hours", key: "lostHours" },
//   { value: "newLeaveType", label: "New Leave Type", key: "newLeaveType" },
// ];

// const leaveTableColumns = [
//   { value: "leaveType", label: "Leave Type *", key: "leaveType" },
//   { value: "leaveCode", label: "Leave Code *", key: "leaveCode" },
//   { value: "leaveHireDate", label: "Leave Hire Date", key: "leaveHireDate", type: "date" },
//   { value: "rate", label: "Rate", key: "rate" },
//   { value: "currentBalance", label: "Current Balance", key: "currentBalance" },
//   { value: "ytdAccrued", label: "YTD Accrued", key: "ytdAccrued" },
//   { value: "ytdUsed", label: "YTD Used", key: "ytdUsed" },
//   { value: "ytdDeferred", label: "YTD Deferred", key: "ytdDeferred" },
//   { value: "ytdLost", label: "YTD Lost", key: "ytdLost" },
// ];

// // --- STABLE KEY HELPER ---
// const getRowKey = (row) => {
//   if (!row) return "";
//   return String(row.tempId || row.emplId || row.id || "");
// };

// // --- 1. EMPLOYEE INFO TAB ---
// export const EmployeeInfoTab = ({ data, onChange }) => {
//     const currentKey = getRowKey(data);
//   //  const currentKey = String(data?.emplId || data?.tempId || data?.id || "");

//   // console.log("Rendering EmployeeInfoTab for key:", currentKey);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <FormSection title="Identity">
//           <FormInput label="Social Security No *" value={data?.ssnId || ""} onChange={(e) => onChange(currentKey, "ssnId", e.target.value)} />
//           <FormInput label="Status *" value={data?.sEmplStatusCd || ""} onChange={(e) => onChange(currentKey, "sEmplStatusCd", e.target.value)} />
//           <FormInput label="Last Name *" value={data.lastName || ""} onChange={(e) => {
//               // Explicitly pass the key we just calculated
//               onChange(currentKey, "lastName", e.target.value);
//             }}  />
//             {/* onChange={(e) =>  onChange(currentKey, "lastName", e.target.value)} */}
//           <FormInput label="First Name *" value={data.firstName || ""} onChange={(e) => onChange(currentKey, "firstName", e.target.value)} />
//           <FormInput label="Middle Name" value={data.midName || ""} onChange={(e) => onChange(currentKey, "midName", e.target.value)} />
//           <FormInput label="Suffix" value={data.nameSfxCd || ""} onChange={(e) => onChange(currentKey, "nameSfxCd", e.target.value)} />
//           <FormInput label="Displayed Name" value={data.prefName || ""} onChange={(e) => onChange(currentKey, "prefName", e.target.value)} />
//           <FormInput label="Birth Date" type="date" value={data?.birthDt?.split('T')[0] ?? ""} onChange={(e) => onChange(currentKey, "birthDt", e.target.value)}/>
//         </FormSection>

//         <FormSection title="Hire Details">
//           <FormInput label="Current Hire Date *" type="date" value={data?.origHireDt || ""} onChange={(e) => onChange(currentKey, "origHireDt", e.target.value)} />
//           <FormInput label="Termination Date" type="date" value={data?.termDt || ""} onChange={(e) => onChange(currentKey, "termDt", e.target.value)} />
//           <FormInput label="Last Day Worked" type="date" value={data?.lastDayDt || ""} readOnly />
//           <FormInput label="Past Hire Date" type="date" value={data?.adjHireDt || ""} onChange={(e) => onChange(currentKey, "adjHireDt", e.target.value)} />
//           <FormInput label="Taxable Entity *" value={data?.taxbleEntityId || ""} onChange={(e) => onChange(currentKey, "taxbleEntityId", e.target.value)} />
//           <FormInput label="Timesheet Cycle *" value={data?.tsPdCd || ""} onChange={(e) => onChange(currentKey, "tsPdCd", e.target.value)} />
//           <FormInput label="Leave Cycle" value={data?.lvPdCd || ""} onChange={(e) => onChange(currentKey, "lvPdCd", e.target.value)} />
//         </FormSection>

//         <FormSection title="Administration">
//           <FormInput label="Locator Code" value={data?.locatorCd || ""} onChange={(e) => onChange(currentKey, "locatorCd", e.target.value)} />
//           <FormInput label="Administrator Name" value={data?.spvsrName || ""} onChange={(e) => onChange(currentKey, "spvsrName", e.target.value)} />
//           <FormInput label="Preferred Name" value={data?.prefName || ""} onChange={(e) => onChange(currentKey, "prefName", e.target.value)} />
//           <FormInput label="Prefix" value={data?.namePrfxCd || ""} onChange={(e) => onChange(currentKey, "namePrfxCd", e.target.value)} />
//           <FormInput label="Prior Name" value={data?.prirName || ""} onChange={(e) => onChange(currentKey, "prirName", e.target.value)} />
//           <FormInput label="Eligible for Auto-Pay" type="checkbox" checked={data?.eligAutoPayFl === true || data?.eligAutoPayFl === "Y"} onChange={(e) => onChange(currentKey, "eligAutoPayFl",e.target.checked  )} />
//           <FormInput label="Vendor" value={data?.companyId || ""} readOnly />
//         </FormSection>
//       </div>
//     </div>
//   );
// };

// // --- 2. HR DATA TAB ---
// export const HrDataTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <FormSection title="Demographics">
//           <FormInput label="Gender" value={data.sexCd || ""} onChange={(e) => onChange(currentKey, "sexCd", e.target.value)} />
//           <FormInput label="Marital Status" value={data.maritalCd || ""} onChange={(e) => onChange(currentKey, "maritalCd", e.target.value)} />
//           <FormInput label="Race" value={data.sRaceCd || ""} onChange={(e) => onChange(currentKey, "sRaceCd", e.target.value)} />
//           <FormInput label="Race Description" value={data.raceDescription || ""} onChange={(e) => onChange(currentKey, "raceDescription", e.target.value)} />
//           <FormInput label="Visa Type" value={data.visaTypeCd || ""} onChange={(e) => onChange(currentKey, "visaTypeCd", e.target.value)} />
//           <FormInput label="Visa Date" type="date" value={data.visaDt || ""} onChange={(e) => onChange(currentKey, "visaDt", e.target.value)} />
//           <FormInput label="Last Review Date" type="date" value={data.lastReviewDt || ""} onChange={(e) => onChange(currentKey, "lastReviewDt", e.target.value)} />
//           <FormInput label="Next Review Date" type="date" value={data.nextReviewDt || ""} onChange={(e) => onChange(currentKey, "nextReviewDt", e.target.value)} />
//           <FormInput label="Birth City" value={data.birthCityName || ""} onChange={(e) => onChange(currentKey, "birthCityName", e.target.value)} />
//           <FormInput label="Birth State/Province" value={data.birthMailStateDc || ""} onChange={(e) => onChange(currentKey, "birthMailStateDc", e.target.value)} />
//           <FormInput label="Birth Country" value={data.birthCountryCd || ""} onChange={(e) => onChange(currentKey, "birthCountryCd", e.target.value)} />
//         </FormSection>

//         <FormSection title="VETS-4212, Disability, Veteran Status">
//           <FormInput label="Disabled" type="checkbox" checked={data?.disabledFl === true || data?.disabledFl === "Y"} onChange={(e) => onChange(currentKey, "disabledFl", e.target.checked)} />
//           <FormInput label="Blind" type="checkbox" checked={data?.blindFl === true || data?.blindFl === "Y"} onChange={(e) => onChange(currentKey, "blindFl", e.target.checked)} />
//           <div className="mt-4 p-3 border border-gray-200 rounded-lg text-[10px]">
//             <label className="font-bold text-[#17414d] block mb-2 uppercase">Protected Veteran Status</label>
//             <FormInput label="Disabled Veteran" type="checkbox" checked={data?.vetStatusD === true || data?.vetStatusD === "Y"} onChange={(e) => onChange(currentKey, "vetStatusD", e.target.checked)} />
//             <FormInput label="Active Duty Wartime" type="checkbox" checked={data?.vetStatusA === true || data?.vetStatusA === "Y"} onChange={(e) => onChange(currentKey, "vetStatusA", e.target.checked)} />
//             <FormInput label="Armed Forces Service Medal Veteran" type="checkbox" checked={data?.vetStatusV === true || data?.vetStatusV === "Y"} onChange={(e) => onChange(currentKey, "vetStatusV", e.target.checked)} />
//             <FormInput label="Recently Separated Veteran" type="checkbox" checked={data?.vetStatusRs === true || data?.vetStatusRs === "Y"} onChange={(e) => onChange(currentKey, "vetStatusRs", e.target.checked)} />
//             <FormInput label="Discharge/Release Date" type="date" value={data?.vetReleaseDt || ""} onChange={(e) => onChange(currentKey, "vetReleaseDt", e.target.value)} />
//             <FormInput label="Protected Veteran" type="checkbox" checked={data?.vetStatusP === true || data?.vetStatusP === "Y"} onChange={(e) => onChange(currentKey, "vetStatusP", e.target.checked)} />
//             <FormInput label="Not a Protected Veteran" type="checkbox" checked={data?.vetStatusNp === true || data?.vetStatusNp === "Y"} onChange={(e) => onChange(currentKey, "vetStatusNp", e.target.checked)} />
//             <FormInput label="Declined to provide veteran status" type="checkbox" checked={data?.vetStatusDeclined === true || data?.vetStatusDeclined === "Y"} onChange={(e) => onChange(currentKey, "vetStatusDeclined", e.target.checked)} />
//           </div>
//         </FormSection>
//       </div>
//     </div>
//   );
// };

// // --- 3. ADDRESS/CONTACT TAB ---
// export const AddressContactTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 gap-6">
//         <FormSection title="Mailing Address">
//           <FormInput label="Line 1" value={data?.ln1Adr || ""} onChange={(e) => onChange(currentKey, "ln1Adr", e.target.value)} />
//           <FormInput label="Line 2" value={data?.ln2Adr || ""} onChange={(e) => onChange(currentKey, "ln2Adr", e.target.value)} />
//           <FormInput label="Line 3" value={data?.ln3Adr || ""} onChange={(e) => onChange(currentKey, "ln3Adr", e.target.value)} />
//           <FormInput label="City" value={data?.cityName || ""} onChange={(e) => onChange(currentKey, "cityName", e.target.value)} />
//           <FormInput label="State/Province" value={data?.mailStateDc || ""} onChange={(e) => onChange(currentKey, "mailStateDc", e.target.value)} />
//           <FormInput label="Postal Code" value={data?.postalCd || ""} onChange={(e) => onChange(currentKey, "postalCd", e.target.value)} />
//           <FormInput label="Country" value={data?.countryCd || ""} onChange={(e) => onChange(currentKey, "countryCd", e.target.value)} />
//         </FormSection>

//         <div className="space-y-6">
//           <FormSection title="Emergency Contact 1">
//             <FormInput label="Contact Name 1" value={data?.contName1 || ""} onChange={(e) => onChange(currentKey, "contName1", e.target.value)} />
//             <FormInput label="Contact Phone 1" value={data?.contPhone1 || ""} onChange={(e) => onChange(currentKey, "contPhone1", e.target.value)} />
//             <FormInput label="Relationship 1" value={data?.contRel1 || ""} onChange={(e) => onChange(currentKey, "contRel1", e.target.value)} />
//             <FormInput label="Notify on Arrest 1" type="checkbox" checked={data?.contactArrest1 === true || data?.contactArrest1 === "Y"} onChange={(e) => onChange(currentKey, "contactArrest1", e.target.checked)} />
//           </FormSection>

//           <FormSection title="Emergency Contact 2">
//             <FormInput label="Contact Name 2" value={data?.contName2 || ""} onChange={(e) => onChange(currentKey, "contName2", e.target.value)} />
//             <FormInput label="Contact Phone 2" value={data?.contPhone2 || ""} onChange={(e) => onChange(currentKey, "contPhone2", e.target.value)} />
//             <FormInput label="Relationship 2" value={data?.contRel2 || ""} onChange={(e) => onChange(currentKey, "contRel2", e.target.value)} />
//             <FormInput label="Notify on Arrest 2" type="checkbox" checked={data?.contactArrest2 === true || data?.contactArrest2 === "Y"} onChange={(e) => onChange(currentKey, "contactArrest2", e.target.checked)} />
//           </FormSection>
//         </div>
//       </div>

//       <FormSection title="Email Addresses">
//         <div className="grid grid-cols-2 gap-4">
//           <FormInput label="Work Email" value={data?.emailId || ""} onChange={(e) => onChange(currentKey, "emailId", e.target.value)} />
//           <FormInput label="Personal Email" value={data?.homeEmailId || ""} onChange={(e) => onChange(currentKey, "homeEmailId", e.target.value)} />
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// // --- 4. TIMESHEET DEFAULTS TAB ---
// export const TimesheetDefaultsTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <FormSection title="Default Allocations">
//         <div className="grid grid-cols-2 gap-x-8 gap-y-4">
//           <FormInput label="Account" value={data?.tsDefaultAccount || ""} onChange={(e) => onChange(currentKey, "tsDefaultAccount", e.target.value)} />
//           <FormInput label="Organization" value={data?.tsDefaultOrg || ""} onChange={(e) => onChange(currentKey, "tsDefaultOrg", e.target.value)} />
//           <FormInput label="Project" value={data?.tsDefaultProject || ""} onChange={(e) => onChange(currentKey, "tsDefaultProject", e.target.value)} />
//           <FormInput label="GLC" value={data?.tsDefaultGLC || ""} onChange={(e) => onChange(currentKey, "tsDefaultGLC", e.target.value)} />
//           <FormInput label="Pay Type" value={data?.tsDefaultPayType || ""} onChange={(e) => onChange(currentKey, "tsDefaultPayType", e.target.value)} />
//           <FormInput label="Labor Location" value={data?.tsDefaultLaborLocation || ""} onChange={(e) => onChange(currentKey, "tsDefaultLaborLocation", e.target.value)} />
//           <FormInput label="Workers' Comp" value={data?.tsDefaultWorkerComp || ""} onChange={(e) => onChange(currentKey, "tsDefaultWorkerComp", e.target.value)} />
//           <FormInput label="Ref No 1" value={data?.tsDefaultRefNo1 || ""} onChange={(e) => onChange(currentKey, "tsDefaultRefNo1", e.target.value)} />
//           <FormInput label="Ref No 2" value={data?.tsDefaultRefNo2 || ""} onChange={(e) => onChange(currentKey, "tsDefaultRefNo2", e.target.value)} />
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// // --- 5. PRODUCT INTERFACE TAB ---
// export const ProductInterfaceTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <FormSection title="Interface Mapping Details">
//         <div className="grid grid-cols-2 gap-6">
//           <FormInput label="Payroll Service ID" value={data?.prServEmplId || ""} onChange={(e) => onChange(currentKey, "prServEmplId", e.target.value)} />
//           <div className="mt-4 border border-gray-200 p-3 rounded bg-gray-50/30 col-span-2">
//             <label className="text-[10px] font-bold text-[#17414d] block mb-2 uppercase">Project Manufacturing</label>
//             <FormInput label="Plant" value={data?.plantId || ""} onChange={(e) => onChange(currentKey, "plantId", e.target.value)} />
//           </div>
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// // --- 6. NOTES TAB ---
// export const NotesTab = ({ data, onChange }) => {
//   const currentKey = getRowKey(data);

//   return (
//     <div className="space-y-6">
//       <FormSection title="General Employee Notes">
//         <textarea
//           className="w-full h-48 p-3 border border-gray-300 rounded-lg text-xs focus:border-[#17414d] outline-none"
//           value={data.notes || ""}
//           onChange={(e) => onChange(currentKey, "notes", e.target.value)}
//           placeholder="Enter notes here..."
//         />
//       </FormSection>
//     </div>
//   );
// };

// // --- BOTTOM NESTED COMPONENTS ---
// export const SalaryDetailsTab = ({ data, onChange, isFormView, setConfig }) => {
//   const [activeSub, setActiveSub] = useState("Salary Info");

//   const laborData = data?.labors ?? [];
//   const activeLabor = laborData[0] ?? {};
//   const currentKey = getRowKey(data);

//   useEffect(() => {
//     if (setConfig) {
//       setConfig({
//         key: "labors", // Key in the data object
//         cols: salaryTableColumns
//       });
//     }
//   }, [setConfig]);

//   // Helper to add a new labor row
//   const handleAddLabor = () => {
//     const newLabor = {
//       tempId: `NEW_LABOR_${Date.now()}`,
//       effectDt: new Date().toISOString().split('T')[0],
//       orgId: data.tsDefaultOrg || "",
//       genlLabCatCd: data.tsDefaultGLC || "",
//       isDirty: true
//     };

//     // We update the parent state by appending to the 'labors' array
//     onChange(currentKey, "labors", [newLabor, ...laborData]);
//   };

//   const handleFindReplaceSalary = (config, isReplaceMode) => {
//     const { column, findYear, replaceValue } = config;
//     if (!isReplaceMode) return; // Simple local replace for now

//     const updatedLabors = laborData.map(l => {
//       const currentVal = String(l[column] || "");
//       if (currentVal.includes(findYear)) {
//         return { ...l, [column]: replaceValue, isDirty: true };
//       }
//       return l;
//     });
//     onChange(currentKey, "labors", updatedLabors);
//   };

//   if (!isFormView) {
//     return (
//       <div className="p-2">
//         <ReusableTable
//           data={laborData}
//           columns={salaryTableColumns}
//           onFieldChange={(rowId, field, value) => {
//             // Logic to update specific labor record within the labors array
//             const updatedLabors = laborData.map(l =>
//               getRowKey(l) === rowId ? { ...l, [field]: value, isDirty: true } : l
//             );
//             onChange(currentKey, "labors", updatedLabors);
//           }}
//           rowKey={getRowKey}
//           maxHeight="max-h-48"
//         />
//       </div>
//     );
//   }

//   // if (!isFormView) {
//   //   return (
//   //     <div className="p-2">
//   //       <ReusableTable data={laborData} columns={salaryTableColumns} onFieldChange={onChange} maxHeight="max-h-48" />
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex border-b border-gray-200 px-2 mb-4 bg-white">
//         {["Salary Info", "HR Information", "Comments"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveSub(tab)}
//             className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${activeSub === tab ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-500 hover:text-[#17414d]"}`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       <div className="p-2">
//         {activeSub === "Salary Info" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
//             <FormSection title="Compensation">
//               <FormInput label="Effective Date *" type="date" value={activeLabor.effectDt?.split('T')[0] ?? ""} onChange={(e) => onChange(currentKey, 'effDate', e.target.value)} />
//               <FormInput label="End Date" type="date" value={activeLabor.endDt?.split('T')[0] ?? ""} onChange={(e) => onChange(currentKey, 'endDate', e.target.value)} />
//               <FormInput label="Work Hours In Year *" value={activeLabor.workHours ?? "2080"} onChange={(e) => onChange(currentKey, 'workHours', e.target.value)} />
//               <FormInput label="Hourly Amount" value={activeLabor.hrlyAmt ?? ""} onChange={(e) => onChange(currentKey, 'hourlyAmount', e.target.value)} />
//               <FormInput label="Payroll Salary Amount" value={activeLabor.salAmt ?? ""} />
//               <FormInput label="Annual Amount" value={activeLabor.annlAmt ?? ""} />
//               <FormInput label="Percent of Increase" value={data?.pctIncrease ?? ""} readOnly />
//               <FormInput label="Estimated Annual Hours" value={data?.estHours ?? ""} />
//               <FormInput label="Standard Hourly Rate" value={data?.stdRate ?? ""} readOnly />
//               <FormInput label="Employee Class" value={data?.empClass ?? ""} />
//               <FormInput label="Employee Type" type="select" value={data?.empType ?? ""} options={[]} />
//               <FormInput label="Rate Type" type="select" value={activeLabor.hrlySalCd ?? ""} options={[]} />
//               <div className="flex items-center gap-4 py-1 ml-[90px]">
//                  <span className="text-[10px] font-bold text-gray-700 uppercase">FLSA Classification</span>
//                  <div className="flex gap-4">
//                    <FormInput label="Exempt" type="radio" name="flsa" checked={data?.flsa === 'Exempt'} onChange={() => onChange(currentKey, 'flsa', 'Exempt')} />
//                    <FormInput label="Non-Exempt" type="radio" name="flsa" checked={data?.flsa === 'Non-Exempt'} onChange={() => onChange(currentKey, 'flsa', 'Non-Exempt')} />
//                  </div>
//               </div>
//               <FormInput label="Seasonal Employee" type="checkbox" checked={data?.seasonalFl === true || data?.seasonalFl === 'Y'} onChange={(e) => onChange(currentKey, 'seasonalFl', e.target.checked)} />
//               <FormInput label="Variable Hours Employee" type="checkbox" checked={data?.variableHoursFl === true || data?.variableHoursFl === 'Y'} onChange={(e) => onChange(currentKey, 'variableHoursFl', e.target.checked)} />
//               <FormInput label="Detail Job Title" value={activeLabor.titleDesc ?? ""} onChange={(e) => onChange(currentKey, 'titleDesc', e.target.value)} />
//               <FormInput label="Corporate Officer" type="checkbox" checked={data?.corpOfficerFl === true || data?.corpOfficerFl === 'Y'} onChange={(e) => onChange(currentKey, 'corpOfficerFl', e.target.checked)} />
//               <FormInput label="Manager" value={data?.manager ?? ""} onChange={(e) => onChange(currentKey, 'manager', e.target.value)} />
//               <FormInput label="Supervisor" value={activeLabor.supervisorId ?? ""} onChange={(e) => onChange(currentKey, 'supervisorId', e.target.value)} />
//             </FormSection>

//             <FormSection title="Organization & Details">
//               <FormInput label="Labor Group" value={data?.laborGroup ?? ""} />
//               <FormInput label="Labor Location" value={data?.laborLocation ?? ""} />
//               <FormInput label="GLC *" value={data?.emplAcctOrgDflt?.genlLabCatCd ?? ""} />
//               <FormInput label="PLC" value={data?.plc ?? ""} />
//               <FormInput label="Overtime State *" value={data?.emplAcctOrgDflt?.whStateCd ?? ""} />
//               <FormInput label="Home Organization *" value={activeLabor.orgId ?? ""} />
//               <FormInput label="Security Organization" value={activeLabor.secOrgId ?? ""} />
//               <FormInput label="HR Organization" value={data?.hrOrg ?? ""} onChange={(e) => onChange(currentKey, 'hrOrg', e.target.value)} />
//               <FormInput label="Personal Action 1" value={data?.pa1 ?? ""} onChange={(e) => onChange(currentKey, 'pa1', e.target.value)} />
//               <FormInput label="Personal Action 2" value={data?.pa2 ?? ""} onChange={(e) => onChange(currentKey, 'pa2', e.target.value)} />
//               <FormInput label="Personal Action 3" value={data?.pa3 ?? ""} onChange={(e) => onChange(currentKey, 'pa3', e.target.value)} />
//               <FormInput label="Time Collection" value={data?.timeCollection ?? ""} onChange={(e) => onChange(currentKey, 'timeCollection', e.target.value)} />
//               <FormInput label="Work Schedule" value={data?.workSchedule ?? ""} onChange={(e) => onChange(currentKey, 'workSchedule', e.target.value)} />
//               <FormInput label="Ref No 1" value={data?.refNo1 ?? ""} onChange={(e) => onChange(currentKey, 'refNo1', e.target.value)} />
//               <FormInput label="Ref No 2" value={data?.refNo2 ?? ""} onChange={(e) => onChange(currentKey, 'refNo2', e.target.value)} />
//             </FormSection>
//           </div>
//         )}

//         {activeSub === "HR Information" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <FormSection title="Compensation Data">
//               <FormInput label="Compensation Plan" value={data?.compPlan ?? ""} onChange={(e) => onChange(currentKey, 'compPlan', e.target.value)} />
//               <FormInput label="Step" value={data?.step ?? ""} />
//               <FormInput label="Grade" value={data?.grade ?? ""} readOnly />
//               <FormInput label="Review Form" value={data?.reviewForm ?? ""} />
//               <FormInput label="Rating" value={data?.rating ?? ""} />
//               <FormInput label="Percent Grade Change" value={data?.pctGradeChange ?? ""} readOnly />
//               <FormInput label="Percent Rating Change" value={data?.pctRatingChange ?? ""} readOnly />
//             </FormSection>

//             <FormSection title="Affirmative Action Data">
//               <FormInput label="Affirmative Action Plan" value={data?.aaPlan ?? ""} />
//               <FormInput label="Job Category" value={data?.jobCategory ?? ""} />
//               <FormInput label="EEO Code" value={data?.eeoCode ?? ""} readOnly />
//               <div className="ml-[90px] space-y-1 py-1">
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" checked={data?.effIsHire === true || data?.effIsHire === 'Y'} onChange={(e) => onChange(currentKey, 'effIsHire', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//                   <label className="text-[10px] text-gray-700">Effective Date is Hire Date</label>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" checked={data?.effIsTerm === true || data?.effIsTerm === 'Y'} onChange={(e) => onChange(currentKey, 'effIsTerm', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//                   <label className="text-[10px] text-gray-700">Effective Date is Term Date</label>
//                 </div>
//               </div>
//               <FormInput label="California Pay Data Reporting Remote Worker Status" type="select" value={data?.remoteStatus ?? ""} options={[{label: "Does not work remotely", value: "none"}, {label: "Works Remotely", value: "remote"}]} optionLabel="label" optionValue="value" />
//               <div className="mt-2">
//                 <label className="text-[10px] font-semibold text-gray-800 block mb-1">Comments</label>
//                 <textarea className="w-full h-20 p-2 border border-gray-300 rounded text-xs outline-none focus:border-[#17414d]" value={data?.hrComments ?? ""} onChange={(e) => onChange(currentKey, 'hrComments', e.target.value)} />
//               </div>
//             </FormSection>
//           </div>
//         )}

//         {activeSub === "Comments" && (
//           <div className="p-2">
//             <FormSection title="Comments">
//               <div className="relative group">
//                 <textarea className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d] transition-all resize-none bg-white shadow-inner" placeholder="Enter additional salary or HR comments here..." value={data?.salaryComments ?? ""} onChange={(e) => onChange(currentKey, 'salaryComments', e.target.value)} />
//               </div>
//             </FormSection>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export const LeaveBalancesTab = ({ data, onChange, isFormView, setConfig }) => {
//   const currentKey = getRowKey(data);

//   useEffect(() => {
//     if (setConfig) {
//       setConfig({
//         key: "leaveBalanceRecords",
//         cols: leaveBalancesTableColumns
//       });
//     }
//   }, [setConfig]);

//   if (!isFormView) {
//     return (
//       <div className="p-2">
//         <ReusableTable data={data.leaveBalanceRecords || []} columns={leaveBalancesTableColumns} onFieldChange={onChange} maxHeight="max-h-48" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 p-2">
//       <FormSection title="Leave Type">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="space-y-1">
//             <FormInput label="Leave Type *" value={data.leaveType || ""} onChange={(e) => onChange(currentKey, 'leaveType', e.target.value)} />
//             <FormInput label="Leave Year *" value={data.leaveYear || ""} onChange={(e) => onChange(currentKey, 'leaveYear', e.target.value)} />
//           </div>
//           <div className="flex items-center gap-2 pl-4">
//             <input type="checkbox" checked={data.payoutLeave === true || data.payoutLeave === "Y"} onChange={(e) => onChange(currentKey, 'payoutLeave', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//             <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Payout Leave Type</label>
//           </div>
//         </div>
//       </FormSection>

//       <FormSection title="Beginning Balances">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div className="space-y-1">
//             <FormInput label="Hours" value={data.hours || ""} onChange={(e) => onChange(currentKey, 'hours', e.target.value)} />
//             <FormInput label="Transaction Amount" value={data.transAmount || ""} readOnly className="bg-gray-100" />
//             <FormInput label="Amount" value={data.amount || ""} onChange={(e) => onChange(currentKey, 'amount', e.target.value)} />
//           </div>
//           <div className="space-y-1">
//             <FormInput label="Deferred Hours" value={data.defHours || ""} onChange={(e) => onChange(currentKey, 'defHours', e.target.value)} />
//             <FormInput label="Deferred Transaction Amount" value={data.defTransAmount || ""} readOnly className="bg-gray-100" />
//             <FormInput label="Deferred Amount" value={data.defAmount || ""} onChange={(e) => onChange(currentKey, 'defAmount', e.target.value)} />
//           </div>
//           <div className="space-y-1">
//             <FormInput label="Lost Hours" value={data.lostHours || ""} onChange={(e) => onChange(currentKey, 'lostHours', e.target.value)} />
//             <FormInput label="Lost Transaction Amount" value={data.lostTransAmount || ""} readOnly className="bg-gray-100" />
//             <FormInput label="Lost Amount" value={data.lostAmount || ""} onChange={(e) => onChange(currentKey, 'lostAmount', e.target.value)} />
//           </div>
//         </div>
//       </FormSection>

//       <FormSection title="Balance Transfer Information">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="space-y-1">
//             <FormInput label="New Leave Type" value={data.newLeaveType || ""} onChange={(e) => onChange(currentKey, 'newLeaveType', e.target.value)} />
//             <FormInput label="New Leave Code" value={data.newLeaveCode || ""} onChange={(e) => onChange(currentKey, 'newLeaveCode', e.target.value)} />
//             <FormInput label="Leave Period End Date" type="date" value={data.leavePeriodEndDate || ""} onChange={(e) => onChange(currentKey, 'leavePeriodEndDate', e.target.value)} />
//           </div>
//           <div className="flex items-center gap-2 pl-4">
//             <input type="checkbox" checked={data.leaveTransferred === true || data.leaveTransferred === "Y"} onChange={(e) => onChange(currentKey, 'leaveTransferred', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//             <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">Leave Type Transferred</label>
//           </div>
//         </div>
//       </FormSection>
//     </div>
//   );
// };

// export const LeaveMainTab = ({ data, onChange, isFormView, setConfig }) => {
//   const currentKey = getRowKey(data);

//   useEffect(() => {
//     if (setConfig) {
//       setConfig({
//         key: "leaveRecords",
//         cols: leaveTableColumns
//       });
//     }
//   }, [setConfig]);

//   if (!isFormView) {
//     return (
//       <div className="p-2">
//         <ReusableTable data={data.leaveRecords || []} columns={leaveTableColumns} onFieldChange={onChange} maxHeight="max-h-48" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 p-2">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <FormSection title="Leave Type">
//           <FormInput label="Leave Type *" value={data.leaveType || ""} onChange={(e) => onChange(currentKey, 'leaveType', e.target.value)} />
//           <div className="ml-[90px] space-y-1 py-1">
//             <div className="flex items-center gap-2">
//               <input type="checkbox" checked={data.trackExcess === true || data.trackExcess === 'Y'} onChange={(e) => onChange(currentKey, 'trackExcess', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//               <label className="text-[10px] text-gray-700">Used to track excess leave</label>
//             </div>
//             <div className="flex items-center gap-2">
//               <input type="checkbox" checked={data.suppComp === true || data.suppComp === 'Y'} onChange={(e) => onChange(currentKey, 'suppComp', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//               <label className="text-[10px] text-gray-700">Used for mandatory leave with supplemental compensation</label>
//             </div>
//             <div className="flex items-center gap-2">
//               <input type="checkbox" checked={data.annYearLimit === true || data.annYearLimit === 'Y'} onChange={(e) => onChange(currentKey, 'annYearLimit', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//               <label className="text-[10px] text-gray-700">Annual accrual limit is based on anniversary year</label>
//             </div>
//           </div>
//           <FormInput label="Leave Code *" value={data.leaveCode || ""} />
//           <FormInput label="Leave Hire Date" type="date" value={data.leaveHireDate || ""} />
//         </FormSection>

//         <div className="space-y-2">
//           <FormSection title="Deferred Leave">
//             <FormInput label="Deferred Beginning Balance" value={data.defBegBal || ""} readOnly className="bg-gray-100" />
//             <FormInput label="YTD Deferred" value={data.ytdDeferred || ""} readOnly className="bg-gray-100" />
//           </FormSection>
//           <FormSection title="Lost Leave">
//             <FormInput label="Lost Beginning Balance" value={data.lostBegBal || ""} readOnly className="bg-gray-100" />
//             <FormInput label="YTD Lost" value={data.ytdLost || ""} readOnly className="bg-gray-100" />
//             <FormInput label="Cumulative Lost" value={data.cumLost || ""} readOnly className="bg-gray-100" />
//           </FormSection>
//         </div>

//         <FormSection title="Accrual Rate">
//           <FormInput label="Rate" value={data.rate || ""} readOnly className="bg-gray-100" />
//           <FormInput label="Estimated Accrual" value={data.estAccrual || ""} readOnly className="bg-gray-100" />
//         </FormSection>

//         <FormSection title="Anniversary Year Accrual">
//           <FormInput label="Start Date" type="date" value={data.annStartDate || ""} readOnly className="bg-gray-100" />
//           <FormInput label="End Date" type="date" value={data.annEndDate || ""} readOnly className="bg-gray-100" />
//           <FormInput label="Anniversary Year Accrued" value={data.annYearAccrued || ""} readOnly className="bg-gray-100" />
//         </FormSection>

//         <FormSection title="Leave Balance">
//           <FormInput label="Beginning Balance" value={data.begBal || ""} readOnly className="bg-gray-100" />
//           <FormInput label="YTD Accrued" value={data.ytdAccrued || ""} readOnly className="bg-gray-100" />
//           <FormInput label="YTD Used" value={data.ytdUsed || ""} readOnly className="bg-gray-100" />
//           <FormInput label="Current Balance" value={data.currentBalance || ""} readOnly className="bg-gray-100 text-blue-600 font-bold" />
//         </FormSection>

//         <div className="flex items-center justify-center p-4 border border-gray-100 rounded-xl text-gray-400 italic text-[10px]">
//           (Reserved for future use)
//         </div>
//       </div>
//     </div>
//   );
// };

// export const GenericPlaceholderTab = ({ title }) => (
//   <div className="p-8 text-center text-gray-500 italic text-xs">
//     {title} functionality coming soon...
//   </div>
// );

// export const SalaryLeaveNestedContainer = ({ activeTab, data, onChange, handleClose }) => {
//   const [isNestedFormView, setIsNestedFormView] = useState(false);

//   const [activeConfig, setActiveConfig] = useState({ key: null, cols: [] });

//   // const [activeConfig, setActiveConfig] = useState({ key: null, cols: [] });
//   const currentKey = getRowKey(data);

//   // 1. Centralized Tab Configuration
//   // This maps each tab to its specific data array key and column definition
//   const tabConfigs = useMemo(() => ({
//     "Salary Details": { key: "labors", cols: salaryTableColumns },
//     "Leave Beginning Balances": { key: "leaveBalanceRecords", cols: leaveBalancesTableColumns },
//     "Leave": { key: "leaveRecords", cols: leaveTableColumns },
//     "Allowance Details": { key: "allowances", cols: [] }, // Add actual columns when ready
//     "Taxes": { key: "taxes", cols: [] },
//     "Deductions": { key: "deductions", cols: [] },
//     "Saving Bonds": { key: "bonds", cols: [] },
//     "User-Defined Info": { key: "userDefined", cols: [] },
//     "Additional Address": { key: "additionalAddresses", cols: [] },
//     "Citizenship": { key: "citizenship", cols: [] },
//     "Phone": { key: "phones", cols: [] },
//     "Additional Default Pay Types": { key: "payTypes", cols: [] }
//   }), []);

//   const currentConfig = tabConfigs[activeTab] || { key: null, cols: [] };

//    // Generic Add Handler using the dynamic config
//   const handleNestedAdd = () => {
//     const { key: listKey } = activeConfig;
//     if (!listKey) return;

//     const newListEntry = {
//       tempId: `NEW_${listKey.toUpperCase()}_${Date.now()}`,
//       isDirty: true,
//       emplId: data.emplId || ""
//     };

//     const existingList = Array.isArray(data[listKey]) ? data[listKey] : [];
//     onChange(currentKey, listKey, [newListEntry, ...existingList]);
//     // setIsNestedFormView(true); // Open form immediately
//   };

//   const handleNestedFindReplace = (config, isReplaceMode) => {
//     const { column, findYear, replaceValue } = config;
//     // FIX: Use activeConfig.key so it targets the correct array (e.g., allowanceRecords)
//     const listKey = activeConfig.key;

//     if (!isReplaceMode || !listKey || !data[listKey]) return;

//     const updatedList = data[listKey].map(item => {
//       if (String(item[column] || "").toLowerCase().includes(String(findYear).toLowerCase())) {
//         return { ...item, [column]: replaceValue, isDirty: true };
//       }
//       return item;
//     });
//     onChange(currentKey, listKey, updatedList);
//   };

// //  const handleNestedFindReplace = (config, isReplaceMode) => {
// //     const { column, findYear, replaceValue } = config;
// //     // Use activeConfig.key so it works for the separate files too
// //     const listKey = activeConfig.key;

// //     if (!isReplaceMode || !listKey || !data[listKey]) return;

// //     const updatedList = data[listKey].map(item => {
// //       // Use case-insensitive matching for better search
// //       if (String(item[column] || "").toLowerCase().includes(String(findYear).toLowerCase())) {
// //         return { ...item, [column]: replaceValue, isDirty: true };
// //       }
// //       return item;
// //     });
// //     onChange(currentKey, listKey, updatedList);
// //   };

//   // const handleNestedFindReplace = (config, isReplaceMode) => {
//   //   const { column, findYear, replaceValue } = config;
//   //   const { key: listKey } = activeConfig;
//   //   if (!isReplaceMode || !listKey || !data[listKey]) return;

//   //   const updatedList = data[listKey].map(item => {
//   //     if (String(item[column] || "").toLowerCase().includes(String(findYear).toLowerCase())) {
//   //       return { ...item, [column]: replaceValue, isDirty: true };
//   //     }
//   //     return item;
//   //   });
//   //   onChange(currentKey, listKey, updatedList);
//   // };

//   // 4. Dynamic Content Renderer
//   const renderContent = () => {
//     const props = { data, onChange, isFormView: isNestedFormView, setConfig: setActiveConfig };

//     switch (activeTab) {
//       case "Salary Details": return <SalaryDetailsTab {...props} />;
//       case "Leave Beginning Balances": return <LeaveBalancesTab {...props} />;
//       case "Leave": return <LeaveMainTab {...props} />;
//       case "Allowance Details": return <AllowanceDetailsTab {...props} />;
//       case "Taxes": return <TaxesDetailsTab {...props} />;
//       case "Deductions": return <DeductionsDetailsTab {...props} />;
//       case "Saving Bonds": return <SavingBondsDetailsTab {...props} />;
//       case "User-Defined Info": return <UserDefinedInfoDetailsTab {...props} />;
//       case "Additional Address": return <AdditionalAddressDetailsTab {...props} />;
//       case "Citizenship": return <CitizenshipDetailsTab {...props} />;
//       case "Phone": return <PhoneDetailsTab {...props} />;
//       case "Additional Default Pay Types": return <AdditionalPayTypesDetailsTab {...props} />;
//       default: return <GenericPlaceholderTab title={activeTab} />;
//     }
//   };

//   return (
//     <SecondaryContainer
//       title={`Manage Employee Information > ${activeTab}`}
//       handleClose={handleClose}

//     >
//       <Toolbar
//         isFormView={isNestedFormView}
//         // columns={currentConfig.cols}
//         columns={activeConfig.cols}
//         handleFindReplace={handleNestedFindReplace}
//         actions={{
//           onAdd: handleNestedAdd,
//           onToggleView: () => setIsNestedFormView(!isNestedFormView),
//           onSave: () => console.log(`Save triggered for ${activeTab}`)
//           // onCopy: () => {},
//           // onDelete: () => {}
//         }}
//         selectedRow={data}
//       />

//       <div className="bg-white min-h-[200px] p-2 border-t border-gray-200">
//         {renderContent()}
//       </div>
//     </SecondaryContainer>
//   );
// };

import api from "../utils/api";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import React, { useState, useMemo, useEffect } from "react";
import { FormSection, FormInput } from "../helper/formSection";
import { SecondaryContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import {
  User,
  Plus,
  FileText,
  MapPin,
  DollarSign,
  Calendar,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import AllowanceDetailsTab from "./AllowanceDetails";
import TaxesDetailsTab from "./TaxesDetails";
import DeductionsDetailsTab from "./DeductionsDetails";
import SavingBondsDetailsTab from "./SavingBondsDetails";
import UserDefinedInfoDetailsTab from "./UserDefinedInfoDetails";
import AdditionalAddressDetailsTab from "./AdditionalAddressDetails";
import CitizenshipDetailsTab from "./CitizenshipDetails";
import PhoneDetailsTab from "./PhoneDetails";
import AdditionalPayTypesDetailsTab from "./AdditionalPayTypesDetails";

// --- COLUMN DEFINITIONS ---
const salaryTableColumns = [
  { value: "effDate", label: "Effective Date *", key: "effDate", type: "date" },
  { value: "workHours", label: "Work Hours *", key: "workHours" },
  { value: "hourlyAmount", label: "Hourly Amount", key: "hourlyAmount" },
  { value: "annualAmount", label: "Annual Amount", key: "annualAmount" },
  { value: "homeOrg", label: "Home Organization *", key: "homeOrg" },
  { value: "glc", label: "GLC *", key: "glc" },
  { value: "manager", label: "Manager", key: "manager" },
  { value: "compPlan", label: "Compensation Plan", key: "compPlan" },
  { value: "step", label: "Step", key: "step" },
  { value: "grade", label: "Grade", key: "grade" },
  { value: "reviewForm", label: "Review Form", key: "reviewForm" },
  { value: "rating", label: "Rating", key: "rating" },
  {
    value: "pctGradeChange",
    label: "Percent Grade Change",
    key: "pctGradeChange",
  },
  {
    value: "pctRatingChange",
    label: "Percent Rating Change",
    key: "pctRatingChange",
  },
  { value: "aaPlan", label: "Affirmative Action Plan", key: "aaPlan" },
  { value: "jobCategory", label: "Job Category", key: "jobCategory" },
  { value: "eeoCode", label: "EEO Code", key: "eeoCode" },
  { value: "remoteStatus", label: "Remote Worker Status", key: "remoteStatus" },
  { value: "salaryComments", label: "Comments", key: "salaryComments" },
  { value: "endDate", label: "End Date", key: "endDate", type: "date" },
  { value: "flsa", label: "FLSA Classification", key: "flsa" },
  {
    value: "seasonalFl",
    label: "Seasonal Employee",
    key: "seasonalFl",
    type: "flag",
  },
  {
    value: "variableHoursFl",
    label: "Variable Hours Employee",
    key: "variableHoursFl",
    type: "flag",
  },
  { value: "pa1", label: "Personal Action 1", key: "pa1" },
  { value: "pa2", label: "Personal Action 2", key: "pa2" },
  { value: "pa3", label: "Personal Action 3", key: "pa3" },
  { value: "timeCollection", label: "Time Collection", key: "timeCollection" },
  { value: "refNo1", label: "Ref No 1", key: "refNo1" },
  { value: "refNo2", label: "Ref No 2", key: "refNo2" },
  { value: "titleDesc", label: "Detail Job Title", key: "titleDesc" },
  {
    value: "corpOfficerFl",
    label: "Corporate Officer",
    key: "corpOfficerFl",
    type: "flag",
  },
  { value: "supervisorId", label: "Supervisor", key: "supervisorId" },
  { value: "step", label: "Step", key: "step" },
  { value: "grade", label: "Grade", key: "grade" },
  { value: "reviewForm", label: "Review Form", key: "reviewForm" },
  { value: "rating", label: "Rating", key: "rating" },
  {
    value: "pctGradeChange",
    label: "Percent Grade Change",
    key: "pctGradeChange",
  },
  {
    value: "pctRatingChange",
    label: "Percent Rating Change",
    key: "pctRatingChange",
  },
  { value: "aaPlan", label: "Affirmative Action Plan", key: "aaPlan" },
  { value: "jobCategory", label: "Job Category", key: "jobCategory" },
  { value: "eeoCode", label: "EEO Code", key: "eeoCode" },
  {
    value: "effIsHire",
    label: "Eff Dt is Hire Dt",
    key: "effIsHire",
    type: "flag",
  },
  {
    value: "effIsTerm",
    label: "Eff Dt is Term Dt",
    key: "effIsTerm",
    type: "flag",
  },
  { value: "remoteStatus", label: "Remote Status", key: "remoteStatus" },
  { value: "hrComments", label: "HR Comments", key: "hrComments" },
];

const leaveBalancesTableColumns = [
  { value: "leaveType", label: "Leave Type *", key: "leaveType" },
  { value: "leaveYear", label: "Leave Year *", key: "leaveYear" },
  { value: "hours", label: "Hours", key: "hours" },
  {
    value: "transactionAmount",
    label: "Transaction Amount",
    key: "transactionAmount",
  },
  { value: "amount", label: "Amount", key: "amount" },
  { value: "deferredHours", label: "Deferred Hours", key: "deferredHours" },
  { value: "lostHours", label: "Lost Hours", key: "lostHours" },
  { value: "newLeaveType", label: "New Leave Type", key: "newLeaveType" },
];

const leaveTableColumns = [
  { value: "leaveType", label: "Leave Type *", key: "leaveType" },
  { value: "leaveCode", label: "Leave Code *", key: "leaveCode" },
  {
    value: "leaveHireDate",
    label: "Leave Hire Date",
    key: "leaveHireDate",
    type: "date",
  },
  { value: "rate", label: "Rate", key: "rate" },
  { value: "currentBalance", label: "Current Balance", key: "currentBalance" },
  { value: "ytdAccrued", label: "YTD Accrued", key: "ytdAccrued" },
  { value: "ytdUsed", label: "YTD Used", key: "ytdUsed" },
  { value: "ytdDeferred", label: "YTD Deferred", key: "ytdDeferred" },
  { value: "ytdLost", label: "YTD Lost", key: "ytdLost" },
];

// --- STABLE KEY HELPER ---
const getRowKey = (row) => {
  if (!row) return "";
  return String(row.tempId || row.emplId || row.id || "");
};

// --- 1. EMPLOYEE INFO TAB ---
export const EmployeeInfoTab = ({ data, onChange }) => {
  const currentKey = getRowKey(data);
  //  const currentKey = String(data?.emplId || data?.tempId || data?.id || "");

  // console.log("Rendering EmployeeInfoTab for key:", currentKey);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormSection title="Identity">
          <FormInput
            label="Social Security No *"
            value={data?.ssnId || ""}
            onChange={(e) => onChange(currentKey, "ssnId", e.target.value)}
          />
          <FormInput
            label="Status *"
            value={data?.sEmplStatusCd || ""}
            onChange={(e) =>
              onChange(currentKey, "sEmplStatusCd", e.target.value)
            }
          />
          <FormInput
            label="Last Name *"
            value={data.lastName || ""}
            onChange={(e) => {
              // Explicitly pass the key we just calculated
              onChange(currentKey, "lastName", e.target.value);
            }}
          />
          {/* onChange={(e) =>  onChange(currentKey, "lastName", e.target.value)} */}
          <FormInput
            label="First Name *"
            value={data.firstName || ""}
            onChange={(e) => onChange(currentKey, "firstName", e.target.value)}
          />
          <FormInput
            label="Middle Name"
            value={data.midName || ""}
            onChange={(e) => onChange(currentKey, "midName", e.target.value)}
          />
          <FormInput
            label="Suffix"
            value={data.nameSfxCd || ""}
            onChange={(e) => onChange(currentKey, "nameSfxCd", e.target.value)}
          />
          <FormInput
            label="Displayed Name"
            value={data.prefName || ""}
            onChange={(e) => onChange(currentKey, "prefName", e.target.value)}
          />
          <FormInput
            label="Birth Date"
            type="date"
            value={data?.birthDt?.split("T")[0] ?? ""}
            onChange={(e) => onChange(currentKey, "birthDt", e.target.value)}
          />
        </FormSection>

        <FormSection title="Hire Details">
          <FormInput
            label="Current Hire Date *"
            type="date"
            value={data?.origHireDt || ""}
            onChange={(e) => onChange(currentKey, "origHireDt", e.target.value)}
          />
          <FormInput
            label="Termination Date"
            type="date"
            value={data?.termDt || ""}
            onChange={(e) => onChange(currentKey, "termDt", e.target.value)}
          />
          <FormInput
            label="Last Day Worked"
            type="date"
            value={data?.lastDayDt || ""}
            readOnly
          />
          <FormInput
            label="Past Hire Date"
            type="date"
            value={data?.adjHireDt || ""}
            onChange={(e) => onChange(currentKey, "adjHireDt", e.target.value)}
          />
          <FormInput
            label="Taxable Entity *"
            value={data?.taxbleEntityId || ""}
            onChange={(e) =>
              onChange(currentKey, "taxbleEntityId", e.target.value)
            }
          />
          <FormInput
            label="Timesheet Cycle *"
            value={data?.tsPdCd || ""}
            onChange={(e) => onChange(currentKey, "tsPdCd", e.target.value)}
          />
          <FormInput
            label="Leave Cycle"
            value={data?.lvPdCd || ""}
            onChange={(e) => onChange(currentKey, "lvPdCd", e.target.value)}
          />
        </FormSection>

        <FormSection title="Administration">
          <FormInput
            label="Locator Code"
            value={data?.locatorCd || ""}
            onChange={(e) => onChange(currentKey, "locatorCd", e.target.value)}
          />
          <FormInput
            label="Administrator Name"
            value={data?.spvsrName || ""}
            onChange={(e) => onChange(currentKey, "spvsrName", e.target.value)}
          />
          <FormInput
            label="Preferred Name"
            value={data?.prefName || ""}
            onChange={(e) => onChange(currentKey, "prefName", e.target.value)}
          />
          <FormInput
            label="Prefix"
            value={data?.namePrfxCd || ""}
            onChange={(e) => onChange(currentKey, "namePrfxCd", e.target.value)}
          />
          <FormInput
            label="Prior Name"
            value={data?.prirName || ""}
            onChange={(e) => onChange(currentKey, "prirName", e.target.value)}
          />
          <FormInput
            label="Eligible for Auto-Pay"
            type="checkbox"
            checked={
              data?.eligAutoPayFl === true || data?.eligAutoPayFl === "Y"
            }
            onChange={(e) =>
              onChange(currentKey, "eligAutoPayFl", e.target.checked)
            }
          />
          <FormInput label="Vendor" value={data?.companyId || ""} readOnly />
        </FormSection>
      </div>
    </div>
  );
};

// --- 2. HR DATA TAB ---
export const HrDataTab = ({ data, onChange }) => {
  const currentKey = getRowKey(data);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSection title="Demographics">
          <FormInput
            label="Gender"
            value={data.sexCd || ""}
            onChange={(e) => onChange(currentKey, "sexCd", e.target.value)}
          />
          <FormInput
            label="Marital Status"
            value={data.maritalCd || ""}
            onChange={(e) => onChange(currentKey, "maritalCd", e.target.value)}
          />
          <FormInput
            label="Race"
            value={data.sRaceCd || ""}
            onChange={(e) => onChange(currentKey, "sRaceCd", e.target.value)}
          />
          <FormInput
            label="Race Description"
            value={data.raceDescription || ""}
            onChange={(e) =>
              onChange(currentKey, "raceDescription", e.target.value)
            }
          />
          <FormInput
            label="Visa Type"
            value={data.visaTypeCd || ""}
            onChange={(e) => onChange(currentKey, "visaTypeCd", e.target.value)}
          />
          <FormInput
            label="Visa Date"
            type="date"
            value={data.visaDt || ""}
            onChange={(e) => onChange(currentKey, "visaDt", e.target.value)}
          />
          <FormInput
            label="Last Review Date"
            type="date"
            value={data.lastReviewDt || ""}
            onChange={(e) =>
              onChange(currentKey, "lastReviewDt", e.target.value)
            }
          />
          <FormInput
            label="Next Review Date"
            type="date"
            value={data.nextReviewDt || ""}
            onChange={(e) =>
              onChange(currentKey, "nextReviewDt", e.target.value)
            }
          />
          <FormInput
            label="Birth City"
            value={data.birthCityName || ""}
            onChange={(e) =>
              onChange(currentKey, "birthCityName", e.target.value)
            }
          />
          <FormInput
            label="Birth State/Province"
            value={data.birthMailStateDc || ""}
            onChange={(e) =>
              onChange(currentKey, "birthMailStateDc", e.target.value)
            }
          />
          <FormInput
            label="Birth Country"
            value={data.birthCountryCd || ""}
            onChange={(e) =>
              onChange(currentKey, "birthCountryCd", e.target.value)
            }
          />
        </FormSection>

        <FormSection title="VETS-4212, Disability, Veteran Status">
          <FormInput
            label="Disabled"
            type="checkbox"
            checked={data?.disabledFl === true || data?.disabledFl === "Y"}
            onChange={(e) =>
              onChange(currentKey, "disabledFl", e.target.checked)
            }
          />
          <FormInput
            label="Blind"
            type="checkbox"
            checked={data?.blindFl === true || data?.blindFl === "Y"}
            onChange={(e) => onChange(currentKey, "blindFl", e.target.checked)}
          />
          <div className="mt-4 p-3 border border-gray-200 rounded-lg text-[10px]">
            <label className="font-bold text-[#17414d] block mb-2 uppercase">
              Protected Veteran Status
            </label>
            <FormInput
              label="Disabled Veteran"
              type="checkbox"
              checked={data?.vetStatusD === true || data?.vetStatusD === "Y"}
              onChange={(e) =>
                onChange(currentKey, "vetStatusD", e.target.checked)
              }
            />
            <FormInput
              label="Active Duty Wartime"
              type="checkbox"
              checked={data?.vetStatusA === true || data?.vetStatusA === "Y"}
              onChange={(e) =>
                onChange(currentKey, "vetStatusA", e.target.checked)
              }
            />
            <FormInput
              label="Armed Forces Service Medal Veteran"
              type="checkbox"
              checked={data?.vetStatusV === true || data?.vetStatusV === "Y"}
              onChange={(e) =>
                onChange(currentKey, "vetStatusV", e.target.checked)
              }
            />
            <FormInput
              label="Recently Separated Veteran"
              type="checkbox"
              checked={data?.vetStatusRs === true || data?.vetStatusRs === "Y"}
              onChange={(e) =>
                onChange(currentKey, "vetStatusRs", e.target.checked)
              }
            />
            <FormInput
              label="Discharge/Release Date"
              type="date"
              value={data?.vetReleaseDt || ""}
              onChange={(e) =>
                onChange(currentKey, "vetReleaseDt", e.target.value)
              }
            />
            <FormInput
              label="Protected Veteran"
              type="checkbox"
              checked={data?.vetStatusP === true || data?.vetStatusP === "Y"}
              onChange={(e) =>
                onChange(currentKey, "vetStatusP", e.target.checked)
              }
            />
            <FormInput
              label="Not a Protected Veteran"
              type="checkbox"
              checked={data?.vetStatusNp === true || data?.vetStatusNp === "Y"}
              onChange={(e) =>
                onChange(currentKey, "vetStatusNp", e.target.checked)
              }
            />
            <FormInput
              label="Declined to provide veteran status"
              type="checkbox"
              checked={
                data?.vetStatusDeclined === true ||
                data?.vetStatusDeclined === "Y"
              }
              onChange={(e) =>
                onChange(currentKey, "vetStatusDeclined", e.target.checked)
              }
            />
          </div>
        </FormSection>
      </div>
    </div>
  );
};

// --- 3. ADDRESS/CONTACT TAB ---
export const AddressContactTab = ({ data, onChange }) => {
  const currentKey = getRowKey(data);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <FormSection title="Mailing Address">
          <FormInput
            label="Line 1"
            value={data?.ln1Adr || ""}
            onChange={(e) => onChange(currentKey, "ln1Adr", e.target.value)}
          />
          <FormInput
            label="Line 2"
            value={data?.ln2Adr || ""}
            onChange={(e) => onChange(currentKey, "ln2Adr", e.target.value)}
          />
          <FormInput
            label="Line 3"
            value={data?.ln3Adr || ""}
            onChange={(e) => onChange(currentKey, "ln3Adr", e.target.value)}
          />
          <FormInput
            label="City"
            value={data?.cityName || ""}
            onChange={(e) => onChange(currentKey, "cityName", e.target.value)}
          />
          <FormInput
            label="State/Province"
            value={data?.mailStateDc || ""}
            onChange={(e) =>
              onChange(currentKey, "mailStateDc", e.target.value)
            }
          />
          <FormInput
            label="Postal Code"
            value={data?.postalCd || ""}
            onChange={(e) => onChange(currentKey, "postalCd", e.target.value)}
          />
          <FormInput
            label="Country"
            value={data?.countryCd || ""}
            onChange={(e) => onChange(currentKey, "countryCd", e.target.value)}
          />
        </FormSection>

        <div className="space-y-6">
          <FormSection title="Emergency Contact 1">
            <FormInput
              label="Contact Name 1"
              value={data?.contName1 || ""}
              onChange={(e) =>
                onChange(currentKey, "contName1", e.target.value)
              }
            />
            <FormInput
              label="Contact Phone 1"
              value={data?.contPhone1 || ""}
              onChange={(e) =>
                onChange(currentKey, "contPhone1", e.target.value)
              }
            />
            <FormInput
              label="Relationship 1"
              value={data?.contRel1 || ""}
              onChange={(e) => onChange(currentKey, "contRel1", e.target.value)}
            />
            <FormInput
              label="Notify on Arrest 1"
              type="checkbox"
              checked={
                data?.contactArrest1 === true || data?.contactArrest1 === "Y"
              }
              onChange={(e) =>
                onChange(currentKey, "contactArrest1", e.target.checked)
              }
            />
          </FormSection>

          <FormSection title="Emergency Contact 2">
            <FormInput
              label="Contact Name 2"
              value={data?.contName2 || ""}
              onChange={(e) =>
                onChange(currentKey, "contName2", e.target.value)
              }
            />
            <FormInput
              label="Contact Phone 2"
              value={data?.contPhone2 || ""}
              onChange={(e) =>
                onChange(currentKey, "contPhone2", e.target.value)
              }
            />
            <FormInput
              label="Relationship 2"
              value={data?.contRel2 || ""}
              onChange={(e) => onChange(currentKey, "contRel2", e.target.value)}
            />
            <FormInput
              label="Notify on Arrest 2"
              type="checkbox"
              checked={
                data?.contactArrest2 === true || data?.contactArrest2 === "Y"
              }
              onChange={(e) =>
                onChange(currentKey, "contactArrest2", e.target.checked)
              }
            />
          </FormSection>
        </div>
      </div>

      <FormSection title="Email Addresses">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Work Email"
            value={data?.emailId || ""}
            onChange={(e) => onChange(currentKey, "emailId", e.target.value)}
          />
          <FormInput
            label="Personal Email"
            value={data?.homeEmailId || ""}
            onChange={(e) =>
              onChange(currentKey, "homeEmailId", e.target.value)
            }
          />
        </div>
      </FormSection>
    </div>
  );
};

// --- 4. TIMESHEET DEFAULTS TAB ---
export const TimesheetDefaultsTab = ({ data, onChange }) => {
  const currentKey = getRowKey(data);

  return (
    <div className="space-y-6">
      <FormSection title="Default Allocations">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <FormInput
            label="Account"
            value={data?.tsDefaultAccount || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultAccount", e.target.value)
            }
          />
          <FormInput
            label="Organization"
            value={data?.tsDefaultOrg || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultOrg", e.target.value)
            }
          />
          <FormInput
            label="Project"
            value={data?.tsDefaultProject || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultProject", e.target.value)
            }
          />
          <FormInput
            label="GLC"
            value={data?.tsDefaultGLC || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultGLC", e.target.value)
            }
          />
          <FormInput
            label="Pay Type"
            value={data?.tsDefaultPayType || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultPayType", e.target.value)
            }
          />
          <FormInput
            label="Labor Location"
            value={data?.tsDefaultLaborLocation || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultLaborLocation", e.target.value)
            }
          />
          <FormInput
            label="Workers' Comp"
            value={data?.tsDefaultWorkerComp || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultWorkerComp", e.target.value)
            }
          />
          <FormInput
            label="Ref No 1"
            value={data?.tsDefaultRefNo1 || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultRefNo1", e.target.value)
            }
          />
          <FormInput
            label="Ref No 2"
            value={data?.tsDefaultRefNo2 || ""}
            onChange={(e) =>
              onChange(currentKey, "tsDefaultRefNo2", e.target.value)
            }
          />
        </div>
      </FormSection>
    </div>
  );
};

// --- 5. PRODUCT INTERFACE TAB ---
export const ProductInterfaceTab = ({ data, onChange }) => {
  const currentKey = getRowKey(data);

  return (
    <div className="space-y-6">
      <FormSection title="Interface Mapping Details">
        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Payroll Service ID"
            value={data?.prServEmplId || ""}
            onChange={(e) =>
              onChange(currentKey, "prServEmplId", e.target.value)
            }
          />
          <div className="mt-4 border border-gray-200 p-3 rounded bg-gray-50/30 col-span-2">
            <label className="text-[10px] font-bold text-[#17414d] block mb-2 uppercase">
              Project Manufacturing
            </label>
            <FormInput
              label="Plant"
              value={data?.plantId || ""}
              onChange={(e) => onChange(currentKey, "plantId", e.target.value)}
            />
          </div>
        </div>
      </FormSection>
    </div>
  );
};

// --- 6. NOTES TAB ---
export const NotesTab = ({ data, onChange }) => {
  const currentKey = getRowKey(data);

  return (
    <div className="space-y-6">
      <FormSection title="General Employee Notes">
        <textarea
          className="w-full h-48 p-3 border border-gray-300 rounded-lg text-xs focus:border-[#17414d] outline-none"
          value={data.notes || ""}
          onChange={(e) => onChange(currentKey, "notes", e.target.value)}
          placeholder="Enter notes here..."
        />
      </FormSection>
    </div>
  );
};

// --- BOTTOM NESTED COMPONENTS ---
export const SalaryDetailsTab = ({ data, onChange, isFormView, setConfig }) => {
  const [activeSub, setActiveSub] = useState("Salary Info");

  const laborData = data?.labors ?? [];
  const activeLabor = laborData[0] ?? {};
  const currentKey = getRowKey(data);

  useEffect(() => {
    if (setConfig) {
      setConfig({
        key: "labors", // Key in the data object
        cols: salaryTableColumns,
      });
    }
  }, [setConfig]);

  const onLaborChange = (field, value) => {
    const updatedLabors = [...laborData];
    if (updatedLabors.length === 0) {
      updatedLabors.push({
        effectDt: new Date().toISOString().split("T")[0],
        isDirty: true,
      });
    }
    updatedLabors[0] = { ...updatedLabors[0], [field]: value, isDirty: true };
    onChange(currentKey, "labors", updatedLabors);
  };

  // Helper to add a new labor row
  const handleAddLabor = () => {
    const newLabor = {
      tempId: `NEW_LABOR_${Date.now()}`,
      effectDt: new Date().toISOString().split("T")[0],
      orgId: data.tsDefaultOrg || "",
      genlLabCatCd: data.tsDefaultGLC || "",
      isDirty: true,
    };

    // We update the parent state by appending to the 'labors' array
    onChange(currentKey, "labors", [newLabor, ...laborData]);
  };

  const handleFindReplaceSalary = (config, isReplaceMode) => {
    const { column, findYear, replaceValue } = config;
    if (!isReplaceMode) return; // Simple local replace for now

    const updatedLabors = laborData.map((l) => {
      const currentVal = String(l[column] || "");
      if (currentVal.includes(findYear)) {
        return { ...l, [column]: replaceValue, isDirty: true };
      }
      return l;
    });
    onChange(currentKey, "labors", updatedLabors);
  };

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable
          data={laborData}
          columns={salaryTableColumns}
          onFieldChange={(rowId, field, value) => {
            // Logic to update specific labor record within the labors array
            const updatedLabors = laborData.map((l) =>
              getRowKey(l) === rowId
                ? { ...l, [field]: value, isDirty: true }
                : l,
            );
            onChange(currentKey, "labors", updatedLabors);
          }}
          rowKey={getRowKey}
          maxHeight="max-h-48"
        />
      </div>
    );
  }

  // if (!isFormView) {
  //   return (
  //     <div className="p-2">
  //       <ReusableTable data={laborData} columns={salaryTableColumns} onFieldChange={onChange} maxHeight="max-h-48" />
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200 px-2 mb-4 bg-white">
        {["Salary Info", "HR Information", "Comments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSub(tab)}
            className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${activeSub === tab ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-500 hover:text-[#17414d]"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-2">
        {activeSub === "Salary Info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
            <FormSection title="Compensation">
              <FormInput
                label="Effective Date *"
                type="date"
                value={activeLabor.effectDt?.split("T")[0] ?? ""}
                onChange={(e) => onLaborChange("effDate", e.target.value)}
              />
              <FormInput
                label="End Date"
                type="date"
                value={activeLabor.endDt?.split("T")[0] ?? ""}
                onChange={(e) => onLaborChange("endDate", e.target.value)}
              />
              <FormInput
                label="Work Hours In Year *"
                value={activeLabor.workHours ?? "2080"}
                onChange={(e) => onLaborChange("workHours", e.target.value)}
              />
              <FormInput
                label="Hourly Amount"
                value={activeLabor.hrlyAmt ?? ""}
                onChange={(e) => onLaborChange("hourlyAmount", e.target.value)}
              />
              <FormInput
                label="Payroll Salary Amount"
                value={activeLabor.salAmt ?? ""}
              />
              <FormInput
                label="Annual Amount"
                value={activeLabor.annlAmt ?? ""}
              />
              <FormInput
                label="Percent of Increase"
                value={data?.pctIncrease ?? ""}
                readOnly
              />
              <FormInput
                label="Estimated Annual Hours"
                value={data?.estHours ?? ""}
              />
              <FormInput
                label="Standard Hourly Rate"
                value={data?.stdRate ?? ""}
                readOnly
              />
              <FormInput label="Employee Class" value={data?.empClass ?? ""} />
              <FormInput
                label="Employee Type"
                type="select"
                value={data?.empType ?? ""}
                options={[]}
              />
              <FormInput
                label="Rate Type"
                type="select"
                value={activeLabor.hrlySalCd ?? ""}
                options={[]}
              />
              <div className="flex items-center gap-4 py-1 ml-[90px]">
                <span className="text-[10px] font-bold text-gray-700 uppercase">
                  FLSA Classification
                </span>
                <div className="flex gap-4">
                  <FormInput
                    label="Exempt"
                    type="radio"
                    name="flsa"
                    checked={data?.flsa === "Exempt"}
                    onChange={() => onChange(currentKey, "flsa", "Exempt")}
                  />
                  <FormInput
                    label="Non-Exempt"
                    type="radio"
                    name="flsa"
                    checked={data?.flsa === "Non-Exempt"}
                    onChange={() => onChange(currentKey, "flsa", "Non-Exempt")}
                  />
                </div>
              </div>
              <FormInput
                label="Seasonal Employee"
                type="checkbox"
                checked={data?.seasonalFl === true || data?.seasonalFl === "Y"}
                onChange={(e) =>
                  onChange(currentKey, "seasonalFl", e.target.checked)
                }
              />
              <FormInput
                label="Variable Hours Employee"
                type="checkbox"
                checked={
                  data?.variableHoursFl === true ||
                  data?.variableHoursFl === "Y"
                }
                onChange={(e) =>
                  onChange(currentKey, "variableHoursFl", e.target.checked)
                }
              />
              <FormInput
                label="Detail Job Title"
                value={activeLabor.titleDesc ?? ""}
                onChange={(e) => onLaborChange("titleDesc", e.target.value)}
              />
              <FormInput
                label="Corporate Officer"
                type="checkbox"
                checked={
                  data?.corpOfficerFl === true || data?.corpOfficerFl === "Y"
                }
                onChange={(e) =>
                  onChange(currentKey, "corpOfficerFl", e.target.checked)
                }
              />
              <FormInput
                label="Manager"
                value={data?.manager ?? ""}
                onChange={(e) =>
                  onChange(currentKey, "manager", e.target.value)
                }
              />
              <FormInput
                label="Supervisor"
                value={activeLabor.supervisorId ?? ""}
                onChange={(e) => onLaborChange("supervisorId", e.target.value)}
              />
            </FormSection>

            <FormSection title="Organization & Details">
              <FormInput label="Labor Group" value={data?.laborGroup ?? ""} />
              <FormInput
                label="Labor Location"
                value={data?.laborLocation ?? ""}
              />
              <FormInput
                label="GLC *"
                value={data?.emplAcctOrgDflt?.genlLabCatCd ?? ""}
              />
              <FormInput label="PLC" value={data?.plc ?? ""} />
              <FormInput
                label="Overtime State *"
                value={data?.emplAcctOrgDflt?.whStateCd ?? ""}
              />
              <FormInput
                label="Home Organization *"
                value={activeLabor.orgId ?? ""}
              />
              <FormInput
                label="Security Organization"
                value={activeLabor.secOrgId ?? ""}
              />
              <FormInput
                label="HR Organization"
                value={data?.hrOrg ?? ""}
                onChange={(e) => onChange(currentKey, "hrOrg", e.target.value)}
              />
              <FormInput
                label="Personal Action 1"
                value={data?.pa1 ?? ""}
                onChange={(e) => onChange(currentKey, "pa1", e.target.value)}
              />
              <FormInput
                label="Personal Action 2"
                value={data?.pa2 ?? ""}
                onChange={(e) => onChange(currentKey, "pa2", e.target.value)}
              />
              <FormInput
                label="Personal Action 3"
                value={data?.pa3 ?? ""}
                onChange={(e) => onChange(currentKey, "pa3", e.target.value)}
              />
              <FormInput
                label="Time Collection"
                value={data?.timeCollection ?? ""}
                onChange={(e) =>
                  onChange(currentKey, "timeCollection", e.target.value)
                }
              />
              <FormInput
                label="Work Schedule"
                value={data?.workSchedule ?? ""}
                onChange={(e) =>
                  onChange(currentKey, "workSchedule", e.target.value)
                }
              />
              <FormInput
                label="Ref No 1"
                value={data?.refNo1 ?? ""}
                onChange={(e) => onChange(currentKey, "refNo1", e.target.value)}
              />
              <FormInput
                label="Ref No 2"
                value={data?.refNo2 ?? ""}
                onChange={(e) => onChange(currentKey, "refNo2", e.target.value)}
              />
            </FormSection>
          </div>
        )}

        {activeSub === "HR Information" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormSection title="Compensation Data">
              <FormInput
                label="Compensation Plan"
                value={data?.compPlan ?? ""}
                onChange={(e) =>
                  onChange(currentKey, "compPlan", e.target.value)
                }
              />
              <FormInput label="Step" value={data?.step ?? ""} />
              <FormInput label="Grade" value={data?.grade ?? ""} readOnly />
              <FormInput label="Review Form" value={data?.reviewForm ?? ""} />
              <FormInput label="Rating" value={data?.rating ?? ""} />
              <FormInput
                label="Percent Grade Change"
                value={data?.pctGradeChange ?? ""}
                readOnly
              />
              <FormInput
                label="Percent Rating Change"
                value={data?.pctRatingChange ?? ""}
                readOnly
              />
            </FormSection>

            <FormSection title="Affirmative Action Data">
              <FormInput
                label="Affirmative Action Plan"
                value={data?.aaPlan ?? ""}
              />
              <FormInput label="Job Category" value={data?.jobCategory ?? ""} />
              <FormInput
                label="EEO Code"
                value={data?.eeoCode ?? ""}
                readOnly
              />
              <div className="ml-[90px] space-y-1 py-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      data?.effIsHire === true || data?.effIsHire === "Y"
                    }
                    onChange={(e) =>
                      onChange(currentKey, "effIsHire", e.target.checked)
                    }
                    className="h-3 w-3 accent-[#17414d]"
                  />
                  <label className="text-[10px] text-gray-700">
                    Effective Date is Hire Date
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      data?.effIsTerm === true || data?.effIsTerm === "Y"
                    }
                    onChange={(e) =>
                      onChange(currentKey, "effIsTerm", e.target.checked)
                    }
                    className="h-3 w-3 accent-[#17414d]"
                  />
                  <label className="text-[10px] text-gray-700">
                    Effective Date is Term Date
                  </label>
                </div>
              </div>
              <FormInput
                label="California Pay Data Reporting Remote Worker Status"
                type="select"
                value={data?.remoteStatus ?? ""}
                options={[
                  { label: "Does not work remotely", value: "none" },
                  { label: "Works Remotely", value: "remote" },
                ]}
                optionLabel="label"
                optionValue="value"
              />
              <div className="mt-2">
                <label className="text-[10px] font-semibold text-gray-800 block mb-1">
                  Comments
                </label>
                <textarea
                  className="w-full h-20 p-2 border border-gray-300 rounded text-xs outline-none focus:border-[#17414d]"
                  value={data?.hrComments ?? ""}
                  onChange={(e) =>
                    onChange(currentKey, "hrComments", e.target.value)
                  }
                />
              </div>
            </FormSection>
          </div>
        )}

        {activeSub === "Comments" && (
          <div className="p-2">
            <FormSection title="Comments">
              <div className="relative group">
                <textarea
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d] transition-all resize-none bg-white shadow-inner"
                  placeholder="Enter additional salary or HR comments here..."
                  value={data?.salaryComments ?? ""}
                  onChange={(e) =>
                    onChange(currentKey, "salaryComments", e.target.value)
                  }
                />
              </div>
            </FormSection>
          </div>
        )}
      </div>
    </div>
  );
};

export const LeaveBalancesTab = ({ data, onChange, isFormView, setConfig }) => {
  const currentKey = getRowKey(data);

  useEffect(() => {
    if (setConfig) {
      setConfig({
        key: "leaveBalanceRecords",
        cols: leaveBalancesTableColumns,
      });
    }
  }, [setConfig]);

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable
          data={data.leaveBalanceRecords || []}
          columns={leaveBalancesTableColumns}
          onFieldChange={onChange}
          maxHeight="max-h-48"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      <FormSection title="Leave Type">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <FormInput
              label="Leave Type *"
              value={data.leaveType || ""}
              onChange={(e) =>
                onChange(currentKey, "leaveType", e.target.value)
              }
            />
            <FormInput
              label="Leave Year *"
              value={data.leaveYear || ""}
              onChange={(e) =>
                onChange(currentKey, "leaveYear", e.target.value)
              }
            />
          </div>
          <div className="flex items-center gap-2 pl-4">
            <input
              type="checkbox"
              checked={data.payoutLeave === true || data.payoutLeave === "Y"}
              onChange={(e) =>
                onChange(currentKey, "payoutLeave", e.target.checked)
              }
              className="h-3 w-3 accent-[#17414d]"
            />
            <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">
              Payout Leave Type
            </label>
          </div>
        </div>
      </FormSection>

      <FormSection title="Beginning Balances">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <FormInput
              label="Hours"
              value={data.hours || ""}
              onChange={(e) => onChange(currentKey, "hours", e.target.value)}
            />
            <FormInput
              label="Transaction Amount"
              value={data.transAmount || ""}
              readOnly
              className="bg-gray-100"
            />
            <FormInput
              label="Amount"
              value={data.amount || ""}
              onChange={(e) => onChange(currentKey, "amount", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <FormInput
              label="Deferred Hours"
              value={data.defHours || ""}
              onChange={(e) => onChange(currentKey, "defHours", e.target.value)}
            />
            <FormInput
              label="Deferred Transaction Amount"
              value={data.defTransAmount || ""}
              readOnly
              className="bg-gray-100"
            />
            <FormInput
              label="Deferred Amount"
              value={data.defAmount || ""}
              onChange={(e) =>
                onChange(currentKey, "defAmount", e.target.value)
              }
            />
          </div>
          <div className="space-y-1">
            <FormInput
              label="Lost Hours"
              value={data.lostHours || ""}
              onChange={(e) =>
                onChange(currentKey, "lostHours", e.target.value)
              }
            />
            <FormInput
              label="Lost Transaction Amount"
              value={data.lostTransAmount || ""}
              readOnly
              className="bg-gray-100"
            />
            <FormInput
              label="Lost Amount"
              value={data.lostAmount || ""}
              onChange={(e) =>
                onChange(currentKey, "lostAmount", e.target.value)
              }
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Balance Transfer Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <FormInput
              label="New Leave Type"
              value={data.newLeaveType || ""}
              onChange={(e) =>
                onChange(currentKey, "newLeaveType", e.target.value)
              }
            />
            <FormInput
              label="New Leave Code"
              value={data.newLeaveCode || ""}
              onChange={(e) =>
                onChange(currentKey, "newLeaveCode", e.target.value)
              }
            />
            <FormInput
              label="Leave Period End Date"
              type="date"
              value={data.leavePeriodEndDate || ""}
              onChange={(e) =>
                onChange(currentKey, "leavePeriodEndDate", e.target.value)
              }
            />
          </div>
          <div className="flex items-center gap-2 pl-4">
            <input
              type="checkbox"
              checked={
                data.leaveTransferred === true || data.leaveTransferred === "Y"
              }
              onChange={(e) =>
                onChange(currentKey, "leaveTransferred", e.target.checked)
              }
              className="h-3 w-3 accent-[#17414d]"
            />
            <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">
              Leave Type Transferred
            </label>
          </div>
        </div>
      </FormSection>
    </div>
  );
};

export const LeaveMainTab = ({ data, onChange, isFormView, setConfig }) => {
  const currentKey = getRowKey(data);

  useEffect(() => {
    if (setConfig) {
      setConfig({
        key: "leaveRecords",
        cols: leaveTableColumns,
      });
    }
  }, [setConfig]);

  if (!isFormView) {
    return (
      <div className="p-2">
        <ReusableTable
          data={data.leaveRecords || []}
          columns={leaveTableColumns}
          onFieldChange={onChange}
          maxHeight="max-h-48"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSection title="Leave Type">
          <FormInput
            label="Leave Type *"
            value={data.leaveType || ""}
            onChange={(e) => onChange(currentKey, "leaveType", e.target.value)}
          />
          <div className="ml-[90px] space-y-1 py-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.trackExcess === true || data.trackExcess === "Y"}
                onChange={(e) =>
                  onChange(currentKey, "trackExcess", e.target.checked)
                }
                className="h-3 w-3 accent-[#17414d]"
              />
              <label className="text-[10px] text-gray-700">
                Used to track excess leave
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.suppComp === true || data.suppComp === "Y"}
                onChange={(e) =>
                  onChange(currentKey, "suppComp", e.target.checked)
                }
                className="h-3 w-3 accent-[#17414d]"
              />
              <label className="text-[10px] text-gray-700">
                Used for mandatory leave with supplemental compensation
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  data.annYearLimit === true || data.annYearLimit === "Y"
                }
                onChange={(e) =>
                  onChange(currentKey, "annYearLimit", e.target.checked)
                }
                className="h-3 w-3 accent-[#17414d]"
              />
              <label className="text-[10px] text-gray-700">
                Annual accrual limit is based on anniversary year
              </label>
            </div>
          </div>
          <FormInput label="Leave Code *" value={data.leaveCode || ""} />
          <FormInput
            label="Leave Hire Date"
            type="date"
            value={data.leaveHireDate || ""}
          />
        </FormSection>

        <div className="space-y-2">
          <FormSection title="Deferred Leave">
            <FormInput
              label="Deferred Beginning Balance"
              value={data.defBegBal || ""}
              readOnly
              className="bg-gray-100"
            />
            <FormInput
              label="YTD Deferred"
              value={data.ytdDeferred || ""}
              readOnly
              className="bg-gray-100"
            />
          </FormSection>
          <FormSection title="Lost Leave">
            <FormInput
              label="Lost Beginning Balance"
              value={data.lostBegBal || ""}
              readOnly
              className="bg-gray-100"
            />
            <FormInput
              label="YTD Lost"
              value={data.ytdLost || ""}
              readOnly
              className="bg-gray-100"
            />
            <FormInput
              label="Cumulative Lost"
              value={data.cumLost || ""}
              readOnly
              className="bg-gray-100"
            />
          </FormSection>
        </div>

        <FormSection title="Accrual Rate">
          <FormInput
            label="Rate"
            value={data.rate || ""}
            readOnly
            className="bg-gray-100"
          />
          <FormInput
            label="Estimated Accrual"
            value={data.estAccrual || ""}
            readOnly
            className="bg-gray-100"
          />
        </FormSection>

        <FormSection title="Anniversary Year Accrual">
          <FormInput
            label="Start Date"
            type="date"
            value={data.annStartDate || ""}
            readOnly
            className="bg-gray-100"
          />
          <FormInput
            label="End Date"
            type="date"
            value={data.annEndDate || ""}
            readOnly
            className="bg-gray-100"
          />
          <FormInput
            label="Anniversary Year Accrued"
            value={data.annYearAccrued || ""}
            readOnly
            className="bg-gray-100"
          />
        </FormSection>

        <FormSection title="Leave Balance">
          <FormInput
            label="Beginning Balance"
            value={data.begBal || ""}
            readOnly
            className="bg-gray-100"
          />
          <FormInput
            label="YTD Accrued"
            value={data.ytdAccrued || ""}
            readOnly
            className="bg-gray-100"
          />
          <FormInput
            label="YTD Used"
            value={data.ytdUsed || ""}
            readOnly
            className="bg-gray-100"
          />
          <FormInput
            label="Current Balance"
            value={data.currentBalance || ""}
            readOnly
            className="bg-gray-100 text-blue-600 font-bold"
          />
        </FormSection>

        <div className="flex items-center justify-center p-4 border border-gray-100 rounded-xl text-gray-400 italic text-[10px]">
          (Reserved for future use)
        </div>
      </div>
    </div>
  );
};

export const GenericPlaceholderTab = ({ title }) => (
  <div className="p-8 text-center text-gray-500 italic text-xs">
    {title} functionality coming soon...
  </div>
);

export const SalaryLeaveNestedContainer = ({
  activeTab,
  data,
  onChange,
  handleClose,
}) => {
  const [isNestedFormView, setIsNestedFormView] = useState(false);

  const [activeConfig, setActiveConfig] = useState({ key: null, cols: [] });
  const [isLoading, setIsLoading] = useState(false);

  // const [activeConfig, setActiveConfig] = useState({ key: null, cols: [] });
  const currentKey = getRowKey(data);

  const fetchTabData = async () => {
    if (!data.emplId) return;

    setIsLoading(true);
    try {
      if (activeTab === "Salary Details") {
        // --- HARDCODED VALUE FOR DEBUGGING ---
        // Isko aap apne database ki kisi valid date se replace kar sakte hain (e.g., "2024-01-01")
        const backupDate = "2026-04-22";

        // Pehle check karein real data mein date hai, nahi toh backupDate use karein
        const rawDate =
          data?.labors?.[0]?.effectDt ||
          data?.labors?.[0]?.effDate ||
          backupDate;

        // Date format clean karein (YYYY-MM-DD)
        const effectDt = rawDate.split("T")[0];
        const emplId = data.emplId;

        // Ab ye URL hamesha hit hoga kyunki effectDt kabhi undefined nahi rahega
        const url = `${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/${effectDt}`;

        console.log("Hitting API URL:", url); // Network tab ke saath console bhi check ho jayega

        const res = await api.get(url);
        const fetchedData = res.data ? [res.data] : [];

        onChange(
          currentKey,
          "labors",
          fetchedData.map((item) => ({ ...item, isDirty: false })),
        );
      }
    } catch (err) {
      console.error("Fetch data error:", err);
      // Agar hardcoded date bhi galat hui toh 404 aayega, tab aapko sahi date check karni hogi
    } finally {
      setIsLoading(false);
    }
  };

  //   const fetchTabData = async () => {
  //   // Check karein ki emplId aur kam se kam ek labor record ho jiske paas date ho
  //   const emplId = data?.emplId;
  //   const effectDt = data?.labors?.[0]?.effectDt || data?.labors?.[0]?.effDate;

  //   if (!emplId || !effectDt) {
  //     console.warn("Required parameters (emplId or effectDt) missing for fetch");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     if (activeTab === "Salary Details") {
  //       // Date ko clean kar lete hain (YYYY-MM-DD)
  //       const cleanDate = effectDt.split('T')[0];

  //       // Aapka bataya hua dynamic URL: .../api/EmployeeMaster/{emplId}/labinfo/{effectDt}
  //       const url = `${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/${cleanDate}`;

  //       const res = await api.get(url);

  //       // API single object degi, isliye array mein wrap kar rahe hain existing logic ke liye
  //       const fetchedData = res.data ? [res.data] : [];

  //       onChange(currentKey, "labors", fetchedData.map(item => ({
  //         ...item,
  //         isDirty: false
  //       })));
  //     }
  //   } catch (err) {
  //     console.error("Fetch data error:", err);
  //     // Agar 404 aaye ya data na mile toh toast dikha sakte hain
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchTabData = async () => {
  //   if (!data.emplId) return;

  //   setIsLoading(true);
  //   try {
  //     if (activeTab === "Salary Details") {
  //       const res = await api.get(`${backendUrl}/api/EmployeeMaster/${data.emplId}/labinfo`);
  //       const fetchedData = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
  //       onChange(currentKey, "labors", fetchedData.map(item => ({...item, isDirty: false})));
  //     }
  //   } catch (err) {
  //      console.error("Fetch data error:", err);
  //      toast.error("Failed to fetch data.");
  //   } finally {
  //      setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchTabData();
  }, [activeTab, data.emplId]);

  const handleNestedSave = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "Salary Details") {
        const laborsData = data.labors || [];
        const dirtyLabors = laborsData.filter((l) => l.isDirty);

        if (dirtyLabors.length === 0) {
          toast.info("No changes to save.");
          setIsLoading(false);
          return;
        }

        for (const labor of dirtyLabors) {
          const payload = {
            emplId: data.emplId,
            effectDt: labor.effectDt || labor.effDate,
            hrlyAmt: labor.hrlyAmt || labor.hourlyAmount || 0,
            corpOfcrFl: data.corpOfficerFl ? "Y" : "N",
            sHrlySalCd: labor.hrlySalCd,
            mgrEmplId1: data.manager,
            spvsrEmplId: labor.supervisorId,
            orgId: labor.orgId,
            genlLabCatCd: labor.genlLabCatCd,
            titleDesc: labor.titleDesc,
            // standard fields based on requirements
            whStateCd: data.emplAcctOrgDflt?.whStateCd || "ST",
            salAmt: labor.salAmt || 0,
            annlAmt: labor.annlAmt || 0,
            exmptFl: data.flsa === "Exempt" ? "Y" : "N",
            sEmplTypeCd: data.empType || "REG",
            labGrpType: data.laborGroup || "LG1",
            stdEstHrs: 2080,
            stdEffectAmt: 0,
            modifiedBy1: "SystemUser",
            pctIncrRt: data.pctIncrease || 0,
            homeRef1Id: labor.refNo1 || "",
            homeRef2Id: labor.refNo2 || "",
            reasonDesc: "Update",
            detlJobCd: labor.titleDesc || "JOB1",
          };

          if (labor.tempId && labor.tempId.startsWith("NEW")) {
            await api.post(
              `${backendUrl}/api/EmployeeMaster/${data.emplId}/labinfo`,
              payload,
            );
          } else {
            await api.put(
              `${backendUrl}/api/EmployeeMaster/${data.emplId}/labinfo/${payload.effectDt}`,
              payload,
            );
          }
        }
        toast.success("Salary Details saved successfully.");
        await fetchTabData(); // refresh the view
      }
    } catch (err) {
      toast.error(err.response?.data?.title || "Failed to save data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNestedDelete = async () => {
    // If we support delete, would need to know which items are selected.
    // Usually Toolbar does not pass selected items directly for delete unless handled
    toast.info("Delete triggered - logic stubbed");
  };

  // 1. Centralized Tab Configuration
  // This maps each tab to its specific data array key and column definition
  const tabConfigs = useMemo(
    () => ({
      "Salary Details": { key: "labors", cols: salaryTableColumns },
      "Leave Beginning Balances": {
        key: "leaveBalanceRecords",
        cols: leaveBalancesTableColumns,
      },
      Leave: { key: "leaveRecords", cols: leaveTableColumns },
      "Allowance Details": { key: "allowances", cols: [] }, // Add actual columns when ready
      Taxes: { key: "taxes", cols: [] },
      Deductions: { key: "deductions", cols: [] },
      "Saving Bonds": { key: "bonds", cols: [] },
      "User-Defined Info": { key: "userDefined", cols: [] },
      "Additional Address": { key: "additionalAddresses", cols: [] },
      Citizenship: { key: "citizenship", cols: [] },
      Phone: { key: "phones", cols: [] },
      "Additional Default Pay Types": { key: "payTypes", cols: [] },
    }),
    [],
  );

  const currentConfig = tabConfigs[activeTab] || { key: null, cols: [] };

  // Generic Add Handler using the dynamic config
  const handleNestedAdd = () => {
    const { key: listKey } = activeConfig;
    if (!listKey) return;

    const newListEntry = {
      tempId: `NEW_${listKey.toUpperCase()}_${Date.now()}`,
      isDirty: true,
      emplId: data.emplId || "",
    };

    const existingList = Array.isArray(data[listKey]) ? data[listKey] : [];
    onChange(currentKey, listKey, [newListEntry, ...existingList]);
    // setIsNestedFormView(true); // Open form immediately
  };

  const handleNestedFindReplace = (config, isReplaceMode) => {
    const { column, findYear, replaceValue } = config;
    // FIX: Use activeConfig.key so it targets the correct array (e.g., allowanceRecords)
    const listKey = activeConfig.key;

    if (!isReplaceMode || !listKey || !data[listKey]) return;

    const updatedList = data[listKey].map((item) => {
      if (
        String(item[column] || "")
          .toLowerCase()
          .includes(String(findYear).toLowerCase())
      ) {
        return { ...item, [column]: replaceValue, isDirty: true };
      }
      return item;
    });
    onChange(currentKey, listKey, updatedList);
  };

  //  const handleNestedFindReplace = (config, isReplaceMode) => {
  //     const { column, findYear, replaceValue } = config;
  //     // Use activeConfig.key so it works for the separate files too
  //     const listKey = activeConfig.key;

  //     if (!isReplaceMode || !listKey || !data[listKey]) return;

  //     const updatedList = data[listKey].map(item => {
  //       // Use case-insensitive matching for better search
  //       if (String(item[column] || "").toLowerCase().includes(String(findYear).toLowerCase())) {
  //         return { ...item, [column]: replaceValue, isDirty: true };
  //       }
  //       return item;
  //     });
  //     onChange(currentKey, listKey, updatedList);
  //   };

  // const handleNestedFindReplace = (config, isReplaceMode) => {
  //   const { column, findYear, replaceValue } = config;
  //   const { key: listKey } = activeConfig;
  //   if (!isReplaceMode || !listKey || !data[listKey]) return;

  //   const updatedList = data[listKey].map(item => {
  //     if (String(item[column] || "").toLowerCase().includes(String(findYear).toLowerCase())) {
  //       return { ...item, [column]: replaceValue, isDirty: true };
  //     }
  //     return item;
  //   });
  //   onChange(currentKey, listKey, updatedList);
  // };

  // 4. Dynamic Content Renderer
  const renderContent = () => {
    const props = {
      data,
      onChange,
      isFormView: isNestedFormView,
      setConfig: setActiveConfig,
    };

    switch (activeTab) {
      case "Salary Details":
        return <SalaryDetailsTab {...props} />;
      case "Leave Beginning Balances":
        return <LeaveBalancesTab {...props} />;
      case "Leave":
        return <LeaveMainTab {...props} />;
      case "Allowance Details":
        return <AllowanceDetailsTab {...props} />;
      case "Taxes":
        return <TaxesDetailsTab {...props} />;
      case "Deductions":
        return <DeductionsDetailsTab {...props} />;
      case "Saving Bonds":
        return <SavingBondsDetailsTab {...props} />;
      case "User-Defined Info":
        return <UserDefinedInfoDetailsTab {...props} />;
      case "Additional Address":
        return <AdditionalAddressDetailsTab {...props} />;
      case "Citizenship":
        return <CitizenshipDetailsTab {...props} />;
      case "Phone":
        return <PhoneDetailsTab {...props} />;
      case "Additional Default Pay Types":
        return <AdditionalPayTypesDetailsTab {...props} />;
      default:
        return <GenericPlaceholderTab title={activeTab} />;
    }
  };

  return (
    <SecondaryContainer
      title={`Manage Employee Information > ${activeTab}`}
      handleClose={handleClose}
    >
      <Toolbar
        isFormView={isNestedFormView}
        // columns={currentConfig.cols}
        columns={activeConfig.cols}
        handleFindReplace={handleNestedFindReplace}
        actions={{
          onAdd: handleNestedAdd,
          onToggleView: () => setIsNestedFormView(!isNestedFormView),
          onSave: handleNestedSave,
          onDelete: handleNestedDelete,
          // onCopy: () => {},
        }}
        selectedRow={data}
      />

      <div className="bg-white min-h-[200px] p-2 border-t border-gray-200">
        {renderContent()}
      </div>
    </SecondaryContainer>
  );
};
