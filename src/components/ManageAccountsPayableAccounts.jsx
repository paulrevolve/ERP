// import React, { useState, useEffect } from "react";
// import {
//   X,
//   History,
//   Award,
//   ShieldCheck,
//   GraduationCap,
//   Lock,
//   Settings2,
//   User,
//   Layers,
// } from "lucide-react";
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

// const ManageAccountsPayableAccounts = ({ formData, onClose, loading }) => {
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

//   const initialDefApState = {
//     apAcctsKey: 0, // Changed from cashAcctsKey
//     acctId: "",
//     acctName: "",
//     orgId: "",
//     orgName: "",
//     ref1Id: "", // Matches POST payload
//     ref1Name: "",
//     ref2Id: "", // Matches POST payload
//     ref2Name: "",
//     apAcctsDesc: "", // Changed from cashAcctsDesc
//     companyId: companyId,
//     modifiedBy: user.name || "Admin",
//     isNew: true,
//   };

//   const COLUMN_LABELS = {
//     apAcctsDesc: "A/P Account Description", // Changed from cashAcctsDesc
//     acctId: "Account",
//     acctName: "Account Name",
//     orgId: "Organization",
//     orgName: "Organization Name",
//     ref1Id: "Ref No 1", // Matches POST payload
//     ref1Name: "Reference 1 Name", // Matches POST payload
//     ref2Id: "Ref No 2", // Matches POST payload
//     ref2Name: "Reference 2 Name", // Matches POST payload
//   };

//   const ACCOUNT_COLUMNS = [
//   // --- Account Identity ---
//   { id: "acctId", label: "Account", type: "text", allowReplace: false },
//   { id: "acctName", label: "Account Name", type: "text", allowReplace: true },
//   { id: "apAcctsDesc", label: "A/P Account Description", type: "text", allowReplace: true },

//   // --- Organization Context ---
//   { id: "orgId", label: "Organization", type: "text", allowReplace: false },
//   { id: "orgName", label: "Organization Name", type: "text", allowReplace: true },

//   // --- Reference 1 (Search Select) ---
//   {
//     id: "ref1Id",
//     label: "Ref No 1",
//     type: "select",
//     allowReplace: true,
//     options: ref1Opt.map((r) => ({
//       value: r.refStrucId,
//       label: `${r.refStrucId} - ${r.refStrucName}`,
//     })),
//   },
//   { id: "ref1Name", label: "Reference 1 Name", type: "text", allowReplace: true },

//   // --- Reference 2 (Search Select) ---
//   {
//     id: "ref2Id",
//     label: "Ref No 2",
//     type: "select",
//     allowReplace: true,
//     options: ref2Opt.map((r) => ({
//       value: r.refStrucId,
//       label: `${r.refStrucId} - ${r.refStrucName}`,
//     })),
//   },
//   { id: "ref2Name", label: "Reference 2 Name", type: "text", allowReplace: true },
// ];
//   const columns = Object.keys(COLUMN_LABELS);

//   const [defApInfo, setDefApInfo] = useState(initialDefApState);

//   const enrichRecord = (record) => {
//     return {
//       ...record,
//       acctName: acctOpt.find((a) => a.acctId === record.acctId)?.acctName || "",
//       orgName: orgOpt.find((o) => o.orgId === record.orgId)?.orgName || "",
//       // Look up in the ref options using refStrucId
//       ref1Name:
//         ref1Opt.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
//       ref2Name:
//         ref2Opt.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
//       isNew: false,
//     };
//   };

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

//   // 1. Fetch All Static Options on Mount

//   const fetchDefAp = async () => {
//     try {
//       const response = await api.get(
//         `${backendUrl}/api/default-ap-accounts?page=1&pageSize=50`,
//       );
//       if (response.data?.data) {
//         const rawData = response.data.data;
//         // Enrich all records so navigation is smooth
//         const enriched = rawData.map((record) => enrichRecord(record));

//         setOriginalData(enriched);
//         if (enriched.length > 0) {
//           setDefApInfo(enriched[0]);
//           setCurrentIndex(0);
//         }
//         setIsDirty(false);
//       }
//     } catch (error) {
//       console.error("Error fetching cash accounts:", error);
//     }
//   };

//   useEffect(() => {
//     fetchStaticOptions();
//     fetchDefAp();
//   }, []);

//   const handleFindReplace = (config, isReplaceMode) => {
//     const {
//       column,
//       findYear, // We'll use this as the generic 'Find' value for text
//       replaceValue, // The generic 'Replace' value
//     } = config;

//     if (!column) {
//       return toast.warn("Please select a column first.");
//     }

//     // --- FIND (SEARCH/FILTER) LOGIC ---
//     if (!isReplaceMode) {
//       if (!findYear) {
//         return toast.warn("Please enter a value to find.");
//       }

//       const search = String(findYear).toLowerCase();

//       const filteredResults = originalData.filter((item) => {
//         const currentValue = String(item[column] || "").toLowerCase();
//         // Since this component doesn't have specific Date/Period logic like the previous one,
//         // we use a standard 'includes' search.
//         return currentValue.includes(search);
//       });

//       if (filteredResults.length > 0) {
//         setOriginalData(filteredResults);
//         // Reset navigation to the first found result
//         setDefApInfo(filteredResults[0]);
//         setCurrentIndex(0);
//         setIsDirty(true); // Mark dirty because the view is now filtered/modified
//         toast.info(`Found ${filteredResults.length} matches.`);
//       } else {
//         toast.error(`No matches found for "${findYear}".`);
//       }
//       return;
//     }

//     // --- REPLACE LOGIC ---
//     // 1. Validation: Prevent replacing auto-populated Name fields manually via bulk tool
//     const readOnlyColumns = ["acctName", "orgName", "ref1Name", "ref2Name"];
//     if (readOnlyColumns.includes(column)) {
//       return toast.error("Cannot bulk replace auto-populated name fields.");
//     }

//     // 2. Confirmation for bulk action
//     if (
//       !window.confirm(
//         `Are you sure you want to replace values in "${COLUMN_LABELS[column]}" for all matching records?`,
//       )
//     ) {
//       return;
//     }

//     let changeCount = 0;
//     const updatedData = originalData.map((item) => {
//       const currentValue = String(item[column] || "");
//       const searchTarget = String(findYear || "");

