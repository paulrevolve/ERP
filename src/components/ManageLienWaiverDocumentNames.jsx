// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { MainContainer, Toolbar } from "../helper/container";
// import api from "../utils/api";
// import { backendUrl } from "./config";

// const ManageLienWaiverDocumentNames = () => {
//   const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
//   const [documents, setDocuments] = useState([]);
//   const [originalDocuments, setOriginalDocuments] = useState([]);
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchValue, setSearchValue] = useState("");

//   const initialDocument = {
//     documentCode: "",
//     documentName: "",
//     documentDetailName: "",
//     documentDescription: "",
//     arSuppDetailFlag: "N",
//     arAllDetailFlag: "N",
//     apSuppDetailFlag: "N",
//     apAllDetailFlag: "N",
//     modifiedBy: user.name || "Admin",
//   };

//   const requiredFields = ["documentCode", "documentName"];

//   const renderRequiredLabel = (label) => (
//     <>
//       {label} <span className="text-red-600">*</span>
//     </>
//   );

//   const fetchDocuments = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get(`${backendUrl}/api/LienWaiverDocument`);
//       const data = Array.isArray(response.data) ? response.data : [];
//       setDocuments(data);
//       setOriginalDocuments(data);
//       if (data.length > 0) {
//         setSelectedRow(data[0]);
//         setSelectedRows(new Set([data[0].documentCode]));
//       } else {
//         setSelectedRow(null);
//         setSelectedRows(new Set());
//       }
//     } catch (error) {
//       console.error("Fetch lien waiver documents error:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to fetch lien waiver documents.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const getRowId = (row) => row.tempId || row.documentCode;

//   const handleInputChange = (field, value, rowId) => {
//     setDocuments((prev) =>
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

//   const handleAdd = () => {
//     if (documents.some((row) => row.isNew || row.tempId)) {
//       toast.warn("Please save or discard the current new entry first.");
//       return;
//     }

//     const newRow = {
//       ...initialDocument,
//       tempId: `TEMP_${Date.now()}`,
//       isNew: true,
//       isDirty: true,
//     };
//     setDocuments([newRow, ...documents]);
//     setSelectedRow(newRow);
//     setSelectedRows(new Set([newRow.tempId]));
//   };

//   const validateRows = (rows) => {
//     for (const row of rows) {
//       const missing = requiredFields.find(
//         (field) => !row[field] || String(row[field]).trim() === "",
//       );
//       if (missing) {
//         toast.error(
//           `Row ${documents.indexOf(row) + 1}: ${missing.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`,
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
//     return {
//       ...payload,
//       arSuppDetailFlag: row.arSuppDetailFlag || "N",
//       arAllDetailFlag: row.arAllDetailFlag || "N",
//       apSuppDetailFlag: row.apSuppDetailFlag || "N",
//       apAllDetailFlag: row.apAllDetailFlag || "N",
//       modifiedBy: user.name || row.modifiedBy || "Admin",
//     };
//   };

//   const handleSaveAll = async () => {
//     const changedRows = documents.filter((row) => row.isNew || row.isDirty);
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
//             ? api.post(`${backendUrl}/api/LienWaiverDocument`, buildPayload(row))
//             : api.put(`${backendUrl}/api/LienWaiverDocument`, buildPayload(row)),
//         ),
//       );
//       toast.success("Lien waiver document names saved.");
//       fetchDocuments();
//     } catch (error) {
//       console.error("Save lien waiver documents error:", error);
//       toast.error(error.response?.data?.message || "Failed to save changes.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (selectedRows.size === 0) {
//       toast.warn("Please select at least one document to delete.");
//       return;
//     }
//     if (!window.confirm(`Delete ${selectedRows.size} selected document(s)?`)) {
//       return;
//     }

//     setLoading(true);
//     try {
//       for (const id of Array.from(selectedRows)) {
//         if (String(id).startsWith("TEMP_")) {
//           setDocuments((prev) => prev.filter((item) => item.tempId !== id));
//         } else {
//           await api.delete(
//             `${backendUrl}/api/LienWaiverDocument/${encodeURIComponent(id)}`,
//           );
//         }
//       }
//       toast.success("Selected document(s) deleted.");
//       setSelectedRows(new Set());
//       setSelectedRow(null);
//       fetchDocuments();
//     } catch (error) {
//       console.error("Delete lien waiver document error:", error);
//       toast.error(error.response?.data?.message || "Failed to delete document.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDiscard = () => {
//     setDocuments([...originalDocuments]);
//     setSelectedRows(new Set());
//     setSelectedRow(null);
//     toast.info("Changes discarded.");
//   };

