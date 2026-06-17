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
import { ReusableTable, TableSearchSelect } from "../helper/tableSection"; // Added for the sub-forms
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
import { toast } from "react-toastify";

// --- Sub-Form Modal Component ---

const ManageVendor = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const [isFormView, setIsFormView] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("Header");

  const [vendorList, setVendorList] = useState([]);

  const [searchValue, setSearchValue] = useState("");

  // Modal State
  const [activeModal, setActiveModal] = useState([]); // stores the label of the active sub-form
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTermApprvl, setSearchTermApprvl] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  const [allData, setAllData] = useState([]);

  const [clipboard, setClipboard] = useState([]);

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
          `${backendUrl}/api/vendor-transactions/GetAllVendors?page=1&pageSize=20000&sortBy=vend_id&sortOrder=asc`,
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
      apChkVendId: "",
      payVendName: "",
      payWhenPaidFl: "N",
      expProjId: "",
      apChkVendId: "",
      emplId: "",
      userId: `${user.name}`,
      entryDtt: formatDate(new Date()),
      edVchPayVendFl: "N",
      autoVchrFl: "N",
      modifiedBy: "",
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
      vendApprvlCd: "",
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
  };

  const COLUMN_LABELS = {
    vendId: "Vendor ID",
    vendName: "Vendor Name",
    vendNameExt: "Location",
    vendLongName: "Long Name",
    vendWebSite: "Vendor Website",
    prospectiveVendorId: "Prospective Vendor Id",
    sVendPoCntlCd: "Vendor Status",
    holdPmtFl: "Hold Payments",
    prVendFl: "Payroll Vendor",
    vendApprvlCd: "Vendor Approval",
    password: "Password",
    vendGrpCd: "Vendor Group",
    custAcctFld: "Customer Account",
    emplId: "Employee",
    dunsNo: "DUNS Number",
    ueiNo: "UEI Number",
    cageCd: "CAGE Code",
    prnt1099Fl: "Print 1099 Form",
    ap1099TaxId: "Tax ID",
    vend1099Name: "1099 Name",
    apChkVendId: "Pay Vendor",
    userId: "User",
    entryDtt: "Date",
    edVchPayVendFl: "Alow Edits to Pay Vendor on Voucher",
    termsDc: "Terms",
    payWhenPaidFl: "Pay When Paid",
    autoVchrFl: "Allow Auto-Vouchering for POs",
    digitalSigFl: "Enable Digital Signature",
    sepChkFl: "Separate Check",
    eprocureFl: "eProcurement Vendor",
    apAcctsKey: "A/P",
    cashAcctsKey: "Cash",
    chkMemoS: "Memo for Blank Laser Checks only",
    fobFld: "FOB",
    shipViaFld: "Ship Via",
    vendNotes: "Notes",
  };
  const [columns] = useState([
    "vendId",
    "vendName",
    "vendNameExt",
    "vendLongName",
    "vendWebSite",
    "prospectiveVendorId",
    "sVendPoCntlCd",
    "holdPmtFl",
    "prVendFl",
    "vendApprvlCd",
    "password",
    "vendGrpCd",
    "custAcctFld", //not jere
    "emplId",
    "dunsNo",
    "ueiNo",
    "cageCd", // not there
    "prnt1099Fl",
    "ap1099TaxId",
    "vend1099Name",
    "apChkVendId",
    "userId",
    "entryDtt",
    "edVchPayVendFl",
    "termsDc",
    "payWhenPaidFl",
    "autoVchrFl",
    "digitalSigFl",
    "sepChkFl",
    "eprocureFl",
    "apAcctsKey",
    "cashAcctsKey",
    "chkMemoS",
    "fobFld",
    "shipViaFld",
    "vendNotes",
  ]);

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
        const isTemporary = String(id).startsWith("TEMP_");

        if (isTemporary) {
          // --- LOCAL DELETE ---
          // Just filter it out of the local state
          setVendorList((prev) => prev.filter((item) => item.tempId !== id));
        } else {
          // --- SERVER DELETE ---
          // Call your API endpoint for the specific ID
          await api.delete(
            `${backendUrl}/api/vendor-transactions/${id}?companyId=1`,
          );
        }
      }

      toast.success("Selection deleted successfully.");

      // 2. Clear selection and refresh data
      setSelectedRows(new Set());
      setSelectedRow(null);
      fetchVendors(); // Get fresh list from server
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete some items.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    // Capture the ID of the currently active row before the update happens
    const previousId = selectedRow?.vendId;

    try {
      setLoading(true);
      const res = await api.get(
        `${backendUrl}/api/vendor-transactions?page=1&pageSize=999999999&sortBy=vend_id&sortOrder=asc`,
      );

      const data = res.data.data || [];
      setVendorList(data);
      setAllData(data);

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
      toast.error("Failed to refresh vendor list.");
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
    fetchVendors();
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
      isNew: true, // Flag for API (POST instead of PUT)
      isDirty: true, // Flag to enable the Save button
    };

    // 4. Update the States
    setIsDirty(true);
    setVendorList([newRow, ...vendorList]); // Add to the top of the list
    setSelectedRows(new Set([newId])); // Check the checkbox for this new row
    setSelectedRow(newRow.vendor); // Set as active data for the form view
    setCurrentIndex(0); // Focus the first position
  };
  const handleInputChange = (field, value, rowId) => {
    if (field === "vendGrpCd") {
      if (value.length > 6) {
        // Trigger the warning toast
        toast.warn("Vendor group code should not exceed 6 characters");
        return; // Stop execution so the 7th character isn't saved
      }
      // Optional: Force uppercase for group codes
      value = value.toUpperCase();
    }

    setIsDirty(true);
    setIsDirty(true);

    // 1. Update the Master List (The source of truth)
    setVendorList((prevList) =>
      prevList.map((item) => {
        const itemId = item.vendor?.tempId || item.vendor?.vendId;

        // DEBUG: Run this once to see the mismatch
        console.log(`Checking Item: ${itemId} against RowId: ${rowId}`);

        if (String(itemId) === String(rowId)) {
          console.log("MATCH FOUND - Updating list...");
          return {
            ...item,
            vendor: { ...item.vendor, [field]: value },
            isDirty: true,
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

      return { ...prev, [field]: value, isDirty: true };
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
        // 1. Prepare Payload (Vendor + Sub-modules)
        const payload = {
          vendor: { ...row.vendor },
          addresses: row.addresses || [],
          employees: row.employees || [],
        };

        // 2. Remove UI-only flags so the API receives clean data
        const { isNew, tempId, ...cleanVendorData } = payload.vendor;
        const finalPayload = { ...payload, vendor: cleanVendorData };

        // 3. Prioritized API Selection
        if (row.vendor?.isNew) {
          // CASE: If it's NEW (even if also Dirty), only call POST
          return api.post(
            `${backendUrl}/api/vendor-transactions/create-full`,
            finalPayload,
          );
        } else if (row.isDirty) {
          // CASE: Not new, but marked as Dirty, only call PUT

          return api.post(
            `${backendUrl}/api/vendor-transactions/create-full`,
            finalPayload,
          );
        }
      });

      await Promise.all(savePromises);

      toast.success("Changes saved successfully!");

      // Reset flags
      setIsDirty(false);
      // setIsFormDirty(false);

      // Refresh to get DB IDs and clear all local 'isNew'/'isDirty' states
      fetchVendors();
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
    { key: "vendNameExt", label: "Location" },
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
    { label: "Active", value: "A" },
    { label: "Give Warning", value: "W" },
    { label: "Inactive", value: "I" },
  ];

  const VendAppstatus = [
    { label: "Approve", value: "A" },
    { label: "Disapprove", value: "D" },
    { label: "Pending", value: "P" },
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
    // if (isFormDirty) {
    //   if (!window.confirm("You have unsaved changes. Discard them and move?")) {
    //     return;
    //   }
    // }

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

  const handleCopy = () => {
    // 1. Validation: Ensure something is selected
    const hasSelection = selectedRows.size > 0 || selectedRow;
    if (!hasSelection) {
      toast.warn("Select a record to copy first.");
      return;
    }

    setIsDirty(true);

    // 2. Determine which rows to copy from the vendorList
    const rowsToCopy =
      selectedRows.size > 0
        ? vendorList.filter((item) =>
            selectedRows.has(item.vendor?.vendId || item.vendor?.tempId),
          )
        : vendorList.filter(
            (item) =>
              (item.vendor?.vendId || item.vendor?.tempId) ===
              (selectedRow?.vendId || selectedRow?.tempId),
          );

    // 3. Define the columns to export (using your provided array)
    const columnsToExport = [
      "vendId",
      "vendName",
      "vendNameExt",
      "vendLongName",
      "vendWebSite",
      "prospectiveVendorId",
      "sVendPoCntlCd",
      "holdPmtFl",
      "prVendFl",
      "vendApprvlCd",
      "password",
      "vendGrpCd",
      "custAcctFld",
      "emplId",
      "dunsNo",
      "ueiNo",
      "cageCd",
      "prnt1099Fl",
      "ap1099TaxId",
      "vend1099Name",
      "apChkVendId",
      "userId",
      "entryDtt",
      "edVchPayVendFl",
      "termsDc",
      "payWhenPaidFl",
      "autoVchrFl",
      "digitalSigFl",
      "sepChkFl",
      "eprocureFl",
      "apAcctsKey",
      "cashAcctsKey",
      "chkMemoS",
      "fobFld",
      "shipViaFld",
      "vendNotes",
    ];

    // 4. Create Headers using COLUMN_LABELS
    const headerLine = columnsToExport
      .map((key) => COLUMN_LABELS[key] || key)
      .join("\t");

    // 5. Create Data Lines
    const dataLines = rowsToCopy
      .map((row) => {
        const v = row.vendor || {}; // Access the nested vendor object
        return columnsToExport
          .map((key) => {
            const value = v[key];
            // Handle Boolean/Flag fields specifically if needed
            if (value === "Y") return "Yes";
            if (value === "N") return "No";
            return value || "";
          })
          .join("\t");
      })
      .join("\n");

    const finalClipboardString = `${headerLine}\n${dataLines}`;

    // 6. Execute Copy to System and Local State
    navigator.clipboard
      .writeText(finalClipboardString)
      .then(() => {
        setClipboard(rowsToCopy);
        localStorage.setItem(
          "vendor_master_clipboard",
          JSON.stringify(rowsToCopy),
        );
        toast.success(
          `${rowsToCopy.length} vendor(s) copied with full details.`,
        );
      })
      .catch(() => toast.error("Failed to copy to clipboard."));
  };

  const handlePaste = () => {
    // 1. Retrieve from State or LocalStorage (using the Vendor key)
    const savedData =
      clipboard && clipboard.length > 0
        ? clipboard
        : JSON.parse(localStorage.getItem("vendor_master_clipboard"));

    if (!savedData) return toast.warn("Clipboard is empty.");

    const dataToPaste = Array.isArray(savedData) ? savedData : [savedData];
    const userSession = JSON.parse(localStorage.getItem("currentUser") || "{}");

    // 2. Map into new Vendor objects with all 36+ fields preserved
    const pastedRows = dataToPaste.map((row, index) => {
      const newTempId = `VEND_NEW_${Date.now()}_${index}`;

      return {
        ...row, // Preserve all nested vendor data (termsDc, apAcctsKey, etc.)
        vendor: {
          ...row.vendor,
          vendId: "", // Clear the ID so the user enters a new one
          tempId: newTempId, // Stable anchor for the InputChange logic
          isNew: true,
          isDirty: true,
          modifiedBy: userSession?.name || "system",
          entryDtt: formatDate(new Date()),
        },
      };
    });

    // 3. Filter out other unsaved "New" items from the vendorList
    const filterOutUnsaved = (prevList) =>
      prevList.filter((item) => !item.vendor?.isNew && !item.vendor?.tempId);

    // 4. Update the Master Vendor List
    setVendorList((prev) => [...pastedRows, ...filterOutUnsaved(prev)]);

    // 5. Focus the first pasted record
    if (pastedRows.length > 0) {
      const firstPasted = pastedRows[0];

      // Set the Ref anchor so handleInputChange knows which row to update
      originalIdRef.current = firstPasted.vendor.tempId;

      setSelectedRow(firstPasted.vendor); // Set form data
      setSelectedRows(new Set([firstPasted.vendor.tempId])); // Check the row in table
      setCurrentIndex(0); // Move navigator to top
      setIsDirty(true);
      setIsFormView(true); // Jump to form view to edit the pasted data
    }

    toast.success(`${pastedRows.length} vendor(s) pasted.`);
  };

  const handleDiscard = () => {
    const hasNewRecords = vendorList.some(
      (item) => item.vendorEmployee?.isNew || item.vendorEmployee?.tempId,
    );

    if (!isDirty && !hasNewRecords) {
      toast.info("No changes found.");
      return;
    }

    if (
      window.confirm("Discard all unsaved employee changes and new records?")
    ) {
      // 1. Remove rows that were never saved (isNew)
      setVendorList((prev) =>
        prev.filter(
          (item) => !item.vendorEmployee?.isNew && !item.vendorEmployee?.tempId,
        ),
      );

      setVendorList(allData);

      // 3. Reset UI States
      setSelectedRow(null);
      setIsDirty(false);

      // Clear Local Clipboard
      setClipboard(null);
      localStorage.removeItem("vendor_employee_clipboard");

      toast.info("Changes discarded.");
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in z-10 fade-in duration-500">
      <MainContainer title="Manage Vendors">
        <Toolbar
          isFormView={isFormView}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          totalRecords={vendorList.length}
          handleNavigate={handleNavigate}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          jumpToCode={jumpToCode}
          selectedRow={selectedRow}
          isDirty={isDirty}
          loading={loading}
          actions={{
            onAdd: handleAdd,
            onCopy: handleCopy,
            onPaste: handlePaste,
            onDelete: handleDelete,
            onSave: handleSaveAll,
            onClear: handleDiscard,
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
            <FormSection className="grid grid-cols-3 gap-2">
              <FormInput
                label="Vendor ID"
                value={selectedRow?.vendId || ""}
                onChange={(e) =>
                  handleInputChange(
                    "vendId",
                    e.target.value,
                    selectedRow?.tempId || selectedRow?.vendId, // Pass the ID
                  )
                }
                readOnly={!selectedRow?.isNew}
              />
              <FormInput
                label="Name"
                required
                value={selectedRow?.vendName || ""}
                onChange={(e) =>
                  handleInputChange(
                    "vendName",
                    e.target.value,
                    selectedRow?.tempId || selectedRow?.vendId, // Pass the ID
                  )
                }
              />
              <FormInput
                label="Location"
                value={selectedRow?.vendNameExt || ""}
                onChange={(e) =>
                  handleInputChange(
                    "vendNameExt",
                    e.target.value,
                    selectedRow?.tempId || selectedRow?.vendId, // Pass the ID
                  )
                }
              />

              <FormInput
                label="Prospective Vendor ID"
                value={selectedRow?.prospectiveVendorId}
                readOnly
                className="bg-gray-100"
              />
            </FormSection>

            <div className="">
              {/* <div className="flex gap-4 px-4 text-[11px] font-bold text-gray-500 mb-1">
              <span className="text-[#17414d] border-b-2 border-[#17414d] pb-0.5 cursor-pointer">
                Header
              </span>
              <span className="hover:text-[#17414d] cursor-pointer">
                Defaults
              </span>
              <span className="hover:text-[#17414d] cursor-pointer">Notes</span>
            </div> */}
              {/* Tab Navigation */}
              <div className="flex gap-4 px-4 text-[11px] font-bold text-gray-500 mb-1">
                {["Header", "Defaults", "Notes"].map((tab) => (
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

              {currentTab === "Header" && (
                <FormSection className="grid grid-cols-12 gap-4">
                  {/* Column 1 */}
                  <div className="col-span-5 space-y-1">
                    <FormInput
                      label="Long Name"
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
                    <FormInput
                      label="Vendor Web Site"
                      value={selectedRow?.vendWebSite}
                      onChange={(e) =>
                        handleInputChange(
                          "vendWebSite",
                          e.target.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        )
                      }
                    />
                    <div className="flex gap-4 mt-2">
                      <FormSection title="Vendor Status">
                        {statusMapping.map((status) => (
                          <FormInput
                            key={status.value}
                            type="radio"
                            label={status.label}
                            value={status.value}
                            checked={
                              selectedRow?.sVendPoCntlCd === status.value
                            }
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
                      <div className="flex-1 space-y-1 pt-4">
                        <FormInput
                          type="checkbox"
                          label="Hold Payments"
                          checked={selectedRow?.holdPmtFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "holdPmtFl",
                              e.target.checked ? "Y" : "N",
                              selectedRow?.tempId || selectedRow?.vendId, // Pass the ID
                            )
                          }
                        />
                        <FormInput
                          type="checkbox"
                          label="Payroll Vendor"
                          checked={selectedRow?.prVendFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "prVendFl",

                              e.target.checked ? "Y" : "N",
                              selectedRow?.tempId || selectedRow?.vendId,
                            )
                          }
                        />
                      </div>
                    </div>
                    <FormSearchSelect
                      label="Vendor Approval"
                      /* Filter the options based on the search term (searchTermApprvl) */
                      options={VendAppstatus.filter((opt) =>
                        opt.label
                          .toLowerCase()
                          .includes((searchTermApprvl || "").toLowerCase()),
                      )}
                      /* Display the human-readable label in the dropdown list */
                      displayKey="label"
                      /* Find the current selected object based on the character code in formData */
                      value={
                        selectedRow?.vendApprvlCd === "A"
                          ? "Approve"
                          : selectedRow?.vendApprvlCd === "P"
                            ? "Pending"
                            : selectedRow?.vendApprvlCd === "D"
                              ? "Disapprove"
                              : ""
                      }
                      /* On selection, update the character code (e.g., 'A') in the vendor object */
                      onSelect={(opt) => {
                        handleInputChange(
                          "vendApprvlCd",
                          opt.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        );
                      }}
                      className="bg-gray-100 font-bold text-center"
                    />
                    <FormInput
                      label="Password"
                      type="password"
                      value={selectedRow?.password}
                      onChange={(e) =>
                        handleInputChange(
                          "password",
                          e.target.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        )
                      }
                      // readOnly
                      className="bg-gray-100 font-bold text-center"
                    />
                  </div>

                  {/* Column 2 */}
                  <div className="col-span-4 space-y-1">
                    <FormInput
                      label="Vendor Group"
                      value={selectedRow?.vendGrpCd}
                      onChange={(e) =>
                        handleInputChange(
                          "vendGrpCd",
                          e.target.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        )
                      }
                    />
                    <FormSearchSelect
                      label="Customer Account"
                      options={[]}
                      onSelect={() => {}}
                      displayKey="name"
                    />
                    <FormSearchSelect
                      label="Employee"
                      value={selectedRow?.emplId || ""}
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      options={dropdownData?.employees}
                      displayKey="empId"
                      secondaryKey="empName"
                      onSelect={(opt) =>
                        handleInputChange(
                          "emplId",
                          opt.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        )
                      }
                    />
                    <FormInput
                      label="DUNS Number"
                      value={selectedRow?.dunsNo}
                      onChange={(e) =>
                        handleInputChange(
                          "dunsNo",
                          e.target.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        )
                      }
                    />
                    <FormInput
                      label="UEI Number"
                      value={selectedRow?.ueiNo}
                      onChange={(e) =>
                        handleInputChange(
                          "ueiNo",
                          e.target.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        )
                      }
                    />
                    <FormInput
                      label="CAGE Code"
                      value={selectedRow?.cageCd}
                      onChange={(e) =>
                        handleInputChange(
                          "cageCd",
                          e.target.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        )
                      }
                    />
                  </div>

                  {/* Column 3 */}
                  <div className="col-span-3 space-y-3">
                    <FormSection title="1099's">
                      <FormInput
                        type="checkbox"
                        label="Print 1099 Form"
                        checked={selectedRow?.prnt1099Fl === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "prnt1099Fl",
                            e.target.checked ? "Y" : "N",
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormInput
                        label="Tax ID"
                        value={selectedRow?.ap1099TaxId}
                        onChange={(e) =>
                          handleInputChange(
                            "ap1099TaxId",
                            e.target.value,
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormInput
                        label="1099 Name"
                        value={selectedRow?.vend1099Name}
                        onChange={(e) =>
                          handleInputChange(
                            "vend1099Name",
                            e.target.value,
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormSearchSelect
                        label="Pay Vendor"
                        value={selectedRow?.apChkVendId}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        options={dropdownData?.vendors}
                        displayKey="vendId"
                        secondaryKey="vendName"
                        onSelect={(opt) => {
                          handleInputChange(
                            "apChkVendId",
                            opt.vendId,
                            selectedRow?.tempId || selectedRow?.vendId,
                          );
                          handleInputChange(
                            "payVendName",
                            opt.vendName,
                            selectedRow?.tempId || selectedRow?.vendId,
                          );
                        }}
                      />
                    </FormSection>
                    <FormSection title="Entry">
                      <FormInput
                        label="User"
                        value={selectedRow?.userId}
                        readOnly
                        className="bg-gray-100"
                      />
                      <FormInput
                        label="Date"
                        value={selectedRow?.entryDtt}
                        readOnly
                        className="bg-gray-100"
                      />
                    </FormSection>
                  </div>
                </FormSection>
              )}

              {currentTab === "Defaults" && (
                <FormSection>
                  <div className="grid grid-cols-12 gap-4 py-2 animate-in fade-in duration-300">
                    {/* Left Column: Payment & Terms */}
                    <div className="col-span-5 space-y-1">
                      <div className="flex gap-2 items-center">
                        <FormSearchSelect
                          label="Pay Vendor"
                          value={selectedRow?.apChkVendId}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          options={dropdownData?.vendors}
                          displayKey="vendId"
                          secondaryKey="vendName"
                          onSelect={(opt) => {
                            handleInputChange(
                              "apChkVendId",
                              opt.vendId,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                            handleInputChange(
                              "payVendName",
                              opt.vendName,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                          }}
                        />
                        <FormInput
                          value={selectedRow?.payVendName || ""}
                          readOnly
                        />
                        {/* <div className="h-6 w-32 bg-gray-100 border border-gray-300 rounded" /> */}
                      </div>

                      <FormSearchSelect
                        label="Terms"
                        value={selectedRow?.termsDc || ""}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        options={dropdownData?.terms}
                        displayKey="termsDc"
                        onSelect={(opt) =>
                          handleInputChange(
                            "termsDc",
                            opt.termsDc,
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormInput
                        type="checkbox"
                        checked={selectedRow?.edVchPayVendFl === "Y"}
                        label="Allow Edits to Pay Vendor on Voucher"
                        onChange={(e) =>
                          handleInputChange(
                            "edVchPayVendFl",
                            e.target.checked ? "Y" : "N",
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormInput
                        type="checkbox"
                        checked={selectedRow?.payWhenPaidFl === "Y"}
                        label="Pay When Paid"
                        onChange={(e) =>
                          handleInputChange(
                            "payWhenPaidFl",
                            e.target.checked ? "Y" : "N",
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormInput
                        type="checkbox"
                        checked={selectedRow?.autoVchrFl === "Y"}
                        label="Allow Auto-Vouchering for POs"
                        onChange={(e) =>
                          handleInputChange(
                            "autoVchrFl",
                            e.target.checked ? "Y" : "N",
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormInput
                        type="checkbox"
                        checked={selectedRow?.digitalSigFl === "Y"}
                        label="Enable Digital Signature"
                        onChange={(e) =>
                          handleInputChange(
                            "digitalSigFl",
                            e.target.checked ? "Y" : "N",
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      {/* <div className="flex gap-10 ml-[94px] border w-full"> */}
                      <FormInput
                        type="checkbox"
                        label="Separate Check"
                        checked={selectedRow?.sepChkFl === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "sepChkFl",
                            e.target.checked ? "Y" : "N",
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      <FormInput
                        type="checkbox"
                        label="eProcurement Vendor"
                        checked={selectedRow?.eprocureFl === "Y"}
                        onChange={(e) =>
                          handleInputChange(
                            "eprocureFl",
                            e.target.checked ? "Y" : "N",
                            selectedRow?.tempId || selectedRow?.vendId,
                          )
                        }
                      />
                      {/* </div> */}
                    </div>

                    {/* Middle Column: Accounts Description */}
                    <div className="col-span-4">
                      <FormSection
                        title="Accounts Description"
                        className="space-y-1"
                      >
                        <FormSearchSelect
                          label="A/P"
                          value={selectedRow?.apAcctsKey}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          options={dropdownData?.apAccounts}
                          displayKey="apId"
                          onSelect={(opt) => {
                            handleInputChange(
                              "apAcctsKey",
                              opt.apId,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                          }}
                        />
                        <FormSearchSelect
                          label="Cash"
                          value={selectedRow?.cashAcctsKey}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          options={dropdownData?.cashAccounts}
                          displayKey="cashId"
                          onSelect={(opt) => {
                            handleInputChange(
                              "cashAcctsKey",
                              opt.cashId,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                          }}
                        />
                      </FormSection>
                      <div className="pt-4">
                        <FormInput
                          label="Memo for Blank Laser Checks Only"
                          value={selectedRow?.chkMemoS}
                          onChange={(e) =>
                            handleInputChange(
                              "chkMemoS",
                              e.target.value,
                              selectedRow?.tempId || selectedRow?.vendId,
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Right Column: Shipping */}
                    <div className="col-span-3">
                      <FormSection title="Shipping" className="space-y-1">
                        <FormInput
                          label="FOB"
                          value={selectedRow?.fobFld}
                          onChange={(e) =>
                            handleInputChange(
                              "fobFld",
                              e.target.value,
                              selectedRow?.tempId || selectedRow?.vendId,
                            )
                          }
                        />
                        <FormInput
                          label="Ship Via"
                          value={selectedRow?.shipViaFld}
                          onChange={(e) =>
                            handleInputChange(
                              "shipViaFld",
                              e.target.value,
                              selectedRow?.tempId || selectedRow?.vendId,
                            )
                          }
                          // disabled
                        />
                      </FormSection>
                    </div>
                  </div>
                </FormSection>
              )}

              {/* Tab Content: Notes */}
              {currentTab === "Notes" && (
                // <div className="relative border border-gray-300 rounded-lg p-4 min-h-[200px] bg-white animate-in fade-in duration-300">
                <FormSection>
                  <div className="relative border border-gray-300 rounded-lg p-4 min-h-[200px] bg-white animate-in fade-in duration-300">
                    <textarea
                      className="w-full h-40 outline-none text-xs resize-none"
                      // placeholder="Enter vendor notes here..."
                      value={selectedRow?.vendNotes}
                      onChange={(e) =>
                        handleInputChange(
                          "vendNotes",
                          e.target.value,
                          selectedRow?.tempId || selectedRow?.vendId,
                        )
                      }
                    />
                    <div className="absolute top-2 right-2 text-gray-400">
                      <Edit3 size={16} />
                    </div>
                  </div>
                </FormSection>
                // </div>
              )}
            </div>

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
                label="Vendor Classification"
                icon={Layers}
                isActive={activeModal.includes("Vendor Classification")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "Vendor Classification",
                    ...prevArray,
                  ])
                }
              />
              <ActionDetailButton
                label="Vendor Certifications"
                icon={ShieldCheck}
                isActive={activeModal.includes("Vendor Certifications")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "Vendor Certifications",
                    ...prevArray,
                  ])
                }
              />
              <ActionDetailButton
                label="Subcontractor Info"
                icon={Briefcase}
                isActive={activeModal.includes("Subcontractor Info")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "Subcontractor Info",
                    ...prevArray,
                  ])
                }
              />
              <ActionDetailButton
                label="Credit Card Info"
                icon={CreditCard}
                isActive={activeModal.includes("Credit Card Info")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "Credit Card Info",
                    ...prevArray,
                  ])
                }
              />
              <ActionDetailButton
                label="Addresses"
                icon={MapPin}
                isActive={activeModal.includes("Addresses")}
                onClick={() =>
                  setActiveModal((prevArray) => ["Addresses", ...prevArray])
                }
              />
              <ActionDetailButton
                label="Default Expense Accounts"
                icon={FileSpreadsheet}
                isActive={activeModal.includes("Default Expense Accounts")}
                onClick={() =>
                  setActiveModal((prevArray) => [
                    "Default Expense Accounts",
                    ...prevArray,
                  ])
                }
              />
              <ActionDetailButton
                label="VAT Info"
                icon={Percent}
                isActive={activeModal.includes("VAT Info")}
                onClick={() =>
                  setActiveModal((prevArray) => ["VAT Info", ...prevArray])
                }
              />
              <ActionDetailButton
                label="CIS Info"
                icon={ClipboardList}
                isActive={activeModal.includes("CIS Info")}
                onClick={() =>
                  setActiveModal((prevArray) => ["CIS Info", ...prevArray])
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
            <div className={`overflow-x-auto max-h-[35vh]`}>
              <table className="min-w-full text-sm border border-gray-300 rounded">
                <thead className="bg-gray-200 sticky top-0 z-10 ">
                  <tr>
                    {/* {canEdit("manageAccount") && ( */}
                    <th className="th-thead w-10">
                      {/* <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                      /> */}
                    </th>
                    {/* )} */}
                    {columns.map((col) => {
                      // List of columns that should have a "Check All" header

                      const isRequired = [
                        "vendId",
                        "vendName",
                        "vendLongName",
                        "termsDc",
                        "apAcctsKey",
                        "cashAcctsKey",
                      ].includes(col);

                      return (
                        <th key={col} className="th-thead">
                          {/* <div className="flex items-center justify-center "> */}
                          <div className="flex items-center justify-center">
                            <span>{COLUMN_LABELS[col] || col}</span>
                            <span className="text-red-500">
                              {isRequired ? "*" : ""}
                            </span>
                          </div>
                          {/* </div> */}
                        </th>
                      );
                    })}
                    {/* <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Action
                    </th> */}
                  </tr>
                </thead>
                <tbody className="tbody">
                  {vendorList.map((item) => (
                    <tr
                      key={item.vendor.tempId || item.vendor.vendId}
                      // Add an onClick to the row itself for a better UX
                      onClick={() => setSelectedRow(item.vendor)}
                      className={`${
                        selectedRows.has(item.vendor.id || item.vendor.vendId)
                          ? "bg-blue-50"
                          : ""
                      } hover:bg-gray-50 transition-colors cursor-pointer`}
                    >
                      <td className="text-center tbody-td ">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(
                            item.vendor.tempId || item.vendor.vendId,
                          )}
                          className="h-3 w-3 accent-blue-600 cursor-pointer"
                          onChange={(e) => {
                            e.stopPropagation(); // Prevent row onClick from firing twice
                            const uniqueKey =
                              item.vendor.tempId || item.vendor.vendId;
                            const newSet = new Set(selectedRows);
                            if (newSet.has(uniqueKey)) {
                              newSet.delete(uniqueKey);
                              setSelectedRow(null);
                            } else {
                              newSet.add(uniqueKey);
                              setSelectedRow(item.vendor);
                            }
                            setSelectedRows(newSet);
                          }}
                        />
                      </td>

                      <td className="tbody-td">
                        <input
                          className={`td-input ${item.vendor?.isNew ? "bg-white " : "bg-gray-50 "} min-w-[100px]`}
                          // Show displayId for new rows so it starts empty; show acctId for existing rows
                          value={
                            item.vendor?.isNew
                              ? item.vendor?.vendId
                              : item.vendor?.vendId || ""
                          }
                          readOnly={!item.vendor?.isNew}
                          onChange={(e) =>
                            handleInputChange(
                              "vendId",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          placeholder={item.vendor?.isNew ? "Enter ID..." : ""}
                        />
                      </td>

                      <td className="tbody-td">
                        <input
                          className={`td-input min-w-[100px]`}
                          // Show displayId for new rows so it starts empty; show acctId for existing rows
                          value={item.vendor?.vendName}
                          onChange={(e) =>
                            handleInputChange(
                              "vendName",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder={item.vendor?.isNew ? "Enter ID..." : ""}
                        />
                      </td>

                      {/* Location Column */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[120px]"
                          value={item.vendor?.vendNameExt || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vendNameExt",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="Location"
                        />
                      </td>

                      {/* Long Name Column */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[180px]"
                          value={item.vendor?.vendLongName || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vendLongName",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="Enter Long Name..."
                        />
                      </td>

                      {/* Website Column */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[150px] text-blue-600 underline"
                          value={item.vendor?.vendWebSite || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vendWebSite",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="www.website.com"
                        />
                      </td>

                      {/* Prospective Vendor ID (Read Only) */}
                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-50 text-gray-500 cursor-not-allowed min-w-[130px]"
                          value={item.vendor?.prospectiveVendorId || ""}
                          readOnly
                          // placeholder="N/A"
                        />
                      </td>

                      <td className="tbody-td">
                        <select
                          className="td-input min-w-[100px]"
                          value={item.vendor?.sVendPoCntlCd || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "sVendPoCntlCd",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        >
                          {statusMapping.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          checked={item.vendor?.holdPmtFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "holdPmtFl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      {/* Payroll Vendor Checkbox */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          checked={item.vendor?.prVendFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "prVendFl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      {/* Vendor Approval (Search Select equivalent) */}
                      <td className="tbody-td">
                        <select
                          className="td-input min-w-[120px] font-semibold"
                          value={item.vendor?.vendApprvlCd || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vendApprvlCd",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        >
                          <option value="P">Pending</option>
                          <option value="A">Approve</option>
                          <option value="D">Disapprove</option>
                        </select>
                      </td>

                      {/* Password (Read-Only) */}
                      <td className="tbody-td">
                        <input
                          type="password"
                          className="td-input bg-gray-50 text-center min-w-[100px]"
                          value={item.vendor?.password || ""}
                          // readOnly
                        />
                      </td>

                      {/* --- Vendor Info Columns --- */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[120px]"
                          value={item.vendor?.vendGrpCd || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vendGrpCd",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="Group Code"
                        />
                      </td>

                      {/* --- Vendor Info Columns --- */}
                      <td className="tbody-td">
                        <TableSearchSelect
                          options={[]}
                          displayKey="label"
                          secondaryKey="value"
                          value={item.vendor?.custAcctFld || ""}
                          onSelect={(val) => {
                            handleInputChange(
                              "custAcctFld",
                              item.temId || item.vendId,
                              val.value,
                            );
                          }}
                        />
                      </td>
                      {/* --- Vendor Info Columns --- */}
                      <td className="tbody-td">
                        <TableSearchSelect
                          options={[]}
                          displayKey="empId"
                          secondaryKey="emplName"
                          value={item.vendor?.emplId || ""}
                          onSelect={(val) => {
                            handleInputChange(
                              "emplId",
                              item.temId || item.vendId,
                              val.value,
                            );
                          }}
                        />
                      </td>

                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[140px]"
                          value={item.vendor?.dunsNo || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "dunsNo",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="DUNS Number"
                        />
                      </td>

                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[150px]"
                          value={item.vendor?.ueiNo || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "ueiNo",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="UEI Number"
                        />
                      </td>

                      {/* CAGE Code Column */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[100px] uppercase"
                          value={item.vendor?.cageCd || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "cageCd",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="CAGE"
                          maxLength={5} // Standard CAGE codes are 5 characters
                        />
                      </td>

                      {/* --- 1099 Section --- */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          checked={item.vendor?.prnt1099Fl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "prnt1099Fl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[130px]"
                          value={item.vendor?.ap1099TaxId || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "ap1099TaxId",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="Tax ID"
                        />
                      </td>

                      {/* 1099 Name Column */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[200px]"
                          value={item.vendor?.vend1099Name || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vend1099Name",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="Legal 1099 Name"
                        />
                      </td>

                      <td className="tbody-td">
                        <TableSearchSelect
                          options={dropdownData?.vendors}
                          displayKey="vendId"
                          secondaryKey="vendName"
                          value={item.vendor?.apChkVendId}
                          onSelect={(val) => {
                            handleInputChange(
                              "apChkVendId",
                              val.vendId,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                            handleInputChange(
                              "payVendName",
                              val.vendName,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                          }}
                        />
                      </td>

                      {/* --- Read-Only Entry Info --- */}
                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-50 text-gray-500 min-w-[100px]"
                          value={item.vendor?.userId || ""}
                          readOnly
                        />
                      </td>

                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-50 text-gray-500 min-w-[140px]"
                          value={item.vendor?.entryDtt || ""}
                          readOnly
                        />
                      </td>

                      {/* Allow Edits to Pay Vendor Column */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          checked={item.vendor?.edVchPayVendFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "edVchPayVendFl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      <td className="tbody-td">
                        <TableSearchSelect
                          options={dropdownData?.termsDc}
                          displayKey="termsDc"
                          value={item.vendor?.termsDc}
                          onSelect={(val) => {
                            handleInputChange(
                              "termsDc",
                              val.termDc,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                          }}
                        />
                      </td>

                      {/* Pay When Paid */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          title="Pay When Paid"
                          checked={item.vendor?.payWhenPaidFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "payWhenPaidFl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      {/* Auto-Vouchering */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          title="Allow Auto-Vouchering for POs"
                          checked={item.vendor?.autoVchrFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "autoVchrFl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      {/* Digital Signature */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          title="Enable Digital Signature"
                          checked={item.vendor?.digitalSigFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "digitalSigFl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      {/* Separate Check */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          title="Separate Check"
                          checked={item.vendor?.sepChkFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "sepChkFl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      {/* eProcurement Vendor */}
                      <td className="tbody-td text-center">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          title="eProcurement Vendor"
                          checked={item.vendor?.eprocureFl === "Y"}
                          onChange={(e) =>
                            handleInputChange(
                              "eprocureFl",
                              e.target.checked ? "Y" : "N",
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                        />
                      </td>

                      <td className="tbody-td">
                        <TableSearchSelect
                          options={dropdownData?.apAccounts}
                          displayKey="apId"
                          value={item.vendor?.apAcctsKey}
                          onSelect={(val) => {
                            handleInputChange(
                              "apAcctsKey",
                              val.apId,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                          }}
                        />
                      </td>

                      <td className="tbody-td">
                        <TableSearchSelect
                          options={dropdownData?.cashAccounts}
                          displayKey="cashId"
                          value={item.vendor?.cashAcctsKey}
                          onSelect={(val) => {
                            handleInputChange(
                              "cashAcctsKey",
                              val.cashId,
                              selectedRow?.tempId || selectedRow?.vendId,
                            );
                          }}
                        />
                      </td>

                      {/* Check Memo Column */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[250px]"
                          value={item.vendor?.chkMemoS || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "chkMemoS",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="Memo for Laser Checks..."
                        />
                      </td>

                      {/* FOB Column */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[100px]"
                          value={item.vendor?.fobFld || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "fobFld",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="FOB"
                        />
                      </td>

                      {/* Ship Via Column (Disabled as per your form logic) */}
                      <td className="tbody-td">
                        <input
                          className="td-input bg-gray-50 text-gray-500 cursor-not-allowed min-w-[120px]"
                          value={item.vendor?.shipViaFld || ""}
                          // readOnly
                          // disabled
                          // placeholder="Ship Via"
                        />
                      </td>

                      {/* Vendor Notes Column */}
                      <td className="tbody-td">
                        <input
                          className="td-input min-w-[300px] italic text-gray-600"
                          value={item.vendor?.vendNotes || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "vendNotes",
                              e.target.value,
                              item.vendor?.tempId || item.vendor?.vendId,
                            )
                          }
                          // placeholder="No notes entered..."
                          title={item.vendor?.vendNotes} // Shows full note on hover
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* // )} */}
          </>
        )}
      </MainContainer>
      {/* Dynamic Sub-Form Modal */}
      {activeModal.includes("VendorEmployee") && (
        <VendorEmployeeDetail
          // toolbarActions={toolbarActions}
          formData={formData}
          selectedRow={selectedRow}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "VendorEmployee"),
            )
          }
        />
      )}
      {activeModal.includes("Vendor Classification") && (
        <VendorClassification
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Vendor Classification"),
            )
          }
        />
      )}
      {activeModal.includes("Addresses") && (
        <Addresses
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Addresses"),
            )
          }
        />
      )}
      {activeModal.includes("VAT Info") && (
        <VATInfo
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) => prev.filter((item) => item !== "VAT Info"))
          }
        />
      )}
      {activeModal.includes("CIS Info") && (
        <CISInfo
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) => prev.filter((item) => item !== "CIS Info"))
          }
        />
      )}
      {activeModal.includes("Credit Card Info") && (
        <CreditCardInfo
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Credit Card Info"),
            )
          }
        />
      )}
      {activeModal.includes("Vendor Certifications") && (
        <VendorCertifications
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Vendor Certifications"),
            )
          }
        />
      )}
      {activeModal.includes("Subcontractor Info") && (
        <SubContractorInfo
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Subcontractor Info"),
            )
          }
        />
      )}
      {activeModal.includes("Default Expense Accounts") && (
        <DefaultExpenseAccounts
          // toolbarActions={toolbarActions}
          formData={formData}
          handleInputChange={handleInputChange}
          onClose={() =>
            setActiveModal((prev) =>
              prev.filter((item) => item !== "Default Expense Accounts"),
            )
          }
        />
      )}
      {activeModal.includes("User-Defined Info") && (
        <UserDefinedInfo
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

export default ManageVendor;
