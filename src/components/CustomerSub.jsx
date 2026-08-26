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

export const CustomerAlias = ({ formData, onClose, isFormView, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  // Safely access custId from the parent formData
  const custId = formData?.customer?.custId;

  const initialCustAliasState = {
    custId: custId || "",
    custAliasKey: 0,
    companyId: companyId,
    custAliasName: "",
  };

  const [custAliasInformations, setCustAliasInformations] = useState(
    initialCustAliasState,
  );

  const fetchCustAlias = async () => {
    if (!custId) return;
    try {
      // Removed the extra single quote from the URL
      const response = await axios.get(`${backendUrl}/api/CustAlias/${custId}`);

      if (response.data) {
        const data = {
          ...response.data,
          // Handle potential date formatting if your API returns them
          startDate: response.data.startDate?.split("T")[0] || "",
          expiryDate: response.data.expiryDate?.split("T")[0] || "",
        };
        setCustAliasInformations(data);
        setOriginalData(data); // CRITICAL: Store original for the 'Clear' revert logic
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error fetching Alias mapping:", error);
    }
  };

  useEffect(() => {
    fetchCustAlias();
  }, [custId]);

  const handleCustAliasChange = (field, value) => {
    setCustAliasInformations((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleClear = () => {
    if (!isDirty && !clipboard) {
      toast.info("No changes to clear.");
      return;
    }

    if (window.confirm("Discard all unsaved changes?")) {
      if (originalData) {
        setCustAliasInformations(originalData);
      } else {
        setCustAliasInformations(initialCustAliasState);
      }
      setIsDirty(false);
      setClipboard(null);
      toast.info("Changes discarded.");
    }
  };

  const handleSave = async () => {
    if (!custId) {
      toast.error("No Customer ID associated.");
      return;
    }

    if (!custAliasInformations.custAliasName?.trim()) {
      toast.error("Please enter Customer Alias Name");
      return;
    }

    const payload = {
      custId: custId,
      companyId: companyId,
      modifiedBy: user.name || "System",
      custAliasKey: custAliasInformations.custAliasKey,
      custAliasName: custAliasInformations.custAliasName,
    };

    try {
      // Logic: If key > 0, it's an update.
      const isUpdate = custAliasInformations.custAliasKey > 0;
      const url = isUpdate
        ? `${backendUrl}/api/CustAlias/${custAliasInformations.custAliasKey}`
        : `${backendUrl}/api/CustAlias`;

      const response = isUpdate
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Alias saved successfully!");
        fetchCustAlias(); // Refresh to get the new key and update originalData
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving Alias information.");
    }
  };

  const handleAdd = () => {
    setCustAliasInformations({ ...initialCustAliasState, custId: custId });
    setIsDirty(true);
    toast.info("New Alias record initialized.");
  };

  const handleDelete = async () => {
    // FIX: Use the Alias Key for deletion, not the Vendor ID
    const aliasKey = custAliasInformations.custAliasKey;

    if (!aliasKey || aliasKey === 0) {
      setCustAliasInformations(initialCustAliasState);
      setIsDirty(false);
      toast.info("New record cleared.");
      return;
    }

    if (
      window.confirm("Are you sure you want to permanently delete this Alias?")
    ) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/CustAlias/${aliasKey}`,
        );

        if (response.status === 200 || response.status === 204) {
          setCustAliasInformations(initialCustAliasState);
          setOriginalData(null);
          setIsDirty(false);
          toast.success("Alias deleted successfully.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete record.");
      }
    }
  };

  const handleCopy = () => {
    setClipboard({ ...custAliasInformations });
    toast.success("Alias copied to internal clipboard.");
  };

  const handlePaste = () => {
    if (clipboard) {
      // Don't paste the key, otherwise you'll overwrite an existing record accidentally
      const { custAliasKey, ...pastedData } = clipboard;
      setCustAliasInformations((prev) => ({
        ...prev,
        ...pastedData,
      }));
      setIsDirty(true);
      toast.success("Alias info pasted.");
    } else {
      toast.error("Clipboard is empty.");
    }
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onSave: handleSave,
    onClear: handleClear,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Customer Alias" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />

        <div className="p-2 space-y-4">
          <FormSection>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Customer Name Alias"
                value={custAliasInformations.custAliasName || ""}
                onChange={(e) =>
                  handleCustAliasChange("custAliasName", e.target.value)
                }
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const VATInfoC = ({ formData, onClose, isFormView, loading }) => {
  // 1. Initial State & Logic Helpers
  const custId = formData?.customer?.custId || formData?.vendor?.custId;
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  // Mapped to match the JSON schema provided
  const initialVATState = {
    custId: custId || "",
    taxId: "",
    taxLocCd: "",
    dfltTaxIdFl: "N",
    companyId: companyId,
  };

  const [vatInformation, setVatInformation] = useState(initialVATState);

  // 2. Data Fetching
  const fetchVATMapping = async () => {
    // API requires custId and taxId. If taxId isn't known yet, we can't fetch a specific record.
    if (!custId || !vatInformation.taxId) return;
    try {
      const response = await axios.get(
        `${backendUrl}/api/CustVatInfo/${custId}/${vatInformation.taxId}/${companyId}`,
      );
      if (response.data) {
        setVatInformation(response.data);
        setOriginalData(response.data);
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Error fetching VAT info:", error);
    }
  };

  useEffect(() => {
    if (vatInformation.taxId) {
      fetchVATMapping();
    }
  }, [custId]);

  // 3. Handlers
  const handleVATChange = (field, value) => {
    setVatInformation((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!custId) {
      toast.error("No Customer/Vendor ID associated.");
      return;
    }

    const payload = {
      ...vatInformation,
      custId: custId,
      modifiedBy: user.name || "System",
      companyId: companyId,
    };

    try {
      // Use originalData to determine if we are updating an existing record
      const isUpdate = !!originalData;
      const url = isUpdate
        ? `${backendUrl}/api/CustVatInfo/${custId}/${vatInformation.taxId}/${companyId}`
        : `${backendUrl}/api/CustVatInfo`;

      const response = isUpdate
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("VAT Information saved successfully!");
        setOriginalData(payload);
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving VAT information.");
    }
  };

  const handleClear = () => {
    if (!isDirty && !clipboard) {
      toast.info("No changes to clear.");
      return;
    }

    if (window.confirm("Discard all unsaved changes?")) {
      setVatInformation(originalData || initialVATState);
      setIsDirty(false);
      setClipboard(null);
      toast.info("Changes discarded.");
    }
  };

  const handleAdd = () => {
    setVatInformation({ ...initialVATState, custId: custId });
    setOriginalData(null);
    setIsDirty(true);
    toast.info("New VAT record initialized.");
  };

  const handleDelete = async () => {
    if (!custId || !vatInformation.taxId) {
      toast.error("Select a record to delete.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this VAT record?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/CustVatInfo/${custId}/${vatInformation.taxId}/${companyId}`,
        );
        if (response.status === 200 || response.status === 204) {
          setVatInformation(initialVATState);
          setOriginalData(null);
          setIsDirty(false);
          toast.success("VAT Record deleted.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete record.");
      }
    }
  };

  const handleCopy = () => {
    setClipboard({ ...vatInformation });
    toast.success("VAT Info copied.");
  };

  const handlePaste = () => {
    if (clipboard) {
      // Paste data but keep the current custId
      setVatInformation({ ...clipboard, custId: custId });
      setIsDirty(true);
      toast.success("VAT Info pasted.");
    } else {
      toast.error("Clipboard is empty.");
    }
  };

  const toolbarActions = {
    onAdd: handleAdd,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onSave: handleSave,
    onClear: handleClear,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Customer VAT Info" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="p-2 space-y-4">
          <FormSection title="Tax Details">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <FormInput
                label="Tax ID"
                value={vatInformation.taxId || ""}
                onChange={(e) => handleVATChange("taxId", e.target.value)}
                disabled={!!originalData} // TaxId is often part of the key; disabling on update prevents key mismatch
              />
              <FormInput
                label="Tax Location"
                value={vatInformation.taxLocCd || ""}
                onChange={(e) => handleVATChange("taxLocCd", e.target.value)}
              />
              <FormInput
                type="checkbox"
                label="Default Tax ID"
                checked={vatInformation.dfltTaxIdFl === "Y"}
                onChange={(e) =>
                  handleVATChange("dfltTaxIdFl", e.target.checked ? "Y" : "N")
                }
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const Notes = ({ formData, onClose, loading }) => {
  // 1. Initial State & Logic Helpers
  // Standardizing ID access for customer context
  const custId = formData?.customer?.custId || formData?.vendor?.custId;
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const initialNotesState = {
    custId: custId || "",
    companyId: companyId,
    notesTx: "",
    modifiedBy: user.name || "System",
  };

  const [notesData, setNotesData] = useState(initialNotesState);

  // 2. Data Fetching
  const fetchNotes = async () => {
    if (!custId) return;
    try {
      // Endpoint from image_6fc1b6.png: /api/CustNotes/{custId}/{companyId}
      const response = await axios.get(
        `${backendUrl}/api/CustNotes/${custId}/${companyId}`,
      );

      if (response.data) {
        setNotesData(response.data);
        setOriginalData(response.data);
        setIsDirty(false);
      } else {
        setNotesData(initialNotesState);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      // If 404, just initialize empty state
      setNotesData(initialNotesState);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [custId]);

  // 3. Handlers
  const handleLocalChange = (value) => {
    setNotesData((prev) => ({
      ...prev,
      notesTx: value,
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!custId) {
      toast.error("No Customer ID associated.");
      return;
    }

    const payload = {
      ...notesData,
      custId: custId,
      companyId: companyId,
      modifiedBy: user.name || "System",
      timeStamp: new Date().toISOString(),
    };

    try {
      // If we have originalData, we use PUT, otherwise POST
      const isUpdate = !!originalData;
      const url = isUpdate
        ? `${backendUrl}/api/CustNotes/${custId}/${companyId}`
        : `${backendUrl}/api/CustNotes`;

      const response = isUpdate
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Notes saved successfully!");
        setOriginalData(payload);
        setIsDirty(false);
        fetchNotes();
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error saving notes.");
    }
  };

  const handleClear = () => {
    if (!isDirty && !clipboard) {
      toast.info("No changes to clear.");
      return;
    }

    if (window.confirm("Discard all unsaved changes?")) {
      setNotesData(originalData || initialNotesState);
      setIsDirty(false);
      setClipboard(null);
      toast.info("Changes discarded.");
    }
  };

  const handleDelete = async () => {
    if (!originalData) return;
    if (!window.confirm("Delete these notes permanently?")) return;

    try {
      // Endpoint from image_6fc1b6.png: /api/CustNotes/{custId}/{companyId}
      const delUrl = `${backendUrl}/api/CustNotes/${custId}/${companyId}`;
      await axios.delete(delUrl);
      toast.success("Notes deleted.");
      setNotesData(initialNotesState);
      setOriginalData(null);
      setIsDirty(false);
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete failed.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setNotesData(initialNotesState);
      setIsDirty(true);
      toast.info("Ready for new notes.");
    },
    onDelete: handleDelete,
    onCopy: () => {
      setClipboard(notesData.notesTx);
      toast.success("Notes text copied.");
    },
    onPaste: () => {
      if (clipboard) {
        handleLocalChange(clipboard);
        toast.success("Notes text pasted.");
      }
    },
    onSave: handleSave,
    onClear: handleClear,
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Customer Notes" handleClose={onClose}>
        <Toolbar
          isFormView={isFormView}
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
        />
        <div className="mt-2 p-2">
          <FormSection>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg text-sm focus:border-[#17414d] focus:ring-1 focus:ring-[#17414d] outline-none transition-all resize-none"
              value={notesData.notesTx || ""}
              onChange={(e) => handleLocalChange(e.target.value)}
              placeholder="Enter customer notes here..."
            />
            <div className="mt-1 text-right text-[10px] text-gray-500">
              Last modified by: {notesData.modifiedBy || "N/A"}
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const DefaultsAccts = ({ formData, onClose, loading }) => {
  const [clipboard, setClipboard] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isFormView, setIsFormView] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  // Options State
  const [projectOpt, setProjectOpt] = useState([]);
  const [acctOpt, setAcctOpt] = useState([]);
  const [orgOpt, setOrgOpt] = useState([]);
  const [ref1Opt, setRef1Opt] = useState([]);
  const [ref2Opt, setRef2Opt] = useState([]);
  const [transTypeOpt, setTransTypeOpt] = useState([]);
  const [bankAbbrOpt, setBankAbbrOpt] = useState([]);

  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const custId = formData?.customer?.custId || formData?.custId;
  const companyId = user.companyId || "1";

  const initialDefaultsState = {
    custId: custId || "",
    sCustTrnType: "",
    companyId: companyId,
    acctId: "",
    orgId: "",
    ref1Id: "",
    ref2Id: "",
    projId: "",
    bankAcctAbbrv: "",
    modifiedBy: user.name || "Admin",
  };

  const [defaultsInfo, setDefaultsInfo] = useState(initialDefaultsState);

  // 1. Fetch Static Options
  useEffect(() => {
    const fetchAllOptions = async () => {
      try {
        const [proj, org, ref1, ref2, trans, banks] = await Promise.all([
          axios.get(`${backendUrl}/api/Project/GetAllProjects`),
          axios.get(`${backendUrl}/api/Organization/GetAllOrgs`),
          axios.get(`${backendUrl}/api/RefStruc/1`), // Adjust IDs as per your API
          axios.get(`${backendUrl}/api/RefStruc/2`),
          axios.get(`${backendUrl}/api/CustTrnType`), // Assuming this exists for dropdown
          axios.get(`${backendUrl}/api/Bank/Abbreviations`),
        ]);
        setProjectOpt(proj.data || []);
        setOrgOpt(org.data || []);
        setRef1Opt(ref1.data || []);
        setRef2Opt(ref2.data || []);
        setTransTypeOpt(trans.data || []);
        setBankAbbrOpt(banks.data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchAllOptions();
  }, []);

  // 2. Fetch Existing Mapping
  const fetchDefaultsMapping = async (trnType) => {
    if (!custId || !trnType) return;
    try {
      // URL from image_6f6bd4.png: /api/CustDfltAcct/{custId}/{trnType}/{companyId}
      const response = await axios.get(
        `${backendUrl}/api/CustDfltAcct/${custId}/${trnType}/${companyId}`,
      );
      if (response.data) {
        setDefaultsInfo(response.data);
        setOriginalData(response.data);
        setIsDirty(false);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      // If not found, reset fields but keep the selected Transaction Type
      setDefaultsInfo({ ...initialDefaultsState, sCustTrnType: trnType });
      setOriginalData(null);
    }
  };

  const handleFieldChange = (field, value) => {
    setDefaultsInfo((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // If the Transaction Type changes, attempt to fetch existing settings for that type
    if (field === "sCustTrnType") {
      fetchDefaultsMapping(value);
    }
  };

  const handleSave = async () => {
    if (!custId || !defaultsInfo.sCustTrnType) {
      toast.error("Customer ID and Transaction Type are required.");
      return;
    }

    const payload = {
      ...defaultsInfo,
      custId,
      companyId,
      modifiedBy: user.name,
      timeStamp: new Date().toISOString(),
    };

    try {
      // Check if we are updating (based on whether we fetched originalData earlier)
      const isUpdate = !!originalData;
      const url = isUpdate
        ? `${backendUrl}/api/CustDfltAcct/${custId}/${defaultsInfo.sCustTrnType}/${companyId}`
        : `${backendUrl}/api/CustDfltAcct`;

      const response = isUpdate
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Account defaults saved successfully!");
        setOriginalData(payload);
        setIsDirty(false);
      }
    } catch (error) {
      toast.error("Error saving account defaults.");
    }
  };

  const toolbarActions = {
    onAdd: () => {
      setDefaultsInfo(initialDefaultsState);
      setOriginalData(null);
      setIsDirty(true);
    },
    onDelete: async () => {
      if (!originalData) return;
      if (window.confirm("Delete this transaction default?")) {
        try {
          await axios.delete(
            `${backendUrl}/api/CustDfltAcct/${custId}/${defaultsInfo.sCustTrnType}/${companyId}`,
          );
          setDefaultsInfo(initialDefaultsState);
          setOriginalData(null);
          toast.success("Deleted successfully.");
        } catch (error) {
          toast.error("Delete failed.");
        }
      }
    },
    onCopy: () => {
      setClipboard({ ...defaultsInfo });
      toast.info("Copied settings.");
    },
    onPaste: () => {
      if (clipboard) {
        setDefaultsInfo({
          ...clipboard,
          sCustTrnType: defaultsInfo.sCustTrnType,
        });
        setIsDirty(true);
      }
    },
    onSave: handleSave,
    onClear: () => {
      if (window.confirm("Discard changes?")) {
        setDefaultsInfo(originalData || initialDefaultsState);
        setIsDirty(false);
      }
    },
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <MainContainer title="Customer Default Accounts" handleClose={onClose}>
        <Toolbar
          isDirty={isDirty}
          loading={loading}
          actions={toolbarActions}
          isFormView={isFormView}
        />
        <div className="mt-2 p-2">
          <FormSection>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
              <FormSearchSelect
                label="Transaction Type"
                options={transTypeOpt}
                value={defaultsInfo.sCustTrnType}
                displayKey="id"
                onSelect={(val) => handleFieldChange("sCustTrnType", val.id)}
              />

              <FormSearchSelect
                label="Bank Abbreviation"
                options={bankAbbrOpt}
                value={defaultsInfo.bankAcctAbbrv}
                displayKey="id"
                onSelect={(val) => handleFieldChange("bankAcctAbbrv", val.id)}
              />

              <FormSearchSelect
                label="Project"
                options={projectOpt}
                value={defaultsInfo.projId}
                displayKey="id"
                onSelect={(val) => handleFieldChange("projId", val.id)}
              />

              <FormSearchSelect
                label="Account"
                options={acctOpt}
                value={defaultsInfo.acctId}
                displayKey="id"
                onSelect={(val) => handleFieldChange("acctId", val.id)}
              />

              <FormSearchSelect
                label="Organization"
                options={orgOpt}
                value={defaultsInfo.orgId}
                displayKey="id"
                onSelect={(val) => handleFieldChange("orgId", val.id)}
              />

              <FormSearchSelect
                label="Ref No 1"
                options={ref1Opt}
                value={defaultsInfo.ref1Id}
                displayKey="id"
                onSelect={(val) => handleFieldChange("ref1Id", val.id)}
              />

              <FormSearchSelect
                label="Ref No 2"
                options={ref2Opt}
                value={defaultsInfo.ref2Id}
                displayKey="id"
                onSelect={(val) => handleFieldChange("ref2Id", val.id)}
              />
            </div>
          </FormSection>
        </div>
      </MainContainer>
    </div>
  );
};

export const UserDefinedInfo = ({
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
      <MainContainer title="User-Defined Info" handleClose={onClose}>
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

export const AddressesC = ({
  formData,
  handleInputChange,
  onClose,
  isFormView,
  isDirty,
  loading,
  actions,
  // toolbarActions,
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
          // actions={toolbarActions}
          currentIndex={0}
          totalRecords={1}
          actions={actions}
        />

        {/* Bottom Section: Detail Form */}
        <FormSection>
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <FormInput
                label="Address Code"
                required
                value={address.addrCode || ""}
                onChange={(e) =>
                  handleAddressChange("addrCode", e.target.value)
                }
              />

              <FormSearchSelect
                label="Bill Code"
                options={["Select", "D", "Y", "N"]}
                //city list
                onSelect={(val) => handleAddressChange("cityName", val.name)}
                displayKey="name"
              />
              <FormSearchSelect
                label="Ship To"
                options={["Select", "D", "Y", "N"]}
                //city list
                onSelect={(val) => handleAddressChange("cityName", val.name)}
                displayKey="name"
              />
              <FormSearchSelect
                label="Mark For"
                options={["Select", "D", "Y", "N"]}
                onSelect={(val) => handleAddressChange("cityName", val.name)}
                displayKey="name"
              />
              <FormInput
                label="Phone "
                type="number"
                value={address.phoneNumber || ""}
                onChange={(e) =>
                  handleAddressChange("phoneNumber", e.target.value)
                }
              />
              <FormInput
                label="Fax "
                type="number"
                value={address.faxNo || ""}
                onChange={(e) => handleAddressChange("faxNo", e.target.value)}
              />
              <FormInput
                label="Other Number"
                type="number"
                value={formData.address1}
                onChange={(e) =>
                  handleAddressChange("address1", e.target.value)
                }
              />
              <FormInput
                label="Address Line 1"
                value={address.addressLine1 || ""}
                onChange={(e) =>
                  handleAddressChange("addressLine1", e.target.value)
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
                label="Address Line 3"
                value={address.addressLine3 || ""}
                onChange={(e) =>
                  handleAddressChange("addressLine3", e.target.value)
                }
              />
              <FormInput
                label="Email Address"
                type="email"
                className="w-full"
                value={address.emailId || ""}
                onChange={(e) => handleAddressChange("emailId", e.target.value)}
              />

              <FormSearchSelect
                label="City"
                options={[]}
                //city list
                onSelect={(val) => handleAddressChange("cityName", val.name)}
                displayKey="name"
              />
              <FormSearchSelect
                label="State/Province"
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
              <FormSearchSelect
                label="Tax Code"
                options={[]}
                //code list
                onSelect={(val) => handleAddressChange("postalCode", val.name)}
                displayKey="name"
              />
              <FormInput
                label="Tax Code Description"
                value={formData.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
              />
              <FormInput
                label="Tax Exemption ID"
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
              <FormInput
                label="Ship ID"
                value={formData.fax}
                onChange={(e) => handleAddressChange("fax", e.target.value)}
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
                label="Ship Id Description"
                value={formData.ueiNo}
                onChange={(e) => handleAddressChange("ueiNo", e.target.value)}
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {/* Row 1: Phone & Fax */}
                  <FormInput
                    label="Contact ID"
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
                    label="Contact Title"
                    type="text"
                    value={formData.fax || ""}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />

                  <FormInput
                    label="Phone "
                    type="number"
                    value={
                      formData.addresses?.[0]?.contacts?.[0]?.phoneNumber || ""
                    }
                    onChange={(e) =>
                      handleContactChange("phoneNumber", e.target.value)
                    }
                  />
                  <FormInput
                    label="Fax "
                    type="number"
                    value={formData.fax || ""}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />
                  <FormInput
                    label="Other Phone"
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
                      label="Comments"
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
      </MainContainer>
    </div>
  );
};

export const CustomerContactModal = ({ custId, addrDc, onClose }) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const companyId = user.companyId || "1";

  const initialContactState = {
    custId: custId,
    addrDc: addrDc,
    cntactId: "", // This is the Contact ID/Sequence
    companyId: companyId,
    cntactFirstName: "",
    cntactLastName: "",
    phoneId: "",
    cntactTitleName: "",
    notes: "",
    emailId: "",
  };

  const [contactData, setContactData] = useState(initialContactState);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // 1. Fetch contact if editing an existing one
  const fetchContactDetails = async (id) => {
    try {
      // URL pattern from image: /api/CustAddrCntact/{custId}/{addrDc}/{cntactId}/{companyId}
      const res = await axios.get(
        `${backendUrl}/api/CustAddrCntact/${custId}/${addrDc}/${id}/${companyId}`,
      );
      if (res.data) {
        setContactData(res.data);
        setOriginalData(res.data);
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
    }
  };

  const handleChange = (field, value) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!contactData.cntactId) {
      toast.error("Contact ID is required.");
      return;
    }

    try {
      // If originalData exists, it's a PUT (Update), otherwise POST (Create)
      const isUpdate = !!originalData;
      const url = isUpdate
        ? `${backendUrl}/api/CustAddrCntact/${custId}/${addrDc}/${contactData.cntactId}/${companyId}`
        : `${backendUrl}/api/CustAddrCntact`;

      const response = isUpdate
        ? await axios.put(url, contactData)
        : await axios.post(url, contactData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Contact saved successfully!");
        setOriginalData(contactData);
        setIsDirty(false);
      }
    } catch (error) {
      toast.error("Failed to save contact.");
      console.error(error);
    }
  };

  return (
    <MainContainer
      title={`Contacts for Address: ${addrDc}`}
      handleClose={onClose}
    >
      <Toolbar
        isDirty={isDirty}
        actions={{
          onSave: handleSave,
          onClear: () => {
            setContactData(originalData || initialContactState);
            setIsDirty(false);
          },
          onDelete: async () => {
            if (window.confirm("Delete contact?")) {
              await axios.delete(
                `${backendUrl}/api/CustAddrCntact/${custId}/${addrDc}/${contactData.cntactId}/${companyId}`,
              );
              onClose();
            }
          },
        }}
      />

      <FormSection title="Contact Information">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
          <FormInput
            label="Contact ID"
            value={contactData.cntactId}
            onChange={(e) => handleChange("cntactId", e.target.value)}
            disabled={!!originalData} // ID usually shouldn't change on update
          />
          <FormInput
            label="Contact Title"
            value={contactData.cntactTitleName}
            onChange={(e) => handleChange("cntactTitleName", e.target.value)}
          />
          <FormInput
            label="First Name"
            value={contactData.cntactFirstName}
            onChange={(e) => handleChange("cntactFirstName", e.target.value)}
          />
          <FormInput
            label="Last Name"
            value={contactData.cntactLastName}
            onChange={(e) => handleChange("cntactLastName", e.target.value)}
          />
          <FormInput
            label="Phone Number"
            type="tel"
            value={contactData.phoneId}
            onChange={(e) => handleChange("phoneId", e.target.value)}
          />
          {/* <FormInput
              label="Fax"
              type="tel"
              value={contactData.phoneId}
              onChange={(e) => handleChange("phoneId", e.target.value)}
            />
            <FormInput
              label="Other Number"
              type="tel"
              value={contactData.phoneId}
              onChange={(e) => handleChange("phoneId", e.target.value)}
            /> */}
          <FormInput
            label="Phone Number"
            type="tel"
            value={contactData.phoneId}
            onChange={(e) => handleChange("phoneId", e.target.value)}
          />
          <FormInput
            label="E-mail Address"
            type="email"
            value={contactData.emailId}
            onChange={(e) => handleChange("emailId", e.target.value)}
          />
          <div className="col-span-2">
            <FormInput
              label="Comments/Notes"
              value={contactData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>
      </FormSection>
    </MainContainer>
  );
};
