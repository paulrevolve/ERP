// // // // // // // // // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // // // // // // // // import { toast } from "react-toastify";
// // // // // // // // // import { FormInput, FormSearchSelect, FormSection } from "../helper/formSection";
// // // // // // // // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // // // // // // // import { TableSearchSelect } from "../helper/tableSection";
// // // // // // // // // import api from "../utils/api";
// // // // // // // // // import { backendUrl } from "./config";

// // // // // // // // // const ManageLienWaiverInformation = () => {
// // // // // // // // //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// // // // // // // // //   const companyId = user.companyId || "1";

// // // // // // // // //   const [records, setRecords] = useState([]);
// // // // // // // // //   const [originalRecords, setOriginalRecords] = useState([]);
// // // // // // // // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // // // // // // // //   const [selectedRow, setSelectedRow] = useState(null);
// // // // // // // // //   const [isFormView, setIsFormView] = useState(true);
// // // // // // // // //   const [currentIndex, setCurrentIndex] = useState(0);
// // // // // // // // //   const [searchValue, setSearchValue] = useState("");
// // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // //   const [detailClipboard, setDetailClipboard] = useState(null);

// // // // // // // // //   const [projects, setProjects] = useState([]);
// // // // // // // // //   const [vendors, setVendors] = useState([]);
// // // // // // // // //   const [documents, setDocuments] = useState([]);
// // // // // // // // //   const [projectSearch, setProjectSearch] = useState("");
// // // // // // // // //   const [documentSearch, setDocumentSearch] = useState("");

// // // // // // // // //   const initialRecord = {
// // // // // // // // //     lienNo: 0,
// // // // // // // // //     projId: "",
// // // // // // // // //     waiverTypeCd: "",
// // // // // // // // //     vendCustId: "",
// // // // // // // // //     vendorName: "",
// // // // // // // // //     finalWaiverFl: "N",
// // // // // // // // //     lienAmt: 0,
// // // // // // // // //     lienDate: new Date().toISOString(),
// // // // // // // // //     sentDt: new Date().toISOString(),
// // // // // // // // //     returnedDt: null,
// // // // // // // // //     addrDc: "",
// // // // // // // // //     chkNo: null,
// // // // // // // // //     companyId,
// // // // // // // // //     modifiedBy: user.name || "Admin",
// // // // // // // // //   };

// // // // // // // // //   const renderRequiredLabel = (label) => (
// // // // // // // // //     <>
// // // // // // // // //       {label} <span className="text-red-600">*</span>
// // // // // // // // //     </>
// // // // // // // // //   );

// // // // // // // // //   const normalizeOptions = (items, valueKeys, labelKeys) =>
// // // // // // // // //     (Array.isArray(items) ? items : []).map((item) => {
// // // // // // // // //       const value =
// // // // // // // // //         valueKeys
// // // // // // // // //           .map((key) => item?.[key])
// // // // // // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // // // // // //       const label =
// // // // // // // // //         labelKeys
// // // // // // // // //           .map((key) => item?.[key])
// // // // // // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // // // // // //       return { ...item, value: String(value || ""), label: String(label || "") };
// // // // // // // // //     });

// // // // // // // // //   const projectOptions = useMemo(
// // // // // // // // //     () =>
// // // // // // // // //       normalizeOptions(
// // // // // // // // //         projects,
// // // // // // // // //         ["projId", "projectId", "projID", "projectID", "id", "code"],
// // // // // // // // //         ["projName", "projectName", "projectDesc", "name", "description"],
// // // // // // // // //       ),
// // // // // // // // //     [projects],
// // // // // // // // //   );

// // // // // // // // //   const vendorOptions = useMemo(
// // // // // // // // //     () =>
// // // // // // // // //       normalizeOptions(
// // // // // // // // //         vendors,
// // // // // // // // //         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
// // // // // // // // //         ["vendName", "vendorName", "vendorLongName", "name"],
// // // // // // // // //       ),
// // // // // // // // //     [vendors],
// // // // // // // // //   );

// // // // // // // // //   const documentOptions = useMemo(
// // // // // // // // //     () =>
// // // // // // // // //       normalizeOptions(
// // // // // // // // //         documents,
// // // // // // // // //         ["documentCode", "waiverTypeCd", "code", "value"],
// // // // // // // // //         ["documentDescription", "documentName", "description", "label"],
// // // // // // // // //       ),
// // // // // // // // //     [documents],
// // // // // // // // //   );

// // // // // // // // //   const enrichRecord = useCallback((record) => {
// // // // // // // // //     const vendor = vendorOptions.find(
// // // // // // // // //       (item) => String(item.value) === String(record.vendCustId),
// // // // // // // // //     );
// // // // // // // // //     return { ...record, vendorName: record.vendorName || vendor?.label || "" };
// // // // // // // // //   }, [vendorOptions]);

// // // // // // // // //   const getRowId = (row) => row.tempId || row.lienNo;

// // // // // // // // //   const fetchRecords = useCallback(async () => {
// // // // // // // // //     setLoading(true);
// // // // // // // // //     try {
// // // // // // // // //       const response = await api.get(
// // // // // // // // //         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
// // // // // // // // //       );
// // // // // // // // //       const data = (Array.isArray(response.data) ? response.data : []).map(
// // // // // // // // //         enrichRecord,
// // // // // // // // //       );
// // // // // // // // //       setRecords(data);
// // // // // // // // //       setOriginalRecords(data);
// // // // // // // // //       if (data.length > 0) {
// // // // // // // // //         setSelectedRow(data[0]);
// // // // // // // // //         setSelectedRows(new Set([getRowId(data[0])]));
// // // // // // // // //         setCurrentIndex(0);
// // // // // // // // //       } else {
// // // // // // // // //         setSelectedRow(null);
// // // // // // // // //         setSelectedRows(new Set());
// // // // // // // // //         setCurrentIndex(0);
// // // // // // // // //       }
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Fetch lien waiver information error:", error);
// // // // // // // // //       toast.error(
// // // // // // // // //         error.response?.data?.message || "Failed to fetch lien waiver information.",
// // // // // // // // //       );
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   }, [companyId, enrichRecord]);

// // // // // // // // //   const fetchLookups = async () => {
// // // // // // // // //     try {
// // // // // // // // //       const [projectRes, vendorRes, documentRes] = await Promise.all([
// // // // // // // // //         api.get(`${backendUrl}/Project/GetAllProjects`),
// // // // // // // // //         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
// // // // // // // // //         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
// // // // // // // // //       ]);
// // // // // // // // //       setProjects(Array.isArray(projectRes.data) ? projectRes.data : []);
// // // // // // // // //       setVendors(Array.isArray(vendorRes.data) ? vendorRes.data : []);
// // // // // // // // //       setDocuments(Array.isArray(documentRes.data) ? documentRes.data : []);
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Fetch lien waiver lookup error:", error);
// // // // // // // // //       toast.error("Failed to fetch project/vendor/document lookup data.");
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     fetchLookups();
// // // // // // // // //   }, []);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     fetchRecords();
// // // // // // // // //   }, [fetchRecords]);

