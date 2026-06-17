// import React, { useEffect, useState } from "react";
// import api from "../utils/api";
// import { backendUrl } from "./config";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { TableSearchSelect } from "../helper/tableSection";
// import { ActionButton, MainContainer, Toolbar } from "../helper/container";
// import { Save } from "lucide-react";

// const ConfigureVoucherApproverSettings = () => {
//   const [vendorEmployee, setVendorEmployee] = useState([]);
//   const [allVendorEmployee, setAllVendorEmployee] = useState([]);

//   const [currentIndex, setCurrentIndex] = useState(0);

//   const [selectedEmps, setSelectedEmps] = useState(new Set());
//   const [selectedEmpsLvl, setSelectedEmpsLvl] = useState(new Set());
//   const [selectedEmp, setSelectedEmp] = useState(null);
//   const [selectedEmpLvl, setSelectedEmpLvl] = useState(null);

//   const [isFormView, setIsFormView] = useState(true);
//   const [searchValue, setSearchValue] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   const [loading, setLoading] = useState(false)

//   const [auser, setAUser] = useState([]);
//   const [skillLevel, setSkillLevel] = useState([]);

//   const [clipboard, setClipboard] = useState([]);
//   const [isDirty, setIsDirty] = useState(false);

//   const [linkApproval, setLinkApproval] = useState([]);
//   const [allLinkApproval, setAllLinkApproval] = useState([]);

//   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
//   console.log(selectedEmpLvl)

//   const initialApprover = {
//     userId: "",
//     username: "",
//     companyId: "1",
//     modifiedBy: user.name,
//   };

//   const getLinkdata = async () => {

//     try {
//       const res = await api.get(
//         `${backendUrl}/api/voucher-approver-users/by-approver/${selectedEmp.userId}/1`,
//       );

