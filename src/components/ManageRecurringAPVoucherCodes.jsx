// import React, { useEffect, useState } from "react";
// import { ActionButton, MainContainer } from "../helper/container";
// import { ActionDetailButton } from "../helper/formSection";
// import api from "../utils/api";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";
// import {
//   CloudSnow,
//   Plus,
//   RemoveFormatting,
//   Save,
//   Trash,
//   Trash2,
//   X,
// } from "lucide-react";
// import { IoRemove } from "react-icons/io5";

// const ManageRecurringAPVoucherCodes = () => {
//   const [recurringVoucher, setRecurringVoucher] = useState([]);
//   const [data, setAllData] = useState([]);
//   const [availablePeriods, setAvailablePeriods] = useState([]);
//   const [selectedCode, setSelectedCode] = useState({});

//   // Selection States
//   const [selectedAvailableSet, setSelectedAvailableSet] = useState(new Set());
//   const [selectedPeriods, setSelectedPeriods] = useState(new Set());
//   const [targetPeriods, setTargetPeriods] = useState([]); // Table 3 Data

//   const isAllSelected =
//     data.length > 0 && selectedAvailableSet.size === recurringVoucher.length;

//   const getVoucherSelectedPeriod = async () => {
//     try {
//       const res = await api.get(
//         `${backendUrl}/api/RecurringVoucherPeriods?voucherGroupCode=${selectedCode.voucherGroupCode}&companyId=1`,
//       );

//       if (res.data) {
//         setTargetPeriods(res.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const toggleSelectAll = () => {
//     if (isAllSelected) {
//       setSelectedAvailableSet(new Set());
//       setSelectedCode({}); // Clear active code if everything is deselected
//     } else {
//       // Create IDs array
//       const allIds = recurringVoucher.map(
//         (d) => d.tempId || d.voucherGroupCode,
//       );
//       setSelectedAvailableSet(new Set(allIds));

//       // Set the active code to the last item in the list (standard ERP behavior)
//       if (recurringVoucher.length > 0) {
//         setSelectedCode(recurringVoucher[recurringVoucher.length - 1]);
//       }
//     }
//   };

//   useEffect(() => {
//     getVoucherSelectedPeriod();
//   }, [selectedCode]);

//   const handleDelete = async () => {
//     // 1. Validation: Ensure a code is selected from your state
//     if (!selectedCode?.voucherGroupCode) {
//       return toast.error("Please select a Recurring Code to delete first");
//     }

//     const codeToDelete = selectedCode.voucherGroupCode;

//     // 2. Confirmation
//     if (!window.confirm(`Are you sure you want to delete ${codeToDelete}?`))
//       return;

//     try {
//       const companyId = "1";

//       // 3. API Call using the path parameters from your Swagger doc
//       await api.delete(
//         `${backendUrl}/api/RecurringVoucherGroups/${codeToDelete}/${companyId}`,
//       );

//       toast.success("Voucher group deleted successfully");

//       // 4. Cleanup: Clear the selection or refresh your main list
//       setSelectedCode(null);
//       getRecurringVoucher();
//       // fetchListData(); // Call your fetch function here to refresh the UI
//     } catch (error) {
//       console.error("Delete Error:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to delete the record",
//       );
//     }
//   };

//   // 1. Data Fetching
//   const getRecurringVoucher = async () => {
//     try {
//       const res = await api.get(
//         `${backendUrl}/api/RecurringVoucherGroups?companyId=1`,
//       );
//       if (res.data) {
//         setRecurringVoucher(res.data);
//         setAllData(res.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getAvailableSubperiods = async () => {
//     try {
//       const res = await api.get(
//         `${backendUrl}/api/sub-period/GetWithAccountingPeriod`,
//       );
//       if (res.data) setAvailablePeriods(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchSavedPeriodsForCode = async (code) => {
//     try {
//       // Assuming GET by code returns existing links
//       const res = await api.get(
//         `${backendUrl}/api/RecurringVoucherPeriods/${code}`,
//       );
//       if (res.data) setTargetPeriods(res.data);
//     } catch (error) {
//       setTargetPeriods([]); // Clear if no existing links found
//     }
//   };

//   useEffect(() => {
//     getRecurringVoucher();
//     getAvailableSubperiods();
//   }, []);

//   const toggleAvailableSelection = (item) => {
//     const id = `${item.fyCd}-${item.periodNo}-${item.subPeriodNo}`;
//     const newSet = new Set(selectedAvailableSet);
//     if (newSet.has(id)) newSet.delete(id);
//     else newSet.add(id);
//     setSelectedAvailableSet(newSet);
//   };
//   const togglePeriodSelected = (item) => {
//     const id = `${item.fyCd || item.fiscalYearCode}-${item.periodNo}-${item.subPeriodNo}`;
//     const newSet = new Set(selectedPeriods);
//     if (newSet.has(id)) newSet.delete(id);
//     else newSet.add(id);
//     setSelectedPeriods(newSet);
//   };
//   // Toggle All for Available Periods
//   const toggleAllAvailable = () => {
//     if (selectedAvailableSet.size === availablePeriods.length) {
//       // If all are selected, clear the set
//       setSelectedAvailableSet(new Set());
//     } else {
//       // Otherwise, add all IDs to the set
//       const allIds = availablePeriods.map(
//         (item) => `${item.fyCd}-${item.periodNo}-${item.subPeriodNo}`,
//       );
//       setSelectedAvailableSet(new Set(allIds));
//     }
//   };

//   // Toggle All for Selected Periods (Target)
//   const toggleAllTarget = () => {
//     if (selectedPeriods.size === targetPeriods.length) {
//       setSelectedPeriods(new Set());
//     } else {
//       const allIds = targetPeriods.map(
//         (item) =>
//           `${item.fyCd || item.fiscalYearCode}-${item.periodNo}-${item.subPeriodNo}`,
//       );
//       setSelectedPeriods(new Set(allIds));
//     }
//   };

