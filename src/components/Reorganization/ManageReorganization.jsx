import React, { useEffect, useState } from "react";
import {
  ActionDetailButton,
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../../helper/formSection";
import {
  ActionButton,
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../../helper/container";
import api from "../../utils/api";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { TableSearchSelect } from "../../helper/tableSection";
import { backendUrl } from "../config";
import Pagination from "../../helper/pagination";

const ManageReorganization = () => {
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState([]);
  const [isFormView, setIsFormView] = useState(true);
  const [data, setAllData] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [levelData, setLevelData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [org, setOrg] = useState([]);
  const [orgLink, setOrgLink] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [reorgOrgLink, setReorgOrgLink] = useState({
    orgId: "",
    orgName: "",
  });
  const [maxlevel, setMaxLevel] = useState(0);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1); // Update this from your API response
  const [goToValue, setGoToValue] = useState("");

  const [clipboard, setClipboard] = useState([]);
  useEffect(() => {
    // Check if current localData differs from the original data fetched from API
    // We use stringify for a deep comparison of the arrays
    const hasChanged = JSON.stringify(localData) !== JSON.stringify(data);
    setIsDirty(hasChanged);
  }, [localData, data]);

  const REORG_COLUMNS = [
    {
      id: "reorgId",
      label: "Reorganization",
      type: "text",
      allowReplace: false,
    }, // Usually IDs aren't bulk-updated
    { id: "reorgName", label: "Name", type: "text", allowReplace: true },
    { id: "lvlNo", label: "Level No", type: "text", allowReplace: false }, // Calculated field
    { id: "reorgTopFl", label: "Active", type: "flag", allowReplace: true },
  ];

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);

    if (newSelected.has(id)) {
      // 1. If ID exists, remove it (Unselecting)
      newSelected.delete(id);

      // 2. Logic: If the row we just unselected was the one shown in the form,
      // we should probably show the next available selected row or null.
      if ((selectedRow?.tempId || selectedRow?.reorgId) === id) {
        const remainingIds = Array.from(newSelected);
        if (remainingIds.length > 0) {
          const lastId = remainingIds[remainingIds.length - 1];
          const lastData = localData.find(
            (item) => (item.tempId || item.reorgId) === lastId,
          );
          setSelectedRow(lastData);
        } else {
          setSelectedRow(null); // No rows left selected
        }
      }
    } else {
      // 3. If ID doesn't exist, add it (Multiple Selection)
      newSelected.add(id);

      // 4. Find the full data object for the LATEST clicked row
      const fullRowData = localData.find(
        (item) => (item.tempId || item.reorgId) === id,
      );

      // 5. Update the Form View with the latest selection
      if (fullRowData) {
        setSelectedRow(fullRowData);

        // Keep navigation index in sync with the latest click
        const index = localData.findIndex(
          (item) => (item.tempId || item.reorgId) === id,
        );
        setCurrentIndex(index);
      }
    }

    // 6. Save the set containing ALL selected IDs
    setSelectedRows(newSelected);
  };

  // 2. Toggle All Rows (Header Checkbox)
  const handleToggleAll = () => {
    if (selectedRows.size === localData.length) {
      // If all are selected, clear all
      setSelectedRows(new Set());
    } else {
      // Otherwise, select everything using the unique reorgId
      const allIds = localData.map((item) => item.reorgId || item.tempId);
      setSelectedRows(new Set(allIds));
    }
  };

  // 3. Row Click (Focus for Form View)
  const handleRowClick = (row, index) => {
    setSelectedRow(row);
    setCurrentIndex(index);
  };

  const handleAddLevel = () => {
    // 1. Check if the Reorganization table has unsaved changes
    // We check for isNew (newly added row) or isDirty (edited row)
    const hasUnsavedReorgChanges = localData.some(
      (row) => row.isNew || row.isDirty,
    );

    if (hasUnsavedReorgChanges) {
      return toast.warn(
        "Please save or discard the changes in the Reorganization table before adding a new level.",
      );
    }

    // 2. Existing logic to add a new level
    const newLevelNo = levelData.length + 1;
    const newLevel = {
      lvlNo: newLevelNo,
      reorgIdTop: selectedRow?.reorgId || "",
      reorgLvlDesc: "",
      idSegLenNo: 0,
      count: 0,
      isNew: true,
      isDirty: true,
    };

    setLevelData((prev) => [...prev, newLevel]);
    setIsFormDirty(true);
  };

  const getAllReorg = async () => {
    // 1. Capture the ID that is currently selected (if any)
    const previousId = selectedRow?.reorgId || selectedRow?.id;

    setLoading(true);

    try {
      const res = await api.get(
        `${backendUrl}/api/reorganizations/GetAllReOrgs`,
      );

      if (res.data && res.data.length > 0) {
        // Clean the data by ensuring flags are false
        const fetchedData = res.data.map((item) => ({
          ...item,
          isNew: false,
          isDirty: false,
          tempId: null, // Also clear any temp IDs if they exist in the response
        }));

        setAllData(fetchedData);
        setLocalData(fetchedData);

        // 2. Check if the ID we had selected still exists in the fresh data
        const stillExists = fetchedData.find(
          (item) => (item.reorgId || item.id) === previousId,
        );

        if (stillExists) {
          // Keep the existing selection
          setSelectedRow(stillExists);
          const currentId = stillExists.reorgId || stillExists.id;
          setSelectedRows(new Set([currentId]));
        } else {
          // 3. Fallback: Select the first record if nothing was selected
          // or if the previous selection is gone
          const firstRow = fetchedData[0];
          const firstId = firstRow.reorgId || firstRow.id;

          setSelectedRow(firstRow);
          setSelectedRows(new Set([firstId]));
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllReorg();
  }, []); // Add dependencies here if this should re-run on specific changes

  useEffect(() => {
    // Helper to calculate how deep the reorganization hierarchy goes
    const getMaxDepth = (items) => {
      if (!items || items.length === 0) return 0;

      return Math.max(
        ...items.map((item) => {
          // Checking for 'children' or 'subItems' depending on your API structure
          const children = item.items || item.subItems || item.children;
          if (children && children.length > 0) {
            return 1 + getMaxDepth(children);
          }
          return 1;
        }),
      );
    };

    const fetchReorgLevels = async () => {
      // 1. Get the current Reorg ID (handling both saved and temp IDs)
      const reorgId = selectedRow?.reorgId;

      // 2. Guard Clause: Don't fetch if it's a new unsaved entry or ID is empty
      // Also, if the ID contains a dot, it's a child node; we only fetch levels for the "Top" ID
      if (!reorgId || selectedRow?.isNew || reorgId.includes(".")) {
        // For new entries, we initialize with a default Level 1
        // if (selectedRow?.isNew) {
        //   setLevelData([
        //     {
        //       lvlNo: 1,
        //       reorgIdTop: "",
        //       reorgLvlDesc: "",
        //       idSegLenNo: 0,
        //       isNew: true,
        //       isDirty: true,
        //     },
        //   ]);
        // }
        return;
      }

      try {
        setLoading(true); // Matches your state name 'loading'

        // 3. Fetch levels using the reorgIdTop parameter
        const res = await api.get(
          `${backendUrl}/api/reorganizations/GetReOrgLevels?companyId=1&reorgIdTop=${reorgId}`,
        );

        if (res.data) {
          // 4. Ensure data is an array
          const fetchedLevels = Array.isArray(res.data) ? res.data : [res.data];

          setLevelData(fetchedLevels);

          // 5. Calculate and set the max depth of this hierarchy
          const maxLvl = getMaxDepth(fetchedLevels);
          // If you have a setMaxLevel state, update it here
          if (typeof setMaxLevel === "function") {
            setMaxLevel(maxLvl);
          }
        }
      } catch (error) {
        console.error("Fetch Reorg Levels Error:", error);
        // Fallback to empty if API fails
        // setLevelData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReorgLevels();
  }, [selectedRow?.reorgId]); // Re-run whenever the selected Reorg changes

  useEffect(() => {
    const getOrg = async () => {
      setLoading(true);
      try {
        const res = await api.get(`${backendUrl}/Orgnization/GetAllOrgs`);

        if (res.data) {
          setOrg(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getOrg();
  }, []);

  const isMaxLevelEditable = (lvl) => {
    // 1. Guard clause: If fundamental data is missing, exit early
    // if (!levelData?.level || !selectedLevelRows) return false;
    const levels = levelData;

    // 2. Handle empty array: If no levels exist, there is no "max" to edit
    if (levels.idSegLenNo === 0) return false;

    // 3. Perform calculation safely
    const maxLevelNum = Math.max(...levels.map((l) => l.lvlNo));

    // 4. Return the conditional check
    return lvl.lvlNo === maxLevelNum && lvl.count === 0;
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = data.find(
      (item) =>
        String(item.reorgId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.reorgId; //

      // 1. Update Form View Data
      setSelectedRow(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = data.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
    } else {
      toast.error(`Reorganization ID "${code}" not found.`); //
    }
  };

  const handleNavigate = (direction) => {
    if (isFormDirty) {
      if (!window.confirm("You have unsaved changes. Discard them and move?")) {
        return;
      }
    }

    console.log(direction);

    const idx = data.findIndex(
      (x) =>
        (x.tempId || x.reorgId) ===
        (selectedRow?.tempId || selectedRow?.reorgId),
    );

    console.log(idx);

    let newIdx = idx;
    if (direction === "next" && idx < data.length - 1) newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = localData.length - 1;

    if (newIdx !== idx) {
      const nextRecord = data[newIdx];
      const nextId = nextRecord.tempId || nextRecord.reorgId;

      // 1. Update the record being shown in the form
      setSelectedRow(nextRecord);
      setCurrentIndex(newIdx);

      console.log(nextRecord);

      // 2. CRITICAL: Update the selection so the table highlights this row

      setIsFormDirty(false);
    }
  };
  console.log(selectedRow);

  const handleFieldChange = (id, field, value) => {
    // console.log(id, field, value)
    setIsFormDirty(true);
    let finalValue = value;

    // 1. Validation and Level Calculation for reorgId
    let additionalProps = {};
    if (field === "reorgId") {
      // Remove spaces, but keep dots for hierarchy calculation
      const cleanValue = value.replace(/\s/g, "");
      finalValue = cleanValue;

      // Split by dots to determine current level and segment lengths
      // e.g., "10.20" -> segments: ["10", "20"]
      const segments = cleanValue.split(".").filter((seg) => seg.length > 0);
      additionalProps.lvlNo = segments.length || 1;

      // --- REAL-TIME LEVEL TABLE SYNC ---
      // This updates the secondary table (segment lengths) as you type
      setLevelData((prevLevels) => {
        // Ensure we have a Level 1 to work with
        let updatedLevels =
          prevLevels.length > 0
            ? [...prevLevels]
            : [
                {
                  lvlNo: 1,
                  reorgLvlDesc: "Root",
                  idSegLenNo: 0,
                  isNew: true,
                  isDirty: true,
                },
              ];

        // Update segment lengths for each level based on the typed ID
        return updatedLevels.map((lvl) => {
          const segmentIndex = lvl.lvlNo - 1;
          if (segments[segmentIndex] !== undefined) {
            return {
              ...lvl,
              idSegLenNo: segments[segmentIndex].length, // e.g., if segment is "101", length is 3
              isDirty: true,
            };
          }
          return lvl;
        });
      });
    }

    const checkboxFields = ["ReorgTopFl"];
    if (checkboxFields.includes(field)) {
      // If it's explicitly true or the string "Y", set to "Y". Otherwise "N".
      finalValue = value === true || value === "Y" ? "Y" : "N";
    }

    // 2. Normalize checkboxes (Y/N)
    // const checkboxFields = ["ReorgTopFl"];
    // if (checkboxFields.includes(field)) {
    //   finalValue = value === true ? "Y" : "N";
    // }

    // 3. Update the main data list (localData)
    setLocalData((prevData) =>
      prevData.map((item) => {
        const isTargetRow = (item.tempId || item.reorgId) === id;
        if (isTargetRow) {
          const updatedRow = {
            ...item,
            [field]: finalValue,
            ...additionalProps,
            isDirty: true,
          };

          // 4. Keep the currently selected record (Form View) in sync
          if (
            (selectedRow?.tempId || selectedRow?.reorgId) ===
            (item.tempId || item.reorgId)
          ) {
            setSelectedRow(updatedRow);
          }

          return updatedRow;
        }
        return item;
      }),
    );
  };

  const handleAddNewReorg = () => {
    // 1. Check if there is already an unsaved new record in localData
    const hasUnsavedNew = localData.some((row) => row.isNew || !!row.tempId);

    if (hasUnsavedNew) {
      toast.warn(
        "Please save or cancel the current new entry before adding another.",
      );
      return; // Stop the function here
    }

    // 2. Setup IDs and Session info
    const newId = `TEMP_${Date.now()}`;
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    // 3. Define the New Reorg Header entry
    const newEntry = {
      tempId: newId,
      reorgId: "",
      reorgName: "",
      ReorgTopFl: "N",
      lvlNo: 1, // Start at level 1 by default
      isNew: true,
      isDirty: true,
      modifiedBy: userSession?.name || "system",
      companyId: "1",
    };

    // 4. Initialize Level 1 for the second table
    const firstLevel = {
      lvlNo: 1, // Matches ManageReorg level column key
      reorgIdTop: "", // Empty because reorgId isn't typed yet
      reorgLvlDesc: "",
      idSegLenNo: 0, // Matches ManageReorg level column key
      count: 0,
      isNew: true,
      isDirty: true,
    };

    // 5. Update All States
    setLocalData([newEntry, ...localData]);
    setAllData([newEntry, ...data]); // Keep navigation list in sync

    // Set the first level in the level table
    setLevelData([firstLevel]);

    // Focus the UI on the new entry
    setSelectedRow(newEntry);
    setSelectedRows(new Set([newId])); // Check the checkbox for the new row
    setCurrentIndex(0);
    setIsFormDirty(true);
  };

  // const handleSaveAll = async () => {
  //   // Identify what actually changed
  //   const reorgChanges = localData.filter((item) => item.isDirty || item.isNew);
  //   const levelChanges = levelData.filter((lvl) => lvl.isDirty || lvl.isNew);

  //   const reorgId = selectedRow.reorgId;

  //   if (reorgChanges.length === 0 && levelChanges.length === 0) {
  //     toast.info("No changes to save.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // Create an array of promises to run them in parallel if both changed
  //     const savePromises = [];

  //     // CASE 1: Only Reorg changed (or both)
  //     if (reorgChanges.length > 0) {
  //       for (const item of reorgChanges) {
  //         await api.post(`${backendUrl}/api/reorganizations/CreateReOrg`, {
  //           ...item,
  //           companyId: "1",
  //         });
  //         // console.log(item)
  //       }
  //     }
  //     // 2. Send Level Changes one by one
  //     if (levelChanges.length > 0) {
  //       for (const lvl of levelChanges) {
  //         const levelPayload = {
  //           companyId: "1",
  //           reorgIdTop: reorgId,
  //           ...lvl,
  //         };

  //         console.log(levelPayload);
  //         await api.post(
  //           `${backendUrl}/api/reorganizations/CreateReOrgLevel`,
  //           levelPayload,
  //         );
  //       }
  //     }

  //     // Execute the required calls
  //     await Promise.all(savePromises);

  //     toast.success("Changes saved successfully!");

  //     // Reset flags after successful save
  //     setIsFormDirty(false);
  //     setLocalData((prev) =>
  //       prev.map((item) => ({ ...item, isDirty: false, isNew: false })),
  //     );
  //     setLevelData((prev) =>
  //       prev.map((lvl) => ({ ...lvl, isDirty: false, isNew: false })),
  //     );
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     toast.error("Failed to save some changes.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // 1. Single Selection Logic (Checkbox acts like a Radio)
  const handleSelectLevel = (levelId) => {
    // If clicking the same one, we keep it selected or nullify.
    // For "one at a time", we just set the ID.
    setSelectedLevelId(levelId);
  };

  // 2. Data Entry for Level Rows
  const handleLevelFieldChange = (levelId, field, value) => {
    setLevelData((prev) =>
      prev.map((lvl) =>
        lvl.lvlNo === levelId ? { ...lvl, [field]: value, isDirty: true } : lvl,
      ),
    );
    setIsFormDirty(true);
  };

  // 3. Save Level Data
  // const handleSaveLevel = async () => {
  //   const levelsToSave = levelData.filter((lvl) => lvl.isDirty || lvl.isNew);

  //   if (levelsToSave.length === 0) {
  //     toast.info("No level changes to save.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     // Passing the parent reorgId so the backend knows which hierarchy these levels belong to
  //     const payload = {
  //       ...levelsToSave,
  //       reorgIdTop: selectedRow?.reorgId,
  //     };

  //     const res = await api.post(
  //       `${backendUrl}/api/reorganizations/CreateReOrgLevel`,
  //       payload,
  //     );

  //     if (res.status === 200) {
  //       toast.success("Levels updated successfully");
  //       // Clear dirty flags locally
  //       setLevelData((prev) =>
  //         prev.map((lvl) => ({ ...lvl, isDirty: false, isNew: false })),
  //       );
  //     }
  //   } catch (error) {
  //     toast.error("Failed to save levels");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // 4. Delete Level (Only allowed if it's the Max Level with 0 count)
  const handleDeleteLevel = async () => {
    if (!selectedLevelId) {
      toast.warn("Please select a level to delete.");
      return;
    }

    const levelToDelete = levelData.find((l) => l.lvlNo === selectedLevelId);

    // Business Logic: Only delete the last level if it has no associated data
    if (!isMaxLevelEditable(levelToDelete)) {
      toast.error(
        "Only the highest level with no data (count 0) can be deleted.",
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete Level ${selectedLevelId}?`,
      )
    )
      return;

    try {
      setLoading(true);
      // If it was a newly added row not yet in DB, just filter it out
      if (levelToDelete.isNew) {
        setLevelData((prev) => prev.filter((l) => l.lvlNo !== selectedLevelId));
        setSelectedLevelId(null);
        toast.success("New level removed");
        return;
      }

      // Otherwise, call API
      const res = await api.delete(
        `${backendUrl}/api/deleteLevel/${selectedLevelId}`,
      );
      if (res.status === 200) {
        setLevelData((prev) => prev.filter((l) => l.lvlNo !== selectedLevelId));
        setSelectedLevelId(null);
        toast.success("Level deleted from database");
      }
    } catch (error) {
      toast.error("Error deleting level");
    } finally {
      setLoading(false);
    }
  };

  const handelLinkReorg = async () => {
    const reorgId = selectedRow?.reorgId;
    const orgId = reorgOrgLink.orgId;

    if (!reorgId) {
      return toast.warn("Please select a Reorganization first.");
    }
    if (!orgId) {
      return toast.warn("Please select a Organization first.");
    }

    // 3. Construct the Payload
    // Every item gets the SAME reorgId, but a UNIQUE orgId from the row
    const payload = [
      {
        reorgId: reorgId,
        orgId: orgId,
        companyId: "1",
      },
    ];

    try {
      // 4. Trigger the API call
      const response = await api.post(
        `${backendUrl}/api/reorganizations/BulkCreateMapping`,
        payload,
      );

      if (response.data) {
        toast.success(
          `Successfully mapped ${payload.length} organizations to Reorg ID: ${reorgId}`,
        );

        // Optional: Clear selection after success
        setReorgOrgLink({
          orgId: "",
          orgName: "",
        });
      }
    } catch (error) {
      console.error("Mapping Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create bulk mapping.",
      );
    }
  };

  const handleDeleteSelected = async () => {
    // 1. Check if any rows are actually selected
    if (!selectedRows || selectedRows.size === 0) {
      toast.info("Please select at least one record to delete.");
      return;
    }

    // 2. Optional: Add a confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRows.size} selected record(s)?`,
    );
    if (!confirmDelete) return;

    setLoading(true);
    const selectedIdArray = Array.from(selectedRows);
    let successCount = 0;
    let failCount = 0;

    try {
      // 3. Loop through selected IDs and delete them one by one
      // We use a for...of loop to handle the async calls sequentially
      for (const id of selectedIdArray) {
        try {
          // If it's a TEMP ID (unsaved), just remove it locally without API call
          if (String(id).startsWith("TEMP_")) {
            successCount++;
            continue;
          }

          // Call the API endpoint from your screenshot
          await api.delete(
            `${backendUrl}/api/reorganizations/DeleteReOrg/${id}`,
          );
          successCount++;
        } catch (error) {
          console.error(`Failed to delete ID: ${id}`, error);
          failCount++;
        }
      }

      // 4. Update the local UI state
      const remainingData = localData.filter(
        (item) => !selectedRows.has(item.reorgId || item.tempId),
      );

      setLocalData(remainingData);
      setAllData(remainingData); // Keep the navigation list in sync

      // 5. Reset selection and form view
      setSelectedRows(new Set());
      setSelectedRow(null);
      setCurrentIndex(-1);

      // 6. Feedback to the user
      if (failCount === 0) {
        toast.success(`Successfully deleted ${successCount} record(s).`);
      } else {
        toast.warn(`Deleted ${successCount} records, but ${failCount} failed.`);
      }

      // Refresh the search to ensure data integrity
      getAllReorg();
    } catch (error) {
      toast.error("An error occurred during the deletion process.");
    } finally {
      setLoading(false);
    }
  };

  // const handleSaveAll = async () => {
  //   const reorgChanges = localData.filter((item) => item.isDirty || item.isNew);
  //   const levelChanges = levelData.filter((lvl) => lvl.isDirty || lvl.isNew);

  //   if (reorgChanges.length === 0 && levelChanges.length === 0) {
  //     toast.info("No changes to save.");
  //     return;
  //   }

  //   // --- 1. HEADER VALIDATION & SELECTION ---
  //   for (const row of reorgChanges) {
  //     const identifier = row.reorgId || "New Record";

  //     // Logic: Only validate Levels if it's a Level 1 Reorg (No dots)
  //     const isLevelOne = !(row.reorgId || "").includes(".");

  //     if (isLevelOne && row.isNew) {
  //       // Validate Level 1 specifically in the secondary table
  //       const level1 = levelData.find((l) => Number(l.lvlNo) === 1);
  //       if (!level1 || !level1.reorgLvlDesc?.trim()) {
  //         return toast.error(`In ${identifier}: Level 1 description is required.`);
  //       }
  //       if (!level1.idSegLenNo || Number(level1.idSegLenNo) <= 0) {
  //         return toast.error(`In ${identifier}: Level 1 segment length must be greater than 0.`);
  //       }
  //     }
  //   }

  //   setLoading(true);
  //   try {
  //     // --- 2. SAVE REORG HEADERS ---
  //     for (const item of reorgChanges) {
  //       const isNewHeader = !!item.tempId || item.isNew;
  //       const isLevelOne = !(item.reorgId || "").includes(".");

  //       const payload = {
  //         ...item,
  //         companyId: "1",
  //         modifiedBy: "system",
  //       };

  //       // Call Header API
  //       await api.post(`${backendUrl}/api/reorganizations/CreateReOrg`, payload);

  //       // --- 3. CONDITIONAL LEVEL SAVE ---
  //       // Only call CreateReOrgLevel if this is a Level 1 entry being created for the first time
  //       if (isNewHeader && isLevelOne) {
  //         const level1 = levelData.find((l) => Number(l.lvlNo) === 1);
  //         if (level1) {
  //           await api.post(`${backendUrl}/api/reorganizations/CreateReOrgLevel`, {
  //             ...level1,
  //             reorgIdTop: item.reorgId,
  //             companyId: "1",
  //           });
  //           // Mark as clean so it doesn't get saved again in the next block
  //           level1.isDirty = false;
  //           level1.isNew = false;
  //         }
  //       }
  //     }

  //     // --- 4. INDEPENDENT LEVEL UPDATES ---
  //     // Only run this if we are currently viewing a Level 1 node
  //     const isCurrentlyLevelOne = !(selectedRow?.reorgId || "").includes(".");

  //     if (isCurrentlyLevelOne && levelChanges.length > 0) {
  //       for (const lvl of levelChanges) {
  //         // Double check this level wasn't already saved in the loop above
  //         if (lvl.isDirty || lvl.isNew) {
  //           await api.post(`${backendUrl}/api/reorganizations/CreateReOrgLevel`, {
  //             ...lvl,
  //             reorgIdTop: selectedRow?.reorgId,
  //             companyId: "1",
  //           });
  //         }
  //       }
  //     }

  //     toast.success("Saved successfully!");

  //     // --- 5. CLEANUP ---
  //     setIsFormDirty(false);
  //     setLocalData((prev) =>
  //       prev.map((item) => ({ ...item, isDirty: false, isNew: false, tempId: null }))
  //     );
  //     setLevelData((prev) =>
  //       prev.map((lvl) => ({ ...lvl, isDirty: false, isNew: false }))
  //     );

  //   } catch (error) {
  //     console.error("Save Error:", error);
  //     toast.error(error.response?.data?.message || "Failed to save data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSaveAll = async () => {
    const reorgChanges = localData.filter((item) => item.isDirty || item.isNew);
    const levelChanges = levelData.filter((lvl) => lvl.isDirty || lvl.isNew);

    if (reorgChanges.length === 0 && levelChanges.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // --- 1. HEADER VALIDATION ---
    for (const row of reorgChanges) {
      const identifier = row.reorgId || "New Record";
      const isLevelOne = !(row.reorgId || "").includes(".");

      if (isLevelOne && row.isNew) {
        const level1 = levelData.find((l) => Number(l.lvlNo) === 1);
        if (!level1 || !level1.reorgLvlDesc?.trim()) {
          return toast.error(
            `In ${identifier}: Level 1 description is required.`,
          );
        }
        if (!level1.idSegLenNo || Number(level1.idSegLenNo) <= 0) {
          return toast.error(
            `In ${identifier}: Level 1 segment length must be greater than 0.`,
          );
        }
      }
    }

    setLoading(true);
    try {
      // --- 2. SAVE REORG HEADERS ---
      for (const item of reorgChanges) {
        const isLevelOne = !(item.reorgId || "").includes(".");
        const payload = { ...item, companyId: "1", modifiedBy: "system" };

        if (item.isNew || item.tempId) {
          // --- POST (CREATE) ---
          await api.post(
            `${backendUrl}/api/reorganizations/CreateReOrg`,
            payload,
          );

          // Special case: Save Level 1 metadata immediately if it's a new Level 1 Header
          if (isLevelOne) {
            const level1 = levelData.find((l) => Number(l.lvlNo) === 1);
            if (level1) {
              await api.post(
                `${backendUrl}/api/reorganizations/CreateReOrgLevel`,
                {
                  ...level1,
                  reorgIdTop: item.reorgId,
                  companyId: "1",
                },
              );
              level1.isDirty = false;
              level1.isNew = false;
            }
          }
        } else if (item.isDirty) {
          // --- PUT (UPDATE) ---
          // Note: Often PUT requires the ID in the URL, e.g., .../UpdateReOrg/${item.reorgId}
          await api.put(
            `${backendUrl}/api/reorganizations/UpdateReOrg`,
            payload,
          );
        }
      }

      // --- 3. INDEPENDENT LEVEL UPDATES ---
      const isCurrentlyLevelOne = !(selectedRow?.reorgId || "").includes(".");
      if (isCurrentlyLevelOne && levelChanges.length > 0) {
        for (const lvl of levelChanges) {
          if (lvl.isNew) {
            // --- POST NEW LEVEL ---
            await api.post(
              `${backendUrl}/api/reorganizations/CreateReOrgLevel`,
              {
                ...lvl,
                reorgIdTop: selectedRow?.reorgId,
                companyId: "1",
              },
            );
          } else if (lvl.isDirty) {
            // --- PUT UPDATED LEVEL ---
            await api.put(
              `${backendUrl}/api/reorganizations/UpdateReOrgLevel`,
              {
                ...lvl,
                reorgIdTop: selectedRow?.reorgId,
                companyId: "1",
              },
            );
          }
        }
      }

      toast.success("Saved successfully!");

      await getAllReorg();

      // --- 4. CLEANUP ---
      setIsFormDirty(false);
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Failed to save data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = async () => {
    // Check if there are any unsaved new rows or modified rows
    const hasDirtyRows = localData.some((ld) => ld.isNew || ld.isDirty);

    if (!isFormDirty && clipboard.length === 0 && !hasDirtyRows) {
      toast.info("No changes or clipboard data to clear.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to discard all unsaved changes and clear the clipboard?",
      )
    ) {
      // 1. Reset Data States
      // By spreading 'data', we completely remove any 'TEMP_' or 'isNew' rows added to localData
      setLocalData([...data]);
      setAllData([...data]);

      // 2. Reset Selection
      // Find the original version of the row currently in the form
      const originalRow = data.find(
        (item) =>
          (item.reorgId || item.id) ===
          (selectedRow?.reorgId || selectedRow?.id),
      );

      if (originalRow) {
        setSelectedRow(originalRow);
        // Sync the selection set to just this one original row
        setSelectedRows(new Set([originalRow.reorgId || originalRow.id]));
      } else {
        // If the current row was a NEW entry that was just discarded, default to the first record
        const fallbackRow = data[0] || null;
        setSelectedRow(fallbackRow);
        setSelectedRows(
          fallbackRow
            ? new Set([fallbackRow.reorgId || fallbackRow.id])
            : new Set(),
        );
        setCurrentIndex(fallbackRow ? 0 : -1);
      }

      // 3. Reset Level Data for Level 1 records
      const currentId = selectedRow?.reorgId;
      if (currentId && !currentId.includes(".")) {
        // Re-trigger the useEffect to fetch original levels from the backend
        setLevelData([]);
      }

      // 4. CLEAR CLIPBOARD (Internal & System)
      setClipboard([]);
      localStorage.removeItem("reorg_clipboard");

      try {
        await navigator.clipboard.writeText("");
      } catch (err) {
        console.warn("Could not clear system clipboard");
      }

      // 5. Finalize UI State
      setIsFormDirty(false);
      toast.info("Changes discarded and clipboard cleared.");
    }
  };

  const handleCopy = async () => {
    if (!selectedRow && selectedRows.size === 0) {
      toast.warn("Select a record to copy first.");
      return;
    }

    // 1. Determine which rows to copy (Checked rows take priority, otherwise current form row)
    const rowsToCopy =
      selectedRows.size > 0
        ? localData.filter((item) =>
            selectedRows.has(item.reorgId || item.tempId),
          )
        : [selectedRow];

    // 2. Define Headers (Tab Separated for Excel compatibility)
    const headerLine = ["Reorg ID", "Name", "Active", "Level"].join("\t");

    // 3. Map Data Rows
    const dataLines = rowsToCopy
      .map((row) =>
        [
          row.reorgId || "",
          row.reorgName || "",
          row.ReorgTopFl === "Y" ? "Active" : "Inactive",
          row.lvlNo || "1",
        ].join("\t"),
      )
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    try {
      // 4. Write to System Clipboard
      await navigator.clipboard.writeText(finalClipboardString);

      // 5. Update Internal State and Storage
      setClipboard(rowsToCopy);
      localStorage.setItem("reorg_clipboard", JSON.stringify(rowsToCopy));

      toast.success(`${rowsToCopy.length} record(s) copied to clipboard.`);
    } catch (err) {
      toast.error("Failed to copy to system clipboard.");
    }
  };

  const handlePaste = () => {
    // 1. Retrieve from state or localStorage fallback
    const savedData =
      clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("reorg_clipboard"));

    if (!savedData) {
      return toast.warn("Clipboard is empty. Copy a record first.");
    }

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];

    // 2. Map into new Reorg objects
    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `TEMP_${Date.now()}_${index}`;

      return {
        ...row,
        reorgId: "",
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        reorgName: row.reorgName ? `${row.reorgName}` : "",
        ReorgTopFl: row.ReorgTopFl || "N",
        lvlNo: 1,
        companyId: "1",
        modifiedBy: "system",
      };
    });

    // 3. REMOVE EXISTING NEW ENTRIES and Update States
    // This filters out any row that hasn't been saved to the database yet
    const removeNewEntries = (prev) =>
      prev.filter(
        (item) => !item.isNew && !String(item.tempId).startsWith("TEMP_"),
      );

    setLocalData((prev) => [...pastedRows, ...removeNewEntries(prev)]);

    // 4. Focus the first pasted row
    if (pastedRows.length > 0) {
      const firstPasted = pastedRows[0];
      setSelectedRow(firstPasted);
      setSelectedRows(new Set([firstPasted.tempId]));
      setCurrentIndex(0);
      setIsFormDirty(true);
    }

    toast.success(
      `${pastedRows.length} record(s) pasted, replacing unsaved entries.`,
    );
  };

  const handleFindReplace = (config, isReplaceMode) => {
    const {
      column, // e.g., "reorgName" or "reorgTopFl"
      findYear, // The value to search for
      replaceValue, // The new value to set
      booleanMode, // "inverted" or "set"
    } = config;

    console.log(config);

    if (!column) {
      return toast.warn("Please select a column first.");
    }

    setIsFormDirty(true);

    // --- PART 1: FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      if (!findYear && findYear !== 0) {
        return toast.warn("Please enter a value to find.");
      }

      const search = String(findYear).toLowerCase();

      const filteredResults = data.filter((item) => {
        const currentValue = String(item[column] || "").toLowerCase();

        // If it's the checkbox field, look for Y/N matches
        if (column === "reorgTopFl") {
          const searchFlag = search === "active" || search === "y" ? "y" : "n";
          return currentValue === searchFlag;
        }

        // Default partial text match
        return currentValue.includes(search);
      });

      if (filteredResults.length > 0) {
        setLocalData(filteredResults);
        toast.info(`Found ${filteredResults.length} matches.`);
      } else {
        toast.error(`No matches found for "${findYear}".`);
      }
      return;
    }

    // --- PART 2: REPLACE (BULK UPDATE) LOGIC ---
    if (
      !window.confirm(`Apply changes to "${column}" for all visible records?`)
    ) {
      return;
    }

    setLocalData((prevData) => {
      let changeCount = 0;

      const updatedData = prevData.map((item) => {
        let rowChanged = false;
        let newValue = replaceValue;

        // Logic for the "Active" Checkbox (reorgTopFl)
        if (column === "reorgTopFl") {
          const currentValue = item[column] || "N";
          if (booleanMode === "inverted") {
            newValue = currentValue === "Y" ? "N" : "Y";
          } else {
            newValue =
              replaceValue === "Y" || replaceValue === true ? "Y" : "N";
          }
        }

        // Logic for Text Fields (reorgName)
        else {
          const currentValue = String(item[column] || "");
          const searchStr = String(findYear || "").toLowerCase();

          // If find box is empty, replace all. Otherwise, check for match.
          const isMatch =
            !findYear || currentValue.toLowerCase().includes(searchStr);

          if (!isMatch) return item;
          newValue = replaceValue;
        }

        // Check if value is actually different
        if (item[column] !== newValue) {
          changeCount++;
          rowChanged = true;
        }

        return rowChanged
          ? { ...item, [column]: newValue, isDirty: true }
          : item;
      });

      if (changeCount > 0) {
        toast.success(`Updated ${changeCount} records locally.`);
        setIsFormDirty(true); // Ensure the "Save" button becomes active
      } else {
        toast.info("No records matched the criteria for update.");
      }

      return updatedData;
    });
  };
  const handleRowDoubleClick = (item, index) => {
    setSelectedRow(item);
    const currentId = item.orgId;
    setSelectedRows(new Set([currentId]));
    setCurrentIndex(index);

    setIsFormView(true);
  };
  return (
    <div className="p-4 space-y-4 mt-10 animate-in fade-in duration-500 font-inter">
      <MainContainer title="Reorganization">
        <Toolbar
          isFormView={isFormView}
          columns={REORG_COLUMNS}
          handleFindReplace={handleFindReplace}
          rowKey="reorgId"
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          totalRecords={localData.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          selectedRow={selectedRow}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          actions={{
            onAdd: handleAddNewReorg,
            onSave: handleSaveAll,
            onDelete: handleDeleteSelected,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleDiscard,
            onToggleView: () => setIsFormView(!isFormView),
          }}
        />
        {isFormView ? (
          <div className="space-y-2 p-1 py-2">
            <FormSection>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-3 mb-2">
                <FormInput
                  required
                  label={"Reorganization"}
                  value={selectedRow?.reorgId || ""}
                  disabled={!selectedRow?.isNew}
                  onChange={(e) =>
                    handleFieldChange(
                      selectedRow?.tempId || selectedRow?.reorgId,
                      "reorgId",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  required
                  label={"Name"}
                  value={selectedRow?.reorgName || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      selectedRow?.tempId || selectedRow?.reorgId,
                      "reorgName",
                      e.target.value,
                    )
                  }
                />
                <FormInput
                  required
                  type="checkbox"
                  label={"Active"}
                  checked={selectedRow?.reorgTopFl === "Y"}
                  onChange={(e) =>
                    handleFieldChange(
                      selectedRow?.tempId || selectedRow?.reorgId,
                      "reorgTopFl",
                      e.target.checked ? "Y" : "N",
                    )
                  }
                />
              </div>
            </FormSection>

            <FormSection title={"Level No"}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label={"Level No"}
                  type="number"
                  readOnly
                  value={selectedRow?.lvlNo || ""}
                />
              </div>
            </FormSection>
            <ActionDetailButton
              label="Link Organization"
              onClick={() => setOrgLink((prev) => !prev)}
              isActive={orgLink}
              // disabled={isAnyLoading}
            />
          </div>
        ) : (
          <>
            <div className={`overflow-x-auto max-h-[35vh]`}>
              <table className="min-w-full text-sm border border-gray-300 rounded">
                <thead className="bg-gray-200 sticky top-0 z-10 ">
                  <tr>
                    <th className="th-thead w-10">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-blue-500 cursor-pointer"
                        // Checked only if all rows are in the Set
                        checked={
                          localData.length > 0 &&
                          selectedRows.size === localData.length
                        }
                        onChange={handleToggleAll}
                      />
                    </th>
                    <th className="th-thead">Reorganization</th>
                    <th className="th-thead">Name</th>
                    <th className="th-thead w-6 ">Level No</th>
                    <th className="th-thead">Active</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {localData.map((lvl, idx) => {
                    const rowId = lvl.tempId || lvl.reorgId;
                    const isChecked = selectedRows.has(rowId);
                    // const isFocused = selectedRow.reorgId === lvl.reorgId;
                    return (
                      <tr
                        key={rowId}
                        className="hover:bg-gray-50 transition-colors cursor-pointe"
                        onDoubleClick={() => handleRowDoubleClick(lvl, idx)}
                      >
                        <td className="tbody-td ">
                          <input
                            type="checkbox"
                            className="w-3 h-3 accent-blue-500 cursor-pointer text-center"
                            checked={isChecked}
                            onChange={() => handleSelectRow(rowId)}
                          />
                        </td>
                        <td className="tbody-td">
                          <input
                            type="text"
                            className={`td-input ${lvl.isNew ? "bg-white" : "bg-gray-100"}`}
                            disabled={!lvl.isNew}
                            value={lvl?.reorgId}
                            onChange={(e) =>
                              handleFieldChange(
                                rowId,
                                "reorgId",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="tbody-td">
                          <input
                            type="text"
                            className="td-input"
                            value={lvl?.reorgName}
                            onChange={(e) =>
                              handleFieldChange(
                                rowId,
                                "reorgName",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="tbody-td w-6 ">
                          <input
                            type="text"
                            readOnly
                            className="td-input bg-gray-100 text-center"
                            value={lvl?.lvlNo}
                          />
                        </td>
                        <td className="tbody-td">
                          <input
                            type="checkbox"
                            className="td-input accent-blue-500"
                            checked={lvl?.reorgTopFl === "Y"}
                            onChange={(e) =>
                              handleFieldChange(
                                rowId,
                                "reorgTopFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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

      {orgLink && (
        <SecondaryContainer
          handleClose={() => setOrgLink(false)}
          title="Link To Accounts"
        >
          <div className="flex items-center justify-start py-1 mb-2">
            <FormSection title="Account Details" className="w-[80%]">
              <div className="flex  gap-x-4">
                <div className="flex items-center gap-x-2">
                  <label className="text-[10px] font-[400] text-black">
                    OrgID
                  </label>
                  <TableSearchSelect
                    id={selectedRow?.tempId || selectedRow?.reorgId}
                    value={selectedRow?.orgId || ""}
                    options={org}
                    displayKey="orgId"
                    secondaryKey="orgName"
                    onSelect={(selectedOpt, rowId) => {
                      // 1. Update the Main Data and mark it dirty for the Save function
                      handleFieldChange(rowId, "orgId", selectedOpt.orgId);
                      handleFieldChange(rowId, "orgName", selectedOpt.orgName);

                      // 2. Update the Local Display State so the UI reflects the name immediately
                      setReorgOrgLink({
                        orgId: selectedOpt.orgId,
                        orgName: selectedOpt.orgName,
                      });
                    }}
                  />
                </div>

                <FormInput
                  label="Org Name"
                  // This now has the data because setReorgOrgLink was called
                  value={reorgOrgLink?.orgName || ""}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            </FormSection>

            <ActionDetailButton
              label="Link Accts"
              onClick={handelLinkReorg}
              // disabled={isAnyLoading}
            />
          </div>
        </SecondaryContainer>
      )}

      {selectedRow?.reorgId?.split(".").length === 1 && (
        <SecondaryContainer title="Reorganization Level">
          <div className="w-full flex justify-end gap-2 pb-2">
            <ActionButton
              icon={Plus}
              onClick={handleAddLevel}
              disabled={loading}
              title="Add Level"
            />
            <ActionButton
              icon={Trash2}
              onClick={handleDeleteLevel}
              disabled={loading}
              title="Delete Selected"
            />
            {/* <ActionButton
              icon={Save}
              onClick={handleSaveLevel}
              title="Save Levels"
            /> */}
          </div>

          <div className="overflow-x-auto max-h-[35vh]">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  {/* No "Select All" checkbox here per your request */}
                  <th className="th-thead w-12 text-center"></th>
                  <th className="th-thead">Level</th>
                  <th className="th-thead">Description</th>
                  <th className="th-thead">Length</th>
                </tr>
              </thead>

              <tbody className="tbody">
                {levelData?.map((lvl) => {
                  const isEditable = isMaxLevelEditable(lvl);
                  const isSelected = selectedLevelId === lvl.lvlNo;

                  return (
                    <tr
                      key={lvl.lvlNo}
                      onClick={() => handleSelectLevel(lvl.lvlNo)}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-blue-500"
                          checked={isSelected}
                          readOnly // Controlled by selectedRow click
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-100"
                          value={lvl.lvlNo}
                          readOnly
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className={`td-input ${!isEditable && !lvl.isNew ? "bg-gray-50 text-gray-400" : "bg-white"}`}
                          value={lvl.reorgLvlDesc}
                          readOnly={!isEditable && !lvl.isNew}
                          onChange={(e) =>
                            handleLevelFieldChange(
                              lvl.lvlNo,
                              "reorgLvlDesc",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className={`td-input ${(!isEditable && !lvl.isNew) || lvl.lvlNo === 1 ? "bg-gray-50 text-gray-400" : "bg-white"}`}
                          value={lvl.idSegLenNo}
                          readOnly={
                            (!isEditable && !lvl.isNew) || lvl.lvlNo === 1
                          }
                          type="number"
                          onChange={(e) =>
                            handleLevelFieldChange(
                              lvl.lvlNo,
                              "idSegLenNo",
                              e.target.value,
                            )
                          }
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
    </div>
  );
};

export default ManageReorganization;
