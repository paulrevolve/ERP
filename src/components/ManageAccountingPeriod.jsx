import React, { useEffect, useState, useRef, useMemo } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import api from "../utils/api";
import {
  CalendarDays,
  Calendar,
  Search,
  Plus,
  Copy,
  ClipboardPaste,
  Trash2,
  Save,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronDown,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Replace,
  X,
} from "lucide-react";
import ReusableTable from "../helper/tableSection";
import CustomDatePicker from "./CustomeDatePicker";
import { useDraftStore } from "../store/useDraftStore";

const FormSection = ({ title, children, className = "" }) => {
  return (
    <div
      className={`relative rounded border border-slate-200 bg-white py-3 px-3 shadow-none ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 pb-1.5 mb-2.5 border-b border-slate-200 select-none">
          <span className="text-xs font-bold text-gray-700">{title}</span>
        </div>
      )}
      <div className="space-y-1.5">{children}</div>
    </div>
  );
};

const FormInput = ({
  label,
  required,
  type = "text",
  value,
  checked,
  onChange,
  onBlur,
  onKeyDown,
  min,
  max,
  readOnly,
  disabled,
  className = "",
  placeholder,
  horizontal,
  inputClassName = "",
}) => {
  const isClickable = type === "checkbox" || type === "radio";

  if (isClickable) {
    return (
      <div className={`flex flex-col gap-1 w-full ${className}`}>
        <span className="text-xs font-semibold text-slate-700 select-none invisible">
          &nbsp;
        </span>
        <label className="flex items-center gap-2 px-2.5 h-[32px] rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-all duration-150 select-none w-full">
          <input
            type={type}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="w-3.5 h-3.5 rounded border-slate-300 text-[#1677e8] focus:ring-[#1677e8] cursor-pointer disabled:opacity-50 accent-[#1677e8]"
          />
          <span className="text-[11px] font-semibold text-slate-700">
            {label}
          </span>
        </label>
      </div>
    );
  }

  if (horizontal) {
    return (
      <div
        className={`flex items-center justify-between gap-4 w-full ${className}`}
      >
        {label && (
          <span className="text-[11px] font-semibold text-slate-700 select-none w-2/5 text-left">
            {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
          </span>
        )}
        <div className="w-3/5">
          <input
            type={type}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            min={min}
            max={max}
            readOnly={readOnly}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full h-[32px] px-2.5 py-1 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
              ${
                readOnly || disabled
                  ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <span className="text-xs font-semibold text-slate-700 select-none">
          {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
        </span>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        min={min}
        max={max}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full h-[32px] px-2.5 py-1 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
          ${
            readOnly || disabled
              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          }`}
      />
    </div>
  );
};

