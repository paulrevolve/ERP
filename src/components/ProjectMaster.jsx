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
import OrgMasterForm from "./OrgMasterForm";
import EmployeeMasterForm from "./EmployeeMasterForm";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Select from "react-select";
// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";
import * as IXLSX from "xlsx";

const OrgMaster = ({ canEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPopup, setShowNewPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedOrg, setselectedOrg] = useState(null);

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

  const [org, setOrg] = useState([]);
  const [rev, setRev] = useState([]);

  const [showFormPopup, setShowFormPopup] = useState(false);

  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findReplaceConfig, setFindReplaceConfig] = useState({
    scope: "current", // "all", "current", "selected"
    column: "projName",
    findValue: "",
    replaceValue: "",
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "24px",
      height: "24px",
      backgroundColor: state.isDisabled ? "#fcfcfc" : "#ffffff",
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
  };

  const [levelData, setLevelData] = useState([
    {
      level: 1,
      lenght: 5,
      count: 1,
    },
    {
      level: 2,
      lenght: 2,
      count: 4,
    },
    {
      level: 3,
      lenght: 2,
      count: 8,
    },
    {
      level: 4,
      lenght: 2,
      count: 17,
    },
  ]);
  const [maxlevel, setMaxlevel] = useState(3);

  // const getAllLevel = async () => {
  //   try {
  //     const res = await api.get(
  //       `${backendUrl}/api/AccountLevel/GetAllOrgLevelsV1`,
  //     );

  //     setLevelData(res.data);

  //     if (res.data.length > 0) {
  //       const levels = res.data.map((item) => Number(item.level));
  //       setMaxlevel(Math.max(...levels));
  //     } else {
  //       setMaxlevel(1);
  //     }
  //   } catch (error) {
  //     const msg =
  //       error.response?.data?.message ||
  //       error.response?.data ||
  //       error.message ||
  //       "Failed to fetch the level data";
  //     toast.error(msg);
  //   }
  // };

  // useEffect(() => {
  //   getAllLevel();
  // }, []);

  const orgOptions = org?.map((item) => ({
    value: item.orgId,
    label: item.orgId, // This ensures ONLY the Org Id shows in the dropdown
  }));
  const revOptions = rev?.map((item) => ({
    value: item.formulaCd,
    label: item.formulaCd, // This ensures ONLY the Org Id shows in the dropdown
  }));
  const projectExport = [
    { value: "s", label: "A" },
    { value: "b", label: "B" },
  ];

  const getAllorg = async () => {
    try {
      const res = await api.get(
        `https://rai-addmasters.onrender.com/Orgnization/GetAllOrgs`,
      );
      setOrg(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllrev = async () => {
    try {
      const res = await api.get(
        `https://rai-addmasters.onrender.com/RevFormula`,
      );
      setRev(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const backendUrl = "https://rai-addmasters.onrender.com";

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Column keys based on your C# 'Account' model
  const [columns] = useState([
    "projId",
    "projName",
    "levelNo",
    "projLongName",
    "projAbbrCd",
    "projTypeDc",
    "orgId",
    "companyId",
    "projSegId",
    "projSegName",

    "projMgrName",
    "classification",
    "exportProject",

    "projStartDt",
    "projEndDt",

    "primeContrId",
    "subctrId",
    "custPoId",
    "taskOrderNo",
    "cntrId",
    "oppId",
    "acctGrpCd",

    "proj_v_tot_amt",
    "proj_f_tot_amt",
    "proj_v_fee_amt",
    "proj_v_cst_amt",
    "proj_f_fee_amt",
    "proj_f_cst_amt",
    "projVAwdFeeAmt",
    "projFAwdFeeAmt",

    "projLn1Adr",
    "projLn2Adr",
    "projLn3Adr",
    "cityName",
    "mailStateDc",
    "postalCd",
    "countryCd",

    "activeFl",
    "AcctGrpFl",
    "allowCharging",
    "billableProject",
    "WorkforceRequired",
  ]);

  const COLUMN_LABELS = {
    projId: "Project ID",
    projName: "Project Name",
    projLongName: "Long Name",
    levelNo: "Level",
    projAbbrCd: "Abbreviation",
    projTypeDc: "Project Type",
    orgId: "Org ID",
    companyId: "Company ID",
    projMgrName: "Project Manager",
    projStartDt: "Start Date",
    projEndDt: "End Date",
    projSegId: "Segment ID",
    projSegName: "Segment Name",
    primeContrId: "Prime Contract ID",
    subctrId: "Subcontractor ID",
    custPoId: "Customer PO ID",
    taskOrderNo: "Task Order",
    cntrId: "Contract ID",
    oppId: "Opportunity ID",
    proj_v_tot_amt: "Total Value Amt",
    proj_f_tot_amt: "Total Funded Amt",
    proj_v_fee_amt: "Value Fee",
    proj_v_cst_amt: "Value Cost",
    proj_f_fee_amt: "Funded Fee",
    proj_f_cst_amt: "Funded Cost",
    projVAwdFeeAmt: "Value Award Fee",
    projFAwdFeeAmt: "Funded Award Fee",
    projLn1Adr: "Address Line 1",
    projLn2Adr: "Address Line 2",
    projLn3Adr: "Address Line 3",
    cityName: "City",
    mailStateDc: "State",
    postalCd: "Postal Code",
    countryCd: "Country",
    classification: "Classification",
    exportProject: "Export Type",
    acctGrpCd: "Acct Group",

    activeFl: "Active",
    AcctGrpFl: "Acct Group Flag",
    allowCharging: "Allow Charging",
    WorkforceRequired: "Workforce Req.",
    billableProject: "Billable",
  };

  useEffect(() => {
    handleSearch();
    getAllorg();
    getAllrev();
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
      const url = `${backendUrl}/api/ProjectMaster/SearchProjects?search=${term}&sortBy=ProjId&sortOrder=asc&page=${currentPage}&pageSize=${pageSize}`;

      const res = await api.get(url);

      // MAPPING LOGIC:
      // res.data is the whole object { totalRecords: 2, data: [...] }
      if (res.data && res.data.data) {
        // Map through the results to ensure specific fields are never undefined/null
        const formattedData = res.data.data.map((org) => ({
          ...org, // Keep all other existing fields
          // orgAbbrvCd: org.orgAbbrvCd || "",
          // companyId: org.companyId || "",
          // taxbleEntityId: org.taxbleEntityId || "",
        }));

        setData(formattedData);
        setLocalData(formattedData);
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
        "Org not found.";
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
      if (newSet.has(item.id || item.orgId)) {
        newSet.delete(item.id || item.orgId);
      } else {
        newSet.add(item.id || item.orgId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((d) => d.id || d.projId)));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${selectedRows.size} Project(s)?`)) return;

    setIsDeleting(true);
    try {
      for (let id of selectedRows) {
        await api.delete(`${backendUrl}/api/ProjectMaster/${id}`);
      }
      toast.success("Project Deleted Successfully!");
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
    const orgToEdit = data.find((item) => item.projId === id);
    setselectedOrg(orgToEdit);
    setEditPopup(true);
  };

  const handleNewRow = () => {
    const newEntry = {
      // Use a temporary unique ID so React can track this specific row
      id: `new_${Date.now()}_${Math.random()}`,
      displayId: "",
      orgId: `TEMP_${Date.now()}`,
      orgName: "", // This is what the user will actually see and edit
      lvlNo: null,
      orgAbbrvCd: "",
      companyId: "",
      taxbleEntityId: "",
      tcOrgFl: "N",
      tmOrgFl: "N",
      activeFl: "N",
      orgTopFl: "N",
      isNew: true,
      isDirty: true,
    };
    setLocalData([newEntry, ...localData]);
  };

  const handleCopy = () => {
    // 1. Filter the data based on selected rows
    const selectedData = localData.filter((item) =>
      selectedRows.has(item.id || item.projId),
    );

    if (selectedData.length === 0) {
      toast.warn("No rows selected to copy");
      return;
    }

    // 2. Define the columns you want to include in the copy (matches your table order)
    const columns = [
      "projId",
      "projName",
      "projLongName",
      "levelNo",
      "projAbbrCd",
      "projTypeDc",
      "orgId",
      "companyId",
      "projSegId",
      "projSegName",

      "projMgrName",
      "activeFl",
      "AcctGrpFl",
      "allowCharging",
      "billableProject",
      "WorkforceRequired",
      "classification",
      "exportProject",

      "projStartDt",
      "projEndDt",

      "primeContrId",
      "subctrId",
      "custPoId",
      "taskOrderNo",
      "cntrId",
      "oppId",
      "acctGrpCd",

      "proj_v_tot_amt",
      "proj_v_fee_amt",
      "proj_v_cst_amt",
      "projVAwdFeeAmt",
      "proj_f_tot_amt",
      "proj_f_fee_amt",
      "proj_f_cst_amt",
      "projFAwdFeeAmt",

      "projLn1Adr",
      "projLn2Adr",
      "projLn3Adr",
      "cityName",
      "mailStateDc",
      "postalCd",
      "countryCd",
    ];

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
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // This takes "2026-03-18T00:00:00" and returns "2026-03-18"
    return dateString.split("T")[0];
  };

  const getFlagValue = (row, name) => {
    const flag = row.flags.find((f) => f.flagName === name);
    console.log(flag);
    return flag.flagValue; // Returns true if "Y", false otherwise
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Clipboard is empty");
    const pastedRows = clipboard.map((row, index) => ({
      ...row,
      id: `new_${Date.now()}_${Math.random()}`,
      projId: ``,
      projName: row?.projName || "",
      projAbbrCd: row?.projAbbrCd || "",
      projTypeDc: row?.projTypeDc || "",
      orgId: row?.orgId || "",
      companyId: row?.companyId || "",
      projMgrName: row?.projMgrName || "",
      projStartDt: formatDateForInput(row?.projStartDt),
      projEndDt: formatDateForInput(row?.projEndDt),
      activeFl: row?.activeFl,
      AcctGrpFl: getFlagValue(row, "AcctGrpFl"),
      allowCharging: getFlagValue(row, "allowCharging"),
      billableProject: getFlagValue(row, "billableProject"),
      WorkforceRequired: getFlagValue(row, "WorkforceRequired"),
      levelNo: row?.levelNo || 0,
      projSegId: row?.hierarchy?.projSegId || "",
      projSegName: row?.hierarchy?.projSegName || "",
      primeContrId: row?.contract?.primeContrId || "",
      subctrId: row?.contract?.subctrId || "",
      custPoId: row?.contract?.custPoId || "",
      taskOrderNo: row?.contract?.taskOrderNo || "",
      cntrId: row?.contract?.cntrId || "",
      oppId: row?.contract?.oppId || "",

      // Financials (Numbers)
      proj_v_tot_amt: row?.financial?.proj_v_tot_amt || 0,
      proj_f_tot_amt: row?.financial?.proj_f_tot_amt || 0,
      proj_v_fee_amt: row?.financial?.proj_v_fee_amt || 0,
      proj_v_cst_amt: row?.financial?.proj_v_cst_amt || 0,
      proj_f_fee_amt: row?.financial?.proj_f_fee_amt || 0,
      proj_f_cst_amt: row?.financial?.proj_f_cst_amt || 0,
      projVAwdFeeAmt: row?.financial?.projVAwdFeeAmt || 0,
      projFAwdFeeAmt: row?.financial?.projFAwdFeeAmt || 0,

      // Address & Location
      projLn1Adr: row?.address?.projLn1Adr || "",
      projLn2Adr: row?.address?.projLn2Adr || "",
      projLn3Adr: row?.address?.projLn3Adr || "",
      cityName: row?.address?.cityName || "",
      mailStateDc: row?.address?.mailStateDc || "",
      postalCd: row?.address?.postalCd || "",
      countryCd: row?.address?.countryCd || "",

      // Classifications
      classification: row?.classification || "",
      exportProject: row?.exportProject || "None",
      projLongName: row?.projLongName || "",
      modifiedBy: row?.modifiedBy || "",
      acctGrpCd: row?.acctGrpCd || "",
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

  // const handleLocalChange = (orgId, field, value) => {
  //   let newValue = value || "";
  //   let newLvlNo = null;
  //   // let autoDetail = null;

  //   if (field === "displayId" || field === "orgId") {
  //     const segments = newValue.split("-");
  //     const hyphenCount = segments.length - 1;

  //     if (hyphenCount > maxlevel - 1) {
  //       toast.warn(`Maximum depth is ${maxlevel} levels`);
  //       return;
  //     }

  //     for (let i = 0; i < segments.length; i++) {
  //       const currentLevel = i + 1; // Index 0 is Level 1, etc.
  //       const segmentValue = segments[i];

  //       // Find the rule for this level from your fetched levelData
  //       const levelRule = levelData.find((l) => l.level === currentLevel);

  //       if (levelRule && segmentValue.length > levelRule.lenght) {
  //         toast.warn(
  //           `Level ${currentLevel} cannot exceed ${levelRule.lenght} characters.`,
  //         );
  //         return; // Block the update
  //       }
  //     }

  //     newLvlNo = hyphenCount + 1;

  //     // Auto-check logic: If it hits Level 3, prep the detail flag as "Y"
  //     // if (newLvlNo === 3) {
  //     //   autoDetail = "Y";
  //     // } else {
  //     //   autoDetail = "N"; // Levels 1 and 2 are usually not detail accounts
  //     // }
  //   }

  //   setLocalData((prev) =>
  //     prev.map((item) => {
  //       if (item.orgId === orgId || item.id === orgId) {
  //         const updatedItem = { ...item, [field]: newValue, isDirty: true };

  //         if (newLvlNo !== null) {
  //           updatedItem.levelNo = newLvlNo;
  //           // Apply auto-check for detail flag when level changes
  //           // updatedItem.detailFlag = autoDetail;
  //         }

  //         return updatedItem;
  //       }
  //       return item;
  //     }),
  //   );
  // };

  const handleLocalChange = (id, field, value) => {
    setLocalData((prev) =>
      prev.map((item) => {
        if (item.projId === id || item.id === id) {
          let updatedItem = { ...item, isDirty: true };

          // 1. Handle Nested Flags Array
          const flagFields = [
            "AcctGrpFl",
            "allowCharging",
            "WorkforceRequired",
            "billableProject",
          ];
          if (flagFields.includes(field)) {
            updatedItem.flags = (item.flags || []).map((f) =>
              f.flagName === field ? { ...f, flagValue: value } : f,
            );
          }
          // 2. Handle Nested Contract Object
          else if (
            [
              "primeContrId",
              "subctrId",
              "custPoId",
              "taskOrderNo",
              "cntrId",
              "oppId",
            ].includes(field)
          ) {
            updatedItem.contract = { ...(item.contract || {}), [field]: value };
          }
          // 3. Handle Nested Address Object
          else if (
            [
              "projLn1Adr",
              "projLn2Adr",
              "projLn3Adr",
              "cityName",
              "mailStateDc",
              "postalCd",
              "countryCd",
            ].includes(field)
          ) {
            updatedItem.address = { ...(item.address || {}), [field]: value };
          }
          // 4. Handle Standard Top-Level Fields
          else {
            updatedItem[field] = value;
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  // const handleExport = (apiResponse) => {
  //   const rawData = apiResponse || [];
  //   if (rawData.length === 0) return;

  //   // 1. Map labels to the technical keys for the header row
  //   const COLUMN_LABELS = {
  //     projId: "Project ID",
  //     projName: "Project Name",
  //     projLongName: "Long Name",
  //     levelNo: "Level",
  //     projAbbrCd: "Abbreviation",
  //     projTypeDc: "Project Type",
  //     orgId: "Org ID",
  //     companyId: "Company ID",
  //     projMgrName: "Project Manager",
  //     projStartDt: "Start Date",
  //     projEndDt: "End Date",
  //     activeFl: "Active",
  //     AcctGrpFl: "Account Group Flag",
  //     allowCharging: "Allow Charging",
  //     projSegId: "Segment ID",
  //     projSegName: "Segment Name",
  //     primeContrId: "Prime Contract ID",
  //     subctrId: "Subcontractor ID",
  //     custPoId: "Customer PO ID",
  //     taskOrderNo: "Task Order #",
  //     cntrId: "Contract ID",
  //     oppId: "Opportunity ID",
  //     proj_v_tot_amt: "Total Value Amt",
  //     proj_f_tot_amt: "Total Funded Amt",
  //     proj_v_fee_amt: "Value Fee",
  //     proj_v_cst_amt: "Value Cost",
  //     proj_f_fee_amt: "Funded Fee",
  //     proj_f_cst_amt: "Funded Cost",
  //     projVAwdFeeAmt: "Value Award Fee",
  //     projFAwdFeeAmt: "Funded Award Fee",
  //     projLn1Adr: "Address Line 1",
  //     projLn2Adr: "Address Line 2",
  //     projLn3Adr: "Address Line 3",
  //     cityName: "City",
  //     mailStateDc: "State",
  //     postalCd: "Postal Code",
  //     countryCd: "Country",
  //     classification: "Classification",
  //     exportProject: "Export Type",
  //     billableProject: "Billable",
  //     WorkforceRequired: "Workforce Req.",
  //     acctGrpCd: "Acct Group",
  //   };

  //   // 2. Filter and Format the data based ONLY on your columns state
  //   setIsExporting(true);
  //   try {
  //     const formattedRows = rawData.map((item) => {
  //       const row = {};
  //       columns.forEach((col) => {
  //         const label = COLUMN_LABELS[col] || col;

  //         // if (col === "sAcctTypeCd") {
  //         //   row[label] =
  //         //     revOptions.find((opt) => opt.value === item.sAcctTypeCd)
  //         //       ?.label ||
  //         //     item.sAcctTypeCd ||
  //         //     "";
  //         // } else if (col === "startDate") {
  //         //   row[label] =
  //         //     item.fyCdFrom && item.pdNoFrom
  //         //       ? `${item.fyCdFrom}-${String(item.pdNoFrom).padStart(2, "0")}`
  //         //       : "";
  //         // } else if (col === "endDate") {
  //         //   row[label] =
  //         //     item.fyCdTo && item.pdNoTo
  //         //       ? `${item.fyCdTo}-${String(item.pdNoTo).padStart(2, "0")}`
  //         //       : "";
  //         // } else if (
  //         //   (col === "sftFl" && item[col] === "") ||
  //         //   (col === "mesFl" && item[col] === "")
  //         // ) {
  //         //   row[label] = "No";
  //         // } else {
  //         //   // Handle Y/N flags or direct values
  //         const val = item[col];
  //         if (val === null || val === undefined) {
  //           row[label] = val === null || val === undefined ? "" : val;
  //         } else {
  //           row[label] = val === "Y" ? "Yes" : val === "N" ? "No" : val || "";
  //         }
  //         // }
  //       });
  //       // console.log(row);
  //       return row;
  //     });

  //     const ws = XLSX.utils.json_to_sheet(formattedRows);

  //     // 3. Define the Formal Styles
  //     const headerStyle = {
  //       fill: { fgColor: { rgb: "17414D" } }, // Dark Teal
  //       font: { color: { rgb: "FFFFFF" }, bold: true, sz: 11 },
  //       alignment: { horizontal: "center", vertical: "center" },
  //       border: {
  //         top: { style: "thin" },
  //         bottom: { style: "thin" },
  //         left: { style: "thin" },
  //         right: { style: "thin" },
  //       },
  //     };

  //     const bodyStyle = {
  //       fill: { fgColor: { rgb: "F3F4F6" } }, // Light Gray Body
  //       font: { sz: 10, color: { rgb: "333333" } },
  //       alignment: { horizontal: "left", vertical: "center" },
  //       border: {
  //         top: { style: "thin", color: { rgb: "D1D5DB" } },
  //         bottom: { style: "thin", color: { rgb: "D1D5DB" } },
  //         left: { style: "thin", color: { rgb: "D1D5DB" } },
  //         right: { style: "thin", color: { rgb: "D1D5DB" } },
  //       },
  //     };

  //     // 4. Apply Styles
  //     const range = XLSX.utils.decode_range(ws["!ref"]);
  //     for (let R = range.s.r; R <= range.e.r; ++R) {
  //       for (let C = range.s.c; C <= range.e.c; ++C) {
  //         const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
  //         if (!ws[cellRef]) continue;
  //         ws[cellRef].s = R === 0 ? headerStyle : bodyStyle;
  //       }
  //     }

  //     // 5. Set column widths
  //     ws["!cols"] = columns.map(() => ({ wch: 18 }));

  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, "Org Master");
  //     XLSX.writeFile(wb, `Org_Master_${new Date().toLocaleDateString()}.xlsx`);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const handleExport = (apiResponse) => {
    const rawData = apiResponse || [];
    if (rawData.length === 0) {
      toast.warning("No data available to export.");
      return;
    }

    // 1. Comprehensive Mapping of Technical Keys to Human Labels
    const COLUMN_LABELS = {
      projId: "Project ID",
      projName: "Project Name",
      projLongName: "Long Name",
      levelNo: "Level",
      projAbbrCd: "Abbreviation",
      projTypeDc: "Project Type",
      orgId: "Org ID",
      companyId: "Company ID",
      projMgrName: "Project Manager",
      projStartDt: "Start Date",
      projEndDt: "End Date",
      activeFl: "Active",
      AcctGrpFl: "Acct Group Flag",
      acctGrpCd: "Acct Group",
      classification: "Classification",
      // Nested Flags
      allowCharging: "Allow Charging",
      billableProject: "Billable",
      WorkforceRequired: "Workforce Req.",
      exportProject: "Export Type",
      // Contract Nested
      cntrId: "Contract ID",
      primeContrId: "Prime Contract ID",
      subctrId: "Subcontractor ID",
      custPoId: "Customer PO ID",
      taskOrderNo: "Task Order",
      oppId: "Opportunity ID",
      // Financials
      proj_v_tot_amt: "Total Value Amt",
      proj_f_tot_amt: "Total Funded Amt",
      proj_v_fee_amt: "Value Fee",
      proj_v_cst_amt: "Value Cost",
      proj_f_fee_amt: "Funded Fee",
      proj_f_cst_amt: "Funded Cost",
      projVAwdFeeAmt: "Value Award Fee",
      projFAwdFeeAmt: "Funded Award Fee",
      // Address Nested
      projLn1Adr: "Address Line 1",
      ProjLn2Adr: "Address Line 2",
      ProjLn3Adr: "Address Line 3",
      cityName: "City",
      mailStateDc: "State",
      postalCd: "Postal Code",
      countryCd: "Country",
    };

    setIsExporting(true);
    try {
      const formattedRows = rawData.map((item) => {
        const row = {};

        // We iterate through the columns currently visible/selected in your state
        columns.forEach((col) => {
          const label = COLUMN_LABELS[col] || col;
          let val = item[col];

          // --- LOGIC FOR NESTED DATA ---

          // 1. Check inside 'flags' array
          const flagFields = [
            "allowCharging",
            "WorkforceRequired",
            "billableProject",
            "exportProject",
          ];
          if (flagFields.includes(col)) {
            val = item.flags?.find((f) => f.flagName === col)?.flagValue;
          }
          // 2. Check inside 'contract' object
          else if (item.contract && col in item.contract) {
            val = item.contract[col];
          }
          // 3. Check inside 'address' object
          else if (item.address && col in item.address) {
            val = item.address[col];
          }

          // --- FORMATTING ---
          if (val === null || val === undefined) {
            row[label] = "";
          } else if (val === "Y") {
            row[label] = "Yes";
          } else if (val === "s") {
            row[label] = "No";
          } else {
            row[label] = val;
          }
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(formattedRows);

      // 2. Formal Styles (Dark Teal Header)
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

      // 3. Apply Styles to Worksheet
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;
          ws[cellRef].s = R === 0 ? headerStyle : bodyStyle;
        }
      }

      // 4. Column Widths
      ws["!cols"] = columns.map(() => ({ wch: 20 }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Projects");
      XLSX.writeFile(
        wb,
        `Project_Master_${new Date().toLocaleDateString()}.xlsx`,
      );

      toast.success("Export successful");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to export data.");
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

        // --- STAGE 1: MAPPING & VALIDATION ---
        jsonRows.forEach((row, index) => {
          console.log(row);
          const projId = String(row["Project ID"] || "").trim();
          const rowNum = index + 2;

          if (!projId) return;

          // 1. Calculate Level (assuming dot separator for Project Hierarchy)
          const segments = projId.split(".");
          const calculatedLvl = segments.length;

          // 2. Hierarchy Validation
          // if (calculatedLvl > maxlevel) {
          //   validationErrors.push(`Row ${rowNum}: ID "${projId}" exceeds maximum level depth ${maxlevel}.`);
          //   return;
          // }

          // 3. Segment Length Validation against levelData rules
          for (let i = 0; i < segments.length; i++) {
            const currentLvl = i + 1;
            const rule = levelData.find((l) => l.level === currentLvl);
            if (rule && segments[i].length > rule.lenght) {
              validationErrors.push(
                `Row ${rowNum}: Level ${currentLvl} part ("${segments[i]}") exceeds allowed length of ${rule.lenght}.`,
              );
              return;
            }
          }

          // Helper to normalize Yes/No to Y/N
          const toFlag = (val) => (val === "Yes" || val === "Y" ? "Y" : "s");
          const toAGFlag = (val) => (val === "Yes" || val === "Y" ? "Y" : "N");

          // Helper to normalize Dates to YYYY-MM-DD
          const toDateStr = (val) => {
            if (!val) return null;
            try {
              const d = new Date(val);
              return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
            } catch {
              return null;
            }
          };

          // 4. Map Excel Labels back to Database Keys
          importedData.push({
            id: projId,
            projId: projId,
            displayId: projId,
            projName: row["Project Name"] || "",
            projLongName: row["Long Name"] || "",
            levelNo: calculatedLvl,
            projAbbrCd: row["Abbreviation"] || "",
            projTypeDc: row["Project Type"] || "",
            orgId: row["Org ID"] || "",
            companyId: row["Company ID"] || "",
            projMgrName: row["Project Manager"] || "",

            // Dates
            projStartDt: toDateStr(row["Start Date"]),
            projEndDt: toDateStr(row["End Date"]),

            // Flags
            activeFl: toFlag(row["Active"]),
            AcctGrpFl: toAGFlag(row["Acct Group Flag"]),
            // allowCharging: toFlag(row["Allow Charging"]),
            // billableProject: toFlag(row["Billable"]),
            // WorkforceRequired: toFlag(row["Workforce Req."]),

            flags: [
              {
                ProjectId: projId,
                flagName: "allowCharging",
                flagValue: toFlag(row["Allow Charging"]),
              },
              {
                ProjectId: projId,
                flagName: "WorkforceRequired",
                // Look inside the updated flags array in the row
                flagValue: toFlag(row["Workforce Req."]),
              },
              {
                ProjectId: projId,
                flagName: "billableProject",
                flagValue: toFlag(row["Billable"]),
              },
            ],

            // Fields
            acctGrpCd: row["Acct Group"] || "",
            classification: row["Classification"] || "",
            exportProject: row["Export Type"] || "",

            // Contract Info
            contract: {
              projectId: projId,
              cntrId: row["Contract ID"] || "",
              primeContrId: row["Prime Contract ID"] || "",
              subctrId: row["Subcontractor ID"] || "",
              custPoId: row["Customer PO ID"] || "",
              taskOrderNo: row["Task Order"] || "",
              oppId: row["Opportunity ID"] || "",
            },

            // Financials (Casting to Number)
            proj_v_tot_amt: Number(row["Total Value Amt"] || 0),
            proj_f_tot_amt: Number(row["Total Funded Amt"] || 0),
            proj_v_fee_amt: Number(row["Value Fee"] || 0),
            proj_v_cst_amt: Number(row["Value Cost"] || 0),
            proj_f_fee_amt: Number(row["Funded Fee"] || 0),
            proj_f_cst_amt: Number(row["Funded Cost"] || 0),
            projVAwdFeeAmt: Number(row["Value Award Fee"] || 0),
            projFAwdFeeAmt: Number(row["Funded Award Fee"] || 0),

            // Address
            address: {
              projectId: projId,
              ProjLn1Adr: row["Address Line 1"] || "",
              ProjLn2Adr: row["Address Line 2"] || "",
              ProjLn3Adr: row["Address Line 3"] || "",
              cityName: row["City"] || "",
              mailStateDc: row["State"] || "",
              postalCd: row["Postal Code"] || "",
              countryCd: row["Country"] || "",
            },
            hierarchy: [],
            modifiedBy: user?.name || "system_import",
            isNew: true,
            isDirty: true,
          });
        });

        if (validationErrors.length > 0) {
          return toast.error(`Import Blocked: ${validationErrors[0]}`);
        }

        // --- STAGE 2: SEQUENTIAL SAVING (Level 1 -> 2 -> 3...) ---
        setIsImporting(true);
        const successfulKeys = [];
        const saveErrors = [];

        const saveLevelBatch = async (level) => {
          const batch = importedData.filter((r) => r.levelNo === level);
          // Using for-of to ensure sequential processing within the level if needed,
          // or Promise.all for speed. Sequential by Level is the priority.
          for (const row of batch) {
            try {
              const response = await api.post(
                `${backendUrl}/api/ProjectMaster/CreateProject`,
                row,
              );
              if (response.status === 200 || response.status === 201) {
                successfulKeys.push(row.projId);
              }
            } catch (err) {
              console.log(err);
              saveErrors.push(
                `${row.projId}: ${err.response?.data || "Save Failed"}`,
              );
            }
          }
        };

        for (let i = 1; i <= maxlevel; i++) {
          await saveLevelBatch(i);
        }

        // --- STAGE 3: UI RECOVERY ---
        const failedRows = importedData.filter(
          (row) => !successfulKeys.includes(row.projId),
        );
        setLocalData((prev) => [...failedRows, ...prev]);

        if (successfulKeys.length > 0)
          toast.success(`Saved ${successfulKeys.length} projects.`);
        if (saveErrors.length > 0)
          toast.error(`${saveErrors.length} records failed.`);

        setIsImporting(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Import Error:", error);
      setIsImporting(false);
    } finally {
      e.target.value = "";
    }
  };

  const handleBulkSave = async () => {
    const rowsToSave = localData.filter((row) => row.isNew || row.isDirty);
    if (rowsToSave.length === 0) return toast.info("No changes to save.");

    console.log(rowsToSave);

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
        // const payload = {
        //   // Logic: If it's a new row, use the temporary displayId, otherwise use the fixed projId
        //   projId: row.isNew ? row.displayId : row.projId,

        //   projName: row.projName || null,
        //   projTypeDc: row.projTypeDc || null,
        //   orgId: row.orgId || null,
        //   companyId: row.companyId ? String(row.companyId) : null,
        //   projMgrName: row.projMgrName || null,
        //   projAbbrCd: row.projAbbrCd || null,
        //   projStartDt: row.projStartDt || null,
        //   projLongName: row.projLongName || "",
        //   projEndDt: row.projEndDt || null,

        //   // Boolean to Y/N conversion
        //   activeFl: row.activeFl ? "Y" : "N",

        //   // Audit and Metadata
        //   modifiedBy: user?.name || "system",
        //   acctGrpCd: row.acctGrpCd || null,
        //   levelNo: parseInt(row.levelNo) || 0,

        //   // Financials - ensuring they are numbers or 0
        //   proj_v_tot_amt: Number(row.financial?.proj_v_tot_amt) || 0,
        //   proj_f_tot_amt: Number(row.financial?.proj_f_tot_amt) || 0,
        //   proj_v_fee_amt: Number(row.financial?.proj_v_fee_amt) || 0,
        //   proj_v_cst_amt: Number(row.financial?.proj_v_cst_amt) || 0,
        //   proj_f_fee_amt: Number(row.financial?.proj_f_fee_amt) || 0,
        //   proj_f_cst_amt: Number(row.financial?.proj_f_cst_amt) || 0,
        //   projVAwdFeeAmt: Number(row.financial?.projVAwdFeeAmt) || 0,
        //   projFAwdFeeAmt: Number(row.financial?.projFAwdFeeAmt) || 0,

        //   // Logic for Account Group Flag
        //   AcctGrpFl:
        //     row.acctGrpCd && String(row.acctGrpCd).trim() !== "" ? "Y" : "N",

        //   // Nested Flags Array
        //   flags: [
        //     {
        //       ProjectId: row.isNew ? row.displayId : row.projId,
        //       flagName: "WorkforceRequired",
        //       flagValue: row.WorkforceRequired === "Y" ? "Y" : "s",
        //     },
        //     {
        //       ProjectId: row.isNew ? row.displayId : row.projId ,
        //       flagName: "allowCharging",
        //       flagValue: row.allowCharging === "Y" ? "Y" : "s",
        //     },
        //     {
        //       ProjectId: row.isNew ? row.displayId : row.projId,
        //       flagName: "billableProject",
        //       flagValue: row.billableProject === "Y" ? "Y" : "s",
        //     },
        //     {
        //       ProjectId: row.isNew ? row.displayId : row.projId,
        //       flagName: "AcctGrpFl",
        //       flagValue:
        //         row.acctGrpCd && String(row.acctGrpCd).trim() !== ""
        //           ? "Y"
        //           : "N",
        //     },
        //   ],

        //   hierarchy: null,

        //   // Nested Contract Object
        //   contract: {
        //     ProjectId: row.isNew ? row.displayId : row.projId,
        //     primeContrId: row.contract?.primeContrId || null,
        //     subctrId: row.contract?.subctrId || null,
        //     custPoId: row.contract?.custPoId || null,
        //     cntrId: row.contract?.cntrId || null,
        //     oppId: row.contract?.oppId || null,
        //     taskOrderNo: row.contract?.taskOrderNo || null,
        //   },

        //   // Nested Address Object
        //   address: {
        //     ProjectId: row.isNew ? row.displayId : row.projId,
        //     projLn1Adr: row.address?.projLn1Adr || null,
        //     projLn2Adr: row.address?.projLn2Adr || null,
        //     projLn3Adr: row.address?.projLn3Adr || null,
        //     cityName: row.address?.cityName || null,
        //     mailStateDc: row.address?.mailStateDc || null,
        //     postalCd: row.address?.postalCd || null,
        //     countryCd: row.address?.countryCd || null,
        //   },
        // };

        const payload = {
          // Use displayId for new rows, otherwise fixed projId
          projId: row.isNew ? row.displayId : row.projId,
          projName: row.projName || null,
          projTypeDc: row.projTypeDc || null,
          orgId: row.orgId || null,
          companyId: row.companyId ? String(row.companyId) : null,
          projMgrName: row.projMgrName || null,
          projAbbrCd: row.projAbbrCd || null,
          projStartDt: row.projStartDt || null,
          projLongName: row.projLongName || "",
          projEndDt: row.projEndDt || null,
          activeFl: row.activeFl === "Y" ? "Y" : "N",
          modifiedBy: user?.name || "system",
          acctGrpCd: row.acctGrpCd || null,
          levelNo: parseInt(row.levelNo) || 0,
          acctGrpFl:
            row.acctGrpCd && String(row.acctGrpCd).trim() !== "" ? "Y" : "N",

          // FIX 1: Financials are stored at the TOP LEVEL in your handleLocalChange
          proj_v_tot_amt: Number(row.proj_v_tot_amt) || 0,
          proj_f_tot_amt: Number(row.proj_f_tot_amt) || 0,
          proj_v_fee_amt: Number(row.proj_v_fee_amt) || 0,
          proj_v_cst_amt: Number(row.proj_v_cst_amt) || 0,
          proj_f_fee_amt: Number(row.proj_f_fee_amt) || 0,
          proj_f_cst_amt: Number(row.proj_f_cst_amt) || 0,
          projVAwdFeeAmt: Number(row.projVAwdFeeAmt) || 0,
          projFAwdFeeAmt: Number(row.projFAwdFeeAmt) || 0,

          // FIX 2: Correcting Flag mapping to use the "flags" array updated by handleLocalChange
          flags: [
            {
              ProjectId: row.isNew ? row.displayId : row.projId,
              flagName: "WorkforceRequired",
              // Look inside the updated flags array in the row
              flagValue:
                row.flags?.find((f) => f.flagName === "WorkforceRequired")
                  ?.flagValue === "Y"
                  ? "Y"
                  : "s",
            },
            {
              ProjectId: row.isNew ? row.displayId : row.projId,
              flagName: "allowCharging",
              flagValue:
                row.flags?.find((f) => f.flagName === "allowCharging")
                  ?.flagValue === "Y"
                  ? "Y"
                  : "s",
            },
            {
              ProjectId: row.isNew ? row.displayId : row.projId,
              flagName: "billableProject",
              flagValue:
                row.flags?.find((f) => f.flagName === "billableProject")
                  ?.flagValue === "Y"
                  ? "Y"
                  : "s",
            },
            // {
            //   ProjectId: row.isNew ? row.displayId : row.projId,
            //   flagName: "AcctGrpFl",
            //   flagValue: row.acctGrpCd && String(row.acctGrpCd).trim() !== "" ? "Y" : "N"
            // }
          ],

          // FIX 3: Ensure Contract and Address objects are sent as updated by handleLocalChange
          contract: row.contract || null,
          address: row.address || null,
        };

        const request = row.isNew
          ? api.post(`${backendUrl}/api/ProjectMaster/CreateProject`, payload)
          : api.put(`${backendUrl}/api/ProjectMaster/${row.projId}`, payload);

        return request
          .then(() => ({ status: "success", key: row.id || row.projId }))
          .catch((err) => ({
            status: "error",
            key: row.id || row.projId,
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
          prev.filter((row) => !successfulKeys.includes(row.id || row.projId)),
        );

        if (successfulKeys.length > 0) {
          toast.success(`Successfully saved ${successfulKeys.length} records.`);
        }

        if (errors.length > 0) {
          console.log(errors);
          const firstErrorMsg =
            errors[0].error.response?.data?.message ||
            errors[0].error?.response?.message ||
            errors[0].error?.message ||
            "Failed to save the Org.";
          toast.error(`${errors.length} failed: ${firstErrorMsg}`);
        } else {
          handleSearch(); // Refresh background data
        }
      } catch (error) {
        toast.error("An unexpected error occurred during org save.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // const handleFindReplace = () => {
  //   const {
  //     scope,
  //     column,
  //     findYear,
  //     // findMonth,
  //     // replaceYear,
  //     // replaceMonth,
  //     replaceValue,
  //     booleanMode,
  //   } = findReplaceConfig;

  //   // 1. Confirm with user
  //   if (!window.confirm(`Apply changes to ${scope} rows?`)) return;

  //   setLocalData((prev) => {
  //     return prev.map((item) => {
  //       const isHeader = Number(item.levelNo) < maxlevel;
  //       const isSelected = selectedRows.has(item.id || item.projId);

  //       // --- LEVEL & SCOPE GUARDS ---
  //       if (scope === "selected" && !isSelected) return item;

  //       // If it's a Header (Level 1/2), only allow 'acctName' changes.
  //       // This prevents adding 'detailFlag' or 'projectRequiredFlag' to Headers.
  //       if (isHeader && column !== "orgName") return item;

  //       let rowChanged = false;
  //       let updatedItem = { ...item };

  //       // CASE A: FLAG COLUMNS (Handling missing/undefined keys)
  //       if (column.endsWith("Fl")) {
  //         const currentValue = item[column] === "Y" ? "Y" : "N";
  //         let targetValue = currentValue;

  //         if (booleanMode === "invert" || booleanMode === "inverted") {
  //           // 1. If findYear is empty/All, flip everything
  //           // 2. If findYear is specified (Y or N), only flip matching rows
  //           const isMatch = findYear === "" || currentValue === findYear;

  //           if (isMatch) {
  //             targetValue = currentValue === "Y" ? "N" : "Y";
  //           }
  //         } else {
  //           // Standard "Set All To" logic
  //           targetValue =
  //             replaceValue === "Y" || replaceValue === true ? "Y" : "N";
  //         }

  //         if (currentValue !== targetValue) {
  //           updatedItem[column] = targetValue;
  //           rowChanged = true;
  //         }
  //       }

  //       // CASE B: DATE / PERIOD COLUMNS
  //       // else if (column === "startDate" || column === "endDate") {
  //       //   const fyKey = column === "startDate" ? "fyCdFrom" : "fyCdTo";
  //       //   const pdKey = column === "startDate" ? "pdNoFrom" : "pdNoTo";

  //       //   // If find fields are empty, we treat it as "Match All"
  //       //   const yearMatch =
  //       //     findYear === "" || String(item[fyKey] || "") === findYear;
  //       //   const monthMatch =
  //       //     findMonth === "" ||
  //       //     String(item[pdKey] || "") === String(Number(findMonth));

  //       //   if (yearMatch && monthMatch) {
  //       //     updatedItem[fyKey] = replaceYear;
  //       //     updatedItem[pdKey] = Number(replaceMonth);
  //       //     rowChanged = true;
  //       //   }
  //       // }

  //       // CASE C: STANDARD TEXT / SELECT
  //       else {
  //         const currentValue = String(item[column] || "");
  //         if (findYear === "" || currentValue === findYear) {
  //           if (item[column] !== replaceValue) {
  //             updatedItem[column] = replaceValue;
  //             rowChanged = true;
  //           }
  //         }
  //       }

  //       // Only return a new object if something actually changed
  //       return rowChanged ? { ...updatedItem, isDirty: true } : item;
  //     });
  //   });

  //   setShowFormPopup(false);
  //   toast.success("Update applied successfully.");
  // };

  const handleFindReplace = () => {
    const { scope, column, findYear, replaceValue, booleanMode } =
      findReplaceConfig;

    if (!window.confirm(`Apply changes to ${scope} rows?`)) return;

    setLocalData((prev) => {
      return prev.map((item) => {
        const isSelected = selectedRows.has(item.id || item.projId);
        if (scope === "selected" && !isSelected) return item;

        let rowChanged = false;
        let updatedItem = { ...item };

        // CASE A: FLAGS / CHECKBOXES (Y/N)
        if (
          column.endsWith("Fl") ||
          column.endsWith("Flag") ||
          column === "allowCharging"
        ) {
          const currentValue = item[column] === "Y" ? "Y" : "N";
          let targetValue = currentValue;

          if (booleanMode === "inverted") {
            const isMatch = findYear === "" || currentValue === findYear;
            if (isMatch) targetValue = currentValue === "Y" ? "N" : "Y";
          } else {
            targetValue = replaceValue;
          }

          if (currentValue !== targetValue) {
            updatedItem[column] = targetValue;
            rowChanged = true;
          }
        }

        // CASE B: NUMERIC FIELDS (Amounts and Levels)
        else if (
          column.includes("_amt") ||
          column === "levelNo" ||
          column === "lvlNo"
        ) {
          const currentValue = Number(item[column] || 0);
          const findVal = findYear === "" ? null : Number(findYear);

          // Match if 'Find' is empty OR if the numbers match exactly
          if (findVal === null || currentValue === findVal) {
            updatedItem[column] = Number(replaceValue);
            rowChanged = true;
          }
        }

        // CASE B.1: DATE FIELDS (Ends with Dt or contains Date)
        else if (
          column.endsWith("Dt") ||
          column.toLowerCase().includes("date")
        ) {
          // Normalize values to YYYY-MM-DD for comparison
          const currentValRaw = item[column] || "";
          const currentValDateOnly = currentValRaw.includes("T")
            ? currentValRaw.split("T")[0]
            : currentValRaw;

          const findValDateOnly = findYear; // This comes from your <input type="date" />

          // Match if 'Find' is empty OR if the dates match exactly
          if (findYear === "" || currentValDateOnly === findValDateOnly) {
            // If your backend needs the "T00:00:00" suffix, you can append it here
            // otherwise, just use replaceValue
            if (item[column] !== replaceValue) {
              updatedItem[column] = replaceValue;
              rowChanged = true;
            }
          }
        }

        // CASE C: STANDARD TEXT / DROPDOWNS
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
    toast.success("Update applied successfully.");
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
          <h2 className="text-lg font-bold text-gray-800">Manage Project</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full sm:w-auto">
          <label className="input-label">Project ID:</label>
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
                      findYear: "",
                      findMonth: "",
                      replaceYear: "",
                      replaceMonth: "",
                      // FIX: If it's a flag, default the replaceValue to 'Y' immediately
                      replaceValue: col.endsWith("Fl") ? "Y" : "",
                      booleanMode: "setAll",
                    });
                  }}
                >
                  <option value="" disabled>
                    -- Select Column --
                  </option>
                  <option value="projName">Project Name</option>
                  <option value="projLongName">Project Long Name</option>
                  <option value="projAbbrCd">Abbreviation</option>
                  <option value="projTypeDc">Project Type</option>
                  <option value="projMgrName">Project Manager</option>
                  <option value="orgId">Org ID</option>
                  <option value="companyId">Company ID</option>
                  <option value="levelNo">Level</option>
                  <option value="classification">Classification</option>
                  <option value="acctGrpCd">Acct Group Code</option>

                  <option value="activeFl">Active Status</option>
                  <option value="AcctGrpFl">Account Group Flag</option>
                  <option value="allowCharging">Allow Charging Status</option>
                  <option value="billableProject">Billable Status</option>
                  <option value="WorkforceRequired">Workforce Status</option>
                  <option value="exportProject">Export Status</option>

                  <option value="projStartDt">Start Date</option>
                  <option value="projEndDt">End Date</option>

                  <option value="primeContrId">Prime Contract ID</option>
                  <option value="subctrId">Subcontractor ID</option>
                  <option value="custPoId">Customer PO ID</option>
                  <option value="taskOrderNo">Task Order No</option>
                  <option value="cntrId">Contract ID</option>
                  <option value="oppId">Opportunity ID</option>

                  <option value="proj_v_tot_amt">Total Value Amt</option>
                  <option value="proj_f_tot_amt">Total Funded Amt</option>
                  <option value="proj_v_fee_amt">Value Fee Amt</option>
                  <option value="proj_v_cst_amt">Value Cost Amt</option>
                  <option value="proj_f_fee_amt">Funded Fee Amt</option>
                  <option value="proj_f_cst_amt">Funded Cost Amt</option>

                  <option value="projLn1Adr">Address Line 1</option>
                  <option value="cityName">City</option>
                  <option value="mailStateDc">State</option>
                  <option value="postalCd">Postal Code</option>
                  <option value="countryCd">Country Code</option>
                </select>
              </div>

              {/* DYNAMIC INPUTS SECTION */}
              {/* DYNAMIC INPUTS SECTION */}
              {findReplaceConfig.column === "lvlNo" ||
              findReplaceConfig.column === "levelNo" ? (
                /* LEVEL NUMBER SECTION */
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Find Level:
                    </label>
                    <input
                      type="number"
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
                </>
              ) : findReplaceConfig.column.includes("_amt") ? (
                /* NUMBER / AMOUNT FIELDS (e.g., proj_v_tot_amt) */
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Find Amount:
                    </label>
                    <input
                      type="number"
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
                      type="number"
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
              ) : findReplaceConfig.column.endsWith("Fl") ||
                findReplaceConfig.column.endsWith("Flag") ||
                findReplaceConfig.column === "allowCharging" ? (
                /* CHECKBOX / FLAG SECTION (Y/N) */
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
                      value={
                        findReplaceConfig.booleanMode === "inverted"
                          ? findReplaceConfig.findYear
                          : findReplaceConfig.replaceValue
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        findReplaceConfig.booleanMode === "inverted"
                          ? setFindReplaceConfig({
                              ...findReplaceConfig,
                              findYear: val,
                            })
                          : setFindReplaceConfig({
                              ...findReplaceConfig,
                              replaceValue: val,
                            });
                      }}
                    >
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </div>
                </div>
              ) : findReplaceConfig.column.toLowerCase().includes("date") ||
                findReplaceConfig.column.toLowerCase().includes("dt") ? (
                /* DATE SECTION */
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Find Date:
                    </label>
                    <input
                      type="date"
                      className="border outline-none border-gray-500 p-1.5 rounded w-40 bg-white"
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
                      type="date"
                      className="border outline-none border-gray-500 p-1.5 rounded w-40 bg-white"
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
              ) : (
                /* DEFAULT TEXT INPUT */
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
                {findReplaceConfig.column.endsWith("Fl") ? (
                  ""
                ) : (
                  <button onClick={handleFilterOnly} className="btn1 btn-blue">
                    Find
                  </button>
                )}

                {/* Execute Replace Button */}
                {findReplaceConfig.column === "lvlNo" ? (
                  ""
                ) : (
                  <button onClick={handleFindReplace} className="btn1 btn-blue">
                    Execute
                  </button>
                )}

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
                <OrgMasterForm
                  onClose={() => {
                    setShowNewPopup(false);
                    setEditPopup(false);
                  }}
                  selectedOrg={editPopup ? selectedOrg : null}
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
                    const isRequired = ["projId", "projName"].includes(col);

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
                      Search for an Org to view the details.
                    </td>
                  </tr>
                ) : (
                  localData.map((item) => {
                    // const isRestrictedLevel = item.lvlNo < maxlevel;
                    const isRestrictedLevel = item.levelNo === 1;
                    return (
                      <tr
                        key={item.id || item.projId}
                        className={`${selectedRows.has(item.projId) || item.isNew ? "bg-blue-50" : ""}  hover:bg-gray-50 transition-colors`}
                      >
                        <td
                          className={`p-1 text-center border-r border-b border-gray-300 `}
                        >
                          <input
                            type="checkbox"
                            // Use item.id if you implemented the unique temporary ID, otherwise item.projId
                            checked={selectedRows.has(item.id || item.projId)}
                            className={`h-3 w-3 accent-blue-600 ${
                              item.isNew
                                ? "cursor-not-allowed opacity-50 grayscale"
                                : "cursor-pointer"
                            }
                              `}
                            onChange={() => {
                              if (item.isNew) return; // Guard clause to prevent selection of new rows
                              const uniqueKey = item.id || item.projId;
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
                              item.isNew ? item.displayId : item.projId || ""
                            }
                            readOnly={!item.isNew}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                item.isNew ? "displayId" : "projId",
                                e.target.value,
                              )
                            }
                            placeholder={item.isNew ? "Enter ID..." : ""}
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded`}
                            value={item.projName}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projName",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 min-w-[50px] text-center">
                          <input
                            type="number"
                            className="w-full p-1 border bg-gray-100  border-gray-300  rounded"
                            value={item.levelNo}
                            disabled
                            onChange={(e) => {
                              if (e.target.value > 10) {
                                toast.warning(
                                  "Level number should be between 1 and 10",
                                );
                              } else {
                                handleLocalChange(
                                  item.id || item.projId,
                                  "levelNo",
                                  e.target.value,
                                );
                              }
                            }}
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.projLongName}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projLongName",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.projAbbrCd}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projAbbrCd",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <Select
                            value={revOptions.find(
                              (opt) => opt.value === item.projTypeDc,
                            )}
                            options={revOptions}
                            className={isRestrictedLevel ? "bg-gray-100" : ""}
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            isDisabled={isRestrictedLevel}
                            // className="rounded outline-none text-[10px]  bg-white w-[75%]"
                            menuPosition="fixed"
                            onChange={(opt) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projTypeDc",
                                opt.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <Select
                            value={orgOptions.find(
                              (opt) => opt.value === item.orgId,
                            )}
                            options={orgOptions}
                            className={isRestrictedLevel ? "bg-gray-100" : ""}
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            isDisabled={isRestrictedLevel}
                            // className="rounded outline-none text-[10px]  bg-white w-[75%]"
                            menuPosition="fixed"
                            onChange={(opt) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "orgId",
                                opt.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.companyId}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "companyId",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            disabled={isRestrictedLevel}
                            value={item?.hierarchy[0]?.projSegId || ""}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projSegId",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            disabled={isRestrictedLevel}
                            value={item?.hierarchy[0]?.projSegName || ""}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projSegName",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            disabled={isRestrictedLevel}
                            value={item.projMgrName}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projMgrName",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            disabled={isRestrictedLevel}
                            value={item.classification}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "classification",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <Select
                            value={projectExport.find(
                              (opt) => opt.value === item.exportProject,
                            )}
                            options={projectExport}
                            className={isRestrictedLevel ? "bg-gray-100" : ""}
                            styles={customStyles}
                            menuPortalTarget={document.body}
                            isDisabled={isRestrictedLevel}
                            // className="rounded outline-none text-[10px]  bg-white w-[75%]"
                            menuPosition="fixed"
                            onChange={(opt) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "exportProject",
                                opt.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 min-w-[50px] text-center">
                          <input
                            type="date"
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            disabled={isRestrictedLevel}
                            value={
                              item.projStartDt
                                ? item.projStartDt.split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              handleLocalChange(
                                item.projId || item.id,
                                "projStartDt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td
                          className={`px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center`}
                        >
                          <input
                            type="date"
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            disabled={isRestrictedLevel}
                            value={
                              item.projEndDt ? item.projEndDt.split("T")[0] : ""
                            }
                            onChange={(e) =>
                              handleLocalChange(
                                item.projId || item.id,
                                "projEndDt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            type="text"
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.contract?.primeContrId || ""}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.projId || item.id,
                                "primeContrId",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.contract?.subctrId}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "subctrId",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.contract?.custPoId}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "custPoId",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.contract?.taskOrderNo}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "taskOrderNo",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.contract?.cntrId}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "cntrId",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.contract?.oppId}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "oppId",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.acctGrpCd}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "acctGrpCd",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.proj_v_tot_amt}
                            type="number"
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "proj_v_tot_amt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.proj_f_tot_amt}
                            type="number"
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "proj_f_tot_amt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.proj_v_fee_amt}
                            type="number"
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "proj_v_fee_amt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.proj_v_cst_amt}
                            type="number"
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "proj_v_cst_amt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.proj_f_fee_amt}
                            type="number"
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "proj_f_fee_amt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.proj_f_cst_amt}
                            type="number"
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "proj_f_cst_amt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.projVAwdFeeAmt}
                            type="number"
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projVAwdFeeAmt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.projFAwdFeeAmt}
                            type="number"
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projFAwdFeeAmt",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.address?.projLn1Adr}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projLn1Adr",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.address?.projLn2Adr}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projLn2Adr",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.address?.projLn3Adr}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "projLn3Adr",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.address?.cityName}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "cityName",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.address?.mailStateDc}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "mailStateDc",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.address?.postalCd}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "postalCd",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            className={`w-full p-1 border  border-gray-300  rounded ${isRestrictedLevel ? "bg-gray-100" : ""}`}
                            value={item.address?.countryCd}
                            disabled={isRestrictedLevel}
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "countryCd",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            type="checkbox"
                            className="h-3 w-3 accent-blue-600"
                            checked={item["activeFl"] === "Y"}
                            disabled={
                              isRestrictedLevel
                              // (activeFl === "projectRequiredFlag" &&
                              //   !item.isNew)
                            }
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "activeFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            type="checkbox"
                            className="h-3 w-3 accent-blue-600"
                            checked={item["acctGrpFl"] === "Y"}
                            disabled
                            onChange={(e) =>
                              handleLocalChange(
                                item.id || item.projId,
                                "acctGrpFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                        </td>

                        {[
                          "allowCharging",
                          "billableProject",
                          "WorkforceRequired",
                        ].map((fieldName) => {
                          return (
                            <td
                              key={fieldName}
                              className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center"
                            >
                              <input
                                type="checkbox"
                                className="h-3 w-3 accent-blue-600"
                                disabled={isRestrictedLevel}
                                checked={
                                  item.flags?.find(
                                    (f) => f.flagName === fieldName,
                                  )?.flagValue === "Y"
                                }
                                onChange={(e) =>
                                  handleLocalChange(
                                    item.projId || item.id,
                                    fieldName,
                                    e.target.checked ? "Y" : "N",
                                  )
                                }
                              />
                              {/* <input
        type="checkbox"
        className="h-3 w-3 accent-blue-600"
        checked={isChecked}
        disabled={isRestrictedLevel}
        onChange={(e) =>
          handleLocalChange(
            item.id || item.projId,
            fieldName, // This triggers your state update
            e.target.checked ? "Y" : "N"
          )
        }
      /> */}
                            </td>
                          );
                        })}
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

export default OrgMaster;
