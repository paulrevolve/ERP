import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import { Database, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import api from "../utils/api";
import { backendUrl } from "./config";

import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";

// --- Static Initializers & Configurations ---
const initialHeaderState = {
  refStrucId: "",
  refStrucName: "",
  refDataEntryFl: "N",
  refStrucTopFl: "N", // Mapped to Reference Heading check logic
  sRefEntryCd: "",
  modifiedBy: "SystemUser",
  levels: [],
};

const baseColumns = [
  {
    id: "refStrucId",
    label: "Reference ID *",
    key: "refStrucId",
    allowReplace: false,
    readOnlyIfExisting: true,
  },
  {
    id: "refStrucName",
    label: "Name *",
    key: "refStrucName",
    allowReplace: true,
  },
  {
    id: "refDataEntryFl",
    label: "Use In Data Entry",
    key: "refDataEntryFl",
    type: "flag",
    allowReplace: true,
  },
  {
    id: "sRefEntryCd",
    label: "Reference Heading",
    key: "sRefEntryCd",
    type: "select",
    options: [
      { label: "Ref 1", value: "1" },
      { label: "Ref 2", value: "2" },
      { label: "Ref 3", value: "3" },
      { label: "Ref 4", value: "4" },
    ],
    optionLabel: "label",
    optionValue: "value",
    allowReplace: true,
  },
];

// levelColumns will be dynamically generated inside the component based on total levels.

const getCompanyId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user?.companyId || "1";
  } catch (e) {
    return "1";
  }
};