// // // // // // // // //   const handleInputChange = (field, value, rowId) => {
// // // // // // // // //     setRecords((prev) =>
// // // // // // // // //       prev.map((item) =>
// // // // // // // // //         String(getRowId(item)) === String(rowId)
// // // // // // // // //           ? { ...item, [field]: value, isDirty: true }
// // // // // // // // //           : item,
// // // // // // // // //       ),
// // // // // // // // //     );
// // // // // // // // //     setSelectedRow((prev) =>
// // // // // // // // //       prev && String(getRowId(prev)) === String(rowId)
// // // // // // // // //         ? { ...prev, [field]: value, isDirty: true }
// // // // // // // // //         : prev,
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   const handleVendorSelect = (option, rowId) => {
// // // // // // // // //     handleInputChange("vendCustId", option.value, rowId);
// // // // // // // // //     handleInputChange("vendorName", option.label, rowId);
// // // // // // // // //   };

// // // // // // // // //   const clearDetailFields = () => {
// // // // // // // // //     if (!selectedRow) {
// // // // // // // // //       toast.warn("Please select a waiver record first.");
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     handleInputChange("vendCustId", "", activeRowId);
// // // // // // // // //     handleInputChange("vendorName", "", activeRowId);
// // // // // // // // //     handleInputChange("finalWaiverFl", "N", activeRowId);
// // // // // // // // //   };

// // // // // // // // //   const handleAddDetail = () => {
// // // // // // // // //     clearDetailFields();
// // // // // // // // //   };

// // // // // // // // //   const handleCopyDetail = () => {
// // // // // // // // //     if (!selectedRow?.vendCustId) {
// // // // // // // // //       toast.warn("No vendor detail selected to copy.");
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     setDetailClipboard({
// // // // // // // // //       vendCustId: selectedRow.vendCustId,
// // // // // // // // //       vendorName: selectedRow.vendorName || "",
// // // // // // // // //       finalWaiverFl: selectedRow.finalWaiverFl || "N",
// // // // // // // // //     });
// // // // // // // // //     toast.success("Vendor detail copied.");
// // // // // // // // //   };

// // // // // // // // //   const handleDeleteDetail = () => {
// // // // // // // // //     clearDetailFields();
// // // // // // // // //   };

// // // // // // // // //   const handleAdd = () => {
// // // // // // // // //     const newRow = {
// // // // // // // // //       ...initialRecord,
// // // // // // // // //       tempId: `TEMP_${Date.now()}`,
// // // // // // // // //       isNew: true,
// // // // // // // // //       isDirty: true,
// // // // // // // // //     };
// // // // // // // // //     setRecords([newRow, ...records]);
// // // // // // // // //     setSelectedRow(newRow);
// // // // // // // // //     setSelectedRows(new Set([newRow.tempId]));
// // // // // // // // //     setCurrentIndex(0);
// // // // // // // // //   };

// // // // // // // // //   const validateRows = (rows) => {
// // // // // // // // //     const requiredFields = ["projId", "waiverTypeCd", "vendCustId"];
// // // // // // // // //     for (const row of rows) {
// // // // // // // // //       const missing = requiredFields.find(
// // // // // // // // //         (field) => !row[field] || String(row[field]).trim() === "",
// // // // // // // // //       );
// // // // // // // // //       if (missing) {
// // // // // // // // //         toast.error(
// // // // // // // // //           `Row ${records.indexOf(row) + 1}: ${missing.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`,
// // // // // // // // //         );
// // // // // // // // //         return false;
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //     return true;
// // // // // // // // //   };

// // // // // // // // //   const buildPayload = (row) => {
// // // // // // // // //     const payload = { ...row };
// // // // // // // // //     delete payload.tempId;
// // // // // // // // //     delete payload.isNew;
// // // // // // // // //     delete payload.isDirty;
// // // // // // // // //     delete payload.vendorName;
// // // // // // // // //     return {
// // // // // // // // //       ...payload,
// // // // // // // // //       lienNo: Number(row.lienNo || 0),
// // // // // // // // //       lienAmt: Number(row.lienAmt || 0),
// // // // // // // // //       companyId,
// // // // // // // // //       modifiedBy: user.name || row.modifiedBy || "Admin",
// // // // // // // // //       finalWaiverFl: row.finalWaiverFl || "N",
// // // // // // // // //       lienDate: row.lienDate || new Date().toISOString(),
// // // // // // // // //       sentDt: row.sentDt || new Date().toISOString(),
// // // // // // // // //     };
// // // // // // // // //   };

// // // // // // // // //   const handleSaveAll = async () => {
// // // // // // // // //     const changedRows = records.filter((row) => row.isNew || row.isDirty);
// // // // // // // // //     if (changedRows.length === 0) {
// // // // // // // // //       toast.info("No changes to save.");
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     if (!validateRows(changedRows)) return;

// // // // // // // // //     setLoading(true);
// // // // // // // // //     try {
// // // // // // // // //       await Promise.all(
// // // // // // // // //         changedRows.map((row) =>
// // // // // // // // //           row.isNew
// // // // // // // // //             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
// // // // // // // // //             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
// // // // // // // // //         ),
// // // // // // // // //       );
// // // // // // // // //       toast.success("Lien waiver information saved.");
// // // // // // // // //       fetchRecords();
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Save lien waiver information error:", error);
// // // // // // // // //       toast.error(error.response?.data?.message || "Failed to save changes.");
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleDelete = async () => {
// // // // // // // // //     if (selectedRows.size === 0) {
// // // // // // // // //       toast.warn("Please select at least one waiver record to delete.");
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     setLoading(true);
// // // // // // // // //     try {
// // // // // // // // //       for (const id of Array.from(selectedRows)) {
// // // // // // // // //         if (String(id).startsWith("TEMP_")) {
// // // // // // // // //           setRecords((prev) => prev.filter((item) => item.tempId !== id));
// // // // // // // // //         } else {
// // // // // // // // //           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
// // // // // // // // //         }
// // // // // // // // //       }
// // // // // // // // //       toast.success("Selected waiver record(s) deleted.");
// // // // // // // // //       setSelectedRows(new Set());
// // // // // // // // //       setSelectedRow(null);
// // // // // // // // //       fetchRecords();
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error("Delete lien waiver information error:", error);
// // // // // // // // //       toast.error(error.response?.data?.message || "Failed to delete record.");
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleDiscard = () => {
// // // // // // // // //     setRecords([...originalRecords]);
// // // // // // // // //     setSelectedRows(new Set());
// // // // // // // // //     setSelectedRow(null);
// // // // // // // // //     toast.info("Changes discarded.");
// // // // // // // // //   };

// // // // // // // // //   const handleNavigate = (direction) => {
// // // // // // // // //     if (records.length === 0) return;
// // // // // // // // //     let nextIndex = currentIndex;
// // // // // // // // //     if (direction === "start") nextIndex = 0;
// // // // // // // // //     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
// // // // // // // // //     if (direction === "next")
// // // // // // // // //       nextIndex = Math.min(records.length - 1, currentIndex + 1);
// // // // // // // // //     if (direction === "end") nextIndex = records.length - 1;

// // // // // // // // //     const nextRecord = records[nextIndex];
// // // // // // // // //     setCurrentIndex(nextIndex);
// // // // // // // // //     setSelectedRow(nextRecord);
// // // // // // // // //     setSelectedRows(new Set([getRowId(nextRecord)]));
// // // // // // // // //   };

// // // // // // // // //   const jumpToCode = (code) => {
// // // // // // // // //     const foundIndex = records.findIndex(
// // // // // // // // //       (item) =>
// // // // // // // // //         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
// // // // // // // // //         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
// // // // // // // // //         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
// // // // // // // // //     );
// // // // // // // // //     if (foundIndex === -1) {
// // // // // // // // //       toast.error(`Lien waiver record "${code}" not found.`);
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     const found = records[foundIndex];
// // // // // // // // //     setCurrentIndex(foundIndex);
// // // // // // // // //     setSelectedRow(found);
// // // // // // // // //     setSelectedRows(new Set([getRowId(found)]));
// // // // // // // // //   };

// // // // // // // // //   const toggleSelection = (item, index) => {
// // // // // // // // //     const rowId = getRowId(item);
// // // // // // // // //     const next = new Set(selectedRows);
// // // // // // // // //     if (next.has(rowId)) {
// // // // // // // // //       next.delete(rowId);
// // // // // // // // //       setSelectedRow(null);
// // // // // // // // //     } else {
// // // // // // // // //       next.add(rowId);
// // // // // // // // //       setSelectedRow(item);
// // // // // // // // //       setCurrentIndex(index);
// // // // // // // // //     }
// // // // // // // // //     setSelectedRows(next);
// // // // // // // // //   };

// // // // // // // // //   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

// // // // // // // // //   return (
// // // // // // // // //     <div className="mt-14 ml-4">
// // // // // // // // //       <MainContainer title="Manage Lien Waiver Information">
// // // // // // // // //         <Toolbar
// // // // // // // // //           isFormView={isFormView}
// // // // // // // // //           totalRecords={records.length}
// // // // // // // // //           selectedRow={selectedRow}
// // // // // // // // //           currentIndex={currentIndex}
// // // // // // // // //           handleNavigate={handleNavigate}
// // // // // // // // //           jumpToCode={jumpToCode}
// // // // // // // // //           searchValue={searchValue}
// // // // // // // // //           setSearchValue={setSearchValue}
// // // // // // // // //           loading={loading}
// // // // // // // // //           actions={{
// // // // // // // // //             onAdd: handleAdd,
// // // // // // // // //             onSave: handleSaveAll,
// // // // // // // // //             onDelete: handleDelete,
// // // // // // // // //             onClear: handleDiscard,
// // // // // // // // //             onToggleView: () => setIsFormView(!isFormView),
// // // // // // // // //           }}
// // // // // // // // //           buttonsDisable={["copy", "paste"]}
// // // // // // // // //         />

// // // // // // // // //         {isFormView ? (
// // // // // // // // //           <div className="p-2 space-y-3">
// // // // // // // // //             <FormSection title="Identification">
// // // // // // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // // // // // //                 <FormSearchSelect
// // // // // // // // //                   label={renderRequiredLabel("Project")}
// // // // // // // // //                   value={selectedRow?.projId || ""}
// // // // // // // // //                   searchTerm={projectSearch}
// // // // // // // // //                   setSearchTerm={setProjectSearch}
// // // // // // // // //                   options={projectOptions}
// // // // // // // // //                   displayKey="value"
// // // // // // // // //                   secondaryKey="label"
// // // // // // // // //                   onSelect={(option) =>
// // // // // // // // //                     handleInputChange("projId", option.value, activeRowId)
// // // // // // // // //                   }
// // // // // // // // //                 />
// // // // // // // // //               </div>
// // // // // // // // //             </FormSection>

// // // // // // // // //             <FormSection title="Waiver Document Information">
// // // // // // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // // // // // //                 <FormSearchSelect
// // // // // // // // //                   label="Waiver Doc Cd"
// // // // // // // // //                   value={selectedRow?.waiverTypeCd || ""}
// // // // // // // // //                   searchTerm={documentSearch}
// // // // // // // // //                   setSearchTerm={setDocumentSearch}
// // // // // // // // //                   options={documentOptions}
// // // // // // // // //                   displayKey="value"
// // // // // // // // //                   secondaryKey="label"
// // // // // // // // //                   onSelect={(option) =>
// // // // // // // // //                     handleInputChange("waiverTypeCd", option.value, activeRowId)
// // // // // // // // //                   }
// // // // // // // // //                 />
// // // // // // // // //               </div>
// // // // // // // // //             </FormSection>

// // // // // // // // //           </div>
// // // // // // // // //         ) : (
// // // // // // // // //           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
// // // // // // // // //             <table className="min-w-full text-sm">
// // // // // // // // //               <thead className="bg-gray-200 sticky top-0 z-10">
// // // // // // // // //                 <tr>
// // // // // // // // //                   <th className="th-thead w-10"></th>
// // // // // // // // //                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
// // // // // // // // //                   <th className="th-thead">Waiver Doc Cd</th>
// // // // // // // // //                 </tr>
// // // // // // // // //               </thead>
// // // // // // // // //               <tbody className="tbody">
// // // // // // // // //                 {records.map((item, index) => {
// // // // // // // // //                   const rowId = getRowId(item);
// // // // // // // // //                   return (
// // // // // // // // //                     <tr
// // // // // // // // //                       key={rowId}
// // // // // // // // //                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
// // // // // // // // //                     >
// // // // // // // // //                       <td className="tbody-td text-center">
// // // // // // // // //                         <input
// // // // // // // // //                           type="checkbox"
// // // // // // // // //                           className="h-3 w-3 accent-blue-600"
// // // // // // // // //                           checked={selectedRows.has(rowId)}
// // // // // // // // //                           onChange={() => toggleSelection(item, index)}
// // // // // // // // //                         />
// // // // // // // // //                       </td>
// // // // // // // // //                       <td className="tbody-td">
// // // // // // // // //                         <TableSearchSelect
// // // // // // // // //                           options={projectOptions}
// // // // // // // // //                           value={item.projId || ""}
// // // // // // // // //                           displayKey="value"
// // // // // // // // //                           secondaryKey="label"
// // // // // // // // //                           onSelect={(option) =>
// // // // // // // // //                             handleInputChange("projId", option.value, rowId)
// // // // // // // // //                           }
// // // // // // // // //                         />
// // // // // // // // //                       </td>
// // // // // // // // //                       <td className="tbody-td">
// // // // // // // // //                         <TableSearchSelect
// // // // // // // // //                           options={documentOptions}
// // // // // // // // //                           value={item.waiverTypeCd || ""}
// // // // // // // // //                           displayKey="value"
// // // // // // // // //                           secondaryKey="label"
// // // // // // // // //                           onSelect={(option) =>
// // // // // // // // //                             handleInputChange(
// // // // // // // // //                               "waiverTypeCd",
// // // // // // // // //                               option.value,
// // // // // // // // //                               rowId,
// // // // // // // // //                             )
// // // // // // // // //                           }
// // // // // // // // //                         />
// // // // // // // // //                       </td>
// // // // // // // // //                     </tr>
// // // // // // // // //                   );
// // // // // // // // //                 })}
// // // // // // // // //               </tbody>
// // // // // // // // //             </table>
// // // // // // // // //           </div>
// // // // // // // // //         )}
// // // // // // // // //       </MainContainer>

// // // // // // // // //       <SecondaryContainer
// // // // // // // // //         title="Manage Project Waiver Information Detail"
// // // // // // // // //         className="mt-3"
// // // // // // // // //       >
// // // // // // // // //         <Toolbar
// // // // // // // // //           isFormView={false}
// // // // // // // // //           totalRecords={selectedRow ? 1 : 0}
// // // // // // // // //           selectedRow={selectedRow}
// // // // // // // // //           loading={loading}
// // // // // // // // //           actions={{
// // // // // // // // //             onAdd: handleAddDetail,
// // // // // // // // //             onCopy: handleCopyDetail,
// // // // // // // // //             onDelete: handleDeleteDetail,
// // // // // // // // //           }}
// // // // // // // // //           clipboard={detailClipboard ? [detailClipboard] : []}
// // // // // // // // //           buttonsDisable={["paste", "discard", "save", "tableform"]}
// // // // // // // // //         />
// // // // // // // // //         <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
// // // // // // // // //           <table className="min-w-full text-sm">
// // // // // // // // //             <thead className="bg-gray-200 sticky top-0 z-10">
// // // // // // // // //               <tr>
// // // // // // // // //                 <th className="th-thead w-10"></th>
// // // // // // // // //                 <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
// // // // // // // // //                 <th className="th-thead">Vendor Name</th>
// // // // // // // // //                 <th className="th-thead">Print Final Waiver</th>
// // // // // // // // //               </tr>
// // // // // // // // //             </thead>
// // // // // // // // //             <tbody className="tbody">
// // // // // // // // //               {selectedRow && (
// // // // // // // // //                 <tr>
// // // // // // // // //                   <td className="tbody-td text-center">
// // // // // // // // //                     <input
// // // // // // // // //                       type="checkbox"
// // // // // // // // //                       className="h-3 w-3 accent-blue-600"
// // // // // // // // //                       checked={selectedRows.has(activeRowId)}
// // // // // // // // //                       onChange={() => toggleSelection(selectedRow, currentIndex)}
// // // // // // // // //                     />
// // // // // // // // //                   </td>
// // // // // // // // //                   <td className="tbody-td">
// // // // // // // // //                     <TableSearchSelect
// // // // // // // // //                       options={vendorOptions}
// // // // // // // // //                       value={selectedRow.vendCustId || ""}
// // // // // // // // //                       displayKey="value"
// // // // // // // // //                       secondaryKey="label"
// // // // // // // // //                       onSelect={(option) => handleVendorSelect(option, activeRowId)}
// // // // // // // // //                     />
// // // // // // // // //                   </td>
// // // // // // // // //                   <td className="tbody-td">
// // // // // // // // //                     <input
// // // // // // // // //                       className="td-input bg-gray-100 min-w-[220px]"
// // // // // // // // //                       value={selectedRow.vendorName || ""}
// // // // // // // // //                       readOnly
// // // // // // // // //                     />
// // // // // // // // //                   </td>
// // // // // // // // //                   <td className="tbody-td text-center">
// // // // // // // // //                     <input
// // // // // // // // //                       type="checkbox"
// // // // // // // // //                       className="h-3 w-3 accent-blue-600"
// // // // // // // // //                       checked={selectedRow.finalWaiverFl === "Y"}
// // // // // // // // //                       onChange={(e) =>
// // // // // // // // //                         handleInputChange(
// // // // // // // // //                           "finalWaiverFl",
// // // // // // // // //                           e.target.checked ? "Y" : "N",
// // // // // // // // //                           activeRowId,
// // // // // // // // //                         )
// // // // // // // // //                       }
// // // // // // // // //                     />
// // // // // // // // //                   </td>
// // // // // // // // //                 </tr>
// // // // // // // // //               )}
// // // // // // // // //             </tbody>
// // // // // // // // //           </table>
// // // // // // // // //         </div>
// // // // // // // // //       </SecondaryContainer>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default ManageLienWaiverInformation;

// // // // // // // // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // // // // // // // import { toast } from "react-toastify";
// // // // // // // // import { FormInput, FormSection } from "../helper/formSection";
// // // // // // // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // // // // // // import api from "../utils/api";
// // // // // // // // import { backendUrl } from "./config";

// // // // // // // // const FreeTextSearchSelect = ({
// // // // // // // //   label,
// // // // // // // //   value,
// // // // // // // //   options = [],
// // // // // // // //   onValueChange,
// // // // // // // //   onSelect,
// // // // // // // // }) => {
// // // // // // // //   const [open, setOpen] = useState(false);
// // // // // // // //   const [search, setSearch] = useState("");
// // // // // // // //   const displayValue = open ? search : value || "";
// // // // // // // //   const filteredOptions = options.filter((option) => {
// // // // // // // //     const term = search.toLowerCase();
// // // // // // // //     return (
// // // // // // // //       String(option.value || "").toLowerCase().includes(term) ||
// // // // // // // //       String(option.label || "").toLowerCase().includes(term)
// // // // // // // //     );
// // // // // // // //   });

// // // // // // // //   return (
// // // // // // // //     <div className={label ? "space-x-4 flex items-center relative" : "relative w-full min-w-[150px]"}>
// // // // // // // //       {label && (
// // // // // // // //         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
// // // // // // // //           {label}
// // // // // // // //         </label>
// // // // // // // //       )}
// // // // // // // //       <div className="relative flex-1">
// // // // // // // //         <input
// // // // // // // //           className="border outline-none w-full border-gray-300 pl-2 pr-8 py-0.5 rounded text-[10px] bg-white focus:border-[#17414d]"
// // // // // // // //           value={displayValue}
// // // // // // // //           onChange={(event) => {
// // // // // // // //             setSearch(event.target.value);
// // // // // // // //             onValueChange(event.target.value);
// // // // // // // //             setOpen(true);
// // // // // // // //           }}
// // // // // // // //           onFocus={() => {
// // // // // // // //             setSearch(value || "");
// // // // // // // //             setOpen(true);
// // // // // // // //           }}
// // // // // // // //           autoComplete="off"
// // // // // // // //         />
// // // // // // // //         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
// // // // // // // //           ⌕
// // // // // // // //         </span>
// // // // // // // //         {open && (
// // // // // // // //           <>
// // // // // // // //             <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
// // // // // // // //               {filteredOptions.length > 0 ? (
// // // // // // // //                 filteredOptions.map((option, index) => (
// // // // // // // //                   <div
// // // // // // // //                     key={`${option.value}-${index}`}
// // // // // // // //                     className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // // // // // // //                     onClick={() => {
// // // // // // // //                       onSelect(option);
// // // // // // // //                       setSearch("");
// // // // // // // //                       setOpen(false);
// // // // // // // //                     }}
// // // // // // // //                   >
// // // // // // // //                     <span className="font-[400] text-black">{option.value}</span>
// // // // // // // //                     {option.label && (
// // // // // // // //                       <span className="text-gray-400 ml-2">({option.label})</span>
// // // // // // // //                     )}
// // // // // // // //                   </div>
// // // // // // // //                 ))
// // // // // // // //               ) : (
// // // // // // // //                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
// // // // // // // //                   No options found. You can type a value.
// // // // // // // //                 </div>
// // // // // // // //               )}
// // // // // // // //             </div>
// // // // // // // //             <div
// // // // // // // //               className="fixed inset-0 z-[90]"
// // // // // // // //               onClick={() => {
// // // // // // // //                 setSearch("");
// // // // // // // //                 setOpen(false);
// // // // // // // //               }}
// // // // // // // //             />
// // // // // // // //           </>
// // // // // // // //         )}
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const ManageLienWaiverInformation = () => {
// // // // // // // //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// // // // // // // //   const companyId = user.companyId || "1";

// // // // // // // //   const [records, setRecords] = useState([]);
// // // // // // // //   const [originalRecords, setOriginalRecords] = useState([]);
// // // // // // // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // // // // // // //   const [selectedRow, setSelectedRow] = useState(null);
// // // // // // // //   const [detailRow, setDetailRow] = useState(null);
// // // // // // // //   const [detailSelected, setDetailSelected] = useState(false);
// // // // // // // //   const [isFormView, setIsFormView] = useState(true);
// // // // // // // //   const [currentIndex, setCurrentIndex] = useState(0);
// // // // // // // //   const [searchValue, setSearchValue] = useState("");
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const [detailClipboard, setDetailClipboard] = useState(null);

// // // // // // // //   const [projects, setProjects] = useState([]);
// // // // // // // //   const [vendors, setVendors] = useState([]);
// // // // // // // //   const [documents, setDocuments] = useState([]);

// // // // // // // //   const initialRecord = {
// // // // // // // //     lienNo: 0,
// // // // // // // //     projId: "",
// // // // // // // //     projectDescription: "",
// // // // // // // //     waiverTypeCd: "",
// // // // // // // //     vendCustId: "",
// // // // // // // //     vendorName: "",
// // // // // // // //     finalWaiverFl: "N",
// // // // // // // //     lienAmt: 0,
// // // // // // // //     lienDate: new Date().toISOString(),
// // // // // // // //     sentDt: new Date().toISOString(),
// // // // // // // //     returnedDt: null,
// // // // // // // //     addrDc: "",
// // // // // // // //     chkNo: null,
// // // // // // // //     companyId,
// // // // // // // //     modifiedBy: user.name || "Admin",
// // // // // // // //   };

// // // // // // // //   const renderRequiredLabel = (label) => (
// // // // // // // //     <>
// // // // // // // //       {label} <span className="text-red-600">*</span>
// // // // // // // //     </>
// // // // // // // //   );

// // // // // // // //   const extractList = (payload) => {
// // // // // // // //     if (Array.isArray(payload)) return payload;
// // // // // // // //     if (Array.isArray(payload?.data)) return payload.data;
// // // // // // // //     if (Array.isArray(payload?.items)) return payload.items;
// // // // // // // //     if (Array.isArray(payload?.result)) return payload.result;
// // // // // // // //     if (Array.isArray(payload?.records)) return payload.records;
// // // // // // // //     return [];
// // // // // // // //   };

// // // // // // // //   const normalizeOptions = (items, valueKeys, labelKeys) =>
// // // // // // // //     (Array.isArray(items) ? items : []).map((item) => {
// // // // // // // //       const value =
// // // // // // // //         valueKeys
// // // // // // // //           .map((key) => item?.[key])
// // // // // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // // // // //       const label =
// // // // // // // //         labelKeys
// // // // // // // //           .map((key) => item?.[key])
// // // // // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // // // // //       return { ...item, value: String(value || ""), label: String(label || "") };
// // // // // // // //     });

// // // // // // // //   const projectOptions = useMemo(
// // // // // // // //     () =>
// // // // // // // //       normalizeOptions(
// // // // // // // //         projects,
// // // // // // // //         ["projId", "projectId", "projID", "projectID", "id", "code"],
// // // // // // // //         [
// // // // // // // //           "projName",
// // // // // // // //           "projectName",
// // // // // // // //           "projectDesc",
// // // // // // // //           "projDescription",
// // // // // // // //           "description",
// // // // // // // //           "name",
// // // // // // // //         ],
// // // // // // // //       ),
// // // // // // // //     [projects],
// // // // // // // //   );

// // // // // // // //   const vendorOptions = useMemo(
// // // // // // // //     () =>
// // // // // // // //       normalizeOptions(
// // // // // // // //         vendors,
// // // // // // // //         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
// // // // // // // //         ["vendName", "vendorName", "vendorLongName", "name"],
// // // // // // // //       ),
// // // // // // // //     [vendors],
// // // // // // // //   );

// // // // // // // //   const documentOptions = useMemo(
// // // // // // // //     () =>
// // // // // // // //       normalizeOptions(
// // // // // // // //         documents,
// // // // // // // //         ["documentCode", "waiverTypeCd", "code", "value"],
// // // // // // // //         ["documentDescription", "documentName", "description", "label"],
// // // // // // // //       ),
// // // // // // // //     [documents],
// // // // // // // //   );

// // // // // // // //   const enrichRecord = useCallback((record) => {
// // // // // // // //     const vendor = vendorOptions.find(
// // // // // // // //       (item) => String(item.value) === String(record.vendCustId),
// // // // // // // //     );
// // // // // // // //     const project = projectOptions.find(
// // // // // // // //       (item) => String(item.value) === String(record.projId),
// // // // // // // //     );
// // // // // // // //     return {
// // // // // // // //       ...record,
// // // // // // // //       vendorName: record.vendorName || vendor?.label || "",
// // // // // // // //       projectDescription: record.projectDescription || project?.label || "",
// // // // // // // //     };
// // // // // // // //   }, [projectOptions, vendorOptions]);

// // // // // // // //   const getRowId = (row) => row.tempId || row.lienNo;

// // // // // // // //   const fetchRecords = useCallback(async () => {
// // // // // // // //     setLoading(true);
// // // // // // // //     try {
// // // // // // // //       const response = await api.get(
// // // // // // // //         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
// // // // // // // //       );
// // // // // // // //       const data = (Array.isArray(response.data) ? response.data : []).map(
// // // // // // // //         enrichRecord,
// // // // // // // //       );
// // // // // // // //       setRecords(data);
// // // // // // // //       setOriginalRecords(data);
// // // // // // // //       if (data.length > 0) {
// // // // // // // //         setSelectedRow(data[0]);
// // // // // // // //         setSelectedRows(new Set([getRowId(data[0])]));
// // // // // // // //         setCurrentIndex(0);
// // // // // // // //       } else {
// // // // // // // //         setSelectedRow(null);
// // // // // // // //         setSelectedRows(new Set());
// // // // // // // //         setCurrentIndex(0);
// // // // // // // //       }
// // // // // // // //       setDetailRow(null);
// // // // // // // //       setDetailSelected(false);
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Fetch lien waiver information error:", error);
// // // // // // // //       toast.error(
// // // // // // // //         error.response?.data?.message || "Failed to fetch lien waiver information.",
// // // // // // // //       );
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   }, [companyId, enrichRecord]);

// // // // // // // //   const fetchLookups = useCallback(async () => {
// // // // // // // //     try {
// // // // // // // //       const [projectRes, vendorRes, documentRes] = await Promise.all([
// // // // // // // //         api.get(`${backendUrl}/Project/GetAllProjects`),
// // // // // // // //         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
// // // // // // // //         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
// // // // // // // //       ]);
// // // // // // // //       setProjects(extractList(projectRes.data));
// // // // // // // //       setVendors(extractList(vendorRes.data));
// // // // // // // //       setDocuments(extractList(documentRes.data));
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Fetch lien waiver lookup error:", error);
// // // // // // // //       toast.error("Failed to fetch project/vendor/document lookup data.");
// // // // // // // //     }
// // // // // // // //   }, []);

// // // // // // // //   useEffect(() => {
// // // // // // // //     fetchLookups();
// // // // // // // //   }, [fetchLookups]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     fetchRecords();
// // // // // // // //   }, [fetchRecords]);

// // // // // // // //   const handleInputChange = (field, value, rowId) => {
// // // // // // // //     setRecords((prev) =>
// // // // // // // //       prev.map((item) =>
// // // // // // // //         String(getRowId(item)) === String(rowId)
// // // // // // // //           ? { ...item, [field]: value, isDirty: true }
// // // // // // // //           : item,
// // // // // // // //       ),
// // // // // // // //     );
// // // // // // // //     setSelectedRow((prev) =>
// // // // // // // //       prev && String(getRowId(prev)) === String(rowId)
// // // // // // // //         ? { ...prev, [field]: value, isDirty: true }
// // // // // // // //         : prev,
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   const handleVendorSelect = (option) => {
// // // // // // // //     handleDetailInputChange("vendCustId", option.value);
// // // // // // // //     handleDetailInputChange("vendorName", option.label);
// // // // // // // //   };

// // // // // // // //   const handleProjectSelect = (option, rowId) => {
// // // // // // // //     handleInputChange("projId", option.value, rowId);
// // // // // // // //     handleInputChange("projectDescription", option.label, rowId);
// // // // // // // //   };

// // // // // // // //   const handleDetailInputChange = (field, value) => {
// // // // // // // //     if (!detailRow) return;
// // // // // // // //     setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// // // // // // // //     if (selectedRow) {
// // // // // // // //       handleInputChange(field, value, activeRowId);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const clearDetailFields = () => {
// // // // // // // //     if (!detailRow) {
// // // // // // // //       toast.warn("Please select a waiver record first.");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     handleDetailInputChange("vendCustId", "");
// // // // // // // //     handleDetailInputChange("vendorName", "");
// // // // // // // //     handleDetailInputChange("finalWaiverFl", "N");
// // // // // // // //   };

// // // // // // // //   const handleAddDetail = () => {
// // // // // // // //     clearDetailFields();
// // // // // // // //   };

// // // // // // // //   const handleCopyDetail = () => {
// // // // // // // //     if (!detailRow?.vendCustId) {
// // // // // // // //       toast.warn("No vendor detail selected to copy.");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     setDetailClipboard({
// // // // // // // //       vendCustId: detailRow.vendCustId,
// // // // // // // //       vendorName: detailRow.vendorName || "",
// // // // // // // //       finalWaiverFl: detailRow.finalWaiverFl || "N",
// // // // // // // //     });
// // // // // // // //     toast.success("Vendor detail copied.");
// // // // // // // //   };

// // // // // // // //   const handleDeleteDetail = () => {
// // // // // // // //     clearDetailFields();
// // // // // // // //   };

// // // // // // // //   const handleAdd = () => {
// // // // // // // //     const newRow = {
// // // // // // // //       ...initialRecord,
// // // // // // // //       tempId: `TEMP_${Date.now()}`,
// // // // // // // //       isNew: true,
// // // // // // // //       isDirty: true,
// // // // // // // //     };
// // // // // // // //     setRecords([newRow, ...records]);
// // // // // // // //     setSelectedRow(newRow);
// // // // // // // //     setSelectedRows(new Set([newRow.tempId]));
// // // // // // // //     setDetailRow(null);
// // // // // // // //     setDetailSelected(false);
// // // // // // // //     setCurrentIndex(0);
// // // // // // // //   };

// // // // // // // //   const validateRows = (rows) => {
// // // // // // // //     const requiredFields = ["projId", "waiverTypeCd"];
// // // // // // // //     for (const row of rows) {
// // // // // // // //       const missing = requiredFields.find(
// // // // // // // //         (field) => !row[field] || String(row[field]).trim() === "",
// // // // // // // //       );
// // // // // // // //       if (missing) {
// // // // // // // //         toast.error(
// // // // // // // //           `Row ${records.indexOf(row) + 1}: ${missing.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`,
// // // // // // // //         );
// // // // // // // //         return false;
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //     return true;
// // // // // // // //   };

// // // // // // // //   const buildPayload = (row) => {
// // // // // // // //     const payload = { ...row };
// // // // // // // //     delete payload.tempId;
// // // // // // // //     delete payload.isNew;
// // // // // // // //     delete payload.isDirty;
// // // // // // // //     delete payload.vendorName;
// // // // // // // //     delete payload.projectDescription;
// // // // // // // //     return {
// // // // // // // //       ...payload,
// // // // // // // //       lienNo: Number(row.lienNo || 0),
// // // // // // // //       lienAmt: Number(row.lienAmt || 0),
// // // // // // // //       companyId,
// // // // // // // //       modifiedBy: user.name || row.modifiedBy || "Admin",
// // // // // // // //       finalWaiverFl: row.finalWaiverFl || "N",
// // // // // // // //       lienDate: row.lienDate || new Date().toISOString(),
// // // // // // // //       sentDt: row.sentDt || new Date().toISOString(),
// // // // // // // //     };
// // // // // // // //   };

// // // // // // // //   const handleSaveAll = async () => {
// // // // // // // //     const changedRows = records.filter((row) => row.isNew || row.isDirty);
// // // // // // // //     if (changedRows.length === 0) {
// // // // // // // //       toast.info("No changes to save.");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     if (!validateRows(changedRows)) return;

// // // // // // // //     setLoading(true);
// // // // // // // //     try {
// // // // // // // //       await Promise.all(
// // // // // // // //         changedRows.map((row) =>
// // // // // // // //           row.isNew
// // // // // // // //             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
// // // // // // // //             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
// // // // // // // //         ),
// // // // // // // //       );
// // // // // // // //       toast.success("Lien waiver information saved.");
// // // // // // // //       setDetailRow(null);
// // // // // // // //       setDetailSelected(false);
// // // // // // // //       fetchRecords();
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Save lien waiver information error:", error);
// // // // // // // //       toast.error(error.response?.data?.message || "Failed to save changes.");
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleDelete = async () => {
// // // // // // // //     if (selectedRows.size === 0) {
// // // // // // // //       toast.warn("Please select at least one waiver record to delete.");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     setLoading(true);
// // // // // // // //     try {
// // // // // // // //       for (const id of Array.from(selectedRows)) {
// // // // // // // //         if (String(id).startsWith("TEMP_")) {
// // // // // // // //           setRecords((prev) => prev.filter((item) => item.tempId !== id));
// // // // // // // //         } else {
// // // // // // // //           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
// // // // // // // //         }
// // // // // // // //       }
// // // // // // // //       toast.success("Selected waiver record(s) deleted.");
// // // // // // // //       setSelectedRows(new Set());
// // // // // // // //       setSelectedRow(null);
// // // // // // // //       setDetailRow(null);
// // // // // // // //       setDetailSelected(false);
// // // // // // // //       fetchRecords();
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Delete lien waiver information error:", error);
// // // // // // // //       toast.error(error.response?.data?.message || "Failed to delete record.");
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleDiscard = () => {
// // // // // // // //     setRecords([...originalRecords]);
// // // // // // // //     setSelectedRows(new Set());
// // // // // // // //     setSelectedRow(null);
// // // // // // // //     setDetailRow(null);
// // // // // // // //     setDetailSelected(false);
// // // // // // // //     toast.info("Changes discarded.");
// // // // // // // //   };

// // // // // // // //   const handleNavigate = (direction) => {
// // // // // // // //     if (records.length === 0) return;
// // // // // // // //     let nextIndex = currentIndex;
// // // // // // // //     if (direction === "start") nextIndex = 0;
// // // // // // // //     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
// // // // // // // //     if (direction === "next")
// // // // // // // //       nextIndex = Math.min(records.length - 1, currentIndex + 1);
// // // // // // // //     if (direction === "end") nextIndex = records.length - 1;

// // // // // // // //     const nextRecord = records[nextIndex];
// // // // // // // //     setCurrentIndex(nextIndex);
// // // // // // // //     setSelectedRow(nextRecord);
// // // // // // // //     setSelectedRows(new Set([getRowId(nextRecord)]));
// // // // // // // //     setDetailRow(null);
// // // // // // // //     setDetailSelected(false);
// // // // // // // //   };

// // // // // // // //   const jumpToCode = (code) => {
// // // // // // // //     const foundIndex = records.findIndex(
// // // // // // // //       (item) =>
// // // // // // // //         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
// // // // // // // //         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
// // // // // // // //         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
// // // // // // // //     );
// // // // // // // //     if (foundIndex === -1) {
// // // // // // // //       toast.error(`Lien waiver record "${code}" not found.`);
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     const found = records[foundIndex];
// // // // // // // //     setCurrentIndex(foundIndex);
// // // // // // // //     setSelectedRow(found);
// // // // // // // //     setSelectedRows(new Set([getRowId(found)]));
// // // // // // // //     setDetailRow(null);
// // // // // // // //     setDetailSelected(false);
// // // // // // // //   };

// // // // // // // //   const fetchDetailForRow = async (item) => {
// // // // // // // //     if (!item?.lienNo || String(item.lienNo) === "0") {
// // // // // // // //       setDetailRow(null);
// // // // // // // //       setDetailSelected(false);
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     setLoading(true);
// // // // // // // //     try {
// // // // // // // //       const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
// // // // // // // //       const detail = enrichRecord(response.data || item);
// // // // // // // //       setDetailRow(detail);
// // // // // // // //       setDetailSelected(true);
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error("Fetch lien waiver detail error:", error);
// // // // // // // //       setDetailRow(null);
// // // // // // // //       setDetailSelected(false);
// // // // // // // //       toast.error(error.response?.data?.message || "Failed to fetch waiver detail.");
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const toggleSelection = (item, index) => {
// // // // // // // //     const rowId = getRowId(item);
// // // // // // // //     const next = new Set(selectedRows);
// // // // // // // //     if (next.has(rowId)) {
// // // // // // // //       next.delete(rowId);
// // // // // // // //       setSelectedRow(null);
// // // // // // // //       setDetailRow(null);
// // // // // // // //       setDetailSelected(false);
// // // // // // // //     } else {
// // // // // // // //       next.clear();
// // // // // // // //       next.add(rowId);
// // // // // // // //       setSelectedRow(item);
// // // // // // // //       setCurrentIndex(index);
// // // // // // // //       if (!String(rowId).startsWith("TEMP_")) {
// // // // // // // //         fetchDetailForRow(item);
// // // // // // // //       } else {
// // // // // // // //         setDetailRow(null);
// // // // // // // //         setDetailSelected(false);
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //     setSelectedRows(next);
// // // // // // // //   };

// // // // // // // //   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

// // // // // // // //   return (
// // // // // // // //     <div className="mt-14 ml-4">
// // // // // // // //       <MainContainer title="Manage Lien Waiver Information">
// // // // // // // //         <Toolbar
// // // // // // // //           isFormView={isFormView}
// // // // // // // //           totalRecords={records.length}
// // // // // // // //           selectedRow={selectedRow}
// // // // // // // //           currentIndex={currentIndex}
// // // // // // // //           handleNavigate={handleNavigate}
// // // // // // // //           jumpToCode={jumpToCode}
// // // // // // // //           searchValue={searchValue}
// // // // // // // //           setSearchValue={setSearchValue}
// // // // // // // //           loading={loading}
// // // // // // // //           actions={{
// // // // // // // //             onAdd: handleAdd,
// // // // // // // //             onSave: handleSaveAll,
// // // // // // // //             onDelete: handleDelete,
// // // // // // // //             onClear: handleDiscard,
// // // // // // // //             onToggleView: () => setIsFormView(!isFormView),
// // // // // // // //           }}
// // // // // // // //           buttonsDisable={["copy", "paste"]}
// // // // // // // //         />

// // // // // // // //         {isFormView ? (
// // // // // // // //           <div className="p-2 space-y-3">
// // // // // // // //             <FormSection title="Identification">
// // // // // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // // // // //                 <FreeTextSearchSelect
// // // // // // // //                   label={renderRequiredLabel("Project")}
// // // // // // // //                   value={selectedRow?.projId || ""}
// // // // // // // //                   options={projectOptions}
// // // // // // // //                   onValueChange={(value) =>
// // // // // // // //                     handleInputChange("projId", value, activeRowId)
// // // // // // // //                   }
// // // // // // // //                   onSelect={(option) => handleProjectSelect(option, activeRowId)}
// // // // // // // //                 />
// // // // // // // //                 <FormInput
// // // // // // // //                   label="Project Description"
// // // // // // // //                   value={selectedRow?.projectDescription || ""}
// // // // // // // //                   readOnly
// // // // // // // //                 />
// // // // // // // //               </div>
// // // // // // // //             </FormSection>

// // // // // // // //             <FormSection title="Waiver Document Information">
// // // // // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // // // // //                 <FreeTextSearchSelect
// // // // // // // //                   label="Waiver Doc Cd"
// // // // // // // //                   value={selectedRow?.waiverTypeCd || ""}
// // // // // // // //                   options={documentOptions}
// // // // // // // //                   onValueChange={(value) =>
// // // // // // // //                     handleInputChange("waiverTypeCd", value, activeRowId)
// // // // // // // //                   }
// // // // // // // //                   onSelect={(option) =>
// // // // // // // //                     handleInputChange("waiverTypeCd", option.value, activeRowId)
// // // // // // // //                   }
// // // // // // // //                 />
// // // // // // // //               </div>
// // // // // // // //             </FormSection>

// // // // // // // //           </div>
// // // // // // // //         ) : (
// // // // // // // //           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
// // // // // // // //             <table className="min-w-full text-sm">
// // // // // // // //               <thead className="bg-gray-200 sticky top-0 z-10">
// // // // // // // //                 <tr>
// // // // // // // //                   <th className="th-thead w-10"></th>
// // // // // // // //                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
// // // // // // // //                   <th className="th-thead">Project Description</th>
// // // // // // // //                   <th className="th-thead">Waiver Doc Cd</th>
// // // // // // // //                 </tr>
// // // // // // // //               </thead>
// // // // // // // //               <tbody className="tbody">
// // // // // // // //                 {records.map((item, index) => {
// // // // // // // //                   const rowId = getRowId(item);
// // // // // // // //                   return (
// // // // // // // //                     <tr
// // // // // // // //                       key={rowId}
// // // // // // // //                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
// // // // // // // //                     >
// // // // // // // //                       <td className="tbody-td text-center">
// // // // // // // //                         <input
// // // // // // // //                           type="checkbox"
// // // // // // // //                           className="h-3 w-3 accent-blue-600"
// // // // // // // //                           checked={selectedRows.has(rowId)}
// // // // // // // //                           onChange={() => toggleSelection(item, index)}
// // // // // // // //                         />
// // // // // // // //                       </td>
// // // // // // // //                       <td className="tbody-td">
// // // // // // // //                         <FreeTextSearchSelect
// // // // // // // //                           options={projectOptions}
// // // // // // // //                           value={item.projId || ""}
// // // // // // // //                           onValueChange={(value) =>
// // // // // // // //                             handleInputChange("projId", value, rowId)
// // // // // // // //                           }
// // // // // // // //                           onSelect={(option) => handleProjectSelect(option, rowId)}
// // // // // // // //                         />
// // // // // // // //                       </td>
// // // // // // // //                       <td className="tbody-td">
// // // // // // // //                         <input
// // // // // // // //                           className="td-input bg-gray-100 min-w-[220px]"
// // // // // // // //                           value={item.projectDescription || ""}
// // // // // // // //                           readOnly
// // // // // // // //                         />
// // // // // // // //                       </td>
// // // // // // // //                       <td className="tbody-td">
// // // // // // // //                         <FreeTextSearchSelect
// // // // // // // //                           options={documentOptions}
// // // // // // // //                           value={item.waiverTypeCd || ""}
// // // // // // // //                           onValueChange={(value) =>
// // // // // // // //                             handleInputChange("waiverTypeCd", value, rowId)
// // // // // // // //                           }
// // // // // // // //                           onSelect={(option) =>
// // // // // // // //                             handleInputChange(
// // // // // // // //                               "waiverTypeCd",
// // // // // // // //                               option.value,
// // // // // // // //                               rowId,
// // // // // // // //                             )
// // // // // // // //                           }
// // // // // // // //                         />
// // // // // // // //                       </td>
// // // // // // // //                     </tr>
// // // // // // // //                   );
// // // // // // // //                 })}
// // // // // // // //               </tbody>
// // // // // // // //             </table>
// // // // // // // //           </div>
// // // // // // // //         )}
// // // // // // // //       </MainContainer>

// // // // // // // //       <SecondaryContainer
// // // // // // // //         title="Manage Project Waiver Information Detail"
// // // // // // // //         className="mt-3"
// // // // // // // //       >
// // // // // // // //         <Toolbar
// // // // // // // //           isFormView={false}
// // // // // // // //           totalRecords={detailRow ? 1 : 0}
// // // // // // // //           selectedRow={detailRow}
// // // // // // // //           loading={loading}
// // // // // // // //           actions={{
// // // // // // // //             onAdd: handleAddDetail,
// // // // // // // //             onCopy: handleCopyDetail,
// // // // // // // //             onDelete: handleDeleteDetail,
// // // // // // // //           }}
// // // // // // // //           clipboard={detailClipboard ? [detailClipboard] : []}
// // // // // // // //           buttonsDisable={["paste", "discard", "save", "tableform"]}
// // // // // // // //         />
// // // // // // // //         <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
// // // // // // // //           <table className="min-w-full text-sm">
// // // // // // // //             <thead className="bg-gray-200 sticky top-0 z-10">
// // // // // // // //               <tr>
// // // // // // // //                 <th className="th-thead w-10"></th>
// // // // // // // //                 <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
// // // // // // // //                 <th className="th-thead">Vendor Name</th>
// // // // // // // //                 <th className="th-thead">Print Final Waiver</th>
// // // // // // // //               </tr>
// // // // // // // //             </thead>
// // // // // // // //             <tbody className="tbody">
// // // // // // // //               {detailRow && (
// // // // // // // //                 <tr>
// // // // // // // //                   <td className="tbody-td text-center">
// // // // // // // //                     <input
// // // // // // // //                       type="checkbox"
// // // // // // // //                       className="h-3 w-3 accent-blue-600"
// // // // // // // //                       checked={detailSelected}
// // // // // // // //                       onChange={(e) => setDetailSelected(e.target.checked)}
// // // // // // // //                     />
// // // // // // // //                   </td>
// // // // // // // //                   <td className="tbody-td">
// // // // // // // //                     <FreeTextSearchSelect
// // // // // // // //                       options={vendorOptions}
// // // // // // // //                       value={detailRow.vendCustId || ""}
// // // // // // // //                       onValueChange={(value) => handleDetailInputChange("vendCustId", value)}
// // // // // // // //                       onSelect={(option) => handleVendorSelect(option)}
// // // // // // // //                     />
// // // // // // // //                   </td>
// // // // // // // //                   <td className="tbody-td">
// // // // // // // //                     <input
// // // // // // // //                       className="td-input bg-gray-100 min-w-[220px]"
// // // // // // // //                       value={detailRow.vendorName || ""}
// // // // // // // //                       readOnly
// // // // // // // //                     />
// // // // // // // //                   </td>
// // // // // // // //                   <td className="tbody-td text-center">
// // // // // // // //                     <input
// // // // // // // //                       type="checkbox"
// // // // // // // //                       className="h-3 w-3 accent-blue-600"
// // // // // // // //                       checked={detailRow.finalWaiverFl === "Y"}
// // // // // // // //                       onChange={(e) =>
// // // // // // // //                         handleDetailInputChange(
// // // // // // // //                           "finalWaiverFl",
// // // // // // // //                           e.target.checked ? "Y" : "N",
// // // // // // // //                         )
// // // // // // // //                       }
// // // // // // // //                     />
// // // // // // // //                   </td>
// // // // // // // //                 </tr>
// // // // // // // //               )}
// // // // // // // //             </tbody>
// // // // // // // //           </table>
// // // // // // // //         </div>
// // // // // // // //       </SecondaryContainer>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default ManageLienWaiverInformation;

// // // // // // // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // // // // // // import { toast } from "react-toastify";
// // // // // // // import { FormInput, FormSearchSelect, FormSection } from "../helper/formSection";
// // // // // // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // // // // // import { TableSearchSelect } from "../helper/tableSection";
// // // // // // // import api from "../utils/api";
// // // // // // // import { backendUrl } from "./config";

// // // // // // // const FreeTextSearchSelectUnused = ({
// // // // // // //   label,
// // // // // // //   value,
// // // // // // //   options = [],
// // // // // // //   onValueChange,
// // // // // // //   onSelect,
// // // // // // // }) => {
// // // // // // //   const [open, setOpen] = useState(false);
// // // // // // //   const [search, setSearch] = useState("");
// // // // // // //   const displayValue = open ? search : value || "";
// // // // // // //   const filteredOptions = options.filter((option) => {
// // // // // // //     const term = search.toLowerCase();
// // // // // // //     return (
// // // // // // //       String(option.value || "").toLowerCase().includes(term) ||
// // // // // // //       String(option.label || "").toLowerCase().includes(term)
// // // // // // //     );
// // // // // // //   });

// // // // // // //   return (
// // // // // // //     <div
// // // // // // //       className={
// // // // // // //         label
// // // // // // //           ? "space-x-4 flex items-center relative"
// // // // // // //           : "relative w-full min-w-[150px]"
// // // // // // //       }
// // // // // // //     >
// // // // // // //       {label && (
// // // // // // //         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
// // // // // // //           {label}
// // // // // // //         </label>
// // // // // // //       )}
// // // // // // //       <div className="relative flex-1">
// // // // // // //         <input
// // // // // // //           className="border outline-none w-full border-gray-300 pl-2 pr-2 py-0.5 rounded text-[10px] bg-white focus:border-[#17414d]"
// // // // // // //           value={displayValue}
// // // // // // //           onChange={(event) => {
// // // // // // //             setSearch(event.target.value);
// // // // // // //             onValueChange(event.target.value);
// // // // // // //             setOpen(true);
// // // // // // //           }}
// // // // // // //           onFocus={() => {
// // // // // // //             setSearch(value || "");
// // // // // // //             setOpen(true);
// // // // // // //           }}
// // // // // // //           autoComplete="off"
// // // // // // //         />
// // // // // // //         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
// // // // // // //           ⌕
// // // // // // //         </span>
// // // // // // //         {open && (
// // // // // // //           <>
// // // // // // //             <div className="absolute left-0 top-full z-[1000] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl">
// // // // // // //               {filteredOptions.length > 0 ? (
// // // // // // //                 filteredOptions.map((option, index) => (
// // // // // // //                   <div
// // // // // // //                     key={`${option.value}-${index}`}
// // // // // // //                     className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // // // // // //                     onClick={() => {
// // // // // // //                       onSelect(option);
// // // // // // //                       setSearch("");
// // // // // // //                       setOpen(false);
// // // // // // //                     }}
// // // // // // //                   >
// // // // // // //                     <span className="font-[400] text-black">{option.value}</span>
// // // // // // //                     {option.label && (
// // // // // // //                       <span className="text-gray-400 ml-2">({option.label})</span>
// // // // // // //                     )}
// // // // // // //                   </div>
// // // // // // //                 ))
// // // // // // //               ) : (
// // // // // // //                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
// // // // // // //                   No options found. You can type a value.
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //             </div>
// // // // // // //           </>
// // // // // // //         )}
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // const ManageLienWaiverInformation = () => {
// // // // // // //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// // // // // // //   const companyId = user.companyId || "1";

// // // // // // //   const [records, setRecords] = useState([]);
// // // // // // //   const [originalRecords, setOriginalRecords] = useState([]);
// // // // // // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // // // // // //   const [selectedRow, setSelectedRow] = useState(null);
// // // // // // //   const [detailRow, setDetailRow] = useState(null);
// // // // // // //   const [detailSelected, setDetailSelected] = useState(false);
// // // // // // //   const [isFormView, setIsFormView] = useState(true);
// // // // // // //   const [currentIndex, setCurrentIndex] = useState(0);
// // // // // // //   const [searchValue, setSearchValue] = useState("");
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [detailClipboard, setDetailClipboard] = useState(null);

// // // // // // //   const [projects, setProjects] = useState([]);
// // // // // // //   const [vendors, setVendors] = useState([]);
// // // // // // //   const [documents, setDocuments] = useState([]);
// // // // // // //   const [projectSearch, setProjectSearch] = useState("");
// // // // // // //   const [documentSearch, setDocumentSearch] = useState("");
// // // // // // //   const [vendorSearch, setVendorSearch] = useState("");

// // // // // // //   const initialRecord = {
// // // // // // //     lienNo: 0,
// // // // // // //     projId: "",
// // // // // // //     projectDescription: "",
// // // // // // //     waiverTypeCd: "",
// // // // // // //     vendCustId: "",
// // // // // // //     vendorName: "",
// // // // // // //     finalWaiverFl: "N",
// // // // // // //     lienAmt: 1,
// // // // // // //     lienDate: new Date().toISOString(),
// // // // // // //     sentDt: new Date().toISOString(),
// // // // // // //     returnedDt: null,
// // // // // // //     addrDc: "",
// // // // // // //     chkNo: null,
// // // // // // //     companyId,
// // // // // // //     modifiedBy: user.name || "Admin",
// // // // // // //   };

// // // // // // //   const renderRequiredLabel = (label) => (
// // // // // // //     <>
// // // // // // //       {label} <span className="text-red-600">*</span>
// // // // // // //     </>
// // // // // // //   );

// // // // // // //   const extractList = (payload) => {
// // // // // // //     if (Array.isArray(payload)) return payload;
// // // // // // //     if (Array.isArray(payload?.data)) return payload.data;
// // // // // // //     if (Array.isArray(payload?.items)) return payload.items;
// // // // // // //     if (Array.isArray(payload?.result)) return payload.result;
// // // // // // //     if (Array.isArray(payload?.records)) return payload.records;
// // // // // // //     return [];
// // // // // // //   };

// // // // // // //   const normalizeOptions = (items, valueKeys, labelKeys) =>
// // // // // // //     (Array.isArray(items) ? items : []).map((item) => {
// // // // // // //       const value =
// // // // // // //         valueKeys
// // // // // // //           .map((key) => item?.[key])
// // // // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // // // //       const label =
// // // // // // //         labelKeys
// // // // // // //           .map((key) => item?.[key])
// // // // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // // // //       return { ...item, value: String(value || ""), label: String(label || "") };
// // // // // // //     });

// // // // // // //   const projectOptions = useMemo(
// // // // // // //     () =>
// // // // // // //       normalizeOptions(
// // // // // // //         projects,
// // // // // // //         ["projId", "projectId", "projID", "projectID", "id", "code"],
// // // // // // //         [
// // // // // // //           "projName",
// // // // // // //           "projectName",
// // // // // // //           "projectDesc",
// // // // // // //           "projDescription",
// // // // // // //           "description",
// // // // // // //           "name",
// // // // // // //         ],
// // // // // // //       ),
// // // // // // //     [projects],
// // // // // // //   );

// // // // // // //   const vendorOptions = useMemo(
// // // // // // //     () =>
// // // // // // //       normalizeOptions(
// // // // // // //         vendors,
// // // // // // //         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
// // // // // // //         ["vendName", "vendorName", "vendorLongName", "name"],
// // // // // // //       ),
// // // // // // //     [vendors],
// // // // // // //   );

// // // // // // //   const documentOptions = useMemo(
// // // // // // //     () =>
// // // // // // //       normalizeOptions(
// // // // // // //         documents,
// // // // // // //         ["documentCode", "waiverTypeCd", "code", "value"],
// // // // // // //         ["documentDescription", "documentName", "description", "label"],
// // // // // // //       ),
// // // // // // //     [documents],
// // // // // // //   );

// // // // // // //   const enrichRecord = useCallback((record) => {
// // // // // // //     const vendor = vendorOptions.find(
// // // // // // //       (item) => String(item.value) === String(record.vendCustId),
// // // // // // //     );
// // // // // // //     const project = projectOptions.find(
// // // // // // //       (item) => String(item.value) === String(record.projId),
// // // // // // //     );
// // // // // // //     return {
// // // // // // //       ...record,
// // // // // // //       vendorName: record.vendorName || vendor?.label || "",
// // // // // // //       projectDescription: record.projectDescription || project?.label || "",
// // // // // // //     };
// // // // // // //   }, [projectOptions, vendorOptions]);

// // // // // // //   const getRowId = (row) => row.tempId || row.lienNo;

// // // // // // //   const getNextLienNo = () => {
// // // // // // //     const usedNumbers = records
// // // // // // //       .map((row) => Number(row.lienNo))
// // // // // // //       .filter((value) => Number.isFinite(value) && value > 0);
// // // // // // //     return (usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1;
// // // // // // //   };

// // // // // // //   const fetchRecords = useCallback(async () => {
// // // // // // //     setLoading(true);
// // // // // // //     try {
// // // // // // //       const response = await api.get(
// // // // // // //         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
// // // // // // //       );
// // // // // // //       const data = (Array.isArray(response.data) ? response.data : []).map(
// // // // // // //         enrichRecord,
// // // // // // //       );
// // // // // // //       setRecords(data);
// // // // // // //       setOriginalRecords(data);
// // // // // // //       if (data.length > 0) {
// // // // // // //         setSelectedRow(data[0]);
// // // // // // //         setSelectedRows(new Set([getRowId(data[0])]));
// // // // // // //         setCurrentIndex(0);
// // // // // // //       } else {
// // // // // // //         setSelectedRow(null);
// // // // // // //         setSelectedRows(new Set());
// // // // // // //         setCurrentIndex(0);
// // // // // // //       }
// // // // // // //       setDetailRow(null);
// // // // // // //       setDetailSelected(false);
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Fetch lien waiver information error:", error);
// // // // // // //       toast.error(
// // // // // // //         error.response?.data?.message || "Failed to fetch lien waiver information.",
// // // // // // //       );
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   }, [companyId, enrichRecord]);

// // // // // // //   const fetchLookups = useCallback(async () => {
// // // // // // //     try {
// // // // // // //       const [projectRes, vendorRes, documentRes] = await Promise.all([
// // // // // // //         api.get(`${backendUrl}/Project/GetAllProjects`),
// // // // // // //         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
// // // // // // //         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
// // // // // // //       ]);
// // // // // // //       setProjects(extractList(projectRes.data));
// // // // // // //       setVendors(extractList(vendorRes.data));
// // // // // // //       setDocuments(extractList(documentRes.data));
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Fetch lien waiver lookup error:", error);
// // // // // // //       toast.error("Failed to fetch project/vendor/document lookup data.");
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   useEffect(() => {
// // // // // // //     fetchLookups();
// // // // // // //   }, [fetchLookups]);

// // // // // // //   useEffect(() => {
// // // // // // //     fetchRecords();
// // // // // // //   }, [fetchRecords]);

// // // // // // //   const handleInputChange = (field, value, rowId) => {
// // // // // // //     setRecords((prev) =>
// // // // // // //       prev.map((item) =>
// // // // // // //         String(getRowId(item)) === String(rowId)
// // // // // // //           ? { ...item, [field]: value, isDirty: true }
// // // // // // //           : item,
// // // // // // //       ),
// // // // // // //     );
// // // // // // //     setSelectedRow((prev) =>
// // // // // // //       prev && String(getRowId(prev)) === String(rowId)
// // // // // // //         ? { ...prev, [field]: value, isDirty: true }
// // // // // // //         : prev,
// // // // // // //     );
// // // // // // //   };

// // // // // // //   const handleVendorSelect = (option) => {
// // // // // // //     handleDetailInputChange("vendCustId", option.value);
// // // // // // //     handleDetailInputChange("vendorName", option.label);
// // // // // // //   };

// // // // // // //   const handleProjectSelect = (option, rowId) => {
// // // // // // //     handleInputChange("projId", option.value, rowId);
// // // // // // //     handleInputChange("projectDescription", option.label, rowId);
// // // // // // //   };

// // // // // // //   const handleDetailInputChange = (field, value) => {
// // // // // // //     if (!detailRow) return;
// // // // // // //     setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// // // // // // //     if (selectedRow) {
// // // // // // //       handleInputChange(field, value, activeRowId);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const clearDetailFields = () => {
// // // // // // //     if (!detailRow) {
// // // // // // //       toast.warn("Please select a waiver record first.");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     handleDetailInputChange("vendCustId", "");
// // // // // // //     handleDetailInputChange("vendorName", "");
// // // // // // //     handleDetailInputChange("finalWaiverFl", "N");
// // // // // // //   };

// // // // // // //   const handleAddDetail = () => {
// // // // // // //     if (!selectedRow) {
// // // // // // //       toast.warn("Please select a waiver record first.");
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const blankDetail = {
// // // // // // //       ...selectedRow,
// // // // // // //       vendCustId: "",
// // // // // // //       vendorName: "",
// // // // // // //       finalWaiverFl: "N",
// // // // // // //       isDirty: true,
// // // // // // //     };
// // // // // // //     setDetailRow(blankDetail);
// // // // // // //     setDetailSelected(true);
// // // // // // //   };

// // // // // // //   const handleCopyDetail = () => {
// // // // // // //     if (!detailRow?.vendCustId) {
// // // // // // //       toast.warn("No vendor detail selected to copy.");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     setDetailClipboard({
// // // // // // //       vendCustId: detailRow.vendCustId,
// // // // // // //       vendorName: detailRow.vendorName || "",
// // // // // // //       finalWaiverFl: detailRow.finalWaiverFl || "N",
// // // // // // //     });
// // // // // // //     toast.success("Vendor detail copied.");
// // // // // // //   };

// // // // // // //   const handleDeleteDetail = () => {
// // // // // // //     clearDetailFields();
// // // // // // //   };

// // // // // // //   const handleAdd = () => {
// // // // // // //     const newRow = {
// // // // // // //       ...initialRecord,
// // // // // // //       lienNo: getNextLienNo(),
// // // // // // //       tempId: `TEMP_${Date.now()}`,
// // // // // // //       isNew: true,
// // // // // // //       isDirty: true,
// // // // // // //     };
// // // // // // //     setRecords([newRow, ...records]);
// // // // // // //     setSelectedRow(newRow);
// // // // // // //     setSelectedRows(new Set([newRow.tempId]));
// // // // // // //     setDetailRow(null);
// // // // // // //     setDetailSelected(false);
// // // // // // //     setCurrentIndex(0);
// // // // // // //   };

// // // // // // //   const validateRows = (rows) => {
// // // // // // //     const requiredFields = ["projId", "waiverTypeCd"];
// // // // // // //     for (const row of rows) {
// // // // // // //       const missing = requiredFields.find(
// // // // // // //         (field) => !row[field] || String(row[field]).trim() === "",
// // // // // // //       );
// // // // // // //       if (missing) {
// // // // // // //         toast.error(
// // // // // // //           `Row ${records.indexOf(row) + 1}: ${missing.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`,
// // // // // // //         );
// // // // // // //         return false;
// // // // // // //       }
// // // // // // //     }
// // // // // // //     return true;
// // // // // // //   };

// // // // // // //   const buildPayload = (row) => {
// // // // // // //     const payload = { ...row };
// // // // // // //     delete payload.tempId;
// // // // // // //     delete payload.isNew;
// // // // // // //     delete payload.isDirty;
// // // // // // //     delete payload.vendorName;
// // // // // // //     delete payload.projectDescription;
// // // // // // //     return {
// // // // // // //       ...payload,
// // // // // // //       lienNo: Number(row.lienNo || getNextLienNo()),
// // // // // // //       lienAmt: Number(row.lienAmt || 1),
// // // // // // //       companyId,
// // // // // // //       modifiedBy: user.name || row.modifiedBy || "Admin",
// // // // // // //       finalWaiverFl: row.finalWaiverFl || "N",
// // // // // // //       lienDate: row.lienDate || new Date().toISOString(),
// // // // // // //       sentDt: row.sentDt || new Date().toISOString(),
// // // // // // //     };
// // // // // // //   };

// // // // // // //   const handleSaveAll = async () => {
// // // // // // //     const changedRows = records.filter((row) => row.isNew || row.isDirty);
// // // // // // //     if (changedRows.length === 0) {
// // // // // // //       toast.info("No changes to save.");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (!validateRows(changedRows)) return;

// // // // // // //     setLoading(true);
// // // // // // //     try {
// // // // // // //       await Promise.all(
// // // // // // //         changedRows.map((row) =>
// // // // // // //           row.isNew
// // // // // // //             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
// // // // // // //             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
// // // // // // //         ),
// // // // // // //       );
// // // // // // //       toast.success("Lien waiver information saved.");
// // // // // // //       setDetailRow(null);
// // // // // // //       setDetailSelected(false);
// // // // // // //       fetchRecords();
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Save lien waiver information error:", error);
// // // // // // //       toast.error(error.response?.data?.message || "Failed to save changes.");
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleDelete = async () => {
// // // // // // //     if (selectedRows.size === 0) {
// // // // // // //       toast.warn("Please select at least one waiver record to delete.");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setLoading(true);
// // // // // // //     try {
// // // // // // //       for (const id of Array.from(selectedRows)) {
// // // // // // //         if (String(id).startsWith("TEMP_")) {
// // // // // // //           setRecords((prev) => prev.filter((item) => item.tempId !== id));
// // // // // // //         } else {
// // // // // // //           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
// // // // // // //         }
// // // // // // //       }
// // // // // // //       toast.success("Selected waiver record(s) deleted.");
// // // // // // //       setSelectedRows(new Set());
// // // // // // //       setSelectedRow(null);
// // // // // // //       setDetailRow(null);
// // // // // // //       setDetailSelected(false);
// // // // // // //       fetchRecords();
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Delete lien waiver information error:", error);
// // // // // // //       toast.error(error.response?.data?.message || "Failed to delete record.");
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleDiscard = () => {
// // // // // // //     setRecords([...originalRecords]);
// // // // // // //     setSelectedRows(new Set());
// // // // // // //     setSelectedRow(null);
// // // // // // //     setDetailRow(null);
// // // // // // //     setDetailSelected(false);
// // // // // // //     toast.info("Changes discarded.");
// // // // // // //   };

// // // // // // //   const handleNavigate = (direction) => {
// // // // // // //     if (records.length === 0) return;
// // // // // // //     let nextIndex = currentIndex;
// // // // // // //     if (direction === "start") nextIndex = 0;
// // // // // // //     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
// // // // // // //     if (direction === "next")
// // // // // // //       nextIndex = Math.min(records.length - 1, currentIndex + 1);
// // // // // // //     if (direction === "end") nextIndex = records.length - 1;

// // // // // // //     const nextRecord = records[nextIndex];
// // // // // // //     setCurrentIndex(nextIndex);
// // // // // // //     setSelectedRow(nextRecord);
// // // // // // //     setSelectedRows(new Set([getRowId(nextRecord)]));
// // // // // // //     setDetailRow(null);
// // // // // // //     setDetailSelected(false);
// // // // // // //   };

// // // // // // //   const jumpToCode = (code) => {
// // // // // // //     const foundIndex = records.findIndex(
// // // // // // //       (item) =>
// // // // // // //         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
// // // // // // //         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
// // // // // // //         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
// // // // // // //     );
// // // // // // //     if (foundIndex === -1) {
// // // // // // //       toast.error(`Lien waiver record "${code}" not found.`);
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     const found = records[foundIndex];
// // // // // // //     setCurrentIndex(foundIndex);
// // // // // // //     setSelectedRow(found);
// // // // // // //     setSelectedRows(new Set([getRowId(found)]));
// // // // // // //     setDetailRow(null);
// // // // // // //     setDetailSelected(false);
// // // // // // //   };

// // // // // // //   const fetchDetailForRow = async (item) => {
// // // // // // //     if (!item?.lienNo || String(item.lienNo) === "0") {
// // // // // // //       setDetailRow(null);
// // // // // // //       setDetailSelected(false);
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setLoading(true);
// // // // // // //     try {
// // // // // // //       const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
// // // // // // //       const detail = enrichRecord(response.data || item);
// // // // // // //       setDetailRow(detail);
// // // // // // //       setDetailSelected(true);
// // // // // // //     } catch (error) {
// // // // // // //       console.error("Fetch lien waiver detail error:", error);
// // // // // // //       setDetailRow(null);
// // // // // // //       setDetailSelected(false);
// // // // // // //       toast.error(error.response?.data?.message || "Failed to fetch waiver detail.");
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const toggleSelection = (item, index) => {
// // // // // // //     const rowId = getRowId(item);
// // // // // // //     const next = new Set(selectedRows);
// // // // // // //     if (next.has(rowId)) {
// // // // // // //       next.delete(rowId);
// // // // // // //       setSelectedRow(null);
// // // // // // //       setDetailRow(null);
// // // // // // //       setDetailSelected(false);
// // // // // // //     } else {
// // // // // // //       next.clear();
// // // // // // //       next.add(rowId);
// // // // // // //       setSelectedRow(item);
// // // // // // //       setCurrentIndex(index);
// // // // // // //       if (!String(rowId).startsWith("TEMP_")) {
// // // // // // //         fetchDetailForRow(item);
// // // // // // //       } else {
// // // // // // //         setDetailRow(null);
// // // // // // //         setDetailSelected(false);
// // // // // // //       }
// // // // // // //     }
// // // // // // //     setSelectedRows(next);
// // // // // // //   };

// // // // // // //   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

// // // // // // //   return (
// // // // // // //     <div className="mt-14 ml-4">
// // // // // // //       <MainContainer title="Manage Lien Waiver Information">
// // // // // // //         <Toolbar
// // // // // // //           isFormView={isFormView}
// // // // // // //           totalRecords={records.length}
// // // // // // //           selectedRow={selectedRow}
// // // // // // //           currentIndex={currentIndex}
// // // // // // //           handleNavigate={handleNavigate}
// // // // // // //           jumpToCode={jumpToCode}
// // // // // // //           searchValue={searchValue}
// // // // // // //           setSearchValue={setSearchValue}
// // // // // // //           loading={loading}
// // // // // // //           actions={{
// // // // // // //             onAdd: handleAdd,
// // // // // // //             onSave: handleSaveAll,
// // // // // // //             onDelete: handleDelete,
// // // // // // //             onClear: handleDiscard,
// // // // // // //             onToggleView: () => setIsFormView(!isFormView),
// // // // // // //           }}
// // // // // // //           buttonsDisable={["copy", "paste"]}
// // // // // // //         />

// // // // // // //         {isFormView ? (
// // // // // // //           <div className="p-2 space-y-3">
// // // // // // //             <FormSection title="Identification">
// // // // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // // // //                 <FormSearchSelect
// // // // // // //                   label={renderRequiredLabel("Project")}
// // // // // // //                   value={selectedRow?.projId || ""}
// // // // // // //                   searchTerm={projectSearch}
// // // // // // //                   setSearchTerm={setProjectSearch}
// // // // // // //                   options={projectOptions}
// // // // // // //                   displayKey="value"
// // // // // // //                   secondaryKey="label"
// // // // // // //                   onSelect={(option) => handleProjectSelect(option, activeRowId)}
// // // // // // //                 />
// // // // // // //                 <FormInput
// // // // // // //                   label="Project Description"
// // // // // // //                   value={selectedRow?.projectDescription || ""}
// // // // // // //                   readOnly
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </FormSection>

// // // // // // //             <FormSection title="Waiver Document Information">
// // // // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // // // //                 <FormSearchSelect
// // // // // // //                   label="Waiver Doc Cd"
// // // // // // //                   value={selectedRow?.waiverTypeCd || ""}
// // // // // // //                   searchTerm={documentSearch}
// // // // // // //                   setSearchTerm={setDocumentSearch}
// // // // // // //                   options={documentOptions}
// // // // // // //                   displayKey="value"
// // // // // // //                   secondaryKey="label"
// // // // // // //                   onSelect={(option) =>
// // // // // // //                     handleInputChange("waiverTypeCd", option.value, activeRowId)
// // // // // // //                   }
// // // // // // //                 />
// // // // // // //               </div>
// // // // // // //             </FormSection>

// // // // // // //           </div>
// // // // // // //         ) : (
// // // // // // //           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
// // // // // // //             <table className="min-w-full text-sm">
// // // // // // //               <thead className="bg-gray-200 sticky top-0 z-10">
// // // // // // //                 <tr>
// // // // // // //                   <th className="th-thead w-10"></th>
// // // // // // //                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
// // // // // // //                   <th className="th-thead">Project Description</th>
// // // // // // //                   <th className="th-thead">Waiver Doc Cd</th>
// // // // // // //                 </tr>
// // // // // // //               </thead>
// // // // // // //               <tbody className="tbody">
// // // // // // //                 {records.map((item, index) => {
// // // // // // //                   const rowId = getRowId(item);
// // // // // // //                   return (
// // // // // // //                     <tr
// // // // // // //                       key={rowId}
// // // // // // //                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
// // // // // // //                     >
// // // // // // //                       <td className="tbody-td text-center">
// // // // // // //                         <input
// // // // // // //                           type="checkbox"
// // // // // // //                           className="h-3 w-3 accent-blue-600"
// // // // // // //                           checked={selectedRows.has(rowId)}
// // // // // // //                           onChange={() => toggleSelection(item, index)}
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="tbody-td">
// // // // // // //                         <TableSearchSelect
// // // // // // //                           options={projectOptions}
// // // // // // //                           value={item.projId || ""}
// // // // // // //                           displayKey="value"
// // // // // // //                           secondaryKey="label"
// // // // // // //                           onSelect={(option) => handleProjectSelect(option, rowId)}
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="tbody-td">
// // // // // // //                         <input
// // // // // // //                           className="td-input bg-gray-100 min-w-[220px]"
// // // // // // //                           value={item.projectDescription || ""}
// // // // // // //                           readOnly
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                       <td className="tbody-td">
// // // // // // //                         <TableSearchSelect
// // // // // // //                           options={documentOptions}
// // // // // // //                           value={item.waiverTypeCd || ""}
// // // // // // //                           displayKey="value"
// // // // // // //                           secondaryKey="label"
// // // // // // //                           onSelect={(option) =>
// // // // // // //                             handleInputChange(
// // // // // // //                               "waiverTypeCd",
// // // // // // //                               option.value,
// // // // // // //                               rowId,
// // // // // // //                             )
// // // // // // //                           }
// // // // // // //                         />
// // // // // // //                       </td>
// // // // // // //                     </tr>
// // // // // // //                   );
// // // // // // //                 })}
// // // // // // //               </tbody>
// // // // // // //             </table>
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //       </MainContainer>

// // // // // // //       <SecondaryContainer
// // // // // // //         title="Manage Project Waiver Information Detail"
// // // // // // //         className="mt-3"
// // // // // // //       >
// // // // // // //         <Toolbar
// // // // // // //           isFormView={false}
// // // // // // //           totalRecords={detailRow ? 1 : 0}
// // // // // // //           selectedRow={detailRow}
// // // // // // //           loading={loading}
// // // // // // //           actions={{
// // // // // // //             onAdd: handleAddDetail,
// // // // // // //             onCopy: handleCopyDetail,
// // // // // // //             onDelete: handleDeleteDetail,
// // // // // // //           }}
// // // // // // //           clipboard={detailClipboard ? [detailClipboard] : []}
// // // // // // //           buttonsDisable={["paste", "discard", "save", "tableform"]}
// // // // // // //         />
// // // // // // //         <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
// // // // // // //           <table className="min-w-full text-sm">
// // // // // // //             <thead className="bg-gray-200 sticky top-0 z-10">
// // // // // // //               <tr>
// // // // // // //                 <th className="th-thead w-10"></th>
// // // // // // //                 <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
// // // // // // //                 <th className="th-thead">Vendor Name</th>
// // // // // // //                 <th className="th-thead">Print Final Waiver</th>
// // // // // // //               </tr>
// // // // // // //             </thead>
// // // // // // //             <tbody className="tbody">
// // // // // // //               {detailRow && (
// // // // // // //                 <tr>
// // // // // // //                   <td className="tbody-td text-center">
// // // // // // //                     <input
// // // // // // //                       type="checkbox"
// // // // // // //                       className="h-3 w-3 accent-blue-600"
// // // // // // //                       checked={detailSelected}
// // // // // // //                       onChange={(e) => setDetailSelected(e.target.checked)}
// // // // // // //                     />
// // // // // // //                   </td>
// // // // // // //                   <td className="tbody-td">
// // // // // // //                     <FormSearchSelect
// // // // // // //                       label=""
// // // // // // //                       options={vendorOptions}
// // // // // // //                       value={detailRow.vendCustId || ""}
// // // // // // //                       searchTerm={vendorSearch}
// // // // // // //                       setSearchTerm={setVendorSearch}
// // // // // // //                       displayKey="value"
// // // // // // //                       secondaryKey="label"
// // // // // // //                       onSelect={(option) => handleVendorSelect(option)}
// // // // // // //                     />
// // // // // // //                   </td>
// // // // // // //                   <td className="tbody-td">
// // // // // // //                     <input
// // // // // // //                       className="td-input bg-gray-100 min-w-[220px]"
// // // // // // //                       value={detailRow.vendorName || ""}
// // // // // // //                       readOnly
// // // // // // //                     />
// // // // // // //                   </td>
// // // // // // //                   <td className="tbody-td text-center">
// // // // // // //                     <input
// // // // // // //                       type="checkbox"
// // // // // // //                       className="h-3 w-3 accent-blue-600"
// // // // // // //                       checked={detailRow.finalWaiverFl === "Y"}
// // // // // // //                       onChange={(e) =>
// // // // // // //                         handleDetailInputChange(
// // // // // // //                           "finalWaiverFl",
// // // // // // //                           e.target.checked ? "Y" : "N",
// // // // // // //                         )
// // // // // // //                       }
// // // // // // //                     />
// // // // // // //                   </td>
// // // // // // //                 </tr>
// // // // // // //               )}
// // // // // // //             </tbody>
// // // // // // //           </table>
// // // // // // //         </div>
// // // // // // //       </SecondaryContainer>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ManageLienWaiverInformation;

// // // // // // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // // // // // import { createPortal } from "react-dom";
// // // // // // import { toast } from "react-toastify";
// // // // // // import { FormInput, FormSearchSelect, FormSection } from "../helper/formSection";
// // // // // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // // // // import { TableSearchSelect } from "../helper/tableSection";
// // // // // // import api from "../utils/api";
// // // // // // import { backendUrl } from "./config";

// // // // // // const FreeTextSearchSelectUnused = ({
// // // // // //   label,
// // // // // //   value,
// // // // // //   options = [],
// // // // // //   onValueChange,
// // // // // //   onSelect,
// // // // // // }) => {
// // // // // //   const [open, setOpen] = useState(false);
// // // // // //   const [search, setSearch] = useState("");
// // // // // //   const displayValue = open ? search : value || "";
// // // // // //   const filteredOptions = options.filter((option) => {
// // // // // //     const term = search.toLowerCase();
// // // // // //     return (
// // // // // //       String(option.value || "").toLowerCase().includes(term) ||
// // // // // //       String(option.label || "").toLowerCase().includes(term)
// // // // // //     );
// // // // // //   });

// // // // // //   return (
// // // // // //     <div
// // // // // //       className={
// // // // // //         label
// // // // // //           ? "space-x-4 flex items-center relative"
// // // // // //           : "relative w-full min-w-[150px]"
// // // // // //       }
// // // // // //     >
// // // // // //       {label && (
// // // // // //         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
// // // // // //           {label}
// // // // // //         </label>
// // // // // //       )}
// // // // // //       <div className="relative flex-1">
// // // // // //         <input
// // // // // //           className="border outline-none w-full border-gray-300 pl-2 pr-2 py-0.5 rounded text-[10px] bg-white focus:border-[#17414d]"
// // // // // //           value={displayValue}
// // // // // //           onChange={(event) => {
// // // // // //             setSearch(event.target.value);
// // // // // //             onValueChange(event.target.value);
// // // // // //             setOpen(true);
// // // // // //           }}
// // // // // //           onFocus={() => {
// // // // // //             setSearch(value || "");
// // // // // //             setOpen(true);
// // // // // //           }}
// // // // // //           autoComplete="off"
// // // // // //         />
// // // // // //         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">
// // // // // //           ⌕
// // // // // //         </span>
// // // // // //         {open && (
// // // // // //           <>
// // // // // //             <div className="absolute left-0 top-full z-[1000] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl">
// // // // // //               {filteredOptions.length > 0 ? (
// // // // // //                 filteredOptions.map((option, index) => (
// // // // // //                   <div
// // // // // //                     key={`${option.value}-${index}`}
// // // // // //                     className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // // // // //                     onClick={() => {
// // // // // //                       onSelect(option);
// // // // // //                       setSearch("");
// // // // // //                       setOpen(false);
// // // // // //                     }}
// // // // // //                   >
// // // // // //                     <span className="font-[400] text-black">{option.value}</span>
// // // // // //                     {option.label && (
// // // // // //                       <span className="text-gray-400 ml-2">({option.label})</span>
// // // // // //                     )}
// // // // // //                   </div>
// // // // // //                 ))
// // // // // //               ) : (
// // // // // //                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
// // // // // //                   No options found. You can type a value.
// // // // // //                 </div>
// // // // // //               )}
// // // // // //             </div>
// // // // // //           </>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const PortalSearchSelect = ({
// // // // // //   label,
// // // // // //   value,
// // // // // //   options = [],
// // // // // //   onSelect,
// // // // // //   placeholder = "",
// // // // // // }) => {
// // // // // //   const [open, setOpen] = useState(false);
// // // // // //   const [search, setSearch] = useState("");
// // // // // //   const [dropdownStyle, setDropdownStyle] = useState({});
// // // // // //   const wrapperRef = React.useRef(null);
// // // // // //   const displayValue = open ? search : value || "";
// // // // // //   const filteredOptions = options.filter((option) => {
// // // // // //     const term = search.toLowerCase();
// // // // // //     return (
// // // // // //       String(option.value || "").toLowerCase().includes(term) ||
// // // // // //       String(option.label || "").toLowerCase().includes(term)
// // // // // //     );
// // // // // //   });

// // // // // //   const updateDropdownPosition = useCallback(() => {
// // // // // //     if (!wrapperRef.current) return;
// // // // // //     const rect = wrapperRef.current.getBoundingClientRect();
// // // // // //     setDropdownStyle({
// // // // // //       position: "fixed",
// // // // // //       top: rect.bottom + 4,
// // // // // //       left: rect.left,
// // // // // //       width: Math.max(rect.width, 220),
// // // // // //       zIndex: 9999,
// // // // // //     });
// // // // // //   }, []);

// // // // // //   useEffect(() => {
// // // // // //     if (!open) return;
// // // // // //     updateDropdownPosition();
// // // // // //     window.addEventListener("resize", updateDropdownPosition);
// // // // // //     window.addEventListener("scroll", updateDropdownPosition, true);
// // // // // //     return () => {
// // // // // //       window.removeEventListener("resize", updateDropdownPosition);
// // // // // //       window.removeEventListener("scroll", updateDropdownPosition, true);
// // // // // //     };
// // // // // //   }, [open, updateDropdownPosition]);

// // // // // //   return (
// // // // // //     <div
// // // // // //       ref={wrapperRef}
// // // // // //       className={
// // // // // //         label
// // // // // //           ? "space-x-4 flex items-center relative"
// // // // // //           : "relative w-full min-w-[150px]"
// // // // // //       }
// // // // // //     >
// // // // // //       {label && (
// // // // // //         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
// // // // // //           {label}
// // // // // //         </label>
// // // // // //       )}
// // // // // //       <div className="relative flex-1">
// // // // // //         <input
// // // // // //           className="border outline-none w-full border-gray-300 pl-2 pr-2 py-0.5 rounded text-[10px] bg-white focus:border-[#17414d]"
// // // // // //           value={displayValue}
// // // // // //           placeholder={placeholder}
// // // // // //           onChange={(event) => {
// // // // // //             setSearch(event.target.value);
// // // // // //             setOpen(true);
// // // // // //           }}
// // // // // //           onFocus={() => {
// // // // // //             setSearch(value || "");
// // // // // //             setOpen(true);
// // // // // //           }}
// // // // // //           autoComplete="off"
// // // // // //         />
// // // // // //         {open &&
// // // // // //           createPortal(
// // // // // //             <>
// // // // // //               <div
// // // // // //                 style={dropdownStyle}
// // // // // //                 className="bg-white border border-gray-300 rounded shadow-xl"
// // // // // //               >
// // // // // //                 {filteredOptions.length > 0 ? (
// // // // // //                   filteredOptions.map((option, index) => (
// // // // // //                     <div
// // // // // //                       key={`${option.value}-${index}`}
// // // // // //                       className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // // // // //                       onClick={() => {
// // // // // //                         onSelect(option);
// // // // // //                         setSearch("");
// // // // // //                         setOpen(false);
// // // // // //                       }}
// // // // // //                     >
// // // // // //                       <span className="font-[400] text-black">{option.value}</span>
// // // // // //                       {option.label && (
// // // // // //                         <span className="text-gray-400 ml-2">({option.label})</span>
// // // // // //                       )}
// // // // // //                     </div>
// // // // // //                   ))
// // // // // //                 ) : (
// // // // // //                   <div className="p-2 text-[10px] text-gray-400 italic text-center">
// // // // // //                     No options found.
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //               <div
// // // // // //                 className="fixed inset-0 z-[9998]"
// // // // // //                 onClick={() => {
// // // // // //                   setSearch("");
// // // // // //                   setOpen(false);
// // // // // //                 }}
// // // // // //               />
// // // // // //             </>,
// // // // // //             document.body,
// // // // // //           )}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // const ManageLienWaiverInformation = () => {
// // // // // //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// // // // // //   const companyId = user.companyId || "1";

// // // // // //   const [records, setRecords] = useState([]);
// // // // // //   const [originalRecords, setOriginalRecords] = useState([]);
// // // // // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // // // // //   const [selectedRow, setSelectedRow] = useState(null);
// // // // // //   const [detailRow, setDetailRow] = useState(null);
// // // // // //   const [detailSelected, setDetailSelected] = useState(false);
// // // // // //   const [isFormView, setIsFormView] = useState(true);
// // // // // //   const [currentIndex, setCurrentIndex] = useState(0);
// // // // // //   const [searchValue, setSearchValue] = useState("");
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [detailClipboard, setDetailClipboard] = useState(null);

// // // // // //   const [projects, setProjects] = useState([]);
// // // // // //   const [vendors, setVendors] = useState([]);
// // // // // //   const [documents, setDocuments] = useState([]);
// // // // // //   const [projectSearch, setProjectSearch] = useState("");

// // // // // //   const initialRecord = {
// // // // // //     lienNo: 0,
// // // // // //     projId: "",
// // // // // //     projectDescription: "",
// // // // // //     waiverTypeCd: "",
// // // // // //     vendCustId: "",
// // // // // //     vendorName: "",
// // // // // //     finalWaiverFl: "N",
// // // // // //     lienAmt: 1,
// // // // // //     lienDate: new Date().toISOString(),
// // // // // //     sentDt: new Date().toISOString(),
// // // // // //     returnedDt: null,
// // // // // //     addrDc: "",
// // // // // //     chkNo: null,
// // // // // //     companyId,
// // // // // //     modifiedBy: user.name || "Admin",
// // // // // //   };

// // // // // //   const renderRequiredLabel = (label) => (
// // // // // //     <>
// // // // // //       {label} <span className="text-red-600">*</span>
// // // // // //     </>
// // // // // //   );

// // // // // //   const extractList = (payload) => {
// // // // // //     if (Array.isArray(payload)) return payload;
// // // // // //     if (Array.isArray(payload?.data)) return payload.data;
// // // // // //     if (Array.isArray(payload?.items)) return payload.items;
// // // // // //     if (Array.isArray(payload?.result)) return payload.result;
// // // // // //     if (Array.isArray(payload?.records)) return payload.records;
// // // // // //     return [];
// // // // // //   };

// // // // // //   const normalizeOptions = (items, valueKeys, labelKeys) =>
// // // // // //     (Array.isArray(items) ? items : []).map((item) => {
// // // // // //       const value =
// // // // // //         valueKeys
// // // // // //           .map((key) => item?.[key])
// // // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // // //       const label =
// // // // // //         labelKeys
// // // // // //           .map((key) => item?.[key])
// // // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // // //       return { ...item, value: String(value || ""), label: String(label || "") };
// // // // // //     });

// // // // // //   const projectOptions = useMemo(
// // // // // //     () =>
// // // // // //       normalizeOptions(
// // // // // //         projects,
// // // // // //         ["projId", "projectId", "projID", "projectID", "id", "code"],
// // // // // //         [
// // // // // //           "projName",
// // // // // //           "projectName",
// // // // // //           "projectDesc",
// // // // // //           "projDescription",
// // // // // //           "description",
// // // // // //           "name",
// // // // // //         ],
// // // // // //       ),
// // // // // //     [projects],
// // // // // //   );

// // // // // //   const vendorOptions = useMemo(
// // // // // //     () =>
// // // // // //       normalizeOptions(
// // // // // //         vendors,
// // // // // //         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
// // // // // //         ["vendName", "vendorName", "vendorLongName", "name"],
// // // // // //       ),
// // // // // //     [vendors],
// // // // // //   );

// // // // // //   const documentOptions = useMemo(
// // // // // //     () =>
// // // // // //       normalizeOptions(
// // // // // //         documents,
// // // // // //         ["documentCode", "waiverTypeCd", "code", "value"],
// // // // // //         ["documentDescription", "documentName", "description", "label"],
// // // // // //       ),
// // // // // //     [documents],
// // // // // //   );

// // // // // //   const enrichRecord = useCallback((record) => {
// // // // // //     const vendor = vendorOptions.find(
// // // // // //       (item) => String(item.value) === String(record.vendCustId),
// // // // // //     );
// // // // // //     const project = projectOptions.find(
// // // // // //       (item) => String(item.value) === String(record.projId),
// // // // // //     );
// // // // // //     return {
// // // // // //       ...record,
// // // // // //       vendorName: record.vendorName || vendor?.label || "",
// // // // // //       projectDescription: record.projectDescription || project?.label || "",
// // // // // //     };
// // // // // //   }, [projectOptions, vendorOptions]);

// // // // // //   const getRowId = (row) => row.tempId || row.lienNo;

// // // // // //   const getNextLienNo = () => {
// // // // // //     const usedNumbers = records
// // // // // //       .map((row) => Number(row.lienNo))
// // // // // //       .filter((value) => Number.isFinite(value) && value > 0);
// // // // // //     return (usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1;
// // // // // //   };

// // // // // //   const fetchRecords = useCallback(async () => {
// // // // // //     setLoading(true);
// // // // // //     try {
// // // // // //       const response = await api.get(
// // // // // //         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
// // // // // //       );
// // // // // //       const data = (Array.isArray(response.data) ? response.data : []).map(
// // // // // //         enrichRecord,
// // // // // //       );
// // // // // //       setRecords(data);
// // // // // //       setOriginalRecords(data);
// // // // // //       if (data.length > 0) {
// // // // // //         setSelectedRow(data[0]);
// // // // // //         setSelectedRows(new Set([getRowId(data[0])]));
// // // // // //         setCurrentIndex(0);
// // // // // //       } else {
// // // // // //         setSelectedRow(null);
// // // // // //         setSelectedRows(new Set());
// // // // // //         setCurrentIndex(0);
// // // // // //       }
// // // // // //       setDetailRow(null);
// // // // // //       setDetailSelected(false);
// // // // // //     } catch (error) {
// // // // // //       console.error("Fetch lien waiver information error:", error);
// // // // // //       toast.error(
// // // // // //         error.response?.data?.message || "Failed to fetch lien waiver information.",
// // // // // //       );
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   }, [companyId, enrichRecord]);

// // // // // //   const fetchLookups = useCallback(async () => {
// // // // // //     try {
// // // // // //       const [projectRes, vendorRes, documentRes] = await Promise.all([
// // // // // //         api.get(`${backendUrl}/Project/GetAllProjects`),
// // // // // //         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
// // // // // //         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
// // // // // //       ]);
// // // // // //       setProjects(extractList(projectRes.data));
// // // // // //       setVendors(extractList(vendorRes.data));
// // // // // //       setDocuments(extractList(documentRes.data));
// // // // // //     } catch (error) {
// // // // // //       console.error("Fetch lien waiver lookup error:", error);
// // // // // //       toast.error("Failed to fetch project/vendor/document lookup data.");
// // // // // //     }
// // // // // //   }, []);

// // // // // //   useEffect(() => {
// // // // // //     fetchLookups();
// // // // // //   }, [fetchLookups]);

// // // // // //   useEffect(() => {
// // // // // //     fetchRecords();
// // // // // //   }, [fetchRecords]);

// // // // // //   const handleInputChange = (field, value, rowId) => {
// // // // // //     setRecords((prev) =>
// // // // // //       prev.map((item) =>
// // // // // //         String(getRowId(item)) === String(rowId)
// // // // // //           ? { ...item, [field]: value, isDirty: true }
// // // // // //           : item,
// // // // // //       ),
// // // // // //     );
// // // // // //     setSelectedRow((prev) =>
// // // // // //       prev && String(getRowId(prev)) === String(rowId)
// // // // // //         ? { ...prev, [field]: value, isDirty: true }
// // // // // //         : prev,
// // // // // //     );
// // // // // //   };

// // // // // //   const handleVendorSelect = (option) => {
// // // // // //     handleDetailInputChange("vendCustId", option.value);
// // // // // //     handleDetailInputChange("vendorName", option.label);
// // // // // //   };

// // // // // //   const handleProjectSelect = (option, rowId) => {
// // // // // //     handleInputChange("projId", option.value, rowId);
// // // // // //     handleInputChange("projectDescription", option.label, rowId);
// // // // // //   };

// // // // // //   const handleDetailInputChange = (field, value) => {
// // // // // //     if (!detailRow) return;
// // // // // //     setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// // // // // //     if (selectedRow) {
// // // // // //       handleInputChange(field, value, activeRowId);
// // // // // //     }
// // // // // //   };

// // // // // //   const clearDetailFields = () => {
// // // // // //     if (!detailRow) {
// // // // // //       toast.warn("Please select a waiver record first.");
// // // // // //       return;
// // // // // //     }
// // // // // //     handleDetailInputChange("vendCustId", "");
// // // // // //     handleDetailInputChange("vendorName", "");
// // // // // //     handleDetailInputChange("finalWaiverFl", "N");
// // // // // //   };

// // // // // //   const handleAddDetail = () => {
// // // // // //     if (!selectedRow) {
// // // // // //       toast.warn("Please select a waiver record first.");
// // // // // //       return;
// // // // // //     }

// // // // // //     const blankDetail = {
// // // // // //       ...selectedRow,
// // // // // //       vendCustId: "",
// // // // // //       vendorName: "",
// // // // // //       finalWaiverFl: "N",
// // // // // //       isDirty: true,
// // // // // //     };
// // // // // //     setDetailRow(blankDetail);
// // // // // //     setDetailSelected(true);
// // // // // //   };

// // // // // //   const handleCopyDetail = () => {
// // // // // //     if (!detailRow?.vendCustId) {
// // // // // //       toast.warn("No vendor detail selected to copy.");
// // // // // //       return;
// // // // // //     }
// // // // // //     setDetailClipboard({
// // // // // //       vendCustId: detailRow.vendCustId,
// // // // // //       vendorName: detailRow.vendorName || "",
// // // // // //       finalWaiverFl: detailRow.finalWaiverFl || "N",
// // // // // //     });
// // // // // //     toast.success("Vendor detail copied.");
// // // // // //   };

// // // // // //   const handleDeleteDetail = () => {
// // // // // //     clearDetailFields();
// // // // // //   };

// // // // // //   const handleAdd = () => {
// // // // // //     const newRow = {
// // // // // //       ...initialRecord,
// // // // // //       lienNo: getNextLienNo(),
// // // // // //       tempId: `TEMP_${Date.now()}`,
// // // // // //       isNew: true,
// // // // // //       isDirty: true,
// // // // // //     };
// // // // // //     setRecords([newRow, ...records]);
// // // // // //     setSelectedRow(newRow);
// // // // // //     setSelectedRows(new Set([newRow.tempId]));
// // // // // //     setDetailRow(null);
// // // // // //     setDetailSelected(false);
// // // // // //     setCurrentIndex(0);
// // // // // //   };

// // // // // //   const validateRows = (rows) => {
// // // // // //     const requiredFields = ["projId", "waiverTypeCd"];
// // // // // //     for (const row of rows) {
// // // // // //       const missing = requiredFields.find(
// // // // // //         (field) => !row[field] || String(row[field]).trim() === "",
// // // // // //       );
// // // // // //       if (missing) {
// // // // // //         toast.error(
// // // // // //           `Row ${records.indexOf(row) + 1}: ${missing.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`,
// // // // // //         );
// // // // // //         return false;
// // // // // //       }
// // // // // //     }
// // // // // //     return true;
// // // // // //   };

// // // // // //   const buildPayload = (row) => {
// // // // // //     const payload = { ...row };
// // // // // //     delete payload.tempId;
// // // // // //     delete payload.isNew;
// // // // // //     delete payload.isDirty;
// // // // // //     delete payload.vendorName;
// // // // // //     delete payload.projectDescription;
// // // // // //     return {
// // // // // //       ...payload,
// // // // // //       lienNo: Number(row.lienNo || getNextLienNo()),
// // // // // //       lienAmt: Number(row.lienAmt || 1),
// // // // // //       companyId,
// // // // // //       modifiedBy: user.name || row.modifiedBy || "Admin",
// // // // // //       finalWaiverFl: row.finalWaiverFl || "N",
// // // // // //       lienDate: row.lienDate || new Date().toISOString(),
// // // // // //       sentDt: row.sentDt || new Date().toISOString(),
// // // // // //     };
// // // // // //   };

// // // // // //   const handleSaveAll = async () => {
// // // // // //     const changedRows = records.filter((row) => row.isNew || row.isDirty);
// // // // // //     if (changedRows.length === 0) {
// // // // // //       toast.info("No changes to save.");
// // // // // //       return;
// // // // // //     }
// // // // // //     if (!validateRows(changedRows)) return;

// // // // // //     setLoading(true);
// // // // // //     try {
// // // // // //       await Promise.all(
// // // // // //         changedRows.map((row) =>
// // // // // //           row.isNew
// // // // // //             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
// // // // // //             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
// // // // // //         ),
// // // // // //       );
// // // // // //       toast.success("Lien waiver information saved.");
// // // // // //       setDetailRow(null);
// // // // // //       setDetailSelected(false);
// // // // // //       fetchRecords();
// // // // // //     } catch (error) {
// // // // // //       console.error("Save lien waiver information error:", error);
// // // // // //       toast.error(error.response?.data?.message || "Failed to save changes.");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleDelete = async () => {
// // // // // //     if (selectedRows.size === 0) {
// // // // // //       toast.warn("Please select at least one waiver record to delete.");
// // // // // //       return;
// // // // // //     }
// // // // // //     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
// // // // // //       return;
// // // // // //     }

// // // // // //     setLoading(true);
// // // // // //     try {
// // // // // //       for (const id of Array.from(selectedRows)) {
// // // // // //         if (String(id).startsWith("TEMP_")) {
// // // // // //           setRecords((prev) => prev.filter((item) => item.tempId !== id));
// // // // // //         } else {
// // // // // //           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
// // // // // //         }
// // // // // //       }
// // // // // //       toast.success("Selected waiver record(s) deleted.");
// // // // // //       setSelectedRows(new Set());
// // // // // //       setSelectedRow(null);
// // // // // //       setDetailRow(null);
// // // // // //       setDetailSelected(false);
// // // // // //       fetchRecords();
// // // // // //     } catch (error) {
// // // // // //       console.error("Delete lien waiver information error:", error);
// // // // // //       toast.error(error.response?.data?.message || "Failed to delete record.");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleDiscard = () => {
// // // // // //     setRecords([...originalRecords]);
// // // // // //     setSelectedRows(new Set());
// // // // // //     setSelectedRow(null);
// // // // // //     setDetailRow(null);
// // // // // //     setDetailSelected(false);
// // // // // //     toast.info("Changes discarded.");
// // // // // //   };

// // // // // //   const handleNavigate = (direction) => {
// // // // // //     if (records.length === 0) return;
// // // // // //     let nextIndex = currentIndex;
// // // // // //     if (direction === "start") nextIndex = 0;
// // // // // //     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
// // // // // //     if (direction === "next")
// // // // // //       nextIndex = Math.min(records.length - 1, currentIndex + 1);
// // // // // //     if (direction === "end") nextIndex = records.length - 1;

// // // // // //     const nextRecord = records[nextIndex];
// // // // // //     setCurrentIndex(nextIndex);
// // // // // //     setSelectedRow(nextRecord);
// // // // // //     setSelectedRows(new Set([getRowId(nextRecord)]));
// // // // // //     setDetailRow(null);
// // // // // //     setDetailSelected(false);
// // // // // //   };

// // // // // //   const jumpToCode = (code) => {
// // // // // //     const foundIndex = records.findIndex(
// // // // // //       (item) =>
// // // // // //         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
// // // // // //         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
// // // // // //         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
// // // // // //     );
// // // // // //     if (foundIndex === -1) {
// // // // // //       toast.error(`Lien waiver record "${code}" not found.`);
// // // // // //       return;
// // // // // //     }
// // // // // //     const found = records[foundIndex];
// // // // // //     setCurrentIndex(foundIndex);
// // // // // //     setSelectedRow(found);
// // // // // //     setSelectedRows(new Set([getRowId(found)]));
// // // // // //     setDetailRow(null);
// // // // // //     setDetailSelected(false);
// // // // // //   };

// // // // // //   const fetchDetailForRow = async (item) => {
// // // // // //     if (!item?.lienNo || String(item.lienNo) === "0") {
// // // // // //       setDetailRow(null);
// // // // // //       setDetailSelected(false);
// // // // // //       return;
// // // // // //     }

// // // // // //     setLoading(true);
// // // // // //     try {
// // // // // //       const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
// // // // // //       const detail = enrichRecord(response.data || item);
// // // // // //       setDetailRow(detail);
// // // // // //       setDetailSelected(true);
// // // // // //     } catch (error) {
// // // // // //       console.error("Fetch lien waiver detail error:", error);
// // // // // //       setDetailRow(null);
// // // // // //       setDetailSelected(false);
// // // // // //       toast.error(error.response?.data?.message || "Failed to fetch waiver detail.");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const toggleSelection = (item, index) => {
// // // // // //     const rowId = getRowId(item);
// // // // // //     const next = new Set(selectedRows);
// // // // // //     if (next.has(rowId)) {
// // // // // //       next.delete(rowId);
// // // // // //       setSelectedRow(null);
// // // // // //       setDetailRow(null);
// // // // // //       setDetailSelected(false);
// // // // // //     } else {
// // // // // //       next.clear();
// // // // // //       next.add(rowId);
// // // // // //       setSelectedRow(item);
// // // // // //       setCurrentIndex(index);
// // // // // //       if (!String(rowId).startsWith("TEMP_")) {
// // // // // //         fetchDetailForRow(item);
// // // // // //       } else {
// // // // // //         setDetailRow(null);
// // // // // //         setDetailSelected(false);
// // // // // //       }
// // // // // //     }
// // // // // //     setSelectedRows(next);
// // // // // //   };

// // // // // //   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

// // // // // //   return (
// // // // // //     <div className="mt-14 ml-4">
// // // // // //       <MainContainer title="Manage Lien Waiver Information">
// // // // // //         <Toolbar
// // // // // //           isFormView={isFormView}
// // // // // //           totalRecords={records.length}
// // // // // //           selectedRow={selectedRow}
// // // // // //           currentIndex={currentIndex}
// // // // // //           handleNavigate={handleNavigate}
// // // // // //           jumpToCode={jumpToCode}
// // // // // //           searchValue={searchValue}
// // // // // //           setSearchValue={setSearchValue}
// // // // // //           loading={loading}
// // // // // //           actions={{
// // // // // //             onAdd: handleAdd,
// // // // // //             onSave: handleSaveAll,
// // // // // //             onDelete: handleDelete,
// // // // // //             onClear: handleDiscard,
// // // // // //             onToggleView: () => setIsFormView(!isFormView),
// // // // // //           }}
// // // // // //           buttonsDisable={["copy", "paste"]}
// // // // // //         />

// // // // // //         {isFormView ? (
// // // // // //           <div className="p-2 space-y-3">
// // // // // //             <FormSection title="Identification">
// // // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // // //                 <FormSearchSelect
// // // // // //                   label={renderRequiredLabel("Project")}
// // // // // //                   value={selectedRow?.projId || ""}
// // // // // //                   searchTerm={projectSearch}
// // // // // //                   setSearchTerm={setProjectSearch}
// // // // // //                   options={projectOptions}
// // // // // //                   displayKey="value"
// // // // // //                   secondaryKey="label"
// // // // // //                   onSelect={(option) => handleProjectSelect(option, activeRowId)}
// // // // // //                 />
// // // // // //                 <FormInput
// // // // // //                   label="Project Description"
// // // // // //                   value={selectedRow?.projectDescription || ""}
// // // // // //                   readOnly
// // // // // //                 />
// // // // // //               </div>
// // // // // //             </FormSection>

// // // // // //             <FormSection title="Waiver Document Information">
// // // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // // //                 <PortalSearchSelect
// // // // // //                   label="Waiver Doc Cd"
// // // // // //                   value={selectedRow?.waiverTypeCd || ""}
// // // // // //                   options={documentOptions}
// // // // // //                   onSelect={(option) =>
// // // // // //                     handleInputChange("waiverTypeCd", option.value, activeRowId)
// // // // // //                   }
// // // // // //                 />
// // // // // //               </div>
// // // // // //             </FormSection>

// // // // // //           </div>
// // // // // //         ) : (
// // // // // //           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
// // // // // //             <table className="min-w-full text-sm">
// // // // // //               <thead className="bg-gray-200 sticky top-0 z-10">
// // // // // //                 <tr>
// // // // // //                   <th className="th-thead w-10"></th>
// // // // // //                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
// // // // // //                   <th className="th-thead">Project Description</th>
// // // // // //                   <th className="th-thead">Waiver Doc Cd</th>
// // // // // //                 </tr>
// // // // // //               </thead>
// // // // // //               <tbody className="tbody">
// // // // // //                 {records.map((item, index) => {
// // // // // //                   const rowId = getRowId(item);
// // // // // //                   return (
// // // // // //                     <tr
// // // // // //                       key={rowId}
// // // // // //                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
// // // // // //                     >
// // // // // //                       <td className="tbody-td text-center">
// // // // // //                         <input
// // // // // //                           type="checkbox"
// // // // // //                           className="h-3 w-3 accent-blue-600"
// // // // // //                           checked={selectedRows.has(rowId)}
// // // // // //                           onChange={() => toggleSelection(item, index)}
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="tbody-td">
// // // // // //                         <TableSearchSelect
// // // // // //                           options={projectOptions}
// // // // // //                           value={item.projId || ""}
// // // // // //                           displayKey="value"
// // // // // //                           secondaryKey="label"
// // // // // //                           onSelect={(option) => handleProjectSelect(option, rowId)}
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="tbody-td">
// // // // // //                         <input
// // // // // //                           className="td-input bg-gray-100 min-w-[220px]"
// // // // // //                           value={item.projectDescription || ""}
// // // // // //                           readOnly
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                       <td className="tbody-td">
// // // // // //                         <PortalSearchSelect
// // // // // //                           options={documentOptions}
// // // // // //                           value={item.waiverTypeCd || ""}
// // // // // //                           onSelect={(option) =>
// // // // // //                             handleInputChange(
// // // // // //                               "waiverTypeCd",
// // // // // //                               option.value,
// // // // // //                               rowId,
// // // // // //                             )
// // // // // //                           }
// // // // // //                         />
// // // // // //                       </td>
// // // // // //                     </tr>
// // // // // //                   );
// // // // // //                 })}
// // // // // //               </tbody>
// // // // // //             </table>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </MainContainer>

// // // // // //       <SecondaryContainer
// // // // // //         title="Manage Project Waiver Information Detail"
// // // // // //         className="mt-3"
// // // // // //       >
// // // // // //         <Toolbar
// // // // // //           isFormView={false}
// // // // // //           totalRecords={detailRow ? 1 : 0}
// // // // // //           selectedRow={detailRow}
// // // // // //           loading={loading}
// // // // // //           actions={{
// // // // // //             onAdd: handleAddDetail,
// // // // // //             onCopy: handleCopyDetail,
// // // // // //             onDelete: handleDeleteDetail,
// // // // // //           }}
// // // // // //           clipboard={detailClipboard ? [detailClipboard] : []}
// // // // // //           buttonsDisable={["paste", "discard", "save", "tableform"]}
// // // // // //         />
// // // // // //         <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
// // // // // //           <table className="min-w-full text-sm">
// // // // // //             <thead className="bg-gray-200 sticky top-0 z-10">
// // // // // //               <tr>
// // // // // //                 <th className="th-thead w-10"></th>
// // // // // //                 <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
// // // // // //                 <th className="th-thead">Vendor Name</th>
// // // // // //                 <th className="th-thead">Print Final Waiver</th>
// // // // // //               </tr>
// // // // // //             </thead>
// // // // // //             <tbody className="tbody">
// // // // // //               {detailRow && (
// // // // // //                 <tr>
// // // // // //                   <td className="tbody-td text-center">
// // // // // //                     <input
// // // // // //                       type="checkbox"
// // // // // //                       className="h-3 w-3 accent-blue-600"
// // // // // //                       checked={detailSelected}
// // // // // //                       onChange={(e) => setDetailSelected(e.target.checked)}
// // // // // //                     />
// // // // // //                   </td>
// // // // // //                   <td className="tbody-td">
// // // // // //                     <PortalSearchSelect
// // // // // //                       label=""
// // // // // //                       options={vendorOptions}
// // // // // //                       value={detailRow.vendCustId || ""}
// // // // // //                       onSelect={(option) => handleVendorSelect(option)}
// // // // // //                     />
// // // // // //                   </td>
// // // // // //                   <td className="tbody-td">
// // // // // //                     <input
// // // // // //                       className="td-input bg-gray-100 min-w-[220px]"
// // // // // //                       value={detailRow.vendorName || ""}
// // // // // //                       readOnly
// // // // // //                     />
// // // // // //                   </td>
// // // // // //                   <td className="tbody-td text-center">
// // // // // //                     <input
// // // // // //                       type="checkbox"
// // // // // //                       className="h-3 w-3 accent-blue-600"
// // // // // //                       checked={detailRow.finalWaiverFl === "Y"}
// // // // // //                       onChange={(e) =>
// // // // // //                         handleDetailInputChange(
// // // // // //                           "finalWaiverFl",
// // // // // //                           e.target.checked ? "Y" : "N",
// // // // // //                         )
// // // // // //                       }
// // // // // //                     />
// // // // // //                   </td>
// // // // // //                 </tr>
// // // // // //               )}
// // // // // //             </tbody>
// // // // // //           </table>
// // // // // //         </div>
// // // // // //       </SecondaryContainer>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default ManageLienWaiverInformation;

// // // // // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // // // // import { createPortal } from "react-dom";
// // // // // import { Search } from "lucide-react";
// // // // // import { toast } from "react-toastify";
// // // // // import { FormInput, FormSection } from "../helper/formSection";
// // // // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // // // import api from "../utils/api";
// // // // // import { backendUrl } from "./config";

// // // // // const LienWaiverFormSearchSelect = ({
// // // // //   label,
// // // // //   value,
// // // // //   searchTerm = "",
// // // // //   setSearchTerm,
// // // // //   options,
// // // // //   onSelect,
// // // // //   onChange,
// // // // //   displayKey,
// // // // //   secondaryKey,
// // // // //   disabled,
// // // // //   placeholder = "",
// // // // // }) => {
// // // // //   const [showDropdown, setShowDropdown] = useState(false);

// // // // //   const selectedOption = options?.find((opt) => {
// // // // //     const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey]];
// // // // //     return candidateKeys.some((key) => String(key) === String(value));
// // // // //   });

// // // // //   const filteredOptions = (options || []).filter((opt) => {
// // // // //     const search = searchTerm.toLowerCase().trim();

// // // // //     if (!search) return true;

// // // // //     const mainValue = String(opt[displayKey] || "").toLowerCase();
// // // // //     const subValue = secondaryKey
// // // // //       ? String(opt[secondaryKey] || "").toLowerCase()
// // // // //       : "";

// // // // //     return mainValue.includes(search) || subValue.includes(search);
// // // // //   });

// // // // //   const [isTyping, setIsTyping] = useState(false);

// // // // //   const inputValue = isTyping
// // // // //     ? searchTerm
// // // // //     : selectedOption
// // // // //       ? selectedOption[displayKey]
// // // // //       : searchTerm || value || "";

// // // // //   return (
// // // // //     <div className="space-x-4 flex items-center relative">
// // // // //       {label && (
// // // // //         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
// // // // //           {label}
// // // // //         </label>
// // // // //       )}

// // // // //       <div className="relative flex-1">
// // // // //         <div className="relative group flex items-center">
// // // // //           <input
// // // // //             type="text"
// // // // //             disabled={disabled}
// // // // //             className={`border outline-none w-full border-gray-300 pl-2 pr-8 py-0.5 rounded text-[10px] 
// // // // //               ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
// // // // //             value={inputValue}
// // // // //             placeholder={placeholder}
// // // // //             onChange={(e) => {
// // // // //               setIsTyping(true);
// // // // //               setSearchTerm(e.target.value);
// // // // //               setShowDropdown(true);
// // // // //               if (onChange) {
// // // // //                 onChange(e.target.value);
// // // // //               }
// // // // //             }}
// // // // //             onBlur={() => {
// // // // //               setIsTyping(false);
// // // // //             }}
// // // // //             onFocus={() => !disabled && setShowDropdown(true)}
// // // // //           />
// // // // //           <div
// // // // //             className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
// // // // //             onClick={() => !disabled && setShowDropdown(!showDropdown)}
// // // // //           >
// // // // //             <Search size={12} />
// // // // //           </div>
// // // // //         </div>

// // // // //         {showDropdown && !disabled && (
// // // // //           <>
// // // // //             <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
// // // // //               {filteredOptions.length > 0 ? (
// // // // //                 filteredOptions.map((opt, idx) => (
// // // // //                   <div
// // // // //                     key={idx}
// // // // //                     className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // // // //                     onClick={() => {
// // // // //                       onSelect(opt);
// // // // //                       setSearchTerm("");
// // // // //                       setShowDropdown(false);
// // // // //                     }}
// // // // //                   >
// // // // //                     <span className="font-[400] text-black">
// // // // //                       {opt[displayKey]}
// // // // //                     </span>
// // // // //                     {secondaryKey && opt[secondaryKey] && (
// // // // //                       <span className="text-gray-400 ml-2">
// // // // //                         ({opt[secondaryKey]})
// // // // //                       </span>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 ))
// // // // //               ) : (
// // // // //                 <div className="p-3 text-[10px] text-gray-400 italic text-center">
// // // // //                   No matches
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>
// // // // //             <div
// // // // //               className="fixed inset-0 z-[90]"
// // // // //               onClick={() => setShowDropdown(false)}
// // // // //             />
// // // // //           </>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const LienWaiverTableSearchSelect = ({
// // // // //   id,
// // // // //   value,
// // // // //   options = [],
// // // // //   onSelect,
// // // // //   onChange,
// // // // //   displayKey,
// // // // //   secondaryKey,
// // // // //   disabled,
// // // // // }) => {
// // // // //   const [showDropdown, setShowDropdown] = useState(false);
// // // // //   const [searchTerm, setSearchTerm] = useState("");
// // // // //   const [dropdownStyle, setDropdownStyle] = useState({});
// // // // //   const wrapperRef = React.useRef(null);

// // // // //   const filteredOptions = options.filter((opt) => {
// // // // //     const mainValue = String(opt[displayKey] || "").toLowerCase();
// // // // //     const subValue = secondaryKey
// // // // //       ? String(opt[secondaryKey] || "").toLowerCase()
// // // // //       : "";
// // // // //     const term = searchTerm.toLowerCase();

// // // // //     return mainValue.includes(term) || subValue.includes(term);
// // // // //   });

// // // // //   const updateDropdownPosition = () => {
// // // // //     if (!wrapperRef.current) return;
// // // // //     const rect = wrapperRef.current.getBoundingClientRect();
// // // // //     setDropdownStyle({
// // // // //       position: "fixed",
// // // // //       top: rect.bottom + window.scrollY,
// // // // //       left: rect.left + window.scrollX,
// // // // //       width: rect.width,
// // // // //       zIndex: 9999,
// // // // //     });
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     if (showDropdown) updateDropdownPosition();
// // // // //   }, [showDropdown, searchTerm]);

// // // // //   useEffect(() => {
// // // // //     const handleScroll = () => {
// // // // //       if (showDropdown) updateDropdownPosition();
// // // // //     };
// // // // //     window.addEventListener("resize", handleScroll);
// // // // //     window.addEventListener("scroll", handleScroll, true);
// // // // //     return () => {
// // // // //       window.removeEventListener("resize", handleScroll);
// // // // //       window.removeEventListener("scroll", handleScroll, true);
// // // // //     };
// // // // //   }, [showDropdown]);

// // // // //   return (
// // // // //     <div className="relative w-full min-w-[150px]" ref={wrapperRef}>
// // // // //       <div className="relative flex items-center">
// // // // //         <input
// // // // //           type="text"
// // // // //           disabled={disabled}
// // // // //           className={`w-full border outline-none border-gray-200 pl-1 pr-6 py-0.5 rounded text-[10px] 
// // // // //             ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white focus:border-blue-300"}`}
// // // // //           value={
// // // // //             showDropdown
// // // // //               ? searchTerm
// // // // //               : value !== undefined && value !== null
// // // // //                 ? value
// // // // //                 : ""
// // // // //           }
// // // // //           onChange={(e) => {
// // // // //             setSearchTerm(e.target.value);
// // // // //             setShowDropdown(true);
// // // // //             if (onChange) {
// // // // //               onChange(e.target.value, id);
// // // // //             }
// // // // //           }}
// // // // //           onFocus={() => !disabled && setShowDropdown(true)}
// // // // //           autoComplete="off"
// // // // //         />
// // // // //         <div className="absolute right-0 px-1 cursor-pointer text-gray-400">
// // // // //           <Search size={10} />
// // // // //         </div>
// // // // //       </div>

// // // // //       {showDropdown &&
// // // // //         !disabled &&
// // // // //         createPortal(
// // // // //           <>
// // // // //             <div
// // // // //               style={dropdownStyle}
// // // // //               className="bg-white border border-gray-300 rounded shadow-2xl max-h-32 overflow-y-auto custom-scrollbar"
// // // // //             >
// // // // //               {filteredOptions.length > 0 ? (
// // // // //                 filteredOptions.map((opt, idx) => (
// // // // //                   <div
// // // // //                     key={idx}
// // // // //                     className="p-1 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // // // //                     onClick={() => {
// // // // //                       onSelect(opt, id);
// // // // //                       setSearchTerm("");
// // // // //                       setShowDropdown(false);
// // // // //                     }}
// // // // //                   >
// // // // //                     <span className="font-semibold">{opt[displayKey]}</span>
// // // // //                     {secondaryKey && opt[secondaryKey] && (
// // // // //                       <span className="text-gray-400 ml-1">
// // // // //                         ({opt[secondaryKey]})
// // // // //                       </span>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 ))
// // // // //               ) : (
// // // // //                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
// // // // //                   No matches
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>
// // // // //             <div
// // // // //               className="fixed inset-0 z-[9998]"
// // // // //               onClick={() => {
// // // // //                 setShowDropdown(false);
// // // // //                 setSearchTerm("");
// // // // //               }}
// // // // //             />
// // // // //           </>,
// // // // //           document.body,
// // // // //         )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // const ManageLienWaiverInformation = () => {
// // // // //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// // // // //   const companyId = user.companyId || "1";

// // // // //   const [records, setRecords] = useState([]);
// // // // //   const [originalRecords, setOriginalRecords] = useState([]);
// // // // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // // // //   const [selectedRow, setSelectedRow] = useState(null);
// // // // //   const [detailRow, setDetailRow] = useState(null);
// // // // //   const [detailSelected, setDetailSelected] = useState(false);
// // // // //   const [isFormView, setIsFormView] = useState(true);
// // // // //   const [currentIndex, setCurrentIndex] = useState(0);
// // // // //   const [searchValue, setSearchValue] = useState("");
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [detailClipboard, setDetailClipboard] = useState(null);

// // // // //   const [projects, setProjects] = useState([]);
// // // // //   const [vendors, setVendors] = useState([]);
// // // // //   const [documents, setDocuments] = useState([]);
// // // // //   const [projectSearch, setProjectSearch] = useState("");
// // // // //   const [documentSearch, setDocumentSearch] = useState("");

// // // // //   const initialRecord = {
// // // // //     lienNo: 0,
// // // // //     projId: "",
// // // // //     projectDescription: "",
// // // // //     waiverTypeCd: "",
// // // // //     vendCustId: "",
// // // // //     vendorName: "",
// // // // //     finalWaiverFl: "N",
// // // // //     lienAmt: 1,
// // // // //     lienDate: new Date().toISOString(),
// // // // //     sentDt: new Date().toISOString(),
// // // // //     returnedDt: null,
// // // // //     addrDc: "",
// // // // //     chkNo: null,
// // // // //     companyId,
// // // // //     modifiedBy: user.name || "Admin",
// // // // //   };

// // // // //   const renderRequiredLabel = (label) => (
// // // // //     <>
// // // // //       {label} <span className="text-red-600">*</span>
// // // // //     </>
// // // // //   );

// // // // //   const extractList = (payload) => {
// // // // //     if (Array.isArray(payload)) return payload;
// // // // //     if (Array.isArray(payload?.data)) return payload.data;
// // // // //     if (Array.isArray(payload?.items)) return payload.items;
// // // // //     if (Array.isArray(payload?.result)) return payload.result;
// // // // //     if (Array.isArray(payload?.records)) return payload.records;
// // // // //     return [];
// // // // //   };

// // // // //   const normalizeOptions = (items, valueKeys, labelKeys) =>
// // // // //     (Array.isArray(items) ? items : []).map((item) => {
// // // // //       const value =
// // // // //         valueKeys
// // // // //           .map((key) => item?.[key])
// // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // //       const label =
// // // // //         labelKeys
// // // // //           .map((key) => item?.[key])
// // // // //           .find((val) => val !== undefined && val !== null) || "";
// // // // //       return { ...item, value: String(value || ""), label: String(label || "") };
// // // // //     });

// // // // //   const projectOptions = useMemo(
// // // // //     () =>
// // // // //       normalizeOptions(
// // // // //         projects,
// // // // //         ["projId", "projectId", "projID", "projectID", "id", "code"],
// // // // //         [
// // // // //           "projName",
// // // // //           "projectName",
// // // // //           "projectDesc",
// // // // //           "projDescription",
// // // // //           "description",
// // // // //           "name",
// // // // //         ],
// // // // //       ),
// // // // //     [projects],
// // // // //   );

// // // // //   const vendorOptions = useMemo(
// // // // //     () =>
// // // // //       normalizeOptions(
// // // // //         vendors,
// // // // //         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
// // // // //         ["vendName", "vendorName", "vendorLongName", "name"],
// // // // //       ),
// // // // //     [vendors],
// // // // //   );

// // // // //   const documentOptions = useMemo(
// // // // //     () =>
// // // // //       normalizeOptions(
// // // // //         documents,
// // // // //         ["documentCode", "waiverTypeCd", "code", "value"],
// // // // //         ["documentDescription", "documentName", "description", "label"],
// // // // //       ),
// // // // //     [documents],
// // // // //   );

// // // // //   const enrichRecord = useCallback((record) => {
// // // // //     const vendor = vendorOptions.find(
// // // // //       (item) => String(item.value) === String(record.vendCustId),
// // // // //     );
// // // // //     const project = projectOptions.find(
// // // // //       (item) => String(item.value) === String(record.projId),
// // // // //     );
// // // // //     return {
// // // // //       ...record,
// // // // //       vendorName: record.vendorName || vendor?.label || "",
// // // // //       projectDescription: record.projectDescription || project?.label || "",
// // // // //     };
// // // // //   }, [projectOptions, vendorOptions]);

// // // // //   const getRowId = (row) => row.tempId || row.lienNo;

// // // // //   const getNextLienNo = () => {
// // // // //     const usedNumbers = records
// // // // //       .map((row) => Number(row.lienNo))
// // // // //       .filter((value) => Number.isFinite(value) && value > 0);
// // // // //     return (usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1;
// // // // //   };

// // // // //   const fetchRecords = useCallback(async () => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const response = await api.get(
// // // // //         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
// // // // //       );
// // // // //       const data = (Array.isArray(response.data) ? response.data : []).map(
// // // // //         enrichRecord,
// // // // //       );
// // // // //       setRecords(data);
// // // // //       setOriginalRecords(data);
// // // // //       if (data.length > 0) {
// // // // //         setSelectedRow(data[0]);
// // // // //         setSelectedRows(new Set([getRowId(data[0])]));
// // // // //         setCurrentIndex(0);
// // // // //       } else {
// // // // //         setSelectedRow(null);
// // // // //         setSelectedRows(new Set());
// // // // //         setCurrentIndex(0);
// // // // //       }
// // // // //       setDetailRow(null);
// // // // //       setDetailSelected(false);
// // // // //     } catch (error) {
// // // // //       console.error("Fetch lien waiver information error:", error);
// // // // //       toast.error(
// // // // //         error.response?.data?.message || "Failed to fetch lien waiver information.",
// // // // //       );
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   }, [companyId, enrichRecord]);

// // // // //   const fetchLookups = useCallback(async () => {
// // // // //     try {
// // // // //       const [projectRes, vendorRes, documentRes] = await Promise.all([
// // // // //         api.get(`${backendUrl}/Project/GetAllProjects`),
// // // // //         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
// // // // //         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
// // // // //       ]);
// // // // //       setProjects(extractList(projectRes.data));
// // // // //       setVendors(extractList(vendorRes.data));
// // // // //       setDocuments(extractList(documentRes.data));
// // // // //     } catch (error) {
// // // // //       console.error("Fetch lien waiver lookup error:", error);
// // // // //       toast.error("Failed to fetch project/vendor/document lookup data.");
// // // // //     }
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     fetchLookups();
// // // // //   }, [fetchLookups]);

// // // // //   useEffect(() => {
// // // // //     fetchRecords();
// // // // //   }, [fetchRecords]);

// // // // //   const handleInputChange = (field, value, rowId) => {
// // // // //     setRecords((prev) =>
// // // // //       prev.map((item) =>
// // // // //         String(getRowId(item)) === String(rowId)
// // // // //           ? { ...item, [field]: value, isDirty: true }
// // // // //           : item,
// // // // //       ),
// // // // //     );
// // // // //     setSelectedRow((prev) =>
// // // // //       prev && String(getRowId(prev)) === String(rowId)
// // // // //         ? { ...prev, [field]: value, isDirty: true }
// // // // //         : prev,
// // // // //     );
// // // // //   };

// // // // //   const handleVendorSelect = (option) => {
// // // // //     handleDetailInputChange("vendCustId", option.value);
// // // // //     handleDetailInputChange("vendorName", option.label);
// // // // //   };

// // // // //   const handleProjectSelect = (option, rowId) => {
// // // // //     handleInputChange("projId", option.value, rowId);
// // // // //     handleInputChange("projectDescription", option.label, rowId);
// // // // //   };

// // // // //   const handleDetailInputChange = (field, value) => {
// // // // //     if (!detailRow) return;
// // // // //     setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// // // // //     if (selectedRow) {
// // // // //       handleInputChange(field, value, activeRowId);
// // // // //     }
// // // // //   };

// // // // //   const clearDetailFields = () => {
// // // // //     if (!detailRow) {
// // // // //       toast.warn("Please select a waiver record first.");
// // // // //       return;
// // // // //     }
// // // // //     handleDetailInputChange("vendCustId", "");
// // // // //     handleDetailInputChange("vendorName", "");
// // // // //     handleDetailInputChange("finalWaiverFl", "N");
// // // // //   };

// // // // //   const handleAddDetail = () => {
// // // // //     if (!selectedRow) {
// // // // //       toast.warn("Please select a waiver record first.");
// // // // //       return;
// // // // //     }

// // // // //     const blankDetail = {
// // // // //       ...selectedRow,
// // // // //       vendCustId: "",
// // // // //       vendorName: "",
// // // // //       finalWaiverFl: "N",
// // // // //       isDirty: true,
// // // // //     };
// // // // //     setDetailRow(blankDetail);
// // // // //     setDetailSelected(true);
// // // // //   };

// // // // //   const handleCopyDetail = () => {
// // // // //     if (!detailRow?.vendCustId) {
// // // // //       toast.warn("No vendor detail selected to copy.");
// // // // //       return;
// // // // //     }
// // // // //     setDetailClipboard({
// // // // //       vendCustId: detailRow.vendCustId,
// // // // //       vendorName: detailRow.vendorName || "",
// // // // //       finalWaiverFl: detailRow.finalWaiverFl || "N",
// // // // //     });
// // // // //     toast.success("Vendor detail copied.");
// // // // //   };

// // // // //   const handleDeleteDetail = () => {
// // // // //     clearDetailFields();
// // // // //   };

// // // // //   const handleAdd = () => {
// // // // //     const newRow = {
// // // // //       ...initialRecord,
// // // // //       lienNo: getNextLienNo(),
// // // // //       tempId: `TEMP_${Date.now()}`,
// // // // //       isNew: true,
// // // // //       isDirty: true,
// // // // //     };
// // // // //     setRecords([newRow, ...records]);
// // // // //     setSelectedRow(newRow);
// // // // //     setSelectedRows(new Set([newRow.tempId]));
// // // // //     setDetailRow(null);
// // // // //     setDetailSelected(false);
// // // // //     setCurrentIndex(0);
// // // // //   };

// // // // //   const validateRows = (rows) => {
// // // // //     const requiredFields = ["projId", "waiverTypeCd"];
// // // // //     for (const row of rows) {
// // // // //       const missing = requiredFields.find(
// // // // //         (field) => !row[field] || String(row[field]).trim() === "",
// // // // //       );
// // // // //       if (missing) {
// // // // //         toast.error(
// // // // //           `Row ${records.indexOf(row) + 1}: ${missing.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`,
// // // // //         );
// // // // //         return false;
// // // // //       }
// // // // //     }
// // // // //     return true;
// // // // //   };

// // // // //   const buildPayload = (row) => {
// // // // //     const payload = { ...row };
// // // // //     delete payload.tempId;
// // // // //     delete payload.isNew;
// // // // //     delete payload.isDirty;
// // // // //     delete payload.vendorName;
// // // // //     delete payload.projectDescription;
// // // // //     return {
// // // // //       ...payload,
// // // // //       lienNo: Number(row.lienNo || getNextLienNo()),
// // // // //       lienAmt: Number(row.lienAmt || 1),
// // // // //       companyId,
// // // // //       modifiedBy: user.name || row.modifiedBy || "Admin",
// // // // //       finalWaiverFl: row.finalWaiverFl || "N",
// // // // //       lienDate: row.lienDate || new Date().toISOString(),
// // // // //       sentDt: row.sentDt || new Date().toISOString(),
// // // // //     };
// // // // //   };

// // // // //   const handleSaveAll = async () => {
// // // // //     const changedRows = records.filter((row) => row.isNew || row.isDirty);
// // // // //     if (changedRows.length === 0) {
// // // // //       toast.info("No changes to save.");
// // // // //       return;
// // // // //     }
// // // // //     if (!validateRows(changedRows)) return;

// // // // //     setLoading(true);
// // // // //     try {
// // // // //       await Promise.all(
// // // // //         changedRows.map((row) =>
// // // // //           row.isNew
// // // // //             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
// // // // //             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
// // // // //         ),
// // // // //       );
// // // // //       toast.success("Lien waiver information saved.");
// // // // //       setDetailRow(null);
// // // // //       setDetailSelected(false);
// // // // //       fetchRecords();
// // // // //     } catch (error) {
// // // // //       console.error("Save lien waiver information error:", error);
// // // // //       toast.error(error.response?.data?.message || "Failed to save changes.");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleDelete = async () => {
// // // // //     if (selectedRows.size === 0) {
// // // // //       toast.warn("Please select at least one waiver record to delete.");
// // // // //       return;
// // // // //     }
// // // // //     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
// // // // //       return;
// // // // //     }

// // // // //     setLoading(true);
// // // // //     try {
// // // // //       for (const id of Array.from(selectedRows)) {
// // // // //         if (String(id).startsWith("TEMP_")) {
// // // // //           setRecords((prev) => prev.filter((item) => item.tempId !== id));
// // // // //         } else {
// // // // //           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
// // // // //         }
// // // // //       }
// // // // //       toast.success("Selected waiver record(s) deleted.");
// // // // //       setSelectedRows(new Set());
// // // // //       setSelectedRow(null);
// // // // //       setDetailRow(null);
// // // // //       setDetailSelected(false);
// // // // //       fetchRecords();
// // // // //     } catch (error) {
// // // // //       console.error("Delete lien waiver information error:", error);
// // // // //       toast.error(error.response?.data?.message || "Failed to delete record.");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleDiscard = () => {
// // // // //     setRecords([...originalRecords]);
// // // // //     setSelectedRows(new Set());
// // // // //     setSelectedRow(null);
// // // // //     setDetailRow(null);
// // // // //     setDetailSelected(false);
// // // // //     toast.info("Changes discarded.");
// // // // //   };

// // // // //   const handleNavigate = (direction) => {
// // // // //     if (records.length === 0) return;
// // // // //     let nextIndex = currentIndex;
// // // // //     if (direction === "start") nextIndex = 0;
// // // // //     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
// // // // //     if (direction === "next")
// // // // //       nextIndex = Math.min(records.length - 1, currentIndex + 1);
// // // // //     if (direction === "end") nextIndex = records.length - 1;

// // // // //     const nextRecord = records[nextIndex];
// // // // //     setCurrentIndex(nextIndex);
// // // // //     setSelectedRow(nextRecord);
// // // // //     setSelectedRows(new Set([getRowId(nextRecord)]));
// // // // //     setDetailRow(null);
// // // // //     setDetailSelected(false);
// // // // //   };

// // // // //   const jumpToCode = (code) => {
// // // // //     const foundIndex = records.findIndex(
// // // // //       (item) =>
// // // // //         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
// // // // //         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
// // // // //         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
// // // // //     );
// // // // //     if (foundIndex === -1) {
// // // // //       toast.error(`Lien waiver record "${code}" not found.`);
// // // // //       return;
// // // // //     }
// // // // //     const found = records[foundIndex];
// // // // //     setCurrentIndex(foundIndex);
// // // // //     setSelectedRow(found);
// // // // //     setSelectedRows(new Set([getRowId(found)]));
// // // // //     setDetailRow(null);
// // // // //     setDetailSelected(false);
// // // // //   };

// // // // //   const fetchDetailForRow = async (item) => {
// // // // //     if (!item?.lienNo || String(item.lienNo) === "0") {
// // // // //       setDetailRow(null);
// // // // //       setDetailSelected(false);
// // // // //       return;
// // // // //     }

// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
// // // // //       const detail = enrichRecord(response.data || item);
// // // // //       setDetailRow(detail);
// // // // //       setDetailSelected(true);
// // // // //     } catch (error) {
// // // // //       console.error("Fetch lien waiver detail error:", error);
// // // // //       setDetailRow(null);
// // // // //       setDetailSelected(false);
// // // // //       toast.error(error.response?.data?.message || "Failed to fetch waiver detail.");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const toggleSelection = (item, index) => {
// // // // //     const rowId = getRowId(item);
// // // // //     const next = new Set(selectedRows);
// // // // //     if (next.has(rowId)) {
// // // // //       next.delete(rowId);
// // // // //       setSelectedRow(null);
// // // // //       setDetailRow(null);
// // // // //       setDetailSelected(false);
// // // // //     } else {
// // // // //       next.clear();
// // // // //       next.add(rowId);
// // // // //       setSelectedRow(item);
// // // // //       setCurrentIndex(index);
// // // // //       if (!String(rowId).startsWith("TEMP_")) {
// // // // //         fetchDetailForRow(item);
// // // // //       } else {
// // // // //         setDetailRow(null);
// // // // //         setDetailSelected(false);
// // // // //       }
// // // // //     }
// // // // //     setSelectedRows(next);
// // // // //   };

// // // // //   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

// // // // //   return (
// // // // //     <div className="mt-14 ml-4">
// // // // //       <MainContainer title="Manage Lien Waiver Information">
// // // // //         <Toolbar
// // // // //           isFormView={isFormView}
// // // // //           totalRecords={records.length}
// // // // //           selectedRow={selectedRow}
// // // // //           currentIndex={currentIndex}
// // // // //           handleNavigate={handleNavigate}
// // // // //           jumpToCode={jumpToCode}
// // // // //           searchValue={searchValue}
// // // // //           setSearchValue={setSearchValue}
// // // // //           loading={loading}
// // // // //           actions={{
// // // // //             onAdd: handleAdd,
// // // // //             onSave: handleSaveAll,
// // // // //             onDelete: handleDelete,
// // // // //             onClear: handleDiscard,
// // // // //             onToggleView: () => setIsFormView(!isFormView),
// // // // //           }}
// // // // //           buttonsDisable={["copy", "paste"]}
// // // // //         />

// // // // //         {isFormView ? (
// // // // //           <div className="p-2 space-y-3">
// // // // //             <FormSection title="Identification">
// // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // //                 <LienWaiverFormSearchSelect
// // // // //                   label={renderRequiredLabel("Project")}
// // // // //                   value={selectedRow?.projId || ""}
// // // // //                   searchTerm={projectSearch}
// // // // //                   setSearchTerm={setProjectSearch}
// // // // //                   options={projectOptions}
// // // // //                   displayKey="value"
// // // // //                   secondaryKey="label"
// // // // //                   onSelect={(option) => handleProjectSelect(option, activeRowId)}
// // // // //                   onChange={(val) => {
// // // // //                     handleInputChange("projId", val, activeRowId);
// // // // //                     const found = projectOptions.find(
// // // // //                       (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // // // //                     );
// // // // //                     handleInputChange("projectDescription", found ? found.label : "", activeRowId);
// // // // //                   }}
// // // // //                 />
// // // // //                 <FormInput
// // // // //                   label="Project Description"
// // // // //                   value={selectedRow?.projectDescription || ""}
// // // // //                   readOnly
// // // // //                 />
// // // // //               </div>
// // // // //             </FormSection>

// // // // //             <FormSection title="Waiver Document Information">
// // // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // // //                 <LienWaiverFormSearchSelect
// // // // //                   label="Waiver Doc Cd"
// // // // //                   value={selectedRow?.waiverTypeCd || ""}
// // // // //                   searchTerm={documentSearch}
// // // // //                   setSearchTerm={setDocumentSearch}
// // // // //                   options={documentOptions}
// // // // //                   displayKey="value"
// // // // //                   secondaryKey="label"
// // // // //                   onSelect={(option) =>
// // // // //                     handleInputChange("waiverTypeCd", option.value, activeRowId)
// // // // //                   }
// // // // //                   onChange={(val) =>
// // // // //                     handleInputChange("waiverTypeCd", val, activeRowId)
// // // // //                   }
// // // // //                 />
// // // // //               </div>
// // // // //             </FormSection>

// // // // //           </div>
// // // // //         ) : (
// // // // //           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
// // // // //             <table className="min-w-full text-sm">
// // // // //               <thead className="bg-gray-200 sticky top-0 z-10">
// // // // //                 <tr>
// // // // //                   <th className="th-thead w-10"></th>
// // // // //                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
// // // // //                   <th className="th-thead">Project Description</th>
// // // // //                   <th className="th-thead">Waiver Doc Cd</th>
// // // // //                 </tr>
// // // // //               </thead>
// // // // //               <tbody className="tbody">
// // // // //                 {records.map((item, index) => {
// // // // //                   const rowId = getRowId(item);
// // // // //                   return (
// // // // //                     <tr
// // // // //                       key={rowId}
// // // // //                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
// // // // //                     >
// // // // //                       <td className="tbody-td text-center">
// // // // //                         <input
// // // // //                           type="checkbox"
// // // // //                           className="h-3 w-3 accent-blue-600"
// // // // //                           checked={selectedRows.has(rowId)}
// // // // //                           onChange={() => toggleSelection(item, index)}
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="tbody-td">
// // // // //                         <LienWaiverTableSearchSelect
// // // // //                           options={projectOptions}
// // // // //                           value={item.projId || ""}
// // // // //                           displayKey="value"
// // // // //                           secondaryKey="label"
// // // // //                           onSelect={(option) => handleProjectSelect(option, rowId)}
// // // // //                           onChange={(val) => {
// // // // //                             handleInputChange("projId", val, rowId);
// // // // //                             const found = projectOptions.find(
// // // // //                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // // // //                             );
// // // // //                             handleInputChange("projectDescription", found ? found.label : "", rowId);
// // // // //                           }}
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="tbody-td">
// // // // //                         <input
// // // // //                           className="td-input bg-gray-100 min-w-[220px]"
// // // // //                           value={item.projectDescription || ""}
// // // // //                           readOnly
// // // // //                         />
// // // // //                       </td>
// // // // //                       <td className="tbody-td">
// // // // //                         <LienWaiverTableSearchSelect
// // // // //                           options={documentOptions}
// // // // //                           value={item.waiverTypeCd || ""}
// // // // //                           displayKey="value"
// // // // //                           secondaryKey="label"
// // // // //                           onSelect={(option) =>
// // // // //                             handleInputChange(
// // // // //                               "waiverTypeCd",
// // // // //                               option.value,
// // // // //                               rowId,
// // // // //                             )
// // // // //                           }
// // // // //                           onChange={(val) =>
// // // // //                             handleInputChange(
// // // // //                               "waiverTypeCd",
// // // // //                               val,
// // // // //                               rowId,
// // // // //                             )
// // // // //                           }
// // // // //                         />
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   );
// // // // //                 })}
// // // // //               </tbody>
// // // // //             </table>
// // // // //           </div>
// // // // //         )}
// // // // //       </MainContainer>

// // // // //       <SecondaryContainer
// // // // //         title="Manage Project Waiver Information Detail"
// // // // //         className="mt-3"
// // // // //       >
// // // // //         <Toolbar
// // // // //           isFormView={false}
// // // // //           totalRecords={detailRow ? 1 : 0}
// // // // //           selectedRow={detailRow}
// // // // //           loading={loading}
// // // // //           actions={{
// // // // //             onAdd: handleAddDetail,
// // // // //             onCopy: handleCopyDetail,
// // // // //             onDelete: handleDeleteDetail,
// // // // //           }}
// // // // //           clipboard={detailClipboard ? [detailClipboard] : []}
// // // // //           buttonsDisable={["paste", "discard", "save", "tableform"]}
// // // // //         />
// // // // //         <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
// // // // //           <table className="min-w-full text-sm">
// // // // //             <thead className="bg-gray-200 sticky top-0 z-10">
// // // // //               <tr>
// // // // //                 <th className="th-thead w-10"></th>
// // // // //                 <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
// // // // //                 <th className="th-thead">Vendor Name</th>
// // // // //                 <th className="th-thead">Print Final Waiver</th>
// // // // //               </tr>
// // // // //             </thead>
// // // // //             <tbody className="tbody">
// // // // //               {detailRow && (
// // // // //                 <tr>
// // // // //                   <td className="tbody-td text-center">
// // // // //                     <input
// // // // //                       type="checkbox"
// // // // //                       className="h-3 w-3 accent-blue-600"
// // // // //                       checked={detailSelected}
// // // // //                       onChange={(e) => setDetailSelected(e.target.checked)}
// // // // //                     />
// // // // //                   </td>
// // // // //                   <td className="tbody-td">
// // // // //                     <LienWaiverTableSearchSelect
// // // // //                       options={vendorOptions}
// // // // //                       value={detailRow.vendCustId || ""}
// // // // //                       displayKey="value"
// // // // //                       secondaryKey="label"
// // // // //                       onSelect={(option) => handleVendorSelect(option)}
// // // // //                       onChange={(val) => {
// // // // //                         handleDetailInputChange("vendCustId", val);
// // // // //                         const found = vendorOptions.find(
// // // // //                           (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // // // //                         );
// // // // //                         handleDetailInputChange("vendorName", found ? found.label : "");
// // // // //                       }}
// // // // //                     />
// // // // //                   </td>
// // // // //                   <td className="tbody-td">
// // // // //                     <input
// // // // //                       className="td-input bg-gray-100 min-w-[220px]"
// // // // //                       value={detailRow.vendorName || ""}
// // // // //                       readOnly
// // // // //                     />
// // // // //                   </td>
// // // // //                   <td className="tbody-td text-center">
// // // // //                     <input
// // // // //                       type="checkbox"
// // // // //                       className="h-3 w-3 accent-blue-600"
// // // // //                       checked={detailRow.finalWaiverFl === "Y"}
// // // // //                       onChange={(e) =>
// // // // //                         handleDetailInputChange(
// // // // //                           "finalWaiverFl",
// // // // //                           e.target.checked ? "Y" : "N",
// // // // //                         )
// // // // //                       }
// // // // //                     />
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               )}
// // // // //             </tbody>
// // // // //           </table>
// // // // //         </div>
// // // // //       </SecondaryContainer>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default ManageLienWaiverInformation;

// // // // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // // // import { createPortal } from "react-dom";
// // // // import { Search } from "lucide-react";
// // // // import { toast } from "react-toastify";
// // // // import { FormInput, FormSection } from "../helper/formSection";
// // // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // // import api from "../utils/api";
// // // // import { backendUrl } from "./config";

// // // // const LienWaiverFormSearchSelect = ({
// // // //   label,
// // // //   value,
// // // //   searchTerm = "",
// // // //   setSearchTerm,
// // // //   options,
// // // //   onSelect,
// // // //   onChange,
// // // //   displayKey,
// // // //   secondaryKey,
// // // //   disabled,
// // // //   placeholder = "",
// // // // }) => {
// // // //   const [showDropdown, setShowDropdown] = useState(false);

// // // //   const selectedOption = options?.find((opt) => {
// // // //     const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey]];
// // // //     return candidateKeys.some((key) => String(key) === String(value));
// // // //   });

// // // //   const filteredOptions = (options || []).filter((opt) => {
// // // //     const search = searchTerm.toLowerCase().trim();

// // // //     if (!search) return true;

// // // //     const mainValue = String(opt[displayKey] || "").toLowerCase();
// // // //     const subValue = secondaryKey
// // // //       ? String(opt[secondaryKey] || "").toLowerCase()
// // // //       : "";

// // // //     return mainValue.includes(search) || subValue.includes(search);
// // // //   });

// // // //   const [isTyping, setIsTyping] = useState(false);

// // // //   const inputValue = isTyping
// // // //     ? searchTerm
// // // //     : selectedOption
// // // //       ? selectedOption[displayKey]
// // // //       : searchTerm || value || "";

// // // //   return (
// // // //     <div className="space-x-4 flex items-center relative">
// // // //       {label && (
// // // //         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
// // // //           {label}
// // // //         </label>
// // // //       )}

// // // //       <div className="relative flex-1">
// // // //         <div className="relative group flex items-center">
// // // //           <input
// // // //             type="text"
// // // //             disabled={disabled}
// // // //             className={`border outline-none w-full border-gray-300 pl-2 pr-8 py-0.5 rounded text-[10px] 
// // // //               ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
// // // //             value={inputValue}
// // // //             placeholder={placeholder}
// // // //             onChange={(e) => {
// // // //               setIsTyping(true);
// // // //               setSearchTerm(e.target.value);
// // // //               setShowDropdown(true);
// // // //               if (onChange) {
// // // //                 onChange(e.target.value);
// // // //               }
// // // //             }}
// // // //             onBlur={() => {
// // // //               setIsTyping(false);
// // // //             }}
// // // //             onFocus={() => !disabled && setShowDropdown(true)}
// // // //           />
// // // //           <div
// // // //             className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
// // // //             onClick={() => !disabled && setShowDropdown(!showDropdown)}
// // // //           >
// // // //             <Search size={12} />
// // // //           </div>
// // // //         </div>

// // // //         {showDropdown && !disabled && (
// // // //           <>
// // // //             <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
// // // //               {filteredOptions.length > 0 ? (
// // // //                 filteredOptions.map((opt, idx) => (
// // // //                   <div
// // // //                     key={idx}
// // // //                     className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // // //                     onClick={() => {
// // // //                       onSelect(opt);
// // // //                       setSearchTerm("");
// // // //                       setShowDropdown(false);
// // // //                     }}
// // // //                   >
// // // //                     <span className="font-[400] text-black">
// // // //                       {opt[displayKey]}
// // // //                     </span>
// // // //                     {secondaryKey && opt[secondaryKey] && (
// // // //                       <span className="text-gray-400 ml-2">
// // // //                         ({opt[secondaryKey]})
// // // //                       </span>
// // // //                     )}
// // // //                   </div>
// // // //                 ))
// // // //               ) : (
// // // //                 <div className="p-3 text-[10px] text-gray-400 italic text-center">
// // // //                   No matches
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //             <div
// // // //               className="fixed inset-0 z-[90]"
// // // //               onClick={() => setShowDropdown(false)}
// // // //             />
// // // //           </>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // const LienWaiverTableSearchSelect = ({
// // // //   id,
// // // //   value,
// // // //   options = [],
// // // //   onSelect,
// // // //   onChange,
// // // //   displayKey,
// // // //   secondaryKey,
// // // //   disabled,
// // // // }) => {
// // // //   const [showDropdown, setShowDropdown] = useState(false);
// // // //   const [searchTerm, setSearchTerm] = useState("");
// // // //   const [dropdownStyle, setDropdownStyle] = useState({});
// // // //   const wrapperRef = React.useRef(null);

// // // //   const filteredOptions = options.filter((opt) => {
// // // //     const mainValue = String(opt[displayKey] || "").toLowerCase();
// // // //     const subValue = secondaryKey
// // // //       ? String(opt[secondaryKey] || "").toLowerCase()
// // // //       : "";
// // // //     const term = searchTerm.toLowerCase();

// // // //     return mainValue.includes(term) || subValue.includes(term);
// // // //   });

// // // //   const updateDropdownPosition = () => {
// // // //     if (!wrapperRef.current) return;
// // // //     const rect = wrapperRef.current.getBoundingClientRect();
// // // //     setDropdownStyle({
// // // //       position: "fixed",
// // // //       top: rect.bottom + window.scrollY,
// // // //       left: rect.left + window.scrollX,
// // // //       width: rect.width,
// // // //       zIndex: 9999,
// // // //     });
// // // //   };

// // // //   useEffect(() => {
// // // //     if (showDropdown) updateDropdownPosition();
// // // //   }, [showDropdown, searchTerm]);

// // // //   useEffect(() => {
// // // //     const handleScroll = () => {
// // // //       if (showDropdown) updateDropdownPosition();
// // // //     };
// // // //     window.addEventListener("resize", handleScroll);
// // // //     window.addEventListener("scroll", handleScroll, true);
// // // //     return () => {
// // // //       window.removeEventListener("resize", handleScroll);
// // // //       window.removeEventListener("scroll", handleScroll, true);
// // // //     };
// // // //   }, [showDropdown]);

// // // //   return (
// // // //     <div className="relative w-full min-w-[150px]" ref={wrapperRef}>
// // // //       <div className="relative flex items-center">
// // // //         <input
// // // //           type="text"
// // // //           disabled={disabled}
// // // //           className={`w-full border outline-none border-gray-200 pl-1 pr-6 py-0.5 rounded text-[10px] 
// // // //             ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white focus:border-blue-300"}`}
// // // //           value={
// // // //             showDropdown
// // // //               ? searchTerm
// // // //               : value !== undefined && value !== null
// // // //                 ? value
// // // //                 : ""
// // // //           }
// // // //           onChange={(e) => {
// // // //             setSearchTerm(e.target.value);
// // // //             setShowDropdown(true);
// // // //             if (onChange) {
// // // //               onChange(e.target.value, id);
// // // //             }
// // // //           }}
// // // //           onFocus={() => !disabled && setShowDropdown(true)}
// // // //           autoComplete="off"
// // // //         />
// // // //         <div className="absolute right-0 px-1 cursor-pointer text-gray-400">
// // // //           <Search size={10} />
// // // //         </div>
// // // //       </div>

// // // //       {showDropdown &&
// // // //         !disabled &&
// // // //         createPortal(
// // // //           <>
// // // //             <div
// // // //               style={dropdownStyle}
// // // //               className="bg-white border border-gray-300 rounded shadow-2xl max-h-32 overflow-y-auto custom-scrollbar"
// // // //             >
// // // //               {filteredOptions.length > 0 ? (
// // // //                 filteredOptions.map((opt, idx) => (
// // // //                   <div
// // // //                     key={idx}
// // // //                     className="p-1 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // // //                     onClick={() => {
// // // //                       onSelect(opt, id);
// // // //                       setSearchTerm("");
// // // //                       setShowDropdown(false);
// // // //                     }}
// // // //                   >
// // // //                     <span className="font-semibold">{opt[displayKey]}</span>
// // // //                     {secondaryKey && opt[secondaryKey] && (
// // // //                       <span className="text-gray-400 ml-1">
// // // //                         ({opt[secondaryKey]})
// // // //                       </span>
// // // //                     )}
// // // //                   </div>
// // // //                 ))
// // // //               ) : (
// // // //                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
// // // //                   No matches
// // // //                 </div>
// // // //               )}
// // // //             </div>
// // // //             <div
// // // //               className="fixed inset-0 z-[9998]"
// // // //               onClick={() => {
// // // //                 setShowDropdown(false);
// // // //                 setSearchTerm("");
// // // //               }}
// // // //             />
// // // //           </>,
// // // //           document.body,
// // // //         )}
// // // //     </div>
// // // //   );
// // // // };

// // // // const ManageLienWaiverInformation = () => {
// // // //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// // // //   const companyId = user.companyId || "1";

// // // //   const [records, setRecords] = useState([]);
// // // //   const [originalRecords, setOriginalRecords] = useState([]);
// // // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // // //   const [selectedRow, setSelectedRow] = useState(null);
// // // //   const [detailRow, setDetailRow] = useState(null);
// // // //   const [detailSelected, setDetailSelected] = useState(false);
// // // //   const [isFormView, setIsFormView] = useState(true);
// // // //   const [currentIndex, setCurrentIndex] = useState(0);
// // // //   const [searchValue, setSearchValue] = useState("");
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [detailClipboard, setDetailClipboard] = useState(null);

// // // //   const [projects, setProjects] = useState([]);
// // // //   const [vendors, setVendors] = useState([]);
// // // //   const [documents, setDocuments] = useState([]);
// // // //   const [projectSearch, setProjectSearch] = useState("");
// // // //   const [documentSearch, setDocumentSearch] = useState("");

// // // //   const initialRecord = {
// // // //     lienNo: 0,
// // // //     projId: "",
// // // //     projectDescription: "",
// // // //     waiverTypeCd: "",
// // // //     vendCustId: "",
// // // //     vendorName: "",
// // // //     finalWaiverFl: "N",
// // // //     lienAmt: 1,
// // // //     lienDate: new Date().toISOString(),
// // // //     sentDt: new Date().toISOString(),
// // // //     returnedDt: null,
// // // //     addrDc: "",
// // // //     chkNo: null,
// // // //     companyId,
// // // //     modifiedBy: user.name || "Admin",
// // // //   };

// // // //   const renderRequiredLabel = (label) => (
// // // //     <>
// // // //       {label} <span className="text-red-600">*</span>
// // // //     </>
// // // //   );

// // // //   const extractList = (payload) => {
// // // //     if (Array.isArray(payload)) return payload;
// // // //     if (Array.isArray(payload?.data)) return payload.data;
// // // //     if (Array.isArray(payload?.items)) return payload.items;
// // // //     if (Array.isArray(payload?.result)) return payload.result;
// // // //     if (Array.isArray(payload?.records)) return payload.records;
// // // //     return [];
// // // //   };

// // // //   const normalizeOptions = (items, valueKeys, labelKeys) =>
// // // //     (Array.isArray(items) ? items : []).map((item) => {
// // // //       const value =
// // // //         valueKeys
// // // //           .map((key) => item?.[key])
// // // //           .find((val) => val !== undefined && val !== null) || "";
// // // //       const label =
// // // //         labelKeys
// // // //           .map((key) => item?.[key])
// // // //           .find((val) => val !== undefined && val !== null) || "";
// // // //       return { ...item, value: String(value || ""), label: String(label || "") };
// // // //     });

// // // //   const projectOptions = useMemo(
// // // //     () =>
// // // //       normalizeOptions(
// // // //         projects,
// // // //         ["projId", "projectId", "projID", "projectID", "id", "code"],
// // // //         [
// // // //           "projName",
// // // //           "projectName",
// // // //           "projectDesc",
// // // //           "projDescription",
// // // //           "description",
// // // //           "name",
// // // //         ],
// // // //       ),
// // // //     [projects],
// // // //   );

// // // //   const vendorOptions = useMemo(
// // // //     () =>
// // // //       normalizeOptions(
// // // //         vendors,
// // // //         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
// // // //         ["vendName", "vendorName", "vendorLongName", "name"],
// // // //       ),
// // // //     [vendors],
// // // //   );

// // // //   const documentOptions = useMemo(
// // // //     () =>
// // // //       normalizeOptions(
// // // //         documents,
// // // //         ["documentCode", "waiverTypeCd", "code", "value"],
// // // //         ["documentDescription", "documentName", "description", "label"],
// // // //       ),
// // // //     [documents],
// // // //   );

// // // //   const enrichRecord = useCallback((record) => {
// // // //     const vendor = vendorOptions.find(
// // // //       (item) => String(item.value) === String(record.vendCustId),
// // // //     );
// // // //     const project = projectOptions.find(
// // // //       (item) => String(item.value) === String(record.projId),
// // // //     );
// // // //     return {
// // // //       ...record,
// // // //       vendorName: record.vendorName || vendor?.label || "",
// // // //       projectDescription: record.projectDescription || project?.label || "",
// // // //     };
// // // //   }, [projectOptions, vendorOptions]);

// // // //   const getRowId = (row) => row.tempId || row.lienNo;

// // // //   const getNextLienNo = () => {
// // // //     const usedNumbers = records
// // // //       .map((row) => Number(row.lienNo))
// // // //       .filter((value) => Number.isFinite(value) && value > 0);
// // // //     return (usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1;
// // // //   };

// // // //   const fetchRecords = useCallback(async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const response = await api.get(
// // // //         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
// // // //       );
// // // //       const data = (Array.isArray(response.data) ? response.data : []).map(
// // // //         enrichRecord,
// // // //       );
// // // //       setRecords(data);
// // // //       setOriginalRecords(data);
// // // //       if (data.length > 0) {
// // // //         setSelectedRow(data[0]);
// // // //         setSelectedRows(new Set([getRowId(data[0])]));
// // // //         setCurrentIndex(0);
// // // //       } else {
// // // //         setSelectedRow(null);
// // // //         setSelectedRows(new Set());
// // // //         setCurrentIndex(0);
// // // //       }
// // // //       setDetailRow(null);
// // // //       setDetailSelected(false);
// // // //     } catch (error) {
// // // //       console.error("Fetch lien waiver information error:", error);
// // // //       toast.error(
// // // //         error.response?.data?.message || "Failed to fetch lien waiver information.",
// // // //       );
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }, [companyId, enrichRecord]);

// // // //   const fetchLookups = useCallback(async () => {
// // // //     try {
// // // //       const [projectRes, vendorRes, documentRes] = await Promise.all([
// // // //         api.get(`${backendUrl}/Project/GetAllProjects`),
// // // //         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
// // // //         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
// // // //       ]);
// // // //       setProjects(extractList(projectRes.data));
// // // //       setVendors(extractList(vendorRes.data));
// // // //       setDocuments(extractList(documentRes.data));
// // // //     } catch (error) {
// // // //       console.error("Fetch lien waiver lookup error:", error);
// // // //       toast.error("Failed to fetch project/vendor/document lookup data.");
// // // //     }
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     fetchLookups();
// // // //   }, [fetchLookups]);

// // // //   useEffect(() => {
// // // //     fetchRecords();
// // // //   }, [fetchRecords]);

// // // //   const handleInputChange = (field, value, rowId) => {
// // // //     setRecords((prev) =>
// // // //       prev.map((item) =>
// // // //         String(getRowId(item)) === String(rowId)
// // // //           ? { ...item, [field]: value, isDirty: true }
// // // //           : item,
// // // //       ),
// // // //     );
// // // //     setSelectedRow((prev) =>
// // // //       prev && String(getRowId(prev)) === String(rowId)
// // // //         ? { ...prev, [field]: value, isDirty: true }
// // // //         : prev,
// // // //     );
// // // //   };

// // // //   const handleVendorSelect = (option) => {
// // // //     handleDetailInputChange("vendCustId", option.value);
// // // //     handleDetailInputChange("vendorName", option.label);
// // // //   };

// // // //   const handleProjectSelect = (option, rowId) => {
// // // //     handleInputChange("projId", option.value, rowId);
// // // //     handleInputChange("projectDescription", option.label, rowId);
// // // //   };

// // // //   const handleDetailInputChange = (field, value) => {
// // // //     if (!detailRow) return;
// // // //     setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// // // //     if (selectedRow) {
// // // //       handleInputChange(field, value, activeRowId);
// // // //     }
// // // //   };

// // // //   const clearDetailFields = () => {
// // // //     if (!detailRow) {
// // // //       toast.warn("Please select a waiver record first.");
// // // //       return;
// // // //     }
// // // //     handleDetailInputChange("vendCustId", "");
// // // //     handleDetailInputChange("vendorName", "");
// // // //     handleDetailInputChange("finalWaiverFl", "N");
// // // //   };

// // // //   const handleAddDetail = () => {
// // // //     if (!selectedRow) {
// // // //       toast.warn("Please select a waiver record first.");
// // // //       return;
// // // //     }

// // // //     const blankDetail = {
// // // //       ...selectedRow,
// // // //       vendCustId: "",
// // // //       vendorName: "",
// // // //       finalWaiverFl: "N",
// // // //       isDirty: true,
// // // //     };
// // // //     setDetailRow(blankDetail);
// // // //     setDetailSelected(true);
// // // //   };

// // // //   const handleCopyDetail = () => {
// // // //     if (!detailRow?.vendCustId) {
// // // //       toast.warn("No vendor detail selected to copy.");
// // // //       return;
// // // //     }
// // // //     setDetailClipboard({
// // // //       vendCustId: detailRow.vendCustId,
// // // //       vendorName: detailRow.vendorName || "",
// // // //       finalWaiverFl: detailRow.finalWaiverFl || "N",
// // // //     });
// // // //     toast.success("Vendor detail copied.");
// // // //   };

// // // //   const handleDeleteDetail = () => {
// // // //     clearDetailFields();
// // // //   };

// // // //   const handleAdd = () => {
// // // //     const newRow = {
// // // //       ...initialRecord,
// // // //       lienNo: getNextLienNo(),
// // // //       tempId: `TEMP_${Date.now()}`,
// // // //       isNew: true,
// // // //       isDirty: true,
// // // //     };
// // // //     setRecords([newRow, ...records]);
// // // //     setSelectedRow(newRow);
// // // //     setSelectedRows(new Set([newRow.tempId]));
// // // //     setDetailRow(null);
// // // //     setDetailSelected(false);
// // // //     setCurrentIndex(0);
// // // //   };

// // // //   const validateRows = (rows) => {
// // // //     const requiredFields = ["projId", "waiverTypeCd"];
// // // //     for (const row of rows) {
// // // //       const missing = requiredFields.find(
// // // //         (field) => !row[field] || String(row[field]).trim() === "",
// // // //       );
// // // //       if (missing) {
// // // //         toast.error(
// // // //           `Row ${records.indexOf(row) + 1}: ${missing.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`,
// // // //         );
// // // //         return false;
// // // //       }
// // // //     }
// // // //     return true;
// // // //   };

// // // //   const buildPayload = (row) => {
// // // //     const payload = { ...row };
// // // //     delete payload.tempId;
// // // //     delete payload.isNew;
// // // //     delete payload.isDirty;
// // // //     delete payload.vendorName;
// // // //     delete payload.projectDescription;

// // // //     if (payload.returnedDt === null || payload.returnedDt === undefined) {
// // // //       delete payload.returnedDt;
// // // //     }
// // // //     if (payload.chkNo === null || payload.chkNo === undefined) {
// // // //       delete payload.chkNo;
// // // //     }

// // // //     return {
// // // //       ...payload,
// // // //       lienNo: Number(row.lienNo || getNextLienNo()),
// // // //       lienAmt: Number(row.lienAmt || 1),
// // // //       companyId,
// // // //       modifiedBy: user.name || row.modifiedBy || "Admin",
// // // //       finalWaiverFl: row.finalWaiverFl || "N",
// // // //       lienDate: row.lienDate || new Date().toISOString(),
// // // //       sentDt: row.sentDt || new Date().toISOString(),
// // // //     };
// // // //   };

// // // //   const handleSaveAll = async () => {
// // // //     const changedRows = records.filter((row) => row.isNew || row.isDirty);
// // // //     if (changedRows.length === 0) {
// // // //       toast.info("No changes to save.");
// // // //       return;
// // // //     }
// // // //     if (!validateRows(changedRows)) return;

// // // //     setLoading(true);
// // // //     try {
// // // //       await Promise.all(
// // // //         changedRows.map((row) =>
// // // //           row.isNew
// // // //             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
// // // //             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
// // // //         ),
// // // //       );
// // // //       toast.success("Lien waiver information saved.");
// // // //       setDetailRow(null);
// // // //       setDetailSelected(false);
// // // //       fetchRecords();
// // // //     } catch (error) {
// // // //       console.error("Save lien waiver information error:", error);
// // // //       toast.error(error.response?.data?.message || "Failed to save changes.");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleDelete = async () => {
// // // //     if (selectedRows.size === 0) {
// // // //       toast.warn("Please select at least one waiver record to delete.");
// // // //       return;
// // // //     }
// // // //     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     try {
// // // //       for (const id of Array.from(selectedRows)) {
// // // //         if (String(id).startsWith("TEMP_")) {
// // // //           setRecords((prev) => prev.filter((item) => item.tempId !== id));
// // // //         } else {
// // // //           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
// // // //         }
// // // //       }
// // // //       toast.success("Selected waiver record(s) deleted.");
// // // //       setSelectedRows(new Set());
// // // //       setSelectedRow(null);
// // // //       setDetailRow(null);
// // // //       setDetailSelected(false);
// // // //       fetchRecords();
// // // //     } catch (error) {
// // // //       console.error("Delete lien waiver information error:", error);
// // // //       toast.error(error.response?.data?.message || "Failed to delete record.");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleDiscard = () => {
// // // //     setRecords([...originalRecords]);
// // // //     setSelectedRows(new Set());
// // // //     setSelectedRow(null);
// // // //     setDetailRow(null);
// // // //     setDetailSelected(false);
// // // //     toast.info("Changes discarded.");
// // // //   };

// // // //   const handleNavigate = (direction) => {
// // // //     if (records.length === 0) return;
// // // //     let nextIndex = currentIndex;
// // // //     if (direction === "start") nextIndex = 0;
// // // //     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
// // // //     if (direction === "next")
// // // //       nextIndex = Math.min(records.length - 1, currentIndex + 1);
// // // //     if (direction === "end") nextIndex = records.length - 1;

// // // //     const nextRecord = records[nextIndex];
// // // //     setCurrentIndex(nextIndex);
// // // //     setSelectedRow(nextRecord);
// // // //     setSelectedRows(new Set([getRowId(nextRecord)]));
// // // //     setDetailRow(null);
// // // //     setDetailSelected(false);
// // // //   };

// // // //   const jumpToCode = (code) => {
// // // //     const foundIndex = records.findIndex(
// // // //       (item) =>
// // // //         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
// // // //         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
// // // //         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
// // // //     );
// // // //     if (foundIndex === -1) {
// // // //       toast.error(`Lien waiver record "${code}" not found.`);
// // // //       return;
// // // //     }
// // // //     const found = records[foundIndex];
// // // //     setCurrentIndex(foundIndex);
// // // //     setSelectedRow(found);
// // // //     setSelectedRows(new Set([getRowId(found)]));
// // // //     setDetailRow(null);
// // // //     setDetailSelected(false);
// // // //   };

// // // //   const fetchDetailForRow = async (item) => {
// // // //     if (!item?.lienNo || String(item.lienNo) === "0") {
// // // //       setDetailRow(null);
// // // //       setDetailSelected(false);
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     try {
// // // //       const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
// // // //       const detail = enrichRecord(response.data || item);
// // // //       setDetailRow(detail);
// // // //       setDetailSelected(true);
// // // //     } catch (error) {
// // // //       console.error("Fetch lien waiver detail error:", error);
// // // //       setDetailRow(null);
// // // //       setDetailSelected(false);
// // // //       toast.error(error.response?.data?.message || "Failed to fetch waiver detail.");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const toggleSelection = (item, index) => {
// // // //     const rowId = getRowId(item);
// // // //     const next = new Set(selectedRows);
// // // //     if (next.has(rowId)) {
// // // //       next.delete(rowId);
// // // //       setSelectedRow(null);
// // // //       setDetailRow(null);
// // // //       setDetailSelected(false);
// // // //     } else {
// // // //       next.clear();
// // // //       next.add(rowId);
// // // //       setSelectedRow(item);
// // // //       setCurrentIndex(index);
// // // //       if (!String(rowId).startsWith("TEMP_")) {
// // // //         fetchDetailForRow(item);
// // // //       } else {
// // // //         setDetailRow(null);
// // // //         setDetailSelected(false);
// // // //       }
// // // //     }
// // // //     setSelectedRows(next);
// // // //   };

// // // //   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

// // // //   return (
// // // //     <div className="mt-14 ml-4">
// // // //       <MainContainer title="Manage Lien Waiver Information">
// // // //         <Toolbar
// // // //           isFormView={isFormView}
// // // //           totalRecords={records.length}
// // // //           selectedRow={selectedRow}
// // // //           currentIndex={currentIndex}
// // // //           handleNavigate={handleNavigate}
// // // //           jumpToCode={jumpToCode}
// // // //           searchValue={searchValue}
// // // //           setSearchValue={setSearchValue}
// // // //           loading={loading}
// // // //           actions={{
// // // //             onAdd: handleAdd,
// // // //             onSave: handleSaveAll,
// // // //             onDelete: handleDelete,
// // // //             onClear: handleDiscard,
// // // //             onToggleView: () => setIsFormView(!isFormView),
// // // //           }}
// // // //           buttonsDisable={["copy", "paste"]}
// // // //         />

// // // //         {isFormView ? (
// // // //           <div className="p-2 space-y-3">
// // // //             <FormSection title="Identification">
// // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // //                 <LienWaiverFormSearchSelect
// // // //                   label={renderRequiredLabel("Project")}
// // // //                   value={selectedRow?.projId || ""}
// // // //                   searchTerm={projectSearch}
// // // //                   setSearchTerm={setProjectSearch}
// // // //                   options={projectOptions}
// // // //                   displayKey="value"
// // // //                   secondaryKey="label"
// // // //                   onSelect={(option) => handleProjectSelect(option, activeRowId)}
// // // //                   onChange={(val) => {
// // // //                     handleInputChange("projId", val, activeRowId);
// // // //                     const found = projectOptions.find(
// // // //                       (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // // //                     );
// // // //                     handleInputChange("projectDescription", found ? found.label : "", activeRowId);
// // // //                   }}
// // // //                 />
// // // //                 <FormInput
// // // //                   label="Project Description"
// // // //                   value={selectedRow?.projectDescription || ""}
// // // //                   readOnly
// // // //                 />
// // // //               </div>
// // // //             </FormSection>

// // // //             <FormSection title="Waiver Document Information">
// // // //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// // // //                 <LienWaiverFormSearchSelect
// // // //                   label="Waiver Doc Cd"
// // // //                   value={selectedRow?.waiverTypeCd || ""}
// // // //                   searchTerm={documentSearch}
// // // //                   setSearchTerm={setDocumentSearch}
// // // //                   options={documentOptions}
// // // //                   displayKey="value"
// // // //                   secondaryKey="label"
// // // //                   onSelect={(option) =>
// // // //                     handleInputChange("waiverTypeCd", option.value, activeRowId)
// // // //                   }
// // // //                   onChange={(val) =>
// // // //                     handleInputChange("waiverTypeCd", val, activeRowId)
// // // //                   }
// // // //                 />
// // // //               </div>
// // // //             </FormSection>

// // // //           </div>
// // // //         ) : (
// // // //           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
// // // //             <table className="min-w-full text-sm">
// // // //               <thead className="bg-gray-200 sticky top-0 z-10">
// // // //                 <tr>
// // // //                   <th className="th-thead w-10"></th>
// // // //                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
// // // //                   <th className="th-thead">Project Description</th>
// // // //                   <th className="th-thead">Waiver Doc Cd</th>
// // // //                 </tr>
// // // //               </thead>
// // // //               <tbody className="tbody">
// // // //                 {records.map((item, index) => {
// // // //                   const rowId = getRowId(item);
// // // //                   return (
// // // //                     <tr
// // // //                       key={rowId}
// // // //                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
// // // //                     >
// // // //                       <td className="tbody-td text-center">
// // // //                         <input
// // // //                           type="checkbox"
// // // //                           className="h-3 w-3 accent-blue-600"
// // // //                           checked={selectedRows.has(rowId)}
// // // //                           onChange={() => toggleSelection(item, index)}
// // // //                         />
// // // //                       </td>
// // // //                       <td className="tbody-td">
// // // //                         <LienWaiverTableSearchSelect
// // // //                           options={projectOptions}
// // // //                           value={item.projId || ""}
// // // //                           displayKey="value"
// // // //                           secondaryKey="label"
// // // //                           onSelect={(option) => handleProjectSelect(option, rowId)}
// // // //                           onChange={(val) => {
// // // //                             handleInputChange("projId", val, rowId);
// // // //                             const found = projectOptions.find(
// // // //                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // // //                             );
// // // //                             handleInputChange("projectDescription", found ? found.label : "", rowId);
// // // //                           }}
// // // //                         />
// // // //                       </td>
// // // //                       <td className="tbody-td">
// // // //                         <input
// // // //                           className="td-input bg-gray-100 min-w-[220px]"
// // // //                           value={item.projectDescription || ""}
// // // //                           readOnly
// // // //                         />
// // // //                       </td>
// // // //                       <td className="tbody-td">
// // // //                         <LienWaiverTableSearchSelect
// // // //                           options={documentOptions}
// // // //                           value={item.waiverTypeCd || ""}
// // // //                           displayKey="value"
// // // //                           secondaryKey="label"
// // // //                           onSelect={(option) =>
// // // //                             handleInputChange(
// // // //                               "waiverTypeCd",
// // // //                               option.value,
// // // //                               rowId,
// // // //                             )
// // // //                           }
// // // //                           onChange={(val) =>
// // // //                             handleInputChange(
// // // //                               "waiverTypeCd",
// // // //                               val,
// // // //                               rowId,
// // // //                             )
// // // //                           }
// // // //                         />
// // // //                       </td>
// // // //                     </tr>
// // // //                   );
// // // //                 })}
// // // //               </tbody>
// // // //             </table>
// // // //           </div>
// // // //         )}
// // // //       </MainContainer>

// // // //       <SecondaryContainer
// // // //         title="Manage Project Waiver Information Detail"
// // // //         className="mt-3"
// // // //       >
// // // //         <Toolbar
// // // //           isFormView={false}
// // // //           totalRecords={detailRow ? 1 : 0}
// // // //           selectedRow={detailRow}
// // // //           loading={loading}
// // // //           actions={{
// // // //             onAdd: handleAddDetail,
// // // //             onCopy: handleCopyDetail,
// // // //             onDelete: handleDeleteDetail,
// // // //           }}
// // // //           clipboard={detailClipboard ? [detailClipboard] : []}
// // // //           buttonsDisable={["paste", "discard", "save", "tableform"]}
// // // //         />
// // // //         <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
// // // //           <table className="min-w-full text-sm">
// // // //             <thead className="bg-gray-200 sticky top-0 z-10">
// // // //               <tr>
// // // //                 <th className="th-thead w-10"></th>
// // // //                 <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
// // // //                 <th className="th-thead">Vendor Name</th>
// // // //                 <th className="th-thead">Print Final Waiver</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody className="tbody">
// // // //               {detailRow && (
// // // //                 <tr>
// // // //                   <td className="tbody-td text-center">
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       className="h-3 w-3 accent-blue-600"
// // // //                       checked={detailSelected}
// // // //                       onChange={(e) => setDetailSelected(e.target.checked)}
// // // //                     />
// // // //                   </td>
// // // //                   <td className="tbody-td">
// // // //                     <LienWaiverTableSearchSelect
// // // //                       options={vendorOptions}
// // // //                       value={detailRow.vendCustId || ""}
// // // //                       displayKey="value"
// // // //                       secondaryKey="label"
// // // //                       onSelect={(option) => handleVendorSelect(option)}
// // // //                       onChange={(val) => {
// // // //                         handleDetailInputChange("vendCustId", val);
// // // //                         const found = vendorOptions.find(
// // // //                           (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // // //                         );
// // // //                         handleDetailInputChange("vendorName", found ? found.label : "");
// // // //                       }}
// // // //                     />
// // // //                   </td>
// // // //                   <td className="tbody-td">
// // // //                     <input
// // // //                       className="td-input bg-gray-100 min-w-[220px]"
// // // //                       value={detailRow.vendorName || ""}
// // // //                       readOnly
// // // //                     />
// // // //                   </td>
// // // //                   <td className="tbody-td text-center">
// // // //                     <input
// // // //                       type="checkbox"
// // // //                       className="h-3 w-3 accent-blue-600"
// // // //                       checked={detailRow.finalWaiverFl === "Y"}
// // // //                       onChange={(e) =>
// // // //                         handleDetailInputChange(
// // // //                           "finalWaiverFl",
// // // //                           e.target.checked ? "Y" : "N",
// // // //                         )
// // // //                       }
// // // //                     />
// // // //                   </td>
// // // //                 </tr>
// // // //               )}
// // // //             </tbody>
// // // //           </table>
// // // //         </div>
// // // //       </SecondaryContainer>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default ManageLienWaiverInformation;

// // // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // // import { createPortal } from "react-dom";
// // // import { Search } from "lucide-react";
// // // import { toast } from "react-toastify";
// // // import { FormInput, FormSection } from "../helper/formSection";
// // // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // // import api from "../utils/api";
// // // import { backendUrl } from "./config";

// // // const LienWaiverFormSearchSelect = ({
// // //   label,
// // //   value,
// // //   searchTerm = "",
// // //   setSearchTerm,
// // //   options,
// // //   onSelect,
// // //   onChange,
// // //   displayKey,
// // //   secondaryKey,
// // //   disabled,
// // //   placeholder = "",
// // // }) => {
// // //   const [showDropdown, setShowDropdown] = useState(false);

// // //   const selectedOption = options?.find((opt) => {
// // //     const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey]];
// // //     return candidateKeys.some((key) => String(key) === String(value));
// // //   });

// // //   const filteredOptions = (options || []).filter((opt) => {
// // //     const search = searchTerm.toLowerCase().trim();

// // //     if (!search) return true;

// // //     const mainValue = String(opt[displayKey] || "").toLowerCase();
// // //     const subValue = secondaryKey
// // //       ? String(opt[secondaryKey] || "").toLowerCase()
// // //       : "";

// // //     return mainValue.includes(search) || subValue.includes(search);
// // //   });

// // //   const [isTyping, setIsTyping] = useState(false);

// // //   const inputValue = isTyping
// // //     ? searchTerm
// // //     : selectedOption
// // //       ? selectedOption[displayKey]
// // //       : searchTerm || value || "";

// // //   return (
// // //     <div className="space-x-4 flex items-center relative">
// // //       {label && (
// // //         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
// // //           {label}
// // //         </label>
// // //       )}

// // //       <div className="relative flex-1">
// // //         <div className="relative group flex items-center">
// // //           <input
// // //             type="text"
// // //             disabled={disabled}
// // //             className={`border outline-none w-full border-gray-300 pl-2 pr-8 py-0.5 rounded text-[10px] 
// // //               ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
// // //             value={inputValue}
// // //             placeholder={placeholder}
// // //             onChange={(e) => {
// // //               setIsTyping(true);
// // //               setSearchTerm(e.target.value);
// // //               setShowDropdown(true);
// // //               if (onChange) {
// // //                 onChange(e.target.value);
// // //               }
// // //             }}
// // //             onBlur={() => {
// // //               setIsTyping(false);
// // //             }}
// // //             onFocus={() => !disabled && setShowDropdown(true)}
// // //           />
// // //           <div
// // //             className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
// // //             onClick={() => !disabled && setShowDropdown(!showDropdown)}
// // //           >
// // //             <Search size={12} />
// // //           </div>
// // //         </div>

// // //         {showDropdown && !disabled && (
// // //           <>
// // //             <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
// // //               {filteredOptions.length > 0 ? (
// // //                 filteredOptions.map((opt, idx) => (
// // //                   <div
// // //                     key={idx}
// // //                     className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // //                     onClick={() => {
// // //                       onSelect(opt);
// // //                       setSearchTerm("");
// // //                       setShowDropdown(false);
// // //                     }}
// // //                   >
// // //                     <span className="font-[400] text-black">
// // //                       {opt[displayKey]}
// // //                     </span>
// // //                     {secondaryKey && opt[secondaryKey] && (
// // //                       <span className="text-gray-400 ml-2">
// // //                         ({opt[secondaryKey]})
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 ))
// // //               ) : (
// // //                 <div className="p-3 text-[10px] text-gray-400 italic text-center">
// // //                   No matches
// // //                 </div>
// // //               )}
// // //             </div>
// // //             <div
// // //               className="fixed inset-0 z-[90]"
// // //               onClick={() => setShowDropdown(false)}
// // //             />
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const LienWaiverTableSearchSelect = ({
// // //   id,
// // //   value,
// // //   options = [],
// // //   onSelect,
// // //   onChange,
// // //   displayKey,
// // //   secondaryKey,
// // //   disabled,
// // // }) => {
// // //   const [showDropdown, setShowDropdown] = useState(false);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [dropdownStyle, setDropdownStyle] = useState({});
// // //   const wrapperRef = React.useRef(null);

// // //   const filteredOptions = options.filter((opt) => {
// // //     const mainValue = String(opt[displayKey] || "").toLowerCase();
// // //     const subValue = secondaryKey
// // //       ? String(opt[secondaryKey] || "").toLowerCase()
// // //       : "";
// // //     const term = searchTerm.toLowerCase();

// // //     return mainValue.includes(term) || subValue.includes(term);
// // //   });

// // //   const updateDropdownPosition = () => {
// // //     if (!wrapperRef.current) return;
// // //     const rect = wrapperRef.current.getBoundingClientRect();
// // //     setDropdownStyle({
// // //       position: "fixed",
// // //       top: rect.bottom + window.scrollY,
// // //       left: rect.left + window.scrollX,
// // //       width: rect.width,
// // //       zIndex: 9999,
// // //     });
// // //   };

// // //   useEffect(() => {
// // //     if (showDropdown) updateDropdownPosition();
// // //   }, [showDropdown, searchTerm]);

// // //   useEffect(() => {
// // //     const handleScroll = () => {
// // //       if (showDropdown) updateDropdownPosition();
// // //     };
// // //     window.addEventListener("resize", handleScroll);
// // //     window.addEventListener("scroll", handleScroll, true);
// // //     return () => {
// // //       window.removeEventListener("resize", handleScroll);
// // //       window.removeEventListener("scroll", handleScroll, true);
// // //     };
// // //   }, [showDropdown]);

// // //   return (
// // //     <div className="relative w-full min-w-[150px]" ref={wrapperRef}>
// // //       <div className="relative flex items-center">
// // //         <input
// // //           type="text"
// // //           disabled={disabled}
// // //           className={`w-full border outline-none border-gray-200 pl-1 pr-6 py-0.5 rounded text-[10px] 
// // //             ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white focus:border-blue-300"}`}
// // //           value={
// // //             showDropdown
// // //               ? searchTerm
// // //               : value !== undefined && value !== null
// // //                 ? value
// // //                 : ""
// // //           }
// // //           onChange={(e) => {
// // //             setSearchTerm(e.target.value);
// // //             setShowDropdown(true);
// // //             if (onChange) {
// // //               onChange(e.target.value, id);
// // //             }
// // //           }}
// // //           onFocus={() => !disabled && setShowDropdown(true)}
// // //           autoComplete="off"
// // //         />
// // //         <div className="absolute right-0 px-1 cursor-pointer text-gray-400">
// // //           <Search size={10} />
// // //         </div>
// // //       </div>

// // //       {showDropdown &&
// // //         !disabled &&
// // //         createPortal(
// // //           <>
// // //             <div
// // //               style={dropdownStyle}
// // //               className="bg-white border border-gray-300 rounded shadow-2xl max-h-32 overflow-y-auto custom-scrollbar"
// // //             >
// // //               {filteredOptions.length > 0 ? (
// // //                 filteredOptions.map((opt, idx) => (
// // //                   <div
// // //                     key={idx}
// // //                     className="p-1 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// // //                     onClick={() => {
// // //                       onSelect(opt, id);
// // //                       setSearchTerm("");
// // //                       setShowDropdown(false);
// // //                     }}
// // //                   >
// // //                     <span className="font-semibold">{opt[displayKey]}</span>
// // //                     {secondaryKey && opt[secondaryKey] && (
// // //                       <span className="text-gray-400 ml-1">
// // //                         ({opt[secondaryKey]})
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 ))
// // //               ) : (
// // //                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
// // //                   No matches
// // //                 </div>
// // //               )}
// // //             </div>
// // //             <div
// // //               className="fixed inset-0 z-[9998]"
// // //               onClick={() => {
// // //                 setShowDropdown(false);
// // //                 setSearchTerm("");
// // //               }}
// // //             />
// // //           </>,
// // //           document.body,
// // //         )}
// // //     </div>
// // //   );
// // // };

// // // const ManageLienWaiverInformation = () => {
// // //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// // //   const companyId = user.companyId || "1";

// // //   const [records, setRecords] = useState([]);
// // //   const [originalRecords, setOriginalRecords] = useState([]);
// // //   const [selectedRows, setSelectedRows] = useState(new Set());
// // //   const [selectedRow, setSelectedRow] = useState(null);
// // //   const [detailRow, setDetailRow] = useState(null);
// // //   const [detailSelected, setDetailSelected] = useState(false);
// // //   const [isFormView, setIsFormView] = useState(true);
// // //   const [currentIndex, setCurrentIndex] = useState(0);
// // //   const [searchValue, setSearchValue] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const [detailClipboard, setDetailClipboard] = useState(null);

// // //   const [projects, setProjects] = useState([]);
// // //   const [vendors, setVendors] = useState([]);
// // //   const [documents, setDocuments] = useState([]);
// // //   const [projectSearch, setProjectSearch] = useState("");
// // //   const [vendorSearch, setVendorSearch] = useState("");
// // //   const [documentSearch, setDocumentSearch] = useState("");

// // //   const initialRecord = {
// // //     lienNo: 0,
// // //     projId: "",
// // //     projectDescription: "",
// // //     waiverTypeCd: "",
// // //     vendCustId: "",
// // //     vendorName: "",
// // //     finalWaiverFl: "N",
// // //     lienAmt: 1,
// // //     lienDate: new Date().toISOString(),
// // //     sentDt: new Date().toISOString(),
// // //     returnedDt: null,
// // //     addrDc: "",
// // //     chkNo: null,
// // //     companyId,
// // //     modifiedBy: user.name || "Admin",
// // //   };

// // //   const formatDateForInput = (dateVal) => {
// // //     if (!dateVal) return "";
// // //     try {
// // //       const d = new Date(dateVal);
// // //       if (isNaN(d.getTime())) return "";
// // //       return d.toISOString().substring(0, 10);
// // //     } catch (e) {
// // //       return "";
// // //     }
// // //   };

// // //   const renderRequiredLabel = (label) => (
// // //     <>
// // //       {label} <span className="text-red-600">*</span>
// // //     </>
// // //   );

// // //   const extractList = (payload) => {
// // //     if (Array.isArray(payload)) return payload;
// // //     if (Array.isArray(payload?.data)) return payload.data;
// // //     if (Array.isArray(payload?.items)) return payload.items;
// // //     if (Array.isArray(payload?.result)) return payload.result;
// // //     if (Array.isArray(payload?.records)) return payload.records;
// // //     return [];
// // //   };

// // //   const normalizeOptions = (items, valueKeys, labelKeys) =>
// // //     (Array.isArray(items) ? items : []).map((item) => {
// // //       const value =
// // //         valueKeys
// // //           .map((key) => item?.[key])
// // //           .find((val) => val !== undefined && val !== null) || "";
// // //       const label =
// // //         labelKeys
// // //           .map((key) => item?.[key])
// // //           .find((val) => val !== undefined && val !== null) || "";
// // //       return { ...item, value: String(value || ""), label: String(label || "") };
// // //     });

// // //   const projectOptions = useMemo(
// // //     () =>
// // //       normalizeOptions(
// // //         projects,
// // //         ["projId", "projectId", "projID", "projectID", "id", "code"],
// // //         [
// // //           "projName",
// // //           "projectName",
// // //           "projectDesc",
// // //           "projDescription",
// // //           "description",
// // //           "name",
// // //         ],
// // //       ),
// // //     [projects],
// // //   );

// // //   const vendorOptions = useMemo(
// // //     () =>
// // //       normalizeOptions(
// // //         vendors,
// // //         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
// // //         ["vendName", "vendorName", "vendorLongName", "name"],
// // //       ),
// // //     [vendors],
// // //   );

// // //   const documentOptions = useMemo(
// // //     () =>
// // //       normalizeOptions(
// // //         documents,
// // //         ["documentCode", "waiverTypeCd", "code", "value"],
// // //         ["documentDescription", "documentName", "description", "label"],
// // //       ),
// // //     [documents],
// // //   );

// // //   const enrichRecord = useCallback((record) => {
// // //     const vendor = vendorOptions.find(
// // //       (item) => String(item.value) === String(record.vendCustId),
// // //     );
// // //     const project = projectOptions.find(
// // //       (item) => String(item.value) === String(record.projId),
// // //     );
// // //     return {
// // //       ...record,
// // //       vendorName: record.vendorName || vendor?.label || "",
// // //       projectDescription: record.projectDescription || project?.label || "",
// // //     };
// // //   }, [projectOptions, vendorOptions]);

// // //   const getRowId = (row) => row.tempId || row.lienNo;

// // //   const getNextLienNo = () => {
// // //     const usedNumbers = records
// // //       .map((row) => Number(row.lienNo))
// // //       .filter((value) => Number.isFinite(value) && value > 0);
// // //     return (usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1;
// // //   };

// // //   const fetchRecords = useCallback(async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await api.get(
// // //         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
// // //       );
// // //       const data = (Array.isArray(response.data) ? response.data : []).map(
// // //         enrichRecord,
// // //       );
// // //       setRecords(data);
// // //       setOriginalRecords(data);
// // //       if (data.length > 0) {
// // //         setSelectedRow(data[0]);
// // //         setSelectedRows(new Set([getRowId(data[0])]));
// // //         setCurrentIndex(0);
// // //       } else {
// // //         setSelectedRow(null);
// // //         setSelectedRows(new Set());
// // //         setCurrentIndex(0);
// // //       }
// // //       setDetailRow(null);
// // //       setDetailSelected(false);
// // //     } catch (error) {
// // //       console.error("Fetch lien waiver information error:", error);
// // //       toast.error(
// // //         error.response?.data?.message || "Failed to fetch lien waiver information.",
// // //       );
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }, [companyId, enrichRecord]);

