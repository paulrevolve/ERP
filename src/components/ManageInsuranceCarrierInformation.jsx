// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import api from "../utils/api";
// import { backendUrl } from "./config";
// import { MainContainer, Toolbar } from "../helper/container";
// import { FormInput, FormSection } from "../helper/formSection";

// const ManageInsuranceCarrierInformation = () => {
//   const [vendorEmployee, setVendorEmployee] = useState([]);
//   const [allVendorEmployee, setAllVendorEmployee] = useState([]);

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [selectedEmps, setSelectedEmps] = useState(new Set());
//   const [selectedEmp, setSelectedEmp] = useState(null);

//   const [isFormView, setIsFormView] = useState(true);
//   const [searchValue, setSearchValue] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [loading, setLoading] = useState(false);

//   const [clipboard, setClipboard] = useState([]);
//   const [isDirty, setIsDirty] = useState(false);

//   // const employee = formData.employees?.[0] || {};

//   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

//   const initialInsCarInf = {
//     carrierId: "",
//     carrierName: "",
//     agentName: "",
//     agentTitle: "",
//     addressLine1: "",
//     addressLine2: "",
//     addressLine3: "",
//     city: "",
//     stateCode: "",
//     countryCode: "",
//     postalCode: "",
//     phoneNumber: "",
//     faxNumber: "",
//     companyId: "1",
//     modifiedBy: user.name,
//   };

//   const COLUMN_LABELS = {
//     carrierId: "Carrier ID*",
//     carrierName: "Carrier Name*",
//     agentName: "Agent Name",
//     agentTitle: "Agent Title",
//     phoneNumber: "Phone Number",
//     faxNumber: "Fax Number",
//     addressLine1: "Address Line 1",
//     addressLine2: "Address Line 2",
//     addressLine3: "Address Line 3",
//     city: "City",
//     stateCode: "State",
//     countryCode: "Country",
//     postalCode: "Zip/Postal Code",
//   };

//   const columns = Object.keys(COLUMN_LABELS);

//   const fetchInsuCarrierInfo = async () => {
//     try {
//       const response = await api.get(`${backendUrl}/api/SubcontractorCarrier`);

//       setLoading(true);

//       if (response.data) {
//         const data = response.data;
//         setVendorEmployee(data);
//         setAllVendorEmployee(data);
//         // Handle Selection Logic
//         if (data.length > 0) {
//           // 1. Check if there is a previously selected entry that still exists in the new data
//           const stillExists = data.find(
//             (emp) => emp.carrierId === selectedEmp?.carrierId,
//           );
//           if (stillExists) {
//             // Keep the previous selection
//             setSelectedEmp(stillExists);
//             setSelectedEmps(new Set([stillExists.carrierId]));
//           } else {
//             // 2. Otherwise, select the first entry
//             const firstEmp = data[0];
//             setSelectedEmp(firstEmp);
//             setSelectedEmps(new Set([firstEmp.carrierId]));
//           }
//         } else {
//           // Clear selection if no data returned
//           setSelectedEmp(null);
//           setSelectedEmps(new Set());
//         }
//       }
//     } catch (error) {
//       console.error("Fetch Error", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInsuCarrierInfo();
//   }, []);

//   const handleInputChange = (field, value, rowId) => {
//     console.log(field, value, rowId);
//     // setIsDirty(true);

//     // 1. Update the Master List
//     setVendorEmployee((prevList) =>
//       prevList.map((item) => {
//         const itemId = item?.tempId || item.carrierId;

//         if (String(itemId) === String(rowId)) {
//           return {
//             ...item,
//             [field]: value,
//             isDirty: true,
//           }; // Removed the extra } and , that were here
//         }
//         return item;
//       }),
//     );

//     // 2. Update the Active Record
//     setSelectedEmp((prev) => {
//       if (!prev) return prev;
//       // Note: Make sure you use vendEmplId here to match the logic above
//       const currentId = prev.tempId || prev.carrierId;
//       if (String(currentId) !== String(rowId)) return prev;

//       return { ...prev, [field]: value };
//     });
//   };

