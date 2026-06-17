// // // import React, { useState, useEffect } from "react";
// // // import { DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
// // // import { toast } from "react-toastify";
// // // import api from "../utils/api";
// // // import { MainContainer, Toolbar } from "../helper/container";
// // // import { ReusableTable } from "../helper/tableSection";
// // // import { FormSection, FormInput } from "../helper/formSection";

// // // const ManageEmployeeSalary = () => {
// // //   // --- View States ---
// // //   const [isFormView, setIsFormView] = useState(false);
// // //   const [activeTab, setActiveTab] = useState("salaryInfo");
// // //   const [loading, setLoading] = useState(false);

// // //   // --- Data States ---
// // //   const [salaryRecords, setSalaryRecords] = useState([]);
// // //   const [masterRecords, setMasterRecords] = useState([]);
// // //   const [selectedRow, setSelectedRow] = useState(null);
// // //   const [selectedIds, setSelectedIds] = useState(new Set());
// // //   const [clipboard, setClipboard] = useState([]);

// // //   // --- Search/Pagination States ---
// // //   const [searchValue, setSearchValue] = useState("");
// // //   const [searchColumn, setSearchColumn] = useState("effDate");
// // //   const [currentPage, setCurrentPage] = useState(1);

// // //   // --- Column Configuration (Matches images exactly) ---
// // //   const salaryColumns = [
// // //     { label: "Effective Date *", key: "effDate", type: "date", value: "effDate" },
// // //     { label: "End Date", key: "endDate", type: "date", value: "endDate" },
// // //     { label: "Work Hours In Year *", key: "workHours", value: "workHours" },
// // //     { label: "Hourly Amount", key: "hourlyAmount", value: "hourlyAmount" },
// // //     { label: "Payroll Salary Amount", key: "payrollSalary", value: "payrollSalary" },
// // //     { label: "Annual Amount", key: "annualAmount", value: "annualAmount" },
// // //     { label: "GLC *", key: "glc", value: "glc" },
// // //     { label: "Home Organization *", key: "homeOrg", value: "homeOrg" },
// // //     { label: "Labor Group", key: "laborGroup", value: "laborGroup" },
// // //     { label: "Manager", key: "manager", value: "manager" },
// // //     { label: "Supervisor", key: "supervisor", value: "supervisor" },
// // //     { label: "Job Title", key: "detailJobTitle", value: "detailJobTitle" },
// // //   ];

// // //   // --- API Handlers ---
// // //   const fetchSalaryData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const baseUrl = "https://planning-master.onrender.com/api/EmployeeSalary";
// // //       const res = await api.get(baseUrl);
// // //       const data = res.data.map((item) => ({
// // //         ...item,
// // //         id: item.tempId || item.effDate, // Unique ID for selection
// // //         isDirty: false,
// // //       }));
// // //       setSalaryRecords(data);
// // //       setMasterRecords(data);
// // //     } catch (error) {
// // //       toast.error("Failed to fetch salary records");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => { fetchSalaryData(); }, []);

// // //   // --- Field Change Handler ---
// // //   const handleFieldChange = (id, field, value) => {
// // //     const stringId = String(id);
// // //     const update = (prev) =>
// // //       prev.map((row) =>
// // //         String(row.id) === stringId ? { ...row, [field]: value, isDirty: true } : row
// // //       );

// // //     setSalaryRecords(update);
// // //     if (selectedRow && String(selectedRow.id) === stringId) {
// // //       setSelectedRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// // //     }
// // //   };

// // //   // --- Action Button Logic ---
// // //   const handleAdd = () => {
// // //     const newRecord = {
// // //       id: `NEW_${Date.now()}`,
// // //       effDate: "",
// // //       workHours: "2080",
// // //       homeOrg: "",
// // //       glc: "",
// // //       isDirty: true,
// // //       tempId: `NEW_${Date.now()}`,
// // //     };
// // //     setSalaryRecords([newRecord, ...salaryRecords]);
// // //     setSelectedRow(newRecord);
// // //     setIsFormView(true);
// // //   };

// // //   const handleSave = async () => {
// // //     if (!selectedRow?.isDirty) return toast.info("No changes to save.");
// // //     setLoading(true);
// // //     try {
// // //       const isNew = String(selectedRow.id).startsWith("NEW_");
// // //       const method = isNew ? "post" : "put";
// // //       const url = isNew 
// // //         ? "https://planning-master.onrender.com/api/EmployeeSalary" 
// // //         : `https://planning-master.onrender.com/api/EmployeeSalary/${selectedRow.id}`;

// // //       await api[method](url, selectedRow);
// // //       toast.success("Salary information saved");
// // //       fetchSalaryData();
// // //     } catch (error) {
// // //       toast.error("Save failed");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleCopy = () => {
// // //     if (!selectedRow) return toast.warn("Select a record to copy");
// // //     setClipboard([selectedRow]);
// // //     toast.success("Record copied to clipboard");
// // //   };

// // //   const handlePaste = () => {
// // //     if (!clipboard.length) return;
// // //     const pasted = { ...clipboard[0], id: `PST_${Date.now()}`, isDirty: true };
// // //     setSalaryRecords([pasted, ...salaryRecords]);
// // //     toast.success("Record pasted");
// // //   };

// // //   // --- Render Sections ---
// // //   const renderSalaryInfoTab = () => (
// // //     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
// // //       <FormSection title="Compensation">
// // //         <FormInput label="Effective Date *" type="date" value={selectedRow?.effDate || ""} onChange={(e) => handleFieldChange(selectedRow.id, "effDate", e.target.value)} />
// // //         <FormInput label="End Date" type="date" value={selectedRow?.endDate || ""} onChange={(e) => handleFieldChange(selectedRow.id, "endDate", e.target.value)} />
// // //         <FormInput label="Work Hours In Year *" value={selectedRow?.workHours || "2080"} onChange={(e) => handleFieldChange(selectedRow.id, "workHours", e.target.value)} />
// // //         <FormInput label="Hourly Amount" value={selectedRow?.hourlyAmount || ""} onChange={(e) => handleFieldChange(selectedRow.id, "hourlyAmount", e.target.value)} />
// // //         <FormInput label="Payroll Salary Amount" value={selectedRow?.payrollSalary || ""} />
// // //         <FormInput label="Annual Amount" value={selectedRow?.annualAmount || ""} />
// // //       </FormSection>

// // //       <FormSection title="Organization & Details">
// // //         <FormInput label="Labor Group" value={selectedRow?.laborGroup || ""} onChange={(e) => handleFieldChange(selectedRow.id, "laborGroup", e.target.value)} />
// // //         <FormInput label="GLC *" value={selectedRow?.glc || ""} onChange={(e) => handleFieldChange(selectedRow.id, "glc", e.target.value)} />
// // //         <FormInput label="Home Organization *" value={selectedRow?.homeOrg || ""} onChange={(e) => handleFieldChange(selectedRow.id, "homeOrg", e.target.value)} />
// // //         <FormInput label="Manager" value={selectedRow?.manager || ""} onChange={(e) => handleFieldChange(selectedRow.id, "manager", e.target.value)} />
// // //         <FormInput label="Supervisor" value={selectedRow?.supervisor || ""} onChange={(e) => handleFieldChange(selectedRow.id, "supervisor", e.target.value)} />
// // //       </FormSection>
// // //     </div>
// // //   );

// // //   const renderHRInfoTab = () => (
// // //     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // //       <FormSection title="Compensation Data">
// // //         <FormInput label="Compensation Plan" value={selectedRow?.compPlan || ""} />
// // //         <FormInput label="Grade" value={selectedRow?.grade || ""} readOnly />
// // //         <FormInput label="Step" value={selectedRow?.step || ""} />
// // //       </FormSection>
// // //       <FormSection title="Affirmative Action Data">
// // //         <FormInput label="Job Category" value={selectedRow?.jobCategory || ""} />
// // //         <FormInput label="EEO Code" value={selectedRow?.eeoCode || ""} readOnly />
// // //       </FormSection>
// // //     </div>
// // //   );

// // //   return (
// // //     <div className="p-4 font-inter">
// // //       <MainContainer icon={DollarSign} title="Manage Employee Salary Information">
// // //         <Toolbar
// // //           isFormView={isFormView}
// // //           columns={salaryColumns}
// // //           searchValue={searchValue}
// // //           setSearchValue={setSearchValue}
// // //           searchColumn={searchColumn}
// // //           setSearchColumn={setSearchColumn}
// // //           handleFind={() => {
// // //             const filtered = masterRecords.filter(r => String(r[searchColumn]).toLowerCase().includes(searchValue.toLowerCase()));
// // //             setSalaryRecords(filtered);
// // //           }}
// // //           actions={{
// // //             onAdd: handleAdd,
// // //             onSave: handleSave,
// // //             onCopy: handleCopy,
// // //             onPaste: handlePaste,
// // //             onToggleView: () => setIsFormView(!isFormView),
// // //             onClear: () => {
// // //                 setSalaryRecords(masterRecords);
// // //                 setIsFormView(false);
// // //                 setSelectedRow(null);
// // //             }
// // //           }}
// // //           selectedRow={selectedRow}
// // //           isDirty={selectedRow?.isDirty}
// // //           loading={loading}
// // //         />

// // //         <div className="m-2">
// // //           {isFormView ? (
// // //             <div className="space-y-4">
// // //               {/* Tab Navigation (Underline Style) */}
// // //               <div className="flex border-b border-gray-200 bg-white">
// // //                 {["salaryInfo", "hrInfo", "comments"].map((t) => (
// // //                   <button
// // //                     key={t}
// // //                     onClick={() => setActiveTab(t)}
// // //                     className={`px-6 py-2 text-[11px] font-bold uppercase transition-all ${
// // //                       activeTab === t ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-400 hover:text-[#17414d]"
// // //                     }`}
// // //                   >
// // //                     {t.replace(/([A-Z])/g, ' $1')}
// // //                   </button>
// // //                 ))}
// // //               </div>

// // //               <div className="bg-white p-2">
// // //                 {activeTab === "salaryInfo" && renderSalaryInfoTab()}
// // //                 {activeTab === "hrInfo" && renderHRInfoTab()}
// // //                 {activeTab === "comments" && (
// // //                   <FormSection title="Comments">
// // //                     <textarea
// // //                       className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d]"
// // //                       value={selectedRow?.salaryComments || ""}
// // //                       onChange={(e) => handleFieldChange(selectedRow.id, "salaryComments", e.target.value)}
// // //                     />
// // //                   </FormSection>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           ) : (
// // //             <ReusableTable
// // //               data={salaryRecords}
// // //               columns={salaryColumns}
// // //               selectedRows={selectedIds}
// // //               onRowSelect={(row) => {
// // //                 setSelectedRow(row);
// // //                 setSelectedIds(new Set([String(row.id)]));
// // //               }}
// // //               onFieldChange={handleFieldChange}
// // //               maxHeight="max-h-[65vh]"
// // //             />
// // //           )}
// // //         </div>

// // //         {/* Pagination Footer */}
// // //         {!isFormView && (
// // //           <div className="bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 rounded-b-xl">
// // //             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="hover:text-[#17414d]"><ChevronLeft size={18} /></button>
// // //             <span className="text-xs font-bold">{currentPage}</span>
// // //             <button onClick={() => setCurrentPage(p => p + 1)} className="hover:text-[#17414d]"><ChevronRight size={18} /></button>
// // //           </div>
// // //         )}
// // //       </MainContainer>
// // //     </div>
// // //   );
// // // };

// // // export default ManageEmployeeSalary;

// // import React, { useState, useEffect, useMemo } from "react";
// // import { DollarSign, ChevronLeft, ChevronRight, Search, Replace, RefreshCw } from "lucide-react";
// // import { toast } from "react-toastify";
// // import api from "../utils/api";
// // import { MainContainer, Toolbar } from "../helper/container";
// // import { ReusableTable } from "../helper/tableSection";
// // import { FormSection, FormInput } from "../helper/formSection";
// // import { backendUrl } from "./config";

// // const ManageEmployeeSalary = () => {
// //   // --- View & Loading States ---
// //   const [isFormView, setIsFormView] = useState(false);
// //   const [activeTab, setActiveTab] = useState("salaryinfo");
// //   const [loading, setLoading] = useState(false);
// //   const [emplId, setEmplId] = useState("10");

// //   // --- Data States ---
// //   const [salaryRecords, setSalaryRecords] = useState([]);
// //   const [selectedIds, setSelectedIds] = useState(new Set());
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   // --- Navigation & Search States ---
// //   const [searchValue, setSearchValue] = useState("");
// //   const [searchColumn, setSearchColumn] = useState("effectDt");
// //   const [isReplaceMode, setIsReplaceMode] = useState(false);
// //   const [replaceValue, setReplaceValue] = useState("");

// //   // --- Pagination States ---
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [pageSize, setPageSize] = useState(15);
// //   const [totalPages, setTotalPages] = useState(1);

// //   const paginatedRecords = useMemo(() => {
// //     const start = (currentPage - 1) * pageSize;
// //     return salaryRecords.slice(start, start + pageSize);
// //   }, [salaryRecords, currentPage, pageSize]);