// // //   const fetchLookups = useCallback(async () => {
// // //     try {
// // //       const [projectRes, vendorRes, documentRes] = await Promise.all([
// // //         api.get(`${backendUrl}/Project/GetAllProjects`),
// // //         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
// // //         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
// // //       ]);
// // //       setProjects(extractList(projectRes.data));
// // //       setVendors(extractList(vendorRes.data));
// // //       setDocuments(extractList(documentRes.data));
// // //     } catch (error) {
// // //       console.error("Fetch lien waiver lookup error:", error);
// // //       toast.error("Failed to fetch project/vendor/document lookup data.");
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     fetchLookups();
// // //   }, [fetchLookups]);

// // //   useEffect(() => {
// // //     fetchRecords();
// // //   }, [fetchRecords]);

// // //   const handleInputChange = (field, value, rowId) => {
// // //     setRecords((prev) =>
// // //       prev.map((item) =>
// // //         String(getRowId(item)) === String(rowId)
// // //           ? { ...item, [field]: value, isDirty: true }
// // //           : item,
// // //       ),
// // //     );
// // //     setSelectedRow((prev) =>
// // //       prev && String(getRowId(prev)) === String(rowId)
// // //         ? { ...prev, [field]: value, isDirty: true }
// // //         : prev,
// // //     );
// // //   };