//   const handleMoveToTarget = () => {
//     if (selectedAvailableSet.size === 0)
//       return toast.warn("Select periods first");
//     if (!selectedCode?.voucherGroupCode)
//       return toast.warn("Select Voucher first");

//     const itemsToAdd = availablePeriods.filter((p) =>
//       selectedAvailableSet.has(`${p.fyCd}-${p.periodNo}-${p.subPeriodNo}`),
//     );

//     // Prevent duplicates and add the isDirty flag
//     const filtered = itemsToAdd
//       .filter(
//         (newItem) =>
//           !targetPeriods.some(
//             (existing) =>
//               (existing.fyCd || existing.fiscalYearCode) === newItem.fyCd &&
//               existing.periodNo === newItem.periodNo &&
//               existing.subPeriodNo === newItem.subPeriodNo,
//           ),
//       )
//       .map((item) => ({
//         ...item,
//         fiscalYearCode: item.fyCd, // Standardizing the key name for the target table
//         isDirty: true, // Mark as new/modified
//       }));

//     setTargetPeriods([...targetPeriods, ...filtered]);
//     setSelectedAvailableSet(new Set());
//   };

//   // const handleSaveAll = async () => {
//   //   if (!selectedCode)
//   //     return toast.error("Please select a Recurring Code first");

//   //   try {
//   //     const payload = targetPeriods.map((p) => ({
//   //       voucherGroupCode: selectedCode.voucherGroupCode,
//   //       fiscalYearCode: p.fyCd || p.fiscalYearCode,
//   //       periodNo: p.periodNo,
//   //       subPeriodNo: p.subPeriodNo,
//   //       companyId: "1",
//   //       modifiedBy: "Admin",
//   //     }));

//   //     await api.post(`${backendUrl}/api/RecurringVoucherPeriods`, payload);
//   //     toast.success("Periods saved successfully");
//   //   } catch (error) {
//   //     toast.error("Save failed");
//   //   }
//   // };

//   const handleSaveAll = async () => {
//     if (!selectedCode)
//       return toast.error("Please select a Recurring Code first");

//     // 1. Filter only the "dirty" (newly added) items
//     const dirtyItems = targetPeriods.filter((p) => p.isDirty);

//     if (dirtyItems.length === 0) {
//       return toast.info("No new changes to save");
//     }

//     try {
//       // 2. Map only the dirty items to individual API post requests
//       const requests = dirtyItems.map((p) => {
//         const singlePayload = {
//           voucherGroupCode: selectedCode.voucherGroupCode,
//           fiscalYearCode: p.fyCd || p.fiscalYearCode,
//           periodNo: p.periodNo,
//           subPeriodNo: p.subPeriodNo,
//           companyId: "1",
//           modifiedBy: "Admin",
//         };

//         return api.post(
//           `${backendUrl}/api/RecurringVoucherPeriods`,
//           singlePayload,
//         );
//       });

//       // 3. Fire all requests
//       await Promise.all(requests);

//       // 4. Update the state: Mark all items as "clean" (isDirty: false)
//       // This ensures that next time you click Save, it doesn't try to save these again.
//       setTargetPeriods((prev) =>
//         prev.map((item) => ({
//           ...item,
//           isDirty: false,
//         })),
//       );

//       toast.success(`${dirtyItems.length} period(s) saved successfully`);
//     } catch (error) {
//       console.error(error);
//       toast.error("One or more saves failed");
//     }
//   };

//   const handleRemoveSelectedPeriods = async () => {
//     if (selectedPeriods.size === 0)
//       return toast.warn("No periods selected to remove");

//     // Get the objects for all selected IDs
//     const itemsToRemove = targetPeriods.filter((p) =>
//       selectedPeriods.has(
//         `${p.fyCd || p.fiscalYearCode}-${p.periodNo}-${p.subPeriodNo}`,
//       ),
//     );

//     const unsavedItems = itemsToRemove.filter((p) => p.isDirty);
//     const savedItems = itemsToRemove.filter((p) => !p.isDirty);

//     try {
//       // 1. If there are saved items, confirm before deleting from DB
//       if (savedItems.length > 0) {
//         const confirm = window.confirm(
//           `This will permanently delete ${savedItems.length} record(s) from the server. Continue?`,
//         );
//         if (!confirm) return;

//         const deleteRequests = savedItems.map((p) => {
//           const group = selectedCode.voucherGroupCode;
//           const fy = p.fyCd || p.fiscalYearCode;
//           const pd = p.periodNo;
//           const sub = p.subPeriodNo;
//           const companyId = "1";

//           // URL matches your Swagger: /api/RecurringVoucherPeriods/{group}/{fy}/{pd}/{sub}/{companyId}
//           return api.delete(
//             `${backendUrl}/api/RecurringVoucherPeriods/${group}/${fy}/${pd}/${sub}/${companyId}`,
//           );
//         });

//         await Promise.all(deleteRequests);
//       }

//       // 2. Update UI: Filter out everything that was in our "itemsToRemove" list
//       setTargetPeriods((prev) =>
//         prev.filter(
//           (p) =>
//             !selectedPeriods.has(
//               `${p.fyCd || p.fiscalYearCode}-${p.periodNo}-${p.subPeriodNo}`,
//             ),
//         ),
//       );

//       // 3. Reset the selection set
//       setSelectedPeriods(new Set());
//       toast.success("Selected periods removed successfully");
//     } catch (error) {
//       console.error("Delete failed:", error);
//       toast.error("Failed to delete some records from the server");
//     }
//   };

