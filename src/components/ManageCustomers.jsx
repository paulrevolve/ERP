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
import { backendUrl } from "./config";
import api from "../utils/api";
import { toast } from "react-toastify";
import {
  AddressesC,
  CustomerAlias,
  DefaultsAccts,
  Notes,
  VATInfoC,
} from "./CustomerSub";

// --- Sub-Form Modal Component ---

const ManageCustomers = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [isFormView, setIsFormView] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("Customer Details");

  // Modal State
  const [activeModal, setActiveModal] = useState([]); // stores the label of the active sub-form
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTermApprvl, setSearchTermApprvl] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // dropdowns
  const [dropdownData, setDropdownData] = useState({
    employees: [],
    terms: [],
    vendors: [],
    apAccounts: [],
    cashAccounts: [],
  });

  const fetchAllDropDown = async () => {
    try {
      const [emp, terms, vend, ap, cash] = await Promise.all([
        api.get(`${backendUrl}/Employee/GetAllEmployees`),
        api.get(`${backendUrl}/api/VendorTerms`),
        api.get(
          `${backendUrl}/api/Customer/GetAllVendors?page=1&pageSize=20000&sortBy=vend_id&sortOrder=asc`,
        ),
        api.get(`${backendUrl}/api/default-ap-accounts?page=1&pageSize=50000`),
        api.get(`${backendUrl}/api/dflt-cash-accts?page=1&pageSize=50000`),
      ]);

      setDropdownData({
        employees: emp.data || [],
        terms: terms.data || [],
        vendors: vend.data?.data || [], // Handle nested pagination data if necessary
        apAccounts: ap.data?.data || [],
        cashAccounts: cash.data?.data || [],
      });
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
      toast.error("Failed to load support data.");
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const initialFormState = {
    custId: "",
    companyId: "",
    custName: "",
    vendId: "",
    extTaxExemptId: "",
    applyFinChgFl: "N", // Changed 's' to 'N' as common flag default
    graceDaysNo: 0,
    annlFinRt: 0,
    arCrLimitKey: 0,
    arCrRatingKey: 0,
    salesTerrKey: 0,
    custTypeDc: "",
    salesAbbrvCd: "",
    modifiedBy: "",
    timeStamp: new Date().toISOString(),
    rowVersion: 0,
    crRatingDt: new Date().toISOString(),
    extCrId: "",
    fobFld: "",
    sCreditStatusCd: "",
    ovrshpAllowFl: "N",
    srceInspFl: "N",
    certOfCnfrmFl: "N",
    partialShipFl: "N",
    allowSubstFl: "N",
    acceptancePtFl: "N",
    userDef1Fld: "",
    userDef2Fld: "",
    custLongName: "",
    apprvdOrdBalAmt: 0,
    discAllowFl: "N",
    discPctRt: 0,
    slsCntFirstName: "",
    slsCntLastName: "",
    phoneId: "",
    faxId: "",
    acknReqdFl: "N",
    issueByAddrCd: "",
    useWawfFl: "N",
    custType: {
      custTypeDc: "",
      modifiedBy: "",
      timeStamp: new Date().toISOString(),
      customers: [],
    },
    arCrLimit: {
      arCrLimitKey: 0,
      crLimitDc: "",
      limitAmt: 0,
      modifiedBy: "",
      timeStamp: new Date().toISOString(),
      customers: [],
    },
    arCrRating: {
      arCrRatingKey: 0,
      crRatingCd: "",
      crRatingDesc: "",
      modifiedBy: "",
      timeStamp: new Date().toISOString(),
      customers: [],
    },
    salesTerr: {
      salesTerrKey: 0,
      salesTerrDc: "",
      modifiedBy: "",
      timeStamp: new Date().toISOString(),
      customers: [],
    },
    salesAbbrv: {
      salesAbbrvCdId: "",
      salesAbbrvDesc: "",
      modifiedBy: "",
      timeStamp: new Date().toISOString(),
      customers: [],
    },
    issueByAddr: {
      issueByAddrCd: "",
      issueByAddrName: "",
      cityName: "",
      modifiedBy: "",
      timeStamp: new Date().toISOString(),
      customers: [],
    },
    aliases: [
      {
        custId: "",
        custAliasKey: 0,
        companyId: "",
        custAliasName: "",
        modifiedBy: "",
        timeStamp: new Date().toISOString(),
        rowVersion: 0,
        cust: "",
      },
    ],
    custLimitCrncies: [
      {
        custId: "",
        sCrncyCd: "",
        crncyTypeCd: "",
        modifiedBy: "",
        timeStamp: new Date().toISOString(),
        companyId: "",
        rowVersion: 0,
        cust: "",
      },
    ],
    custDefaultAccounts: [
      {
        custId: "",
        sCustTrnType: "",
        companyId: "",
        acctId: "",
        orgId: "",
        ref1Id: "",
        ref2Id: "",
        projId: "",
        modifiedBy: "",
        timeStamp: new Date().toISOString(),
        rowVersion: 0,
        bankAcctAbbrv: "",
        sCustTrnTypeNavigation: {
          sCustTrnTypeCode: "",
          description: "",
          modifiedBy: "",
          timeStamp: new Date().toISOString(),
          rowVersion: 0,
          custDefaultAccounts: [],
        },
        cust: "",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleDelete = async () => {
    // 1. Check if anything is selected
    if (selectedRows.size === 0) {
      toast.warn("Please select at least one vendor to delete.");
      return;
    }

    // Confirm with the user
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRows.size} selected item(s)?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // Convert Set to Array to use for...of or map
      const idsToDelete = Array.from(selectedRows);

      for (const id of idsToDelete) {
        // Check if it's a temporary local row or a database row
        const isTemporary = String(id).startsWith(TEMP_);

        if (isTemporary) {
          // --- LOCAL DELETE ---
          // Just filter it out of the local state
          setVendorList((prev) => prev.filter((item) => item.tempId !== id));
        } else {
          // --- SERVER DELETE ---
          // Call your API endpoint for the specific ID
          await api.delete(`${backendUrl}/api/Customer/delete/${id}`);
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedRows(new Set());
      setSelectedRow(null);
      fetchCustomer(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomer = async () => {
    // Capture the ID of the currently active row before the update happens
    const previousId = selectedRow?.vendId;

    try {
      setLoading(true);
      const res = await api.get(`${backendUrl}/api/Customer`);

      const data = res.data.data || [];
      setVendorList(data);

      if (data.length > 0) {
        // 1. Try to find the record that was selected before the fetch
        const lastSelectedRecord = data.find(
          (item) => item.vendor?.vendId === previousId,
        );

        // 2. Logic: Use the last selected record if it exists, otherwise use the first entry
        const targetRecord = lastSelectedRecord || data[0];
        const targetId = targetRecord.vendor?.vendId;

        // 3. Update all selection states to sync the UI
        setSelectedRow(targetRecord.vendor); // Update active reference
        setFormData({ vendor: targetRecord.vendor });
        setSelectedRows(new Set([targetId])); // Highlight the row in the table

        // 4. Update index for keyboard navigation or pagination logic
        const targetIndex = data.findIndex(
          (item) => item.vendor?.vendId === targetId,
        );
        setCurrentIndex(targetIndex !== -1 ? targetIndex : 0);
      } else {
        // Clear selection if no data is returned
        handleResetSelection();
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to refresh customer list.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to keep the catch/else blocks clean
  const handleResetSelection = () => {
    setSelectedRow(null);
    setSelectedRows(new Set());
    setCurrentIndex(0);
  };

  useEffect(() => {
    fetchCustomer();
    fetchAllDropDown();
  }, []);

  const handleAdd = () => {
    // 1. Check if there is already an unsaved new record in vendorList
    const hasUnsavedNew = vendorList.some(
      (row) => row.vendor.isNew || !!row.vendor.tempId,
    );

    if (hasUnsavedNew) {
      toast.warn(
        "Please save or cancel the current new entry before adding another.",
      );
      return;
    }

    // 2. Create a unique Temporary ID for tracking before backend save
    const newId = `TEMP_${Date.now()}`;
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    // 3. Construct the new row using your initialFormState as a template
    const newRow = {
      vendor: {
        ...initialFormState.vendor, // Spread existing defaults
        vendId: "", // Clear ID for new entry
        tempId: newId, // Add the temporary tracker
        isNew: true, // Flag for API (POST instead of PUT)
        isDirty: true, // Flag to enable the Save button
        modifiedBy: userSession?.name || "system",
        entryDtt: formatDate(new Date()), // Use your YYYY-MM-DD helper
      },
    };

    // 4. Update the States
    setVendorList([newRow, ...vendorList]); // Add to the top of the list
    setSelectedRows(new Set([newId])); // Check the checkbox for this new row
    setSelectedRow(newRow.vendor); // Set as active data for the form view
    setFormData({ vendor: newRow.vendor });
    setCurrentIndex(0); // Focus the first position
  };

  const handleInputChange = (field, value, rowId) => {
    setIsDirty(true);

    // 1. Update the Master List (The source of truth)
    setVendorList((prevList) =>
      prevList.map((item) => {
        // Access ID from the nested vendor object or tempId
        const itemId = item.vendor?.tempId || item.vendor?.vendId;

        if (String(itemId) === String(rowId)) {
          const updatedVendor = {
            ...item.vendor,
            [field]: value,
          };

          return {
            ...item,
            isDirty: true,
            vendor: updatedVendor,
          };
        }
        return item;
      }),
    );

    // 2. Update the Active Record (To keep the form inputs moving)
    setSelectedRow((prev) => {
      if (!prev) return prev;
      const currentId = prev.tempId || prev.vendId;
      if (String(currentId) !== String(rowId)) return prev;

      const updated = { ...prev, [field]: value };
      setFormData({ vendor: updated });
      return updated;
    });
  };

  const handleSaveAll = async () => {
    // Check for any changes (New or Modified)
    const changedRows = vendorList.filter(
      (row) => row.vendor?.isNew || row.isDirty,
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setLoading(true);
    try {
      const savePromises = changedRows.map(async (row) => {
        // 1. Prepare Payload (Customer object + nested data)
        const { isNew, tempId, ...cleanVendorData } = row.vendor;
        const finalPayload = {
          ...cleanVendorData,
          aliases: row.aliases || [],
          custLimitCrncies: row.custLimitCrncies || [],
          custDefaultAccounts: row.custDefaultAccounts || [],
        };

        // 2. Prioritized API Selection
        if (row.vendor?.isNew) {
          return api.post(`${backendUrl}/api/Customer`, finalPayload);
        }

        return api.put(
          `${backendUrl}/api/Customer/${cleanVendorData.vendId || cleanVendorData.custId}`,
          finalPayload,
        );
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // Reset flags
      setIsDirty(false);
      // setIsFormDirty(false);

      // Refresh to get DB IDs and clear all local 'isNew'/'isDirty' states
      fetchCustomer();
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(
        error.response?.data?.message || "Error during save operation.",
      );
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

  const addressColumns = [
    { label: "Address Type", accessor: "type" },
    { label: "Address 1", accessor: "line1" },
    { label: "City", accessor: "city" },
    { label: "State", accessor: "state" },
    { label: "Zip", accessor: "zip" },
    { label: "Country", accessor: "country" },
  ];

  const statusMapping = [
    { label: "Ok", value: "O" },
    { label: "Warning", value: "W" },
    { label: "Hold", value: "H" },
  ];

  const creditRatings = [
    { label: "Approve", value: "A" },
    { label: "Disapprove", value: "D" },
    { label: "Pending", value: "P" },
  ];

  const vendorList = [
    { id: "Vend01", name: "AA" },
    { id: "Vend02", name: "DD" },
    { id: "Vend03", name: "PP" },
  ];
  const paymentTerms = [
    { id: "Vend01", name: "AA" },
    { id: "Vend02", name: "DD" },
    { id: "Vend03", name: "PP" },
  ];
  const territory = [
    { id: "Vend01", name: "AA" },
    { id: "Vend02", name: "DD" },
    { id: "Vend03", name: "PP" },
  ];
  const custometType = [
    { id: "Vend01", name: "AA" },
    { id: "Vend02", name: "DD" },
    { id: "Vend03", name: "PP" },
  ];
  const options = [
    { id: "None", name: "N" },
    { id: "Source", name: "S" },
    { id: "Destination", name: "D" },
    { id: "Other", name: "O" },
  ];

  const jumpToCode = (code) => {
    if (!code) return;

    const found = vendorList.find(
      (item) =>
        String(item.vendor.vendId).toLowerCase() === String(code).toLowerCase(),
    );

    if (found) {
      const id = found.tempId || found.vendId; //

      // 1. Update Form View vendorList
      setSelectedRow(found); //
      setIsFormView(true); //

      // 2. Update Navigation Index
      const newIdx = vendorList.indexOf(found);
      setCurrentIndex(newIdx); //

      // 3. SYNC TABLE SELECTION
      // This ensures the row is checked/highlighted in the Table View
      setSelectedRows(new Set([id]));
    } else {
      toast.error(`Organization ID "${code}" not found.`); //
    }
  };

  const handleNavigate = (direction) => {
    const idx = vendorList.findIndex(
      (x) =>
        (x.vendor.tempId || x.vendor.vendId) ===
        (selectedRow?.tempId || selectedRow?.vendId),
    );

    let newIdx = idx;
    if (direction === "next" && idx < vendorList.length - 1) newIdx = idx + 1;
    if (direction === "prev" && idx > 0) newIdx = idx - 1;
    if (direction === "start") newIdx = 0;
    if (direction === "end") newIdx = vendorList.length - 1;

    if (newIdx !== idx) {
      const nextRecord = vendorList[newIdx];
      const nextId = nextRecord.vendor.tempId || nextRecord.vendor.vendId;

      // 1. Update the record being shown in the form
      setSelectedRow(nextRecord.vendor);
      setCurrentIndex(newIdx);

      // 2. CRITICAL: Update the selection so the table highlights this row
      setSelectedRows(new Set([nextId]));

      // setIsFormDirty(false);
    }
  };

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

  const salesPersonList = [
    { id: "PRJ01", name: "ISO 9001" },
    { id: "PRJ02", name: "CIS Compliance" },
  ];
  const customerList = [
    { id: "PRJ01", name: "ISO 9001" },
    { id: "PRJ02", name: "CIS Compliance" },
  ];

  const priceGroupList = [
    { id: "PRJ01", name: "ISO 9001" },
    { id: "PRJ02", name: "CIS Compliance" },
  ];

  const lineDiscountList = [
    { id: "PRJ01", name: "ISO 9001" },
    { id: "PRJ02", name: "CIS Compliance" },
  ];
  const multiLineDiscountList = [
    { id: "PRJ01", name: "ISO 9001" },
    { id: "PRJ02", name: "CIS Compliance" },
  ];

  const toolbarActions = {
    onAdd: handleAdd,
    // onSave: handleSave,
    onDelete: handleDelete,
    onToggleView: () => setIsFormView(!isFormView),
    onClear: () => fetchCustomers(),
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500 mt-10">
      <MainContainer title="Manage Customers">
        <Toolbar
          isFormView={isFormView}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          totalRecords={vendorList.length}
          handleNavigate={handleNavigate}
          jumpToCode={jumpToCode}
          selectedRow={selectedRow}
          isDirty={isDirty}
          loading={loading}
          actions={{
            onAdd: handleAdd,
            onCopy: () => console.log("Copy"),
            onPaste: () => console.log("paste"),
            onDelete: handleDelete,
            onSave: handleSaveAll,
            onClear: () => setIsDirty(false),
            onToggleView: () => {
              // If we are about to show the form and nothing is selected
              if (
                !isFormView &&
                selectedRow === null &&
                vendorList.length > 0
              ) {
                const firstVendor = vendorList[0];
                const firstId = String(firstVendor.vendor.vendId);

                // 1. Set the first record as the active data
                setSelectedRow(firstVendor.vendor);

                // 2. Add the first record to the selection set so the checkbox matches
                setSelectedRows((prev) => {
                  const newSet = new Set(prev);
                  newSet.add(firstId);
                  return newSet;
                });

                // 3. Update index tracking
                setCurrentIndex(0);
              }

              // Toggle the view state
              setIsFormView(!isFormView);
            },
          }}
        />

        {isFormView ? (
          <div className="space-y-3 mt-2">
            {/* Identification Row */}
            <FormSection>
              <div className="grid grid-cols-3 gap-2">
                <FormInput
                  label="Customer Account"
                  value={selectedRow?.custId || ""}
                  required
                  onChange={(e) =>
                    handleInputChange(
                      "custId",
                      e.target.value,
                      selectedRow?.tempId || selectedRow?.custId, // Pass the ID
                    )
                  }
                />
                <FormInput
                  label="Name"
                  value={selectedRow?.custName || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "custName",
                      e.target.value,
                      selectedRow?.tempId || selectedRow?.custName, // Pass the ID
                    )
                  }
                />
                <FormInput
                  label="Long Name"
                  value={selectedRow?.custLongName || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "custLongName",
                      e.target.value,
                      selectedRow?.tempId || selectedRow?.custLongName, // Pass the ID
                    )
                  }
                />
              </div>
            </FormSection>

            <div className="border-t border-gray-200 pt-2">
              {/* Tab Navigation */}
              <div className="flex gap-4 px-4 text-[11px] font-bold text-gray-500 mb-1">
                {[
                  "Customer Details",
                  "Credit Info",
                  "Sales Order",
                  "Address",
                ].map((tab) => (
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

              {currentTab === "Customer Details" && (
                <FormSection className="grid grid-cols-2 gap-4">
                  <FormSearchSelect
                    label="Vendor"
                    options={vendorList}
                    onSelect={(opt) => {
                      handleInputChange(
                        "payVendId",
                        opt.vendId,
                        selectedRow?.tempid || selectedRow?.vendId,
                      );
                      handleInputChange(
                        "payVendName",
                        opt.vendName,
                        selectedRow?.tempid || selectedRow?.vendId,
                      );
                    }}
                    displayKey="name"
                  />

                  <FormSection title="Status">
                    {statusMapping.map((status) => (
                      <FormInput
                        key={status.value}
                        type="radio"
                        label={status.label}
                        value={status.value}
                        checked={selectedRow?.sVendPoCntlCd === status.value}
                        onChange={() =>
                          handleInputChange(
                            "sVendPoCntlCd",
                            status.value,
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                    ))}
                  </FormSection>
                  <div />

                  <FormSearchSelect
                    label="Payment Terms"
                    options={paymentTerms}
                    onSelect={(opt) => {
                      handleInputChange(
                        "payVendId",
                        opt.vendId,
                        selectedRow?.tempid || selectedRow?.vendId,
                      );
                      handleInputChange(
                        "payVendName",
                        opt.vendName,
                        selectedRow?.tempid || selectedRow?.vendId,
                      );
                    }}
                    displayKey="name"
                  />

                  <FormInput
                    label="User Label 1"
                    required
                    value={selectedRow?.vendLongName}
                    onChange={(e) =>
                      handleInputChange(
                        "vendLongName",
                        e.target.value,
                        selectedRow?.tempId || selectedRow?.vendId, // Pass the ID
                      )
                    }
                  />
                  <FormSearchSelect
                    label="Territory"
                    options={territory}
                    onSelect={(opt) => {
                      handleInputChange(
                        "payVendId",
                        opt.vendId,
                        selectedRow?.tempid || selectedRow?.vendId,
                      );
                      handleInputChange(
                        "payVendName",
                        opt.vendName,
                        selectedRow?.tempid || selectedRow?.vendId,
                      );
                    }}
                    displayKey="name"
                  />

                  <FormInput
                    label="User Label 2"
                    required
                    value={selectedRow?.vendLongName}
                    onChange={(e) =>
                      handleInputChange(
                        "vendLongName",
                        e.target.value,
                        selectedRow?.tempId || selectedRow?.vendId, // Pass the ID
                      )
                    }
                  />

                  <FormSearchSelect
                    label="Customer Type"
                    options={custometType}
                    onSelect={(opt) => {
                      handleInputChange(
                        "payVendId",
                        opt.vendId,
                        selectedRow?.tempid || selectedRow?.vendId,
                      );
                      handleInputChange(
                        "payVendName",
                        opt.vendName,
                        selectedRow?.tempid || selectedRow?.vendId,
                      );
                    }}
                    displayKey="name"
                  />
                </FormSection>
              )}

              {currentTab === "Credit Info" && (
                <div className="grid grid-cols-2 gap-8">
                  <FormSection title="Credit Information">
                    {/* LEFT COLUMN: Credit & Limits */}
                    <div className="space-y-4">
                      <FormInput
                        type="checkbox"
                        checked={selectedRow?.edVchPayVendFl === "Y"}
                        label="Apply Finance Charges"
                        onChange={(e) =>
                          handleInputChange(
                            "edVchPayVendFl",
                            e.target.checked ? "Y" : "N",
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormInput
                        label="Number of Grace Days"
                        type="number"
                        readOnly
                        value={formData?.creditLimit}
                        onChange={(e) =>
                          handleInputChange("creditLimit", e.target.value)
                        }
                        placeholder="0.00"
                      />
                      <FormInput
                        label="Annual Percent"
                        type="number"
                        readOnly
                        value={formData?.creditLimit}
                        onChange={(e) =>
                          handleInputChange("creditLimit", e.target.value)
                        }
                        placeholder="0.00"
                      />

                      <FormInput
                        label="Credit Limit"
                        type="number"
                        value={formData?.creditLimit}
                        onChange={(e) =>
                          handleInputChange("creditLimit", e.target.value)
                        }
                        placeholder="0.00"
                      />
                      <FormInput
                        label="Credit Number"
                        type="number"
                        value={formData?.creditLimit}
                        onChange={(e) =>
                          handleInputChange("creditLimit", e.target.value)
                        }
                        placeholder="0.00"
                      />

                      <FormSearchSelect
                        label="Credit Rating"
                        options={creditRatings} // Assumed state for ratings list
                        value={formData?.creditRatingCd}
                        onSelect={(opt) =>
                          handleInputChange("creditRatingCd", opt.value)
                        }
                        displayKey="label"
                      />

                      <FormInput
                        label="Rating Date"
                        type="date"
                        required
                        value={formData.cisStartDt || ""}
                        onChange={(e) =>
                          handleInputChange("cisStartDt", e.target.value)
                        }
                      />
                    </div>
                  </FormSection>

                  {/* RIGHT COLUMN: Tax & Identification */}
                  <div className="space-y-4">
                    <FormSection title="A/R Balance Information">
                      <FormInput
                        label="Outstanding A/R Balance"
                        value={formData?.vatRegNo}
                        onChange={(e) =>
                          handleInputChange("vatRegNo", e.target.value)
                        }
                      />
                    </FormSection>
                  </div>
                </div>
              )}

              {currentTab === "Sales Order" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Sales Order Information */}
                    <FormSection title="Pricing">
                      <div className="space-y-4">
                        <FormSearchSelect
                          label="Project"
                          options={salesPersonList}
                          value={formData?.salesPersonId}
                          onSelect={(opt) =>
                            handleInputChange("salesPersonId", opt.id)
                          }
                          displayKey="name"
                        />
                        <FormSearchSelect
                          label="Catalog"
                          options={salesPersonList}
                          value={formData?.salesPersonId}
                          onSelect={(opt) =>
                            handleInputChange("salesPersonId", opt.id)
                          }
                          displayKey="name"
                        />
                        <FormSection title="Discounts">
                          <FormInput
                            type="checkbox"
                            label="Discount Allowed"
                            checked={formData?.printPricesFl === "Y"}
                            onChange={(e) =>
                              handleInputChange(
                                "printPricesFl",
                                e.target.checked ? "Y" : "N",
                              )
                            }
                          />
                          <FormInput
                            label="Discount %"
                            type="number"
                            value={formData?.totalDiscPct}
                            onChange={(e) =>
                              handleInputChange("totalDiscPct", e.target.value)
                            }
                            placeholder="0.00"
                          />
                        </FormSection>
                      </div>
                    </FormSection>

                    <FormSection title="SO Defaults">
                      <div className="grid grid-cols-2 gap-8">
                        <FormInput
                          type="checkbox"
                          label="Allowed Overshipments"
                          checked={formData?.printPricesFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "printPricesFl",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                        <FormInput
                          type="checkbox"
                          label="Allow Substitutions"
                          checked={formData?.printPricesFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "printPricesFl",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                        <FormInput
                          type="checkbox"
                          label="Allow Partial Shipments"
                          checked={formData?.printPricesFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "printPricesFl",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                        <FormInput
                          type="checkbox"
                          label="Acknowledgement Required"
                          checked={formData?.printPricesFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "printPricesFl",
                              e.target.checked ? "Y" : "N",
                            )
                          }
                        />
                      </div>
                    </FormSection>

                    {/* RIGHT COLUMN: Prices / Discounts */}
                    <FormSection>
                      <div className="space-y-4">
                        <FormSearchSelect
                          label="Sales Group Abbrev"
                          options={priceGroupList}
                          value={formData?.priceGroupCd}
                          onSelect={(opt) =>
                            handleInputChange("priceGroupCd", opt.id)
                          }
                          displayKey="name"
                        />

                        <FormSearchSelect
                          label="Ship Via"
                          options={lineDiscountList}
                          value={formData?.lineDiscGroupCd}
                          onSelect={(opt) =>
                            handleInputChange("lineDiscGroupCd", opt.id)
                          }
                          displayKey="name"
                        />

                        <FormSearchSelect
                          label="Delivery Terms"
                          options={multiLineDiscountList}
                          value={formData?.multiLineDiscGroupCd}
                          onSelect={(opt) =>
                            handleInputChange("multiLineDiscGroupCd", opt.id)
                          }
                          displayKey="name"
                        />

                        <FormInput
                          label="Tax Exemption ID"
                          value={formData?.totalDiscPct}
                          onChange={(e) =>
                            handleInputChange("totalDiscPct", e.target.value)
                          }
                          placeholder="0.00"
                        />
                        <FormSearchSelect
                          label="Project To Charge"
                          options={customerList}
                          value={formData?.billToCustId}
                          onSelect={(opt) =>
                            handleInputChange("billToCustId", opt.id)
                          }
                          displayKey="name"
                        />
                        <FormSearchSelect
                          label="Related Customer Customer"
                          options={customerList}
                          value={formData?.billToCustId}
                          onSelect={(opt) =>
                            handleInputChange("billToCustId", opt.id)
                          }
                          displayKey="name"
                        />
                        <FormInput value={formData?.billToCustId} />
                      </div>
                    </FormSection>
                  </div>
                </div>
              )}

              {currentTab === "Address" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-8">
                    {/* LEFT COLUMN: Sales Order Information */}
                    <FormSection title="Sales Contact Information">
                      <div className="space-y-4">
                        <FormInput
                          label="Last Name"
                          value={formData?.totalDiscPct}
                          onChange={(e) =>
                            handleInputChange("totalDiscPct", e.target.value)
                          }
                        />
                        <FormInput
                          label="Phone Name"
                          type="number"
                          value={formData?.totalDiscPct}
                          onChange={(e) =>
                            handleInputChange("totalDiscPct", e.target.value)
                          }
                        />
                        <FormInput
                          label="First Name"
                          value={formData?.totalDiscPct}
                          onChange={(e) =>
                            handleInputChange("totalDiscPct", e.target.value)
                          }
                        />
                        <FormInput
                          label="Fax"
                          value={formData?.totalDiscPct}
                          onChange={(e) =>
                            handleInputChange("totalDiscPct", e.target.value)
                          }
                        />
                      </div>
                    </FormSection>
                    <div className="grid grid-cols-2 gap-8">
                      <FormSearchSelect
                        label="Inspection Point"
                        options={options}
                        value={formData?.priceGroupCd}
                        onSelect={(opt) =>
                          handleInputChange("priceGroupCd", opt.id)
                        }
                        displayKey="name"
                      />
                      <FormSearchSelect
                        label="FOB"
                        options={options}
                        value={formData?.priceGroupCd}
                        onSelect={(opt) =>
                          handleInputChange("priceGroupCd", opt.id)
                        }
                        displayKey="name"
                      />
                      <FormSearchSelect
                        label="Acceptance Point"
                        options={options}
                        value={formData?.priceGroupCd}
                        onSelect={(opt) =>
                          handleInputChange("priceGroupCd", opt.id)
                        }
                        displayKey="name"
                      />
                      <FormInput
                        type="checkbox"
                        label="Enter SO Invoices for iRAPT"
                        checked={formData?.printPricesFl === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "printPricesFl",
                            e.target.checked ? "Y" : "N",
                          )
                        }
                      />
                    </div>
                    <FormSection title="Addresses">
                      <div className="grid grid-cols-2 gap-8">
                        <FormSearchSelect
                          label="Payment Office"
                          options={priceGroupList}
                          value={formData?.priceGroupCd}
                          onSelect={(opt) =>
                            handleInputChange("priceGroupCd", opt.id)
                          }
                          displayKey="name"
                        />
                        <FormSearchSelect
                          label="Issued By"
                          options={priceGroupList}
                          value={formData?.priceGroupCd}
                          onSelect={(opt) =>
                            handleInputChange("priceGroupCd", opt.id)
                          }
                          displayKey="name"
                        />
                        <FormInput
                          label="Local Processing Office"
                          value={formData?.totalDiscPct}
                          onChange={(e) =>
                            handleInputChange("totalDiscPct", e.target.value)
                          }
                        />
                        <FormInput
                          label="3rd Party-Other Office"
                          value={formData?.totalDiscPct}
                          onChange={(e) =>
                            handleInputChange("totalDiscPct", e.target.value)
                          }
                        />
                        <FormInput
                          label="Inspect By"
                          value={formData?.totalDiscPct}
                          onChange={(e) =>
                            handleInputChange("totalDiscPct", e.target.value)
                          }
                        />
                      </div>
                    </FormSection>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions - Clicking these now opens the Modal */}
            <div className="flex flex-wrap gap-1  p-1.5 ">
              <ActionDetailButton
                label="Default Accts"
                icon={FileSpreadsheet}
                isActive={activeModal.includes("Default Accts")}
                onClick={() =>
                  setActiveModal((prevArray) => ["Default Accts", ...prevArray])
                }
              />
              <ActionDetailButton
                label="Notes"
                icon={Layers}
                isActive={activeModal.includes("Notes")}
                onClick={() =>
                  setActiveModal((prevArray) => ["Notes", ...prevArray])
                }
              />
              <ActionDetailButton
                label="VAT InfoC"
                icon={Percent}
                isActive={activeModal.includes("VAT InfoC")}
                onClick={() =>
                  setActiveModal((prevArray) => ["VAT InfoC", ...prevArray])
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
                label="Customer Alias"
                icon={ClipboardList}
                isActive={activeModal.includes("Customer Alias")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "Customer Alias",
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
                      const isRequired = ["vendId", "acctName"].includes(col);

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
                        // onClick={() => {
                        //   setFormData(item);
                        // }}
                        className={`${
                          selectedRows.has(item.id || item.vendor?.vendId)
                            ? "bg-blue-50"
                            : ""
                        } hover:bg-gray-50 transition-colors cursor-pointer`}
                      >
                        <td className="text-center tbody-td ">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            className="h-3 w-3 accent-blue-600 cursor-pointer"
                            onChange={(e) => {
                              e.stopPropagation();
                              const uniqueId = String(item.vendor.vendId); // Ensure consistency with string IDs

                              setSelectedRows((prev) => {
                                // 1. Create a copy of the existing Set
                                const newSet = new Set(prev);

                                if (newSet.has(uniqueId)) {
                                  // --- UNSELECTING LOGIC ---
                                  newSet.delete(uniqueId);

                                  // Check if the row we are unchecking is the one currently displayed
                                  if (
                                    selectedRow &&
                                    String(
                                      selectedRow.vendId ||
                                        selectedRow.vendor.vendId,
                                    ) === uniqueId
                                  ) {
                                    if (newSet.size > 0) {
                                      // Get the remaining IDs as an array to find the "last added"
                                      const remainingIds = Array.from(newSet);
                                      const lastId =
                                        remainingIds[remainingIds.length - 1];

                                      // Find the full record in your master list
                                      const previousItem = vendorList.find(
                                        (v) =>
                                          String(v.vendor.vendId) === lastId,
                                      );

                                      // Update the active record to the previous selection
                                      setSelectedRow(
                                        previousItem.vendor || null,
                                      );

                                      // Sync index if necessary
                                      const newIdx = vendorList.findIndex(
                                        (v) =>
                                          String(v.vendor.vendId) === lastId,
                                      );
                                      if (newIdx !== -1)
                                        setCurrentIndex(newIdx);
                                    } else {
                                      // No items left selected, clear the active row
                                      setSelectedRow(null);
                                      setCurrentIndex(0);
                                    }
                                  }
                                } else {
                                  // --- SELECTING LOGIC ---
                                  newSet.add(uniqueId);

                                  // Update the active record to the newly selected item
                                  setSelectedRow(item.vendor);

                                  // Sync the index
                                  const newIdx = vendorList.findIndex(
                                    (v) => String(v.vendor.vendId) === uniqueId,
                                  );
                                  if (newIdx !== -1) setCurrentIndex(newIdx);
                                }

                                return newSet;
                              });
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
            {/* // )} */}
          </>
        )}
      </MainContainer>

      <AddressesC
        formData={formData}
        handleInputChange={handleInputChange}
        onClose={() => setActiveSubModal(null)}
        isFormView={true}
        isDirty={isDirty}
        loading={loading}
        actions={toolbarActions}
      />
      {/* Dynamic Sub-Form Modal */}
      {activeModal.includes("Default Accts") && (
        <DefaultsAccts
          // toolbarActions={toolbarActions}
          formData={formData}
          selectedRow={selectedRow}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Default Accts"),
            )
          }
        />
      )}
      {activeModal.includes("Notes") && (
        <Notes
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) => prev.filter((item) => item !== "Notes"))
          }
        />
      )}
      {activeModal.includes("VAT InfoC") && (
        <VATInfoC
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "VAT InfoC"),
            )
          }
        />
      )}
      {activeModal.includes("Customer Alias") && (
        <CustomerAlias
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Customer Alias"),
            )
          }
        />
      )}
      {activeModal.includes("User-Defined Info") && (
        <UserDefinedInfoC
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "User-Defined Info"),
            )
          }
        />
      )}
    </div>
  );
};

export default ManageCustomers;