//   // toolbar actions
//   const handleAdd = () => {
//     const hasUnsavedNew = vendorEmployee.some(
//       (row) => row.isNew || !!row.tempId,
//     );
//     if (hasUnsavedNew) {
//       toast.warn(
//         "Please save or cancel the current new entry before adding another.",
//       );
//       return;
//     }
//     const newId = `TEMP_${Date.now()}`;
//     const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");
//     const newRow = {
//       ...initialInsCarInf, // Spread existing defaults
//       tempId: newId, // Add the temporary tracker
//       isNew: true, // Flag for API (POST instead of PUT)
//       isDirty: true, // Flag to enable the Save button
//       modifiedBy: userSession?.name || "system",
//       companyId: "1",
//     };
//     setVendorEmployee([newRow, ...vendorEmployee]); // Add to the top of the list
//     setSelectedEmps(new Set([newId])); // Check the checkbox for this new row
//     setSelectedEmp(newRow); // Set as active data for the form view
//     setCurrentIndex(0); // Focus the first position
//   };

//   const handleSaveAll = async () => {
//     // 1. Identify rows that need saving
//     const changedRows = vendorEmployee.filter(
//       (row) => row?.isNew || row.isDirty,
//     );

//     if (changedRows.length === 0) {
//       toast.info("No changes to save.", { style: { fontSize: "11px" } });
//       return;
//     }

//     // 2. High-Density Validation Logic
//     const requiredFields = ["carrierId", "carrierName"];
//     let validationError = "";

//     // Check every changed row for missing required fields
//     for (const row of changedRows) {
//       const missing = requiredFields.find(
//         (field) => !row[field] || String(row[field]).trim() === "",
//       );
//       if (missing) {
//         // Use formal field names for the toast
//         const fieldName = missing.replace(/([A-Z])/g, " $1").toLowerCase();
//         validationError = `Row ${vendorEmployee.indexOf(row) + 1}: ${fieldName} is required.`;
//         break; // Exit loop on first error to keep toast clean
//       }
//     }

//     if (validationError) {
//       toast.error(validationError);
//       return;
//     }

//     // 3. Execution Phase
//     setLoading(true);
//     try {
//       const savePromises = changedRows.map((row) => {
//         // Remove local UI flags before sending to backend to keep payload clean
//         const { isNew, isDirty, tempId, ...payload } = row;

//         if (row.isNew) {
//           return api.post(`${backendUrl}/api/SubcontractorCarrier`, payload);
//         } else {
//           return api.put(`${backendUrl}/api/SubcontractorCarrier`, payload);
//         }
//       });

//       await Promise.all(savePromises);

//       toast.success("Changes saved successfully!", {
//         style: { fontSize: "11px" },
//       });
//       fetchInsuCarrierInfo();
//     } catch (error) {
//       console.error("Save Error:", error);
//       toast.error(
//         error.response?.data?.message || "Error during save operation.",
//         { style: { fontSize: "11px" } },
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     // 1. Check if anything is selected
//     if (selectedEmps.size === 0) {
//       toast.warn("Please select at least one vendor to delete.");
//       return;
//     }

//     // Confirm with the user
//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedEmps.size} selected item(s)?`,
//       )
//     ) {
//       return;
//     }

//     setLoading(true);
//     try {
//       // Convert Set to Array to use for...of or map
//       const idsToDelete = Array.from(selectedEmps);

//       for (const id of idsToDelete) {
//         // Check if it's a temporary local row or a database row
//         const isTemporary = String(id).startsWith("TEMP_");

//         if (isTemporary) {
//           // --- LOCAL DELETE ---
//           // Just filter it out of the local state
//           setVendorEmployee((prev) =>
//             prev.filter((item) => item.tempId !== id),
//           );
//         } else {
//           // --- SERVER DELETE ---
//           // Call your API endpoint for the specific ID
//           await api.delete(`${backendUrl}/api/SubcontractorCarrier/${id}`);
//         }
//       }

//       toast.success("Selection deleted successfully.");

//       // 2. Clear selection and refresh data
//       setSelectedEmps(new Set());
//       setSelectedEmp(null);
//       fetchInsuCarrierInfo(); // Get fresh list from server
//     } catch (error) {
//       console.error("Delete Error:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to delete some items.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const jumpToCode = (code) => {
//     if (!code) return;

//     const found = vendorEmployee.find(
//       (item) =>
//         String(item.carrierId).toLowerCase() === String(code).toLowerCase(),
//     );

//     if (found) {
//       const id = found.tempId || found.carrierId; //

//       // 1. Update Form View vendorEmployee
//       setSelectedEmp(found); //
//       setIsFormView(true); //

