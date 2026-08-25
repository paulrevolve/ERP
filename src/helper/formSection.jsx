import { Search } from "lucide-react";
import React, { useState } from "react";

/*
 * ============================================================
 * FORM WIDTH CONFIGURATION
 * ============================================================
 * Change these values here instead of searching through the
 * entire file whenever you want to adjust field widths.
 *
 * Tailwind examples:
 *   "w-[160px]"
 *   "w-[180px]"
 *   "w-[200px]"
 */
const FORM_STYLES = {
  labelWidth: "w-[90px]", // Fixed label column for all standard fields
  fieldWidth: "flex-1", // Normal text inputs + search selects
  compactWidth: "w-[120px]", // Compact inputs + compact search selects
};

export const FormSection = ({ title, children, className = "" }) => {
  return (
    <div
      className={`relative rounded border border-[#17414d]/40 py-2 px-3 bg-[#e5f3fb]/40 ${className}`}
    >
      {title && (
        <span className="absolute -top-2.5 left-4 px-2 bg-[#e5f3fb]/70 text-[10px] font-medium text-[#17414d] rounded-md">
          {title}
        </span>
      )}
      {children}
    </div>
  );
};

export const FormInput = ({
  label,
  required,
  type = "text",
  value,
  checked,
  onChange,
  readOnly,
  disabled,
  className = "",
  placeholder,
  labelWidth = null,
  compact = false,
}) => {
  const isClickable = type === "checkbox" || type === "radio";

  return (
    <div className="flex items-center gap-2 mt-1 ml-1">
      {label && (
        <label
          style={labelWidth ? { width: labelWidth } : undefined}
          className={`f-head font-[400] text-[10px] text-black whitespace-nowrap shrink-0 ${
            labelWidth ? "" : FORM_STYLES.labelWidth
          }`}
        >
          {label} {required && "*"}
        </label>
      )}

      <input
        type={type}
        {...(isClickable ? { checked: checked } : { value: value })}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className={`border outline-none p-0.5 rounded font-light text-[10px] transition-all
          ${
            isClickable
              ? "w-3 h-3 cursor-pointer accent-blue-500"
              : compact
                ? `${FORM_STYLES.compactWidth} border-gray-300`
                : `${FORM_STYLES.fieldWidth} border-gray-300`
          }
          ${
            readOnly || disabled
              ? "bg-gray-100 cursor-not-allowed text-gray-400"
              : "bg-white focus:border-[#17414d]"
          }
          ${className}`}
      />
    </div>
  );
};

