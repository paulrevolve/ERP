import React, { useEffect, useState, useMemo, useRef } from "react";
import { backendUrl } from "./config";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Search,
  ChevronDown,
  Plus,
  Copy,
  ClipboardPaste,
  Trash2,
  X,
  Save,
  LayoutGrid,
  FileText,
  Receipt,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Replace,
} from "lucide-react";
import { MainContainer, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import { useDraftStore } from "../store/useDraftStore";

const ManageSalesTaxIcon = () => (
  <div className="p-1 bg-[#f0f4f9] border border-[#d5dfeb] rounded-md shadow-2xs -mr-2 flex items-center justify-center">
    <Receipt size={16} className="text-[#344a63]" />
  </div>
);

const SalesTaxToolbar = ({
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
}) => {
  const { onAdd, onCopy, onPaste, onClear, onDelete, onSave, onToggleView } = actions;
  const hasSelection = isFormView ? (!!selectedRow && totalRecords > 0) : (selectedCount > 0);
  const isCopyDisabled = loading || !hasSelection;
  const isDeleteDisabled = loading || !hasSelection;
  const isPasteDisabled = loading || !clipboard || clipboard.length === 0;

  return (
    <div className="flex items-center justify-between gap-2 pb-2 px-2 flex-wrap">
      {/* LEFT SECTION: Search & Navigation */}
      <div className="flex items-center gap-3">
        {setSearchValue && (
          <div className="relative group">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#1677e8] transition-colors"
              size={14}
              onClick={() => {
                if (searchValue && jumpToCode) {
                  jumpToCode(searchValue);
                  setSearchValue("");
                }
              }}
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-2.5 h-8 w-40 text-[11px] bg-[#f6f6f6] border border-[#d5dfeb] rounded-md outline-none text-[#3c4043] placeholder:text-gray-400 focus:bg-white focus:border-[#1677e8] transition-all"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && jumpToCode) {
                  jumpToCode(searchValue);
                  setSearchValue("");
                }
              }}
            />
          </div>
        )}

        {isFormView && handleNavigate && (
          <div className="flex items-center rounded-md border border-[#d5dfeb] bg-[#f5f8fb] overflow-hidden">
            {/* First */}
            <button
              type="button"
              className="voucher-nav-btn"
              title="First record"
              disabled={currentIndex <= 0 || loading}
              onClick={() => handleNavigate("start")}
            >
              <ChevronsLeft size={16} strokeWidth={1.5} />
            </button>

            {/* Previous */}
            <button
              type="button"
              className="voucher-nav-btn"
              title="Previous record"
              disabled={currentIndex <= 0 || loading}
              onClick={() => handleNavigate("prev")}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            {/* Count */}
            <span className="voucher-count">
              {totalRecords > 0 ? currentIndex + 1 : 0} / {totalRecords}
            </span>

            {/* Next */}
            <button
              type="button"
              className="voucher-nav-btn"
              title="Next record"
              disabled={currentIndex >= totalRecords - 1 || loading}
              onClick={() => handleNavigate("next")}
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>

            {/* Last */}
            <button
              type="button"
              className="voucher-nav-btn"
              title="Last record"
              disabled={currentIndex >= totalRecords - 1 || loading}
              onClick={() => handleNavigate("end")}
            >
              <ChevronsRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SECTION: Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {!buttonsDisable.includes("add") && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            disabled={loading}
            className="voucher-primary-btn"
          >
            <Plus size={14} /> Create
          </button>
        )}

        {!buttonsDisable.includes("copy") && onCopy && (
          <button
            type="button"
            onClick={onCopy}
            disabled={isCopyDisabled}
            className="voucher-head-btn"
          >
            <Copy size={14} /> Copy
          </button>
        )}

        {!buttonsDisable.includes("paste") && onPaste && (
          <button
            type="button"
            onClick={onPaste}
            disabled={isPasteDisabled}
            className="voucher-head-btn"
          >
            <ClipboardPaste size={14} /> Paste
          </button>
        )}

        {!buttonsDisable.includes("delete") && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleteDisabled}
            className="voucher-head-btn"
          >
            <Trash2 size={14} /> Delete
          </button>
        )}

        {onToggleFindReplace && (
          <button
            type="button"
            onClick={onToggleFindReplace}
            className={`voucher-head-btn ${showFindReplace ? "bg-slate-100 border-[#1677e8] text-[#1677e8]" : ""}`}
            title="Find & Replace"
          >
            <Replace size={14} /> Find/Replace
          </button>
        )}

        {!buttonsDisable.includes("discard") && onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="voucher-head-btn"
          >
            Cancel
          </button>
        )}

        {!buttonsDisable.includes("save") && onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="voucher-head-btn"
          >
            <Save size={14} /> Save
          </button>
        )}

        {!buttonsDisable.includes("tableform") && onToggleView && (
          <button
            type="button"
            onClick={onToggleView}
            disabled={loading}
            className="relative flex h-[30px] w-[82px] items-center rounded-full border border-[#d5dfeb] bg-[#f5f8fb] p-[3px] transition-all duration-200 disabled:opacity-50"
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
        )}
      </div>
    </div>
  );
};

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

