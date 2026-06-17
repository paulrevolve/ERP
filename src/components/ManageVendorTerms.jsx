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

const ManageVendorTerms = () => {
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
    termsDc: "",
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
      const response = await api.get(`${backendUrl}/api/VendorTerms`);
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
    console.log("called");
    if (!formData.termsDc) {
      toast.error("Terms Description is required.");
      return;
    }

    setLoading(true);
    try {
      const savedCode = formData.termsDc; // Capture code to find it after refresh
      const payload = {
        term: {
          termsDc: formData.termsDc || "",
          discPctRt: formData.discPctRt || 0,
          discDaysNo: formData.discDaysNo || 0,
          sTermsBasisCd: formData.sTermsBasisCd || "",
          sDueDateCd: formData.sDueDateCd || "",
          noDaysNo: formData.noDaysNo || 0,
          dayOfMthDueNo: formData.dayOfMthDueNo || 0,
          modifiedBy: formData.modifiedBy || "admin",
        },
        // schedules: formData.schedules || [],
        schedules: formData.sDueDateCd === "R" ? formData.schedules : [],
      };

      await api.post(`${backendUrl}/api/VendorTerms/save`, payload);
      toast.success("Saved successfully!");
      setIsDirty(false);

      // Refresh list and find the index of the newly saved item
      const response = await api.get(`${backendUrl}/api/VendorTerms`);
      const data = response.data || [];
      setTermsList(data);

      const newIdx = data.findIndex((item) => item.termsDc === savedCode);
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
    if (!formData.termsDc) return;
    if (!window.confirm("Are you sure you want to delete these terms?")) return;

    setLoading(true);
    try {
      await api.delete(`${backendUrl}/api/VendorTerms/${formData.termsDc}`);
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
        String(item.termsDc).toLowerCase() === String(code).toLowerCase(),
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

  const [columns] = useState(["fromNo", "toNo", "dueDayNo", "sCurNextMthCd"]);

  const COLUMN_LABELS = {
    fromNo: "From Day",
    toNo: "To Day",
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
          fromNo: 0,
          toNo: 0,
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
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer icon={Building2} title="Manage Vendor Terms">
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
                value={formData?.termsDc}
                onChange={(e) => handleInputChange("termsDc", e.target.value)}
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
                          {["fromNo", "toNo", "dueDayNo"].includes(col) && (
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
                          value={item.fromNo}
                          min="0"
                          onInput={(e) => {
                            if (e.target.value < 0) e.target.value = 0;
                          }}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "fromNo",
                              e.target.value,
                            )
                          }
                        />
                      </td>

                      <td className="tbody-td p-1">
                        <input
                          type="number"
                          className="w-full bg-transparent outline-none"
                          value={item.toNo}
                          min="0"
                          onInput={(e) => {
                            if (e.target.value < 0) e.target.value = 0;
                          }}
                          onChange={(e) =>
                            handleScheduleChange(index, "toNo", e.target.value)
                          }
                        />
                      </td>

                      <td className="tbody-td p-1">
                        <input
                          type="number"
                          className="w-full bg-transparent outline-none"
                          value={item.dueDayNo}
                          min="0"
                          onInput={(e) => {
                            if (e.target.value < 0) e.target.value = 0;
                          }}
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

export default ManageVendorTerms;
