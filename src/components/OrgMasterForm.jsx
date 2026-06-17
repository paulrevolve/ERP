import React, { useState, useEffect } from "react";
import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { CircleArrowLeft } from "lucide-react";
import { backendUrl } from "./config";

const OrgMasterForm = ({ mode, selectedOrg, onClose, onSaveSuccess }) => {
  const [form, setForm] = useState({
    orgId: "",
    orgName: "",
    lvlNo: "",
    l1OrgName: "",
    l2OrgName: "",
    l3OrgName: "",
    l4OrgName: "",
    l5OrgName: "",
    l6OrgName: "",
    l7OrgName: "",
    l8OrgName: "",
    l9OrgName: "",
    tcOrgFl: "",
    tmOrgFl: "",
    activeFl: "s",
    orgTopFl: "",
    companyId: "",
    modifiedBy: "",
    orgAbbrvCd: "",
    taxbleEntityId: "",
  });
  const [viewMode, setViewMode] = useState("form"); // Always start with form view
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedOrg)); // New state to manage update mode
  const [isSaving, setIsSaving] = useState(false); // State to track if saving is in progress

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "24px",
      height: "24px",
      backgroundColor: state.isDisabled ? "#fcfcfc" : "#ffffff",
      color: state.isDisabled ? "##D9DCE3" : "back",
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      boxShadow: "none",
      borderColor: state.isFocused ? "#ccc" : "#ccc",
      "&:hover": {
        borderColor: "#ccc",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 6px",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "24px",
    }),
    option: (provided) => ({
      ...provided,
      padding: "4px 8px",
    }),
  };

  useEffect(() => {
    if (!selectedOrg) return;
    setForm({
      orgId: selectedOrg.orgId || "",
      orgName: selectedOrg.orgName || "",
      lvlNo: selectedOrg.lvlNo || 0,
      tcOrgFl: selectedOrg.tcOrgFl || "",
      tmOrgFl: selectedOrg.tmOrgFl || "",
      activeFl: selectedOrg.activeFl || "N",
      orgTopFl: selectedOrg.orgTopFl || "",
      companyId: selectedOrg.companyId || "",
      modifiedBy: selectedOrg.modifiedBy || "",
      orgAbbrvCd: selectedOrg.orgAbbrvCd || "",
      taxbleEntityId: selectedOrg.taxbleEntityId || "",
    });
  }, [selectedOrg]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "s" : "N") : value,
    }));
  };

  const handleSave = async () => {
    if (!form.orgId || !form.orgName.trim() || !form.lvlNo) {
      toast.error("Org ID is required");
      return;
    }

    setIsSaving(true);

    // Mapping frontend state to C# Backend Model (Account.cs)
    const orgPayload = {
      orgId: form.orgId, // Assuming Account Name acts as the ID or unique key
      orgName: form.orgName,
      lvlNo: parseInt(form.lvlNo) || 0,
      tcOrgFl: form.tcOrgFl || "",
      tmOrgFl: form.tmOrgFl || "",
      activeFl: form.activeFl,
      orgTopFl: form.orgTopFl || "",
      companyId: form.companyId || "",
      modifiedBy: user.name || "system",
      orgAbbrvCd: form.orgAbbrvCd || "",
      taxbleEntityId: form.taxbleEntityId || "",
    };

    try {
      let response;
      if (isUpdateMode) {
        response = await api.put(
          ` ${backendUrl}/Orgnization/${orgPayload.orgId}`,
          orgPayload,
        );
        toast.success("Organization updated successfully!");
      } else {
        response = await api.post(` ${backendUrl}/Orgnization`, orgPayload);
        toast.success("Organization created successfully!");
      }

      if (onSaveSuccess) {
        await onSaveSuccess(response.data);
      }
      onClose();
    } catch (error) {
      console.log(error);
      console.error("Error saving org:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Error while creating the Org";
      toast.error(`${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white p-6">
      {viewMode === "form" && (
        <form className="space-y-4">
          {/* Header */}
          <div className="bg-white flex justify-between items-center pb-4 border-b-2 border-gray-300">
            <h2 className="text-[16px] font-medium text-gray-700">
              {isUpdateMode ? "Update Org Master" : "Org Master"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            {/* LEFT COLUMN */}
            <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
              <div className="label-input-div">
                <label className="input-label text-[10px]">
                  Org ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="orgId"
                  value={form.orgId}
                  onChange={handleChange}
                  readOnly={isUpdateMode}
                  className={`input-style-master ${isUpdateMode ? "text-gray-400 cursor-not-allowed" : ""}`}
                  type="text"
                  required
                />
              </div>
              {[
                ["Org Name", "orgName"],
                ["TC Org", "tcOrgFl"],
                ["TM Org", "tmOrgFl"],
                ["Org Top", "orgTopFl"],
              ].map(([label, name, type = "text"]) => (
                <div key={name} className="label-input-div">
                  <label className="input-label text-[10px]">
                    {label}{" "}
                    {label === "Org Name" ? (
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
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
              <div className="relative flex items-center w-full  justify-between">
                <label className="input-label text-[10px]">
                  Level Number <span className="text-red-500">*</span>
                </label>

                <Select
                  options={Array.from({ length: 10 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: i + 1,
                  }))}
                  styles={customStyles}
                  className="rounded outline-none text-[10px] bg-white w-[75%]"
                  value={
                    form.lvlNo
                      ? { label: `${form.lvlNo}`, value: form.lvlNo }
                      : null
                  }
                  onChange={(opt) =>
                    setForm((prev) => ({
                      ...prev,
                      lvlNo: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                  isDisabled={isUpdateMode}
                />
              </div>

              {[
                ["Company ID", "companyId"],
                ["Org Abbrv Code", "orgAbbrvCd"],
                ["Taxable Entity ID", "taxbleEntityId"],
              ].map(([label, name, type = "text"]) => (
                <div key={name} className="label-input-div">
                  <label className="input-label text-[10px]">{label}</label>
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
                    checked={form.activeFl === "s"} // Check if string is "Y"
                    onChange={handleChange}
                    type="checkbox"
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

export default OrgMasterForm;