//   const jumpToCode = (code) => {
//     const found = documents.find(
//       (item) =>
//         String(item.documentCode).toLowerCase() === String(code).toLowerCase(),
//     );
//     if (!found) {
//       toast.error(`Waiver Doc Code "${code}" not found.`);
//       return;
//     }
//     setSelectedRow(found);
//     setSelectedRows(new Set([getRowId(found)]));
//   };

//   const toggleSelection = (item) => {
//     const id = getRowId(item);
//     const next = new Set(selectedRows);
//     if (next.has(id)) {
//       next.delete(id);
//       setSelectedRow(null);
//     } else {
//       next.add(id);
//       setSelectedRow(item);
//     }
//     setSelectedRows(next);
//   };

//   return (
//     <div className="mt-14 ml-4">
//       <MainContainer title="Manage Lien Waiver Document Names">
//         <Toolbar
//           isFormView={false}
//           totalRecords={documents.length}
//           selectedRow={selectedRow}
//           searchValue={searchValue}
//           setSearchValue={setSearchValue}
//           jumpToCode={jumpToCode}
//           loading={loading}
//           actions={{
//             onAdd: handleAdd,
//             onSave: handleSaveAll,
//             onDelete: handleDelete,
//             onClear: handleDiscard,
//           }}
//           buttonsDisable={["copy", "paste", "tableform"]}
//         />

//         <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-200 sticky top-0 z-10">
//               <tr>
//                 <th className="th-thead w-10"></th>
//                 <th className="th-thead">{renderRequiredLabel("Waiver Doc Code")}</th>
//                 <th className="th-thead">
//                   {renderRequiredLabel("Document File Name")}
//                 </th>
//                 <th className="th-thead">Detail Document File Name</th>
//                 <th className="th-thead">Document Description</th>
//                 <th className="th-thead">Supporting Detail</th>
//                 <th className="th-thead">Print All Checks To Date</th>
//               </tr>
//             </thead>
//             <tbody className="tbody">
//               {documents.map((item) => {
//                 const rowId = getRowId(item);
//                 return (
//                   <tr
//                     key={rowId}
//                     className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
//                   >
//                     <td className="tbody-td text-center">
//                       <input
//                         type="checkbox"
//                         className="h-3 w-3 accent-blue-600 cursor-pointer"
//                         checked={selectedRows.has(rowId)}
//                         onChange={() => toggleSelection(item)}
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className={`td-input min-w-[150px] ${item.isNew ? "bg-white" : "bg-gray-100"}`}
//                         value={item.documentCode || ""}
//                         disabled={!item.isNew}
//                         onChange={(e) =>
//                           handleInputChange("documentCode", e.target.value, rowId)
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input min-w-[180px]"
//                         value={item.documentName || ""}
//                         onChange={(e) =>
//                           handleInputChange("documentName", e.target.value, rowId)
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input min-w-[180px]"
//                         value={item.documentDetailName || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "documentDetailName",
//                             e.target.value,
//                             rowId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         className="td-input min-w-[220px]"
//                         value={item.documentDescription || ""}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "documentDescription",
//                             e.target.value,
//                             rowId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td text-center">
//                       <input
//                         type="checkbox"
//                         className="h-3 w-3 accent-blue-600"
//                         checked={item.arSuppDetailFlag === "Y"}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "arSuppDetailFlag",
//                             e.target.checked ? "Y" : "N",
//                             rowId,
//                           )
//                         }
//                       />
//                     </td>
//                     <td className="tbody-td text-center">
//                       <input
//                         type="checkbox"
//                         className="h-3 w-3 accent-blue-600"
//                         checked={item.arAllDetailFlag === "Y"}
//                         onChange={(e) =>
//                           handleInputChange(
//                             "arAllDetailFlag",
//                             e.target.checked ? "Y" : "N",
//                             rowId,
//                           )
//                         }
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </MainContainer>
//     </div>
//   );
// };

