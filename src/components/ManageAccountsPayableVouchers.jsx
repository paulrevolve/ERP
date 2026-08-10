import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  MoreVertical, X, Search, FileText, FileSpreadsheet, MapPin, 
  CreditCard, Repeat, ShieldCheck, Settings, RefreshCw, Calculator, User, Layers,
  Calendar, UserCheck, Coins, Globe, Receipt
} from "lucide-react";
import { MainContainer, Toolbar, SecondaryContainer } from "../helper/container";
import { ReusableTable } from "../helper/tableSection";
import api from "../utils/api";
import { backendUrl } from "./config";

const PaymentVoucherIcon = () => (
  <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm -mr-2.5 flex items-center justify-center">
    <Receipt size={18} className="text-blue-500" />
  </div>
);

let isCurrentRecordApprovedLocked = false;

const FormSection = ({ title, children, className = "" }) => {
  return (
    <div className={`relative rounded border border-slate-200 bg-white py-3 px-3 shadow-none ${className}`}>
      {title && (
        <div className="flex items-center gap-2 pb-1.5 mb-2.5 border-b border-slate-200 select-none">
          <span className="text-xs font-bold text-gray-700">
            {title}
          </span>
        </div>
      )}
      <div className="space-y-1.5">
        {children}
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
  placeholder,
  horizontal,
  inputClassName = "",
}) => {
  const isApproveCheckbox = label === "Approved" || label === "Approve" || label === "appr";
  const actualReadOnly = readOnly || (isCurrentRecordApprovedLocked && !isApproveCheckbox);
  const actualDisabled = disabled || (isCurrentRecordApprovedLocked && !isApproveCheckbox && type === "checkbox");

  const isClickable = type === "checkbox" || type === "radio";

  if (isClickable) {
    return (
      <div className="w-full flex items-center pt-0.5 pb-0.5">
        <label className="flex items-center gap-2 px-2 py-1 rounded border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer transition-all duration-150 select-none w-full">
          <input
            type={type}
            checked={checked}
            onChange={onChange}
            disabled={actualDisabled}
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
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        )}
        <div className="w-3/5">
          <input
            type={type}
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            readOnly={actualReadOnly}
            disabled={actualDisabled}
            placeholder={placeholder}
            className={`w-full px-2 py-0.5 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
              ${actualReadOnly || actualDisabled 
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
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={actualReadOnly}
        disabled={actualDisabled}
        placeholder={placeholder}
        className={`w-full px-2 py-0.5 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
          ${actualReadOnly || actualDisabled 
            ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed" 
            : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          }`}
      />
    </div>
  );
};

const FormSearchSelect = ({
  label,
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

  const searchVal = setSearchTerm ? searchTerm : localSearch;
  const setSearchVal = setSearchTerm ? setSearchTerm : setLocalSearch;

  const selectedOption = options?.find((opt) => {
    const candidateKeys = [opt.value, opt[displayKey], opt[secondaryKey]];
    return candidateKeys.some((key) => String(key) === String(value));
  });

  const filteredOptions = (options || []).filter((opt) => {
    const search = searchVal.toLowerCase().trim();
    if (!search) return true;
    const mainValue = String(opt[displayKey] || "").toLowerCase();
    const subValue = secondaryKey ? String(opt[secondaryKey] || "").toLowerCase() : "";
    return mainValue.includes(search) || subValue.includes(search);
  });

  const inputValue = isTyping
    ? searchVal
    : selectedOption
    ? selectedOption[displayKey]
    : searchVal || value || "";

  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && (
        <span className="text-xs font-semibold text-slate-700 select-none">
          {label}
        </span>
      )}
      <div className="relative">
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
          onBlur={() => {
            setTimeout(() => {
              setIsTyping(false);
            }, 200);
          }}
          onFocus={() => !disabled && setShowDropdown(true)}
          className={`w-full pl-2 pr-8 py-0.5 rounded border text-[11px] font-medium transition-all duration-150 outline-none
            ${disabled
              ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            }`}
        />
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400"
          onClick={() => !disabled && setShowDropdown(!showDropdown)}
        >
          <Search size={12} />
        </div>

        {showDropdown && !disabled && (
          <>
            <div className="absolute left-0 top-full z-[100] w-full mt-1 bg-white border border-slate-200 rounded shadow-lg max-h-40 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 text-[11px] hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none font-medium text-slate-700"
                    onClick={() => {
                      onSelect(opt);
                      setSearchVal("");
                      setShowDropdown(false);
                    }}
                  >
                    <span>{opt[displayKey]}</span>
                    {secondaryKey && opt[secondaryKey] && (
                      <span className="text-slate-400 ml-2">({opt[secondaryKey]})</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-[11px] text-slate-400 italic text-center">
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

const masterColumns = [
  { id: "voucher", key: "voucher", label: "Voucher *" },
  { id: "fiscalYear", key: "fiscalYear", label: "Fiscal Year *" },
  { id: "period", key: "period", label: "Period *" },
  { id: "subperiod", key: "subperiod", label: "Subperiod *" },
  { id: "vendor", key: "vendor", label: "Vendor *" },
  { id: "vendorName", key: "vendorName", label: "Vendor Name" },
  { id: "terms", key: "terms", label: "Terms" },
  { id: "approved", key: "approved", label: "Approved", type: "checkbox" },
  { id: "template", key: "template", label: "Template", type: "checkbox" },

  // Header Info columns
  { id: "invoiceNumber", key: "invoiceNumber", label: "Invoice Number" },
  { id: "invoiceDate", key: "invoiceDate", label: "Invoice Date", type: "date" },
  { id: "invoiceAmount", key: "invoiceAmount", label: "Invoice Amount" },
  { id: "dueDate", key: "dueDate", label: "Due Date", type: "date" },
  { id: "dueAmount", key: "dueAmount", label: "Due Amount" },
  { id: "discountPercent", key: "discountPercent", label: "Discount Percent" },
  { id: "discountDate", key: "discountDate", label: "Discount Date", type: "date" },
  { id: "discountAmount", key: "discountAmount", label: "Discount Amount" },
  { id: "voucherType", key: "voucherType", label: "Voucher Type" },
  { id: "originalVoucher", key: "originalVoucher", label: "Original Voucher" },
  { id: "accountDescriptionAp", key: "accountDescriptionAp", label: "A/P Account" },
  { id: "accountDescriptionCash", key: "accountDescriptionCash", label: "Cash Account" },
  { id: "voucherLineRecalcMethod", key: "voucherLineRecalcMethod", label: "Recalc Method" },
  { id: "whenSalesTaxChanged", key: "whenSalesTaxChanged", label: "Sales Tax Method" },
  { id: "totalTax", key: "totalTax", label: "Total Tax" },
  { id: "remainingBalance", key: "remainingBalance", label: "Remaining Balance" },

  // Details columns
  { id: "taxId", key: "taxId", label: "Tax ID" },
  { id: "taxingDate", key: "taxingDate", label: "Taxing Date", type: "date" },
  { id: "taxLocation", key: "taxLocation", label: "Tax Location" },
  { id: "retainageRate", key: "retainageRate", label: "Retainage Rate" },
  { id: "retainageAmount", key: "retainageAmount", label: "Retainage Amount" },
  { id: "referencePo", key: "referencePo", label: "PO" },
  { id: "referencePoRelease", key: "referencePoRelease", label: "PO Release" },
  { id: "recurredVoucher", key: "recurredVoucher", label: "Recurred Voucher", type: "checkbox" },
  { id: "holdVoucher", key: "holdVoucher", label: "Hold Voucher", type: "checkbox" },
  { id: "payWhenPaid", key: "payWhenPaid", label: "Pay When Paid", type: "checkbox" },
  { id: "separateCheck", key: "separateCheck", label: "Separate Check", type: "checkbox" },
  { id: "overBudget", key: "overBudget", label: "Over Budget", type: "checkbox" },
  { id: "anticipatedPayDate", key: "anticipatedPayDate", label: "Anticipated Pay Date", type: "date" },
  { id: "expenseReportId", key: "expenseReportId", label: "Expense Report ID" },
  { id: "cisCode", key: "cisCode", label: "CIS Code" },
  { id: "approver", key: "approver", label: "Approver" },
  { id: "entryUser", key: "entryUser", label: "User" },
  { id: "entryDate", key: "entryDate", label: "Date" },

  // Address columns
  { id: "payVendor", key: "payVendor", label: "Pay Vendor" },
  { id: "payVendorName", key: "payVendorName", label: "Pay Vendor Name" },
  { id: "jointPayee", key: "jointPayee", label: "Joint Payee" },
  { id: "addressCode", key: "addressCode", label: "Address Code" },
  { id: "addressLine1", key: "addressLine1", label: "Address Line 1" },
  { id: "addressLine2", key: "addressLine2", label: "Address Line 2" },
  { id: "addressLine3", key: "addressLine3", label: "Address Line 3" },
  { id: "addressCity", key: "addressCity", label: "Address City" },
  { id: "addressState", key: "addressState", label: "Address State/Province" },
  { id: "addressPostalCode", key: "addressPostalCode", label: "Address Postal Code" },
  { id: "addressCountry", key: "addressCountry", label: "Address Country" },
  { id: "addressPassword", key: "addressPassword", label: "Address Password" },

  // Check columns
  { id: "checkCashAcctDesc", key: "checkCashAcctDesc", label: "Payment Cash Account Description" },
  { id: "checkNumber", key: "checkNumber", label: "Payment Number" },
  { id: "checkDate", key: "checkDate", label: "Payment Date", type: "date" },
  { id: "checkDiscountTaken", key: "checkDiscountTaken", label: "Payment Discount Taken" },
  { id: "checkAmount", key: "checkAmount", label: "Payment Amount" },
  { id: "checkPayTransType", key: "checkPayTransType", label: "Payment Transaction Type" },
  { id: "checkPayRefCode", key: "checkPayRefCode", label: "Payment Reference Code" },
  { id: "checkPostFiscalYear", key: "checkPostFiscalYear", label: "Payment Post Fiscal Year" },
  { id: "checkPostPeriod", key: "checkPostPeriod", label: "Payment Post Period" },
  { id: "checkPostSubperiod", key: "checkPostSubperiod", label: "Payment Post Subperiod" },

  // Recur columns
  { id: "recurCode", key: "recurCode", label: "Recurring Code" },
  { id: "recurStartFiscalYear", key: "recurStartFiscalYear", label: "Recurring Start Fiscal Year" },
  { id: "recurStartPeriod", key: "recurStartPeriod", label: "Recurring Start Period" },
  { id: "recurStartSubperiod", key: "recurStartSubperiod", label: "Recurring Start Subperiod" },
  { id: "recurStartEndingDate", key: "recurStartEndingDate", label: "Recurring Start Ending Date" },
  { id: "recurEndFiscalYear", key: "recurEndFiscalYear", label: "Recurring End Fiscal Year" },
  { id: "recurEndPeriod", key: "recurEndPeriod", label: "Recurring End Period" },
  { id: "recurEndSubperiod", key: "recurEndSubperiod", label: "Recurring End Subperiod" },
  { id: "recurEndEndingDate", key: "recurEndEndingDate", label: "Recurring End Ending Date" },
  { id: "recurLastVchrFiscalYear", key: "recurLastVchrFiscalYear", label: "Recurring Last Voucher Fiscal Year" },
  { id: "recurLastVchrPeriod", key: "recurLastVchrPeriod", label: "Recurring Last Voucher Period" },
  { id: "recurLastVchrSubperiod", key: "recurLastVchrSubperiod", label: "Recurring Last Voucher Subperiod" },

  // Subcontractor Info columns
  { id: "subcontractorInvoicePopDate", key: "subcontractorInvoicePopDate", label: "Invoice Period of Performance Date", type: "date" },
  { id: "subcontractorDeliveryValue", key: "subcontractorDeliveryValue", label: "Delivery Value" },
  { id: "subcontractorInvoiceType", key: "subcontractorInvoiceType", label: "Invoice Type" },

  // Notes/Doc Loc columns
  { id: "notesPrintOnCheck", key: "notesPrintOnCheck", label: "Print Notes on Check", type: "checkbox" },
  { id: "notesText", key: "notesText", label: "Blank Laser Check Notes" },
  { id: "notesDocLocation", key: "notesDocLocation", label: "Document Location" },

  // Entry Defaults columns
  { id: "defaultAllowPayVendorWarning", key: "defaultAllowPayVendorWarning", label: "Allow Pay Vendor on Warning Status", type: "checkbox" },
  { id: "defaultAddDiscDiffFirstLine", key: "defaultAddDiscDiffFirstLine", label: "Add Discount Difference to First Line", type: "checkbox" },
  { id: "defaultUseAccountDesc", key: "defaultUseAccountDesc", label: "Use Account Description", type: "checkbox" },
  { id: "defaultUseOwningOrg", key: "defaultUseOwningOrg", label: "Use Owning Org", type: "checkbox" },
  { id: "defaultAllowDuplicateInvNum", key: "defaultAllowDuplicateInvNum", label: "Allow Duplicate Invoice Numbers", type: "checkbox" },
  { id: "defaultSaveTeVoucher", key: "defaultSaveTeVoucher", label: "Save as TE Voucher", type: "checkbox" }
];

const accountOptions = [
  { value: "50100", label: "50100 - Travel Expense" },
  { value: "50200", label: "50200 - Office Supplies" },
  { value: "50300", label: "50300 - Rent Expense" }
];

const organizationOptions = [
  { value: "10-100", label: "10-100 - Sales & Marketing" },
  { value: "10-200", label: "10-200 - General Admin" }
];

const projectOptions = [
  { value: "PRJ-900", label: "PRJ-900 - Internal Operations" },
  { value: "PRJ-901", label: "PRJ-901 - Client Projects" }
];

const refNoOptions = [
  { value: "REF-01", label: "REF-01 - Reference 1" },
  { value: "REF-02", label: "REF-02 - Reference 2" }
];

const supplyCodeOptions = [
  { value: "SUP-01", label: "SUP-01 - Standard Supply" },
  { value: "SUP-02", label: "SUP-02 - Excluded Supply" }
];

const taxVatOptions = [
  { value: "CA", label: "CA - CALIFORNIA (10.25%)", rate: "10.25" },
  { value: "MD", label: "MD - MARYLAND (6.00%)", rate: "6.00" },
  { value: "MD0", label: "MD0 - MARYLAND Zero Tax for Exempt (0.00%)", rate: "0.00" },
  { value: "VA", label: "VA - VIRGINIA (6.00%)", rate: "6.00" }
];

const type1099Options = [
  { value: "MISC", label: "MISC" },
  { value: "NEC", label: "NEC" }
];

const state1099Options = [
  { value: "CA", label: "CA" },
  { value: "NY", label: "NY" },
  { value: "TX", label: "TX" }
];

const taxabilityOptions = [
  { value: "T", label: "T - Sales/VAT Taxable", code: "T" },
  { value: "R", label: "R - Reverse Charge / Use Tax", code: "R" },
  { value: "N", label: "N - Non-Taxable / Exempt", code: "N" }
];

const childColumns = [
  { id: "lineNo", key: "lineNo", label: "Line No", type: "readOnly-text", width: "80px" },
  {
    id: "account",
    key: "account",
    label: "Account",
    type: "search-select",
    options: accountOptions,
    displayKey: "label",
    width: "220px"
  },
  { id: "accountName", key: "accountName", label: "Account Name", type: "readOnly-text", width: "180px" },
  {
    id: "organization",
    key: "organization",
    label: "Organization",
    type: "search-select",
    options: organizationOptions,
    displayKey: "label",
    width: "220px"
  },
  { id: "organizationName", key: "organizationName", label: "Organization Name", type: "readOnly-text", width: "180px" },
  {
    id: "project",
    key: "project",
    label: "Project",
    type: "search-select",
    options: projectOptions,
    displayKey: "label",
    width: "220px"
  },
  { id: "projectName", key: "projectName", label: "Project Name", type: "readOnly-text", width: "180px" },
  { id: "projAcctAbbrev", key: "projAcctAbbrev", label: "Project Account", type: "readOnly-text", width: "150px" },
  { id: "costAmount", key: "costAmount", label: "Cost Amount", type: "number", width: "140px" },
  {
    id: "taxability",
    key: "taxability",
    label: "Taxability",
    type: "datalist",
    placeholder: "Select or type T, R, or N...",
    width: "140px",
    options: [
      { value: "T", label: "T - Sales/VAT Taxable" },
      { value: "R", label: "R - Reverse Charge / Use Tax" },
      { value: "N", label: "N - Non-Taxable / Exempt" }
    ]
  },
  {
    id: "taxVatCode",
    key: "taxVatCode",
    label: "Tax/VAT Code",
    type: "search-select",
    options: taxVatOptions,
    displayKey: "label",
    width: "220px"
  },
  { id: "taxRate", key: "taxRate", label: "Tax Rate (%)", type: "number", width: "120px" },
  { id: "salesVatTaxAmt", key: "salesVatTaxAmt", label: "Sales/VAT Tax Amt", type: "readOnly-text", width: "140px" },
  { id: "useReverseTaxAmt", key: "useReverseTaxAmt", label: "Use/Reverse Tax Amt", type: "readOnly-text", width: "140px" },
  { id: "recoveryRate", key: "recoveryRate", label: "Recovery Rate (%)", type: "number", width: "130px" },
  { id: "recoveryAmt", key: "recoveryAmt", label: "VAT Reclaim Amount", type: "readOnly-text", width: "150px" },
  { id: "totBeforeDisc", key: "totBeforeDisc", label: "Tot Before Disc", type: "number", width: "140px" },
  { id: "discount", key: "discount", label: "Discount", type: "readOnly-text", width: "130px" },
  { id: "totalAmt", key: "totalAmt", label: "Total Amt", type: "number", width: "140px" },
  { id: "vendor1099", key: "vendor1099", label: "Vendor 1099's", type: "checkbox" },
  {
    id: "type1099",
    key: "type1099",
    label: "1099 Type",
    type: "select",
    optionValue: "optionValue",
    optionLabel: "optionLabel",
    options: [
      { optionValue: "MISC", optionLabel: "MISC" },
      { optionValue: "NEC", optionLabel: "NEC" }
    ],
    placeholder: "Select..."
  },
  { id: "state1099", key: "state1099", label: "1099 State" },
  { id: "description", key: "description", label: "Description" },
  { id: "notes", key: "notes", label: "Notes", type: "text" },
  { id: "orgAbbrev", key: "orgAbbrev", label: "Organization", type: "readOnly-text" },
  { id: "projAbbrev", key: "projAbbrev", label: "Project", type: "readOnly-text" },
  { id: "refNo1", key: "refNo1", label: "Ref No 1" },
  { id: "refNo1Name", key: "refNo1Name", label: "Ref No 1 Name", type: "readOnly-text" },
  { id: "refNo2", key: "refNo2", label: "Ref No 2" },
  { id: "refNo2Name", key: "refNo2Name", label: "Ref No 2 Name", type: "readOnly-text" },
  { id: "cisWh", key: "cisWh", label: "CIS W/H", type: "checkbox" },
  { id: "cisRpt", key: "cisRpt", label: "CIS Rpt", type: "checkbox" },
  {
    id: "supplyCode",
    key: "supplyCode",
    label: "Supply Code",
    type: "search-select",
    options: supplyCodeOptions,
    displayKey: "label"
  }
];

const apiBaseUrl = `${backendUrl}/api/accounts-payable-vouchers`;
const masterDataBaseUrl = "https://finaxis-dev.onrender.com";
const defaultCompanyId = "1";
const defaultFiscalYear = "2027";
const defaultPeriod = "1";
const defaultSubperiod = "1";
const defaultTerms = "AABBCC";
const validTerms = [defaultTerms];
const defaultUserId = "156.K.S";

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const cleanValue = String(value).replace(/%/g, "").replace(/,/g, "").trim();
  const parsed = Number(cleanValue);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const calculateRowUpdates = (item) => {
  const cost = toNumber(item.costAmount || 0);
  const taxRate = toNumber(item.taxRate || 0);
  const discount = toNumber(item.discount || 0);
  const recoveryRate = toNumber(item.recoveryRate || 100);

  let salesTax = 0;
  let useReverseTax = 0;
  let totBeforeDisc = cost;

  const taxability = String(item.taxability || "").trim().toUpperCase();

  if (taxability === "T" || taxability === "S" || taxability === "TAXABLE") {
    salesTax = (cost * taxRate) / 100;
    totBeforeDisc = cost + salesTax;
  } else if (taxability === "R" || taxability === "U" || taxability === "USE/REVERSE TAX") {
    useReverseTax = (cost * taxRate) / 100;
    totBeforeDisc = cost; // Use/Reverse Tax is NOT added to Vendor Payable totBeforeDisc
  } else {
    salesTax = 0;
    useReverseTax = 0;
    totBeforeDisc = cost;
  }

  const recoveryAmt = (salesTax * recoveryRate) / 100;
  const totalAmt = totBeforeDisc - discount;

  // Determine labor amount (sync with costAmount unless explicitly overridden with a valid non-zero amount)
  const currentLaborAmt = item.laborAmountExplicit ? toNumber(item.laborAmount, cost) : cost;
  const finalLaborAmount = currentLaborAmt > 0 ? currentLaborAmt.toFixed(2) : cost.toFixed(2);

  return {
    salesVatTaxAmt: salesTax.toFixed(2),
    totBeforeDisc: totBeforeDisc.toFixed(2),
    totalAmt: totalAmt.toFixed(2),
    useReverseTaxAmt: useReverseTax.toFixed(2),
    recoveryAmt: recoveryAmt.toFixed(2),
    vatRecoveryAmt: recoveryAmt.toFixed(2),
    laborAmount: finalLaborAmount
  };
};

const updateHeaderBalances = (record) => {
  const invAmt = toNumber(record.invoiceAmount || 0);
  const sumTax = (record.detailLines || []).reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt || 0) + toNumber(line.useReverseTaxAmt || 0), 0);
  const discAmt = toNumber(record.discountAmount || 0);
  const paidAmt = toNumber(record.checkAmount || 0);

  // Calculate sum of totalAmt of all detail lines
  const computedDueAmt = (record.detailLines || []).reduce((sum, line) => sum + toNumber(line.totalAmt || 0), 0);
  const finalDueAmt = record.detailLines && record.detailLines.length > 0 ? computedDueAmt : (invAmt + sumTax - discAmt);

  const bal = finalDueAmt - paidAmt;
  return {
    ...record,
    totalTax: sumTax.toFixed(2),
    dueAmount: finalDueAmt.toFixed(2),
    remainingBalance: bal.toFixed(2)
  };
};


const toDateTime = (value) => {
  if (!value) return new Date().toISOString();
  if (String(value).includes("T")) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return `${value}T00:00:00`;

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? new Date().toISOString() : new Date(parsed).toISOString();
};





const firstCode = (value, fallback = "") => {
  if (!value) return fallback;
  return String(value).split(" - ")[0].trim() || fallback;
};

const toNullableDateTime = (value) => {
  if (!value) return null;
  return toDateTime(value);
};

const normalizeAccountOptions = (items = []) => items
  .map(item => {
    const value = item.acctId ?? item.accountId ?? item.account_id ?? item.id ?? item.value;
    const name = item.acctName ?? item.accountName ?? item.account_name ?? item.name ?? item.description ?? "";
    if (!value) return null;
    return { value: String(value), label: name ? `${value} - ${name}` : String(value), name: String(name) };
  })
  .filter(Boolean);

const normalizeOrganizationOptions = (items = []) => items
  .map(item => {
    const value = item.orgId ?? item.organizationId ?? item.org_id ?? item.id ?? item.value;
    const name = item.orgName ?? item.organizationName ?? item.org_name ?? item.name ?? item.description ?? "";
    if (!value) return null;
    return { value: String(value), label: name ? `${value} - ${name}` : String(value), name: String(name) };
  })
  .filter(Boolean);

const normalizeProjectOptions = (items = []) => items
  .map(item => {
    const value = item.projectId ?? item.projId ?? item.project_id ?? item.id ?? item.value;
    const name = item.projectName ?? item.projName ?? item.project_name ?? item.name ?? item.description ?? "";
    if (!value) return null;
    return { value: String(value), label: name ? `${value} - ${name}` : String(value), name: String(name) };
  })
  .filter(Boolean);

const mapHeaderToRecord = (header, lines = []) => {
  const voucherKey = header.voucher_key;
  const invoiceAmount = header.invc_amt ?? header.cst_amt ?? 0;
  const salesTaxAmount = header.sales_tax_amt ?? 0;
  const discountAmount = header.disc_amt ?? 0;

  return {
    id: String(voucherKey),
    voucherKey,
    voucher: String(voucherKey ?? ""),
    fiscalYear: header.fy_cd ?? "",
    period: String(header.period_no ?? ""),
    subperiod: String(header.sub_period_no ?? ""),
    companyId: header.company_id ?? defaultCompanyId,
    vendor: header.vendor_id ?? "",
    vendorName: "",
    terms: header.terms_dc ?? "",
    approved: header.approved_fl ?? "N",
    template: header.recur_tmplt_fl ?? "N",
    invoiceNumber: header.invc_id ?? "",
    invoiceDate: header.invc_dt ? String(header.invc_dt).slice(0, 10) : "",
    invoiceAmount: String(invoiceAmount),
    dueDate: header.due_dt ? String(header.due_dt).slice(0, 10) : "",
    dueAmount: String(header.due_amt ?? invoiceAmount),
    discountPercent: String(header.disc_pct_rt ?? 0),
    discountDate: header.disc_dt ? String(header.disc_dt).slice(0, 10) : "",
    discountAmount: String(discountAmount),
    voucherType: header.s_voucher_type === "AP" ? "AP Voucher" : header.s_voucher_type ?? "AP Voucher",
    originalVoucher: String(header.orig_voucher_no ?? ""),
    accountDescriptionAp: [header.ap_account_id, header.ap_org_id].filter(Boolean).join(" - "),
    accountDescriptionCash: [header.cash_account_id, header.cash_org_id].filter(Boolean).join(" - "),
    voucherLineRecalcMethod: "Recalculate Cost",
    whenSalesTaxChanged: "Recalculate Tot Before Disc",
    totalTax: String(salesTaxAmount),
    remainingBalance: String(header.due_amt ?? invoiceAmount),
    taxId: header.vat_tax_id ?? "",
    taxingDate: header.vat_tax_dt ? String(header.vat_tax_dt).slice(0, 10) : "",
    taxLocation: header.sales_tax_cd ?? "",
    retainageRate: String(header.rtn_rt ?? 0),
    retainageAmount: "0.00",
    referencePo: header.po_id ?? header.ext_po_id ?? "",
    referencePoRelease: String(header.po_rlse_no ?? header.ext_po_rlse_no ?? 0),
    recurredVoucher: header.recur_fl ?? "N",
    holdVoucher: header.hold_voucher_fl ?? "N",
    payWhenPaid: header.pay_when_paid_fl ?? "N",
    separateCheck: header.sep_chk_fl ?? "N",
    overBudget: header.ovr_bud_fl ?? "N",
    anticipatedPayDate: header.antic_pay_dt ? String(header.antic_pay_dt).slice(0, 10) : "",
    expenseReportId: header.exp_rpt_id ?? "",
    cisCode: header.cis_cd ?? "",
    approver: header.apprvr_user_id ?? "",
    entryUser: header.entr_user_id ?? defaultUserId,
    entryDate: header.entr_dtt ? String(header.entr_dtt).slice(0, 10) : "",
    payVendor: header.pay_vendor_id ?? header.vendor_id ?? "",
    payVendorName: "",
    jointPayee: header.jnt_pay_vendor_name ?? "",
    addressCode: header.pay_addr_dc ?? "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressCity: "",
    addressState: "",
    addressPostalCode: "",
    addressCountry: "",
    addressPassword: "",
    checkCashAcctDesc: header.cash_account_id ?? "",
    checkNumber: String(header.chk_no ?? ""),
    checkDate: header.chk_dt ? String(header.chk_dt).slice(0, 10) : "",
    checkDiscountTaken: String(header.disc_taken_amt ?? ""),
    checkAmount: String(header.chk_amt ?? ""),
    checkPayTransType: header.pay_trans_type ?? "None",
    checkPayRefCode: header.pay_ref_code ?? "",
    checkPostFiscalYear: header.chk_fy_cd ?? "",
    checkPostPeriod: String(header.chk_pd_no ?? ""),
    checkPostSubperiod: String(header.chk_sub_pd_no ?? ""),
    useTaxAmount: header.use_tax_amt ? String(header.use_tax_amt) : "0.00",
    recurCode: header.recur_voucher_dc ?? "",
    recurStartFiscalYear: header.start_fy_cd ?? "",
    recurStartPeriod: String(header.start_pd_no ?? ""),
    recurStartSubperiod: String(header.start_sub_pd_no ?? ""),
    recurStartEndingDate: "",
    recurEndFiscalYear: header.end_fy_cd ?? "",
    recurEndPeriod: String(header.end_pd_no ?? ""),
    recurEndSubperiod: String(header.end_sub_pd_no ?? ""),
    recurEndEndingDate: "",
    recurLastVchrFiscalYear: header.lst_voucher_fy_cd ?? "",
    recurLastVchrPeriod: String(header.lst_voucher_pd_no ?? ""),
    recurLastVchrSubperiod: String(header.lst_voucher_sub_pd_no ?? ""),
    subcontractorInvoicePopDate: header.invc_pop_dt ? String(header.invc_pop_dt).slice(0, 10) : "",
    subcontractorDeliveryValue: String(header.paywpd_amt ?? ""),
    subcontractorInvoiceType: "None",
    notesPrintOnCheck: header.print_note_fl ?? "N",
    notesText: header.notes ?? "",
    notesDocLocation: header.doc_location ?? "",
    notesDocLocationId: header.doc_location_id ?? "",
    notesDocFileName: header.doc_file_name ?? "",
    defaultAllowPayVendorWarning: "N",
    defaultAddDiscDiffFirstLine: "Y",
    defaultUseAccountDesc: "N",
    defaultUseOwningOrg: "Y",
    defaultAllowDuplicateInvNum: "N",
    defaultSaveTeVoucher: "N",
    detailLines: lines.map((l, idx) => mapLineToDetailLine(l, idx, invoiceAmount, header.disc_pct_rt ?? 0)),
    isDirty: false
  };
  return updateHeaderBalances(record);
};

const mapLineToDetailLine = (lineAggregate, index, parentInvoiceAmount = 0, parentDiscountPercent = 0) => {
  const line = lineAggregate.line || lineAggregate;
  const account = (lineAggregate.accounts || [])[0] || {};
  const labVendor = (lineAggregate.labVendors || [])[0] || {};
  const costAmount = toNumber(account.cst_amt ?? line.ext_cst_amt ?? line.net_amt ?? 0);
  const salesTaxAmount = toNumber(account.sales_tax_amt ?? line.sales_tax_amt ?? 0);
  const totalBeforeDiscount = toNumber(account.tot_bef_disc_amt ?? line.tot_bef_disc_amt ?? line.ext_cst_amt ?? 0);

  // Determine percentage properly
  let percentStr = "100.00";
  const rawPct = toNumber(account.cst_amt_pct_rt ?? 0);
  if (rawPct > 0) {
    percentStr = rawPct <= 1.0 ? (rawPct * 100).toFixed(2) : rawPct.toFixed(2);
  } else if (toNumber(parentInvoiceAmount) > 0) {
    percentStr = ((costAmount / toNumber(parentInvoiceAmount)) * 100).toFixed(2);
  }

  const discountAmount = (costAmount * toNumber(parentDiscountPercent)) / 100;
  const netAmount = totalBeforeDiscount - discountAmount;

  // Derive tax rate
  let derivedTaxRate = toNumber(line.sales_tax_pct_rt ?? line.tax_pct_rt ?? line.tax_rate ?? 0);
  if (derivedTaxRate === 0 && costAmount > 0 && salesTaxAmount > 0) {
    derivedTaxRate = (salesTaxAmount / costAmount) * 100;
  } else if (derivedTaxRate === 0 && line.sales_tax_cd) {
    const matchTax = taxVatOptions.find(t => t.value === line.sales_tax_cd);
    if (matchTax) derivedTaxRate = toNumber(matchTax.rate, 0);
  }

  // Handle recovery rate conversion (e.g., DB ratio 0.8 -> UI 80.00)
  const rawRecRate = toNumber(line.recovery_rt ?? account.recovery_rt ?? 100);
  const recoveryRateStr = (rawRecRate > 0 && rawRecRate <= 1.0) ? (rawRecRate * 100).toFixed(2) : rawRecRate.toFixed(2);
  const calculatedRecoveryAmt = (salesTaxAmount * toNumber(recoveryRateStr)) / 100;

  return {
    id: String(line.voucher_ln_key ?? `line-${index + 1}`),
    voucherLnKey: line.voucher_ln_key,
    voucherLnVendorKey: labVendor.voucher_ln_vendor_key,
    lineNo: String(line.voucher_ln_no ?? index + 1),
    account: account.account_id ?? "",
    accountName: account.acct_name ?? account.acctName ?? account.accountName ?? "",
    organization: account.org_id ?? "",
    organizationName: account.org_name ?? account.orgName ?? account.organizationName ?? "",
    project: account.project_id ?? "",
    projectName: account.proj_name ?? account.projectName ?? "",
    projAcctAbbrev: account.project_account_abbrv_cd ?? "",
    costAmount: costAmount.toFixed(2),
    percent: percentStr,
    taxability: line.taxable_fl === "T" || line.taxable_fl === "Y" || line.taxable_fl === "S" ? "T" : (line.taxable_fl === "R" || line.taxable_fl === "U" ? "R" : "N"),
    taxVatCode: line.sales_tax_cd ?? "",
    taxRate: derivedTaxRate.toFixed(2),
    salesVatTaxAmt: salesTaxAmount.toFixed(2),
    totBeforeDisc: totalBeforeDiscount.toFixed(2),
    discount: discountAmount.toFixed(2),
    totalAmt: netAmount.toFixed(2),
    useReverseTaxAmt: String(line.use_tax_amt ?? 0),
    recoveryRate: recoveryRateStr,
    recoveryAmt: calculatedRecoveryAmt.toFixed(2),
    vendor1099: account.ap_1099_fl ?? "N",
    type1099: account.s_ap_1099_type_cd ?? "",
    state1099: account.ap_1099_state_cd ?? "",
    description: line.voucher_ln_desc ?? "",
    notes: line.notes ?? "",
    orgAbbrev: account.org_abbrv_cd ?? "",
    projAbbrev: account.project_abbrv_cd ?? "",
    refNo1: account.ref1_id ?? "",
    refNo1Name: "",
    refNo2: account.ref2_id ?? "",
    refNo2Name: "",
    cisWh: line.cis_wh_fl ?? "N",
    cisRpt: line.cis_rpt_fl ?? "N",
    supplyCode: line.vat_supply_dc ?? "",
    dateOfSupply: line.vat_supply_dt ? String(line.vat_supply_dt).slice(0, 10) : "",
    unitOfMeasure: line.um_cd ?? "",
    subLine: labVendor.sub_ln_no ? String(labVendor.sub_ln_no) : String(line.voucher_ln_no ?? index + 1),
    vendorEmployee: labVendor.vend_empl_id ?? "",
    glc: labVendor.genl_lab_cat_cd ?? "",
    plc: labVendor.bill_lab_cat_cd ?? "",
    hours: labVendor.vendor_hrs ? String(labVendor.vendor_hrs) : "",
    laborAmount: labVendor.vendor_amt ? String(labVendor.vendor_amt) : costAmount.toFixed(2),
    vatRecoveryAmt: labVendor.recovery_amt ? String(labVendor.recovery_amt) : calculatedRecoveryAmt.toFixed(2),
    effectiveBillingDate: labVendor.effect_bill_dt ? String(labVendor.effect_bill_dt).slice(0, 10) : "",
    vendorLaborNotes: labVendor.notes ?? "",
    isDirty: false
  };
};

const compactDbObject = (obj) => Object.fromEntries(
  Object.entries(obj).filter(([, value]) => value !== null && value !== undefined && value !== "")
);

const normalizeTerms = (value) => validTerms.includes(value) ? value : defaultTerms;

const getVoucherSaveErrorMessage = (errorData) => {
  const detail = errorData?.detail || errorData?.title || (typeof errorData === "string" ? errorData : "");
  if (String(detail).toLowerCase().includes("terms_dc")) {
    return "Selected payment terms are not valid. Please choose a valid Terms value and save again.";
  }
  return detail || "Unable to save voucher.";
};

const buildVoucherPayload = (record) => {
  const amount = toNumber(record.invoiceAmount || record.costAmount, 0);
  const taxAmount = toNumber(record.totalTax, 0);
  const discountAmount = toNumber(record.discountAmount, 0);
  const dueAmount = toNumber(record.dueAmount, amount);
  const apAccount = firstCode(record.accountDescriptionAp, "20100");
  const cashAccount = firstCode(record.accountDescriptionCash, "10100");
  const now = new Date().toISOString();

  return {
    header: compactDbObject({
      vendor_id: record.vendor || "VND-1001",
      s_voucher_type: record.voucherType === "AP" || record.voucherType === "AP Voucher" ? "AP" : record.voucherType || "AP",
      terms_dc: normalizeTerms(record.terms),
      approved_fl: record.approved || "N",
      posted_ap_fl: "N",
      invc_id: record.invoiceNumber || `INV-${Date.now()}`.slice(0, 50),
      invc_dt: toDateTime(record.invoiceDate),
      entr_user_id: record.entryUser || defaultUserId,
      fy_cd: record.fiscalYear || defaultFiscalYear,
      period_no: toNumber(record.period, toNumber(defaultPeriod, 1)),
      sub_period_no: toNumber(record.subperiod, toNumber(defaultSubperiod, 1)),
      disc_pct_rt: toNumber(record.discountPercent, 0),
      cst_amt: amount,
      sales_tax_amt: taxAmount,
      sales_tax_cd: record.taxLocation || null,
      invc_amt: amount,
      disc_amt: discountAmount,
      due_amt: dueAmount,
      ap_account_id: apAccount,
      ap_org_id: "10-200",
      cash_account_id: cashAccount,
      cash_org_id: "10-200",
      taxable_fl: "N",
      chk_amt: toNumber(record.checkAmount, 0),
      chk_no: toNumber(record.checkNumber, 0),
      rtn_rt: toNumber(record.retainageRate, 0),
      rtn_nt: "",
      sep_chk_fl: record.separateCheck || "N",
      notes: record.notesText || "",
      s_sales_tax_src_cd: "N",
      pay_vendor_id: record.payVendor || record.vendor || "VND-1001",
      ext_po_id: record.referencePo || "",
      s_jnl_cd: "AP",
      voucher_no: toNumber(record.voucherNo, 0),
      orig_voucher_no: record.originalVoucher ? toNumber(record.originalVoucher, 0) : null,
      entr_dtt: toDateTime(record.entryDate) || now,
      hold_voucher_fl: record.holdVoucher || "N",
      recur_fl: record.recurredVoucher || "N",
      disc_taken_amt: toNumber(record.checkDiscountTaken, 0),
      apprvr_user_id: record.approver || null,
      antic_pay_dt: toNullableDateTime(record.anticipatedPayDate),
      exp_rpt_id: record.expenseReportId || null,
      dflt_ps_id: "",
      use_tax_amt: toNumber(record.useTaxAmount, 0),
      pay_when_paid_fl: record.payWhenPaid || "N",
      s_taxable_cd: "N",
      s_recpt_discr_cd: "N",
      s_po_discr_cd: "N",
      dm_fl: "N",
      dm_prntd_fl: "N",
      auto_create_fl: "N",
      modified_by: record.entryUser || defaultUserId,
      time_stamp: now,
      company_id: record.companyId || defaultCompanyId,
      cis_cd: record.cisCode || null,
      print_note_fl: record.notesPrintOnCheck || "N",
      recur_voucher_dc: record.recurCode || null,
      start_fy_cd: record.recurStartFiscalYear || null,
      start_pd_no: record.recurStartPeriod ? toNumber(record.recurStartPeriod, 0) : null,
      start_sub_pd_no: record.recurStartSubperiod ? toNumber(record.recurStartSubperiod, 0) : null,
      end_fy_cd: record.recurEndFiscalYear || null,
      end_pd_no: record.recurEndPeriod ? toNumber(record.recurEndPeriod, 0) : null,
      end_sub_pd_no: record.recurEndSubperiod ? toNumber(record.recurEndSubperiod, 0) : null,
      recur_tmplt_fl: record.template || "N",
      recur_par_voucher_no: 0,
      s_invc_type: "N",
      ship_amt: 0,
      ovr_bud_fl: record.overBudget || "N",
      s_subctr_pay_cd: record.subcontractorInvoiceType && record.subcontractorInvoiceType !== "None" ? String(record.subcontractorInvoiceType).slice(0, 1) : "N",
      invc_pop_dt: toNullableDateTime(record.subcontractorInvoicePopDate),
      paywpd_amt: toNumber(record.subcontractorDeliveryValue, 0),
      trn_cst_amt: amount,
      trn_disc_amt: discountAmount,
      trn_due_amt: dueAmount,
      trn_invc_amt: amount,
      trn_sales_tax_amt: taxAmount,
      trn_ship_amt: 0,
      trn_use_tax_amt: toNumber(record.useTaxAmount, 0),
      trn_crncy_cd: record.transactionCurrencyCode || "USD",
      pay_crncy_cd: record.payCurrencyCode || "USD",
      trn_to_eur_rt: 1,
      eur_to_func_rt: 1,
      func_to_eur_rt: 1,
      eur_to_pay_rt: 1,
      trn_freeze_rt_fl: "N",
      pay_freeze_rt_fl: "N",
      vat_tax_id: record.taxId || null,
      vat_tax_dt: toNullableDateTime(record.taxingDate),
      doc_location: record.notesDocLocation || null,
      doc_location_id: record.notesDocLocationId || null,
      doc_file_name: record.notesDocFileName || null,
      pay_trans_type: record.checkPayTransType && record.checkPayTransType !== "None" ? record.checkPayTransType : null,
      pay_ref_code: record.checkPayRefCode || null,
      due_dt: toNullableDateTime(record.dueDate),
      disc_dt: toNullableDateTime(record.discountDate),
      pay_addr_dc: record.addressCode || null
    }),
    lines: (record.detailLines || []).map((line, index) => {
      const lineAmount = toNumber(line.totalAmt || line.costAmount, amount);
      const lineTax = toNumber(line.salesVatTaxAmt, 0);
      const lineBeforeDiscount = toNumber(line.totBeforeDisc, lineAmount);
      const lineDiscount = toNumber(line.discount, 0);

      const costAmount = toNumber(line.costAmount, lineAmount);
      const hasVendorLabor = [line.subLine, line.vendorEmployee, line.glc, line.plc, line.hours, line.laborAmount, line.effectiveBillingDate]
        .some(value => value !== undefined && value !== null && String(value).trim() !== "");

      return {
        line: compactDbObject({
          voucher_ln_no: toNumber(line.lineNo, index + 1),
          qty: 1,
          ext_cst_amt: costAmount,
          ln_chg_cst_amt: 0,
          sales_tax_amt: lineTax,
          ln_chg_tax_amt: 0,
          tot_bef_disc_amt: lineBeforeDiscount,
          net_amt: lineAmount,
          taxable_fl: line.taxability || "N",
          sales_tax_cd: line.taxVatCode || "",
          vat_supply_dc: line.supplyCode || null,
          vat_supply_dt: toNullableDateTime(line.dateOfSupply),
          um_cd: (line.unitOfMeasure || "").slice(0, 3) || null,
          cis_wh_fl: line.cisWh || "N",
          cis_rpt_fl: line.cisRpt || "N",
          sales_tax_nt: "",
          notes: line.notes || "",
          voucher_ln_desc: (line.description || line.notes || `Line ${index + 1}`).slice(0, 30),
          s_po_ln_type: "M",
          discr_unit_prc_amt: 0,
          discr_unit_prc_rt: 0,
          discr_qty_rt: 0,
          unit_cst_amt: costAmount,
          use_tax_amt: toNumber(line.useReverseTaxAmt, 0),
          ln_chg_use_tax_amt: 0,
          disc_amt: lineDiscount,
          s_taxable_cd: line.taxability || "N",
          discr_tot_amt: 0,
          rma_no_id: "",
          modified_by: defaultUserId,
          time_stamp: now,
          trn_discr_tot_amt: 0,
          trn_discr_unit_amt: 0,
          trn_disc_amt: lineDiscount,
          trn_ext_cst_amt: costAmount,
          trn_ln_chg_cst_amt: 0,
          trn_ln_chg_tax_amt: 0,
          trn_ln_chg_use_amt: 0,
          trn_net_amt: lineAmount,
          trn_sales_tax_amt: lineTax,
          trn_tot_bef_dc_amt: lineBeforeDiscount,
          trn_unit_cst_amt: costAmount,
          trn_use_tax_amt: toNumber(line.useReverseTaxAmt, 0),
          trn_recovery_amt: toNumber(line.recoveryAmt, 0),
          recovery_amt: toNumber(line.recoveryAmt, 0),
          recovery_rt: toNumber(line.recoveryRate, 0)
        }),
        accounts: [compactDbObject({
          account_id: firstCode(line.account, apAccount),
          org_id: firstCode(line.organization, "10-200"),
          project_id: firstCode(line.project, ""),
          ref1_id: firstCode(line.refNo1, ""),
          ref2_id: firstCode(line.refNo2, ""),
          project_abbrv_cd: firstCode(line.projAbbrev, ""),
          org_abbrv_cd: firstCode(line.orgAbbrev, ""),
          project_account_abbrv_cd: firstCode(line.projAcctAbbrev, ""),
          cst_amt_pct_rt: toNumber(line.percent, 100),
          cst_amt: costAmount,
          sales_tax_amt: lineTax,
          tot_bef_disc_amt: lineBeforeDiscount,
          disc_amt: lineDiscount,
          net_amt: lineAmount,
          taxable_fl: line.taxability || "N",
          use_tax_amt: toNumber(line.useReverseTaxAmt, 0),
          s_taxable_cd: line.taxability || "N",
          modified_by: defaultUserId,
          time_stamp: now,
          ap_1099_fl: line.vendor1099 || "N",
          trn_cst_amt: costAmount,
          trn_disc_amt: lineDiscount,
          trn_ln_chg_cst_amt: 0,
          trn_net_amt: lineAmount,
          trn_sales_tax_amt: lineTax,
          trn_tot_bef_dc_amt: lineBeforeDiscount,
          trn_use_tax_amt: toNumber(line.useReverseTaxAmt, 0),
          trn_recovery_amt: toNumber(line.recoveryAmt, 0),
          recovery_amt: toNumber(line.recoveryAmt, 0),
          s_ap_1099_type_cd: line.type1099 || null,
          ap_1099_state_cd: line.state1099 || null
        })],
        labVendors: hasVendorLabor ? [compactDbObject({
          sub_ln_no: toNumber(line.subLine || line.lineNo, index + 1),
          genl_lab_cat_cd: firstCode(line.glc, ""),
          bill_lab_cat_cd: firstCode(line.plc, ""),
          vendor_hrs: toNumber(line.hours, 0),
          vendor_amt: toNumber(line.laborAmount || line.totalAmt, 0),
          modified_by: defaultUserId,
          time_stamp: now,
          vend_empl_id: firstCode(line.vendorEmployee, ""),
          trn_vendor_amt: toNumber(line.laborAmount || line.totalAmt, 0),
          trn_recovery_amt: toNumber(line.vatRecoveryAmt || line.recoveryAmt, 0),
          recovery_amt: toNumber(line.vatRecoveryAmt || line.recoveryAmt, 0),
          effect_bill_dt: toNullableDateTime(line.effectiveBillingDate),
          notes: line.vendorLaborNotes || line.notes || "",
          sales_tax_fl: line.taxability === "T" ? "Y" : "N"
        })] : []
      };
    })
  };
};

const PopupShell = ({ title, children, onClose, wide = false }) => (
  <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div className={`bg-white border border-slate-200/80 shadow-2xl rounded-2xl ${wide ? "w-[78vw]" : "w-[54vw]"} max-h-[86vh] overflow-y-auto overflow-hidden`}>
      <div className="flex items-center justify-between bg-slate-50 border-b border-slate-100 px-4 py-3 select-none">
        <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">{title}</span>
        <button
          type="button"
          className="p-1 rounded-full border border-slate-200 transition-colors cursor-pointer bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          onClick={onClose}
        >
          <X size={14} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const AmountField = ({ label, value = "0.00" }) => (
  <FormInput label={label} value={value} disabled className="text-right" />
);

const createBlankDetailLine = (lineNo = "1", id = `CHILD_${Date.now()}`, isDirty = true) => ({
  id,
  tempId: id,
  lineNo: String(lineNo),
  account: "",
  accountName: "",
  organization: "",
  organizationName: "",
  project: "",
  projectName: "",
  projAcctAbbrev: "",
  costAmount: "",
  percent: "",
  taxability: "",
  taxVatCode: "",
  taxRate: "",
  salesVatTaxAmt: "",
  totBeforeDisc: "",
  discount: "",
  totalAmt: "",
  useReverseTaxAmt: "",
  recoveryRate: "",
  recoveryAmt: "0.00",
  vendor1099: "N",
  type1099: "",
  state1099: "",
  description: "",
  notes: "",
  orgAbbrev: "",
  projAbbrev: "",
  refNo1: "",
  refNo1Name: "",
  refNo2: "",
  refNo2Name: "",
  cisWh: "N",
  cisRpt: "N",
  supplyCode: "",
  dateOfSupply: "",
  subLine: "",
  vendorEmployee: "",
  glc: "",
  plc: "",
  hours: "",
  laborAmount: "",
  vatRecoveryAmt: "",
  effectiveBillingDate: "",
  vendorLaborNotes: "",
  isDirty
});

const isBlankDetailLine = (line) => {
  if (!line) return false;
  const meaningfulFields = [
    "account",
    "organization",
    "project",
    "description",
    "notes",
    "refNo1",
    "refNo2",
    "taxVatCode",
    "type1099",
    "state1099",
    "supplyCode"
  ];
  const hasTextValue = meaningfulFields.some(field => String(line[field] || "").trim());
  const hasAmount = ["costAmount", "salesVatTaxAmt", "totBeforeDisc", "discount", "totalAmt", "useReverseTaxAmt", "recoveryAmt"]
    .some(field => Number(line[field] || 0) !== 0);
  return !hasTextValue && !hasAmount;
};

const initialMockRecords = [
  {
    id: "1",
    voucher: "VCH-2026-001",
    fiscalYear: "2026",
    period: "06",
    subperiod: "1",
    vendor: "VND-1001",
    vendorName: "Global Solutions Inc.",
    terms: "Net 30",
    approved: "Y",
    template: "N",
    invoiceNumber: "INV-99812",
    invoiceDate: "2026-06-22",
    invoiceAmount: "12500.00",
    dueDate: "2026-07-22",
    dueAmount: "12500.00",
    discountPercent: "2.00",
    discountDate: "2026-07-02",
    discountAmount: "250.00",
    voucherType: "AP Voucher",
    originalVoucher: "",
    accountDescriptionAp: "20100 - Accounts Payable",
    accountDescriptionCash: "10100 - Cash Operating",
    voucherLineRecalcMethod: "Recalculate Cost",
    whenSalesTaxChanged: "Recalculate Tot Before Disc",
    totalTax: "0.00",
    remainingBalance: "0.00",
    taxId: "TX-9988",
    taxingDate: "2026-06-22",
    taxLocation: "US-CA",
    retainageRate: "0.00",
    retainageAmount: "0.00",
    referencePo: "PO-77221",
    referencePoRelease: "0",
    recurredVoucher: "N",
    holdVoucher: "N",
    payWhenPaid: "N",
    separateCheck: "N",
    overBudget: "N",
    anticipatedPayDate: "2026-07-22",
    expenseReportId: "",
    cisCode: "",
    approver: "John Doe",
    entryUser: "15644.JAKIR.SHAIKH",
    entryDate: "2026-06-22 01:02:05 PM",
    payVendor: "VND-1001",
    payVendorName: "Global Solutions Inc.",
    jointPayee: "",
    addressCode: "PRIMARY",
    addressLine1: "123 Main St",
    addressLine2: "Suite 400",
    addressLine3: "",
    addressCity: "San Francisco",
    addressState: "CA",
    addressPostalCode: "94105",
    addressCountry: "USA",
    addressPassword: "",
    checkCashAcctDesc: "10100 - Cash Operating",
    checkNumber: "",
    checkDate: "",
    checkDiscountTaken: "",
    checkAmount: "",
    checkPayTransType: "None",
    checkPayRefCode: "",
    checkPostFiscalYear: "",
    checkPostPeriod: "",
    checkPostSubperiod: "",
    recurCode: "",
    recurStartFiscalYear: "",
    recurStartPeriod: "",
    recurStartSubperiod: "",
    recurStartEndingDate: "",
    recurEndFiscalYear: "",
    recurEndPeriod: "",
    recurEndSubperiod: "",
    recurEndEndingDate: "",
    recurLastVchrFiscalYear: "",
    recurLastVchrPeriod: "",
    recurLastVchrSubperiod: "",
    subcontractorInvoicePopDate: "",
    subcontractorDeliveryValue: "",
    subcontractorInvoiceType: "None",
    notesPrintOnCheck: "N",
    notesText: "",
    notesDocLocation: "",
    defaultAllowPayVendorWarning: "N",
    defaultAddDiscDiffFirstLine: "Y",
    defaultUseAccountDesc: "N",
    defaultUseOwningOrg: "Y",
    defaultAllowDuplicateInvNum: "N",
    defaultSaveTeVoucher: "N",
    detailLines: [
      {
        id: "d1",
        lineNo: "1",
        account: "50100 - Travel Expense",
        accountName: "Travel Expense",
        organization: "10-100 - Sales & Marketing",
        organizationName: "Sales & Marketing",
        project: "PRJ-900 - Internal Operations",
        projectName: "Internal Operations",
        projAcctAbbrev: "TRAV-OPS",
        costAmount: "5000.00",
        percent: "40.00",
        taxability: "",
        taxVatCode: "VAT-10",
        taxRate: "10.00",
        salesVatTaxAmt: "0.00",
        totBeforeDisc: "5000.00",
        discount: "100.00",
        totalAmt: "4900.00",
        useReverseTaxAmt: "0.00",
        recoveryRate: "100.00",
        recoveryAmt: "0.00",
        vendor1099: "N",
        type1099: "",
        state1099: "",
        description: "Flight tickets for sales trip",
        notes: "Flight tickets for sales trip",
        orgAbbrev: "SM-10",
        projAbbrev: "INT-OPS",
        refNo1: "",
        refNo1Name: "",
        refNo2: "",
        refNo2Name: "",
        cisWh: "N",
        cisRpt: "N",
        supplyCode: "",
        dateOfSupply: ""
      },
      {
        id: "d2",
        lineNo: "2",
        account: "50200 - Office Supplies",
        accountName: "Office Supplies",
        organization: "10-200 - General Admin",
        organizationName: "General Admin",
        project: "PRJ-900 - Internal Operations",
        projectName: "Internal Operations",
        projAcctAbbrev: "SUPP-ADM",
        costAmount: "7500.00",
        percent: "60.00",
        taxability: "",
        taxVatCode: "",
        taxRate: "0.00",
        salesVatTaxAmt: "0.00",
        totBeforeDisc: "7500.00",
        discount: "150.00",
        totalAmt: "7350.00",
        useReverseTaxAmt: "0.00",
        recoveryRate: "100.00",
        recoveryAmt: "0.00",
        vendor1099: "N",
        type1099: "",
        state1099: "",
        description: "Monthly desk stationaries",
        notes: "Monthly desk stationaries",
        orgAbbrev: "GA-10",
        projAbbrev: "INT-OPS",
        refNo1: "",
        refNo1Name: "",
        refNo2: "",
        refNo2Name: "",
        cisWh: "N",
        cisRpt: "N",
        supplyCode: "",
        dateOfSupply: ""
      }
    ]
  }
];

const ManageAccountsPayableVouchers = () => {
  const [isFormView, setIsFormView] = useState(true);
  const [activeTab, setActiveTab] = useState("Header Info");
  const [searchValue, setSearchValue] = useState("");

  const [isChildFormView, setIsChildFormView] = useState(false);
  const [activeChildTab, setActiveChildTab] = useState("Account Info");
  const [childSearchTerms, setChildSearchTerms] = useState({
    account: "",
    organization: "",
    project: "",
    projAcctAbbrev: "",
    orgAbbrev: "",
    projAbbrev: "",
    refNo1: "",
    refNo2: "",
    taxVatCode: "",
    type1099: "",
    state1099: "",
    supplyCode: ""
  });
  const [accountDropdownOptions, setAccountDropdownOptions] = useState(accountOptions);
  const [organizationDropdownOptions, setOrganizationDropdownOptions] = useState(organizationOptions);
  const [projectDropdownOptions, setProjectDropdownOptions] = useState(projectOptions);

  const [vendorEmployeeOptions, setVendorEmployeeOptions] = useState([]);
  const [glcOptions, setGlcOptions] = useState([]);
  const [plcOptions, setPlcOptions] = useState([]);

  useEffect(() => {
    const fetchVendorLaborDropdowns = async () => {
      try {
        const empRes = await api.get("/api/accounts-payable-vouchers/vendor-employees").catch(() => null)
          || await api.get("/api/vendor-employees").catch(() => null);
        if (empRes && Array.isArray(empRes.data)) {
          const formattedEmps = empRes.data.map(emp => {
            const val = emp.vend_empl_id ?? emp.vendEmplId ?? emp.vend_id ?? emp.vendor_empl_id ?? emp.id ?? emp.value ?? "";
            const name = emp.vend_empl_name ?? emp.vendEmplName ?? emp.vend_empl_nm ?? emp.empl_name ?? emp.name ?? emp.label ?? "";
            if (!val && !name) return null;
            const codeStr = String(val || name);
            const nameStr = String(name || codeStr);
            return {
              value: codeStr,
              label: nameStr && nameStr !== codeStr ? `${codeStr} - ${nameStr}` : codeStr,
              name: nameStr
            };
          }).filter(Boolean);
          setVendorEmployeeOptions(formattedEmps);
        }

        const plcRes = await api.get("/api/accounts-payable-vouchers/plc-codes").catch(() => null)
          || await api.get("/api/plc-codes").catch(() => null);
        if (plcRes && Array.isArray(plcRes.data)) {
          const formattedPlcs = plcRes.data.map(p => {
            const val = p.bill_lab_cat_cd ?? p.billLabCatCd ?? p.plc_cd ?? p.plc_code ?? p.code ?? p.id ?? p.value ?? "";
            const name = p.bill_lab_cat_desc ?? p.billLabCatDesc ?? p.plc_name ?? p.plc_desc ?? p.description ?? p.name ?? "";
            if (!val && !name) return null;
            const codeStr = String(val || name);
            const nameStr = String(name || codeStr);
            return {
              value: codeStr,
              label: nameStr && nameStr !== codeStr ? `${codeStr} - ${nameStr}` : codeStr,
              name: nameStr
            };
          }).filter(Boolean);
          setPlcOptions(formattedPlcs);
        }

        const glcRes = await api.get("/api/accounts-payable-vouchers/glc-codes").catch(() => null)
          || await api.get("/api/glc-codes").catch(() => null);
        if (glcRes && Array.isArray(glcRes.data)) {
          const formattedGlcs = glcRes.data.map(g => {
            const val = g.genl_lab_cat_cd ?? g.genlLabCatCd ?? g.glc_cd ?? g.glc_code ?? g.code ?? g.id ?? g.value ?? "";
            const name = g.genl_lab_cat_desc ?? g.genlLabCatDesc ?? g.glc_name ?? g.glc_desc ?? g.description ?? g.name ?? "";
            if (!val && !name) return null;
            const codeStr = String(val || name);
            const nameStr = String(name || codeStr);
            return {
              value: codeStr,
              label: nameStr && nameStr !== codeStr ? `${codeStr} - ${nameStr}` : codeStr,
              name: nameStr
            };
          }).filter(Boolean);
          setGlcOptions(formattedGlcs);
        }
      } catch {
        // Handle silently if API unavailable
      }
    };

    fetchVendorLaborDropdowns();
  }, []);

  const [records, setRecords] = useState(() => initialMockRecords.map(updateHeaderBalances));

  const [selectedRow, setSelectedRow] = useState(() => {
    const rec = initialMockRecords.map(updateHeaderBalances)[0];
    return rec || null;
  });
  const [selectedIds, setSelectedIds] = useState(() => {
    const rec = initialMockRecords.map(updateHeaderBalances)[0];
    return new Set(rec ? [rec.id] : []);
  });
  const [clipboard, setClipboard] = useState([]);

  // Detail Table selection state
  const [selectedChildRowState, setSelectedChildRow] = useState(null);
  const [selectedChildIds, setSelectedChildIds] = useState(new Set());
  const [childClipboard, setChildClipboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePopup, setActivePopup] = useState("");
  const [activeNestedTabs, setActiveNestedTabs] = useState({});
  const [isVendorLaborFormView, setIsVendorLaborFormView] = useState(true);
  const [isCurrencyLineFormView, setIsCurrencyLineFormView] = useState(true);
  const [isCustomsInfoFormView, setIsCustomsInfoFormView] = useState(true);
  const [laborClipboard, setLaborClipboard] = useState(null);

  const getRowKey = (row) => row ? String(row.tempId || row.id || "") : "";
  const selectedChildRow = (selectedRow?.detailLines || []).find(line => getRowKey(line) === (selectedChildRowState ? getRowKey(selectedChildRowState) : "")) || selectedChildRowState;

  const selectRecord = async (record) => {
    if (!record) {
      setSelectedRow(null);
      setSelectedIds(new Set());
      setSelectedChildRow(null);
      setSelectedChildIds(new Set());
      return;
    }

    setSelectedRow(record);
    setSelectedIds(new Set([getRowKey(record)]));
    const firstLine = record.detailLines?.[0] || null;
    setSelectedChildRow(firstLine);
    setSelectedChildIds(firstLine ? new Set([getRowKey(firstLine)]) : new Set());

    if (!record.voucherKey) return;

    try {
      const response = await api.get(`${apiBaseUrl}/${record.voucherKey}`);
      const hydrated = mapHeaderToRecord(response.data.header || {}, response.data.lines || []);
      setRecords(prev => prev.map(item => getRowKey(item) === getRowKey(record) ? hydrated : item));
      setSelectedRow(hydrated);
      setSelectedIds(new Set([getRowKey(hydrated)]));
      const hydratedFirstLine = hydrated.detailLines?.[0] || null;
      setSelectedChildRow(hydratedFirstLine);
      setSelectedChildIds(hydratedFirstLine ? new Set([getRowKey(hydratedFirstLine)]) : new Set());
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to load voucher details.");
    }
  };

  const loadVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${apiBaseUrl}?limit=100`);
      const nextRecords = (response.data || []).map(header => mapHeaderToRecord(header, []));
      setRecords(nextRecords);
      if (nextRecords.length > 0) {
        await selectRecord(nextRecords[0]);
      } else {
        setSelectedRow(null);
        setSelectedIds(new Set());
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to load accounts payable vouchers.");
    } finally {
      setIsLoading(false);
    }
  };

  const [taxVatDropdownOptions, setTaxVatDropdownOptions] = useState(taxVatOptions);

  const loadDetailReferenceData = async () => {
    const getJson = async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      return response.json();
    };

    try {
      const [accountsResponse, organizationsResponse, projectsResponse, salesTaxesRes] = await Promise.allSettled([
        getJson(`${masterDataBaseUrl}/api/Account/GetAllAccounts`),
        getJson(`${masterDataBaseUrl}/Orgnization/GetAllOrgs`),
        getJson(`${masterDataBaseUrl}/Project/GetAllProjects`),
        api.get(`${backendUrl}/api/sales-taxes`)
      ]);

      if (accountsResponse.status === "fulfilled") {
        const options = normalizeAccountOptions(accountsResponse.value || []);
        if (options.length > 0) setAccountDropdownOptions(options);
      }

      if (organizationsResponse.status === "fulfilled") {
        const options = normalizeOrganizationOptions(organizationsResponse.value || []);
        if (options.length > 0) setOrganizationDropdownOptions(options);
      }

      if (projectsResponse.status === "fulfilled") {
        setProjectDropdownOptions(normalizeProjectOptions(projectsResponse.value || []));
      }

      if (salesTaxesRes.status === "fulfilled" && Array.isArray(salesTaxesRes.value?.data)) {
        const liveTaxes = salesTaxesRes.value.data.map(t => {
          const code = t.taxCode || t.tax_code || "";
          const desc = t.description || t.desc || "";
          const rate = t.compositeTaxRate ?? t.taxRate ?? "0.00";
          const recRate = t.recoveryPercent ?? t.recoveryPercentOverride ?? t.recoveryRate ?? "100.00";
          return {
            value: code,
            label: desc ? `${code} - ${desc} (${rate}%)` : `${code} (${rate}%)`,
            rate: String(rate),
            recoveryRate: String(recRate)
          };
        }).filter(t => t.value);
        if (liveTaxes.length > 0) {
          setTaxVatDropdownOptions(liveTaxes);
        }
      }
    } catch {
      toast.info("Using default detail lookup values.");
    }
  };

  useEffect(() => {
    loadVouchers();
    loadDetailReferenceData();
  }, []);

  const isApprovedLocked = (record) => record?.approved === "Y" && !record?.isDirty;

  // Master Fields Change
  const handleFieldChange = (rowId, field, value) => {
    if (field !== "approved" && isApprovedLocked(selectedRow) && getRowKey(selectedRow) === String(rowId)) {
      toast.warn("Approved vouchers cannot be edited.");
      return;
    }

    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === String(rowId)) {
        let updatedRecord = { ...r, [field]: value, isDirty: true };
        const invAmt = toNumber(updatedRecord.invoiceAmount || 0);

        if (field === "invoiceAmount") {
          updatedRecord.detailLines = (r.detailLines || []).map(line => {
            const pct = toNumber(line.percent || 100);
            const cost = (invAmt * pct) / 100;
            const updatedLine = { ...line, costAmount: cost.toFixed(2) };
            
            const discPct = toNumber(updatedRecord.discountPercent || 0);
            updatedLine.discount = ((cost * discPct) / 100).toFixed(2);

            Object.assign(updatedLine, calculateRowUpdates(updatedLine));
            return updatedLine;
          });
        } 
        else if (field === "discountPercent") {
          const discPct = toNumber(value || 0);
          updatedRecord.discountAmount = ((invAmt * discPct) / 100).toFixed(2);
          updatedRecord.detailLines = (r.detailLines || []).map(line => {
            const cost = toNumber(line.costAmount || 0);
            const updatedLine = { ...line, discount: ((cost * discPct) / 100).toFixed(2) };
            Object.assign(updatedLine, calculateRowUpdates(updatedLine));
            return updatedLine;
          });
        }
        else if (field === "discountAmount") {
          const discAmt = toNumber(value || 0);
          const discPct = invAmt > 0 ? (discAmt / invAmt) * 100 : 0;
          updatedRecord.discountPercent = discPct.toFixed(2);
          updatedRecord.detailLines = (r.detailLines || []).map(line => {
            const cost = toNumber(line.costAmount || 0);
            const updatedLine = { ...line, discount: ((cost * discPct) / 100).toFixed(2) };
            Object.assign(updatedLine, calculateRowUpdates(updatedLine));
            return updatedLine;
          });
        }

        const sumTax = (updatedRecord.detailLines || []).reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt), 0);
        updatedRecord.totalTax = sumTax.toFixed(2);
        return updateHeaderBalances(updatedRecord);
      }
      return r;
    }));

    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== String(rowId)) return prev;
      let updatedRecord = { ...prev, [field]: value, isDirty: true };
      const invAmt = toNumber(updatedRecord.invoiceAmount || 0);

      if (field === "invoiceAmount") {
        updatedRecord.detailLines = (prev.detailLines || []).map(line => {
          const pct = toNumber(line.percent || 100);
          const cost = (invAmt * pct) / 100;
          const updatedLine = { ...line, costAmount: cost.toFixed(2) };
          
          const discPct = toNumber(updatedRecord.discountPercent || 0);
          updatedLine.discount = ((cost * discPct) / 100).toFixed(2);

          Object.assign(updatedLine, calculateRowUpdates(updatedLine));
          return updatedLine;
        });
      }
      else if (field === "discountPercent") {
        const discPct = toNumber(value || 0);
        updatedRecord.discountAmount = ((invAmt * discPct) / 100).toFixed(2);
        updatedRecord.detailLines = (prev.detailLines || []).map(line => {
          const cost = toNumber(line.costAmount || 0);
          const updatedLine = { ...line, discount: ((cost * discPct) / 100).toFixed(2) };
          Object.assign(updatedLine, calculateRowUpdates(updatedLine));
          return updatedLine;
        });
      }
      else if (field === "discountAmount") {
        const discAmt = toNumber(value || 0);
        const discPct = invAmt > 0 ? (discAmt / invAmt) * 100 : 0;
        updatedRecord.discountPercent = discPct.toFixed(2);
        updatedRecord.detailLines = (prev.detailLines || []).map(line => {
          const cost = toNumber(line.costAmount || 0);
          const updatedLine = { ...line, discount: ((cost * discPct) / 100).toFixed(2) };
          Object.assign(updatedLine, calculateRowUpdates(updatedLine));
          return updatedLine;
        });
      }

      const sumTax = (updatedRecord.detailLines || []).reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt), 0);
      updatedRecord.totalTax = sumTax.toFixed(2);
      return updateHeaderBalances(updatedRecord);
    });
  };

  const handleRecalculateLines = (method) => {
    if (!selectedRow) return;
    const parentId = getRowKey(selectedRow);
    const invAmt = toNumber(selectedRow.invoiceAmount || 0);
    const discPct = toNumber(selectedRow.discountPercent || 0);

    const updatedLines = (selectedRow.detailLines || []).map(line => {
      let updatedLine = { ...line };
      if (method === "Recalculate Cost") {
        const pct = toNumber(line.percent || 100);
        updatedLine.costAmount = ((invAmt * pct) / 100).toFixed(2);
      } else if (method === "Recalculate Rate") {
        const cost = toNumber(line.costAmount || 0);
        updatedLine.percent = invAmt > 0 ? ((cost / invAmt) * 100).toFixed(2) : "100.00";
      }
      
      // Sync line discount
      updatedLine.discount = ((toNumber(updatedLine.costAmount) * discPct) / 100).toFixed(2);
      
      // Recalculate taxability values
      Object.assign(updatedLine, calculateRowUpdates(updatedLine));
      updatedLine.isDirty = true;
      return updatedLine;
    });

    const sumTax = updatedLines.reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt), 0);
    
    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        let updatedRecord = { ...r, detailLines: updatedLines, totalTax: sumTax.toFixed(2), isDirty: true };
        return updateHeaderBalances(updatedRecord);
      }
      return r;
    }));

    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      let updatedRecord = { ...prev, detailLines: updatedLines, totalTax: sumTax.toFixed(2), isDirty: true };
      return updateHeaderBalances(updatedRecord);
    });

    // Refresh selected child row if active
    if (selectedChildRow) {
      const refreshed = updatedLines.find(line => getRowKey(line) === getRowKey(selectedChildRow));
      if (refreshed) {
        setSelectedChildRow(refreshed);
      }
    }

    toast.success(`Recalculated voucher lines using method: ${method}`);
  };

  const handleRecalculateTaxMethod = (method) => {
    if (!selectedRow) return;
    const parentId = getRowKey(selectedRow);
    const invAmt = toNumber(selectedRow.invoiceAmount || 0);
    const discPct = toNumber(selectedRow.discountPercent || 0);

    const updatedLines = (selectedRow.detailLines || []).map(line => {
      let updatedLine = { ...line };
      const cost = toNumber(line.costAmount || 0);
      const tax = toNumber(line.salesVatTaxAmt || 0);
      
      if (method === "Recalculate Tot Before Disc") {
        updatedLine.totBeforeDisc = (cost + tax).toFixed(2);
        updatedLine.totalAmt = (toNumber(updatedLine.totBeforeDisc) - toNumber(line.discount || 0)).toFixed(2);
      } else if (method === "Recalculate Discount") {
        updatedLine.discount = (((cost + tax) * discPct) / 100).toFixed(2);
        updatedLine.totalAmt = (cost + tax - toNumber(updatedLine.discount)).toFixed(2);
      }
      updatedLine.isDirty = true;
      return updatedLine;
    });

    const sumTax = updatedLines.reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt), 0);

    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        let updatedRecord = { ...r, detailLines: updatedLines, totalTax: sumTax.toFixed(2), isDirty: true };
        return updateHeaderBalances(updatedRecord);
      }
      return r;
    }));

    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      let updatedRecord = { ...prev, detailLines: updatedLines, totalTax: sumTax.toFixed(2), isDirty: true };
      return updateHeaderBalances(updatedRecord);
    });

    if (selectedChildRow) {
      const refreshed = updatedLines.find(line => getRowKey(line) === getRowKey(selectedChildRow));
      if (refreshed) {
        setSelectedChildRow(refreshed);
      }
    }

    toast.success(`Recalculated using Sales Tax method: ${method}`);
  };

  // Master actions
  const handleAdd = () => {
    const tempId = `NEW_${Date.now()}`;
    const blankDetailLine = createBlankDetailLine("1", `CHILD_${Date.now()}`);
    const newRecord = {
      id: tempId,
      tempId,
      voucher: "",
      fiscalYear: defaultFiscalYear,
      period: defaultPeriod,
      subperiod: defaultSubperiod,
      companyId: defaultCompanyId,
      vendor: "",
      vendorName: "",
      terms: defaultTerms,
      approved: "N",
      template: "N",
      invoiceNumber: "",
      invoiceDate: "",
      invoiceAmount: "",
      dueDate: "",
      dueAmount: "",
      discountPercent: "",
      discountDate: "",
      discountAmount: "",
      voucherType: "AP Voucher",
      originalVoucher: "",
      accountDescriptionAp: "",
      accountDescriptionCash: "",
      voucherLineRecalcMethod: "Recalculate Cost",
      whenSalesTaxChanged: "Recalculate Tot Before Disc",
      totalTax: "0.00",
      remainingBalance: "0.00",
      taxId: "",
      taxingDate: "",
      taxLocation: "",
      retainageRate: "0.00",
      retainageAmount: "0.00",
      referencePo: "",
      referencePoRelease: "0",
      recurredVoucher: "N",
      holdVoucher: "N",
      payWhenPaid: "N",
      separateCheck: "N",
      overBudget: "N",
      anticipatedPayDate: "",
      expenseReportId: "",
      cisCode: "",
      approver: "",
      entryUser: defaultUserId,
      entryDate: new Date().toLocaleDateString(),
      payVendor: "",
      payVendorName: "",
      jointPayee: "",
      addressCode: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      addressCity: "",
      addressState: "",
      addressPostalCode: "",
      addressCountry: "",
      addressPassword: "",

      // Check fields
      checkCashAcctDesc: "10100 - Cash Operating",
      checkNumber: "",
      checkDate: "",
      checkDiscountTaken: "",
      checkAmount: "",
      checkPayTransType: "None",
      checkPayRefCode: "",
      checkPostFiscalYear: "",
      checkPostPeriod: "",
      checkPostSubperiod: "",

      // Recur fields
      recurCode: "",
      recurStartFiscalYear: "",
      recurStartPeriod: "",
      recurStartSubperiod: "",
      recurStartEndingDate: "",
      recurEndFiscalYear: "",
      recurEndPeriod: "",
      recurEndSubperiod: "",
      recurEndEndingDate: "",
      recurLastVchrFiscalYear: "",
      recurLastVchrPeriod: "",
      recurLastVchrSubperiod: "",

      // Subcontractor fields
      subcontractorInvoicePopDate: "",
      subcontractorDeliveryValue: "",
      subcontractorInvoiceType: "None",

      // Notes fields
      notesPrintOnCheck: "N",
      notesText: "",
      notesDocLocation: "",

      // Entry Defaults fields
      defaultAllowPayVendorWarning: "N",
      defaultAddDiscDiffFirstLine: "Y",
      defaultUseAccountDesc: "N",
      defaultUseOwningOrg: "Y",
      defaultAllowDuplicateInvNum: "N",
      defaultSaveTeVoucher: "N",

      detailLines: [blankDetailLine],
      isDirty: true
    };
    const updatedNewRecord = updateHeaderBalances(newRecord);
    setRecords([updatedNewRecord, ...records]);
    setSelectedRow(updatedNewRecord);
    setSelectedIds(new Set([tempId]));
    setSelectedChildRow(blankDetailLine);
    setSelectedChildIds(new Set([getRowKey(blankDetailLine)]));
  };

  const handleCopy = () => {
    if (!selectedRow) return toast.warn("Select a record to copy first.");
    setClipboard([selectedRow]);
    toast.success("Record copied.");
  };

  const handlePaste = () => {
    if (clipboard.length === 0) return toast.warn("Nothing to paste.");
    const pasted = clipboard.map((item, idx) => {
      const tempId = `PASTE_${Date.now()}_${idx}`;
      const record = {
        ...item,
        id: tempId,
        tempId,
        voucher: `${item.voucher}-COPY`,
        isDirty: true,
        detailLines: (item.detailLines || []).map((d, dIdx) => ({
          ...d,
          id: `PASTE_D_${Date.now()}_${dIdx}`
        }))
      };
      return updateHeaderBalances(record);
    });
    setRecords([...pasted, ...records]);
    setSelectedRow(pasted[0]);
    setSelectedIds(new Set([pasted[0].id]));
    toast.success("Record pasted successfully.");
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0 && !selectedRow) {
      return toast.warn("Select record(s) to delete first.");
    }
    const idsToDelete = selectedIds.size > 0 ? selectedIds : new Set([getRowKey(selectedRow)]);
    const recordsToDelete = records.filter(r => idsToDelete.has(getRowKey(r)));

    try {
      await Promise.all(recordsToDelete
        .filter(record => record.voucherKey)
        .map(record => api.delete(`${apiBaseUrl}/${record.voucherKey}`)));

      const remaining = records.filter(r => !idsToDelete.has(getRowKey(r)));
      setRecords(remaining);
      await selectRecord(remaining[0] || null);
      toast.success("Record(s) deleted.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Unable to delete voucher.");
    }
  };

  const buildApprovalQueueVoucher = (record) => ({
    id: getRowKey(record),
    vendor: record.vendor || "",
    vendorName: record.vendorName || "",
    voucher: record.voucher || "",
    invoiceAmt: record.invoiceAmount || record.dueAmount || "0.00",
    invoice: record.invoiceNumber || "",
    originalVoucher: record.originalVoucher || "",
    appr: record.approved === "Y" ? "Y" : "N",
    hold: record.holdVoucher || "N",
    overBudget: record.overBudget || "N",
    invoiceDate: record.invoiceDate || "",
    terms: record.terms || "",
    discountPercent: record.discountPercent || "",
    discountDate: record.discountDate || "",
    discountAmt: record.discountAmount || "0.00",
    dueDate: record.dueDate || "",
    transDueAmt: record.dueAmount || record.invoiceAmount || "0.00",
    manualCk: "N",
    entryUser: record.entryUser || "",
    vchrType: record.voucherType || "AP Voucher",
    discrCalcDate: record.invoiceDate || "",
    checkAmount: record.checkAmount || "0.00",
    discountTaken: record.checkDiscountTaken || "0.00",
    checkDate: record.checkDate || "",
    checkFiscalYear: record.checkPostFiscalYear || "",
    checkNumber: record.checkNumber || "",
    checkPeriod: record.checkPostPeriod || "",
    checkSubpd: record.checkPostSubperiod || "",
    cashAccountsDescription: record.checkCashAcctDesc || record.accountDescriptionCash || "",
    fiscalYear: record.fiscalYear || "",
    period: record.period || "",
    subperiod: record.subperiod || "",
    poDiscrepancy: "N",
    rcptDiscrepancy: "N",
    costAmount: record.invoiceAmount || "0.00",
    salesVatTaxAmt: record.totalTax || "0.00",
    recoveryAmt: "0.00",
    totBeforeDisc: record.invoiceAmount || "0.00",
    discount: record.discountAmount || "0.00",
    totalAmt: record.dueAmount || record.invoiceAmount || "0.00",
    useReverseTaxAmt: "0.00",
    checkDiscountTaken: record.checkDiscountTaken || "0.00"
  });

  const handleSave = async () => {
    if (!selectedRow) {
      return toast.warn("Select a voucher to save first.");
    }

    if (!selectedRow.fiscalYear?.trim() || !String(selectedRow.period || "").trim() || !selectedRow.vendor?.trim()) {
      return toast.error("Fiscal Year, Period, and Vendor are required fields!");
    }



    // Costpoint AP Voucher Validations:
    const computedCostAmount = (selectedRow.detailLines || []).reduce((sum, line) => sum + toNumber(line.costAmount || 0), 0);
    const headerInvoiceAmount = toNumber(selectedRow.invoiceAmount || 0);
    if (Math.abs(computedCostAmount - headerInvoiceAmount) > 0.01) {
      return toast.error(`Total of line Cost Amounts ($${computedCostAmount.toFixed(2)}) must equal the Invoice Amount ($${headerInvoiceAmount.toFixed(2)})!`);
    }

    const computedSalesTax = (selectedRow.detailLines || []).reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt || 0), 0);
    const headerTotalTax = toNumber(selectedRow.totalTax || 0);
    if (Math.abs(computedSalesTax - headerTotalTax) > 0.01) {
      return toast.error(`Total of line Sales/VAT Tax ($${computedSalesTax.toFixed(2)}) must equal the Header Total Tax ($${headerTotalTax.toFixed(2)})!`);
    }

    const isApproving = selectedRow.approved === "Y" && selectedRow.isDirty;
    const confirmMessage = isApproving
      ? "Are you sure you want to approve and save this voucher?"
      : "Are you sure you want to save changes to this voucher?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = selectedRow.voucherKey
        ? await api.put(`${apiBaseUrl}/${selectedRow.voucherKey}`, buildVoucherPayload(selectedRow))
        : await api.post(apiBaseUrl, buildVoucherPayload(selectedRow));
      const voucherKey = response.data?.voucherKey || selectedRow.voucherKey;

      if (voucherKey) {
        const detailResponse = await api.get(`${apiBaseUrl}/${voucherKey}`);
        const savedRecord = mapHeaderToRecord(detailResponse.data.header || {}, detailResponse.data.lines || []);
        setRecords(prev => prev.map(r => getRowKey(r) === getRowKey(selectedRow) ? savedRecord : r));
        await selectRecord(savedRecord);

        if (savedRecord.approved !== "Y") {
          sessionStorage.setItem("apVoucherPendingApproval", JSON.stringify(buildApprovalQueueVoucher(savedRecord)));
          toast.success(response.data?.message || "Voucher saved for approval.");
          return;
        }
      } else {
        await loadVouchers();

        if (selectedRow.approved !== "Y") {
          sessionStorage.setItem("apVoucherPendingApproval", JSON.stringify(buildApprovalQueueVoucher(selectedRow)));
          toast.success(response.data?.message || "Voucher saved for approval.");
          return;
        }
      }

      toast.success(response.data?.message || "Voucher saved successfully.");
    } catch (error) {
      const errorData = error.response?.data;
      toast.error(errorData?.detail || errorData?.title || (typeof errorData === "string" ? errorData : "") || "Unable to save voucher.");
    }
  };

  const handleDiscard = () => {
    toast.info("Unsaved changes discarded.");
  };

  // --- Child Table Operations ---
  const handleChildFieldChange = (childId, field, value) => {
    if (!selectedRow) return;
    if (isApprovedLocked(selectedRow)) {
      toast.warn("Approved vouchers cannot be edited.");
      return;
    }

    const parentId = getRowKey(selectedRow);

    const resolveFieldSideEffects = (item, fld, val) => {
      let updated = { ...item, [fld]: val };
      if (fld === "taxability") {
        const uVal = String(val || "").trim().toUpperCase();
        updated.taxability = uVal;
        if (uVal === "N") {
          updated.taxVatCode = "";
          updated.taxRate = "0.00";
          updated.salesVatTaxAmt = "0.00";
          updated.useReverseTaxAmt = "0.00";
        }
      } else if (fld === "taxVatCode") {
        const found = taxVatOptions.find(opt => opt.value === val);
        updated.taxRate = found ? found.rate : "0.00";
      } else if (fld === "account") {
        updated.accountName = val.split(" - ")[1] || "";
      } else if (fld === "organization") {
        updated.organizationName = val.split(" - ")[1] || "";
      } else if (fld === "project") {
        updated.projectName = val.split(" - ")[1] || "";
      } else if (fld === "refNo1") {
        updated.refNo1Name = val.split(" - ")[1] || "";
      } else if (fld === "refNo2") {
        updated.refNo2Name = val.split(" - ")[1] || "";
      } else if (fld === "description") {
        updated.notes = val;
      } else if (fld === "notes") {
        updated.description = val;
      }
      return updated;
    };

    const processItemCalculations = (item, fld, val) => {
      let updated = resolveFieldSideEffects(item, fld, val);
      updated.isDirty = true;

      const discPct = toNumber(selectedRow?.discountPercent || 0);

      if (fld === "percent") {
        const pct = toNumber(val);
        const invAmt = toNumber(selectedRow?.invoiceAmount || 0);
        const cost = (invAmt * pct) / 100;
        updated.costAmount = cost.toFixed(2);
        updated.discount = ((cost * discPct) / 100).toFixed(2);
      } else if (fld === "costAmount") {
        const cost = toNumber(val);
        const invAmt = toNumber(selectedRow?.invoiceAmount || 0);
        updated.percent = invAmt > 0 ? ((cost / invAmt) * 100).toFixed(2) : "100.00";
        updated.discount = ((cost * discPct) / 100).toFixed(2);
      }

      if (["costAmount", "percent", "taxRate", "discount", "taxability", "recoveryRate", "taxVatCode"].includes(fld)) {
        Object.assign(updated, calculateRowUpdates(updated));
      }

      return updated;
    };

    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        const updatedChildren = (r.detailLines || []).map(c => {
          if (getRowKey(c) === String(childId)) {
            return processItemCalculations(c, field, value);
          }
          return c;
        });
        const sumTax = updatedChildren.reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt), 0);
        let updatedRecord = { ...r, detailLines: updatedChildren, totalTax: sumTax.toFixed(2), isDirty: true };
        return updateHeaderBalances(updatedRecord);
      }
      return r;
    }));

    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      const updatedChildren = (prev.detailLines || []).map(c => {
        if (getRowKey(c) === String(childId)) {
          return processItemCalculations(c, field, value);
        }
        return c;
      });
      const sumTax = updatedChildren.reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt), 0);
      let updatedRecord = { ...prev, detailLines: updatedChildren, totalTax: sumTax.toFixed(2), isDirty: true };
      return updateHeaderBalances(updatedRecord);
    });

    setSelectedChildRow(prev => {
      if (!prev || getRowKey(prev) !== String(childId)) return prev;
      return processItemCalculations(prev, field, value);
    });
  };

  const handleChildAdd = () => {
    if (!selectedRow) return toast.warn("Select a voucher first.");
    if (isApprovedLocked(selectedRow)) return toast.warn("Approved vouchers cannot be edited.");

    const existingBlankLine = (selectedRow.detailLines || []).find(line => line.tempId && isBlankDetailLine(line));
    if (existingBlankLine) {
      setSelectedChildIds(new Set([getRowKey(existingBlankLine)]));
      setSelectedChildRow(existingBlankLine);
      return;
    }

    const parentId = getRowKey(selectedRow);
    const tempChildId = `CHILD_${Date.now()}`;
    const nextLineNo = String((selectedRow.detailLines || []).length + 1);

    const newChild = createBlankDetailLine(nextLineNo, tempChildId);

    const invAmt = 0;
    newChild.percent = "";
    newChild.costAmount = "";
    newChild.taxability = "";
    newChild.discount = "";

    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        return { ...r, detailLines: [...(r.detailLines || []), newChild], isDirty: true };
      }
      return r;
    }));

    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      return { ...prev, detailLines: [...(prev.detailLines || []), newChild], isDirty: true };
    });

    setSelectedChildIds(new Set([tempChildId]));
    setSelectedChildRow(newChild);
  };

  const handleChildCopy = () => {
    if (!selectedChildRow) return toast.warn("Select a voucher line to copy first.");
    setChildClipboard([selectedChildRow]);
    toast.success("Voucher line copied.");
  };

  const handleChildPaste = () => {
    if (!selectedRow) return;
    if (isApprovedLocked(selectedRow)) return toast.warn("Approved vouchers cannot be edited.");
    if (childClipboard.length === 0) return toast.warn("Nothing to paste.");
    const parentId = getRowKey(selectedRow);
    const pasted = childClipboard.map((c, i) => {
      const tempId = `CHILD_PASTE_${Date.now()}_${i}`;
      const nextLineNo = String((selectedRow.detailLines || []).length + 1 + i);
      return {
        ...c,
        id: tempId,
        tempId,
        lineNo: nextLineNo,
        isDirty: true
      };
    });

    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        return { ...r, detailLines: [...(r.detailLines || []), ...pasted], isDirty: true };
      }
      return r;
    }));

    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      return { ...prev, detailLines: [...(prev.detailLines || []), ...pasted], isDirty: true };
    });

    setSelectedChildIds(new Set([pasted[0].id]));
    setSelectedChildRow(pasted[0]);
    toast.success("Voucher line pasted.");
  };

  const handleChildDelete = () => {
    if (!selectedRow) return;
    if (isApprovedLocked(selectedRow)) return toast.warn("Approved vouchers cannot be edited.");
    if (selectedChildIds.size === 0 && !selectedChildRow) {
      return toast.warn("Select voucher line(s) to delete first.");
    }
    const parentId = getRowKey(selectedRow);
    const idsToDelete = selectedChildIds.size > 0 ? selectedChildIds : new Set([getRowKey(selectedChildRow)]);

    setRecords(prev => prev.map(r => {
      if (getRowKey(r) === parentId) {
        const remaining = (r.detailLines || []).filter(c => !idsToDelete.has(getRowKey(c)));
        const normalized = remaining.map((c, idx) => ({ ...c, lineNo: String(idx + 1) }));
        return { ...r, detailLines: normalized, isDirty: true };
      }
      return r;
    }));

    setSelectedRow(prev => {
      if (!prev || getRowKey(prev) !== parentId) return prev;
      const remaining = (prev.detailLines || []).filter(c => !idsToDelete.has(getRowKey(c)));
      const normalized = remaining.map((c, idx) => ({ ...c, lineNo: String(idx + 1) }));
      return { ...prev, detailLines: normalized, isDirty: true };
    });

    setSelectedChildIds(new Set());
    setSelectedChildRow(null);
    toast.success("Voucher line(s) deleted.");
  };

  const handleChildDiscard = async () => {
    if (!selectedRow) return;

    if (selectedRow.voucherKey) {
      try {
        const detailResponse = await api.get(`${apiBaseUrl}/${selectedRow.voucherKey}`);
        const savedRecord = mapHeaderToRecord(detailResponse.data.header || {}, detailResponse.data.lines || []);
        setRecords(prev => prev.map(r => getRowKey(r) === getRowKey(selectedRow) ? savedRecord : r));
        await selectRecord(savedRecord);
        toast.info("Unsaved line changes discarded.");
      } catch {
        toast.error("Unable to reload saved voucher lines.");
      }
      return;
    }

    const cleanLines = (selectedRow.detailLines || []).map(line => ({ ...line, isDirty: false }));
    const cleanRow = { ...selectedRow, detailLines: cleanLines };
    setRecords(prev => prev.map(r => getRowKey(r) === getRowKey(selectedRow) ? cleanRow : r));
    setSelectedRow(cleanRow);
    setSelectedChildRow(prev => {
      if (!prev) return prev;
      const refreshed = cleanLines.find(line => getRowKey(line) === getRowKey(prev));
      return refreshed || prev;
    });
    toast.info("Unsaved line changes discarded.");
  };

  const isDirty = records.some(r => r.isDirty || (r.detailLines || []).some(d => d.isDirty));
  const activeRecordId = selectedRow ? getRowKey(selectedRow) : "";
  const dynamicChildColumns = childColumns.map(column => {
    if (column.key === "taxability") {
      return {
        ...column,
        onBlur: (val) => {
          const clean = String(val || "").trim().toUpperCase();
          if (clean && !["T", "R", "N"].includes(clean)) {
            toast.warn("Invalid taxability code detected. Please enter a valid classification: 'T' for Sales/VAT, 'R' for Use/Reverse tax, or 'N' for Non-taxable.", {
              toastId: "invalid-taxability"
            });
          }
        }
      };
    }
    if (column.key === "account") {
      return {
        ...column,
        options: accountDropdownOptions,
        onSelect: (opt, rowId) => {
          handleChildFieldChange(rowId, "account", opt.label);
          handleChildFieldChange(rowId, "accountName", opt.name || opt.label);
        }
      };
    }
    if (column.key === "organization") {
      return {
        ...column,
        options: organizationDropdownOptions,
        onSelect: (opt, rowId) => {
          handleChildFieldChange(rowId, "organization", opt.label);
          handleChildFieldChange(rowId, "organizationName", opt.name || opt.label);
        }
      };
    }
    if (column.key === "taxVatCode") {
      return {
        ...column,
        options: taxVatDropdownOptions,
        onSelect: (opt, rowId) => {
          const selectedCode = opt.value || opt.code || opt.label;
          handleChildFieldChange(rowId, "taxVatCode", selectedCode);
          if (opt.rate !== undefined) {
            handleChildFieldChange(rowId, "taxRate", String(opt.rate));
          }
          if (opt.recoveryRate !== undefined) {
            handleChildFieldChange(rowId, "recoveryRate", String(opt.recoveryRate));
          }
        }
      };
    }
    if (column.key === "project") {
      return projectDropdownOptions.length > 0
        ? {
          ...column,
          options: projectDropdownOptions,
          onSelect: (opt, rowId) => {
            handleChildFieldChange(rowId, "project", opt.label);
            handleChildFieldChange(rowId, "projectName", opt.name || opt.label);
          }
        }
        : { ...column, type: "text", options: [] };
    }
    return column;
  });

  const renderVoucherTotalsPopup = () => {
    if (!selectedRow) return null;
    const lines = selectedRow.detailLines || [];
    const activeId = getRowKey(selectedRow);

    const computedCostAmount = lines.reduce((sum, line) => sum + toNumber(line.costAmount, 0), 0);
    const computedSalesTaxAmount = lines.reduce((sum, line) => sum + toNumber(line.salesVatTaxAmt, 0), 0);
    const computedRecoveryAmount = lines.reduce((sum, line) => sum + toNumber(line.recoveryAmt, 0), 0);
    const computedTotalBeforeDiscount = lines.reduce((sum, line) => sum + toNumber(line.totBeforeDisc, 0), 0);
    const computedDiscountAmount = lines.reduce((sum, line) => sum + toNumber(line.discount, 0), 0);
    const computedTotalAmount = lines.reduce((sum, line) => sum + toNumber(line.totalAmt, 0), 0);
    const computedUseTaxAmount = lines.reduce((sum, line) => sum + toNumber(line.useReverseTaxAmt, 0), 0);

    const costAmount = selectedRow.invoiceAmount !== undefined && selectedRow.invoiceAmount !== null
      ? selectedRow.invoiceAmount
      : computedCostAmount.toFixed(2);

    const salesTaxAmount = selectedRow.totalTax !== undefined && selectedRow.totalTax !== null
      ? selectedRow.totalTax
      : computedSalesTaxAmount.toFixed(2);

    const recoveryAmount = selectedRow.recoveryAmount !== undefined && selectedRow.recoveryAmount !== null
      ? selectedRow.recoveryAmount
      : computedRecoveryAmount.toFixed(2);

    const totalBeforeDiscount = selectedRow.totalBeforeDiscount !== undefined && selectedRow.totalBeforeDiscount !== null
      ? selectedRow.totalBeforeDiscount
      : computedTotalBeforeDiscount.toFixed(2);

    const discountAmount = selectedRow.discountAmount !== undefined && selectedRow.discountAmount !== null
      ? selectedRow.discountAmount
      : computedDiscountAmount.toFixed(2);

    const totalAmount = selectedRow.totalAmount !== undefined && selectedRow.totalAmount !== null
      ? selectedRow.totalAmount
      : computedTotalAmount.toFixed(2);

    const amountPaid = selectedRow.checkAmount !== undefined && selectedRow.checkAmount !== null
      ? selectedRow.checkAmount
      : toNumber(selectedRow.checkAmount, 0).toFixed(2);

    const discountTakenAmount = selectedRow.checkDiscountTaken !== undefined && selectedRow.checkDiscountTaken !== null
      ? selectedRow.checkDiscountTaken
      : toNumber(selectedRow.checkDiscountTaken, 0).toFixed(2);

    const useTaxAmount = selectedRow.useTaxAmount !== undefined && selectedRow.useTaxAmount !== null
      ? selectedRow.useTaxAmount
      : computedUseTaxAmount.toFixed(2);

    return (
      <PopupShell title="Voucher Totals" onClose={() => setActivePopup("")}>
        <FormSection title="Voucher Totals">
          <div className="max-w-md space-y-2 py-4">
            <FormInput
              horizontal
              label="Cost Amount"
              value={costAmount}
              onChange={(e) => handleFieldChange(activeId, "invoiceAmount", e.target.value)}
              inputClassName="text-right"
            />
            <FormInput
              horizontal
              label="Sales/VAT Tax Amount"
              value={salesTaxAmount}
              onChange={(e) => handleFieldChange(activeId, "totalTax", e.target.value)}
              inputClassName="text-right"
            />
            <FormInput
              horizontal
              label="Recovery Amount"
              value={recoveryAmount}
              onChange={(e) => handleFieldChange(activeId, "recoveryAmount", e.target.value)}
              inputClassName="text-right"
            />
            <FormInput
              horizontal
              label="Total Before Discount"
              value={totalBeforeDiscount}
              onChange={(e) => handleFieldChange(activeId, "totalBeforeDiscount", e.target.value)}
              inputClassName="text-right"
            />
            <FormInput
              horizontal
              label="Discount Amount"
              value={discountAmount}
              onChange={(e) => handleFieldChange(activeId, "discountAmount", e.target.value)}
              inputClassName="text-right"
            />
            <FormInput
              horizontal
              label="Total Amount"
              value={totalAmount}
              onChange={(e) => handleFieldChange(activeId, "totalAmount", e.target.value)}
              inputClassName="text-right"
            />
            <FormInput
              horizontal
              label="Amount Paid"
              value={amountPaid}
              onChange={(e) => handleFieldChange(activeId, "checkAmount", e.target.value)}
              inputClassName="text-right"
            />
            <FormInput
              horizontal
              label="Discount Taken Amount"
              value={discountTakenAmount}
              onChange={(e) => handleFieldChange(activeId, "checkDiscountTaken", e.target.value)}
              inputClassName="text-right"
            />
            <FormInput
              horizontal
              label="Use/Reverse Tax Amount"
              value={useTaxAmount}
              onChange={(e) => handleFieldChange(activeId, "useTaxAmount", e.target.value)}
              inputClassName="text-right"
            />
          </div>
        </FormSection>
      </PopupShell>
    );
  };

  const renderVendorLaborContainer = () => {
    const closeTab = () => {
      setActiveNestedTabs(prev => {
        const updated = { ...prev };
        delete updated["Vendor Labor"];
        return updated;
      });
    };

    const handleAdd = () => {
      if (!selectedChildRow) return;
      handleChildFieldChange(getRowKey(selectedChildRow), "subLine", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "vendorEmployee", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "glc", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "plc", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "hours", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "laborAmount", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "vatRecoveryAmt", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "effectiveBillingDate", "");
    };

    const handleCopy = () => {
      if (!selectedChildRow) return;
      setLaborClipboard({
        subLine: selectedChildRow.subLine || "",
        vendorEmployee: selectedChildRow.vendorEmployee || "",
        glc: selectedChildRow.glc || "",
        plc: selectedChildRow.plc || "",
        hours: selectedChildRow.hours || "",
        laborAmount: selectedChildRow.laborAmount || "",
        vatRecoveryAmt: selectedChildRow.vatRecoveryAmt || "",
        effectiveBillingDate: selectedChildRow.effectiveBillingDate || ""
      });
      toast.success("Vendor labor copied.");
    };

    const handleDelete = () => {
      if (!selectedChildRow) return;
      handleChildFieldChange(getRowKey(selectedChildRow), "subLine", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "vendorEmployee", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "glc", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "plc", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "hours", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "laborAmount", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "vatRecoveryAmt", "");
      handleChildFieldChange(getRowKey(selectedChildRow), "effectiveBillingDate", "");
    };

    const vendorLaborColumns = [
      { id: "subLine", key: "subLine", label: "Line Number *" },
      {
        id: "vendorEmployee",
        key: "vendorEmployee",
        label: "Vendor Employee",
        type: vendorEmployeeOptions.length > 0 ? "search-select" : "text",
        options: vendorEmployeeOptions,
        displayKey: "label"
      },
      {
        id: "glc",
        key: "glc",
        label: "General Labor Category *",
        type: glcOptions.length > 0 ? "search-select" : "text",
        options: glcOptions,
        displayKey: "label"
      },
      {
        id: "plc",
        key: "plc",
        label: "Project Labor Category",
        type: plcOptions.length > 0 ? "search-select" : "text",
        options: plcOptions,
        displayKey: "label"
      },
      { id: "hours", key: "hours", label: "Labor Hours *", type: "number" },
      { id: "laborAmount", key: "laborAmount", label: "Labor Cost Amount", type: "number" },
      { id: "vatRecoveryAmt", key: "vatRecoveryAmt", label: "VAT Reclaim Amount", type: "readOnly-text" },
      { id: "effectiveBillingDate", key: "effectiveBillingDate", label: "Billing Effective Date *", type: "date" }
    ];

    const checkedLines = selectedChildIds.size > 0
      ? (selectedRow?.detailLines || []).filter(line => selectedChildIds.has(getRowKey(line)))
      : (selectedChildRow ? [selectedChildRow] : (selectedRow?.detailLines || []));

    const linesToRender = checkedLines;
    const data = linesToRender.map(line => {
      const lineCost = line.costAmount !== undefined && line.costAmount !== "" ? String(line.costAmount) : "0.00";
      const lineRecovery = line.recoveryAmt !== undefined && line.recoveryAmt !== "" ? String(line.recoveryAmt) : "0.00";
      return {
        ...line,
        subLine: line.subLine || line.lineNo || "",
        laborAmount: line.laborAmountExplicit ? line.laborAmount : lineCost,
        vatRecoveryAmt: line.vatRecoveryAmt || lineRecovery
      };
    });

    const activeChildLine = (selectedChildRow && linesToRender.some(l => getRowKey(l) === getRowKey(selectedChildRow)))
      ? selectedChildRow
      : (linesToRender[0] || null);

    const activeCost = activeChildLine?.costAmount !== undefined && activeChildLine?.costAmount !== "" ? String(activeChildLine.costAmount) : "0.00";
    const activeRecovery = activeChildLine?.recoveryAmt !== undefined && activeChildLine?.recoveryAmt !== "" ? String(activeChildLine.recoveryAmt) : "0.00";

    return (
      <SecondaryContainer
        title="Payment Voucher > Vendor Labor"
        handleClose={closeTab}
        className="mt-4 shadow-sm bg-white border border-slate-200/80 rounded-xl"
      >
        <Toolbar
          isFormView={isVendorLaborFormView}
          columns={vendorLaborColumns}
          actions={{
            onAdd: handleAdd,
            onCopy: handleCopy,
            onDelete: handleDelete,
            onToggleView: () => setIsVendorLaborFormView(prev => !prev)
          }}
          buttonsDisable={["paste", "discard", "save"]}
          currentIndex={linesToRender.findIndex(d => getRowKey(d) === getRowKey(activeChildLine))}
          totalRecords={linesToRender.length}
          handleNavigate={(dir) => {
            const idx = linesToRender.findIndex(d => getRowKey(d) === getRowKey(activeChildLine));
            let targetChild = null;
            if (dir === 'start' && linesToRender.length > 0) targetChild = linesToRender[0];
            else if (dir === 'prev' && idx > 0) targetChild = linesToRender[idx - 1];
            else if (dir === 'next' && idx < linesToRender.length - 1) targetChild = linesToRender[idx + 1];
            else if (dir === 'end' && linesToRender.length > 0) targetChild = linesToRender[linesToRender.length - 1];
            if (targetChild) {
              setSelectedChildRow(targetChild);
            }
          }}
        />
        {!activeChildLine ? (
          <div className="text-center text-gray-400 italic text-[11px] py-8">
            No line selected. Select line(s) in A/P Voucher Detail to view vendor labor.
          </div>
        ) : !isVendorLaborFormView ? (
          <div className="p-2">
            <ReusableTable
              data={data}
              columns={vendorLaborColumns}
              selectedRows={selectedChildIds}
              onSelectAll={(e) => {
                if (e.target.checked) {
                  setSelectedChildIds(new Set((selectedRow?.detailLines || []).map(getRowKey)));
                } else {
                  setSelectedChildIds(new Set());
                }
              }}
              onRowSelect={(item) => {
                const key = getRowKey(item);
                const newIds = new Set(selectedChildIds);
                if (newIds.has(key)) {
                  newIds.delete(key);
                } else {
                  newIds.add(key);
                }
                setSelectedChildIds(newIds);
                setSelectedChildRow(item);
              }}
              onFieldChange={(rowId, field, val) => handleChildFieldChange(rowId, field, val)}
              rowKey={getRowKey}
              maxHeight="max-h-64"
            />
          </div>
        ) : (
          <FormSection title="Vendor Labor">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <FormInput
                label="Line Number *"
                value={activeChildLine.subLine || activeChildLine.lineNo || ""}
                onChange={(e) => handleChildFieldChange(getRowKey(activeChildLine), "subLine", e.target.value)}
              />
              <FormSearchSelect
                label="Vendor Employee"
                value={activeChildLine.vendorEmployee || ""}
                options={vendorEmployeeOptions}
                displayKey="label"
                onSelect={(opt) => handleChildFieldChange(getRowKey(activeChildLine), "vendorEmployee", opt.value || opt.label)}
                placeholder="Select or enter Vendor Employee..."
              />
              <FormSearchSelect
                label="General Labor Category *"
                value={activeChildLine.glc || ""}
                options={glcOptions}
                displayKey="label"
                onSelect={(opt) => handleChildFieldChange(getRowKey(activeChildLine), "glc", opt.value || opt.label)}
                placeholder="Select General Labor Category..."
              />
              <FormSearchSelect
                label="Project Labor Category"
                value={activeChildLine.plc || ""}
                options={plcOptions}
                displayKey="label"
                onSelect={(opt) => handleChildFieldChange(getRowKey(activeChildLine), "plc", opt.value || opt.label)}
                placeholder="Select Project Labor Category..."
              />
              <FormInput
                label="Labor Hours *"
                type="number"
                value={activeChildLine.hours || ""}
                onChange={(e) => handleChildFieldChange(getRowKey(activeChildLine), "hours", e.target.value)}
              />
              <FormInput
                label="Labor Cost Amount"
                type="number"
                value={activeChildLine.laborAmountExplicit ? activeChildLine.laborAmount : activeCost}
                onChange={(e) => {
                  handleChildFieldChange(getRowKey(activeChildLine), "laborAmount", e.target.value);
                  handleChildFieldChange(getRowKey(activeChildLine), "laborAmountExplicit", true);
                }}
              />
              <FormInput
                label="VAT Reclaim Amount"
                type="number"
                value={activeChildLine.vatRecoveryAmt || activeRecovery}
                readOnly
                disabled
              />
              <FormInput
                label="Billing Effective Date *"
                type="date"
                value={activeChildLine.effectiveBillingDate || ""}
                onChange={(e) => handleChildFieldChange(getRowKey(activeChildLine), "effectiveBillingDate", e.target.value)}
              />
            </div>
          </FormSection>
        )}
      </SecondaryContainer>
    );
  };

  const renderCurrencyLineContainer = () => {
    const closeTab = () => {
      setActiveNestedTabs(prev => {
        const updated = { ...prev };
        delete updated["Currency Line"];
        return updated;
      });
    };

    const currencyColumns = [
      { id: "costAmount", key: "costAmount", label: "Cost Amount", type: "number" },
      { id: "salesVatTaxAmt", key: "salesVatTaxAmt", label: "Sales/VAT Tax Amt", type: "number" },
      { id: "recoveryAmt", key: "recoveryAmt", label: "Recovery Amt", type: "number" },
      { id: "totBeforeDisc", key: "totBeforeDisc", label: "Tot Before Disc", type: "number" },
      { id: "discount", key: "discount", label: "Discount", type: "number" },
      { id: "totalAmt", key: "totalAmt", label: "Total Amt", type: "number" },
      { id: "useReverseTaxAmt", key: "useReverseTaxAmt", label: "Use/Reverse Tax Amt", type: "number" }
    ];

    const data = selectedChildRow ? [selectedChildRow] : [];

    return (
      <SecondaryContainer
        title="Payment Voucher > Currency Line"
        handleClose={closeTab}
        className="mt-4 shadow-sm bg-white border border-slate-200/80 rounded-xl"
      >
        <Toolbar
          isFormView={isCurrencyLineFormView}
          columns={currencyColumns}
          actions={{
            onToggleView: () => setIsCurrencyLineFormView(prev => !prev)
          }}
          buttonsDisable={["add", "copy", "paste", "delete", "discard", "save"]}
          currentIndex={(selectedRow?.detailLines || []).findIndex(d => getRowKey(d) === getRowKey(selectedChildRow))}
          totalRecords={(selectedRow?.detailLines || []).length}
          handleNavigate={(dir) => {
            const lines = selectedRow?.detailLines || [];
            const idx = lines.findIndex(d => getRowKey(d) === getRowKey(selectedChildRow));
            let targetChild = null;
            if (dir === 'start' && lines.length > 0) targetChild = lines[0];
            else if (dir === 'prev' && idx > 0) targetChild = lines[idx - 1];
            else if (dir === 'next' && idx < lines.length - 1) targetChild = lines[idx + 1];
            else if (dir === 'end' && lines.length > 0) targetChild = lines[lines.length - 1];
            if (targetChild) {
              setSelectedChildRow(targetChild);
              setSelectedChildIds(new Set([getRowKey(targetChild)]));
            }
          }}
        />
        {!selectedChildRow ? (
          <div className="text-center text-gray-400 italic text-[11px] py-8">
            No line selected. Select a line to view currency line details.
          </div>
        ) : !isCurrencyLineFormView ? (
          <div className="p-2">
            <ReusableTable
              data={data}
              columns={currencyColumns}
              selectedRows={new Set()}
              onRowSelect={() => { }}
              rowKey={getRowKey}
              maxHeight="max-h-64"
            />
          </div>
        ) : (
          <FormSection title="Line Amounts">
            <div className="max-w-xl space-y-1 py-4">
              <FormInput
                label="Cost Amount"
                type="number"
                value={selectedChildRow.costAmount || ""}
                onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "costAmount", e.target.value)}
              />
              <div className="flex items-center justify-between gap-4 w-full py-0.5">
                <span className="text-[11px] font-semibold text-slate-700 select-none w-2/5 text-left">Taxability</span>
                <div className="w-3/5 relative">
                  <input
                    type="text"
                    list="taxabilityOptions"
                    placeholder="Select or type T, R, or N..."
                    value={selectedChildRow.taxability || ""}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      handleChildFieldChange(getRowKey(selectedChildRow), "taxability", val);
                    }}
                    onBlur={(e) => {
                      const val = String(e.target.value || "").toUpperCase().trim();
                      if (val && !["T", "R", "N"].includes(val)) {
                        toast.warn("Invalid taxability code detected. Please enter a valid classification: 'T' for Sales/VAT, 'R' for Use/Reverse tax, or 'N' for Non-taxable.", {
                          toastId: "invalid-taxability"
                        });
                      }
                    }}
                    className="w-full px-2 py-0.5 rounded border text-[11px] font-medium bg-white border-slate-200 text-slate-800 outline-none hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                  />
                  <datalist id="taxabilityOptions">
                    <option value="T">T - Sales/VAT Taxable</option>
                    <option value="R">R - Reverse Charge / Use Tax</option>
                    <option value="N">N - Non-Taxable / Exempt</option>
                  </datalist>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 w-full py-0.5">
                <span className="text-[11px] font-semibold text-slate-700 select-none w-2/5 text-left">Tax/VAT Code</span>
                <div className="w-3/5">
                  <select
                    className="w-full px-2 py-0.5 rounded border text-[11px] font-medium bg-white border-slate-200 text-slate-800 outline-none hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    value={selectedChildRow.taxVatCode || ""}
                    onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "taxVatCode", e.target.value)}
                  >
                    <option value="">Select Tax Code...</option>
                    {taxVatDropdownOptions.map((opt, i) => (
                      <option key={i} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <FormInput label="Tax Rate (%)" type="number" value={selectedChildRow.taxRate || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "taxRate", e.target.value)} />
              <FormInput label="Sales/VAT Tax Amount" type="number" value={selectedChildRow.salesVatTaxAmt || ""} readOnly />
              <FormInput label="Use/Reverse Tax Amount" type="number" value={selectedChildRow.useReverseTaxAmt || ""} readOnly />
              <FormInput label="Recovery Rate (%)" type="number" value={selectedChildRow.recoveryRate || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "recoveryRate", e.target.value)} />
              <FormInput label="Recovery Amount" type="number" value={selectedChildRow.recoveryAmt || ""} readOnly />
              <FormInput label="Total Before Discount" type="number" value={selectedChildRow.totBeforeDisc || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "totBeforeDisc", e.target.value)} />
              <FormInput label="Discount Amount" type="number" value={selectedChildRow.discount || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "discount", e.target.value)} />
              <FormInput label="Total Amount" type="number" value={selectedChildRow.totalAmt || ""} readOnly />
            </div>
          </FormSection>
        )}
      </SecondaryContainer>
    );
  };

  const renderCustomsInfoContainer = () => {
    const closeTab = () => {
      setActiveNestedTabs(prev => {
        const updated = { ...prev };
        delete updated["Customs Info"];
        return updated;
      });
    };

    const handleDelete = () => {
      handleFieldChange(activeRecordId, "taxId", "");
      handleFieldChange(activeRecordId, "taxingDate", "");
      handleFieldChange(activeRecordId, "taxLocation", "");
      handleFieldChange(activeRecordId, "destinationCountry", "");
      handleFieldChange(activeRecordId, "trafficDirection", "");
      handleFieldChange(activeRecordId, "permitLicense", "");
      handleFieldChange(activeRecordId, "intrastatReference", "");
      handleFieldChange(activeRecordId, "deliveryTerms", "");
      handleFieldChange(activeRecordId, "modeOfTransportation", "");
      handleFieldChange(activeRecordId, "supplyDate", "");
      handleFieldChange(activeRecordId, "declarationPoint", "");
      if (selectedChildRow) {
        handleChildFieldChange(getRowKey(selectedChildRow), "shipFromEcCountry", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "mass", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "unitOfMeasure", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "countryOfOrigin", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "notc", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "commodity", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "supplementalUnits", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "correction", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "customsValue", "");
        handleChildFieldChange(getRowKey(selectedChildRow), "goodsServices", "G");
      }
    };

    const customsColumns = [
      { id: "taxId", key: "taxId", label: "Tax ID" },
      { id: "taxingDate", key: "taxingDate", label: "Tax Date", type: "date" },
      { id: "taxLocation", key: "taxLocation", label: "Tax Location" },
      { id: "destinationCountry", key: "destinationCountry", label: "Destination Country" },
      { id: "trafficDirection", key: "trafficDirection", label: "Traffic Direction" },
      { id: "permitLicense", key: "permitLicense", label: "Permit/License" },
      { id: "intrastatReference", key: "intrastatReference", label: "Intrastat Reference" },
      { id: "deliveryTerms", key: "deliveryTerms", label: "Delivery Terms" },
      { id: "modeOfTransportation", key: "modeOfTransportation", label: "Mode of Transportation" },
      { id: "supplyDate", key: "supplyDate", label: "Supply Date", type: "date" },
      { id: "declarationPoint", key: "declarationPoint", label: "Declaration Point" },
      { id: "lineNo", key: "lineNo", label: "Line" },
      { id: "shipFromEcCountry", key: "shipFromEcCountry", label: "Ship from EC Country" },
      { id: "mass", key: "mass", label: "Mass" },
      { id: "unitOfMeasure", key: "unitOfMeasure", label: "Unit of Measure" },
      { id: "countryOfOrigin", key: "countryOfOrigin", label: "Country of Origin" },
      { id: "notc", key: "notc", label: "NOTC" },
      { id: "commodity", key: "commodity", label: "Commodity" },
      { id: "supplementalUnits", key: "supplementalUnits", label: "Supplemental Units" },
      { id: "correction", key: "correction", label: "Correction" },
      { id: "customsValue", key: "customsValue", label: "Value" },
      { id: "goodsServices", key: "goodsServices", label: "Goods/Services" }
    ];

    const customsData = selectedRow
      ? [{
        ...selectedRow,
        lineNo: selectedChildRow?.lineNo || "",
        shipFromEcCountry: selectedChildRow?.shipFromEcCountry || "",
        mass: selectedChildRow?.mass || "",
        unitOfMeasure: selectedChildRow?.unitOfMeasure || "",
        countryOfOrigin: selectedChildRow?.countryOfOrigin || "",
        notc: selectedChildRow?.notc || "",
        commodity: selectedChildRow?.commodity || "",
        supplementalUnits: selectedChildRow?.supplementalUnits || "",
        correction: selectedChildRow?.correction || "",
        customsValue: selectedChildRow?.customsValue || "",
        goodsServices: selectedChildRow?.goodsServices || "G"
      }]
      : [];

    return (
      <SecondaryContainer
        title="Payment Voucher > Customs Info"
        handleClose={closeTab}
        className="mt-4 shadow-sm bg-white border border-slate-200/80 rounded-xl"
      >
        <Toolbar
          isFormView={isCustomsInfoFormView}
          columns={customsColumns}
          actions={{
            onDelete: handleDelete,
            onToggleView: () => setIsCustomsInfoFormView(prev => !prev)
          }}
          buttonsDisable={["add", "copy", "paste", "discard", "save"]}
          currentIndex={(selectedRow?.detailLines || []).findIndex(d => getRowKey(d) === getRowKey(selectedChildRow))}
          totalRecords={(selectedRow?.detailLines || []).length}
          handleNavigate={(dir) => {
            const lines = selectedRow?.detailLines || [];
            const idx = lines.findIndex(d => getRowKey(d) === getRowKey(selectedChildRow));
            let targetChild = null;
            if (dir === 'start' && lines.length > 0) targetChild = lines[0];
            else if (dir === 'prev' && idx > 0) targetChild = lines[idx - 1];
            else if (dir === 'next' && idx < lines.length - 1) targetChild = lines[idx + 1];
            else if (dir === 'end' && lines.length > 0) targetChild = lines[lines.length - 1];
            if (targetChild) {
              setSelectedChildRow(targetChild);
              setSelectedChildIds(new Set([getRowKey(targetChild)]));
            }
          }}
        />
        {!isCustomsInfoFormView ? (
          <div className="p-2">
            <ReusableTable
              data={customsData}
              columns={customsColumns}
              selectedRows={new Set()}
              onRowSelect={() => { }}
              rowKey={getRowKey}
              maxHeight="max-h-64"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <FormSection title="Value Added Tax Information">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                <FormInput label="Tax ID" value={selectedRow?.taxId || ""} onChange={(e) => handleFieldChange(activeRecordId, "taxId", e.target.value)} />
                <FormInput label="Tax Date" type="date" value={selectedRow?.taxingDate || ""} onChange={(e) => handleFieldChange(activeRecordId, "taxingDate", e.target.value)} />
                <FormInput label="Tax Location" value={selectedRow?.taxLocation || ""} onChange={(e) => handleFieldChange(activeRecordId, "taxLocation", e.target.value)} />
              </div>
            </FormSection>
            <FormSection title="Customs Header Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <FormInput label="Destination Country" value={selectedRow?.destinationCountry || ""} onChange={(e) => handleFieldChange(activeRecordId, "destinationCountry", e.target.value)} />
                <FormInput label="Traffic Direction" value={selectedRow?.trafficDirection || ""} onChange={(e) => handleFieldChange(activeRecordId, "trafficDirection", e.target.value)} />
                <FormInput label="Permit/License" value={selectedRow?.permitLicense || ""} onChange={(e) => handleFieldChange(activeRecordId, "permitLicense", e.target.value)} />
                <FormInput label="Intrastat Reference" value={selectedRow?.intrastatReference || ""} onChange={(e) => handleFieldChange(activeRecordId, "intrastatReference", e.target.value)} />
                <FormInput label="Delivery Terms" value={selectedRow?.deliveryTerms || ""} onChange={(e) => handleFieldChange(activeRecordId, "deliveryTerms", e.target.value)} />
                <FormInput label="Mode of Transportation" value={selectedRow?.modeOfTransportation || ""} onChange={(e) => handleFieldChange(activeRecordId, "modeOfTransportation", e.target.value)} />
                <FormInput label="Supply Date" type="date" value={selectedRow?.supplyDate || ""} onChange={(e) => handleFieldChange(activeRecordId, "supplyDate", e.target.value)} />
                <FormInput label="Declaration Point" value={selectedRow?.declarationPoint || ""} onChange={(e) => handleFieldChange(activeRecordId, "declarationPoint", e.target.value)} />
              </div>
            </FormSection>
            <FormSection title="Customs Line Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <FormInput label="Line" value={selectedChildRow?.lineNo || ""} disabled />
                <FormInput label="Ship from EC Country" value={selectedChildRow?.shipFromEcCountry || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "shipFromEcCountry", e.target.value)} />
                <FormInput label="Mass" value={selectedChildRow?.mass || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "mass", e.target.value)} />
                <FormInput label="Unit of Measure" value={selectedChildRow?.unitOfMeasure || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "unitOfMeasure", e.target.value)} />
                <FormInput label="Country of Origin" value={selectedChildRow?.countryOfOrigin || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "countryOfOrigin", e.target.value)} />
                <FormInput label="NOTC" value={selectedChildRow?.notc || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "notc", e.target.value)} />
                <FormInput label="Commodity" value={selectedChildRow?.commodity || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "commodity", e.target.value)} />
                <FormInput label="Supplemental Units" value={selectedChildRow?.supplementalUnits || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "supplementalUnits", e.target.value)} />
                <FormInput label="Correction" value={selectedChildRow?.correction || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "correction", e.target.value)} />
                <FormInput label="Value" value={selectedChildRow?.customsValue || ""} onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "customsValue", e.target.value)} />
                <div className="space-x-2 flex items-center m-1">
                  <label className="f-head font-[400] text-[10px] text-black min-w-[90px]">Goods/Services *</label>
                  <select
                    className="border border-slate-200 outline-none p-1 rounded font-light text-[10px] flex-1 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                    value={selectedChildRow?.goodsServices || "G"}
                    onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "goodsServices", e.target.value)}
                  >
                    <option value="G">G</option>
                    <option value="S">S</option>
                  </select>
                </div>
              </div>
            </FormSection>
          </div>
        )}
      </SecondaryContainer>
    );
  };

  const jumpToCode = (code) => {
    if (!code) return;
    const found = records.find(r => String(r.voucher).toLowerCase() === String(code).toLowerCase());
    if (found) {
      selectRecord(found);
      setIsFormView(true);
    } else {
      toast.error(`Voucher "${code}" not found.`);
    }
  };

  isCurrentRecordApprovedLocked = selectedRow?.approved === "Y" && !selectedRow?.isDirty;

  return (
    <div className="p-4 space-y-4 font-inter text-[#17414d]">
      {/* MASTER SECTION - dollar icon removed from header title as requested */}
      <MainContainer title="Payment Voucher" icon={PaymentVoucherIcon}>
        <Toolbar
          isFormView={isFormView}
          columns={masterColumns}
          currentIndex={records.findIndex(r => getRowKey(r) === activeRecordId)}
          totalRecords={records.length}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          handleNavigate={(dir) => {
            const idx = records.findIndex(r => getRowKey(r) === activeRecordId);
            let targetRow = null;
            if (dir === 'start' && records.length > 0) targetRow = records[0];
            else if (dir === 'prev' && idx > 0) targetRow = records[idx - 1];
            else if (dir === 'next' && idx < records.length - 1) targetRow = records[idx + 1];
            else if (dir === 'end' && records.length > 0) targetRow = records[records.length - 1];
            if (targetRow) {
              selectRecord(targetRow);
            }
          }}
          actions={{
            onAdd: handleAdd,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleDiscard,
            onDelete: handleDelete,
            onSave: handleSave,
            onToggleView: () => {
              if (!isFormView && !selectedRow && records.length > 0) {
                setSelectedRow(records[0]);
                setSelectedIds(new Set([getRowKey(records[0])]));
              }
              setIsFormView(!isFormView);
            }
          }}
          selectedRow={selectedRow}
          isDirty={isDirty}
          clipboardCount={clipboard.length}
          clipboard={clipboard}
        />

        <div className="mt-2 text-xs">
          {!isFormView ? (
            <div className="bg-white border border-gray-200 p-2">
              <ReusableTable
                data={records}
                columns={masterColumns}
                selectedRows={selectedIds}
                onSelectAll={(e) => {
                  if (e.target.checked) {
                    setSelectedIds(new Set(records.map(getRowKey)));
                  } else {
                    setSelectedIds(new Set());
                  }
                }}
                onRowSelect={(item) => {
                  const key = getRowKey(item);
                  const newIds = new Set(selectedIds);
                  const wasSelected = newIds.has(key);
                  if (wasSelected) {
                    newIds.delete(key);
                  } else {
                    newIds.add(key);
                  }
                  setSelectedIds(newIds);
                  if (!wasSelected) {
                    selectRecord(item);
                  }
                }}
                onFieldChange={handleFieldChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <style>{`
                .relative.rounded.border {
                  background-color: white !important;
                  border: 1px solid #e2e8f0 !important;
                  box-shadow: none !important;
                }
                .relative.rounded.border > span.absolute {
                  background-color: white !important;
                  color: #475569 !important;
                  font-weight: 400 !important;
                  font-size: 11px !important;
                }
                .z-30.overflow-visible h2 {
                  font-weight: 700 !important;
                  color: #1f2937 !important;
                }
              `}</style>
              {/* Accounts Payable Vouchers Master Header Form Container */}
              <div className="p-5 bg-white border border-slate-200/80 shadow-sm rounded mb-4">
                <div className="flex items-center gap-2 mb-3 border-b-2 border-slate-300 pb-3 select-none">
                  <span className="text-lg font-bold text-gray-800">
                    Voucher Header
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-3">
                  <div className="space-y-2">
                    <FormInput
                      label="Voucher *"
                      value={selectedRow?.voucher || ""}
                      onChange={(e) => handleFieldChange(activeRecordId, "voucher", e.target.value)}
                    />
                    <FormSearchSelect
                      label="Vendor *"
                      value={selectedRow?.vendor || ""}
                      options={[
                        { value: "VND-1001", label: "VND-1001" },
                        { value: "VND-1002", label: "VND-1002" }
                      ]}
                      displayKey="label"
                      onSelect={(opt) => {
                        handleFieldChange(activeRecordId, "vendor", opt.value);
                        handleFieldChange(activeRecordId, "vendorName", opt.value === "VND-1001" ? "Global Solutions Inc." : "Acme Industrial");
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormSearchSelect
                      label="Fiscal Year *"
                      value={selectedRow?.fiscalYear || ""}
                      options={[
                        { value: "2027", label: "2027" },
                        { value: "2025", label: "2025" },
                        { value: "2026", label: "2026" }
                      ]}
                      displayKey="label"
                      onSelect={(opt) => handleFieldChange(activeRecordId, "fiscalYear", opt.value)}
                    />
                    <FormInput
                      label="Vendor Name"
                      value={selectedRow?.vendorName || ""}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <FormSearchSelect
                      label="Period *"
                      value={selectedRow?.period || ""}
                      options={[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "01", label: "01" },
                        { value: "02", label: "02" },
                        { value: "06", label: "06" }
                      ]}
                      displayKey="label"
                      onSelect={(opt) => handleFieldChange(activeRecordId, "period", opt.value)}
                    />
                    <FormSearchSelect
                      label="Terms"
                      value={selectedRow?.terms || ""}
                      options={[
                        { value: "AABBCC", label: "AABBCC" },
                        { value: "Net 30", label: "Net 30" },
                        { value: "Net 60", label: "Net 60" }
                      ]}
                      displayKey="label"
                      onSelect={(opt) => handleFieldChange(activeRecordId, "terms", opt.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormSearchSelect
                      label="Subperiod *"
                      value={selectedRow?.subperiod || ""}
                      options={[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" }
                      ]}
                      displayKey="label"
                      onSelect={(opt) => handleFieldChange(activeRecordId, "subperiod", opt.value)}
                    />
                    <FormInput
                      label="Voucher Type"
                      value={selectedRow?.voucherType || "AP Voucher"}
                      onChange={(e) => handleFieldChange(activeRecordId, "voucherType", e.target.value)}
                    />
                    <div className="flex gap-4 pt-1 items-center">
                      <FormInput
                        label="Approved"
                        type="checkbox"
                        checked={selectedRow?.approved === "Y"}
                        onChange={(e) => handleFieldChange(activeRecordId, "approved", e.target.checked ? "Y" : "N")}
                      />
                      <FormInput
                        label="Template"
                        type="checkbox"
                        checked={selectedRow?.template === "Y"}
                        onChange={(e) => handleFieldChange(activeRecordId, "template", e.target.checked ? "Y" : "N")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TABS HEADER */}
              {/* TABS HEADER */}
              <div className="flex flex-wrap gap-2 mb-3 select-none">
                {[
                  { name: "Header Info" },
                  { name: "Details" },
                  { name: "Payment" }
                ].map(tab => {
                  const isActive = activeTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      type="button"
                      onClick={() => setActiveTab(tab.name)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors flex items-center
                        ${isActive
                          ? 'border-b-2 bg-[#17414d] text-white font-bold'
                          : 'text-gray-600 hover:text-gray-800 bg-gray-100'
                        }`}
                    >
                      {tab.name}
                    </button>
                  );
                })}
              </div>

              {/* TABS CONTAINER */}
              <div className="p-4 bg-white border border-slate-200 rounded shadow-sm">

                {/* 1. HEADER INFO TAB */}
                {activeTab === "Header Info" && (
                  <div className="space-y-4">
                    {/* First Row: Invoice, Due, Routing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="h-full flex flex-col">
                        <FormSection className="h-full" title="Invoice & Discounts">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <span className="text-[11px] font-bold text-slate-700 block mb-1">Invoice Details</span>
                              <FormInput
                                label="Number"
                                value={selectedRow?.invoiceNumber || ""}
                                onChange={(e) => handleFieldChange(activeRecordId, "invoiceNumber", e.target.value)}
                              />
                              <FormInput
                                label="Date"
                                type="date"
                                value={selectedRow?.invoiceDate || ""}
                                onChange={(e) => handleFieldChange(activeRecordId, "invoiceDate", e.target.value)}
                              />
                              <FormInput
                                label="Amount *"
                                value={selectedRow?.invoiceAmount || ""}
                                onChange={(e) => handleFieldChange(activeRecordId, "invoiceAmount", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2 border-t-2 md:border-t-0 md:border-l-2 border-slate-300 pt-2 md:pt-0 md:pl-3">
                              <span className="text-[11px] font-bold text-slate-700 block mb-1">Discounts Info</span>
                              <FormInput
                                label="Percent"
                                value={selectedRow?.discountPercent || ""}
                                onChange={(e) => handleFieldChange(activeRecordId, "discountPercent", e.target.value)}
                              />
                              <FormInput
                                label="Date"
                                type="date"
                                value={selectedRow?.discountDate || ""}
                                onChange={(e) => handleFieldChange(activeRecordId, "discountDate", e.target.value)}
                              />
                              <FormInput
                                label="Amount"
                                value={selectedRow?.discountAmount || ""}
                                onChange={(e) => handleFieldChange(activeRecordId, "discountAmount", e.target.value)}
                              />
                            </div>
                          </div>
                        </FormSection>
                      </div>

                      <div className="h-full flex flex-col gap-3">
                        <FormSection className="flex-1" title="Due Information">
                          <FormInput
                            label="Date"
                            type="date"
                            value={selectedRow?.dueDate || ""}
                            onChange={(e) => handleFieldChange(activeRecordId, "dueDate", e.target.value)}
                          />
                          <FormInput
                            label="Amount"
                            value={selectedRow?.dueAmount || ""}
                            onChange={(e) => handleFieldChange(activeRecordId, "dueAmount", e.target.value)}
                            disabled
                          />
                        </FormSection>
                      </div>

                      <div className="h-full flex flex-col gap-3">
                        <FormSection className="flex-1" title="Routing Accounts">
                          <FormSearchSelect
                            label="A/P"
                            value={selectedRow?.accountDescriptionAp || ""}
                            options={[{ value: "20100", label: "20100 - Accounts Payable" }]}
                            displayKey="label"
                            onSelect={(opt) => handleFieldChange(activeRecordId, "accountDescriptionAp", opt.label)}
                          />
                          <FormSearchSelect
                            label="Cash"
                            value={selectedRow?.accountDescriptionCash || ""}
                            options={[{ value: "10100", label: "10100 - Cash Operating" }]}
                            displayKey="label"
                            onSelect={(opt) => handleFieldChange(activeRecordId, "accountDescriptionCash", opt.label)}
                          />
                        </FormSection>
                      </div>
                    </div>

                    {/* Second Row: Subcontractor, Address, Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-3">
                        <FormSection title="Subcontractor Information">
                          <FormInput
                            label="Invoice Period of Performance Date"
                            type="date"
                            value={selectedRow?.subcontractorInvoicePopDate || ""}
                            onChange={(e) => handleFieldChange(activeRecordId, "subcontractorInvoicePopDate", e.target.value)}
                          />
                          <FormInput
                            label="Delivery Value"
                            value={selectedRow?.subcontractorDeliveryValue || ""}
                            onChange={(e) => handleFieldChange(activeRecordId, "subcontractorDeliveryValue", e.target.value)}
                          />
                          <div className="flex flex-col gap-1 w-full">
                            <span className="text-xs font-semibold text-slate-700 select-none">Invoice Type</span>
                            <select
                              className="w-full px-2 py-0.5 rounded border text-[11px] font-medium bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
                              value={selectedRow?.subcontractorInvoiceType || "None"}
                              onChange={(e) => handleFieldChange(activeRecordId, "subcontractorInvoiceType", e.target.value)}
                            >
                              <option value="None">None</option>
                              <option value="Standard">Standard</option>
                              <option value="Progress">Progress</option>
                            </select>
                          </div>
                        </FormSection>

                        <FormSection title="Address Selection">
                          <FormSearchSelect
                            label="Pay Vendor"
                            value={selectedRow?.payVendor || ""}
                            options={[{ value: "VND-1001", label: "VND-1001" }]}
                            displayKey="label"
                            onSelect={(opt) => {
                              handleFieldChange(activeRecordId, "payVendor", opt.value);
                              handleFieldChange(activeRecordId, "payVendorName", "Global Solutions Inc.");
                            }}
                          />
                          <FormInput
                            label="Pay Vendor Name"
                            placeholder="Pay Vendor Name"
                            value={selectedRow?.payVendorName || ""}
                            disabled
                          />
                          <FormInput
                            label="Joint Payee"
                            value={selectedRow?.jointPayee || ""}
                            onChange={(e) => handleFieldChange(activeRecordId, "jointPayee", e.target.value)}
                          />
                        </FormSection>
                      </div>

                      <div className="flex flex-col h-full">
                        <FormSection className="flex-1 h-full" title="Payment Address">
                          <div className="grid grid-cols-2 gap-2">
                            <FormInput
                              label="Address Code"
                              value={selectedRow?.addressCode || "PRIMARY"}
                              disabled
                            />
                            <FormInput
                              label="Line 1"
                              value={selectedRow?.addressLine1 || ""}
                              disabled
                            />
                            <FormInput
                              label="Line 2"
                              value={selectedRow?.addressLine2 || ""}
                              disabled
                            />
                            <FormInput
                              label="Line 3"
                              value={selectedRow?.addressLine3 || ""}
                              disabled
                            />
                            <FormInput
                              label="City"
                              value={selectedRow?.addressCity || ""}
                              disabled
                            />
                            <FormInput
                              label="State/Province"
                              value={selectedRow?.addressState || ""}
                              disabled
                            />
                            <FormInput
                              label="Postal Code"
                              value={selectedRow?.addressPostalCode || ""}
                              disabled
                            />
                            <FormInput
                              label="Country"
                              value={selectedRow?.addressCountry || ""}
                              disabled
                            />
                            <div className="col-span-2">
                              <FormInput
                                label="Password"
                                type="password"
                                value={selectedRow?.addressPassword || ""}
                                onChange={(e) => handleFieldChange(activeRecordId, "addressPassword", e.target.value)}
                              />
                            </div>
                          </div>
                        </FormSection>
                      </div>

                      <div className="flex flex-col h-full">
                        <FormSection className="flex-1 h-full" title="Notes">
                          <div className="space-y-1.5 flex flex-col h-full">
                            <FormInput
                              label="Print Notes on Check"
                              type="checkbox"
                              checked={selectedRow?.notesPrintOnCheck === "Y"}
                              onChange={(e) => handleFieldChange(activeRecordId, "notesPrintOnCheck", e.target.checked ? "Y" : "N")}
                            />
                            <div className="space-y-1 flex-1 flex flex-col">
                              <span className="text-[10px] text-slate-400 italic block">
                                Text prints on Blank Laser Checks only.
                              </span>
                              <textarea
                                className="w-full flex-1 min-h-[140px] border border-slate-200 outline-none p-1.5 rounded text-[11px] font-medium bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all resize-none"
                                value={selectedRow?.notesText || ""}
                                onChange={(e) => handleFieldChange(activeRecordId, "notesText", e.target.value)}
                              />
                            </div>
                          </div>
                        </FormSection>
                      </div>
                    </div>

                    {/* Totals Section */}
                    <div className="flex gap-6 justify-end items-center pt-4 border-t border-slate-100">
                      <div className="px-4 py-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-4 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-600 select-none">Total Tax</span>
                          <span className="text-xs font-bold text-slate-700">${selectedRow?.totalTax || "0.00"}</span>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-4 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-600 select-none">Remaining Balance</span>
                          <span className="text-xs font-bold text-slate-700">${selectedRow?.remainingBalance || "0.00"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. DETAILS TAB */}
                {activeTab === "Details" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <FormSection title="VAT Info" icon={FileSpreadsheet}>
                          <FormSearchSelect
                            label="Tax ID"
                            value={selectedRow?.taxId || ""}
                            options={[{ value: "TX-9988", label: "TX-9988" }]}
                            displayKey="label"
                            onSelect={(opt) => handleFieldChange(activeRecordId, "taxId", opt.value)}
                          />
                          <FormInput
                            label="Taxing Date"
                            type="date"
                            value={selectedRow?.taxingDate || "2026-06-22"}
                            onChange={(e) => handleFieldChange(activeRecordId, "taxingDate", e.target.value)}
                          />
                          <FormInput
                            label="Tax Location"
                            value={selectedRow?.taxLocation || ""}
                            disabled
                          />
                        </FormSection>

                        <FormSection title="Retainage">
                          <FormInput
                            label="Rate"
                            value={selectedRow?.retainageRate || "0.00%"}
                            onChange={(e) => handleFieldChange(activeRecordId, "retainageRate", e.target.value)}
                          />
                          <FormInput
                            label="Amount"
                            value={selectedRow?.retainageAmount || ""}
                            disabled
                          />
                        </FormSection>

                        <FormSection title="Reference Only">
                          <FormInput
                            label="PO"
                            value={selectedRow?.referencePo || ""}
                            onChange={(e) => handleFieldChange(activeRecordId, "referencePo", e.target.value)}
                          />
                          <FormInput
                            label="PO Release"
                            value={selectedRow?.referencePoRelease || "0"}
                            onChange={(e) => handleFieldChange(activeRecordId, "referencePoRelease", e.target.value)}
                          />
                        </FormSection>
                      </div>

                      <div className="space-y-4">
                        <FormSection title="Recur Voucher Info">
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <FormInput
                              label="Recurred Voucher"
                              type="checkbox"
                              checked={selectedRow?.recurredVoucher === "Y"}
                              onChange={(e) => handleFieldChange(activeRecordId, "recurredVoucher", e.target.checked ? "Y" : "N")}
                            />
                            <FormInput
                              label="Hold Voucher"
                              type="checkbox"
                              checked={selectedRow?.holdVoucher === "Y"}
                              onChange={(e) => handleFieldChange(activeRecordId, "holdVoucher", e.target.checked ? "Y" : "N")}
                            />
                            <FormInput
                              label="Pay When Paid"
                              type="checkbox"
                              checked={selectedRow?.payWhenPaid === "Y"}
                              onChange={(e) => handleFieldChange(activeRecordId, "payWhenPaid", e.target.checked ? "Y" : "N")}
                            />
                            <FormInput
                              label="Separate Check"
                              type="checkbox"
                              checked={selectedRow?.separateCheck === "Y"}
                              onChange={(e) => handleFieldChange(activeRecordId, "separateCheck", e.target.checked ? "Y" : "N")}
                            />
                            <FormInput
                              label="Over Budget"
                              type="checkbox"
                              checked={selectedRow?.overBudget === "Y"}
                              onChange={(e) => handleFieldChange(activeRecordId, "overBudget", e.target.checked ? "Y" : "N")}
                            />
                          </div>
                          <div className="pt-2">
                            <FormInput
                              label="Anticipated Pay Date"
                              type="date"
                              value={selectedRow?.anticipatedPayDate || ""}
                              onChange={(e) => handleFieldChange(activeRecordId, "anticipatedPayDate", e.target.value)}
                            />
                          </div>

                          {selectedRow?.recurredVoucher === "Y" && (
                            <div className="mt-3 pt-3 space-y-3">
                              <span className="text-[10px] font-bold text-slate-500 block">Recurring Setup</span>
                              <FormSearchSelect
                                label="Recurring Code"
                                value={selectedRow?.recurCode || ""}
                                options={[{ value: "REC-01", label: "REC-01 - Monthly Operations" }]}
                                displayKey="label"
                                onSelect={(opt) => handleFieldChange(activeRecordId, "recurCode", opt.value)}
                              />
                              <div className="space-y-1.5 pt-1.5">
                                <span className="text-[10px] font-semibold text-slate-500 block">Date Range</span>
                                
                                <div className="grid grid-cols-5 gap-2 items-center text-[10px] font-medium text-slate-400 text-center select-none pb-1">
                                  <div></div>
                                  <div>FY</div>
                                  <div>Period</div>
                                  <div>Subperiod</div>
                                  <div>End Date</div>
                                </div>

                                <div className="grid grid-cols-5 gap-2 items-center">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase">Start</div>
                                  <input
                                    type="text"
                                    className="w-full px-1.5 py-0.5 border border-slate-200 outline-none rounded text-[10px] font-medium text-slate-800 bg-white"
                                    value={selectedRow?.recurStartFiscalYear || ""}
                                    onChange={(e) => handleFieldChange(activeRecordId, "recurStartFiscalYear", e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    className="w-full px-1.5 py-0.5 border border-slate-200 outline-none rounded text-[10px] font-medium text-slate-800 bg-white"
                                    value={selectedRow?.recurStartPeriod || ""}
                                    onChange={(e) => handleFieldChange(activeRecordId, "recurStartPeriod", e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    className="w-full px-1.5 py-0.5 border border-slate-200 outline-none rounded text-[10px] font-medium text-slate-800 bg-white"
                                    value={selectedRow?.recurStartSubperiod || ""}
                                    onChange={(e) => handleFieldChange(activeRecordId, "recurStartSubperiod", e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    className="w-full px-1.5 py-0.5 border border-slate-200 outline-none rounded text-[10px] font-medium text-slate-400 bg-slate-50 cursor-not-allowed"
                                    value={selectedRow?.recurStartEndingDate || ""}
                                    disabled
                                  />
                                </div>

                                <div className="grid grid-cols-5 gap-2 items-center pt-1">
                                  <div className="text-[10px] font-bold text-slate-500 uppercase">End</div>
                                  <input
                                    type="text"
                                    className="w-full px-1.5 py-0.5 border border-slate-200 outline-none rounded text-[10px] font-medium text-slate-800 bg-white"
                                    value={selectedRow?.recurEndFiscalYear || ""}
                                    onChange={(e) => handleFieldChange(activeRecordId, "recurEndFiscalYear", e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    className="w-full px-1.5 py-0.5 border border-slate-200 outline-none rounded text-[10px] font-medium text-slate-800 bg-white"
                                    value={selectedRow?.recurEndPeriod || ""}
                                    onChange={(e) => handleFieldChange(activeRecordId, "recurEndPeriod", e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    className="w-full px-1.5 py-0.5 border border-slate-200 outline-none rounded text-[10px] font-medium text-slate-800 bg-white"
                                    value={selectedRow?.recurEndSubperiod || ""}
                                    onChange={(e) => handleFieldChange(activeRecordId, "recurEndSubperiod", e.target.value)}
                                  />
                                  <input
                                    type="text"
                                    className="w-full px-1.5 py-0.5 border border-slate-200 outline-none rounded text-[10px] font-medium text-slate-400 bg-slate-50 cursor-not-allowed"
                                    value={selectedRow?.recurEndEndingDate || ""}
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </FormSection>

                        <FormSection title="Template">
                          <FormInput
                            label="Template"
                            value={selectedRow?.templateVal || "0"}
                            disabled
                          />
                          <FormInput
                            label="Expense Report ID"
                            value={selectedRow?.expenseReportId || ""}
                            onChange={(e) => handleFieldChange(activeRecordId, "expenseReportId", e.target.value)}
                          />
                          <FormSearchSelect
                            label="CIS Code"
                            value={selectedRow?.cisCode || ""}
                            options={[]}
                            displayKey="label"
                            onSelect={(opt) => handleFieldChange(activeRecordId, "cisCode", opt.value)}
                          />
                          <FormInput
                            label="Approver"
                            value={selectedRow?.approver || ""}
                            disabled
                          />
                        </FormSection>

                        <FormSection title="Entry Info">
                          <FormInput
                            label="User"
                            value={selectedRow?.entryUser || "15644.JAKIR.SHAIKH"}
                            disabled
                          />
                          <FormInput
                            label="Date"
                            value={selectedRow?.entryDate || "06/22/2026 01:02:05 PM"}
                            disabled
                          />
                        </FormSection>
                      </div>
                    </div>
                  </div>
                )}



                {/* 4. PAYMENT TAB */}
                {activeTab === "Payment" && (
                  <div className="space-y-3">
                    <FormSection title="Vendor Details">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormSearchSelect
                          label="Pay Vendor"
                          value={selectedRow?.payVendor || ""}
                          options={[{ value: "VND-1001", label: "VND-1001" }]}
                          displayKey="label"
                          onSelect={(opt) => {
                            handleFieldChange(activeRecordId, "payVendor", opt.value);
                            handleFieldChange(activeRecordId, "payVendorName", "Global Solutions Inc.");
                          }}
                        />
                        <FormInput
                          label="Pay Vendor Name"
                          placeholder="Pay Vendor Name"
                          value={selectedRow?.payVendorName || ""}
                          disabled
                        />
                        <FormInput
                          label="Joint Payee"
                          value={selectedRow?.jointPayee || ""}
                          onChange={(e) => handleFieldChange(activeRecordId, "jointPayee", e.target.value)}
                        />
                      </div>
                    </FormSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1.5">
                      <FormSection title="Payment Information">
                        <FormInput
                          label="Cash Acct Desc"
                          value={selectedRow?.checkCashAcctDesc || "10100 - Cash Operating"}
                          disabled
                        />
                        <FormInput
                          label="Check Number"
                          value={selectedRow?.checkNumber || ""}
                          onChange={(e) => handleFieldChange(activeRecordId, "checkNumber", e.target.value)}
                        />
                        <FormInput
                          label="Check Date"
                          type="date"
                          value={selectedRow?.checkDate || ""}
                          onChange={(e) => handleFieldChange(activeRecordId, "checkDate", e.target.value)}
                        />
                        <FormInput
                          label="Discount Taken"
                          value={selectedRow?.checkDiscountTaken || ""}
                          onChange={(e) => handleFieldChange(activeRecordId, "checkDiscountTaken", e.target.value)}
                        />
                        <FormInput
                          label="Check Amount"
                          value={selectedRow?.checkAmount || ""}
                          onChange={(e) => handleFieldChange(activeRecordId, "checkAmount", e.target.value)}
                        />
                      </FormSection>

                      <FormSection title="Transaction Rules">
                        <div className="flex flex-col gap-1 w-full">
                          <span className="text-[11px] font-semibold text-slate-700 select-none">Payment Transaction Type</span>
                          <select
                            className="w-full px-2 py-0.5 rounded border border-slate-200 outline-none text-[11px] font-medium bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none"
                            value={selectedRow?.checkPayTransType || "None"}
                            onChange={(e) => handleFieldChange(activeRecordId, "checkPayTransType", e.target.value)}
                          >
                            <option value="None">-None-</option>
                            <option value="Check">Check</option>
                            <option value="EFT">EFT</option>
                          </select>
                        </div>
                        <FormInput
                          label="Payment Reference Code"
                          value={selectedRow?.checkPayRefCode || ""}
                          onChange={(e) => handleFieldChange(activeRecordId, "checkPayRefCode", e.target.value)}
                        />
                      </FormSection>

                      <FormSection title="Period to Post">
                        <FormSearchSelect
                          label="Fiscal Year"
                          value={selectedRow?.checkPostFiscalYear || ""}
                          options={[{ value: "2026", label: "2026" }]}
                          displayKey="label"
                          onSelect={(opt) => handleFieldChange(activeRecordId, "checkPostFiscalYear", opt.value)}
                        />
                        <FormSearchSelect
                          label="Period"
                          value={selectedRow?.checkPostPeriod || ""}
                          options={[{ value: "06", label: "06" }]}
                          displayKey="label"
                          onSelect={(opt) => handleFieldChange(activeRecordId, "checkPostPeriod", opt.value)}
                        />
                        <FormSearchSelect
                          label="Subperiod"
                          value={selectedRow?.checkPostSubperiod || ""}
                          options={[{ value: "1", label: "1" }]}
                          displayKey="label"
                          onSelect={(opt) => handleFieldChange(activeRecordId, "checkPostSubperiod", opt.value)}
                        />
                      </FormSection>
                    </div>
                  </div>
                )}



                {/* BOTTOM LEFT ACTION MENU LINK */}
              </div>
            </div>
          )}

          {/* BOTTOM LEFT ACTION MENU LINK */}
          <div className="mt-4 flex justify-between items-center px-2 pb-2">
            <button
              type="button"
              onClick={() => setActivePopup("voucherTotals")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] shadow-sm transition-all cursor-pointer select-none"
            >
              <Calculator size={13} className="text-slate-500" />
              View Voucher Totals
            </button>
          </div>
        </div>
      </MainContainer>

      {/* DETAILED SECTION (SECONDARY CONTAINER) */}
      <SecondaryContainer
        title="A/P Voucher Detail"
        className="mt-4 shadow-sm bg-white border border-slate-200/80 rounded-xl"
      >
        <Toolbar
          isFormView={isChildFormView}
          columns={dynamicChildColumns}
          actions={{
            onAdd: handleChildAdd,
            onCopy: handleChildCopy,
            onPaste: handleChildPaste,
            onClear: handleChildDiscard,
            onDelete: handleChildDelete,
            onSave: handleSave,
            onToggleView: () => {
              const lines = selectedRow?.detailLines || [];
              if (!isChildFormView && !selectedChildRow && lines.length > 0) {
                setSelectedChildRow(lines[0]);
                setSelectedChildIds(new Set([getRowKey(lines[0])]));
              }
              setIsChildFormView(!isChildFormView);
            }
          }}
          buttonsDisable={['save']}
          selectedRow={selectedChildRow}
          isDirty={(selectedRow?.detailLines || []).some(d => d.isDirty)}
          clipboardCount={childClipboard.length}
          clipboard={childClipboard}
          currentIndex={(selectedRow?.detailLines || []).findIndex(d => getRowKey(d) === getRowKey(selectedChildRow))}
          totalRecords={(selectedRow?.detailLines || []).length}
          handleNavigate={(dir) => {
            const lines = selectedRow?.detailLines || [];
            const idx = lines.findIndex(d => getRowKey(d) === getRowKey(selectedChildRow));
            let targetChild = null;
            if (dir === 'start' && lines.length > 0) targetChild = lines[0];
            else if (dir === 'prev' && idx > 0) targetChild = lines[idx - 1];
            else if (dir === 'next' && idx < lines.length - 1) targetChild = lines[idx + 1];
            else if (dir === 'end' && lines.length > 0) targetChild = lines[lines.length - 1];
            if (targetChild) {
              setSelectedChildRow(targetChild);
              setSelectedChildIds(new Set([getRowKey(targetChild)]));
            }
          }}
        />

        <div className="mt-2 text-xs">
          {!isChildFormView ? (
            <div className="bg-white border border-gray-200 p-2">
              <ReusableTable
                data={selectedRow?.detailLines || []}
                columns={dynamicChildColumns}
                selectedRows={selectedChildIds}
                onSelectAll={(e) => {
                  if (e.target.checked) {
                    setSelectedChildIds(new Set((selectedRow.detailLines || []).map(getRowKey)));
                  } else {
                    setSelectedChildIds(new Set());
                  }
                }}
                onRowSelect={(item) => {
                  const key = getRowKey(item);
                  const newIds = new Set(selectedChildIds);
                  if (newIds.has(key)) {
                    newIds.delete(key);
                  } else {
                    newIds.add(key);
                  }
                  setSelectedChildIds(newIds);
                  setSelectedChildRow(item);
                }}
                onFieldChange={handleChildFieldChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* TABS HEADER FOR DETAIL FORM */}
              <div className="flex gap-2 mb-3 max-w-sm select-none">
                {[
                  { name: "Account Info" },
                  { name: "Other Info" },
                  { name: "Line Notes" }
                ].map(tab => {
                  const isActive = activeChildTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      type="button"
                      onClick={() => setActiveChildTab(tab.name)}
                      className={`flex-1 flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
                        ${isActive
                          ? 'border-b-2 bg-[#17414d] text-white font-bold'
                          : 'text-gray-600 hover:text-gray-800 bg-gray-100'
                        }`}
                    >
                      {tab.name}
                    </button>
                  );
                })}
              </div>

              {/* TABS CONTAINER FOR DETAIL FORM */}
              <div className="p-5 bg-white border border-slate-200 rounded shadow-sm">
                {!selectedChildRow ? (
                  <div className="text-center text-gray-400 italic text-[11px] py-8">
                    No line selected. Add or select a line to edit details.
                  </div>
                ) : (
                  <>
                    {/* ACCOUNT INFO TAB */}
                    {activeChildTab === "Account Info" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left Column */}
                          <div className="space-y-4">
                            <FormSection title="Line & Allocations">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <FormInput
                                  label="Line No"
                                  value={selectedChildRow.lineNo || ""}
                                  disabled
                                />
                                <div className="md:col-span-2">
                                  <FormInput
                                    label="Description"
                                    value={selectedChildRow.description || ""}
                                    onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "description", e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-1">
                                <div className="md:col-span-1">
                                  <FormSearchSelect
                                    label="Account"
                                    value={selectedChildRow.account || ""}
                                    searchTerm={childSearchTerms.account}
                                    setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, account: val }))}
                                    options={accountDropdownOptions}
                                    displayKey="label"
                                    onSelect={(opt) => {
                                      handleChildFieldChange(getRowKey(selectedChildRow), "account", opt.label);
                                      handleChildFieldChange(getRowKey(selectedChildRow), "accountName", opt.name || opt.label);
                                    }}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <FormInput
                                    label="Account Name"
                                    placeholder="Account Name"
                                    value={selectedChildRow.accountName || ""}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-1">
                                <div className="md:col-span-1">
                                  <FormSearchSelect
                                    label="Organization"
                                    value={selectedChildRow.organization || ""}
                                    searchTerm={childSearchTerms.organization}
                                    setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, organization: val }))}
                                    options={organizationDropdownOptions}
                                    displayKey="label"
                                    onSelect={(opt) => {
                                      handleChildFieldChange(getRowKey(selectedChildRow), "organization", opt.label);
                                      handleChildFieldChange(getRowKey(selectedChildRow), "organizationName", opt.name || opt.label);
                                    }}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <FormInput
                                    label="Organization Name"
                                    placeholder="Organization Name"
                                    value={selectedChildRow.organizationName || ""}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-1">
                                <div className="md:col-span-1">
                                  {projectDropdownOptions.length > 0 ? (
                                    <FormSearchSelect
                                      label="Project"
                                      value={selectedChildRow.project || ""}
                                      searchTerm={childSearchTerms.project}
                                      setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, project: val }))}
                                      options={projectDropdownOptions}
                                      displayKey="label"
                                      onSelect={(opt) => {
                                        handleChildFieldChange(getRowKey(selectedChildRow), "project", opt.label);
                                        handleChildFieldChange(getRowKey(selectedChildRow), "projectName", opt.name || opt.label);
                                      }}
                                    />
                                  ) : (
                                    <FormInput
                                      label="Project"
                                      value={selectedChildRow.project || ""}
                                      onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "project", e.target.value)}
                                      placeholder="Enter project"
                                    />
                                  )}
                                </div>
                                <div className="md:col-span-2">
                                  <FormInput
                                    label="Project Name"
                                    placeholder="Project Name"
                                    value={selectedChildRow.projectName || ""}
                                    disabled
                                  />
                                </div>
                              </div>
                            </FormSection>

                            <FormSection title="Cost Calculations">
                              <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                  label="Cost Amount"
                                  type="number"
                                  value={selectedChildRow.costAmount || ""}
                                  onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "costAmount", e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-4 pt-1">
                                <FormInput
                                  label="Tot Before Disc"
                                  value={selectedChildRow.totBeforeDisc || ""}
                                  disabled
                                />
                                <FormInput
                                  label="Discount"
                                  type="number"
                                  value={selectedChildRow.discount || ""}
                                  disabled
                                />
                                <FormInput
                                  label="Total Amt"
                                  value={selectedChildRow.totalAmt || ""}
                                  disabled
                                />
                              </div>
                            </FormSection>

                            <FormSection title="References">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className="md:col-span-1">
                                  <FormSearchSelect
                                    label="Ref No 1"
                                    value={selectedChildRow.refNo1 || ""}
                                    searchTerm={childSearchTerms.refNo1}
                                    setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, refNo1: val }))}
                                    options={refNoOptions}
                                    displayKey="label"
                                    onSelect={(opt) => {
                                      handleChildFieldChange(getRowKey(selectedChildRow), "refNo1", opt.label);
                                    }}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <FormInput
                                    label="Ref No 1 Name"
                                    placeholder="Ref No 1 Name"
                                    value={selectedChildRow.refNo1Name || ""}
                                    disabled
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pt-1">
                                <div className="md:col-span-1">
                                  <FormSearchSelect
                                    label="Ref No 2"
                                    value={selectedChildRow.refNo2 || ""}
                                    searchTerm={childSearchTerms.refNo2}
                                    setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, refNo2: val }))}
                                    options={refNoOptions}
                                    displayKey="label"
                                    onSelect={(opt) => {
                                      handleChildFieldChange(getRowKey(selectedChildRow), "refNo2", opt.label);
                                    }}
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <FormInput
                                    label="Ref No 2 Name"
                                    placeholder="Ref No 2 Name"
                                    value={selectedChildRow.refNo2Name || ""}
                                    disabled
                                  />
                                </div>
                              </div>
                            </FormSection>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                            <FormSection title="Segment Abbreviations">
                              <div className="grid grid-cols-1 gap-2">
                                <FormSearchSelect
                                  label="Project Account"
                                  value={selectedChildRow.projAcctAbbrev || ""}
                                  searchTerm={childSearchTerms.projAcctAbbrev}
                                  setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, projAcctAbbrev: val }))}
                                  options={[]}
                                  displayKey="label"
                                  onSelect={(opt) => handleChildFieldChange(getRowKey(selectedChildRow), "projAcctAbbrev", opt.label)}
                                />
                                <FormSearchSelect
                                  label="Organization"
                                  value={selectedChildRow.orgAbbrev || ""}
                                  searchTerm={childSearchTerms.orgAbbrev}
                                  setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, orgAbbrev: val }))}
                                  options={[]}
                                  displayKey="label"
                                  onSelect={(opt) => handleChildFieldChange(getRowKey(selectedChildRow), "orgAbbrev", opt.label)}
                                />
                                <FormSearchSelect
                                  label="Project"
                                  value={selectedChildRow.projAbbrev || ""}
                                  searchTerm={childSearchTerms.projAbbrev}
                                  setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, projAbbrev: val }))}
                                  options={[]}
                                  displayKey="label"
                                  onSelect={(opt) => handleChildFieldChange(getRowKey(selectedChildRow), "projAbbrev", opt.label)}
                                />
                              </div>
                            </FormSection>

                             <FormSection title="Sales/VAT Info">
                               <div className="space-y-2">
                                 <div className="flex flex-col gap-1">
                                   <label className="text-[11px] font-semibold text-slate-700 select-none">
                                     Taxability (T/R/N)
                                   </label>
                                   <div className="relative">
                                     <input
                                       type="text"
                                       list="taxabilityOptionsModal"
                                       placeholder="Select or type T, R, or N..."
                                       value={selectedChildRow?.taxability || ""}
                                       onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "taxability", e.target.value.toUpperCase())}
                                       onBlur={(e) => {
                                         const val = String(e.target.value || "").toUpperCase().trim();
                                         if (val && !["T", "R", "N"].includes(val)) {
                                           toast.warn("Invalid taxability code detected. Please enter a valid classification: 'T' for Sales/VAT, 'R' for Use/Reverse tax, or 'N' for Non-taxable.", {
                                             toastId: "invalid-taxability"
                                           });
                                         }
                                       }}
                                       className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-white border-slate-200 text-slate-800 outline-none hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                     />
                                     <datalist id="taxabilityOptionsModal">
                                       <option value="T">T - Sales/VAT Taxable</option>
                                       <option value="R">R - Reverse Charge / Use Tax</option>
                                       <option value="N">N - Non-Taxable / Exempt</option>
                                     </datalist>
                                   </div>
                                 </div>
                                <FormSearchSelect
                                  label="Tax/VAT Code"
                                  value={selectedChildRow.taxVatCode || ""}
                                  searchTerm={childSearchTerms.taxVatCode}
                                  setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, taxVatCode: val }))}
                                  options={taxVatDropdownOptions}
                                  displayKey="label"
                                  onSelect={(opt) => {
                                    const code = opt.value || opt.label;
                                    handleChildFieldChange(getRowKey(selectedChildRow), "taxVatCode", code);
                                    if (opt.rate !== undefined) {
                                      handleChildFieldChange(getRowKey(selectedChildRow), "taxRate", String(opt.rate));
                                    }
                                    if (opt.recoveryRate !== undefined) {
                                      handleChildFieldChange(getRowKey(selectedChildRow), "recoveryRate", String(opt.recoveryRate));
                                    }
                                  }}
                                />
                                <FormInput
                                  label="Tax Rate (%)"
                                  type="number"
                                  value={selectedChildRow.taxRate || ""}
                                  onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "taxRate", e.target.value)}
                                />
                                <FormInput
                                  label="Sales/VAT Tax Amt"
                                  type="number"
                                  value={selectedChildRow.salesVatTaxAmt || ""}
                                  disabled
                                />
                              </div>
                            </FormSection>

                            <FormSection title="Use/Reverse Info">
                              <div className="space-y-2">
                                <FormInput
                                  label="Use/Reverse Tax Amt"
                                  type="number"
                                  value={selectedChildRow.useReverseTaxAmt || ""}
                                  disabled
                                />
                                <FormInput
                                  label="Recovery Rate (%)"
                                  type="number"
                                  value={selectedChildRow.recoveryRate || ""}
                                  onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "recoveryRate", e.target.value)}
                                />
                                <FormInput
                                  label="Recovery Amt"
                                  type="number"
                                  value={selectedChildRow.recoveryAmt || ""}
                                  disabled
                                />
                              </div>
                            </FormSection>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OTHER INFO TAB */}
                    {activeChildTab === "Other Info" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormSection title="Vendor 1099's">
                            <div className="space-y-2">
                              <FormInput
                                label="1099"
                                type="checkbox"
                                checked={selectedChildRow.vendor1099 === "Y"}
                                onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "vendor1099", e.target.checked ? "Y" : "N")}
                              />
                              <FormSearchSelect
                                label="1099 Type"
                                value={selectedChildRow.type1099 || ""}
                                searchTerm={childSearchTerms.type1099}
                                setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, type1099: val }))}
                                options={type1099Options}
                                displayKey="label"
                                onSelect={(opt) => handleChildFieldChange(getRowKey(selectedChildRow), "type1099", opt.value)}
                              />
                              <FormSearchSelect
                                label="1099 State"
                                value={selectedChildRow.state1099 || ""}
                                searchTerm={childSearchTerms.state1099}
                                setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, state1099: val }))}
                                options={state1099Options}
                                displayKey="label"
                                onSelect={(opt) => handleChildFieldChange(getRowKey(selectedChildRow), "state1099", opt.value)}
                              />
                            </div>
                          </FormSection>

                          <FormSection title="CIS">
                            <div className="space-y-4 pt-2">
                              <FormInput
                                label="CIS W/H"
                                type="checkbox"
                                checked={selectedChildRow.cisWh === "Y"}
                                onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "cisWh", e.target.checked ? "Y" : "N")}
                              />
                              <FormInput
                                label="CIS Reporting"
                                type="checkbox"
                                checked={selectedChildRow.cisRpt === "Y"}
                                onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "cisRpt", e.target.checked ? "Y" : "N")}
                              />
                            </div>
                          </FormSection>
                        </div>

                        <FormSection title="VAT Info">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <FormSearchSelect
                              label="Supply Code"
                              value={selectedChildRow.supplyCode || ""}
                              searchTerm={childSearchTerms.supplyCode}
                              setSearchTerm={(val) => setChildSearchTerms(prev => ({ ...prev, supplyCode: val }))}
                              options={supplyCodeOptions}
                              displayKey="label"
                              onSelect={(opt) => handleChildFieldChange(getRowKey(selectedChildRow), "supplyCode", opt.value)}
                            />
                            <FormInput
                              label="Date of Supply"
                              type="date"
                              value={selectedChildRow.dateOfSupply || ""}
                              onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "dateOfSupply", e.target.value)}
                            />
                          </div>
                        </FormSection>
                      </div>
                    )}

                    {/* LINE NOTES TAB */}
                    {activeChildTab === "Line Notes" && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-semibold text-slate-500 block">Notes</span>
                        <textarea
                          className="w-full h-32 border border-slate-200 outline-none p-3 rounded-xl text-xs font-medium bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all"
                          placeholder="Line Notes..."
                          value={selectedChildRow.notes || ""}
                          onChange={(e) => handleChildFieldChange(getRowKey(selectedChildRow), "notes", e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM LEFT CHILD ACTION MENU LINKS */}
        <div className="mt-4 flex flex-wrap gap-2 px-2 pb-2">
          {[
            { name: "Vendor Labor" },
            { name: "Currency Line" },
            { name: "Customs Info" }
          ].map(tab => {
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveNestedTabs(prev => ({ ...prev, [tab.name]: true }))}
                className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[11px] shadow-sm transition-all cursor-pointer select-none"
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </SecondaryContainer>

      <div className="mt-4 flex flex-col gap-4">
        {Object.keys(activeNestedTabs).reverse().map(tabName => {
          if (!activeNestedTabs[tabName]) return null;
          if (tabName === "Vendor Labor") return renderVendorLaborContainer();
          if (tabName === "Currency Line") return renderCurrencyLineContainer();
          if (tabName === "Customs Info") return renderCustomsInfoContainer();
          return null;
        })}
      </div>

      {activePopup === "voucherTotals" && renderVoucherTotalsPopup()}
    </div>
  );
};

export default ManageAccountsPayableVouchers;








