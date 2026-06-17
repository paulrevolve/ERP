import React, { useState, useEffect } from "react";
import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { backendUrl } from "./config";
import { CircleArrowLeft } from "lucide-react";

const AccountMasterForm = ({
  mode,
  selectedAccount,
  onClose,
  onSaveSuccess,
}) => {
  const [form, setForm] = useState({
    acctId: "",
    activeFl: "N",
    fyCdFr: "",
    pdNoFr: 0,
    fyCdTo: "",
    pdNoTo: 0,
    acctEntrGrpCd: "",
    projReqdFl: "N",
    sAcctTypeCd: "",
    detlFl: "N",
    acctName: "",
    topFl: "N",
    tcAcctTypeCd: "",
    rowVersion: 0,
    sftFl: "",
    mesFl: "",
    modifiedBy: "",

    fyStarting: "",
    fyEnding: "",
  });
  const [viewMode, setViewMode] = useState("form"); // Always start with form view
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedAccount)); // New state to manage update mode
  const [isSaving, setIsSaving] = useState(false); // State to track if saving is in progress

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const formatDate = (year, period) => {
    if (!year || !period) return "";
    return `${year}-${String(period).padStart(2, "0")}`;
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "24px",
      height: "24px",
      boxShadow: "none", // ❌ removes blue glow
      borderColor: state.isFocused ? "#ccc" : "#ccc", // keep border consistent
      "&:hover": {
        borderColor: "#ccc", // no blue on hover
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
    if (!selectedAccount) return;
    setForm({
      acctId: selectedAccount.acctId || "",
      acctName: selectedAccount.acctName || "",
      activeFl: selectedAccount.activeFl || "N",

      fyCdFr: selectedAccount.fyCdFr || "",
      pdNoFr: Number(selectedAccount.pdNoFr) || 0,
      fyCdTo: selectedAccount.fyCdTo || "",
      pdNoTo: Number(selectedAccount.pdNoTo) || 0,
      acctEntrGrpCd: selectedAccount.acctEntrGrpCd || "",
      projReqdFl: selectedAccount.projectRequired || "N",
      sAcctTypeCd: selectedAccount.sAcctTypeCd || "",
      detlFl: selectedAccount.detail || "N",
      topFl: selectedAccount.topFl || "N",
      tcAcctTypeCd: selectedAccount.tcAcctTypeCd || "",
      lvlNo: selectedAccount.lvlNo || 0,

      fyStarting: formatDate(selectedAccount.fyCdFr, selectedAccount.pdNoFr),
      fyEnding: formatDate(selectedAccount.fyCdTo, selectedAccount.pdNoTo),
      sftFl: selectedAccount.sftFl || "",
      mesFl: selectedAccount.mesFl || "",

      modifiedBy: selectedAccount.modifiedBy || "",
    });
  }, [selectedAccount]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "startDate" || name === "endDate") {
      setForm((prev) => {
        const updated = { ...prev };

        // Handle the case where the user clears the date
        if (!value) {
          if (name === "startDate") {
            updated.fyStarting = "";
            updated.fyCdFr = "";
            updated.pdNoFr = 0;
          } else {
            updated.fyEnding = "";
            updated.fyCdTo = "";
            updated.pdNoTo = 0;
          }
          return updated;
        }

        const [year, month] = value.split("-");

        if (name === "startDate") {
          updated.fyStarting = value; // Stores "2026-03" for the <input>
          updated.fyCdFr = year; // Stores "2026" for the DB
          updated.pdNoFr = Number(month); // Stores 3 for the DB
        }

        if (name === "endDate") {
          updated.fyEnding = value;
          updated.fyCdTo = year;
          updated.pdNoTo = Number(month);
        }

        return updated;
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
    }));
  };

  const handleSave = async () => {
    // Convert FY + Period into comparable numbers (YYYYMM)

    if (
      !form.acctId ||
      !form.acctName.trim() ||
      !form.fyCdFr ||
      !form.fyCdTo ||
      !form.pdNoFr ||
      !form.pdNoTo
    ) {
      toast.error("Please fill all the required fields");
      return;
    }
    const startValue = Number(
      `${form.fyCdFr}${String(form.pdNoFr).padStart(2, "0")}`,
    );
    const endValue = Number(
      `${form.fyCdTo}${String(form.pdNoTo).padStart(2, "0")}`,
    );

    if (startValue >= endValue) {
      toast.error("Start Date must be earlier than or equal to End Date");
      return;
    }

    setIsSaving(true);
    const accountPayload = {
      acctId: form.acctId,
      activeFl: form.activeFl,
      fyCdFr: form.fyCdFr,
      pdNoFr: Number(form.pdNoFr) || 0,
      fyCdTo: form.fyCdTo,
      pdNoTo: Number(form.pdNoTo) || 0,
      acctEntrGrpCd: form.acctEntrGrpCd,
      projReqdFl: form.projReqdFl,
      sAcctTypeCd: form.sAcctTypeCd,
      detlFl: form.detlFl,
      acctName: form.acctName,
      topFl: form.topFl,
      lvlNo: Number(form.lvlNo) || 0,
      tcAcctTypeCd: form.tcAcctTypeCd,
      sftFl: form.sftFl,
      mesFl: form.mesFl,
      modifiedBy: user.name || "system",
    };

    try {
      let response;
      if (isUpdateMode) {
        // Matches [HttpPut("UpdateAccount/{acctId}")]
        response = await api.put(
          `https://planning-master.onrender.com/api/AcctMaster/${accountPayload.acctId}`,
          accountPayload,
        );
        toast.success("Account updated successfully!");
      } else {
        // Matches [HttpPost("CreateAccount")]
        response = await api.post(
          `https://planning-master.onrender.com/api/AcctMaster/CreateAcctMasterV1`,
          accountPayload,
        );
        toast.success("Account created successfully!");
      }

      if (onSaveSuccess) {
        await onSaveSuccess(response.data);
      }
      onClose();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Account not found.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white p-6">
      {viewMode === "form" && (
        <form className="space-y-4">
          {/* Header */}
          <div className="bg-white flex justify-between items-center pb-4  border-b-2 border-gray-300">
            <h2 className="text-[16px] font-medium text-gray-700">
              {isUpdateMode ? "Update Account Master" : "Account Master"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 ">
            {/* LEFT COLUMN */}
            <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
              <div className="label-input-div">
                <label className="input-label text-[10px]">
                  Account ID <span className="text-red-500">*</span>
                </label>
                <input
                  name="acctId"
                  value={form.acctId}
                  onChange={handleChange}
                  readOnly={isUpdateMode}
                  className={`input-style-master ${isUpdateMode ? "text-gray-400 cursor-not-allowed" : ""}`}
                  type="text"
                  required
                />
              </div>

              {[
                ["Account Name", "acctName"],
                ["Time Collection Account Type", "tcAcctTypeCd", "text"],
                ["Account Entry Grp", "acctEntrGrpCd", "text"],
              ].map(([label, name, type = "text"]) => (
                <div key={name} className="label-input-div">
                  <label className="input-label text-[10px]">
                    {label}{" "}
                    {label === "Account Name" ? (
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
                <label className="input-label text-[10px]">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="startDate"
                  value={form.fyStarting}
                  onChange={handleChange}
                  type="month"
                  className="input-style-master"
                />
              </div>

              <div className="label-input-div">
                <label className="input-label text-[10px]">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  name="endDate"
                  value={form.fyEnding}
                  onChange={handleChange}
                  type="month"
                  className="input-style-master"
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
              <div className="relative flex items-center w-full  justify-between">
                <label className="input-label text-[10px]">Level Number</label>

                <Select
                  options={Array.from({ length: 10 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: i + 1,
                  }))}
                  value={
                    form.lvlNo
                      ? { label: `${form.lvlNo}`, value: form.lvlNo }
                      : null
                  }
                  styles={customStyles}
                  className="rounded outline-none text-[10px] bg-white w-[75%]"
                  onChange={(opt) =>
                    setForm((prev) => ({
                      ...prev,
                      lvlNo: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                />
              </div>

              <div className="relative flex items-center w-full justify-between">
                <label className="input-label text-[10px]">Account Type</label>

                <Select
                  options={[
                    { label: "Expense", value: "E" },
                    { label: "Non Labor", value: "N" },
                    { label: "Labor", value: "L" },
                    { label: "Asset", value: "A" },
                    { label: "SubContractor", value: "S" },
                    { label: "Income", value: "I" },
                  ]}
                  value={
                    form.sAcctTypeCd
                      ? [
                          { label: "Expense", value: "E" },
                          { label: "Non Labor", value: "N" },
                          { label: "Labor", value: "L" },
                          { label: "Asset", value: "A" },
                          { label: "SubContractor", value: "S" },
                          { label: "Income", value: "I" },
                        ].find((o) => o.value === form.sAcctTypeCd)
                      : null
                  }
                  styles={customStyles}
                  className="rounded outline-none text-[10px] bg-white w-[75%]"
                  onChange={(opt) =>
                    setForm((prev) => ({
                      ...prev,
                      sAcctTypeCd: opt ? opt.value : "",
                    }))
                  }
                  isSearchable
                />
              </div>

              <div className="label-input-div">
                <label className="input-label text-[10px]">Detail</label>
                <div className=" flex justify-start w-[75%]">
                  <input
                    name="detlFl"
                    checked={form.detlFl === "Y"} // Check if string is "Y"
                    onChange={handleChange}
                    type="checkbox"
                  />
                </div>
              </div>

              <div className="label-input-div">
                <label className="input-label text-[10px]">
                  Project Required
                </label>
                <div className=" flex justify-start w-[75%]">
                  <input
                    name="projReqdFl"
                    checked={form.projReqdFl === "Y"} // Check if string is "Y"
                    onChange={handleChange}
                    type="checkbox"
                  />
                </div>
              </div>

              <div className="label-input-div">
                <label className="input-label text-[10px]">topFl</label>
                <div className=" flex justify-start w-[75%]">
                  <input
                    name="topFl"
                    checked={form.topFl === "Y"} // Check if string is "Y"
                    onChange={handleChange}
                    type="checkbox"
                  />
                </div>
              </div>

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

              <div className="label-input-div">
                <label className="input-label text-[10px]">sftFl</label>
                <div className=" flex justify-start w-[75%]">
                  <input
                    name="sftFl"
                    checked={form.sftFl === "Y"} // Check if string is "Y"
                    onChange={handleChange}
                    type="checkbox"
                  />
                </div>
              </div>

              <div className="label-input-div">
                <label className="input-label text-[10px]">mesFl</label>
                <div className=" flex justify-start w-[75%]">
                  <input
                    name="mesFl"
                    checked={form.mesFl === "Y"} // Check if string is "Y"
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

export default AccountMasterForm;