// export default ManageLienWaiverDocumentNames;

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import { MainContainer, Toolbar } from "../helper/container";
import api from "../utils/api";
import { backendUrl } from "./config";

const DocumentTableSearchSelect = ({
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

const ManageLienWaiverDocumentNames = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [documents, setDocuments] = useState([]);
  const [originalDocuments, setOriginalDocuments] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [lookupOptions, setLookupOptions] = useState([]);

  const initialDocument = {
    documentCode: "",
    documentName: "",
    documentDetailName: "",
    documentDescription: "",
    arSuppDetailFlag: "N",
    arAllDetailFlag: "N",
    apSuppDetailFlag: "N",
    apAllDetailFlag: "N",
    modifiedBy: user.name || "Admin",
  };

  const requiredFields = ["documentCode", "documentName"];

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

  const normalizedLookupOptions = React.useMemo(() => {
    return (lookupOptions || []).map((opt) => ({
      ...opt,
      documentCode: opt.documentCode || opt.waiverTypeCd || opt.code || opt.value || "",
      documentDescription: opt.documentDescription || opt.documentName || opt.description || opt.label || "",
    }));
  }, [lookupOptions]);

  const fetchLookupOptions = async () => {
    try {
      const response = await api.get(`${backendUrl}/api/LienWaiverDocument/dropdown`);
      const list = extractList(response.data);
      setLookupOptions(list);
    } catch (error) {
      console.error("Fetch lookup options error:", error);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${backendUrl}/api/LienWaiverDocument`);
      const data = Array.isArray(response.data) ? response.data : [];
      setDocuments(data);
      setOriginalDocuments(data);
      if (data.length > 0) {
        setSelectedRow(data[0]);
        setSelectedRows(new Set([data[0].documentCode]));
      } else {
        setSelectedRow(null);
        setSelectedRows(new Set());
      }
    } catch (error) {
      console.error("Fetch lien waiver documents error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch lien waiver documents.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchLookupOptions();
  }, []);

  const getRowId = (row) => row.tempId || row.documentCode;

  const handleInputChange = (field, value, rowId) => {
    setDocuments((prev) =>
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

    if (field === "documentCode") {
      const match = originalDocuments.find(
        (doc) => String(doc.documentCode).toLowerCase() === String(value).trim().toLowerCase()
      );
      if (match) {
        setDocuments((prev) =>
          prev.map((item) =>
            String(getRowId(item)) === String(rowId)
              ? {
                  ...item,
                  documentName: match.documentName || "",
                  documentDetailName: match.documentDetailName || "",
                  documentDescription: match.documentDescription || "",
                  arSuppDetailFlag: match.arSuppDetailFlag || "N",
                  arAllDetailFlag: match.arAllDetailFlag || "N",
                  apSuppDetailFlag: match.apSuppDetailFlag || "N",
                  apAllDetailFlag: match.apAllDetailFlag || "N",
                }
              : item
          )
        );
        setSelectedRow((prev) =>
          prev && String(getRowId(prev)) === String(rowId)
            ? {
                ...prev,
                documentName: match.documentName || "",
                documentDetailName: match.documentDetailName || "",
                documentDescription: match.documentDescription || "",
                arSuppDetailFlag: match.arSuppDetailFlag || "N",
                arAllDetailFlag: match.arAllDetailFlag || "N",
                apSuppDetailFlag: match.apSuppDetailFlag || "N",
                apAllDetailFlag: match.apAllDetailFlag || "N",
              }
            : prev
        );
      }
    }
  };

  const handleDropdownSelect = (opt, rowId) => {
    const code = opt.documentCode || "";
    setDocuments((prev) =>
      prev.map((item) =>
        String(getRowId(item)) === String(rowId)
          ? { ...item, documentCode: code, isDirty: true }
          : item
      )
    );
    setSelectedRow((prev) =>
      prev && String(getRowId(prev)) === String(rowId)
        ? { ...prev, documentCode: code, isDirty: true }
        : prev
    );

    const match = originalDocuments.find(
      (doc) => String(doc.documentCode).toLowerCase() === String(code).toLowerCase()
    );
    if (match) {
      setDocuments((prev) =>
        prev.map((item) =>
          String(getRowId(item)) === String(rowId)
            ? {
                ...item,
                documentName: match.documentName || "",
                documentDetailName: match.documentDetailName || "",
                documentDescription: match.documentDescription || "",
                arSuppDetailFlag: match.arSuppDetailFlag || "N",
                arAllDetailFlag: match.arAllDetailFlag || "N",
                apSuppDetailFlag: match.apSuppDetailFlag || "N",
                apAllDetailFlag: match.apAllDetailFlag || "N",
                isDirty: true,
              }
            : item
        )
      );
      setSelectedRow((prev) =>
        prev && String(getRowId(prev)) === String(rowId)
          ? {
              ...prev,
              documentName: match.documentName || "",
              documentDetailName: match.documentDetailName || "",
              documentDescription: match.documentDescription || "",
              arSuppDetailFlag: match.arSuppDetailFlag || "N",
              arAllDetailFlag: match.arAllDetailFlag || "N",
              apSuppDetailFlag: match.apSuppDetailFlag || "N",
              apAllDetailFlag: match.apAllDetailFlag || "N",
              isDirty: true,
            }
          : prev
      );
    } else {
      const desc = opt.documentDescription || opt.documentName || "";
      if (desc) {
        setDocuments((prev) =>
          prev.map((item) =>
            String(getRowId(item)) === String(rowId)
              ? { ...item, documentDescription: desc, isDirty: true }
              : item
          )
        );
        setSelectedRow((prev) =>
          prev && String(getRowId(prev)) === String(rowId)
            ? { ...prev, documentDescription: desc, isDirty: true }
            : prev
        );
      }
    }
  };

  const handleAdd = () => {
    if (documents.some((row) => row.isNew || row.tempId)) {
      toast.warn("Please save or discard the current new entry first.");
      return;
    }

    const defaultCode = normalizedLookupOptions.length > 0 ? normalizedLookupOptions[0].documentCode : "";
    const match = defaultCode ? originalDocuments.find(
      (doc) => String(doc.documentCode).toLowerCase() === String(defaultCode).toLowerCase()
    ) : null;

    const newRow = {
      ...initialDocument,
      documentCode: defaultCode,
      documentName: match ? (match.documentName || "") : "",
      documentDetailName: match ? (match.documentDetailName || "") : "",
      documentDescription: match ? (match.documentDescription || "") : (normalizedLookupOptions.length > 0 ? (normalizedLookupOptions[0].documentDescription || "") : ""),
      arSuppDetailFlag: match ? (match.arSuppDetailFlag || "N") : "N",
      arAllDetailFlag: match ? (match.arAllDetailFlag || "N") : "N",
      apSuppDetailFlag: match ? (match.apSuppDetailFlag || "N") : "N",
      apAllDetailFlag: match ? (match.apAllDetailFlag || "N") : "N",
      tempId: `TEMP_${Date.now()}`,
      isNew: true,
      isDirty: true,
    };
    setDocuments([newRow, ...documents]);
    setSelectedRow(newRow);
    setSelectedRows(new Set([newRow.tempId]));
  };

  const validateRows = (rows) => {
    for (const row of rows) {
      const missing = requiredFields.find(
        (field) => !row[field] || String(row[field]).trim() === "",
      );
      if (missing) {
        toast.error(
          `Row ${documents.indexOf(row) + 1}: ${missing.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`,
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
    return {
      ...payload,
      arSuppDetailFlag: row.arSuppDetailFlag || "N",
      arAllDetailFlag: row.arAllDetailFlag || "N",
      apSuppDetailFlag: row.apSuppDetailFlag || "N",
      apAllDetailFlag: row.apAllDetailFlag || "N",
      modifiedBy: user.name || row.modifiedBy || "Admin",
    };
  };

  const handleSaveAll = async () => {
    const changedRows = documents.filter((row) => row.isNew || row.isDirty);
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
            ? api.post(`${backendUrl}/api/LienWaiverDocument`, buildPayload(row))
            : api.put(`${backendUrl}/api/LienWaiverDocument`, buildPayload(row)),
        ),
      );
      toast.success("Lien waiver document names saved.");
      fetchDocuments();
      fetchLookupOptions();
    } catch (error) {
      console.error("Save lien waiver documents error:", error);
      toast.error(error.response?.data?.message || "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      toast.warn("Please select at least one document to delete.");
      return;
    }
    if (!window.confirm(`Delete ${selectedRows.size} selected document(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      for (const id of Array.from(selectedRows)) {
        if (String(id).startsWith("TEMP_")) {
          setDocuments((prev) => prev.filter((item) => item.tempId !== id));
        } else {
          await api.delete(
            `${backendUrl}/api/LienWaiverDocument/${encodeURIComponent(id)}`,
          );
        }
      }
      toast.success("Selected document(s) deleted.");
      setSelectedRows(new Set());
      setSelectedRow(null);
      fetchDocuments();
      fetchLookupOptions();
    } catch (error) {
      console.error("Delete lien waiver document error:", error);
      toast.error(error.response?.data?.message || "Failed to delete document.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setDocuments([...originalDocuments]);
    setSelectedRows(new Set());
    setSelectedRow(null);
    toast.info("Changes discarded.");
  };

  const jumpToCode = (code) => {
    const found = documents.find(
      (item) =>
        String(item.documentCode).toLowerCase() === String(code).toLowerCase(),
    );
    if (!found) {
      toast.error(`Waiver Doc Code "${code}" not found.`);
      return;
    }
    setSelectedRow(found);
    setSelectedRows(new Set([getRowId(found)]));
  };

  const toggleSelection = (item) => {
    const id = getRowId(item);
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
      setSelectedRow(null);
    } else {
      next.add(id);
      setSelectedRow(item);
    }
    setSelectedRows(next);
  };

  return (
    <div className="mt-14 ml-4">
      <MainContainer title="Manage Lien Waiver Document Names">
        <Toolbar
          isFormView={false}
          totalRecords={documents.length}
          selectedRow={selectedRow}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onClear: handleDiscard,
          }}
          buttonsDisable={["copy", "paste", "tableform"]}
        />

        <div className="overflow-x-auto max-h-[55vh] border border-gray-300">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="th-thead w-10"></th>
                <th className="th-thead">{renderRequiredLabel("Waiver Doc Code")}</th>
                <th className="th-thead">
                  {renderRequiredLabel("Document File Name")}
                </th>
                <th className="th-thead">Detail Document File Name</th>
                <th className="th-thead">Document Description</th>
                <th className="th-thead">Supporting Detail</th>
                <th className="th-thead">Print All Checks To Date</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {documents.map((item) => {
                const rowId = getRowId(item);
                return (
                  <tr
                    key={rowId}
                    className={`hover:bg-gray-50 ${selectedRows.has(rowId) ? "bg-blue-50" : ""}`}
                  >
                    <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        checked={selectedRows.has(rowId)}
                        onChange={() => toggleSelection(item)}
                      />
                    </td>
                    <td className="tbody-td">
                      <DocumentTableSearchSelect
                        id={rowId}
                        value={item.documentCode || ""}
                        options={normalizedLookupOptions}
                        displayKey="documentCode"
                        secondaryKey="documentDescription"
                        disabled={!item.isNew}
                        onChange={(val, id) => handleInputChange("documentCode", val, id)}
                        onSelect={(opt, id) => handleDropdownSelect(opt, id)}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[180px]"
                        value={item.documentName || ""}
                        onChange={(e) =>
                          handleInputChange("documentName", e.target.value, rowId)
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[180px]"
                        value={item.documentDetailName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "documentDetailName",
                            e.target.value,
                            rowId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[220px]"
                        value={item.documentDescription || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "documentDescription",
                            e.target.value,
                            rowId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        className="h-3 w-3 accent-blue-600"
                        checked={item.arSuppDetailFlag === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "arSuppDetailFlag",
                            e.target.checked ? "Y" : "N",
                            rowId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        className="h-3 w-3 accent-blue-600"
                        checked={item.arAllDetailFlag === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "arAllDetailFlag",
                            e.target.checked ? "Y" : "N",
                            rowId,
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </MainContainer>
    </div>
  );
};

export default ManageLienWaiverDocumentNames;
