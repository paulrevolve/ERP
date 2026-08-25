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
  Save,
  Scissors,
  Trash2,
} from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Select from "react-select";
// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";
import * as IXLSX from "xlsx";
import {
  ActionButton,
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import {
  FormSearchSelect,
  FormSection,
  FormInput,
} from "../helper/formSection";
import { TableSearchSelect } from "../helper/tableSection";
import Pagination from "../helper/pagination";

const AccountMaster = ({ canEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTermType, setSearchTermType] = useState("");
  const [allData, setAllData] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1); // Update this from your API response
  const [goToValue, setGoToValue] = useState("");

  const [localData, setLocalData] = useState([]);
  const [clipboard, setClipboard] = useState([]);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isTableDirty, setIsTableDirty] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [levelData, setLevelData] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(null);

  const [showFormPopup, setShowFormPopup] = useState(false);

  const [isFormView, setIsFormView] = useState(true);

  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findReplaceConfig, setFindReplaceConfig] = useState({
    scope: "current", // "all", "current", "selected"
    column: "acctName",
    findValue: "",
    replaceValue: "",
  });

  // const backendUrl = "https://rai-addmasters.onrender.com";

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Column keys based on your C# 'Account' model
  const [columns] = useState([
    "acctId",
    "acctName",
    "sAcctTypeCd",
    "lvlNo",
    "acctEntrGrpCd",
    "tcAcctTypeCd",
    "activeFlag",
    "detlFlag",
    "projReqdFlag",
    // "topFl",
    // "sftFl",
    // "mesFl",
    "startDate",
    "endDate",
  ]);

  const COLUMN_LABELS = {
    acctId: "Account ID",
    acctName: "Account Name",
    sAcctTypeCd: "Account Type",
    lvlNo: "Level",
    acctEntrGrpCd: "Entry Group",
    tcAcctTypeCd: "TC Type",
    activeFlag: "Active",
    detlFlag: "Detail",
    projReqdFlag: "Proj Reqd",
    startDate: "FY-PD Starting",
    endDate: "FY-PD Ending",
  };

  const ACCT_COLUMNS = [
    { id: "acctId", label: "Account ID", type: "text", allowReplace: false },
    { id: "acctName", label: "Account Name", type: "text", allowReplace: true },
    { id: "lvlNo", label: "Level", type: "number", allowReplace: false },
    {
      id: "sAcctTypeCd",
      label: "Account Type",
      type: "select",
      allowReplace: true,
      options: [
        { label: "Expense", value: "E" },
        { label: "Non Labor", value: "N" },
        { label: "Labor", value: "L" },
        { label: "Asset", value: "A" },
        { label: "SubContractor", value: "S" },
        { label: "Income", value: "I" },
      ],
    },
    {
      id: "acctEntrGrpCd",
      label: "Entry Group",
      type: "text",
      allowReplace: true,
    },
    { id: "tcAcctTypeCd", label: "TC Type", type: "text", allowReplace: true },
    {
      id: "activeFlag",
      label: "Active Status",
      type: "flag",
      allowReplace: true,
    },
    { id: "detlFlag", label: "Detail Flag", type: "flag", allowReplace: true },
    // {
    //   id: "projReqdFlag",
    //   label: "Project Required",
    //   type: "flag",
    //   allowReplace: true,
    // },
    { id: "fyCdFr", label: "Start Year", type: "year", allowReplace: true },
    // { id: "pdNoFr", label: "Start Period", type: "period", allowReplace: true },
    { id: "fyCdTo", label: "End Year", type: "year", allowReplace: true },
    // { id: "pdNoTo", label: "End Period", type: "period", allowReplace: true },
  ];

  const typeOptions = [
    { label: "Expense", value: "E" },
    { label: "Non Labor", value: "N" },
    { label: "Labor", value: "L" },
    { label: "Asset", value: "A" },
    { label: "SubContractor", value: "S" },
    { label: "Income", value: "I" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "24px",
      height: "24px",
      backgroundColor: state.isDisabled ? "#fcfcfc" : "#ffffff",
      color: state.isDisabled ? "##D9DCE3" : "back",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      boxShadow: "none",
      borderColor: state.isFocused ? "#ccc" : "#ccc",
      "&:hover": {
        borderColor: "#ccc",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 6px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "24px",
    }),
    option: (provided) => ({
      ...provided,
      padding: "4px 8px",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
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

  useEffect(() => {
    const getLevelData = async () => {
      try {
        const res = await api.get(
          `${backendUrl}/api/AccountLevel/GetAllAccountLevelsV2`,
        );
        if (res.data) {
          // Store the full object: { isEditAllowed, isAddNextLevelAllowed, levels: [] }
          setLevelData(res.data);
        }
      } catch (error) {
        console.error("Error fetching account levels:", error);
      }
    };

    getLevelData();
  }, []);

  // Check if a specific row is the "Max Level" and has 0 count
  const isMaxLevelEditable = (lvl) => {
    if (!levelData) return false;

    const levels = levelData.levels;
    const maxLevelNum = Math.max(...levels.map((l) => l.level));

    return (
      levelData.isEditAllowed && lvl.level === maxLevelNum && lvl.count === 0
    );
  };

  // --- Account Level Action Handlers ---

  const handleSaveLevel = async () => {
    // 1. Basic check if levelData.levels exists
    if (!levelData?.levels || levelData.levels.length === 0) return;

    // 2. Filter for rows that actually need saving
    const rowsToProcess = levelData.levels.filter((lvl) =>
      isMaxLevelEditable(lvl),
    );
    if (rowsToProcess.length === 0) return;

    // --- STEP 1: VALIDATE ALL FIELDS FIRST ---
    // We loop through everything BEFORE calling any APIs.
    // If one fails, the whole function stops here.
    for (const lvl of rowsToProcess) {
      if (!lvl.level && lvl.level !== 0) {
        throw new Error("Level number is missing.");
      }

      // Validate Length: Must exist and be > 0
      if (!lvl.lenght || Number(lvl.lenght) <= 0) {
        throw new Error(
          `Level ${lvl.level}: Length is required and must be greater than 0.`,
        );
      }

      // Validate Description: Must not be empty or whitespace
      if (!lvl.description || !lvl.description.trim()) {
        throw new Error(`Level ${lvl.level}: Description is required.`);
      }
    }

    // --- STEP 2: SEQUENTIAL SAVE ---
    // Since we use 'for...of' with 'await', if one fails,
    // the catch block in handleMasterSave will trigger and stop the loop.
    for (const lvl of rowsToProcess) {
      const payload = {
        level: Number(lvl.level),
        lenght: Number(lvl.lenght),
        description: lvl.description.trim(), // Include the description in payload
      };

      try {
        if (lvl.isNew) {
          await api.post(
            `${backendUrl}/api/AccountLevel/CreateAccountLevel`,
            payload,
          );
        } else {
          await api.put(
            `${backendUrl}/api/AccountLevel/UpdateAccountLevel/${lvl.level}`,
            payload,
          );
        }
      } catch (error) {
        // Throwing here stops the loop and prevents the next 'lvl' from being processed
        const errorMsg = error.response?.data?.message || error.message;
        throw new Error(`Stop: Failed to save Level ${lvl.level}. ${errorMsg}`);
      }
    }

    // --- STEP 3: REFRESH DATA ---
    // This only runs if ALL levels in the loop above succeeded.
    const res = await api.get(
      `${backendUrl}/api/AccountLevel/GetAllAccountLevelsV2`,
    );
    if (res.data) setLevelData(res.data);
  };

  const handleGlobalSave = async () => {
    // 1. Identify changes
    const accountsToSave = localData.filter((row) => row.isNew || row.isDirty);
    // Using your rule: only process levels that are editable (Max Level & Count 0) or marked isNew
    const levelsToSave =
      levelData.levels?.filter((lvl) => lvl.isNew || isMaxLevelEditable(lvl)) ||
      [];

    const hasAccountChanges = accountsToSave.length > 0;
    const hasLevelChanges = levelsToSave.length > 0;

    // 2. No changes check
    if (!hasAccountChanges && !hasLevelChanges) {
      return toast.info("No changes detected to save.");
    }

    setIsLoading(true);

    try {
      // 3. Save Account Master first
      if (hasAccountChanges) {
        // Logic inside handleBulkSave will run
        await handleBulkSave();

        // OPTIONAL: If handleBulkSave refreshes the state and resets 'isDirty',
        // check if it was successful before continuing to levels.
      }

      // 4. Save Levels sequentially (using a loop inside handleSaveLevel)
      if (hasLevelChanges) {
        await handleSaveLevel();
      }

      // 5. Final Success Message
      if (hasAccountChanges && hasLevelChanges) {
        toast.success("Accounts and Levels updated successfully.");
      } else if (hasAccountChanges) {
        toast.success("Account changes saved.");
      } else {
        toast.success("Level changes saved.");
      }

      // Clear global dirty flags
      setIsFormDirty(false);
      setIsTableDirty(false);
    } catch (error) {
      console.error("Global Save Error:", error);
      // Provide a detailed error message if possible
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during global save.";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLevel = async () => {
    if (!selectedLevelId) return toast.warn("Please select a level to delete.");

    const target = levelData.levels.find((l) => l.level === selectedLevelId);
    // Logic check: Must be max level and have 0 accounts
    if (!isMaxLevelEditable(target)) {
      return toast.error(
        "Only the highest level with 0 accounts can be deleted.",
      );
    }

    // If it's a row that hasn't been saved to DB yet (isNew), just remove from UI
    if (target.isNew) {
      const updated = levelData.levels.filter(
        (l) => l.level !== selectedLevelId,
      );
      setLevelData({ ...levelData, levels: updated });
      setSelectedLevelId(null);
      return;
    }

    if (!window.confirm(`Delete Level ${selectedLevelId}?`)) return;

    setIsLoading(true);
    try {
      await api.delete(
        `${backendUrl}/api/AccountLevel/DeleteAccountLevel/${selectedLevelId}`,
      );
      toast.success("Level deleted");

      // Refresh
      const res = await api.get(
        `${backendUrl}/api/AccountLevel/GetAllAccountLevelsV2`,
      );
      if (res.data) setLevelData(res.data);
      setSelectedLevelId(null);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to save the delete";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to re-fetch level data after modifications
  const refreshLevelData = async () => {
    try {
      const res = await api.get(
        `${backendUrl}/api/AccountLevel/GetAllAccountLevelsV2`,
      );
      if (res.data) setLevelData(res.data);
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  // Handle Add Row
  const handleAddRow = () => {
    if (!levelData?.isAddNextLevelAllowed)
      return toast.warn("Adding next level not allowed");

    const levels = levelData.levels || [];
    const nextLevelNum =
      levels.length > 0 ? Math.max(...levels.map((l) => l.level)) + 1 : 1;

    const newRow = {
      level: nextLevelNum,
      lenght: 0,
      count: 0,
      isNew: true, // Important: This tells the loop to use POST
    };

    setLevelData({ ...levelData, levels: [...levels, newRow] });
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

  // Search Logic based on Controller: GetAccount/{AcctId}
  // const handleSearch = async () => {
  //   const term = searchTerm.trim();
  //   try {
  //     setIsLoading(true);
  //     setSelectedRows(new Set());

  //     let res;
  //     if (term) {
  //       // Matches [HttpGet("GetAccount/{AcctId}")]
  //       res = await api.get(`https://planning-master.onrender.com/api/AcctMaster/${term}`);
  //       setData(res.data ? [res.data] : []);
  //     } else {
  //       // Fallback or specific "GetAll" if you add it to controller
  //       res = await api.get(`https://planning-master.onrender.com/api/AcctMaster`);
  //       setData(res.data || []);
  //     }
  //   } catch (error) {
  //     const msg = error.response?.data?.message || "Account not found.";
  //         toast.error(msg);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSearch = async () => {
    const term = searchTerm.trim();
    try {
      setIsLoading(true);
      setSelectedRows(new Set());

      // Construct the URL with current pagination state
      // const url = `https://planning-master.onrender.com/api/AcctMaster/SearchAcctMasters?search=${term}&startsWith=${term}&sortBy=AcctId&sortOrder=asc&page=${currentPage}&pageSize=${pageSize}`;
      const url = `${backendUrl}/api/AccountMaster/SearchAccounts?search=${term}&sortBy=AcctId&sortOrder=asc&page=${currentPage}&pageSize=${pageSize}`;
      // const url = `${backendUrl}/api/Account/GetAllAccounts`;

      const res = await api.get(url);

      // MAPPING LOGIC:
      // res.data is the whole object { totalRecords: 2, data: [...] }
      if (res.data && res.data.data) {
        setData(res.data.data);

        // Calculate total pages dynamically
        const total = res.data.totalRecords || 0;
        setLocalData(res.data.data);
        setTotalPages(Math.ceil(total / pageSize) || 1);
        setSelectedAccount(res.data.data[0]);
        setSelectedRows(new Set([res.data.data[0].acctId]));
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Account not found.";
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
      if (newSet.has(item.id || item.acctId)) {
        newSet.delete(item.id || item.acctId);
      } else {
        newSet.add(item.id || item.acctId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((d) => d.id || d.acctId)));
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = data.find(
      (item) =>
        String(item.acctId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.acctId; //

      // 1. Update Form View Data
      setSelectedAccount(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = data.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`Organization ID "${code}" not found.`); //
    }
  };

  const handleNavigate = (direction) => {
    if (isFormDirty) {
      if (!window.confirm("You have unsaved changes. Discard them and move?")) {
        return;
      }
    }

    const idx = data.findIndex(
      (x) =>
        (x.tempId || x.acctId) ===
        (selectedAccount?.tempId || selectedAccount?.acctId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < data.length - 1) newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;

    if (newIdx !== idx) {
      const nextRecord = data[newIdx];
      const nextId = nextRecord.tempId || nextRecord.acctId;

      // 1. Update the record being shown in the form
      setSelectedAccount(nextRecord);
      setCurrentIndex(newIdx);

      // 2. CRITICAL: Update the selection so the table highlights this row
      setSelectedRows(new Set([nextId]));

      setIsFormDirty(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRows.size === 0) {
      toast.info("Please select the row");
      return;
    }
    if (!window.confirm(`Delete ${selectedRows.size} account(s)?`)) return;

    setIsDeleting(true);
    try {
      for (let id of selectedRows) {
        await api.delete(`${backendUrl}/api/AccountMaster/${id}`);
      }
      toast.success("Account Deleted Successfully!");
      setSelectedRows(new Set());
      setSelectedAccount(null);
      setIsFormDirty(false);
      setIsTableDirty(false);
      handleSearch();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to delete the accounts.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // if (!canEdit("manageAccount")) return;
    const id = [...selectedRows][0];
    const accountToEdit = data.find((item) => item.acctId === id);
    setSelectedAccount(accountToEdit);
    setEditPopup(true);
  };

  const handleNewRow = () => {
    const newEntry = {
      // Use a temporary unique ID so React can track this specific row
      id: `new_${Date.now()}_${Math.random()}`,
      acctId: `TEMP_${Date.now()}`,
      displayId: "", // This is what the user will actually see and edit
      acctName: "",
      sAcctTypeCd: "",
      lvlNo: 1,
      activeFlag: "Y",
      detlFlag: "N",
      projReqdFlag: "N",
      // topFl: "N",
      // sftFl: "N",
      // mesFl: "N",
      fyCdFr: new Date().getFullYear().toString(),
      pdNoFr: 1,
      fyCdTo: new Date().getFullYear().toString(),
      pdNoTo: 12,
      isNew: true,
      isDirty: true,
    };
    setLocalData([newEntry, ...localData]);
    setIsFormDirty(true);

    setSelectedAccount(newEntry);
  };

  const handleCopy = () => {
    if (selectedRows.size === 0) {
      toast.warn("Select a record to copy first.");
      return;
    }
    const selectedData = localData.filter((item) =>
      selectedRows.has(item.acctId),
    );
    setClipboard(selectedData);
    toast.success(`${selectedData.length} rows copied`);
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Clipboard is empty");

    // 1. Prepare the new rows from clipboard
    const pastedRows = clipboard.map((row, index) => ({
      ...row,
      id: `new_${Date.now()}_${index}`, // Unique temporary ID
      acctId: ``, // Clear ID for new entry
      isNew: true,
      isDirty: true,
    }));

    // 2. Filter out the existing unsaved "New" entry
    // This removes any row that hasn't been saved to the database yet
    const removeExistingNew = (prev) =>
      prev.filter(
        (item) => !item.isNew && !String(item.id || "").startsWith("new_"),
      );

    // 3. Update state: Remove the blank new row, then insert pasted rows at the top
    setLocalData((prev) => [...pastedRows, ...removeExistingNew(prev)]);

    // 4. Update UI focus to the first pasted record
    if (pastedRows.length > 0) {
      const firstPasted = pastedRows[0];
      setSelectedAccount(firstPasted);
      setIsFormDirty(true);
      setCurrentIndex(0); // Move navigation to the top

      // Sync checkboxes to the newly pasted items
      const newSelected = new Set();
      pastedRows.forEach((row) => newSelected.add(row.id));
      setSelectedRows(newSelected);
    }

    toast.success(
      `${pastedRows.length} record(s) pasted, replacing unsaved entry.`,
    );
  };
  const handleClearAll = () => {
    // 1. Identify unsaved changes in both Account Master and Level Data
    const hasAccountUnsaved =
      localData.some((row) => row.isDirty || row.isNew) ||
      isFormDirty ||
      isTableDirty;

    // Check levels: Are there new rows or rows that are currently editable/modified?
    const hasLevelsUnsaved = levelData.levels?.some(
      (lvl) => lvl.isNew || isMaxLevelEditable(lvl),
    );

    const hasClip = clipboard && clipboard.length > 0;
    const hasUnsaved = hasAccountUnsaved || hasLevelsUnsaved || hasClip;

    if (!hasUnsaved) {
      toast.info("No changes Found");
      return;
    }

    // 2. Build the Confirmation Message
    let message = "Are you sure?";
    if (hasUnsaved && hasClip) {
      message =
        "Discard all unsaved changes (including Levels) and clear clipboard?";
    } else if (hasUnsaved) {
      message = "Discard all unsaved changes in Accounts and Levels?";
    } else if (hasClip) {
      message = "Clear copied rows from clipboard?";
    }

    // 3. Execute Clear
    if (window.confirm(message)) {
      // Reset Account Master to original API state
      console.log(data);
      setLocalData(data);

      // Reset Level Data
      // Assuming 'originalLevelData' is where you store the data fetched from the API
      // If you don't have that, we trigger a refresh or reset to the levels currently in the levelData state
      // but without the 'isNew' rows and with 'isDirty' flags removed.
      if (levelData.levels) {
        const resetLevels = levelData.levels
          .filter((lvl) => !lvl.isNew) // Remove newly added rows
          .map((lvl) => ({ ...lvl, isDirty: false })); // Reset dirty status

        setLevelData((prev) => ({ ...prev, levels: resetLevels }));
      }

      if (typeof handleSearch === "function") {
        handleSearch(); // Re-fetch from API to ensure clean state
      }

      // Clear Clipboard
      setClipboard([]);

      // Reset UI selections and flags
      setSelectedRows(new Set());
      setSelectedAccount(null);
      setIsFormDirty(false);
      setIsTableDirty(false);
      setLocalData(data);

      toast.info("All changes and selections cleared.");
    }
  };

  const handleCut = (id) => {
    setLocalData((prev) => prev.filter((item) => item.acctId !== id));
  };

  const handleLocalChange = (acctId, field, value) => {
    setIsFormDirty(true);

    let finalValue = value;

    if (field === "acctId" || field === "displayId") {
      // Adjust "ac_id" to match your actual field name
      const segments = value.split("-");
      const currentLevelCount = segments.length;
      const maxConfiguredLevels = levelData?.levels?.length || 0;

      // 1. Check if user is trying to add a level that doesn't exist in config
      if (currentLevelCount > maxConfiguredLevels) {
        toast.warn(
          `Only ${maxConfiguredLevels} levels are configured. You cannot add more dashes.`,
        );
        return; // Block input
      }

      // 2. Validate the length of each segment against the config
      for (let i = 0; i < segments.length; i++) {
        const segmentValue = segments[i];
        const configForThisLevel = levelData.levels.find(
          (l) => l.level === i + 1,
        );

        if (configForThisLevel) {
          const allowedLength = configForThisLevel.lenght; // Using API spelling 'lenght'

          if (segmentValue.length > allowedLength) {
            toast.warn(
              `Level ${i + 1} can only have ${allowedLength} characters.`,
            );
            return; // Block input
          }
        }
      }
    }

    // 1. Fiscal Year Validation
    if (field === "fyCdFr" || field === "fyCdTo") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 4) {
        toast.warn("Year must be exactly 4 digits.");
      }
      finalValue = numericValue.slice(0, 4);
    }

    // 2. Period Validation
    if (field === "pdNoFr" || field === "pdNoTo") {
      const numValue = parseInt(value, 10);
      if (value === "") {
        finalValue = "";
      } else if (isNaN(numValue)) {
        return;
      } else if (numValue < 1 || numValue > 12) {
        toast.warn("Period must be between 1 and 12.");
        finalValue = numValue < 1 ? 1 : 12;
      } else {
        finalValue = numValue;
      }
    }

    // 3. Update the master list and sync selectedAccount
    setLocalData((prev) => {
      const newData = prev.map((item) => {
        if (item.acctId === acctId || item.id === acctId) {
          // Create the base update object
          let updatedFields = { ...item, [field]: finalValue, isDirty: true };

          // 4. Automatic Level Calculation Logic
          // Triggers whenever the ID field (acctId or displayId) changes
          if (field === "acctId" || field === "displayId") {
            const idString = String(finalValue || "");
            const dashCount = (idString.match(/-/g) || []).length;
            updatedFields.lvlNo = dashCount + 1;
          }

          return updatedFields;
        }
        return item;
      });

      // Find the updated item and set selectedAccount to it
      const updatedItem = newData.find(
        (item) => item.acctId === acctId || item.id === acctId,
      );

      if (updatedItem) {
        setSelectedAccount(updatedItem);
      }

      return newData;
    });
  };

  const handleExport = (apiResponse) => {
    const rawData = apiResponse || [];
    if (rawData.length === 0) return;

    // 1. Map labels to the technical keys for the header row
    const COLUMN_LABELS = {
      acctId: "Account ID",
      acctName: "Account Name",
      sAcctTypeCd: "Account Type",
      lvlNo: "Level",
      acctEntrGrpCd: "Entry Group",
      tcAcctTypeCd: "TC Type",
      activeFlag: "Active",
      detlFlag: "Detail",
      projReqdFlag: "Project Required",
      // topFl: "Top Level",
      // sftFl: "SFT Flag",
      // mesFl: "MES Flag",
      startDate: "Start Period",
      endDate: "End Period",
    };

    // 2. Filter and Format the data based ONLY on your columns state
    setIsExporting(true);
    try {
      const formattedRows = rawData.map((item) => {
        const row = {};
        columns.forEach((col) => {
          const label = COLUMN_LABELS[col] || col;

          if (col === "sAcctTypeCd") {
            row[label] =
              typeOptions.find((opt) => opt.value === item.sAcctTypeCd)
                ?.label || item.sAcctTypeCd;
          } else if (col === "startDate") {
            row[label] =
              `${item.fyCdFr}-${String(item.pdNoFr).padStart(2, "0")}`;
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
      XLSX.utils.book_append_sheet(wb, ws, "Account Master");
      XLSX.writeFile(
        wb,
        `Account_Master_${new Date().toLocaleDateString()}.xlsx`,
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
            activeFlag: row["Active"] === "Yes" ? "Y" : "N",
            fyCdFr: start.fy,
            pdNoFr: start.pd,
            fyCdTo: end.fy,
            pdNoTo: end.pd,
            sAcctTypeCd: typeCode,
            lvlNo: Number(row["Level"]) || 1,
            acctEntrGrpCd: row["Entry Group"] || "",
            tcAcctTypeCd: row["TC Type"] || "",
            detlFlag: row["Detail"] === "Yes" ? "Y" : "N",
            projReqdFlag: row["Project Required"] === "Yes" ? "Y" : "N",
            // topFl: row["Top Level"] === "Yes" ? "Y" : "N",
            // sftFl: row["SFT Flag"] === "Yes" ? "Y" : "N",
            // mesFl: row["MES Flag"] === "Yes" ? "Y" : "N",
            modifiedBy: user.name || "system_import",
          };
        });

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
      return !row.acctId || !row.acctName;
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
          activeFlag: row.activeFlag || "N",
          fyCdFr: row.fyCdFr,
          pdNoFr: Number(row.pdNoFr),
          fyCdTo: row.fyCdTo,
          pdNoTo: Number(row.pdNoTo),
          acctEntrGrpCd: row.acctEntrGrpCd,
          projReqdFlag: row.projReqdFlag || "N",
          sAcctTypeCd: row.sAcctTypeCd,
          detlFlag: row.detlFlag || "N",
          // topFl: row.topFl || "N",
          lvlNo: Number(row.lvlNo || 0),
          tcAcctTypeCd: row.tcAcctTypeCd,
          // sftFl: row.sftFl || "N",
          // mesFl: row.mesFl || "N",
          modifiedBy: user?.name || "system_bulk",
        };

        const request = row.isNew
          ? api.post(
              `${backendUrl}/api/AccountMaster/CreateAcctMasterV1`,
              payload,
            )
          : api.put(`${backendUrl}/api/AccountMaster/${row.acctId}`, payload);

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

        setSelectedAccount((prev) =>
          prev ? { ...prev, isDirty: false, isNew: false, tempId: null } : null,
        );

        if (successfulKeys.length > 0) {
          toast.success(`Successfully saved ${successfulKeys.length} records.`);
        }
        setIsFormDirty(false);
        setIsTableDirty(false);

        if (errors.length > 0) {
          const firstErrorMsg =
            errors[0].error.response?.data?.message ||
            "Some records failed to save.";
          toast.error(`${errors.length} failed: ${firstErrorMsg}`);
        } else {
          handleSearch(); // Refresh background data
        }
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to save the entry";
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFindReplace = (config, isReplaceMode) => {
    const {
      column,
      findValue = "",
      findYear = "",
      findMonth = "",
      replaceValue = "",
      replaceYear = "",
      replaceMonth = "",
      booleanMode = "normal",
    } = config;

    if (!column) return toast.warn("Please select a column first.");

    setIsFormDirty(true);
    setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setLocalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = localData.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setLocalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    // Safety Guard
    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    // Validation
    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    setLocalData((prevData) => {
      let changeCount = 0;
      const searchValStr = String(targetFind).toLowerCase();

      const updatedData = prevData.map((item) => {
        const currentValue = item[column];
        const currentValStr = String(currentValue || "").toLowerCase();

        const isMatch =
          (!targetFind && !isFlag) ||
          (isPeriod || isYear || isFlag
            ? currentValStr === searchValStr
            : currentValStr.includes(searchValStr));

        if (isMatch) {
          let finalValue = targetReplace;

          if (isFlag) {
            const currentFlag = currentValue || "N";
            if (booleanMode === "inverted") {
              if (replaceValue === "All" || replaceValue === currentFlag) {
                finalValue = currentFlag === "Y" ? "N" : "Y";
              } else return item;
            } else {
              finalValue = replaceValue === "Y" ? "Y" : "N";
            }
          }

          if (finalValue !== currentValue) {
            changeCount++;
            return { ...item, [column]: finalValue, isDirty: true };
          }
        }
        return item;
      });

      if (changeCount > 0) {
        toast.success(`Updated ${changeCount} records.`);
        setIsFormDirty(true);
      } else {
        toast.info("No records matched the criteria.");
      }
      return updatedData;
    });
  };

  const handleRowDoubleClick = (item, index) => {
    // 1. Set the active data row for the Form View
    setSelectedAccount(item);

    // 2. Extract the ID and update the selection state
    const currentId = item.orgId;
    setSelectedRows(new Set([currentId]));

    setCurrentIndex(index);

    // 4. Switch the UI from Table to Form
    setIsFormView(true);
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer title="Manage Accounts">
        <Toolbar
          clipboard={clipboard}
          rowKey={"acctId"}
          columns={ACCT_COLUMNS}
          isFormView={isFormView}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          currentIndex={currentIndex}
          totalRecords={data.length}
          handleFindReplace={handleFindReplace}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          selectedRow={selectedAccount}
          loading={isLoading}
          actions={{
            onAdd: handleNewRow,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleClearAll, // This handles the Discard/Reset logic
            onSave: handleGlobalSave,
            onToggleView: () => {
              if (selectedAccount === null) {
                setSelectedAccount(data[0]);
                setSelectedRows((prev) => new Set([...prev, data[0].acctId]));
              }
              setIsFormView(!isFormView);
            },
          }}
          // 7. Status Indicators
          isDirty={isFormDirty || isTableDirty}
        />
        {isFormView ? (
          <div className="space-y-3 p-1 py-2">
            {/* Primary Account Identifiers */}
            {/* Primary Account Identifiers */}
            <FormSection>
              <div className="flex items-center">
                {/* Account */}
                <div className="flex items-center mr-12">
                  <label className="w-[70px] shrink-0 text-[10px] text-black">
                    Account *
                  </label>

                  <input
                    type="text"
                    value={
                      selectedAccount?.isNew
                        ? selectedAccount?.displayId || ""
                        : selectedAccount?.acctId || ""
                    }
                    readOnly={!selectedAccount?.isNew}
                    onChange={(e) =>
                      handleLocalChange(
                        selectedAccount?.id || selectedAccount?.acctId,
                        "displayId",
                        e.target.value,
                      )
                    }
                    className="w-[150px] border border-gray-300 rounded p-0.5 text-[10px] outline-none bg-white focus:border-[#17414d]"
                  />
                </div>

                {/* Name */}
                <div className="flex items-center mr-12">
                  <label className="w-[50px] shrink-0 text-[10px] text-black">
                    Name *
                  </label>

                  <input
                    type="text"
                    value={selectedAccount?.acctName || ""}
                    onChange={(e) =>
                      handleLocalChange(
                        selectedAccount?.id || selectedAccount?.acctId,
                        "acctName",
                        e.target.value,
                      )
                    }
                    className="w-[150px] border border-gray-300 rounded p-0.5 text-[10px] outline-none bg-white focus:border-[#17414d]"
                  />
                </div>

                {/* Level */}
                <div className="flex items-center">
                  <label className="w-[45px] shrink-0 text-[10px] text-black">
                    Level
                  </label>

                  <input
                    type="number"
                    value={selectedAccount?.lvlNo || ""}
                    readOnly
                    className="w-[120px] border border-gray-300 rounded p-0.5 text-[10px] outline-none bg-gray-100 text-gray-400"
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Account Details">
              <div className="p-2">
                <div className="grid grid-cols-3 gap-x-8 space-y-2">
                  {/* Left Column: Status & Requirements */}
                  <div className="space-y-2">
                    <FormSection title="Basic Information">
                      <div className="grid grid-cols-2 gap-2 space-y-4 -mt-1">
                        <FormInput
                          label="Detail"
                          type="checkbox"
                          // Change: Use direct comparison instead of ternary
                          checked={selectedAccount?.detlFlag}
                          onChange={(e) =>
                            handleLocalChange(
                              selectedAccount?.id || selectedAccount?.acctId,
                              "detlFlag",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                        <FormInput
                          label="Active"
                          type="checkbox"
                          // Change: Use direct comparison instead of ternary
                          checked={selectedAccount?.activeFlag === "Y"}
                          onChange={(e) =>
                            handleLocalChange(
                              selectedAccount?.id || selectedAccount?.acctId,
                              "activeFlag",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                        <FormInput
                          label="Project Required"
                          type="checkbox"
                          // Change: Use direct comparison instead of ternary
                          checked={selectedAccount?.projReqdFlag}
                          disabled={!selectedAccount?.isNew}
                          onChange={(e) =>
                            handleLocalChange(
                              selectedAccount?.id || selectedAccount?.acctId,
                              "projReqdFlag",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                      </div>
                    </FormSection>
                  </div>

                  {/* Right Column: Account Classification */}
                  <div className="space-y-2">
                    <FormSection title="Classification">
                      <div className="space-y-4 ">
                        <FormSearchSelect
                          label="Account Type"
                          value={selectedAccount?.sAcctTypeCd}
                          searchTerm={searchTermType}
                          setSearchTerm={setSearchTermType}
                          options={typeOptions.filter(
                            (t) =>
                              String(t.label)
                                .toLowerCase()
                                .includes(searchTermType.toLowerCase()) ||
                              t.value
                                .toLowerCase()
                                .includes(searchTermType.toLowerCase()),
                          )}
                          displayKey="label"
                          secondaryKey="value"
                          onSelect={(opt) =>
                            handleLocalChange(
                              selectedAccount?.id || selectedAccount?.acctId,
                              "sAcctTypeCd",
                              opt.value,
                            )
                          }
                        />

                        <FormInput
                          label="Account Entry Group"
                          // labelWidth="150px"
                          value={selectedAccount?.acctEntrGrpCd || "ALL"}
                          onChange={(e) =>
                            handleLocalChange(
                              selectedAccount?.id || selectedAccount?.acctId,
                              "acctEntrGrpCd",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </FormSection>
                  </div>

                  {/* Fiscal Year Restrictions Section */}
                  <div>
                    <FormSection title="Fiscal Year/Period Restrictions (Leave blank for no restrictions)">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <FormInput
                            label="Start Month"
                            type="month"
                            value={
                              selectedAccount?.fyCdFr && selectedAccount?.pdNoFr
                                ? `${selectedAccount.fyCdFr}-${String(selectedAccount.pdNoFr).padStart(2, "0")}`
                                : ""
                            }
                            onChange={(e) => {
                              const [year, month] = e.target.value.split("-");

                              handleLocalChange(
                                selectedAccount?.id || selectedAccount?.acctId,
                                "fyCdFr",
                                year,
                              );

                              handleLocalChange(
                                selectedAccount?.id || selectedAccount?.acctId,
                                "pdNoFr",
                                month,
                              );
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <FormInput
                            label="End Month"
                            type="month"
                            value={
                              selectedAccount?.fyCdTo && selectedAccount?.pdNoTo
                                ? `${selectedAccount.fyCdTo}-${String(selectedAccount.pdNoTo).padStart(2, "0")}`
                                : ""
                            }
                            onChange={(e) => {
                              const [year, month] = e.target.value.split("-");

                              handleLocalChange(
                                selectedAccount?.id || selectedAccount?.acctId,
                                "fyCdTo",
                                year,
                              );

                              handleLocalChange(
                                selectedAccount?.id || selectedAccount?.acctId,
                                "pdNoTo",
                                month,
                              );
                            }}
                          />
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </div>
              </div>
            </FormSection>
          </div>
        ) : (
          <>
            <div
              className={`overflow-x-auto max-h-[35vh]  ${showNewPopup ? "pointer-events-none" : ""}`}
            >
              <table className="min-w-full text-sm border border-gray-300 rounded">
                <thead className="bg-gray-200 sticky top-0 z-10 ">
                  <tr>
                    {/* {canEdit("manageAccount") && ( */}
                    <th className="th-thead w-10">
                      <input
                        type="checkbox"
                        className="accent-blue-500"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    {/* )} */}
                    {columns.map((col) => {
                      // List of columns that should have a "Check All" header

                      const isRequired = ["acctId", "acctName"].includes(col);

                      return (
                        <th key={col} className="th-thead">
                          {/* <div className="flex items-center justify-center "> */}
                          <div className="flex items-center justify-center">
                            <span>{COLUMN_LABELS[col] || col}</span>
                            <span className="">{isRequired ? "*" : ""}</span>
                          </div>
                          {/* </div> */}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="tbody">
                  {localData.map((item, index) => (
                    <tr
                      key={item.id || item.acctId}
                      // Add an onClick to the row itself for a better UX
                      onClick={() => setSelectedAccount(item)}
                      onDoubleClick={() => handleRowDoubleClick(item, index)}
                      className={`${
                        selectedRows.has(item.id || item.acctId)
                          ? "bg-blue-50"
                          : ""
                      } hover:bg-gray-50 transition-colors cursor-pointer`}
                    >
                      <td className="text-center tbody-td ">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(item.id || item.acctId)}
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          onChange={(e) => {
                            const rowId = item.id || item.acctId;
                            // Exactly matching the AccountMaster pattern you provided:
                            const newSet = new Set(selectedRows);
                            if (newSet.has(rowId)) {
                              newSet.delete(rowId);
                              setSelectedRows(item); // Set this item as active if unchecked
                            } else {
                              newSet.add(rowId);
                              setSelectedRows(null); // Clear active item if checked (multi-select mode)
                            }
                            setSelectedRows(newSet);
                          }}
                        />
                      </td>
                      {/* <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                      <input
                        className={`w-full p-1 rounded ${item.isNew ? "bg-yellow-50 border border-yellow-200 outline-none" : "bg-transparent border-none"}`}
                        value={item.acctId}
                        readOnly={!item.isNew}
                        onChange={(e) =>
                          handleLocalChange(
                            item.acctId,
                            "acctId",
                            e.target.value,
                          )
                        }
                      />
                    </td> */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-50"}`}
                          // Show displayId for new rows so it starts empty; show acctId for existing rows
                          value={
                            item.isNew ? item.displayId : item.acctId || ""
                          }
                          readOnly={!item.isNew}
                          onChange={(e) =>
                            handleLocalChange(
                              item.id || item.acctId,
                              "displayId",
                              e.target.value,
                            )
                          }
                          placeholder={item.isNew ? "Enter ID..." : ""}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.acctName}
                          onChange={(e) =>
                            handleLocalChange(
                              item.id || item.acctId,
                              "acctName",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="tbody-td text-center min-w-[150px]">
                        {/* <Select
                          options={typeOptions}
                          value={typeOptions.find(
                            (o) => o.value === item.sAcctTypeCd,
                          )}
                          styles={customStyles}
                          menuPortalTarget={document.body}
                          menuPosition="fixed"
                          onChange={(opt) =>
                            handleLocalChange(
                              item.id || item.acctId,
                              "sAcctTypeCd",
                              opt.value,
                            )
                          }
                        /> */}
                        <TableSearchSelect
                          options={typeOptions}
                          displayKey="label"
                          secondaryKey="value"
                          value={
                            item.sAcctTypeCd === "E"
                              ? "Expense"
                              : item.sAcctTypeCd === "N"
                                ? "Non Labor"
                                : item.sAcctTypeCd === "L"
                                  ? "Labor"
                                  : item.sAcctTypeCd === "A"
                                    ? "Asset"
                                    : item.sAcctTypeCd === "S"
                                      ? "Sub Contractor"
                                      : item.sAcctTypeCd === "I"
                                        ? "Income"
                                        : ""
                          }
                          onSelect={(val) => {
                            handleLocalChange(
                              item.temId || item.acctId,
                              "sAcctTypeCd",
                              val.value,
                            );
                          }}
                        />
                      </td>
                      <td className="tbody-td  text-center">
                        <input
                          type="number"
                          className="td-input max-w-[30px] text-center bg-gray-100"
                          value={item.lvlNo}
                          disabled
                          // onChange={(e) => {
                          //   if (e.target.value > 10) {
                          //     toast.warning(
                          //       "Level number should be between 1 and 10",
                          //     );
                          //   } else {
                          //     handleLocalChange(
                          //       item.id || item.acctId,
                          //       "lvlNo",
                          //       e.target.value,
                          //     );
                          //   }
                          // }}
                        />
                      </td>
                      <td className="tbody-td text-center">
                        <input
                          className="td-input"
                          value={item.acctEntrGrpCd}
                          onChange={(e) =>
                            handleLocalChange(
                              item.id || item.acctId,
                              "acctEntrGrpCd",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="tbody-td text-center">
                        <input
                          className="td-input"
                          value={item.tcAcctTypeCd}
                          onChange={(e) =>
                            handleLocalChange(
                              item.id || item.acctId,
                              "tcAcctTypeCd",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      {[
                        "activeFlag",
                        "detlFlag",
                        "projReqdFlag",
                        // "topFl",
                        // "sftFl",
                        // "mesFl",
                      ].map((field) => (
                        <td key={field} className="tbody-td text-center">
                          <input
                            type="checkbox"
                            className="td-checkbox accent-blue-500"
                            checked={item[field] === "Y"}
                            disabled={field === "projReqdFlag" && !item.isNew}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.acctId,
                                field,
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                        </td>
                      ))}

                      {/* Start Period Column */}
                      <td className="tbody-td text-center">
                        <div className="flex gap-1 items-center justify-center">
                          {/* Year Input (1010 - 2029) */}
                          <input
                            type="text"
                            placeholder="YYYY"
                            maxLength={4}
                            className="max-w-12  td-input"
                            value={item.fyCdFr || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              // Allow typing, but don't allow more than 2029
                              if (val === "" || Number(val) <= 2029) {
                                handleLocalChange(
                                  item.id || item.acctId,
                                  "fyCdFr",
                                  val,
                                );
                              }
                            }}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              // Final check when user finishes typing
                              if (val !== 0 && (val <= 1009 || val >= 2030)) {
                                toast.error(
                                  "Year must be between 1010 and 2029",
                                );
                                handleLocalChange(
                                  item.id || item.acctId,
                                  "fyCdFr",
                                  "",
                                ); // Clear invalid value
                              }
                            }}
                          />
                          <span>-</span>
                          {/* Month Input (1 - 12) */}
                          <input
                            type="text"
                            placeholder="MM"
                            maxLength={2}
                            className="max-w-12 td-input"
                            value={item.pdNoFr || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              const num = Number(val);
                              // Greater than 0 and smaller than 13
                              if (val === "" || (num > 0 && num < 13)) {
                                handleLocalChange(
                                  item.id || item.acctId,
                                  "pdNoFr",
                                  val === "" ? "" : num,
                                );
                              } else {
                                toast.warn("Month must be between 1 and 12");
                              }
                            }}
                          />
                        </div>
                      </td>

                      <td className="tbody-td text-center">
                        <div className="flex gap-1 items-center justify-center">
                          {/* Year Input (1010 - 2029) */}
                          <input
                            type="text"
                            placeholder="YYYY"
                            maxLength={4}
                            className="max-w-12 td-input"
                            value={item.fyCdTo || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              // Allow typing, but don't allow more than 2029
                              if (val === "" || Number(val) <= 2029) {
                                handleLocalChange(
                                  item.id || item.acctId,
                                  "fyCdTo",
                                  val,
                                );
                              } else {
                                toast.warn(
                                  "Year must be between 1010 and 2029",
                                );
                              }
                            }}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              // Final check when user finishes typing
                              if (val !== 0 && (val <= 1009 || val >= 2030)) {
                                toast.error(
                                  "Year must be between 1010 and 2029",
                                );
                                handleLocalChange(
                                  item.id || item.acctId,
                                  "fyCdTo",
                                  "",
                                ); // Clear invalid value
                              }
                            }}
                          />
                          <span>-</span>
                          {/* Month Input (1 - 12) */}
                          <input
                            type="text"
                            placeholder="MM"
                            maxLength={2}
                            className="max-w-12 td-input"
                            value={item.pdNoTo || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              const num = Number(val);
                              // Greater than 0 and smaller than 13
                              if (val === "" || (num > 0 && num < 13)) {
                                handleLocalChange(
                                  item.id || item.acctId,
                                  "pdNoTo",
                                  val === "" ? "" : num,
                                );
                              } else {
                                toast.warn("Month must be between 1 and 12");
                              }
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              totalPages={totalPages}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              goToValue={goToValue}
              setGoToValue={setGoToValue}
            />
          </>
        )}
      </MainContainer>

      <SecondaryContainer title="Account Level">
        <div className="w-full flex justify-end gap-2 pb-2">
          <ActionButton
            icon={Plus}
            disabled={isLoading}
            onClick={handleAddRow}
          />
          <ActionButton
            icon={Trash2}
            disabled={isLoading}
            onClick={handleDeleteLevel}
          />
        </div>

        <div className="overflow-x-auto max-h-[35vh]">
          <table className="min-w-full text-sm border border-gray-300 rounded">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="th-thead w-12"></th>
                <th className="th-thead">Level</th>
                {/* <th className="th-thead">Description</th> */}
                <th className="th-thead">Length</th>
              </tr>
            </thead>

            <tbody className="tbody">
              {levelData?.levels.map((lvl) => {
                const isEditable = isMaxLevelEditable(lvl);
                const isSelected = selectedLevelId === lvl.level;
                return (
                  <tr
                    key={lvl.level}
                    className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        // Use 'checked' instead of 'value' for checkboxes
                        checked={isSelected}
                        onChange={() => {
                          // Toggle logic: If clicking the already selected row, unselect it.
                          // Otherwise, set the new ID (which automatically unselects others).
                          setSelectedLevelId(
                            selectedLevelId === lvl.level ? null : lvl.level,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-100"
                        value={lvl.level}
                        readOnly
                      />
                    </td>
                    {/* <td className="tbody-td">
                      <input
                        className={`td-input ${!isEditable && !lvl.isNew ? "bg-gray-50 text-gray-400" : "bg-white"}`}
                        value={lvl.description}
                        readOnly={!isEditable && !lvl.isNew}
                        onChange={(e) => {
                          const updated = levelData.levels.map((item) =>
                            item.level === lvl.level
                              ? { ...item, description: e.target.value }
                              : item,
                          );
                          setLevelData({ ...levelData, levels: updated });
                        }}
                      />
                    </td> */}
                    <td className="tbody-td">
                      <input
                        className={`td-input ${!isEditable && !lvl.isNew ? "bg-gray-50 text-gray-400" : "bg-white"}`}
                        value={lvl.lenght}
                        type="number"
                        readOnly={!isEditable && !lvl.isNew}
                        onChange={(e) => {
                          const updated = levelData.levels.map((item) =>
                            item.level === lvl.level
                              ? { ...item, lenght: e.target.value }
                              : item,
                          );
                          setLevelData({ ...levelData, levels: updated });
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SecondaryContainer>
    </div>
  );
};

export default AccountMaster;
