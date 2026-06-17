// // import React, { useState, useEffect } from "react";
// // import {
// //   X,
// //   History,
// //   Award,
// //   ShieldCheck,
// //   GraduationCap,
// //   Lock,
// //   Settings2,
// //   User,
// //   Layers,
// // } from "lucide-react";
// // import { MainContainer, Toolbar } from "../helper/container";
// // import {
// //   FormInput,
// //   FormSearchSelect,
// //   FormSection,
// // } from "../helper/formSection";
// // import { backendUrl } from "./config";
// // import api from "../utils/api";
// // import { toast } from "react-toastify";

// // const ManageCashAccounts = ({ formData, onClose, loading }) => {
// //   const [clipboard, setClipboard] = useState(null);
// //   const [isDirty, setIsDirty] = useState(false);
// //   const [isFormView, setIsFormView] = useState(true);
// //   const [originalData, setOriginalData] = useState([]);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [searchTerm, setSearchTerm] = useState("");

// //   // Options State
// //   //   const [bankAbbrv, setBankAbbrv] = useState([]);
// //   const [acctOpt, setAcctOpt] = useState([]);
// //   const [orgOpt, setOrgOpt] = useState([]);
// //   const [ref1Opt, setRef1Opt] = useState([]);
// //   const [ref2Opt, setRef2Opt] = useState([]);

// //   const bankAbbrv = [
// //     { id: "PRJ01", name: "ISO 9001" },
// //     { id: "PRJ02", name: "CIS Compliance" },
// //   ];
// //   //   const acctOpt = [
// //   //     { id: "EXP01", name: "Travel Expense" },
// //   //     { id: "EXP02", name: "Office Supplies" },
// //   //   ];
// //   //   const orgOpt = [
// //   //     { id: "ORG01", name: "Sales Dept" },
// //   //     { id: "ORG02", name: "IT Dept" },
// //   //   ];

// //   //   const ref1Opt = [
// //   //     { id: "1", name: "Level 1 - Basic" },
// //   //     { id: "2", name: "Level 2 - Advanced" },
// //   //   ];
// //   //   const ref2Opt = [
// //   //     { id: "1", name: "Level 1 - Basic" },
// //   //     { id: "2", name: "Level 2 - Advanced" },
// //   //   ];

// //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// //   const companyId = user.companyId || "1";

// //   const initialDefCashState = {
// //     cashAcctsKey: 0,
// //     acctId: "",
// //     acctName: "",
// //     orgId: "",
// //     orgName: "",
// //     ref1Id: "",
// //     ref1Name: "",
// //     ref2Id: "",
// //     ref2Name: "",
// //     cashAcctsDesc: "",
// //     bankAcctAbbrv: "",
// //     bankAcctName: "",
// //     companyId: companyId,
// //     modifiedBy: user.name || "Admin",
// //     isNew: true,
// //   };

// //   const [defCashInfo, setDefCashInfo] = useState(initialDefCashState);

// //   const enrichRecord = (record, options = {}) => {
// //     const {
// //       accounts = acctOpt,
// //       orgs = orgOpt,
// //       r1 = ref1Opt,
// //       r2 = ref2Opt,
// //     } = options;

// //     return {
// //       ...record,
// //       acctName:
// //         accounts.find((a) => (a.acctId || a.id) === record.acctId)?.acctName ||
// //         "",
// //       orgName:
// //         orgs.find((o) => (o.orgId || o.id) === record.orgId)?.orgName || "",
// //       ref1Name:
// //         r1.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
// //       ref2Name:
// //         r2.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
// //       bankAcctName:
// //         bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
// //       isNew: false,
// //     };
// //   };

// //   //   const enrichRecord = (record) => {
// //   //     return {
// //   //       ...record,
// //   //       // Note: orgOpt uses 'orgId' based on your JSON snippet
// //   //       acctName: acctOpt.find((a) => a.acctId === record.acctId)?.acctName || "",
// //   //       orgName: orgOpt.find((o) => o.orgId === record.orgId)?.orgName || "",
// //   //       // Look up in the ref options using refStrucId
// //   //       ref1Name:
// //   //         ref1Opt.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
// //   //       ref2Name:
// //   //         ref2Opt.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
// //   //       bankAcctName:
// //   //         bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
// //   //       isNew: false,
// //   //     };
// //   //   };

// //   const fetchStaticOptions = async () => {
// //     try {
// //       const [orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
// //         api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
// //         api.get(`${backendUrl}/api/RefStruc`),
// //         api.get(`${backendUrl}/api/RefStruc`),
// //         api.get(`${backendUrl}/api/Account/GetAllAccounts`),
// //       ]);

// //       const options = {
// //         orgs: orgRes.data || [],
// //         r1: ref1Res.data || [],
// //         r2: ref2Res.data || [],
// //         accounts: acctRes.data || [],
// //       };

// //       // Update state for the UI dropdowns
// //       setOrgOpt(options.orgs);
// //       setRef1Opt(options.r1);
// //       setRef2Opt(options.r2);
// //       setAcctOpt(options.accounts);

// //       // CRITICAL: Return the data so the next function can use it immediately
// //       return options;
// //     } catch (error) {
// //       console.error("Error fetching options:", error);
// //       return null;
// //     }
// //   };

// //   //   const fetchStaticOptions = async () => {
// //   //     try {
// //   //       const [projRes, orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
// //   //         api.get(`${backendUrl}/Project/GetAllProjects`),
// //   //         api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
// //   //         api.get(`${backendUrl}/api/RefStruc`),
// //   //         api.get(`${backendUrl}/api/RefStruc `),
// //   //         api.get(`${backendUrl}/api/Account/GetAllAccounts`), // Adjust based on your actual account list API
// //   //       ]);
// //   //       //   setProjectOpt(projRes.data || []);
// //   //       setOrgOpt(orgRes.data || []);
// //   //       setRef1Opt(ref1Res.data || []);
// //   //       setRef2Opt(ref2Res.data || []);
// //   //       setAcctOpt(acctRes.data || []);
// //   //     } catch (error) {
// //   //       console.error("Error fetching options:", error);
// //   //     }
// //   //   };

// //   // 1. Fetch All Static Options on Mount

// //   // 2. Corrected Fetch Function for Cash Accounts
// //   //   const fetchDefCash = async () => {
// //   //     try {
// //   //       const response = await api.get(
// //   //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
// //   //       );

// //   //       // Access response.data.data based on your JSON structure
// //   //       if (response.data?.data?.length > 0) {
// //   //         let record = response.data.data[0];

// //   //         // Enrich record with names from options for the UI
// //   //         record.acctName =
// //   //           acctOpt.find((a) => a.id === record.acctId)?.name || "";
// //   //         record.orgName = orgOpt.find((o) => o.id === record.orgId)?.name || "";
// //   //         record.ref1Name =
// //   //           ref1Opt.find((r) => r.id === record.ref1Id)?.name || "";
// //   //         record.ref2Name =
// //   //           ref2Opt.find((r) => r.id === record.ref2Id)?.name || "";
// //   //         record.bankAcctName =
// //   //           bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "";

// //   //         setDefCashInfo(record);
// //   //         setOriginalData(record);
// //   //         setIsDirty(false);
// //   //       }
// //   //     } catch (error) {
// //   //       console.error("Error fetching cash accounts:", error);
// //   //     }
// //   //   };

// //   const fetchDefCash = async (loadedOptions = null) => {
// //     try {
// //       const response = await api.get(
// //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
// //       );

// //       if (response.data?.data) {
// //         const rawData = response.data.data;

// //         // If we just loaded options, use them directly to avoid the "empty state" race condition
// //         const enriched = rawData.map((record) =>
// //           enrichRecord(record, loadedOptions || {}),
// //         );

// //         setOriginalData(enriched);
// //         if (enriched.length > 0) {
// //           setDefCashInfo(enriched[currentIndex] || enriched[0]);
// //         }
// //         setIsDirty(false);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching cash accounts:", error);
// //     }
// //   };

// //   //   const fetchDefCash = async () => {
// //   //     try {
// //   //       const response = await api.get(
// //   //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
// //   //       );
// //   //       if (response.data?.data) {
// //   //         const rawData = response.data.data;
// //   //         // Enrich all records so navigation is smooth
// //   //         const enriched = rawData.map((record) => enrichRecord(record));

