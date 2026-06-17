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
import {
  Activities,
  AddressesP,
  NDAInfo,
  TeamingAgreement,
  UserDefinedInfoP,
  VendorCertificationsP,
  VendorEmployeeDetailP,
} from "./ProspectiveVendorDetail";
import UserDefineLabel from "./UserDefineLabel";

// --- Sub-Form Modal Component ---

const ManageProspectiveVendors = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [isFormView, setIsFormView] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("General");

  const [vendorList, setVendorList] = useState([]);

  // Modal State
  const [activeModal, setActiveModal] = useState([]); // stores the label of the active sub-form
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTermApprvl, setSearchTermApprvl] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());

  const initialFormState = {
    vendor: {
      vendId: "",
      companyId: "1",
      termsDc: "",
      sVendPoCntlCd: "",
      fobFld: "",
      shipViaFld: "",
      holdPmtFl: "N",
      clDisadvFl: "N",
      clWomOwnFl: "N",
      clLabSrplFl: "N",
      clHistBlClgFl: "N",
      prnt1099Fl: "N",
      sAp1099TypeCd: "",
      ap1099TaxId: "",
      custAcctFld: "",
      vendNotes: "",
      vendName: "",
      vendNameExt: "",
      apAcctsKey: 0,
      cashAcctsKey: 0,
      payWhenPaidFl: "N",
      expProjId: "",
      apChkVendId: "",
      emplId: "",
      userId: `${user.name}`,
      entryDtt: new Date().toISOString(),
      edVchPayVendFl: "N",
      autoVchrFl: "N",
      modifiedBy: "",
      timeStamp: new Date().toISOString(),
      recptLnNo: 0,
      calcStartDt: "2026-04-10",
      calcEndDt: "2026-04-10",
      rejPctRt: 0,
      lateRecptPctRt: 0,
      earlyRecptPctRt: 0,
      lateRecOrigRt: 0,
      sClSmBusCd: "",
      vendCertDt: "2026-04-10",
      vendLongName: "",
      chkMemoS: "",
      vendGrpCd: "",
      sSubctrPayCd: "",
      subctrFl: "N",
      limitTrnCrncyFl: "N",
      limitPayCrncyFl: "N",
      dfltRtGrpId: "",
      dfltTrnCrncyCd: "USD",
      dfltPayCrncyCd: "USD",
      vendCertId: "",
      sepChkFl: "N",
      prVendFl: "N",
      clVetFl: "N",
      clSdVetFl: "N",
      eprocureFl: "N",
      rowVersion: 0,
      tcExpClsCd: "",
      vendApprvlCd: "PENDING",
      clAncItFl: "N",
      vend1099Name: "",
      dunsNo: "",
      smSubctrFl: "N",
      veApprvlGrpCd: "",
      vendProspectId: "",
      vendSpclty: "",
      vendWebSite: "",
      cageCd: "",
      cl8aFl: "N",
      clAbilOneFl: "N",
      govwinCompId: "",
      ueiNo: "",
      avgRatingPercent: 0,
      digitalSigFl: "N",
      supplierPortalFl: "N",
      icVendFl: "N",
      perfCompanyId: "",
      cmmcLevel: "",
      adminEmail: "",
      clLgbtqFl: "N",
    },

    // --- SUB-COLLECTIONS MAPPED FROM SCHEMA ---

    addresses: [
      {
        vendorId: "",
        addrCode: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        cityName: "",
        stateCode: "",
        postalCode: "",
        countryCode: "",
        emailId: "",
        phoneNumber: "",
        companyId: "1",
        rowVersion: 0,
        vendor: "",
        contacts: [
          {
            vendId: "",
            addrCode: "",
            vendorAddressContactKey: 0,
            sequenceNo: 0,
            contactFirstName: "",
            contactLastName: "",
            emailId: "",
            phoneNumber: "",
            companyId: "1",
            rowVersion: 0,
            vendorAddress: "",
          },
        ],
      },
    ],

    employees: [
      {
        vendEmplId: "",
        vendId: "",
        companyId: "1",
        dfGenlLabCatCd: "",
        modifiedBy: "",
        rowversion: 0,
        timeStamp: new Date().toISOString(),
        vendEmplName: "",
        dfBillLabCatCd: "",
        lastName: "",
        firstName: "",
        midName: "",
        vendEmplStatus: "Active",
        subctrId: "",
        teEmplId: "",
        vendEmplAprvrId: "",
        vendEmplAprvlDt: "2026-04-10",
        vendEmplAprvlCd: "",
        intEmail: "",
        extEmail: "",
        intPhone: "",
        extPhone: "",
        cellPhone: "",
        cont1Name: "",
        cont1Rel: "",
        cont1Phone1: "",
        cont1Phone2: "",
        cont1Phone3: "",
        cont2Name: "",
        cont2Rel: "",
        cont2Phone1: "",
        cont2Phone2: "",
        cont2Phone3: "",
        usCitizenFl: true,
        itarStatus: "",
        spCreated: "s",
      },
    ],

    taxDetails: [
      {
        taxableEntityId: "",
        calendarYear: new Date().getFullYear(),
        form1099TypeCode: "",
        payVendorId: "",
        companyId: "1",
        taxableAmount: 0,
        notes: "",
        createdBy: "",
        createdAt: new Date().toISOString(),
        updatedBy: "",
        updatedAt: new Date().toISOString(),
        vendorName: "",
        taxableEntityName: "",
        taxId: "",
        vendor1099TaxId: "",
        cashOrgId: "",
        vendorAddressCode: "",
        foreignIndicator: "N",
        vendorLongName: "",
        rowVersion: 0,
        vendor: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (selectedRows.size === 1) {
      const selectedId = Array.from(selectedRows)[0];
      const selectedRecord = vendorList.find((v) => v.vendId === selectedId);
      if (selectedRecord) {
        handleEdit(selectedRecord); // <--- THIS is overwriting your 'Add' state
      }
    }
  }, [selectedRows, vendorList]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `${backendUrl}/api/vendor-transactions?page=1&pageSize=999999999&sortBy=vend_id&sortOrder=asc`,
      );
      setVendorList(res.data.data);
      if (res.data.data.length > 0) {
        setFormData(res.data.data[0]); // Load first record
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAdd = () => {
    // 1. Clear selection FIRST to stop the useEffect from firing handleEdit
    setSelectedRows(new Set());

    // 2. Explicitly reset the form
    setFormData({
      ...initialFormState,
      vendor: {
        ...initialFormState.vendor,
        vendId: "", // Ensure this is empty string
        companyId: user.companyId || "1",
        userId: user.userId || "",
        entryDtt: new Date().toISOString(),
      },
      addresses: [],
      employees: [],
      taxDetails: [],
    });

    setIsFormView(true);
    setIsDirty(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Determine if POST (new) or PUT (edit) based on presence of a key
      const response = await api.post(
        `${backendUrl}/api/vendor-transactions/create-full`,
        formData,
      );
      alert("Vendor Saved Successfully!");
      setIsDirty(false);
      fetchVendors(); // Refresh list
    } catch (err) {
      alert("Error saving vendor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field,
    value,
    index = null,
    subField = null,
    subIndex = null,
  ) => {
    setIsDirty(true);

    setFormData((prev) => {
      const newData = { ...prev };

      // Case 1: Updating arrays (addresses, employees, etc.)
      if (index !== null && Array.isArray(newData[field])) {
        // ... (Your existing array logic is mostly fine)
      }
      // Case 2: Update fields that belong inside the vendor object
      else if (
        field === "vendName" ||
        field === "vendLongName" ||
        field === "vendWebSite" ||
        field === "sVendPoCntlCd"
      ) {
        newData.vendor = {
          ...newData.vendor,
          [field]: value,
        };
      }
      // Case 3: Specific vendor sub-object updates
      else if (newData.vendor && field in newData.vendor) {
        newData.vendor = { ...newData.vendor, [field]: value };
      } else {
        newData[field] = value;
      }
      return newData;
    });
  };

  const toolbarActions = {
    onAdd: () => handleAdd(),
    onCopy: () => console.log("Copy"),
    onDelete: () => console.log("Delete"),
    onSave: () => {
      handleSaveAll();
    },
    onClear: () => setIsDirty(false),
    onToggleView: () => setIsFormView(!isFormView),
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // MATCH THE WORKING PAYLOAD STRUCTURE
      const payload = {
        vendor: {
          ...formData.vendor,
          // Remove the manual nesting that was causing the mismatch
        },
        addresses: formData.addresses || [],
        employees: formData.employees || [],
        taxDetails: formData.taxDetails || [],
      };

      const isUpdate =
        formData.vendor.vendId && formData.vendor.vendId.trim() !== "";

      // Ensure the URL matches your working environment
      const url = `${backendUrl}/api/vendor-transcations/create-full`;

      const response = await fetch(url, {
        method: "POST", // Based on your working example
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save");
      }

      alert(`Vendor ${isUpdate ? "updated" : "created"} successfully!`);

      if (!isUpdate) {
        setSelectedRows(new Set());
        setIsFormView(false);
        fetchVendors();
      }
      setIsDirty(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const vendorColumns = [
    // Identification Fields
    { key: "vendId", label: "Vendor ID", sortable: true },
    { key: "vendName", label: "Name", sortable: true },
    { key: "location", label: "Location" },
    { key: "prospectiveVendorId", label: "Prospective ID" },

    // Header Tab Fields
    { key: "vendLongName", label: "Long Name" },
    { key: "vendWebSite", label: "Website" },
    {
      key: "sVendPoCntlCd",
      label: "Status",
      render: (val) => {
        const status = VendAppstatus.find((s) => s.value === val);
        return status ? status.label : val;
      },
    },
    {
      key: "holdPmtFl",
      label: "Hold Pmt",
      render: (val) => (val === "Y" ? "Yes" : "No"),
    },
    {
      key: "prVendFl",
      label: "Payroll",
      render: (val) => (val === "Y" ? "Yes" : "No"),
    },

    // Column 2 Fields
    { key: "vendGrpCd", label: "Vendor Group" },
    { key: "dunsNo", label: "DUNS #" },
    { key: "ueiNo", label: "UEI #" },
    { key: "cageCd", label: "CAGE Code" },

    // 1099 Info
    {
      key: "prnt1099Fl",
      label: "Print 1099",
      render: (val) => (val === "Y" ? "Yes" : "No"),
    },
    { key: "ap1099TaxId", label: "Tax ID" },
    { key: "vend1099Name", label: "1099 Name" },

    // Defaults Tab Fields
    { key: "chkMemoS", label: "Check Memo" },
    { key: "fobFld", label: "FOB" },
    { key: "shipViaFld", label: "Ship Via" },

    // Entry Info
    { key: "userId", label: "Entry User" },
    { key: "entryDtt", label: "Entry Date" },
  ];

  // Sample data for the "Addresses" table seen in your screenshot
  const addressColumns = [
    { label: "Address Type", accessor: "type" },
    { label: "Address 1", accessor: "line1" },
    { label: "City", accessor: "city" },
    { label: "State", accessor: "state" },
    { label: "Zip", accessor: "zip" },
    { label: "Country", accessor: "country" },
  ];

  const statusMapping = [
    { label: "Large", value: "L" },
    { label: "Small", value: "S" },
    { label: "Non-Profit", value: "N" },
    { label: "Foreign/Other", value: "F" },
  ];

  const VendAppstatus = [
    { label: "Approve", value: "A" },
    { label: "Disapprove", value: "D" },
    { label: "Pending", value: "P" },
  ];

  const vendTerms = [
    { label: "1 MO", value: "A" },
    { label: "1% 10 N 20", value: "D" },
    { label: "15 MO", value: "P" },
  ];

  const toggleRowSelection = (id) => {
    setSelectedRows((prevSet) => {
      const newSet = new Set(prevSet); // Create a copy of the Set
      if (newSet.has(id)) {
        newSet.delete(id); // Remove if exists
      } else {
        newSet.add(id); // Add if it doesn't
      }
      return newSet;
    });
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer title="Manage Prospective Vendors">
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={currentIndex}
          totalRecords={vendorList.length}
        />

        {isFormView ? (
          <div className="space-y-3 mt-2">
            <FormSection>
              <div className="grid grid-cols-3 gap-x-8 gap-y-2 px-1">
                <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-1">
                  <FormInput
                    label="Prospective Vendor ID"
                    value={formData.prospectiveVendorId}
                    readOnly
                    className="bg-gray-100"
                  />
                  <div />
                  <FormInput
                    label="Future Vendor ID"
                    value={formData.vendor.vendId}
                    onChange={(e) =>
                      handleInputChange("vendId", e.target.value)
                    }
                  />
                  <div />
                  <FormInput
                    label="Name"
                    required
                    value={formData.vendor.vendName}
                    onChange={(e) =>
                      handleInputChange("vendName", e.target.value)
                    }
                  />
                  <div />
                  <FormInput
                    label="Location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                  />
                  <div className="col-span-1">
                    <FormSection title="Vendor Record Status">
                      <FormInput
                        required
                        value={formData.vendor.vendApprvlCd}
                        disabled
                      />
                    </FormSection>
                  </div>
                </div>
              </div>
            </FormSection>

            <div className="border-t border-gray-200 pt-2">
              <div className="flex gap-4 px-4 text-[11px] font-bold text-gray-500 mb-1">
                {["General", "Notes"].map((tab) => (
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

              {currentTab === "General" && (
                <FormSection>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <FormInput
                        label="Long Name"
                        required
                        value={formData.vendor.vendLongName}
                        onChange={(e) =>
                          handleInputChange("vendLongName", e.target.value)
                        }
                      />
                      <FormInput
                        label="Specialty"
                        required
                        value={formData.vendor.vendSpclty}
                        onChange={(e) =>
                          handleInputChange("vendSpclty", e.target.value)
                        }
                      />
                      <FormInput
                        label="Vendor Web Site"
                        value={formData.vendor.vendWebSite}
                        onChange={(e) =>
                          handleInputChange("vendWebSite", e.target.value)
                        }
                      />
                      <FormSearchSelect
                        label="Terms"
                        options={vendTerms}
                        value={formData.vendor.termsDc}
                        displayKey="label"
                        onSelect={(val) =>
                          handleInputChange("termsDc", val.value)
                        }
                      />
                      <FormInput
                        label="DUNS Number"
                        value={formData.vendor.dunsNo}
                        onChange={(e) =>
                          handleInputChange("dunsNo", e.target.value)
                        }
                      />
                      <FormInput
                        label="UEI Number"
                        value={formData.vendor.ueiNo}
                        onChange={(e) =>
                          handleInputChange("ueiNo", e.target.value)
                        }
                      />
                      <FormInput
                        label="CAGE Code"
                        value={formData.vendor.cageCd}
                        onChange={(e) =>
                          handleInputChange("cageCd", e.target.value)
                        }
                      />
                      <FormInput
                        label="Vendor Approval Status"
                        disabled
                        value={formData.vendor.vendApprvlCd}
                      />
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-1">
                      <FormSection title="GovWin IQ Company Information">
                        <FormInput
                          label="GovWin IQ Company ID"
                          value={formData.vendor.govwinCompId}
                          onChange={(e) =>
                            handleInputChange("govwinCompId", e.target.value)
                          }
                        />
                        <FormInput
                          label="Last GovWin IQ Synch"
                          disabled
                          value={formData.vendor.timeStamp}
                        />
                        <FormInput
                          label="Last GovWin IQ Analyst Update"
                          disabled
                          value={formData.vendor.modifiedBy}
                        />
                        <FormInput
                          type="checkbox"
                          label="Do Not Refresh"
                          checked={formData.vendor.prnt1099Fl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "prnt1099Fl",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                        <div className="pt-2">
                          <ActionDetailButton
                            label="Refresh from IQ"
                            onClick={() => {}}
                          />
                        </div>
                      </FormSection>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-1">
                      <FormSection title="Business Classification">
                        <FormSection title="Size">
                          {statusMapping.map((status) => (
                            <FormInput
                              key={status.value}
                              type="radio"
                              label={status.label}
                              value={status.value}
                              checked={
                                formData.vendor.sVendPoCntlCd === status.value
                              }
                              onChange={() =>
                                handleInputChange("sVendPoCntlCd", status.value)
                              }
                            />
                          ))}
                        </FormSection>
                        <div className="grid grid-cols-1 gap-3">
                          <FormInput
                            label="Certification Date"
                            type="date"
                            required
                            value={formData.vendor.vendCertDt?.split("T")[0]}
                            onChange={(e) =>
                              handleInputChange("vendCertDt", e.target.value)
                            }
                          />
                          <FormInput
                            label="Certification Number"
                            value={formData.vendor.vendCertId}
                            onChange={(e) =>
                              handleInputChange("vendCertId", e.target.value)
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-y-1 mt-4">
                          <FormInput
                            type="checkbox"
                            label="Woman-Owned"
                            checked={formData.vendor.clWomOwnFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "clWomOwnFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            type="checkbox"
                            label="Veteran-Owned"
                            checked={formData.vendor.clVetFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "clVetFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            type="checkbox"
                            label="Alaskan Native Corporations (ANC) and INdian Tribes"
                            checked={formData.vendor.holdPmtFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "holdPmtFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            type="checkbox"
                            label="Disadvantaged (Include Minority-Owned)"
                            checked={formData.vendor.prVendFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "prVendFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            type="checkbox"
                            label="Service-Disabled Veteran-Owned"
                            checked={formData.vendor.holdPmtFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "holdPmtFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            type="checkbox"
                            label="HUBZone"
                            checked={formData.vendor.prVendFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "prVendFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            type="checkbox"
                            label="8(a) Certified"
                            checked={formData.vendor.holdPmtFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "holdPmtFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            type="checkbox"
                            label="AbilityOne Non-Profit Agency"
                            checked={formData.vendor.prVendFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "prVendFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            type="checkbox"
                            label="Historical Black Colleges and Universities/Minority Institutions"
                            checked={formData.vendor.holdPmtFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "holdPmtFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />

                          <FormInput
                            type="checkbox"
                            label="LGBTQ+Owned"
                            checked={formData.vendor.clLgbtqFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "clLgbtqFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                        </div>
                        <div className="mt-4">
                          <FormInput
                            label="CMMC Level"
                            disabled
                            value={formData.vendor.cmmcLevel}
                          />
                        </div>
                      </FormSection>
                    </div>
                  </div>
                </FormSection>
              )}
            </div>

            {/* Tab Content: Notes */}
            {currentTab === "Notes" && (
              <div className="flex gap-4 p-4 animate-in fade-in duration-300">
                {/* Left Side: Internal Notes */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Notes
                  </label>
                  <div className="relative border border-gray-300 rounded-lg bg-white overflow-hidden">
                    <textarea
                      className="w-full h-80 outline-none text-xs resize-none p-3"
                      placeholder="Enter internal notes here..."
                      value={formData.vendor.vendNotes}
                      onChange={(e) =>
                        handleInputChange("vendNotes", e.target.value)
                      }
                    />
                    <div className="absolute top-2 right-2 text-gray-400">
                      <Edit3 size={16} />
                    </div>
                  </div>
                </div>

                {/* Right Side: Approval/Rejection Notes */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval/Rejection Notes
                  </label>
                  <div className="relative border border-gray-300 rounded-lg bg-gray-100 min-h-[320px]">
                    <textarea
                      className="w-full h-80 outline-none text-xs resize-none p-3 bg-transparent"
                      placeholder="Enter approval notes..."
                      disabled // Assuming this is read-only based on the gray background in your image
                      value={formData.vendor.approvalNotes || ""}
                      onChange={(e) =>
                        handleInputChange("approvalNotes", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions - Clicking these now opens the Modal */}
            <div className="flex flex-wrap gap-1  p-1.5 ">
              <ActionDetailButton
                label="Vendor Employees"
                icon={User}
                isActive={activeModal.includes("VendorEmployee")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "VendorEmployee",
                    ...prevArray,
                  ])
                }
              />
              <ActionDetailButton
                label="Vendor Certification"
                icon={Layers}
                isActive={activeModal.includes("Vendor Certification")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "Vendor Certification",
                    ...prevArray,
                  ])
                }
              />
              <ActionDetailButton
                label="Addresses/Contact Info"
                icon={MapPin}
                isActive={activeModal.includes("Addresses")}
                onClick={() =>
                  setActiveModal((prevArray) => ["Addresses", ...prevArray])
                }
              />
              <ActionDetailButton
                label="Activities"
                icon={ShieldCheck}
                isActive={activeModal.includes("Activities")}
                onClick={() =>
                  setActiveModal((prevArray) => ["Activities", ...prevArray])
                }
              />
              <ActionDetailButton
                label="NDA"
                icon={Briefcase}
                isActive={activeModal.includes("NDA")}
                onClick={() =>
                  setActiveModal((prevArray) => ["NDA", ...prevArray])
                }
              />
              <ActionDetailButton
                label="Teaming Agreement"
                icon={CreditCard}
                isActive={activeModal.includes("Teaming Agreement")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "Teaming Agreement",
                    ...prevArray,
                  ])
                }
              />
              <ActionDetailButton
                label="User-Defined Info"
                icon={Globe}
                isActive={activeModal.includes("User-Defined Info")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "User-Defined Info",
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
        ) : (
          <>
            {/* {!isFormView && ( */}
            <div
              // className={`overflow-x-auto max-h-[35vh]  ${showNewPopup ? "pointer-events-none" : ""}`}
              className={`overflow-x-auto max-h-[35vh] `}
            >
              <table className="min-w-full text-sm border border-gray-300 rounded">
                <thead className="bg-gray-200 sticky top-0 z-10 ">
                  <tr>
                    <th className="th-thead w-10">
                      <input
                        type="checkbox"
                        // checked={isAllSelected}
                        // onChange={toggleSelectAll}
                      />
                    </th>

                    {vendorColumns.map((col) => {
                      const isRequired = ["acctId", "acctName"].includes(col);

                      return (
                        <th key={col.key} className="th-thead">
                          <div className="flex">
                            <span>{col.label}</span>
                            <span className="text-red-500">
                              {isRequired ? "*" : ""}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="tbody">
                  {vendorList.map((item, rowIndex) => {
                    // Define a consistent unique ID for selection and keys
                    const uniqueId = item.vendor?.vendId || rowIndex;
                    const isSelected = selectedRows.has(uniqueId);

                    return (
                      <tr
                        key={item.vendor?.vendId || rowIndex}
                        onClick={() => {
                          setFormData(item);
                          setIsFormView(true);
                        }}
                        className={`${
                          selectedRows.has(item.id || item.vendor?.vendId)
                            ? "bg-blue-50"
                            : ""
                        } hover:bg-gray-50 transition-colors cursor-pointer`}
                      >
                        <td className="text-center tbody-td ">
                          <input
                            type="checkbox"
                            // checked={selectedRows.has(item.id || item.acctId)}
                            checked={isSelected}
                            className="h-3 w-3 accent-blue-600 cursor-pointer"
                            onChange={(e) => {
                              e.stopPropagation();
                              const newSet = new Set(selectedRows);
                              if (newSet.has(uniqueId)) {
                                newSet.delete(uniqueId);
                              } else {
                                newSet.add(uniqueId);
                              }
                              setSelectedRows(newSet);
                            }}
                          />
                        </td>
                        {vendorColumns.map((col) => {
                          // Get value: check top level first, then inside vendor object
                          const rawValue =
                            item[col.key] ?? item.vendor?.[col.key];

                          return (
                            <td key={col.key} className="td-input">
                              {col.render
                                ? col.render(rawValue)
                                : rawValue || "-"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {vendorList.length === 0 && (
                <div className="p-8 text-center text-gray-400 italic">
                  No vendor records found.
                </div>
              )}
            </div>
          </>
        )}
      </MainContainer>
      {/* Dynamic Sub-Form Modal */}
      {activeModal.includes("VendorEmployee") && (
        <VendorEmployeeDetailP
          toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "VendorEmployee"),
            )
          }
        />
      )}
      {activeModal.includes("Vendor Certification") && (
        <VendorCertificationsP
          toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Vendor Certification"),
            )
          }
        />
      )}
      {activeModal.includes("Addresses") && (
        <AddressesP
          toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Addresses"),
            )
          }
        />
      )}
      {activeModal.includes("Activities") && (
        <Activities
          toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Activities"),
            )
          }
        />
      )}
      {activeModal.includes("NDA") && (
        <NDAInfo
          toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) => prev.filter((item) => item !== "NDA"))
          }
        />
      )}
      {activeModal.includes("Teaming Agreement") && (
        <TeamingAgreement
          toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Teaming Agreement"),
            )
          }
        />
      )}
      {activeModal.includes("User-Defined Info") && (
        // <UserDefinedInfoP
        //   toolbarActions={toolbarActions}
        //   formData={formData}
        //   handleInputChange={handleInputChange}
        //   onClose={() =>
        //     setActiveModal((prev) =>
        //       prev.filter((item) => item !== "User-Defined Info"),
        //     )
        //   }
        // />
        <UserDefineLabel master="PV" />
      )}
    </div>
  );
};

export default ManageProspectiveVendors;