//   const handleClearDirtyPeriods = () => {
//     // Filter the list to keep only items that are NOT dirty
//     const savedItems = targetPeriods.filter((p) => !p.isDirty);

//     if (savedItems.length === targetPeriods.length) {
//       return toast.info("No unsaved changes to clear");
//     }

//     setTargetPeriods(savedItems);
//     toast.success("Unsaved changes discarded");
//   };

//   const handleClearAllPeriods = () => {
//     // Check if any item in the list is dirty
//     const hasUnsavedChanges = targetPeriods.some((p) => p.isDirty);

//     if (hasUnsavedChanges) {
//       const confirmClear = window.confirm(
//         "You have unsaved periods. Are you sure you want to clear the entire list?",
//       );
//       if (!confirmClear) return; // Exit if user cancels
//     }

//     setTargetPeriods([]);
//     setSelectedPeriods(new Set()); // Clear selection set as well
//   };

//   const handleAddMaster = () => {
//     const newTempId = `TEMP_${Date.now()}`;
//     const newRow = {
//       voucherGroupCode: "", // Editable field
//       companyId: "1",
//       isNew: true,
//       tempId: newTempId,
//     };

//     // Add to top of list
//     setRecurringVoucher([newRow, ...recurringVoucher]);

//     // Automatically select the new row for editing/mapping
//     setSelectedCode(newRow);
//   };
//   // Handle typing in the master table
//   const handleMasterInputChange = (value, id) => {
//     setRecurringVoucher((prev) =>
//       prev.map((item) => {
//         const itemId = item.tempId || item.voucherGroupCode;
//         if (itemId === id) {
//           return { ...item, voucherGroupCode: value };
//         }
//         return item;
//       }),
//     );
//   };

//   const handleSaveMaster = async (item) => {
//     if (!item.voucherGroupCode.trim()) {
//       toast.warn("Please enter a Recurring Code.");
//       return;
//     }

//     try {
//       const payload = {
//         voucherGroupCode: item.voucherGroupCode,
//         companyId: "1",
//         description: item.voucherGroupCode, // Default description to code
//         modifiedBy: "Admin",
//       };

//       await api.post(`${backendUrl}/api/RecurringVoucherGroups`, payload);

//       toast.success("Recurring Code saved successfully.");

//       // Refresh list to convert 'isNew' row into a standard row
//       getRecurringVoucher();
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         error.response?.data?.message || "Failed to save Recurring Code.",
//       );
//     }
//   };

//   const handleSaveEverything = async () => {
//     // 1. Check if we are currently adding a NEW Master Group
//     const newMasterGroup = recurringVoucher.find((v) => v.isNew);

//     // 2. Identify new (dirty) periods
//     const dirtyPeriods = targetPeriods.filter((p) => p.isDirty);

//     // Validation: If nothing to save
//     if (!newMasterGroup && dirtyPeriods.length === 0) {
//       return toast.info("No changes to save.");
//     }

//     try {
//       let currentVoucherCode = selectedCode?.voucherGroupCode;

//       // --- STEP 1: SAVE MASTER GROUP (if it's new) ---
//       if (newMasterGroup) {
//         if (!newMasterGroup.voucherGroupCode.trim()) {
//           return toast.warn("Please enter a Recurring Code name.");
//         }

//         const masterPayload = {
//           voucherGroupCode: newMasterGroup.voucherGroupCode,
//           companyId: "1",
//           description: newMasterGroup.voucherGroupCode,
//           modifiedBy: "Admin",
//         };

//         await api.post(
//           `${backendUrl}/api/RecurringVoucherGroups`,
//           masterPayload,
//         );
//         currentVoucherCode = newMasterGroup.voucherGroupCode; // Set code for Step 2
//         toast.success("Master Code saved.");
//       }

//       // --- STEP 2: SAVE PERIODS (if any are dirty) ---
//       if (dirtyPeriods.length > 0) {
//         // Ensure we have a code to link the periods to
//         if (!currentVoucherCode) {
//           return toast.error("Please select or save a Recurring Code first.");
//         }

//         const periodRequests = dirtyPeriods.map((p) => {
//           const periodPayload = {
//             voucherGroupCode: currentVoucherCode,
//             fiscalYearCode: p.fyCd || p.fiscalYearCode,
//             periodNo: p.periodNo,
//             subPeriodNo: p.subPeriodNo,
//             companyId: "1",
//             modifiedBy: "Admin",
//           };
//           return api.post(
//             `${backendUrl}/api/RecurringVoucherPeriods`,
//             periodPayload,
//           );
//         });

//         await Promise.all(periodRequests);

//         // Mark local state as clean
//         setTargetPeriods((prev) => prev.map((p) => ({ ...p, isDirty: false })));
//         toast.success(`${dirtyPeriods.length} period(s) saved.`);
//       }

//       // --- STEP 3: REFRESH DATA ---
//       await getRecurringVoucher(); // Refresh the master list
//     } catch (error) {
//       console.error("Save Error:", error);
//       toast.error(
//         error.response?.data?.message || "An error occurred during save.",
//       );
//     }
//   };

//   const handleDiscard = () => {
//     const hasChanges = recurringVoucher.filter((rec) => rec.isNew);

//     if (hasChanges) {
//       setRecurringVoucher(data);
//     }
//   };