const FormSearchSelect = ({
  label,
  required,
  value,
  searchTerm = "",
  setSearchTerm,
  options,
  onSelect,
  displayKey,
  secondaryKey,
  disabled,
  placeholder = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const containerRef = useRef(null);

  const searchVal = setSearchTerm ? searchTerm : localSearch;
  const setSearchVal = setSearchTerm ? setSearchTerm : setLocalSearch;

  const selectedOption = options?.find((opt) => {
    const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey], opt.statusCd, opt.adjustmentCode];
    return candidateKeys.some((key) => key !== undefined && String(key).trim() === String(value).trim());
  });

  const filteredOptions = (options || []).filter((opt) => {
    const search = searchVal.toLowerCase().trim();
    if (!search) return true;
    const mainValue = String(opt[displayKey] || "").toLowerCase();
    const subValue = secondaryKey
      ? String(opt[secondaryKey] || "").toLowerCase()
      : "";
    return mainValue.includes(search) || subValue.includes(search);
  });

  const inputValue = isTyping
    ? searchVal
    : selectedOption
      ? selectedOption[displayKey]
      : searchVal || value || "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setIsTyping(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-1 w-full relative">
      {label && (
        <span className="text-xs font-semibold text-slate-700 select-none">
          {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
        </span>
      )}
      <div className="relative w-full">
        <input
          type="text"
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            setIsTyping(true);
            setSearchVal(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => !disabled && setShowDropdown(true)}
          className={`w-full h-[32px] pl-2.5 pr-8 py-1 rounded border text-[11px] font-medium transition-all duration-150 outline-none
            ${
              disabled
                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            }`}
        />
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center"
          onClick={() => !disabled && setShowDropdown(!showDropdown)}
        >
          <ChevronDown size={14} />
        </div>

        {showDropdown && !disabled && (
          <div
            className="absolute left-0 top-full z-[999] w-full mt-1 bg-white border border-slate-200 rounded-md shadow-xl overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "140px", overflowY: "auto" }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 text-[11px] hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none font-medium text-slate-700 flex items-center justify-between"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(opt);
                    setSearchVal("");
                    setIsTyping(false);
                    setShowDropdown(false);
                  }}
                >
                  <span>{opt[displayKey]}</span>
                  {secondaryKey && opt[secondaryKey] && (
                    <span className="text-slate-400 ml-2 text-[10px]">
                      ({opt[secondaryKey]})
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-3 text-[11px] text-slate-400 italic text-center">
                No matches
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ManageAccountingPeriod = ({ canEdit }) => {
  // --- Data States ---
  const [fycd, setFycd] = useState([]);
  const [selectedFycdRow, setSelectedFycdRow] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isFormView, setIsFormView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // --- Sorting State ---
  const [sortColumn, setSortColumn] = useState("fyCd");
  const [sortDirection, setSortDirection] = useState("asc");

  // --- UI & Find/Replace States ---
  const [searchTermProfiles, setSearchTermProfiles] = useState("");
  const [clipboard, setClipboard] = useState([]);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchColumn, setSearchColumn] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);

  const [fiscalYearOpt, setFiscalYearOpt] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerRowId, setDatePickerRowId] = useState(null);
  const [data, setData] = useState([]);

  const [activeView, setActiveView] = useState(false);
  const [moduleProMapping, setModuleProMapping] = useState([]);
  const [originalModuleProMapping, setOriginalModuleProMapping] = useState([]);
  const [isMappingDirty, setIsMappingDirty] = useState(false);
  const [selectedJournalRows, setSelectedJournalRows] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialFormState = {
    fyCd: "",
    periodNo: "",
    periodEndDate: "",
    statusCd: "N",
    statusName: "Not Available",
    isAdjustment: "N",
    adjustmentCode: "N",
    rateName: "N/A",
    isDirty: true,
    companyId: 1,
    isNew: true,
  };

  // --- Dropdown Options ---
  const statusOpt = [
    { statusCd: "N", name: "Not Available" },
    { statusCd: "O", name: "Open" },
    { statusCd: "C", name: "Closed" },
  ];

  const adjRateOpt = [
    { adjustmentCode: "N", name: "N/A" },
    { adjustmentCode: "I", name: "Interim" },
    { adjustmentCode: "F", name: "Final" },
  ];

  const journalStatusOpt = [
    { value: "Y", label: "Open" },
    { value: "N", label: "Closed" },
  ];

  // --- Journal Column Sorting State ---
  const [journalSortColumn, setJournalSortColumn] = useState(null);
  const [journalSortDirection, setJournalSortDirection] = useState("asc");

  const handleJournalColumnSort = (columnKey) => {
    let nextDir = "asc";
    if (journalSortColumn === columnKey) {
      nextDir = journalSortDirection === "asc" ? "desc" : "asc";
    }
    setJournalSortColumn(columnKey);
    setJournalSortDirection(nextDir);
  };

  const renderJournalSortIcon = (columnKey, label) => (
    <span
      onClick={(e) => {
        e.stopPropagation();
        handleJournalColumnSort(columnKey);
      }}
      className="cursor-pointer text-slate-500 hover:text-slate-800 transition-colors p-0.5 inline-flex items-center justify-center"
      title={`Sort by ${label} (${journalSortColumn === columnKey && journalSortDirection === "desc" ? "Descending" : "Ascending"})`}
    >
      {journalSortColumn === columnKey ? (
        journalSortDirection === "asc" ? (
          <ArrowUp size={13} className="text-[#1677e8]" />
        ) : (
          <ArrowDown size={13} className="text-[#1677e8]" />
        )
      ) : (
        <ArrowUpDown size={13} className="text-slate-400 hover:text-slate-600" />
      )}
    </span>
  );

  const handleColumnSort = (columnKey) => {
    let nextDir = "asc";
    if (sortColumn === columnKey) {
      nextDir = sortDirection === "asc" ? "desc" : "asc";
    }
    setSortColumn(columnKey);
    setSortDirection(nextDir);
  };

  const renderSortIcon = (columnKey, label) => (
    <span
      onClick={(e) => {
        e.stopPropagation();
        handleColumnSort(columnKey);
      }}
      className="cursor-pointer text-slate-500 hover:text-slate-800 transition-colors p-0.5 inline-flex items-center justify-center"
      title={`Sort by ${label} (${sortColumn === columnKey && sortDirection === "desc" ? "Descending" : "Ascending"})`}
    >
      {sortColumn === columnKey ? (
        sortDirection === "asc" ? (
          <ArrowUp size={13} className="text-[#1677e8]" />
        ) : (
          <ArrowDown size={13} className="text-[#1677e8]" />
        )
      ) : (
        <ArrowUpDown size={13} className="text-slate-400 hover:text-slate-600" />
      )}
    </span>
  );

  const myColumns = [
    {
      label: "Fiscal Year",
      key: "fyCd",
      required: true,
      readOnlyIfExisting: true,
      sortIcon: renderSortIcon("fyCd", "Fiscal Year"),
    },
    {
      label: "Period No",
      key: "periodNo",
      required: true,
      sortIcon: renderSortIcon("periodNo", "Period No"),
    },
    {
      label: "Period End Date",
      key: "periodEndDate",
      type: "date",
      sortIcon: renderSortIcon("periodEndDate", "Period End Date"),
    },
    {
      label: "Status",
      key: "statusName",
      type: "search-select",
      options: statusOpt,
      displayKey: "name",
      onSelect: (opt, id) => {
        handleFieldChange(id, "statusCd", opt.statusCd);
        handleFieldChange(id, "statusName", opt.name);
      },
      sortIcon: renderSortIcon("statusName", "Status"),
    },
    {
      label: "Adj Period",
      key: "isAdjustment",
      type: "checkbox",
      value: (row) => row.isAdjustment === "Y",
      onToggle: (id, isCurrentlyChecked) => {
        const newValue = isCurrentlyChecked ? "N" : "Y";
        handleFieldChange(id, "isAdjustment", newValue);
      },
    },
    {
      label: "Adj Rate Type",
      key: "rateName",
      type: "search-select",
      options: adjRateOpt,
      displayKey: "name",
      onSelect: (opt, id) => {
        handleFieldChange(id, "adjustmentCode", opt.adjustmentCode);
        handleFieldChange(id, "rateName", opt.name);
      },
      isDisabled: (row) => row.isAdjustment !== "Y",
      sortIcon: renderSortIcon("rateName", "Adj Rate Type"),
    },
  ];

  const journalColumns = [
    {
      label: "Journal Code",
      key: "journalCode",
      sortIcon: renderJournalSortIcon("journalCode", "Journal Code"),
    },
    {
      label: "Description",
      key: "journalDesc",
      sortIcon: renderJournalSortIcon("journalDesc", "Description"),
    },
    {
      label: "Status",
      key: "isOpen",
      type: "select",
      options: journalStatusOpt,
      optionValue: "value",
      optionLabel: "label",
      sortIcon: renderJournalSortIcon("isOpen", "Status"),
    },
  ];

  const displayJournalData = useMemo(() => {
    if (!journalSortColumn) return moduleProMapping;
    return [...moduleProMapping].sort((a, b) => {
      const valA = a[journalSortColumn] ?? "";
      const valB = b[journalSortColumn] ?? "";
      const numA = Number(valA);
      const numB = Number(valB);
      if (!isNaN(numA) && !isNaN(numB) && valA !== "" && valB !== "") {
        return journalSortDirection === "asc" ? numA - numB : numB - numA;
      }
      return journalSortDirection === "asc"
        ? String(valA).localeCompare(String(valB), undefined, { numeric: true })
        : String(valB).localeCompare(String(valA), undefined, { numeric: true });
    });
  }, [moduleProMapping, journalSortColumn, journalSortDirection]);

  const handleJournalFieldChange = (id, key, value) => {
    setIsMappingDirty(true);

    setModuleProMapping((prev) =>
      prev.map((item) => {
        if (item.journalCode === id) {
          const statusCode = value === "Y" ? "Y" : "N";

          return {
            ...item,
            [key]: statusCode,
            isDirty: true,
          };
        }
        return item;
      }),
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [periodRes, fyRes] = await Promise.all([
        api.get(`${backendUrl}/api/accounting-period`),
        api.get(`${backendUrl}/api/FiscalYear`),
      ]);

      const rawPeriods = periodRes.data || [];
      const rawFiscalYears = fyRes.data || [];

      setFiscalYearOpt(rawFiscalYears);

      const enrichedData = rawPeriods.map((item) => ({
        ...item,
        tableRowKey: `${item.fyCd}_${item.periodNo}`,
        statusName:
          statusOpt.find((o) => o.statusCd === item.statusCd)?.name ||
          (item.statusCd === "C" ? "Closed" : item.statusCd === "O" ? "Open" : "Not Available"),
        rateName:
          adjRateOpt.find((o) => o.adjustmentCode === item.adjustmentCode)
            ?.name || "N/A",
        isDirty: false,
      }));

      setFycd(() => {
        return [...enrichedData];
      });
      setSelectedRows([]);
      setSelectedFycdRow(enrichedData.length > 0 ? enrichedData[0] : null);
    } catch (e) {
      console.error("Fetch error", e);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const getRowKey = (row) => {
    if (row?.tableRowKey) return row.tableRowKey;
    if (row?.tempId) return row.tempId;
    if (row?.fyCd && row?.periodNo !== undefined) return `${row.fyCd}_${row.periodNo}`;
    return "";
  };

  // --- Draft Store Hydration on Mount ---
  useEffect(() => {
    const draft = useDraftStore.getState().getDraft("manage-accounting-period");
    if (draft && Array.isArray(draft.fycd) && draft.fycd.length > 0 && (draft.isDirty || draft.hasUnsaved)) {
      setFycd(draft.fycd);
      if (draft.selectedFycdRow) setSelectedFycdRow(draft.selectedFycdRow);
      if (draft.selectedRows) setSelectedRows(draft.selectedRows);
      if (typeof draft.isFormView === "boolean") setIsFormView(draft.isFormView);
    } else {
      fetchData();
    }
  }, []);

  // --- Auto-Save Draft to Zustand ---
  const fycdRef = useRef(fycd);
  const selectedFycdRowRef = useRef(selectedFycdRow);
  const selectedRowsRef = useRef(selectedRows);
  const isFormViewRef = useRef(isFormView);

  useEffect(() => {
    fycdRef.current = fycd;
    selectedFycdRowRef.current = selectedFycdRow;
    selectedRowsRef.current = selectedRows;
    isFormViewRef.current = isFormView;

    const hasDirty = fycd.some((r) => r.isDirty || r.tempId);
    if (hasDirty) {
      useDraftStore.getState().saveDraft("manage-accounting-period", {
        fycd,
        selectedFycdRow,
        selectedRows,
        isFormView,
        isDirty: true,
        hasUnsaved: true,
      });
    }
  }, [fycd, selectedFycdRow, selectedRows, isFormView]);

  useEffect(() => {
    return () => {
      const cur = fycdRef.current;
      if (cur && cur.some((r) => r.isDirty || r.tempId)) {
        useDraftStore.getState().saveDraft("manage-accounting-period", {
          fycd: cur,
          selectedFycdRow: selectedFycdRowRef.current,
          selectedRows: selectedRowsRef.current,
          isFormView: isFormViewRef.current,
          isDirty: true,
          hasUnsaved: true,
        });
      }
    };
  }, []);

  const handleFieldChange = (id, field, value) => {
    let finalValue = value;

    if (field === "fyCd" && typeof value === "string" && /\s/.test(value)) {
      toast.warn("No spacing allowed in Fiscal Year Code");
      finalValue = value.replace(/\s+/g, "");
    }

    if (field === "periodNo") {
      if (value !== "" && value !== null && value !== undefined) {
        let numStr = String(value).replace(/[^0-9]/g, "");
        if (numStr !== "" && Number(numStr) < 0) numStr = "0";
        finalValue = numStr;
      }
    }

    let extraUpdates = {};
    if (field === "isAdjustment" && finalValue === "N") {
      extraUpdates = { adjustmentCode: "N", rateName: "N/A" };
    }

    setFycd((prev) =>
      prev.map((row) => {
        if (getRowKey(row) === id) {
          const updatedRow = {
            ...row,
            [field]: finalValue,
            ...extraUpdates,
            isDirty: true,
          };
          updatedRow.tableRowKey = updatedRow.tempId || `${updatedRow.fyCd}_${updatedRow.periodNo}`;

          if (getRowKey(selectedFycdRow || {}) === id) {
            setSelectedFycdRow(updatedRow);
          }

          setSelectedRows((prevSelected) =>
            prevSelected.map((sRow) =>
              getRowKey(sRow) === id ? updatedRow : sRow,
            ),
          );

          return updatedRow;
        }
        return row;
      }),
    );

    if (filteredGroups.length > 0) {
      setFilteredGroups((prev) =>
        prev.map((row) => {
          if (getRowKey(row) === id) {
            const updatedRow = {
              ...row,
              [field]: finalValue,
              ...extraUpdates,
              isDirty: true,
            };
            updatedRow.tableRowKey = updatedRow.tempId || `${updatedRow.fyCd}_${updatedRow.periodNo}`;

            if (getRowKey(selectedFycdRow || {}) === id) {
              setSelectedFycdRow(updatedRow);
            }

            setSelectedRows((prevSelected) =>
              prevSelected.map((sRow) =>
                getRowKey(sRow) === id ? updatedRow : sRow,
              ),
            );

            return updatedRow;
          }
          return row;
        }),
      );
    }
  };

  const handleAddFyCd = () => {
    const tempKey = `TEMP_${Date.now()}`;
    const newRow = {
      tempId: tempKey,
      tableRowKey: tempKey,
      ...initialFormState,
      fyCd: selectedFycdRow?.fyCd || (fiscalYearOpt.length > 0 ? fiscalYearOpt[0].fyCd : ""),
    };
    setFycd((prev) => [newRow, ...prev]);
    setSelectedFycdRow(newRow);
    setSelectedRows([newRow]);
    setShowDatePicker(false);
    setDatePickerRowId(null);
  };

  const handleSaveJournalStatus = async () => {
    if (!isMappingDirty || moduleProMapping.length === 0) return;
    const companyId = user.companyId || "1";

    const payload = moduleProMapping.map((row) => ({
      journalCode: row.journalCode,
      fyCd: row.fyCd || selectedFycdRow?.fyCd,
      periodNo: row.periodNo ?? selectedFycdRow?.periodNo,
      companyId: row.companyId || selectedFycdRow?.companyId || "1",
      isOpen:
        String(row.isOpen || "").toUpperCase() === "O" ||
        String(row.isOpen || "").toUpperCase() === "Y"
          ? "Y"
          : "N",
      modifiedBy: user.name || "",
      journalDesc: row.journalDesc || "",
    }));

    await api.post(
      `${backendUrl}/api/journal-status/bulk-upsert?companyId=${companyId}`,
      payload,
    );
    setIsMappingDirty(false);
    setOriginalModuleProMapping(payload);
  };

  const handleMasterSave = async () => {
    const changedRows = fycd.filter((f) => f.isDirty || f.tempId);

    if (changedRows.length === 0 && !isMappingDirty) {
      return toast.warn("No changes to save");
    }

    setLoading(true);
    try {
      if (changedRows.length > 0) {
        await Promise.all(
          changedRows.map((row) => {
            const payload = {
              fyCd: row.fyCd,
              periodNo: row.periodNo,
              periodEndDate: row.periodEndDate,
              statusCd: row.statusCd,
              adjustmentCode: row.adjustmentCode,
              isAdjustment:
                row.isAdjustment === true || row.isAdjustment === "Y"
                  ? "Y"
                  : "N",
              companyId: String(row.companyId) || "1",
              modifiedBy: user.name,
            };

            if (row.tempId) {
              return api.post(`${backendUrl}/api/accounting-period`, payload);
            } else {
              return api.put(
                `${backendUrl}/api/accounting-period/${row.fyCd}/${row.periodNo}`,
                payload,
              );
            }
          }),
        );
      }

      if (isMappingDirty && moduleProMapping.length > 0) {
        await handleSaveJournalStatus();
      }

      useDraftStore.getState().clearDraft("manage-accounting-period");
      toast.success("All changes saved successfully");
      fetchData();
    } catch (e) {
      console.error("Save Error:", e);
      toast.error(
        e.response?.data?.message ||
          "Save failed. Please check required fields.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      return toast.warn("Select at least one record to delete.");
    }

    const confirmMessage =
      selectedRows.length === 1
        ? `Delete Period ${selectedRows[0].periodNo} of ${selectedRows[0].fyCd}?`
        : `Delete ${selectedRows.length} selected records?`;

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      await Promise.all(
        selectedRows.map((row) => {
          if (!row.tempId) {
            return api.delete(
              `${backendUrl}/api/accounting-period/${row.fyCd}/${row.periodNo}`,
            );
          }
          return Promise.resolve();
        }),
      );

      const deletedKeys = selectedRows.map((r) => getRowKey(r));
      const updatedList = fycd.filter(
        (f) => !deletedKeys.includes(getRowKey(f)),
      );

      setFycd(updatedList);
      setSelectedRows([]);

      if (updatedList.length > 0) {
        setSelectedFycdRow(updatedList[0]);
      } else {
        handleAddFyCd();
      }

      toast.success("Deleted successfully");
    } catch (e) {
      console.error("Delete Error:", e);
      toast.error(e.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (selectedRows.length === 0)
      return toast.warn("Select at least one record to copy.");
    setClipboard([...selectedRows]);
    toast.success(`${selectedRows.length} record(s) copied to clipboard`);
  };

  const handlePaste = () => {
    if (!clipboard.length) return toast.warn("Clipboard is empty.");

    const pasted = clipboard.map((row, i) => {
      const { tempId, id, tableRowKey, ...restProps } = row;
      const newKey = `PASTE_${Date.now()}_${i}`;

      return {
        ...restProps,
        tempId: newKey,
        tableRowKey: newKey,
        periodEndDate: "",
        isDirty: true,
      };
    });

    setFycd((prev) => [...pasted, ...prev]);
    setSelectedFycdRow(pasted[0]);
    setSelectedRows([pasted[0]]);
    setShowDatePicker(false);
    setDatePickerRowId(null);

    toast.success(
      `${pasted.length} record(s) pasted. Please enter new Period values.`,
    );
  };

  const handleClear = () => {
    const hasNewRows = fycd.some((f) => !!f.tempId);
    const hasEdits = fycd.some((f) => f.isDirty === true);
    const hasMappingEdits = isMappingDirty;

    if (!hasNewRows && !hasEdits && !hasMappingEdits) return;

    if (window.confirm("Discard unsaved changes and new rows?")) {
      useDraftStore.getState().clearDraft("manage-accounting-period");
      setFycd((prev) => prev.filter((f) => !f.tempId));
      fetchData();
      setFilteredGroups([]);
      setSelectedRows([]);

      if (hasMappingEdits) {
        setModuleProMapping(originalModuleProMapping);
        setIsMappingDirty(false);
      }

      toast.info("Unsaved changes and new rows have been discarded.");
    }
  };

  // --- FIND & REPLACE LOGIC ---
  const handleFind = () => {
    if (!searchValue.trim()) {
      toast.warn("Please enter search text");
      return;
    }
    const matches = fycd.filter((row) => {
      const val = String(row[searchColumn] || "").toLowerCase();
      return val.includes(searchValue.toLowerCase());
    });
    if (matches.length === 0) {
      toast.info("No matching records found");
    } else {
      toast.success(`Found ${matches.length} matching record(s)`);
      setSelectedRows(matches);
      if (matches.length > 0) {
        setSelectedFycdRow(matches[0]);
      }
    }
  };

  const handleReplaceAll = () => {
    if (searchColumn === "fyCd") {
      toast.warn("Fiscal Year Code cannot be modified via Replace.");
      return;
    }
    if (!searchValue.trim()) {
      toast.warn("Please enter search text");
      return;
    }
    let replacedCount = 0;
    const updated = fycd.map((row) => {
      const val = String(row[searchColumn] || "");
      if (val.toLowerCase().includes(searchValue.toLowerCase())) {
        replacedCount++;
        const regex = new RegExp(
          searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi",
        );
        const newVal = val.replace(regex, replaceValue);
        return {
          ...row,
          [searchColumn]: newVal,
          isDirty: true,
        };
      }
      return row;
    });

    if (replacedCount > 0) {
      setFycd(updated);
      if (selectedFycdRow) {
        const updatedSelected = updated.find(
          (r) => getRowKey(r) === getRowKey(selectedFycdRow),
        );
        if (updatedSelected) setSelectedFycdRow(updatedSelected);
      }
      toast.success(`Replaced ${replacedCount} occurrence(s)`);
    } else {
      toast.info("No matches to replace");
    }
  };

  const handleClearFind = () => {
    setSearchValue("");
    setReplaceValue("");
    setSelectedRows(selectedFycdRow ? [selectedFycdRow] : []);
  };

  // --- Memoized Sorted and Filtered Table Data ---
  const displayData = useMemo(() => {
    const base = filteredGroups.length > 0 ? filteredGroups : fycd;
    if (!sortColumn) return base;

    return [...base].sort((a, b) => {
      // Keep new unsaved rows at top
      if (a.tempId && !b.tempId) return -1;
      if (!a.tempId && b.tempId) return 1;

      const valA = a[sortColumn] ?? "";
      const valB = b[sortColumn] ?? "";
      const numA = Number(valA);
      const numB = Number(valB);
      if (!isNaN(numA) && !isNaN(numB) && valA !== "" && valB !== "") {
        return sortDirection === "asc" ? numA - numB : numB - numA;
      }
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB), undefined, { numeric: true })
        : String(valB).localeCompare(String(valA), undefined, { numeric: true });
    });
  }, [filteredGroups, fycd, sortColumn, sortDirection]);

  let currentIndex = fycd.findIndex(
    (f) => getRowKey(f) === getRowKey(selectedFycdRow || {}),
  );

  const handleNavigate = (dir) => {
    let newIdx = currentIndex;

    if (dir === "next") {
      newIdx = currentIndex + 1;
    } else if (dir === "prev") {
      newIdx = currentIndex - 1;
    } else if (dir === "start") {
      newIdx = 0;
    } else if (dir === "end") {
      newIdx = fycd.length - 1;
    }

    if (newIdx >= 0 && newIdx < fycd.length) {
      const targetRow = fycd[newIdx];
      setSelectedFycdRow(targetRow);
      setSelectedRows([targetRow]);
      setShowDatePicker(false);
      setDatePickerRowId(null);
    } else {
      if (dir === "next") toast.info("You are at the last record.");
      if (dir === "prev") toast.info("You are at the first record.");
    }
  };

  const handleRowSelection = (row) => {
    const safeRows = Array.isArray(selectedRows) ? selectedRows : [];
    const rowId = getRowKey(row);
    const isSelected = safeRows.some((r) => getRowKey(r) === rowId);

    if (isSelected) {
      const newSelection = safeRows.filter((r) => getRowKey(r) !== rowId);
      setSelectedRows(newSelection);
      if (getRowKey(selectedFycdRow) === rowId) {
        setSelectedFycdRow(
          newSelection.length > 0
            ? newSelection[newSelection.length - 1]
            : null,
        );
      }
    } else {
      setSelectedRows([...safeRows, row]);
      setSelectedFycdRow(row);
    }
  };

  const handleSelectAll = () => {
    const dataToSelect = filteredGroups.length > 0 ? filteredGroups : fycd;

    const allCurrentInViewSelected = dataToSelect.every((item) =>
      selectedRows.some((selected) => getRowKey(selected) === getRowKey(item)),
    );

    if (allCurrentInViewSelected) {
      const remainingRows = selectedRows.filter(
        (selected) =>
          !dataToSelect.some((item) => getRowKey(item) === getRowKey(selected)),
      );
      setSelectedRows(remainingRows);
      if (remainingRows.length > 0) {
        setSelectedFycdRow(remainingRows[0]);
      } else if (fycd.length > 0) {
        setSelectedFycdRow(fycd[0]);
      }
    } else {
      setSelectedRows((prev) => {
        const prevSafe = Array.isArray(prev) ? prev : [];
        const newItems = dataToSelect.filter(
          (item) => !prevSafe.some((p) => getRowKey(p) === getRowKey(item)),
        );
        const combined = [...prevSafe, ...newItems];
        if (combined.length > 0) setSelectedFycdRow(combined[0]);
        return combined;
      });
    }
  };

  const handleJournalRowSelection = (row) => {
    setSelectedJournalRows([row]);
  };

  const handleAssignJournalEntires = async () => {
    let targetRow = selectedFycdRow;
    if (!targetRow && fycd.length > 0) {
      targetRow = selectedRows && selectedRows.length > 0 ? selectedRows[0] : fycd[0];
      setSelectedFycdRow(targetRow);
    }

    const fyCd = targetRow?.fyCd;
    const periodNo = targetRow?.periodNo;
    const companyId = targetRow?.companyId || "1";

    if (!fyCd || periodNo === undefined || periodNo === "") {
      toast.warn("Please select a record from the table first.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(
        `${backendUrl}/api/journal-status/${fyCd}/${periodNo}/${companyId}`,
      );

      if (res.data) {
        const enrichedJournalData = res.data.map((item) => {
          const normalizedOpen = String(item.isOpen || "").toUpperCase();
          const statusCode =
            normalizedOpen === "O" || normalizedOpen === "Y" ? "Y" : "N";

          return {
            ...item,
            isOpen: statusCode,
            statusDisplay: statusCode === "Y" ? "Open" : "Closed",
            isDirty: false,
          };
        });

        setModuleProMapping(enrichedJournalData);
        setOriginalModuleProMapping(enrichedJournalData);
        setActiveView(true);
        setIsMappingDirty(false);
      }
    } catch (error) {
      console.error("Mapping Error:", error);
      toast.error("Could not fetch journal status.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAllJournals = () => {
    if (moduleProMapping.length === 0) return;

    setIsMappingDirty(true);
    setModuleProMapping((prev) =>
      prev.map((item) => ({
        ...item,
        isOpen: "Y",
        statusDisplay: "Open",
        isDirty: true,
      })),
    );
  };

  const toggleView = () => {
    if (!isFormView) {
      if (selectedRows.length === 0 && fycd.length > 0) {
        const firstRow = fycd[0];
        setSelectedFycdRow(firstRow);
        setSelectedRows([firstRow]);
      } else if (selectedRows.length > 0 && !selectedFycdRow) {
        setSelectedFycdRow(selectedRows[0]);
      }
    }
    setIsFormView(!isFormView);
  };

  const handleRowDoubleClick = (item) => {
    setSelectedFycdRow(item);
    setSelectedRows([item]);
    setIsFormView(true);
  };

  const hasSelection = isFormView
    ? !!selectedFycdRow && fycd.length > 0
    : Array.isArray(selectedRows) && selectedRows.length > 0;
  const isCopyDisabled = loading || !hasSelection;
  const isDeleteDisabled = loading || !hasSelection;
  const isPasteDisabled = loading || !clipboard || clipboard.length === 0;

  return (
    <div className="payment-voucher-page min-h-full bg-white text-[#1f2937] font-inter">
      <style>
        {`
        .payment-voucher-page { font-size:12px; color:#1f2937; }
        .payment-voucher-page .voucher-head-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #d5dfeb; border-radius:7px; background:#fff; color:#344a63; font-size:11px; font-weight:600; cursor:pointer; }
        .payment-voucher-page .voucher-head-btn:hover, .payment-voucher-page .voucher-icon-btn:hover, .payment-voucher-page .voucher-outline-btn:hover { background:#f5f8fb; border-color:#b9c8d8; }
        .payment-voucher-page .voucher-primary-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #1677e8; border-radius:7px; background:#1677e8; color:#fff; font-size:11px; font-weight:600; cursor:pointer; }
        .payment-voucher-page .voucher-primary-btn:hover { background:#125bc3; border-color:#125bc3; }
        .payment-voucher-page .voucher-outline-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #d5dfeb; border-radius:7px; background:#fff; color:#344a63; font-size:11px; font-weight:600; cursor:pointer; }
        .payment-voucher-page .voucher-icon-btn { display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border:1px solid #d5dfeb; border-radius:7px; background:#fff; color:#52657c; cursor:pointer; }
        .payment-voucher-page .voucher-head-btn:disabled,
        .payment-voucher-page .voucher-primary-btn:disabled,
        .payment-voucher-page .voucher-icon-btn:disabled,
        .payment-voucher-page .voucher-outline-btn:disabled {
          opacity: 0.45 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
          background: #f8fafc !important;
          border-color: #e2e8f0 !important;
          color: #94a3b8 !important;
        }
        .payment-voucher-page .voucher-panel { border:1px solid #e5e7eb; border-radius:6px; background:#fff; padding:0; box-shadow:none; overflow:visible !important; }
        .payment-voucher-page .voucher-panel > .flex.items-center { min-height:36px; padding:0 12px; margin:0; border-bottom:1px solid #eeeeee; }
        .payment-voucher-page .voucher-panel > .flex.items-center span { color:#3c4043 !important; font-size:12px !important; font-weight:600 !important; }
        .payment-voucher-page .voucher-master-card { padding:0 !important; overflow:visible !important; }
        .payment-voucher-page .voucher-master-card .voucher-panel-title { min-height:36px; margin:0; padding:0 12px 0; }
        .payment-voucher-page .voucher-master-card > .grid { padding:12px; overflow:visible !important; }
        .payment-voucher-page .voucher-master-card .space-y-2 { gap:10px; position:relative; }
        .payment-voucher-page .voucher-panel-title { display:flex; align-items:center; min-height:36px; margin:0 12px 0; padding:0 0 0; border-bottom:1px solid #eeeeee; color:#3c4043; font-size:12px; font-weight:600; }
        .payment-voucher-page .voucher-nav-btn { display:inline-flex; align-items:center; justify-content:center; width:34px; height:30px; border:0; border-right:1px solid #d5dfeb; background:#f5f8fb; color:#718096; cursor:pointer; }
        .payment-voucher-page .voucher-nav-btn:last-child { border-right:0; }
        .payment-voucher-page .voucher-nav-btn:hover { background:#eaf1f7; color:#17414d; }
        .payment-voucher-page .voucher-nav-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .payment-voucher-page .voucher-count { display:inline-flex; align-items:center; justify-content:center; min-width:48px; height:30px; padding:0 8px; background:#fff; color:#17414d; font-size:11px; font-weight:700; }
        .payment-voucher-page .voucher-nested-tab { height:28px; padding:0 10px; border-radius:6px; background:#eaf2fe; color:#1677e8; border:1px solid #c9defc; font-size:11px; display:inline-flex; align-items:center; gap:6px; cursor:pointer; }
        .payment-voucher-page .voucher-nested-tab:hover { background:#dbe9fd; }
        .payment-voucher-page .voucher-tab-pill { height:24px; padding:0 8px; border-radius:12px; font-size:10px; font-weight:700; display:inline-flex; align-items:center; background:#f1f5f9; color:#475569; }

        /* TABLE INPUT STYLING MATCHING MANAGECOUNTRIES & MANAGEFISCALYEAR */
        .payment-voucher-page .td-input[readonly] {
          background-color: #f8fafc !important;
          color: #94a3b8 !important;
          border-color: #e2e8f0 !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
          user-select: none !important;
        }
        .payment-voucher-page .td-input:focus,
        .payment-voucher-page .td-input:focus-visible,
        .payment-voucher-page .td-input:focus-within,
        .payment-voucher-page .td-input:active {
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }
        `}
      </style>

      {/* NEW UI TOP BAR */}
      <div className="h-[50px] border-b border-[#e5e7eb] bg-white px-5 ml-[15px]">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#7b8798]">
            <span className="font-medium text-[#4f5f76]">Accounting</span>
            <span>›</span>
            <span className="font-medium text-[#4f5f76]">General Ledger</span>
            <span>›</span>
            <span className="truncate">Accounting Periods</span>
          </div>
        </div>
      </div>

      {/* NEW UI PAGE HEADER */}
      <div className="border-b border-[#dbe3eb] bg-white ml-[15px]">
        <div className="flex items-center justify-between gap-3 pl-4 pr-3 py-2">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[18px] font-semibold tracking-[-0.2px] text-[#172b4d] whitespace-nowrap">
              Accounting Period
            </h1>
            <div className="flex items-center rounded-md border border-[#d5dfeb] bg-[#f5f8fb] overflow-hidden">
              <button
                type="button"
                className="voucher-nav-btn"
                title="First"
                onClick={() => handleNavigate("start")}
                disabled={currentIndex <= 0}
              >
                <ChevronsLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Previous"
                onClick={() => handleNavigate("prev")}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <span className="voucher-count">
                {selectedFycdRow && fycd.length > 0
                  ? (currentIndex >= 0 ? currentIndex + 1 : 1)
                  : 0}{" "}
                / {fycd.length}
              </span>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Next"
                onClick={() => handleNavigate("next")}
                disabled={currentIndex >= fycd.length - 1}
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Last"
                onClick={() => handleNavigate("end")}
                disabled={currentIndex >= fycd.length - 1}
              >
                <ChevronsRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAddFyCd}
              className="voucher-primary-btn"
            >
              <Plus size={14} /> Create
            </button>

            <button
              type="button"
              className="voucher-head-btn"
              onClick={handleCopy}
              disabled={isCopyDisabled}
            >
              <Copy size={14} />
              Copy
            </button>

            <button
              type="button"
              className="voucher-head-btn"
              onClick={handlePaste}
              disabled={isPasteDisabled}
            >
              <ClipboardPaste size={14} />
              Paste
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleteDisabled}
              className="voucher-head-btn"
            >
              <Trash2 size={14} />
              Delete
            </button>

            <button
              type="button"
              onClick={() => setShowFindReplace((prev) => !prev)}
              className={`voucher-head-btn ${showFindReplace ? "bg-slate-100 border-[#1677e8] text-[#1677e8]" : ""}`}
              title="Find & Replace (Form & Table)"
            >
              <Replace size={14} />
              Find/Replace
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="voucher-head-btn"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleMasterSave}
              className="voucher-head-btn text-[#1677e8] border-[#1677e8]/40 hover:bg-[#1677e8]/5"
            >
              <Save size={14} />
              Save
            </button>

            <button
              type="button"
              onClick={toggleView}
              disabled={loading}
              className="relative flex h-[30px] w-[82px] items-center rounded-full border border-[#d5dfeb] bg-[#f5f8fb] p-[3px] transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              <span
                className={`absolute top-[3px] h-[24px] w-[38px] rounded-full bg-white shadow-sm transition-all duration-200 ${
                  isFormView ? "left-[3px]" : "left-[41px]"
                }`}
              />
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center text-[10px] font-semibold ${
                  isFormView ? "text-[#1677e8]" : "text-[#7b8798]"
                }`}
              >
                Form
              </span>
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center text-[10px] font-semibold ${
                  !isFormView ? "text-[#1677e8]" : "text-[#7b8798]"
                }`}
              >
                Table
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ORIGINAL CONTENT, RESTYLED TO THE NEW UI */}
      <div className="px-4 pb-4 pt-3 lg:px-4 ml-[15px]">
        <div className="new-ui-content text-xs space-y-2">
          {/* Find & Replace Bar (Available in both Form and Table views) */}
          {showFindReplace && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2.5 animate-in slide-in-from-top-1 duration-150 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-600">In:</span>
                  <select
                    value={searchColumn}
                    onChange={(e) => setSearchColumn(e.target.value)}
                    className="px-2 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-700 outline-none focus:border-[#1677e8]"
                  >
                    <option value="all">All Columns</option>
                    <option value="fyCd">Fiscal Year</option>
                    <option value="periodNo">Period No</option>
                    <option value="statusName">Status</option>
                    <option value="rateName">Rate Type</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Find..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFind()}
                    className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1677e8] w-36"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Replace with..."
                    value={replaceValue}
                    disabled={searchColumn === "fyCd"}
                    onChange={(e) => setReplaceValue(e.target.value)}
                    className={`px-2.5 py-1 text-[11px] border border-slate-300 rounded font-medium outline-none w-36 ${
                      searchColumn === "fyCd"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed placeholder:text-slate-300"
                        : "bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#1677e8]"
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleFind}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#1677e8] bg-blue-50 hover:bg-blue-100 border border-[#1677e8]/30 rounded cursor-pointer transition-colors"
                >
                  Find / Filter
                </button>

                <button
                  type="button"
                  disabled={searchColumn === "fyCd"}
                  onClick={handleReplaceAll}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                    searchColumn === "fyCd"
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "text-white bg-[#1677e8] hover:bg-[#125bc3] cursor-pointer"
                  }`}
                >
                  Replace All
                </button>

                <button
                  type="button"
                  onClick={handleClearFind}
                  className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200 rounded cursor-pointer transition-colors"
                >
                  Reset
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowFindReplace(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {!isFormView ? (
            <div className="bg-white border border-gray-200 p-2 rounded">
              <ReusableTable
                data={displayData}
                columns={myColumns}
                rowKey="tableRowKey"
                doubleclick={handleRowDoubleClick}
                showCheckboxes={true}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelection}
                onSelectAll={handleSelectAll}
                onFieldChange={handleFieldChange}
                maxHeight="max-h-[500px]"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="voucher-panel voucher-master-card mb-4">
                <div className="voucher-panel-title">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    Accounting Period
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-3">
                  <div className="space-y-2">
                    <FormInput
                      label="Fiscal Year"
                      required
                      value={selectedFycdRow?.fyCd || ""}
                      readOnly={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormInput
                      label="Period Number"
                      required
                      type="number"
                      min="0"
                      value={selectedFycdRow?.periodNo ?? ""}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val !== "") {
                          val = val.replace(/[^0-9]/g, "");
                          if (val !== "" && Number(val) < 0) val = "0";
                        }
                        handleFieldChange(
                          getRowKey(selectedFycdRow),
                          "periodNo",
                          val,
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 w-full relative">
                      <span className="text-xs font-semibold text-slate-700 select-none">
                        Period End Date
                      </span>

                      <div className="relative">
                        <input
                          type="text"
                          className="w-full h-[32px] pl-2.5 pr-8 py-1 rounded border border-slate-200 bg-white text-slate-800 text-[11px] font-medium transition-all duration-150 outline-none hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                          placeholder="MM-DD-YYYY"
                          value={(() => {
                            const val = selectedFycdRow?.periodEndDate;
                            if (!val) return "";
                            const datePart = val.includes("T")
                              ? val.split("T")[0]
                              : val;
                            const parts = datePart.split("-");
                            if (
                              parts.length === 3 &&
                              parts[0].length === 4
                            ) {
                              return `${parts[1]}-${parts[2]}-${parts[0]}`;
                            }
                            return datePart;
                          })()}
                          onChange={(e) => {
                            let raw = e.target.value.replace(/\D/g, "");
                            if (raw.length > 8) raw = raw.slice(0, 8);

                            if (raw.length >= 2) {
                              let month = parseInt(raw.slice(0, 2), 10);
                              if (month > 12) raw = "12" + raw.slice(2);
                              else if (raw.slice(0, 2) === "00")
                                raw = "01" + raw.slice(2);
                            }

                            if (raw.length >= 4) {
                              let monthPart = raw.slice(0, 2);
                              let dayPart = raw.slice(2, 4);
                              let day = parseInt(dayPart, 10);
                              if (day > 31)
                                raw = monthPart + "31" + raw.slice(4);
                              else if (dayPart === "00")
                                raw = monthPart + "01" + raw.slice(4);
                            }

                            let formatted = raw;
                            if (raw.length > 2 && raw.length <= 4) {
                              formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
                            } else if (raw.length > 4) {
                              formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4)}`;
                            }

                            const id = getRowKey(selectedFycdRow);

                            if (raw.length === 8) {
                              const mm = raw.slice(0, 2);
                              const dd = raw.slice(2, 4);
                              const yyyy = raw.slice(4);
                              handleFieldChange(
                                id,
                                "periodEndDate",
                                `${yyyy}-${mm}-${dd}`,
                              );
                              setShowDatePicker(false);
                            } else {
                              handleFieldChange(
                                id,
                                "periodEndDate",
                                formatted,
                              );
                            }
                          }}
                          onClick={() => {
                            setDatePickerRowId(
                              getRowKey(selectedFycdRow || {}),
                            );
                          }}
                        />

                        <div
                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                          onClick={() => {
                            setDatePickerRowId(
                              getRowKey(selectedFycdRow || {}),
                            );
                            setShowDatePicker(!showDatePicker);
                          }}
                        >
                          <Calendar size={13} />
                        </div>
                      </div>

                      {showDatePicker &&
                        datePickerRowId ===
                          getRowKey(selectedFycdRow || {}) && (
                          <div className="absolute left-0 top-full z-[100] mt-1 shadow-xl border rounded-lg bg-white">
                            <CustomDatePicker
                              selectedDate={
                                selectedFycdRow?.periodEndDate?.length ===
                                  10 &&
                                selectedFycdRow.periodEndDate.includes(
                                  "-",
                                )
                                ? selectedFycdRow.periodEndDate.split(
                                    "T",
                                  )[0]
                                : ""
                              }
                              onChange={(date) => {
                                handleFieldChange(
                                  getRowKey(selectedFycdRow),
                                  "periodEndDate",
                                  date,
                                );
                                setShowDatePicker(false);
                              }}
                              onClose={() => setShowDatePicker(false)}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <FormSearchSelect
                      label="Status"
                      value={
                        selectedFycdRow?.statusName ||
                        selectedFycdRow?.statusCd ||
                        ""
                      }
                      options={statusOpt}
                      displayKey="name"
                      onSelect={(p) => {
                        const id = getRowKey(selectedFycdRow || {});
                        handleFieldChange(id, "statusCd", p.statusCd);
                        handleFieldChange(id, "statusName", p.name);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormInput
                      label="Adjustment Period"
                      type="checkbox"
                      checked={selectedFycdRow?.isAdjustment === "Y"}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedFycdRow),
                          "isAdjustment",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <FormSearchSelect
                      label="Adjustment Rate Type"
                      value={
                        selectedFycdRow?.rateName ||
                        selectedFycdRow?.adjustmentCode ||
                        ""
                      }
                      options={adjRateOpt}
                      displayKey="name"
                      disabled={selectedFycdRow?.isAdjustment !== "Y"}
                      onSelect={(p) => {
                        const id = getRowKey(selectedFycdRow || {});
                        handleFieldChange(
                          id,
                          "adjustmentCode",
                          p.adjustmentCode,
                        );
                        handleFieldChange(id, "rateName", p.name);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Links Bar */}
          <div className="mt-3 flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleAssignJournalEntires}
              className="voucher-nested-tab font-semibold cursor-pointer"
            >
              Entry Edit Status
            </button>
          </div>

          {/* Secondary Section for Journal Entry Status */}
          {activeView && (
            <div className="mt-4 voucher-panel">
              <div className="voucher-panel-title justify-between px-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-600" />
                  <span className="text-xs font-bold text-slate-700">
                    Journal Entry Status
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveView(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer rounded transition-colors"
                  title="Close Journal Entry Status"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="p-3 space-y-3">
                <ReusableTable
                  data={displayJournalData}
                  columns={journalColumns}
                  rowKey="journalCode"
                  maxHeight="max-h-64"
                  showCheckboxes={false}
                  showCheckboxesHeader={false}
                  showCheckboxesTable={false}
                  showCheckboxesHeaderTop={false}
                  selectedRows={selectedJournalRows}
                  onRowSelect={handleJournalRowSelection}
                  onFieldChange={handleJournalFieldChange}
                  renderEmptyState={() => (
                    <div className="py-8 text-center bg-gray-50/50 rounded-lg">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        No Data Available
                      </p>
                    </div>
                  )}
                />
                <div className="flex pt-1">
                  <button
                    type="button"
                    onClick={handleOpenAllJournals}
                    className="voucher-nested-tab font-semibold"
                  >
                    Open All Journals
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAccountingPeriod;
