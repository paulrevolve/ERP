// // import React, { useEffect, useState, useRef } from "react";
// // import { backendUrl } from "./config";
// // import { toast } from "react-toastify";
// // import api from "../utils/api";
// // import { CalendarDays } from "lucide-react";
// // import { MainContainer, Toolbar } from "../helper/container";
// // import {
// //   FormSearchSelect,
// //   FormInput,
// //   FormSection,
// // } from "../helper/formSection";
// // import ReusableTable from "../helper/tableSection";

// // const ManageFiscalYear = ({ canEdit }) => {
// //   // --- Data States ---
// //   const [fycd, setFycd] = useState([]);
// //   const [selectedFycdRow, setSelectedFycdRow] = useState(null);
// //   const [filteredGroups, setFilteredGroups] = useState([]);
// //   const [isFormView, setIsFormView] = useState(true);
// //   const [loading, setLoading] = useState(false);
// //   const [selectedRows, setSelectedRows] = useState([]);
// //   // --- UI & Find/Replace States ---
// //   const [searchTermProfiles, setSearchTermProfiles] = useState("");
// //   const [clipboard, setClipboard] = useState([]);
// //   const [searchColumn, setSearchColumn] = useState("fyCd");
// //   const [searchValue, setSearchValue] = useState("");
// //   const [replaceValue, setReplaceValue] = useState("");
// //   const [isReplaceMode, setIsReplaceMode] = useState(false);

// //   const [showSubModal, setShowSubModal] = useState(false);
// //   const [subValue, setSubValue] = useState(1);

// //   const isInitialized = useRef(false);

// //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

// //   // --- Dropdown Options ---
// //   const statusOpt = [
// //     { statusCd: " ", name: "Select" },
// //     { statusCd: "O", name: "Open" },
// //     { statusCd: "C", name: "Closed" },
// //   ];

// //   const rateOpt = [
// //     { closeActTgtCd: "", name: "None" },
// //     { closeActTgtCd: "A", name: "Actual Rates" },
// //     { closeActTgtCd: "T", name: "Target Rates" },
// //   ];

// //   // --- Table Column Definitions ---
// //   const myColumns = [
// //     {
// //       label: "Fiscal Year",
// //       key: "fyCd",
// //       required: true,
// //       readOnlyIfExisting: true,
// //     },
// //     { label: "Description", key: "fyDesc", required: true },
// //     {
// //       label: "Status",
// //       key: "statusName",
// //       type: "search-select",
// //       options: statusOpt,
// //       displayKey: "name",
// //       onSelect: (opt, id) => {
// //         handleFieldChange(id, "statusCd", opt.statusCd);
// //         handleFieldChange(id, "statusName", opt.name);
// //       },
// //     },
// //     {
// //       label: "Rate Type",
// //       key: "rateName",
// //       type: "search-select",
// //       options: rateOpt,
// //       displayKey: "name",
// //       onSelect: (opt, id) => {
// //         handleFieldChange(id, "closeActTgtCd", opt.closeActTgtCd);
// //         handleFieldChange(id, "rateName", opt.name);
// //       },
// //     },
// //   ];

// //   const toolbarColumns = [
// //     { label: "Fiscal Year", value: "fyCd" },
// //     { label: "Description", value: "fyDesc" },
// //     { label: "Status", value: "statusName" },
// //     { label: "Rate Type", value: "rateName" },
// //   ];

// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await api.get(`${backendUrl}/api/FiscalYear`);
// //       const rawData = res.data || [];

// //       // 1. Map codes to names immediately so the Table and Form can render them
// //       const enrichedData = rawData.map((item) => ({
// //         ...item,
// //         statusName:
// //           statusOpt.find((o) => o.statusCd === item.statusCd)?.name || "",
// //         rateName:
// //           rateOpt.find((o) => o.closeActTgtCd === item.closeActTgtCd)?.name ||
// //           "",
// //       }));

// //       setFycd((prev) => {
// //         // Keep only local unsaved rows (those with tempId)
// //         const localNewRows = prev.filter((row) => row.tempId);

// //         // Combine local rows with the newly enriched server data
// //         const combined = [...localNewRows, ...enrichedData];

// //         // Update selected row if none is currently active
// //         if (!selectedFycdRow && combined.length > 0) {
// //           setSelectedFycdRow(combined[0]);
// //         }
// //         return combined;
// //       });
// //     } catch (e) {
// //       console.error("Fetch error", e);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   //   const fetchData = async () => {
// //   //     setLoading(true);
// //   //     try {
// //   //       const res = await api.get(`${backendUrl}/api/FiscalYear`);
// //   //       const data = res.data || [];

// //   //       setFycd((prev) => {
// //   //         // Keep only the rows that haven't been saved yet (tempId)
// //   //         const localNewRows = prev.filter((row) => row.tempId);
// //   //         // Merge with fresh data from server
// //   //         const combined = [...localNewRows, ...data];

// //   //         // Update selected row if none is active
// //   //         if (!selectedFycdRow && combined.length > 0) {
// //   //           setSelectedFycdRow(combined[0]);
// //   //         }
// //   //         return combined;
// //   //       });
// //   //     } catch (e) {
// //   //       console.error("Fetch error", e);
// //   //     } finally {
// //   //       setLoading(false);
// //   //     }
// //   //   };

// //   // Helper function for stable row key (MUST be before useEffect that uses it)
// //   const getRowKey = (row) => row?.tempId || row?.fyCd || "";

// //   useEffect(() => {
// //     const initialize = async () => {
// //       // 1. Set the initial blank row ONLY if it's the first time
// //       //   if (!isInitialized.current) {
// //       //     isInitialized.current = true;
// //       //     const newId = `temp-${Date.now()}`;
// //       //     const newRow = {
// //       //       tempId: newId,
// //       //       ...initialFormState,
// //       //       companyId: "1",
// //       //       isDirty: false,
// //       //     };
// //       //     setFycd([newRow]);
// //       //     setSelectedFycdRow(newRow);
// //       //     setSelectedRows([newRow]);
// //       //   }

// //       // 2. Fetch the data from backend
// //       await fetchData();
// //     };

// //     initialize();
// //   }, []); // Empty dependency array

// //   const handleFieldChange = (id, field, value) => {
// //     let finalValue = value;

// //     // Validation for Fiscal Year Code
// //     if (field === "fyCd" && /\s/.test(value)) {
// //       toast.warn("No spacing allowed in Fiscal Year Code");
// //       finalValue = value.replace(/\s+/g, "");
// //     }

// //     setFycd((prev) =>
// //       prev.map((row) => {
// //         if (getRowKey(row) === id) {
// //           const updatedRow = { ...row, [field]: finalValue, isDirty: true };

// //           // 1. Update the Form View state if this is the active row
// //           if (getRowKey(selectedFycdRow || {}) === id) {
// //             setSelectedFycdRow(updatedRow);
// //           }

// //           // 2. Update the SelectedRows array (essential for Table checkboxes/state)
// //           setSelectedRows((prevSelected) =>
// //             prevSelected.map((sRow) =>
// //               getRowKey(sRow) === id ? updatedRow : sRow,
// //             ),
// //           );

// //           return updatedRow;
// //         }
// //         return row;
// //       }),
// //     );
// //   };

// //   // --- Find & Replace Logic ---
// //   // --- Find & Replace Logic ---
// //   const handleFind = () => {
// //     if (!searchValue) {
// //       setFilteredGroups([]);
// //       return;
// //     }
// //     const results = fycd.filter((g) =>
// //       String(g[searchColumn] || "")
// //         .toLowerCase()
// //         .includes(searchValue.toLowerCase()),
// //     );

// //     if (results.length > 0) {
// //       setFilteredGroups(results);
// //       setSelectedFycdRow(results[0]);
// //       toast.success(`Found ${results.length} matches`);
// //     } else {
// //       toast.error("No matching records found");
// //       setFilteredGroups([]);
// //     }
// //   };

// //   const handleBulkReplace = () => {
// //     if (!searchValue) return toast.warn("Enter value to find");

// //     // 1. Block replacement for the unique Fiscal Year Code
// //     if (searchColumn === "fyCd") {
// //       return toast.error(
// //         "Fiscal Year Code is a unique identifier and cannot be bulk replaced.",
// //       );
// //     }

// //     const updatedData = fycd.map((item) => {
// //       // Check if the current value matches the search term
// //       const currentValue = String(item[searchColumn] || "").toLowerCase();
// //       if (currentValue === searchValue.toLowerCase()) {
// //         const newItem = {
// //           ...item,
// //           [searchColumn]: replaceValue,
// //           isDirty: true,
// //         };

// //         // 2. Sync Codes if the user is replacing "Names" (Status or Rate Type)
// //         if (searchColumn === "statusName") {
// //           const match = statusOpt.find(
// //             (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
// //           );
// //           if (match) newItem.statusCd = match.statusCd;
// //         }

// //         if (searchColumn === "rateName") {
// //           const match = rateOpt.find(
// //             (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
// //           );
// //           if (match) newItem.closeActTgtCd = match.closeActTgtCd;
// //         }

// //         return newItem;
// //       }
// //       return item;
// //     });

// //     setFycd(updatedData);
// //     // If we were filtering, update the filtered view too
// //     if (filteredGroups.length > 0) {
// //       handleFind();
// //     }

// //     toast.success("Replacements applied successfully.");
// //     setIsReplaceMode(false);
// //   };

// //   // --- Action Handlers ---
// //   const handleAddFyCd = () => {
// //     const newRow = {
// //       tempId: `TEMP_${Date.now()}`,
// //       fyCd: "",
// //       fyDesc: "",
// //       statusCd: "",
// //       statusName: "",
// //       closeActTgtCd: "",
// //       rateName: "",
// //       isDirty: true,
// //     };
// //     setFycd([newRow, ...fycd]);
// //     setSelectedFycdRow(newRow);
// //   };

// //   const handleDelete = async () => {
// //     if (selectedRows.length === 0) {
// //       return toast.warn("Select at least one record to delete.");
// //     }

// //     const confirmMessage =
// //       selectedRows.length === 1
// //         ? `Delete Fiscal Year: ${selectedRows[0].fyCd || "New Record"}?`
// //         : `Are you sure you want to delete ${selectedRows.length} selected records?`;

// //     if (!window.confirm(confirmMessage)) return;

// //     setLoading(true);
// //     try {
// //       await Promise.all(
// //         selectedRows.map((row) => {
// //           // If it DOES NOT have a tempId, it exists in the Database
// //           if (!row.tempId) {
// //             const companyId = row.companyId || "";
// //             // Use fyCd or the actual primary key field your backend expects
// //             return api.delete(
// //               `${backendUrl}/api/FiscalYear/${row.fyCd}?CompanyId=${companyId}`,
// //             );
// //           }
// //           // If it's just a local new row (tempId), just resolve
// //           return Promise.resolve();
// //         }),
// //       );

// //       // Update local state: remove deleted rows from the main list
// //       const deletedIdentifiers = selectedRows.map((r) => getRowKey(r));
// //       const updatedList = fycd.filter(
// //         (f) => !deletedIdentifiers.includes(getRowKey(f)),
// //       );

// //       setFycd(updatedList);
// //       setSelectedRows([]); // Clear table selection
// //       setSelectedFycdRow(updatedList[0] || null); // Reset form view

// //       // If we deleted everything, trigger a new blank form
// //       if (updatedList.length === 0) {
// //         handleAddFyCd();
// //       }

// //       toast.success("Deleted successfully");
// //     } catch (e) {
// //       console.error("Delete Error:", e);
// //       toast.error(e.response?.data?.message || "Delete failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleCopy = () => {
// //     if (selectedRows.length === 0)
// //       return toast.warn("Select at least one record to copy.");
// //     // Copy all selected rows, not just the active one
// //     setClipboard([...selectedRows]);
// //     toast.success(`${selectedRows.length} record(s) copied to clipboard`);
// //   };

// //   const handlePaste = () => {
// //     if (!clipboard.length) return toast.warn("Clipboard is empty.");

// //     const pasted = clipboard.map((row, i) => {
// //       // 1. Remove database-specific IDs and existing primary keys
// //       const { tempId, id, fyCd, ...restProps } = row;

// //       return {
// //         ...restProps, // Keeps statusName, rateName, fyDesc, etc.
// //         fyCd: "", // User must provide a new unique Fiscal Year code
// //         tempId: `PASTE_${Date.now()}_${i}`,
// //         isDirty: true,
// //       };
// //     });

// //     // 2. Add to the top of the list
// //     setFycd((prev) => [...pasted, ...prev]);

// //     // 3. Focus on the first pasted item
// //     setSelectedFycdRow(pasted[0]);
// //     setSelectedRows([pasted[0]]);
// //     // setIsFormView(true);

// //     toast.success(
// //       `${pasted.length} record(s) pasted. Please enter new Fiscal Year codes.`,
// //     );
// //   };

// //   const handleClear = () => {
// //     // 1. Identify if there are any temporary "NEW" rows or unsaved edits
// //     const hasNewRows = fycd.some((f) => !!f.tempId);
// //     const hasEdits = fycd.some((f) => f.isDirty === true);

// //     // If nothing has changed, just exit
// //     if (!hasNewRows && !hasEdits) return;

// //     // 2. Confirm with the user
// //     if (window.confirm("Discard unsaved changes and new rows?")) {
// //       // 3. Remove all temporary 'NEW' rows locally first
// //       // (This prevents a flash of empty rows before the fetch completes)
// //       setFycd((prev) => prev.filter((f) => !f.tempId));

// //       // 4. Re-fetch the original data from the database to overwrite local edits
// //       fetchData();

// //       // 5. Reset selection states
// //       setFilteredGroups([]);
// //       setSelectedRows([]); // Clear checkboxes in Table view

// //       // We don't set selectedFycdRow to null here because
// //       // fetchData() already has logic to select combined[0]

// //       toast.info("Unsaved changes and new rows have been discarded.");
// //     }
// //   };

// //   //   const handleMasterSave = async () => {
// //   //     // Identify rows that are brand new (tempId) OR existing rows that were edited (isDirty)
// //   //     const changedRows = fycd.filter((f) => f.isDirty || f.tempId);

// //   //     if (changedRows.length === 0) {
// //   //       return toast.warn("No changes to save");
// //   //     }

// //   //     setLoading(true);
// //   //     try {
// //   //       // We use Promise.all to send requests in parallel for better performance
// //   //       await Promise.all(
// //   //         changedRows.map((row) => {
// //   //           const payload = {
// //   //             fyCd: row.fyCd,
// //   //             fyDesc: row.fyDesc,
// //   //             statusCd: row.statusCd,
// //   //             closeActTgtCd: row.closeActTgtCd,
// //   //             companyId: String(row.companyId) || "1",
// //   //             modifiedBy: user.name,
// //   //             // Add any other required fields for your API here
// //   //           };

// //   //           if (row.tempId) {
// //   //             // --- CASE 1: POST (New Record) ---
// //   //             return api.post(`${backendUrl}/api/FiscalYear`, payload);
// //   //           } else {
// //   //             // --- CASE 2: PUT (Existing Record) ---
// //   //             // Assuming 'id' is your database primary key
// //   //             return api.put(`${backendUrl}/api/FiscalYear/${row.fyCd}`, payload);
// //   //           }
// //   //         }),
// //   //       );

// //   //       toast.success("All changes saved successfully");
// //   //       fetchData(); // Refresh data to clear tempIds and reset isDirty flags
// //   //     } catch (e) {
// //   //       console.error("Save Error:", e);
// //   //       toast.error(
// //   //         e.response?.data?.message ||
// //   //           "Save failed. Please check required fields.",
// //   //       );
// //   //     } finally {
// //   //       setLoading(false);
// //   //     }
// //   //   };

// //   // --- View & Navigation ---

// //   const handleMasterSave = async (confirmedSubPeriod = null) => {
// //     const changedRows = fycd.filter((f) => f.isDirty || f.tempId);

// //     if (changedRows.length === 0) {
// //       return toast.warn("No changes to save");
// //     }

// //     setLoading(true);
// //     try {
// //       await Promise.all(
// //         changedRows.map((row) => {
// //           // Derive fyCd from startDate for new records (e.g., "2026-01-01" -> "2026")
// //           let finalFyCd = row.fyCd;
// //           if (row.tempId && row.startDate) {
// //             finalFyCd = row.startDate.split("-")[0];
// //           }

