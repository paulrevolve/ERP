// // import React, { useState } from "react";
// // import { MainContainer, Toolbar } from "../helper/container";
// // import { FormSection, FormInput, FormSearchSelect, FormCheckbox } from "../helper/formSection";
// // import { ReusableTable } from "../helper/tableSection";
// // import { DollarSign } from "lucide-react";

// // const columns = [
// //   { id: "project", key: "project", label: "Project *" },
// //   { id: "includeInactiveProjects", key: "includeInactiveProjects", label: "Include Inactive Projects", type: "checkbox" },
// //   { id: "projectManager", key: "projectManager", label: "Project Manager" },
// //   { id: "evaluatedForRevenueRecognition", key: "evaluatedForRevenueRecognition", label: "Evaluated for Revenue Recognition", type: "checkbox" },
// //   { id: "evaluatedBy", key: "evaluatedBy", label: "Evaluated By" },
// //   { id: "date", key: "date", label: "Date", type: "date" },
// //   { id: "status", key: "status", label: "Status" },
// //   { id: "performanceObligationsNotes", key: "performanceObligationsNotes", label: "Performance Obligations Notes" },
// //   { id: "determinationOfContractPriceNotes", key: "determinationOfContractPriceNotes", label: "Determination of Contract Price Notes" },
// //   { id: "allocationOfContractPriceNotes", key: "allocationOfContractPriceNotes", label: "Allocation of Contract Price Notes" },
// //   { id: "revenueTiming", key: "revenueTiming", label: "Revenue Timing" },
// //   { id: "performanceObligationType", key: "performanceObligationType", label: "Performance Obligation Type" },
// //   { id: "performanceObligationDesc", key: "performanceObligationDesc", label: "Performance Obligation Desc" },
// //   { id: "otherInfo", key: "otherInfo", label: "Other Info" },
// //   { id: "disclosuresNotes1", key: "disclosuresNotes1", label: "Disclosures Notes 1" },
// //   { id: "disclosuresNotes2", key: "disclosuresNotes2", label: "Disclosures Notes 2" },
// //   { id: "disclosuresNotes3", key: "disclosuresNotes3", label: "Disclosures Notes 3" },
// //   { id: "disclosuresNotes4", key: "disclosuresNotes4", label: "Disclosures Notes 4" }
// // ];

// // const ManageRevenueEvaluationInfoAndDisclosures = () => {
// //   const [isFormView, setIsFormView] = useState(true);
// //   const [activeTab, setActiveTab] = useState("Revenue Evaluation Info");
// //   const [records, setRecords] = useState([{
// //     id: "NEW_1", 
// //     project: "", 
// //     includeInactiveProjects: false,
// //     projectManager: "",
// //     evaluatedForRevenueRecognition: false,
// //     evaluatedBy: "",
// //     date: "",
// //     status: "",
// //     performanceObligationsNotes: "",
// //     determinationOfContractPriceNotes: "",
// //     allocationOfContractPriceNotes: "",
// //     revenueTiming: "",
// //     performanceObligationType: "",
// //     performanceObligationDesc: "",
// //     otherInfo: "",
// //     disclosuresNotes1: "",
// //     disclosuresNotes2: "",
// //     disclosuresNotes3: "",
// //     disclosuresNotes4: ""
// //   }]);

// //   const activeRecord = records[0];

// //   const handleFieldChange = (id, field, value) => {
// //     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
// //   };