export const FormSearchSelect = ({
  label,
  value,
  options,
  onSelect,
  displayKey,
  secondaryKey,
  disabled,
  placeholder = "",
  labelWidth = null,
  compact = false,
  className = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const selectedOption = options?.find((opt) => {
    const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey]];

    return candidateKeys.some((key) => String(key) === String(value));
  });

  const filteredOptions = (options || []).filter((opt) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return true;

    const mainValue = String(opt[displayKey] || "").toLowerCase();

    const subValue = secondaryKey
      ? String(opt[secondaryKey] || "").toLowerCase()
      : "";

    return mainValue.includes(search) || subValue.includes(search);
  });

  const inputValue = isTyping
    ? searchTerm
    : selectedOption
      ? selectedOption[displayKey]
      : searchTerm || value || "";

  return (
    <div className="flex items-center gap-2 mt-1 ml-1">
      {label && (
        <label
          style={labelWidth ? { width: labelWidth } : undefined}
          className={`f-head font-[400] text-[10px] text-black whitespace-nowrap shrink-0 ${
            labelWidth ? "" : FORM_STYLES.labelWidth
          }`}
        >
          {label}
        </label>
      )}

      <div
        className={`relative ${
          compact ? FORM_STYLES.compactWidth : FORM_STYLES.fieldWidth
        } ${className}`}
      >
        <div className="relative group flex items-center">
          <input
            type="text"
            disabled={disabled}
            className={`border outline-none w-full border-gray-300 pl-2 pr-8 py-0.5 rounded text-[10px]
              ${
                disabled
                  ? "bg-gray-100 cursor-not-allowed"
                  : "bg-white focus:border-[#17414d]"
              }`}
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => {
              setIsTyping(true);
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onBlur={() => {
              setIsTyping(false);
            }}
            onFocus={() => !disabled && setShowDropdown(true)}
          />

          <div
            className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
            onClick={() => !disabled && setShowDropdown(!showDropdown)}
          >
            <Search size={12} />
          </div>
        </div>

        {showDropdown && !disabled && (
          <>
            <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
                    onClick={() => {
                      onSelect(opt);
                      setSearchTerm("");
                      setShowDropdown(false);
                      setIsTyping(false);
                    }}
                  >
                    <span className="font-[400] text-black">
                      {opt[displayKey]}
                    </span>

                    {secondaryKey && opt[secondaryKey] && (
                      <span className="text-gray-400 ml-2">
                        ({opt[secondaryKey]})
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 text-[10px] text-gray-400 italic text-center">
                  No matches
                </div>
              )}
            </div>

            <div
              className="fixed inset-0 z-[90]"
              onClick={() => setShowDropdown(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export const ActionDetailButton = ({
  onClick,
  disabled,
  label,
  icon: Icon,
  className = "",
  isActive,
}) => {
  return (
    <div className={`px-1 pb-1 ${className}`}>
      <button
        disabled={disabled}
        onClick={onClick}
        // className={`
        //   flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-md border
        //   transition-all duration-200
        //   ${
        //     !disabled
        //       ? "bg-white border-[#17414d] text-[#17414d] hover:bg-[#17414d] hover:text-white cursor-pointer active:scale-95"
        //       : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
        //   }
        // `}
        className={`flex items-center gap-2 text-[10px] font-semibold cursor-pointer px-1.5 py-0.5 rounded-md border
          transition-all duration-200
        ${
          isActive
            ? "bg-[#17414d] text-white border-[#17414d]"
            : "bg-white text-gray-700 border-gray-200 hover:border-[#17414d]/50 hover:bg-gray-50"
        } ${className}`}
      >
        {Icon && <Icon size={14} />}
        <span>{label}</span>
      </button>
    </div>
  );
};

export const FormSearchSelectInline = ({
  value,
  options,
  onSelect,
  displayKey,
  disabled,
  className = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const filtered = options.filter((opt) =>
    (opt[displayKey] || "").toLowerCase().includes(localSearch.toLowerCase()),
  );

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          readOnly={!showDropdown} // Toggle readonly to allow typing only when open
          disabled={disabled}
          className={`w-full border outline-none border-gray-200 pl-2 pr-8 py-1.5 rounded text-[11px] 
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white focus:border-[#17414d]"}`}
          value={
            showDropdown
              ? localSearch
              : value !== undefined && value !== null
                ? value
                : ""
          }
          placeholder={showDropdown ? "Search columns..." : ""}
          onChange={(e) => setLocalSearch(e.target.value)}
          onFocus={() => !disabled && setShowDropdown(true)}
        />
        <div
          className="absolute right-0 px-2.5 cursor-pointer text-gray-400"
          onClick={() => !disabled && setShowDropdown(!showDropdown)}
        >
          <Search size={12} />
        </div>
      </div>

      {showDropdown && !disabled && (
        <>
          <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-2 text-[10px] hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none"
                  onClick={() => {
                    onSelect(opt);
                    setLocalSearch("");
                    setShowDropdown(false);
                  }}
                >
                  <span className="font-medium text-gray-700">
                    {opt[displayKey]}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-[10px] text-gray-400 italic text-center">
                No results
              </div>
            )}
          </div>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setShowDropdown(false)}
          />
        </>
      )}
    </div>
  );
};
