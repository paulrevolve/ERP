import React, { useState, useEffect } from "react";
import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { backendUrl } from "./config";
import { CircleArrowLeft } from "lucide-react";

const ManageCompanyForm = ({
  mode,
  selectedCompany,
  onClose,
  onSaveSuccess,
}) => {
  const [form, setForm] = useState({
    companyId: "",
    companyName: "",
    companyShortName: "",
    activeFlag: false,
  });
  const [viewMode, setViewMode] = useState("form"); // Always start with form view
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedCompany)); // New state to manage update mode
  const [isSaving, setIsSaving] = useState(false); // State to track if saving is in progress
  const [modifiedUser, setModifiedUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))?.name || "system",
  );

  useEffect(() => {
    if (!selectedCompany) return;
    setForm({
      companyId: selectedCompany.companyId || "",
      companyName: selectedCompany.companyName || "",
      companyShortName: selectedCompany.companyShortName || "",
      activeFlag: selectedCompany.activeFlag || false,
    });
  }, [selectedCompany]);

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
    if (!form.companyId) {
      toast.error("Company ID is required");
      return;
    }

    setIsSaving(true);
    const payload = {
      companyId: form.companyId,
      companyName: form.companyName,
      companyShortName: form.companyShortName,
      activeFlag: form.activeFlag,
    };

    try {
      let response;
      if (isUpdateMode) {
        // Matches [HttpPut("UpdateAccount/{acctId}")]
        response = await api.put(
          `https://planning-master.onrender.com/api/Company/update?modifiedBy=${modifiedUser}`,
          payload,
        );

        toast.success("Company updated successfully!");
      } else {
        // Matches [HttpPost("CreateAccount")]
        response = await api.post(
          `https://planning-master.onrender.com/api/Company/create?modifiedBy=${modifiedUser}`,
          payload,
        );
        toast.success("Company created successfully!");
      }

      if (onSaveSuccess) {
        await onSaveSuccess(response.data);
      }
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to save company details.";
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
              {isUpdateMode ? "Update Company" : "Manage Company"}
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
                  Company ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="companyId"
                  value={form.companyId}
                  onChange={handleChange}
                  readOnly={isUpdateMode}
                  className="input-style-master"
                  type="text"
                  required
                />
              </div>

              {[
                ["Company Name", "companyName"],
                ["Company Short Name", "companyShortName"],
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
                    name="activeFlag"
                    type="checkbox"
                    checked={form.activeFlag}
                    onChange={handleChange}
                    className="h-3 w-3" // optional styling
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageCompanyForm;
