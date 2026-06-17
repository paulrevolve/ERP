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

export const VendorEmployeeDetail = ({
  formData,
  selectedRow,
  onClose,
  loading,
}) => {
  const [currentTab, setCurrentTab] = useState("Information");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons
  const [activeSub, setActiveSub] = useState([]);

  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  // const employee = formData.employees?.[0] || {};

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialLabor = {
    // Existing Fields
    vendEmplId: "",
    vendEmplName: "",
    vendId: "",
    vendName: "",
    effectStartDt: "",
    companyId: "1",
    effectEndDt: "",
    dfGenlLabCatCd: "",
    dfGenlLabCatCdDesc: "",
    vendEmplStatus: "",
    dfBillLabCatCd: "",
    dfBillLabCatCdDesc: "",
    detlJobCd: "",
    detlJobCdDesc: "",
    mgrEmplId: "",
    mgrEmplIdDesc: "",
    dfltInvcRtAmt: 0,
    cityName: "",
    countyName: "",
    mailStateDc: "",
    postalCd: "",
    countryCd: "",
    modifiedBy: user.name,

    firstName: "",
    lastName: "",
    midName: "",
    subctrId: "",
    teEmplId: "",
    vendEmplAprvrId: "",
    vendEmplAprvlDt: "",
    vendEmplAprvlCd: "",
    intEmail: "",
    extEmail: "",
    intPhone: "",
    extPhone: "",
    cellPhone: "",
    cont1Name: "",
    cont1Rel: "",
    cont1Phone1: "",
    cont1Phone2: "",
    cont1Phone3: "",
    cont2Name: "",
    cont2Rel: "",
    cont2Phone1: "",
    cont2Phone2: "",
    cont2Phone3: "",
    usCitizenFl: false,
    itarStatus: "",
  };
  const [columns] = useState([
    "vendId",
    "vendName",
    "vendEmplId",
    "vendEmplName",
    "dfGenlLabCatCd",
    "dfBillLabCatCd",
    "firstName",
    "lastName",
    "midName",
    "vendEmplStatus",
    "termDate",
    "vendEmplAprvrId",
    "vendEmplAprvlCd",
    "vendEmplAprvlDt",
    "intEmail",
    "extEmail",
    "intPhone",
    "extPhone",
    "cellPhone",
    "cont1Name",
    "cont1Rel",
    "cont1Phone1",
    "cont1Phone2",
    "cont1Phone3",
    "cont2Name",
    "cont2Rel",
    "cont2Phone1",
    "cont2Phone2",
    "cont2Phone3",
  ]);

  const COLUMN_LABELS = {
    // Identity & Status
    vendId: "Vendor ID",
    vendName: "Vendor Name",
    vendEmplId: "Employee ID",
    vendEmplName: "Employee Name",
    dfGenlLabCatCd: "Gen. Labor Cat",
    dfBillLabCatCd: "Billing Labor Cat",
    firstName: "First Name",
    lastName: "Last Name",
    midName: "Middle Name",
    vendEmplStatus: "Status",
    termDate: "Termination Date",
    vendEmplAprvrId: "Approver ID",
    vendEmplAprvlCd: "Approval Status",
    vendEmplAprvlDt: "Approval Date",
    // Contact Info
    intEmail: "Internal Email",
    extEmail: "External Email",
    intPhone: "Office Phone",
    extPhone: "External Phone",
    cellPhone: "Mobile Phone",

    // Emergency Contact 1
    cont1Name: "Emerg. Contact 1",
    cont1Rel: "Relationship 1",
    cont1Phone1: "Phone 1",
    cont1Phone2: "Phone 2",
    cont1Phone3: "Phone 3",
    // Emergency Contact 2
    cont2Name: "Emerg. Contact 2",
    cont2Rel: "Relationship 2",
    cont2Phone1: "Phone 1",
    cont2Phone2: "Phone 2",
    cont2Phone3: "Phone 3",
  };

  const glcOptions = [
    { id: "G01", name: "General Labor" },
    { id: "G02", name: "Supervision" },
  ];
  const plcOptions = [{ id: "P01", name: "Professional Level 1" }];
  const jobOptions = [{ id: "ENG", name: "Engineer" }];
  const managerOptions = [{ id: "M101", name: "John Doe" }];
  const stateOptions = [{ id: "M101", name: "John Doe" }];
  const cityOptions = [{ id: "M101", name: "John Doe" }];
  const postalCodeOptions = [{ id: "M101", name: "John Doe" }];

  const fetchVendorEmployee = async () => {
    // if (!selectedRow) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-employees?page=1&pageSize=2000000&${selectedRow ? `vendId=${selectedRow.vendId}` : ""}&companyId=1&sortBy=vend_empl_id&sortOrder=asc`,
      );

      if (response.data && response.data.data) {
        const data = response.data.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);

        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.vendEmplId === selectedEmp?.vendEmplId,
          );

          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.vendEmplId]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.vendEmplId]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(null);
          setSelectedEmps(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  useEffect(() => {
    fetchVendorEmployee();
  }, [selectedRow]);

  useEffect(() => {
    fetchVendorEmployee();
  }, []);

  const handleInputChange = (field, value, rowId) => {
    // setIsDirty(true);
    console.log(field, value, rowId);

    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.vendEmplId;

        console.log(item);

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
      const currentId = prev.tempId || prev.vendEmplId;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  // toolbar actions
  const handleAdd = () => {
    if (!selectedRow) {
      toast.warn("Select the vendor first!");
      return;
    }
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
      ...initialLabor, // Spread existing defaults
      vendId: selectedRow?.vendId, // Clear ID for new entry
      tempId: newId, // Add the temporary tracker
      isNew: true, // Flag for API (POST instead of PUT)
      isDirty: true, // Flag to enable the Save button
      modifiedBy: userSession?.name || "system",
    };
    setVendorEmployee([newRow, ...vendorEmployee]); // Add to the top of the list
    setSelectedEmps(new Set([newId])); // Check the checkbox for this new row
    setSelectedEmp(newRow); // Set as active data for the form view
    setCurrentIndex(0); // Focus the first position
  };

  const handleSaveAll = async () => {
    // Check for any changes (New or Modified)
    const changedRows = vendorEmployee.filter(
      (row) => row?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
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
          return api.post(`${backendUrl}/api/vendor-employees`, payload);
        } else if (row.isDirty && !row.isNew) {
          return api.put(
            `${backendUrl}/api/vendor-employees/${payload.vendEmplId}/${payload.vendId}/1`,
            payload,
          );
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // Reset flags
      // setIsDirty(false);
      // setIsFormDirty(false);

      // Refresh to get DB IDs and clear all local 'isNew'/'isDirty' states
      fetchVendorEmployee();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const handleDelete = async () => {
    // 1. Check if anything is selected
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
          await api.delete(
            `${backendUrl}/api/vendor-employees/${id}/${selectedRow.vendId}/1`,
          );
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchVendorEmployee(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorEmployee.find(
      (item) =>
        String(item.vendEmplId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.vendEmplId; //

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
        (x.tempId || x.vendEmplId) ===
        (selectedEmp?.tempId || selectedEmp?.vendEmplId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorEmployee.length - 1)
      newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorEmployee.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorEmployee[newIdx];
      const nextId = nextRecord.tempId || nextRecord.vendEmplId;

      // 1. Update the record being shown in the form
      setSelectedEmp(nextRecord);
      setCurrentIndex(newIdx);

      // 2. CRITICAL: Update the selection so the table highlights this row
      setSelectedEmps(new Set([nextId]));

      // setIsFormDirty(false);
    }
  };

  const handleCopy = () => {
    // 1. Validation
    const hasSelection = selectedEmps.size > 0 || selectedEmp;
    if (!hasSelection) {
      toast.warn("Select an employee record to copy first.");
      return;
    }

    setIsDirty(true);

    // 2. Determine which rows to copy (assuming vendorEmployee is your main list)
    const rowsToCopy =
      selectedEmps.size > 0
        ? vendorEmployee.filter((item) =>
            selectedEmps.has(item.tempId || item.vendEmplId),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.vendEmplId) ===
              (selectedEmp?.tempId || selectedEmp?.vendEmplId),
          );

    // 3. Define the headers using your COLUMN_LABELS
    const headerLine = columns
      .map((key) => COLUMN_LABELS[key] || key)
      .join("\t");

    // 4. Define the data rows
    const dataLines = rowsToCopy
      .map((row) =>
        columns
          .map((key) => {
            const value = row[key];
            // Simple formatting for dates or nulls
            return value || "";
          })
          .join("\t"),
      )
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    // 5. Write to Clipboard
    navigator.clipboard
      .writeText(finalClipboardString)
      .then(() => {
        setClipboard(rowsToCopy); // Local state for immediate paste
        localStorage.setItem(
          "vendor_employee_clipboard",
          JSON.stringify(rowsToCopy),
        );
        toast.success(`${rowsToCopy.length} employee(s) copied.`);
      })
      .catch(() => toast.error("Failed to copy to system clipboard."));
  };

  const handlePaste = () => {
    // 1. Retrieve data
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("vendor_employee_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    // 2. Map into new Employee objects
    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `EMP_NEW_${Date.now()}_${index}`;

      // We create a shallow copy and reset the specific identifying fields
      return {
        ...row,
        vendEmplId: "", // Clear primary key so user can enter a new one
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        modifiedBy: userSession?.name || "system",
        entryDtt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      };
    });

    // 3. Filter out existing unsaved "New" rows to prevent clutter
    const filterOutUnsaved = (prevList) =>
      prevList.filter((item) => !item.isNew && !item.tempId);

    // 4. Update State (using your vendorEmployee setter)
    setVendorEmployee((prev) => [...pastedRows, ...filterOutUnsaved(prev)]);

    // 5. Focus and Select the first pasted row
    if (pastedRows.length > 0) {
      const firstPasted = pastedRows[0];

      setSelectedEmp(firstPasted);
      setSelectedEmps(new Set([firstPasted.tempId]));
      setCurrentIndex(0);
      setIsDirty(true);
    }

    toast.success(`${pastedRows.length} employee(s) pasted.`);
  };

  const handleDiscard = () => {
    // 1. Check if there are any "New" (unsaved) records in the working list
    const hasNewRecords = vendorEmployee.some(
      (item) => item.isNew || item.isDirty,
    );

    // 2. If nothing changed and no new records, just exit
    if (!isDirty && !hasNewRecords) {
      toast.info("No changes found.");
      return;
    }

    // 3. Confirm with the user
    if (
      window.confirm("Discard all unsaved employee changes and new records?")
    ) {
      // 4. Reset the working list to the original data from the last fetch/load
      // This removes all 'isNew' records and reverts edits
      setVendorEmployee([...allVendorEmployee]);

      // 5. Reset UI States
      setSelectedEmp(null); // Clear the form selection
      setSelectedEmps(new Set()); // Clear table checkboxes
      setIsDirty(false); // Reset the dirty flag

      // 6. Clear Local Clipboard (to prevent accidental pastes later)
      setClipboard(null);
      localStorage.removeItem("vendor_employee_clipboard");

      toast.info("Changes discarded.");
    }
  };

  return (
    <div className="mt-4 pt-4 border-t-2 border-[#17414d]/20 animate-in slide-in-from-top-2 duration-300">
      <MainContainer title="Vendor Employees" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onClear: handleDiscard,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onToggleView: () => setIsFormView(!isFormView),
          }}
          currentIndex={currentIndex}
        />

        {isFormView ? (
          <div className="space-y-3 mt-2">
            {/* Identification Row */}
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                label="Vendor ID"
                value={selectedEmp?.vendId || ""}
                readOnly
                // onChange={(e) =>
                //   handleInputChange(
                //     "vendId",
                //     e.target.value,
                //     selectedEmp.tempId || selectedEmp.vendEmplId,
                //   )
                // }
              />
              <FormInput
                label="Vendor Name"
                required
                value={selectedEmp?.vendId || ""}
                readOnly
                // onChange={(e) =>
                //   handleInputChange(
                //     "vendId",
                //     e.target.value,
                //     selectedEmp.tempId || selectedEmp.vendEmplId,
                //   )
                // }
              />
              <FormInput
                label="Vendor Employee ID"
                value={selectedEmp?.vendEmplId || ""}
                onChange={(e) =>
                  handleInputChange(
                    "vendEmplId",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.vendEmplId,
                  )
                }
                readOnly={!selectedEmp?.isNew}
              />
              <FormInput
                label="Vendor Employee Name"
                required
                value={selectedEmp?.vendEmplName || ""}
                onChange={(e) =>
                  handleInputChange(
                    "vendEmplName",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.vendEmplId,
                  )
                }
              />
              <FormInput
                label="Default GLC"
                value={selectedEmp?.dfGenlLabCatCd || ""}
                onChange={(e) =>
                  handleInputChange(
                    "dfGenlLabCatCd",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.vendEmplId,
                  )
                }
              />
              <FormInput
                label="Default PLC"
                value={selectedEmp?.dfBillLabCatCd || ""}
                onChange={(e) =>
                  handleInputChange(
                    "dfBillLabCatCd",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.vendEmplId,
                  )
                }
              />
            </div>

            <div className="border-t border-gray-200 pt-2">
              {/* Tab Navigation */}
              <div className="flex gap-4 px-4 text-[11px] font-bold text-gray-500 mb-1">
                {["Information", "Contacts"].map((tab) => (
                  <span
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`cursor-pointer pb-0.5 transition-all ${
                      currentTab === tab
                        ? "text-[#17414d] border-b-2 border-[#17414d]"
                        : "hover:text-[#17414d]"
                    }`}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              {currentTab === "Information" && (
                <FormSection className="space-y-4">
                  <div className="flex gap-2 w-full">
                    <FormInput
                      label="Last Name"
                      required
                      className="flex-1"
                      value={selectedEmp?.lastName || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "lastName",
                          e.target.value,
                          selectedEmp.tempId || selectedEmp.vendEmplId,
                        )
                      }
                    />
                    <FormInput
                      label="First Name"
                      required
                      className="flex-1"
                      value={selectedEmp?.firstName || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "firstName",
                          e.target.value,
                          selectedEmp.tempId || selectedEmp.vendEmplId,
                        )
                      }
                    />
                    <FormInput
                      label="Middle Name"
                      required
                      className="flex-1"
                      value={selectedEmp?.midName || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "midName",
                          e.target.value,
                          selectedEmp.tempId || selectedEmp.vendEmplId,
                        )
                      }
                    />
                  </div>

                  <div className="flex gap-4 mt-2">
                    <FormSection
                      title="Vendor Employee Status"
                      className="flex-1"
                    >
                      <div className="flex gap-4">
                        {["Active", "Inactive"].map((status) => (
                          <FormInput
                            key={status}
                            type="radio"
                            label={status}
                            // value should be the specific option (Active or Inactive)
                            value={status}
                            // checked compares the current employee state to this specific option
                            checked={selectedEmp?.vendEmplStatus === status}
                            onChange={() =>
                              handleInputChange(
                                "vendEmplStatus",
                                status, // Pass the clicked status directly
                                selectedEmp?.tempId || selectedEmp?.vendEmplId,
                              )
                            }
                          />
                        ))}
                      </div>
                      <FormInput
                        label="Termination Date"
                        type="date"
                        value={selectedEmp?.termDate}
                        onChange={(e) =>
                          handleInputChange(
                            "termDate",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                    </FormSection>

                    <FormSection title="Approval Criteria" className="flex-1">
                      <FormInput
                        label="Approver ID"
                        value={selectedEmp?.vendEmplAprvrId || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplAprvrId",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                      <FormInput
                        label="Approval Status"
                        value={selectedEmp?.vendEmplAprvlCd || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplAprvlCd",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                      <FormInput
                        label="Approval Date"
                        type="date"
                        // Format the value to YYYY-MM-DD
                        value={
                          selectedEmp?.vendEmplAprvlDt
                            ? selectedEmp.vendEmplAprvlDt.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplAprvlDt",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                    </FormSection>
                  </div>
                </FormSection>
              )}

              {currentTab === "Contacts" && (
                <div className="gap-4 py-2 animate-in fade-in duration-300">
                  <div className="grid grid-cols-2 gap-2">
                    <FormSection title="E-Mail Addresses">
                      <FormInput
                        label="Internal"
                        type="email"
                        value={selectedEmp?.intEmail || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "intEmail",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                      <FormInput
                        label="External"
                        type="email"
                        value={selectedEmp?.extEmail || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "extEmail",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                    </FormSection>
                    <FormSection title="Phone Numbers">
                      <FormInput
                        label="Internal"
                        value={selectedEmp?.intPhone || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "intPhone",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                        required
                      />
                      <FormInput
                        label="External"
                        value={selectedEmp?.extPhone || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "extPhone",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                      <FormInput
                        label="Mobile"
                        value={selectedEmp?.cellPhone || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cellPhone",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                    </FormSection>
                  </div>
                  {/* <div className="col-span-2 grid grid-cols-2 gap-8 border-t border-gray-200 mt-2 pt-2">
                  <FormSection title="EmergencyContacts">
                    <FormInput label="Contact1" required />
                    <FormInput label="Name" />
                    <FormInput label="Relationship" />
                    <FormInput label="Phone 1" />
                    <FormInput label="Phone 2" />
                    <FormInput label="Phone 3" />
                    <FormInput label="Contact2" required />
                    <FormInput label="Name" />
                    <FormInput label="Relationship" />
                    <FormInput label="Phone 1" />
                    <FormInput label="Phone 2" />
                    <FormInput label="Phone 3" />
                  </FormSection>
                </div> */}
                  <div className="col-span-2 border-t border-gray-200 mt-2 pt-2">
                    <FormSection title="Emergency Contacts">
                      {/* Flex container to create two columns */}
                      <div className="flex gap-8">
                        {/* Contact 1 Column */}
                        <div className="flex-1 space-y-1">
                          {/* <FormInput
                          label="Contact 1"
                          value={selectedEmp?.cellPhone || ""}
                          onChange={(e) =>
                            handleEmployeeChange("extEmail", e.target.value)
                          }
                          required
                        /> */}
                          <p>Contact 1</p>
                          <FormInput
                            label="Name"
                            value={selectedEmp?.cont1Name || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont1Name",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                          <FormInput
                            label="Relationship"
                            value={selectedEmp?.cont1Rel || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont1Rel",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                          <FormInput
                            label="Phone 1"
                            value={selectedEmp?.cont1Phone1 || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont1Phone1",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                          <FormInput
                            label="Phone 2"
                            value={selectedEmp?.cont1Phone2 || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont1Phone2",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                          <FormInput
                            label="Phone 3"
                            value={selectedEmp?.cont1Phone3 || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont1Phone3",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                        </div>

                        {/* Vertical Divider (Optional) */}
                        <div className="w-[1px] bg-gray-200 self-stretch"></div>

                        {/* Contact 2 Column */}
                        <div className="flex-1 space-y-1">
                          {/* <FormInput label="Contact 2" required /> */}
                          <p>Contact 2</p>
                          <FormInput
                            label="Name"
                            value={selectedEmp?.cont2Name || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont2Name",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                          <FormInput
                            label="Relationship"
                            value={selectedEmp?.cont2Rel || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont2Rel",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                          <FormInput
                            label="Phone 1"
                            value={selectedEmp?.cont2Phone1 || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont2Phone1",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                          <FormInput
                            label="Phone 2"
                            value={selectedEmp?.cont2Phone2 || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont2Phone2",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                          <FormInput
                            label="Phone 3"
                            value={selectedEmp?.cont2Phone3 || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "cont2Phone3",
                                e.target.value,
                                selectedEmp.tempId || selectedEmp.vendEmplId,
                              )
                            }
                          />
                        </div>
                      </div>
                    </FormSection>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions - This handles the second level of modals */}
            <div className="flex flex-wrap gap-1 p-1.5 ">
              <ActionDetailButton
                label="Labor Information and History"
                icon={History}
                isActive={activeSubModal.includes("Labor")}
                onClick={() =>
                  setActiveSubModal((prevArray) => [...prevArray, "Labor"])
                }
              />
              <ActionDetailButton
                label="Certifications"
                icon={Award}
                isActive={activeSubModal.includes("Certification")}
                onClick={() =>
                  setActiveSubModal((prevArray) => [
                    ...prevArray,
                    "Certification",
                  ])
                }
              />
              <ActionDetailButton
                label="Skills"
                icon={ShieldCheck}
                isActive={activeSubModal.includes("Skills")}
                onClick={() =>
                  setActiveSubModal((prevArray) => [...prevArray, "Skills"])
                }
              />
              <ActionDetailButton
                label="Trainings"
                icon={GraduationCap}
                isActive={activeSubModal.includes("Trainings")}
                onClick={() =>
                  setActiveSubModal((prevArray) => [...prevArray, "Trainings"])
                }
              />
              {/* <ActionDetailButton
              label="Security"
              icon={Lock}
              isActive={activeSubModal === "Security"}
              onClick={() => setActiveSubModal("Security")}
            /> */}
              <ActionDetailButton
                label="Properties"
                icon={Settings2}
                isActive={activeSubModal.includes("Properties")}
                onClick={() =>
                  setActiveSubModal((prevArray) => [...prevArray, "Properties"])
                }
              />
            </div>

            {/* Render the inner view based on activeSubModal */}
            {activeSubModal.includes("Properties") && (
              <VendorEmployeeProperties
                selectedRow={selectedRow || selectedEmp}
                selectedVendorEmp={selectedEmp}
                setActiveSubModal={setActiveSubModal}
                formData={formData}
              />
            )}

            {activeSubModal.includes("Trainings") && (
              <VendorEmployeeTraining
                selectedRow={selectedRow || selectedEmp}
                selectedVendorEmp={selectedEmp}
                setActiveSubModal={setActiveSubModal}
                formData={formData}
              />
            )}

            {activeSubModal.includes("Skills") && (
              <VendorEmployeeSkills
                selectedRow={selectedRow || selectedEmp}
                selectedVendorEmp={selectedEmp}
                setActiveSubModal={setActiveSubModal}
                formData={formData}
              />
            )}

            {activeSubModal.includes("Certification") && (
              <VendorEmployeeCertification
                selectedRow={selectedRow || selectedEmp}
                selectedVendorEmp={selectedEmp}
                setActiveSubModal={setActiveSubModal}
                formData={formData}
              />
            )}

            {activeSubModal.includes("Labor") && (
              <VendorEmployeeLabour
                selectedRow={selectedRow || selectedEmp}
                setActiveSub={setActiveSub}
                activeSub={activeSub}
                selectedVendorEmp={selectedEmp}
                setActiveSubModal={setActiveSubModal}
                formData={formData}
              />
            )}
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
                  {/* )} */}
                  {columns.map((col) => {
                    // List of columns that should have a "Check All" header

                    const isRequired = ["vendEmplId", "vendEmplName"].includes(
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
                  {/* <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Action
                    </th> */}
                </tr>
              </thead>
              <tbody className="tbody">
                {vendorEmployee?.map((item) => (
                  <tr
                    key={item.tempId || item.vendEmplId}
                    // Add an onClick to the row itself for a better UX
                    onClick={() => setSelectedEmp(item)}
                    className={`${
                      selectedEmps.has(item.id || item.vendEmplId)
                        ? "bg-blue-50"
                        : ""
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="text-center tbody-td ">
                      <input
                        type="checkbox"
                        checked={selectedEmps.has(
                          item.tempId || item.vendEmplId,
                        )}
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent row onClick from firing twice
                          const uniqueKey = item.tempId || item.vendEmplId;
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

                    {/* Vendor ID (ReadOnly) */}
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-50 cursor-not-allowed"
                        value={item.vendId || ""}
                        readOnly
                      />
                    </td>

                    {/* Vendor Name (ReadOnly) */}
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-50 cursor-not-allowed min-w-[180px]"
                        value={item.vendName || ""}
                        readOnly
                      />
                    </td>

                    {/* Vendor Employee ID */}
                    <td className="tbody-td">
                      <input
                        className="td-input"
                        value={item.vendEmplId || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplId",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        readOnly={item?.isNew}
                      />
                    </td>

                    {/* Vendor Employee Name */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[200px]"
                        value={item.vendEmplName || ""}
                        required
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplName",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                      />
                    </td>

                    {/* Default GLC */}
                    <td className="tbody-td">
                      <input
                        className="td-input"
                        value={item.dfGenlLabCatCd || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "dfGenlLabCatCd",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                      />
                    </td>

                    {/* Default PLC */}
                    <td className="tbody-td">
                      <input
                        className="td-input"
                        value={item.dfBillLabCatCd || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "dfBillLabCatCd",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                      />
                    </td>

                    {/* Name Fields */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[120px]"
                        value={item.firstName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "firstName",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="First Name"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[120px]"
                        value={item.lastName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "lastName",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="Last Name"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[100px]"
                        value={item.midName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "midName",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="Middle"
                      />
                    </td>

                    {/* Employee Status (Dropdown is better for tables than Radios) */}
                    <td className="tbody-td">
                      <select
                        className="td-input bg-transparent"
                        value={item.vendEmplStatus || "Active"}
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplStatus",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>

                    {/* Termination Date */}
                    <td className="tbody-td">
                      <FormInput
                        type="date"
                        value={selectedEmp?.termDate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "termDate",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                    </td>

                    {/* Approval Fields */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[110px]"
                        value={item.vendEmplAprvrId || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplAprvrId",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="Approver ID"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[110px]"
                        value={item.vendEmplAprvlCd || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplAprvlCd",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="Status Code"
                      />
                    </td>
                    <td className="tbody-td">
                      <FormInput
                        type="date"
                        value={selectedEmp?.vendEmplAprvlDt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "vendEmplAprvlDt",
                            e.target.value,
                            selectedEmp.tempId || selectedEmp.vendEmplId,
                          )
                        }
                      />
                    </td>

                    {/* --- E-Mail Addresses --- */}
                    <td className="tbody-td">
                      <input
                        type="email"
                        className="td-input min-w-[180px]"
                        value={item.intEmail || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "intEmail",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="Internal Email"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="email"
                        className="td-input min-w-[180px]"
                        value={item.extEmail || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "extEmail",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="External Email"
                      />
                    </td>

                    {/* --- Phone Numbers --- */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.intPhone || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "intPhone",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="Internal Phone"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.extPhone || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "extPhone",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="External Phone"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.cellPhone || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cellPhone",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="Mobile"
                      />
                    </td>

                    {/* --- Emergency Contact 1 --- */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[150px]"
                        value={item.cont1Name || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont1Name",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E1 Name"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[100px]"
                        value={item.cont1Rel || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont1Rel",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E1 Rel."
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.cont1Phone1 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont1Phone1",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E1 Phone"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.cont1Phone2 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont1Phone2",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E1 Phone"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.cont1Phone3 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont1Phone3",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E1 Phone"
                      />
                    </td>

                    {/* --- Emergency Contact 2 --- */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[150px]"
                        value={item.cont2Name || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont2Name",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E2 Name"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[100px]"
                        value={item.cont2Rel || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont2Rel",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E2 Rel."
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.cont2Phone1 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont2Phone1",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E2 Phone"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.cont2Phone2 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont2Phone2",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E2 Phone"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[130px]"
                        value={item.cont2Phone3 || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cont2Phone3",
                            e.target.value,
                            item.tempId || item.vendEmplId,
                          )
                        }
                        // placeholder="E2 Phone"
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

const VendorEmployeeProperties = ({
  selectedRow,
  selectedVendorEmp,
  setActiveSubModal,
  formData,
}) => {
  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isDirty, setIsDirty] = useState(false);
  const [clipboard, setClipboard] = useState([]);

  const [item, setItem] = useState([]);

  // const employee = formData.employees?.[0] || {};

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialLabor = {
    emplId: "",
    propId: "",
    propQty: 0,
    propOwnCode: "",
    assetId: "",
    itemNo: 0,
    modelNo: "",
    serialNo: "",
    manufacturer: "",
    issueDate: "",
    returnDate: "",
    whseName: "",
    controlId: "",
    otherS: "",
    companyId: "1",
    modifiedBy: user.name,
  };

  const COLUMN_LABELS = {
    propId: "Item",
    sklldesc: "Description",
    propQty: "Quantity",
    propOwnCode: "Ownership",
    issueDate: "Issue Date",
    whseName: "Warehouse",
    returnDate: "Return Date",
    controlId: "Stock Number",
    assetId: "Asset No",
    itemNo: "Item No",
    manufacturer: "Manufacturer",
    modelNo: "Model No",
    serialNo: "Serial No",
  };

  const columns = Object.keys(COLUMN_LABELS);

  const glcOptions = [
    { id: "G01", name: "General Labor" },
    { id: "G02", name: "Supervision" },
  ];
  const plcOptions = [{ id: "P01", name: "Professional Level 1" }];
  const jobOptions = [{ id: "ENG", name: "Engineer" }];
  const managerOptions = [{ id: "M101", name: "John Doe" }];
  const stateOptions = [{ id: "M101", name: "John Doe" }];
  const cityOptions = [{ id: "M101", name: "John Doe" }];
  const postalCodeOptions = [{ id: "M101", name: "John Doe" }];

  const fetchItem = async () => {
    try {
      const res = await api.get(
        `${backendUrl}/api/CompanyProperty?page=1&pageSize=10`,
      );

      if (res.data.data) {
        setItem(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVendorEmployeeProp = async () => {
    if (!selectedRow || !selectedVendorEmp) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/SubcProperty?vendId=${selectedRow.vendId}&vendEmplId=${selectedVendorEmp.vendEmplId}&companyId=1&page=1&pageSize=50`,
      );

      if (response.data && response.data.data) {
        const data = response.data.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);

        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.propId === selectedEmp?.propId,
          );

          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.propId]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.propId]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(data[0]);
          setSelectedEmps(new Set(data[0].propId));
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  useEffect(() => {
    fetchVendorEmployeeProp();
    fetchItem();
  }, []);

  const handleInputChange = (field, value, rowId) => {
    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.propId;

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
      const currentId = prev.tempId || prev.propId;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  // toolbar actions
  const handleAdd = () => {
    if (!selectedRow) {
      toast.warn("Select the vendor first!");
      return;
    }
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
      ...initialLabor, // Spread existing defaults
      VendEmplId: selectedVendorEmp?.vendEmplId,
      vendId: selectedRow?.vendId,
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
    // Check for any changes (New or Modified)
    const changedRows = vendorEmployee.filter(
      (row) => row?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
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
          return api.post(`${backendUrl}/api/SubcProperty`, payload);
        } else if (row.isDirty && !row.isNew) {
          return api.put(`${backendUrl}/api/SubcProperty`, payload);
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // Reset flags
      // setIsDirty(false);
      // setIsFormDirty(false);

      // Refresh to get DB IDs and clear all local 'isNew'/'isDirty' states
      fetchVendorEmployeeProp();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const handleDelete = async () => {
    // 1. Check if anything is selected
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
          await api.delete(
            `${backendUrl}/api/SubcProperty/${selectedVendorEmp.vendEmplId}/${selectedRow.vendId}/${id}/1`,
          );
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchVendorEmployeeProp(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorEmployee.find(
      (item) =>
        String(item.propId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.propId; //

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
        (x.tempId || x.propId) === (selectedEmp?.tempId || selectedEmp?.propId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorEmployee.length - 1)
      newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorEmployee.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorEmployee[newIdx];
      const nextId = nextRecord.tempId || nextRecord.propId;

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
      toast.warn("Select a property record to copy first.");
      return;
    }

    // Determine rows based on selection
    const rowsToCopy =
      selectedEmps.size > 0
        ? vendorEmployee.filter((item) =>
            selectedEmps.has(item.tempId || item.propId),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.propId) ===
              (selectedEmp?.tempId || selectedEmp?.propId),
          );

    // Create TSV String
    const headerLine = columns.map((key) => COLUMN_LABELS[key]).join("\t");
    const dataLines = rowsToCopy
      .map((row) => columns.map((key) => row[key] || "").join("\t"))
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    navigator.clipboard
      .writeText(finalClipboardString)
      .then(() => {
        setClipboard(rowsToCopy);
        localStorage.setItem("property_clipboard", JSON.stringify(rowsToCopy));
        toast.success(`${rowsToCopy.length} item(s) copied.`);
      })
      .catch(() => toast.error("Failed to copy."));
  };

  const handlePaste = () => {
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("property_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `PROP_NEW_${Date.now()}_${index}`;
      return {
        ...row,
        propId: "", // Clear ID so it generates a new one on save
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        modifiedBy: userSession?.name || "system",
        entryDtt: new Date().toISOString().split("T")[0],
      };
    });

    // Merge into main list (Keeping existing records, adding pasted ones at top)
    setVendorEmployee((prev) => [
      ...pastedRows,
      ...prev.filter((item) => !item.isNew),
    ]);

    if (pastedRows.length > 0) {
      setSelectedEmp(pastedRows[0]);
      setSelectedEmps(new Set([pastedRows[0].tempId]));
      setIsDirty(true);
    }
    toast.success(`${pastedRows.length} item(s) pasted.`);
  };

  const handleDiscard = () => {
    // Check if any record in the list is currently marked as new or edited
    const hasUnsavedChanges = vendorEmployee.some(
      (item) => item.isNew || item.isDirty,
    );

    if (!isDirty && !hasUnsavedChanges) {
      toast.info("No changes found.");
      return;
    }

    if (window.confirm("Discard all unsaved asset changes and new records?")) {
      // Revert to the master backup (allVendorEmployee)
      setVendorEmployee([...allVendorEmployee]);

      // Reset UI States
      setSelectedEmp(null);
      setSelectedEmps(new Set());
      setIsDirty(false);

      // Cleanup local clipboard
      setClipboard(null);
      localStorage.removeItem("property_clipboard");

      toast.info("Changes discarded.");
    }
  };

  return (
    <div>
      <MainContainer
        title={"Properties"}
        handleClose={() =>
          setActiveSubModal((prev) =>
            prev.filter((item) => item !== "Properties"),
          )
        }
      >
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onClear: handleDiscard,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onToggleView: () => setIsFormView(!isFormView),
          }}
          currentIndex={currentIndex}
        />
        {isFormView ? (
          <div>
            <div className="grid grid-cols-4 gap-x-8 gap-y-2">
              {/* <FormSearchSelect
                label="Item"
                value={selectedEmp?.propId || ""}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                options={item}
                displayKey="itemId"
                onSelect={(opt) =>
                  handleInputChange(
                    "itemId",
                    opt.value,
                    selectedEmp?.tempId || selectedEmp?.propId,
                  )
                }
              /> */}
              <FormInput
                label="Item"
                required
                onChange={(e) =>
                  handleInputChange(
                    "propId",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.propId,
                  )
                }
                value={selectedEmp?.propId}
              />
              <FormInput type="text" value={selectedEmp?.sklldesc} readOnly />
              <FormInput
                label="Quantity"
                type="number"
                required
                onChange={(e) =>
                  handleInputChange(
                    "propQty",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.propId,
                  )
                }
                value={selectedEmp?.propQty}
              />
              <FormSection title="Ownership">
                {["Company Issued", "Customer Furnished"].map((status) => (
                  <FormInput
                    key={status}
                    type="radio"
                    label={status}
                    name="propOwnCode"
                    // 1. Check if the current radio's value matches the saved state
                    checked={
                      status === "Company Issued"
                        ? selectedEmp?.propOwnCode === "O"
                        : selectedEmp?.propOwnCode === "U"
                    }
                    // 2. Ensure the string passed to handleInputChange matches the check above
                    onChange={() =>
                      handleInputChange(
                        "propOwnCode",
                        status === "Company Issued" ? "O" : "U",
                        selectedEmp.tempId || selectedEmp.propId,
                      )
                    }
                  />
                ))}
              </FormSection>

              <FormInput
                label="Issue Date"
                type="date"
                required
                value={selectedEmp?.issueDate}
                onChange={(e) =>
                  handleInputChange(
                    "issueDate",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.propId,
                  )
                }
              />
              <FormInput
                label="Warehouse"
                value={selectedEmp?.whseName}
                onChange={(e) =>
                  handleInputChange(
                    "whseName",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.propId,
                  )
                }
              />
              <FormInput
                label="Return Date"
                type="date"
                required
                value={selectedEmp?.returnDate}
                onChange={(e) =>
                  handleInputChange(
                    "returnDate",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.propId,
                  )
                }
              />
              <FormInput
                label="Stock Number"
                value={selectedEmp?.controlId}
                onChange={(e) =>
                  handleInputChange(
                    "controlId",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.propId,
                  )
                }
              />
              <FormInput
                label="Other"
                value={selectedEmp?.otherS}
                onChange={(e) =>
                  handleInputChange(
                    "otherS",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.propId,
                  )
                }
              />
            </div>
            <div className="mt-2">
              <FormSection title="Fixed Assets Information">
                <div className="grid grid-cols-4 gap-x-8 gap-y-2 ">
                  <FormInput
                    label="Asset No"
                    value={selectedEmp?.assetId}
                    onChange={(e) =>
                      handleInputChange(
                        "assetId",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.propId,
                      )
                    }
                  />
                  <FormInput
                    label="Item No"
                    type="number"
                    value={selectedEmp?.itemNo}
                    onChange={(e) =>
                      handleInputChange(
                        "itemNo",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.propId,
                      )
                    }
                  />
                  {/* <FormSearchSelect
                    label="Manufacturer"
                    options={[]}
                    readOnly
                    onSelect={(val) => handleInputChange("skill", val)}
                  /> */}
                  <FormInput
                    label={"Manufacturer"}
                    type="text"
                    value={selectedEmp?.manufacturer}
                    onChange={(e) =>
                      handleInputChange(
                        "manufacturer",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.propId,
                      )
                    }
                  />
                  <FormInput
                    label="Model No"
                    type="text"
                    value={selectedEmp?.modelNo}
                    onChange={(e) =>
                      handleInputChange(
                        "modelNo",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.propId,
                      )
                    }
                  />
                  <FormInput
                    label="Serial No"
                    type="text"
                    value={selectedEmp?.serialNo}
                    onChange={(e) =>
                      handleInputChange(
                        "serialNo",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.propId,
                      )
                    }
                  />
                </div>
              </FormSection>
            </div>
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

                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Item</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Quantity</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Ownership</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Issue Date</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Return Date</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Warehouse</span>
                    </div>
                  </th>

                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Stock Number</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Other</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Asset No</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Item No</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Manufacturer</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Model No</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Serial No</span>
                    </div>
                  </th>
                  {/* <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Action
                    </th> */}
                </tr>
              </thead>
              <tbody className="tbody">
                {vendorEmployee?.map((item) => (
                  <tr
                    key={item.tempId || item.propId}
                    className={`${
                      selectedEmps.has(item.tempId || item.propId)
                        ? "bg-blue-50"
                        : ""
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="text-center tbody-td ">
                      <input
                        type="checkbox"
                        checked={selectedEmps.has(item.tempId || item.propId)}
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent row onClick from firing twice
                          const uniqueKey = item.tempId || item.propId;
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
                    {/* --- Property / Item Info --- */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[120px]"
                        value={item.propId || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "propId",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Item ID"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input min-w-[80px]"
                        value={item.propQty || 0}
                        onChange={(e) =>
                          handleInputChange(
                            "propQty",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                      />
                    </td>

                    {/* --- Ownership (Dropdown) --- */}
                    <td className="tbody-td">
                      <select
                        className="td-input bg-transparent min-w-[140px]"
                        value={item.propOwnCode || "Owned"}
                        onChange={(e) =>
                          handleInputChange(
                            "propOwnCode",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                      >
                        <option value="O">Company Issued</option>
                        <option value="U">Customer Furnished</option>
                      </select>
                    </td>

                    {/* --- Tracking Dates & Location --- */}
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.issueDate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "issueDate",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.returnDate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "returnDate",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[150px]"
                        value={item.whseName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "whseName",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Warehouse"
                      />
                    </td>

                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[150px]"
                        value={item.controlId || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "controlId",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Warehouse"
                      />
                    </td>

                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[150px]"
                        value={item.otherS || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "otherS",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Warehouse"
                      />
                    </td>

                    {/* --- Asset Details --- */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[120px]"
                        value={item.assetId || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "assetId",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Asset No"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[120px]"
                        value={item.itemNo || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "itemNo",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Asset No"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[150px]"
                        value={item.manufacturer || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "manufacturer",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Manufacturer"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[120px]"
                        value={item.modelNo || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "modelNo",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Serial No"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[120px]"
                        value={item.serialNo || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "serialNo",
                            e.target.value,
                            item.tempId || item.propId,
                          )
                        }
                        placeholder="Serial No"
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

const VendorEmployeeTraining = ({
  selectedRow,
  selectedVendorEmp,
  setActiveSubModal,
  formData,
}) => {
  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const [training, setTraining] = useState([]);
  const [trainingSc, setTrainingSc] = useState([]);
  const [Intex, setIntex] = useState([
    { label: "Internal", value: "I" },
    { label: "External", value: "E" },
  ]);

  // const employee = formData.employees?.[0] || {};

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialLabor = {
    vendEmplId: "",
    vendId: "",
    trainId: "",
    trainSrceId: "",
    startDt: "",
    endDt: "",
    trainYrNo: 0,
    sIntExtCd: "",
    lastRenewDt: "",
    expiryDt: "",
    trainCeuCred: 0,
    companyId: "1",
    modifiedBy: user.name,

    trainName: "",
  };

  const COLUMN_LABELS = {
    trainId: "Training ID",
    trainName: "Training Name",
    ceuCred: "CEU Credits",
    trainSrceId: "Training Source",
    trainCeuCred: "CEU Credits Earned",
    startDt: "Start Date",
    endDt: "End Date",
    trainYrNo: "Years of Experience",
    sIntExtCd: "Internal/External",
    lastRenewDt: "Last Renewal Date",
    expiryDt: "Expiration Date",
  };

  const columns = Object.keys(COLUMN_LABELS);

  const fetchItem = async () => {
    try {
      const train = await api.get(
        `${backendUrl}/api/Training?page=1&pageSize=1000`,
      );
      const trainSC = await api.get(
        `${backendUrl}/api/TrainingSource?page=1&pageSize=1000`,
      );

      if (train.data.data) {
        console.log("train1");
        setTraining(train.data.data);
      }

      if (trainSC.data.data) {
        setTrainingSc(trainSC.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVendorEmployeeTrain = async () => {
    if (!selectedRow || !selectedVendorEmp) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-employee-trainings?vendId=${selectedRow.vendId}&vendEmplId=${selectedVendorEmp.vendEmplId}&companyId=1&page=1&pageSize=20`,
      );

      if (response.data && response.data.data) {
        const data = response.data.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);

        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.trainId === selectedEmp?.trainId,
          );

          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.trainId]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.trainId]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(null);
          setSelectedEmps(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  useEffect(() => {
    fetchVendorEmployeeTrain();
    fetchItem();
  }, [selectedVendorEmp]);

  const handleInputChange = (field, value, rowId) => {
    console.log(field, value, rowId);
    setIsDirty(true);

    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.trainId;

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
      const currentId = prev.tempId || prev.trainId;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  // toolbar actions
  const handleAdd = () => {
    if (!selectedRow) {
      toast.warn("Select the vendor first!");
      return;
    }
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
      ...initialLabor, // Spread existing defaults
      vendEmplId: selectedVendorEmp?.vendEmplId,
      vendId: selectedRow?.vendId,
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
    // Check for any changes (New or Modified)
    const changedRows = vendorEmployee.filter(
      (row) => row?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
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
          return api.post(
            `${backendUrl}/api/vendor-employee-trainings`,
            payload,
          );
        } else if (row.isDirty && !row.isNew) {
          return api.put(
            `${backendUrl}/api/vendor-employee-trainings/${selectedVendorEmp.vendEmplId}/${selectedRow.vendId}/${row.trainId}/1`,
            payload,
          );
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // Reset flags
      // setIsDirty(false);
      // setIsFormDirty(false);

      // Refresh to get DB IDs and clear all local 'isNew'/'isDirty' states
      fetchVendorEmployeeTrain();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const handleDelete = async () => {
    // 1. Check if anything is selected
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
          await api.delete(
            `${backendUrl}/api/vendor-employee-trainings/${selectedVendorEmp.vendEmplId}/${selectedRow.vendId}/${id}/1`,
          );
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchVendorEmployeeTrain(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorEmployee.find(
      (item) =>
        String(item.trainId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.trainId; //

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
        (x.tempId || x.trainId) ===
        (selectedEmp?.tempId || selectedEmp?.trainId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorEmployee.length - 1)
      newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorEmployee.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorEmployee[newIdx];
      const nextId = nextRecord.tempId || nextRecord.trainId;

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
      toast.warn("Select a training record to copy first.");
      return;
    }

    // Determine rows: prioritize checkboxes (selectedEmps), then fallback to current form (selectedEmp)
    const rowsToCopy =
      selectedEmps.size > 0
        ? vendorEmployee.filter((item) =>
            selectedEmps.has(item.tempId || item.trainId),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.trainId) ===
              (selectedEmp?.tempId || selectedEmp?.trainId),
          );

    // Generate Tab-Separated string
    const headerLine = columns.map((key) => COLUMN_LABELS[key]).join("\t");
    const dataLines = rowsToCopy
      .map((row) => columns.map((key) => row[key] || "").join("\t"))
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    navigator.clipboard
      .writeText(finalClipboardString)
      .then(() => {
        setClipboard(rowsToCopy);
        localStorage.setItem("training_clipboard", JSON.stringify(rowsToCopy));
        toast.success(`${rowsToCopy.length} training record(s) copied.`);
      })
      .catch(() => toast.error("Failed to copy."));
  };

  const handlePaste = () => {
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("training_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `TRAIN_NEW_${Date.now()}_${index}`;
      return {
        ...row,
        trainId: "", // Clear primary key for new entry
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        modifiedBy: userSession?.name || "system",
        entryDtt: new Date().toISOString().split("T")[0],
      };
    });

    // Update list (New records at top, filter out previous unsaved new records if preferred)
    setVendorEmployee((prev) => [
      ...pastedRows,
      ...prev.filter((item) => !item.isNew),
    ]);

    if (pastedRows.length > 0) {
      setSelectedEmp(pastedRows[0]);
      setSelectedEmps(new Set([pastedRows[0].tempId]));
      setIsDirty(true);
    }
    toast.success(`${pastedRows.length} training record(s) pasted.`);
  };

  const handleDiscard = () => {
    const hasUnsavedChanges = vendorEmployee.some(
      (item) => item.isNew || item.isDirty,
    );

    if (!isDirty && !hasUnsavedChanges) {
      toast.info("No changes to discard.");
      return;
    }

    if (
      window.confirm("Discard all unsaved training changes and new records?")
    ) {
      // Revert to original master list
      setVendorEmployee([...allVendorEmployee]);

      // Reset UI
      setSelectedEmp(null);
      setSelectedEmps(new Set());
      setIsDirty(false);

      // Clear clipboard
      setClipboard(null);
      localStorage.removeItem("training_clipboard");

      toast.info("Changes discarded.");
    }
  };

  return (
    <div>
      <MainContainer
        title={"Trainings"}
        handleClose={() =>
          setActiveSubModal((prev) =>
            prev.filter((item) => item !== "Trainings"),
          )
        }
      >
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onClear: handleDiscard,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onToggleView: () => setIsFormView(!isFormView),
          }}
          currentIndex={currentIndex}
        />
        {isFormView ? (
          <div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-2">
              <FormSearchSelect
                label="Training"
                value={selectedEmp?.trainId || ""}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                options={training}
                displayKey="trainId"
                secondaryKey="trainDesc"
                onSelect={(opt) => {
                  handleInputChange(
                    "trainId",
                    opt.trainId,
                    selectedEmp?.tempId || selectedEmp?.trainId,
                  );
                  handleInputChange(
                    "trainDesc",
                    opt.trainDesc,
                    selectedEmp?.tempId || selectedEmp?.trainId,
                  );
                }}
              />
              <FormInput type="text" value={selectedEmp?.trainDesc} readOnly />
              <FormInput
                label="CEU Credits"
                type="number"
                value={selectedEmp?.ceuCred}
                readOnly
              />
              <FormSearchSelect
                label="Training Source"
                value={selectedEmp?.trainSrceId || ""}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                options={trainingSc}
                displayKey="trainSrceId"
                secondaryKey="trainSrceDesc"
                onSelect={(opt) => {
                  handleInputChange(
                    "trainSrceId",
                    opt.trainSrceId,
                    selectedEmp?.tempId || selectedEmp?.trainId,
                  );
                  handleInputChange(
                    "trainSrceDesc",
                    opt.trainSrceDesc,
                    selectedEmp?.tempId || selectedEmp?.trainId,
                  );
                }}
              />
              <FormInput
                type="text"
                value={selectedEmp?.trainSrceDesc}
                readOnly
              />
              <FormInput
                label="CEU Credits Earned"
                type="number"
                required
                value={selectedEmp?.trainCeuCred}
                onChange={(e) =>
                  handleInputChange(
                    "trainCeuCred",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.trainId,
                  )
                }
              />
            </div>
            <div className="grid grid-cols-4 gap-x-8 gap-y-2">
              <FormInput
                label="Start Date"
                type="date"
                required
                value={selectedEmp?.startDt}
                onChange={(e) =>
                  handleInputChange(
                    "startDt",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.trainId,
                  )
                }
              />
              <FormInput
                label="End Date"
                type="date"
                required
                value={selectedEmp?.endDt}
                onChange={(e) =>
                  handleInputChange(
                    "endDt",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.trainId,
                  )
                }
              />
              <FormInput
                label="Years of Experience"
                type="number"
                value={selectedEmp?.trainYrNo}
                onChange={(e) =>
                  handleInputChange(
                    "trainYrNo",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.trainId,
                  )
                }
              />
              <FormSearchSelect
                label="Internal/External"
                options={Intex}
                value={
                  selectedEmp?.sIntExtCd === "I"
                    ? "Internal"
                    : selectedEmp?.sIntExtCd === "E"
                      ? "External"
                      : ""
                }
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                displayKey="label"
                secondaryKey="value"
                onSelect={(opt) => {
                  handleInputChange(
                    "sIntExtCd",
                    opt.value,
                    selectedEmp?.tempId || selectedEmp?.trainId,
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-4 col-span-3 gap-x-8 gap-y-2">
              <FormInput
                label="Last Renewal Date"
                type="date"
                required
                value={selectedEmp?.lastRenewDt}
                onChange={(e) =>
                  handleInputChange(
                    "lastRenewDt",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.trainId,
                  )
                }
              />
              <FormInput
                label="Expiration Date"
                type="date"
                required
                value={selectedEmp?.expiryDt}
                onChange={(e) =>
                  handleInputChange(
                    "expiryDt",
                    e.target.value,
                    selectedEmp.tempId || selectedEmp.trainId,
                  )
                }
              />
            </div>
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

                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Training</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Training Desc</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>CEU Credits</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Training Source</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Training Src Desc</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>CEU Credits Earned</span>
                    </div>
                  </th>

                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Start Date</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>End Date</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Years Of Experience</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Internal/Exernal</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Last Renewal Dt</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Expiration Dt</span>
                    </div>
                  </th>
                  {/* <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Action
                    </th> */}
                </tr>
              </thead>
              <tbody className="tbody">
                {vendorEmployee?.map((item) => (
                  <tr
                    key={item.tempId || item.trainId}
                    className={`${
                      selectedEmps.has(item.tempId || item.trainId)
                        ? "bg-blue-50"
                        : ""
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="text-center tbody-td ">
                      <input
                        type="checkbox"
                        checked={selectedEmps.has(item.tempId || item.trainId)}
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent row onClick from firing twice
                          const uniqueKey = item.tempId || item.trainId;
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
                    {/* --- Training Details --- */}
                    <td className="tbody-td">
                      <TableSearchSelect
                        options={training}
                        displayKey="trainId"
                        secondaryKey="trainDesc"
                        value={item?.trainId}
                        onSelect={(val) => {
                          handleInputChange(
                            "trainId",
                            val.trainId,
                            item?.tempId || item?.trainId,
                          );
                          handleInputChange(
                            "trainDesc",
                            val.trainDesc,
                            item?.tempId || item?.trainDesc,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-50 min-w-[180px]"
                        value={item?.trainDesc || ""}
                        readOnly
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input bg-gray-50 min-w-[80px]"
                        value={item.ceuCred || ""}
                        readOnly
                        placeholder="CEU"
                      />
                    </td>

                    {/* --- Source & Earned Credits --- */}
                    <td className="tbody-td">
                      <TableSearchSelect
                        value={item?.trainSrceId || ""}
                        options={trainingSc}
                        displayKey="trainSrceId"
                        secondaryKey="trainSrceDesc"
                        onSelect={(opt) => {
                          handleInputChange(
                            "trainSrceId",
                            opt.trainSrceId,
                            item?.tempId || item?.trainId,
                          );
                          handleInputChange(
                            "trainSrceDesc",
                            opt.trainSrceDesc,
                            item?.tempId || item?.trainId,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-50 min-w-[180px]"
                        value={item?.trainSrceDesc || ""}
                        readOnly
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input min-w-[100px]"
                        value={item.trainCeuCred || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "trainCeuCred",
                            e.target.value,
                            item.tempId || item.trainId,
                          )
                        }
                        placeholder="Earned"
                      />
                    </td>

                    {/* --- Validity Dates --- */}
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.startDt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "startDt",
                            e.target.value,
                            item.tempId || item.trainId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.endDt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "endDt",
                            e.target.value,
                            item.tempId || item.trainId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input min-w-[90px]"
                        value={item.trainYrNo || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "trainYrNo",
                            e.target.value,
                            item.tempId || item.trainId,
                          )
                        }
                        placeholder="Yrs Exp"
                      />
                    </td>

                    {/* --- Internal/External & Renewals --- */}
                    <td className="tbody-td">
                      <select
                        className="td-input bg-transparent min-w-[110px]"
                        value={item.sIntExtCd || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "sIntExtCd",
                            e.target.value,
                            item.tempId || item.trainId,
                          )
                        }
                      >
                        <option value="">Select</option>
                        <option value="I">Internal</option>
                        <option value="E">External</option>
                      </select>
                    </td>
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.lastRenewDt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "lastRenewDt",
                            e.target.value,
                            item.tempId || item.trainId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.expiryDt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "expiryDt",
                            e.target.value,
                            item.tempId || item.trainId,
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
    </div>
  );
};

const VendorEmployeeSkills = ({
  selectedRow,
  selectedVendorEmp,
  setActiveSubModal,
  formData,
}) => {
  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [skill, setSkill] = useState([]);
  const [skillLevel, setSkillLevel] = useState([]);

  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  // const employee = formData.employees?.[0] || {};

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialLabor = {
    vendEmplId: "",
    vendId: "",
    skillId: "",
    skillDesc: "",
    skillLvlCd: "",
    skillLvlDesc: "",
    skillYrNo: 0,
    completeDt: "",
    lastRenewDt: "",
    expiryDt: "",
    companyId: "1",
    modifiedBy: user.name,
  };

  const fetchItem = async () => {
    try {
      const skillRes = await api.get(`${backendUrl}/api/Skill/dropdown`);
      const skillLevelRes = await api.get(
        `${backendUrl}/api/HSkillLvl/dropdown`,
      );

      if (skillRes.data) {
        setSkill(skillRes.data);
      }

      if (skillLevelRes.data) {
        setSkillLevel(skillLevelRes.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const COLUMN_LABELS = {
    skillId: "Skill ID",
    skillDesc: "Skill Description",
    skillYrNo: "Years of Experience",
    lastRenewDt: "Last Renewal Date",
    skillLvlCd: "Skill Level Code",
    skillLvlDesc: "Skill Level Description",
    completeDt: "Completion Date",
    expiryDt: "Expiration Date",
  };

  const columns = Object.keys(COLUMN_LABELS);

  const fetchVendorEmployeeSkill = async () => {
    if (!selectedRow || !selectedVendorEmp) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-employee-skills?vendId=${selectedRow.vendId}&vendEmplId=${selectedVendorEmp.vendEmplId}&companyId=1&page=1&pageSize=20`,
      );

      if (response.data && response.data.data) {
        const data = response.data.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);

        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.skillId === selectedEmp?.skillId,
          );

          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.skillId]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.skillId]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(null);
          setSelectedEmps(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  useEffect(() => {
    fetchVendorEmployeeSkill();
    fetchItem();
  }, [selectedVendorEmp]);

  const handleInputChange = (field, value, rowId) => {
    console.log(field, value, rowId);
    // setIsDirty(true);

    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.skillId;

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
      const currentId = prev.tempId || prev.skillId;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  // toolbar actions
  const handleAdd = () => {
    if (!selectedRow) {
      toast.warn("Select the vendor first!");
      return;
    }
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
      ...initialLabor, // Spread existing defaults
      vendEmplId: selectedVendorEmp?.vendEmplId,
      vendId: selectedRow?.vendId,
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
    // Check for any changes (New or Modified)
    const changedRows = vendorEmployee.filter(
      (row) => row?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
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
          return api.post(`${backendUrl}/api/vendor-employee-skills`, payload);
        } else if (row.isDirty && !row.isNew) {
          return api.put(
            `${backendUrl}/api/vendor-employee-skills/${selectedVendorEmp.vendEmplId}/${selectedRow.vendId}/${row.skillId}/1`,
            payload,
          );
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // Reset flags
      // setIsDirty(false);
      // setIsFormDirty(false);

      // Refresh to get DB IDs and clear all local 'isNew'/'isDirty' states
      fetchVendorEmployeeSkill();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const handleDelete = async () => {
    // 1. Check if anything is selected
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
          await api.delete(
            `${backendUrl}/api/vendor-employee-skills/${selectedVendorEmp.vendEmplId}/${selectedRow.vendId}/${id}/1`,
          );
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchVendorEmployeeSkill(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorEmployee.find(
      (item) =>
        String(item.skillId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.skillId; //

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
        (x.tempId || x.skillId) ===
        (selectedEmp?.tempId || selectedEmp?.skillId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorEmployee.length - 1)
      newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorEmployee.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorEmployee[newIdx];
      const nextId = nextRecord.tempId || nextRecord.skillId;

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
            selectedEmps.has(item.tempId || item.skillId),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.skillId) ===
              (selectedEmp?.tempId || selectedEmp?.skillId),
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
        skillId: "", // Clear primary key for new entry
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

      toast.info("Changes discarded.");
    }
  };

  return (
    <div>
      <MainContainer
        title={"Skills"}
        handleClose={() =>
          setActiveSubModal((prev) => prev.filter((item) => item !== "Skills"))
        }
      >
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => setIsFormView(!isFormView),
          }}
          currentIndex={currentIndex}
        />
        {isFormView ? (
          <div className="grid grid-cols-4 gap-x-8 gap-y-2">
            <FormSearchSelect
              label="Skill"
              value={selectedEmp?.skillId || ""}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              options={skill}
              displayKey="value"
              secondaryKey="label"
              onSelect={(opt) => {
                handleInputChange(
                  "skillId",
                  opt.value,
                  selectedEmp?.tempId || selectedEmp?.skillId,
                );
                handleInputChange(
                  "skillDesc",
                  opt.label,
                  selectedEmp?.tempId || selectedEmp?.skillId,
                );
              }}
            />
            <FormInput type="text" value={selectedEmp?.skillDesc} readOnly />
            <FormInput
              label="Years of Experience"
              type="number"
              value={selectedEmp?.skillYrNo}
              onChange={(e) =>
                handleInputChange(
                  "skillYrNo",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.skillId,
                )
              }
            />
            <FormInput
              label="Last Renewal Date"
              type="date"
              required
              value={selectedEmp?.lastRenewDt}
              onChange={(e) =>
                handleInputChange(
                  "lastRenewDt",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.skillId,
                )
              }
            />

            <FormSearchSelect
              label="Skill Level"
              value={selectedEmp?.skillLvlCd || ""}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              options={skillLevel}
              displayKey="value"
              secondaryKey="label"
              onSelect={(opt) => {
                handleInputChange(
                  "skillLvlCd",
                  opt.value,
                  selectedEmp?.tempId || selectedEmp?.skillId,
                );
                handleInputChange(
                  "skillLvlDesc",
                  opt.label,
                  selectedEmp?.tempId || selectedEmp?.skillId,
                );
              }}
            />
            <FormInput type="text" value={selectedEmp?.skillLvlDesc} readOnly />
            <FormInput
              label="Completion Date"
              type="date"
              required
              value={selectedEmp?.completeDt}
              onChange={(e) =>
                handleInputChange(
                  "completeDt",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.skillid,
                )
              }
            />
            <FormInput
              label="Expiration Date"
              type="date"
              required
              value={selectedEmp?.expiryDt}
              onChange={(e) =>
                handleInputChange(
                  "expiryDt",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.skillId,
                )
              }
            />
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

                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Skill</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Skill Desc</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Skill Level</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Skill Level Desc</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Year of Exp</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Completion Date</span>
                    </div>
                  </th>

                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Last Renewal Date</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Expiration Date</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="tbody">
                {vendorEmployee?.map((item) => (
                  <tr
                    key={item.tempId || item.skillId}
                    className={`${
                      selectedEmps.has(item.tempId || item.skillId)
                        ? "bg-blue-50"
                        : ""
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="text-center tbody-td ">
                      <input
                        type="checkbox"
                        checked={selectedEmps.has(item.tempId || item.skillId)}
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent row onClick from firing twice
                          const uniqueKey = item.tempId || item.skillId;
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
                    {/* --- Skill Identification --- */}
                    <td className="tbody-td">
                      <TableSearchSelect
                        options={skill}
                        value={item.skillId}
                        displayKey="value"
                        secondaryKey="label"
                        onSelect={(val) => {
                          handleInputChange(
                            "skillId",
                            val.value,
                            item?.tempId || item?.skillId,
                          );
                          handleInputChange(
                            "skillDesc",
                            val.label,
                            item?.tempId || item?.skillId,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-50 min-w-[180px]"
                        value={item.skillDesc || ""}
                        readOnly
                        placeholder="Skill Description"
                      />
                    </td>

                    {/* --- Proficiency & Experience --- */}
                    <td className="tbody-td">
                      <TableSearchSelect
                        options={skillLevel}
                        value={item?.skillLvlCd}
                        displayKey="value"
                        secondaryKey="label"
                        onSelect={(val) => {
                          handleInputChange(
                            "skillLvlCd",
                            val.value,
                            item?.tempId || item?.skillId,
                          );
                          handleInputChange(
                            "skillLvlDesc",
                            val.label,
                            item?.tempId || item?.skillId,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input bg-gray-50 min-w-[150px]"
                        value={item.skillLvlDesc || ""}
                        readOnly
                        placeholder="Level Description"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input min-w-[100px]"
                        value={item.skillYrNo || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "skillYrNo",
                            e.target.value,
                            item.tempId || item.skillId,
                          )
                        }
                        placeholder="Years Exp."
                      />
                    </td>

                    {/* --- Validity Dates --- */}
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.completeDt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "completeDt",
                            e.target.value,
                            item.tempId || item.skillId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.lastRenewDt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "lastRenewDt",
                            e.target.value,
                            item.tempId || item.skillId,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input min-w-[130px]"
                        value={item.expiryDt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "expiryDt",
                            e.target.value,
                            item.tempId || item.skillId,
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
    </div>
  );
};

const VendorEmployeeLabour = ({
  selectedRow,
  selectedVendorEmp,
  setActiveSubModal,
  setActiveSub,
  activeSub,
  formData,
}) => {
  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [skill, setSkill] = useState([]);
  const [skillLevel, setSkillLevel] = useState([]);

  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  // const employee = formData.employees?.[0] || {};

  const glcOptions = [
    { id: "G01", name: "General Labor" },
    { id: "G02", name: "Supervision" },
  ];
  const plcOptions = [{ id: "P01", name: "Professional Level 1" }];
  const jobOptions = [{ id: "ENG", name: "Engineer" }];
  const managerOptions = [{ id: "M101", name: "John Doe" }];

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialLabor = {
    vendEmplId: "",
    vendId: "",
    effectStartDt: "",
    effectEndDt: "",
    dfGenlLabCatCd: "",
    dfBillLabCatCd: "",
    dfltInvcRtAmt: 0,
    detlJobCd: "",
    mgrEmplId: "",
    labLocCd: "",
    tcWorkSchedCd: "",
    tcTsSchedCd: "",
    emplClassCd: "",
    veExpClassCd: "",
    cityName: "",
    countyName: "",
    mailStateDc: "",
    postalCd: "",
    countryCd: "",
    dfltPayType: "",
    spCreated: "",
    companyId: "1",
    modifiedBy: user.name,
  };

  // const fetchItem = async () => {
  //   try {
  //     const skillRes = await api.get(`${backendUrl}/api/Skill/dropdown`);
  //     const skillLevelRes = await api.get(
  //       `${backendUrl}/api/HSkillLvl/dropdown`,
  //     );

  //     if (skillRes.data) {
  //       setSkill(skillRes.data);
  //     }

  //     if (skillLevelRes.data) {
  //       setSkillLevel(skillLevelRes.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // console.log(skill);
  // console.log(skillLevel);

  const COLUMN_LABELS = {
    effectStartDt: "Start Date",
    effectEndDt: "End Date",
    dfGenlLabCatCd: "GLC Code",
    dfGenlLabCatCdDesc: "GLC Description",
    dfBillLabCatCd: "PLC Code",
    dfBillLabCatCdDesc: "PLC Description",
    detlJobCd: "Job Code",
    detlJobCdDesc: "Job Description",
    mgrEmplId: "Manager ID",
    mgrEmplIdDesc: "Manager Name",
    cityName: "City",
    countyName: "Country",
    mailStateDc: "State",
    postalCd: "Postal Code",
    dfltInvcRtAmt: "Invoice Rate",
  };

  const columns = Object.keys(COLUMN_LABELS);

  console.log(vendorEmployee);

  const fetchVendorEmployeeSkill = async () => {
    if (!selectedRow || !selectedVendorEmp) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-employee-labor-info?vendId=${selectedRow.vendId}&vendEmplId=${selectedVendorEmp.vendEmplId}&companyId=1&page=1&pageSize=20`,
      );

      if (response.data && response.data.data) {
        const data = response.data.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);

        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.effectStartDt === selectedEmp?.effectStartDt,
          );

          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.effectStartDt]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.effectStartDt]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(null);
          setSelectedEmps(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  useEffect(() => {
    fetchVendorEmployeeSkill();
    // fetchItem();
  }, [selectedVendorEmp]);

  const handleInputChange = (field, value, rowId) => {
    // setIsDirty(true);

    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.effectStartDt;

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
      const currentId = prev.tempId || prev.effectStartDt;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  // toolbar actions
  const handleAdd = () => {
    if (!selectedRow) {
      toast.warn("Select the vendor first!");
      return;
    }
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
      ...initialLabor, // Spread existing defaults
      vendEmplId: selectedVendorEmp?.vendEmplId,
      vendId: selectedRow?.vendId,
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
    const changedRows = vendorEmployee.filter(
      (row) => row?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      const savePromises = changedRows.map(async (row) => {
        let payload = { ...row };

        // Remove local UI flags so they aren't sent to the database
        delete payload.isNew;
        delete payload.isDirty;
        delete payload.tempId;

        if (row.isNew) {
          // ONLY POST for new records
          return api.post(
            `${backendUrl}/api/vendor-employee-labor-info`,
            payload,
          );
        } else {
          // ONLY PUT for existing modified records
          return api.put(
            `${backendUrl}/api/vendor-employee-labor-info/${selectedVendorEmp.vendEmplId}/${selectedRow.vendId}/${row.effectStartDt}/1`,
            payload,
          );
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // 1. Reset local dirty state immediately to prevent re-triggering
      setIsDirty(false);

      // 2. Refresh the list from the server
      // Replace this with the specific fetcher for the screen you are on
      await fetchVendorEmployeeSkill();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Error during save.");
    }
  };

  const handleDelete = async () => {
    // 1. Check if anything is selected
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
          await api.delete(
            `${backendUrl}/api/vendor-employee-labor-info/${selectedVendorEmp.vendEmplId}/${selectedRow.vendId}/${id}/1`,
          );
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchVendorEmployeeSkill(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorEmployee.find(
      (item) =>
        String(item.effectStartDt).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.effectStartDt; //

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
        (x.tempId || x.effectStartDt) ===
        (selectedEmp?.tempId || selectedEmp?.effectStartDt),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorEmployee.length - 1)
      newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorEmployee.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorEmployee[newIdx];
      const nextId = nextRecord.tempId || nextRecord.effectStartDt;

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
      toast.warn("Select a labor record to copy.");
      return;
    }

    // Identify selected rows: prioritizing checkboxes, then the current form view
    const rowsToCopy =
      selectedEmps.size > 0
        ? vendorEmployee.filter((item) =>
            selectedEmps.has(item.tempId || item.effectStartDt),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.effectStartDt) ===
              (selectedEmp?.tempId || selectedEmp?.effectStartDt),
          );

    // Create Tab-Separated string
    const headerLine = columns.map((key) => COLUMN_LABELS[key]).join("\t");
    const dataLines = rowsToCopy
      .map((row) => columns.map((key) => row[key] || "").join("\t"))
      .join("\n");

    const finalString = `${headerLine}\n${dataLines}`;

    navigator.clipboard
      .writeText(finalString)
      .then(() => {
        setClipboard(rowsToCopy);
        localStorage.setItem("labor_clipboard", JSON.stringify(rowsToCopy));
        toast.success(`${rowsToCopy.length} labor profile(s) copied.`);
      })
      .catch(() => toast.error("Failed to copy to clipboard."));
  };

  const handlePaste = () => {
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("labor_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `LABOR_NEW_${Date.now()}_${index}`;
      return {
        ...row,
        effectStartDt: "", // Reset start date so user must pick a new one (Primary Key)
        tempId: newTempId,
        isNew: true,
        isDirty: true,
        modifiedBy: userSession?.name || "system",
        entryDtt: new Date().toISOString().split("T")[0],
      };
    });

    // Add new records to the list
    setVendorEmployee((prev) => [
      ...pastedRows,
      ...prev.filter((item) => !item.isNew),
    ]);

    if (pastedRows.length > 0) {
      setSelectedEmp(pastedRows[0]);
      setSelectedEmps(new Set([pastedRows[0].tempId]));
      setIsDirty(true);
    }
    toast.success(`${pastedRows.length} labor profile(s) pasted.`);
  };

  const handleDiscard = () => {
    const hasChanges = vendorEmployee.some(
      (item) => item.isNew || item.isDirty,
    );

    if (!isDirty && !hasChanges) {
      toast.info("No changes to discard.");
      return;
    }

    if (window.confirm("Discard all unsaved labor record changes?")) {
      // Reset to the original master data
      setVendorEmployee([...allVendorEmployee]);

      // Reset UI state
      setSelectedEmp(null);
      setSelectedEmps(new Set());
      setIsDirty(false);

      // Clear clipboard
      setClipboard(null);
      localStorage.removeItem("labor_clipboard");

      toast.info("Changes discarded.");
    }
  };

  return (
    <div>
      <MainContainer
        title="Labor Information"
        handleClose={() =>
          setActiveSubModal((prev) => prev.filter((i) => i !== "Labor"))
        }
      >
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onDelete: handleDelete,
            onCopy: handleCopy,
            onClear: handleDiscard,
            onPaste: handlePaste,
            onToggleView: () => setIsFormView(!isFormView),
          }}
          currentIndex={currentIndex}
        />

        {isFormView ? (
          <>
            <div className="space-y-4 p-4">
              <FormSection title="Effective Dates">
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Start Date"
                    type="date"
                    value={selectedEmp?.effectStartDt}
                    onChange={(e) =>
                      handleInputChange(
                        "effectStartDt",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      )
                    }
                  />
                  <FormInput
                    label="End Date"
                    type="date"
                    value={selectedEmp?.effectEndDt}
                    onChange={(e) =>
                      handleInputChange(
                        "effectEndDt",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      )
                    }
                  />
                </div>
              </FormSection>

              <FormSection title="Classification & Assignments">
                <div className="grid grid-cols-2 gap-4">
                  {/* GLC */}
                  <FormSearchSelect
                    label="Default GLC"
                    options={glcOptions}
                    value={selectedEmp?.dfGenlLabCatCd}
                    displayKey={"id"}
                    secondaryKey={"name"}
                    onSelect={(val) => {
                      handleInputChange(
                        "dfGenlLabCatCd",
                        val.id,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      );
                      handleInputChange(
                        "dfGenlLabCatCdDesc",
                        val.name,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      );
                    }}
                  />
                  <FormInput
                    label="GLC Description"
                    value={selectedEmp?.dfGenlLabCatCdDesc}
                    readOnly
                  />

                  {/* PLC */}
                  <FormSearchSelect
                    label="Default PLC"
                    options={plcOptions}
                    value={selectedEmp?.dfBillLabCatCd}
                    displayKey={"id"}
                    secondaryKey={"name"}
                    onSelect={(val) => {
                      handleInputChange(
                        "dfBillLabCatCd",
                        val.id,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      );
                      handleInputChange(
                        "dfBillLabCatCdDesc",
                        val.name,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      );
                    }}
                  />
                  <FormInput
                    label="PLC Description"
                    value={selectedEmp?.dfBillLabCatCdDesc}
                    readOnly
                  />

                  {/* Job Title */}
                  <FormSearchSelect
                    label="Job Title"
                    options={jobOptions}
                    value={selectedEmp?.detlJobCd}
                    displayKey={"id"}
                    secondaryKey={"name"}
                    onSelect={(val) => {
                      handleInputChange(
                        "detlJobCd",
                        val.id,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      );
                      handleInputChange(
                        "detlJobCdDesc",
                        val.name,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      );
                    }}
                  />
                  <FormInput
                    label="Job Description"
                    value={selectedEmp?.detlJobCdDesc}
                    readOnly
                  />

                  {/* Manager */}
                  <FormSearchSelect
                    label="Manager"
                    options={managerOptions}
                    value={selectedEmp?.mgrEmplId}
                    displayKey={"id"}
                    secondaryKey={"name"}
                    onSelect={(val) => {
                      handleInputChange(
                        "mgrEmplId",
                        val.id,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      );
                      handleInputChange(
                        "mgrEmplIdDesc",
                        val.name,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      );
                    }}
                  />
                  <FormInput
                    label="Manager Name"
                    value={selectedEmp?.mgrEmplIdDesc}
                    readOnly
                  />
                </div>
              </FormSection>

              <FormSection title="Location Details">
                <div className="grid grid-cols-3 gap-4">
                  <FormInput
                    label="City"
                    value={selectedEmp?.cityName}
                    onChange={(e) =>
                      handleInputChange(
                        "cityName",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      )
                    }
                  />
                  <FormInput
                    label="Country"
                    type="text"
                    value={selectedEmp?.countyName}
                    onChange={(e) =>
                      handleInputChange(
                        "countyName",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      )
                    }
                  />
                  <FormInput
                    label="State"
                    value={selectedEmp?.mailStateDc}
                    onChange={(e) =>
                      handleInputChange(
                        "mailStateDc",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      )
                    }
                  />
                  <FormInput
                    label="Postal Code"
                    value={selectedEmp?.postalCd}
                    onChange={(e) =>
                      handleInputChange(
                        "postalCd",
                        e.target.value,
                        selectedEmp.tempId || selectedEmp.effectStartDt,
                      )
                    }
                  />
                </div>
              </FormSection>

              <ActionDetailButton
                label="Rates"
                onClick={() => setActiveSub(["defTranInvRat"])}
                isActive={activeSub.includes("defTranInvRat")}
              />
            </div>

            {activeSub.includes("defTranInvRat") && (
              <MainContainer title="Rates" handleClose={() => setActiveSub([])}>
                <FormInput
                  label="Invoice Rate"
                  type="number"
                  value={selectedEmp?.dfltInvcRtAmt}
                  onChange={(e) =>
                    handleInputChange(
                      "dfltInvcRtAmt",
                      e.target.value,
                      selectedEmp.tempId || selectedEmp.effectStartDt,
                    )
                  }
                />
              </MainContainer>
            )}
          </>
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
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Start Date</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>End Date</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Default GLC</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>GLC Description</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Default PLC</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>PLC Description</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Job Title</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Job Description</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Manager</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Manager Name</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>City</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Country</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>State</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Postal Code</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>
                  <th className="th-thead">
                    {/* <div className="flex items-center justify-center "> */}
                    <div className="flex items-center justify-center">
                      <span>Rates</span>
                      <span className="text-red-500"></span>
                    </div>
                    {/* </div> */}
                  </th>

                  {/* <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Action
                    </th> */}
                </tr>
              </thead>
              <tbody className="tbody">
                {vendorEmployee.map((item) => (
                  <tr
                    key={item.tempId || item.effectStartDt}
                    // Add an onClick to the row itself for a better UX
                    onClick={() => selectedEmp(item)}
                    className={`${
                      selectedEmps.has(item.tempId || item.effectStartDt)
                        ? "bg-blue-50"
                        : ""
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="text-center tbody-td ">
                      <input
                        type="checkbox"
                        checked={selectedEmps.has(
                          item.tempId || item.effectStartDt,
                        )}
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent row onClick from firing twice
                          const uniqueKey = item.tempId || item.effectStartDt;
                          const newSet = new Set(selectedEmps);
                          if (newSet.has(uniqueKey)) {
                            newSet.delete(uniqueKey);
                            selectedEmp(null);
                          } else {
                            newSet.add(uniqueKey);
                            setSelectedEmp(item);
                          }
                          setSelectedEmps(newSet);
                        }}
                      />
                    </td>

                    <td className="tbody-td">
                      <FormInput
                        type="date"
                        value={item?.effectStartDt}
                        onChange={(e) =>
                          handleInputChange(
                            "effectStartDt",
                            e.target.value,
                            item.tempId || item.effectStartDt,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <FormInput
                        type="date"
                        value={item?.effectEndDt}
                        onChange={(e) =>
                          handleInputChange(
                            "effectEndDt",
                            e.target.value,
                            item.tempId || item.effectStartDt,
                          )
                        }
                      />
                    </td>
                    <td className="tbody-td">
                      <TableSearchSelect
                        options={glcOptions || []}
                        value={item?.dfGenlLabCatCd || ""}
                        displayKey="id"
                        secondaryKey="name"
                        onSelect={(val) => {
                          handleInputChange(
                            "dfGenlLabCatCd",
                            val.id,
                            item?.tempId || item?.effectStartDt,
                          );
                          handleInputChange(
                            "dfGenlLabCatDesc",
                            val.name,
                            item?.tempId || item?.effectStartDt,
                          );
                        }}
                      />
                    </td>

                    <td className="tbody-td">
                      <input
                        className="bg-gray-100"
                        value={item?.dfGenlLabCatDesc || ""}
                        readOnly
                      />
                    </td>

                    <td className="tbody-td">
                      <TableSearchSelect
                        options={plcOptions || []}
                        value={item?.dfBillLabCatCd || ""}
                        displayKey="id"
                        secondaryKey="name"
                        onSelect={(val) => {
                          handleInputChange(
                            "dfBillLabCatCd",
                            val.id,
                            item?.tempId || item?.effectStartDt,
                          );
                          handleInputChange(
                            "dfBillLabCatCdDesc",
                            val.name,
                            item?.tempId || item?.effectStartDt,
                          );
                        }}
                      />
                    </td>

                    <td className="tbody-td">
                      <input
                        className="bg-gray-100"
                        value={item?.dfBillLabCatCdDesc || ""}
                        readOnly
                      />
                    </td>

                    <td className="tbody-td">
                      <TableSearchSelect
                        options={jobOptions || []}
                        value={item?.detlJobCd || ""}
                        displayKey="id"
                        secondaryKey="name"
                        onSelect={(val) => {
                          handleInputChange(
                            "detlJobCd",
                            val.id,
                            item?.tempId || item?.effectStartDt,
                          );
                          handleInputChange(
                            "detlJobCdDesc",
                            val.name,
                            item?.tempId || item?.effectStartDt,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="bg-gray-100"
                        value={item?.detlJobCdDesc || ""}
                        readOnly
                      />
                    </td>

                    <td className="tbody-td">
                      <TableSearchSelect
                        options={managerOptions || []}
                        value={item?.mgrEmplId || ""}
                        displayKey="id"
                        secondaryKey="name"
                        onSelect={(val) => {
                          handleInputChange(
                            "mgrEmplId",
                            val.id,
                            item?.tempId || item?.effectStartDt,
                          );
                          handleInputChange(
                            "mgrEmplIdDesc",
                            val.name,
                            item?.tempId || item?.effectStartDt,
                          );
                        }}
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="bg-gray-100"
                        value={item?.mgrEmplIdDesc || ""}
                        readOnly
                      />
                    </td>

                    {/* --- Location Details --- */}
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[150px]"
                        value={item.cityName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cityName",
                            e.target.value,
                            item.tempId || item.effectStartDt,
                          )
                        }
                        placeholder="City"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[120px]"
                        value={item.mailStateDc || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "mailStateDc",
                            e.target.value,
                            item.tempId || item.effectStartDt,
                          )
                        }
                        placeholder="State"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[150px]"
                        value={item.countyName || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "countyName",
                            e.target.value,
                            item.tempId || item.effectStartDt,
                          )
                        }
                        placeholder="Country"
                      />
                    </td>
                    <td className="tbody-td">
                      <input
                        className="td-input min-w-[100px]"
                        value={item.postalCd || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "postalCd",
                            e.target.value,
                            item.tempId || item.effectStartDt,
                          )
                        }
                        placeholder="Zip Code"
                      />
                    </td>

                    {/* --- Financial Rates --- */}
                    <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input min-w-[120px] text-right"
                        value={item.dfltInvcRtAmt || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "dfltInvcRtAmt",
                            e.target.value,
                            item.tempId || item.effectStartDt,
                          )
                        }
                        placeholder="0.00"
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

const VendorEmployeeCertification = ({
  selectedRow,
  selectedVendorEmp,
  setActiveSubModal,
  formData,
}) => {
  const [vendorEmployee, setVendorEmployee] = useState([]);
  const [allVendorEmployee, setAllVendorEmployee] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedEmps, setSelectedEmps] = useState(new Set());
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [clipboard, setClipboard] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  const [isFormView, setIsFormView] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [skill, setSkill] = useState([]);
  const [skillLevel, setSkillLevel] = useState([]);

  // const employee = formData.employees?.[0] || {};

  const glcOptions = [
    { id: "G01", name: "General Labor" },
    { id: "G02", name: "Supervision" },
  ];
  const plcOptions = [{ id: "P01", name: "Professional Level 1" }];
  const jobOptions = [{ id: "ENG", name: "Engineer" }];
  const managerOptions = [{ id: "M101", name: "John Doe" }];

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialLabor = {
    vendorEmployeeId: "",
    vendorId: "",
    certificationId: "",
    professionalOrgId: "",
    mailStateId: "",
    LicenseNumber: "",
    certificationYears: 0,
    expirationDate: "",
    lastRenewalDate: "",
    stateCode: "N",
    companyId: "1",
    modifiedBy: user.name,
  };

  // const fetchItem = async () => {
  //   try {
  //     const skillRes = await api.get(`${backendUrl}/api/Skill/dropdown`);
  //     const skillLevelRes = await api.get(
  //       `${backendUrl}/api/HSkillLvl/dropdown`,
  //     );

  //     if (skillRes.data) {
  //       setSkill(skillRes.data);
  //     }

  //     if (skillLevelRes.data) {
  //       setSkillLevel(skillLevelRes.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // console.log(skill);
  // console.log(skillLevel);

  const fetchVendorEmployeeSkill = async () => {
    if (!selectedRow || !selectedVendorEmp) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/SubcontractorCertification?vendorId=${selectedRow.vendId}&vendorEmployeeId=${selectedVendorEmp.vendEmplId}&companyId=1`,
      );

      if (response.data && response.data.data) {
        const data = response.data.data;
        setVendorEmployee(data);
        setAllVendorEmployee(data);

        // Handle Selection Logic
        if (data.length > 0) {
          // 1. Check if there is a previously selected entry that still exists in the new data
          const stillExists = data.find(
            (emp) => emp.certificationId === selectedEmp?.certificationId,
          );

          if (stillExists) {
            // Keep the previous selection
            setSelectedEmp(stillExists);
            setSelectedEmps(new Set([stillExists.certificationId]));
          } else {
            // 2. Otherwise, select the first entry
            const firstEmp = data[0];
            setSelectedEmp(firstEmp);
            setSelectedEmps(new Set([firstEmp.certificationId]));
          }
        } else {
          // Clear selection if no data returned
          setSelectedEmp(null);
          setSelectedEmps(new Set());
        }
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  useEffect(() => {
    fetchVendorEmployeeSkill();
    // fetchItem();
  }, [selectedVendorEmp]);

  const handleInputChange = (field, value, rowId) => {
    // 1. Update the Master List
    setVendorEmployee((prevList) =>
      prevList.map((item) => {
        const itemId = item?.tempId || item.certificationId;

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
      const currentId = prev.tempId || prev.certificationId;
      if (String(currentId) !== String(rowId)) return prev;

      return { ...prev, [field]: value };
    });
  };

  console.log(selectedEmps);

  // toolbar actions
  const handleAdd = () => {
    if (!selectedRow) {
      toast.warn("Select the vendor first!");
      return;
    }
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
      ...initialLabor, // Spread existing defaults
      vendorEmployeeId: selectedVendorEmp?.vendEmplId,
      vendorId: selectedRow?.vendId,
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
    // Check for any changes (New or Modified)
    const changedRows = vendorEmployee.filter(
      (row) => row?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
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
          return api.post(
            `${backendUrl}/api/SubcontractorCertification`,
            payload,
          );
        } else if (row.isDirty && !row.isNew) {
          return api.put(
            `${backendUrl}/api/SubcontractorCertification`,
            payload,
          );
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // Reset flags
      // setIsDirty(false);
      // setIsFormDirty(false);

      // Refresh to get DB IDs and clear all local 'isNew'/'isDirty' states
      fetchVendorEmployeeSkill();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const handleDelete = async () => {
    // 1. Check if anything is selected
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
          await api.delete(
            `${backendUrl}/api/SubcontractorCertification/${id}/${selectedVendorEmp.vendEmplId}/${selectedRow.vendId}/1`,
          );
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedEmps(new Set());
      setSelectedEmp(null);
      fetchVendorEmployeeSkill(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      // setLoading(false);
    }
  };

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorEmployee.find(
      (item) =>
        String(item.certificationId).toLowerCase() ===
        String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.certificationId; //

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
        (x.tempId || x.certificationId) ===
        (selectedEmp?.tempId || selectedEmp?.certificationId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorEmployee.length - 1)
      newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorEmployee.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorEmployee[newIdx];
      const nextId = nextRecord.tempId || nextRecord.certificationId;

      // 1. Update the record being shown in the form
      setSelectedEmp(nextRecord);
      setCurrentIndex(newIdx);

      // 2. CRITICAL: Update the selection so the table highlights this row
      setSelectedEmps(new Set([nextId]));

      // setIsFormDirty(false);
    }
  };

  const COLUMN_LABELS = {
    certificationId: "Certificate",
    proforg: "Professional Organization",
    orgdesc: "Organization Description",
    state: "State/Province",
    LicenseNumber: "License Number",
    certificationYears: "Years",
    expirationDate: "Expiration Date",
    lastRenewalDate: "Last Renewal Date",
    stateCode: "Status",
  };

  const columns = Object.keys(COLUMN_LABELS);

  const handleCopy = () => {
    const hasSelection = selectedEmps.size > 0 || selectedEmp;
    if (!hasSelection) {
      toast.warn("Select a skill record to copy first.");
      return;
    }
    setIsDirty(true);

    // Determine rows: prioritize checkboxes, fallback to single form selection
    const rowsToCopy =
      selectedEmps.size > 0
        ? vendorEmployee.filter((item) =>
            selectedEmps.has(item.tempId || item.certificationId),
          )
        : vendorEmployee.filter(
            (item) =>
              (item.tempId || item.certificationId) ===
              (selectedEmp?.tempId || selectedEmp?.certificationId),
          );

    console.log(rowsToCopy);

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
        localStorage.setItem(
          "certificate_clipboard",
          JSON.stringify(rowsToCopy),
        );
        toast.success(`${rowsToCopy.length} certificates(s) copied.`);
      })
      .catch(() => toast.error("Clipboard access failed."));
  };

  console.log(clipboard);

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
        certificationId: "", // Clear primary key for new entry
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

      toast.info("Changes discarded.");
    }
  };

  return (
    <div>
      <MainContainer
        title={"Certification"}
        handleClose={() =>
          setActiveSubModal((prev) =>
            prev.filter((item) => item !== "Certification"),
          )
        }
      >
        <Toolbar
          isFormView={isFormView}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          totalRecords={vendorEmployee.length}
          selectedRow={selectedEmp}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          // isDirty={isDirty}
          // loading={loading}
          actions={{
            onAdd: handleAdd,
            onSave: handleSaveAll,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onClear: handleDiscard,
            onDelete: handleDelete,
            onToggleView: () => setIsFormView(!isFormView),
          }}
          currentIndex={currentIndex}
        />
        {isFormView ? (
          <div className="">
            {/* <div className="gap-x-8 gap-y-2"> */}
            <FormInput
              label="Certificate"
              type="text"
              required
              value={selectedEmp?.certificationId}
              onChange={(e) =>
                handleInputChange(
                  "certificationId",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.certificationId,
                )
              }
            />
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <FormSearchSelect
                label="Professional Organization"
                options={[]}
                readOnly
                required
                onSelect={(val) => handleInputChange("proforg", val)}
              />
              <FormInput type="text" value={selectedEmp?.orgdesc} readOnly />
            </div>
            <FormSearchSelect
              label="State/Province"
              options={[]}
              readOnly
              required
              onSelect={(val) => handleInputChange("state", val)}
            />

            <FormInput
              label="License Number"
              type="text"
              required
              value={selectedEmp?.LicenseNumber}
              onChange={(e) =>
                handleInputChange(
                  "LicenseNumber",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.certificationId,
                )
              }
            />
            <FormInput
              label="Years"
              type="number"
              value={selectedEmp?.certificationYears}
              onChange={(e) =>
                handleInputChange(
                  "certificationYears",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.certificationId,
                )
              }
            />
            <FormInput
              label="Expiration Date"
              type="date"
              required
              value={selectedEmp?.expirationDate}
              onChange={(e) =>
                handleInputChange(
                  "expirationDate",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.certificationId,
                )
              }
            />
            <FormInput
              label="Last Renewal Date"
              type="date"
              required
              value={selectedEmp?.lastRenewalDate}
              onChange={(e) =>
                handleInputChange(
                  "lastRenewalDate",
                  e.target.value,
                  selectedEmp.tempId || selectedEmp.certificationId,
                )
              }
            />
            <FormInput
              type="checkbox"
              label="Status"
              checked={selectedEmp?.stateCode === "Y"}
              onChange={(e) =>
                handleInputChange(
                  "stateCode",
                  e.target.checked ? "Y" : "N",
                  selectedEmp?.tempId || selectedEmp?.certificationId,
                )
              }
            />
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

                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Certificate</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Professional Org</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>State/Province</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>License Number</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Years</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Expiration Date</span>
                    </div>
                  </th>

                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Last Renewal Date</span>
                    </div>
                  </th>
                  <th className="th-thead">
                    <div className="flex items-center justify-center">
                      <span>Status</span>
                    </div>
                  </th>
                  {/* <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Action
                    </th> */}
                </tr>
              </thead>
              <tbody className="tbody">
                {vendorEmployee.map((item) => (
                  <tr
                    key={item.tempId || item.certificationId}
                    // Add an onClick to the row itself for a better UX
                    onClick={() => selectedEmp(item)}
                    className={`${
                      selectedEmps.has(item.tempId || item.certificationId)
                        ? "bg-blue-50"
                        : ""
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                  >
                    <td className="text-center tbody-td ">
                      <input
                        type="checkbox"
                        checked={selectedEmps.has(
                          item.tempId || item.certificationId,
                        )}
                        className="h-3 w-3 accent-blue-600 cursor-pointer"
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent row onClick from firing twice
                          const uniqueKey = item.tempId || item.certificationId;
                          const newSet = new Set(selectedEmps);
                          if (newSet.has(uniqueKey)) {
                            newSet.delete(uniqueKey);
                            selectedEmp(null);
                          } else {
                            newSet.add(uniqueKey);
                            setSelectedEmp(item);
                          }
                          setSelectedEmps(newSet);
                        }}
                      />
                    </td>

                    {/* Certificate Name */}
                    <td className="tbody-td">
                      <input
                        type="text"
                        className="td-input min-w-[150px]"
                        value={item.certificationId || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "certificationId",
                            e.target.value,
                            item.tempId || item.certificationId,
                          )
                        }
                      />
                    </td>

                    {/* Professional Organization Select */}
                    <td className="tbody-td">
                      <TableSearchSelect
                        // options={proforgOptions || []} // Replace with your actual org list
                        options={[]}
                        value={item.proforg}
                        onSelect={(val) => {
                          handleInputChange(
                            "proforg",
                            val.value,
                            item.tempId || item.certificationId,
                          );
                          handleInputChange(
                            "orgdesc",
                            val.label,
                            item.tempId || item.certificationId,
                          );
                        }}
                      />
                    </td>

                    {/* State Select */}
                    <td className="tbody-td">
                      <TableSearchSelect
                        // options={stateOptions || []}
                        options={[]}
                        value={item.state}
                        onSelect={(val) =>
                          handleInputChange(
                            "state",
                            val.value,
                            item.tempId || item.certificationId,
                          )
                        }
                      />
                    </td>

                    {/* License Number */}
                    <td className="tbody-td">
                      <input
                        type="text"
                        className="td-input min-w-[120px]"
                        value={item.LicenseNumber || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "LicenseNumber",
                            e.target.value,
                            item.tempId || item.certificationId,
                          )
                        }
                      />
                    </td>

                    {/* Years */}
                    <td className="tbody-td">
                      <input
                        type="number"
                        className="td-input w-20"
                        value={item.certificationYears || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "certificationYears",
                            e.target.value,
                            item.tempId || item.certificationId,
                          )
                        }
                      />
                    </td>

                    {/* Expiration & Renewal Dates */}
                    <td className="tbody-td">
                      <div className="flex flex-col gap-1">
                        <input
                          type="date"
                          className="td-input text-xs"
                          value={item.expirationDate || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "expirationDate",
                              e.target.value,
                              item.tempId || item.certificationId,
                            )
                          }
                        />
                      </div>
                    </td>

                    <td className="tbody-td">
                      <input
                        type="date"
                        className="td-input text-xs"
                        value={item.lastRenewalDate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "lastRenewalDate",
                            e.target.value,
                            item.tempId || item.certificationId,
                          )
                        }
                      />
                    </td>

                    {/* Status Checkbox */}
                    <td className="tbody-td text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-green-600"
                        checked={item.stateCode === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "stateCode",
                            e.target.checked ? "Y" : "N",
                            item.tempId || item.certificationId,
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
    </div>
  );
};

export const Addresses = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  isDirty,
  loading,
  toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons

  // Helper to safely access the first address or provide defaults
  const address = formData.addresses?.[0] || {};

  // Helper for deep updates (e.g., updating addresses[0].addrCode)
  const handleAddressChange = (field, value) => {
    const updatedAddresses = [...(formData.addresses || [])];
    if (updatedAddresses.length === 0) {
      updatedAddresses.push({ [field]: value });
    } else {
      updatedAddresses[0] = { ...updatedAddresses[0], [field]: value };
    }
    handleInputChange("addresses", updatedAddresses);
  };

  const handleContactChange = (field, value) => {
    const updatedAddresses = [...formData.addresses];
    const firstAddr = { ...updatedAddresses[0] };
    const updatedContacts = [...(firstAddr.contacts || [])];

    if (updatedContacts.length === 0) {
      updatedContacts.push({ [field]: value });
    } else {
      updatedContacts[0] = { ...updatedContacts[0], [field]: value };
    }

    firstAddr.contacts = updatedContacts;
    updatedAddresses[0] = firstAddr;
    handleInputChange("addresses", updatedAddresses);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer title="Adresses" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />

        {/* Bottom Section: Detail Form */}
        <FormSection>
          <div className="mt-2">
            <div className="grid grid-cols-3 gap-x-8 gap-y-2">
              <FormInput
                label="Address Code"
                required
                value={address.addrCode || ""}
                onChange={(e) =>
                  handleAddressChange("addrCode", e.target.value)
                }
              />
              <FormSearchSelect
                label="Payment Address"
                required
                options={[
                  { id: "", name: "Select" },
                  { id: "D", name: "Default" },
                  { id: "Y", name: "Yes" },
                  { id: "N", name: "No" },
                ]}
                onSelect={(val) => handleInputChange("addressType", val.name)}
              />
              <FormSearchSelect
                label="Order Address"
                required
                options={[
                  { id: "", name: "Select" },
                  { id: "D", name: "Default" },
                  { id: "Y", name: "Yes" },
                  { id: "N", name: "No" },
                ]}
                onSelect={(val) => handleInputChange("addressType", val.name)}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <FormInput
                label="Address Line 1"
                value={address.addressLine1 || ""}
                onChange={(e) =>
                  handleAddressChange("addressLine1", e.target.value)
                }
              />
              <FormInput
                label="Phone Number"
                type="number"
                value={address.phoneNumber || ""}
                onChange={(e) =>
                  handleAddressChange("phoneNumber", e.target.value)
                }
              />
              <FormInput
                label="Address Line 2"
                value={address.addressLine2 || ""}
                onChange={(e) =>
                  handleAddressChange("addressLine2", e.target.value)
                }
              />
              <FormInput
                label="Fax Number"
                type="number"
                value={address.faxNo || ""}
                onChange={(e) => handleAddressChange("faxNo", e.target.value)}
              />
              <FormInput
                label="Address Line 3"
                value={address.addressLine3 || ""}
                onChange={(e) =>
                  handleAddressChange("addressLine3", e.target.value)
                }
              />
              <FormInput
                label="Other Number"
                type="number"
                value={formData.address1}
                onChange={(e) =>
                  handleAddressChange("address1", e.target.value)
                }
              />
              <FormSearchSelect
                label="City"
                options={[]}
                //city list
                onSelect={(val) => handleAddressChange("cityName", val.name)}
                displayKey="name"
              />
              <FormInput
                label="Email"
                type="email"
                className="w-full"
                value={address.emailId || ""}
                onChange={(e) => handleAddressChange("emailId", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <FormSearchSelect
                label="State"
                options={[]}
                //state list
                onSelect={(val) => handleAddressChange("stateCode", val.name)}
                displayKey="name"
              />
              <FormSearchSelect
                label="Postal Code"
                options={[]}
                //code list
                onSelect={(val) => handleAddressChange("postalCode", val.name)}
                displayKey="name"
              />
              <FormInput
                label="Congressional District Code"
                value={formData.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
              />
              <FormSearchSelect
                label="Country"
                options={[]}
                //state list
                displayKey="name"
                onSelect={(val) => handleAddressChange("country", val.name)}
              />
              <FormSearchSelect
                label="Sales/Use Tax Code"
                options={[]}
                onSelect={(val) => handleAddressChange("countryCode", val.name)}
              />
              <FormInput value={formData.phone} readOnly />
              <FormInput
                label="Ship ID"
                value={formData.fax}
                onChange={(e) => handleAddressChange("fax", e.target.value)}
              />
              <FormInput
                value={formData.fax}
                onChange={(e) => handleAddressChange("fax", e.target.value)}
                disabled
              />
              <FormInput
                label="Password"
                type="password"
                value={formData.pass}
                onChange={(e) => handleAddressChange("pass", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <FormInput
                label="UEI Number"
                value={formData.ueiNo}
                onChange={(e) => handleAddressChange("ueiNo", e.target.value)}
              />
              <FormInput
                label="CAGE Code"
                value={formData.cageCd}
                onChange={(e) => handleAddressChange("cageCd", e.target.value)}
              />
              <FormInput
                type="checkbox"
                label="Ship ID Active"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleAddressChange("holdPayments", e.target.checked)
                }
              />
              <FormInput
                type="checkbox"
                label="US EFT Active"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleAddressChange("holdPayments", e.target.checked)
                }
              />
              <FormInput
                type="checkbox"
                label="Non-US EFT Active"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleAddressChange("holdPayments", e.target.checked)
                }
              />
            </div>
          </div>
        </FormSection>
        <div className="flex flex-wrap gap-1 p-1.5">
          <ActionDetailButton
            label="Contacts"
            icon={History}
            isActive={activeSubModal.includes("Contacts")}
            onClick={() =>
              setActiveSubModal((prevArray) => [...prevArray, "Contacts"])
            }
          />
          <ActionDetailButton
            label="EFT Info (Non-US)"
            icon={History}
            isActive={activeSubModal.includes("EFTI(NONUS)")}
            onClick={() =>
              setActiveSubModal((prevArray) => [...prevArray, "EFTI(NONUS)"])
            }
          />
          <ActionDetailButton
            label="EFT Info (US)"
            icon={History}
            isActive={activeSubModal.includes("EFTI(US)")}
            onClick={() =>
              setActiveSubModal((prevArray) => [...prevArray, "EFTI(US)"])
            }
          />
        </div>

        {activeSubModal.includes("Contacts") && (
          <MainContainer
            className="mt-2"
            title="Contacts"
            handleClose={() =>
              setActiveSubModal((prev) =>
                prev.filter((item) => item !== "Contacts"),
              )
            }
          >
            <div className="space-y-3 mt-2">
              {/* Identification Row */}
              <FormSection title="Contact Information">
                <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                  {/* Row 1: Phone & Fax */}
                  <FormInput
                    label="Line"
                    type="text"
                    // value={address.contacts?.[0]?.sequenceNo || ""}
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.sequenceNo || ""
                    }
                    onChange={(e) =>
                      handleContactChange("sequenceNo", e.target.value)
                    }
                  />
                  <FormInput
                    label="Last Name"
                    type="text"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.contactLastName ||
                      ""
                    }
                    onChange={(e) =>
                      handleContactChange("contactLastName", e.target.value)
                    }
                  />
                  <FormInput
                    label="First Name"
                    type="text"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]
                        ?.contactFirstName || ""
                    }
                    onChange={(e) =>
                      handleContactChange("contactFirstName", e.target.value)
                    }
                  />
                  <FormInput
                    label="Title"
                    type="text"
                    value={formData.fax || ""}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />

                  <FormInput
                    label="Phone Number"
                    type="number"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.phoneNumber || ""
                    }
                    onChange={(e) =>
                      handleContactChange("phoneNumber", e.target.value)
                    }
                  />
                  <FormInput
                    label="Fax Number"
                    type="number"
                    value={formData.fax || ""}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />
                  <FormInput
                    label="Other Number"
                    type="number"
                    value={formData.fax || ""}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />
                  <FormInput
                    label="E-mail Address"
                    type="email"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.emailId || ""
                    }
                    onChange={(e) =>
                      handleContactChange("emailId", e.target.value)
                    }
                  />

                  {/* Row 2: Email (Spanning 2 columns for better readability) */}
                  <div className="col-span-2">
                    <FormInput
                      label="Notes"
                      type="text"
                      value={
                        formData.addresses?.[0]?.contacts?.[0]?.notes || ""
                      }
                      onChange={(e) =>
                        handleContactChange("notes", e.target.value)
                      }
                    />
                  </div>
                </div>
              </FormSection>
            </div>
          </MainContainer>
        )}

        {activeSubModal.includes("EFTI(NONUS)") && (
          <MainContainer
            className="mt-4"
            title="EFT Info (Non-US)"
            handleClose={() =>
              setActiveSubModal((prev) =>
                prev.filter((item) => item !== "EFTI(NONUS)"),
              )
            }
          >
            <div className="space-y-4">
              <div className="gap-x-8 gap-y-4">
                <FormInput
                  type="checkbox"
                  label="Use Bank ID/Bank Acct/ACH Code from Employee's Direct Deposit Banks"
                  checked={formData.holdPayments}
                  onChange={(e) =>
                    handleInputChange("holdPayments", e.target.checked)
                  }
                />
                <FormSearchSelect
                  label="Bank ID"
                  options={[]}
                  required
                  onSelect={(val) => handleInputChange("bankId", val)}
                />
                <FormInput
                  label="Bank Account"
                  type="text"
                  required
                  value={formData.bankAcc || ""}
                  onChange={(e) => handleInputChange("bankAcc", e.target.value)}
                />
                <FormInput
                  label="Non-US Bank Account"
                  type="text"
                  required
                  value={formData.nonbankAcc || ""}
                  onChange={(e) =>
                    handleInputChange("nonbankAcc", e.target.value)
                  }
                />
                <FormInput
                  type="text"
                  label="Bank Refernce"
                  value={formData.bankDesc || ""}
                  readOnly
                />
                <FormInput
                  type="text"
                  label="Originator ID Code"
                  value={formData.bankDesc || ""}
                  readOnly
                />
                <FormInput
                  type="text"
                  label="IBAN Code"
                  value={formData.bankDesc || ""}
                  readOnly
                />
                <FormInput
                  type="text"
                  label="SWIFT Code"
                  value={formData.bankDesc || ""}
                  readOnly
                />
                <FormSearchSelect
                  label="ACH Code"
                  options={[]}
                  onSelect={(val) => handleInputChange("state", val)}
                  readOnly
                />
                <FormSearchSelect
                  label="Intermediary Bank ID"
                  options={[]}
                  onSelect={(val) => handleInputChange("state", val)}
                  readOnly
                />
                <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                  <FormInput
                    type="checkbox"
                    label="EFT Active"
                    checked={formData.holdPayments}
                    onChange={(e) =>
                      handleInputChange("holdPayments", e.target.checked)
                    }
                  />
                  <FormInput
                    type="checkbox"
                    label="Print EFT Advice"
                    checked={formData.holdPayments}
                    onChange={(e) =>
                      handleInputChange("holdPayments", e.target.checked)
                    }
                  />
                  <FormInput
                    type="checkbox"
                    label="Email EFT Advice"
                    checked={formData.holdPayments}
                    onChange={(e) =>
                      handleInputChange("holdPayments", e.target.checked)
                    }
                  />

                  <FormInput
                    label="EFT Pmt Type"
                    type="text"
                    value={formData.eftPmtType || ""}
                    onChange={(e) =>
                      handleInputChange("eftPmtType", e.target.value)
                    }
                  />
                  <FormInput
                    label="Password"
                    type="password"
                    value={formData.bankPassword || ""}
                    onChange={(e) =>
                      handleInputChange("bankPassword", e.target.value)
                    }
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 italic">
                Note: Non-US Bank Accounts can be used to create outgoing IAT
                ACH files in Costpoint...
              </p>
            </div>
          </MainContainer>
        )}

        {activeSubModal.includes("EFTI(US)") && (
          <MainContainer
            className="mt-4"
            title="EFT Info (US)"
            handleClose={() =>
              setActiveSubModal((prev) =>
                prev.filter((item) => item !== "EFTI(US)"),
              )
            }
          >
            <div className="gap-x-8 gap-y-4">
              <FormInput
                type="checkbox"
                label="Use Bank ID/Bank Acct/ACH Code from Employee's Direct Deposit Banks"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleInputChange("holdPayments", e.target.checked)
                }
              />
              <FormSearchSelect
                label="Bank ID"
                options={[]}
                required
                onSelect={(val) => handleInputChange("bankId", val)}
              />
              <FormInput
                label="Bank Account"
                type="text"
                required
                value={formData.bankAcc || ""}
                onChange={(e) => handleInputChange("bankAcc", e.target.value)}
              />
              <FormInput
                label="Non-US Bank Account"
                type="text"
                required
                value={formData.nonbankAcc || ""}
                onChange={(e) =>
                  handleInputChange("nonbankAcc", e.target.value)
                }
              />
              <FormInput
                type="text"
                label="Bank Refernce"
                value={formData.bankDesc || ""}
                readOnly
              />
              <FormInput
                type="text"
                label="Originator ID Code"
                value={formData.bankDesc || ""}
                readOnly
              />
              <FormInput
                type="text"
                label="IBAN Code"
                value={formData.bankDesc || ""}
                readOnly
              />
              <FormInput
                type="text"
                label="SWIFT Code"
                value={formData.bankDesc || ""}
                readOnly
              />
              <FormSearchSelect
                label="ACH Code"
                options={[]}
                onSelect={(val) => handleInputChange("state", val)}
                readOnly
              />
              <FormSearchSelect
                label="Intermediary Bank ID"
                options={[]}
                onSelect={(val) => handleInputChange("state", val)}
                readOnly
              />
              <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                <FormInput
                  type="checkbox"
                  label="EFT Active"
                  checked={formData.holdPayments}
                  onChange={(e) =>
                    handleInputChange("holdPayments", e.target.checked)
                  }
                />
                <FormInput
                  type="checkbox"
                  label="Print EFT Advice"
                  checked={formData.holdPayments}
                  onChange={(e) =>
                    handleInputChange("holdPayments", e.target.checked)
                  }
                />
                <FormInput
                  type="checkbox"
                  label="Email EFT Advice"
                  checked={formData.holdPayments}
                  onChange={(e) =>
                    handleInputChange("holdPayments", e.target.checked)
                  }
                />

                <FormInput
                  label="EFT Pmt Type"
                  type="text"
                  value={formData.eftPmtType || ""}
                  onChange={(e) =>
                    handleInputChange("eftPmtType", e.target.value)
                  }
                />
                <FormInput
                  label="Password"
                  type="password"
                  value={formData.bankPassword || ""}
                  onChange={(e) =>
                    handleInputChange("bankPassword", e.target.value)
                  }
                />
              </div>
            </div>
          </MainContainer>
        )}
      </MainContainer>
    </div>
  );
};

export const CISInfo = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  // isDirty,
  loading,
  // toolbarActions,
}) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // const vendorCisInformations = formData.vendorCisInformations?.[0] || {};
  const vendId = formData.vendor.vendId;
  // 1. Manage CIS data locally instead of using formData
  // 1. Initial State Definition
  const initialCISState = {
    cisCode: "",
    cisType: "",
    certificateRegistrationNo: "",
    startDate: "",
    expiryDate: "",
    nationalInsuranceNo: "",
    authorizedUserName: "",
    tradingName: "",
    concernName: "",
    bankName: "",
    bankAddress: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    cityName: "",
    stateCode: "",
    postalCode: "",
    countryCode: "",
  };

  const [vendorCisInformations, setVendorCisInformations] =
    useState(initialCISState);

  const fetchMappedCIS = async () => {
    if (!vendId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/VendorCisInformation/${vendId}`,
      );
      // Axios automatically parses JSON
      if (response.data) {
        setVendorCisInformations({
          ...response.data,
          // Ensure dates are string format for inputs
          startDate: response.data.startDate?.split("T")[0] || "",
          expiryDate: response.data.expiryDate?.split("T")[0] || "",
        });
      }
    } catch (error) {
      console.error("Error fetching CIS mapping:", error);
    }
  };

  useEffect(() => {
    fetchMappedCIS();
  }, [vendId]);

  // 3. Local state change handler
  const handleCISInfoChange = (field, value) => {
    setVendorCisInformations((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  // --- Logic written exactly like your example ---
  const handleClear = () => {
    // 1. Check for unsaved work
    const hasEdits = isDirty;
    const isNewRecord =
      !vendorCisInformations.id &&
      (vendorCisInformations.cisCode || vendorCisInformations.cisType);

    if (!hasEdits && !isNewRecord) {
      // If nothing to discard, just clear the local clipboard
      setClipboard(null);
      toast.info("Clipboard memory cleared.");
      return;
    }

    // 2. Confirmation before losing work
    if (window.confirm("Discard all unsaved changes and new records?")) {
      // Re-fetch original data from API to overwrite local edits
      if (originalData) {
        setVendorCisInformations(originalData);
      } else {
        // If no original data existed (new record), reset to empty
        setVendorCisInformations({
          cisCode: "",
          cisType: "",
          // ... reset other fields
        });
      }

      // Reset UI State
      setIsDirty(false);
      setClipboard(null);

      toast.info("Unsaved changes discarded and clipboard cleared.");
    }
  };

  const handleSave = async () => {
    if (!vendId) {
      toast.error("No Vendor ID associated.");
      return;
    }

    if (
      !vendorCisInformations.cisCode ||
      vendorCisInformations.cisCode.trim() === ""
    ) {
      toast.error("Please enter CIS Code");
      return;
    }

    // Construct the exact payload requested
    const payload = {
      // Basic Identifiers
      vendId: vendId,
      companyId: formData.companyId || "string",
      modifiedBy: `${user.name}`,

      // Detail Data
      cisCode: vendorCisInformations.cisCode,
      cisType: vendorCisInformations.cisType,
      certificateRegistrationNo:
        vendorCisInformations.certificateRegistrationNo,
      nationalInsuranceNo: vendorCisInformations.nationalInsuranceNo,
      authorizedUserName: vendorCisInformations.authorizedUserName,
      tradingName: vendorCisInformations.tradingName,
      concernName: vendorCisInformations.concernName,

      // Dates
      startDate: vendorCisInformations.startDate
        ? new Date(vendorCisInformations.startDate).toISOString()
        : new Date().toISOString(),
      expiryDate: vendorCisInformations.expiryDate
        ? new Date(vendorCisInformations.expiryDate).toISOString()
        : new Date().toISOString(),

      // Bank Info
      bankName: vendorCisInformations.bankName,
      bankAddress: vendorCisInformations.bankAddress,

      // CIS Address Fields
      addressLine1: vendorCisInformations.addressLine1,
      addressLine2: vendorCisInformations.addressLine2,
      addressLine3: vendorCisInformations.addressLine3,
      cityName: vendorCisInformations.cityName,
      stateCode: vendorCisInformations.stateCode,
      postalCode: vendorCisInformations.postalCode,
      countryCode: vendorCisInformations.countryCode,
    };

    try {
      const isUpdate = !!vendorCisInformations.cisCode;

      // Update: /api/VendorCisInformation/{id}
      // New: /api/VendorCisInformation
      const url = isUpdate
        ? `${backendUrl}/api/VendorCisInformation/${vendId}`
        : `${backendUrl}/api/VendorCisInformation`;

      const response = isUpdate
        ? await axios.put(url, payload)
        : await axios.post(url, payload);
      // const response = await axios.post(
      //   `${backendUrl}/api/VendorCisInformation`,
      //   payload,
      // );
      if (response.status === 200 || response.status === 201) {
        toast.success("CIS Information saved successfully!");
      }
      await fetchMappedCIS();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving CIS information.");
    }
  };
  // --- Toolbar Actions ---

  const handleAdd = () => {
    // Initializes an empty record
    setVendorCisInformations({ ...initialCISState });
    setIsDirty(true);
    toast.info("New CIS record initialized.");
  };

  const handleDelete = async () => {
    // 1. Check if there is an actual record to delete from the database
    const recordId = formData.vendor.vendId;

    if (!recordId) {
      // If there's no ID, it's a new unsaved record, just clear the screen
      setVendorCisInformations({ ...initialCISState });
      setIsDirty(false);
      toast.info("New record cleared.");
      return;
    }

    // 2. Confirmation before API call
    if (
      window.confirm(
        "Are you sure you want to permanently delete this CIS record?",
      )
    ) {
      try {
        // 3. API Call: DELETE https://finaxis-dev.onrender.com/api/VendorCisInformation/{id}
        const response = await axios.delete(
          `${backendUrl}/api/VendorCisInformation/${recordId}`,
        );

        if (response.status === 200 || response.status === 204) {
          // 4. Reset local state on success
          setVendorCisInformations({ ...initialCISState });
          setOriginalData(null);
          setIsDirty(false);
          toast.success("CIS Record deleted successfully.");
        }
      } catch (error) {
        console.error("Delete error:", error.response?.data || error.message);
        toast.error("Failed to delete record from server.");
      }
    }
  };

  const handleCopy = () => {
    setClipboard({ ...vendorCisInformations });
    toast.success("CIS Info copied.");
  };

  const handlePaste = () => {
    if (clipboard) {
      setVendorCisInformations({ ...clipboard });
      setIsDirty(true);
      toast.success("CIS Info pasted.");
    } else {
      toast.error("Clipboard is empty.");
    }
  };

  const handleCISInfoChangeForm = (field, value) => {
    const updatedCISInfo = [...(formData.vendorCisInformations || [])];
    if (updatedCISInfo.length === 0) {
      updatedCISInfo.push({ [field]: value });
    } else {
      updatedCISInfo[0] = { ...updatedCISInfo[0], [field]: value };
    }
    // handleInputChange("vendorCisInformations", updatedCISInfo);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onSave: handleSave,
    onClear: handleClear,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer title="CIS Info" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />

        <div className="p-2 space-y-4 animate-in fade-in duration-300">
          {/* Detail Data Section */}
          <FormSection title="Detail Data">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="CIS Code"
                // options={[]}
                value={vendorCisInformations.cisCode || ""}
                onChange={(e) => handleCISInfoChange("cisCode", e.target.value)}
                //list of CIS  Code
                // onSelect={(val) => handleCISInfoChange("cisCode", val.name)}
                // displayKey="name"
              />
              <FormInput
                label="CIS Type"
                value={vendorCisInformations.cisType || ""}
                onChange={(e) => handleCISInfoChange("cisType", e.target.value)}
                // options={[]}
                //cis type list
                // onSelect={(val) => handleCISInfoChange("cisType", val.name)}
                // displayKey="name"
              />
              <FormInput
                label="Certificate/Registration"
                value={vendorCisInformations.certificateRegistrationNo || ""}
                onChange={(e) =>
                  handleCISInfoChange(
                    "certificateRegistrationNo",
                    e.target.value,
                  )
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  label="Start Date"
                  type="date"
                  required
                  value={vendorCisInformations.startDate || ""}
                  onChange={(e) =>
                    handleCISInfoChange("startDate", e.target.value)
                  }
                />
                <FormInput
                  label="Expiry Date"
                  type="date"
                  required
                  value={vendorCisInformations.expiryDate || ""}
                  onChange={(e) =>
                    handleCISInfoChange("expiryDate", e.target.value)
                  }
                />
              </div>

              <FormInput
                label="National Insurance No"
                value={vendorCisInformations.nationalInsuranceNo || ""}
                onChange={(e) =>
                  handleCISInfoChange("nationalInsuranceNo", e.target.value)
                }
              />
              <FormInput
                label="Authorized User Name"
                value={vendorCisInformations.authorizedUserName || ""}
                onChange={(e) =>
                  handleCISInfoChange("authorizedUserName", e.target.value)
                }
              />
              <FormInput
                label="Trading As Name"
                value={vendorCisInformations.tradingName || ""}
                onChange={(e) =>
                  handleCISInfoChange("tradingName", e.target.value)
                }
              />
              <FormInput
                label="Concern Name"
                value={vendorCisInformations.concernName || ""}
                onChange={(e) =>
                  handleCISInfoChange("concernName", e.target.value)
                }
              />
              <FormInput
                label="Bank Name"
                value={vendorCisInformations.bankName || ""}
                onChange={(e) =>
                  handleCISInfoChange("bankName", e.target.value)
                }
              />
              <FormInput
                label="Bank Address"
                value={vendorCisInformations.bankAddress || ""}
                onChange={(e) =>
                  handleCISInfoChange("bankAddress", e.target.value)
                }
              />
            </div>
          </FormSection>

          {/* CIS Address Section */}
          <FormSection title="CIS Address">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Line 1"
                value={vendorCisInformations.addressLine1 || ""}
                onChange={(e) =>
                  handleCISInfoChange("addressLine1", e.target.value)
                }
              />
              <FormInput
                label="Line 2"
                value={vendorCisInformations.addressLine2 || ""}
                onChange={(e) =>
                  handleCISInfoChange("addressLine2", e.target.value)
                }
              />
              <FormInput
                label="Line 3"
                value={vendorCisInformations.addressLine3 || ""}
                onChange={(e) =>
                  handleCISInfoChange("addressLine3", e.target.value)
                }
              />
              <FormInput
                label="City"
                value={vendorCisInformations.cityName || ""}
                onChange={(e) =>
                  handleCISInfoChange("cityName", e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <FormSearchSelect
                  label="State/Province"
                  options={[]}
                  onSelect={(val) => handleCISInfoChange("stateCode", val.name)}
                  displayKey="name"
                />
                <FormInput
                  label="Postal Code"
                  value={vendorCisInformations.postalCode || ""}
                  onChange={(e) =>
                    handleCISInfoChange("postalCode", e.target.value)
                  }
                />
              </div>
              <FormSearchSelect
                label="Country"
                onSelect={(val) => handleCISInfoChange("countryCode", val.name)}
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const VATInfo = ({ formData, onClose, isFormView, loading }) => {
  // 1. Initial State & Logic Helpers
  const vendId = formData.vendor?.vendId;
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const companyId = 1;
  const initialVATState = {
    taxId: "",
    taxloc: "",
    isActive: false,
  };

  const [vatInformation, setVatInformation] = useState(initialVATState);

  // 2. Data Fetching
  const fetchVATMapping = async () => {
    if (!vendId) return;
    try {
      // Assuming endpoint follows your standard pattern
      const response = await axios.get(
        `${backendUrl}/api/VendorVatInfo/${vendId}/${companyId}`,
      );
      if (response.data) {
        const data = response.data;
        setVatInformation(data);
        setOriginalData(data); // Store for 'Clear' functionality
      }
    } catch (error) {
      console.error("Error fetching VAT info:", error);
    }
  };

  useEffect(() => {
    fetchVATMapping();
  }, [vendId]);

  // 3. Handlers
  const handleVATChange = (field, value) => {
    setVatInformation((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId) {
      toast.error("No Vendor ID associated.");
      return;
    }

    const payload = {
      ...vatInformation,
      vendId: vendId,
      companyId: formData.companyId || "1",
      modifiedBy: `${user.name}`,
    };

    try {
      const isUpdate = !!vatInformation.taxId; // Check if record exists
      const url = isUpdate
        ? `${backendUrl}/api/VendorVatInfo/${vendId}/${companyId}`
        : `${backendUrl}/api/VendorVatInfo`;

      const response = isUpdate
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("VAT Information saved successfully!");
        setIsDirty(false);
        await fetchVATMapping();
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving VAT information.");
    }
  };

  const handleClear = () => {
    if (!isDirty && !vatInformation.taxId) {
      setClipboard(null);
      toast.info("Clipboard memory cleared.");
      return;
    }

    if (window.confirm("Discard all unsaved changes?")) {
      setVatInformation(originalData || initialVATState);
      setIsDirty(false);
      setClipboard(null);
      toast.info("Changes discarded.");
    }
  };

  const handleAdd = () => {
    setVatInformation({ ...initialVATState });
    setIsDirty(true);
    toast.info("New VAT record initialized.");
  };

  const handleDelete = async () => {
    if (!vendId) return;

    if (window.confirm("Are you sure you want to delete this VAT record?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/VendorVatInfo/${vendId}/${companyId}`,
        );
        if (response.status === 200 || response.status === 204) {
          setVatInformation({ ...initialVATState });
          setOriginalData(null);
          setIsDirty(false);
          toast.success("VAT Record deleted.");
        }
      } catch (error) {
        toast.error("Failed to delete record.");
      }
    }
  };

  const handleCopy = () => {
    setClipboard({ ...vatInformation });
    toast.success("VAT Info copied.");
  };

  const handlePaste = () => {
    if (clipboard) {
      setVatInformation({ ...clipboard });
      setIsDirty(true);
      toast.success("VAT Info pasted.");
    } else {
      toast.error("Clipboard is empty.");
    }
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onSave: handleSave,
    onClear: handleClear,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="VAT Info" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="p-2 space-y-4">
          <FormSection title="Tax Details">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Tax ID"
                value={vatInformation.taxId || ""}
                onChange={(e) => handleVATChange("taxId", e.target.value)}
              />
              <FormInput
                label="Tax Location"
                value={vatInformation.taxLocationCd || ""}
                onChange={(e) =>
                  handleVATChange("taxLocationCd", e.target.value)
                }
              />
              <FormInput
                type="checkbox"
                label="Default"
                checked={vatInformation.defaultTaxIdFl === "Y"}
                onChange={(e) =>
                  handleVATChange(
                    "defaultTaxIdFl",
                    e.target.checked ? "Y" : "N",
                  )
                }
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const VendorCertifications = ({
  formData,
  onClose,
  // isFormView,
  // isDirty,
  loading,
  // toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]); // Array from GET
  const [currentIndex, setCurrentIndex] = useState(0); // Navigation index

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const vendId = formData.vendor.vendId;

  const initialCertificateState = {
    certCd: "",
    certSeqNo: "",
    companyId: "",
    certStartDate: "",
    certStatusCd: "",
    certLevelCd: "",
    certEndDate: "",
    certUrl: "",
    certNotes: "",
    addrDc: "",
    certName: "", // UI Display field
    certStatusDesc: "", // UI Display field
    certLevelDesc: "",
  };

  // 1. States & Constants
  const [certData, setCertData] = useState(initialCertificateState);

  const companyId = formData?.companyId || "1";

  // Mocked Options with id/name structure
  const certOptions = [
    { id: "ISO", name: "ISO 9001" },
    { id: "CIS", name: "CIS Compliance" },
  ];
  const statusOptions = [
    { id: "A", name: "Active" },
    { id: "I", name: "Inactive" },
  ];
  const levelOptions = [
    { id: "1", name: "Level 1 - Basic" },
    { id: "2", name: "Level 2 - Advanced" },
  ];

  const mapCodesToNames = (record) => {
    if (!record) return initialCertificateState;

    const matchedCert = certOptions.find((o) => o.id === record.certCd);
    const matchedStatus = statusOptions.find(
      (o) => o.id === record.certStatusCd,
    );
    const matchedLevel = levelOptions.find((o) => o.id === record.certLevelCd);

    return {
      ...record,
      certName: matchedCert ? matchedCert.name : "",
      certStatusDesc: matchedStatus ? matchedStatus.name : "",
      certLevelDesc: matchedLevel ? matchedLevel.name : "",
    };
  };

  // 2. Data Fetching
  const fetchCertifications = async () => {
    if (!vendId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-certifications/GetCertificationsByVendor/${vendId}/${companyId}`,
      );

      if (response.data && response.data.length > 0) {
        // Map names to every record in the array
        const mappedList = response.data.map((item) => mapCodesToNames(item));
        setOriginalData(mappedList);
        setCertData(mappedList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        handleAdd();
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, [vendId]);

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;

    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1) {
      newIndex++;
    } else if (direction === "prev" && currentIndex > 0) {
      newIndex--;
    } else if (direction === "first") {
      newIndex = 0;
    } else if (direction === "last") {
      newIndex = originalData.length - 1;
    }

    setCurrentIndex(newIndex);
    setCertData(originalData[newIndex]);
    setIsDirty(false);
  };

  // 3. Handlers
  const handleLocalChange = (field, value) => {
    setCertData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId) {
      toast.error("No Vendor ID associated.");
      return;
    }
    if (!certData.certCd) {
      toast.error("Certification Code is required.");
      return;
    }

    // Standardize the payload to match your JSON structure
    const payload = {
      ...certData,
      vendId: vendId,
      companyId: companyId,
      modifiedBy: user.name || "System",
      timeStamp: new Date().toISOString().split("T")[0], // Matches YYYY-MM-DD
    };

    try {
      const isUpdate = !!certData.certCd;

      if (isUpdate) {
        // MATCHING YOUR SWAGGER IMAGE:
        // /api/vendor-certifications/{certCd}/{certSeqNo}/{companyId}/{certStartDate}
        const putUrl = `${backendUrl}/api/vendor-certifications/${certData.certCd}/${certData.certSeqNo}/${companyId}/${certData.certStartDate}`;
        const response = await axios.put(putUrl, payload);

        if (response.status === 200) {
          toast.success("Certification updated successfully!");
          setIsDirty(false);
          fetchCertifications();
        }
      } else {
        // POST usually just goes to the base collection
        const response = await axios.post(
          `${backendUrl}/api/vendor-certifications`,
          payload,
        );
        if (response.status === 201 || response.status === 200) {
          toast.success("Certification created successfully!");
          setIsDirty(false);
          fetchCertifications();
        }
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error saving certification. Check console for details.");
    }
  };

  const handleClear = () => {
    if (!isDirty) {
      setClipboard(null);
      toast.info("Clipboard cleared.");
      return;
    }

    if (window.confirm("Discard all unsaved changes?")) {
      setCertData(originalData || { ...initialCertificateState });
      setIsDirty(false);
    }
  };

  const handleAdd = () => {
    setCertData({
      certCd: "",
      certSeqNo: "",
      certStartDate: "",
      certStatusCd: "",
      certLevelCd: "",
      certEndDate: "",
      certUrl: "",
      certNotes: "",
      addrDc: "",
    });
    setIsDirty(true);
    toast.info("Initialized new certification record.");
  };

  const handleDelete = async () => {
    if (!certData.certSeqNo && certData.certSeqNo !== 0) return;
    if (!window.confirm("Delete this record?")) return;

    try {
      // Assuming delete uses the same path params as PUT
      const delUrl = `${backendUrl}/api/vendor-certifications/${certData.certCd}/${certData.certSeqNo}/${companyId}/${certData.certStartDate}`;
      await axios.delete(delUrl);
      toast.success("Deleted.");
      fetchCertifications();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onDelete: handleDelete,
    onCopy: () => {
      setClipboard({ ...certData });
      toast.success("Copied.");
    },
    onPaste: () => {
      if (clipboard) {
        setCertData({ ...clipboard });
        setIsDirty(true);
      }
    },
    onSave: handleSave,
    onClear: handleClear,
  };

  const handleCertSelect = (val) => {
    setCertData((prev) => ({
      ...prev,
      certCd: val.id, // Sets the Code (e.g., ISO9001)
      certName: val.name, // Sets the Name (e.g., Quality Management System)
    }));
    setIsDirty(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer title="Vendor Certifications" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2">
          <FormSection>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormSearchSelect
                label="Certification Code"
                options={certOptions}
                value={certData.certCd}
                displayKey="id"
                // onSelect={(val) => handleLocalChange("certCd", val.id)}
                onSelect={handleCertSelect}
              />
              <FormInput
                label="Certification Name"
                value={certData.certName || ""}
                readOnly
                onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
              />

              <FormInput
                label="Professional Org Code"
                value={formData.cisCertNo || ""}
                readOnly
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              <FormInput
                label="Professional Org Name"
                value={formData.cisCertNo || ""}
                readOnly
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              {/* --- Status Section --- */}
              <FormSearchSelect
                label="Status Code"
                options={statusOptions}
                value={certData.certStatusCd}
                displayKey="id"
                onSelect={(val) => {
                  handleLocalChange("certStatusCd", val.id);
                  handleLocalChange("certStatusDesc", val.name); // Updates the description field
                }}
              />
              <FormInput
                label="Status Description"
                value={certData.certStatusDesc || ""}
                readOnly // Recommended since it's auto-filled
                onChange={(e) =>
                  handleLocalChange("certStatusDesc", e.target.value)
                }
              />

              {/* --- Level Section --- */}
              <FormSearchSelect
                label="Level Code"
                options={levelOptions}
                value={certData.certLevelCd}
                displayKey="id"
                onSelect={(val) => {
                  handleLocalChange("certLevelCd", val.id);
                  handleLocalChange("certLevelDesc", val.name); // Updates the description field
                }}
              />
              <FormInput
                label="Level Description"
                value={certData.certLevelDesc || ""}
                readOnly
                onChange={(e) =>
                  handleLocalChange("certLevelDesc", e.target.value)
                }
              />
              <FormInput
                label="Start Date"
                type="date"
                required
                value={certData.certStartDate}
                onChange={(e) =>
                  handleLocalChange("certStartDate", e.target.value)
                }
              />
              <FormInput
                label="End Date"
                type="date"
                required
                value={certData.certEndDate}
                onChange={(e) =>
                  handleLocalChange("certEndDate", e.target.value)
                }
              />
              <FormSearchSelect
                label="Address"
                options={[{ id: "HQ", name: "Headquarters" }]}
                onSelect={(val) => handleLocalChange("addrDc", val.id)}
              />

              <FormInput
                label="URL"
                value={formData.certUrl || ""}
                onChange={(e) => handleLocalChange("certUrl", e.target.value)}
              />
            </div>
            <FormInput
              label="Notes"
              value={certData.certNotes}
              onChange={(e) => handleLocalChange("certNotes", e.target.value)}
            />
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const CreditCardInfo = ({ formData, onClose, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [isFormView, setIsFormView] = useState(true);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const vendId = formData?.vendor?.vendId || formData?.vendId;
  const companyId = formData?.companyId || "1";

  const initialCreditState = {
    creditCardNumber: "",
    creditCardName: "",
    creditCardType: "",
    creditCardExpiryDate: "",
    creditCardLimitAmount: 0,
    internalNotes: "",
    approvalNotes: "",
    companyId: companyId,
    vendId: vendId,
  };

  const [creditState, setCreditState] = useState(initialCreditState);

  const creditCardOpt = [
    { id: "VISA", name: "Visa" },
    { id: "MAST", name: "MasterCard" },
    { id: "AMEX", name: "American Express" },
  ];

  const fetchCreditCard = async () => {
    if (!vendId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-credit-cards/${companyId}/${vendId}`,
      );

      if (response.data) {
        const record = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (record) {
          // FIX: When data arrives, find the matching name from options if name is missing in record
          if (!record.creditCardName && record.creditCardType) {
            record.creditCardName =
              creditCardOpt.find((opt) => opt.id === record.creditCardType)
                ?.name || "";
          }
          setCreditState(record);
          setOriginalData(record);
        }
      }
    } catch (error) {
      console.error("Error fetching credit card info:", error);
    }
  };

  useEffect(() => {
    fetchCreditCard();
  }, [vendId]);

  const handleStateChange = (field, value) => {
    setCreditState((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId || !companyId) {
      toast.error("Missing Vendor or Company ID.");
      return;
    }

    try {
      // Determine if we are updating (PUT) or creating (POST)
      // originalData is set when fetchCreditCard succeeds
      const isUpdate = originalData !== null;

      // URL for PUT includes path parameters per Swagger screenshot
      const url = isUpdate
        ? `${backendUrl}/api/vendor-credit-cards/${companyId}/${vendId}`
        : `${backendUrl}/api/vendor-credit-cards`;

      const payload = {
        creditCardNumber: creditState.creditCardNumber,
        creditCardType: creditState.creditCardType,
        creditCardExpiryDate: creditState.creditCardExpiryDate,
        creditCardLimitAmount:
          parseFloat(creditState.creditCardLimitAmount) || 0,
        internalNotes: creditState.internalNotes || "",
        approvalNotes: creditState.approvalNotes || "",
        vendId: vendId,
        companyId: companyId,
        modifiedBy: user.name || "Admin",
      };

      // Dynamically choose axios.put or axios.post
      const response = await axios({
        method: isUpdate ? "put" : "post",
        url: url,
        data: payload,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Credit Card info ${isUpdate ? "updated" : "saved"} successfully!`,
        );
        setIsDirty(false);
        fetchCreditCard(); // Refresh to sync state with DB
      }
    } catch (error) {
      console.error("Save Error:", error.response?.data || error.message);
      toast.error("Error saving credit card information.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setCreditState(initialCreditState);
      setIsDirty(true);
    },
    onDelete: async () => {
      if (window.confirm("Delete this record?")) {
        try {
          await axios.delete(
            `${backendUrl}/api/vendor-credit-cards/${companyId}/${vendId}`,
          );
          setCreditState(initialCreditState);
          toast.success("Deleted.");
        } catch {
          toast.error("Delete failed.");
        }
      }
    },
    onCopy: () => {
      setClipboard({ ...creditState });
      toast.info("Copied.");
    },
    onPaste: () => clipboard && setCreditState({ ...clipboard }),
    onSave: handleSave,
    onClear: () => {
      if (window.confirm("Discard changes?")) {
        setCreditState(originalData || initialCreditState);
        setIsDirty(false);
      }
    },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Credit Card Info" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
        />

        <div className="mt-2">
          <FormSection title="Credit Card Details">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <FormSearchSelect
                  label="Card Type"
                  options={creditCardOpt}
                  value={creditState.creditCardType}
                  displayKey="id"
                  onSelect={(val) => {
                    // FIX: Set both ID and Name when selecting from dropdown
                    handleStateChange("creditCardType", val.id);
                    handleStateChange("creditCardName", val.name);
                  }}
                />
                <FormInput
                  label="Card Name (on Card)"
                  value={creditState.creditCardName || ""}
                  disabled // Use disabled instead of readOnly for standard UI feel
                />
              </div>

              <FormInput
                label="Credit Card Number"
                value={creditState.creditCardNumber || ""}
                onChange={(e) =>
                  handleStateChange("creditCardNumber", e.target.value)
                }
              />

              <FormInput
                label="Expiration Date"
                type="date"
                value={
                  creditState.creditCardExpiryDate
                    ? creditState.creditCardExpiryDate.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleStateChange("creditCardExpiryDate", e.target.value)
                }
              />

              <FormInput
                label="Limit Amount"
                type="number"
                value={creditState.creditCardLimitAmount || ""}
                onChange={(e) =>
                  handleStateChange("creditCardLimitAmount", e.target.value)
                }
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const SubContractorInfo = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  isDirty,
  loading,
  toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer
        title="Subcontractor Payment Control"
        handleClose={onClose}
      >
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2">
          <FormSection>
            <p>
              Checking the 'Payment Control' check box will subject the Vendor's
              vouchers to eduts for lien,bond, and insurance criteria
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                type="checkbox"
                label="Payment Control"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleInputChange("holdPayments", e.target.checked)
                }
              />
              <FormInput
                label="Comparison Dates"
                value={formData.cisNiNo || ""}
                onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
              />
            </div>
          </FormSection>
        </div>
        <div className="flex flex-wrap gap-1  p-1.5 ">
          <ActionDetailButton
            label="Bond"
            icon={User}
            isActive={
              activeSubModal.includes("Bond") || activeSubModal.includes
            }
            onClick={() =>
              setActiveSubModal((prevArray) => [
                ...prevArray,
                "Bond",
                "BondInfo",
              ])
            }
          />
          <ActionDetailButton
            label="Insurance"
            icon={Layers}
            isActive={
              activeSubModal.includes("Insurance") ||
              activeSubModal.includes("InsuranceInfo")
            }
            onClick={() =>
              setActiveSubModal((prevArray) => [
                ...prevArray,
                "Insurance",
                "InsuranceInfo",
              ])
            }
          />
          <ActionDetailButton
            label="Lien"
            icon={ShieldCheck}
            isActive={activeSubModal.includes("Lien")}
            onClick={() =>
              setActiveSubModal((prevArray) => [...prevArray, "Lien"])
            }
          />
        </div>

        {(activeSubModal.includes("Bond") ||
          activeSubModal.includes("BondInfo")) && (
          <div className="space-y-3 mt-2">
            {activeSubModal.includes("Bond") && (
              <MainContainer
                title="Bonds"
                handleClose={() =>
                  setActiveSubModal((prev) =>
                    prev.filter((item) => item !== "Bond"),
                  )
                }
              >
                <Toolbar
                  isFormView={isFormView}
                  isDirty={isDirty}
                  loading={loading}
                  actions={toolbarActions}
                  currentIndex={0}
                  totalRecords={1}
                />

                {/* Identification Row */}
                <FormSection title="Payment Restrictions">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <FormSearchSelect
                      label="Project"
                      options={[]}
                      onSelect={(val) => handleInputChange("cisCode", val.name)}
                    />
                    <FormInput
                      value={formData.cisNiNo || ""}
                      onChange={(e) =>
                        handleInputChange("cisNiNo", e.target.value)
                      }
                    />
                    <FormSearchSelect
                      label="Bond Type"
                      options={[]}
                      onSelect={(val) => handleInputChange("cisCode", val.name)}
                    />
                    {/* Row 1: Phone & Fax */}
                    <FormInput
                      label="Bond Type"
                      type="text"
                      value={formData.fax || ""}
                      onChange={(e) => handleInputChange("fax", e.target.value)}
                    />
                    <FormInput
                      label="Required Start Date"
                      type="date"
                      required
                      value={formData.cisStartDt || ""}
                      onChange={(e) =>
                        handleInputChange("cisStartDt", e.target.value)
                      }
                    />
                    <FormInput
                      type="checkbox"
                      label="Required for Payment"
                      checked={formData.holdPayments}
                      onChange={(e) =>
                        handleInputChange("holdPayments", e.target.checked)
                      }
                    />
                    <FormInput
                      label="Required End Date"
                      type="date"
                      required
                      value={formData.cisStartDt || ""}
                      onChange={(e) =>
                        handleInputChange("cisStartDt", e.target.value)
                      }
                    />
                  </div>
                </FormSection>
              </MainContainer>
            )}
            {activeSubModal.includes("BondInfo") && (
              <SecondaryContainer
                title="Bond Information"
                handleClose={() =>
                  setActiveSubModal((prev) =>
                    prev.filter((item) => item !== "BondInfo"),
                  )
                }
              >
                <Toolbar
                  isFormView={isFormView}
                  isDirty={isDirty}
                  loading={loading}
                  actions={toolbarActions}
                  currentIndex={0}
                  totalRecords={1}
                />
                <div className="mt-2">
                  <FormInput
                    label="Bond Number"
                    value={formData.cisNiNo || ""}
                    onChange={(e) =>
                      handleInputChange("cisNiNo", e.target.value)
                    }
                  />
                  <FormInput
                    label="Effective Date"
                    type="date"
                    required
                    value={formData.laborEffDate}
                    onChange={(e) =>
                      handleInputChange("laborEffDate", e.target.value)
                    }
                  />
                  <FormInput
                    label="Expiration Date"
                    type="date"
                    required
                    value={formData.laborEffDate}
                    onChange={(e) =>
                      handleInputChange("laborEffDate", e.target.value)
                    }
                  />

                  <FormInput
                    label="Amount"
                    value={formData.cisNiNo || ""}
                    onChange={(e) =>
                      handleInputChange("cisNiNo", e.target.value)
                    }
                  />
                  <FormInput
                    label="Notes"
                    value={formData.cisNiNo || ""}
                    onChange={(e) =>
                      handleInputChange("cisNiNo", e.target.value)
                    }
                  />
                </div>
              </SecondaryContainer>
            )}
          </div>
        )}
        {(activeSubModal.includes("Insurance") ||
          activeSubModal.includes("InsuranceInfo")) && (
          <div className="space-y-3 mt-2">
            <MainContainer
              title="Insurance"
              handleClose={() =>
                setActiveSubModal((prev) =>
                  prev.filter((item) => item !== "Insurance"),
                )
              }
            >
              <Toolbar
                isFormView={isFormView}
                isDirty={isDirty}
                loading={loading}
                actions={toolbarActions}
                currentIndex={0}
                totalRecords={1}
              />

              {/* Identification Row */}
              <FormSection>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <FormSearchSelect
                    label="Project"
                    options={[]}
                    onSelect={(val) => handleInputChange("cisCode", val.name)}
                  />
                  <FormInput
                    value={formData.cisNiNo || ""}
                    onChange={(e) =>
                      handleInputChange("cisNiNo", e.target.value)
                    }
                  />
                  <FormSearchSelect
                    label="Policy Type"
                    options={[]}
                    onSelect={(val) => handleInputChange("cisCode", val.name)}
                  />

                  <FormInput
                    label="Required Start Date"
                    type="date"
                    required
                    value={formData.cisStartDt || ""}
                    onChange={(e) =>
                      handleInputChange("cisStartDt", e.target.value)
                    }
                  />
                  <FormInput
                    type="checkbox"
                    label="Required for Payment"
                    checked={formData.holdPayments}
                    onChange={(e) =>
                      handleInputChange("holdPayments", e.target.checked)
                    }
                  />
                  <FormInput
                    label="Required End Date"
                    type="date"
                    required
                    value={formData.cisStartDt || ""}
                    onChange={(e) =>
                      handleInputChange("cisStartDt", e.target.value)
                    }
                  />
                </div>
              </FormSection>
            </MainContainer>
            <MainContainer
              title="Insurance Information"
              handleClose={() =>
                setActiveSubModal((prev) =>
                  prev.filter((item) => item !== "InsuranceInfo"),
                )
              }
            >
              <Toolbar
                isFormView={isFormView}
                isDirty={isDirty}
                loading={loading}
                actions={toolbarActions}
                currentIndex={0}
                totalRecords={1}
              />
              <div className="mt-2">
                <FormSearchSelect
                  label="Insurance Carrier"
                  options={[]}
                  onSelect={(val) => handleInputChange("cisCode", val.name)}
                />
                <FormInput
                  label="Policy Number"
                  value={formData.cisNiNo || ""}
                  onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
                />
                <FormInput
                  label="Effective Date"
                  type="date"
                  required
                  value={formData.laborEffDate}
                  onChange={(e) =>
                    handleInputChange("laborEffDate", e.target.value)
                  }
                />
                <FormInput
                  label="Expiration Date"
                  type="date"
                  required
                  value={formData.laborEffDate}
                  onChange={(e) =>
                    handleInputChange("laborEffDate", e.target.value)
                  }
                />

                <FormInput
                  label="Amount"
                  value={formData.cisNiNo || ""}
                  onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
                />
                <FormInput
                  label="Notes"
                  value={formData.cisNiNo || ""}
                  onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
                />
              </div>
            </MainContainer>
          </div>
        )}
        {activeSubModal.includes("Lien") && (
          <div className="space-y-3 mt-2">
            <MainContainer
              title="Lien"
              handleClose={() =>
                setActiveSubModal((prev) =>
                  prev.filter((item) => item !== "Lien"),
                )
              }
            >
              <Toolbar
                isFormView={isFormView}
                isDirty={isDirty}
                loading={loading}
                actions={toolbarActions}
                currentIndex={0}
                totalRecords={1}
              />
              <FormSection>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <FormSearchSelect
                    label="Project"
                    options={[]}
                    onSelect={(val) => handleInputChange("cisCode", val.name)}
                  />
                  <FormInput
                    value={formData.cisNiNo || ""}
                    onChange={(e) =>
                      handleInputChange("cisNiNo", e.target.value)
                    }
                  />
                </div>
              </FormSection>
              <div className="mt-2">
                <FormSection title="Information">
                  <FormInput
                    label="Effective Date"
                    type="date"
                    value={formData.cisStartDt || ""}
                    onChange={(e) =>
                      handleInputChange("cisStartDt", e.target.value)
                    }
                  />
                  <FormSearchSelect
                    label="Released"
                    required
                    options={[]}
                    onSelect={(val) => handleInputChange("cisCode", val.name)}
                  />
                  <FormInput
                    label="Issued By"
                    value={formData.cisNiNo || ""}
                    onChange={(e) =>
                      handleInputChange("cisNiNo", e.target.value)
                    }
                  />
                  <FormInput
                    label="Released Date"
                    type="date"
                    value={formData.cisStartDt || ""}
                    onChange={(e) =>
                      handleInputChange("cisStartDt", e.target.value)
                    }
                  />
                </FormSection>
              </div>
              <div className="mt-2">
                <FormSection title="Address Details">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <FormInput
                      label="Phone Number"
                      type="number"
                      value={formData.addresses.address1}
                      onChange={(e) =>
                        handleInputChange("address1", e.target.value)
                      }
                    />
                    <FormInput
                      label="Address Line 1"
                      value={formData.addresses.addressLine1}
                      onChange={(e) =>
                        handleInputChange("addressLine1", e.target.value)
                      }
                    />
                    <FormInput
                      label="Address Line 2"
                      value={formData.addresses.addressLine2}
                      onChange={(e) =>
                        handleInputChange("addressLine2", e.target.value)
                      }
                    />
                    <FormInput
                      label="Address Line 3"
                      value={formData.addresses.addressLine3}
                      onChange={(e) =>
                        handleInputChange("addressLine3", e.target.value)
                      }
                    />
                    <FormSearchSelect
                      label="City"
                      options={[]}
                      onSelect={(val) => handleInputChange("city", val.name)}
                    />
                    <FormSearchSelect
                      label="State"
                      options={[]}
                      onSelect={(val) => handleInputChange("state", val.name)}
                    />
                    <FormSearchSelect
                      label="Postal Code"
                      value={formData.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                    />

                    <FormSearchSelect
                      label="Country"
                      options={[]}
                      onSelect={(val) => handleInputChange("country", val.name)}
                    />
                  </div>
                </FormSection>
              </div>
            </MainContainer>
          </div>
        )}
      </MainContainer>
    </div>
  );
};

export const DefaultExpenseAccounts = ({ formData, onClose, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const vendId = formData.vendor?.vendId || formData.vendId;
  const companyId = formData.companyId || "1";

  const initialDefExpAcct = {
    vendExpLnKey: 0,
    lnNo: "",
    acctId: "",
    acctName: "", // For auto-populate
    orgId: "",
    orgName: "", // For auto-populate
    projId: "",
    projName: "", // For auto-populate
    ref1Id: "",
    ref2Id: "",
    pctOfTotalRt: 0,
    modifiedBy: user.name || "Admin",
    companyId: companyId,
    rowVersion: 0,
  };

  const [defExpAcctInfo, setDefExpAcctInfo] = useState(initialDefExpAcct);

  useEffect(() => {
    const fetchStaticOptions = async () => {
      try {
        const [projRes, orgRes, ref1Res, ref2Res] = await Promise.all([
          api.get(`${backendUrl}/Project/GetAllProjects`),
          api.get(`${backendUrl}/api/organizations`),
          api.get(`${backendUrl}/api/reference1`),
          api.get(`${backendUrl}/api/reference2`),
        ]);
        setProjectOpt(projRes.data || []);
        setOrgOpt(orgRes.data || []);
        setRef1Opt(ref1Res.data || []);
        setRef2Opt(ref2Res.data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchStaticOptions();
  }, []);

  const fetchAccounts = async () => {
    if (!defExpAcctInfo.projId) {
      setAcctOpt([]);
      return;
    }

    // Find the selected project to get its acctGroupCode
    const selectedProject = projectOpt.find(
      (p) => p.id === defExpAcctInfo.projId,
    );
    const groupCode = selectedProject?.acctGroupCode;

    if (groupCode) {
      try {
        const response = await api.get(
          `${backendUrl}/api/AccountGroupSetup/get?acctGroupCode=${groupCode}&CompanyId=${companyId}`,
        );
        // Assuming the API returns the group object with an 'accounts' array or similar
        // Adjust response.data mapping based on your actual AccountGroupSetup API return structure
        setAcctOpt(response.data?.accounts || response.data || []);
      } catch (error) {
        console.error("Error fetching group accounts:", error);
        setAcctOpt([]);
      }
    }
  };

  // 2. DYNAMIC: Fetch Accounts based on Selected Project's acctGroupCode
  // useEffect(() => {
  //   fetchAccounts();
  // }, [defExpAcctInfo.projId, projectOpt, companyId]);
  useEffect(() => {
    fetchAccounts();
  }, [defExpAcctInfo.projId]);

  // 2. DYNAMIC: Fetch Accounts based on Project Selection
  useEffect(() => {
    const fetchAccountsByProject = async () => {
      if (!defExpAcctInfo.projId) {
        setAcctOpt([]); // Clear accounts if no project
        return;
      }

      try {
        // Calling your specific API for filtered accounts
        const response = await api.get(
          `${backendUrl}/api/accounts/GetAccountsByProject/${defExpAcctInfo.projId}`,
        );
        setAcctOpt(response.data || []);
      } catch (error) {
        console.error("Error fetching project accounts:", error);
        setAcctOpt([]);
      }
    };

    fetchAccountsByProject();
  }, [defExpAcctInfo.projId]); // Runs whenever Project ID changes

  // Example Options (Usually fetched from API)
  const projectOpt = [
    { id: "PRJ01", name: "ISO 9001" },
    { id: "PRJ02", name: "CIS Compliance" },
  ];
  const acctOpt = [
    { id: "EXP01", name: "Travel Expense" },
    { id: "EXP02", name: "Office Supplies" },
  ];
  const orgOpt = [
    { id: "ORG01", name: "Sales Dept" },
    { id: "ORG02", name: "IT Dept" },
  ];

  const Ref1 = [
    { id: "1", name: "Level 1 - Basic" },
    { id: "2", name: "Level 2 - Advanced" },
  ];
  const Ref2 = [
    { id: "1", name: "Level 1 - Basic" },
    { id: "2", name: "Level 2 - Advanced" },
  ];

  // const [projectOpt, setProjectOpt] = useState([]);
  // const [acctOpt, setAcctOpt] = useState([]);
  // const [orgOpt, setOrgOpt] = useState([]);
  // const [ref1Opt, setRef1Opt] = useState([]);
  // const [ref2Opt, setRef2Opt] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [projRes, acctRes, orgRes, ref1Res, ref2Res] = await Promise.all([
          api.get(`${backendUrl}/Project/GetAllProjects`),
          api.get(
            `${backendUrl}/api/AccountGroupSetup/get?acctGroupCode=${projRes.acctGroupCode}&CompanyId=${companyId}`,
          ),
          api.get(`${backendUrl}/Orgnization/GetAllOrgs`),
          api.get(`${backendUrl}/api/RefStruc`),
          api.get(`${backendUrl}/api/RefStruc`),
        ]);
        setProjectOpt(projRes.data || []);
        setAcctOpt(acctRes.data || []);
        setOrgOpt(orgRes.data || []);
        setRef1Opt(ref1Res.data || []);
        setRef2Opt(ref2Res.data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const fetchDefAcctMapping = async () => {
    if (!vendId) return;
    try {
      // 1. Updated URL to use query parameters as per your requirement
      const response = await axios.get(
        `${backendUrl}/api/vendor-expense-accounts?vendId=${vendId}&page=1&pageSize=100`,
      );

      // 2. Extract the first item from the "data" array in the response
      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        let record = response.data.data[0];

        // 3. Match names from your options lists
        record.projName =
          projectOpt.find((p) => p.id === record.projId)?.name || "";
        record.acctName =
          acctOpt.find((a) => a.id === record.acctId)?.name || "";
        record.orgName = orgOpt.find((o) => o.id === record.orgId)?.name || "";

        // 4. Update state with the specific record
        setDefExpAcctInfo(record);
        setOriginalData(record);
      } else {
        // If no data found, reset to initial state
        setDefExpAcctInfo(initialDefExpAcct);
      }
    } catch (error) {
      console.error("Error fetching expense accounts:", error);
    }
  };

  useEffect(() => {
    fetchDefAcctMapping();
  }, [vendId]);

  // Updated handler to support auto-population of names
  const handleDefExpAcct = (
    field,
    value,
    nameField = null,
    nameValue = null,
  ) => {
    setDefExpAcctInfo((prev) => {
      const updated = { ...prev, [field]: value };
      if (nameField) updated[nameField] = nameValue;
      if (field === "projId") {
        updated.acctId = "";
        updated.acctName = "";
      }
      return updated;
    });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId) return toast.error("No Vendor ID associated.");

    try {
      // Ensure numeric fields are correctly typed
      const payload = {
        ...defExpAcctInfo,
        vendId,
        companyId,
        lnNo: parseInt(defExpAcctInfo.lnNo) || 0,
        pctOfTotalRt: parseFloat(defExpAcctInfo.pctOfTotalRt) || 0,
        modifiedBy: user.name,
      };

      const isUpdate = defExpAcctInfo.vendExpLnKey > 0;
      const url = `${backendUrl}/api/vendor-expense-accounts`;

      const response = isUpdate
        ? await axios.put(`${url}/${defExpAcctInfo.vendExpLnKey}`, payload)
        : await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Expense Account saved successfully!");
        setIsDirty(false);
        fetchDefAcctMapping();
      }
    } catch (error) {
      toast.error("Error saving information.");
    }
  };

  const handleClear = () => {
    if (window.confirm("Discard all unsaved changes?")) {
      setDefExpAcctInfo(originalData || initialDefExpAcct);
      setIsDirty(false);
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setDefExpAcctInfo(initialDefExpAcct);
      setIsDirty(true);
    },
    onDelete: async () => {
      // if (!defExpAcctInfo.vendExpLnKey) return;
      if (window.confirm("Delete this record?")) {
        await axios.delete(
          `${backendUrl}/api/vendor-expense-accounts/${defExpAcctInfo.lnNo}/${defExpAcctInfo.vendExpLnKey}`,
        );
        setDefExpAcctInfo(initialDefExpAcct);
        toast.success("Deleted.");
      }
    },
    onCopy: () => {
      setClipboard({ ...defExpAcctInfo });
      toast.info("Copied.");
    },
    onPaste: () =>
      clipboard && setDefExpAcctInfo({ ...clipboard, vendExpLnKey: 0 }),
    onSave: handleSave,
    onClear: handleClear,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Default Expense Accounts" handleClose={onClose}>
        <Toolbar
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          isFormView={isFormView}
        />
        <div className="mt-2">
          <FormSection>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Line"
                required
                value={defExpAcctInfo.lnNo || ""}
                onChange={(e) => handleDefExpAcct("lnNo", e.target.value)}
              />
              <div /> {/* Spacer */}
              <FormSearchSelect
                label="Project"
                options={projectOpt}
                value={defExpAcctInfo.projId}
                displayKey="id"
                onSelect={(val) =>
                  handleDefExpAcct("projId", val.id, "projName", val.name)
                }
              />
              <FormInput
                label="Project Name"
                disabled
                value={defExpAcctInfo.projName || ""}
              />
              <FormSearchSelect
                label="Account"
                options={acctOpt}
                value={defExpAcctInfo.acctId}
                displayKey="id"
                disabled={!defExpAcctInfo.projId}
                onSelect={(val) =>
                  handleDefExpAcct("acctId", val.id, "acctName", val.name)
                }
              />
              <FormInput
                label="Account Name"
                disabled
                value={defExpAcctInfo.acctName || ""}
              />
              <FormSearchSelect
                label="Organization"
                displayKey="id"
                options={orgOpt}
                value={defExpAcctInfo.orgId}
                onSelect={(val) =>
                  handleDefExpAcct("orgId", val.id, "orgName", val.name)
                }
              />
              <FormInput
                label="Org Name"
                disabled
                value={defExpAcctInfo.orgName || ""}
              />
              <FormSearchSelect
                label="Ref No 1"
                options={Ref1}
                value={defExpAcctInfo.ref1Id}
                displayKey="id"
                onSelect={(val) => handleDefExpAcct("ref1Id", val.id)}
              />
              <FormSearchSelect
                label="Ref No 2"
                options={Ref2}
                value={defExpAcctInfo.ref2Id}
                displayKey="id"
                onSelect={(val) => handleDefExpAcct("ref2Id", val.id)}
              />
              <FormInput
                label="Allocation (%)"
                required
                type="number"
                value={defExpAcctInfo.pctOfTotalRt || ""}
                onChange={(e) =>
                  handleDefExpAcct("pctOfTotalRt", e.target.value)
                }
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const UserDefinedInfo = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  isDirty,
  loading,
  toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer title="USer-Defined Info" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2">
          <FormSection>
            <FormInput
              label="Sequnece Number"
              value={formData.cisCertNo || ""}
              onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
            />
            <div className="grid grid-cols-3 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Data Type"
                value={formData.cisNiNo || ""}
                onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
              />
              <FormSearchSelect
                label="Labels"
                options={[]}
                onSelect={(val) => handleInputChange("cisCode", val.name)}
              />
              <FormInput
                label="Value"
                value={formData.cisCertNo || ""}
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              <FormInput
                label="Costpoint Validation Field"
                value={formData.cisCertNo || ""}
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              <FormInput
                label="Validated Text"
                value={formData.cisCertNo || ""}
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              <FormInput
                label="Required"
                value={formData.cisCertNo || ""}
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const VendorClassification = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  isDirty,
  loading,
  toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer title="Business Classification" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2">
          <div className="grid grid-cols-3 gap-x-8 gap-y-1 mt-2">
            <FormSection title="Default Size">
              {["Large", "Small", "Non-Profit", "Foreign/Other"].map(
                (status) => (
                  <FormInput
                    key={status}
                    type="radio"
                    label={status}
                    name="vendorStatus"
                    checked={formData.vendorStatus === status}
                    onChange={() => handleInputChange("vendorStatus", status)}
                  />
                ),
              )}
            </FormSection>

            <FormInput
              label="Certification Date"
              type="date"
              required
              value={formData.cisStartDt || ""}
              onChange={(e) => handleInputChange("cisStartDt", e.target.value)}
            />
            <FormInput
              label="Certification Number"
              value={formData.cisCertNo || ""}
              onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
            />
            <FormInput
              type="checkbox"
              label="Woman-Owned"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="Veteran-Owned"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="Alaskan Native Corporations(ANC) and INdian Tribes"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="Disadvantaged (Include Minority-Owned)"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="Service-Disabled Veteran-Owned"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="HUBZone"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="8(a) Certified"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="AbilityOne Non-Profit Agency"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="Historical Black Colleges and Universities/Minority Institutions"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
            <FormInput
              type="checkbox"
              label="LGBTQ+ Owned"
              checked={formData.holdPayments}
              onChange={(e) =>
                handleInputChange("holdPayments", e.target.checked)
              }
            />
          </div>

          <FormInput
            label="CMMC Level"
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
        </div>
      </MainContainer>
      <SecondaryContainer
        title="Size By Industry Classification"
        handleClose={onClose}
      >
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2">
          <FormInput
            label="Industry Classification"
            required
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
          <FormInput
            label="Vendor Size"
            required
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
        </div>
      </SecondaryContainer>
      <SecondaryContainer title="NAICS" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2">
          <FormInput
            label="NAICS Code"
            required
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
          <FormInput
            label="NAICS Description"
            required
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
          <FormInput
            label="Primary NAICS "
            required
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
          <FormInput
            label="Small Business"
            required
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
          <FormInput
            label="Large Business"
            required
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
          <FormInput
            label="Effective Date"
            type="date"
            required
            value={formData.cisStartDt || ""}
            onChange={(e) => handleInputChange("cisStartDt", e.target.value)}
          />
          <FormInput
            label="Certifying Agency"
            required
            value={formData.cisNiNo || ""}
            onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
          />
        </div>
      </SecondaryContainer>
    </div>
  );
};
