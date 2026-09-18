import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { useRecentStore } from "../store/useRecentStore";

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
                  ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed select-none pointer-events-none"
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
              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed select-none pointer-events-none"
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
  options = [],
  onSelect,
  onInputChange,
  displayKey = "name",
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
            if (onInputChange) {
              onInputChange(e.target.value);
            }
            setShowDropdown(true);
          }}
          onFocus={() => !disabled && setShowDropdown(true)}
          className={`w-full h-[32px] pl-2.5 pr-8 py-1 rounded border text-[11px] font-medium transition-all duration-150 outline-none
            ${
              disabled
                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed select-none pointer-events-none"
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

const ManageSubperiod = ({ canEdit }) => {
  const navigate = useNavigate();

  // --- Data States ---
  const [fycd, setFycd] = useState([]);
  const [selectedFycdRow, setSelectedFycdRow] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isFormView, setIsFormView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  // --- UI & Find/Replace States ---
  const [searchTermProfiles, setSearchTermProfiles] = useState("");
  const [clipboard, setClipboard] = useState([]);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchColumn, setSearchColumn] = useState("fyCd");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");

  const [fiscalYearOpt, setFiscalYearOpt] = useState([]);
  const [periodOpt, setPeriodOpt] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerRowId, setDatePickerRowId] = useState(null);

  const [activeView, setActiveView] = useState(false);
  const [moduleProMapping, setModuleProMapping] = useState([]);
  const [originalModuleProMapping, setOriginalModuleProMapping] = useState([]);
  const [isMappingDirty, setIsMappingDirty] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialFormState = {
    fyCd: "",
    periodNo: "",
    subPeriodNo: "",
    subPeriodEndDate: "",
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
  ];

  const adjRateOpt = [
    { adjustmentCode: "I", name: "Interim" },
    { adjustmentCode: "F", name: "Final" },
  ];

  const journalStatusOpt = [
    { value: "Y", label: "Open" },
    { value: "N", label: "Closed" },
  ];

  const [sortColumn, setSortColumn] = useState("fyCd");
  const [sortDirection, setSortDirection] = useState("asc");

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
      type: "search-select",
      options: fiscalYearOpt,
      displayKey: "fyCd",
      required: true,
      readOnlyIfExisting: true,
      onSelect: (opt, id) => {
        handleFieldChange(id, "fyCd", opt.fyCd);
      },
      sortIcon: renderSortIcon("fyCd", "Fiscal Year"),
    },
    {
      label: "Period",
      key: "periodNo",
      type: "number",
      required: true,
      readOnlyIfExisting: true,
      sortIcon: renderSortIcon("periodNo", "Period"),
    },
    {
      label: "Subperiod",
      key: "subPeriodNo",
      type: "number",
      required: true,
      readOnlyIfExisting: true,
      sortIcon: renderSortIcon("subPeriodNo", "Subperiod"),
    },
    {
      label: "Period End Date",
      key: "subPeriodEndDate",
      type: "date",
      sortIcon: renderSortIcon("subPeriodEndDate", "Period End Date"),
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
      label: "Adjustment Flag",
      key: "isAdjustment",
      type: "checkbox",
      value: (row) => row.isAdjustment === "Y",
      onToggle: (id, isCurrentlyChecked) => {
        const newValue = isCurrentlyChecked ? "N" : "Y";
        handleFieldChange(id, "isAdjustment", newValue);
      },
    },
    {
      label: "Adjustment Type",
      key: "rateName",
      type: "search-select",
      options: (row) =>
        row.isAdjustment === "Y"
          ? adjRateOpt
          : [{ adjustmentCode: "N", name: "N/A" }],
      displayKey: "name",
      onSelect: (opt, id) => {
        handleFieldChange(id, "adjustmentCode", opt.adjustmentCode);
        handleFieldChange(id, "rateName", opt.name);
      },
      isDisabled: (row) => row.isAdjustment !== "Y",
      sortIcon: renderSortIcon("rateName", "Adjustment Type"),
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
      const [subperiodRes, periodRes, fyRes] = await Promise.all([
        api.get(`${backendUrl}/api/sub-period`),
        api.get(`${backendUrl}/api/accounting-period`),
        api.get(`${backendUrl}/api/FiscalYear`),
      ]);

      const subperiods = subperiodRes.data || [];
      const rawPeriods = periodRes.data || [];
      const rawFiscalYears = fyRes.data || [];

      setFiscalYearOpt(rawFiscalYears);
      setPeriodOpt(rawPeriods);

      const enrichedData = subperiods.map((item) => {
        const isAdj = item.isAdjustment === "Y" || item.isAdjustment === true;
        return {
          ...item,
          tableRowKey: `${item.fyCd}_${item.periodNo}_${item.subPeriodNo}`,
          statusName:
            statusOpt.find((o) => o.statusCd === item.statusCd)?.name ||
            (item.statusCd === "O" ? "Open" : "Not Available"),
          isAdjustment: isAdj ? "Y" : "N",
          rateName: isAdj
            ? (adjRateOpt.find((o) => o.adjustmentCode === item.adjustmentCode)?.name || "Interim")
            : "N/A",
          adjustmentCode: isAdj ? (item.adjustmentCode || "I") : "N",
          isDirty: false,
        };
      });

      const sortedData = [...enrichedData].sort((a, b) => {
        const cmpFy = String(a.fyCd || "").localeCompare(String(b.fyCd || ""), undefined, { numeric: true });
        if (cmpFy !== 0) return cmpFy;
        const cmpPeriod = (Number(a.periodNo) || 0) - (Number(b.periodNo) || 0);
        if (cmpPeriod !== 0) return cmpPeriod;
        const dateA = a.subPeriodEndDate ? new Date(a.subPeriodEndDate).getTime() : 0;
        const dateB = b.subPeriodEndDate ? new Date(b.subPeriodEndDate).getTime() : 0;
        if (dateA !== dateB) return dateA - dateB;
        return (Number(a.subPeriodNo) || 0) - (Number(b.subPeriodNo) || 0);
      });

      setFycd(sortedData);
      setSelectedRows([]);
      setSelectedFycdRow(sortedData.length > 0 ? sortedData[0] : null);
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
    if (row?.fyCd && row?.periodNo !== undefined && row?.subPeriodNo !== undefined) {
      return `${row.fyCd}_${row.periodNo}_${row.subPeriodNo}`;
    }
    return "";
  };

  // --- RESTORE DRAFT ON MOUNT ---
  useEffect(() => {
    const draft = useDraftStore.getState().getDraft("manage-subperiod");
    if (
      draft &&
      ((draft.data &&
        draft.data.length > 0 &&
        (draft.isDirty ||
          draft.hasUnsaved ||
          draft.data.some((r) => r.isDirty || r.tempId))) ||
        draft.isMappingDirty)
    ) {
      if (draft.data && draft.data.length > 0) {
        setFycd(draft.data);
        if (draft.selectedFycdRow) {
          const matched =
            draft.data.find(
              (r) => getRowKey(r) === getRowKey(draft.selectedFycdRow),
            ) || draft.data[0];
          setSelectedFycdRow(matched);
          setSelectedRows([matched]);
        }
      }
      if (draft.moduleProMapping) {
        setModuleProMapping(draft.moduleProMapping);
        setIsMappingDirty(draft.isMappingDirty || false);
      }
    } else {
      fetchData();
    }
  }, []);

  // --- AUTO-SAVE DRAFT TO ZUSTAND ---
  const fycdRef = useRef(fycd);
  const selectedFycdRowRef = useRef(selectedFycdRow);
  const moduleProMappingRef = useRef(moduleProMapping);
  const isMappingDirtyRef = useRef(isMappingDirty);

  useEffect(() => {
    fycdRef.current = fycd;
    selectedFycdRowRef.current = selectedFycdRow;
    moduleProMappingRef.current = moduleProMapping;
    isMappingDirtyRef.current = isMappingDirty;

    const hasChanges =
      fycd.some((r) => r.isDirty || r.tempId) || isMappingDirty;
    if (hasChanges) {
      useDraftStore.getState().saveDraft("manage-subperiod", {
        data: fycd,
        selectedFycdRow,
        moduleProMapping,
        isMappingDirty,
        isDirty: true,
        hasUnsaved: true,
      });
    }
  }, [fycd, selectedFycdRow, moduleProMapping, isMappingDirty]);

  useEffect(() => {
    return () => {
      const cur = fycdRef.current;
      const curMappingDirty = isMappingDirtyRef.current;
      if (
        (cur && cur.some((r) => r.isDirty || r.tempId)) ||
        curMappingDirty
      ) {
        useDraftStore.getState().saveDraft("manage-subperiod", {
          data: cur,
          selectedFycdRow: selectedFycdRowRef.current,
          moduleProMapping: moduleProMappingRef.current,
          isMappingDirty: curMappingDirty,
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

    if ((field === "periodNo" || field === "subPeriodNo") && value !== "" && value !== null && value !== undefined) {
      let numStr = String(value).replace(/[^0-9]/g, "");
      if (numStr !== "" && Number(numStr) < 0) numStr = "0";
      finalValue = numStr;
    }

    let extraUpdates = {};
    if (field === "isAdjustment") {
      if (finalValue === "N") {
        extraUpdates = { adjustmentCode: "N", rateName: "N/A" };
      } else if (finalValue === "Y") {
        extraUpdates = { adjustmentCode: "I", rateName: "Interim" };
      }
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

          if (field === "fyCd" && updatedRow.periodNo) {
            const periodExists = periodOpt.some(
              (opt) =>
                String(opt.fyCd) === String(finalValue) &&
                String(opt.periodNo) === String(updatedRow.periodNo),
            );
            if (!periodExists) {
              updatedRow.periodNo = "";
            }
          }

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
      fyCd: "",
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
      subPeriodNo: row.subPeriodNo ?? selectedFycdRow?.subPeriodNo,
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
      `${backendUrl}/api/sub-period-journal-status/bulk-upsert?companyId=${companyId}`,
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

    // Validation: Fiscal Year, Period, Subperiod, End Date, and Fiscal Year existence
    const seenKeys = new Set();
    for (const row of changedRows) {
      if (!row.fyCd || !String(row.fyCd).trim()) {
        return toast.error("Fiscal Year is mandatory.");
      }
      if (
        fiscalYearOpt &&
        fiscalYearOpt.length > 0 &&
        !fiscalYearOpt.some(
          (fy) => String(fy.fyCd).trim().toLowerCase() === String(row.fyCd).trim().toLowerCase(),
        )
      ) {
        return toast.error(
          `Fiscal Year "${row.fyCd}" does not exist in Fiscal Year Master. Please create Fiscal Year "${row.fyCd}" first.`,
        );
      }
      if (row.periodNo === "" || row.periodNo === null || row.periodNo === undefined) {
        return toast.error("Period is mandatory.");
      }
      if (row.subPeriodNo === "" || row.subPeriodNo === null || row.subPeriodNo === undefined) {
        return toast.error("Subperiod is mandatory.");
      }
      if (!row.subPeriodEndDate || !String(row.subPeriodEndDate).trim()) {
        return toast.error(`Fiscal Year ${row.fyCd} - Period ${row.periodNo} - Subperiod ${row.subPeriodNo}: Subperiod End Date is required.`);
      }
      const key = `${String(row.fyCd).trim()}_${String(row.periodNo).trim()}_${String(row.subPeriodNo).trim()}`;
      if (seenKeys.has(key)) {
        return toast.error(`Duplicate entry: ${row.fyCd} - Period ${row.periodNo} - Subperiod ${row.subPeriodNo}. Must be unique.`);
      }
      seenKeys.add(key);

      if (
        row.isAdjustment === "Y" &&
        (!row.adjustmentCode || row.adjustmentCode === "N" || row.rateName === "N/A" || !row.rateName)
      ) {
        return toast.error("Adjustment Type is mandatory when Adjustment Flag is checked.");
      }
    }

    setLoading(true);
    try {
      let apiSuccessMsg = "";
      if (changedRows.length > 0) {
        const dbRecords = new Set(
          fycd
            .filter((r) => !r.tempId)
            .map(
              (r) =>
                `${String(r.fyCd).trim().toLowerCase()}_${String(r.periodNo).trim()}_${String(r.subPeriodNo).trim()}`,
            ),
        );

        for (const row of changedRows) {
          const companyId = String(row.companyId || user.companyId || "1");
          const formattedDate = parseExcelDate(row.subPeriodEndDate) || String(row.subPeriodEndDate).trim();
          const targetKey = `${String(row.fyCd).trim().toLowerCase()}_${String(row.periodNo).trim()}_${String(row.subPeriodNo).trim()}`;
          const existsInDb = dbRecords.has(targetKey);

          const payload = {
            fyCd: String(row.fyCd).trim(),
            periodNo: Number(row.periodNo),
            subPeriodNo: Number(row.subPeriodNo),
            subPeriodEndDate: formattedDate,
            statusCd: row.statusCd || "N",
            adjustmentCode: row.isAdjustment === "Y" ? (row.adjustmentCode || "I") : "N",
            isAdjustment: row.isAdjustment === "Y" ? "Y" : "N",
            companyId: companyId,
            modifiedBy: user.name || "Admin",
          };

          let res;
          if (row.tempId && !existsInDb) {
            res = await api.post(`${backendUrl}/api/sub-period`, payload);
          } else {
            res = await api.put(
              `${backendUrl}/api/sub-period/${row.fyCd}/${row.periodNo}/${row.subPeriodNo}`,
              payload,
            );
          }
          if (res?.data?.message && !apiSuccessMsg) {
            apiSuccessMsg = res.data.message;
          }
        }
      }

      if (isMappingDirty && moduleProMapping.length > 0) {
        await handleSaveJournalStatus();
      }

      useDraftStore.getState().clearDraft("manage-subperiod");
      toast.success(apiSuccessMsg || "All changes saved successfully");
      await fetchData();
    } catch (e) {
      console.error("Save Error:", e);
      let errMsg =
        e.response?.data?.message ||
        (typeof e.response?.data === "string" && e.response.data.trim()
          ? e.response.data
          : null) ||
        e.message ||
        "Save failed. Please check required fields.";
      if (errMsg.includes("composite key") || errMsg.includes("values were passed")) {
        errMsg = "Save failed: Unable to locate subperiod record. Please check company details or retry.";
      }
      toast.error(errMsg);
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
        ? `Delete Period ${selectedRows[0].periodNo}, Subperiod ${selectedRows[0].subPeriodNo} of ${selectedRows[0].fyCd}?`
        : `Delete ${selectedRows.length} selected records?`;

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      for (const row of selectedRows) {
        if (!row.tempId) {
          await api.delete(
            `${backendUrl}/api/sub-period/${row.fyCd}/${row.periodNo}/${row.subPeriodNo}`,
          );
        }
      }

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
      const errMsg =
        e.response?.data?.message ||
        (typeof e.response?.data === "string" && e.response.data.trim()
          ? e.response.data
          : null) ||
        e.message ||
        "Delete failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const resolveSubperiodStatus = (val) => {
    const trimmed = String(val || "").trim().toLowerCase();
    if (trimmed.startsWith("o") || trimmed.includes("open")) {
      return { statusCd: "O", statusName: "Open" };
    }
    return { statusCd: "N", statusName: "Not Available" };
  };

  const resolveSubperiodAdjustment = (adjVal, rateVal) => {
    const trimmedAdj = String(adjVal || "").trim().toLowerCase();
    const isAdj =
      trimmedAdj === "y" ||
      trimmedAdj === "yes" ||
      trimmedAdj === "true" ||
      trimmedAdj === "1" ||
      trimmedAdj === "checked";

    if (!isAdj) {
      return { isAdjustment: "N", adjustmentCode: "N", rateName: "N/A" };
    }

    const trimmedRate = String(rateVal || "").trim().toLowerCase();
    if (trimmedRate.startsWith("f") || trimmedRate.includes("final")) {
      return { isAdjustment: "Y", adjustmentCode: "F", rateName: "Final" };
    }
    return { isAdjustment: "Y", adjustmentCode: "I", rateName: "Interim" };
  };

  const parseExcelDate = (val) => {
    if (!val || !String(val).trim()) return "";
    const s = String(val).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.split("T")[0];

    if (/^\d{5}$/.test(s)) {
      const excelDate = new Date((Number(s) - 25569) * 86400 * 1000);
      if (!isNaN(excelDate.getTime())) {
        return excelDate.toISOString().split("T")[0];
      }
    }

    const parts = s.split(/[\/\-\.]/);
    if (parts.length === 3) {
      let p0 = parts[0];
      let p1 = parts[1];
      let p2 = parts[2];

      if (p0.length === 4) {
        return `${p0}-${p1.padStart(2, "0")}-${p2.padStart(2, "0")}`;
      }
      if (p2.length === 2) p2 = `20${p2}`;
      if (p2.length === 4) {
        const num0 = Number(p0);
        const num1 = Number(p1);
        if (num0 > 12 && num1 <= 12) {
          return `${p2}-${String(num1).padStart(2, "0")}-${String(num0).padStart(2, "0")}`;
        }
        return `${p2}-${String(num0).padStart(2, "0")}-${String(num1).padStart(2, "0")}`;
      }
    }

    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return s;
  };

  const processPastedText = (text) => {
    if (!text || !text.trim()) {
      return toast.warn("Clipboard is empty.");
    }

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");
    if (lines.length === 0) return toast.warn("No data to paste.");

    const headerKeys = [
      "fiscal year",
      "fycd",
      "year",
      "period",
      "periodno",
      "subperiod",
      "subperiodno",
      "period end date",
      "end date",
      "status",
      "adjustment flag",
      "isadjustment",
      "adjustment type",
      "ratename",
    ];

    const firstLineCells = lines[0]
      .split("\t")
      .map((cell) => cell.trim().toLowerCase());
    const isHeaderRow = firstLineCells.some((cell) =>
      headerKeys.includes(cell),
    );

    const dataLines = isHeaderRow ? lines.slice(1) : lines;
    if (dataLines.length === 0) {
      return toast.warn("No data rows found to paste.");
    }

    let fyCdIdx = -1;
    let periodNoIdx = -1;
    let subPeriodNoIdx = -1;
    let endDateIdx = -1;
    let statusIdx = -1;
    let adjFlagIdx = -1;
    let adjTypeIdx = -1;

    if (isHeaderRow) {
      fyCdIdx = firstLineCells.findIndex((cell) =>
        ["fiscal year", "fycd", "year"].includes(cell),
      );
      periodNoIdx = firstLineCells.findIndex((cell) =>
        ["period", "periodno", "period no"].includes(cell),
      );
      subPeriodNoIdx = firstLineCells.findIndex((cell) =>
        ["subperiod", "subperiodno", "subperiod no", "sub period"].includes(cell),
      );
      endDateIdx = firstLineCells.findIndex((cell) =>
        ["period end date", "end date", "subperiodenddate", "enddate"].includes(cell),
      );
      statusIdx = firstLineCells.findIndex((cell) =>
        ["status", "statuscd", "statusname"].includes(cell),
      );
      adjFlagIdx = firstLineCells.findIndex((cell) =>
        ["adjustment flag", "adj flag", "isadjustment", "adj period"].includes(cell),
      );
      adjTypeIdx = firstLineCells.findIndex((cell) =>
        ["adjustment type", "adj type", "ratename", "rate type"].includes(cell),
      );
    } else {
      fyCdIdx = 0;
      periodNoIdx = 1;
      subPeriodNoIdx = 2;
      endDateIdx = 3;
      statusIdx = 4;
      adjFlagIdx = 5;
      adjTypeIdx = 6;
    }

    const existingMap = new Map();
    fycd.forEach((r) => {
      if (r.fyCd && r.periodNo !== undefined && r.subPeriodNo !== undefined && !r.tempId) {
        existingMap.set(
          `${String(r.fyCd).trim().toLowerCase()}_${String(r.periodNo).trim()}_${String(r.subPeriodNo).trim()}`,
          r,
        );
      }
    });

    const newPastedRows = [];

    dataLines.forEach((line, i) => {
      const cells = line.split("\t");
      const rawFyCd = fyCdIdx !== -1 && fyCdIdx < cells.length ? cells[fyCdIdx].trim() : "";
      const rawPeriodNo = periodNoIdx !== -1 && periodNoIdx < cells.length ? cells[periodNoIdx].trim() : "";
      const rawSubPeriodNo = subPeriodNoIdx !== -1 && subPeriodNoIdx < cells.length ? cells[subPeriodNoIdx].trim() : "";
      const rawEndDate = endDateIdx !== -1 && endDateIdx < cells.length ? cells[endDateIdx].trim() : "";
      const rawStatus = statusIdx !== -1 && statusIdx < cells.length ? cells[statusIdx].trim() : "";
      const rawAdjFlag = adjFlagIdx !== -1 && adjFlagIdx < cells.length ? cells[adjFlagIdx].trim() : "";
      const rawAdjType = adjTypeIdx !== -1 && adjTypeIdx < cells.length ? cells[adjTypeIdx].trim() : "";

      if (!rawFyCd && !rawPeriodNo && !rawSubPeriodNo && !rawEndDate && !rawStatus) return;

      const { statusCd, statusName } = resolveSubperiodStatus(rawStatus);
      const { isAdjustment, adjustmentCode, rateName } = resolveSubperiodAdjustment(rawAdjFlag, rawAdjType);
      const formattedDate = parseExcelDate(rawEndDate);
      const parsedPeriodNo = rawPeriodNo ? Number(rawPeriodNo.replace(/\D/g, "")) : "";
      const parsedSubPeriodNo = rawSubPeriodNo ? Number(rawSubPeriodNo.replace(/\D/g, "")) : "";

      const tempKey = `PASTE_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`;
      newPastedRows.push({
        fyCd: rawFyCd,
        periodNo: parsedPeriodNo,
        subPeriodNo: parsedSubPeriodNo,
        subPeriodEndDate: formattedDate,
        statusCd,
        statusName,
        isAdjustment,
        adjustmentCode,
        rateName,
        companyId: "1",
        tempId: tempKey,
        tableRowKey: tempKey,
        isNew: true,
        isDirty: true,
      });
    });

    if (newPastedRows.length === 0) {
      return toast.warn("No valid rows parsed from clipboard.");
    }

    setFycd((prev) => [...newPastedRows, ...prev]);
    setSelectedFycdRow(newPastedRows[0]);
    setSelectedRows([newPastedRows[0]]);
    toast.success(`${newPastedRows.length} record(s) pasted. Please enter new Subperiod values.`);
  };

  const handleCopy = async () => {
    const rowsToCopy = isFormView
      ? selectedFycdRow ? [selectedFycdRow] : []
      : selectedRows && selectedRows.length > 0 ? selectedRows : (selectedFycdRow ? [selectedFycdRow] : []);

    if (rowsToCopy.length === 0) {
      return toast.warn("Select at least one record to copy.");
    }

    setClipboard([...rowsToCopy]);

    // Format TSV for Excel copy
    const header = "Fiscal Year\tPeriod\tSubperiod\tPeriod End Date\tStatus\tAdjustment Flag\tAdjustment Type";
    const tsvLines = rowsToCopy.map((r) => {
      const fy = r.fyCd ?? "";
      const p = r.periodNo ?? "";
      const sp = r.subPeriodNo ?? "";
      const d = r.subPeriodEndDate ?? "";
      const s = r.statusName ?? "";
      const a = r.isAdjustment === "Y" ? "Y" : "N";
      const t = r.rateName ?? "";
      return `${fy}\t${p}\t${sp}\t${d}\t${s}\t${a}\t${t}`;
    });
    const tsvContent = [header, ...tsvLines].join("\n");

    try {
      await navigator.clipboard.writeText(tsvContent);
    } catch (clipErr) {
      console.warn("Clipboard writeText not permitted", clipErr);
    }

    toast.success(`${rowsToCopy.length} record(s) copied to clipboard`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.includes("\t") || text.includes("\n"))) {
        return processPastedText(text);
      }
    } catch (err) {
      console.warn("navigator.clipboard.readText fallback to internal clipboard", err);
    }

    if (!clipboard || clipboard.length === 0) {
      return toast.warn("Clipboard is empty.");
    }

    const pasted = clipboard.map((row, i) => {
      const { tempId, id, tableRowKey, ...restProps } = row;
      const newKey = `PASTE_${Date.now()}_${i}`;

      return {
        ...restProps,
        tempId: newKey,
        tableRowKey: newKey,
        subPeriodEndDate: "",
        isNew: true,
        isDirty: true,
      };
    });

    setFycd((prev) => [...pasted, ...prev]);
    setSelectedFycdRow(pasted[0]);
    setSelectedRows([pasted[0]]);
    setShowDatePicker(false);
    setDatePickerRowId(null);

    toast.success(
      `${pasted.length} record(s) pasted. Please enter new Subperiod values.`,
    );
  };

  // Keyboard shortcut Ctrl+V for Excel paste
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        try {
          const text = await navigator.clipboard.readText();
          if (!text || !text.trim()) return;

          const isInput =
            e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
          const hasStructure = text.includes("\t") || text.includes("\n");

          if (isInput && !hasStructure) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();
          processPastedText(text);
        } catch (err) {
          console.error("Ctrl+V readText error:", err);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [fycd, clipboard]);

  const handleClear = () => {
    const hasNewRows = fycd.some((f) => !!f.tempId);
    const hasEdits = fycd.some((f) => f.isDirty === true);
    const hasMappingEdits = isMappingDirty;

    if (!hasNewRows && !hasEdits && !hasMappingEdits) return;

    if (window.confirm("Discard unsaved changes and new rows?")) {
      useDraftStore.getState().clearDraft("manage-subperiod");
      setFycd((prev) => prev.filter((f) => !f.tempId));
      fetchData();
      setFilteredGroups([]);
      setSelectedRows([]);

      if (hasMappingEdits) {
        setModuleProMapping(originalModuleProMapping);
        setIsMappingDirty(false);
      }

      toast.info("Changes discarded");
    }
  };

  const handleCloseScreen = () => {
    useDraftStore.getState().clearDraft("manage-subperiod");
    useRecentStore.getState().removeRecentPage("/dashboard/subperiod");
    useRecentStore.getState().removeRecentPage("/dashboard/manage-subperiod");
    navigate("/dashboard");
  };

  // --- FIND & REPLACE LOGIC (SCOPED TO ACTIVE FILTER & DRILL-DOWN) ---
  const handleFind = () => {
    if (!searchValue || !searchValue.trim()) {
      toast.warn("Please enter or select search value");
      return;
    }
    const term = searchValue.toLowerCase().trim();
    // Drill-down: if user already has an active filter, find within that filtered pool!
    const pool = filteredGroups.length > 0 ? filteredGroups : fycd;
    const matches = pool.filter((row) => {
      if (searchColumn === "all") {
        return (
          String(row.fyCd || "").toLowerCase().includes(term) ||
          String(row.periodNo || "").toLowerCase().includes(term) ||
          String(row.subPeriodNo || "").toLowerCase().includes(term) ||
          String(row.subPeriodEndDate || "").toLowerCase().includes(term) ||
          String(row.statusName || "").toLowerCase().includes(term) ||
          String(row.rateName || "").toLowerCase().includes(term) ||
          (row.isAdjustment === "Y" && ("adjustment".includes(term) || "yes".includes(term) || "y".includes(term))) ||
          (row.isAdjustment !== "Y" && ("no".includes(term) || "n".includes(term) || "uncheck".includes(term)))
        );
      }
      if (searchColumn === "isAdjustment") {
        const rowVal = row.isAdjustment === "Y" ? "Y" : "N";
        return rowVal.toLowerCase() === term;
      }
      const val = String(row[searchColumn] || "").toLowerCase();
      return val.includes(term);
    });

    if (matches.length === 0) {
      toast.info("No matching records found in current view");
    } else {
      toast.success(`${matches.length} matching record(s) found`);
      setFilteredGroups(matches);
      setSelectedFycdRow(matches[0]);
    }
  };

  const handleReplaceAll = () => {
    if (searchColumn === "fyCd" || searchColumn === "periodNo" || searchColumn === "subPeriodNo") {
      toast.warn("Fiscal Year, Period, and Subperiod cannot be modified via Replace.");
      return;
    }
    if (!searchValue || !searchValue.trim()) {
      toast.warn("Please enter or select search value");
      return;
    }
    if (!replaceValue || !replaceValue.trim()) {
      toast.warn("Please enter or select replace value");
      return;
    }

    // Determine target pool: if user filtered, only replace within filtered subset!
    const targetPool = filteredGroups.length > 0 ? filteredGroups : fycd;
    const targetKeys = new Set(targetPool.map((r) => getRowKey(r)));

    let replacedCount = 0;
    const term = searchValue.trim();

    const updated = fycd.map((row) => {
      // If row is not in current search/filtered subset, keep unchanged
      if (!targetKeys.has(getRowKey(row))) {
        return row;
      }

      if (searchColumn === "isAdjustment") {
        const curVal = row.isAdjustment === "Y" ? "Y" : "N";
        if (curVal.toLowerCase() === term.toLowerCase() || (term === "Y" && curVal === "Y") || (term === "N" && curVal === "N")) {
          replacedCount++;
          const targetAdj =
            replaceValue.toUpperCase() === "Y" ||
            replaceValue.toLowerCase() === "yes" ||
            replaceValue.toLowerCase() === "true"
              ? "Y"
              : "N";
          return {
            ...row,
            isAdjustment: targetAdj,
            adjustmentCode: targetAdj === "N" ? "N" : (row.adjustmentCode === "N" ? "I" : row.adjustmentCode),
            rateName: targetAdj === "N" ? "N/A" : (row.rateName === "N/A" ? "Interim" : row.rateName),
            isDirty: true,
          };
        }
        return row;
      }

      if (searchColumn === "rateName") {
        const curVal = String(row.rateName || "");
        if (curVal.toLowerCase() === term.toLowerCase()) {
          replacedCount++;
          const targetCode = replaceValue === "Interim" ? "I" : replaceValue === "Final" ? "F" : "N";
          return {
            ...row,
            rateName: replaceValue,
            adjustmentCode: targetCode,
            isAdjustment: targetCode === "N" ? "N" : "Y",
            isDirty: true,
          };
        }
        return row;
      }

      if (searchColumn === "statusName") {
        const curVal = String(row.statusName || "");
        if (curVal.toLowerCase() === term.toLowerCase()) {
          replacedCount++;
          const targetCd = replaceValue === "Open" ? "O" : "N";
          return {
            ...row,
            statusName: replaceValue,
            statusCd: targetCd,
            isDirty: true,
          };
        }
        return row;
      }

      const val = String(row[searchColumn] || "");
      if (val.toLowerCase().includes(term.toLowerCase())) {
        replacedCount++;
        const regex = new RegExp(
          term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
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
      if (filteredGroups.length > 0) {
        const updatedFiltered = filteredGroups.map(
          (r) => updated.find((u) => getRowKey(u) === getRowKey(r)) || r
        );
        setFilteredGroups(updatedFiltered);
      }
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
    setFilteredGroups([]);
    if (fycd.length > 0) {
      setSelectedFycdRow(fycd[0]);
    }
    toast.info("Filter reset, showing all records");
  };

  // --- Display Data (with Toolbar Search & Multi-level Sort) ---
  const displayData = useMemo(() => {
    let base = filteredGroups.length > 0 ? filteredGroups : fycd;

    if (searchTermProfiles && searchTermProfiles.trim()) {
      const q = searchTermProfiles.toLowerCase().trim();
      base = base.filter((row) => {
        const fy = String(row.fyCd || "").toLowerCase();
        const pno = String(row.periodNo || "").toLowerCase();
        const spno = String(row.subPeriodNo || "").toLowerCase();
        const pDate = String(row.subPeriodEndDate || "").toLowerCase();
        const stat = String(row.statusName || "").toLowerCase();
        const rName = String(row.rateName || "").toLowerCase();
        const isAdj = row.isAdjustment === "Y";

        return (
          fy.includes(q) ||
          pno.includes(q) ||
          spno.includes(q) ||
          pDate.includes(q) ||
          stat.includes(q) ||
          rName.includes(q) ||
          (isAdj && ("adjustment".includes(q) || "yes".includes(q) || "y".includes(q) || "checked".includes(q))) ||
          (!isAdj && ("no".includes(q) || "n".includes(q) || "uncheck".includes(q)))
        );
      });
    }

    if (!sortColumn) {
      return [...base].sort((a, b) => {
        if (a.tempId && !b.tempId) return -1;
        if (!a.tempId && b.tempId) return 1;
        const cmpFy = String(a.fyCd || "").localeCompare(String(b.fyCd || ""), undefined, { numeric: true });
        if (cmpFy !== 0) return cmpFy;
        const dateA = a.subPeriodEndDate ? new Date(a.subPeriodEndDate).getTime() : 0;
        const dateB = b.subPeriodEndDate ? new Date(b.subPeriodEndDate).getTime() : 0;
        if (dateA !== dateB) return dateA - dateB;
        const cmpP = (Number(a.periodNo) || 0) - (Number(b.periodNo) || 0);
        if (cmpP !== 0) return cmpP;
        return (Number(a.subPeriodNo) || 0) - (Number(b.subPeriodNo) || 0);
      });
    }

    return [...base].sort((a, b) => {
      // Keep new unsaved rows at top
      if (a.tempId && !b.tempId) return -1;
      if (!a.tempId && b.tempId) return 1;

      if (sortColumn === "fyCd") {
        const fyA = String(a.fyCd || "");
        const fyB = String(b.fyCd || "");
        const cmpFy = sortDirection === "asc"
          ? fyA.localeCompare(fyB, undefined, { numeric: true })
          : fyB.localeCompare(fyA, undefined, { numeric: true });
        if (cmpFy !== 0) return cmpFy;

        const cmpPeriod = (Number(a.periodNo) || 0) - (Number(b.periodNo) || 0);
        if (cmpPeriod !== 0) return cmpPeriod;

        const dateA = a.subPeriodEndDate ? new Date(a.subPeriodEndDate).getTime() : 0;
        const dateB = b.subPeriodEndDate ? new Date(b.subPeriodEndDate).getTime() : 0;
        if (dateA !== dateB) return dateA - dateB;

        return (Number(a.subPeriodNo) || 0) - (Number(b.subPeriodNo) || 0);
      }

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
  }, [filteredGroups, fycd, searchTermProfiles, sortColumn, sortDirection]);

  // Global search sync with active record in Form View
  useEffect(() => {
    if (searchTermProfiles && displayData.length > 0) {
      const isCurrentInDisplay = displayData.some(
        (r) => getRowKey(r) === getRowKey(selectedFycdRow),
      );
      if (!isCurrentInDisplay) {
        setSelectedFycdRow(displayData[0]);
        setSelectedRows([displayData[0]]);
      }
    }
  }, [searchTermProfiles, displayData]);

  let currentIndex = displayData.findIndex(
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
      newIdx = displayData.length - 1;
    }

    if (newIdx >= 0 && newIdx < displayData.length) {
      const targetRow = displayData[newIdx];
      setSelectedFycdRow(targetRow);
      setSelectedRows([targetRow]);
    }
  };

  const handleRowSelection = (row) => {
    const isSelected = selectedRows.some(
      (r) => getRowKey(r) === getRowKey(row),
    );
    const safeRows = Array.isArray(selectedRows) ? selectedRows : [];

    if (isSelected) {
      const remaining = safeRows.filter(
        (r) => getRowKey(r) !== getRowKey(row),
      );
      setSelectedRows(remaining);
      if (getRowKey(selectedFycdRow) === getRowKey(row)) {
        setSelectedFycdRow(
          remaining.length > 0
            ? remaining[remaining.length - 1]
            : fycd.length > 0
            ? fycd[0]
            : null,
        );
      }
    } else {
      setSelectedRows([...safeRows, row]);
      setSelectedFycdRow(row);
    }
  };

  const handleSelectAll = () => {
    const dataToSelect = displayData;

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

  const handleAssignJournalEntires = async () => {
    let targetRow = selectedFycdRow;
    if (!targetRow && fycd.length > 0) {
      targetRow = selectedRows && selectedRows.length > 0 ? selectedRows[0] : fycd[0];
      setSelectedFycdRow(targetRow);
    }

    const fyCd = targetRow?.fyCd;
    const periodNo = targetRow?.periodNo;
    const companyId = targetRow?.companyId || "1";
    const subPeriodNo = targetRow?.subPeriodNo;

    if (!fyCd || periodNo === undefined || periodNo === "" || subPeriodNo === undefined || subPeriodNo === "") {
      toast.warn("Please select a record from the table first.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(
        `${backendUrl}/api/sub-period-journal-status/${fyCd}/${periodNo}/${subPeriodNo}/${companyId}`,
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
        const firstSelected = selectedRows[0];
        const rowToMap =
          typeof firstSelected === "string"
            ? fycd.find((f) => getRowKey(f) === firstSelected)
            : firstSelected;

        setSelectedFycdRow(rowToMap || fycd[0]);
      }
    }
    setIsFormView(!isFormView);
  };

  const handleRowDoubleClick = (item, index) => {
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
        .payment-voucher-page .voucher-head-btn { display:inline-flex; align-items:center; justify-content:center; gap:4px; height:28px; padding:0 8px; border:1px solid #d5dfeb; border-radius:6px; background:#fff; color:#344a63; font-size:11px; font-weight:600; cursor:pointer; white-space:nowrap; }
        .payment-voucher-page .voucher-head-btn:hover, .payment-voucher-page .voucher-icon-btn:hover, .payment-voucher-page .voucher-outline-btn:hover { background:#f5f8fb; border-color:#b9c8d8; }
        .payment-voucher-page .voucher-primary-btn { display:inline-flex; align-items:center; justify-content:center; gap:4px; height:28px; padding:0 9px; border:1px solid #1677e8; border-radius:6px; background:#1677e8; color:#fff; font-size:11px; font-weight:600; cursor:pointer; white-space:nowrap; }
        .payment-voucher-page .voucher-primary-btn:hover { background:#125bc3; border-color:#125bc3; }
        .payment-voucher-page .voucher-outline-btn { display:inline-flex; align-items:center; justify-content:center; gap:4px; height:28px; padding:0 8px; border:1px solid #d5dfeb; border-radius:6px; background:#fff; color:#344a63; font-size:11px; font-weight:600; cursor:pointer; white-space:nowrap; }
        .payment-voucher-page .voucher-icon-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border:1px solid #d5dfeb; border-radius:6px; background:#fff; color:#52657c; cursor:pointer; }
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
        .payment-voucher-page .voucher-nav-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border:0; border-right:1px solid #d5dfeb; background:#f5f8fb; color:#718096; cursor:pointer; }
        .payment-voucher-page .voucher-nav-btn:last-child { border-right:0; }
        .payment-voucher-page .voucher-nav-btn:hover { background:#eaf1f7; color:#17414d; }
        .payment-voucher-page .voucher-nav-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .payment-voucher-page .voucher-count { display:inline-flex; align-items:center; justify-content:center; min-width:44px; height:28px; padding:0 6px; background:#fff; color:#17414d; font-size:11px; font-weight:700; }
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

      {/* TOP BAR */}
      <div className="h-[50px] border-b border-[#e5e7eb] bg-white px-5 ml-[15px]">
        <div className="flex h-full items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#7b8798]">
            <span className="font-medium text-[#4f5f76]">Accounting</span>
            <span>›</span>
            <span className="font-medium text-[#4f5f76]">General Ledger</span>
            <span>›</span>
            <span className="truncate">Subperiod</span>
          </div>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="border-b border-[#dbe3eb] bg-white ml-[15px]">
        <div className="flex items-center justify-between gap-3 pl-4 pr-3 py-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-[17px] font-semibold tracking-[-0.2px] text-[#172b4d] whitespace-nowrap">
              Subperiod
            </h1>
            <div className="flex items-center rounded-md border border-[#d5dfeb] bg-[#f5f8fb] overflow-hidden">
              <button
                type="button"
                className="voucher-nav-btn"
                title="First"
                onClick={() => handleNavigate("start")}
                disabled={currentIndex <= 0}
              >
                <ChevronsLeft size={15} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Previous"
                onClick={() => handleNavigate("prev")}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft size={15} strokeWidth={1.5} />
              </button>
              <span className="voucher-count">
                {selectedFycdRow && displayData.length > 0
                  ? currentIndex >= 0
                    ? currentIndex + 1
                    : 1
                  : 0}{" "}
                / {displayData.length}
              </span>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Next"
                onClick={() => handleNavigate("next")}
                disabled={currentIndex >= displayData.length - 1}
              >
                <ChevronRight size={15} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="voucher-nav-btn"
                title="Last"
                onClick={() => handleNavigate("end")}
                disabled={currentIndex >= displayData.length - 1}
              >
                <ChevronsRight size={15} strokeWidth={1.5} />
              </button>
            </div>

            {/* Quick Search on Toolbar */}
            <div className="relative flex items-center ml-1">
              <Search
                size={13}
                className="absolute left-2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTermProfiles}
                onChange={(e) => setSearchTermProfiles(e.target.value)}
                className="h-7 w-36 pl-7 pr-6 text-[11px] bg-[#f6f6f6] hover:bg-slate-100/80 focus:bg-white border border-[#d5dfeb] rounded-md outline-none text-[#3c4043] placeholder:text-gray-400 focus:border-[#1677e8] transition-all"
              />
              {searchTermProfiles && (
                <button
                  type="button"
                  onClick={() => setSearchTermProfiles("")}
                  className="absolute right-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleAddFyCd}
              className="voucher-primary-btn"
            >
              <Plus size={13} /> Create
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={isCopyDisabled}
              className="voucher-head-btn"
            >
              <Copy size={13} />
              Copy
            </button>

            <button
              type="button"
              onClick={handlePaste}
              disabled={isPasteDisabled}
              className="voucher-head-btn"
            >
              <ClipboardPaste size={13} />
              Paste
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleteDisabled}
              className="voucher-head-btn"
            >
              <Trash2 size={13} />
              Delete
            </button>

            <button
              type="button"
              onClick={() => setShowFindReplace((prev) => !prev)}
              className={`voucher-head-btn ${showFindReplace ? "bg-slate-100 border-[#1677e8] text-[#1677e8]" : ""}`}
              title="Find & Replace (Form & Table)"
            >
              <Replace size={13} />
              Find/Replace
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="voucher-head-btn"
              title="Reset unsaved changes"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleMasterSave}
              className="voucher-head-btn text-[#1677e8] border-[#1677e8]/40 hover:bg-[#1677e8]/5"
            >
              <Save size={13} />
              Save
            </button>

            <button
              type="button"
              onClick={handleCloseScreen}
              className="voucher-head-btn text-slate-600 hover:text-slate-800"
              title="Close screen and clear cache"
            >
              <X size={13} />
              Close
            </button>

            <button
              type="button"
              onClick={toggleView}
              disabled={loading}
              className="relative flex h-[28px] w-[74px] items-center rounded-full border border-[#d5dfeb] bg-[#f5f8fb] p-[2px] transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              <span
                className={`absolute top-[2px] h-[22px] w-[34px] rounded-full bg-white shadow-sm transition-all duration-200 ${
                  isFormView ? "left-[2px]" : "left-[36px]"
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

      {/* CONTENT AREA */}
      <div className="px-4 pb-4 pt-3 lg:px-4">
        <div className="new-ui-content text-xs">
          {/* Find & Replace Bar */}
          {showFindReplace && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2.5 animate-in slide-in-from-top-1 duration-150 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-600">In:</span>
                  <select
                    value={searchColumn}
                    onChange={(e) => {
                      setSearchColumn(e.target.value);
                      setSearchValue("");
                      setReplaceValue("");
                    }}
                    className="px-2 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-700 outline-none focus:border-[#1677e8]"
                  >
                    <option value="all">All Columns</option>
                    <option value="fyCd">Fiscal Year</option>
                    <option value="periodNo">Period</option>
                    <option value="subPeriodNo">Subperiod</option>
                    <option value="subPeriodEndDate">Period End Date</option>
                    <option value="statusName">Status</option>
                    <option value="isAdjustment">Adjustment Flag</option>
                    <option value="rateName">Adjustment Type</option>
                  </select>
                </div>

                {/* Find Field */}
                <div className="flex items-center gap-1">
                  {searchColumn === "isAdjustment" ? (
                    <select
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        if (!e.target.value) {
                          setFilteredGroups([]);
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-[#1677e8] w-36"
                    >
                      <option value="">Find Flag...</option>
                      <option value="Y">Checked (Y)</option>
                      <option value="N">Unchecked (N)</option>
                    </select>
                  ) : searchColumn === "rateName" ? (
                    <select
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        if (!e.target.value) {
                          setFilteredGroups([]);
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-[#1677e8] w-36"
                    >
                      <option value="">Find Type...</option>
                      <option value="Interim">Interim</option>
                      <option value="Final">Final</option>
                    </select>
                  ) : searchColumn === "statusName" ? (
                    <select
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        if (!e.target.value) {
                          setFilteredGroups([]);
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-[#1677e8] w-36"
                    >
                      <option value="">Find Status...</option>
                      <option value="Open">Open</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Find..."
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        if (!e.target.value) {
                          setFilteredGroups([]);
                        }
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleFind()}
                      className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1677e8] w-36"
                    />
                  )}
                </div>

                {/* Replace Field */}
                <div className="flex items-center gap-1">
                  {searchColumn === "isAdjustment" ? (
                    <select
                      value={replaceValue}
                      onChange={(e) => setReplaceValue(e.target.value)}
                      className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-[#1677e8] w-36"
                    >
                      <option value="">Replace With...</option>
                      <option value="Y">Checked (Y)</option>
                      <option value="N">Unchecked (N)</option>
                    </select>
                  ) : searchColumn === "rateName" ? (
                    <select
                      value={replaceValue}
                      onChange={(e) => setReplaceValue(e.target.value)}
                      className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-[#1677e8] w-36"
                    >
                      <option value="">Replace With...</option>
                      <option value="Interim">Interim</option>
                      <option value="Final">Final</option>
                    </select>
                  ) : searchColumn === "statusName" ? (
                    <select
                      value={replaceValue}
                      onChange={(e) => setReplaceValue(e.target.value)}
                      className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-[#1677e8] w-36"
                    >
                      <option value="">Replace With...</option>
                      <option value="Open">Open</option>
                      <option value="Not Available">Not Available</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Replace with..."
                      value={replaceValue}
                      disabled={searchColumn === "fyCd" || searchColumn === "periodNo" || searchColumn === "subPeriodNo"}
                      onChange={(e) => setReplaceValue(e.target.value)}
                      className={`px-2.5 py-1 text-[11px] border border-slate-300 rounded font-medium outline-none w-36 ${
                        searchColumn === "fyCd" || searchColumn === "periodNo" || searchColumn === "subPeriodNo"
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed placeholder:text-slate-300"
                          : "bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#1677e8]"
                      }`}
                    />
                  )}
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
                  disabled={searchColumn === "fyCd" || searchColumn === "periodNo" || searchColumn === "subPeriodNo"}
                  onClick={handleReplaceAll}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                    searchColumn === "fyCd" || searchColumn === "periodNo" || searchColumn === "subPeriodNo"
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
                    Subperiod Details
                  </span>
                </div>
                <div className="p-3 space-y-4">
                  {/* Top Row: Fiscal Year, Period, Subperiod, Subperiod End Date */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-3">
                    <div className="space-y-2">
                      {!selectedFycdRow?.tempId && !selectedFycdRow?.isNew ? (
                        <FormInput
                          label="Fiscal Year"
                          required
                          value={selectedFycdRow?.fyCd || ""}
                          readOnly={true}
                        />
                      ) : (
                        <FormSearchSelect
                          label="Fiscal Year"
                          required
                          value={selectedFycdRow?.fyCd || ""}
                          options={fiscalYearOpt}
                          displayKey="fyCd"
                          placeholder="Select or enter Fiscal Year"
                          onInputChange={(val) => {
                            if (selectedFycdRow?.tempId) {
                              handleFieldChange(
                                getRowKey(selectedFycdRow),
                                "fyCd",
                                val,
                              );
                            }
                          }}
                          onSelect={(p) => {
                            const id = getRowKey(selectedFycdRow || {});
                            handleFieldChange(id, "fyCd", p.fyCd);
                          }}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <FormInput
                        label="Period"
                        required
                        type="number"
                        min="0"
                        value={selectedFycdRow?.periodNo ?? ""}
                        readOnly={
                          !selectedFycdRow?.tempId && !selectedFycdRow?.isNew
                        }
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
                      <FormInput
                        label="Subperiod"
                        required
                        type="number"
                        min="0"
                        value={selectedFycdRow?.subPeriodNo ?? ""}
                        readOnly={
                          !selectedFycdRow?.tempId && !selectedFycdRow?.isNew
                        }
                        onChange={(e) => {
                          let val = e.target.value;
                          if (val !== "") {
                            val = val.replace(/[^0-9]/g, "");
                            if (val !== "" && Number(val) < 0) val = "0";
                          }
                          handleFieldChange(
                            getRowKey(selectedFycdRow),
                            "subPeriodNo",
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
                      <div className="flex flex-col gap-1 w-full relative group">
                        <span className="text-xs font-semibold text-slate-700 select-none">
                          Period End Date
                        </span>

                        <div className="relative">
                          <input
                            type="text"
                            className="w-full h-[32px] pl-2.5 pr-8 py-1 rounded border border-slate-200 bg-white text-slate-800 text-[11px] font-medium transition-all duration-150 outline-none hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                            placeholder="MM-DD-YYYY"
                            value={(() => {
                              const val = selectedFycdRow?.subPeriodEndDate;
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
                                  "subPeriodEndDate",
                                  `${yyyy}-${mm}-${dd}`,
                                );
                                setShowDatePicker(false);
                              } else {
                                handleFieldChange(
                                  id,
                                  "subPeriodEndDate",
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
                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
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
                                  selectedFycdRow?.subPeriodEndDate?.length ===
                                    10 &&
                                  selectedFycdRow.subPeriodEndDate.includes(
                                    "-",
                                  )
                                    ? selectedFycdRow.subPeriodEndDate.split(
                                        "T",
                                      )[0]
                                    : ""
                                }
                                onChange={(date) => {
                                  handleFieldChange(
                                    getRowKey(selectedFycdRow),
                                    "subPeriodEndDate",
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
                        label="Adjustment Flag"
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
                        label="Adjustment Type"
                        required={selectedFycdRow?.isAdjustment === "Y"}
                        value={
                          selectedFycdRow?.isAdjustment === "Y"
                            ? selectedFycdRow?.rateName || ""
                            : "N/A"
                        }
                        options={
                          selectedFycdRow?.isAdjustment === "Y"
                            ? adjRateOpt
                            : [{ adjustmentCode: "N", name: "N/A" }]
                        }
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

export default ManageSubperiod;