// // //   const handleVendorSelect = (option) => {
// // //     handleDetailInputChange("vendCustId", option.value);
// // //     handleDetailInputChange("vendorName", option.label);
// // //   };

// // //   const handleProjectSelect = (option, rowId) => {
// // //     handleInputChange("projId", option.value, rowId);
// // //     handleInputChange("projectDescription", option.label, rowId);
// // //   };

// // //   const handleDetailInputChange = (field, value) => {
// // //     if (!detailRow) return;
// // //     setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// // //     if (selectedRow) {
// // //       handleInputChange(field, value, activeRowId);
// // //     }
// // //   };

// // //   const clearDetailFields = () => {
// // //     if (!detailRow) {
// // //       toast.warn("Please select a waiver record first.");
// // //       return;
// // //     }
// // //     handleDetailInputChange("vendCustId", "");
// // //     handleDetailInputChange("vendorName", "");
// // //     handleDetailInputChange("finalWaiverFl", "N");
// // //   };

// // //   const handleAddDetail = () => {
// // //     if (!selectedRow) {
// // //       toast.warn("Please select a waiver record first.");
// // //       return;
// // //     }

// // //     const blankDetail = {
// // //       ...selectedRow,
// // //       vendCustId: "",
// // //       vendorName: "",
// // //       finalWaiverFl: "N",
// // //       isDirty: true,
// // //     };
// // //     setDetailRow(blankDetail);
// // //     setDetailSelected(true);
// // //   };

