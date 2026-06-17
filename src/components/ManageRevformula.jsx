import api from "../utils/api";
import React, { useEffect, useState } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import {
  BriefcaseBusiness,
  ClipboardPaste,
  ClockFading,
  Copy,
  Plus,
  Scissors,
} from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Select from "react-select";
// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";
import * as IXLSX from "xlsx";
import ManageRevFormulaForm from "./ManageRevFormulaForm";

const ManageRevformula = ({ canEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedRev, setselectedRev] = useState(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1); // Update this from your API response
  const [goToValue, setGoToValue] = useState("");
  const [localData, setLocalData] = useState([]);
  const [clipboard, setClipboard] = useState({});
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [showFormPopup, setShowFormPopup] = useState(false);

  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findReplaceConfig, setFindReplaceConfig] = useState({
    scope: "current", // "all", "current", "selected"
    column: "formulaDesc",
    findValue: "",
    replaceValue: "",
  });

  // const backendUrl = "https://rai-addmasters.onrender.com";

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Column keys based on your C# 'Account' model
  const [columns] = useState(["formulaCd", "formulaDesc", "awardFeeFl"]);

  const COLUMN_LABELS = {
    formulaCd: "Revenue ID",
    formulaDesc: "Description",
    awardFeeFl: "Active",
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleGoTo = (e) => {
    if (e.key === "Enter") {
      const val = parseInt(goToValue);
      if (val >= 1 && val <= totalPages) {
        setCurrentPage(val);
        setGoToValue("");
      }
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const showEdit = selectedRows.size === 1;
  const showDelete = selectedRows.size >= 1;
  const showCopy = selectedRows.size >= 1;
  // Check if the current table state differs from the last saved/fetched state
  const isDirty = JSON.stringify(localData) !== JSON.stringify(data);
  // Check if there is anything currently in the clipboard
  const hasClipboard = clipboard && clipboard.length > 0;

  const showClearAll = isDirty || hasClipboard;
  // Add these helper variables before your return statement
  const hasUnsavedChanges = localData.some((row) => row.isDirty || row.isNew);

  let clearButtonText = "Clear All";
  if (hasUnsavedChanges && hasClipboard) {
    clearButtonText = "Clear All";
  } else if (hasUnsavedChanges) {
    clearButtonText = "Discard Changes";
  } else if (hasClipboard) {
    clearButtonText = "Clear Clipboard";
  }

  const handleSearch = async () => {
    const term = searchTerm.trim();
    try {
      setIsLoading(true);
      setSelectedRows(new Set());

      // Construct the URL with current pagination state
      // const url = `${backendUrl}/api/PlcCodes/SearchPlcCodes?${term ? `search=${term}&` : ``}sortBy=CodeId&sortOrder=asc&page=${currentPage}&pageSize=${pageSize}`;
      const url = `${backendUrl}/RevFormula`;

      const res = await api.get(url);

      // MAPPING LOGIC:
      // res.data is the whole object { totalRecords: 2, data: [...] }
      if (res.data) {
        setData(res.data);
        setLocalData(res.data);
        // Calculate total pages dynamically
        const total = res.data.totalRecords || 0;
        setTotalPages(Math.ceil(total / pageSize) || 1);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Rev not found.";
      toast.error(msg);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(1); // Reset to first page on new search
    setSearchTrigger((prev) => prev + 1); // Flip the trigger to fire useEffect
  };

  useEffect(() => {
    // if (searchTrigger === 0) return;
    handleSearch();
  }, [currentPage, pageSize, searchTrigger]);

  const toggleRow = (item) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item.id || item.formulaCd)) {
        newSet.delete(item.id || item.formulaCd);
      } else {
        newSet.add(item.id || item.formulaCd);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((d) => d.id || d.formulaCd)));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${selectedRows.size} Rev(s)?`)) return;

    setIsDeleting(true);
    try {
      for (let id of selectedRows) {
        await api.delete(`${backendUrl}/RevFormula/${id}`);
      }
      toast.success("PLC Deleted Successfully!");
      setSelectedRows(new Set());
      handleSearch();
    } catch (error) {
      const msg = "Error during deletion.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // if (!canEdit("manageAccount")) return;
    const id = [...selectedRows][0];
    const RevToEdit = data.find((item) => item.formulaCd === id);
    setselectedRev(RevToEdit);
    setEditPopup(true);
  };

  const handleNewRow = () => {
    const newEntry = {
      // Use a temporary unique ID so React can track this specific row
      id: `new_${Date.now()}_${Math.random()}`,
      displayId: "",
      formulaCd: `TEMP_${Date.now()}`,
      formulaDesc: "",
      awardFeeFl: false,
      isNew: true,
      isDirty: true,
    };
    setLocalData([newEntry, ...localData]);
  };

  const handleCopy = () => {
    // 1. Filter the data based on selected rows
    const selectedData = localData.filter((item) =>
      selectedRows.has(item.id || item.formulaCd),
    );

    if (selectedData.length === 0) {
      toast.warn("No rows selected to copy");
      return;
    }

    // 2. Define the columns you want to include in the copy (matches your table order)
    const columns = ["formulaCd", "formulaDesc", "awardFeeFl"];

    // 3. Create the Header Row (Tab-separated)
    const headerRow = columns.join("\t");

    // 4. Create the Data Rows (Tab-separated)
    const dataRows = selectedData
      .map((item) =>
        columns
          .map((col) => {
            const value = item[col];
            // Handle null/undefined so they appear as empty strings in Excel
            return value === null || value === undefined ? "" : value;
          })
          .join("\t"),
      )
      .join("\n");

    // 5. Combine Header and Data
    const fullText = `${headerRow}\n${dataRows}`;

    // 6. Copy to System Clipboard
    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        // Also keep your internal state clipboard if you use it for internal "Paste"
        setClipboard(selectedData);
        toast.success(`${selectedData.length} rows copied`);
      })
      .catch((err) => {
        toast.error("Failed to copy to clipboard");
        console.error(err);
      });
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Clipboard is empty");
    const pastedRows = clipboard.map((row, index) => ({
      ...row,
      id: `new_${Date.now()}_${Math.random()}`,
      formulaCd: ``,
      isNew: true,
    }));
    setLocalData([...pastedRows, ...localData]);
    toast.success(`${pastedRows.length} rows pasted`);
  };

  const handleClearAll = async () => {
    try {
      const hasUnsaved = localData.some((row) => row.isDirty || row.isNew);
      const hasClip = clipboard && clipboard.length > 0;

      let message = "Are you sure?";
      if (hasUnsaved && hasClip)
        message = "Discard all unsaved changes and clear clipboard?";
      else if (hasUnsaved) message = "Discard all unsaved changes?";
      else if (hasClip) message = "Clear copied rows from clipboard?";

      if (window.confirm(message)) {
        // 1. Reset data to original API state
        setLocalData(data);

        // 2. Clear Clipboard
        setClipboard([]);
        await navigator.clipboard.writeText("");
        // 3. Reset selections
        setSelectedRows(new Set());

        toast.info("Cleared successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLocalChange = (idOrCode, field, value) => {
    setLocalData((prev) =>
      prev.map((item) => {
        // Match by the temporary 'id' (for new rows) or the 'formulaCd' (for existing)
        if (item.id === idOrCode || item.formulaCd === idOrCode) {
          return {
            ...item,
            [field]: value, // value will be boolean for 'active' or string for 'description'
            isDirty: true,
          };
        }
        return item;
      }),
    );
  };

  const handleExport = (apiResponse) => {
    const rawData = apiResponse || [];
    if (rawData.length === 0) {
      toast.info("No data available to export");
      return;
    }

    const COLUMN_LABELS = {
      formulaCd: "Revenue ID",
      formulaDesc: "Description",
      awardFeeFl: "Active",
    };

    setIsExporting(true);
    try {
      // 2. Map the data and convert boolean/flags to Yes/No
      const formattedRows = rawData.map((item) => {
        const row = {};
        columns.forEach((col) => {
          const label = COLUMN_LABELS[col] || col;
          const val = item[col];

          if (col === "awardFeeFl") {
            // Check for all "True" cases: boolean true, string "true", or string "Y"
            const isActive =
              val === true ||
              String(val).toUpperCase() === "TRUE" ||
              String(val).toUpperCase() === "Y" ||
              String(val).toUpperCase() === "YES";

            row[label] = isActive ? "Yes" : "No";
          } else {
            row[label] = val === null || val === undefined ? "" : val;
          }
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(formattedRows);

      // 3. Define Styles
      const headerStyle = {
        fill: { fgColor: { rgb: "17414D" } },
        font: { color: { rgb: "FFFFFF" }, bold: true, sz: 11 },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };

      const bodyStyle = {
        font: { sz: 10, color: { rgb: "333333" } },
        alignment: { horizontal: "left", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "D1D5DB" } },
          bottom: { style: "thin", color: { rgb: "D1D5DB" } },
          left: { style: "thin", color: { rgb: "D1D5DB" } },
          right: { style: "thin", color: { rgb: "D1D5DB" } },
        },
      };

      // 4. Apply Styles
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;

          // Apply header style to row 0, body style to others
          ws[cellRef].s = R === 0 ? headerStyle : bodyStyle;

          // Optional: Make "Yes" Green and "No" Red
          if (R > 0) {
            const cellValue = ws[cellRef].v;
            if (cellValue === "Yes") {
              ws[cellRef].s = { ...bodyStyle, font: { ...bodyStyle.font } };
            } else if (cellValue === "No") {
              ws[cellRef].s = { ...bodyStyle, font: { ...bodyStyle.font } };
            }
          }
        }
      }

      // 5. Column Widths
      ws["!cols"] = columns.map((col) => {
        if (col === "formulaDesc") return { wch: 50 };
        if (col === "awardFeeFl") return { wch: 12 };
        return { wch: 20 };
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Revenue Formula");

      const dateStr = new Date().toISOString().split("T")[0];
      XLSX.writeFile(wb, `Revenue_Formula_${dateStr}.xlsx`);

      toast.success("Export successful");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = IXLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonRows = IXLSX.utils.sheet_to_json(worksheet);

        const importedData = [];
        const validationErrors = [];

        // --- STAGE 1: DATA MAPPING & VALIDATION ---
        jsonRows.forEach((row, index) => {
          const formulaCd = String(row["Revenue ID"] || "").trim();
          const formulaDesc = String(row["Description"] || "").trim();
          const awardFeeFl = String(row["Active"] || "")
            .trim()
            .toLowerCase();

          if (!formulaCd) return;

          // Map Excel data to PLC State structure
          importedData.push({
            id: `new_${Date.now()}_${index}`, // Unique temp ID for the grid
            formulaCd: formulaCd,
            displayId: formulaCd, // Used for the "ID" column input
            formulaDesc: formulaDesc,
            // Handle "Yes", "Y", or true as boolean true
            awardFeeFl:
              awardFeeFl === "yes" ||
              awardFeeFl === "y" ||
              awardFeeFl === "true",
            isNew: true,
            isDirty: true,
            modifiedBy: user?.name || "system_import",
          });
        });

        if (importedData.length === 0) {
          return toast.info("No valid Rev records found in file.");
        }

        // --- STAGE 2: BULK SAVE (Flat structure, no levels) ---
        setIsImporting(true);
        const successfulKeys = [];
        const saveErrors = [];

        // Process all rows in parallel (or sequential if your API prefers)
        for (const row of importedData) {
          try {
            const payload = {
              formulaCd: row.formulaCd,
              formulaDesc: row.formulaDesc,
              awardFeeFl: row.awardFeeFl,
              modifiedBy: row.modifiedBy,
            };

            const response = await api.post(
              `${backendUrl}/RevFormula`,
              payload,
            );

            if (response.status === 200 || response.status === 201) {
              successfulKeys.push(row.id);
            }
          } catch (err) {
            saveErrors.push(
              `${row.formulaCd}: ${err.response?.data?.message || "Save Failed"}`,
            );
          }
        }

        // --- STAGE 3: UI RECOVERY ---
        // Only keep rows that FAILED in the local grid for the user to fix
        const failedRows = importedData.filter(
          (row) => !successfulKeys.includes(row.id),
        );

        setLocalData((prev) => [...failedRows, ...prev]);

        if (successfulKeys.length > 0) {
          toast.success(
            `Saved ${successfulKeys.length} Rev records successfully.`,
          );
          setIsImporting(false);
        }
        if (saveErrors.length > 0) {
          toast.error(
            `${saveErrors.length} records failed and remain in the grid.`,
          );
          console.error("Import Errors:", saveErrors);
          setIsImporting(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Import Error:", error);
      toast.error("An error occurred during import.");
    } finally {
      setIsImporting(false);
      e.target.value = ""; // Reset file input
    }
    setIsImporting(false);
  };

  const handleBulkSave = async () => {
    const rowsToSave = localData.filter((row) => row.isNew || row.isDirty);
    if (rowsToSave.length === 0) return toast.info("No changes to save.");

    const newCount = rowsToSave.filter((r) => r.isNew).length;
    const updateCount = rowsToSave.filter((r) => r.isDirty && !r.isNew).length;

    // 2. Build Confirmation Message
    let message = "";
    if (newCount > 0 && updateCount > 0) {
      message = `Save ${newCount} new Rev entries and update ${updateCount} existing ones?`;
    } else if (newCount > 0) {
      message = `Save ${newCount} new Rev entry${newCount > 1 ? "s" : ""}?`;
    } else {
      message = `Update ${updateCount} Rev record${updateCount > 1 ? "s" : ""}?`;
    }

    if (window.confirm(message)) {
      setIsLoading(true);

      // 3. Map rows to API promises
      const savePromises = rowsToSave.map((row) => {
        // Ensure we use the correct code for the payload
        const revId = row.isNew ? row.displayId : row.formulaCd;

        const payload = {
          formulaCd: revId,
          formulaDesc: row.formulaDesc,
          awardFeeFl: row.awardFeeFl, // This is already a boolean from our Yes/No logic
          modifiedBy: user?.name || "system",
        };

        // Determine POST (New) or PUT (Update)
        const request = row.isNew
          ? api.post(`${backendUrl}/RevFormula`, payload)
          : api.put(`${backendUrl}/RevFormula/${row.formulaCd}`, payload);

        return request
          .then(() => ({
            status: "success",
            // Use a consistent key to identify the row in the grid later
            key: row.id || row.formulaCd,
          }))
          .catch((err) => ({
            status: "error",
            key: row.id || row.formulaCd,
            error: err,
          }));
      });

      try {
        // 4. Execute all requests
        const results = await Promise.all(savePromises);

        const successfulKeys = results
          .filter((r) => r.status === "success")
          .map((r) => r.key);

        const errors = results.filter((r) => r.status === "error");

        // 5. UI Update: Remove successfully saved rows from the "Dirty/New" local list
        setLocalData((prev) =>
          prev.filter(
            (row) => !successfulKeys.includes(row.id || row.formulaCd),
          ),
        );

        // 6. Feedback to User
        if (successfulKeys.length > 0) {
          toast.success(
            `Successfully saved ${successfulKeys.length} Rev records.`,
          );
        }

        if (errors.length > 0) {
          console.error("Bulk Save Errors:", errors);
          const errorMsg =
            errors[0].error.response?.data?.message ||
            errors[0].error?.message ||
            "Error saving some records.";
          toast.error(`${errors.length} failed: ${errorMsg}`);
        } else {
          // If everything was successful, refresh the master list
          handleSearch();
        }
      } catch (error) {
        console.error("Unexpected Save Error:", error);
        toast.error("An unexpected error occurred during the save process.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFindReplace = () => {
    const {
      scope,
      column,
      findYear, // This is your 'Find Value' from the UI
      replaceValue,
      booleanMode,
    } = findReplaceConfig;

    if (!window.confirm(`Apply changes to ${scope} Rev rows?`)) return;

    setLocalData((prev) => {
      return prev.map((item) => {
        const isSelected = selectedRows.has(item.id || item.formulaCd);
        if (scope === "selected" && !isSelected) return item;

        let rowChanged = false;
        let updatedItem = { ...item };

        if (column === "awardFeeFl") {
          // 1. Get current state as a strict boolean
          const currentValue = !!item[column];
          let targetValue = currentValue;

          if (booleanMode === "inverted" || booleanMode === "invert") {
            // 2. Convert the UI string ("Yes"/"No") to a boolean for comparison
            // If findYear is empty ("All"), isMatch is always true
            const findBool =
              findYear === "Yes" ? true : findYear === "No" ? false : null;
            const isMatch = findYear === "" || currentValue === findBool;

            if (isMatch) {
              targetValue = !currentValue; // Flip it
              rowChanged = true;
            }
          } else {
            // Standard "Set All To" logic
            targetValue = replaceValue === "Yes";
            if (currentValue !== targetValue) {
              rowChanged = true;
            }
          }
          updatedItem[column] = targetValue;
        }
        // ... rest of your text logic (Description)
        else {
          const currentValue = String(item[column] || "");
          if (findYear === "" || currentValue === findYear) {
            if (item[column] !== replaceValue) {
              updatedItem[column] = replaceValue;
              rowChanged = true;
            }
          }
        }

        return rowChanged ? { ...updatedItem, isDirty: true } : item;
      });
    });

    setShowFormPopup(false);
    toast.success("Inversion applied successfully.");
  };

  const handleFilterOnly = () => {
    const { column, findYear, findMonth } = findReplaceConfig;

    // If "Find" inputs are empty, we just show everything
    if (!findYear && !findMonth) {
      handleSearch(); // Triggers your original search to reset view
      return;
    }

    setLocalData((prev) => {
      return prev.filter(
        (item) => {
          // if (column === "startDate" || column === "endDate") {
          //   const fyKey = column === "startDate" ? "fyCdFrom" : "fyCdTo";
          //   const pdKey = column === "startDate" ? "pdNoFrom" : "pdNoTo";

          //   const currentYY = String(item[fyKey] || "");
          //   const currentMM = String(item[pdKey] || "");

          //   const yearMatch = findYear === "" || currentYY === findYear;
          //   const monthMatch =
          //     findMonth === "" || currentMM === String(Number(findMonth));
          //   return yearMatch && monthMatch;
          // } else {
          // Standard text filter
          const currentValue = String(item[column] || "").toLowerCase();
          return currentValue.includes(findYear.toLowerCase());
        },
        // }
      );
    });
  };

  return (
    <div className="p-1 sm:p-2 space-y-2 text-sm sm:text-base text-gray-800 font-inter">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-2 bg-white rounded-sm p-4">
          <BriefcaseBusiness size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">Manage Revenue</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full sm:w-auto">
          <label className="input-label">Revenue ID:</label>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              autoComplete="off"
            />
          </div>
          <button
            onClick={handleSearchClick}
            className="btn1 btn-blue cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
        {showFormPopup && (
          <div className="bg-gray-50 p-4 border border-gray-300 rounded mb-4 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-wrap items-end gap-4 text-xs">
              {/* Scope Selection */}
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
                  <option value="current">Current Page</option>
                  <option value="selected">
                    Selected ({selectedRows.size})
                  </option>
                </select>
              </div>

              {/* Column Selection */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600">
                  In Column:
                </label>
                <select
                  className="border outline-none border-gray-500 p-1.5 rounded bg-white w-40"
                  value={findReplaceConfig.column}
                  onChange={(e) => {
                    const col = e.target.value;
                    setFindReplaceConfig({
                      ...findReplaceConfig,
                      column: col,
                      findYear: "", // Using existing state keys for consistency
                      replaceValue: col === "awardFeeFl" ? "Yes" : "",
                      booleanMode: "setAll",
                    });
                  }}
                >
                  <option value="" disabled>
                    -- Select Column --
                  </option>
                  <option value="formulaDesc">Description</option>
                  <option value="awardFeeFl">Active Status</option>
                </select>
              </div>

              {/* DYNAMIC INPUTS SECTION */}
              {findReplaceConfig.column === "awardFeeFl" ? (
                /* BOOLEAN / ACTIVE SECTION */
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-gray-600">Action:</label>
                  <div className="flex gap-2">
                    <select
                      className="border outline-none border-gray-500 p-1.5 rounded w-28 bg-white"
                      value={findReplaceConfig.booleanMode}
                      onChange={(e) =>
                        setFindReplaceConfig({
                          ...findReplaceConfig,
                          booleanMode: e.target.value,
                          replaceValue:
                            e.target.value === "setAll" ? "Yes" : "",
                          findYear: "",
                        })
                      }
                    >
                      <option value="setAll">Set All To</option>
                      <option value="inverted">Invert Values</option>
                    </select>

                    <select
                      className="border outline-none border-gray-500 p-1.5 rounded w-20 bg-white"
                      value={
                        findReplaceConfig.booleanMode === "inverted"
                          ? findReplaceConfig.findYear
                          : findReplaceConfig.replaceValue
                      }
                      onChange={(e) => {
                        if (findReplaceConfig.booleanMode === "inverted") {
                          setFindReplaceConfig({
                            ...findReplaceConfig,
                            findYear: e.target.value,
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
                        <option value="">All</option>
                      )}
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              ) : (
                /* STANDARD TEXT SECTION (Description) */
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Find Value:
                    </label>
                    <input
                      type="text"
                      placeholder="Search text..."
                      className="border outline-none border-gray-500 p-1.5 rounded w-40"
                      value={findReplaceConfig.findYear}
                      onChange={(e) =>
                        setFindReplaceConfig({
                          ...findReplaceConfig,
                          findYear: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="pb-2 font-bold text-gray-400">→</div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Replace With:
                    </label>
                    <input
                      type="text"
                      placeholder="New text..."
                      className="border outline-none border-gray-500 p-1.5 rounded w-40"
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
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-auto border-l pl-4 border-gray-300">
                {/* Only show Find for text columns */}
                {findReplaceConfig.column !== "awardFeeFl" && (
                  <button onClick={handleFilterOnly} className="btn1 btn-blue">
                    Find
                  </button>
                )}

                <button onClick={handleFindReplace} className="btn1 btn-blue">
                  Execute
                </button>

                <button
                  onClick={() => {
                    handleSearch();
                    setShowFormPopup(false);
                  }}
                  className="btn1 btn-blue"
                >
                  Reset & Close
                </button>
              </div>
            </div>
          </div>
        )}
        <div className=" flex items-center justify-center mb-2">
          <div className="flex items-center gap-1 w-full flex-nowrap">
            {/* {canEdit("manageOrg") && ( */}
            <button
              onClick={handleNewRow}
              className="btn1 btn-blue flex items-center gap-1"
            >
              New
            </button>

            {isDirty && (
              <button
                onClick={handleBulkSave}
                className="btn1 btn-blue text-white flex items-center gap-1"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            )}
            <button
              onClick={() => setShowFormPopup((prev) => !prev)}
              className="btn1 btn-blue shrink-0"
            >
              {showFormPopup ? "Close Find/Replace" : "Find/Replace"}
            </button>

            <div
              className={`flex gap-1 items-center ${showDelete ? "inline-flex" : "hidden"}`}
            >
              {/* {showEdit && canEdit("manageOrg") && ( */}
              {showEdit && (
                <button className="btn1 btn-blue " onClick={handleEdit}>
                  Edit
                </button>
              )}
              <button
                onClick={handleCopy}
                className="btn1 btn-blue text-white flex items-center gap-1"
              >
                <Copy size={14} /> Copy
              </button>
              {clipboard.length > 0 && (
                <button
                  onClick={handlePaste}
                  className="btn1 btn-blue text-white flex items-center "
                >
                  <ClipboardPaste size={14} /> Paste ({clipboard.length})
                </button>
              )}
              {/* {canEdit("manageOrg") && ( */}
              {/* {canEdit("manageOrg") && ( */}
              <button
                onClick={handleDelete}
                className="btn1 px-4 py-1.5 btn-red"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : `Delete (${selectedRows.size})`}
              </button>
              {/* )} */}
            </div>

            {showClearAll && (
              <button
                onClick={handleClearAll}
                className="btn1 btn-blue text-white flex items-center gap-1 transition-all"
              >
                {clearButtonText}
              </button>
            )}
          </div>
          <div className="flex gap-x-2 items-center justify-center">
            <input
              type="file"
              id="excel-import"
              className="hidden"
              accept=".xlsx, .xls"
              onChange={handleImport}
            />

            <button
              onClick={() => document.getElementById("excel-import").click()}
              disabled={isLoading}
              className="btn1 btn-blue cursor-pointer flex items-center"
              title="Import from Excel"
              disable={isExporting}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4"
                />
              </svg>
              {isImporting ? "Importing" : "Import"}
            </button>

            <button
              onClick={() => handleExport(localData)}
              type="button"
              className="btn1 btn-blue cursor-pointer flex items-center"
              title="Export to Excel"
              disable={isExporting}
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              {isExporting ? "Exporting" : "Export"}
            </button>
          </div>
        </div>

        <div className="rounded border border-gray-200 overflow-hidden relative">
          {/* Create/Edit Popups */}

          {(showNewPopup || editPopup) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Modal Container: Sets the boundaries */}
              <div className="relative bg-white w-full max-w-5xl h-fit max-h-[95vh] min-h-[55vh]  lg:max-h-[90vh] flex flex-col animate-premium-popup shadow-2xl rounded-lg overflow-hidden">
                <ManageRevFormulaForm
                  onClose={() => {
                    setShowNewPopup(false);
                    setEditPopup(false);
                  }}
                  selectedRev={editPopup ? selectedRev : null}
                  onSaveSuccess={() => {
                    handleSearch();
                    setShowNewPopup(false);
                    setEditPopup(false);
                  }}
                />
              </div>
            </div>
          )}

          <div
            className={`overflow-x-auto max-h-[70vh] min-h-[70vh] ${showNewPopup ? "pointer-events-none" : ""}`}
          >
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  {/* {canEdit("manageOrg") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="accent-blue-600"
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    const isRequired = ["formulaCd", "formulaDesc"].includes(
                      col,
                    );

                    return (
                      <th
                        key={col}
                        className="th-thead text-[10px] font-bold text-gray-600 text-center py-1"
                      >
                        <div className="flex items-center gap-1">
                          {/* {isFlagColumn && (
                            <input
                              type="checkbox"
                              className="cursor-pointer h-3 w-3 accent-blue-600"
                              // Header is checked only if EVERY row in the table is "Y"
                              checked={
                                localData.length > 0 &&
                                localData.every((item) => item[col] === "Y")
                              }
                              onChange={() => toggleAllFlags(col)}
                            />
                          )} */}
                          <div className="flex">
                            <span>{COLUMN_LABELS[col] || col}</span>
                            <span className="text-red-500">
                              {isRequired ? "*" : ""}
                            </span>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                  {/* <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Action
                    </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="text-center py-10"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="p-8 text-center text-gray-500"
                    >
                      Search for an Revenue to view the details.
                    </td>
                  </tr>
                ) : (
                  localData.map((item) => {
                    // const isRestrictedLevel = item.lvlNo < maxlevel;
                    const isRestrictedLevel = false;
                    return (
                      <tr
                        key={item.id || item.formulaCd}
                        className={`${selectedRows.has(item.formulaCd) || item.isNew ? "bg-blue-50" : ""}  hover:bg-gray-50 transition-colors`}
                      >
                        <td
                          className={`p-1 text-center border-r border-b border-gray-300 `}
                        >
                          <input
                            type="checkbox"
                            // Use item.id if you implemented the unique temporary ID, otherwise item.formulaCd
                            checked={selectedRows.has(
                              item.id || item.formulaCd,
                            )}
                            className={`h-3 w-3 accent-blue-600 ${
                              item.isNew
                                ? "cursor-not-allowed opacity-50 grayscale"
                                : "cursor-pointer"
                            }
                              `}
                            onChange={() => {
                              if (item.isNew) return; // Guard clause to prevent selection of new rows
                              const uniqueKey = item.id || item.formulaCd;
                              const newSet = new Set(selectedRows);
                              newSet.has(uniqueKey)
                                ? newSet.delete(uniqueKey)
                                : newSet.add(uniqueKey);
                              setSelectedRows(newSet);
                            }}
                            // Correct attribute name is 'disabled'
                            disabled={item.isNew}
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 rounded outline-none ${item.isNew ? "border border-gray-300 rounded bg-white " : ""}`}
                            // Show displayId for new rows so it starts empty; show acctId for existing rows
                            value={
                              item.isNew ? item.displayId : item.formulaCd || ""
                            }
                            readOnly={!item.isNew}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.formulaCd,
                                item.isNew ? "displayId" : "formulaCd",
                                e.target.value,
                              )
                            }
                            placeholder={item.isNew ? "Enter ID..." : ""}
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className="w-full p-1 border border-gray-300 rounded bg-white"
                            value={item.formulaDesc}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.formulaCd,
                                "formulaDesc",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        {["awardFeeFl"].map((field) => (
                          <td
                            key={field}
                            className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center"
                          >
                            <input
                              type="checkbox"
                              className="h-3 w-3 accent-blue-600"
                              checked={item[field]}
                              disabled={
                                isRestrictedLevel
                                // (field === "projectRequiredFlag" &&
                                //   !item.isNew)
                              }
                              onChange={(e) =>
                                handleLocalChange(
                                  item.id || item.formulaCd,
                                  field,
                                  e.target.checked,
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {
            <div className="w-full bg-[#e5f3fb] text-white flex items-center justify-center ">
              <div className="flex items-center justify-end gap-2 px-4 py-2  border-gray-100 w-fit ml-auto mb-1 text-sm text-gray-900">
                {/* Left Arrow */}
                <button
                  onClick={() => handlePageClick(currentPage - 1)}
                  className="text-[#17414d] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page Numbers with Ellipsis Logic */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    const showMax = 5; // Adjustment for number of visible page buttons
                    if (totalPages <= showMax + 2) {
                      // If total pages are few, show all of them
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      // Logic for large page counts (like 50)
                      pages.push(1); // Always show first page

                      if (currentPage > 3) {
                        pages.push("...");
                      }

                      // Show pages around the current page
                      let start = Math.max(2, currentPage - 1);
                      let end = Math.min(totalPages - 1, currentPage + 1);

                      // Keep a consistent number of buttons when at the edges
                      if (currentPage <= 2) end = 4;
                      if (currentPage >= totalPages - 1) start = totalPages - 3;

                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push("...");
                      }

                      pages.push(totalPages); // Always show last page
                    }

                    return pages.map((page, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof page === "number" && handlePageClick(page)
                        }
                        disabled={page === "..."}
                        className={`w-8 h-8 flex items-center cursor-pointer justify-center rounded-full transition-all ${
                          currentPage === page
                            ? "bg-[#17414d] text-white font-bold "
                            : page === "..."
                              ? "cursor-default text-gray-400"
                              : "hover:bg-white hover:text-[#17414d]"
                        }`}
                      >
                        {page}
                      </button>
                    ));
                  })()}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={() => handlePageClick(currentPage + 1)}
                  className="text-[#17414d] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} />
                </button>

                {/* Page Size Select */}
                <div className="relative flex items-center rounded px-2 bg-white transition-colors">
                  {/* bg-[#17414d] */}
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-transparent py-1 pr-4 pl-1 
                          focus:outline-none cursor-pointer text-black"
                  >
                    <option value={15} className="text-black bg-white">
                      15 / page
                    </option>
                    <option value={25} className="text-black bg-white">
                      25 / page
                    </option>
                    <option value={35} className="text-black bg-white">
                      35 / page
                    </option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="absolute right-2 text-gray-400 pointer-events-none"
                  />
                </div>

                {/* Go To Input */}
                <div className="flex items-center gap-2 ml-2">
                  <span className="text-black font-semibold">Go to</span>
                  <input
                    type="text"
                    value={goToValue}
                    onChange={(e) =>
                      setGoToValue(e.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={handleGoTo}
                    placeholder="#"
                    className="w-12 border border-gray-200 outline-none bg-white rounded py-1 text-center transition-all "
                  />
                  <span className="text-black font-semibold">Page</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ManageRevformula;
