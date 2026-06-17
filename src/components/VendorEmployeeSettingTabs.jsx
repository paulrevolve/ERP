import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Scissors,
  Plus,
  Trash2,
  Save,
  ClipboardPaste,
} from "lucide-react";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import {
  FormSection,
  FormInput,
  ActionDetailButton,
  FormSearchSelect,
} from "../helper/formSection";
import ReusableTable, { TableSearchSelect } from "../helper/tableSection";
import { backendUrl } from "./config";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../utils/api";

export const ManageProfessionalOrganization = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialProfOrgState = {
    profOrgId: "",
    profOrgDesc: "",
    modifiedBy: user.name || "System",
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    isNew: true, // CONCEPT FROM ACCOUNT MASTER
  };

  const [profOrgData, setProfOrgData] = useState(initialProfOrgState);

  const fetchProfessionalOrganizations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/ProfOrg`);
      const fetchedItems = response.data.data || [];
      if (fetchedItems.length > 0) {
        // Mark fetched items as NOT new
        const mappedData = fetchedItems.map((item) => ({
          ...item,
          isNew: false,
        }));

        setOriginalData(mappedData);
        setData(mappedData);
        setProfOrgData(mappedData[0]);
        setSelectedRows(new Set([mappedData[0].profOrgId]));
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setProfOrgData(initialProfOrgState);
      }
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionalOrganizations();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);

    // Determine the target index: use the provided index or fall back to the global pointer
    const targetIndex = index !== null ? index : currentIndex;

    // Safety check: ensure we have a valid index to update
    if (targetIndex === null || targetIndex === -1) {
      console.warn("No valid index found for handleFieldChange");
      return;
    }

    setOriginalData((prev) => {
      const updated = [...prev];

      // Update the row at the target index
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true, // Mark row as modified for the handleSave loop
      };

      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.profOrgId || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    // 1. Identify which rows actually need saving
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation check for all rows before starting the API process
    const invalidRow = rowsToSave.find(
      (row) => !row.profOrgId || !row.profOrgDesc,
    );
    if (invalidRow) {
      toast.error("ID and Description are required for all modified rows.");
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // 2. Iterate through each row one by one
      for (const row of rowsToSave) {
        // Prepare the payload (strip UI-specific flags)
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        try {
          if (row.isNew) {
            console.log(payload);
            // CALL POST for new records
            await axios.post(`${backendUrl}/api/ProfOrg`, payload);
          } else {
            console.log(payload);
            // CALL PUT for modified existing records
            await axios.put(
              `${backendUrl}/api/ProfOrg/${row.profOrgId}`,
              payload,
            );
          }
          successCount++;
        } catch (err) {
          console.error(`Failed to save row ${row.profOrgId}:`, err);
          errorCount++;
        }
      }

      // 3. Post-Save UI Updates
      if (successCount > 0) {
        toast.success(`Successfully saved ${successCount} record(s).`);
      }
      if (errorCount > 0) {
        toast.error(
          `Failed to save ${errorCount} record(s). Check console for details.`,
        );
      }

      // Refresh data to get clean state from backend
      setIsDirty(false);
      fetchProfessionalOrganizations();
    } catch (globalError) {
      toast.error("An unexpected error occurred during the save process.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    // 1. Determine which IDs to delete
    let idsToDelete = [];

    if (isFormView) {
      // Form View: Delete the single record currently being viewed
      const currentRow = originalData[currentIndex];

      // Safety: Don't call API for new/unsaved rows, just remove them locally
      if (!currentRow || currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (
        !window.confirm(
          `Delete "${currentRow.profOrgDesc || currentRow.profOrgId}"?`,
        )
      )
        return;
      idsToDelete = [currentRow.profOrgId];
    } else {
      // Table View: Use the selectedRows (Set or Array)
      if (
        !selectedRows ||
        (selectedRows instanceof Set
          ? selectedRows.size === 0
          : selectedRows.length === 0)
      ) {
        return toast.info("No rows selected for deletion.");
      }

      if (
        !window.confirm(
          `Are you sure you want to delete ${selectedRows instanceof Set ? selectedRows.size : selectedRows.length} selected items?`,
        )
      ) {
        return;
      }

      idsToDelete = Array.from(selectedRows);
    }

    // 2. Execute API Calls
    setIsLoading(true);
    try {
      // We use Promise.all to fire all delete requests in parallel for better performance
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/ProfOrg/${id}`),
        ),
      );

      toast.success(
        idsToDelete.length > 1
          ? "Selected items deleted!"
          : "Deleted successfully!",
      );

      // 3. Reset UI State
      if (typeof setSelectedRows === "function") {
        setSelectedRows(new Set()); // Clear selection after deletion
      }

      // Refresh the list from the backend to ensure local state matches the DB
      fetchProfessionalOrganizations();

      // If in form view and we just deleted the record, reset the index
      if (isFormView) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Error deleting items. Some records may be linked to other data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...profOrgData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialProfOrgState,
      profOrgDesc: clipboard.profOrgDesc, // Copy description but keep ID empty for new record
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setProfOrgData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialProfOrgState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setProfOrgData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setProfOrgData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchProfessionalOrganizations(),
  };

  const [columns] = useState(["profOrgId", "profOrgDesc"]);

  const COLUMN_LABELS = {
    profOrgId: "Profession Organization Code",
    profOrgDesc: "Profession Organization Description",
  };

  const CLEARANCE_DETAILS_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "profOrgId",
      label: "Profession Organization Code",
      type: "text",
      allowReplace: false, // Usually kept false for codes/IDs
    },

    // --- Description ---
    {
      id: "profOrgDesc",
      label: "Profession Organization Description",
      type: "text",
      allowReplace: true,
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.profOrgId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.profOrgId; //

      // 1. Update Form View Data
      setProfOrgData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Professional Organizations">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          handleFindReplace={handleFindReplace}
          columns={CLEARANCE_DETAILS_COLUMNS}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Profession Organization Code *"
                value={profOrgData.profOrgId}
                onChange={(e) => handleFieldChange("profOrgId", e.target.value)}
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!profOrgData.isNew}
                className={!profOrgData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Profession Organization Description *"
                value={profOrgData.profOrgDesc}
                onChange={(e) =>
                  handleFieldChange("profOrgDesc", e.target.value)
                }
                type="textarea"
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className=" th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData?.length > 0 &&
                        selectedRows?.size === originalData?.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.profOrgId || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.profOrgId || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setProfOrgData(item);
                        setCurrentIndex(index);
                      }}
                      className={`${
                        currentIndex === index ? "bg-blue-50" : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="text-center accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.profOrgId}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "profOrgId",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.profOrgDesc}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "profOrgDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
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

export const ManageSkillCodes = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialSkillState = {
    skillId: "",
    skillDesc: "",
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    activeFl: "Y", // Based on your JSON "activeFl": "s"
    isNew: true,
  };

  const [skillData, setSkillData] = useState(initialSkillState);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/Skill`);

      // Access the 'data' property from your API response object
      const skillList = response.data.data;
      const firstId = skillList[0].skillId;

      if (skillList && skillList.length > 0) {
        setOriginalData(skillList);
        setData(skillList);
        setSkillData(skillList[0]);
        setSelectedRows(new Set([firstId]));
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        // Only show info if we expected data but got an empty list
        setSkillData(initialSkillState);
        toast.info("No skill codes found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch skill codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.profOrgId || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation
    const invalidRow = rowsToSave.find((row) => !row.skillId || !row.skillDesc);
    if (invalidRow) {
      return toast.error("ID and Description are required for all changes.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/Skill`, payload);
        } else {
          await axios.put(`${backendUrl}/api/Skill/${row.skillId}`, payload);
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Saved ${successCount} record(s) successfully.`);
        setIsDirty(false);
        fetchSkills(); // Refresh the list
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---

  // const handleDelete = async () => {
  //   if (isFormView) {
  //     // Delete single from Form View
  //     if (!skillData.skillId || skillData.isNew) return;
  //     if (!window.confirm(`Delete "${skillData.skillDesc}"?`)) return;

  //     setIsLoading(true);
  //     try {
  //       await axios.delete(`${backendUrl}/api/Skill/${skillData.skillId}`);
  //       toast.success("Deleted successfully!");
  //       fetchSkills();
  //     } catch (error) {
  //       toast.error("Failed to delete");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     // Delete multiple from Table View
  //     if (selectedRows.size === 0) return toast.info("No rows selected");
  //     if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
  //       return;

  //     setIsLoading(true);
  //     try {
  //       const idsToDelete = Array.from(selectedRows);
  //       await Promise.all(
  //         idsToDelete.map((id) =>
  //           axios.delete(`${backendUrl}/api/Skill/${id}`),
  //         ),
  //       );
  //       toast.success("Selected items deleted!");
  //       setSelectedRows(new Set());
  //       fetchSkills();
  //     } catch (error) {
  //       toast.error("Error deleting some items");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  const handleDelete = async () => {
    if (isFormView) {
      // Delete single from Form View
      if (!skillData.skillId || skillData.isNew) return;
      if (!window.confirm(`Delete "${skillData.skillDesc}"?`)) return;

      setIsLoading(true);
      try {
        await axios.delete(`${backendUrl}/api/Skill/${skillData.skillId}`);
        toast.success("Deleted successfully!");
        fetchSkills();
      } catch (error) {
        // Extract message from backend response
        const errMsg = error.response?.data?.message || "Failed to delete";
        toast.error(errMsg);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Delete multiple from Table View
      if (selectedRows.size === 0) return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;

      setIsLoading(true);
      try {
        const idsToDelete = Array.from(selectedRows);
        await Promise.all(
          idsToDelete.map((id) =>
            axios.delete(`${backendUrl}/api/Skill/${id}`),
          ),
        );
        toast.success("Selected items deleted!");
        setSelectedRows(new Set());
        fetchSkills();
      } catch (error) {
        // For multiple deletes, the error might be inside the first failed promise
        const errMsg =
          error.response?.data?.message || "Error deleting some items";
        toast.error(errMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };
  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...skillData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialSkillState,
      skillDesc: clipboard.skillDesc, // Copy description but keep ID empty for new record
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setSkillData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialSkillState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setSkillData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setSkillData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchSkills(),
  };

  const [columns] = useState(["skillId", "skillDesc"]);

  const COLUMN_LABELS = {
    skillId: "Skill ID",
    skillDesc: "Skill Description",
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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.skillId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.skillId; //

      // 1. Update Form View Data
      setSkillData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  const SKILL_DETAILS_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "skillId",
      label: "Skill ID",
      type: "text",
      allowReplace: false, // Usually kept false for codes/IDs
    },

    // --- Description ---
    {
      id: "skillDesc",
      label: "Skill Desc",
      type: "text",
      allowReplace: true,
    },
  ];

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Skill Codes">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          searchValue={searchValue}
          columns={SKILL_DETAILS_COLUMNS}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          handleFindReplace={handleFindReplace}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Skill ID *"
                value={skillData.skillId}
                onChange={(e) => handleFieldChange("skillId", e.target.value)}
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!skillData.isNew}
                className={!skillData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Skill Description *"
                value={skillData.skillDesc}
                onChange={(e) => handleFieldChange("skillDesc", e.target.value)}
                type="textarea"
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.skillId || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.skillId || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setSkillData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index ? "bg-blue-50 " : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.skillId}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "skillId",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.skillDesc}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "skillDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
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

export const ManageSkillLevel = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const [searchValue, setSearchValue] = useState([]);
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialSkillLevelState = {
    skillLvlCd: "",
    skillLvlDesc: "",
    modifiedBy: `${user.name}`,
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    isNew: true,
  };

  const [skillLevelData, setSkillLevelData] = useState(initialSkillLevelState);

  // const fetchSkillLevel = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(`${backendUrl}/api/HSkillLvl`);
  //     if (response.data && response.data.length > 0) {
  //       setOriginalData(response.data);
  //       setSkillLevelData(response.data[0]);
  //       setCurrentIndex(0);
  //       setIsDirty(false);
  //     } else {
  //       setOriginalData([]);
  //       toast.info("No skill levl found.");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //     toast.error("Failed to fetch skill level");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchSkillLevel = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/HSkillLvl`);

      // Access the 'data' property from your API response object
      const skillLevelList = response.data.data;

      const firstId = skillLevelList[0].skillLvlCd;
      if (skillLevelList && skillLevelList.length > 0) {
        setSelectedRows(new Set([firstId]));
        setOriginalData(skillLevelList);
        setData(skillLevelList);
        setSkillLevelData(skillLevelList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        // Only show info if we expected data but got an empty list
        setSkillLevelData(initialSkillLevelState);
        toast.info("No skill level found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch skill codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillLevel();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.skillLvlCd || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation
    const invalidRow = rowsToSave.find(
      (row) => !row.skillLvlCd || !row.skillLvlDesc,
    );
    if (invalidRow) {
      return toast.error(
        "Code and Description are required for all modifications.",
      );
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/HSkillLvl`, payload);
        } else {
          await axios.put(
            `${backendUrl}/api/HSkillLvl/${row.skillLvlCd}`,
            payload,
          );
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Saved ${successCount} record(s) successfully.`);
        setIsDirty(false);
        fetchSkillLevel();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  // const handleDelete = async () => {
  //   if (isFormView) {
  //     // Delete single from Form View
  //     if (!skillLevelData.skillLvlCd || skillLevelData.isNew) return;
  //     if (!window.confirm(`Delete "${skillLevelData.skillLvlDesc}"?`)) return;

  //     setIsLoading(true);
  //     try {
  //       await axios.delete(
  //         `${backendUrl}/api/HSkillLvl/${skillLevelData.skillLvlCd}`,
  //       );
  //       toast.success("Deleted successfully!");
  //       fetchSkillLevel();
  //     } catch (error) {
  //       toast.error("Failed to delete");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     // Delete multiple from Table View
  //     if (selectedRows.size === 0) return toast.info("No rows selected");
  //     if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
  //       return;

  //     setIsLoading(true);
  //     try {
  //       const idsToDelete = Array.from(selectedRows);
  //       await Promise.all(
  //         idsToDelete.map((id) =>
  //           axios.delete(`${backendUrl}/api/HSkillLvl/${id}`),
  //         ),
  //       );
  //       toast.success("Selected items deleted!");
  //       setSelectedRows(new Set());
  //       fetchSkillLevel();
  //     } catch (error) {
  //       toast.error("Error deleting some items");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };
  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      // Handle unsaved records locally
      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (!window.confirm(`Delete "${currentRow.skillLvlDesc}"?`)) return;
      idsToDelete = [currentRow.skillLvlCd];
    } else {
      if (selectedRows.size === 0) return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/HSkillLvl/${id}`),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchSkillLevel();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...skillLevelData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialSkillLevelState,
      skillLvlDesc: clipboard.skillLvlDesc, // Copy description but keep ID empty for new record
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setSkillLevelData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialSkillLevelState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setSkillLevelData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setSkillLevelData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchSkillLevel(),
  };

  const [columns] = useState(["skillLvlCd", "skillLvlDesc"]);

  const COLUMN_LABELS = {
    skillLvlCd: "Skill Level Code",
    skillLvlDesc: "Skill Level Description",
  };

  const SKILL_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "skillLvlCd",
      label: "Skill Level ID",
      type: "text",
      allowReplace: false, // Usually kept false for codes/IDs
    },

    // --- Description ---
    {
      id: "skillLvlDesc",
      label: "Skill Level Desc",
      type: "text",
      allowReplace: true,
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.skillLvlCd).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.skillLvlCd; //

      // 1. Update Form View Data
      setSkillLevelData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  console.log(selectedRows);

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Skill Levels">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          handleFindReplace={handleFindReplace}
          columns={SKILL_COLUMNS}
          selectedRow={skillLevelData}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Skill Level Code *"
                value={skillLevelData.skillLvlCd}
                onChange={(e) =>
                  handleFieldChange("skillLvlCd", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!skillLevelData.isNew}
                className={!skillLevelData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Skill Level Description *"
                value={skillLevelData.skillLvlDesc}
                onChange={(e) =>
                  handleFieldChange("skillLvlDesc", e.target.value)
                }
                type="textarea"
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.skillLvlCd || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.skillLvlCd || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setSkillLevelData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index ? "bg-blue-50 " : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.skillLvlCd}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "skillLvlCd",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.skillLvlDesc}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "skillLvlDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
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

export const ManageTrainingCodes = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const [activeModal, setActiveModal] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialTraniningState = {
    trainId: "",
    trainDesc: "",
    trainCeuCred: 0,
    detlJobValidMthd: "",
    modifiedBy: `${user.name}`,
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    isNew: true,
  };

  const [trainingCodeData, setTrainingCodeData] = useState(
    initialTraniningState,
  );
  const [assignedJobs, setAssignedJobs] = useState([]);

  const [columns] = useState([
    "trainId",
    "trainDesc",
    "trainCeuCred",
    "detlJobValidMthd",
  ]);

  const COLUMN_LABELS = {
    trainId: "Training Code",
    trainDesc: "Training Description",
    trainCeuCred: "CEU Credits",
    detlJobValidMthd: "Detail Job Title Validation Method",
  };

  const detlJobValidMthds = [
    { id: "", name: "None" },
    { id: "N", name: "No Validation" },
    { id: "W", name: "Warning" },
    { id: "E", name: "Error" },
  ];

  const mapLaborCodesToNames = (record) => {
    if (!record) return initialTraniningState;

    const matchedJob = detlJobValidMthds.find(
      (o) => o.id === record.detlJobValidMthd,
    );

    return {
      ...record,
      detlJobValidMthd: matchedJob ? matchedJob.name : "",
    };
  };

  const fetchTrainingCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/Training`);

      // Access the nested array inside the response object
      const trainingList = response.data.data;

      if (trainingList && trainingList.length > 0) {
        // Map the items using your existing helper function
        const mapped = trainingList.map((item) => mapLaborCodesToNames(item));
        const firstId = mapped[0].trainId;
        setSelectedRows(new Set([firstId]));
        setOriginalData(mapped);
        setData(mapped);
        setTrainingCodeData(mapped[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        // Reset the form data to an initial empty state if needed
        setTrainingCodeData(initialTrainingState);
        toast.info("No training codes found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch training codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingCode();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true, // Mark for bulk save
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.trainId || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    // Filter rows that actually need saving
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation check
    const invalidRow = rowsToSave.find((row) => !row.trainId || !row.trainDesc);
    if (invalidRow) {
      return toast.error("ID and Description are required for all records.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      // Use for...of to send requests one by one (safer for sequential logic)
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/Training`, payload);
        } else {
          await axios.put(`${backendUrl}/api/Training/${row.trainId}`, payload);
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Successfully saved ${successCount} training record(s).`);
        setIsDirty(false);
        fetchTrainingCode(); // Refresh data from backend
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      // 1. Delete single from Form View using the currentIndex
      const currentRow = originalData[currentIndex];

      if (!currentRow) return;

      // Handle unsaved records locally without calling the API
      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        toast.info("Unsaved record removed.");
        return;
      }

      if (
        !window.confirm(
          `Delete training code "${currentRow.trainDesc || currentRow.trainId}"?`,
        )
      ) {
        return;
      }

      idsToDelete = [currentRow.trainId];
    } else {
      // 2. Delete multiple from Table View using selectedRows Set
      if (!selectedRows || selectedRows.size === 0) {
        return toast.info("No rows selected for deletion.");
      }

      if (
        !window.confirm(
          `Are you sure you want to delete ${selectedRows.size} selected items?`,
        )
      ) {
        return;
      }

      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      // Execute all delete requests in parallel
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/Training/${id}`),
        ),
      );

      toast.success(
        idsToDelete.length > 1
          ? "Selected items deleted!"
          : "Deleted successfully!",
      );

      // 3. Reset UI State
      setSelectedRows(new Set());

      // Refresh the data from the backend to ensure local state is synced
      fetchTrainingCode();

      if (isFormView) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete one or more items.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...trainingCodeData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialTraniningState,
      trainDesc: clipboard.trainDesc, // Copy description but keep ID empty for new record
      trainCeuCred: clipboard.trainCeuCred,
      detlJobValidMthd: clipboard.detlJobValidMthd,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setTrainingCodeData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialTraniningState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setTrainingCodeData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = async (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    const nextRecord = originalData[newIndex];
    setTrainingCodeData(nextRecord);
    setCurrentIndex(newIndex);
    // setTrainingCodeData(originalData[newIndex]);
    setIsDirty(false);
    const res = await axios.get(
      `${backendUrl}/api/TrainingDetlJobTitles/${nextRecord.trainId}`,
    );
    setAssignedJobs(res.data || []);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchTrainingCode(),
  };

  const TRAINING_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "trainId",
      label: "Training Code",
      type: "text",
      allowReplace: false,
    },

    // --- Training Details ---
    {
      id: "trainDesc",
      label: "Training Description",
      type: "text",
      allowReplace: true,
    },
    {
      id: "trainCeuCred",
      label: "CEU Credits",
      type: "text",
      allowReplace: true,
    },

    // --- Validation Methods ---
    {
      id: "detlJobValidMthd",
      label: "Detail Job Title Validation Method",
      type: "text",
      allowReplace: true,
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };
  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.trainId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.trainId; //

      // 1. Update Form View Data
      setTrainingCodeData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Training Codes">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          jumpToCode={jumpToCode}
          searchValue={searchValue}
          columns={TRAINING_COLUMNS}
          setSearchValue={setSearchValue}
          handleFindReplace={handleFindReplace}
          selectedRow={trainingCodeData}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Training Code *"
                value={trainingCodeData.trainId}
                onChange={(e) => handleFieldChange("trainId", e.target.value)}
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!trainingCodeData.isNew}
                className={!trainingCodeData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Training Description *"
                value={trainingCodeData.trainDesc}
                onChange={(e) => handleFieldChange("trainDesc", e.target.value)}
                type="textarea"
              />
              <FormInput
                label="CEU Credits"
                type="number"
                value={trainingCodeData.trainCeuCred}
                onChange={(e) =>
                  handleFieldChange("trainCeuCred", e.target.value)
                }
              />
              <FormSearchSelect
                label="Detail Job Title Validation Method *"
                value={trainingCodeData.detlJobValidMthd}
                options={detlJobValidMthds}
                displayKey="id"
                secondaryKey="name"
                onSelect={(val) => {
                  handleFieldChange("detlJobValidMthd", val.id);
                }}
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.trainId || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.trainId || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setTrainingCodeData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index ? "bg-blue-50 " : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.trainId}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "trainId",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.trainDesc}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "trainDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.trainCeuCred}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "trainCeuCred",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <TableSearchSelect
                          options={detlJobValidMthds}
                          displayKey="name"
                          secondaryKey="value"
                          value={
                            detlJobValidMthds.find(
                              (o) => o.id === item.detlJobValidMthd,
                            )?.name || ""
                          }
                          onSelect={(val) =>
                            handleFieldChange("detlJobValidMthd", val.id, index)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-wrap gap-1  p-1.5 ">
          <ActionDetailButton
            label="Eligible Detail Job Titles"
            isActive={activeModal.includes("EDJT")}
            onClick={() =>
              setActiveModal((prevArray) => ["EDJT", ...prevArray])
            }
          />
        </div>
      </MainContainer>

      {activeModal.includes("EDJT") && (
        <DetailJobTitles
          formData={trainingCodeData}
          selectedRow={selectedRows}
          handleInputChange={handleFieldChange}
          assignedJobs={assignedJobs} // Passed state
          setAssignedJobs={setAssignedJobs} // Passed setter
          onParentDirty={() => setIsDirty(true)} // Notify parent of changes
          onClose={() =>
            setActiveModal((prev) => prev.filter((item) => item !== "EDJT"))
          }
        />
      )}
    </div>
  );
};

export const DetailJobTitles = ({ formData, onClose }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  // const [jobTitles, setJobTitles] = useState([]); // For Dropdown
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialSubState = {
    trainId: formData.trainId,
    detlJobCd: "",
    modifiedBy: user.name || "System",
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    isNew: true,
  };

  const jobTitles = [
    { id: "M", name: "Manager" },
    { id: "D", name: "Developer" },
    { id: "A", name: "Analyst" },
    { id: "C", name: "Consultant" },
    { id: "T", name: "Technician" },
  ];

  const [subData, setSubData] = useState(initialSubState);

  // 1. Fetch Job Titles for the SearchSelect
  // const fetchJobTitles = async () => {
  //   try {
  //     const res = await axios.get(`${backendUrl}/api/HDetlJob`);
  //     // Maps to id/name for the SearchSelect component
  //     const mapped = res.data.map((item) => ({
  //       id: item.detlJobCd,
  //       name: item.detlJobDesc,
  //     }));
  //     setJobTitles(mapped);
  //   } catch (err) {
  //   }
  // };

  // 2. Fetch Existing Assignments for this Training ID
  const fetchAssignedJobs = async () => {
    if (!formData.trainId) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/TrainingDetlJobTitles/${formData.trainId}`,
      );
      if (res.data && res.data.length > 0) {
        setOriginalData(res.data);
        setData(res.data);
        setSubData(res.data[0]);
      } else {
        setOriginalData([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // fetchJobTitles();
    fetchAssignedJobs();
  }, [formData.trainId]);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    setSubData((prev) => ({ ...prev, [field]: value }));

    setOriginalData((prev) => {
      const updated = [...prev];
      const targetIndex = index !== null ? index : currentIndex;
      if (updated[targetIndex]) {
        updated[targetIndex] = { ...updated[targetIndex], [field]: value };
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!subData.detlJobCd) return toast.error("Please select a Job Title");

    setIsLoading(true);
    try {
      const methodEntry = detlJobValidMthds.find(
        (m) =>
          m.name === formData.detlJobValidMthd ||
          m.id === formData.detlJobValidMthd,
      );
      const methodCode = methodEntry ? methodEntry.id : "";
      // Constructing Payload according to your structure
      const payload = {
        trainId: formData.trainId,
        detlJobCd: subData.detlJobCd,
        modifiedBy: user.name || "System",
        timeStamp: new Date().toISOString(),
        rowVersion: subData.rowVersion || 0,
        training: {
          trainId: formData.trainId,
          trainDesc: formData.trainDesc,
          modifiedBy: formData.modifiedBy,
          timeStamp: formData.timeStamp,
          trainCeuCred: formData.trainCeuCred,
          rowVersion: formData.rowVersion,
          detlJobValidMthd: methodCode,
        },
      };

      if (subData.isNew) {
        await axios.post(`${backendUrl}/api/TrainingDetlJobTitles`, payload);
        toast.success("Job Title assigned successfully!");
      } else {
        await axios.put(
          `${backendUrl}/api/TrainingDetlJobTitles/${formData.trainId}/${subData.detlJobCd}`,
          payload,
        );
        toast.success("Updated successfully!");
      }

      setIsDirty(false);
      fetchAssignedJobs();
    } catch (error) {
      toast.error("Error saving record");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    const newItem = { ...initialSubState };
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setSubData(newItem);
    setIsDirty(true);
  };

  const handleDelete = async () => {
    const target = isFormView ? [subData.detlJobCd] : Array.from(selectedRows);
    if (target.length === 0) return toast.info("Nothing selected");
    if (!window.confirm("Delete selected assignments?")) return;

    try {
      await Promise.all(
        target.map((cd) =>
          axios.delete(
            `${backendUrl}/api/TrainingDetlJobTitles/${formData.trainId}/${cd}`,
          ),
        ),
      );
      toast.success("Deleted successfully");
      fetchAssignedJobs();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const DETAIL_JOB_TITLE = [
    // --- Primary Identity (Select Dropdown) ---
    {
      id: "detlJobCd",
      label: "Job Title",
      type: "select",
      allowReplace: false, // Locked for existing rows
      options: jobTitles.map((job) => ({
        value: job.id,
        label: `${job.id} - ${job.name}`,
      })),
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.profOrgId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.profOrgId; //

      // 1. Update Form View Data
      setSubData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <SecondaryContainer title="Eligible Detail Job Titles">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          columns={DETAIL_JOB_TITLE}
          handleFindReplace={handleFindReplace}
          jumpToCode={jumpToCode}
          actions={{
            onAdd: handleAdd,
            onSave: handleSave,
            onDelete: handleDelete,
            onToggleView: () => setIsFormView(!isFormView),
            onClear: () => fetchAssignedJobs(),
          }}
          buttonsDisable={["tableform"]}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={(dir) => {
            let idx = currentIndex;
            if (dir === "next") idx++;
            if (dir === "prev") idx--;
            setSubData(originalData[idx]);
            setCurrentIndex(idx);
          }}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormSearchSelect
                label="Select Job Title *"
                value={subData.detlJobCd}
                options={jobTitles}
                displayKey="id"
                secondaryKey="name"
                onSelect={(val) => {
                  handleFieldChange("detlJobCd", val.id);
                  handleFieldChange("detlJobDesc", val.name);
                }}
                disabled={!subData.isNew} // Lock ID if updating
              />
              <FormInput
                label="Job Description"
                value={subData.detlJobDesc || ""}
                readOnly
                className="bg-gray-100"
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  <th className="p-2 border w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedRows(
                            new Set(originalData.map((i) => i.detlJobCd)),
                          );
                        else setSelectedRows(new Set());
                      }}
                    />
                  </th>
                  <th className="p-2 border">Job Title Code</th>
                  <th className="p-2 border">Job Description</th>
                </tr>
              </thead>
              <tbody>
                {originalData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      setSubData(item);
                      setCurrentIndex(index);
                    }}
                    className={currentIndex === index ? "bg-blue-50" : ""}
                  >
                    <td className="p-2 border text-center">
                      <input
                        type="checkbox"
                        className="accent-blue-500"
                        checked={selectedRows.has(item.detlJobCd)}
                        onChange={() => {
                          const next = new Set(selectedRows);
                          next.has(item.detlJobCd)
                            ? next.delete(item.detlJobCd)
                            : next.add(item.detlJobCd);
                          setSelectedRows(next);
                        }}
                      />
                    </td>
                    <td className="p-2 border">
                      <TableSearchSelect
                        options={jobTitles}
                        value={
                          jobTitles.find((j) => j.id === item.detlJobCd)
                            ?.name || ""
                        }
                        onSelect={(val) =>
                          handleFieldChange("detlJobCd", val.id, index)
                        }
                        disabled={!item.isNew}
                      />
                    </td>
                    <td className="p-2 border">
                      {jobTitles.find((j) => j.id === item.detlJobCd)?.name ||
                        "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SecondaryContainer>
    </div>
  );
};

export const ManageTrainingSource = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialTraniningSourceState = {
    trainSrceId: "",
    trainSrceDesc: "",
    sIntExtCd: "s",
    modifiedBy: `${user.name}`,
    rowVersion: 0,
    isNew: true,
  };

  const [trainingSourceData, setTrainingSourceData] = useState(
    initialTraniningSourceState,
  );

  const [columns] = useState(["trainSrceId", "trainSrceDesc", "sIntExtCd"]);

  const COLUMN_LABELS = {
    trainSrceId: "Training Source Code",
    trainSrceDesc: "Training Source Description",
    sIntExtCd: "Internal/External",
  };

  const sIntExtCds = [
    { id: "", name: "Select" },
    { id: "I", name: "Internal" },
    { id: "E", name: "External" },
  ];

  const mapLaborCodesToNames = (record) => {
    if (!record) return initialTraniningSourceState;

    const matchedJob = sIntExtCds.find((o) => o.id === record.sIntExtCd);

    return {
      ...record,
      sIntExtCd: matchedJob ? matchedJob.name : "",
    };
  };

  // const fetchTrainingSource = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(`${backendUrl}/api/TrainingSource`);
  //     if (response.data && response.data.length > 0) {
  //       const mapped = response.data.map((item) => mapLaborCodesToNames(item));
  //       setOriginalData(mapped);
  //       setTrainingSourceData(mapped[0]);
  //       setCurrentIndex(0);
  //       setIsDirty(false);
  //     } else {
  //       setOriginalData([]);
  //       toast.info("No skill codes found.");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //     toast.error("Failed to fetch skill codes");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const fetchTrainingSource = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/TrainingSource`);

      // Drill into the 'data' array inside the response object
      const sourceList = response.data.data;

      if (sourceList && sourceList.length > 0) {
        const mapped = sourceList.map((item) => mapLaborCodesToNames(item));
        const firstId = mapped[0].trainSrceId;
        setSelectedRows(new Set([firstId]));
        setOriginalData(mapped);
        setData(mapped);
        setTrainingSourceData(mapped[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        // Reset state to initial if no records found
        setTrainingSourceData(initialSourceState);
        toast.info("No training sources found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch training sources");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingSource();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.trainSrceId || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation check for ID and Description
    const invalidRow = rowsToSave.find(
      (row) => !row.trainSrceId || !row.trainSrceDesc,
    );
    if (invalidRow) {
      return toast.error(
        "ID and Description are required for all modifications.",
      );
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/TrainingSource`, payload);
        } else {
          await axios.put(
            `${backendUrl}/api/TrainingSource/${row.trainSrceId}`,
            payload,
          );
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Saved ${successCount} record(s) successfully.`);
        setIsDirty(false);
        fetchTrainingSource();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      // Handle unsaved records locally
      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        toast.info("Unsaved row removed.");
        return;
      }

      if (
        !window.confirm(
          `Delete "${currentRow.trainSrceDesc || currentRow.trainSrceId}"?`,
        )
      )
        return;
      idsToDelete = [currentRow.trainSrceId];
    } else {
      if (!selectedRows || selectedRows.size === 0)
        return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      // Parallel deletion for performance
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/TrainingSource/${id}`),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchTrainingSource();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...trainingSourceData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialTraniningSourceState,
      trainSrceDesc: clipboard.trainDesc, // Copy description but keep ID empty for new record
      sIntExtCd: clipboard.sIntExtCd,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setTrainingSourceData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialTraniningSourceState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setTrainingSourceData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setTrainingSourceData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchTrainingSource(),
  };

  const TRAINING_SOURCE_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "trainSrceId",
      label: "Training Source Code",
      type: "text",
      allowReplace: false,
    },

    // --- Description ---
    {
      id: "trainSrceDesc",
      label: "Training Source Description",
      type: "text",
      allowReplace: true,
    },

    // --- Classification (Dropdown) ---
    {
      id: "sIntExtCd",
      label: "Internal/External",
      type: "select",
      allowReplace: true,
      options: sIntExtCds.map((item) => ({
        value: item.id,
        label: item.id, // Or item.name if you want the descriptive label
      })),
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.trainId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.trainId; //

      // 1. Update Form View Data
      setTrainingSourceData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Training Source">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          selectedRow={trainingSourceData}
          jumpToCode={jumpToCode}
          handleFindReplace={handleFindReplace}
          columns={TRAINING_SOURCE_COLUMNS}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Training Source Code *"
                value={trainingSourceData.trainSrceId}
                onChange={(e) =>
                  handleFieldChange("trainSrceId", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!trainingSourceData.isNew}
                className={
                  !trainingSourceData.isNew ? "bg-gray-100" : "bg-white"
                }
              />
              <FormInput
                label="Training Source Description *"
                value={trainingSourceData.trainSrceDesc}
                onChange={(e) =>
                  handleFieldChange("trainSrceDesc", e.target.value)
                }
              />
              <FormSearchSelect
                label="Internal/External"
                value={trainingSourceData.sIntExtCd}
                options={sIntExtCds}
                onSelect={(val) => {
                  handleFieldChange("sIntExtCd", val.id);
                }}
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.trainSrceId || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.trainSrceId || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setTrainingSourceData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index ? "bg-blue-50 " : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.trainSrceId}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "trainSrceId",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.trainSrceDesc}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "trainSrceDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <TableSearchSelect
                          options={sIntExtCds}
                          displayKey="name"
                          secondaryKey="value"
                          value={
                            sIntExtCds.find((o) => o.id === item.sIntExtCd)
                              ?.name || ""
                          }
                          onSelect={(val) =>
                            handleFieldChange("sIntExtCd", val.id, index)
                          }
                        />
                      </td>
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

export const ManageCompanyProperty = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialCompanyPropertyState = {
    propId: "",
    propDesc: "",
    manufName: "",
    serialId: "",
    companyId: `${user.companyId}` || "1",
    modifiedBy: `${user.name}`,
    rowVersion: 0,
    isNew: true,
  };

  const [companyPropertyData, setCompanyPropertyData] = useState(
    initialCompanyPropertyState,
  );

  const [columns] = useState(["propId", "propDesc", "manufName", "serialId"]);

  const COLUMN_LABELS = {
    propId: "Item",
    propDesc: "Item Description",
    manufName: "Manufacturer Name",
    serialId: "Serial Number",
  };

  const COMPANY_COLUMNS = [
    {
      id: "propId",
      label: "Item",
      type: "text",
      allowReplace: false,
    },
    {
      id: "propDesc",
      label: "Item Description",
      type: "text",
      allowReplace: true,
    },
    {
      id: "manufName",
      label: "Manufacturer Name",
      type: "text",
      allowReplace: true,
    },
    {
      id: "serialId",
      label: "Serial Number",
      type: "number",
      allowReplace: true,
    },
  ];

  // const fetchCompanyProperty = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(`${backendUrl}/api/CompanyProperty`);
  //     if (response.data && response.data.length > 0) {
  //       const mapped = response.data.map((item) => mapLaborCodesToNames(item));
  //       setOriginalData(mapped);
  //       setCompanyPropertyData(mapped[0]);
  //       setCurrentIndex(0);
  //       setIsDirty(false);
  //     } else {
  //       setOriginalData([]);
  //       toast.info("No skill codes found.");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //     toast.error("Failed to fetch skill codes");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchCompanyProperty = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/CompanyProperty`);

      // 1. Get the array from the paginated response
      const propertyList = response.data.data;

      if (propertyList && propertyList.length > 0) {
        // 2. Map directly to ensure the UI state matches the API keys
        const mapped = propertyList.map((item) => ({
          ...item,
          isNew: false, // Explicitly mark as existing record
          // Ensure numeric fields are handled if necessary
          serialId: item.serialId || "",
        }));

        const firstId = mapped[0].propId;
        setSelectedRows(new Set([firstId]));
        setOriginalData(mapped);
        setData(mapped);
        setCompanyPropertyData(mapped[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setCompanyPropertyData(initialCompanyPropertyState);
        toast.info("No company property records found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch company property data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyProperty();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.propId || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation check
    const invalidRow = rowsToSave.find((row) => !row.propId || !row.propDesc);
    if (invalidRow) {
      return toast.error("Property ID and Description are required.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/CompanyProperty`, payload);
        } else {
          await axios.put(
            `${backendUrl}/api/CompanyProperty/${row.propId}`,
            payload,
          );
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Successfully saved ${successCount} record(s).`);
        setIsDirty(false);
        fetchCompanyProperty();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (
        !window.confirm(
          `Delete property "${currentRow.propDesc || currentRow.propId}"?`,
        )
      )
        return;
      idsToDelete = [currentRow.propId];
    } else {
      if (!selectedRows || selectedRows.size === 0)
        return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/CompanyProperty/${id}`),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchCompanyProperty();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...companyPropertyData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialCompanyPropertyState,
      propDesc: clipboard.propDesc, // Copy description but keep ID empty for new record
      manufName: clipboard.manufName,
      serialId: clipboard.serialId,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setCompanyPropertyData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialCompanyPropertyState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setCompanyPropertyData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setCompanyPropertyData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchCompanyProperty(),
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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.propId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.propId; //

      // 1. Update Form View Data
      setCompanyPropertyData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Company Property">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          columns={COMPANY_COLUMNS}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          handleFindReplace={handleFindReplace}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Item *"
                value={companyPropertyData.propId}
                onChange={(e) => handleFieldChange("propId", e.target.value)}
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!companyPropertyData.isNew}
                className={
                  !companyPropertyData.isNew ? "bg-gray-100" : "bg-white"
                }
              />
              <FormInput
                label="Item Description *"
                value={companyPropertyData.propDesc}
                onChange={(e) => handleFieldChange("propDesc", e.target.value)}
              />
              <FormInput
                label="Manufacturer Name"
                value={companyPropertyData.manufName}
                onChange={(e) => handleFieldChange("manufName", e.target.value)}
              />
              <FormInput
                label="Serial Number"
                type="number"
                value={companyPropertyData.serialId}
                onChange={(e) => handleFieldChange("serialId", e.target.value)}
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.propId || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.propId || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setCompanyPropertyData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index ? "bg-blue-50 " : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.propId}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange("propId", e.target.value, index) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.propDesc}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "propDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.manufName}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "manufName",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          type="number"
                          value={item.serialId}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "serialId",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
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

export const ManageSecurityClearanceSettings = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE
  const [searchValue, setSearchValue] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialSecurityClearanceState = {
    hierarchyNo: "",
    clearanceCode: "",
    description: "",
    securityLevel: "",
    sciFlag: "N",
    sapFlag: "N",
    companyId: user.companyId || "1",
    modifiedBy: user.name,
    rowVersion: 0,
    isNew: true,
  };

  const [securityClearanceData, setSecurityClearanceData] = useState(
    initialSecurityClearanceState,
  );

  const [columns] = useState([
    "hierarchyNo",
    "clearanceCode",
    "description",
    "securityLevel",
    "sciFlag",
    "sapFlag",
  ]);

  const COLUMN_LABELS = {
    hierarchyNo: "Hierarchy",
    clearanceCode: "Security Clearance System ID",
    description: "Description",
    securityLevel: "Level",
    sciFlag: "SCI",
    sapFlag: "SAP",
  };

  const CLEARANCE_COLUMNS = [
    {
      id: "hierarchyNo",
      label: "Hierarchy",
      type: "text",
      allowReplace: false,
    },
    {
      id: "clearanceCode",
      label: "Security Clearance System ID",
      type: "text",
      allowReplace: false,
    },

    {
      id: "description",
      label: "Description",
      type: "text",
      allowReplace: true,
    },
    {
      id: "securityLevel",
      label: "Level",
      type: "text",
      allowReplace: true,
    },

    {
      id: "sciFlag",
      label: "SCI",
      type: "flag",
      allowReplace: true,
    },
    {
      id: "sapFlag",
      label: "SAP",
      type: "flag",
      allowReplace: true,
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  // const fetchSecuritClearance = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${backendUrl}/api/SecurityClearances/security-clearance`,
  //     );

  //     // 1. Get the array from the paginated response
  //     const propertyList = response.data.data;

  //     if (propertyList && propertyList.length > 0) {
  //       // 2. Map directly to ensure the UI state matches the API keys
  //       const mapped = propertyList.map((item) => ({
  //         ...item,
  //         isNew: false, // Explicitly mark as existing record
  //         // // Ensure numeric fields are handled if necessary
  //         // clearanceCode: item.clearanceCode,
  //         // description: item.description,
  //         // securityLevel: item.securityLevel,
  //         // sciFlag: item.sciFlag,
  //         // sapFlag: item.sapFlag,
  //         companyId: item.companyId || user.companyId || "1",
  //       }));

  //       setOriginalData(mapped);
  //       setSecurityClearanceData(mapped[0]);
  //       setCurrentIndex(0);
  //       setIsDirty(false);
  //     } else {
  //       setOriginalData([]);
  //       setSecurityClearanceData(initialSecurityClearanceState);
  //       toast.info("No company property records found.");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //     toast.error("Failed to fetch company property data");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchSecuritClearance = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `${backendUrl}/api/SecurityClearances/security-clearance`,
      );

      const propertyList = response.data.data || response.data;

      if (propertyList && propertyList.length > 0) {
        const mapped = propertyList.map((item) => ({
          ...item,
          isNew: false,
          // Extract nested level code to flat 'securityLevel' for the UI
          securityLevel:
            item.securityLevel?.securityLevelCode ||
            item.securityLevelCode ||
            "",
          companyId: item.companyId || user.companyId || "1",
        }));
        const firstId = mapped[0].clearanceCode;
        setSelectedRows(new Set([firstId]));
        setOriginalData(mapped);
        setData(mapped);
        setSecurityClearanceData(mapped[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setSecurityClearanceData(initialSecurityClearanceState);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch security clearance data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecuritClearance();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.hierarchyNo || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation check
    const invalidRow = rowsToSave.find(
      (row) => !row.hierarchyNo || !row.description,
    );
    if (invalidRow) {
      return toast.error("Hierarchy No and Description are required.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const payload = {
          clearanceCode: row.clearanceCode,
          hierarchyNo: parseInt(row.hierarchyNo),
          description: row.description,
          securityLevelCode: row.securityLevel,
          sciFlag: row.sciFlag || "N",
          sapFlag: row.sapFlag || "N",
          companyId: row.companyId || user.companyId || "1",
          modifiedBy: user.name || "System",
          timeStamp: new Date().toISOString(),
          rowVersion: row.rowVersion || 0,
          securityLevel: null,
        };

        if (row.isNew) {
          await axios.post(
            `${backendUrl}/api/SecurityClearances/security-clearance`,
            payload,
          );
        } else {
          await axios.put(
            `${backendUrl}/api/SecurityClearances/security-clearance`,
            payload,
          );
        }
        successCount++;
      }

      toast.success(`Successfully saved ${successCount} record(s).`);
      setIsDirty(false);
      fetchSecuritClearance();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      // Local removal for unsaved records
      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (!window.confirm(`Delete clearance "${currentRow.clearanceCode}"?`))
        return;
      idsToDelete = [currentRow.clearanceCode];
    } else {
      if (!selectedRows || selectedRows.size === 0)
        return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      // Parallel deletion
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(
            `${backendUrl}/api/SecurityClearances/security-clearance/${id}`,
          ),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchSecuritClearance();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...securityClearanceData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialSecurityClearanceState,
      clearanceCode: clipboard.clearanceCode,
      description: clipboard.description,
      securityLevel: clipboard.securityLevel,
      sciFlag: clipboard.sciFlag,
      sapFlag: clipboard.sapFlag,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setSecurityClearanceData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialSecurityClearanceState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setSecurityClearanceData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = async (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setSecurityClearanceData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchSecuritClearance(),
  };

  const levelCode = [
    { label: "Confidential", value: "C" },
    { label: "L Clearance", value: "L" },
    { label: "Q Clearance", value: "Q" },
    { label: "Secret", value: "S" },
    { label: "Top", value: "T" },
  ];

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.hierarchyNo).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.hierarchyNo; //

      // 1. Update Form View Data
      setSecurityClearanceData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Security Clearance Settings">
        <Toolbar
          columns={CLEARANCE_COLUMNS}
          isFormView={isFormView}
          isDirty={isDirty}
          jumpToCode={jumpToCode}
          setSearchValue={setSearchValue}
          handleFindReplace={handleFindReplace}
          searchValue={searchValue}
          securityClearanceData={securityClearanceData}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />
        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Hierarchy *"
                value={securityClearanceData.hierarchyNo}
                onChange={(e) =>
                  handleFieldChange("hierarchyNo", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!securityClearanceData.isNew}
                className={
                  !securityClearanceData.isNew ? "bg-gray-100" : "bg-white"
                }
              />
              <FormInput
                label="Security Clearance System ID *"
                value={securityClearanceData.clearanceCode}
                onChange={(e) =>
                  handleFieldChange("clearanceCode", e.target.value)
                }
              />
              <FormInput
                label="Description"
                value={securityClearanceData.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
              <FormSearchSelect
                label="Level"
                options={levelCode}
                // Access the specific field from your state
                value={securityClearanceData.securityLevel}
                displayKey="label" // Use 'label' to show "Confidential", etc.
                valueKey="value" // Use 'value' to store "C", "S", etc.
                onSelect={(val) =>
                  // 'val' is the entire object { label, value }
                  handleFieldChange("securityLevel", val.value)
                }
              />
              <FormInput
                type="checkbox"
                label="SCI"
                checked={securityClearanceData.sciFlag === "Y"}
                onChange={(e) =>
                  handleFieldChange("sciFlag", e.target.checked ? "Y" : "N")
                }
              />
              <FormInput
                type="checkbox"
                label="SAP"
                checked={securityClearanceData.sapFlag === "Y"}
                onChange={(e) =>
                  handleFieldChange("sapFlag", e.target.checked ? "Y" : "N")
                }
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.hierarchyNo || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["hierarchyNo", "acctName"].includes(
                      col,
                    );

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.hierarchyNo || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setScisapClearanceData(item);
                        setCurrentIndex(index);
                      }}
                      className={`${
                        currentIndex === index ? "bg-blue-50" : ""
                      }`}
                    >
                      <td
                        className="text-center tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.hierarchyNo}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "hierarchyNo",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.clearanceCode}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "clearanceCode",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.description}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "description",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <TableSearchSelect
                          options={levelCode}
                          // Match 'securityLevel' against the 'value' in your options
                          value={
                            levelCode.find(
                              (j) => j.value === item.securityLevel,
                            )?.value || ""
                          }
                          onSelect={(val) =>
                            // Pass the selected value and the row index
                            handleFieldChange("securityLevel", val.value, index)
                          }
                          // Optional: Only disable if you want to prevent editing existing records
                          disabled={!item.isNew}
                        />
                      </td>
                      {/* SCI Flag Cell */}
                      <td className="tbody-td ">
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={
                            item.sciFlag === "Y" || item.sciFlag === true
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              "sciFlag",
                              e.target.checked ? "Y" : "N",
                              index,
                            )
                          }
                        />
                      </td>

                      {/* SAP Flag Cell */}
                      <td className="tbody-td ">
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={
                            item.sapFlag === "Y" || item.sapFlag === true
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              "sapFlag",
                              e.target.checked ? "Y" : "N",
                              index,
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
        )}
      </MainContainer>
    </div>
  );
};

export const ManageSCISAPClearanceCode = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialScisapClearanceState = {
    clearanceCode: "",
    clearanceDescription: "",
    companyId: user.companyId || "1",
    modifiedBy: user.name,
    rowVersion: 0,
    isNew: true,
  };

  const [scisapClearanceData, setScisapClearanceData] = useState(
    initialScisapClearanceState,
  );

  const [columns] = useState(["clearanceCode", "clearanceDescription"]);

  const COLUMN_LABELS = {
    clearanceCode: "SCI/SAP Clearance Code",
    clearanceDescription: "SCI/SAP Clearance Description",
  };

  const CLEARANCE_DETAILS_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "clearanceCode",
      label: "SCI/SAP Clearance Code",
      type: "text",
      allowReplace: false, // Usually kept false for codes/IDs
    },

    // --- Description ---
    {
      id: "clearanceDescription",
      label: "SCI/SAP Clearance Description",
      type: "text",
      allowReplace: true,
    },
  ];

  const fetchSCISAPClearance = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/ScisapClearances`);

      // FIX: The JSON you provided is a direct array, not nested in .data.data
      const propertyList = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (propertyList && propertyList.length > 0) {
        const mapped = propertyList.map((item) => ({
          ...item,
          isNew: false,
          // Use clearanceCode as a unique identifier if hierarchyNo is missing
          hierarchyNo: item.hierarchyNo || item.clearanceCode,
        }));
        const firstId = mapped[0].clearanceCode;
        setSelectedRows(new Set([firstId]));
        setOriginalData(mapped);
        setData(mapped);
        setScisapClearanceData(mapped[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setScisapClearanceData(initialScisapClearanceState);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchSCISAPClearance = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(`${backendUrl}/api/ScisapClearances`);

  //     // 1. Get the array from the paginated response
  //     const propertyList = response.data.data;

  //     if (propertyList && propertyList.length > 0) {
  //       // 2. Map directly to ensure the UI state matches the API keys
  //       const mapped = propertyList.map((item) => ({
  //         ...item,
  //         isNew: false, // Explicitly mark as existing record
  //         // Ensure numeric fields are handled if necessary
  //         clearanceDescription: item.clearanceDescription,
  //       }));

  //       setOriginalData(mapped);
  //       setScisapClearanceData(mapped[0]);
  //       setCurrentIndex(0);
  //       setIsDirty(false);
  //     } else {
  //       setOriginalData([]);
  //       setScisapClearanceData(initialScisapClearanceState);
  //       toast.info("No company property records found.");
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //     toast.error("Failed to fetch company property data");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchSCISAPClearance();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.clearanceCode || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation
    const invalidRow = rowsToSave.find(
      (row) => !row.clearanceCode || !row.clearanceDescription,
    );
    if (invalidRow) {
      return toast.error("Code and Description are required for all changes.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/ScisapClearances`, payload);
        } else {
          await axios.put(`${backendUrl}/api/ScisapClearances/`, payload);
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Successfully saved ${successCount} record(s).`);
        setIsDirty(false);
        fetchSCISAPClearance();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      // Handle unsaved records locally
      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (!window.confirm(`Delete clearance "${currentRow.clearanceCode}"?`))
        return;
      idsToDelete = [currentRow.clearanceCode];
    } else {
      if (!selectedRows || selectedRows.size === 0)
        return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      // Parallel deletion for efficiency
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/ScisapClearances/${id}`),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchSCISAPClearance();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...scisapClearanceData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialScisapClearanceState,
      clearanceCode: clipboard.clearanceCode,
      clearanceDescription: clipboard.clearanceDescription,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setScisapClearanceData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialScisapClearanceState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setScisapClearanceData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setScisapClearanceData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchSCISAPClearance(),
  };

  const levelCode = [
    { label: "Confidential", value: "C" },
    { label: "L Clearance", value: "L" },
    { label: "Q Clearance", value: "Q" },
    { label: "Secret", value: "S" },
    { label: "Top", value: "T" },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.clearanceCode).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.clearanceCode; //

      // 1. Update Form View Data
      setScisapClearanceData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="SCI/SAP Clearance Codes">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          columns={CLEARANCE_DETAILS_COLUMNS}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          handleFindReplace={handleFindReplace}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="SCI/SAP Clearance Code *"
                value={scisapClearanceData.clearanceCode}
                onChange={(e) =>
                  handleFieldChange("clearanceCode", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!scisapClearanceData.isNew}
                className={
                  !scisapClearanceData.isNew ? "bg-gray-100" : "bg-white"
                }
              />
              <FormInput
                label="SCI/SAP Clearance Description *"
                value={scisapClearanceData.clearanceDescription}
                onChange={(e) =>
                  handleFieldChange("clearanceDescription", e.target.value)
                }
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.clearanceCode || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = [
                      "clearanceCode",
                      "clearanceDescription",
                    ].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.clearanceCode || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setScisapClearanceData(item);
                        setCurrentIndex(index);
                      }}
                      className={`${
                        currentIndex === index ? "bg-blue-50" : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* ORGANIZATION ID CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.clearanceCode}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "clearanceCode",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.clearanceDescription}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "clearanceDescription",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
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

export const ManageVendorEmplApvlGrps = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const [activeModal, setActiveModal] = useState(["User"]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const initialVeApvlGrpState = {
    veApprvlGrpCd: "",
    veApprvlGrpDesc: "",
    modifiedBy: user.name,
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    companyId: user.companyId || "1",
    isNew: true,
  };

  const [veAprvlGrpData, setVeAprvlGrpData] = useState(initialVeApvlGrpState);

  const [columns] = useState(["veApprvlGrpCd", "veApprvlGrpDesc"]);

  const COLUMN_LABELS = {
    veApprvlGrpCd: "Vendor Employee Approval Group",
    veApprvlGrpDesc: "Description",
  };

  const EMPLOYEE_APPROVAL_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "veApprvlGrpCd",
      label: "Vendor Employee Approval Group",
      type: "text",
      allowReplace: false, // Usually kept false for codes/IDs
    },

    // --- Description ---
    {
      id: "veApprvlGrpDesc",
      label: "Description",
      type: "text",
      allowReplace: true,
    },
  ];

  const detlJobValidMthds = [
    { id: "", name: "None" },
    { id: "N", name: "No Validation" },
    { id: "W", name: "Warning" },
    { id: "E", name: "Error" },
  ];

  const mapLaborCodesToNames = (record) => {
    if (!record) return initialVeApvlGrpState;
    // This component doesn't seem to use detlJobValidMthds based on your JSON,
    // so we just ensure isNew is false for fetched records.
    return {
      ...record,
      isNew: false,
    };
  };

  const fetchAprvlGrpCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/VeApvlGrp?companyId=${companyId}`,
      );

      // FIX: JSON is a direct array [...], not { data: [...] }
      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (responseData && responseData.length > 0) {
        const mapped = responseData.map((item) => mapLaborCodesToNames(item));

        setOriginalData(mapped);
        const firstId = mapped[0].veApprvlGrpCd;
        setSelectedRows(new Set([firstId]));
        setData(mapped);
        setVeAprvlGrpData(mapped[0]);
        setSelectedRows(mapped[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setVeAprvlGrpData(initialVeApvlGrpState);
        toast.info("No approval groups found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch approval groups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAprvlGrpCode();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.veApprvlGrpCd || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation
    const invalidRow = rowsToSave.find(
      (row) => !row.veApprvlGrpCd || !row.veApprvlGrpDesc,
    );
    if (invalidRow) {
      return toast.error("Group Code and Description are required.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/VeApvlGrp`, payload);
        } else {
          await axios.put(
            `${backendUrl}/api/VeApvlGrp/${row.veApprvlGrpCd}`,
            payload,
          );
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Successfully saved ${successCount} approval group(s).`);
        setIsDirty(false);
        fetchAprvlGrpCode();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      // Handle local removal for unsaved new rows
      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (
        !window.confirm(
          `Delete "${currentRow.veApprvlGrpDesc || currentRow.veApprvlGrpCd}"?`,
        )
      )
        return;
      idsToDelete = [currentRow.veApprvlGrpCd];
    } else {
      if (!selectedRows || selectedRows.size === 0)
        return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      // Parallel deletion using the custom route: /api/VeApvlGrp/{id}/{companyId}
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/VeApvlGrp/${id}/${companyId}`),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchAprvlGrpCode();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...veAprvlGrpData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialVeApvlGrpState,
      veApprvlGrpCd: clipboard.veApprvlGrpCd,
      veApprvlGrpDesc: clipboard.veApprvlGrpDesc,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setVeAprvlGrpData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialVeApvlGrpState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setVeAprvlGrpData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setVeAprvlGrpData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchAprvlGrpCode(),
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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.veApprvlGrpCd).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.veApprvlGrpCd; //

      // 1. Update Form View Data
      setVeAprvlGrpData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`Organization ID "${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Vendor Employee Approval Groups">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          jumpToCode={jumpToCode}
          handleFindReplace={handleFindReplace}
          columns={EMPLOYEE_APPROVAL_COLUMNS}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Vendor Employee Approval Group *"
                value={veAprvlGrpData.veApprvlGrpCd}
                onChange={(e) =>
                  handleFieldChange("veApprvlGrpCd", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!veAprvlGrpData.isNew}
                className={!veAprvlGrpData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Description *"
                value={veAprvlGrpData.veApprvlGrpDesc}
                onChange={(e) =>
                  handleFieldChange("veApprvlGrpDesc", e.target.value)
                }
                type="textarea"
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.veApprvlGrpCd || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = [
                      "veApprvlGrpCd",
                      "veApprvlGrpDesc",
                    ].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.veApprvlGrpCd || `new-${index}`;
                  const isSelected =
                    selectedRows instanceof Set && selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setVeAprvlGrpData(item);
                        setCurrentIndex(index);
                      }}
                      className={`${
                        currentIndex === index ? "bg-blue-50" : ""
                      }`}
                    >
                      <td
                        className="tbody-td text-center"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500 "
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* ORGANIZATION ID CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.veApprvlGrpCd}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "veApprvlGrpCd",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.veApprvlGrpDesc}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "veApprvlGrpDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>

      {activeModal.includes("User") && (
        <Users
          formData={veAprvlGrpData}
          selectedRow={selectedRows}
          handleInputChange={handleFieldChange}
          onClose={() =>
            setActiveModal((prev) => prev.filter((item) => item !== "User"))
          }
        />
      )}
    </div>
  );
};

export const Users = ({ formData, onClose }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [users, setUsers] = useState([]); // For Dropdown
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchValue, setSearchValue] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = "1";

  const initialUserState = {
    veApprvlGrpCd: formData.veApprvlGrpCd,
    apprvrUserId: "",
    fullName: "",
    modifiedBy: user.name || "System",
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    isNew: true,
  };

  // const jobTitles = [
  //   { id: "M", name: "Manager" },
  //   { id: "D", name: "Developer" },
  //   { id: "A", name: "Analyst" },
  //   { id: "C", name: "Consultant" },
  //   { id: "T", name: "Technician" },
  // ];

  const [subData, setSubData] = useState(initialUserState);

  // 1. Fetch Job Titles for the SearchSelect
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/User`);
      // Maps to id/name for the SearchSelect component
      const mapped = res.data.map((item) => ({
        id: item.username, // This is what goes into the state (apprvrUserId)
        name: item.fullName, // This is what the user sees in the dropdown
      }));
      setUsers(mapped);
    } catch (err) {
      toast.error("Failed to load Job Titles");
    }
  };

  // 2. Fetch Existing Assignments for this Training ID
  // const fetchAssignedJobs = async () => {
  //   if (!formData.veApprvlGrpCd) return;
  //   setIsLoading(true);
  //   try {
  //     const res = await axios.get(
  //       `${backendUrl}/api/VeApvlGrpUsers/by-group?groupCode=${formData.veApprvlGrpCd}&companyId=${companyId}`,
  //     );
  //     if (res.data && res.data.length > 0) {
  //       setOriginalData(res.data);
  //       setSubData(res.data[0]);
  //     } else {
  //       setOriginalData([]);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // 2. Fetch Existing Assignments (Aligned with your Fetch pattern)
  const fetchAssignedJobs = async () => {
    if (!formData.veApprvlGrpCd) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/api/VeApvlGrpUsers/by-group?groupCode=${formData.veApprvlGrpCd}&companyId=${companyId}`,
      );

      const responseData = res.data?.data || res.data;
      const finalData = Array.isArray(responseData) ? responseData : [];

      if (finalData.length > 0) {
        // Map to ensure isNew is false for existing records
        const mapped = finalData.map((item) => ({ ...item, isNew: false }));
        setOriginalData(mapped);
        setSubData(mapped[0]);
        setCurrentIndex(0);
        setSelectedRows(new Set([mapped[0].apprvrUserId]));
      } else {
        setOriginalData([]);
        setSubData(initialUserState);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAssignedJobs();
  }, [formData.veApprvlGrpCd]);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    setSubData((prev) => ({ ...prev, [field]: value }));

    setOriginalData((prev) => {
      const updated = [...prev];
      const targetIndex = index !== null ? index : currentIndex;
      if (updated[targetIndex]) {
        updated[targetIndex] = { ...updated[targetIndex], [field]: value };
      }
      return updated;
    });
  };

  const handleSave = async () => {
    // Use the ID from subData (the selected user in the modal)
    if (!formData.veApprvlGrpCd)
      return toast.error("Please select a group Code");

    setIsLoading(true);
    try {
      // Constructing Payload exactly as shown in your Swagger image
      const payload = {
        veApprvlGrpCd: formData.veApprvlGrpCd,
        apprvrUserId: subData.apprvrUserId, // Correctly mapped to API expectation
        companyId: companyId,
        modifiedBy: user.name || "Admin",
      };

      if (subData.isNew) {
        // POST: Flat object as per Swagger
        await axios.post(`${backendUrl}/api/VeApvlGrpUsers`, payload);
        toast.success("User assigned successfully!");
      } else {
        // PUT: Usually follows the same structure, check if your API supports PUT for this endpoint
        await axios.put(
          `${backendUrl}/api/VeApvlGrpUsers/${formData.veApprvlGrpCd}/${subData.username}`,
          payload,
        );
        toast.success("Updated successfully!");
      }

      setIsDirty(false);
      fetchAssignedJobs();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Error saving record",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    const newItem = { ...initialUserState };
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setSubData(newItem);
    setIsDirty(true);
  };

  const handleDelete = async () => {
    // Determine which IDs to delete based on the view
    const target = isFormView ? [subData.username] : Array.from(selectedRows);

    if (target.length === 0 || !target[0]) {
      return toast.info("Nothing selected to delete");
    }

    if (!window.confirm(`Delete ${target.length} selected item(s)?`)) return;

    setIsLoading(true);
    try {
      // Use Promise.all to handle multiple deletions if in table view
      await Promise.all(
        target.map((id) =>
          axios.delete(`${backendUrl}/api/VeApvlGrpUsers`, {
            params: {
              groupCode: formData.veApprvlGrpCd,
              userId: id,
              companyId: companyId,
            },
          }),
        ),
      );

      toast.success("Deleted successfully");
      setSelectedRows(new Set()); // Clear selection after delete
      fetchAssignedJobs();
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setIsLoading(false);
    }
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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.apprvrUserId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.apprvrUserId; //

      // 1. Update Form View Data
      setSubData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="mt-2">
      <SecondaryContainer title="User">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          jumpToCode={jumpToCode}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          actions={{
            onAdd: handleAdd,
            onSave: handleSave,
            onDelete: handleDelete,
            onToggleView: () => setIsFormView(!isFormView),
            onClear: () => fetchAssignedJobs(),
          }}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={(dir) => {
            let idx = currentIndex;
            if (dir === "next") idx++;
            if (dir === "prev") idx--;
            setSubData(originalData[idx]);
            setCurrentIndex(idx);
          }}
        />

        {isFormView ? (
          <div className="grid grid-cols-1 gap-1 mt-1">
            <FormSearchSelect
              label="User*"
              value={subData.apprvrUserId}
              options={users}
              displayKey="id"
              onSelect={(val) => {
                handleFieldChange("apprvrUserId", val.id);
                handleFieldChange("username", val.name);
              }}
              disabled={!subData.isNew} // Lock ID if updating
            />
            <FormInput
              label="Name"
              value={subData.username || ""}
              readOnly
              className="bg-gray-100"
            />
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedRows(
                            new Set(originalData.map((i) => i.apprvrUserId)),
                          );
                        else setSelectedRows(new Set());
                      }}
                    />
                  </th>
                  <th className="th-thead">User</th>
                  <th className="th-thead">Name</th>
                </tr>
              </thead>
              <tbody>
                {originalData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      setSubData(item);
                      setCurrentIndex(index);
                    }}
                    className={`${currentIndex === index ? "bg-blue-50" : ""}`}
                  >
                    <td className="tbody-td">
                      <input
                        type="checkbox"
                        className="accent-blue-500"
                        checked={selectedRows?.has(item.apprvrUserId)}
                        onChange={() => {
                          const next = new Set(selectedRows);
                          next.has(item.apprvrUserId)
                            ? next.delete(item.apprvrUserId)
                            : next.add(item.apprvrUserId);
                          setSelectedRows(next);
                          // apprvrUserId;
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <TableSearchSelect
                        options={users}
                        displayKey="id"
                        value={
                          users?.find((j) => j.id === item.apprvrUserId)
                            ?.name || ""
                        }
                        onSelect={(val) =>
                          handleFieldChange("apprvrUserId", val.id, index)
                        }
                        disabled={!item.isNew}
                      />
                    </td>
                    <td className="tbody-td">
                      {users?.find((u) => u.id === item.apprvrUserId)?.name ||
                        item.fullName ||
                        ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SecondaryContainer>
    </div>
  );
};

export const ManageSubcontractorInsuranceTypes = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialPolicyTypeState = {
    policyTypeCode: "",
    policyTypeDescription: "",
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    activeFl: "Y", // Based on your JSON "activeFl": "s"
    isNew: true,
  };

  const [policyData, setPolicyData] = useState(initialPolicyTypeState);

  const fetchPolicy = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/PolicyType`);

      // Access the 'data' property from your API response object
      const skillList = response.data.data;

      if (skillList && skillList.length > 0) {
        const firstId = skillList[0].policyTypeCode;
        setSelectedRows(new Set([firstId]));
        setOriginalData(skillList);
        setData(skillList);
        setPolicyData(skillList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        // Only show info if we expected data but got an empty list
        setPolicyData(initialPolicyTypeState);
        toast.info("No skill codes found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch skill codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.profOrgId || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation check
    const invalidRow = rowsToSave.find(
      (row) => !row.policyTypeCode || !row.policyTypeDescription,
    );
    if (invalidRow) {
      return toast.error("Code and Description are required.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/PolicyType`, payload);
        } else {
          await axios.put(
            `${backendUrl}/api/PolicyType/${row.policyTypeCode}`,
            payload,
          );
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Successfully saved ${successCount} record(s).`);
        setIsDirty(false);
        fetchPolicy();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      // Local removal for unsaved records
      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (
        !window.confirm(
          `Delete policy "${currentRow.policyTypeDescription || currentRow.policyTypeCode}"?`,
        )
      )
        return;
      idsToDelete = [currentRow.policyTypeCode];
    } else {
      if (!selectedRows || selectedRows.size === 0)
        return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      // Parallel execution for bulk deletion
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/PolicyType/${id}`),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchPolicy();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...policyData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialPolicyTypeState,
      policyTypeDescription: clipboard.policyTypeDescription, // Copy description but keep ID empty for new record
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setPolicyData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialPolicyTypeState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setPolicyData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setPolicyData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchPolicy(),
  };

  const [columns] = useState(["policyTypeCode", "policyTypeDescription"]);

  const COLUMN_LABELS = {
    policyTypeCode: "Policy Type",
    policyTypeDescription: "Description",
  };

  const INSURANCE_TYPE_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "policyTypeCode",
      label: "Policy Type",
      type: "text",
      allowReplace: false, // Usually kept false for codes/IDs
    },

    // --- Description ---
    {
      id: "policyTypeDescription",
      label: "Description",
      type: "text",
      allowReplace: true,
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.policyTypeCode).toLowerCase() ===
        String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.policyTypeCode; //

      // 1. Update Form View Data
      setPolicyData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Subcontractor Insurance Types">
        <Toolbar
          isFormView={isFormView}
          columns={INSURANCE_TYPE_COLUMNS}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          handleFieldChange={handleFieldChange}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Policy Type *"
                value={policyData.policyTypeCode}
                onChange={(e) =>
                  handleFieldChange("policyTypeCode", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!policyData.isNew}
                className={!policyData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Description *"
                value={policyData.policyTypeDescription}
                onChange={(e) =>
                  handleFieldChange("policyTypeDescription", e.target.value)
                }
                type="textarea"
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.policyTypeCode || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.policyTypeCode || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setPolicyData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index ? "bg-blue-50 " : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.policyTypeCode}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "policyTypeCode",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.policyTypeDescription}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "policyTypeDescription",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
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

export const ManageSubcontractorBondTypes = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialBondTypeState = {
    bondTypeCode: "",
    bondTypeDescription: "",
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    activeFl: "Y", // Based on your JSON "activeFl": "s"
    isNew: true,
  };

  const [bondTypeData, setBondTypeData] = useState(initialBondTypeState);

  const fetchBondType = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/BondType`);

      // Access the 'data' property from your API response object
      const skillList = response.data.data;

      if (skillList && skillList.length > 0) {
        const firstId = skillList[0].bondTypeCode;
        setSelectedRows(new Set([firstId]));
        setOriginalData(skillList);
        setData(skillList);
        setBondTypeData(skillList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        // Only show info if we expected data but got an empty list
        setBondTypeData(initialBondTypeState);
        toast.info("No skill codes found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch skill codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBondType();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.profOrgId || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation check for ID and Description
    const invalidRow = rowsToSave.find(
      (row) => !row.bondTypeCode || !row.bondTypeDescription,
    );
    if (invalidRow) {
      return toast.error("Bond Code and Description are required.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/BondType`, payload);
        } else {
          await axios.put(
            `${backendUrl}/api/BondType/${row.bondTypeCode}`,
            payload,
          );
        }
        successCount++;
      }

      if (successCount > 0) {
        toast.success(`Successfully saved ${successCount} record(s).`);
        setIsDirty(false);
        fetchBondType();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      // Local removal for unsaved records
      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (
        !window.confirm(
          `Delete bond type "${currentRow.bondTypeDescription || currentRow.bondTypeCode}"?`,
        )
      )
        return;
      idsToDelete = [currentRow.bondTypeCode];
    } else {
      if (!selectedRows || selectedRows.size === 0)
        return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      // Parallel execution for efficiency
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/BondType/${id}`),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchBondType();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...bondTypeData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialBondTypeState,
      bondTypeDescription: clipboard.bondTypeDescription, // Copy description but keep ID empty for new record
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setBondTypeData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialBondTypeState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setBondTypeData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setBondTypeData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchBondType(),
  };

  const [columns] = useState(["bondTypeCode", "bondTypeDescription"]);

  const COLUMN_LABELS = {
    bondTypeCode: "Bond Type",
    bondTypeDescription: "Description",
  };

  const BOND_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "bondTypeCode",
      label: "Bond Type",
      type: "text",
      allowReplace: false, // Usually kept false for codes/IDs
    },

    // --- Description ---
    {
      id: "bondTypeDescription",
      label: "Description",
      type: "text",
      allowReplace: true,
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.profOrgId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.profOrgId; //

      // 1. Update Form View Data
      setBondTypeData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Subcontractor Bond Types">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          handleFindReplace={handleFindReplace}
          columns={BOND_COLUMNS}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Bond Type *"
                value={bondTypeData.bondTypeCode}
                onChange={(e) =>
                  handleFieldChange("bondTypeCode", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!bondTypeData.isNew}
                className={!bondTypeData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Description *"
                value={bondTypeData.bondTypeDescription}
                onChange={(e) =>
                  handleFieldChange("bondTypeDescription", e.target.value)
                }
                type="textarea"
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.bondTypeCode || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.bondTypeCode || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setBondTypeData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index ? "bg-blue-50 " : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.bondTypeCode}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "bondTypeCode",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.bondTypeDescription}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "bondTypeDescription",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
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

export const ManageProspectiveVendorRejectionReasons = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const initialReasonCodeState = {
    rsnCd: "",
    rsnDesc: "",
    modifiedBy: "",
    sRsnWhUsedCd: "",
    updLastCtDtFl: "",
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    activeFl: "Y", // Based on your JSON "activeFl": "s"
    companyId: user.companyId || "1",
    isNew: true,
  };

  const [reasonCodeData, setReasonCodeData] = useState(initialReasonCodeState);

  const fetchBondType = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/ReasonCode`);

      // Access the 'data' property from your API response object
      const skillList = response.data.data;

      if (skillList && skillList.length > 0) {
        const firstId = skillList[0].rsnCd;
        setSelectedRows(new Set([firstId]));
        setOriginalData(skillList);
        setData(skillList);
        setReasonCodeData(skillList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        // Only show info if we expected data but got an empty list
        setReasonCodeData(initialReasonCodeState);
        toast.info("No skill codes found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch skill codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBondType();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);
    const targetIndex = index !== null ? index : currentIndex;

    if (targetIndex === null || targetIndex === -1) return;

    setOriginalData((prev) => {
      const updated = [...prev];
      updated[targetIndex] = {
        ...updated[targetIndex],
        [field]: value,
        isDirty: true,
      };
      return updated;
    });
  };

  // CHECKBOX TOGGLE
  const toggleRow = (index, id) => {
    const identifier = id || `new-${index}`; // Fallback for new records without ID
    const newSelected = new Set(selectedRows);
    if (newSelected.has(identifier)) newSelected.delete(identifier);
    else newSelected.add(identifier);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === originalData.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = originalData.map(
        (item, idx) => item.profOrgId || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    const rowsToSave = originalData.filter((row) => row.isNew || row.isDirty);

    if (rowsToSave.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    // Validation check
    const invalidRow = rowsToSave.find((row) => !row.rsnCd || !row.rsnDesc);
    if (invalidRow) {
      return toast.error("Reason Code and Description are required.");
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const row of rowsToSave) {
        const { isNew, isDirty, ...payload } = {
          ...row,
          modifiedBy: user?.name || "System",
          timeStamp: new Date().toISOString(),
        };

        if (row.isNew) {
          await axios.post(`${backendUrl}/api/ReasonCode`, payload);
        } else {
          // Put requires the ID and companyId as per your route logic
          await axios.put(
            `${backendUrl}/api/ReasonCode/${row.rsnCd}/${companyId}`,
            payload,
          );
        }
        successCount++;
      }

      toast.success(`Successfully saved ${successCount} record(s).`);
      setIsDirty(false);
      fetchBondType();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during save process.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    let idsToDelete = [];

    if (isFormView) {
      const currentRow = originalData[currentIndex];
      if (!currentRow) return;

      if (currentRow.isNew) {
        setOriginalData((prev) => prev.filter((_, i) => i !== currentIndex));
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      if (
        !window.confirm(
          `Delete reason "${currentRow.rsnDesc || currentRow.rsnCd}"?`,
        )
      )
        return;
      idsToDelete = [currentRow.rsnCd];
    } else {
      if (!selectedRows || selectedRows.size === 0)
        return toast.info("No rows selected");
      if (!window.confirm(`Delete ${selectedRows.size} selected items?`))
        return;
      idsToDelete = Array.from(selectedRows);
    }

    setIsLoading(true);
    try {
      // Parallel execution for bulk deletion with companyId context
      await Promise.all(
        idsToDelete.map((id) =>
          axios.delete(`${backendUrl}/api/ReasonCode/${id}/${companyId}`),
        ),
      );

      toast.success("Deleted successfully!");
      setSelectedRows(new Set());
      fetchBondType();
      if (isFormView) setCurrentIndex(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting records.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...reasonCodeData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialReasonCodeState,
      rsnDesc: clipboard.rsnDesc, // Copy description but keep ID empty for new record
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setReasonCodeData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialReasonCodeState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setReasonCodeData(newItem);
    setIsDirty(true);
  };

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;
    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1)
      newIndex++;
    else if (direction === "prev" && currentIndex > 0) newIndex--;
    else if (direction === "start") newIndex = 0;
    else if (direction === "end") newIndex = originalData.length - 1;

    setCurrentIndex(newIndex);
    setReasonCodeData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchBondType(),
  };

  const [columns] = useState(["rsnCd", "rsnDesc"]);

  const COLUMN_LABELS = {
    rsnCd: "Reason Code",
    rsnDesc: "Description",
  };

  const VENDOR_REJECTION_COLUMNS = [
    // --- Primary Identity ---
    {
      id: "rsnCd",
      label: "Reason Code",
      type: "text",
      allowReplace: false, // Usually kept false for codes/IDs
    },

    // --- Description ---
    {
      id: "rsnDesc",
      label: "Description",
      type: "text",
      allowReplace: true,
    },
  ];

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

    console.log(config);

    if (!column) return toast.warn("Please select a column first.");

    // setIsFormDirty(true);
    // setIsTableDirty(true);

    // --- 1. PRE-PROCESS TARGET VALUES ---
    const isPeriod = column.startsWith("pdNo");
    const isYear = column.startsWith("fyCd");
    const isFlag = column.endsWith("Fl") || column.endsWith("Flag");

    /**
     * REVISED TARGET FIND LOGIC:
     * We prioritize the specific field, but fallback to others if empty.
     * This fixes the issue where 'acct' is in findYear instead of findValue.
     */
    let targetFind = "";
    if (isPeriod) {
      targetFind = findMonth;
    } else if (isYear) {
      targetFind = findYear || findValue; // Use findValue as fallback for years
    } else {
      // For text and flags, use findValue, but check findYear as a fallback
      targetFind = findValue || findYear;
    }

    // --- 2. FIND (FILTER) LOGIC ---
    if (!isReplaceMode) {
      // If no value is provided in any field, reset the table
      if (!targetFind && !isFlag) {
        // Assuming 'data' is your original unfiltered source from props/state
        setOriginalData(data);
        return toast.info("Filter cleared.");
      }

      const searchValStr = String(targetFind).toLowerCase();

      const matches = data.filter((item) => {
        const currentValStr = String(item[column] || "").toLowerCase();

        // Flags, Periods, and Years usually require exact match
        // Other text fields use partial match (includes)
        return isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr);
      });

      if (matches.length > 0) {
        setOriginalData(matches);
        toast.info(`Showing ${matches.length} matches.`);
      } else {
        toast.error(`No matches found for "${targetFind}".`);
      }
      return;
    }

    // --- 3. REPLACE LOGIC ---
    // Apply similar fallback logic for replacement values
    let targetReplace = replaceValue;
    if (isYear) targetReplace = replaceYear || replaceValue;
    if (isPeriod) targetReplace = Number(replaceMonth || replaceValue);

    if (!targetFind && !isFlag) {
      if (!window.confirm("Search value is empty. Replace EVERY row?")) return;
    }

    if (isPeriod && (targetReplace < 1 || targetReplace > 12)) {
      return toast.error("Period must be 1-12.");
    }

    if (!window.confirm(`Bulk update matching records in ${column}?`)) return;

    // --- NEW LOGIC TO PREVENT DOUBLE TOAST ---
    let changeCount = 0;
    const searchValStr = String(targetFind).toLowerCase();

    // 1. Calculate the updated data outside of the state setter
    const updatedData = data.map((item) => {
      const currentValue = item[column];
      const currentValStr = String(currentValue || "").toLowerCase();

      // Fix: Matching logic should compare against searchValStr
      const isMatch =
        (!targetFind && !isFlag) ||
        (isPeriod || isYear || isFlag
          ? currentValStr === searchValStr
          : currentValStr.includes(searchValStr));

      if (isMatch) {
        let finalValue = targetReplace;

        if (isFlag) {
          const currentFlag = currentValue || "N";
          if (booleanMode === "inverted") {
            if (replaceValue === "All" || replaceValue === currentFlag) {
              finalValue = currentFlag === "Y" ? "N" : "Y";
            } else return item;
          } else {
            finalValue = replaceValue === "Y" ? "Y" : "N";
          }
        }

        if (finalValue !== currentValue) {
          changeCount++;
          return { ...item, [column]: finalValue, isDirty: true };
        }
      }
      return item;
    });

    // 2. Now update the state with the pre-calculated array
    if (changeCount > 0) {
      setOriginalData(updatedData); // Set the state once
      toast.success(`Updated ${changeCount} records.`);
      // setIsFormDirty?.(true); // Optional: mark form as dirty
    } else {
      toast.info("No records matched the criteria.");
    }
  };
  const jumpToCode = (code) => {
    if (!code) return;

    const found = originalData.find(
      (item) =>
        String(item.profOrgId).toLowerCase() === String(code).toLowerCase(),
    );

    console.log(found);

    if (found) {
      const id = found.tempId || found.profOrgId; //

      // 1. Update Form View Data
      setProfOrgData(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = originalData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`"${code}" not found.`); //
    }
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Prospective Vendor Rejection Reasons">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          columns={VENDOR_REJECTION_COLUMNS}
          handleFindReplace={handleFindReplace}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <FormInput
                label="Reason Code *"
                value={reasonCodeData.rsnCd}
                onChange={(e) =>
                  handleFieldChange("rsnCd", e.target.value.slice(0, 1))
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                maxLimit={1}
                readOnly={!reasonCodeData.isNew}
                className={!reasonCodeData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Description *"
                value={reasonCodeData.rsnDesc}
                onChange={(e) => handleFieldChange("rsnDesc", e.target.value)}
                type="textarea"
              />
            </div>
          </FormSection>
        ) : (
          <div className="overflow-x-auto max-h-[35vh] ">
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.rsnCd || `new-${idx}`,
                          );
                          setSelectedRows(new Set(allIds));
                        } else {
                          setSelectedRows(new Set());
                        }
                      }}
                    />
                  </th>
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["acctId", "acctName"].includes(col);

                    return (
                      <th key={col} className="th-thead">
                        {/* <div className="flex items-center justify-center "> */}
                        <div className="flex items-center justify-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          <span className="text-red-500">
                            {isRequired ? "*" : ""}
                          </span>
                        </div>
                        {/* </div> */}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="tbody">
                {originalData.map((item, index) => {
                  // FIX 1: DEFINE isSelected INSIDE THE MAP
                  // We use a fallback key `new-${index}` if the ID is empty (for new rows)
                  const rowId = item.rsnCd || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setReasonCodeData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index ? "bg-blue-50 " : ""
                      }`}
                    >
                      <td
                        className="tbody-td"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={isSelected} // NOW DEFINED
                          onChange={() => {
                            // This handles clicking the actual checkbox directly
                            const newSelected = new Set(selectedRows);
                            if (newSelected.has(rowId)) {
                              newSelected.delete(rowId);
                            } else {
                              newSelected.add(rowId);
                            }
                            setSelectedRows(newSelected);
                          }}
                        />
                      </td>
                      {/* CELL */}
                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.isNew ? "bg-white " : "bg-gray-100"}`}
                          value={item.rsnCd}
                          readOnly={!item.isNew}
                          placeholder={item.isNew ? "Enter ID..." : ""}
                          onChange={
                            (e) =>
                              handleFieldChange("rsnCd", e.target.value, index) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>

                      {/* DESCRIPTION CELL */}
                      <td className="tbody-td">
                        <input
                          className="td-input"
                          value={item.rsnDesc}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "rsnDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
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