// // //   const handleCopyDetail = () => {
// // //     if (!detailRow?.vendCustId) {
// // //       toast.warn("No vendor detail selected to copy.");
// // //       return;
// // //     }
// // //     setDetailClipboard({
// // //       vendCustId: detailRow.vendCustId,
// // //       vendorName: detailRow.vendorName || "",
// // //       finalWaiverFl: detailRow.finalWaiverFl || "N",
// // //     });
// // //     toast.success("Vendor detail copied.");
// // //   };

// // //   const handleDeleteDetail = () => {
// // //     clearDetailFields();
// // //   };

// // //   const handleAdd = () => {
// // //     const newRow = {
// // //       ...initialRecord,
// // //       lienNo: getNextLienNo(),
// // //       tempId: `TEMP_${Date.now()}`,
// // //       isNew: true,
// // //       isDirty: true,
// // //     };
// // //     setRecords([newRow, ...records]);
// // //     setSelectedRow(newRow);
// // //     setSelectedRows(new Set([newRow.tempId]));
// // //     setDetailRow(newRow);
// // //     setDetailSelected(true);
// // //     setCurrentIndex(0);
// // //   };

// // //   const validateRows = (rows) => {
// // //     const requiredFields = ["projId", "vendCustId"];
// // //     for (const row of rows) {
// // //       const missing = requiredFields.find(
// // //         (field) => !row[field] || String(row[field]).trim() === "",
// // //       );
// // //       if (missing) {
// // //         toast.error(
// // //           `Row ${records.indexOf(row) + 1}: ${missing === "projId" ? "Project" : "Vendor"} is required.`,
// // //         );
// // //         return false;
// // //       }
// // //     }
// // //     return true;
// // //   };