// //   //         setOriginalData(enriched);
// //   //         if (enriched.length > 0) {
// //   //           setDefCashInfo(enriched[0]);
// //   //           setCurrentIndex(0);
// //   //         }
// //   //         setIsDirty(false);
// //   //       }
// //   //     } catch (error) {
// //   //       console.error("Error fetching cash accounts:", error);
// //   //     }
// //   //   };

// //   useEffect(() => {
// //     const init = async () => {
// //       // 1. Get the data directly from the fetch call
// //       const staticData = await fetchStaticOptions();

// //       // 2. Pass that fresh data into the cash fetcher
// //       if (staticData) {
// //         await fetchDefCash(staticData);
// //       } else {
// //         // Fallback if options failed
// //         await fetchDefCash();
// //       }
// //     };

// //     init();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);
// //   useEffect(() => {
// //     fetchStaticOptions();
// //     fetchDefCash();
// //   }, []);

// //   const handleFieldChange = (
// //     field,
// //     value,
// //     nameField = null,
// //     nameValue = null,
// //   ) => {
// //     setDefCashInfo((prev) => {
// //       const updated = { ...prev, [field]: value };
// //       if (nameField) updated[nameField] = nameValue;
// //       return updated;
// //     });
// //     setIsDirty(true);
// //   };

// //   const handleDelete = async () => {
// //     // Only attempt delete if there is a valid primary key
// //     // if (!defCashInfo.cashAcctsKey || defCashInfo.cashAcctsKey === 0) {
// //     //   toast.error("No record selected to delete.");
// //     //   return;
// //     // }

// //     if (window.confirm("Are you sure you want to delete this cash account?")) {
// //       try {
// //         const response = await api.delete(
// //           `${backendUrl}/api/dflt-cash-accts/${defCashInfo.cashAcctsKey}`,
// //         );

// //         if (response.status === 200 || response.status === 204) {
// //           toast.success("Record deleted successfully.");

// //           // Refresh the data list
// //           const updatedResponse = await api.get(
// //             `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
// //           );

// //           if (
// //             updatedResponse.data?.data &&
// //             updatedResponse.data.data.length > 0
// //           ) {
// //             const rawData = updatedResponse.data.data;
// //             const enriched = rawData.map((record) => enrichRecord(record));

// //             setOriginalData(enriched);

// //             // Navigate to the previous available record
// //             const nextIndex = Math.max(0, currentIndex - 1);
// //             setCurrentIndex(nextIndex);
// //             setDefCashInfo(enriched[nextIndex]);
// //           } else {
// //             // No records left
// //             setOriginalData([]);
// //             setDefCashInfo(initialDefCashState);
// //             setCurrentIndex(0);
// //           }
// //           setIsDirty(false);
// //         }
// //       } catch (error) {
// //         console.error("Error deleting record:", error);
// //         toast.error("Failed to delete the record. Please try again.");
// //       }
// //     }
// //   };

// //   const handleSave = async () => {
// //     if (!defCashInfo.acctId) return toast.error("Account is required");

// //     try {
// //       const payload = {
// //         cashAcctsKey: defCashInfo.cashAcctsKey || 0,
// //         acctId: defCashInfo.acctId,
// //         orgId: defCashInfo.orgId || "",
// //         ref1Id: defCashInfo.ref1Id || "",
// //         ref2Id: defCashInfo.ref2Id || "",
// //         bankAcctAbbrv: defCashInfo.bankAcctAbbrv || "",
// //         cashAcctsDesc: defCashInfo.cashAcctsDesc || "",
// //         modifiedBy: user.name || "System",
// //         companyId: companyId,
// //         timeStamp: new Date().toISOString(),
// //       };

// //       const isUpdate = payload.cashAcctsKey > 0;
// //       const url = `${backendUrl}/api/dflt-cash-accts`;

// //       const response = isUpdate
// //         ? await api.put(`${url}/${payload.cashAcctsKey}`, payload)
// //         : await api.post(url, payload);

// //       if (response.status === 200 || response.status === 201) {
// //         toast.success("Cash Account saved successfully!");
// //         setIsDirty(false);
// //         fetchDefCash();
// //       }
// //     } catch (error) {
// //       toast.error("Error saving information.");
// //     }
// //   };

// //   const toolbarActions = {
// //     onAdd: () => {
// //       setDefCashInfo(initialDefCashState);
// //       setIsDirty(true);
// //     },
// //     onSave: handleSave,
// //     onDelete: handleDelete,
// //     onClear: () => {
// //       setDefCashInfo(originalData || initialDefCashState);
// //       setIsDirty(false);
// //     },
// //   };

// //   const handleNavigate = (direction) => {
// //     if (isDirty && !window.confirm("Discard unsaved changes?")) return;
// //     if (!originalData.length) return;

// //     let newIndex = currentIndex;
// //     if (direction === "next" && currentIndex < originalData.length - 1)
// //       newIndex++;
// //     else if (direction === "prev" && currentIndex > 0) newIndex--;
// //     else if (direction === "start") newIndex = 0;
// //     else if (direction === "end") newIndex = originalData.length - 1;

// //     setCurrentIndex(newIndex);
// //     setDefCashInfo(originalData[newIndex]);
// //     setIsDirty(false);
// //   };

// //   return (
// //     <div className="p-4 space-y-4 animate-in fade-in duration-300 mt-10">
// //       <MainContainer title="Manage Cash Accounts" handleClose={onClose}>
// //         <Toolbar
// //           isDirty={isDirty}
// //           loading={loading}
// //           actions={toolbarActions}
// //           isFormView={isFormView}
// //           currentIndex={currentIndex}
// //           totalRecords={originalData.length}
// //           handleNavigate={handleNavigate}
// //         />
// //         <div className="mt-2">
// //           <FormSection>
// //             <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
// //               <FormInput
// //                 label="Cash Account Desc"
// //                 required
// //                 value={defCashInfo.cashAcctsDesc || ""}
// //                 onChange={(e) =>
// //                   handleFieldChange("cashAcctsDesc", e.target.value)
// //                 }
// //               />
// //               <div />

// //               <FormSearchSelect
// //                 label="Account"
// //                 options={acctOpt}
// //                 value={defCashInfo.acctId}
// //                 displayKey="acctId"
// //                 onSelect={(val) =>
// //                   // Use val.acctId if that is what the API returns
// //                   handleFieldChange(
// //                     "acctId",
// //                     val.acctId || val.id,
// //                     "acctName",
// //                     val.acctName || val.name,
// //                   )
// //                 }
// //               />
// //               <FormInput
// //                 label="Account Name"
// //                 disabled
// //                 value={defCashInfo.acctName || ""}
// //               />

// //               <FormSearchSelect
// //                 label="Organization"
// //                 options={orgOpt}
// //                 value={defCashInfo.orgId}
// //                 displayKey="orgId"
// //                 onSelect={(val) =>
// //                   handleFieldChange(
// //                     "orgId",
// //                     val.orgId || val.id,
// //                     "orgName",
// //                     val.orgName || val.name,
// //                   )
// //                 }
// //               />
// //               <FormInput
// //                 label="Org Name"
// //                 disabled
// //                 value={defCashInfo.orgName || ""}
// //               />

// //               <FormSearchSelect
// //                 label="Bank Abbrev"
// //                 options={bankAbbrv}
// //                 value={defCashInfo.bankAcctAbbrv}
// //                 displayKey="id"
// //                 onSelect={(val) =>
// //                   handleFieldChange(
// //                     "bankAcctAbbrv",
// //                     val.id,
// //                     "bankAcctName",
// //                     val.name,
// //                   )
// //                 }
// //               />
// //               <FormInput
// //                 label="Bank Abbrev Name"
// //                 disabled
// //                 value={defCashInfo.bankAcctName || ""}
// //               />

// //               <FormSearchSelect
// //                 label="Ref No 1"
// //                 options={ref1Opt}
// //                 value={defCashInfo.ref1Id}
// //                 displayKey="refStrucId"
// //                 onSelect={(val) =>
// //                   handleFieldChange(
// //                     "ref1Id",
// //                     val.refStrucId,
// //                     "ref1Name",
// //                     val.refStrucName,
// //                   )
// //                 }
// //               />
// //               <FormInput
// //                 label="Ref No 1 Name"
// //                 disabled
// //                 value={defCashInfo.ref1Name || ""}
// //               />