//       if (res.data) {
//         setLinkApproval(res.data);
//         setAllLinkApproval(res.data);
//       } else {
//         setLinkApproval([])
//         setAllLinkApproval([])
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getUserIdByName = (input) => {
//     if (!input) return "";

//     // Look for a match in either the userId or the username field
//     const foundUser = auser.find(
//       (u) =>
//         String(u.userId).toLowerCase() === String(input).toLowerCase() ||
//         String(u.username).toLowerCase() === String(input).toLowerCase(),
//     );

//     return foundUser ? foundUser.userId : "";
//   };

//   const fetchItem = async () => {
//     try {
//       const userRes = await api.get(`${backendUrl}/api/User`);
//       if (userRes.data) {
//         setAUser(userRes.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const COLUMN_LABELS = {
//     userId: "Approver ID",
//     username: "Name",
//   };

//   const columns = Object.keys(COLUMN_LABELS);

//   const fetchApproverId = async () => {
//     // if (!selectedRow || !selectedVendorEmp) return;
//     try {
//       const response = await axios.get(`${backendUrl}/api/voucher-approvers/1`);

//       if (response.data) {
//         const data = response.data;
//         setVendorEmployee(data);
//         setAllVendorEmployee(data);

//         // Handle Selection Logic
//         if (data.length > 0) {
//           // 1. Check if there is a previously selected entry that still exists in the new data
//           const stillExists = data.find(
//             (emp) => emp.userId === selectedEmp?.userId,
//           );

//           if (stillExists) {
//             // Keep the previous selection
//             setSelectedEmp(stillExists);
//             setSelectedEmps(new Set([stillExists.userId]));
//           } else {
//             // 2. Otherwise, select the first entry
//             const firstEmp = data[0];
//             setSelectedEmp(firstEmp);
//             setSelectedEmps(new Set([firstEmp.userId]));
//           }
//         } else {
//           // Clear selection if no data returned
//           setSelectedEmp(null);
//           setSelectedEmps(new Set());
//         }
//       }
//     } catch (error) {
//       console.error("Fetch Error", error);
//     }
//   };

//   useEffect(() => {
//     fetchApproverId();
//     getLinkdata();
//     fetchItem();
//   }, []);

//   useEffect(() => {
//     getLinkdata();
//   }, [selectedEmp]);

//   const handleInputChange = (field, value, rowId) => {
//     // setIsDirty(true);

//     // 1. Update the Master List
//     setVendorEmployee((prevList) =>
//       prevList.map((item) => {
//         const itemId = item?.tempId || item.userId;

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
//       const currentId = prev.tempId || prev.userId;
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
//       ...initialApprover, // Spread existing defaults
//       tempId: newId, // Add the temporary tracker
//       isNew: true, // Flag for API (POST instead of PUT)
//       isDirty: true, // Flag to enable the Save button
//       modifiedBy: userSession?.name || "system",
//       companyId: "1",
//     };
//     setLinkApproval([])
//     setVendorEmployee([newRow, ...vendorEmployee]); // Add to the top of the list
//     setSelectedEmps(new Set([newId])); // Check the checkbox for this new row
//     setSelectedEmp(newRow); // Set as active data for the form view
//     setCurrentIndex(0); // Focus the first position
//   };

// const handleSaveAll = async () => {
//   // 1. Identify Changes
//   const changedApproverRows = vendorEmployee.filter((row) => row?.isNew || row.isDirty);
//   const hasLinkChanges = linkApproval.some((row) => row.isNew || row.isDirty); // Assuming you have these flags on links

//   if (changedApproverRows.length === 0 && !hasLinkChanges) {
//     toast.info("No changes to save.");
//     return;
//   }

//   setLoading(true)

//   // setLoading(true);
//   try {
//     // --- STEP 1: Save Approvers First ---
//     if (changedApproverRows.length > 0) {
//       const approverPromises = changedApproverRows.map((row) => {
//         const payload = {
//           userId: row.username,
//           companyId: "1",
//         };

//         // If your backend handles PUT vs POST, uncomment the logic below
//         // if (row.isNew) {
//         return api.post(`${backendUrl}/api/voucher-approvers`, payload);
//         // } else {
//         //   return api.put(`${backendUrl}/api/voucher-approvers`, payload);
//         // }
//       });

//       await Promise.all(approverPromises);
//       // await fetchApproverId(); // Refresh to ensure selectedEmp has correct DB context
//     }

//     // --- STEP 2: Save Links (Only if an Approver is selected or was just created) ---
//     // We re-check selectedEmp because it might have been updated by fetchApproverId()
//     if (hasLinkChanges) {
//       if (!selectedEmp?.userId) {
//         toast.error("No Approver selected to link users to.");
//       } else {
//         const validRows = linkApproval.filter((row) => row.userId && row.userId !== "");

//         if (validRows.length > 0) {
//           const linkPayload = {
//             approverUserId: selectedEmp.isNew ? selectedEmp.username : selectedEmp.userId,
//             companyId: "1",
//             userIds: validRows.map((row) => row.userId),
//           };

//           await api.post(`${backendUrl}/api/voucher-approver-users/assign`, linkPayload);
//           // await getLinkdata();
//         }
//       }
//     }

//     toast.success("All changes saved successfully!");
//   } catch (error) {
//     const errorMsg = error.response?.data?.message || error.response?.data || "Error during save.";
//     toast.error(errorMsg);
//   } finally {
//     setLoading(false);
//   }
// };

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

//     // setLoading(true);

//     setLoading(true)
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
//           await api.delete(
//             `${backendUrl}/api/voucher-approvers?userId=${id}&companyId=1`,
//           );
//         }
//       }

//       toast.success("Selection deleted successfully.");

//       // 2. Clear selection and refresh data
//       setSelectedEmps(new Set());
//       setSelectedEmp(null);
//       fetchApproverId(); // Get fresh list from server
//     } catch (error) {
//       console.error("Delete Error:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to delete some items.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   //   const jumpToCode = (code) => {
//   //     if (!code) return;

//   //     const found = vendorEmployee.find(
//   //       (item) =>
//   //         String(item.userId).toLowerCase() === String(code).toLowerCase(),
//   //     );

//   //     if (found) {
//   //       const id = found.tempId || found.userId; //

//   //       // 1. Update Form View vendorEmployee
//   //       setSelectedEmp(found); //
//   //       setIsFormView(true); //

//   //       // 2. Update Navigation Index
//   //       const newIdx = vendorEmployee.indexOf(found);
//   //       setCurrentIndex(newIdx); //

//   //       // 3. SYNC TABLE SELECTION
//   //       // This ensures the row is checked/highlighted in the Table View
//   //       setSelectedEmps(new Set([id]));
//   //     } else {
//   //       toast.error(`Organization ID "${code}" not found.`); //
//   //     }
//   //   };

//   //   const handleNavigate = (direction) => {
//   //     // if (isFormDirty) {
//   //     //   if (!window.confirm("You have unsaved changes. Discard them and move?")) {
//   //     //     return;
//   //     //   }
//   //     // }

//   //     const idx = vendorEmployee.findIndex(
//   //       (x) =>
//   //         (x.tempId || x.userId) ===
//   //         (selectedEmp?.tempId || selectedEmp?.userId),
//   //     );

//   //     let newIdx = idx;
//   //     if (direction === "next" && idx < vendorEmployee.length - 1)
//   //       newIdx = idx + 1;
//   //     if (direction === "prev" && idx > 0) newIdx = idx - 1;
//   //     if (direction === "start") newIdx = 0;
//   //     if (direction === "end") newIdx = vendorEmployee.length - 1;

//   //     if (newIdx !== idx) {
//   //       const nextRecord = vendorEmployee[newIdx];
//   //       const nextId = nextRecord.tempId || nextRecord.userId;

//   //       // 1. Update the record being shown in the form
//   //       setSelectedEmp(nextRecord);
//   //       setCurrentIndex(newIdx);

//   //       // 2. CRITICAL: Update the selection so the table highlights this row
//   //       setSelectedEmps(new Set([nextId]));

//   //       // setIsFormDirty(false);
//   //     }
//   //   };

//   const handleCopy = () => {
//     const hasSelection = selectedEmps.size > 0 || selectedEmp;
//     if (!hasSelection) {
//       toast.warn("Select a approver record to copy first.");
//       return;
//     }

//     // Determine rows: prioritize checkboxes, fallback to single form selection
//     const rowsToCopy =
//       selectedEmps.size > 0
//         ? vendorEmployee.filter((item) =>
//             selectedEmps.has(item.tempId || item.userId),
//           )
//         : vendorEmployee.filter(
//             (item) =>
//               (item.tempId || item.userId) ===
//               (selectedEmp?.tempId || selectedEmp?.userId),
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
//         localStorage.setItem("approver_clipboard", JSON.stringify(rowsToCopy));
//         toast.success(`${rowsToCopy.length} Approver(s) copied.`);
//       })
//       .catch(() => toast.error("Clipboard access failed."));
//   };

//   const handlePaste = () => {
//     const savedData =
//       clipboard && clipboard.length > 0
//         ? clipboard
//         : JSON.parse(localStorage.getItem("approver_clipboard"));

//     if (!savedData) return toast.warn("Clipboard is empty.");

//     const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
//     const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

//     const pastedRows = dataToPaste.map((row, index) => {
//       const newTempId = `APPROVER_NEW_${Date.now()}_${index}`;
//       return {
//         ...row,
//         userId: "", // Clear primary key for new entry
//         tempId: newTempId,
//         isNew: true,
//         isDirty: true,
//         modifiedBy: userSession?.name || "system",
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
//     toast.success(`${pastedRows.length} approver(s) pasted.`);
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

//     if (
//       window.confirm("Discard all unsaved approver changes and new records?")
//     ) {
//       // Revert to original data snapshot
//       setVendorEmployee([...allVendorEmployee]);

//       // Reset UI flags
//       setSelectedEmp(null);
//       setSelectedEmps(new Set());
//       setIsDirty(false);

//       // Clear local clipboard
//       setClipboard(null);
//       localStorage.removeItem("approver_clipboard");

//       toast.success("Changes discarded.");
//     }
//   };
//   const handleDiscardLink = () => {
//     // Check if any record in the current list is edited or new
//     const hasUnsavedChanges = linkApproval.some(
//       (item) => item.isNew || item.isDirty,
//     );

//     if (!isDirty && !hasUnsavedChanges) {
//       toast.info("No changes found.");
//       return;
//     }

//     if (
//       window.confirm("Discard all unsaved approver changes and new records?")
//     ) {
//       // Revert to original data snapshot
//       setLinkApproval([...allLinkApproval]);

//       // Reset UI flags
//       setSelectedEmpLvl(null);
//       setSelectedEmpsLvl(new Set());
//       setIsDirty(false);

//       // Clear local clipboard
//       setClipboard(null);
//       localStorage.removeItem("approver_clipboard");

//       toast.success("Changes discarded.");
//     }
//   };

//   const handleAddLink = () => {
//     const newId = `TEMP_LINK_${Date.now()}`;
//     const newRow = {
//       approverUserId: selectedEmp?.userId || "", // Link to the currently active Approver
//       userId: "", // The user being assigned
//       username: "",
//       companyId: "1",
//       tempId: newId,
//       isNew: true,
//       isDirty: true,
//     };

//     setLinkApproval([newRow, ...linkApproval]);
//     // Optional: Auto-select the new row
//     // setSelectedEmps(new Set([newId]));
//   };

//   const handleSaveLinks = async () => {
//     if (!selectedEmp?.userId) {
//       toast.error("No Approver selected.");
//       return;
//     }

//     // Filter out any rows that don't have a userId selected yet
//     const validRows = linkApproval.filter(
//       (row) => row.userId && row.userId !== "",
//     );

//     if (validRows.length === 0) {
//       toast.info("No users to save.");
//       return;
//     }

//     try {
//       // Construct payload according to your image: { approverUserId, companyId, userIds: [] }
//       const payload = {
//         approverUserId: selectedEmp.userId,
//         companyId: "1",
//         userIds: validRows.map((row) => row.userId), // Extract just the IDs into an array
//       };

//       // Replace with your specific endpoint from the image
//       await api.post(
//         `${backendUrl}/api/voucher-approver-users/assign`,
//         payload,
//       );

//       toast.success("Users assigned successfully!");

//       // Refresh the data to clear temp IDs and isNew flags
//       getLinkdata();
//     } catch (error) {
//       console.error("Save Error:", error);
//       toast.error(error.response?.data?.message || "Failed to assign users.");
//     }
//   };
//   const handleLinkedInputChange = (field, value, rowId) => {
//     setLinkApproval((prevList) =>
//       prevList.map((item) => {
//         const itemId = item?.tempId || item.userId;
//         if (String(itemId) === String(rowId)) {
//           return { ...item, [field]: value, isDirty: true };
//         }
//         return item;
//       }),
//     );
//   };

//   const handleDeleteLinkedUsers = async () => {
//     // 1. Ensure an approver is selected in the top table
//     if (!selectedEmp?.userId) {
//       toast.warn("Please select an Approver first.");
//       return;
//     }

//     // 2. Ensure users are selected in the 'Link User' table
//     if (selectedEmpsLvl.size === 0) {
//       toast.warn("Please select linked users to delete.");
//       return;
//     }

//     if (!window.confirm(`Delete ${selectedEmpsLvl.size} linked user(s)?`))
//       return;

//     setLoading(true)

//     try {
//       const idsToDelete = Array.from(selectedEmpsLvl);

//       for (const id of idsToDelete) {
//         const isTemporary = String(id).startsWith("TEMP_");

//         if (isTemporary) {
//           // Local removal for unsaved rows
//           setLinkApproval((prev) => prev.filter((item) => item.tempId !== id));
//         } else {
//           // Server removal using the specific API structure
//           await api.delete(
//             `${backendUrl}/api/voucher-approver-users?approverUserId=${selectedEmp.userId}&userId=${id}&companyId=1`,
//           );
//         }
//       }

//       toast.success("Linked users removed.");
//       setSelectedEmpsLvl(new Set());
//       // Refresh the linked data
//       getLinkdata(selectedEmp.userId);
//     } catch (error) {
//       console.error("Delete Error:", error);
//       toast.error("Failed to delete some linked users.");
//     } finally {
//       setLoading(false)
//     }
//   };

//   return (
//     <div className="space-y-2 mt-14 ml-4">
//       <MainContainer title={"Voucher Approver Settings"}>
//         <Toolbar
//           //   isFormView={isFormView}
//           //   handleNavigate={handleNavigate}
//           //   jumpToCode={jumpToCode}
//           totalRecords={vendorEmployee.length}
//           selectedRow={selectedEmp}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           // isDirty={isDirty}
//           // loading={loading}
//           actions={{
//             onAdd: handleAdd,
//             onSave: handleSaveAll,
//             onDelete: handleDelete,
//             onCopy: handleCopy,
//             onClear: handleDiscard,
//             onPaste: handlePaste,
//             // onToggleView: () => setIsFormView(!isFormView),
//           }}
//           buttonsDisable={["copy", "paste", "tableform"]}
//           currentIndex={currentIndex}
//         />

//         <div className={`overflow-x-auto max-h-[35vh]`}>
//           <table className="min-w-full text-sm border border-gray-300 rounded">
//             <thead className="bg-gray-200 sticky top-0 z-10 ">
//               <tr>
//                 {/* {canEdit("manageAccount") && ( */}
//                 <th className="th-thead w-10">
//                   {/* <input
//                         type="checkbox"
//                         checked={isAllSelected}
//                         onChange={toggleSelectAll}
//                       /> */}
//                 </th>

//                 <th className="th-thead">
//                   <div className="flex items-center justify-center">
//                     <span>Approver Id</span>
//                     <span className="">*</span>
//                   </div>
//                 </th>
//                 <th className="th-thead">
//                   <div className="flex items-center justify-center">
//                     <span>Name</span>
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="tbody">
//               {vendorEmployee?.map((item) => (
//                 <tr
//                   key={item.tempId || item.userId}
//                   className={`${
//                     selectedEmps.has(item.tempId || item.userId)
//                       ? "bg-blue-50"
//                       : ""
//                   } hover:bg-gray-50 transition-colors cursor-pointer`}
//                 >
//                   <td className="text-center tbody-td ">
//                     <input
//                       type="checkbox"
//                       checked={selectedEmps.has(item.tempId || item.userId)}
//                       className="h-3 w-3 accent-blue-600 cursor-pointer"
//                       onChange={(e) => {
//                         e.stopPropagation();
//                         const uniqueKey = item.tempId || item.userId;
//                         const newSet = new Set(selectedEmps);

//                         if (newSet.has(uniqueKey)) {
//                           // 1. Remove the ID from the Set
//                           newSet.delete(uniqueKey);

//                           // 2. If there are still other items selected, find the "last" one to keep it active
//                           if (newSet.size > 0) {
//                             const lastId = Array.from(newSet).pop(); // Get the last ID added to the Set
//                             // Assuming 'employees' is your original data array
//                             const lastItem = vendorEmployee.find(
//                               (emp) => (emp.tempId || emp.userId) === lastId,
//                             );
//                             setSelectedEmp(lastItem);
//                           } else {
//                             setSelectedEmp(null);
//                           }
//                         } else {
//                           // 3. Adding a new item
//                           newSet.add(uniqueKey);
//                           setSelectedEmp(item);
//                         }

//                         setSelectedEmps(newSet);
//                       }}
//                     />
//                   </td>
//                   {/* --- Skill Identification --- */}
//                   <td className="tbody-td">
//                     <TableSearchSelect
//                       options={auser}
//                       value={getUserIdByName(item?.userId) || ""}
//                       disabled={!item?.isNew}
//                       displayKey="userId"
//                       secondaryKey="username"
//                       onSelect={(val) => {
//                         handleInputChange(
//                           "userId",
//                           val.userId,
//                           item?.tempId || item?.userId,
//                         );
//                         handleInputChange(
//                           "username",
//                           val.username,
//                           item?.tempId || item?.userId,
//                         );
//                       }}
//                     />
//                   </td>
//                   <td className="tbody-td">
//                     <input
//                       className="td-input bg-gray-50 min-w-[180px]"
//                       value={item?.username || ""}
//                       readOnly
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </MainContainer>

//       <MainContainer title={"Link User"}>
//         <Toolbar
//           //   isFormView={isFormView}
//           //   handleNavigate={handleNavigate}
//           //   jumpToCode={jumpToCode}
//           totalRecords={vendorEmployee.length}
//           selectedRow={selectedEmp}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           // isDirty={isDirty}
//           // loading={loading}
//           actions={{
//             onAdd: handleAddLink,
//             onSave: handleSaveLinks,
//             onDelete: handleDeleteLinkedUsers,
//             onClear: handleDiscardLink,
//             // onToggleView: () => setIsFormView(!isFormView),
//           }}
//           buttonsDisable={["copy", "paste", "tableform", "save"]}
//           currentIndex={currentIndex}
//         />

//         {/* <div>
//           <ActionButton
//            icon={Save}
//            onClick={handle}
//           />
//         </div> */}

//         <div className={`overflow-x-auto max-h-[35vh] `}>
//           <table className="min-w-full text-sm border border-gray-300 rounded">
//             <thead className="bg-gray-200 sticky top-0 z-10 ">
//               <tr>
//                 {/* {canEdit("manageAccount") && ( */}
//                 <th className="th-thead w-10">
//                   {/* <input
//                         type="checkbox"
//                         checked={isAllSelected}
//                         onChange={toggleSelectAll}
//                       /> */}
//                 </th>

//                 <th className="th-thead">
//                   <div className="flex items-center justify-center">
//                     <span>User</span>
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             {selectedEmp && (
//               <tbody className="tbody">
//                 {linkApproval?.map((item) => {
//                   console.log(item)
//                   return (
//                     <tr
//                       key={item.tempId || item.userId}
//                       className={`${
//                         selectedEmps.has(item.tempId || item.userId)
//                           ? "bg-blue-50"
//                           : ""
//                       } hover:bg-gray-50 transition-colors cursor-pointer`}
//                     >
//                       <td className="text-center tbody-td">
//                         <input
//                           type="checkbox"
//                           // Change: Point this to selectedEmpsLvl to match your state
//                           checked={selectedEmpsLvl.has(
//                             item.tempId || item.userId,
//                           )}
//                           className="h-3 w-3 accent-blue-600 cursor-pointer"
//                           onChange={(e) => {
//                             e.stopPropagation();
//                             const uniqueKey = item.tempId || item.userId;
//                             const newSet = new Set(selectedEmpsLvl);
//                             if (newSet.has(uniqueKey)) {
//                               newSet.delete(uniqueKey);

//                               if(newSet.size > 0){
//                                 const lastId = Array.from(newSet).pop()
//                                 const lastItem = vendorEmployee.find((emp) => (emp.tempId || emp.userId) === lastId)
//                                 setSelectedEmpLvl(lastItem)
//                               }
//                               else {
//                                 setSelectedEmpLvl(null)
//                               }
//                             } else {
//                               newSet.add(uniqueKey);
//                             }
//                             setSelectedEmpsLvl(newSet);
//                           }}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <TableSearchSelect
//                           options={auser}
//                           value={item?.userId || ""}
//                           displayKey="userId"
//                           secondaryKey="username"
//                           onSelect={(val) => {
//                             const rowId = item?.tempId || item?.userId;
//                             // Use the updated handleInputChange to set both values
//                             handleLinkedInputChange(
//                               "userId",
//                               val.username,
//                               rowId,
//                             );
//                           }}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             )}
//           </table>
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ConfigureVoucherApproverSettings;

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { backendUrl } from "./config";
import axios from "axios";
import { toast } from "react-toastify";
import { TableSearchSelect } from "../helper/tableSection";
import { ActionButton, MainContainer, Toolbar } from "../helper/container";
import { Save } from "lucide-react";

const ConfigureVoucherApproverSettings = () => {
  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmpsLvl, setSelectedEmpsLvl] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [selectedEmpLvl, setSelectedEmpLvl] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false)

  const [auser, setAUser] = useState([]);
  const [skillLevel, setSkillLevel] = useState([]);

  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const [linkApproval, setLinkApproval] = useState([]);
  const [allLinkApproval, setAllLinkApproval] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  console.log(selectedEmpLvl)

  const initialApprover = {
    userId: "",
    username: "",
    companyId: "1",
    modifiedBy: user.name,
  };

  const getLinkdata = async () => {

    try {
      const res = await api.get(
        `${backendUrl}/api/voucher-approver-users/by-approver/${selectedEmp.userId}/1`,
      );

      if (res.data) {
        setLinkApproval(res.data);
        setAllLinkApproval(res.data);
      } else {
        setLinkApproval([])
        setAllLinkApproval([])
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserIdByName = (input) => {
    if (!input) return "";

    // Look for a match in either the userId or the username field
    const foundUser = auser.find(
      (u) =>
        String(u.userId).toLowerCase() === String(input).toLowerCase() ||
        String(u.username).toLowerCase() === String(input).toLowerCase(),
    );

    return foundUser ? foundUser.userId : "";
  };

  const fetchItem = async () => {
    try {
      const userRes = await api.get(`${backendUrl}/api/User`);
      if (userRes.data) {
        setAUser(userRes.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const COLUMN_LABELS = {
    userId: "Approver ID",
    username: "Name",
  };

  const columns = Object.keys(COLUMN_LABELS);

  const fetchApproverId = async () => {
    // if (!selectedRow || !selectedVendorEmp) return;
    try {
      const response = await axios.get(`${backendUrl}/api/voucher-approvers/1`);

      if (response.data) {
        const data = response.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);

        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.userId === selectedEmp?.userId,
          );

          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.userId]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.userId]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(null);
          setSelectedEmps(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  useEffect(() => {
    fetchApproverId();
    getLinkdata();
    fetchItem();
  }, []);

  useEffect(() => {
    getLinkdata();
  }, [selectedEmp]);

  const handleInputChange = (field, value, rowId) => {
    // setIsDirty(true);

    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.userId;

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
      const currentId = prev.tempId || prev.userId;
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
      ...initialApprover, // Spread existing defaults
      tempId: newId, // Add the temporary tracker
      isNew: true, // Flag for API (POST instead of PUT)
      isDirty: true, // Flag to enable the Save button
      modifiedBy: userSession?.name || "system",
      companyId: "1",
    };
    setLinkApproval([])
    setVendorEmployee([newRow, ...vendorEmployee]); // Add to the top of the list
    setSelectedEmps(new Set([newId])); // Check the checkbox for this new row
    setSelectedEmp(newRow); // Set as active data for the form view
    setCurrentIndex(0); // Focus the first position
  };

const handleSaveAll = async () => {
  // 1. Identify Changes
  const changedApproverRows = vendorEmployee.filter((row) => row?.isNew || row.isDirty);
  const hasLinkChanges = linkApproval.some((row) => row.isNew || row.isDirty); // Assuming you have these flags on links

  if (changedApproverRows.length === 0 && !hasLinkChanges) {
    toast.info("No changes to save.");
    return;
  }

  setLoading(true)

  // setLoading(true);
  try {
    // --- STEP 1: Save Approvers First ---
    if (changedApproverRows.length > 0) {
      const approverPromises = changedApproverRows.map((row) => {
        const payload = {
          userId: row.username,
          companyId: "1",
        };

        // If your backend handles PUT vs POST, uncomment the logic below
        // if (row.isNew) {
        return api.post(`${backendUrl}/api/voucher-approvers`, payload);
        // } else {
        //   return api.put(`${backendUrl}/api/voucher-approvers`, payload);
        // }
      });

      await Promise.all(approverPromises);
      // await fetchApproverId(); // Refresh to ensure selectedEmp has correct DB context
    }

    // --- STEP 2: Save Links (Only if an Approver is selected or was just created) ---
    // We re-check selectedEmp because it might have been updated by fetchApproverId()
    if (hasLinkChanges) {
      if (!selectedEmp?.userId) {
        toast.error("No Approver selected to link users to.");
      } else {
        const validRows = linkApproval.filter((row) => row.userId && row.userId !== "");

        if (validRows.length > 0) {
          const linkPayload = {
            approverUserId: selectedEmp.isNew ? selectedEmp.username : selectedEmp.userId,
            companyId: "1",
            userIds: validRows.map((row) => row.userId),
          };

          await api.post(`${backendUrl}/api/voucher-approver-users/assign`, linkPayload);
          // await getLinkdata();
        }
      }
    }

    toast.success("All changes saved successfully!");
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data || "Error during save.";
    toast.error(errorMsg);
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

    // setLoading(true);

    setLoading(true)
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
          await api.delete(
            `${backendUrl}/api/voucher-approvers?userId=${id}&companyId=1`,
          );
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchApproverId(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      setLoading(false);
    }
  };

  //   const jumpToCode = (code) => {
  //     if (!code) return;

  //     const found = vendorEmployee.find(
  //       (item) =>
  //         String(item.userId).toLowerCase() === String(code).toLowerCase(),
  //     );

  //     if (found) {
  //       const id = found.tempId || found.userId; //

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
  //         (x.tempId || x.userId) ===
  //         (selectedEmp?.tempId || selectedEmp?.userId),
  //     );

  //     let newIdx = idx;
  //     if (direction === "next" && idx < vendorEmployee.length - 1)
  //       newIdx = idx + 1;
  //     if (direction === "prev" && idx > 0) newIdx = idx - 1;
  //     if (direction === "start") newIdx = 0;
  //     if (direction === "end") newIdx = vendorEmployee.length - 1;

  //     if (newIdx !== idx) {
  //       const nextRecord = vendorEmployee[newIdx];
  //       const nextId = nextRecord.tempId || nextRecord.userId;

  //       // 1. Update the record being shown in the form
  //       setSelectedEmp(nextRecord);
  //       setCurrentIndex(newIdx);

  //       // 2. CRITICAL: Update the selection so the table highlights this row
  //       setSelectedEmps(new Set([nextId]));

  //       // setIsFormDirty(false);
  //     }
  //   };

  const handleCopy = () => {
    const hasSelection = selectedEmps.size > 0 || selectedEmp;
    if (!hasSelection) {
      toast.warn("Select a approver record to copy first.");
      return;
    }

    // Determine rows: prioritize checkboxes, fallback to single form selection
    const rowsToCopy =
      selectedEmps.size > 0
        ? vendorEmployee.filter((item) =>
            selectedEmps.has(item.tempId || item.userId),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.userId) ===
              (selectedEmp?.tempId || selectedEmp?.userId),
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
        localStorage.setItem("approver_clipboard", JSON.stringify(rowsToCopy));
        toast.success(`${rowsToCopy.length} Approver(s) copied.`);
      })
      .catch(() => toast.error("Clipboard access failed."));
  };

  const handlePaste = () => {
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("approver_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `APPROVER_NEW_${Date.now()}_${index}`;
      return {
        ...row,
        userId: "", // Clear primary key for new entry
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        modifiedBy: userSession?.name || "system",
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
    toast.success(`${pastedRows.length} approver(s) pasted.`);
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

    if (
      window.confirm("Discard all unsaved approver changes and new records?")
    ) {
      // Revert to original data snapshot
      setVendorEmployee([...allVendorEmployee]);

      // Reset UI flags
      setSelectedEmp(null);
      setSelectedEmps(new Set());
      setIsDirty(false);

      // Clear local clipboard
      setClipboard(null);
      localStorage.removeItem("approver_clipboard");

      toast.success("Changes discarded.");
    }
  };
  const handleDiscardLink = () => {
    // Check if any record in the current list is edited or new
    const hasUnsavedChanges = linkApproval.some(
      (item) => item.isNew || item.isDirty,
    );

    if (!isDirty && !hasUnsavedChanges) {
      toast.info("No changes found.");
      return;
    }

    if (
      window.confirm("Discard all unsaved approver changes and new records?")
    ) {
      // Revert to original data snapshot
      setLinkApproval([...allLinkApproval]);

      // Reset UI flags
      setSelectedEmpLvl(null);
      setSelectedEmpsLvl(new Set());
      setIsDirty(false);

      // Clear local clipboard
      setClipboard(null);
      localStorage.removeItem("approver_clipboard");

      toast.success("Changes discarded.");
    }
  };

  const handleAddLink = () => {
    const newId = `TEMP_LINK_${Date.now()}`;
    const newRow = {
      approverUserId: selectedEmp?.userId || "", // Link to the currently active Approver
      userId: "", // The user being assigned
      username: "",
      companyId: "1",
      tempId: newId,
      isNew: true,
      isDirty: true,
    };

    setLinkApproval([newRow, ...linkApproval]);
    // Optional: Auto-select the new row
    // setSelectedEmps(new Set([newId]));
  };

  const handleSaveLinks = async () => {
    if (!selectedEmp?.userId) {
      toast.error("No Approver selected.");
      return;
    }

    // Filter out any rows that don't have a userId selected yet
    const validRows = linkApproval.filter(
      (row) => row.userId && row.userId !== "",
    );

    if (validRows.length === 0) {
      toast.info("No users to save.");
      return;
    }

    try {
      // Construct payload according to your image: { approverUserId, companyId, userIds: [] }
      const payload = {
        approverUserId: selectedEmp.userId,
        companyId: "1",
        userIds: validRows.map((row) => row.userId), // Extract just the IDs into an array
      };

      // Replace with your specific endpoint from the image
      await api.post(
        `${backendUrl}/api/voucher-approver-users/assign`,
        payload,
      );

      toast.success("Users assigned successfully!");

      // Refresh the data to clear temp IDs and isNew flags
      getLinkdata();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to assign users.");
    }
  };
  const handleLinkedInputChange = (field, value, rowId) => {
    setLinkApproval((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.userId;
        if (String(itemId) === String(rowId)) {
          return { ...item, [field]: value, isDirty: true };
        }
        return item;
      }),
    );
  };

  const handleDeleteLinkedUsers = async () => {
    // 1. Ensure an approver is selected in the top table
    if (!selectedEmp?.userId) {
      toast.warn("Please select an Approver first.");
      return;
    }

    // 2. Ensure users are selected in the 'Link User' table
    if (selectedEmpsLvl.size === 0) {
      toast.warn("Please select linked users to delete.");
      return;
    }

    if (!window.confirm(`Delete ${selectedEmpsLvl.size} linked user(s)?`))
      return;

    setLoading(true)

    try {
      const idsToDelete = Array.from(selectedEmpsLvl);

      for (const id of idsToDelete) {
        const isTemporary = String(id).startsWith("TEMP_");

        if (isTemporary) {
          // Local removal for unsaved rows
          setLinkApproval((prev) => prev.filter((item) => item.tempId !== id));
        } else {
          // Server removal using the specific API structure
          await api.delete(
            `${backendUrl}/api/voucher-approver-users?approverUserId=${selectedEmp.userId}&userId=${id}&companyId=1`,
          );
        }
      }

      toast.success("Linked users removed.");
      setSelectedEmpsLvl(new Set());
      // Refresh the linked data
      getLinkdata(selectedEmp.userId);
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete some linked users.");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="space-y-2 mt-14 ml-4">
      <MainContainer title={"Voucher Approver Settings"}>
        <Toolbar
          //   isFormView={isFormView}
          //   handleNavigate={handleNavigate}
          //   jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            // onToggleView: () => setIsFormView(!isFormView),
          }}
          buttonsDisable={["copy", "paste", "tableform"]}
          currentIndex={currentIndex}
        />

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

                <th className="th-thead">
                  <div className="flex items-center justify-center">
                    <span>Approver Id</span>
                    <span className="text-red-600 ml-0.5">*</span>
                  </div>
                </th>
                <th className="th-thead">
                  <div className="flex items-center justify-center">
                    <span>Name</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="tbody">
              {vendorEmployee?.map((item) => (
                <tr
                  key={item.tempId || item.userId}
                  className={`${
                    selectedEmps.has(item.tempId || item.userId)
                      ? "bg-blue-50"
                      : ""
                  } hover:bg-gray-50 transition-colors cursor-pointer`}
                >
                  <td className="text-center tbody-td ">
                    <input
                      type="checkbox"
                      checked={selectedEmps.has(item.tempId || item.userId)}
                      className="h-3 w-3 accent-blue-600 cursor-pointer"
                      onChange={(e) => {
                        e.stopPropagation();
                        const uniqueKey = item.tempId || item.userId;
                        const newSet = new Set(selectedEmps);

                        if (newSet.has(uniqueKey)) {
                          // 1. Remove the ID from the Set
                          newSet.delete(uniqueKey);

                          // 2. If there are still other items selected, find the "last" one to keep it active
                          if (newSet.size > 0) {
                            const lastId = Array.from(newSet).pop(); // Get the last ID added to the Set
                            // Assuming 'employees' is your original data array
                            const lastItem = vendorEmployee.find(
                              (emp) => (emp.tempId || emp.userId) === lastId,
                            );
                            setSelectedEmp(lastItem);
                          } else {
                            setSelectedEmp(null);
                          }
                        } else {
                          // 3. Adding a new item
                          newSet.add(uniqueKey);
                          setSelectedEmp(item);
                        }

                        setSelectedEmps(newSet);
                      }}
                    />
                  </td>
                  {/* --- Skill Identification --- */}
                  <td className="tbody-td">
                    <TableSearchSelect
                      options={auser}
                      value={getUserIdByName(item?.userId) || ""}
                      disabled={!item?.isNew}
                      displayKey="userId"
                      secondaryKey="username"
                      onSelect={(val) => {
                        handleInputChange(
                          "userId",
                          val.userId,
                          item?.tempId || item?.userId,
                        );
                        handleInputChange(
                          "username",
                          val.username,
                          item?.tempId || item?.userId,
                        );
                      }}
                    />
                  </td>
                  <td className="tbody-td">
                    <input
                      className="td-input bg-gray-50 min-w-[180px]"
                      value={item?.username || ""}
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MainContainer>

      <MainContainer title={"Link User"}>
        <Toolbar
          //   isFormView={isFormView}
          //   handleNavigate={handleNavigate}
          //   jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAddLink,
            onSave: handleSaveLinks,
            onDelete: handleDeleteLinkedUsers,
            onClear: handleDiscardLink,
            // onToggleView: () => setIsFormView(!isFormView),
          }}
          buttonsDisable={["copy", "paste", "tableform", "save"]}
          currentIndex={currentIndex}
        />

        {/* <div>
          <ActionButton
           icon={Save}
           onClick={handle}
          />
        </div> */}

        <div className={`overflow-x-auto max-h-[35vh] `}>
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

                <th className="th-thead">
                  <div className="flex items-center justify-center">
                    <span>User</span>
                  </div>
                </th>
              </tr>
            </thead>
            {selectedEmp && (
              <tbody className="tbody">
                {linkApproval?.map((item) => {
                  console.log(item)
                  return (
                    <tr
                      key={item.tempId || item.userId}
                      className={`${
                        selectedEmps.has(item.tempId || item.userId)
                          ? "bg-blue-50"
                          : ""
                      } hover:bg-gray-50 transition-colors cursor-pointer`}
                    >
                      <td className="text-center tbody-td">
                        <input
                          type="checkbox"
                          // Change: Point this to selectedEmpsLvl to match your state
                          checked={selectedEmpsLvl.has(
                            item.tempId || item.userId,
                          )}
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          onChange={(e) => {
                            e.stopPropagation();
                            const uniqueKey = item.tempId || item.userId;
                            const newSet = new Set(selectedEmpsLvl);
                            if (newSet.has(uniqueKey)) {
                              newSet.delete(uniqueKey);

                              if(newSet.size > 0){
                                const lastId = Array.from(newSet).pop()
                                const lastItem = vendorEmployee.find((emp) => (emp.tempId || emp.userId) === lastId)
                                setSelectedEmpLvl(lastItem)
                              }
                              else {
                                setSelectedEmpLvl(null)
                              }
                            } else {
                              newSet.add(uniqueKey);
                            }
                            setSelectedEmpsLvl(newSet);
                          }}
                        />
                      </td>
                      <td className="tbody-td">
                        <TableSearchSelect
                          options={auser}
                          value={item?.userId || ""}
                          displayKey="userId"
                          secondaryKey="username"
                          onSelect={(val) => {
                            const rowId = item?.tempId || item?.userId;
                            // Use the updated handleInputChange to set both values
                            handleLinkedInputChange(
                              "userId",
                              val.username,
                              rowId,
                            );
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </MainContainer>
    </div>
  );
};

export default ConfigureVoucherApproverSettings;