// // //   const buildPayload = (row) => {
// // //     const payload = { ...row };
// // //     delete payload.tempId;
// // //     delete payload.isNew;
// // //     delete payload.isDirty;
// // //     delete payload.vendorName;
// // //     delete payload.projectDescription;

// // //     if (payload.returnedDt === null || payload.returnedDt === undefined) {
// // //       delete payload.returnedDt;
// // //     }
// // //     if (payload.chkNo === null || payload.chkNo === undefined) {
// // //       delete payload.chkNo;
// // //     }

// // //     return {
// // //       ...payload,
// // //       lienNo: Number(row.lienNo || getNextLienNo()),
// // //       lienAmt: Number(row.lienAmt || 1),
// // //       companyId,
// // //       modifiedBy: user.name || row.modifiedBy || "Admin",
// // //       finalWaiverFl: row.finalWaiverFl || "N",
// // //       lienDate: row.lienDate || new Date().toISOString(),
// // //       sentDt: row.sentDt || new Date().toISOString(),
// // //     };
// // //   };

// // //   const handleSaveAll = async () => {
// // //     const changedRows = records.filter((row) => row.isNew || row.isDirty);
// // //     if (changedRows.length === 0) {
// // //       toast.info("No changes to save.");
// // //       return;
// // //     }
// // //     if (!validateRows(changedRows)) return;

// // //     setLoading(true);
// // //     try {
// // //       await Promise.all(
// // //         changedRows.map((row) =>
// // //           row.isNew
// // //             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
// // //             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
// // //         ),
// // //       );
// // //       toast.success("Lien waiver information saved.");
// // //       setDetailRow(null);
// // //       setDetailSelected(false);
// // //       fetchRecords();
// // //     } catch (error) {
// // //       console.error("Save lien waiver information error:", error);
// // //       toast.error(error.response?.data?.message || "Failed to save changes.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleDelete = async () => {
// // //     if (selectedRows.size === 0) {
// // //       toast.warn("Please select at least one waiver record to delete.");
// // //       return;
// // //     }
// // //     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       for (const id of Array.from(selectedRows)) {
// // //         if (String(id).startsWith("TEMP_")) {
// // //           setRecords((prev) => prev.filter((item) => item.tempId !== id));
// // //         } else {
// // //           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
// // //         }
// // //       }
// // //       toast.success("Selected waiver record(s) deleted.");
// // //       setSelectedRows(new Set());
// // //       setSelectedRow(null);
// // //       setDetailRow(null);
// // //       setDetailSelected(false);
// // //       fetchRecords();
// // //     } catch (error) {
// // //       console.error("Delete lien waiver information error:", error);
// // //       toast.error(error.response?.data?.message || "Failed to delete record.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleDiscard = () => {
// // //     setRecords([...originalRecords]);
// // //     setSelectedRows(new Set());
// // //     setSelectedRow(null);
// // //     setDetailRow(null);
// // //     setDetailSelected(false);
// // //     toast.info("Changes discarded.");
// // //   };

// // //   const handleNavigate = (direction) => {
// // //     if (records.length === 0) return;
// // //     let nextIndex = currentIndex;
// // //     if (direction === "start") nextIndex = 0;
// // //     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
// // //     if (direction === "next")
// // //       nextIndex = Math.min(records.length - 1, currentIndex + 1);
// // //     if (direction === "end") nextIndex = records.length - 1;

// // //     const nextRecord = records[nextIndex];
// // //     setCurrentIndex(nextIndex);
// // //     setSelectedRow(nextRecord);
// // //     setSelectedRows(new Set([getRowId(nextRecord)]));
    
// // //     const rowId = getRowId(nextRecord);
// // //     if (!String(rowId).startsWith("TEMP_")) {
// // //       fetchDetailForRow(nextRecord);
// // //     } else {
// // //       setDetailRow(nextRecord);
// // //       setDetailSelected(true);
// // //     }
// // //   };

// // //   const jumpToCode = (code) => {
// // //     const foundIndex = records.findIndex(
// // //       (item) =>
// // //         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
// // //         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
// // //         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
// // //     );
// // //     if (foundIndex === -1) {
// // //       toast.error(`Lien waiver record "${code}" not found.`);
// // //       return;
// // //     }
// // //     const found = records[foundIndex];
// // //     setCurrentIndex(foundIndex);
// // //     setSelectedRow(found);
// // //     setSelectedRows(new Set([getRowId(found)]));
    
// // //     const rowId = getRowId(found);
// // //     if (!String(rowId).startsWith("TEMP_")) {
// // //       fetchDetailForRow(found);
// // //     } else {
// // //       setDetailRow(found);
// // //       setDetailSelected(true);
// // //     }
// // //   };

// // //   const fetchDetailForRow = async (item) => {
// // //     if (!item?.lienNo || String(item.lienNo) === "0") {
// // //       setDetailRow(null);
// // //       setDetailSelected(false);
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
// // //       const detail = enrichRecord(response.data || item);
// // //       setDetailRow(detail);
// // //       setDetailSelected(true);
// // //     } catch (error) {
// // //       console.error("Fetch lien waiver detail error:", error);
// // //       setDetailRow(null);
// // //       setDetailSelected(false);
// // //       toast.error(error.response?.data?.message || "Failed to fetch waiver detail.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const toggleSelection = (item, index) => {
// // //     const rowId = getRowId(item);
// // //     const next = new Set(selectedRows);
// // //     if (next.has(rowId)) {
// // //       next.delete(rowId);
// // //       setSelectedRow(null);
// // //       setDetailRow(null);
// // //       setDetailSelected(false);
// // //     } else {
// // //       next.clear();
// // //       next.add(rowId);
// // //       setSelectedRow(item);
// // //       setCurrentIndex(index);
// // //       if (!String(rowId).startsWith("TEMP_")) {
// // //         fetchDetailForRow(item);
// // //       } else {
// // //         setDetailRow(item);
// // //         setDetailSelected(true);
// // //       }
// // //     }
// // //     setSelectedRows(next);
// // //   };

// // //   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

// // //   return (
// // //     <div className="mt-14 ml-4">
// // //       <MainContainer title="Manage Lien Waiver Information">
// // //         <Toolbar
// // //           isFormView={isFormView}
// // //           totalRecords={records.length}
// // //           selectedRow={selectedRow}
// // //           currentIndex={currentIndex}
// // //           handleNavigate={handleNavigate}
// // //           jumpToCode={jumpToCode}
// // //           searchValue={searchValue}
// // //           setSearchValue={setSearchValue}
// // //           loading={loading}
// // //           actions={{
// // //             onAdd: handleAdd,
// // //             onSave: handleSaveAll,
// // //             onDelete: handleDelete,
// // //             onClear: handleDiscard,
// // //             onToggleView: () => setIsFormView(!isFormView),
// // //           }}
// // //           buttonsDisable={["copy", "paste"]}
// // //         />

// // //         {isFormView ? (
// // //           <div className="p-2 space-y-3">
// // //             <FormSection title="Identification">
// // //               <div className="grid grid-cols-1 gap-2">
                
// // //                 {/* Project Row */}
// // //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// // //                   <LienWaiverFormSearchSelect
// // //                     label={renderRequiredLabel("Project")}
// // //                     value={selectedRow?.projId || ""}
// // //                     searchTerm={projectSearch}
// // //                     setSearchTerm={setProjectSearch}
// // //                     options={projectOptions}
// // //                     displayKey="value"
// // //                     secondaryKey="label"
// // //                     onSelect={(option) => handleProjectSelect(option, activeRowId)}
// // //                     onChange={(val) => {
// // //                       handleInputChange("projId", val, activeRowId);
// // //                       const found = projectOptions.find(
// // //                         (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // //                       );
// // //                       handleInputChange("projectDescription", found ? found.label : "", activeRowId);
// // //                     }}
// // //                   />
// // //                   <div className="flex items-center m-1">
// // //                     <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-[#f3e8ff] px-2 py-1 rounded flex-1 min-h-[20px]">
// // //                       {selectedRow?.projectDescription || ""}
// // //                     </span>
// // //                   </div>
// // //                 </div>

// // //                 {/* Vendor Row */}
// // //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// // //                   <LienWaiverFormSearchSelect
// // //                     label={renderRequiredLabel("Vendor")}
// // //                     value={selectedRow?.vendCustId || ""}
// // //                     searchTerm={vendorSearch}
// // //                     setSearchTerm={setVendorSearch}
// // //                     options={vendorOptions}
// // //                     displayKey="value"
// // //                     secondaryKey="label"
// // //                     onSelect={(option) => {
// // //                       handleInputChange("vendCustId", option.value, activeRowId);
// // //                       handleInputChange("vendorName", option.label, activeRowId);
// // //                     }}
// // //                     onChange={(val) => {
// // //                       handleInputChange("vendCustId", val, activeRowId);
// // //                       const found = vendorOptions.find(
// // //                         (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // //                       );
// // //                       handleInputChange("vendorName", found ? found.label : "", activeRowId);
// // //                     }}
// // //                   />
// // //                   <div className="flex items-center m-1">
// // //                     <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-[#f3e8ff] px-2 py-1 rounded flex-1 min-h-[20px]">
// // //                       {selectedRow?.vendorName || ""}
// // //                     </span>
// // //                   </div>
// // //                 </div>

// // //               </div>
// // //             </FormSection>
// // //           </div>
// // //         ) : (
// // //           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
// // //             <table className="min-w-full text-sm">
// // //               <thead className="bg-gray-200 sticky top-0 z-10">
// // //                 <tr>
// // //                   <th className="th-thead w-10"></th>
// // //                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
// // //                   <th className="th-thead">Project Description</th>
// // //                   <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
// // //                   <th className="th-thead">Vendor Name</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="tbody">
// // //                 {records.map((item, index) => {
// // //                   const rowId = getRowId(item);
// // //                   return (
// // //                     <tr
// // //                       key={rowId}
// // //                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
// // //                     >
// // //                       <td className="tbody-td text-center">
// // //                         <input
// // //                           type="checkbox"
// // //                           className="h-3 w-3 accent-blue-600"
// // //                           checked={selectedRows.has(rowId)}
// // //                           onChange={() => toggleSelection(item, index)}
// // //                         />
// // //                       </td>
// // //                       <td className="tbody-td">
// // //                         <LienWaiverTableSearchSelect
// // //                           options={projectOptions}
// // //                           value={item.projId || ""}
// // //                           displayKey="value"
// // //                           secondaryKey="label"
// // //                           onSelect={(option) => handleProjectSelect(option, rowId)}
// // //                           onChange={(val) => {
// // //                             handleInputChange("projId", val, rowId);
// // //                             const found = projectOptions.find(
// // //                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // //                             );
// // //                             handleInputChange("projectDescription", found ? found.label : "", rowId);
// // //                           }}
// // //                         />
// // //                       </td>
// // //                       <td className="tbody-td">
// // //                         <input
// // //                           className="td-input bg-gray-100 min-w-[220px]"
// // //                           value={item.projectDescription || ""}
// // //                           readOnly
// // //                         />
// // //                       </td>
// // //                       <td className="tbody-td">
// // //                         <LienWaiverTableSearchSelect
// // //                           options={vendorOptions}
// // //                           value={item.vendCustId || ""}
// // //                           displayKey="value"
// // //                           secondaryKey="label"
// // //                           onSelect={(option) => {
// // //                             handleInputChange("vendCustId", option.value, rowId);
// // //                             handleInputChange("vendorName", option.label, rowId);
// // //                           }}
// // //                           onChange={(val) => {
// // //                             handleInputChange("vendCustId", val, rowId);
// // //                             const found = vendorOptions.find(
// // //                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// // //                             );
// // //                             handleInputChange("vendorName", found ? found.label : "", rowId);
// // //                           }}
// // //                         />
// // //                       </td>
// // //                       <td className="tbody-td">
// // //                         <input
// // //                           className="td-input bg-gray-100 min-w-[220px]"
// // //                           value={item.vendorName || ""}
// // //                           readOnly
// // //                         />
// // //                       </td>
// // //                     </tr>
// // //                   );
// // //                 })}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}
// // //       </MainContainer>

// // //       <SecondaryContainer
// // //         title="Lien Waiver Information"
// // //         className="mt-3"
// // //       >
// // //         <Toolbar
// // //           isFormView={true}
// // //           totalRecords={detailRow ? 1 : 0}
// // //           selectedRow={detailRow}
// // //           loading={loading}
// // //           actions={{
// // //             onAdd: handleAddDetail,
// // //             onCopy: handleCopyDetail,
// // //             onDelete: handleDeleteDetail,
// // //           }}
// // //           clipboard={detailClipboard ? [detailClipboard] : []}
// // //           buttonsDisable={["paste", "discard", "save", "tableform"]}
// // //         />
// // //         <div className="p-3 bg-white border border-gray-200 rounded-sm">
// // //           {detailRow ? (
// // //             <div className="space-y-4">
// // //               <FormSection title="Lien Waiver Details">
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
// // //                   <FormInput
// // //                     label="Lien Number"
// // //                     type="number"
// // //                     value={detailRow.lienNo || ""}
// // //                     onChange={(e) => handleDetailInputChange("lienNo", e.target.value)}
// // //                   />
// // //                   <FormInput
// // //                     label="Lien Amount"
// // //                     type="number"
// // //                     value={detailRow.lienAmt || ""}
// // //                     onChange={(e) => handleDetailInputChange("lienAmt", e.target.value)}
// // //                   />
// // //                   <FormInput
// // //                     label="Date Sent"
// // //                     type="date"
// // //                     value={formatDateForInput(detailRow.sentDt)}
// // //                     onChange={(e) => handleDetailInputChange("sentDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
// // //                   />
// // //                   <FormInput
// // //                     label="Date Returned"
// // //                     type="date"
// // //                     value={formatDateForInput(detailRow.returnedDt)}
// // //                     onChange={(e) => handleDetailInputChange("returnedDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
// // //                   />
// // //                 </div>
// // //               </FormSection>

// // //               <FormSection title="Associated Information">
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
// // //                   <div className="space-y-2">
// // //                     <label className="text-[10px] text-gray-500 font-semibold block">Vendor</label>
// // //                     <div className="flex gap-2 items-center">
// // //                       <input
// // //                         className="border outline-none p-1 rounded font-light text-[10px] bg-gray-100 text-gray-500 cursor-not-allowed w-28"
// // //                         value={detailRow.vendCustId || ""}
// // //                         readOnly
// // //                       />
// // //                       <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-[#f3e8ff] px-2 py-1 rounded flex-1 min-h-[20px] flex items-center">
// // //                         {detailRow.vendorName || ""}
// // //                       </span>
// // //                     </div>
// // //                   </div>

// // //                   <div className="space-y-2">
// // //                     <label className="text-[10px] text-gray-500 font-semibold block">Project</label>
// // //                     <div className="flex gap-2 items-center">
// // //                       <input
// // //                         className="border outline-none p-1 rounded font-light text-[10px] bg-gray-100 text-gray-500 cursor-not-allowed w-28"
// // //                         value={detailRow.projId || ""}
// // //                         readOnly
// // //                       />
// // //                       <span className="text-[10px] text-gray-500 font-light border border-gray-100 bg-[#f3e8ff] px-2 py-1 rounded flex-1 min-h-[20px] flex items-center">
// // //                         {detailRow.projectDescription || ""}
// // //                       </span>
// // //                     </div>
// // //                   </div>

// // //                   <div className="flex items-center gap-2 mt-4 md:col-span-2 pl-1">
// // //                     <input
// // //                       type="checkbox"
// // //                       id="finalWaiverFl"
// // //                       className="h-3.5 w-3.5 accent-[#17414d] cursor-pointer"
// // //                       checked={detailRow.finalWaiverFl === "Y"}
// // //                       onChange={(e) =>
// // //                         handleDetailInputChange(
// // //                           "finalWaiverFl",
// // //                           e.target.checked ? "Y" : "N",
// // //                         )
// // //                       }
// // //                     />
// // //                     <label htmlFor="finalWaiverFl" className="text-[10px] text-black cursor-pointer font-medium select-none">
// // //                       Print Final Waiver
// // //                     </label>
// // //                   </div>
// // //                 </div>
// // //               </FormSection>
// // //             </div>
// // //           ) : (
// // //             <div className="p-8 text-center text-gray-400 text-[10px] italic">
// // //               Please select a lien waiver record from the main container to view and edit details.
// // //             </div>
// // //           )}
// // //         </div>
// // //       </SecondaryContainer>
// // //     </div>
// // //   );
// // // };

// // // export default ManageLienWaiverInformation;

// // import React, { useCallback, useEffect, useMemo, useState } from "react";
// // import { createPortal } from "react-dom";
// // import { Search } from "lucide-react";
// // import { toast } from "react-toastify";
// // import { FormInput, FormSection } from "../helper/formSection";
// // import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// // import api from "../utils/api";
// // import { backendUrl } from "./config";

// // const LienWaiverFormSearchSelect = ({
// //   label,
// //   value,
// //   searchTerm = "",
// //   setSearchTerm,
// //   options,
// //   onSelect,
// //   onChange,
// //   displayKey,
// //   secondaryKey,
// //   disabled,
// //   placeholder = "",
// // }) => {
// //   const [showDropdown, setShowDropdown] = useState(false);

// //   const selectedOption = options?.find((opt) => {
// //     const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey]];
// //     return candidateKeys.some((key) => String(key) === String(value));
// //   });

// //   const filteredOptions = (options || []).filter((opt) => {
// //     const search = searchTerm.toLowerCase().trim();

// //     if (!search) return true;

// //     const mainValue = String(opt[displayKey] || "").toLowerCase();
// //     const subValue = secondaryKey
// //       ? String(opt[secondaryKey] || "").toLowerCase()
// //       : "";

// //     return mainValue.includes(search) || subValue.includes(search);
// //   });

// //   const [isTyping, setIsTyping] = useState(false);

// //   const inputValue = isTyping
// //     ? searchTerm
// //     : selectedOption
// //       ? selectedOption[displayKey]
// //       : searchTerm || value || "";

// //   return (
// //     <div className="space-x-4 flex items-center relative">
// //       {label && (
// //         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
// //           {label}
// //         </label>
// //       )}

// //       <div className="relative flex-1">
// //         <div className="relative group flex items-center">
// //           <input
// //             type="text"
// //             disabled={disabled}
// //             className={`border outline-none w-full border-gray-300 pl-2 pr-8 py-0.5 rounded text-[10px] 
// //               ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
// //             value={inputValue}
// //             placeholder={placeholder}
// //             onChange={(e) => {
// //               setIsTyping(true);
// //               setSearchTerm(e.target.value);
// //               setShowDropdown(true);
// //               if (onChange) {
// //                 onChange(e.target.value);
// //               }
// //             }}
// //             onBlur={() => {
// //               setIsTyping(false);
// //             }}
// //             onFocus={() => !disabled && setShowDropdown(true)}
// //           />
// //           <div
// //             className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
// //             onClick={() => !disabled && setShowDropdown(!showDropdown)}
// //           >
// //             <Search size={12} />
// //           </div>
// //         </div>

// //         {showDropdown && !disabled && (
// //           <>
// //             <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
// //               {filteredOptions.length > 0 ? (
// //                 filteredOptions.map((opt, idx) => (
// //                   <div
// //                     key={idx}
// //                     className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// //                     onClick={() => {
// //                       onSelect(opt);
// //                       setSearchTerm("");
// //                       setShowDropdown(false);
// //                     }}
// //                   >
// //                     <span className="font-[400] text-black">
// //                       {opt[displayKey]}
// //                     </span>
// //                     {secondaryKey && opt[secondaryKey] && (
// //                       <span className="text-gray-400 ml-2">
// //                         ({opt[secondaryKey]})
// //                       </span>
// //                     )}
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="p-3 text-[10px] text-gray-400 italic text-center">
// //                   No matches
// //                 </div>
// //               )}
// //             </div>
// //             <div
// //               className="fixed inset-0 z-[90]"
// //               onClick={() => setShowDropdown(false)}
// //             />
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // const LienWaiverTableSearchSelect = ({
// //   id,
// //   value,
// //   options = [],
// //   onSelect,
// //   onChange,
// //   displayKey,
// //   secondaryKey,
// //   disabled,
// // }) => {
// //   const [showDropdown, setShowDropdown] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [dropdownStyle, setDropdownStyle] = useState({});
// //   const wrapperRef = React.useRef(null);

// //   const filteredOptions = options.filter((opt) => {
// //     const mainValue = String(opt[displayKey] || "").toLowerCase();
// //     const subValue = secondaryKey
// //       ? String(opt[secondaryKey] || "").toLowerCase()
// //       : "";
// //     const term = searchTerm.toLowerCase();

// //     return mainValue.includes(term) || subValue.includes(term);
// //   });

// //   const updateDropdownPosition = () => {
// //     if (!wrapperRef.current) return;
// //     const rect = wrapperRef.current.getBoundingClientRect();
// //     setDropdownStyle({
// //       position: "fixed",
// //       top: rect.bottom + window.scrollY,
// //       left: rect.left + window.scrollX,
// //       width: rect.width,
// //       zIndex: 9999,
// //     });
// //   };

// //   useEffect(() => {
// //     if (showDropdown) updateDropdownPosition();
// //   }, [showDropdown, searchTerm]);

// //   useEffect(() => {
// //     const handleScroll = () => {
// //       if (showDropdown) updateDropdownPosition();
// //     };
// //     window.addEventListener("resize", handleScroll);
// //     window.addEventListener("scroll", handleScroll, true);
// //     return () => {
// //       window.removeEventListener("resize", handleScroll);
// //       window.removeEventListener("scroll", handleScroll, true);
// //     };
// //   }, [showDropdown]);

// //   return (
// //     <div className="relative w-full min-w-[150px]" ref={wrapperRef}>
// //       <div className="relative flex items-center">
// //         <input
// //           type="text"
// //           disabled={disabled}
// //           className={`w-full border outline-none border-gray-200 pl-1 pr-6 py-0.5 rounded text-[10px] 
// //             ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white focus:border-blue-300"}`}
// //           value={
// //             showDropdown
// //               ? searchTerm
// //               : value !== undefined && value !== null
// //                 ? value
// //                 : ""
// //           }
// //           onChange={(e) => {
// //             setSearchTerm(e.target.value);
// //             setShowDropdown(true);
// //             if (onChange) {
// //               onChange(e.target.value, id);
// //             }
// //           }}
// //           onFocus={() => !disabled && setShowDropdown(true)}
// //           autoComplete="off"
// //         />
// //         <div className="absolute right-0 px-1 cursor-pointer text-gray-400">
// //           <Search size={10} />
// //         </div>
// //       </div>

// //       {showDropdown &&
// //         !disabled &&
// //         createPortal(
// //           <>
// //             <div
// //               style={dropdownStyle}
// //               className="bg-white border border-gray-300 rounded shadow-2xl max-h-32 overflow-y-auto custom-scrollbar"
// //             >
// //               {filteredOptions.length > 0 ? (
// //                 filteredOptions.map((opt, idx) => (
// //                   <div
// //                     key={idx}
// //                     className="p-1 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
// //                     onClick={() => {
// //                       onSelect(opt, id);
// //                       setSearchTerm("");
// //                       setShowDropdown(false);
// //                     }}
// //                   >
// //                     <span className="font-semibold">{opt[displayKey]}</span>
// //                     {secondaryKey && opt[secondaryKey] && (
// //                       <span className="text-gray-400 ml-1">
// //                         ({opt[secondaryKey]})
// //                       </span>
// //                     )}
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
// //                   No matches
// //                 </div>
// //               )}
// //             </div>
// //             <div
// //               className="fixed inset-0 z-[9998]"
// //               onClick={() => {
// //                 setShowDropdown(false);
// //                 setSearchTerm("");
// //               }}
// //             />
// //           </>,
// //           document.body,
// //         )}
// //     </div>
// //   );
// // };

// // const ManageLienWaiverInformation = () => {
// //   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
// //   const companyId = user.companyId || "1";

// //   const [records, setRecords] = useState([]);
// //   const [originalRecords, setOriginalRecords] = useState([]);
// //   const [selectedRows, setSelectedRows] = useState(new Set());
// //   const [selectedRow, setSelectedRow] = useState(null);
// //   const [detailRow, setDetailRow] = useState(null);
// //   const [detailSelected, setDetailSelected] = useState(false);
// //   const [isFormView, setIsFormView] = useState(true);
// //   const [isDetailFormView, setIsDetailFormView] = useState(false);
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [searchValue, setSearchValue] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [detailClipboard, setDetailClipboard] = useState(null);

// //   const [projects, setProjects] = useState([]);
// //   const [vendors, setVendors] = useState([]);
// //   const [documents, setDocuments] = useState([]);
// //   const [projectSearch, setProjectSearch] = useState("");
// //   const [vendorSearch, setVendorSearch] = useState("");
// //   const [documentSearch, setDocumentSearch] = useState("");

// //   const initialRecord = {
// //     lienNo: 0,
// //     projId: "",
// //     projectDescription: "",
// //     waiverTypeCd: "",
// //     vendCustId: "",
// //     vendorName: "",
// //     finalWaiverFl: "N",
// //     lienAmt: 1,
// //     lienDate: new Date().toISOString(),
// //     sentDt: new Date().toISOString(),
// //     returnedDt: null,
// //     addrDc: "",
// //     chkNo: null,
// //     companyId,
// //     modifiedBy: user.name || "Admin",
// //   };

// //   const formatDateForInput = (dateVal) => {
// //     if (!dateVal) return "";
// //     try {
// //       const d = new Date(dateVal);
// //       if (isNaN(d.getTime())) return "";
// //       return d.toISOString().substring(0, 10);
// //     } catch (e) {
// //       return "";
// //     }
// //   };

// //   const renderRequiredLabel = (label) => (
// //     <>
// //       {label} <span className="text-red-600">*</span>
// //     </>
// //   );

// //   const extractList = (payload) => {
// //     if (Array.isArray(payload)) return payload;
// //     if (Array.isArray(payload?.data)) return payload.data;
// //     if (Array.isArray(payload?.items)) return payload.items;
// //     if (Array.isArray(payload?.result)) return payload.result;
// //     if (Array.isArray(payload?.records)) return payload.records;
// //     return [];
// //   };

// //   const normalizeOptions = (items, valueKeys, labelKeys) =>
// //     (Array.isArray(items) ? items : []).map((item) => {
// //       const value =
// //         valueKeys
// //           .map((key) => item?.[key])
// //           .find((val) => val !== undefined && val !== null) || "";
// //       const label =
// //         labelKeys
// //           .map((key) => item?.[key])
// //           .find((val) => val !== undefined && val !== null) || "";
// //       return { ...item, value: String(value || ""), label: String(label || "") };
// //     });

// //   const projectOptions = useMemo(
// //     () =>
// //       normalizeOptions(
// //         projects,
// //         ["projId", "projectId", "projID", "projectID", "id", "code"],
// //         [
// //           "projName",
// //           "projectName",
// //           "projectDesc",
// //           "projDescription",
// //           "description",
// //           "name",
// //         ],
// //       ),
// //     [projects],
// //   );

// //   const vendorOptions = useMemo(
// //     () =>
// //       normalizeOptions(
// //         vendors,
// //         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
// //         ["vendName", "vendorName", "vendorLongName", "name"],
// //       ),
// //     [vendors],
// //   );

// //   const documentOptions = useMemo(
// //     () =>
// //       normalizeOptions(
// //         documents,
// //         ["documentCode", "waiverTypeCd", "code", "value"],
// //         ["documentDescription", "documentName", "description", "label"],
// //       ),
// //     [documents],
// //   );

// //   const enrichRecord = useCallback((record) => {
// //     const vendor = vendorOptions.find(
// //       (item) => String(item.value) === String(record.vendCustId),
// //     );
// //     const project = projectOptions.find(
// //       (item) => String(item.value) === String(record.projId),
// //     );
// //     return {
// //       ...record,
// //       vendorName: record.vendorName || vendor?.label || "",
// //       projectDescription: record.projectDescription || project?.label || "",
// //     };
// //   }, [projectOptions, vendorOptions]);

// //   const getRowId = (row) => row.tempId || row.lienNo;

// //   const getNextLienNo = () => {
// //     const usedNumbers = records
// //       .map((row) => Number(row.lienNo))
// //       .filter((value) => Number.isFinite(value) && value > 0);
// //     return (usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1;
// //   };

// //   const fetchRecords = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       const response = await api.get(
// //         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
// //       );
// //       const data = (Array.isArray(response.data) ? response.data : []).map(
// //         enrichRecord,
// //       );
// //       setRecords(data);
// //       setOriginalRecords(data);
// //       if (data.length > 0) {
// //         setSelectedRow(data[0]);
// //         setSelectedRows(new Set([getRowId(data[0])]));
// //         setCurrentIndex(0);
// //       } else {
// //         setSelectedRow(null);
// //         setSelectedRows(new Set());
// //         setCurrentIndex(0);
// //       }
// //       setDetailRow(null);
// //       setDetailSelected(false);
// //     } catch (error) {
// //       console.error("Fetch lien waiver information error:", error);
// //       toast.error(
// //         error.response?.data?.message || "Failed to fetch lien waiver information.",
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [companyId, enrichRecord]);

// //   const fetchLookups = useCallback(async () => {
// //     try {
// //       const [projectRes, vendorRes, documentRes] = await Promise.all([
// //         api.get(`${backendUrl}/Project/GetAllProjects`),
// //         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
// //         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
// //       ]);
// //       setProjects(extractList(projectRes.data));
// //       setVendors(extractList(vendorRes.data));
// //       setDocuments(extractList(documentRes.data));
// //     } catch (error) {
// //       console.error("Fetch lien waiver lookup error:", error);
// //       toast.error("Failed to fetch project/vendor/document lookup data.");
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchLookups();
// //   }, [fetchLookups]);

// //   useEffect(() => {
// //     fetchRecords();
// //   }, [fetchRecords]);

// //   const handleInputChange = (field, value, rowId) => {
// //     setRecords((prev) =>
// //       prev.map((item) =>
// //         String(getRowId(item)) === String(rowId)
// //           ? { ...item, [field]: value, isDirty: true }
// //           : item,
// //       ),
// //     );
// //     setSelectedRow((prev) =>
// //       prev && String(getRowId(prev)) === String(rowId)
// //         ? { ...prev, [field]: value, isDirty: true }
// //         : prev,
// //     );
// //   };

// //   const handleVendorSelect = (option) => {
// //     handleDetailInputChange("vendCustId", option.value);
// //     handleDetailInputChange("vendorName", option.label);
// //   };

// //   const handleProjectSelect = (option, rowId) => {
// //     handleInputChange("projId", option.value, rowId);
// //     handleInputChange("projectDescription", option.label, rowId);
// //   };

// //   const handleDetailInputChange = (field, value) => {
// //     if (!detailRow) return;
// //     setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
// //     if (selectedRow) {
// //       handleInputChange(field, value, activeRowId);
// //     }
// //   };

// //   const clearDetailFields = () => {
// //     if (!detailRow) {
// //       toast.warn("Please select a waiver record first.");
// //       return;
// //     }
// //     handleDetailInputChange("vendCustId", "");
// //     handleDetailInputChange("vendorName", "");
// //     handleDetailInputChange("finalWaiverFl", "N");
// //   };

// //   const handleAddDetail = () => {
// //     if (!selectedRow) {
// //       toast.warn("Please select a waiver record first.");
// //       return;
// //     }

// //     const blankDetail = {
// //       ...selectedRow,
// //       vendCustId: "",
// //       vendorName: "",
// //       finalWaiverFl: "N",
// //       isDirty: true,
// //     };
// //     setDetailRow(blankDetail);
// //     setDetailSelected(true);
// //   };

// //   const handleCopyDetail = () => {
// //     if (!detailRow?.vendCustId) {
// //       toast.warn("No vendor detail selected to copy.");
// //       return;
// //     }
// //     setDetailClipboard({
// //       vendCustId: detailRow.vendCustId,
// //       vendorName: detailRow.vendorName || "",
// //       finalWaiverFl: detailRow.finalWaiverFl || "N",
// //     });
// //     toast.success("Vendor detail copied.");
// //   };

// //   const handleDeleteDetail = () => {
// //     clearDetailFields();
// //   };

// //   const handleAdd = () => {
// //     const defaultWaiverCd = documentOptions.length > 0 ? documentOptions[0].value : "";
// //     const newRow = {
// //       ...initialRecord,
// //       lienNo: getNextLienNo(),
// //       tempId: `TEMP_${Date.now()}`,
// //       waiverTypeCd: defaultWaiverCd,
// //       isNew: true,
// //       isDirty: true,
// //     };
// //     setRecords([newRow, ...records]);
// //     setSelectedRow(newRow);
// //     setSelectedRows(new Set([newRow.tempId]));
// //     setDetailRow(newRow);
// //     setDetailSelected(true);
// //     setCurrentIndex(0);
// //   };

// //   const validateRows = (rows) => {
// //     const requiredFields = ["projId", "vendCustId"];
// //     for (const row of rows) {
// //       const missing = requiredFields.find(
// //         (field) => !row[field] || String(row[field]).trim() === "",
// //       );
// //       if (missing) {
// //         toast.error(
// //           `Row ${records.indexOf(row) + 1}: ${missing === "projId" ? "Project" : "Vendor"} is required.`,
// //         );
// //         return false;
// //       }
// //     }
// //     return true;
// //   };

// //   const buildPayload = (row) => {
// //     const payload = { ...row };
// //     delete payload.tempId;
// //     delete payload.isNew;
// //     delete payload.isDirty;
// //     delete payload.vendorName;
// //     delete payload.projectDescription;

