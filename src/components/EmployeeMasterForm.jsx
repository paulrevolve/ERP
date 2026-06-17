import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { backendUrl } from "./config";
import { CircleArrowLeft } from "lucide-react";

const FormField = ({ label, children }) => (
  <div className="label-input-div">
    <label className="input-label text-[10px] ">{label}:</label>
    <div
      className={`${label === "Manager ID" || label === "Account" || label === "Organization" || label === "GLC" ? "" : "border"} outline-none border-gray-300 rounded text-[10px] bg-white w-[75%]`}
    >
      {children}
    </div>
  </div>
);

const EmployeeMasterForm = ({
  mode,
  selectedEmployee,
  onClose,
  onSaveSuccess,
}) => {
  const [form, setForm] = useState({
    // --- Employee Info Tab fields ---
    emplId: "",
    lvPdCd: "",
    taxbleEntityId: "",
    ssnId: "",
    origHireDt: "",
    adjHireDt: "",
    termDt: "",
    sEmplStatusCd: "ACT",
    spvsrName: "",
    lastName: "",
    firstName: "",
    midName: "",
    prefName: "",
    namePrfxCd: "",
    nameSfxCd: "",
    tsPdCd: "",
    birthDt: "",
    cityName: "",
    countryCd: "",
    lastFirstName: "",
    ln1Adr: "",
    ln2Adr: "",
    ln3Adr: "",
    mailStateDc: "",
    postalCd: "",
    modifiedBy: "SystemUser",
    timeStamp: "",
    locatorCd: "",
    prirName: "",
    companyId: "",
    lastReviewDt: "",
    nextReviewDt: "",
    sexCd: "",
    maritalCd: "",
    eligAutoPayFl: false,
    emailId: "",
    homeEmailId: "",
    mgrEmplId: "",
    sRaceCd: "",
    prServEmplId: "",
    countyName: "",
    tsPdRegHrsNo: 0,
    payPdRegHrsNo: 0,
    disabledFl: false,
    mosReviewNo: 0,
    contName1: "",
    contName2: "",
    contPhone1: "",
    contPhone2: "",
    contRel1: "",
    contRel2: "",
    unionEmplFl: false,
    visaTypeCd: "",
    vetStatusS: false,
    vetStatusV: false,
    vetStatusO: false,
    vetStatusR: false,
    essPinId: "",
    pinUpdatedFl: false,
    sEssCosCd: "",
    rowversion: "",
    vetReleaseDt: "",
    contractorFl: false,
    blindFl: false,
    visaDt: "",
    vetStatusD: false,
    vetStatusA: false,
    timeEntryType: "",
    badgeGroup: "",
    badgeId: "",
    loginId: "",
    sftFl: false,
    mesFl: false,
    clockFl: false,
    plantId: "",
    emplSourceCd: "",
    srExportDt: "",
    hrsmartExportDt: "",
    vetStatusP: false,
    birthCityName: "",
    birthMailStateDc: "",
    birthCountryCd: "",
    userLoginId: "",
    emplAuthMthd: "",
    essUserFl: false,
    lastDayDt: "",
    govwiniqLoginId: "",
    huaId: "",
    huaActvMapFl: false,
    vetStatusNp: false,
    vetStatusDeclined: false,
    vetStatusRs: false,

    // Address/Contact
    addrLine1: "",
    addrLine2: "",
    addrLine3: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    c1Name: "",
    c1Phone: "",
    c1Rel: "",
    c2Name: "",
    c2Phone: "",
    c2Rel: "",
    emailWork: "",
    emailPersonal: "",

    // Timesheet Defaults
    timesheetAccount: "",
    timesheetOrg: "",
    timesheetProject: "",
    glc: "",
    payType: "",
    laborLocation: "",
    workersComp: "",
    refNo1: "",
    refNo2: "",

    acctId: "",
    orgId: "",
    regPayType: "",
    genlLabCatCd: "",
    labLocCd: "",
    workCompCd: "",

    notes: "",
  });
  const [viewMode, setViewMode] = useState("form"); // Always start with form view
  const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedEmployee)); // New state to manage update mode
  const [isSaving, setIsSaving] = useState(false); // State to track if saving is in progress
  const [activeTab, setActiveTab] = useState("employeeInfo");

  const [orgOptions, setOrgOptions] = useState([]);
  const [acctOptions, setAcctOptions] = useState([]);
  const [glcOptions, setGlcOptions] = useState([]);
  const [emplOptions, setEmplOptions] = useState([]);

  const tabs = [
    { id: "employeeInfo", label: "Employee Info" },
    //   { id: "hrData", label: "HR Data" },
    { id: "address", label: "Address/Contact" },
    { id: "timesheet", label: "Timesheet Defaults" },
    //   { id: "product", label: "Product Interface" },
    //   { id: "notes", label: "Notes" },
  ];

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
    const fetchDropdownData = async () => {
      try {
        // Replace these URLs with your actual endpoints
        const [orgRes, acctRes, emplRes, glcRes] = await Promise.all([
          api.get(`${backendUrl}/api/Organizations`),
          api.get(`${backendUrl}/api/AcctMaster`),
          api.get(`${backendUrl}/api/EmployeeMaster`),
          api.get(`${backendUrl}/api/PlcCodes`), // Adjust if PLC endpoint name differs
        ]);

        setOrgOptions(orgRes.data || []);
        setAcctOptions(acctRes.data || []);
        setGlcOptions(glcRes.data || []);
        setEmplOptions(emplRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dropdown options", error);
      }
    };

    fetchDropdownData();
  }, []);

  const formatForInput = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0]; // Converts "2026-03-01T00:00:00" to "2026-03-01"
  };

  console.log("details:", selectedEmployee);

  useEffect(() => {
    if (!selectedEmployee) return;
    setForm({
      emplId: selectedEmployee.emplId ?? "",
      lvPdCd: selectedEmployee.lvPdCd ?? "",
      taxbleEntityId: selectedEmployee.taxbleEntityId ?? "",
      ssnId: selectedEmployee.ssnId ?? "",
      origHireDt: formatForInput(selectedEmployee.origHireDt) ?? "",
      adjHireDt: formatForInput(selectedEmployee.adjHireDt) ?? "",
      termDt: formatForInput(selectedEmployee.termDt) ?? "",
      sEmplStatusCd: selectedEmployee.sEmplStatusCd ?? "ACT",
      spvsrName: selectedEmployee.spvsrName ?? "",
      lastName: selectedEmployee.lastName ?? "",
      firstName: selectedEmployee.firstName ?? "",
      midName: selectedEmployee.midName ?? "",
      prefName: selectedEmployee.prefName ?? "",
      namePrfxCd: selectedEmployee.namePrfxCd ?? "",
      nameSfxCd: selectedEmployee.nameSfxCd ?? "",
      tsPdCd: selectedEmployee.tsPdCd ?? "",
      birthDt: formatForInput(selectedEmployee.birthDt) ?? "",
      cityName: selectedEmployee.cityName ?? "",
      countryCd: selectedEmployee.countryCd ?? "",
      lastFirstName: selectedEmployee.lastFirstName ?? "",
      ln1Adr: selectedEmployee.ln1Adr ?? "",
      ln2Adr: selectedEmployee.ln2Adr ?? "",
      ln3Adr: selectedEmployee.ln3Adr ?? "",
      mailStateDc: selectedEmployee.mailStateDc ?? "",
      postalCd: selectedEmployee.postalCd ?? "",
      timeStamp: selectedEmployee.timeStamp ?? new Date().toISOString(),
      locatorCd: selectedEmployee.locatorCd ?? "",
      prirName: selectedEmployee.prirName ?? "",
      companyId: selectedEmployee.companyId ?? "",
      lastReviewDt: formatForInput(selectedEmployee.lastReviewDt) ?? "",
      nextReviewDt: formatForInput(selectedEmployee.nextReviewDt) ?? "",
      sexCd: selectedEmployee.sexCd ?? "",
      maritalCd: selectedEmployee.maritalCd ?? "",
      eligAutoPayFl: selectedEmployee.eligAutoPayFl ?? false,
      emailId: selectedEmployee.emailId ?? "",
      homeEmailId: selectedEmployee.homeEmailId ?? "",
      mgrEmplId: selectedEmployee.mgrEmplId ?? "",
      sRaceCd: selectedEmployee.sRaceCd ?? "",
      prServEmplId: selectedEmployee.prServEmplId ?? "",
      countyName: selectedEmployee.countyName ?? "",
      tsPdRegHrsNo: selectedEmployee.tsPdRegHrsNo ?? 0,
      payPdRegHrsNo: selectedEmployee.payPdRegHrsNo ?? 0,
      disabledFl: selectedEmployee.disabledFl ?? false,
      mosReviewNo: selectedEmployee.mosReviewNo ?? 0,
      contName1: selectedEmployee.contName1 ?? "",
      contName2: selectedEmployee.contName2 ?? "",
      contPhone1: selectedEmployee.contPhone1 ?? "",
      contPhone2: selectedEmployee.contPhone2 ?? "",
      contRel1: selectedEmployee.contRel1 ?? "",
      contRel2: selectedEmployee.contRel2 ?? "",
      unionEmplFl: selectedEmployee.unionEmplFl ?? false,
      visaTypeCd: selectedEmployee.visaTypeCd ?? "",
      vetStatusS: selectedEmployee.vetStatusS ?? false,
      vetStatusV: selectedEmployee.vetStatusV ?? false,
      vetStatusO: selectedEmployee.vetStatusO ?? false,
      vetStatusR: selectedEmployee.vetStatusR ?? false,
      essPinId: selectedEmployee.essPinId ?? "",
      pinUpdatedFl: selectedEmployee.pinUpdatedFl ?? false,
      sEssCosCd: selectedEmployee.sEssCosCd ?? "",
      rowversion: selectedEmployee.rowversion ?? "",
      vetReleaseDt: formatForInput(selectedEmployee.vetReleaseDt) ?? "",
      contractorFl: selectedEmployee.contractorFl ?? false,
      blindFl: selectedEmployee.blindFl ?? false,
      visaDt: formatForInput(selectedEmployee.visaDt) ?? "",
      vetStatusD: selectedEmployee.vetStatusD ?? false,
      activeDutyWartine: selectedEmployee.activeDutyWartine ?? false,
      vetStatusA: selectedEmployee.vetStatusA ?? false,
      timeEntryType: selectedEmployee.timeEntryType ?? "",
      badgeGroup: selectedEmployee.badgeGroup ?? "",
      badgeId: selectedEmployee.badgeId ?? "",
      loginId: selectedEmployee.loginId ?? "",
      sftFl: selectedEmployee.sftFl ?? false,
      mesFl: selectedEmployee.mesFl ?? false,
      clockFl: selectedEmployee.clockFl ?? false,
      plantId: selectedEmployee.plantId ?? "",
      emplSourceCd: selectedEmployee.emplSourceCd ?? "",
      srExportDt: formatForInput(selectedEmployee.srExportDt) ?? "",
      hrsmartExportDt: formatForInput(selectedEmployee.hrsmartExportDt) ?? "",
      vetStatusP: selectedEmployee.vetStatusP ?? false,
      birthCityName: selectedEmployee.birthCityName ?? "",
      birthMailStateDc: selectedEmployee.birthMailStateDc ?? "",
      birthCountryCd: selectedEmployee.birthCountryCd ?? "",
      userLoginId: selectedEmployee.userLoginId ?? "",
      emplAuthMthd: selectedEmployee.emplAuthMthd ?? "",
      essUserFl: selectedEmployee.essUserFl ?? false,
      lastDayDt: formatForInput(selectedEmployee.lastDayDt) ?? "",
      govwiniqLoginId: selectedEmployee.govwiniqLoginId ?? "",
      huaId: selectedEmployee.huaId ?? "",
      huaActvMapFl: selectedEmployee.huaActvMapFl ?? false,
      vetStatusNp: selectedEmployee.vetStatusNp ?? false,
      vetStatusDeclined: selectedEmployee.vetStatusDeclined ?? false,
      vetStatusRs: selectedEmployee.vetStatusRs ?? false,

      addrLine1: selectedEmployee.addresses?.[0]?.line1 ?? "",
      addrLine2: selectedEmployee.addresses?.[0]?.line2 ?? "",
      addrLine3: selectedEmployee.addresses?.[0]?.line3 ?? "",
      city: selectedEmployee.addresses?.[0]?.cityName ?? "",
      state: selectedEmployee.addresses?.[0]?.stateDc ?? "",
      postalCode: selectedEmployee.addresses?.[0]?.postalCd ?? "",
      country: selectedEmployee.addresses?.[0]?.countryCd ?? "",
      c1Name: selectedEmployee.contacts?.[0]?.contactName ?? "",
      c1Phone: selectedEmployee.contacts?.[0]?.contactPhone ?? "",
      c1Rel: selectedEmployee.contacts?.[0]?.contactRelation ?? "",
      c2Name: selectedEmployee.contacts?.[1]?.contactName ?? "",
      c2Phone: selectedEmployee.contacts?.[1]?.contactPhone ?? "",
      c2Rel: selectedEmployee.contacts?.[1]?.contactRelation ?? "",

      timesheetAccount: selectedEmployee.timesheetAccount ?? "",
      timesheetOrg: selectedEmployee.timesheetOrg ?? "",
      timesheetProject: selectedEmployee.timesheetProject ?? "",
      glc: selectedEmployee.glc ?? "",
      payType: selectedEmployee.payType ?? "",
      laborLocation: selectedEmployee.laborLocation ?? "",
      workersComp: selectedEmployee.workersComp ?? "",
      notes: selectedEmployee.notes ?? "",
      acctGrpCd: selectedEmployee.emplAcctOrgDflt?.acctGrpCd || "",
      acctId: selectedEmployee.emplAcctOrgDflt?.acctId || "",
      modifiedBy:
        selectedEmployee.emplAcctOrgDflt?.modifiedBy ||
        selectedEmployee.modifiedBy ||
        "SystemUser",
      orgId: selectedEmployee.emplAcctOrgDflt?.orgId,
      ref1Id: selectedEmployee.emplAcctOrgDflt?.ref1Id,
      ref2Id: selectedEmployee.emplAcctOrgDflt?.ref2Id,
      regPayType: selectedEmployee.emplAcctOrgDflt?.regPayType || null,
      otPayType: null,
      genlLabCatCd: selectedEmployee.emplAcctOrgDflt?.genlLabCatCd || "",
      labLocCd: selectedEmployee.emplAcctOrgDflt?.labLocCd || "",
      workCompCd: selectedEmployee.emplAcctOrgDflt?.workCompCd || "",
      billLabCatCd: selectedEmployee.emplAcctOrgDflt?.billLabCatCd || "",
      rowVersion: selectedEmployee.emplAcctOrgDflt?.rowv || "",
      whStateCd: selectedEmployee.emplAcctOrgDflt?.whStateCd || "",
    });
  }, [selectedEmployee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Level: allowed range 1–14
    if (name === "level") {
      if (value === "") {
        // allow clearing input
      } else {
        const num = Number(value);
        if (!Number.isInteger(num) || num < 1 || num > 14) {
          toast.error("Level must be between 1 and 14", { autoClose: 2000 });
          return;
        }
      }
    }

    // Version: allowed range 1–999
    if (name === "version") {
      if (value === "") {
        // allow clearing input
      } else {
        const num = Number(value);
        if (!Number.isInteger(num) || num < 1 || num > 999) {
          toast.error("Version must be between 1 and 999", { autoClose: 2000 });
          return;
        }
      }
    }

    if (name === "winningProbability" || name === "ourWorkshare") {
      if (value > 100) {
        toast.error("Winning Probability cann't be more than 100", {
          autoClose: 2000,
        });
        return;
      }
    }

    if (name === "startDate" || name === "endDate") {
      // console.log(`handleChange: Input ${name} changed to value: ${value}`);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatDateToISO = (date) => {
    if (!date) return new Date().toISOString();
    const d = new Date(date);
    if (isNaN(d.getTime())) return new Date().toISOString();

    // Ensure it's a valid ISO string ending in Z
    return d.toISOString();
  };

  const handleSave = async () => {
    if (!form.emplId) {
      toast.error("Employee ID is required");
      return;
    }
    // --- VALIDATION LOGIC ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // This regex accepts 10 digits, with or without dashes/dots/parentheses
    const phoneRegex = /^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

    // Check Work Email
    if (form.emailId && !emailRegex.test(form.emailId)) {
      toast.error("Invalid Work Email format");
      return;
    }

    // Check Personal Email
    if (form.homeEmailId && !emailRegex.test(form.homeEmailId)) {
      toast.error("Invalid Personal Email format");
      return;
    }

    // Check Emergency Contact 1 Phone
    if (form.c1Phone && !phoneRegex.test(form.c1Phone)) {
      toast.error("Invalid Phone format for Contact 1 (Expected 10 digits)");
      return;
    }

    // Check Emergency Contact 2 Phone
    if (form.c2Phone && !phoneRegex.test(form.c2Phone)) {
      toast.error("Invalid Phone format for Contact 2 (Expected 10 digits)");
      return;
    }

    setIsSaving(true);

    // Clean empty date strings to null
    const cleanForm = (form) => {
      const cleaned = { ...form };

      const dateFields = [
        "birthDt",
        "origHireDt",
        "adjHireDt",
        "termDt",
        "lastWorkedDay",
      ];

      dateFields.forEach((field) => {
        if (!cleaned[field]) {
          cleaned[field] = new Date().toISOString();
        } else {
          const d = new Date(cleaned[field]);
          cleaned[field] = isNaN(d)
            ? new Date().toISOString()
            : d.toISOString();
        }
      });

      return cleaned;
    };

    const cleanedForm = cleanForm(form);

    const payload = {
      emplId: form.emplId,
      lvPdCd: form.lvPdCd || "",
      taxbleEntityId: form.taxbleEntityId || "",
      ssnId: form.ssnId || "",
      origHireDt: formatDateToISO(form.origHireDt) || new Date().toISOString(),
      adjHireDt: formatDateToISO(form.adjHireDt) || new Date().toISOString(),
      termDt: formatDateToISO(form.termDt) || new Date().toISOString(),
      sEmplStatusCd: form.sEmplStatusCd || form.statusCode || "ACT",
      spvsrName: form.spvsrName || "",
      lastName: form.lastName || "",
      firstName: form.firstName || "",
      midName: form.midName || "",
      prefName: form.prefName || "",
      namePrfxCd: form.namePrfxCd || "",
      nameSfxCd: form.nameSfxCd || "",
      notes: form.notes || "",
      tsPdCd: form.tsPdCd || "",
      birthDt: formatDateToISO(form.birthDt) || new Date().toISOString(),
      cityName: form.cityName || form.city || "",
      countryCd: form.countryCd || form.country || "",
      lastFirstName: form.lastFirstName || "",
      ln1Adr: form.ln1Adr || form.addrLine1 || "",
      ln2Adr: form.ln2Adr || form.addrLine2 || "",
      ln3Adr: form.ln3Adr || form.addrLine3 || "",
      mailStateDc: form.mailStateDc || form.state || "",
      postalCd: form.postalCd || form.postalCode || "",
      modifiedBy: form.modifiedBy || "SystemUser",
      timeStamp: form.timeStamp || new Date().toISOString(),
      locatorCd: form.locatorCd || form.locatorCode || "",
      prirName: form.prirName || "",
      companyId: form.companyId || "",
      lastReviewDt: formatDateToISO(form.lastReviewDt) || null,
      nextReviewDt: formatDateToISO(form.nextReviewDt) || null,
      sexCd: form.sexCd || "",
      maritalCd: form.maritalCd || "",
      eligAutoPayFl: !!form.eligAutoPayFl,
      emailId: form.emailId || "",
      homeEmailId: form.homeEmailId || "",
      mgrEmplId: form.mgrEmplId || form.managerId || "",
      sRaceCd: form.sRaceCd || "",
      prServEmplId: form.prServEmplId || "",
      countyName: form.countyName || "",
      tsPdRegHrsNo: Number(form.tsPdRegHrsNo) || 0,
      payPdRegHrsNo: Number(form.payPdRegHrsNo) || 0,
      disabledFl: !!form.disabledFl,
      mosReviewNo: Number(form.mosReviewNo) || 0,
      contName1: form.contName1 || form.c1Name || "",
      contName2: form.contName2 || form.c2Name || "",
      contPhone1: form.contPhone1 || form.c1Phone || "",
      contPhone2: form.contPhone2 || form.c2Phone || "",
      contRel1: form.contRel1 || form.c1Rel || "",
      contRel2: form.contRel2 || form.c2Rel || "",
      unionEmplFl: !!form.unionEmplFl,
      visaTypeCd: form.visaTypeCd || "",
      vetStatusS: !!form.vetStatusS,
      vetStatusV: !!form.vetStatusV,
      vetStatusO: !!form.vetStatusO,
      vetStatusR: !!form.vetStatusR,
      essPinId: form.essPinId || "",
      pinUpdatedFl: !!form.pinUpdatedFl,
      sEssCosCd: form.sEssCosCd || "",
      rowversion: form.rowversion || "",
      vetReleaseDt: formatDateToISO(form.vetReleaseDt) || null,
      contractorFl: !!form.contractorFl,
      blindFl: !!form.blindFl,
      visaDt: formatDateToISO(form.visaDt) || null,
      vetStatusD: !!form.vetStatusD,
      vetStatusA: !!form.vetStatusA,
      activeDutyWartine: !!form.activeDutyWartine,
      timeEntryType: form.timeEntryType || "",
      badgeGroup: form.badgeGroup || "",
      badgeId: form.badgeId || "",
      loginId: form.loginId || "",
      sftFl: !!form.sftFl,
      mesFl: !!form.mesFl,
      clockFl: !!form.clockFl,
      plantId: form.plantId || "",
      emplSourceCd: form.emplSourceCd || "",
      srExportDt: formatDateToISO(form.srExportDt) || null,
      hrsmartExportDt: formatDateToISO(form.hrsmartExportDt) || null,
      vetStatusP: !!form.vetStatusP,
      birthCityName: form.birthCityName || "",
      birthMailStateDc: form.birthMailStateDc || "",
      birthCountryCd: form.birthCountryCd || "",
      userLoginId: form.userLoginId || "",
      emplAuthMthd: form.emplAuthMthd || "",
      essUserFl: !!form.essUserFl,
      lastDayDt: formatDateToISO(form.lastDayDt) || null,
      govwiniqLoginId: form.govwiniqLoginId || "",
      huaId: form.huaId || "",
      huaActvMapFl: !!form.huaActvMapFl,
      vetStatusNp: !!form.vetStatusNp,
      vetStatusDeclined: !!form.vetStatusDeclined,
      vetStatusRs: !!form.vetStatusRs,
    };

    const requestPayload = isUpdateMode ? payload : payload;

    try {
      if (isUpdateMode) {
        await api.put(
          `${backendUrl}/api/EmployeeMaster/${form.emplId}`,
          payload,
        );
        toast.success("Employee updated successfully!");
      } else {
        await api.post(`${backendUrl}/api/EmployeeMaster`, payload);
        toast.success("Employee created successfully!");
      }
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="p-1 py-2 space-y-3 text-[14px] sm:text-xs
             overflow-y-auto max-h-[85vh] 
             text-gray-800 font-sans mx-auto
             animate-premium-popup bg-white rounded-lg"
    >
      {viewMode === "form" && (
        <form className="space-y-2">
          {/* Header */}
          <div className="bg-white flex justify-between items-center pb-2 border-b-2 border-gray-300">
            <h2 className="text-[16px] font-medium text-gray-700">
              {isUpdateMode ? "Update Employee Master" : "Employee Master"}
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
              ["Employee ID:", "emplId"],
              ["Name:", "displayName", "text", true],
            ].map(([label, name, type = "text", isReadOnly = false]) => {
              const readOnlyField =
                name === "emplId" ? isUpdateMode : isReadOnly;

              return (
                <div key={name} className="label-input-div">
                  <label className="input-label text-[10px]">{label}</label>

                  <input
                    name={name}
                    value={
                      name === "displayName"
                        ? `${form.firstName || ""} ${form.lastName || ""}`.trim()
                        : form[name]
                    }
                    onChange={handleChange}
                    type={type}
                    readOnly={readOnlyField}
                    className={`input-style-master ${
                      readOnlyField ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              );
            })}
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
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-10 gap-y-4">
            {activeTab === "employeeInfo" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                {/* LEFT COLUMN: Identification & Names */}
                <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
                  {/* <FormField label="Employee ID">
        <input
          name="emplId"
          value={form.emplId}
          onChange={handleChange}
          readOnly={isUpdateMode}
                    className="outline-none w-full p-1"

        />
      </FormField> */}
                  <FormField label="Social Security ID">
                    <input
                      name="ssnId"
                      value={form.ssnId}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  <FormField label="Status">
                    <select
                      name="statusCode"
                      value={form.statusCode}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    >
                      <option value="ACT">Active</option>
                      <option value="IN">Inactive</option>
                    </select>
                  </FormField>
                  <FormField label="Last Name">
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  <FormField label="First Name">
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  <FormField label="Middle Name">
                    <input
                      name="midName"
                      value={form.midName}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  {/* <FormField label="Displayed Name">
        <input
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
                    className="outline-none w-full p-1"

        />
      </FormField> */}
                  <FormField label="Displayed Name">
                    <input
                      name="displayName"
                      // This combines First and Last name automatically
                      value={`${form.firstName || ""} ${form.lastName || ""}`.trim()}
                      // ReadOnly ensures the user cannot manually change this calculated field
                      readOnly
                      className="outline-none w-full bg-gray-200 cursor-not-allowed p-1"
                    />
                  </FormField>
                  <FormField label="Birth Date">
                    <input
                      type="date"
                      name="birthDt"
                      value={form.birthDt}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                </div>

                {/* MIDDLE COLUMN: Dates & Cycles */}
                <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
                  <FormField label="Gender">
                    <select
                      name="sexCd"
                      value={form.sexCd}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    >
                      <option value="">-None-</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="N">Non-Binary</option>
                      <option value="U">Unknown</option>
                    </select>
                  </FormField>
                  <FormField label="Marital Status">
                    <select
                      name="maritalCd"
                      value={form.maritalCd}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    >
                      <option value="">-None-</option>
                      <option value="M">Married</option>
                      <option value="S">Single</option>
                      <option value="D">Divorced</option>
                      <option value="W">Widowed</option>
                    </select>
                  </FormField>
                  <FormField label="Current Hire Date">
                    <input
                      type="date"
                      name="adjHireDt"
                      value={form.adjHireDt}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  <FormField label="Termination Date">
                    <input
                      type="date"
                      name="termDt"
                      value={form.termDt}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  {/* <FormField label="Last Day Worked">
        <input
          type="date"
          name="lastWorkedDay"
          value={form.lastWorkedDay}
          onChange={handleChange}
                    className="outline-none w-full p-1"

        />
      </FormField> */}
                  <FormField label="Past Hire Date">
                    <input
                      type="date"
                      name="origHireDt"
                      value={form.origHireDt}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  {/* <FormField label="Manager ID">
        <input
          name="managerId"
          value={form.managerId}
          onChange={handleChange}
                    className="outline-none w-full p-1"

        />
      </FormField> */}
                  {/* MAnager Dropdown */}

                  {/* comment beacuse vithiba not completed  will discuss with Shaba ji*/}
                  {/* need more clarity */}
                  {/* <FormField label="Taxable Entity*"><input name="taxEntity"           className="outline-none w-full p-1"
 /></FormField>
      <FormField label="Timesheet Cycle*"><input name="tsCycle"           className="outline-none w-full p-1"
 /></FormField>
      <FormField label="Leave Cycle"><input name="leaveCycle"           className="outline-none w-full p-1"
 /></FormField> */}
                </div>

                {/* RIGHT COLUMN: Codes & Flags */}
                <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
                  <FormField label="Manager ID">
                    <Select
                      options={emplOptions.map((opt) => ({
                        label: `${opt.emplId} - ${opt.lastName || ""} ${opt.firstName || ""}`,
                        value: opt.emplId,
                      }))}
                      className="text-[10px]"
                      styles={customStyles}
                      value={
                        form.managerId
                          ? acctOptions
                              .map((opt) => ({
                                label: `${opt.emplId} - ${opt.lastName || ""} ${opt.firstName || ""}`,
                                value: opt.emplId,
                              }))
                              .find((o) => o.value === form.emplId)
                          : null
                      }
                      onChange={(opt) =>
                        setForm((prev) => ({
                          ...prev,
                          managerId: opt ? opt.value : "",
                        }))
                      }
                      isSearchable
                      placeholder="Search ID..."
                    />
                  </FormField>
                  <FormField label="Locator Code">
                    <input
                      name="locatorCode"
                      value={form.locatorCode}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  {/* <FormField label="Administrator Name"><input name="adminName"           className="outline-none w-full p-1"
 /></FormField> */}
                  <FormField label="Preferred Name">
                    <input
                      name="prefName"
                      value={form.prefName}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  <FormField label="Prefix">
                    <input
                      name="prefix"
                      value={form.prefix}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  <FormField label="Suffix">
                    <input
                      name="suffix"
                      value={form.suffix}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>

                  {/* <div className="label-input-div">
                <label className="input-label text-[12px]">Eligible for Auto-Pay</label>
                <div className=" flex justify-start w-[60%]">
                  <input
                    name="eligibleAutoPay"
                    // checked={form.detail === "Y"} // Check if string is "Y"
                    // onChange={handleChange}
                    type="checkbox"
                  />
                </div>
              </div> */}
                  <div className="label-input-div">
                    <label className="input-label text-[12px]">
                      Create Vendor Record
                    </label>
                    <div className="flex justify-start w-[60%]">
                      <input
                        type="checkbox"
                        name="contractorFl"
                        checked={form.contractorFl}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="label-input-div">
                    <label className="input-label text-[12px]">
                      Eligible for Auto-Pay
                    </label>
                    <div className="flex justify-start w-[60%]">
                      <input
                        type="checkbox"
                        name="eligAutoPayFl"
                        checked={form.eligAutoPayFl}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <FormField label="Vendor">
                    <input
                      name="vendor"
                      className={`input-style ${!form.contractorFl ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      value={form.vendor}
                      onChange={handleChange}
                      disabled={!form.contractorFl}
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* hidinh hr data beacuase vithoba wants to go basic */}
            {/* {activeTab === "hrData" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
    <div className="space-y-3">
      <FormField label="Gender">
        <select name="gender" value={form.gender} onChange={handleChange}           className="outline-none w-full p-1"
>
          <option value="">-None-</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="N">Non-Binary</option>
          <option value="U">Unknown</option>
        </select>
      </FormField>
      <FormField label="Marital Status">
        <input name="maritalStatus" value={form.maritalStatus} onChange={handleChange}           className="outline-none w-full p-1"
 />
      </FormField>
      <FormField label="Race">
        <input name="race" value={form.race} onChange={handleChange}           className="outline-none w-full p-1"
 />
      </FormField>
      <FormField label="Visa Type">
        <input name="visaType" value={form.visaType} onChange={handleChange}           className="outline-none w-full p-1"
 />
      </FormField>
      <FormField label="Visa Exp Date">
        <input type="date" name="visaExpDate" value={form.visaExpDate} onChange={handleChange}           className="outline-none w-full p-1"
 />
      </FormField>
      <div className="pt-4 space-y-3">
        <FormField label="Birth City"><input name="city" value={form.birthCity} onChange={handleChange}           className="outline-none w-full p-1"
 /></FormField>
        <FormField label="Birth State"><input name="state" value={form.birthState} onChange={handleChange}           className="outline-none w-full p-1"
 /></FormField>
        <FormField label="Birth Country"><input name="country" value={form.birthCountry} onChange={handleChange}           className="outline-none w-full p-1"
 /></FormField>
      </div>
    </div>

    <div className="space-y-4 border p-4 rounded bg-gray-50">
      <h3 className="font-bold text-gray-700">VETS-4212 Protected Veteran Status</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2"><input type="checkbox" name="isVeteranDisabled" checked={form.isVeteranDisabled} onChange={handleChange} /> Disabled Veteran</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isActiveDuty" checked={form.isActiveDuty} onChange={handleChange} /> Active Duty Wartime...</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isServiceMedal" checked={form.isServiceMedal} onChange={handleChange} /> Armed Forces Service Medal Veteran</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isRecentlySeparated" checked={form.isRecentlySeparated} onChange={handleChange} /> Recently Separated Veteran</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isProtectedVeteran" checked={form.isProtectedVeteran} onChange={handleChange} /> Protected Veteran (Declined to Self-Identify)</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="notProtectedVeteran" checked={form.notProtectedVeteran} onChange={handleChange} /> Not a Protected Veteran</label>
      </div>
      <FormField label="Discharge Date">
        <input type="date" name="dischargeDate" value={form.dischargeDate} onChange={handleChange}           className="outline-none w-full p-1"
 />
      </FormField>
    </div>
  </div>
)} */}

            {activeTab === "address" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mailing Address Section */}
                  <fieldset className="fieldset-master">
                    <legend className="legend-master">Mailing Address</legend>

                    {/* Added grid layout with a gap for spacing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {/* Left Column */}
                      <div className="space-y-3">
                        <FormField label="Line 1">
                          <textarea
                            name="addrLine1"
                            value={form.addrLine1}
                            rows={2}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </FormField>
                        <FormField label="Line 2">
                          <textarea
                            name="addrLine2"
                            value={form.addrLine2}
                            rows={2}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </FormField>
                        <FormField label="Line 3">
                          <textarea
                            name="addrLine3"
                            value={form.addrLine3}
                            rows={2}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </FormField>
                        <FormField label="City">
                          <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </FormField>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        <FormField label="State/Province">
                          <input
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </FormField>
                        <FormField label="County">
                          <input
                            name="countyName"
                            value={form.countyName}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </FormField>
                        <FormField label="Postal Code">
                          <input
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </FormField>
                        <FormField label="Country">
                          <input
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </FormField>
                      </div>
                    </div>
                  </fieldset>
                  {/* Emergency Contact Section */}
                  <fieldset className="fieldset-master">
                    <legend className="legend-master">Emergency Contact</legend>
                    <div className="space-y-3">
                      <FormField label="Contact 1 Name">
                        <input
                          name="c1Name"
                          value={form.c1Name}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <FormField label="Contact 1 Phone">
                        <input
                          name="c1Phone"
                          value={form.c1Phone}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <FormField label="Contact 1 Relationship">
                        <input
                          name="c1Rel"
                          value={form.c1Rel}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <div className="border-t border-gray-300 my-4" />
                      <FormField label="Contact 2 Name">
                        <input
                          name="c2Name"
                          value={form.c2Name}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <FormField label="Contact 2 Phone">
                        <input
                          name="c2Phone"
                          value={form.c2Phone}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <FormField label="Contact 2 Relationship">
                        <input
                          name="c2Rel"
                          value={form.c2Rel}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                    </div>
                  </fieldset>
                </div>

                {/* Email Addresses Section */}
                <fieldset className="fieldset-master">
                  <legend className="legend-master">Email Addresses</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Work">
                      <input
                        name="emailId"
                        value={form.emailId}
                        onChange={handleChange}
                        className="outline-none w-full p-1"
                      />
                    </FormField>
                    <FormField label="Personal">
                      <input
                        name="homeEmailId"
                        value={form.homeEmailId}
                        onChange={handleChange}
                        className="outline-none w-full p-1"
                      />
                    </FormField>
                  </div>
                </fieldset>
              </div>
            )}

            {activeTab === "timesheet" && (
              <div className="space-y-3 border border-gray-200 p-2 rounded bg-gray-50">
                {/* Timesheet Defaults Fields */}

                {/* Account Dropdown */}
                <FormField label="Account">
                  <Select
                    options={acctOptions.map((opt) => ({
                      label: `${opt.acctId} - ${opt.acctName || ""}`,
                      value: opt.acctId,
                    }))}
                    className="text-[10px]"
                    styles={customStyles}
                    value={
                      form.acctId
                        ? acctOptions
                            .map((opt) => ({
                              label: `${opt.acctId} - ${opt.acctName || ""}`,
                              value: opt.acctId,
                            }))
                            .find((o) => o.value === form.acctId)
                        : null
                    }
                    onChange={(opt) =>
                      setForm((prev) => ({
                        ...prev,
                        acctId: opt ? opt.value : "",
                      }))
                    }
                    isSearchable
                    placeholder="Search Account..."
                  />
                </FormField>

                {/* Organization Dropdown */}
                <FormField label="Organization">
                  <Select
                    options={orgOptions.map((opt) => ({
                      label: `${opt.orgId} - ${opt.orgName || ""}`,
                      value: opt.orgId,
                    }))}
                    className="text-[10px]"
                    styles={customStyles}
                    value={
                      form.orgId
                        ? orgOptions
                            .map((opt) => ({
                              label: `${opt.orgId} - ${opt.orgName || ""}`,
                              value: opt.orgId,
                            }))
                            .find((o) => o.value === form.orgId)
                        : null
                    }
                    onChange={(opt) =>
                      setForm((prev) => ({
                        ...prev,
                        orgId: opt ? opt.value : "",
                      }))
                    }
                    isSearchable
                    placeholder="Search Organization..."
                  />
                </FormField>

                {/* GLC (General Labor Category) Dropdown */}
                <FormField label="GLC">
                  <Select
                    options={glcOptions.map((opt) => ({
                      label: `${opt.plcCode} - ${opt.description || ""}`,
                      value: opt.plcCode,
                    }))}
                    className="text-[10px]"
                    styles={customStyles}
                    value={
                      form.genlLabCatCd
                        ? glcOptions
                            .map((opt) => ({
                              label: `${opt.plcCode} - ${opt.description || ""}`,
                              value: opt.plcCode,
                            }))
                            .find((o) => o.value === form.genlLabCatCd)
                        : null
                    }
                    onChange={(opt) =>
                      setForm((prev) => ({
                        ...prev,
                        genlLabCatCd: opt ? opt.value : "",
                      }))
                    }
                    isSearchable
                    placeholder="Search GLC..."
                  />
                </FormField>

                {/* <FormField label="Account">
      <input name="acctId" value={form.acctId} onChange={handleChange}           className="outline-none w-full p-1"
 />
    </FormField>
    <FormField label="Organization">
      <input name="orgId" value={form.orgId} onChange={handleChange}           className="outline-none w-full p-1"
 />
    </FormField> */}
                {/* <FormField label="Project">
      <input name="timesheetProject" value={form.timesheetProject} onChange={handleChange}           className="outline-none w-full p-1"
 />
    </FormField> */}
                {/* <FormField label="GLC">
      <input name="genlLabCatCd" value={form.genlLabCatCd} onChange={handleChange}           className="outline-none w-full p-1"
 />
    </FormField> */}
                <FormField label="Pay Type">
                  <input
                    name="regPayType"
                    value={form.regPayType}
                    onChange={handleChange}
                    className="outline-none w-full p-1"
                  />
                </FormField>
                <FormField label="Labor Location">
                  <input
                    name="labLocCd"
                    value={form.labLocCd}
                    onChange={handleChange}
                    className="outline-none w-full p-1"
                  />
                </FormField>
                <FormField label="Workers' Comp">
                  <input
                    name="workCompCd"
                    value={form.workCompCd}
                    onChange={handleChange}
                    className="outline-none w-full p-1"
                  />
                </FormField>
                <FormField label="REF NO 1">
                  <input
                    name="ref1Id"
                    value={form.ref1Id}
                    onChange={handleChange}
                    className="outline-none w-full p-1"
                  />
                </FormField>
                <FormField label="REF NO 2">
                  <input
                    name="ref2Id"
                    value={form.ref2Id}
                    onChange={handleChange}
                    className="outline-none w-full p-1"
                  />
                </FormField>
              </div>
            )}

            {/* comment beacause vithoba kehta h abhi nhi karte h */}
            {activeTab === "product" && (
              <div className="space-y-3">
                <div className="space-y-3">
                  <FormField label="Payroll Service ID">
                    <input
                      name="payrollServiceId"
                      value={form.payrollServiceId}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                  <FormField label="GovWin IQ ID">
                    <input
                      name="govWinId"
                      value={form.govWinId}
                      onChange={handleChange}
                      className="outline-none w-full p-1"
                    />
                  </FormField>
                </div>

                <fieldset className="border p-4 rounded mt-4">
                  <legend className="px-2 font-semibold text-gray-700">
                    Project Manufacturing
                  </legend>
                  <div className="space-y-3">
                    <FormField label="Plant">
                      <input
                        name="plant"
                        value={form.plant}
                        onChange={handleChange}
                        className="outline-none w-full p-1"
                      />
                    </FormField>
                  </div>
                </fieldset>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-4">
                <div className="label-input-div">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={10}
                    className="input-style w-full min-h-[200px] p-2"
                    placeholder="Enter additional notes here..."
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeeMasterForm;
