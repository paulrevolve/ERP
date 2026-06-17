import React, { useState, useEffect } from "react";
import axios from "axios";
import { Building2, Plus, Trash2 } from "lucide-react";
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import { FormSection, FormInput } from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection";
import api from "../utils/api";
import { backendUrl } from "./config";
import { toast } from "react-toastify";

export const ManageCustomerTerms = () => {
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());
  // Data list and navigation states
  const [termsList, setTermsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Initial State matching your exact Schema
  const getInitialState = () => ({
    // term: {
    custTermsDc: "",
    discPctRt: 0,
    discDaysNo: 0,
    sTermsBasisCd: "I", // Default 'Invoice'
    sDueDateCd: "D", // Default 'Days'
    noDaysNo: 0,
    dayOfMthDueNo: 0,
    modifiedBy: "admin",
    // },
    schedules: [],
  });

  const [formData, setFormData] = useState(getInitialState());

  // 2. Fetch Data
  const fetchTerms = async (selectLast = false) => {
    setLoading(true);
    try {
      const response = await api.get(`${backendUrl}/api/CustTerms/GetAll`);
      const data = response.data || [];
      setTermsList(data);

      if (data.length > 0) {
        const index = selectLast ? data.length - 1 : 0;
        setCurrentIndex(index);
        setFormData(data[index]);
      } else {
        handleAddNew();
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      handleAddNew();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  // 3. Form Handlers
  const handleInputChange = (field, value) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      [field]: value, // Set properties at the top level
    }));
  };

  const handleAddNew = () => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;

    setCurrentIndex(-1);

    setFormData({
      ...getInitialState(), // Your function that returns blank object
      isNew: true, // Flag for API to use POST instead of PUT
    });

    // Set index to the end of the list to indicate a new record
    setIsDirty(false);
    setIsFormView(true);
    if (setSelectedRows) setSelectedRows(new Set());
  };

  const handleSave = async () => {
    if (!formData.custTermsDc) {
      toast.error("Terms Description is required.");
      return;
    }

    setLoading(true);
    try {
      const savedCode = formData.custTermsDc;
      const custTermsKey = formData.custTermsKey || 0; // Check the primary key

      // Determine if we are updating or creating
      const isUpdate = custTermsKey > 0;

      const payload = {
        custTermsKey: custTermsKey, // Always include key (0 for new, ID for update)
        custTermsDc: formData.custTermsDc || "",
        discPctRt: formData.discPctRt || 0,
        discDaysNo: formData.discDaysNo || 0,
        sTermsBasisCd: formData.sTermsBasisCd || "",
        sDueDateCd: formData.sDueDateCd || "",
        noDaysNo: formData.noDaysNo || 0,
        dayOfMthDueNo: formData.dayOfMthDueNo || 0,
        modifiedBy: formData.modifiedBy || "admin",
        schedules: formData.sDueDateCd === "R" ? formData.schedules : [],
      };

      const url = `${backendUrl}/api/CustTerms`;

      // Execute PUT if update, otherwise POST
      if (isUpdate) {
        await api.put(`${url}/${custTermsKey}`, payload);
      } else {
        await api.post(url, payload);
      }

      toast.success(isUpdate ? "Updated successfully!" : "Saved successfully!");
      setIsDirty(false);

      // Refresh list
      const response = await api.get(`${url}/GetAll`);
      const data = response.data || [];
      setTermsList(data);

      // Update index to match the record we just saved
      const newIdx = data.findIndex((item) => item.custTermsDc === savedCode);
      setCurrentIndex(newIdx !== -1 ? newIdx : 0);

      await fetchTerms();
    } catch (error) {
      toast.error(
        "Save failed: " + (error.response?.data?.message || error.message),
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!formData.custTermsDc) return;
    if (!window.confirm("Are you sure you want to delete these terms?")) return;

    setLoading(true);
    try {
      await api.delete(`${backendUrl}/api/CustTerms/${formData.custTermsKey}`);
      toast.success("Deleted successfully");
      fetchTerms();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // 4. Schedule Table Helpers

  // --- Navigation Logic ---
  // 1. Clear All Function
  const handleClearAll = () => {
    const hasUnsaved = isDirty;
    // Check if schedules has data as a proxy for "clipboard" style content if applicable
    const hasSchedules = formData.schedules && formData.schedules.length > 0;

    let message = "Are you sure?";
    if (hasUnsaved && hasSchedules)
      message = "Discard all unsaved changes and clear schedules?";
    else if (hasUnsaved) message = "Discard all unsaved changes?";

    if (window.confirm(message)) {
      if (termsList.length > 0) {
        setFormData(JSON.parse(JSON.stringify(termsList[currentIndex])));
      } else {
        handleAddNew();
      }
      setIsDirty(false);
      toast.info("Cleared successfully");
    }
  };

  // 2. Navigation Handler (First, Prev, Next, Last)
  const handleNavigate = (direction) => {
    if (isDirty) {
      if (!window.confirm("You have unsaved changes. Discard them and move?")) {
        return;
      }
    }

    let newIdx = currentIndex;
    if (direction === "next" && currentIndex < termsList.length - 1)
      newIdx = currentIndex + 1;
    if (direction === "prev" && currentIndex > 0) newIdx = currentIndex - 1;
    if (direction === "first") newIdx = 0;
    if (direction === "last") newIdx = termsList.length - 1;

    if (newIdx !== currentIndex) {
      setCurrentIndex(newIdx);
      setFormData(JSON.parse(JSON.stringify(termsList[newIdx])));
      setIsDirty(false);
    }
  };

  // 3. Jump to Code (Searching by Terms Description/Code)
  const jumpToCode = (code) => {
    if (!code) return;

    const foundIdx = termsList.findIndex(
      (item) =>
        String(item.custTermsDc).toLowerCase() === String(code).toLowerCase(),
    );

    if (foundIdx !== -1) {
      setCurrentIndex(foundIdx);
      setFormData(JSON.parse(JSON.stringify(termsList[foundIdx])));
      setIsFormView(true);
      setIsDirty(false);
    } else {
      toast.error(`Terms Code "${code}" not found.`);
    }
  };

  const daysOpt = [
    { statusCd: "D", name: "Days" },
    { statusCd: "M", name: "Day of Month" },
    { statusCd: "R", name: "Range of Days" },
  ];

  const basisOpt = [
    { statusCd: "I", name: "Invoice" },
    { statusCd: "T", name: "Transaction" },
    { statusCd: "R", name: "Receipt" },
  ];

  const [columns] = useState(["fromDayNo", "toDayNo", "dueDayNo", "sCurNextMthCd"]);

  const COLUMN_LABELS = {
    fromDayNo: "From Day",
    toDayNo: "To Day",
    dueDayNo: "Due Day",
    sCurNextMthCd: "Month (C/N)",
  };

  // Handle Schedule Changes
  // --- Schedule Table Handlers ---

  const addScheduleRow = () => {
    if (formData.sDueDateCd !== "R") return;
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        {
          vendTermsSchKey: 0,
          dueDayNo: 0,
          fromDayNo: 0,
          toDayNo: 0,
          sCurNextMthCd: "C",
          modifiedBy: "admin",
        },
      ],
    }));
  };

  const handleCopySchedules = () => {
    if (selectedRows.size === 0) return;
    const itemsToCopy = Array.from(selectedRows).map((idx) => ({
      ...formData.schedules[idx],
      vendTermsSchKey: 0, // Reset key for new entry
    }));
    setFormData((prev) => ({
      ...prev,
      schedules: [...prev.schedules, ...itemsToCopy],
    }));
    setSelectedRows(new Set());
    setIsDirty(true);
  };

  const handleDeleteSchedules = () => {
    if (selectedRows.size === 0) return;
    const filtered = formData.schedules.filter(
      (_, idx) => !selectedRows.has(idx),
    );
    setFormData((prev) => ({ ...prev, schedules: filtered }));
    setSelectedRows(new Set());
    setIsDirty(true);
  };

  const handleScheduleChange = (index, field, value) => {
    setIsDirty(true);
    const updated = [...formData.schedules];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, schedules: updated }));
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500 mt-10">
      <MainContainer icon={Building2} title="Manage Customer Terms">
        <Toolbar
          actions={{
            onSave: handleSave,
            onAdd: handleAddNew,
            onDelete: handleDelete,
            onClear: handleClearAll,
          }}
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          totalRecords={termsList.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          currentIndex={currentIndex}
        />

        <div className="space-y-3 mt-2">
          <div className="w-1/2">
            <FormSection>
              <FormInput
                label="Description"
                required
                value={formData?.custTermsDc}
                onChange={(e) =>
                  handleInputChange("custTermsDc", e.target.value)
                }
              />
            </FormSection>
          </div>

          <FormSection title="Terms Details">
            <div className="flex flex-col gap-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormSection title="Discount">
                    <div className="flex gap-2">
                      <FormInput
                        label="Percent"
                        required
                        type="number"
                        value={formData?.discPctRt}
                        onChange={(e) =>
                          handleInputChange(
                            "discPctRt",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                      <FormInput
                        label="Days"
                        type="number"
                        value={formData?.discDaysNo}
                        onChange={(e) =>
                          handleInputChange(
                            "discDaysNo",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>
                  </FormSection>

                  <FormSection title="Select Due Date Method">
                    <div className="flex gap-4 items-center h-full py-1">
                      {daysOpt.map((opt) => (
                        <label
                          key={opt.statusCd}
                          className="flex items-center gap-2 text-xs cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="dueDateMethod"
                            checked={formData.sDueDateCd === opt.statusCd}
                            onChange={() =>
                              handleInputChange("sDueDateCd", opt.statusCd)
                            }
                          />
                          {opt.name}
                        </label>
                      ))}
                    </div>
                  </FormSection>
                </div>

                <FormSection title="Calculate Days Based on Date of">
                  <div className="flex flex-col gap-3 justify-center h-full py-1">
                    {basisOpt.map((opt) => (
                      <label
                        key={opt.statusCd}
                        className="flex items-center gap-2 text-xs cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="calcBasedOn"
                          checked={formData.sTermsBasisCd === opt.statusCd}
                          onChange={() =>
                            handleInputChange("sTermsBasisCd", opt.statusCd)
                          }
                        />
                        {opt.name}
                      </label>
                    ))}
                  </div>
                </FormSection>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormSection title="Days Method">
                  <FormInput
                    label="Number of Days"
                    type="number"
                    disabled={formData?.sDueDateCd !== "D"}
                    value={formData?.noDaysNo}
                    onChange={(e) =>
                      handleInputChange("noDaysNo", parseInt(e.target.value))
                    }
                  />
                </FormSection>

                <FormSection title="Day of Month Method">
                  <FormInput
                    label="Day Of Month"
                    type="number"
                    disabled={formData?.sDueDateCd !== "M"}
                    value={formData?.dayOfMthDueNo}
                    onChange={(e) =>
                      handleInputChange(
                        "dayOfMthDueNo",
                        parseInt(e.target.value),
                      )
                    }
                  />
                </FormSection>
              </div>
            </div>
          </FormSection>
        </div>
        <div className="mt-2">
          <SecondaryContainer title="Range of Days Schedule">
            <Toolbar
              actions={{
                onAdd: addScheduleRow,
                onDelete: handleDeleteSchedules,
                onCopy: handleCopySchedules,
                onSave: handleSave,
              }}
              isFormView={true}
              isDirty={isDirty}
              loading={loading || formData.sDueDateCd !== "R"}
            />
            <div
              className={
                formData.sDueDateCd !== "R"
                  ? "opacity-40 pointer-events-none"
                  : ""
              }
            >
              <table className="min-w-full text-[11px] border border-gray-300 rounded">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="th-thead w-10 text-center">
                      <input
                        type="checkbox"
                        className="h-3 w-3 accent-blue-600"
                        checked={
                          formData.schedules?.length > 0 &&
                          selectedRows.size === formData.schedules.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            const allIdx = new Set(
                              formData.schedules.map((_, i) => i),
                            );
                            setSelectedRows(allIdx);
                          } else {
                            setSelectedRows(new Set());
                          }
                        }}
                      />
                    </th>
                    {columns.map((col) => (
                      <th key={col} className="th-thead text-left px-2 py-1">
                        <div className="flex items-center">
                          <span>{COLUMN_LABELS[col] || col}</span>
                          {["fromDayNo", "toDayNo", "dueDayNo"].includes(col) && (
                            <span className="text-red-500 ml-0.5">*</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formData.schedules?.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="text-center tbody-td p-1">
                        <input
                          type="checkbox"
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          checked={selectedRows.has(index)}
                          onChange={() => {
                            const newSet = new Set(selectedRows);
                            newSet.has(index)
                              ? newSet.delete(index)
                              : newSet.add(index);
                            setSelectedRows(newSet);
                          }}
                        />
                      </td>

                      <td className="tbody-td p-1">
                        <input
                          type="number"
                          className="w-full bg-transparent outline-none"
                          value={item.fromDayNo}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "fromDayNo",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="tbody-td p-1">
                        <input
                          type="number"
                          className="w-full bg-transparent outline-none"
                          value={item.toDayNo}
                          onChange={(e) =>
                            handleScheduleChange(index, "toDayNo", e.target.value)
                          }
                        />
                      </td>

                      <td className="tbody-td p-1">
                        <input
                          type="number"
                          className="w-full bg-transparent outline-none"
                          value={item.dueDayNo}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "dueDayNo",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="tbody-td p-1">
                        <select
                          className="w-full bg-transparent outline-none cursor-pointer"
                          value={item.sCurNextMthCd}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "sCurNextMthCd",
                              e.target.value,
                            )
                          }
                        >
                          <option value="C">Current Month</option>
                          <option value="N">Next Month</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SecondaryContainer>
        </div>
      </MainContainer>
    </div>
  );
};

export const CustomerTypes = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialCustTypeState = {
    custTypeDc: "",
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    isNew: true,
  };

  const [custTypeData, setCustTypeData] = useState(initialCustTypeState);

  //   const fetchCustType = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`${backendUrl}/api/CustType`);

  //       // Access the 'data' property from your API response object
  //       const typeList = response.data.data;

  //       if (typeList && typeList.length > 0) {
  //         setOriginalData(typeList);
  //         setCustTypeData(typeList[0]);
  //         setCurrentIndex(0);
  //         setIsDirty(false);
  //       } else {
  //         setOriginalData([]);
  //         // Only show info if we expected data but got an empty list
  //         setCustTypeData(initialCustTypeState);
  //         toast.info("No type found.");
  //       }
  //     } catch (error) {
  //       console.error("Fetch Error:", error);
  //       toast.error("Failed to fetch skill codes");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const fetchCustType = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/CustType`);

      // FIX: Since your response is a direct array, use response.data
      const typeList = response.data;

      if (typeList && Array.isArray(typeList) && typeList.length > 0) {
        setOriginalData(typeList);
        setCustTypeData(typeList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setCustTypeData(initialCustTypeState);
        toast.info("No type found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch customer types");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustType();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);

    // 1. Update the individual form state
    setCustTypeData((prev) => ({ ...prev, [field]: value }));

    // 2. If an index is provided (from table), update the main array
    if (index !== null) {
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    } else {
      // 3. If no index (from form), update the array at the current pointer
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], [field]: value };
        return updated;
      });
    }
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
        (item, idx) => item.custTypeDc || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    if (!custTypeData.custTypeDc) {
      toast.error("Enter Customer Type");
      return;
    }

    setIsLoading(true);
    try {
      // Remove isNew before sending to API
      const { isNew, ...payload } = {
        ...custTypeData,
        modifiedBy: user.name || "System",
        timeStamp: new Date().toISOString(),
      };

      if (!custTypeData.isNew) {
        await axios.put(
          `${backendUrl}/api/CustType/${custTypeData.custTypeDc}`,
          payload,
        );
        toast.success("Updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/CustType`, payload);
        toast.success("Created successfully!");
      }

      setIsDirty(false);
      fetchCustType();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    if (isFormView) {
      // Delete single from Form View
      if (!custTypeData.custTypeDc || custTypeData.isNew) return;
      if (!window.confirm(`Delete "${custTypeData.custTypeDc}"?`)) return;

      setIsLoading(true);
      try {
        await axios.delete(
          `${backendUrl}/api/CustType/${custTypeData.custTypeDc}`,
        );
        toast.success("Deleted successfully!");
        fetchCustType();
      } catch (error) {
        toast.error("Failed to delete");
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
            axios.delete(`${backendUrl}/api/CustType/${id}`),
          ),
        );
        toast.success("Selected items deleted!");
        setSelectedRows(new Set());
        fetchCustType();
      } catch (error) {
        toast.error("Error deleting some items");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...custTypeData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialCustTypeState,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setCustTypeData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialCustTypeState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setCustTypeData(newItem);
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
    setCustTypeData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchCustType(),
  };

  const [columns] = useState(["custTypeDc"]);

  const COLUMN_LABELS = {
    custTypeDc: "Customer Types",
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Manage Customer Types">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <FormInput
                label="Customer Types*"
                value={custTypeData.custTypeDc}
                onChange={(e) =>
                  handleFieldChange("custTypeDc", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!custTypeData.isNew}
                className={!custTypeData.isNew ? "bg-gray-100" : "bg-white"}
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
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.custTypeDc || `new-${idx}`,
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

                    const isRequired = ["custTypeDc"].includes(col);

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
                  const rowId = item.custTypeDc || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setCustTypeData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index
                          ? "bg-blue-100 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <td
                        className="p-2 text-center"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
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
                          className={`td-input bg-white`}
                          value={item.custTypeDc}
                          //   readOnly={!item.isNew}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "custTypeDc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
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

export const CustomerCreditLimits = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialCrLimitState = {
    crLimitDc: "",
    limitAmt: "",
    arCrLimitKey: 0,
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    isNew: true,
  };

  const [crLimirData, setCrLimirData] = useState(initialCrLimitState);

  //   const fetchCrLimit = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`${backendUrl}/api/ArCrLimit`);

  //       // Access the 'data' property from your API response object
  //       const typeList = response.data.data;

  //       if (typeList && typeList.length > 0) {
  //         setOriginalData(typeList);
  //         setCrLimirData(typeList[0]);
  //         setCurrentIndex(0);
  //         setIsDirty(false);
  //       } else {
  //         setOriginalData([]);
  //         // Only show info if we expected data but got an empty list
  //         setCrLimirData(initialCrLimitState);
  //         toast.info("No type found.");
  //       }
  //     } catch (error) {
  //       console.error("Fetch Error:", error);
  //       toast.error("Failed to fetch credit limit");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const fetchCrLimit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/ArCrLimit`);

      // FIX 1: Access response.data directly because the API returns an array
      const typeList = response.data;

      if (typeList && Array.isArray(typeList) && typeList.length > 0) {
        setOriginalData(typeList);
        // FIX 2: Corrected the typo in the state setter name
        setCrLimirData(typeList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setCrLimirData(initialCrLimitState);
        toast.info("No credit limits found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch credit limit");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrLimit();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);

    // 1. Update the individual form state
    setCrLimirData((prev) => ({ ...prev, [field]: value }));

    // 2. If an index is provided (from table), update the main array
    if (index !== null) {
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    } else {
      // 3. If no index (from form), update the array at the current pointer
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], [field]: value };
        return updated;
      });
    }
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
        (item, idx) => item.crLimitDc || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    if (!crLimirData.crLimitDc) {
      toast.error("Enter Customer Type");
      return;
    }

    setIsLoading(true);
    try {
      // Remove isNew before sending to API
      const { isNew, ...payload } = {
        ...crLimirData,
        modifiedBy: user.name || "System",
        timeStamp: new Date().toISOString(),
      };

      if (!crLimirData.isNew) {
        await axios.put(
          `${backendUrl}/api/ArCrLimit/${crLimirData.arCrLimitKey}`,
          payload,
        );
        toast.success("Updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/ArCrLimit`, payload);
        toast.success("Created successfully!");
      }

      setIsDirty(false);
      fetchCrLimit();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    if (isFormView) {
      // Delete single from Form View
      if (!crLimirData.crLimitDc || crLimirData.isNew) return;
      if (!window.confirm(`Delete "${crLimirData.crLimitDc}"?`)) return;

      setIsLoading(true);
      try {
        await axios.delete(
          `${backendUrl}/api/ArCrLimit/${crLimirData.crLimitDc}`,
        );
        toast.success("Deleted successfully!");
        fetchCrLimit();
      } catch (error) {
        toast.error("Failed to delete");
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
            axios.delete(`${backendUrl}/api/ArCrLimit/${id}`),
          ),
        );
        toast.success("Selected items deleted!");
        setSelectedRows(new Set());
        fetchCrLimit();
      } catch (error) {
        toast.error("Error deleting some items");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...crLimirData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialCrLimitState,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setCrLimirData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialCrLimitState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setCrLimirData(newItem);
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
    setCrLimirData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchCrLimit(),
  };

  const [columns] = useState(["crLimitDc", "limitAmt"]);

  const COLUMN_LABELS = {
    crLimitDc: "Credit Limit Description",
    limitAmt: "Limit Amount",
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Manage Customer Credit Limits">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <FormInput
                label="Credit Limit Description*"
                value={crLimirData.crLimitDc}
                onChange={(e) => handleFieldChange("crLimitDc", e.target.value)}
                // ReadOnly if NOT new (Matches AccountMaster logic)
                // readOnly={!crLimirData.isNew}
                // className={!crLimirData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Limit Amount*"
                type="number"
                value={crLimirData.limitAmt}
                onChange={(e) => handleFieldChange("limitAmt", e.target.value)}
                // ReadOnly if NOT new (Matches AccountMaster logic)
                // readOnly={!crLimirData.isNew}
                // className={!crLimirData.isNew ? "bg-gray-100" : "bg-white"}
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
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.crLimitDc || `new-${idx}`,
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

                    const isRequired = ["crLimitDc", "limitAmt"].includes(col);

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
                  const rowId = item.crLimitDc || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setCrLimirData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index
                          ? "bg-blue-100 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <td
                        className="p-2 text-center"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
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
                          className={`td-input bg-white`}
                          value={item.crLimitDc}
                          //   readOnly={!item.isNew}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "crLimitDc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className={`td-input bg-white`}
                          value={item.limitAmt}
                          type="number"
                          //   readOnly={!item.isNew}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "limitAmt",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
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

export const CustomerCreditRatings = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialCrRatingState = {
    crRatingCd: "",
    crRatingDesc: "",
    arCrRatingKey: "",
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    isNew: true,
  };

  const [crRatingData, setCrRatingData] = useState(initialCrRatingState);

  //   const fetchCrRating = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`${backendUrl}/api/ArCrRating`);

  //       // Access the 'data' property from your API response object
  //       const typeList = response.data.data;

  //       if (typeList && typeList.length > 0) {
  //         setOriginalData(typeList);
  //         setCrRatingData(typeList[0]);
  //         setCurrentIndex(0);
  //         setIsDirty(false);
  //       } else {
  //         setOriginalData([]);
  //         // Only show info if we expected data but got an empty list
  //         setCrRatingData(initialCrRatingState);
  //         toast.info("No type found.");
  //       }
  //     } catch (error) {
  //       console.error("Fetch Error:", error);
  //       toast.error("Failed to fetch credit limit");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const fetchCrRating = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/ArCrRating`);

      // FIX: Access response.data directly (the API response is an array, not an object containing 'data')
      const typeList = response.data;

      if (typeList && Array.isArray(typeList) && typeList.length > 0) {
        setOriginalData(typeList);
        setCrRatingData(typeList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setCrRatingData(initialCrRatingState);
        toast.info("No credit ratings found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch credit ratings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrRating();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);

    // 1. Update the individual form state
    setCrRatingData((prev) => ({ ...prev, [field]: value }));

    // 2. If an index is provided (from table), update the main array
    if (index !== null) {
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    } else {
      // 3. If no index (from form), update the array at the current pointer
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], [field]: value };
        return updated;
      });
    }
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
        (item, idx) => item.crRatingCd || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    if (!crRatingData.crRatingCd) {
      toast.error("Enter Customer Type");
      return;
    }

    setIsLoading(true);
    try {
      // Remove isNew before sending to API
      const { isNew, ...payload } = {
        ...crRatingData,
        modifiedBy: user.name || "System",
        timeStamp: new Date().toISOString(),
      };

      if (!crRatingData.isNew) {
        await axios.put(
          `${backendUrl}/api/ArCrRating/${crRatingData.crRatingCd}`,
          payload,
        );
        toast.success("Updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/ArCrRating`, payload);
        toast.success("Created successfully!");
      }

      setIsDirty(false);
      fetchCrRating();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    if (isFormView) {
      // Delete single from Form View
      if (!crRatingData.crRatingCd || crRatingData.isNew) return;
      if (!window.confirm(`Delete "${crRatingData.crRatingCd}"?`)) return;

      setIsLoading(true);
      try {
        await axios.delete(
          `${backendUrl}/api/ArCrRating/${crRatingData.arCrRatingKey}`,
        );
        toast.success("Deleted successfully!");
        fetchCrRating();
      } catch (error) {
        toast.error("Failed to delete");
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
            axios.delete(`${backendUrl}/api/ArCrRating/${id}`),
          ),
        );
        toast.success("Selected items deleted!");
        setSelectedRows(new Set());
        fetchCrRating();
      } catch (error) {
        toast.error("Error deleting some items");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...crRatingData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialCrRatingState,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setCrRatingData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialCrRatingState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setCrRatingData(newItem);
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
    setCrRatingData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchCrRating(),
  };

  const [columns] = useState(["crRatingCd", "crRatingDesc"]);

  const COLUMN_LABELS = {
    crRatingCd: "Rating Code",
    crRatingDesc: "Rating Description",
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Manage Customer Credit Ratings">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <FormInput
                label="Rating Code*"
                value={crRatingData.crRatingCd}
                onChange={(e) =>
                  handleFieldChange("crRatingCd", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                // readOnly={!crRatingData.isNew}
                // className={!crRatingData.isNew ? "bg-gray-100" : "bg-white"}
              />
              <FormInput
                label="Rating Description*"
                value={crRatingData.crRatingDesc}
                onChange={(e) =>
                  handleFieldChange("crRatingDesc", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                // readOnly={!crRatingData.isNew}
                // className={!crRatingData.isNew ? "bg-gray-100" : "bg-white"}
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
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.crRatingCd || `new-${idx}`,
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

                    const isRequired = ["crRatingCd", "crRatingDesc"].includes(
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
                  const rowId = item.crRatingCd || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setCrRatingData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index
                          ? "bg-blue-100 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <td
                        className="p-2 text-center"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
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
                          className={`td-input bg-white`}
                          value={item.crRatingCd}
                          //   readOnly={!item.isNew}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "crRatingCd",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
                        />
                      </td>
                      <td className="tbody-td">
                        <input
                          className={`td-input bg-white`}
                          value={item.crRatingDesc}
                          type="number"
                          //   readOnly={!item.isNew}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "crRatingDesc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
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

export const SalesTerritories = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialSalesTerrState = {
    salesTerrDc: "",
    salesTerrKey: 0,
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    isNew: true,
  };

  const [salesTerrData, setSalesTerrData] = useState(initialSalesTerrState);

  const fetchSalesTerr = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/ArSalesTerr`);

      // Access the 'data' property from your API response object
      const typeList = response.data;

      if (typeList && typeList.length > 0) {
        setOriginalData(typeList);
        setSalesTerrData(typeList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        // Only show info if we expected data but got an empty list
        setSalesTerrData(initialSalesTerrState);
        toast.info("No type found.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch skill codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesTerr();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);

    // 1. Update the individual form state
    setSalesTerrData((prev) => ({ ...prev, [field]: value }));

    // 2. If an index is provided (from table), update the main array
    if (index !== null) {
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    } else {
      // 3. If no index (from form), update the array at the current pointer
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], [field]: value };
        return updated;
      });
    }
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
        (item, idx) => item.salesTerrDc || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    if (!salesTerrData.salesTerrDc) {
      toast.error("Enter Customer Type");
      return;
    }

    setIsLoading(true);
    try {
      // Remove isNew before sending to API
      const { isNew, ...payload } = {
        ...salesTerrData,
        modifiedBy: user.name || "System",
        timeStamp: new Date().toISOString(),
      };

      if (!salesTerrData.isNew) {
        await axios.put(
          `${backendUrl}/api/ArSalesTerr/${salesTerrData.salesTerrKey}`,
          payload,
        );
        toast.success("Updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/ArSalesTerr`, payload);
        toast.success("Created successfully!");
      }

      setIsDirty(false);
      fetchSalesTerr();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    if (isFormView) {
      // Delete single from Form View
      if (!salesTerrData.salesTerrDc || salesTerrData.isNew) return;
      if (!window.confirm(`Delete "${salesTerrData.salesTerrDc}"?`)) return;

      setIsLoading(true);
      try {
        await axios.delete(
          `${backendUrl}/api/ArSalesTerr/${salesTerrData.salesTerrKey}`,
        );
        toast.success("Deleted successfully!");
        fetchSalesTerr();
      } catch (error) {
        toast.error("Failed to delete");
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
            axios.delete(`${backendUrl}/api/ArSalesTerr/${id}`),
          ),
        );
        toast.success("Selected items deleted!");
        setSelectedRows(new Set());
        fetchSalesTerr();
      } catch (error) {
        toast.error("Error deleting some items");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...salesTerrData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialSalesTerrState,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setSalesTerrData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialSalesTerrState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setSalesTerrData(newItem);
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
    setSalesTerrData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchSalesTerr(),
  };

  const [columns] = useState(["salesTerrDc"]);

  const COLUMN_LABELS = {
    salesTerrDc: "Sales Territories",
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Manage Sales Territories">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <FormInput
                label="Sales Territories*"
                value={salesTerrData.salesTerrDc}
                onChange={(e) =>
                  handleFieldChange("salesTerrDc", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!salesTerrData.isNew}
                className={!salesTerrData.isNew ? "bg-gray-100" : "bg-white"}
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
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.salesTerrDc || `new-${idx}`,
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

                    const isRequired = ["salesTerrDc"].includes(col);

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
                  const rowId = item.salesTerrDc || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setSalesTerrData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index
                          ? "bg-blue-100 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <td
                        className="p-2 text-center"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
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
                          className={`td-input bg-white`}
                          value={item.salesTerrDc}
                          //   readOnly={!item.isNew}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "salesTerrDc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
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

export const ShippingMethods = ({ onClose }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set()); // CHECKBOX STATE

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const initialShipMthdState = {
    arShipMthdKey: 0,
    shipMthdDc: "",
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    isNew: true,
  };

  const [shipMthdData, setShipMthdData] = useState(initialShipMthdState);

  //   const fetchShipMethod = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`${backendUrl}/api/ArShipMthd`);

  //       // Access the 'data' property from your API response object
  //       const typeList = response.data.data;

  //       if (typeList && typeList.length > 0) {
  //         setOriginalData(typeList);
  //         setShipMthdData(typeList[0]);
  //         setCurrentIndex(0);
  //         setIsDirty(false);
  //       } else {
  //         setOriginalData([]);
  //         // Only show info if we expected data but got an empty list
  //         setShipMthdData(initialShipMthdState);
  //         toast.info("No type found.");
  //       }
  //     } catch (error) {
  //       console.error("Fetch Error:", error);
  //       toast.error("Failed to fetch skill codes");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const fetchShipMethod = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/ArShipMthd`);
      // Accessing the 'data' property from your JSON structure
      const typeList = response.data || [];

      if (typeList.length > 0) {
        // Map data to ensure isNew is false for existing records
        const enriched = typeList.map((item) => ({ ...item, isNew: false }));
        setOriginalData(enriched);
        setShipMthdData(enriched[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        setShipMthdData(initialShipMthdState);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch shipping methods");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipMethod();
  }, []);

  const handleFieldChange = (field, value, index = null) => {
    setIsDirty(true);

    // 1. Update the individual form state
    setShipMthdData((prev) => ({ ...prev, [field]: value }));

    // 2. If an index is provided (from table), update the main array
    if (index !== null) {
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });
    } else {
      // 3. If no index (from form), update the array at the current pointer
      setOriginalData((prev) => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], [field]: value };
        return updated;
      });
    }
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
        (item, idx) => item.shipMthdDc || `new-${idx}`,
      );
      setSelectedRows(new Set(allIds));
    }
  };

  const handleSave = async () => {
    if (!shipMthdData.shipMthdDc) {
      toast.error("Enter Shipping Method");
      return;
    }

    setIsLoading(true);
    try {
      // Remove isNew before sending to API
      const { isNew, ...payload } = {
        ...shipMthdData,
        modifiedBy: user.name || "System",
        timeStamp: new Date().toISOString(),
      };

      if (!shipMthdData.isNew) {
        await axios.put(
          `${backendUrl}/api/ArShipMthd/${shipMthdData.arShipMthdKey}`,
          payload,
        );
        toast.success("Updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/ArShipMthd`, payload);
        toast.success("Created successfully!");
      }

      setIsDirty(false);
      fetchShipMethod();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.response?.data || "Error saving",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    if (isFormView) {
      // Delete single from Form View
      if (!shipMthdData.shipMthdDc || shipMthdData.isNew) return;
      if (!window.confirm(`Delete "${shipMthdData.shipMthdDc}"?`)) return;

      setIsLoading(true);
      try {
        await axios.delete(
          `${backendUrl}/api/ArShipMthd/${shipMthdData.arShipMthdKey}`,
        );
        toast.success("Deleted successfully!");
        fetchShipMethod();
      } catch (error) {
        toast.error("Failed to delete");
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
            axios.delete(`${backendUrl}/api/ArShipMthd/${id}`),
          ),
        );
        toast.success("Selected items deleted!");
        setSelectedRows(new Set());
        fetchShipMethod();
      } catch (error) {
        toast.error("Error deleting some items");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- COPY / PASTE LOGIC ---
  const handleCopy = () => {
    setClipboard({ ...shipMthdData });
    toast.info("Record copied to clipboard");
  };

  const handlePaste = () => {
    if (!clipboard) return toast.warning("Clipboard is empty");
    const pastedItem = {
      ...initialShipMthdState,
    };
    setOriginalData((prev) => [...prev, pastedItem]);
    setCurrentIndex(originalData.length);
    setShipMthdData(pastedItem);
    setIsDirty(true);
    toast.success("Data pasted as new record");
  };

  const handleAdd = () => {
    if (isDirty && !window.confirm("Discard changes?")) return;

    const newItem = { ...initialShipMthdState };
    // Add to the list immediately (Concept from AccountMaster)
    setOriginalData((prev) => [...prev, newItem]);
    setCurrentIndex(originalData.length);
    setShipMthdData(newItem);
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
    setShipMthdData(originalData[newIndex]);
    setIsDirty(false);
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onSave: handleSave,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchShipMethod(),
  };

  const [columns] = useState(["shipMthdDc"]);

  const COLUMN_LABELS = {
    shipMthdDc: "Shipping Methods",
  };

  return (
    <div className="p-4 mt-10">
      <MainContainer title="Manage Shipping Methods">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={isLoading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={originalData.length}
          handleNavigate={handleNavigate}
        />

        {isFormView ? (
          <FormSection>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <FormInput
                label="Shipping Methods*"
                value={shipMthdData.shipMthdDc}
                onChange={(e) =>
                  handleFieldChange("shipMthdDc", e.target.value)
                }
                // ReadOnly if NOT new (Matches AccountMaster logic)
                readOnly={!shipMthdData.isNew}
                className={!shipMthdData.isNew ? "bg-gray-100" : "bg-white"}
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
                      checked={
                        originalData.length > 0 &&
                        selectedRows.size === originalData.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = originalData.map(
                            (item, idx) => item.shipMthdDc || `new-${idx}`,
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

                    const isRequired = ["shipMthdDc"].includes(col);

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
                  const rowId = item.shipMthdDc || `new-${index}`;
                  const isSelected = selectedRows.has(rowId);

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setShipMthdData(item);
                        setCurrentIndex(index);
                      }}
                      className={`cursor-pointer hover:bg-blue-50 ${
                        currentIndex === index
                          ? "bg-blue-100 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <td
                        className="p-2 text-center"
                        onClick={(e) => e.stopPropagation()} // FIX 2: STOP BUBBLING
                      >
                        <input
                          type="checkbox"
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
                          className={`td-input bg-white`}
                          value={item.shipMthdDc}
                          //   readOnly={!item.isNew}
                          onChange={
                            (e) =>
                              handleFieldChange(
                                "shipMthdDc",
                                e.target.value,
                                index,
                              ) // Note the index at the end
                          }
                          onClick={(e) => item.isNew && e.stopPropagation()}
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
