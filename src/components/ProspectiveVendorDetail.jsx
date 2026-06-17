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
import {
  MainContainer,
  SecondaryContainer,
  Toolbar,
} from "../helper/container";
import {
  FormSection,
  FormInput,
  ActionDetailButton,
  FormSearchSelect,
} from "../helper/formSection";
import ReusableTable from "../helper/tableSection";
import { backendUrl } from "./config";
import axios from "axios";
import { toast } from "react-toastify";

export const VendorEmployeeDetailP = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  isDirty,
  loading,
  toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("Information");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons
  const [activeSub, setActiveSub] = useState([]);

  const employee = formData.employees?.[0] || {};

  // Helper for deep updates (e.g., updating addresses[0].addrCode)
  const handleEmployeeChange = (field, value) => {
    const updatedEmployees = [...(formData.employees || [])];
    if (updatedEmployees.length === 0) {
      updatedEmployees.push({ [field]: value });
    } else {
      updatedEmployees[0] = { ...updatedEmployees[0], [field]: value };
    }
    // Correctly calls the parent state update
    handleInputChange("employees", updatedEmployees);
  };

  const initialLabor = {
    vendEmplId: "", // Required for API
    vendId: "", // Required for API
    effectStartDt: "", // PK for API
    companyId: "1", // PK for API
    effectEndDt: "",
    dfGenlLabCatCd: "", // Default GLC
    dfGenlLabCatCdDesc: "",
    dfBillLabCatCd: "", // Default PLC
    dfBillLabCatCdDesc: "",
    detlJobCd: "", // Job Title
    detlJobCdDesc: "",
    mgrEmplId: "", // Manager
    mgrEmplIdDesc: "",
    dfltInvcRtAmt: 0, // Rate Amount
    cityName: "",
    countyName: "",
    mailStateDc: "", // State
    postalCd: "",
    countryCd: "",
    modifiedBy: "Admin",
  };

  const glcOptions = [
    { id: "G01", name: "General Labor" },
    { id: "G02", name: "Supervision" },
  ];
  const plcOptions = [{ id: "P01", name: "Professional Level 1" }];
  const jobOptions = [{ id: "ENG", name: "Engineer" }];
  const managerOptions = [{ id: "M101", name: "John Doe" }];
  const stateOptions = [{ id: "M101", name: "John Doe" }];
  const cityOptions = [{ id: "M101", name: "John Doe" }];
  const postalCodeOptions = [{ id: "M101", name: "John Doe" }];

  const mapLaborCodesToNames = (record) => {
    if (!record) return initialLabor;

    const matchedGLC = glcOptions.find((o) => o.id === record.dfGenlLabCatCd);
    const matchedPLC = plcOptions.find((o) => o.id === record.dfBillLabCatCd);
    const matchedJob = jobOptions.find((o) => o.id === record.detlJobCd);
    const matchedMgr = managerOptions.find((o) => o.id === record.mgrEmplId);

    return {
      ...record,
      // Fix dates for HTML input
      effectStartDt: record.effectStartDt?.split("T")[0] || "",
      effectEndDt: record.effectEndDt?.split("T")[0] || "",
      // Map Descriptions
      dfGenlLabCatCdDesc: matchedGLC ? matchedGLC.name : "",
      dfBillLabCatCdDesc: matchedPLC ? matchedPLC.name : "",
      detlJobCdDesc: matchedJob ? matchedJob.name : "",
      mgrEmplIdDesc: matchedMgr ? matchedMgr.name : "",
    };
  };

  const [vendorLaborInfo, setVendorLaborInfo] = useState(initialLabor);

  const fetchLabor = async () => {
    if (!employee.vendId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-employee-labor-info/GetByVendor/${employee.vendId}`,
      );
      if (response.data && response.data.length > 0) {
        const mapped = response.data.map((item) => mapLaborCodesToNames(item));
        setOriginalData(mapped);
        setVendorLaborInfo(mapped[0]);
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  const handleSaveLabor = async () => {
    const payload = {
      ...vendorLaborInfo,
      vendId,
      companyId: companyId || "1",
      modifiedBy: user.name,
      timeStamp: new Date().toISOString(),
    };

    try {
      // Check if it's an update (has a start date)
      const isUpdate = !!vendorLaborInfo.effectStartDt;
      const url = isUpdate
        ? `${backendUrl}/api/vendor-employee-labor-info/${vendorLaborInfo.vendEmplId}/${vendId}/${vendorLaborInfo.effectStartDt}/${payload.companyId}`
        : `${backendUrl}/api/vendor-employee-labor-info`;

      const response = isUpdate
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Labor info saved!");
        fetchLabor();
      }
    } catch (error) {
      toast.error("Save failed");
    }
  };

  useEffect(() => {
    fetchLabor();
  }, [employee.vendId]);

  // 3. Local state change handler
  const handleLaborInfo = (field, value) => {
    setVendorLaborInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  // --- Logic written exactly like your example ---
  const handleClearLabor = () => {
    // 1. Check for unsaved work
    const hasEdits = isDirty;
    const isNewRecord =
      !vendorCisInformations.id &&
      (vendorCisInformations.cisCode || vendorCisInformations.cisType);

    if (!hasEdits && !isNewRecord) {
      // If nothing to discard, just clear the local clipboard
      setClipboard(null);
      toast.info("Clipboard memory cleared.");
      return;
    }

    // 2. Confirmation before losing work
    if (window.confirm("Discard all unsaved changes and new records?")) {
      // Re-fetch original data from API to overwrite local edits
      if (originalData) {
        setVendorCisInformations(originalData);
      } else {
        // If no original data existed (new record), reset to empty
        setVendorCisInformations({
          cisCode: "",
          cisType: "",
          // ... reset other fields
        });
      }

      // Reset UI State
      setIsDirty(false);
      setClipboard(null);

      toast.info("Unsaved changes discarded and clipboard cleared.");
    }
  };

  // --- Toolbar Actions ---

  const handleAddLabor = () => {
    // Initializes an empty record
    setVendorCisInformations({ ...initialCISState });
    setIsDirty(true);
    toast.info("New CIS record initialized.");
  };

  const handleDeleteLabor = async () => {
    // 1. Check if there is an actual record to delete from the database
    const recordId = formData.vendor.vendId;

    if (!recordId) {
      // If there's no ID, it's a new unsaved record, just clear the screen
      setVendorCisInformations({ ...initialCISState });
      setIsDirty(false);
      toast.info("New record cleared.");
      return;
    }

    // 2. Confirmation before API call
    if (
      window.confirm(
        "Are you sure you want to permanently delete this CIS record?",
      )
    ) {
      try {
        // 3. API Call: DELETE https://finaxis-dev.onrender.com/api/VendorCisInformation/{id}
        const response = await axios.delete(
          `${backendUrl}/api/VendorCisInformation/${recordId}`,
        );

        if (response.status === 200 || response.status === 204) {
          // 4. Reset local state on success
          setVendorCisInformations({ ...initialCISState });
          setOriginalData(null);
          setIsDirty(false);
          toast.success("CIS Record deleted successfully.");
        }
      } catch (error) {
        console.error("Delete error:", error.response?.data || error.message);
        toast.error("Failed to delete record from server.");
      }
    }
  };

  const handleCopyLabor = () => {
    setClipboard({ ...vendorCisInformations });
    toast.success("CIS Info copied.");
  };

  const handlePasteLabor = () => {
    if (clipboard) {
      setVendorCisInformations({ ...clipboard });
      setIsDirty(true);
      toast.success("CIS Info pasted.");
    } else {
      toast.error("Clipboard is empty.");
    }
  };

  const handleLaborInfoChange = (field, value) => {
    const updatedCISInfo = [...(formData.vendorCisInformations || [])];
    if (updatedCISInfo.length === 0) {
      updatedCISInfo.push({ [field]: value });
    } else {
      updatedCISInfo[0] = { ...updatedCISInfo[0], [field]: value };
    }
    // handleInputChange("vendorCisInformations", updatedCISInfo);
  };

  const toolbarActionsLabor = {
    onAdd: handleAddLabor,
    onDelete: handleDeleteLabor,
    onCopy: handleCopyLabor,
    onPaste: handlePasteLabor,
    onSave: handleSaveLabor,
    onClear: handleClearLabor,
  };

  return (
    <div className="mt-4 pt-4 border-t-2 border-[#17414d]/20 animate-in slide-in-from-top-2 duration-300">
      {/* <div className="flex justify-between items-center mb-2 px-1">
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
        >
          <X size={16} />
        </button>
      </div> */}

      <MainContainer title="Vendor Employees" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />

        <div className="space-y-3 mt-2">
          {/* Identification Row */}
          <div className="grid grid-cols-2 gap-2">
            <FormInput
              label="Vendor ID"
              value={employee.vendId || ""}
              onChange={(e) => handleEmployeeChange("vendId", e.target.value)}
            />
            <FormInput
              label="Vendor Name"
              required
              value={employee.vendId || ""}
              onChange={(e) => handleEmployeeChange("vendId", e.target.value)}
            />
            <FormInput
              label="Vendor Employee ID"
              value={employee.vendEmplId || ""}
              onChange={(e) =>
                handleEmployeeChange("vendEmplId", e.target.value)
              }
            />
            <FormInput
              label="Vendor Employee Name"
              required
              value={employee.vendEmplName || ""}
              onChange={(e) =>
                handleEmployeeChange("vendEmplName", e.target.value)
              }
            />
            <FormInput
              label="Default GLC"
              value={employee.dfGenlLabCatCd || ""}
              onChange={(e) =>
                handleEmployeeChange("dfGenlLabCatCd", e.target.value)
              }
            />
            <FormInput
              label="Default PLC"
              value={employee.dfBillLabCatCd || ""}
              onChange={(e) =>
                handleEmployeeChange("dfBillLabCatCd", e.target.value)
              }
            />
          </div>

          <div className="border-t border-gray-200 pt-2">
            {/* Tab Navigation */}
            <div className="flex gap-4 px-4 text-[11px] font-bold text-gray-500 mb-1">
              {["Information", "Contacts"].map((tab) => (
                <span
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`cursor-pointer pb-0.5 transition-all ${
                    currentTab === tab
                      ? "text-[#17414d] border-b-2 border-[#17414d]"
                      : "hover:text-[#17414d]"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>

            {currentTab === "Information" && (
              <FormSection className="space-y-4">
                <div className="flex gap-2 w-full">
                  <FormInput
                    label="Last Name"
                    required
                    className="flex-1"
                    value={employee.lastName || ""}
                    onChange={(e) =>
                      handleEmployeeChange("lastName", e.target.value)
                    }
                  />
                  <FormInput
                    label="First Name"
                    required
                    className="flex-1"
                    value={employee.firstName || ""}
                    onChange={(e) =>
                      handleEmployeeChange("firstName", e.target.value)
                    }
                  />
                  <FormInput
                    label="Middle Name"
                    required
                    className="flex-1"
                    value={employee.midName || ""}
                    onChange={(e) =>
                      handleEmployeeChange("midName", e.target.value)
                    }
                  />
                </div>

                <div className="flex gap-4 mt-2">
                  <FormSection
                    title="Vendor Employee Status"
                    className="flex-1"
                  >
                    <div className="flex gap-4">
                      {["Active", "Inactive"].map((status) => (
                        <FormInput
                          key={status}
                          type="radio"
                          label={status}
                          checked={employee.vendEmplStatus === status}
                          // value={employee.vendEmplStatus || ""}
                          onChange={(e) =>
                            handleEmployeeChange(
                              "vendEmplStatus",
                              e.target.value,
                            )
                          }
                        />
                      ))}
                    </div>
                    <FormInput
                      label="Termination Date"
                      value={formData.termDate}
                      onChange={(e) =>
                        handleInputChange("termDate", e.target.value)
                      }
                    />
                  </FormSection>

                  <FormSection title="Approval Criteria" className="flex-1">
                    <FormInput
                      label="Approver ID"
                      value={employee.vendEmplAprvrId || ""}
                      onChange={(e) =>
                        handleEmployeeChange("vendEmplAprvrId", e.target.value)
                      }
                    />
                    <FormInput
                      label="Approval Status"
                      value={employee.vendEmplAprvlCd || ""}
                      onChange={(e) =>
                        handleEmployeeChange("vendEmplAprvlCd", e.target.value)
                      }
                    />
                    <FormInput
                      label="Status Date"
                      value={employee.vendEmplAprvlDt || ""}
                      onChange={(e) =>
                        handleEmployeeChange("vendEmplAprvlDt", e.target.value)
                      }
                    />
                  </FormSection>
                </div>
              </FormSection>
            )}

            {currentTab === "Contacts" && (
              <div className="gap-4 py-2 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-2">
                  <FormSection title="E-Mail Addresses">
                    <FormInput
                      label="Internal"
                      type="email"
                      value={employee.intEmail || ""}
                      onChange={(e) =>
                        handleEmployeeChange("intEmail", e.target.value)
                      }
                    />
                    <FormInput
                      label="External"
                      type="email"
                      value={employee.extEmail || ""}
                      onChange={(e) =>
                        handleEmployeeChange("extEmail", e.target.value)
                      }
                    />
                  </FormSection>
                  <FormSection title="Phone Numbers">
                    <FormInput
                      label="Internal"
                      value={employee.intPhone || ""}
                      onChange={(e) =>
                        handleEmployeeChange("extEmail", e.target.value)
                      }
                      required
                    />
                    <FormInput
                      label="External"
                      value={employee.extPhone || ""}
                      onChange={(e) =>
                        handleEmployeeChange("extEmail", e.target.value)
                      }
                    />
                    <FormInput
                      label="Mobile"
                      value={employee.cellPhone || ""}
                      onChange={(e) =>
                        handleEmployeeChange("extEmail", e.target.value)
                      }
                    />
                  </FormSection>
                </div>
                {/* <div className="col-span-2 grid grid-cols-2 gap-8 border-t border-gray-200 mt-2 pt-2">
                  <FormSection title="EmergencyContacts">
                    <FormInput label="Contact1" required />
                    <FormInput label="Name" />
                    <FormInput label="Relationship" />
                    <FormInput label="Phone 1" />
                    <FormInput label="Phone 2" />
                    <FormInput label="Phone 3" />
                    <FormInput label="Contact2" required />
                    <FormInput label="Name" />
                    <FormInput label="Relationship" />
                    <FormInput label="Phone 1" />
                    <FormInput label="Phone 2" />
                    <FormInput label="Phone 3" />
                  </FormSection>
                </div> */}
                <div className="col-span-2 border-t border-gray-200 mt-2 pt-2">
                  <FormSection title="Emergency Contacts">
                    {/* Flex container to create two columns */}
                    <div className="flex gap-8">
                      {/* Contact 1 Column */}
                      <div className="flex-1 space-y-1">
                        {/* <FormInput
                          label="Contact 1"
                          value={employee.cellPhone || ""}
                          onChange={(e) =>
                            handleEmployeeChange("extEmail", e.target.value)
                          }
                          required
                        /> */}
                        <p>Contact 1</p>
                        <FormInput
                          label="Name"
                          value={employee.cont1Name || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont1Name", e.target.value)
                          }
                        />
                        <FormInput
                          label="Relationship"
                          value={employee.cont1Rel || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont1Rel", e.target.value)
                          }
                        />
                        <FormInput
                          label="Phone 1"
                          value={employee.cont1Phone1 || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont1Phone1", e.target.value)
                          }
                        />
                        <FormInput
                          label="Phone 2"
                          value={employee.cont1Phone2 || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont1Phone2", e.target.value)
                          }
                        />
                        <FormInput
                          label="Phone 3"
                          value={employee.cont1Phone3 || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont1Phone3", e.target.value)
                          }
                        />
                      </div>

                      {/* Vertical Divider (Optional) */}
                      <div className="w-[1px] bg-gray-200 self-stretch"></div>

                      {/* Contact 2 Column */}
                      <div className="flex-1 space-y-1">
                        {/* <FormInput label="Contact 2" required /> */}
                        <p>Contact 2</p>
                        <FormInput
                          label="Name"
                          value={employee.cont2Name || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont2Name", e.target.value)
                          }
                        />
                        <FormInput
                          label="Relationship"
                          value={employee.cont2Rel || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont2Rel", e.target.value)
                          }
                        />
                        <FormInput
                          label="Phone 1"
                          value={employee.cont2Phone1 || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont2Phone1", e.target.value)
                          }
                        />
                        <FormInput
                          label="Phone 2"
                          value={employee.cont2Phone2 || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont2Phone2", e.target.value)
                          }
                        />
                        <FormInput
                          label="Phone 3"
                          value={employee.cont2Phone3 || ""}
                          onChange={(e) =>
                            handleEmployeeChange("cont2Phone3", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </FormSection>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions - This handles the second level of modals */}
          <div className="flex flex-wrap gap-1 p-1.5 ">
            <ActionDetailButton
              label="Labor Information and History"
              icon={History}
              isActive={activeSubModal.includes("Labor")}
              onClick={() =>
                setActiveSubModal((prevArray) => [...prevArray, "Labor"])
              }
            />
            <ActionDetailButton
              label="Certifications"
              icon={Award}
              isActive={activeSubModal.includes("Certification")}
              onClick={() =>
                setActiveSubModal((prevArray) => [
                  ...prevArray,
                  "Certification",
                ])
              }
            />
            <ActionDetailButton
              label="Skills"
              icon={ShieldCheck}
              isActive={activeSubModal.includes("Skills")}
              onClick={() =>
                setActiveSubModal((prevArray) => [...prevArray, "Skills"])
              }
            />
            <ActionDetailButton
              label="Trainings"
              icon={GraduationCap}
              isActive={activeSubModal.includes("Trainings")}
              onClick={() =>
                setActiveSubModal((prevArray) => [...prevArray, "Trainings"])
              }
            />
            {/* <ActionDetailButton
              label="Security"
              icon={Lock}
              isActive={activeSubModal === "Security"}
              onClick={() => setActiveSubModal("Security")}
            /> */}
            <ActionDetailButton
              label="Properties"
              icon={Settings2}
              isActive={activeSubModal.includes("Properties")}
              onClick={() =>
                setActiveSubModal((prevArray) => [...prevArray, "Properties"])
              }
            />
          </div>

          {/* Render the inner view based on activeSubModal */}
          {activeSubModal.includes("Properties") && (
            <MainContainer
              title={"Properties"}
              handleClose={() =>
                setActiveSubModal((prev) =>
                  prev.filter((item) => item !== "Properties"),
                )
              }
            >
              <div>
                <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                  <FormSearchSelect
                    label="Item"
                    options={[]}
                    required
                    onSelect={(val) => handleInputChange("skill", val)}
                  />
                  <FormInput type="text" value={formData.sklldesc} readOnly />
                  <FormInput
                    label="Quantity"
                    type="number"
                    required
                    value={formData.qunt}
                  />
                  <FormSection title="Ownership">
                    <input></input>
                  </FormSection>
                  <FormInput
                    label="Issue Date"
                    type="date"
                    required
                    value={formData.lrenDte}
                    onChange={(e) =>
                      handleInputChange("lrenDte", e.target.value)
                    }
                  />
                  <FormInput
                    label="Warehouse"
                    type="number"
                    value={formData.qunt}
                  />
                  <FormInput
                    label="Return Date"
                    type="date"
                    value={formData.lrenDte}
                    onChange={(e) =>
                      handleInputChange("lrenDte", e.target.value)
                    }
                  />
                  <FormInput
                    label="Stock Number"
                    type="number"
                    value={formData.qunt}
                  />
                  <FormInput
                    label="Other"
                    type="number"
                    value={formData.qunt}
                  />
                </div>
                <div className="mt-2">
                  <FormSection title="Fixed Assets Information">
                    <div className="grid grid-cols-4 gap-x-8 gap-y-2 ">
                      <FormInput
                        label="Asset No"
                        type="number"
                        readOnly
                        value={formData.qunt}
                      />
                      <FormInput
                        label="Item No"
                        readOnly
                        type="number"
                        value={formData.qunt}
                      />
                      <FormSearchSelect
                        label="Manufacturer"
                        options={[]}
                        readOnly
                        onSelect={(val) => handleInputChange("skill", val)}
                      />
                      <FormInput
                        type="text"
                        value={formData.sklldesc}
                        readOnly
                      />
                      <FormInput
                        label="Model No"
                        type="text"
                        value={formData.sklldesc}
                        readOnly
                      />
                      <FormInput
                        label="Serial No"
                        type="text"
                        value={formData.sklldesc}
                        readOnly
                      />
                    </div>
                  </FormSection>
                </div>
              </div>
            </MainContainer>
          )}

          {activeSubModal.includes("Trainings") && (
            <MainContainer
              title={"Trainings"}
              handleClose={() =>
                setActiveSubModal((prev) =>
                  prev.filter((item) => item !== "Trainings"),
                )
              }
            >
              <div>
                <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                  <FormSearchSelect
                    label="Training"
                    options={[]}
                    required
                    onSelect={(val) => handleInputChange("skill", val)}
                  />
                  <FormInput type="text" value={formData.sklldesc} readOnly />
                  <FormInput
                    label="CEU Credits"
                    type="number"
                    value={formData.yexp}
                  />
                  <FormSearchSelect
                    label="Training Source"
                    options={[]}
                    required
                    onSelect={(val) => handleInputChange("skill", val)}
                  />
                  <FormInput type="text" value={formData.sklldesc} readOnly />
                  <FormInput
                    label="CEU Credits Earned"
                    type="number"
                    value={formData.yexp}
                  />
                </div>
                <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                  <FormInput
                    label="Start Date"
                    type="date"
                    required
                    value={formData.laborEffDate}
                    onChange={(e) =>
                      handleInputChange("laborEffDate", e.target.value)
                    }
                  />
                  <FormInput
                    label="End Date"
                    type="date"
                    required
                    value={formData.laborEffDate}
                    onChange={(e) =>
                      handleInputChange("laborEffDate", e.target.value)
                    }
                  />
                  <FormInput
                    label="Years of Experience"
                    type="number"
                    value={formData.yexp}
                  />
                  <FormSearchSelect
                    label="Internal/External"
                    options={[]}
                    required
                    onSelect={(val) => handleInputChange("skill", val)}
                  />
                </div>
                <div className="grid grid-cols-4 col-span-3 gap-x-8 gap-y-2">
                  <FormInput
                    label="Last Renewal Date"
                    type="date"
                    required
                    value={formData.lrenDte}
                    onChange={(e) =>
                      handleInputChange("lrenDte", e.target.value)
                    }
                  />
                  <FormInput
                    label="Expiration Date"
                    type="date"
                    required
                    value={formData.lrenDte}
                    onChange={(e) =>
                      handleInputChange("lrenDte", e.target.value)
                    }
                  />
                </div>
              </div>
            </MainContainer>
          )}

          {activeSubModal.includes("Skills") && (
            <MainContainer
              title={"Skills"}
              handleClose={() =>
                setActiveSubModal((prev) =>
                  prev.filter((item) => item !== "Skills"),
                )
              }
            >
              <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                <FormSearchSelect
                  label="Skill"
                  options={[]}
                  required
                  onSelect={(val) => handleInputChange("skill", val)}
                />
                <FormInput type="text" value={formData.sklldesc} readOnly />
                <FormInput
                  label="Years of Experience"
                  type="number"
                  value={formData.yexp}
                />
                <FormInput
                  label="Last Renewal Date"
                  type="date"
                  required
                  value={formData.lrenDte}
                  onChange={(e) => handleInputChange("lrenDte", e.target.value)}
                />

                <FormSearchSelect
                  label="Skill Level"
                  options={[]}
                  required
                  onSelect={(val) => handleInputChange("skilllvl", val)}
                />
                <FormInput type="text" value={formData.sklllvldesc} readOnly />
                <FormInput
                  label="Completion Date"
                  type="date"
                  required
                  value={formData.lrenDte}
                  onChange={(e) => handleInputChange("lrenDte", e.target.value)}
                />
                <FormInput
                  label="Expiration Date"
                  type="date"
                  required
                  value={formData.lrenDte}
                  onChange={(e) => handleInputChange("lrenDte", e.target.value)}
                />
              </div>
            </MainContainer>
          )}

          {activeSubModal.includes("Certification") && (
            <MainContainer
              title={"Certification"}
              handleClose={() =>
                setActiveSubModal((prev) =>
                  prev.filter((item) => item !== "Certification"),
                )
              }
            >
              <div className="">
                {/* <div className="gap-x-8 gap-y-2"> */}
                <FormInput
                  label="Certificate"
                  type="text"
                  required
                  value={formData.certficate}
                  onChange={(e) =>
                    handleInputChange("certifcate", e.target.value)
                  }
                />
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <FormSearchSelect
                    label="Professional Organization"
                    options={[]}
                    required
                    onSelect={(val) => handleInputChange("proforg", val)}
                  />
                  <FormInput type="text" value={formData.orgdesc} readOnly />
                </div>
                <FormSearchSelect
                  label="State/Province"
                  options={[]}
                  required
                  onSelect={(val) => handleInputChange("state", val)}
                />

                <FormInput
                  label="License Number"
                  type="text"
                  required
                  value={formData.licNo}
                  onChange={(e) => handleInputChange("licNo", e.target.value)}
                />
                <FormInput
                  label="Years"
                  type="number"
                  value={formData.year}
                  readOnly
                />
                <FormInput
                  label="Expiration Date"
                  type="date"
                  required
                  value={formData.expDte}
                  onChange={(e) => handleInputChange("expDte", e.target.value)}
                />
                <FormInput
                  label="Last Renewal Date"
                  type="date"
                  required
                  value={formData.lrenDte}
                  onChange={(e) => handleInputChange("lrenDte", e.target.value)}
                />
              </div>
            </MainContainer>
          )}

          {activeSubModal.includes("Labor") && (
            <MainContainer
              title="Labor Information"
              handleClose={() =>
                setActiveSubModal((prev) => prev.filter((i) => i !== "Labor"))
              }
            >
              <Toolbar
                isDirty={isDirty}
                actions={toolbarActionsLabor}
                isFormView={isFormView}
              />

              <div className="space-y-4 p-4">
                <FormSection title="Effective Dates">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Start Date"
                      type="date"
                      value={vendorLaborInfo.effectStartDt}
                      onChange={(e) =>
                        handleLaborInfo("effectStartDt", e.target.value)
                      }
                    />
                    <FormInput
                      label="End Date"
                      type="date"
                      value={vendorLaborInfo.effectEndDt}
                      onChange={(e) =>
                        handleLaborInfo("effectEndDt", e.target.value)
                      }
                    />
                  </div>
                </FormSection>

                <FormSection title="Classification & Assignments">
                  <div className="grid grid-cols-2 gap-4">
                    {/* GLC */}
                    <FormSearchSelect
                      label="Default GLC"
                      options={glcOptions}
                      value={vendorLaborInfo.dfGenlLabCatCd}
                      onSelect={(val) => {
                        handleLaborInfo("dfGenlLabCatCd", val.id);
                        handleLaborInfo("dfGenlLabCatCdDesc", val.name);
                      }}
                    />
                    <FormInput
                      label="GLC Description"
                      value={vendorLaborInfo.dfGenlLabCatCdDesc}
                      readOnly
                    />

                    {/* PLC */}
                    <FormSearchSelect
                      label="Default PLC"
                      options={plcOptions}
                      value={vendorLaborInfo.dfBillLabCatCd}
                      onSelect={(val) => {
                        handleLaborInfo("dfBillLabCatCd", val.id);
                        handleLaborInfo("dfBillLabCatCdDesc", val.name);
                      }}
                    />
                    <FormInput
                      label="PLC Description"
                      value={vendorLaborInfo.dfBillLabCatCdDesc}
                      readOnly
                    />

                    {/* Job Title */}
                    <FormSearchSelect
                      label="Job Title"
                      options={jobOptions}
                      value={vendorLaborInfo.detlJobCd}
                      onSelect={(val) => {
                        handleLaborInfo("detlJobCd", val.id);
                        handleLaborInfo("detlJobCdDesc", val.name);
                      }}
                    />
                    <FormInput
                      label="Job Description"
                      value={vendorLaborInfo.detlJobCdDesc}
                      readOnly
                    />

                    {/* Manager */}
                    <FormSearchSelect
                      label="Manager"
                      options={managerOptions}
                      value={vendorLaborInfo.mgrEmplId}
                      onSelect={(val) => {
                        handleLaborInfo("mgrEmplId", val.id);
                        handleLaborInfo("mgrEmplIdDesc", val.name);
                      }}
                    />
                    <FormInput
                      label="Manager Name"
                      value={vendorLaborInfo.mgrEmplIdDesc}
                      readOnly
                    />
                  </div>
                </FormSection>

                <FormSection title="Location Details">
                  <div className="grid grid-cols-3 gap-4">
                    <FormInput
                      label="City"
                      value={vendorLaborInfo.cityName}
                      onChange={(e) =>
                        handleLaborInfo("cityName", e.target.value)
                      }
                    />
                    <FormInput
                      label="Country"
                      type="text"
                      value={formData.city}
                      readOnly
                    />
                    <FormInput
                      label="State"
                      value={vendorLaborInfo.mailStateDc}
                      onChange={(e) =>
                        handleLaborInfo("mailStateDc", e.target.value)
                      }
                    />
                    <FormInput
                      label="Postal Code"
                      value={vendorLaborInfo.postalCd}
                      onChange={(e) =>
                        handleLaborInfo("postalCd", e.target.value)
                      }
                    />
                  </div>
                </FormSection>

                <ActionDetailButton
                  label="Rates"
                  onClick={() => setActiveSub(["defTranInvRat"])}
                  isActive={activeSub.includes("defTranInvRat")}
                />
              </div>

              {activeSub.includes("defTranInvRat") && (
                <MainContainer
                  title="Rates"
                  handleClose={() => setActiveSub([])}
                >
                  <FormInput
                    label="Invoice Rate"
                    type="number"
                    value={vendorLaborInfo.dfltInvcRtAmt}
                    onChange={(e) =>
                      handleLaborInfo(
                        "dfltInvcRtAmt",
                        parseFloat(e.target.value),
                      )
                    }
                  />
                </MainContainer>
              )}
            </MainContainer>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export const AddressesP = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  isDirty,
  loading,
  toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons

  // Helper to safely access the first address or provide defaults
  const address = formData.addresses?.[0] || {};

  // Helper for deep updates (e.g., updating addresses[0].addrCode)
  const handleAddressChange = (field, value) => {
    const updatedAddresses = [...(formData.addresses || [])];
    if (updatedAddresses.length === 0) {
      updatedAddresses.push({ [field]: value });
    } else {
      updatedAddresses[0] = { ...updatedAddresses[0], [field]: value };
    }
    handleInputChange("addresses", updatedAddresses);
  };

  const handleContactChange = (field, value) => {
    const updatedAddresses = [...formData.addresses];
    const firstAddr = { ...updatedAddresses[0] };
    const updatedContacts = [...(firstAddr.contacts || [])];

    if (updatedContacts.length === 0) {
      updatedContacts.push({ [field]: value });
    } else {
      updatedContacts[0] = { ...updatedContacts[0], [field]: value };
    }

    firstAddr.contacts = updatedContacts;
    updatedAddresses[0] = firstAddr;
    handleInputChange("addresses", updatedAddresses);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer title="Adresses" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />

        {/* Bottom Section: Detail Form */}
        <FormSection>
          <div className="mt-2">
            <div className="grid grid-cols-3 gap-x-8 gap-y-2">
              <FormInput
                label="Address Code"
                required
                value={address.addrCode || ""}
                onChange={(e) =>
                  handleAddressChange("addrCode", e.target.value)
                }
              />
              <FormSearchSelect
                label="Payment Address"
                required
                options={[
                  { id: "", name: "Select" },
                  { id: "D", name: "Default" },
                  { id: "Y", name: "Yes" },
                  { id: "N", name: "No" },
                ]}
                onSelect={(val) => handleInputChange("addressType", val.name)}
              />
              <FormSearchSelect
                label="Order Address"
                required
                options={[
                  { id: "", name: "Select" },
                  { id: "D", name: "Default" },
                  { id: "Y", name: "Yes" },
                  { id: "N", name: "No" },
                ]}
                onSelect={(val) => handleInputChange("addressType", val.name)}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <FormInput
                label="Address Line 1"
                value={address.addressLine1 || ""}
                onChange={(e) =>
                  handleAddressChange("addressLine1", e.target.value)
                }
              />
              <FormInput
                label="Phone Number"
                type="number"
                value={address.phoneNumber || ""}
                onChange={(e) =>
                  handleAddressChange("phoneNumber", e.target.value)
                }
              />
              <FormInput
                label="Address Line 2"
                value={address.addressLine2 || ""}
                onChange={(e) =>
                  handleAddressChange("addressLine2", e.target.value)
                }
              />
              <FormInput
                label="Fax Number"
                type="number"
                value={address.faxNo || ""}
                onChange={(e) => handleAddressChange("faxNo", e.target.value)}
              />
              <FormInput
                label="Address Line 3"
                value={address.addressLine3 || ""}
                onChange={(e) =>
                  handleAddressChange("addressLine3", e.target.value)
                }
              />
              <FormInput
                label="Other Number"
                type="number"
                value={formData.address1}
                onChange={(e) =>
                  handleAddressChange("address1", e.target.value)
                }
              />
              <FormSearchSelect
                label="City"
                options={[]}
                //city list
                onSelect={(val) => handleAddressChange("cityName", val.name)}
                displayKey="name"
              />
              <FormInput
                label="Email"
                type="email"
                className="w-full"
                value={address.emailId || ""}
                onChange={(e) => handleAddressChange("emailId", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <FormSearchSelect
                label="State"
                options={[]}
                //state list
                onSelect={(val) => handleAddressChange("stateCode", val.name)}
                displayKey="name"
              />
              <FormSearchSelect
                label="Postal Code"
                options={[]}
                //code list
                onSelect={(val) => handleAddressChange("postalCode", val.name)}
                displayKey="name"
              />
              <FormInput
                label="Congressional District Code"
                value={formData.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
              />
              <FormSearchSelect
                label="Country"
                options={[]}
                //state list
                displayKey="name"
                onSelect={(val) => handleAddressChange("country", val.name)}
              />
              <FormSearchSelect
                label="Sales/Use Tax Code"
                options={[]}
                onSelect={(val) => handleAddressChange("countryCode", val.name)}
              />
              <FormInput value={formData.phone} readOnly />
              <FormInput
                label="Ship ID"
                value={formData.fax}
                onChange={(e) => handleAddressChange("fax", e.target.value)}
              />
              <FormInput
                value={formData.fax}
                onChange={(e) => handleAddressChange("fax", e.target.value)}
                disabled
              />
              <FormInput
                label="Password"
                type="password"
                value={formData.pass}
                onChange={(e) => handleAddressChange("pass", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <FormInput
                label="UEI Number"
                value={formData.ueiNo}
                onChange={(e) => handleAddressChange("ueiNo", e.target.value)}
              />
              <FormInput
                label="CAGE Code"
                value={formData.cageCd}
                onChange={(e) => handleAddressChange("cageCd", e.target.value)}
              />
              <FormInput
                type="checkbox"
                label="Ship ID Active"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleAddressChange("holdPayments", e.target.checked)
                }
              />
              <FormInput
                type="checkbox"
                label="US EFT Active"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleAddressChange("holdPayments", e.target.checked)
                }
              />
              <FormInput
                type="checkbox"
                label="Non-US EFT Active"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleAddressChange("holdPayments", e.target.checked)
                }
              />
            </div>
          </div>
        </FormSection>
        <div className="flex flex-wrap gap-1 p-1.5">
          <ActionDetailButton
            label="Contacts"
            icon={History}
            isActive={activeSubModal.includes("Contacts")}
            onClick={() =>
              setActiveSubModal((prevArray) => [...prevArray, "Contacts"])
            }
          />
        </div>

        {activeSubModal.includes("Contacts") && (
          <MainContainer
            className="mt-2"
            title="Contacts"
            handleClose={() =>
              setActiveSubModal((prev) =>
                prev.filter((item) => item !== "Contacts"),
              )
            }
          >
            <div className="space-y-3 mt-2">
              {/* Identification Row */}
              <FormSection title="Contact Information">
                <div className="grid grid-cols-4 gap-x-8 gap-y-2">
                  {/* Row 1: Phone & Fax */}
                  <FormInput
                    label="Line"
                    type="text"
                    // value={address.contacts?.[0]?.sequenceNo || ""}
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.sequenceNo || ""
                    }
                    onChange={(e) =>
                      handleContactChange("sequenceNo", e.target.value)
                    }
                  />
                  <FormInput
                    label="Last Name"
                    type="text"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.contactLastName ||
                      ""
                    }
                    onChange={(e) =>
                      handleContactChange("contactLastName", e.target.value)
                    }
                  />
                  <FormInput
                    label="First Name"
                    type="text"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]
                        ?.contactFirstName || ""
                    }
                    onChange={(e) =>
                      handleContactChange("contactFirstName", e.target.value)
                    }
                  />
                  <FormInput
                    label="Title"
                    type="text"
                    value={formData.fax || ""}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />

                  <FormInput
                    label="Phone Number"
                    type="number"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.phoneNumber || ""
                    }
                    onChange={(e) =>
                      handleContactChange("phoneNumber", e.target.value)
                    }
                  />
                  <FormInput
                    label="Fax Number"
                    type="number"
                    value={formData.fax || ""}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />
                  <FormInput
                    label="Other Number"
                    type="number"
                    value={formData.fax || ""}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />
                  <FormInput
                    label="E-mail Address"
                    type="email"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.emailId || ""
                    }
                    onChange={(e) =>
                      handleContactChange("emailId", e.target.value)
                    }
                  />

                  {/* Row 2: Email (Spanning 2 columns for better readability) */}
                  <div className="col-span-2">
                    <FormInput
                      label="Notes"
                      type="text"
                      value={
                        formData.addresses?.[0]?.contacts?.[0]?.notes || ""
                      }
                      onChange={(e) =>
                        handleContactChange("notes", e.target.value)
                      }
                    />
                  </div>
                </div>
              </FormSection>
            </div>
          </MainContainer>
        )}

        {activeSubModal.includes("EFTI(NONUS)") && (
          <MainContainer
            className="mt-4"
            title="EFT Info (Non-US)"
            handleClose={() =>
              setActiveSubModal((prev) =>
                prev.filter((item) => item !== "EFTI(NONUS)"),
              )
            }
          >
            <div className="space-y-4">
              <div className="gap-x-8 gap-y-4">
                <FormInput
                  type="checkbox"
                  label="Use Bank ID/Bank Acct/ACH Code from Employee's Direct Deposit Banks"
                  checked={formData.holdPayments}
                  onChange={(e) =>
                    handleInputChange("holdPayments", e.target.checked)
                  }
                />
                <FormSearchSelect
                  label="Bank ID"
                  options={[]}
                  required
                  onSelect={(val) => handleInputChange("bankId", val)}
                />
                <FormInput
                  label="Bank Account"
                  type="text"
                  required
                  value={formData.bankAcc || ""}
                  onChange={(e) => handleInputChange("bankAcc", e.target.value)}
                />
                <FormInput
                  label="Non-US Bank Account"
                  type="text"
                  required
                  value={formData.nonbankAcc || ""}
                  onChange={(e) =>
                    handleInputChange("nonbankAcc", e.target.value)
                  }
                />
                <FormInput
                  type="text"
                  label="Bank Refernce"
                  value={formData.bankDesc || ""}
                  readOnly
                />
                <FormInput
                  type="text"
                  label="Originator ID Code"
                  value={formData.bankDesc || ""}
                  readOnly
                />
                <FormInput
                  type="text"
                  label="IBAN Code"
                  value={formData.bankDesc || ""}
                  readOnly
                />
                <FormInput
                  type="text"
                  label="SWIFT Code"
                  value={formData.bankDesc || ""}
                  readOnly
                />
                <FormSearchSelect
                  label="ACH Code"
                  options={[]}
                  onSelect={(val) => handleInputChange("state", val)}
                  readOnly
                />
                <FormSearchSelect
                  label="Intermediary Bank ID"
                  options={[]}
                  onSelect={(val) => handleInputChange("state", val)}
                  readOnly
                />
                <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                  <FormInput
                    type="checkbox"
                    label="EFT Active"
                    checked={formData.holdPayments}
                    onChange={(e) =>
                      handleInputChange("holdPayments", e.target.checked)
                    }
                  />
                  <FormInput
                    type="checkbox"
                    label="Print EFT Advice"
                    checked={formData.holdPayments}
                    onChange={(e) =>
                      handleInputChange("holdPayments", e.target.checked)
                    }
                  />
                  <FormInput
                    type="checkbox"
                    label="Email EFT Advice"
                    checked={formData.holdPayments}
                    onChange={(e) =>
                      handleInputChange("holdPayments", e.target.checked)
                    }
                  />

                  <FormInput
                    label="EFT Pmt Type"
                    type="text"
                    value={formData.eftPmtType || ""}
                    onChange={(e) =>
                      handleInputChange("eftPmtType", e.target.value)
                    }
                  />
                  <FormInput
                    label="Password"
                    type="password"
                    value={formData.bankPassword || ""}
                    onChange={(e) =>
                      handleInputChange("bankPassword", e.target.value)
                    }
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 italic">
                Note: Non-US Bank Accounts can be used to create outgoing IAT
                ACH files in Costpoint...
              </p>
            </div>
          </MainContainer>
        )}

        {activeSubModal.includes("EFTI(US)") && (
          <MainContainer
            className="mt-4"
            title="EFT Info (US)"
            handleClose={() =>
              setActiveSubModal((prev) =>
                prev.filter((item) => item !== "EFTI(US)"),
              )
            }
          >
            <div className="gap-x-8 gap-y-4">
              <FormInput
                type="checkbox"
                label="Use Bank ID/Bank Acct/ACH Code from Employee's Direct Deposit Banks"
                checked={formData.holdPayments}
                onChange={(e) =>
                  handleInputChange("holdPayments", e.target.checked)
                }
              />
              <FormSearchSelect
                label="Bank ID"
                options={[]}
                required
                onSelect={(val) => handleInputChange("bankId", val)}
              />
              <FormInput
                label="Bank Account"
                type="text"
                required
                value={formData.bankAcc || ""}
                onChange={(e) => handleInputChange("bankAcc", e.target.value)}
              />
              <FormInput
                label="Non-US Bank Account"
                type="text"
                required
                value={formData.nonbankAcc || ""}
                onChange={(e) =>
                  handleInputChange("nonbankAcc", e.target.value)
                }
              />
              <FormInput
                type="text"
                label="Bank Refernce"
                value={formData.bankDesc || ""}
                readOnly
              />
              <FormInput
                type="text"
                label="Originator ID Code"
                value={formData.bankDesc || ""}
                readOnly
              />
              <FormInput
                type="text"
                label="IBAN Code"
                value={formData.bankDesc || ""}
                readOnly
              />
              <FormInput
                type="text"
                label="SWIFT Code"
                value={formData.bankDesc || ""}
                readOnly
              />
              <FormSearchSelect
                label="ACH Code"
                options={[]}
                onSelect={(val) => handleInputChange("state", val)}
                readOnly
              />
              <FormSearchSelect
                label="Intermediary Bank ID"
                options={[]}
                onSelect={(val) => handleInputChange("state", val)}
                readOnly
              />
              <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                <FormInput
                  type="checkbox"
                  label="EFT Active"
                  checked={formData.holdPayments}
                  onChange={(e) =>
                    handleInputChange("holdPayments", e.target.checked)
                  }
                />
                <FormInput
                  type="checkbox"
                  label="Print EFT Advice"
                  checked={formData.holdPayments}
                  onChange={(e) =>
                    handleInputChange("holdPayments", e.target.checked)
                  }
                />
                <FormInput
                  type="checkbox"
                  label="Email EFT Advice"
                  checked={formData.holdPayments}
                  onChange={(e) =>
                    handleInputChange("holdPayments", e.target.checked)
                  }
                />

                <FormInput
                  label="EFT Pmt Type"
                  type="text"
                  value={formData.eftPmtType || ""}
                  onChange={(e) =>
                    handleInputChange("eftPmtType", e.target.value)
                  }
                />
                <FormInput
                  label="Password"
                  type="password"
                  value={formData.bankPassword || ""}
                  onChange={(e) =>
                    handleInputChange("bankPassword", e.target.value)
                  }
                />
              </div>
            </div>
          </MainContainer>
        )}
      </MainContainer>
    </div>
  );
};

export const Activities = ({ formData, onClose, isFormView, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const vendId = formData?.vendor?.vendId || formData?.vendId;
  const companyId = formData?.companyId || "1";

  // 1. Updated Initial State based on "Manage Activities" UI
  const initialActivityState = {
    activityId: "",
    description: "",
    priority: "-None-",
    completed: false,
    completedDate: "",
    subject: "",
    location: "",
    startTime: "",
    endTime: "",
    allDayEvent: false,
    activityOwner: "",
    method: "",
    opportunityId: "",
    contractId: "",
    subcontractId: "",
    notes: "",
    companyId: companyId,
    vendId: vendId,
    modifiedBy: user.name || "Admin",
  };

  const [activityState, setActivityState] = useState(initialActivityState);

  // 2. Fetch Logic
  const fetchActivity = async () => {
    if (!vendId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-activities/${companyId}/${vendId}`,
      );
      if (response.data) {
        const record = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (record) {
          // Format dates/times for inputs (YYYY-MM-DDTHH:mm)
          const formattedRecord = {
            ...record,
            startTime: record.startTime?.split(".")[0] || "",
            endTime: record.endTime?.split(".")[0] || "",
            completedDate: record.completedDate?.split("T")[0] || "",
          };
          setActivityState(formattedRecord);
          setOriginalData(formattedRecord);
        }
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [vendId]);

  const handleStateChange = (field, value) => {
    setActivityState((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  // 3. Unified Save (POST/PUT) Logic
  const handleSave = async () => {
    if (!vendId) return toast.error("No Vendor ID associated.");
    try {
      const isUpdate = !!originalData;
      const url = isUpdate
        ? `${backendUrl}/api/vendor-activities/${companyId}/${vendId}`
        : `${backendUrl}/api/vendor-activities`;

      const response = await axios({
        method: isUpdate ? "put" : "post",
        url: url,
        data: { ...activityState, modifiedBy: user.name },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Activity saved successfully!");
        setIsDirty(false);
        fetchActivity();
      }
    } catch (error) {
      toast.error("Error saving activity.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setActivityState(initialActivityState);
      setIsDirty(true);
    },
    onDelete: async () => {
      if (window.confirm("Delete this activity?")) {
        try {
          await axios.delete(
            `${backendUrl}/api/vendor-activities/${companyId}/${vendId}`,
          );
          setActivityState(initialActivityState);
          toast.success("Deleted.");
        } catch {
          toast.error("Delete failed.");
        }
      }
    },
    onCopy: () => {
      setClipboard({ ...activityState });
      toast.info("Copied.");
    },
    onPaste: () => clipboard && setActivityState({ ...clipboard }),
    onSave: handleSave,
    onClear: () => {
      if (window.confirm("Discard changes?")) {
        setActivityState(originalData || initialActivityState);
        setIsDirty(false);
      }
    },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Manage Activities" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
        />

        <div className="p-2 mt-2">
          {/* Section 1: IDs and Basic Info */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <FormInput
              label="Activity ID"
              value={activityState.activityId}
              onChange={(e) => handleStateChange("activityId", e.target.value)}
            />
            <FormInput
              label="Description"
              value={activityState.description}
              onChange={(e) => handleStateChange("description", e.target.value)}
            />

            <FormSearchSelect
              label="Priority"
              options={[
                { id: "High", name: "High" },
                { id: "Medium", name: "Medium" },
                { id: "Low", name: "Low" },
              ]}
              value={activityState.priority}
              onSelect={(val) => handleStateChange("priority", val.id)}
            />

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={activityState.completed}
                  onChange={(e) =>
                    handleStateChange("completed", e.target.checked)
                  }
                  className="mr-2"
                />
                <span className="text-xs font-semibold text-gray-600">
                  Completed
                </span>
              </div>
              <FormInput
                label="Completed Date"
                type="date"
                value={activityState.completedDate}
                onChange={(e) =>
                  handleStateChange("completedDate", e.target.value)
                }
              />
            </div>
          </div>

          {/* Section 2: Subject and Location */}
          <div className="mt-2 space-y-1">
            <FormInput
              label="Subject"
              value={activityState.subject}
              onChange={(e) => handleStateChange("subject", e.target.value)}
              fullWidth
            />
            <FormInput
              label="Location"
              value={activityState.location}
              onChange={(e) => handleStateChange("location", e.target.value)}
              fullWidth
            />
          </div>

          {/* Section 3: Timing */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
            <div className="flex items-center space-x-2">
              <FormInput
                label="Start Time"
                type="datetime-local"
                value={activityState.startTime}
                onChange={(e) => handleStateChange("startTime", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={activityState.allDayEvent}
                  onChange={(e) =>
                    handleStateChange("allDayEvent", e.target.checked)
                  }
                  className="mr-2"
                />
                <span className="text-xs font-semibold text-gray-600">
                  All Day Event
                </span>
              </div>
            </div>
            <FormInput
              label="End Time"
              type="datetime-local"
              value={activityState.endTime}
              onChange={(e) => handleStateChange("endTime", e.target.value)}
            />
          </div>

          {/* Section 4: Search Select Fields */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
            <FormSearchSelect
              label="Activity Owner"
              value={activityState.activityOwner}
              onSelect={(val) => handleStateChange("activityOwner", val.name)}
            />
            <div /> {/* Spacer */}
            <FormSearchSelect
              label="Method"
              value={activityState.method}
              onSelect={(val) => handleStateChange("method", val.name)}
            />
            <div /> {/* Spacer */}
            <FormSearchSelect
              label="Opportunity ID"
              value={activityState.opportunityId}
              onSelect={(val) => handleStateChange("opportunityId", val.id)}
            />
            <div /> {/* Spacer */}
            <FormSearchSelect
              label="Contract ID"
              value={activityState.contractId}
              onSelect={(val) => handleStateChange("contractId", val.id)}
            />
            <div /> {/* Spacer */}
            <FormSearchSelect
              label="Subcontract ID"
              value={activityState.subcontractId}
              onSelect={(val) => handleStateChange("subcontractId", val.id)}
            />
            <div /> {/* Spacer */}
          </div>

          {/* Section 5: Notes */}
          <div className="mt-4">
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Notes
            </label>
            <textarea
              className="w-full h-24 p-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
              value={activityState.notes}
              onChange={(e) => handleStateChange("notes", e.target.value)}
            />
          </div>
        </div>
        <ActionDetailButton label="Resources" />
        <ActionDetailButton label="Tasks" />
      </MainContainer>
    </div>
  );
};

export const VendorCertificationsP = ({
  formData,
  onClose,
  // isFormView,
  // isDirty,
  loading,
  // toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState([]); // Array from GET
  const [currentIndex, setCurrentIndex] = useState(0); // Navigation index

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const vendId = formData.vendor.vendId;

  const initialCertificateState = {
    certCd: "",
    certSeqNo: "",
    companyId: "",
    certStartDate: "",
    certStatusCd: "",
    certLevelCd: "",
    certEndDate: "",
    certUrl: "",
    certNotes: "",
    addrDc: "",
    certName: "", // UI Display field
    certStatusDesc: "", // UI Display field
    certLevelDesc: "",
  };

  // 1. States & Constants
  const [certData, setCertData] = useState(initialCertificateState);

  const companyId = formData?.companyId || "1";

  // Mocked Options with id/name structure
  const certOptions = [
    { id: "ISO", name: "ISO 9001" },
    { id: "CIS", name: "CIS Compliance" },
  ];
  const statusOptions = [
    { id: "A", name: "Active" },
    { id: "I", name: "Inactive" },
  ];
  const levelOptions = [
    { id: "1", name: "Level 1 - Basic" },
    { id: "2", name: "Level 2 - Advanced" },
  ];

  const mapCodesToNames = (record) => {
    if (!record) return initialCertificateState;

    const matchedCert = certOptions.find((o) => o.id === record.certCd);
    const matchedStatus = statusOptions.find(
      (o) => o.id === record.certStatusCd,
    );
    const matchedLevel = levelOptions.find((o) => o.id === record.certLevelCd);

    return {
      ...record,
      certName: matchedCert ? matchedCert.name : "",
      certStatusDesc: matchedStatus ? matchedStatus.name : "",
      certLevelDesc: matchedLevel ? matchedLevel.name : "",
    };
  };

  // 2. Data Fetching
  const fetchCertifications = async () => {
    if (!vendId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-certifications/GetCertificationsByVendor/${vendId}/${companyId}`,
      );

      if (response.data && response.data.length > 0) {
        // Map names to every record in the array
        const mappedList = response.data.map((item) => mapCodesToNames(item));
        setOriginalData(mappedList);
        setCertData(mappedList[0]);
        setCurrentIndex(0);
        setIsDirty(false);
      } else {
        setOriginalData([]);
        handleAdd();
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, [vendId]);

  const handleNavigate = (direction) => {
    if (isDirty && !window.confirm("Discard unsaved changes?")) return;

    let newIndex = currentIndex;
    if (direction === "next" && currentIndex < originalData.length - 1) {
      newIndex++;
    } else if (direction === "prev" && currentIndex > 0) {
      newIndex--;
    } else if (direction === "first") {
      newIndex = 0;
    } else if (direction === "last") {
      newIndex = originalData.length - 1;
    }

    setCurrentIndex(newIndex);
    setCertData(originalData[newIndex]);
    setIsDirty(false);
  };

  // 3. Handlers
  const handleLocalChange = (field, value) => {
    setCertData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId) {
      toast.error("No Vendor ID associated.");
      return;
    }
    if (!certData.certCd) {
      toast.error("Certification Code is required.");
      return;
    }

    // Standardize the payload to match your JSON structure
    const payload = {
      ...certData,
      vendId: vendId,
      companyId: companyId,
      modifiedBy: user.name || "System",
      timeStamp: new Date().toISOString().split("T")[0], // Matches YYYY-MM-DD
    };

    try {
      const isUpdate = !!certData.certCd;

      if (isUpdate) {
        // MATCHING YOUR SWAGGER IMAGE:
        // /api/vendor-certifications/{certCd}/{certSeqNo}/{companyId}/{certStartDate}
        const putUrl = `${backendUrl}/api/vendor-certifications/${certData.certCd}/${certData.certSeqNo}/${companyId}/${certData.certStartDate}`;
        const response = await axios.put(putUrl, payload);

        if (response.status === 200) {
          toast.success("Certification updated successfully!");
          setIsDirty(false);
          fetchCertifications();
        }
      } else {
        // POST usually just goes to the base collection
        const response = await axios.post(
          `${backendUrl}/api/vendor-certifications`,
          payload,
        );
        if (response.status === 201 || response.status === 200) {
          toast.success("Certification created successfully!");
          setIsDirty(false);
          fetchCertifications();
        }
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error saving certification. Check console for details.");
    }
  };

  const handleClear = () => {
    if (!isDirty) {
      setClipboard(null);
      toast.info("Clipboard cleared.");
      return;
    }

    if (window.confirm("Discard all unsaved changes?")) {
      setCertData(originalData || { ...initialCertificateState });
      setIsDirty(false);
    }
  };

  const handleAdd = () => {
    setCertData({
      certCd: "",
      certSeqNo: "",
      certStartDate: "",
      certStatusCd: "",
      certLevelCd: "",
      certEndDate: "",
      certUrl: "",
      certNotes: "",
      addrDc: "",
    });
    setIsDirty(true);
    toast.info("Initialized new certification record.");
  };

  const handleDelete = async () => {
    if (!certData.certSeqNo && certData.certSeqNo !== 0) return;
    if (!window.confirm("Delete this record?")) return;

    try {
      // Assuming delete uses the same path params as PUT
      const delUrl = `${backendUrl}/api/vendor-certifications/${certData.certCd}/${certData.certSeqNo}/${companyId}/${certData.certStartDate}`;
      await axios.delete(delUrl);
      toast.success("Deleted.");
      fetchCertifications();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onDelete: handleDelete,
    onCopy: () => {
      setClipboard({ ...certData });
      toast.success("Copied.");
    },
    onPaste: () => {
      if (clipboard) {
        setCertData({ ...clipboard });
        setIsDirty(true);
      }
    },
    onSave: handleSave,
    onClear: handleClear,
  };

  const handleCertSelect = (val) => {
    setCertData((prev) => ({
      ...prev,
      certCd: val.id, // Sets the Code (e.g., ISO9001)
      certName: val.name, // Sets the Name (e.g., Quality Management System)
    }));
    setIsDirty(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer title="Vendor Certifications" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2">
          <FormSection>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormSearchSelect
                label="Certification Code"
                options={certOptions}
                value={certData.certCd}
                displayKey="id"
                // onSelect={(val) => handleLocalChange("certCd", val.id)}
                onSelect={handleCertSelect}
              />
              <FormInput
                label="Certification Name"
                value={certData.certName || ""}
                readOnly
                onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
              />

              <FormInput
                label="Professional Org Code"
                value={formData.cisCertNo || ""}
                readOnly
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              <FormInput
                label="Professional Org Name"
                value={formData.cisCertNo || ""}
                readOnly
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              {/* --- Status Section --- */}
              <FormSearchSelect
                label="Status Code"
                options={statusOptions}
                value={certData.certStatusCd}
                displayKey="id"
                onSelect={(val) => {
                  handleLocalChange("certStatusCd", val.id);
                  handleLocalChange("certStatusDesc", val.name); // Updates the description field
                }}
              />
              <FormInput
                label="Status Description"
                value={certData.certStatusDesc || ""}
                readOnly // Recommended since it's auto-filled
                onChange={(e) =>
                  handleLocalChange("certStatusDesc", e.target.value)
                }
              />

              {/* --- Level Section --- */}
              <FormSearchSelect
                label="Level Code"
                options={levelOptions}
                value={certData.certLevelCd}
                displayKey="id"
                onSelect={(val) => {
                  handleLocalChange("certLevelCd", val.id);
                  handleLocalChange("certLevelDesc", val.name); // Updates the description field
                }}
              />
              <FormInput
                label="Level Description"
                value={certData.certLevelDesc || ""}
                readOnly
                onChange={(e) =>
                  handleLocalChange("certLevelDesc", e.target.value)
                }
              />
              <FormInput
                label="Start Date"
                type="date"
                required
                value={certData.certStartDate}
                onChange={(e) =>
                  handleLocalChange("certStartDate", e.target.value)
                }
              />
              <FormInput
                label="End Date"
                type="date"
                required
                value={certData.certEndDate}
                onChange={(e) =>
                  handleLocalChange("certEndDate", e.target.value)
                }
              />
              <FormSearchSelect
                label="Address"
                options={[{ id: "HQ", name: "Headquarters" }]}
                onSelect={(val) => handleLocalChange("addrDc", val.id)}
              />

              <FormInput
                label="URL"
                value={formData.certUrl || ""}
                onChange={(e) => handleLocalChange("certUrl", e.target.value)}
              />
            </div>
            <FormInput
              label="Notes"
              value={certData.certNotes}
              onChange={(e) => handleLocalChange("certNotes", e.target.value)}
            />
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const NDAInfo = ({ formData, onClose, isFormView, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const vendId = formData?.vendor?.vendId || formData?.vendId;
  const companyId = formData?.companyId || "1";

  const initialNDAState = {
    ndaDateReceived: "",
    ndaDetail: "",
    ndaExpiryDate: "",
    fileLocation: "",
    fileName: "",
    companyId: companyId,
    vendId: vendId,
    modifiedBy: user.name || "Admin",
  };

  const [ndaState, setNDAState] = useState(initialNDAState);

  // Options matching your requirements
  const fileLocOptions = [
    { id: "VISA", name: "Visa" },
    { id: "MAST", name: "MasterCard" },
    { id: "AMEX", name: "American Express" },
  ];

  const fileNameOptions = [
    { id: "VISA", name: "Visa" },
    { id: "MAST", name: "MasterCard" },
    { id: "AMEX", name: "American Express" },
  ];

  const fetchNDA = async () => {
    if (!vendId) return;
    try {
      // API endpoint for NDA
      const response = await axios.get(
        `${backendUrl}/api/vendor-nda/${companyId}/${vendId}`,
      );

      if (response.data) {
        const record = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (record) {
          const formattedRecord = {
            ...record,
            ndaDateReceived: record.ndaDateReceived
              ? record.ndaDateReceived.split("T")[0]
              : "",
            ndaExpiryDate: record.ndaExpiryDate
              ? record.ndaExpiryDate.split("T")[0]
              : "",
          };
          setNDAState(formattedRecord);
          setOriginalData(formattedRecord);
        }
      }
    } catch (error) {
      console.error("Error fetching NDA info:", error);
    }
  };

  useEffect(() => {
    fetchNDA();
  }, [vendId]);

  const handleStateChange = (field, value) => {
    setNDAState((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId) return toast.error("No Vendor ID associated.");

    try {
      const url = `${backendUrl}/api/vendor-nda`;
      const payload = {
        ...ndaState,
        vendId,
        companyId,
        modifiedBy: user.name,
      };

      const response = await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("NDA info saved successfully!");
        setIsDirty(false);
        fetchNDA();
      }
    } catch (error) {
      toast.error("Error saving NDA information.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setNDAState(initialNDAState);
      setIsDirty(true);
    },
    onDelete: async () => {
      if (window.confirm("Delete this NDA record?")) {
        try {
          await axios.delete(
            `${backendUrl}/api/vendor-nda/${companyId}/${vendId}`,
          );
          setNDAState(initialNDAState);
          toast.success("Deleted successfully.");
        } catch (error) {
          toast.error("Delete failed.");
        }
      }
    },
    onCopy: () => {
      setClipboard({ ...ndaState });
      toast.info("Copied.");
    },
    onPaste: () => clipboard && setNDAState({ ...clipboard }),
    onSave: handleSave,
    onClear: () => {
      if (window.confirm("Discard changes?")) {
        setNDAState(originalData || initialNDAState);
        setIsDirty(false);
      }
    },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer
        title="Non-Disclosure Agreement (NDA)"
        handleClose={onClose}
      >
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
        />
        <div className="mt-2">
          <FormSection title="NDA Details">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Date Received"
                type="date"
                required
                value={ndaState.ndaDateReceived || ""}
                onChange={(e) =>
                  handleStateChange("ndaDateReceived", e.target.value)
                }
              />
              <FormInput
                label="Expiration Date"
                type="date"
                required
                value={ndaState.ndaExpiryDate || ""}
                onChange={(e) =>
                  handleStateChange("ndaExpiryDate", e.target.value)
                }
              />
              <FormInput
                label="Details"
                value={ndaState.ndaDetail || ""}
                onChange={(e) => handleStateChange("ndaDetail", e.target.value)}
              />
              <div /> {/* Spacer */}
              <FormSearchSelect
                label="File Location"
                options={fileLocOptions}
                value={ndaState.fileLocation}
                displayKey="id"
                onSelect={(val) => handleStateChange("fileLocation", val.id)}
              />
              <FormSearchSelect
                label="File Name"
                options={fileNameOptions}
                value={ndaState.fileName}
                displayKey="id"
                onSelect={(val) => handleStateChange("fileName", val.id)}
              />
            </div>
            <ActionDetailButton label="View NDA" />
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const TeamingAgreement = ({
  formData,
  onClose,
  isFormView,
  loading,
}) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Functional constraints for data handling
  const vendId = formData?.vendor?.vendId || formData?.vendId;
  const companyId = formData?.companyId || "1";

  const initialTeamingState = {
    dateReceived: "",
    details: "",
    expirationDate: "",
    fileLocation: "",
    fileName: "",
    companyId: companyId,
    vendId: vendId,
    modifiedBy: user.name || "Admin",
  };

  const [teamingState, setTeamingState] = useState(initialTeamingState);

  // Static options provided in your request
  const fileLocOptions = [
    { id: "LOC01", name: "Internal Server" },
    { id: "LOC02", name: "Cloud Storage" },
    { id: "LOC03", name: "Physical Archive" },
  ];

  const fileNameOptions = [
    { id: "DOC01", name: "Agreement_v1.pdf" },
    { id: "DOC02", name: "Teaming_Final.docx" },
  ];

  const fetchTeamingAgreement = async () => {
    if (!vendId) return;
    try {
      // Following the URL pattern for vendor-specific sub-entities
      const response = await axios.get(
        `${backendUrl}/api/vendor-teaming-agreements/${companyId}/${vendId}`,
      );

      if (response.data) {
        const record = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (record) {
          // Format dates for HTML5 input fields (YYYY-MM-DD)
          const formattedRecord = {
            ...record,
            dateReceived: record.dateReceived
              ? record.dateReceived.split("T")[0]
              : "",
            expirationDate: record.expirationDate
              ? record.expirationDate.split("T")[0]
              : "",
          };
          setTeamingState(formattedRecord);
          setOriginalData(formattedRecord);
        }
      }
    } catch (error) {
      console.error("Error fetching teaming agreement:", error);
    }
  };

  useEffect(() => {
    fetchTeamingAgreement();
  }, [vendId]);

  const handleStateChange = (field, value) => {
    setTeamingState((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId) return toast.error("No Vendor ID associated.");

    try {
      const url = `${backendUrl}/api/vendor-teaming-agreements`;
      const payload = {
        ...teamingState,
        vendId,
        companyId,
        modifiedBy: user.name,
      };

      const response = await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Teaming Agreement saved successfully!");
        setIsDirty(false);
        fetchTeamingAgreement();
      }
    } catch (error) {
      toast.error("Error saving teaming agreement.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setTeamingState(initialTeamingState);
      setIsDirty(true);
    },
    onDelete: async () => {
      if (window.confirm("Delete this agreement record?")) {
        try {
          await axios.delete(
            `${backendUrl}/api/vendor-teaming-agreements/${companyId}/${vendId}`,
          );
          setTeamingState(initialTeamingState);
          toast.success("Deleted.");
        } catch (error) {
          toast.error("Delete failed.");
        }
      }
    },
    onCopy: () => {
      setClipboard({ ...teamingState });
      toast.info("Copied.");
    },
    onPaste: () => clipboard && setTeamingState({ ...clipboard }),
    onSave: handleSave,
    onClear: () => {
      if (window.confirm("Discard changes?")) {
        setTeamingState(originalData || initialTeamingState);
        setIsDirty(false);
      }
    },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Teaming Agreement" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
        />
        <div className="mt-2">
          <FormSection title="Teaming Agreement Details">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Date Received"
                type="date"
                required
                value={teamingState.dateReceived || ""}
                onChange={(e) =>
                  handleStateChange("dateReceived", e.target.value)
                }
              />
              <FormInput
                label="Expiration Date"
                type="date"
                required
                value={teamingState.expirationDate || ""}
                onChange={(e) =>
                  handleStateChange("expirationDate", e.target.value)
                }
              />
              <FormInput
                label="Details"
                value={teamingState.details || ""}
                onChange={(e) => handleStateChange("details", e.target.value)}
              />
              <div /> {/* Spacer */}
              <FormSearchSelect
                label="File Location"
                options={fileLocOptions}
                value={teamingState.fileLocation}
                displayKey="id"
                onSelect={(val) => handleStateChange("fileLocation", val.id)}
              />
              <FormSearchSelect
                label="File Name"
                options={fileNameOptions}
                value={teamingState.fileName}
                displayKey="id"
                onSelect={(val) => handleStateChange("fileName", val.id)}
              />
            </div>
            <ActionDetailButton label="View Teaming Agreement" />
          </FormSection>

          {/* Notes Section for consistency with your UI */}
        </div>
      </MainContainer>
    </div>
  );
};

export const UserDefinedInfoP = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  isDirty,
  loading,
  toolbarActions,
}) => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeSubModal, setActiveSubModal] = useState([]); // Local state for inner buttons

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Section: Address List */}
      <MainContainer title="USer-Defined Info" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2">
          <FormSection>
            <FormInput
              label="Sequnece Number"
              value={formData.cisCertNo || ""}
              onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
            />
            <div className="grid grid-cols-3 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Data Type"
                value={formData.cisNiNo || ""}
                onChange={(e) => handleInputChange("cisNiNo", e.target.value)}
              />
              <FormSearchSelect
                label="Labels"
                options={[]}
                onSelect={(val) => handleInputChange("cisCode", val.name)}
              />
              <FormInput
                label="Value"
                value={formData.cisCertNo || ""}
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              <FormInput
                label="Costpoint Validation Field"
                value={formData.cisCertNo || ""}
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              <FormInput
                label="Validated Text"
                value={formData.cisCertNo || ""}
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
              <FormInput
                label="Required"
                value={formData.cisCertNo || ""}
                onChange={(e) => handleInputChange("cisCertNo", e.target.value)}
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const Resources = ({ formData, onClose, isFormView, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [activeTab, setActiveTab] = useState("General");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const vendId = formData?.vendor?.vendId || formData?.vendId;
  const companyId = formData?.companyId || "1";

  const initialResourceState = {
    resourceType: "",
    primaryContact: false,
    businessId: "",
    businessName: "",
    resourceId: "",
    type: "",
    resourceFirstName: "",
    resourceLastName: "",
    title: "",
    phone: "",
    emailAddress: "",
    notes: "",
    internalNotes: "",
    approvalNotes: "",
    companyId: companyId,
    vendId: vendId,
    modifiedBy: user.name || "Admin",
  };

  const [resourceState, setResourceState] = useState(initialResourceState);

  const fetchResource = async () => {
    if (!vendId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-resources/${companyId}/${vendId}`,
      );
      if (response.data) {
        const record = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (record) {
          setResourceState(record);
          setOriginalData(record);
        }
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [vendId]);

  const handleStateChange = (field, value) => {
    setResourceState((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId) return toast.error("Missing Vendor ID.");
    try {
      const isUpdate = !!originalData;
      const url = isUpdate
        ? `${backendUrl}/api/vendor-resources/${companyId}/${vendId}`
        : `${backendUrl}/api/vendor-resources`;

      const response = await axios({
        method: isUpdate ? "put" : "post",
        url: url,
        data: { ...resourceState, modifiedBy: user.name },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          `Resource ${isUpdate ? "updated" : "saved"} successfully!`,
        );
        setIsDirty(false);
        fetchResource();
      }
    } catch (error) {
      toast.error("Error saving resource info.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setResourceState(initialResourceState);
      setIsDirty(true);
    },
    onDelete: async () => {
      if (window.confirm("Delete this resource?")) {
        try {
          await axios.delete(
            `${backendUrl}/api/vendor-resources/${companyId}/${vendId}`,
          );
          setResourceState(initialResourceState);
          toast.success("Deleted successfully.");
        } catch {
          toast.error("Delete failed.");
        }
      }
    },
    onCopy: () => {
      setClipboard({ ...resourceState });
      toast.info("Copied.");
    },
    onPaste: () => clipboard && setResourceState({ ...clipboard }),
    onSave: handleSave,
    onClear: () => {
      if (window.confirm("Discard changes?")) {
        setResourceState(originalData || initialResourceState);
        setIsDirty(false);
      }
    },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Resources" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
        />

        {/* Tab Header */}
        <div className="flex border-b border-gray-200 mt-2">
          <button
            className={`px-4 py-1 text-xs font-semibold ${activeTab === "General" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("General")}
          >
            {" "}
            General{" "}
          </button>
          <button
            className={`px-4 py-1 text-xs font-semibold ${activeTab === "Notes" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("Notes")}
          >
            {" "}
            Notes{" "}
          </button>
        </div>

        <div className="p-2">
          {activeTab === "General" ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <div className="flex items-center space-x-4">
                <FormSearchSelect
                  label="Resource Type *"
                  value={resourceState.resourceType}
                  onSelect={(val) => handleStateChange("resourceType", val.id)}
                />
                <div className="flex items-center pt-4">
                  <input
                    type="checkbox"
                    checked={resourceState.primaryContact}
                    onChange={(e) =>
                      handleStateChange("primaryContact", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-[11px] font-bold text-gray-600">
                    Primary Contact
                  </span>
                </div>
              </div>
              <FormInput
                label="Business Name"
                value={resourceState.businessName}
                readOnly
              />

              <FormInput
                label="Business ID *"
                value={resourceState.businessId}
                onChange={(e) =>
                  handleStateChange("businessId", e.target.value)
                }
              />
              <div />

              <FormInput
                label="Resource ID *"
                value={resourceState.resourceId}
                onChange={(e) =>
                  handleStateChange("resourceId", e.target.value)
                }
              />
              <div />

              <FormInput
                label="Type"
                value={resourceState.type}
                onChange={(e) => handleStateChange("type", e.target.value)}
              />
              <div />

              <FormInput
                label="Resource First Name"
                value={resourceState.resourceFirstName}
                onChange={(e) =>
                  handleStateChange("resourceFirstName", e.target.value)
                }
              />
              <FormInput
                label="Resource Last Name"
                value={resourceState.resourceLastName}
                onChange={(e) =>
                  handleStateChange("resourceLastName", e.target.value)
                }
              />

              <FormInput
                label="Title"
                value={resourceState.title}
                onChange={(e) => handleStateChange("title", e.target.value)}
              />
              <FormInput
                label="Phone"
                value={resourceState.phone}
                onChange={(e) => handleStateChange("phone", e.target.value)}
              />

              <FormInput
                label="Email Address"
                value={resourceState.emailAddress}
                onChange={(e) =>
                  handleStateChange("emailAddress", e.target.value)
                }
                fullWidth
              />

              <div className="col-span-2 mt-2">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Notes
                </label>
                <textarea
                  className="w-full h-16 p-2 border border-gray-300 rounded text-xs focus:border-blue-500 outline-none"
                  value={resourceState.notes}
                  onChange={(e) => handleStateChange("notes", e.target.value)}
                />
              </div>
            </div>
          ) : (
            /* Notes Tab matching your screenshot */
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  Internal Notes
                </label>
                <textarea
                  className="w-full h-64 p-2 border border-gray-300 rounded text-xs focus:border-blue-500 outline-none"
                  value={resourceState.internalNotes}
                  onChange={(e) =>
                    handleStateChange("internalNotes", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  Approval/Rejection Notes
                </label>
                <textarea
                  className="w-full h-64 p-2 border border-gray-300 rounded text-xs bg-gray-100 outline-none"
                  value={resourceState.approvalNotes}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export const Tasks = ({ formData, onClose, isFormView, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [activeTab, setActiveTab] = useState("General");

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const vendId = formData?.vendor?.vendId || formData?.vendId;
  const companyId = formData?.companyId || "1";

  // Initial state based on the Tasks UI screenshot
  const initialTaskState = {
    task: "",
    taskAction: "",
    dueDate: "",
    completedDate: "",
    status: "Not Started",
    ownerType: "-Select-",
    businessId: "",
    businessName: "",
    taskOwnerId: "",
    ownerFirstName: "",
    ownerLastName: "",
    notifyActivityOwner: false,
    notifyTaskOwner: false,
    additionalEmailNotifications: false,
    additionalEmails: "",
    notes: "",
    internalNotes: "",
    approvalNotes: "",
    companyId: companyId,
    vendId: vendId,
    modifiedBy: user.name || "Admin",
  };

  const [taskState, setTaskState] = useState(initialTaskState);

  const fetchTask = async () => {
    if (!vendId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/vendor-tasks/${companyId}/${vendId}`,
      );
      if (response.data) {
        const record = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (record) {
          // Formatting dates for input fields
          const formattedRecord = {
            ...record,
            dueDate: record.dueDate?.split("T")[0] || "",
            completedDate: record.completedDate?.split("T")[0] || "",
          };
          setTaskState(formattedRecord);
          setOriginalData(formattedRecord);
        }
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [vendId]);

  const handleStateChange = (field, value) => {
    setTaskState((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!vendId) return toast.error("Missing Vendor ID.");
    try {
      const isUpdate = !!originalData;
      // PUT requires path parameters as seen in similar Swagger docs
      const url = isUpdate
        ? `${backendUrl}/api/vendor-tasks/${companyId}/${vendId}`
        : `${backendUrl}/api/vendor-tasks`;

      const response = await axios({
        method: isUpdate ? "put" : "post",
        url: url,
        data: { ...taskState, modifiedBy: user.name },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Task ${isUpdate ? "updated" : "saved"} successfully!`);
        setIsDirty(false);
        fetchTask();
      }
    } catch (error) {
      toast.error("Error saving task information.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setTaskState(initialTaskState);
      setIsDirty(true);
    },
    onDelete: async () => {
      if (window.confirm("Delete this task?")) {
        try {
          await axios.delete(
            `${backendUrl}/api/vendor-tasks/${companyId}/${vendId}`,
          );
          setTaskState(initialTaskState);
          toast.success("Task deleted.");
        } catch {
          toast.error("Delete failed.");
        }
      }
    },
    onCopy: () => {
      setClipboard({ ...taskState });
      toast.info("Copied.");
    },
    onPaste: () => clipboard && setTaskState({ ...clipboard }),
    onSave: handleSave,
    onClear: () => {
      if (window.confirm("Discard changes?")) {
        setTaskState(originalData || initialTaskState);
        setIsDirty(false);
      }
    },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Tasks" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
        />

        <div className="flex border-b border-gray-200 mt-2">
          <button
            className={`px-4 py-1 text-xs font-semibold ${activeTab === "General" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("General")}
          >
            {" "}
            General{" "}
          </button>
          <button
            className={`px-4 py-1 text-xs font-semibold ${activeTab === "Notes" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("Notes")}
          >
            {" "}
            Notes{" "}
          </button>
        </div>

        <div className="p-2">
          {activeTab === "General" ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Task *"
                value={taskState.task}
                onChange={(e) => handleStateChange("task", e.target.value)}
                fullWidth
              />
              <FormInput
                label="Task Action *"
                value={taskState.taskAction}
                onChange={(e) =>
                  handleStateChange("taskAction", e.target.value)
                }
                fullWidth
              />

              <FormInput
                label="Due Date"
                type="date"
                value={taskState.dueDate}
                onChange={(e) => handleStateChange("dueDate", e.target.value)}
              />
              <FormInput
                label="Completed Date"
                type="date"
                value={taskState.completedDate}
                readOnly
              />

              <FormSearchSelect
                label="Status *"
                options={[
                  { id: "Not Started", name: "Not Started" },
                  { id: "In Progress", name: "In Progress" },
                  { id: "Completed", name: "Completed" },
                ]}
                value={taskState.status}
                onSelect={(val) => handleStateChange("status", val.id)}
              />
              <div />

              <FormSearchSelect
                label="Owner Type *"
                value={taskState.ownerType}
                onSelect={(val) => handleStateChange("ownerType", val.name)}
              />
              <div />

              <FormInput
                label="Business ID *"
                value={taskState.businessId}
                onChange={(e) =>
                  handleStateChange("businessId", e.target.value)
                }
              />
              <FormInput
                label="Business Name"
                value={taskState.businessName}
                readOnly
              />

              <FormInput
                label="Task Owner ID *"
                value={taskState.taskOwnerId}
                onChange={(e) =>
                  handleStateChange("taskOwnerId", e.target.value)
                }
              />
              <div />

              <FormInput
                label="Owner First Name"
                value={taskState.ownerFirstName}
                readOnly
              />
              <FormInput
                label="Owner Last Name"
                value={taskState.ownerLastName}
                readOnly
              />

              <div className="col-span-2 flex space-x-6 mt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={taskState.notifyActivityOwner}
                    onChange={(e) =>
                      handleStateChange("notifyActivityOwner", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-[11px] font-bold text-gray-600">
                    Notify Activity Owner
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={taskState.notifyTaskOwner}
                    onChange={(e) =>
                      handleStateChange("notifyTaskOwner", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-[11px] font-bold text-gray-600">
                    Notify Task Owner
                  </span>
                </div>
              </div>

              <div className="col-span-2 flex items-center mt-1">
                <input
                  type="checkbox"
                  checked={taskState.additionalEmailNotifications}
                  onChange={(e) =>
                    handleStateChange(
                      "additionalEmailNotifications",
                      e.target.checked,
                    )
                  }
                  className="mr-2"
                />
                <span className="text-[11px] font-bold text-gray-600">
                  Additional Email Notifications
                </span>
              </div>

              <FormInput
                label="Additional Emails"
                value={taskState.additionalEmails}
                onChange={(e) =>
                  handleStateChange("additionalEmails", e.target.value)
                }
                fullWidth
              />

              <div className="col-span-2 mt-2">
                <label className="text-[11px] font-bold text-gray-700 block">
                  Notes
                </label>
                <textarea
                  className="w-full h-16 p-2 border border-gray-300 rounded text-xs focus:border-blue-500 outline-none"
                  value={taskState.notes}
                  onChange={(e) => handleStateChange("notes", e.target.value)}
                />
              </div>
            </div>
          ) : (
            /* Notes Tab matching standard UI */
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  Internal Notes
                </label>
                <textarea
                  className="w-full h-64 p-2 border border-gray-300 rounded text-xs focus:border-blue-500 outline-none"
                  value={taskState.internalNotes}
                  onChange={(e) =>
                    handleStateChange("internalNotes", e.target.value)
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">
                  Approval/Rejection Notes
                </label>
                <textarea
                  className="w-full h-64 p-2 border border-gray-300 rounded text-xs bg-gray-100 outline-none"
                  value={taskState.approvalNotes}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
      </MainContainer>
    </div>
  );
};
