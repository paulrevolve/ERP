import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import api from "../utils/api";
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  ClipboardCheck,
  AlignLeft,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { MainContainer, Toolbar } from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import { backendUrl } from "./config";

const ManageCompany = () => {
  // --- Data States ---
  const [companies, setCompanies] = useState([]);
  const [masterCompanies, setMasterCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- Selection & UI States ---
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedCompanyRow, setSelectedCompanyRow] = useState(null);
  const [isFormView, setIsFormView] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [clipboard, setClipboard] = useState([]);

  // --- Toolbar States ---
  const [searchColumn, setSearchColumn] = useState("companyName");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  const initialFormState = {
    parameterId: "",
    description: "",
    companyId: "",
    companyName: "",
    companyShortName: "",
    copySettingsFrom: "",
    copySettingsName: "",
    startingFiscalYear: "",
    startingPeriod: "",
    transferLocationId: "",
    locationName: "",
    functionalCurrency: "",
    taxableEntityId: "",
    taxId: "",
    taxableName: "",
    telephone: "",
    line1: "",
    line2: "",
    line3: "",
    cityName: "",
    mailStateDc: "",
    postalCd: "",
    countryCd: "",
    activeFlag: "Y",
  };

  // FULL 22 COLUMN LIST
  const allTableColumns = [
    { value: "parameterId", label: "Parameter ID", key: "parameterId" },
    { value: "description", label: "Description", key: "description" },
    {
      value: "companyId",
      label: "Company ID",
      key: "companyId",
      readOnlyIfExisting: true,
    },
    { value: "companyName", label: "Company Name", key: "companyName" },
    { value: "companyShortName", label: "Short Name", key: "companyShortName" },
    {
      value: "activeFlag",
      label: "Active Status",
      key: "activeFlag",
      type: "checkbox",
    },
    {
      value: "copySettingsFrom",
      label: "Copy Settings From",
      key: "copySettingsFrom",
    },
    {
      value: "startingFiscalYear",
      label: "Fiscal Year",
      key: "startingFiscalYear",
    },
    { value: "startingPeriod", label: "Period", key: "startingPeriod" },
    {
      value: "transferLocationId",
      label: "Transfer Location",
      key: "transferLocationId",
    },
    { value: "locationName", label: "Location Name", key: "locationName" },
    {
      value: "functionalCurrency",
      label: "Currency",
      key: "functionalCurrency",
    },
    {
      value: "taxableEntityId",
      label: "Tax Entity ID",
      key: "taxableEntityId",
    },
    { value: "taxId", label: "Tax ID", key: "taxId" },
    { value: "taxableName", label: "Entity Name", key: "taxableName" },
    { value: "telephone", label: "Telephone", key: "telephone" },
    { value: "line1", label: "Address L1", key: "line1" },
    { value: "line2", label: "Address L2", key: "line2" },
    {
      value: "cityName",
      label: "City",
      key: "cityName",
      width: "min-w-[80px]",
    },
    {
      value: "mailStateDc",
      label: "State",
      key: "mailStateDc",
      width: "min-w-[80px]",
    },
    { value: "postalCd", label: "Zip Code", key: "postalCd" },
    { value: "countryCd", label: "Country", key: "countryCd" },
  ];

  const COMPANY_COLUMNS = [
    {
      id: "parameterId",
      label: "Parameter ID",
      type: "text",
      allowReplace: false,
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      allowReplace: true,
    },
    { id: "companyId", label: "Company ID", type: "text", allowReplace: false },
    {
      id: "companyName",
      label: "Company Name",
      type: "text",
      allowReplace: true,
    },
    {
      id: "companyShortName",
      label: "Short Name",
      type: "text",
      allowReplace: true,
    },
    {
      id: "activeFlag",
      label: "Active Status",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "startingFiscalYear",
      label: "Fiscal Year",
      type: "text",
      allowReplace: true,
    },
    { id: "startingPeriod", label: "Period", type: "text", allowReplace: true },
    {
      id: "transferLocationId",
      label: "Transfer Location",
      type: "text",
      allowReplace: true,
    },
    {
      id: "locationName",
      label: "Location Name",
      type: "text",
      allowReplace: true,
    },
    {
      id: "functionalCurrency",
      label: "Currency",
      type: "text",
      allowReplace: true,
    },
    {
      id: "taxableEntityId",
      label: "Tax Entity ID",
      type: "text",
      allowReplace: true,
    },
    { id: "taxId", label: "Tax ID", type: "text", allowReplace: true },
    {
      id: "taxableName",
      label: "Entity Name",
      type: "text",
      allowReplace: true,
    },
    { id: "telephone", label: "Telephone", type: "text", allowReplace: true },
    { id: "line1", label: "Address L1", type: "text", allowReplace: true },
    { id: "line2", label: "Address L2", type: "text", allowReplace: true },
    { id: "cityName", label: "City", type: "text", allowReplace: true },
    { id: "mailStateDc", label: "State", type: "text", allowReplace: true },
    { id: "postalCd", label: "Zip Code", type: "text", allowReplace: true },
    { id: "countryCd", label: "Country", type: "text", allowReplace: true },
  ];

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const url =
        searchValue.trim() && !isReplaceMode
          ? `${backendUrl}/api/Company/search?companyId=${searchValue}&pageNumber=${currentPage}&pageSize=${pageSize}`
          : `${backendUrl}/api/Company/getall?pageNumber=${currentPage}&pageSize=${pageSize}`;

      const res = await api.get(url);
      if (res.data && res.data.data) {
        const serverData = res.data.data.map((item) => ({
          ...item,
          activeFlag: item.activeFlag === true ? "Y" : "N",
          isDirty: false,
        }));
        setCompanies(serverData);
        setMasterCompanies(serverData);
        setTotalPages(Math.ceil((res.data.totalRecords || 0) / pageSize) || 1);
        if (serverData.length > 0 && !selectedCompanyRow)
          setSelectedCompanyRow(serverData[0]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (id, field, value) => {
    const stringId = String(id);
    const processedValue =
      field === "activeFlag"
        ? value === true || value === "Y"
          ? "Y"
          : "N"
        : value;

    setCompanies((prev) =>
      prev.map((row) => {
        const rowId = String(row.tempId || row.companyId || "");
        if (rowId === stringId) {
          return { ...row, [field]: processedValue, isDirty: true };
        }
        return row;
      }),
    );

    // Sync the selected row if it's the one being changed
    setSelectedCompanyRow((prev) => {
      if (!prev) return prev;
      const selectedId = String(prev.tempId || prev.companyId || "");
      if (selectedId === stringId) {
        return { ...prev, [field]: processedValue, isDirty: true };
      }
      return prev;
    });
  };

  const handleFindReplaceCompany = (config, isReplaceMode) => {
    const { column, findYear, replaceValue } = config;

    if (!column) return toast.warn("Please select a column first.");

    // --- SEARCH MODE ---
    if (!isReplaceMode) {
      if (!findYear) return toast.warn("Enter a search term.");

      const foundIndex = companies.findIndex((c) =>
        String(c[column] || "")
          .toLowerCase()
          .includes(findYear.toLowerCase()),
      );

      if (foundIndex !== -1) {
        const foundRow = companies[foundIndex];

        // Update UI selection
        setSelectedCompanyRow(foundRow);
        setSelectedIds(new Set([foundRow.companyId]));

        // Calculate and go to the correct page
        const targetPage = Math.floor(foundIndex / pageSize) + 1;
        setCurrentPage(targetPage);

        toast.info(`Match found at row ${foundIndex + 1} (Page ${targetPage})`);
      } else {
        toast.error("No match found.");
      }
      return;
    }

    // --- REPLACE MODE ---
    if (!window.confirm("Apply bulk update to all matching companies?")) return;

    setCompanies((prev) => {
      let updatedCount = 0;
      const newData = prev.map((company) => {
        const currentValue = String(company[column] || "");

        // Determine if match
        const isMatch =
          findYear === "" ||
          currentValue.toLowerCase().includes(findYear.toLowerCase());

        if (isMatch && currentValue !== replaceValue) {
          updatedCount++;
          return {
            ...company,
            [column]: replaceValue,
            isDirty: true, // Flag for backend saving
          };
        }
        return company;
      });

      if (updatedCount > 0) {
        toast.success(`Updated ${updatedCount} companies locally.`);
      } else {
        toast.info("No records matched the criteria.");
      }
      return newData;
    });
  };

  const jumpToCode = (code) => {
    const found = masterCompanies.find((g) => g.companyId === code);
    if (found) setSelectedCompanyRow(found);
    else toast.error("Company ID not found");
  };

  const handleFind = () => {
    if (!searchValue || searchValue === "Select...") {
      setCompanies(masterCompanies);
      return;
    }
    const filtered = masterCompanies.filter((item) => {
      if (searchColumn === "activeFlag") return item.activeFlag === searchValue;
      return String(item[searchColumn] || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setCompanies(filtered);
  };

  const handleBulkReplace = () => {
    if (!searchValue || searchValue === "Select...")
      return toast.warn("Specify value to find.");
    let count = 0;
    const updated = companies.map((row) => {
      let shouldReplace = false;
      let newValue = replaceValue;
      if (searchColumn === "activeFlag") {
        if (row.activeFlag === searchValue) {
          shouldReplace = true;
          newValue =
            replaceValue === "Invert"
              ? row.activeFlag === "Y"
                ? "N"
                : "Y"
              : replaceValue;
        }
      } else {
        if (String(row[searchColumn] || "").includes(searchValue)) {
          shouldReplace = true;
          newValue = String(row[searchColumn]).replace(
            new RegExp(searchValue, "g"),
            replaceValue,
          );
        }
      }
      if (shouldReplace) {
        count++;
        return { ...row, [searchColumn]: newValue, isDirty: true };
      }
      return row;
    });
    setCompanies(updated);
    toast.success(`Replaced ${count} matches.`);
    setIsReplaceMode(false);
  };

  const handleMasterSave = async () => {
    const changedRows = companies.filter((c) => c.isDirty || !!c.tempId);
    if (changedRows.length === 0) return toast.warn("No changes to save.");

    if (!backendUrl) {
      console.error("Backend URL is not configured. Check your .env file.");
      return toast.error("Configuration error: Backend URL missing.");
    }

    setLoading(true);
    const currentUser =
      JSON.parse(localStorage.getItem("currentUser") || "{}")?.name || "u";
    let successCount = 0;

    for (const row of changedRows) {
      try {
        const isNew = !!row.tempId;
        // Validation for required fields dynamically
        const missingFields = [];
        if (!row.companyId || String(row.companyId).trim() === "")
          missingFields.push("Company ID");
        if (!row.companyName || String(row.companyName).trim() === "")
          missingFields.push("Full Name");
        if (!row.taxId || String(row.taxId).trim() === "")
          missingFields.push("Tax ID");

        if (missingFields.length > 0) {
          toast.error(
            `Please provide the following required fields: ${missingFields.join(", ")}.`,
          );
          continue;
        }

        const { isDirty, tempId, ...cleanRow } = row;

        const payload = {
          ...cleanRow, // Spread existing row data (minus internal fields)
          activeFlag: row.activeFlag === "Y" || row.activeFlag === true,
          taxableEntity: {
            taxableName: row.taxableName || row.companyName,
            taxId: row.taxId,
            companyId: row.companyId,
            activeFlag: row.activeFlag === "Y" ? "Y" : "N",
            createdBy: row.createdBy || currentUser,
            modifiedBy: currentUser,
            createdAt: row.createdAt || new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            company: null,
          },
        };

        const url = isNew
          ? `${backendUrl}/api/Company/create?modifiedBy=${encodeURIComponent(currentUser)}`
          : `${backendUrl}/api/Company/update?companyId=${encodeURIComponent(row.companyId)}&modifiedBy=${encodeURIComponent(currentUser)}`;

        console.log("Request URL:", url);
        console.log("Payload being sent:", payload);

        const response = await api[isNew ? "post" : "put"](url, payload);

        // Removed individual toast to avoid duplicates
        successCount++;
      } catch (e) {
        console.error("Save error for row:", row, e);
        const msg =
          e.response?.data?.message ||
          `Error saving ${row.companyName || row.companyId || "row"}`;
        toast.error(msg);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully saved ${successCount} record(s).`);
      // User requested to clear UI after save instead of refreshing
      setCompanies([]);
      setSelectedCompanyRow(null);
      setSelectedIds(new Set());
      setIsEditing(false);
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0)
      return toast.warn("Select records to delete.");
    if (!window.confirm(`Delete ${idsToDelete.length} record(s)?`)) return;

    setLoading(true);
    try {
      // Filter out temporary rows so we don't call the API for unsaved data
      const realIdsToDelete = idsToDelete.filter(
        (id) =>
          !id.startsWith("NEW_") &&
          !id.startsWith("PST_") &&
          !id.startsWith("IMP_"),
      );

      for (const id of realIdsToDelete) {
        const response = await api.delete(
          `${backendUrl}/api/Company/delete?companyId=${id}`,
        );
        // If the API returns a success message in the response body, show it
        if (response.data?.message) {
          toast.success(response.data.message);
        }
      }

      // Local state cleanup: Remove the rows from the UI
      setCompanies((prev) =>
        prev.filter((c) => !selectedIds.has(String(c.tempId || c.companyId))),
      );

      // Only show general success if the API didn't provide a specific message
      if (realIdsToDelete.length > 0 && !toast.isActive) {
        toast.success("Deleted successfully.");
      }

      setSelectedIds(new Set());
      setSelectedCompanyRow(null);
    } catch (e) {
      // FIX: Show only the message returned by the API response
      const errorMessage =
        e.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
      console.error("Delete Error:", e.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const sourceData =
      selectedIds.size > 0
        ? companies.filter((c) => selectedIds.has(c.tempId || c.companyId))
        : companies;

    if (sourceData.length === 0) return toast.warn("No data to export.");

    const exportData = sourceData.map((item) => {
      const row = {};
      allTableColumns.forEach((col) => {
        row[col.label] = item[col.key] ?? "";
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, `Company_Export.xlsx`);
  };

  const isAnyDirty = companies.some((c) => c.isDirty || !!c.tempId);
  const activeId = selectedCompanyRow?.tempId || selectedCompanyRow?.companyId;

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500 font-inter">
      <style>{`
        .setup-company-toolbar .relative.group,
        .setup-company-toolbar .flex.items-center.rounded.bg-white.border.border-gray-200 {
          display: none !important;
        }
        /* Copy is always disabled */
        .setup-company-toolbar button[title="Copy Row"] {
          opacity: 0.4 !important;
          pointer-events: none !important;
          cursor: not-allowed !important;
        }
        /* Delete is always disabled */
        .setup-company-toolbar button[title="Delete"] {
          opacity: 0.4 !important;
          pointer-events: none !important;
          cursor: not-allowed !important;
        }
      `}</style>
      <MainContainer icon={BriefcaseBusiness} title="Setup Company">
        <div className="setup-company-toolbar">
          <Toolbar
            rowKey="companyId"
            isFormView={isFormView}
            isReplaceMode={isReplaceMode}
            setIsReplaceMode={setIsReplaceMode}
            searchColumn={searchColumn}
            setSearchColumn={setSearchColumn}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            replaceValue={replaceValue}
            setReplaceValue={setReplaceValue}
            handleFind={handleFind}
            handleBulkReplace={handleBulkReplace}
            buttonsDisable={[]} // Empty array so buttons are visible
            currentIndex={companies.findIndex(
              (c) => (c.tempId || c.companyId) === activeId,
            )}
            totalRecords={companies.length}
            handleNavigate={(dir) => {
              const idx = companies.findIndex(
                (c) => (c.tempId || c.companyId) === activeId,
              );
              const nextIdx = dir === "next" ? idx + 1 : idx - 1;
              if (companies[nextIdx]) setSelectedCompanyRow(companies[nextIdx]);
            }}
            jumpToCode={jumpToCode}
            actions={{
              onAdd: () => {
                const newR = {
                  tempId: `NEW_${Date.now()}`,
                  ...initialFormState,
                  isDirty: true,
                };
                setCompanies([newR, ...companies]);
                setSelectedCompanyRow(newR);
                setIsEditing(true);
                // removed setIsFormView(true) to stay in current view
              },
              onDelete: handleDelete,
              // onCopy: () => {
              //     if(!selectedCompanyRow) return toast.warn("Select a record to copy");
              //     const targets = selectedIds.size > 0 ? companies.filter(c => selectedIds.has(c.tempId || c.companyId)) : [selectedCompanyRow];
              //     setClipboard(targets);
              //     toast.success(`${targets.length} record(s) copied`);
              // },
              onCopy: () => {
                if (!selectedCompanyRow && selectedIds.size === 0)
                  return toast.warn("Select a record to copy");

                // 1. Determine which rows to copy
                const targets =
                  selectedIds.size > 0
                    ? companies.filter((c) =>
                        selectedIds.has(String(c.companyId || c.tempId)),
                      )
                    : [selectedCompanyRow];

                // 2. Create Excel-compatible string (Tab-Separated Values)
                const headers = allTableColumns
                  .map((col) => col.label)
                  .join("\t");
                const rows = targets
                  .map((row) =>
                    allTableColumns.map((col) => row[col.key] ?? "").join("\t"),
                  )
                  .join("\n");

                const clipboardString = `${headers}\n${rows}`;

                // 3. Write to System Clipboard
                navigator.clipboard
                  .writeText(clipboardString)
                  .then(() => {
                    setClipboard(targets);
                    toast.success(
                      `${targets.length} record(s) copied to clipboard`,
                    );
                  })
                  .catch((err) =>
                    toast.error("Failed to copy to system clipboard"),
                  );
              },

              onPaste: () => {
                if (clipboard.length) {
                  const pasted = clipboard.map((r, i) => ({
                    ...r,
                    companyId: "",
                    tempId: `PST_${Date.now()}_${i}`,
                    isDirty: true,
                  }));
                  setCompanies([...pasted, ...companies]);
                  setSelectedCompanyRow(pasted[0]);
                }
              },
              onClear: () => {
                setCompanies([]);
                setSelectedCompanyRow(null);
                setSelectedIds(new Set());
                setIsEditing(false);
              },
              onSave: handleMasterSave,
              // onToggleView: () => setIsFormView(!isFormView),
            }}
            selectedRow={
              selectedIds.size > 0 || (selectedCompanyRow && isFormView)
                ? { companyId: activeId }
                : null
            }
            isDirty={isAnyDirty}
            loading={loading}
            clipboard={clipboard}
            clipboardCount={clipboard.length}
            // renderFindInput={() => (
            //   searchColumn === "activeFlag" ? (
            //     <select className="text-[10px] border border-gray-200 rounded px-2 py-1 outline-none bg-white min-w-[100px]" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}>
            //       <option>Select...</option>
            //       <option value="Y">Y</option>
            //       <option value="N">N</option>
            //     </select>
            //   ) : null
            // )}
            // renderReplaceInput={() => (
            //   searchColumn === "activeFlag" ? (
            //     <select className="text-[10px] border border-gray-200 rounded px-2 py-1 outline-none bg-white min-w-[100px]" value={replaceValue} onChange={(e) => setReplaceValue(e.target.value)}>
            //       <option>Select...</option>
            //       <option value="Y">Y</option>
            //       <option value="N">N</option>
            //       <option value="Invert">Invert</option>
            //     </select>
            //   ) : null
            // )}
            renderFindInput={
              () =>
                searchColumn === "activeFlag" ? (
                  <select
                    className="text-[11px] border border-gray-200 rounded px-2 py-1.5 outline-none bg-white w-48"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                  </select>
                ) : null // Returning null lets Toolbar use its default text input
            }
            renderReplaceInput={() =>
              searchColumn === "activeFlag" ? (
                <select
                  className="text-[11px] border border-gray-200 rounded px-2 py-1.5 outline-none bg-white w-48"
                  value={replaceValue}
                  onChange={(e) => setReplaceValue(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                  <option value="Invert">Invert</option>
                </select>
              ) : null
            }
          />
        </div>

        {isFormView ? (
          <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
            <FormSection title="Configuration" icon={AlignLeft}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Parameter ID"
                  value={selectedCompanyRow?.parameterId}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "parameterId", e.target.value)
                  }
                />
                <FormInput
                  label="Description"
                  value={selectedCompanyRow?.description}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "description", e.target.value)
                  }
                />
              </div>
            </FormSection>

            <FormSection title="General Information" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Company ID *"
                  value={selectedCompanyRow?.companyId}
                  readOnly={
                    !isEditing ||
                    (!!selectedCompanyRow?.companyId &&
                      !selectedCompanyRow?.tempId)
                  }
                  onChange={(e) =>
                    handleFieldChange(activeId, "companyId", e.target.value)
                  }
                />
                <FormInput
                  label="Full Name *"
                  value={selectedCompanyRow?.companyName}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "companyName", e.target.value)
                  }
                />
                <FormInput
                  label="Short Name"
                  value={selectedCompanyRow?.companyShortName}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(
                      activeId,
                      "companyShortName",
                      e.target.value,
                    )
                  }
                />
                {/* <div className="flex items-center gap-2 pl-4">
                        <label className="text-[10px] font-bold uppercase text-gray-700">Active Status</label>
                        <input type="checkbox" checked={selectedCompanyRow?.activeFlag === "Y"} onChange={e => handleFieldChange(activeId, "activeFlag", e.target.checked)} className="h-4 w-4 accent-[#17414d]" />
                    </div> */}
                {/* <div className="flex items-center gap-2 pl-4">
                  <label className="text-[10px] font-[400]  text-black">
                    Active Status
                  </label>
                  <input
                    type="checkbox"
                    // This evaluates to true if "Y", which checks the box
                    checked={selectedCompanyRow?.activeFlag === "Y"}
                    onChange={(e) =>
                      handleFieldChange(
                        activeId,
                        "activeFlag",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                    className="h-4 w-4 accent-[#17414d]"
                  />
                </div> */}
                <FormInput
                  label="Copy Settings From *"
                  value={selectedCompanyRow?.copySettingsFrom}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(
                      activeId,
                      "copySettingsFrom",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Location Name"
                  value={selectedCompanyRow?.locationName}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "locationName", e.target.value)
                  }
                />
              </div>
            </FormSection>

            <FormSection title="Tax & Address" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Tax Entity ID *"
                  value={selectedCompanyRow?.taxableEntityId}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(
                      activeId,
                      "taxableEntityId",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Tax ID"
                  value={selectedCompanyRow?.taxId}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "taxId", e.target.value)
                  }
                />
                <FormInput
                  label="Entity Name *"
                  value={selectedCompanyRow?.taxableName}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "taxableName", e.target.value)
                  }
                />
                <FormInput
                  label="Telephone"
                  value={selectedCompanyRow?.telephone}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "telephone", e.target.value)
                  }
                />
                <FormInput
                  label="Address L1"
                  value={selectedCompanyRow?.line1}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "line1", e.target.value)
                  }
                />
                <FormInput
                  label="Address L2"
                  value={selectedCompanyRow?.line2}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "line2", e.target.value)
                  }
                />
                <FormInput
                  label="Address L3"
                  value={selectedCompanyRow?.line3}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "line3", e.target.value)
                  }
                />
                <FormInput
                  label="City"
                  className="flex-[2]"
                  value={selectedCompanyRow?.cityName}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "cityName", e.target.value)
                  }
                />
                <FormInput
                  label="State"
                  className="flex-[2]"
                  value={selectedCompanyRow?.mailStateDc}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "mailStateDc", e.target.value)
                  }
                />
                <FormInput
                  label="Zip Code"
                  value={selectedCompanyRow?.postalCd}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "postalCd", e.target.value)
                  }
                />
                <FormInput
                  label="Country"
                  value={selectedCompanyRow?.countryCd}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(activeId, "countryCd", e.target.value)
                  }
                />
              </div>
            </FormSection>

            <FormSection title="Journal & Location" icon={ClipboardCheck}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Fiscal Year *"
                  value={selectedCompanyRow?.startingFiscalYear}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(
                      activeId,
                      "startingFiscalYear",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Period *"
                  value={selectedCompanyRow?.startingPeriod}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(
                      activeId,
                      "startingPeriod",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Transfer Location"
                  value={selectedCompanyRow?.transferLocationId}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(
                      activeId,
                      "transferLocationId",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Location Name"
                  value={selectedCompanyRow?.locationName}
                  onChange={(e) =>
                    handleFieldChange(activeId, "locationName", e.target.value)
                  }
                />
                <FormInput
                  label="Currency *"
                  value={selectedCompanyRow?.functionalCurrency}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    handleFieldChange(
                      activeId,
                      "functionalCurrency",
                      e.target.value,
                    )
                  }
                />
              </div>
            </FormSection>
          </div>
        ) : null}
      </MainContainer>
    </div>
  );
};

export default ManageCompany;