// //     if (payload.returnedDt === null || payload.returnedDt === undefined) {
// //       delete payload.returnedDt;
// //     }
// //     if (payload.chkNo === null || payload.chkNo === undefined) {
// //       delete payload.chkNo;
// //     }

// //     const defaultWaiverCd = documentOptions.length > 0 ? documentOptions[0].value : "STANDARD";
// //     const waiverTypeCd = row.waiverTypeCd || defaultWaiverCd;

// //     return {
// //       ...payload,
// //       lienNo: Number(row.lienNo || getNextLienNo()),
// //       lienAmt: Number(row.lienAmt || 1),
// //       companyId,
// //       modifiedBy: user.name || row.modifiedBy || "Admin",
// //       finalWaiverFl: row.finalWaiverFl || "N",
// //       lienDate: row.lienDate || new Date().toISOString(),
// //       sentDt: row.sentDt || new Date().toISOString(),
// //       waiverTypeCd,
// //     };
// //   };

// //   const handleSaveAll = async () => {
// //     const changedRows = records.filter((row) => row.isNew || row.isDirty);
// //     if (changedRows.length === 0) {
// //       toast.info("No changes to save.");
// //       return;
// //     }
// //     if (!validateRows(changedRows)) return;

// //     setLoading(true);
// //     try {
// //       await Promise.all(
// //         changedRows.map((row) =>
// //           row.isNew
// //             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
// //             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
// //         ),
// //       );
// //       toast.success("Lien waiver information saved.");
// //       setDetailRow(null);
// //       setDetailSelected(false);
// //       fetchRecords();
// //     } catch (error) {
// //       console.error("Save lien waiver information error:", error);
// //       toast.error(error.response?.data?.message || "Failed to save changes.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     if (selectedRows.size === 0) {
// //       toast.warn("Please select at least one waiver record to delete.");
// //       return;
// //     }
// //     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       for (const id of Array.from(selectedRows)) {
// //         if (String(id).startsWith("TEMP_")) {
// //           setRecords((prev) => prev.filter((item) => item.tempId !== id));
// //         } else {
// //           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
// //         }
// //       }
// //       toast.success("Selected waiver record(s) deleted.");
// //       setSelectedRows(new Set());
// //       setSelectedRow(null);
// //       setDetailRow(null);
// //       setDetailSelected(false);
// //       fetchRecords();
// //     } catch (error) {
// //       console.error("Delete lien waiver information error:", error);
// //       toast.error(error.response?.data?.message || "Failed to delete record.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDiscard = () => {
// //     setRecords([...originalRecords]);
// //     setSelectedRows(new Set());
// //     setSelectedRow(null);
// //     setDetailRow(null);
// //     setDetailSelected(false);
// //     toast.info("Changes discarded.");
// //   };

// //   const handleNavigate = (direction) => {
// //     if (records.length === 0) return;
// //     let nextIndex = currentIndex;
// //     if (direction === "start") nextIndex = 0;
// //     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
// //     if (direction === "next")
// //       nextIndex = Math.min(records.length - 1, currentIndex + 1);
// //     if (direction === "end") nextIndex = records.length - 1;

// //     const nextRecord = records[nextIndex];
// //     setCurrentIndex(nextIndex);
// //     setSelectedRow(nextRecord);
// //     setSelectedRows(new Set([getRowId(nextRecord)]));
    
// //     const rowId = getRowId(nextRecord);
// //     if (!String(rowId).startsWith("TEMP_")) {
// //       fetchDetailForRow(nextRecord);
// //     } else {
// //       setDetailRow(nextRecord);
// //       setDetailSelected(true);
// //     }
// //   };

// //   const jumpToCode = (code) => {
// //     const foundIndex = records.findIndex(
// //       (item) =>
// //         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
// //         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
// //         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
// //     );
// //     if (foundIndex === -1) {
// //       toast.error(`Lien waiver record "${code}" not found.`);
// //       return;
// //     }
// //     const found = records[foundIndex];
// //     setCurrentIndex(foundIndex);
// //     setSelectedRow(found);
// //     setSelectedRows(new Set([getRowId(found)]));
    
// //     const rowId = getRowId(found);
// //     if (!String(rowId).startsWith("TEMP_")) {
// //       fetchDetailForRow(found);
// //     } else {
// //       setDetailRow(found);
// //       setDetailSelected(true);
// //     }
// //   };

// //   const fetchDetailForRow = async (item) => {
// //     if (!item?.lienNo || String(item.lienNo) === "0") {
// //       setDetailRow(null);
// //       setDetailSelected(false);
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
// //       const detail = enrichRecord(response.data || item);
// //       setDetailRow(detail);
// //       setDetailSelected(true);
// //     } catch (error) {
// //       console.error("Fetch lien waiver detail error:", error);
// //       setDetailRow(null);
// //       setDetailSelected(false);
// //       toast.error(error.response?.data?.message || "Failed to fetch waiver detail.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const toggleSelection = (item, index) => {
// //     const rowId = getRowId(item);
// //     const next = new Set(selectedRows);
// //     if (next.has(rowId)) {
// //       next.delete(rowId);
// //       setSelectedRow(null);
// //       setDetailRow(null);
// //       setDetailSelected(false);
// //     } else {
// //       next.clear();
// //       next.add(rowId);
// //       setSelectedRow(item);
// //       setCurrentIndex(index);
// //       if (!String(rowId).startsWith("TEMP_")) {
// //         fetchDetailForRow(item);
// //       } else {
// //         setDetailRow(item);
// //         setDetailSelected(true);
// //       }
// //     }
// //     setSelectedRows(next);
// //   };

// //   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

// //   return (
// //     <div className="mt-14 ml-4">
// //       <MainContainer title="Manage Lien Waiver Information">
// //         <Toolbar
// //           isFormView={isFormView}
// //           totalRecords={records.length}
// //           selectedRow={selectedRow}
// //           currentIndex={currentIndex}
// //           handleNavigate={handleNavigate}
// //           jumpToCode={jumpToCode}
// //           searchValue={searchValue}
// //           setSearchValue={setSearchValue}
// //           loading={loading}
// //           actions={{
// //             onAdd: handleAdd,
// //             onSave: handleSaveAll,
// //             onDelete: handleDelete,
// //             onClear: handleDiscard,
// //             onToggleView: () => setIsFormView(!isFormView),
// //           }}
// //           buttonsDisable={["copy", "paste"]}
// //         />

// //         {isFormView ? (
// //           <div className="p-2 space-y-3">
// //             <FormSection title="Identification">
// //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// //                 <LienWaiverFormSearchSelect
// //                   label={renderRequiredLabel("Project")}
// //                   value={selectedRow?.projId || ""}
// //                   searchTerm={projectSearch}
// //                   setSearchTerm={setProjectSearch}
// //                   options={projectOptions}
// //                   displayKey="value"
// //                   secondaryKey="label"
// //                   onSelect={(option) => handleProjectSelect(option, activeRowId)}
// //                   onChange={(val) => {
// //                     handleInputChange("projId", val, activeRowId);
// //                     const found = projectOptions.find(
// //                       (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// //                     );
// //                     handleInputChange("projectDescription", found ? found.label : "", activeRowId);
// //                   }}
// //                 />
// //                 <FormInput
// //                   label="Project Description"
// //                   value={selectedRow?.projectDescription || ""}
// //                   readOnly
// //                 />

// //                 <LienWaiverFormSearchSelect
// //                   label={renderRequiredLabel("Vendor")}
// //                   value={selectedRow?.vendCustId || ""}
// //                   searchTerm={vendorSearch}
// //                   setSearchTerm={setVendorSearch}
// //                   options={vendorOptions}
// //                   displayKey="value"
// //                   secondaryKey="label"
// //                   onSelect={(option) => {
// //                     handleInputChange("vendCustId", option.value, activeRowId);
// //                     handleInputChange("vendorName", option.label, activeRowId);
// //                   }}
// //                   onChange={(val) => {
// //                     handleInputChange("vendCustId", val, activeRowId);
// //                     const found = vendorOptions.find(
// //                       (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// //                     );
// //                     handleInputChange("vendorName", found ? found.label : "", activeRowId);
// //                   }}
// //                 />
// //                 <FormInput
// //                   label="Vendor Description"
// //                   value={selectedRow?.vendorName || ""}
// //                   readOnly
// //                 />
// //               </div>
// //             </FormSection>
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
// //             <table className="min-w-full text-sm">
// //               <thead className="bg-gray-200 sticky top-0 z-10">
// //                 <tr>
// //                   <th className="th-thead w-10"></th>
// //                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
// //                   <th className="th-thead">Project Description</th>
// //                   <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
// //                   <th className="th-thead">Vendor Name</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="tbody">
// //                 {records.map((item, index) => {
// //                   const rowId = getRowId(item);
// //                   return (
// //                     <tr
// //                       key={rowId}
// //                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
// //                     >
// //                       <td className="tbody-td text-center">
// //                         <input
// //                           type="checkbox"
// //                           className="h-3 w-3 accent-blue-600"
// //                           checked={selectedRows.has(rowId)}
// //                           onChange={() => toggleSelection(item, index)}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <LienWaiverTableSearchSelect
// //                           options={projectOptions}
// //                           value={item.projId || ""}
// //                           displayKey="value"
// //                           secondaryKey="label"
// //                           onSelect={(option) => handleProjectSelect(option, rowId)}
// //                           onChange={(val) => {
// //                             handleInputChange("projId", val, rowId);
// //                             const found = projectOptions.find(
// //                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// //                             );
// //                             handleInputChange("projectDescription", found ? found.label : "", rowId);
// //                           }}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <input
// //                           className="td-input bg-gray-100 min-w-[220px]"
// //                           value={item.projectDescription || ""}
// //                           readOnly
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <LienWaiverTableSearchSelect
// //                           options={vendorOptions}
// //                           value={item.vendCustId || ""}
// //                           displayKey="value"
// //                           secondaryKey="label"
// //                           onSelect={(option) => {
// //                             handleInputChange("vendCustId", option.value, rowId);
// //                             handleInputChange("vendorName", option.label, rowId);
// //                           }}
// //                           onChange={(val) => {
// //                             handleInputChange("vendCustId", val, rowId);
// //                             const found = vendorOptions.find(
// //                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// //                             );
// //                             handleInputChange("vendorName", found ? found.label : "", rowId);
// //                           }}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <input
// //                           className="td-input bg-gray-100 min-w-[220px]"
// //                           value={item.vendorName || ""}
// //                           readOnly
// //                         />
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </MainContainer>

// //       <SecondaryContainer
// //         title="Lien Waiver Information"
// //         className="mt-3"
// //       >
// //         <Toolbar
// //           isFormView={isDetailFormView}
// //           totalRecords={detailRow ? 1 : 0}
// //           selectedRow={detailRow}
// //           loading={loading}
// //           actions={{
// //             onAdd: handleAddDetail,
// //             onCopy: handleCopyDetail,
// //             onDelete: handleDeleteDetail,
// //             onToggleView: () => setIsDetailFormView(!isDetailFormView),
// //           }}
// //           clipboard={detailClipboard ? [detailClipboard] : []}
// //           buttonsDisable={["paste", "discard", "save"]}
// //         />
// //         <div className="p-3 bg-white border border-gray-200 rounded-sm">
// //           {isDetailFormView ? (
// //             detailRow ? (
// //               <div className="space-y-3 p-2 bg-[#e5f3fb]/40 rounded border border-[#17414d]/40 relative">
// //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// //                   <FormInput
// //                     label="Lien Number"
// //                     type="number"
// //                     value={detailRow.lienNo || ""}
// //                     onChange={(e) => handleDetailInputChange("lienNo", e.target.value)}
// //                   />
// //                   <FormInput
// //                     label="Lien Amount"
// //                     type="number"
// //                     value={detailRow.lienAmt || ""}
// //                     onChange={(e) => handleDetailInputChange("lienAmt", e.target.value)}
// //                   />
// //                   <FormInput
// //                     label="Date Sent"
// //                     type="date"
// //                     value={formatDateForInput(detailRow.sentDt)}
// //                     onChange={(e) => handleDetailInputChange("sentDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
// //                   />
// //                   <FormInput
// //                     label="Date Returned"
// //                     type="date"
// //                     value={formatDateForInput(detailRow.returnedDt)}
// //                     onChange={(e) => handleDetailInputChange("returnedDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
// //                   />
// //                   <LienWaiverFormSearchSelect
// //                     label="Vendor"
// //                     value={detailRow.vendCustId || ""}
// //                     searchTerm={vendorSearch}
// //                     setSearchTerm={setVendorSearch}
// //                     options={vendorOptions}
// //                     displayKey="value"
// //                     secondaryKey="label"
// //                     onSelect={(option) => {
// //                       handleDetailInputChange("vendCustId", option.value);
// //                       handleDetailInputChange("vendorName", option.label);
// //                     }}
// //                     onChange={(val) => {
// //                       handleDetailInputChange("vendCustId", val);
// //                       const found = vendorOptions.find(
// //                         (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// //                       );
// //                       handleDetailInputChange("vendorName", found ? found.label : "");
// //                     }}
// //                   />
// //                   <FormInput
// //                     label="Vendor Description"
// //                     value={detailRow.vendorName || ""}
// //                     readOnly
// //                   />
// //                   <LienWaiverFormSearchSelect
// //                     label="Project"
// //                     value={detailRow.projId || ""}
// //                     searchTerm={projectSearch}
// //                     setSearchTerm={setProjectSearch}
// //                     options={projectOptions}
// //                     displayKey="value"
// //                     secondaryKey="label"
// //                     onSelect={(option) => {
// //                       handleDetailInputChange("projId", option.value);
// //                       handleDetailInputChange("projectDescription", option.label);
// //                     }}
// //                     onChange={(val) => {
// //                       handleDetailInputChange("projId", val);
// //                       const found = projectOptions.find(
// //                         (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// //                       );
// //                       handleDetailInputChange("projectDescription", found ? found.label : "");
// //                     }}
// //                   />
// //                   <FormInput
// //                     label="Project Description"
// //                     value={detailRow.projectDescription || ""}
// //                     readOnly
// //                   />
// //                 </div>
// //               </div>
// //             ) : (
// //               <div className="space-y-3 p-2 bg-[#e5f3fb]/40 rounded border border-[#17414d]/40 relative opacity-60">
// //                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
// //                   <FormInput label="Lien Number" disabled />
// //                   <FormInput label="Lien Amount" disabled />
// //                   <FormInput label="Date Sent" type="date" disabled />
// //                   <FormInput label="Date Returned" type="date" disabled />
// //                   <FormInput label="Vendor" disabled />
// //                   <FormInput label="Vendor Description" disabled />
// //                   <FormInput label="Project" disabled />
// //                   <FormInput label="Project Description" disabled />
// //                 </div>
// //               </div>
// //             )
// //           ) : (
// //             <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
// //               <table className="min-w-full text-sm">
// //                 <thead className="bg-gray-200 sticky top-0 z-10">
// //                   <tr>
// //                     <th className="th-thead w-10"></th>
// //                     <th className="th-thead">Lien Number</th>
// //                     <th className="th-thead">Date Returned</th>
// //                     <th className="th-thead">Date Sent</th>
// //                     <th className="th-thead">Lien Amount</th>
// //                     <th className="th-thead">Vendor</th>
// //                     <th className="th-thead">Vendor Description</th>
// //                     <th className="th-thead">Project</th>
// //                     <th className="th-thead">Project Description</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="tbody">
// //                   {detailRow && (
// //                     <tr>
// //                       <td className="tbody-td text-center">
// //                         <input
// //                           type="checkbox"
// //                           className="h-3 w-3 accent-blue-600 cursor-pointer"
// //                           checked={detailSelected}
// //                           onChange={(e) => setDetailSelected(e.target.checked)}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <input
// //                           type="number"
// //                           className="td-input min-w-[100px]"
// //                           value={detailRow.lienNo || ""}
// //                           onChange={(e) => handleDetailInputChange("lienNo", e.target.value)}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <input
// //                           type="date"
// //                           className="td-input min-w-[130px]"
// //                           value={formatDateForInput(detailRow.returnedDt)}
// //                           onChange={(e) => handleDetailInputChange("returnedDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <input
// //                           type="date"
// //                           className="td-input min-w-[130px]"
// //                           value={formatDateForInput(detailRow.sentDt)}
// //                           onChange={(e) => handleDetailInputChange("sentDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <input
// //                           type="number"
// //                           className="td-input min-w-[100px]"
// //                           value={detailRow.lienAmt || ""}
// //                           onChange={(e) => handleDetailInputChange("lienAmt", e.target.value)}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <LienWaiverTableSearchSelect
// //                           options={vendorOptions}
// //                           value={detailRow.vendCustId || ""}
// //                           displayKey="value"
// //                           secondaryKey="label"
// //                           onSelect={(option) => {
// //                             handleDetailInputChange("vendCustId", option.value);
// //                             handleDetailInputChange("vendorName", option.label);
// //                           }}
// //                           onChange={(val) => {
// //                             handleDetailInputChange("vendCustId", val);
// //                             const found = vendorOptions.find(
// //                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// //                             );
// //                             handleDetailInputChange("vendorName", found ? found.label : "");
// //                           }}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <input
// //                           className="td-input bg-gray-100 min-w-[180px]"
// //                           value={detailRow.vendorName || ""}
// //                           readOnly
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <LienWaiverTableSearchSelect
// //                           options={projectOptions}
// //                           value={detailRow.projId || ""}
// //                           displayKey="value"
// //                           secondaryKey="label"
// //                           onSelect={(option) => {
// //                             handleDetailInputChange("projId", option.value);
// //                             handleDetailInputChange("projectDescription", option.label);
// //                           }}
// //                           onChange={(val) => {
// //                             handleDetailInputChange("projId", val);
// //                             const found = projectOptions.find(
// //                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
// //                             );
// //                             handleDetailInputChange("projectDescription", found ? found.label : "");
// //                           }}
// //                         />
// //                       </td>
// //                       <td className="tbody-td">
// //                         <input
// //                           className="td-input bg-gray-100 min-w-[180px]"
// //                           value={detailRow.projectDescription || ""}
// //                           readOnly
// //                         />
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           )}
// //         </div>
// //       </SecondaryContainer>
// //     </div>
// //   );
// // };

// // export default ManageLienWaiverInformation;

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { createPortal } from "react-dom";
// import { Search } from "lucide-react";
// import { toast } from "react-toastify";
// import { FormInput, FormSection } from "../helper/formSection";
// import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
// import api from "../utils/api";
// import { backendUrl } from "./config";

// const LienWaiverFormSearchSelect = ({
//   label,
//   value,
//   searchTerm = "",
//   setSearchTerm,
//   options,
//   onSelect,
//   onChange,
//   displayKey,
//   secondaryKey,
//   disabled,
//   placeholder = "",
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);

//   const selectedOption = options?.find((opt) => {
//     const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey]];
//     return candidateKeys.some((key) => String(key) === String(value));
//   });

//   const filteredOptions = (options || []).filter((opt) => {
//     const search = searchTerm.toLowerCase().trim();

//     if (!search) return true;

//     const mainValue = String(opt[displayKey] || "").toLowerCase();
//     const subValue = secondaryKey
//       ? String(opt[secondaryKey] || "").toLowerCase()
//       : "";

//     return mainValue.includes(search) || subValue.includes(search);
//   });

//   const [isTyping, setIsTyping] = useState(false);

//   const inputValue = isTyping
//     ? searchTerm
//     : selectedOption
//       ? selectedOption[displayKey]
//       : searchTerm || value || "";

//   return (
//     <div className="space-x-4 flex items-center relative">
//       {label && (
//         <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
//           {label}
//         </label>
//       )}

//       <div className="relative flex-1">
//         <div className="relative group flex items-center">
//           <input
//             type="text"
//             disabled={disabled}
//             className={`border outline-none w-full border-gray-300 pl-2 pr-8 py-0.5 rounded text-[10px] 
//               ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
//             value={inputValue}
//             placeholder={placeholder}
//             onChange={(e) => {
//               setIsTyping(true);
//               setSearchTerm(e.target.value);
//               setShowDropdown(true);
//               if (onChange) {
//                 onChange(e.target.value);
//               }
//             }}
//             onBlur={() => {
//               setIsTyping(false);
//             }}
//             onFocus={() => !disabled && setShowDropdown(true)}
//           />
//           <div
//             className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
//             onClick={() => !disabled && setShowDropdown(!showDropdown)}
//           >
//             <Search size={12} />
//           </div>
//         </div>

//         {showDropdown && !disabled && (
//           <>
//             <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((opt, idx) => (
//                   <div
//                     key={idx}
//                     className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
//                     onClick={() => {
//                       onSelect(opt);
//                       setSearchTerm("");
//                       setShowDropdown(false);
//                     }}
//                   >
//                     <span className="font-[400] text-black">
//                       {opt[displayKey]}
//                     </span>
//                     {secondaryKey && opt[secondaryKey] && (
//                       <span className="text-gray-400 ml-2">
//                         ({opt[secondaryKey]})
//                       </span>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-3 text-[10px] text-gray-400 italic text-center">
//                   No matches
//                 </div>
//               )}
//             </div>
//             <div
//               className="fixed inset-0 z-[90]"
//               onClick={() => setShowDropdown(false)}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// const LienWaiverTableSearchSelect = ({
//   id,
//   value,
//   options = [],
//   onSelect,
//   onChange,
//   displayKey,
//   secondaryKey,
//   disabled,
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [dropdownStyle, setDropdownStyle] = useState({});
//   const wrapperRef = React.useRef(null);

//   const filteredOptions = options.filter((opt) => {
//     const mainValue = String(opt[displayKey] || "").toLowerCase();
//     const subValue = secondaryKey
//       ? String(opt[secondaryKey] || "").toLowerCase()
//       : "";
//     const term = searchTerm.toLowerCase();

//     return mainValue.includes(term) || subValue.includes(term);
//   });

//   const updateDropdownPosition = () => {
//     if (!wrapperRef.current) return;
//     const rect = wrapperRef.current.getBoundingClientRect();
//     setDropdownStyle({
//       position: "fixed",
//       top: rect.bottom + window.scrollY,
//       left: rect.left + window.scrollX,
//       width: rect.width,
//       zIndex: 9999,
//     });
//   };

//   useEffect(() => {
//     if (showDropdown) updateDropdownPosition();
//   }, [showDropdown, searchTerm]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (showDropdown) updateDropdownPosition();
//     };
//     window.addEventListener("resize", handleScroll);
//     window.addEventListener("scroll", handleScroll, true);
//     return () => {
//       window.removeEventListener("resize", handleScroll);
//       window.removeEventListener("scroll", handleScroll, true);
//     };
//   }, [showDropdown]);

//   return (
//     <div className="relative w-full min-w-[150px]" ref={wrapperRef}>
//       <div className="relative flex items-center">
//         <input
//           type="text"
//           disabled={disabled}
//           className={`w-full border outline-none border-gray-200 pl-1 pr-6 py-0.5 rounded text-[10px] 
//             ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white focus:border-blue-300"}`}
//           value={
//             showDropdown
//               ? searchTerm
//               : value !== undefined && value !== null
//                 ? value
//                 : ""
//           }
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setShowDropdown(true);
//             if (onChange) {
//               onChange(e.target.value, id);
//             }
//           }}
//           onFocus={() => !disabled && setShowDropdown(true)}
//           autoComplete="off"
//         />
//         <div className="absolute right-0 px-1 cursor-pointer text-gray-400">
//           <Search size={10} />
//         </div>
//       </div>

//       {showDropdown &&
//         !disabled &&
//         createPortal(
//           <>
//             <div
//               style={dropdownStyle}
//               className="bg-white border border-gray-300 rounded shadow-2xl max-h-32 overflow-y-auto custom-scrollbar"
//             >
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((opt, idx) => (
//                   <div
//                     key={idx}
//                     className="p-1 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
//                     onClick={() => {
//                       onSelect(opt, id);
//                       setSearchTerm("");
//                       setShowDropdown(false);
//                     }}
//                   >
//                     <span className="font-semibold">{opt[displayKey]}</span>
//                     {secondaryKey && opt[secondaryKey] && (
//                       <span className="text-gray-400 ml-1">
//                         ({opt[secondaryKey]})
//                       </span>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-2 text-[10px] text-gray-400 italic text-center">
//                   No matches
//                 </div>
//               )}
//             </div>
//             <div
//               className="fixed inset-0 z-[9998]"
//               onClick={() => {
//                 setShowDropdown(false);
//                 setSearchTerm("");
//               }}
//             />
//           </>,
//           document.body,
//         )}
//     </div>
//   );
// };

// const ManageLienWaiverInformation = () => {
//   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
//   const companyId = user.companyId || "1";

//   const [records, setRecords] = useState([]);
//   const [originalRecords, setOriginalRecords] = useState([]);
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [detailRow, setDetailRow] = useState(null);
//   const [detailSelected, setDetailSelected] = useState(false);
//   const [isFormView, setIsFormView] = useState(true);
//   const [isDetailFormView, setIsDetailFormView] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [searchValue, setSearchValue] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [detailClipboard, setDetailClipboard] = useState(null);

//   const [projects, setProjects] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [projectSearch, setProjectSearch] = useState("");
//   const [vendorSearch, setVendorSearch] = useState("");
//   const [documentSearch, setDocumentSearch] = useState("");

//   const initialRecord = {
//     lienNo: 0,
//     projId: "",
//     projectDescription: "",
//     waiverTypeCd: "",
//     vendCustId: "",
//     vendorName: "",
//     finalWaiverFl: "N",
//     lienAmt: 1,
//     lienDate: new Date().toISOString(),
//     sentDt: new Date().toISOString(),
//     returnedDt: null,
//     addrDc: "",
//     chkNo: null,
//     companyId,
//     modifiedBy: user.name || "Admin",
//   };

//   const formatDateForInput = (dateVal) => {
//     if (!dateVal) return "";
//     try {
//       const d = new Date(dateVal);
//       if (isNaN(d.getTime())) return "";
//       return d.toISOString().substring(0, 10);
//     } catch (e) {
//       return "";
//     }
//   };

//   const getBackendErrorMessage = (error) => {
//     if (error.response?.data) {
//       if (typeof error.response.data === "string") {
//         return error.response.data;
//       }
//       if (typeof error.response.data === "object") {
//         return error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
//       }
//     }
//     return error.message || "An unexpected error occurred.";
//   };

//   const renderRequiredLabel = (label) => (
//     <>
//       {label} <span className="text-red-600">*</span>
//     </>
//   );

//   const extractList = (payload) => {
//     if (Array.isArray(payload)) return payload;
//     if (Array.isArray(payload?.data)) return payload.data;
//     if (Array.isArray(payload?.items)) return payload.items;
//     if (Array.isArray(payload?.result)) return payload.result;
//     if (Array.isArray(payload?.records)) return payload.records;
//     return [];
//   };

//   const normalizeOptions = (items, valueKeys, labelKeys) =>
//     (Array.isArray(items) ? items : []).map((item) => {
//       const value =
//         valueKeys
//           .map((key) => item?.[key])
//           .find((val) => val !== undefined && val !== null) || "";
//       const label =
//         labelKeys
//           .map((key) => item?.[key])
//           .find((val) => val !== undefined && val !== null) || "";
//       return { ...item, value: String(value || ""), label: String(label || "") };
//     });

//   const projectOptions = useMemo(
//     () =>
//       normalizeOptions(
//         projects,
//         ["projId", "projectId", "projID", "projectID", "id", "code"],
//         [
//           "projName",
//           "projectName",
//           "projectDesc",
//           "projDescription",
//           "description",
//           "name",
//         ],
//       ),
//     [projects],
//   );

//   const vendorOptions = useMemo(
//     () =>
//       normalizeOptions(
//         vendors,
//         ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
//         ["vendName", "vendorName", "vendorLongName", "name"],
//       ),
//     [vendors],
//   );

//   const documentOptions = useMemo(
//     () =>
//       normalizeOptions(
//         documents,
//         ["documentCode", "waiverTypeCd", "code", "value"],
//         ["documentDescription", "documentName", "description", "label"],
//       ),
//     [documents],
//   );

//   const enrichRecord = useCallback((record) => {
//     const vendor = vendorOptions.find(
//       (item) => String(item.value) === String(record.vendCustId),
//     );
//     const project = projectOptions.find(
//       (item) => String(item.value) === String(record.projId),
//     );
//     return {
//       ...record,
//       vendorName: record.vendorName || vendor?.label || "",
//       projectDescription: record.projectDescription || project?.label || "",
//     };
//   }, [projectOptions, vendorOptions]);

//   const getRowId = (row) => row.tempId || row.lienNo;

//   const getNextLienNo = () => {
//     const usedNumbers = records
//       .map((row) => Number(row.lienNo))
//       .filter((value) => Number.isFinite(value) && value > 0);
//     return (usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1;
//   };

//   const fetchRecords = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await api.get(
//         `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
//       );
//       const data = (Array.isArray(response.data) ? response.data : []).map(
//         enrichRecord,
//       );
//       setRecords(data);
//       setOriginalRecords(data);
//       if (data.length > 0) {
//         setSelectedRow(data[0]);
//         setSelectedRows(new Set([getRowId(data[0])]));
//         setCurrentIndex(0);
//       } else {
//         setSelectedRow(null);
//         setSelectedRows(new Set());
//         setCurrentIndex(0);
//       }
//       setDetailRow(null);
//       setDetailSelected(false);
//     } catch (error) {
//       console.error("Fetch lien waiver information error:", error);
//       toast.error(getBackendErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   }, [companyId, enrichRecord]);

//   const fetchLookups = useCallback(async () => {
//     try {
//       const [projectRes, vendorRes, documentRes] = await Promise.all([
//         api.get(`${backendUrl}/Project/GetAllProjects`),
//         api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
//         api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
//       ]);
//       setProjects(extractList(projectRes.data));
//       setVendors(extractList(vendorRes.data));
//       setDocuments(extractList(documentRes.data));
//     } catch (error) {
//       console.error("Fetch lien waiver lookup error:", error);
//       toast.error("Failed to fetch project/vendor/document lookup data.");
//     }
//   }, []);

//   useEffect(() => {
//     fetchLookups();
//   }, [fetchLookups]);

//   useEffect(() => {
//     fetchRecords();
//   }, [fetchRecords]);

//   const handleInputChange = (field, value, rowId) => {
//     setRecords((prev) =>
//       prev.map((item) =>
//         String(getRowId(item)) === String(rowId)
//           ? { ...item, [field]: value, isDirty: true }
//           : item,
//       ),
//     );
//     setSelectedRow((prev) =>
//       prev && String(getRowId(prev)) === String(rowId)
//         ? { ...prev, [field]: value, isDirty: true }
//         : prev,
//     );
//   };

//   const handleVendorSelect = (option) => {
//     handleDetailInputChange("vendCustId", option.value);
//     handleDetailInputChange("vendorName", option.label);
//   };

//   const handleProjectSelect = (option, rowId) => {
//     handleInputChange("projId", option.value, rowId);
//     handleInputChange("projectDescription", option.label, rowId);
//   };

//   const handleDetailInputChange = (field, value) => {
//     if (!detailRow) return;
//     setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
//     if (selectedRow) {
//       handleInputChange(field, value, activeRowId);
//     }
//   };

//   const clearDetailFields = () => {
//     if (!detailRow) {
//       toast.warn("Please select a waiver record first.");
//       return;
//     }
//     handleDetailInputChange("vendCustId", "");
//     handleDetailInputChange("vendorName", "");
//     handleDetailInputChange("finalWaiverFl", "N");
//   };

//   const handleAddDetail = () => {
//     if (!selectedRow) {
//       toast.warn("Please select a waiver record first.");
//       return;
//     }

//     const blankDetail = {
//       ...selectedRow,
//       vendCustId: "",
//       vendorName: "",
//       finalWaiverFl: "N",
//       isDirty: true,
//     };
//     setDetailRow(blankDetail);
//     setDetailSelected(true);
//   };

//   const handleCopyDetail = () => {
//     if (!detailRow?.vendCustId) {
//       toast.warn("No vendor detail selected to copy.");
//       return;
//     }
//     setDetailClipboard({
//       vendCustId: detailRow.vendCustId,
//       vendorName: detailRow.vendorName || "",
//       finalWaiverFl: detailRow.finalWaiverFl || "N",
//     });
//     toast.success("Vendor detail copied.");
//   };

//   const handleDeleteDetail = () => {
//     clearDetailFields();
//   };

//   const handleAdd = () => {
//     const defaultWaiverCd = documentOptions.length > 0 ? documentOptions[0].value : "";
//     const newRow = {
//       ...initialRecord,
//       lienNo: getNextLienNo(),
//       tempId: `TEMP_${Date.now()}`,
//       waiverTypeCd: defaultWaiverCd,
//       isNew: true,
//       isDirty: true,
//     };
//     setRecords([newRow, ...records]);
//     setSelectedRow(newRow);
//     setSelectedRows(new Set([newRow.tempId]));
//     setDetailRow(newRow);
//     setDetailSelected(true);
//     setCurrentIndex(0);
//   };

//   const validateRows = (rows) => {
//     const requiredFields = ["projId", "vendCustId"];
//     for (const row of rows) {
//       const missing = requiredFields.find(
//         (field) => !row[field] || String(row[field]).trim() === "",
//       );
//       if (missing) {
//         toast.error(
//           `Row ${records.indexOf(row) + 1}: ${missing === "projId" ? "Project" : "Vendor"} is required.`,
//         );
//         return false;
//       }
//     }
//     return true;
//   };

//   const buildPayload = (row) => {
//     const payload = { ...row };
//     delete payload.tempId;
//     delete payload.isNew;
//     delete payload.isDirty;
//     delete payload.vendorName;
//     delete payload.projectDescription;

//     if (payload.returnedDt === null || payload.returnedDt === undefined) {
//       delete payload.returnedDt;
//     }
//     if (payload.chkNo === null || payload.chkNo === undefined) {
//       delete payload.chkNo;
//     }

//     const defaultWaiverCd = documentOptions.length > 0 ? documentOptions[0].value : "STANDARD";
//     const waiverTypeCd = row.waiverTypeCd || defaultWaiverCd;

//     const sentDateVal = row.sentDt || new Date().toISOString();
//     // Dynamic Date Alignment: Lien Date matches Sent Date perfectly so that validation sentDt >= lienDate is always met!
//     const lienDateVal = sentDateVal;

//     return {
//       ...payload,
//       lienNo: Number(row.lienNo || getNextLienNo()),
//       lienAmt: Number(row.lienAmt || 1),
//       companyId,
//       modifiedBy: user.name || row.modifiedBy || "Admin",
//       finalWaiverFl: row.finalWaiverFl || "N",
//       sentDt: sentDateVal,
//       lienDate: lienDateVal,
//       waiverTypeCd,
//     };
//   };

//   const handleSaveAll = async () => {
//     const changedRows = records.filter((row) => row.isNew || row.isDirty);
//     if (changedRows.length === 0) {
//       toast.info("No changes to save.");
//       return;
//     }
//     if (!validateRows(changedRows)) return;

//     setLoading(true);
//     try {
//       await Promise.all(
//         changedRows.map((row) =>
//           row.isNew
//             ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
//             : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
//         ),
//       );
//       toast.success("Lien waiver information saved.");
//       setDetailRow(null);
//       setDetailSelected(false);
//       fetchRecords();
//     } catch (error) {
//       console.error("Save lien waiver information error:", error);
//       toast.error(getBackendErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (selectedRows.size === 0) {
//       toast.warn("Please select at least one waiver record to delete.");
//       return;
//     }
//     if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       for (const id of Array.from(selectedRows)) {
//         if (String(id).startsWith("TEMP_")) {
//           setRecords((prev) => prev.filter((item) => item.tempId !== id));
//         } else {
//           await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
//         }
//       }
//       toast.success("Selected waiver record(s) deleted.");
//       setSelectedRows(new Set());
//       setSelectedRow(null);
//       setDetailRow(null);
//       setDetailSelected(false);
//       fetchRecords();
//     } catch (error) {
//       console.error("Delete lien waiver information error:", error);
//       toast.error(getBackendErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDiscard = () => {
//     setRecords([...originalRecords]);
//     setSelectedRows(new Set());
//     setSelectedRow(null);
//     setDetailRow(null);
//     setDetailSelected(false);
//     toast.info("Changes discarded.");
//   };

//   const handleNavigate = (direction) => {
//     if (records.length === 0) return;
//     let nextIndex = currentIndex;
//     if (direction === "start") nextIndex = 0;
//     if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
//     if (direction === "next")
//       nextIndex = Math.min(records.length - 1, currentIndex + 1);
//     if (direction === "end") nextIndex = records.length - 1;

//     const nextRecord = records[nextIndex];
//     setCurrentIndex(nextIndex);
//     setSelectedRow(nextRecord);
//     setSelectedRows(new Set([getRowId(nextRecord)]));
    
//     const rowId = getRowId(nextRecord);
//     if (!String(rowId).startsWith("TEMP_")) {
//       fetchDetailForRow(nextRecord);
//     } else {
//       setDetailRow(nextRecord);
//       setDetailSelected(true);
//     }
//   };

//   const jumpToCode = (code) => {
//     const foundIndex = records.findIndex(
//       (item) =>
//         String(item.projId).toLowerCase() === String(code).toLowerCase() ||
//         String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
//         String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
//     );
//     if (foundIndex === -1) {
//       toast.error(`Lien waiver record "${code}" not found.`);
//       return;
//     }
//     const found = records[foundIndex];
//     setCurrentIndex(foundIndex);
//     setSelectedRow(found);
//     setSelectedRows(new Set([getRowId(found)]));
    
//     const rowId = getRowId(found);
//     if (!String(rowId).startsWith("TEMP_")) {
//       fetchDetailForRow(found);
//     } else {
//       setDetailRow(found);
//       setDetailSelected(true);
//     }
//   };

//   const fetchDetailForRow = async (item) => {
//     if (!item?.lienNo || String(item.lienNo) === "0") {
//       setDetailRow(null);
//       setDetailSelected(false);
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
//       const detail = enrichRecord(response.data || item);
//       setDetailRow(detail);
//       setDetailSelected(true);
//     } catch (error) {
//       console.error("Fetch lien waiver detail error:", error);
//       setDetailRow(null);
//       setDetailSelected(false);
//       toast.error(getBackendErrorMessage(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSelection = (item, index) => {
//     const rowId = getRowId(item);
//     const next = new Set(selectedRows);
//     if (next.has(rowId)) {
//       next.delete(rowId);
//       setSelectedRow(null);
//       setDetailRow(null);
//       setDetailSelected(false);
//     } else {
//       next.clear();
//       next.add(rowId);
//       setSelectedRow(item);
//       setCurrentIndex(index);
//       if (!String(rowId).startsWith("TEMP_")) {
//         fetchDetailForRow(item);
//       } else {
//         setDetailRow(item);
//         setDetailSelected(true);
//       }
//     }
//     setSelectedRows(next);
//   };

//   const activeRowId = selectedRow ? getRowId(selectedRow) : "";

//   return (
//     <div className="mt-14 ml-4">
//       <MainContainer title="Manage Lien Waiver Information">
//         <Toolbar
//           isFormView={isFormView}
//           totalRecords={records.length}
//           selectedRow={selectedRow}
//           currentIndex={currentIndex}
//           handleNavigate={handleNavigate}
//           jumpToCode={jumpToCode}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           loading={loading}
//           actions={{
//             onAdd: handleAdd,
//             onSave: handleSaveAll,
//             onDelete: handleDelete,
//             onClear: handleDiscard,
//             onToggleView: () => setIsFormView(!isFormView),
//           }}
//           buttonsDisable={["copy", "paste"]}
//         />

//         {isFormView ? (
//           <div className="p-2 space-y-3">
//             <FormSection title="Identification">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
//                 <LienWaiverFormSearchSelect
//                   label={renderRequiredLabel("Project")}
//                   value={selectedRow?.projId || ""}
//                   searchTerm={projectSearch}
//                   setSearchTerm={setProjectSearch}
//                   options={projectOptions}
//                   displayKey="value"
//                   secondaryKey="label"
//                   onSelect={(option) => handleProjectSelect(option, activeRowId)}
//                   onChange={(val) => {
//                     handleInputChange("projId", val, activeRowId);
//                     const found = projectOptions.find(
//                       (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
//                     );
//                     handleInputChange("projectDescription", found ? found.label : "", activeRowId);
//                   }}
//                 />
//                 <FormInput
//                   label="Project Description"
//                   value={selectedRow?.projectDescription || ""}
//                   readOnly
//                 />

//                 <LienWaiverFormSearchSelect
//                   label={renderRequiredLabel("Vendor")}
//                   value={selectedRow?.vendCustId || ""}
//                   searchTerm={vendorSearch}
//                   setSearchTerm={setVendorSearch}
//                   options={vendorOptions}
//                   displayKey="value"
//                   secondaryKey="label"
//                   onSelect={(option) => {
//                     handleInputChange("vendCustId", option.value, activeRowId);
//                     handleInputChange("vendorName", option.label, activeRowId);
//                   }}
//                   onChange={(val) => {
//                     handleInputChange("vendCustId", val, activeRowId);
//                     const found = vendorOptions.find(
//                       (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
//                     );
//                     handleInputChange("vendorName", found ? found.label : "", activeRowId);
//                   }}
//                 />
//                 <FormInput
//                   label="Vendor Description"
//                   value={selectedRow?.vendorName || ""}
//                   readOnly
//                 />
//               </div>
//             </FormSection>
//           </div>
//         ) : (
//           <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
//             <table className="min-w-full text-sm">
//               <thead className="bg-gray-200 sticky top-0 z-10">
//                 <tr>
//                   <th className="th-thead w-10"></th>
//                   <th className="th-thead">{renderRequiredLabel("Project")}</th>
//                   <th className="th-thead">Project Description</th>
//                   <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
//                   <th className="th-thead">Vendor Name</th>
//                 </tr>
//               </thead>
//               <tbody className="tbody">
//                 {records.map((item, index) => {
//                   const rowId = getRowId(item);
//                   return (
//                     <tr
//                       key={rowId}
//                       className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
//                     >
//                       <td className="tbody-td text-center">
//                         <input
//                           type="checkbox"
//                           className="h-3 w-3 accent-blue-600"
//                           checked={selectedRows.has(rowId)}
//                           onChange={() => toggleSelection(item, index)}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <LienWaiverTableSearchSelect
//                           options={projectOptions}
//                           value={item.projId || ""}
//                           displayKey="value"
//                           secondaryKey="label"
//                           onSelect={(option) => handleProjectSelect(option, rowId)}
//                           onChange={(val) => {
//                             handleInputChange("projId", val, rowId);
//                             const found = projectOptions.find(
//                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
//                             );
//                             handleInputChange("projectDescription", found ? found.label : "", rowId);
//                           }}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <input
//                           className="td-input bg-gray-100 min-w-[220px]"
//                           value={item.projectDescription || ""}
//                           readOnly
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <LienWaiverTableSearchSelect
//                           options={vendorOptions}
//                           value={item.vendCustId || ""}
//                           displayKey="value"
//                           secondaryKey="label"
//                           onSelect={(option) => {
//                             handleInputChange("vendCustId", option.value, rowId);
//                             handleInputChange("vendorName", option.label, rowId);
//                           }}
//                           onChange={(val) => {
//                             handleInputChange("vendCustId", val, rowId);
//                             const found = vendorOptions.find(
//                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
//                             );
//                             handleInputChange("vendorName", found ? found.label : "", rowId);
//                           }}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <input
//                           className="td-input bg-gray-100 min-w-[220px]"
//                           value={item.vendorName || ""}
//                           readOnly
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </MainContainer>

//       <SecondaryContainer
//         title="Lien Waiver Information"
//         className="mt-3"
//       >
//         <Toolbar
//           isFormView={isDetailFormView}
//           totalRecords={detailRow ? 1 : 0}
//           selectedRow={detailRow}
//           loading={loading}
//           actions={{
//             onAdd: handleAddDetail,
//             onCopy: handleCopyDetail,
//             onDelete: handleDeleteDetail,
//             onToggleView: () => setIsDetailFormView(!isDetailFormView),
//           }}
//           clipboard={detailClipboard ? [detailClipboard] : []}
//           buttonsDisable={["paste", "discard", "save"]}
//         />
//         <div className="p-3 bg-white border border-gray-200 rounded-sm">
//           {isDetailFormView ? (
//             detailRow ? (
//               <div className="space-y-3 p-2 bg-[#e5f3fb]/40 rounded border border-[#17414d]/40 relative">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
//                   <FormInput
//                     label="Lien Number"
//                     type="number"
//                     value={detailRow.lienNo || ""}
//                     onChange={(e) => handleDetailInputChange("lienNo", e.target.value)}
//                   />
//                   <FormInput
//                     label="Lien Amount"
//                     type="number"
//                     value={detailRow.lienAmt || ""}
//                     onChange={(e) => handleDetailInputChange("lienAmt", e.target.value)}
//                   />
//                   <FormInput
//                     label="Date Sent"
//                     type="date"
//                     value={formatDateForInput(detailRow.sentDt)}
//                     onChange={(e) => handleDetailInputChange("sentDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
//                   />
//                   <FormInput
//                     label="Date Returned"
//                     type="date"
//                     value={formatDateForInput(detailRow.returnedDt)}
//                     onChange={(e) => handleDetailInputChange("returnedDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
//                   />
//                   <LienWaiverFormSearchSelect
//                     label="Vendor"
//                     value={detailRow.vendCustId || ""}
//                     searchTerm={vendorSearch}
//                     setSearchTerm={setVendorSearch}
//                     options={vendorOptions}
//                     displayKey="value"
//                     secondaryKey="label"
//                     onSelect={(option) => {
//                       handleDetailInputChange("vendCustId", option.value);
//                       handleDetailInputChange("vendorName", option.label);
//                     }}
//                     onChange={(val) => {
//                       handleDetailInputChange("vendCustId", val);
//                       const found = vendorOptions.find(
//                         (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
//                       );
//                       handleDetailInputChange("vendorName", found ? found.label : "");
//                     }}
//                   />
//                   <FormInput
//                     label="Vendor Description"
//                     value={detailRow.vendorName || ""}
//                     readOnly
//                   />
//                   <LienWaiverFormSearchSelect
//                     label="Project"
//                     value={detailRow.projId || ""}
//                     searchTerm={projectSearch}
//                     setSearchTerm={setProjectSearch}
//                     options={projectOptions}
//                     displayKey="value"
//                     secondaryKey="label"
//                     onSelect={(option) => {
//                       handleDetailInputChange("projId", option.value);
//                       handleDetailInputChange("projectDescription", option.label);
//                     }}
//                     onChange={(val) => {
//                       handleDetailInputChange("projId", val);
//                       const found = projectOptions.find(
//                         (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
//                       );
//                       handleDetailInputChange("projectDescription", found ? found.label : "");
//                     }}
//                   />
//                   <FormInput
//                     label="Project Description"
//                     value={detailRow.projectDescription || ""}
//                     readOnly
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-3 p-2 bg-[#e5f3fb]/40 rounded border border-[#17414d]/40 relative opacity-60">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
//                   <FormInput label="Lien Number" disabled />
//                   <FormInput label="Lien Amount" disabled />
//                   <FormInput label="Date Sent" type="date" disabled />
//                   <FormInput label="Date Returned" type="date" disabled />
//                   <FormInput label="Vendor" disabled />
//                   <FormInput label="Vendor Description" disabled />
//                   <FormInput label="Project" disabled />
//                   <FormInput label="Project Description" disabled />
//                 </div>
//               </div>
//             )
//           ) : (
//             <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
//               <table className="min-w-full text-sm">
//                 <thead className="bg-gray-200 sticky top-0 z-10">
//                   <tr>
//                     <th className="th-thead w-10"></th>
//                     <th className="th-thead">Lien Number</th>
//                     <th className="th-thead">Date Returned</th>
//                     <th className="th-thead">Date Sent</th>
//                     <th className="th-thead">Lien Amount</th>
//                     <th className="th-thead">Vendor</th>
//                     <th className="th-thead">Vendor Description</th>
//                     <th className="th-thead">Project</th>
//                     <th className="th-thead">Project Description</th>
//                   </tr>
//                 </thead>
//                 <tbody className="tbody">
//                   {detailRow && (
//                     <tr>
//                       <td className="tbody-td text-center">
//                         <input
//                           type="checkbox"
//                           className="h-3 w-3 accent-blue-600 cursor-pointer"
//                           checked={detailSelected}
//                           onChange={(e) => setDetailSelected(e.target.checked)}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <input
//                           type="number"
//                           className="td-input min-w-[100px]"
//                           value={detailRow.lienNo || ""}
//                           onChange={(e) => handleDetailInputChange("lienNo", e.target.value)}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <input
//                           type="date"
//                           className="td-input min-w-[130px]"
//                           value={formatDateForInput(detailRow.returnedDt)}
//                           onChange={(e) => handleDetailInputChange("returnedDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <input
//                           type="date"
//                           className="td-input min-w-[130px]"
//                           value={formatDateForInput(detailRow.sentDt)}
//                           onChange={(e) => handleDetailInputChange("sentDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <input
//                           type="number"
//                           className="td-input min-w-[100px]"
//                           value={detailRow.lienAmt || ""}
//                           onChange={(e) => handleDetailInputChange("lienAmt", e.target.value)}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <LienWaiverTableSearchSelect
//                           options={vendorOptions}
//                           value={detailRow.vendCustId || ""}
//                           displayKey="value"
//                           secondaryKey="label"
//                           onSelect={(option) => {
//                             handleDetailInputChange("vendCustId", option.value);
//                             handleDetailInputChange("vendorName", option.label);
//                           }}
//                           onChange={(val) => {
//                             handleDetailInputChange("vendCustId", val);
//                             const found = vendorOptions.find(
//                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
//                             );
//                             handleDetailInputChange("vendorName", found ? found.label : "");
//                           }}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <input
//                           className="td-input bg-gray-100 min-w-[180px]"
//                           value={detailRow.vendorName || ""}
//                           readOnly
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <LienWaiverTableSearchSelect
//                           options={projectOptions}
//                           value={detailRow.projId || ""}
//                           displayKey="value"
//                           secondaryKey="label"
//                           onSelect={(option) => {
//                             handleDetailInputChange("projId", option.value);
//                             handleDetailInputChange("projectDescription", option.label);
//                           }}
//                           onChange={(val) => {
//                             handleDetailInputChange("projId", val);
//                             const found = projectOptions.find(
//                               (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
//                             );
//                             handleDetailInputChange("projectDescription", found ? found.label : "");
//                           }}
//                         />
//                       </td>
//                       <td className="tbody-td">
//                         <input
//                           className="td-input bg-gray-100 min-w-[180px]"
//                           value={detailRow.projectDescription || ""}
//                           readOnly
//                         />
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </SecondaryContainer>
//     </div>
//   );
// };

// export default ManageLienWaiverInformation;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { FormInput, FormSection } from "../helper/formSection";
import { MainContainer, SecondaryContainer, Toolbar } from "../helper/container";
import api from "../utils/api";
import { backendUrl } from "./config";

const LienWaiverFormSearchSelect = ({
  label,
  value,
  searchTerm = "",
  setSearchTerm,
  options,
  onSelect,
  onChange,
  displayKey,
  secondaryKey,
  disabled,
  placeholder = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedOption = options?.find((opt) => {
    const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey]];
    return candidateKeys.some((key) => String(key) === String(value));
  });

  const filteredOptions = (options || []).filter((opt) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    const mainValue = String(opt[displayKey] || "").toLowerCase();
    const subValue = secondaryKey
      ? String(opt[secondaryKey] || "").toLowerCase()
      : "";

    return mainValue.includes(search) || subValue.includes(search);
  });

  const [isTyping, setIsTyping] = useState(false);

  const inputValue = isTyping
    ? searchTerm
    : selectedOption
      ? selectedOption[displayKey]
      : searchTerm || value || "";

  return (
    <div className="space-x-4 flex items-center relative">
      {label && (
        <label className="f-head font-[400] text-[10px] text-black min-w-[90px] whitespace-nowrap">
          {label}
        </label>
      )}

      <div className="relative flex-1">
        <div className="relative group flex items-center">
          <input
            type="text"
            disabled={disabled}
            className={`border outline-none w-full border-gray-300 pl-2 pr-8 py-0.5 rounded text-[10px] 
              ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => {
              setIsTyping(true);
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            onBlur={() => {
              setIsTyping(false);
            }}
            onFocus={() => !disabled && setShowDropdown(true)}
          />
          <div
            className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
            onClick={() => !disabled && setShowDropdown(!showDropdown)}
          >
            <Search size={12} />
          </div>
        </div>

        {showDropdown && !disabled && (
          <>
            <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
                    onClick={() => {
                      onSelect(opt);
                      setSearchTerm("");
                      setShowDropdown(false);
                    }}
                  >
                    <span className="font-[400] text-black">
                      {opt[displayKey]}
                    </span>
                    {secondaryKey && opt[secondaryKey] && (
                      <span className="text-gray-400 ml-2">
                        ({opt[secondaryKey]})
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-[10px] text-gray-400 italic text-center">
                  No matches
                </div>
              )}
            </div>
            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setShowDropdown(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

const LienWaiverTableSearchSelect = ({
  id,
  value,
  options = [],
  onSelect,
  onChange,
  displayKey,
  secondaryKey,
  disabled,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState({});
  const wrapperRef = React.useRef(null);

  const filteredOptions = options.filter((opt) => {
    const mainValue = String(opt[displayKey] || "").toLowerCase();
    const subValue = secondaryKey
      ? String(opt[secondaryKey] || "").toLowerCase()
      : "";
    const term = searchTerm.toLowerCase();

    return mainValue.includes(term) || subValue.includes(term);
  });

  const updateDropdownPosition = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      zIndex: 9999,
    });
  };

  useEffect(() => {
    if (showDropdown) updateDropdownPosition();
  }, [showDropdown, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (showDropdown) updateDropdownPosition();
    };
    window.addEventListener("resize", handleScroll);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showDropdown]);

  return (
    <div className="relative w-full min-w-[150px]" ref={wrapperRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          disabled={disabled}
          className={`w-full border outline-none border-gray-200 pl-1 pr-6 py-0.5 rounded text-[10px] 
            ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white focus:border-blue-300"}`}
          value={
            showDropdown
              ? searchTerm
              : value !== undefined && value !== null
                ? value
                : ""
          }
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
            if (onChange) {
              onChange(e.target.value, id);
            }
          }}
          onFocus={() => !disabled && setShowDropdown(true)}
          autoComplete="off"
        />
        <div className="absolute right-0 px-1 cursor-pointer text-gray-400">
          <Search size={10} />
        </div>
      </div>

      {showDropdown &&
        !disabled &&
        createPortal(
          <>
            <div
              style={dropdownStyle}
              className="bg-white border border-gray-300 rounded shadow-2xl max-h-32 overflow-y-auto custom-scrollbar"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-1 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
                    onClick={() => {
                      onSelect(opt, id);
                      setSearchTerm("");
                      setShowDropdown(false);
                    }}
                  >
                    <span className="font-semibold">{opt[displayKey]}</span>
                    {secondaryKey && opt[secondaryKey] && (
                      <span className="text-gray-400 ml-1">
                        ({opt[secondaryKey]})
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-2 text-[10px] text-gray-400 italic text-center">
                  No matches
                </div>
              )}
            </div>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => {
                setShowDropdown(false);
                setSearchTerm("");
              }}
            />
          </>,
          document.body,
        )}
    </div>
  );
};