// //   const salaryColumns = [
// //     { value: "effectDt", label: "Effective Date *", key: "effectDt", type: "date", id: "effectDt" },
// //     { value: "endDt", label: "End Date", key: "endDt", type: "date", id: "endDt" },
// //     { value: "workYrHrsNo", label: "Work Hours *", key: "workYrHrsNo", id: "workYrHrsNo" },
// //     { value: "hrlyAmt", label: "Hourly Amount", key: "hrlyAmt", id: "hrlyAmt" },
// //     { value: "salAmt", label: "Payroll Salary Amount", key: "salAmt", id: "salAmt" },
// //     { value: "annlAmt", label: "Annual Amount", key: "annlAmt", id: "annlAmt" },
// //     { value: "pctIncrRt", label: "Percent of Increase", key: "pctIncrRt", id: "pctIncrRt" },
// //     { value: "stdEstHrs", label: "Estimated Annual Hours", key: "stdEstHrs", id: "stdEstHrs" },
// //     { value: "stdRate", label: "Standard Hourly Rate", key: "stdRate", id: "stdRate" },
// //     { value: "empClass", label: "Employee Class", key: "empClass", id: "empClass" },
// //     { value: "sEmplTypeCd", label: "Employee Type", key: "sEmplTypeCd", id: "sEmplTypeCd" },
// //     { value: "sHrlySalCd", label: "Rate Type", key: "sHrlySalCd", id: "sHrlySalCd" },
// //     { value: (item) => item.exmptFl === 'Y' || item.exmptFl === true, label: "FLSA Exempt", key: "exmptFl", type: "checkbox", id: "exmptFl" },
// //     { value: (item) => item.seasonEmplFl === 'Y' || item.seasonEmplFl === true, label: "Seasonal Employee", key: "seasonEmplFl", type: "checkbox", id: "seasonEmplFl" },
// //     { value: (item) => item.variableHrsFl === 'Y' || item.variableHrsFl === true, label: "Variable Hour Employee", key: "variableHrsFl", type: "checkbox", id: "variableHrsFl" },
// //     { value: "detlJobCd", label: "Detail Job Code", key: "detlJobCd", id: "detlJobCd" },
// //     { value: "titleDesc", label: "Detail Job Title", key: "titleDesc", id: "titleDesc" },
// //     { value: (item) => item.corpOfcrFl === 'Y' || item.corpOfcrFl === true, label: "Corporate Officer", key: "corpOfcrFl", type: "checkbox", id: "corpOfcrFl" },
// //     { value: "mgrEmplId1", label: "Manager", key: "mgrEmplId1", id: "mgrEmplId1" },
// //     { value: "managerName", label: "Manager Name", key: "managerName", id: "managerName" },
// //     { value: "spvsrEmplId", label: "Supervisor", key: "spvsrEmplId", id: "spvsrEmplId" },
// //     { value: "supervisorName", label: "Supervisor Name", key: "supervisorName", id: "supervisorName" },
// //     { value: "labGrpType", label: "Labor Group", key: "labGrpType", id: "labGrpType" },
// //     { value: "labLocCd", label: "Labor Location", key: "labLocCd", id: "labLocCd" },
// //     { value: "genlLabCatCd", label: "GLC", key: "genlLabCatCd", id: "genlLabCatCd" },
// //     { value: "plc", label: "PLC", key: "plc", id: "plc" },
// //     { value: "workStateCd", label: "Overtime State", key: "workStateCd", id: "workStateCd" },
// //     { value: "orgId", label: "Home Organization", key: "orgId", id: "orgId" },
// //     { value: "secOrgId", label: "Security Organization", key: "secOrgId", id: "secOrgId" },
// //     { value: "hrOrgId", label: "HR Organization", key: "hrOrgId", id: "hrOrgId" },
// //     { value: "persActRsnCd", label: "Personnel Action 1", key: "persActRsnCd", id: "persActRsnCd" },
// //     { value: "pa1Desc", label: "Personnel Action 1 Description", key: "pa1Desc", id: "pa1Desc" },
// //     { value: "persActRsnCd2", label: "Personnel Action 2", key: "persActRsnCd2", id: "persActRsnCd2" },
// //     { value: "pa2Desc", label: "Personnel Action 2 Description", key: "pa2Desc", id: "pa2Desc" },
// //     { value: "persActRsnCd3", label: "Personnel Action 3", key: "persActRsnCd3", id: "persActRsnCd3" },
// //     { value: "pa3Desc", label: "Personnel Action 3 Description", key: "pa3Desc", id: "pa3Desc" },
// //     { value: "tcTsSchedCd", label: "Time Collection", key: "tcTsSchedCd", id: "tcTsSchedCd" },
// //     { value: "tcWorkSchedCd", label: "Work Schedule", key: "tcWorkSchedCd", id: "tcWorkSchedCd" },
// //     { value: "homeRef1Id", label: "Ref No 1", key: "homeRef1Id", id: "homeRef1Id" },
// //     { value: "homeRef2Id", label: "Ref No 2", key: "homeRef2Id", id: "homeRef2Id" },
// //     { value: "compPlanCd", label: "Compensation Plan", key: "compPlanCd", id: "compPlanCd" },
// //     { value: "sStepNo", label: "Step", key: "sStepNo", id: "sStepNo" },
// //     { value: "salGradeCd", label: "Grade", key: "salGradeCd", id: "salGradeCd" },
// //     { value: "reviewFormId", label: "Review Form", key: "reviewFormId", id: "reviewFormId" },
// //     { value: "overallRt", label: "Rating", key: "overallRt", id: "overallRt" },
// //     { value: "pctGradeChange", label: "Percent Grade Change", key: "pctGradeChange", id: "pctGradeChange" },
// //     { value: "pctRatingChange", label: "Percent Rating Change", key: "pctRatingChange", id: "pctRatingChange" },
// //     { value: "affPlanCd", label: "Affirmative Action Plan", key: "affPlanCd", id: "affPlanCd" },
// //     { value: "jobGroupCd", label: "Job Category", key: "jobGroupCd", id: "jobGroupCd" },
// //     { value: "eeoCode", label: "EEO Code", key: "eeoCode", id: "eeoCode" },
// //     { value: (item) => item.hireDtFl === 'Y' || item.hireDtFl === true, label: "Effective is Hire Date", key: "hireDtFl", type: "checkbox", id: "hireDtFl" },
// //     { value: "caRemoteWorker", label: "California Pay Data Reporting Remote Worker Status", key: "caRemoteWorker", id: "caRemoteWorker" },
// //     { value: (item) => item.termDtFl === 'Y' || item.termDtFl === true, label: "Effective Date is Term Date", key: "termDtFl", type: "checkbox", id: "termDtFl" },
// //     { value: "aaComments", label: "HR Info Comments", key: "aaComments", id: "aaComments" },
// //     { value: "comments", label: "Comments", key: "comments", id: "comments" },
// //   ];

// //   const getRowKey = (row) => String(row.tempId || row.emplId || row.id || "");

// //   // --- Find & Replace Logic (Generic Integration) ---
// //   const handleNestedFindReplace = (config, isReplaceMode) => {
// //     const { column, findYear, findMonth, replaceValue, booleanMode, replaceYear, replaceMonth } = config;
// //     if (!column) return toast.warn("Please select a column.");

// //     let count = 0;
// //     const updated = salaryRecords.map(row => {
// //       let matches = false;
// //       const currentVal = String(row[column] || "");
// //       const colDef = salaryColumns.find(c => c.id === column);

// //       if (colDef?.type === "date") {
// //         const parts = currentVal.split("-"); // [YYYY, MM, DD]
// //         const y = parts[0];
// //         const m = parts[1];
// //         matches = (!findYear || y === findYear) && (!findMonth || m === findMonth);
// //       } else if (colDef?.type === "flag") {
// //         matches = booleanMode === "setAll" || (booleanMode === "inverted");
// //       } else {
// //         matches = currentVal.toLowerCase().includes(String(findYear || "").toLowerCase());
// //       }

// //       if (matches) {
// //         count++;
// //         let newVal = replaceValue;
// //         if (isReplaceMode) {
// //           if (colDef?.type === "date") {
// //             const parts = currentVal.split("-");
// //             const y = replaceYear || parts[0];
// //             const m = replaceMonth || parts[1];
// //             const d = parts[2] || "01";
// //             newVal = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
// //           } else if (colDef?.type === "flag" && booleanMode === "inverted") {
// //             newVal = currentVal === "Y" ? "N" : "Y";
// //           }
// //           return { ...row, [column]: newVal, isDirty: true };
// //         }
// //         return row;
// //       }
// //       return row;
// //     });

// //     if (count > 0) {
// //       if (isReplaceMode) {
// //         setSalaryRecords(updated);
// //         toast.success(`Replaced ${count} matches in ${column}`);
// //       } else {
// //         toast.info(`Found ${count} matches in ${column}`);
// //       }
// //     } else {
// //       toast.info("No matches found.");
// //     }
// //   };

// //   const jumpToCode = (code) => {
// //     const idx = salaryRecords.findIndex(r => 
// //       String(r.effectDt).includes(code) || 
// //       String(r.orgId).includes(code) ||
// //       String(getRowKey(r)).includes(code)
// //     );
// //     if (idx !== -1) {
// //       setCurrentIndex(idx);
// //       setSelectedIds(new Set([getRowKey(salaryRecords[idx])]));
// //       setIsFormView(true);
// //       // Also calculate which page this record is on
// //       const page = Math.floor(idx / pageSize) + 1;
// //       setCurrentPage(page);
// //     } else {
// //       toast.info("Record not found.");
// //     }
// //   };

// //   const handleNavigate = (direction) => {
// //     let newIdx = currentIndex;
// //     if (direction === "start") newIdx = 0;
// //     else if (direction === "end") newIdx = salaryRecords.length - 1;
// //     else if (direction === "next") newIdx = Math.min(salaryRecords.length - 1, currentIndex + 1);
// //     else if (direction === "prev") newIdx = Math.max(0, currentIndex - 1);

// //     setCurrentIndex(newIdx);
// //     if (salaryRecords[newIdx]) {
// //       setSelectedIds(new Set([getRowKey(salaryRecords[newIdx])]));
// //     }
// //   };

// //   // --- Field Change Logic ---
// //   const handleFieldChange = (rowId, field, value) => {
// //     setSalaryRecords((prev) =>
// //       prev.map((rec) =>
// //         getRowKey(rec) === String(rowId) ? { ...rec, [field]: value, isDirty: true } : rec
// //       )
// //     );
// //   };

// //   // --- API Handlers ---
// //   const fetchSalaryData = async () => {
// //     if (!emplId) return;
// //     setLoading(true);
// //     try {
// //       const res = await api.get(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/latest`);
// //       const fetchedData = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
// //       setSalaryRecords(fetchedData.map(item => ({ ...item, isDirty: false })));
// //       setTotalPages(Math.ceil(fetchedData.length / pageSize) || 1);
// //       setCurrentPage(1);
// //       setCurrentIndex(0);
// //     } catch (error) {
// //       toast.error("Failed to fetch salary records");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { if(emplId) fetchSalaryData(); }, [emplId]);