// //           const payload = {
// //             fyCd: finalFyCd,
// //             companyId: String(row.companyId || "1"),
// //             statusCd: row.statusCd || "O",
// //             fyDesc: row.fyDesc || `Fiscal Year ${finalFyCd}`,
// //             modifiedBy: user.name || "Admin",
// //             closeActTgtCd: row.closeActTgtCd || "",
// //             totalPeriods: Number(row.totalPeriods) || 12,
// //             startDate: row.startDate || new Date().toISOString().split("T")[0],
// //             // Logic: If new, take from modal. If update, take from row state.
// //             subPeriodsPerPeriod: row.tempId
// //               ? Number(confirmedSubPeriod || 1)
// //               : Number(row.subPeriodsPerPeriod || 0),
// //           };

// //           if (row.tempId) {
// //             return api.post(`${backendUrl}/api/FiscalYear`, payload);
// //           } else {
// //             return api.put(`${backendUrl}/api/FiscalYear/${row.fyCd}`, payload);
// //           }
// //         }),
// //       );

// //       toast.success("Changes saved successfully");
// //       setShowSubModal(false); // Close modal on success
// //       fetchData(); // Refresh list
// //     } catch (e) {
// //       console.error("Save Error:", e);
// //       toast.error(e.response?.data?.message || "Save failed.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const currentIndex = fycd.findIndex(
// //     (f) => getRowKey(f) === getRowKey(selectedFycdRow || {}),
// //   );

// //   const handleNavigate = (dir) => {
// //     const newIdx = dir === "next" ? currentIndex + 1 : currentIndex - 1;
// //     if (newIdx >= 0 && newIdx < fycd.length) {
// //       setSelectedFycdRow(fycd[newIdx]);
// //     }
// //   };

// //   // --- Multi-Select Table Logic ---
// //   const handleRowSelection = (row) => {
// //     const rowId = getRowKey(row);
// //     const isSelected = selectedRows.some((r) => getRowKey(r) === rowId);

// //     if (isSelected) {
// //       setSelectedRows(selectedRows.filter((r) => getRowKey(r) !== rowId));
// //     } else {
// //       setSelectedRows([...selectedRows, row]);
// //       setSelectedFycdRow(row); // Clicking a row makes it the active form record
// //     }
// //   };

// //   const handleSelectAll = () => {
// //     const dataToSelect = filteredGroups.length > 0 ? filteredGroups : fycd;
// //     if (selectedRows.length === dataToSelect.length) {
// //       setSelectedRows([]);
// //     } else {
// //       setSelectedRows([...dataToSelect]);
// //     }
// //   };

// //   return (
// //     <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
// //       <MainContainer icon={CalendarDays} title="Manage Fiscal Year">
// //         <Toolbar
// //           clipboard={clipboard}
// //           rowKey={"fyCd"}
// //           isFormView={isFormView}
// //           isReplaceMode={isReplaceMode}
// //           setIsReplaceMode={setIsReplaceMode}
// //           columns={toolbarColumns}
// //           searchColumn={searchColumn}
// //           setSearchColumn={setSearchColumn}
// //           searchValue={searchValue}
// //           setSearchValue={setSearchValue}
// //           replaceValue={replaceValue}
// //           setReplaceValue={setReplaceValue}
// //           handleFind={handleFind}
// //           handleBulkReplace={handleBulkReplace}
// //           currentIndex={currentIndex}
// //           totalRecords={fycd.length}
// //           handleNavigate={handleNavigate}
// //           actions={{
// //             onAdd: handleAddFyCd,
// //             // onSave: handleMasterSave,
// //             onSave: () => {
// //               const hasNewRows = fycd.some((r) => r.tempId);
// //               if (hasNewRows) {
// //                 setShowSubModal(true); // Open modal first for new records
// //               } else {
// //                 handleMasterSave(); // Directly save if only updates
// //               }
// //             },
// //             onToggleView: () => setIsFormView(!isFormView),
// //             onDelete: handleDelete,
// //             onCopy: handleCopy,
// //             onPaste: handlePaste,
// //             onClear: handleClear,
// //           }}
// //           selectedRow={selectedRows.length >= 0 ? selectedRows[0] : []}
// //           isDirty={fycd.some((f) => f.isDirty)}
// //           loading={loading}
// //         />

// //         {isFormView ? (
// //           <div className="space-y-1 p-1 py-2">
// //             {selectedRows.length > 0 && (
// //               <div className="mb-2 text-sm text-gray-600">
// //                 {selectedRows.length} row(s) selected
// //               </div>
// //             )}
// //             <FormSection>
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
// //                 <FormInput
// //                   label="Fiscal Year"
// //                   required
// //                   value={selectedFycdRow?.fyCd || ""}
// //                   readOnly={!!selectedFycdRow?.id && !selectedFycdRow?.tempId}
// //                   onChange={(e) =>
// //                     handleFieldChange(
// //                       getRowKey(selectedFycdRow || {}),
// //                       "fyCd",
// //                       e.target.value,
// //                     )
// //                   }
// //                 />
// //                 <FormInput
// //                   label="Description"
// //                   required
// //                   value={selectedFycdRow?.fyDesc || ""}
// //                   onChange={(e) =>
// //                     handleFieldChange(
// //                       getRowKey(selectedFycdRow || {}),
// //                       "fyDesc",
// //                       e.target.value,
// //                     )
// //                   }
// //                 />
// //               </div>
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// //                 <FormSearchSelect
// //                   label="Status"
// //                   value={
// //                     selectedFycdRow?.statusName ||
// //                     selectedFycdRow?.statusCd ||
// //                     ""
// //                   }
// //                   searchTerm={searchTermProfiles}
// //                   setSearchTerm={setSearchTermProfiles}
// //                   options={statusOpt.filter((o) =>
// //                     o.name
// //                       .toLowerCase()
// //                       .includes(searchTermProfiles.toLowerCase()),
// //                   )}
// //                   displayKey="name"
// //                   onSelect={(p) => {
// //                     const id = getRowKey(selectedFycdRow || {});
// //                     handleFieldChange(id, "statusCd", p.statusCd);
// //                     handleFieldChange(id, "statusName", p.name);
// //                   }}
// //                 />
// //                 <FormSearchSelect
// //                   label="Rate Type"
// //                   value={
// //                     selectedFycdRow?.rateName ||
// //                     selectedFycdRow?.closeActTgtCd ||
// //                     ""
// //                   }
// //                   searchTerm={searchTermProfiles}
// //                   setSearchTerm={setSearchTermProfiles}
// //                   options={rateOpt.filter((o) =>
// //                     o.name
// //                       .toLowerCase()
// //                       .includes(searchTermProfiles.toLowerCase()),
// //                   )}
// //                   displayKey="name"
// //                   onSelect={(p) => {
// //                     const id = getRowKey(selectedFycdRow || {});
// //                     handleFieldChange(id, "closeActTgtCd", p.closeActTgtCd);
// //                     handleFieldChange(id, "rateName", p.name);
// //                   }}
// //                 />
// //               </div>
// //             </FormSection>
// //           </div>
// //         ) : (
// //           <ReusableTable
// //             data={filteredGroups.length > 0 ? filteredGroups : fycd}
// //             columns={myColumns}
// //             // rowKey={(row) => getRowKey(row)}
// //             rowKey={selectedFycdRow?.tempId ? "tempId" : "fyCd"}
// //             showCheckboxes={true}
// //             selectedRows={selectedRows} // Now an array
// //             onRowSelect={handleRowSelection}
// //             onSelectAll={handleSelectAll} // Added Select All feature
// //             onFieldChange={handleFieldChange}
// //             maxHeight="max-h-[500px]"
// //           />
// //         )}
// //       </MainContainer>
// //       {/* MODAL IS NOW INSIDE THE MAIN DIV */}
// //       {showSubModal && (
// //         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
// //           <div className="bg-white rounded-lg shadow-xl p-6 w-72 border-t-4 border-blue-600">
// //             <h3 className="text-sm font-bold text-gray-800 mb-1">
// //               New Fiscal Year Setup
// //             </h3>
// //             <p className="text-[10px] text-gray-500 mb-4">
// //               Define sub-periods per period (1-31) for initialization.
// //             </p>

// //             <div className="mb-4">
// //               <label className="text-[10px] font-bold text-gray-600 block mb-1">
// //                 Sub-Periods
// //               </label>
// //               <input
// //                 type="number"
// //                 className="w-full border border-gray-300 rounded p-2 text-center text-sm focus:border-blue-500 outline-none"
// //                 value={subValue}
// //                 onChange={(e) => {
// //                   let val = parseInt(e.target.value);
// //                   if (val > 31) val = 31;
// //                   if (val < 1 || isNaN(val)) val = 1;
// //                   setSubValue(val);
// //                 }}
// //               />
// //             </div>

// //             <div className="flex gap-2">
// //               <button
// //                 className="flex-1 py-2 text-xs font-semibold text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
// //                 onClick={() => setShowSubModal(false)}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
// //                 onClick={() => handleMasterSave(subValue)}
// //               >
// //                 Save Now
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// //   //     </div>
// //   //   );
// // };

// // export default ManageFiscalYear;

// import React, { useEffect, useState, useRef } from "react";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";
// import api from "../utils/api";
// import { CalendarDays } from "lucide-react";
// import { MainContainer, Toolbar } from "../helper/container";
// import {
//   FormSearchSelect,
//   FormInput,
//   FormSection,
// } from "../helper/formSection";
// import ReusableTable from "../helper/tableSection";

// const ManageFiscalYear = ({ canEdit }) => {
//   // --- Data States ---
//   const [fycd, setFycd] = useState([]);
//   const [selectedFycdRow, setSelectedFycdRow] = useState([null]);
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const [isFormView, setIsFormView] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   // --- UI & Find/Replace States ---
//   const [searchTermProfiles, setSearchTermProfiles] = useState("");
//   const [clipboard, setClipboard] = useState([]);
//   const [searchColumn, setSearchColumn] = useState("fyCd");
//   const [searchValue, setSearchValue] = useState("");
//   const [replaceValue, setReplaceValue] = useState("");
//   const [isReplaceMode, setIsReplaceMode] = useState(false);

//   const [showSubModal, setShowSubModal] = useState(false);
//   const [subValue, setSubValue] = useState();
//   const isInitialized = useRef(false);

//   const [isMapping, setIsMapping] = useState(false);

//   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

//   // --- Dropdown Options ---
//   const statusOpt = [
//     { statusCd: " ", name: "Select" },
//     { statusCd: "O", name: "Open" },
//     { statusCd: "C", name: "Closed" },
//   ];

//   const rateOpt = [
//     { closeActTgtCd: "", name: "None" },
//     { closeActTgtCd: "A", name: "Actual Rates" },
//     { closeActTgtCd: "T", name: "Target Rates" },
//   ];

//   // --- Table Column Definitions ---
//   const myColumns = [
//     {
//       label: "Fiscal Year",
//       key: "fyCd",
//       required: true,
//       readOnlyIfExisting: true,
//     },
//     { label: "Description", key: "fyDesc", required: true },
//     {
//       label: "Status",
//       key: "statusName",
//       type: "search-select",
//       options: statusOpt,
//       displayKey: "name",
//       onSelect: (opt, id) => {
//         handleFieldChange(id, "statusCd", opt.statusCd);
//         handleFieldChange(id, "statusName", opt.name);
//       },
//     },
//     {
//       label: "Rate Type",
//       key: "rateName",
//       type: "search-select",
//       options: rateOpt,
//       displayKey: "name",
//       onSelect: (opt, id) => {
//         handleFieldChange(id, "closeActTgtCd", opt.closeActTgtCd);
//         handleFieldChange(id, "rateName", opt.name);
//       },
//     },
//   ];

//   const FY_MASTER_COLUMNS = [
//     { id: "fyCd", label: "Fiscal Year", type: "year", allowReplace: false },
//     { id: "fyDesc", label: "Description", type: "text", allowReplace: true },
//     {
//       id: "statusCd", // We target the CD but display the Name
//       label: "Status",
//       type: "select",
//       allowReplace: true,
//       options: statusOpt.map((s) => ({ value: s.statusCd, label: s.name })),
//     },
//     {
//       id: "closeActTgtCd", // We target the CD but display the Name
//       label: "Rate Type",
//       type: "select",
//       allowReplace: true,
//       options: rateOpt.map((r) => ({ value: r.closeActTgtCd, label: r.name })),
//     },
//   ];

//   const handleFindReplace = (config, isReplaceMode) => {
//     const {
//       column,
//       findValue = "",
//       findYear = "",
//       replaceValue = "", // This will be the statusCd or closeActTgtCd
//       replaceYear = "",
//     } = config;

//     if (!column) return toast.warn("Please select a column first.");

//     console.log(config);

//     // --- FIND LOGIC ---
//     if (!isReplaceMode) {
//       setIsMapping(true);
//       const targetFind = column === "fyCd" ? findYear : findYear;
//       if (!targetFind) return toast.warn("Please enter a value to find.");

//       const foundIndex = fycd.findIndex((item) => {
//         const currentValue = String(item[column] || "").toLowerCase();
//         const search = String(targetFind).toLowerCase();
//         return column === "fyCd"
//           ? currentValue === search
//           : currentValue.includes(search);
//       });

//       // if (foundIndex !== -1) {
//       //   const foundRecord = fycd[foundIndex];
//       //   setSelectedRows(foundRecord);
//       //   // setCurrentIndex(foundIndex);
//       //   setSelectedRows(new Set([foundRecord.tempId || foundRecord.orgId]));
//       //   toast.info(`Found match at row ${foundIndex + 1}`);
//       // }
//       if (foundIndex !== -1) {
//         const foundRecord = fycd[foundIndex];
//         setSelectedFycdRow(foundRecord); // Active form record
//         // FIX: Ensure this is an array containing the record
//         setSelectedRows([foundRecord]);
//         setFilteredGroups([foundRecord]);
//         toast.info(`Found match at row ${foundIndex + 1}`);
//       } else {
//         toast.error(`Value not found.`);
//       }
//       return;
//     }

//     // --- REPLACE LOGIC ---

//     // Safety: If Find is empty, confirm global replacement
//     const isFindEmpty = column === "fyCd" ? !findYear : !findValue;
//     if (isFindEmpty) {
//       const proceed = window.confirm(
//         "Find field is empty. This will replace EVERY record. Continue?",
//       );
//       if (!proceed) return;
//     }

//     if (!window.confirm("Apply bulk changes?")) return;

//     setFycd((prevData) => {
//       let changeCount = 0;

//       // PRE-LOOKUP: Get the name for the code we are about to apply
//       let syncName = "";
//       if (column === "statusCd") {
//         syncName =
//           statusOpt.find((s) => String(s.statusCd) === String(replaceValue))
//             ?.name || "";
//       } else if (column === "closeActTgtCd") {
//         syncName =
//           rateOpt.find((r) => String(r.closeActTgtCd) === String(replaceValue))
//             ?.name || "";
//       }

//       const updatedData = prevData.map((item) => {
//         const currentValue = String(item[column] || "").toLowerCase();
//         const searchString = String(
//           column === "fyCd" ? findYear : findValue,
//         ).toLowerCase();

//         // If find is empty or matches the value
//         if (searchString === "" || currentValue.includes(searchString)) {
//           changeCount++;
//           let updatedItem = { ...item, isDirty: true };

//           // Handle logical branching for sync
//           if (column === "statusCd") {
//             updatedItem.statusCd = replaceValue;
//             updatedItem.statusName = syncName; // Auto-sync Name
//           } else if (column === "closeActTgtCd") {
//             updatedItem.closeActTgtCd = replaceValue;
//             updatedItem.rateName = syncName; // Auto-sync Name
//           } else if (column === "fyCd") {
//             updatedItem.fyCd = replaceYear;
//           } else {
//             updatedItem[column] = replaceValue;
//           }

//           return updatedItem;
//         }
//         return item;
//       });

//       if (changeCount > 0) {
//         toast.success(`Updated ${changeCount} records.`);
//       } else {
//         toast.info("No matches found.");
//       }
//       return updatedData;
//     });
//   };

//   const toolbarColumns = [
//     { label: "Fiscal Year", value: "fyCd" },
//     { label: "Description", value: "fyDesc" },
//     { label: "Status", value: "statusName" },
//     { label: "Rate Type", value: "rateName" },
//   ];

//   const fetchData = async (isReset = false) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`${backendUrl}/api/FiscalYear`);
//       const rawData = res.data || [];

//       // 1. Map codes to names immediately so the Table and Form can render them
//       const enrichedData = rawData.map((item) => ({
//         ...item,
//         statusName:
//           statusOpt.find((o) => o.statusCd === item.statusCd)?.name || "",
//         rateName:
//           rateOpt.find((o) => o.closeActTgtCd === item.closeActTgtCd)?.name ||
//           "",
//       }));

//       setFycd((prev) => {
//         // Keep only local unsaved rows (those with tempId)
//         const localNewRows = prev.filter((row) => row.tempId);

//         // Combine local rows with the newly enriched server data
//         const combined = [...enrichedData];