//       // 2. Update Navigation Index
//       const newIdx = vendorEmployee.indexOf(found);
//       setCurrentIndex(newIdx); //

//       // 3. SYNC TABLE SELECTION
//       // This ensures the row is checked/highlighted in the Table View
//       setSelectedEmps(new Set([id]));
//     } else {
//       toast.error(`Organization ID "${code}" not found.`); //
//     }
//   };

//   const handleNavigate = (direction) => {
//     // if (isFormDirty) {
//     //   if (!window.confirm("You have unsaved changes. Discard them and move?")) {
//     //     return;
//     //   }
//     // }

//     const idx = vendorEmployee.findIndex(
//       (x) =>
//         (x.tempId || x.carrierId) ===
//         (selectedEmp?.tempId || selectedEmp?.carrierId),
//     );

//     let newIdx = idx;
//     if (direction === "next" && idx < vendorEmployee.length - 1)
//       newIdx = idx + 1;
//     if (direction === "prev" && idx > 0) newIdx = idx - 1;
//     if (direction === "start") newIdx = 0;
//     if (direction === "end") newIdx = vendorEmployee.length - 1;

//     if (newIdx !== idx) {
//       const nextRecord = vendorEmployee[newIdx];
//       const nextId = nextRecord.tempId || nextRecord.carrierId;

//       // 1. Update the record being shown in the form
//       setSelectedEmp(nextRecord);
//       setCurrentIndex(newIdx);

//       // 2. CRITICAL: Update the selection so the table highlights this row
//       setSelectedEmps(new Set([nextId]));

//       // setIsFormDirty(false);
//     }
//   };

//   const handleCopy = () => {
//     const hasSelection = selectedEmps.size > 0 || selectedEmp;
//     if (!hasSelection) {
//       toast.warn("Select a skill record to copy first.");
//       return;
//     }

//     // Determine rows: prioritize checkboxes, fallback to single form selection
//     const rowsToCopy =
//       selectedEmps.size > 0
//         ? vendorEmployee.filter((item) =>
//             selectedEmps.has(item.tempId || item.carrierId),
//           )
//         : vendorEmployee.filter(
//             (item) =>
//               (item.tempId || item.carrierId) ===
//               (selectedEmp?.tempId || selectedEmp?.carrierId),
//           );

//     // Generate Tab-Separated string for system clipboard
//     const headerLine = columns.map((key) => COLUMN_LABELS[key]).join("\t");
//     const dataLines = rowsToCopy
//       .map((row) => columns.map((key) => row[key] || "").join("\t"))
//       .join("\n");

//     const finalClipboardString = `${headerLine}\n${dataLines}`;

//     navigator.clipboard
//       .writeText(finalClipboardString)
//       .then(() => {
//         setClipboard(rowsToCopy);
//         localStorage.setItem("skill_clipboard", JSON.stringify(rowsToCopy));
//         toast.success(`${rowsToCopy.length} skill(s) copied.`);
//       })
//       .catch(() => toast.error("Clipboard access failed."));
//   };

//   const handlePaste = () => {
//     const savedData =
//       clipboard && clipboard.length > 0
//         ? clipboard
//         : JSON.parse(localStorage.getItem("skill_clipboard"));

//     if (!savedData) return toast.warn("Clipboard is empty.");

//     const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
//     const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

//     const pastedRows = dataToPaste.map((row, index) => {
//       const newTempId = `SKILL_NEW_${Date.now()}_${index}`;
//       return {
//         ...row,
//         carrierId: "", // Clear primary key for new entry
//         tempId: newTempId,
//         isNew: true,
//         isDirty: true,
//         modifiedBy: userSession?.name || "system",
//         entryDtt: new Date().toISOString().split("T")[0],
//       };
//     });

//     // Update State (Add pasted rows to the top, keep original saved records)
//     setVendorEmployee((prev) => [
//       ...pastedRows,
//       ...prev.filter((item) => !item.isNew),
//     ]);

//     if (pastedRows.length > 0) {
//       setSelectedEmp(pastedRows[0]);
//       setSelectedEmps(new Set([pastedRows[0].tempId]));
//       setIsDirty(true);
//     }
//     toast.success(`${pastedRows.length} skill(s) pasted.`);
//   };

