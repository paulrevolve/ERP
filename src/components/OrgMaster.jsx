import api from "../utils/api";
import React, { useEffect, useRef, useState } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { BriefcaseBusiness, Building2, Save, Trash2 } from "lucide-react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import {
  FormSection,
  FormInput,
  FormSearchSelect,
  ActionDetailButton,
} from "../helper/formSection";
import ReusableTable from "../helper/tableSection";
import { Plus } from "lucide-react";
import { ActionButton } from "../helper/container"; // Adjust path based on
import Pagination from "../helper/pagination";
import { useDraftStore } from "../store/useDraftStore";

const OrgMaster = ({ canEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTermTaxable, setSearchTermTaxable] = useState("");

  const [AcctDetail, setAcctDetail] = useState({
    acct: "",
    acctName: "",
  });

  const [accounts, setAccounts] = useState([]);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1); // Update this from your API response
  const [goToValue, setGoToValue] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [taxableEntity, setTaxableEntity] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [selectedLevels, setSelectedLevels] = useState([]);

  // my new screen
  // Toolbar & UI State
  const [isFormView, setIsFormView] = useState(true);
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isTableDirty, setIsTableDirty] = useState(false);

  // Search & Replace State
  const [searchColumn, setSearchColumn] = useState("orgId");
  const [searchValue, setSearchValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");

  // Data & Navigation State
  const [activeGroupRow, setActiveGroupRow] = useState(null);
  const [clipboard, setClipboard] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxLevel, setMaxLevel] = useState(1);
  // Add these to your state declarations in OrgMaster.jsx
  // Inside OrgMaster component
  const [levelData, setLevelData] = useState([]);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);

  const [acctorgLink, setAcctOrgLink] = useState(false);

  const [allData, setAllData] = useState([]);

  const [refrences, setRefrences] = useState([]);
  const refrence = async () => {
    try {
      const res = await api.get(`${backendUrl}/api/RefStruc`);

      if (res.data) {
        setRefrences(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refrence();
  }, []);

  // --- 4 PHASE DRAFT STATE PERSISTENCE ---
  // Phase 1: Hydrate Draft on Mount
  useEffect(() => {
    const draft = useDraftStore.getState().getDraft("org-master");
    if (
      draft &&
      Array.isArray(draft.data) &&
      draft.data.length > 0 &&
      (draft.isDirty ||
        draft.hasUnsaved ||
        draft.data.some((r) => r.isDirty || r.tempId || r.isNew))
    ) {
      setData(draft.data);
      if (draft.activeGroupRow) setActiveGroupRow(draft.activeGroupRow);
      if (draft.selectedRows) setSelectedRows(new Set(draft.selectedRows));
      if (typeof draft.isFormView === "boolean") setIsFormView(draft.isFormView);
      if (draft.currentIndex !== undefined) setCurrentIndex(draft.currentIndex);
    }
  }, []);

  // Phase 2: Auto-save Draft on Changes
  const dataRef = useRef(data);
  const activeGroupRowRef = useRef(activeGroupRow);
  const selectedRowsRef = useRef(selectedRows);
  const isFormViewRef = useRef(isFormView);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    dataRef.current = data;
    activeGroupRowRef.current = activeGroupRow;
    selectedRowsRef.current = selectedRows;
    isFormViewRef.current = isFormView;
    currentIndexRef.current = currentIndex;

    const hasDirty =
      data.some((r) => r.isDirty || r.tempId || r.isNew) ||
      isFormDirty ||
      isTableDirty;
    if (hasDirty) {
      useDraftStore.getState().saveDraft("org-master", {
        data,
        activeGroupRow,
        selectedRows: Array.from(selectedRows),
        isFormView,
        currentIndex,
        isDirty: true,
        hasUnsaved: true,
      });
    }
  }, [
    data,
    activeGroupRow,
    selectedRows,
    isFormView,
    currentIndex,
    isFormDirty,
    isTableDirty,
  ]);

  // Phase 3: Cleanup / Unmount save
  useEffect(() => {
    return () => {
      const cur = dataRef.current;
      if (
        cur &&
        (cur.some((r) => r.isDirty || r.tempId || r.isNew) ||
          isFormDirty ||
          isTableDirty)
      ) {
        useDraftStore.getState().saveDraft("org-master", {
          data: cur,
          activeGroupRow: activeGroupRowRef.current,
          selectedRows: Array.from(selectedRowsRef.current),
          isFormView: isFormViewRef.current,
          currentIndex: currentIndexRef.current,
          isDirty: true,
          hasUnsaved: true,
        });
      }
    };
  }, []);

  // Combined loading state for disabling buttons
  const isAnyLoading = isLoading || loading || isDeleting || isLoadingLevels;

  const ORG_COLUMNS = [
    // --- Primary Identity ---
    { id: "orgId", label: "Org ID", type: "text", allowReplace: false },
    { id: "orgName", label: "Org Name", type: "text", allowReplace: true },
    { id: "orgAbbrvCd", label: "Abbrv Code", type: "text", allowReplace: true },

    {
      id: "fyCdFr",
      label: "Fiscal Year Start",
      type: "text",
      allowReplace: true,
    },
    {
      id: "fyCdTo",
      label: "Fiscal Year End",
      type: "text",
      allowReplace: true,
    },

    // --- Attributes ---
    // { id: "companyId", label: "Company ID", type: "text", allowReplace: false },

    // {
    //   id: "taxbleEntityId",
    //   label: "Tax Entity ID",
    //   type: "select",
    //   allowReplace: true,
    //   options: taxableEntity.map((t) => ({
    //     value: t.taxableId,
    //     label: `${t.taxableId} - ${t.taxableName}`,
    //   })),
    // },

    // --- Status Flags ---
    { id: "activeFl", label: "Active", type: "flag", allowReplace: true },
    {
      id: "tcOrgFl",
      label: "Time Collection",
      type: "flag",
      allowReplace: true,
    },
    // { id: "tcOrgFl", label: "TC Org", type: "flag", allowReplace: true },

    // --- Intercompany (ICR) - Due From ---
    {
      id: "icrAcctIdFr",
      label: "ICR From Acct",
      type: "select",
      allowReplace: true,
      options: accounts.map((a) => ({
        value: a.acctId,
        label: `${a.acctId} - ${a.acctName}`,
      })),
    },
    {
      id: "icrRef1IdFr",
      label: "ICR From Ref1",
      type: "text",
      allowReplace: true,
    },
    {
      id: "icrRef2IdFr",
      label: "ICR From Ref2",
      type: "text",
      allowReplace: true,
    },

    // --- Intercompany (ICR) - Due To ---
    {
      id: "icrAcctIdTo",
      label: "ICR To Acct",
      type: "select",
      allowReplace: true,
      options: accounts.map((a) => ({
        value: a.acctId,
        label: `${a.acctId} - ${a.acctName}`,
      })),
    },
    {
      id: "icrRef1IdTo",
      label: "ICR To Ref1",
      type: "text",
      allowReplace: true,
    },
    {
      id: "icrRef2IdTo",
      label: "ICR To Ref2",
      type: "text",
      allowReplace: true,
    },
    // {
    //   id: "modifiedBy",
    //   label: "Modified By",
    //   type: "text",
    //   allowReplace: false,
    // },
  ];
  const myColumns = [
    // --- Basic Identity ---
    {
      label: "Organization",
      key: "orgId",
      required: true,
      readOnlyIfExisting: true,
      placeholder: "ID...",
    },
    {
      label: "Name",
      key: "orgName",
      required: true,
      placeholder: "Name...",
    },

    // --- Organization Structures ---
    { label: "Abbreviation", key: "orgAbbrvCd" },
    { label: "Levels", key: "lvlNo", type: "number", readOnly: true },
    {
      label: "Active",
      key: "activeFl",
      type: "checkbox",
      value: (row) => row.activeFl === "Y",
      onToggle: (id, isCurrentlyChecked) => {
        const newValue = !isCurrentlyChecked;
        handleFieldChange(id, "activeFl", newValue);
      },
    },
    { label: "Company ID", key: "companyId", readOnly: true },
    {
      label: "Taxable Entity",
      key: "taxbleEntityId",
      type: "search-select",
      options: taxableEntity,
      displayKey: "taxableId",
      secondaryKey: "taxableName",
      onSelect: (selectedOpt, id) => {
        // id here is the row's unique identifier passed by the ReusableTable
        handleFieldChange(id, "taxbleEntityId", selectedOpt.taxableId);
        handleFieldChange(id, "taxbleEntityName", selectedOpt.taxableName);
      },

      required: true,
    },

    // --- Period Information ---
    { label: "Fiscal Yr Start", key: "fyCdFr" },
    { label: "Period Start", key: "pdNoFr", type: "number" },
    { label: "Fiscal Yr End", key: "fyCdTo" },
    { label: "Period End", key: "pdNoTo", type: "number" },

    // --- Export Options ---
    {
      label: "Time Collection",
      key: "tcOrgFl",
      type: "checkbox",
      value: (row) => row.tcOrgFl === "Y",

      onToggle: (id, isCurrentlyChecked) => {
        const newValue = !isCurrentlyChecked;
        handleFieldChange(id, "tcOrgFl", newValue);
      },
    },
    { label: "Balance Sheet Level", key: "balanceSheet", type: "number" },

    // --- ICR Accounts (Due From) ---
    {
      label: "ICR From Acct",
      key: "icrAcctIdFr",
      type: "search-select",
      options: accounts,
      displayKey: "acctId",
      secondaryKey: "acctName",
      onSelect: (selectedOpt, id) => {
        // id here is the row's unique identifier passed by the ReusableTable
        handleFieldChange(id, "icrAcctIdFr", selectedOpt.acctId);
      },
    },
    {
      label: "ICR From Ref 1",
      key: "icrRef1IdFr",
      type: "search-select",
      options: refrences,
      displayKey: "refStrucId",
      secondaryKey: "refStrucName",
      onSelect: (selectedOpt, id) => {
        handleFieldChange(id, "icrRef1IdFr", selectedOpt.refStrucId);
      },
    },
    {
      label: "ICR From Ref 2",
      key: "icrRef2IdFr",
      type: "search-select",
      options: refrences,
      displayKey: "refStrucId",
      secondaryKey: "refStrucName",
      onSelect: (selectedOpt, id) => {
        handleFieldChange(id, "icrRef2IdFr", selectedOpt.refStrucId);
      },
    },

    // --- ICR Accounts (Due To) ---
    {
      label: "ICR To Acct",
      key: "icrAcctIdTo",
      type: "search-select",
      options: accounts,
      displayKey: "acctId",
      secondaryKey: "acctName",
      onSelect: (selectedOpt, id) => {
        handleFieldChange(id, "icrAcctIdTo", selectedOpt.acctId);
      },
    },
    {
      label: "ICR To Ref 1",
      key: "icrRef1IdTo",
      type: "search-select",
      options: refrences,
      displayKey: "refStrucId",
      secondaryKey: "refStrucName",
      onSelect: (selectedOpt, id) => {
        handleFieldChange(id, "icrRef1IdTo", selectedOpt.refStrucId);
      },
    },
    {
      label: "ICR To Ref 2",
      key: "icrRef2IdTo",
      type: "search-select",
      options: refrences,
      displayKey: "refStrucId",
      secondaryKey: "refStrucName",
      onSelect: (selectedOpt, id) => {
        handleFieldChange(id, "icrRef2IdTo", selectedOpt.refStrucId);
      },
    },
  ];

  const handelLinkAcct = async () => {
    // 1. Validation Logic
    if (!AcctDetail.acct || AcctDetail.acct.trim() === "") {
      toast.error("Account ID is required.");
      return;
    }
    const orgId = activeGroupRow.orgId;
    setLoading(true); // Assuming you have a loading state
    try {
      // 2. Prepare Payload based on your API documentation
      // Note: The screenshot shows /Orgnization/AddAccounts expects { orgId, acctId }
      const payload = {
        acctId: AcctDetail.acct,
        orgId: orgId, // Include if your specific endpoint needs the name too
        // orgId: someOrgIdVariable, // Ensure you have the orgId context needed
      };

      // 3. API Call
      const res = await api.post(
        `${backendUrl}/Orgnization/AddAccounts`,
        payload,
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Account linked successfully!");

        // 4. Optional: Clear form after successful save
        setAcctDetail({ acct: "", acctName: "" });

        // Refresh your list if necessary
        // fetchLinkedData();
      }
    } catch (error) {
      console.error("Save Error:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to link account";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getTaxableentity = async () => {
      try {
        const response = await api.get(
          `${backendUrl}/api/company/GetTaxableEntity?companyId=1`,
        );
        if (response.data) {
          setTaxableEntity(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTaxableentity();
  }, []);
  useEffect(() => {
    const getAccounts = async () => {
      try {
        const response = await api.get(
          `${backendUrl}/api/Account/GetAllAccounts`,
        );
        if (response.data) {
          setAccounts(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAccounts();
  }, []);

  const isMaxLevelEditable = (lvl) => {
    // 1. Guard clause: If fundamental data is missing, exit early
    // if (!levelData?.level || !selectedLevelRows) return false;
    const levels = levelData;

    // 2. Handle empty array: If no levels exist, there is no "max" to edit
    if (levels.lenght === 0) return false;

    // 3. Perform calculation safely
    const maxLevelNum = Math.max(...levels.map((l) => l.level));

    // 4. Return the conditional check
    return lvl.level === maxLevelNum && lvl.count === 0;
  };

  const handleFindReplace = (config, isReplaceMode) => {
    const {
      column,
      findYear,
      findMonth,
      replaceValue,
      replaceYear,
      replaceMonth,
      booleanMode,
    } = config;

    if (!column) {
      return toast.warn("Please select a column first.");
    }

    // --- NEW: FIND (SEARCH) LOGIC ---
    if (!isReplaceMode) {
      setIsTableDirty(true);
      // Unified logic: check pdNo for month, otherwise default to findYear
      const targetFindValue = column.startsWith("pdNo") ? findMonth : findYear;

      if (!targetFindValue) {
        return toast.warn("Please enter a value to find.");
      }

      const search = String(targetFindValue).toLowerCase();

      const filteredResults = data.filter((item) => {
        const currentValue = String(item[column] || "").toLowerCase();

        // Exact match for periods and years
        if (column.startsWith("pdNo") || column.startsWith("fyCd")) {
          return currentValue === search;
        }

        return currentValue.startsWith(search);
      });

      if (filteredResults.length > 0) {
        setData(filteredResults);
        toast.info(`Found ${filteredResults.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFindValue}".`);
      }
      return;
    }

    // --- EXISTING: REPLACE LOGIC ---
    // 1. Validation for Period/Year Columns
    if (
      isReplaceMode &&
      (column.startsWith("pdNo") || column.startsWith("fyCd"))
    ) {
      // Check both specific fields and the generic replaceValue as fallback
      const rv = column.startsWith("fyCd")
        ? replaceYear || replaceValue
        : replaceMonth || replaceValue;

      if (!rv)
        return toast.error("Replacement value is required for periods/years.");

      if (column.startsWith("pdNo")) {
        const pNum = Number(rv);
        if (pNum < 1 || pNum > 12)
          return toast.error("Period must be between 1-12");
      }

      if (column.startsWith("fyCd") && String(rv).length !== 4) {
        return toast.error("Year must be exactly 4 digits.");
      }
    }

    if (
      isReplaceMode &&
      !window.confirm("Apply bulk changes to all matching records?")
    ) {
      return;
    }

    setData((prevData) => {
      let changeCount = 0;

      const updatedData = prevData.map((item) => {
        let rowChanged = false;
        let updatedItem = { ...item };

        // CASE A: FLAG/CHECKBOX COLUMNS
        if (column.endsWith("Fl") || column.endsWith("Flag")) {
          const currentValue = item[column] || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All") {
              updatedItem[column] = currentValue === "Y" ? "N" : "Y";
              rowChanged = true;
            } else if (replaceValue === "Y" && currentValue === "Y") {
              updatedItem[column] = "N";
              rowChanged = true;
            } else if (replaceValue === "N" && currentValue === "N") {
              updatedItem[column] = "Y";
              rowChanged = true;
            }
          } else {
            const targetValue = replaceValue === "Y" ? "Y" : "N";
            if (currentValue !== targetValue) {
              updatedItem[column] = targetValue;
              rowChanged = true;
            }
          }
        }

        // CASE B: PERIOD / YEAR COLUMNS (FIXED)
        else if (column.startsWith("pdNo") || column.startsWith("fyCd")) {
          const currentValue = String(item[column] || "");

          // Identify what we are looking for
          const targetFind = column.startsWith("pdNo") ? findMonth : findYear;

          // Identify what we are replacing with (added fallback to replaceValue)
          const targetReplace = column.startsWith("pdNo")
            ? Number(replaceMonth || replaceValue)
            : replaceYear || replaceValue;

          // Replace if: Search is empty OR it's an exact match
          if (targetFind === "" || currentValue === String(targetFind)) {
            // Verify value is actually changing
            if (item[column] !== targetReplace) {
              updatedItem[column] = targetReplace;
              rowChanged = true;
            }
          }
        }

        // CASE C: STANDARD TEXT / SELECTS
        else {
          const currentValue = String(item[column] || "");
          if (
            findYear === "" ||
            currentValue.toLowerCase().includes(findYear.toLowerCase())
          ) {
            updatedItem[column] = replaceValue;
            rowChanged = true;
          }
        }

        if (rowChanged) {
          changeCount++;
          return { ...updatedItem, isDirty: true };
        }
        return item;
      });

      if (changeCount > 0) {
        toast.success(`Successfully updated ${changeCount} records locally.`);
        setIsTableDirty(true);
      } else {
        toast.info("No matching records found to update.");
      }

      return updatedData;
    });
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage, pageSize]);
  useEffect(() => {
    const getMaxDepth = (items) => {
      if (!items || items.length === 0) return 0;

      return Math.max(
        ...items.map((item) => {
          // Check both 'items' (top level) and 'subItems' (nested levels)
          const children = item.items || item.subItems;
          if (children && children.length > 0) {
            return 1 + getMaxDepth(children);
          }
          return 1;
        }),
      );
    };
    const fetchOrgLevels = async () => {
      // 1. Get the real ID (handle both string and number)
      const orgId = activeGroupRow?.orgId;
      const id = orgId?.split(".")[0];
      if (orgId?.split(".").length > 1) {
        return;
      }

      // 2. Only fetch if it's a saved record (not a 'TEMP' row)
      if (orgId && !activeGroupRow?.isNew) {
        try {
          setIsLoadingLevels(true);
          const res = await api.get(`${backendUrl}/api/org-level/${id}`);

          // 3. Ensure we set an array (API might return a single object or null)
          if (res.data) {
            const fetchedLevels = Array.isArray(res.data)
              ? res.data
              : [res.data];
            setLevelData(fetchedLevels);
            const maxLvl = getMaxDepth(fetchedLevels);
            setMaxLevel(maxLvl);
          } else {
            // setLevelData([]);
          }
        } catch (error) {
          console.error("Fetch Levels Error:", error);
          // setLevelData([]);
        } finally {
          setIsLoadingLevels(false);
        }
      } else {
        // Clear or show default levels for a brand new entry
        // setLevelData([]);
      }
    };

    fetchOrgLevels();
  }, [activeGroupRow?.orgId]); // This is the trigger!
  // Triggers on navigation (Next/Prev) and Table Row Click

  // const handleSaveLevel = async (passedOrgId = null) => {
  //   // Priority: 1. Passed ID, 2. Active State ID
  //   const rawId = passedOrgId || activeGroupRow?.orgId;
  //   if (!rawId) return;

  //   const cleanOrgId = String(rawId).split(".")[0];
  //   const levelsToSave = levelData.filter((l) => l.isDirty || l.isNew);

  //   for (const level of levelsToSave) {
  //     const payload = {
  //       orgIdTop: cleanOrgId,
  //       levelNo: Number(level.level),
  //       orgLevelKey: Number(level.level),
  //       idSegmentLength: Number(level.lenght || 0),
  //       orgLevelDesc: String(level.description || ""),
  //       modifiedBy: String(user?.name || "system"),
  //       rowversion: Number(level.rowversion || 0),
  //     };

  //     const cleanPayload = JSON.parse(JSON.stringify(payload));

  //     if (level.isNew) {
  //       await api.post(`${backendUrl}/api/org-level`, cleanPayload);
  //     } else {
  //       await api.put(`${backendUrl}/api/org-level/${cleanOrgId}/${level.level}`, cleanPayload);
  //     }
  //   }

  //   toast.success("Levels updated successfully.");
  //   fetchOrgLevels(cleanOrgId);
  // };

  const handleSaveLevel = async (passedOrgId = null) => {
    // 1. Identify which rows need saving
    const levelsToSave = levelData.filter((l) => l.isDirty || l.isNew);
    if (levelsToSave.length === 0) return;

    // 2. VALIDATION: Check for missing descriptions before starting any API hits
    for (const level of levelsToSave) {
      if (!level.description || String(level.description).trim() === "") {
        return toast.error(
          `Level No. ${level.level} does not have a description.`,
        );
      }
    }

    // 3. Setup ID
    const rawId = passedOrgId || activeGroupRow?.orgId;
    if (!rawId) {
      return toast.error("Organization ID is missing.");
    }

    const cleanOrgId = String(rawId).split(".")[0];

    setLoading(true); // Ensure loading is handled
    try {
      for (const level of levelsToSave) {
        const payload = {
          orgIdTop: cleanOrgId,
          levelNo: Number(level.level),
          orgLevelKey: Number(level.level),
          idSegmentLength: Number(level.lenght || 0),
          orgLevelDesc: String(level.description || ""),
          modifiedBy: String(user?.name || "system"),
          rowversion: Number(level.rowversion || 0),
        };

        const cleanPayload = JSON.parse(JSON.stringify(payload));

        if (level.isNew) {
          await api.post(`${backendUrl}/api/org-level`, cleanPayload);
        } else {
          await api.put(
            `${backendUrl}/api/org-level/${cleanOrgId}/${level.level}`,
            cleanPayload,
          );
        }
      }

      toast.success("Levels updated successfully.");
      fetchOrgLevels(cleanOrgId);
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to save levels");
    } finally {
      setLoading(false);
    }
  };

  const handleMasterSave = async () => {
    setIsLoading(true);

    try {
      let currentOrgId = activeGroupRow?.orgId;
      let isOrgSuccess = true;

      // --- STEP 1: Check and Save Organization Master ---
      const isOrgDirty = activeGroupRow?.isDirty || activeGroupRow?.isNew;

      if (isOrgDirty) {
        const savedOrg = await handleSaveOrganization();
        if (savedOrg) {
          currentOrgId = savedOrg.orgId;
        } else {
          isOrgSuccess = false;
        }
      }

      // --- STEP 2: Check and Save Levels (RESTRICTED) ---
      if (isOrgSuccess) {
        // Logic Check: Only save Level Table if the Org is Level 1
        const isLevel1 = activeGroupRow?.lvlNo === 1;
        const levelsToSave = levelData.filter((l) => l.isDirty || l.isNew);

        if (isLevel1 && levelsToSave.length > 0) {
          // Only call this for Level 1 organizations
          await handleSaveLevel(currentOrgId);
        } else if (!isLevel1 && levelsToSave.length > 0) {
          // Optional: Log or handle if there are dirty levels on a Level 2 org
          // (though your UI logic should ideally prevent editing them here)
        } else if (!isOrgDirty) {
          toast.info("No changes detected to save.");
        }
      }
    } catch (error) {
      console.error("Master Save Error:", error);
      toast.error("An error occurred during the master save process.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelectedLevels = async () => {
    if (selectedLevels.size === 0) return;

    const orgId = activeGroupRow?.orgId;

    // 1. Find the highest level number currently in the table
    const maxLevel = Math.max(...levelData.map((l) => Number(l.level)), 0);

    const deletableIds = [];
    const restrictedRows = [];

    // 2. Validate every selected row against your business rules
    levelData.forEach((row) => {
      // Convert to Number to ensure accurate comparison with your checkbox state
      if (selectedLevels?.includes(Number(row.level))) {
        // const isLastLevel = Number(row.level) === maxLevel;
        const hasNoData = Number(row.count || 0) === 0;

        // RULE: Only the absolute last level with zero data can be deleted
        if (hasNoData) {
          deletableIds.push(row.level);
        } else {
          // If it's not the last level OR it has data, it's restricted
          restrictedRows.push(row.level);
        }
      }
    });

    // 3. Block if any restricted rows were selected
    if (restrictedRows.length > 0) {
      toast.error(
        `Cannot delete Level(s): ${restrictedRows.join(", ")}. Only the last level with a data count of 0 can be deleted.`,
      );
      return;
    }

    // 4. Confirm before proceeding with valid deletions
    if (!window.confirm(`Delete ${deletableIds.length} selected level(s)?`))
      return;

    setLoading(true);
    try {
      // Sort in descending order to delete from bottom-up
      const idsToDelete = deletableIds.sort((a, b) => Number(b) - Number(a));

      for (const id of idsToDelete) {
        const targetLevel = levelData.find(
          (l) => String(l.level) === String(id),
        );
        const isPersistent = targetLevel && !targetLevel.isNew;

        if (isPersistent && orgId) {
          // API call for existing levels
          await api.delete(
            `${backendUrl}/api/org-level/${orgId}/${id}?orgId=${orgId}`,
          );
        }
      }

      // 5. Update local state
      setLevelData((prev) =>
        prev.filter((l) => !selectedLevels?.includes(Number(l.level))),
      );

      setSelectedLevels(new Set());
      toast.success("Level deleted successfully.");

      if (orgId && !activeGroupRow?.isNew) {
        fetchOrgLevels(orgId);
      }

      setSelectedLevels([]);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        toast.error(msg || "Failed to delete levels.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLevel = () => {
    const newLevelNo = levelData.length + 1; // Calculate next level
    const newLevel = {
      // CRITICAL: This must match your rowKey="level"
      level: newLevelNo,
      orgIdTop: activeGroupRow?.orgId || "",
      description: "", // Matches your levelColumns key
      lenght: 0, // Matches your levelColumns key
      count: 0,
      isNew: true,
      isDirty: true,
    };

    setLevelData((prev) => [...prev, newLevel]);
    setIsFormDirty(true);
  };

  const initialOrgState = {
    // Identity & Metadata
    orgId: "",
    orgName: "",
    tempId: null,
    isNew: true,
    isDirty: false,

    // Organization Details
    orgAbbrvCd: "",
    lvlNo: 1,
    activeFl: "N",
    companyId: "1",
    taxbleEntityId: "",
    orgTopFl: "N",
    tcOrgFl: "N",
    tmOrgFl: "N",

    // Period Information
    fyCdFr: "",
    pdNoFr: null,
    fyCdTo: "",
    pdNoTo: null,

    // ICR Accounts
    icrAcctIdFr: "",
    icrRef1IdFr: "",
    icrRef2IdFr: "",
    icrAcctIdTo: "",
    icrRef1IdTo: "",
    icrRef2IdTo: "",
  };

  // const isInitialized = useRef(false);

  // Inside OrgMaster.jsx
  // useEffect(() => {
  //   if (!isInitialized.current) {
  //     isInitialized.current = true;

  //     const newId = `TEMP_${Date.now()}`;
  //     const newEntry = {
  //       ...initialOrgState,
  //       tempId: newId,
  //       isNew: true,
  //     };

  //     setData([newEntry]);
  //     setActiveGroupRow(newEntry);
  //     // CRITICAL: Ensure the Set contains the newId so the table checkbox is checked
  //     setSelectedRows(new Set([newId]));

  //     setIsFormView(true); // Show Form View on first render
  //     setCurrentIndex(0);
  //   }
  // }, []);

  const handleAddOrg = () => {
    // 1. Check if there is already an unsaved new record
    const hasUnsavedNew = data.some((row) => row.isNew || !!row.tempId);

    if (hasUnsavedNew) {
      toast.warn(
        "Please save or cancel the current new entry before adding another.",
      );
      return; // Stop the function here
    }

    // 2. If no new entry exists, proceed with adding one
    const newId = `TEMP_${Date.now()}`;
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const newRow = {
      orgId: "",
      orgName: "",
      tempId: newId,
      isNew: true,
      isDirty: false,
      modifiedBy: userSession?.name || "system",
      lvlNo: 1,
      taxbleEntityId: "",
      icrAcctIdFr: "",
      icrAcctIdTo: "",
      activeFl: "N",
      companyId: "1",
      balanceSheet: "",
      // ... rest of your initial state
    };

    setData([newRow, ...data]);
    setSelectedRows(new Set([newId]));
    setActiveGroupRow(newRow);
    setIsFormDirty(true);
    setCurrentIndex(0);

    // Initialize Level 1 for the new entry
    setLevelData([
      {
        level: 1,
        description: "",
        lenght: 0,
        orgIdTop: "",
        isNew: true,
        isDirty: true,
      },
    ]);
  };
  const fetchOrgLevels = async (orgId) => {
    try {
      setIsLoadingLevels(true);
      // Adjust the URL to match your backend endpoint
      const res = await api.get(`${backendUrl}/api/org-level/${orgId}`);
      if (res.data) {
        setLevelData(Array.isArray(res.data) ? res.data : [res.data]);
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
      setLevelData([]); // Clear table on error
    } finally {
      setIsLoadingLevels(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = data.find(
      (item) => String(item.orgId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.orgId; //

      // 1. Update Form View Data
      setActiveGroupRow(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = data.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`Organization ID "${code}" not found.`); //
    }
  };

  const handleNavigate = (direction) => {
    if (isFormDirty) {
      if (!window.confirm("You have unsaved changes. Discard them and move?")) {
        return;
      }
    }

    const idx = data.findIndex(
      (x) =>
        (x.tempId || x.orgId) ===
        (activeGroupRow?.tempId || activeGroupRow?.orgId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < data.length - 1) newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = data.length - 1;

    if (newIdx !== idx) {
      const nextRecord = data[newIdx];
      const nextId = nextRecord.tempId || nextRecord.orgId;

      // 1. Update the record being shown in the form
      setActiveGroupRow(nextRecord);
      setCurrentIndex(newIdx);

      // 2. CRITICAL: Update the selection so the table highlights this row
      setSelectedRows(new Set([nextId]));

      setIsFormDirty(false);
    }
  };

  const handleLevelFieldChange = (id, field, value) => {
    // Use Number(id) to ensure we are comparing numbers to numbers
    const targetId = Number(id);

    setLevelData((prev) =>
      prev.map((row) =>
        row.level === targetId
          ? { ...row, [field]: value, isDirty: true }
          : row,
      ),
    );
    setIsFormDirty(true);
  };

  const handleFieldChange = (id, field, value) => {
    setIsFormDirty(true);
    let finalValue = value;

    // 1. Find the current row in your state to see what its ORG ID is right now
    const currentRow = data.find(
      (item) => item.tempId === id || item.orgId === id,
    );

    // 2. Determine the "Active" Org ID string to calculate the level.
    // If we are typing in the Org ID field, use the new 'value'.
    // Otherwise, use the Org ID already saved in the row.
    const activeOrgId = field === "orgId" ? value : currentRow?.orgId || "";

    // 3. Calculate the level based on the segments
    const segments = activeOrgId.split(".").filter((seg) => seg.length > 0);
    const calculatedLevel = segments.length || 1;

    // --- Field Specific Logic ---

    if (field === "orgId") {
      const cleanValue = value.replace(/\s/g, "");
      finalValue = cleanValue;

      // Update lvlNo in the state array immediately
      setData((prevData) =>
        prevData.map((item) =>
          item.tempId === id || item.orgId === id
            ? { ...item, lvlNo: calculatedLevel }
            : item,
        ),
      );
    }

    if (field === "balanceSheet") {
      const numValue = parseInt(value, 10);

      // Now calculatedLevel is defined because we calculated it at the top!
      if (value === "") {
        finalValue = "";
      } else if (isNaN(numValue)) {
        return;
      } else if (numValue < 1) {
        toast.warn("Balance Sheet level cannot be less than 1");
        finalValue = 1;
      } else if (numValue > calculatedLevel) {
        toast.warn(
          `Balance Sheet level cannot exceed Org Level (${calculatedLevel})`,
        );
        finalValue = calculatedLevel;
      } else {
        finalValue = numValue;
      }
    }

    if (field === "fyCdFr" || field === "fyCdTo") {
      const numericValue = value.replace(/\D/g, "");

      // 2. Check if the user is trying to exceed 4 digits
      if (numericValue.length > 4) {
        toast.warn("Year must be exactly 4 digits.");
      }

      // 3. Set the value, capped at 4 digits
      finalValue = numericValue.slice(0, 4);
    }

    // 2. Period Validation
    if (field === "pdNoFr" || field === "pdNoTo") {
      const numValue = parseInt(value, 10);
      if (value === "") {
        finalValue = "";
      } else if (isNaN(numValue)) {
        return;
      } else if (numValue < 1 || numValue > 12) {
        toast.warn("Period must be between 1 and 12.");
        // Keep the value but flag the error, or clamp it:
        finalValue = numValue < 1 ? 1 : numValue > 12 ? 12 : numValue;
      } else {
        finalValue = numValue;
      }
    }

    // 2. Standard normalization for checkboxes and Level No
    const checkboxFields = ["activeFl", "tcOrgFl", "tmOrgFl", "orgTopFl"];
    if (checkboxFields.includes(field)) {
      finalValue = value === true ? "Y" : "N";
    }

    if (field === "lvlNo") {
      finalValue = 1;
    }

    setData((prevData) =>
      prevData.map((item) => {
        const isTargetRow = item.tempId === id || item.orgId === id;
        if (isTargetRow) {
          const updatedRow = { ...item, [field]: finalValue, isDirty: true };

          // --- REAL-TIME LEVEL 1 SYNC ---
          // If we are editing a NEW organization, sync the ID length to Level 1
          if (updatedRow.isNew) {
            setLevelData((prevLevels) => {
              // Find existing Level 1 or create a default structure
              const existingLevel1 = prevLevels.find(
                (l) => Number(l.level) === 1,
              );

              const updatedLevel1 = {
                level: 1,
                // Keep manual description if user typed one, otherwise sync with Org Name
                description: "",
                // Set length to the number of characters in the ID (e.g., "112" -> 3)
                lenght: updatedRow.orgId ? updatedRow.orgId.length : 0,
                orgIdTop: updatedRow.orgId,
                isNew: true,
                isDirty: true,
              };

              // Replace the old Level 1 with this updated version
              const otherLevels = prevLevels.filter(
                (l) => Number(l.level) !== 1,
              );
              return [updatedLevel1, ...otherLevels];
            });
          }

          // Keep the form view updated
          if (
            activeGroupRow &&
            (activeGroupRow.tempId === item.tempId ||
              activeGroupRow.orgId === item.orgId)
          ) {
            setActiveGroupRow(updatedRow);
          }
          return updatedRow;
        }
        return item;
      }),
    );
  };

  const handleCopy = () => {
    if (!activeGroupRow && selectedRows.size === 0) {
      toast.warn("Select a record to copy first.");
      return;
    }

    // 1. Determine which rows to copy
    const rowsToCopy =
      selectedRows.size > 0
        ? data.filter((item) => selectedRows.has(item.orgId))
        : [activeGroupRow];

    // 2. Define Headers (Tab Separated)
    const headerLine = [
      "Org ID",
      "Org Name",
      "Abbrv",
      "Level",
      "Status",
      "Company",
      "Tax Entity",
      "Top Org",
      "TC Org",
      "ICR DF Acct",
      "ICR DF Ref1",
      "ICR DF Ref2",
      "ICR DT Acct",
      "ICR DT Ref1",
      "ICR DT Ref2",
    ].join("\t");

    // 3. Define Data Rows (Mapping keys from your handleAddOrg)
    const dataLines = rowsToCopy
      .map((row) =>
        [
          row.orgId || "",
          row.orgName || "",
          row.orgAbbrvCd || "",
          row.lvlNo || "",
          row.activeFl === "Y" ? "Active" : "Inactive",
          row.companyId || "",
          row.taxbleEntityId || "",
          row.orgTopFl || "N",
          row.tcOrgFl || "N",
          // ICR Fields
          row.icrAcctIdFr || "",
          row.icrRef1IdFr || "",
          row.icrRef2IdFr || "",
          row.icrAcctIdTo || "",
          row.icrRef1IdTo || "",
          row.icrRef2IdTo || "",
        ].join("\t"),
      )
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    // 4. Write to System Navigator
    navigator.clipboard
      .writeText(finalClipboardString)
      .then(() => {
        // Also update Internal State for the "Paste" button
        setClipboard(rowsToCopy);
        localStorage.setItem(
          "org_master_clipboard",
          JSON.stringify(rowsToCopy),
        );

        toast.success(`${rowsToCopy.length} record(s) copied with headers.`);
      })
      .catch(() => toast.error("Failed to copy to system clipboard."));
  };

  const handlePaste = () => {
    // 1. Retrieve from internal state or localStorage
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("org_master_clipboard"));

    if (!savedData) {
      return toast.warn("Clipboard is empty. Copy a record first.");
    }

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];

    // 2. Map into new Org objects with Identity Resets
    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `NEW_${Date.now()}_${index}`;

      return {
        ...row,
        orgId: "", // Reset ID so user provides a new unique one
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        orgName: row.orgName ? `${row.orgName}` : "",
        activeFl: row.activeFl || "Y",
        modifiedBy: "system",
      };
    });

    // 3. REMOVE EXISTING "NEW" ENTRIES
    // We filter out any row that is marked 'isNew' or has a temporary prefix
    const filterOutUnsaved = (prevList) =>
      prevList.filter(
        (item) => !item.isNew && !String(item.tempId || "").startsWith("NEW_"),
      );

    // 4. Update states: Replace the old "New" row with the "Pasted" rows
    setData((prev) => [...pastedRows, ...filterOutUnsaved(prev)]);
    // If you are using localData for the table view:
    // setLocalData((prev) => [...pastedRows, ...filterOutUnsaved(prev)]);

    // 5. Focus the first pasted row for the Form View
    if (pastedRows.length > 0) {
      const firstPasted = pastedRows[0];

      // Update active row/selection
      setActiveGroupRow(firstPasted);
      setSelectedRows(new Set([firstPasted.tempId]));

      // UI state updates
      setIsFormDirty(true);
      setCurrentIndex(0); // Move navigator to the top where the paste was inserted

      // Optional: if your component uses isFormView, ensure it's active
      // setIsFormView(true);
    }

    toast.success(
      `${pastedRows.length} record(s) pasted, replacing unsaved entries.`,
    );
  };

  const handleClear = () => {
    // 1. Check for unsaved work in Accounts
    const hasAccountNewRows = data.some((item) => item.isNew || item.tempId);
    const hasAccountEdits = isFormDirty || isTableDirty;

    // 2. Check for unsaved work in Levels
    // We check for rows marked 'isNew' or rows that are currently editable/modified
    const hasLevelChanges = levelData?.some(
      (lvl) => lvl.isNew || isMaxLevelEditable(lvl),
    );

    const hasUnsavedWork =
      hasAccountNewRows || hasAccountEdits || hasLevelChanges;

    if (!hasUnsavedWork) {
      toast.info("No changes Found");
      return;
    }

    // 3. Confirmation before losing work
    const confirmMsg =
      "Discard all unsaved changes (including Levels) and new records?";
    if (window.confirm(confirmMsg)) {
      // --- Clear Account Data ---
      // Remove temporary 'NEW' rows from account data
      setData((prev) => prev.filter((item) => !item.isNew && !item.tempId));

      // --- Clear Level Data ---
      if (levelData) {
        const resetLevels = levelData
          .filter((lvl) => !lvl.isNew) // Remove newly added level rows
          .map((lvl) => ({ ...lvl, isDirty: false })); // Reset dirty flags

        setLevelData((prev) => ({ ...prev, levels: resetLevels }));
      }

      // --- Reset Global State ---
      if (typeof handleSearch === "function") {
        handleSearch(); // Re-fetch from API to ensure clean state
      }

      setActiveGroupRow(null);
      setIsFormDirty(false);
      setIsTableDirty(false);

      // Phase 4: Clear draft on discard
      useDraftStore.getState().clearDraft("org-master");

      // Clear Clipboard Navigator
      setClipboard(null);
      localStorage.removeItem("org_clipboard");

      toast.info("Unsaved changes discarded and clipboard cleared.");
    }
  };

  const handleSaveOrganization = async () => {
    let res;
    const rowsToSave = data.filter((row) => row.isDirty || row.isNew);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    for (const row of rowsToSave) {
      const { fyCdFr, pdNoFr, fyCdTo, pdNoTo, orgId, orgName, balanceSheet } =
        row;
      const identifier = orgId || orgName || "New Record";
      const isNew = !!row.tempId || row.isNew;

      // 1. If FY From is entered, PD From is MANDATORY
      if (fyCdFr && !pdNoFr) {
        return toast.error(
          `In ${identifier}: Please enter Period Start for the selected Fiscal Year.`,
        );
      }

      // 2. If FY To is entered, PD To is MANDATORY
      if (fyCdTo && !pdNoTo) {
        return toast.error(
          `In ${identifier}: Please enter Period To End for the selected Fiscal Year.`,
        );
      }

      // 3. If "To" values exist, "From" values MUST exist (User can't set an end without a start)
      if ((fyCdTo || pdNoTo) && (!fyCdFr || !pdNoFr)) {
        return toast.error(
          `In ${identifier}: Please set the starting Fiscal Year and Period Start before setting the ending values End.`,
        );
      }

      if (!isNew && (!balanceSheet || String(balanceSheet).trim() === "")) {
        return toast.error(
          `In ${identifier}: Balance Sheet is required for existing organizations.`,
        );
      }
    }

    // for (const row of rowsToSave) {
    //   const validationErrors = validateOrgRow(row);

    //   if (validationErrors.length > 0) {
    //     // Alert the user and stop the save process
    //     alert(
    //       `Validation Error in Org ${row.orgId || "New Record"}:\n${validationErrors.join("\n")}`,
    //     );
    //     return;
    //   }
    // }

    setLoading(true);
    try {
      // 2. Process rows one by one
      for (const row of rowsToSave) {
        const isNew = !!row.tempId || row.isNew;
        const url = isNew
          ? `${backendUrl}/Orgnization/CreateOrg`
          : `${backendUrl}/Orgnization/${row.orgId}`;

        const payload = {
          orgId: row.orgId,
          orgName: row.orgName,
          orgAbbrvCd: row.orgAbbrvCd || "",
          lvlNo: row.lvlNo, // Always 1 for this screen
          activeFl: row.activeFl || "N",
          companyId: row.companyId || "1",
          taxbleEntityId:
            row.taxbleEntityId !== undefined && row.taxbleEntityId !== null
              ? String(row.taxbleEntityId)
              : "",
          fyCdFr:
            row.fyCdFr !== undefined && row.fyCdFr !== null
              ? String(row.fyCdFr)
              : "",
          pdNoFr:
            row.pdNoFr !== undefined && row.pdNoFr !== null ? row.pdNoFr : "",
          fyCdTo:
            row.fyCdTo !== undefined && row.fyCdTo !== null
              ? String(row.fyCdTo)
              : "",
          pdNoTo:
            row.pdNoTo !== undefined && row.pdNoTo !== null ? row.pdNoTo : "",
          orgTopFl: row.orgTopFl || "N",
          tcOrgFl: row.tcOrgFl || "N",
          balanceSheet:
            row.balanceSheet !== undefined && row.balanceSheet !== null
              ? String(row.balanceSheet)
              : "",
          icrAcctIdFr: row.icrAcctIdFr || "",
          icrRef1IdFr: row.icrRef1IdFr || "",
          icrRef2IdFr: row.icrRef2IdFr || "",
          icrAcctIdTo: row.icrAcctIdTo || "",
          icrRef1IdTo: row.icrRef1IdTo || "",
          icrRef2IdTo: row.icrRef2IdTo || "",
          modifiedBy: user?.name || "system",
        };

        // 3. Save the Organization
        if (isNew) {
          res = await api.post(url, payload);
          // 4. If it's a NEW entry, immediately save the Level 1
          // handleSaveLevel uses the levelData state we've been syncing in real-time
          // await handleSaveLevel(row.orgId);
        } else {
          // Just Update the Org
          await api.put(url, payload);
        }
      }

      toast.success("Saved successfully!");

      // 5. Cleanup flags
      setData((prevData) =>
        prevData.map((item) => ({
          ...item,
          isDirty: false,
          isNew: false,
          tempId: null,
        })),
      );

      setActiveGroupRow((prev) =>
        prev ? { ...prev, isDirty: false, isNew: false, tempId: null } : null,
      );

      setIsFormDirty(false);
      setIsTableDirty(false);
      useDraftStore.getState().clearDraft("org-master");
      handleSearch();

      return res?.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to save the entry";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const term = searchTerm.trim();
    const previousId = activeGroupRow?.orgId || activeGroupRow?.tempId;
    try {
      setIsLoading(true);

      // 1. Always reset selection first to prevent ghost highlights
      setSelectedRows(new Set());

      const url = `${backendUrl}/Orgnization/SearchOrganizations?search=${term}&startsWith=${term}&sortBy=OrgId&sortOrder=asc&page=${currentPage}&pageSize=${pageSize}`;
      const res = await api.get(url);

      // Create the fresh "New Entry" template
      const newId = `TEMP_${Date.now()}`;
      const newEntry = {
        ...initialOrgState,
        tempId: newId,
        isNew: true,
      };

      if (res.data && res.data.data && res.data.data.length > 0) {
        const fetchedData = res.data.data;

        setData(fetchedData);
        setAllData(fetchedData);

        const stillExists = fetchedData.find(
          (item) => item.orgId === previousId,
        );

        if (stillExists) {
          // Keep the old selection
          setActiveGroupRow(stillExists);
          setSelectedRows(new Set([stillExists.orgId]));

          // Update the index to the new position in the filtered list
          const newIndex = fetchedData.findIndex(
            (item) => item.orgId === previousId,
          );
          setCurrentIndex(newIndex);
        } else {
          // Fallback: Default to the first record if the old one isn't in the search results
          setActiveGroupRow(fetchedData[0]);
          setSelectedRows(new Set([fetchedData[0].orgId]));
          setCurrentIndex(0);
        }

        const total = res.data.totalRecords || 0;
        setTotalPages(Math.ceil(total / pageSize) || 1);
      } else {
        // Handle "No Results" by showing ONLY the new entry
        setData([newEntry]);
        if (!activeGroupRow) {
          setActiveGroupRow(newEntry);
        }
        setSelectedRows(new Set([newId]));
        setTotalPages(1);
        setCurrentIndex(0);

        if (term !== "") {
          toast.info("No organizations found. Starting a new entry.");
        }
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to get the organization data";
      toast.error(msg);

      // Recovery logic to prevent blank screens
      const recoverId = `TEMP_${Date.now()}`;
      const recoverRow = { ...initialOrgState, tempId: recoverId };
      setData([recoverRow]);
      setActiveGroupRow(recoverRow);
      setSelectedRows(new Set([recoverId]));
      setCurrentIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTrigger === 0) return;
    handleSearch();
  }, [currentPage, pageSize, searchTrigger]);

  const handleDelete = async () => {
    const selectionCount = selectedRows.size;
    if (selectionCount === 0) {
      toast.warn("Please select at least one record to delete.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to process ${selectionCount} record(s)?`,
      )
    )
      return;

    setIsDeleting(true);

    const idsToDeleteFromDB = [];
    const tempIdsToRemoveLocally = [];

    selectedRows.forEach((id) => {
      if (String(id).startsWith("TEMP_") || String(id).startsWith("NEW_")) {
        tempIdsToRemoveLocally.push(id);
      } else {
        idsToDeleteFromDB.push(id);
      }
    });

    try {
      // 1. Handle Database Deletions SEQUENTIALLY
      if (idsToDeleteFromDB.length > 0) {
        for (const id of idsToDeleteFromDB) {
          try {
            const res = await api.delete(
              `${backendUrl}/Orgnization/DeleteOrganization/${id}`,
            );

            // Check the response message from your backend to show the right toast
            // Adjust 'res.data' based on your actual API response structure
            const statusMessage = res.data?.message || res.data || "";

            if (statusMessage.toLowerCase().includes("deactivate")) {
              toast.info(`ID ${id}: Record deactivated successfully.`);
            } else {
              toast.success(`ID ${id}: Record deleted successfully.`);
            }
          } catch (individualError) {
            console.error(`Error processing ID ${id}:`, individualError);
            const message =
              individualError.response.data.message || individualError.message;
            toast.error(`Failed to process ID ${id}: ${message}`);
            // Optional: continue or break? Usually better to continue for other records
          }
        }
      }

      // 2. Update Local State
      // If your backend only DEACTIVATES, you might NOT want to remove it from local state yet.
      // However, if you want it gone from the UI regardless:
      setData((prevData) =>
        prevData.filter((item) => {
          const itemId = item.tempId || item.orgId;
          return !selectedRows.has(itemId);
        }),
      );

      // 3. Cleanup UI
      setSelectedRows(new Set());
      setActiveGroupRow(null);
      setIsFormDirty(false);

      // 4. Final Sync
      if (idsToDeleteFromDB.length > 0) {
        handleSearch();
      }
    } catch (error) {
      console.error("General Deletion Error:", error);
      toast.error("An error occurred during the deletion process.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowDoubleClick = (item) => {
    // 1. Set the active data row for the Form View
    setActiveGroupRow(item);

    // 2. Extract the ID and update the selection state
    const currentId = item.orgId;
    setSelectedRows(new Set([currentId]));

    // 3. Find and set the Index for the Toolbar counter
    // We use the 'data' array from your component's props/state
    const index = data.findIndex((row) => row.orgId === currentId);

    if (index !== -1) {
      setCurrentIndex(index);
    }

    // 4. Switch the UI from Table to Form
    setIsFormView(true);
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer icon={Building2} title="Organization">
        <Toolbar
          // 1. Clipboard State (for the Paste button to light up)
          clipboard={clipboard}
          rowKey={"orgId"}
          isFormView={isFormView}
          columns={ORG_COLUMNS}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleFindReplace={handleFindReplace}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          totalRecords={data.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          selectedRow={activeGroupRow}
          loading={isLoading || isLoadingLevels}
          actions={{
            onAdd: handleAddOrg,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleClear, // This handles the Discard/Reset logic
            onSave: handleMasterSave,
            onToggleView: () => {
              if (activeGroupRow === null) {
                setActiveGroupRow(data[0]);
                setSelectedRows((prev) => new Set([...prev, data[0]?.orgId]));
              }
              setIsFormView(!isFormView);
            },
          }}
        />

        {isFormView ? (
          <div className="space-y-3 p-1 py-2">
            <FormSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-2">
                <FormInput
                  key={activeGroupRow?.tempId || activeGroupRow?.orgId}
                  label="Organization"
                  required
                  value={activeGroupRow?.orgId || ""}
                  readOnly={!activeGroupRow?.isNew}
                  onChange={(e) =>
                    handleFieldChange(
                      activeGroupRow?.tempId || activeGroupRow?.orgId,
                      "orgId",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  label="Name"
                  required
                  value={activeGroupRow?.orgName || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      activeGroupRow?.tempId || activeGroupRow?.orgId,
                      "orgName",
                      e.target.value,
                    )
                  }
                />
              </div>
            </FormSection>

            <FormSection title="Organization Structures">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] p-2 gap-3 items-start">
                <div className="flex flex-col gap-3">
                  <FormSection title="Period Information">
                    <div className="flex flex-col gap-2 px-2 py-1">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] whitespace-nowrap w-[75px]">
                          Start Month
                        </label>
                        <div className="">
                          <FormInput
                            type="month"
                            // value={activeGroupRow?.fyCdFr || ""}
                            value={
                              activeGroupRow?.fyCdFr && activeGroupRow?.pdNoFr
                                ? `${activeGroupRow.fyCdFr}-${String(activeGroupRow.pdNoFr).padStart(2, "0")}`
                                : ""
                            }
                            onChange={(e) => {
                              const [year, month] = e.target.value.split("-");
                              handleFieldChange(
                                activeGroupRow?.tempId || activeGroupRow?.orgId,
                                "fyCdFr",
                                year,
                              );
                              handleFieldChange(
                                activeGroupRow?.tempId || activeGroupRow?.orgId,
                                "pdNoFr",
                                month,
                              );
                            }}
                          />
                        </div>
                        {/* <FormInput
                        label="Period Start"
                        type="number"
                        value={activeGroupRow?.pdNoFr || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            activeGroupRow?.tempId || activeGroupRow?.orgId,
                            "pdNoFr",
                            e.target.value,
                          )
                        }
                      /> */}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[10px] whitespace-nowrap w-[75px]">
                          End Month
                        </label>
                        <FormInput
                          type="month"
                          value={
                            activeGroupRow?.fyCdTo && activeGroupRow?.pdNoTo
                              ? `${activeGroupRow.fyCdTo}-${String(activeGroupRow.pdNoTo).padStart(2, "0")}`
                              : ""
                          }
                          onChange={(e) => {
                            const [year, month] = e.target.value.split("-");
                            handleFieldChange(
                              activeGroupRow?.tempId || activeGroupRow?.orgId,
                              "fyCdTo",
                              year,
                            );
                            handleFieldChange(
                              activeGroupRow?.tempId || activeGroupRow?.orgId,
                              "pdNoTo",
                              month,
                            );
                          }}
                        />
                        {/* <FormInput
                        label="Period End"
                        type="number"
                        value={activeGroupRow?.pdNoTo || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            activeGroupRow?.tempId || activeGroupRow?.orgId,
                            "pdNoTo",
                            e.target.value,
                          )
                        } */}
                        {/* /> */}
                      </div>
                    </div>
                  </FormSection>

                  <FormSection title="Export Options">
                    <div className="px-2 py-1">
                      <FormInput
                        label="Time Collection"
                        type="checkbox"
                        checked={activeGroupRow?.tcOrgFl === "Y"}
                        onChange={(e) =>
                          handleFieldChange(
                            activeGroupRow?.tempId || activeGroupRow?.orgId,
                            "tcOrgFl",
                            e.target.checked,
                          )
                        }
                      />
                    </div>
                  </FormSection>
                </div>

                <div className="h-full">
                  <FormSection title="Top Level Organization">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-2 py-5">
                      <div>
                        <FormInput
                          label="Abbreviation"
                          value={activeGroupRow?.orgAbbrvCd || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              activeGroupRow?.tempId || activeGroupRow?.orgId,
                              "orgAbbrvCd",
                              e.target.value,
                            )
                          }
                        />
                        <FormInput
                          label="No of Levels"
                          type="number"
                          value={activeGroupRow?.lvlNo || ""}
                          readOnly
                          onChange={(e) =>
                            handleFieldChange(
                              activeGroupRow?.tempId || activeGroupRow?.orgId,
                              "lvlNo",
                              e.target.value,
                            )
                          }
                        />

                        <div className="flex items-end gap-2">
                          {/* <div className='w-40'> */}
                          <FormInput
                            label="Company ID"
                            value={activeGroupRow?.companyId || "1"}
                            readOnly
                          />
                          {/* </div> */}

                          <div className="w-40">
                            <FormInput value={"Revolve"} readOnly />
                          </div>
                        </div>
                      </div>

                      <div>
                        <FormInput
                          label="Active"
                          type="checkbox"
                          checked={activeGroupRow?.activeFl === "Y"}
                          onChange={(e) =>
                            handleFieldChange(
                              activeGroupRow?.tempId || activeGroupRow?.orgId,
                              "activeFl",
                              e.target.checked,
                            )
                          }
                        />
                        <div className="w-64">
                          <FormInput
                            label="Balance Sheet Level"
                            type="number"
                            required
                            value={activeGroupRow?.balanceSheet || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                activeGroupRow?.tempId || activeGroupRow?.orgId,
                                "balanceSheet",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div className="flex items-end gap-2 px-1">
                          <FormSearchSelect
                            label="Taxable Entity ID *"
                            value={activeGroupRow?.taxbleEntityId}
                            searchTerm={searchTermTaxable}
                            setSearchTerm={setSearchTermTaxable}
                            options={taxableEntity.filter(
                              (t) =>
                                String(t.taxableId)
                                  .toLowerCase()
                                  .includes(searchTermTaxable.toLowerCase()) ||
                                t.taxableName
                                  .toLowerCase()
                                  .includes(searchTermTaxable.toLowerCase()),
                            )}
                            displayKey="taxableId"
                            secondaryKey="taxableName"
                            onSelect={(selectedOpt) => {
                              // 1. Capture the stable ID for the current row
                              const id =
                                activeGroupRow?.tempId || activeGroupRow?.orgId;

                              // 2. Update the ID field (number/string)
                              handleFieldChange(
                                id,
                                "taxbleEntityId",
                                selectedOpt.taxableId,
                              );

                              // 3. Update the Name field (string)
                              handleFieldChange(
                                id,
                                "taxbleEntityName",
                                selectedOpt.taxableName,
                              );
                            }}
                          />

                          {/* Read-only field to show the name associated with the ID */}
                          {/* <div className="w-40"> */}
                          <FormInput
                            value={activeGroupRow?.taxbleEntityName || ""}
                            readOnly
                            className="bg-gray-50 mt-1 border"
                          />
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  </FormSection>
                </div>
              </div>

              {/* <FormSection title="Export Options">
                  <div className="classname=p-2">
                    <FormInput
                      label="Time Collection"
                      type="checkbox"
                      checked={activeGroupRow?.tcOrgFl === "Y"}
                      onChange={(e) =>
                        handleFieldChange(
                          activeGroupRow?.tempId || activeGroupRow?.orgId,
                          "tcOrgFl",
                          e.target.checked,
                        )
                      }
                    />
                  </div>
                </FormSection> */}

              <div className="p-2">
                <FormSection title="Intercompany Receivable Accounts">
                  <div className="grid grid-cols-1 lg:grid-cols-[180px_repeat(3,minmax(0,1fr))] gap-x-2 gap-y-2 mb-2 items-center">
                    {/* Column Headers - Desktop Only */}
                    <div className="hidden lg:block"></div>
                    <div className="hidden lg:block text-center text-[10px]">
                      Account
                    </div>
                    <div className="hidden lg:block text-center text-[10px]">
                      Ref No 1
                    </div>
                    <div className="hidden lg:block text-center text-[10px]">
                      Ref No 2
                    </div>

                    {/* Due From Row */}
                    <div className="flex items-center h-full pt-1">
                      <span className="text-[10px]">Due From</span>
                    </div>
                    <div>
                      <FormSearchSelect
                        value={activeGroupRow?.icrAcctIdFr}
                        searchTerm={searchTermTaxable}
                        setSearchTerm={setSearchTermTaxable}
                        options={accounts.filter(
                          (t) =>
                            String(t.acctId)
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()) ||
                            t.acctName
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()),
                        )}
                        displayKey="acctId"
                        secondaryKey="acctName"
                        onSelect={(selectedOpt) => {
                          // 1. Capture the stable ID for the current row
                          const id =
                            activeGroupRow?.tempId || activeGroupRow?.orgId;

                          // 2. Update the ID field (number/string)
                          handleFieldChange(
                            id,
                            "icrAcctIdFr",
                            selectedOpt.acctId,
                          );
                        }}
                      />
                    </div>
                    <div>
                      <FormSearchSelect
                        value={activeGroupRow?.icrRef1IdFr}
                        searchTerm={searchTermTaxable}
                        setSearchTerm={setSearchTermTaxable}
                        options={refrences.filter(
                          (t) =>
                            String(t.refStrucId)
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()) ||
                            t.refStrucName
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()),
                        )}
                        displayKey="refStrucId"
                        secondaryKey="refStrucName"
                        onSelect={(selectedOpt) => {
                          // 1. Capture the stable ID for the current row
                          const id =
                            activeGroupRow?.tempId || activeGroupRow?.orgId;

                          // 2. Update the ID field (number/string)
                          handleFieldChange(
                            id,
                            "icrRef1IdFr",
                            selectedOpt.refStrucId,
                          );
                        }}
                      />
                    </div>
                    <div>
                      <FormSearchSelect
                        value={activeGroupRow?.icrRef2IdFr}
                        searchTerm={searchTermTaxable}
                        setSearchTerm={setSearchTermTaxable}
                        options={refrences.filter(
                          (t) =>
                            String(t.refStrucId)
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()) ||
                            t.refStrucName
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()),
                        )}
                        displayKey="refStrucId"
                        secondaryKey="refStrucName"
                        onSelect={(selectedOpt) => {
                          // 1. Capture the stable ID for the current row
                          const id =
                            activeGroupRow?.tempId || activeGroupRow?.orgId;

                          // 2. Update the ID field (number/string)
                          handleFieldChange(
                            id,
                            "icrRef2IdFr",
                            selectedOpt.refStrucId,
                          );
                        }}
                      />
                    </div>

                    {/* Due To Row */}
                    <div className="flex items-center h-full pt-1">
                      <span className="text-[10px] font-semibold text-gray-700">
                        Due To
                      </span>
                    </div>
                    <div>
                      <FormSearchSelect
                        value={activeGroupRow?.icrAcctIdTo}
                        searchTerm={searchTermTaxable}
                        setSearchTerm={setSearchTermTaxable}
                        options={accounts.filter(
                          (t) =>
                            String(t.acctId)
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()) ||
                            t.acctName
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()),
                        )}
                        displayKey="acctId"
                        secondaryKey="acctName"
                        onSelect={(selectedOpt) => {
                          // 1. Capture the stable ID for the current row
                          const id =
                            activeGroupRow?.tempId || activeGroupRow?.orgId;

                          // 2. Update the ID field (number/string)
                          handleFieldChange(
                            id,
                            "icrAcctIdTo",
                            selectedOpt.acctId,
                          );
                        }}
                      />
                    </div>
                    <div>
                      <FormSearchSelect
                        value={activeGroupRow?.icrRef1IdTo}
                        searchTerm={searchTermTaxable}
                        setSearchTerm={setSearchTermTaxable}
                        options={refrences.filter(
                          (t) =>
                            String(t.refStrucId)
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()) ||
                            t.refStrucName
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()),
                        )}
                        displayKey="refStrucId"
                        secondaryKey="refStrucName"
                        onSelect={(selectedOpt) => {
                          // 1. Capture the stable ID for the current row
                          const id =
                            activeGroupRow?.tempId || activeGroupRow?.orgId;

                          // 2. Update the ID field (number/string)
                          handleFieldChange(
                            id,
                            "icrRef1IdTo",
                            selectedOpt.refStrucId,
                          );
                        }}
                      />
                    </div>
                    <div>
                      <FormSearchSelect
                        value={activeGroupRow?.icrRef2IdTo}
                        searchTerm={searchTermTaxable}
                        setSearchTerm={setSearchTermTaxable}
                        options={refrences.filter(
                          (t) =>
                            String(t.refStrucId)
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()) ||
                            t.refStrucName
                              .toLowerCase()
                              .includes(searchTermTaxable.toLowerCase()),
                        )}
                        displayKey="refStrucId"
                        secondaryKey="refStrucName"
                        onSelect={(selectedOpt) => {
                          // 1. Capture the stable ID for the current row
                          const id =
                            activeGroupRow?.tempId || activeGroupRow?.orgId;

                          // 2. Update the ID field (number/string)
                          handleFieldChange(
                            id,
                            "icrRef2IdTo",
                            selectedOpt.refStrucId,
                          );
                        }}
                      />
                    </div>
                  </div>
                </FormSection>
              </div>
            </FormSection>

            <ActionDetailButton
              label="Link Account"
              onClick={() => setAcctOrgLink((prev) => !prev)}
              isActive={acctorgLink}
              disabled={isAnyLoading}
            />
          </div>
        ) : (
          <>
            <ReusableTable
              data={data}
              rowKey={"orgId"}
              columns={myColumns}
              doubleclick={handleRowDoubleClick}
              selectedRows={selectedRows}
              onRowSelect={(row) => {
                const id = String(row.tempId || row.orgId);

                setSelectedRows((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(id)) {
                    newSet.delete(id);
                    if (newSet.size > 0) {
                      const remainingIds = Array.from(newSet);
                      const lastId = remainingIds[remainingIds.length - 1];
                      const lastRow = data.find(
                        (item) => String(item.tempId || item.orgId) === lastId,
                      );
                      setActiveGroupRow(lastRow || null);
                      const newIdx = data.findIndex(
                        (item) => String(item.tempId || item.orgId) === lastId,
                      );
                      if (newIdx !== -1) setCurrentIndex(newIdx);
                    } else {
                      // No rows left selected
                      setActiveGroupRow(null);
                      setCurrentIndex(0);
                    }
                  } else {
                    newSet.add(id);
                    setActiveGroupRow(row);
                    const newIdx = data.findIndex(
                      (item) => String(item.tempId || item.orgId) === id,
                    );
                    if (newIdx !== -1) setCurrentIndex(newIdx);
                  }
                  return newSet;
                });
              }}
              onFieldChange={handleFieldChange}
            />

            <Pagination
              totalPages={totalPages}
              pageSize={pageSize}
              setPageSize={setPageSize}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              goToValue={goToValue}
              setGoToValue={setGoToValue}
            />
          </>
        )}
      </MainContainer>

      {acctorgLink && (
        <SecondaryContainer
          handleClose={() => setAcctOrgLink(false)}
          title="Link To Accounts"
        >
          <div className="flex items-center justify-start py-1 mb-2">
            <FormSection title="Account Details" className="w-[80%]">
              <div className="flex  gap-x-4">
                <FormInput
                  label="Acctount ID"
                  value={AcctDetail.acct || ""}
                  onChange={(e) =>
                    setAcctDetail({
                      ...AcctDetail,
                      acct: e.target.value,
                    })
                  }
                />
                <FormInput
                  label="Account Name"
                  value={AcctDetail.acctName || ""}
                  onChange={(e) =>
                    setAcctDetail({
                      ...AcctDetail,
                      acctName: e.target.value,
                    })
                  }
                />
              </div>
            </FormSection>

            <ActionDetailButton
              label="Link Accts"
              onClick={handelLinkAcct}
              disabled={isAnyLoading}
            />
          </div>
          <div className="flex items-center justify-start">
            <FormSection title="Wildcard Options" className="w-[90%]">
              <div className="font-[400] text-[10px] text-black space-y-2">
                <p>Use % or _ as wildcard. Examples are shown below:</p>

                <div className="grid grid-cols-[100px_20px_1fr] gap-y-1 items-center">
                  {/* Row 1 */}
                  <span className="font-[400] text-black text-[10px]">
                    %123
                  </span>
                  <span>=</span>
                  <span className="font-light text-gray-800 text-[10px]">
                    Ends with 123.
                  </span>

                  {/* Row 2 */}
                  <span className="font-[400] text-black text-[10px]">
                    123%
                  </span>
                  <span>=</span>
                  <span className="font-light text-gray-800 text-[10px]">
                    Begins with 123.
                  </span>

                  {/* Row 3 */}
                  <span className="font-[400] text-black text-[10px]">
                    %123%
                  </span>
                  <span>=</span>
                  <span className="font-light text-gray-800 text-[10px]">
                    Contains 123.
                  </span>

                  {/* Row 4 */}
                  <span className="font-[400] text-black text-[10px]">1_3</span>
                  <span>=</span>
                  <span className="font-light text-gray-800 text-[10px]">
                    Begins with 1 and ends with 3 and is 3 characters long.
                  </span>
                </div>
              </div>
            </FormSection>
          </div>
        </SecondaryContainer>
      )}

      {/* {!activeGroupRow?.isNew && ( */}
      {activeGroupRow?.orgId?.split(".").length === 1 && (
        <SecondaryContainer title="Org Level">
          <div className="w-full flex justify-end gap-x-2 pb-1">
            <ActionButton
              icon={Plus}
              onClick={handleAddLevel}
              disabled={isAnyLoading}
            />
            <ActionButton
              icon={Trash2}
              onClick={handleDeleteSelectedLevels}
              disabled={isAnyLoading}
            />
            {/* <ActionButton
            icon={Save}
            onClick={() => handleSaveLevel(null)}
            disabled={isAnyLoading}
          /> */}
          </div>

          <div className="overflow-x-auto max-h-[35vh]">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-12"></th>
                  <th className="th-thead">Level</th>
                  <th className="th-thead">Description</th>
                  <th className="th-thead">Length</th>
                </tr>
              </thead>

              <tbody className="tbody">
                {Array.isArray(levelData) &&
                  levelData?.map((lvl) => {
                    const isEditable = isMaxLevelEditable(lvl);
                    const isSelected =
                      selectedLevels?.includes(lvl.level) || false;
                    return (
                      <tr
                        key={lvl.level}
                        className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}`}
                      >
                        <td className="tbody-td text-center">
                          <input
                            type="checkbox"
                            // Checkif the current level number exists in your selected collection
                            checked={isSelected}
                            onChange={() => {
                              setSelectedLevels((prev) => {
                                // 1. Check if the level is already selected
                                if (prev.includes(lvl.level)) {
                                  // 2. If it exists, filter it out (unselect)
                                  return prev.filter((id) => id !== lvl.level);
                                } else {
                                  // 3. If it doesn't exist, add it to the list (select)
                                  return [...prev, lvl.level];
                                }
                              });
                            }}
                          />
                        </td>
                        <td className="tbody-td">
                          <input
                            className="td-input bg-gray-100"
                            value={lvl.level}
                            readOnly
                          />
                        </td>
                        <td className="tbody-td">
                          <input
                            className={`td-input ${!isEditable && !lvl.isNew ? "bg-gray-50 text-gray-400" : "bg-white"}`}
                            value={lvl.description}
                            readOnly={!isEditable && !lvl.isNew}
                            onChange={(e) => {
                              handleLevelFieldChange(
                                lvl.level,
                                "description",
                                e.target.value,
                              );
                            }}
                          />
                        </td>
                        <td className="tbody-td">
                          <input
                            type="number"
                            className={`td-input ${!isEditable && !lvl.isNew ? "bg-gray-50 text-gray-400" : "bg-white"}`}
                            value={lvl.lenght}
                            readOnly={!isEditable && !lvl.isNew}
                            onChange={(e) => {
                              handleLevelFieldChange(
                                lvl.level,
                                "lenght",
                                e.target.value,
                              );
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </SecondaryContainer>
      )}
      {/* )} */}
      {/* </SecondaryContainer> */}
    </div>
  );
};

export default OrgMaster;