//         // Update selected row if none is currently active
//         // if (!selectedFycdRow && combined.length > 0) {
//         //   setSelectedFycdRow(combined[0]);
//         // }
//         if (combined.length > 0) {
//           setSelectedFycdRow(combined[0]);
//           setSelectedRows([combined[0]]);
//           return combined;

//           // Optionally: setSelectedRows([combined[0]]);
//         } else {
//           return [];
//         }
//       });

//       if (enrichedData.length === 0) {
//         handleAddFyCd();
//       }
//     } catch (e) {
//       console.error("Fetch error", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //   const fetchData = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const res = await api.get(`${backendUrl}/api/FiscalYear`);
//   //       const data = res.data || [];

//   //       setFycd((prev) => {
//   //         // Keep only the rows that haven't been saved yet (tempId)
//   //         const localNewRows = prev.filter((row) => row.tempId);
//   //         // Merge with fresh data from server
//   //         const combined = [...localNewRows, ...data];

//   //         // Update selected row if none is active
//   //         if (!selectedFycdRow && combined.length > 0) {
//   //           setSelectedFycdRow(combined[0]);
//   //         }
//   //         return combined;
//   //       });
//   //     } catch (e) {
//   //       console.error("Fetch error", e);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   // Helper function for stable row key (MUST be before useEffect that uses it)
//   const getRowKey = (row) => row?.tempId || row?.fyCd || "";

//   useEffect(() => {
//     const initialize = async () => {
//       // 1. Set the initial blank row ONLY if it's the first time
//       //   if (!isInitialized.current) {
//       //     isInitialized.current = true;
//       //     const newId = `temp-${Date.now()}`;
//       //     const newRow = {
//       //       tempId: newId,
//       //       ...initialFormState,
//       //       companyId: "1",
//       //       isDirty: false,
//       //     };
//       //     setFycd([newRow]);
//       //     setSelectedFycdRow(newRow);
//       //     setSelectedRows([newRow]);
//       //   }

//       // 2. Fetch the data from backend
//       await fetchData();
//     };

//     initialize();
//   }, []); // Empty dependency array

//   const handleFieldChange = (id, field, value) => {
//     let finalValue = value;

//     // Validation for Fiscal Year Code
//     if (field === "fyCd" && /\s/.test(value)) {
//       toast.warn("No spacing allowed in Fiscal Year Code");
//       finalValue = value.replace(/\s+/g, "");
//     }

//     setFycd((prev) =>
//       prev.map((row) => {
//         if (getRowKey(row) === id) {
//           const updatedRow = { ...row, [field]: finalValue, isDirty: true };

//           if (field === "fyCd") {
//             // Check if value is a valid 4-digit year (e.g., 2026)
//             if (/^\d{4}$/.test(finalValue)) {
//               updatedRow.startDate = `${finalValue}-01-01`;
//             }
//           }

//           // 1. Update the Form View state if this is the active row
//           if (getRowKey(selectedFycdRow || {}) === id) {
//             setSelectedFycdRow(updatedRow);
//           }

//           // 2. Update the SelectedRows array (essential for Table checkboxes/state)
//           setSelectedRows((prevSelected) =>
//             prevSelected.map((sRow) =>
//               getRowKey(sRow) === id ? updatedRow : sRow,
//             ),
//           );

//           return updatedRow;
//         }
//         return row;
//       }),
//     );
//   };

//   // --- Find & Replace Logic ---
//   // --- Find & Replace Logic ---
//   const handleFind = () => {
//     if (!searchValue) {
//       setFilteredGroups([]);
//       return;
//     }
//     const results = fycd.filter((g) =>
//       String(g[searchColumn] || "")
//         .toLowerCase()
//         .includes(searchValue.toLowerCase()),
//     );

//     if (results.length > 0) {
//       setFilteredGroups(results);
//       setSelectedFycdRow(results[0]);
//       toast.success(`Found ${results.length} matches`);
//     } else {
//       toast.error("No matching records found");
//       setFilteredGroups([]);
//     }
//   };

//   const handleBulkReplace = () => {
//     if (!searchValue) return toast.warn("Enter value to find");

//     // 1. Block replacement for the unique Fiscal Year Code
//     if (searchColumn === "fyCd") {
//       return toast.error(
//         "Fiscal Year Code is a unique identifier and cannot be bulk replaced.",
//       );
//     }

//     const updatedData = fycd.map((item) => {
//       // Check if the current value matches the search term
//       const currentValue = String(item[searchColumn] || "").toLowerCase();
//       if (currentValue === searchValue.toLowerCase()) {
//         const newItem = {
//           ...item,
//           [searchColumn]: replaceValue,
//           isDirty: true,
//         };

//         // 2. Sync Codes if the user is replacing "Names" (Status or Rate Type)
//         if (searchColumn === "statusName") {
//           const match = statusOpt.find(
//             (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
//           );
//           if (match) newItem.statusCd = match.statusCd;
//         }

//         if (searchColumn === "rateName") {
//           const match = rateOpt.find(
//             (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
//           );
//           if (match) newItem.closeActTgtCd = match.closeActTgtCd;
//         }

//         return newItem;
//       }
//       return item;
//     });

//     setFycd(updatedData);
//     // If we were filtering, update the filtered view too
//     if (filteredGroups.length > 0) {
//       handleFind();
//     }

//     toast.success("Replacements applied successfully.");
//     setIsReplaceMode(false);
//   };

//   // --- Action Handlers ---
//   // const handleAddFyCd = () => {
//   //   const newRow = {
//   //     tempId: `TEMP_${Date.now()}`,
//   //     fyCd: "",
//   //     fyDesc: "",
//   //     statusCd: "",
//   //     statusName: "",
//   //     closeActTgtCd: "",
//   //     rateName: "",
//   //     isDirty: true,
//   //   };
//   //   setFycd([newRow, ...fycd]);
//   //   setSelectedFycdRow(newRow);
//   // };
//   const handleAddFyCd = () => {
//     const currentYear = new Date().getFullYear();
//     const tempId = `TEMP_${Date.now()}`;
//     const newRow = {
//       tempId: tempId,
//       fyCd: "",
//       fyDesc: "",
//       statusCd: "O", // Default to Open
//       statusName: "Open",
//       closeActTgtCd: "",
//       rateName: "None",
//       startDate: `${fycd}-01-01`, // Added default date
//       companyId: "1",
//       isDirty: true,
//     };

//     setFycd((prev) => [newRow, ...prev]);
//     setSelectedFycdRow(newRow);
//     setSelectedRows([newRow]); // Automatically select the new row
//   };

//   const handleDelete = async () => {
//     if (selectedRows.length === 0) {
//       return toast.warn("Select at least one record to delete.");
//     }

//     const confirmMessage =
//       selectedRows.length === 1
//         ? `Delete Fiscal Year: ${selectedRows[0].fyCd || "New Record"}?`
//         : `Are you sure you want to delete ${selectedRows.length} selected records?`;

//     if (!window.confirm(confirmMessage)) return;

//     setLoading(true);
//     try {
//       await Promise.all(
//         selectedRows.map((row) => {
//           // If it DOES NOT have a tempId, it exists in the Database
//           if (!row.tempId) {
//             const companyId = row.companyId || "";
//             // Use fyCd or the actual primary key field your backend expects
//             return api.delete(
//               `${backendUrl}/api/FiscalYear/${row.fyCd}?CompanyId=${companyId}`,
//             );
//           }
//           // If it's just a local new row (tempId), just resolve
//           return Promise.resolve();
//         }),
//       );

//       // Update local state: remove deleted rows from the main list
//       const deletedIdentifiers = selectedRows.map((r) => getRowKey(r));
//       const updatedList = fycd.filter(
//         (f) => !deletedIdentifiers.includes(getRowKey(f)),
//       );

//       setFycd(updatedList);
//       setSelectedRows([]); // Clear table selection
//       setSelectedFycdRow(updatedList[0] || null); // Reset form view

//       // If we deleted everything, trigger a new blank form
//       if (updatedList.length === 0) {
//         handleAddFyCd();
//       }

//       toast.success("Deleted successfully");
//     } catch (e) {
//       console.error("Delete Error:", e);
//       toast.error(e.response?.data?.message || "Delete failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     if (selectedRows.length === 0)
//       return toast.warn("Select at least one record to copy.");

//     console.log(selectedRows);
//     // Copy all selected rows, not just the active one
//     setClipboard([...selectedRows]);
//     toast.success(`${selectedRows.length} record(s) copied to clipboard`);
//   };

//   const handlePaste = () => {
//     if (!clipboard.length) return toast.warn("Clipboard is empty.");

//     const pasted = clipboard.map((row, i) => {
//       // 1. Remove database-specific IDs and existing primary keys
//       const { tempId, id, fyCd, ...restProps } = row;

//       return {
//         ...restProps, // Keeps statusName, rateName, fyDesc, etc.
//         fyCd: "", // User must provide a new unique Fiscal Year code
//         tempId: `PASTE_${Date.now()}_${i}`,
//         isDirty: true,
//       };
//     });

//     // 2. Add to the top of the list
//     setFycd((prev) => [...pasted, ...prev]);

//     // 3. Focus on the first pasted item
//     setSelectedFycdRow(pasted[0]);
//     setSelectedRows([pasted[0]]);
//     // setIsFormView(true);

//     toast.success(
//       `${pasted.length} record(s) pasted. Please enter new Fiscal Year codes.`,
//     );
//   };

//   // const handleClear = () => {
//   //   // 1. Identify if there are any temporary "NEW" rows or unsaved edits
//   //   const hasNewRows = fycd.some((f) => !!f.tempId);
//   //   const hasEdits = fycd.some((f) => f.isDirty === true);

//   //   // If nothing has changed, just exit
//   //   if (!hasNewRows && !hasEdits) return;

//   //   // 2. Confirm with the user
//   //   if (window.confirm("Discard unsaved changes and new rows?")) {
//   //     // 3. Remove all temporary 'NEW' rows locally first
//   //     // (This prevents a flash of empty rows before the fetch completes)
//   //     setFycd((prev) => prev.filter((f) => !f.tempId));

//   //     // 4. Re-fetch the original data from the database to overwrite local edits
//   //     fetchData();

//   //     // 5. Reset selection states
//   //     setFilteredGroups([]);
//   //     setSelectedRows([]); // Clear checkboxes in Table view

//   //     // We don't set selectedFycdRow to null here because
//   //     // fetchData() already has logic to select combined[0]

//   //     toast.info("Unsaved changes and new rows have been discarded.");
//   //   }
//   // };

//   const handleClear = () => {
//     const hasNewRows = fycd.some((f) => !!f.tempId) || isMapping;
//     const hasEdits = fycd.some((f) => f.isDirty === true);

//     if (!hasNewRows && !hasEdits) return;

//     if (window.confirm("Discard unsaved changes and new rows?")) {
//       // 1. Immediately clear selection states to prevent "Bad Data" in Form View
//       setSelectedRows([]);
//       setSelectedFycdRow(null);
//       setFilteredGroups([]);
//       setFycd([]);

//       // 2. Re-fetch fresh data
//       fetchData(true);

//       toast.info("Unsaved changes discarded.");
//     }
//   };

//   const handleMasterSave = async (confirmedSubPeriod = null) => {
//     const changedRows = fycd.filter((f) => f.isDirty || f.tempId);

//     if (changedRows.length === 0) {
//       return toast.warn("No changes to save");
//     }

//     setLoading(true);
//     try {
//       await Promise.all(
//         changedRows.map((row) => {
//           // Derive fyCd from startDate for new records (e.g., "2026-01-01" -> "2026")
//           let finalFyCd = row.fyCd;
//           if (row.tempId && row.startDate) {
//             finalFyCd = row.startDate.split("-")[0];
//           }

//           const payload = {
//             fyCd: finalFyCd,
//             companyId: String(row.companyId || "1"),
//             statusCd: row.statusCd || "O",
//             fyDesc: row.fyDesc || `Fiscal Year ${finalFyCd}`,
//             modifiedBy: user.name || "Admin",
//             closeActTgtCd: row.closeActTgtCd || "",
//             totalPeriods: Number(row.totalPeriods) || 12,
//             startDate: `${finalFyCd}-01-01`,
//             // Logic: If new, take from modal. If update, take from row state.
//             subPeriodsPerPeriod: row.tempId
//               ? Number(confirmedSubPeriod || 1)
//               : Number(row.subPeriodsPerPeriod || 0),
//           };

//           if (row.tempId) {
//             return api.post(
//               `${backendUrl}/api/FiscalYear/create-full`,
//               payload,
//             );
//           } else {
//             return api.put(`${backendUrl}/api/FiscalYear/${row.fyCd}`, payload);
//           }
//         }),
//       );

//       toast.success("Changes saved successfully");
//       setShowSubModal(false); // Close modal on success
//       fetchData(); // Refresh list
//     } catch (e) {
//       console.error("Save Error:", e);
//       toast.error(e.response?.data?.message || "Save failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   let currentIndex = fycd.findIndex(
//     (f) => getRowKey(f) === getRowKey(selectedFycdRow || {}),
//   );

//   const handleNavigate = (dir) => {
//     const newIdx = dir === "next" ? currentIndex + 1 : currentIndex - 1;
//     if (newIdx >= 0 && newIdx < fycd.length) {
//       setSelectedFycdRow(fycd[newIdx]);
//       setSelectedRows([fycd[newIdx]]);
//     }
//   };
//   // Add these helper functions inside your component logic
//   const jumpToCode = (code) => {
//     const index = fycd.findIndex(
//       (item) => item.fyCd.toString().toLowerCase() === code.toLowerCase(),
//     );
//     if (index !== -1) {
//       const targetRow = fycd[index];
//       setSelectedFycdRow(targetRow);
//       setSelectedRows([targetRow]);
//       // Scroll handling or additional logic if needed
//     } else {
//       toast.info("Fiscal Year Code not found");
//     }
//   };

//   // const handleNavigate = (direction) => {
//   //   const currentIndex = fycd.findIndex(
//   //     (row) =>
//   //       (row.tempId && row.tempId === selectedFycdRow?.tempId) ||
//   //       (row.fyCd && row.fyCd === selectedFycdRow?.fyCd),
//   //   );

//   //   let newIndex = currentIndex;
//   //   if (direction === "next" && currentIndex < fycd.length - 1) {
//   //     newIndex = currentIndex + 1;
//   //   } else if (direction === "prev" && currentIndex > 0) {
//   //     newIndex = currentIndex - 1;
//   //   }

//   //   if (newIndex !== currentIndex) {
//   //     const nextRow = fycd[newIndex];
//   //     setSelectedFycdRow(nextRow);
//   //     setSelectedRows([nextRow]);
//   //   }
//   // };

//   // const currentIndex = fycd.findIndex(
//   //   (row) =>
//   //     (row.tempId && row.tempId === selectedFycdRow?.tempId) ||
//   //     (row.fyCd && row.fyCd === selectedFycdRow?.fyCd),
//   // );

//   // --- Multi-Select Table Logic ---
//   // const handleRowSelection = (row) => {
//   //   const rowId = getRowKey(row);
//   //   const isSelected = selectedRows.some((r) => getRowKey(r) === rowId);

//   //   if (isSelected) {
//   //     setSelectedRows(selectedRows.filter((r) => getRowKey(r) !== rowId));
//   //   } else {
//   //     setSelectedRows([...selectedRows, row]);
//   //     setSelectedFycdRow(row); // Clicking a row makes it the active form record
//   //   }
//   // };

//   const handleRowSelection = (row) => {
//     const safeRows = Array.isArray(selectedRows) ? selectedRows : [];
//     const rowId = getRowKey(row);
//     const isSelected = safeRows.some((r) => getRowKey(r) === rowId);

//     if (isSelected) {
//       // 1. Remove the row from the selection
//       const newSelection = safeRows.filter((r) => getRowKey(r) !== rowId);
//       setSelectedRows(newSelection);

//       // 2. Fallback logic: If we just unselected the "active/latest" row,
//       // update the active row to the new last item in the list.
//       if (getRowKey(selectedFycdRow) === rowId) {
//         setSelectedFycdRow(
//           newSelection.length > 0
//             ? newSelection[newSelection.length - 1]
//             : null,
//         );
//       }
//     } else {
//       // 3. Add the new row to the selection
//       setSelectedRows([...safeRows, row]);

//       // 4. Update latest selection: This makes the most recently clicked row active
//       setSelectedFycdRow(row);
//     }
//   };

//   const handleSelectAll = () => {
//     const dataToSelect = filteredGroups.length > 0 ? filteredGroups : fycd;
//     if (selectedRows.length === dataToSelect.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows([...dataToSelect]);
//     }
//   };

