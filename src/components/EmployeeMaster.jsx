import api from "../utils/api";
import React, { useEffect, useState } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Download,
  Upload,
  Copy,
  ClipboardPaste,
  Save,
  X,
} from "lucide-react";
import Select from "react-select";
import EmployeeMasterForm from "./EmployeeMasterForm";

const EmployeeMaster = ({ canEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editPopup, setEditPopup] = useState(false);
  const [showNewPopup, setShowNewPopup] = useState(false);

  const [newRows, setNewRows] = useState([]);
  const [clipboardData, setClipboardData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [goToValue, setGoToValue] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [showFormPopup, setShowFormPopup] = useState(false);
  const [findReplaceConfig, setFindReplaceConfig] = useState({
    scope: "current",
    column: "firstName",
    findValue: "",
    replaceValue: "",
  });

  const [acctOptions, setAcctOptions] = useState([]);
  const [orgOptions, setOrgOptions] = useState([]);
  const fileInputRef = React.useRef(null);

  const DATE_COLUMNS = [
    "birthDt",
    "origHireDt",
    "adjHireDt",
    "termDt",
    "lastDayDt",
    "visaDt",
    "lastReviewDt",
    "nextReviewDt",
    "vetReleaseDt",
    "srExportDt",
    "hrsmartExportDt",
  ];

  const CHECKBOX_COLUMNS = [
    "contractorFl",
    "eligAutoPayFl",
    "disabledFl",
    "blindFl",
    "vetStatusD",
    "vetStatusA",
    "vetStatusRs",
    "vetStatusP",
    "vetStatusNp",
    "vetStatusO",
    "vetStatusV",
    "vetStatusR",
    "unionEmplFl",
    "pinUpdatedFl",
    "sftFl",
    "mesFl",
    "clockFl",
    "essUserFl",
    "huaActvMapFl",
  ];

  // Fix: Move origHireDt beside emplId
  const [columns] = useState([
    "emplId",
    "contractorFl",
    "ssnId",
    "sEmplStatusCd",
    "lastName",
    "firstName",
    "midName",
    "nameSfxCd",
    "lastFirstName",
    "birthDt",
    "origHireDt",
    "termDt",
    "lastDayDt",
    "adjHireDt",
    "taxbleEntityId",
    "tsPdCd",
    "lvPdCd",
    "locatorCd",
    "adminName",
    "prefName",
    "namePrfxCd",
    "prirName",
    "eligAutoPayFl",
    "createVendR",
    "vendor",
    "sexCd",
    "maritalCd",
    "sRaceCd",
    "raceDesc",
    "visaTypeCd",
    "visaDt",
    "lastReviewDt",
    "nextReviewDt",
    "birthCityName",
    "birthMailStateDc",
    "birthCountryCd",
    "mgrEmplId",
    "disabledFl",
    "blindFl",
    "vetStatusD",
    "activeDutyWartine",
    "vetStatusA",
    "vetStatusRs",
    "vetReleaseDt",
    "vetStatusP",
    "vetStatusNp",
    "vetStatusDeclined",
    "timesheetDA",
    "timesheetDO",
    "timesheetDP",
    "timesheetDG",
    "timesheetDPT",
    "timesheetDLL",
    "timesheetDWC",
    "timesheetDRNo1",
    "timesheetDRNo2",
    "ln1Adr",
    "ln2Adr",
    "ln3Adr",
    "cityName",
    "mailStateDc",
    "countyName",
    "postalCd",
    "countryCd",
    "emailId",
    "homeEmailId",
    "contName1",
    "contPhone1",
    "contRel1",
    "contName2",
    "contPhone2",
    "contRel2",
    "notes",
    "name",
    "prServEmplId",
    "govwiniqLoginId",
    "huaId",
    "huaActvMapFl",
    "plantId",
  ]);

  const COLUMN_LABELS = {
    emplId: "Employee ID",
    contractorFl: "Contractor", //checkbox
    ssnId: "Social Security No",
    sEmplStatusCd: "Status",
    lastName: "Last Name",
    firstName: "First Name",
    midName: "Middle Name",
    nameSfxCd: "Suffix",
    lastFirstName: "Displayed Name",
    birthDt: "Birth Date",
    origHireDt: "Current Hire Date",
    termDt: "Termination Date",
    lastDayDt: "Last Day Worked",
    adjHireDt: "Past Hire Date",
    taxbleEntityId: "Taxable Entity",
    tsPdCd: "Timesheet Cycle",
    lvPdCd: "Leave Cycle",
    locatorCd: "Locator Code",
    adminName: "Administrator Name",
    prefName: "Preferred Name",
    namePrfxCd: "Prefix",
    prirName: "Prior Name",
    eligAutoPayFl: "Eligible for Auto-Pay", //checkbox
    createVendR: "Create Vendor Record", //checkbox
    vendor: "Vendor",
    sexCd: "Gender",
    maritalCd: "Marital Status",
    sRaceCd: "Race",
    raceDesc: "Race Description",
    visaTypeCd: "Visa Type",
    visaDt: "Visa Date",
    lastReviewDt: "Last Review Date",
    nextReviewDt: "Next Review Date",
    birthCityName: "Birth City",
    birthMailStateDc: "Birth State",
    birthCountryCd: "Birth Country",
    mgrEmplId: "Manager ID",
    disabledFl: "Disabled", //checkbox
    blindFl: "Blind", //checkbox
    vetStatusD: "Disabled Veteran", //checkbox
    activeDutyWartine: "Active Duty Wartime", //checkbox
    vetStatusA: "Armed Forces Service Medal Veteran", //checkbox
    vetStatusRs: "Recently Separated Veteran", //checkbox
    vetReleaseDt: "Discharge Date",
    vetStatusP: "Protected Veteran ", //checkbox
    vetStatusNp: "Not a Protected Veteran ", //checkbox
    vetStatusDeclined: "Declined to Provide Veteran Status",
    timesheetDA: "Timesheet Defaults Account",
    timesheetDO: "Timesheet Defaults Organization",
    timesheetDP: "Timesheet Defaults Project",
    timesheetDG: "Timesheet Defaults GLC",
    timesheetDPT: "Timesheet Defaults Pay Type",
    timesheetDLL: "Timesheet Defaults Labor Location",
    timesheetDWC: "Timesheet Defaults Worker's Comp",
    timesheetDRNo1: "Timesheet Defaults Ref No 1",
    timesheetDRNo2: "Timesheet Defaults Ref No 2",
    ln1Adr: "Line 1",
    ln2Adr: "Line 2",
    ln3Adr: "Line 3",
    cityName: "City",
    mailStateDc: "State/Province",
    postalCd: "Postal Code",
    countryCd: "Country",
    emailId: "Work Email",
    homeEmailId: "Personal Email",
    contName1: "Contact 1 Name",
    contPhone1: "Contact 1 Phone",
    contRel1: "Contact 1 Relationship",
    contName2: "Contact 2 Name",
    contPhone2: "Contact 2 Phone",
    contRel2: "Contact 2 Relationship",
    notes: "Notes",
    name: "Name",
    countyName: "countyName",
    prServEmplId: "Payroll Service ID",
    govwiniqLoginId: "GovWin IQ ID",
    huaId: "Talent Mgt HUA ID",
    huaActvMapFl: "Active HUA ID Mapping", // checkbox
    plantId: "Plant",
  };

  const statusOptions = [
    { label: "Active", value: "ACT" },
    { label: "Inactive", value: "IN" },
  ];
  const sexOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Other", value: "O" },
  ];
  const maritalOptions = [
    { label: "Single", value: "S" },
    { label: "Married", value: "M" },
    { label: "Divorced", value: "D" },
    { label: "Widowed", value: "W" },
  ];
  const prefixOptions = [
    { label: "Mr.", value: "MR" },
    { label: "Ms.", value: "MS" },
    { label: "Mrs.", value: "MRS" },
    { label: "Dr.", value: "DR" },
  ];

  const raceOptions = [
    { label: "American Indian or Alaska Native", value: "AIAN" },
    { label: "Asian", value: "ASIAN" },
    { label: "Black or African American", value: "BLACK" },
    { label: "Hispanic or Latino", value: "HISPANIC" },
    { label: "Native Hawaiian or Pacific Islander", value: "NHPI" },
    { label: "White", value: "WHITE" },
    { label: "Two or More Races", value: "MULTI" },
  ];

  const visaOptions = [
    { label: "H-1B", value: "H1B" },
    { label: "L-1", value: "L1" },
    { label: "F-1 (OPT)", value: "F1" },
    { label: "J-1", value: "J1" },
    { label: "O-1", value: "O1" },
    { label: "TN", value: "TN" },
    { label: "Green Card", value: "GC" },
    { label: "Citizen", value: "CITIZEN" },
  ];

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "24px",
      height: "24px",
      fontSize: "11px",
      border: "1px solid #ccc",
      backgroundColor: "#fff",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 4px" }),
    indicatorsContainer: (base) => ({ ...base, height: "24px" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "24px",
      height: "24px",
      fontSize: "12px", // Set font size here
      // Grey background if Level 1 or 2
      backgroundColor: state.isDisabled ? "#f1f5f9" : "#ffffff",
      color: state.isDisabled ? "#94a3b8" : "#000000",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      boxShadow: "none",
      borderColor: "#ccc",
      "&:hover": {
        borderColor: "#ccc",
      },
    }),
    // This styles the text actually shown in the box
    singleValue: (provided, state) => ({
      ...provided,
      fontSize: "12px",
      color: state.isDisabled ? "#94a3b8" : "black",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 6px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "24px",
    }),
    // This styles the dropdown list items
    option: (provided) => ({
      ...provided,
      fontSize: "12px",
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

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const showDelete = selectedRows.size >= 1;

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Replace these URLs with your actual backend endpoints
        const [acctRes, orgRes] = await Promise.all([
          api.get(`${backendUrl}/api/Account/GetAllAccounts`),
          api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
        ]);

        // Map the response to the { value, label } format required by react-select
        setAcctOptions(
          acctRes.data.map((item) => ({
            value: item.acctId,
            label: `${item.acctId} - ${item.acctName}`,
          })),
        );

        setOrgOptions(
          orgRes.data.map((item) => ({
            value: item.orgId,
            label: `${item.orgId} - ${item.orgName}`,
          })),
        );
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const url = `${backendUrl}/api/EmployeeMaster?search=${searchTerm.trim()}&page=${currentPage}&pageSize=${pageSize}`;
      const res = await api.get(url);
      if (res.data && res.data.data) {
        const enrichedData = res.data.data.map((item) => ({
          ...item,
          isDirty: false,
        }));
        setData(enrichedData);
        setTotalPages(Math.ceil((res.data.totalRecords || 0) / pageSize) || 1);
      }
    } catch (error) {
      toast.error("Failed to retrieve employee data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage, pageSize, searchTrigger]);

  const handleBulkSave = async () => {
    const modifiedRows = data.filter((item) => item.isDirty);
    if (modifiedRows.length === 0 && newRows.length === 0)
      return toast.info("No changes to save.");

    // Validation
    const errors = [];
    for (const row of newRows) {
      if (!row.emplId || row.emplId.trim() === "") {
        errors.push("Employee ID is required");
      }
      if (!row.origHireDt || row.origHireDt.trim() === "") {
        errors.push("Current Hire Date is required");
      }
    }
    for (const row of modifiedRows) {
      if (!row.origHireDt || row.origHireDt.trim() === "") {
        errors.push("Current Hire Date is required");
      }
    }
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      return;
    }

    setIsLoading(true);
    try {
      for (const row of newRows) {
        const payload = transformForSave(row);
        await api.post(`${backendUrl}/api/EmployeeMaster`, {
          ...payload,
          // modifiedBy: "SystemUser",
        });
      }

      for (const row of modifiedRows) {
        const payload = transformForSave(row);
        await api.put(
          `${backendUrl}/api/EmployeeMaster/${row.emplId}`,
          payload,
        );
      }

      toast.success("Changes saved successfully.");
      setNewRows([]);
      handleSearch();
    } catch (error) {
      toast.error(
        error.response?.data?.title || "An error occurred during save.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterOnly = () => {
    const { column, findValue } = findReplaceConfig;
    if (!findValue) {
      handleSearch();
      return;
    }
    setData((prev) => {
      return prev.filter((item) => {
        const currentValue = String(
          getDisplayValue(item, column) || "",
        ).toLowerCase();
        return currentValue.includes(findValue.toLowerCase());
      });
    });
    toast.info("Table view filtered.");
  };

  // const handleFindReplace = () => {
  //   const { scope, column, findValue, replaceValue } = findReplaceConfig;
  //   const colLabel = COLUMN_LABELS[column] || column;
  //   const rowCount = scope === "selected" ? selectedRows.size : data.length + newRows.length;

  //   // Fix: Dynamic Professional message for blank replacement vs specific replace
  //   const message = findValue === ""
  //     ? `Fill blank records in "${colLabel}" with "${replaceValue}" for ${rowCount} record(s)?`
  //     : `Replace "${findValue}" with "${replaceValue}" in "${colLabel}" for ${rowCount} record(s)?`;

  //   if (!window.confirm(message)) return;

  //   const performUpdate = (item) => {
  //     const currentVal = String(getDisplayValue(item, column) || "").trim();

  //     // Fix: Case-insensitive match.
  //     // Fix: If findValue is blank, ONLY replace if current cell is truly blank.
  //     const isMatch = findValue === ""
  //       ? currentVal === ""
  //       : currentVal.toLowerCase() === findValue.toLowerCase();

  //     if (isMatch) {
  //       return { ...item, [column]: replaceValue, isDirty: true };
  //     }
  //     return item;
  //   };

  //   if (scope === "selected") {
  //     setData(prev => prev.map(item => selectedRows.has(item.emplId) ? performUpdate(item) : item));
  //     setNewRows(prev => prev.map(row => selectedRows.has(row.id) ? performUpdate(row) : row));
  //   } else {
  //     setData(prev => prev.map(performUpdate));
  //     setNewRows(prev => prev.map(performUpdate));
  //   }

  //   toast.success(`Records updated locally. Click "Save Changes" to commit.`);
  // };

  const handleFindReplace = () => {
    const { scope, column, findValue, replaceValue } = findReplaceConfig;
    const colLabel = COLUMN_LABELS[column] || column;
    const isFillingBlank = findValue.trim() === "";

    const confirmMessage = isFillingBlank
      ? `Fill missing values in "${colLabel}"?`
      : `Update records matching "${findValue}" in "${colLabel}"?`;

    if (!window.confirm(confirmMessage)) return;

    const performUpdate = (item) => {
      const currentVal = getDisplayValue(item, column).trim();
      const searchVal = findValue.trim();

      const isMatch = isFillingBlank
        ? currentVal === ""
        : currentVal.toLowerCase() === searchVal.toLowerCase();

      if (isMatch) {
        return { ...item, [column]: replaceValue, isDirty: true };
      }
      return item;
    };

    if (scope === "selected") {
      setData((prev) =>
        prev.map((item) =>
          selectedRows.has(item.emplId) ? performUpdate(item) : item,
        ),
      );
      setNewRows((prev) =>
        prev.map((row) =>
          selectedRows.has(row.id) ? performUpdate(row) : row,
        ),
      );
    } else {
      setData((prev) => prev.map(performUpdate));
      setNewRows((prev) => prev.map(performUpdate));
    }

    toast.success(`Records updated locally. Click "Save Changes" to commit.`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete ${selectedRows.size} records?`))
      return;
    setIsDeleting(true);
    try {
      for (let id of selectedRows) {
        await api.delete(`${backendUrl}/api/EmployeeMaster/${id}`);
      }
      toast.success("Records deleted successfully.");
      setSelectedRows(new Set());
      handleSearch();
    } catch (error) {
      toast.error("Deletion operation failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    const selectedEmployees = [
      ...data.filter((item) => selectedRows.has(item.emplId)),
      ...newRows.filter((row) => selectedRows.has(row.id)),
    ];

    if (selectedEmployees.length === 0) {
      return toast.info("Select at least one row to copy.");
    }

    const headerRow = columns
      .map((col) => COLUMN_LABELS[col] || col)
      .join("\t");
    const dataRows = selectedEmployees
      .map((emp) => columns.map((col) => getDisplayValue(emp, col)).join("\t"))
      .join("\n");

    const excelString = `${headerRow}\n${dataRows}`;

    navigator.clipboard.writeText(excelString).then(() => {
      setClipboardData(selectedEmployees);
      toast.info(`${selectedEmployees.length} row(s) copied to clipboard.`);
    });
  };

  const handlePaste = () => {
    if (!clipboardData || !Array.isArray(clipboardData)) {
      return toast.info("No data to paste.");
    }
    const entriesToPaste = clipboardData.map((item, index) => ({
      ...item,
      id: `temp-${Date.now()}-${index}`,
      emplId: "",
      isDirty: true,
    }));
    setNewRows((prev) => [...entriesToPaste, ...prev]);
    toast.success(`${entriesToPaste.length} row(s) pasted successfully.`);
  };

  const handleEdit = () => {
    // if (!canEdit("manageAccount")) return;
    const id = [...selectedRows][0];
    const employeeToEdit = data.find((item) => item.emplId === id);
    setSelectedEmployee(accountToEdit);
    setEditPopup(true);
  };

  const handleExport = () => {
    // Combine existing data and new rows to check for selection
    const allCurrentData = [...newRows, ...data];

    // If rows are selected, export only those. Otherwise, export the whole page.
    const exportTarget =
      selectedRows.size > 0
        ? allCurrentData.filter((item) =>
            selectedRows.has(item.id || item.emplId),
          )
        : allCurrentData;

    if (exportTarget.length === 0) {
      return toast.warning("No data available to export.");
    }

    try {
      const exportData = exportTarget.map((item) => {
        const row = {};
        columns.forEach((col) => {
          // Use the Label as the Excel Header, and getDisplayValue for the cell content
          const label = COLUMN_LABELS[col] || col;
          row[label] = getDisplayValue(item, col);
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

      // Generate file name with current date
      const dateStr = new Date().toISOString().split("T")[0];
      XLSX.writeFile(workbook, `Employee_Export_${dateStr}.xlsx`);

      toast.success(`Successfully exported ${exportTarget.length} records.`);
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Export operation failed.");
    }
  };

  // const getDisplayValue = (item, col) => {
  //   const formatDate = (val) => {
  //     if (!val) return "";
  //     if (typeof val === 'string' && val.includes('T')) return val.split('T')[0];
  //     return val;
  //   };
  //   if (item[col] !== undefined && item[col] !== null) {
  //     return DATE_COLUMNS.includes(col) ? formatDate(item[col]) : String(item[col]);
  //   }
  //   if (col.startsWith("addrLine")) {
  //     const idx = col.replace("addrLine", "");
  //     return item.addresses?.[0]?.[`line${idx}`] || "";
  //   }
  //   if (col === "contName1") return item.contacts?.[0]?.contactName || "";
  //   if (col === "contPhone1") return item.contacts?.[0]?.contactPhone || "";
  //   if (col === "contRel1") return item.contacts?.[0]?.contactRelation || "";
  //   if (col === "contName2") return item.contacts?.[1]?.contactName || "";
  //   if (col === "contPhone2") return item.contacts?.[1]?.contactPhone || "";
  //   if (col === "contRel2") return item.contacts?.[1]?.contactRelation || "";
  //   const acctFields = ["acctId", "orgId", "genlLabCatCd", "regPayType", "labLocCd", "workCompCd", "ref1Id", "ref2Id"];
  //   if (acctFields.includes(col)) return item.emplAcctOrgDflt?.[col] || "";
  //   return "";
  // };
  const getDisplayValue = (item, col) => {
    const formatDate = (val) => {
      if (!val) return "";
      if (typeof val === "string" && val.includes("T"))
        return val.split("T")[0];
      return val;
    };

    // Standard Fields
    if (item[col] !== undefined && item[col] !== null) {
      return DATE_COLUMNS.includes(col)
        ? formatDate(item[col])
        : String(item[col]);
    }

    // Nested Address Logic
    if (col.startsWith("addrLine")) {
      const idx = col.replace("addrLine", "");
      return item.addresses?.[0]?.[`line${idx}`] || "";
    }

    // Nested Contacts Logic
    if (col === "contName1") return item.contacts?.[0]?.contactName || "";
    if (col === "contPhone1") return item.contacts?.[0]?.contactPhone || "";
    if (col === "contRel1") return item.contacts?.[0]?.contactRelation || "";
    if (col === "contName2") return item.contacts?.[1]?.contactName || "";
    if (col === "contPhone2") return item.contacts?.[1]?.contactPhone || "";
    if (col === "contRel2") return item.contacts?.[1]?.contactRelation || "";

    // Nested Account/Org Logic
    const acctFields = [
      "acctId",
      "orgId",
      "genlLabCatCd",
      "regPayType",
      "labLocCd",
      "workCompCd",
      "ref1Id",
      "ref2Id",
    ];
    if (acctFields.includes(col)) return item.emplAcctOrgDflt?.[col] || "";

    return "";
  };

  // const transformForSave = (row) => {
  //   // Fix: Helper to ensure empty strings are converted to null to prevent API validation errors
  //   const val = (col) => {
  //     const v = getDisplayValue(row, col);
  //     return (v === "" || v === null) ? null : v;
  //   };
  //   const employeeId = val("emplId");

  //   return {
  //     emplId: employeeId,
  //     ssnId: val("ssnId"),
  //     origHireDt: val("origHireDt"), // Correctly handles DateTime conversion error
  //     adjHireDt: val("adjHireDt"),
  //     termDt: val("termDt"),
  //     sEmplStatusCd: val("sEmplStatusCd") || "ACT",
  //     firstName: val("firstName"),
  //     midName: val("midName"),
  //     lastName: val("lastName"),
  //     prefName: val("prefName"),
  //     birthDt: val("birthDt"),
  //     sexCd: val("sexCd"),
  //     maritalCd: val("maritalCd"),
  //     cityName: val("birthCityName"),
  //     countyName: val("countyName") || "",
  //     countryCd: val("countryCd"),
  //     mailStateDc: val("mailStateDc"),
  //     postalCd: val("postalCd"),
  //     emailId: val("emailId"),
  //     homeEmailId: val("homeEmailId"),
  //     modifiedBy: "SystemUser",
  //     managerId: val("managerId"), // Will be null if empty
  //     nameSfxCd: val("nameSfxCd"),
  //     namePrfxCd: val("namePrfxCd"),
  //     locatorCd: val("locatorCd"),
  //     lastDayDt: val("lastDayDt"),
  //     addresses: [{
  //       emplId: employeeId,
  //       addrType: val("addrType") || "",
  //       line1: val("ln1Adr"),
  //       line2: val("ln2Adr"),
  //       line3: val("ln3Adr"),
  //       cityName: val("cityName"),
  //       stateDc: val("mailStateDc"),
  //       postalCd: val("postalCd"),
  //       countryCd: val("countryCd")
  //     }].filter(a => a.line1),
  //     emails: [
  //       { emplId: employeeId, emailType: "Work", emailId: val("emailId") },
  //       { emplId: employeeId, emailType: "Personal", emailId: val("homeEmailId") }
  //     ].filter(e => e.emailId),
  //     contacts: [
  //       { emplId: employeeId, contactType: "Emergency", contactName: val("contName1"), contactPhone: val("contPhone1"), contactRelation: val("contRel1") },
  //       { emplId: employeeId, contactType: "Secondary", contactName: val("contName2"), contactPhone: val("contPhone2"), contactRelation: val("contRel2") }
  //     ].filter(c => c.contactName),
  //     emplAcctOrgDflt: {
  //       emplId: employeeId,
  //       acctId: val("acctId"),
  //       orgId: val("orgId"),
  //       genlLabCatCd: val("genlLabCatCd"),
  //       regPayType: val("regPayType"),
  //       labLocCd: val("labLocCd"),
  //       workCompCd: val("workCompCd"),
  //       ref1Id: val("ref1Id"),
  //       ref2Id: val("ref2Id")
  //     },
  //     labors: [],
  //     projectEmployees: []
  //   };
  // };

  const transformForSave = (row) => {
    const getVal = (col) => {
      const v = getDisplayValue(row, col);
      return v === "" || v === null ? null : v;
    };

    const getBoolVal = (col) => {
      const v = row[col];
      return v === true || v === "true" ? true : false;
    };

    const employeeId = getDisplayValue(row, "emplId");

    return {
      emplId: employeeId,
      lvPdCd: getVal("lvPdCd"),
      taxbleEntityId: getVal("taxbleEntityId"),
      ssnId: getVal("ssnId") || "",
      origHireDt: getVal("origHireDt"),
      adjHireDt: getVal("adjHireDt"),
      termDt: getVal("termDt"),
      sEmplStatusCd: getVal("sEmplStatusCd") || "ACT",
      spvsrName: getVal("spvsrName"),
      lastName: getVal("lastName") || "",
      firstName: getVal("firstName") || "",
      midName: getVal("midName") || "",
      prefName: getVal("prefName") || "",
      namePrfxCd: getVal("namePrfxCd") || "",
      nameSfxCd: getVal("nameSfxCd") || "",
      notes: getVal("notes"),
      tsPdCd: getVal("tsPdCd"),
      birthDt: getVal("birthDt"),
      cityName: getVal("cityName") || "",
      countryCd: getVal("countryCd") || "USA",
      lastFirstName: getVal("lastFirstName"),
      ln1Adr: getVal("ln1Adr") || "",
      ln2Adr: getVal("ln2Adr") || "",
      ln3Adr: getVal("ln3Adr") || "",
      mailStateDc: getVal("mailStateDc") || "",
      postalCd: getVal("postalCd") || "",
      modifiedBy: "SystemUser",
      locatorCd: getVal("locatorCd") || "",
      prirName: getVal("prirName"),
      companyId: row.companyId || "",
      lastReviewDt: getVal("lastReviewDt"),
      nextReviewDt: getVal("nextReviewDt"),
      sexCd: getVal("sexCd") || "",
      maritalCd: getVal("maritalCd") || "",
      eligAutoPayFl: getBoolVal("eligAutoPayFl"),
      emailId: getVal("emailId"),
      homeEmailId: getVal("homeEmailId"),
      mgrEmplId: getVal("mgrEmplId"),
      sRaceCd: getVal("sRaceCd"),
      prServEmplId: getVal("prServEmplId"),
      countyName: getVal("countyName"),
      tsPdRegHrsNo: row.tsPdRegHrsNo || 0,
      payPdRegHrsNo: row.payPdRegHrsNo || 0,
      disabledFl: getBoolVal("disabledFl"),
      mosReviewNo: row.mosReviewNo || 0,
      contName1: getVal("contName1") || "",
      contName2: getVal("contName2") || "",
      contPhone1: getVal("contPhone1") || "",
      contPhone2: getVal("contPhone2") || "",
      contRel1: getVal("contRel1") || "",
      contRel2: getVal("contRel2") || "",
      unionEmplFl: getBoolVal("unionEmplFl"),
      visaTypeCd: getVal("visaTypeCd"),
      vetStatusS: getBoolVal("vetStatusS"),
      vetStatusV: getBoolVal("vetStatusV"),
      vetStatusO: getBoolVal("vetStatusO"),
      vetStatusR: getBoolVal("vetStatusR"),
      essPinId: getVal("essPinId"),
      pinUpdatedFl: getBoolVal("pinUpdatedFl"),
      sEssCosCd: getVal("sEssCosCd"),
      rowversion: row.rowversion || "",
      vetReleaseDt: getVal("vetReleaseDt"),
      contractorFl: getBoolVal("contractorFl"),
      blindFl: getBoolVal("blindFl"),
      visaDt: getVal("visaDt"),
      vetStatusD: getBoolVal("vetStatusD"),
      vetStatusA: getBoolVal("vetStatusA"),
      timeEntryType: getVal("timeEntryType"),
      badgeGroup: getVal("badgeGroup"),
      badgeId: getVal("badgeId"),
      loginId: getVal("loginId"),
      sftFl: getBoolVal("sftFl"),
      mesFl: getBoolVal("mesFl"),
      clockFl: getBoolVal("clockFl"),
      plantId: getVal("plantId"),
      emplSourceCd: getVal("emplSourceCd"),
      srExportDt: getVal("srExportDt"),
      hrsmartExportDt: getVal("hrsmartExportDt"),
      vetStatusP: getBoolVal("vetStatusP"),
      birthCityName: getVal("birthCityName"),
      birthMailStateDc: getVal("birthMailStateDc"),
      birthCountryCd: getVal("birthCountryCd"),
      userLoginId: getVal("userLoginId"),
      emplAuthMthd: getVal("emplAuthMthd"),
      essUserFl: getBoolVal("essUserFl"),
      lastDayDt: getVal("lastDayDt"),
      govwiniqLoginId: getVal("govwiniqLoginId"),
      huaId: getVal("huaId"),
      huaActvMapFl: getBoolVal("huaActvMapFl"),
      vetStatusNp: getBoolVal("vetStatusNp"),
      vetStatusDeclined: getBoolVal("vetStatusDeclined"),
      vetStatusRs: getBoolVal("vetStatusRs"),
    };
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleLocalChange = (id, field, value, isNew = false) => {
    const updater = isNew ? setNewRows : setData;
    updater((prev) =>
      prev.map((r) =>
        (isNew ? r.id : r.emplId) === id
          ? { ...r, [field]: value, isDirty: true }
          : r,
      ),
    );
  };

  const getOptionsForColumn = (col) => {
    if (CHECKBOX_COLUMNS.includes(col)) return null; // Checkboxes don't have options
    if (col === "sEmplStatusCd") return statusOptions;
    if (col === "sexCd") return sexOptions;
    if (col === "maritalCd") return maritalOptions;
    if (col === "namePrfxCd") return prefixOptions;
    if (col === "sRaceCd") return raceOptions;
    if (col === "visaTypeCd") return visaOptions;
    return null;
  };

  return (
    <div className="p-1 sm:p-2 space-y-2 text-sm sm:text-base text-gray-800 font-inter">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-2 bg-white rounded-sm p-4 shadow-sm">
          <BriefcaseBusiness size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">Manage Employee</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full sm:w-auto">
          <label className="input-label">Employee ID:</label>
          <input
            type="text"
            className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="btn1 btn-blue cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1 shadow-sm">
        {showFormPopup && (
          <div className="bg-gray-50 p-4 border border-gray-300 rounded mb-4 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-wrap items-end gap-4 text-xs">
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
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-gray-600">
                  In Column:
                </label>
                <select
                  className="border border-gray-500 outline-none p-1.5 rounded bg-white w-40"
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
                  {/* Fix: Remove Employee ID from selection list */}
                  {columns
                    .filter((col) => col !== "emplId")
                    .map((col) => (
                      <option key={col} value={col}>
                        {COLUMN_LABELS[col]?.replace("*", "") || col}
                      </option>
                    ))}
                </select>
              </div>

              {getOptionsForColumn(findReplaceConfig.column) ? (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Find Value:
                    </label>
                    <select
                      className="border border-gray-500 p-1.5 rounded w-32 outline-none bg-white"
                      value={findReplaceConfig.findValue}
                      onChange={(e) =>
                        setFindReplaceConfig({
                          ...findReplaceConfig,
                          findValue: e.target.value,
                        })
                      }
                    >
                      {/* Fix: Hide "Any" if it is Status column */}
                      {findReplaceConfig.column !== "sEmplStatusCd" && (
                        <option value="">Any</option>
                      )}
                      {getOptionsForColumn(findReplaceConfig.column).map(
                        (o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="pb-2 font-bold text-gray-400">→</div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Replace With:
                    </label>
                    <select
                      className="border border-gray-500 p-1.5 rounded w-32 outline-none bg-white"
                      value={findReplaceConfig.replaceValue}
                      onChange={(e) =>
                        setFindReplaceConfig({
                          ...findReplaceConfig,
                          replaceValue: e.target.value,
                        })
                      }
                    >
                      {/* Fix: Hide "Select..." if it is Status column */}
                      {findReplaceConfig.column !== "sEmplStatusCd" && (
                        <option value="">Select...</option>
                      )}
                      {getOptionsForColumn(findReplaceConfig.column).map(
                        (o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">
                      Find Value:
                    </label>
                    <input
                      type="text"
                      className="border border-gray-500 p-1.5 rounded w-32 outline-none"
                      placeholder="Blank to fill data"
                      value={findReplaceConfig.findValue}
                      onChange={(e) =>
                        setFindReplaceConfig({
                          ...findReplaceConfig,
                          findValue: e.target.value,
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
                      className="border border-gray-500 p-1.5 rounded w-32 outline-none"
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

              <div className="flex items-center gap-3 ml-auto border-l pl-4 border-gray-300">
                <button onClick={handleFilterOnly} className="btn1 btn-blue">
                  Find
                </button>
                <button onClick={handleFindReplace} className="btn1 btn-blue">
                  Execute
                </button>
                <button
                  onClick={() => {
                    setShowFormPopup(false);
                    handleSearch();
                  }}
                  className="btn1 btn-blue"
                >
                  Reset & Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center mb-2 gap-1 w-full justify-between flex-wrap">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setNewRows([
                  {
                    id: `temp-${Date.now()}`,
                    emplId: "",
                    sEmplStatusCd: "ACT",
                  },
                  ...newRows,
                ])
              }
              className="btn1 btn-blue"
            >
              New Employee
            </button>
            {(newRows.length > 0 || data.some((i) => i.isDirty)) && (
              <>
                <button onClick={handleBulkSave} className="btn1 btn-blue">
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setNewRows([]);
                    handleSearch();
                  }}
                  className="btn1 btn-blue"
                >
                  Discard Changes
                </button>
              </>
            )}
            {/* Fix: Toggle button text to "Close" when modal is open */}
            <button
              onClick={() => setShowFormPopup(!showFormPopup)}
              className="btn1 btn-blue"
            >
              {showFormPopup ? "Close Find Replace" : "Find Replace"}
            </button>
            {selectedRows.size > 0 && (
              <button
                onClick={handleCopy}
                className="btn1 btn-blue flex items-center gap-1"
              >
                <Copy size={14} /> Copy
              </button>
            )}
            {clipboardData && selectedRows.size > 0 && (
              <button
                onClick={handlePaste}
                className="btn1 btn-blue flex items-center gap-1"
              >
                <ClipboardPaste size={14} /> Paste
              </button>
            )}
            <div className={`${showDelete ? "inline-flex" : "hidden"}`}>
              <button
                className="btn1 px-4 py-1.5 btn-red"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                Delete ({selectedRows.size})
              </button>
            </div>
          </div>
          <div className="flex gap-x-2">
            <button className="btn1 btn-blue flex items-center gap-1">
              <Upload size={14} /> Import
            </button>
            <button
              onClick={handleExport}
              className="btn1 btn-blue flex items-center gap-1"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="rounded border border-gray-200 overflow-hidden relative">
          {(showNewPopup || editPopup) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Modal Container: Sets the boundaries */}
              <div className="relative bg-white w-full max-w-5xl h-fit max-h-[95vh] min-h-[55vh]  lg:max-h-[90vh] flex flex-col animate-premium-popup shadow-2xl rounded-lg overflow-hidden">
                <EmployeeMasterForm
                  onClose={() => {
                    setShowNewPopup(false);
                    setEditPopup(false);
                  }}
                  selectedEmployee={editPopup ? selectedEmployee : null}
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
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={() =>
                        setSelectedRows(
                          isAllSelected
                            ? new Set()
                            : new Set(data.map((d) => d.emplId)),
                        )
                      }
                    />
                  </th>
                  {columns.map((col) => {
                    const isRequired = ["emplId", "origHireDt"].includes(col);
                    return (
                      <th
                        key={col}
                        className={`th-thead text-[10px] font-bold text-gray-600 text-center py-1 ${DATE_COLUMNS.includes(col) ? "min-w-[150px]" : "min-w-[120px]"}`}
                      >
                        {COLUMN_LABELS[col] || col}
                        <span className="text-red-500">
                          {isRequired ? "*" : ""}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      // colSpan={columns.length + 1}
                      colSpan={5}
                      className="text-center py-10"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (
                  [...newRows, ...data].map((item) => {
                    const isNew = !!item.id;
                    const rowId = isNew ? item.id : item.emplId;
                    return (
                      <tr
                        key={rowId}
                        className={`${selectedRows.has(rowId) ? "bg-blue-50" : ""} hover:bg-gray-50 transition-colors`}
                        onDoubleClick={() => {
                          setSelectedEmployee(item);
                          setEditPopup(true);
                        }}
                      >
                        <td className="text-center border-r border-gray-300">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(rowId)}
                            onChange={() => toggleRow(rowId)}
                          />
                        </td>
                        {columns.map((col) => {
                          const isCheckbox = CHECKBOX_COLUMNS.includes(col);
                          const isAcct = col === "acctId";
                          const isOrg = col === "orgId";

                          // Handle checkboxes
                          if (isCheckbox) {
                            return (
                              <td
                                key={col}
                                className="p-2 border-r border-b border-gray-200 text-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    item[col] === true || item[col] === "true"
                                  }
                                  onChange={(e) =>
                                    handleLocalChange(
                                      rowId,
                                      col,
                                      e.target.checked,
                                      isNew,
                                    )
                                  }
                                  className="cursor-pointer"
                                />
                              </td>
                            );
                          }

                          // Determine which options to use
                          const currentOptions = isAcct
                            ? acctOptions
                            : isOrg
                              ? orgOptions
                              : getOptionsForColumn(col);

                          if (isAcct || isOrg) {
                            return (
                              <td
                                key={col}
                                className={`px-2 py-1 border-r border-b font-normal border-gray-300 text-gray-900 text-center min-w-[150px]`}
                              >
                                <Select
                                  options={currentOptions}
                                  // Find the label matching the current value in the item
                                  value={
                                    currentOptions.find(
                                      (o) => o.value === item[col],
                                    ) || null
                                  }
                                  styles={customStyles}
                                  menuPortalTarget={document.body}
                                  menuPosition="fixed"
                                  // placeholder={`Select ${isAcct ? "Account" : "Org"}...`}
                                  placeholder={`Select`}
                                  onChange={(opt) =>
                                    handleLocalChange(
                                      rowId,
                                      col,
                                      opt.value,
                                      isNew,
                                    )
                                  }
                                />
                              </td>
                            );
                          }

                          return (
                            <td
                              key={col}
                              className="p-1 border-r border-b border-gray-200"
                            >
                              {getOptionsForColumn(col) ? (
                                <Select
                                  options={getOptionsForColumn(col)}
                                  styles={customSelectStyles}
                                  menuPortalTarget={document.body}
                                  value={getOptionsForColumn(col).find(
                                    (o) => o.value === item[col],
                                  )}
                                  onChange={(opt) =>
                                    handleLocalChange(
                                      rowId,
                                      col,
                                      opt.value,
                                      isNew,
                                    )
                                  }
                                />
                              ) : (
                                <input
                                  type={
                                    DATE_COLUMNS.includes(col) ? "date" : "text"
                                  }
                                  className={`w-full text-xs p-1 outline-none border rounded border-gray-300 bg-white ${col === "emplId" && !isNew ? "bg-gray-100 cursor-not-allowed border-none shadow-none" : ""}`}
                                  value={getDisplayValue(item, col)}
                                  readOnly={col === "emplId" && !isNew}
                                  onChange={(e) =>
                                    handleLocalChange(
                                      rowId,
                                      col,
                                      e.target.value,
                                      isNew,
                                    )
                                  }
                                />
                              )}
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

          <div className="w-full bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 text-sm text-gray-900">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-[#17414d] cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#17414d] text-white font-bold">
                {currentPage}
              </button>
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-[#17414d] cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
            <div className="relative flex items-center rounded px-2 bg-white">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent py-1 pr-4 pl-1 outline-none cursor-pointer text-black"
              >
                <option value={15}>15 / page</option>
                <option value={25}>25 / page</option>
                <option value={35}>35 / page</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 text-gray-400 pointer-events-none"
              />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="font-semibold">Go to</span>
              <input
                type="text"
                value={goToValue}
                onChange={(e) =>
                  setGoToValue(e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(Number(goToValue));
                    setGoToValue("");
                  }
                }}
                className="w-12 border border-gray-200 outline-none bg-white rounded py-1 text-center transition-all "
              />
              <span className="font-semibold">Page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMaster;
