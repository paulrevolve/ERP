import React, { useState, useEffect } from "react";
import {
  X,
  History,
  Award,
  ShieldCheck,
  GraduationCap,
  Lock,
  Settings2,
  User,
  Layers,
} from "lucide-react";
import { MainContainer, Toolbar } from "../../helper/container";
import {
  FormInput,
  FormSearchSelect,
  FormSection,
} from "../../helper/formSection";
import { backendUrl } from "../config";
import api from "../../utils/api";
import { toast } from "react-toastify";

const ConfigureAccountsPayableSettings = ({ formData, onClose, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const initialApSetting = {
    curCalYrNo: 0,
    age2DaysToNo: 0,
    age3DaysToNo: 0,
    age4DaysToNo: 0,
    age1HdgFld: "Current",
    age2HdgFld: "1 to 30",
    age3HdgFld: "31 to 60",
    age4HdgFld: "61 to 90",
    age5HdgFld: "Over 90",
    chkLimitFl: "N",
    chkLimitAmt: 0,
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    sApChkFrmtCd: "N",
    eftSecureFl: "N",
    chkSigLimit: 0,
    primSigFl: "N",
    secondSigFl: "N",
    sigReqdMessage: "",
    addrOrderCd: "N",
    sig1FileName: "",
    sig2FileName: "",
    logoFileName: "",
    vendInfUpdFl: "N",
    eftFileCreatFl: "N",
    vendUpdPwdName: "",
    prntChksFl: "N",
    rowversion: 0,
    vendApprvlFl: "N",
    dfltRptResCd: "N",
    apChkFrmtP3Cd: "N",
    prntArialFl: "N",
    addrElimCd: "st",
    dateFieldCd: "",
    arialLineCd: "N",
    vendEmplAprvlFl: "N",
    veAprvlGrpFl: "N",
    frEmailEft: "",
    subjEmailEft: "",
    hdrEmailEft: "",
    ftrEmailEft: "",
    companyId: companyId,
    modifiedBy: user.name || "Admin",
    isNew: true,
  };

  const [apSettingInfo, setApSettingInfo] = useState({});

  const enrichRecord = (record) => {
    return {
      ...record,
      // Note: orgOpt uses 'orgId' based on your JSON snippet
      acctName: acctOpt.find((a) => a.id === record.acctId)?.name || "",
      orgName: orgOpt.find((o) => o.orgId === record.orgId)?.orgName || "",
      refStrucName: ref1Opt.find((r) => r.id === record.refStrucId)?.name || "",
      ref2Name: ref2Opt.find((r) => r.id === record.ref2Id)?.name || "",
      bankAcctName:
        bankAbbrv.find((p) => p.id === record.bankAcctAbbrv)?.name || "",
      isNew: false,
    };
  };

  const fetchApSetting = async () => {
    try {
      const response = await api.get(
        `${backendUrl}/api/ap-settings/${companyId}`,
      );
      // Note: adjust the path if your data isn't under response.data.data
      const incomingData = response.data?.data || response.data;

      if (incomingData) {
        const rawRecord = Array.isArray(incomingData)
          ? incomingData[0]
          : incomingData;

        if (rawRecord && Object.keys(rawRecord).length > 0) {
          // Map response directly to state
          setApSettingInfo({
            ...rawRecord,
            isNew: false,
          });

          setOriginalData(
            Array.isArray(incomingData) ? incomingData : [incomingData],
          );
          setIsDirty(false);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings.");
    }
  };

  useEffect(() => {
    fetchApSetting();
  }, []);

  const handleFieldChange = (
    field,
    value,
    nameField = null,
    nameValue = null,
  ) => {
    setApSettingInfo((prev) => {
      const updated = { ...prev, [field]: value };
      if (nameField) updated[nameField] = nameValue;
      return updated;
    });
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...apSettingInfo,
        modifiedBy: user.name,
        companyId,
      };

      const url = `${backendUrl}/api/ap-settings/save`;

      const response = await api.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("saved successfully!");
        setIsDirty(false);
        fetchApSetting();
      }
    } catch (error) {
      toast.error("Error saving information.");
    }
  };

  const toolbarActions = {
    onSave: handleSave,
    onClear: () => {
      //   setApSettingInfo(originalData || initialApSetting);
      fetchApSetting();
      setIsDirty(false);
    },
  };

  return (
    <div className="p-4 animate-in fade-in duration-300 mt-10">
      <MainContainer
        title="Configure Accounts Payable Settings"
        handleClose={onClose}
      >
        <Toolbar
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          buttonsDisable={["copy", "paste", "tableform", "add", "delete"]}
        />

        {/* Main Layout Grid: Left column (Aging) and Right column (Security/Approvals) */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          {/* Left Column: Default Aging Criteria */}
          <div className="w-full lg:w-[40%]">
            <FormSection title="Default Aging Criteria">
              <div className="space-y-3 p-2">
                {/* Header Row */}
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-600 mb-1">
                  <div className="col-span-1"></div>
                  <div className="col-span-6 text-center">Column Heading</div>
                  <div className="col-span-2 text-center">From</div>
                  <div className="col-span-3 text-center">To</div>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-1 text-xs font-bold text-slate-500 text-center">
                    1) *
                  </span>
                  <div className="col-span-6">
                    <FormInput
                      noLabel
                      value={apSettingInfo.age1HdgFld}
                      onChange={(e) =>
                        handleFieldChange("age1HdgFld", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <FormInput
                      noLabel
                      className="text-center bg-slate-50"
                      value="0"
                      readOnly
                    />
                  </div>
                  <div className="col-span-3"></div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-1 text-xs font-bold text-slate-500 text-center">
                    2) *
                  </span>
                  <div className="col-span-6">
                    <FormInput
                      noLabel
                      value={apSettingInfo.age2HdgFld}
                      onChange={(e) =>
                        handleFieldChange("age2HdgFld", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <FormInput
                      noLabel
                      className="text-center bg-slate-50"
                      value="1"
                      readOnly
                    />
                  </div>
                  <div className="col-span-3">
                    <FormInput
                      noLabel
                      type="number"
                      className="text-center"
                      value={apSettingInfo.age2DaysToNo}
                      onChange={(e) =>
                        handleFieldChange("age2DaysToNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-1 text-xs font-bold text-slate-500 text-center">
                    3) *
                  </span>
                  <div className="col-span-6">
                    <FormInput
                      noLabel
                      value={apSettingInfo.age3HdgFld}
                      onChange={(e) =>
                        handleFieldChange("age3HdgFld", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <FormInput
                      noLabel
                      className="text-center bg-slate-50"
                      value={Number(apSettingInfo.age2DaysToNo) + 1}
                      readOnly
                    />
                  </div>
                  <div className="col-span-3">
                    <FormInput
                      noLabel
                      type="number"
                      className="text-center"
                      value={apSettingInfo.age3DaysToNo}
                      onChange={(e) =>
                        handleFieldChange("age3DaysToNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-1 text-xs font-bold text-slate-500 text-center">
                    4) *
                  </span>
                  <div className="col-span-6">
                    <FormInput
                      noLabel
                      value={apSettingInfo.age4HdgFld}
                      onChange={(e) =>
                        handleFieldChange("age4HdgFld", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <FormInput
                      noLabel
                      className="text-center bg-slate-50"
                      value={Number(apSettingInfo.age3DaysToNo) + 1}
                      readOnly
                    />
                  </div>
                  <div className="col-span-3">
                    <FormInput
                      noLabel
                      type="number"
                      className="text-center"
                      value={apSettingInfo.age4DaysToNo}
                      onChange={(e) =>
                        handleFieldChange("age4DaysToNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <span className="col-span-1 text-xs font-bold text-slate-500 text-center">
                    5) *
                  </span>
                  <div className="col-span-6">
                    <FormInput
                      noLabel
                      value={apSettingInfo.age5HdgFld}
                      onChange={(e) =>
                        handleFieldChange("age5HdgFld", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <FormInput
                      noLabel
                      className="text-center bg-slate-50"
                      value={Number(apSettingInfo.age4DaysToNo) + 1}
                      readOnly
                    />
                  </div>
                  <div className="col-span-3"></div>
                </div>
              </div>
            </FormSection>
          </div>

          {/* Right Column: All Security and Approval sections */}
          <div className="w-full lg:w-2/3 space-y-4">
            {/* Payment Security */}
            <FormSection title="Payment Security">
              <div className="grid grid-cols-2 gap-4 p-2">
                <div className="space-y-2">
                  <FormInput
                    type="checkbox"
                    label="Record Vendor Info Updates"
                    checked={apSettingInfo.vendInfUpdFl === "Y"}
                    onChange={(e) =>
                      handleFieldChange(
                        "vendInfUpdFl",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                  <FormInput
                    type="checkbox"
                    label="Record Print Checks"
                    checked={apSettingInfo.prntChksFl === "Y"}
                    onChange={(e) =>
                      handleFieldChange(
                        "prntChksFl",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FormInput
                      label="  Vendor
Password
                      Update"
                      value={apSettingInfo.vendUpdPwdName}
                      onChange={(e) =>
                        handleFieldChange("vendUpdPwdName", e.target.value)
                      }
                    />
                  </div>
                  <FormInput
                    type="checkbox"
                    label="Record EFT File Creation"
                    checked={apSettingInfo.eftFileCreatFl === "Y"}
                    onChange={(e) =>
                      handleFieldChange(
                        "eftFileCreatFl",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                </div>
              </div>
            </FormSection>

            {/* Check Approval */}
            <FormSection title="Check Approval">
              <div className="flex items-center gap-20 p-2">
                <FormInput
                  type="checkbox"
                  label="Set Limit"
                  checked={apSettingInfo.chkLimitFl === "Y"}
                  onChange={(e) =>
                    handleFieldChange(
                      "chkLimitFl",
                      e.target.checked ? "Y" : "N",
                    )
                  }
                />
                <div className="flex items-center gap-2">
                  <FormInput
                    label="Limit Amount"
                    type="number"
                    className="text-right"
                    value={apSettingInfo.chkLimitAmt}
                    onChange={(e) =>
                      handleFieldChange("chkLimitAmt", e.target.value)
                    }
                  />
                </div>
              </div>
            </FormSection>

            {/* Vendor Approval */}
            <FormSection title="Vendor Approval">
              <div className="p-2">
                <FormInput
                  type="checkbox"
                  label="Requires Approval"
                  checked={apSettingInfo.vendApprvlFl === "Y"}
                  onChange={(e) =>
                    handleFieldChange(
                      "vendApprvlFl",
                      e.target.checked ? "Y" : "N",
                    )
                  }
                />
              </div>
            </FormSection>

            {/* Vendor Employee Approval */}
            <FormSection title="Vendor Employee Approval">
              <div className="p-2 space-y-2">
                <FormInput
                  type="checkbox"
                  label="Requires Approval"
                  checked={apSettingInfo.vendEmplAprvlFl === "Y"}
                  onChange={(e) =>
                    handleFieldChange(
                      "vendEmplAprvlFl",
                      e.target.checked ? "Y" : "N",
                    )
                  }
                />
                <div className="ml-6">
                  <FormInput
                    type="checkbox"
                    label="Use Vendor Employee Approval Groups"
                    checked={apSettingInfo.veAprvlGrpFl === "Y"}
                    onChange={(e) =>
                      handleFieldChange(
                        "veAprvlGrpFl",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                </div>
              </div>
            </FormSection>
          </div>
        </div>
      </MainContainer>
    </div>
  );
};

export default ConfigureAccountsPayableSettings;