//   const toggleView = () => {
//     if (!isFormView) {
//       // If moving FROM Table TO Form:
//       // If the user unchecked everything, default back to the first row
//       if (!selectedFycdRow && fycd.length > 0) {
//         const firstRow = fycd[0];
//         setSelectedFycdRow(firstRow);
//         setSelectedRows([firstRow]); // Sync the checkbox to highlight it
//       }
//     }
//     setIsFormView(!isFormView);
//   };

//   const handleRowDoubleClick = (item) => {
//     setSelectedFycdRow(item);
//     const currentId = item.fycd;
//     setSelectedRows([item]);
//     const index = fycd.findIndex((row) => row.fycd === currentId);

//     if (index !== -1) {
//       currentIndex = index;
//     }
//     setIsFormView(true);
//   };

//   return (
//     <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
//       <MainContainer icon={CalendarDays} title="Fiscal Year">
//         <Toolbar
//           clipboard={clipboard}
//           rowKey={"fyCd"}
//           isFormView={isFormView}
//           isReplaceMode={isReplaceMode}
//           setIsReplaceMode={setIsReplaceMode}
//           columns={FY_MASTER_COLUMNS}
//           searchColumn={searchColumn}
//           setSearchColumn={setSearchColumn}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           replaceValue={replaceValue}
//           setReplaceValue={setReplaceValue}
//           handleFind={handleFind}
//           handleFindReplace={handleFindReplace}
//           currentIndex={currentIndex}
//           totalRecords={fycd.length}
//           handleNavigate={handleNavigate}
//           jumpToCode={jumpToCode}
//           actions={{
//             onAdd: handleAddFyCd,
//             // onSave: handleMasterSave,
//             onSave: () => {
//               const hasNewRows = fycd.some((r) => r.tempId);
//               if (hasNewRows) {
//                 setShowSubModal(true); // Open modal first for new records
//               } else {
//                 handleMasterSave(); // Directly save if only updates
//               }
//             },
//             // onToggleView: () => setIsFormView(!isFormView),
//             onToggleView: toggleView,
//             onDelete: handleDelete,
//             onCopy: handleCopy,
//             onPaste: handlePaste,
//             onClear: handleClear,
//           }}
//           selectedRow={selectedRows.length >= 0 ? selectedRows[0] : []}
//           isDirty={fycd.some((f) => f.isDirty)}
//           loading={loading}
//         />

//         {isFormView ? (
//           <div className="space-y-1 p-1 py-2">
//             {/* {selectedRows.length > 0 && (

//               <div className="mb-2 text-sm text-gray-600">
//                 {selectedRows.length} row(s) selected
//               </div>
//             )} */}
//             <FormSection>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
//                 <FormInput
//                   label="Fiscal Year"
//                   required
//                   value={selectedFycdRow?.fyCd || ""}
//                   readOnly={!!selectedFycdRow?.id && !selectedFycdRow?.tempId}
//                   onChange={(e) =>
//                     handleFieldChange(
//                       getRowKey(selectedFycdRow || {}),
//                       "fyCd",
//                       e.target.value,
//                     )
//                   }
//                 />
//                 <FormInput
//                   label="Description"
//                   required
//                   value={selectedFycdRow?.fyDesc || ""}
//                   onChange={(e) =>
//                     handleFieldChange(
//                       getRowKey(selectedFycdRow || {}),
//                       "fyDesc",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <FormSearchSelect
//                   label="Status"
//                   value={
//                     selectedFycdRow?.statusName ||
//                     selectedFycdRow?.statusCd ||
//                     ""
//                   }
//                   searchTerm={searchTermProfiles}
//                   setSearchTerm={setSearchTermProfiles}
//                   options={statusOpt.filter((o) =>
//                     o.name
//                       .toLowerCase()
//                       .includes(searchTermProfiles.toLowerCase()),
//                   )}
//                   displayKey="name"
//                   onSelect={(p) => {
//                     const id = getRowKey(selectedFycdRow || {});
//                     handleFieldChange(id, "statusCd", p.statusCd);
//                     handleFieldChange(id, "statusName", p.name);
//                   }}
//                 />
//                 <FormSearchSelect
//                   label="Rate Type"
//                   value={
//                     selectedFycdRow?.rateName ||
//                     selectedFycdRow?.closeActTgtCd ||
//                     ""
//                   }
//                   searchTerm={searchTermProfiles}
//                   setSearchTerm={setSearchTermProfiles}
//                   options={rateOpt.filter((o) =>
//                     o.name
//                       .toLowerCase()
//                       .includes(searchTermProfiles.toLowerCase()),
//                   )}
//                   displayKey="name"
//                   onSelect={(p) => {
//                     const id = getRowKey(selectedFycdRow || {});
//                     handleFieldChange(id, "closeActTgtCd", p.closeActTgtCd);
//                     handleFieldChange(id, "rateName", p.name);
//                   }}
//                 />
//               </div>
//             </FormSection>
//           </div>
//         ) : (
//           <ReusableTable
//             data={filteredGroups.length > 0 ? filteredGroups : fycd}
//             columns={myColumns}
//             // rowKey={(row) => getRowKey(row)}
//             // rowKey={selectedFycdRow?.tempId ? "tempId" : "fyCd"}
//             rowKey={(row) => row.tempId || row.fyCd}
//             doubleclick={handleRowDoubleClick}
//             showCheckboxes={true}
//             selectedRows={selectedRows} // Now an array
//             onRowSelect={handleRowSelection}
//             onSelectAll={handleSelectAll} // Added Select All feature
//             onFieldChange={handleFieldChange}
//             maxHeight="max-h-[500px]"
//           />
//         )}
//       </MainContainer>
//       {showSubModal && (
//         <div className="fixed inset-0 z-[10000] flex items-center justify-center ">
//           <div className="bg-white rounded-xl w-48 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
//             <div className="p-3">
//               <h3 className="text-[10px] font-bold text-gray-800 text-center mb-1">
//                 Initialize Subperiods
//               </h3>
//               {/* <p className="text-xs text-gray-500 text-center mb-2">
//                 Enter sub-periods per period (1-4)
//               </p> */}

//               <div className="flex justify-center">
//                 <input
//                   type="number"
//                   autoFocus
//                   className="w-16 bg-gray-50 border border-gray-300 rounded py-1.5 text-center text-sm font-semibold text-gray-800 outline-none transition-all"
//                   // FIX: Allow empty string so backspace works
//                   value={subValue}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     if (val === "") {
//                       setSubValue(""); // Allows backspace to clear
//                       return;
//                     }
//                     const num = parseInt(val);
//                     if (num <= 4) setSubValue(num); // Max limit while typing
//                   }}
//                   onBlur={() => {
//                     if (subValue === "" || subValue < 1) setSubValue(1); // Min limit on blur
//                   }}
//                   min="1"
//                   max="4"
//                 />
//               </div>
//             </div>

//             {/* Clean, low-profile action buttons */}
//             <div className="flex border-t border-gray-100 bg-gray-50/50">
//               <button
//                 className="flex-1 py-3 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors border-r border-gray-100"
//                 onClick={() => setShowSubModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="flex-1 py-3 text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-colors"
//                 disabled={loading}
//                 onClick={() => {
//                   // Safety check for empty value
//                   const finalVal = subValue === "" ? 1 : subValue;
//                   handleMasterSave(finalVal);
//                 }}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageFiscalYear;

// import React, { useEffect, useState, useRef } from "react";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";
// import api from "../utils/api";
// import { CalendarDays } from "lucide-react";
// import { MainContainer, Toolbar } from "../helper/container";
// import {
//   FormSearchSelect,
//   FormInput,
//   FormSection,
// } from "../helper/formSection";
// import ReusableTable from "../helper/tableSection";

// const ManageFiscalYear = ({ canEdit }) => {
//   // --- Data States ---
//   const [fycd, setFycd] = useState([]);
//   const [selectedFycdRow, setSelectedFycdRow] = useState(null);
//   const [filteredGroups, setFilteredGroups] = useState([]);
//   const [isFormView, setIsFormView] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [selectedRows, setSelectedRows] = useState([]);
//   // --- UI & Find/Replace States ---
//   const [searchTermProfiles, setSearchTermProfiles] = useState("");
//   const [clipboard, setClipboard] = useState([]);
//   const [searchColumn, setSearchColumn] = useState("fyCd");
//   const [searchValue, setSearchValue] = useState("");
//   const [replaceValue, setReplaceValue] = useState("");
//   const [isReplaceMode, setIsReplaceMode] = useState(false);

//   const [showSubModal, setShowSubModal] = useState(false);
//   const [subValue, setSubValue] = useState(1);

//   const isInitialized = useRef(false);

//   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

//   // --- Dropdown Options ---
//   const statusOpt = [
//     { statusCd: " ", name: "Select" },
//     { statusCd: "O", name: "Open" },
//     { statusCd: "C", name: "Closed" },
//   ];

//   const rateOpt = [
//     { closeActTgtCd: "", name: "None" },
//     { closeActTgtCd: "A", name: "Actual Rates" },
//     { closeActTgtCd: "T", name: "Target Rates" },
//   ];

//   // --- Table Column Definitions ---
//   const myColumns = [
//     {
//       label: "Fiscal Year",
//       key: "fyCd",
//       required: true,
//       readOnlyIfExisting: true,
//     },
//     { label: "Description", key: "fyDesc", required: true },
//     {
//       label: "Status",
//       key: "statusName",
//       type: "search-select",
//       options: statusOpt,
//       displayKey: "name",
//       onSelect: (opt, id) => {
//         handleFieldChange(id, "statusCd", opt.statusCd);
//         handleFieldChange(id, "statusName", opt.name);
//       },
//     },
//     {
//       label: "Rate Type",
//       key: "rateName",
//       type: "search-select",
//       options: rateOpt,
//       displayKey: "name",
//       onSelect: (opt, id) => {
//         handleFieldChange(id, "closeActTgtCd", opt.closeActTgtCd);
//         handleFieldChange(id, "rateName", opt.name);
//       },
//     },
//   ];

//   const toolbarColumns = [
//     { label: "Fiscal Year", value: "fyCd" },
//     { label: "Description", value: "fyDesc" },
//     { label: "Status", value: "statusName" },
//     { label: "Rate Type", value: "rateName" },
//   ];

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`${backendUrl}/api/FiscalYear`);
//       const rawData = res.data || [];

//       // 1. Map codes to names immediately so the Table and Form can render them
//       const enrichedData = rawData.map((item) => ({
//         ...item,
//         statusName:
//           statusOpt.find((o) => o.statusCd === item.statusCd)?.name || "",
//         rateName:
//           rateOpt.find((o) => o.closeActTgtCd === item.closeActTgtCd)?.name ||
//           "",
//       }));

//       setFycd((prev) => {
//         // Keep only local unsaved rows (those with tempId)
//         const localNewRows = prev.filter((row) => row.tempId);

//         // Combine local rows with the newly enriched server data
//         const combined = [...localNewRows, ...enrichedData];

//         // Update selected row if none is currently active
//         if (!selectedFycdRow && combined.length > 0) {
//           setSelectedFycdRow(combined[0]);
//         }
//         return combined;
//       });
//     } catch (e) {
//       console.error("Fetch error", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //   const fetchData = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const res = await api.get(`${backendUrl}/api/FiscalYear`);
//   //       const data = res.data || [];

//   //       setFycd((prev) => {
//   //         // Keep only the rows that haven't been saved yet (tempId)
//   //         const localNewRows = prev.filter((row) => row.tempId);
//   //         // Merge with fresh data from server
//   //         const combined = [...localNewRows, ...data];

//   //         // Update selected row if none is active
//   //         if (!selectedFycdRow && combined.length > 0) {
//   //           setSelectedFycdRow(combined[0]);
//   //         }
//   //         return combined;
//   //       });
//   //     } catch (e) {
//   //       console.error("Fetch error", e);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   // Helper function for stable row key (MUST be before useEffect that uses it)
//   const getRowKey = (row) => row?.tempId || row?.fyCd || "";

//   useEffect(() => {
//     const initialize = async () => {
//       // 1. Set the initial blank row ONLY if it's the first time
//       //   if (!isInitialized.current) {
//       //     isInitialized.current = true;
//       //     const newId = `temp-${Date.now()}`;
//       //     const newRow = {
//       //       tempId: newId,
//       //       ...initialFormState,
//       //       companyId: "1",
//       //       isDirty: false,
//       //     };
//       //     setFycd([newRow]);
//       //     setSelectedFycdRow(newRow);
//       //     setSelectedRows([newRow]);
//       //   }

//       // 2. Fetch the data from backend
//       await fetchData();
//     };

//     initialize();
//   }, []); // Empty dependency array

//   const handleFieldChange = (id, field, value) => {
//     let finalValue = value;

//     // Validation for Fiscal Year Code
//     if (field === "fyCd" && /\s/.test(value)) {
//       toast.warn("No spacing allowed in Fiscal Year Code");
//       finalValue = value.replace(/\s+/g, "");
//     }

//     setFycd((prev) =>
//       prev.map((row) => {
//         if (getRowKey(row) === id) {
//           const updatedRow = { ...row, [field]: finalValue, isDirty: true };

//           // 1. Update the Form View state if this is the active row
//           if (getRowKey(selectedFycdRow || {}) === id) {
//             setSelectedFycdRow(updatedRow);
//           }

//           // 2. Update the SelectedRows array (essential for Table checkboxes/state)
//           setSelectedRows((prevSelected) =>
//             prevSelected.map((sRow) =>
//               getRowKey(sRow) === id ? updatedRow : sRow,
//             ),
//           );

//           return updatedRow;
//         }
//         return row;
//       }),
//     );
//   };

//   // --- Find & Replace Logic ---
//   // --- Find & Replace Logic ---
//   const handleFind = () => {
//     if (!searchValue) {
//       setFilteredGroups([]);
//       return;
//     }
//     const results = fycd.filter((g) =>
//       String(g[searchColumn] || "")
//         .toLowerCase()
//         .includes(searchValue.toLowerCase()),
//     );

//     if (results.length > 0) {
//       setFilteredGroups(results);
//       setSelectedFycdRow(results[0]);
//       toast.success(`Found ${results.length} matches`);
//     } else {
//       toast.error("No matching records found");
//       setFilteredGroups([]);
//     }
//   };

//   const handleBulkReplace = () => {
//     if (!searchValue) return toast.warn("Enter value to find");

//     // 1. Block replacement for the unique Fiscal Year Code
//     if (searchColumn === "fyCd") {
//       return toast.error(
//         "Fiscal Year Code is a unique identifier and cannot be bulk replaced.",
//       );
//     }

//     const updatedData = fycd.map((item) => {
//       // Check if the current value matches the search term
//       const currentValue = String(item[searchColumn] || "").toLowerCase();
//       if (currentValue === searchValue.toLowerCase()) {
//         const newItem = {
//           ...item,
//           [searchColumn]: replaceValue,
//           isDirty: true,
//         };

//         // 2. Sync Codes if the user is replacing "Names" (Status or Rate Type)
//         if (searchColumn === "statusName") {
//           const match = statusOpt.find(
//             (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
//           );
//           if (match) newItem.statusCd = match.statusCd;
//         }

//         if (searchColumn === "rateName") {
//           const match = rateOpt.find(
//             (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
//           );
//           if (match) newItem.closeActTgtCd = match.closeActTgtCd;
//         }

//         return newItem;
//       }
//       return item;
//     });

//     setFycd(updatedData);
//     // If we were filtering, update the filtered view too
//     if (filteredGroups.length > 0) {
//       handleFind();
//     }

//     toast.success("Replacements applied successfully.");
//     setIsReplaceMode(false);
//   };

//   // --- Action Handlers ---
//   const handleAddFyCd = () => {
//     const newRow = {
//       tempId: `TEMP_${Date.now()}`,
//       fyCd: "",
//       fyDesc: "",
//       statusCd: "",
//       statusName: "",
//       closeActTgtCd: "",
//       rateName: "",
//       isDirty: true,
//     };
//     setFycd([newRow, ...fycd]);
//     setSelectedFycdRow(newRow);
//   };

//   const handleDelete = async () => {
//     if (selectedRows.length === 0) {
//       return toast.warn("Select at least one record to delete.");
//     }

//     const confirmMessage =
//       selectedRows.length === 1
//         ? `Delete Fiscal Year: ${selectedRows[0].fyCd || "New Record"}?`
//         : `Are you sure you want to delete ${selectedRows.length} selected records?`;

//     if (!window.confirm(confirmMessage)) return;