//       // If Find is empty, replace ALL. Otherwise, replace only if it contains the search string.
//       if (
//         searchTarget === "" ||
//         currentValue.toLowerCase().includes(searchTarget.toLowerCase())
//       ) {
//         // Skip if value is already the same
//         if (item[column] === replaceValue) return item;

//         // Special Rule: If replacing the Description (apAcctsDesc), only allow if it's a new record
//         // (Matching your UI logic: isDescription && item.apAcctsKey !== 0 is disabled)
//         if (column === "apAcctsDesc" && item.apAcctsKey !== 0) {
//           return item;
//         }

//         changeCount++;
//         return { ...item, [column]: replaceValue };
//       }
//       return item;
//     });

//     if (changeCount > 0) {
//       setOriginalData(updatedData);
//       // Update the active form record if it was part of the change
//       const activeKey =
//         defApInfo.apAcctsKey || defApInfo.tempId || currentIndex;
//       const updatedActiveRecord = updatedData.find((item, idx) => {
//         const key = item.apAcctsKey || item.tempId || idx;
//         return key === activeKey;
//       });

//       if (updatedActiveRecord) setDefApInfo(updatedActiveRecord);

//       setIsDirty(true);
//       toast.success(`Successfully updated ${changeCount} records.`);
//     } else {
//       toast.info("No matching records were found to update.");
//     }
//   };

//   //   const handleFieldChange = (
//   //     field,
//   //     value,
//   //     nameField = null,
//   //     nameValue = null,
//   //   ) => {
//   //     setDefApInfo((prev) => {
//   //       const updated = { ...prev, [field]: value };
//   //       if (nameField) updated[nameField] = nameValue;
//   //       return updated;
//   //     });
//   //     setIsDirty(true);
//   //   };

//   const handleCopy = () => {
//     // Determine which record to copy based on current view
//     const dataToCopy = isFormView ? defApInfo : originalData[currentIndex];

//     if (dataToCopy) {
//       // We remove the primary key (apAcctsKey) and rowversion so it's treated as a new record on paste
//       const { apAcctsKey, rowversion, ...rest } = dataToCopy;
//       setClipboard(rest);
//       toast.success("Row data copied to internal clipboard.");
//     }
//   };

//   const handlePaste = () => {
//     if (!clipboard) {
//       return toast.error("Clipboard is empty.");
//     }

//     // 1. Create a brand new record based on clipboard data
//     const newRecord = {
//       ...initialDefApState, // Start with defaults (companyId, modifiedBy, etc.)
//       ...clipboard, // Overwrite with copied data
//       apAcctsKey: 0, // Ensure it's treated as a new record for the DB
//       tempId: Date.now(), // Unique ID for the table key
//       isNew: true,
//     };

//     // 2. Append the new record to the list
//     setOriginalData((prev) => [...prev, newRecord]);

//     // 3. Navigate to this new record immediately
//     const newIndex = originalData.length; // The index it will occupy
//     setCurrentIndex(newIndex);
//     setDefApInfo(newRecord);

//     // 4. Mark as dirty so the user knows they need to save
//     setIsDirty(true);
//     toast.success("Data pasted as a new row.");
//   };

//   const handleFieldChange = (key, value, uniqueKey) => {
//     setOriginalData((prev) =>
//       prev.map((item, index) => {
//         const itemKey = item.apAcctsKey || item.tempId || index;
//         if (itemKey === uniqueKey) {
//           return { ...item, [key]: value };
//         }
//         return item;
//       }),
//     );
//     setIsDirty(true);
//   };

//   //   const handleSave = async () => {
//   //     // Ensure we have the necessary data
//   //     if (!defApInfo.apAcctsDesc) {
//   //       return toast.error("Account Description is required");
//   //     }

//   //     try {
//   //       // 1. Construct the payload exactly as the API expects
//   //       const payload = {
//   //         apAcctsKey: defApInfo.apAcctsKey || 0,
//   //         acctId: defApInfo.acctId,
//   //         orgId: defApInfo.orgId,
//   //         ref1Id: defApInfo.ref1Id, // Sent as ref1Id
//   //         ref2Id: defApInfo.ref2Id, // Sent as ref2Id
//   //         seqNo: 0,
//   //         modifiedBy: user.name || "System",
//   //         timeStamp: new Date().toISOString(),
//   //         companyId: companyId,
//   //         apAcctsDesc: defApInfo.apAcctsDesc, // Ensure this matches state
//   //         rowversion: defApInfo.rowversion || 0,
//   //       };

//   //       // 2. Determine if it's an Update or Create
//   //       // The API uses apAcctsKey as the primary key
//   //       const isUpdate = payload.apAcctsKey > 0;
//   //       const url = `${backendUrl}/api/default-ap-accounts`;

//   //       const response = isUpdate
//   //         ? await api.put(`${url}/${payload.apAcctsKey}`, payload)
//   //         : await api.post(url, payload);

//   //       if (response.status === 200 || response.status === 201) {
//   //         toast.success(
//   //           `Accounts Payable Account ${isUpdate ? "updated" : "saved"} successfully!`,
//   //         );
//   //         setIsDirty(false);
//   //         fetchDefAp(); // Refresh the list/data
//   //       }
//   //     } catch (error) {
//   //       console.error("Save Error:", error);
//   //       const errorMsg =
//   //         error.response?.data?.message || "Error saving information.";
//   //       toast.error(errorMsg);
//   //     }
//   //   };

//   const handleSave = async () => {
//     // 1. Determine which data source to use
//     // If in Table View, get the most recent data from the array based on currentIndex
//     const activeData = isFormView ? defApInfo : originalData[currentIndex];

//     if (!activeData.apAcctsDesc) {
//       return toast.error("Account Description is required");
//     }

//     try {
//       // 2. Construct payload using activeData instead of defApInfo
//       const payload = {
//         apAcctsKey: activeData.apAcctsKey || 0,
//         acctId: activeData.acctId,
//         orgId: activeData.orgId,
//         ref1Id: activeData.ref1Id,
//         ref2Id: activeData.ref2Id,
//         seqNo: 0,
//         modifiedBy: user.name || "System",
//         timeStamp: new Date().toISOString(),
//         companyId: companyId,
//         apAcctsDesc: activeData.apAcctsDesc,
//         rowversion: activeData.rowversion || 0,
//       };