// //   return (
// //     <div className="p-4 space-y-4 font-inter">
// //       <MainContainer icon={DollarSign} title="Manage Revenue Evaluation Info and Disclosures">
// //         <Toolbar 
// //           isFormView={isFormView} 
// //           columns={columns}
// //           actions={{ 
// //             onToggleView: () => setIsFormView(!isFormView),
// //             onAdd: () => {},
// //             onSave: () => {},
// //             onDelete: () => {},
// //             onCopy: () => {}
// //           }} 
// //         />
// //         <div className="mt-2">
// //           {isFormView ? (
// //             <div className="space-y-4">
// //               <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
// //                  <div className="flex flex-col md:flex-row gap-8">
// //                     <div className="flex-1 space-y-2">
// //                        <FormSearchSelect 
// //                          label="Project *" 
// //                          value={activeRecord.project} 
// //                          options={[]} 
// //                          displayKey="project" 
// //                          onChange={(e) => handleFieldChange(activeRecord.id, "project", e.target.value)}
// //                        />
// //                        <FormInput 
// //                          label="Project Manager" 
// //                          value={activeRecord.projectManager} 
// //                          onChange={(e) => handleFieldChange(activeRecord.id, "projectManager", e.target.value)}
// //                          disabled
// //                        />
// //                     </div>
// //                     <div className="flex-1 pt-6 text-sm flex items-start">
// //                        <FormCheckbox 
// //                          label="Include Inactive Projects" 
// //                          checked={activeRecord.includeInactiveProjects}
// //                          onChange={(e) => handleFieldChange(activeRecord.id, "includeInactiveProjects", e.target.checked)}
// //                        />
// //                     </div>
// //                  </div>
// //               </div>

// //               {/* Tabs */}
// //               <div className="flex border-b border-gray-300">
// //                  {["Revenue Evaluation Info", "Disclosures"].map(tab => (
// //                     <button
// //                        key={tab}
// //                        className={`px-4 py-2 text-sm font-medium focus:outline-none ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
// //                        onClick={() => setActiveTab(tab)}
// //                     >
// //                        {tab}
// //                     </button>
// //                  ))}
// //               </div>

// //               <div className="p-4 bg-white">
// //                  {activeTab === "Revenue Evaluation Info" && (
// //                     <div className="space-y-4">
// //                        <FormSection title="Revenue Evaluation Status">
// //                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //                              <div className="space-y-2">
// //                                 <FormCheckbox 
// //                                   label="Evaluated for Revenue Recognition" 
// //                                   checked={activeRecord.evaluatedForRevenueRecognition}
// //                                   onChange={(e) => handleFieldChange(activeRecord.id, "evaluatedForRevenueRecognition", e.target.checked)}
// //                                 />
// //                                 <FormSearchSelect 
// //                                   label="Status" 
// //                                   value={activeRecord.status}
// //                                   options={[]}
// //                                   onChange={(e) => handleFieldChange(activeRecord.id, "status", e.target.value)}
// //                                 />
// //                              </div>
// //                              <div className="space-y-2">
// //                                 <FormSearchSelect 
// //                                   label="Evaluated By" 
// //                                   value={activeRecord.evaluatedBy}
// //                                   options={[]}
// //                                   onChange={(e) => handleFieldChange(activeRecord.id, "evaluatedBy", e.target.value)}
// //                                 />
// //                              </div>
// //                              <div className="space-y-2 flex items-start">
// //                                 <FormInput 
// //                                   type="date"
// //                                   label="Date" 
// //                                   value={activeRecord.date}
// //                                   onChange={(e) => handleFieldChange(activeRecord.id, "date", e.target.value)}
// //                                 />
// //                              </div>
// //                           </div>
// //                        </FormSection>

// //                        <FormSection title="Performance Obligations">
// //                           <FormInput 
// //                             type="textarea"
// //                             label="Notes"
// //                             value={activeRecord.performanceObligationsNotes}
// //                             onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationsNotes", e.target.value)}
// //                           />
// //                        </FormSection>

// //                        <FormSection title="Determination of Contract Price">
// //                           <FormInput 
// //                             type="textarea"
// //                             label="Notes"
// //                             value={activeRecord.determinationOfContractPriceNotes}
// //                             onChange={(e) => handleFieldChange(activeRecord.id, "determinationOfContractPriceNotes", e.target.value)}
// //                           />
// //                        </FormSection>

// //                        <FormSection title="Allocation of Contract Price to Performance Obligations">
// //                           <FormInput 
// //                             type="textarea"
// //                             label="Notes"
// //                             value={activeRecord.allocationOfContractPriceNotes}
// //                             onChange={(e) => handleFieldChange(activeRecord.id, "allocationOfContractPriceNotes", e.target.value)}
// //                           />
// //                        </FormSection>

