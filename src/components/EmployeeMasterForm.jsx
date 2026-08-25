import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import { backendUrl } from "./config";

const FormField = ({ label, children, fieldClassName = "" }) => {
  return (
    <div className="label-input-div">
      <label className="input-label text-[10px]">{label}:</label>

      <div
        className={`${
          label === "Manager ID" ||
          label === "Account" ||
          label === "Organization" ||
          label === "GLC"
            ? ""
            : "border"
        } outline-none border-gray-300 rounded text-[10px] bg-white w-[75%] ${fieldClassName}`}
      >
        {children}
      </div>
    </div>
  );
};

const AddressFormField = ({ label, children, width = "w-[180px]" }) => (
  <div className="flex items-center w-full gap-3">
    <label className="text-[10px] w-[80px] flex-shrink-0">{label}:</label>

    <div className={`${width} border border-gray-300 rounded bg-white`}>
      {children}
    </div>
  </div>
);

const SalaryFormField = ({ label, children, width = "w-[180px]" }) => (
  <div className="flex items-center w-full gap-3">
    <label className="text-[10px] whitespace-nowrap w-[150px] flex-shrink-0">
      {label}:
    </label>

    <div className={`${width} border border-gray-300 rounded bg-white`}>
      {children}
    </div>
  </div>
);

const TimesheetField = ({ label, children }) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="w-[90px] flex-shrink-0 text-[10px]">{label}:</label>

      <div className="w-[300px]">{children}</div>
    </div>
  );
};