//   const handleDiscard = () => {
//     // Check if any record in the current list is edited or new
//     const hasUnsavedChanges = vendorEmployee.some(
//       (item) => item.isNew || item.isDirty,
//     );

//     if (!isDirty && !hasUnsavedChanges) {
//       toast.info("No changes found.");
//       return;
//     }

//     if (window.confirm("Discard all unsaved skill changes and new records?")) {
//       // Revert to original data snapshot
//       setVendorEmployee([...allVendorEmployee]);

//       // Reset UI flags
//       setSelectedEmp(null);
//       setSelectedEmps(new Set());
//       setIsDirty(false);

//       // Clear local clipboard
//       setClipboard(null);
//       localStorage.removeItem("skill_clipboard");

//       fetchInsuCarrierInfo();

//       toast.info("Changes discarded.");
//     }
//   };

//   return (
//     <div className="mt-14 ml-4">
//       <MainContainer title={"insurance Carrier Information"}>
//         <Toolbar
//           isFormView={isFormView}
//           handleNavigate={handleNavigate}
//           jumpToCode={jumpToCode}
//           totalRecords={vendorEmployee.length}
//           selectedRow={selectedEmp}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           loading={loading}
//           // isDirty={isDirty}
//           // loading={loading}
//           actions={{
//             onAdd: handleAdd,
//             onSave: handleSaveAll,
//             onDelete: handleDelete,
//             onCopy: handleCopy,
//             onClear: handleDiscard,
//             onPaste: handlePaste,
//             onToggleView: () => {
//               // If we are moving from Table to Form and no record is selected
//               if (!isFormView && !selectedEmp && vendorEmployee.length > 0) {
//                 const firstRecord = vendorEmployee[0];

//                 // 1. Set the individual selected record
//                 setSelectedEmp(firstRecord);

//                 // 2. Add the ID to your Set (selectedEmps)
//                 setSelectedEmps((prevSet) => {
//                   const newSet = new Set(prevSet);
//                   // Use carrierId (or tempId for new unsaved rows)
//                   newSet.add(firstRecord.carrierId || firstRecord.tempId);
//                   return newSet;
//                 });
//               }

//               // Finally, flip the view state
//               setIsFormView(!isFormView);
//             },
//           }}
//           currentIndex={currentIndex}
//         />
//         {isFormView ? (
//           <div className="p-2 space-y-2">
//             <FormSection>
//               <FormInput
//                 label="Insurance Carrier"
//                 disabled={!selectedEmp?.isNew}
//                 required
//                 value={selectedEmp?.carrierId}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "carrierId",
//                     e.target.value,
//                     selectedEmp.tempId || selectedEmp.carrierId,
//                   )
//                 }
//               />
//               <FormInput
//                 label="Name"
//                 required
//                 value={selectedEmp?.carrierName}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "carrierName",
//                     e.target.value,
//                     selectedEmp.tempId || selectedEmp.carrierId,
//                   )
//                 }
//               />
//             </FormSection>

//             <FormSection title={"Contact Information"}>
//               <div className="grid grid-cols-1 lg:grid-cols-2 space-x-4">
//                 <div className=" flex flex-col ">
//                   <FormInput
//                     label="Agent Name"
//                     value={selectedEmp?.agentName}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "agentName",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                   <FormInput
//                     label="Agent Title"
//                     value={selectedEmp?.agentTitle}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "agentTitle",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                   <FormInput
//                     label="Phone Number"
//                     value={selectedEmp?.phoneNumber}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "phoneNumber",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                   <FormInput
//                     label="Fax Number"
//                     value={selectedEmp?.faxNumber}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "faxNumber",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                 </div>

//                 <div className=" flex flex-col ">
//                   <FormInput
//                     label="Address Line 1"
//                     value={selectedEmp?.addressLine1}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "addressLine1",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                   <FormInput
//                     label="Address Line 2"
//                     value={selectedEmp?.addressLine2}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "addressLine2",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                   <FormInput
//                     label="Address Line 3"
//                     value={selectedEmp?.addressLine3}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "addressLine3",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />

