import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import {
  ActionButton,
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import {
  ActionDetailButton,
  FormInput,
  FormSection,
} from "../helper/formSection";
import { Trash2 } from "lucide-react";

const UserDefineLabel = ({ master = "ACCOUNT" }) => {
  const [labelData, setLabelData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [selectedLabels, setSelectedLabels] = useState(new Set());

  const handleAddOption = () => {
    if (selectedIdx === -1) {
      toast.warn("Please select a Label from the table first.");
      return;
    }
    const updatedData = [...labelData];
    const currentOptions = updatedData[selectedIdx].options || [];

    // Add a new blank option object
    updatedData[selectedIdx].options = [
      ...currentOptions,
      { label: "", value: "" },
    ];

    setLabelData(updatedData);
    // Keep the selected view in sync
    setSelectedAccount({ ...updatedData[selectedIdx] });
  };

  const handleOptionChange = (optIdx, field, value) => {
    const updatedData = [...labelData];
    const targetLabel = updatedData[selectedIdx];

    if (targetLabel) {
      const updatedOptions = [...(targetLabel.options || [])];

      // Check if the value actually changed to avoid unnecessary "dirty" triggers
      if (updatedOptions[optIdx][field] === value) return;

      updatedOptions[optIdx] = { ...updatedOptions[optIdx], [field]: value };

      targetLabel.options = updatedOptions;

      // 1. Update the lists
      setLabelData(updatedData);
      setSelectedAccount({ ...targetLabel });

      // 2. Set the "Dirty" flag to true
      setIsDirty(true);

      // Optional: Log the change for debugging enterprise state
      console.log(`Field ${field} updated. Form is now dirty.`);
    }
  };

  const fetchLabels = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(
        `${backendUrl}/api/UserDefinedLabels/udefGetByTableName?tableId=${master}&companyId=1`,
      );
      if (res.data) {
        setLabelData(res.data);
        setSelectedAccount(res.data[0]);
        setSelectedIdx(0);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
    setSelectedAccount([]);
  }, [master]);

  // 2. Add New Row Function
  const handleAddRow = () => {
    if (labelData.some((lb) => lb.isNew)) {
      toast.warn(
        "Please save or discard the changes before adding another row.",
      );
      return;
    }

    const newRow = {
      id: "", // Real ID for backend
      tempId: Date.now(), // Unique ID for React keys/tracking
      fieldName: "",
      dataType: "T",
      isMultiSelect: false,
      isRequired: false,
      isNew: true,
      values: [],
    };

    const newData = [newRow, ...labelData];
    setLabelData(newData);

    // Auto-select the new row for the form view
    setSelectedAccount(newRow);
    setSelectedIdx(newData.length - 1);
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...labelData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value,
      isDirty: true,
    };
    setLabelData(updatedData);

    // 2. Update the Form View (if the currently edited item is the selected one)
    if (index === selectedIdx) {
      setSelectedAccount((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSelectRow = (index) => {
    if (selectedIdx === index) {
      // Deselect if clicking the same row
      setSelectedIdx(-1);
      setSelectedAccount(null);
    } else {
      // Select the specific object from labelData
      // This ensures selectedAccount has all keys (id, fieldName, options, etc.)
      const dataToSelect = labelData[index];

      setSelectedIdx(index);
      setSelectedAccount(dataToSelect);
    }
  };

  const handleDelete = async () => {
    // 1. Ensure there is a selected account with a valid ID
    if (!selectedAccount || !selectedAccount.id) {
      console.error("No account selected for deletion");
      return;
    }

    // 2. Optional: Confirmation dialog
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      // 3. Call your dummy API (Replace with your actual endpoint)
      // We pass the ID directly from the selectedAccount object
      const response = await api.delete(
        `https://api.example.com/org/delete/${selectedAccount.id}`,
      );

      if (response.ok) {
        // 4. Update the local UI state after successful API deletion
        const updatedData = labelData.filter(
          (item) => item.id !== selectedAccount.id,
        );
        setLabelData(updatedData);

        // 5. Reset selection states to clear the form/view
        setSelectedIdx(-1);
        setSelectedAccount(null);

        console.log(`Successfully deleted ID: ${selectedAccount.id}`);
      } else {
        console.error("Failed to delete the record on the server");
      }
    } catch (error) {
      console.error("Error during delete operation:", error);
    }
  };

  const handleClear = async () => {
    // 1. Check if there are unsaved changes or a new row
    const hasNewRow = labelData.some((item) => item.isNew || item.isDirty);

    if (!hasNewRow) {
      toast.info("No changes to discard");
      return;
    }

    // If the form is dirty or there's a new unsaved row, ask for confirmation
    if (isFormDirty || hasNewRow) {
      if (
        !window.confirm("Are you sure you want to discard all unsaved changes?")
      ) {
        return;
      }
    }

    // 2. Simply re-fetch the data from the backend to reset the state
    await fetchLabels();

    // 3. Reset UI states
    setSelectedIdx(0); // Select the first item
    setSelectedAccount(labelData[0]);
    setIsFormDirty(false);
    setSearchValue("");

    toast.info("Changes discarded.");
  };

  const handleDiscard = async () => {
    // Optional: Confirm with the user if they have unsaved changes
    const hasNewRows = labelData.some((item) => item.isNew);

    if (!hasNewRows) {
      toast.info("No changes done");
      return;
    }

    if (hasNewRows || isFormDirty) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to discard them?",
        )
      ) {
        return;
      }
    }

    try {
      setIsLoading(true);
      // Re-run your fetch function to get the clean data from the database
      await fetchLabels();

      // Clear selection states
      setSelectedAccount(null);
      setSelectedIdx(-1);
      setIsFormDirty(false);

      toast.info("Changes discarded.");
    } catch (error) {
      toast.error("Failed to reset data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const newRows = labelData.filter(
        (item) => item.isNew === true || item.isDirty === true,
      );

      if (newRows.length === 0) {
        toast.info("No new rows to save.");
        return;
      }

      // --- VALIDATION ---
      for (const row of newRows) {
        if (!row.fieldName || !row.fieldName.trim()) {
          toast.error("Label (Field Name) is required for all new rows.");
          return; // Stop the save process
        }
      }

      const payload = newRows.map(({ isNew, tempId, options, ...rest }) => ({
        ...rest,
        // If there are options, dataType must be 'L' (List/Dropdown)
        // Otherwise, use the dataType from the state ('T' or 'N')
        dataType: options && options.length > 0 ? "L" : rest.dataType,

        // Send values as a flat array of strings
        values: options ? options.map((opt) => opt.label) : [],
        id: rest.id || 0,
      }));

      setIsLoading(true);

      await api.post(
        `${backendUrl}/api/UserDefinedLabels/AddField?tableId=${master}&companyId=1`,
        payload,
      );

      toast.success("New labels saved successfully!");
      await fetchLabels();
      setSelectedAccount(null);
      setSelectedIdx(-1);
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save new rows.");
    } finally {
      setIsLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = labelData.find(
      (item) => String(item.id).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.id; //

      // 1. Update Form View Data
      setSelectedAccount(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = labelData.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedIdx(new Set([newIdx]));
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

    const idx = labelData.findIndex(
      (x) =>
        (x.tempId || x.id) === (selectedAccount?.tempId || selectedAccount?.id),
    );

    let newIdx = idx;
    if (direction === "next" && idx < labelData.length - 1) newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = labelData.length - 1;

    if (newIdx !== idx) {
      const nextRecord = labelData[newIdx];
      const nextId = nextRecord.tempId || nextRecord.orgId;

      // 1. Update the record being shown in the form
      setSelectedAccount(nextRecord);
      setCurrentIndex(newIdx);

      // 2. CRITICAL: Update the selection so the table highlights this row
      setSelectedIdx(new Set([nextId]));

      setIsFormDirty(false);
    }
  };

  const handleCheckboxChange = (label) => {
    setSelectedLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    // 1. Safety Check
    if (selectedLabels.size === 0) return;

    // 2. Confirmation
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedLabels.size} selected items?`,
      )
    )
      return;

    try {
      // 3. Loop through each ID in the Set
      // Using for...of is cleaner for Sets
      for (const id of selectedLabels) {
        try {
          // Calling your API for each specific ID
          await api.delete(`https://api.example.com/labels/delete/${id}`);
        } catch (err) {
          console.error(`Failed to delete ID ${id}:`, err);
          // Depending on your requirements, you might want to 'continue'
          // or 'break' the loop here.
        }
      }

      // 4. Update local state only AFTER the loop finishes
      // This ensures the UI stays synced with the successful deletions
      setLabelData((prevData) =>
        prevData.filter((item) => !selectedLabels.has(item.id)),
      );

      // 5. Cleanup UI States
      setSelectedLabels(new Set());
      setSelectedIdx(-1);
      setSelectedAccount(null);

      console.log("All selected items processed.");
    } catch (error) {
      console.error("Bulk deletion process encountered an error:", error);
    }
  };

  const handleRowDoubleClick = (item, index) => {
    // 1. Set the active data row for the Form View
    setSelectedAccount(item);

    // 2. Extract the ID and update the selection state
    const currentId = item.orgId;
    setSelectedLabels(new Set([currentId]));

    // 3. Find and set the Index for the Toolbar counter
    // We use the 'data' array from your component's props/state

    console.log(index);
    setCurrentIndex(index);

    // 4. Switch the UI from Table to Form
    setIsFormView(true);
  };

  return (
    <div className="p-4 space-y-4 mt-10 animate-in z-10 fade-in duration-500">
      <MainContainer title="User Define label">
        <Toolbar
          currentIndex={currentIndex}
          totalRecords={labelData.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          selectedRow={selectedAccount}
          isFormView={isFormView}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          buttonsDisable={["copy", "paste"]}
          actions={{
            onAdd: handleAddRow,
            onSave: handleSave,
            onClear: handleDiscard,
            onDelete: handleDelete,
            onToggleView: () => {
              setIsFormView((prev) => {
                const nextViewIsForm = !prev;

                // If we are switching TO the Form View and nothing is selected
                if (
                  nextViewIsForm &&
                  selectedIdx === -1 &&
                  labelData.length > 0
                ) {
                  setSelectedIdx(0);
                  setSelectedAccount(labelData[0]);
                  setCurrentIndex(0);
                }

                return nextViewIsForm;
              });
            },
          }}
        />
        {isFormView ? (
          <div className="space-y-3 p-1 py-2">
            <FormSection title="Field Configuration">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-2">
                {/* Sequence Number */}
                <FormInput
                  label="Sequence No."
                  type="number"
                  disabled
                  value={selectedAccount?.id || ""}
                  onChange={(e) =>
                    handleInputChange(selectedIdx, "id", e.target.value)
                  }
                />

                {/* Label / Field Name */}
                <FormInput
                  label="Label"
                  required
                  disabled={!selectedAccount?.isNew}
                  value={selectedAccount?.fieldName || ""}
                  onChange={(e) =>
                    handleInputChange(selectedIdx, "fieldName", e.target.value)
                  }
                />
              </div>

              {/* Data Type Selection */}
              <div className="lg:col-span-3 flex items-center gap-3">
                <h1 className="block whitespace-nowrap text-[10px] font-[400] text-gray-800 mb-1">
                  Data Type
                </h1>
                <select
                  className={`w-full whitespace-nowrap text-[10px] p-1  border font-light border-gray-300 rounded-md bg-white`}
                  value={selectedAccount?.dataType || "T"}
                  onChange={(e) =>
                    handleInputChange(selectedIdx, "dataType", e.target.value)
                  }
                >
                  <option value="T">Text</option>
                  <option value="N">Number</option>
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {/* Boolean Controls */}
                <FormInput
                  label="Multiple Select"
                  type="checkbox"
                  checked={selectedAccount?.isMultiSelect}
                  onChange={(e) =>
                    handleInputChange(
                      selectedIdx,
                      "isMultiSelect",
                      e.target.checked,
                    )
                  }
                />
                <FormInput
                  label="Required Field"
                  type="checkbox"
                  checked={selectedAccount?.isRequired}
                  onChange={(e) =>
                    handleInputChange(
                      selectedIdx,
                      "isRequired",
                      e.target.checked,
                    )
                  }
                />
              </div>
            </FormSection>
          </div>
        ) : (
          /* --- TABLE VIEW --- */
          <div className="overflow-x-auto max-h-[35vh] border border-gray-300">
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead w-12"></th>
                  <th className="th-thead">Sequence No.</th>
                  <th className="th-thead">Data Type</th>
                  <th className="th-thead">Label</th>
                  <th className="th-thead w-12">Multiple Select</th>
                  <th className="th-thead w-12">Required</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {labelData.map((lvl, index) => (
                  <tr
                    key={lvl.tempId || lvl.id}
                    className="tr-tbody"
                    onDoubleClick={() => handleRowDoubleClick(lvl, index)}
                  >
                    {/* Row Selection Checkbox */}
                    <td className="tbody-td text-center w-12">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-blue-500"
                        checked={selectedIdx === index}
                        onChange={() => handleSelectRow(index)}
                      />
                    </td>

                    {/* Sequence No - Always Disabled */}
                    <td className="tbody-td text-center">
                      <input
                        type="number"
                        // disabled
                        className="td-input bg-gray-100"
                        value={lvl.id || ""}
                        onChange={(e) =>
                          handleInputChange(index, "id", e.target.value)
                        }
                      />
                    </td>

                    {/* Data Type - Disabled if not New */}
                    <td className="tbody-td text-center">
                      <select
                        // disabled={!lvl.isNew}
                        className={`td-input`}
                        value={lvl.dataType || "T"}
                        onChange={(e) =>
                          handleInputChange(index, "dataType", e.target.value)
                        }
                      >
                        <option value="T">Text</option>
                        <option value="N">Number</option>
                      </select>
                    </td>

                    {/* Label / FieldName - Disabled if not New */}
                    <td className="tbody-td text-center">
                      <input
                        // disabled={!lvl.isNew}
                        className={`td-input`}
                        value={lvl.fieldName || ""}
                        onChange={(e) =>
                          handleInputChange(index, "fieldName", e.target.value)
                        }
                      />
                    </td>

                    {/* Multiple Select Checkbox - Disabled if not New */}
                    <td className="tbody-td text-center w-12">
                      <input
                        type="checkbox"
                        // disabled={!lvl.isNew}
                        className="w-3 h-3 accent-blue-500 disabled:opacity-50"
                        checked={lvl.isMultiSelect}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "isMultiSelect",
                            e.target.checked,
                          )
                        }
                      />
                    </td>

                    {/* Required Checkbox - Disabled if not New */}
                    <td className="tbody-td text-center w-12">
                      <input
                        type="checkbox"
                        // disabled={!lvl.isNew}
                        className="w-3 h-3 accent-blue-500 disabled:opacity-50"
                        checked={lvl.isRequired}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "isRequired",
                            e.target.checked,
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>

      <SecondaryContainer>
        <>
          <div className="flex gap-2 justify-end py-1">
            {/* Only show/enable Add button if the account is new */}
            {selectedAccount && (
              <ActionDetailButton label="Add Label" onClick={handleAddOption} />
            )}
            <ActionButton
              icon={Trash2}
              onClick={handleDeleteSelected}
              // loading={loading}
              title="Delete"
            />
          </div>

          <div className="overflow-x-auto max-h-[35vh] border-t border-l border-gray-300">
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="th-thead"></th>
                  <th className="th-thead">Label</th>
                  <th className="th-thead">Value</th>
                </tr>
              </thead>
              {selectedIdx !== -1 && (
                <tbody className="tbody">
                  {selectedAccount?.options?.map((opt, optIdx) => (
                    <tr key={optIdx} className="tr-tbody">
                      <td className="tbody-td text-center w-10">
                        <input
                          type="checkbox"
                          className="h-3 w-3 cursor-pointer"
                          checked={selectedLabels.has(opt.label)}
                          onChange={() => handleCheckboxChange(opt.label)}
                          // Optional: disable if label is empty
                          disabled={!opt.label}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          // Disable if the main account record is not new
                          disabled={!selectedAccount}
                          className={`td-input ${
                            !selectedAccount
                              ? "bg-gray-100 cursor-not-allowed text-gray-500"
                              : "bg-white"
                          }`}
                          value={opt.label || ""}
                          onChange={(e) =>
                            handleOptionChange(optIdx, "label", e.target.value)
                          }
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          // disabled={!selectedAccount?.isNew}
                          className={`td-input`}
                          value={opt.value || ""}
                          onChange={(e) =>
                            handleOptionChange(optIdx, "value", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </>
      </SecondaryContainer>
    </div>
  );
};

export default UserDefineLabel;
