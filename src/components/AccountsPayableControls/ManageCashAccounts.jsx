import React, { useState, useEffect } from "react";
import {
  X,
  History,
  Award,
  ShieldCheck,
  GraduationCap,
  Lock,
  Settings2,
  User,
  Layers,
} from "lucide-react";
import { MainContainer, Toolbar } from "../../helper/container";
import {
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../../helper/formSection";
import { backendUrl } from "../config";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { TableSearchSelect } from "../../helper/tableSection";

const ManageCashAccounts = ({ formData, onClose, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Options State
  //   const [bankAbbrv, setBankAbbrv] = useState([]);
  const [acctOpt, setAcctOpt] = useState([]);
  const [orgOpt, setOrgOpt] = useState([]);
  const [ref1Opt, setRef1Opt] = useState([]);
  const [ref2Opt, setRef2Opt] = useState([]);

  const bankAbbrv = [
    { id: "PRJ01", name: "ISO 9001" },
    { id: "PRJ02", name: "CIS Compliance" },
  ];
  //   const acctOpt = [
  //     { id: "EXP01", name: "Travel Expense" },
  //     { id: "EXP02", name: "Office Supplies" },
  //   ];
  //   const orgOpt = [
  //     { id: "ORG01", name: "Sales Dept" },
  //     { id: "ORG02", name: "IT Dept" },
  //   ];

  //   const ref1Opt = [
  //     { id: "1", name: "Level 1 - Basic" },
  //     { id: "2", name: "Level 2 - Advanced" },
  //   ];
  //   const ref2Opt = [
  //     { id: "1", name: "Level 1 - Basic" },
  //     { id: "2", name: "Level 2 - Advanced" },
  //   ];

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  // Add this state with your other hooks

  // Check if all rows in the current dataset are selected
  const isAllSelected =
    originalData.length > 0 && selectedRows.size === originalData.length;

  // Logic to toggle all rows at once
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      const allKeys = originalData.map(
        (item, idx) => item.cashAcctsKey || item.tempId || idx,
      );
      setSelectedRows(new Set(allKeys));
    }
  };

  const initialDefCashState = {
    cashAcctsKey: 0,
    acctId: "",
    acctName: "",
    orgId: "",
    orgName: "",
    ref1Id: "",
    ref1Name: "",
    ref2Id: "",
    ref2Name: "",
    cashAcctsDesc: "",
    bankAcctAbbrv: "",
    bankAcctName: "",
    companyId: companyId,
    modifiedBy: user.name || "Admin",
    isNew: true,
  };

  // Table Column Configuration
  const COLUMN_LABELS = {
    cashAcctsDesc: "Cash Account Desc",
    acctId: "Account",
    acctName: "Account Name",
    orgId: "Organization",
    orgName: "Org Name",
    bankAcctAbbrv: "Bank Abbrev",
    bankAcctName: "Bank Name",
    ref1Id: "Ref No 1",
    ref2Id: "Ref No 2",
  };

  //   const CASH_ACCT_COLUMNS = [
  //     {
  //       id: "cashAcctsDesc",
  //       label: "Description",
  //       type: "text",
  //       allowReplace: true,
  //     },
  //     {
  //       id: "acctId",
  //       label: "Account",
  //       type: "select",
  //       allowReplace: true,
  //       options: acctOpt.map((a) => ({
  //         value: a.acctId || a.id,
  //         label: `${a.acctId || a.id} - ${a.acctName || a.name}`,
  //       })),
  //     },
  //     {
  //       id: "orgId",
  //       label: "Organization",
  //       type: "select",
  //       allowReplace: true,
  //       options: orgOpt.map((o) => ({
  //         value: o.orgId || o.id,
  //         label: `${o.orgId || o.id} - ${o.orgName || o.name}`,
  //       })),
  //     },
  //     {
  //       id: "bankAcctAbbrv",
  //       label: "Bank Abbrv",
  //       type: "select",
  //       allowReplace: true,
  //       options: bankAbbrv.map((b) => ({
  //         value: b.id,
  //         label: `${b.id} - ${b.name}`,
  //       })),
  //     },
  //     {
  //       id: "ref1Id",
  //       label: "Ref No 1",
  //       type: "select",
  //       allowReplace: true,
  //       options: ref1Opt.map((r) => ({
  //         value: r.refStrucId,
  //         label: `${r.refStrucId} - ${r.refStrucName}`,
  //       })),
  //     },
  //     {
  //       id: "ref2Id",
  //       label: "Ref No 2",
  //       type: "select",
  //       allowReplace: true,
  //       options: ref2Opt.map((r) => ({
  //         value: r.refStrucId,
  //         label: `${r.refStrucId} - ${r.refStrucName}`,
  //       })),
  //     },
  //     {
  //       id: "modifiedBy",
  //       label: "Modified By",
  //       type: "text",
  //       allowReplace: false,
  //     },
  //   ];

  const columns = Object.keys(COLUMN_LABELS);

  const [defCashInfo, setDefCashInfo] = useState(initialDefCashState);

  const enrichRecord = (record, options = {}) => {
    const {
      accounts = acctOpt,
      orgs = orgOpt,
      r1 = ref1Opt,
      r2 = ref2Opt,
    } = options;

    return {
      ...record,
      acctName:
        accounts.find((a) => (a.acctId || a.id) === record.acctId)?.acctName ||
        "",
      orgName:
        orgs.find((o) => (o.orgId || o.id) === record.orgId)?.orgName || "",
      ref1Name:
        r1.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
      ref2Name:
        r2.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
      bankAcctName:
        bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
      isNew: false,
    };
  };

  //   const enrichRecord = (record) => {
  //     return {
  //       ...record,
  //       // Note: orgOpt uses 'orgId' based on your JSON snippet
  //       acctName: acctOpt.find((a) => a.acctId === record.acctId)?.acctName || "",
  //       orgName: orgOpt.find((o) => o.orgId === record.orgId)?.orgName || "",
  //       // Look up in the ref options using refStrucId
  //       ref1Name:
  //         ref1Opt.find((r) => r.refStrucId === record.ref1Id)?.refStrucName || "",
  //       ref2Name:
  //         ref2Opt.find((r) => r.refStrucId === record.ref2Id)?.refStrucName || "",
  //       bankAcctName:
  //         bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
  //       isNew: false,
  //     };
  //   };

  const fetchStaticOptions = async () => {
    try {
      const [orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
        api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
        api.get(`${backendUrl}/api/RefStruc`),
        api.get(`${backendUrl}/api/RefStruc`),
        api.get(`${backendUrl}/api/Account/GetAllAccounts`),
      ]);

      const options = {
        orgs: orgRes.data || [],
        r1: ref1Res.data || [],
        r2: ref2Res.data || [],
        accounts: acctRes.data || [],
      };

      // Update state for the UI dropdowns
      setOrgOpt(options.orgs);
      setRef1Opt(options.r1);
      setRef2Opt(options.r2);
      setAcctOpt(options.accounts);

      // CRITICAL: Return the data so the next function can use it immediately
      return options;
    } catch (error) {
      console.error("Error fetching options:", error);
      return null;
    }
  };

  //   const fetchStaticOptions = async () => {
  //     try {
  //       const [projRes, orgRes, ref1Res, ref2Res, acctRes] = await Promise.all([
  //         api.get(`${backendUrl}/Project/GetAllProjects`),
  //         api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
  //         api.get(`${backendUrl}/api/RefStruc`),
  //         api.get(`${backendUrl}/api/RefStruc `),
  //         api.get(`${backendUrl}/api/Account/GetAllAccounts`), // Adjust based on your actual account list API
  //       ]);
  //       //   setProjectOpt(projRes.data || []);
  //       setOrgOpt(orgRes.data || []);
  //       setRef1Opt(ref1Res.data || []);
  //       setRef2Opt(ref2Res.data || []);
  //       setAcctOpt(acctRes.data || []);
  //     } catch (error) {
  //       console.error("Error fetching options:", error);
  //     }
  //   };

  // 1. Fetch All Static Options on Mount

  // 2. Corrected Fetch Function for Cash Accounts
  //   const fetchDefCash = async () => {
  //     try {
  //       const response = await api.get(
  //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
  //       );

  //       // Access response.data.data based on your JSON structure
  //       if (response.data?.data?.length > 0) {
  //         let record = response.data.data[0];

  //         // Enrich record with names from options for the UI
  //         record.acctName =
  //           acctOpt.find((a) => a.id === record.acctId)?.name || "";
  //         record.orgName = orgOpt.find((o) => o.id === record.orgId)?.name || "";
  //         record.ref1Name =
  //           ref1Opt.find((r) => r.id === record.ref1Id)?.name || "";
  //         record.ref2Name =
  //           ref2Opt.find((r) => r.id === record.ref2Id)?.name || "";
  //         record.bankAcctName =
  //           bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "";

  //         setDefCashInfo(record);
  //         setOriginalData(record);
  //         setIsDirty(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching cash accounts:", error);
  //     }
  //   };

  const fetchDefCash = async (loadedOptions = null) => {
    try {
      const response = await api.get(
        `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
      );

      if (response.data?.data) {
        const rawData = response.data.data;

        // If we just loaded options, use them directly to avoid the "empty state" race condition
        const enriched = rawData.map((record) =>
          enrichRecord(record, loadedOptions || {}),
        );

        setOriginalData(enriched);
        if (enriched.length > 0) {
          setDefCashInfo(enriched[currentIndex] || enriched[0]);
        }
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error fetching cash accounts:", error);
    }
  };

  //   const fetchDefCash = async () => {
  //     try {
  //       const response = await api.get(
  //         `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
  //       );
  //       if (response.data?.data) {
  //         const rawData = response.data.data;
  //         // Enrich all records so navigation is smooth
  //         const enriched = rawData.map((record) => enrichRecord(record));

  //         setOriginalData(enriched);
  //         if (enriched.length > 0) {
  //           setDefCashInfo(enriched[0]);
  //           setCurrentIndex(0);
  //         }
  //         setIsDirty(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching cash accounts:", error);
  //     }
  //   };

  useEffect(() => {
    const init = async () => {
      // 1. Get the data directly from the fetch call
      const staticData = await fetchStaticOptions();

      // 2. Pass that fresh data into the cash fetcher
      if (staticData) {
        await fetchDefCash(staticData);
      } else {
        // Fallback if options failed
        await fetchDefCash();
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //   useEffect(() => {
  //     fetchStaticOptions();
  //     fetchDefCash();
  //   }, []);

  //   const handleFieldChange = (
  //     field,
  //     value,
  //     nameField = null,
  //     nameValue = null,
  //   ) => {
  //     setDefCashInfo((prev) => {
  //       const updated = { ...prev, [field]: value };
  //       if (nameField) updated[nameField] = nameValue;
  //       return updated;
  //     });
  //     setIsDirty(true);
  //   };

  const handleFieldChange = (field, value, uniqueKey = null) => {
    if (uniqueKey !== null) {
      // Table View Update
      setOriginalData((prev) =>
        prev.map((item, index) => {
          const itemKey = item.cashAcctsKey || item.tempId || index;
          return itemKey === uniqueKey ? { ...item, [field]: value } : item;
        }),
      );
    } else {
      // Form View Update
      setDefCashInfo((prev) => ({ ...prev, [field]: value }));
    }
    setIsDirty(true);
  };

  const handleDelete = async () => {
    // Only attempt delete if there is a valid primary key
    // if (!defCashInfo.cashAcctsKey || defCashInfo.cashAcctsKey === 0) {
    //   toast.error("No record selected to delete.");
    //   return;
    // }

    if (window.confirm("Are you sure you want to delete this cash account?")) {
      try {
        const response = await api.delete(
          `${backendUrl}/api/dflt-cash-accts/${defCashInfo.cashAcctsKey}`,
        );

        if (response.status === 200 || response.status === 204) {
          toast.success("Record deleted successfully.");

          // Refresh the data list
          const updatedResponse = await api.get(
            `${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50`,
          );

          if (
            updatedResponse.data?.data &&
            updatedResponse.data.data.length > 0
          ) {
            const rawData = updatedResponse.data.data;
            const enriched = rawData.map((record) => enrichRecord(record));

            setOriginalData(enriched);

            // Navigate to the previous available record
            const nextIndex = Math.max(0, currentIndex - 1);
            setCurrentIndex(nextIndex);
            setDefCashInfo(enriched[nextIndex]);
          } else {
            // No records left
            setOriginalData([]);
            setDefCashInfo(initialDefCashState);
            setCurrentIndex(0);
          }
          setIsDirty(false);
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        toast.error("Failed to delete the record. Please try again.");
      }
    }
  };

  //   const handleSave = async () => {
  //     if (!defCashInfo.acctId) return toast.error("Account is required");

  //     try {
  //       const payload = {
  //         cashAcctsKey: defCashInfo.cashAcctsKey || 0,
  //         acctId: defCashInfo.acctId,
  //         orgId: defCashInfo.orgId || "",
  //         ref1Id: defCashInfo.ref1Id || "",
  //         ref2Id: defCashInfo.ref2Id || "",
  //         bankAcctAbbrv: defCashInfo.bankAcctAbbrv || "",
  //         cashAcctsDesc: defCashInfo.cashAcctsDesc || "",
  //         modifiedBy: user.name || "System",
  //         companyId: companyId,
  //         timeStamp: new Date().toISOString(),
  //       };

  //       const isUpdate = payload.cashAcctsKey > 0;
  //       const url = `${backendUrl}/api/dflt-cash-accts`;

  //       const response = isUpdate
  //         ? await api.put(`${url}/${payload.cashAcctsKey}`, payload)
  //         : await api.post(url, payload);

  //       if (response.status === 200 || response.status === 201) {
  //         toast.success("Cash Account saved successfully!");
  //         setIsDirty(false);
  //         fetchDefCash();
  //       }
  //     } catch (error) {
  //       toast.error("Error saving information.");
  //     }
  //   };

  const handleSave = async () => {
    // 1. Identify which record to save
    // If in Form View, use defCashInfo.
    // If in Table View, use the record at the currently active/selected index.
    const activeRecord = isFormView ? defCashInfo : originalData[currentIndex];

    // 2. Validation using the active record
    if (!activeRecord?.acctId) {
      return toast.error("Account is required");
    }

    try {
      // 3. Construct Payload from activeRecord
      const payload = {
        cashAcctsKey: activeRecord.cashAcctsKey || 0,
        acctId: activeRecord.acctId,
        orgId: activeRecord.orgId || "",
        ref1Id: activeRecord.ref1Id || "",
        ref2Id: activeRecord.ref2Id || "",
        bankAcctAbbrv: activeRecord.bankAcctAbbrv || "",
        cashAcctsDesc: activeRecord.cashAcctsDesc || "",
        modifiedBy: user.name || "System",
        companyId: companyId,
        timeStamp: new Date().toISOString(),
      };

      const isUpdate = payload.cashAcctsKey > 0;
      const url = `${backendUrl}/api/dflt-cash-accts`;

      const response = isUpdate
        ? await api.put(`${url}/${payload.cashAcctsKey}`, payload)
        : await api.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Cash Account saved successfully!");
        setIsDirty(false);
        fetchDefCash(); // Refresh data from backend
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving information.");
    }
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    if (!originalData.length) return;

    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setDefCashInfo(originalData[newIndex]);
    setIsDirty(false);
  };

  const handleCopy = () => {
    // 1. Identify which record the user is currently looking at
    const activeData = isFormView ? defCashInfo : originalData[currentIndex];

    if (!activeData) {
      return toast.warn("No record selected to copy.");
    }

    // 2. Destructure to exclude keys that must be unique in the database
    // We remove cashAcctsKey and tempId so the pasted version gets fresh ones
    const { cashAcctsKey, tempId, ...toCopy } = activeData;

    // 3. Update both the local state (for handlePaste) and localStorage (for persistence)
    setClipboard(toCopy);
    localStorage.setItem("clipboard_cash_acct", JSON.stringify(toCopy));

    toast.info("Record copied to clipboard");
  };
  const handlePaste = () => {
    if (!clipboard) {
      return toast.error("Clipboard is empty.");
    }

    // 1. Create a brand new record based on clipboard data
    const newRecord = {
      ...initialDefCashState, // Uses the Cash Accounts default state
      ...clipboard, // Overwrite with copied data
      cashAcctsKey: 0, // Primary key for Cash Accounts (set to 0 for DB insert)
      tempId: Date.now(), // Unique ID for the frontend table key
      isNew: true,
    };

    // 2. Append the new record to the list
    setOriginalData((prev) => [...prev, newRecord]);

    // 3. Navigate to this new record immediately
    // Note: We use the length of the current 'originalData' as the new index
    const newIndex = originalData.length;
    setCurrentIndex(newIndex);
    setDefCashInfo(newRecord); // Updates the Form View state

    // 4. Mark as dirty so the user knows they need to save
    setIsDirty(true);
    toast.success("Data pasted as a new row.");
  };

  const handleFindReplace = (config, isReplaceMode) => {
    const {
      column,
      findYear, // The 'Find' value
      replaceValue, // The 'Replace' value
    } = config;

    if (!column) {
      return toast.warn("Please select a column first.");
    }

    // --- FIND (SEARCH/FILTER) LOGIC ---
    if (!isReplaceMode) {
      if (!findYear) {
        return toast.warn("Please enter a value to find.");
      }

      const search = String(findYear).toLowerCase();

      const filteredResults = originalData.filter((item) => {
        const currentValue = String(item[column] || "").toLowerCase();
        return currentValue.includes(search);
      });

      if (filteredResults.length > 0) {
        setOriginalData(filteredResults);
        // Reset navigation to the first found result in the filtered list
        setDefCashInfo(filteredResults[0]);
        setCurrentIndex(0);
        setIsDirty(true);
        toast.info(`Found ${filteredResults.length} matches.`);
      } else {
        toast.error(`No matches found for "${findYear}".`);
      }
      return;
    }

    // --- REPLACE LOGIC ---
    // 1. Validation: Prevent replacing auto-populated Name fields
    const readOnlyColumns = [
      "acctName",
      "orgName",
      "bankAcctName",
      "ref1Name",
      "ref2Name",
    ];
    if (readOnlyColumns.includes(column)) {
      return toast.error("Cannot bulk replace auto-populated name fields.");
    }

    // 2. Confirmation
    if (
      !window.confirm(
        `Are you sure you want to replace matches in "${COLUMN_LABELS[column]}"?`,
      )
    ) {
      return;
    }

    let changeCount = 0;
    const updatedData = originalData.map((item) => {
      const currentValue = String(item[column] || "");
      const searchTarget = String(findYear || "");

      if (
        searchTarget === "" ||
        currentValue.toLowerCase().includes(searchTarget.toLowerCase())
      ) {
        if (item[column] === replaceValue) return item;

        changeCount++;
        let updatedItem = { ...item, [column]: replaceValue };

        // 3. CRITICAL: Automatically update corresponding "Name" labels for IDs
        if (column === "acctId") {
          updatedItem.acctName =
            acctOpt.find((a) => (a.acctId || a.id) === replaceValue)
              ?.acctName || "";
        } else if (column === "orgId") {
          updatedItem.orgName =
            orgOpt.find((o) => (o.orgId || o.id) === replaceValue)?.orgName ||
            "";
        } else if (column === "bankAcctAbbrv") {
          updatedItem.bankAcctName =
            bankAbbrv.find((b) => b.id === replaceValue)?.name || "";
        } else if (column === "ref1Id") {
          updatedItem.ref1Name =
            ref1Opt.find((r) => r.refStrucId === replaceValue)?.refStrucName ||
            "";
        } else if (column === "ref2Id") {
          updatedItem.ref2Name =
            ref2Opt.find((r) => r.refStrucId === replaceValue)?.refStrucName ||
            "";
        }

        return updatedItem;
      }
      return item;
    });

    if (changeCount > 0) {
      setOriginalData(updatedData);

      // 4. Sync the Form View (defCashInfo) if the current record was changed
      const activeKey =
        originalData[currentIndex]?.cashAcctsKey ||
        originalData[currentIndex]?.tempId ||
        currentIndex;
      const updatedActiveRecord = updatedData.find((item, idx) => {
        const key = item.cashAcctsKey || item.tempId || idx;
        return key === activeKey;
      });

      if (updatedActiveRecord) setDefCashInfo(updatedActiveRecord);

      setIsDirty(true);
      toast.success(`Successfully updated ${changeCount} records.`);
    } else {
      toast.info("No matching records were found to update.");
    }
  };

  const toolbarActions = {
    // onAdd: () => {
    //   setDefCashInfo(initialDefCashState);
    //   setIsDirty(true);
    // },
    onAdd: () => {
      const newRecord = { ...initialDefCashState, tempId: Date.now() };
      setOriginalData((prev) => [...prev, newRecord]);
      setDefCashInfo(newRecord);
      setCurrentIndex(originalData.length);
      setIsDirty(true);
    },
    onSave: handleSave,
    onDelete: handleDelete,
    onClear: () => {
      fetchDefCash();
      setIsDirty(false);
    },
    onToggleView: () => {
      // If switching to Form View without an active record, default to the first one
      if (!isFormView && !defCashInfo && originalData.length > 0) {
        setDefCashInfo(originalData[0]);
        setCurrentIndex(0);
      }
      setIsFormView(!isFormView);
    },
    // Optional: add copy/paste if you implemented those handlers
    onCopy: handleCopy,
    onPaste: handlePaste,
  };

  const CASH_ACCT_COLUMNS = [
    {
      id: "cashAcctsDesc",
      label: "Description",
      type: "text",
      allowReplace: true,
    },
    {
      id: "acctId",
      label: "Account",
      type: "select",
      allowReplace: true,
      options: acctOpt.map((a) => ({
        value: a.acctId,
        label: `${a.acctId} - ${a.acctName}`,
      })),
    },
    {
      id: "orgId",
      label: "Organization",
      type: "select",
      allowReplace: true,
      options: orgOpt.map((o) => ({
        value: o.orgId,
        label: `${o.orgId} - ${o.orgName}`,
      })),
    },
    {
      id: "bankAcctAbbrv",
      label: "Bank Abbrv",
      type: "select",
      allowReplace: true,
      options: bankAbbrv.map((b) => ({
        value: b.id,
        label: `${b.id} - ${b.name}`,
      })),
    },
    { id: "ref1Id", label: "Ref No 1", type: "text", allowReplace: true },
    { id: "ref2Id", label: "Ref No 2", type: "text", allowReplace: true },
    {
      id: "modifiedBy",
      label: "Modified By",
      type: "text",
      allowReplace: false,
    },
  ];

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-300 mt-10">
      <MainContainer title="Manage Cash Accounts" handleClose={onClose}>
        <Toolbar
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          isFormView={isFormView}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
          searchValue={searchTerm}
          setSearchValue={setSearchTerm}
          jumpToCode={(code) => {
            const found = originalData.find(
              (item) =>
                String(item.cashAcctsDesc).toLowerCase() ===
                String(code).toLowerCase(),
            );
            if (found) {
              setDefCashInfo(found);
              setCurrentIndex(originalData.indexOf(found));
              setIsFormView(true);
              setIsDirty(false);
            } else {
              toast.error(`"${code}" not found.`);
            }
          }}
          // Bulk Find/Replace props (if using the handleFindReplace logic)
          handleFindReplace={handleFindReplace}
          columns={CASH_ACCT_COLUMNS}
        />
        {isFormView ? (
          <div className="mt-2">
            <FormSection>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
                <FormInput
                  label="Cash Account Desc"
                  required
                  value={defCashInfo.cashAcctsDesc || ""}
                  disabled={
                    defCashInfo.cashAcctsKey !== 0 && !defCashInfo.isNew
                  }
                  onChange={(e) =>
                    handleFieldChange("cashAcctsDesc", e.target.value)
                  }
                />
                <div />

                <FormSearchSelect
                  label="Account"
                  options={acctOpt}
                  value={defCashInfo.acctId}
                  displayKey="acctId"
                  onSelect={(val) =>
                    // Use val.acctId if that is what the API returns
                    handleFieldChange(
                      "acctId",
                      val.acctId || val.id,
                      "acctName",
                      val.acctName || val.name,
                    )
                  }
                />
                <FormInput
                  label="Account Name"
                  disabled
                  value={defCashInfo.acctName || ""}
                />

                <FormSearchSelect
                  label="Organization"
                  options={orgOpt}
                  value={defCashInfo.orgId}
                  displayKey="orgId"
                  onSelect={(val) =>
                    handleFieldChange(
                      "orgId",
                      val.orgId || val.id,
                      "orgName",
                      val.orgName || val.name,
                    )
                  }
                />
                <FormInput
                  label="Org Name"
                  disabled
                  value={defCashInfo.orgName || ""}
                />

                <FormSearchSelect
                  label="Bank Abbrev"
                  options={bankAbbrv}
                  value={defCashInfo.bankAcctAbbrv}
                  displayKey="id"
                  onSelect={(val) =>
                    handleFieldChange(
                      "bankAcctAbbrv",
                      val.id,
                      "bankAcctName",
                      val.name,
                    )
                  }
                />
                <FormInput
                  label="Bank Abbrev Name"
                  disabled
                  value={defCashInfo.bankAcctName || ""}
                />

                <FormSearchSelect
                  label="Ref No 1"
                  options={ref1Opt}
                  value={defCashInfo.ref1Id}
                  displayKey="refStrucId"
                  onSelect={(val) =>
                    handleFieldChange(
                      "ref1Id",
                      val.refStrucId,
                      "ref1Name",
                      val.refStrucName,
                    )
                  }
                />
                <FormInput
                  label="Ref No 1 Name"
                  disabled
                  value={defCashInfo.ref1Name || ""}
                />

                <FormSearchSelect
                  label="Ref No 2"
                  options={ref2Opt}
                  value={defCashInfo.ref2Id}
                  displayKey="refStrucId"
                  onSelect={(val) =>
                    handleFieldChange(
                      "ref2Id",
                      val.refStrucId,
                      "ref2Name",
                      val.refStrucName,
                    )
                  }
                />
                <FormInput
                  label="Ref No 2 Name"
                  disabled
                  value={defCashInfo.ref2Name || ""}
                />
              </div>
            </FormSection>
          </div>
        ) : (
          <div className={`overflow-x-auto max-h-[35vh]`}>
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                    />{" "}
                  </th>
                  {columns.map((col) => (
                    <th key={col} className="th-thead">
                      <div className="flex items-center justify-center">
                        {COLUMN_LABELS[col]}
                        <span></span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tbody">
                {originalData.map((item, index) => {
                  const uniqueKey = item.cashAcctsKey || item.tempId || index;
                  const isRowChecked = selectedRows.has(uniqueKey);
                  return (
                    <tr
                      key={uniqueKey}
                      className={
                        selectedRows.has(uniqueKey) ? "bg-blue-50" : ""
                      }
                    >
                      <td className="text-center tbody-td w-10">
                        <input
                          type="checkbox"
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          checked={selectedRows.has(uniqueKey)}
                          onChange={() => {
                            const newSet = new Set(selectedRows);
                            newSet.has(uniqueKey)
                              ? newSet.delete(uniqueKey)
                              : newSet.add(uniqueKey);
                            setSelectedRows(newSet);
                            setDefCashInfo(item);
                            setCurrentIndex(index);
                          }}
                        />
                      </td>
                      {columns.map((col) => {
                        const isAccount = col === "acctId";
                        const isOrg = col === "orgId";
                        const isRef1 = col === "ref1Id";
                        const isRef2 = col === "ref2Id";
                        const isBank = col === "bankAcctAbbrv";

                        // Helper to determine if we should show a dropdown or a standard input
                        const isSelect =
                          isAccount || isOrg || isRef1 || isRef2 || isBank;
                        return (
                          <td key={col} className="tbody-td">
                            {isSelect ? (
                              <TableSearchSelect
                                value={item[col]}
                                // 2. Select the correct options array based on the column
                                options={
                                  isAccount
                                    ? acctOpt
                                    : isOrg
                                      ? orgOpt
                                      : isRef1
                                        ? ref1Opt
                                        : isRef2
                                          ? ref2Opt
                                          : bankAbbrv
                                }
                                // 3. Set the key the dropdown should show (the ID field)
                                displayKey={
                                  isAccount
                                    ? "acctId"
                                    : isOrg
                                      ? "orgId"
                                      : isBank
                                        ? "id"
                                        : "refStrucId"
                                }
                                onSelect={(val) => {
                                  // 4. Identify the ID and Name keys to update
                                  const idKey = col;
                                  const nameKey = isAccount
                                    ? "acctName"
                                    : isOrg
                                      ? "orgName"
                                      : isRef1
                                        ? "ref1Name"
                                        : isRef2
                                          ? "ref2Name"
                                          : "bankAcctName";

                                  // 5. Extract values from the selection object
                                  const displayVal = isAccount
                                    ? val.acctId
                                    : isOrg
                                      ? val.orgId
                                      : isBank
                                        ? val.id
                                        : val.refStrucId;

                                  const descriptionVal = isAccount
                                    ? val.acctName
                                    : isOrg
                                      ? val.orgName
                                      : isBank
                                        ? val.name
                                        : val.refStrucName;

                                  // 6. Update BOTH fields (ID and Name) for this row
                                  handleFieldChange(
                                    idKey,
                                    displayVal,
                                    uniqueKey,
                                  );
                                  handleFieldChange(
                                    nameKey,
                                    descriptionVal,
                                    uniqueKey,
                                  );
                                }}
                              />
                            ) : (
                              <input
                                className={`td-input min-w-[150px] ${
                                  isRowChecked ? "bg-blue-50" : "bg-transparent"
                                }`}
                                disabled={
                                  col.endsWith("Name") ||
                                  (col === "cashAcctsDesc" &&
                                    item.cashAcctsKey !== 0 &&
                                    !item.isNew)
                                }
                                value={item[col] || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    col,
                                    e.target.value,
                                    uniqueKey,
                                  )
                                }
                                // disabled={col.endsWith("Name")}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default ManageCashAccounts;
