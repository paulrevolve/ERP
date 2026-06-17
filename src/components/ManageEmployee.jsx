import React, { useState, useEffect } from "react";
import {
  User,
  MessageSquare,
  Briefcase,
  MapPin,
  Calendar,
  Replace,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { MainContainer, Toolbar } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import {
  EmployeeInfoTab,
  HrDataTab,
  AddressContactTab,
  TimesheetDefaultsTab,
  ProductInterfaceTab,
  NotesTab,
  SalaryLeaveNestedContainer,
} from "./EmployeeSubComponents";
import { FormSection, FormInput } from "../helper/formSection";
import { backendUrl } from "./config";

const ManageEmployee = () => {
  const [isFormView, setIsFormView] = useState(false);
  const [activeTab, setActiveTab] = useState("employeeInfo"); // Camel Case IDs
  // const [activeNestedTab, setActiveNestedTab] = useState("");
  const [activeNestedTabs, setActiveNestedTabs] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [employees, setEmployees] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchColumn, setSearchColumn] = useState("emplId");

  const [clipboard, setClipboard] = useState([]);

  const [masterEmployees, setMasterEmployees] = useState([]);

  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);

  const [selectedRowKey, setSelectedRowKey] = useState("");

  const [sortOrder, setSortOrder] = useState("");

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "24px",
      height: "24px",
      fontSize: "11px",
      borderColor: "#ccc",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 4px" }),
    indicatorsContainer: (base) => ({ ...base, height: "24px" }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const statusOptions = [
    { label: "Active", value: "ACT" },
    { label: "Inactive", value: "IN" },
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
    { label: "Green Card", value: "GC" },
    { label: "Citizen", value: "CITIZEN" },
  ];

  const employeeTableColumns = [
    // Primary Identifiers
    {
      id: "emplId",
      value: "emplId",
      label: "Employee *",
      key: "emplId",
      allowReplace: false,
      readOnlyIfExisting: true,
    },
    {
      id: "contractorFl",
      value: "contractorFl",
      label: "Contractor",
      key: "contractorFl",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "ssnId",
      value: "ssnId",
      label: "Social Security Number *",
      key: "ssnId",
      allowReplace: true,
    },
    {
      id: "origHireDt",
      value: "origHireDt",
      label: "Current Hire Date *",
      key: "origHireDt",
      type: "date",
      allowReplace: true,
    },
    {
      id: "sEmplStatusCd",
      value: "sEmplStatusCd",
      label: "Status *",
      key: "sEmplStatusCd",
      type: "select",
      options: statusOptions,
      optionLabel: "label",
      optionValue: "value",
      allowReplace: true,
    },

    // Name Details
    {
      id: "lastName",
      value: "lastName",
      label: "Last Name *",
      key: "lastName",
      allowReplace: true,
    },
    {
      id: "firstName",
      value: "firstName",
      label: "First Name *",
      key: "firstName",
      allowReplace: true,
    },
    {
      id: "midName",
      value: "midName",
      label: "Middle Name",
      key: "midName",
      allowReplace: true,
    },
    {
      id: "nameSfxCd",
      value: "nameSfxCd",
      label: "Suffix",
      key: "nameSfxCd",
      allowReplace: true,
    },
    {
      id: "prefName",
      value: "prefName",
      label: "Displayed Name",
      key: "prefName",
      allowReplace: true,
    },
    {
      id: "birthDt",
      value: "birthDt",
      label: "Birth Date",
      key: "birthDt",
      type: "date",
      allowReplace: true,
    },

    // Dates
    {
      id: "termDt",
      value: "termDt",
      label: "Termination Date",
      key: "termDt",
      type: "date",
      allowReplace: true,
    },
    {
      id: "lastDayDt",
      value: "lastDayDt",
      label: "Last Day Worked",
      key: "lastDayDt",
      type: "date",
      allowReplace: true,
    },
    {
      id: "adjHireDt",
      value: "adjHireDt",
      label: "Past Hire Date",
      key: "adjHireDt",
      type: "date",
      allowReplace: true,
    },

    // Cycles & Administration
    {
      id: "taxbleEntityId",
      value: "taxbleEntityId",
      label: "Taxable Entity *",
      key: "taxbleEntityId",
      allowReplace: true,
    },
    {
      id: "tsPdCd",
      value: "tsPdCd",
      label: "Timesheet Cycle",
      key: "tsPdCd",
      allowReplace: true,
    },
    {
      id: "lvPdCd",
      value: "lvPdCd",
      label: "Leave Cycle",
      key: "lvPdCd",
      allowReplace: true,
    },
    {
      id: "locatorCd",
      value: "locatorCd",
      label: "Locator Code",
      key: "locatorCd",
      allowReplace: true,
    },
    {
      id: "spvsrName",
      value: "spvsrName",
      label: "Administrator Name",
      key: "spvsrName",
      allowReplace: true,
    },
    {
      id: "prefNameField",
      value: "prefNameField",
      label: "Preferred Name",
      key: "prefName",
      allowReplace: true,
    },
    {
      id: "namePrfxCd",
      value: "namePrfxCd",
      label: "Prefix",
      key: "namePrfxCd",
      allowReplace: true,
    },
    {
      id: "prirName",
      value: "prirName",
      label: "Prior Name",
      key: "prirName",
      allowReplace: true,
    },
    {
      id: "eligAutoPayFl",
      value: "eligAutoPayFl",
      label: "Eligible For Auto Pay",
      key: "eligAutoPayFl",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "companyId",
      value: "companyId",
      label: "Vendor",
      key: "companyId",
      allowReplace: true,
    },

    // Demographics
    {
      id: "sexCd",
      value: "sexCd",
      label: "Gender",
      key: "sexCd",
      allowReplace: true,
    },
    {
      id: "maritalCd",
      value: "maritalCd",
      label: "Marital Status",
      key: "maritalCd",
      allowReplace: true,
    },
    {
      id: "sRaceCd",
      value: "sRaceCd",
      label: "Race",
      key: "sRaceCd",
      type: "select",
      options: raceOptions,
      optionLabel: "label",
      optionValue: "value",
      allowReplace: true,
    },
    {
      id: "raceDescription",
      value: "raceDescription",
      label: "Race Description",
      key: "raceDescription",
      allowReplace: true,
    },

    // Visa & Reviews
    {
      id: "visaTypeCd",
      value: "visaTypeCd",
      label: "Visa Type",
      key: "visaTypeCd",
      type: "select",
      options: visaOptions,
      optionLabel: "label",
      optionValue: "value",
      allowReplace: true,
    },
    {
      id: "visaDt",
      value: "visaDt",
      label: "Visa Date",
      key: "visaDt",
      type: "date",
      allowReplace: true,
    },
    {
      id: "lastReviewDt",
      value: "lastReviewDt",
      label: "Last Review Date",
      key: "lastReviewDt",
      type: "date",
      allowReplace: true,
    },
    {
      id: "nextReviewDt",
      value: "nextReviewDt",
      label: "Next Review Date",
      key: "nextReviewDt",
      type: "date",
      allowReplace: true,
    },

    // Birth Location
    {
      id: "birthCityName",
      value: "birthCityName",
      label: "City of Birth",
      key: "birthCityName",
      allowReplace: true,
    },
    {
      id: "birthMailStateDc",
      value: "birthMailStateDc",
      label: "State/Province of Birth",
      key: "birthMailStateDc",
      allowReplace: true,
    },
    {
      id: "birthCountryCd",
      value: "birthCountryCd",
      label: "Country of Birth",
      key: "birthCountryCd",
      allowReplace: true,
    },

    // Status Flags
    {
      id: "disabledFl",
      value: "disabledFl",
      label: "Disabled",
      key: "disabledFl",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "blindFl",
      value: "blindFl",
      label: "Blind",
      key: "blindFl",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "vetStatusD",
      value: "vetStatusD",
      label: "Disabled Veteran",
      key: "vetStatusD",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "vetStatusA",
      value: "vetStatusA",
      label: "Active Duty Wartime",
      key: "vetStatusA",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "vetStatusV",
      value: "vetStatusV",
      label: "Armed Force Service Medal Veteran",
      key: "vetStatusV",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "vetStatusRs",
      value: "vetStatusRs",
      label: "Recently Separated Veteran",
      key: "vetStatusRs",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "vetReleaseDt",
      value: "vetReleaseDt",
      label: "Discharge/Release Date",
      key: "vetReleaseDt",
      type: "date",
      allowReplace: true,
    },
    {
      id: "vetStatusP",
      value: "vetStatusP",
      label: "Protected Veteran",
      key: "vetStatusP",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "vetStatusNp",
      value: "vetStatusNp",
      label: "Not a Protected Veteran",
      key: "vetStatusNp",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "vetStatusDeclined",
      value: "vetStatusDeclined",
      label: "Declined to protected veteran status",
      key: "vetStatusDeclined",
      type: "flag",
      allowReplace: true,
    },

    // Timesheet Defaults
    {
      id: "tsDefaultAccount",
      value: "tsDefaultAccount",
      label: "TS Default Account",
      key: "tsDefaultAccount",
      allowReplace: true,
    },
    {
      id: "tsDefaultOrg",
      value: "tsDefaultOrg",
      label: "TS Default Org",
      key: "tsDefaultOrg",
      allowReplace: true,
    },
    {
      id: "tsDefaultProject",
      value: "tsDefaultProject",
      label: "TS Default Project",
      key: "tsDefaultProject",
      allowReplace: true,
    },
    {
      id: "tsDefaultGLC",
      value: "tsDefaultGLC",
      label: "TS Default GLC",
      key: "tsDefaultGLC",
      allowReplace: true,
    },
    {
      id: "tsDefaultPayType",
      value: "tsDefaultPayType",
      label: "TS Default Pay Type",
      key: "tsDefaultPayType",
      allowReplace: true,
    },
    {
      id: "tsDefaultLaborLocation",
      value: "tsDefaultLaborLocation",
      label: "TS Default Labor Location",
      key: "tsDefaultLaborLocation",
      allowReplace: true,
    },
    {
      id: "tsDefaultWorkerComp",
      value: "tsDefaultWorkerComp",
      label: "TS Default Worker Comp",
      key: "tsDefaultWorkerComp",
      allowReplace: true,
    },
    {
      id: "tsDefaultRefNo1",
      value: "tsDefaultRefNo1",
      label: "TS Default Ref No 1",
      key: "tsDefaultRefNo1",
      allowReplace: true,
    },
    {
      id: "tsDefaultRefNo2",
      value: "tsDefaultRefNo2",
      label: "TS Default Ref No 2",
      key: "tsDefaultRefNo2",
      allowReplace: true,
    },

    // Address & Contact
    {
      id: "ln1Adr",
      value: "ln1Adr",
      label: "Line 1",
      key: "ln1Adr",
      allowReplace: true,
    },
    {
      id: "ln2Adr",
      value: "ln2Adr",
      label: "Line 2",
      key: "ln2Adr",
      allowReplace: true,
    },
    {
      id: "ln3Adr",
      value: "ln3Adr",
      label: "Line 3",
      key: "ln3Adr",
      allowReplace: true,
    },
    {
      id: "cityName",
      value: "cityName",
      label: "City",
      key: "cityName",
      allowReplace: true,
    },
    {
      id: "mailStateDc",
      value: "mailStateDc",
      label: "State/Province",
      key: "mailStateDc",
      allowReplace: true,
    },
    {
      id: "postalCd",
      value: "postalCd",
      label: "Postal Code",
      key: "postalCd",
      allowReplace: true,
    },
    {
      id: "countryCd",
      value: "countryCd",
      label: "Country",
      key: "countryCd",
      allowReplace: true,
    },
    {
      id: "emailId",
      value: "emailId",
      label: "Work Email",
      key: "emailId",
      allowReplace: true,
    },
    {
      id: "homeEmailId",
      value: "homeEmailId",
      label: "Personal Email",
      key: "homeEmailId",
      allowReplace: true,
    },

    // Emergency Contacts 1
    {
      id: "contName1",
      value: "contName1",
      label: "Contact Name 1",
      key: "contName1",
      allowReplace: true,
    },
    {
      id: "contPhone1",
      value: "contPhone1",
      label: "Contact Phone 1",
      key: "contPhone1",
      allowReplace: true,
    },
    {
      id: "contRel1",
      value: "contRel1",
      label: "Contact Rel 1",
      key: "contRel1",
      allowReplace: true,
    },
    {
      id: "contactArrest1",
      value: "contactArrest1",
      label: "Arrest Notify 1",
      key: "contactArrest1",
      type: "flag",
      allowReplace: true,
    },

    // Emergency Contacts 2 (Newly Added)
    {
      id: "contName2",
      value: "contName2",
      label: "Contact Name 2",
      key: "contName2",
      allowReplace: true,
    },
    {
      id: "contPhone2",
      value: "contPhone2",
      label: "Contact Phone 2",
      key: "contPhone2",
      allowReplace: true,
    },
    {
      id: "contRel2",
      value: "contRel2",
      label: "Contact Rel 2",
      key: "contRel2",
      allowReplace: true,
    },
    {
      id: "contactArrest2",
      value: "contactArrest2",
      label: "Arrest Notify 2",
      key: "contactArrest2",
      type: "flag",
      allowReplace: true,
    },

    // Notes & System
    {
      id: "notes",
      value: "notes",
      label: "Notes",
      key: "notes",
      allowReplace: true,
    },
    {
      id: "prServEmplId",
      value: "prServEmplId",
      label: "Payroll ID",
      key: "prServEmplId",
      allowReplace: true,
    },
    {
      id: "plantId",
      value: "plantId",
      label: "Plant",
      key: "plantId",
      allowReplace: true,
    },
  ];

  const getOptionsForColumn = (col) => {
    if (col === "status" || col === "sEmplStatusCd") return statusOptions;
    if (col === "race" || col === "sRaceCd") return raceOptions;
    if (col === "visaType" || col === "visaTypeCd") return visaOptions;
    return null;
  };

  const getRowKey = (row) => {
    if (!row) return "";
    // Always use tempId first if it exists (for stability).
    // Use emplId as the second priority (for existing records).
    return String(row.tempId || row.emplId || row.id || "");
  };

  const getColumnDef = (fieldName) =>
    employeeTableColumns.find(
      (col) =>
        col?.id === fieldName ||
        col?.key === fieldName ||
        col?.value === fieldName,
    );

  const normalizeFlagValue = (value) => {
    const normalized = String(value ?? "")
      .trim()
      .toUpperCase();
    return value === true || normalized === "Y" || normalized === "TRUE"
      ? "Y"
      : "N";
  };

  const isFlagChecked = (value) => normalizeFlagValue(value) === "Y";

  const handleFieldChange = (rowKey, field, value) => {
    const key = String(rowKey || selectedRowKey || "");
    if (!key) return;

    const colDef = getColumnDef(field);
    let finalValue = colDef?.type === "flag" ? (value ? "Y" : "N") : value;

    // Update master list
    setEmployees((prev) =>
      prev.map((row) => {
        if (String(getRowKey(row)) !== key) return row;
        return { ...row, [field]: finalValue, isDirty: true };
      }),
    );

    // Update Form View state WITHOUT resetting the selection
    setSelectedRow((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: finalValue, isDirty: true };
    });
  };

  useEffect(() => {
    if (!selectedRowKey) return;

    const updatedSelected = employees.find(
      (row) => getRowKey(row) === String(selectedRowKey),
    );

    if (updatedSelected) {
      setSelectedRow(updatedSelected);
    }
  }, [employees, selectedRowKey]);

  const handleCopy = () => {
    // Determine if we are copying from multi-select or single form focus
    const targets =
      selectedIds.size > 0
        ? employees.filter((emp) => selectedIds.has(getRowKey(emp)))
        : selectedRow
          ? [selectedRow]
          : [];

    if (targets.length === 0) return toast.warn("Select a record to copy");

    // Format for system clipboard (Excel compatible)
    const headers = employeeTableColumns.map((col) => col.label).join("\t");
    const rows = targets
      .map((row) =>
        employeeTableColumns.map((col) => row[col.key] ?? "").join("\t"),
      )
      .join("\n");

    navigator.clipboard
      .writeText(`${headers}\n${rows}`)
      .then(() => {
        // CRITICAL: Update internal state so the Paste button appears in the Toolbar
        setClipboard(targets);
        toast.success(`${targets.length} record(s) copied`);
      })
      .catch(() => toast.error("Clipboard access failed"));
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Nothing to paste");

    const pasted = clipboard.map((emp, i) => {
      // This string MUST stay the same for this row's entire life in the list
      const stableTempId = `PASTE_${Date.now()}_${i}`;

      return {
        ...emp,
        emplId: "",
        // We set tempId here so the table has a stable reference immediately
        tempId: stableTempId,
        isDirty: true,
        labors: emp.labors ? [...emp.labors] : [],
        addresses: emp.addresses ? [...emp.addresses] : [],
      };
    });

    setEmployees((prev) => [...pasted, ...prev]);
    setSelectedRow(pasted[0]);
    setSelectedRowKey(pasted[0].tempId);
    // View stays as Table View
    toast.success(`Pasted ${pasted.length} record(s).`);
  };

  const renderStickyHeader = () => (
    <div className="bg-gray-50/80 p-2 rounded-lg border border-gray-200 mb-2 sticky top-0 z-40 backdrop-blur-sm shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <FormInput
          label="Employee *"
          value={selectedRow?.emplId || ""} // Changed from employee to emplId
          onChange={(e) =>
            handleFieldChange(getRowKey(selectedRow), "emplId", e.target.value)
          }
        />
        <FormInput
          label="Name"
          value={selectedRow?.lastFirstName || ""} // Use the API's name field
          readOnly
        />
        <div className="flex items-center gap-2 pl-4">
          {/* <input 
          type="checkbox" 
          checked={selectedRow?.contractorFl === "Y" || selectedRow?.contractorFl === true} 
          // onChange={(e) =>
          //   handleFieldChange(getRowKey(selectedRow), "contractorFl", e.target.checked)
          // }
           onChange={(e) =>
    handleFieldChange(getRowKey(selectedRow), "contractorFl", e.target.checked ? "Y" : "N")
  }
          className="h-4 w-4 accent-[#17414d] cursor-pointer"
        /> */}
          <input
            type="checkbox"
            checked={isFlagChecked(selectedRow?.contractorFl)}
            onChange={(e) =>
              handleFieldChange(
                getRowKey(selectedRow),
                "contractorFl",
                e.target.checked ? "Y" : "N",
              )
            }
            className="h-4 w-4 accent-[#17414d] cursor-pointer"
          />
          <label className="text-[10px] font-bold text-gray-700 uppercase cursor-pointer">
            Contractor
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    const props = {
      data: selectedRow || {},
      onChange: handleFieldChange,
    };

    switch (activeTab) {
      case "employeeInfo":
        return <EmployeeInfoTab {...props} />;

      case "hrData":
        return <HrDataTab {...props} />;

      case "addressContact":
        return <AddressContactTab {...props} />;

      case "timesheetDefaults":
        return <TimesheetDefaultsTab {...props} />;

      case "productInterface":
        return <ProductInterfaceTab {...props} />;

      case "notes":
        return <NotesTab {...props} />;

      default:
        return <EmployeeInfoTab {...props} />;
    }
  };

  const fetchEmployeeById = async (id) => {
    if (!id || String(id).startsWith("NEW_")) return;

    setLoading(true);
    try {
      const url = `${backendUrl}/api/EmployeeMaster/${id}`;
      const res = await api.get(url);

      // Use the response directly as it's likely a single object
      if (res.data) {
        setSelectedRow({
          ...res.data,
          id: String(res.data.emplId),
          employee: res.data.emplId,
          isDirty: false,
        });
      }
    } catch (error) {
      console.error("ID Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRowKey && !selectedRow?.isDirty) {
      fetchEmployeeById(selectedRowKey);
    }
  }, [selectedRowKey, selectedRow?.isDirty]);

  const fetchEmployees = async () => {
    setLoading(true);
    // Debug log to ensure we see the key now
    // console.log("--- Fetching Fresh Data ---", { currentKey: selectedRowKey });

    try {
      const url = `${backendUrl}/api/EmployeeMaster?pageNumber=${currentPage}&pageSize=${pageSize}&sortBy=${searchColumn}&sortOrder=${sortOrder}&search=${searchValue}`;
      const res = await api.get(url);
      const rawData = res.data?.data || [];

      const mappedData = rawData.map((emp) => ({
        ...emp,
        id: String(emp.emplId),
        isDirty: false,
      }));

      setEmployees(mappedData);
      setMasterEmployees(mappedData);

      // If we have a key, stay on that record.
      if (selectedRowKey) {
        const currentInNewData = mappedData.find(
          (e) => getRowKey(e) === String(selectedRowKey),
        );
        if (currentInNewData) {
          setSelectedRow(currentInNewData);
          // Do NOT reset selectedRowKey here
        }
      } else if (mappedData.length > 0) {
        // Only default to index 0 if the user hasn't selected anything yet
        setSelectedRow(mappedData[0]);
        setSelectedRowKey(getRowKey(mappedData[0]));
      }
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, pageSize, sortOrder]);

  const handleAdd = () => {
    const tempId = `NEW_${Date.now()}`;
    const newEmp = {
      tempId: tempId,
      emplId: "",
      tempId: tempId,
      isDirty: true,
      companyId: "1",
      sEmplStatusCd: "ACT",
      contractorFl: false,
      disabledFl: false,
      blindFl: false,
    };

    // Add to list and select it without changing the 'isFormView' state
    setEmployees([newEmp, ...employees]);
    setSelectedRow(newEmp);
    setSelectedRowKey(tempId);

    // toast.success("New row added to table");
  };

  const handleSave = async () => {
    const changedRows = employees.filter((emp) => emp.isDirty);
    if (changedRows.length === 0) return toast.info("No changes to save.");

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const row of changedRows) {
        const isNew = !!row.tempId && !row.id;
        const payload = { empl: String(row.emplId), modifiedBy: "SystemUser" };

        employeeTableColumns.forEach((col) => {
          const fieldKey = col.key;
          const value = row[fieldKey];
          if (col.type === "flag") {
            payload[fieldKey] = value === "Y" || value === true;
          } else if (col.type === "date") {
            payload[fieldKey] = value ? value.split("T")[0] : null;
          } else {
            payload[fieldKey] = value ?? "";
          }
        });
        payload.emplId = String(row.emplId);

        const endpoint = `${backendUrl}/api/EmployeeMaster`;
        const url = isNew ? endpoint : `${endpoint}/${row.emplId}`;

        try {
          await api[isNew ? "post" : "put"](url, payload);
          successCount++;
        } catch (err) {
          errorCount++;
          toast.error(
            err.response?.data?.message || `Failed to save ${row.emplId}`,
          );
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully processed ${successCount} record(s).`);

        // CRITICAL: Refresh data but DO NOT clear selectedRowKey
        await fetchEmployees();

        // If it was a new record that just got an ID from the server,
        // fetchEmployees will link the new data back to the UI via the useEffect.
      }
    } catch (globalError) {
      toast.error("An unexpected error occurred during the save process.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return toast.warn("Select records to delete");
    if (!window.confirm("Delete selected records?")) return;

    setLoading(true);
    try {
      for (const id of selectedIds) {
        if (!String(id).startsWith("NEW_") && !String(id).startsWith("PST_")) {
          // Simple parameter injection for the delete ID
          await api.delete(`${backendUrl}/api/EmployeeMaster/${id}`);
        }
      }
      setEmployees((prev) =>
        prev.filter((emp) => !selectedIds.has(String(emp.id))),
      );
      toast.success("Deleted successfully");
      setSelectedIds(new Set());
      setSelectedRow(null);
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFind = () => {
    if (!searchValue.trim()) {
      setEmployees(masterEmployees);
      return;
    }

    const filtered = masterEmployees.filter((item) => {
      return String(item[searchColumn] || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });

    setEmployees(filtered);
  };

  const handleFindReplaceEmployee = async (config, isReplaceMode) => {
    const { column, findYear, replaceValue, booleanMode } = config;

    // SAFETY GATE: Treat 'Apply' as 'Search' for the Employee ID column
    // This prevents the "Updated X records" toast and data corruption for IDs.
    let effectiveReplaceMode = isReplaceMode;
    if (column === "emplId") {
      effectiveReplaceMode = false;
    }

    if (!column) {
      toast.warn("Please select a column first.");
      return;
    }

    const colDef = getColumnDef(column);
    const targetField = colDef?.key || colDef?.id || colDef?.value || column;
    const isFlagType = colDef?.type === "flag";

    // --- 2. SEARCH / FIND LOGIC (Acts for both Search button AND EmplId 'Apply') ---
    if (!effectiveReplaceMode) {
      const searchTerm = String(findYear ?? "").trim();

      // Reset to full list if search is empty
      if (!searchTerm && !isFlagType) {
        setEmployees(masterEmployees);
        setCurrentPage(1);
        return;
      }

      // Special Logic for Employee ID (API Fetch)
      if (column === "emplId") {
        setLoading(true);
        try {
          const url = `${backendUrl}/api/EmployeeMaster/${searchTerm}`;
          const res = await api.get(url);
          if (res.data) {
            const fetchedEmp = {
              ...res.data,
              id: String(res.data.emplId),
              isDirty: false,
            };
            setEmployees([fetchedEmp]);
            setSelectedRow(fetchedEmp);
            setSelectedRowKey(String(fetchedEmp.emplId));
          } else {
            toast.error("Employee ID not found.");
          }
        } catch (error) {
          toast.error("No matches found.");
        } finally {
          setLoading(false);
        }
        return;
      }

      // Standard local filtering for all other fields
      const filtered = masterEmployees.filter((emp) => {
        const val = emp?.[targetField];
        if (isFlagType)
          return normalizeFlagValue(val) === normalizeFlagValue(findYear);
        return (
          val != null &&
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      setEmployees(filtered);
      if (filtered.length > 0) {
        setSelectedRow(filtered[0]);
        setSelectedRowKey(String(getRowKey(filtered[0])));
      } else {
        toast.info("No matches found.");
      }
      return;
    }

    // --- 3. REPLACE MODE (Only runs for non-ID fields) ---
    if (
      !window.confirm(`Apply bulk update to all matching records in ${column}?`)
    )
      return;

    let updatedCount = 0;
    let matchCount = 0;

    const targetVal =
      replaceValue === "N" || replaceValue === false || replaceValue === "false"
        ? "N"
        : "Y";
    const findValRaw = String(findYear ?? "").trim();
    const findValNormalized = normalizeFlagValue(findYear);

    const updatedMaster = masterEmployees.map((emp) => {
      const currentValue = emp?.[targetField];
      let isMatch = false;

      if (isFlagType) {
        const currentNormalized = normalizeFlagValue(currentValue);
        isMatch =
          findValRaw === "" ? true : currentNormalized === findValNormalized;

        if (isMatch) {
          matchCount++;
          const nextFlag =
            booleanMode === "inverted"
              ? currentNormalized === "Y"
                ? "N"
                : "Y"
              : targetVal;
          if (currentNormalized !== nextFlag) {
            updatedCount++;
            return { ...emp, [targetField]: nextFlag, isDirty: true };
          }
        }
      } else {
        const currentText = String(currentValue ?? "");
        const search = String(findYear ?? "").toLowerCase();
        isMatch = !search || currentText.toLowerCase().includes(search);

        if (isMatch) {
          matchCount++;
          if (currentText !== String(replaceValue ?? "")) {
            updatedCount++;
            return { ...emp, [targetField]: replaceValue, isDirty: true };
          }
        }
      }
      return emp;
    });

    if (updatedCount > 0) {
      setMasterEmployees(updatedMaster);
      setEmployees(updatedMaster);
      setIsReplaceMode(false);
      toast.success(`Updated ${updatedCount} records.`);
    } else {
      toast.info(
        matchCount === 0
          ? "No records matched the criteria."
          : `No updates needed: all matching records are already ${targetVal}.`,
      );
    }
  };

  return (
    <div className="p-4 space-y-2 font-inter min-h-screen">
      <MainContainer icon={User} title="Manage Employee Information">
        <Toolbar
          // isFormView={false}
          isFormView={isFormView}
          isReplaceMode={isReplaceMode}
          setIsReplaceMode={setIsReplaceMode}
          columns={employeeTableColumns}
          handleFindReplace={handleFindReplaceEmployee}
          clipboard={clipboard}
          clipboardCount={clipboard.length}
          // columns={employeeTableColumns}
          searchColumn={searchColumn}
          setSearchColumn={setSearchColumn}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          replaceValue={replaceValue}
          setReplaceValue={setReplaceValue}
          handleFind={handleFind}
          // handleBulkReplace={handleBulkReplace} // Now connected

          hasSelectedRows={selectedIds.size > 0}
          selectedRow={selectedRow}
          currentIndex={employees.findIndex(
            (emp) => getRowKey(emp) === getRowKey(selectedRow),
          )}
          totalRecords={employees.length}
          handleNavigate={(dir) => {
            const idx = employees.findIndex(
              (emp) => getRowKey(emp) === getRowKey(selectedRow),
            );

            const nextIdx = dir === "next" ? idx + 1 : idx - 1;
            if (employees[nextIdx]) {
              const nextRow = employees[nextIdx];
              setSelectedRow(nextRow);
              setSelectedRowKey(getRowKey(nextRow)); // FIX: Update the key during navigation
            }
          }}
          actions={{
            onAdd: handleAdd,
            onSave: handleSave,
            onDelete: handleDelete,
            onToggleView: () => setIsFormView(!isFormView),

            onClear: () => {
              setEmployees(masterEmployees);
              setSearchValue("");
              setIsFormView(false);
              setSelectedRow(null);
              setSelectedRowKey("");
              setSelectedIds(new Set());
              setActiveNestedTab("");
            },
            onCopy: handleCopy,
            onPaste: handlePaste,
          }}
          selectedRow={
            selectedIds.size > 0 ? { id: Array.from(selectedIds)[0] } : null
          }
          isDirty={employees.some((emp) => emp.isDirty)}
        />

        <div className="m-2">
          {isFormView ? (
            <div className="space-y-3">
              {renderStickyHeader()}
              <div className="flex border-b border-gray-200 overflow-x-auto bg-white">
                {[
                  { id: "employeeInfo", label: "Employee Info" },
                  { id: "hrData", label: "HR Data" },
                  { id: "addressContact", label: "Address/Contact" },
                  { id: "timesheetDefaults", label: "Timesheet Defaults" },
                  { id: "productInterface", label: "Product Interface" },
                  { id: "notes", label: "Notes" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-4 py-2 text-[10px] font-bold  whitespace-nowrap transition-all ${activeTab === tab.id ? "border-b-2 border-[#17414d] text-[#17414d]" : "text-gray-500 hover:text-[#17414d]"}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-b-lg ">{renderTabContent()}</div>
            </div>
          ) : (
            <ReusableTable
              data={employees}
              columns={employeeTableColumns}
              selectedRows={selectedIds}
              onRowSelect={(row) => {
                const id = getRowKey(row);
                // const id = row.tempId;
                // const id = getRowKey(row);

                setSelectedIds((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(id)) newSet.delete(id);
                  else newSet.add(id);
                  return newSet;
                });

                setSelectedRowKey(id);
                setSelectedRow(row);
              }}
              onFieldChange={handleFieldChange}
              // rowKey="emplId"
              // rowKey="tempId"
              rowKey={getRowKey}
              maxHeight="max-h-[60vh]"
            />
          )}

          <div className="flex gap-1 bg-gray-100/50 p-1.5 rounded-t-lg w-fit mt-2 border border-b-0 border-gray-200">
            {/* {["Salary Details", "Leave Beginning Balances", "Leave"].map(tab => (
  <button
    key={tab}
    onClick={() => {
      // Toggles open/close on click
      setActiveNestedTab(prev => prev === tab ? "" : tab);
    }}
    className={`px-3 py-1 text-[10px] font-bold rounded-md border transition-all ${
      activeNestedTab === tab 
      ? "bg-white text-[#17414d] border-gray-300 shadow-sm" 
      : "text-gray-500 border-transparent hover:bg-gray-200"
    }`}
  >
    {tab}
  </button>
))} */}

            {[
              "Salary Details",
              "Leave Beginning Balances",
              "Leave",
              "Allowance Details",
              "Taxes",
              "Deductions",
              "Saving Bonds",
              "User-Defined Info",
              "Additional Address",
              "Citizenship",
              "Phone",
              "Additional Default Pay Types",
            ].map((tab, index, array) => (
              <React.Fragment key={tab}>
                <button
                  onClick={() => {
                    setActiveNestedTabs((prev) => ({ ...prev, [tab]: true }));
                  }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md border transition-all ${
                    activeNestedTabs[tab]
                      ? "bg-white text-[#17414d] border-gray-300 shadow-sm"
                      : "text-gray-500 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              </React.Fragment>
            ))}

            {/* {["Salary Details", "Leave Beginning Balances", "Leave", "Allowance Details", 
  "Taxes", 
  "Deductions", 
  "Saving Bonds", 
  "User-Defined Info", 
  "Additional Address", 
  "Citizenship", 
  "Phone", 
  "Additional Default Pay Types"].map(tab => (
  <button
    key={tab}
    onClick={() => {
      // Set the specific tab to true without closing others
      setActiveNestedTabs(prev => ({ ...prev, [tab]: true }));
    }}
    className={`px-3 py-1 text-[10px] font-bold rounded-md border transition-all ${
      activeNestedTabs[tab] 
      ? "bg-white text-[#17414d] border-gray-300 shadow-sm" 
      : "text-gray-500 border-transparent hover:bg-gray-200"
    }`}
  >
    {tab}
  </button>
))} */}
          </div>
        </div>
        {/* Pagination Controls - Copying logic from ManageCompany */}
        {/* {!isFormView && (
          <div className="w-full bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 mt-1 rounded-b-xl">
             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
               <ChevronLeft size={18} />
             </button>
             <span className="text-xs font-bold">{currentPage}</span>
             <button onClick={() => setCurrentPage(p => p + 1)}>
               <ChevronRight size={18} />
             </button>
          </div>
        )} */}
        {!isFormView && (
          <div className="w-full bg-[#e5f3fb] flex items-center justify-end gap-2 px-4 py-2 border-t border-gray-200 mt-1 rounded-b-xl">
            {/* Back Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="text-[#17414d] disabled:opacity-30"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Indicator */}
            <div className="flex items-center gap-1">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#17414d] text-white font-bold text-xs">
                {currentPage}
              </span>
              <span className="text-gray-500 text-xs px-1">
                of {totalPages}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="text-[#17414d] disabled:opacity-30"
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>

            {/* Page Size Selector */}
            <div className="relative flex items-center rounded px-2 bg-white ml-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent py-1 pr-4 pl-1 focus:outline-none cursor-pointer text-xs text-black"
              >
                <option value={15}>15 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-1 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        )}
      </MainContainer>

      <div className="flex flex-col gap-4">
        {Object.keys(activeNestedTabs)
          .reverse() // <--- FIX: This makes the most recently opened tab appear at the TOP
          .map(
            (tabName) =>
              activeNestedTabs[tabName] && (
                <SalaryLeaveNestedContainer
                  key={tabName}
                  activeTab={tabName}
                  data={selectedRow || {}}
                  onChange={handleFieldChange}
                  handleClose={() => {
                    const newTabs = { ...activeNestedTabs };
                    delete newTabs[tabName];
                    setActiveNestedTabs(newTabs);
                  }}
                />
              ),
          )}
      </div>
    </div>
  );
};

export default ManageEmployee;