//       const isUpdate = payload.apAcctsKey > 0;
//       const url = `${backendUrl}/api/default-ap-accounts`;

//       const response = isUpdate
//         ? await api.put(`${url}/${payload.apAcctsKey}`, payload)
//         : await api.post(url, payload);

//       if (response.status === 200 || response.status === 201) {
//         toast.success(
//           `Accounts Payable Account ${isUpdate ? "updated" : "saved"} successfully!`,
//         );
//         setIsDirty(false);
//         fetchDefAp(); // This will refresh both the array and the form state
//       }
//     } catch (error) {
//       console.error("Save Error:", error);
//       toast.error(error.response?.data?.message || "Error saving information.");
//     }
//   };

//   const handleDelete = async () => {
//     // Only attempt delete if there is a valid primary key
//     // if (!defCashInfo.cashAcctsKey || defCashInfo.cashAcctsKey === 0) {
//     //   toast.error("No record selected to delete.");
//     //   return;
//     // }

//     if (window.confirm("Are you sure you want to delete?")) {
//       try {
//         const response = await api.delete(
//           `${backendUrl}/api/default-ap-accounts/${defApInfo.apAcctsKey}`,
//         );

//         if (response.status === 200 || response.status === 204) {
//           toast.success("Record deleted successfully.");

//           // Refresh the data list
//           const updatedResponse = await api.get(
//             `${backendUrl}/api/default-ap-accounts?page=1&pageSize=50`,
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
//             setDefApInfo(enriched[nextIndex]);
//           } else {
//             // No records left
//             setOriginalData([]);
//             setDefApInfo(initialDefApState);
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

//   const jumpToCode = (code) => {
//     if (!code) return;

//     console.log(code);

//     // 1. Search in originalData (the array), NOT initialDefApState (the object)
//     const found = originalData.find(
//       (item) =>
//         String(item.apAcctsDesc).toLowerCase() === String(code).toLowerCase(),
//     );

//     console.log(found);

//     if (found) {
//       // 2. Update the form data with the found record
//       setDefApInfo(found);
//       setIsFormView(true);

//       // 3. Update the navigation index so 'Next/Prev' buttons work correctly
//       const newIdx = originalData.indexOf(found);
//       setCurrentIndex(newIdx);

//       // Reset dirty state since we just loaded an existing record
//       setIsDirty(false);
//     } else {
//       toast.error(`"${code}" not found.`);
//     }
//   };

//   console.log(defApInfo);

//   const toolbarActions = {
//     // onAdd: () => {
//     //   setDefApInfo(initialDefApState);
//     //   setIsDirty(true);
//     // },
//     onAdd: () => {
//       // 1. Create the new record object
//       const newRecord = {
//         ...initialDefApState,
//         tempId: Date.now(), // Give it a temporary unique ID for the table key
//       };

//       // 2. Update the array so a new row appears in the table
//       setOriginalData((prev) => [...prev, newRecord]);

//       // 3. Update the form state for Form View
//       setDefApInfo(newRecord);

//       // 4. Set the index to the very last item (the one we just added)
//       setCurrentIndex(originalData.length);

//       setIsDirty(true);
//     },
//     onCopy: handleCopy,
//     onPaste: handlePaste,
//     onSave: handleSave,
//     // onDelete: async () => {
//     //   if (window.confirm("Delete this record?") && defApInfo.apAcctsKey) {
//     //     await api.delete(
//     //       `${backendUrl}/api/default-ap-accounts/${defApInfo.apAcctsKey}`,
//     //     );
//     //     setDefApInfo(initialDefApState);
//     //     toast.success("Deleted.");
//     //   }
//     // },
//     onDelete: handleDelete,
//     onClear: () => {
//       fetchDefAp();
//       setIsDirty(false);
//     },
//     onToggleView: () => {
//       // If moving from Table to Form and no record is currently active
//       if (!isFormView && !defApInfo && originalData.length > 0) {
//         const firstRecord = originalData[0];

//         // 1. Set the active record for the Form View
//         setDefApInfo(firstRecord);

//         // 2. Update the selection index to the first row
//         setCurrentIndex(0);

//         // 3. If you are tracking "Selected IDs" in a separate state (e.g., selectedIds):
//         // setSelectedIds((prevSet) => {
//         //   const newSet = new Set(prevSet);
//         //   newSet.add(firstRecord.apAcctsKey);
//         //   return newSet;
//         // });
//       }

//       // Flip the view state
//       setIsFormView(!isFormView);
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
//     setDefApInfo(originalData[newIndex]);
//     setIsDirty(false);
//   };

//   // Check if all rows in the current originalData are selected
//   const isAllSelected =
//     originalData.length > 0 && selectedRows.size === originalData.length;

//   // Logic to toggle all rows at once
//   const toggleSelectAll = () => {
//     if (isAllSelected) {
//       setSelectedRows(new Set());
//     } else {
//       const allKeys = originalData.map(
//         (item, idx) => item.apAcctsKey || item.tempId || idx,
//       );
//       setSelectedRows(new Set(allKeys));
//     }
//   };

//   return (
//     <div className="p-4 space-y-4 animate-in fade-in duration-300 mt-10">
//       <MainContainer
//         title="Manage Accounts Payable Settings"
//         handleClose={onClose}
//       >
//         <Toolbar
//           isDirty={isDirty}
//           loading={loading}
//           setSearchValue={setSearchValue}
//           searchValue={searchValue}
//           actions={toolbarActions}
//           isFormView={isFormView}
//           jumpToCode={jumpToCode}
//           currentIndex={currentIndex}
//           totalRecords={originalData.length}
//           handleNavigate={handleNavigate}
//           handleFindReplace={handleFindReplace}
//           columns={ACCOUNT_COLUMNS}
//         />
//         {isFormView ? (
//           <div className="mt-2">
//             <FormSection>
//               <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
//                 <FormInput
//                   label="A/P Account Description"
//                   required
//                   value={defApInfo.apAcctsDesc || ""}
//                   onChange={(e) =>
//                     handleFieldChange("apAcctsDesc", e.target.value)
//                   }
//                 />
//                 <div />