// //               <FormSearchSelect
// //                 label="Ref No 2"
// //                 options={ref2Opt}
// //                 value={defCashInfo.ref2Id}
// //                 displayKey="refStrucId"
// //                 onSelect={(val) =>
// //                   handleFieldChange(
// //                     "ref2Id",
// //                     val.refStrucId,
// //                     "ref2Name",
// //                     val.refStrucName,
// //                   )
// //                 }
// //               />
// //               <FormInput
// //                 label="Ref No 2 Name"
// //                 disabled
// //                 value={defCashInfo.ref2Name || ""}
// //               />
// //             </div>
// //           </FormSection>
// //         </div>
// //       </MainContainer>
// //     </div>
// //   );
// // };

// // export default ManageCashAccounts;

// import React, { useState, useEffect, useRef } from "react";
// import { MainContainer, Toolbar } from "../helper/container";
// import {
//   FormInput,
//   FormSearchSelect,
//   FormSection,
// } from "../helper/formSection";
// import { backendUrl } from "./config";
// import api from "../utils/api";
// import { toast } from "react-toastify";
// import { TableSearchSelect } from "../helper/tableSection";

// const ManageCashAccounts = ({ formData, onClose, loading }) => {
//   const [clipboard, setClipboard] = useState(null);
//   const [isDirty, setIsDirty] = useState(false);
//   const [isFormView, setIsFormView] = useState(true);
//   const [originalData, setOriginalData] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedRows, setSelectedRows] = useState(new Set());

//   // Options State
//   //   const [bankAbbrv, setBankAbbrv] = useState([]);
//   const [acctOpt, setAcctOpt] = useState([]);
//   const [orgOpt, setOrgOpt] = useState([]);
//   const [ref1Opt, setRef1Opt] = useState([]);
//   const [ref2Opt, setRef2Opt] = useState([]);

//   const bankAbbrv = [
//     { id: "PRJ01", name: "ISO 9001" },
//     { id: "PRJ02", name: "CIS Compliance" },
//   ];
//   //   const acctOpt = [
//   //     { id: "EXP01", name: "Travel Expense" },
//   //     { id: "EXP02", name: "Office Supplies" },
//   //   ];
//   //   const orgOpt = [
//   //     { id: "ORG01", name: "Sales Dept" },
//   //     { id: "ORG02", name: "IT Dept" },
//   //   ];

//   //   const ref1Opt = [
//   //     { id: "1", name: "Level 1 - Basic" },
//   //     { id: "2", name: "Level 2 - Advanced" },
//   //   ];
//   //   const ref2Opt = [
//   //     { id: "1", name: "Level 1 - Basic" },
//   //     { id: "2", name: "Level 2 - Advanced" },
//   //   ];

//   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
//   const companyId = user.companyId || "1";

//   const initialDefCashState = {
//     cashAcctsKey: 0,
//     acctId: "",
//     acctName: "",
//     orgId: "",
//     orgName: "",
//     ref1Id: "",
//     ref1Name: "",
//     ref2Id: "",
//     ref2Name: "",
//     cashAcctsDesc: "",
//     bankAcctAbbrv: "",
//     bankAcctName: "",
//     companyId: companyId,
//     modifiedBy: user.name || "Admin",
//     isNew: true,
//   };

//   const COLUMN_LABELS = {
//     cashAcctsDesc: "Cash Account Desc",
//     acctId: "Account",
//     acctName: "Account Name",
//     orgId: "Organization",
//     orgName: "Organization Name",
//     bankAcctAbbrv: "Bank Abbrev",
//     bankAcctName: "Bank Abbrev Name",
//     ref1Id: "Ref No 1",
//     ref1Name: "Ref No 1 Name",
//     ref2Id: "Ref No 2",
//     ref2Name: "Ref No 2 Name",
//   };

//   const REQUIRED_FIELDS = new Set([
//     "cashAcctsDesc",
//     "acctId",
//     "orgId",
//     "bankAcctAbbrv",
//   ]);

//   const renderRequiredLabel = (label) => (
//     <>
//       {label} <span className="text-red-600">*</span>
//     </>
//   );

//   const renderColumnLabel = (columnKey) => (
//     <>
//       {COLUMN_LABELS[columnKey]}
//       {REQUIRED_FIELDS.has(columnKey) && (
//         <span className="text-red-600 ml-0.5">*</span>
//       )}
//     </>
//   );

//   const columns = Object.keys(COLUMN_LABELS);

//   const [defCashInfo, setDefCashInfo] = useState(initialDefCashState);
//   const defCashInfoRef = useRef(initialDefCashState);

//   const enrichRecord = (record, options = {}) => {
//     const {
//       accounts = acctOpt,
//       orgs = orgOpt,
//       r1 = ref1Opt,
//       r2 = ref2Opt,
//     } = options;

//     return {
//       ...record,
//       acctName:
//         accounts.find((a) => (a.acctId || a.id) === record.acctId)?.acctName ||
//         "",
//       orgName:
//         orgs.find((o) => (o.orgId || o.id) === record.orgId)?.orgName || "",
//       ref1Name:
//         r1.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
//       ref2Name:
//         r2.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
//       bankAcctName:
//         bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
//       isNew: false,
//     };
//   };

//   //   const enrichRecord = (record) => {
//   //     return {
//   //       ...record,
//   //       // Note: orgOpt uses 'orgId' based on your JSON snippet
//   //       acctName: acctOpt.find((a) => a.acctId === record.acctId)?.acctName || "",
//   //       orgName: orgOpt.find((o) => o.orgId === record.orgId)?.orgName || "",
//   //       // Look up in the ref options using refStrucId
//   //       ref1Name:
//   //         ref1Opt.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
//   //       ref2Name:
//   //         ref2Opt.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
//   //       bankAcctName:
//   //         bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
//   //       isNew: false,
//   //     };
//   //   };

//   const fetchStaticOptions = async () => {
//     try {
//       const [orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
//         api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
//         api.get(`${backendUrl}/api/RefStruc`),
//         api.get(`${backendUrl}/api/RefStruc`),
//         api.get(`${backendUrl}/api/Account/GetAllAccounts`),
//       ]);

//       const options = {
//         orgs: orgRes.data || [],
//         r1: ref1Res.data || [],
//         r2: ref2Res.data || [],
//         accounts: acctRes.data || [],
//       };

//       // Update state for the UI dropdowns
//       setOrgOpt(options.orgs);
//       setRef1Opt(options.r1);
//       setRef2Opt(options.r2);
//       setAcctOpt(options.accounts);

//       // CRITICAL: Return the data so the next function can use it immediately
//       return options;
//     } catch (error) {
//       console.error("Error fetching options:", error);
//       return null;
//     }
//   };

//   //   const fetchStaticOptions = async () => {
//   //     try {
//   //       const [projRes, orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
//   //         api.get(`${backendUrl}/Project/GetAllProjects`),
//   //         api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
//   //         api.get(`${backendUrl}/api/RefStruc`),
//   //         api.get(`${backendUrl}/api/RefStruc `),
//   //         api.get(`${backendUrl}/api/Account/GetAllAccounts`), // Adjust based on your actual account list API
//   //       ]);
//   //       //   setProjectOpt(projRes.data || []);
//   //       setOrgOpt(orgRes.data || []);
//   //       setRef1Opt(ref1Res.data || []);
//   //       setRef2Opt(ref2Res.data || []);
//   //       setAcctOpt(acctRes.data || []);
//   //     } catch (error) {
//   //       console.error("Error fetching options:", error);
//   //     }
//   //   };

//   // 1. Fetch All Static Options on Mount

//   // 2. Corrected Fetch Function for Cash Accounts
//   //   const fetchDefCash = async () => {
//   //     try {
//   //       const response = await api.get(
//   //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
//   //       );

//   //       // Access response.data.data based on your JSON structure
//   //       if (response.data?.data?.length > 0) {
//   //         let record = response.data.data[0];