//                   <FormInput
//                     label="City"
//                     value={selectedEmp?.city}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "city",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                   <FormInput
//                     label="State/Province"
//                     value={selectedEmp?.stateCode}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "stateCode",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                   <FormInput
//                     label="Postal Code"
//                     value={selectedEmp?.postalCode}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "postalCode",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                   <FormInput
//                     label="Country"
//                     value={selectedEmp?.countryCode}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "countryCode",
//                         e.target.value,
//                         selectedEmp.tempId || selectedEmp.carrierId,
//                       )
//                     }
//                   />
//                 </div>
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
//                     {/* <input
//                             type="checkbox"
//                             checked={isAllSelected}
//                             onChange={toggleSelectAll}
//                           /> */}
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
//                 {vendorEmployee?.map((item) => (
//                   <tr
//                     key={item.tempId || item.carrierId}
//                     className={`${
//                       selectedEmps.has(item.tempId || item.carrierId)
//                         ? "bg-blue-50"
//                         : ""
//                     } hover:bg-gray-50 transition-colors cursor-pointer`}
//                   >
//                     <td className="text-center tbody-td ">
//                       <input
//                         type="checkbox"
//                         checked={selectedEmps.has(
//                           item.tempId || item.carrierId,
//                         )}
//                         className="h-3 w-3 accent-blue-600 cursor-pointer"
//                         onChange={(e) => {
//                           e.stopPropagation(); // Prevent row onClick from firing twice
//                           const uniqueKey = item.tempId || item.carrierId;
//                           const newSet = new Set(selectedEmps);
//                           if (newSet.has(uniqueKey)) {
//                             newSet.delete(uniqueKey);
//                             setSelectedEmp(null);
//                           } else {
//                             newSet.add(uniqueKey);
//                             setSelectedEmp(item);
//                           }
//                           setSelectedEmps(newSet);
//                         }}
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className={`td-input  min-w-[180px] ${item?.isNew ? "bg-white" : "bg-gray-100"}`}
//                         value={item.carrierId || ""}
//                         disabled={!item?.isNew}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "carrierId",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.carrierName || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "carrierName",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.agentName || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "agentName",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.agentTitle || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "agentTitle",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>

//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.phoneNumber || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "phoneNumber",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.faxNumber || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "faxNumber",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.addressLine1 || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "addressLine1",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.addressLine2 || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "addressLine2",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.addressLine3 || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "addressLine3",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.city || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "city",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.stateCode || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "stateCode",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.countryCode || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "countryCode",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input  min-w-[180px]"
//                         value={item.postalCode || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "postalCode",
//                             e.target.value,
//                             item.tempId || item.carrierId,
//                           )
//                         }
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageInsuranceCarrierInformation;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { backendUrl } from "./config";
import { MainContainer, Toolbar } from "../helper/container";
import { FormInput, FormSection } from "../helper/formSection";