// //                        <FormSection title="Revenue Recognition">
// //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
// //                              <div className="space-y-2">
// //                                 <FormInput 
// //                                   type="select"
// //                                   label="Revenue Timing"
// //                                   value={activeRecord.revenueTiming}
// //                                   options={[{label: "-None-", value: ""}]}
// //                                   onChange={(e) => handleFieldChange(activeRecord.id, "revenueTiming", e.target.value)}
// //                                 />
// //                              </div>
// //                              <div className="space-y-2">
// //                                 <FormSearchSelect 
// //                                   label="Performance Obligation Type" 
// //                                   value={activeRecord.performanceObligationType}
// //                                   options={[]}
// //                                   onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationType", e.target.value)}
// //                                 />
// //                                 <FormInput 
// //                                   label="Performance Obligation Desc" 
// //                                   value={activeRecord.performanceObligationDesc}
// //                                   onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationDesc", e.target.value)}
// //                                   disabled
// //                                 />
// //                              </div>
// //                           </div>
// //                           <FormInput 
// //                             type="textarea"
// //                             label="Other Info"
// //                             value={activeRecord.otherInfo}
// //                             onChange={(e) => handleFieldChange(activeRecord.id, "otherInfo", e.target.value)}
// //                           />
// //                        </FormSection>
// //                     </div>
// //                  )}

// //                  {activeTab === "Disclosures" && (
// //                     <div className="space-y-4">
// //                        <FormSection title="Disclosures">
// //                           <div className="space-y-4">
// //                              <FormInput 
// //                                type="textarea"
// //                                label="Notes 1"
// //                                value={activeRecord.disclosuresNotes1}
// //                                onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes1", e.target.value)}
// //                              />
// //                              <FormInput 
// //                                type="textarea"
// //                                label="Notes 2"
// //                                value={activeRecord.disclosuresNotes2}
// //                                onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes2", e.target.value)}
// //                              />
// //                              <FormInput 
// //                                type="textarea"
// //                                label="Notes 3"
// //                                value={activeRecord.disclosuresNotes3}
// //                                onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes3", e.target.value)}
// //                              />
// //                              <FormInput 
// //                                type="textarea"
// //                                label="Notes 4"
// //                                value={activeRecord.disclosuresNotes4}
// //                                onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes4", e.target.value)}
// //                              />
// //                           </div>
// //                        </FormSection>
// //                     </div>
// //                  )}
// //               </div>
// //             </div>
// //           ) : (
// //             <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
// //           )}
// //         </div>
// //       </MainContainer>
// //     </div>
// //   );
// // };

// // export default ManageRevenueEvaluationInfoAndDisclosures;


// import React, { useState } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";
// import { ReusableTable } from "../helper/tableSection";
// import { DollarSign } from "lucide-react";

// const columns = [
//   { id: "project", key: "project", label: "Project *" },
//   { id: "includeInactiveProjects", key: "includeInactiveProjects", label: "Include Inactive Projects", type: "checkbox" },
//   { id: "projectManager", key: "projectManager", label: "Project Manager" },
//   { id: "evaluatedForRevenueRecognition", key: "evaluatedForRevenueRecognition", label: "Evaluated for Revenue Recognition", type: "checkbox" },
//   { id: "evaluatedBy", key: "evaluatedBy", label: "Evaluated By" },
//   { id: "date", key: "date", label: "Date", type: "date" },
//   { id: "status", key: "status", label: "Status" },
//   { id: "performanceObligationsNotes", key: "performanceObligationsNotes", label: "Performance Obligations Notes" },
//   { id: "determinationOfContractPriceNotes", key: "determinationOfContractPriceNotes", label: "Determination of Contract Price Notes" },
//   { id: "allocationOfContractPriceNotes", key: "allocationOfContractPriceNotes", label: "Allocation of Contract Price Notes" },
//   { id: "revenueTiming", key: "revenueTiming", label: "Revenue Timing" },
//   { id: "performanceObligationType", key: "performanceObligationType", label: "Performance Obligation Type" },
//   { id: "performanceObligationDesc", key: "performanceObligationDesc", label: "Performance Obligation Desc" },
//   { id: "otherInfo", key: "otherInfo", label: "Other Info" },
//   { id: "disclosuresNotes1", key: "disclosuresNotes1", label: "Disclosures Notes 1" },
//   { id: "disclosuresNotes2", key: "disclosuresNotes2", label: "Disclosures Notes 2" },
//   { id: "disclosuresNotes3", key: "disclosuresNotes3", label: "Disclosures Notes 3" },
//   { id: "disclosuresNotes4", key: "disclosuresNotes4", label: "Disclosures Notes 4" }
// ];