//   //         // Enrich record with names from options for the UI
//   //         record.acctName =
//   //           acctOpt.find((a) => a.id === record.acctId)?.name || "";
//   //         record.orgName = orgOpt.find((o) => o.id === record.orgId)?.name || "";
//   //         record.ref1Name =
//   //           ref1Opt.find((r) => r.id === record.ref1Id)?.name || "";
//   //         record.ref2Name =
//   //           ref2Opt.find((r) => r.id === record.ref2Id)?.name || "";
//   //         record.bankAcctName =
//   //           bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "";

//   //         setDefCashInfo(record);
//   //         setOriginalData(record);
//   //         setIsDirty(false);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching cash accounts:", error);
//   //     }
//   //   };

//   const fetchDefCash = async (loadedOptions = null) => {
//     try {
//       const response = await api.get(
//         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
//       );

//       if (response.data?.data) {
//         const rawData = response.data.data;

//         // If we just loaded options, use them directly to avoid the "empty state" race condition
//         const enriched = rawData.map((record) =>
//           enrichRecord(record, loadedOptions || {}),
//         );

//         setOriginalData(enriched);
//         if (enriched.length > 0) {
//           const activeRecord = enriched[currentIndex] || enriched[0];
//           setDefCashInfo(activeRecord);
//           defCashInfoRef.current = activeRecord;
//         } else {
//           setDefCashInfo(initialDefCashState);
//           defCashInfoRef.current = initialDefCashState;
//         }
//         setIsDirty(false);
//       }
//     } catch (error) {
//       console.error("Error fetching cash accounts:", error);
//     }
//   };

//   //   const fetchDefCash = async () => {
//   //     try {
//   //       const response = await api.get(
//   //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
//   //       );
//   //       if (response.data?.data) {
//   //         const rawData = response.data.data;
//   //         // Enrich all records so navigation is smooth
//   //         const enriched = rawData.map((record) => enrichRecord(record));

//   //         setOriginalData(enriched);
//   //         if (enriched.length > 0) {
//   //           setDefCashInfo(enriched[0]);
//   //           setCurrentIndex(0);
//   //         }
//   //         setIsDirty(false);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching cash accounts:", error);
//   //     }
//   //   };

//   useEffect(() => {
//     const init = async () => {
//       // 1. Get the data directly from the fetch call
//       const staticData = await fetchStaticOptions();

//       // 2. Pass that fresh data into the cash fetcher
//       if (staticData) {
//         await fetchDefCash(staticData);
//       } else {
//         // Fallback if options failed
//         await fetchDefCash();
//       }
//     };

//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   const handleFieldChange = (
//     field,
//     value,
//     nameField = null,
//     nameValue = null,
//   ) => {
//     const activeKey =
//       defCashInfoRef.current.cashAcctsKey ||
//       defCashInfoRef.current.tempId ||
//       currentIndex;

//     const updates = { [field]: value };
//     if (nameField) updates[nameField] = nameValue;

//     setDefCashInfo((prev) => {
//       const updated = { ...prev, ...updates };
//       defCashInfoRef.current = updated;
//       return updated;
//     });

//     setOriginalData((prev) =>
//       prev.map((item, index) => {
//         const itemKey = item.cashAcctsKey || item.tempId || index;
//         return itemKey === activeKey ? { ...item, ...updates } : item;
//       }),
//     );

//     setIsDirty(true);
//   };

//   const handleTableFieldChange = (field, value, uniqueKey, nameField, nameValue) => {
//     const updates = { [field]: value };
//     if (nameField) updates[nameField] = nameValue;

//     setOriginalData((prev) =>
//       prev.map((item, index) => {
//         const itemKey = item.cashAcctsKey || item.tempId || index;
//         return itemKey === uniqueKey ? { ...item, ...updates } : item;
//       }),
//     );

//     const activeKey =
//       defCashInfoRef.current.cashAcctsKey ||
//       defCashInfoRef.current.tempId ||
//       currentIndex;

//     if (activeKey === uniqueKey) {
//       const updated = { ...defCashInfoRef.current, ...updates };
//       setDefCashInfo(updated);
//       defCashInfoRef.current = updated;
//     }

//     setIsDirty(true);
//   };

//   const handleDelete = async () => {
//     // Only attempt delete if there is a valid primary key
//     // if (!defCashInfo.cashAcctsKey || defCashInfo.cashAcctsKey === 0) {
//     //   toast.error("No record selected to delete.");
//     //   return;
//     // }

//     if (window.confirm("Are you sure you want to delete this cash account?")) {
//       try {
//         const response = await api.delete(
//           `${backendUrl}/api/dflt-cash-accts/${defCashInfo.cashAcctsKey}`,
//         );

//         if (response.status === 200 || response.status === 204) {
//           toast.success("Record deleted successfully.");

//           // Refresh the data list
//           const updatedResponse = await api.get(
//             `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
//           );

//           if (
//             updatedResponse.data?.data &&
//             updatedResponse.data.data.length > 0
//           ) {
//             const rawData = updatedResponse.data.data;
//             const enriched = rawData.map((record) => enrichRecord(record));

//             setOriginalData(enriched);

//             // Navigate to the previous available record
//             const nextIndex = Math.max(0, currentIndex - 1);
//             setCurrentIndex(nextIndex);
//             setDefCashInfo(enriched[nextIndex]);
//           } else {
//             // No records left
//             setOriginalData([]);
//             setDefCashInfo(initialDefCashState);
//             setCurrentIndex(0);
//           }
//           setIsDirty(false);
//         }
//       } catch (error) {
//         console.error("Error deleting record:", error);
//         toast.error("Failed to delete the record. Please try again.");
//       }
//     }
//   };

//   const handleSave = async () => {
//     const activeData = isFormView
//       ? defCashInfoRef.current
//       : originalData[currentIndex] || defCashInfoRef.current;

//     if (!activeData.cashAcctsDesc) {
//       return toast.error("Cash Account Desc is required");
//     }

//     if (!activeData.acctId) return toast.error("Account is required");

//     if (!activeData.orgId) return toast.error("Organization is required");

//     if (!activeData.bankAcctAbbrv) return toast.error("Bank Abbrev is required");

//     try {
//       const payload = {
//         cashAcctsKey: activeData.cashAcctsKey || 0,
//         acctId: activeData.acctId,
//         orgId: activeData.orgId || "",
//         ref1Id: activeData.ref1Id || "",
//         ref2Id: activeData.ref2Id || "",
//         bankAcctAbbrv: activeData.bankAcctAbbrv || "",
//         cashAcctsDesc: activeData.cashAcctsDesc || "",
//         modifiedBy: user.name || "System",
//         companyId: companyId,
//         timeStamp: new Date().toISOString(),
//       };

//       const isUpdate = payload.cashAcctsKey > 0;
//       const url = `${backendUrl}/api/dflt-cash-accts`;

//       const response = isUpdate
//         ? await api.put(`${url}/${payload.cashAcctsKey}`, payload)
//         : await api.post(url, payload);

//       if (response.status === 200 || response.status === 201) {
//         toast.success("Cash Account saved successfully!");
//         setIsDirty(false);
//         fetchDefCash();
//       }
//     } catch (error) {
//       toast.error("Error saving information.");
//     }
//   };

//   const toolbarActions = {
//     onAdd: () => {
//       const newRecord = {
//         ...initialDefCashState,
//         tempId: Date.now(),
//       };
//       setOriginalData((prev) => [...prev, newRecord]);
//       setDefCashInfo(newRecord);
//       defCashInfoRef.current = newRecord;
//       setCurrentIndex(originalData.length);
//       setIsDirty(true);
//     },
//     onSave: handleSave,
//     onDelete: handleDelete,
//     onClear: () => {
//       const activeRecord = originalData[currentIndex] || initialDefCashState;
//       setDefCashInfo(activeRecord);
//       defCashInfoRef.current = activeRecord;
//       setIsDirty(false);
//     },
//     onToggleView: () => {
//       setIsFormView((prev) => !prev);
//     },
//   };

//   const handleNavigate = (direction) => {
//     if (isDirty && !window.confirm("Discard unsaved changes?")) return;
//     if (!originalData.length) return;