const ManageLienWaiverInformation = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailRow, setDetailRow] = useState(null);
  const [detailSelected, setDetailSelected] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [isDetailFormView, setIsDetailFormView] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [detailClipboard, setDetailClipboard] = useState(null);

  const [projects, setProjects] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [projectSearch, setProjectSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [documentSearch, setDocumentSearch] = useState("");

  const initialRecord = {
    lienNo: 0,
    projId: "",
    projectDescription: "",
    waiverTypeCd: "",
    vendCustId: "",
    vendorName: "",
    finalWaiverFl: "N",
    lienAmt: 1,
    lienDate: new Date().toISOString(),
    sentDt: new Date().toISOString(),
    returnedDt: null,
    addrDc: "",
    chkNo: null,
    companyId,
    modifiedBy: user.name || "Admin",
  };

  const formatDateForInput = (dateVal) => {
    if (!dateVal) return "";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().substring(0, 10);
    } catch (e) {
      return "";
    }
  };

  const getBackendErrorMessage = (error) => {
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        return error.response.data;
      }
      if (typeof error.response.data === "object") {
        return error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
      }
    }
    return error.message || "An unexpected error occurred.";
  };

  const normalizeToStartOfDay = (dateVal) => {
    if (!dateVal) return null;
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return null;
      return d.toISOString().substring(0, 10) + "T00:00:00.000Z";
    } catch (e) {
      return null;
    }
  };

  const renderRequiredLabel = (label) => (
    <>
      {label} <span className="text-red-600">*</span>
    </>
  );

  const extractList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.result)) return payload.result;
    if (Array.isArray(payload?.records)) return payload.records;
    return [];
  };

  const normalizeOptions = (items, valueKeys, labelKeys) =>
    (Array.isArray(items) ? items : []).map((item) => {
      const value =
        valueKeys
          .map((key) => item?.[key])
          .find((val) => val !== undefined && val !== null) || "";
      const label =
        labelKeys
          .map((key) => item?.[key])
          .find((val) => val !== undefined && val !== null) || "";
      return { ...item, value: String(value || ""), label: String(label || "") };
    });

  const projectOptions = useMemo(
    () =>
      normalizeOptions(
        projects,
        ["projId", "projectId", "projID", "projectID", "id", "code"],
        [
          "projName",
          "projectName",
          "projectDesc",
          "projDescription",
          "description",
          "name",
        ],
      ),
    [projects],
  );

  const vendorOptions = useMemo(
    () =>
      normalizeOptions(
        vendors,
        ["vendId", "vendorId", "vendCustId", "payVendId", "id"],
        ["vendName", "vendorName", "vendorLongName", "name"],
      ),
    [vendors],
  );

  const documentOptions = useMemo(
    () =>
      normalizeOptions(
        documents,
        ["documentCode", "waiverTypeCd", "code", "value"],
        ["documentDescription", "documentName", "description", "label"],
      ),
    [documents],
  );

  const enrichRecord = useCallback((record) => {
    const vendor = vendorOptions.find(
      (item) => String(item.value) === String(record.vendCustId),
    );
    const project = projectOptions.find(
      (item) => String(item.value) === String(record.projId),
    );
    return {
      ...record,
      vendorName: record.vendorName || vendor?.label || "",
      projectDescription: record.projectDescription || project?.label || "",
    };
  }, [projectOptions, vendorOptions]);

  const getRowId = (row) => row.tempId || row.lienNo;

  const getNextLienNo = () => {
    const usedNumbers = records
      .map((row) => Number(row.lienNo))
      .filter((value) => Number.isFinite(value) && value > 0);
    return (usedNumbers.length > 0 ? Math.max(...usedNumbers) : 0) + 1;
  };

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `${backendUrl}/api/LienWaiverHdrs?companyId=${companyId}`,
      );
      const data = (Array.isArray(response.data) ? response.data : []).map(
        enrichRecord,
      );
      setRecords(data);
      setOriginalRecords(data);
      if (data.length > 0) {
        setSelectedRow(data[0]);
        setSelectedRows(new Set([getRowId(data[0])]));
        setCurrentIndex(0);
      } else {
        setSelectedRow(null);
        setSelectedRows(new Set());
        setCurrentIndex(0);
      }
      setDetailRow(null);
      setDetailSelected(false);
    } catch (error) {
      console.error("Fetch lien waiver information error:", error);
      toast.error(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [companyId, enrichRecord]);

  const fetchLookups = useCallback(async () => {
    try {
      const [projectRes, vendorRes, documentRes] = await Promise.all([
        api.get(`${backendUrl}/Project/GetAllProjects`),
        api.get(`${backendUrl}/api/vendor-transactions/GetAllVendors`),
        api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`),
      ]);
      setProjects(extractList(projectRes.data));
      setVendors(extractList(vendorRes.data));
      setDocuments(extractList(documentRes.data));
    } catch (error) {
      console.error("Fetch lien waiver lookup error:", error);
      toast.error("Failed to fetch project/vendor/document lookup data.");
    }
  }, []);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleInputChange = (field, value, rowId) => {
    setRecords((prev) =>
      prev.map((item) =>
        String(getRowId(item)) === String(rowId)
          ? { ...item, [field]: value, isDirty: true }
          : item,
      ),
    );
    setSelectedRow((prev) =>
      prev && String(getRowId(prev)) === String(rowId)
        ? { ...prev, [field]: value, isDirty: true }
        : prev,
    );
  };

  const handleVendorSelect = (option) => {
    handleDetailInputChange("vendCustId", option.value);
    handleDetailInputChange("vendorName", option.label);
  };

  const handleProjectSelect = (option, rowId) => {
    handleInputChange("projId", option.value, rowId);
    handleInputChange("projectDescription", option.label, rowId);
  };

  const handleDetailInputChange = (field, value) => {
    if (!detailRow) return;
    setDetailRow((prev) => ({ ...prev, [field]: value, isDirty: true }));
    if (selectedRow) {
      handleInputChange(field, value, activeRowId);
    }
  };

  const clearDetailFields = () => {
    if (!detailRow) {
      toast.warn("Please select a waiver record first.");
      return;
    }
    handleDetailInputChange("vendCustId", "");
    handleDetailInputChange("vendorName", "");
    handleDetailInputChange("finalWaiverFl", "N");
  };

  const handleAddDetail = () => {
    if (!selectedRow) {
      toast.warn("Please select a waiver record first.");
      return;
    }

    const blankDetail = {
      ...selectedRow,
      vendCustId: "",
      vendorName: "",
      finalWaiverFl: "N",
      isDirty: true,
    };
    setDetailRow(blankDetail);
    setDetailSelected(true);
  };

  const handleCopyDetail = () => {
    if (!detailRow?.vendCustId) {
      toast.warn("No vendor detail selected to copy.");
      return;
    }
    setDetailClipboard({
      vendCustId: detailRow.vendCustId,
      vendorName: detailRow.vendorName || "",
      finalWaiverFl: detailRow.finalWaiverFl || "N",
    });
    toast.success("Vendor detail copied.");
  };

  const handleDeleteDetail = () => {
    clearDetailFields();
  };

  const handleAdd = () => {
    const defaultWaiverCd = documentOptions.length > 0 ? documentOptions[0].value : "";
    const newRow = {
      ...initialRecord,
      lienNo: getNextLienNo(),
      tempId: `TEMP_${Date.now()}`,
      waiverTypeCd: defaultWaiverCd,
      isNew: true,
      isDirty: true,
    };
    setRecords([newRow, ...records]);
    setSelectedRow(newRow);
    setSelectedRows(new Set([newRow.tempId]));
    setDetailRow(newRow);
    setDetailSelected(true);
    setCurrentIndex(0);
  };

  const validateRows = (rows) => {
    const requiredFields = ["projId", "vendCustId"];
    for (const row of rows) {
      const missing = requiredFields.find(
        (field) => !row[field] || String(row[field]).trim() === "",
      );
      if (missing) {
        toast.error(
          `Row ${records.indexOf(row) + 1}: ${missing === "projId" ? "Project" : "Vendor"} is required.`,
        );
        return false;
      }
    }
    return true;
  };

  const buildPayload = (row) => {
    const payload = { ...row };
    delete payload.tempId;
    delete payload.isNew;
    delete payload.isDirty;
    delete payload.vendorName;
    delete payload.projectDescription;

    const defaultWaiverCd = documentOptions.length > 0 ? documentOptions[0].value : "STANDARD";
    const waiverTypeCd = row.waiverTypeCd || defaultWaiverCd;

    const sentDateVal = row.sentDt || new Date().toISOString();
    // Dynamic Date Alignment: Lien Date matches Sent Date perfectly so that validation sentDt >= lienDate is always met!
    const lienDateVal = sentDateVal;

    return {
      ...payload,
      lienNo: Number(row.lienNo || getNextLienNo()),
      lienAmt: Number(row.lienAmt || 1),
      companyId,
      modifiedBy: user.name || row.modifiedBy || "Admin",
      finalWaiverFl: row.finalWaiverFl || "N",
      sentDt: normalizeToStartOfDay(sentDateVal),
      lienDate: normalizeToStartOfDay(lienDateVal),
      returnedDt: row.returnedDt ? normalizeToStartOfDay(row.returnedDt) : undefined,
      chkNo: row.chkNo === null || row.chkNo === undefined ? undefined : row.chkNo,
      waiverTypeCd,
    };
  };

  const handleSaveAll = async () => {
    const changedRows = records.filter((row) => row.isNew || row.isDirty);
    if (changedRows.length === 0) {
      toast.info("No changes to save.");
      return;
    }
    if (!validateRows(changedRows)) return;

    setLoading(true);
    try {
      await Promise.all(
        changedRows.map((row) =>
          row.isNew
            ? api.post(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row))
            : api.put(`${backendUrl}/api/LienWaiverHdrs`, buildPayload(row)),
        ),
      );
      toast.success("Lien waiver information saved.");
      setDetailRow(null);
      setDetailSelected(false);
      fetchRecords();
    } catch (error) {
      console.error("Save lien waiver information error:", error);
      toast.error(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      toast.warn("Please select at least one waiver record to delete.");
      return;
    }
    if (!window.confirm(`Delete ${selectedRows.size} selected record(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      for (const id of Array.from(selectedRows)) {
        if (String(id).startsWith("TEMP_")) {
          setRecords((prev) => prev.filter((item) => item.tempId !== id));
        } else {
          await api.delete(`${backendUrl}/api/LienWaiverHdrs/${id}`);
        }
      }
      toast.success("Selected waiver record(s) deleted.");
      setSelectedRows(new Set());
      setSelectedRow(null);
      setDetailRow(null);
      setDetailSelected(false);
      fetchRecords();
    } catch (error) {
      console.error("Delete lien waiver information error:", error);
      toast.error(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setRecords([...originalRecords]);
    setSelectedRows(new Set());
    setSelectedRow(null);
    setDetailRow(null);
    setDetailSelected(false);
    toast.info("Changes discarded.");
  };

  const handleNavigate = (direction) => {
    if (records.length === 0) return;
    let nextIndex = currentIndex;
    if (direction === "start") nextIndex = 0;
    if (direction === "prev") nextIndex = Math.max(0, currentIndex - 1);
    if (direction === "next")
      nextIndex = Math.min(records.length - 1, currentIndex + 1);
    if (direction === "end") nextIndex = records.length - 1;

    const nextRecord = records[nextIndex];
    setCurrentIndex(nextIndex);
    setSelectedRow(nextRecord);
    setSelectedRows(new Set([getRowId(nextRecord)]));
    
    const rowId = getRowId(nextRecord);
    if (!String(rowId).startsWith("TEMP_")) {
      fetchDetailForRow(nextRecord);
    } else {
      setDetailRow(nextRecord);
      setDetailSelected(true);
    }
  };

  const jumpToCode = (code) => {
    const foundIndex = records.findIndex(
      (item) =>
        String(item.projId).toLowerCase() === String(code).toLowerCase() ||
        String(item.vendCustId).toLowerCase() === String(code).toLowerCase() ||
        String(item.lienNo).toLowerCase() === String(code).toLowerCase(),
    );
    if (foundIndex === -1) {
      toast.error(`Lien waiver record "${code}" not found.`);
      return;
    }
    const found = records[foundIndex];
    setCurrentIndex(foundIndex);
    setSelectedRow(found);
    setSelectedRows(new Set([getRowId(found)]));
    
    const rowId = getRowId(found);
    if (!String(rowId).startsWith("TEMP_")) {
      fetchDetailForRow(found);
    } else {
      setDetailRow(found);
      setDetailSelected(true);
    }
  };

  const fetchDetailForRow = async (item) => {
    if (!item?.lienNo || String(item.lienNo) === "0") {
      setDetailRow(null);
      setDetailSelected(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`${backendUrl}/api/LienWaiverHdrs/${item.lienNo}`);
      const detail = enrichRecord(response.data || item);
      setDetailRow(detail);
      setDetailSelected(true);
    } catch (error) {
      console.error("Fetch lien waiver detail error:", error);
      setDetailRow(null);
      setDetailSelected(false);
      toast.error(getBackendErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item, index) => {
    const rowId = getRowId(item);
    const next = new Set(selectedRows);
    if (next.has(rowId)) {
      next.delete(rowId);
      setSelectedRow(null);
      setDetailRow(null);
      setDetailSelected(false);
    } else {
      next.clear();
      next.add(rowId);
      setSelectedRow(item);
      setCurrentIndex(index);
      if (!String(rowId).startsWith("TEMP_")) {
        fetchDetailForRow(item);
      } else {
        setDetailRow(item);
        setDetailSelected(true);
      }
    }
    setSelectedRows(next);
  };

  const activeRowId = selectedRow ? getRowId(selectedRow) : "";

  return (
    <div className="mt-14 ml-4">
      <MainContainer title="Manage Lien Waiver Information">
        <Toolbar
          isFormView={isFormView}
          totalRecords={records.length}
          selectedRow={selectedRow}
          currentIndex={currentIndex}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onClear: handleDiscard,
            onToggleView: () => setIsFormView(!isFormView),
          }}
          buttonsDisable={["copy", "paste"]}
        />

        {isFormView ? (
          <div className="p-2 space-y-3">
            <FormSection title="Identification">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <LienWaiverFormSearchSelect
                  label={renderRequiredLabel("Project")}
                  value={selectedRow?.projId || ""}
                  searchTerm={projectSearch}
                  setSearchTerm={setProjectSearch}
                  options={projectOptions}
                  displayKey="value"
                  secondaryKey="label"
                  onSelect={(option) => handleProjectSelect(option, activeRowId)}
                  onChange={(val) => {
                    handleInputChange("projId", val, activeRowId);
                    const found = projectOptions.find(
                      (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
                    );
                    handleInputChange("projectDescription", found ? found.label : "", activeRowId);
                  }}
                />
                <FormInput
                  label="Project Description"
                  value={selectedRow?.projectDescription || ""}
                  readOnly
                />

                <LienWaiverFormSearchSelect
                  label={renderRequiredLabel("Vendor")}
                  value={selectedRow?.vendCustId || ""}
                  searchTerm={vendorSearch}
                  setSearchTerm={setVendorSearch}
                  options={vendorOptions}
                  displayKey="value"
                  secondaryKey="label"
                  onSelect={(option) => {
                    handleInputChange("vendCustId", option.value, activeRowId);
                    handleInputChange("vendorName", option.label, activeRowId);
                  }}
                  onChange={(val) => {
                    handleInputChange("vendCustId", val, activeRowId);
                    const found = vendorOptions.find(
                      (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
                    );
                    handleInputChange("vendorName", found ? found.label : "", activeRowId);
                  }}
                />
                <FormInput
                  label="Vendor Description"
                  value={selectedRow?.vendorName || ""}
                  readOnly
                />
              </div>
            </FormSection>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-10"></th>
                  <th className="th-thead">{renderRequiredLabel("Project")}</th>
                  <th className="th-thead">Project Description</th>
                  <th className="th-thead">{renderRequiredLabel("Vendor")}</th>
                  <th className="th-thead">Vendor Name</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {records.map((item, index) => {
                  const rowId = getRowId(item);
                  return (
                    <tr
                      key={rowId}
                      className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
                    >
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="h-3 w-3 accent-blue-600"
                          checked={selectedRows.has(rowId)}
                          onChange={() => toggleSelection(item, index)}
                        />
                      </td>
                      <td className="tbody-td">
                        <LienWaiverTableSearchSelect
                          options={projectOptions}
                          value={item.projId || ""}
                          displayKey="value"
                          secondaryKey="label"
                          onSelect={(option) => handleProjectSelect(option, rowId)}
                          onChange={(val) => {
                            handleInputChange("projId", val, rowId);
                            const found = projectOptions.find(
                              (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
                            );
                            handleInputChange("projectDescription", found ? found.label : "", rowId);
                          }}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-100 min-w-[220px]"
                          value={item.projectDescription || ""}
                          readOnly
                        />
                      </td>
                      <td className="tbody-td">
                        <LienWaiverTableSearchSelect
                          options={vendorOptions}
                          value={item.vendCustId || ""}
                          displayKey="value"
                          secondaryKey="label"
                          onSelect={(option) => {
                            handleInputChange("vendCustId", option.value, rowId);
                            handleInputChange("vendorName", option.label, rowId);
                          }}
                          onChange={(val) => {
                            handleInputChange("vendCustId", val, rowId);
                            const found = vendorOptions.find(
                              (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
                            );
                            handleInputChange("vendorName", found ? found.label : "", rowId);
                          }}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-100 min-w-[220px]"
                          value={item.vendorName || ""}
                          readOnly
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>

      <SecondaryContainer
        title="Lien Waiver Information"
        className="mt-3"
      >
        <Toolbar
          isFormView={isDetailFormView}
          totalRecords={detailRow ? 1 : 0}
          selectedRow={detailRow}
          loading={loading}
          actions={{
            onAdd: handleAddDetail,
            onCopy: handleCopyDetail,
            onDelete: handleDeleteDetail,
            onToggleView: () => setIsDetailFormView(!isDetailFormView),
          }}
          clipboard={detailClipboard ? [detailClipboard] : []}
          buttonsDisable={["paste", "discard", "save"]}
        />
        <div className="p-3 bg-white border border-gray-200 rounded-sm">
          {isDetailFormView ? (
            detailRow ? (
              <div className="space-y-3 p-2 bg-[#e5f3fb]/40 rounded border border-[#17414d]/40 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <FormInput
                    label="Lien Number"
                    type="number"
                    value={detailRow.lienNo || ""}
                    onChange={(e) => handleDetailInputChange("lienNo", e.target.value)}
                  />
                  <FormInput
                    label="Lien Amount"
                    type="number"
                    value={detailRow.lienAmt || ""}
                    onChange={(e) => handleDetailInputChange("lienAmt", e.target.value)}
                  />
                  <FormInput
                    label="Date Sent"
                    type="date"
                    value={formatDateForInput(detailRow.sentDt)}
                    onChange={(e) => handleDetailInputChange("sentDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
                  />
                  <FormInput
                    label="Date Returned"
                    type="date"
                    value={formatDateForInput(detailRow.returnedDt)}
                    onChange={(e) => handleDetailInputChange("returnedDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
                  />
                  <LienWaiverFormSearchSelect
                    label="Vendor"
                    value={detailRow.vendCustId || ""}
                    searchTerm={vendorSearch}
                    setSearchTerm={setVendorSearch}
                    options={vendorOptions}
                    displayKey="value"
                    secondaryKey="label"
                    onSelect={(option) => {
                      handleDetailInputChange("vendCustId", option.value);
                      handleDetailInputChange("vendorName", option.label);
                    }}
                    onChange={(val) => {
                      handleDetailInputChange("vendCustId", val);
                      const found = vendorOptions.find(
                        (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
                      );
                      handleDetailInputChange("vendorName", found ? found.label : "");
                    }}
                  />
                  <FormInput
                    label="Vendor Description"
                    value={detailRow.vendorName || ""}
                    readOnly
                  />
                  <LienWaiverFormSearchSelect
                    label="Project"
                    value={detailRow.projId || ""}
                    searchTerm={projectSearch}
                    setSearchTerm={setProjectSearch}
                    options={projectOptions}
                    displayKey="value"
                    secondaryKey="label"
                    onSelect={(option) => {
                      handleDetailInputChange("projId", option.value);
                      handleDetailInputChange("projectDescription", option.label);
                    }}
                    onChange={(val) => {
                      handleDetailInputChange("projId", val);
                      const found = projectOptions.find(
                        (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
                      );
                      handleDetailInputChange("projectDescription", found ? found.label : "");
                    }}
                  />
                  <FormInput
                    label="Project Description"
                    value={detailRow.projectDescription || ""}
                    readOnly
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-2 bg-[#e5f3fb]/40 rounded border border-[#17414d]/40 relative opacity-60">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <FormInput label="Lien Number" disabled />
                  <FormInput label="Lien Amount" disabled />
                  <FormInput label="Date Sent" type="date" disabled />
                  <FormInput label="Date Returned" type="date" disabled />
                  <FormInput label="Vendor" disabled />
                  <FormInput label="Vendor Description" disabled />
                  <FormInput label="Project" disabled />
                  <FormInput label="Project Description" disabled />
                </div>
              </div>
            )
          ) : (
            <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="th-thead w-10"></th>
                    <th className="th-thead">Lien Number</th>
                    <th className="th-thead">Date Returned</th>
                    <th className="th-thead">Date Sent</th>
                    <th className="th-thead">Lien Amount</th>
                    <th className="th-thead">Vendor</th>
                    <th className="th-thead">Vendor Description</th>
                    <th className="th-thead">Project</th>
                    <th className="th-thead">Project Description</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {detailRow && (
                    <tr>
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          checked={detailSelected}
                          onChange={(e) => setDetailSelected(e.target.checked)}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          type="number"
                          className="td-input min-w-[100px]"
                          value={detailRow.lienNo || ""}
                          onChange={(e) => handleDetailInputChange("lienNo", e.target.value)}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          type="date"
                          className="td-input min-w-[130px]"
                          value={formatDateForInput(detailRow.returnedDt)}
                          onChange={(e) => handleDetailInputChange("returnedDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          type="date"
                          className="td-input min-w-[130px]"
                          value={formatDateForInput(detailRow.sentDt)}
                          onChange={(e) => handleDetailInputChange("sentDt", e.target.value ? new Date(e.target.value).toISOString() : null)}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          type="number"
                          className="td-input min-w-[100px]"
                          value={detailRow.lienAmt || ""}
                          onChange={(e) => handleDetailInputChange("lienAmt", e.target.value)}
                        />
                      </td>
                      <td className="tbody-td">
                        <LienWaiverTableSearchSelect
                          options={vendorOptions}
                          value={detailRow.vendCustId || ""}
                          displayKey="value"
                          secondaryKey="label"
                          onSelect={(option) => {
                            handleDetailInputChange("vendCustId", option.value);
                            handleDetailInputChange("vendorName", option.label);
                          }}
                          onChange={(val) => {
                            handleDetailInputChange("vendCustId", val);
                            const found = vendorOptions.find(
                              (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
                            );
                            handleDetailInputChange("vendorName", found ? found.label : "");
                          }}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-100 min-w-[180px]"
                          value={detailRow.vendorName || ""}
                          readOnly
                        />
                      </td>
                      <td className="tbody-td">
                        <LienWaiverTableSearchSelect
                          options={projectOptions}
                          value={detailRow.projId || ""}
                          displayKey="value"
                          secondaryKey="label"
                          onSelect={(option) => {
                            handleDetailInputChange("projId", option.value);
                            handleDetailInputChange("projectDescription", option.label);
                          }}
                          onChange={(val) => {
                            handleDetailInputChange("projId", val);
                            const found = projectOptions.find(
                              (opt) => String(opt.value).toLowerCase() === String(val).toLowerCase()
                            );
                            handleDetailInputChange("projectDescription", found ? found.label : "");
                          }}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-100 min-w-[180px]"
                          value={detailRow.projectDescription || ""}
                          readOnly
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SecondaryContainer>
    </div>
  );
};

export default ManageLienWaiverInformation;
