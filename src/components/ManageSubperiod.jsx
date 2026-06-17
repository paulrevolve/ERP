import CustomDatePicker from "./CustomeDatePicker";
import React, { useEffect, useState, useRef } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import api from "../utils/api";
import { CalendarDays, Calendar } from "lucide-react";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import {
  FormSearchSelect,
  FormInput,
  FormSection,
  ActionDetailButton,
} from "../helper/formSection";
import ReusableTable from "../helper/tableSection";

const ManageSubperiod = ({ canEdit }) => {
  // --- Data States ---
  const [fycd, setFycd] = useState([]);
  const [selectedFycdRow, setSelectedFycdRow] = useState(null);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isFormView, setIsFormView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  // --- UI & Find/Replace States ---
  const [searchTermFy, setSearchTermFy] = useState("");
  const [searchTermPeriod, setSearchTermPeriod] = useState("");
  const [clipboard, setClipboard] = useState([]);
  const [searchColumn, setSearchColumn] = useState("fyCd");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [data, setData] = useState([]);

  const [fiscalYearOpt, setFiscalYearOpt] = useState([]);
  const [periodOpt, setPeriodOpt] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerRowId, setDatePickerRowId] = useState(null);

  const filteredPeriodOpt = selectedFycdRow?.fyCd
    ? periodOpt.filter(
        (opt) => String(opt.fyCd) === String(selectedFycdRow.fyCd),
      )
    : periodOpt;

  const [activeView, setActiveView] = useState(false);
  const [moduleProMapping, setModuleProMapping] = useState([]);
  const [originalModuleProMapping, setOriginalModuleProMapping] = useState([]);
  const [isMappingDirty, setIsMappingDirty] = useState(false);
  const isInitialized = useRef(false);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialFormState = {
    fyCd: "",
    periodNo: "",
    subperiodNo: "",
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
    // { statusCd: "C", name: "Closed" },
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

  const toolbarColumns = [
    { label: "Fiscal Year", value: "fyCd" },
    { label: "Period No", value: "periodNo" },
    { label: "Status", value: "statusName" },
    { label: "Subperiod No", value: "subPeriodNo" },
    { label: "Period End Date", value: "subPeriodEndDate" },
    {
      label: "Adj Rate Type",
      value: "rateName",
    },
  ];

  const myColumns = [
    {
      label: "Fiscal Year",
      key: "fyCd",
      required: true,
      type: "search-select",
      options: fiscalYearOpt,
      displayKey: "fyCd",
      onSelect: (opt, id) => {
        handleFieldChange(id, "fyCd", opt.fyCd);
        handleFieldChange(id, "fyCd", opt.fyCd);
      },
      readOnlyIfExisting: true,
    },
    {
      label: "Period No",
      key: "periodNo",
      required: true,
      type: "search-select",
      options: periodOpt,
      displayKey: "periodNo",
      onSelect: (opt, id) => {
        handleFieldChange(id, "periodNo", opt.periodNo);
        handleFieldChange(id, "periodNo", opt.periodNo);
      },
      readOnlyIfExisting: true,
    },
    {
      label: "Subperiod No",
      key: "subPeriodNo",
      type: "number",
      required: true,
      readOnlyIfExisting: true,
    },
    { label: "Period End Date", key: "subPeriodEndDate", type: "date" },
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
      label: "Adj Period",
      key: "isAdjustment",
      type: "checkbox",
      // value: (row) => row.isAdjustment === "Y",

      // onToggle: (id, currentValue) =>
      //   handleFieldChange(id, "isAdjustment", currentValue === "Y" ? "N" : "Y"),
      value: (row) => row.isAdjustment === "Y",

      onToggle: (id, isCurrentlyChecked) => {
        // If it is currently checked (true), we want to set it to "N"
        // If it is currently unchecked (false), we want to set it to "Y"
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
    },
  ];

  const SUBPERIOD_MASTER_COLUMNS = [
    { id: "fyCd", label: "Fiscal Year", type: "year", allowReplace: false },
    { id: "periodNo", label: "Period No", type: "period", allowReplace: false },
    {
      id: "subPeriodNo",
      label: "Subperiod No",
      type: "number",
      allowReplace: false,
    },
    {
      id: "subPeriodEndDate",
      label: "End Date",
      type: "date",
      allowReplace: true,
    },
    {
      id: "statusCd",
      label: "Status",
      type: "select",
      allowReplace: true,
      options: statusOpt.map((s) => ({ value: s.statusCd, label: s.name })),
    },
    {
      id: "isAdjustment",
      label: "Adj Period",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "adjustmentCode",
      label: "Adj Rate Type",
      type: "select",
      allowReplace: true,
      options: adjRateOpt.map((r) => ({
        value: r.adjustmentCode,
        label: r.name,
      })),
    },
  ];

  const handleSortData = () => {
    setFycd((prev) => {
      // 1. Create a shallow copy and sort
      const sortedData = [...prev].sort((a, b) => {
        if (Number(a.fyCd) !== Number(b.fyCd)) {
          return Number(a.fyCd) - Number(b.fyCd);
        }
        if (Number(a.periodNo) !== Number(b.periodNo)) {
          return Number(a.periodNo) - Number(b.periodNo);
        }
        return Number(a.subPeriodNo) - Number(b.subPeriodNo);
      });

      // 2. Map through and set isDirty to true for all rows
      const dirtySortedData = sortedData.map((item) => ({
        ...item,
        isDirty: true,
      }));

      // 3. Update the backup 'data' state as well so they stay in sync
      setData(dirtySortedData);

      return dirtySortedData;
    });

    toast.success("Data sorted and marked for update.");
  };

  const journalColumns = [
    {
      label: "Journal Code",
      key: "journalCode", // Must match API exactly
    },
    {
      label: "Description",
      key: "journalDesc", // Must match API exactly
    },
    {
      label: "Status",
      key: "isOpen",
      type: "select", // Change from "search-select" to "select"
      options: journalStatusOpt,
      optionValue: "value", // Maps to "Y" or "N"
      optionLabel: "label", // Maps to "Open" or "Closed"
    },
  ];

  const handleJournalFieldChange = (id, key, value) => {
    setIsMappingDirty(true);

    setModuleProMapping((prev) =>
      prev.map((item) => {
        if (item.journalCode === id) {
          // Direct comparison: if value is "Y", it's Open, else Closed
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

  // Supporting the pattern used in your other tables
  const handleMappingChange = (id, key, value) => {
    handleJournalFieldChange(id, key, value);
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

      const enrichedData = subperiods.map((item) => ({
        ...item,
        statusName:
          statusOpt.find((o) => o.statusCd === item.statusCd)?.name ||
          "Not Available",
        rateName:
          adjRateOpt.find((o) => o.adjustmentCode === item.adjustmentCode)
            ?.name || "N/A",
        isDirty: false,
        isNew: false, // Ensure database records are marked as not new
      }));

      setFycd((prev) => {
        // 1. Keep only tempId rows that don't match server records
        const localNewRows = prev.filter((row) => {
          if (!row.tempId) return false;
          return !enrichedData.some(
            (serverRow) =>
              serverRow.fyCd === row.fyCd &&
              serverRow.periodNo === row.periodNo &&
              serverRow.subPeriodNo === row.subPeriodNo,
          );
        });

        const combined = [...localNewRows, ...enrichedData];

        // 2. IMPORTANT: Sync the "Backup" data state
        // This ensures handleClear or Search resets use the fresh server data
        setData(combined);

        // 3. Reset UI focus
        const firstRow = combined[0] || null;
        setSelectedFycdRow(firstRow);

        // Update checkbox selection to match focused row
        if (firstRow) {
          const rowKey =
            firstRow.tempId ||
            `${firstRow.fyCd}_${firstRow.periodNo}_${firstRow.subPeriodNo}`;
          setSelectedRows([firstRow]);
        } else {
          setSelectedRows([]);
        }

        return combined;
      });
    } catch (e) {
      console.error("Fetch error", e);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const getRowKey = (row) => {
    if (row.tempId) return row.tempId;
    // Unique key is Year + Period Number
    return `${row.fyCd}_${row.periodNo}_${row.subPeriodNo}`;
  };

  useEffect(() => {
    // const initialize = async () => {
    //   if (!isInitialized.current) {
    //     isInitialized.current = true;
    //     const newRow = {
    //       tempId: `temp-${Date.now()}`,
    //       ...initialFormState,
    //     };
    //     setFycd([newRow]);
    //     setSelectedFycdRow(newRow);
    //     setSelectedRows([newRow]);
    //   }

    fetchData();
    // };

    // initialize();
  }, []); // Empty dependency array

  const handleFieldChange = (id, field, value) => {
    let finalValue = value;

    // 1. Validation for Fiscal Year Code (No spaces)
    if (field === "fyCd" && typeof value === "string" && /\s/.test(value)) {
      toast.warn("No spacing allowed in Fiscal Year Code");
      finalValue = value.replace(/\s+/g, "");
    }

    // 2. Logic for Adjustment Period
    // When unchecking 'Adjustment Period', we should ideally reset the Rate Type
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

          // Update Active Form View if this is the row being edited
          if (getRowKey(selectedFycdRow || {}) === id) {
            setSelectedFycdRow(updatedRow);
          }

          // Update SelectedRows array to keep checkboxes/table in sync
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

    // If we have filtered results, update them too to keep table view in sync
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

            // Update Active Form View if this is the row being edited
            if (getRowKey(selectedFycdRow || {}) === id) {
              setSelectedFycdRow(updatedRow);
            }

            // Update SelectedRows array to keep checkboxes/table in sync
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

  // --- Find & Replace Logic ---
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

    // 1. Block replacement for the unique Fiscal Year Code
    if (searchColumn === "fyCd") {
      return toast.error(
        "Fiscal Year Code is a unique identifier and cannot be bulk replaced.",
      );
    }

    const updatedData = fycd.map((item) => {
      // Check if the current value matches the search term
      const currentValue = String(item[searchColumn] || "").toLowerCase();
      if (currentValue === searchValue.toLowerCase()) {
        const newItem = {
          ...item,
          [searchColumn]: replaceValue,
          isDirty: true,
        };

        // 2. Sync Codes if the user is replacing "Names" (Status or Rate Type)
        if (searchColumn === "statusName") {
          const match = statusOpt.find(
            (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
          );
          if (match) newItem.statusCd = match.statusCd;
        }

        if (searchColumn === "rateName") {
          const match = adjRateOpt.find(
            (o) => o.name.toLowerCase() === replaceValue.toLowerCase(),
          );
          if (match) newItem.adjustmentCode = match.adjustmentCode;
        }

        return newItem;
      }
      return item;
    });

    setFycd(updatedData);
    // If we were filtering, update the filtered view too
    if (filteredGroups.length > 0) {
      handleFind();
    }

    toast.success("Replacements applied successfully.");
    setIsReplaceMode(false);
  };

  // --- Action Handlers ---
  const handleAddFyCd = () => {
    const newRow = {
      tempId: `TEMP_${Date.now()}`,
      ...initialFormState,
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
    // 1. Identify rows that are brand new (tempId) OR existing rows that were edited (isDirty)
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
              subPeriodNo: row.subPeriodNo,
              subPeriodEndDate: row.subPeriodEndDate,
              statusCd: row.statusCd,
              adjustmentCode: row.adjustmentCode,
              // --- CONVERSION LOGIC HERE ---
              isAdjustment:
                row.isAdjustment === true || row.isAdjustment === "Y"
                  ? "Y"
                  : "N",
              // ------------------------------
              companyId: String(row.companyId) || "1",
              modifiedBy: user.name, // Or use your user context
            };

            if (row.tempId) {
              return api.post(`${backendUrl}/api/sub-period`, payload);
            } else {
              return api.put(
                `${backendUrl}/api/sub-period/${row.fyCd}/${row.periodNo}/${row.subPeriodNo}`,
                payload,
              );
            }
          }),
        );
      }

      if (isMappingDirty && moduleProMapping.length > 0) {
        await handleSaveJournalStatus();
      }

      toast.success("All changes saved successfully");
      fetchData(); // Refresh to clear dirty flags and tempIds
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
          // Only call API if it exists in the database
          if (!row.tempId) {
            return api.delete(
              `${backendUrl}/api/sub-period/${row.fyCd}/${row.periodNo}/${row.subPeriodNo}`,
            );
          }
          return Promise.resolve();
        }),
      );

      // Local UI cleanup
      const deletedKeys = selectedRows.map((r) => getRowKey(r));
      const updatedList = fycd.filter(
        (f) => !deletedKeys.includes(getRowKey(f)),
      );

      setFycd(updatedList);
      setSelectedRows([]);

      // Update the active form view to the first remaining row
      if (updatedList.length > 0) {
        setSelectedFycdRow(updatedList[0]);
      } else {
        handleAddFyCd(); // Trigger blank state if none left
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
    // Copy all selected rows, not just the active one
    setClipboard([...selectedRows]);
    toast.success(`${selectedRows.length} record(s) copied to clipboard`);
  };

  const handlePaste = () => {
    if (!clipboard.length) return toast.warn("Clipboard is empty.");

    const pasted = clipboard.map((row, i) => {
      const { tempId, id, fyCd, periodNo, ...restProps } = row;

      return {
        ...restProps,
        fyCd: "",
        periodNo: "",
        subPeriodEndDate: "",
        tempId: `PASTE_${Date.now()}_${i}`,
        isDirty: true,
      };
    });

    setFycd((prev) => [...pasted, ...prev]);
    setSelectedFycdRow(pasted[0]);
    setSelectedRows([pasted[0]]);
    setShowDatePicker(false);
    setDatePickerRowId(null);

    toast.success(
      `${pasted.length} record(s) pasted. Please enter new Fiscal Year and Period values.`,
    );
  };

  const handleClear = () => {
    console.log("clear");
    // 1. Identify if there are any temporary "NEW" rows or unsaved edits
    const hasNewRows = fycd.some((f) => !!f.tempId);
    const hasEdits = fycd.some((f) => f.isDirty === true);
    const hasMappingEdits = isMappingDirty;

    // If nothing has changed, just exit
    if (!hasNewRows && !hasEdits && !hasMappingEdits) return;

    // 2. Confirm with the user
    if (window.confirm("Discard unsaved changes and new rows?")) {
      // 3. Remove all temporary 'NEW' rows locally first
      // (This prevents a flash of empty rows before the fetch completes)
      setFycd((prev) => prev.filter((f) => !f.tempId));

      // 4. Re-fetch the original data from the database to overwrite local edits
      fetchData();

      // 5. Reset selection states
      setFilteredGroups([]);
      setSelectedRows([]); // Clear checkboxes in Table view

      if (hasMappingEdits) {
        setModuleProMapping(originalModuleProMapping);
        setIsMappingDirty(false);
      }

      // We don't set selectedFycdRow to null here because
      // fetchData() already has logic to select combined[0]

      toast.info("Unsaved changes and new rows have been discarded.");
    }
  };

  // --- View & Navigation ---
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

    // Boundary check to ensure the index exists in the array
    if (newIdx >= 0 && newIdx < fycd.length) {
      const targetRow = fycd[newIdx];

      setSelectedFycdRow(targetRow);

      // Sync table selection with the navigated row
      // const rowKey = `${targetRow.fyCd}_${targetRow.periodNo}_${targetRow.subPeriodNo}`;
      setSelectedRows([targetRow]);

      // Close any open UI helpers like date pickers
      setShowDatePicker(false);
      setDatePickerRowId(null);
    }
  };

  console.log(selectedFycdRow);
  console.log(selectedRows);

  // --- Multi-Select Table Logic ---
  const handleRowSelection = (row) => {
    const rowId = getRowKey(row);
    const isSelected = selectedRows.some((r) => getRowKey(r) === rowId);

    if (isSelected) {
      setSelectedRows(selectedRows.filter((r) => getRowKey(r) !== rowId));
    } else {
      setSelectedRows([...selectedRows, row]);
      setSelectedFycdRow(row); // Clicking a row makes it the active form record
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

  const handleAssignJournalEntires = async () => {
    const fyCd = selectedFycdRow?.fyCd;
    const periodNo = selectedFycdRow?.periodNo;
    const companyId = selectedFycdRow?.companyId || "1";
    const subPeriodNo = selectedFycdRow?.subPeriodNo;

    if (!fyCd || !periodNo || !subPeriodNo) {
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
        setIsMappingDirty(false); // Reset global toggle
        // toast.success("Journal status synced.");
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
        isOpen: "Y", // Set status to Open
        statusDisplay: "Open", // Ensure display label matches
        isDirty: true, // Mark for saving
      })),
    );
  };

  const handleFindReplace = (config, isReplaceMode) => {
    const {
      column,
      findValue = "",
      findYear = "",
      findMonth = "",
      replaceValue = "",
      replaceYear = "",
      replaceMonth = "",
      booleanMode = "normal",
    } = config;

    if (!column) return toast.warn("Please select a column first.");

    console.log(config);

    // --- 1. FIND LOGIC ---
    if (!isReplaceMode) {
      setIsMappingDirty(true);
      let targetFind = findYear;
      // Note: Ensure findYear is updated based on your column logic if needed

      if (!targetFind) {
        // If search is empty, reset to show all original data
        setFycd([...data]);
        return toast.warn("Please enter a value to filter.");
      }

      const search = String(targetFind).toLowerCase();

      // 1. Use .filter() on the original 'data' source
      const filteredResults = data.filter((item) => {
        const currentValue = String(item[column] || "").toLowerCase();

        // Exact match for keys; Partial for others
        const isExactMatch = [
          "fyCd",
          "periodNo",
          "subPeriodNo",
          "isAdjustment",
        ].includes(column);

        return isExactMatch
          ? currentValue === search
          : currentValue.includes(search);
      });

      // 2. Handle the results
      if (filteredResults.length > 0) {
        // Update the list to only show matches
        setFycd(filteredResults);

        // Select the first item in the new filtered list
        const foundRecord = filteredResults[0];
        setSelectedFycdRow(foundRecord);

        // Set the selection key for the UI
        const uniqueKey = `${foundRecord.fyCd}-${foundRecord.periodNo}-${foundRecord.subPeriodNo}`;
        setSelectedRows([uniqueKey]);

        toast.info(`Filtered: Found ${filteredResults.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}" in ${column}.`);
        // Optional: Decide if you want to clear the list or keep the old view on error
      }
      return;
    }

    // --- 2. REPLACE LOGIC ---

    // Global Replace Safety Check
    const isFindEmpty =
      column === "fyCd"
        ? !findYear
        : column === "periodNo"
          ? !findMonth
          : !findValue;
    if (isFindEmpty) {
      const proceed = window.confirm(
        "Find field is empty. This will update EVERY subperiod in this list. Continue?",
      );
      if (!proceed) return;
    }

    if (!window.confirm("Apply bulk changes locally?")) return;

    setFycd((prevData) => {
      let changeCount = 0;

      // PRE-LOOKUP for synced names
      let syncName = "";
      if (column === "statusCd") {
        syncName =
          statusOpt.find((s) => String(s.statusCd) === String(replaceValue))
            ?.name || "";
      } else if (column === "adjustmentCode") {
        syncName =
          adjRateOpt.find(
            (r) => String(r.adjustmentCode) === String(replaceValue),
          )?.name || "";
      }

      const updatedData = prevData.map((item) => {
        const currentValue = String(item[column] || "").toLowerCase();
        const searchString = String(
          column === "fyCd"
            ? findYear
            : column === "periodNo"
              ? findMonth
              : findValue,
        ).toLowerCase();

        if (searchString === "" || currentValue.includes(searchString)) {
          changeCount++;
          let updatedItem = { ...item, isDirty: true };

          // Handle synced fields and flags
          if (column === "statusCd") {
            updatedItem.statusCd = replaceValue;
            updatedItem.statusName = syncName;
          } else if (column === "adjustmentCode") {
            updatedItem.adjustmentCode = replaceValue;
            updatedItem.rateName = syncName;
          } else if (column === "isAdjustment") {
            const currentFlag = item.isAdjustment || "N";
            let targetFlag = currentFlag; // Default to no change

            if (booleanMode === "inverted") {
              // 1. Invert All: Y -> N, N -> Y
              if (replaceValue === "All") {
                targetFlag = currentFlag === "Y" ? "N" : "Y";
              }
              // 2. Invert Y: Only flip if current is Y
              else if (replaceValue === "Y") {
                if (currentFlag === "Y") targetFlag = "N";
              }
              // 3. Invert N: Only flip if current is N
              else if (replaceValue === "N") {
                if (currentFlag === "N") targetFlag = "Y";
              }
            } else {
              // Standard "Set All To" logic
              targetFlag = replaceValue === "Y" ? "Y" : "N";
            }

            // Only mark as dirty and change if the value actually flips
            if (targetFlag !== currentFlag) {
              updatedItem.isAdjustment = targetFlag;
              updatedItem.isDirty = true;
            } else {
              // If no change happened for this specific row,
              // we decrement the count so the toast notification is accurate
              changeCount--;
              return item;
            }
          } else {
            updatedItem[column] = replaceValue;
          }

          return updatedItem;
        }
        return item;
      });

      if (changeCount > 0) {
        toast.success(`Updated ${changeCount} subperiods.`);
      } else {
        toast.info("No records matched.");
      }
      return updatedData;
    });
  };

  const toggleView = () => {
    if (!isFormView) {
      // 1. If nothing is selected, default to the first record
      if (selectedRows.length === 0 && fycd.length > 0) {
        const firstRow = fycd[0];
        setSelectedFycdRow(firstRow);
        setSelectedRows([firstRow]);
      }
      // 2. If rows are selected but active form row is missing
      else if (selectedRows.length > 0 && !selectedFycdRow) {
        // Ensure we extract the full object, even if selectedRows stored keys
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

  const jumpToCode = (code) => {
    if (!code) return;

    // 1. Find the index by matching the Fiscal Year Code
    // Added optional chaining and trim to prevent errors with empty/formatted data
    const index = fycd.findIndex(
      (item) =>
        item.fyCd?.toString().toLowerCase().trim() ===
        code.toLowerCase().trim(),
    );

    if (index !== -1) {
      const targetRow = fycd[index];

      // 2. Set the active form record
      setSelectedFycdRow(targetRow);

      // 3. Sync the table selection (important for Table View consistency)
      setSelectedRows([targetRow]);

      // 4. If you are in Form View, this record is now visible.
      // If you were in Table View, you might want to switch to Form View automatically:
      // setIsFormView(true);

      toast.success(`Jumped to Fiscal Year: ${targetRow.fyCd}`);
    } else {
      toast.info(`Fiscal Year Code "${code}" not found`);
    }
  };

  const handleRowDoubleClick = (item, index) => {
    setSelectedFycdRow(item);
    setSelectedRows([item]);
    currentIndex = index;
    setIsFormView(true);
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer icon={CalendarDays} title="Subperiods">
        <Toolbar
          clipboard={clipboard}
          rowKey={(row) => getRowKey(row)}
          isFormView={isFormView}
          handleFindReplace={handleFindReplace}
          isReplaceMode={isReplaceMode}
          setIsReplaceMode={setIsReplaceMode}
          columns={SUBPERIOD_MASTER_COLUMNS}
          searchColumn={searchColumn}
          setSearchColumn={setSearchColumn}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          replaceValue={replaceValue}
          setReplaceValue={setReplaceValue}
          handleFind={handleFind}
          handleBulkReplace={handleBulkReplace}
          currentIndex={currentIndex}
          totalRecords={fycd.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          actions={{
            onAdd: handleAddFyCd,
            onSave: handleMasterSave,
            // onToggleView: () => setIsFormView(!isFormView),
            onToggleView: toggleView,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleClear,
          }}
          selectedRow={selectedRows.length >= 0 ? selectedRows[0] : []}
          isDirty={fycd.some((f) => f.isDirty) || isMappingDirty}
          loading={loading}
        />

        {isFormView ? (
          <div className="space-y-1 p-1 py-2">
            <FormSection>
              {/* 1. Header Row: Fiscal Year and Period Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 pb-2">
                <FormSearchSelect
                  label="Fiscal Year *"
                  required
                  value={selectedFycdRow?.fyCd || ""}
                  disabled={!selectedFycdRow?.isNew}
                  searchTerm={searchTermFy}
                  setSearchTerm={setSearchTermFy}
                  options={fiscalYearOpt.filter((o) =>
                    String(o.fyCd || "")
                      .toLowerCase()
                      .includes(searchTermFy.toLowerCase()),
                  )}
                  displayKey="fyCd"
                  onSelect={(opt) => {
                    const id = getRowKey(selectedFycdRow || {});
                    handleFieldChange(id, "fyCd", opt.fyCd);
                  }}
                />
                <FormSearchSelect
                  label="Period No *"
                  required
                  value={selectedFycdRow?.periodNo || ""}
                  disabled={!selectedFycdRow?.isNew}
                  searchTerm={searchTermPeriod}
                  setSearchTerm={setSearchTermPeriod}
                  options={
                    selectedFycdRow?.fyCd
                      ? filteredPeriodOpt.filter((o) =>
                          String(o.periodNo || "")
                            .toLowerCase()
                            .includes(searchTermPeriod.toLowerCase()),
                        )
                      : periodOpt.filter((o) =>
                          String(o.periodNo || "")
                            .toLowerCase()
                            .includes(searchTermPeriod.toLowerCase()),
                        )
                  }
                  displayKey="periodNo"
                  secondaryKey="fyCd"
                  onSelect={(opt) => {
                    const id = getRowKey(selectedFycdRow || {});
                    handleFieldChange(id, "periodNo", opt.periodNo);
                  }}
                />
                <FormInput
                  label="Subperiod Number"
                  required
                  type="number"
                  value={selectedFycdRow?.subPeriodNo || ""}
                  readOnly={!selectedFycdRow?.isNew}
                  onChange={(e) =>
                    handleFieldChange(
                      getRowKey(selectedFycdRow),
                      "subPeriodNo",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* 2. Main Details Section */}
              <FormSection title="Period Details">
                <div className="grid grid-cols-1 gap-8">
                  {/* Left Column: Date and Status */}

                  <div className="space-y-4 ">
                    <div className="grid grid-cols-3">
                      <div className=" flex items-center gap-3 relative group">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Subperiod End Date
                        </label>

                        <div className="relative flex items-center">
                          <input
                            type="text"
                            className="w-full p-1 text-[10px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                            placeholder="MM-DD-YYYY"
                            value={(() => {
                              const val = selectedFycdRow?.subPeriodEndDate;
                              if (!val) return "";
                              const datePart = val.includes("T")
                                ? val.split("T")[0]
                                : val;
                              const parts = datePart.split("-");
                              // Format YYYY-MM-DD to MM-DD-YYYY for display
                              if (parts.length === 3 && parts[0].length === 4) {
                                return `${parts[1]}-${parts[2]}-${parts[0]}`;
                              }
                              return datePart;
                            })()}
                            onChange={(e) => {
                              // 1. Remove non-numeric characters
                              let raw = e.target.value.replace(/\D/g, "");
                              if (raw.length > 8) raw = raw.slice(0, 8);

                              // 2. VALIDATION: Month (Max 12)
                              if (raw.length >= 2) {
                                let month = parseInt(raw.slice(0, 2), 10);
                                if (month > 12) raw = "12" + raw.slice(2);
                                else if (raw.slice(0, 2) === "00")
                                  raw = "01" + raw.slice(2);
                              }

                              // 3. VALIDATION: Day (Max 31)
                              if (raw.length >= 4) {
                                let monthPart = raw.slice(0, 2);
                                let dayPart = raw.slice(2, 4);
                                let day = parseInt(dayPart, 10);
                                if (day > 31)
                                  raw = monthPart + "31" + raw.slice(4);
                                else if (dayPart === "00")
                                  raw = monthPart + "01" + raw.slice(4);
                              }

                              // 4. Apply Mask: MM-DD-YYYY
                              let formatted = raw;
                              if (raw.length > 2 && raw.length <= 4) {
                                formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
                              } else if (raw.length > 4) {
                                formatted = `${raw.slice(0, 2)}-${raw.slice(2, 4)}-${raw.slice(4)}`;
                              }

                              const id = getRowKey(selectedFycdRow);

                              // 5. Update State
                              if (raw.length === 8) {
                                const mm = raw.slice(0, 2);
                                const dd = raw.slice(2, 4);
                                const yyyy = raw.slice(4);
                                // Sync to state as YYYY-MM-DD for your API
                                handleFieldChange(
                                  id,
                                  "subPeriodEndDate",
                                  `${yyyy}-${mm}-${dd}`,
                                );
                                setShowDatePicker(false);
                              } else {
                                // Keep formatted mask (MM-DD) while typing
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
                            className="absolute right-3 cursor-pointer text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => {
                              setDatePickerRowId(
                                getRowKey(selectedFycdRow || {}),
                              );
                              setShowDatePicker(!showDatePicker);
                            }}
                          >
                            <Calendar size={12} />
                          </div>
                        </div>

                        {showDatePicker &&
                          datePickerRowId ===
                            getRowKey(selectedFycdRow || {}) && (
                            <div className="absolute z-50 mt-1 right-0 shadow-xl border rounded-lg bg-white">
                              {/* <CustomDatePicker
                                selectedDate={
                                  selectedFycdRow?.subPeriodEndDate?.length ===
                                    10 &&
                                  selectedFycdRow.subPeriodEndDate.includes("-")
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
                              /> */}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between gap-4 w-full">
                      {/* Left Section: Status */}
                      <div className="flex-1">
                        <FormSection title="Status">
                          <div className="flex gap-6">
                            {statusOpt.map((opt) => (
                              <label
                                key={opt.statusCd}
                                className="flex items-center gap-2 text-xs cursor-pointer text-gray-700 "
                              >
                                <input
                                  type="radio"
                                  name="status"
                                  className="w-3 h-3 text-blue-600 focus:ring-blue-500"
                                  checked={
                                    selectedFycdRow?.statusCd === opt.statusCd
                                  }
                                  onChange={() =>
                                    handleFieldChange(
                                      getRowKey(selectedFycdRow),
                                      "statusCd",
                                      opt.statusCd,
                                    )
                                  }
                                />
                                {opt.name}
                              </label>
                            ))}
                          </div>
                        </FormSection>
                      </div>

                      {/* Middle Section: Adjustment Checkbox (Lowered to align with row) */}
                      <div className="flex items-center gap-2 pb-3 min-w-fit">
                        <input
                          type="checkbox"
                          id="isAdj"
                          className="w-3 h-3 rounded text-blue-600 cursor-pointer"
                          checked={selectedFycdRow?.isAdjustment === "Y"}
                          onChange={(e) =>
                            handleFieldChange(
                              getRowKey(selectedFycdRow),
                              "isAdjustment",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                        <label
                          htmlFor="isAdj"
                          className="text-xs font-semibold text-gray-700 cursor-pointer whitespace-nowrap"
                        >
                          Adjustment Period
                        </label>
                      </div>

                      {/* Right Section: Adjustment Rate Type */}
                      <div className="flex-1">
                        <FormSection title="Adjustment Rate Type">
                          <div
                            className={`flex flex-col transition-opacity duration-300 ${
                              selectedFycdRow?.isAdjustment !== "Y"
                                ? "opacity-40 pointer-events-none"
                                : "opacity-100"
                            }`}
                          >
                            <div className="flex gap-6">
                              {adjRateOpt.map((opt) => (
                                <label
                                  key={opt.adjustmentCode}
                                  className="flex items-center gap-2 text-xs font-medium cursor-pointer text-gray-700"
                                >
                                  <input
                                    type="radio"
                                    name="adjRate"
                                    className="w-3 h-3 text-blue-600"
                                    checked={
                                      selectedFycdRow?.adjustmentCode ===
                                      opt.adjustmentCode
                                    }
                                    onChange={() =>
                                      handleFieldChange(
                                        getRowKey(selectedFycdRow),
                                        "adjustmentCode",
                                        opt.adjustmentCode,
                                      )
                                    }
                                  />
                                  {opt.name}
                                </label>
                              ))}
                            </div>
                          </div>
                        </FormSection>
                      </div>
                    </div>
                  </div>
                </div>
              </FormSection>
            </FormSection>
          </div>
        ) : (
          <>
            <div className="px-1">
              <ActionDetailButton label={"Sort"} onClick={handleSortData} />
            </div>
            <ReusableTable
              data={filteredGroups.length > 0 ? filteredGroups : fycd}
              columns={myColumns}
              doubleclick={handleRowDoubleClick}
              rowKey={(row) => getRowKey(row)}
              // rowKey={selectedFycdRow?.tempId ? "tempId" : "fyCd"}
              showCheckboxes={true}
              selectedRows={selectedRows} // Now an array
              onRowSelect={handleRowSelection}
              onSelectAll={handleSelectAll} // Added Select All feature
              onFieldChange={handleFieldChange}
              maxHeight="max-h-[500px]"
            />
          </>
        )}
        <ActionDetailButton
          label="Entry Edit Status"
          disabled={!selectedFycdRow}
          onClick={handleAssignJournalEntires}
        />
      </MainContainer>

      {activeView && (
        <SecondaryContainer
          title="Journal Entry Status"
          icon={Calendar}
          actionButton={
            <button
              onClick={handleAssignJournalEntires}
              className="px-3 py-1 bg-white border border-gray-300 text-gray-600 text-[10px] font-bold rounded hover:bg-gray-50 transition-all"
            >
              Refresh
            </button>
          }
        >
          <ReusableTable
            data={moduleProMapping}
            columns={journalColumns}
            rowKey="journalCode"
            maxHeight="max-h-64"
            showCheckboxes={false}
            showCheckboxesHeader={false}
            showCheckboxesTable={false}
            showCheckboxesHeaderTop={false}
            onFieldChange={handleJournalFieldChange} // Crucial for search-select to work
            renderEmptyState={() => (
              <div className="py-8 text-center bg-gray-50/50 rounded-lg">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  No Data Available
                </p>
                <p className="text-[10px] text-gray-400/80 italic mt-1">
                  Click refresh to load journal status
                </p>
              </div>
            )}
          />
          <ActionDetailButton
            label="Open All Journals"
            // disabled={!selectedFycdRow}
            onClick={handleOpenAllJournals}
          />
        </SecondaryContainer>
      )}
    </div>
  );
};

export default ManageSubperiod;