const SearchableCombobox = ({
  label,
  required,
  value,
  onChange,
  onSelect,
  options = [],
  placeholder = "Select...",
  readOnly = false,
  disabled = false,
  className = "",
  labelClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = React.useRef(null);

  const formattedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return {
        value: String(opt.value ?? opt.code ?? ""),
        label: String(opt.label ?? opt.name ?? opt.value ?? ""),
        subLabel: opt.subLabel ? String(opt.subLabel) : "",
        data: opt.data ?? opt,
      };
    }
    return { value: String(opt), label: String(opt), subLabel: "", data: opt };
  });

  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = formattedOptions.filter((opt) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      opt.value.toLowerCase().includes(q) ||
      opt.label.toLowerCase().includes(q) ||
      opt.subLabel.toLowerCase().includes(q)
    );
  });

  const handleSelectOption = (opt) => {
    setQuery(opt.value);
    setIsOpen(false);
    if (onChange) onChange(opt.value);
    if (onSelect) onSelect(opt);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!isOpen) setIsOpen(true);
    if (onChange) onChange(val);

    const match = formattedOptions.find(o => o.value.toLowerCase() === val.trim().toLowerCase());
    if (match && onSelect) {
      onSelect(match);
    }
  };

  return (
    <div ref={containerRef} className={`flex flex-col gap-1 w-full min-w-0 relative ${className}`}>
      {label && (
        <span className={`text-xs font-semibold text-slate-700 select-none ${labelClassName}`}>
          {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
        </span>
      )}
      <div className="relative w-full flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => !disabled && !readOnly && setIsOpen(true)}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full h-[32px] text-[11px] font-medium px-2.5 pr-7 py-1 rounded transition-all outline-none border ${
            readOnly || disabled
              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          }`}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled || readOnly}
          onClick={() => !disabled && !readOnly && setIsOpen((prev) => !prev)}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-40 cursor-pointer"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      {isOpen && !readOnly && !disabled && (
        <div className="absolute top-full left-0 min-w-full w-max max-w-sm z-50 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg text-[11px]">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <div
                key={`${opt.value}_${idx}`}
                onClick={() => handleSelectOption(opt)}
                className={`px-2.5 py-1.5 hover:bg-[#f5f8fb] cursor-pointer flex justify-between items-center whitespace-nowrap ${
                  String(opt.value) === String(value) ? "bg-[#e8f0fe] font-bold text-[#1677e8]" : "text-[#3c4043]"
                }`}
              >
                <span>{opt.label}</span>
                {opt.subLabel && opt.subLabel !== opt.label && (
                  <span className="text-[10px] text-slate-400 ml-2">{opt.subLabel}</span>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 italic text-[11px]">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

const initialMockSalesTaxes = [];

export const ManageSalesTaxes = () => {
  const [salesTaxes, setSalesTaxes] = useState([]);
  const [allSalesTaxes, setAllSalesTaxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedTaxCodes, setSelectedTaxCodes] = useState(new Set());
  const [selectedTax, setSelectedTax] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [clipboard, setClipboard] = useState([]);

  // Sorting & Find/Replace State
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchColumn, setSearchColumn] = useState("all");
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);

  const handleColumnSort = (columnKey) => {
    if (sortColumn === columnKey) {
      if (sortDirection === "asc") setSortDirection("desc");
      else {
        setSortColumn(null);
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (columnKey, label) => {
    const isSorted = sortColumn === columnKey;
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          handleColumnSort(columnKey);
        }}
        className="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 select-none group ml-1"
        title={`Sort by ${label}`}
      >
        {isSorted ? (
          sortDirection === "asc" ? (
            <ArrowUp size={13} className="text-blue-600 font-bold" />
          ) : (
            <ArrowDown size={13} className="text-blue-600 font-bold" />
          )
        ) : (
          <ArrowUpDown size={13} className="text-gray-400 group-hover:text-blue-600 opacity-60 group-hover:opacity-100" />
        )}
      </span>
    );
  };

  // Level 2 Accounts Variables
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAccountKeys, setSelectedAccountKeys] = useState(new Set());
  const [isAccountFormView, setIsAccountFormView] = useState(true);
  const [accountSearchValue, setAccountSearchValue] = useState("");
  const [accountCurrentIndex, setAccountCurrentIndex] = useState(0);
  const [accountClipboard, setAccountClipboard] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState("Sales Tax Account"); // "Sales Tax Account" | "Recoverable Accounts"

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const [validMappings, setValidMappings] = useState([]);
  const [accountsMaster, setAccountsMaster] = useState([]);
  const [organizationsMaster, setOrganizationsMaster] = useState([]);
  const [statesMaster, setStatesMaster] = useState([]);
  const [countriesMaster, setCountriesMaster] = useState([]);

  const resolveCountryName = (stateObj) => {
    if (!stateObj) return "";
    if (stateObj.countryName && String(stateObj.countryName).trim() !== "") {
      return String(stateObj.countryName).trim();
    }
    const cCode = String(stateObj.countryCode || "").trim().toUpperCase();
    const matched = countriesMaster.find((c) => String(c.countryCode || "").trim().toUpperCase() === cCode);
    if (matched && matched.countryName) return matched.countryName;
    if (cCode === "IND") return "India";
    if (cCode === "USA") return "United States";
    if (cCode === "GBR") return "United Kingdom";
    if (cCode === "CAN") return "Canada";
    return cCode;
  };

  const stateOptions = statesMaster.map((s) => ({
    value: s.stateCode,
    label: `${s.stateCode} - ${s.stateName}`,
    subLabel: s.countryName ? `${s.countryCode} (${s.countryName})` : s.countryCode,
    data: s,
  }));

  const uniqueCountriesMap = new Map();
  countriesMaster.forEach((c) => {
    const code = String(c.countryCode || "").trim().toUpperCase();
    if (code && !uniqueCountriesMap.has(code)) {
      uniqueCountriesMap.set(code, c.countryName || code);
    }
  });
  statesMaster.forEach((s) => {
    const code = String(s.countryCode || "").trim().toUpperCase();
    if (code && !uniqueCountriesMap.has(code)) {
      const resName = resolveCountryName(s);
      uniqueCountriesMap.set(code, resName || code);
    }
  });

  const countryOptions = Array.from(uniqueCountriesMap.entries()).map(([code, name]) => {
    const cleanName = (name && String(name).trim().toUpperCase() !== code) ? name : (code === "IND" ? "India" : code === "USA" ? "United States" : name);
    const displayLabel = cleanName && cleanName.toUpperCase() !== code ? `${code} - ${cleanName}` : code;
    return {
      value: code,
      label: displayLabel,
      subLabel: cleanName,
      data: { countryCode: code, countryName: cleanName },
    };
  });

  const allAccountOptions = accountsMaster.map((a) => {
    const id = a.acctId || a.acct_id || a.account || "";
    const name = a.acctName || a.acct_name || a.accountDesc || "";
    return {
      value: id,
      label: name ? `${id} - ${name}` : id,
      subLabel: name,
      data: a,
    };
  });

  const allOrgOptions = organizationsMaster.map((o) => {
    const id = o.orgId || o.org_id || o.organization || "";
    const name = o.orgName || o.org_name || o.orgDesc || "";
    return {
      value: id,
      label: name ? `${id} - ${name}` : id,
      subLabel: name,
      data: o,
    };
  });

  const initialTaxState = {
    companyId: companyId,
    taxCode: "",
    description: "",
    stateProvince: "",
    stateName: "",
    country: "",
    countryName: "",
    requiresVatInfo: false,
    compositeTaxRate: "0.00",
    recoveryPercent: "100.00",
    recoveryPercentOverride: "0.00",
    exempt: false,
    certificateNo: "",
    modifiedBy: user.name || "Admin",
    accounts: []
  };

  const initialAccountState = {
    companyId: companyId,
    account: "",
    accountDesc: "",
    organization: "",
    orgDesc: "",
    taxRate: "0.00",
    taxType: "SALES/USE",
    refNo1: "",
    refNo1Desc: "",
    refNo2: "",
    refNo2Desc: "",
    effectiveTaxRate: "0.00",
    recoverable: "N",
    compoundTax: false,
    recAccount: "",
    recAccountDesc: "",
    recOrg: "",
    recOrgDesc: "",
    recRefNo1: "",
    recRefNo1Desc: "",
    recRefNo2: "",
    recRefNo2Desc: "",
    suspenseAccount: "",
    suspenseAccountDesc: "",
    suspenseOrg: "",
    suspenseOrgDesc: "",
    suspenseRefNo1: "",
    suspenseRefNo1Desc: "",
    suspenseRefNo2: "",
    suspenseRefNo2Desc: "",
  };

  const getTaxKey = (row) => row ? String(row.uniqueKey || row.tempId || row.taxCode || "") : "";
  const getAccountKey = (row) => row ? String(row.uniqueKey || row.tempId || row.taxAcctId || row.accountKey || (row.account && row.organization ? `${row.taxCode || ""}_${row.companyId || ""}_${row.account}_${row.organization}` : "")) : "";

  // Column definitions for the tables
  const taxColumns = [
    { id: "taxCode", key: "taxCode", label: "Tax Code", required: true, type: "text", readOnlyIfExisting: true, sortIcon: renderSortIcon("taxCode", "Tax Code"), width: "120px" },
    { id: "description", key: "description", label: "Description", required: true, type: "text", readOnlyIfExisting: true, sortIcon: renderSortIcon("description", "Description"), width: "200px" },
    { 
      id: "stateProvince", 
      key: "stateProvince", 
      label: "State/Province", 
      required: true, 
      type: "search-select",
      readOnlyIfExisting: true,
      displayKey: "label",
      secondaryKey: "subLabel",
      options: stateOptions,
      onSelect: (opt, rowId) => handleStateSelectTable(opt, rowId),
      width: "180px"
    },
    { id: "stateName", key: "stateName", label: "State Name", required: true, type: "text", readOnly: true, width: "160px" },
    { 
      id: "country", 
      key: "country", 
      label: "Country", 
      required: true, 
      type: "search-select",
      readOnlyIfExisting: true,
      displayKey: "label",
      secondaryKey: "subLabel",
      options: countryOptions,
      onSelect: (opt, rowId) => handleCountrySelectTable(opt, rowId),
      width: "180px"
    },
    { id: "countryName", key: "countryName", label: "Country Name", required: true, type: "text", readOnly: true, width: "160px" },
    { id: "requiresVatInfo", key: "requiresVatInfo", label: "Requires VAT/Customs Info", type: "checkbox", width: "170px" },
    { id: "compositeTaxRate", key: "compositeTaxRate", label: "Composite Tax Rate", type: "text", width: "140px" },
    { id: "recoveryPercent", key: "recoveryPercent", label: "Recovery Percent", type: "text", width: "140px" },
    { id: "recoveryPercentOverride", key: "recoveryPercentOverride", label: "Recovery Percent Override", type: "text", width: "170px" },
    { id: "exempt", key: "exempt", label: "Exempt", type: "checkbox", width: "100px" },
    { id: "certificateNo", key: "certificateNo", label: "Certificate No", type: "text", width: "140px" }
  ];

  // Combined accounts columns showing both Sales Tax Account and Recoverable Account fields in the requested sequence
  const accountColumns = [
    { 
      id: "account", 
      key: "account", 
      label: "Account", 
      required: true, 
      type: "search-select",
      readOnlyIfExisting: true,
      displayKey: "label",
      secondaryKey: "subLabel",
      options: allAccountOptions,
      onSelect: (opt, rowId) => handleAccountSelectTable(opt, rowId),
      width: "220px"
    },
    { id: "accountDesc", key: "accountDesc", label: "Account Name", type: "text", readOnly: true, width: "200px" },
    { 
      id: "organization", 
      key: "organization", 
      label: "Organization", 
      required: true, 
      type: "search-select",
      readOnlyIfExisting: true,
      displayKey: "label",
      secondaryKey: "subLabel",
      options: allOrgOptions,
      onSelect: (opt, rowId) => handleOrgSelectTable(opt, rowId),
      width: "220px"
    },
    { id: "orgDesc", key: "orgDesc", label: "Organization Name", type: "text", readOnly: true, width: "200px" },
    { id: "taxType", key: "taxType", label: "Tax Type", required: true, type: "text", readOnlyIfExisting: true, width: "140px" },
    { id: "taxRate", key: "taxRate", label: "Tax Rate", required: true, type: "text", width: "120px" },
    { id: "compoundTax", key: "compoundTax", label: "Compound", type: "checkbox", width: "100px" },
    { id: "effectiveTaxRate", key: "effectiveTaxRate", label: "Effective Tax Rate", type: "text", width: "140px" },
    { id: "recoverable", key: "recoverable", label: "Recoverable", type: "text", width: "120px" },
    { 
      id: "recAccount", 
      key: "recAccount", 
      label: "Recoverable Account", 
      type: "search-select",
      displayKey: "label",
      secondaryKey: "subLabel",
      options: allAccountOptions,
      onSelect: (opt, rowId) => handleAccountInputChange("recAccount", opt.value || opt.data?.acctId, rowId),
      width: "220px" 
    },
    { 
      id: "recOrg", 
      key: "recOrg", 
      label: "Recoverable Org", 
      type: "search-select",
      displayKey: "label",
      secondaryKey: "subLabel",
      options: allOrgOptions,
      onSelect: (opt, rowId) => handleAccountInputChange("recOrg", opt.value || opt.data?.orgId, rowId),
      width: "220px" 
    },
    { 
      id: "suspenseAccount", 
      key: "suspenseAccount", 
      label: "Suspense Account", 
      type: "search-select",
      displayKey: "label",
      secondaryKey: "subLabel",
      options: allAccountOptions,
      onSelect: (opt, rowId) => handleAccountInputChange("suspenseAccount", opt.value || opt.data?.acctId, rowId),
      width: "220px" 
    },
    { 
      id: "suspenseOrg", 
      key: "suspenseOrg", 
      label: "Suspense Org", 
      type: "search-select",
      displayKey: "label",
      secondaryKey: "subLabel",
      options: allOrgOptions,
      onSelect: (opt, rowId) => handleAccountInputChange("suspenseOrg", opt.value || opt.data?.orgId, rowId),
      width: "220px" 
    }
  ];

  const showErrorToast = (error, defaultMsg) => {
    if (error.response && error.response.data) {
      const data = error.response.data;
      if (typeof data === "string") return toast.error(data);

      if (data.errors && typeof data.errors === "object") {
        const messages = [];
        Object.entries(data.errors).forEach(([field, errs]) => {
          if (Array.isArray(errs)) {
            errs.forEach(msg => messages.push(msg));
          } else if (typeof errs === "string") {
            messages.push(errs);
          }
        });
        if (messages.length > 0) {
          return toast.error(messages.join(" | "));
        }
      }

      if (data.detail) return toast.error(data.detail);
      if (data.message) return toast.error(data.message);
      if (data.title) return toast.error(data.title);
    }
    toast.error(error?.message || defaultMsg || "Validation error occurred.");
  };

  const checkStateCountryMatch = (stateCode, countryCode) => {
    if (!stateCode || !countryCode || String(countryCode).trim() === "") return true;
    const matchedState = statesMaster.find(s => s.stateCode.toLowerCase() === String(stateCode).trim().toLowerCase());
    if (matchedState && matchedState.countryCode) {
      if (matchedState.countryCode.toLowerCase() === String(countryCode).trim().toLowerCase()) {
        return true;
      }
      const expectedCountry = resolveCountryName(matchedState);
      toast.warn(`State/Province '${stateCode}' belongs to '${expectedCountry}' (${matchedState.countryCode.toUpperCase()}), not the selected country.`);
      return false;
    }
    return true;
  };

  const handleStateSelectTable = (opt, rowId) => {
    const s = opt.data || opt;
    const matchedState = statesMaster.find(st => st.stateCode.toLowerCase() === (s.stateCode || opt.value || "").toLowerCase());
    const extraUpdates = matchedState ? {
      stateProvince: matchedState.stateCode,
      stateName: matchedState.stateName || "",
      country: matchedState.countryCode || "",
      countryName: resolveCountryName(matchedState)
    } : {
      stateProvince: s.stateCode || opt.value,
      stateName: s.stateName || ""
    };

    setSalesTaxes(prevList =>
      prevList.map(item => getTaxKey(item) === String(rowId) ? { ...item, ...extraUpdates, isDirty: true } : item)
    );
    setSelectedTax(prev => prev && getTaxKey(prev) === String(rowId) ? { ...prev, ...extraUpdates, isDirty: true } : prev);
  };

  const handleCountrySelectTable = (opt, rowId) => {
    const c = opt.data || opt;
    const countryCode = c.countryCode || opt.value;
    const countryName = c.countryName || opt.subLabel || "";
    
    setSalesTaxes(prevList =>
      prevList.map(item => getTaxKey(item) === String(rowId) ? { ...item, country: countryCode, countryName, isDirty: true } : item)
    );
    setSelectedTax(prev => prev && getTaxKey(prev) === String(rowId) ? { ...prev, country: countryCode, countryName, isDirty: true } : prev);
  };

  const checkOrgAccountMapping = (acctId, orgId) => {
    if (!acctId || !orgId) return true;
    if (validMappings.length === 0) return true;
    const isLinked = validMappings.some((m) => {
      const mAcct = String(m.acctId || m.acct_id || m.accountId || m.account || "").trim();
      const mOrg = String(m.orgId || m.org_id || m.organizationId || m.organization || "").trim();
      return mAcct === String(acctId).trim() && mOrg === String(orgId).trim();
    });
    if (!isLinked) {
      toast.warn("Selected Account and Organization are not linked in Org-Account mapping!");
      return false;
    }
    return true;
  };

  const handleAccountSelectTable = (opt, rowId) => {
    const a = opt.data || opt;
    const accountCode = a.acctId || a.acct_id || a.value;
    const accountDesc = a.acctName || a.acct_name || a.subLabel || "";

    if (!selectedTax) return;
    const targetAcc = (selectedTax.accounts || []).find(acc => getAccountKey(acc) === String(rowId));
    const currentOrg = targetAcc?.organization || selectedAccount?.organization || "";
    checkOrgAccountMapping(accountCode, currentOrg);

    const updatedAccs = (selectedTax.accounts || []).map(acc => {
      if (getAccountKey(acc) === String(rowId)) {
        return { ...acc, account: accountCode, accountDesc, isDirty: true };
      }
      return acc;
    });

    updateSelectedTax({ accounts: updatedAccs });
    setSelectedAccount(prev => prev && getAccountKey(prev) === String(rowId) ? { ...prev, account: accountCode, accountDesc, isDirty: true } : prev);
  };

  const handleOrgSelectTable = (opt, rowId) => {
    const o = opt.data || opt;
    const orgCode = o.orgId || o.org_id || o.value;
    const orgDesc = o.orgName || o.org_name || o.subLabel || "";

    if (!selectedTax) return;
    const targetAcc = (selectedTax.accounts || []).find(acc => getAccountKey(acc) === String(rowId));
    const currentAcct = targetAcc?.account || selectedAccount?.account || "";
    checkOrgAccountMapping(currentAcct, orgCode);

    const updatedAccs = (selectedTax.accounts || []).map(acc => {
      if (getAccountKey(acc) === String(rowId)) {
        return { ...acc, organization: orgCode, orgDesc, isDirty: true };
      }
      return acc;
    });

    updateSelectedTax({ accounts: updatedAccs });
    setSelectedAccount(prev => prev && getAccountKey(prev) === String(rowId) ? { ...prev, organization: orgCode, orgDesc, isDirty: true } : prev);
  };

  const fetchSalesTaxes = async () => {
    setLoading(true);
    try {
      const [taxRes, acctRes] = await Promise.all([
        api.get(`${backendUrl}/api/sales-taxes`),
        api.get(`${backendUrl}/api/sales-tax-accounts`)
      ]);
      const taxes = (taxRes.data || []).map((tax, idx) => ({
        ...tax,
        uniqueKey: tax.taxCode || `TAX_${Date.now()}_${idx}`,
        isNew: false,
        accounts: (acctRes.data || [])
          .filter(a => a.companyId === tax.companyId && a.taxCode === tax.taxCode)
          .map((a, aIdx) => ({
            ...a,
            uniqueKey: a.taxAcctId ? String(a.taxAcctId) : (a.accountKey ? String(a.accountKey) : `ACC_${tax.taxCode}_${a.companyId || '1'}_${a.account || ''}_${a.organization || ''}_${aIdx}`),
            isNew: false
          }))
      }));

      setSalesTaxes(taxes);
      setAllSalesTaxes(taxes);
      if (taxes.length > 0) {
        setSelectedTax(taxes[0]);
        const firstTaxAccs = taxes[0].accounts || [];
        setSelectedAccount(firstTaxAccs[0] || null);
        setSelectedAccountKeys(new Set());
        setAccountCurrentIndex(0);
      } else {
        const defaultAccId = `ACC_${Date.now()}`;
        const defaultAcc = {
          ...initialAccountState,
          tempId: defaultAccId,
          uniqueKey: defaultAccId,
          isNew: true,
          isDirty: true
        };
        const defaultTaxId = `TEMP_${Date.now()}`;
        const defaultNewTax = {
          ...initialTaxState,
          tempId: defaultTaxId,
          uniqueKey: defaultTaxId,
          isNew: true,
          isDirty: true,
          accounts: [defaultAcc]
        };
        setSalesTaxes([defaultNewTax]);
        setAllSalesTaxes([defaultNewTax]);
        setSelectedTax(defaultNewTax);
        setSelectedAccount(defaultAcc);
        setSelectedAccountKeys(new Set());
        setAccountCurrentIndex(0);
      }
      localStorage.removeItem("salesTaxesData");
    } catch (e) {
      console.error("Fetch sales taxes error:", e);
      const defaultAccId = `ACC_${Date.now()}`;
      const defaultAcc = {
        ...initialAccountState,
        tempId: defaultAccId,
        uniqueKey: defaultAccId,
        isNew: true,
        isDirty: true
      };
      const defaultTaxId = `TEMP_${Date.now()}`;
      const defaultNewTax = {
        ...initialTaxState,
        tempId: defaultTaxId,
        uniqueKey: defaultTaxId,
        isNew: true,
        isDirty: true,
        accounts: [defaultAcc]
      };
      setSalesTaxes([defaultNewTax]);
      setAllSalesTaxes([defaultNewTax]);
      setSelectedTax(defaultNewTax);
      setSelectedAccount(defaultAcc);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookupData = async () => {
    try {
      const res = await api.get(`${backendUrl}/Orgnization/GetAllOrgAccounts`);
      setValidMappings(res.data || []);
    } catch (error) {
      console.error("Error fetching mappings:", error);
    }

    try {
      const res = await api.get(`${backendUrl}/api/Account/GetAllAccounts`);
      setAccountsMaster(res.data || []);
    } catch (error) {
      console.error("Error fetching accounts master:", error);
    }

    try {
      const res = await api.get(`${backendUrl}/Orgnization/GetAllOrgs`);
      setOrganizationsMaster(res.data || []);
    } catch (error) {
      console.error("Error fetching orgs master:", error);
    }

    try {
      const res = await api.get(`${backendUrl}/api/states`);
      setStatesMaster(res.data || []);
    } catch (error) {
      console.error("Error fetching states master:", error);
    }

    try {
      const res = await api.get(`${backendUrl}/api/countries`);
      setCountriesMaster(res.data || []);
    } catch (error) {
      console.error("Error fetching countries master:", error);
    }
  };

  useEffect(() => {
    fetchLookupData();
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem("salesTaxesData", JSON.stringify(data));
  };

  const updateSelectedTax = (updates) => {
    if (!selectedTax) return;
    const selectedKey = getTaxKey(selectedTax);
    
    setSalesTaxes(prevList =>
      prevList.map(c =>
        getTaxKey(c) === selectedKey ? { ...c, ...updates, isDirty: true } : c
      )
    );
    setSelectedTax(prev => prev ? { ...prev, ...updates, isDirty: true } : null);
  };

  const handleInputChange = (field, value, rowId) => {
    let finalValue = value;
    if (field === "taxCode" && typeof value === "string") {
      finalValue = value.toUpperCase().slice(0, 6);
    }

    let extraUpdates = {};
    if (field === "stateProvince") {
      const matchedState = statesMaster.find(
        (s) => s.stateCode.toLowerCase() === String(value).trim().toLowerCase()
      );
      if (matchedState) {
        extraUpdates = {
          stateProvince: matchedState.stateCode,
          stateName: matchedState.stateName || "",
          country: matchedState.countryCode || "",
          countryName: resolveCountryName(matchedState),
        };
      }
    } else if (field === "country") {
      const matchedCountry = countryOptions.find(
        (c) => c.value.toLowerCase() === String(value).trim().toLowerCase()
      );
      if (matchedCountry) {
        extraUpdates = {
          country: matchedCountry.value,
          countryName: matchedCountry.subLabel || "",
        };
      }
    }

    if (!selectedTax) return;
    const targetKey = String(rowId || getTaxKey(selectedTax));

    setSalesTaxes((prevList) =>
      prevList.map((item) => {
        if (getTaxKey(item) === targetKey) {
          return { ...item, [field]: finalValue, ...extraUpdates, isDirty: true };
        }
        return item;
      })
    );

    setSelectedTax((prev) => {
      if (!prev || getTaxKey(prev) !== targetKey) return prev;
      return { ...prev, [field]: finalValue, ...extraUpdates, isDirty: true };
    });
  };

  const handleFieldChange = (rowId, field, value) => {
    handleInputChange(field, value, rowId);
  };

  const handleAdd = () => {
    const hasUnsavedNew = salesTaxes.some((row) => row.isNew);
    if (hasUnsavedNew) {
      return toast.warn("Please save the current new entry before adding another.");
    }
    const newId = `TEMP_${Date.now()}`;
    const newAccId = `ACC_${Date.now()}`;
    const newAcc = {
      ...initialAccountState,
      tempId: newAccId,
      uniqueKey: newAccId,
      isNew: true,
      isDirty: true
    };
    const newRow = {
      ...initialTaxState,
      tempId: newId,
      uniqueKey: newId,
      isNew: true,
      isDirty: true,
      accounts: [newAcc]
    };
    setSalesTaxes([newRow, ...salesTaxes]);
    setSelectedTaxCodes(new Set());
    setSelectedTax(newRow);
    setCurrentIndex(0);

    // Reset sub-components
    setSelectedAccount(newAcc);
    setSelectedAccountKeys(new Set());
  };

  const handleSaveAll = async () => {
    let hasChanges = false;
    setLoading(true);
    try {
      // 1. Save Sales Tax changes
      const changedTaxes = salesTaxes.filter(t => t.isNew || t.isDirty);
      for (const tax of changedTaxes) {
        hasChanges = true;
        const payload = {
          companyId: tax.companyId || companyId,
          taxCode: tax.taxCode,
          certificateNo: tax.certificateNo || "",
          exempt: !!tax.exempt,
          description: tax.description || "",
          stateProvince: tax.stateProvince || "",
          country: tax.country || "",
          modifiedBy: tax.modifiedBy || "SYSTEM",
          compositeTaxRate: parseFloat(tax.compositeTaxRate || 0),
          recoveryPercent: parseFloat(tax.recoveryPercent || 100),
          requiresVatInfo: !!tax.requiresVatInfo
        };
        if (tax.isNew) {
          await api.post(`${backendUrl}/api/sales-taxes`, payload);
        } else {
          await api.put(`${backendUrl}/api/sales-taxes/${tax.companyId || companyId}/${tax.taxCode}`, payload);
        }
      }

      // 2. Save Sales Tax Account changes
      for (const tax of salesTaxes) {
        const accounts = tax.accounts || [];
        const changedAccounts = accounts.filter(a => a.isNew || a.isDirty);
        for (const account of changedAccounts) {
          hasChanges = true;
          const payloadAcc = {
            companyId: tax.companyId || companyId,
            taxCode: tax.taxCode,
            accountKey: account.accountKey || 0,
            account: account.account || "",
            accountDesc: account.accountDesc || "",
            organization: account.organization || "",
            orgDesc: account.orgDesc || "",
            taxRate: parseFloat(account.taxRate || 0),
            taxType: account.taxType || "SALES/USE",
            effectiveTaxRate: parseFloat(account.effectiveTaxRate || account.taxRate || 0),
            compoundTax: !!account.compoundTax,
            acctRecovPct: parseFloat(account.acctRecovPct || 100),
            recAccount: account.recAccount || "",
            recOrg: account.recOrg || "",
            suspenseAccount: account.suspenseAccount || "",
            suspenseOrg: account.suspenseOrg || ""
          };
          if (account.isNew) {
            await api.post(`${backendUrl}/api/sales-tax-accounts`, payloadAcc);
          } else {
            await api.put(`${backendUrl}/api/sales-tax-accounts/${tax.companyId || companyId}/${tax.taxCode}/${account.accountKey}`, payloadAcc);
          }
        }
      }

      if (!hasChanges) {
        toast.info("No changes to save.");
        return;
      }

      useDraftStore.getState().clearDraft("manage-sales-taxes");
      toast.success("Changes saved successfully!");
      await fetchSalesTaxes();
    } catch (error) {
      console.error("Save error:", error);
      showErrorToast(error, "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedTaxCodes.size === 0) {
      return toast.warn("Please select at least one tax record to delete.");
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedTaxCodes.size} selected items?`)) {
      return;
    }

    setLoading(true);
    try {
      const idsToDelete = Array.from(selectedTaxCodes);
      const remainingTaxes = salesTaxes.filter(c => !selectedTaxCodes.has(getTaxKey(c)));
      
      for (const id of idsToDelete) {
        const isTemporary = String(id).startsWith("TEMP_");
        if (!isTemporary) {
          const tax = salesTaxes.find(c => getTaxKey(c) === id);
          if (tax && tax.taxCode && !tax.isNew) {
            try {
              await api.delete(`${backendUrl}/api/sales-taxes/${tax.companyId || companyId}/${tax.taxCode}`);
            } catch (err) {
              if (err.response?.status !== 404) throw err;
            }
          }
        }
      }
      
      setSalesTaxes(remainingTaxes);
      setAllSalesTaxes(remainingTaxes);
      setSelectedTaxCodes(new Set());
      setSelectedTax(remainingTaxes[0] || null);
      setSelectedAccount(null);
      setSelectedAccountKeys(new Set());
      toast.success("Selection deleted successfully.");
      await fetchSalesTaxes();
    } catch (error) {
      console.error("Delete error:", error);
      showErrorToast(error, "Failed to delete sales tax.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!selectedTax) return toast.warn("Select a record to copy first.");
    setClipboard([selectedTax]);
    toast.success("Record copied.");
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Nothing to paste.");
    const target = clipboard[0];
    const newId = `TEMP_${Date.now()}`;
    const pastedRow = {
      ...target,
      taxCode: `${target.taxCode}-C`,
      tempId: newId,
      uniqueKey: newId,
      isNew: true,
      isDirty: true,
      accounts: (target.accounts || []).map((a, idx) => ({
        ...a,
        tempId: `ACC_${Date.now()}_${idx}`,
        uniqueKey: `ACC_${Date.now()}_${idx}`,
        isNew: true,
        isDirty: true
      }))
    };
    setSalesTaxes([pastedRow, ...salesTaxes]);
    setSelectedTax(pastedRow);
    setSelectedTaxCodes(new Set([newId]));
    setCurrentIndex(0);

    // Reset sub-components
    setSelectedAccount(pastedRow.accounts[0] || null);
    setSelectedAccountKeys(pastedRow.accounts[0] ? new Set([pastedRow.accounts[0].uniqueKey]) : new Set());
    toast.success("Record pasted successfully.");
  };

  const handleDiscard = () => {
    useDraftStore.getState().clearDraft("manage-sales-taxes");
    fetchSalesTaxes();
    toast.info("Changes discarded.");
  };

  const handleNavigate = (direction) => {
    if (salesTaxes.length === 0) return;
    let nextIdx = currentIndex;
    if (direction === "start") nextIdx = 0;
    else if (direction === "prev") nextIdx = Math.max(0, currentIndex - 1);
    else if (direction === "next") nextIdx = Math.min(salesTaxes.length - 1, currentIndex + 1);
    else if (direction === "end") nextIdx = salesTaxes.length - 1;

    setCurrentIndex(nextIdx);
    const target = salesTaxes[nextIdx];
    setSelectedTax(target);
    setSelectedTaxCodes(new Set([getTaxKey(target)]));

    // Reset sub-components
    const accs = target.accounts || [];
    setSelectedAccount(accs[0] || null);
    setSelectedAccountKeys(accs[0] ? new Set([getAccountKey(accs[0])]) : new Set());
    setAccountCurrentIndex(0);
  };

  const jumpToCode = (code) => {
    const idx = salesTaxes.findIndex(
      (c) => String(c.taxCode).toLowerCase() === String(code).toLowerCase()
    );
    if (idx >= 0) {
      setCurrentIndex(idx);
      const target = salesTaxes[idx];
      setSelectedTax(target);
      setSelectedTaxCodes(new Set([getTaxKey(target)]));
      const accs = target.accounts || [];
      setSelectedAccount(accs[0] || null);
      setSelectedAccountKeys(accs[0] ? new Set([getAccountKey(accs[0])]) : new Set());
      setAccountCurrentIndex(0);
    } else {
      toast.warn("Tax Code not found.");
    }
  };

  // --- Level 2 (Accounts) Actions ---
  const handleAccountInputChange = (field, value, rowId) => {
    if (!selectedTax) return;

    let updates = { [field]: value };

    if (field === "account") {
      const selectedAcctId = value;
      const acctObj = accountsMaster.find((a) => String(a.acctId || a.acct_id) === String(selectedAcctId));
      const accountName = acctObj?.acctName || acctObj?.acct_name || "";
      updates.accountDesc = accountName;

      const currentOrg = selectedAccount?.organization || "";
      if (selectedAcctId && currentOrg) {
        checkOrgAccountMapping(selectedAcctId, currentOrg);
      }
    } else if (field === "organization") {
      const selectedOrgId = value;
      const orgObj = organizationsMaster.find((o) => String(o.orgId || o.org_id) === String(selectedOrgId));
      const orgName = orgObj?.orgName || orgObj?.org_name || "";
      updates.orgDesc = orgName;

      const currentAccount = selectedAccount?.account || "";
      if (selectedOrgId && currentAccount) {
        checkOrgAccountMapping(currentAccount, selectedOrgId);
      }
    } else if (field === "recAccount") {
      const acctObj = accountsMaster.find((a) => String(a.acctId || a.acct_id) === String(value));
      updates.recAccountDesc = acctObj?.acctName || acctObj?.acct_name || "";
    } else if (field === "recOrg") {
      const orgObj = organizationsMaster.find((o) => String(o.orgId || o.org_id) === String(value));
      updates.recOrgDesc = orgObj?.orgName || orgObj?.org_name || "";
    } else if (field === "suspenseAccount") {
      const acctObj = accountsMaster.find((a) => String(a.acctId || a.acct_id) === String(value));
      updates.suspenseAccountDesc = acctObj?.acctName || acctObj?.acct_name || "";
    } else if (field === "suspenseOrg") {
      const orgObj = organizationsMaster.find((o) => String(o.orgId || o.org_id) === String(value));
      updates.suspenseOrgDesc = orgObj?.orgName || orgObj?.org_name || "";
    }

    const targetKey = String(rowId || getAccountKey(selectedAccount));
    const currentAccs = selectedTax.accounts || [];

    const updatedAccs = currentAccs.map((a) => {
      if (getAccountKey(a) === targetKey) {
        return { ...a, ...updates, isDirty: true };
      }
      return a;
    });

    updateSelectedTax({ accounts: updatedAccs });
    setSelectedAccount((prev) => (prev && getAccountKey(prev) === targetKey ? { ...prev, ...updates, isDirty: true } : prev));
  };

  const handleAccountAdd = () => {
    if (!selectedTax) return;
    const tempId = `ACC_${Date.now()}`;
    const newRow = {
      ...initialAccountState,
      tempId,
      uniqueKey: tempId,
      isNew: true,
      isDirty: true
    };
    const updatedAccs = [newRow, ...(selectedTax.accounts || [])];
    updateSelectedTax({ accounts: updatedAccs });
    setSelectedAccount(newRow);
    setSelectedAccountKeys(new Set([tempId]));
    setAccountCurrentIndex(0);
  };

  const handleAccountCopy = () => {
    if (!selectedAccount) return toast.warn("Select an account row to copy first.");
    setAccountClipboard([selectedAccount]);
    toast.success("Account record copied.");
  };

  const handleAccountPaste = () => {
    if (!selectedTax || accountClipboard.length === 0) return toast.warn("Nothing to paste.");
    const target = accountClipboard[0];
    const tempId = `ACC_${Date.now()}`;
    const pastedRow = {
      ...target,
      account: `${target.account}-C`,
      tempId,
      uniqueKey: tempId,
      isNew: true,
      isDirty: true
    };
    const updatedAccs = [pastedRow, ...(selectedTax.accounts || [])];
    updateSelectedTax({ accounts: updatedAccs });
    setSelectedAccount(pastedRow);
    setSelectedAccountKeys(new Set());
    setAccountCurrentIndex(0);
    toast.success("Account record pasted successfully.");
  };

  const handleAccountDelete = async () => {
    if (!selectedTax || selectedAccountKeys.size === 0) {
      return toast.warn("Please select at least one account to delete.");
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedAccountKeys.size} selected accounts?`)) {
      return;
    }

    setLoading(true);
    try {
      const idsToDelete = Array.from(selectedAccountKeys);
      const updatedAccs = (selectedTax.accounts || []).filter(a => !selectedAccountKeys.has(getAccountKey(a)));
      
      for (const id of idsToDelete) {
        const isTemporary = String(id).startsWith("ACC_");
        if (!isTemporary) {
          const account = (selectedTax.accounts || []).find(a => getAccountKey(a) === id);
          if (account && account.accountKey && account.accountKey !== "undefined") {
            try {
              await api.delete(`${backendUrl}/api/sales-tax-accounts/${selectedTax.companyId || companyId}/${selectedTax.taxCode}/${account.accountKey}`);
            } catch (err) {
              if (err.response?.status !== 404) throw err;
            }
          }
        }
      }
      
      updateSelectedTax({ accounts: updatedAccs });
      setSelectedAccount(updatedAccs[0] || null);
      setSelectedAccountKeys(new Set());
      setAccountCurrentIndex(0);
      toast.success("Accounts deleted successfully.");
      await fetchSalesTaxes();
    } catch (error) {
      console.error("Delete account error:", error);
      showErrorToast(error, "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  // Consolidated in handleAccountInputChange

  const handleAccountNavigate = (direction) => {
    if (!selectedTax) return;
    const accs = selectedTax.accounts || [];
    if (accs.length === 0) return;
    let nextIdx = accountCurrentIndex;
    if (direction === "start") nextIdx = 0;
    else if (direction === "prev") nextIdx = Math.max(0, accountCurrentIndex - 1);
    else if (direction === "next") nextIdx = Math.min(accs.length - 1, accountCurrentIndex + 1);
    else if (direction === "end") nextIdx = accs.length - 1;

    setAccountCurrentIndex(nextIdx);
    const target = accs[nextIdx];
    setSelectedAccount(target);
    setSelectedAccountKeys(new Set());
  };

  // --- Find & Replace Handlers ---
  const handleFind = () => {
    if (!findValue.trim()) {
      setFilteredGroups([]);
      return toast.info("Search filter cleared.");
    }
    const term = findValue.toLowerCase().trim();
    const matches = salesTaxes.filter((row) => {
      if (searchColumn !== "all") {
        return String(row[searchColumn] ?? "").toLowerCase().includes(term);
      }
      return taxColumns.some((col) => {
        const val = row[col.key || col.id];
        return val !== undefined && val !== null && String(val).toLowerCase().includes(term);
      });
    });

    setFilteredGroups(matches);
    if (matches.length === 0) {
      toast.warn("No matching records found.");
    } else {
      setSelectedTaxCodes(new Set([getTaxKey(matches[0])]));
      setSelectedTax(matches[0]);
      const idx = salesTaxes.findIndex(c => getTaxKey(c) === getTaxKey(matches[0]));
      setCurrentIndex(idx >= 0 ? idx : 0);
      toast.success(`Found ${matches.length} matching record(s).`);
    }
  };

  const handleReplaceAll = () => {
    if (searchColumn === "taxCode") {
      return toast.warn("Tax Code cannot be modified via Replace.");
    }
    if (!findValue.trim()) {
      return toast.warn("Please enter a term to find.");
    }
    const term = findValue.trim();
    let replaceCount = 0;

    const targetList = filteredGroups.length > 0 ? filteredGroups : salesTaxes;
    const targetKeys = new Set(targetList.map((r) => getTaxKey(r)));

    const updated = salesTaxes.map((row) => {
      if (!targetKeys.has(getTaxKey(row))) return row;

      let changed = false;
      const updatedRow = { ...row };

      const fieldsToCheck =
        searchColumn === "all"
          ? taxColumns
              .filter((c) => c.key !== "taxCode" && c.type !== "checkbox" && !c.readOnly)
              .map((c) => c.key || c.id)
          : [searchColumn];

      fieldsToCheck.forEach((colKey) => {
        if (colKey === "taxCode") return;
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
      setSalesTaxes(updated);
      if (selectedTax) {
        const found = updated.find((r) => getTaxKey(r) === getTaxKey(selectedTax));
        if (found) {
          setSelectedTax(found);
          setSelectedTaxCodes(new Set([getTaxKey(found)]));
        }
      }
      if (filteredGroups.length > 0) {
        setFilteredGroups(filteredGroups.map(fg => updated.find(u => getTaxKey(u) === getTaxKey(fg)) || fg));
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
  const displaySalesTaxes = useMemo(() => {
    const base = filteredGroups.length > 0 ? filteredGroups : (
      searchValue.trim() ? salesTaxes.filter((c) => {
        const term = searchValue.toLowerCase().trim();
        return (
          String(c.taxCode || "").toLowerCase().includes(term) ||
          String(c.description || "").toLowerCase().includes(term)
        );
      }) : salesTaxes
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
  }, [salesTaxes, filteredGroups, searchValue, sortColumn, sortDirection]);

  // --- Draft Store Hydration on Mount ---
  useEffect(() => {
    const draft = useDraftStore.getState().getDraft("manage-sales-taxes");
    if (
      draft &&
      Array.isArray(draft.salesTaxes) &&
      draft.salesTaxes.length > 0 &&
      (draft.isDirty ||
        draft.hasUnsaved ||
        draft.salesTaxes.some(
          (c) =>
            c.isDirty ||
            c.isNew ||
            c.tempId ||
            (c.accounts || []).some((a) => a.isDirty || a.isNew || a.tempId),
        ))
    ) {
      setSalesTaxes(draft.salesTaxes);
      if (draft.selectedTax) setSelectedTax(draft.selectedTax);
      if (draft.selectedTaxCodes)
        setSelectedTaxCodes(new Set(draft.selectedTaxCodes));
      if (draft.selectedAccount) setSelectedAccount(draft.selectedAccount);
      if (typeof draft.isFormView === "boolean") setIsFormView(draft.isFormView);
      if (typeof draft.isAccountFormView === "boolean")
        setIsAccountFormView(draft.isAccountFormView);
      if (draft.activeSubTab) setActiveSubTab(draft.activeSubTab);
    } else {
      fetchSalesTaxes();
    }
  }, []);

  // --- Auto-Save Draft to Zustand ---
  const salesTaxesRef = useRef(salesTaxes);
  const selectedTaxRef = useRef(selectedTax);
  const selectedTaxCodesRef = useRef(selectedTaxCodes);
  const selectedAccountRef = useRef(selectedAccount);
  const isFormViewRef = useRef(isFormView);
  const isAccountFormViewRef = useRef(isAccountFormView);
  const activeSubTabRef = useRef(activeSubTab);

  useEffect(() => {
    salesTaxesRef.current = salesTaxes;
    selectedTaxRef.current = selectedTax;
    selectedTaxCodesRef.current = selectedTaxCodes;
    selectedAccountRef.current = selectedAccount;
    isFormViewRef.current = isFormView;
    isAccountFormViewRef.current = isAccountFormView;
    activeSubTabRef.current = activeSubTab;

    const hasDirty = salesTaxes.some(
      (c) =>
        c.isDirty ||
        c.isNew ||
        c.tempId ||
        (c.accounts || []).some((a) => a.isDirty || a.isNew || a.tempId),
    );
    if (hasDirty) {
      useDraftStore.getState().saveDraft("manage-sales-taxes", {
        salesTaxes,
        selectedTax,
        selectedTaxCodes: Array.from(selectedTaxCodes),
        selectedAccount,
        isFormView,
        isAccountFormView,
        activeSubTab,
        isDirty: true,
        hasUnsaved: true,
      });
    }
  }, [
    salesTaxes,
    selectedTax,
    selectedTaxCodes,
    selectedAccount,
    isFormView,
    isAccountFormView,
    activeSubTab,
  ]);

  useEffect(() => {
    return () => {
      const cur = salesTaxesRef.current;
      if (
        cur &&
        cur.some(
          (c) =>
            c.isDirty ||
            c.isNew ||
            c.tempId ||
            (c.accounts || []).some((a) => a.isDirty || a.isNew || a.tempId),
        )
      ) {
        useDraftStore.getState().saveDraft("manage-sales-taxes", {
          salesTaxes: cur,
          selectedTax: selectedTaxRef.current,
          selectedTaxCodes: Array.from(selectedTaxCodesRef.current),
          selectedAccount: selectedAccountRef.current,
          isFormView: isFormViewRef.current,
          isAccountFormView: isAccountFormViewRef.current,
          activeSubTab: activeSubTabRef.current,
          isDirty: true,
          hasUnsaved: true,
        });
      }
    };
  }, []);

  const visibleAccounts = selectedTax ? (selectedTax.accounts || []) : [];

  const enrichedVisibleAccounts = visibleAccounts.map(acc => {
    const acctObj = accountsMaster.find((a) => a.acctId === acc.account);
    const resolvedAccountDesc = acc.accountDesc || acctObj?.acctName || acctObj?.acct_name || "";
    
    const orgObj = organizationsMaster.find((o) => o.orgId === acc.organization);
    const resolvedOrgDesc = acc.orgDesc || orgObj?.orgName || orgObj?.org_name || "";
    
    return {
      ...acc,
      accountDesc: resolvedAccountDesc,
      orgDesc: resolvedOrgDesc
    };
  });

  const activeAccountObj = selectedAccount ? accountsMaster.find((a) => a.acctId === selectedAccount.account) : null;
  const resolvedSelectedAccountDesc = selectedAccount
    ? (selectedAccount.accountDesc || activeAccountObj?.acctName || activeAccountObj?.acct_name || "")
    : "";

  const activeOrgObj = selectedAccount ? organizationsMaster.find((o) => o.orgId === selectedAccount.organization) : null;
  const resolvedSelectedOrgDesc = selectedAccount
    ? (selectedAccount.orgDesc || activeOrgObj?.orgName || activeOrgObj?.org_name || "")
    : "";

  return (
    <div className="salestax-page p-4 space-y-4 font-inter text-[#1f2937]">
      <style>{`
        .salestax-page { font-size:12px; color:#1f2937; }
        .salestax-page .voucher-head-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #d5dfeb; border-radius:7px; background:#fff; color:#344a63; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.15s ease; }
        .salestax-page .voucher-head-btn:hover:not(:disabled) { background:#f5f8fb; border-color:#b9c8d8; }
        .salestax-page .voucher-head-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .salestax-page .voucher-primary-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #1677e8; border-radius:7px; background:#1677e8; color:#fff; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.15s ease; }
        .salestax-page .voucher-primary-btn:hover:not(:disabled) { background:#125bc3; border-color:#125bc3; }
        .salestax-page .voucher-nav-btn { display:inline-flex; align-items:center; justify-content:center; width:34px; height:30px; border:0; border-right:1px solid #d5dfeb; background:#f5f8fb; color:#718096; cursor:pointer; transition:all 0.15s ease; }
        .salestax-page .voucher-nav-btn:last-child { border-right:0; }
        .salestax-page .voucher-nav-btn:hover:not(:disabled) { background:#eaf1f7; color:#17414d; }
        .salestax-page .voucher-nav-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .salestax-page .voucher-count { display:inline-flex; align-items:center; justify-content:center; min-width:48px; height:30px; padding:0 8px; background:#fff; color:#17414d; font-size:11px; font-weight:700; }
        .td-input[readonly] {
          background-color: #f8fafc !important;
          color: #94a3b8 !important;
          border-color: #e2e8f0 !important;
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

      {/* LEVEL 1: TAXES */}
      <MainContainer title="Manage Sales or Value Added Taxes" icon={ManageSalesTaxIcon}>
        <SalesTaxToolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={displaySalesTaxes.length}
          selectedRow={selectedTax}
          selectedCount={selectedTaxCodes.size}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          clipboard={clipboard}
          showFindReplace={showFindReplace}
          onToggleFindReplace={() => setShowFindReplace(!showFindReplace)}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => {
              if (!isFormView && !selectedTax && displaySalesTaxes.length > 0) {
                const firstRecord = displaySalesTaxes[0];
                setSelectedTax(firstRecord);
                setSelectedTaxCodes(new Set([getTaxKey(firstRecord)]));
              }
              setIsFormView(!isFormView);
            }
          }}
          currentIndex={currentIndex}
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
                  {taxColumns.map((col) => (
                    <option key={col.key || col.id} value={col.key || col.id}>
                      {col.label}
                    </option>
                  ))}
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
                  disabled={searchColumn === "taxCode"}
                  onChange={(e) => setReplaceValue(e.target.value)}
                  className={`px-2.5 py-1 text-[11px] border border-slate-300 rounded font-medium outline-none w-36 ${
                    searchColumn === "taxCode"
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
                disabled={searchColumn === "taxCode"}
                onClick={handleReplaceAll}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                  searchColumn === "taxCode"
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
                data={displaySalesTaxes}
                columns={taxColumns}
                selectedRows={displaySalesTaxes.filter(c => selectedTaxCodes.has(getTaxKey(c)))}
                onSelectAll={(e) => {
                  if (e.target.checked) {
                    setSelectedTaxCodes(new Set(displaySalesTaxes.map(getTaxKey)));
                    if (displaySalesTaxes.length > 0) {
                      setSelectedTax(displaySalesTaxes[0]);
                    }
                  } else {
                    setSelectedTaxCodes(new Set());
                  }
                }}
                onRowSelect={(item) => {
                  const key = getTaxKey(item);
                  const newIds = new Set(selectedTaxCodes);
                  const wasSelected = newIds.has(key);
                  if (wasSelected) {
                    newIds.delete(key);
                  } else {
                    newIds.add(key);
                  }
                  setSelectedTaxCodes(newIds);
                  if (!wasSelected) {
                    setSelectedTax(item);
                    const idx = salesTaxes.findIndex(c => getTaxKey(c) === key);
                    setCurrentIndex(idx >= 0 ? idx : 0);
                    const accs = item.accounts || [];
                    setSelectedAccount(accs[0] || null);
                    setSelectedAccountKeys(accs[0] ? new Set([getAccountKey(accs[0])]) : new Set());
                    setAccountCurrentIndex(0);
                  } else {
                    if (selectedTax && getTaxKey(selectedTax) === key) {
                      if (newIds.size > 0) {
                        const nextKey = Array.from(newIds)[newIds.size - 1];
                        const nextTax = salesTaxes.find(c => getTaxKey(c) === nextKey);
                        if (nextTax) {
                          setSelectedTax(nextTax);
                          const idx = salesTaxes.findIndex(c => getTaxKey(c) === nextKey);
                          setCurrentIndex(idx >= 0 ? idx : 0);
                          const accs = nextTax.accounts || [];
                          setSelectedAccount(accs[0] || null);
                          setSelectedAccountKeys(accs[0] ? new Set([getAccountKey(accs[0])]) : new Set());
                          setAccountCurrentIndex(0);
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
            <div className="space-y-4">
              <FormSection title="Tax Identification">
                <div className="flex flex-wrap items-start gap-4">
                  <FormInput
                    label="Tax Code"
                    required
                    readOnly={selectedTax && !selectedTax.isNew && !selectedTax.tempId}
                    value={selectedTax?.taxCode || ""}
                    onChange={(e) => handleInputChange("taxCode", e.target.value.toUpperCase().slice(0, 6))}
                    className="w-full sm:w-[200px]"
                  />
                  <FormInput
                    label="Description"
                    required
                    readOnly={selectedTax && !selectedTax.isNew && !selectedTax.tempId}
                    value={selectedTax?.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full sm:w-[360px]"
                  />
                </div>
              </FormSection>

              <FormSection title="Detail">
                <div className="space-y-4">
                  {/* State/Province & State Name alongside Country & Country Name on the same line */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: State / Province & State Name */}
                    <div className="flex gap-2 items-end">
                      <SearchableCombobox
                        label="State/Province"
                        required
                        disabled={selectedTax && !selectedTax.isNew && !selectedTax.tempId}
                        readOnly={selectedTax && !selectedTax.isNew && !selectedTax.tempId}
                        value={selectedTax?.stateProvince || ""}
                        options={stateOptions}
                        onChange={(val) => {
                          const matched = statesMaster.find(s => s.stateCode.toLowerCase() === val.trim().toLowerCase());
                          if (matched) {
                            updateSelectedTax({
                              stateProvince: matched.stateCode,
                              stateName: matched.stateName || selectedTax?.stateName || "",
                              country: matched.countryCode || selectedTax?.country || "",
                              countryName: resolveCountryName(matched),
                              isDirty: true
                            });
                          } else {
                            handleInputChange("stateProvince", val.toUpperCase(), getTaxKey(selectedTax));
                          }
                        }}
                        onSelect={(opt) => {
                          const s = opt.data;
                          if (s) {
                            updateSelectedTax({
                              stateProvince: s.stateCode || opt.value,
                              stateName: s.stateName || selectedTax?.stateName || "",
                              country: s.countryCode || selectedTax?.country || "",
                              countryName: resolveCountryName(s),
                              isDirty: true
                            });
                          }
                        }}
                        placeholder="Select State"
                        className="w-1/3 min-w-[120px]"
                      />
                      <FormInput
                        label="State Name"
                        required
                        readOnly
                        value={selectedTax?.stateName || ""}
                        onChange={(e) => handleInputChange("stateName", e.target.value)}
                        className="w-2/3"
                      />
                    </div>

                    {/* Right: Country & Country Name */}
                    <div className="flex gap-2 items-end">
                      <SearchableCombobox
                        label="Country"
                        required
                        disabled={selectedTax && !selectedTax.isNew && !selectedTax.tempId}
                        readOnly={selectedTax && !selectedTax.isNew && !selectedTax.tempId}
                        value={selectedTax?.country || ""}
                        options={countryOptions}
                        onChange={(val) => {
                          const matched = countryOptions.find(c => c.value.toLowerCase() === val.trim().toLowerCase());
                          checkStateCountryMatch(selectedTax?.stateProvince, val);
                          if (matched) {
                            updateSelectedTax({
                              country: matched.value,
                              countryName: matched.subLabel || selectedTax?.countryName || "",
                              isDirty: true
                            });
                          } else {
                            handleInputChange("country", val.toUpperCase());
                          }
                        }}
                        onSelect={(opt) => {
                          const c = opt.data;
                          if (c) {
                            checkStateCountryMatch(selectedTax?.stateProvince, c.countryCode || opt.value);
                            updateSelectedTax({
                              country: c.countryCode || opt.value,
                              countryName: c.countryName || selectedTax?.countryName || "",
                              isDirty: true
                            });
                          }
                        }}
                        placeholder="Select Country"
                        className="w-1/3 min-w-[120px]"
                      />
                      <FormInput
                        label="Country Name"
                        required
                        readOnly
                        value={selectedTax?.countryName || ""}
                        onChange={(e) => handleInputChange("countryName", e.target.value)}
                        className="w-2/3"
                      />
                    </div>
                  </div>

                  <div>
                    <FormInput
                      label="Requires VAT/Customs Info"
                      type="checkbox"
                      checked={!!selectedTax?.requiresVatInfo}
                      onChange={(e) => handleInputChange("requiresVatInfo", e.target.checked)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    <div className="space-y-2">
                      <FormInput
                        label="Composite Tax Rate"
                        value={selectedTax?.compositeTaxRate || ""}
                        onChange={(e) => handleInputChange("compositeTaxRate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <FormInput
                        label="Recovery Percent"
                        value={selectedTax?.recoveryPercent || ""}
                        onChange={(e) => handleInputChange("recoveryPercent", e.target.value)}
                      />
                      <FormInput
                        label="Recovery Percent Override"
                        value={selectedTax?.recoveryPercentOverride || ""}
                        onChange={(e) => handleInputChange("recoveryPercentOverride", e.target.value)}
                      />
                    </div>

                    <div className="border border-[#e5e7eb] rounded-lg p-3 bg-white space-y-2">
                      <span className="text-[11px] font-semibold text-[#5f6368] block">Exempt from Tax</span>
                      <FormInput
                        label="Exempt"
                        type="checkbox"
                        checked={!!selectedTax?.exempt}
                        onChange={(e) => handleInputChange("exempt", e.target.checked)}
                      />
                      <FormInput
                        label="Certificate No"
                        value={selectedTax?.certificateNo || ""}
                        onChange={(e) => handleInputChange("certificateNo", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </FormSection>
            </div>
          )}
        </div>
      </MainContainer>

      {/* LEVEL 2: SALES TAX ACCOUNTS */}
      <SecondaryContainer
        title="Sales Tax Accounts"
        className="mt-3 shadow-sm bg-white border border-slate-200/80 rounded-xl"
      >
          <SalesTaxToolbar
            isFormView={isAccountFormView}
            handleNavigate={handleAccountNavigate}
            totalRecords={visibleAccounts.length}
            selectedRow={selectedAccount}
            selectedCount={selectedAccountKeys.size}
            searchValue={accountSearchValue}
            setSearchValue={setAccountSearchValue}
            loading={loading}
            clipboard={accountClipboard}
            actions={{
              onAdd: handleAccountAdd,
              onSave: handleSaveAll,
              onDelete: handleAccountDelete,
              onCopy: handleAccountCopy,
              onClear: handleDiscard,
              onPaste: handleAccountPaste,
              onToggleView: () => {
                if (!isAccountFormView && !selectedAccount && visibleAccounts.length > 0) {
                  setSelectedAccount(visibleAccounts[0]);
                  setSelectedAccountKeys(new Set([getAccountKey(visibleAccounts[0])]));
                }
                setIsAccountFormView(!isAccountFormView);
              }
            }}
            currentIndex={accountCurrentIndex}
            buttonsDisable={["save"]}
          />

          {isAccountFormView && (
            <div className="flex gap-2 mb-3 max-w-sm select-none mt-2 px-2">
              {["Sales Tax Account", "Recoverable Accounts"].map((tab) => {
                const isActive = activeSubTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveSubTab(tab)}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer text-center
                      ${isActive
                        ? "bg-[#1677e8] text-white font-bold"
                        : "text-[#344a63] hover:bg-[#f5f8fb] bg-white border border-[#d5dfeb]"
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-1.5 text-xs">
            {!isAccountFormView ? (
              <div className="bg-white border border-gray-200 p-2">
                <ReusableTable
                  key={`table_${validMappings.length}`}
                  data={enrichedVisibleAccounts}
                  columns={accountColumns.map(col => {
                    if (col.key === "account" || col.key === "recAccount" || col.key === "suspenseAccount") {
                      return {
                        ...col,
                        options: allAccountOptions,
                        onSelect: (opt, rowId) => handleAccountInputChange(col.key, opt.value || opt.data?.acctId, rowId)
                      };
                    }
                    if (col.key === "organization" || col.key === "recOrg" || col.key === "suspenseOrg") {
                      return {
                        ...col,
                        options: allOrgOptions,
                        onSelect: (opt, rowId) => handleAccountInputChange(col.key, opt.value || opt.data?.orgId, rowId)
                      };
                    }
                    return col;
                  })}
                  selectedRows={enrichedVisibleAccounts.filter(a => selectedAccountKeys.has(getAccountKey(a)))}
                  onSelectAll={(e) => {
                    if (e.target.checked) {
                      setSelectedAccountKeys(new Set(enrichedVisibleAccounts.map(getAccountKey)));
                      if (enrichedVisibleAccounts.length > 0) {
                        setSelectedAccount(enrichedVisibleAccounts[0]);
                      }
                    } else {
                      setSelectedAccountKeys(new Set());
                    }
                  }}
                  onRowSelect={(item) => {
                    const key = getAccountKey(item);
                    const newIds = new Set(selectedAccountKeys);
                    const wasSelected = newIds.has(key);
                    if (wasSelected) {
                      newIds.delete(key);
                    } else {
                      newIds.add(key);
                    }
                    setSelectedAccountKeys(newIds);
                    if (!wasSelected) {
                      setSelectedAccount(item);
                      const idx = enrichedVisibleAccounts.findIndex(a => getAccountKey(a) === key);
                      setAccountCurrentIndex(idx >= 0 ? idx : 0);
                    } else {
                      if (selectedAccount && getAccountKey(selectedAccount) === key) {
                        if (newIds.size > 0) {
                          const nextKey = Array.from(newIds)[newIds.size - 1];
                          const nextAcc = enrichedVisibleAccounts.find(a => getAccountKey(a) === nextKey);
                          if (nextAcc) {
                            setSelectedAccount(nextAcc);
                            const idx = enrichedVisibleAccounts.findIndex(a => getAccountKey(a) === nextKey);
                            setAccountCurrentIndex(idx >= 0 ? idx : 0);
                          }
                        }
                      }
                    }
                  }}
                  onFieldChange={(rowId, field, value) => handleAccountInputChange(field, value, rowId)}
                  rowKey="uniqueKey"
                  renderEmptyState={() => (
                    <div className="text-center text-gray-400 text-[11px] py-4 italic">
                      No accounts configured for the active tab.
                    </div>
                  )}
                />
              </div>
            ) : (
              <div>
                {activeSubTab === "Sales Tax Account" ? (
                  <FormSection title="Account Setup">
                    <div className="space-y-3">
                      {/* Row 1: Account / Account Name alongside Compound */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="flex gap-2 items-end">
                          {(selectedAccount && !selectedAccount.isNew && !selectedAccount.tempId) ? (
                            <FormInput
                              label="Account"
                              required
                              readOnly
                              disabled
                              value={selectedAccount?.account || ""}
                              className="w-1/3 min-w-[120px]"
                            />
                          ) : (
                            <SearchableCombobox
                              label="Account"
                              required
                              value={selectedAccount?.account || ""}
                              options={allAccountOptions}
                              onChange={(val) => handleAccountInputChange("account", val, getAccountKey(selectedAccount))}
                              placeholder="Select Account"
                              className="w-1/3 min-w-[120px]"
                            />
                          )}
                          <FormInput
                            label="Account Name"
                            readOnly
                            value={resolvedSelectedAccountDesc}
                            className="w-2/3"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-medium text-[#5f6368] select-none">
                            Compound
                          </label>
                          <div className="flex items-center gap-4 h-8">
                            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] text-[#3c4043]">
                              <input
                                type="radio"
                                name={`compoundTax_${getAccountKey(selectedAccount)}`}
                                checked={!!selectedAccount?.compoundTax}
                                onChange={() => handleAccountInputChange("compoundTax", true, getAccountKey(selectedAccount))}
                                className="w-3.5 h-3.5 text-[#1677e8] focus:ring-0 cursor-pointer"
                              />
                              <span>Yes</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-[12px] text-[#3c4043]">
                              <input
                                type="radio"
                                name={`compoundTax_${getAccountKey(selectedAccount)}`}
                                checked={!selectedAccount?.compoundTax}
                                onChange={() => handleAccountInputChange("compoundTax", false, getAccountKey(selectedAccount))}
                                className="w-3.5 h-3.5 text-[#1677e8] focus:ring-0 cursor-pointer"
                              />
                              <span>No</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Organization / Organization Name alongside Effective Tax Rate */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="flex gap-2 items-end">
                          {(selectedAccount && !selectedAccount.isNew && !selectedAccount.tempId) ? (
                            <FormInput
                              label="Organization"
                              required
                              readOnly
                              disabled
                              value={selectedAccount?.organization || ""}
                              className="w-1/3 min-w-[120px]"
                            />
                          ) : (
                            <SearchableCombobox
                              label="Organization"
                              required
                              value={selectedAccount?.organization || ""}
                              options={allOrgOptions}
                              onChange={(val) => handleAccountInputChange("organization", val, getAccountKey(selectedAccount))}
                              placeholder="Select Organization"
                              className="w-1/3 min-w-[120px]"
                            />
                          )}
                          <FormInput
                            label="Organization Name"
                            readOnly
                            value={resolvedSelectedOrgDesc}
                            className="w-2/3"
                          />
                        </div>

                        <div>
                          <FormInput
                            label="Effective Tax Rate"
                            value={selectedAccount?.effectiveTaxRate ?? selectedAccount?.taxRate ?? ""}
                            onChange={(e) => handleAccountInputChange("effectiveTaxRate", e.target.value, getAccountKey(selectedAccount))}
                          />
                        </div>
                      </div>

                      {/* Row 3: Tax Type & Tax Rate alongside Recoverable */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="flex gap-2 items-end">
                          <div className="flex flex-col gap-1 w-1/2">
                            <label className="text-[11px] font-medium text-[#5f6368] select-none flex items-center gap-0.5 whitespace-nowrap">
                              <span>Tax Type</span>
                              <span className="text-blue-600 font-bold ml-0.5">*</span>
                            </label>
                            <select
                              value={selectedAccount?.taxType || "SALES/USE"}
                              disabled={selectedAccount && !selectedAccount.isNew && !selectedAccount.tempId}
                              onChange={(e) => handleAccountInputChange("taxType", e.target.value, getAccountKey(selectedAccount))}
                              className={`w-full h-8 text-[12px] font-normal px-2.5 pr-3 rounded outline-none border-0 shadow-none bg-[#f6f6f6] hover:bg-[#efefef] focus:bg-[#f1f3f4] text-[#3c4043] ${
                                selectedAccount && !selectedAccount.isNew && !selectedAccount.tempId
                                  ? "cursor-default"
                                  : "cursor-pointer"
                              }`}
                            >
                              <option value="SALES/USE">SALES/USE</option>
                              <option value="VAT">VAT</option>
                              <option value="EXEMPT">EXEMPT</option>
                            </select>
                          </div>

                          <FormInput
                            label="Tax Rate"
                            required
                            value={selectedAccount?.taxRate || ""}
                            onChange={(e) => handleAccountInputChange("taxRate", e.target.value, getAccountKey(selectedAccount))}
                            className="w-1/2"
                          />
                        </div>

                        <div>
                          <FormInput
                            label="Recoverable"
                            value={selectedAccount?.recoverable || "N"}
                            onChange={(e) => handleAccountInputChange("recoverable", e.target.value.toUpperCase().slice(0, 1), getAccountKey(selectedAccount))}
                          />
                        </div>
                      </div>
                    </div>
                  </FormSection>
                ) : (
                  <FormSection title="Recoverable Setup">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Group 1: Recoverable */}
                      <div className="border border-[#e5e7eb] rounded-lg p-3 bg-white space-y-2">
                        <span className="text-[11px] font-semibold text-[#5f6368] block">Recoverable</span>
                        <SearchableCombobox
                          label="Account"
                          value={selectedAccount?.recAccount || ""}
                          options={allAccountOptions}
                          onChange={(val) => handleAccountInputChange("recAccount", val, getAccountKey(selectedAccount))}
                          placeholder="Select Account"
                        />
                        <SearchableCombobox
                          label="Organization"
                          value={selectedAccount?.recOrg || ""}
                          options={allOrgOptions}
                          onChange={(val) => handleAccountInputChange("recOrg", val, getAccountKey(selectedAccount))}
                          placeholder="Select Organization"
                        />
                      </div>

                      {/* Group 2: Recoverable Suspense */}
                      <div className="border border-[#e5e7eb] rounded-lg p-3 bg-white space-y-2">
                        <span className="text-[11px] font-semibold text-[#5f6368] block">Recoverable Suspense</span>
                        <SearchableCombobox
                          label="Account"
                          value={selectedAccount?.suspenseAccount || ""}
                          options={allAccountOptions}
                          onChange={(val) => handleAccountInputChange("suspenseAccount", val, getAccountKey(selectedAccount))}
                          placeholder="Select Account"
                        />
                        <SearchableCombobox
                          label="Organization"
                          value={selectedAccount?.suspenseOrg || ""}
                          options={allOrgOptions}
                          onChange={(val) => handleAccountInputChange("suspenseOrg", val, getAccountKey(selectedAccount))}
                          placeholder="Select Organization"
                        />
                      </div>
                    </div>
                  </FormSection>
                )}
              </div>
            )}
          </div>
        </SecondaryContainer>
    </div>
  );
};
