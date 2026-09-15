import React, { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import ReusableTable from "../helper/tableSection";

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
            readOnly={readOnly}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full px-2 py-0.5 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
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
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-2 py-0.5 rounded border text-[11px] font-medium transition-all duration-150 outline-none ${inputClassName}
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

  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && (
        <span className="text-xs font-semibold text-slate-700 select-none">
          {label} {required && <span className="text-blue-600 font-bold ml-0.5">*</span>}
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
            ${
              disabled
                ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            }`}
        />
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
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
                    className="px-3 py-2 text-[11px] hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none font-medium text-slate-700 flex items-center justify-between"
                    onClick={() => {
                      onSelect(opt);
                      setSearchVal("");
                      setShowDropdown(false);
                    }}
                  >
                    <span>{opt[displayKey]}</span>
                    {secondaryKey && opt[secondaryKey] && (
                      <span className="text-slate-400 ml-2">
                        ({opt[secondaryKey]})
                      </span>
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

const ManageFiscalYear = ({ canEdit }) => {
  // --- Data States ---
  const [fycd, setFycd] = useState([]);
  const [selectedFycdRow, setSelectedFycdRow] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isFormView, setIsFormView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  // --- UI & Find/Replace States ---
  const [searchTermProfiles, setSearchTermProfiles] = useState("");
  const [clipboard, setClipboard] = useState([]);
  const [hasCopied, setHasCopied] = useState(false);
  const [searchColumn, setSearchColumn] = useState("fyCd");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);

  const [showSubModal, setShowSubModal] = useState(false);
  const [subValue, setSubValue] = useState(1);
  const isInitialized = useRef(false);

  const [isMapping, setIsMapping] = useState(false);

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

  // --- Table Column Definitions ---
  const myColumns = [
    {
      label: "Fiscal Year",
      key: "fyCd",
      required: true,
      readOnlyIfExisting: true,
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

  const FY_MASTER_COLUMNS = [
    { id: "fyCd", label: "Fiscal Year", type: "year", allowReplace: false },
    { id: "fyDesc", label: "Description", type: "text", allowReplace: true },
    {
      id: "statusCd",
      label: "Status",
      type: "select",
      allowReplace: true,
      options: statusOpt.map((s) => ({ value: s.statusCd, label: s.name })),
    },
    {
      id: "closeActTgtCd",
      label: "Rate Type",
      type: "select",
      allowReplace: true,
      options: rateOpt.map((r) => ({ value: r.closeActTgtCd, label: r.name })),
    },
  ];

  const handleFindReplace = (config, isReplaceMode) => {
    const {
      column,
      findValue = "",
      findYear = "",
      replaceValue = "",
      replaceYear = "",
    } = config;

    if (!column) return toast.warn("Please select a column first.");

    // --- FIND LOGIC ---
    if (!isReplaceMode) {
      setIsMapping(true);
      const targetFind = column === "fyCd" ? findYear : findYear;
      if (!targetFind) return toast.warn("Please enter a value to find.");

      const foundIndex = fycd.findIndex((item) => {
        const currentValue = String(item[column] || "").toLowerCase();
        const search = String(targetFind).toLowerCase();
        return column === "fyCd"
          ? currentValue === search
          : currentValue.includes(search);
      });

      if (foundIndex !== -1) {
        const foundRecord = fycd[foundIndex];
        setSelectedFycdRow(foundRecord);
        setSelectedRows([foundRecord]);
        setFilteredGroups([foundRecord]);
        toast.info(`Found match at row ${foundIndex + 1}`);
      } else {
        toast.error(`Value not found.`);
      }
      return;
    }

    // --- REPLACE LOGIC ---
    const isFindEmpty = column === "fyCd" ? !findYear : !findValue;
    if (isFindEmpty) {
      const proceed = window.confirm(
        "Find field is empty. This will replace EVERY record. Continue?",
      );
      if (!proceed) return;
    }

    if (!window.confirm("Apply bulk changes?")) return;

    setFycd((prevData) => {
      let changeCount = 0;

      let syncName = "";
      if (column === "statusCd") {
        syncName =
          statusOpt.find((s) => String(s.statusCd) === String(replaceValue))
            ?.name || "";
      } else if (column === "closeActTgtCd") {
        syncName =
          rateOpt.find((r) => String(r.closeActTgtCd) === String(replaceValue))
            ?.name || "";
      }

      const updatedData = prevData.map((item) => {
        const currentValue = String(item[column] || "").toLowerCase();
        const searchString = String(
          column === "fyCd" ? findYear : findValue,
        ).toLowerCase();

        if (searchString === "" || currentValue.includes(searchString)) {
          changeCount++;
          let updatedItem = { ...item, isDirty: true };

          if (column === "statusCd") {
            updatedItem.statusCd = replaceValue;
            updatedItem.statusName = syncName;
          } else if (column === "closeActTgtCd") {
            updatedItem.closeActTgtCd = replaceValue;
            updatedItem.rateName = syncName;
          } else if (column === "fyCd") {
            updatedItem.fyCd = replaceYear;
          } else {
            updatedItem[column] = replaceValue;
          }

          return updatedItem;
        }
        return item;
      });

      if (changeCount > 0) {
        toast.success(`Updated ${changeCount} records.`);
      } else {
        toast.info("No matches found.");
      }
      return updatedData;
    });
  };

  const fetchData = async (isReset = false) => {
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

      setFycd((prev) => {
        const combined = [...enrichedData];

        if (combined.length > 0) {
          setSelectedFycdRow(combined[0]);
          setSelectedRows([combined[0]]);
          return combined;
        } else {
          return [];
        }
      });

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

  useEffect(() => {
    const initialize = async () => {
      await fetchData();
    };
    initialize();
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

  const handleFind = () => {
    if (!searchValue) {
      setFilteredGroups([]);
      return;
    }
    const results = fycd.filter((g) =>
      String(g[searchColumn] || "")
        .toLowerCase()
        .includes(searchValue.toLowerCase()),
    );

    if (results.length > 0) {
      setFilteredGroups(results);
      setSelectedFycdRow(results[0]);
      toast.success(`Found ${results.length} matches`);
    } else {
      toast.error("No matching records found");
      setFilteredGroups([]);
    }
  };

  const handleBulkReplace = () => {
    if (!searchValue) return toast.warn("Enter value to find");

    if (searchColumn === "fyCd") {
      return toast.error(
        "Fiscal Year Code is a unique identifier and cannot be bulk replaced.",
      );
    }

    const updatedData = fycd.map((item) => {
      const currentValue = String(item[searchColumn] || "").toLowerCase();
      if (currentValue === searchValue.toLowerCase()) {
        const newItem = {
          ...item,
          [searchColumn]: replaceValue,
          isDirty: true,
        };

        if (searchColumn === "statusName") {
          const match = statusOpt.find(
            (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
          );
          if (match) newItem.statusCd = match.statusCd;
        }

        if (searchColumn === "rateName") {
          const match = rateOpt.find(
            (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
          );
          if (match) newItem.closeActTgtCd = match.closeActTgtCd;
        }

        return newItem;
      }
      return item;
    });

    setFycd(updatedData);
    if (filteredGroups.length > 0) {
      handleFind();
    }

    toast.success("Replacements applied successfully.");
    setIsReplaceMode(false);
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
    if (selectedRows.length === 0) {
      return toast.warn("Select at least one record to delete.");
    }

    const confirmMessage =
      selectedRows.length === 1
        ? `Delete Fiscal Year: ${selectedRows[0].fyCd || "New Record"}?`
        : `Are you sure you want to delete ${selectedRows.length} selected records?`;

    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      await Promise.all(
        selectedRows.map((row) => {
          if (!row.tempId) {
            const companyId = row.companyId || "";
            return api.delete(
              `${backendUrl}/api/FiscalYear/${row.fyCd}?CompanyId=${companyId}`,
            );
          }
          return Promise.resolve();
        }),
      );

      const deletedIdentifiers = selectedRows.map((r) => getRowKey(r));
      const updatedList = fycd.filter(
        (f) => !deletedIdentifiers.includes(getRowKey(f)),
      );

      setFycd(updatedList);
      setSelectedRows([]);
      setSelectedFycdRow(updatedList[0] || null);

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

    setClipboard([...selectedRows]);
    setHasCopied(true);

    const header = "Fiscal Year\tDescription\tStatus\tRate Type";
    const rows = selectedRows
      .map((row) => {
        const fyCd = row.fyCd || "";
        const fyDesc = row.fyDesc || "";
        const statusName =
          row.statusName ||
          statusOpt.find((o) => o.statusCd === row.statusCd)?.name ||
          "";
        const rateName =
          row.rateName ||
          rateOpt.find((o) => o.closeActTgtCd === row.closeActTgtCd)?.name ||
          "";
        return `${fyCd}\t${fyDesc}\t${statusName}\t${rateName}`;
      })
      .join("\n");

    const tsvContent = `${header}\n${rows}`;

    navigator.clipboard
      .writeText(tsvContent)
      .then(() => {
        toast.success(`${selectedRows.length} record(s) copied to clipboard`);
      })
      .catch((err) => {
        console.error("Failed to copy to system clipboard:", err);
        toast.warn(`${selectedRows.length} record(s) copied internally.`);
      });
  };

  const handlePaste = async () => {
    if (clipboard && clipboard.length > 0 && !clipboard[0]?.isDummy) {
      const pasted = clipboard.map((row, i) => {
        const clonedRow = JSON.parse(JSON.stringify(row));
        const { tempId, id, fyCd, ...restProps } = clonedRow;
        const tempIdVal = `PASTE_${Date.now()}_${i}`;
        return {
          ...restProps,
          fyCd: fyCd || "",
          tempId: tempIdVal,
          tableRowKey: tempIdVal,
          isDirty: true,
        };
      });

      setFycd((prev) => [...pasted, ...prev]);
      setSelectedFycdRow(pasted[0]);
      setSelectedRows([pasted[0]]);
      toast.success(`${pasted.length} record(s) pasted.`);
      return;
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        processPastedText(text);
        return;
      }
    } catch (err) {
      console.warn(
        "System clipboard access failed, falling back to local memory paste",
        err,
      );
    }

    toast.warn("Clipboard is empty.");
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

  useEffect(() => {
    const syncClipboardWithSystem = async () => {
      try {
        if (!navigator.permissions || !navigator.permissions.query) return;
        const permission = await navigator.permissions.query({
          name: "clipboard-read",
        });
        if (permission.state === "granted") {
          const text = await navigator.clipboard.readText();
          if (text && text.trim()) {
            setClipboard((prev) =>
              prev.length === 0 || prev[0]?.isDummy
                ? [{ isDummy: true }]
                : prev,
            );
          } else {
            setClipboard((prev) =>
              prev.length > 0 && prev[0]?.isDummy ? [] : prev,
            );
          }
        }
      } catch (err) {}
    };

    window.addEventListener("focus", syncClipboardWithSystem);
    syncClipboardWithSystem();
    return () => window.removeEventListener("focus", syncClipboardWithSystem);
  }, []);

  const handleClear = () => {
    const hasNewRows = fycd.some((f) => !!f.tempId);
    const hasEdits = fycd.some((f) => f.isDirty === true);

    if (!hasNewRows && !hasEdits) return;

    if (window.confirm("Discard unsaved changes and new rows?")) {
      setFycd((prev) => prev.filter((f) => !f.tempId));
      fetchData();
      setFilteredGroups([]);
      setSelectedRows([]);
      setIsMapping(false);
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

  const jumpToCode = (code) => {
    const index = fycd.findIndex(
      (item) => item.fyCd.toString().toLowerCase() === code.toLowerCase(),
    );
    if (index !== -1) {
      const targetRow = fycd[index];
      setSelectedFycdRow(targetRow);
      setSelectedRows([targetRow]);
    } else {
      toast.info("Fiscal Year Code not found");
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
        .payment-voucher-page .voucher-panel { border:1px solid #e5e7eb; border-radius:6px; background:#fff; padding:0; box-shadow:none; overflow:hidden; }
        .payment-voucher-page .voucher-panel-title { display:flex; align-items:center; min-height:36px; margin:0 12px 0; padding:0; border-bottom:1px solid #eeeeee; color:#3c4043; font-size:12px; font-weight:600; }
        .payment-voucher-page .voucher-master-card { padding:14px; }
        .payment-voucher-page .voucher-nav-btn { display:inline-flex; align-items:center; justify-content:center; width:34px; height:30px; border:0; border-right:1px solid #d5dfeb; background:#f5f8fb; color:#718096; cursor:pointer; }
        .payment-voucher-page .voucher-nav-btn:last-child { border-right:0; }
        .payment-voucher-page .voucher-nav-btn:hover { background:#eaf1f7; color:#17414d; }
        .payment-voucher-page .voucher-nav-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .payment-voucher-page .voucher-count { display:inline-flex; align-items:center; justify-content:center; min-width:48px; height:30px; padding:0 8px; background:#fff; color:#17414d; font-size:11px; font-weight:700; }
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
            >
              <Copy size={14} />
              Copy
            </button>

            <button
              type="button"
              className="voucher-head-btn"
              onClick={handlePaste}
            >
              <ClipboardPaste size={14} />
              Paste
            </button>

            <button
              type="button"
              onClick={handleDelete}
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
      <div className="px-4 pb-4 pt-3 lg:px-4">
        <div className="new-ui-content text-xs">
          {!isFormView ? (
            <div className="bg-white border border-gray-200 p-2 rounded">
              <ReusableTable
                data={filteredGroups.length > 0 ? filteredGroups : fycd}
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
                    Fiscal Year Details
                  </span>
                </div>
                <div className="p-3">
                  <FormSection>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <FormInput
                        label="Fiscal Year"
                        required
                        value={selectedFycdRow?.fyCd || ""}
                        readOnly={
                          !!selectedFycdRow?.id && !selectedFycdRow?.tempId
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            getRowKey(selectedFycdRow || {}),
                            "fyCd",
                            e.target.value,
                          )
                        }
                      />
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <FormSearchSelect
                        label="Status"
                        value={
                          selectedFycdRow?.statusName ||
                          selectedFycdRow?.statusCd ||
                          ""
                        }
                        searchTerm={searchTermProfiles}
                        setSearchTerm={setSearchTermProfiles}
                        options={statusOpt.filter((o) =>
                          o.name
                            .toLowerCase()
                            .includes(searchTermProfiles.toLowerCase()),
                        )}
                        displayKey="name"
                        onSelect={(p) => {
                          const id = getRowKey(selectedFycdRow || {});
                          handleFieldChange(id, "statusCd", p.statusCd);
                          handleFieldChange(id, "statusName", p.name);
                        }}
                      />
                      <FormSearchSelect
                        label="Rate Type"
                        value={
                          selectedFycdRow?.rateName ||
                          selectedFycdRow?.closeActTgtCd ||
                          ""
                        }
                        searchTerm={searchTermProfiles}
                        setSearchTerm={setSearchTermProfiles}
                        options={rateOpt.filter((o) =>
                          o.name
                            .toLowerCase()
                            .includes(searchTermProfiles.toLowerCase()),
                        )}
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
                  </FormSection>
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
