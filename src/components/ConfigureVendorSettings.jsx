import React, { useEffect, useState } from "react";
import {
  MainContainer,
  Toolbar,
  SecondaryContainer,
} from "../helper/container";
import {
  FormSection,
  FormInput,
  FormSearchSelect,
  ActionDetailButton,
} from "../helper/formSection";
import { ReusableTable } from "../helper/tableSection"; // Added for the sub-forms
import {
  User,
  Globe,
  ShieldCheck,
  Briefcase,
  CreditCard,
  MapPin,
  FileSpreadsheet,
  Percent,
  ClipboardList,
  Layers,
  MoreHorizontal,
  X,
  Edit3,
  Plus,
  Trash2,
  Award,
  GraduationCap,
  Settings2,
  History,
  Lock,
} from "lucide-react";
import {
  Addresses,
  CISInfo,
  CreditCardInfo,
  DefaultExpenseAccounts,
  SubContractorInfo,
  UserDefinedInfo,
  VATInfo,
  VendorCertifications,
  VendorClassification,
  VendorEmployeeDetail,
} from "./VendorEmployeeDetail";
import { backendUrl } from "./config";
import api from "../utils/api";

// --- Sub-Form Modal Component ---

const ConfigureVendorSettings = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "";

  // 1. Initial State matching your API Schema
  const initialFormState = {
    companyId: companyId,
    vendAutoAssgFl: "N",
    lastVendId: "",
    modifiedBy: user.userId || "",
    allowPayVendFl: "N",
    dfCashAcctsKey: 0,
    dfltApAcctsKey: 0,
    sSubctrPayCd: "I",
    emplVendEditFl: "N",
    emplIdFl: "N",
    emplVendIdPrfx: "",
    emplVendIdSfx: "",
    emplMnameCd: "",
    emplNameOrderCd: "",
    emplVendEftFl: "N",
    emplVendNameExt: "",
    emplVendTermsCd: "",
    emplVendAddrCd: "",
    emplVendOrdCd: "",
    useSubcidFl: "N",
    vendemplidAutoFl: "N",
    lastVendEmplId: "",
    tcWorkSchedCd: "",
    emplClassCd: "",
    tcTsSchedCd: "",
    veExpClassCd: "",
    detlJobCd: "",
    gwiqAllAcctsFl: "N",
    tenantId: "",
    adminEmail: "",
    mgrEmplId: "",
    rowVersion: 0,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("vendorSetting");
  const [activeModal, setActiveModal] = useState([]);

  // 2. Fetch Data Function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `${backendUrl}/api/VendorSettings/${companyId}`,
      );
      if (response.data) {
        setFormData(response.data);
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error fetching vendor settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. Handle Input Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  // 4. Save/Update Function
  const handleSave = async () => {
    setLoading(true);
    try {
      // Assuming a PUT request for configuration settings
      await api.put(`${backendUrl}/api/VendorSettings/${companyId}`, formData);
      toast.success("Settings updated successfully");
      setIsDirty(false);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const toolbarActions = {
    onSave: handleSave,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchData(),
  };

  const comparisonDates = [
    { label: "Invoice", value: "I" },
    { label: "Invoice Period of Performance", value: "P" },
    { label: "Payment Section", value: "S" },
  ];

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer title="Configure Vendor Settings">
        <Toolbar
          //   isFormView={isFormView}
          //   isDirty={isDirty}
          //   loading={loading}
          actions={toolbarActions}
          //   currentIndex={currentIndex}
          //   totalRecords={vendorList.length}
        />

        <div className="space-y-3 mt-2">
          <div className="border-t border-gray-200 pt-2">
            {/* Tab Navigation */}
            <div className="flex gap-4 px-4 text-[11px] font-bold text-gray-500 mb-4">
              {["vendorSetting", "prospVendEmailSet"].map((tab) => (
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
            {currentTab === "vendorSetting" && (
              <div className="grid grid-cols-2 gap-4">
                <FormSection title="Auto Assign Vendor">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="checkbox"
                      label="Enable Auto-Assign"
                      checked={formData.vendAutoAssgFl === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "vendAutoAssgFl",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                    <FormInput
                      label="Last Vendor"
                      value={formData.lastVendId}
                      onChange={(e) =>
                        handleInputChange("lastVendId", e.target.value)
                      }
                    />
                  </div>
                </FormSection>

                <FormSection title="Pay Vendor">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="checkbox"
                      label="Allow Different Pay Vendor"
                      checked={formData.allowPayVendFl === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "allowPayVendFl",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                  </div>
                </FormSection>

                <FormSection title="Default Account Description">
                  <div className="grid grid-cols-2 gap-4">
                    <FormSearchSelect
                      label="A/P"
                      options={["a", "p"]}
                      onSelect={(opt) => {
                        handleInputChange("dfltApAcctsKey", opt.value);
                      }}
                      displayKey="name"
                    />
                    <FormSearchSelect
                      label="Cash"
                      options={["c", "a", "s", "h"]}
                      onSelect={(opt) => {
                        handleInputChange("dfCashAcctsKey", opt.value);
                      }}
                      displayKey="name"
                    />
                  </div>
                </FormSection>

                <FormSection title="Vendor Status">
                  <div className="flex gap-4 mt-2">
                    {comparisonDates.map((status) => (
                      <FormInput
                        key={status.value}
                        type="radio"
                        label={status.label}
                        value={status.value}
                        checked={formData.sSubctrPayCd === status.value}
                        onChange={() =>
                          handleInputChange("sSubctrPayCd", status.value)
                        }
                      />
                    ))}
                  </div>
                </FormSection>

                <FormSection title="GovWin IQ Vendor Integration">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="checkbox"
                      label="Allow any GovWin IQ Login Account to run Import Govwin IQ Vendor Data for all login Accounts/Companies"
                      checked={formData.gwiqAllAcctsFl === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "gwiqAllAcctsFl",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                    <FormSearchSelect
                      label="GovWin IQ Login Account(Tenant ID)"
                      options={["c1", "a3", "s3", "h4"]}
                      onSelect={(opt) => {
                        handleInputChange("tenantId", opt.value);
                      }}
                      displayKey="name"
                    />
                  </div>
                </FormSection>

                <FormSection title="Vendor Linked To Employee Settings">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      type="checkbox"
                      label="Add/Update Vendor on Add/Update of Employee"
                      checked={formData.emplVendEditFl === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "emplVendEditFl",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                    <FormInput
                      type="checkbox"
                      label="Update Vendor EFT Info on Update of Employee Bank Account"
                      checked={formData.emplVendEftFl === "Y"}
                      onChange={(e) =>
                        handleInputChange(
                          "emplVendEftFl",
                          e.target.checked ? "Y" : "N",
                        )
                      }
                    />
                    <FormSection title="Vendor ID">
                      <FormInput
                        type="checkbox"
                        label="Use Employee ID"
                        checked={formData.emplIdFl === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "emplIdFl",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                      <FormInput
                        label="Add Prefix"
                        value={formData.emplVendIdPrfx}
                        onChange={(e) =>
                          handleInputChange("emplVendIdPrfx", e.target.value)
                        }
                      />
                      <FormInput
                        label="Add Suffix"
                        value={formData.emplVendIdSfx}
                        onChange={(e) =>
                          handleInputChange("emplVendIdSfx", e.target.value)
                        }
                      />
                      <FormInput
                        label="Vendor Short Name - Middle Name Info"
                        value={formData.emplMnameCd}
                        onChange={(e) =>
                          handleInputChange("emplMnameCd", e.target.value)
                        }
                      />

                      <FormInput
                        label="Vendor Short Name - Name Order"
                        value={formData.emplNameOrderCd}
                        onChange={(e) =>
                          handleInputChange("emplNameOrderCd", e.target.value)
                        }
                      />
                    </FormSection>
                  </div>
                </FormSection>

                <FormSection title="Other Vendor Defaults">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Add Prefix"
                      value={formData.vendLongName}
                      onChange={(e) =>
                        handleInputChange("longName", e.target.value)
                      }
                    />
                    <FormInput
                      label="Location"
                      value={formData.vendLongName}
                      onChange={(e) =>
                        handleInputChange("longName", e.target.value)
                      }
                    />
                    <FormInput
                      label="Terms"
                      value={formData.vendLongName}
                      onChange={(e) =>
                        handleInputChange("longName", e.target.value)
                      }
                    />
                    <FormInput
                      label="Address Code"
                      value={formData.vendLongName}
                      onChange={(e) =>
                        handleInputChange("longName", e.target.value)
                      }
                    />
                    <FormInput
                      label="Order Address"
                      value={formData.vendLongName}
                      onChange={(e) =>
                        handleInputChange("longName", e.target.value)
                      }
                    />
                  </div>
                </FormSection>

                <FormSection title="Vendor Employee Settings">
                  <FormSection title="Vendor Employee ID Options">
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        type="checkbox"
                        label="Allow any GovWin IQ Login Account to run Import Govwin IQ Vendor Data for all login Accounts/Companies"
                        checked={formData.gwiqAllAcctsFl === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "gwiqAllAcctsFl",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                      <FormInput
                        label="Last Vendor Employee ID"
                        value={formData.vendLongName}
                        onChange={(e) =>
                          handleInputChange("longName", e.target.value)
                        }
                      />
                      <FormSearchSelect
                        label="Supplier Portal Default Manager"
                        options={["c1", "a3", "s3", "h4"]}
                        onSelect={() => {}}
                        displayKey="name"
                      />
                      <FormInput
                        type="checkbox"
                        label="Update Vendor Employee Workforce with Termination Date"
                        checked={formData.prnt1099Fl === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "prnt1099Fl",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                    </div>
                  </FormSection>

                  <FormSection title="Time and Expense Defaults">
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Work Schedule"
                        value={formData.vendLongName}
                        onChange={(e) =>
                          handleInputChange("longName", e.target.value)
                        }
                      />
                      <FormInput
                        label="Expense Class"
                        value={formData.vendLongName}
                        onChange={(e) =>
                          handleInputChange("longName", e.target.value)
                        }
                      />
                      <FormInput
                        label="Timesheet Schedule"
                        value={formData.vendLongName}
                        onChange={(e) =>
                          handleInputChange("longName", e.target.value)
                        }
                      />
                      <FormInput
                        label="Detail Job Title"
                        value={formData.vendLongName}
                        onChange={(e) =>
                          handleInputChange("longName", e.target.value)
                        }
                      />
                      <FormInput
                        label="Timesheet Class"
                        value={formData.vendLongName}
                        onChange={(e) =>
                          handleInputChange("longName", e.target.value)
                        }
                      />
                    </div>
                  </FormSection>
                </FormSection>
              </div>
            )}
            {currentTab === "prospVendEmailSet" && (
              <div className="space-y-6">
                {/* Top Checkboxes */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    type="checkbox"
                    label="Allow Sending of Vendor Notifications"
                    checked={formData.allowVendorNotif === "Y"} // Updated field name for clarity
                    onChange={(e) =>
                      handleInputChange(
                        "allowVendorNotif",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                  <FormInput
                    type="checkbox"
                    label="Allow Editing of Email message in the Approvals screens"
                    checked={formData.allowEmailEdit === "Y"} // Updated field name for clarity
                    onChange={(e) =>
                      handleInputChange(
                        "allowEmailEdit",
                        e.target.checked ? "Y" : "N",
                      )
                    }
                  />
                </div>

                {/* Template Areas */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Approved Email Template
                    </label>
                    <textarea
                      className="w-full h-64 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.approvedTemplate || ""}
                      onChange={(e) =>
                        handleInputChange("approvedTemplate", e.target.value)
                      }
                      placeholder="Enter template for approved vendors..."
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Rejected Email Template
                    </label>
                    <textarea
                      className="w-full h-64 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.rejectedTemplate || ""}
                      onChange={(e) =>
                        handleInputChange("rejectedTemplate", e.target.value)
                      }
                      placeholder="Enter template for rejected vendors..."
                    />
                    {/* Optional Edit Icon like in your screenshot */}
                    <div className="absolute right-2 top-8 text-gray-400 cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions - Clicking these now opens the Modal */}
          <div className="flex flex-wrap gap-1  p-1.5 ">
            <ActionDetailButton
              label="Corporate Settings"
              icon={User}
              isActive={activeModal.includes("Corporate Settings")}
              onClick={() =>
                setActiveModal((prevArray) => [
                  "Corporate Settings",
                  ...prevArray,
                ])
              }
            />

            <ActionDetailButton
              label=""
              icon={MoreHorizontal}
              isActive={activeModal.includes("VendorEmployee")}
              className="w-10"
            />
          </div>
        </div>
      </MainContainer>
      {/* Dynamic Sub-Form Modal */}
      {activeModal.includes("Corporate Settings") && (
        <div>
          <SecondaryContainer title="Corporate Settings">
            <FormSection title="Prospects">
              <FormInput
                type="checkbox"
                label="Auto-Assign Vendor Prospect IDs"
                checked={formData.holdPmtFl === "Y"}
                onChange={(e) =>
                  handleInputChange("holdPmtFl", e.target.checked ? "Y" : "N")
                }
              />
              <FormInput
                label="Last Vendor Prospect ID"
                value={formData.vendWebSite}
                onChange={(e) =>
                  handleInputChange("vendWebSite", e.target.value)
                }
              />
            </FormSection>
          </SecondaryContainer>
        </div>
      )}
    </div>
  );
};

export default ConfigureVendorSettings;