//     let newIndex = currentIndex;
//     if (direction === "next" && currentIndex < originalData.length - 1)
//       newIndex++;
//     else if (direction === "prev" && currentIndex > 0) newIndex--;
//     else if (direction === "start") newIndex = 0;
//     else if (direction === "end") newIndex = originalData.length - 1;

//     setCurrentIndex(newIndex);
//     setDefCashInfo(originalData[newIndex]);
//     defCashInfoRef.current = originalData[newIndex];
//     setIsDirty(false);
//   };

//   const isAllSelected =
//     originalData.length > 0 && selectedRows.size === originalData.length;

//   const toggleSelectAll = () => {
//     if (isAllSelected) {
//       setSelectedRows(new Set());
//     } else {
//       setSelectedRows(
//         new Set(originalData.map((item, idx) => item.cashAcctsKey || item.tempId || idx)),
//       );
//     }
//   };

//   return (
//     <div className="p-4 space-y-4 animate-in fade-in duration-300 mt-10">
//       <MainContainer title="Manage Cash Accounts" handleClose={onClose}>
//         <Toolbar
//           isDirty={isDirty}
//           loading={loading}
//           setSearchValue={setSearchValue}
//           searchValue={searchValue}
//           actions={toolbarActions}
//           isFormView={isFormView}
//           jumpToCode={() => {}}
//           currentIndex={currentIndex}
//           totalRecords={originalData.length}
//           handleNavigate={handleNavigate}
//         />
//         {isFormView ? (
//         <div className="mt-2">
//           <FormSection>
//             <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
//               <FormInput
//                 label={renderRequiredLabel("Cash Account Desc")}
//                 value={defCashInfo.cashAcctsDesc || ""}
//                 onChange={(e) =>
//                   handleFieldChange("cashAcctsDesc", e.target.value)
//                 }
//               />
//               <div />

//               <FormSearchSelect
//                 label={renderRequiredLabel("Account")}
//                 options={acctOpt}
//                 value={defCashInfo.acctId}
//                 displayKey="acctId"
//                 onSelect={(val) =>
//                   // Use val.acctId if that is what the API returns
//                   handleFieldChange(
//                     "acctId",
//                     val.acctId || val.id,
//                     "acctName",
//                     val.acctName || val.name,
//                   )
//                 }
//               />
//               <FormInput
//                 label="Account Name"
//                 disabled
//                 value={defCashInfo.acctName || ""}
//               />

//               <FormSearchSelect
//                 label={renderRequiredLabel("Organization")}
//                 options={orgOpt}
//                 value={defCashInfo.orgId}
//                 displayKey="orgId"
//                 onSelect={(val) =>
//                   handleFieldChange(
//                     "orgId",
//                     val.orgId || val.id,
//                     "orgName",
//                     val.orgName || val.name,
//                   )
//                 }
//               />
//               <FormInput
//                 label="Org Name"
//                 disabled
//                 value={defCashInfo.orgName || ""}
//               />

//               <FormSearchSelect
//                 label={renderRequiredLabel("Bank Abbrev")}
//                 options={bankAbbrv}
//                 value={defCashInfo.bankAcctAbbrv}
//                 displayKey="id"
//                 onSelect={(val) =>
//                   handleFieldChange(
//                     "bankAcctAbbrv",
//                     val.id,
//                     "bankAcctName",
//                     val.name,
//                   )
//                 }
//               />
//               <FormInput
//                 label="Bank Abbrev Name"
//                 disabled
//                 value={defCashInfo.bankAcctName || ""}
//               />

//               <FormSearchSelect
//                 label="Ref No 1"
//                 options={ref1Opt}
//                 value={defCashInfo.ref1Id}
//                 displayKey="refStrucId"
//                 onSelect={(val) =>
//                   handleFieldChange(
//                     "ref1Id",
//                     val.refStrucId,
//                     "ref1Name",
//                     val.refStrucName,
//                   )
//                 }
//               />
//               <FormInput
//                 label="Ref No 1 Name"
//                 disabled
//                 value={defCashInfo.ref1Name || ""}
//               />

//               <FormSearchSelect
//                 label="Ref No 2"
//                 options={ref2Opt}
//                 value={defCashInfo.ref2Id}
//                 displayKey="refStrucId"
//                 onSelect={(val) =>
//                   handleFieldChange(
//                     "ref2Id",
//                     val.refStrucId,
//                     "ref2Name",
//                     val.refStrucName,
//                   )
//                 }
//               />
//               <FormInput
//                 label="Ref No 2 Name"
//                 disabled
//                 value={defCashInfo.ref2Name || ""}
//               />
//             </div>
//           </FormSection>
//         </div>
//         ) : (
//           <div className="overflow-x-auto max-h-[35vh]">
//             <table className="min-w-full text-sm border border-gray-300 rounded">
//               <thead className="bg-gray-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="th-thead w-10">
//                     <input
//                       type="checkbox"
//                       checked={isAllSelected}
//                       onChange={toggleSelectAll}
//                     />
//                   </th>
//                   {columns.map((col) => (
//                     <th key={col} className="th-thead">
//                       <div className="flex items-center justify-center">
//                         <span>{renderColumnLabel(col)}</span>
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="tbody">
//                 {originalData.map((item, index) => {
//                   const uniqueKey = item.cashAcctsKey || item.tempId || index;
//                   const isRowChecked = selectedRows.has(uniqueKey);

//                   return (
//                     <tr
//                       key={uniqueKey}
//                       className={`${
//                         isRowChecked ? "bg-blue-50" : ""
//                       } hover:bg-gray-50 transition-colors cursor-pointer`}
//                     >
//                       <td className="text-center tbody-td w-10">
//                         <input
//                           type="checkbox"
//                           checked={isRowChecked}
//                           className="h-3 w-3 accent-blue-600 cursor-pointer"
//                           onChange={() => {
//                             const newSet = new Set(selectedRows);
//                             if (newSet.has(uniqueKey)) {
//                               newSet.delete(uniqueKey);
//                             } else {
//                               newSet.add(uniqueKey);
//                               setDefCashInfo(item);
//                               defCashInfoRef.current = item;
//                               setCurrentIndex(index);
//                             }
//                             setSelectedRows(newSet);
//                           }}
//                         />
//                       </td>

//                       {columns.map((columnKey) => {
//                         const isAccount = columnKey === "acctId";
//                         const isOrg = columnKey === "orgId";
//                         const isBank = columnKey === "bankAcctAbbrv";
//                         const isRef1 = columnKey === "ref1Id";
//                         const isRef2 = columnKey === "ref2Id";
//                         const isDescription = columnKey === "cashAcctsDesc";
//                         const isAutoPopulatedName = [
//                           "acctName",
//                           "orgName",
//                           "bankAcctName",
//                           "ref1Name",
//                           "ref2Name",
//                         ].includes(columnKey);
//                         const isDisabled =
//                           isAutoPopulatedName ||
//                           (isDescription && item.cashAcctsKey !== 0);

//                         return (
//                           <td key={columnKey} className="tbody-td">
//                             {isAccount || isOrg || isBank || isRef1 || isRef2 ? (
//                               <TableSearchSelect
//                                 value={item[columnKey]}
//                                 options={
//                                   isAccount
//                                     ? acctOpt
//                                     : isOrg
//                                       ? orgOpt
//                                       : isBank
//                                         ? bankAbbrv
//                                         : isRef1
//                                           ? ref1Opt
//                                           : ref2Opt
//                                 }
//                                 displayKey={
//                                   isAccount
//                                     ? "acctId"
//                                     : isOrg
//                                       ? "orgId"
//                                       : isBank
//                                         ? "id"
//                                         : "refStrucId"
//                                 }
//                                 onSelect={(val) => {
//                                   const nameKey = isAccount
//                                     ? "acctName"
//                                     : isOrg
//                                       ? "orgName"
//                                       : isBank
//                                         ? "bankAcctName"
//                                         : isRef1
//                                           ? "ref1Name"
//                                           : "ref2Name";
//                                   const displayVal = isAccount
//                                     ? val.acctId
//                                     : isOrg
//                                       ? val.orgId
//                                       : isBank
//                                         ? val.id
//                                         : val.refStrucId;
//                                   const nameVal = isAccount
//                                     ? val.acctName
//                                     : isOrg
//                                       ? val.orgName
//                                       : isBank
//                                         ? val.name
//                                         : val.refStrucName;

