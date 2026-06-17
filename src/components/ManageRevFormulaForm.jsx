import React, { useState, useEffect } from "react";
import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { backendUrl } from "./config";
import { CircleArrowLeft, CircleGauge } from "lucide-react";

const ManageRevFormulaForm = ({
  mode,
  selectedRev,
  onClose,
  onSaveSuccess,
}) => {
  const defaultMonth = new Date().toISOString().slice(0, 7); // Results in "2026-03"

  const [form, setForm] = useState({
    formulaCd: "",
    formulaDesc: "",
    // costCom: 0,
    // comName: "",
    awardFeeFl: false,
    modifiedBy:
      JSON.parse(localStorage.getItem("currentUser") || "{}").username ||
      "system",
  });
  const [viewMode, setViewMode] = useState("form"); // Always start with form view
  const [allBusinessBudgets, setAllBusinessBudgets] = useState([]); // To store all budgets for the table
  const [burdenTemplates, setBurdenTemplates] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedRev)); // New state to manage update mode
  const [isSaving, setIsSaving] = useState(false); // State to track if saving is in progress
  // Add these to your state declarations inside NewBusiness component
  const [orgOptions, setOrgOptions] = useState([]);
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [searchTermOrg, setSearchTermOrg] = useState("");
  const [searchTermAcc, setSearchTermAcc] = useState("");
  const [searchTermBurden, setSearchTermBurden] = useState("");
  const [focusOrg, setFocusOrg] = useState(false);
  const [focusAcc, setFocusAcc] = useState(false);
  const [focusBurden, setFocusBurden] = useState(false);

  useEffect(() => {
    if (!selectedRev) return;
    setForm({
      formulaCd: selectedRev.formulaCd || "",
      formulaDesc: selectedRev.formulaDesc || "",
      awardFeeFl: selectedRev.awardFeeFl || false,
      modifiedBy:
        JSON.parse(localStorage.getItem("currentUser") || "{}").username ||
        "system",
    });
  }, [selectedRev]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // ... (keep your existing startDate/endDate logic if needed)

    setForm((prev) => ({
      ...prev,
      // If it's a checkbox, use 'checked' (boolean), otherwise use 'value'
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.formulaCd) {
      toast.error("Revenue ID is required");
      return;
    }

    setIsSaving(true);
    const Payload = {
      formulaCd: form.formulaCd,
      formulaDesc: form.formulaDesc,
      // costCom: form.costCom || "",
      // comName: form.comName || "",
      awardFeeFl: form.awardFeeFl,
    };

    try {
      let response;
      if (isUpdateMode) {
        // Matches [HttpPut("UpdateAccount/{acctId}")]
        response = await api.patch(
          `https://planning-master.onrender.com/api/RevFormula/update/${Payload.formulaCd}`,
          Payload,
        );

        toast.success("Revnue updated successfully!");
      } else {
        // Matches [HttpPost("CreateAccount")]
        response = await api.post(
          `https://planning-master.onrender.com/api/RevFormula/Add`,
          Payload,
        );
        toast.success("Revenue Formula created successfully!");
      }

      if (onSaveSuccess) {
        await onSaveSuccess(response.data);
      }
      onClose();
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data ||
        error.response?.data?.message ||
        "Failed to save revenue formula.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden py-8 px-4">
      {viewMode === "form" && (
        <form className="space-y-4">
          {/* Header */}
          <div className="bg-white flex justify-between items-center pb-4 border-b-2 border-gray-300">
            <h2 className="text-[16px] font-medium text-gray-700">
              {isUpdateMode ? "Update Revenue Formula" : "Revenue Formula"}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="btn1 btn-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : isUpdateMode ? "Update" : "Save"}
              </button>

              <button
                className="btn1 btn-blue flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isSaving}
                title="Close"
              >
                <CircleArrowLeft size={12} className="text-white" />
                Back
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-10 gap-y-4">
            {/* LEFT COLUMN */}
            <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
              <div className="label-input-div">
                <label className="input-label text-[10px]">
                  Revenue ID{" "}
                  {!isUpdateMode ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  name="formulaCd"
                  value={form.formulaCd}
                  onChange={handleChange}
                  readOnly={isUpdateMode}
                  className="input-style-master"
                  type="text"
                  required
                />
              </div>

              {[
                ["Description", "formulaDesc"],
                // ["Costpoint Company", "costCom", "number"],
              ].map(([label, name, type = "text"]) => (
                <div key={name} className="label-input-div">
                  <label className="input-label text-[10px]">{label} </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    type={type}
                    className="input-style-master"
                  />
                </div>
              ))}

              <div className="label-input-div">
                <label className="input-label text-[10px]">Active</label>
                <div className="flex justify-start w-[75%]">
                  <input
                    name="awardFeeFl"
                    type="checkbox"
                    checked={form.awardFeeFl}
                    onChange={handleChange}
                    className="h-3 w-3" // optional styling
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            {/* <div className="space-y-3">

              {[
                // ["Company Name", "comName", "text"],
                ].map(([label, name, type = "text"]) => (
                <div key={name} className="label-input-div">
                  <label className="input-label text-[10px]">
                    {label}{" "}
                    {label === "Description" ? (
                      <span className="text-red-500">*</span>
                    ) : (
                      ""
                    )}
                  </label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    type={type}
                    className="input-style-master"
                  />
                </div>
              ))}


              <div className="label-input-div">
                <label className="input-label text-[10px]">Active</label>
                <div className=" flex justify-start w-[75%]">
                  <input
  name="activeFl"
  checked={form.activeFl === "Y"} // Check if string is "Y"
  onChange={handleChange}
  type="checkbox"
/>
                </div>
              </div>


            </div> */}
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageRevFormulaForm;
