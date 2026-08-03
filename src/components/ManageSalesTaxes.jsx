import React, { useEffect, useState } from "react";
import { backendUrl } from "./config";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, ChevronDown } from "lucide-react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";

// Custom form section and styled inputs matching generic aesthetics
const FormSection = ({ title, children, className = "" }) => {
  return (
    <div className={`relative rounded border border-slate-200 bg-white py-3 px-3 shadow-none ${className}`}>
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
      <div className="w-full flex items-center pt-0.5 pb-0.5">
        <label className="flex items-center gap-2 px-2 py-1 rounded border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer transition-all duration-150 select-none w-full">
          <input
            type={type}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="w-3.5 h-3.5 rounded border-slate-300 text-slate-700 focus:ring-[#17414d] cursor-pointer disabled:opacity-50 accent-[#17414d]"
          />
          <span className="text-[11px] font-semibold text-slate-700">{label}</span>
        </label>
      </div>
    );
  }

  if (horizontal) {
    return (
      <div className={`flex items-center justify-between gap-4 w-full ${className}`}>
        {label && (
          <span className="text-[11px] font-semibold text-slate-700 select-none w-2/5 text-left">
            {label} {required && <span>*</span>}
          </span>
        )}
        <div className="w-3/5">
          <input
            type={type}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            readOnly={readOnly}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-2 py-0.5 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
              ${readOnly || disabled 
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
        <span className="text-[11px] font-semibold text-slate-700 select-none">
          {label} {required && <span>*</span>}
        </span>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-2 py-0.5 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
          ${readOnly || disabled 
            ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed" 
            : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          }`}
      />
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
    <div ref={containerRef} className={`flex flex-col gap-1 w-full relative ${className}`}>
      {label && (
        <span className="text-[11px] font-semibold text-slate-700 select-none">
          {label} {required && <span>*</span>}
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
          className={`w-full px-2 py-0.5 pr-7 rounded border text-[11px] font-medium transition-all duration-150 outline-none
            ${readOnly || disabled 
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
          <ChevronDown size={13} />
        </button>
      </div>

      {isOpen && !readOnly && !disabled && (
        <div className="absolute top-full left-0 min-w-full w-max max-w-sm z-50 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded shadow-lg text-[11px]">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <div
                key={`${opt.value}_${idx}`}
                onClick={() => handleSelectOption(opt)}
                className={`px-2 py-1.5 hover:bg-slate-100 cursor-pointer flex justify-between items-center whitespace-nowrap ${
                  String(opt.value) === String(value) ? "bg-slate-50 font-bold text-[#17414d]" : "text-slate-700"
                }`}
              >
                <span>{opt.label}</span>
                {opt.subLabel && opt.subLabel !== opt.label && (
                  <span className="text-[10px] text-slate-400 ml-2">{opt.subLabel}</span>
                )}
              </div>
            ))
          ) : (
            <div className="px-2 py-2 text-slate-400 text-center italic text-[10px]">
              No matching options
            </div>
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

  const getTaxKey = (row) => row ? String(row.tempId || row.uniqueKey || row.taxCode || "") : "";
  const getAccountKey = (row) => row ? String(row.tempId || row.uniqueKey || row.accountKey || `${row.account}_${row.organization}` || "") : "";

  // Column definitions for the tables
  const taxColumns = [
    { id: "taxCode", key: "taxCode", label: "Tax Code", required: true, type: "text", readOnlyIfExisting: true, width: "120px" },
    { id: "description", key: "description", label: "Description", required: true, type: "text", readOnlyIfExisting: true, width: "200px" },
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
      const taxes = (taxRes.data || []).map((tax) => ({
        ...tax,
        isNew: false,
        accounts: (acctRes.data || [])
          .filter(a => a.companyId === tax.companyId && a.taxCode === tax.taxCode)
          .map((a) => ({
            ...a,
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
        const defaultAcc = {
          ...initialAccountState,
          tempId: `ACC_${Date.now()}`,
          isNew: true,
          isDirty: true
        };
        const defaultNewTax = {
          ...initialTaxState,
          tempId: `TEMP_${Date.now()}`,
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
      const defaultAcc = {
        ...initialAccountState,
        tempId: `ACC_${Date.now()}`,
        isNew: true,
        isDirty: true
      };
      const defaultNewTax = {
        ...initialTaxState,
        tempId: `TEMP_${Date.now()}`,
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
    fetchSalesTaxes();
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
      isNew: true,
      isDirty: true
    };
    const newRow = {
      ...initialTaxState,
      tempId: newId,
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
      isNew: true,
      isDirty: true,
      accounts: (target.accounts || []).map((a, idx) => ({
        ...a,
        tempId: `ACC_${Date.now()}_${idx}`,
        isNew: true,
        isDirty: true
      }))
    };
    setSalesTaxes([pastedRow, ...salesTaxes]);
    setSelectedTax(pastedRow);
    setSelectedTaxCodes(new Set());
    setCurrentIndex(0);

    // Reset sub-components
    setSelectedAccount(pastedRow.accounts[0] || null);
    setSelectedAccountKeys(new Set());
    toast.success("Record pasted successfully.");
  };

  const handleDiscard = () => {
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
    setSelectedTaxCodes(new Set());

    // Reset sub-components
    const accs = target.accounts || [];
    setSelectedAccount(accs[0] || null);
    setSelectedAccountKeys(new Set());
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
      setSelectedTaxCodes(new Set());
      const accs = target.accounts || [];
      setSelectedAccount(accs[0] || null);
      setSelectedAccountKeys(new Set());
      setAccountCurrentIndex(0);
    } else {
      toast.warn("Tax Code not found.");
    }
  };

  // --- Level 2 (Accounts) Actions ---
  const handleAccountInputChange = (field, value, rowId) => {
    if (!selectedTax || !selectedAccount) return;

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
      isNew: true,
      isDirty: true
    };
    const updatedAccs = [newRow, ...(selectedTax.accounts || [])];
    updateSelectedTax({ accounts: updatedAccs });
    setSelectedAccount(newRow);
    setSelectedAccountKeys(new Set());
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

  const filteredSalesTaxes = salesTaxes.filter(c => {
    const term = searchValue.toLowerCase().trim();
    if (!term) return true;
    return (
      String(c.taxCode).toLowerCase().includes(term) ||
      String(c.description).toLowerCase().includes(term)
    );
  });

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
    <div className="mt-14 ml-4 font-inter text-[#17414d] space-y-4 pb-16">
      <style>{`
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
      <MainContainer title="Manage Sales or Value Added Taxes">
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={filteredSalesTaxes.length}
          selectedRow={selectedTax}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => {
              if (!isFormView && !selectedTax && filteredSalesTaxes.length > 0) {
                const firstRecord = filteredSalesTaxes[0];
                setSelectedTax(firstRecord);
                setSelectedTaxCodes(new Set());
              }
              setIsFormView(!isFormView);
            }
          }}
          currentIndex={currentIndex}
        />

        <div className="mt-2 text-xs">
          {!isFormView ? (
            <div className="bg-white border border-gray-200 p-2">
              <ReusableTable
                data={filteredSalesTaxes}
                columns={taxColumns}
                selectedRows={filteredSalesTaxes.filter(c => selectedTaxCodes.has(getTaxKey(c)))}
                onSelectAll={(e) => {
                  if (e.target.checked) {
                    setSelectedTaxCodes(new Set(filteredSalesTaxes.map(getTaxKey)));
                    if (filteredSalesTaxes.length > 0) {
                      setSelectedTax(filteredSalesTaxes[0]);
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
                  }
                }}
                onFieldChange={handleFieldChange}
                rowKey="tempId"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <FormSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <FormInput
                    label="Tax Code"
                    required
                    readOnly={selectedTax && !selectedTax.isNew && !selectedTax.tempId}
                    value={selectedTax?.taxCode || ""}
                    onChange={(e) => handleInputChange("taxCode", e.target.value.toUpperCase().slice(0, 6))}
                  />
                  <FormInput
                    label="Description"
                    required
                    readOnly={selectedTax && !selectedTax.isNew && !selectedTax.tempId}
                    value={selectedTax?.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </FormSection>

              <FormSection title="Detail">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* State / Province & State Name */}
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
                    />
                    <FormInput
                      label="State Name"
                      required
                      readOnly
                      value={selectedTax?.stateName || ""}
                      onChange={(e) => handleInputChange("stateName", e.target.value)}
                    />
                  </div>

                  {/* Country & Country Name */}
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
                    />
                    <FormInput
                      label="Country Name"
                      required
                      readOnly
                      value={selectedTax?.countryName || ""}
                      onChange={(e) => handleInputChange("countryName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <FormInput
                    label="Requires VAT/Customs Info"
                    type="checkbox"
                    checked={!!selectedTax?.requiresVatInfo}
                    onChange={(e) => handleInputChange("requiresVatInfo", e.target.checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
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

                  <div className="border border-slate-200 rounded p-2.5 bg-slate-50/30">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">Exempt from Tax</span>
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
              </FormSection>
            </div>
          )}
        </div>
      </MainContainer>

      {/* LEVEL 2: SALES TAX ACCOUNTS */}
      <SecondaryContainer title="Sales Tax Accounts">
          <Toolbar
            isFormView={isAccountFormView}
            handleNavigate={handleAccountNavigate}
            totalRecords={visibleAccounts.length}
            selectedRow={selectedAccount}
            searchValue={accountSearchValue}
            setSearchValue={setAccountSearchValue}
            loading={loading}
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
                  setSelectedAccountKeys(new Set());
                }
                setIsAccountFormView(!isAccountFormView);
              }
            }}
            currentIndex={accountCurrentIndex}
            buttonsDisable={["save"]}
          />

          {isAccountFormView && (
            <div className="flex gap-2 mb-3 max-w-sm select-none mt-2">
              {["Sales Tax Account", "Recoverable Accounts"].map((tab) => {
                const isActive = activeSubTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveSubTab(tab)}
                    className={`flex-1 flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
                      ${isActive
                        ? "border-b-2 bg-[#17414d] text-white font-bold"
                        : "text-gray-600 hover:text-gray-800 bg-gray-100"
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-2 text-xs">
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
                    }
                  }}
                  onFieldChange={(rowId, field, value) => handleAccountInputChange(field, value, rowId)}
                  rowKey="accountKey"
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
                  <FormSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Column 1 */}
                      <div className="space-y-1.5">
                        {(selectedAccount && !selectedAccount.isNew && !selectedAccount.tempId) ? (
                          <FormInput
                            label="Account"
                            required
                            readOnly
                            disabled
                            value={selectedAccount?.account || ""}
                          />
                        ) : (
                          <SearchableCombobox
                            label="Account"
                            required
                            value={selectedAccount?.account || ""}
                            options={allAccountOptions}
                            onChange={(val) => handleAccountInputChange("account", val, getAccountKey(selectedAccount))}
                            placeholder="Select Account"
                          />
                        )}
                        <FormInput
                          label="Account Name"
                          readOnly
                          value={resolvedSelectedAccountDesc}
                        />
                        {(selectedAccount && !selectedAccount.isNew && !selectedAccount.tempId) ? (
                          <FormInput
                            label="Organization"
                            required
                            readOnly
                            disabled
                            value={selectedAccount?.organization || ""}
                          />
                        ) : (
                          <SearchableCombobox
                            label="Organization"
                            required
                            value={selectedAccount?.organization || ""}
                            options={allOrgOptions}
                            onChange={(val) => handleAccountInputChange("organization", val, getAccountKey(selectedAccount))}
                            placeholder="Select Organization"
                          />
                        )}
                        <FormInput
                          label="Organization Name"
                          readOnly
                          value={resolvedSelectedOrgDesc}
                        />
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-[11px] font-semibold text-slate-700 select-none">Tax Type *</span>
                          <div className="relative w-full">
                            <select
                              value={selectedAccount?.taxType || "SALES/USE"}
                              disabled={selectedAccount && !selectedAccount.isNew && !selectedAccount.tempId}
                              onChange={(e) => handleAccountInputChange("taxType", e.target.value, getAccountKey(selectedAccount))}
                              className={`w-full px-2 py-0.5 pr-6 rounded border text-[11px] font-medium outline-none ${
                                selectedAccount && !selectedAccount.isNew && !selectedAccount.tempId
                                  ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                                  : "bg-white border-slate-200 text-slate-800 focus:border-slate-400"
                              }`}
                            >
                              <option value="SALES/USE">SALES/USE</option>
                              <option value="VAT">VAT</option>
                              <option value="EXEMPT">EXEMPT</option>
                            </select>
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <Search size={11} />
                            </div>
                          </div>
                        </div>
                        <FormInput
                          label="Tax Rate"
                          required
                          value={selectedAccount?.taxRate || ""}
                          onChange={(e) => handleAccountInputChange("taxRate", e.target.value, getAccountKey(selectedAccount))}
                        />
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-1.5 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="pt-2">
                            <FormInput
                              label="Compound"
                              type="checkbox"
                              checked={!!selectedAccount?.compoundTax}
                              onChange={(e) => handleAccountInputChange("compoundTax", e.target.checked, getAccountKey(selectedAccount))}
                            />
                          </div>
                          <FormInput
                            label="Effective Tax Rate"
                            value={selectedAccount?.effectiveTaxRate ?? selectedAccount?.taxRate ?? ""}
                            onChange={(e) => handleAccountInputChange("effectiveTaxRate", e.target.value, getAccountKey(selectedAccount))}
                          />
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
                  <FormSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Group 1: Recoverable */}
                      <div className="border border-slate-200 rounded p-3 bg-slate-50/20 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 block mb-2">Recoverable</span>
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
                      <div className="border border-slate-200 rounded p-3 bg-slate-50/20 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 block mb-2">Recoverable Suspense</span>
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