// //   const handleSave = async () => {
// //     const dirtyRecords = salaryRecords.filter((r) => r.isDirty);
// //     if (dirtyRecords.length === 0) {
// //       toast.info("No changes to save.");
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       for (const labor of dirtyRecords) {
// //         // Construct payload as per EmployeeSubComponents
// //         const payload = {
// //           emplId: String(emplId), 
// //           effectDt: labor.effectDt || null,
// //           endDt: labor.endDt || null,
// //           hrlyAmt: parseFloat(labor.hrlyAmt || 0),
// //           salAmt: parseFloat(labor.salAmt || 0),
// //           annlAmt: parseFloat(labor.annlAmt || 0),
// //           workYrHrsNo: parseFloat(labor.workYrHrsNo || 2080),
// //           stdEstHrs: parseFloat(labor.stdEstHrs || 2080),
// //           pctIncrRt: parseFloat(labor.pctIncrRt || 0),
// //           corpOfcrFl: !!(labor.corpOfcrFl === true || labor.corpOfcrFl === "Y"),
// //           seasonEmplFl: !!(labor.seasonEmplFl === true || labor.seasonEmplFl === "Y"),
// //           variableHrsFl: !!(labor.variableHrsFl === true || labor.variableHrsFl === "Y"),
// //           hireDtFl: !!(labor.hireDtFl === true || labor.hireDtFl === "Y"),
// //           termDtFl: !!(labor.termDtFl === true || labor.termDtFl === "Y"),
// //           sHrlySalCd: labor.sHrlySalCd || "H",
// //           sEmplTypeCd: labor.sEmplTypeCd || "REG",
// //           exmptFl: labor.exmptFl || "N",
// //           orgId: labor.orgId || "",
// //           secOrgId: labor.secOrgId || "",
// //           hrOrgId: labor.hrOrgId || "",
// //           titleDesc: labor.titleDesc || "",
// //           detlJobCd: labor.detlJobCd || "",
// //           mgrEmplId1: labor.mgrEmplId1 || "",
// //           managerName: labor.managerName || "",
// //           spvsrEmplId: labor.spvsrEmplId || "",
// //           supervisorName: labor.supervisorName || "",
// //           genlLabCatCd: labor.genlLabCatCd || "",
// //           labGrpType: labor.labGrpType || "LG1",
// //           labLocCd: labor.labLocCd || "",
// //           workStateCd: labor.workStateCd || "ST",
// //           persActRsnCd: labor.persActRsnCd || "",
// //           pa1Desc: labor.pa1Desc || "",
// //           persActRsnCd2: labor.persActRsnCd2 || "",
// //           pa2Desc: labor.pa2Desc || "",
// //           persActRsnCd3: labor.persActRsnCd3 || "",
// //           pa3Desc: labor.pa3Desc || "",
// //           compPlanCd: labor.compPlanCd || "",
// //           salGradeCd: labor.salGradeCd || "",
// //           sStepNo: String(labor.sStepNo || ""),
// //           stdRate: parseFloat(labor.stdRate || 0),
// //           empClass: labor.empClass || "",
// //           plc: labor.plc || "",
// //           pctGradeChange: parseFloat(labor.pctGradeChange || 0),
// //           pctRatingChange: parseFloat(labor.pctRatingChange || 0),
// //           eeoCode: labor.eeoCode || "",
// //           reviewFormId: labor.reviewFormId || "",
// //           overallRt: labor.overallRt || "",
// //           affPlanCd: labor.affPlanCd || "",
// //           jobGroupCd: labor.jobGroupCd || "",
// //           comments: labor.comments || "",
// //           aaComments: labor.aaComments || "",
// //           caRemoteWorker: labor.caRemoteWorker || "none",
// //           tcTsSchedCd: labor.tcTsSchedCd || "",
// //           tcWorkSchedCd: labor.tcWorkSchedCd || "",
// //           homeRef1Id: labor.homeRef1Id || "",
// //           homeRef2Id: labor.homeRef2Id || "",
// //           modifiedBy1: "SystemUser"
// //         };

// //           if (String(getRowKey(labor)).startsWith("NEW")) {
// //             await api.post(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo`, payload);
// //           } else {
// //             const putDate = payload.effectDt?.split('T')[0];
// //             await api.put(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/${putDate}`, payload);
// //           }
// //       }
// //       toast.success("Salary changes saved successfully.", { toastId: "salary-save-success" });
// //       setSalaryRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
// //     } catch (err) {
// //       toast.error(err.response?.data?.title || "Error saving records.", { toastId: "salary-save-error" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (selectedIds.size === 0) return toast.info("Please select records to delete.");
// //     if (!window.confirm("Delete selected salary records?")) return;

// //     setLoading(true);
// //     try {
// //       for (const id of Array.from(selectedIds)) {
// //         if (!String(id).startsWith("NEW")) {
// //           const labor = salaryRecords.find(r => getRowKey(r) === id);
// //           if (labor) {
// //             const rawDate = labor.effectDt || "";
// //             const effectDt = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
// //             if (effectDt) {
// //               await api.delete(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/${effectDt}`);
// //             }
// //           }
// //         }
// //       }
// //       // Local UI Update instead of re-fetching
// //       const deletedIdsArray = Array.from(selectedIds);
// //       setSalaryRecords(prev => prev.filter(r => !deletedIdsArray.includes(getRowKey(r))));

// //       toast.success("Records deleted successfully.", { toastId: "salary-delete-success" });
// //       setSelectedIds(new Set());
// //     } catch (err) {
// //       toast.error(err.response?.data?.title || "Error deleting records.", { toastId: "salary-delete-error" });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const activeLabor = salaryRecords[currentIndex] || {};

// //   return (
// //     <div className="h-full flex flex-col">
// //       <MainContainer title="Manage Employee Salary">
// //         <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-200 bg-white">
// //           <div className="flex items-center gap-3">
// //             <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee ID</label>
// //             <div className="relative">
// //               <input 
// //                 type="text" 
// //                 value={emplId} 
// //                 onChange={(e) => setEmplId(e.target.value)}
// //                 onKeyDown={(e) => e.key === 'Enter' && fetchSalaryData()}
// //                 className="w-24 px-2 py-1 text-xs font-bold text-[#17414d] border border-gray-300 rounded outline-none focus:border-[#17414d] transition-all"
// //                 placeholder="Enter ID..."
// //               />
// //               <button 
// //                 onClick={fetchSalaryData}
// //                 className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#17414d] transition-colors"
// //               >
// //                 <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         <Toolbar
// //           isFormView={isFormView}
// //           columns={salaryColumns}
// //           handleFindReplace={handleNestedFindReplace}
// //           currentIndex={currentIndex}
// //           totalRecords={salaryRecords.length}
// //           handleNavigate={handleNavigate}
// //           jumpToCode={jumpToCode}
// //           searchValue={searchValue}
// //           setSearchValue={setSearchValue}
// //           isDirty={salaryRecords.some(r => r.isDirty)}
// //           loading={loading}
// //           actions={{
// //             onToggleView: () => setIsFormView(!isFormView),
// //             onSave: handleSave,
// //             onAdd: () => {
// //               const newRec = {
// //                 tempId: `NEW_${Date.now()}`,
// //                 isDirty: true,
// //                 emplId: emplId,
// //                 workYrHrsNo: "2080",
// //                 effectDt: new Date().toISOString().split('T')[0]
// //               };
// //               setSalaryRecords([newRec, ...salaryRecords]);
// //               const newKey = getRowKey(newRec);
// //               setSelectedIds(new Set([newKey]));
// //               setCurrentIndex(0);
// //               toast.info("New record added.");
// //             },
// //             onDelete: handleDelete,
// //             onClear: () => {
// //                 if (window.confirm("Discard all unsaved changes?")) {
// //                     fetchSalaryData();
// //                 }
// //             }
// //           }}
// //         />

// //         <div className="flex-1 overflow-auto p-4 bg-gray-50">
// //           {isFormView ? (
// //             <div className="bg-white rounded-xl border border-gray-200">
// //               <div className="flex border-b border-gray-200 px-2 bg-white rounded-t-xl">
// //                 {["Salary Info", "HR Information", "Comments"].map((tab) => (
// //                   <button
// //                     key={tab}
// //                     onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
// //                     className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${activeTab === tab.toLowerCase().replace(" ", "")
// //                         ? "border-b-2 border-[#17414d] text-[#17414d]"
// //                         : "text-gray-500 hover:text-[#17414d]"
// //                       }`}
// //                   >
// //                     {tab}
// //                   </button>
// //                 ))}
// //               </div>

// //               <div className="p-6">

// //                 {activeTab === "salaryinfo" && (
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
// //                     <FormSection title="Compensation">
// //                       <FormInput label="Effective Date *" type="date" value={activeLabor.effectDt?.split('T')[0] ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'effectDt', e.target.value)} />
// //                       <FormInput label="End Date" type="date" value={activeLabor.endDt?.split('T')[0] ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'endDt', e.target.value)} />
// //                       <FormInput label="Work Hours In Year *" value={activeLabor.workYrHrsNo ?? "2080"} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'workYrHrsNo', e.target.value)} />
// //                       <FormInput label="Hourly Amount" value={activeLabor.hrlyAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hrlyAmt', e.target.value)} />
// //                       <FormInput label="Payroll Salary Amount" value={activeLabor.salAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'salAmt', e.target.value)} />
// //                       <FormInput label="Annual Amount" value={activeLabor.annlAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'annlAmt', e.target.value)} />
// //                       <FormInput label="Percent of Increase" value={activeLabor.pctIncrRt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctIncrRt', e.target.value)} />
// //                       <FormInput label="Estimated Annual Hours" value={activeLabor.stdEstHrs ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'stdEstHrs', e.target.value)} />
// //                       <FormInput label="Standard Hourly Rate" value={activeLabor.stdRate ?? ""} readOnly />
// //                       <FormInput label="Employee Class" value={activeLabor.empClass ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'empClass', e.target.value)} />
// //                       <FormInput label="Employee Type" type="select" value={activeLabor.sEmplTypeCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sEmplTypeCd', e.target.value)} options={[]} />
// //                       <FormInput label="Rate Type" type="select" value={activeLabor.sHrlySalCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sHrlySalCd', e.target.value)} options={[]} />
// //                       <div className="flex items-center gap-4 py-1 ml-[90px]">
// //                         <span className="text-[10px] font-bold text-gray-700 uppercase">FLSA Classification</span>
// //                         <div className="flex gap-4">
// //                           <FormInput label="Exempt" type="radio" name="flsa" checked={activeLabor.exmptFl === 'Y'} onChange={() => handleFieldChange(getRowKey(activeLabor), 'exmptFl', 'Y')} />
// //                           <FormInput label="Non-Exempt" type="radio" name="flsa" checked={activeLabor.exmptFl === 'N'} onChange={() => handleFieldChange(getRowKey(activeLabor), 'exmptFl', 'N')} />
// //                         </div>
// //                       </div>
// //                       <FormInput
// //                         label="Seasonal Employee"
// //                         type="checkbox"
// //                         checked={!!(activeLabor.seasonEmplFl === true || activeLabor.seasonEmplFl === 'Y')}
// //                         onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'seasonEmplFl', e.target.checked)}
// //                       />
// //                       <FormInput
// //                         label="Variable Hour Employee"
// //                         type="checkbox"
// //                         checked={!!(activeLabor.variableHrsFl === true || activeLabor.variableHrsFl === 'Y')}
// //                         onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'variableHrsFl', e.target.checked)}
// //                       />
// //                       <FormInput label="Detail Job Title" value={activeLabor.titleDesc ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'titleDesc', e.target.value)} />
// //                       <FormInput
// //                         label="Corporate Officer"
// //                         type="checkbox"
// //                         checked={!!(activeLabor.corpOfcrFl === true || activeLabor.corpOfcrFl === 'Y')}
// //                         onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'corpOfcrFl', e.target.checked)}
// //                       />
// //                       <FormInput label="Manager" value={activeLabor.mgrEmplId1 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'mgrEmplId1', e.target.value)} />
// //                       <FormInput label="Manager Name" value={activeLabor.managerName ?? ""} readOnly />
// //                       <FormInput label="Supervisor" value={activeLabor.spvsrEmplId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'spvsrEmplId', e.target.value)} />
// //                       <FormInput label="Supervisor Name" value={activeLabor.supervisorName ?? ""} readOnly />
// //                     </FormSection>

// //                     <FormSection title="Organization & Details">
// //                       <FormInput label="Labor Group" value={activeLabor.labGrpType ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'labGrpType', e.target.value)} />
// //                       <FormInput label="Labor Location" value={activeLabor.labLocCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'labLocCd', e.target.value)} />
// //                       <FormInput label="GLC *" value={activeLabor.genlLabCatCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'genlLabCatCd', e.target.value)} />
// //                       <FormInput label="PLC" value={activeLabor.plc ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'plc', e.target.value)} />
// //                       <FormInput label="Overtime State *" value={activeLabor.workStateCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'workStateCd', e.target.value)} />
// //                       <FormInput label="Home Organization *" value={activeLabor.orgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'orgId', e.target.value)} />
// //                       <FormInput label="Security Organization" value={activeLabor.secOrgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'secOrgId', e.target.value)} />
// //                       <FormInput label="HR Organization" value={activeLabor.hrOrgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hrOrgId', e.target.value)} />
// //                       <FormInput label="Personnel Action 1" value={activeLabor.persActRsnCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd', e.target.value)} />
// //                       <FormInput label="PA 1 Description" value={activeLabor.pa1Desc ?? ""} readOnly />
// //                       <FormInput label="Personnel Action 2" value={activeLabor.persActRsnCd2 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd2', e.target.value)} />
// //                       <FormInput label="PA 2 Description" value={activeLabor.pa2Desc ?? ""} readOnly />
// //                       <FormInput label="Personnel Action 3" value={activeLabor.persActRsnCd3 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd3', e.target.value)} />
// //                       <FormInput label="PA 3 Description" value={activeLabor.pa3Desc ?? ""} readOnly />
// //                       <FormInput label="Time Collection" value={activeLabor.tcTsSchedCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'tcTsSchedCd', e.target.value)} />
// //                       <FormInput label="Work Schedule" value={activeLabor.tcWorkSchedCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'tcWorkSchedCd', e.target.value)} />
// //                       <FormInput label="Ref No 1" value={activeLabor.homeRef1Id ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'homeRef1Id', e.target.value)} />
// //                       <FormInput label="Ref No 2" value={activeLabor.homeRef2Id ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'homeRef2Id', e.target.value)} />
// //                     </FormSection>
// //                   </div>
// //                 )}

// //                 {activeTab === "hrinformation" && (
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //                     <FormSection title="Compensation Data">
// //                       <FormInput label="Compensation Plan" value={activeLabor.compPlanCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'compPlanCd', e.target.value)} />
// //                       <FormInput label="Step" value={activeLabor.sStepNo ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sStepNo', e.target.value)} />
// //                       <FormInput label="Grade" value={activeLabor.salGradeCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'salGradeCd', e.target.value)} />
// //                       <FormInput label="Review Form" value={activeLabor.reviewFormId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'reviewFormId', e.target.value)} />
// //                       <FormInput label="Rating" value={activeLabor.overallRt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'overallRt', e.target.value)} />
// //                       <FormInput label="Percent Grade Change" value={activeLabor.pctGradeChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctGradeChange', e.target.value)} />
// //                       <FormInput label="Percent Rating Change" value={activeLabor.pctRatingChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctRatingChange', e.target.value)} />
// //                       <FormInput label="EEO Code" value={activeLabor.eeoCode ?? ""} readOnly />
// //                       <FormInput label="Percent Rating Change" value={activeLabor.pctRatingChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctRatingChange', e.target.value)} />
// //                     </FormSection>

// //                     <FormSection title="Affirmative Action Data">
// //                       <FormInput label="Affirmative Action Plan" value={activeLabor.affPlanCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'affPlanCd', e.target.value)} />
// //                       <FormInput label="Job Category" value={activeLabor.jobGroupCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'jobGroupCd', e.target.value)} />
// //                       <FormInput label="EEO Code" value={activeLabor.eeoCode ?? ""} readOnly />
// //                       <div className="ml-[90px] space-y-1 py-1">
// //                         <div className="flex items-center gap-2">
// //                           <input type="checkbox" checked={activeLabor.hireDtFl === true || activeLabor.hireDtFl === 'Y'} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hireDtFl', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
// //                           <label className="text-[10px] text-gray-700">Effective Date is Hire Date</label>
// //                         </div>
// //                         <div className="flex items-center gap-2">
// //                           <input type="checkbox" checked={activeLabor.termDtFl === true || activeLabor.termDtFl === 'Y'} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'termDtFl', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
// //                           <label className="text-[10px] text-gray-700">Effective Date is Term Date</label>
// //                         </div>
// //                       </div>
// //                       <FormInput label="California Pay Data Reporting Remote Worker Status" type="select" value={activeLabor.caRemoteWorker ?? ""} options={[{ label: "Does not work remotely", value: "none" }, { label: "Works Remotely", value: "remote" }]} optionLabel="label" optionValue="value" />
// //                       <div className="mt-2">
// //                         <label className="text-[10px] font-semibold text-gray-800 block mb-1">Comments</label>
// //                         <textarea className="w-full h-20 p-2 border border-gray-300 rounded text-xs outline-none focus:border-[#17414d]" value={activeLabor.aaComments ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'aaComments', e.target.value)} />
// //                       </div>
// //                     </FormSection>
// //                   </div>
// //                 )}

// //                 {activeTab === "comments" && (
// //                   <div className="p-2">
// //                     <FormSection title="Comments">
// //                       <div className="relative group">
// //                         <textarea className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d] transition-all resize-none bg-white shadow-inner" placeholder="Enter additional salary or HR comments here..." value={activeLabor.comments ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'comments', e.target.value)} />
// //                       </div>
// //                     </FormSection>
// //                   </div>
// //                 )}
// //               </div>
// //               </div>

// //           ) : (
// //             <ReusableTable
// //               data={paginatedRecords}
// //               columns={salaryColumns}
// //               selectedRows={selectedIds}
// //               onRowSelect={(row) => {
// //                 const idx = salaryRecords.findIndex(r => getRowKey(r) === getRowKey(row));
// //                 setCurrentIndex(idx);
// //                 setSelectedIds(new Set([getRowKey(row)]));
// //               }}
// //               onFieldChange={handleFieldChange}
// //               maxHeight="max-h-[65vh]"
// //             />
// //           )}
// //         </div>

// //         {!isFormView && (
// //           <div className="w-full bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 mt-1 rounded-b-xl">
// //             {/* Back Button */}
// //             <button
// //               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
// //               className="text-[#17414d] disabled:opacity-30"
// //               disabled={currentPage === 1}
// //             >
// //               <ChevronLeft size={18} />
// //             </button>

// //             {/* Page Indicator */}
// //             <div className="flex items-center gap-1">
// //               <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#17414d] text-white font-bold text-xs">
// //                 {currentPage}
// //               </span>
// //               <span className="text-gray-500 text-xs px-1">of {totalPages}</span>
// //             </div>

// //             {/* Next Button */}
// //             <button
// //               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
// //               className="text-[#17414d] disabled:opacity-30"
// //               disabled={currentPage === totalPages}
// //             >
// //               <ChevronRight size={18} />
// //             </button>

// //             {/* Page Size Selector */}
// //             <div className="relative flex items-center rounded px-2 bg-white ml-2 border border-gray-200">
// //               <select
// //                 value={pageSize}
// //                 onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
// //                 className="appearance-none bg-transparent py-1 pr-6 pl-1 focus:outline-none cursor-pointer text-[10px] font-bold text-black"
// //               >
// //                 <option value={15}>15 / page</option>
// //                 <option value={25}>25 / page</option>
// //                 <option value={50}>50 / page</option>
// //               </select>
// //               <ChevronRight size={14} className="absolute right-1 text-gray-400 pointer-events-none rotate-90" />
// //             </div>
// //           </div>
// //         )}
// //       </MainContainer>
// //     </div>
// //   );
// // };

// // export default ManageEmployeeSalary;

// // import React, { useState, useEffect } from "react";
// // import { DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
// // import { toast } from "react-toastify";
// // import api from "../utils/api";
// // import { MainContainer, Toolbar } from "../helper/container";
// // import { ReusableTable } from "../helper/tableSection";
// // import { FormSection, FormInput } from "../helper/formSection";

// // const ManageEmployeeSalary = () => {
// //   // --- View States ---
// //   const [isFormView, setIsFormView] = useState(false);
// //   const [activeTab, setActiveTab] = useState("salaryInfo");
// //   const [loading, setLoading] = useState(false);

// //   // --- Data States ---
// //   const [salaryRecords, setSalaryRecords] = useState([]);
// //   const [masterRecords, setMasterRecords] = useState([]);
// //   const [selectedRow, setSelectedRow] = useState(null);
// //   const [selectedIds, setSelectedIds] = useState(new Set());
// //   const [clipboard, setClipboard] = useState([]);

// //   // --- Search/Pagination States ---
// //   const [searchValue, setSearchValue] = useState("");
// //   const [searchColumn, setSearchColumn] = useState("effDate");
// //   const [currentPage, setCurrentPage] = useState(1);

// //   // --- Column Configuration (Matches images exactly) ---
// //   const salaryColumns = [
// //     { label: "Effective Date *", key: "effDate", type: "date", value: "effDate" },
// //     { label: "End Date", key: "endDate", type: "date", value: "endDate" },
// //     { label: "Work Hours In Year *", key: "workHours", value: "workHours" },
// //     { label: "Hourly Amount", key: "hourlyAmount", value: "hourlyAmount" },
// //     { label: "Payroll Salary Amount", key: "payrollSalary", value: "payrollSalary" },
// //     { label: "Annual Amount", key: "annualAmount", value: "annualAmount" },
// //     { label: "GLC *", key: "glc", value: "glc" },
// //     { label: "Home Organization *", key: "homeOrg", value: "homeOrg" },
// //     { label: "Labor Group", key: "laborGroup", value: "laborGroup" },
// //     { label: "Manager", key: "manager", value: "manager" },
// //     { label: "Supervisor", key: "supervisor", value: "supervisor" },
// //     { label: "Job Title", key: "detailJobTitle", value: "detailJobTitle" },
// //   ];

// //   // --- API Handlers ---
// //   const fetchSalaryData = async () => {
// //     setLoading(true);
// //     try {
// //       const baseUrl = "https://planning-master.onrender.com/api/EmployeeSalary";
// //       const res = await api.get(baseUrl);
// //       const data = res.data.map((item) => ({
// //         ...item,
// //         id: item.tempId || item.effDate, // Unique ID for selection
// //         isDirty: false,
// //       }));
// //       setSalaryRecords(data);
// //       setMasterRecords(data);
// //     } catch (error) {
// //       toast.error("Failed to fetch salary records");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { fetchSalaryData(); }, []);

// //   // --- Field Change Handler ---
// //   const handleFieldChange = (id, field, value) => {
// //     const stringId = String(id);
// //     const update = (prev) =>
// //       prev.map((row) =>
// //         String(row.id) === stringId ? { ...row, [field]: value, isDirty: true } : row
// //       );

// //     setSalaryRecords(update);
// //     if (selectedRow && String(selectedRow.id) === stringId) {
// //       setSelectedRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// //     }
// //   };

// //   // --- Action Button Logic ---
// //   const handleAdd = () => {
// //     const newRecord = {
// //       id: `NEW_${Date.now()}`,
// //       effDate: "",
// //       workHours: "2080",
// //       homeOrg: "",
// //       glc: "",
// //       isDirty: true,
// //       tempId: `NEW_${Date.now()}`,
// //     };
// //     setSalaryRecords([newRecord, ...salaryRecords]);
// //     setSelectedRow(newRecord);
// //     setIsFormView(true);
// //   };

// //   const handleSave = async () => {
// //     if (!selectedRow?.isDirty) return toast.info("No changes to save.");
// //     setLoading(true);
// //     try {
// //       const isNew = String(selectedRow.id).startsWith("NEW_");
// //       const method = isNew ? "post" : "put";
// //       const url = isNew 
// //         ? "https://planning-master.onrender.com/api/EmployeeSalary" 
// //         : `https://planning-master.onrender.com/api/EmployeeSalary/${selectedRow.id}`;

// //       await api[method](url, selectedRow);
// //       toast.success("Salary information saved");
// //       fetchSalaryData();
// //     } catch (error) {
// //       toast.error("Save failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleCopy = () => {
// //     if (!selectedRow) return toast.warn("Select a record to copy");
// //     setClipboard([selectedRow]);
// //     toast.success("Record copied to clipboard");
// //   };

// //   const handlePaste = () => {
// //     if (!clipboard.length) return;
// //     const pasted = { ...clipboard[0], id: `PST_${Date.now()}`, isDirty: true };
// //     setSalaryRecords([pasted, ...salaryRecords]);
// //     toast.success("Record pasted");
// //   };

// //   // --- Render Sections ---
// //   const renderSalaryInfoTab = () => (
// //     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
// //       <FormSection title="Compensation">
// //         <FormInput label="Effective Date *" type="date" value={selectedRow?.effDate || ""} onChange={(e) => handleFieldChange(selectedRow.id, "effDate", e.target.value)} />
// //         <FormInput label="End Date" type="date" value={selectedRow?.endDate || ""} onChange={(e) => handleFieldChange(selectedRow.id, "endDate", e.target.value)} />
// //         <FormInput label="Work Hours In Year *" value={selectedRow?.workHours || "2080"} onChange={(e) => handleFieldChange(selectedRow.id, "workHours", e.target.value)} />
// //         <FormInput label="Hourly Amount" value={selectedRow?.hourlyAmount || ""} onChange={(e) => handleFieldChange(selectedRow.id, "hourlyAmount", e.target.value)} />
// //         <FormInput label="Payroll Salary Amount" value={selectedRow?.payrollSalary || ""} />
// //         <FormInput label="Annual Amount" value={selectedRow?.annualAmount || ""} />
// //       </FormSection>

// //       <FormSection title="Organization & Details">
// //         <FormInput label="Labor Group" value={selectedRow?.laborGroup || ""} onChange={(e) => handleFieldChange(selectedRow.id, "laborGroup", e.target.value)} />
// //         <FormInput label="GLC *" value={selectedRow?.glc || ""} onChange={(e) => handleFieldChange(selectedRow.id, "glc", e.target.value)} />
// //         <FormInput label="Home Organization *" value={selectedRow?.homeOrg || ""} onChange={(e) => handleFieldChange(selectedRow.id, "homeOrg", e.target.value)} />
// //         <FormInput label="Manager" value={selectedRow?.manager || ""} onChange={(e) => handleFieldChange(selectedRow.id, "manager", e.target.value)} />
// //         <FormInput label="Supervisor" value={selectedRow?.supervisor || ""} onChange={(e) => handleFieldChange(selectedRow.id, "supervisor", e.target.value)} />
// //       </FormSection>
// //     </div>
// //   );

// //   const renderHRInfoTab = () => (
// //     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// //       <FormSection title="Compensation Data">
// //         <FormInput label="Compensation Plan" value={selectedRow?.compPlan || ""} />
// //         <FormInput label="Grade" value={selectedRow?.grade || ""} readOnly />
// //         <FormInput label="Step" value={selectedRow?.step || ""} />
// //       </FormSection>
// //       <FormSection title="Affirmative Action Data">
// //         <FormInput label="Job Category" value={selectedRow?.jobCategory || ""} />
// //         <FormInput label="EEO Code" value={selectedRow?.eeoCode || ""} readOnly />
// //       </FormSection>
// //     </div>
// //   );

// //   return (
// //     <div className="p-4 font-inter">
// //       <MainContainer icon={DollarSign} title="Manage Employee Salary Information">
// //         <Toolbar
// //           isFormView={isFormView}
// //           columns={salaryColumns}
// //           searchValue={searchValue}
// //           setSearchValue={setSearchValue}
// //           searchColumn={searchColumn}
// //           setSearchColumn={setSearchColumn}
// //           handleFind={() => {
// //             const filtered = masterRecords.filter(r => String(r[searchColumn]).toLowerCase().includes(searchValue.toLowerCase()));
// //             setSalaryRecords(filtered);
// //           }}
// //           actions={{
// //             onAdd: handleAdd,
// //             onSave: handleSave,
// //             onCopy: handleCopy,
// //             onPaste: handlePaste,
// //             onToggleView: () => setIsFormView(!isFormView),
// //             onClear: () => {
// //                 setSalaryRecords(masterRecords);
// //                 setIsFormView(false);
// //                 setSelectedRow(null);
// //             }
// //           }}
// //           selectedRow={selectedRow}
// //           isDirty={selectedRow?.isDirty}
// //           loading={loading}
// //         />

// //         <div className="m-2">
// //           {isFormView ? (
// //             <div className="space-y-4">
// //               {/* Tab Navigation (Underline Style) */}
// //               <div className="flex border-b border-gray-200 bg-white">
// //                 {["salaryInfo", "hrInfo", "comments"].map((t) => (
// //                   <button
// //                     key={t}
// //                     onClick={() => setActiveTab(t)}
// //                     className={`px-6 py-2 text-[11px] font-bold uppercase transition-all ${
// //                       activeTab === t ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-400 hover:text-[#17414d]"
// //                     }`}
// //                   >
// //                     {t.replace(/([A-Z])/g, ' $1')}
// //                   </button>
// //                 ))}
// //               </div>

// //               <div className="bg-white p-2">
// //                 {activeTab === "salaryInfo" && renderSalaryInfoTab()}
// //                 {activeTab === "hrInfo" && renderHRInfoTab()}
// //                 {activeTab === "comments" && (
// //                   <FormSection title="Comments">
// //                     <textarea
// //                       className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d]"
// //                       value={selectedRow?.salaryComments || ""}
// //                       onChange={(e) => handleFieldChange(selectedRow.id, "salaryComments", e.target.value)}
// //                     />
// //                   </FormSection>
// //                 )}
// //               </div>
// //             </div>
// //           ) : (
// //             <ReusableTable
// //               data={salaryRecords}
// //               columns={salaryColumns}
// //               selectedRows={selectedIds}
// //               onRowSelect={(row) => {
// //                 setSelectedRow(row);
// //                 setSelectedIds(new Set([String(row.id)]));
// //               }}
// //               onFieldChange={handleFieldChange}
// //               maxHeight="max-h-[65vh]"
// //             />
// //           )}
// //         </div>

// //         {/* Pagination Footer */}
// //         {!isFormView && (
// //           <div className="bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 rounded-b-xl">
// //             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="hover:text-[#17414d]"><ChevronLeft size={18} /></button>
// //             <span className="text-xs font-bold">{currentPage}</span>
// //             <button onClick={() => setCurrentPage(p => p + 1)} className="hover:text-[#17414d]"><ChevronRight size={18} /></button>
// //           </div>
// //         )}
// //       </MainContainer>
// //     </div>
// //   );
// // };

// // export default ManageEmployeeSalary;

// import React, { useState, useEffect, useMemo } from "react";
// import { DollarSign, ChevronLeft, ChevronRight, Search, Replace, RefreshCw } from "lucide-react";
// import { toast } from "react-toastify";
// import api from "../utils/api";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { FormSection, FormInput } from "../helper/formSection";
// import { backendUrl } from "./config";

// const ManageEmployeeSalary = () => {
//   // --- View & Loading States ---
//   const [isFormView, setIsFormView] = useState(false);
//   const [activeTab, setActiveTab] = useState("salaryinfo");
//   const [loading, setLoading] = useState(false);
//   const [emplId, setEmplId] = useState("10");

//   // --- Data States ---
//   const [salaryRecords, setSalaryRecords] = useState([]);
//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // --- Navigation & Search States ---
//   const [searchValue, setSearchValue] = useState("");
//   const [searchColumn, setSearchColumn] = useState("effectDt");
//   const [isReplaceMode, setIsReplaceMode] = useState(false);
//   const [replaceValue, setReplaceValue] = useState("");

//   // --- Pagination States ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(15);
//   const [totalPages, setTotalPages] = useState(1);

//   const paginatedRecords = useMemo(() => {
//     const start = (currentPage - 1) * pageSize;
//     return salaryRecords.slice(start, start + pageSize);
//   }, [salaryRecords, currentPage, pageSize]);

//   const salaryColumns = [
//     { value: "effectDt", label: "Effective Date *", key: "effectDt", type: "date", id: "effectDt" },
//     { value: "endDt", label: "End Date", key: "endDt", type: "date", id: "endDt" },
//     { value: "workYrHrsNo", label: "Work Hours *", key: "workYrHrsNo", id: "workYrHrsNo" },
//     { value: "hrlyAmt", label: "Hourly Amount", key: "hrlyAmt", id: "hrlyAmt" },
//     { value: "salAmt", label: "Payroll Salary Amount", key: "salAmt", id: "salAmt" },
//     { value: "annlAmt", label: "Annual Amount", key: "annlAmt", id: "annlAmt" },
//     { value: "pctIncrRt", label: "Percent of Increase", key: "pctIncrRt", id: "pctIncrRt" },
//     { value: "stdEstHrs", label: "Estimated Annual Hours", key: "stdEstHrs", id: "stdEstHrs" },
//     { value: "stdRate", label: "Standard Hourly Rate", key: "stdRate", id: "stdRate" },
//     { value: "empClass", label: "Employee Class", key: "empClass", id: "empClass" },
//     { value: "sEmplTypeCd", label: "Employee Type", key: "sEmplTypeCd", id: "sEmplTypeCd" },
//     { value: "sHrlySalCd", label: "Rate Type", key: "sHrlySalCd", id: "sHrlySalCd" },
//     { value: (item) => item.exmptFl === 'Y' || item.exmptFl === true, label: "FLSA Exempt", key: "exmptFl", type: "checkbox", id: "exmptFl" },
//     { value: (item) => item.seasonEmplFl === 'Y' || item.seasonEmplFl === true, label: "Seasonal Employee", key: "seasonEmplFl", type: "checkbox", id: "seasonEmplFl" },
//     { value: (item) => item.variableHrsFl === 'Y' || item.variableHrsFl === true, label: "Variable Hour Employee", key: "variableHrsFl", type: "checkbox", id: "variableHrsFl" },
//     { value: "detlJobCd", label: "Detail Job Code", key: "detlJobCd", id: "detlJobCd" },
//     { value: "titleDesc", label: "Detail Job Title", key: "titleDesc", id: "titleDesc" },
//     { value: (item) => item.corpOfcrFl === 'Y' || item.corpOfcrFl === true, label: "Corporate Officer", key: "corpOfcrFl", type: "checkbox", id: "corpOfcrFl" },
//     { value: "mgrEmplId1", label: "Manager", key: "mgrEmplId1", id: "mgrEmplId1" },
//     { value: "managerName", label: "Manager Name", key: "managerName", id: "managerName" },
//     { value: "spvsrEmplId", label: "Supervisor", key: "spvsrEmplId", id: "spvsrEmplId" },
//     { value: "supervisorName", label: "Supervisor Name", key: "supervisorName", id: "supervisorName" },
//     { value: "labGrpType", label: "Labor Group", key: "labGrpType", id: "labGrpType" },
//     { value: "labLocCd", label: "Labor Location", key: "labLocCd", id: "labLocCd" },
//     { value: "genlLabCatCd", label: "GLC", key: "genlLabCatCd", id: "genlLabCatCd" },
//     { value: "plc", label: "PLC", key: "plc", id: "plc" },
//     { value: "workStateCd", label: "Overtime State", key: "workStateCd", id: "workStateCd" },
//     { value: "orgId", label: "Home Organization", key: "orgId", id: "orgId" },
//     { value: "secOrgId", label: "Security Organization", key: "secOrgId", id: "secOrgId" },
//     { value: "hrOrgId", label: "HR Organization", key: "hrOrgId", id: "hrOrgId" },
//     { value: "persActRsnCd", label: "Personnel Action 1", key: "persActRsnCd", id: "persActRsnCd" },
//     { value: "pa1Desc", label: "Personnel Action 1 Description", key: "pa1Desc", id: "pa1Desc" },
//     { value: "persActRsnCd2", label: "Personnel Action 2", key: "persActRsnCd2", id: "persActRsnCd2" },
//     { value: "pa2Desc", label: "Personnel Action 2 Description", key: "pa2Desc", id: "pa2Desc" },
//     { value: "persActRsnCd3", label: "Personnel Action 3", key: "persActRsnCd3", id: "persActRsnCd3" },
//     { value: "pa3Desc", label: "Personnel Action 3 Description", key: "pa3Desc", id: "pa3Desc" },
//     { value: "tcTsSchedCd", label: "Time Collection", key: "tcTsSchedCd", id: "tcTsSchedCd" },
//     { value: "tcWorkSchedCd", label: "Work Schedule", key: "tcWorkSchedCd", id: "tcWorkSchedCd" },
//     { value: "homeRef1Id", label: "Ref No 1", key: "homeRef1Id", id: "homeRef1Id" },
//     { value: "homeRef2Id", label: "Ref No 2", key: "homeRef2Id", id: "homeRef2Id" },
//     { value: "compPlanCd", label: "Compensation Plan", key: "compPlanCd", id: "compPlanCd" },
//     { value: "sStepNo", label: "Step", key: "sStepNo", id: "sStepNo" },
//     { value: "salGradeCd", label: "Grade", key: "salGradeCd", id: "salGradeCd" },
//     { value: "reviewFormId", label: "Review Form", key: "reviewFormId", id: "reviewFormId" },
//     { value: "overallRt", label: "Rating", key: "overallRt", id: "overallRt" },
//     { value: "pctGradeChange", label: "Percent Grade Change", key: "pctGradeChange", id: "pctGradeChange" },
//     { value: "pctRatingChange", label: "Percent Rating Change", key: "pctRatingChange", id: "pctRatingChange" },
//     { value: "affPlanCd", label: "Affirmative Action Plan", key: "affPlanCd", id: "affPlanCd" },
//     { value: "jobGroupCd", label: "Job Category", key: "jobGroupCd", id: "jobGroupCd" },
//     { value: "eeoCode", label: "EEO Code", key: "eeoCode", id: "eeoCode" },
//     { value: (item) => item.hireDtFl === 'Y' || item.hireDtFl === true, label: "Effective is Hire Date", key: "hireDtFl", type: "checkbox", id: "hireDtFl" },
//     { value: "caRemoteWorker", label: "California Pay Data Reporting Remote Worker Status", key: "caRemoteWorker", id: "caRemoteWorker" },
//     { value: (item) => item.termDtFl === 'Y' || item.termDtFl === true, label: "Effective Date is Term Date", key: "termDtFl", type: "checkbox", id: "termDtFl" },
//     { value: "aaComments", label: "HR Info Comments", key: "aaComments", id: "aaComments" },
//     { value: "comments", label: "Comments", key: "comments", id: "comments" },
//   ];

//   const getRowKey = (row) => String(row.tempId || row.emplId || row.id || "");

//   // --- Find & Replace Logic (Generic Integration) ---
//   const handleNestedFindReplace = (config, isReplaceMode) => {
//     const { column, findYear, findMonth, replaceValue, booleanMode, replaceYear, replaceMonth } = config;
//     if (!column) return toast.warn("Please select a column.");

//     let count = 0;
//     const updated = salaryRecords.map(row => {
//       let matches = false;
//       const currentVal = String(row[column] || "");
//       const colDef = salaryColumns.find(c => c.id === column);

//       if (colDef?.type === "date") {
//         const parts = currentVal.split("-"); // [YYYY, MM, DD]
//         const y = parts[0];
//         const m = parts[1];
//         matches = (!findYear || y === findYear) && (!findMonth || m === findMonth);
//       } else if (colDef?.type === "flag") {
//         matches = booleanMode === "setAll" || (booleanMode === "inverted");
//       } else {
//         matches = currentVal.toLowerCase().includes(String(findYear || "").toLowerCase());
//       }

//       if (matches) {
//         count++;
//         let newVal = replaceValue;
//         if (isReplaceMode) {
//           if (colDef?.type === "date") {
//             const parts = currentVal.split("-");
//             const y = replaceYear || parts[0];
//             const m = replaceMonth || parts[1];
//             const d = parts[2] || "01";
//             newVal = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
//           } else if (colDef?.type === "flag" && booleanMode === "inverted") {
//             newVal = currentVal === "Y" ? "N" : "Y";
//           }
//           return { ...row, [column]: newVal, isDirty: true };
//         }
//         return row;
//       }
//       return row;
//     });

//     if (count > 0) {
//       if (isReplaceMode) {
//         setSalaryRecords(updated);
//         toast.success(`Replaced ${count} matches in ${column}`);
//       } else {
//         toast.info(`Found ${count} matches in ${column}`);
//       }
//     } else {
//       toast.info("No matches found.");
//     }
//   };

//   const jumpToCode = (code) => {
//     const idx = salaryRecords.findIndex(r => 
//       String(r.effectDt).includes(code) || 
//       String(r.orgId).includes(code) ||
//       String(getRowKey(r)).includes(code)
//     );
//     if (idx !== -1) {
//       setCurrentIndex(idx);
//       setSelectedIds(new Set([getRowKey(salaryRecords[idx])]));
//       setIsFormView(true);
//       // Also calculate which page this record is on
//       const page = Math.floor(idx / pageSize) + 1;
//       setCurrentPage(page);
//     } else {
//       toast.info("Record not found.");
//     }
//   };

//   const handleNavigate = (direction) => {
//     let newIdx = currentIndex;
//     if (direction === "start") newIdx = 0;
//     else if (direction === "end") newIdx = salaryRecords.length - 1;
//     else if (direction === "next") newIdx = Math.min(salaryRecords.length - 1, currentIndex + 1);
//     else if (direction === "prev") newIdx = Math.max(0, currentIndex - 1);

//     setCurrentIndex(newIdx);
//     if (salaryRecords[newIdx]) {
//       setSelectedIds(new Set([getRowKey(salaryRecords[newIdx])]));
//     }
//   };

//   // --- Field Change Logic ---
//   const handleFieldChange = (rowId, field, value) => {
//     setSalaryRecords((prev) =>
//       prev.map((rec) =>
//         getRowKey(rec) === String(rowId) ? { ...rec, [field]: value, isDirty: true } : rec
//       )
//     );
//   };

//   // --- API Handlers ---
//   const fetchSalaryData = async () => {
//     if (!emplId) return;
//     setLoading(true);
//     try {
//       const res = await api.get(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/latest`);
//       const fetchedData = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
//       setSalaryRecords(fetchedData.map(item => ({ ...item, isDirty: false })));
//       setTotalPages(Math.ceil(fetchedData.length / pageSize) || 1);
//       setCurrentPage(1);
//       setCurrentIndex(0);
//     } catch (error) {
//       toast.error("Failed to fetch salary records");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { if(emplId) fetchSalaryData(); }, [emplId]);

//   const handleSave = async () => {
//     const dirtyRecords = salaryRecords.filter((r) => r.isDirty);
//     if (dirtyRecords.length === 0) {
//       toast.info("No changes to save.");
//       return;
//     }

//     setLoading(true);
//     try {
//       for (const labor of dirtyRecords) {
//         // Construct payload as per EmployeeSubComponents
//         const payload = {
//           emplId: String(emplId), 
//           effectDt: labor.effectDt || null,
//           endDt: labor.endDt || null,
//           hrlyAmt: parseFloat(labor.hrlyAmt || 0),
//           salAmt: parseFloat(labor.salAmt || 0),
//           annlAmt: parseFloat(labor.annlAmt || 0),
//           workYrHrsNo: parseFloat(labor.workYrHrsNo || 2080),
//           stdEstHrs: parseFloat(labor.stdEstHrs || 2080),
//           pctIncrRt: parseFloat(labor.pctIncrRt || 0),
//           corpOfcrFl: !!(labor.corpOfcrFl === true || labor.corpOfcrFl === "Y"),
//           seasonEmplFl: !!(labor.seasonEmplFl === true || labor.seasonEmplFl === "Y"),
//           variableHrsFl: !!(labor.variableHrsFl === true || labor.variableHrsFl === "Y"),
//           hireDtFl: !!(labor.hireDtFl === true || labor.hireDtFl === "Y"),
//           termDtFl: !!(labor.termDtFl === true || labor.termDtFl === "Y"),
//           sHrlySalCd: labor.sHrlySalCd || "H",
//           sEmplTypeCd: labor.sEmplTypeCd || "REG",
//           exmptFl: labor.exmptFl || "N",
//           orgId: labor.orgId || "",
//           secOrgId: labor.secOrgId || "",
//           hrOrgId: labor.hrOrgId || "",
//           titleDesc: labor.titleDesc || "",
//           detlJobCd: labor.detlJobCd || "",
//           mgrEmplId1: labor.mgrEmplId1 || "",
//           managerName: labor.managerName || "",
//           spvsrEmplId: labor.spvsrEmplId || "",
//           supervisorName: labor.supervisorName || "",
//           genlLabCatCd: labor.genlLabCatCd || "",
//           labGrpType: labor.labGrpType || "LG1",
//           labLocCd: labor.labLocCd || "",
//           workStateCd: labor.workStateCd || "ST",
//           persActRsnCd: labor.persActRsnCd || "",
//           pa1Desc: labor.pa1Desc || "",
//           persActRsnCd2: labor.persActRsnCd2 || "",
//           pa2Desc: labor.pa2Desc || "",
//           persActRsnCd3: labor.persActRsnCd3 || "",
//           pa3Desc: labor.pa3Desc || "",
//           compPlanCd: labor.compPlanCd || "",
//           salGradeCd: labor.salGradeCd || "",
//           sStepNo: String(labor.sStepNo || ""),
//           stdRate: parseFloat(labor.stdRate || 0),
//           empClass: labor.empClass || "",
//           plc: labor.plc || "",
//           pctGradeChange: parseFloat(labor.pctGradeChange || 0),
//           pctRatingChange: parseFloat(labor.pctRatingChange || 0),
//           eeoCode: labor.eeoCode || "",
//           reviewFormId: labor.reviewFormId || "",
//           overallRt: labor.overallRt || "",
//           affPlanCd: labor.affPlanCd || "",
//           jobGroupCd: labor.jobGroupCd || "",
//           comments: labor.comments || "",
//           aaComments: labor.aaComments || "",
//           caRemoteWorker: labor.caRemoteWorker || "none",
//           tcTsSchedCd: labor.tcTsSchedCd || "",
//           tcWorkSchedCd: labor.tcWorkSchedCd || "",
//           homeRef1Id: labor.homeRef1Id || "",
//           homeRef2Id: labor.homeRef2Id || "",
//           modifiedBy1: "SystemUser"
//         };

//           if (String(getRowKey(labor)).startsWith("NEW")) {
//             await api.post(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo`, payload);
//           } else {
//             const putDate = payload.effectDt?.split('T')[0];
//             await api.put(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/${putDate}`, payload);
//           }
//       }
//       toast.success("Salary changes saved successfully.", { toastId: "salary-save-success" });
//       setSalaryRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
//     } catch (err) {
//       toast.error(err.response?.data?.title || "Error saving records.", { toastId: "salary-save-error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (selectedIds.size === 0) return toast.info("Please select records to delete.");
//     if (!window.confirm("Delete selected salary records?")) return;

//     setLoading(true);
//     try {
//       for (const id of Array.from(selectedIds)) {
//         if (!String(id).startsWith("NEW")) {
//           const labor = salaryRecords.find(r => getRowKey(r) === id);
//           if (labor) {
//             const rawDate = labor.effectDt || "";
//             const effectDt = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
//             if (effectDt) {
//               await api.delete(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/${effectDt}`);
//             }
//           }
//         }
//       }
//       // Local UI Update instead of re-fetching
//       const deletedIdsArray = Array.from(selectedIds);
//       setSalaryRecords(prev => prev.filter(r => !deletedIdsArray.includes(getRowKey(r))));

//       toast.success("Records deleted successfully.", { toastId: "salary-delete-success" });
//       setSelectedIds(new Set());
//     } catch (err) {
//       toast.error(err.response?.data?.title || "Error deleting records.", { toastId: "salary-delete-error" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const activeLabor = salaryRecords[currentIndex] || {};

//   return (
//     <div className="h-full flex flex-col">
//       <MainContainer title="Manage Employee Salary">
//         <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-200 bg-white">
//           <div className="flex items-center gap-3">
//             <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee ID</label>
//             <div className="relative">
//               <input 
//                 type="text" 
//                 value={emplId} 
//                 onChange={(e) => setEmplId(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && fetchSalaryData()}
//                 className="w-24 px-2 py-1 text-xs font-bold text-[#17414d] border border-gray-300 rounded outline-none focus:border-[#17414d] transition-all"
//                 placeholder="Enter ID..."
//               />
//               <button 
//                 onClick={fetchSalaryData}
//                 className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#17414d] transition-colors"
//               >
//                 <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
//               </button>
//             </div>
//           </div>
//         </div>

//         <Toolbar
//           isFormView={isFormView}
//           columns={salaryColumns}
//           handleFindReplace={handleNestedFindReplace}
//           currentIndex={currentIndex}
//           totalRecords={salaryRecords.length}
//           handleNavigate={handleNavigate}
//           jumpToCode={jumpToCode}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           isDirty={salaryRecords.some(r => r.isDirty)}
//           loading={loading}
//           actions={{
//             onToggleView: () => setIsFormView(!isFormView),
//             onSave: handleSave,
//             onAdd: () => {
//               const newRec = {
//                 tempId: `NEW_${Date.now()}`,
//                 isDirty: true,
//                 emplId: emplId,
//                 workYrHrsNo: "2080",
//                 effectDt: new Date().toISOString().split('T')[0]
//               };
              
//               // First update index and selection to avoid flicker
//               const newKey = getRowKey(newRec);
//               setCurrentIndex(0);
//               setSelectedIds(new Set([newKey]));

//               // Then update the data list
//               setSalaryRecords(prev => [newRec, ...prev]);
//               toast.info("New record added.");
//             },
//             onDelete: handleDelete,
//             onClear: () => {
//                 if (window.confirm("Discard all unsaved changes?")) {
//                     fetchSalaryData();
//                 }
//             }
//           }}
//         />

//         <div className="flex-1 overflow-auto p-4 bg-gray-50">
//           {isFormView ? (
//             <div className="bg-white rounded-xl border border-gray-200">
//               <div className="flex border-b border-gray-200 px-2 bg-white rounded-t-xl">
//                 {["Salary Info", "HR Information", "Comments"].map((tab) => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
//                     className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${activeTab === tab.toLowerCase().replace(" ", "")
//                         ? "border-b-2 border-[#17414d] text-[#17414d]"
//                         : "text-gray-500 hover:text-[#17414d]"
//                       }`}
//                   >
//                     {tab}
//                   </button>
//                 ))}
//               </div>

//               <div className="p-6">

//                 {activeTab === "salaryinfo" && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
//                     <FormSection title="Compensation">
//                       <FormInput label="Effective Date *" type="date" value={activeLabor.effectDt?.split('T')[0] ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'effectDt', e.target.value)} />
//                       <FormInput label="End Date" type="date" value={activeLabor.endDt?.split('T')[0] ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'endDt', e.target.value)} />
//                       <FormInput label="Work Hours In Year *" value={activeLabor.workYrHrsNo ?? "2080"} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'workYrHrsNo', e.target.value)} />
//                       <FormInput label="Hourly Amount" value={activeLabor.hrlyAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hrlyAmt', e.target.value)} />
//                       <FormInput label="Payroll Salary Amount" value={activeLabor.salAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'salAmt', e.target.value)} />
//                       <FormInput label="Annual Amount" value={activeLabor.annlAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'annlAmt', e.target.value)} />
//                       <FormInput label="Percent of Increase" value={activeLabor.pctIncrRt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctIncrRt', e.target.value)} />
//                       <FormInput label="Estimated Annual Hours" value={activeLabor.stdEstHrs ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'stdEstHrs', e.target.value)} />
//                       <FormInput label="Standard Hourly Rate" value={activeLabor.stdRate ?? ""} readOnly />
//                       <FormInput label="Employee Class" value={activeLabor.empClass ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'empClass', e.target.value)} />
//                       <FormInput label="Employee Type" type="select" value={activeLabor.sEmplTypeCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sEmplTypeCd', e.target.value)} options={[]} />
//                       <FormInput label="Rate Type" type="select" value={activeLabor.sHrlySalCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sHrlySalCd', e.target.value)} options={[]} />
//                       <div className="flex items-center gap-4 py-1 ml-[90px]">
//                         <span className="text-[10px] font-bold text-gray-700 uppercase">FLSA Classification</span>
//                         <div className="flex gap-4">
//                           <FormInput label="Exempt" type="radio" name="flsa" checked={activeLabor.exmptFl === 'Y'} onChange={() => handleFieldChange(getRowKey(activeLabor), 'exmptFl', 'Y')} />
//                           <FormInput label="Non-Exempt" type="radio" name="flsa" checked={activeLabor.exmptFl === 'N'} onChange={() => handleFieldChange(getRowKey(activeLabor), 'exmptFl', 'N')} />
//                         </div>
//                       </div>
//                       <FormInput
//                         label="Seasonal Employee"
//                         type="checkbox"
//                         checked={!!(activeLabor.seasonEmplFl === true || activeLabor.seasonEmplFl === 'Y')}
//                         onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'seasonEmplFl', e.target.checked)}
//                       />
//                       <FormInput
//                         label="Variable Hour Employee"
//                         type="checkbox"
//                         checked={!!(activeLabor.variableHrsFl === true || activeLabor.variableHrsFl === 'Y')}
//                         onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'variableHrsFl', e.target.checked)}
//                       />
//                       <FormInput label="Detail Job Title" value={activeLabor.titleDesc ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'titleDesc', e.target.value)} />
//                       <FormInput
//                         label="Corporate Officer"
//                         type="checkbox"
//                         checked={!!(activeLabor.corpOfcrFl === true || activeLabor.corpOfcrFl === 'Y')}
//                         onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'corpOfcrFl', e.target.checked)}
//                       />
//                       <FormInput label="Manager" value={activeLabor.mgrEmplId1 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'mgrEmplId1', e.target.value)} />
//                       <FormInput label="Manager Name" value={activeLabor.managerName ?? ""} readOnly />
//                       <FormInput label="Supervisor" value={activeLabor.spvsrEmplId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'spvsrEmplId', e.target.value)} />
//                       <FormInput label="Supervisor Name" value={activeLabor.supervisorName ?? ""} readOnly />
//                     </FormSection>

//                     <FormSection title="Organization & Details">
//                       <FormInput label="Labor Group" value={activeLabor.labGrpType ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'labGrpType', e.target.value)} />
//                       <FormInput label="Labor Location" value={activeLabor.labLocCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'labLocCd', e.target.value)} />
//                       <FormInput label="GLC *" value={activeLabor.genlLabCatCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'genlLabCatCd', e.target.value)} />
//                       <FormInput label="PLC" value={activeLabor.plc ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'plc', e.target.value)} />
//                       <FormInput label="Overtime State *" value={activeLabor.workStateCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'workStateCd', e.target.value)} />
//                       <FormInput label="Home Organization *" value={activeLabor.orgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'orgId', e.target.value)} />
//                       <FormInput label="Security Organization" value={activeLabor.secOrgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'secOrgId', e.target.value)} />
//                       <FormInput label="HR Organization" value={activeLabor.hrOrgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hrOrgId', e.target.value)} />
//                       <FormInput label="Personnel Action 1" value={activeLabor.persActRsnCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd', e.target.value)} />
//                       <FormInput label="PA 1 Description" value={activeLabor.pa1Desc ?? ""} readOnly />
//                       <FormInput label="Personnel Action 2" value={activeLabor.persActRsnCd2 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd2', e.target.value)} />
//                       <FormInput label="PA 2 Description" value={activeLabor.pa2Desc ?? ""} readOnly />
//                       <FormInput label="Personnel Action 3" value={activeLabor.persActRsnCd3 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd3', e.target.value)} />
//                       <FormInput label="PA 3 Description" value={activeLabor.pa3Desc ?? ""} readOnly />
//                       <FormInput label="Time Collection" value={activeLabor.tcTsSchedCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'tcTsSchedCd', e.target.value)} />
//                       <FormInput label="Work Schedule" value={activeLabor.tcWorkSchedCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'tcWorkSchedCd', e.target.value)} />
//                       <FormInput label="Ref No 1" value={activeLabor.homeRef1Id ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'homeRef1Id', e.target.value)} />
//                       <FormInput label="Ref No 2" value={activeLabor.homeRef2Id ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'homeRef2Id', e.target.value)} />
//                     </FormSection>
//                   </div>
//                 )}

//                 {activeTab === "hrinformation" && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <FormSection title="Compensation Data">
//                       <FormInput label="Compensation Plan" value={activeLabor.compPlanCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'compPlanCd', e.target.value)} />
//                       <FormInput label="Step" value={activeLabor.sStepNo ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sStepNo', e.target.value)} />
//                       <FormInput label="Grade" value={activeLabor.salGradeCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'salGradeCd', e.target.value)} />
//                       <FormInput label="Review Form" value={activeLabor.reviewFormId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'reviewFormId', e.target.value)} />
//                       <FormInput label="Rating" value={activeLabor.overallRt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'overallRt', e.target.value)} />
//                       <FormInput label="Percent Grade Change" value={activeLabor.pctGradeChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctGradeChange', e.target.value)} />
//                       <FormInput label="Percent Rating Change" value={activeLabor.pctRatingChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctRatingChange', e.target.value)} />
//                       <FormInput label="EEO Code" value={activeLabor.eeoCode ?? ""} readOnly />
//                       <FormInput label="Percent Rating Change" value={activeLabor.pctRatingChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctRatingChange', e.target.value)} />
//                     </FormSection>

//                     <FormSection title="Affirmative Action Data">
//                       <FormInput label="Affirmative Action Plan" value={activeLabor.affPlanCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'affPlanCd', e.target.value)} />
//                       <FormInput label="Job Category" value={activeLabor.jobGroupCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'jobGroupCd', e.target.value)} />
//                       <FormInput label="EEO Code" value={activeLabor.eeoCode ?? ""} readOnly />
//                       <div className="ml-[90px] space-y-1 py-1">
//                         <div className="flex items-center gap-2">
//                           <input type="checkbox" checked={activeLabor.hireDtFl === true || activeLabor.hireDtFl === 'Y'} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hireDtFl', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//                           <label className="text-[10px] text-gray-700">Effective Date is Hire Date</label>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <input type="checkbox" checked={activeLabor.termDtFl === true || activeLabor.termDtFl === 'Y'} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'termDtFl', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
//                           <label className="text-[10px] text-gray-700">Effective Date is Term Date</label>
//                         </div>
//                       </div>
//                       <FormInput label="California Pay Data Reporting Remote Worker Status" type="select" value={activeLabor.caRemoteWorker ?? ""} options={[{ label: "Does not work remotely", value: "none" }, { label: "Works Remotely", value: "remote" }]} optionLabel="label" optionValue="value" />
//                       <div className="mt-2">
//                         <label className="text-[10px] font-semibold text-gray-800 block mb-1">Comments</label>
//                         <textarea className="w-full h-20 p-2 border border-gray-300 rounded text-xs outline-none focus:border-[#17414d]" value={activeLabor.aaComments ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'aaComments', e.target.value)} />
//                       </div>
//                     </FormSection>
//                   </div>
//                 )}

//                 {activeTab === "comments" && (
//                   <div className="p-2">
//                     <FormSection title="Comments">
//                       <div className="relative group">
//                         <textarea className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d] transition-all resize-none bg-white shadow-inner" placeholder="Enter additional salary or HR comments here..." value={activeLabor.comments ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'comments', e.target.value)} />
//                       </div>
//                     </FormSection>
//                   </div>
//                 )}
//               </div>
//               </div>

//           ) : (
//             <ReusableTable
//               data={paginatedRecords}
//               columns={salaryColumns}
//               selectedRows={selectedIds}
//               onRowSelect={(row) => {
//                 const idx = salaryRecords.findIndex(r => getRowKey(r) === getRowKey(row));
//                 setCurrentIndex(idx);
//                 setSelectedIds(new Set([getRowKey(row)]));
//               }}
//               onFieldChange={handleFieldChange}
//               maxHeight="max-h-[65vh]"
//             />
//           )}
//         </div>

//         {!isFormView && (
//           <div className="w-full bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 mt-1 rounded-b-xl">
//             {/* Back Button */}
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//               className="text-[#17414d] disabled:opacity-30"
//               disabled={currentPage === 1}
//             >
//               <ChevronLeft size={18} />
//             </button>

//             {/* Page Indicator */}
//             <div className="flex items-center gap-1">
//               <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#17414d] text-white font-bold text-xs">
//                 {currentPage}
//               </span>
//               <span className="text-gray-500 text-xs px-1">of {totalPages}</span>
//             </div>

//             {/* Next Button */}
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//               className="text-[#17414d] disabled:opacity-30"
//               disabled={currentPage === totalPages}
//             >
//               <ChevronRight size={18} />
//             </button>

//             {/* Page Size Selector */}
//             <div className="relative flex items-center rounded px-2 bg-white ml-2 border border-gray-200">
//               <select
//                 value={pageSize}
//                 onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
//                 className="appearance-none bg-transparent py-1 pr-6 pl-1 focus:outline-none cursor-pointer text-[10px] font-bold text-black"
//               >
//                 <option value={15}>15 / page</option>
//                 <option value={25}>25 / page</option>
//                 <option value={50}>50 / page</option>
//               </select>
//               <ChevronRight size={14} className="absolute right-1 text-gray-400 pointer-events-none rotate-90" />
//             </div>
//           </div>
//         )}
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageEmployeeSalary;

// import React, { useState, useEffect } from "react";
// import { DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
// import { toast } from "react-toastify";
// import api from "../utils/api";
// import { MainContainer, Toolbar } from "../helper/container";
// import { ReusableTable } from "../helper/tableSection";
// import { FormSection, FormInput } from "../helper/formSection";

// const ManageEmployeeSalary = () => {
//   // --- View States ---
//   const [isFormView, setIsFormView] = useState(false);
//   const [activeTab, setActiveTab] = useState("salaryInfo");
//   const [loading, setLoading] = useState(false);

//   // --- Data States ---
//   const [salaryRecords, setSalaryRecords] = useState([]);
//   const [masterRecords, setMasterRecords] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [selectedIds, setSelectedIds] = useState(new Set());
//   const [clipboard, setClipboard] = useState([]);

//   // --- Search/Pagination States ---
//   const [searchValue, setSearchValue] = useState("");
//   const [searchColumn, setSearchColumn] = useState("effDate");
//   const [currentPage, setCurrentPage] = useState(1);

//   // --- Column Configuration (Matches images exactly) ---
//   const salaryColumns = [
//     { label: "Effective Date *", key: "effDate", type: "date", value: "effDate" },
//     { label: "End Date", key: "endDate", type: "date", value: "endDate" },
//     { label: "Work Hours In Year *", key: "workHours", value: "workHours" },
//     { label: "Hourly Amount", key: "hourlyAmount", value: "hourlyAmount" },
//     { label: "Payroll Salary Amount", key: "payrollSalary", value: "payrollSalary" },
//     { label: "Annual Amount", key: "annualAmount", value: "annualAmount" },
//     { label: "GLC *", key: "glc", value: "glc" },
//     { label: "Home Organization *", key: "homeOrg", value: "homeOrg" },
//     { label: "Labor Group", key: "laborGroup", value: "laborGroup" },
//     { label: "Manager", key: "manager", value: "manager" },
//     { label: "Supervisor", key: "supervisor", value: "supervisor" },
//     { label: "Job Title", key: "detailJobTitle", value: "detailJobTitle" },
//   ];

//   // --- API Handlers ---
//   const fetchSalaryData = async () => {
//     setLoading(true);
//     try {
//       const baseUrl = "https://planning-master.onrender.com/api/EmployeeSalary";
//       const res = await api.get(baseUrl);
//       const data = res.data.map((item) => ({
//         ...item,
//         id: item.tempId || item.effDate, // Unique ID for selection
//         isDirty: false,
//       }));
//       setSalaryRecords(data);
//       setMasterRecords(data);
//     } catch (error) {
//       toast.error("Failed to fetch salary records");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchSalaryData(); }, []);

//   // --- Field Change Handler ---
//   const handleFieldChange = (id, field, value) => {
//     const stringId = String(id);
//     const update = (prev) =>
//       prev.map((row) =>
//         String(row.id) === stringId ? { ...row, [field]: value, isDirty: true } : row
//       );

//     setSalaryRecords(update);
//     if (selectedRow && String(selectedRow.id) === stringId) {
//       setSelectedRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
//     }
//   };

//   // --- Action Button Logic ---
//   const handleAdd = () => {
//     const newRecord = {
//       id: `NEW_${Date.now()}`,
//       effDate: "",
//       workHours: "2080",
//       homeOrg: "",
//       glc: "",
//       isDirty: true,
//       tempId: `NEW_${Date.now()}`,
//     };
//     setSalaryRecords([newRecord, ...salaryRecords]);
//     setSelectedRow(newRecord);
//     setIsFormView(true);
//   };

//   const handleSave = async () => {
//     if (!selectedRow?.isDirty) return toast.info("No changes to save.");
//     setLoading(true);
//     try {
//       const isNew = String(selectedRow.id).startsWith("NEW_");
//       const method = isNew ? "post" : "put";
//       const url = isNew 
//         ? "https://planning-master.onrender.com/api/EmployeeSalary" 
//         : `https://planning-master.onrender.com/api/EmployeeSalary/${selectedRow.id}`;

//       await api[method](url, selectedRow);
//       toast.success("Salary information saved");
//       fetchSalaryData();
//     } catch (error) {
//       toast.error("Save failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     if (!selectedRow) return toast.warn("Select a record to copy");
//     setClipboard([selectedRow]);
//     toast.success("Record copied to clipboard");
//   };

//   const handlePaste = () => {
//     if (!clipboard.length) return;
//     const pasted = { ...clipboard[0], id: `PST_${Date.now()}`, isDirty: true };
//     setSalaryRecords([pasted, ...salaryRecords]);
//     toast.success("Record pasted");
//   };

//   // --- Render Sections ---
//   const renderSalaryInfoTab = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
//       <FormSection title="Compensation">
//         <FormInput label="Effective Date *" type="date" value={selectedRow?.effDate || ""} onChange={(e) => handleFieldChange(selectedRow.id, "effDate", e.target.value)} />
//         <FormInput label="End Date" type="date" value={selectedRow?.endDate || ""} onChange={(e) => handleFieldChange(selectedRow.id, "endDate", e.target.value)} />
//         <FormInput label="Work Hours In Year *" value={selectedRow?.workHours || "2080"} onChange={(e) => handleFieldChange(selectedRow.id, "workHours", e.target.value)} />
//         <FormInput label="Hourly Amount" value={selectedRow?.hourlyAmount || ""} onChange={(e) => handleFieldChange(selectedRow.id, "hourlyAmount", e.target.value)} />
//         <FormInput label="Payroll Salary Amount" value={selectedRow?.payrollSalary || ""} />
//         <FormInput label="Annual Amount" value={selectedRow?.annualAmount || ""} />
//       </FormSection>

//       <FormSection title="Organization & Details">
//         <FormInput label="Labor Group" value={selectedRow?.laborGroup || ""} onChange={(e) => handleFieldChange(selectedRow.id, "laborGroup", e.target.value)} />
//         <FormInput label="GLC *" value={selectedRow?.glc || ""} onChange={(e) => handleFieldChange(selectedRow.id, "glc", e.target.value)} />
//         <FormInput label="Home Organization *" value={selectedRow?.homeOrg || ""} onChange={(e) => handleFieldChange(selectedRow.id, "homeOrg", e.target.value)} />
//         <FormInput label="Manager" value={selectedRow?.manager || ""} onChange={(e) => handleFieldChange(selectedRow.id, "manager", e.target.value)} />
//         <FormInput label="Supervisor" value={selectedRow?.supervisor || ""} onChange={(e) => handleFieldChange(selectedRow.id, "supervisor", e.target.value)} />
//       </FormSection>
//     </div>
//   );

//   const renderHRInfoTab = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//       <FormSection title="Compensation Data">
//         <FormInput label="Compensation Plan" value={selectedRow?.compPlan || ""} />
//         <FormInput label="Grade" value={selectedRow?.grade || ""} readOnly />
//         <FormInput label="Step" value={selectedRow?.step || ""} />
//       </FormSection>
//       <FormSection title="Affirmative Action Data">
//         <FormInput label="Job Category" value={selectedRow?.jobCategory || ""} />
//         <FormInput label="EEO Code" value={selectedRow?.eeoCode || ""} readOnly />
//       </FormSection>
//     </div>
//   );

//   return (
//     <div className="p-4 font-inter">
//       <MainContainer icon={DollarSign} title="Manage Employee Salary Information">
//         <Toolbar
//           isFormView={isFormView}
//           columns={salaryColumns}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           searchColumn={searchColumn}
//           setSearchColumn={setSearchColumn}
//           handleFind={() => {
//             const filtered = masterRecords.filter(r => String(r[searchColumn]).toLowerCase().includes(searchValue.toLowerCase()));
//             setSalaryRecords(filtered);
//           }}
//           actions={{
//             onAdd: handleAdd,
//             onSave: handleSave,
//             onCopy: handleCopy,
//             onPaste: handlePaste,
//             onToggleView: () => setIsFormView(!isFormView),
//             onClear: () => {
//                 setSalaryRecords(masterRecords);
//                 setIsFormView(false);
//                 setSelectedRow(null);
//             }
//           }}
//           selectedRow={selectedRow}
//           isDirty={selectedRow?.isDirty}
//           loading={loading}
//         />

//         <div className="m-2">
//           {isFormView ? (
//             <div className="space-y-4">
//               {/* Tab Navigation (Underline Style) */}
//               <div className="flex border-b border-gray-200 bg-white">
//                 {["salaryInfo", "hrInfo", "comments"].map((t) => (
//                   <button
//                     key={t}
//                     onClick={() => setActiveTab(t)}
//                     className={`px-6 py-2 text-[11px] font-bold uppercase transition-all ${
//                       activeTab === t ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-400 hover:text-[#17414d]"
//                     }`}
//                   >
//                     {t.replace(/([A-Z])/g, ' $1')}
//                   </button>
//                 ))}
//               </div>

//               <div className="bg-white p-2">
//                 {activeTab === "salaryInfo" && renderSalaryInfoTab()}
//                 {activeTab === "hrInfo" && renderHRInfoTab()}
//                 {activeTab === "comments" && (
//                   <FormSection title="Comments">
//                     <textarea
//                       className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d]"
//                       value={selectedRow?.salaryComments || ""}
//                       onChange={(e) => handleFieldChange(selectedRow.id, "salaryComments", e.target.value)}
//                     />
//                   </FormSection>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <ReusableTable
//               data={salaryRecords}
//               columns={salaryColumns}
//               selectedRows={selectedIds}
//               onRowSelect={(row) => {
//                 setSelectedRow(row);
//                 setSelectedIds(new Set([String(row.id)]));
//               }}
//               onFieldChange={handleFieldChange}
//               maxHeight="max-h-[65vh]"
//             />
//           )}
//         </div>

//         {/* Pagination Footer */}
//         {!isFormView && (
//           <div className="bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 rounded-b-xl">
//             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="hover:text-[#17414d]"><ChevronLeft size={18} /></button>
//             <span className="text-xs font-bold">{currentPage}</span>
//             <button onClick={() => setCurrentPage(p => p + 1)} className="hover:text-[#17414d]"><ChevronRight size={18} /></button>
//           </div>
//         )}
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageEmployeeSalary;

import React, { useState, useEffect, useMemo } from "react";
import { DollarSign, ChevronLeft, ChevronRight, Search, Replace, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { FormSection, FormInput } from "../helper/formSection";
import { backendUrl } from "./config";

const ManageEmployeeSalary = () => {
  // --- View & Loading States ---
  const [isFormView, setIsFormView] = useState(false);
  const [activeTab, setActiveTab] = useState("salaryinfo");
  const [loading, setLoading] = useState(false);
  const [emplId, setEmplId] = useState("10");

  // --- Data States ---
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Navigation & Search States ---
  const [searchValue, setSearchValue] = useState("");
  const [searchColumn, setSearchColumn] = useState("effectDt");
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [replaceValue, setReplaceValue] = useState("");

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return salaryRecords.slice(start, start + pageSize);
  }, [salaryRecords, currentPage, pageSize]);

  const salaryColumns = [
    { value: "effectDt", label: "Effective Date *", key: "effectDt", type: "date", id: "effectDt" },
    { value: "endDt", label: "End Date", key: "endDt", type: "date", id: "endDt" },
    { value: "workYrHrsNo", label: "Work Hours *", key: "workYrHrsNo", id: "workYrHrsNo" },
    { value: "hrlyAmt", label: "Hourly Amount", key: "hrlyAmt", id: "hrlyAmt" },
    { value: "salAmt", label: "Payroll Salary Amount", key: "salAmt", id: "salAmt" },
    { value: "annlAmt", label: "Annual Amount", key: "annlAmt", id: "annlAmt" },
    { value: "pctIncrRt", label: "Percent of Increase", key: "pctIncrRt", id: "pctIncrRt" },
    { value: "stdEstHrs", label: "Estimated Annual Hours", key: "stdEstHrs", id: "stdEstHrs" },
    { value: "stdRate", label: "Standard Hourly Rate", key: "stdRate", id: "stdRate" },
    { value: "empClass", label: "Employee Class", key: "empClass", id: "empClass" },
    { value: "sEmplTypeCd", label: "Employee Type", key: "sEmplTypeCd", id: "sEmplTypeCd" },
    { value: "sHrlySalCd", label: "Rate Type", key: "sHrlySalCd", id: "sHrlySalCd" },
    { value: (item) => item.exmptFl === 'Y' || item.exmptFl === true, label: "FLSA Exempt", key: "exmptFl", type: "checkbox", id: "exmptFl" },
    { value: (item) => item.seasonEmplFl === 'Y' || item.seasonEmplFl === true, label: "Seasonal Employee", key: "seasonEmplFl", type: "checkbox", id: "seasonEmplFl" },
    { value: (item) => item.variableHrsFl === 'Y' || item.variableHrsFl === true, label: "Variable Hour Employee", key: "variableHrsFl", type: "checkbox", id: "variableHrsFl" },
    { value: "detlJobCd", label: "Detail Job Code", key: "detlJobCd", id: "detlJobCd" },
    { value: "titleDesc", label: "Detail Job Title", key: "titleDesc", id: "titleDesc" },
    { value: (item) => item.corpOfcrFl === 'Y' || item.corpOfcrFl === true, label: "Corporate Officer", key: "corpOfcrFl", type: "checkbox", id: "corpOfcrFl" },
    { value: "mgrEmplId1", label: "Manager", key: "mgrEmplId1", id: "mgrEmplId1" },
    { value: "managerName", label: "Manager Name", key: "managerName", id: "managerName" },
    { value: "spvsrEmplId", label: "Supervisor", key: "spvsrEmplId", id: "spvsrEmplId" },
    { value: "supervisorName", label: "Supervisor Name", key: "supervisorName", id: "supervisorName" },
    { value: "labGrpType", label: "Labor Group", key: "labGrpType", id: "labGrpType" },
    { value: "labLocCd", label: "Labor Location", key: "labLocCd", id: "labLocCd" },
    { value: "genlLabCatCd", label: "GLC", key: "genlLabCatCd", id: "genlLabCatCd" },
    { value: "plc", label: "PLC", key: "plc", id: "plc" },
    { value: "workStateCd", label: "Overtime State", key: "workStateCd", id: "workStateCd" },
    { value: "orgId", label: "Home Organization", key: "orgId", id: "orgId" },
    { value: "secOrgId", label: "Security Organization", key: "secOrgId", id: "secOrgId" },
    { value: "hrOrgId", label: "HR Organization", key: "hrOrgId", id: "hrOrgId" },
    { value: "persActRsnCd", label: "Personnel Action 1", key: "persActRsnCd", id: "persActRsnCd" },
    { value: "pa1Desc", label: "Personnel Action 1 Description", key: "pa1Desc", id: "pa1Desc" },
    { value: "persActRsnCd2", label: "Personnel Action 2", key: "persActRsnCd2", id: "persActRsnCd2" },
    { value: "pa2Desc", label: "Personnel Action 2 Description", key: "pa2Desc", id: "pa2Desc" },
    { value: "persActRsnCd3", label: "Personnel Action 3", key: "persActRsnCd3", id: "persActRsnCd3" },
    { value: "pa3Desc", label: "Personnel Action 3 Description", key: "pa3Desc", id: "pa3Desc" },
    { value: "tcTsSchedCd", label: "Time Collection", key: "tcTsSchedCd", id: "tcTsSchedCd" },
    { value: "tcWorkSchedCd", label: "Work Schedule", key: "tcWorkSchedCd", id: "tcWorkSchedCd" },
    { value: "homeRef1Id", label: "Ref No 1", key: "homeRef1Id", id: "homeRef1Id" },
    { value: "homeRef2Id", label: "Ref No 2", key: "homeRef2Id", id: "homeRef2Id" },
    { value: "compPlanCd", label: "Compensation Plan", key: "compPlanCd", id: "compPlanCd" },
    { value: "sStepNo", label: "Step", key: "sStepNo", id: "sStepNo" },
    { value: "salGradeCd", label: "Grade", key: "salGradeCd", id: "salGradeCd" },
    { value: "reviewFormId", label: "Review Form", key: "reviewFormId", id: "reviewFormId" },
    { value: "overallRt", label: "Rating", key: "overallRt", id: "overallRt" },
    { value: "pctGradeChange", label: "Percent Grade Change", key: "pctGradeChange", id: "pctGradeChange" },
    { value: "pctRatingChange", label: "Percent Rating Change", key: "pctRatingChange", id: "pctRatingChange" },
    { value: "affPlanCd", label: "Affirmative Action Plan", key: "affPlanCd", id: "affPlanCd" },
    { value: "jobGroupCd", label: "Job Category", key: "jobGroupCd", id: "jobGroupCd" },
    { value: "eeoCode", label: "EEO Code", key: "eeoCode", id: "eeoCode" },
    { value: (item) => item.hireDtFl === 'Y' || item.hireDtFl === true, label: "Effective is Hire Date", key: "hireDtFl", type: "checkbox", id: "hireDtFl" },
    { value: "caRemoteWorker", label: "California Pay Data Reporting Remote Worker Status", key: "caRemoteWorker", id: "caRemoteWorker" },
    { value: (item) => item.termDtFl === 'Y' || item.termDtFl === true, label: "Effective Date is Term Date", key: "termDtFl", type: "checkbox", id: "termDtFl" },
    { value: "aaComments", label: "HR Info Comments", key: "aaComments", id: "aaComments" },
    { value: "comments", label: "Comments", key: "comments", id: "comments" },
  ];

  const getRowKey = (row) => String(row.tempId || row.emplId || row.id || "");

  // --- Find & Replace Logic (Generic Integration) ---
  const handleNestedFindReplace = (config, isReplaceMode) => {
    const { column, findYear, findMonth, replaceValue, booleanMode, replaceYear, replaceMonth } = config;
    if (!column) return toast.warn("Please select a column.");

    let count = 0;
    const updated = salaryRecords.map(row => {
      let matches = false;
      const currentVal = String(row[column] || "");
      const colDef = salaryColumns.find(c => c.id === column);

      if (colDef?.type === "date") {
        const parts = currentVal.split("-"); // [YYYY, MM, DD]
        const y = parts[0];
        const m = parts[1];
        matches = (!findYear || y === findYear) && (!findMonth || m === findMonth);
      } else if (colDef?.type === "flag") {
        matches = booleanMode === "setAll" || (booleanMode === "inverted");
      } else {
        matches = currentVal.toLowerCase().includes(String(findYear || "").toLowerCase());
      }

      if (matches) {
        count++;
        let newVal = replaceValue;
        if (isReplaceMode) {
          if (colDef?.type === "date") {
            const parts = currentVal.split("-");
            const y = replaceYear || parts[0];
            const m = replaceMonth || parts[1];
            const d = parts[2] || "01";
            newVal = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
          } else if (colDef?.type === "flag" && booleanMode === "inverted") {
            newVal = currentVal === "Y" ? "N" : "Y";
          }
          return { ...row, [column]: newVal, isDirty: true };
        }
        return row;
      }
      return row;
    });

    if (count > 0) {
      if (isReplaceMode) {
        setSalaryRecords(updated);
        toast.success(`Replaced ${count} matches in ${column}`);
      } else {
        toast.info(`Found ${count} matches in ${column}`);
      }
    } else {
      toast.info("No matches found.");
    }
  };

  const jumpToCode = (code) => {
    const idx = salaryRecords.findIndex(r => 
      String(r.effectDt).includes(code) || 
      String(r.orgId).includes(code) ||
      String(getRowKey(r)).includes(code)
    );
    if (idx !== -1) {
      setCurrentIndex(idx);
      setSelectedIds(new Set([getRowKey(salaryRecords[idx])]));
      setIsFormView(true);
      // Also calculate which page this record is on
      const page = Math.floor(idx / pageSize) + 1;
      setCurrentPage(page);
    } else {
      toast.info("Record not found.");
    }
  };

  const handleNavigate = (direction) => {
    const idx = salaryRecords.findIndex(r => getRowKey(r) === selectedRowKey);
    let nextIdx = idx;

    if (direction === "start") nextIdx = 0;
    else if (direction === "end") nextIdx = salaryRecords.length - 1;
    else if (direction === "next") nextIdx = Math.min(salaryRecords.length - 1, idx + 1);
    else if (direction === "prev") nextIdx = Math.max(0, idx - 1);

    if (salaryRecords[nextIdx]) {
      const nextRow = salaryRecords[nextIdx];
      const nextKey = getRowKey(nextRow);
      setSelectedRowKey(nextKey);
      setSelectedIds(new Set([nextKey]));
    }
  };

  // --- Field Change Logic ---
  const handleFieldChange = (rowId, field, value) => {
    setSalaryRecords((prev) =>
      prev.map((rec) =>
        getRowKey(rec) === String(rowId) ? { ...rec, [field]: value, isDirty: true } : rec
      )
    );
  };

  // --- API Handlers ---
  const fetchSalaryData = async () => {
    if (!emplId) return;
    setLoading(true);
    try {
      const res = await api.get(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/latest`);
      const fetchedData = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
      setSalaryRecords(fetchedData.map(item => ({ ...item, isDirty: false })));
      setTotalPages(Math.ceil(fetchedData.length / pageSize) || 1);
      setCurrentPage(1);
      setCurrentIndex(0);
    } catch (error) {
      toast.error("Failed to fetch salary records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if(emplId) fetchSalaryData(); }, [emplId]);

  const handleSave = async () => {
    const dirtyRecords = salaryRecords.filter((r) => r.isDirty);
    if (dirtyRecords.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setLoading(true);
    try {
      for (const labor of dirtyRecords) {
        // Construct payload as per EmployeeSubComponents
        const payload = {
          emplId: String(emplId), 
          effectDt: labor.effectDt || null,
          endDt: labor.endDt || null,
          hrlyAmt: parseFloat(labor.hrlyAmt || 0),
          salAmt: parseFloat(labor.salAmt || 0),
          annlAmt: parseFloat(labor.annlAmt || 0),
          workYrHrsNo: parseFloat(labor.workYrHrsNo || 2080),
          stdEstHrs: parseFloat(labor.stdEstHrs || 2080),
          pctIncrRt: parseFloat(labor.pctIncrRt || 0),
          corpOfcrFl: !!(labor.corpOfcrFl === true || labor.corpOfcrFl === "Y"),
          seasonEmplFl: !!(labor.seasonEmplFl === true || labor.seasonEmplFl === "Y"),
          variableHrsFl: !!(labor.variableHrsFl === true || labor.variableHrsFl === "Y"),
          hireDtFl: !!(labor.hireDtFl === true || labor.hireDtFl === "Y"),
          termDtFl: !!(labor.termDtFl === true || labor.termDtFl === "Y"),
          sHrlySalCd: labor.sHrlySalCd || "H",
          sEmplTypeCd: labor.sEmplTypeCd || "REG",
          exmptFl: labor.exmptFl || "N",
          orgId: labor.orgId || "",
          secOrgId: labor.secOrgId || "",
          hrOrgId: labor.hrOrgId || "",
          titleDesc: labor.titleDesc || "",
          detlJobCd: labor.detlJobCd || "",
          mgrEmplId1: labor.mgrEmplId1 || "",
          managerName: labor.managerName || "",
          spvsrEmplId: labor.spvsrEmplId || "",
          supervisorName: labor.supervisorName || "",
          genlLabCatCd: labor.genlLabCatCd || "",
          labGrpType: labor.labGrpType || "LG1",
          labLocCd: labor.labLocCd || "",
          workStateCd: labor.workStateCd || "ST",
          persActRsnCd: labor.persActRsnCd || "",
          pa1Desc: labor.pa1Desc || "",
          persActRsnCd2: labor.persActRsnCd2 || "",
          pa2Desc: labor.pa2Desc || "",
          persActRsnCd3: labor.persActRsnCd3 || "",
          pa3Desc: labor.pa3Desc || "",
          compPlanCd: labor.compPlanCd || "",
          salGradeCd: labor.salGradeCd || "",
          sStepNo: String(labor.sStepNo || ""),
          stdRate: parseFloat(labor.stdRate || 0),
          empClass: labor.empClass || "",
          plc: labor.plc || "",
          pctGradeChange: parseFloat(labor.pctGradeChange || 0),
          pctRatingChange: parseFloat(labor.pctRatingChange || 0),
          eeoCode: labor.eeoCode || "",
          reviewFormId: labor.reviewFormId || "",
          overallRt: labor.overallRt || "",
          affPlanCd: labor.affPlanCd || "",
          jobGroupCd: labor.jobGroupCd || "",
          comments: labor.comments || "",
          aaComments: labor.aaComments || "",
          caRemoteWorker: labor.caRemoteWorker || "none",
          tcTsSchedCd: labor.tcTsSchedCd || "",
          tcWorkSchedCd: labor.tcWorkSchedCd || "",
          homeRef1Id: labor.homeRef1Id || "",
          homeRef2Id: labor.homeRef2Id || "",
          modifiedBy1: "SystemUser"
        };

          if (String(getRowKey(labor)).startsWith("NEW")) {
            await api.post(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo`, payload);
          } else {
            const putDate = payload.effectDt?.split('T')[0];
            await api.put(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/${putDate}`, payload);
          }
      }
      toast.success("Salary changes saved successfully.", { toastId: "salary-save-success" });
      setSalaryRecords(prev => prev.map(r => ({ ...r, isDirty: false })));
    } catch (err) {
      toast.error(err.response?.data?.title || "Error saving records.", { toastId: "salary-save-error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return toast.info("Please select records to delete.");
    if (!window.confirm("Delete selected salary records?")) return;

    setLoading(true);
    try {
      for (const id of Array.from(selectedIds)) {
        if (!String(id).startsWith("NEW")) {
          const labor = salaryRecords.find(r => getRowKey(r) === id);
          if (labor) {
            const rawDate = labor.effectDt || "";
            const effectDt = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate;
            if (effectDt) {
              await api.delete(`${backendUrl}/api/EmployeeMaster/${emplId}/labinfo/${effectDt}`);
            }
          }
        }
      }
      // Local UI Update instead of re-fetching
      const deletedIdsArray = Array.from(selectedIds);
      setSalaryRecords(prev => prev.filter(r => !deletedIdsArray.includes(getRowKey(r))));

      toast.success("Records deleted successfully.", { toastId: "salary-delete-success" });
      setSelectedIds(new Set());
    } catch (err) {
      toast.error(err.response?.data?.title || "Error deleting records.", { toastId: "salary-delete-error" });
    } finally {
      setLoading(false);
    }
  };

  const activeLabor = salaryRecords[currentIndex] || {};

  return (
    <div className="h-full flex flex-col">
      <MainContainer title="Manage Employee Salary">
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Employee ID</label>
            <div className="relative">
              <input 
                type="text" 
                value={emplId} 
                onChange={(e) => setEmplId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchSalaryData()}
                className="w-24 px-2 py-1 text-xs font-bold text-[#17414d] border border-gray-300 rounded outline-none focus:border-[#17414d] transition-all"
                placeholder="Enter ID..."
              />
              <button 
                onClick={fetchSalaryData}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#17414d] transition-colors"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        <Toolbar
          isFormView={isFormView}
          columns={salaryColumns}
          handleFindReplace={handleNestedFindReplace}
          selectedRow={salaryRecords.find(r => getRowKey(r) === selectedRowKey) || null}
          currentIndex={salaryRecords.findIndex(r => getRowKey(r) === selectedRowKey)}
          totalRecords={salaryRecords.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          isDirty={salaryRecords.some(r => r.isDirty)}
          loading={loading}
          actions={{
            onToggleView: () => setIsFormView(!isFormView),
            onSave: handleSave,
            onAdd: () => {
              const newRec = {
                tempId: `NEW_${Date.now()}`,
                isDirty: true,
                emplId: emplId,
                workYrHrsNo: "2080",
                effectDt: new Date().toISOString().split('T')[0]
              };
              
              const newKey = getRowKey(newRec);
              setSalaryRecords(prev => [newRec, ...prev]);
              setSelectedRowKey(newKey);
              setSelectedIds(new Set([newKey]));
              toast.info("New record added.");
            },
            onDelete: handleDelete,
            onClear: () => {
                if (window.confirm("Discard all unsaved changes?")) {
                    fetchSalaryData();
                }
            }
          }}
        />

        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {isFormView ? (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="flex border-b border-gray-200 px-2 bg-white rounded-t-xl">
                {["Salary Info", "HR Information", "Comments"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
                    className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${activeTab === tab.toLowerCase().replace(" ", "")
                        ? "border-b-2 border-[#17414d] text-[#17414d]"
                        : "text-gray-500 hover:text-[#17414d]"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {activeTab === "salaryinfo" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                    <FormSection title="Compensation">
                      <FormInput label="Effective Date *" type="date" value={activeLabor.effectDt?.split('T')[0] ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'effectDt', e.target.value)} />
                      <FormInput label="End Date" type="date" value={activeLabor.endDt?.split('T')[0] ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'endDt', e.target.value)} />
                      <FormInput label="Work Hours In Year *" value={activeLabor.workYrHrsNo ?? "2080"} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'workYrHrsNo', e.target.value)} />
                      <FormInput label="Hourly Amount" value={activeLabor.hrlyAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hrlyAmt', e.target.value)} />
                      <FormInput label="Payroll Salary Amount" value={activeLabor.salAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'salAmt', e.target.value)} />
                      <FormInput label="Annual Amount" value={activeLabor.annlAmt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'annlAmt', e.target.value)} />
                      <FormInput label="Percent of Increase" value={activeLabor.pctIncrRt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctIncrRt', e.target.value)} />
                      <FormInput label="Estimated Annual Hours" value={activeLabor.stdEstHrs ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'stdEstHrs', e.target.value)} />
                      <FormInput label="Standard Hourly Rate" value={activeLabor.stdRate ?? ""} readOnly />
                      <FormInput label="Employee Class" value={activeLabor.empClass ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'empClass', e.target.value)} />
                      <FormInput label="Employee Type" type="select" value={activeLabor.sEmplTypeCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sEmplTypeCd', e.target.value)} options={[]} />
                      <FormInput label="Rate Type" type="select" value={activeLabor.sHrlySalCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sHrlySalCd', e.target.value)} options={[]} />
                      <div className="flex items-center gap-4 py-1 ml-[90px]">
                        <span className="text-[10px] font-bold text-gray-700 uppercase">FLSA Classification</span>
                        <div className="flex gap-4">
                          <FormInput label="Exempt" type="radio" name="flsa" checked={activeLabor.exmptFl === 'Y'} onChange={() => handleFieldChange(getRowKey(activeLabor), 'exmptFl', 'Y')} />
                          <FormInput label="Non-Exempt" type="radio" name="flsa" checked={activeLabor.exmptFl === 'N'} onChange={() => handleFieldChange(getRowKey(activeLabor), 'exmptFl', 'N')} />
                        </div>
                      </div>
                      <FormInput
                        label="Seasonal Employee"
                        type="checkbox"
                        checked={!!(activeLabor.seasonEmplFl === true || activeLabor.seasonEmplFl === 'Y')}
                        onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'seasonEmplFl', e.target.checked)}
                      />
                      <FormInput
                        label="Variable Hour Employee"
                        type="checkbox"
                        checked={!!(activeLabor.variableHrsFl === true || activeLabor.variableHrsFl === 'Y')}
                        onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'variableHrsFl', e.target.checked)}
                      />
                      <FormInput label="Detail Job Title" value={activeLabor.titleDesc ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'titleDesc', e.target.value)} />
                      <FormInput
                        label="Corporate Officer"
                        type="checkbox"
                        checked={!!(activeLabor.corpOfcrFl === true || activeLabor.corpOfcrFl === 'Y')}
                        onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'corpOfcrFl', e.target.checked)}
                      />
                      <FormInput label="Manager" value={activeLabor.mgrEmplId1 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'mgrEmplId1', e.target.value)} />
                      <FormInput label="Manager Name" value={activeLabor.managerName ?? ""} readOnly />
                      <FormInput label="Supervisor" value={activeLabor.spvsrEmplId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'spvsrEmplId', e.target.value)} />
                      <FormInput label="Supervisor Name" value={activeLabor.supervisorName ?? ""} readOnly />
                    </FormSection>

                    <FormSection title="Organization & Details">
                      <FormInput label="Labor Group" value={activeLabor.labGrpType ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'labGrpType', e.target.value)} />
                      <FormInput label="Labor Location" value={activeLabor.labLocCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'labLocCd', e.target.value)} />
                      <FormInput label="GLC *" value={activeLabor.genlLabCatCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'genlLabCatCd', e.target.value)} />
                      <FormInput label="PLC" value={activeLabor.plc ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'plc', e.target.value)} />
                      <FormInput label="Overtime State *" value={activeLabor.workStateCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'workStateCd', e.target.value)} />
                      <FormInput label="Home Organization *" value={activeLabor.orgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'orgId', e.target.value)} />
                      <FormInput label="Security Organization" value={activeLabor.secOrgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'secOrgId', e.target.value)} />
                      <FormInput label="HR Organization" value={activeLabor.hrOrgId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hrOrgId', e.target.value)} />
                      <FormInput label="Personnel Action 1" value={activeLabor.persActRsnCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd', e.target.value)} />
                      <FormInput label="PA 1 Description" value={activeLabor.pa1Desc ?? ""} readOnly />
                      <FormInput label="Personnel Action 2" value={activeLabor.persActRsnCd2 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd2', e.target.value)} />
                      <FormInput label="PA 2 Description" value={activeLabor.pa2Desc ?? ""} readOnly />
                      <FormInput label="Personnel Action 3" value={activeLabor.persActRsnCd3 ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'persActRsnCd3', e.target.value)} />
                      <FormInput label="PA 3 Description" value={activeLabor.pa3Desc ?? ""} readOnly />
                      <FormInput label="Time Collection" value={activeLabor.tcTsSchedCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'tcTsSchedCd', e.target.value)} />
                      <FormInput label="Work Schedule" value={activeLabor.tcWorkSchedCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'tcWorkSchedCd', e.target.value)} />
                      <FormInput label="Ref No 1" value={activeLabor.homeRef1Id ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'homeRef1Id', e.target.value)} />
                      <FormInput label="Ref No 2" value={activeLabor.homeRef2Id ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'homeRef2Id', e.target.value)} />
                    </FormSection>
                  </div>
                )}

                {activeTab === "hrinformation" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormSection title="Compensation Data">
                      <FormInput label="Compensation Plan" value={activeLabor.compPlanCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'compPlanCd', e.target.value)} />
                      <FormInput label="Step" value={activeLabor.sStepNo ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'sStepNo', e.target.value)} />
                      <FormInput label="Grade" value={activeLabor.salGradeCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'salGradeCd', e.target.value)} />
                      <FormInput label="Review Form" value={activeLabor.reviewFormId ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'reviewFormId', e.target.value)} />
                      <FormInput label="Rating" value={activeLabor.overallRt ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'overallRt', e.target.value)} />
                      <FormInput label="Percent Grade Change" value={activeLabor.pctGradeChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctGradeChange', e.target.value)} />
                      <FormInput label="Percent Rating Change" value={activeLabor.pctRatingChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctRatingChange', e.target.value)} />
                      <FormInput label="EEO Code" value={activeLabor.eeoCode ?? ""} readOnly />
                      <FormInput label="Percent Rating Change" value={activeLabor.pctRatingChange ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'pctRatingChange', e.target.value)} />
                    </FormSection>

                    <FormSection title="Affirmative Action Data">
                      <FormInput label="Affirmative Action Plan" value={activeLabor.affPlanCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'affPlanCd', e.target.value)} />
                      <FormInput label="Job Category" value={activeLabor.jobGroupCd ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'jobGroupCd', e.target.value)} />
                      <FormInput label="EEO Code" value={activeLabor.eeoCode ?? ""} readOnly />
                      <div className="ml-[90px] space-y-1 py-1">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={activeLabor.hireDtFl === true || activeLabor.hireDtFl === 'Y'} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'hireDtFl', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
                          <label className="text-[10px] text-gray-700">Effective Date is Hire Date</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={activeLabor.termDtFl === true || activeLabor.termDtFl === 'Y'} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'termDtFl', e.target.checked)} className="h-3 w-3 accent-[#17414d]" />
                          <label className="text-[10px] text-gray-700">Effective Date is Term Date</label>
                        </div>
                      </div>
                      <FormInput label="California Pay Data Reporting Remote Worker Status" type="select" value={activeLabor.caRemoteWorker ?? ""} options={[{ label: "Does not work remotely", value: "none" }, { label: "Works Remotely", value: "remote" }]} optionLabel="label" optionValue="value" />
                      <div className="mt-2">
                        <label className="text-[10px] font-semibold text-gray-800 block mb-1">Comments</label>
                        <textarea className="w-full h-20 p-2 border border-gray-300 rounded text-xs outline-none focus:border-[#17414d]" value={activeLabor.aaComments ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'aaComments', e.target.value)} />
                      </div>
                    </FormSection>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div className="p-2">
                    <FormSection title="Comments">
                      <div className="relative group">
                        <textarea className="w-full h-40 p-3 border border-gray-300 rounded-lg text-xs outline-none focus:border-[#17414d] transition-all resize-none bg-white shadow-inner" placeholder="Enter additional salary or HR comments here..." value={activeLabor.comments ?? ""} onChange={(e) => handleFieldChange(getRowKey(activeLabor), 'comments', e.target.value)} />
                      </div>
                    </FormSection>
                  </div>
                )}
              </div>
              </div>

          ) : (
            <ReusableTable
              data={paginatedRecords}
              columns={salaryColumns}
              selectedRows={selectedIds}
              onRowSelect={(row) => {
                const idx = salaryRecords.findIndex(r => getRowKey(r) === getRowKey(row));
                setCurrentIndex(idx);
                setSelectedIds(new Set([getRowKey(row)]));
              }}
              onFieldChange={handleFieldChange}
              maxHeight="max-h-[65vh]"
            />
          )}
        </div>

        {!isFormView && (
          <div className="w-full bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 mt-1 rounded-b-xl">
            {/* Back Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="text-[#17414d] disabled:opacity-30"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Indicator */}
            <div className="flex items-center gap-1">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#17414d] text-white font-bold text-xs">
                {currentPage}
              </span>
              <span className="text-gray-500 text-xs px-1">of {totalPages}</span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="text-[#17414d] disabled:opacity-30"
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>

            {/* Page Size Selector */}
            <div className="relative flex items-center rounded px-2 bg-white ml-2 border border-gray-200">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="appearance-none bg-transparent py-1 pr-6 pl-1 focus:outline-none cursor-pointer text-[10px] font-bold text-black"
              >
                <option value={15}>15 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <ChevronRight size={14} className="absolute right-1 text-gray-400 pointer-events-none rotate-90" />
            </div>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default ManageEmployeeSalary;