//   return (
//     <div className="space-y-2 mt-14 ml-4">
//       {/* --- MASTER TABLE: Recurring Codes --- */}
//       <MainContainer title="Recurring A/P Voucher Codes">
//         <div className="flex justify-end p-2 gap-2">
//           <ActionButton
//             icon={Plus}
//             label="Add New Code"
//             onClick={handleAddMaster}
//           />
//           <ActionButton icon={X} label="Discard" onClick={handleDiscard} />
//           <ActionButton icon={Trash2} label="Delete" onClick={handleDelete} />
//           <ActionButton
//             icon={Save}
//             label="Save"
//             onClick={handleSaveEverything}
//           />
//         </div>
//         <div className="overflow-x-auto max-h-[30vh] border border-gray-300">
//           <table className="min-w-full table-auto">
//             <thead className="bg-gray-200 sticky top-0">
//               <tr>
//                 <th className="th-thead w-12">
//                   <input
//                     type="checkbox"
//                     className="accent-blue-500"
//                     checked={isAllSelected}
//                     onChange={toggleSelectAll}
//                   />
//                 </th>
//                 <th className="th-thead text-left">Recurring Code *</th>
//               </tr>
//             </thead>
//             <tbody className="tbody">
//               {recurringVoucher.map((item) => {
//                 const itemId = item.tempId || item.voucherGroupCode;
//                 const isSelected =
//                   // selectedCode?.tempId === item.tempId ||
//                   selectedCode?.voucherGroupCode === item.voucherGroupCode;

//                 return (
//                   <tr
//                     key={itemId}
//                     className={`tr-tbody${isSelected ? "bg-blue-50" : ""}`}
//                   >
//                     <td className="tbody-td text-center">
//                       <input
//                         type="checkbox"
//                         className="accent-blue-500"
//                         checked={selectedAvailableSet.has(itemId)}
//                         onChange={() => {
//                           // 1. Update the Set (Immutable update)
//                           const newSet = new Set(selectedAvailableSet);
//                           if (newSet.has(itemId)) {
//                             newSet.delete(itemId);
//                           } else {
//                             newSet.add(itemId);
//                           }
//                           setSelectedAvailableSet(newSet);
//                           setSelectedCode((prev) => {
//                             if (
//                               prev.voucherGroupCode === item.voucherGroupCode ||
//                               prev.tempId === item.tempId
//                             ) {
//                               const selectedIds = Array.from(newSet);
//                               if (selectedIds.length > 0) {
//                                 const lastId =
//                                   selectedIds[selectedIds.length - 1];
//                                 return (
//                                   recurringVoucher.find(
//                                     (v) =>
//                                       (v.tempId || v.voucherGroupCode) ===
//                                       lastId,
//                                   ) || {}
//                                 );
//                               }
//                               return {};
//                             }
//                             // If we are selecting a new item, make it the active code
//                             return item;
//                           });
//                         }}
//                         className="h-3 w-3 accent-blue-600"
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <div className="flex items-center gap-2">
//                         {item.isNew ? (
//                           <>
//                             <input
//                               className="td-input border border-blue-400 flex-1"
//                               value={item.voucherGroupCode}
//                               onChange={(e) =>
//                                 handleMasterInputChange(e.target.value, itemId)
//                               }
//                               placeholder="Type new code..."
//                               autoFocus
//                             />
//                           </>
//                         ) : (
//                           <span>{item.voucherGroupCode}</span>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </MainContainer>

//       <div className="grid grid-cols-2 gap-2">
//         {/* --- SOURCE TABLE: Available Periods --- */}
//         <MainContainer title="Available Subperiods">
//           <div className="flex justify-end p-1">
//             <ActionDetailButton label="Select →" onClick={handleMoveToTarget} />
//           </div>
//           <div className="overflow-x-auto max-h-[40vh] border border-gray-300">
//             <table className="min-w-full text-xs">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="th-thead w-12 text-center">
//                     <input
//                       type="checkbox"
//                       className="accent-blue-500"
//                       onChange={toggleAllAvailable}
//                       checked={
//                         availablePeriods.length > 0 &&
//                         selectedAvailableSet.size === availablePeriods.length
//                       }
//                     />
//                   </th>
//                   <th className="th-thead">FY</th>
//                   <th className="th-thead">Prd</th>
//                   <th className="th-thead">Prd End Date</th>
//                   <th className="th-thead">Sub</th>
//                   <th className="th-thead">Sub End Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {availablePeriods.map((item) => {
//                   const id = `${item.fyCd}-${item.periodNo}-${item.subPeriodNo}`;
//                   return (
//                     <tr key={id} className="hover:bg-gray-50">
//                       <td className="tbody-td text-center">
//                         <input
//                           type="checkbox"
//                           className="accent-blue-500"
//                           checked={selectedAvailableSet.has(id)}
//                           onChange={() => toggleAvailableSelection(item)}
//                         />
//                       </td>
//                       <td className="tbody-td text-center">{item.fyCd}</td>
//                       <td className="tbody-td text-center">{item.periodNo}</td>
//                       <td className="tbody-td text-center">
//                         {item.subPeriodEndDate}
//                       </td>
//                       <td className="tbody-td text-center">
//                         {item.subPeriodNo}
//                       </td>
//                       <td className="tbody-td text-center">
//                         {item.subPeriodEndDate}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </MainContainer>