// const ManageRevenueEvaluationInfoAndDisclosures = () => {
//   const [isFormView, setIsFormView] = useState(true);
//   const [activeTab, setActiveTab] = useState("Revenue Evaluation Info");
//   const [records, setRecords] = useState([{
//     id: "NEW_1", 
//     project: "", 
//     includeInactiveProjects: false,
//     projectManager: "",
//     evaluatedForRevenueRecognition: false,
//     evaluatedBy: "",
//     date: "",
//     status: "",
//     performanceObligationsNotes: "",
//     determinationOfContractPriceNotes: "",
//     allocationOfContractPriceNotes: "",
//     revenueTiming: "",
//     performanceObligationType: "",
//     performanceObligationDesc: "",
//     otherInfo: "",
//     disclosuresNotes1: "",
//     disclosuresNotes2: "",
//     disclosuresNotes3: "",
//     disclosuresNotes4: ""
//   }]);

//   const activeRecord = records[0];

//   const handleFieldChange = (id, field, value) => {
//     setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
//   };

//   return (
//     <div className="p-4 space-y-4 font-inter">
//       <MainContainer icon={DollarSign} title="Manage Revenue Evaluation Info and Disclosures">
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
//             <div className="space-y-4">
//               <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
//                  <div className="flex flex-col md:flex-row gap-8">
//                     <div className="flex-1 space-y-2">
//                        <FormSearchSelect 
//                          label="Project *" 
//                          value={activeRecord.project} 
//                          options={[]} 
//                          displayKey="project" 
//                          onChange={(e) => handleFieldChange(activeRecord.id, "project", e.target.value)}
//                        />
//                        <FormInput 
//                          label="Project Manager" 
//                          value={activeRecord.projectManager} 
//                          onChange={(e) => handleFieldChange(activeRecord.id, "projectManager", e.target.value)}
//                          disabled
//                        />
//                     </div>
//                     <div className="flex-1 pt-6 text-sm flex items-start">
//                        <FormInput 
//                          type="checkbox"
//                          label="Include Inactive Projects" 
//                          checked={activeRecord.includeInactiveProjects}
//                          onChange={(e) => handleFieldChange(activeRecord.id, "includeInactiveProjects", e.target.checked)}
//                        />
//                     </div>
//                  </div>
//               </div>

//               {/* Tabs */}
//               <div className="flex border-b border-gray-300">
//                  {["Revenue Evaluation Info", "Disclosures"].map(tab => (
//                     <button
//                        key={tab}
//                        className={`px-4 py-2 text-sm font-medium focus:outline-none ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
//                        onClick={() => setActiveTab(tab)}
//                     >
//                        {tab}
//                     </button>
//                  ))}
//               </div>

//               <div className="p-4 bg-white">
//                  {activeTab === "Revenue Evaluation Info" && (
//                     <div className="space-y-4">
//                        <FormSection title="Revenue Evaluation Status">
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                              <div className="space-y-2">
//                                 <FormInput 
//                                   type="checkbox"
//                                   label="Evaluated for Revenue Recognition" 
//                                   checked={activeRecord.evaluatedForRevenueRecognition}
//                                   onChange={(e) => handleFieldChange(activeRecord.id, "evaluatedForRevenueRecognition", e.target.checked)}
//                                 />
//                                 <FormSearchSelect 
//                                   label="Status" 
//                                   value={activeRecord.status}
//                                   options={[]}
//                                   onChange={(e) => handleFieldChange(activeRecord.id, "status", e.target.value)}
//                                 />
//                              </div>
//                              <div className="space-y-2">
//                                 <FormSearchSelect 
//                                   label="Evaluated By" 
//                                   value={activeRecord.evaluatedBy}
//                                   options={[]}
//                                   onChange={(e) => handleFieldChange(activeRecord.id, "evaluatedBy", e.target.value)}
//                                 />
//                              </div>
//                              <div className="space-y-2 flex items-start">
//                                 <FormInput 
//                                   type="date"
//                                   label="Date" 
//                                   value={activeRecord.date}
//                                   onChange={(e) => handleFieldChange(activeRecord.id, "date", e.target.value)}
//                                 />
//                              </div>
//                           </div>
//                        </FormSection>

