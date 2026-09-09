import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { backendUrl } from "./config";
import api from "../utils/api";
import axios from "axios";
import { toast } from "react-toastify";
import { MainContainer, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";

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
  placeholder = "",
  horizontal,
  inputClassName = "",
  labelClassName = "",
  helperText = "",
  icon: Icon,
  onIconClick,
}) => {
  const [radioName] = useState(() => `radio-${label ? String(label).replace(/[^a-zA-Z0-9]/g, "") : "field"}-${Math.random().toString(36).substr(2, 9)}`);

  let containerClassName = className;
  if (type === "checkbox") {
    containerClassName = className
      .replace(/\bw-\[[^\]]+\]/g, "")
      .replace(/\bw-\d+/g, "") + " w-auto min-w-fit flex-shrink-0";
  }

  if (type === "checkbox") {
    const isChecked = checked === true || checked === "Y";
    return (
      <div className={`flex items-center gap-2.5 py-1 ${containerClassName}`}>
        {label && (
          <label className={`text-[11px] font-medium text-[#5f6368] select-none shrink-0 ${labelClassName || "min-w-[120px]"}`}>
            {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
          </label>
        )}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#3c4043] select-none">
            <input
              type="radio"
              name={radioName}
              checked={isChecked}
              onChange={() => {
                if (onChange && !disabled) {
                  onChange({ target: { checked: true, value: "Y" } });
                }
              }}
              disabled={disabled}
              className="w-3.5 h-3.5 cursor-pointer accent-blue-600"
            />
            Yes
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#3c4043] select-none">
            <input
              type="radio"
              name={radioName}
              checked={!isChecked}
              onChange={() => {
                if (onChange && !disabled) {
                  onChange({ target: { checked: false, value: "N" } });
                }
              }}
              disabled={disabled}
              className="w-3.5 h-3.5 cursor-pointer accent-blue-600"
            />
            No
          </label>
        </div>
        {helperText && (
          <p className="text-[10px] text-slate-400 pl-2 leading-tight select-none">{helperText}</p>
        )}
      </div>
    );
  }

  const isClickable = type === "radio";

  if (isClickable) {
    return (
      <div className={`flex items-center gap-2 py-1 ${className}`}>
        <input
          type={type}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 rounded-full border-slate-300 text-slate-900 cursor-pointer accent-blue-600"
        />
        {label && (
          <label className={`text-[11px] font-medium text-[#5f6368] cursor-pointer select-none ${labelClassName}`}>
            {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
          </label>
        )}
      </div>
    );
  }

  if (horizontal) {
    return (
      <div className={`flex items-center gap-3 py-0.5 ${className}`}>
        {label && (
          <label className={`text-[11px] font-medium text-[#5f6368] min-w-[110px] text-left select-none flex items-center gap-0.5 ${labelClassName}`}>
            <span>{label}</span>
            {required && <span className="text-blue-600 font-bold ml-0.5 select-none">*</span>}
          </label>
        )}
        <div className="relative flex-1 min-w-0 flex items-center">
          <input
            type={type}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            readOnly={readOnly}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full h-8 text-[12px] font-normal px-2.5 py-1 rounded transition-all outline-none border-0 shadow-none ${
              Icon ? "pr-8" : ""
            } ${inputClassName} bg-[#f6f6f6] hover:bg-[#efefef] focus:bg-[#f1f3f4] text-[#3c4043] placeholder:text-gray-400 ${
              readOnly || disabled ? "cursor-default select-text" : "cursor-text"
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
        <label className={`text-[11px] font-medium text-[#5f6368] select-none flex items-center gap-0.5 whitespace-nowrap ${labelClassName}`}>
          <span>{label}</span>
          {required && <span className="text-blue-600 font-bold ml-0.5 select-none">*</span>}
        </label>
      )}
      <div className="relative w-full flex items-center">
        <input
          type={type}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full h-8 text-[12px] font-normal px-2.5 py-1 rounded transition-all outline-none border-0 shadow-none ${
            Icon ? "pr-8" : ""
          } ${inputClassName} bg-[#f6f6f6] hover:bg-[#efefef] focus:bg-[#f1f3f4] text-[#3c4043] placeholder:text-gray-400 ${
            readOnly || disabled ? "cursor-default select-text" : "cursor-text"
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

  // Level 2 - State State Variables
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateCodes, setSelectedStateCodes] = useState(new Set());
  const [isStateFormView, setIsStateFormView] = useState(true);
  const [stateSearchValue, setStateSearchValue] = useState("");
  const [stateCurrentIndex, setStateCurrentIndex] = useState(0);
  const [stateClipboard, setStateClipboard] = useState([]);

  // Level 3 - Postal Code State Variables
  const [selectedPostal, setSelectedPostal] = useState(null);
  const [selectedPostalCodes, setSelectedPostalCodes] = useState(new Set());
  const [isPostalFormView, setIsPostalFormView] = useState(true);
  const [postalSearchValue, setPostalSearchValue] = useState("");
  const [postalCurrentIndex, setPostalCurrentIndex] = useState(0);
  const [postalClipboard, setPostalClipboard] = useState([]);

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

  const countryColumns = [
    { id: "countryCode", key: "countryCode", label: "Country Code", required: true, type: "text", readOnlyIfExisting: true },
    { id: "countryName", key: "countryName", label: "Country Name", required: true, type: "text" }
  ];

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

  useEffect(() => {
    fetchCountries();
  }, []);

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

  const handleCopy = () => {
    if (!selectedCountry) {
      toast.warn("Select a record to copy first.");
      return;
    }
    setClipboard([selectedCountry]);
    toast.success("Record copied.");
  };

  const handlePaste = () => {
    if (clipboard.length === 0) {
      toast.warn("Nothing to paste.");
      return;
    }
    const target = clipboard[0];
    const newId = `TEMP_${Date.now()}`;
    const pastedRow = {
      ...target,
      countryCode: `${target.countryCode}-C`,
      tempId: newId,
      isNew: true,
      isDirty: true,
      states: (target.states || []).map((s, idx) => ({
        ...s,
        tempId: `STATE_${Date.now()}_${idx}`,
        isNew: true,
        isDirty: true,
        postalCodes: (s.postalCodes || []).map((p, pidx) => ({
          ...p,
          tempId: `POSTAL_${Date.now()}_${idx}_${pidx}`,
          isNew: true,
          isDirty: true
        }))
      }))
    };
    setCountries([pastedRow, ...countries]);
    setSelectedCountryCodes(new Set([newId]));
    setSelectedCountry(pastedRow);
    setCurrentIndex(0);
    toast.success("Record pasted successfully.");
  };

  const handleDiscard = () => {
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

  const handleStateCopy = () => {
    if (!selectedState) {
      toast.warn("Select a state row to copy first.");
      return;
    }
    setStateClipboard([selectedState]);
    toast.success("State record copied.");
  };

  const handleStatePaste = () => {
    if (!selectedCountry || stateClipboard.length === 0) {
      toast.warn("Nothing to paste.");
      return;
    }
    const target = stateClipboard[0];
    const tempId = `STATE_${Date.now()}`;
    const pastedRow = {
      ...target,
      stateCode: `${target.stateCode}-C`,
      tempId,
      uniqueKey: tempId,
      isNew: true,
      isDirty: true,
      postalCodes: (target.postalCodes || []).map((p, idx) => {
        const pTempId = `POSTAL_${Date.now()}_${idx}`;
        return {
          ...p,
          tempId: pTempId,
          uniqueKey: pTempId,
          isNew: true,
          isDirty: true
        };
      })
    };
    const updatedStates = [pastedRow, ...(selectedCountry.states || [])];
    updateSelectedCountry({ states: updatedStates });
    setSelectedState(pastedRow);
    setSelectedStateCodes(new Set([tempId]));
    setStateCurrentIndex(0);
    toast.success("State record pasted successfully.");
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
    const states = visibleStates;
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

  const handlePostalCopy = () => {
    if (!selectedPostal) {
      toast.warn("Select a postal code row to copy first.");
      return;
    }
    setPostalClipboard([selectedPostal]);
    toast.success("Postal code record copied.");
  };

  const handlePostalPaste = () => {
    if (!selectedState || postalClipboard.length === 0) {
      toast.warn("Nothing to paste.");
      return;
    }
    const target = postalClipboard[0];
    const tempId = `POSTAL_${Date.now()}`;
    const pastedRow = {
      ...target,
      postalCode: `${target.postalCode}-C`,
      tempId,
      uniqueKey: tempId,
      isNew: true,
      isDirty: true
    };
    const updatedPostals = [pastedRow, ...(selectedState.postalCodes || [])];
    updateSelectedState({ postalCodes: updatedPostals });
    setSelectedPostal(pastedRow);
    setSelectedPostalCodes(new Set([tempId]));
    setPostalCurrentIndex(0);
    toast.success("Postal code record pasted successfully.");
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
    const postals = visiblePostalCodes;
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

  const visibleStates = countries
    .filter(c => selectedCountryCodes.has(getRowKey(c)))
    .flatMap(c => c.states || []);

  const visiblePostalCodes = visibleStates
    .filter(s => selectedStateCodes.has(getStateKey(s)))
    .flatMap(s => s.postalCodes || []);

  return (
    <div className="country-page p-4 space-y-4 font-inter text-[#1f2937]">
      <style>{`
        .country-page { font-size:12px; color:#1f2937; }
        .country-page .voucher-head-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #d5dfeb; border-radius:7px; background:#fff; color:#344a63; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.15s ease; }
        .country-page .voucher-head-btn:hover:not(:disabled) { background:#f5f8fb; border-color:#b9c8d8; }
        .country-page .voucher-head-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .country-page .voucher-primary-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; height:32px; padding:0 12px; border:1px solid #1677e8; border-radius:7px; background:#1677e8; color:#fff; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.15s ease; }
        .country-page .voucher-primary-btn:hover:not(:disabled) { background:#125bc3; border-color:#125bc3; }
        .country-page .voucher-nav-btn { display:inline-flex; align-items:center; justify-content:center; width:34px; height:30px; border:0; border-right:1px solid #d5dfeb; background:#f5f8fb; color:#718096; cursor:pointer; transition:all 0.15s ease; }
        .country-page .voucher-nav-btn:last-child { border-right:0; }
        .country-page .voucher-nav-btn:hover:not(:disabled) { background:#eaf1f7; color:#17414d; }
        .country-page .voucher-nav-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .country-page .voucher-count { display:inline-flex; align-items:center; justify-content:center; min-width:48px; height:30px; padding:0 8px; background:#fff; color:#17414d; font-size:11px; font-weight:700; }
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
          totalRecords={filteredCountries.length}
          selectedRow={selectedCountry}
          selectedCount={selectedCountryCodes.size}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          clipboard={clipboard}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => {
              if (!isFormView && !selectedCountry && filteredCountries.length > 0) {
                const firstRecord = filteredCountries[0];
                setSelectedCountry(firstRecord);
                setSelectedCountryCodes(new Set([getRowKey(firstRecord)]));
              }
              setIsFormView(!isFormView);
            }
          }}
          currentIndex={currentIndex}
        />

        <div className="mt-1.5 text-xs">
          {!isFormView ? (
            <div className="bg-white border border-gray-200 p-2">
              <ReusableTable
                data={filteredCountries}
                columns={countryColumns}
                selectedRows={filteredCountries.filter(c => selectedCountryCodes.has(getRowKey(c)))}
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
                    // It was unchecked.
                    // Automatically uncheck all of this country's states and their postal codes
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

                    // If the unchecked country was the active selectedCountry, switch to another checked one if available.
                    // Do not nullify selectedCountry if no countries are checked so layout is preserved.
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
        <SecondaryContainer
          title="Manage State"
          className="mt-3 shadow-sm bg-white border border-slate-200/80 rounded-xl"
        >
          <CountryToolbar
            isFormView={isStateFormView}
            handleNavigate={handleStateNavigate}
            totalRecords={selectedCountryCodes.size > 0 ? visibleStates.length : 0}
            selectedRow={selectedCountryCodes.size > 0 ? selectedState : null}
            selectedCount={selectedStateCodes.size}
            searchValue={stateSearchValue}
            setSearchValue={setStateSearchValue}
            loading={loading || selectedCountryCodes.size === 0}
            clipboard={stateClipboard}
            actions={{
              onAdd: handleStateAdd,
              onSave: handleSaveAll,
              onDelete: handleStateDelete,
              onCopy: handleStateCopy,
              onClear: handleDiscard,
              onPaste: handleStatePaste,
              onToggleView: () => {
                const states = visibleStates;
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

          <div className="mt-1.5 text-xs">
            {!isStateFormView ? (
              <div className="bg-white border border-gray-200 p-2">
                <ReusableTable
                  data={selectedCountryCodes.size > 0 ? visibleStates : []}
                  columns={stateColumns}
                  selectedRows={visibleStates.filter(s => selectedStateCodes.has(getStateKey(s)))}
                  onSelectAll={(e) => {
                    if (e.target.checked) {
                      setSelectedStateCodes(new Set(visibleStates.map(getStateKey)));
                      if (visibleStates.length > 0) {
                        const firstState = visibleStates[0];
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
                      const idx = (visibleStates || []).findIndex(s => getStateKey(s) === key);
                      setStateCurrentIndex(idx >= 0 ? idx : 0);
                      
                      // Load postals if not loaded, otherwise select them
                      if (!item.postalCodes || item.postalCodes.length === 0) {
                        loadStateDetails(parentCountryCode, item);
                      } else {
                        const firstPostal = item.postalCodes[0] || null;
                        setSelectedPostal(firstPostal);
                        setPostalCurrentIndex(0);
                      }
                    } else {
                      // It was unchecked.
                      // Remove its postal codes from selectedPostalCodes
                      setSelectedPostalCodes(prev => {
                        const next = new Set(prev);
                        (item.postalCodes || []).forEach(p => next.delete(getPostalKey(p)));
                        return next;
                      });
                      
                      // If the unchecked state was the active selectedState, switch to another checked one if available.
                      // Do not nullify selectedState if no states are checked so layout is preserved.
                      if (selectedState && getStateKey(selectedState) === key) {
                        if (newIds.size > 0) {
                          const nextKey = Array.from(newIds)[newIds.size - 1];
                          const nextState = visibleStates.find(s => getStateKey(s) === nextKey);
                          if (nextState) {
                            setSelectedState(nextState);
                            const parentCountryCode = nextState.countryCode || selectedCountry?.countryCode;
                            const idx = (visibleStates || []).findIndex(s => getStateKey(s) === nextKey);
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
      )}

      {/* LEVEL 3: POSTAL CODE */}
      {selectedState && (
        <SecondaryContainer
          title="Postal Code"
          className="mt-3 shadow-sm bg-white border border-slate-200/80 rounded-xl"
        >
          <CountryToolbar
            isFormView={isPostalFormView}
            handleNavigate={handlePostalNavigate}
            totalRecords={selectedStateCodes.size > 0 ? visiblePostalCodes.length : 0}
            selectedRow={selectedStateCodes.size > 0 ? selectedPostal : null}
            selectedCount={selectedPostalCodes.size}
            searchValue={postalSearchValue}
            setSearchValue={setPostalSearchValue}
            loading={loading || selectedStateCodes.size === 0}
            clipboard={postalClipboard}
            actions={{
              onAdd: handlePostalAdd,
              onSave: handleSaveAll,
              onDelete: handlePostalDelete,
              onCopy: handlePostalCopy,
              onClear: handleDiscard,
              onPaste: handlePostalPaste,
              onToggleView: () => {
                const postals = visiblePostalCodes;
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

          <div className="mt-1.5 text-xs">
            {!isPostalFormView ? (
              <div className="bg-white border border-gray-200 p-2">
                <ReusableTable
                  data={selectedStateCodes.size > 0 ? visiblePostalCodes : []}
                  columns={postalColumns}
                  selectedRows={visiblePostalCodes.filter(p => selectedPostalCodes.has(getPostalKey(p)))}
                  onSelectAll={(e) => {
                    if (e.target.checked) {
                      setSelectedPostalCodes(new Set(visiblePostalCodes.map(getPostalKey)));
                      if (visiblePostalCodes.length > 0) {
                        setSelectedPostal(visiblePostalCodes[0]);
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
                      const idx = (visiblePostalCodes || []).findIndex(p => getPostalKey(p) === key);
                      setPostalCurrentIndex(idx >= 0 ? idx : 0);
                    } else {
                      if (selectedPostal && getPostalKey(selectedPostal) === key) {
                        if (newIds.size > 0) {
                          const nextKey = Array.from(newIds)[newIds.size - 1];
                          const nextPostal = visiblePostalCodes.find(p => getPostalKey(p) === nextKey);
                          if (nextPostal) {
                            setSelectedPostal(nextPostal);
                            const idx = (visiblePostalCodes || []).findIndex(p => getPostalKey(p) === nextKey);
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
      )}
    </div>
  );
};

export default ManageCountry;
