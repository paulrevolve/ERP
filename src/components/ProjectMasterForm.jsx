import React, { useState, useEffect } from "react";
import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { backendUrl } from "./config";
import { CircleArrowLeft } from "lucide-react";

const ProjectMasterForm = ({
  mode,
  selectedProject,
  onClose,
  onSaveSuccess,
}) => {
  // const defaultMonth = new Date().toISOString().slice(0, 7);

  const [form, setForm] = useState({
    projId: "",
    projName: "",
    projAbbrvCd: "",
    projTypeDc: "FIXED PRICE",
    orgId: "",
    companyId: "1",
    projMgrName: "",
    projStartDt: "",
    projEndDt: "",
    activeFl: true,
    allowCharging: true,
    levelNo: 0,
    projSegId: "",
    projSegName: "",
    primeContrId: "",
    subctrId: "",
    custPoId: "",
    taskOrderNo: "",
    cntrId: "string",
    oppId: "string",
    projVTotAmt: 0,
    projFTotAmt: 0,
    projVFeeAmt: 0,
    projVCstAmt: 0,
    projFFeeAmt: 0,
    projFCstAmt: 0,
    projVAwdFeeAmt: 0,
    projFAwdFeeAmt: 0,
    projLn1Adr: "",
    projLn2Adr: "",
    projLn3Adr: "",
    cityName: "",
    mailStateDc: "",
    postalCd: "",
    countryCd: "",
    classification: "DIRECT Project",
    exportProject: "None",
    billableProject: true,
    WorkforceRequired: true,
    projLongName: "",
    modifiedBy: "System",
    acctGrpCd: "",
  });
  const [viewMode, setViewMode] = useState("form"); // Always start with form view
  const [allBusinessBudgets, setAllBusinessBudgets] = useState([]); // To store all budgets for the table
  const [burdenTemplates, setBurdenTemplates] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedProject)); // New state to manage update mode
  const [isSaving, setIsSaving] = useState(false); // State to track if saving is in progress
  // Add these to your state declarations inside NewBusiness component
  // const [orgOptions, setOrgOptions] = useState([]);
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [searchTermOrg, setSearchTermOrg] = useState("");
  const [searchTermAcc, setSearchTermAcc] = useState("");
  const [searchTermBurden, setSearchTermBurden] = useState("");
  const [focusOrg, setFocusOrg] = useState(false);
  const [focusAcc, setFocusAcc] = useState(false);
  const [focusBurden, setFocusBurden] = useState(false);
  const [org, setOrg] = useState([]);
  const [rev, setRev] = useState([]);
  const [activeTab, setActiveTab] = useState("basicInfo");

  const orgOptions = org?.map((item) => ({
    value: item.orgId,
    label: item.orgId, // This ensures ONLY the Org Id shows in the dropdown
  }));
  const revOptions = rev?.map((item) => ({
    value: item.formulaCd,
    label: item.formulaCd, // This ensures ONLY the Org Id shows in the dropdown
  }));

  const classificationOptions = [
    { value: "DIRECT Project", label: "Direct Project" },
    { value: "INDIRECT Project", label: "Indirect Project" },
  ];

  const projectType = [
    { value: "a", label: "A" },
    { value: "b", label: "B" },
  ];

  const projectExport = [
    { value: "c", label: "C" },
    { value: "d", label: "D" },
  ];

  const tabs = [
    { id: "basicInfo", label: "Basic Info" },
    { id: "detailFinance", label: "Detail & Financials" },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "24px",
      height: "24px",
      backgroundColor: state.isDisabled ? "#fcfcfc" : "#ffffff",
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

  const getAllorg = async () => {
    try {
      const res = await api.get(`${backendUrl}/Orgnization/GetAllOrgs`);
      setOrg(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllrev = async () => {
    try {
      const res = await api.get(`${backendUrl}/RevFormula`);
      setRev(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // This takes "2026-03-18T00:00:00" and returns "2026-03-18"
    return dateString.split("T")[0];
  };

  useEffect(() => {
    getAllorg();
    getAllrev();
  }, []);

  const formatDate = (year, period) => {
    if (!year || !period) return "";
    return `${year}-${String(period).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!selectedProject) return;

    const getFlagValue = (name) => {
      const flag = selectedProject.flags.find((f) => f.flagName === name);
      return flag?.flagValue === "Y"; // Returns true if "Y", false otherwise
    };

    setForm({
      projId: selectedProject.projId || "",
      projName: selectedProject.projName || "",
      projAbbrvCd: selectedProject.projAbbrvCd || "",
      projTypeDc: selectedProject.projTypeDc || "",
      orgId: selectedProject.orgId || "",
      companyId: selectedProject.companyId || "",
      projMgrName: selectedProject.projMgrName || "",
      projStartDt: formatDateForInput(selectedProject.projStartDt),
      projEndDt: formatDateForInput(selectedProject.projEndDt),
      activeFl: (selectedProject.activeFl === "Y" ? true : false) || false,
      allowCharging: getFlagValue("allowCharging"),
      billableProject: getFlagValue("billableProject"),
      WorkforceRequired: getFlagValue("WorkforceRequired"),
      levelNo: selectedProject.levelNo || 0,
      projSegId: selectedProject.hierarchy.projSegId || "",
      projSegName: selectedProject.hierarchy.projSegName || "",
      primeContrId: selectedProject.contract.primeContrId || "",
      subctrId: selectedProject.contract.subctrId || "",
      custPoId: selectedProject.contract.custPoId || "",
      taskOrderNo: selectedProject.contract.taskOrderNo || "",
      cntrId: selectedProject.contract.cntrId || "",
      oppId: selectedProject.contract.oppId || "",

      // Financials (Numbers)
      projVTotAmt: selectedProject.financial.projVTotAmt || 0,
      projFTotAmt: selectedProject.financial.projFTotAmt || 0,
      projVFeeAmt: selectedProject.financial.projVFeeAmt || 0,
      projVCstAmt: selectedProject.financial.projVCstAmt || 0,
      projFFeeAmt: selectedProject.financial.projFFeeAmt || 0,
      projFCstAmt: selectedProject.financial.projFCstAmt || 0,
      projVAwdFeeAmt: selectedProject.financial.projVAwdFeeAmt || 0,
      projFAwdFeeAmt: selectedProject.financial.projFAwdFeeAmt || 0,

      // Address & Location
      projLn1Adr: selectedProject.address.projLn1Adr || "",
      projLn2Adr: selectedProject.address.projLn2Adr || "",
      projLn3Adr: selectedProject.address.projLn3Adr || "",
      cityName: selectedProject.address.cityName || "",
      mailStateDc: selectedProject.address.mailStateDc || "",
      postalCd: selectedProject.address.postalCd || "",
      countryCd: selectedProject.address.countryCd || "",

      // Classifications
      classification: selectedProject.classification || "DIRECT Project",
      exportProject: selectedProject.exportProject || "None",
      projLongName: selectedProject.projLongName || "",
      modifiedBy: selectedProject.modifiedBy || "",
      acctGrpCd: selectedProject.acctGrpCd || "",
    });
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.projId || !form.orgId) {
      toast.error("Project ID is required.");
      return;
    }

    setIsSaving(true);
    const payload = {
      projId: form.projId,
      projName: form.projName,
      projTypeDc: form.projTypeDc,
      orgId: form.orgId || null,
      companyId: String(form.companyId),
      projMgrName: form.projMgrName,
      projAbbrvCd: form.projAbbrvCd,
      projStartDt: form.projStartDt || null,
      projLongName: form.projLongName || "",
      projEndDt: form.projEndDt || null,
      activeFl: form.activeFl ? "Y" : "N",
      modifiedBy: form.modifiedBy,
      acctGrpCd: form.acctGrpCd,
      levelNo: Number(form.levelNo),
      flags: [
        {
          projId: form.projId,
          flagName: "WorkforceRequired",
          flagValue: form.WorkforceRequired ? "Y" : "s",
        },
        {
          projId: form.projId,
          flagName: "allowCharging",
          flagValue: form.allowCharging ? "Y" : "s",
        },
        {
          projId: form.projId,
          flagName: "billableProject",
          flagValue: form.billableProject ? "Y" : "s",
        },
      ],
      financial: {
        projId: form.projId,
        projVTotAmt: Number(form.projVTotAmt),
        projFTotAmt: Number(form.projFTotAmt),
        projVFeeAmt: Number(form.projVFeeAmt),
        projVCstAmt: Number(form.projVCstAmt),
        projFFeeAmt: Number(form.projFFeeAmt),
        projFCstAmt: Number(form.projFCstAmt),
        projVAwdFeeAmt: Number(form.projVAwdFeeAmt),
        projFAwdFeeAmt: Number(form.projFAwdFeeAmt),
      },
      hierarchy: null,
      // hierarchy: {
      //   projId: form.projId,
      //   levelNo: Number(form.levelNo),
      //   projSegId: form.projSegId,
      //   projSegName: form.projSegName
      // },
      contract: {
        projId: form.projId,
        primeContrId: form.primeContrId,
        subctrId: form.subctrId,
        custPoId: form.custPoId,
        cntrId: form.cntrId,
        oppId: form.oppId,
        taskOrderNo: form.taskOrderNo,
      },
      address: {
        projId: form.projId,
        projLn1Adr: form.projLn1Adr,
        projLn2Adr: form.projLn2Adr,
        projLn3Adr: form.projLn3Adr,
        cityName: form.cityName,
        mailStateDc: form.mailStateDc,
        postalCd: form.postalCd,
        countryCd: form.countryCd,
      },
    };

    try {
      let response;
      if (isUpdateMode) {
        // Matches [HttpPut("UpdateAccount/{acctId}")]
        response = await api.put(
          `${backendUrl}/api/ProjectMaster/${payload.projId}`,
          payload,
        );
        toast.success("Project updated successfully!");
      } else {
        // Matches [HttpPost("CreateAccount")]
        response = await api.post(
          `${backendUrl}/api/ProjectMaster/CreateProject`,

          payload,
        );
        toast.success("Project created successfully!");
      }

      if (onSaveSuccess) {
        await onSaveSuccess(response.data);
      }
      onClose();
    } catch (error) {
      // const msg = error.response?.data || error.response?.data?.message || "Project not found.";

      // toast.error(msg);
      // 1. Check for nested validation errors (common in 400 responses)
      const serverError = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(", ")
        : null;

      // 2. Check for a direct message or the raw data string
      const msg =
        serverError ||
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "An unexpected error occurred.";

      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-6 text-gray-800 font-sans">
      {viewMode === "form" && (
        <form className="space-y-4">
          {/* Header */}
          <div className="bg-white flex justify-between items-center pb-2 border-b-2 border-gray-300">
            <h2 className="text-[16px] font-medium text-gray-700">
              {isUpdateMode ? "Update Project Master" : "Project Master"}
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

          <div className="grid grid-cols-3 md:grid-cols-4 gap-x-16 gap-y-2 bg-gray-100 rounded border-l-4 border-[#104e64] p-1">
            {[
              ["Project ID", "projId"],
              ["Project Name", "projName"],
              ["Abbreviation", "projAbbrvCd"],
            ].map(([label, name, type = "text"]) => (
              <div key={name} className="label-input-div">
                <label className="input-label text-[10px]">
                  {label}{" "}
                  {label === "Project ID" && !isUpdateMode ? (
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
                  className={`${name === "projId" && isUpdateMode ? "bg-[#FCFCFC] text-gray-400" : "#FFFFF"} input-style-master`}
                  readOnly={name === "projId" && isUpdateMode} // Make projId read-only in update mode
                />
              </div>
            ))}

            <div className="relative flex items-center w-full justify-between gap-2">
              <label className="input-label text-[10px] whitespace-nowrap">
                Level Number{" "}
                {!isUpdateMode ? <span className="text-red-500">*</span> : ""}
              </label>
              <Select
                options={Array.from({ length: 10 }, (_, i) => ({
                  label: `${i + 1}`,
                  value: i + 1,
                }))}
                className="rounded outline-none text-[10px] bg-white w-[80%]"
                styles={customStyles}
                value={
                  form.levelNo
                    ? { label: `${form.levelNo}`, value: form.levelNo }
                    : null
                }
                onChange={(opt) =>
                  setForm((prev) => ({
                    ...prev,
                    levelNo: opt ? opt.value : "",
                  }))
                }
                isSearchable
                isDisabled={isUpdateMode} // Make Level Number read-only in update mode
              />
            </div>
          </div>

          <div className="flex gap-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button" // CRITICAL: Prevents form submission/refresh
                onClick={(e) => {
                  e.preventDefault(); // Prevents default event behavior
                  setActiveTab(tab.id);
                }}
                className={`rounded-lg px-2 py-1.5 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
                    : "text-gray-600 hover:text-gray-800 bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Grid */}
          {activeTab === "basicInfo" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
              {/* LEFT COLUMN */}
              <fieldset className="fieldset-master">
                <legend className="legend-master">Classification</legend>
                <div className="space-y-3">
                  <div className="relative flex items-center w-full  justify-between">
                    <label className="input-label text-[10px]">
                      Classification
                    </label>

                    <Select
                      value={classificationOptions.find(
                        (opt) => opt.value === form.classification,
                      )}
                      options={classificationOptions}
                      onChange={(selectedOption) => {
                        // Manually trigger your handleChange logic or update state directly
                        setForm({
                          ...form,
                          classification: selectedOption
                            ? selectedOption.value
                            : "",
                        });
                      }}
                      styles={customStyles}
                      className="rounded outline-none text-[10px] bg-white w-[75%]"
                      isSearchable
                    />
                  </div>

                  <div className="relative flex items-center w-full  justify-between">
                    <label className="input-label text-[10px]">
                      Project Type
                    </label>

                    <Select
                      value={revOptions.find(
                        (opt) => opt.value === form.projTypeDc,
                      )}
                      options={revOptions}
                      onChange={(selectedOption) => {
                        // Manually trigger your handleChange logic or update state directly
                        setForm({
                          ...form,
                          projTypeDc: selectedOption
                            ? selectedOption.value
                            : "",
                        });
                      }}
                      styles={customStyles}
                      className="rounded outline-none text-[10px] bg-white w-[75%]"
                      isSearchable
                    />
                  </div>

                  <div className="relative flex items-center w-full  justify-between">
                    <label className="input-label text-[10px]">
                      Export Project
                    </label>

                    <Select
                      value={projectExport.find(
                        (opt) => opt.value === form.exportProject,
                      )}
                      options={projectExport}
                      onChange={(selectedOption) => {
                        // Manually trigger your handleChange logic or update state directly
                        setForm({
                          ...form,
                          exportProject: selectedOption
                            ? selectedOption.value
                            : "",
                        });
                      }}
                      styles={customStyles}
                      className="rounded outline-none text-[10px] bg-white w-[75%]"
                      isSearchable
                    />
                  </div>

                  <div className="label-input-div">
                    <label className="input-label text-[10px]">
                      Billable Project
                    </label>
                    <div className=" flex justify-start w-[75%]">
                      <input
                        name="billableProject"
                        // checked={form.billableProject === "Y"} // Check if string is "Y"
                        checked={form.billableProject} // Check if string is "Y"
                        onChange={handleChange}
                        type="checkbox"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="fieldset-master">
                <legend className="legend-master">Controls</legend>
                <div className="space-y-3">
                  <div className="relative flex items-center w-full  justify-between">
                    <label className="input-label text-[10px]">
                      Owning Org{" "}
                      {!isUpdateMode ? (
                        <span className="text-red-500">*</span>
                      ) : (
                        ""
                      )}
                    </label>

                    <Select
                      value={orgOptions.find((opt) => opt.value === form.orgId)}
                      options={orgOptions}
                      onChange={(selectedOption) => {
                        // Manually trigger your handleChange logic or update state directly
                        setForm({
                          ...form,
                          orgId: selectedOption ? selectedOption.value : "",
                        });
                      }}
                      styles={customStyles}
                      className="rounded outline-none text-[10px]  bg-white w-[75%]"
                      isSearchable
                      isDisabled={isUpdateMode}
                    />
                  </div>

                  <div className="label-input-div">
                    <label className="input-label text-[10px]">
                      Company ID
                    </label>
                    <input
                      name="companyId"
                      value={form.companyId}
                      onChange={handleChange}
                      type="text"
                      className="input-style-master"
                    />
                  </div>

                  <div className="label-input-div">
                    <label className="input-label text-[10px]">
                      Project Workforce Required
                    </label>
                    <div className=" flex justify-start w-[75%]">
                      <input
                        name="WorkforceRequired"
                        // checked={form.projectWorkforceRequired === "Y"} // Check if string is "Y"
                        checked={form.WorkforceRequired} // Check if string is "Y"
                        onChange={handleChange}
                        type="checkbox"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset className="fieldset-master">
                <legend className="legend-master">Charging</legend>
                <div className="space-y-3">
                  <div className="label-input-div">
                    <label className="input-label text-[10px]">Active</label>
                    <div className=" flex justify-start w-[75%]">
                      <input
                        name="activeFl"
                        // checked={form.activeFl === "Y"} // Check if string is "Y"
                        checked={form.activeFl} // Check if string is "Y"
                        onChange={handleChange}
                        type="checkbox"
                      />
                    </div>
                  </div>

                  <div className="label-input-div">
                    <label className="input-label text-[10px]">
                      Allow Charging
                    </label>
                    <div className=" flex justify-start w-[75%]">
                      <input
                        name="allowCharging"
                        // checked={form.allowCharging === "Y"} // Check if string is "Y"
                        checked={form.allowCharging} // Check if string is "Y"
                        onChange={handleChange}
                        type="checkbox"
                      />
                    </div>
                  </div>

                  <div className="label-input-div">
                    <label className="input-label text-[10px]">
                      Account Group
                    </label>
                    <input
                      name="acctGrpCd"
                      value={form.acctGrpCd}
                      onChange={handleChange}
                      type="text"
                      className="input-style-master"
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          )}

          {activeTab === "detailFinance" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                <fieldset className="fieldset-master">
                  <legend className="legend-master">Project Details</legend>
                  <div className="space-y-3">
                    <div className="label-input-div">
                      <label className="input-label text-[10px]">Manager</label>
                      <input
                        name="projMgrName"
                        value={form.projMgrName}
                        onChange={handleChange}
                        type="text"
                        className="input-style-master"
                      />
                    </div>

                    <div className="label-input-div">
                      <label className="input-label text-[10px]">
                        Start Date (POP){" "}
                      </label>
                      {/* <span className="text-red-500">*</span> */}
                      <input
                        name="projStartDt"
                        value={form.projStartDt}
                        onChange={handleChange}
                        type="date"
                        className="input-style-master"
                      />
                    </div>

                    <div className="label-input-div">
                      <label className="input-label text-[10px]">
                        End Date (POP){" "}
                      </label>
                      {/* <span className="text-red-500">*</span> */}
                      <input
                        name="projEndDt"
                        value={form.projEndDt}
                        onChange={handleChange}
                        type="date"
                        className="input-style-master"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Long Name
                        </label>
                        <input
                          name="projLongName"
                          value={form.projLongName}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="fieldset-master">
                  <legend className="legend-master">Contract Details</legend>
                  <div className="space-y-3">
                    <div className="label-input-div">
                      <label className="input-label text-[10px]">
                        Prime Contract ID
                      </label>
                      <input
                        name="primeContrId"
                        value={form.primeContrId}
                        onChange={handleChange}
                        type="text"
                        className="input-style-master"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Subcontract ID
                        </label>
                        <input
                          name="subctrId"
                          value={form.subctrId}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Purchase Order ID
                        </label>
                        <input
                          name="custPoId"
                          value={form.custPoId}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Task Order ID
                        </label>
                        <input
                          name="taskOrderNo"
                          value={form.taskOrderNo}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="fieldset-master">
                  <legend className="legend-master">Address</legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Line 1
                        </label>
                        <textarea
                          name="projLn1Adr"
                          rows={2}
                          value={form.projLn1Adr}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Line 2
                        </label>
                        <textarea
                          name="projLn2Adr"
                          rows={2}
                          value={form.projLn2Adr}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Line 3
                        </label>
                        <textarea
                          name="projLn3Adr"
                          rows={2}
                          value={form.projLn3Adr}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">City</label>
                        <input
                          name="cityName"
                          value={form.cityName}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">State</label>
                        <input
                          name="mailStateDc"
                          value={form.mailStateDc}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Postal Code
                        </label>
                        <input
                          name="postalCd"
                          value={form.postalCd}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          Country
                        </label>
                        <input
                          name="countryCd"
                          value={form.countryCd}
                          onChange={handleChange}
                          type="text"
                          className="input-style-master"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-6 gap-y-4">
                <fieldset className="fieldset-master">
                  <legend className="legend-master">Project Details</legend>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          V Total Amt
                        </label>
                        <input
                          name="projVTotAmt"
                          value={form.projVTotAmt}
                          onChange={handleChange}
                          type="number"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          V Cost Amt
                        </label>
                        <input
                          name="projVCstAmt"
                          value={form.projVCstAmt}
                          onChange={handleChange}
                          type="number"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          V Award Fee
                        </label>
                        <input
                          name="projVAwdFeeAmt"
                          value={form.projVAwdFeeAmt}
                          onChange={handleChange}
                          type="number"
                          className="input-style-master"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          F Total Amt
                        </label>
                        <input
                          name="projFTotAmt"
                          value={form.projFTotAmt}
                          onChange={handleChange}
                          type="number"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          F Cost Amt
                        </label>
                        <input
                          name="projFCstAmt"
                          value={form.projFCstAmt}
                          onChange={handleChange}
                          type="number"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          F Award Fee
                        </label>
                        <input
                          name="projFAwdFeeAmt"
                          value={form.projFAwdFeeAmt}
                          onChange={handleChange}
                          type="number"
                          className="input-style-master"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          V Fee Amt
                        </label>
                        <input
                          name="projVFeeAmt"
                          value={form.projVFeeAmt}
                          onChange={handleChange}
                          type="number"
                          className="input-style-master"
                        />
                      </div>
                      <div className="label-input-div">
                        <label className="input-label text-[10px]">
                          F Fee Amt
                        </label>
                        <input
                          name="projFFeeAmt"
                          value={form.projFFeeAmt}
                          onChange={handleChange}
                          type="number"
                          className="input-style-master"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>

              <div></div>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default ProjectMasterForm;