//                 <FormSearchSelect
//                   label="Account"
//                   options={acctOpt}
//                   value={defApInfo.acctId}
//                   displayKey="acctId"
//                   onSelect={(val) =>
//                     // Use val.acctId if that is what the API returns
//                     handleFieldChange(
//                       "acctId",
//                       val.acctId || val.id,
//                       "acctName",
//                       val.acctName || val.name,
//                     )
//                   }
//                 />
//                 <FormInput
//                   label="Account Name"
//                   disabled
//                   value={defApInfo.acctName || ""}
//                 />

//                 <FormSearchSelect
//                   label="Organization"
//                   options={orgOpt}
//                   value={defApInfo.orgId}
//                   displayKey="orgId"
//                   onSelect={(val) =>
//                     handleFieldChange(
//                       "orgId",
//                       val.orgId || val.id,
//                       "orgName",
//                       val.orgName || val.name,
//                     )
//                   }
//                 />
//                 <FormInput
//                   label="Org Name"
//                   disabled
//                   value={defApInfo.orgName || ""}
//                 />
//                 {/* Ref No 1 */}
//                 <FormSearchSelect
//                   label="Ref No 1"
//                   options={ref1Opt}
//                   value={defApInfo.ref1Id}
//                   displayKey="refStrucId" // Matches your JSON response
//                   onSelect={(val) =>
//                     handleFieldChange(
//                       "ref1Id",
//                       val.refStrucId,
//                       "ref1Name",
//                       val.refStrucName,
//                     )
//                   }
//                 />
//                 <FormInput
//                   label="Ref No 1 Name"
//                   disabled
//                   value={defApInfo.ref1Name || ""}
//                 />

//                 {/* Ref No 2 */}
//                 <FormSearchSelect
//                   label="Ref No 2"
//                   options={ref2Opt} // Using same list
//                   value={defApInfo.ref2Id}
//                   displayKey="refStrucId"
//                   onSelect={(val) =>
//                     handleFieldChange(
//                       "ref2Id",
//                       val.refStrucId,
//                       "ref2Name",
//                       val.refStrucName,
//                     )
//                   }
//                 />
//                 <FormInput
//                   label="Ref No 2 Name"
//                   disabled
//                   value={defApInfo.ref2Name || ""}
//                 />
//               </div>
//             </FormSection>
//           </div>
//         ) : (
//           <div className={`overflow-x-auto max-h-[35vh]`}>
//             <table className="min-w-full text-sm border border-gray-300 rounded">
//               <thead className="bg-gray-200 sticky top-0 z-10 ">
//                 <tr>
//                   {/* {canEdit("manageAccount") && ( */}
//                   <th className="th-thead w-10">
//                     <input
//                       type="checkbox"
//                       checked={isAllSelected}
//                       onChange={toggleSelectAll}
//                     />{" "}
//                   </th>
//                   {columns.map((col) => (
//                     <th className="th-thead">
//                       <div className="flex items-center justify-center">
//                         <span>{COLUMN_LABELS[col]}</span>
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="tbody">
//                 {originalData?.map((item, index) => {
//                   const uniqueKey = item.apAcctsKey || item.tempId || index;
//                   const isRowChecked = selectedRows.has(uniqueKey);

//                   return (
//                     <tr
//                       key={uniqueKey}
//                       className={`${
//                         isRowChecked ? "bg-blue-50" : ""
//                       } hover:bg-gray-50 transition-colors cursor-pointer`}
//                     >
//                       {/* Multi-Select Checkbox */}
//                       <td className="text-center tbody-td w-10">
//                         <input
//                           type="checkbox"
//                           checked={isRowChecked}
//                           className="h-3 w-3 accent-blue-600 cursor-pointer"
//                           onChange={(e) => {
//                             const newSet = new Set(selectedRows);
//                             if (newSet.has(uniqueKey)) {
//                               newSet.delete(uniqueKey);
//                             } else {
//                               newSet.add(uniqueKey);
//                               // Optional: Set as active for the form view
//                               setDefApInfo(item);
//                               setCurrentIndex(index);
//                             }
//                             setSelectedRows(newSet);
//                           }}
//                         />
//                       </td>

//                       {/* Dynamic Data Cells */}
//                       {Object.keys(COLUMN_LABELS).map((columnKey) => {
//                         // Check if this specific column should be a SearchSelect
//                         const isAccount = columnKey === "acctId";
//                         const isOrg = columnKey === "orgId";
//                         const isRef1 = columnKey === "ref1Id";
//                         const isRef2 = columnKey === "ref2Id";

//                         const isDescription = columnKey === "apAcctsDesc";
//                         const isAutoPopulatedName = [
//                           "acctName",
//                           "orgName",
//                           "ref1Name",
//                           "ref2Name",
//                         ].includes(columnKey);
//                         const isDisabled =
//                           isAutoPopulatedName ||
//                           (isDescription && item.apAcctsKey !== 0);

//                         return (
//                           <td key={columnKey} className="tbody-td">
//                             {isAccount || isOrg || isRef1 || isRef2 ? (
//                               <TableSearchSelect
//                                 value={item[columnKey]}
//                                 options={
//                                   isAccount
//                                     ? acctOpt
//                                     : isOrg
//                                       ? orgOpt
//                                       : isRef1
//                                         ? ref1Opt
//                                         : ref2Opt
//                                 }
//                                 displayKey={
//                                   isAccount
//                                     ? "acctId"
//                                     : isOrg
//                                       ? "orgId"
//                                       : "refStrucId"
//                                 }
//                                 onSelect={(val) => {
//                                   const idKey = columnKey;
//                                   // Determine which name field matches the selected ID field
//                                   const nameKey = isAccount
//                                     ? "acctName"
//                                     : isOrg
//                                       ? "orgName"
//                                       : isRef1
//                                         ? "ref1Name"
//                                         : "ref2Name";

//                                   // Determine the display value from the returned object
//                                   const displayVal = isAccount
//                                     ? val.acctId
//                                     : isOrg
//                                       ? val.orgId
//                                       : val.refStrucId;

//                                   const descriptionVal = isAccount
//                                     ? val.acctName
//                                     : isOrg
//                                       ? val.orgName
//                                       : val.refStrucName;

