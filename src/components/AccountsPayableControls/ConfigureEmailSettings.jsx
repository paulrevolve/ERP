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

const ConfigureEmailSettings = ({ formData, onClose, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const initialEmailState = {
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
    primSigFl: "Y",
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

  // 1. Fetch All Static Options on Mount

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
      fetchApSetting();
      setIsDirty(false);
    },
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-300 mt-10">
      <MainContainer
        title="Configure Check/EFT Email Settings"
        handleClose={onClose}
      >
        <Toolbar
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          buttonsDisable={["copy", "paste", "tableform", "add", "delete"]}
        />
        <div className="mt-2">
          <FormSection>
            {/* Top Row: Signature Settings */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                type="checkbox"
                label="Primary Signature"
                checked={apSettingInfo.primSigFl === "Y"}
                onChange={(e) =>
                  handleFieldChange("primSigFl", e.target.checked ? "Y" : "N")
                }
              />
              <FormInput
                label="Signature Limit"
                type="number"
                value={apSettingInfo.chkSigLimit || "0.00"}
                onChange={(e) =>
                  handleFieldChange("chkSigLimit", e.target.value)
                }
              />
              <FormInput
                type="checkbox"
                label="Secondary Signature"
                checked={apSettingInfo.secondSigFl === "Y"}
                onChange={(e) =>
                  handleFieldChange("secondSigFl", e.target.checked ? "Y" : "N")
                }
              />
              <FormInput
                label="Signature Req Message"
                value={apSettingInfo.sigReqdMessage || ""}
                onChange={(e) =>
                  handleFieldChange("sigReqdMessage", e.target.value)
                }
              />
            </div>

            {/* Row 2: Address Order & Report Resolution */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <FormSection title="Address Order for Checks/1099 Self-Mailers">
                <div className="flex gap-4">
                  <FormInput
                    type="radio"
                    label="Line 1/2/3"
                    checked={apSettingInfo.addrOrderCd === "N"}
                    onChange={() => handleFieldChange("addrOrderCd", "N")}
                  />
                  <FormInput
                    type="radio"
                    label="Line 2/3/1"
                    checked={apSettingInfo.addrOrderCd === "R"}
                    onChange={() => handleFieldChange("addrOrderCd", "R")}
                  />
                </div>
              </FormSection>
              <FormSection title="Check and 1099 Report Resolution">
                <div className="flex gap-4">
                  <FormInput
                    type="radio"
                    label="Low"
                    checked={apSettingInfo.dfltRptResCd === "L"}
                    onChange={() => handleFieldChange("dfltRptResCd", "L")}
                  />
                  <FormInput
                    type="radio"
                    label="High"
                    checked={apSettingInfo.dfltRptResCd === "H"}
                    onChange={() => handleFieldChange("dfltRptResCd", "H")}
                  />
                </div>
              </FormSection>
            </div>

            {/* Row 3: Date Field, Laser Check Part, Positive Pay */}
            <div className="grid grid-cols-3 gap-8 mt-4">
              <FormSection title="Date Field Indicator">
                <div className="space-y-1">
                  {["MM-DD-YYYY", "YYYY-MM-DD", "DD-MM-YYYY"].map((format) => (
                    <FormInput
                      key={format}
                      type="radio"
                      label={format}
                      checked={apSettingInfo.dateFieldCd === format}
                      onChange={() => handleFieldChange("dateFieldCd", format)}
                    />
                  ))}
                </div>
              </FormSection>
              <FormSection title="Preprinted Laser Check Part 3">
                <div className="flex gap-2">
                  <FormInput
                    type="radio"
                    label="Address"
                    checked={apSettingInfo.apChkFrmtP3Cd === "A"}
                    onChange={() => handleFieldChange("apChkFrmtP3Cd", "A")}
                  />
                  <FormInput
                    type="radio"
                    label="Stub"
                    checked={apSettingInfo.apChkFrmtP3Cd === "S"}
                    onChange={() => handleFieldChange("apChkFrmtP3Cd", "S")}
                  />
                </div>
              </FormSection>
              <FormSection title="Positive Pay Printing Requirement">
                <div className="space-y-1">
                  <FormInput
                    type="checkbox"
                    label="Arial 12 pt"
                    checked={apSettingInfo.prntArialFl === "Y"}
                    onChange={(e) =>
                      handleFieldChange(
                        "prntArialFl",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                  <FormInput
                    type="radio"
                    label="Payee Lines Only"
                    checked={apSettingInfo.arialLineCd === "P"}
                    onChange={() => handleFieldChange("arialLineCd", "P")}
                  />
                  <FormInput
                    type="radio"
                    label="All Lines"
                    checked={apSettingInfo.arialLineCd === "A"}
                    onChange={() => handleFieldChange("arialLineCd", "A")}
                  />
                </div>
                <div className="mt-2">
                  <FormInput
                    label="Address Line Elimination"
                    value={apSettingInfo.addrElimCd || "Address Line 3"}
                    onChange={(e) =>
                      handleFieldChange("addrElimCd", e.target.value)
                    }
                  />
                </div>
              </FormSection>
            </div>

            {/* Bottom Section: EFT Email Settings */}
            <FormSection title="EFT Email Settings" className="mt-4">
              <div className="space-y-2">
                <FormInput
                  label="FROM Email Address"
                  value={apSettingInfo.frEmailEft || ""}
                  onChange={(e) =>
                    handleFieldChange("frEmailEft", e.target.value)
                  }
                />
                <FormInput
                  label="Email SUBJECT Text"
                  value={apSettingInfo.subjEmailEft || ""}
                  onChange={(e) =>
                    handleFieldChange("subjEmailEft", e.target.value)
                  }
                />
                <FormInput
                  label="Email HEADER Text"
                  value={apSettingInfo.hdrEmailEft || ""}
                  onChange={(e) =>
                    handleFieldChange("hdrEmailEft", e.target.value)
                  }
                />
                <FormInput
                  label="Email FOOTER Text"
                  value={apSettingInfo.ftrEmailEft || ""}
                  onChange={(e) =>
                    handleFieldChange("ftrEmailEft", e.target.value)
                  }
                />
              </div>
            </FormSection>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export default ConfigureEmailSettings;