//                        <FormSection title="Performance Obligations">
//                           <FormInput 
//                             type="textarea"
//                             label="Notes"
//                             value={activeRecord.performanceObligationsNotes}
//                             onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationsNotes", e.target.value)}
//                           />
//                        </FormSection>

//                        <FormSection title="Determination of Contract Price">
//                           <FormInput 
//                             type="textarea"
//                             label="Notes"
//                             value={activeRecord.determinationOfContractPriceNotes}
//                             onChange={(e) => handleFieldChange(activeRecord.id, "determinationOfContractPriceNotes", e.target.value)}
//                           />
//                        </FormSection>

//                        <FormSection title="Allocation of Contract Price to Performance Obligations">
//                           <FormInput 
//                             type="textarea"
//                             label="Notes"
//                             value={activeRecord.allocationOfContractPriceNotes}
//                             onChange={(e) => handleFieldChange(activeRecord.id, "allocationOfContractPriceNotes", e.target.value)}
//                           />
//                        </FormSection>

//                        <FormSection title="Revenue Recognition">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
//                              <div className="space-y-2">
//                                 <FormInput 
//                                   type="select"
//                                   label="Revenue Timing"
//                                   value={activeRecord.revenueTiming}
//                                   options={[{label: "-None-", value: ""}]}
//                                   onChange={(e) => handleFieldChange(activeRecord.id, "revenueTiming", e.target.value)}
//                                 />
//                              </div>
//                              <div className="space-y-2">
//                                 <FormSearchSelect 
//                                   label="Performance Obligation Type" 
//                                   value={activeRecord.performanceObligationType}
//                                   options={[]}
//                                   onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationType", e.target.value)}
//                                 />
//                                 <FormInput 
//                                   label="Performance Obligation Desc" 
//                                   value={activeRecord.performanceObligationDesc}
//                                   onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationDesc", e.target.value)}
//                                   disabled
//                                 />
//                              </div>
//                           </div>
//                           <FormInput 
//                             type="textarea"
//                             label="Other Info"
//                             value={activeRecord.otherInfo}
//                             onChange={(e) => handleFieldChange(activeRecord.id, "otherInfo", e.target.value)}
//                           />
//                        </FormSection>
//                     </div>
//                  )}

//                  {activeTab === "Disclosures" && (
//                     <div className="space-y-4">
//                        <FormSection title="Disclosures">
//                           <div className="space-y-4">
//                              <FormInput 
//                                type="textarea"
//                                label="Notes 1"
//                                value={activeRecord.disclosuresNotes1}
//                                onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes1", e.target.value)}
//                              />
//                              <FormInput 
//                                type="textarea"
//                                label="Notes 2"
//                                value={activeRecord.disclosuresNotes2}
//                                onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes2", e.target.value)}
//                              />
//                              <FormInput 
//                                type="textarea"
//                                label="Notes 3"
//                                value={activeRecord.disclosuresNotes3}
//                                onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes3", e.target.value)}
//                              />
//                              <FormInput 
//                                type="textarea"
//                                label="Notes 4"
//                                value={activeRecord.disclosuresNotes4}
//                                onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes4", e.target.value)}
//                              />
//                           </div>
//                        </FormSection>
//                     </div>
//                  )}
//               </div>
//             </div>
//           ) : (
//             <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
//           )}
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageRevenueEvaluationInfoAndDisclosures;

import React, { useState } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import { FormSection, FormInput, FormSearchSelect } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { DollarSign } from "lucide-react";