//                                   // 1. Update the ID field (e.g., acctId)
//                                   handleFieldChange(
//                                     idKey,
//                                     displayVal,
//                                     uniqueKey,
//                                   );

//                                   // 2. Update the corresponding Name field (e.g., acctName)
//                                   handleFieldChange(
//                                     nameKey,
//                                     descriptionVal,
//                                     uniqueKey,
//                                   );
//                                 }}
//                               />
//                             ) : (
//                               <input
//                                 // className={`td-input min-w-[150px] ${
//                                 //   isRowChecked ? "bg-blue-50" : "bg-transparent"
//                                 // } ${["acctName", "orgName", "ref1Name", "ref2Name"].includes(columnKey) ? "opacity-70" : ""}`}
//                                 className={`td-input min-w-[150px] ${
//                                   isRowChecked ? "bg-blue-50" : "bg-transparent"
//                                 } ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
//                                 value={item[columnKey] || ""}
//                                 // disabled={[
//                                 //   "acctName",
//                                 //   "orgName",
//                                 //   "ref1Name",
//                                 //   "ref2Name",
//                                 // ].includes(columnKey)}
//                                 disabled={isDisabled}
//                                 onChange={(e) =>
//                                   handleFieldChange(
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

// export default ManageAccountsPayableAccounts;

import React, { useState, useEffect } from "react";
import {
  X,
  History,
  Award,
  ShieldCheck,
  GraduationCap,
  Lock,
  Settings2,
  User,
  Layers,
} from "lucide-react";
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