//         {/* --- TARGET TABLE: Selected Periods --- */}
//         <MainContainer title="Selected Periods">
//           <div className="flex justify-end p-1 gap-2">
//             <ActionButton
//               icon={X}
//               label="Clear"
//               onClick={handleClearDirtyPeriods}
//             />
//             <ActionButton
//               icon={Trash2}
//               label="Remove Period"
//               onClick={handleRemoveSelectedPeriods}
//             />
//           </div>
//           <div className="overflow-x-auto max-h-[40vh] border border-gray-300">
//             <table className="min-w-full text-xs">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="th-thead w-12 text-center">
//                     <input
//                       type="checkbox"
//                       onChange={toggleAllTarget}
//                       className="accent-blue-500"
//                       checked={
//                         targetPeriods.length > 0 &&
//                         selectedPeriods.size === targetPeriods.length
//                       }
//                     />
//                   </th>
//                   <th className="th-thead">FY</th>
//                   <th className="th-thead">Prd</th>
//                   <th className="th-thead">Prd End Date</th>
//                   <th className="th-thead">Sub</th>
//                   <th className="th-thead">Sub End Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {targetPeriods.map((item, idx) => {
//                   const id = `${item.fycd || item.fiscalYearCode}-${item.periodNo}-${item.subPeriodNo}`;
//                   return (
//                     <tr key={idx}>
//                       <td className="tbody-td text-center">
//                         <input
//                           type="checkbox"
//                           className="accent-blue-500"
//                           checked={selectedPeriods.has(id)}
//                           onChange={() => togglePeriodSelected(item)}
//                         />
//                       </td>
//                       <td className="tbody-td text-center">
//                         {item.fyCd || item.fiscalYearCode}
//                       </td>
//                       <td className="tbody-td text-center">{item.periodNo}</td>
//                       <td className="tbody-td text-center">
//                         {item.subPeriodEndDate}
//                       </td>
//                       <td className="tbody-td text-center">
//                         {item.subPeriodNo}
//                       </td>
//                       <td className="tbody-td text-center">
//                         {item.subPeriodEndDate}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </MainContainer>
//       </div>
//     </div>
//   );
// };

// export default ManageRecurringAPVoucherCodes;