const columns = [
  { id: "project", key: "project", label: "Project *" },
  { id: "includeInactiveProjects", key: "includeInactiveProjects", label: "Include Inactive Projects", type: "checkbox" },
  { id: "projectManager", key: "projectManager", label: "Project Manager" },
  { id: "evaluatedForRevenueRecognition", key: "evaluatedForRevenueRecognition", label: "Evaluated for Revenue Recognition", type: "checkbox" },
  { id: "evaluatedBy", key: "evaluatedBy", label: "Evaluated By" },
  { id: "date", key: "date", label: "Date", type: "date" },
  { id: "status", key: "status", label: "Status" },
  { id: "performanceObligationsNotes", key: "performanceObligationsNotes", label: "Performance Obligations Notes" },
  { id: "determinationOfContractPriceNotes", key: "determinationOfContractPriceNotes", label: "Determination of Contract Price Notes" },
  { id: "allocationOfContractPriceNotes", key: "allocationOfContractPriceNotes", label: "Allocation of Contract Price Notes" },
  { id: "revenueTiming", key: "revenueTiming", label: "Revenue Timing" },
  { id: "performanceObligationType", key: "performanceObligationType", label: "Performance Obligation Type" },
  { id: "performanceObligationDesc", key: "performanceObligationDesc", label: "Performance Obligation Desc" },
  { id: "otherInfo", key: "otherInfo", label: "Other Info" },
  { id: "disclosuresNotes1", key: "disclosuresNotes1", label: "Disclosures Notes 1" },
  { id: "disclosuresNotes2", key: "disclosuresNotes2", label: "Disclosures Notes 2" },
  { id: "disclosuresNotes3", key: "disclosuresNotes3", label: "Disclosures Notes 3" },
  { id: "disclosuresNotes4", key: "disclosuresNotes4", label: "Disclosures Notes 4" }
];

