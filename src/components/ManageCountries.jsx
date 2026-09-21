import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Search,
  Plus,
  Copy,
  ClipboardPaste,
  Trash2,
  X,
  Save,
  LayoutGrid,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Replace,
} from "lucide-react";
import { backendUrl } from "./config";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import { MainContainer, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { useDraftStore } from "../store/useDraftStore";
import { useRecentStore } from "../store/useRecentStore";

const FormSection = ({ title, children, className = "", headerRight }) => (
  <div className={`bg-white border border-[#e5e7eb] rounded-lg shadow-xs overflow-hidden ${className}`}>
    {title && (
      <div className="px-3.5 py-2 bg-white border-b border-[#eeeeee] flex items-center justify-between">
        <h3 className="text-[12px] font-semibold text-[#3c4043] tracking-normal select-none">
          {title}
        </h3>
        {headerRight && <div>{headerRight}</div>}
      </div>
    )}
    <div className="p-3.5">{children}</div>
  </div>
);

const ManageCountryIcon = () => (
  <div className="p-1 bg-[#f0f4f9] border border-[#d5dfeb] rounded-md shadow-2xs -mr-2 flex items-center justify-center">
    <Globe size={16} className="text-[#344a63]" />
  </div>
);

const CountryToolbar = ({
  isFormView,
  currentIndex = 0,
  totalRecords = 0,
  handleNavigate,
  jumpToCode,
  searchValue = "",
  setSearchValue,
  loading = false,
  actions = {},
  buttonsDisable = [],
  clipboard = [],
  selectedRow = null,
  selectedCount = 0,
  onToggleFindReplace,
  showFindReplace = false,
  onCloseScreen,
}) => {
  const { onAdd, onCopy, onPaste, onClear, onDelete, onSave, onToggleView } = actions;
  const hasSelection = isFormView ? (!!selectedRow && totalRecords > 0) : (selectedCount > 0);
  const isCopyDisabled = loading || !hasSelection;
  const isDeleteDisabled = loading || !hasSelection;
  const isPasteDisabled = loading;

  return (
    <div className="flex items-center justify-between gap-3 pl-4 pr-3 py-2 flex-wrap">
      {/* LEFT SECTION: Navigation & Search */}
      <div className="flex items-center gap-2.5 min-w-0">
        {handleNavigate && (
          <div className="flex items-center rounded-md border border-[#d5dfeb] bg-[#f5f8fb] overflow-hidden">
            {/* First */}
            <button
              type="button"
              className="voucher-nav-btn"
              title="First record"
              disabled={currentIndex <= 0 || loading}
              onClick={() => handleNavigate("start")}
            >
              <ChevronsLeft size={15} strokeWidth={1.5} />
            </button>

            {/* Previous */}
            <button
              type="button"
              className="voucher-nav-btn"
              title="Previous record"
              disabled={currentIndex <= 0 || loading}
              onClick={() => handleNavigate("prev")}
            >
              <ChevronLeft size={15} strokeWidth={1.5} />
            </button>

            {/* Count */}
            <span className="voucher-count">
              {totalRecords > 0 ? (currentIndex >= 0 ? currentIndex + 1 : 1) : 0} / {totalRecords}
            </span>

            {/* Next */}
            <button
              type="button"
              className="voucher-nav-btn"
              title="Next record"
              disabled={currentIndex >= totalRecords - 1 || loading}
              onClick={() => handleNavigate("next")}
            >
              <ChevronRight size={15} strokeWidth={1.5} />
            </button>

            {/* Last */}
            <button
              type="button"
              className="voucher-nav-btn"
              title="Last record"
              disabled={currentIndex >= totalRecords - 1 || loading}
              onClick={() => handleNavigate("end")}
            >
              <ChevronsRight size={15} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {setSearchValue && (
          <div className="relative flex items-center ml-1">
            <Search
              size={13}
              className="absolute left-2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search..."
              className="h-7 w-36 pl-7 pr-6 text-[11px] bg-[#f6f6f6] hover:bg-slate-100/80 focus:bg-white border border-[#d5dfeb] rounded-md outline-none text-[#3c4043] placeholder:text-gray-400 focus:border-[#1677e8] transition-all"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && jumpToCode) {
                  jumpToCode(searchValue);
                }
              }}
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                className="absolute right-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* RIGHT SECTION: Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
        {!buttonsDisable.includes("add") && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            disabled={loading}
            className="voucher-primary-btn"
          >
            <Plus size={13} /> Create
          </button>
        )}

        {!buttonsDisable.includes("copy") && onCopy && (
          <button
            type="button"
            onClick={onCopy}
            disabled={isCopyDisabled}
            className="voucher-head-btn"
          >
            <Copy size={13} /> Copy
          </button>
        )}

        {!buttonsDisable.includes("paste") && onPaste && (
          <button
            type="button"
            onClick={onPaste}
            disabled={isPasteDisabled}
            className="voucher-head-btn"
          >
            <ClipboardPaste size={13} /> Paste
          </button>
        )}

        {!buttonsDisable.includes("delete") && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleteDisabled}
            className="voucher-head-btn"
          >
            <Trash2 size={13} /> Delete
          </button>
        )}

        {onToggleFindReplace && (
          <button
            type="button"
            onClick={onToggleFindReplace}
            className={`voucher-head-btn ${showFindReplace ? "bg-slate-100 border-[#1677e8] text-[#1677e8]" : ""}`}
            title="Find & Replace"
          >
            <Replace size={13} /> Find/Replace
          </button>
        )}

        {!buttonsDisable.includes("discard") && onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="voucher-head-btn"
            title="Reset unsaved changes"
          >
            Reset
          </button>
        )}

        {!buttonsDisable.includes("save") && onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="voucher-head-btn text-[#1677e8] border-[#1677e8]/40 hover:bg-[#1677e8]/5"
          >
            <Save size={13} /> Save
          </button>
        )}

        {onCloseScreen && (
          <button
            type="button"
            onClick={onCloseScreen}
            className="voucher-head-btn text-slate-600 hover:text-slate-800"
            title="Close screen"
          >
            <X size={13} /> Close
          </button>
        )}

        {!buttonsDisable.includes("tableform") && onToggleView && (
          <button
            type="button"
            onClick={onToggleView}
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
        )}
      </div>
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
  placeholder = "",
  horizontal,
  inputClassName = "",
  labelClassName = "",
  helperText = "",
  icon: Icon,
  onIconClick,
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
            checked={checked === true || checked === "Y"}
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
        <div className="w-3/5 relative flex items-center">
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
            className={`w-full h-[32px] px-2.5 py-1 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${Icon ? "pr-8" : ""} ${inputClassName}
              ${
                readOnly || disabled
                  ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
              }`}
          />
          {Icon && (
            <div
              onClick={onIconClick}
              className={`absolute right-2.5 flex items-center justify-center text-slate-400 ${
                onIconClick ? "cursor-pointer hover:text-slate-600" : "pointer-events-none"
              }`}
            >
              <Icon size={14} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 w-full min-w-0 ${className}`}>
      {label && (
        <span className={`text-xs font-semibold text-slate-700 select-none ${labelClassName}`}>
          {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
        </span>
      )}
      <div className="relative w-full flex items-center">
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
          className={`w-full h-[32px] px-2.5 py-1 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${Icon ? "pr-8" : ""} ${inputClassName}
            ${
              readOnly || disabled
                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            }`}
        />
        {Icon && (
          <div
            onClick={onIconClick}
            className={`absolute right-2.5 flex items-center justify-center text-slate-400 ${
              onIconClick ? "cursor-pointer hover:text-slate-600" : "pointer-events-none"
            }`}
          >
            <Icon size={14} />
          </div>
        )}
      </div>
      {helperText && (
        <span className="text-[10px] text-slate-400 select-none">{helperText}</span>
      )}
    </div>
  );
};

const initialMockCountries = [
  {
    uniqueKey: "USA",
    countryCode: "USA",
    countryName: "United States",
    locale: "USA",
    states: [
      {
        uniqueKey: "STATE_USA_CA",
        stateCode: "CA",
        state: "California",
        countryCode: "USA",
        postalCodes: [
          { uniqueKey: "POSTAL_90001", postalCode: "90001", city: "Los Angeles", countryCode: "USA", stateCode: "CA" },
          { uniqueKey: "POSTAL_90002", postalCode: "90002", city: "Los Angeles", countryCode: "USA", stateCode: "CA" }
        ]
      },
      {
        uniqueKey: "STATE_USA_NY",
        stateCode: "NY",
        state: "New York",
        countryCode: "USA",
        postalCodes: [
          { uniqueKey: "POSTAL_10001", postalCode: "10001", city: "New York City", countryCode: "USA", stateCode: "NY" }
        ]
      }
    ]
  },
  {
    uniqueKey: "CAN",
    countryCode: "CAN",
    countryName: "Canada",
    locale: "CAN",
    states: [
      {
        uniqueKey: "STATE_CAN_ON",
        stateCode: "ON",
        state: "Ontario",
        countryCode: "CAN",
        postalCodes: [
          { uniqueKey: "POSTAL_M5V", postalCode: "M5V", city: "Toronto", countryCode: "CAN", stateCode: "ON" }
        ]
      }
    ]
  },
  {
    uniqueKey: "IND",
    countryCode: "IND",
    countryName: "India",
    locale: "IND",
    states: [
      {
        uniqueKey: "STATE_IND_MH",
        stateCode: "MH",
        state: "Maharashtra",
        countryCode: "IND",
        postalCodes: [
          { uniqueKey: "POSTAL_400001", postalCode: "400001", city: "Mumbai", countryCode: "IND", stateCode: "MH" }
        ]
      }
    ]
  }
];

const ManageCountry = () => {
  const [countries, setCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedCountryCodes, setSelectedCountryCodes] = useState(new Set());
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [clipboard, setClipboard] = useState([]);

  // --- Sorting & Find/Replace States ---
  const [sortColumn, setSortColumn] = useState("countryCode");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchColumn, setSearchColumn] = useState("all");
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);

  // Level 2 - State State Variables
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateCodes, setSelectedStateCodes] = useState(new Set());
  const [isStateFormView, setIsStateFormView] = useState(true);
  const [stateSearchValue, setStateSearchValue] = useState("");
  const [stateCurrentIndex, setStateCurrentIndex] = useState(0);
  const [stateClipboard, setStateClipboard] = useState([]);
  const [showStateFindReplace, setShowStateFindReplace] = useState(false);
  const [stateSearchColumn, setStateSearchColumn] = useState("all");
  const [stateFindValue, setStateFindValue] = useState("");
  const [stateReplaceValue, setStateReplaceValue] = useState("");
  const [stateFilteredGroups, setStateFilteredGroups] = useState([]);

  // Level 3 - Postal Code State Variables
  const [selectedPostal, setSelectedPostal] = useState(null);
  const [selectedPostalCodes, setSelectedPostalCodes] = useState(new Set());
  const [isPostalFormView, setIsPostalFormView] = useState(true);
  const [postalSearchValue, setPostalSearchValue] = useState("");
  const [postalCurrentIndex, setPostalCurrentIndex] = useState(0);
  const [postalClipboard, setPostalClipboard] = useState([]);
  const [showPostalFindReplace, setShowPostalFindReplace] = useState(false);
  const [postalSearchColumn, setPostalSearchColumn] = useState("all");
  const [postalFindValue, setPostalFindValue] = useState("");
  const [postalReplaceValue, setPostalReplaceValue] = useState("");
  const [postalFilteredGroups, setPostalFilteredGroups] = useState([]);

  const navigate = useNavigate();
  const handleCloseScreen = () => {
    useDraftStore.getState().clearDraft("manage-countries");
    useRecentStore.getState().removeRecentPage?.("/dashboard/countries");
    useRecentStore.getState().removeRecentPage?.("/dashboard/manage-countries");
    navigate("/dashboard");
  };

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialCountryState = {
    countryCode: "",
    countryName: "",
    printFl: "N",
    magMediaCode: "",
    locale: "",
    iso2Code: "",
    iso3Code: "",
    natoFl: "N",
    companyId: "1",
    modifiedBy: user.name || "Admin"
  };

  const getRowKey = (row) => row ? (row.uniqueKey || row.tempId || row.countryCode) : "";
  const getStateKey = (row) => row ? (row.uniqueKey || row.tempId || row.stateCode) : "";
  const getPostalKey = (row) => row ? (row.uniqueKey || row.tempId || row.postalKey || row.postalCode) : "";

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

  const countryColumns = [
    { id: "countryCode", key: "countryCode", label: "Country Code", required: true, type: "text", readOnlyIfExisting: true, sortIcon: renderSortIcon("countryCode", "Country Code") },
    { id: "countryName", key: "countryName", label: "Country Name", required: true, type: "text", sortIcon: renderSortIcon("countryName", "Country Name") }
  ];

  // --- Find & Replace Handlers ---
  const handleFind = () => {
    if (!findValue.trim()) {
      setFilteredGroups([]);
      return toast.info("Search filter cleared.");
    }
    const term = findValue.toLowerCase().trim();
    const matches = countries.filter((row) => {
      if (searchColumn === "countryCode") return String(row.countryCode || "").toLowerCase().includes(term);
      if (searchColumn === "countryName") return String(row.countryName || "").toLowerCase().includes(term);
      return (
        String(row.countryCode || "").toLowerCase().includes(term) ||
        String(row.countryName || "").toLowerCase().includes(term)
      );
    });

    setFilteredGroups(matches);
    if (matches.length === 0) {
      toast.warn("No matching records found.");
    } else {
      setSelectedCountryCodes(new Set([getRowKey(matches[0])]));
      setSelectedCountry(matches[0]);
      toast.success(`Found ${matches.length} matching record(s).`);
    }
  };

  const handleReplaceAll = () => {
    if (searchColumn === "countryCode") {
      return toast.warn("Country Code cannot be modified via Replace.");
    }
    if (!findValue.trim()) {
      return toast.warn("Please enter a term to find.");
    }
    const term = findValue.trim();
    let replaceCount = 0;

    const targetList = filteredGroups.length > 0 ? filteredGroups : countries;
    const targetKeys = new Set(targetList.map((r) => getRowKey(r)));

    const updated = countries.map((row) => {
      if (!targetKeys.has(getRowKey(row))) return row;

      let changed = false;
      const updatedRow = { ...row };

      const fieldsToCheck =
        searchColumn === "all"
          ? ["countryName"]
          : searchColumn === "countryCode" && row.isNew
          ? ["countryCode"]
          : [searchColumn];

      fieldsToCheck.forEach((colKey) => {
        if (typeof updatedRow[colKey] === "string" && updatedRow[colKey].toLowerCase().includes(term.toLowerCase())) {
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
      setCountries(updated);
      if (selectedCountry) {
        const found = updated.find((r) => getRowKey(r) === getRowKey(selectedCountry));
        if (found) {
          setSelectedCountry(found);
          setSelectedCountryCodes(new Set([getRowKey(found)]));
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
    setFindValue("");
    setReplaceValue("");
    setFilteredGroups([]);
  };

  // --- Memoized Table & Form Data ---
  const displayCountries = useMemo(() => {
    const base = filteredGroups.length > 0 ? filteredGroups : (
      searchValue.trim() ? countries.filter((c) => {
        const term = searchValue.toLowerCase().trim();
        return (
          String(c.countryCode || "").toLowerCase().includes(term) ||
          String(c.countryName || "").toLowerCase().includes(term) ||
          String(c.locale || "").toLowerCase().includes(term) ||
          String(c.iso2Code || "").toLowerCase().includes(term) ||
          String(c.iso3Code || "").toLowerCase().includes(term) ||
          String(c.modifiedBy || "").toLowerCase().includes(term)
        );
      }) : countries
    );
    if (!sortColumn) return base;
    return [...base].sort((a, b) => {
      if ((a.isNew || a.tempId) && !(b.isNew || b.tempId)) return -1;
      if (!(a.isNew || a.tempId) && (b.isNew || b.tempId)) return 1;
      const valA = a[sortColumn] ?? "";
      const valB = b[sortColumn] ?? "";
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB), undefined, { numeric: true })
        : String(valB).localeCompare(String(valA), undefined, { numeric: true });
    });
  }, [countries, filteredGroups, searchValue, sortColumn, sortDirection]);

  // Global search sync with active record in Form View
  useEffect(() => {
    if (searchValue && displayCountries.length > 0) {
      const isCurrentInDisplay = displayCountries.some(
        (r) => getRowKey(r) === getRowKey(selectedCountry),
      );
      if (!isCurrentInDisplay) {
        setSelectedCountry(displayCountries[0]);
        setSelectedCountryCodes(new Set([getRowKey(displayCountries[0])]));
        loadCountryDetails(displayCountries[0]);
      }
    }
  }, [searchValue, displayCountries]);

  // --- Draft Store Hydration on Mount ---
  useEffect(() => {
    const draft = useDraftStore.getState().getDraft("manage-countries");
    if (
      draft &&
      Array.isArray(draft.countries) &&
      draft.countries.length > 0 &&
      (draft.isDirty ||
        draft.hasUnsaved ||
        draft.countries.some(
          (c) =>
            c.isDirty ||
            c.isNew ||
            (c.states || []).some(
              (s) =>
                s.isDirty ||
                s.isNew ||
                (s.postalCodes || []).some((p) => p.isDirty || p.isNew),
            ),
        ))
    ) {
      setCountries(draft.countries);
      if (draft.selectedCountry) setSelectedCountry(draft.selectedCountry);
      if (draft.selectedCountryCodes)
        setSelectedCountryCodes(new Set(draft.selectedCountryCodes));
      if (draft.selectedState) setSelectedState(draft.selectedState);
      if (draft.selectedStateCodes)
        setSelectedStateCodes(new Set(draft.selectedStateCodes));
      if (draft.selectedPostal) setSelectedPostal(draft.selectedPostal);
      if (draft.selectedPostalCodes)
        setSelectedPostalCodes(new Set(draft.selectedPostalCodes));
      if (typeof draft.isFormView === "boolean") setIsFormView(draft.isFormView);
      if (typeof draft.isStateFormView === "boolean") setIsStateFormView(draft.isStateFormView);
      if (typeof draft.isPostalFormView === "boolean") setIsPostalFormView(draft.isPostalFormView);
    } else {
      fetchCountries();
    }
  }, []);

  // --- Auto-Save Draft to Zustand ---
  const countriesRef = useRef(countries);
  const selectedCountryRef = useRef(selectedCountry);
  const selectedCountryCodesRef = useRef(selectedCountryCodes);
  const selectedStateRef = useRef(selectedState);
  const selectedStateCodesRef = useRef(selectedStateCodes);
  const selectedPostalRef = useRef(selectedPostal);
  const selectedPostalCodesRef = useRef(selectedPostalCodes);
  const isFormViewRef = useRef(isFormView);
  const isStateFormViewRef = useRef(isStateFormView);
  const isPostalFormViewRef = useRef(isPostalFormView);

  useEffect(() => {
    countriesRef.current = countries;
    selectedCountryRef.current = selectedCountry;
    selectedCountryCodesRef.current = selectedCountryCodes;
    selectedStateRef.current = selectedState;
    selectedStateCodesRef.current = selectedStateCodes;
    selectedPostalRef.current = selectedPostal;
    selectedPostalCodesRef.current = selectedPostalCodes;
    isFormViewRef.current = isFormView;
    isStateFormViewRef.current = isStateFormView;
    isPostalFormViewRef.current = isPostalFormView;

    const hasDirty = countries.some(
      (c) =>
        c.isDirty ||
        c.isNew ||
        (c.states || []).some(
          (s) =>
            s.isDirty ||
            s.isNew ||
            (s.postalCodes || []).some((p) => p.isDirty || p.isNew),
        ),
    );
    if (hasDirty) {
      useDraftStore.getState().saveDraft("manage-countries", {
        countries,
        selectedCountry,
        selectedCountryCodes: Array.from(selectedCountryCodes),
        selectedState,
        selectedStateCodes: Array.from(selectedStateCodes),
        selectedPostal,
        selectedPostalCodes: Array.from(selectedPostalCodes),
        isFormView,
        isStateFormView,
        isPostalFormView,
        isDirty: true,
        hasUnsaved: true,
      });
    }
  }, [
    countries,
    selectedCountry,
    selectedCountryCodes,
    selectedState,
    selectedStateCodes,
    selectedPostal,
    selectedPostalCodes,
    isFormView,
    isStateFormView,
    isPostalFormView,
  ]);

  useEffect(() => {
    return () => {
      const cur = countriesRef.current;
      if (
        cur &&
        cur.some(
          (c) =>
            c.isDirty ||
            c.isNew ||
            (c.states || []).some(
              (s) =>
                s.isDirty ||
                s.isNew ||
                (s.postalCodes || []).some((p) => p.isDirty || p.isNew),
            ),
        )
      ) {
        useDraftStore.getState().saveDraft("manage-countries", {
          countries: cur,
          selectedCountry: selectedCountryRef.current,
          selectedCountryCodes: Array.from(selectedCountryCodesRef.current),
          selectedState: selectedStateRef.current,
          selectedStateCodes: Array.from(selectedStateCodesRef.current),
          selectedPostal: selectedPostalRef.current,
          selectedPostalCodes: Array.from(selectedPostalCodesRef.current),
          isFormView: isFormViewRef.current,
          isStateFormView: isStateFormViewRef.current,
          isPostalFormView: isPostalFormViewRef.current,
          isDirty: true,
          hasUnsaved: true,
        });
      }
    };
  }, []);

  const stateColumns = [
    { id: "stateCode", key: "stateCode", label: "State Code", required: true, type: "text", readOnlyIfExisting: true },
    { id: "state", key: "state", label: "State", required: true, type: "text" }
  ];

  const postalColumns = [
    { id: "postalCode", key: "postalCode", label: "Postal Code", required: true, type: "text", readOnlyIfExisting: true },
    { id: "city", key: "city", label: "City", type: "text" }
  ];

  const showErrorToast = (error, defaultMsg) => {
    if (error.response && error.response.data) {
      const data = error.response.data;
      if (typeof data === "string") {
        toast.error(data);
        return;
      }
      if (data.detail) {
        toast.error(data.detail);
        return;
      }
      if (data.message) {
        toast.error(data.message);
        return;
      }
      if (data.title) {
        toast.error(data.title);
        return;
      }
      toast.error(JSON.stringify(data));
      return;
    }
    toast.error(error.message || defaultMsg);
  };

  const fetchStatesForCountry = async (countryCode) => {
    try {
      const response = await axios.get(`${backendUrl}/api/states?countryCode=${countryCode}`);
      return response.data.map(s => ({
        ...s,
        state: s.stateName,
        postalCodes: [],
        uniqueKey: `STATE_${countryCode}_${s.stateCode}`
      }));
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  };

  const fetchPostalCodesForState = async (countryCode, stateCode) => {
    try {
      const response = await axios.get(`${backendUrl}/api/postal-codes?countryCode=${countryCode}&stateCode=${stateCode}`);
      return response.data.map(p => ({
        ...p,
        postalCode: p.postalCd,
        city: p.cityName,
        uniqueKey: `POSTAL_${countryCode}_${stateCode}_${p.postalKey || p.postalCd}`
      }));
    } catch (error) {
      console.error("Error fetching postal codes:", error);
      return [];
    }
  };

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/countries`);
      if (response.data && response.data.length > 0) {
        let mapped = response.data.map(c => ({
          ...c,
          states: [],
          uniqueKey: c.countryCode
        }));
        
        // Load details for the first country automatically
        const firstRec = mapped[0];
        const states = await fetchStatesForCountry(firstRec.countryCode);
        const statesWithPostals = await Promise.all(
          states.map(async (s) => {
            const postals = await fetchPostalCodesForState(firstRec.countryCode, s.stateCode);
            return { ...s, postalCodes: postals };
          })
        );
        firstRec.states = statesWithPostals;

        setCountries(mapped);
        setAllCountries(mapped);
        setSelectedCountry(firstRec);
        setSelectedCountryCodes(new Set());

        // Start with no child checkboxes checked by default (user-controlled)
        setSelectedStateCodes(new Set());
        setSelectedPostalCodes(new Set());

        const firstState = statesWithPostals[0] || null;
        setSelectedState(firstState);
        const firstPostal = firstState?.postalCodes?.[0] || null;
        setSelectedPostal(firstPostal);
        
        setStateCurrentIndex(0);
        setPostalCurrentIndex(0);
      } else {
        setCountries([]);
        setAllCountries([]);
      }
    } catch (error) {
      console.error("Failed to fetch countries", error);
      showErrorToast(error, "Failed to fetch countries");
      setCountries([]);
      setAllCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCountryDetails = async (country) => {
    if (!country) return;
    setLoading(true);
    try {
      const states = await fetchStatesForCountry(country.countryCode);
      
      // Fetch postals for all states of this country in parallel
      const statesWithPostals = await Promise.all(
        states.map(async (s) => {
          const postals = await fetchPostalCodesForState(country.countryCode, s.stateCode);
          return { ...s, postalCodes: postals };
        })
      );
      
      country.states = statesWithPostals;

      setCountries(prev => prev.map(c => c.countryCode === country.countryCode ? { ...c, states: statesWithPostals } : c));
      setSelectedCountry({ ...country, states: statesWithPostals });

      const firstState = statesWithPostals[0] || null;
      setSelectedState(firstState);
      setStateCurrentIndex(0);

      const firstPostal = firstState?.postalCodes?.[0] || null;
      setSelectedPostal(firstPostal);
      setPostalCurrentIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadStateDetails = async (countryCode, state) => {
    if (!state) return;
    setLoading(true);
    try {
      const postals = await fetchPostalCodesForState(countryCode, state.stateCode);
      state.postalCodes = postals;
      
      setSelectedState({ ...state, postalCodes: postals });

      // Update the country in the main countries list
      setCountries(prevList =>
        prevList.map(c => {
          if (c.countryCode === countryCode) {
            const updatedStates = (c.states || []).map(s =>
              s.stateCode === state.stateCode ? { ...s, postalCodes: postals } : s
            );
            return { ...c, states: updatedStates, isDirty: true };
          }
          return c;
        })
      );

      // If selectedCountry is the country we just updated, update it too
      if (selectedCountry && selectedCountry.countryCode === countryCode) {
        const updatedStates = (selectedCountry.states || []).map(s =>
          s.stateCode === state.stateCode ? { ...s, postalCodes: postals } : s
        );
        setSelectedCountry(prev => prev ? { ...prev, states: updatedStates, isDirty: true } : null);
      }

      const firstPostal = postals[0] || null;
      setSelectedPostal(firstPostal);
      setPostalCurrentIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value, rowId) => {
    setCountries((prevList) =>
      prevList.map((item) => {
        const itemId = getRowKey(item);
        if (String(itemId) === String(rowId)) {
          return {
            ...item,
            [field]: value,
            isDirty: true
          };
        }
        return item;
      })
    );

    setSelectedCountry((prev) => {
      if (!prev) return prev;
      const currentId = getRowKey(prev);
      if (String(currentId) !== String(rowId)) return prev;
      return { ...prev, [field]: value, isDirty: true };
    });
  };

  const handleFieldChange = (rowId, field, value) => {
    handleInputChange(field, value, rowId);
  };

  const handleAdd = () => {
    const hasUnsavedNew = countries.some((row) => row.isNew);
    if (hasUnsavedNew) {
      toast.warn("Please save the current new entry before adding another.");
      return;
    }
    const newId = `TEMP_${Date.now()}`;
    const newRow = {
      ...initialCountryState,
      tempId: newId,
      uniqueKey: newId,
      isNew: true,
      isDirty: true,
      states: []
    };
    setCountries([newRow, ...countries]);
    setSelectedCountryCodes(new Set([newId]));
    setSelectedCountry(newRow);
    setCurrentIndex(0);

    // Reset children state
    setSelectedState(null);
    setSelectedStateCodes(new Set());
    setSelectedPostal(null);
    setSelectedPostalCodes(new Set());
  };

  const handleSaveAll = async () => {
    let hasChanges = false;
    setLoading(true);
    try {
      // 1. Save Country changes
      const changedCountries = countries.filter(c => c.isNew || c.isDirty);
      for (const country of changedCountries) {
        hasChanges = true;
        const payload = {
          countryCode: country.countryCode,
          countryName: country.countryName,
          changedBy: country.modifiedBy || "Admin"
        };
        if (country.isNew) {
          await axios.post(`${backendUrl}/api/countries`, payload);
        } else {
          await axios.put(`${backendUrl}/api/countries/${country.countryCode}`, payload);
        }
      }

      // 2. Save State changes
      for (const country of countries) {
        const states = country.states || [];
        const changedStates = states.filter(s => (s.isNew || s.isDirty) && s.stateCode);
        for (const state of changedStates) {
          hasChanges = true;
          const payload = {
            stateCode: state.stateCode,
            stateName: state.state,
            countryCode: country.countryCode,
            changedBy: state.changedBy || "Admin"
          };
          if (state.isNew) {
            await axios.post(`${backendUrl}/api/states`, payload);
          } else {
            await axios.put(`${backendUrl}/api/states/${country.countryCode}/${state.stateCode}`, payload);
          }
        }
      }

      // 3. Save Postal Code changes
      for (const country of countries) {
        const states = country.states || [];
        for (const state of states) {
          const postals = state.postalCodes || [];
          const changedPostals = postals.filter(p => (p.isNew || p.isDirty) && p.postalCode);
          for (const pc of changedPostals) {
            hasChanges = true;
            const payload = {
              cityName: pc.city,
              countryCode: country.countryCode,
              stateCode: state.stateCode,
              postalCd: pc.postalCode,
              changedBy: pc.changedBy || "Admin"
            };
            if (pc.isNew) {
              const res = await axios.post(`${backendUrl}/api/postal-codes`, payload);
              pc.postalKey = res.data.postalKey;
            } else {
              await axios.put(`${backendUrl}/api/postal-codes/${pc.postalKey}`, payload);
            }
          }
        }
      }

      if (!hasChanges) {
        toast.info("No changes to save.");
        return;
      }

      useDraftStore.getState().clearDraft("manage-countries");
      toast.success("Changes saved successfully!");
      await fetchCountries();
    } catch (error) {
      console.error("Save error:", error);
      showErrorToast(error, "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedCountryCodes.size === 0) {
      toast.warn("Please select at least one country to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedCountryCodes.size} selected item(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      const idsToDelete = Array.from(selectedCountryCodes);
      for (const id of idsToDelete) {
        const isTemporary = String(id).startsWith("TEMP_");
        if (isTemporary) {
          setCountries((prev) => prev.filter((item) => item.tempId !== id));
        } else {
          const country = countries.find(c => getRowKey(c) === id);
          if (country) {
            await axios.delete(`${backendUrl}/api/countries/${country.countryCode}`);
            setCountries((prev) => prev.filter((item) => item.countryCode !== country.countryCode));
          }
        }
      }
      toast.success("Selection deleted successfully.");
      setSelectedCountryCodes(new Set());
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedStateCodes(new Set());
      setSelectedPostal(null);
      setSelectedPostalCodes(new Set());
    } catch (error) {
      console.error("Delete error:", error);
      showErrorToast(error, "Failed to delete country.");
    } finally {
      setLoading(false);
    }
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
      "country code", "countrycode", "code", "country",
      "country name", "countryname", "name", "desc", "description",
    ];
    const firstLineCells = lines[0]
      .split("\t")
      .map((cell) => cell.replace(/^"|"$/g, "").trim().toLowerCase());
    const isHeaderRow = firstLineCells.some((cell) =>
      headerKeys.some(k => cell === k || cell.includes(k))
    );

    const dataLines = isHeaderRow ? lines.slice(1) : lines;
    if (dataLines.length === 0) {
      return toast.warn("No data rows found to paste.");
    }

    let codeIdx = -1;
    let nameIdx = -1;

    if (isHeaderRow) {
      codeIdx = firstLineCells.findIndex((cell) =>
        ["country code", "countrycode", "code", "country"].some(k => cell === k || cell.includes(k))
      );
      nameIdx = firstLineCells.findIndex((cell) =>
        ["country name", "countryname", "name", "desc", "description"].some(k => cell === k || cell.includes(k))
      );
    } else {
      codeIdx = 0;
      nameIdx = 1;
    }

    const existingCodes = new Set(
      countries
        .filter((r) => !r.tempId && r.countryCode)
        .map((r) => String(r.countryCode).trim().toLowerCase()),
    );

    const pastedRows = [];

    dataLines.forEach((line, i) => {
      const cells = line.split("\t").map(c => c.replace(/^"|"$/g, "").trim());

      const rawCode =
        codeIdx !== -1 && codeIdx < cells.length ? cells[codeIdx] : (cells[0] || "");
      const rawName =
        nameIdx !== -1 && nameIdx < cells.length ? cells[nameIdx] : (cells[1] || "");

      if (!rawCode && !rawName) {
        return;
      }

      const tempIdVal = `TEMP_PASTE_${Date.now()}_${i}_${Math.random()
        .toString(36)
        .substr(2, 5)}`;

      let targetCode = rawCode ? rawCode.toUpperCase().slice(0, 10) : "";
      if (rawCode && existingCodes.has(rawCode.toLowerCase())) {
        targetCode = `${rawCode}-C`;
      }

      pastedRows.push({
        ...initialCountryState,
        countryCode: targetCode,
        countryName: rawName || (rawCode ? `Country ${targetCode}` : ""),
        locale: targetCode,
        iso2Code: targetCode.slice(0, 2),
        iso3Code: targetCode.slice(0, 3),
        tempId: tempIdVal,
        uniqueKey: tempIdVal,
        isNew: true,
        isDirty: true,
        states: [],
      });
    });

    if (pastedRows.length === 0) {
      return toast.warn("No valid rows parsed from clipboard.");
    }

    setCountries((prev) => [...pastedRows, ...prev]);
    setSelectedCountry(pastedRows[0]);
    setSelectedCountryCodes(new Set([pastedRows[0].uniqueKey]));
    setCurrentIndex(0);
    toast.success(`${pastedRows.length} record(s) pasted successfully.`);
  };

  const handleCopy = async () => {
    const rowsToCopy = isFormView
      ? (selectedCountry ? [selectedCountry] : [])
      : (selectedCountryCodes.size > 0
          ? countries.filter((c) => selectedCountryCodes.has(getRowKey(c)))
          : (selectedCountry ? [selectedCountry] : []));

    if (rowsToCopy.length === 0) {
      return toast.warn("Select at least one record to copy.");
    }

    setClipboard([...rowsToCopy]);

    // Format TSV for Excel copy - only Country Code and Country Name
    const header = "Country Code\tCountry Name";
    const tsvLines = rowsToCopy.map((r) => {
      const code = r.countryCode ?? "";
      const name = r.countryName ?? "";
      return `${code}\t${name}`;
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
      if (text && (text.includes("\t") || text.includes("\n") || text.trim())) {
        return processPastedText(text);
      }
    } catch (err) {
      console.warn("navigator.clipboard.readText fallback to internal clipboard", err);
    }

    if (!clipboard || clipboard.length === 0) {
      return toast.warn("Clipboard is empty. Copy a record first.");
    }

    const pasted = clipboard.map((target, idx) => {
      const tempId = `TEMP_PASTE_${Date.now()}_${idx}`;
      return {
        ...target,
        countryCode: target.countryCode ? `${target.countryCode}-C` : "",
        tempId,
        uniqueKey: tempId,
        isNew: true,
        isDirty: true,
        states: (target.states || []).map((s, sIdx) => ({
          ...s,
          tempId: `STATE_${Date.now()}_${sIdx}`,
          uniqueKey: `STATE_${Date.now()}_${sIdx}`,
          isNew: true,
          isDirty: true,
          postalCodes: (s.postalCodes || []).map((p, pidx) => ({
            ...p,
            tempId: `POSTAL_${Date.now()}_${sIdx}_${pidx}`,
            uniqueKey: `POSTAL_${Date.now()}_${sIdx}_${pidx}`,
            isNew: true,
            isDirty: true,
          })),
        })),
      };
    });

    setCountries((prev) => [...pasted, ...prev]);
    setSelectedCountry(pasted[0]);
    setSelectedCountryCodes(new Set([pasted[0].uniqueKey]));
    setCurrentIndex(0);
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

          const lowerText = text.toLowerCase();
          const targetInPostal = e.target.closest && e.target.closest('[data-section="postal"]');
          const targetInState = e.target.closest && e.target.closest('[data-section="state"]');

          if (targetInPostal || (selectedState && (lowerText.startsWith("postal") || lowerText.includes("postal code") || lowerText.includes("city\t") || lowerText.includes("\tcity")))) {
            if (selectedState) {
              return processPostalPastedText(text);
            }
          }

          if (targetInState || (selectedCountry && (lowerText.startsWith("state") || lowerText.includes("state code") || lowerText.includes("state\t") || lowerText.includes("\tstate")))) {
            if (selectedCountry) {
              return processStatePastedText(text);
            }
          }

          processPastedText(text);
        } catch (err) {
          console.error("Ctrl+V readText error:", err);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [countries, clipboard, selectedCountry, selectedState, stateClipboard, postalClipboard]);

  const handleDiscard = () => {
    useDraftStore.getState().clearDraft("manage-countries");
    fetchCountries();
    toast.info("Unsaved changes discarded.");
  };

  const jumpToCode = (code) => {
    if (!code) return;
    const found = countries.find(
      (item) => String(item.countryCode).toLowerCase() === String(code).toLowerCase()
    );

    if (found) {
      setSelectedCountry(found);
      setIsFormView(true);
      const newIdx = countries.indexOf(found);
      setCurrentIndex(newIdx);
      loadCountryDetails(found);
    } else {
      toast.error(`Country "${code}" not found.`);
    }
  };

  const handleNavigate = async (direction) => {
    if (countries.length === 0) return;
    let nextIdx = currentIndex;
    if (direction === "start") nextIdx = 0;
    else if (direction === "prev") nextIdx = Math.max(0, currentIndex - 1);
    else if (direction === "next") nextIdx = Math.min(countries.length - 1, currentIndex + 1);
    else if (direction === "end") nextIdx = countries.length - 1;

    setCurrentIndex(nextIdx);
    const targetRow = countries[nextIdx];
    setSelectedCountry(targetRow);
    setSelectedCountryCodes(new Set([getRowKey(targetRow)]));
    await loadCountryDetails(targetRow);
  };

  const updateSelectedCountry = (updates) => {
    if (!selectedCountry) return;
    const updated = { ...selectedCountry, ...updates, isDirty: true };
    setSelectedCountry(updated);
    setCountries(prevList =>
      prevList.map(c => getRowKey(c) === getRowKey(selectedCountry) ? updated : c)
    );
  };

  const updateSelectedState = (updates) => {
    if (!selectedState) return;
    const updatedState = { ...selectedState, ...updates };
    setSelectedState(updatedState);

    // Find the parent country of this state
    let parentCountry = null;
    for (const c of countries) {
      if ((c.states || []).some(s => getStateKey(s) === getStateKey(selectedState))) {
        parentCountry = c;
        break;
      }
    }
    if (!parentCountry) {
      parentCountry = selectedCountry;
    }
    if (!parentCountry) return;

    // Update parent country states
    const updatedStates = (parentCountry.states || []).map(s =>
      getStateKey(s) === getStateKey(selectedState) ? updatedState : s
    );

    // Update countries list
    setCountries(prevList =>
      prevList.map(c =>
        getRowKey(c) === getRowKey(parentCountry)
          ? { ...c, states: updatedStates, isDirty: true }
          : c
      )
    );

    if (selectedCountry && getRowKey(selectedCountry) === getRowKey(parentCountry)) {
      setSelectedCountry(prev => prev ? { ...prev, states: updatedStates, isDirty: true } : null);
    }
  };

  const handleCountrySelect = async (item) => {
    setSelectedCountry(item);
    const idx = countries.indexOf(item);
    setCurrentIndex(idx);
    await loadCountryDetails(item);
  };

  // --- Level 2 (State) Actions ---
  const handleStateInputChange = (field, value, rowId) => {
    // 1. Find the state in countries list to determine the parent country
    let parentCountry = null;
    let targetState = null;

    for (const c of countries) {
      const found = (c.states || []).find(s => getStateKey(s) === String(rowId));
      if (found) {
        parentCountry = c;
        targetState = found;
        break;
      }
    }

    // Fallback if not found (e.g., when adding a new state and none was selected yet)
    if (!parentCountry) {
      parentCountry = selectedCountry;
      targetState = selectedState;
    }

    if (!parentCountry) return;

    if (!targetState) {
      // Auto-initialize new state
      const tempId = `STATE_${Date.now()}`;
      const newRow = {
        stateCode: field === "stateCode" ? value : "",
        state: field === "state" ? value : "",
        countryCode: field === "countryCode" ? value : (parentCountry.countryCode || ""),
        tempId,
        uniqueKey: tempId,
        isNew: true,
        isDirty: true,
        postalCodes: []
      };
      
      // Update country
      setCountries(prevList =>
        prevList.map(c =>
          getRowKey(c) === getRowKey(parentCountry)
            ? { ...c, states: [newRow, ...(c.states || [])], isDirty: true }
            : c
        )
      );
      if (selectedCountry && getRowKey(selectedCountry) === getRowKey(parentCountry)) {
        setSelectedCountry(prev => prev ? { ...prev, states: [newRow, ...(prev.states || [])], isDirty: true } : null);
      }

      setSelectedState(newRow);
      setSelectedStateCodes(new Set([tempId]));
      setStateCurrentIndex(0);
      return;
    }

    // Update state fields
    const updatedStates = (parentCountry.states || []).map(s => {
      if (getStateKey(s) === String(rowId)) {
        return { ...s, [field]: value, isDirty: true };
      }
      return s;
    });

    // Update countries list
    setCountries(prevList =>
      prevList.map(c =>
        getRowKey(c) === getRowKey(parentCountry)
          ? { ...c, states: updatedStates, isDirty: true }
          : c
      )
    );
    if (selectedCountry && getRowKey(selectedCountry) === getRowKey(parentCountry)) {
      setSelectedCountry(prev => prev ? { ...prev, states: updatedStates, isDirty: true } : null);
    }

    if (selectedState && getStateKey(selectedState) === String(rowId)) {
      setSelectedState({ ...selectedState, [field]: value, isDirty: true });
    }
  };

  // Memoized State & Postal Data
  const visibleStates = useMemo(() => {
    return countries
      .filter(c => selectedCountryCodes.has(getRowKey(c)))
      .flatMap(c => c.states || []);
  }, [countries, selectedCountryCodes]);

  const displayStates = useMemo(() => {
    const base = stateFilteredGroups.length > 0 ? stateFilteredGroups : (
      stateSearchValue.trim() ? visibleStates.filter((s) => {
        const term = stateSearchValue.toLowerCase().trim();
        return (
          String(s.stateCode || "").toLowerCase().includes(term) ||
          String(s.state || "").toLowerCase().includes(term) ||
          String(s.countryCode || "").toLowerCase().includes(term)
        );
      }) : visibleStates
    );
    return base;
  }, [visibleStates, stateFilteredGroups, stateSearchValue]);

  const visiblePostalCodes = useMemo(() => {
    return visibleStates
      .filter(s => selectedStateCodes.has(getStateKey(s)))
      .flatMap(s => s.postalCodes || []);
  }, [visibleStates, selectedStateCodes]);

  const displayPostalCodes = useMemo(() => {
    const base = postalFilteredGroups.length > 0 ? postalFilteredGroups : (
      postalSearchValue.trim() ? visiblePostalCodes.filter((p) => {
        const term = postalSearchValue.toLowerCase().trim();
        return (
          String(p.postalCode || "").toLowerCase().includes(term) ||
          String(p.city || "").toLowerCase().includes(term) ||
          String(p.stateCode || "").toLowerCase().includes(term) ||
          String(p.countryCode || "").toLowerCase().includes(term)
        );
      }) : visiblePostalCodes
    );
    return base;
  }, [visiblePostalCodes, postalFilteredGroups, postalSearchValue]);

  // Global search sync with active record in Form View for State and Postal
  useEffect(() => {
    if (stateSearchValue && displayStates.length > 0) {
      const isCurrentInDisplay = displayStates.some(
        (s) => getStateKey(s) === getStateKey(selectedState),
      );
      if (!isCurrentInDisplay) {
        const first = displayStates[0];
        setSelectedState(first);
        setSelectedStateCodes(new Set([getStateKey(first)]));
        const parentCountryCode = first.countryCode || selectedCountry?.countryCode;
        loadStateDetails(parentCountryCode, first);
      }
    }
  }, [stateSearchValue, displayStates]);

  useEffect(() => {
    if (postalSearchValue && displayPostalCodes.length > 0) {
      const isCurrentInDisplay = displayPostalCodes.some(
        (p) => getPostalKey(p) === getPostalKey(selectedPostal),
      );
      if (!isCurrentInDisplay) {
        const first = displayPostalCodes[0];
        setSelectedPostal(first);
        setSelectedPostalCodes(new Set([getPostalKey(first)]));
      }
    }
  }, [postalSearchValue, displayPostalCodes]);

  const handleStateAdd = () => {
    if (!selectedCountry) return;
    const tempId = `STATE_${Date.now()}`;
    const newRow = {
      stateCode: "",
      state: "",
      countryCode: selectedCountry.countryCode || "",
      tempId,
      uniqueKey: tempId,
      isNew: true,
      isDirty: true,
      postalCodes: []
    };
    const updatedStates = [newRow, ...(selectedCountry.states || [])];
    updateSelectedCountry({ states: updatedStates });
    setSelectedState(newRow);
    setSelectedStateCodes(new Set([tempId]));
    setStateCurrentIndex(0);
  };

  const handleStateCopy = async () => {
    const states = displayStates;
    const rowsToCopy = isStateFormView
      ? (selectedState ? [selectedState] : [])
      : (selectedStateCodes.size > 0
          ? states.filter((s) => selectedStateCodes.has(getStateKey(s)))
          : (selectedState ? [selectedState] : []));

    if (rowsToCopy.length === 0) {
      return toast.warn("Select at least one state record to copy.");
    }

    setStateClipboard([...rowsToCopy]);

    const header = "State Code\tState";
    const tsvLines = rowsToCopy.map((s) => {
      const code = s.stateCode ?? "";
      const name = s.state ?? "";
      return `${code}\t${name}`;
    });
    const tsvContent = [header, ...tsvLines].join("\n");

    try {
      await navigator.clipboard.writeText(tsvContent);
    } catch (clipErr) {
      console.warn("Clipboard writeText not permitted", clipErr);
    }

    toast.success(`${rowsToCopy.length} state record(s) copied to clipboard`);
  };

  const processStatePastedText = (text) => {
    if (!selectedCountry) return toast.warn("Select a country first.");
    if (!text || !text.trim()) return toast.warn("Clipboard is empty.");

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");
    if (lines.length === 0) return toast.warn("No data to paste.");

    const headerKeys = ["state code", "statecode", "state", "statename", "code", "name"];
    const firstLineCells = lines[0].split("\t").map((cell) => cell.replace(/^"|"$/g, "").trim().toLowerCase());
    const isHeaderRow = firstLineCells.some((cell) => ["state code", "statecode", "state", "statename"].includes(cell));

    const dataLines = isHeaderRow ? lines.slice(1) : lines;
    if (dataLines.length === 0) return toast.warn("No data rows found to paste.");

    let stateCodeIdx = -1;
    let stateIdx = -1;

    if (isHeaderRow) {
      stateCodeIdx = firstLineCells.findIndex((c) => ["state code", "statecode", "code"].includes(c));
      stateIdx = firstLineCells.findIndex((c) => ["state", "statename", "name", "description"].includes(c));
    } else {
      stateCodeIdx = 0;
      stateIdx = 1;
    }

    const existingCodes = new Set(
      (selectedCountry.states || []).map((s) => String(s.stateCode || "").trim().toLowerCase())
    );

    const pastedRows = [];
    dataLines.forEach((line, i) => {
      const cells = line.split("\t").map(c => c.replace(/^"|"$/g, "").trim());
      const rawCode = stateCodeIdx !== -1 && stateCodeIdx < cells.length ? cells[stateCodeIdx] : (cells[0] || "");
      const rawState = stateIdx !== -1 && stateIdx < cells.length ? cells[stateIdx] : (cells[1] || "");

      if (!rawCode && !rawState) return;

      let targetCode = rawCode ? rawCode.toUpperCase().slice(0, 10) : "";
      if (rawCode && existingCodes.has(rawCode.toLowerCase())) {
        targetCode = `${rawCode}-C`;
      }

      const tempId = `STATE_PASTE_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`;
      pastedRows.push({
        stateCode: targetCode,
        state: rawState || targetCode,
        countryCode: selectedCountry.countryCode || "",
        tempId,
        uniqueKey: tempId,
        isNew: true,
        isDirty: true,
        postalCodes: []
      });
    });

    if (pastedRows.length === 0) return toast.warn("No valid state rows parsed from clipboard.");

    const updatedStates = [...pastedRows, ...(selectedCountry.states || [])];
    updateSelectedCountry({ states: updatedStates });
    setSelectedState(pastedRows[0]);
    setSelectedStateCodes(new Set([pastedRows[0].tempId]));
    setStateCurrentIndex(0);
    toast.success(`${pastedRows.length} state record(s) pasted successfully.`);
  };

  const handleStatePaste = async () => {
    if (!selectedCountry) return toast.warn("Select a country first.");
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.includes("\t") || text.includes("\n") || text.trim())) {
        return processStatePastedText(text);
      }
    } catch (err) {
      console.warn("navigator.clipboard.readText fallback to internal clipboard", err);
    }

    if (!stateClipboard || stateClipboard.length === 0) {
      return toast.warn("Clipboard is empty. Copy a state record first.");
    }

    const pastedRows = stateClipboard.map((target, i) => {
      const tempId = `STATE_PASTE_${Date.now()}_${i}`;
      return {
        ...target,
        stateCode: target.stateCode ? `${target.stateCode}-C` : "",
        tempId,
        uniqueKey: tempId,
        isNew: true,
        isDirty: true,
        postalCodes: (target.postalCodes || []).map((p, idx) => ({
          ...p,
          tempId: `POSTAL_${Date.now()}_${idx}`,
          uniqueKey: `POSTAL_${Date.now()}_${idx}`,
          isNew: true,
          isDirty: true
        }))
      };
    });

    const updatedStates = [...pastedRows, ...(selectedCountry.states || [])];
    updateSelectedCountry({ states: updatedStates });
    setSelectedState(pastedRows[0]);
    setSelectedStateCodes(new Set([pastedRows[0].tempId]));
    setStateCurrentIndex(0);
    toast.success(`${pastedRows.length} state record(s) pasted successfully.`);
  };

  const handleStateFind = () => {
    if (!stateFindValue.trim()) {
      setStateFilteredGroups([]);
      return toast.info("State search filter cleared.");
    }
    const term = stateFindValue.toLowerCase().trim();
    const matches = (visibleStates || []).filter((row) => {
      if (stateSearchColumn === "stateCode") return String(row.stateCode || "").toLowerCase().includes(term);
      if (stateSearchColumn === "state") return String(row.state || "").toLowerCase().includes(term);
      return (
        String(row.stateCode || "").toLowerCase().includes(term) ||
        String(row.state || "").toLowerCase().includes(term) ||
        String(row.countryCode || "").toLowerCase().includes(term)
      );
    });

    setStateFilteredGroups(matches);
    if (matches.length === 0) {
      toast.warn("No matching state records found.");
    } else {
      setSelectedStateCodes(new Set([getStateKey(matches[0])]));
      setSelectedState(matches[0]);
      toast.success(`Found ${matches.length} matching state record(s).`);
    }
  };

  const handleStateReplaceAll = () => {
    if (stateSearchColumn === "stateCode") {
      return toast.warn("State Code cannot be modified via Replace.");
    }
    if (!stateFindValue.trim()) {
      return toast.warn("Please enter a term to find.");
    }
    const term = stateFindValue.trim();
    let replaceCount = 0;

    const targetList = stateFilteredGroups.length > 0 ? stateFilteredGroups : visibleStates;
    const targetKeys = new Set(targetList.map((r) => getStateKey(r)));

    const updatedStates = (selectedCountry?.states || []).map((row) => {
      if (!targetKeys.has(getStateKey(row))) return row;

      let changed = false;
      const updatedRow = { ...row };

      const fieldsToCheck =
        stateSearchColumn === "all"
          ? ["state"]
          : stateSearchColumn === "stateCode" && row.isNew
          ? ["stateCode"]
          : [stateSearchColumn];

      fieldsToCheck.forEach((colKey) => {
        if (typeof updatedRow[colKey] === "string" && updatedRow[colKey].toLowerCase().includes(term.toLowerCase())) {
          const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          updatedRow[colKey] = updatedRow[colKey].replace(regex, stateReplaceValue);
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
      updateSelectedCountry({ states: updatedStates });
      if (selectedState) {
        const found = updatedStates.find((r) => getStateKey(r) === getStateKey(selectedState));
        if (found) {
          setSelectedState(found);
          setSelectedStateCodes(new Set([getStateKey(found)]));
        }
      }
      if (stateFilteredGroups.length > 0) {
        setStateFilteredGroups(stateFilteredGroups.map(fg => updatedStates.find(u => getStateKey(u) === getStateKey(fg)) || fg));
      }
      toast.success(`Replaced ${replaceCount} occurrence(s).`);
    } else {
      toast.warn("No occurrences found to replace.");
    }
  };

  const handleStateClearFind = () => {
    setStateFindValue("");
    setStateReplaceValue("");
    setStateFilteredGroups([]);
  };

  const handleStateDelete = async () => {
    const states = visibleStates;
    if (states.length === 0 || selectedStateCodes.size === 0) {
      toast.warn("Please select at least one state to delete.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedStateCodes.size} selected state(s)?`)) {
      return;
    }
    setLoading(true);
    try {
      const idsToDelete = Array.from(selectedStateCodes);
      for (const id of idsToDelete) {
        const state = states.find(s => getStateKey(s) === id);
        if (state) {
          if (state.isNew) {
            // just remove locally
          } else {
            const countryCode = state.countryCode || selectedCountry?.countryCode;
            await axios.delete(`${backendUrl}/api/states/${countryCode}/${state.stateCode}`);
          }
        }
      }
      toast.success("States deleted successfully.");
      
      // Update local states lists
      setCountries(prevList =>
        prevList.map(c => {
          const updatedStates = (c.states || []).filter(s => !selectedStateCodes.has(getStateKey(s)));
          return { ...c, states: updatedStates };
        })
      );
      if (selectedCountry) {
        const updatedStates = (selectedCountry.states || []).filter(s => !selectedStateCodes.has(getStateKey(s)));
        setSelectedCountry(prev => prev ? { ...prev, states: updatedStates } : null);
      }

      setSelectedState(null);
      setSelectedStateCodes(new Set());
      setStateCurrentIndex(0);
      setSelectedPostal(null);
      setSelectedPostalCodes(new Set());
    } catch (error) {
      console.error("Delete error:", error);
      showErrorToast(error, "Failed to delete some states.");
    } finally {
      setLoading(false);
    }
  };

  const handleStateNavigate = async (direction) => {
    const states = displayStates;
    if (states.length === 0) return;
    let nextIdx = stateCurrentIndex;
    if (direction === "start") nextIdx = 0;
    else if (direction === "prev") nextIdx = Math.max(0, stateCurrentIndex - 1);
    else if (direction === "next") nextIdx = Math.min(states.length - 1, stateCurrentIndex + 1);
    else if (direction === "end") nextIdx = states.length - 1;

    setStateCurrentIndex(nextIdx);
    const targetRow = states[nextIdx];
    setSelectedState(targetRow);
    setSelectedStateCodes(new Set([getStateKey(targetRow)]));
    const parentCountryCode = targetRow.countryCode || selectedCountry?.countryCode;
    await loadStateDetails(parentCountryCode, targetRow);
  };

  // --- Level 3 (Postal Code) Actions ---
  const handlePostalInputChange = (field, value, rowId) => {
    // 1. Find the parent state and parent country of the postal code
    let parentCountry = null;
    let parentState = null;
    let targetPostal = null;

    for (const c of countries) {
      for (const s of (c.states || [])) {
        const found = (s.postalCodes || []).find(p => getPostalKey(p) === String(rowId));
        if (found) {
          parentCountry = c;
          parentState = s;
          targetPostal = found;
          break;
        }
      }
      if (targetPostal) break;
    }

    // Fallback if not found
    if (!parentState) {
      parentCountry = selectedCountry;
      parentState = selectedState;
      targetPostal = selectedPostal;
    }

    if (!parentState || !parentCountry) return;

    if (!targetPostal) {
      // Auto-initialize new postal code
      const tempId = `POSTAL_${Date.now()}`;
      const newRow = {
        postalCode: field === "postalCode" ? value : "",
        city: field === "city" ? value : "",
        countryCode: field === "countryCode" ? value : (parentCountry.countryCode || ""),
        stateCode: field === "stateCode" ? value : (parentState.stateCode || ""),
        tempId,
        uniqueKey: tempId,
        isNew: true,
        isDirty: true
      };

      const updatedPostals = [newRow, ...(parentState.postalCodes || [])];
      
      // Update state and country
      setCountries(prevList =>
        prevList.map(c => {
          if (getRowKey(c) === getRowKey(parentCountry)) {
            const updatedStates = (c.states || []).map(s =>
              getStateKey(s) === getStateKey(parentState)
                ? { ...s, postalCodes: updatedPostals, isDirty: true }
                : s
            );
            return { ...c, states: updatedStates, isDirty: true };
          }
          return c;
        })
      );

      if (selectedCountry && getRowKey(selectedCountry) === getRowKey(parentCountry)) {
        const updatedStates = (selectedCountry.states || []).map(s =>
          getStateKey(s) === getStateKey(parentState)
            ? { ...s, postalCodes: updatedPostals, isDirty: true }
            : s
        );
        setSelectedCountry(prev => prev ? { ...prev, states: updatedStates, isDirty: true } : null);
      }

      if (selectedState && getStateKey(selectedState) === getStateKey(parentState)) {
        setSelectedState(prev => prev ? { ...prev, postalCodes: updatedPostals, isDirty: true } : null);
      }

      setSelectedPostal(newRow);
      setSelectedPostalCodes(new Set([tempId]));
      setPostalCurrentIndex(0);
      return;
    }

    // Update existing postal code fields
    const updatedPostals = (parentState.postalCodes || []).map(p => {
      if (getPostalKey(p) === String(rowId)) {
        return { ...p, [field]: value, isDirty: true };
      }
      return p;
    });

    // Update countries list
    setCountries(prevList =>
      prevList.map(c => {
        if (getRowKey(c) === getRowKey(parentCountry)) {
          const updatedStates = (c.states || []).map(s =>
            getStateKey(s) === getStateKey(parentState)
              ? { ...s, postalCodes: updatedPostals, isDirty: true }
              : s
          );
          return { ...c, states: updatedStates, isDirty: true };
        }
        return c;
      })
    );

    if (selectedCountry && getRowKey(selectedCountry) === getRowKey(parentCountry)) {
      const updatedStates = (selectedCountry.states || []).map(s =>
        getStateKey(s) === getStateKey(parentState)
          ? { ...s, postalCodes: updatedPostals, isDirty: true }
          : s
      );
      setSelectedCountry(prev => prev ? { ...prev, states: updatedStates, isDirty: true } : null);
    }

    if (selectedState && getStateKey(selectedState) === getStateKey(parentState)) {
      setSelectedState(prev => prev ? { ...prev, postalCodes: updatedPostals, isDirty: true } : null);
    }

    if (selectedPostal && getPostalKey(selectedPostal) === String(rowId)) {
      setSelectedPostal({ ...selectedPostal, [field]: value, isDirty: true });
    }
  };

  const handlePostalAdd = () => {
    if (!selectedState) return;
    const tempId = `POSTAL_${Date.now()}`;
    const newRow = {
      postalCode: "",
      city: "",
      countryCode: selectedCountry?.countryCode || "",
      stateCode: selectedState?.stateCode || "",
      tempId,
      uniqueKey: tempId,
      isNew: true,
      isDirty: true
    };
    const updatedPostals = [newRow, ...(selectedState.postalCodes || [])];
    updateSelectedState({ postalCodes: updatedPostals });
    setSelectedPostal(newRow);
    setSelectedPostalCodes(new Set([tempId]));
    setPostalCurrentIndex(0);
  };

  const handlePostalCopy = async () => {
    const postals = displayPostalCodes;
    const rowsToCopy = isPostalFormView
      ? (selectedPostal ? [selectedPostal] : [])
      : (selectedPostalCodes.size > 0
          ? postals.filter((p) => selectedPostalCodes.has(getPostalKey(p)))
          : (selectedPostal ? [selectedPostal] : []));

    if (rowsToCopy.length === 0) {
      return toast.warn("Select at least one postal code record to copy.");
    }

    setPostalClipboard([...rowsToCopy]);

    const header = "Postal Code\tCity";
    const tsvLines = rowsToCopy.map((p) => {
      const code = p.postalCode ?? "";
      const city = p.city ?? "";
      return `${code}\t${city}`;
    });
    const tsvContent = [header, ...tsvLines].join("\n");

    try {
      await navigator.clipboard.writeText(tsvContent);
    } catch (clipErr) {
      console.warn("Clipboard writeText not permitted", clipErr);
    }

    toast.success(`${rowsToCopy.length} postal code record(s) copied to clipboard`);
  };

  const processPostalPastedText = (text) => {
    if (!selectedState) return toast.warn("Select a state first.");
    if (!text || !text.trim()) return toast.warn("Clipboard is empty.");

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");
    if (lines.length === 0) return toast.warn("No data to paste.");

    const headerKeys = ["postal code", "postalcode", "code", "postal", "city", "city name", "cityname"];
    const firstLineCells = lines[0].split("\t").map((cell) => cell.replace(/^"|"$/g, "").trim().toLowerCase());
    const isHeaderRow = firstLineCells.some((cell) => ["postal code", "postalcode", "postal", "city"].includes(cell));

    const dataLines = isHeaderRow ? lines.slice(1) : lines;
    if (dataLines.length === 0) return toast.warn("No data rows found to paste.");

    let postalCodeIdx = -1;
    let cityIdx = -1;

    if (isHeaderRow) {
      postalCodeIdx = firstLineCells.findIndex((c) => ["postal code", "postalcode", "postal", "code"].includes(c));
      cityIdx = firstLineCells.findIndex((c) => ["city", "city name", "cityname"].includes(c));
    } else {
      postalCodeIdx = 0;
      cityIdx = 1;
    }

    const existingCodes = new Set(
      (selectedState.postalCodes || []).map((p) => String(p.postalCode || "").trim().toLowerCase())
    );

    const pastedRows = [];
    dataLines.forEach((line, i) => {
      const cells = line.split("\t").map(c => c.replace(/^"|"$/g, "").trim());
      const rawPostal = postalCodeIdx !== -1 && postalCodeIdx < cells.length ? cells[postalCodeIdx] : (cells[0] || "");
      const rawCity = cityIdx !== -1 && cityIdx < cells.length ? cells[cityIdx] : (cells[1] || "");

      if (!rawPostal && !rawCity) return;

      let targetCode = rawPostal ? rawPostal.toUpperCase().slice(0, 15) : "";
      if (rawPostal && existingCodes.has(rawPostal.toLowerCase())) {
        targetCode = `${rawPostal}-C`;
      }

      const tempId = `POSTAL_PASTE_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`;
      pastedRows.push({
        postalCode: targetCode,
        city: rawCity,
        stateCode: selectedState.stateCode || "",
        countryCode: selectedCountry?.countryCode || "",
        tempId,
        uniqueKey: tempId,
        isNew: true,
        isDirty: true
      });
    });

    if (pastedRows.length === 0) return toast.warn("No valid postal code rows parsed from clipboard.");

    const updatedPostals = [...pastedRows, ...(selectedState.postalCodes || [])];
    updateSelectedState({ postalCodes: updatedPostals });
    setSelectedPostal(pastedRows[0]);
    setSelectedPostalCodes(new Set([pastedRows[0].tempId]));
    setPostalCurrentIndex(0);
    toast.success(`${pastedRows.length} postal code record(s) pasted successfully.`);
  };

  const handlePostalPaste = async () => {
    if (!selectedState) return toast.warn("Select a state first.");
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.includes("\t") || text.includes("\n") || text.trim())) {
        return processPostalPastedText(text);
      }
    } catch (err) {
      console.warn("navigator.clipboard.readText fallback to internal clipboard", err);
    }

    if (!postalClipboard || postalClipboard.length === 0) {
      return toast.warn("Clipboard is empty. Copy a postal code record first.");
    }

    const pastedRows = postalClipboard.map((target, i) => {
      const tempId = `POSTAL_PASTE_${Date.now()}_${i}`;
      return {
        ...target,
        postalCode: target.postalCode ? `${target.postalCode}-C` : "",
        tempId,
        uniqueKey: tempId,
        isNew: true,
        isDirty: true
      };
    });

    const updatedPostals = [...pastedRows, ...(selectedState.postalCodes || [])];
    updateSelectedState({ postalCodes: updatedPostals });
    setSelectedPostal(pastedRows[0]);
    setSelectedPostalCodes(new Set([pastedRows[0].tempId]));
    setPostalCurrentIndex(0);
    toast.success(`${pastedRows.length} postal code record(s) pasted successfully.`);
  };

  const handlePostalFind = () => {
    if (!postalFindValue.trim()) {
      setPostalFilteredGroups([]);
      return toast.info("Postal code search filter cleared.");
    }
    const term = postalFindValue.toLowerCase().trim();
    const matches = (visiblePostalCodes || []).filter((row) => {
      if (postalSearchColumn === "postalCode") return String(row.postalCode || "").toLowerCase().includes(term);
      if (postalSearchColumn === "city") return String(row.city || "").toLowerCase().includes(term);
      return (
        String(row.postalCode || "").toLowerCase().includes(term) ||
        String(row.city || "").toLowerCase().includes(term) ||
        String(row.stateCode || "").toLowerCase().includes(term) ||
        String(row.countryCode || "").toLowerCase().includes(term)
      );
    });

    setPostalFilteredGroups(matches);
    if (matches.length === 0) {
      toast.warn("No matching postal code records found.");
    } else {
      setSelectedPostalCodes(new Set([getPostalKey(matches[0])]));
      setSelectedPostal(matches[0]);
      toast.success(`Found ${matches.length} matching postal code record(s).`);
    }
  };

  const handlePostalReplaceAll = () => {
    if (postalSearchColumn === "postalCode") {
      return toast.warn("Postal Code cannot be modified via Replace.");
    }
    if (!postalFindValue.trim()) {
      return toast.warn("Please enter a term to find.");
    }
    const term = postalFindValue.trim();
    let replaceCount = 0;

    const targetList = postalFilteredGroups.length > 0 ? postalFilteredGroups : visiblePostalCodes;
    const targetKeys = new Set(targetList.map((r) => getPostalKey(r)));

    const updatedPostals = (selectedState?.postalCodes || []).map((row) => {
      if (!targetKeys.has(getPostalKey(row))) return row;

      let changed = false;
      const updatedRow = { ...row };

      const fieldsToCheck =
        postalSearchColumn === "all"
          ? ["city"]
          : postalSearchColumn === "postalCode" && row.isNew
          ? ["postalCode"]
          : [postalSearchColumn];

      fieldsToCheck.forEach((colKey) => {
        if (typeof updatedRow[colKey] === "string" && updatedRow[colKey].toLowerCase().includes(term.toLowerCase())) {
          const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          updatedRow[colKey] = updatedRow[colKey].replace(regex, postalReplaceValue);
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
      updateSelectedState({ postalCodes: updatedPostals });
      if (selectedPostal) {
        const found = updatedPostals.find((r) => getPostalKey(r) === getPostalKey(selectedPostal));
        if (found) {
          setSelectedPostal(found);
          setSelectedPostalCodes(new Set([getPostalKey(found)]));
        }
      }
      if (postalFilteredGroups.length > 0) {
        setPostalFilteredGroups(postalFilteredGroups.map(fg => updatedPostals.find(u => getPostalKey(u) === getPostalKey(fg)) || fg));
      }
      toast.success(`Replaced ${replaceCount} occurrence(s).`);
    } else {
      toast.warn("No occurrences found to replace.");
    }
  };

  const handlePostalClearFind = () => {
    setPostalFindValue("");
    setPostalReplaceValue("");
    setPostalFilteredGroups([]);
  };

  const handlePostalDelete = async () => {
    const postals = visiblePostalCodes;
    if (postals.length === 0 || selectedPostalCodes.size === 0) {
      toast.warn("Please select at least one postal code to delete.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedPostalCodes.size} selected postal code(s)?`)) {
      return;
    }
    setLoading(true);
    try {
      const idsToDelete = Array.from(selectedPostalCodes);
      for (const id of idsToDelete) {
        const pc = postals.find(p => getPostalKey(p) === id);
        if (pc) {
          if (pc.isNew) {
            // just remove locally
          } else {
            await axios.delete(`${backendUrl}/api/postal-codes/${pc.postalKey}`);
          }
        }
      }
      toast.success("Postal codes deleted successfully.");

      // Update states to remove the deleted postal codes
      setCountries(prevList =>
        prevList.map(c => {
          const updatedStates = (c.states || []).map(s => {
            const updatedPostals = (s.postalCodes || []).filter(p => !selectedPostalCodes.has(getPostalKey(p)));
            return { ...s, postalCodes: updatedPostals };
          });
          return { ...c, states: updatedStates };
        })
      );
      if (selectedCountry) {
        const updatedStates = (selectedCountry.states || []).map(s => {
          const updatedPostals = (s.postalCodes || []).filter(p => !selectedPostalCodes.has(getPostalKey(p)));
          return { ...s, postalCodes: updatedPostals };
        });
        setSelectedCountry(prev => prev ? { ...prev, states: updatedStates } : null);
      }
      if (selectedState) {
        const updatedPostals = (selectedState.postalCodes || []).filter(p => !selectedPostalCodes.has(getPostalKey(p)));
        setSelectedState(prev => prev ? { ...prev, postalCodes: updatedPostals } : null);
      }

      setSelectedPostal(null);
      setSelectedPostalCodes(new Set());
      setPostalCurrentIndex(0);
    } catch (error) {
      console.error("Delete error:", error);
      showErrorToast(error, "Failed to delete some postal codes.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostalNavigate = (direction) => {
    const postals = displayPostalCodes;
    if (postals.length === 0) return;
    let nextIdx = postalCurrentIndex;
    if (direction === "start") nextIdx = 0;
    else if (direction === "prev") nextIdx = Math.max(0, postalCurrentIndex - 1);
    else if (direction === "next") nextIdx = Math.min(postals.length - 1, postalCurrentIndex + 1);
    else if (direction === "end") nextIdx = postals.length - 1;

    setPostalCurrentIndex(nextIdx);
    const targetRow = postals[nextIdx];
    setSelectedPostal(targetRow);
    setSelectedPostalCodes(new Set([getPostalKey(targetRow)]));
  };

  const filteredCountries = countries.filter((c) => {
    const term = searchValue.toLowerCase().trim();
    if (!term) return true;
    return (
      String(c.countryCode).toLowerCase().includes(term) ||
      String(c.countryName).toLowerCase().includes(term)
    );
  });

  return (
    <div className="country-page p-4 space-y-4 font-inter text-[#1f2937]">
      <style>{`
        .country-page { font-size:12px; color:#1f2937; }
        .country-page .voucher-head-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:28px; padding:0 10px; border:1px solid #d5dfeb; border-radius:6px; background:#fff; color:#344a63; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.15s ease; }
        .country-page .voucher-head-btn:hover:not(:disabled) { background:#f5f8fb; border-color:#b9c8d8; }
        .country-page .voucher-head-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .country-page .voucher-primary-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:28px; padding:0 10px; border:1px solid #1677e8; border-radius:6px; background:#1677e8; color:#fff; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.15s ease; }
        .country-page .voucher-primary-btn:hover:not(:disabled) { background:#125bc3; border-color:#125bc3; }
        .country-page .voucher-nav-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border:0; border-right:1px solid #d5dfeb; background:#f5f8fb; color:#718096; cursor:pointer; transition:all 0.15s ease; }
        .country-page .voucher-nav-btn:last-child { border-right:0; }
        .country-page .voucher-nav-btn:hover:not(:disabled) { background:#eaf1f7; color:#17414d; }
        .country-page .voucher-nav-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .country-page .voucher-count { display:inline-flex; align-items:center; justify-content:center; min-width:44px; height:28px; padding:0 6px; background:#fff; color:#17414d; font-size:11px; font-weight:700; }
        .td-input[readonly] {
          background-color: #f8fafc !important; /* bg-slate-50 style */
          color: #94a3b8 !important;            /* text-slate-400 style */
          border-color: #e2e8f0 !important;      /* border-slate-200 style */
          cursor: not-allowed !important;
          pointer-events: none !important;
          user-select: none !important;
        }
        .td-input:focus,
        .td-input:focus-visible,
        .td-input:focus-within,
        .td-input:active {
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }
      `}</style>

      {/* LEVEL 1: COUNTRY */}
      <MainContainer title="Manage Country" icon={ManageCountryIcon}>
        <CountryToolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={displayCountries.length}
          selectedRow={selectedCountry}
          selectedCount={selectedCountryCodes.size}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          clipboard={clipboard}
          onToggleFindReplace={() => setShowFindReplace((prev) => !prev)}
          showFindReplace={showFindReplace}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => {
              if (!isFormView && !selectedCountry && displayCountries.length > 0) {
                const firstRecord = displayCountries[0];
                setSelectedCountry(firstRecord);
                setSelectedCountryCodes(new Set([getRowKey(firstRecord)]));
              }
              setIsFormView(!isFormView);
            }
          }}
          currentIndex={currentIndex}
          onCloseScreen={handleCloseScreen}
        />

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
                  <option value="countryCode">Country Code</option>
                  <option value="countryName">Country Name</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Find..."
                  value={findValue}
                  onChange={(e) => setFindValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFind()}
                  className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1677e8] w-36"
                />
              </div>

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceValue}
                  disabled={searchColumn === "countryCode"}
                  onChange={(e) => setReplaceValue(e.target.value)}
                  className={`px-2.5 py-1 text-[11px] border border-slate-300 rounded font-medium outline-none w-36 ${
                    searchColumn === "countryCode"
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
                disabled={searchColumn === "countryCode"}
                onClick={handleReplaceAll}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                  searchColumn === "countryCode"
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

        <div className="mt-1.5 text-xs">
          {!isFormView ? (
            <div className="bg-white border border-gray-200 p-2">
              <ReusableTable
                data={displayCountries}
                columns={countryColumns}
                selectedRows={displayCountries.filter(c => selectedCountryCodes.has(getRowKey(c)))}
                onSelectAll={(e) => {
                  if (e.target.checked) {
                    const allKeys = filteredCountries.map(getRowKey);
                    setSelectedCountryCodes(new Set(allKeys));
                    
                    // Automatically check all states of all countries
                    const stateKeys = filteredCountries.flatMap(c => (c.states || []).map(getStateKey));
                    setSelectedStateCodes(new Set(stateKeys));

                    // Automatically check all postal codes
                    const postalKeys = filteredCountries.flatMap(c => (c.states || []).flatMap(s => (s.postalCodes || []).map(getPostalKey)));
                    setSelectedPostalCodes(new Set(postalKeys));

                    if (filteredCountries.length > 0) {
                      handleCountrySelect(filteredCountries[0]);
                    }
                  } else {
                    setSelectedCountryCodes(new Set());
                    setSelectedStateCodes(new Set());
                    setSelectedPostalCodes(new Set());
                  }
                }}
                onRowSelect={(item) => {
                  const key = getRowKey(item);
                  const newIds = new Set(selectedCountryCodes);
                  const wasSelected = newIds.has(key);
                  if (wasSelected) {
                    newIds.delete(key);
                  } else {
                    newIds.add(key);
                  }
                  setSelectedCountryCodes(newIds);
                  
                  if (!wasSelected) {
                    handleCountrySelect(item);
                  } else {
                    const countryStates = item.states || [];
                    setSelectedStateCodes(prev => {
                      const next = new Set(prev);
                      countryStates.forEach(s => next.delete(getStateKey(s)));
                      return next;
                    });
                    setSelectedPostalCodes(prev => {
                      const next = new Set(prev);
                      countryStates.forEach(s => {
                        (s.postalCodes || []).forEach(p => next.delete(getPostalKey(p)));
                      });
                      return next;
                    });

                    if (selectedCountry && getRowKey(selectedCountry) === key) {
                      if (newIds.size > 0) {
                        const nextKey = Array.from(newIds)[newIds.size - 1];
                        const nextCountry = countries.find(c => getRowKey(c) === nextKey);
                        if (nextCountry) {
                          handleCountrySelect(nextCountry);
                        }
                      }
                    }
                  }
                }}
                onFieldChange={handleFieldChange}
                rowKey="uniqueKey"
              />
            </div>
          ) : (
            <div>
              <FormSection title="Country Details">
                <div className="flex flex-wrap items-start gap-4">
                  <FormInput
                    label="Country Code"
                    required
                    readOnly={!selectedCountry?.isNew}
                    value={selectedCountry?.countryCode || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "countryCode",
                        e.target.value.toUpperCase().slice(0, 10),
                        getRowKey(selectedCountry)
                      )
                    }
                    className="w-full sm:w-[200px]"
                  />
                  <FormInput
                    label="Country Name"
                    required
                    value={selectedCountry?.countryName || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "countryName",
                        e.target.value,
                        getRowKey(selectedCountry)
                      )
                    }
                    className="w-full sm:w-[360px]"
                  />
                </div>
              </FormSection>
            </div>
          )}
        </div>
      </MainContainer>

      {/* LEVEL 2: MANAGE STATE */}
      {selectedCountry && (
        <div data-section="state">
        <SecondaryContainer
          title="Manage State"
          className="mt-3 shadow-sm bg-white border border-slate-200/80 rounded-xl"
        >
          <CountryToolbar
            isFormView={isStateFormView}
            handleNavigate={handleStateNavigate}
            totalRecords={selectedCountryCodes.size > 0 ? displayStates.length : 0}
            selectedRow={selectedCountryCodes.size > 0 ? selectedState : null}
            selectedCount={selectedStateCodes.size}
            searchValue={stateSearchValue}
            setSearchValue={setStateSearchValue}
            loading={loading || selectedCountryCodes.size === 0}
            clipboard={stateClipboard}
            onToggleFindReplace={() => setShowStateFindReplace((prev) => !prev)}
            showFindReplace={showStateFindReplace}
            actions={{
              onAdd: handleStateAdd,
              onSave: handleSaveAll,
              onDelete: handleStateDelete,
              onCopy: handleStateCopy,
              onClear: handleDiscard,
              onPaste: handleStatePaste,
              onToggleView: () => {
                const states = displayStates;
                if (!isStateFormView && !selectedState && states.length > 0) {
                  const firstRecord = states[0];
                  setSelectedState(firstRecord);
                  setSelectedStateCodes(new Set([getStateKey(firstRecord)]));
                }
                setIsStateFormView(!isStateFormView);
              }
            }}
            currentIndex={selectedCountryCodes.size > 0 ? stateCurrentIndex : 0}
            buttonsDisable={["save"]}
          />

          {/* State Find & Replace Bar */}
          {showStateFindReplace && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2.5 animate-in slide-in-from-top-1 duration-150 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-600">In:</span>
                  <select
                    value={stateSearchColumn}
                    onChange={(e) => setStateSearchColumn(e.target.value)}
                    className="px-2 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-700 outline-none focus:border-[#1677e8]"
                  >
                    <option value="all">All Columns</option>
                    <option value="stateCode">State Code</option>
                    <option value="state">State</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Find..."
                    value={stateFindValue}
                    onChange={(e) => setStateFindValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStateFind()}
                    className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1677e8] w-36"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Replace with..."
                    value={stateReplaceValue}
                    disabled={stateSearchColumn === "stateCode"}
                    onChange={(e) => setStateReplaceValue(e.target.value)}
                    className={`px-2.5 py-1 text-[11px] border border-slate-300 rounded font-medium outline-none w-36 ${
                      stateSearchColumn === "stateCode"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed placeholder:text-slate-300"
                        : "bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#1677e8]"
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleStateFind}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#1677e8] bg-blue-50 hover:bg-blue-100 border border-[#1677e8]/30 rounded cursor-pointer transition-colors"
                >
                  Find / Filter
                </button>

                <button
                  type="button"
                  disabled={stateSearchColumn === "stateCode"}
                  onClick={handleStateReplaceAll}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                    stateSearchColumn === "stateCode"
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "text-white bg-[#1677e8] hover:bg-[#125bc3] cursor-pointer"
                  }`}
                >
                  Replace All
                </button>

                <button
                  type="button"
                  onClick={handleStateClearFind}
                  className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200 rounded cursor-pointer transition-colors"
                >
                  Reset
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowStateFindReplace(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="mt-1.5 text-xs">
            {!isStateFormView ? (
              <div className="bg-white border border-gray-200 p-2">
                <ReusableTable
                  data={selectedCountryCodes.size > 0 ? displayStates : []}
                  columns={stateColumns}
                  selectedRows={displayStates.filter(s => selectedStateCodes.has(getStateKey(s)))}
                  onSelectAll={(e) => {
                    if (e.target.checked) {
                      setSelectedStateCodes(new Set(displayStates.map(getStateKey)));
                      if (displayStates.length > 0) {
                        const firstState = displayStates[0];
                        setSelectedState(firstState);
                        const parentCountryCode = firstState.countryCode || selectedCountry?.countryCode;
                        loadStateDetails(parentCountryCode, firstState);
                      }
                    } else {
                      setSelectedStateCodes(new Set());
                    }
                  }}
                  onRowSelect={(item) => {
                    const key = getStateKey(item);
                    const newIds = new Set(selectedStateCodes);
                    const wasSelected = newIds.has(key);
                    if (wasSelected) {
                      newIds.delete(key);
                    } else {
                      newIds.add(key);
                    }
                    setSelectedStateCodes(newIds);
                    if (!wasSelected) {
                      setSelectedState(item);
                      const parentCountryCode = item.countryCode || selectedCountry?.countryCode;
                      const idx = (displayStates || []).findIndex(s => getStateKey(s) === key);
                      setStateCurrentIndex(idx >= 0 ? idx : 0);
                      
                      if (!item.postalCodes || item.postalCodes.length === 0) {
                        loadStateDetails(parentCountryCode, item);
                      } else {
                        const firstPostal = item.postalCodes[0] || null;
                        setSelectedPostal(firstPostal);
                        setPostalCurrentIndex(0);
                      }
                    } else {
                      setSelectedPostalCodes(prev => {
                        const next = new Set(prev);
                        (item.postalCodes || []).forEach(p => next.delete(getPostalKey(p)));
                        return next;
                      });
                      
                      if (selectedState && getStateKey(selectedState) === key) {
                        if (newIds.size > 0) {
                          const nextKey = Array.from(newIds)[newIds.size - 1];
                          const nextState = displayStates.find(s => getStateKey(s) === nextKey);
                          if (nextState) {
                            setSelectedState(nextState);
                            const parentCountryCode = nextState.countryCode || selectedCountry?.countryCode;
                            const idx = (displayStates || []).findIndex(s => getStateKey(s) === nextKey);
                            setStateCurrentIndex(idx >= 0 ? idx : 0);
                            loadStateDetails(parentCountryCode, nextState);
                          }
                        }
                      }
                    }
                  }}
                  onFieldChange={(rowId, field, value) => handleStateInputChange(field, value, rowId)}
                  rowKey="uniqueKey"
                  renderEmptyState={() => (
                    <div className="text-center text-gray-400 text-[11px] py-4 italic">
                      {selectedCountryCodes.size > 0 ? "No states available." : "No Country Selected"}
                    </div>
                  )}
                />
              </div>
            ) : (
              <div>
                <FormSection title="State Details">
                  <div className="flex flex-wrap items-start gap-4">
                    <FormInput
                      label="State Code"
                      required
                      readOnly={!selectedState?.isNew}
                      value={selectedState?.stateCode || ""}
                      onChange={(e) =>
                        handleStateInputChange(
                          "stateCode",
                          e.target.value.toUpperCase().slice(0, 10),
                          getStateKey(selectedState)
                        )
                      }
                      className="w-full sm:w-[200px]"
                    />
                    <FormInput
                      label="State"
                      required
                      value={selectedState?.state || ""}
                      onChange={(e) =>
                        handleStateInputChange(
                          "state",
                          e.target.value,
                          getStateKey(selectedState)
                        )
                      }
                      className="w-full sm:w-[360px]"
                    />
                  </div>
                </FormSection>
              </div>
            )}
          </div>
        </SecondaryContainer>
        </div>
      )}

      {/* LEVEL 3: POSTAL CODE */}
      {selectedState && (
        <div data-section="postal">
        <SecondaryContainer
          title="Postal Code"
          className="mt-3 shadow-sm bg-white border border-slate-200/80 rounded-xl"
        >
          <CountryToolbar
            isFormView={isPostalFormView}
            handleNavigate={handlePostalNavigate}
            totalRecords={selectedStateCodes.size > 0 ? displayPostalCodes.length : 0}
            selectedRow={selectedStateCodes.size > 0 ? selectedPostal : null}
            selectedCount={selectedPostalCodes.size}
            searchValue={postalSearchValue}
            setSearchValue={setPostalSearchValue}
            loading={loading || selectedStateCodes.size === 0}
            clipboard={postalClipboard}
            onToggleFindReplace={() => setShowPostalFindReplace((prev) => !prev)}
            showFindReplace={showPostalFindReplace}
            actions={{
              onAdd: handlePostalAdd,
              onSave: handleSaveAll,
              onDelete: handlePostalDelete,
              onCopy: handlePostalCopy,
              onClear: handleDiscard,
              onPaste: handlePostalPaste,
              onToggleView: () => {
                const postals = displayPostalCodes;
                if (!isPostalFormView && !selectedPostal && postals.length > 0) {
                  const firstRecord = postals[0];
                  setSelectedPostal(firstRecord);
                  setSelectedPostalCodes(new Set([getPostalKey(firstRecord)]));
                }
                setIsPostalFormView(!isPostalFormView);
              }
            }}
            currentIndex={selectedStateCodes.size > 0 ? postalCurrentIndex : 0}
            buttonsDisable={["save"]}
          />

          {/* Postal Find & Replace Bar */}
          {showPostalFindReplace && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2.5 animate-in slide-in-from-top-1 duration-150 mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-600">In:</span>
                  <select
                    value={postalSearchColumn}
                    onChange={(e) => setPostalSearchColumn(e.target.value)}
                    className="px-2 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-700 outline-none focus:border-[#1677e8]"
                  >
                    <option value="all">All Columns</option>
                    <option value="postalCode">Postal Code</option>
                    <option value="city">City</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Find..."
                    value={postalFindValue}
                    onChange={(e) => setPostalFindValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePostalFind()}
                    className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#1677e8] w-36"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Replace with..."
                    value={postalReplaceValue}
                    disabled={postalSearchColumn === "postalCode"}
                    onChange={(e) => setPostalReplaceValue(e.target.value)}
                    className={`px-2.5 py-1 text-[11px] border border-slate-300 rounded font-medium outline-none w-36 ${
                      postalSearchColumn === "postalCode"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed placeholder:text-slate-300"
                        : "bg-white text-slate-800 placeholder:text-slate-400 focus:border-[#1677e8]"
                    }`}
                  />
                </div>

                <button
                  type="button"
                  onClick={handlePostalFind}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#1677e8] bg-blue-50 hover:bg-blue-100 border border-[#1677e8]/30 rounded cursor-pointer transition-colors"
                >
                  Find / Filter
                </button>

                <button
                  type="button"
                  disabled={postalSearchColumn === "postalCode"}
                  onClick={handlePostalReplaceAll}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                    postalSearchColumn === "postalCode"
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "text-white bg-[#1677e8] hover:bg-[#125bc3] cursor-pointer"
                  }`}
                >
                  Replace All
                </button>

                <button
                  type="button"
                  onClick={handlePostalClearFind}
                  className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/70 border border-slate-200 rounded cursor-pointer transition-colors"
                >
                  Reset
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowPostalFindReplace(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="mt-1.5 text-xs">
            {!isPostalFormView ? (
              <div className="bg-white border border-gray-200 p-2">
                <ReusableTable
                  data={selectedStateCodes.size > 0 ? displayPostalCodes : []}
                  columns={postalColumns}
                  selectedRows={displayPostalCodes.filter(p => selectedPostalCodes.has(getPostalKey(p)))}
                  onSelectAll={(e) => {
                    if (e.target.checked) {
                      setSelectedPostalCodes(new Set(displayPostalCodes.map(getPostalKey)));
                      if (displayPostalCodes.length > 0) {
                        setSelectedPostal(displayPostalCodes[0]);
                      }
                    } else {
                      setSelectedPostalCodes(new Set());
                      setSelectedPostal(null);
                    }
                  }}
                  onRowSelect={(item) => {
                    const key = getPostalKey(item);
                    const newIds = new Set(selectedPostalCodes);
                    const wasSelected = newIds.has(key);
                    if (wasSelected) {
                      newIds.delete(key);
                    } else {
                      newIds.add(key);
                    }
                    setSelectedPostalCodes(newIds);
                    if (!wasSelected) {
                      setSelectedPostal(item);
                      const idx = (displayPostalCodes || []).findIndex(p => getPostalKey(p) === key);
                      setPostalCurrentIndex(idx >= 0 ? idx : 0);
                    } else {
                      if (selectedPostal && getPostalKey(selectedPostal) === key) {
                        if (newIds.size > 0) {
                          const nextKey = Array.from(newIds)[newIds.size - 1];
                          const nextPostal = displayPostalCodes.find(p => getPostalKey(p) === nextKey);
                          if (nextPostal) {
                            setSelectedPostal(nextPostal);
                            const idx = (displayPostalCodes || []).findIndex(p => getPostalKey(p) === nextKey);
                            setPostalCurrentIndex(idx >= 0 ? idx : 0);
                          } else {
                            setSelectedPostal(null);
                          }
                        } else {
                          setSelectedPostal(null);
                        }
                      } else {
                        if (newIds.size === 0) {
                          setSelectedPostal(null);
                        }
                      }
                    }
                  }}
                  onFieldChange={(rowId, field, value) => handlePostalInputChange(field, value, rowId)}
                  rowKey="uniqueKey"
                  renderEmptyState={() => (
                    <div className="text-center text-gray-400 text-[11px] py-4 italic">
                      {selectedStateCodes.size > 0 ? "No postal codes available." : "No State Selected"}
                    </div>
                  )}
                />
              </div>
            ) : (
              <div>
                <FormSection title="Postal Code Details">
                  <div className="flex flex-wrap items-start gap-4">
                    <FormInput
                      label="Postal Code"
                      required
                      readOnly={!selectedPostal?.isNew}
                      value={selectedPostal?.postalCode || ""}
                      onChange={(e) =>
                        handlePostalInputChange(
                          "postalCode",
                          e.target.value.toUpperCase(),
                          getPostalKey(selectedPostal)
                        )
                      }
                      className="w-full sm:w-[200px]"
                    />
                    <FormInput
                      label="City"
                      value={selectedPostal?.city || ""}
                      onChange={(e) =>
                        handlePostalInputChange(
                          "city",
                          e.target.value,
                          getPostalKey(selectedPostal)
                        )
                      }
                      className="w-full sm:w-[360px]"
                    />
                  </div>
                </FormSection>
              </div>
            )}
          </div>
        </SecondaryContainer>
        </div>
      )}
    </div>
  );
};

export default ManageCountry;
