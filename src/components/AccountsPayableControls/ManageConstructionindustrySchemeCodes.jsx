import React, { useEffect, useState } from "react";
import { backendUrl } from ".././config";
import api from "../../utils/api";
import { toast } from "react-toastify";
import {
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../../helper/formSection";
import { MainContainer, Toolbar } from "../../helper/container";
import { TableSearchSelect } from "../../helper/tableSection";

const ManageConstructionindustrySchemeCodes = () => {
  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const [acct, setAcct] = useState([]);
  const [org, setOrg] = useState([]);
  const [refrences, setRefrences] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const getAcctOrg = async () => {
    try {
      const resAcct = await api.get(`${backendUrl}/api/Account/GetAllAccounts`);
      const resOrg = await api.get(`${backendUrl}/Orgnization/GetAllOrgs`);

      if (resAcct.data) {
        setAcct(resAcct.data);
      }
      if (resOrg.data) {
        setOrg(resOrg.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
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

  // const employee = formData.employees?.[0] || {};

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialInsCarInf = {
    cisCodeId: "",
    description: "",
    withholdingRate: 0,
    accountId: "",
    organizationId: "",
    accountName: "",
    organizationName: "",
    reference1Id: "",
    reference2Id: "",
    companyId: "1",
    modifiedBy: user.name,
  };

  const COLUMN_LABELS = {
    cisCodeId: "CIS Code *",
    description: "Description *",
    withholdingRate: "Withholding Rate *",
    accountId: "Account",
    organizationId: "Org",
    reference1Id: "Ref No 1",
    reference2Id: "Ref No 2",
  };

  const columns = Object.keys(COLUMN_LABELS);

  const fetchCisCode = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${backendUrl}/api/CisCodes?companyId=1`);

      if (response.data) {
        const data = response.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);
        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.cisCodeId === selectedEmp?.cisCodeId,
          );
          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.cisCodeId]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.cisCodeId]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(null);
          setSelectedEmps(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCisCode();
    getAcctOrg();
    refrence();
  }, []);

  const handleInputChange = (field, value, rowId) => {
    console.log(field, value, rowId);
    // setIsDirty(true);

    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.cisCodeId;

        if (String(itemId) === String(rowId)) {
          return {
            ...item,
            [field]: value,
            isDirty: true,
          }; // Removed the extra } and , that were here
        }
        return item;
      }),
    );

    // 2. Update the Active Record
    setSelectedEmp((prev) => {
      if (!prev) return prev;
      // Note: Make sure you use vendEmplId here to match the logic above
      const currentId = prev.tempId || prev.cisCodeId;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  // toolbar actions
  const handleAdd = () => {
    const hasUnsavedNew = vendorEmployee.some(
      (row) => row.isNew || !!row.tempId,
    );
    if (hasUnsavedNew) {
      toast.warn(
        "Please save or cancel the current new entry before adding another.",
      );
      return;
    }
    const newId = `TEMP_${Date.now()}`;
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const newRow = {
      ...initialInsCarInf, // Spread existing defaults
      tempId: newId, // Add the temporary tracker
      isNew: true, // Flag for API (POST instead of PUT)
      isDirty: true, // Flag to enable the Save button
      modifiedBy: userSession?.name || "system",
      companyId: "1",
    };
    setVendorEmployee([newRow, ...vendorEmployee]); // Add to the top of the list
    setSelectedEmps(new Set([newId])); // Check the checkbox for this new row
    setSelectedEmp(newRow); // Set as active data for the form view
    setCurrentIndex(0); // Focus the first position
  };

  const handleSaveAll = async () => {
    setLoading(true);
    // Check for any changes (New or Modified)
    const changedRows = vendorEmployee.filter(
      (row) => row?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    let validationError = "";

    const requiredFields = ["cisCodeId", "description", "withholdingRate"];
    for (const row of changedRows) {
      const missing = requiredFields.find(
        (field) => !row[field] || String(row[field]).trim() === "",
      );
      if (missing) {
        // Use formal field names for the toast
        const fieldName = missing.replace(/([A-Z])/g, " $1").toLowerCase();
        validationError = `Row ${vendorEmployee.indexOf(row) + 1}: ${fieldName} is required.`;
        break; // Exit loop on first error to keep toast clean
      }
    }
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // setLoading(true);
    try {
      const savePromises = changedRows.map(async (row) => {
        // 1. Prepare Payload (Vendor + Sub-modules)
        let payload = {
          ...row,
        };
        // 3. Prioritized API Selection
        if (row.isNew) {
          // CASE: If it's NEW (even if also Dirty), only call POST
          return api.post(`${backendUrl}/api/CisCodes`, payload);
        } else if (row.isDirty && !row.isNew) {
          return api.put(`${backendUrl}/api/CisCodes`, payload);
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // Reset flags
      // setIsDirty(false);
      // setIsFormDirty(false);

      // Refresh to get DB IDs and clear all local 'isNew'/'isDirty' states
      fetchCisCode();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // 1. Check if anything is selected
    setLoading(true);
    if (selectedEmps.size === 0) {
      toast.warn("Please select at least one vendor to delete.");
      return;
    }

    // Confirm with the user
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedEmps.size} selected item(s)?`,
      )
    ) {
      return;
    }

    // setLoading(true);
    try {
      // Convert Set to Array to use for...of or map
      const idsToDelete = Array.from(selectedEmps);

      for (const id of idsToDelete) {
        // Check if it's a temporary local row or a database row
        const isTemporary = String(id).startsWith("TEMP_");

        if (isTemporary) {
          // --- LOCAL DELETE ---
          // Just filter it out of the local state
          setVendorEmployee((prev) =>
            prev.filter((item) => item.tempId !== id),
          );
        } else {
          // --- SERVER DELETE ---
          // Call your API endpoint for the specific ID
          await api.delete(`${backendUrl}/api/CisCodes/${id}/1`);
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchCisCode(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorEmployee.find(
      (item) =>
        String(item.cisCodeId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.cisCodeId; //

      // 1. Update Form View vendorEmployee
      setSelectedEmp(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = vendorEmployee.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedEmps(new Set([id]));
    } else {
      toast.error(`Organization ID "${code}" not found.`); //
    }
  };

  const handleNavigate = (direction) => {
    // if (isFormDirty) {
    //   if (!window.confirm("You have unsaved changes. Discard them and move?")) {
    //     return;
    //   }
    // }

    const idx = vendorEmployee.findIndex(
      (x) =>
        (x.tempId || x.cisCodeId) ===
        (selectedEmp?.tempId || selectedEmp?.cisCodeId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorEmployee.length - 1)
      newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorEmployee.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorEmployee[newIdx];
      const nextId = nextRecord.tempId || nextRecord.cisCodeId;

      // 1. Update the record being shown in the form
      setSelectedEmp(nextRecord);
      setCurrentIndex(newIdx);

      // 2. CRITICAL: Update the selection so the table highlights this row
      setSelectedEmps(new Set([nextId]));

      // setIsFormDirty(false);
    }
  };

  const handleCopy = () => {
    const hasSelection = selectedEmps.size > 0 || selectedEmp;
    if (!hasSelection) {
      toast.warn("Select a skill record to copy first.");
      return;
    }

    // Determine rows: prioritize checkboxes, fallback to single form selection
    const rowsToCopy =
      selectedEmps.size > 0
        ? vendorEmployee.filter((item) =>
            selectedEmps.has(item.tempId || item.cisCodeId),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.cisCodeId) ===
              (selectedEmp?.tempId || selectedEmp?.cisCodeId),
          );

    // Generate Tab-Separated string for system clipboard
    const headerLine = columns.map((key) => COLUMN_LABELS[key]).join("\t");
    const dataLines = rowsToCopy
      .map((row) => columns.map((key) => row[key] || "").join("\t"))
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    navigator.clipboard
      .writeText(finalClipboardString)
      .then(() => {
        setClipboard(rowsToCopy);
        localStorage.setItem("skill_clipboard", JSON.stringify(rowsToCopy));
        toast.success(`${rowsToCopy.length} skill(s) copied.`);
      })
      .catch(() => toast.error("Clipboard access failed."));
  };

  const handlePaste = () => {
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("skill_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `SKILL_NEW_${Date.now()}_${index}`;
      return {
        ...row,
        cisCodeId: "", // Clear primary key for new entry
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        modifiedBy: userSession?.name || "system",
        entryDtt: new Date().toISOString().split("T")[0],
      };
    });

    // Update State (Add pasted rows to the top, keep original saved records)
    setVendorEmployee((prev) => [
      ...pastedRows,
      ...prev.filter((item) => !item.isNew),
    ]);

    if (pastedRows.length > 0) {
      setSelectedEmp(pastedRows[0]);
      setSelectedEmps(new Set([pastedRows[0].tempId]));
      setIsDirty(true);
    }
    toast.success(`${pastedRows.length} skill(s) pasted.`);
  };

  const handleDiscard = () => {
    // Check if any record in the current list is edited or new
    const hasUnsavedChanges = vendorEmployee.some(
      (item) => item.isNew || item.isDirty,
    );

    if (!isDirty && !hasUnsavedChanges) {
      toast.info("No changes found.");
      return;
    }

    if (window.confirm("Discard all unsaved skill changes and new records?")) {
      // Revert to original data snapshot
      setVendorEmployee([...allVendorEmployee]);

      // Reset UI flags
      setSelectedEmp(null);
      setSelectedEmps(new Set());
      setIsDirty(false);

      // Clear local clipboard
      setClipboard(null);
      localStorage.removeItem("skill_clipboard");

      fetchCisCode();

      toast.info("Changes discarded.");
    }
  };

  return (
    <div className="mt-14 ml-4">
      <MainContainer title={"Cunstruction industry Scheme Code"}>
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => {
              // If we are moving from Table to Form and no record is selected
              if (!isFormView && !selectedEmp && vendorEmployee.length > 0) {
                const firstRecord = vendorEmployee[0];

                // 1. Set the individual selected record
                setSelectedEmp(firstRecord);

                // 2. Add the ID to your Set (selectedEmps)
                setSelectedEmps((prevSet) => {
                  const newSet = new Set(prevSet);
                  // Use cisCodeId (or tempId for new unsaved rows)
                  newSet.add(firstRecord.cisCodeId || firstRecord.tempId);
                  return newSet;
                });
              }

              // Finally, flip the view state
              setIsFormView(!isFormView);
            },
          }}
          currentIndex={currentIndex}
        />
        {isFormView ? (
          <div className="p-2 space-y-2">
            <FormSection>
              <div className="grid grid-cols-2 md:grid-cols-4">
                <FormInput
                  label="CIS Code"
                  required
                  readOnly={!selectedEmp?.isNew}
                  value={selectedEmp?.cisCodeId}
                  onChange={(e) =>
                    handleInputChange(
                      "cisCodeId",
                      e.target.value,
                      selectedEmp.tempId || selectedEmp.cisCodeId,
                    )
                  }
                />
                <FormInput
                  label="Description"
                  required
                  value={selectedEmp?.description}
                  onChange={(e) =>
                    handleInputChange(
                      "description",
                      e.target.value,
                      selectedEmp.tempId || selectedEmp.cisCodeId,
                    )
                  }
                />
              </div>

              <div className="flex flex-col">
                <div className="space-y-1 w-[50%]">
                  <FormInput
                    label="Withholding Rate"
                    type="number"
                    required
                    value={selectedEmp?.withholdingRate}
                    onChange={(e) =>
                      handleInputChange(
                        "withholdingRate",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.cisCodeId,
                      )
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FormSearchSelect
                    label="Account"
                    value={selectedEmp?.accountId || ""}
                    // searchTerm={searchTerm}
                    // setSearchTerm={setSearchTerm}
                    options={acct}
                    displayKey="acctId"
                    secondaryKey="acctName"
                    onSelect={(opt) => {
                      handleInputChange(
                        "accountId",
                        opt.acctId,
                        selectedEmp?.tempId || selectedEmp?.cisCodeId,
                      );
                      handleInputChange(
                        "accountName",
                        opt.acctName,
                        selectedEmp?.tempId || selectedEmp?.cisCodeId,
                      );
                    }}
                  />
                  <FormInput readOnly value={selectedEmp?.accountName} />
                </div>
                <div className="flex items-center gap-2">
                  <FormSearchSelect
                    label="Organization"
                    value={selectedEmp?.organizationId || ""}
                    // searchTerm={searchTerm}
                    // setSearchTerm={setSearchTerm}
                    options={org}
                    displayKey="orgId"
                    secondaryKey="orgName"
                    onSelect={(opt) => {
                      handleInputChange(
                        "organizationId",
                        opt.orgId,
                        selectedEmp?.tempId || selectedEmp?.cisCodeId,
                      );
                      handleInputChange(
                        "organizationName",
                        opt.orgName,
                        selectedEmp?.tempId || selectedEmp?.cisCodeId,
                      );
                    }}
                  />
                  <FormInput readOnly value={selectedEmp?.organizationName} />
                </div>
                <div className="space-y-1 w-[50%]">
                  <FormSearchSelect
                    label="Ref No 1"
                    value={selectedEmp?.reference1Id || ""}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    options={refrences.filter(
                      (t) =>
                        String(t.refStrucId)
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        t.refStrucName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    )}
                    displayKey="refStrucId"
                    secondaryKey="refStrucName"
                    onSelect={(selectedOpt) => {
                      // 2. Update the ID field (number/string)
                      handleInputChange(
                        "reference1Id",
                        selectedOpt.refStrucId,
                        selectedEmp?.tempId || selectedEmp?.cisCodeId,
                      );
                    }}
                  />
                  <FormSearchSelect
                    label="Ref No 2"
                    value={selectedEmp?.reference2Id || ""}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    options={refrences.filter(
                      (t) =>
                        String(t.refStrucId)
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        t.refStrucName
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    )}
                    displayKey="refStrucId"
                    secondaryKey="refStrucName"
                    onSelect={(selectedOpt) => {
                      // 2. Update the ID field (number/string)
                      handleInputChange(
                        "reference2Id",
                        selectedOpt.refStrucId,
                        selectedEmp?.tempId || selectedEmp?.cisCodeId,
                      );
                    }}
                  />
                </div>
              </div>
            </FormSection>
          </div>
        ) : (
          <div className={`overflow-x-auto max-h-[35vh]`}>
            <table className="min-w-full text-sm border border-gray-300 rounded">
              <thead className="bg-gray-200 sticky top-0 z-10 ">
                <tr>
                  {/* {canEdit("manageAccount") && ( */}
                  <th className="th-thead w-10">
                    {/* <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                          /> */}
                  </th>

                  {columns.map((col) => (
                    <th className="th-thead">
                      <div className="flex items-center justify-center">
                        <span>{COLUMN_LABELS[col]}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="tbody">
                {vendorEmployee?.map((item) => (
                  <tr
                    key={item.tempId || item.cisCodeId}
                    className={`${
                      selectedEmps.has(item.tempId || item.cisCodeId)
                        ? "bg-blue-50"
                        : ""
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="text-center tbody-td ">
                      <input
                        type="checkbox"
                        checked={selectedEmps.has(
                          item.tempId || item.cisCodeId,
                        )}
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent row onClick from firing twice
                          const uniqueKey = item.tempId || item.cisCodeId;
                          const newSet = new Set(selectedEmps);
                          if (newSet.has(uniqueKey)) {
                            newSet.delete(uniqueKey);
                            setSelectedEmp(null);
                          } else {
                            newSet.add(uniqueKey);
                            setSelectedEmp(item);
                          }
                          setSelectedEmps(newSet);
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className={`td-input bg-gray-50 min-w-[180px] ${item?.isNew ? "bg-gray-100" : "bg-white"}`}
                        value={item.cisCodeId || ""}
                        disabled={!item?.isNew}
                        onChange={(e) =>
                          handleInputChange(
                            "cisCodeId",
                            e.target.value,
                            item.tempId || item.cisCodeId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-50 min-w-[180px]"
                        value={item.description || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "description",
                            e.target.value,
                            item.tempId || item.cisCodeId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-50 min-w-[180px]"
                        value={item.withholdingRate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "withholdingRate",
                            e.target.value,
                            item.tempId || item.cisCodeId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <TableSearchSelect
                        options={acct}
                        value={item?.accountId || ""}
                        displayKey="acctId"
                        secondaryKey="acctName"
                        onSelect={(val) => {
                          handleInputChange(
                            "accountId",
                            val.acctId,
                            item?.tempId || item?.cisCodeId,
                          );
                          handleInputChange(
                            "accountName",
                            val.acctName,
                            item?.tempId || item?.cisCodeId,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <TableSearchSelect
                        options={org}
                        value={item?.organizationId || ""}
                        displayKey="orgId"
                        secondaryKey="orgName"
                        onSelect={(val) => {
                          handleInputChange(
                            "organizationId",
                            val.orgId,
                            item?.tempId || item?.cisCodeId,
                          );
                          handleInputChange(
                            "organizationName",
                            val.orgName,
                            item?.tempId || item?.cisCodeId,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <TableSearchSelect
                        options={org}
                        value={item?.organizationId || ""}
                        displayKey="orgId"
                        secondaryKey="orgName"
                        onSelect={(val) => {
                          handleInputChange(
                            "organizationId",
                            val.orgId,
                            item?.tempId || item?.cisCodeId,
                          );
                          handleInputChange(
                            "organizationName",
                            val.orgName,
                            item?.tempId || item?.cisCodeId,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <TableSearchSelect
                        //   id={`ref1-${item?.tempId || item?.cisCodeId}`}
                        options={refrences}
                        value={item?.reference1Id || ""}
                        displayKey="refStrucId"
                        secondaryKey="refStrucName"
                        onSelect={(val) => {
                          handleInputChange(
                            "reference1Id",
                            val.refStrucId,
                            item?.tempId || item?.cisCodeId,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <TableSearchSelect
                        // id={`ref2-${item?.tempId || item?.cisCodeId}`}
                        options={refrences}
                        value={item?.reference2Id || ""}
                        displayKey="refStrucId"
                        secondaryKey="refStrucName"
                        onSelect={(val) => {
                          handleInputChange(
                            "reference2Id",
                            val.refStrucId,
                            item?.tempId || item?.cisCodeId,
                          );
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export default ManageConstructionindustrySchemeCodes;