const ManageAccountsPayableAccounts = ({ formData, onClose, loading }) => {
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

  const initialDefApState = {
    apAcctsKey: 0, // Changed from cashAcctsKey
    acctId: "",
    acctName: "",
    orgId: "",
    orgName: "",
    ref1Id: "", // Matches POST payload
    ref1Name: "",
    ref2Id: "", // Matches POST payload
    ref2Name: "",
    apAcctsDesc: "", // Changed from cashAcctsDesc
    companyId: companyId,
    modifiedBy: user.name || "Admin",
    isNew: true,
  };

  const COLUMN_LABELS = {
    apAcctsDesc: "A/P Account Description", // Changed from cashAcctsDesc
    acctId: "Account",
    acctName: "Account Name",
    orgId: "Organization",
    orgName: "Organization Name",
    ref1Id: "Ref No 1", // Matches POST payload
    ref1Name: "Reference 1 Name", // Matches POST payload
    ref2Id: "Ref No 2", // Matches POST payload
    ref2Name: "Reference 2 Name", // Matches POST payload
  };

  const REQUIRED_FIELDS = new Set(["apAcctsDesc", "acctId", "orgId"]);

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

  const setSelectSearchTerm = (field) => (value) => {
    setSelectSearchTerms((prev) => ({ ...prev, [field]: value }));
  };

  const ACCOUNT_COLUMNS = [
  // --- Account Identity ---
  { id: "acctId", label: "Account", type: "text", allowReplace: false },
  { id: "acctName", label: "Account Name", type: "text", allowReplace: true },
  { id: "apAcctsDesc", label: "A/P Account Description", type: "text", allowReplace: true },

  // --- Organization Context ---
  { id: "orgId", label: "Organization", type: "text", allowReplace: false },
  { id: "orgName", label: "Organization Name", type: "text", allowReplace: true },

  // --- Reference 1 (Search Select) ---
  {
    id: "ref1Id",
    label: "Ref No 1",
    type: "select",
    allowReplace: true,
    options: ref1Opt.map((r) => ({
      value: r.refStrucId,
      label: `${r.refStrucId} - ${r.refStrucName}`,
    })),
  },
  { id: "ref1Name", label: "Reference 1 Name", type: "text", allowReplace: true },

  // --- Reference 2 (Search Select) ---
  {
    id: "ref2Id",
    label: "Ref No 2",
    type: "select",
    allowReplace: true,
    options: ref2Opt.map((r) => ({
      value: r.refStrucId,
      label: `${r.refStrucId} - ${r.refStrucName}`,
    })),
  },
  { id: "ref2Name", label: "Reference 2 Name", type: "text", allowReplace: true },
];
  const columns = Object.keys(COLUMN_LABELS);

  const [defApInfo, setDefApInfo] = useState(initialDefApState);

  const enrichRecord = (record) => {
    return {
      ...record,
      acctName: acctOpt.find((a) => a.acctId === record.acctId)?.acctName || "",
      orgName: orgOpt.find((o) => o.orgId === record.orgId)?.orgName || "",
      // Look up in the ref options using refStrucId
      ref1Name:
        ref1Opt.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
      ref2Name:
        ref2Opt.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
      isNew: false,
    };
  };

  const fetchStaticOptions = async () => {
    try {
      const [projRes, orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
        api.get(`${backendUrl}/Project/GetAllProjects`),
        api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
        api.get(`${backendUrl}/api/RefStruc`),
        api.get(`${backendUrl}/api/RefStruc `),
        api.get(`${backendUrl}/api/Account/GetAllAccounts`), // Adjust based on your actual account list API
      ]);
      //   setProjectOpt(projRes.data || []);
      setOrgOpt(orgRes.data || []);
      setRef1Opt(ref1Res.data || []);
      setRef2Opt(ref2Res.data || []);
      setAcctOpt(acctRes.data || []);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  // 1. Fetch All Static Options on Mount

  const fetchDefAp = async () => {
    try {
      const response = await api.get(
        `${backendUrl}/api/default-ap-accounts?page=1&pageSize=50`,
      );
      if (response.data?.data) {
        const rawData = response.data.data;
        // Enrich all records so navigation is smooth
        const enriched = rawData.map((record) => enrichRecord(record));

        setOriginalData(enriched);
        if (enriched.length > 0) {
          setDefApInfo(enriched[0]);
          setCurrentIndex(0);
        }
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error fetching cash accounts:", error);
    }
  };

  useEffect(() => {
    fetchStaticOptions();
    fetchDefAp();
  }, []);

  const handleFindReplace = (config, isReplaceMode) => {
    const {
      column,
      findYear, // We'll use this as the generic 'Find' value for text
      replaceValue, // The generic 'Replace' value
    } = config;

    if (!column) {
      return toast.warn("Please select a column first.");
    }

    // --- FIND (SEARCH/FILTER) LOGIC ---
    if (!isReplaceMode) {
      if (!findYear) {
        return toast.warn("Please enter a value to find.");
      }

      const search = String(findYear).toLowerCase();

      const filteredResults = originalData.filter((item) => {
        const currentValue = String(item[column] || "").toLowerCase();
        // Since this component doesn't have specific Date/Period logic like the previous one,
        // we use a standard 'includes' search.
        return currentValue.includes(search);
      });

      if (filteredResults.length > 0) {
        setOriginalData(filteredResults);
        // Reset navigation to the first found result
        setDefApInfo(filteredResults[0]);
        setCurrentIndex(0);
        setIsDirty(true); // Mark dirty because the view is now filtered/modified
        toast.info(`Found ${filteredResults.length} matches.`);
      } else {
        toast.error(`No matches found for "${findYear}".`);
      }
      return;
    }

    // --- REPLACE LOGIC ---
    // 1. Validation: Prevent replacing auto-populated Name fields manually via bulk tool
    const readOnlyColumns = ["acctName", "orgName", "ref1Name", "ref2Name"];
    if (readOnlyColumns.includes(column)) {
      return toast.error("Cannot bulk replace auto-populated name fields.");
    }

    // 2. Confirmation for bulk action
    if (
      !window.confirm(
        `Are you sure you want to replace values in "${COLUMN_LABELS[column]}" for all matching records?`,
      )
    ) {
      return;
    }

    let changeCount = 0;
    const updatedData = originalData.map((item) => {
      const currentValue = String(item[column] || "");
      const searchTarget = String(findYear || "");

      // If Find is empty, replace ALL. Otherwise, replace only if it contains the search string.
      if (
        searchTarget === "" ||
        currentValue.toLowerCase().includes(searchTarget.toLowerCase())
      ) {
        // Skip if value is already the same
        if (item[column] === replaceValue) return item;

        // Special Rule: If replacing the Description (apAcctsDesc), only allow if it's a new record
        // (Matching your UI logic: isDescription && item.apAcctsKey !== 0 is disabled)
        if (column === "apAcctsDesc" && item.apAcctsKey !== 0) {
          return item;
        }

        changeCount++;
        return { ...item, [column]: replaceValue };
      }
      return item;
    });

    if (changeCount > 0) {
      setOriginalData(updatedData);
      // Update the active form record if it was part of the change
      const activeKey =
        defApInfo.apAcctsKey || defApInfo.tempId || currentIndex;
      const updatedActiveRecord = updatedData.find((item, idx) => {
        const key = item.apAcctsKey || item.tempId || idx;
        return key === activeKey;
      });

      if (updatedActiveRecord) setDefApInfo(updatedActiveRecord);

      setIsDirty(true);
      toast.success(`Successfully updated ${changeCount} records.`);
    } else {
      toast.info("No matching records were found to update.");
    }
  };

  //   const handleFieldChange = (
  //     field,
  //     value,
  //     nameField = null,
  //     nameValue = null,
  //   ) => {
  //     setDefApInfo((prev) => {
  //       const updated = { ...prev, [field]: value };
  //       if (nameField) updated[nameField] = nameValue;
  //       return updated;
  //     });
  //     setIsDirty(true);
  //   };

  const handleCopy = () => {
    // Determine which record to copy based on current view
    const dataToCopy = isFormView ? defApInfo : originalData[currentIndex];

    if (dataToCopy) {
      // We remove the primary key (apAcctsKey) and rowversion so it's treated as a new record on paste
      const { apAcctsKey, rowversion, ...rest } = dataToCopy;
      setClipboard(rest);
      toast.success("Row data copied to internal clipboard.");
    }
  };

  const handlePaste = () => {
    if (!clipboard) {
      return toast.error("Clipboard is empty.");
    }

    // 1. Create a brand new record based on clipboard data
    const newRecord = {
      ...initialDefApState, // Start with defaults (companyId, modifiedBy, etc.)
      ...clipboard, // Overwrite with copied data
      apAcctsKey: 0, // Ensure it's treated as a new record for the DB
      tempId: Date.now(), // Unique ID for the table key
      isNew: true,
    };

    // 2. Append the new record to the list
    setOriginalData((prev) => [...prev, newRecord]);

    // 3. Navigate to this new record immediately
    const newIndex = originalData.length; // The index it will occupy
    setCurrentIndex(newIndex);
    setDefApInfo(newRecord);

    // 4. Mark as dirty so the user knows they need to save
    setIsDirty(true);
    toast.success("Data pasted as a new row.");
  };

  const handleFieldChange = (key, value, uniqueKeyOrNameField, nameValue) => {
    const updates = { [key]: value };
    const isFormNameUpdate = nameValue !== undefined;

    if (isFormNameUpdate) {
      updates[uniqueKeyOrNameField] = nameValue;
    }

    const activeKey = defApInfo.apAcctsKey || defApInfo.tempId || currentIndex;
    const targetKey = isFormNameUpdate
      ? activeKey
      : uniqueKeyOrNameField !== undefined && uniqueKeyOrNameField !== null
        ? uniqueKeyOrNameField
        : activeKey;

    setDefApInfo((prev) => {
      const prevKey = prev.apAcctsKey || prev.tempId || currentIndex;
      return prevKey === targetKey ? { ...prev, ...updates } : prev;
    });

    setOriginalData((prev) =>
      prev.map((item, index) => {
        const itemKey = item.apAcctsKey || item.tempId || index;
        return itemKey === targetKey ? { ...item, ...updates } : item;
      }),
    );

    setIsDirty(true);
  };

  //   const handleSave = async () => {
  //     // Ensure we have the necessary data
  //     if (!defApInfo.apAcctsDesc) {
  //       return toast.error("Account Description is required");
  //     }

  //     try {
  //       // 1. Construct the payload exactly as the API expects
  //       const payload = {
  //         apAcctsKey: defApInfo.apAcctsKey || 0,
  //         acctId: defApInfo.acctId,
  //         orgId: defApInfo.orgId,
  //         ref1Id: defApInfo.ref1Id, // Sent as ref1Id
  //         ref2Id: defApInfo.ref2Id, // Sent as ref2Id
  //         seqNo: 0,
  //         modifiedBy: user.name || "System",
  //         timeStamp: new Date().toISOString(),
  //         companyId: companyId,
  //         apAcctsDesc: defApInfo.apAcctsDesc, // Ensure this matches state
  //         rowversion: defApInfo.rowversion || 0,
  //       };

  //       // 2. Determine if it's an Update or Create
  //       // The API uses apAcctsKey as the primary key
  //       const isUpdate = payload.apAcctsKey > 0;
  //       const url = `${backendUrl}/api/default-ap-accounts`;

  //       const response = isUpdate
  //         ? await api.put(`${url}/${payload.apAcctsKey}`, payload)
  //         : await api.post(url, payload);

  //       if (response.status === 200 || response.status === 201) {
  //         toast.success(
  //           `Accounts Payable Account ${isUpdate ? "updated" : "saved"} successfully!`,
  //         );
  //         setIsDirty(false);
  //         fetchDefAp(); // Refresh the list/data
  //       }
  //     } catch (error) {
  //       console.error("Save Error:", error);
  //       const errorMsg =
  //         error.response?.data?.message || "Error saving information.";
  //       toast.error(errorMsg);
  //     }
  //   };

  const handleSave = async () => {
    // 1. Determine which data source to use
    // If in Table View, get the most recent data from the array based on currentIndex
    const activeData = isFormView ? defApInfo : originalData[currentIndex];

    if (!activeData.apAcctsDesc) {
      return toast.error("Account Description is required");
    }

    if (!activeData.acctId) {
      return toast.error("Account is required");
    }

    if (!activeData.orgId) {
      return toast.error("Organization is required");
    }

    try {
      // 2. Construct payload using activeData instead of defApInfo
      const payload = {
        apAcctsKey: activeData.apAcctsKey || 0,
        acctId: activeData.acctId,
        orgId: activeData.orgId,
        ref1Id: activeData.ref1Id,
        ref2Id: activeData.ref2Id,
        seqNo: 0,
        modifiedBy: user.name || "System",
        timeStamp: new Date().toISOString(),
        companyId: companyId,
        apAcctsDesc: activeData.apAcctsDesc,
        rowversion: activeData.rowversion || 0,
      };

      const isUpdate = payload.apAcctsKey > 0;
      const url = `${backendUrl}/api/default-ap-accounts`;

      const response = isUpdate
        ? await api.put(`${url}/${payload.apAcctsKey}`, payload)
        : await api.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Accounts Payable Account ${isUpdate ? "updated" : "saved"} successfully!`,
        );
        setIsDirty(false);
        fetchDefAp(); // This will refresh both the array and the form state
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Error saving information.");
    }
  };

  const handleDelete = async () => {
    // Only attempt delete if there is a valid primary key
    // if (!defCashInfo.cashAcctsKey || defCashInfo.cashAcctsKey === 0) {
    //   toast.error("No record selected to delete.");
    //   return;
    // }

    if (window.confirm("Are you sure you want to delete?")) {
      try {
        const response = await api.delete(
          `${backendUrl}/api/default-ap-accounts/${defApInfo.apAcctsKey}`,
        );

        if (response.status === 200 || response.status === 204) {
          toast.success("Record deleted successfully.");

          // Refresh the data list
          const updatedResponse = await api.get(
            `${backendUrl}/api/default-ap-accounts?page=1&pageSize=50`,
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
            setDefApInfo(enriched[nextIndex]);
          } else {
            // No records left
            setOriginalData([]);
            setDefApInfo(initialDefApState);
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

  const jumpToCode = (code) => {
    if (!code) return;

    console.log(code);

    // 1. Search in originalData (the array), NOT initialDefApState (the object)
    const found = originalData.find(
      (item) =>
        String(item.apAcctsDesc).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      // 2. Update the form data with the found record
      setDefApInfo(found);
      setIsFormView(true);

      // 3. Update the navigation index so 'Next/Prev' buttons work correctly
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx);

      // Reset dirty state since we just loaded an existing record
      setIsDirty(false);
    } else {
      toast.error(`"${code}" not found.`);
    }
  };

  console.log(defApInfo);

  const toolbarActions = {
    // onAdd: () => {
    //   setDefApInfo(initialDefApState);
    //   setIsDirty(true);
    // },
    onAdd: () => {
      // 1. Create the new record object
      const newRecord = {
        ...initialDefApState,
        tempId: Date.now(), // Give it a temporary unique ID for the table key
      };

      // 2. Update the array so a new row appears in the table
      setOriginalData((prev) => [...prev, newRecord]);

      // 3. Update the form state for Form View
      setDefApInfo(newRecord);

      // 4. Set the index to the very last item (the one we just added)
      setCurrentIndex(originalData.length);

      setIsDirty(true);
    },
    onCopy: handleCopy,
    onPaste: handlePaste,
    onSave: handleSave,
    // onDelete: async () => {
    //   if (window.confirm("Delete this record?") && defApInfo.apAcctsKey) {
    //     await api.delete(
    //       `${backendUrl}/api/default-ap-accounts/${defApInfo.apAcctsKey}`,
    //     );
    //     setDefApInfo(initialDefApState);
    //     toast.success("Deleted.");
    //   }
    // },
    onDelete: handleDelete,
    onClear: () => {
      fetchDefAp();
      setIsDirty(false);
    },
    onToggleView: () => {
      // If moving from Table to Form and no record is currently active
      if (!isFormView && !defApInfo && originalData.length > 0) {
        const firstRecord = originalData[0];

        // 1. Set the active record for the Form View
        setDefApInfo(firstRecord);

        // 2. Update the selection index to the first row
        setCurrentIndex(0);

        // 3. If you are tracking "Selected IDs" in a separate state (e.g., selectedIds):
        // setSelectedIds((prevSet) => {
        //   const newSet = new Set(prevSet);
        //   newSet.add(firstRecord.apAcctsKey);
        //   return newSet;
        // });
      }

      // Flip the view state
      setIsFormView(!isFormView);
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
    setDefApInfo(originalData[newIndex]);
    setIsDirty(false);
  };

  // Check if all rows in the current originalData are selected
  const isAllSelected =
    originalData.length > 0 && selectedRows.size === originalData.length;

  // Logic to toggle all rows at once
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      const allKeys = originalData.map(
        (item, idx) => item.apAcctsKey || item.tempId || idx,
      );
      setSelectedRows(new Set(allKeys));
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-300 mt-10">
      <MainContainer
        title="Manage Accounts Payable Settings"
        handleClose={onClose}
      >
        <Toolbar
          isDirty={isDirty}
          loading={loading}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          actions={toolbarActions}
          isFormView={isFormView}
          jumpToCode={jumpToCode}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
          handleFindReplace={handleFindReplace}
          columns={ACCOUNT_COLUMNS}
        />
        {isFormView ? (
          <div className="mt-2">
            <FormSection>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
                <FormInput
                  label={renderRequiredLabel("A/P Account Description")}
                  value={defApInfo.apAcctsDesc || ""}
                  onChange={(e) =>
                    handleFieldChange("apAcctsDesc", e.target.value)
                  }
                />
                <div />

                <FormSearchSelect
                  label={renderRequiredLabel("Account")}
                  options={acctOpt}
                  value={defApInfo.acctId}
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
                  value={defApInfo.acctName || ""}
                />

                <FormSearchSelect
                  label={renderRequiredLabel("Organization")}
                  options={orgOpt}
                  value={defApInfo.orgId}
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
                  value={defApInfo.orgName || ""}
                />
                {/* Ref No 1 */}
                <FormSearchSelect
                  label="Ref No 1"
                  options={ref1Opt}
                  value={defApInfo.ref1Id}
                  searchTerm={selectSearchTerms.ref1Id}
                  setSearchTerm={setSelectSearchTerm("ref1Id")}
                  displayKey="refStrucId" // Matches your JSON response
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
                  value={defApInfo.ref1Name || ""}
                />

                {/* Ref No 2 */}
                <FormSearchSelect
                  label="Ref No 2"
                  options={ref2Opt} // Using same list
                  value={defApInfo.ref2Id}
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
                  value={defApInfo.ref2Name || ""}
                />
              </div>
            </FormSection>
          </div>
        ) : (
          <div className={`overflow-x-auto max-h-[35vh]`}>
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />{" "}
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
                {originalData?.map((item, index) => {
                  const uniqueKey = item.apAcctsKey || item.tempId || index;
                  const isRowChecked = selectedRows.has(uniqueKey);

                  return (
                    <tr
                      key={uniqueKey}
                      className={`${
                        isRowChecked ? "bg-blue-50" : ""
                      } hover:bg-gray-50 transition-colors cursor-pointer`}
                    >
                      {/* Multi-Select Checkbox */}
                      <td className="text-center tbody-td w-10">
                        <input
                          type="checkbox"
                          checked={isRowChecked}
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          onChange={(e) => {
                            const newSet = new Set(selectedRows);
                            if (newSet.has(uniqueKey)) {
                              newSet.delete(uniqueKey);
                            } else {
                              newSet.add(uniqueKey);
                              // Optional: Set as active for the form view
                              setDefApInfo(item);
                              setCurrentIndex(index);
                            }
                            setSelectedRows(newSet);
                          }}
                        />
                      </td>

                      {/* Dynamic Data Cells */}
                      {Object.keys(COLUMN_LABELS).map((columnKey) => {
                        // Check if this specific column should be a SearchSelect
                        const isAccount = columnKey === "acctId";
                        const isOrg = columnKey === "orgId";
                        const isRef1 = columnKey === "ref1Id";
                        const isRef2 = columnKey === "ref2Id";

                        const isDescription = columnKey === "apAcctsDesc";
                        const isAutoPopulatedName = [
                          "acctName",
                          "orgName",
                          "ref1Name",
                          "ref2Name",
                        ].includes(columnKey);
                        const isDisabled =
                          isAutoPopulatedName ||
                          (isDescription && item.apAcctsKey !== 0);

                        return (
                          <td key={columnKey} className="tbody-td">
                            {isAccount || isOrg || isRef1 || isRef2 ? (
                              <TableSearchSelect
                                value={item[columnKey]}
                                options={
                                  isAccount
                                    ? acctOpt
                                    : isOrg
                                      ? orgOpt
                                      : isRef1
                                        ? ref1Opt
                                        : ref2Opt
                                }
                                displayKey={
                                  isAccount
                                    ? "acctId"
                                    : isOrg
                                      ? "orgId"
                                      : "refStrucId"
                                }
                                onSelect={(val) => {
                                  const idKey = columnKey;
                                  // Determine which name field matches the selected ID field
                                  const nameKey = isAccount
                                    ? "acctName"
                                    : isOrg
                                      ? "orgName"
                                      : isRef1
                                        ? "ref1Name"
                                        : "ref2Name";

                                  // Determine the display value from the returned object
                                  const displayVal = isAccount
                                    ? val.acctId
                                    : isOrg
                                      ? val.orgId
                                      : val.refStrucId;

                                  const descriptionVal = isAccount
                                    ? val.acctName
                                    : isOrg
                                      ? val.orgName
                                      : val.refStrucName;

                                  // 1. Update the ID field (e.g., acctId)
                                  handleFieldChange(
                                    idKey,
                                    displayVal,
                                    uniqueKey,
                                  );

                                  // 2. Update the corresponding Name field (e.g., acctName)
                                  handleFieldChange(
                                    nameKey,
                                    descriptionVal,
                                    uniqueKey,
                                  );
                                }}
                              />
                            ) : (
                              <input
                                // className={`td-input min-w-[150px] ${
                                //   isRowChecked ? "bg-blue-50" : "bg-transparent"
                                // } ${["acctName", "orgName", "ref1Name", "ref2Name"].includes(columnKey) ? "opacity-70" : ""}`}
                                className={`td-input min-w-[150px] ${
                                  isRowChecked ? "bg-blue-50" : "bg-transparent"
                                } ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
                                value={item[columnKey] || ""}
                                // disabled={[
                                //   "acctName",
                                //   "orgName",
                                //   "ref1Name",
                                //   "ref2Name",
                                // ].includes(columnKey)}
                                disabled={isDisabled}
                                onChange={(e) =>
                                  handleFieldChange(
                                    columnKey,
                                    e.target.value,
                                    uniqueKey,
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

export default ManageAccountsPayableAccounts;