import React, { useEffect, useState } from "react";
import { ActionButton, MainContainer } from "../helper/container";
import { ActionDetailButton } from "../helper/formSection";
import api from "../utils/api";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import {
  CloudSnow,
  Plus,
  RemoveFormatting,
  Save,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { IoRemove } from "react-icons/io5";

const ManageRecurringAPVoucherCodes = () => {
  const [recurringVoucher, setRecurringVoucher] = useState([]);
  const [data, setAllData] = useState([]);
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [selectedCode, setSelectedCode] = useState({});

  // Selection States
  const [selectedAvailableSet, setSelectedAvailableSet] = useState(new Set());
  const [selectedPeriods, setSelectedPeriods] = useState(new Set());
  const [targetPeriods, setTargetPeriods] = useState([]); // Table 3 Data

  const isAllSelected =
    data.length > 0 && selectedAvailableSet.size === recurringVoucher.length;

  const getVoucherSelectedPeriod = async () => {
    try {
      const res = await api.get(
        `${backendUrl}/api/RecurringVoucherPeriods?voucherGroupCode=${selectedCode.voucherGroupCode}&companyId=1`,
      );

      if (res.data) {
        setTargetPeriods(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedAvailableSet(new Set());
      setSelectedCode({}); // Clear active code if everything is deselected
    } else {
      // Create IDs array
      const allIds = recurringVoucher.map(
        (d) => d.tempId || d.voucherGroupCode,
      );
      setSelectedAvailableSet(new Set(allIds));

      // Set the active code to the last item in the list (standard ERP behavior)
      if (recurringVoucher.length > 0) {
        setSelectedCode(recurringVoucher[recurringVoucher.length - 1]);
      }
    }
  };

  useEffect(() => {
    getVoucherSelectedPeriod();
  }, [selectedCode]);

  const handleDelete = async () => {
    // 1. Validation: Ensure a code is selected from your state
    if (!selectedCode?.voucherGroupCode) {
      return toast.error("Please select a Recurring Code to delete first");
    }

    const codeToDelete = selectedCode.voucherGroupCode;

    // 2. Confirmation
    if (!window.confirm(`Are you sure you want to delete ${codeToDelete}?`))
      return;

    try {
      const companyId = "1";

      // 3. API Call using the path parameters from your Swagger doc
      await api.delete(
        `${backendUrl}/api/RecurringVoucherGroups/${codeToDelete}/${companyId}`,
      );

      toast.success("Voucher group deleted successfully");

      // 4. Cleanup: Clear the selection or refresh your main list
      setSelectedCode(null);
      getRecurringVoucher();
      // fetchListData(); // Call your fetch function here to refresh the UI
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete the record",
      );
    }
  };

  // 1. Data Fetching
  const getRecurringVoucher = async () => {
    try {
      const res = await api.get(
        `${backendUrl}/api/RecurringVoucherGroups?companyId=1`,
      );
      if (res.data) {
        setRecurringVoucher(res.data);
        setAllData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAvailableSubperiods = async () => {
    try {
      const res = await api.get(
        `${backendUrl}/api/sub-period/GetWithAccountingPeriod`,
      );
      if (res.data) setAvailablePeriods(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSavedPeriodsForCode = async (code) => {
    try {
      // Assuming GET by code returns existing links
      const res = await api.get(
        `${backendUrl}/api/RecurringVoucherPeriods/${code}`,
      );
      if (res.data) setTargetPeriods(res.data);
    } catch (error) {
      setTargetPeriods([]); // Clear if no existing links found
    }
  };

  useEffect(() => {
    getRecurringVoucher();
    getAvailableSubperiods();
  }, []);

  const toggleAvailableSelection = (item) => {
    const id = `${item.fyCd}-${item.periodNo}-${item.subPeriodNo}`;
    const newSet = new Set(selectedAvailableSet);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedAvailableSet(newSet);
  };
  const togglePeriodSelected = (item) => {
    const id = `${item.fyCd || item.fiscalYearCode}-${item.periodNo}-${item.subPeriodNo}`;
    const newSet = new Set(selectedPeriods);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedPeriods(newSet);
  };
  // Toggle All for Available Periods
  const toggleAllAvailable = () => {
    if (selectedAvailableSet.size === availablePeriods.length) {
      // If all are selected, clear the set
      setSelectedAvailableSet(new Set());
    } else {
      // Otherwise, add all IDs to the set
      const allIds = availablePeriods.map(
        (item) => `${item.fyCd}-${item.periodNo}-${item.subPeriodNo}`,
      );
      setSelectedAvailableSet(new Set(allIds));
    }
  };

  // Toggle All for Selected Periods (Target)
  const toggleAllTarget = () => {
    if (selectedPeriods.size === targetPeriods.length) {
      setSelectedPeriods(new Set());
    } else {
      const allIds = targetPeriods.map(
        (item) =>
          `${item.fyCd || item.fiscalYearCode}-${item.periodNo}-${item.subPeriodNo}`,
      );
      setSelectedPeriods(new Set(allIds));
    }
  };

  const handleMoveToTarget = () => {
    if (selectedAvailableSet.size === 0)
      return toast.warn("Select periods first");
    if (!selectedCode?.voucherGroupCode)
      return toast.warn("Select Voucher first");

    const itemsToAdd = availablePeriods.filter((p) =>
      selectedAvailableSet.has(`${p.fyCd}-${p.periodNo}-${p.subPeriodNo}`),
    );

    // Prevent duplicates and add the isDirty flag
    const filtered = itemsToAdd
      .filter(
        (newItem) =>
          !targetPeriods.some(
            (existing) =>
              (existing.fyCd || existing.fiscalYearCode) === newItem.fyCd &&
              existing.periodNo === newItem.periodNo &&
              existing.subPeriodNo === newItem.subPeriodNo,
          ),
      )
      .map((item) => ({
        ...item,
        fiscalYearCode: item.fyCd, // Standardizing the key name for the target table
        isDirty: true, // Mark as new/modified
      }));

    setTargetPeriods([...targetPeriods, ...filtered]);
    setSelectedAvailableSet(new Set());
  };

  // const handleSaveAll = async () => {
  //   if (!selectedCode)
  //     return toast.error("Please select a Recurring Code first");

  //   try {
  //     const payload = targetPeriods.map((p) => ({
  //       voucherGroupCode: selectedCode.voucherGroupCode,
  //       fiscalYearCode: p.fyCd || p.fiscalYearCode,
  //       periodNo: p.periodNo,
  //       subPeriodNo: p.subPeriodNo,
  //       companyId: "1",
  //       modifiedBy: "Admin",
  //     }));

  //     await api.post(`${backendUrl}/api/RecurringVoucherPeriods`, payload);
  //     toast.success("Periods saved successfully");
  //   } catch (error) {
  //     toast.error("Save failed");
  //   }
  // };

  const handleSaveAll = async () => {
    if (!selectedCode)
      return toast.error("Please select a Recurring Code first");

    // 1. Filter only the "dirty" (newly added) items
    const dirtyItems = targetPeriods.filter((p) => p.isDirty);

    if (dirtyItems.length === 0) {
      return toast.info("No new changes to save");
    }

    try {
      // 2. Map only the dirty items to individual API post requests
      const requests = dirtyItems.map((p) => {
        const singlePayload = {
          voucherGroupCode: selectedCode.voucherGroupCode,
          fiscalYearCode: p.fyCd || p.fiscalYearCode,
          periodNo: p.periodNo,
          subPeriodNo: p.subPeriodNo,
          companyId: "1",
          modifiedBy: "Admin",
        };

        return api.post(
          `${backendUrl}/api/RecurringVoucherPeriods`,
          singlePayload,
        );
      });

      // 3. Fire all requests
      await Promise.all(requests);

      // 4. Update the state: Mark all items as "clean" (isDirty: false)
      // This ensures that next time you click Save, it doesn't try to save these again.
      setTargetPeriods((prev) =>
        prev.map((item) => ({
          ...item,
          isDirty: false,
        })),
      );

      toast.success(`${dirtyItems.length} period(s) saved successfully`);
    } catch (error) {
      console.error(error);
      toast.error("One or more saves failed");
    }
  };

  const handleRemoveSelectedPeriods = async () => {
    if (selectedPeriods.size === 0)
      return toast.warn("No periods selected to remove");

    // Get the objects for all selected IDs
    const itemsToRemove = targetPeriods.filter((p) =>
      selectedPeriods.has(
        `${p.fyCd || p.fiscalYearCode}-${p.periodNo}-${p.subPeriodNo}`,
      ),
    );

    const unsavedItems = itemsToRemove.filter((p) => p.isDirty);
    const savedItems = itemsToRemove.filter((p) => !p.isDirty);

    try {
      // 1. If there are saved items, confirm before deleting from DB
      if (savedItems.length > 0) {
        const confirm = window.confirm(
          `This will permanently delete ${savedItems.length} record(s) from the server. Continue?`,
        );
        if (!confirm) return;

        const deleteRequests = savedItems.map((p) => {
          const group = selectedCode.voucherGroupCode;
          const fy = p.fyCd || p.fiscalYearCode;
          const pd = p.periodNo;
          const sub = p.subPeriodNo;
          const companyId = "1";

          // URL matches your Swagger: /api/RecurringVoucherPeriods/{group}/{fy}/{pd}/{sub}/{companyId}
          return api.delete(
            `${backendUrl}/api/RecurringVoucherPeriods/${group}/${fy}/${pd}/${sub}/${companyId}`,
          );
        });

        await Promise.all(deleteRequests);
      }

      // 2. Update UI: Filter out everything that was in our "itemsToRemove" list
      setTargetPeriods((prev) =>
        prev.filter(
          (p) =>
            !selectedPeriods.has(
              `${p.fyCd || p.fiscalYearCode}-${p.periodNo}-${p.subPeriodNo}`,
            ),
        ),
      );

      // 3. Reset the selection set
      setSelectedPeriods(new Set());
      toast.success("Selected periods removed successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete some records from the server");
    }
  };

  const handleClearDirtyPeriods = () => {
    // Filter the list to keep only items that are NOT dirty
    const savedItems = targetPeriods.filter((p) => !p.isDirty);

    if (savedItems.length === targetPeriods.length) {
      return toast.info("No unsaved changes to clear");
    }

    setTargetPeriods(savedItems);
    toast.success("Unsaved changes discarded");
  };

  const handleClearAllPeriods = () => {
    // Check if any item in the list is dirty
    const hasUnsavedChanges = targetPeriods.some((p) => p.isDirty);

    if (hasUnsavedChanges) {
      const confirmClear = window.confirm(
        "You have unsaved periods. Are you sure you want to clear the entire list?",
      );
      if (!confirmClear) return; // Exit if user cancels
    }

    setTargetPeriods([]);
    setSelectedPeriods(new Set()); // Clear selection set as well
  };

  const handleAddMaster = () => {
    const newTempId = `TEMP_${Date.now()}`;
    const newRow = {
      voucherGroupCode: "", // Editable field
      companyId: "1",
      isNew: true,
      tempId: newTempId,
    };

    // Add to top of list
    setRecurringVoucher([newRow, ...recurringVoucher]);

    // Automatically select the new row for editing/mapping
    setSelectedCode(newRow);
  };
  // Handle typing in the master table
  const handleMasterInputChange = (value, id) => {
    setRecurringVoucher((prev) =>
      prev.map((item) => {
        const itemId = item.tempId || item.voucherGroupCode;
        if (itemId === id) {
          return { ...item, voucherGroupCode: value };
        }
        return item;
      }),
    );
  };

  const handleSaveMaster = async (item) => {
    if (!item.voucherGroupCode.trim()) {
      toast.warn("Please enter a Recurring Code.");
      return;
    }

    try {
      const payload = {
        voucherGroupCode: item.voucherGroupCode,
        companyId: "1",
        description: item.voucherGroupCode, // Default description to code
        modifiedBy: "Admin",
      };

      await api.post(`${backendUrl}/api/RecurringVoucherGroups`, payload);

      toast.success("Recurring Code saved successfully.");

      // Refresh list to convert 'isNew' row into a standard row
      getRecurringVoucher();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save Recurring Code.",
      );
    }
  };

  const handleSaveEverything = async () => {
    // 1. Check if we are currently adding a NEW Master Group
    const newMasterGroup = recurringVoucher.find((v) => v.isNew);

    // 2. Identify new (dirty) periods
    const dirtyPeriods = targetPeriods.filter((p) => p.isDirty);

    // Validation: If nothing to save
    if (!newMasterGroup && dirtyPeriods.length === 0) {
      return toast.info("No changes to save.");
    }

    try {
      let currentVoucherCode = selectedCode?.voucherGroupCode;

      // --- STEP 1: SAVE MASTER GROUP (if it's new) ---
      if (newMasterGroup) {
        if (!newMasterGroup.voucherGroupCode.trim()) {
          return toast.warn("Please enter a Recurring Code name.");
        }

        const masterPayload = {
          voucherGroupCode: newMasterGroup.voucherGroupCode,
          companyId: "1",
          description: newMasterGroup.voucherGroupCode,
          modifiedBy: "Admin",
        };

        await api.post(
          `${backendUrl}/api/RecurringVoucherGroups`,
          masterPayload,
        );
        currentVoucherCode = newMasterGroup.voucherGroupCode; // Set code for Step 2
        toast.success("Master Code saved.");
      }

      // --- STEP 2: SAVE PERIODS (if any are dirty) ---
      if (dirtyPeriods.length > 0) {
        // Ensure we have a code to link the periods to
        if (!currentVoucherCode) {
          return toast.error("Please select or save a Recurring Code first.");
        }

        const periodRequests = dirtyPeriods.map((p) => {
          const periodPayload = {
            voucherGroupCode: currentVoucherCode,
            fiscalYearCode: p.fyCd || p.fiscalYearCode,
            periodNo: p.periodNo,
            subPeriodNo: p.subPeriodNo,
            companyId: "1",
            modifiedBy: "Admin",
          };
          return api.post(
            `${backendUrl}/api/RecurringVoucherPeriods`,
            periodPayload,
          );
        });

        await Promise.all(periodRequests);

        // Mark local state as clean
        setTargetPeriods((prev) => prev.map((p) => ({ ...p, isDirty: false })));
        toast.success(`${dirtyPeriods.length} period(s) saved.`);
      }

      // --- STEP 3: REFRESH DATA ---
      await getRecurringVoucher(); // Refresh the master list
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during save.",
      );
    }
  };

  const handleDiscard = () => {
    const hasChanges = recurringVoucher.filter((rec) => rec.isNew);

    if (hasChanges) {
      setRecurringVoucher(data);
    }
  };

  return (
    <div className="space-y-2 mt-14 ml-4">
      {/* --- MASTER TABLE: Recurring Codes --- */}
      <MainContainer title="Recurring A/P Voucher Codes">
        <div className="flex justify-end p-2 gap-2">
          <ActionButton
            icon={Plus}
            label="Add New Code"
            onClick={handleAddMaster}
          />
          <ActionButton icon={X} label="Discard" onClick={handleDiscard} />
          <ActionButton icon={Trash2} label="Delete" onClick={handleDelete} />
          <ActionButton
            icon={Save}
            label="Save"
            onClick={handleSaveEverything}
          />
        </div>
        <div className="overflow-x-auto max-h-[30vh] border border-gray-300">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                <th className="th-thead w-12">
                  <input
                    type="checkbox"
                    className="accent-blue-500"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="th-thead text-left">
                  Recurring Code <span className="text-red-600">*</span>
                </th>
              </tr>
            </thead>
            <tbody className="tbody">
              {recurringVoucher.map((item) => {
                const itemId = item.tempId || item.voucherGroupCode;
                const isSelected =
                  // selectedCode?.tempId === item.tempId ||
                  selectedCode?.voucherGroupCode === item.voucherGroupCode;

                return (
                  <tr
                    key={itemId}
                    className={`tr-tbody${isSelected ? "bg-blue-50" : ""}`}
                  >
                    <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        className="accent-blue-500"
                        checked={selectedAvailableSet.has(itemId)}
                        onChange={() => {
                          // 1. Update the Set (Immutable update)
                          const newSet = new Set(selectedAvailableSet);
                          if (newSet.has(itemId)) {
                            newSet.delete(itemId);
                          } else {
                            newSet.add(itemId);
                          }
                          setSelectedAvailableSet(newSet);
                          setSelectedCode((prev) => {
                            if (
                              prev.voucherGroupCode === item.voucherGroupCode ||
                              prev.tempId === item.tempId
                            ) {
                              const selectedIds = Array.from(newSet);
                              if (selectedIds.length > 0) {
                                const lastId =
                                  selectedIds[selectedIds.length - 1];
                                return (
                                  recurringVoucher.find(
                                    (v) =>
                                      (v.tempId || v.voucherGroupCode) ===
                                      lastId,
                                  ) || {}
                                );
                              }
                              return {};
                            }
                            // If we are selecting a new item, make it the active code
                            return item;
                          });
                        }}
                        className="h-3 w-3 accent-blue-600"
                      />
                    </td>
                    <td className="tbody-td">
                      <div className="flex items-center gap-2">
                        {item.isNew ? (
                          <>
                            <input
                              className="td-input border border-blue-400 flex-1"
                              value={item.voucherGroupCode}
                              onChange={(e) =>
                                handleMasterInputChange(e.target.value, itemId)
                              }
                              placeholder="Type new code..."
                              autoFocus
                            />
                          </>
                        ) : (
                          <span>{item.voucherGroupCode}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </MainContainer>

      <div className="grid grid-cols-2 gap-2">
        {/* --- SOURCE TABLE: Available Periods --- */}
        <MainContainer title="Available Subperiods">
          <div className="flex justify-end p-1">
            <ActionDetailButton label="Select →" onClick={handleMoveToTarget} />
          </div>
          <div className="overflow-x-auto max-h-[40vh] border border-gray-300">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="th-thead w-12 text-center">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      onChange={toggleAllAvailable}
                      checked={
                        availablePeriods.length > 0 &&
                        selectedAvailableSet.size === availablePeriods.length
                      }
                    />
                  </th>
                  <th className="th-thead">FY</th>
                  <th className="th-thead">Prd</th>
                  <th className="th-thead">Prd End Date</th>
                  <th className="th-thead">Sub</th>
                  <th className="th-thead">Sub End Date</th>
                </tr>
              </thead>
              <tbody>
                {availablePeriods.map((item) => {
                  const id = `${item.fyCd}-${item.periodNo}-${item.subPeriodNo}`;
                  return (
                    <tr key={id} className="hover:bg-gray-50">
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={selectedAvailableSet.has(id)}
                          onChange={() => toggleAvailableSelection(item)}
                        />
                      </td>
                      <td className="tbody-td text-center">{item.fyCd}</td>
                      <td className="tbody-td text-center">{item.periodNo}</td>
                      <td className="tbody-td text-center">
                        {item.subPeriodEndDate}
                      </td>
                      <td className="tbody-td text-center">
                        {item.subPeriodNo}
                      </td>
                      <td className="tbody-td text-center">
                        {item.subPeriodEndDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </MainContainer>

        {/* --- TARGET TABLE: Selected Periods --- */}
        <MainContainer title="Selected Periods">
          <div className="flex justify-end p-1 gap-2">
            <ActionButton
              icon={X}
              label="Clear"
              onClick={handleClearDirtyPeriods}
            />
            <ActionButton
              icon={Trash2}
              label="Remove Period"
              onClick={handleRemoveSelectedPeriods}
            />
          </div>
          <div className="overflow-x-auto max-h-[40vh] border border-gray-300">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="th-thead w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={toggleAllTarget}
                      className="accent-blue-500"
                      checked={
                        targetPeriods.length > 0 &&
                        selectedPeriods.size === targetPeriods.length
                      }
                    />
                  </th>
                  <th className="th-thead">FY</th>
                  <th className="th-thead">Prd</th>
                  <th className="th-thead">Prd End Date</th>
                  <th className="th-thead">Sub</th>
                  <th className="th-thead">Sub End Date</th>
                </tr>
              </thead>
              <tbody>
                {targetPeriods.map((item, idx) => {
                  const id = `${item.fycd || item.fiscalYearCode}-${item.periodNo}-${item.subPeriodNo}`;
                  return (
                    <tr key={idx}>
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={selectedPeriods.has(id)}
                          onChange={() => togglePeriodSelected(item)}
                        />
                      </td>
                      <td className="tbody-td text-center">
                        {item.fyCd || item.fiscalYearCode}
                      </td>
                      <td className="tbody-td text-center">{item.periodNo}</td>
                      <td className="tbody-td text-center">
                        {item.subPeriodEndDate}
                      </td>
                      <td className="tbody-td text-center">
                        {item.subPeriodNo}
                      </td>
                      <td className="tbody-td text-center">
                        {item.subPeriodEndDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </MainContainer>
      </div>
    </div>
  );
};

export default ManageRecurringAPVoucherCodes;
