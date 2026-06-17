import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { CircleArrowLeft } from "lucide-react";

const ManageAccountGroupForm = ({
  mode,
  selectedAcctGrp,
  onClose,
  onSaveSuccess,
}) => {
  const [form, setForm] = useState({
    acctGrpCd: "",
    acctGrpDesc: "",
    companyId: "",
    modifiedBy:
      JSON.parse(localStorage.getItem("currentUser") || "{}").name || "system",
  });
  const [viewMode, setViewMode] = useState("form"); // Always start with form view
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedAcctGrp)); // New state to manage update mode
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedAcctGrp) return;
    setForm({
      acctGrpCd: selectedAcctGrp.acctGrpCd || "",
      acctGrpDesc: selectedAcctGrp.acctGrpDesc || "",
      companyId: selectedAcctGrp.companyId || "",
      modifiedBy:
        JSON.parse(localStorage.getItem("currentUser") || "{}").name ||
        "system",
    });
  }, [selectedAcctGrp]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // ... (keep your existing startDate/endDate logic if needed)

    if (name === "acctGrpCd" && value.length > 3) {
      return; // Do nothing if length is greater than 3
    }

    setForm((prev) => ({
      ...prev,
      // If it's a checkbox, use 'checked' (boolean), otherwise use 'value'
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.acctGrpCd) {
      toast.error("Account Group ID is required");
      return;
    }

    if (form.acctGrpCd.length > 3) {
      toast.error("Account Group ID must be 3 characters or less");
      return;
    }

    setIsSaving(true);
    const payload = {
      acctGrpCd: form.acctGrpCd,
      acctGrpDesc: form.acctGrpDesc,
      companyId: form.companyId,
      modifiedBy:
        form.modifiedBy ||
        JSON.parse(localStorage.getItem("currentUser") || "{}").name ||
        "system",
    };

    try {
      let response;
      if (isUpdateMode) {
        // Matches [HttpPut("UpdateAccount/{acctId}")]
        response = await api.put(
          `https://planning-master.onrender.com/api/AcctGrp/update`,
          payload,
        );

        toast.success("Account Group updated successfully!");
      } else {
        // Matches [HttpPost("CreateAccount")]
        response = await api.post(
          `https://planning-master.onrender.com/api/AcctGrp/create`,
          payload,
        );
        toast.success("Account Group created successfully!");
      }

      if (onSaveSuccess) {
        await onSaveSuccess(response.data);
      }
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to save account group details.";
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
              {isUpdateMode ? "Update  Accoutn Group" : "Accoutn Group"}
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
                  Account Group ID{" "}
                  {!isUpdateMode ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  name="acctGrpCd"
                  value={form.acctGrpCd}
                  onChange={handleChange}
                  readOnly={isUpdateMode}
                  className="input-style-master"
                  type="text"
                  required
                  maxLength={3}
                />
              </div>

              {[
                ["Account Group Description", "acctGrpDesc"],
                ["Company ID", "companyId"],
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
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ManageAccountGroupForm;