//     setLoading(true);
//     try {
//       await Promise.all(
//         selectedRows.map((row) => {
//           // If it DOES NOT have a tempId, it exists in the Database
//           if (!row.tempId) {
//             const companyId = row.companyId || "";
//             // Use fyCd or the actual primary key field your backend expects
//             return api.delete(
//               `${backendUrl}/api/FiscalYear/${row.fyCd}?CompanyId=${companyId}`,
//             );
//           }
//           // If it's just a local new row (tempId), just resolve
//           return Promise.resolve();
//         }),
//       );

//       // Update local state: remove deleted rows from the main list
//       const deletedIdentifiers = selectedRows.map((r) => getRowKey(r));
//       const updatedList = fycd.filter(
//         (f) => !deletedIdentifiers.includes(getRowKey(f)),
//       );

//       setFycd(updatedList);
//       setSelectedRows([]); // Clear table selection
//       setSelectedFycdRow(updatedList[0] || null); // Reset form view

//       // If we deleted everything, trigger a new blank form
//       if (updatedList.length === 0) {
//         handleAddFyCd();
//       }

//       toast.success("Deleted successfully");
//     } catch (e) {
//       console.error("Delete Error:", e);
//       toast.error(e.response?.data?.message || "Delete failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = () => {
//     if (selectedRows.length === 0)
//       return toast.warn("Select at least one record to copy.");
//     // Copy all selected rows, not just the active one
//     setClipboard([...selectedRows]);
//     toast.success(`${selectedRows.length} record(s) copied to clipboard`);
//   };

//   const handlePaste = () => {
//     if (!clipboard.length) return toast.warn("Clipboard is empty.");

//     const pasted = clipboard.map((row, i) => {
//       // 1. Remove database-specific IDs and existing primary keys
//       const { tempId, id, fyCd, ...restProps } = row;

//       return {
//         ...restProps, // Keeps statusName, rateName, fyDesc, etc.
//         fyCd: "", // User must provide a new unique Fiscal Year code
//         tempId: `PASTE_${Date.now()}_${i}`,
//         isDirty: true,
//       };
//     });

//     // 2. Add to the top of the list
//     setFycd((prev) => [...pasted, ...prev]);

//     // 3. Focus on the first pasted item
//     setSelectedFycdRow(pasted[0]);
//     setSelectedRows([pasted[0]]);
//     // setIsFormView(true);

//     toast.success(
//       `${pasted.length} record(s) pasted. Please enter new Fiscal Year codes.`,
//     );
//   };

//   const handleClear = () => {
//     // 1. Identify if there are any temporary "NEW" rows or unsaved edits
//     const hasNewRows = fycd.some((f) => !!f.tempId);
//     const hasEdits = fycd.some((f) => f.isDirty === true);

//     // If nothing has changed, just exit
//     if (!hasNewRows && !hasEdits) return;

//     // 2. Confirm with the user
//     if (window.confirm("Discard unsaved changes and new rows?")) {
//       // 3. Remove all temporary 'NEW' rows locally first
//       // (This prevents a flash of empty rows before the fetch completes)
//       setFycd((prev) => prev.filter((f) => !f.tempId));

//       // 4. Re-fetch the original data from the database to overwrite local edits
//       fetchData();

//       // 5. Reset selection states
//       setFilteredGroups([]);
//       setSelectedRows([]); // Clear checkboxes in Table view

//       // We don't set selectedFycdRow to null here because
//       // fetchData() already has logic to select combined[0]

//       toast.info("Unsaved changes and new rows have been discarded.");
//     }
//   };

//   //   const handleMasterSave = async () => {
//   //     // Identify rows that are brand new (tempId) OR existing rows that were edited (isDirty)
//   //     const changedRows = fycd.filter((f) => f.isDirty || f.tempId);

//   //     if (changedRows.length === 0) {
//   //       return toast.warn("No changes to save");
//   //     }

//   //     setLoading(true);
//   //     try {
//   //       // We use Promise.all to send requests in parallel for better performance
//   //       await Promise.all(
//   //         changedRows.map((row) => {
//   //           const payload = {
//   //             fyCd: row.fyCd,
//   //             fyDesc: row.fyDesc,
//   //             statusCd: row.statusCd,
//   //             closeActTgtCd: row.closeActTgtCd,
//   //             companyId: String(row.companyId) || "1",
//   //             modifiedBy: user.name,
//   //             // Add any other required fields for your API here
//   //           };

//   //           if (row.tempId) {
//   //             // --- CASE 1: POST (New Record) ---
//   //             return api.post(`${backendUrl}/api/FiscalYear`, payload);
//   //           } else {
//   //             // --- CASE 2: PUT (Existing Record) ---
//   //             // Assuming 'id' is your database primary key
//   //             return api.put(`${backendUrl}/api/FiscalYear/${row.fyCd}`, payload);
//   //           }
//   //         }),
//   //       );

//   //       toast.success("All changes saved successfully");
//   //       fetchData(); // Refresh data to clear tempIds and reset isDirty flags
//   //     } catch (e) {
//   //       console.error("Save Error:", e);
//   //       toast.error(
//   //         e.response?.data?.message ||
//   //           "Save failed. Please check required fields.",
//   //       );
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   // --- View & Navigation ---

//   const handleMasterSave = async (confirmedSubPeriod = null) => {
//     const changedRows = fycd.filter((f) => f.isDirty || f.tempId);

//     if (changedRows.length === 0) {
//       return toast.warn("No changes to save");
//     }

//     setLoading(true);
//     try {
//       await Promise.all(
//         changedRows.map((row) => {
//           // Derive fyCd from startDate for new records (e.g., "2026-01-01" -> "2026")
//           let finalFyCd = row.fyCd;
//           if (row.tempId && row.startDate) {
//             finalFyCd = row.startDate.split("-")[0];
//           }

//           const payload = {
//             fyCd: finalFyCd,
//             companyId: String(row.companyId || "1"),
//             statusCd: row.statusCd || "O",
//             fyDesc: row.fyDesc || `Fiscal Year ${finalFyCd}`,
//             modifiedBy: user.name || "Admin",
//             closeActTgtCd: row.closeActTgtCd || "",
//             totalPeriods: Number(row.totalPeriods) || 12,
//             startDate: row.startDate || new Date().toISOString().split("T")[0],
//             // Logic: If new, take from modal. If update, take from row state.
//             subPeriodsPerPeriod: row.tempId
//               ? Number(confirmedSubPeriod || 1)
//               : Number(row.subPeriodsPerPeriod || 0),
//           };

//           if (row.tempId) {
//             return api.post(`${backendUrl}/api/FiscalYear`, payload);
//           } else {
//             return api.put(`${backendUrl}/api/FiscalYear/${row.fyCd}`, payload);
//           }
//         }),
//       );

//       toast.success("Changes saved successfully");
//       setShowSubModal(false); // Close modal on success
//       fetchData(); // Refresh list
//     } catch (e) {
//       console.error("Save Error:", e);
//       toast.error(e.response?.data?.message || "Save failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const currentIndex = fycd.findIndex(
//     (f) => getRowKey(f) === getRowKey(selectedFycdRow || {}),
//   );

//   const handleNavigate = (dir) => {
//     const newIdx = dir === "next" ? currentIndex + 1 : currentIndex - 1;
//     if (newIdx >= 0 && newIdx < fycd.length) {
//       setSelectedFycdRow(fycd[newIdx]);
//     }
//   };

//   // --- Multi-Select Table Logic ---
//   const handleRowSelection = (row) => {
//     const rowId = getRowKey(row);
//     const isSelected = selectedRows.some((r) => getRowKey(r) === rowId);

//     if (isSelected) {
//       setSelectedRows(selectedRows.filter((r) => getRowKey(r) !== rowId));
//     } else {
//       setSelectedRows([...selectedRows, row]);
//       setSelectedFycdRow(row); // Clicking a row makes it the active form record
//     }
//   };

//   const handleSelectAll = () => {
//     const dataToSelect = filteredGroups.length > 0 ? filteredGroups : fycd;
//     if (selectedRows.length === dataToSelect.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows([...dataToSelect]);
//     }
//   };

//   return (
//     <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
//       <MainContainer icon={CalendarDays} title="Manage Fiscal Year">
//         <Toolbar
//           clipboard={clipboard}
//           rowKey={"fyCd"}
//           isFormView={isFormView}
//           isReplaceMode={isReplaceMode}
//           setIsReplaceMode={setIsReplaceMode}
//           columns={toolbarColumns}
//           searchColumn={searchColumn}
//           setSearchColumn={setSearchColumn}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           replaceValue={replaceValue}
//           setReplaceValue={setReplaceValue}
//           handleFind={handleFind}
//           handleBulkReplace={handleBulkReplace}
//           currentIndex={currentIndex}
//           totalRecords={fycd.length}
//           handleNavigate={handleNavigate}
//           actions={{
//             onAdd: handleAddFyCd,
//             // onSave: handleMasterSave,
//             onSave: () => {
//               const hasNewRows = fycd.some((r) => r.tempId);
//               if (hasNewRows) {
//                 setShowSubModal(true); // Open modal first for new records
//               } else {
//                 handleMasterSave(); // Directly save if only updates
//               }
//             },
//             onToggleView: () => setIsFormView(!isFormView),
//             onDelete: handleDelete,
//             onCopy: handleCopy,
//             onPaste: handlePaste,
//             onClear: handleClear,
//           }}
//           selectedRow={selectedRows.length >= 0 ? selectedRows[0] : []}
//           isDirty={fycd.some((f) => f.isDirty)}
//           loading={loading}
//         />

//         {isFormView ? (
//           <div className="space-y-1 p-1 py-2">
//             {selectedRows.length > 0 && (
//               <div className="mb-2 text-sm text-gray-600">
//                 {selectedRows.length} row(s) selected
//               </div>
//             )}
//             <FormSection>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
//                 <FormInput
//                   label="Fiscal Year"
//                   required
//                   value={selectedFycdRow?.fyCd || ""}
//                   readOnly={!!selectedFycdRow?.id && !selectedFycdRow?.tempId}
//                   onChange={(e) =>
//                     handleFieldChange(
//                       getRowKey(selectedFycdRow || {}),
//                       "fyCd",
//                       e.target.value,
//                     )
//                   }
//                 />
//                 <FormInput
//                   label="Description"
//                   required
//                   value={selectedFycdRow?.fyDesc || ""}
//                   onChange={(e) =>
//                     handleFieldChange(
//                       getRowKey(selectedFycdRow || {}),
//                       "fyDesc",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </div>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <FormSearchSelect
//                   label="Status"
//                   value={
//                     selectedFycdRow?.statusName ||
//                     selectedFycdRow?.statusCd ||
//                     ""
//                   }
//                   searchTerm={searchTermProfiles}
//                   setSearchTerm={setSearchTermProfiles}
//                   options={statusOpt.filter((o) =>
//                     o.name
//                       .toLowerCase()
//                       .includes(searchTermProfiles.toLowerCase()),
//                   )}
//                   displayKey="name"
//                   onSelect={(p) => {
//                     const id = getRowKey(selectedFycdRow || {});
//                     handleFieldChange(id, "statusCd", p.statusCd);
//                     handleFieldChange(id, "statusName", p.name);
//                   }}
//                 />
//                 <FormSearchSelect
//                   label="Rate Type"
//                   value={
//                     selectedFycdRow?.rateName ||
//                     selectedFycdRow?.closeActTgtCd ||
//                     ""
//                   }
//                   searchTerm={searchTermProfiles}
//                   setSearchTerm={setSearchTermProfiles}
//                   options={rateOpt.filter((o) =>
//                     o.name
//                       .toLowerCase()
//                       .includes(searchTermProfiles.toLowerCase()),
//                   )}
//                   displayKey="name"
//                   onSelect={(p) => {
//                     const id = getRowKey(selectedFycdRow || {});
//                     handleFieldChange(id, "closeActTgtCd", p.closeActTgtCd);
//                     handleFieldChange(id, "rateName", p.name);
//                   }}
//                 />
//               </div>
//             </FormSection>
//           </div>
//         ) : (
//           <ReusableTable
//             data={filteredGroups.length > 0 ? filteredGroups : fycd}
//             columns={myColumns}
//             // rowKey={(row) => getRowKey(row)}
//             rowKey={selectedFycdRow?.tempId ? "tempId" : "fyCd"}
//             showCheckboxes={true}
//             selectedRows={selectedRows} // Now an array
//             onRowSelect={handleRowSelection}
//             onSelectAll={handleSelectAll} // Added Select All feature
//             onFieldChange={handleFieldChange}
//             maxHeight="max-h-[500px]"
//           />
//         )}
//       </MainContainer>
//       {/* MODAL IS NOW INSIDE THE MAIN DIV */}
//       {showSubModal && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="bg-white rounded-lg shadow-xl p-6 w-72 border-t-4 border-blue-600">
//             <h3 className="text-sm font-bold text-gray-800 mb-1">
//               New Fiscal Year Setup
//             </h3>
//             <p className="text-[10px] text-gray-500 mb-4">
//               Define sub-periods per period (1-31) for initialization.
//             </p>

//             <div className="mb-4">
//               <label className="text-[10px] font-bold text-gray-600 block mb-1">
//                 Sub-Periods
//               </label>
//               <input
//                 type="number"
//                 className="w-full border border-gray-300 rounded p-2 text-center text-sm focus:border-blue-500 outline-none"
//                 value={subValue}
//                 onChange={(e) => {
//                   let val = parseInt(e.target.value);
//                   if (val > 31) val = 31;
//                   if (val < 1 || isNaN(val)) val = 1;
//                   setSubValue(val);
//                 }}
//               />
//             </div>

//             <div className="flex gap-2">
//               <button
//                 className="flex-1 py-2 text-xs font-semibold text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
//                 onClick={() => setShowSubModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
//                 onClick={() => handleMasterSave(subValue)}
//               >
//                 Save Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
//   //     </div>
//   //   );
// };

// export default ManageFiscalYear;

import React, { useEffect, useState, useRef } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import api from "../utils/api";
import { CalendarDays } from "lucide-react";
import { MainContainer, Toolbar } from "../helper/container";
import {
  FormSearchSelect,
  FormInput,
  FormSection,
} from "../helper/formSection";
import ReusableTable from "../helper/tableSection";

