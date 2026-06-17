import api from "../utils/api";
import React, { useEffect, useState } from "react";
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
import AccountTypeMasterForm from "./AccountTypeMasterForm";

const AccountTypeMaster = ({ canEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedAcctType, setselectedAcctType] = useState(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1); // Update this from your API response
  const [goToValue, setGoToValue] = useState("");
  const [localData, setLocalData] = useState([]);
  const [clipboard, setClipboard] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [showFormPopup, setShowFormPopup] = useState(false);

  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findReplaceConfig, setFindReplaceConfig] = useState({
    scope: "current", // "all", "current", "selected"
    column: "all",
    findValue: "",
    replaceValue: "",
  });

  const [searchTrigger, setSearchTrigger] = useState(0);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Column keys based on your C# 'Account' model
  const [columns] = useState([
    "acctTypeCode",
    "acctTypeDescription",
    "companyId",
  ]);

  const COLUMN_LABELS = {
    acctTypeCode: "Account Type ID",
    acctTypeDescription: "Description",
    companyId: "Company ID",
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

  const handleSearch = async () => {
    const term = searchTerm.trim();
    try {
      setIsLoading(true);
      setSelectedRows(new Set());

      // Construct the URL with current pagination state
      // const url = `https://planning-master.onrender.com/api/AcctGrp/search${term ? `?acctGrpCd=${term}` : ''}`;
      const url = `https://planning-master.onrender.com/api/AcctType/search?${term ? `acctTypeDescription=${term}&` : ``}pageNumber=${currentPage}&pageSize=${pageSize}`;

      const res = await api.get(url);

      // MAPPING LOGIC:
      // res.data is the whole object { totalRecords: 2, data: [...] }
      if (res.data && res.data.data) {
        setData(res.data.data);

        // Calculate total pages dynamically
        const total = res.data.totalRecords || 0;
        setTotalPages(Math.ceil(total / pageSize) || 1);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Accoutn Group not found.";
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
    if (searchTrigger === 0) return;
    handleSearch();
  }, [currentPage, pageSize, searchTrigger]);

  const toggleRow = (item) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      // Use acctTypeCode as the unique identifier
      if (newSet.has(item.acctTypeCode)) {
        newSet.delete(item.acctTypeCode);
      } else {
        newSet.add(item.acctTypeCode);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      // Map to acctTypeCode
      setSelectedRows(new Set(data.map((d) => d.acctTypeCode)));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${selectedRows.size} Account Type(s)?`)) return;

    setIsDeleting(true);
    try {
      // Iterate through the Set of acctTypeCodes
      for (let code of selectedRows) {
        // Find the corresponding item in the data to get its companyId
        const item = data.find((d) => d.acctTypeCode === code);

        if (item) {
          await api.delete(
            `https://planning-master.onrender.com/api/AcctType/delete?acctTypeCode=${code}&companyId=${item.companyId}`,
          );
        }
      }

      toast.success("Account Type(s) Deleted Successfully!");
      setSelectedRows(new Set()); // Clear selection after delete
      handleSearch(); // Refresh the list
    } catch (error) {
      const msg = error.response?.data?.message || "Error during deletion.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    const id = [...selectedRows][0]; // This is now the acctTypeCode
    const acctTypeToEdit = data.find((item) => item.acctTypeCode === id);
    setselectedAcctType(acctTypeToEdit);
    setEditPopup(true);
  };

  const handleNewRow = () => {
    const newEntry = {
      acctTypeCode: "",
      acctTypeDescription: "",
      companyId: "",
      isNew: true, // Flag to indicate this is a new entry
      isDirty: true,
    };
    setLocalData([newEntry, ...localData]);
  };

  const handleCopy = () => {
    const selectedData = localData.filter((item) =>
      selectedRows.has(item.acctTypeCode),
    );
    setClipboard(selectedData);
    toast.success(`${selectedData.length} rows copied`);
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Clipboard is empty");
    const pastedRows = clipboard.map((row, index) => ({
      ...row,
      id: `new_${Date.now()}_${Math.random()}`,
      acctTypeCode: ``,
      isNew: true,
    }));
    setLocalData([...pastedRows, ...localData]);
    toast.success(`${pastedRows.length} rows pasted`);
  };

  const handleClearAll = () => {
    const hasUnsaved = localData.some((row) => row.isDirty || row.isNew);
    const hasClip = clipboard && clipboard.length > 0;

    let message = "Are you sure?";
    if (hasUnsaved && hasClip)
      message = "Discard all unsaved changes and clear clipboard?";
    else if (hasUnsaved) message = "Discard all unsaved changes?";
    else if (hasClip) message = "Clear copied rows from clipboard?";

    if (window.confirm(message)) {
      // 1. Reset data to original API state
      setLocalData([...data]);

      // 2. Clear Clipboard
      setClipboard([]);

      // 3. Reset selections
      setSelectedRows(new Set());

      toast.info("Cleared successfully");
    }
  };

  const handleLocalChange = (acctTypeCode, field, value) => {
    setLocalData((prev) =>
      prev.map((item) =>
        item.acctTypeCode === acctTypeCode || item.id === acctTypeCode
          ? { ...item, [field]: value, isDirty: true } // Mark this specific row as changed
          : item,
      ),
    );
  };

  const handleExport = (apiResponse) => {
    const rawData = apiResponse || [];
    if (rawData.length === 0) return;

    // 1. Map labels to the technical keys for the header row
    const COLUMN_LABELS = {
      acctTypeCode: "Account Type ID",
      acctTypeDescription: "Description",
      companyId: "Company ID",
    };

    // 2. Filter and Format the data based ONLY on your columns state
    setIsExporting(true);
    try {
      const formattedRows = rawData.map((item) => {
        const row = {};
        columns.forEach((col) => {
          const label = COLUMN_LABELS[col] || col;

          if (col === "acctTypeDescription") {
            row[label] =
              typeOptions.find((opt) => opt.value === item.acctTypeDescription)
                ?.label || item.acctTypeDescription;
          } else if (col === "companyId") {
            row[label] =
              typeOptions.find((opt) => opt.value === item.companyId)?.label ||
              item.companyId;
          } else if (col === "endDate") {
            row[label] =
              `${item.fyCdTo}-${String(item.pdNoTo).padStart(2, "0")}`;
          } else if (
            (col === "sftFl" && item[col] === "") ||
            (col === "mesFl" && item[col] === "")
          ) {
            row[label] = "No";
          } else {
            // Handle Y/N flags or direct values
            const val = item[col];
            row[label] = val === "Y" ? "Yes" : val === "N" ? "No" : val;
          }
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(formattedRows);

      // 3. Define the Formal Styles
      const headerStyle = {
        fill: { fgColor: { rgb: "17414D" } }, // Dark Teal
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
        fill: { fgColor: { rgb: "F3F4F6" } }, // Light Gray Body
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
          ws[cellRef].s = R === 0 ? headerStyle : bodyStyle;
        }
      }

      // 5. Set column widths
      ws["!cols"] = columns.map(() => ({ wch: 18 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Account Type Master");
      XLSX.writeFile(
        wb,
        `Account_Type_Master_${new Date().toLocaleDateString()}.xlsx`,
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = IXLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert Excel to JSON
        const jsonRows = IXLSX.utils.sheet_to_json(worksheet);

        // Step 3: Map Excel Rows to API Payload
        const bulkPayload = jsonRows.map((row) => {
          // 1. Reverse Map Account Type Label -> Code
          const typeOptions = [
            { label: "Expense", value: "E" },
            { label: "Non Labor", value: "N" },
            { label: "Labor", value: "L" },
            { label: "Asset", value: "A" },
            { label: "SubContractor", value: "S" },
            { label: "Income", value: "I" },
          ];
          const typeCode =
            typeOptions.find((opt) => opt.label === row["Account Type"])
              ?.value || "E";

          // 2. Parse Dates (YYYY-MM -> Year and Month)
          const parseDate = (dateStr) => {
            if (!dateStr || !dateStr.includes("-")) return { fy: "", pd: 0 };
            const [year, month] = dateStr.split("-");
            return { fy: year, pd: Number(month) };
          };

          const start = parseDate(row["Start Period"]);
          const end = parseDate(row["End Period"]);

          // 3. Construct Payload (Matches your handleSave structure)
          return {
            acctId: String(row["Account ID"] || ""),
            acctName: row["Account Name"] || "",
            activeFl: row["Active"] === "Yes" ? "Y" : "N",
            fyCdFr: start.fy,
            pdNoFr: start.pd,
            fyCdTo: end.fy,
            pdNoTo: end.pd,
            sAcctTypeCd: typeCode,
            lvlNo: Number(row["Level"]) || 1,
            acctEntrGrpCd: row["Entry Group"] || "",
            tcAcctTypeCd: row["TC Type"] || "",
            detlFl: row["Detail"] === "Yes" ? "Y" : "N",
            projReqdFl: row["Project Required"] === "Yes" ? "Y" : "N",
            topFl: row["Top Level"] === "Yes" ? "Y" : "N",
            sftFl: row["SFT Flag"] === "Yes" ? "Y" : "N",
            mesFl: row["MES Flag"] === "Yes" ? "Y" : "N",
            modifiedBy: user.name || "system_import",
          };
        });

        console.log("Final Bulk Payload for API:", bulkPayload);
        toast.success(`${bulkPayload.length} records parsed. Check console!`);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkSave = async () => {
    const rowsToSave = localData.filter((row) => row.isNew || row.isDirty);
    if (rowsToSave.length === 0) return toast.info("No changes to save.");

    // 1. STRICT VALIDATION CHECK
    const invalidRows = rowsToSave.filter((row) => {
      return (
        !row.acctName ||
        !row.sAcctTypeCd ||
        !row.fyCdFr ||
        !row.pdNoFr ||
        !row.fyCdTo ||
        !row.pdNoTo
      );
    });

    if (invalidRows.length > 0) {
      // If there are many, we just show a general error, otherwise specific
      const count = invalidRows.length;
      return toast.error(
        `${count} row${count > 1 ? "s" : ""} missing required fields (Name, Type, or Start/End Periods).`,
      );
    }

    // 2. PERIOD LOGIC VALIDATION (Optional but recommended)
    // Ensure Start Period is not greater than End Period
    const periodErrorRows = rowsToSave.filter((row) => {
      const start = Number(
        `${row.fyCdFr}${String(row.pdNoFr).padStart(2, "0")}`,
      );
      const end = Number(`${row.fyCdTo}${String(row.pdNoTo).padStart(2, "0")}`);
      return start > end;
    });

    if (periodErrorRows.length > 0) {
      return toast.error("Start Period cannot be later than End Period.");
    }

    const newCount = rowsToSave.filter((r) => r.isNew).length;
    const updateCount = rowsToSave.filter((r) => r.isDirty && !r.isNew).length;

    let message = "";
    if (newCount > 0 && updateCount > 0) {
      message = `Save ${newCount} new entries and update ${updateCount} existing ones?`;
    } else if (newCount > 0) {
      message = `Save ${newCount} new entry${newCount > 1 ? "s" : ""}?`;
    } else {
      message = `Update ${updateCount} record${updateCount > 1 ? "s" : ""}?`;
    }

    if (window.confirm(message)) {
      setIsLoading(true);

      const savePromises = rowsToSave.map((row) => {
        const payload = {
          acctId: row.isNew ? row.displayId : row.acctId,
          acctName: row.acctName,
          activeFl: row.activeFl || "N",
          fyCdFr: row.fyCdFr,
          pdNoFr: Number(row.pdNoFr),
          fyCdTo: row.fyCdTo,
          pdNoTo: Number(row.pdNoTo),
          acctEntrGrpCd: row.acctEntrGrpCd,
          projReqdFl: row.projReqdFl || "N",
          sAcctTypeCd: row.sAcctTypeCd,
          detlFl: row.detlFl || "N",
          topFl: row.topFl || "N",
          lvlNo: Number(row.lvlNo || 0),
          tcAcctTypeCd: row.tcAcctTypeCd,
          sftFl: row.sftFl || "N",
          mesFl: row.mesFl || "N",
          modifiedBy: user?.name || "system_bulk",
        };

        const request = row.isNew
          ? api.post(
              `https://planning-master.onrender.com/api/AcctMaster/CreateAcctMasterV1`,
              payload,
            )
          : api.put(
              `https://planning-master.onrender.com/api/AcctMaster/${row.acctId}`,
              payload,
            );

        return request
          .then(() => ({ status: "success", key: row.id || row.acctId }))
          .catch((err) => ({
            status: "error",
            key: row.id || row.acctId,
            error: err,
          }));
      });

      try {
        const results = await Promise.all(savePromises);
        const successfulKeys = results
          .filter((r) => r.status === "success")
          .map((r) => r.key);
        const errors = results.filter((r) => r.status === "error");

        // UI Update: Remove successfully saved rows from the "Dirty/New" local list
        setLocalData((prev) =>
          prev.filter((row) => !successfulKeys.includes(row.id || row.acctId)),
        );

        if (successfulKeys.length > 0) {
          toast.success(`Successfully saved ${successfulKeys.length} records.`);
        }

        if (errors.length > 0) {
          const firstErrorMsg =
            errors[0].error.response?.data?.message ||
            "Some records failed to save.";
          toast.error(`${errors.length} failed: ${firstErrorMsg}`);
        } else {
          handleSearch(); // Refresh background data
        }
      } catch (error) {
        toast.error("An unexpected error occurred during bulk save.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFindReplace = () => {
    const {
      scope,
      column,
      findYear,
      findMonth,
      replaceYear,
      replaceMonth,
      replaceValue,
      booleanMode,
    } = findReplaceConfig;

    // 1. Validation for Date/Period Columns
    if (column === "startDate" || column === "endDate") {
      const ry = Number(replaceYear);
      const rm = Number(replaceMonth);
      if (!replaceYear || ry < 1010 || ry > 2029)
        return toast.error("Replacement Year must be 1010-2029");
      if (!replaceMonth || rm < 1 || rm > 12)
        return toast.error("Replacement Month must be 1-12");
    }

    if (!window.confirm("Are you sure you want to apply these bulk changes?"))
      return;

    setLocalData((prev) => {
      return prev.map((item) => {
        // Scope Check (Selected vs All)
        const isSelected = selectedRows.has(item.id || item.acctId);
        if (scope === "selected" && !isSelected) return item;

        let rowChanged = false;
        let updatedItem = { ...item };

        // CASE A: FLAG/CHECKBOX COLUMNS
        if (column.endsWith("Fl")) {
          if (booleanMode === "invert" || booleanMode === "inverted") {
            // If replaceValue is empty ("All"), flip everything.
            // Otherwise, only flip if the current row value matches the selection (Y or N).
            if (replaceValue === "" || item[column] === replaceValue) {
              updatedItem[column] = item[column] === "Y" ? "N" : "Y";
              rowChanged = true;
            }
          } else {
            // Set All To Mode (Direct replacement)
            updatedItem[column] = replaceValue || "N";
            rowChanged = true;
          }
        }

        // CASE B: DATE / PERIOD COLUMNS (Split Find & Replace)
        else if (column === "startDate" || column === "endDate") {
          const fyKey = column === "startDate" ? "fyCdFr" : "fyCdTo";
          const pdKey = column === "startDate" ? "pdNoFr" : "pdNoTo";

          const currentYY = String(updatedItem[fyKey] || "");
          const currentMM = String(updatedItem[pdKey] || "");

          // Match if (FindYear is empty OR matches) AND (FindMonth is empty OR matches)
          const yearMatch = findYear === "" || currentYY === findYear;
          const monthMatch =
            findMonth === "" || currentMM === String(Number(findMonth));

          if (yearMatch && monthMatch) {
            updatedItem[fyKey] = replaceYear;
            updatedItem[pdKey] = Number(replaceMonth);
            rowChanged = true;
          }
        }

        // CASE C: STANDARD TEXT / DROPDOWN COLUMNS
        else {
          const currentValue = String(updatedItem[column] || "");
          // We reuse 'findYear' as the general 'Find' input for text fields
          if (findYear === "" || currentValue === findYear) {
            updatedItem[column] = replaceValue;
            rowChanged = true;
          }
        }

        // 3. Mark row as dirty if changed
        return rowChanged ? { ...updatedItem, isDirty: true } : item;
      });
    });

    setShowFormPopup(false);
    toast.success("Bulk update applied successfully!");
  };
  const toggleAllFlags = (field) => {
    // Check if all current rows are "Y"
    const allAreY =
      localData.length > 0 && localData.every((item) => item[field] === "Y");
    const newValue = allAreY ? "N" : "Y";

    setLocalData((prev) =>
      prev.map((item) => ({
        ...item,
        [field]: newValue,
        isDirty: true,
      })),
    );
  };

  const handleFilterOnly = () => {
    const { column, findYear, findMonth } = findReplaceConfig;

    // If "Find" inputs are empty, we just show everything
    if (!findYear && !findMonth) {
      handleSearch(); // Triggers your original search to reset view
      return;
    }

    setLocalData((prev) => {
      return prev.filter((item) => {
        if (column === "startDate" || column === "endDate") {
          const fyKey = column === "startDate" ? "fyCdFr" : "fyCdTo";
          const pdKey = column === "startDate" ? "pdNoFr" : "pdNoTo";

          const currentYY = String(item[fyKey] || "");
          const currentMM = String(item[pdKey] || "");

          const yearMatch = findYear === "" || currentYY === findYear;
          const monthMatch =
            findMonth === "" || currentMM === String(Number(findMonth));
          return yearMatch && monthMatch;
        } else {
          // Standard text filter
          const currentValue = String(item[column] || "").toLowerCase();
          return currentValue.includes(findYear.toLowerCase());
        }
      });
    });
    toast.info("Table filtered based on 'Find' criteria.");
  };

  return (
    <div className="p-1 sm:p-2 space-y-2 text-sm sm:text-base text-gray-800 font-inter">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-2 bg-white rounded-sm p-4">
          <BriefcaseBusiness size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">
            Manage Account Type
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full sm:w-auto">
          <label className="input-label">Account Type ID:</label>
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
        <div className="flex items-center mb-2 gap-1 w-full flex-nowrap">
          {/* {canEdit("manageAccount") && ( */}
          <button
            onClick={() => setShowNewPopup(true)}
            className="btn1 btn-blue shrink-0"
          >
            New Account Type
          </button>
          {/* )} */}

          <div
            className={`flex gap-1 items-center ${showDelete ? "inline-flex" : "hidden"}`}
          >
            {/* {showEdit && canEdit("manageAccount") && ( */}
            {showEdit && (
              <button className="btn1 btn-blue mr-2" onClick={handleEdit}>
                Edit
              </button>
            )}
            {/* {canEdit("manageAccount") && ( */}
            {/* {canEdit("manageAccount") && ( */}
            <button
              onClick={handleDelete}
              className="btn1 px-4 py-1.5 btn-red"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : `Delete (${selectedRows.size})`}
            </button>
            {/* )} */}
          </div>
        </div>
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
                  onChange={(e) =>
                    setFindReplaceConfig({
                      ...findReplaceConfig,
                      column: e.target.value,
                      findYear: "",
                      findMonth: "",
                      replaceYear: "",
                      replaceMonth: "",
                      replaceValue:
                        e.target.value === "sAcctTypeCd"
                          ? typeOptions[0].value
                          : "",
                      booleanMode: "setAll",
                    })
                  }
                >
                  <option value="acctTypeCode">Account Type ID</option>
                  <option value="acctTypeDescription">Description</option>
                  <option value="companyId">Company ID</option>
                </select>
              </div>

              {/* DYNAMIC INPUTS SECTION */}
              {findReplaceConfig.column.toLowerCase().includes("date") ||
              findReplaceConfig.column.toLowerCase().includes("period") ? (
                /* DATE SECTION */
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Find Period:</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="YYYY"
                        className="border outline-none border-gray-500 p-1.5 rounded w-14 text-center"
                        value={findReplaceConfig.findYear}
                        onChange={(e) =>
                          setFindReplaceConfig({
                            ...findReplaceConfig,
                            findYear: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="MM"
                        className="border outline-none border-gray-500 p-1.5 rounded w-10 text-center"
                        value={findReplaceConfig.findMonth}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (
                            val === "" ||
                            (Number(val) >= 1 && Number(val) <= 12)
                          ) {
                            setFindReplaceConfig({
                              ...findReplaceConfig,
                              findMonth: val,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="pb-2 font-bold text-gray-400">→</div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Replace With:
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="YYYY"
                        className="border outline-none border-gray-500 p-1.5 rounded w-14 text-center"
                        value={findReplaceConfig.replaceYear}
                        onChange={(e) =>
                          setFindReplaceConfig({
                            ...findReplaceConfig,
                            replaceYear: e.target.value.replace(/\D/g, ""),
                          })
                        }
                      />
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="MM"
                        className="border outline-none border-gray-500 p-1.5 rounded w-10 text-center"
                        value={findReplaceConfig.replaceMonth}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (
                            val === "" ||
                            (Number(val) >= 1 && Number(val) <= 12)
                          ) {
                            setFindReplaceConfig({
                              ...findReplaceConfig,
                              replaceMonth: val,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : findReplaceConfig.column === "sAcctTypeCd" ? (
                /* ACCOUNT TYPE SECTION (Fixed: Added Replace Dropdown) */
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Find Type:
                    </label>
                    <select
                      className="border border-gray-400 p-1.5 rounded w-32 bg-white outline-none"
                      value={findReplaceConfig.findYear}
                      onChange={(e) =>
                        setFindReplaceConfig({
                          ...findReplaceConfig,
                          findYear: e.target.value,
                        })
                      }
                    >
                      <option value="">All Types</option>
                      {typeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pb-2 font-bold text-gray-400">→</div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Replace With:
                    </label>
                    <select
                      className="border border-gray-400 p-1.5 rounded w-32 bg-white outline-none"
                      value={findReplaceConfig.replaceValue}
                      onChange={(e) =>
                        setFindReplaceConfig({
                          ...findReplaceConfig,
                          replaceValue: e.target.value,
                        })
                      }
                    >
                      {typeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : findReplaceConfig.column.endsWith("Fl") ? (
                /* FLAG SECTION */
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
                          replaceValue: e.target.value === "setAll" ? "Y" : "",
                        })
                      }
                    >
                      <option value="setAll">Set All To</option>
                      <option value="inverted">Invert Values</option>
                    </select>
                    <select
                      className="border outline-none border-gray-500 p-1.5 rounded w-16 bg-white"
                      value={findReplaceConfig.replaceValue}
                      onChange={(e) =>
                        setFindReplaceConfig({
                          ...findReplaceConfig,
                          replaceValue: e.target.value,
                        })
                      }
                    >
                      {findReplaceConfig.booleanMode === "inverted" && (
                        <option value="">All</option>
                      )}
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </div>
                </div>
              ) : (
                /* STANDARD TEXT SECTION */
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Find Value:
                    </label>
                    <input
                      type="text"
                      className="border outline-none border-gray-500 p-1.5 rounded w-32"
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
                      className="border outline-none border-gray-500 p-1.5 rounded w-32"
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

              {/* Actions */}
              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-auto border-l pl-4 border-gray-300">
                {/* Find / Filter Button */}
                <button onClick={handleFilterOnly} className="btn1 btn-blue">
                  Find
                </button>

                {/* Execute Replace Button */}
                <button onClick={handleFindReplace} className="btn1 btn-blue">
                  Execute
                </button>

                {/* RESET & CLOSE BUTTON */}
                <button
                  onClick={() => {
                    handleSearch(); // Clears local filters and fetches original data
                    setShowFormPopup(false); // Closes the UI
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
            {/* {canEdit("manageAccount") && ( */}
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
              Find Replace
            </button>

            <div
              className={`flex gap-1 items-center ${showDelete ? "inline-flex" : "hidden"}`}
            >
              {/* {showEdit && canEdit("manageAccount") && ( */}
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
              {/* {canEdit("manageAccount") && ( */}
              {/* {canEdit("manageAccount") && ( */}
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
              <div className="relative bg-white w-full max-w-3xl h-fit max-h-[95vh]  lg:max-h-[90vh] flex flex-col animate-premium-popup shadow-2xl rounded-lg overflow-hidden">
                <AccountTypeMasterForm
                  onClose={() => {
                    setShowNewPopup(false);
                    setEditPopup(false);
                  }}
                  selectedAcctType={editPopup ? selectedAcctType : null}
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
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    const isFlagColumn = [
                      "activeFl",
                      "detlFl",
                      "mesFl",
                      "projReqdFl",
                      "sftFl",
                      "topFl",
                    ].includes(col);

                    return (
                      <th
                        key={col}
                        className="th-thead text-xs font-bold text-gray-600 text-center"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{COLUMN_LABELS[col] || col}</span>

                          {isFlagColumn && (
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
                          )}
                        </div>
                      </th>
                    );
                  })}
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
                      Search for an Account Type to view the details.
                    </td>
                  </tr>
                ) : (
                  localData.map((item) => (
                    <tr
                      key={item.id || item.acctTypeCode}
                      className={`cursor-pointer hover:bg-blue-50 ${selectedRows.has(item.acctTypeCode) ? "bg-blue-200" : "bg-white"}`}
                      // onDoubleClick={() => {
                      //   setselectedAcctType(item);
                      //   setEditPopup(true);
                      // }}
                    >
                      {/* {canEdit("manageAccount") && ( */}
                      <td className="tbody-td-fun text-center">
                        <input
                          type="checkbox"
                          // onClick={() => toggleRow(item)}
                          // checked={selectedRows.has(item.acctTypeCode)}
                          // readOnly
                          checked={selectedRows.has(
                            item.id || item.acctTypeCode,
                          )}
                          className={`h-3 w-3 accent-blue-600 ${
                            item.isNew
                              ? "cursor-not-allowed opacity-50 grayscale"
                              : "cursor-pointer"
                          }`}
                          onChange={() => {
                            if (item.isNew) return; // Guard clause to prevent selection of new rows
                            const uniqueKey = item.id || item.acctTypeCode;
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
                          className="w-full p-1 border border-gray-300 rounded bg-white"
                          // Show displayId for new rows so it starts empty; show acctId for existing rows
                          value={
                            item.isNew ? item.displayId : item.acctTypeCode
                          }
                          readOnly={!item.isNew}
                          onChange={(e) =>
                            handleLocalChange(
                              item.id || item.acctTypeCode,
                              item.isNew ? "displayId" : "acctTypeCode",
                              e.target.value,
                            )
                          }
                          placeholder={item.isNew ? "Enter ID..." : ""}
                        />
                      </td>
                      <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                        <input
                          className="w-full p-1 border border-gray-300 rounded bg-white"
                          value={item.acctTypeDescription || ""}
                          onChange={(e) =>
                            handleLocalChange(
                              item.id || item.acctTypeCode,
                              "acctTypeDescription",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                        <input
                          className="w-full p-1 border border-gray-300 rounded bg-white"
                          value={item.companyId || ""}
                          onChange={(e) =>
                            handleLocalChange(
                              item.id || item.acctTypeCode,
                              "companyId",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      {/* )} */}
                      {/* {columns.map((col) => (
                        <td
                          key={col}
                          className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center"
                        >
                          {col === "active" ? (
                            <input
                              type="checkbox"
                              checked={Boolean(item[col])} // Robust check for true/false
                              readOnly
                              className="h-3 w-3 accent-blue-600"
                            />
                          ) : col === "updatedat" ? (
                            item[col]?.split("T")[0]
                          ) : col === "endDate" ? (
                            `${new Date(item.fyCdTo, item.pdNoTo, 0).getDate()}-${item.pdNoTo}-${item.fyCdTo}`
                          ) : (
                            item[col]
                          )}
                        </td>
                      ))} */}
                    </tr>
                  ))
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

export default AccountTypeMaster;
