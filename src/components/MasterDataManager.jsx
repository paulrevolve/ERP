import api from "../utils/api";
import React, { useEffect, useState, useMemo } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import XLSX from "xlsx-js-style";
import * as IXLSX from "xlsx";

import {
  Settings2,
  Save,
  Plus,
  Globe,
  Clock,
  ShieldCheck,
  UserRound,
  Search,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  ClipboardPaste,
  Download,
  Upload,
} from "lucide-react";

const MasterDataManager = () => {
  const [activeTab, setActiveTab] = useState("timesheet");
  const [data, setData] = useState([]);
  const [localData, setLocalData] = useState([]);
  const [newRows, setNewRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [findFilterResults, setFindFilterResults] = useState(null); // null means show all
  const rowsPerPage = 15;

  // Find & Replace + Clipboard State
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findReplaceConfig, setFindReplaceConfig] = useState({
    scope: "current",
    column: "",
    findValue: "",
    replaceValue: "",
  });
  const [clipboardData, setClipboardData] = useState(null);

  const isDirty = JSON.stringify(localData) !== JSON.stringify(data);

  console.log(newRows);

  const TABS = {
    timesheet: {
      label: "Timesheet Cycle",
      icon: <Clock size={18} />,
      endpoint: "/api/TimesheetCycle",
      idField: "timesheetCycleId",
      getSuffix: "/GetAll",
      postSuffix: "",
      columns: [
        { key: "timesheetCycleId", label: "Cycle ID" },
        { key: "description", label: "Description" },
        { key: "frequency", label: "Freq" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ],
    },
    visa: {
      label: "Visa Type",
      icon: <Globe size={18} />,
      endpoint: "/api/VisaType",
      idField: "visaTypeCode",
      getSuffix: "/GetAll",
      postSuffix: "",
      columns: [
        { key: "visaTypeCode", label: "Visa Code" },
        { key: "description", label: "Description" },
        { key: "isActive", label: "Active", type: "checkbox" },
      ],
    },
    taxable: {
      label: "Taxable Entity",
      icon: <ShieldCheck size={18} />,
      endpoint: "/api/TaxableEntity",
      idField: "taxableId",
      getSuffix: "/GetAll",
      postSuffix: "/Create",
      columns: [
        { key: "taxableId", label: "ID", type: "number" },
        { key: "taxableName", label: "Entity Name" },
        { key: "taxId", label: "Tax ID" },
        { key: "companyId", label: "Co ID" },
        {
          key: "activeFlag",
          label: "Active",
          type: "booleanChar",
        },
      ],
    },
    race: {
      label: "Race",
      icon: <UserRound size={18} />,
      endpoint: "/api/Race",
      idField: "raceId",
      getSuffix: "/GetAll",
      postSuffix: "/Create",
      columns: [
        { key: "raceId", label: "Race ID" },
        { key: "description", label: "Description" },
        {
          key: "activeFlag",
          label: "Active",
          type: "booleanChar",
        },
      ],
    },
  };

  const currentTab = TABS[activeTab];

  const hasNewRows = newRows.length > 0;
  const hasClipboard = clipboardData !== null && clipboardData.length > 0;
  const showClearAction = isDirty || hasNewRows || hasClipboard;

  let clearButtonText = "Clear All";
  if ((isDirty || hasNewRows) && hasClipboard) {
    clearButtonText = "Clear All";
  } else if (isDirty || hasNewRows) {
    clearButtonText = "Discard Changes";
  } else if (hasClipboard) {
    clearButtonText = "Clear Clipboard";
  }

  const handleGlobalClear = () => {
    if (window.confirm("Discard unsaved changes and clear session?")) {
      setData(JSON.parse(JSON.stringify(localData)));
      setLocalData(JSON.parse(JSON.stringify(data))); // Reset original data as well
      setNewRows([]);
      setClipboardData(null);
      setSelectedRows([]);
      setFindFilterResults(null);
      toast.info("Session cleared.");
    }
  };

  useEffect(() => {
    fetchData();
    setNewRows([]);
    setSelectedRows([]);
    setCurrentPage(1);

    // Find the first column that is NOT the ID field
    const firstEditableCol = currentTab.columns.find(
      (c) => c.key !== currentTab.idField,
    );
    if (firstEditableCol) {
      setFindReplaceConfig((prev) => ({
        ...prev,
        column: firstEditableCol.key,
        findValue: "",
        replaceValue: "",
      }));
    }
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(
        `${backendUrl}${currentTab.endpoint}${currentTab.getSuffix}`,
      );
      const result = Array.isArray(res.data) ? res.data : res.data.data || [];
      setData(result.map((item) => ({ ...item, isDirty: false })));
      setLocalData(result.map((item) => ({ ...item, isDirty: false })));
    } catch (err) {
      toast.error(`Error loading ${currentTab.label}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Copy/Paste Functions ---
  //   const handleCopy = () => {
  //     const selectedItems = [
  //       ...newRows.filter((r) => selectedRows.includes(r.tempId)),
  //       ...data.filter((r) => selectedRows.includes(r[currentTab.idField])),
  //     ];
  //     if (selectedItems.length === 0) return toast.info("Select rows to copy.");
  //     setClipboardData(selectedItems);
  //     toast.info(`${selectedItems.length} row(s) copied.`);
  //   };
  const handleCopy = () => {
    // 1. Gather all selected items from both new and existing data
    const selectedItems = [
      ...newRows.filter((r) => selectedRows.includes(r.tempId)),
      ...data.filter((r) => selectedRows.includes(r[currentTab.idField])),
    ];

    if (selectedItems.length === 0) {
      return toast.info("Select at least one row to copy.");
    }

    // 2. Generate the Header Row (Tab-separated)
    const headerRow = currentTab.columns
      .map((col) => col.header || col.key)
      .join("\t");

    // 3. Generate the Data Rows (Tab-separated)
    const dataRows = selectedItems
      .map((item) =>
        currentTab.columns
          .map((col) => {
            const val = item[col.key];
            // Handle specific types if necessary (like checkboxes)
            if (col.type === "checkbox") return val ? "True" : "False";
            if (col.type === "booleanChar") return val === "Y" ? "Yes" : "No";
            return val ?? "";
          })
          .join("\t"),
      )
      .join("\n");

    // 4. Combine and write to System Clipboard
    const excelString = `${headerRow}\n${dataRows}`;

    navigator.clipboard
      .writeText(excelString)
      .then(() => {
        // 5. Still update internal state for the internal "Paste" button logic
        setClipboardData(selectedItems);
        toast.info(`${selectedItems.length} row(s) copied to clipboard.`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy to clipboard.");
      });
  };

  //   const handlePaste = () => {
  //     if (!clipboardData) return toast.info("Clipboard is empty.");
  //     const pasted = clipboardData.map((item, idx) => ({
  //       ...item,
  //       tempId: `pasted-${Date.now()}-${idx}`,
  //       [currentTab.idField]: currentTab.columns[0].type === "number" ? 0 : "",
  //       isDirty: true,
  //     }));
  //     setNewRows((prev) => [...pasted, ...prev]);
  //     toast.success(`${pasted.length} row(s) pasted.`);
  //   };

  const handlePaste = () => {
    // 1. Validation: Ensure clipboard has array data (matching EmployeeMaster style)
    if (!clipboardData || !Array.isArray(clipboardData)) {
      return toast.info("No data to paste.");
    }

    // 2. Map the data to create new entries
    const entriesToPaste = clipboardData.map((item, index) => {
      // Create a base object from the item
      const newItem = { ...item };

      // 3. Reset the Primary Key (Dynamic idField like 'raceId', 'projectId', etc.)
      // We set it to 0 or "" so the backend treats it as a new record
      const idField = currentTab.idField;
      const firstCol = currentTab.columns.find((c) => c.key === idField);
      newItem[idField] = firstCol?.type === "number" ? 0 : "";

      // 4. Add temporary tracking fields
      return {
        ...newItem,
        tempId: `temp-${Date.now()}-${index}`, // Unique ID for frontend rendering
        isDirty: true, // Mark for the "Save" operation
      };
    });

    // 5. Update state and notify user
    setNewRows((prev) => [...entriesToPaste, ...prev]);
    toast.success(`${entriesToPaste.length} row(s) pasted successfully.`);
  };

  const handleExport = () => {
    if (data.length === 0 && newRows.length === 0) {
      return toast.info("No data available to export.");
    }

    const exportData = [...data, ...newRows].map((item) => {
      const row = {};
      currentTab.columns.forEach((col) => {
        const header = col.header || col.key;
        let value = item[col.key];

        // Format all flag/boolean types to "Yes" or "No"
        if (col.type === "checkbox") {
          value = value ? "Yes" : "No";
        } else if (col.type === "booleanChar") {
          value = value === "Y" ? "Yes" : "No";
        }

        row[header] = value ?? "";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, currentTab.label);
    XLSX.writeFile(workbook, `${currentTab.label}_Export.xlsx`);
    toast.success("Data exported to Excel.");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = IXLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const importedJson = IXLSX.utils.sheet_to_json(sheet);

        setIsLoading(true);
        const failedToSave = [];
        let successCount = 0;

        for (let index = 0; index < importedJson.length; index++) {
          const row = importedJson[index];
          const newEntry = {};

          // 1. Map Excel Headers back to Data Keys
          currentTab.columns.forEach((col) => {
            const header = col.header || col.key;
            let value = row[header];

            console.log(col);

            if (
              (col.key === "companyId" ||
                col.key.toLowerCase().endsWith("id")) &&
              col.key !== "taxableId"
            ) {
              // Force string conversion to prevent Excel scientific notation (e.g., 1.23E+10)
              value =
                value !== undefined && value !== null
                  ? String(value).trim()
                  : "";
            }
            // Convert Excel "Yes/No" or "True/False" back to data types
            const stringVal = String(value || "")
              .trim()
              .toLowerCase();
            const isPositive =
              stringVal === "yes" || stringVal === "true" || stringVal === "y";

            if (col.type === "checkbox") {
              value = isPositive;
            } else if (col.type === "booleanChar") {
              value = isPositive ? "Y" : "N";
            } else if (col.type === "number") {
              value = value ? Number(value) : 0;
            }

            newEntry[col.key] = value;
          });

          // 2. Attempt API Save
          try {
            const payload = { ...newEntry };
            // Ensure we don't send an empty ID if the backend generates it
            if (
              payload[currentTab.idField] === 0 ||
              payload[currentTab.idField] === ""
            ) {
              delete payload[currentTab.idField];
            }

            const response = await api.post(
              `${backendUrl}${currentTab.endpoint}${currentTab.label === "Taxable Entity" || currentTab.label === "Race" ? "/Create" : ""}`,
              payload,
            );

            if (response.status === 200 || response.status === 201) {
              successCount++;
            } else {
              throw new Error("Save failed");
            }
          } catch (err) {
            // 3. If save fails, keep the row for the UI
            failedToSave.push({
              ...newEntry,
              tempId: `fail-${Date.now()}-${index}`,
              isDirty: true,
              isNew: true,
              error: err.response?.data || "Server Error",
            });
          }
        }

        // 4. Update UI State
        if (failedToSave.length > 0) {
          setNewRows((prev) => [...failedToSave, ...prev]);
          toast.error(
            `${failedToSave.length} rows failed to save and are listed below.`,
          );
        }

        if (successCount > 0) {
          toast.success(`Successfully saved ${successCount} records.`);
          fetchData(); // Refresh the main table data
        }
      } catch (error) {
        console.error("Import process error:", error);
        toast.error("Failed to process the import file.");
      } finally {
        setIsLoading(false);
        e.target.value = null; // Reset input
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // const handleFindReplaceExec = (mode = "find") => {
  //   const { scope, column, findValue, replaceValue } = findReplaceConfig;
  //   const activeCol = currentTab.columns.find((c) => c.key === column);

  //   let matchedIds = [];

  //   const checkMatch = (item) => {
  //     const currentVal = String(item[column] ?? "")
  //       .trim()
  //       .toLowerCase();
  //     const normalizedFind = String(findValue).trim().toLowerCase();
  //     return findValue.trim() === ""
  //       ? currentVal === ""
  //       : currentVal === normalizedFind;
  //   };

  //   if (mode === "find") {
  //     // 1. Identify matches from the current data set
  //     const matches = data.filter(checkMatch).map((r) => r[currentTab.idField]);
  //     const newMatches = newRows.filter(checkMatch).map((r) => r.tempId);
  //     const allMatches = [...matches, ...newMatches];

  //     // 2. Filter the table view and select them
  //     setFindFilterResults(allMatches);
  //     setSelectedRows(allMatches); // Shows count in the UI
  //     toast.info(`Found ${allMatches.length} records matching "${findValue}"`);
  //   } else if (mode === "replace") {
  //     // Standard replace logic...
  //     const performUpdate = (item) => {
  //       if (!checkMatch(item)) return item;
  //       if (
  //         scope === "selected" &&
  //         !selectedRows.includes(item[currentTab.idField] || item.tempId)
  //       )
  //         return item;

  //       let finalValue = replaceValue;
  //       if (activeCol.type === "checkbox") finalValue = replaceValue === "true";
  //       return { ...item, [column]: finalValue, isDirty: true };
  //     };

  //     setData((prev) => prev.map((r) => performUpdate(r)));
  //     setNewRows((prev) => prev.map((r) => performUpdate(r)));
  //     setFindFilterResults(null); // Reset filter after replacement
  //     toast.success("Values replaced.");
  //   }
  // };

  // --- handleSave with updatedBy Fix ---

  //  const handleFindReplaceExec = (mode = "find") => {
  //   const { scope, column, findValue, replaceValue, booleanMode } = findReplaceConfig;
  //   const activeCol = currentTab.columns.find((c) => c.key === column);
  //   const isBool = activeCol?.type === "checkbox" || activeCol?.type === "booleanChar";

  //   // Helper to determine if a specific row matches the 'Find' criteria
  //   const checkMatch = (item) => {
  //     // 1. Handle Boolean/Flag Logic
  //     if (isBool) {
  //       const currentValue = activeCol.type === "checkbox"
  //         ? !!item[column]
  //         : item[column] === "Y";

  //       if (booleanMode === "inverted") {
  //         // Invert mode: If findValue is empty, match everything to flip all
  //         if (findValue === "") return true;
  //         const targetBool = activeCol.type === "checkbox" ? findValue === "true" : findValue === "Y";
  //         return currentValue === targetBool;
  //       } else {
  //         // Set All mode: Usually matches everything in the scope to overwrite
  //         return true;
  //       }
  //     }

  //     // 2. Handle Standard Text Logic
  //     const currentVal = String(item[column] ?? "").trim().toLowerCase();
  //     const normalizedFind = String(findValue).trim().toLowerCase();
  //     return findValue.trim() === "" ? currentVal === "" : currentVal.includes(normalizedFind);
  //   };

  //   if (mode === "find") {
  //     const matches = data.filter(checkMatch).map((r) => r[currentTab.idField]);
  //     const newRowsMatches = newRows.filter(checkMatch).map((r) => r.tempId);
  //     const allMatches = [...matches, ...newRowsMatches];

  //     setFindFilterResults(allMatches);
  //     setSelectedRows(allMatches);
  //     toast.info(`Found ${allMatches.length} records.`);
  //   }

  //   else if (mode === "replace") {
  //     const performUpdate = (item) => {
  //       // Check if row is in scope (Selected vs Page)
  //       const itemId = item[currentTab.idField] || item.tempId;
  //       if (scope === "selected" && !selectedRows.includes(itemId)) return item;

  //       // Check if row matches the find criteria
  //       if (!checkMatch(item)) return item;

  //       let finalValue = replaceValue;

  //       if (isBool) {
  //         const currentValue = activeCol.type === "checkbox" ? !!item[column] : item[column] === "Y";

  //         if (booleanMode === "inverted") {
  //           // Flip the current value
  //           const flipped = !currentValue;
  //           finalValue = activeCol.type === "booleanChar" ? (flipped ? "Y" : "N") : flipped;
  //         } else {
  //           // 'Set All' mode uses the selected replaceValue directly
  //           finalValue = activeCol.type === "booleanChar" ? replaceValue : (replaceValue === "true");
  //         }
  //       }

  //       return { ...item, [column]: finalValue, isDirty: true };
  //     };

  //     setData((prev) => prev.map(performUpdate));
  //     setNewRows((prev) => prev.map(performUpdate));

  //     setFindFilterResults(null);
  //     setShowFindReplace(false);
  //     toast.success("Bulk update applied.");
  //   }
  // };

  const handleFindReplaceExec = (mode = "find") => {
    const { scope, column, findValue, replaceValue, booleanMode } =
      findReplaceConfig;
    const activeCol = currentTab.columns.find((c) => c.key === column);
    const isBool =
      activeCol?.type === "checkbox" || activeCol?.type === "booleanChar";

    const checkMatch = (item) => {
      if (isBool) {
        // In "setAll" mode, every row in scope is a match
        if (booleanMode === "setAll") return true;

        // In "inverted" mode, check if current matches target
        const currentValue =
          activeCol.type === "checkbox" ? !!item[column] : item[column] === "Y";
        if (findValue === "") return true; // Matches "All Rows" for inversion
        const targetBool =
          activeCol.type === "checkbox"
            ? findValue === "true"
            : findValue === "Y";
        return currentValue === targetBool;
      }

      // Standard Text Logic
      const currentVal = String(item[column] ?? "")
        .trim()
        .toLowerCase();
      const normalizedFind = String(findValue).trim().toLowerCase();
      return normalizedFind === ""
        ? currentVal === ""
        : currentVal.includes(normalizedFind);
    };

    if (mode === "find") {
      const matches = data.filter(checkMatch).map((r) => r[currentTab.idField]);
      const newRowsMatches = newRows.filter(checkMatch).map((r) => r.tempId);
      const allMatches = [...matches, ...newRowsMatches];

      setFindFilterResults(allMatches);
      setSelectedRows(allMatches);
      toast.info(`Found ${allMatches.length} records.`);
    } else if (mode === "replace") {
      const performUpdate = (item) => {
        const itemId = item[currentTab.idField] || item.tempId;
        // 1. Check Scope
        if (scope === "selected" && !selectedRows.includes(itemId)) return item;
        // 2. Check Match
        if (!checkMatch(item)) return item;

        let finalValue = replaceValue;

        if (isBool) {
          if (booleanMode === "inverted") {
            const currentValue =
              activeCol.type === "checkbox"
                ? !!item[column]
                : item[column] === "Y";
            const flipped = !currentValue;
            finalValue =
              activeCol.type === "booleanChar"
                ? flipped
                  ? "Y"
                  : "N"
                : flipped;
          } else {
            // --- FIXED SET ALL LOGIC ---
            // Since your API uses true/false, we convert the string from the select
            if (activeCol.type === "checkbox") {
              finalValue = replaceValue === "true"; // Converts string "true" to boolean true
            } else {
              finalValue = replaceValue; // Keeps "Y" or "N" for char fields
            }
          }
        }

        return { ...item, [column]: finalValue, isDirty: true };
      };

      setData((prev) => prev.map(performUpdate));
      setNewRows((prev) => prev.map(performUpdate));

      setFindFilterResults(null);
      setShowFindReplace(false);
      toast.success("Bulk update applied.");
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const currentUser = "Admin"; // Or get from your auth context
    try {
      // 1. Create New Records
      for (const row of newRows) {
        const payload = {
          ...row,
          createdBy: currentUser,
          updatedBy: currentUser, // Fixed: Adding required field
        };
        delete payload.tempId;
        delete payload.isDirty;
        if (currentTab.idField === "taxableId")
          payload.taxableId = parseInt(payload.taxableId) || 0;

        await api.post(
          `${backendUrl}${currentTab.endpoint}${currentTab.postSuffix}`,
          payload,
        );
      }

      // 2. Update Existing Records
      const dirtyRows = data.filter((r) => r.isDirty);
      for (const row of dirtyRows) {
        const payload = {
          ...row,
          updatedBy: currentUser, // Fixed: Adding required field
        };
        delete payload.isDirty;

        if (activeTab === "taxable" || activeTab === "race") {
          await api.put(
            `${backendUrl}${currentTab.endpoint}/${row[currentTab.idField]}?modifiedBy=${currentUser}`,
            payload,
          );
        } else if (activeTab === "visa" || activeTab === "timesheet") {
          await api.put(
            `${backendUrl}${currentTab.endpoint}/${row[currentTab.idField]}?UpdatedBy=${currentUser}`,
            payload,
          );
        }
      }

      toast.success("Changes saved successfully");
      setNewRows([]);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.errors?.updatedBy?.[0] ||
          "Save failed. Check required fields.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) return;

    const confirmMessage = `Are you sure you want to delete ${selectedRows.length} selected record(s)?`;
    if (!window.confirm(confirmMessage)) return;

    setIsLoading(true);
    try {
      // 1. Separate unsaved (newRows) from saved (data)
      // newRows use 'tempId', while saved data uses the 'idField' (e.g., raceId)
      const newRowsToDelete = newRows.filter((r) =>
        selectedRows.includes(r.tempId),
      );
      const savedIdsToDelete = selectedRows.filter(
        (id) => !newRowsToDelete.some((nr) => nr.tempId === id),
      );

      // 2. Remove unsaved rows locally immediately
      if (newRowsToDelete.length > 0) {
        setNewRows((prev) =>
          prev.filter((r) => !selectedRows.includes(r.tempId)),
        );
      }

      // 3. Delete saved rows from Database
      if (savedIdsToDelete.length > 0) {
        // Option A: If your backend supports Bulk Delete (Recommended)
        // await api.post(`${backendUrl}${currentTab.endpoint}/BulkDelete`, { ids: savedIdsToDelete });

        // Option B: If you must call delete one-by-one (Standard)
        await Promise.all(
          savedIdsToDelete.map((id) =>
            api.delete(`${backendUrl}${currentTab.endpoint}/${id}`),
          ),
        );
        toast.success(
          `${savedIdsToDelete.length} records deleted from server.`,
        );
      }

      // 4. Cleanup
      setSelectedRows([]);
      setFindFilterResults(null); // Clear the 'Find' filter if active
      fetchData(); // Refresh the grid
    } catch (err) {
      console.error(err);
      toast.error("Delete operation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    // 1. First, apply the global search bar filter (searchTerm)
    let result = data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );

    // 2. If a "Find" operation was performed, filter down to those specific IDs
    if (findFilterResults) {
      result = result.filter((row) =>
        findFilterResults.includes(row[currentTab.idField]),
      );
    }

    return result;
  }, [data, searchTerm, findFilterResults, currentTab.idField]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleLocalChange = (id, field, value, isNew = false) => {
    const updater = isNew ? setNewRows : setData;
    if (field === "frequency") {
      if (value.length > 1) {
        toast.warn("Frequency can only have 1 character");
        return; // Stop the execution so the extra character isn't saved
      }
    }
    updater((prev) =>
      prev.map((r) =>
        (isNew ? r.tempId : r[currentTab.idField]) === id
          ? { ...r, [field]: value, isDirty: true }
          : r,
      ),
    );
  };

  return (
    <div className="p-1 sm:p-2 space-y-2 text-sm sm:text-base text-gray-800 font-inter">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-white rounded-sm p-4">
          <Settings2 size={18} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">
            Master Data - {currentTab.label}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-x-2 items-center">
          {Object.entries(TABS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={` flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors ${
                activeTab === key
                  ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
                  : "text-gray-600 hover:text-gray-800 bg-gray-100"
              }`}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>
      </div>
      {/* Find/Replace Panel */}
      <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
        {showFindReplace && (
          <div className="bg-gray-50 p-4 border border-gray-300 rounded mb-4 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-nowrap items-end gap-4 text-xs ">
              {/* Scope */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600">Apply To:</label>
                <select
                  className="border border-gray-500 outline-none p-1.5 rounded bg-white w-32"
                  value={findReplaceConfig.scope}
                  onChange={(e) =>
                    setFindReplaceConfig({
                      ...findReplaceConfig,
                      scope: e.target.value,
                    })
                  }
                >
                  <option value="current">Entire Page</option>
                  <option value="selected">
                    Selected Rows({selectedRows.length})
                  </option>
                </select>
              </div>

              {/* Column */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600">
                  In Column:
                </label>
                <select
                  className="border outline-none border-gray-500 p-1.5 rounded bg-white w-40"
                  value={findReplaceConfig.column}
                  onChange={(e) =>
                    setFindReplaceConfig({
                      ...findReplaceConfig,
                      column: e.target.value,
                      findValue: "",
                      replaceValue: "",
                    })
                  }
                >
                  {currentTab.columns
                    .filter((c) => c.key !== currentTab.idField)
                    .map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dynamic Inputs Logic */}
              {(() => {
                const activeCol = currentTab.columns.find(
                  (c) => c.key === findReplaceConfig.column,
                );
                const isBool =
                  activeCol?.type === "checkbox" ||
                  activeCol?.type === "booleanChar";

                if (isBool) {
                  // Determine labels based on data type
                  const posLabel =
                    activeCol.type === "checkbox" ? "Yes" : "Yes (Y)";
                  const negLabel =
                    activeCol.type === "checkbox" ? "No" : "No (N)";
                  const posValue = activeCol.type === "checkbox" ? true : "Y";
                  const negValue = activeCol.type === "checkbox" ? false : "N";

                  return (
                    <>
                      {/* Action Type: Set All or Invert */}
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-600">
                          Action:
                        </label>
                        <select
                          className="border outline-none border-gray-500 p-1.5 rounded w-32 bg-white h-8 flex items-center"
                          value={findReplaceConfig.booleanMode}
                          onChange={(e) => {
                            const newMode = e.target.value;
                            setFindReplaceConfig({
                              ...findReplaceConfig,
                              booleanMode: newMode,
                              findValue: "",
                              // Automatically set a default replace value so it's never undefined
                              replaceValue:
                                newMode === "setAll" ? posValue : "",
                            });
                          }}
                        >
                          <option value="setAll">Set All To</option>
                          <option value="inverted">Invert Values</option>
                        </select>
                      </div>

                      {/* Value Selection */}
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-gray-600">
                          {findReplaceConfig.booleanMode === "inverted"
                            ? "Target:"
                            : "To:"}
                        </label>
                        <select
                          className="border outline-none border-gray-500 p-1.5 rounded w-32 bg-white h-8 flex items-center"
                          value={
                            findReplaceConfig.booleanMode === "inverted"
                              ? findReplaceConfig.findValue
                              : findReplaceConfig.replaceValue
                          }
                          onChange={(e) => {
                            if (findReplaceConfig.booleanMode === "inverted") {
                              setFindReplaceConfig({
                                ...findReplaceConfig,
                                findValue: e.target.value,
                              });
                            } else {
                              setFindReplaceConfig({
                                ...findReplaceConfig,
                                replaceValue: e.target.value,
                              });
                            }
                          }}
                        >
                          {findReplaceConfig.booleanMode === "inverted" && (
                            <option value="">All Rows</option>
                          )}
                          <option value={posValue}>{posLabel}</option>
                          <option value={negValue}>{negLabel}</option>
                        </select>
                      </div>
                    </>
                  );
                }

                // ... (Keep your existing text input return for non-boolean columns)
                return (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">
                        Find Value:
                      </label>
                      <input
                        type="text"
                        className="border p-1 rounded h-8 w-32 px-2"
                        placeholder="Text..."
                        value={findReplaceConfig.findValue}
                        onChange={(e) =>
                          setFindReplaceConfig({
                            ...findReplaceConfig,
                            findValue: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">
                        Replace With:
                      </label>
                      <input
                        type="text"
                        className="border p-1 rounded h-8 w-32 px-2"
                        placeholder="Text..."
                        value={findReplaceConfig.replaceValue}
                        onChange={(e) =>
                          setFindReplaceConfig({
                            ...findReplaceConfig,
                            replaceValue: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                );
              })()}

              <div className="flex items-center  gap-2">
                <button
                  onClick={() => handleFindReplaceExec("find")}
                  className="btn1 btn-blue"
                >
                  Find
                </button>

                {findFilterResults && (
                  <button
                    onClick={() => {
                      setFindFilterResults(null);
                      setSelectedRows([]);
                    }}
                    className="btn-1 btn-blue"
                  >
                    <X size={14} /> Clear Filter
                  </button>
                )}

                <button
                  onClick={() => handleFindReplaceExec("replace")}
                  className="btn1 btn-blue"
                >
                  Replace All
                </button>
                <button
                  onClick={() => {
                    setShowFindReplace(false);
                    setHighlightedMatches(new Set());
                  }}
                  className="btn1 btn-blue flex items-center gap-x-1"
                >
                  <X size={14} /> Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className=" flex items-center justify-center mb-2">
          <div className="flex items-center gap-1 w-full flex-nowrap">
            <button
              onClick={() =>
                setNewRows([
                  { tempId: Date.now(), activeFlag: "Y", isActive: true },
                  ...newRows,
                ])
              }
              className="btn1 btn-blue flex items-center gap-x-1"
            >
              <Plus size={14} /> Add Row
            </button>
            {isDirty ||
              (newRows.length > 0 && (
                <button
                  onClick={handleSave}
                  className="btn1 btn-blue flex items-center gap-x-1"
                >
                  <Save size={14} /> Save
                </button>
              ))}
            <button
              onClick={() => setShowFindReplace(!showFindReplace)}
              className="btn1 btn-blue flex items-center gap-x-1"
            >
              Find/Replace
            </button>
            {selectedRows.length > 0 && (
              <button
                onClick={handleCopy}
                className="btn1 btn-blue flex items-center gap-x-1"
                title="Copy Selected"
              >
                <Copy size={16} /> Copy
              </button>
            )}
            {clipboardData != null && (
              <button
                onClick={handlePaste}
                className="btn1 btn-blue flex items-center gap-x-1"
                title="Paste"
              >
                <ClipboardPaste size={16} /> Paste
              </button>
            )}
            {selectedRows.length > 0 && (
              <button
                onClick={handleDelete}
                className="btn1 px-4 py-1.5 btn-red flex items-center gap-x-1"
              >
                <Trash2 size={14} />
                Delete ({selectedRows.length})
              </button>
            )}
            {showClearAction && (
              <button
                onClick={handleGlobalClear}
                className="btn1 btn-blue flex items-center gap-x-1"
              >
                {clearButtonText}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 flex-nowrap">
            <div className="relative w-full sm:w-64">
              {/* <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            /> */}
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Export Button */}
              <button className="btn1 btn-blue flex items-center">
                <Download size={12} /> Import
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImport}
                  className="hidden"
                />
              </button>
              <button
                onClick={handleExport}
                className="btn1 btn-blue flex items-center"
              >
                <Upload size={12} /> Export
              </button>

              {/* Import Button (Hidden input with label as button) */}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[70vh] min-h-[70vh]">
          <table className="min-w-full table-auto divide-gray-200 border border-gray-300 rounded">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="th-thead w-10">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedRows(
                        e.target.checked
                          ? [
                              ...newRows.map((r) => r.tempId),
                              ...currentData.map((r) => r[currentTab.idField]),
                            ]
                          : [],
                      )
                    }
                    checked={
                      selectedRows.length > 0 &&
                      selectedRows.length ===
                        newRows.length + currentData.length
                    }
                  />
                </th>
                {currentTab.columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className="th-thead text-[10px] font-bold text-gray-600 text-center py-1"
                  >
                    {col.label}
                  </th>
                ))}
                {/* <th className="p-2 w-16 text-center">Action</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {newRows.map((row) => (
                <tr key={row.tempId} className="bg-blue-50/40 border-b">
                  <td className="p-1 text-center border-r border-b border-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.tempId)}
                      className="h-3 w-3 accent-blue-600"
                      onChange={() =>
                        setSelectedRows((prev) =>
                          prev.includes(row.tempId)
                            ? prev.filter((i) => i !== row.tempId)
                            : [...prev, row.tempId],
                        )
                      }
                    />
                  </td>
                  {currentTab.columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center"
                    >
                      {renderInput(row, col, true)}
                    </td>
                  ))}
                  {/* <td className="p-1 text-center">
                  <X
                    size={14}
                    className="text-red-400 mx-auto cursor-pointer hover:text-red-600"
                    onClick={() =>
                      setNewRows(newRows.filter((r) => r.tempId !== row.tempId))
                    }
                  />
                </td> */}
                </tr>
              ))}
              {isLoading ? (
                <tr>
                  <td
                    colSpan={currentTab.columns.length + 1}
                    className="text-center py-10"
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentTab.columns.length + 1}
                    className="p-8 text-center text-gray-500"
                  >
                    Search for an account to view the details.
                  </td>
                </tr>
              ) : (
                currentData.map((row) => (
                  <tr
                    key={row[currentTab.idField]}
                    className={`${selectedRows.includes(row[currentTab.idField]) ? "bg-blue-50" : "hover:bg-gray-50"} border-b`}
                  >
                    <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 min-w-[50px] text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row[currentTab.idField])}
                        onChange={() =>
                          setSelectedRows((prev) =>
                            prev.includes(row[currentTab.idField])
                              ? prev.filter(
                                  (i) => i !== row[currentTab.idField],
                                )
                              : [...prev, row[currentTab.idField]],
                          )
                        }
                      />
                    </td>
                    {currentTab.columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 min-w-[50px] text-center"
                      >
                        {renderInput(row, col, false)}
                      </td>
                    ))}
                    {/* <td className="p-1 text-center">
                  <button
                    onClick={() => handleDelete(row[currentTab.idField])}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center bg-white p-3 border-x border-b border-gray-200 rounded-b-md shadow-sm">
          <div className="text-gray-500">
            Showing{" "}
            <b>
              {Math.min(
                filteredData.length,
                (currentPage - 1) * rowsPerPage + 1,
              )}
            </b>{" "}
            to <b>{Math.min(currentPage * rowsPerPage, filteredData.length)}</b>{" "}
            of <b>{filteredData.length}</b> records
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1 border rounded disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded border ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-50"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 border rounded disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function renderInput(row, col, isNew) {
    const id = isNew ? row.tempId : row[currentTab.idField];
    if (col.type === "checkbox" || col.type === "booleanChar") {
      const isChecked =
        col.type === "checkbox" ? row[col.key] : row[col.key] === "Y";
      return (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={isChecked || false}
            className="h-3 w-3 accent-blue-600"
            onChange={(e) =>
              handleLocalChange(
                id,
                col.key,
                col.type === "checkbox"
                  ? e.target.checked
                  : e.target.checked
                    ? "Y"
                    : "N",
                isNew,
              )
            }
          />
        </div>
      );
    }
    return (
      <input
        type={col.type === "number" ? "number" : "text"}
        value={row[col.key] ?? ""}
        readOnly={!isNew && col.key === currentTab.idField}
        onChange={(e) => handleLocalChange(id, col.key, e.target.value, isNew)}
        className={`                         text-xs   className="w-full p-1 border border-gray-300 rounded bg-white`}
      />
    );
  }
};

export default MasterDataManager;