const ManageFiscalYear = ({ canEdit }) => {
  // --- Data States ---
  const [fycd, setFycd] = useState([]);
  const [selectedFycdRow, setSelectedFycdRow] = useState([null]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isFormView, setIsFormView] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingTimeoutRef = useRef(null);

  const startLoading = () => {
    setLoading(true);
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 10000); // 10s safety timeout to prevent stuck disabled buttons
  };

  const stopLoading = () => {
    setLoading(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  };

  const [selectedRows, setSelectedRows] = useState([]);
  // --- UI & Find/Replace States ---
  const [searchTermProfiles, setSearchTermProfiles] = useState("");
  const [clipboard, setClipboard] = useState([]);
  const [hasCopied, setHasCopied] = useState(false);
  const [focusedCell, setFocusedCell] = useState(null);
  const focusedCellRef = useRef(null);
  focusedCellRef.current = focusedCell;
  const [searchColumn, setSearchColumn] = useState("fyCd");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);

  const [showSubModal, setShowSubModal] = useState(false);
  const [subValue, setSubValue] = useState();
  const isInitialized = useRef(false);

  const [isMapping, setIsMapping] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // --- Dropdown Options ---
  const statusOpt = [
    { statusCd: " ", name: "Select" },
    { statusCd: "O", name: "Open" },
    { statusCd: "C", name: "Closed" },
  ];

  const rateOpt = [
    { closeActTgtCd: "", name: "None" },
    { closeActTgtCd: "A", name: "Actual Rates" },
    { closeActTgtCd: "T", name: "Target Rates" },
  ];

  // --- Table Column Definitions ---
  const myColumns = [
    {
      label: "Fiscal Year",
      key: "fyCd",
      required: true,
      readOnlyIfExisting: true,
    },
    { label: "Description", key: "fyDesc", required: true },
    {
      label: "Status",
      key: "statusName",
      type: "search-select",
      options: statusOpt,
      displayKey: "name",
      onSelect: (opt, id) => {
        handleFieldChange(id, "statusCd", opt.statusCd);
        handleFieldChange(id, "statusName", opt.name);
      },
    },
    {
      label: "Rate Type",
      key: "rateName",
      type: "search-select",
      options: rateOpt,
      displayKey: "name",
      onSelect: (opt, id) => {
        handleFieldChange(id, "closeActTgtCd", opt.closeActTgtCd);
        handleFieldChange(id, "rateName", opt.name);
      },
    },
  ];

  const FY_MASTER_COLUMNS = [
    { id: "fyCd", label: "Fiscal Year", type: "year", allowReplace: false },
    { id: "fyDesc", label: "Description", type: "text", allowReplace: true },
    {
      id: "statusCd", // We target the CD but display the Name
      label: "Status",
      type: "select",
      allowReplace: true,
      options: statusOpt.map((s) => ({ value: s.statusCd, label: s.name })),
    },
    {
      id: "closeActTgtCd", // We target the CD but display the Name
      label: "Rate Type",
      type: "select",
      allowReplace: true,
      options: rateOpt.map((r) => ({ value: r.closeActTgtCd, label: r.name })),
    },
  ];

  const handleFindReplace = (config, isReplaceMode) => {
    const {
      column,
      findValue = "",
      findYear = "",
      replaceValue = "", // This will be the statusCd or closeActTgtCd
      replaceYear = "",
    } = config;

    if (!column) return toast.warn("Please select a column first.");

    console.log(config);

    // --- FIND LOGIC ---
    if (!isReplaceMode) {
      setIsMapping(true);
      const targetFind = column === "fyCd" ? findYear : findYear;
      if (!targetFind) return toast.warn("Please enter a value to find.");

      const foundIndex = fycd.findIndex((item) => {
        const currentValue = String(item[column] || "").toLowerCase();
        const search = String(targetFind).toLowerCase();
        return column === "fyCd"
          ? currentValue === search
          : currentValue.includes(search);
      });

      // if (foundIndex !== -1) {
      //   const foundRecord = fycd[foundIndex];
      //   setSelectedRows(foundRecord);
      //   // setCurrentIndex(foundIndex);
      //   setSelectedRows(new Set([foundRecord.tempId || foundRecord.orgId]));
      //   toast.info(`Found match at row ${foundIndex + 1}`);
      // }
      if (foundIndex !== -1) {
        const foundRecord = fycd[foundIndex];
        setSelectedFycdRow(foundRecord); // Active form record
        // FIX: Ensure this is an array containing the record
        setSelectedRows([foundRecord]);
        setFilteredGroups([foundRecord]);
        toast.info(`Found match at row ${foundIndex + 1}`);
      } else {
        toast.error(`Value not found.`);
      }
      return;
    }

    // --- REPLACE LOGIC ---

    // Safety: If Find is empty, confirm global replacement
    const isFindEmpty = column === "fyCd" ? !findYear : !findValue;
    if (isFindEmpty) {
      const proceed = window.confirm(
        "Find field is empty. This will replace EVERY record. Continue?",
      );
      if (!proceed) return;
    }

    if (!window.confirm("Apply bulk changes?")) return;

    setFycd((prevData) => {
      let changeCount = 0;

      // PRE-LOOKUP: Get the name for the code we are about to apply
      let syncName = "";
      if (column === "statusCd") {
        syncName =
          statusOpt.find((s) => String(s.statusCd) === String(replaceValue))
            ?.name || "";
      } else if (column === "closeActTgtCd") {
        syncName =
          rateOpt.find((r) => String(r.closeActTgtCd) === String(replaceValue))
            ?.name || "";
      }

      const updatedData = prevData.map((item) => {
        const currentValue = String(item[column] || "").toLowerCase();
        const searchString = String(
          column === "fyCd" ? findYear : findValue,
        ).toLowerCase();

        // If find is empty or matches the value
        if (searchString === "" || currentValue.includes(searchString)) {
          changeCount++;
          let updatedItem = { ...item, isDirty: true };

          // Handle logical branching for sync
          if (column === "statusCd") {
            updatedItem.statusCd = replaceValue;
            updatedItem.statusName = syncName; // Auto-sync Name
          } else if (column === "closeActTgtCd") {
            updatedItem.closeActTgtCd = replaceValue;
            updatedItem.rateName = syncName; // Auto-sync Name
          } else if (column === "fyCd") {
            updatedItem.fyCd = replaceYear;
          } else {
            updatedItem[column] = replaceValue;
          }

          return updatedItem;
        }
        return item;
      });

      if (changeCount > 0) {
        toast.success(`Updated ${changeCount} records.`);
      } else {
        toast.info("No matches found.");
      }
      return updatedData;
    });
  };

  const toolbarColumns = [
    { label: "Fiscal Year", value: "fyCd" },
    { label: "Description", value: "fyDesc" },
    { label: "Status", value: "statusName" },
    { label: "Rate Type", value: "rateName" },
  ];

  const fetchData = async (isReset = false) => {
    startLoading();
    try {
      const res = await api.get(`${backendUrl}/api/FiscalYear`);
      const rawData = res.data || [];

      // 1. Map codes to names immediately so the Table and Form can render them
      const enrichedData = rawData.map((item) => ({
        ...item,
        tableRowKey: item.fyCd,
        statusName:
          statusOpt.find((o) => o.statusCd === item.statusCd)?.name || "",
        rateName:
          rateOpt.find((o) => o.closeActTgtCd === item.closeActTgtCd)?.name ||
          "",
      }));

      setFycd((prev) => {
        // Keep only local unsaved rows (those with tempId)
        const localNewRows = prev.filter((row) => row.tempId);

        // Combine local rows with the newly enriched server data
        const combined = [...enrichedData];

        // Update selected row if none is currently active
        // if (!selectedFycdRow && combined.length > 0) {
        //   setSelectedFycdRow(combined[0]);
        // }
        if (combined.length > 0) {
          setSelectedFycdRow(combined[0]);
          setSelectedRows([combined[0]]);
          return combined;

          // Optionally: setSelectedRows([combined[0]]);
        } else {
          return [];
        }
      });

      if (enrichedData.length === 0) {
        handleAddFyCd();
      }
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      stopLoading();
    }
  };

  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await api.get(`${backendUrl}/api/FiscalYear`);
  //       const data = res.data || [];

  //       setFycd((prev) => {
  //         // Keep only the rows that haven't been saved yet (tempId)
  //         const localNewRows = prev.filter((row) => row.tempId);
  //         // Merge with fresh data from server
  //         const combined = [...localNewRows, ...data];

  //         // Update selected row if none is active
  //         if (!selectedFycdRow && combined.length > 0) {
  //           setSelectedFycdRow(combined[0]);
  //         }
  //         return combined;
  //       });
  //     } catch (e) {
  //       console.error("Fetch error", e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  // Helper function for stable row key (MUST be before useEffect that uses it)
  const getRowKey = (row) => row?.tableRowKey || row?.tempId || row?.fyCd || "";

  useEffect(() => {
    const initialize = async () => {
      // 1. Set the initial blank row ONLY if it's the first time
      //   if (!isInitialized.current) {
      //     isInitialized.current = true;
      //     const newId = `temp-${Date.now()}`;
      //     const newRow = {
      //       tempId: newId,
      //       ...initialFormState,
      //       companyId: "1",
      //       isDirty: false,
      //     };
      //     setFycd([newRow]);
      //     setSelectedFycdRow(newRow);
      //     setSelectedRows([newRow]);
      //   }

      // 2. Fetch the data from backend
      await fetchData();
    };

    initialize();
  }, []); // Empty dependency array

  const handleFieldChange = (id, field, value) => {
    let finalValue = value;

    // Validation for Fiscal Year Code
    if (field === "fyCd" && /\s/.test(value)) {
      finalValue = value.replace(/\s+/g, "");
    }

    setFycd((prev) =>
      prev.map((row) => {
        if (getRowKey(row) === id) {
          const updatedRow = { ...row, [field]: finalValue, isDirty: true };
          updatedRow.tableRowKey = updatedRow.tempId || updatedRow.fyCd;

          if (field === "fyCd") {
            // Check if value is a valid 4-digit year (e.g., 2026)
            if (/^\d{4}$/.test(finalValue)) {
              updatedRow.startDate = `${finalValue}-01-01`;
            }
          }

          // 1. Update the Form View state if this is the active row
          if (getRowKey(selectedFycdRow || {}) === id) {
            setSelectedFycdRow(updatedRow);
          }

          // 2. Update the SelectedRows array (essential for Table checkboxes/state)
          setSelectedRows((prevSelected) =>
            prevSelected.map((sRow) =>
              getRowKey(sRow) === id ? updatedRow : sRow,
            ),
          );

          return updatedRow;
        }
        return row;
      }),
    );
  };

  const handleBatchRowsUpdate = (updatesMap) => {
    setFycd((prev) => {
      const updatedList = prev.map((row) => {
        const rowId = getRowKey(row);
        if (rowId in updatesMap) {
          let finalChanges = { ...updatesMap[rowId] };

          if ("fyCd" in finalChanges) {
            let finalValue = finalChanges.fyCd;
            if (/\s/.test(finalValue)) {
              finalValue = finalValue.replace(/\s+/g, "");
            }
            finalChanges.fyCd = finalValue;
          }

          const updatedRow = { ...row, ...finalChanges, isDirty: true };
          updatedRow.tableRowKey = updatedRow.tempId || updatedRow.fyCd;

          if ("fyCd" in finalChanges) {
            const finalValue = finalChanges.fyCd;
            if (/^\d{4}$/.test(finalValue)) {
              updatedRow.startDate = `${finalValue}-01-01`;
            }
          }
          return updatedRow;
        }
        return row;
      });

      if (selectedFycdRow) {
        const activeId = getRowKey(selectedFycdRow);
        const updatedActiveRow = updatedList.find((r) => getRowKey(r) === activeId);
        if (updatedActiveRow) {
          setSelectedFycdRow(updatedActiveRow);
        }
      }

      setSelectedRows((prevSelected) =>
        prevSelected.map((sRow) => {
          const sId = getRowKey(sRow);
          const updatedSRow = updatedList.find((r) => getRowKey(r) === sId);
          return updatedSRow || sRow;
        }),
      );

      return updatedList;
    });
  };

  // --- Find & Replace Logic ---
  // --- Find & Replace Logic ---
  const handleFind = () => {
    if (!searchValue) {
      setFilteredGroups([]);
      return;
    }
    const results = fycd.filter((g) =>
      String(g[searchColumn] || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase()),
    );

    if (results.length > 0) {
      setFilteredGroups(results);
      setSelectedFycdRow(results[0]);
      toast.success(`Found ${results.length} matches`);
    } else {
      toast.error("No matching records found");
      setFilteredGroups([]);
    }
  };

  const handleBulkReplace = () => {
    if (!searchValue) return toast.warn("Enter value to find");

    // 1. Block replacement for the unique Fiscal Year Code
    if (searchColumn === "fyCd") {
      return toast.error(
        "Fiscal Year Code is a unique identifier and cannot be bulk replaced.",
      );
    }

    const updatedData = fycd.map((item) => {
      // Check if the current value matches the search term
      const currentValue = String(item[searchColumn] || "").toLowerCase();
      if (currentValue === searchValue.toLowerCase()) {
        const newItem = {
          ...item,
          [searchColumn]: replaceValue,
          isDirty: true,
        };

        // 2. Sync Codes if the user is replacing "Names" (Status or Rate Type)
        if (searchColumn === "statusName") {
          const match = statusOpt.find(
            (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
          );
          if (match) newItem.statusCd = match.statusCd;
        }

        if (searchColumn === "rateName") {
          const match = rateOpt.find(
            (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
          );
          if (match) newItem.closeActTgtCd = match.closeActTgtCd;
        }

        return newItem;
      }
      return item;
    });

    setFycd(updatedData);
    // If we were filtering, update the filtered view too
    if (filteredGroups.length > 0) {
      handleFind();
    }

    toast.success("Replacements applied successfully.");
    setIsReplaceMode(false);
  };

  // --- Action Handlers ---
  // const handleAddFyCd = () => {
  //   const newRow = {
  //     tempId: `TEMP_${Date.now()}`,
  //     fyCd: "",
  //     fyDesc: "",
  //     statusCd: "",
  //     statusName: "",
  //     closeActTgtCd: "",
  //     rateName: "",
  //     isDirty: true,
  //   };
  //   setFycd([newRow, ...fycd]);
  //   setSelectedFycdRow(newRow);
  // };
  const handleAddFyCd = () => {
    const currentYear = new Date().getFullYear();
    const tempId = `TEMP_${Date.now()}`;
    const newRow = {
      tempId: tempId,
      tableRowKey: tempId,
      fyCd: "",
      fyDesc: "",
      statusCd: "O", // Default to Open
      statusName: "Open",
      closeActTgtCd: "",
      rateName: "None",
      startDate: `${fycd}-01-01`, // Added default date
      companyId: "1",
      isDirty: true,
    };

    setFycd((prev) => [newRow, ...prev]);
    setSelectedFycdRow(newRow);
    setSelectedRows([newRow]); // Automatically select the new row
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      return toast.warn("Select at least one record to delete.");
    }

    const confirmMessage =
      selectedRows.length === 1
        ? `Delete Fiscal Year: ${selectedRows[0].fyCd || "New Record"}?`
        : `Are you sure you want to delete ${selectedRows.length} selected records?`;

    if (!window.confirm(confirmMessage)) return;

    startLoading();
    try {
      await Promise.all(
        selectedRows.map((row) => {
          // If it DOES NOT have a tempId, it exists in the Database
          if (!row.tempId) {
            const companyId = row.companyId || "";
            // Use fyCd or the actual primary key field your backend expects
            return api.delete(
              `${backendUrl}/api/FiscalYear/${row.fyCd}?CompanyId=${companyId}`,
            );
          }
          // If it's just a local new row (tempId), just resolve
          return Promise.resolve();
        }),
      );

      // Update local state: remove deleted rows from the main list
      const deletedIdentifiers = selectedRows.map((r) => getRowKey(r));
      const updatedList = fycd.filter(
        (f) => !deletedIdentifiers.includes(getRowKey(f)),
      );

      setFycd(updatedList);
      setSelectedRows([]); // Clear table selection
      setSelectedFycdRow(updatedList[0] || null); // Reset form view

      // If we deleted everything, trigger a new blank form
      if (updatedList.length === 0) {
        handleAddFyCd();
      }

      toast.success("Deleted successfully");
    } catch (e) {
      console.error("Delete Error:", e);
      toast.error(e.response?.data?.message || "Delete failed");
    } finally {
      stopLoading();
    }
  };

  const resolveStatus = (val) => {
    const trimmed = String(val || "").trim().toLowerCase();
    if (!trimmed || trimmed === "select") {
      return { statusCd: " ", statusName: "Select" };
    }
    if (trimmed.startsWith("o") || trimmed.includes("open") || trimmed.includes("act")) {
      return { statusCd: "O", statusName: "Open" };
    }
    if (trimmed.startsWith("c") || trimmed.includes("clos") || trimmed.includes("inact")) {
      return { statusCd: "C", statusName: "Closed" };
    }
    return { statusCd: " ", statusName: "Select" };
  };

  const resolveRateType = (val) => {
    const trimmed = String(val || "").trim().toLowerCase();
    if (!trimmed || trimmed === "none") {
      return { closeActTgtCd: "", rateName: "None" };
    }
    if (trimmed.startsWith("a") || trimmed.includes("act")) {
      return { closeActTgtCd: "A", rateName: "Actual Rates" };
    }
    if (trimmed.startsWith("t") || trimmed.includes("targ")) {
      return { closeActTgtCd: "T", rateName: "Target Rates" };
    }
    return { closeActTgtCd: "", rateName: "None" };
  };

  const processPastedText = (text) => {
    console.log("[ERP PASTE] processPastedText START. Raw text:", JSON.stringify(text));
    if (!text || !text.trim()) {
      return toast.warn("Clipboard is empty.");
    }

    const FORM_FIELDS_ORDER = ["fyCd", "fyDesc", "status", "rateType"];
    const activeFocusedCell = focusedCellRef.current;
    console.log("[ERP PASTE] activeFocusedCell detected:", JSON.stringify(activeFocusedCell));

    const headerKeys = [
      "fiscal year",
      "fycd",
      "description",
      "fydesc",
      "status",
      "statuscd",
      "statusname",
      "rate type",
      "ratetype",
      "closeacttgtcd",
      "ratename",
    ];

    const isValidStatusValue = (val) => {
      const trimmed = String(val || "").trim().toLowerCase();
      if (trimmed === "" || trimmed === "select") return true;
      return (
        trimmed.startsWith("o") ||
        trimmed.includes("open") ||
        trimmed.includes("act") ||
        trimmed.startsWith("c") ||
        trimmed.includes("clos") ||
        trimmed.includes("inact")
      );
    };

    const isValidRateTypeValue = (val) => {
      const trimmed = String(val || "").trim().toLowerCase();
      if (trimmed === "" || trimmed === "none") return true;
      return (
        trimmed.startsWith("a") ||
        trimmed.includes("act") ||
        trimmed.startsWith("t") ||
        trimmed.includes("targ")
      );
    };

    if (activeFocusedCell) {
      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line !== "");

      if (lines.length > 0) {
        const firstLineCells = lines[0]
          .split("\t")
          .map((cell) => cell.trim().toLowerCase());
        const isHeaderRow = firstLineCells.some((cell) => headerKeys.includes(cell));

        const dataLines = isHeaderRow ? lines.slice(1) : lines;

        if (dataLines.length > 0) {
          const tableData = filteredGroups.length > 0 ? filteredGroups : fycd;
          const updatesMap = {};
          const startFieldIdx = FORM_FIELDS_ORDER.indexOf(activeFocusedCell.fieldName);

          if (startFieldIdx !== -1) {
            let headerMapping = null;
            if (isHeaderRow) {
              headerMapping = [];
              firstLineCells.forEach((headerVal) => {
                let fieldName = null;
                if (["fiscal year", "fycd", "year"].includes(headerVal)) {
                  fieldName = "fyCd";
                } else if (["description", "fydesc", "desc"].includes(headerVal)) {
                  fieldName = "fyDesc";
                } else if (["status", "statuscd", "statusname"].includes(headerVal)) {
                  fieldName = "status";
                } else if (["rate type", "ratetype", "closeacttgtcd", "ratename"].includes(headerVal)) {
                  fieldName = "rateType";
                }
                headerMapping.push(fieldName);
              });
            }

            if (activeFocusedCell.view === "form" && selectedFycdRow) {
              const cells = dataLines[0].split("\t").map((cell) => cell.trim());
              console.log("[ERP PASTE] Form View cells parsed:", JSON.stringify(cells));
              let hasValue = false;
              let targetVal = "";
              if (isHeaderRow && headerMapping) {
                const clipboardColIdx = headerMapping.indexOf(activeFocusedCell.fieldName);
                if (clipboardColIdx !== -1 && clipboardColIdx < cells.length) {
                  targetVal = cells[clipboardColIdx];
                  hasValue = targetVal !== "";
                }
              } else {
                if (cells.length > 0) {
                  targetVal = cells[0];
                  hasValue = targetVal !== "";
                }
              }

              console.log("[ERP PASTE] Form View hasValue (before year check):", hasValue, "targetVal:", targetVal);

              if (activeFocusedCell.fieldName === "fyCd" && hasValue) {
                const isYear = /^\d{4}$/.test(targetVal);
                console.log("[ERP PASTE] Form View fiscal year validation check result:", isYear);
                if (!isYear) {
                  hasValue = false;
                }
              }

              // Alignment Validation: ensure columns match types when not using header rows
              if (hasValue && !isHeaderRow) {
                cells.forEach((cellVal, cOffset) => {
                  const targetColIdx = startFieldIdx + cOffset;
                  if (targetColIdx < FORM_FIELDS_ORDER.length) {
                    const fieldName = FORM_FIELDS_ORDER[targetColIdx];
                    if (fieldName === "status" && cellVal !== "") {
                      if (!isValidStatusValue(cellVal)) {
                        console.log("[ERP PASTE] Form View status alignment invalid:", cellVal);
                        hasValue = false;
                      }
                    } else if (fieldName === "rateType" && cellVal !== "") {
                      if (!isValidRateTypeValue(cellVal)) {
                        console.log("[ERP PASTE] Form View rateType alignment invalid:", cellVal);
                        hasValue = false;
                      }
                    }
                  }
                });
              }

              console.log("[ERP PASTE] Form View final hasValue:", hasValue);

              if (!hasValue) {
                return toast.warn("No value found in clipboard for the focused field.");
              }

              const activeId = getRowKey(selectedFycdRow);
              const changes = {};

              cells.forEach((cellVal, cOffset) => {
                let fieldName = null;
                if (isHeaderRow && headerMapping) {
                  fieldName = headerMapping[cOffset];
                } else {
                  const targetColIdx = startFieldIdx + cOffset;
                  if (targetColIdx < FORM_FIELDS_ORDER.length) {
                    fieldName = FORM_FIELDS_ORDER[targetColIdx];
                  }
                }

                if (fieldName && cellVal !== "") {
                  if (fieldName === "fyCd") {
                    changes.fyCd = cellVal;
                  } else if (fieldName === "fyDesc") {
                    changes.fyDesc = cellVal;
                  } else if (fieldName === "status") {
                    const { statusCd, statusName } = resolveStatus(cellVal);
                    changes.statusCd = statusCd;
                    changes.statusName = statusName;
                  } else if (fieldName === "rateType") {
                    const { closeActTgtCd, rateName } = resolveRateType(cellVal);
                    changes.closeActTgtCd = closeActTgtCd;
                    changes.rateName = rateName;
                  }
                }
              });

              updatesMap[activeId] = changes;
              handleBatchRowsUpdate(updatesMap);
              toast.success("Fields pasted successfully.");
              return;

            } else if (activeFocusedCell.view === "table") {
              const newPastedRows = [];
              const firstRowCells = dataLines[0].split("\t").map((cell) => cell.trim());
              console.log("[ERP PASTE] Table View firstRowCells parsed:", JSON.stringify(firstRowCells));
              let hasValue = false;
              let targetVal = "";
              if (isHeaderRow && headerMapping) {
                const clipboardColIdx = headerMapping.indexOf(activeFocusedCell.fieldName);
                if (clipboardColIdx !== -1 && clipboardColIdx < firstRowCells.length) {
                  targetVal = firstRowCells[clipboardColIdx];
                  hasValue = targetVal !== "";
                }
              } else {
                if (firstRowCells.length > 0) {
                  targetVal = firstRowCells[0];
                  hasValue = targetVal !== "";
                }
              }

              console.log("[ERP PASTE] Table View hasValue (before year check):", hasValue, "targetVal:", targetVal);

              if (activeFocusedCell.fieldName === "fyCd" && hasValue) {
                const isYear = /^\d{4}$/.test(targetVal);
                console.log("[ERP PASTE] Table View fiscal year validation check result:", isYear);
                if (!isYear) {
                  hasValue = false;
                }
              }

              // Alignment Validation: ensure columns match types when not using header rows
              if (hasValue && !isHeaderRow) {
                firstRowCells.forEach((cellVal, cOffset) => {
                  const targetColIdx = startFieldIdx + cOffset;
                  if (targetColIdx < FORM_FIELDS_ORDER.length) {
                    const fieldName = FORM_FIELDS_ORDER[targetColIdx];
                    if (fieldName === "status" && cellVal !== "") {
                      if (!isValidStatusValue(cellVal)) {
                        console.log("[ERP PASTE] Table View status alignment invalid:", cellVal);
                        hasValue = false;
                      }
                    } else if (fieldName === "rateType" && cellVal !== "") {
                      if (!isValidRateTypeValue(cellVal)) {
                        console.log("[ERP PASTE] Table View rateType alignment invalid:", cellVal);
                        hasValue = false;
                      }
                    }
                  }
                });
              }

              console.log("[ERP PASTE] Table View final hasValue:", hasValue);

              if (!hasValue) {
                return toast.warn("No value found in clipboard for the focused field.");
              }

              dataLines.forEach((line, rOffset) => {
                const targetRowIdx = activeFocusedCell.rowIndex + rOffset;
                const cells = line.split("\t").map((cell) => cell.trim());

                if (targetRowIdx < tableData.length) {
                  const targetRow = tableData[targetRowIdx];
                  const targetRowId = getRowKey(targetRow);
                  const changes = {};

                  cells.forEach((cellVal, cOffset) => {
                    let fieldName = null;
                    if (isHeaderRow && headerMapping) {
                      fieldName = headerMapping[cOffset];
                    } else {
                      const targetColIdx = startFieldIdx + cOffset;
                      if (targetColIdx < FORM_FIELDS_ORDER.length) {
                        fieldName = FORM_FIELDS_ORDER[targetColIdx];
                      }
                    }

                    if (fieldName && cellVal !== "") {
                      if (fieldName === "fyCd") {
                        changes.fyCd = cellVal;
                      } else if (fieldName === "fyDesc") {
                        changes.fyDesc = cellVal;
                      } else if (fieldName === "status") {
                        const { statusCd, statusName } = resolveStatus(cellVal);
                        changes.statusCd = statusCd;
                        changes.statusName = statusName;
                      } else if (fieldName === "rateType") {
                        const { closeActTgtCd, rateName } = resolveRateType(cellVal);
                        changes.closeActTgtCd = closeActTgtCd;
                        changes.rateName = rateName;
                      }
                    }
                  });

                  updatesMap[targetRowId] = changes;
                } else {
                  const tempIdVal = `PASTE_${Date.now()}_${rOffset}_${Math.random().toString(36).substr(2, 5)}`;
                  const newRow = {
                    fyCd: "",
                    fyDesc: "",
                    statusCd: "O",
                    statusName: "Open",
                    closeActTgtCd: "",
                    rateName: "None",
                    companyId: "1",
                    tempId: tempIdVal,
                    tableRowKey: tempIdVal,
                    isDirty: true,
                  };

                  cells.forEach((cellVal, cOffset) => {
                    let fieldName = null;
                    if (isHeaderRow && headerMapping) {
                      fieldName = headerMapping[cOffset];
                    } else {
                      const targetColIdx = cOffset;
                      if (targetColIdx < FORM_FIELDS_ORDER.length) {
                        fieldName = FORM_FIELDS_ORDER[targetColIdx];
                      }
                    }

                    if (fieldName && cellVal !== "") {
                      if (fieldName === "fyCd") {
                        newRow.fyCd = cellVal;
                      } else if (fieldName === "fyDesc") {
                        newRow.fyDesc = cellVal;
                      } else if (fieldName === "status") {
                        const { statusCd, statusName } = resolveStatus(cellVal);
                        newRow.statusCd = statusCd;
                        newRow.statusName = statusName;
                      } else if (fieldName === "rateType") {
                        const { closeActTgtCd, rateName } = resolveRateType(cellVal);
                        newRow.closeActTgtCd = closeActTgtCd;
                        newRow.rateName = rateName;
                      }
                    }
                  });

                  newPastedRows.push(newRow);
                }
              });

              if (Object.keys(updatesMap).length > 0 || newPastedRows.length > 0) {
                if (Object.keys(updatesMap).length > 0) {
                  handleBatchRowsUpdate(updatesMap);
                }
                if (newPastedRows.length > 0) {
                  setFycd((prev) => [...prev, ...newPastedRows]);
                }
                toast.success("Fields pasted successfully.");
                return;
              }
            }
          }
        }
      }
    }

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");
    if (lines.length === 0) return toast.warn("No data to paste.");


    const firstLineCells = lines[0]
      .split("\t")
      .map((cell) => cell.trim().toLowerCase());
    const isHeaderRow = firstLineCells.some((cell) => headerKeys.includes(cell));

    const dataLines = isHeaderRow ? lines.slice(1) : lines;
    if (dataLines.length === 0) {
      return toast.warn("No data rows found to paste.");
    }

    let fyCdIdx = -1;
    let fyDescIdx = -1;
    let statusIdx = -1;
    let rateTypeIdx = -1;

    if (isHeaderRow) {
      fyCdIdx = firstLineCells.findIndex((cell) =>
        ["fiscal year", "fycd", "year"].includes(cell),
      );
      fyDescIdx = firstLineCells.findIndex((cell) =>
        ["description", "fydesc", "desc"].includes(cell),
      );
      statusIdx = firstLineCells.findIndex((cell) =>
        ["status", "statuscd", "statusname"].includes(cell),
      );
      rateTypeIdx = firstLineCells.findIndex((cell) =>
        ["rate type", "ratetype", "closeacttgtcd", "ratename"].includes(cell),
      );
    } else {
      fyCdIdx = 0;
      fyDescIdx = 1;
      statusIdx = 2;
      rateTypeIdx = 3;
    }

    const pastedRows = [];
    dataLines.forEach((line, i) => {
      const cells = line.split("\t");

      const rawFyCd =
        fyCdIdx !== -1 && fyCdIdx < cells.length ? cells[fyCdIdx].trim() : "";
      const rawFyDesc =
        fyDescIdx !== -1 && fyDescIdx < cells.length
          ? cells[fyDescIdx].trim()
          : "";
      const rawStatus =
        statusIdx !== -1 && statusIdx < cells.length
          ? cells[statusIdx].trim()
          : "";
      const rawRateType =
        rateTypeIdx !== -1 && rateTypeIdx < cells.length
          ? cells[rateTypeIdx].trim()
          : "";

      if (!rawFyCd && !rawFyDesc && !rawStatus && !rawRateType) {
        return;
      }

      const { statusCd, statusName } = resolveStatus(rawStatus);
      const { closeActTgtCd, rateName } = resolveRateType(rawRateType);

      const tempIdVal = `PASTE_${Date.now()}_${i}_${Math.random()
        .toString(36)
        .substr(2, 5)}`;

      pastedRows.push({
        fyCd: rawFyCd,
        fyDesc: rawFyDesc || (rawFyCd ? `Fiscal Year ${rawFyCd}` : ""),
        statusCd,
        statusName,
        closeActTgtCd,
        rateName,
        companyId: "1",
        tempId: tempIdVal,
        tableRowKey: tempIdVal,
        isDirty: true,
      });
    });

    if (pastedRows.length === 0) {
      return toast.warn("No valid rows parsed from clipboard.");
    }

    setFycd((prev) => [...pastedRows, ...prev]);

    setSelectedFycdRow(pastedRows[0]);
    setSelectedRows([pastedRows[0]]);

    toast.success(`${pastedRows.length} record(s) pasted.`);
  };

  const handleCopy = () => {
    if (selectedRows.length === 0)
      return toast.warn("Select at least one record to copy.");

    setClipboard([...selectedRows]);
    setHasCopied(true);

    const header = "Fiscal Year\tDescription\tStatus\tRate Type";
    const rows = selectedRows
      .map((row) => {
        const fyCd = row.fyCd || "";
        const fyDesc = row.fyDesc || "";
        const statusName =
          row.statusName ||
          statusOpt.find((o) => o.statusCd === row.statusCd)?.name ||
          "";
        const rateName =
          row.rateName ||
          rateOpt.find((o) => o.closeActTgtCd === row.closeActTgtCd)?.name ||
          "";
        return `${fyCd}\t${fyDesc}\t${statusName}\t${rateName}`;
      })
      .join("\n");

    const tsvContent = `${header}\n${rows}`;

    navigator.clipboard
      .writeText(tsvContent)
      .then(() => {
        toast.success(`${selectedRows.length} record(s) copied to clipboard`);
      })
      .catch((err) => {
        console.error("Failed to copy to system clipboard:", err);
        toast.warn(`${selectedRows.length} record(s) copied internally.`);
      });
  };

  const handlePaste = async () => {
    if (clipboard && clipboard.length > 0 && !clipboard[0]?.isDummy) {
      const pasted = clipboard.map((row, i) => {
        const clonedRow = JSON.parse(JSON.stringify(row));
        const { tempId, id, fyCd, ...restProps } = clonedRow;
        const tempIdVal = `PASTE_${Date.now()}_${i}`;
        return {
          ...restProps,
          fyCd: fyCd || "",
          tempId: tempIdVal,
          tableRowKey: tempIdVal,
          isDirty: true,
        };
      });

      setFycd((prev) => [...pasted, ...prev]);
      setSelectedFycdRow(pasted[0]);
      setSelectedRows([pasted[0]]);
      toast.success(`${pasted.length} record(s) pasted.`);
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        processPastedText(text);
        return;
      }
    } catch (err) {
      console.warn(
        "System clipboard access failed, falling back to local memory paste",
        err,
      );
    }

    toast.warn("Clipboard is empty.");
  };

  useEffect(() => {
    const handleGlobalPaste = (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      if (!clipboardData) return;
      const text = clipboardData.getData("text");
      if (!text || !text.trim()) return;

      const isInput =
        e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
      const hasStructure = text.includes("\t") || text.includes("\n");

      if (isInput && !hasStructure) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      processPastedText(text);
    };

    document.addEventListener("paste", handleGlobalPaste);
    return () => document.removeEventListener("paste", handleGlobalPaste);
  }, [fycd, clipboard]);

  useEffect(() => {
    const syncClipboardWithSystem = async () => {
      try {
        if (!navigator.permissions || !navigator.permissions.query) return;
        const permission = await navigator.permissions.query({ name: "clipboard-read" });
        if (permission.state === "granted") {
          const text = await navigator.clipboard.readText();
          if (text && text.trim()) {
            setClipboard((prev) => (prev.length === 0 || prev[0]?.isDummy ? [{ isDummy: true }] : prev));
          } else {
            setClipboard((prev) => (prev.length > 0 && prev[0]?.isDummy ? [] : prev));
          }
        }
      } catch (err) {
        // Fallback for browsers that don't support query/clipboard-read
      }
    };

    window.addEventListener("focus", syncClipboardWithSystem);
    syncClipboardWithSystem();
    return () => window.removeEventListener("focus", syncClipboardWithSystem);
  }, []);

  // const handleClear = () => {
  //   // 1. Identify if there are any temporary "NEW" rows or unsaved edits
  //   const hasNewRows = fycd.some((f) => !!f.tempId);
  //   const hasEdits = fycd.some((f) => f.isDirty === true);

  //   // If nothing has changed, just exit
  //   if (!hasNewRows && !hasEdits) return;

  //   // 2. Confirm with the user
  //   if (window.confirm("Discard unsaved changes and new rows?")) {
  //     // 3. Remove all temporary 'NEW' rows locally first
  //     // (This prevents a flash of empty rows before the fetch completes)
  //     setFycd((prev) => prev.filter((f) => !f.tempId));

  //     // 4. Re-fetch the original data from the database to overwrite local edits
  //     fetchData();

  //     // 5. Reset selection states
  //     setFilteredGroups([]);
  //     setSelectedRows([]); // Clear checkboxes in Table view

  //     // We don't set selectedFycdRow to null here because
  //     // fetchData() already has logic to select combined[0]

  //     toast.info("Unsaved changes and new rows have been discarded.");
  //   }
  // };

  const handleClear = () => {
    const hasNewRows = fycd.some((f) => !!f.tempId);
    const hasEdits = fycd.some((f) => f.isDirty === true);

    if (!hasNewRows && !hasEdits) return;

    if (window.confirm("Discard unsaved changes and new rows?")) {
      setFocusedCell(null);
      // 1. Keep saved rows and only filter out new unsaved ones locally
      setFycd((prev) => prev.filter((f) => !f.tempId));

      // 2. Re-fetch original data from server to overwrite dirty edits
      fetchData();

      // 3. Reset selection/mapping states
      setFilteredGroups([]);
      setSelectedRows([]);
      setIsMapping(false);

      toast.info("Unsaved changes discarded.");
    }
  };

  const handleMasterSave = async (confirmedSubPeriod = null) => {
    const changedRows = fycd.filter((f) => f.isDirty || f.tempId);

    if (changedRows.length === 0) {
      return toast.warn("No changes to save");
    }

    startLoading();
    try {
      await Promise.all(
        changedRows.map((row) => {
          // Derive fyCd from startDate for new records (e.g., "2026-01-01" -> "2026")
          let finalFyCd = row.fyCd;
          if (row.tempId && row.startDate) {
            finalFyCd = row.startDate.split("-")[0];
          }

          const payload = {
            fyCd: finalFyCd,
            companyId: String(row.companyId || "1"),
            statusCd: row.statusCd || "O",
            fyDesc: row.fyDesc || `Fiscal Year ${finalFyCd}`,
            modifiedBy: user.name || "Admin",
            closeActTgtCd: row.closeActTgtCd || "",
            totalPeriods: Number(row.totalPeriods) || 12,
            startDate: `${finalFyCd}-01-01`,
            // Logic: If new, take from modal. If update, take from row state.
            subPeriodsPerPeriod: row.tempId
              ? Number(confirmedSubPeriod || 1)
              : Number(row.subPeriodsPerPeriod || 0),
          };

          if (row.tempId) {
            return api.post(
              `${backendUrl}/api/FiscalYear/create-full`,
              payload,
            );
          } else {
            return api.put(`${backendUrl}/api/FiscalYear/${row.fyCd}`, payload);
          }
        }),
      );

      toast.success("Changes saved successfully");
      setShowSubModal(false); // Close modal on success
      fetchData(); // Refresh list
    } catch (e) {
      console.error("Save Error:", e);
      toast.error(e.response?.data?.message || "Save failed.");
    } finally {
      stopLoading();
    }
  };

  let currentIndex = fycd.findIndex(
    (f) => getRowKey(f) === getRowKey(selectedFycdRow || {}),
  );

  const handleNavigate = (dir) => {
    const newIdx = dir === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIdx >= 0 && newIdx < fycd.length) {
      setSelectedFycdRow(fycd[newIdx]);
      setSelectedRows([fycd[newIdx]]);
    }
  };
  // Add these helper functions inside your component logic
  const jumpToCode = (code) => {
    const index = fycd.findIndex(
      (item) => item.fyCd.toString().toLowerCase() === code.toLowerCase(),
    );
    if (index !== -1) {
      const targetRow = fycd[index];
      setSelectedFycdRow(targetRow);
      setSelectedRows([targetRow]);
      // Scroll handling or additional logic if needed
    } else {
      toast.info("Fiscal Year Code not found");
    }
  };

  // const handleNavigate = (direction) => {
  //   const currentIndex = fycd.findIndex(
  //     (row) =>
  //       (row.tempId && row.tempId === selectedFycdRow?.tempId) ||
  //       (row.fyCd && row.fyCd === selectedFycdRow?.fyCd),
  //   );

  //   let newIndex = currentIndex;
  //   if (direction === "next" && currentIndex < fycd.length - 1) {
  //     newIndex = currentIndex + 1;
  //   } else if (direction === "prev" && currentIndex > 0) {
  //     newIndex = currentIndex - 1;
  //   }

  //   if (newIndex !== currentIndex) {
  //     const nextRow = fycd[newIndex];
  //     setSelectedFycdRow(nextRow);
  //     setSelectedRows([nextRow]);
  //   }
  // };

  // const currentIndex = fycd.findIndex(
  //   (row) =>
  //     (row.tempId && row.tempId === selectedFycdRow?.tempId) ||
  //     (row.fyCd && row.fyCd === selectedFycdRow?.fyCd),
  // );

  // --- Multi-Select Table Logic ---
  // const handleRowSelection = (row) => {
  //   const rowId = getRowKey(row);
  //   const isSelected = selectedRows.some((r) => getRowKey(r) === rowId);

  //   if (isSelected) {
  //     setSelectedRows(selectedRows.filter((r) => getRowKey(r) !== rowId));
  //   } else {
  //     setSelectedRows([...selectedRows, row]);
  //     setSelectedFycdRow(row); // Clicking a row makes it the active form record
  //   }
  // };

  const handleRowSelection = (row) => {
    const safeRows = Array.isArray(selectedRows) ? selectedRows : [];
    const rowId = getRowKey(row);
    const isSelected = safeRows.some((r) => getRowKey(r) === rowId);

    if (isSelected) {
      // 1. Remove the row from the selection
      const newSelection = safeRows.filter((r) => getRowKey(r) !== rowId);
      setSelectedRows(newSelection);

      // 2. Fallback logic: If we just unselected the "active/latest" row,
      // update the active row to the new last item in the list.
      if (getRowKey(selectedFycdRow) === rowId) {
        setSelectedFycdRow(
          newSelection.length > 0
            ? newSelection[newSelection.length - 1]
            : null,
        );
      }
    } else {
      // 3. Add the new row to the selection
      setSelectedRows([...safeRows, row]);

      // 4. Update latest selection: This makes the most recently clicked row active
      setSelectedFycdRow(row);
    }
  };

  const handleSelectAll = () => {
    const dataToSelect = filteredGroups.length > 0 ? filteredGroups : fycd;
    if (selectedRows.length === dataToSelect.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...dataToSelect]);
    }
  };

  const toggleView = () => {
    setFocusedCell(null);
    if (!isFormView) {
      // If moving FROM Table TO Form:
      // If the user unchecked everything, default back to the first row
      if (!selectedFycdRow && fycd.length > 0) {
        const firstRow = fycd[0];
        setSelectedFycdRow(firstRow);
        setSelectedRows([firstRow]); // Sync the checkbox to highlight it
      }
    }
    setIsFormView(!isFormView);
  };

  const handleRowDoubleClick = (item) => {
    setSelectedFycdRow(item);
    const currentId = item.fycd;
    setSelectedRows([item]);
    const index = fycd.findIndex((row) => row.fycd === currentId);

    if (index !== -1) {
      currentIndex = index;
    }
    setIsFormView(true);
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer icon={CalendarDays} title="Fiscal Year">
        <Toolbar
          clipboard={hasCopied ? clipboard : []}
          rowKey={"fyCd"}
          isFormView={isFormView}
          isReplaceMode={isReplaceMode}
          setIsReplaceMode={setIsReplaceMode}
          columns={FY_MASTER_COLUMNS}
          searchColumn={searchColumn}
          setSearchColumn={setSearchColumn}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          replaceValue={replaceValue}
          setReplaceValue={setReplaceValue}
          handleFind={handleFind}
          handleFindReplace={handleFindReplace}
          currentIndex={currentIndex}
          totalRecords={fycd.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          actions={{
            onAdd: handleAddFyCd,
            // onSave: handleMasterSave,
            onSave: () => {
              const hasNewRows = fycd.some((r) => r.tempId);
              if (hasNewRows) {
                setShowSubModal(true); // Open modal first for new records
              } else {
                handleMasterSave(); // Directly save if only updates
              }
            },
            // onToggleView: () => setIsFormView(!isFormView),
            onToggleView: toggleView,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleClear,
          }}
          selectedRow={selectedRows.length >= 0 ? selectedRows[0] : []}
          isDirty={fycd.some((f) => f.isDirty)}
          loading={loading}
        />

        {isFormView ? (
          <div
            className="p-5 bg-white border border-slate-200/80 shadow-sm rounded mb-4"
            onFocusCapture={(e) => {
              const labelEl = e.target.closest(".flex")?.querySelector("label");
              if (!labelEl) return;
              const labelText = labelEl.textContent || "";
              const cleanLabel = labelText.replace(/[*]/g, "").trim().toLowerCase();
              
              let fieldName = null;
              if (cleanLabel.includes("fiscal year")) {
                fieldName = "fyCd";
              } else if (cleanLabel.includes("description")) {
                fieldName = "fyDesc";
              } else if (cleanLabel.includes("status")) {
                fieldName = "status";
              } else if (cleanLabel.includes("rate type")) {
                fieldName = "rateType";
              }
              
              if (fieldName) {
                setFocusedCell({ view: "form", fieldName });
              }
            }}
            onMouseDownCapture={(e) => {
              const labelEl = e.target.closest(".flex")?.querySelector("label");
              if (!labelEl) return;
              const labelText = labelEl.textContent || "";
              const cleanLabel = labelText.replace(/[*]/g, "").trim().toLowerCase();
              
              let fieldName = null;
              if (cleanLabel.includes("fiscal year")) {
                fieldName = "fyCd";
              } else if (cleanLabel.includes("description")) {
                fieldName = "fyDesc";
              } else if (cleanLabel.includes("status")) {
                fieldName = "status";
              } else if (cleanLabel.includes("rate type")) {
                fieldName = "rateType";
              }
              
              if (fieldName) {
                setFocusedCell({ view: "form", fieldName });
              }
            }}
          >
            <style>{`
              .relative.rounded.border {
                background-color: white !important;
                border: 1px solid #e2e8f0 !important;
                box-shadow: none !important;
              }
              .relative.rounded.border > span.absolute {
                background-color: white !important;
                color: #475569 !important;
                font-weight: 400 !important;
                font-size: 11px !important;
              }
              .z-30.overflow-visible h2 {
                font-weight: 700 !important;
                color: #1f2937 !important;
              }
            `}</style>
            <FormSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <FormInput
                  label="Fiscal Year"
                  required
                  value={selectedFycdRow?.fyCd || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      getRowKey(selectedFycdRow || {}),
                      "fyCd",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Description"
                  required
                  value={selectedFycdRow?.fyDesc || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      getRowKey(selectedFycdRow || {}),
                      "fyDesc",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormSearchSelect
                  label="Status"
                  value={
                    selectedFycdRow?.statusName ||
                    selectedFycdRow?.statusCd ||
                    ""
                  }
                  searchTerm={searchTermProfiles}
                  setSearchTerm={setSearchTermProfiles}
                  options={statusOpt.filter((o) =>
                    o.name
                      .toLowerCase()
                      .includes(searchTermProfiles.toLowerCase()),
                  )}
                  displayKey="name"
                  onSelect={(p) => {
                    const id = getRowKey(selectedFycdRow || {});
                    handleFieldChange(id, "statusCd", p.statusCd);
                    handleFieldChange(id, "statusName", p.name);
                  }}
                />
                <FormSearchSelect
                  label="Rate Type"
                  value={
                    selectedFycdRow?.rateName ||
                    selectedFycdRow?.closeActTgtCd ||
                    ""
                  }
                  searchTerm={searchTermProfiles}
                  setSearchTerm={setSearchTermProfiles}
                  options={rateOpt.filter((o) =>
                    o.name
                      .toLowerCase()
                      .includes(searchTermProfiles.toLowerCase()),
                  )}
                  displayKey="name"
                  onSelect={(p) => {
                    const id = getRowKey(selectedFycdRow || {});
                    handleFieldChange(id, "closeActTgtCd", p.closeActTgtCd);
                    handleFieldChange(id, "rateName", p.name);
                  }}
                />
              </div>
            </FormSection>
          </div>
        ) : (
          <div
            onFocusCapture={(e) => {
              const tr = e.target.closest("tr");
              const td = e.target.closest("td");
              if (!tr || !td) return;

              const rowIndex = tr.sectionRowIndex;
              const siblingTds = Array.from(tr.querySelectorAll("td"));
              const tdIndex = siblingTds.indexOf(td);
              const colIndex = tdIndex - 1; 
              if (colIndex >= 0 && colIndex < myColumns.length) {
                const colKey = myColumns[colIndex].key;
                
                let fieldName = null;
                if (colKey === "fyCd") {
                  fieldName = "fyCd";
                } else if (colKey === "fyDesc") {
                  fieldName = "fyDesc";
                } else if (colKey === "statusName") {
                  fieldName = "status";
                } else if (colKey === "rateName") {
                  fieldName = "rateType";
                }
                
                if (fieldName) {
                  setFocusedCell({ view: "table", rowIndex, fieldName });
                }
              }
            }}
            onMouseDownCapture={(e) => {
              const tr = e.target.closest("tr");
              const td = e.target.closest("td");
              if (!tr || !td) return;

              const rowIndex = tr.sectionRowIndex;
              const siblingTds = Array.from(tr.querySelectorAll("td"));
              const tdIndex = siblingTds.indexOf(td);
              const colIndex = tdIndex - 1; 
              if (colIndex >= 0 && colIndex < myColumns.length) {
                const colKey = myColumns[colIndex].key;
                
                let fieldName = null;
                if (colKey === "fyCd") {
                  fieldName = "fyCd";
                } else if (colKey === "fyDesc") {
                  fieldName = "fyDesc";
                } else if (colKey === "statusName") {
                  fieldName = "status";
                } else if (colKey === "rateName") {
                  fieldName = "rateType";
                }
                
                if (fieldName) {
                  setFocusedCell({ view: "table", rowIndex, fieldName });
                }
              }
            }}
          >
            <ReusableTable
              data={filteredGroups.length > 0 ? filteredGroups : fycd}
              columns={myColumns}
              rowKey="tableRowKey"
              doubleclick={handleRowDoubleClick}
              showCheckboxes={true}
              selectedRows={selectedRows} // Now an array
              onRowSelect={handleRowSelection}
              onSelectAll={handleSelectAll} // Added Select All feature
              onFieldChange={handleFieldChange}
              maxHeight="max-h-[500px]"
            />
          </div>
        )}
      </MainContainer>
      {showSubModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center ">
          <div className="bg-white rounded-xl w-48 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3">
              <h3 className="text-[10px] font-bold text-gray-800 text-center mb-1">
                Initialize Subperiods
              </h3>
              {/* <p className="text-xs text-gray-500 text-center mb-2">
                Enter sub-periods per period (1-4)
              </p> */}

              <div className="flex justify-center">
                <input
                  type="number"
                  autoFocus
                  className="w-16 bg-gray-50 border border-gray-300 rounded py-1.5 text-center text-sm font-semibold text-gray-800 outline-none transition-all"
                  // FIX: Allow empty string so backspace works
                  value={subValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setSubValue(""); // Allows backspace to clear
                      return;
                    }
                    const num = parseInt(val);
                    if (num <= 4) setSubValue(num); // Max limit while typing
                  }}
                  onBlur={() => {
                    if (subValue === "" || subValue < 1) setSubValue(1); // Min limit on blur
                  }}
                  min="1"
                  max="4"
                />
              </div>
            </div>

            {/* Clean, low-profile action buttons */}
            <div className="flex border-t border-gray-100 bg-gray-50/50">
              <button
                className="flex-1 py-3 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors border-r border-gray-100"
                onClick={() => setShowSubModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 text-[10px] font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                disabled={loading}
                onClick={() => {
                  // Safety check for empty value
                  const finalVal = subValue === "" ? 1 : subValue;
                  handleMasterSave(finalVal);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFiscalYear;