const ManageInsuranceCarrierInformation = () => {
  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  // const employee = formData.employees?.[0] || {};

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialInsCarInf = {
    carrierId: "",
    carrierName: "",
    agentName: "",
    agentTitle: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    stateCode: "",
    countryCode: "",
    postalCode: "",
    phoneNumber: "",
    faxNumber: "",
    companyId: "1",
    modifiedBy: user.name,
  };

  const COLUMN_LABELS = {
    carrierId: "Carrier ID",
    carrierName: "Carrier Name",
    agentName: "Agent Name",
    agentTitle: "Agent Title",
    phoneNumber: "Phone Number",
    faxNumber: "Fax Number",
    addressLine1: "Address Line 1",
    addressLine2: "Address Line 2",
    addressLine3: "Address Line 3",
    city: "City",
    stateCode: "State",
    countryCode: "Country",
    postalCode: "Zip/Postal Code",
  };

  const columns = Object.keys(COLUMN_LABELS);
  const REQUIRED_FIELDS = new Set(["carrierId", "carrierName"]);

  const renderColumnLabel = (columnKey) => (
    <>
      {COLUMN_LABELS[columnKey]}
      {REQUIRED_FIELDS.has(columnKey) && (
        <span className="text-red-600 ml-0.5">*</span>
      )}
    </>
  );

  const renderRequiredLabel = (label) => (
    <>
      {label} <span className="text-red-600">*</span>
    </>
  );

  const fetchInsuCarrierInfo = async () => {
    try {
      const response = await api.get(`${backendUrl}/api/SubcontractorCarrier`);

      setLoading(true);

      if (response.data) {
        const data = response.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);
        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.carrierId === selectedEmp?.carrierId,
          );
          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.carrierId]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.carrierId]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(null);
          setSelectedEmps(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsuCarrierInfo();
  }, []);

  const handleInputChange = (field, value, rowId) => {
    console.log(field, value, rowId);
    // setIsDirty(true);

    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.carrierId;

        if (String(itemId) === String(rowId)) {
          return {
            ...item,
            [field]: value,
            isDirty: true,
          }; // Removed the extra } and , that were here
        }
        return item;
      }),
    );

    // 2. Update the Active Record
    setSelectedEmp((prev) => {
      if (!prev) return prev;
      // Note: Make sure you use vendEmplId here to match the logic above
      const currentId = prev.tempId || prev.carrierId;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  // toolbar actions
  const handleAdd = () => {
    const hasUnsavedNew = vendorEmployee.some(
      (row) => row.isNew || !!row.tempId,
    );
    if (hasUnsavedNew) {
      toast.warn(
        "Please save or cancel the current new entry before adding another.",
      );
      return;
    }
    const newId = `TEMP_${Date.now()}`;
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const newRow = {
      ...initialInsCarInf, // Spread existing defaults
      tempId: newId, // Add the temporary tracker
      isNew: true, // Flag for API (POST instead of PUT)
      isDirty: true, // Flag to enable the Save button
      modifiedBy: userSession?.name || "system",
      companyId: "1",
    };
    setVendorEmployee([newRow, ...vendorEmployee]); // Add to the top of the list
    setSelectedEmps(new Set([newId])); // Check the checkbox for this new row
    setSelectedEmp(newRow); // Set as active data for the form view
    setCurrentIndex(0); // Focus the first position
  };

  const handleSaveAll = async () => {
    // 1. Identify rows that need saving
    const changedRows = vendorEmployee.filter(
      (row) => row?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.", { style: { fontSize: "11px" } });
      return;
    }

    // 2. High-Density Validation Logic
    const requiredFields = ["carrierId", "carrierName"];
    let validationError = "";

    // Check every changed row for missing required fields
    for (const row of changedRows) {
      const missing = requiredFields.find(
        (field) => !row[field] || String(row[field]).trim() === "",
      );
      if (missing) {
        // Use formal field names for the toast
        const fieldName = missing.replace(/([A-Z])/g, " $1").toLowerCase();
        validationError = `Row ${vendorEmployee.indexOf(row) + 1}: ${fieldName} is required.`;
        break; // Exit loop on first error to keep toast clean
      }
    }

    if (validationError) {
      toast.error(validationError);
      return;
    }

    // 3. Execution Phase
    setLoading(true);
    try {
      const savePromises = changedRows.map((row) => {
        // Remove local UI flags before sending to backend to keep payload clean
        const { isNew, isDirty, tempId, ...payload } = row;

        if (row.isNew) {
          return api.post(`${backendUrl}/api/SubcontractorCarrier`, payload);
        } else {
          return api.put(`${backendUrl}/api/SubcontractorCarrier`, payload);
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!", {
        style: { fontSize: "11px" },
      });
      fetchInsuCarrierInfo();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
        { style: { fontSize: "11px" } },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // 1. Check if anything is selected
    if (selectedEmps.size === 0) {
      toast.warn("Please select at least one vendor to delete.");
      return;
    }

    // Confirm with the user
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedEmps.size} selected item(s)?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // Convert Set to Array to use for...of or map
      const idsToDelete = Array.from(selectedEmps);

      for (const id of idsToDelete) {
        // Check if it's a temporary local row or a database row
        const isTemporary = String(id).startsWith("TEMP_");

        if (isTemporary) {
          // --- LOCAL DELETE ---
          // Just filter it out of the local state
          setVendorEmployee((prev) =>
            prev.filter((item) => item.tempId !== id),
          );
        } else {
          // --- SERVER DELETE ---
          // Call your API endpoint for the specific ID
          await api.delete(`${backendUrl}/api/SubcontractorCarrier/${id}`);
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchInsuCarrierInfo(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorEmployee.find(
      (item) =>
        String(item.carrierId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.carrierId; //

      // 1. Update Form View vendorEmployee
      setSelectedEmp(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = vendorEmployee.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedEmps(new Set([id]));
    } else {
      toast.error(`Organization ID "${code}" not found.`); //
    }
  };

  const handleNavigate = (direction) => {
    // if (isFormDirty) {
    //   if (!window.confirm("You have unsaved changes. Discard them and move?")) {
    //     return;
    //   }
    // }

    const idx = vendorEmployee.findIndex(
      (x) =>
        (x.tempId || x.carrierId) ===
        (selectedEmp?.tempId || selectedEmp?.carrierId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorEmployee.length - 1)
      newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorEmployee.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorEmployee[newIdx];
      const nextId = nextRecord.tempId || nextRecord.carrierId;

      // 1. Update the record being shown in the form
      setSelectedEmp(nextRecord);
      setCurrentIndex(newIdx);

      // 2. CRITICAL: Update the selection so the table highlights this row
      setSelectedEmps(new Set([nextId]));

      // setIsFormDirty(false);
    }
  };

  const handleCopy = () => {
    const hasSelection = selectedEmps.size > 0 || selectedEmp;
    if (!hasSelection) {
      toast.warn("Select a skill record to copy first.");
      return;
    }

    // Determine rows: prioritize checkboxes, fallback to single form selection
    const rowsToCopy =
      selectedEmps.size > 0
        ? vendorEmployee.filter((item) =>
            selectedEmps.has(item.tempId || item.carrierId),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.carrierId) ===
              (selectedEmp?.tempId || selectedEmp?.carrierId),
          );

    // Generate Tab-Separated string for system clipboard
    const headerLine = columns.map((key) => COLUMN_LABELS[key]).join("\t");
    const dataLines = rowsToCopy
      .map((row) => columns.map((key) => row[key] || "").join("\t"))
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    navigator.clipboard
      .writeText(finalClipboardString)
      .then(() => {
        setClipboard(rowsToCopy);
        localStorage.setItem("skill_clipboard", JSON.stringify(rowsToCopy));
        toast.success(`${rowsToCopy.length} skill(s) copied.`);
      })
      .catch(() => toast.error("Clipboard access failed."));
  };

  const handlePaste = () => {
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("skill_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `SKILL_NEW_${Date.now()}_${index}`;
      return {
        ...row,
        carrierId: "", // Clear primary key for new entry
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        modifiedBy: userSession?.name || "system",
        entryDtt: new Date().toISOString().split("T")[0],
      };
    });

    // Update State (Add pasted rows to the top, keep original saved records)
    setVendorEmployee((prev) => [
      ...pastedRows,
      ...prev.filter((item) => !item.isNew),
    ]);

    if (pastedRows.length > 0) {
      setSelectedEmp(pastedRows[0]);
      setSelectedEmps(new Set([pastedRows[0].tempId]));
      setIsDirty(true);
    }
    toast.success(`${pastedRows.length} skill(s) pasted.`);
  };

  const handleDiscard = () => {
    // Check if any record in the current list is edited or new
    const hasUnsavedChanges = vendorEmployee.some(
      (item) => item.isNew || item.isDirty,
    );

    if (!isDirty && !hasUnsavedChanges) {
      toast.info("No changes found.");
      return;
    }

    if (window.confirm("Discard all unsaved skill changes and new records?")) {
      // Revert to original data snapshot
      setVendorEmployee([...allVendorEmployee]);

      // Reset UI flags
      setSelectedEmp(null);
      setSelectedEmps(new Set());
      setIsDirty(false);

      // Clear local clipboard
      setClipboard(null);
      localStorage.removeItem("skill_clipboard");

      fetchInsuCarrierInfo();

      toast.info("Changes discarded.");
    }
  };

  return (
    <div className="mt-14 ml-4">
      <MainContainer title={"insurance Carrier Information"}>
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => {
              // If we are moving from Table to Form and no record is selected
              if (!isFormView && !selectedEmp && vendorEmployee.length > 0) {
                const firstRecord = vendorEmployee[0];

                // 1. Set the individual selected record
                setSelectedEmp(firstRecord);

                // 2. Add the ID to your Set (selectedEmps)
                setSelectedEmps((prevSet) => {
                  const newSet = new Set(prevSet);
                  // Use carrierId (or tempId for new unsaved rows)
                  newSet.add(firstRecord.carrierId || firstRecord.tempId);
                  return newSet;
                });
              }

              // Finally, flip the view state
              setIsFormView(!isFormView);
            },
          }}
          currentIndex={currentIndex}
        />
        {isFormView ? (
          <div className="p-2 space-y-2">
            <FormSection>
              <FormInput
                label={renderRequiredLabel("Insurance Carrier")}
                disabled={!selectedEmp?.isNew}
                value={selectedEmp?.carrierId}
                onChange={(e) =>
                  handleInputChange(
                    "carrierId",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.carrierId,
                  )
                }
              />
              <FormInput
                label={renderRequiredLabel("Name")}
                value={selectedEmp?.carrierName}
                onChange={(e) =>
                  handleInputChange(
                    "carrierName",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.carrierId,
                  )
                }
              />
            </FormSection>

            <FormSection title={"Contact Information"}>
              <div className="grid grid-cols-1 lg:grid-cols-2 space-x-4">
                <div className=" flex flex-col ">
                  <FormInput
                    label="Agent Name"
                    value={selectedEmp?.agentName}
                    onChange={(e) =>
                      handleInputChange(
                        "agentName",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                  <FormInput
                    label="Agent Title"
                    value={selectedEmp?.agentTitle}
                    onChange={(e) =>
                      handleInputChange(
                        "agentTitle",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                  <FormInput
                    label="Phone Number"
                    value={selectedEmp?.phoneNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "phoneNumber",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                  <FormInput
                    label="Fax Number"
                    value={selectedEmp?.faxNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "faxNumber",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                </div>

                <div className=" flex flex-col ">
                  <FormInput
                    label="Address Line 1"
                    value={selectedEmp?.addressLine1}
                    onChange={(e) =>
                      handleInputChange(
                        "addressLine1",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                  <FormInput
                    label="Address Line 2"
                    value={selectedEmp?.addressLine2}
                    onChange={(e) =>
                      handleInputChange(
                        "addressLine2",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                  <FormInput
                    label="Address Line 3"
                    value={selectedEmp?.addressLine3}
                    onChange={(e) =>
                      handleInputChange(
                        "addressLine3",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />

                  <FormInput
                    label="City"
                    value={selectedEmp?.city}
                    onChange={(e) =>
                      handleInputChange(
                        "city",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                  <FormInput
                    label="State/Province"
                    value={selectedEmp?.stateCode}
                    onChange={(e) =>
                      handleInputChange(
                        "stateCode",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                  <FormInput
                    label="Postal Code"
                    value={selectedEmp?.postalCode}
                    onChange={(e) =>
                      handleInputChange(
                        "postalCode",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                  <FormInput
                    label="Country"
                    value={selectedEmp?.countryCode}
                    onChange={(e) =>
                      handleInputChange(
                        "countryCode",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.carrierId,
                      )
                    }
                  />
                </div>
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
                    {/* <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                          /> */}
                  </th>

                  {columns.map((col) => (
                    <th className="th-thead">
                      <div className="flex items-center justify-center">
                        <span>{renderColumnLabel(col)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tbody">
                {vendorEmployee?.map((item) => (
                  <tr
                    key={item.tempId || item.carrierId}
                    className={`${
                      selectedEmps.has(item.tempId || item.carrierId)
                        ? "bg-blue-50"
                        : ""
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="text-center tbody-td ">
                      <input
                        type="checkbox"
                        checked={selectedEmps.has(
                          item.tempId || item.carrierId,
                        )}
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent row onClick from firing twice
                          const uniqueKey = item.tempId || item.carrierId;
                          const newSet = new Set(selectedEmps);
                          if (newSet.has(uniqueKey)) {
                            newSet.delete(uniqueKey);
                            setSelectedEmp(null);
                          } else {
                            newSet.add(uniqueKey);
                            setSelectedEmp(item);
                          }
                          setSelectedEmps(newSet);
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className={`td-input  min-w-[180px] ${item?.isNew ? "bg-white" : "bg-gray-100"}`}
                        value={item.carrierId || ""}
                        disabled={!item?.isNew}
                        onChange={(e) =>
                          handleInputChange(
                            "carrierId",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.carrierName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "carrierName",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.agentName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "agentName",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.agentTitle || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "agentTitle",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>

                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.phoneNumber || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "phoneNumber",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.faxNumber || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "faxNumber",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.addressLine1 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "addressLine1",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.addressLine2 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "addressLine2",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.addressLine3 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "addressLine3",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.city || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "city",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.stateCode || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "stateCode",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.countryCode || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "countryCode",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input  min-w-[180px]"
                        value={item.postalCode || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "postalCode",
                            e.target.value,
                            item.tempId || item.carrierId,
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default ManageInsuranceCarrierInformation;