const ManageRevenueEvaluationInfoAndDisclosures = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [activeTab, setActiveTab] = useState("Revenue Evaluation Info");
  const [records, setRecords] = useState([{
    id: "NEW_1", 
    project: "", 
    includeInactiveProjects: false,
    projectManager: "",
    evaluatedForRevenueRecognition: false,
    evaluatedBy: "",
    date: "",
    status: "",
    performanceObligationsNotes: "",
    determinationOfContractPriceNotes: "",
    allocationOfContractPriceNotes: "",
    revenueTiming: "",
    performanceObligationType: "",
    performanceObligationDesc: "",
    otherInfo: "",
    disclosuresNotes1: "",
    disclosuresNotes2: "",
    disclosuresNotes3: "",
    disclosuresNotes4: ""
  }]);

  const activeRecord = records[0];

  const handleFieldChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value, isDirty: true } : r));
  };

  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={DollarSign} title="Manage Revenue Evaluation Info and Disclosures">
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
            <div className="space-y-4">
              <div className="p-4 bg-white border border-gray-200 rounded-sm mb-4">
                 <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-2">
                       <FormSearchSelect 
                         label="Project *" 
                         value={activeRecord.project} 
                         options={[]} 
                         displayKey="project" 
                         onChange={(e) => handleFieldChange(activeRecord.id, "project", e.target.value)}
                       />
                       <FormInput 
                         label="Project Manager" 
                         value={activeRecord.projectManager} 
                         onChange={(e) => handleFieldChange(activeRecord.id, "projectManager", e.target.value)}
                         disabled
                       />
                    </div>
                    <div className="flex-1 pt-6 text-sm flex items-start">
                       <FormInput 
                         type="checkbox"
                         label="Include Inactive Projects" 
                         checked={activeRecord.includeInactiveProjects}
                         onChange={(e) => handleFieldChange(activeRecord.id, "includeInactiveProjects", e.target.checked)}
                       />
                    </div>
                 </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-gray-200 mb-4">
                 {["Revenue Evaluation Info", "Disclosures"].map(tab => (
                    <button
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`px-2 py-1 text-[11px] font-bold transition-all ${activeTab === tab ? 'border-b-2 border-[#17414d] text-[#17414d]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                       {tab}
                    </button>
                 ))}
              </div>

              <div className="p-4 bg-white">
                 {activeTab === "Revenue Evaluation Info" && (
                    <div className="space-y-4">
                       <FormSection title="Revenue Evaluation Status">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <div className="space-y-2">
                                <FormInput 
                                  type="checkbox"
                                  label="Evaluated for Revenue Recognition" 
                                  checked={activeRecord.evaluatedForRevenueRecognition}
                                  onChange={(e) => handleFieldChange(activeRecord.id, "evaluatedForRevenueRecognition", e.target.checked)}
                                />
                                <FormSearchSelect 
                                  label="Status" 
                                  value={activeRecord.status}
                                  options={[]}
                                  onChange={(e) => handleFieldChange(activeRecord.id, "status", e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <FormSearchSelect 
                                  label="Evaluated By" 
                                  value={activeRecord.evaluatedBy}
                                  options={[]}
                                  onChange={(e) => handleFieldChange(activeRecord.id, "evaluatedBy", e.target.value)}
                                />
                             </div>
                             <div className="space-y-2 flex items-start">
                                <FormInput 
                                  type="date"
                                  label="Date" 
                                  value={activeRecord.date}
                                  onChange={(e) => handleFieldChange(activeRecord.id, "date", e.target.value)}
                                />
                             </div>
                          </div>
                       </FormSection>

                       <FormSection title="Performance Obligations">
                          <FormInput 
                            type="textarea"
                            label="Notes"
                            value={activeRecord.performanceObligationsNotes}
                            onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationsNotes", e.target.value)}
                          />
                       </FormSection>

                       <FormSection title="Determination of Contract Price">
                          <FormInput 
                            type="textarea"
                            label="Notes"
                            value={activeRecord.determinationOfContractPriceNotes}
                            onChange={(e) => handleFieldChange(activeRecord.id, "determinationOfContractPriceNotes", e.target.value)}
                          />
                       </FormSection>

                       <FormSection title="Allocation of Contract Price to Performance Obligations">
                          <FormInput 
                            type="textarea"
                            label="Notes"
                            value={activeRecord.allocationOfContractPriceNotes}
                            onChange={(e) => handleFieldChange(activeRecord.id, "allocationOfContractPriceNotes", e.target.value)}
                          />
                       </FormSection>

                       <FormSection title="Revenue Recognition">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                             <div className="space-y-2">
                                <FormInput 
                                  type="select"
                                  label="Revenue Timing"
                                  value={activeRecord.revenueTiming}
                                  options={[{label: "-None-", value: ""}]}
                                  onChange={(e) => handleFieldChange(activeRecord.id, "revenueTiming", e.target.value)}
                                />
                             </div>
                             <div className="space-y-2">
                                <FormSearchSelect 
                                  label="Performance Obligation Type" 
                                  value={activeRecord.performanceObligationType}
                                  options={[]}
                                  onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationType", e.target.value)}
                                />
                                <FormInput 
                                  label="Performance Obligation Desc" 
                                  value={activeRecord.performanceObligationDesc}
                                  onChange={(e) => handleFieldChange(activeRecord.id, "performanceObligationDesc", e.target.value)}
                                  disabled
                                />
                             </div>
                          </div>
                          <FormInput 
                            type="textarea"
                            label="Other Info"
                            value={activeRecord.otherInfo}
                            onChange={(e) => handleFieldChange(activeRecord.id, "otherInfo", e.target.value)}
                          />
                       </FormSection>
                    </div>
                 )}

                 {activeTab === "Disclosures" && (
                    <div className="space-y-4">
                       <FormSection title="Disclosures">
                          <div className="space-y-4">
                             <FormInput 
                               type="textarea"
                               label="Notes 1"
                               value={activeRecord.disclosuresNotes1}
                               onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes1", e.target.value)}
                             />
                             <FormInput 
                               type="textarea"
                               label="Notes 2"
                               value={activeRecord.disclosuresNotes2}
                               onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes2", e.target.value)}
                             />
                             <FormInput 
                               type="textarea"
                               label="Notes 3"
                               value={activeRecord.disclosuresNotes3}
                               onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes3", e.target.value)}
                             />
                             <FormInput 
                               type="textarea"
                               label="Notes 4"
                               value={activeRecord.disclosuresNotes4}
                               onChange={(e) => handleFieldChange(activeRecord.id, "disclosuresNotes4", e.target.value)}
                             />
                          </div>
                       </FormSection>
                    </div>
                 )}
              </div>
            </div>
          ) : (
            <ReusableTable data={records} columns={columns} onFieldChange={handleFieldChange} />
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageRevenueEvaluationInfoAndDisclosures;