//                                   handleTableFieldChange(
//                                     columnKey,
//                                     displayVal,
//                                     uniqueKey,
//                                     nameKey,
//                                     nameVal,
//                                   );
//                                 }}
//                               />
//                             ) : (
//                               <input
//                                 className={`td-input min-w-[150px] ${
//                                   isRowChecked ? "bg-blue-50" : "bg-transparent"
//                                 } ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
//                                 value={item[columnKey] || ""}
//                                 disabled={isDisabled}
//                                 onChange={(e) =>
//                                   handleTableFieldChange(
//                                     columnKey,
//                                     e.target.value,
//                                     uniqueKey,
//                                   )
//                                 }
//                               />
//                             )}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageCashAccounts;

import React, { useState, useEffect, useRef } from "react";
import { MainContainer, Toolbar } from "../helper/container";
import {
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../helper/formSection";
import { backendUrl } from "./config";
import api from "../utils/api";
import { toast } from "react-toastify";
import { TableSearchSelect } from "../helper/tableSection";

const ManageCashAccounts = ({ formData, onClose, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectSearchTerms, setSelectSearchTerms] = useState({
    acctId: "",
    orgId: "",
    bankAcctAbbrv: "",
    ref1Id: "",
    ref2Id: "",
  });
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Options State
  //   const [bankAbbrv, setBankAbbrv] = useState([]);
  const [acctOpt, setAcctOpt] = useState([]);
  const [orgOpt, setOrgOpt] = useState([]);
  const [ref1Opt, setRef1Opt] = useState([]);
  const [ref2Opt, setRef2Opt] = useState([]);

  const bankAbbrv = [
    { id: "PRJ01", name: "ISO 9001" },
    { id: "PRJ02", name: "CIS Compliance" },
  ];
  //   const acctOpt = [
  //     { id: "EXP01", name: "Travel Expense" },
  //     { id: "EXP02", name: "Office Supplies" },
  //   ];
  //   const orgOpt = [
  //     { id: "ORG01", name: "Sales Dept" },
  //     { id: "ORG02", name: "IT Dept" },
  //   ];

  //   const ref1Opt = [
  //     { id: "1", name: "Level 1 - Basic" },
  //     { id: "2", name: "Level 2 - Advanced" },
  //   ];
  //   const ref2Opt = [
  //     { id: "1", name: "Level 1 - Basic" },
  //     { id: "2", name: "Level 2 - Advanced" },
  //   ];

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const initialDefCashState = {
    cashAcctsKey: 0,
    acctId: "",
    acctName: "",
    orgId: "",
    orgName: "",
    ref1Id: "",
    ref1Name: "",
    ref2Id: "",
    ref2Name: "",
    cashAcctsDesc: "",
    bankAcctAbbrv: "",
    bankAcctName: "",
    companyId: companyId,
    modifiedBy: user.name || "Admin",
    isNew: true,
  };

  const COLUMN_LABELS = {
    cashAcctsDesc: "Cash Account Desc",
    acctId: "Account",
    acctName: "Account Name",
    orgId: "Organization",
    orgName: "Organization Name",
    bankAcctAbbrv: "Bank Abbrev",
    bankAcctName: "Bank Abbrev Name",
    ref1Id: "Ref No 1",
    ref1Name: "Ref No 1 Name",
    ref2Id: "Ref No 2",
    ref2Name: "Ref No 2 Name",
  };

  const REQUIRED_FIELDS = new Set([
    "cashAcctsDesc",
    "acctId",
    "orgId",
    "bankAcctAbbrv",
  ]);

  const renderRequiredLabel = (label) => (
    <>
      {label} <span className="text-red-600">*</span>
    </>
  );

  const renderColumnLabel = (columnKey) => (
    <>
      {COLUMN_LABELS[columnKey]}
      {REQUIRED_FIELDS.has(columnKey) && (
        <span className="text-red-600 ml-0.5">*</span>
      )}
    </>
  );

  const columns = Object.keys(COLUMN_LABELS);

  const [defCashInfo, setDefCashInfo] = useState(initialDefCashState);
  const defCashInfoRef = useRef(initialDefCashState);

  const setSelectSearchTerm = (field) => (value) => {
    setSelectSearchTerms((prev) => ({ ...prev, [field]: value }));
  };

  const getCashRowKey = (record, fallbackIndex) =>
    record?.cashAcctsKey && record.cashAcctsKey > 0
      ? record.cashAcctsKey
      : record?.tempId ?? fallbackIndex;

  const enrichRecord = (record, options = {}) => {
    const {
      accounts = acctOpt,
      orgs = orgOpt,
      r1 = ref1Opt,
      r2 = ref2Opt,
    } = options;

    return {
      ...record,
      acctName:
        accounts.find((a) => (a.acctId || a.id) === record.acctId)?.acctName ||
        "",
      orgName:
        orgs.find((o) => (o.orgId || o.id) === record.orgId)?.orgName || "",
      ref1Name:
        r1.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
      ref2Name:
        r2.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
      bankAcctName:
        bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
      isNew: false,
    };
  };

  //   const enrichRecord = (record) => {
  //     return {
  //       ...record,
  //       // Note: orgOpt uses 'orgId' based on your JSON snippet
  //       acctName: acctOpt.find((a) => a.acctId === record.acctId)?.acctName || "",
  //       orgName: orgOpt.find((o) => o.orgId === record.orgId)?.orgName || "",
  //       // Look up in the ref options using refStrucId
  //       ref1Name:
  //         ref1Opt.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
  //       ref2Name:
  //         ref2Opt.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
  //       bankAcctName:
  //         bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
  //       isNew: false,
  //     };
  //   };

  const fetchStaticOptions = async () => {
    try {
      const [orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
        api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
        api.get(`${backendUrl}/api/RefStruc`),
        api.get(`${backendUrl}/api/RefStruc`),
        api.get(`${backendUrl}/api/Account/GetAllAccounts`),
      ]);

      const options = {
        orgs: orgRes.data || [],
        r1: ref1Res.data || [],
        r2: ref2Res.data || [],
        accounts: acctRes.data || [],
      };

      // Update state for the UI dropdowns
      setOrgOpt(options.orgs);
      setRef1Opt(options.r1);
      setRef2Opt(options.r2);
      setAcctOpt(options.accounts);

      // CRITICAL: Return the data so the next function can use it immediately
      return options;
    } catch (error) {
      console.error("Error fetching options:", error);
      return null;
    }
  };

  //   const fetchStaticOptions = async () => {
  //     try {
  //       const [projRes, orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
  //         api.get(`${backendUrl}/Project/GetAllProjects`),
  //         api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
  //         api.get(`${backendUrl}/api/RefStruc`),
  //         api.get(`${backendUrl}/api/RefStruc `),
  //         api.get(`${backendUrl}/api/Account/GetAllAccounts`), // Adjust based on your actual account list API
  //       ]);
  //       //   setProjectOpt(projRes.data || []);
  //       setOrgOpt(orgRes.data || []);
  //       setRef1Opt(ref1Res.data || []);
  //       setRef2Opt(ref2Res.data || []);
  //       setAcctOpt(acctRes.data || []);
  //     } catch (error) {
  //       console.error("Error fetching options:", error);
  //     }
  //   };

  // 1. Fetch All Static Options on Mount

  // 2. Corrected Fetch Function for Cash Accounts
  //   const fetchDefCash = async () => {
  //     try {
  //       const response = await api.get(
  //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
  //       );

  //       // Access response.data.data based on your JSON structure
  //       if (response.data?.data?.length > 0) {
  //         let record = response.data.data[0];

  //         // Enrich record with names from options for the UI
  //         record.acctName =
  //           acctOpt.find((a) => a.id === record.acctId)?.name || "";
  //         record.orgName = orgOpt.find((o) => o.id === record.orgId)?.name || "";
  //         record.ref1Name =
  //           ref1Opt.find((r) => r.id === record.ref1Id)?.name || "";
  //         record.ref2Name =
  //           ref2Opt.find((r) => r.id === record.ref2Id)?.name || "";
  //         record.bankAcctName =
  //           bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "";

  //         setDefCashInfo(record);
  //         setOriginalData(record);
  //         setIsDirty(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching cash accounts:", error);
  //     }
  //   };

  const fetchDefCash = async (loadedOptions = null, preserve = {}) => {
    try {
      const response = await api.get(
        `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
      );

      if (response.data?.data) {
        const rawData = response.data.data;

        // If we just loaded options, use them directly to avoid the "empty state" race condition
        const enriched = rawData.map((record) =>
          enrichRecord(record, loadedOptions || {}),
        );
        const { preserveKey, preserveIndex } = preserve;
        let nextData = enriched;
        let nextIndex =
          preserveIndex !== undefined && preserveIndex !== null
            ? preserveIndex
            : currentIndex;

        if (preserveKey !== undefined && preserveKey !== null) {
          const foundIndex = enriched.findIndex(
            (record, index) => getCashRowKey(record, index) === preserveKey,
          );

          if (foundIndex >= 0) {
            nextData = [...enriched];
            const [savedRecord] = nextData.splice(foundIndex, 1);
            const boundedIndex = Math.min(
              Math.max(nextIndex, 0),
              nextData.length,
            );
            nextData.splice(boundedIndex, 0, savedRecord);
            nextIndex = boundedIndex;
          }
        }

        setOriginalData(nextData);
        if (nextData.length > 0) {
          const boundedIndex = Math.min(
            Math.max(nextIndex, 0),
            nextData.length - 1,
          );
          const activeRecord = nextData[boundedIndex] || nextData[0];
          setCurrentIndex(boundedIndex);
          setDefCashInfo(activeRecord);
          defCashInfoRef.current = activeRecord;
        } else {
          setDefCashInfo(initialDefCashState);
          defCashInfoRef.current = initialDefCashState;
        }
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error fetching cash accounts:", error);
    }
  };

  //   const fetchDefCash = async () => {
  //     try {
  //       const response = await api.get(
  //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
  //       );
  //       if (response.data?.data) {
  //         const rawData = response.data.data;
  //         // Enrich all records so navigation is smooth
  //         const enriched = rawData.map((record) => enrichRecord(record));

  //         setOriginalData(enriched);
  //         if (enriched.length > 0) {
  //           setDefCashInfo(enriched[0]);
  //           setCurrentIndex(0);
  //         }
  //         setIsDirty(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching cash accounts:", error);
  //     }
  //   };

  useEffect(() => {
    const init = async () => {
      // 1. Get the data directly from the fetch call
      const staticData = await fetchStaticOptions();

      // 2. Pass that fresh data into the cash fetcher
      if (staticData) {
        await fetchDefCash(staticData);
      } else {
        // Fallback if options failed
        await fetchDefCash();
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleFieldChange = (
    field,
    value,
    nameField = null,
    nameValue = null,
  ) => {
    const activeRecord = defCashInfoRef.current;
    const activeKey = getCashRowKey(activeRecord, currentIndex);

    const updates = { [field]: value };
    if (nameField) updates[nameField] = nameValue;

    const updatedActiveRecord = { ...activeRecord, ...updates };
    defCashInfoRef.current = updatedActiveRecord;
    setDefCashInfo(updatedActiveRecord);

    setOriginalData((prev) =>
      prev.map((item, index) => {
        const itemKey = getCashRowKey(item, index);
        return itemKey === activeKey ? { ...item, ...updates } : item;
      }),
    );

    setIsDirty(true);
  };

  const handleTableFieldChange = (
    field,
    value,
    uniqueKey,
    nameField,
    nameValue,
    rowIndex,
  ) => {
    const updates = { [field]: value };
    if (nameField) updates[nameField] = nameValue;
    const baseRecord = originalData[rowIndex] || defCashInfoRef.current;
    const updatedTargetRecord = { ...baseRecord, ...updates };

    if (rowIndex !== undefined && rowIndex !== null) {
      setCurrentIndex(rowIndex);
      defCashInfoRef.current = updatedTargetRecord;
      setDefCashInfo(updatedTargetRecord);
    }

    setOriginalData((prev) =>
      prev.map((item, index) => {
        const itemKey = getCashRowKey(item, index);
        return itemKey === uniqueKey ? { ...item, ...updates } : item;
      }),
    );

    const activeKey = getCashRowKey(defCashInfoRef.current, currentIndex);

    if (activeKey === uniqueKey) {
      const updated = { ...defCashInfoRef.current, ...updates };
      defCashInfoRef.current = updated;
      setDefCashInfo(updated);
    }

    setIsDirty(true);
  };

  const handleDelete = async () => {
    // Only attempt delete if there is a valid primary key
    // if (!defCashInfo.cashAcctsKey || defCashInfo.cashAcctsKey === 0) {
    //   toast.error("No record selected to delete.");
    //   return;
    // }

    if (window.confirm("Are you sure you want to delete this cash account?")) {
      try {
        const response = await api.delete(
          `${backendUrl}/api/dflt-cash-accts/${defCashInfo.cashAcctsKey}`,
        );

        if (response.status === 200 || response.status === 204) {
          toast.success("Record deleted successfully.");

          // Refresh the data list
          const updatedResponse = await api.get(
            `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
          );

          if (
            updatedResponse.data?.data &&
            updatedResponse.data.data.length > 0
          ) {
            const rawData = updatedResponse.data.data;
            const enriched = rawData.map((record) => enrichRecord(record));

            setOriginalData(enriched);

            // Navigate to the previous available record
            const nextIndex = Math.max(0, currentIndex - 1);
            setCurrentIndex(nextIndex);
            setDefCashInfo(enriched[nextIndex]);
          } else {
            // No records left
            setOriginalData([]);
            setDefCashInfo(initialDefCashState);
            setCurrentIndex(0);
          }
          setIsDirty(false);
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        toast.error("Failed to delete the record. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    const activeData = isFormView
      ? defCashInfoRef.current
      : originalData[currentIndex] || defCashInfoRef.current;
    const preserveKey = getCashRowKey(activeData, currentIndex);
    const preserveIndex = currentIndex;

    if (!activeData.cashAcctsDesc) {
      return toast.error("Cash Account Desc is required");
    }

    if (!activeData.acctId) return toast.error("Account is required");

    if (!activeData.orgId) return toast.error("Organization is required");

    if (!activeData.bankAcctAbbrv) return toast.error("Bank Abbrev is required");

    try {
      const payload = {
        cashAcctsKey: activeData.cashAcctsKey || 0,
        acctId: activeData.acctId,
        orgId: activeData.orgId || "",
        ref1Id: activeData.ref1Id || "",
        ref2Id: activeData.ref2Id || "",
        bankAcctAbbrv: activeData.bankAcctAbbrv || "",
        cashAcctsDesc: activeData.cashAcctsDesc || "",
        modifiedBy: user.name || "System",
        companyId: companyId,
        timeStamp: new Date().toISOString(),
      };

      const isUpdate = payload.cashAcctsKey > 0;
      const url = `${backendUrl}/api/dflt-cash-accts`;

      const response = isUpdate
        ? await api.put(`${url}/${payload.cashAcctsKey}`, payload)
        : await api.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Cash Account saved successfully!");
        setIsDirty(false);
        const savedRecord = response.data?.data || response.data || {};
        const savedKey =
          savedRecord.cashAcctsKey ||
          savedRecord.cashAcctsKey === 0
            ? savedRecord.cashAcctsKey
            : payload.cashAcctsKey || preserveKey;
        fetchDefCash(null, { preserveKey: savedKey, preserveIndex });
      }
    } catch (error) {
      toast.error("Error saving information.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      const newRecord = {
        ...initialDefCashState,
        tempId: Date.now(),
      };
      setOriginalData((prev) => [...prev, newRecord]);
      setDefCashInfo(newRecord);
      defCashInfoRef.current = newRecord;
      setCurrentIndex(originalData.length);
      setIsDirty(true);
    },
    onSave: handleSave,
    onDelete: handleDelete,
    onClear: () => {
      const activeRecord = originalData[currentIndex] || initialDefCashState;
      setDefCashInfo(activeRecord);
      defCashInfoRef.current = activeRecord;
      setIsDirty(false);
    },
    onToggleView: () => {
      setIsFormView((prev) => !prev);
    },
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    if (!originalData.length) return;

    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setDefCashInfo(originalData[newIndex]);
    defCashInfoRef.current = originalData[newIndex];
    setIsDirty(false);
  };

  const isAllSelected =
    originalData.length > 0 && selectedRows.size === originalData.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(
        new Set(originalData.map((item, idx) => item.cashAcctsKey || item.tempId || idx)),
      );
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-300 mt-10">
      <MainContainer title="Manage Cash Accounts" handleClose={onClose}>
        <Toolbar
          isDirty={isDirty}
          loading={loading}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          actions={toolbarActions}
          isFormView={isFormView}
          jumpToCode={() => {}}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />
        {isFormView ? (
        <div className="mt-2">
          <FormSection>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label={renderRequiredLabel("Cash Account Desc")}
                value={defCashInfo.cashAcctsDesc || ""}
                onChange={(e) =>
                  handleFieldChange("cashAcctsDesc", e.target.value)
                }
              />
              <div />

              <FormSearchSelect
                key="cash-account-acct"
                label={renderRequiredLabel("Account")}
                options={acctOpt}
                value={defCashInfo.acctId}
                searchTerm={selectSearchTerms.acctId}
                setSearchTerm={setSelectSearchTerm("acctId")}
                displayKey="acctId"
                onSelect={(val) =>
                  // Use val.acctId if that is what the API returns
                  handleFieldChange(
                    "acctId",
                    val.acctId || val.id,
                    "acctName",
                    val.acctName || val.name,
                  )
                }
              />
              <FormInput
                label="Account Name"
                disabled
                value={defCashInfo.acctName || ""}
              />

              <FormSearchSelect
                key="cash-account-org"
                label={renderRequiredLabel("Organization")}
                options={orgOpt}
                value={defCashInfo.orgId}
                searchTerm={selectSearchTerms.orgId}
                setSearchTerm={setSelectSearchTerm("orgId")}
                displayKey="orgId"
                onSelect={(val) =>
                  handleFieldChange(
                    "orgId",
                    val.orgId || val.id,
                    "orgName",
                    val.orgName || val.name,
                  )
                }
              />
              <FormInput
                label="Org Name"
                disabled
                value={defCashInfo.orgName || ""}
              />

              <FormSearchSelect
                key="cash-account-bank"
                label={renderRequiredLabel("Bank Abbrev")}
                options={bankAbbrv}
                value={defCashInfo.bankAcctAbbrv}
                searchTerm={selectSearchTerms.bankAcctAbbrv}
                setSearchTerm={setSelectSearchTerm("bankAcctAbbrv")}
                displayKey="id"
                onSelect={(val) =>
                  handleFieldChange(
                    "bankAcctAbbrv",
                    val.id,
                    "bankAcctName",
                    val.name,
                  )
                }
              />
              <FormInput
                label="Bank Abbrev Name"
                disabled
                value={defCashInfo.bankAcctName || ""}
              />

              <FormSearchSelect
                key="cash-account-ref1"
                label="Ref No 1"
                options={ref1Opt}
                value={defCashInfo.ref1Id}
                searchTerm={selectSearchTerms.ref1Id}
                setSearchTerm={setSelectSearchTerm("ref1Id")}
                displayKey="refStrucId"
                onSelect={(val) =>
                  handleFieldChange(
                    "ref1Id",
                    val.refStrucId,
                    "ref1Name",
                    val.refStrucName,
                  )
                }
              />
              <FormInput
                label="Ref No 1 Name"
                disabled
                value={defCashInfo.ref1Name || ""}
              />

              <FormSearchSelect
                key="cash-account-ref2"
                label="Ref No 2"
                options={ref2Opt}
                value={defCashInfo.ref2Id}
                searchTerm={selectSearchTerms.ref2Id}
                setSearchTerm={setSelectSearchTerm("ref2Id")}
                displayKey="refStrucId"
                onSelect={(val) =>
                  handleFieldChange(
                    "ref2Id",
                    val.refStrucId,
                    "ref2Name",
                    val.refStrucName,
                  )
                }
              />
              <FormInput
                label="Ref No 2 Name"
                disabled
                value={defCashInfo.ref2Name || ""}
              />
            </div>
          </FormSection>
        </div>
        ) : (
          <div className="overflow-x-auto max-h-[35vh]">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {columns.map((col) => (
                    <th key={col} className="th-thead">
                      <div className="flex items-center justify-center">
                        <span>{renderColumnLabel(col)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tbody">
                {originalData.map((item, index) => {
                  const uniqueKey = item.cashAcctsKey || item.tempId || index;
                  const isRowChecked = selectedRows.has(uniqueKey);

                  return (
                    <tr
                      key={uniqueKey}
                      className={`${
                        isRowChecked ? "bg-blue-50" : ""
                      } hover:bg-gray-50 transition-colors cursor-pointer`}
                    >
                      <td className="text-center tbody-td w-10">
                        <input
                          type="checkbox"
                          checked={isRowChecked}
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          onChange={() => {
                            const newSet = new Set(selectedRows);
                            if (newSet.has(uniqueKey)) {
                              newSet.delete(uniqueKey);
                            } else {
                              newSet.add(uniqueKey);
                              setDefCashInfo(item);
                              defCashInfoRef.current = item;
                              setCurrentIndex(index);
                            }
                            setSelectedRows(newSet);
                          }}
                        />
                      </td>

                      {columns.map((columnKey) => {
                        const isAccount = columnKey === "acctId";
                        const isOrg = columnKey === "orgId";
                        const isBank = columnKey === "bankAcctAbbrv";
                        const isRef1 = columnKey === "ref1Id";
                        const isRef2 = columnKey === "ref2Id";
                        const isDescription = columnKey === "cashAcctsDesc";
                        const isAutoPopulatedName = [
                          "acctName",
                          "orgName",
                          "bankAcctName",
                          "ref1Name",
                          "ref2Name",
                        ].includes(columnKey);
                        const isDisabled =
                          isAutoPopulatedName ||
                          (isDescription && item.cashAcctsKey !== 0);

                        return (
                          <td key={columnKey} className="tbody-td">
                            {isAccount || isOrg || isBank || isRef1 || isRef2 ? (
                              <TableSearchSelect
                                key={`${uniqueKey}-${columnKey}`}
                                id={`${uniqueKey}-${columnKey}`}
                                value={item[columnKey]}
                                options={
                                  isAccount
                                    ? acctOpt
                                    : isOrg
                                      ? orgOpt
                                      : isBank
                                        ? bankAbbrv
                                        : isRef1
                                          ? ref1Opt
                                          : ref2Opt
                                }
                                displayKey={
                                  isAccount
                                    ? "acctId"
                                    : isOrg
                                      ? "orgId"
                                      : isBank
                                        ? "id"
                                        : "refStrucId"
                                }
                                onSelect={(val) => {
                                  const nameKey = isAccount
                                    ? "acctName"
                                    : isOrg
                                      ? "orgName"
                                      : isBank
                                        ? "bankAcctName"
                                        : isRef1
                                          ? "ref1Name"
                                          : "ref2Name";
                                  const displayVal = isAccount
                                    ? val.acctId
                                    : isOrg
                                      ? val.orgId
                                      : isBank
                                        ? val.id
                                        : val.refStrucId;
                                  const nameVal = isAccount
                                    ? val.acctName
                                    : isOrg
                                      ? val.orgName
                                      : isBank
                                        ? val.name
                                        : val.refStrucName;

                                  handleTableFieldChange(
                                    columnKey,
                                    displayVal,
                                    uniqueKey,
                                    nameKey,
                                    nameVal,
                                    index,
                                  );
                                }}
                              />
                            ) : (
                              <input
                                className={`td-input min-w-[150px] ${
                                  isRowChecked ? "bg-blue-50" : "bg-transparent"
                                } ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
                                value={item[columnKey] || ""}
                                disabled={isDisabled}
                                onChange={(e) =>
                                  handleTableFieldChange(
                                    columnKey,
                                    e.target.value,
                                    uniqueKey,
                                    null,
                                    null,
                                    index,
                                  )
                                }
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default ManageCashAccounts;