const LookupField = ({
  label,
  name,
  value,
  onChange,
  onLookup,
  placeholder = "",
}) => (
  <div className="label-input-div">
    <label className="input-label text-[10px]">{label}:</label>

    <div className="flex w-[75%]">
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="outline-none w-full p-1 border border-gray-300 rounded-l text-[10px] bg-white"
      />

      <button
        type="button"
        onClick={onLookup}
        className="w-7 flex items-center justify-center border border-l-0 border-gray-300 rounded-r bg-white hover:bg-gray-100"
        title={`Lookup ${label}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
      </button>
    </div>
  </div>
);

const YesNoField = ({ label, name, value, onChange, className = "" }) => (
  <div className={`flex items-center ${className}`}>
    <span className="w-[120px] flex-shrink-0">{label}</span>
    <label className="flex w-[70px] items-center gap-1">
      <input
        type="radio"
        name={`${name}-choice`}
        checked={value === true}
        onChange={() => onChange(name, true)}
      />
      Yes
    </label>
    <label className="flex w-[70px] items-center gap-1">
      <input
        type="radio"
        name={`${name}-choice`}
        checked={value !== true}
        onChange={() => onChange(name, false)}
      />
      No
    </label>
  </div>
);

const EmployeeMasterForm = forwardRef(
  ({ mode, selectedEmployee, onClose, onSaveSuccess, onDirtyChange }, ref) => {
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
      activeDutyWartine: false,
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

      // --- Salary / Labor Info ---
      effectDt: "",
      endDt: "",
      sHrlySalCd: "",
      hrlyAmt: 0,
      salAmt: 0,
      annlAmt: 0,
      exmptFl: "",
      sEmplTypeCd: "",
      titleDesc: "",
      workStateCd: "",
      stdEstHrs: 0,
      stdEffectAmt: 0,
      labGrpType: "",
      pctIncrRt: 0,
      homeRef1Id: "",
      homeRef2Id: "",
      reasonDesc: "",
      detlJobCd: "",
      persActRsnCd: "",
      meritPctRt: 0,
      promoPctRt: 0,
      compPlanCd: "",
      salGradeCd: "",
      sStepNo: "",
      reviewFormId: "",
      overallRt: "",
      mgrEmplId1: "",
      secOrgId: "",
      comments: "",
      emplClassCd: "",
      workYrHrsNo: 0,
      billLabCatCd: "",
      persActRsnCd2: "",
      persActRsnCd3: "",
      reasonDesc2: "",
      reasonDesc3: "",
      corpOfcrFl: false,
      seasonEmplFl: false,
      hireDtFl: false,
      termDtFl: false,
      affPlanCd: "",
      jobGroupCd: "",
      aaComments: "",
      tcTsSchedCd: "",
      tcWorkSchedCd: "",
      rowversion1: "",
      hrOrgId: "",
      variableHrsFl: false,
      dfltRtGrpId: "",
      trnCrncyCd: "",
      spvsrEmplId: "",
      reqNo: "",
      caRemoteWorker: "",

      // Tax Details - Federal
      taxPayCycle: "",
      taxServiceGroupId: "",
      retirementPlanCovered: false,
      nonresidentAlien: false,
      w4RevisionYear: "2020",
      federalFilingStatus: "Single",
      federalAllowances: 0,
      multipleJobsFl: false,
      qualifyingChildrenAmt: 0,
      otherDependentsAmt: 0,
      otherTaxCreditAmt: 0,
      otherIncomeAmt: 0,
      deductionsAmt: 0,
      extraWithholdingAmt: 0,
      overrideAmount: "",
      overrideWithholdingPct: "",
      disableEssFederalW4Fl: false,
      futaFl: true,
      medicareFl: true,
      socialSecurityFl: true,

      notes: "",
    });
    const [viewMode, setViewMode] = useState("form"); // Always start with form view
    const [isUpdateMode, setIsUpdateMode] = useState(Boolean(selectedEmployee)); // New state to manage update mode
    const [isSaving, setIsSaving] = useState(false); // State to track if saving is in progress
    const [isDirty, setIsDirty] = useState(false);
    const [activeTab, setActiveTab] = useState("employeeInfo");
    const [salarySection, setSalarySection] = useState("salary");

    const [orgOptions, setOrgOptions] = useState([]);
    const [acctOptions, setAcctOptions] = useState([]);
    const [glcOptions, setGlcOptions] = useState([]);
    const [emplOptions, setEmplOptions] = useState([]);
    const [taxSection, setTaxSection] = useState("federal");

    const mainTabs = [
      { id: "employeeInfo", label: "Employee Info" },
      { id: "address", label: "Address" },
      { id: "contact", label: "Contact" },
      { id: "timesheet", label: "Timesheet Defaults" },
    ];

    const tabs = [
      { id: "employeeInfo", label: "Employee Info" },
      { id: "hrData", label: "HR Data" },
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
        taxPayCycle: selectedEmployee.taxPayCycle ?? "",
        taxServiceGroupId: selectedEmployee.taxServiceGroupId ?? "",
        retirementPlanCovered: selectedEmployee.retirementPlanCovered ?? false,
        nonresidentAlien: selectedEmployee.nonresidentAlien ?? false,
        w4RevisionYear: selectedEmployee.w4RevisionYear ?? "2020",
        federalFilingStatus: selectedEmployee.federalFilingStatus ?? "Single",
        federalAllowances: selectedEmployee.federalAllowances ?? 0,
        multipleJobsFl: selectedEmployee.multipleJobsFl ?? false,
        qualifyingChildrenAmt: selectedEmployee.qualifyingChildrenAmt ?? 0,
        otherDependentsAmt: selectedEmployee.otherDependentsAmt ?? 0,
        otherTaxCreditAmt: selectedEmployee.otherTaxCreditAmt ?? 0,
        otherIncomeAmt: selectedEmployee.otherIncomeAmt ?? 0,
        deductionsAmt: selectedEmployee.deductionsAmt ?? 0,
        extraWithholdingAmt: selectedEmployee.extraWithholdingAmt ?? 0,
        overrideAmount: selectedEmployee.overrideAmount ?? "",
        overrideWithholdingPct: selectedEmployee.overrideWithholdingPct ?? "",
        disableEssFederalW4Fl: selectedEmployee.disableEssFederalW4Fl ?? false,
        futaFl: selectedEmployee.futaFl ?? true,
        medicareFl: selectedEmployee.medicareFl ?? true,
        socialSecurityFl: selectedEmployee.socialSecurityFl ?? true,
      });
    }, [selectedEmployee]);

    // Load Salary / Labor Information for the selected employee.
    // The GET endpoint is tried without an effect date first; if the backend
    // requires the effect date in the route, the second request is used.
    useEffect(() => {
      const fetchLabInfo = async () => {
        if (!selectedEmployee?.emplId) return;

        try {
          let response;

          try {
            response = await api.get(
              `${backendUrl}/api/EmployeeMaster/${encodeURIComponent(
                selectedEmployee.emplId,
              )}/labinfo`,
            );
          } catch (firstError) {
            const effectDate =
              selectedEmployee.effectDt || selectedEmployee.labInfo?.effectDt;

            if (!effectDate) throw firstError;

            response = await api.get(
              `${backendUrl}/api/EmployeeMaster/${encodeURIComponent(
                selectedEmployee.emplId,
              )}/labinfo/${encodeURIComponent(effectDate)}`,
            );
          }

          const labInfo = Array.isArray(response.data)
            ? response.data[0]
            : response.data;

          if (!labInfo) return;

          setForm((prev) => ({
            ...prev,
            effectDt: formatForInput(labInfo.effectDt),
            endDt: formatForInput(labInfo.endDt),
            sHrlySalCd: labInfo.sHrlySalCd ?? "",
            hrlyAmt: labInfo.hrlyAmt ?? 0,
            salAmt: labInfo.salAmt ?? 0,
            annlAmt: labInfo.annlAmt ?? 0,
            exmptFl: labInfo.exmptFl ?? "",
            sEmplTypeCd: labInfo.sEmplTypeCd ?? "",
            orgId: labInfo.orgId ?? prev.orgId ?? "",
            titleDesc: labInfo.titleDesc ?? "",
            workStateCd: labInfo.workStateCd ?? "",
            stdEstHrs: labInfo.stdEstHrs ?? 0,
            stdEffectAmt: labInfo.stdEffectAmt ?? 0,
            labGrpType: labInfo.labGrpType ?? "",
            genlLabCatCd: labInfo.genlLabCatCd ?? prev.genlLabCatCd ?? "",
            pctIncrRt: labInfo.pctIncrRt ?? 0,
            homeRef1Id: labInfo.homeRef1Id ?? "",
            homeRef2Id: labInfo.homeRef2Id ?? "",
            reasonDesc: labInfo.reasonDesc ?? "",
            detlJobCd: labInfo.detlJobCd ?? "",
            persActRsnCd: labInfo.persActRsnCd ?? "",
            labLocCd: labInfo.labLocCd ?? prev.labLocCd ?? "",
            meritPctRt: labInfo.meritPctRt ?? 0,
            promoPctRt: labInfo.promoPctRt ?? 0,
            compPlanCd: labInfo.compPlanCd ?? "",
            salGradeCd: labInfo.salGradeCd ?? "",
            sStepNo: labInfo.sStepNo ?? "",
            reviewFormId: labInfo.reviewFormId ?? "",
            overallRt: labInfo.overallRt ?? "",
            mgrEmplId1: labInfo.mgrEmplId1 ?? "",
            secOrgId: labInfo.secOrgId ?? "",
            comments: labInfo.comments ?? "",
            emplClassCd: labInfo.emplClassCd ?? "",
            workYrHrsNo: labInfo.workYrHrsNo ?? 0,
            billLabCatCd: labInfo.billLabCatCd ?? "",
            persActRsnCd2: labInfo.persActRsnCd2 ?? "",
            persActRsnCd3: labInfo.persActRsnCd3 ?? "",
            reasonDesc2: labInfo.reasonDesc2 ?? "",
            reasonDesc3: labInfo.reasonDesc3 ?? "",
            corpOfcrFl: !!labInfo.corpOfcrFl,
            seasonEmplFl: !!labInfo.seasonEmplFl,
            hireDtFl: !!labInfo.hireDtFl,
            termDtFl: !!labInfo.termDtFl,
            affPlanCd: labInfo.affPlanCd ?? "",
            jobGroupCd: labInfo.jobGroupCd ?? "",
            aaComments: labInfo.aaComments ?? "",
            tcTsSchedCd: labInfo.tcTsSchedCd ?? "",
            tcWorkSchedCd: labInfo.tcWorkSchedCd ?? "",
            rowversion1: labInfo.rowversion1 ?? "",
            hrOrgId: labInfo.hrOrgId ?? "",
            variableHrsFl: !!labInfo.variableHrsFl,
            dfltRtGrpId: labInfo.dfltRtGrpId ?? "",
            trnCrncyCd: labInfo.trnCrncyCd ?? "",
            spvsrEmplId: labInfo.spvsrEmplId ?? "",
            reqNo: labInfo.reqNo ?? "",
            caRemoteWorker: labInfo.caRemoteWorker ?? "",
          }));
        } catch (error) {
          // A missing lab-info record is valid for a new employee.
          if (error.response?.status !== 404) {
            console.error(
              "Failed to fetch employee salary/labor information",
              error,
            );
          }
        }
      };

      fetchLabInfo();
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
            toast.error("Version must be between 1 and 999", {
              autoClose: 2000,
            });
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
      setIsDirty(true);
      onDirtyChange?.(true);
    };

    const setBooleanField = (name, value) => {
      setForm((prev) => ({ ...prev, [name]: value }));
      setIsDirty(true);
      onDirtyChange?.(true);
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
      const phoneRegex =
        /^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

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
        origHireDt:
          formatDateToISO(form.origHireDt) || new Date().toISOString(),
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

      const labInfoPayload = {
        emplId: form.emplId,
        effectDt: formatDateToISO(form.effectDt),
        sHrlySalCd: form.sHrlySalCd || "",
        hrlyAmt: Number(form.hrlyAmt) || 0,
        salAmt: Number(form.salAmt) || 0,
        annlAmt: Number(form.annlAmt) || 0,
        exmptFl: form.exmptFl || "",
        sEmplTypeCd: form.sEmplTypeCd || "",
        orgId: form.orgId || "",
        titleDesc: form.titleDesc || "",
        workStateCd: form.workStateCd || "",
        stdEstHrs: Number(form.stdEstHrs) || 0,
        stdEffectAmt: Number(form.stdEffectAmt) || 0,
        labGrpType: form.labGrpType || "",
        genlLabCatCd: form.genlLabCatCd || "",
        modifiedBy1: form.modifiedBy || "SystemUser",
        timeStamp1: new Date().toISOString(),
        pctIncrRt: Number(form.pctIncrRt) || 0,
        homeRef1Id: form.homeRef1Id || "",
        homeRef2Id: form.homeRef2Id || "",
        reasonDesc: form.reasonDesc || "",
        detlJobCd: form.detlJobCd || "",
        persActRsnCd: form.persActRsnCd || "",
        labLocCd: form.labLocCd || "",
        meritPctRt: Number(form.meritPctRt) || 0,
        promoPctRt: Number(form.promoPctRt) || 0,
        compPlanCd: form.compPlanCd || "",
        salGradeCd: form.salGradeCd || "",
        sStepNo: form.sStepNo || "",
        reviewFormId: form.reviewFormId || "",
        overallRt: form.overallRt || "",
        mgrEmplId1: form.mgrEmplId1 || "",
        endDt: formatDateToISO(form.endDt),
        secOrgId: form.secOrgId || "",
        comments: form.comments || "",
        emplClassCd: form.emplClassCd || "",
        workYrHrsNo: Number(form.workYrHrsNo) || 0,
        billLabCatCd: form.billLabCatCd || "",
        persActRsnCd2: form.persActRsnCd2 || "",
        persActRsnCd3: form.persActRsnCd3 || "",
        reasonDesc2: form.reasonDesc2 || "",
        reasonDesc3: form.reasonDesc3 || "",
        corpOfcrFl: !!form.corpOfcrFl,
        seasonEmplFl: !!form.seasonEmplFl,
        hireDtFl: !!form.hireDtFl,
        termDtFl: !!form.termDtFl,
        affPlanCd: form.affPlanCd || "",
        jobGroupCd: form.jobGroupCd || "",
        aaComments: form.aaComments || "",
        tcTsSchedCd: form.tcTsSchedCd || "",
        tcWorkSchedCd: form.tcWorkSchedCd || "",
        rowversion1: form.rowversion1 || "",
        hrOrgId: form.hrOrgId || "",
        variableHrsFl: !!form.variableHrsFl,
        dfltRtGrpId: form.dfltRtGrpId || "",
        trnCrncyCd: form.trnCrncyCd || "",
        spvsrEmplId: form.spvsrEmplId || "",
        reqNo: form.reqNo || "",
        caRemoteWorker: form.caRemoteWorker || "",
      };

      try {
        if (isUpdateMode) {
          await api.put(
            `${backendUrl}/api/EmployeeMaster/${form.emplId}`,
            payload,
          );
        } else {
          await api.post(`${backendUrl}/api/EmployeeMaster`, payload);
        }

        // Save Salary / Labor Information through the existing labinfo endpoint.
        const effectDateForRoute = encodeURIComponent(labInfoPayload.effectDt);
        await api.put(
          `${backendUrl}/api/EmployeeMaster/${encodeURIComponent(
            form.emplId,
          )}/labinfo/${effectDateForRoute}`,
          labInfoPayload,
        );

        toast.success(
          isUpdateMode
            ? "Employee updated successfully!"
            : "Employee created successfully!",
        );
        setIsDirty(false);
        onDirtyChange?.(false);
        if (onSaveSuccess) onSaveSuccess();
        onClose?.();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to save.");
      } finally {
        setIsSaving(false);
      }
    };

    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    return (
      <div
        className="w-full p-1 py-2 space-y-3 text-[14px] sm:text-xs
             overflow-y-auto text-gray-800 font-sans"
      >
        <form className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-center gap-x-16 gap-y-2 rounded border border-gray-300 bg-gray-50 px-6 py-2.5">
            {[
              ["Employee *", "emplId"],
              ["Name:", "displayName", "text", true],
            ].map(([label, name, type = "text", isReadOnly = false]) => {
              const readOnlyField =
                name === "emplId" ? isUpdateMode : isReadOnly;

              return (
                <div key={name} className="label-input-div employee-form-field">
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
            <label className="flex items-center gap-2 whitespace-nowrap text-[12px] text-gray-600">
              <input
                type="checkbox"
                name="contractorFl"
                checked={!!form.contractorFl}
                onChange={handleChange}
                className="h-4 w-4 rounded border-[#9eb3cc]"
              />
              Contractor
            </label>
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
                      onChange={(opt) => {
                        setForm((prev) => ({
                          ...prev,
                          managerId: opt ? opt.value : "",
                        }));
                        setIsDirty(true);
                        onDirtyChange?.(true);
                      }}
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
                      className={`outline-none w-full p-1 ${
                        !form.contractorFl
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
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

            {activeTab === "salaryInfo" && (
              <div className="space-y-3">
                <div className="border-b border-gray-400">
                  <button
                    type="button"
                    onClick={() => setSalarySection("salary")}
                    className={`border-b-4 px-3 pb-1 text-xs font-semibold ${salarySection === "salary" ? "border-[#4387dd] text-[#4387dd]" : "border-transparent text-gray-600"}`}
                  >
                    Salary Information
                  </button>
                  <button
                    type="button"
                    onClick={() => setSalarySection("hr")}
                    className={`border-b-4 px-3 pb-1 text-xs font-semibold ${salarySection === "hr" ? "border-[#4387dd] text-[#4387dd]" : "border-transparent text-gray-600"}`}
                  >
                    HR Information
                  </button>
                </div>

                {salarySection === "salary" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <fieldset className="border border-gray-200 p-2 rounded bg-gray-50">
                      <legend className="px-2 font-semibold text-gray-700 text-xs">
                        Salary Details
                      </legend>
                      <div className="space-y-1">
                        <SalaryFormField label="Effective Date" compact>
                          <input
                            type="date"
                            name="effectDt"
                            value={form.effectDt}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="End Date" compact>
                          <input
                            type="date"
                            name="endDt"
                            value={form.endDt}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Employee Type" compact>
                          <select
                            name="sEmplTypeCd"
                            value={form.sEmplTypeCd}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          >
                            <option value="">-None-</option>
                            <option value="PT">Part Time</option>
                            <option value="R">Regular</option>
                            <option value="T">Temporary</option>
                          </select>
                        </SalaryFormField>
                        <SalaryFormField label="Rate Type" width="w-[300px]">
                          <select
                            name="sHrlySalCd"
                            value={form.sHrlySalCd}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          >
                            <option value="">-None-</option>
                            <option value="HOURLY">Hourly</option>
                            <option value="SAL_FIXED">
                              Salaried Fixed Hours
                            </option>
                            <option value="SAL_FLUCT">
                              Salaried Fluctuating Hours
                            </option>
                          </select>
                        </SalaryFormField>
                        <SalaryFormField label="Hourly Amount" compact>
                          <input
                            type="number"
                            step="0.01"
                            name="hrlyAmt"
                            value={form.hrlyAmt}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Payroll Salary Amount" compact>
                          <input
                            type="number"
                            step="0.01"
                            name="salAmt"
                            value={form.salAmt}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Annual Amount" compact>
                          <input
                            type="number"
                            step="0.01"
                            name="annlAmt"
                            value={form.annlAmt}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Percent Of Increase" compact>
                          <input
                            type="number"
                            step="0.01"
                            name="pctIncrRt"
                            value={form.pctIncrRt}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Estimated Annual Hours" compact>
                          <input
                            type="number"
                            step="0.01"
                            name="stdEstHrs"
                            value={form.stdEstHrs}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Standard Hourly Rate" compact>
                          <input
                            type="number"
                            step="0.01"
                            name="stdEffectAmt"
                            value={form.stdEffectAmt}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Work Hours In Year" compact>
                          <input
                            type="number"
                            step="0.01"
                            name="workYrHrsNo"
                            value={form.workYrHrsNo}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Employee Class">
                          <input
                            name="emplClassCd"
                            value={form.emplClassCd}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <div className="label-input-div justify-start">
                          <label className="input-label text-[10px] mr-10">
                            FLSA Classification:
                          </label>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1 text-[10px] ml-10">
                              <input
                                type="radio"
                                name="exmptFl"
                                value="Y"
                                checked={form.exmptFl === "Y"}
                                onChange={handleChange}
                              />
                              Exempt
                            </label>

                            <label className="flex items-center gap-1 text-[10px]">
                              <input
                                type="radio"
                                name="exmptFl"
                                value="N"
                                checked={form.exmptFl === "N"}
                                onChange={handleChange}
                              />
                              Non-Exempt
                            </label>
                          </div>
                        </div>
                        <SalaryFormField
                          label="Detail Job Title"
                          width="w-[300px]"
                        >
                          <input
                            name="detlJobCd"
                            value={form.detlJobCd}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Title Description">
                          <input
                            name="titleDesc"
                            value={form.titleDesc}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Manager" width="w-[300px]">
                          <input
                            name="mgrEmplId1"
                            value={form.mgrEmplId1}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Supervisor">
                          <input
                            name="spvsrEmplId"
                            value={form.spvsrEmplId}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                      </div>
                    </fieldset>

                    <fieldset className="border border-gray-200 p-3 rounded bg-gray-50">
                      <legend className="px-2 font-semibold text-gray-700 text-xs">
                        Labor & Organization
                      </legend>
                      <div className="space-y-2">
                        <SalaryFormField label="Labor Group" compact>
                          <input
                            name="labGrpType"
                            value={form.labGrpType}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField
                          label="Labor Location"
                          width="w-[300px]"
                        >
                          <input
                            name="labLocCd"
                            value={form.labLocCd}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="GLC" compact>
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
                            onChange={(opt) => {
                              setForm((prev) => ({
                                ...prev,
                                genlLabCatCd: opt ? opt.value : "",
                              }));
                              setIsDirty(true);
                              onDirtyChange?.(true);
                            }}
                            isSearchable
                            placeholder="Search GLC..."
                          />
                        </SalaryFormField>
                        <SalaryFormField
                          label="Overtime State"
                          width="w-[300px]"
                        >
                          <input
                            name="workStateCd"
                            value={form.workStateCd}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="Home Organization">
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
                            onChange={(opt) => {
                              setForm((prev) => ({
                                ...prev,
                                orgId: opt ? opt.value : "",
                              }));
                              setIsDirty(true);
                              onDirtyChange?.(true);
                            }}
                            isSearchable
                            placeholder="Search Organization..."
                          />
                        </SalaryFormField>

                        <SalaryFormField label="Security Organization">
                          <input
                            name="secOrgId"
                            value={form.secOrgId}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="HR Organization">
                          <input
                            name="hrOrgId"
                            value={form.hrOrgId}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        {/* <FormField label="Personnel Action 1">
                      <input name="persActRsnCd" value={form.persActRsnCd} onChange={handleChange} className="outline-none w-full p-1" />
                    </FormField>
                    <FormField label="Personnel Action 2">
                      <input name="persActRsnCd2" value={form.persActRsnCd2} onChange={handleChange} className="outline-none w-full p-1" />
                    </FormField>
                    <FormField label="Personnel Action 3">
                      <input name="persActRsnCd3" value={form.persActRsnCd3} onChange={handleChange} className="outline-none w-full p-1" />
                    </FormField> */}
                        <SalaryFormField label="Time Collection" compact>
                          <input
                            name="tcTsSchedCd"
                            value={form.tcTsSchedCd}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField
                          label="Work Schedule"
                          width="w-[300px]"
                        >
                          <input
                            name="tcWorkSchedCd"
                            value={form.tcWorkSchedCd}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="REF NO 1" compact>
                          <input
                            name="homeRef1Id"
                            value={form.homeRef1Id}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <SalaryFormField label="REF NO 2" compact>
                          <input
                            name="homeRef2Id"
                            value={form.homeRef2Id}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </SalaryFormField>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <label className="flex items-center gap-2 text-[10px]">
                            <input
                              type="checkbox"
                              name="corpOfcrFl"
                              checked={form.corpOfcrFl}
                              onChange={handleChange}
                            />{" "}
                            Corporate Officer
                          </label>
                          <label className="flex items-center gap-2 text-[10px]">
                            <input
                              type="checkbox"
                              name="seasonEmplFl"
                              checked={form.seasonEmplFl}
                              onChange={handleChange}
                            />{" "}
                            Seasonal Employee
                          </label>
                          <label className="flex items-center gap-2 text-[10px]">
                            <input
                              type="checkbox"
                              name="variableHrsFl"
                              checked={form.variableHrsFl}
                              onChange={handleChange}
                            />{" "}
                            Variable Hours
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>
            )}

            {activeTab === "hrData" && (
              <div className="grid grid-cols-1 items-start gap-8 rounded border border-gray-300 bg-[#f8f9fb] p-6 text-[12px] text-[#566176] lg:grid-cols-[36%_1fr]">
                <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
                  <label className="space-y-1">
                    Gender
                    <select
                      name="sexCd"
                      value={form.sexCd}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    >
                      <option value="">-None-</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="N">Non-Binary</option>
                      <option value="U">Unknown</option>
                    </select>
                  </label>
                  <label className="space-y-1">
                    Marital Status
                    <select
                      name="maritalCd"
                      value={form.maritalCd}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    >
                      <option value=""> </option>
                      <option value="M">Married</option>
                      <option value="S">Single</option>
                      <option value="D">Divorced</option>
                      <option value="W">Widowed</option>
                    </select>
                  </label>
                  <label className="space-y-1">
                    Race
                    <input
                      name="sRaceCd"
                      value={form.sRaceCd}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>
                  <label className="space-y-1">
                    Visa Type
                    <input
                      name="visaTypeCd"
                      value={form.visaTypeCd}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>
                  <label className="space-y-1">
                    Visa Exp Date
                    <input
                      type="date"
                      name="visaDt"
                      value={form.visaDt}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>
                  <label className="space-y-1">
                    Last Review Date
                    <input
                      type="date"
                      name="lastReviewDt"
                      value={form.lastReviewDt}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>
                  <label className="space-y-1">
                    Next Review Date
                    <input
                      type="date"
                      name="nextReviewDt"
                      value={form.nextReviewDt}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>
                  <label className="space-y-1">
                    Birth City
                    <input
                      name="birthCityName"
                      value={form.birthCityName}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>
                  <label className="space-y-1">
                    Birth State/Province
                    <input
                      name="birthMailStateDc"
                      value={form.birthMailStateDc}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>
                  <label className="space-y-1">
                    Birth Country
                    <input
                      name="birthCountryCd"
                      value={form.birthCountryCd}
                      onChange={handleChange}
                      className="block h-6 w-full rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>
                  <YesNoField
                    label="Disabled"
                    name="disabledFl"
                    value={!!form.disabledFl}
                    onChange={setBooleanField}
                    className="[&>span]:!w-[50px] [&>label]:!w-[70px] gap-4 mt-5"
                  />
                  <YesNoField
                    label="Blind"
                    name="blindFl"
                    value={!!form.blindFl}
                    onChange={setBooleanField}
                    className="[&>span]:!w-[50px] [&>label]:!w-[70px] mt-5 ml-1 gap-0"
                  />
                </div>
                <div className="space-y-4">
                  <fieldset className="rounded-lg border border-gray-300 px-6 pb-5 pt-3">
                    <legend className="px-1 text-[12px] font-semibold text-[#4387dd]">
                      VETS-4212 Protected Veteran Status
                    </legend>
                    <div className="space-y-3">
                      <YesNoField
                        label="Disabled Veteran"
                        name="vetStatusD"
                        value={!!form.vetStatusD}
                        onChange={setBooleanField}
                      />
                      <YesNoField
                        label="Active Duty Wartime or Campaign Badge Veteran"
                        name="activeDutyWartine"
                        value={!!form.activeDutyWartine}
                        onChange={setBooleanField}
                      />
                      <YesNoField
                        label="Armed Forces Service Medal Veteran"
                        name="vetStatusA"
                        value={!!form.vetStatusA}
                        onChange={setBooleanField}
                      />
                      <div className="grid grid-cols-[360px_auto] items-center">
                        <YesNoField
                          label="Recently Separated Veteran"
                          name="vetStatusR"
                          value={!!form.vetStatusR}
                          onChange={setBooleanField}
                        />
                        <label className="flex items-center gap-2">
                          Discharge/Release Date
                          <input
                            type="date"
                            name="vetReleaseDt"
                            value={form.vetReleaseDt}
                            onChange={handleChange}
                            className="h-6 w-[150px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>
                      </div>
                      <YesNoField
                        label="Protected Veteran (Declined to Self-Identify)"
                        name="vetStatusDeclined"
                        value={!!form.vetStatusDeclined}
                        onChange={setBooleanField}
                      />
                      <YesNoField
                        label="Not a Protected Veteran"
                        name="vetStatusNp"
                        value={!!form.vetStatusNp}
                        onChange={setBooleanField}
                      />
                      <YesNoField
                        label="Declined to provide veteran status"
                        name="vetStatusRs"
                        value={!!form.vetStatusRs}
                        onChange={setBooleanField}
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            )}

            {activeTab === "salaryInfo" && salarySection === "hr" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* COMPENSATION DATA */}
                <fieldset className="border border-gray-300 rounded bg-gray-50 p-3 min-h-[390px]">
                  <legend className="px-1 text-[12px] font-semibold text-[#3d6f93]">
                    Compensation Data
                  </legend>

                  <div className="space-y-2">
                    {/* Compensation Plan */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[185px] shrink-0 text-[12px] text-gray-700">
                        Compensation Plan
                      </label>
                      <input
                        name="compPlanCd"
                        value={form.compPlanCd}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[23px] w-[200px] px-1 text-[11px]"
                      />
                    </div>

                    {/* Step */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[185px] shrink-0 text-[12px] text-gray-700">
                        Step
                      </label>
                      <input
                        name="sStepNo"
                        value={form.sStepNo}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[23px] w-[77px] px-1 text-[11px]"
                      />
                    </div>

                    {/* Grade */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[185px] shrink-0 text-[12px] text-gray-700">
                        Grade
                      </label>
                      <input
                        name="salGradeCd"
                        value={form.salGradeCd}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-gray-100 h-[23px] w-[175px] px-1 text-[11px]"
                      />
                    </div>

                    {/* Review Form */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[185px] shrink-0 text-[12px] text-gray-700">
                        Review Form
                      </label>
                      <input
                        name="reviewFormId"
                        value={form.reviewFormId}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[23px] w-[200px] px-1 text-[11px]"
                      />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[185px] shrink-0 text-[12px] text-gray-700">
                        Rating
                      </label>
                      <input
                        name="overallRt"
                        value={form.overallRt}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[23px] w-[115px] px-1 text-[11px]"
                      />
                    </div>

                    {/* Percent Grade Change */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[185px] shrink-0 text-[12px] text-gray-700">
                        Percent Grade Change
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="promoPctRt"
                        value={form.promoPctRt}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[23px] w-[130px] px-1 text-[11px]"
                      />
                    </div>

                    {/* Percent Rating Change */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[185px] shrink-0 text-[12px] text-gray-700">
                        Percent Rating Change
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="meritPctRt"
                        value={form.meritPctRt}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[23px] w-[130px] px-1 text-[11px]"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* AFFIRMATIVE ACTION DATA */}
                <fieldset className="border border-gray-300 rounded bg-gray-50 p-3 min-h-[390px]">
                  <legend className="px-1 text-[12px] font-semibold text-[#3d6f93]">
                    Affirmative Action Data
                  </legend>

                  <div className="space-y-2">
                    {/* Affirmative Action Plan */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[215px] shrink-0 text-[12px] text-gray-700">
                        Affirmative Action Plan
                      </label>
                      <input
                        name="affPlanCd"
                        value={form.affPlanCd}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[23px] w-[200px] px-1 text-[11px]"
                      />
                    </div>

                    {/* Job Category */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[215px] shrink-0 text-[12px] text-gray-700">
                        Job Category
                      </label>
                      <input
                        name="jobGroupCd"
                        value={form.jobGroupCd}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[23px] w-[175px] px-1 text-[11px]"
                      />
                    </div>

                    {/* EEO Code - not present in supplied labinfo API */}
                    <div className="flex items-center min-h-[26px]">
                      <label className="w-[215px] shrink-0 text-[12px] text-gray-700">
                        EEO Code
                      </label>
                      <input
                        disabled
                        value=""
                        className="outline-none border border-[#9eb3cc] rounded bg-gray-100 h-[23px] w-[105px] px-1 text-[11px] cursor-not-allowed"
                      />
                    </div>

                    {/* Employment History */}
                    <div className="flex items-start min-h-[52px] pt-1">
                      <label className="w-[215px] shrink-0 text-[12px] text-gray-700">
                        Employment History
                      </label>
                      <div className="space-y-2 text-[12px] text-gray-700">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="hireDtFl"
                            checked={!!form.hireDtFl}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />
                          Effective Date is Hire Date
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="termDtFl"
                            checked={!!form.termDtFl}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />
                          Effective Date is Term Date
                        </label>
                      </div>
                    </div>

                    {/* California Pay Data Reporting / Remote Worker Status */}
                    <div className="flex items-center min-h-[52px]">
                      <label className="w-[215px] shrink-0 text-[12px] leading-4 text-gray-700">
                        <span className="block">
                          California Pay Data Reporting
                        </span>
                        <span className="block">Remote Worker Status</span>
                      </label>
                      <select
                        name="caRemoteWorker"
                        value={form.caRemoteWorker || ""}
                        onChange={handleChange}
                        className="outline-none border border-[#9eb3cc] rounded bg-white h-[25px] w-[475px] px-1 text-[11px]"
                      >
                        <option value="">-None-</option>
                        <option value="N">Does not work remotely</option>
                        <option value="Y">Works remotely</option>
                      </select>
                    </div>

                    {/* Comments */}
                    <div className="flex items-start pt-3">
                      <label className="w-[215px] shrink-0 text-[12px] text-gray-700 pt-1">
                        Comments
                      </label>
                      <textarea
                        name="comments"
                        value={form.comments || ""}
                        onChange={handleChange}
                        rows={4}
                        className="outline-none border border-[#9eb3cc] rounded bg-white w-[475px] min-h-[94px] resize-none p-2 text-[11px]"
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            )}

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
                        <AddressFormField label="Line 1" width="w-[180px]">
                          <textarea
                            name="addrLine1"
                            value={form.addrLine1}
                            rows={2}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </AddressFormField>
                        <AddressFormField label="Line 1" width="w-[180px]">
                          <textarea
                            name="addrLine2"
                            value={form.addrLine2}
                            rows={2}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </AddressFormField>
                        <AddressFormField label="Line 1" width="w-[180px]">
                          <textarea
                            name="addrLine3"
                            value={form.addrLine3}
                            rows={2}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </AddressFormField>
                        <AddressFormField label="City">
                          <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </AddressFormField>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        <AddressFormField
                          label="State/Province"
                          width="w-[180px]"
                        >
                          <input
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </AddressFormField>
                        <AddressFormField label="County" width="w-[180px]">
                          <input
                            name="countyName"
                            value={form.countyName}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </AddressFormField>
                        <AddressFormField label="Postal Code" width="w-[180px]">
                          <input
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </AddressFormField>
                        <AddressFormField label="Country" width="w-[180px]">
                          <input
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="outline-none w-full p-1"
                          />
                        </AddressFormField>
                      </div>
                    </div>
                  </fieldset>
                  {/* Emergency Contact Section */}
                  <fieldset className="fieldset-master">
                    <legend className="legend-master">Emergency Contact</legend>
                    <div className="space-y-3">
                      <FormField label="Contact 1 Name" width="w-[180px]">
                        <input
                          name="c1Name"
                          value={form.c1Name}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <FormField label="Contact 1 Phone" width="w-[180px]">
                        <input
                          name="c1Phone"
                          value={form.c1Phone}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <FormField
                        label="Contact 1 Relationship"
                        width="w-[180px]"
                      >
                        <input
                          name="c1Rel"
                          value={form.c1Rel}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <div className="border-t border-gray-300 my-4" />
                      <FormField label="Contact 2 Name" width="w-[180px]">
                        <input
                          name="c2Name"
                          value={form.c2Name}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <FormField label="Contact 2 Phone" width="w-[180px]">
                        <input
                          name="c2Phone"
                          value={form.c2Phone}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </FormField>
                      <FormField
                        label="Contact 2 Relationship"
                        width="w-[180px]"
                      >
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
                    <AddressFormField label="Work" width="w-[180px]">
                      <input
                        name="emailId"
                        value={form.emailId}
                        onChange={handleChange}
                        className="outline-none w-full p-1"
                      />
                    </AddressFormField>
                    <div className="flex items-center">
                      <label className="w-[167px] ml-[12px] text-[10px] text-[#17414d]">
                        Personal:
                      </label>

                      <div className="w-[200px] border border-gray-300 rounded bg-white">
                        <input
                          name="homeEmailId"
                          value={form.homeEmailId}
                          onChange={handleChange}
                          className="outline-none w-full p-1"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            )}

            {activeTab === "timesheet" && (
              <div className="space-y-2 border border-gray-200 p-2 rounded bg-gray-50">
                {/* Account */}
                <div className="flex items-center gap-2">
                  <label className="w-[95px] flex-shrink-0 text-[10px]">
                    Account:
                  </label>

                  <div className="w-[300px]">
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
                      onChange={(opt) => {
                        setForm((prev) => ({
                          ...prev,
                          acctId: opt ? opt.value : "",
                        }));
                        setIsDirty(true);
                        onDirtyChange?.(true);
                      }}
                      isSearchable
                      placeholder="Search Account..."
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="flex items-center gap-2">
                  <label className="w-[95px] flex-shrink-0 text-[10px]">
                    Organization:
                  </label>

                  <div className="w-[300px]">
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
                      onChange={(opt) => {
                        setForm((prev) => ({
                          ...prev,
                          orgId: opt ? opt.value : "",
                        }));
                        setIsDirty(true);
                        onDirtyChange?.(true);
                      }}
                      isSearchable
                      placeholder="Search Organization..."
                    />
                  </div>
                </div>

                {/* GLC */}
                <div className="flex items-center gap-2">
                  <label className="w-[95px] flex-shrink-0 text-[10px]">
                    GLC:
                  </label>

                  <div className="w-[300px]">
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
                      onChange={(opt) => {
                        setForm((prev) => ({
                          ...prev,
                          genlLabCatCd: opt ? opt.value : "",
                        }));
                        setIsDirty(true);
                        onDirtyChange?.(true);
                      }}
                      isSearchable
                      placeholder="Search GLC..."
                    />
                  </div>
                </div>

                {/* Pay Type */}
                <div className="flex items-center gap-2">
                  <label className="w-[95px] flex-shrink-0 text-[10px]">
                    Pay Type:
                  </label>

                  <input
                    name="regPayType"
                    value={form.regPayType}
                    onChange={handleChange}
                    className="w-[300px] border border-gray-300 bg-white rounded px-2 py-1 outline-none"
                  />
                </div>

                {/* Labor Location */}
                <div className="flex items-center gap-2">
                  <label className="w-[95px] flex-shrink-0 text-[10px]">
                    Labor Location:
                  </label>

                  <input
                    name="labLocCd"
                    value={form.labLocCd}
                    onChange={handleChange}
                    className="w-[300px] border border-gray-300 bg-white rounded px-2 py-1 outline-none"
                  />
                </div>

                {/* Workers' Comp */}
                <div className="flex items-center gap-2">
                  <label className="w-[95px] flex-shrink-0 text-[10px]">
                    Workers' Comp:
                  </label>

                  <input
                    name="workCompCd"
                    value={form.workCompCd}
                    onChange={handleChange}
                    className="w-[300px] border border-gray-300 bg-white rounded px-2 py-1 outline-none"
                  />
                </div>

                {/* REF NO 1 */}
                <div className="flex items-center gap-2">
                  <label className="w-[95px] flex-shrink-0 text-[10px]">
                    REF NO 1:
                  </label>

                  <input
                    name="ref1Id"
                    value={form.ref1Id}
                    onChange={handleChange}
                    className="w-[300px] border border-gray-300 bg-white rounded px-2 py-1 outline-none"
                  />
                </div>

                {/* REF NO 2 */}
                <div className="flex items-center gap-2">
                  <label className="w-[95px] flex-shrink-0 text-[10px]">
                    REF NO 2:
                  </label>

                  <input
                    name="ref2Id"
                    value={form.ref2Id}
                    onChange={handleChange}
                    className="w-[300px] border border-gray-300 bg-white rounded px-2 py-1 outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "taxDetails" && (
              <div className="space-y-3 rounded border border-gray-300 bg-[#f8f9fb] p-4 text-[12px] text-[#334155]">
                <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="grid grid-cols-[155px_1fr] items-center gap-1">
                      <span>
                        Pay Cycle <span className="text-red-500">*</span>
                      </span>
                      <input
                        name="taxPayCycle"
                        value={form.taxPayCycle}
                        onChange={handleChange}
                        className="h-6 w-full max-w-[180px] rounded border border-[#9eb3cc] bg-white px-1"
                      />
                    </label>
                    <label className="grid grid-cols-[155px_1fr] items-center gap-1">
                      <span>Tax Service Group ID</span>
                      <input
                        name="taxServiceGroupId"
                        value={form.taxServiceGroupId}
                        onChange={handleChange}
                        className="h-6 w-full max-w-[350px] rounded border border-[#9eb3cc] bg-white px-1"
                      />
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        name="retirementPlanCovered"
                        checked={!!form.retirementPlanCovered}
                        onChange={handleChange}
                      />
                      Retirement Plan Covered
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="nonresidentAlien"
                        checked={!!form.nonresidentAlien}
                        onChange={handleChange}
                      />
                      Nonresident Alien
                    </label>
                  </div>
                </div>

                <div className="border-b border-gray-400 pt-3">
                  <button
                    type="button"
                    onClick={() => setTaxSection("federal")}
                    className={`inline-block px-3 pb-1 font-semibold ${
                      taxSection === "federal"
                        ? "border-b-4 border-[#4387dd] text-[#4387dd]"
                        : "text-[#334155]"
                    }`}
                  >
                    Federal
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaxSection("state")}
                    className={`inline-block px-3 pb-1 font-semibold ${
                      taxSection === "state"
                        ? "border-b-4 border-[#4387dd] text-[#4387dd]"
                        : "text-[#334155]"
                    }`}
                  >
                    State
                  </button>
                </div>
                {taxSection === "federal" && (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <fieldset className="rounded-lg border border-gray-300 p-4">
                      <legend className="px-1 font-semibold text-[#4387dd]">
                        Federal Withholding
                      </legend>
                      <div className="space-y-3">
                        <label className="grid grid-cols-[130px_1fr] items-center gap-1">
                          <span>
                            W-4 Year <span className="text-red-500">*</span>
                          </span>
                          <select
                            name="w4RevisionYear"
                            value={form.w4RevisionYear}
                            onChange={handleChange}
                            className="h-7 w-[180px] rounded border border-gray-300 bg-white px-1"
                          >
                            <option value="2020">2020 or greater</option>
                            <option value="2019">2019 or earlier</option>
                          </select>
                        </label>
                        <label className="grid grid-cols-[130px_1fr] items-center gap-1">
                          <span>Filing Status</span>
                          <select
                            name="federalFilingStatus"
                            value={form.federalFilingStatus}
                            onChange={handleChange}
                            className="h-7 w-[180px] rounded border border-gray-300 bg-white px-1"
                          >
                            <option>Single</option>
                            <option>Married filing jointly</option>
                            <option>Head of household</option>
                          </select>
                        </label>
                        <label className="grid grid-cols-[130px_1fr] items-center gap-1">
                          <span>Allowances</span>
                          <input
                            type="number"
                            name="federalAllowances"
                            value={form.federalAllowances}
                            onChange={handleChange}
                            className="h-6 w-[90px] rounded border border-gray-300 bg-white px-1 text-right"
                          />
                        </label>
                        <label className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            name="multipleJobsFl"
                            checked={!!form.multipleJobsFl}
                            onChange={handleChange}
                            className="mt-0.5"
                          />
                          <span>
                            Multiple Jobs or Spouse Works
                            <br />
                            (W-4 Step 2c)
                          </span>
                        </label>
                      </div>
                    </fieldset>
                    <fieldset className="rounded-lg border border-gray-300 p-4">
                      <legend className="px-1 font-semibold text-[#4387dd]">
                        Tax Coverage
                      </legend>
                      <div className="space-y-3">
                        <YesNoField
                          label="FUTA"
                          name="futaFl"
                          value={!!form.futaFl}
                          onChange={setBooleanField}
                        />
                        <YesNoField
                          label="Medicare"
                          name="medicareFl"
                          value={!!form.medicareFl}
                          onChange={setBooleanField}
                        />
                        <YesNoField
                          label="Social Security"
                          name="socialSecurityFl"
                          value={!!form.socialSecurityFl}
                          onChange={setBooleanField}
                        />
                      </div>
                    </fieldset>
                    <fieldset className="rounded-lg border border-gray-300 p-4 xl:col-span-2">
                      <legend className="px-1 font-semibold text-[#4387dd]">
                        Credits &amp; Adjustments
                      </legend>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                        <label className="grid grid-cols-[200px_1fr] items-center gap-1">
                          <span>Qualifying Children Under 17</span>
                          <input
                            type="number"
                            name="qualifyingChildrenAmt"
                            value={form.qualifyingChildrenAmt}
                            onChange={handleChange}
                            className="h-6 w-[120px] rounded border border-gray-300 bg-white px-1 text-right"
                          />
                        </label>
                        <label className="grid grid-cols-[150px_1fr] items-center gap-1 ml-4">
                          <span>Other Income</span>
                          <input
                            type="number"
                            step="0.01"
                            name="otherIncomeAmt"
                            value={form.otherIncomeAmt}
                            onChange={handleChange}
                            className="h-6 w-[120px] rounded border border-gray-300 bg-white px-1 text-right"
                          />
                        </label>
                        <label className="grid grid-cols-[200px_1fr] items-center gap-1">
                          <span>Other Dependents</span>
                          <input
                            type="number"
                            name="otherDependentsAmt"
                            value={form.otherDependentsAmt}
                            onChange={handleChange}
                            className="h-6 w-[120px] rounded border border-gray-300 bg-white px-1 text-right"
                          />
                        </label>
                        <label className="grid grid-cols-[150px_1fr] items-center gap-1 ml-4">
                          <span>Deductions</span>
                          <input
                            type="number"
                            step="0.01"
                            name="deductionsAmt"
                            value={form.deductionsAmt}
                            onChange={handleChange}
                            className="h-6 w-[120px] rounded border border-gray-300 bg-white px-1 text-right"
                          />
                        </label>
                        <label className="grid grid-cols-[200px_1fr] items-center gap-1">
                          <span>Other Tax Credit</span>
                          <input
                            type="number"
                            step="0.01"
                            name="otherTaxCreditAmt"
                            value={form.otherTaxCreditAmt}
                            onChange={handleChange}
                            className="h-6 w-[120px] rounded border border-gray-300 bg-white px-1 text-right"
                          />
                        </label>
                        <label className="grid grid-cols-[150px_1fr] items-center gap-1 ml-4">
                          <span>Extra Withholding</span>
                          <input
                            type="number"
                            step="0.01"
                            name="extraWithholdingAmt"
                            value={form.extraWithholdingAmt}
                            onChange={handleChange}
                            className="h-6 w-[120px] rounded border border-gray-300 bg-white px-1 text-right"
                          />
                        </label>
                      </div>
                    </fieldset>
                    <fieldset className="rounded-lg border border-gray-300 p-4 xl:col-span-2">
                      <legend className="px-1 font-semibold text-[#4387dd]">
                        Overrides
                      </legend>

                      <div className="grid grid-cols-[460px_460px_auto] items-center gap-4">
                        {/* Override Amount */}
                        <label className="grid grid-cols-[145px_200px] items-center gap-1">
                          <span>Override Amount</span>
                          <input
                            type="number"
                            step="0.01"
                            name="overrideAmount"
                            value={form.overrideAmount}
                            onChange={handleChange}
                            className="h-6 rounded border border-gray-300 bg-white px-1"
                          />
                        </label>

                        {/* Override Percentage */}
                        <label className="grid grid-cols-[145px_200px] items-center gap-1">
                          <span>Override Percentage</span>
                          <input
                            type="number"
                            step="0.01"
                            name="overrideWithholdingPct"
                            value={form.overrideWithholdingPct}
                            onChange={handleChange}
                            className="h-6 rounded border border-gray-300 bg-white px-1"
                          />
                        </label>

                        {/* Disable ESS */}
                        <label className="flex items-center gap-2 whitespace-nowrap">
                          <input
                            type="checkbox"
                            name="disableEssFederalW4Fl"
                            checked={!!form.disableEssFederalW4Fl}
                            onChange={handleChange}
                          />
                          Disable ESS Federal W-4/Lock-in letter
                        </label>
                      </div>
                    </fieldset>
                  </div>
                )}

                {taxSection === "state" && (
                  <div className="space-y-4">
                    {/* ================= STATE WITHHOLDING ================= */}
                    <fieldset className="rounded-lg border border-gray-300 p-4">
                      <legend className="px-1 font-semibold text-[#4387dd]">
                        State Withholding
                      </legend>

                      <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                        {/* Withholding State */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Withholding State</span>
                          <input
                            name="stateWithholdingState"
                            value={form.stateWithholdingState || ""}
                            onChange={handleChange}
                            className="h-6 w-[85px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* Taxable Entity State */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Taxable Entity State</span>
                          <input
                            name="taxableEntityState"
                            value={form.taxableEntityState || ""}
                            onChange={handleChange}
                            className="h-6 w-[85px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* Filing Status */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Filing Status</span>
                          <input
                            name="stateFilingStatus"
                            value={form.stateFilingStatus || ""}
                            onChange={handleChange}
                            className="h-6 w-[200px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* Exemptions */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Exemptions</span>
                          <input
                            type="number"
                            name="stateExemptions"
                            value={form.stateExemptions || ""}
                            onChange={handleChange}
                            className="h-6 w-[75px] rounded border border-gray-300 bg-white px-1"
                          />
                        </label>

                        {/* Blindness Exemptions */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Blindness Exemptions</span>
                          <input
                            type="number"
                            name="stateBlindnessExemptions"
                            value={form.stateBlindnessExemptions || ""}
                            onChange={handleChange}
                            className="h-6 w-[75px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1 text-right"
                          />
                        </label>

                        {/* Age 65 Exemptions */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Age 65 Exemptions</span>
                          <input
                            type="number"
                            name="stateAge65Exemptions"
                            value={form.stateAge65Exemptions || ""}
                            onChange={handleChange}
                            className="h-6 w-[75px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1 text-right"
                          />
                        </label>

                        {/* Dependents */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Dependents</span>
                          <input
                            type="number"
                            name="stateDependents"
                            value={form.stateDependents || ""}
                            onChange={handleChange}
                            className="h-6 w-[75px] rounded border border-gray-300 bg-white px-1"
                          />
                        </label>

                        {/* First-time claimed dependents */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>First-time claimed dependents</span>
                          <input
                            type="number"
                            name="stateFirstTimeClaimedDependents"
                            value={form.stateFirstTimeClaimedDependents || ""}
                            onChange={handleChange}
                            className="h-6 w-[100px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1 text-right"
                          />
                        </label>

                        {/* First-time claimed dependents year */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>First-time claimed dependents year</span>
                          <input
                            name="stateFirstTimeClaimedDependentsYear"
                            value={
                              form.stateFirstTimeClaimedDependentsYear || ""
                            }
                            onChange={handleChange}
                            className="h-6 w-[100px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1"
                          />
                        </label>

                        {/* Number of adopted children */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Number of adopted children</span>
                          <input
                            type="number"
                            name="stateAdoptedChildren"
                            value={form.stateAdoptedChildren || ""}
                            onChange={handleChange}
                            className="h-6 w-[75px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1"
                          />
                        </label>

                        {/* Credits */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Credits</span>
                          <input
                            type="number"
                            name="stateCredits"
                            value={form.stateCredits || ""}
                            onChange={handleChange}
                            className="h-6 w-[75px] rounded border border-gray-300 bg-white px-1"
                          />
                        </label>

                        {/* Credit Amount */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Credit Amount</span>
                          <input
                            type="number"
                            step="0.01"
                            name="stateCreditAmount"
                            value={form.stateCreditAmount || ""}
                            onChange={handleChange}
                            className="h-6 w-[170px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1 text-right"
                          />
                        </label>

                        {/* Override Amount */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Override Amount</span>
                          <input
                            type="number"
                            step="0.01"
                            name="stateOverrideAmount"
                            value={form.stateOverrideAmount || ""}
                            onChange={handleChange}
                            className="h-6 w-[180px] rounded border border-gray-300 bg-white px-1"
                          />
                        </label>

                        {/* Override Percent */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Override Percent</span>
                          <input
                            type="number"
                            step="0.01"
                            name="stateOverridePercent"
                            value={form.stateOverridePercent || ""}
                            onChange={handleChange}
                            className="h-6 w-[130px] rounded border border-gray-300 bg-white px-1"
                          />
                        </label>

                        {/* Additional Amount */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Additional Amount</span>
                          <input
                            type="number"
                            step="0.01"
                            name="stateAdditionalAmount"
                            value={form.stateAdditionalAmount || ""}
                            onChange={handleChange}
                            className="h-6 w-[180px] rounded border border-gray-300 bg-white px-1"
                          />
                        </label>

                        {/* Colorado Deduction */}
                        <div className="grid grid-cols-[200px_1fr] items-start gap-2">
                          <span className="pt-1">Colorado Deduction</span>

                          <div className="space-y-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="coloradoDeduction"
                                value="standard"
                                checked={form.coloradoDeduction === "standard"}
                                onChange={handleChange}
                              />
                              Use Standard Deduction Table
                            </label>

                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="coloradoDeduction"
                                value="dr0004"
                                checked={form.coloradoDeduction === "dr0004"}
                                onChange={handleChange}
                              />
                              Use DR 0004 Allowance Amount
                            </label>
                          </div>
                        </div>

                        {/* Nebraska */}
                        <div className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Nebraska</span>

                          <label className="flex items-center gap-2 whitespace-nowrap">
                            <input
                              type="checkbox"
                              name="nebraskaExemptMinimumWithholding"
                              checked={!!form.nebraskaExemptMinimumWithholding}
                              onChange={handleChange}
                            />
                            Exempt from Minimum Withholding Rule
                          </label>
                        </div>

                        {/* Puerto Rico */}
                        <div className="grid grid-cols-[200px_1fr] items-start gap-2">
                          <span>Puerto Rico</span>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="puertoRicoVeteranExemption"
                                checked={!!form.puertoRicoVeteranExemption}
                                onChange={handleChange}
                              />
                              Veteran Exemption
                            </label>

                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name="puertoRicoSpecialDeduction"
                                checked={!!form.puertoRicoSpecialDeduction}
                                onChange={handleChange}
                              />
                              Special Deduction
                            </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>

                    {/* ================= SUTA ================= */}
                    <fieldset className="rounded-lg border border-gray-300 p-4">
                      <legend className="px-1 font-semibold text-[#4387dd]">
                        SUTA
                      </legend>

                      <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                        {/* SUTA State */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>SUTA State</span>
                          <input
                            name="sutaState"
                            value={form.sutaState || ""}
                            onChange={handleChange}
                            className="h-6 w-[85px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* Subject To SUTA */}
                        <label className="grid grid-cols-[15px_1fr] items-center gap-2">
                          <input
                            type="checkbox"
                            name="subjectToSuta"
                            checked={!!form.subjectToSuta}
                            onChange={handleChange}
                          />
                          Subject To SUTA
                        </label>

                        {/* Owner/Officer */}
                        <label className="grid grid-cols-[20px_1fr] items-center gap-2">
                          <input
                            type="checkbox"
                            name="ownerOfficer"
                            checked={!!form.ownerOfficer}
                            onChange={handleChange}
                          />
                          Owner/Officer (CO, DC, MD, MA, MI, MN, MO, NC, NM, OH,
                          SC, WA)
                        </label>

                        {/* Probationary Employee */}
                        <label className="grid grid-cols-[15px_1fr] items-center gap-2">
                          <input
                            type="checkbox"
                            name="probationaryEmployee"
                            checked={!!form.probationaryEmployee}
                            onChange={handleChange}
                          />
                          Probationary Employee (MO)
                        </label>

                        {/* Occupational/SOC Code */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>
                            Occupational/SOC Code (AK, IN, LA, NC, OH, SC, WA,
                            WV)
                          </span>
                          <input
                            name="occupationalSocCode"
                            value={form.occupationalSocCode || ""}
                            onChange={handleChange}
                            className="h-6 w-[200px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* Seasonal Code */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Seasonal Code (AR, IN)</span>
                          <input
                            name="seasonalCode"
                            value={form.seasonalCode || ""}
                            onChange={handleChange}
                            className="h-6 w-[85px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* County */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>County (WV)</span>
                          <input
                            name="countyWv"
                            value={form.countyWv || ""}
                            onChange={handleChange}
                            className="h-6 w-[200px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* Geographic Code */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Geographic Code (AK)</span>
                          <input
                            name="geographicCodeAk"
                            value={form.geographicCodeAk || ""}
                            onChange={handleChange}
                            className="h-6 w-[85px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* Worksite Number */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Worksite Number (TN, IA, MA, MI, MN, NM)</span>
                          <input
                            name="worksiteNumber"
                            value={form.worksiteNumber || ""}
                            onChange={handleChange}
                            className="h-6 w-[120px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        {/* Class Code */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Class Code (WY)</span>
                          <select
                            name="classCodeWy"
                            value={form.classCodeWy || "-None-"}
                            onChange={handleChange}
                            className="h-6 w-[200px] rounded border border-[#9eb3cc] bg-white px-1"
                          >
                            <option value="">-None-</option>
                            <option value="Corporate Officer">
                              Corporate Officer
                            </option>
                            <option value="Inmate Worker">Inmate Worker</option>
                            <option value="JTPA Worker">JTPA Worker</option>
                            <option value="Partner">Partner</option>
                            <option value="Sole Proprietor">
                              Sole Proprietor
                            </option>
                            <option value="Volunteer">Volunteer</option>
                            <option value="Welfare">Welfare</option>
                            <option value="Independent Contractor">
                              Independent Contractor
                            </option>
                          </select>
                        </label>

                        {/* Corporate Officer ID */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Corporate Officer ID (WY)</span>
                          <input
                            name="corporateOfficerIdWy"
                            value={form.corporateOfficerIdWy || ""}
                            onChange={handleChange}
                            className="h-6 w-[175px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1"
                          />
                        </label>

                        {/* Coverage Type */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Coverage Type (WY)</span>
                          <select
                            name="coverageTypeWy"
                            value={form.coverageTypeWy || "-None-"}
                            onChange={handleChange}
                            className="h-6 w-[200px] rounded border border-[#9eb3cc] bg-white px-1"
                          >
                            <option>-None-</option>
                            <option value="Unemployment Only">
                              Unemployment Only
                            </option>
                            <option value="Worker's Comp Only">
                              Worker's Comp Only
                            </option>
                            <option value="Both">Both</option>
                          </select>
                        </label>

                        {/* Employee/Employer Relationship */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Employee/Employer Relationship (DC)</span>
                          <select
                            name="employeeEmployerRelationshipDc"
                            value={
                              form.employeeEmployerRelationshipDc ||
                              "0-Worker/Employer"
                            }
                            onChange={handleChange}
                            className="h-6 w-[200px] rounded border border-[#9eb3cc] bg-white px-1"
                          >
                            <option>-None-</option>
                            <option value="0-Worker/Employer">
                              0-Worker/Employer
                            </option>
                            <option value="1-Owner or Officer">
                              1-Owner or Officer
                            </option>
                            <option value="2-Spouse of Owner or Officer">
                              2-Spouse of Owner or Officer
                            </option>
                            <option value="3-Parent/Grandparent of Onwer or Officer">
                              3-Parent/Grandparent of Onwer or Officer
                            </option>
                            <option value="4-Child of Onwer or Officer">
                              4-Child of Onwer or Officer
                            </option>
                            <option value="5-Sibling of Onwer or Officer">
                              5-Sibling of Onwer or Officer
                            </option>
                            <option value="6-Board Member">
                              6-Board Member
                            </option>
                          </select>
                        </label>

                        {/* Wage Plan Code */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>Wage Plan Code (CA)</span>
                          <select
                            name="wagePlanCodeCa"
                            value={form.wagePlanCodeCa || "-None-"}
                            onChange={handleChange}
                            className="h-6 w-[200px] rounded border border-[#9eb3cc] bg-white px-1"
                          >
                            <option>-None-</option>
                            <option>UI and DI covered under state</option>
                            <option>
                              UI covered under state &amp; DI covered under
                              voluntary plan
                            </option>
                            <option>
                              DI covered under state &amp; exempt from UI
                            </option>
                            <option>
                              Covered undre voluntary plan for DI only
                            </option>
                            <option>
                              Religious exemption from DI &amp; UI covered under
                              state
                            </option>
                            <option>
                              Covered under state plan for UI(Public entry
                              employees only)
                            </option>
                            <option>
                              Covered for personal income tax only
                            </option>
                          </select>
                        </label>

                        {/* U.S. Citizenship */}
                        <label className="grid grid-cols-[200px_1fr] items-center gap-2">
                          <span>U.S. Citizenship (VI)</span>
                          <select
                            name="usCitizenshipVi"
                            value={form.usCitizenshipVi || "-None-"}
                            onChange={handleChange}
                            className="h-6 w-[200px] rounded border border-[#9eb3cc] bg-white px-1"
                          >
                            <option>-None-</option>
                            <option>US citizen</option>
                            <option>
                              Non citizen with permanent residence ID card
                              issues by USINS
                            </option>
                            <option>
                              Alien holding temporary or indefinite work permit
                            </option>
                          </select>
                        </label>
                      </div>
                    </fieldset>

                    {/* ================= OTHER PAYROLL TAXES ================= */}
                    <fieldset className="rounded-lg border border-gray-300 p-4">
                      <legend className="px-1 font-semibold text-[#4387dd]">
                        Other Payroll Taxes
                      </legend>

                      <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="waCaresFundExemption"
                            checked={!!form.waCaresFundExemption}
                            onChange={handleChange}
                          />
                          WA Cares Fund Exemption
                        </label>

                        <label className="grid grid-cols-[100px_1fr] items-center gap-2">
                          <span>Effective Date</span>
                          <input
                            type="date"
                            name="waCaresEffectiveDate"
                            value={form.waCaresEffectiveDate || ""}
                            onChange={handleChange}
                            className="h-6 w-[150px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>

                        <label className="grid grid-cols-[80px_1fr] items-center gap-2">
                          <span>End Date</span>
                          <input
                            type="date"
                            name="waCaresEndDate"
                            value={form.waCaresEndDate || ""}
                            onChange={handleChange}
                            className="h-6 w-[150px] rounded border border-[#9eb3cc] bg-white px-1"
                          />
                        </label>
                      </div>
                    </fieldset>
                  </div>
                )}
              </div>
            )}

            {activeTab === "savingsBonds" && (
              <div className="space-y-3 rounded border border-gray-300 bg-[#f8f9fb] p-4 text-[12px] text-[#334155]">
                {/* Effective Date */}
                <label className="grid grid-cols-[130px_1fr] items-center gap-2">
                  <span>
                    Effective Date <span className="text-red-500">*</span>
                  </span>

                  <input
                    type="date"
                    name="savingsBondEffectiveDate"
                    value={form.savingsBondEffectiveDate || ""}
                    onChange={handleChange}
                    className="h-6 w-[125px] rounded border border-[#9eb3cc] bg-white px-1"
                  />
                </label>

                {/* Deduction Information */}
                <fieldset className="rounded-lg border border-gray-300 p-4">
                  <legend className="px-1 font-semibold text-[#4387dd]">
                    Deduction Information
                  </legend>

                  <div className="grid grid-cols-1 gap-x-10 gap-y-3 md:grid-cols-2">
                    <div className="space-y-3">
                      <label className="grid grid-cols-[160px_1fr] items-center gap-2">
                        <span>
                          Deduction <span className="text-red-500">*</span>
                        </span>

                        <input
                          name="savingsBondDeduction"
                          value={form.savingsBondDeduction || ""}
                          onChange={handleChange}
                          className="h-6 w-[150px] rounded border border-[#9eb3cc] bg-white px-1"
                        />
                      </label>

                      <label className="grid grid-cols-[160px_1fr] items-center gap-2">
                        <span>
                          Compute Method <span className="text-red-500">*</span>
                        </span>

                        <select
                          name="savingsBondComputeMethod"
                          value={form.savingsBondComputeMethod || "-Select-"}
                          onChange={handleChange}
                          className="h-6 w-[140px] rounded border border-[#9eb3cc] bg-white px-1"
                        >
                          <option value="-Select-">-Select-</option>
                          <option value="ADDGRS">ADDGRS</option>
                          <option value="FIXAMT">FIXAMT</option>
                          <option value="GHRSPD">GHRSPD</option>
                          <option value="GRSHRF">GRSHRF</option>
                          <option value="GRSHRP">GRSHRP</option>
                          <option value="NO DED">NO DED</option>
                          <option value="PCTANN">PCTANN</option>
                          <option value="PCTCOD">PCTCOD</option>
                          <option value="PCTDPI">PCTDPI</option>
                          <option value="PCTGRS">PCTGRS</option>
                          <option value="PCTREG">PCTREG</option>
                          <option value="REGHRF">REGHRF</option>
                          <option value="REGHRP">REGHRP</option>
                        </select>
                      </label>

                      <label className="grid grid-cols-[160px_1fr] items-center gap-2">
                        <span>
                          Rate/Amount <span className="text-red-500">*</span>
                        </span>

                        <input
                          type="number"
                          name="savingsBondRateAmount"
                          value={form.savingsBondRateAmount || ""}
                          onChange={handleChange}
                          className="h-6 w-[220px] rounded border border-[#9eb3cc] bg-white px-1"
                        />
                      </label>

                      <label className="grid grid-cols-[160px_1fr] items-center gap-2">
                        <span>
                          Limit <span className="text-red-500">*</span>
                        </span>

                        <input
                          type="number"
                          name="savingsBondLimit"
                          value={form.savingsBondLimit || ""}
                          onChange={handleChange}
                          className="h-6 w-[195px] rounded border border-[#9eb3cc] bg-white px-1"
                        />
                      </label>
                    </div>

                    <div className="space-y-3">
                      <label className="grid grid-cols-[110px_1fr] items-center gap-2">
                        <span>Priority</span>

                        <input
                          name="savingsBondPriority"
                          value={form.savingsBondPriority || ""}
                          onChange={handleChange}
                          className="h-6 w-[90px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1"
                        />
                      </label>

                      <label className="grid grid-cols-[110px_1fr] items-center gap-2">
                        <span>Start Date</span>

                        <input
                          type="date"
                          name="savingsBondStartDate"
                          value={form.savingsBondStartDate || ""}
                          onChange={handleChange}
                          className="h-6 w-[125px] rounded border border-[#9eb3cc] bg-white px-1"
                        />
                      </label>

                      <label className="grid grid-cols-[110px_1fr] items-center gap-2">
                        <span>End Date</span>

                        <input
                          type="date"
                          name="savingsBondEndDate"
                          value={form.savingsBondEndDate || ""}
                          onChange={handleChange}
                          className="h-6 w-[125px] rounded border border-[#9eb3cc] bg-white px-1"
                        />
                      </label>
                    </div>
                  </div>
                </fieldset>

                {/* Activity */}
                <fieldset className="rounded-lg border border-gray-300 p-4">
                  <legend className="px-1 font-semibold text-[#4387dd]">
                    Activity
                  </legend>

                  <div className="space-y-3">
                    <label className="grid grid-cols-[160px_1fr] items-center gap-2">
                      <span>Beginning Balance</span>

                      <input
                        name="savingsBondBeginningBalance"
                        value={form.savingsBondBeginningBalance || ""}
                        onChange={handleChange}
                        className="h-6 w-[240px] rounded border border-[#9eb3cc] bg-white px-1"
                      />
                    </label>

                    <label className="grid grid-cols-[160px_1fr] items-center gap-2">
                      <span>Bond Funds</span>

                      <input
                        name="savingsBondFunds"
                        value={form.savingsBondFunds || ""}
                        onChange={handleChange}
                        className="h-6 w-[240px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1"
                      />
                    </label>

                    <label className="grid grid-cols-[160px_1fr] items-center gap-2">
                      <span>Amount Spent</span>

                      <input
                        name="savingsBondAmountSpent"
                        value={form.savingsBondAmountSpent || ""}
                        onChange={handleChange}
                        className="h-6 w-[240px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1"
                      />
                    </label>

                    <label className="grid grid-cols-[160px_1fr] items-center gap-2">
                      <span>Balance</span>

                      <input
                        name="savingsBondBalance"
                        value={form.savingsBondBalance || ""}
                        onChange={handleChange}
                        className="h-6 w-[240px] rounded border border-[#9eb3cc] bg-[#eef0f3] px-1"
                      />
                    </label>
                  </div>
                </fieldset>

                {/* Bond Requests
    <div className="flex items-center gap-4 pt-3">
      <span className="font-semibold text-[#4387dd]">
        Bond Requests
      </span>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#4387dd] text-lg text-[#4387dd]"
      >
        ⋮
      </button>
    </div> */}
              </div>
            )}

            {activeTab === "citizenship" && (
              <div className="space-y-3 rounded border border-gray-300 bg-[#f8f9fb] p-4 text-[12px] text-[#334155]">
                <div className="space-y-3">
                  {/* Country */}
                  <label className="grid grid-cols-[300px_1fr] items-center gap-2">
                    <span>
                      Country <span className="text-red-500">*</span>
                    </span>

                    <input
                      name="citizenshipCountry"
                      value={form.citizenshipCountry || ""}
                      onChange={handleChange}
                      className="h-6 w-[210px] rounded border border-[#9eb3cc] bg-white px-1"
                    />

                    <div className="flex items-center gap-8">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="citizenshipNato"
                          checked={!!form.citizenshipNato}
                          onChange={handleChange}
                        />
                        NATO
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="citizenshipEu"
                          checked={!!form.citizenshipEu}
                          onChange={handleChange}
                        />
                        EU
                      </label>
                    </div>
                  </label>

                  {/* Citizen Status */}
                  <label className="grid grid-cols-[300px_1fr] items-center gap-2">
                    <span>
                      Citizen Status <span className="text-red-500">*</span>
                    </span>

                    <input
                      name="citizenStatus"
                      value={form.citizenStatus || ""}
                      onChange={handleChange}
                      className="h-6 w-[210px] rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>

                  {/* NIN */}
                  <label className="grid grid-cols-[300px_1fr] items-center gap-2">
                    <span>National Identification Number (NIN)</span>

                    <input
                      name="nationalIdentificationNumber"
                      value={form.nationalIdentificationNumber || ""}
                      onChange={handleChange}
                      className="h-6 w-[350px] rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>

                  {/* Effective Date */}
                  <label className="grid grid-cols-[300px_1fr] items-center gap-2">
                    <span>Effective Date</span>

                    <input
                      type="date"
                      name="citizenshipEffectiveDate"
                      value={form.citizenshipEffectiveDate || ""}
                      onChange={handleChange}
                      className="h-6 w-[155px] rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>

                  {/* End Date */}
                  <label className="grid grid-cols-[300px_1fr] items-center gap-2">
                    <span>End Date</span>

                    <input
                      type="date"
                      name="citizenshipEndDate"
                      value={form.citizenshipEndDate || ""}
                      onChange={handleChange}
                      className="h-6 w-[155px] rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>

                  {/* Passport Number */}
                  <label className="grid grid-cols-[300px_1fr] items-center gap-2">
                    <span>Passport Number</span>

                    <input
                      name="passportNumber"
                      value={form.passportNumber || ""}
                      onChange={handleChange}
                      className="h-6 w-[350px] rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>

                  {/* Passport Issue Date */}
                  <label className="grid grid-cols-[300px_1fr] items-center gap-2">
                    <span>Passport Issue Date</span>

                    <input
                      type="date"
                      name="passportIssueDate"
                      value={form.passportIssueDate || ""}
                      onChange={handleChange}
                      className="h-6 w-[155px] rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>

                  {/* Passport Expiration Date */}
                  <label className="grid grid-cols-[300px_1fr] items-center gap-2">
                    <span>Passport Expiration Date</span>

                    <input
                      type="date"
                      name="passportExpirationDate"
                      value={form.passportExpirationDate || ""}
                      onChange={handleChange}
                      className="h-6 w-[155px] rounded border border-[#9eb3cc] bg-white px-1"
                    />
                  </label>

                  {/* Notes */}
                  <label className="grid grid-cols-[300px_1fr] items-start gap-2">
                    <span>Notes</span>

                    <textarea
                      name="citizenshipNotes"
                      value={form.citizenshipNotes || ""}
                      onChange={handleChange}
                      className="h-28 w-[400px] rounded border border-gray-300 bg-white px-1"
                    />
                  </label>
                </div>
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

          <div className="mt-5 border-t border-gray-200 pt-3">
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSalarySection("salary");
                  setActiveTab("salaryInfo");
                }}
                className={`rounded-t-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "salaryInfo"
                    ? "border-[#17414d] bg-[#17414d] text-white"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Salary Info
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("taxDetails")}
                className={`rounded-t-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "taxDetails"
                    ? "border-[#17414d] bg-[#17414d] text-white"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tax Details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("savingsBonds")}
                className={`rounded-t-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "savingsBonds"
                    ? "border-[#17414d] bg-[#17414d] text-white"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Savings Bonds
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("citizenship")}
                className={`rounded-t-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "citizenship"
                    ? "border-[#17414d] bg-[#17414d] text-white"
                    : "border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Citizenship
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  },
);

export default EmployeeMasterForm;