const ManageReference = () => {
  // --- States ---
  const [references, setReferences] = useState([]);
  const [masterReferences, setMasterReferences] = useState([]);
  const [isFormView, setIsFormView] = useState(false);
  const [isLevelFormView, setIsLevelFormView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedLevelIds, setSelectedLevelIds] = useState(new Set());
  const [deletedLevelKeys, setDeletedLevelKeys] = useState([]);
  const [clipboard, setClipboard] = useState([]);
  const [selectedReference, setSelectedReference] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const isFetched = useRef(false);

  const handleToggleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  }, []);

  const columns = useMemo(() => {
    return baseColumns.map((col) => {
      if (col.key === "refStrucId") {
        return {
          ...col,
          textLabel: col.label,
          label: (
            <div
              className="flex items-center gap-1 cursor-pointer select-none group"
              onClick={() => handleToggleSort(col.key)}
              title="Sort by Reference ID"
            >
              <span className="group-hover:text-[#17414d] transition-colors">
                {col.label}
              </span>
              {sortConfig.key === col.key ? (
                sortConfig.direction === "asc" ? (
                  <ArrowUp
                    size={14}
                    className="text-[#17414d] transition-colors"
                  />
                ) : (
                  <ArrowDown
                    size={14}
                    className="text-[#17414d] transition-colors"
                  />
                )
              ) : (
                <ArrowUpDown
                  size={14}
                  className="text-gray-400 group-hover:text-gray-500 transition-colors"
                />
              )}
            </div>
          ),
        };
      }
      return { ...col, textLabel: col.label };
    });
  }, [sortConfig, handleToggleSort]);

  const sortedReferences = useMemo(() => {
    let sortableItems = [...references];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aVal = String(a[sortConfig.key] || "").toLowerCase();
        const bVal = String(b[sortConfig.key] || "").toLowerCase();
        const cmp = aVal.localeCompare(bVal, undefined, {
          numeric: true,
          sensitivity: "base",
        });
        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }
    return sortableItems;
  }, [references, sortConfig]);

  // --- Dynamic Columns for Levels ---
  const isInheritingLevels = useMemo(() => {
    if (!selectedReference?.refStrucId) return false;
    const parts = selectedReference.refStrucId
      .split(".")
      .filter((p) => p.length > 0);
    if (parts.length > 1) {
      const rootId = parts[0];
      return references.some(
        (r) =>
          r.refStrucId === rootId &&
          r.refStrucId !== selectedReference.refStrucId,
      );
    }
    return false;
  }, [selectedReference?.refStrucId, references]);

  const levelColumns = useMemo(() => {
    const lvls = selectedReference?.levels || [];
    // Find the maximum level number (so we know which one is the very last level)
    const maxLvlNo =
      lvls.length > 0 ? Math.max(...lvls.map((l) => Number(l.lvlNo))) : 0;

    return [
      {
        id: "lvlNo",
        label: "Level No",
        key: "lvlNo",
        type: "number",
        width: "w-20",
        allowReplace: false,
        isDisabled: (item) =>
          isInheritingLevels ||
          (item.count || 0) > 0 ||
          Number(item.lvlNo) !== maxLvlNo,
      },
      {
        id: "refStrucName",
        label: "Level Name",
        key: "refStrucName",
        type: "text",
        allowReplace: true,
        isDisabled: (item) => isInheritingLevels,
      },
      {
        id: "length",
        label: "Length",
        key: "length",
        type: "number",
        width: "w-24",
        allowReplace: true,
        isDisabled: (item) =>
          isInheritingLevels ||
          (item.count || 0) > 0 ||
          Number(item.lvlNo) !== maxLvlNo,
      },
    ];
  }, [selectedReference?.levels, isInheritingLevels]);

  // --- API Integrations ---
  const fetchReferences = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`${backendUrl}/api/RefStruc`);
      const mappedData = (response.data || [])
        .map((ref) => ({
          ...ref,
          id: String(ref.refStrucId),
          isDirty: false,
        }))
        .sort((a, b) =>
          String(a.refStrucId || "").localeCompare(
            String(b.refStrucId || ""),
            undefined,
            { numeric: true, sensitivity: "base" },
          ),
        );
      setReferences(mappedData);
      setMasterReferences(mappedData);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch reference structures",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFetched.current) {
      isFetched.current = true;
      fetchReferences();
    }
  }, [fetchReferences]);

  // --- Handlers ---
  const handleAdd = useCallback(() => {
    const newRef = {
      ...initialHeaderState,
      tempId: `NEW_${Date.now()}`,
      id: `NEW_${Date.now()}`,
      isDirty: true,
    };
    setReferences((prev) => [newRef, ...prev]);
    setSelectedReference(newRef);
  }, []);

  const handleSave = useCallback(async () => {
    // Both header and level dirty checks
    // FIX: Only validate the active record if in form view, avoiding unrelated errors
    const dirtyRecords =
      isFormView && selectedReference?.id
        ? references.filter(
            (r) =>
              r.id === selectedReference.id && (r.isDirty || r.hasDirtyLevels),
          )
        : references.filter((r) => r.isDirty || r.hasDirtyLevels);

    if (dirtyRecords.length === 0) {
      return toast.info("Nothing to save.");
    }

    // Phase 0: Validate Missing Fields explicitly
    for (const record of dirtyRecords) {
      const missingFields = [];
      if (!record.refStrucId || String(record.refStrucId).trim() === "")
        missingFields.push("Reference ID");
      if (!record.refStrucName || String(record.refStrucName).trim() === "")
        missingFields.push("Name");

      if (missingFields.length > 0) {
        toast.error(
          `Please provide ${missingFields.join(" and ")} before saving.`,
        );
        return;
      }

      if (record.hasDirtyLevels && record.levels) {
        for (const lvl of record.levels) {
          if (!lvl.refStrucName || String(lvl.refStrucName).trim() === "") {
            toast.error(
              `Please provide Level Name for Level No ${lvl.lvlNo} on Reference ${record.refStrucId}`,
            );
            return;
          }
        }
      }
    }

    // --- Strict Client-Side Length Validation for Reference Structure ---
    for (const record of dirtyRecords) {
      // ONLY validate segment structures for brand NEW or PASTED records!
      // Existing records might have legacy/inconsistent data. Updating a checkbox shouldn't be blocked by strict rules.
      const isNewRecord =
        String(record.id).startsWith("NEW_") ||
        String(record.id).startsWith("PST_");
      if (!isNewRecord) {
        continue;
      }

      const refStr = String(record.refStrucId || "");
      if (refStr) {
        const parts = refStr.split(".").filter((p) => p.length > 0);
        let lvls = record.levels || [];

        // If it's a child reference (e.g., 10.12), inherit levels from root (10) for validation
        if (parts.length > 1) {
          const rootId = parts[0];
          const rootParent = references.find(
            (r) =>
              r.refStrucId === rootId && r.refStrucId !== record.refStrucId,
          );
          if (rootParent) {
            if (rootParent.levelsFetched && rootParent.levels) {
              lvls = rootParent.levels;
            } else {
              // Missing levels? Fetch them instantly for validation
              try {
                const companyId = getCompanyId();
                const res = await api.get(
                  `${backendUrl}/api/RefStruc/GetAllLevels/${rootId}/${companyId}`,
                );
                if (res.data) {
                  lvls = res.data.map((l, idx) => ({
                    ...l,
                    lvlNo: l.lvlNo || idx + 1,
                    length: l.idSegLenNo || l.length || 0,
                  }));
                }
              } catch (e) {
                console.error(
                  "Failed fetching parent levels for validation",
                  e,
                );
              }
            }
          }
        }

        for (let i = 0; i < parts.length; i++) {
          const partLength = parts[i].length;
          const configuredLevel = lvls.find((l) => Number(l.lvlNo) === i + 1);

          if (
            configuredLevel &&
            Number(configuredLevel.length) > 0 &&
            Number(configuredLevel.length) !== partLength
          ) {
            toast.error(
              `Validation Error on '${refStr}': Segment ${i + 1} ('${parts[i]}') has length ${partLength}, but Level ${i + 1} is strictly configured for length ${configuredLevel.length}.`,
            );
            return; // Prevent Save!
          }
        }

        // Check if user provided more segments than defined levels
        if (parts.length > lvls.length && lvls.length > 0) {
          toast.error(
            `Validation Error on '${refStr}': Supplied ${parts.length} segments but only ${lvls.length} levels are defined.`,
          );
          return;
        }
      }
    }

    setLoading(true);

    // Process concurrently using Promise.allSettled
    const promises = dirtyRecords.map((record) => {
      const isNew =
        String(record.id).startsWith("NEW_") ||
        String(record.id).startsWith("PST_") ||
        !masterReferences.some((r) => r.refStrucId === record.refStrucId);

      // OPTIMIZATION: If ONLY levels changed on an existing record, skip parent POST/PUT gracefully
      if (!isNew && !record.isDirty && record.hasDirtyLevels) {
        return Promise.resolve({
          id: record.id,
          payload: record,
          skipParent: true,
        });
      }

      const payload = { ...record };
      const uiKeys = ["tempId", "isDirty", "levels", "id", "hasDirtyLevels"];
      uiKeys.forEach((key) => delete payload[key]);
      payload.companyId = getCompanyId(); // Always use dynamic companyId from login

      const url = isNew
        ? `${backendUrl}/api/RefStruc`
        : `${backendUrl}/api/RefStruc/${payload.refStrucId}/${payload.companyId}`;

      return api[isNew ? "post" : "put"](url, payload).then(() => ({
        id: record.id,
        payload,
      }));
    });

    try {
      const parentResults = await Promise.allSettled(promises);
      let successCount = 0;
      let errorCount = 0;
      const successfulUpdates = new Map();

      const levelPromises = [];

      parentResults.forEach((result) => {
        if (result.status === "fulfilled") {
          const recId = result.value.id;

          if (!result.value.skipParent) {
            successCount++;
            successfulUpdates.set(recId, result.value.payload);
          }

          const originalRecord = dirtyRecords.find((dr) => dr.id === recId);
          if (originalRecord && originalRecord.levels) {
            const companyId = originalRecord.companyId || getCompanyId();
            const refStrucId = result.value.payload.refStrucId;

            originalRecord.levels.forEach((lvl) => {
              if (lvl.isDirty) {
                if (String(lvl.tempId).startsWith("LVL_")) {
                  levelPromises.push(
                    api
                      .post(`${backendUrl}/api/RefStruc/add-level`, {
                        refStrucIdTop: refStrucId,
                        companyId: companyId,
                        lvlNo: lvl.lvlNo,
                        idSegLenNo: lvl.length,
                        refStrucLvlDesc: lvl.refStrucName,
                        description: lvl.refStrucName,
                        modifiedBy: "SystemUser",
                      })
                      .then(() => ({
                        type: "add",
                        recId,
                        tempId: lvl.tempId,
                        lvlNo: lvl.lvlNo,
                      })),
                  );
                } else if (String(lvl.tempId).startsWith("SERVER_")) {
                  const lvlKey = lvl.lvlKey || lvl.lvlNo;
                  levelPromises.push(
                    api
                      .put(
                        `${backendUrl}/api/RefStruc/UpdateLevel/${refStrucId}/${companyId}/${lvlKey}`,
                        {
                          newLvlNo: lvl.lvlNo,
                          idSegLenNo: lvl.length,
                          refStrucLvlDesc: lvl.refStrucName,
                          description: lvl.refStrucName,
                          modifiedBy: "SystemUser",
                        },
                      )
                      .then(() => ({
                        type: "update",
                        recId,
                        tempId: lvl.tempId,
                      })),
                  );
                }
              }
            });
          }
        } else {
          console.error(`Failed to save record:`, result.reason);
          const apiMsg =
            result.reason?.response?.data?.message ||
            result.reason?.response?.data ||
            "Failed to save record.";
          toast.error(
            typeof apiMsg === "string" ? apiMsg : "Failed to save record.",
          );
          errorCount++;
        }
      });

      let lvlSuccessCount = 0;
      let lvlErrorCount = 0;
      let successfulLevelSaves = [];

      if (levelPromises.length > 0) {
        const lvlResults = await Promise.allSettled(levelPromises);
        lvlResults.forEach((res) => {
          if (res.status === "fulfilled") {
            lvlSuccessCount++;
            if (res.value.type !== "delete") {
              successfulLevelSaves.push(res.value);
            }
          } else {
            lvlErrorCount++;
            console.error("Level save failed:", res.reason);
            const apiMsg =
              res.reason?.response?.data?.message ||
              res.reason?.response?.data ||
              "Level save failed.";
            toast.error(
              typeof apiMsg === "string" ? apiMsg : "Level save failed.",
            );
          }
        });
      }

      if (successCount > 0 || lvlSuccessCount > 0) {
        if (successCount > 0)
          toast.success(`Successfully saved ${successCount} record(s).`);
        if (lvlSuccessCount > 0)
          toast.success(
            `Successfully saved ${lvlSuccessCount} level action(s).`,
          );

        setSortConfig({ key: null, direction: null }); // Ensure new items show at the top

        setReferences((prev) => {
          const handled = [];
          const unhandled = [];

          prev.forEach((rec) => {
            const up = successfulUpdates.get(rec.id);

            let updatedLevels = rec.levels || [];
            updatedLevels = updatedLevels.map((lvl) => {
              const matched = successfulLevelSaves.find(
                (s) => s.recId === rec.id && s.tempId === lvl.tempId,
              );
              if (matched) {
                return {
                  ...lvl,
                  isDirty: false,
                  tempId:
                    matched.type === "add"
                      ? `SERVER_${Date.now()}_${matched.lvlNo}`
                      : lvl.tempId,
                };
              }
              return lvl;
            });

            let finalRec = rec;
            if (up) {
              finalRec = {
                ...rec,
                ...up,
                levels: updatedLevels,
                isDirty: false,
                hasDirtyLevels: updatedLevels.some((l) => l.isDirty),
                id: String(up.refStrucId),
              };
            } else {
              finalRec = {
                ...rec,
                levels: updatedLevels,
                hasDirtyLevels: updatedLevels.some((l) => l.isDirty),
              };
            }

            if (
              successfulUpdates.has(rec.id) ||
              successfulLevelSaves.some(
                (s) => s.recId === rec.id || s.recId === rec.tempId,
              )
            ) {
              handled.push(finalRec);
            } else {
              unhandled.push(finalRec);
            }
          });

          return [...handled, ...unhandled];
        });

        setSelectedReference((prev) => {
          if (prev?.id && successfulUpdates.has(prev.id)) {
            const up = successfulUpdates.get(prev.id);
            let updatedLevels = prev.levels || [];
            updatedLevels = updatedLevels.map((lvl) => {
              const matched = successfulLevelSaves.find(
                (s) => s.recId === prev.id && s.tempId === lvl.tempId,
              );
              if (matched) {
                return {
                  ...lvl,
                  isDirty: false,
                  tempId:
                    matched.type === "add"
                      ? `SERVER_${Date.now()}_${matched.lvlNo}`
                      : lvl.tempId,
                };
              }
              return lvl;
            });
            return {
              ...prev,
              ...up,
              levels: updatedLevels,
              isDirty: false,
              hasDirtyLevels: updatedLevels.some((l) => l.isDirty),
              id: String(up.refStrucId),
            };
          } else if (
            successfulLevelSaves.some(
              (s) => s.recId === prev?.id || s.recId === prev?.tempId,
            )
          ) {
            let updatedLevels = prev.levels || [];
            updatedLevels = updatedLevels.map((lvl) => {
              const matched = successfulLevelSaves.find(
                (s) =>
                  (s.recId === prev.id || s.recId === prev.tempId) &&
                  s.tempId === lvl.tempId,
              );
              if (matched) {
                return {
                  ...lvl,
                  isDirty: false,
                  tempId:
                    matched.type === "add"
                      ? `SERVER_${Date.now()}_${matched.lvlNo}`
                      : lvl.tempId,
                };
              }
              return lvl;
            });
            return {
              ...prev,
              levels: updatedLevels,
              hasDirtyLevels: updatedLevels.some((l) => l.isDirty),
            };
          }
          return prev;
        });

        setMasterReferences((prev) => {
          const newMaster = [...prev];
          successfulUpdates.forEach((up, originalId) => {
            const idx = newMaster.findIndex(
              (m) => m.refStrucId === up.refStrucId,
            );
            if (idx !== -1)
              newMaster[idx] = {
                ...up,
                id: String(up.refStrucId),
                isDirty: false,
              };
            else
              newMaster.push({
                ...up,
                id: String(up.refStrucId),
                isDirty: false,
              });
          });
          return newMaster;
        });
      }
    } catch (globalError) {
      const apiMsg =
        globalError.response?.data?.message ||
        globalError.response?.data ||
        "An unexpected error occurred during bulk save.";
      toast.error(
        typeof apiMsg === "string"
          ? apiMsg
          : "An unexpected error occurred during bulk save.",
      );
    } finally {
      setLoading(false);
    }
  }, [references, masterReferences, deletedLevelKeys]);

  const handleDelete = useCallback(async () => {
    const recordsToDelete = isFormView
      ? [selectedReference]
      : references.filter((ref) =>
          selectedIds.has(String(ref.tempId || ref.id)),
        );

    if (recordsToDelete.length === 0 || !recordsToDelete[0]?.refStrucId) {
      return toast.warning("Please select a row first.");
    }

    const confirmMsg =
      recordsToDelete.length === 1
        ? `Are you sure you want to delete Reference ${recordsToDelete[0].refStrucId}?`
        : `Are you sure you want to delete ${recordsToDelete.length} selected records?`;

    if (!window.confirm(confirmMsg)) return;

    setLoading(true);

    const promises = recordsToDelete.map((record) => {
      const { refStrucId } = record;
      const finalCompanyId = getCompanyId();
      return api
        .delete(`${backendUrl}/api/RefStruc/${refStrucId}/${finalCompanyId}`)
        .then(() => record.id);
    });

    try {
      const results = await Promise.allSettled(promises);
      let successCount = 0;
      let errorCount = 0;
      const successfulIds = new Set();

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          successCount++;
          successfulIds.add(result.value);
        } else {
          console.error("Delete Error:", result.reason);
          errorCount++;
        }
      });

      if (successCount > 0) {
        toast.success(`Deleted ${successCount} record(s) successfully`);

        // Inline state update to avoid multiple GET requests
        setReferences((prev) => prev.filter((r) => !successfulIds.has(r.id)));
        setMasterReferences((prev) =>
          prev.filter((r) => !successfulIds.has(r.id)),
        );

        setSelectedIds((prev) => {
          const fresh = new Set(prev);
          successfulIds.forEach((id) => fresh.delete(id));
          return fresh;
        });
      }

      if (errorCount > 0)
        toast.error(`Failed to delete ${errorCount} record(s).`);

      setSelectedReference({});
      if (isFormView) setIsFormView(false);
    } catch (error) {
      toast.error("Delete operation failed");
    } finally {
      setLoading(false);
    }
  }, [isFormView, selectedReference, references, selectedIds]);

  const handleClear = useCallback(() => {
    setSelectedReference({});
    setSelectedIds(new Set());
    // Directly revert to master data instead of GET api call
    setReferences(masterReferences.map((r) => ({ ...r })));
  }, [masterReferences]);

  const handleCopy = useCallback(() => {
    const selectedRows = references.filter((r) =>
      selectedIds.has(String(r.tempId || r.id)),
    );
    if (selectedRows.length === 0) return toast.warn("Select rows to copy");

    setClipboard(selectedRows);

    const header = columns.map((col) => col.textLabel || col.label).join("\t");
    const rows = selectedRows
      .map((row) => columns.map((col) => row[col.key] || "").join("\t"))
      .join("\n");

    navigator.clipboard.writeText(`${header}\n${rows}`);
    toast.success(`${selectedRows.length} row(s) copied`);
  }, [references, selectedIds, columns]);

  const handlePaste = useCallback(() => {
    if (clipboard.length) {
      const pastedEntries = clipboard.map((row, i) => {
        const pId = `PST_${Date.now()}_${i}`;
        // Deep copy levels so they are treated as brand new levels under the new header
        const newLevels = (row.levels || []).map((lvl, lIndex) => ({
          ...lvl,
          tempId: `LVL_${Date.now()}_${i}_${lIndex}`,
          count: 0,
          isDirty: true,
          lvlKey: undefined,
        }));

        return {
          ...row,
          refStrucId: "",
          id: pId,
          tempId: pId,
          isDirty: true,
          levels: newLevels,
          hasDirtyLevels: newLevels.length > 0,
        };
      });

      setReferences((prev) => [...pastedEntries, ...prev]);
      setSelectedReference(pastedEntries[0]);
      toast.success(`Pasted ${pastedEntries.length} row(s)`);
    }
  }, [clipboard]);

  const handleFindReplaceReference = useCallback(
    (config, isReplaceMode) => {
      const { column, findYear, replaceValue, booleanMode } = config;

      if (!column) return toast.warn("Please select a column first.");

      if (!isReplaceMode) {
        if (!findYear) return toast.warn("Enter a search term.");
        const foundIndex = references.findIndex((r) =>
          String(r[column] || "")
            .toLowerCase()
            .includes(findYear.toLowerCase()),
        );

        if (foundIndex !== -1) {
          const foundRow = references[foundIndex];
          setSelectedReference(foundRow);
          setSelectedIds(new Set([String(foundRow.id)]));
          toast.info(`Match found at row ${foundIndex + 1}`);
        } else {
          toast.error("No match found.");
        }
        return;
      }

      if (!window.confirm("Apply bulk update to all matching records?")) return;

      const columnDef = columns.find(
        (c) => c.id === column || c.key === column,
      );
      const isFlag = columnDef?.type === "flag";

      setReferences((prev) => {
        let updatedCount = 0;

        const newData = prev.map((ref) => {
          const rawValue = ref[column];
          let currentValueStr = isFlag
            ? rawValue === "Y" || rawValue === true
              ? "Y"
              : "N"
            : String(rawValue || "");

          const isSetAll =
            !findYear ||
            String(findYear).trim() === "" ||
            booleanMode === "setAll";
          const isMatch =
            isSetAll ||
            currentValueStr
              .toLowerCase()
              .includes(String(findYear).toLowerCase());

          if (isMatch) {
            let newValue = replaceValue;
            if (isFlag) {
              newValue =
                replaceValue === "Y" ||
                replaceValue === "true" ||
                replaceValue === true
                  ? "Y"
                  : "N";
            }
            if (column === "refStrucName" && typeof newValue === "string") {
              newValue = newValue.replace(/[^a-zA-Z\s]/g, "");
            }

            if (currentValueStr !== newValue) {
              updatedCount++;
              return { ...ref, [column]: newValue, isDirty: true };
            }
          }
          return ref;
        });

        if (updatedCount > 0) {
          toast.success(`Updated ${updatedCount} records locally.`, {
            toastId: "bulk-success",
          });
        } else {
          toast.info("No records matched or values are already updated.", {
            toastId: "bulk-info",
          });
        }

        return newData;
      });
    },
    [references],
  );

  const handleLevelFindReplace = useCallback(
    (config, isReplaceMode) => {
      const { column, findYear, replaceValue } = config;
      if (!column || !findYear) return;

      if (!isReplaceMode) {
        const found = (selectedReference.levels || []).find((l) =>
          String(l[column] || "")
            .toLowerCase()
            .includes(findYear.toLowerCase()),
        );
        if (found) {
          setSelectedLevelIds(new Set([String(found.tempId)]));
        } else {
          toast.info("No match in levels");
        }
      } else {
        if (!window.confirm("Apply bulk update to matching levels?")) return;
        const updated = (selectedReference.levels || []).map((l) => {
          if (
            String(l[column] || "")
              .toLowerCase()
              .includes(findYear.toLowerCase())
          ) {
            let finalVal = replaceValue;
            if (column === "refStrucName" && typeof finalVal === "string") {
              finalVal = finalVal.replace(/[^a-zA-Z\s]/g, "");
            }
            return { ...l, [column]: finalVal, isDirty: true };
          }
          return l;
        });
        setSelectedReference((prev) => ({
          ...prev,
          levels: updated,
          isDirty: true,
        }));
        toast.success("Levels updated");
      }
    },
    [selectedReference],
  );

  const handleToggleFormView = useCallback(() => {
    setIsFormView((prev) => {
      if (
        !prev &&
        references.length > 0 &&
        !selectedReference?.id &&
        !selectedReference?.tempId
      ) {
        // Auto select the first row if nothing was selected prior to opening form view
        setSelectedReference(references[0]);
        setSelectedIds(
          new Set([String(references[0].tempId || references[0].id)]),
        );
      }
      return !prev;
    });
  }, [references, selectedReference]);
  const handleNavigate = useCallback(
    (dir) => {
      const dataList = sortedReferences;
      const idx = dataList.findIndex(
        (r) => String(r.id) === String(selectedReference?.id),
      );
      const next = dir === "next" ? idx + 1 : idx - 1;
      if (dataList[next]) setSelectedReference(dataList[next]);
    },
    [sortedReferences, selectedReference],
  );

  // Main UI Callbacks
  const onRowSelect = useCallback(
    (row) => {
      const id = String(row.tempId || row.id);
      const isSelecting = !selectedIds.has(id);

      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        isSelecting ? newSet.add(id) : newSet.delete(id);
        return newSet;
      });

      if (isSelecting) {
        setSelectedReference(row);

        // Fetch level data if existing row
        if (!id.startsWith("NEW_") && !id.startsWith("PST_")) {
          const companyId = row.companyId || getCompanyId();
          const refId = row.refStrucId;
          api
            .get(
              `${backendUrl}/api/RefStruc/GetAllLevels/${refId}/${companyId}`,
            )
            .then((res) => {
              const fetchedLevels = (res.data || []).map((l, i) => ({
                ...l,
                tempId: `SERVER_${l.lvlKey || l.lvlNo || i}`,
                // ==========================================
                // 🚨 TEST ZONE: CHANGE THE COUNT VALUE HERE 🚨
                // Replace "(i === 0 ? 5 : 0)" with any number to test.
                // E.g., count: 2 (will disable all levels), count: 0 (will make the LAST one editable)
                count: l.count !== undefined ? l.count : i === 0 ? 5 : 0,
                // ==========================================
                length: l.idSegLenNo || l.length || 0,
                refStrucName: l.refStrucLvlDesc || l.description || "",
                isDirty: false,
              }));
              setReferences((prev) =>
                prev.map((r) =>
                  String(r.tempId || r.id) === id
                    ? { ...r, levels: fetchedLevels, levelsFetched: true }
                    : r,
                ),
              );
              setSelectedReference((prev) =>
                (prev?.tempId || prev?.id) === (row.tempId || row.id)
                  ? { ...prev, levels: fetchedLevels, levelsFetched: true }
                  : prev,
              );
            })
            .catch((err) => console.error("Failed to fetch levels", err));
        }
      } else {
        // If unchecked, clear the secondary table view by resetting selectedReference
        setSelectedReference((prev) =>
          String(prev?.tempId || prev?.id) === id ? {} : prev,
        );
        setSelectedLevelIds(new Set());
      }
    },
    [selectedIds],
  );

  const handleSelectAllMain = useCallback(
    (e) => {
      if (e.target.checked) {
        setSelectedIds(
          new Set(references.map((r) => String(r.tempId || r.id))),
        );
      } else {
        setSelectedIds(new Set());
        setSelectedReference({});
      }
    },
    [references],
  );

  const handleSelectAllLevels = useCallback(
    (e) => {
      if (e.target.checked) {
        setSelectedLevelIds(
          new Set(
            (selectedReference?.levels || []).map((l) => String(l.tempId)),
          ),
        );
      } else {
        setSelectedLevelIds(new Set());
      }
    },
    [selectedReference],
  );

  const handleFormChange = useCallback((field, value) => {
    setSelectedReference((prev) => {
      let finalVal = value;
      if (field === "refStrucName" && typeof finalVal === "string") {
        finalVal = finalVal.replace(/[^a-zA-Z\s]/g, "");
      }
      let updatedRow = { ...prev, [field]: finalVal, isDirty: true };

      // Auto-update level lengths if refStrucId changes at runtime
      if (field === "refStrucId") {
        const segments = value.split(".").filter((p) => p.length > 0);
        if (updatedRow.levels && updatedRow.levels.length > 0) {
          const newLevels = updatedRow.levels.map((l) => {
            // Only auto-update if count is 0
            if ((l.count || 0) === 0) {
              const segIndex = Number(l.lvlNo) - 1;
              if (segIndex >= 0 && segIndex < segments.length) {
                return {
                  ...l,
                  length: segments[segIndex].length,
                  isDirty: true,
                };
              }
            }
            return l;
          });
          updatedRow.levels = newLevels;
          updatedRow.hasDirtyLevels = true;
        }
      }

      setReferences((list) =>
        list.map((r) =>
          String(r.tempId || r.id) ===
          String(updatedRow.tempId || updatedRow.id)
            ? updatedRow
            : r,
        ),
      );
      return updatedRow;
    });
  }, []);

  const onFieldChange = useCallback((id, field, val) => {
    setReferences((prev) =>
      prev.map((r) => {
        if (String(r.tempId || r.id) === id) {
          const isFlag =
            baseColumns.find((c) => c.key === field)?.type === "flag";
          let finalVal = isFlag
            ? val === true || val === "Y"
              ? "Y"
              : "N"
            : val;

          if (field === "refStrucName" && typeof finalVal === "string") {
            finalVal = finalVal.replace(/[^a-zA-Z\s]/g, "");
          }

          let updatedRow = { ...r, [field]: finalVal, isDirty: true };

          // Auto-update level lengths if refStrucId changes at runtime in Table View
          if (field === "refStrucId") {
            const segments = String(finalVal)
              .split(".")
              .filter((p) => p.length > 0);
            if (updatedRow.levels && updatedRow.levels.length > 0) {
              const newLevels = updatedRow.levels.map((l) => {
                if ((l.count || 0) === 0) {
                  const segIndex = Number(l.lvlNo) - 1;
                  if (segIndex >= 0 && segIndex < segments.length) {
                    return {
                      ...l,
                      length: segments[segIndex].length,
                      isDirty: true,
                    };
                  }
                }
                return l;
              });
              updatedRow.levels = newLevels;
              updatedRow.hasDirtyLevels = true;
            }
          }

          setSelectedReference((prevSel) =>
            String(prevSel?.tempId || prevSel?.id) === id
              ? updatedRow
              : prevSel,
          );
          return updatedRow;
        }
        return r;
      }),
    );
  }, []);

  const isHeaderDirty = useMemo(() => {
    const isNew =
      selectedReference?.id && String(selectedReference.id).startsWith("NEW_");
    return Boolean(
      isNew || selectedReference?.isDirty || selectedReference?.hasDirtyLevels,
    );
  }, [selectedReference]);

  const isLevelsDirty = useMemo(
    () => selectedReference?.levels?.some((l) => l.isDirty) || false,
    [selectedReference],
  );

  const mainActions = useMemo(
    () => ({
      onAdd: handleAdd,
      onCopy: handleCopy,
      onPaste: handlePaste,
      onDelete: handleDelete,
      onSave: handleSave,
      onClear: handleClear,
      onToggleView: handleToggleFormView,
    }),
    [
      handleAdd,
      handleCopy,
      handlePaste,
      handleDelete,
      handleSave,
      handleClear,
      handleToggleFormView,
    ],
  );

  // --- Level Rendering Helpers ---
  const handleLevelAdd = useCallback(() => {
    const newLvlNo = (selectedReference?.levels?.length || 0) + 1;

    // Auto-calculate length based on current refStrucId segments
    let autoLen = 0;
    if (selectedReference?.refStrucId) {
      const segments = selectedReference.refStrucId
        .split(".")
        .filter((p) => p.length > 0);
      if (segments.length >= newLvlNo) {
        autoLen = segments[newLvlNo - 1].length;
      }
    }

    const newLvl = {
      tempId: `LVL_${Date.now()}`,
      lvlNo: newLvlNo,
      refStrucName: "",
      length: autoLen,
      isDirty: true,
    };
    setSelectedReference((prev) => ({
      ...prev,
      levels: [...(prev.levels || []), newLvl],
      hasDirtyLevels: true,
    }));
    setReferences((prev) =>
      prev.map((r) =>
        String(r.tempId || r.id) ===
        String(selectedReference?.tempId || selectedReference?.id)
          ? {
              ...r,
              levels: [...(r.levels || []), newLvl],
              hasDirtyLevels: true,
            }
          : r,
      ),
    );
  }, [selectedReference]);

  const handleLevelDelete = useCallback(async () => {
    if (selectedLevelIds.size === 0) {
      return toast.warning("Please select a row first.");
    }
    if (!selectedReference?.levels) return;

    const lvls = selectedReference.levels;
    const itemsToDelete = lvls.filter((l) =>
      selectedLevelIds.has(String(l.tempId)),
    );

    for (let l of itemsToDelete) {
      if ((l.count || 0) > 0) {
        return toast.warning(`Cannot delete level ${l.lvlNo}: already in use.`);
      }
    }

    const toServerDelete = itemsToDelete
      .filter((l) => String(l.tempId).startsWith("SERVER_"))
      .map((l) => ({
        refStrucId: selectedReference.refStrucId,
        companyId: selectedReference.companyId || "COMP01",
        lvlKey: l.lvlKey || l.lvlNo,
      }));

    if (toServerDelete.length > 0) {
      setLoading(true);
      try {
        const promises = toServerDelete.map((del) =>
          api.delete(
            `${backendUrl}/api/RefStruc/DeleteLevel/${del.refStrucId}/${del.companyId}/${del.lvlKey}`,
          ),
        );
        await Promise.all(promises);
        toast.success("Level deleted successfully.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete level.");
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    const filtered = lvls.filter(
      (l) => !selectedLevelIds.has(String(l.tempId)),
    );
    const updatedRow = {
      ...selectedReference,
      levels: filtered,
      hasDirtyLevels: true,
    };
    setSelectedReference(updatedRow);
    setReferences((prev) =>
      prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
    );
    setSelectedLevelIds(new Set());
  }, [selectedReference, selectedLevelIds]);

  const handleLevelClear = useCallback(() => {
    setSelectedReference((prev) => ({ ...prev, levels: [] }));
    setSelectedLevelIds(new Set());
  }, []);

  const handleLevelCopy = useCallback(() => {
    const selectedLevels = (selectedReference.levels || []).filter((l) =>
      selectedLevelIds.has(String(l.tempId)),
    );
    if (selectedLevels.length > 0) {
      setClipboard(selectedLevels);
      toast.info("Levels copied");
    }
  }, [selectedReference, selectedLevelIds]);

  const levelActions = useMemo(() => {
    if (isInheritingLevels) return {}; // Disable toolbar actions completely if inheriting
    return {
      onAdd: handleLevelAdd,
      onDelete: handleLevelDelete,
      onClear: handleLevelClear,
    };
  }, [handleLevelAdd, handleLevelDelete, handleLevelClear, isInheritingLevels]);

  const onLevelRowSelect = useCallback((row) => {
    const id = String(row.tempId);
    setSelectedLevelIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }, []);

  const onLevelFieldChange = useCallback((id, field, value) => {
    setSelectedReference((prev) => {
      const lvls = prev.levels || [];
      const targetIndex = lvls.findIndex((l) => String(l.tempId) === id);
      if (targetIndex === -1) return prev;

      const l = lvls[targetIndex];
      if ((l.count || 0) > 0 && field !== "refStrucName") {
        toast.warning(
          "Cannot edit this field: count is > 0 indicating it's already in use.",
        );
        return prev;
      }

      let finalVal = value;
      if (field === "refStrucName" && typeof finalVal === "string") {
        finalVal = finalVal.replace(/[^a-zA-Z\s]/g, "");
      }

      const updated = lvls.map((lvl) =>
        String(lvl.tempId) === id
          ? { ...lvl, [field]: finalVal, isDirty: true }
          : lvl,
      );
      const updatedRow = { ...prev, levels: updated, hasDirtyLevels: true };
      setReferences((list) =>
        list.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
      );
      return updatedRow;
    });
  }, []);

  // --- Render Return ---
  return (
    <div className="p-4 space-y-4 font-inter">
      <MainContainer icon={Database} title="Manage Reference Structures">
        <Toolbar
          rowKey="id"
          isFormView={isFormView}
          columns={columns}
          handleFindReplace={handleFindReplaceReference}
          currentIndex={sortedReferences.findIndex(
            (r) => String(r.id) === String(selectedReference?.id),
          )}
          totalRecords={sortedReferences.length}
          handleNavigate={handleNavigate}
          actions={mainActions}
          selectedRow={selectedReference}
          hasSelectedRows={selectedIds.size > 0}
          isDirty={isHeaderDirty}
          clipboard={clipboard}
        />

        {isFormView ? (
          <div className="m-2 space-y-4">
            <div className="bg-[#e5f3fb]/70 rounded-xl p-4 border border-[#17414d]/20 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <FormInput
                  label="Reference ID *"
                  value={selectedReference?.refStrucId || ""}
                  onChange={(e) =>
                    handleFormChange("refStrucId", e.target.value)
                  }
                />
                <FormInput
                  label="Name *"
                  value={selectedReference?.refStrucName || ""}
                  onChange={(e) =>
                    handleFormChange("refStrucName", e.target.value)
                  }
                />
              </div>

              <FormSection title="Options">
                <div className="flex flex-wrap items-center gap-8 py-2">
                  <FormInput
                    type="checkbox"
                    label="Use In Data Entry"
                    checked={
                      selectedReference?.refDataEntryFl === "Y" ||
                      selectedReference?.refDataEntryFl === true
                    }
                    onChange={(e) =>
                      handleFormChange(
                        "refDataEntryFl",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-medium text-black min-w-[90px]">
                      Reference Heading
                    </label>
                    <select
                      className="border border-gray-300 outline-none p-0.5 rounded font-light text-[10px] bg-white focus:border-[#17414d]"
                      value={selectedReference?.sRefEntryCd || ""}
                      onChange={(e) =>
                        handleFormChange("sRefEntryCd", e.target.value)
                      }
                    >
                      <option value="">Select...</option>
                      <option value="1">Ref 1</option>
                      <option value="2">Ref 2</option>
                      <option value="3">Ref 3</option>
                      <option value="4">Ref 4</option>
                    </select>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>
        ) : (
          <div className="px-2 pb-2">
            <ReusableTable
              rowKey="id"
              data={sortedReferences}
              columns={columns}
              selectedRows={selectedIds}
              onRowSelect={onRowSelect}
              onSelectAll={handleSelectAllMain}
              onFieldChange={onFieldChange}
            />
          </div>
        )}
      </MainContainer>

      <SecondaryContainer title="Define Ref Structure Levels">
        {!isInheritingLevels && (
          <Toolbar
            columns={levelColumns}
            actions={levelActions}
            selectedRow={null}
            hasSelectedRows={selectedLevelIds.size > 0}
            isDirty={isLevelsDirty}
          />
        )}
        <ReusableTable
          rowKey="tempId"
          data={selectedReference?.levels || []}
          columns={levelColumns}
          selectedRows={selectedLevelIds}
          onRowSelect={onLevelRowSelect}
          onSelectAll={handleSelectAllLevels}
          onFieldChange={onLevelFieldChange}
        />
      </SecondaryContainer>
    </div>
  );
};

export default ManageReference;
