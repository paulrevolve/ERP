import React, { useEffect, useState, useRef, useMemo } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import api from "../utils/api";
import {
  CalendarDays,
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Replace,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import ReusableTable from "../helper/tableSection";
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
  options = [],
  onSelect,
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
    const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey], opt.statusCd, opt.closeActTgtCd];
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

const ManageFiscalYear = ({ canEdit }) => {
  // --- Data States ---
  const [fycd, setFycd] = useState([]);
  const [selectedFycdRow, setSelectedFycdRow] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isFormView, setIsFormView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // --- Sorting State ---
  const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc' | null

  // --- UI & Find/Replace States ---
  const [searchTermProfiles, setSearchTermProfiles] = useState("");
  const [searchTermRate, setSearchTermRate] = useState("");
  const [clipboard, setClipboard] = useState([]);
  const [hasCopied, setHasCopied] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchColumn, setSearchColumn] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);

  const [showSubModal, setShowSubModal] = useState(false);
  const [subValue, setSubValue] = useState(1);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // --- Dropdown Options ---
  const statusOpt = [
    { statusCd: " ", name: "Select" },
    { statusCd: "O", name: "Open" },
    { statusCd: "C", name: "Closed" },
  ];

  const rateOpt = [
    { closeActTgtCd: "", name: "None" },
    { closeActTgtCd: "A", name: "Actual Rates" },
    { closeActTgtCd: "T", name: "Target Rates" },
  ];

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
  };

  // --- Table Column Definitions with Column Sorting ---
  const myColumns = [
    {
      label: "Fiscal Year",
      key: "fyCd",
      required: true,
      readOnlyIfExisting: true,
      sortIcon: (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSort();
          }}
          className="cursor-pointer p-0.5 hover:bg-black/5 rounded transition-colors text-slate-500 hover:text-slate-800 inline-flex items-center justify-center"
          title="Sort by Fiscal Year (Click to cycle Asc / Desc / Default)"
        >
          {sortOrder === "asc" ? (
            <ArrowUp size={13} className="text-[#1677e8] font-bold" />
          ) : sortOrder === "desc" ? (
            <ArrowDown size={13} className="text-[#1677e8] font-bold" />
          ) : (
            <ArrowUpDown size={13} className="text-slate-400" />
          )}
        </button>
      ),
    },
    { label: "Description", key: "fyDesc", required: true },
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
    },
    {
      label: "Rate Type",
      key: "rateName",
      type: "search-select",
      options: rateOpt,
      displayKey: "name",
      onSelect: (opt, id) => {
        handleFieldChange(id, "closeActTgtCd", opt.closeActTgtCd);
        handleFieldChange(id, "rateName", opt.name);
      },
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${backendUrl}/api/FiscalYear`);
      const rawData = res.data || [];

      const enrichedData = rawData.map((item) => ({
        ...item,
        tableRowKey: item.fyCd,
        statusName:
          statusOpt.find((o) => o.statusCd === item.statusCd)?.name || "",
        rateName:
          rateOpt.find((o) => o.closeActTgtCd === item.closeActTgtCd)?.name ||
          "",
      }));

      setFycd(() => {
        return [...enrichedData];
      });
      setSelectedRows([]);
      setSelectedFycdRow(enrichedData.length > 0 ? enrichedData[0] : null);

      if (enrichedData.length === 0) {
        handleAddFyCd();
      }
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  const getRowKey = (row) => row?.tableRowKey || row?.tempId || row?.fyCd || "";

  // --- Draft Store Hydration on Mount ---
  useEffect(() => {
    const draft = useDraftStore.getState().getDraft("manage-fiscal-year");
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
      useDraftStore.getState().saveDraft("manage-fiscal-year", {
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
        useDraftStore.getState().saveDraft("manage-fiscal-year", {
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

    if (field === "fyCd" && /\s/.test(value)) {
      toast.warn("No spacing allowed in Fiscal Year Code");
      finalValue = value.replace(/\s+/g, "");
    }

    setFycd((prev) =>
      prev.map((row) => {
        if (getRowKey(row) === id) {
          const updatedRow = { ...row, [field]: finalValue, isDirty: true };
          updatedRow.tableRowKey = updatedRow.tempId || updatedRow.fyCd;

          if (field === "fyCd") {
            if (/^\d{4}$/.test(finalValue)) {
              updatedRow.startDate = `${finalValue}-01-01`;
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
  };

  const handleAddFyCd = () => {
    const currentYear = new Date().getFullYear();
    const tempId = `TEMP_${Date.now()}`;
    const newRow = {
      tempId: tempId,
      tableRowKey: tempId,
      fyCd: "",
      fyDesc: "",
      statusCd: "O",
      statusName: "Open",
      closeActTgtCd: "",
      rateName: "None",
      startDate: `${currentYear}-01-01`,
      companyId: "1",
      isDirty: true,
    };

    setFycd((prev) => [newRow, ...prev]);
    setSelectedFycdRow(newRow);
    setSelectedRows([newRow]);
  };

  const handleDelete = async () => {
    const rowsToDelete = isFormView
      ? (selectedFycdRow ? [selectedFycdRow] : [])
      : (selectedRows || []);

    if (rowsToDelete.length === 0) {
      return toast.warn("Select at least one record to delete.");
    }

    const confirmMessage =
      rowsToDelete.length === 1
        ? `Delete Fiscal Year: ${rowsToDelete[0].fyCd || "New Record"}?`
        : `Are you sure you want to delete ${rowsToDelete.length} selected records?`;

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      await Promise.all(
        rowsToDelete.map((row) => {
          if (!row.tempId) {
            const companyId = row.companyId || "";
            return api.delete(
              `${backendUrl}/api/FiscalYear/${row.fyCd}?CompanyId=${companyId}`,
            );
          }
          return Promise.resolve();
        }),
      );

      const deletedIdentifiers = rowsToDelete.map((r) => getRowKey(r));
      const updatedList = fycd.filter(
        (f) => !deletedIdentifiers.includes(getRowKey(f)),
      );

      setFycd(updatedList);
      setSelectedRows([]);
      setSelectedFycdRow(null);

      if (updatedList.length === 0) {
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

  const resolveStatus = (val) => {
    const trimmed = String(val || "").trim().toLowerCase();
    if (!trimmed || trimmed === "select") {
      return { statusCd: " ", statusName: "Select" };
    }
    if (
      trimmed.startsWith("o") ||
      trimmed.includes("open") ||
      trimmed.includes("act")
    ) {
      return { statusCd: "O", statusName: "Open" };
    }
    if (
      trimmed.startsWith("c") ||
      trimmed.includes("clos") ||
      trimmed.includes("inact")
    ) {
      return { statusCd: "C", statusName: "Closed" };
    }
    return { statusCd: " ", statusName: "Select" };
  };

  const resolveRateType = (val) => {
    const trimmed = String(val || "").trim().toLowerCase();
    if (!trimmed || trimmed === "none") {
      return { closeActTgtCd: "", rateName: "None" };
    }
    if (trimmed.startsWith("a") || trimmed.includes("act")) {
      return { closeActTgtCd: "A", rateName: "Actual Rates" };
    }
    if (trimmed.startsWith("t") || trimmed.includes("targ")) {
      return { closeActTgtCd: "T", rateName: "Target Rates" };
    }
    return { closeActTgtCd: "", rateName: "None" };
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
      "description",
      "fydesc",
      "status",
      "statuscd",
      "statusname",
      "rate type",
      "ratetype",
      "closeacttgtcd",
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
    let fyDescIdx = -1;
    let statusIdx = -1;
    let rateTypeIdx = -1;

    if (isHeaderRow) {
      fyCdIdx = firstLineCells.findIndex((cell) =>
        ["fiscal year", "fycd", "year"].includes(cell),
      );
      fyDescIdx = firstLineCells.findIndex((cell) =>
        ["description", "fydesc", "desc"].includes(cell),
      );
      statusIdx = firstLineCells.findIndex((cell) =>
        ["status", "statuscd", "statusname"].includes(cell),
      );
      rateTypeIdx = firstLineCells.findIndex((cell) =>
        ["rate type", "ratetype", "closeacttgtcd", "ratename"].includes(cell),
      );
    } else {
      fyCdIdx = 0;
      fyDescIdx = 1;
      statusIdx = 2;
      rateTypeIdx = 3;
    }

    const pastedRows = [];
    dataLines.forEach((line, i) => {
      const cells = line.split("\t");

      const rawFyCd =
        fyCdIdx !== -1 && fyCdIdx < cells.length ? cells[fyCdIdx].trim() : "";
      const rawFyDesc =
        fyDescIdx !== -1 && fyDescIdx < cells.length
          ? cells[fyDescIdx].trim()
          : "";
      const rawStatus =
        statusIdx !== -1 && statusIdx < cells.length
          ? cells[statusIdx].trim()
          : "";
      const rawRateType =
        rateTypeIdx !== -1 && rateTypeIdx < cells.length
          ? cells[rateTypeIdx].trim()
          : "";

      if (!rawFyCd && !rawFyDesc && !rawStatus && !rawRateType) {
        return;
      }

      const { statusCd, statusName } = resolveStatus(rawStatus);
      const { closeActTgtCd, rateName } = resolveRateType(rawRateType);

      const tempIdVal = `PASTE_${Date.now()}_${i}_${Math.random()
        .toString(36)
        .substr(2, 5)}`;

      pastedRows.push({
        fyCd: rawFyCd,
        fyDesc: rawFyDesc || (rawFyCd ? `Fiscal Year ${rawFyCd}` : ""),
        statusCd,
        statusName,
        closeActTgtCd,
        rateName,
        companyId: "1",
        tempId: tempIdVal,
        tableRowKey: tempIdVal,
        isDirty: true,
      });
    });

    if (pastedRows.length === 0) {
      return toast.warn("No valid rows parsed from clipboard.");
    }

    setFycd((prev) => [...pastedRows, ...prev]);
    setSelectedFycdRow(pastedRows[0]);
    setSelectedRows([pastedRows[0]]);
    toast.success(`${pastedRows.length} record(s) pasted.`);
  };

  const handleCopy = () => {
    if (selectedRows.length === 0)
      return toast.warn("Select at least one record to copy.");

    const rowsToCopy = isFormView
      ? (selectedFycdRow ? [selectedFycdRow] : [])
      : (selectedRows || []);

    if (rowsToCopy.length === 0) {
      return toast.warn("Select at least one record to copy.");
    }

    setClipboard([...rowsToCopy]);
    setHasCopied(true);
    toast.success(`${rowsToCopy.length} record(s) copied.`);
  };

  const handlePaste = () => {
    if (!clipboard || clipboard.length === 0) {
      return toast.warn("Clipboard is empty. Copy a record first.");
    }

    const pasted = clipboard.map((row, i) => {
      const clonedRow = JSON.parse(JSON.stringify(row));
      const { tempId, id, fyCd, ...restProps } = clonedRow;
      const tempIdVal = `TEMP_${Date.now()}_${i}`;
      return {
        ...restProps,
        fyCd: fyCd ? `${fyCd}-C` : "",
        tempId: tempIdVal,
        tableRowKey: tempIdVal,
        isNew: true,
        isDirty: true,
      };
    });

    setFycd((prev) => [...pasted, ...prev]);
    setSelectedFycdRow(pasted[0]);
    setSelectedRows([pasted[0]]);
    toast.success(`${pasted.length} record(s) pasted successfully.`);
  };

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

    if (!hasNewRows && !hasEdits) return;

    if (window.confirm("Discard unsaved changes and new rows?")) {
      useDraftStore.getState().clearDraft("manage-fiscal-year");
      setFycd((prev) => prev.filter((f) => !f.tempId));
      fetchData();
      setFilteredGroups([]);
      setSelectedRows([]);
      toast.info("Unsaved changes discarded.");
    }
  };

  const handleMasterSave = async (confirmedSubPeriod = null) => {
    const changedRows = fycd.filter((f) => f.isDirty || f.tempId);

    if (changedRows.length === 0) {
      return toast.warn("No changes to save");
    }

    setLoading(true);
    try {
      await Promise.all(
        changedRows.map((row) => {
          let finalFyCd = row.fyCd;
          if (row.tempId && row.startDate) {
            finalFyCd = row.startDate.split("-")[0];
          }

          const payload = {
            fyCd: finalFyCd,
            companyId: String(row.companyId || "1"),
            statusCd: row.statusCd || "O",
            fyDesc: row.fyDesc || `Fiscal Year ${finalFyCd}`,
            modifiedBy: user.name || "Admin",
            closeActTgtCd: row.closeActTgtCd || "",
            totalPeriods: Number(row.totalPeriods) || 12,
            startDate: `${finalFyCd}-01-01`,
            subPeriodsPerPeriod: row.tempId
              ? Number(confirmedSubPeriod || 1)
              : Number(row.subPeriodsPerPeriod || 0),
          };

          if (row.tempId) {
            return api.post(
              `${backendUrl}/api/FiscalYear/create-full`,
              payload,
            );
          } else {
            return api.put(`${backendUrl}/api/FiscalYear/${row.fyCd}`, payload);
          }
        }),
      );

      useDraftStore.getState().clearDraft("manage-fiscal-year");
      toast.success("Changes saved successfully");
      setShowSubModal(false);
      fetchData();
    } catch (e) {
      console.error("Save Error:", e);
      toast.error(e.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Find & Replace Handlers ---
  const handleFind = () => {
    if (!searchValue.trim()) {
      setFilteredGroups([]);
      return toast.info("Search filter cleared.");
    }
    const term = searchValue.toLowerCase().trim();
    const matches = fycd.filter((row) => {
      if (searchColumn === "fyCd") return String(row.fyCd || "").toLowerCase().includes(term);
      if (searchColumn === "fyDesc") return String(row.fyDesc || "").toLowerCase().includes(term);
      if (searchColumn === "statusName") return String(row.statusName || "").toLowerCase().includes(term);
      if (searchColumn === "rateName") return String(row.rateName || "").toLowerCase().includes(term);
      return (
        String(row.fyCd || "").toLowerCase().includes(term) ||
        String(row.fyDesc || "").toLowerCase().includes(term) ||
        String(row.statusName || "").toLowerCase().includes(term) ||
        String(row.rateName || "").toLowerCase().includes(term)
      );
    });

    setFilteredGroups(matches);
    if (matches.length === 0) {
      toast.warn("No matching records found.");
    } else {
      setSelectedRows(matches);
      setSelectedFycdRow(matches[0]);
      toast.success(`Found ${matches.length} matching record(s).`);
    }
  };

  const handleReplaceAll = () => {
    if (searchColumn === "fyCd") {
      return toast.warn("Fiscal Year Code cannot be modified via Replace.");
    }
    if (!searchValue.trim()) {
      return toast.warn("Please enter a term to find.");
    }
    const term = searchValue.trim();
    let replaceCount = 0;

    const targetList = filteredGroups.length > 0 ? filteredGroups : fycd;
    const targetKeys = new Set(targetList.map((r) => getRowKey(r)));

    const updated = fycd.map((row) => {
      if (!targetKeys.has(getRowKey(row))) return row;

      let changed = false;
      const updatedRow = { ...row };

      const fieldsToCheck =
        searchColumn === "all"
          ? ["fyDesc", "statusName", "rateName"]
          : [searchColumn];

      fieldsToCheck.forEach((colKey) => {
        if (colKey === "statusName") {
          if (String(row.statusName || "").toLowerCase() === term.toLowerCase()) {
            const resolved = resolveStatus(replaceValue);
            updatedRow.statusCd = resolved.statusCd;
            updatedRow.statusName = resolved.statusName;
            changed = true;
            replaceCount++;
          }
        } else if (colKey === "rateName") {
          if (String(row.rateName || "").toLowerCase() === term.toLowerCase()) {
            const resolved = resolveRateType(replaceValue);
            updatedRow.closeActTgtCd = resolved.closeActTgtCd;
            updatedRow.rateName = resolved.rateName;
            changed = true;
            replaceCount++;
          }
        } else if (typeof updatedRow[colKey] === "string" && updatedRow[colKey].toLowerCase().includes(term.toLowerCase())) {
          const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          updatedRow[colKey] = updatedRow[colKey].replace(regex, replaceValue);
          changed = true;
          replaceCount++;
        }
      });

      if (changed) {
        updatedRow.isDirty = true;
        return updatedRow;
      }
      return row;
    });

    if (replaceCount > 0) {
      setFycd(updated);
      if (selectedFycdRow) {
        const found = updated.find((r) => getRowKey(r) === getRowKey(selectedFycdRow));
        if (found) {
          setSelectedFycdRow(found);
          setSelectedRows([found]);
        }
      }
      if (filteredGroups.length > 0) {
        setFilteredGroups(filteredGroups.map(fg => updated.find(u => getRowKey(u) === getRowKey(fg)) || fg));
      }
      toast.success(`Replaced ${replaceCount} occurrence(s).`);
    } else {
      toast.warn("No occurrences found to replace.");
    }
  };

  const handleClearFind = () => {
    setSearchValue("");
    setReplaceValue("");
    setFilteredGroups([]);
  };

  // --- Memoized Sorted and Filtered Table Data ---
  const displayData = useMemo(() => {
    const base = filteredGroups.length > 0 ? filteredGroups : fycd;
    if (!sortOrder) return base;
    return [...base].sort((a, b) => {
      const valA = String(a.fyCd || "").toLowerCase();
      const valB = String(b.fyCd || "").toLowerCase();
      if (sortOrder === "asc") {
        return valA.localeCompare(valB, undefined, { numeric: true });
      }
      return valB.localeCompare(valA, undefined, { numeric: true });
    });
  }, [fycd, filteredGroups, sortOrder]);

  let currentIndex = fycd.findIndex(
    (f) => getRowKey(f) === getRowKey(selectedFycdRow || {}),
  );

  const handleNavigate = (dir) => {
    let newIdx = currentIndex;
    if (dir === "start") newIdx = 0;
    else if (dir === "prev") newIdx = currentIndex - 1;
    else if (dir === "next") newIdx = currentIndex + 1;
    else if (dir === "end") newIdx = fycd.length - 1;

    if (newIdx >= 0 && newIdx < fycd.length) {
      setSelectedFycdRow(fycd[newIdx]);
      setSelectedRows([fycd[newIdx]]);
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
    if (selectedRows.length === dataToSelect.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...dataToSelect]);
    }
  };

  const toggleView = () => {
    if (!isFormView) {
      if (!selectedFycdRow && fycd.length > 0) {
        const firstRow = fycd[0];
        setSelectedFycdRow(firstRow);
        setSelectedRows([firstRow]);
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
        
        /* TABLE INPUT STYLING MATCHING MANAGECOUNTRIES */
        .payment-voucher-page .td-input[readonly] {
          background-color: #f8fafc !important; /* bg-slate-50 style */
          color: #94a3b8 !important;            /* text-slate-400 style */
          border-color: #e2e8f0 !important;      /* border-slate-200 style */
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
            <span className="truncate">Fiscal Year</span>
          </div>
        </div>
      </div>

      {/* NEW UI PAGE HEADER */}
      <div className="border-b border-[#dbe3eb] bg-white ml-[15px]">
        <div className="flex items-center justify-between gap-3 pl-4 pr-3 py-2">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[18px] font-semibold tracking-[-0.2px] text-[#172b4d] whitespace-nowrap">
              Fiscal Year
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
              onClick={handleClear}
              className="voucher-head-btn"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                const hasNewRows = fycd.some((r) => r.tempId);
                if (hasNewRows) {
                  setShowSubModal(true);
                } else {
                  handleMasterSave();
                }
              }}
              className="voucher-head-btn text-[#1677e8] border-[#1677e8]/40 hover:bg-[#1677e8]/5"
            >
              <Save size={14} />
              Save
            </button>

            <button
              type="button"
              onClick={() => setShowFindReplace(!showFindReplace)}
              className={`voucher-head-btn ${
                showFindReplace ? "bg-[#1677e8]/10 text-[#1677e8] border-[#1677e8]/40 font-semibold" : ""
              }`}
              title="Toggle Find & Replace"
            >
              <Replace size={14} />
              Find & Replace
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

      {/* MAIN CONTENT AREA */}
      <div className="px-4 pb-4 pt-3 lg:px-4">
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
                    <option value="fyDesc">Description</option>
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
              {/* Fiscal Year Master Header Form Container */}
              <div className="voucher-panel voucher-master-card mb-4">
                <div className="voucher-panel-title">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    Fiscal Year
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-3">
                  <div className="space-y-2">
                    <FormInput
                      label="Fiscal Year"
                      required
                      value={selectedFycdRow?.fyCd || ""}
                      readOnly={
                        !selectedFycdRow?.tempId && !selectedFycdRow?.isNew && !!selectedFycdRow?.fyCd
                      }
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedFycdRow || {}),
                          "fyCd",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <FormInput
                      label="Description"
                      required
                      value={selectedFycdRow?.fyDesc || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          getRowKey(selectedFycdRow || {}),
                          "fyDesc",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <FormSearchSelect
                      label="Status"
                      value={
                        selectedFycdRow?.statusName ||
                        selectedFycdRow?.statusCd ||
                        ""
                      }
                      searchTerm={searchTermProfiles}
                      setSearchTerm={setSearchTermProfiles}
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
                    <FormSearchSelect
                      label="Rate Type"
                      value={
                        selectedFycdRow?.rateName ||
                        selectedFycdRow?.closeActTgtCd ||
                        ""
                      }
                      searchTerm={searchTermRate}
                      setSearchTerm={setSearchTermRate}
                      options={rateOpt}
                      displayKey="name"
                      onSelect={(p) => {
                        const id = getRowKey(selectedFycdRow || {});
                        handleFieldChange(
                          id,
                          "closeActTgtCd",
                          p.closeActTgtCd,
                        );
                        handleFieldChange(id, "rateName", p.name);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSubModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/30 backdrop-blur-xs">
          <div className="bg-white rounded-xl w-64 border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-4">
              <h3 className="text-xs font-bold text-slate-800 text-center mb-1">
                Initialize Subperiods
              </h3>
              <p className="text-[11px] text-slate-500 text-center mb-3">
                Enter subperiods per period (1-4)
              </p>

              <div className="flex justify-center">
                <input
                  type="number"
                  autoFocus
                  className="w-20 bg-slate-50 border border-slate-300 rounded-md py-1.5 text-center text-sm font-semibold text-slate-800 outline-none focus:border-[#1677e8] focus:ring-1 focus:ring-[#1677e8] transition-all"
                  value={subValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setSubValue("");
                      return;
                    }
                    const num = parseInt(val, 10);
                    if (num <= 4) setSubValue(num);
                  }}
                  onBlur={() => {
                    if (subValue === "" || subValue < 1) setSubValue(1);
                  }}
                  min="1"
                  max="4"
                />
              </div>
            </div>

            <div className="flex border-t border-slate-200 bg-slate-50">
              <button
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors border-r border-slate-200 cursor-pointer"
                onClick={() => setShowSubModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2.5 text-xs font-semibold text-[#1677e8] hover:bg-blue-50 transition-colors cursor-pointer"
                disabled={loading}
                onClick={() => {
                  const finalVal = subValue === "" ? 1 : subValue;
                  handleMasterSave(finalVal);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFiscalYear;
